
import React from 'react';
import { AnalysisType, AnalysisTypeOption } from '../types';
import { DEFAULT_CUSTOM_PROMPT } from '../constants';

interface AnalysisOptionsProps {
  selectedType: AnalysisType;
  onTypeChange: (type: AnalysisType) => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  analysisTypes: AnalysisTypeOption[];
}

export const AnalysisOptions: React.FC<AnalysisOptionsProps> = ({
  selectedType,
  onTypeChange,
  customPrompt,
  onCustomPromptChange,
  analysisTypes,
}) => {
  const selectedTypeDetails = analysisTypes.find(at => at.value === selectedType);

  return (
    <div className="space-y-6 p-6 bg-gray-700 bg-opacity-40 rounded-lg shadow-lg">
      <div>
        <label htmlFor="analysis-type" className="block text-lg font-semibold text-purple-300 mb-2">
          Analysis Type
        </label>
        <select
          id="analysis-type"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as AnalysisType)}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-200 placeholder-gray-500"
        >
          {analysisTypes.map((typeOption) => (
            <option key={typeOption.value} value={typeOption.value}>
              {typeOption.label}
            </option>
          ))}
        </select>
        {selectedTypeDetails?.description && (
          <p className="mt-2 text-xs text-gray-400">{selectedTypeDetails.description}</p>
        )}
      </div>

      {selectedType === AnalysisType.CUSTOM && (
        <div>
          <label htmlFor="custom-prompt" className="block text-lg font-semibold text-purple-300 mb-2">
            Custom Analysis Prompt
          </label>
          <textarea
            id="custom-prompt"
            value={customPrompt || DEFAULT_CUSTOM_PROMPT}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            rows={6}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-200 placeholder-gray-500 text-sm"
            placeholder="e.g., Identify all animals in the video and their species..."
          />
           <p className="mt-2 text-xs text-gray-400">
            Ensure your prompt asks for JSON output matching the application's expected structure for best results.
            Refer to the <code>DEFAULT_CUSTOM_PROMPT</code> for guidance on the required JSON structure.
          </p>
        </div>
      )}
    </div>
  );
};
