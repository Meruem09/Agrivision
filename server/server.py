import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import rasterio
from rasterio.mask import mask
from rasterio.warp import reproject, Resampling
from shapely.geometry import Polygon, mapping
from shapely.ops import transform
from pyproj import Transformer
from pystac_client import Client
import planetary_computer as pc

app = Flask(__name__)
CORS(app)

import pandas as pd

# ── Load ML models ────────────────────────────────────────────────────────────
crop_health_model = joblib.load(r"model/crop_health_model.pkl")
crop_scaler       = joblib.load(r"model/scaler.pkl")

STAC_URL = "https://planetarycomputer.microsoft.com/api/stac/v1"

# Feature order that matches training in data_clean.py
CROP_HEALTH_FEATURES = [
    'NDVI', 'SAVI', 'Chlorophyll_Content', 'Leaf_Area_Index',
    'Temperature', 'Humidity', 'Vapor_Pressure_Deficit',
    'Soil_Moisture', 'Soil_pH', 'Rainfall', 'Crop_Stress_Indicator',
    'Crop_Maize', 'Crop_Rice', 'Crop_Wheat'
]


def classify_zone(ndvi, evi, ndwi, msi, green, nir, red):
    if evi<0.4 and green<0.1 and red<0.1:
        return "Bare soil", "Exposed soil or recently harvested field"
    if ndvi < 0.35 and msi > 1.5:
        return "Vegetation", "Sparse vegetation"
    
    if ndvi < 0.35:
        if msi > 1.5:
            return "Vegetation", "Sparse vegetation with high water stress"
        elif ndwi < -0.2:
            return "Vegetation", "Sparse vegetation with moisture deficiency"
        else:
            return "Vegetation", "Early growth stage or sparse vegetation"

    if ndvi < 0.55:
        if msi > 1.8:
            return "Vegetation", "Moderate vegetation with severe water stress"
        elif ndwi < -0.2:
            return "Vegetation", "Moderate vegetation with moisture stress"
        elif evi < ndvi:
            return "Vegetation", "Moderate vegetation with soil background influence"
        else:
            return "Vegetation", "Moderate and stable vegetation health"

    if msi > 1.5:
        return "Vegetation", "Dense vegetation under emerging water stress"
    elif ndwi < -0.1:
        return "Vegetation", "Healthy canopy with declining moisture"
    else:
        return "Vegetation", "Healthy and dense vegetation"


def compute_indices(bands, polygon):
    arrays = {}

    with rasterio.open(bands["B08"]) as ref_src:
        transformer = Transformer.from_crs("EPSG:4326", ref_src.crs, always_xy=True)
        projected_polygon = transform(transformer.transform, polygon)
        ref_img, ref_transform = mask(ref_src, [mapping(projected_polygon)], crop=True)
        ref = ref_img.astype("float32") / 10000.0
        ref_crs = ref_src.crs
        ref_shape = ref.shape
        arrays["B08"] = ref

    for band in ["B02", "B03", "B04", "B11"]:
        with rasterio.open(bands[band]) as src:
            transformer = Transformer.from_crs("EPSG:4326", src.crs, always_xy=True)
            projected_polygon = transform(transformer.transform, polygon)
            img, src_transform = mask(src, [mapping(projected_polygon)], crop=True)
            data = img.astype("float32")
            resampled = np.zeros(ref_shape, dtype="float32")

            reproject(
                source=data,
                destination=resampled,
                src_transform=src_transform,
                src_crs=src.crs,
                dst_transform=ref_transform,
                dst_crs=ref_crs,
                resampling=Resampling.bilinear,
            )

            arrays[band] = resampled / 10000.0

    nir = arrays["B08"]
    red = arrays["B04"]
    green = arrays["B03"]
    blue = arrays["B02"]
    swir = arrays["B11"]

    ndvi = (nir - red) / (nir + red + 1e-6)
    evi  = 2.5 * (nir - red) / (nir + 6 * red - 7.5 * blue + 1)
    ndwi = (green - nir) / (green + nir + 1e-6)
    savi = ((nir - red) / (nir + red + 0.5)) * 1.5   # Soil Adjusted Vegetation Index

    valid_mask = (nir > 0.1) & (swir > 0.01)
    msi = np.where(valid_mask, swir / nir, np.nan)

    return {
        "NDVI": float(np.nanmean(ndvi)),
        "SAVI": float(np.nanmean(savi)),
        "EVI":  float(np.nanmean(evi)),
        "NDWI": float(np.nanmean(ndwi)),
        "MSI":  float(np.nanmean(msi)),
        "RED":  float(np.nanmean(red)),
        "GREEN":float(np.nanmean(green)),
        "NIR":  float(np.nanmean(nir)),
    }
    
