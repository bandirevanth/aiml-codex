
import { AnalysisType, ParsedAnalysisResponse } from '../types'; // Adjust path as necessary
import { DEFAULT_CUSTOM_PROMPT } from '../constants';

const JSON_STRUCTURE_GUIDANCE = `
Format your response strictly as JSON adhering to the ParsedAnalysisResponse interface.
The JSON object must have:
1.  "title": string (e.g., "Cooking Analysis: Spaghetti Carbonara")
2.  "overallSummary": string (A brief, engaging summary of the entire video's content and analysis.)
3.  "sections": Array of section objects. Each section object must have:
    a. "title": string (e.g., "Identified Ingredients", "Workout Breakdown", "Featured Technologies")
    b. "items" (optional): Array of item objects. Each item object should have:
        i.   "id": string (unique identifier, e.g., "ingredient1")
        ii.  "name": string (e.g., "Tomatoes", "Bicep Curl", "Smartphone Model X")
        iii. "details" (optional): string or array of strings (e.g., "Roma, 2 large", ["Biceps", "Forearms"], "Latest flagship model")
        iv.  "iconKeyword" (optional): string (a single lowercase keyword for icon mapping, e.g., "tomato", "dumbbell", "phone")
        v.   "value" (optional): number (for quantifiable data, e.g., count, duration, rating)
        vi.  "description" (optional): string (a short sentence about the item)
    c. "chartData" (optional): Array of objects for charts, each with "name": string and "value": number.
    d. "chartType" (optional): "bar" | "pie". Required if chartData is present.
    e. "summary" (optional): string (A brief summary for this specific section.)
    f. "layout" (optional): "list" | "grid" (A hint for how to display items.)

Example for a "Key Elements" section with items:
{
  "title": "Key Elements",
  "items": [
    {"id": "elem1", "name": "Red Car", "details": "Sports model, driving fast", "iconKeyword": "car", "value": 1},
    {"id": "elem2", "name": "Sunset", "details": "Vibrant orange and purple hues", "iconKeyword": "nature"}
  ],
  "summary": "The video prominently features a red sports car during a sunset."
}

Example for a "Quantitative Analysis" section with a bar chart:
{
  "title": "Scene Durations",
  "chartData": [
    {"name": "Dialogue", "value": 60},
    {"name": "Action", "value": 90},
    {"name": "Scenery", "value": 30}
  ],
  "chartType": "bar",
  "summary": "Action sequences make up the largest portion of the video."
}
Ensure all text is engaging and informative. Use markdown for formatting within strings if appropriate (e.g., for summaries), but the overall structure MUST be valid JSON.
Analyze the provided frames to extract meaningful information relevant to the video's likely category.
`;


export const generatePrompt = (type: AnalysisType, customPromptText?: string): string => {
  let specificInstructions = '';

  switch (type) {
    case AnalysisType.COOKING:
      specificInstructions = `
        This is a cooking video. Identify the dish being prepared, main ingredients, cooking steps, and any special techniques or tips.
        - List main ingredients with quantities if discernible. Suggest "food" or specific ingredient names for iconKeywords.
        - Outline primary cooking steps.
        - If possible, create a section for "Recipe Highlights" with chartData showing ingredient proportions or cooking times.
      `;
      break;
    case AnalysisType.EXERCISE:
      specificInstructions = `
        This is an exercise or workout video. Identify the exercises performed, targeted muscle groups, and any tips on form or intensity.
        - List exercises shown. For each, specify primary muscles targeted. Suggest "exercise", "muscle", or specific exercise names for iconKeywords.
        - Create a section for "Muscle Group Focus" with chartData (bar chart) showing relative focus on different muscle groups if possible.
      `;
      break;
    case AnalysisType.TECH:
      specificInstructions = `
        This is a tech review, tutorial, or news video. Identify the key technologies, products (hardware/software), features discussed, and their pros/cons if mentioned.
        - List main technologies or products. Suggest "tech", "computer", "phone", "software" for iconKeywords.
        - Create a section for "Key Features Discussed" and another for "Pros & Cons" if applicable.
      `;
      break;
    case AnalysisType.GENERAL:
        specificInstructions = `
        This is a general video. Analyze the frames to identify key objects, people, settings, and actions.
        Determine the overall theme or topic of the video.
        - List 3-5 most prominent visual elements or concepts. Suggest generic iconKeywords like "object", "person", "nature", "action".
        - Provide an overall summary of what the video might be about.
        `;
        break;
    case AnalysisType.CUSTOM:
      specificInstructions = customPromptText || DEFAULT_CUSTOM_PROMPT;
      // Ensure custom prompt also requests the JSON structure if it doesn't already.
      if (!customPromptText?.toLowerCase().includes('json')) {
        specificInstructions += `\nRemember to format your response as JSON as described below.`;
      }
      break;
    default:
      specificInstructions = `Analyze these video frames for general content.`;
  }

  return `
    You are an expert video analysis AI. Analyze the following video frames.
    ${specificInstructions}
    ${JSON_STRUCTURE_GUIDANCE}
  `;
};
