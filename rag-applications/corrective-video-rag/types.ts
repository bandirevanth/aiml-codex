export interface VideoFile {
  file: File;
  url: string;
  duration?: number;
  size: number;
}

export interface RelevanceEvaluation {
  score: number;
  confidence: number;
  reasoning: string;
  timestamp?: number;
}

export interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  content: string;
  relevanceScore: number;
  type: 'visual' | 'audio' | 'transcript';
}

export interface CorrectionStrategy {
  type: 'correct' | 'incorrect' | 'ambiguous';
  action: string;
  confidence: number;
  sources: string[];
}

export interface CorrectiveConfig {
  lowerThreshold: number;
  upperThreshold: number;
  maxSegments: number;
  evaluationMode: 'strict' | 'balanced' | 'lenient';
  modalityWeights: {
    visual: number;
    audio: number;
    transcript: number;
  };
  correctionStrategies: {
    enableWebSearch: boolean;
    enableSegmentCombination: boolean;
    enableContextExpansion: boolean;
  };
}

export interface CorrectiveReport {
  query: string;
  totalSegments: number;
  evaluatedSegments: VideoSegment[];
  correctionStrategy: CorrectionStrategy;
  finalAnswer: string;
  sources: Array<{
    type: 'video' | 'web' | 'combined';
    content: string;
    relevanceScore: number;
    timestamp?: number;
  }>;
  qualityMetrics: {
    averageRelevance: number;
    correctionAccuracy: number;
    responseCompleteness: number;
    sourceReliability: number;
  };
  executionTime: number;
  recommendations: string[];
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  relevanceScore: number;
}

export interface QueryContext {
  originalQuery: string;
  rewrittenQuery?: string;
  intent: 'factual' | 'analytical' | 'comparative' | 'procedural';
  domain: string;
  complexity: 'simple' | 'moderate' | 'complex';
}
