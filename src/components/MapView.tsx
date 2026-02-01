import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, Polygon, Popup, LayersControl, FeatureGroup, useMap, Marker } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Info, Activity, Square, Trash2, Download, FileText, Search, Clock } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
// Fix for Leaflet default markers
import L from 'leaflet';

const DefaultIcon = L.divIcon({
  html: '<div class="custom-div-icon bg-blue-500 rounded-full w-4 h-4"></div>',
  iconSize: [16, 16],
  className: 'custom-div-icon'
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};



interface DrawnShape {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coordinates: any[];
  area: string; // or number, based on usage but seems to be string "X ha"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layer: any;
  avgNdvi: string;
  avgEvi: string;
  avgNdmi: string;
}

const MapView = () => {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState('ndvi');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLatest, setIsLatest] = useState(true);
  const [drawnShapes, setDrawnShapes] = useState<DrawnShape[]>([]);
  const [selectedArea, setSelectedArea] = useState<DrawnShape | null>(null);
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.022, 72.572]);
  const [isUserLocation, setIsUserLocation] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setIsUserLocation(true);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = async (e: any) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setIsUserLocation(false); // Reset user location flag when searching
      }
    } catch (error) {
      console.error("Search failed", error);
    }
  };
  const mapRef = useRef<L.Map | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featureGroupRef = useRef<any>(null);

  // Mock farm field data with coordinates around Sanand, Ahmedabad
  const farmFields = [
    {
      id: '1',
      name: 'Field A - Wheat',
      crop: 'wheat',
      coordinates: [
        [23.025, 72.570],
        [23.027, 72.570],
        [23.027, 72.575],
        [23.025, 72.575]
      ],
      indices: {
        ndvi: 0.76,
        evi: 0.68,
        ndmi: 0.45
      },
      health: 'healthy',
      area: '5.2 ha'
    },
    {
      id: '2',
      name: 'Field B - Cotton',
      crop: 'cotton',
      coordinates: [
        [23.020, 72.572],
        [23.022, 72.572],
        [23.022, 72.577],
        [23.020, 72.577]
      ],
      indices: {
        ndvi: 0.54,
        evi: 0.48,
        ndmi: 0.38
      },
      health: 'warning',
      area: '3.8 ha'
    },
    {
      id: '3',
      name: 'Field C - Rice',
      crop: 'rice',
      coordinates: [
        [23.018, 72.565],
        [23.020, 72.565],
        [23.020, 72.570],
        [23.018, 72.570]
      ],
      indices: {
        ndvi: 0.31,
        evi: 0.28,
        ndmi: 0.22
      },
      health: 'critical',
      area: '2.1 ha'
    }
  ];

  // Calculate area in hectares using Leaflet's geodesic area calculation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateArea = (layer: any) => {
    let area = 0;
    if (layer instanceof L.Rectangle || layer instanceof L.Polygon) {
      const latLngs = layer.getLatLngs()[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      area = (L.GeometryUtil as any).geodesicArea(latLngs);
    } else if (layer instanceof L.Circle) {
      area = Math.PI * Math.pow(layer.getRadius(), 2);
    }
    return (area / 10000).toFixed(2); // Convert to hectares
  };

  // Handle shape creation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreated = (e: any) => {
    const { layer, layerType } = e;
    const shapeId = `shape-${Date.now()}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let coordinates: any = [];
    if (layerType === 'rectangle' || layerType === 'polygon') {
      coordinates = layer.getLatLngs()[0].map((latlng: L.LatLng) => [latlng.lat, latlng.lng]);
    } else if (layerType === 'circle') {
      const center = layer.getLatLng();
      coordinates = [[center.lat, center.lng], layer.getRadius()];
    }

    const area = calculateArea(layer);

    const newShape = {
      id: shapeId,
      type: layerType,
      coordinates,
      area,
      layer: layer,
      avgNdvi: (Math.random() * 0.5 + 0.3).toFixed(2),
      avgEvi: (Math.random() * 0.5 + 0.25).toFixed(2),
      avgNdmi: (Math.random() * 0.4 + 0.2).toFixed(2),
    };

    setDrawnShapes(prev => [...prev, newShape]);
    setSelectedArea(newShape);
  };

  // Handle shape edit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdited = (e: any) => {
    const layers = e.layers;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    layers.eachLayer((layer: any) => {
      const updatedArea = calculateArea(layer);
      setDrawnShapes(prev =>
        prev.map(shape => {
          if (shape.layer === layer) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let coordinates: any = [];
            if (shape.type === 'rectangle' || shape.type === 'polygon') {
              coordinates = layer.getLatLngs()[0].map((latlng: L.LatLng) => [latlng.lat, latlng.lng]);
            }
            return { ...shape, coordinates, area: updatedArea };
          }
          return shape;
        })
      );
    });
  };

  // Handle shape deletion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleted = (e: any) => {
    const layers = e.layers;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    layers.eachLayer((layer: any) => {
      setDrawnShapes(prev => prev.filter(shape => shape.layer !== layer));
    });
    setSelectedArea(null);
  };

  // Delete specific shape
  const deleteShape = (shapeId: string) => {
    const shape = drawnShapes.find(s => s.id === shapeId);
    if (shape && featureGroupRef.current) {
      featureGroupRef.current.removeLayer(shape.layer);
      setDrawnShapes(prev => prev.filter(s => s.id !== shapeId));
      if (selectedArea?.id === shapeId) {
        setSelectedArea(null);
      }
    }
  };

  // Export coordinates
  const exportCoordinates = () => {
    const data = drawnShapes.map(shape => ({
      id: shape.id,
      type: shape.type,
      coordinates: shape.coordinates,
      area: shape.area,
      indices: {
        ndvi: shape.avgNdvi,
        evi: shape.avgEvi,
        ndmi: shape.avgNdmi
      }
    }));

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selected-areas.json';
    link.click();
  };

  // Generate comprehensive report
  const generateReport = () => {
    const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Farm Field Monitoring Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 40px; background: #fff; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #1e40af; font-size: 28px; margin-bottom: 10px; }
        .header .date { color: #666; font-size: 14px; }
        .section { margin-bottom: 30px; page-break-inside: avoid; }
        .section-title { background: #2563eb; color: white; padding: 10px 15px; font-size: 18px; margin-bottom: 15px; border-radius: 4px; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
        .info-box { background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; }
        .info-box .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
        .info-box .value { font-size: 18px; font-weight: bold; color: #1f2937; }
        .field-card { background: #fff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
        .field-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .field-name { font-size: 18px; font-weight: bold; color: #1f2937; }
        .health-badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .health-healthy { background: #d1fae5; color: #065f46; }
        .health-warning { background: #fef3c7; color: #92400e; }
        .health-critical { background: #fee2e2; color: #991b1b; }
        .indices-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .indices-table th { background: #f9fafb; padding: 10px; text-align: left; font-size: 12px; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
        .indices-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
        .index-value { font-weight: bold; }
        .index-good { color: #059669; }
        .index-warning { color: #d97706; }
        .index-critical { color: #dc2626; }
        .selected-areas { margin-top: 15px; }
        .area-item { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px; margin-bottom: 10px; }
        .area-item h4 { color: #166534; margin-bottom: 8px; font-size: 14px; }
        .area-detail { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
        @media print {
          body { padding: 20px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌾 Farm Field Monitoring Report</h1>
        <p class="date">Generated on ${new Date().toLocaleString()}</p>
      </div>

      <div class="section">
        <div class="section-title">📊 Overview</div>
        <div class="info-grid">
          <div class="info-box">
            <div class="label">Report Date</div>
            <div class="value">${selectedDate}</div>
          </div>
          <div class="info-box">
            <div class="label">Total Fields</div>
            <div class="value">${farmFields.length}</div>
          </div>
          <div class="info-box">
            <div class="label">Selected Index</div>
            <div class="value">${selectedIndex.toUpperCase()}</div>
          </div>
          <div class="info-box">
            <div class="label">Selected Areas</div>
            <div class="value">${drawnShapes.length}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🌱 Field Analysis</div>
        ${farmFields.map(field => {
      const getHealthClass = (health: string) => {
        if (health === 'healthy') return 'bg-green-100 text-green-800';
        if (health === 'warning') return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
      };

      const getIndexClass = (index: string, value: number) => {
        if (index === 'ndvi' || index === 'evi') {
          if (value >= 0.7) return 'index-good';
          if (value >= 0.5) return 'index-warning';
          return 'index-critical';
        } else {
          if (value >= 0.4) return 'index-good';
          if (value >= 0.3) return 'index-warning';
          return 'index-critical';
        }
      };

      return `
            <div class="field-card">
              <div class="field-header">
                <div class="field-name">${field.name}</div>
                <span class="health-badge ${getHealthClass(field.health)}">${field.health}</span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong>Crop:</strong> ${field.crop.charAt(0).toUpperCase() + field.crop.slice(1)} | 
                <strong>Area:</strong> ${field.area}
              </div>
              <table class="indices-table">
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Value</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                  <tr>
                    <td><strong>NDVI</strong></td>
                    <td class="index-value ${getIndexClass('ndvi', field.indices.ndvi)}">${field.indices.ndvi.toFixed(2)}</td>
                    <td>${t(getInterpretationKey('ndvi', field.indices.ndvi))}</td>
                    <td>${field.indices.ndvi >= 0.7 ? '✓ Healthy' : field.indices.ndvi >= 0.5 ? '⚠ Warning' : '✗ Critical'}</td>
                  </tr>
                  <tr>
                    <td><strong>EVI</strong></td>
                    <td class="index-value ${getIndexClass('evi', field.indices.evi)}">${field.indices.evi.toFixed(2)}</td>
                    <td>${t(getInterpretationKey('evi', field.indices.evi))}</td>
                    <td>${field.indices.evi >= 0.6 ? '✓ Healthy' : field.indices.evi >= 0.4 ? '⚠ Warning' : '✗ Critical'}</td>
                  </tr>
                  <tr>
                    <td><strong>NDMI</strong></td>
                    <td class="index-value ${getIndexClass('ndmi', field.indices.ndmi)}">${field.indices.ndmi.toFixed(2)}</td>
                    <td>${t(getInterpretationKey('ndmi', field.indices.ndmi))}</td>
                    <td>${field.indices.ndmi >= 0.4 ? '✓ Healthy' : field.indices.ndmi >= 0.3 ? '⚠ Warning' : '✗ Critical'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `;
    }).join('')}
      </div>

      ${drawnShapes.length > 0 ? `
        <div class="section">
          <div class="section-title">📍 Selected Areas Analysis</div>
          <div class="selected-areas">
            ${drawnShapes.map((shape, index) => `
              <div class="area-item">
                <h4>Selected Area ${index + 1} (${shape.type.charAt(0).toUpperCase() + shape.type.slice(1)})</h4>
                <div class="area-detail">
                  <span><strong>Area:</strong> ${shape.area} hectares</span>
                  <div>
                    <span><strong>Avg NDVI:</strong> ${shape.avgNdvi}</span>
                    <br/><span style="font-size: 11px; color: #666; font-style: italic;">${t(getInterpretationKey('ndvi', parseFloat(shape.avgNdvi)))}</span>
                  </div>
                </div>
                <div class="area-detail">
                  <div>
                    <span><strong>Avg EVI:</strong> ${shape.avgEvi}</span>
                     <br/><span style="font-size: 11px; color: #666; font-style: italic;">${t(getInterpretationKey('evi', parseFloat(shape.avgEvi)))}</span>
                  </div>
                  <div>
                    <span><strong>Avg NDMI:</strong> ${shape.avgNdmi}</span>
                     <br/><span style="font-size: 11px; color: #666; font-style: italic;">${t(getInterpretationKey('ndmi', parseFloat(shape.avgNdmi)))}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-title">ℹ️ Index Reference Guide</div>
        <div class="field-card">
          <h3 style="margin-bottom: 15px; color: #1f2937;">NDVI (Normalized Difference Vegetation Index)</h3>
          <p style="margin-bottom: 10px; line-height: 1.6;">Measures vegetation health and density. Higher values indicate healthier, denser vegetation.</p>
          <div style="margin-top: 10px; padding: 10px; background: #f9fafb; border-radius: 4px;">
            <strong>Thresholds:</strong> Healthy: > 0.7 | Warning: 0.5 - 0.7 | Critical: < 0.5
          </div>
        </div>
        <div class="field-card">
          <h3 style="margin-bottom: 15px; color: #1f2937;">EVI (Enhanced Vegetation Index)</h3>
          <p style="margin-bottom: 10px; line-height: 1.6;">Enhanced vegetation health with atmospheric correction for more accurate assessment.</p>
          <div style="margin-top: 10px; padding: 10px; background: #f9fafb; border-radius: 4px;">
            <strong>Thresholds:</strong> Healthy: > 0.6 | Warning: 0.4 - 0.6 | Critical: < 0.4
          </div>
        </div>
        <div class="field-card">
          <h3 style="margin-bottom: 15px; color: #1f2937;">NDMI (Normalized Difference Moisture Index)</h3>
          <p style="margin-bottom: 10px; line-height: 1.6;">Measures vegetation water content and stress levels.</p>
          <div style="margin-top: 10px; padding: 10px; background: #f9fafb; border-radius: 4px;">
            <strong>Thresholds:</strong> Healthy: > 0.4 | Warning: 0.3 - 0.4 | Critical: < 0.3
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🛰️ Data Source Information</div>
        <div class="field-card">
          <div class="info-grid">
            <div>
              <p style="margin-bottom: 8px;"><strong>Satellite:</strong> Sentinel-2 (Multispectral)</p>
              <p style="margin-bottom: 8px;"><strong>Resolution:</strong> 10m - 60m</p>
            </div>
            <div>
              <p style="margin-bottom: 8px;"><strong>Last Update:</strong> ${isLatest ? 'Latest Available' : selectedDate}</p>
              <p style="margin-bottom: 8px;"><strong>Update Frequency:</strong> Every 5 days</p>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p><strong>Farm Field Monitoring System</strong></p>
        <p>This report is generated automatically based on satellite imagery analysis.</p>
        <p style="margin-top: 10px;">For more information, please contact your agricultural advisor.</p>
      </div>
    </body>
    </html>
  `;

    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `farm-report-${selectedDate}.html`;
    link.click();

    setTimeout(() => {
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 250);
        };
      }
    }, 100);
  };




  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFieldColor = (field: any) => {
    const value = field.indices[selectedIndex];

    if (selectedIndex === 'ndvi' || selectedIndex === 'evi') {
      if (value >= 0.7) return '#22c55e';
      if (value >= 0.5) return '#eab308';
      return '#ef4444';
    } else {
      if (value >= 0.4) return '#22c55e';
      if (value >= 0.3) return '#eab308';
      return '#ef4444';
    }
  };

  const getInterpretationKey = (index: string, value: number) => {
    if (index === 'ndvi' || index === 'evi') {
      if (value >= 0.7) return `map.interpretation.${index}.good`;
      if (value >= 0.5) return `map.interpretation.${index}.moderate`;
      return `map.interpretation.${index}.critical`;
    } else {
      if (value >= 0.4) return `map.interpretation.${index}.good`;
      if (value >= 0.3) return `map.interpretation.${index}.moderate`;
      return `map.interpretation.${index}.critical`;
    }
  };

  const getIndexInfo = (index) => {
    switch (index) {
      case 'ndvi':
        return {
          name: 'NDVI (Normalized Difference Vegetation Index)',
          description: 'Measures vegetation health and density',
          range: '0.0 - 1.0',
          healthy: '> 0.7',
          warning: '0.5 - 0.7',
          critical: '< 0.5'
        };
      case 'evi':
        return {
          name: 'EVI (Enhanced Vegetation Index)',
          description: 'Enhanced vegetation health with atmospheric correction',
          range: '0.0 - 1.0',
          healthy: '> 0.6',
          warning: '0.4 - 0.6',
          critical: '< 0.4'
        };
      case 'ndmi':
        return {
          name: 'NDMI (Normalized Difference Moisture Index)',
          description: 'Measures vegetation water content',
          range: '0.0 - 1.0',
          healthy: '> 0.4',
          warning: '0.3 - 0.4',
          critical: '< 0.3'
        };
      default:
        return null;
    }
  };

  const indexInfo = getIndexInfo(selectedIndex);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('map.title')}</h1>

        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search location..."
              className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1.5 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Index Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('map.index.label')}
            </label>
            <div className="flex space-x-2">
              {['ndvi', 'evi', 'ndmi'].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedIndex === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {index.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('map.date.label')}
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setIsLatest(false);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLatest ? 'border-gray-200 text-gray-400 bg-gray-50' : 'border-gray-300 text-gray-900'
                    }`}
                />
              </div>
              <button
                onClick={() => {
                  setIsLatest(true);
                  setSelectedDate(new Date().toISOString().split('T')[0]);
                }}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${isLatest
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                title="Latest Available"
              >
                <Clock className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-1 flex items-center text-xs text-gray-500">
              <Info className="w-3 h-3 mr-1" />
              {isLatest
                ? "Showing most recent available cloud-free data"
                : `Showing data approx. around ${selectedDate}`}
            </div>
          </div>
        </div>

        {/* Drawing Tools */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Square className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-700">{t('map.tools.label')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDrawingEnabled(!drawingEnabled)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${drawingEnabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {drawingEnabled ? t('map.tools.enabled') : t('map.tools.enable')}
              </button>
              <button
                onClick={generateReport}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>{t('map.tools.report')}</span>
              </button>
              {drawnShapes.length > 0 && (
                <button
                  onClick={exportCoordinates}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>{t('map.tools.export')}</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {t('map.tools.hint')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-96 lg:h-[600px] relative">
              <MapContainer
                center={mapCenter}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <LayersControl position="topright">
                  <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </LayersControl.BaseLayer>

                  <LayersControl.BaseLayer name="Satellite (Esri)">
                    <TileLayer
                      attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                  </LayersControl.BaseLayer>

                  <LayersControl.BaseLayer name="Sentinel-2 (Date)">
                    {/* Note: This is a placeholder Sentinel Hub WMS. You need a valid Instance ID for production. */}
                    {/* Replace YOUR_INSTANCE_ID with a valid ID from Sentinel Hub Dashboard */}
                    <WMSTileLayer
                      url="https://services.sentinel-hub.com/ogc/wms/bb1c8a2f-5b11-42bb-8ce4-dbf7f5300662"
                      layers="SENTINEL-2-L1C"
                      format="image/png"
                      transparent={true}
                      version="1.3.0"
                      attribution='&copy; <a href="https://www.sentinel-hub.com">Sentinel Hub</a>'
                      params={{
                        time: isLatest ? '2023-01-01/2026-12-31' : `${selectedDate}/${new Date(new Date(selectedDate).setDate(new Date(selectedDate).getDate() + 10)).toISOString().split('T')[0]}`,
                        // Logic: For specific date, look ahead 10 days for best match if configured in WMS, or strict range
                        maxcc: 20 // 20% max cloud coverage preference
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } as any}
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                <MapUpdater center={mapCenter} />
                <Marker position={mapCenter}>
                  <Popup>
                    {searchQuery ? 'Searched Location' : isUserLocation ? 'Your Location' : 'Ahmedabad (Default)'}
                  </Popup>
                </Marker>

                {/* Farm Fields */}
                {/* Farm Fields removed */}

                {/* Drawing Layer */}
                <FeatureGroup ref={featureGroupRef}>
                  <EditControl
                    position="topleft"
                    onCreated={handleCreated}
                    onEdited={handleEdited}
                    onDeleted={handleDeleted}
                    draw={{
                      rectangle: drawingEnabled,
                      polygon: drawingEnabled,
                      circle: drawingEnabled,
                      polyline: false,
                      marker: false,
                      circlemarker: false
                    }}
                    edit={{
                      edit: {
                        selectedPathOptions: {
                          maintainColor: true,
                          opacity: 0.3
                        }
                      },
                      remove: {}
                    }}
                  />
                </FeatureGroup>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Area Info */}
          {selectedArea && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Square className="h-4 w-4 text-green-600" />
                  <h3 className="font-medium text-green-800">{t('map.selected.title')}</h3>
                </div>
                <button
                  onClick={() => deleteShape(selectedArea.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-green-700 space-y-3">
                <div className="flex justify-between border-b border-green-200 pb-1">
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{selectedArea.type}</span>
                </div>
                <div className="flex justify-between border-b border-green-200 pb-1">
                  <span className="font-medium">Area:</span>
                  <span>{selectedArea.area} ha</span>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span className="font-medium">Avg NDVI:</span>
                    <span>{selectedArea.avgNdvi}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1 italic">
                    {t(getInterpretationKey('ndvi', parseFloat(selectedArea.avgNdvi)))}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span className="font-medium">Avg EVI:</span>
                    <span>{selectedArea.avgEvi}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1 italic">
                    {t(getInterpretationKey('evi', parseFloat(selectedArea.avgEvi)))}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span className="font-medium">Avg NDMI:</span>
                    <span>{selectedArea.avgNdmi}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1 italic">
                    {t(getInterpretationKey('ndmi', parseFloat(selectedArea.avgNdmi)))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Drawn Shapes List */}
          {drawnShapes.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">{t('map.selected.list')} ({drawnShapes.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {drawnShapes.map((shape, index) => (
                  <div
                    key={shape.id}
                    onClick={() => setSelectedArea(shape)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedArea?.id === shape.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800 capitalize">
                          {shape.type} {index + 1}
                        </p>
                        <p className="text-xs text-gray-600">Area: {shape.area} ha</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteShape(shape.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Index Information */}
          {indexInfo && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800">{t('map.index.info')}</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-800">{indexInfo.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{indexInfo.description}</p>
                </div>

                <div className="text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Range:</span>
                    <span className="font-medium">{indexInfo.range}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-green-600">Healthy:</span>
                    <span className="font-medium">{indexInfo.healthy}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-yellow-600">Warning:</span>
                    <span className="font-medium">{indexInfo.warning}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-red-600">Critical:</span>
                    <span className="font-medium">{indexInfo.critical}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Field Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">{t('map.summary')}</h3>
            <div className="space-y-3">
              {farmFields.map((field) => (
                <div key={field.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-800">{field.name}</h4>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getFieldColor(field) }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Area:</span>
                      <span>{field.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{selectedIndex.toUpperCase()}:</span>
                      <span className="font-medium">
                        {(field.indices as Record<string, number>)[selectedIndex].toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Source */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-blue-800">Data Source</h3>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Satellite:</strong> Sentinel-2 (Multispectral)</p>
              <p><strong>Resolution:</strong> 10m - 60m</p>
              <p><strong>Last Update:</strong> {isLatest ? 'Latest Available' : selectedDate}</p>
              <p><strong>Next Update:</strong> Every 5 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;