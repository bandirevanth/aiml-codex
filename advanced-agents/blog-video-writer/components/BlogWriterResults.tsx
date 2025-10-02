import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Eye, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle,
  BookOpen,
  Users,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { BlogWritingResult } from '../types';

interface BlogWriterResultsProps {
  result: BlogWritingResult;
}

const BlogWriterResults: React.FC<BlogWriterResultsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'blog' | 'analysis' | 'outline' | 'research'>('blog');
  const [copied, setCopied] = useState(false);

  const handleCopyBlog = async () => {
    try {
      await navigator.clipboard.writeText(result.editedBlog.finalContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadBlog = () => {
    const blob = new Blob([result.editedBlog.finalContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.editedBlog.finalTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatProcessingTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Created Successfully!</h1>
        <p className="text-lg text-gray-600">
          Your video has been transformed into an engaging blog post through AI collaboration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{result.editedBlog.finalWordCount}</div>
          <div className="text-sm text-gray-600">Words</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{result.editedBlog.estimatedReadingTime}</div>
          <div className="text-sm text-gray-600">Min Read</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${getQualityColor(result.metadata.qualityScore)}`}>
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{result.metadata.qualityScore}</div>
          <div className="text-sm text-gray-600">Quality Score</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatProcessingTime(result.metadata.processingTime)}</div>
          <div className="text-sm text-gray-600">Processing Time</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'blog', label: 'Final Blog Post', icon: FileText },
              { id: 'analysis', label: 'Video Analysis', icon: Eye },
              { id: 'outline', label: 'Content Outline', icon: BookOpen },
              { id: 'research', label: 'Research Data', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{result.editedBlog.finalTitle}</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCopyBlog}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadBlog}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {result.editedBlog.finalContent}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Editorial Improvements
                  </h3>
                  <ul className="space-y-2">
                    {result.editedBlog.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-green-800">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    SEO Optimizations
                  </h3>
                  <ul className="space-y-2">
                    {result.editedBlog.seoOptimizations.map((optimization, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-blue-800">{optimization}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Video Analysis Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                  <p className="text-gray-700">{result.videoAnalysis.summary}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.videoAnalysis.keyTopics.map((topic, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
                  <ul className="space-y-2">
                    {result.videoAnalysis.technicalDetails.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Elements</h3>
                  <ul className="space-y-2">
                    {result.videoAnalysis.visualElements.map((element, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{element}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outline' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Content Structure and Outline</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Title</h3>
                  <p className="text-blue-800 text-xl">{result.contentOutline.title}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Introduction</h3>
                  <p className="text-gray-700">{result.contentOutline.introduction}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Main Sections</h3>
                  {result.contentOutline.mainSections.map((section, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-medium text-gray-900">{section.heading}</h4>
                        <span className="text-sm text-gray-500">~{section.estimatedWords} words</span>
                      </div>
                      <ul className="space-y-1">
                        {section.keyPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Conclusion</h3>
                  <p className="text-gray-700">{result.contentOutline.conclusion}</p>
                </div>

                {result.contentOutline.callToAction && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Call to Action</h3>
                    <p className="text-green-800">{result.contentOutline.callToAction}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Research and Supporting Data</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Background Information
                  </h3>
                  <ul className="space-y-2">
                    {result.researchData.backgroundInfo.map((info, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.researchData.relatedTopics.map((topic, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Technical Context
                  </h3>
                  <ul className="space-y-2">
                    {result.researchData.technicalContext.map((context, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{context}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Industry Insights
                  </h3>
                  <ul className="space-y-2">
                    {result.researchData.industryInsights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.researchData.expertQuotes.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Expert Quotes and References</h3>
                  <div className="space-y-3">
                    {result.researchData.expertQuotes.map((quote, index) => (
                      <blockquote key={index} className="border-l-4 border-blue-400 pl-4 italic text-blue-800">
                        {quote}
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Agent Contributions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.metadata.agentContributions.map((contribution, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Agent {index + 1}</span>
              </div>
              <p className="text-sm text-gray-700">{contribution}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogWriterResults;
