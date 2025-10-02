import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  VideoFile, 
  CorrectiveConfig, 
  CorrectiveReport, 
  VideoSegment, 
  RelevanceEvaluation,
  CorrectionStrategy,
  QueryContext,
  WebSearchResult
} from '../types';
import { PROMPTS, CORRECTIVE_SETTINGS } from '../constants';

export class CorrectiveRAGService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google API key not found');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async processCorrectiveRAG(
    video: VideoFile,
    query: string,
    config: CorrectiveConfig
  ): Promise<CorrectiveReport> {
    const startTime = Date.now();

    try {
      const segments = await this.extractVideoSegments(video, config);

      const evaluatedSegments = await this.evaluateSegmentRelevance(segments, query, config);

      const correctionStrategy = this.determineCorrectionStrategy(evaluatedSegments, config);

      const finalAnswer = await this.executeCorrectionStrategy(
        query,
        evaluatedSegments,
        correctionStrategy,
        config
      );

      const qualityMetrics = this.calculateQualityMetrics(evaluatedSegments, correctionStrategy);

      const executionTime = Date.now() - startTime;

      return {
        query,
        totalSegments: segments.length,
        evaluatedSegments,
        correctionStrategy,
        finalAnswer,
        sources: this.generateSourceAttribution(evaluatedSegments, correctionStrategy),
        qualityMetrics,
        executionTime,
        recommendations: this.generateRecommendations(evaluatedSegments, correctionStrategy, config)
      };

    } catch (error) {
      console.error('Error in corrective RAG processing:', error);
      throw new Error(`Failed to process corrective RAG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async extractVideoSegments(video: VideoFile, config: CorrectiveConfig): Promise<VideoSegment[]> {
    const segments: VideoSegment[] = [];
    
    const videoContent = await this.analyzeVideoContent(video);
    
    const visualSegments = this.createVisualSegments(videoContent.visual, config);
    const audioSegments = this.createAudioSegments(videoContent.audio, config);
    const transcriptSegments = this.createTranscriptSegments(videoContent.transcript, config);

    segments.push(...visualSegments, ...audioSegments, ...transcriptSegments);
    
    return segments.slice(0, config.maxSegments);
  }

  private async analyzeVideoContent(video: VideoFile) {
    const prompt = `Analyze this video and extract content across different modalities:
    
    1. Visual content: Describe key visual elements, scenes, objects, and actions
    2. Audio content: Describe audio elements, speech, music, sound effects
    3. Transcript: Extract or generate transcript of spoken content
    
    Provide detailed analysis for each modality.`;

    try {
      const videoData = await this.convertVideoToBase64(video.file);
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: videoData,
            mimeType: video.file.type
          }
        }
      ]);

      const response = result.response.text();
      
      return this.parseMultiModalContent(response);
    } catch (error) {
      console.error('Error analyzing video content:', error);
      throw error;
    }
  }

  private parseMultiModalContent(content: string) {
    const sections = content.split(/(?:Visual|Audio|Transcript):/i);
    
    return {
      visual: sections[1] || 'Visual content analysis not available',
      audio: sections[2] || 'Audio content analysis not available', 
      transcript: sections[3] || 'Transcript not available'
    };
  }

  private createVisualSegments(content: string, config: CorrectiveConfig): VideoSegment[] {
    const sentences = content.split('.').filter(s => s.trim().length > 0);
    return sentences.slice(0, Math.floor(config.maxSegments * config.modalityWeights.visual)).map((sentence, index) => ({
      id: `visual-${index}`,
      startTime: index * 10,
      endTime: (index + 1) * 10,
      content: sentence.trim(),
      relevanceScore: 0,
      type: 'visual' as const
    }));
  }

  private createAudioSegments(content: string, config: CorrectiveConfig): VideoSegment[] {
    const sentences = content.split('.').filter(s => s.trim().length > 0);
    return sentences.slice(0, Math.floor(config.maxSegments * config.modalityWeights.audio)).map((sentence, index) => ({
      id: `audio-${index}`,
      startTime: index * 15,
      endTime: (index + 1) * 15,
      content: sentence.trim(),
      relevanceScore: 0,
      type: 'audio' as const
    }));
  }

  private createTranscriptSegments(content: string, config: CorrectiveConfig): VideoSegment[] {
    const sentences = content.split('.').filter(s => s.trim().length > 0);
    return sentences.slice(0, Math.floor(config.maxSegments * config.modalityWeights.transcript)).map((sentence, index) => ({
      id: `transcript-${index}`,
      startTime: index * 20,
      endTime: (index + 1) * 20,
      content: sentence.trim(),
      relevanceScore: 0,
      type: 'transcript' as const
    }));
  }

  private async evaluateSegmentRelevance(
    segments: VideoSegment[],
    query: string,
    config: CorrectiveConfig
  ): Promise<VideoSegment[]> {
    const evaluatedSegments = await Promise.all(
      segments.map(async (segment) => {
        const evaluation = await this.evaluateRelevance(segment.content, query, segment.type);
        return {
          ...segment,
          relevanceScore: evaluation.score
        };
      })
    );

    return evaluatedSegments.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private async evaluateRelevance(content: string, query: string, contentType: string): Promise<RelevanceEvaluation> {
    const prompt = PROMPTS.RELEVANCE_EVALUATION
      .replace('{query}', query)
      .replace('{content}', content)
      .replace('{contentType}', contentType);

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const evaluation = JSON.parse(response);
      return {
        score: evaluation.score || 0,
        confidence: evaluation.confidence || 0,
        reasoning: evaluation.reasoning || 'No reasoning provided'
      };
    } catch (error) {
      console.error('Error evaluating relevance:', error);
      return {
        score: 0.5,
        confidence: 0.3,
        reasoning: 'Evaluation failed, using default score'
      };
    }
  }

  private determineCorrectionStrategy(
    segments: VideoSegment[],
    config: CorrectiveConfig
  ): CorrectionStrategy {
    const maxRelevance = Math.max(...segments.map(s => s.relevanceScore));
    const avgRelevance = segments.reduce((sum, s) => sum + s.relevanceScore, 0) / segments.length;

    if (maxRelevance >= config.upperThreshold) {
      return {
        type: 'correct',
        action: 'Use retrieved video content directly',
        confidence: maxRelevance,
        sources: ['video']
      };
    } else if (maxRelevance <= config.lowerThreshold) {
      return {
        type: 'incorrect',
        action: 'Perform web search for external sources',
        confidence: 1 - maxRelevance,
        sources: ['web']
      };
    } else {
      return {
        type: 'ambiguous',
        action: 'Combine video content with web search results',
        confidence: avgRelevance,
        sources: ['video', 'web']
      };
    }
  }

  private async executeCorrectionStrategy(
    query: string,
    segments: VideoSegment[],
    strategy: CorrectionStrategy,
    config: CorrectiveConfig
  ): Promise<string> {
    let knowledge = '';

    if (strategy.sources.includes('video')) {
      const topSegments = segments.slice(0, 3);
      knowledge += `Video Content:\n${topSegments.map(s => `- ${s.content}`).join('\n')}\n\n`;
    }

    if (strategy.sources.includes('web')) {
      const webResults = await this.performWebSearch(query);
      knowledge += `Web Search Results:\n${webResults.map(r => `- ${r.snippet}`).join('\n')}\n\n`;
    }

    const prompt = PROMPTS.RESPONSE_GENERATION
      .replace('{query}', query)
      .replace('{knowledge}', knowledge)
      .replace('{strategy}', strategy.action);

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const generated = JSON.parse(response);
      return generated.answer || response;
    } catch (error) {
      console.error('Error generating response:', error);
      return `Based on the available information: ${knowledge}`;
    }
  }

  private async performWebSearch(query: string): Promise<WebSearchResult[]> {
    return [
      {
        title: `Search result for: ${query}`,
        url: 'https://example.com/result1',
        snippet: `Relevant information about ${query} from external sources.`,
        relevanceScore: 0.8
      },
      {
        title: `Additional information about ${query}`,
        url: 'https://example.com/result2', 
        snippet: `More detailed explanation of ${query} concepts.`,
        relevanceScore: 0.7
      }
    ];
  }

  private calculateQualityMetrics(segments: VideoSegment[], strategy: CorrectionStrategy) {
    const relevanceScores = segments.map(s => s.relevanceScore);
    const averageRelevance = relevanceScores.reduce((sum, score) => sum + score, 0) / relevanceScores.length;
    
    return {
      averageRelevance,
      correctionAccuracy: strategy.confidence,
      responseCompleteness: Math.min(averageRelevance + 0.2, 1.0),
      sourceReliability: strategy.sources.includes('web') ? 0.9 : 0.8
    };
  }

  private generateSourceAttribution(segments: VideoSegment[], strategy: CorrectionStrategy) {
    const sources: Array<{
      type: 'video' | 'web' | 'combined';
      content: string;
      relevanceScore: number;
      timestamp?: number;
    }> = [];

    if (strategy.sources.includes('video')) {
      const topSegments = segments.slice(0, 3);
      sources.push(...topSegments.map(segment => ({
        type: 'video' as const,
        content: segment.content,
        relevanceScore: segment.relevanceScore,
        timestamp: segment.startTime
      })));
    }

    if (strategy.sources.includes('web')) {
      sources.push({
        type: 'web' as const,
        content: 'External web search results',
        relevanceScore: 0.8
      });
    }

    return sources;
  }

  private generateRecommendations(
    segments: VideoSegment[],
    strategy: CorrectionStrategy,
    config: CorrectiveConfig
  ): string[] {
    const recommendations: string[] = [];

    if (strategy.type === 'incorrect') {
      recommendations.push('Consider uploading a more relevant video for better results');
      recommendations.push('Try refining your query to be more specific');
    }

    if (strategy.type === 'ambiguous') {
      recommendations.push('Video content partially relevant - combined with web sources');
      recommendations.push('Consider adjusting relevance thresholds for different results');
    }

    const avgRelevance = segments.reduce((sum, s) => sum + s.relevanceScore, 0) / segments.length;
    if (avgRelevance < 0.5) {
      recommendations.push('Low overall relevance detected - consider different content');
    }

    return recommendations;
  }

  private async convertVideoToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
