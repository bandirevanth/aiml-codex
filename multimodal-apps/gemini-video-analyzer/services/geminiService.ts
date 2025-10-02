
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { FrameData, ParsedAnalysisResponse } from '../types';

const API_KEY = process.env.API_KEY;

// Initialize Gemini AI client conditionally
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(
    "API_KEY is not set in environment variables. Video analysis will not be available. " +
    "Please ensure process.env.API_KEY is configured."
  );
}

export const analyzeVideoContent = async (
  frames: FrameData[],
  prompt: string,
  modelName: string,
): Promise<ParsedAnalysisResponse> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. API_KEY might be missing or invalid.");
  }

  if (frames.length === 0) {
    throw new Error("No frames provided for analysis.");
  }

  const imageParts: Part[] = frames.map(frame => ({
    inlineData: {
      mimeType: frame.mimeType,
      data: frame.base64Data,
    },
  }));

  const contents: Part[] = [
    ...imageParts,
    { text: prompt },
  ];

  try {
    const result: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts: contents }], // Multi-part content for images and text
        config: {
            // No specific config like responseMimeType here, as we're asking for JSON within the prompt
            // Temperature, topK, topP can be added if needed for tuning
            // systemInstruction can also be part of the config object if preferred over embedding in main prompt
        }
    });
    
    const responseText = result.text;
    if (!responseText) {
        console.error("Gemini response was empty. Full API response:", result);
        throw new Error("Received an empty response from the analysis service.");
    }

    // Clean up potential markdown fences and parse JSON
    let jsonStr = responseText.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    try {
      const parsedData = JSON.parse(jsonStr);
      // Basic validation of the parsed structure.
      // Based on the provided project files (types.ts, constants.ts, utils/promptGenerator.ts),
      // the application currently expects a 'sections' array in the response.
      // If your application logic evolves to handle different response structures (e.g., 'thumbnailAnalyses'
      // for YouTube videos without 'sections'), this validation will need to be adjusted accordingly.
      if (!parsedData.title || !parsedData.sections) {
          console.error(
            "Parsed JSON is missing required fields 'title' or 'sections'.",
            "Raw text (before fence removal):", responseText, 
            "Attempted JSON string for parsing:", jsonStr, 
            "Parsed data:", parsedData
          );
          throw new Error("Analysis response is not in the expected format (missing title or sections).");
      }
      return parsedData as ParsedAnalysisResponse;
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e);
      console.error("Raw response text from Gemini (before fence removal):", responseText);
      console.error("Attempted JSON string for parsing (after fence removal):", jsonStr); 
      throw new Error(`Failed to parse analysis. The response from Gemini was not valid JSON. Content intended for parsing started with: '${jsonStr.substring(0, 200)}...'`);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
         throw new Error("Invalid API Key. Please check your Gemini API key configuration.");
    }
    // Preserve the detailed parsing error message if it's the one thrown from the inner try-catch
    if (error instanceof Error && error.message.startsWith("Failed to parse analysis")) {
        throw error;
    }
    throw new Error(`An error occurred while communicating with the analysis service: ${error instanceof Error ? error.message : String(error)}`);
  }
};
