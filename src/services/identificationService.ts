import axios from 'axios';

const API_URL = 'https://crop.kindwise.com/api/v1/identification';
const API_KEY = (import.meta.env.VITE_KINDWISE_API_KEY ?? '').trim();

export interface StructuredDiseaseAnalysis {
    disease: string;
    remedy: string;
    requiredThings: string[];
}

/**
 * Sends image to Kindwise Identification API (single POST) and parses
 * the disease, remedy and required things from the response.
 */
export const detectDisease = async (
    imageBase64: string,
    latitude?: number,
    longitude?: number
): Promise<StructuredDiseaseAnalysis> => {
    if (!API_KEY) {
        throw new Error('VITE_KINDWISE_API_KEY is not defined in environment variables.');
    }

    const body = {
        images: [imageBase64],
        latitude: latitude ?? 49.207,
        longitude: longitude ?? 16.608,
        similar_images: true,
    };

    try {
        const response = await axios.post(API_URL, body, {
            headers: {
                'Api-Key': API_KEY,
                'Content-Type': 'application/json',
            },
        });

        console.log('Kindwise raw response:', JSON.stringify(response.data, null, 2));
        return parseResponse(response.data);
    } catch (error: any) {
        console.error('Kindwise API error:', error?.response?.data || error.message);
        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error.message ||
            'Failed to connect to Kindwise API'
        );
    }
};

/**
 * Parses the raw Kindwise POST response into clean display fields.
 * Handles multiple possible response structures from Kindwise.
 */
const parseResponse = (data: any): StructuredDiseaseAnalysis => {
    const result = data?.result;

    if (!result) {
        return {
            disease: 'No result returned',
            remedy: 'The API did not return any result. Please try with a clearer image.',
            requiredThings: [],
        };
    }

    // Try to find suggestions from different possible locations in the response
    const suggestions: any[] =
        result?.classification?.suggestions ??
        result?.disease?.suggestions ??
        result?.health_assessment?.suggestions ??
        [];

    if (suggestions.length === 0) {
        // Check if the plant is healthy
        const isHealthy = result?.is_plant?.binary ?? result?.health_assessment?.is_healthy?.binary;
        return {
            disease: isHealthy ? 'Plant appears healthy' : 'No disease detected',
            remedy: isHealthy
                ? 'Your plant looks healthy! Continue regular care.'
                : 'Could not identify a specific disease. Try uploading a clearer image of the affected area.',
            requiredThings: [],
        };
    }

    const top = suggestions[0];
    const diseaseName: string = top.name ?? 'Unknown';
    const probability: number = top.probability ?? 0;
    const details = top.details ?? {};

    // Build remedy from treatment categories if available
    const treatment = details.treatment ?? {};
    const remedyParts: string[] = [];
    const supplies = new Set<string>();

    for (const cat of ['biological', 'chemical', 'prevention']) {
        const entries: any[] = treatment[cat] ?? [];
        for (const entry of entries) {
            if (typeof entry === 'string') {
                remedyParts.push(entry);
                supplies.add(entry);
            } else {
                if (entry.name) supplies.add(entry.name);
                if (entry.description) remedyParts.push(entry.description);
                else if (entry.note) remedyParts.push(entry.note);
            }
        }
    }

    // Fallback: use description, cause, or the disease name itself
    let remedy: string;
    if (remedyParts.length > 0) {
        remedy = remedyParts.join('. ');
    } else if (details.description) {
        remedy = details.description;
    } else if (details.cause) {
        remedy = `Cause: ${details.cause}. Consult a local agricultural expert for treatment.`;
    } else {
        remedy = `Detected "${diseaseName}" with ${(probability * 100).toFixed(1)}% confidence. Please consult a local agricultural expert for treatment options.`;
    }

    return {
        disease: diseaseName,
        remedy,
        requiredThings: Array.from(supplies),
    };
};

/**
 * Standard crop identification — same single POST format.
 */
export const identifyCrop = async (
    imageBase64: string,
    latitude?: number,
    longitude?: number,
    similarImages: boolean = true
): Promise<any> => {
    if (!API_KEY) {
        throw new Error('VITE_KINDWISE_API_KEY is not defined in environment variables.');
    }

    const response = await axios.post(
        API_URL,
        {
            images: [imageBase64],
            latitude,
            longitude,
            similar_images: similarImages,
        },
        {
            headers: {
                'Api-Key': API_KEY,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
};
