import React from 'react';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-purple-600 text-white' 
          : 'bg-gray-700 text-gray-100'
      }`}>
        {!isUser && (
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">
              AI
            </div>
            <span className="text-xs text-gray-400">VideoChat Assistant</span>
          </div>
        )}
        
        {message.videoFrames && message.videoFrames.length > 0 && (
          <div className="mb-2">
            <div className="grid grid-cols-2 gap-1 mb-2">
              {message.videoFrames.slice(0, 4).map((frame, index) => (
                <img
                  key={index}
                  src={`data:${frame.mimeType};base64,${frame.base64Data}`}
                  alt={`Video frame ${index + 1}`}
                  className="w-full h-16 object-cover rounded border border-gray-600"
                />
              ))}
            </div>
            {message.videoFrames.length > 4 && (
              <div className="text-xs text-gray-400">
                +{message.videoFrames.length - 4} more frames
              </div>
            )}
          </div>
        )}
        
        <div className="whitespace-pre-wrap text-sm">
          {message.content}
        </div>
        
        <div className={`text-xs mt-1 ${isUser ? 'text-purple-200' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
