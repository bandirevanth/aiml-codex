import React, { useState } from 'react';
import { Upload, Settings, FileText, Users, Target, BookOpen, Clock } from 'lucide-react';
import { VideoFile, BlogWritingConfig } from '../types';
import { TARGET_AUDIENCES, BLOG_STYLES, CONTENT_DEPTHS, WORD_COUNTS } from '../constants';

interface BlogWriterInterfaceProps {
  onStartWriting: (videoFile: VideoFile, config: BlogWritingConfig) => void;
  isProcessing: boolean;
}

const BlogWriterInterface: React.FC<BlogWriterInterfaceProps> = ({
  onStartWriting,
  isProcessing
}) => {
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [config, setConfig] = useState<BlogWritingConfig>({
    targetAudience: 'general',
    blogStyle: 'informative',
    contentDepth: 'intermediate',
    wordCount: 'medium',
    includeTranscript: false,
    includeTechnicalDetails: true,
    includeCallToAction: true
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      
      videoElement.onloadedmetadata = () => {
        setVideoFile({
          file,
          preview: URL.createObjectURL(file),
          duration: videoElement.duration,
          size: file.size
        });
      };
      
      videoElement.src = URL.createObjectURL(file);
    }
  };

  const handleStartWriting = () => {
    if (videoFile) {
      onStartWriting(videoFile, config);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Video Writer</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your videos into engaging blog posts using AI-powered multi-agent collaboration. 
          Upload a video and let our specialized agents analyze, plan, research, write, and edit your content.
        </p>
      </div>

      {/* Video Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Upload className="w-5 h-5 mr-2 text-blue-600" />
          Upload Video
        </h2>

        {!videoFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Upload a video file to create a blog post
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
            >
              Choose Video File
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Supports MP4, WebM, AVI (max 100MB, 10 minutes)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{videoFile.file.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(videoFile.size)} • {videoFile.duration ? formatDuration(videoFile.duration) : 'Unknown duration'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVideoFile(null)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>

            {videoFile.preview && (
              <video
                src={videoFile.preview}
                controls
                className="w-full max-w-md mx-auto rounded-lg"
                style={{ maxHeight: '200px' }}
              />
            )}
          </div>
        )}
      </div>

      {/* Configuration Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            Blog Configuration
          </h2>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Target Audience
            </label>
            <div className="space-y-2">
              {TARGET_AUDIENCES.map((audience) => (
                <label key={audience.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="targetAudience"
                    value={audience.id}
                    checked={config.targetAudience === audience.id}
                    onChange={(e) => setConfig({ ...config, targetAudience: e.target.value as any })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{audience.label}</div>
                    <div className="text-sm text-gray-600">{audience.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Blog Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Blog Style
            </label>
            <div className="space-y-2">
              {BLOG_STYLES.map((style) => (
                <label key={style.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="blogStyle"
                    value={style.id}
                    checked={config.blogStyle === style.id}
                    onChange={(e) => setConfig({ ...config, blogStyle: e.target.value as any })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Content Depth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Content Depth
            </label>
            <div className="space-y-2">
              {CONTENT_DEPTHS.map((depth) => (
                <label key={depth.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contentDepth"
                    value={depth.id}
                    checked={config.contentDepth === depth.id}
                    onChange={(e) => setConfig({ ...config, contentDepth: e.target.value as any })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{depth.label}</div>
                    <div className="text-sm text-gray-600">{depth.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Word Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Word Count
            </label>
            <div className="space-y-2">
              {WORD_COUNTS.map((count) => (
                <label key={count.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="wordCount"
                    value={count.id}
                    checked={config.wordCount === count.id}
                    onChange={(e) => setConfig({ ...config, wordCount: e.target.value as any })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{count.label}</div>
                    <div className="text-sm text-gray-600">{count.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Options</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeTranscript}
                  onChange={(e) => setConfig({ ...config, includeTranscript: e.target.checked })}
                  className="rounded"
                />
                <span className="text-gray-700">Include video transcript in blog post</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeTechnicalDetails}
                  onChange={(e) => setConfig({ ...config, includeTechnicalDetails: e.target.checked })}
                  className="rounded"
                />
                <span className="text-gray-700">Include technical details and specifications</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeCallToAction}
                  onChange={(e) => setConfig({ ...config, includeCallToAction: e.target.checked })}
                  className="rounded"
                />
                <span className="text-gray-700">Include call-to-action at the end</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={handleStartWriting}
          disabled={!videoFile || isProcessing}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-medium"
        >
          {isProcessing ? 'Creating Blog Post...' : 'Start Writing Blog Post'}
        </button>
        
        {videoFile && (
          <p className="text-sm text-gray-600 mt-2">
            Ready to transform your video into an engaging blog post
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogWriterInterface;
