import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { FrameData, ChatMessage, ChatResponse, ChatMode } from '../types';
import { generateChatPrompt } from '../utils/promptGenerator';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(
    "API_KEY is not set in environment variables. Chat functionality will not be available."
  );
}

export const sendChatMessage = async (
  message: string,
  mode: ChatMode,
  chatHistory: ChatMessage[],
  frames?: FrameData[],
  modelName: string = 'gemini-1.5-flash'
): Promise<ChatResponse> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. API_KEY might be missing or invalid.");
  }

  const hasVideoFrames = frames && frames.length > 0;
  const prompt = generateChatPrompt(mode, message, chatHistory, hasVideoFrames);

  const parts: Part[] = [];
  
  if (hasVideoFrames && frames) {
    const imageParts: Part[] = frames.map(frame => ({
      inlineData: {
        mimeType: frame.mimeType,
        data: frame.base64Data,
      },
    }));
    parts.push(...imageParts);
  }
  
  parts.push({ text: prompt });

  try {
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts }],
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });
    
    const responseText = result.text;
    if (!responseText) {
      throw new Error("Received an empty response from the chat service.");
    }

    return {
      content: responseText,
      suggestions: extractSuggestions(responseText),
      followUpQuestions: extractFollowUpQuestions(responseText)
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
      throw new Error("Invalid API Key. Please check your Gemini API key configuration.");
    }
    throw new Error(`An error occurred while communicating with the chat service: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const extractSuggestions = (text: string): string[] => {
  const suggestions: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('you might also') || 
        line.toLowerCase().includes('consider') ||
        line.toLowerCase().includes('suggestion')) {
      suggestions.push(line.trim());
    }
  }
  
  return suggestions.slice(0, 3);
};

const extractFollowUpQuestions = (text: string): string[] => {
  const questions: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.includes('?') && line.length < 100) {
      questions.push(line.trim());
    }
  }
  
  return questions.slice(0, 2);
};
