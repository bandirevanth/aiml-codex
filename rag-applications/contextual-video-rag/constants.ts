import { RAGMode } from './types';

export const RAG_MODES = [
  {
    value: RAGMode.CONTEXTUAL_COMPRESSION,
    label: 'Contextual Compression',
    description: 'Compress video content while preserving contextual relevance',
    icon: '🗜️'
  },
  {
    value: RAGMode.WINDOW_RETRIEVAL,
    label: 'Window Retrieval',
    description: 'Retrieve video segments with surrounding context windows',
    icon: '🪟'
  },
  {
    value: RAGMode.HIERARCHICAL_SEARCH,
    label: 'Hierarchical Search',
    description: 'Multi-level hierarchical video content search',
    icon: '🏗️'
  },
  {
    value: RAGMode.SEMANTIC_FILTERING,
    label: 'Semantic Filtering',
    description: 'Filter video content based on semantic similarity',
    icon: '🔍'
  },
  {
    value: RAGMode.ADAPTIVE_CONTEXT,
    label: 'Adaptive Context',
    description: 'Dynamically adapt context based on query complexity',
    icon: '🧠'
  },
  {
    value: RAGMode.CUSTOM,
    label: 'Custom RAG',
    description: 'Custom retrieval-augmented generation approach',
    icon: '⚙️'
  }
];

export const GEMINI_MODEL_MULTIMODAL = 'gemini-1.5-flash';
export const MAX_FRAMES_TO_ANALYZE = 12;
export const DEFAULT_CONTEXT_WINDOW_SIZE = 3;
export const DEFAULT_RELEVANCE_THRESHOLD = 0.7;
export const MAX_RETRIEVAL_RESULTS = 10;

export const COMPRESSION_STRATEGIES = [
  { value: 'semantic', label: 'Semantic Compression', description: 'Preserve semantic meaning' },
  { value: 'temporal', label: 'Temporal Compression', description: 'Focus on temporal relationships' },
  { value: 'visual', label: 'Visual Compression', description: 'Preserve visual elements' },
  { value: 'hybrid', label: 'Hybrid Compression', description: 'Combine multiple strategies' }
];

export const RETRIEVAL_INTENTS = [
  { value: 'search', label: 'Search', icon: '🔍', description: 'Find specific information' },
  { value: 'summarize', label: 'Summarize', icon: '📝', description: 'Create content summaries' },
  { value: 'analyze', label: 'Analyze', icon: '📊', description: 'Analyze patterns and trends' },
  { value: 'compare', label: 'Compare', icon: '⚖️', description: 'Compare different segments' },
  { value: 'extract', label: 'Extract', icon: '📤', description: 'Extract specific elements' }
];

export const CONTEXT_WINDOW_SIZES = [
  { value: 1, label: 'Minimal (1)', description: 'Single frame context' },
  { value: 3, label: 'Small (3)', description: 'Small context window' },
  { value: 5, label: 'Medium (5)', description: 'Medium context window' },
  { value: 7, label: 'Large (7)', description: 'Large context window' },
  { value: 10, label: 'Extended (10)', description: 'Extended context window' }
];

export const SEMANTIC_SIMILARITY_THRESHOLDS = [
  { value: 0.5, label: 'Low (0.5)', description: 'Include loosely related content' },
  { value: 0.7, label: 'Medium (0.7)', description: 'Balanced relevance filtering' },
  { value: 0.8, label: 'High (0.8)', description: 'Strict relevance filtering' },
  { value: 0.9, label: 'Very High (0.9)', description: 'Only highly relevant content' }
];

export const KNOWLEDGE_GRAPH_TYPES = [
  { value: 'concept', label: 'Concepts', color: 'blue', icon: '💡' },
  { value: 'entity', label: 'Entities', color: 'green', icon: '🏷️' },
  { value: 'event', label: 'Events', color: 'orange', icon: '📅' },
  { value: 'location', label: 'Locations', color: 'red', icon: '📍' },
  { value: 'person', label: 'People', color: 'purple', icon: '👤' }
];

export const RELATIONSHIP_TYPES = [
  'related_to',
  'part_of',
  'causes',
  'follows',
  'mentions',
  'demonstrates',
  'explains',
  'contrasts_with',
  'supports',
  'contradicts'
];
