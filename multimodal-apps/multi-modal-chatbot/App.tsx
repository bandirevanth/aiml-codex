import React, { useState, useCallback } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { ChatMessage, ChatMode, ChatSession, AgentState } from './types';
import { sendChatMessage } from './services/chatService';
import { GEMINI_MODEL_MULTIMODAL, MAX_CHAT_HISTORY } from './constants';

const App: React.FC = () => {
  const [agentState, setAgentState] = useState<AgentState>({
    currentSession: {
      id: 'session-1',
      messages: [],
      mode: ChatMode.MIXED,
      context: ''
    },
    isProcessing: false,
    error: null,
    memory: {}
  });

  const handleSendMessage = useCallback(async (message: string, videoFrames?: any[]) => {
    if (!agentState.currentSession) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      videoFrames: videoFrames || undefined
    };

    setAgentState(prev => ({
      ...prev,
      currentSession: prev.currentSession ? {
        ...prev.currentSession,
        messages: [...prev.currentSession.messages, userMessage]
      } : null,
      isProcessing: true,
      error: null
    }));

    try {
      const response = await sendChatMessage(
        message,
        agentState.currentSession.mode,
        agentState.currentSession.messages.slice(-MAX_CHAT_HISTORY),
        videoFrames,
        GEMINI_MODEL_MULTIMODAL
      );

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      setAgentState(prev => ({
        ...prev,
        currentSession: prev.currentSession ? {
          ...prev.currentSession,
          messages: [...prev.currentSession.messages, assistantMessage]
        } : null,
        isProcessing: false
      }));

    } catch (error) {
      console.error('Chat error:', error);
      setAgentState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  }, [agentState.currentSession]);

  const handleModeChange = useCallback((mode: ChatMode) => {
    setAgentState(prev => ({
      ...prev,
      currentSession: prev.currentSession ? {
        ...prev.currentSession,
        mode
      } : null
    }));
  }, []);

  if (!process.env.API_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-800 bg-opacity-50 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-red-300 font-semibold text-lg mb-2">API Key Required</h2>
          <p className="text-red-400">Please set the API_KEY environment variable to use this application.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto h-screen flex flex-col">
        <header className="text-center py-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Multi-Modal Chatbot
          </h1>
          <p className="text-gray-400 mt-2">
            Intelligent video analysis combined with conversational AI
          </p>
        </header>

        <main className="flex-1 bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
          {agentState.error && (
            <div className="bg-red-800 bg-opacity-50 p-4 m-4 rounded-lg">
              <p className="text-red-300">Error: {agentState.error}</p>
            </div>
          )}
          
          <ChatInterface
            messages={agentState.currentSession?.messages || []}
            currentMode={agentState.currentSession?.mode || ChatMode.MIXED}
            isProcessing={agentState.isProcessing}
            onSendMessage={handleSendMessage}
            onModeChange={handleModeChange}
          />
        </main>

        <footer className="text-center py-4 text-gray-500 text-xs">
          <p>Multi-Modal Chatbot powered by Gemini AI • Inspired by Agent Service Toolkit</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
