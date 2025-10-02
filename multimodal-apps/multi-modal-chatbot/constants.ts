import { ChatMode } from './types';

export const CHAT_MODES = [
  {
    value: ChatMode.VIDEO_ANALYSIS,
    label: 'Video Analysis Chat',
    description: 'Analyze videos and discuss findings'
  },
  {
    value: ChatMode.CONVERSATION,
    label: 'Text Conversation',
    description: 'Pure text-based conversation'
  },
  {
    value: ChatMode.MIXED,
    label: 'Mixed Mode',
    description: 'Combine video analysis with conversation'
  }
];

export const GEMINI_MODEL_MULTIMODAL = 'gemini-1.5-flash';
export const MAX_FRAMES_TO_ANALYZE = 10;
export const MAX_CHAT_HISTORY = 20;

export const AGENT_PERSONALITY = {
  name: 'VideoChat Assistant',
  description: 'An intelligent assistant that can analyze videos and engage in meaningful conversations',
  capabilities: [
    'Video content analysis',
    'Conversational AI',
    'Context-aware responses',
    'Multi-modal understanding'
  ]
};
