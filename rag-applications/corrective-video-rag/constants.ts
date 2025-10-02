export const CORRECTIVE_SETTINGS = {
  DEFAULT_LOWER_THRESHOLD: 0.3,
  DEFAULT_UPPER_THRESHOLD: 0.7,
  MAX_SEGMENTS: 10,
  DEFAULT_EVALUATION_MODE: 'balanced' as const,
  DEFAULT_MODALITY_WEIGHTS: {
    visual: 0.4,
    audio: 0.3,
    transcript: 0.3
  },
  DEFAULT_CORRECTION_STRATEGIES: {
    enableWebSearch: true,
    enableSegmentCombination: true,
    enableContextExpansion: false
  }
};

export const EVALUATION_MODES = [
  { value: 'strict', label: 'Strict Evaluation', description: 'High precision, low recall' },
  { value: 'balanced', label: 'Balanced Evaluation', description: 'Balanced precision and recall' },
  { value: 'lenient', label: 'Lenient Evaluation', description: 'High recall, lower precision' }
] as const;

export const CORRECTION_STRATEGIES = [
  {
    type: 'correct',
    label: 'Use Retrieved Content',
    description: 'High relevance detected - use video content directly',
    color: 'green'
  },
  {
    type: 'incorrect', 
    label: 'Web Search Correction',
    description: 'Low relevance detected - search external sources',
    color: 'red'
  },
  {
    type: 'ambiguous',
    label: 'Hybrid Approach',
    description: 'Moderate relevance - combine video and web sources',
    color: 'yellow'
  }
] as const;

export const QUERY_INTENTS = [
  { value: 'factual', label: 'Factual Information', description: 'Seeking specific facts or data' },
  { value: 'analytical', label: 'Analysis & Insights', description: 'Requiring interpretation and analysis' },
  { value: 'comparative', label: 'Comparison', description: 'Comparing different concepts or items' },
  { value: 'procedural', label: 'How-to & Procedures', description: 'Step-by-step instructions or processes' }
] as const;

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/mov', 
  'video/avi',
  'video/webm',
  'video/mkv',
  'video/quicktime'
];

export const QUALITY_THRESHOLDS = {
  EXCELLENT: 0.9,
  GOOD: 0.7,
  FAIR: 0.5,
  POOR: 0.3
};

export const PROMPTS = {
  RELEVANCE_EVALUATION: `Evaluate the relevance of this video content to the user's query on a scale from 0 to 1.
Consider the semantic meaning, context, and how well the content answers the query.

Query: {query}
Content: {content}
Content Type: {contentType}

Provide your evaluation as a JSON object with:
- score: number (0-1)
- confidence: number (0-1) 
- reasoning: string explaining your evaluation`,

  QUERY_REWRITING: `Rewrite this query to make it more suitable for web search while preserving the original intent.
Focus on key terms and concepts that would yield better search results.

Original Query: {query}
Domain: {domain}
Intent: {intent}

Provide the rewritten query as a JSON object with:
- rewrittenQuery: string
- keyTerms: string[]
- searchStrategy: string`,

  KNOWLEDGE_EXTRACTION: `Extract key information from this content in a structured format.
Focus on information relevant to the user's query.

Query: {query}
Content: {content}
Source Type: {sourceType}

Provide extracted knowledge as a JSON object with:
- keyPoints: string[]
- mainConcepts: string[]
- relevantDetails: string[]
- confidence: number (0-1)`,

  RESPONSE_GENERATION: `Generate a comprehensive answer to the user's query based on the provided knowledge sources.
Ensure accuracy and cite sources appropriately.

Query: {query}
Knowledge Sources: {knowledge}
Correction Strategy: {strategy}

Provide your response as a JSON object with:
- answer: string (comprehensive response)
- confidence: number (0-1)
- sourceAttribution: string[]
- recommendations: string[]`
};
