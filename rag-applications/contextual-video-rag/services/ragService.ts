import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { FrameData, ParsedRAGResponse, RAGMode, RetrievalQuery } from '../types';
import { generateRAGPrompt } from '../utils/promptGenerator';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(
    "API_KEY is not set in environment variables. RAG analysis will not be available. " +
    "Please ensure process.env.API_KEY is configured."
  );
}

export const performRAGAnalysis = async (
  frames: FrameData[],
  ragMode: RAGMode,
  query?: RetrievalQuery,
  customPrompt?: string,
  modelName: string = 'gemini-1.5-flash'
): Promise<ParsedRAGResponse> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. API_KEY might be missing or invalid.");
  }

  if (frames.length === 0) {
    throw new Error("No frames provided for RAG analysis.");
  }

  const prompt = generateRAGPrompt(ragMode, query, customPrompt);
  
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
      contents: [{ role: "user", parts: contents }],
      config: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
      }
    });
    
    const responseText = result.text;
    if (!responseText) {
      console.error("Gemini response was empty. Full API response:", result);
      throw new Error("Received an empty response from the RAG analysis service.");
    }

    let jsonStr = responseText.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    try {
      const parsedData = JSON.parse(jsonStr);
      
      if (!parsedData.summary) {
        console.error(
          "Parsed JSON is missing required field 'summary'.",
          "Raw text (before fence removal):", responseText, 
          "Attempted JSON string for parsing:", jsonStr, 
          "Parsed data:", parsedData
        );
        throw new Error("RAG analysis response is not in the expected format (missing summary).");
      }
      
      return parsedData as ParsedRAGResponse;
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e);
      console.error("Raw response text from Gemini (before fence removal):", responseText);
      console.error("Attempted JSON string for parsing (after fence removal):", jsonStr); 
      throw new Error(`Failed to parse RAG analysis. The response from Gemini was not valid JSON. Content intended for parsing started with: '${jsonStr.substring(0, 200)}...'`);
    }

  } catch (error) {
    console.error("Error calling Gemini API for RAG analysis:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
      throw new Error("Invalid API Key. Please check your Gemini API key configuration.");
    }
    if (error instanceof Error && error.message.startsWith("Failed to parse RAG analysis")) {
      throw error;
    }
    throw new Error(`An error occurred while communicating with the RAG analysis service: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const performContextualRetrieval = async (
  frames: FrameData[],
  query: RetrievalQuery,
  modelName: string = 'gemini-1.5-flash'
): Promise<ParsedRAGResponse> => {
  return performRAGAnalysis(frames, RAGMode.WINDOW_RETRIEVAL, query, undefined, modelName);
};

export const performSemanticCompression = async (
  frames: FrameData[],
  compressionRatio: number = 0.6,
  modelName: string = 'gemini-1.5-flash'
): Promise<ParsedRAGResponse> => {
  const customPrompt = `Perform contextual compression with target ratio: ${compressionRatio}. Focus on preserving semantic meaning while reducing redundancy.`;
  return performRAGAnalysis(frames, RAGMode.CONTEXTUAL_COMPRESSION, undefined, customPrompt, modelName);
};

export const performHierarchicalSearch = async (
  frames: FrameData[],
  searchDepth: number = 3,
  modelName: string = 'gemini-1.5-flash'
): Promise<ParsedRAGResponse> => {
  const customPrompt = `Perform hierarchical search with depth: ${searchDepth}. Create multi-level content hierarchy and relationships.`;
  return performRAGAnalysis(frames, RAGMode.HIERARCHICAL_SEARCH, undefined, customPrompt, modelName);
};

export const performAdaptiveContextAnalysis = async (
  frames: FrameData[],
  adaptationStrategy: 'dynamic' | 'query-based' | 'content-aware' = 'dynamic',
  modelName: string = 'gemini-1.5-flash'
): Promise<ParsedRAGResponse> => {
  const customPrompt = `Perform adaptive context analysis using ${adaptationStrategy} strategy. Dynamically adjust context windows and retrieval parameters.`;
  return performRAGAnalysis(frames, RAGMode.ADAPTIVE_CONTEXT, undefined, customPrompt, modelName);
};
