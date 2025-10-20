
import { GoogleGenAI, Type } from "@google/genai";
import type { Analysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isHealthy: { type: Type.BOOLEAN },
    diseaseName: { type: Type.STRING },
    description: { type: Type.STRING },
    treatment: { type: Type.STRING },
    confidenceScore: { type: Type.NUMBER },
  },
  required: ['isHealthy', 'diseaseName', 'description', 'treatment', 'confidenceScore'],
};

const prompt = `
You are an expert botanist and plant pathologist. Analyze the provided image of a plant leaf.
1. Identify the disease, if any. If the plant is healthy, state that.
2. Provide a detailed but easy-to-understand description of the disease.
3. Suggest actionable treatment steps. If healthy, suggest general care tips.
4. Provide a confidence score (in percentage) for your analysis.

Return the response in the specified JSON format.
`;

export const analyzePlantImage = async (base64Image: string): Promise<Analysis> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation
    if (typeof result.confidenceScore !== 'number' || result.confidenceScore < 0 || result.confidenceScore > 100) {
      console.warn('Received invalid confidence score, capping at 100.', result.confidenceScore);
      result.confidenceScore = Math.max(0, Math.min(100, result.confidenceScore || 0));
    }

    return result as Analysis;

  } catch (error) {
    console.error("Error analyzing plant image:", error);
    throw new Error("Failed to analyze the plant image. The AI model might be busy or an error occurred.");
  }
};
