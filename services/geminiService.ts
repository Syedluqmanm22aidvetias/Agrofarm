import { GoogleGenAI, Type } from "@google/genai";
import { SoilData, WeatherData, CropRecommendation } from "../types";

// Helper to get the AI instance
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// Response schema for structured JSON output
const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          crop: { type: Type.STRING, description: "Name of the crop" },
          suitabilityScore: { type: Type.NUMBER, description: "Percentage score 0-100" },
          fertilizerAdvice: { type: Type.STRING, description: "Specific fertilizer recommendations" },
          expectedYield: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          profitEstimator: { type: Type.STRING, description: "Estimated profit text (e.g., 'High profitability due to market demand')" },
          rotationAdvice: { type: Type.STRING, description: "Suggested next crop for rotation" }
        },
        required: ["crop", "suitabilityScore", "fertilizerAdvice", "expectedYield", "profitEstimator", "rotationAdvice"]
      }
    },
    analysisSummary: {
        type: Type.STRING,
        description: "A brief 2 sentence summary of the soil condition."
    }
  },
  required: ["recommendations", "analysisSummary"]
};

export const generateCropRecommendations = async (
  soil: SoilData,
  weather: WeatherData
): Promise<{ recommendations: CropRecommendation[]; summary: string }> => {
  try {
    const ai = getAI();
    
    const prompt = `
      Analyze the following soil and weather conditions to suggest the best crops to grow.
      
      Soil Parameters:
      - pH: ${soil.ph}
      - Nitrogen (N): ${soil.nitrogen} mg/kg
      - Phosphorus (P): ${soil.phosphorus} mg/kg
      - Potassium (K): ${soil.potassium} mg/kg
      - Soil Type: ${soil.soilType}
      - Location/Region Context: ${soil.location}
      
      Weather Conditions:
      - Temperature: ${weather.temperature}°C
      - Humidity: ${weather.humidity}%
      - Rainfall Prediction: ${weather.rainfall}mm
      - Condition: ${weather.description}
      
      Based on this data, provide top 5 crop recommendations.
      Be realistic about yield and fertilizer needs.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Act as an expert agronomist and AI farming assistant.",
        responseMimeType: 'application/json',
        responseSchema: recommendationSchema,
        temperature: 0.4, // Lower temperature for more analytical results
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI model.");
    }

    const parsedData = JSON.parse(resultText);
    return {
        recommendations: parsedData.recommendations,
        summary: parsedData.analysisSummary
    };

  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};