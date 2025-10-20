import type { Analysis } from '../types';

export const analyzePlantImage = async (base64Image: string): Promise<Analysis> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
       try {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.statusText}`);
      } catch (e) {
        // If the error response is not JSON, fall back to status text
        throw new Error(`Failed to analyze the plant image: ${response.statusText}`);
      }
    }

    const result: Analysis = await response.json();
    
    // Basic validation
    if (typeof result.confidenceScore !== 'number' || result.confidenceScore < 0 || result.confidenceScore > 100) {
      console.warn('Received invalid confidence score, capping at 100.', result.confidenceScore);
      result.confidenceScore = Math.max(0, Math.min(100, result.confidenceScore || 0));
    }

    return result;

  } catch (error) {
    console.error("Error analyzing plant image:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while communicating with the analysis service.");
  }
};
