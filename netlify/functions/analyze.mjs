
const analysisSchema = {
  type: "OBJECT",
  properties: {
    isHealthy: { type: "BOOLEAN" },
    diseaseName: { type: "STRING" },
    description: { type: "STRING" },
    treatment: { type: "STRING" },
    confidenceScore: { type: "NUMBER" },
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
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { image: base64Image } = JSON.parse(event.body);
    if (!base64Image) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing image data' })};
    }

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.error("API_KEY environment variable not set in Netlify function.");
        return { statusCode: 500, body: JSON.stringify({ message: 'Server configuration error: API key not found.' })};
    }

    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const requestBody = {
      contents: [{
        parts: [
          { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      }],
      generation_config: {
        response_mime_type: "application/json",
        response_schema: analysisSchema,
      }
    };

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error('Gemini API Error:', errorBody);
      return { statusCode: apiResponse.status, body: JSON.stringify({ message: `Gemini API error: ${errorBody}` }) };
    }

    const responseData = await apiResponse.json();

    if (!responseData.candidates || !responseData.candidates[0].content.parts[0].text) {
        console.error('Unexpected Gemini API response structure:', responseData);
        return { statusCode: 500, body: JSON.stringify({ message: 'Invalid response from AI service.' }) };
    }
    
    const jsonText = responseData.candidates[0].content.parts[0].text;

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
