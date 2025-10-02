import React, { useRef, useState } from 'react';
import { FrameData } from '../types';

interface VideoUploadProps {
  onFramesExtracted: (frames: FrameData[]) => void;
  maxFrames: number;
  compact?: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ 
  onFramesExtracted, 
  maxFrames, 
  compact = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const extractFrames = async (videoFile: File): Promise<FrameData[]> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const frameInterval = duration / maxFrames;
        const frames: FrameData[] = [];
        let currentTime = 0;
        let frameCount = 0;

        const captureFrame = () => {
          if (frameCount >= maxFrames) {
            resolve(frames);
            return;
          }

          video.currentTime = currentTime;
          
          video.onseeked = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64 = (reader.result as string).split(',')[1];
                  frames.push({
                    id: `frame-${frameCount}`,
                    base64Data: base64,
                    mimeType: 'image/jpeg'
                  });
                  
                  frameCount++;
                  currentTime += frameInterval;
                  captureFrame();
                };
                reader.readAsDataURL(blob);
              }
            }, 'image/jpeg', 0.8);
          };
        };

        captureFrame();
      };

      video.src = URL.createObjectURL(videoFile);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    setIsExtracting(true);
    try {
      const frames = await extractFrames(file);
      onFramesExtracted(frames);
    } catch (error) {
      console.error('Error extracting frames:', error);
      alert('Error processing video. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isExtracting}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors duration-200"
        >
          {isExtracting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Add Video</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {isExtracting ? (
        <div className="space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-gray-300">Extracting video frames...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-4xl">📹</div>
          <div>
            <p className="text-gray-300 mb-2">Upload a video to analyze</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Choose Video File
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Supports MP4, WebM, AVI and other video formats
          </p>
        </div>
      )}
    </div>
  );
};
