import { RAGMode, RetrievalQuery } from '../types';

export const generateRAGPrompt = (ragMode: RAGMode, query?: RetrievalQuery, customPrompt?: string): string => {
  const baseContext = `You are an advanced contextual video RAG (Retrieval-Augmented Generation) system that analyzes video content to provide intelligent retrieval and contextual understanding.
Analyze the provided video frames to extract relevant information and provide contextual insights.`;

  switch (ragMode) {
    case RAGMode.CONTEXTUAL_COMPRESSION:
      return `${baseContext}

Perform contextual compression on the video content:
1. Identify the most contextually relevant frames and segments
2. Compress content while preserving semantic meaning
3. Calculate compression ratios and quality metrics
4. Determine which elements to preserve vs remove
5. Assess contextual relevance of each segment
6. Provide compression recommendations

Focus on maintaining the essential context while reducing redundancy.

Format as JSON:
{
  "contextualAnalysis": {
    "relevantChunks": [{
      "id": "chunk-1",
      "startTime": 0,
      "endTime": 5,
      "contextualRelevance": 0.9,
      "visualFeatures": ["feature1", "feature2"],
      "audioFeatures": ["speech", "music"]
    }],
    "contextWindows": [{
      "relevanceScore": 0.8,
      "semanticSimilarity": 0.7
    }],
    "compressionMetrics": {
      "originalLength": 100,
      "compressedLength": 60,
      "compressionRatio": 0.6,
      "preservedElements": ["key moments", "important dialogue"],
      "removedElements": ["redundant scenes", "silence"],
      "qualityScore": 0.85,
      "contextualRelevance": 0.9
    }
  },
  "summary": "Contextual compression analysis",
  "insights": ["compression insights"],
  "nextSteps": ["optimization recommendations"]
}`;

    case RAGMode.WINDOW_RETRIEVAL:
      return `${baseContext}

Perform window-based retrieval on the video content:
1. Create context windows around key moments
2. Analyze temporal relationships between frames
3. Identify relevant segments with surrounding context
4. Calculate window relevance scores
5. Extract contextual information from each window
6. Provide retrieval recommendations

${query ? `Query: "${query.text}"
Intent: ${query.intent}
Max Results: ${query.maxResults}
Relevance Threshold: ${query.relevanceThreshold}` : ''}

Format as JSON:
{
  "retrievalResults": [{
    "id": "result-1",
    "chunk": {
      "id": "chunk-1",
      "startTime": 10,
      "endTime": 15,
      "contextualRelevance": 0.9
    },
    "relevanceScore": 0.85,
    "contextualMatch": 0.8,
    "semanticSimilarity": 0.9,
    "explanation": "Why this segment is relevant",
    "keyMoments": [{
      "timestamp": 12,
      "description": "Key moment description",
      "confidence": 0.9
    }],
    "relatedChunks": ["chunk-2", "chunk-3"]
  }],
  "summary": "Window retrieval results",
  "insights": ["retrieval insights"],
  "nextSteps": ["follow-up actions"]
}`;

    case RAGMode.HIERARCHICAL_SEARCH:
      return `${baseContext}

Perform hierarchical search on the video content:
1. Create multi-level content hierarchy
2. Search at different granularity levels
3. Identify relationships between content levels
4. Extract hierarchical knowledge structure
5. Provide multi-level retrieval results
6. Map content dependencies and relationships

Format as JSON:
{
  "knowledgeExtraction": {
    "entities": ["entity1", "entity2"],
    "concepts": ["concept1", "concept2"],
    "relationships": ["relationship1", "relationship2"],
    "timeline": [{
      "timestamp": 30,
      "event": "Important event",
      "importance": 0.9
    }]
  },
  "summary": "Hierarchical search results",
  "insights": ["hierarchical insights"],
  "nextSteps": ["exploration recommendations"]
}`;

    case RAGMode.SEMANTIC_FILTERING:
      return `${baseContext}

Perform semantic filtering on the video content:
1. Analyze semantic content of each frame
2. Filter based on semantic similarity
3. Group semantically related content
4. Calculate semantic relevance scores
5. Identify semantic patterns and themes
6. Provide filtered results with explanations

${query ? `Query: "${query.text}"
Semantic filters: ${query.filters ? JSON.stringify(query.filters) : 'None'}` : ''}

Format as JSON:
{
  "retrievalResults": [{
    "id": "result-1",
    "relevanceScore": 0.9,
    "semanticSimilarity": 0.85,
    "explanation": "Semantic match explanation"
  }],
  "summary": "Semantic filtering results",
  "insights": ["semantic insights"],
  "nextSteps": ["refinement suggestions"]
}`;

    case RAGMode.ADAPTIVE_CONTEXT:
      return `${baseContext}

Perform adaptive context analysis on the video content:
1. Dynamically adjust context window size
2. Adapt retrieval strategy based on content complexity
3. Optimize context based on query requirements
4. Balance precision vs recall dynamically
5. Provide adaptive recommendations
6. Explain context adaptation decisions

${query ? `Query complexity: ${query.text.length > 100 ? 'High' : query.text.length > 50 ? 'Medium' : 'Low'}
Query: "${query.text}"` : ''}

Format as JSON:
{
  "contextualAnalysis": {
    "adaptiveStrategy": "Strategy explanation",
    "contextWindowSize": 5,
    "relevanceThreshold": 0.7,
    "adaptationReasoning": "Why this approach was chosen"
  },
  "retrievalResults": [{
    "id": "result-1",
    "adaptiveScore": 0.9,
    "contextualMatch": 0.85
  }],
  "summary": "Adaptive context analysis",
  "insights": ["adaptation insights"],
  "nextSteps": ["optimization recommendations"]
}`;

    case RAGMode.CUSTOM:
      return `${baseContext}

${customPrompt || 'Perform comprehensive contextual video RAG analysis.'}

Analyze the video content and provide relevant retrieval and contextual insights.
Format your response as JSON with appropriate RAG analysis sections.`;

    default:
      return `${baseContext}

Perform comprehensive contextual video RAG analysis:
1. Extract relevant video segments
2. Analyze contextual relationships
3. Provide retrieval recommendations
4. Calculate relevance scores
5. Generate insights and next steps

Format as comprehensive JSON response with analysis results.`;
  }
};

export const generateFollowUpPrompt = (
  previousResults: any, 
  newQuery: string
): string => {
  return `Based on the previous RAG analysis results: ${JSON.stringify(previousResults, null, 2)}

And the new query: "${newQuery}"

Provide refined contextual video RAG analysis:
1. Build upon previous findings
2. Address the new query specifically
3. Identify connections to previous results
4. Provide enhanced contextual understanding
5. Suggest follow-up explorations

Format as comprehensive JSON response with enhanced analysis.`;
};

export const generateCompressionPrompt = (
  targetRatio: number, 
  preserveElements: string[]
): string => {
  return `Perform contextual compression with the following parameters:
- Target compression ratio: ${targetRatio}
- Elements to preserve: ${preserveElements.join(', ')}

Analyze the video content and provide optimal compression strategy:
1. Identify redundant content for removal
2. Preserve specified critical elements
3. Maintain contextual coherence
4. Calculate quality impact
5. Provide compression recommendations

Format as detailed compression analysis with metrics and recommendations.`;
};
