import React from 'react';
import { RAGMode, RetrievalQuery } from '../types';
import { RAG_MODES, RETRIEVAL_INTENTS, CONTEXT_WINDOW_SIZES, SEMANTIC_SIMILARITY_THRESHOLDS } from '../constants';

interface RAGOptionsProps {
  selectedMode: RAGMode;
  onModeChange: (mode: RAGMode) => void;
  query: RetrievalQuery;
  onQueryChange: (query: RetrievalQuery) => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
}

export const RAGOptions: React.FC<RAGOptionsProps> = ({
  selectedMode,
  onModeChange,
  query,
  onQueryChange,
  customPrompt,
  onCustomPromptChange
}) => {
  const updateQuery = (updates: Partial<RetrievalQuery>) => {
    onQueryChange({ ...query, ...updates });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">RAG Analysis Mode</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RAG_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onModeChange(mode.value)}
              className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                selectedMode === mode.value
                  ? 'border-purple-500 bg-purple-600 bg-opacity-20 text-purple-300'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">{mode.icon}</span>
                <span className="font-medium text-sm">{mode.label}</span>
              </div>
              <div className="text-xs text-gray-400">{mode.description}</div>
            </button>
          ))}
        </div>
      </div>

      {(selectedMode === RAGMode.WINDOW_RETRIEVAL || selectedMode === RAGMode.SEMANTIC_FILTERING) && (
        <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg space-y-4">
          <h4 className="text-md font-semibold text-gray-200">Retrieval Configuration</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search Query</label>
            <input
              type="text"
              value={query.text}
              onChange={(e) => updateQuery({ text: e.target.value })}
              placeholder="Enter your search query..."
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Intent</label>
              <select
                value={query.intent}
                onChange={(e) => updateQuery({ intent: e.target.value as any })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {RETRIEVAL_INTENTS.map((intent) => (
                  <option key={intent.value} value={intent.value}>
                    {intent.icon} {intent.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Results</label>
              <input
                type="number"
                value={query.maxResults}
                onChange={(e) => updateQuery({ maxResults: parseInt(e.target.value) || 5 })}
                min="1"
                max="20"
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Relevance Threshold: {query.relevanceThreshold}
            </label>
            <input
              type="range"
              value={query.relevanceThreshold}
              onChange={(e) => updateQuery({ relevanceThreshold: parseFloat(e.target.value) })}
              min="0.1"
              max="1.0"
              step="0.1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Low (0.1)</span>
              <span>High (1.0)</span>
            </div>
          </div>
        </div>
      )}

      {selectedMode === RAGMode.CUSTOM && (
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Custom RAG Analysis</h3>
          <textarea
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            placeholder="Describe your custom RAG analysis requirements..."
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-2">
            Specify contextual compression, retrieval strategies, or semantic analysis requirements.
          </p>
        </div>
      )}

      <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          Selected: {RAG_MODES.find(m => m.value === selectedMode)?.label}
        </h4>
        <p className="text-xs text-gray-400">
          {RAG_MODES.find(m => m.value === selectedMode)?.description}
        </p>
      </div>
    </div>
  );
};
