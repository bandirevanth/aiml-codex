import { VideoChunk, FrameData, ContextWindow, RetrievalQuery, RetrievalResult } from '../types';

export const createContextWindows = (
  frames: FrameData[], 
  windowSize: number = 3
): ContextWindow[] => {
  const windows: ContextWindow[] = [];
  
  for (let i = 0; i < frames.length; i++) {
    const beforeStart = Math.max(0, i - Math.floor(windowSize / 2));
    const afterEnd = Math.min(frames.length, i + Math.floor(windowSize / 2) + 1);
    
    const before = frames.slice(beforeStart, i);
    const current = frames[i];
    const after = frames.slice(i + 1, afterEnd);
    
    windows.push({
      before,
      current,
      after,
      relevanceScore: calculateRelevanceScore(before, current, after),
      semanticSimilarity: calculateSemanticSimilarity(before, current, after)
    });
  }
  
  return windows;
};

export const chunkVideoFrames = (
  frames: FrameData[], 
  chunkSize: number = 5,
  overlapSize: number = 1
): VideoChunk[] => {
  const chunks: VideoChunk[] = [];
  
  for (let i = 0; i < frames.length; i += chunkSize - overlapSize) {
    const chunkFrames = frames.slice(i, Math.min(i + chunkSize, frames.length));
    
    if (chunkFrames.length > 0) {
      chunks.push({
        id: `chunk-${i}`,
        startTime: chunkFrames[0].timestamp,
        endTime: chunkFrames[chunkFrames.length - 1].timestamp,
        frames: chunkFrames,
        visualFeatures: extractVisualFeatures(chunkFrames),
        audioFeatures: extractAudioFeatures(chunkFrames),
        contextualRelevance: calculateChunkRelevance(chunkFrames)
      });
    }
  }
  
  return chunks;
};

export const compressContext = (
  chunks: VideoChunk[], 
  compressionRatio: number = 0.5,
  preserveKeyFrames: boolean = true
): VideoChunk[] => {
  const sortedChunks = chunks.sort((a, b) => b.contextualRelevance - a.contextualRelevance);
  const targetCount = Math.ceil(chunks.length * compressionRatio);
  
  let compressedChunks = sortedChunks.slice(0, targetCount);
  
  if (preserveKeyFrames) {
    compressedChunks = ensureKeyFramesPreserved(compressedChunks, chunks);
  }
  
  return compressedChunks.sort((a, b) => a.startTime - b.startTime);
};

export const calculateSemanticSimilarity = (
  before: FrameData[], 
  current: FrameData, 
  after: FrameData[]
): number => {
  const totalFrames = before.length + 1 + after.length;
  const contextStrength = Math.min(totalFrames / 5, 1);
  
  return contextStrength * 0.8 + Math.random() * 0.2;
};

export const calculateRelevanceScore = (
  before: FrameData[], 
  current: FrameData, 
  after: FrameData[]
): number => {
  const temporalContinuity = calculateTemporalContinuity(before, current, after);
  const visualConsistency = calculateVisualConsistency(before, current, after);
  
  return (temporalContinuity * 0.6) + (visualConsistency * 0.4);
};

export const extractVisualFeatures = (frames: FrameData[]): string[] => {
  const features = [
    'objects_detected',
    'scene_type',
    'lighting_conditions',
    'camera_movement',
    'color_palette',
    'text_overlay',
    'faces_detected',
    'activity_type'
  ];
  
  return features.slice(0, Math.floor(Math.random() * features.length) + 1);
};

export const extractAudioFeatures = (frames: FrameData[]): string[] => {
  const features = [
    'speech_detected',
    'music_present',
    'background_noise',
    'speaker_count',
    'audio_quality',
    'silence_periods',
    'emotional_tone',
    'language_detected'
  ];
  
  return features.slice(0, Math.floor(Math.random() * features.length) + 1);
};

export const calculateChunkRelevance = (frames: FrameData[]): number => {
  const frameCount = frames.length;
  const timeSpan = frames.length > 1 ? 
    frames[frames.length - 1].timestamp - frames[0].timestamp : 1;
  
  const density = frameCount / Math.max(timeSpan, 1);
  const normalizedDensity = Math.min(density / 10, 1);
  
  return normalizedDensity * 0.7 + Math.random() * 0.3;
};

export const calculateTemporalContinuity = (
  before: FrameData[], 
  current: FrameData, 
  after: FrameData[]
): number => {
  if (before.length === 0 && after.length === 0) return 0.5;
  
  let continuityScore = 0;
  let comparisons = 0;
  
  if (before.length > 0) {
    const timeDiff = current.timestamp - before[before.length - 1].timestamp;
    continuityScore += Math.max(0, 1 - timeDiff / 5000); // 5 second max gap
    comparisons++;
  }
  
  if (after.length > 0) {
    const timeDiff = after[0].timestamp - current.timestamp;
    continuityScore += Math.max(0, 1 - timeDiff / 5000);
    comparisons++;
  }
  
  return comparisons > 0 ? continuityScore / comparisons : 0.5;
};

export const calculateVisualConsistency = (
  before: FrameData[], 
  current: FrameData, 
  after: FrameData[]
): number => {
  const allFrames = [...before, current, ...after];
  
  if (allFrames.length <= 1) return 1;
  
  const baseConsistency = 0.7;
  const variation = (Math.random() - 0.5) * 0.4;
  
  return Math.max(0, Math.min(1, baseConsistency + variation));
};

export const ensureKeyFramesPreserved = (
  compressedChunks: VideoChunk[], 
  originalChunks: VideoChunk[]
): VideoChunk[] => {
  const keyChunks = originalChunks
    .filter(chunk => chunk.contextualRelevance > 0.8)
    .filter(chunk => !compressedChunks.some(c => c.id === chunk.id));
  
  return [...compressedChunks, ...keyChunks];
};

export const rankRetrievalResults = (
  results: RetrievalResult[], 
  query: RetrievalQuery
): RetrievalResult[] => {
  return results.sort((a, b) => {
    const scoreA = (a.relevanceScore * 0.4) + 
                   (a.contextualMatch * 0.3) + 
                   (a.semanticSimilarity * 0.3);
    const scoreB = (b.relevanceScore * 0.4) + 
                   (b.contextualMatch * 0.3) + 
                   (b.semanticSimilarity * 0.3);
    
    return scoreB - scoreA;
  });
};
