import React, { useState, useCallback } from 'react';
import { VideoInput } from './components/VideoInput';
import { RAGOptions } from './components/RAGOptions';
import { RAGResults } from './components/RAGResults';
import { Loader } from './components/Loader';
import { performRAGAnalysis } from './services/ragService';
import { FrameData, RAGMode, ParsedRAGResponse, RetrievalQuery } from './types';
import { RAG_MODES, MAX_FRAMES_TO_ANALYZE, GEMINI_MODEL_MULTIMODAL } from './constants';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<FrameData[]>([]);
  const [ragMode, setRAGMode] = useState<RAGMode>(RAG_MODES[0].value);
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [query, setQuery] = useState<RetrievalQuery>({
    id: 'query-1',
    text: '',
    intent: 'search',
    maxResults: 5,
    relevanceThreshold: 0.7
  });
  const [ragResult, setRAGResult] = useState<ParsedRAGResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleVideoUploaded = useCallback((file: File, extractedFrames: FrameData[]) => {
    setVideoFile(file);
    setFrames(extractedFrames);
    setRAGResult(null);
    setError(null);
    setStatusMessage(`${extractedFrames.length} frames extracted from ${file.name}. Ready for contextual RAG analysis.`);
  }, []);

  const handleRAGAnalysis = useCallback(async () => {
    if (frames.length === 0) {
      setError("No video frames to analyze. Please upload a video first.");
      return;
    }
    if (!process.env.API_KEY) {
      setError("API Key is not configured. Please set the API_KEY environment variable.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRAGResult(null);
    setStatusMessage('Performing contextual RAG analysis... This may take a moment.');

    try {
      const queryToUse = (ragMode === RAGMode.WINDOW_RETRIEVAL || ragMode === RAGMode.SEMANTIC_FILTERING) 
        ? query 
        : undefined;
      
      const result = await performRAGAnalysis(
        frames, 
        ragMode, 
        queryToUse,
        customPromptText || undefined,
        GEMINI_MODEL_MULTIMODAL
      );
      setRAGResult(result);
      setStatusMessage('Contextual RAG analysis complete!');
    } catch (err) {
      console.error("RAG analysis error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during RAG analysis.");
      setStatusMessage('Error during RAG analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [frames, ragMode, query, customPromptText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-7xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Contextual Video RAG
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Advanced retrieval-augmented generation for video content with contextual compression and semantic analysis.
        </p>
      </header>

      <main className="w-full max-w-7xl bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Upload Video</h2>
              <VideoInput 
                onVideoUploaded={handleVideoUploaded} 
                maxFrames={MAX_FRAMES_TO_ANALYZE} 
                setGlobalStatusMessage={setStatusMessage}
                setGlobalError={setError}
              />
            </div>
            
            {frames.length > 0 && (
              <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">RAG Configuration</h2>
                <RAGOptions
                  selectedMode={ragMode}
                  onModeChange={setRAGMode}
                  query={query}
                  onQueryChange={setQuery}
                  customPrompt={customPromptText}
                  onCustomPromptChange={setCustomPromptText}
                />
              </div>
            )}
            
            {frames.length > 0 && (
              <button
                onClick={handleRAGAnalysis}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? <Loader className="w-5 h-5 mr-2" /> : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {isLoading ? 'Analyzing with RAG...' : 'Perform RAG Analysis'}
              </button>
            )}
          </section>
          
          <section className="bg-gray-700 bg-opacity-50 p-6 rounded-lg shadow-inner min-h-[500px] flex flex-col">
            {isLoading && !ragResult && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <p className="text-lg font-medium text-gray-300">{statusMessage || 'Processing...'}</p>
                </div>
              </div>
            )}
            {!isLoading && error && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4 bg-red-800 bg-opacity-50 rounded-md">
                  <h3 className="text-red-300 font-semibold text-lg">Analysis Error</h3>
                  <p className="text-red-400">{error}</p>
                </div>
              </div>
            )}
            {!isLoading && !error && statusMessage && !ragResult && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-300">{statusMessage}</p>
                </div>
              </div>
            )}
            {ragResult && (
              <div className="flex-1 overflow-y-auto">
                <RAGResults results={ragResult} />
              </div>
            )}
          </section>
        </div>
        
        {videoFile && frames.length > 0 && (
          <div className="mt-6 p-4 bg-gray-700 bg-opacity-30 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Video Preview (First Frame)</h3>
            <img 
              src={`data:${frames[0].mimeType};base64,${frames[0].base64Data}`} 
              alt="First video frame" 
              className="max-w-full max-h-48 rounded-md border border-gray-600 mx-auto"
            />
          </div>
        )}
      </main>
      
      <footer className="w-full max-w-7xl mt-12 text-center text-gray-500 text-xs">
        <p>Contextual Video RAG powered by Gemini AI • Advanced retrieval-augmented generation for video content</p>
      </footer>
    </div>
  );
};

export default App;
