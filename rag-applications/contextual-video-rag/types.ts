export enum RAGMode {
  CONTEXTUAL_COMPRESSION = 'CONTEXTUAL_COMPRESSION',
  WINDOW_RETRIEVAL = 'WINDOW_RETRIEVAL',
  HIERARCHICAL_SEARCH = 'HIERARCHICAL_SEARCH',
  SEMANTIC_FILTERING = 'SEMANTIC_FILTERING',
  ADAPTIVE_CONTEXT = 'ADAPTIVE_CONTEXT',
  CUSTOM = 'CUSTOM'
}

export interface FrameData {
  id: string;
  base64Data: string;
  mimeType: 'image/jpeg' | 'image/png';
  timestamp: number;
  contextWindow?: ContextWindow;
}

export interface ContextWindow {
  before: FrameData[];
  current: FrameData;
  after: FrameData[];
  relevanceScore: number;
  semanticSimilarity: number;
}

export interface VideoChunk {
  id: string;
  startTime: number;
  endTime: number;
  frames: FrameData[];
  transcript?: string;
  visualFeatures: string[];
  audioFeatures: string[];
  contextualRelevance: number;
  semanticEmbedding?: number[];
}

export interface RetrievalQuery {
  id: string;
  text: string;
  intent: 'search' | 'summarize' | 'analyze' | 'compare' | 'extract';
  context?: string;
  filters?: {
    timeRange?: [number, number];
    visualElements?: string[];
    topics?: string[];
    speakers?: string[];
  };
  maxResults: number;
  relevanceThreshold: number;
}

export interface RetrievalResult {
  id: string;
  chunk: VideoChunk;
  relevanceScore: number;
  contextualMatch: number;
  semanticSimilarity: number;
  explanation: string;
  keyMoments: {
    timestamp: number;
    description: string;
    confidence: number;
  }[];
  relatedChunks: string[];
}

export interface ContextualCompression {
  originalLength: number;
  compressedLength: number;
  compressionRatio: number;
  preservedElements: string[];
  removedElements: string[];
  qualityScore: number;
  contextualRelevance: number;
}

export interface KnowledgeGraph {
  nodes: {
    id: string;
    type: 'concept' | 'entity' | 'event' | 'location' | 'person';
    label: string;
    properties: Record<string, any>;
    videoReferences: {
      chunkId: string;
      timestamp: number;
      confidence: number;
    }[];
  }[];
  edges: {
    source: string;
    target: string;
    relationship: string;
    weight: number;
    evidence: string[];
  }[];
}

export interface RAGResponse {
  query: RetrievalQuery;
  results: RetrievalResult[];
  contextualCompression?: ContextualCompression;
  knowledgeGraph?: KnowledgeGraph;
  summary: string;
  confidence: number;
  processingTime: number;
  recommendations: string[];
  followUpQuestions: string[];
}

export interface ParsedRAGResponse {
  retrievalResults?: RetrievalResult[];
  contextualAnalysis?: {
    relevantChunks: VideoChunk[];
    contextWindows: ContextWindow[];
    compressionMetrics: ContextualCompression;
  };
  knowledgeExtraction?: {
    entities: string[];
    concepts: string[];
    relationships: string[];
    timeline: {
      timestamp: number;
      event: string;
      importance: number;
    }[];
  };
  summary: string;
  insights: string[];
  nextSteps: string[];
}
