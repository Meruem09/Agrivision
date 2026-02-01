import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 6000; // 6 seconds between requests

export const getAIResponse = async (prompt: string, image?: string): Promise<string> => {
    try {
        // Rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            await new Promise(resolve =>
                setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
            );
        }
        lastRequestTime = Date.now();

        // Initialize the AI client
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Use a currently supported model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Prepare the content
        if (image) {
            // With image
            const base64Image = image.split(',')[1] || image;

            const imagePart = {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image
                }
            };

            const textPart = prompt + " (Answer concisely as an agricultural expert, keep it under 50 words)";

            const result = await model.generateContent([textPart, imagePart]);
            const response = await result.response;
            return response.text();
        } else {
            // Text only
            const result = await model.generateContent(
                prompt + " (Answer concisely as an agricultural expert, keep it under 50 words)"
            );
            const response = await result.response;
            return response.text();
        }
    } catch (error: unknown) {
        console.error('Error calling AI service:', error);

        // Handle specific error types
        if (error && typeof error === 'object') {
            const errorMessage = 'message' in error ? String(error.message) : '';

            if (errorMessage.includes('429') || errorMessage.includes('quota')) {
                return "You're sending requests too quickly. Please wait a moment and try again.";
            } else if (errorMessage.includes('403') || errorMessage.includes('API key')) {
                return "API key error. Please check your API configuration.";
            } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
                return "AI model not found. The model may have been deprecated.";
            }
        }

        return "I'm having trouble connecting to the agricultural database right now. Please try again later.";
    }
};