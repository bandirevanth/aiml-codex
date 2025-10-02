import React, { useState } from 'react';
import { Settings, Eye, TrendingUp, Shield, Bell, Zap } from 'lucide-react';
import { VideoAnalysisConfig } from '../types';
import { ANALYSIS_FOCUS_AREAS } from '../constants';

interface MonitoringConfigurationProps {
  onConfigComplete: (config: VideoAnalysisConfig) => void;
}

export const MonitoringConfiguration: React.FC<MonitoringConfigurationProps> = ({ onConfigComplete }) => {
  const [config, setConfig] = useState<VideoAnalysisConfig>({
    analysisDepth: 'comprehensive',
    focusAreas: [],
    sentimentAnalysis: true,
    competitorComparison: true,
    trendAnalysis: true,
    realTimeAlerts: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.focusAreas.length > 0) {
      onConfigComplete(config);
    }
  };

  const toggleFocusArea = (area: string) => {
    const newFocusAreas = config.focusAreas.includes(area)
      ? config.focusAreas.filter(a => a !== area)
      : [...config.focusAreas, area];
    setConfig({ ...config, focusAreas: newFocusAreas });
  };

  const analysisDepthOptions = [
    {
      value: 'basic',
      label: 'Basic Analysis',
      description: 'Quick brand detection and basic sentiment analysis',
      icon: Eye,
      time: '1-2 minutes'
    },
    {
      value: 'comprehensive',
      label: 'Comprehensive Analysis',
      description: 'Detailed brand monitoring with competitor comparison',
      icon: TrendingUp,
      time: '3-5 minutes'
    },
    {
      value: 'detailed',
      label: 'Detailed Analysis',
      description: 'In-depth analysis with risk assessment and strategic insights',
      icon: Shield,
      time: '5-8 minutes'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Monitoring Configuration</h2>
        <p className="text-gray-600">Customize your brand monitoring analysis settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Analysis Depth */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Analysis Depth</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisDepthOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    config.analysisDepth === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setConfig({ ...config, analysisDepth: option.value as any })}
                >
                  <div className="flex items-center mb-2">
                    <IconComponent className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">{option.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                  <p className="text-xs text-blue-600 font-medium">Est. time: {option.time}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Eye className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Analysis Focus Areas *</h3>
          </div>
          
          <p className="text-gray-600 mb-4">Select the areas you want to focus on during brand monitoring</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ANALYSIS_FOCUS_AREAS.map(area => (
              <button
                key={area}
                type="button"
                onClick={() => toggleFocusArea(area)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  config.focusAreas.includes(area)
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Advanced Options</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <h4 className="font-medium text-gray-900">Sentiment Analysis</h4>
                <p className="text-sm text-gray-600">Analyze emotional tone and brand perception</p>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, sentimentAnalysis: !config.sentimentAnalysis })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.sentimentAnalysis ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.sentimentAnalysis ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <h4 className="font-medium text-gray-900">Competitor Comparison</h4>
                <p className="text-sm text-gray-600">Compare against competitor brand presence</p>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, competitorComparison: !config.competitorComparison })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.competitorComparison ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.competitorComparison ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <h4 className="font-medium text-gray-900">Trend Analysis</h4>
                <p className="text-sm text-gray-600">Track brand performance trends over time</p>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, trendAnalysis: !config.trendAnalysis })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.trendAnalysis ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.trendAnalysis ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <h4 className="font-medium text-gray-900">Real-time Alerts</h4>
                <p className="text-sm text-gray-600">Enable instant notifications for brand mentions</p>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, realTimeAlerts: !config.realTimeAlerts })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.realTimeAlerts ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.realTimeAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Alert Configuration */}
        {config.realTimeAlerts && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Alert Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Frequency
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  defaultValue="immediate"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Channels
                </label>
                <div className="space-y-2">
                  {['Email', 'SMS', 'Webhook', 'Dashboard'].map(channel => (
                    <label key={channel} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        defaultChecked={channel === 'Dashboard'}
                      />
                      <span className="ml-2 text-sm text-gray-700">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={config.focusAreas.length === 0}
            className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Continue to Video Upload
          </button>
        </div>
      </form>
    </div>
  );
};
