import { getAIResponse } from './aiService';

export interface PricePrediction {
    commodity: string;
    trend: 'up' | 'down' | 'stable';
    reason: string;
    percentageChange?: string;
}

export interface CropRecommendation {
    crop: string;
    plantingWindow: string;
    estimatedHarvest: string;
    potentialProfit: string;
    reason: string;
}

export const getMarketPredictions = async (commodities: string[]): Promise<PricePrediction[]> => {
    try {
        const prompt = `
        You are an agricultural market expert. Based on general seasonal trends in India (Gujarat region), 
        predict the price trend for the next month for these commodities: ${commodities.join(', ')}.
        
        Return ONLY a JSON array with this format:
        [
            {
                "commodity": "Name",
                "trend": "up" or "down" or "stable",
                "reason": "Brief reason (max 10 words)",
                "percentageChange": "Estimated % change (e.g. +5%, -2%)"
            }
        ]
        Do not include markdown formatting or backticks. Just the raw JSON string.
        `;

        const response = await getAIResponse(prompt);
        // Clean up response if it contains markdown code blocks
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Error fetching market predictions:", error);
        // Fallback mock data
        return commodities.map(c => ({
            commodity: c,
            trend: 'stable',
            reason: 'Data unavailable',
            percentageChange: '0%'
        }));
    }
};

export const getCropRecommendations = async (month: string): Promise<CropRecommendation[]> => {
    try {
        const prompt = `
        You are an expert agronomist for Gujarat, India. It is currently ${month}.
        Recommend top 3 high-profit crops to plant NOW.
        
        Return ONLY a JSON array with this format:
        [
            {
                "crop": "Name",
                "plantingWindow": "Best time to plant",
                "estimatedHarvest": "Harvest month",
                "potentialProfit": "Profit potential (High/Medium/Low)",
                "reason": "Why is this a good choice now? (max 15 words)"
            }
        ]
        Do not include markdown formatting or backticks. Just the raw JSON string.
        `;

        const response = await getAIResponse(prompt);
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Error fetching crop recommendations:", error);
        return [];
    }
};
