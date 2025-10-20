import { GoogleGenAI, Type } from "@google/genai";

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isHealthy: { type: Type.BOOLEAN, description: "Whether the plant is healthy." },
    diseaseName: { type: Type.STRING, description: "The common name of the disease, or 'Healthy' if no disease is detected." },
    description: { type: Type.STRING, description: "A detailed description of the plant's condition or the identified disease." },
    treatment: { type: Type.STRING, description: "Actionable steps for treatment. If the plant is healthy, provide general care tips." },
    confidenceScore: { type: Type.NUMBER, description: "A confidence score from 0 to 100 for the accuracy of the analysis." },
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

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
      console.error("API_KEY environment variable not set in Netlify function.");
      return { statusCode: 500, body: JSON.stringify({ message: 'Server configuration error: API key not found.' })};
  }

  try {
    const { image: base64Image } = JSON.parse(event.body);
    if (!base64Image) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing image data' })};
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        }
    });

    const jsonText = response.text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: jsonText,
    };
  } catch (error) {
    console.error('Error in Netlify function:', error);
    return { statusCode: 500, body: JSON.stringify({ message: `Internal Server Error: ${error.message}` }) };
  }
};
