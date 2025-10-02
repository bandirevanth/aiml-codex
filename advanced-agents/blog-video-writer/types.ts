export interface VideoFile {
  file: File;
  preview: string;
  duration?: number;
  size: number;
}

export interface BlogWritingConfig {
  targetAudience: 'general' | 'technical' | 'academic' | 'business';
  blogStyle: 'informative' | 'narrative' | 'analytical' | 'tutorial';
  contentDepth: 'basic' | 'intermediate' | 'advanced';
  wordCount: 'short' | 'medium' | 'long';
  includeTranscript: boolean;
  includeTechnicalDetails: boolean;
  includeCallToAction: boolean;
}

export interface AgentState {
  currentAgent: string;
  progress: number;
  isProcessing: boolean;
  error: string | null;
  agentProgress: {
    videoAnalyzer: boolean;
    contentPlanner: boolean;
    researcher: boolean;
    writer: boolean;
    editor: boolean;
  };
}

export interface VideoAnalysis {
  summary: string;
  keyTopics: string[];
  technicalDetails: string[];
  visualElements: string[];
  audioQuality: string;
  duration: number;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

export interface ContentOutline {
  title: string;
  introduction: string;
  mainSections: {
    heading: string;
    keyPoints: string[];
    estimatedWords: number;
  }[];
  conclusion: string;
  callToAction?: string;
}

export interface ResearchData {
  backgroundInfo: string[];
  relatedTopics: string[];
  technicalContext: string[];
  industryInsights: string[];
  expertQuotes: string[];
}

export interface BlogDraft {
  title: string;
  content: string;
  wordCount: number;
  readingTime: number;
  sections: {
    name: string;
    content: string;
    wordCount: number;
  }[];
}

export interface EditedBlog {
  finalTitle: string;
  finalContent: string;
  improvements: string[];
  seoOptimizations: string[];
  readabilityScore: number;
  finalWordCount: number;
  estimatedReadingTime: number;
}

export interface BlogWritingResult {
  videoAnalysis: VideoAnalysis;
  contentOutline: ContentOutline;
  researchData: ResearchData;
  blogDraft: BlogDraft;
  editedBlog: EditedBlog;
  metadata: {
    processingTime: number;
    agentContributions: string[];
    qualityScore: number;
  };
}
