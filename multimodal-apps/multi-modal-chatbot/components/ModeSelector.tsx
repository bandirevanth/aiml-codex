import React from 'react';
import { ChatMode } from '../types';
import { CHAT_MODES } from '../constants';

interface ModeSelectorProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">Chat Mode</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {CHAT_MODES.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            className={`p-3 rounded-lg border text-left transition-all duration-200 ${
              currentMode === mode.value
                ? 'border-purple-500 bg-purple-600 bg-opacity-20 text-purple-300'
                : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="font-medium text-sm">{mode.label}</div>
            <div className="text-xs text-gray-400 mt-1">{mode.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
