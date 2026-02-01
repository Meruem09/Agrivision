
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const getAIResponse = async (prompt: string, image?: string): Promise<string> => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parts: any[] = [{ text: prompt + " (Answer concisely as an agricultural expert, keep it under 50 words)" }];

        if (image) {
            // clean base64 string if needed
            const base64Image = image.split(',')[1] || image;
            parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image
                }
            });
        }

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: parts
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('AI API Error:', errorData);
            throw new Error('Failed to fetch AI response');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling AI service:', error);
        return "I'm having trouble connecting to the agricultural database right now. Please try again later.";
    }
};
