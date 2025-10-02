
import React, { useState, useCallback, useRef } from 'react';
import { FrameData } from '../types';
import { Loader } from './Loader'; // Assuming Loader component exists

interface VideoInputProps {
  onVideoUploaded: (file: File, frames: FrameData[]) => void;
  maxFrames: number;
  setGlobalStatusMessage: (message: string) => void;
  setGlobalError: (error: string | null) => void;
}

export const VideoInput: React.FC<VideoInputProps> = ({ 
    onVideoUploaded, 
    maxFrames,
    setGlobalStatusMessage,
    setGlobalError
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractFrames = useCallback(async (videoFile: File): Promise<FrameData[]> => {
    setGlobalStatusMessage(`Loading video metadata for ${videoFile.name}...`);
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata'; // Important for getting metadata quickly
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const frames: FrameData[] = [];
      let framesExtracted = 0;

      video.onloadedmetadata = async () => {
        setGlobalStatusMessage(`Extracting ${maxFrames} frames from ${videoFile.name}...`);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const duration = video.duration;

        if (duration === 0 || !isFinite(duration) || video.videoWidth === 0 || video.videoHeight === 0) {
          URL.revokeObjectURL(video.src); // Clean up
          reject(new Error("Could not determine video duration or dimensions. The video file might be corrupt or unsupported."));
          return;
        }
        
        const timePoints: number[] = [];
        // Fix: Changed 'numFrames' to 'maxFrames' as 'numFrames' was not defined and 'maxFrames' is the intended variable.
        if (maxFrames <= 1) { // numFrames is maxFrames here
          timePoints.push(Math.min(0.1, duration / 2)); // Start or mid frame, ensure it's not 0 for some players
        } else {
          for (let i = 0; i < maxFrames; i++) {
            // Ensure points are within duration and spread out
            timePoints.push(Math.max(0, (i / (maxFrames -1)) * (duration - 0.1) )); // -0.1 to avoid issues at the very end
          }
        }
        // Ensure first frame is at or near 0
        if (timePoints.length > 0) timePoints[0] = Math.max(0, timePoints[0]);


        const captureFrameAtTime = (time: number): Promise<void> => {
          return new Promise<void>((resolveFrame, rejectFrame) => {
            video.currentTime = time;
            
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked); // Clean up listener
              video.removeEventListener('error', onErrorSeeking);
              if (ctx) {
                try {
                  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                  const mimeType = 'image/jpeg' as 'image/jpeg' | 'image/png';
                  // Get base64 string without the data URI prefix
                  const base64Data = canvas.toDataURL(mimeType, 0.85).split(',')[1]; // 0.85 quality for JPEG
                  frames.push({ id: `frame-${framesExtracted}`, base64Data, mimeType });
                  framesExtracted++;
                  resolveFrame();
                } catch(e) {
                   console.error("Error drawing image to canvas:", e);
                   rejectFrame(new Error("Error drawing video frame to canvas."));
                }
              } else {
                rejectFrame(new Error("Canvas context not available."));
              }
            };

            const onErrorSeeking = (e: Event) => {
                video.removeEventListener('seeked', onSeeked);
                video.removeEventListener('error', onErrorSeeking);
                console.error("Error seeking video frame at time:", time, e);
                rejectFrame(new Error(`Error seeking video frame at ${time.toFixed(2)}s.`));
            };

            video.addEventListener('seeked', onSeeked, { once: true });
            video.addEventListener('error', onErrorSeeking, { once: true });
          });
        };

        (async () => {
          try {
            for (const time of timePoints) {
              if (framesExtracted < maxFrames) {
                await captureFrameAtTime(Math.max(0, Math.min(time, duration - 0.01))); // Clamp time
              }
            }
            URL.revokeObjectURL(video.src); // Clean up object URL
            resolve(frames);
          } catch (error) {
            URL.revokeObjectURL(video.src);
            reject(error);
          }
        })();
      };

      // Fix: Explicitly typed the event parameter 'e' as 'Event' in the 'video.onerror' handler to resolve type error for 'e.target'.
      video.onerror = (e: Event) => {
        URL.revokeObjectURL(video.src);
        const errorTarget = e.target as HTMLVideoElement;
        let message = "Failed to load video metadata.";
        if(errorTarget.error) {
            message += ` Code: ${errorTarget.error.code}, Message: ${errorTarget.error.message}`;
        }
        reject(new Error(message + " The video file might be corrupt or in an unsupported format."));
      };

      video.src = URL.createObjectURL(videoFile);
      video.load(); // Explicitly call load for some browsers / scenarios
    });
  }, [maxFrames, setGlobalStatusMessage]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setFileName(file.name);
      setGlobalError(null);
      setGlobalStatusMessage(`Processing ${file.name}...`);
      try {
        const extractedFrames = await extractFrames(file);
        if (extractedFrames.length === 0) {
            throw new Error("No frames could be extracted. The video might be too short or in an unsupported format.");
        }
        onVideoUploaded(file, extractedFrames);
        setGlobalStatusMessage(`${extractedFrames.length} frames extracted successfully from ${file.name}.`);
      } catch (err) {
        console.error("Frame extraction error:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during frame extraction.";
        setGlobalError(errorMessage);
        setGlobalStatusMessage(`Error processing ${file.name}.`);
        setFileName(null); // Reset filename on error
      } finally {
        setIsProcessing(false);
        // Reset file input to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    }
  }, [extractFrames, onVideoUploaded, setGlobalError, setGlobalStatusMessage]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 p-6 bg-gray-700 bg-opacity-40 rounded-lg shadow-lg">
      <label htmlFor="video-upload" className="block text-lg font-semibold text-purple-300 mb-2">
        Upload Video
      </label>
      <div 
        className="flex items-center justify-center w-full px-4 py-10 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer hover:border-purple-400 transition-colors duration-300 bg-gray-700 hover:bg-gray-600"
        onClick={handleButtonClick}
        onDrop={(e) => { 
            e.preventDefault(); 
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                // Manually create a ChangeEvent-like object for handleFileChange
                handleFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
            }
        }}
        onDragOver={(e) => e.preventDefault()} // Necessary for onDrop to work
      >
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          disabled={isProcessing}
        />
        {isProcessing ? (
          <div className="text-center">
            <Loader className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-sm text-gray-400">Processing video...</p>
          </div>
        ) : (
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-400">
              <span className="font-semibold text-purple-300">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">MP4, MOV, AVI, WebM, etc.</p>
          </div>
        )}
      </div>
      {fileName && !isProcessing && (
        <p className="text-sm text-green-400">
          Selected: <span className="font-medium">{fileName}</span>
        </p>
      )}
    </div>
  );
};