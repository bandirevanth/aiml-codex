import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatMode } from '../types';
import { MessageBubble } from './MessageBubble';
import { VideoUpload } from './VideoUpload';
import { ModeSelector } from './ModeSelector';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentMode: ChatMode;
  isProcessing: boolean;
  onSendMessage: (message: string, videoFrames?: any[]) => void;
  onModeChange: (mode: ChatMode) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentMode,
  isProcessing,
  onSendMessage,
  onModeChange
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFrames, setAttachedFrames] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim() || attachedFrames.length > 0) {
      onSendMessage(inputMessage.trim(), attachedFrames);
      setInputMessage('');
      setAttachedFrames([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg">
      <div className="p-4 border-b border-gray-700">
        <ModeSelector currentMode={currentMode} onModeChange={onModeChange} />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
            <p>Upload a video to analyze or just start chatting!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg p-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                <span className="text-gray-300">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        {(currentMode === ChatMode.VIDEO_ANALYSIS || currentMode === ChatMode.MIXED) && (
          <div className="mb-3">
            <VideoUpload 
              onFramesExtracted={setAttachedFrames}
              maxFrames={5}
              compact={true}
            />
          </div>
        )}
        
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentMode === ChatMode.VIDEO_ANALYSIS 
                ? "Ask about the video content..."
                : currentMode === ChatMode.CONVERSATION
                ? "Type your message..."
                : "Upload video or type message..."
            }
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={2}
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={isProcessing || (!inputMessage.trim() && attachedFrames.length === 0)}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        {attachedFrames.length > 0 && (
          <div className="mt-2 text-sm text-gray-400">
            📹 {attachedFrames.length} video frame{attachedFrames.length > 1 ? 's' : ''} attached
          </div>
        )}
      </div>
    </div>
  );
};
