import React, { useState, useRef } from 'react';
import { Upload, Video, AlertCircle, CheckCircle } from 'lucide-react';
import { BrandProfile, VideoAnalysisConfig, BrandMonitoringReport, MonitoringProgress } from '../types';
import { brandMonitoringService } from '../services/brandMonitoringService';

interface VideoUploadProps {
  profile: BrandProfile;
  config: VideoAnalysisConfig;
  onMonitoringComplete: (report: BrandMonitoringReport) => void;
  onProgress: (progress: MonitoringProgress) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  profile,
  config,
  onMonitoringComplete,
  onProgress
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a valid video file');
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a valid video file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const report = await brandMonitoringService.analyzeVideoForBrandMonitoring(
        selectedFile,
        profile,
        config,
        onProgress
      );
      onMonitoringComplete(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setIsAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Video Upload</h2>
        <p className="text-gray-600">Upload your video content for brand monitoring analysis</p>
      </div>

      {/* Configuration Summary */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Analysis Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Brand:</span> {profile.brandName}
          </div>
          <div>
            <span className="font-medium text-blue-800">Industry:</span> {profile.industry}
          </div>
          <div>
            <span className="font-medium text-blue-800">Analysis Depth:</span> {config.analysisDepth}
          </div>
          <div>
            <span className="font-medium text-blue-800">Focus Areas:</span> {config.focusAreas.length} selected
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            selectedFile
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div>
                <p className="text-lg font-medium text-green-900">{selectedFile.name}</p>
                <p className="text-sm text-green-700">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Choose different file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Video className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop your video file here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports MP4, MOV, AVI, and other common video formats
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Analysis Information */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What we'll analyze:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Brand Presence</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Logo detection and visibility</li>
              <li>• Product placement analysis</li>
              <li>• Brand mention frequency</li>
              <li>• Context relevance scoring</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Sentiment & Risk</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Emotional tone analysis</li>
              <li>• Audience reaction assessment</li>
              <li>• Reputation risk evaluation</li>
              <li>• Crisis indicator detection</li>
            </ul>
          </div>
          {config.competitorComparison && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Competitive Analysis</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Competitor brand detection</li>
                <li>• Market share comparison</li>
                <li>• Positioning analysis</li>
                <li>• Competitive advantages</li>
              </ul>
            </div>
          )}
          {config.trendAnalysis && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Trend Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Performance trending</li>
                <li>• Engagement patterns</li>
                <li>• Sentiment evolution</li>
                <li>• Market positioning shifts</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Start Over
        </button>
        
        <button
          onClick={startAnalysis}
          disabled={!selectedFile || isAnalyzing}
          className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Start Brand Monitoring
            </>
          )}
        </button>
      </div>
    </div>
  );
};
