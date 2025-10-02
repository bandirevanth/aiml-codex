import React, { useState } from 'react';
import { VideoFile, BlogWritingConfig, BlogWritingResult, AgentState } from './types';
import BlogWriterInterface from './components/BlogWriterInterface';
import BlogWriterProgress from './components/BlogWriterProgress';
import BlogWriterResults from './components/BlogWriterResults';
import BlogWriterService from './services/blogWriterService';
import { BLOG_WRITING_AGENTS } from './constants';

function App() {
  const [result, setResult] = useState<BlogWritingResult | null>(null);
  const [agentState, setAgentState] = useState<AgentState>({
    currentAgent: '',
    progress: 0,
    isProcessing: false,
    error: null,
    agentProgress: {
      videoAnalyzer: false,
      contentPlanner: false,
      researcher: false,
      writer: false,
      editor: false
    }
  });

  const blogWriterService = new BlogWriterService();

  const handleStartWriting = async (videoFile: VideoFile, config: BlogWritingConfig) => {
    setAgentState({
      currentAgent: BLOG_WRITING_AGENTS[0],
      progress: 0,
      isProcessing: true,
      error: null,
      agentProgress: {
        videoAnalyzer: false,
        contentPlanner: false,
        researcher: false,
        writer: false,
        editor: false
      }
    });
    setResult(null);

    try {
      const blogResult = await blogWriterService.createBlogFromVideo(
        videoFile,
        config,
        (agent: string, progress: number) => {
          setAgentState(prev => ({
            ...prev,
            currentAgent: agent,
            progress,
            agentProgress: {
              videoAnalyzer: agent !== 'Video Analyzer' || progress === 100,
              contentPlanner: progress > 20 && (agent !== 'Content Planner' || progress === 100),
              researcher: progress > 40 && (agent !== 'Researcher' || progress === 100),
              writer: progress > 60 && (agent !== 'Writer' || progress === 100),
              editor: progress > 80 && (agent !== 'Editor' || progress === 100)
            }
          }));
        }
      );

      setResult(blogResult);
      setAgentState(prev => ({
        ...prev,
        currentAgent: 'Completed',
        progress: 100,
        isProcessing: false,
        agentProgress: {
          videoAnalyzer: true,
          contentPlanner: true,
          researcher: true,
          writer: true,
          editor: true
        }
      }));
    } catch (error) {
      setAgentState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'An error occurred during blog creation',
        currentAgent: ''
      }));
    }
  };

  const handleReset = () => {
    setResult(null);
    setAgentState({
      currentAgent: '',
      progress: 0,
      isProcessing: false,
      error: null,
      agentProgress: {
        videoAnalyzer: false,
        contentPlanner: false,
        researcher: false,
        writer: false,
        editor: false
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Video Writer</h1>
              <p className="text-gray-600 mt-1">AI-powered multi-agent blog creation from video content</p>
            </div>
            {(result || agentState.isProcessing) && (
              <button
                onClick={handleReset}
                disabled={agentState.isProcessing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {agentState.isProcessing ? 'Processing...' : 'New Blog Post'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {!agentState.isProcessing && !result ? (
          <BlogWriterInterface 
            onStartWriting={handleStartWriting}
            isProcessing={agentState.isProcessing}
          />
        ) : agentState.isProcessing ? (
          <BlogWriterProgress 
            agentState={agentState}
          />
        ) : result ? (
          <BlogWriterResults 
            result={result}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>Blog Video Writer - Powered by Google Gemini AI &amp; Multi-Agent Collaboration</p>
            <p className="text-sm mt-2">Transform your videos into engaging blog posts with specialized AI agents</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