def predict_crop_health(indices, crop_type, field_data=None):
    """
    Predict crop health (Healthy / Unhealthy) using crop_health_model.pkl.

    Satellite-derived:  NDVI, SAVI
    Estimated from sat: Chlorophyll_Content, Leaf_Area_Index, Crop_Stress_Indicator
    Optional (from request body > 'field_data'):
        temp, humidity, soil_moisture, soil_ph, rainfall
    """
    fd = field_data or {}

    # ── Weather / soil params (user-supplied or defaults) ──────────────────
    temp          = fd.get("temperature",  28.0)
    humidity      = fd.get("humidity",     65.0)
    soil_moisture = fd.get("soil_moisture", 0.35)
    soil_ph       = fd.get("soil_ph",       6.5)
    rainfall      = fd.get("rainfall",     30.0)

    ndvi = indices["NDVI"]
    savi = indices["SAVI"]
    msi  = indices["MSI"] if not (indices["MSI"] != indices["MSI"]) else 1.0  # NaN → 1.0

    # ── Estimates derived from satellite indices ───────────────────────────
    chlorophyll_content = max(0.0, ndvi * 1.8)          # rough proxy
    leaf_area_index     = max(0.0, ndvi * 5.5)          # typical LAI-NDVI relationship
    # Crop stress 0-100: higher MSI = more stress, lower NDWI = more stress
    crop_stress = int(min(100, max(0,
        (msi - 0.5) * 30 + (1 - indices["NDWI"]) * 20
    )))

    # ── VPD from temp + humidity ───────────────────────────────────────────
    es  = 0.6108 * (17.27 * temp) / (temp + 237.3)
    vpd = max(0.0, es - (humidity / 100) * es)

    # ── One-hot crop type ──────────────────────────────────────────────────
    crop_lower = crop_type.lower() if crop_type else "wheat"
    is_maize = 1 if crop_lower == "maize" else 0
    is_rice  = 1 if crop_lower == "rice"  else 0
    is_wheat = 1 if crop_lower == "wheat" else 0

    row = pd.DataFrame([{
        'NDVI': ndvi, 'SAVI': savi,
        'Chlorophyll_Content': chlorophyll_content,
        'Leaf_Area_Index': leaf_area_index,
        'Temperature': temp, 'Humidity': humidity,
        'Vapor_Pressure_Deficit': vpd,
        'Soil_Moisture': soil_moisture, 'Soil_pH': soil_ph,
        'Rainfall': rainfall,
        'Crop_Stress_Indicator': crop_stress,
        'Crop_Maize': is_maize, 'Crop_Rice': is_rice, 'Crop_Wheat': is_wheat,
    }], columns=CROP_HEALTH_FEATURES)

    scaled = crop_scaler.transform(row)
    pred   = crop_health_model.predict(scaled)[0]
    prob   = crop_health_model.predict_proba(scaled)[0]

    label  = "Healthy" if pred == 1 else "Unhealthy"

    return {
        "prediction":       label,
        "confidence":       float(round(max(prob), 3)),
        "healthy_prob":     float(round(prob[1], 3)),
        "unhealthy_prob":   float(round(prob[0], 3)),
        "estimated_inputs": {
            "savi": round(savi, 4),
            "chlorophyll_content": round(chlorophyll_content, 4),
            "leaf_area_index":     round(leaf_area_index, 4),
            "crop_stress_indicator": crop_stress,
            "vpd": round(vpd, 4),
        }
    }


@app.route("/analyze-farm", methods=["POST"])
def analyze_farm():
    try:
        data = request.get_json()
        coords = data["coordinates"][0]
        polygon = Polygon(coords)

        catalog = Client.open(STAC_URL)
        search = catalog.search(
            collections=["sentinel-2-l2a"],
            intersects=mapping(polygon),
            query={"eo:cloud_cover": {"lt": 20}},
        )

        items = list(search.get_items())
        if not items:
            return jsonify({"error": "No satellite data found"}), 404

        item = pc.sign(items[0])

        bands = {
            "B02": item.assets["B02"].href,
            "B03": item.assets["B03"].href,
            "B04": item.assets["B04"].href,
            "B08": item.assets["B08"].href,
            "B11": item.assets["B11"].href,
        }

        crop_type  = data.get("crop_type", "wheat")
        field_data = data.get("field_data", {})   # optional: temp, humidity, soil_moisture, soil_ph, rainfall

        indices = compute_indices(bands, polygon)

        crop_health_result = predict_crop_health(indices, crop_type, field_data)

        zone_type, health_status = classify_zone(
            indices["NDVI"],
            indices["EVI"],
            indices["NDWI"],
            indices["MSI"],
            indices["GREEN"],
            indices["NIR"],
            indices["RED"]
        )

        return jsonify({
            "indices":      {k: round(v, 4) for k, v in indices.items()},
            "zone_type":    zone_type,
            "health_status": health_status,
            "crop_health":   crop_health_result,   # ← NEW: ML-based crop health prediction
        })

    except Exception as e:
        import traceback
        traceback.print_exc()  # prints full traceback to console
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
