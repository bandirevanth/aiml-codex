import React, { useState, ChangeEvent } from 'react';
import { VideoFile, CorrectiveConfig, CorrectiveReport, QueryContext } from './types';
import { CorrectiveRAGService } from './services/correctiveRagService';
import { CORRECTIVE_SETTINGS, EVALUATION_MODES, CORRECTION_STRATEGIES, QUERY_INTENTS, SUPPORTED_VIDEO_FORMATS } from './constants';

const App = () => {
  const [video, setVideo] = useState(null as VideoFile | null);
  const [query, setQuery] = useState('');
  const [config, setConfig] = useState({
    lowerThreshold: CORRECTIVE_SETTINGS.DEFAULT_LOWER_THRESHOLD,
    upperThreshold: CORRECTIVE_SETTINGS.DEFAULT_UPPER_THRESHOLD,
    maxSegments: CORRECTIVE_SETTINGS.MAX_SEGMENTS,
    evaluationMode: CORRECTIVE_SETTINGS.DEFAULT_EVALUATION_MODE,
    modalityWeights: { ...CORRECTIVE_SETTINGS.DEFAULT_MODALITY_WEIGHTS },
    correctionStrategies: { ...CORRECTIVE_SETTINGS.DEFAULT_CORRECTION_STRATEGIES }
  });
  const [queryContext, setQueryContext] = useState({
    originalQuery: '',
    intent: 'factual' as const,
    domain: '',
    complexity: 'moderate' as const
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null as CorrectiveReport | null);
  const [error, setError] = useState(null as string | null);

  const correctiveService = new CorrectiveRAGService();

  const handleVideoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
      const videoFile: VideoFile = {
        file,
        url: URL.createObjectURL(file),
        size: file.size
      };
      setVideo(videoFile);
      setError(null);
    } else {
      setError('Please upload a supported video format (MP4, MOV, AVI, WebM, MKV)');
    }
  };

  const handleAnalyze = async () => {
    if (!video || !query.trim()) {
      setError('Please upload a video and enter a query');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await correctiveService.processCorrectiveRAG(video, query, config);
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateConfig = (updates: Partial<CorrectiveConfig>) => {
    setConfig((prev: any) => ({ ...prev, ...updates }));
  };

  const updateQueryContext = (updates: Partial<QueryContext>) => {
    setQueryContext((prev: any) => ({ ...prev, ...updates }));
  };

  const getStrategyColor = (type: string) => {
    const strategy = CORRECTION_STRATEGIES.find(s => s.type === type);
    return strategy?.color || 'gray';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Corrective Video RAG
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced video analysis with corrective retrieval strategies - automatically detects relevance and applies appropriate correction methods
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Video Upload */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Upload Video</h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                {video ? (
                  <div className="space-y-4">
                    <video 
                      src={video.url} 
                      controls 
                      className="max-w-full h-48 mx-auto rounded"
                    />
                    <p className="text-gray-300">
                      {video.file.name} ({(video.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl text-gray-500 mb-4">📹</div>
                    <p className="text-gray-400 mb-4">Click to upload video</p>
                    <p className="text-sm text-gray-500">MP4, MOV, AVI, WebM, MKV formats</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors"
                >
                  {video ? 'Change Video' : 'Upload Video'}
                </label>
              </div>
            </div>

            {/* Query Input */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Query Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Query</label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your question about the video content..."
                    className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Query Intent</label>
                    <select
                      value={queryContext.intent}
                      onChange={(e) => updateQueryContext({ intent: e.target.value as any })}
                      className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      {QUERY_INTENTS.map(intent => (
                        <option key={intent.value} value={intent.value}>
                          {intent.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Domain</label>
                    <input
                      type="text"
                      value={queryContext.domain}
                      onChange={(e) => updateQueryContext({ domain: e.target.value })}
                      placeholder="e.g., education, technology, health"
                      className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Corrective Configuration</h3>
              <div className="space-y-6">
                {/* Thresholds */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Lower Threshold: {config.lowerThreshold}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="0.5"
                      step="0.05"
                      value={config.lowerThreshold}
                      onChange={(e) => updateConfig({ lowerThreshold: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Below this: Web search</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Upper Threshold: {config.upperThreshold}
                    </label>
                    <input
                      type="range"
                      min="0.6"
                      max="0.9"
                      step="0.05"
                      value={config.upperThreshold}
                      onChange={(e) => updateConfig({ upperThreshold: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Above this: Use video content</p>
                  </div>
                </div>

                {/* Evaluation Mode */}
                <div>
                  <label className="block text-gray-300 mb-2">Evaluation Mode</label>
                  <select
                    value={config.evaluationMode}
                    onChange={(e) => updateConfig({ evaluationMode: e.target.value as any })}
                    className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
                  >
                    {EVALUATION_MODES.map(mode => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label} - {mode.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modality Weights */}
                <div>
                  <label className="block text-gray-300 mb-3">Modality Weights</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Visual: {config.modalityWeights.visual}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.modalityWeights.visual}
                        onChange={(e) => updateConfig({
                          modalityWeights: {
                            ...config.modalityWeights,
                            visual: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Audio: {config.modalityWeights.audio}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.modalityWeights.audio}
                        onChange={(e) => updateConfig({
                          modalityWeights: {
                            ...config.modalityWeights,
                            audio: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Transcript: {config.modalityWeights.transcript}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.modalityWeights.transcript}
                        onChange={(e) => updateConfig({
                          modalityWeights: {
                            ...config.modalityWeights,
                            transcript: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Correction Strategies */}
                <div>
                  <label className="block text-gray-300 mb-3">Correction Strategies</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.correctionStrategies.enableWebSearch}
                        onChange={(e) => updateConfig({
                          correctionStrategies: {
                            ...config.correctionStrategies,
                            enableWebSearch: e.target.checked
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-gray-300">Enable Web Search</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.correctionStrategies.enableSegmentCombination}
                        onChange={(e) => updateConfig({
                          correctionStrategies: {
                            ...config.correctionStrategies,
                            enableSegmentCombination: e.target.checked
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-gray-300">Enable Segment Combination</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.correctionStrategies.enableContextExpansion}
                        onChange={(e) => updateConfig({
                          correctionStrategies: {
                            ...config.correctionStrategies,
                            enableContextExpansion: e.target.checked
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-gray-300">Enable Context Expansion</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!video || !query.trim() || isAnalyzing}
              className="w-full py-4 bg-red-600 text-white rounded-lg font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              {isAnalyzing ? 'Analyzing Video...' : 'Analyze with Corrective RAG'}
            </button>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {!report ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-6xl text-gray-500 mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready for Analysis</h3>
                <p className="text-gray-400 mb-4">
                  Upload a video and configure your corrective RAG settings to get started.
                </p>
                <div className="text-left space-y-2 text-sm text-gray-500">
                  <p>✓ Three-tier evaluation system</p>
                  <p>✓ Automatic correction strategies</p>
                  <p>✓ Multi-modal content analysis</p>
                  <p>✓ Quality metrics tracking</p>
                  <p>✓ Source attribution</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Strategy Used */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Correction Strategy</h3>
                  <div className={`p-4 rounded-lg border-2 border-${getStrategyColor(report.correctionStrategy.type)}-500 bg-${getStrategyColor(report.correctionStrategy.type)}-900`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">
                        {CORRECTION_STRATEGIES.find(s => s.type === report.correctionStrategy.type)?.label}
                      </span>
                      <span className="text-sm text-gray-300">
                        {(report.correctionStrategy.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      {report.correctionStrategy.action}
                    </p>
                    <div className="text-xs text-gray-400">
                      Sources: {report.correctionStrategy.sources.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Quality Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Average Relevance</span>
                      <span className="text-white font-semibold">
                        {(report.qualityMetrics.averageRelevance * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Correction Accuracy</span>
                      <span className="text-white font-semibold">
                        {(report.qualityMetrics.correctionAccuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Response Completeness</span>
                      <span className="text-white font-semibold">
                        {(report.qualityMetrics.responseCompleteness * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Source Reliability</span>
                      <span className="text-white font-semibold">
                        {(report.qualityMetrics.sourceReliability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Execution Time</span>
                      <span className="text-white font-semibold">
                        {(report.executionTime / 1000).toFixed(2)}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final Answer */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Final Answer</h3>
                  <div className="bg-gray-700 rounded p-4">
                    <p className="text-gray-300 leading-relaxed">
                      {report.finalAnswer}
                    </p>
                  </div>
                </div>

                {/* Evaluated Segments */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Top Segments ({report.evaluatedSegments.length})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {report.evaluatedSegments.slice(0, 5).map((segment) => (
                      <div key={segment.id} className="bg-gray-700 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-300 capitalize">
                            {segment.type}
                          </span>
                          <div className="text-right">
                            <div className="text-sm text-white font-semibold">
                              {(segment.relevanceScore * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">
                          {segment.content.substring(0, 100)}
                          {segment.content.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {report.recommendations.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Recommendations</h3>
                    <ul className="space-y-2">
                      {report.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          <span className="text-gray-300 text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
