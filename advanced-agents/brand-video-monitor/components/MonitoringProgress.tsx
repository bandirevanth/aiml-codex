import React from 'react';
import { Shield, TrendingUp, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { MonitoringProgress as MonitoringProgressType } from '../types';

interface MonitoringProgressProps {
  progress: MonitoringProgressType;
}

export const MonitoringProgress: React.FC<MonitoringProgressProps> = ({ progress }) => {
  const getStatusIcon = () => {
    switch (progress.status) {
      case 'analyzing':
        return <Shield className="h-8 w-8 text-blue-600 animate-pulse" />;
      case 'processing':
        return <TrendingUp className="h-8 w-8 text-purple-600 animate-pulse" />;
      case 'generating':
        return <Users className="h-8 w-8 text-green-600 animate-pulse" />;
      case 'complete':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-8 w-8 text-red-600" />;
      default:
        return <Clock className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'analyzing':
        return 'blue';
      case 'processing':
        return 'purple';
      case 'generating':
        return 'green';
      case 'complete':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const statusColor = getStatusColor();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Brand Monitoring Analysis</h2>
        <p className="text-gray-600">Analyzing your video content for brand insights</p>
      </div>

      {/* Progress Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress.progress / 100)}`}
              className={`text-${statusColor}-600 transition-all duration-500 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {getStatusIcon()}
          </div>
        </div>
      </div>

      {/* Progress Info */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className={`text-2xl font-bold text-${statusColor}-600 mb-1`}>
            {progress.progress}%
          </div>
          <div className="text-lg font-medium text-gray-900 mb-2">
            {progress.currentStep}
          </div>
          <div className="text-sm text-gray-600">
            {progress.details}
          </div>
        </div>

        {progress.estimatedTimeRemaining !== '0 seconds' && progress.status !== 'complete' && (
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            Estimated time remaining: {progress.estimatedTimeRemaining}
          </div>
        )}
      </div>

      {/* Analysis Steps */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">Analysis Pipeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: 'Video Processing',
              description: 'Extracting frames and audio',
              icon: Shield,
              completed: progress.progress > 20
            },
            {
              step: 'Brand Detection',
              description: 'Identifying brand elements',
              icon: TrendingUp,
              completed: progress.progress > 50
            },
            {
              step: 'Sentiment Analysis',
              description: 'Analyzing emotional context',
              icon: Users,
              completed: progress.progress > 75
            },
            {
              step: 'Report Generation',
              description: 'Compiling insights',
              icon: CheckCircle,
              completed: progress.progress >= 100
            }
          ].map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  step.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  <IconComponent
                    className={`h-5 w-5 mr-2 ${
                      step.completed ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                  <h4 className={`font-medium ${
                    step.completed ? 'text-green-900' : 'text-gray-700'
                  }`}>
                    {step.step}
                  </h4>
                </div>
                <p className={`text-sm ${
                  step.completed ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Messages */}
      {progress.status === 'error' && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h4 className="font-medium text-red-900">Analysis Error</h4>
              <p className="text-red-700">{progress.details}</p>
            </div>
          </div>
        </div>
      )}

      {progress.status === 'complete' && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <h4 className="font-medium text-green-900">Analysis Complete</h4>
              <p className="text-green-700">Your brand monitoring report is ready!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
