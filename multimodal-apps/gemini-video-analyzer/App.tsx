
import React, { useState, useCallback } from 'react';
import { VideoInput } from './components/VideoInput';
import { AnalysisOptions } from './components/AnalysisOptions';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { analyzeVideoContent } from './services/geminiService';
import { FrameData, AnalysisType, ParsedAnalysisResponse } from './types';
import { ANALYSIS_TYPES, MAX_FRAMES_TO_ANALYZE, GEMINI_MODEL_MULTIMODAL } from './constants';
import { generatePrompt } from './utils/promptGenerator';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<FrameData[]>([]);
  const [analysisType, setAnalysisType] = useState<AnalysisType>(ANALYSIS_TYPES[0].value);
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ParsedAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleVideoUploaded = useCallback((file: File, extractedFrames: FrameData[]) => {
    setVideoFile(file);
    setFrames(extractedFrames);
    setAnalysisResult(null);
    setError(null);
    setStatusMessage(`${extractedFrames.length} frames extracted from ${file.name}. Ready to analyze.`);
  }, []);

  const handleAnalysis = useCallback(async () => {
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
    setAnalysisResult(null);
    setStatusMessage('Analyzing video content... This may take a moment.');

    const prompt = generatePrompt(analysisType, customPromptText);

    try {
      const result = await analyzeVideoContent(frames, prompt, GEMINI_MODEL_MULTIMODAL);
      setAnalysisResult(result);
      setStatusMessage('Analysis complete!');
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
      setStatusMessage('Error during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [frames, analysisType, customPromptText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Gemini Video Analyzer
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Upload a video, select an analysis type, and let Gemini provide insightful visual and textual feedback.
        </p>
      </header>

      <main className="w-full max-w-5xl bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <VideoInput 
              onVideoUploaded={handleVideoUploaded} 
              maxFrames={MAX_FRAMES_TO_ANALYZE} 
              setGlobalStatusMessage={setStatusMessage}
              setGlobalError={setError}
            />
            {frames.length > 0 && (
              <AnalysisOptions
                selectedType={analysisType}
                onTypeChange={setAnalysisType}
                customPrompt={customPromptText}
                onCustomPromptChange={setCustomPromptText}
                analysisTypes={ANALYSIS_TYPES}
              />
            )}
            {frames.length > 0 && (
              <button
                onClick={handleAnalysis}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? <Loader className="w-5 h-5 mr-2" /> : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-5.083-2.917L10.417 5H13a1 1 0 010 2H8a1 1 0 01-1-1V1a1 1 0 112 0v2.417A6.986 6.986 0 003.05 7.917 7.001 7.001 0 0010 18c.153 0 .305-.005.458-.014l-.42-.056z" clipRule="evenodd" />
                    </svg>
                )}
                {isLoading ? 'Analyzing...' : 'Analyze Video'}
              </button>
            )}
          </section>
          
          <section className="bg-gray-700 bg-opacity-50 p-6 rounded-lg shadow-inner min-h-[300px] flex flex-col justify-center items-center">
            {isLoading && !analysisResult && (
                <div className="text-center">
                    <Loader className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <p className="text-lg font-medium text-gray-300">{statusMessage || 'Processing...'}</p>
                </div>
            )}
            {!isLoading && error && (
              <div className="text-center p-4 bg-red-800 bg-opacity-50 rounded-md">
                <h3 className="text-red-300 font-semibold text-lg">Analysis Error</h3>
                <p className="text-red-400">{error}</p>
              </div>
            )}
            {!isLoading && !error && statusMessage && !analysisResult && (
                 <div className="text-center">
                    <p className="text-lg font-medium text-gray-300">{statusMessage}</p>
                </div>
            )}
            {analysisResult && <ResultsDisplay analysisResult={analysisResult} />}
          </section>
        </div>
        {videoFile && frames.length > 0 && (
            <div className="mt-6 p-4 bg-gray-700 bg-opacity-30 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Video Preview (First Frame)</h3>
                <img src={`data:${frames[0].mimeType};base64,${frames[0].base64Data}`} alt="First video frame" className="max-w-full max-h-48 rounded-md border border-gray-600 mx-auto"/>
            </div>
        )}
      </main>
      <footer className="w-full max-w-5xl mt-12 text-center text-gray-500 text-xs">
        <p>Powered by Gemini API. For demonstration purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
