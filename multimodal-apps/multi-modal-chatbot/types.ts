export enum ChatMode {
  VIDEO_ANALYSIS = 'VIDEO_ANALYSIS',
  CONVERSATION = 'CONVERSATION',
  MIXED = 'MIXED',
}

export interface FrameData {
  id: string;
  base64Data: string;
  mimeType: 'image/jpeg' | 'image/png';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  videoFrames?: FrameData[];
  analysisType?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  mode: ChatMode;
  context?: string;
}

export interface AgentState {
  currentSession: ChatSession | null;
  isProcessing: boolean;
  error: string | null;
  memory: Record<string, any>;
}

export interface ChatResponse {
  content: string;
  suggestions?: string[];
  followUpQuestions?: string[];
  analysisData?: any;
}
