
import { AnalysisType, AnalysisTypeOption } from './types';

export const GEMINI_MODEL_MULTIMODAL = 'gemini-2.5-flash-preview-04-17'; // Preferred model for multimodal
export const MAX_FRAMES_TO_ANALYZE = 5; // Max frames to send to Gemini
export const FRAME_EXTRACTION_INTERVAL_SECONDS = 3; // Hint for interval, actual may vary

export const ANALYSIS_TYPES: AnalysisTypeOption[] = [
  { value: AnalysisType.GENERAL, label: 'General Analysis', description: 'Get a general overview and key elements from the video.' },
  { value: AnalysisType.COOKING, label: 'Cooking Video', description: 'Identify ingredients, steps, and dish type.' },
  { value: AnalysisType.EXERCISE, label: 'Exercise Video', description: 'Identify exercises, muscles worked, and form tips.' },
  { value: AnalysisType.TECH, label: 'Tech Review/Tutorial', description: 'Identify technologies, products, and key features discussed.' },
  { value: AnalysisType.CUSTOM, label: 'Custom Prompt', description: 'Provide your own detailed instructions for analysis.' },
];

export const DEFAULT_CUSTOM_PROMPT = `Analyze these video frames. Identify key objects, actions, and the overall theme. 
Provide a concise summary and list up to 5 notable elements.
Format your response as JSON matching the ParsedAnalysisResponse structure defined in the application.
Specifically, ensure the JSON output has a "title" (string), an "overallSummary" (string), and a "sections" array.
Each section in the "sections" array should have a "title" (string), and can optionally include "items" (array of objects with "id", "name", "details", "iconKeyword"), "chartData" (array of objects with "name", "value"), "chartType" ("bar" or "pie"), and "summary" (string).
For example:
{
  "title": "General Video Analysis",
  "overallSummary": "A brief overview of the video content.",
  "sections": [
    {
      "title": "Key Elements",
      "items": [
        {"id": "elem1", "name": "Element One", "details": "Description of element one", "iconKeyword": "generic"},
        {"id": "elem2", "name": "Element Two", "details": "Description of element two", "iconKeyword": "object"}
      ],
      "summary": "These are the most prominent elements observed."
    }
  ]
}
Focus on accuracy and conciseness.`;
