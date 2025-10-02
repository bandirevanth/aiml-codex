import React, { useState } from 'react';
import { 
  Shield, TrendingUp, Users, AlertTriangle, Eye, Star, 
  Download, Share2, RefreshCw, BarChart3, PieChart, 
  LineChart, Activity, Target, Zap, Bell, CheckCircle,
  XCircle, AlertCircle, Info, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { BrandMonitoringReport } from '../types';

interface MonitoringResultsProps {
  report: BrandMonitoringReport;
  onNewAnalysis: () => void;
}

export const MonitoringResults: React.FC<MonitoringResultsProps> = ({ report, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'brand-analysis', label: 'Brand Analysis', icon: Shield },
    { id: 'sentiment', label: 'Sentiment', icon: Activity },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Target }
  ];

  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', { rating: userRating, comment: userComment });
    setShowFeedbackModal(false);
    setUserRating(0);
    setUserComment('');
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Brand Visibility</p>
              <p className="text-2xl font-bold text-blue-900">
                {report.videoAnalysis.brandPresence.brandVisibility}%
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Sentiment Score</p>
              <p className="text-2xl font-bold text-green-900">
                {(report.videoAnalysis.sentimentAnalysis.sentimentScore * 100).toFixed(0)}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Logo Detections</p>
              <p className="text-2xl font-bold text-purple-900">
                {report.videoAnalysis.brandPresence.logoDetections}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Risk Level</p>
              <p className={`text-2xl font-bold capitalize ${
                report.videoAnalysis.riskAssessment.reputationRisk === 'low' ? 'text-green-900' :
                report.videoAnalysis.riskAssessment.reputationRisk === 'medium' ? 'text-yellow-900' :
                'text-red-900'
              }`}>
                {report.videoAnalysis.riskAssessment.reputationRisk}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(report.alerts.criticalAlerts.length > 0 || report.alerts.warningAlerts.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
          
          {report.alerts.criticalAlerts.map((alert, index) => (
            <div key={index} className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="font-medium text-red-900">Critical Alert</p>
                <p className="text-red-700">{alert}</p>
              </div>
            </div>
          ))}

          {report.alerts.warningAlerts.map((alert, index) => (
            <div key={index} className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-yellow-900">Warning</p>
                <p className="text-yellow-700">{alert}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Insights */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Findings</h3>
        <div className="space-y-3">
          {report.insights.keyFindings.map((finding, index) => (
            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <p className="text-gray-700">{finding}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBrandAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Presence Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Logo Detections</span>
              <span className="font-semibold">{report.videoAnalysis.brandPresence.logoDetections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Product Mentions</span>
              <span className="font-semibold">{report.videoAnalysis.brandPresence.productMentions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Brand Visibility</span>
              <span className="font-semibold">{report.videoAnalysis.brandPresence.brandVisibility}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Context Relevance</span>
              <span className="font-semibold">{report.videoAnalysis.brandPresence.contextualRelevance}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Positioning</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Message Alignment</span>
              <span className="font-semibold">{report.videoAnalysis.brandPositioning.messageAlignment}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Value Proposition Clarity</span>
              <span className="font-semibold">{report.videoAnalysis.brandPositioning.valuePropositionClarity}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Brand Consistency</span>
              <span className="font-semibold">{report.videoAnalysis.brandPositioning.brandConsistency}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Audience Relevance</span>
              <span className="font-semibold">{report.videoAnalysis.brandPositioning.targetAudienceRelevance}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSentiment = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 border rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <span className="text-gray-600">Overall Sentiment</span>
              <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                getSentimentColor(report.videoAnalysis.sentimentAnalysis.overallSentiment)
              }`}>
                {report.videoAnalysis.sentimentAnalysis.overallSentiment}
              </div>
            </div>
            <div className="mb-4">
              <span className="text-gray-600">Sentiment Score</span>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      report.videoAnalysis.sentimentAnalysis.sentimentScore > 0 ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    style={{ 
                      width: `${Math.abs(report.videoAnalysis.sentimentAnalysis.sentimentScore) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">
                  {(report.videoAnalysis.sentimentAnalysis.sentimentScore * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-gray-600">Emotional Tone</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {report.videoAnalysis.sentimentAnalysis.emotionalTone.map((emotion, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-gray-600">Audience Reaction</span>
          <p className="mt-1 text-gray-700">{report.videoAnalysis.sentimentAnalysis.audienceReaction}</p>
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Competitor Analysis</h3>
      {report.videoAnalysis.competitorAnalysis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.videoAnalysis.competitorAnalysis.map((competitor, index) => (
            <div key={index} className="bg-white p-6 border rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">{competitor.competitorName}</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mentions</span>
                  <span className="font-medium">{competitor.mentions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sentiment</span>
                  <span className="font-medium">{(competitor.sentiment * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility</span>
                  <span className="font-medium">{competitor.visibility}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Share</span>
                  <span className="font-medium">{competitor.marketShare}%</span>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">Strengths</span>
                  <ul className="mt-1 text-sm text-gray-700">
                    {competitor.strengths.map((strength, idx) => (
                      <li key={idx}>• {strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">Weaknesses</span>
                  <ul className="mt-1 text-sm text-gray-700">
                    {competitor.weaknesses.map((weakness, idx) => (
                      <li key={idx}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No competitor activity detected in this video.</p>
      )}
    </div>
  );

  const renderRisks = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 border rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-gray-600">Reputation Risk Level</span>
            <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-medium ${
              getRiskColor(report.videoAnalysis.riskAssessment.reputationRisk)
            }`}>
              {report.videoAnalysis.riskAssessment.reputationRisk}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Crisis Indicators</span>
            <div className="mt-2">
              {report.videoAnalysis.riskAssessment.crisisIndicators.length > 0 ? (
                <ul className="text-sm text-gray-700">
                  {report.videoAnalysis.riskAssessment.crisisIndicators.map((indicator, index) => (
                    <li key={index}>• {indicator}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-600">No crisis indicators detected</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <span className="text-gray-600">Recommended Actions</span>
          <ul className="mt-2 space-y-1">
            {report.videoAnalysis.riskAssessment.recommendedActions.map((action, index) => (
              <li key={index} className="flex items-start">
                <Target className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                <span className="text-gray-700">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trend</h3>
          <div className="space-y-2">
            {report.trends.sentimentTrend.slice(-5).map((point, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{point.date}</span>
                <span className={`text-sm font-medium ${
                  point.score > 0.5 ? 'text-green-600' : point.score < -0.5 ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {(point.score * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentions Trend</h3>
          <div className="space-y-2">
            {report.trends.mentionsTrend.slice(-5).map((point, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{point.date}</span>
                <span className="text-sm font-medium text-blue-600">{point.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trend</h3>
          <div className="space-y-2">
            {report.trends.engagementTrend.slice(-5).map((point, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{point.date}</span>
                <span className="text-sm font-medium text-purple-600">
                  {(point.rate * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Opportunities</h3>
          <div className="space-y-3">
            {report.insights.opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start">
                <ThumbsUp className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-700">{opportunity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Threats</h3>
          <div className="space-y-3">
            {report.insights.threats.map((threat, index) => (
              <div key={index} className="flex items-start">
                <ThumbsDown className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                <span className="text-gray-700">{threat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.insights.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
              <Target className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <span className="text-gray-700">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Brand Monitoring Report</h2>
            <p className="text-gray-600">
              Analysis completed for {report.brandProfile.brandName} • {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => navigator.share?.({ title: 'Brand Monitoring Report', text: 'Check out this brand monitoring analysis' })}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            <button
              onClick={onNewAnalysis}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'brand-analysis' && renderBrandAnalysis()}
        {activeTab === 'sentiment' && renderSentiment()}
        {activeTab === 'competitors' && renderCompetitors()}
        {activeTab === 'risks' && renderRisks()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'recommendations' && renderRecommendations()}
      </div>

      {/* Feedback Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">How was this analysis?</h3>
            <p className="text-gray-600">Your feedback helps us improve our brand monitoring capabilities</p>
          </div>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Star className="h-4 w-4 mr-2" />
            Rate Analysis
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate This Analysis</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setUserRating(rating)}
                    className={`p-1 ${
                      rating <= userRating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Share your thoughts about this analysis..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={userRating === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
