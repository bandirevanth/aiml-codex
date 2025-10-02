import React, { useState } from 'react';
import { ParsedRAGResponse } from '../types';

interface RAGResultsProps {
  results: ParsedRAGResponse;
}

export const RAGResults: React.FC<RAGResultsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'retrieval', label: 'Retrieval', icon: '🔍' },
    { id: 'contextual', label: 'Contextual', icon: '🧠' },
    { id: 'knowledge', label: 'Knowledge', icon: '📚' },
    { id: 'insights', label: 'Insights', icon: '💡' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Analysis Summary</h4>
              <p className="text-gray-300">{results.summary}</p>
            </div>
            
            {results.insights && results.insights.length > 0 && (
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-300 mb-3">Key Insights</h4>
                <ul className="space-y-2">
                  {results.insights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-gray-300">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.nextSteps && results.nextSteps.length > 0 && (
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-300 mb-3">Next Steps</h4>
                <ul className="space-y-2">
                  {results.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-400 font-bold">{index + 1}.</span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'retrieval':
        return (
          <div className="space-y-4">
            {results.retrievalResults && results.retrievalResults.length > 0 ? (
              results.retrievalResults.map((result, index) => (
                <div key={index} className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-purple-300">Result #{index + 1}</h4>
                    <div className="flex space-x-2">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                        Relevance: {(result.relevanceScore * 100).toFixed(1)}%
                      </span>
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        Context: {(result.contextualMatch * 100).toFixed(1)}%
                      </span>
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                        Similarity: {(result.semanticSimilarity * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{result.explanation}</p>
                  
                  {result.keyMoments && result.keyMoments.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-semibold text-gray-400 mb-2">Key Moments</h5>
                      <div className="space-y-1">
                        {result.keyMoments.map((moment, momentIndex) => (
                          <div key={momentIndex} className="flex items-center space-x-2 text-sm">
                            <span className="text-yellow-400">⏱️</span>
                            <span className="text-gray-400">{moment.timestamp}s:</span>
                            <span className="text-gray-300">{moment.description}</span>
                            <span className="text-green-400">({(moment.confidence * 100).toFixed(0)}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No retrieval results available for this analysis.</p>
              </div>
            )}
          </div>
        );

      case 'contextual':
        return (
          <div className="space-y-4">
            {results.contextualAnalysis ? (
              <>
                {results.contextualAnalysis.compressionMetrics && (
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-3">Compression Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400">Original Length:</span>
                        <span className="text-white ml-2">{results.contextualAnalysis.compressionMetrics.originalLength}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Compressed Length:</span>
                        <span className="text-white ml-2">{results.contextualAnalysis.compressionMetrics.compressedLength}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Compression Ratio:</span>
                        <span className="text-white ml-2">{(results.contextualAnalysis.compressionMetrics.compressionRatio * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Quality Score:</span>
                        <span className="text-white ml-2">{(results.contextualAnalysis.compressionMetrics.qualityScore * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-semibold text-green-300 mb-2">Preserved Elements</h5>
                        <ul className="space-y-1">
                          {results.contextualAnalysis.compressionMetrics.preservedElements.map((element, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                              <span className="text-green-400">✓</span>
                              <span>{element}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-red-300 mb-2">Removed Elements</h5>
                        <ul className="space-y-1">
                          {results.contextualAnalysis.compressionMetrics.removedElements.map((element, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                              <span className="text-red-400">✗</span>
                              <span>{element}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {results.contextualAnalysis.relevantChunks && results.contextualAnalysis.relevantChunks.length > 0 && (
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3">Relevant Chunks</h4>
                    <div className="space-y-3">
                      {results.contextualAnalysis.relevantChunks.map((chunk, index) => (
                        <div key={index} className="border border-gray-600 rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-300">Chunk {index + 1}</span>
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                              Relevance: {(chunk.contextualRelevance * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            <span>Time: {chunk.startTime}s - {chunk.endTime}s</span>
                            <span className="ml-4">Frames: {chunk.frames.length}</span>
                          </div>
                          {chunk.visualFeatures.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">Visual Features: </span>
                              <span className="text-xs text-gray-300">{chunk.visualFeatures.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No contextual analysis data available.</p>
              </div>
            )}
          </div>
        );

      case 'knowledge':
        return (
          <div className="space-y-4">
            {results.knowledgeExtraction ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-3">Entities</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.knowledgeExtraction.entities.map((entity, index) => (
                        <span key={index} className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3">Concepts</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.knowledgeExtraction.concepts.map((concept, index) => (
                        <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-300 mb-3">Relationships</h4>
                  <div className="space-y-2">
                    {results.knowledgeExtraction.relationships.map((relationship, index) => (
                      <div key={index} className="text-sm text-gray-300 bg-gray-600 bg-opacity-50 p-2 rounded">
                        {relationship}
                      </div>
                    ))}
                  </div>
                </div>

                {results.knowledgeExtraction.timeline && results.knowledgeExtraction.timeline.length > 0 && (
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-3">Timeline</h4>
                    <div className="space-y-3">
                      {results.knowledgeExtraction.timeline.map((event, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-16 text-sm text-gray-400">
                            {event.timestamp}s
                          </div>
                          <div className="flex-1 text-sm text-gray-300">
                            {event.event}
                          </div>
                          <div className="flex-shrink-0">
                            <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                              {(event.importance * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No knowledge extraction data available.</p>
              </div>
            )}
          </div>
        );

      case 'insights':
        return (
          <div className="space-y-4">
            {results.insights && results.insights.length > 0 ? (
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-300 mb-3">Analysis Insights</h4>
                <div className="space-y-3">
                  {results.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-600 bg-opacity-50 rounded">
                      <span className="text-yellow-400 text-lg">💡</span>
                      <span className="text-gray-300">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No insights available for this analysis.</p>
              </div>
            )}

            {results.nextSteps && results.nextSteps.length > 0 && (
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-300 mb-3">Recommended Actions</h4>
                <div className="space-y-2">
                  {results.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-600 bg-opacity-50 rounded">
                      <span className="text-green-400 font-bold">{index + 1}.</span>
                      <span className="text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>Select a tab to view results</div>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-gray-600 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};
