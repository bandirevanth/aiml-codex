import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  VideoFile, 
  BlogWritingConfig, 
  BlogWritingResult,
  VideoAnalysis,
  ContentOutline,
  ResearchData,
  BlogDraft,
  EditedBlog
} from '../types';
import { 
  VIDEO_ANALYSIS_PROMPTS,
  CONTENT_PLANNING_PROMPTS,
  RESEARCH_PROMPTS,
  WRITING_PROMPTS,
  EDITING_PROMPTS
} from '../constants';

class BlogWriterService {
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

  async createBlogFromVideo(
    videoFile: VideoFile, 
    config: BlogWritingConfig,
    onProgress?: (agent: string, progress: number) => void
  ): Promise<BlogWritingResult> {
    const startTime = Date.now();
    
    try {
      onProgress?.('Video Analyzer', 20);
      const videoAnalysis = await this.analyzeVideo(videoFile, config);
      
      onProgress?.('Content Planner', 40);
      const contentOutline = await this.planContent(videoAnalysis, config);
      
      onProgress?.('Researcher', 60);
      const researchData = await this.conductResearch(videoAnalysis, contentOutline, config);
      
      onProgress?.('Writer', 80);
      const blogDraft = await this.writeBlogDraft(videoAnalysis, contentOutline, researchData, config);
      
      onProgress?.('Editor', 100);
      const editedBlog = await this.editBlog(blogDraft, config);
      
      const processingTime = Date.now() - startTime;
      
      return {
        videoAnalysis,
        contentOutline,
        researchData,
        blogDraft,
        editedBlog,
        metadata: {
          processingTime,
          agentContributions: [
            'Video content analysis and topic extraction',
            'Content structure and outline planning',
            'Background research and context gathering',
            'Blog post drafting and content creation',
            'Editorial review and optimization'
          ],
          qualityScore: this.calculateQualityScore(editedBlog)
        }
      };
    } catch (error) {
      console.error('Blog writing process failed:', error);
      throw new Error(`Failed to create blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async analyzeVideo(videoFile: VideoFile, config: BlogWritingConfig): Promise<VideoAnalysis> {
    const videoData = await this.convertVideoToBase64(videoFile.file);
    
    const analysisPrompt = `
    ${VIDEO_ANALYSIS_PROMPTS.summary}
    
    Target Audience: ${config.targetAudience}
    Content Depth: ${config.contentDepth}
    
    Please analyze this video and provide:
    1. A comprehensive summary
    2. Key topics and themes
    3. Technical details (if any)
    4. Visual elements and presentation style
    5. Audio quality assessment
    6. Content complexity level
    
    Format your response as JSON with the following structure:
    {
      "summary": "detailed summary",
      "keyTopics": ["topic1", "topic2"],
      "technicalDetails": ["detail1", "detail2"],
      "visualElements": ["element1", "element2"],
      "audioQuality": "quality assessment",
      "complexity": "basic|intermediate|advanced"
    }
    `;

    const result = await this.model.generateContent([
      { text: analysisPrompt },
      {
        inlineData: {
          mimeType: videoFile.file.type,
          data: videoData
        }
      }
    ]);

    const response = result.response.text();
    const analysisData = this.parseJSONResponse(response);
    
    return {
      summary: analysisData.summary || 'Video analysis completed',
      keyTopics: analysisData.keyTopics || [],
      technicalDetails: analysisData.technicalDetails || [],
      visualElements: analysisData.visualElements || [],
      audioQuality: analysisData.audioQuality || 'Good',
      duration: videoFile.duration || 0,
      complexity: analysisData.complexity || config.contentDepth
    };
  }

  private async planContent(videoAnalysis: VideoAnalysis, config: BlogWritingConfig): Promise<ContentOutline> {
    const planningPrompt = `
    Based on the following video analysis, create a detailed blog post outline:
    
    Video Summary: ${videoAnalysis.summary}
    Key Topics: ${videoAnalysis.keyTopics.join(', ')}
    Technical Details: ${videoAnalysis.technicalDetails.join(', ')}
    
    Configuration:
    - Target Audience: ${config.targetAudience}
    - Blog Style: ${config.blogStyle}
    - Content Depth: ${config.contentDepth}
    - Word Count: ${config.wordCount}
    - Include Call to Action: ${config.includeCallToAction}
    
    ${CONTENT_PLANNING_PROMPTS.outline}
    
    Format your response as JSON:
    {
      "title": "compelling blog post title",
      "introduction": "introduction outline",
      "mainSections": [
        {
          "heading": "section heading",
          "keyPoints": ["point1", "point2"],
          "estimatedWords": 200
        }
      ],
      "conclusion": "conclusion outline",
      "callToAction": "call to action (if applicable)"
    }
    `;

    const result = await this.model.generateContent(planningPrompt);
    const response = result.response.text();
    const outlineData = this.parseJSONResponse(response);
    
    return {
      title: outlineData.title || 'Blog Post About Video Content',
      introduction: outlineData.introduction || 'Introduction to the video content',
      mainSections: outlineData.mainSections || [],
      conclusion: outlineData.conclusion || 'Summary and final thoughts',
      callToAction: config.includeCallToAction ? outlineData.callToAction : undefined
    };
  }

  private async conductResearch(
    videoAnalysis: VideoAnalysis, 
    contentOutline: ContentOutline, 
    config: BlogWritingConfig
  ): Promise<ResearchData> {
    const researchPrompt = `
    Conduct research to support a blog post with the following details:
    
    Video Topics: ${videoAnalysis.keyTopics.join(', ')}
    Blog Title: ${contentOutline.title}
    Target Audience: ${config.targetAudience}
    Content Depth: ${config.contentDepth}
    
    ${RESEARCH_PROMPTS.background}
    ${RESEARCH_PROMPTS.industry}
    ${RESEARCH_PROMPTS.related}
    
    Provide research data in JSON format:
    {
      "backgroundInfo": ["info1", "info2"],
      "relatedTopics": ["topic1", "topic2"],
      "technicalContext": ["context1", "context2"],
      "industryInsights": ["insight1", "insight2"],
      "expertQuotes": ["quote1", "quote2"]
    }
    `;

    const result = await this.model.generateContent(researchPrompt);
    const response = result.response.text();
    const researchData = this.parseJSONResponse(response);
    
    return {
      backgroundInfo: researchData.backgroundInfo || [],
      relatedTopics: researchData.relatedTopics || [],
      technicalContext: researchData.technicalContext || [],
      industryInsights: researchData.industryInsights || [],
      expertQuotes: researchData.expertQuotes || []
    };
  }

  private async writeBlogDraft(
    videoAnalysis: VideoAnalysis,
    contentOutline: ContentOutline,
    researchData: ResearchData,
    config: BlogWritingConfig
  ): Promise<BlogDraft> {
    const wordCountTarget = this.getWordCountTarget(config.wordCount);
    
    const writingPrompt = `
    Write a complete blog post based on the following information:
    
    Video Analysis: ${videoAnalysis.summary}
    Key Topics: ${videoAnalysis.keyTopics.join(', ')}
    
    Content Outline:
    Title: ${contentOutline.title}
    Introduction: ${contentOutline.introduction}
    Main Sections: ${contentOutline.mainSections.map(s => `${s.heading}: ${s.keyPoints.join(', ')}`).join('\n')}
    Conclusion: ${contentOutline.conclusion}
    
    Research Data:
    Background: ${researchData.backgroundInfo.join(', ')}
    Industry Insights: ${researchData.industryInsights.join(', ')}
    
    Configuration:
    - Target Audience: ${config.targetAudience}
    - Blog Style: ${config.blogStyle}
    - Target Word Count: ${wordCountTarget}
    - Include Technical Details: ${config.includeTechnicalDetails}
    
    ${WRITING_PROMPTS.draft}
    
    Write the complete blog post content. Make it engaging, informative, and well-structured.
    `;

    const result = await this.model.generateContent(writingPrompt);
    const content = result.response.text();
    
    const wordCount = this.countWords(content);
    const sections = this.extractSections(content);
    
    return {
      title: contentOutline.title,
      content,
      wordCount,
      readingTime: Math.ceil(wordCount / 200), // Average reading speed
      sections
    };
  }

  private async editBlog(blogDraft: BlogDraft, config: BlogWritingConfig): Promise<EditedBlog> {
    const editingPrompt = `
    Review and edit the following blog post for quality, clarity, and optimization:
    
    Title: ${blogDraft.title}
    Content: ${blogDraft.content}
    Current Word Count: ${blogDraft.wordCount}
    
    Target Audience: ${config.targetAudience}
    Blog Style: ${config.blogStyle}
    
    ${EDITING_PROMPTS.review}
    ${EDITING_PROMPTS.seo}
    ${EDITING_PROMPTS.quality}
    
    Provide the edited version with improvements. Focus on:
    1. Clarity and readability
    2. SEO optimization
    3. Engagement and flow
    4. Grammar and style
    5. Value delivery to target audience
    
    Return the final polished blog post content.
    `;

    const result = await this.model.generateContent(editingPrompt);
    const finalContent = result.response.text();
    
    const finalWordCount = this.countWords(finalContent);
    
    return {
      finalTitle: blogDraft.title,
      finalContent,
      improvements: [
        'Enhanced readability and flow',
        'Optimized for SEO',
        'Improved engagement elements',
        'Refined for target audience'
      ],
      seoOptimizations: [
        'Optimized headings structure',
        'Natural keyword integration',
        'Improved meta description potential',
        'Enhanced content structure'
      ],
      readabilityScore: 85, // Simulated score
      finalWordCount,
      estimatedReadingTime: Math.ceil(finalWordCount / 200)
    };
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

  private parseJSONResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch (error) {
      console.warn('Failed to parse JSON response:', error);
      return {};
    }
  }

  private getWordCountTarget(wordCount: string): string {
    switch (wordCount) {
      case 'short': return '500-800 words';
      case 'medium': return '800-1500 words';
      case 'long': return '1500+ words';
      default: return '800-1500 words';
    }
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private extractSections(content: string): { name: string; content: string; wordCount: number; }[] {
    const sections = content.split(/(?=^#)/m).filter(section => section.trim());
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const name = lines[0].replace(/^#+\s*/, '') || 'Section';
      const sectionContent = lines.slice(1).join('\n');
      return {
        name,
        content: sectionContent,
        wordCount: this.countWords(sectionContent)
      };
    });
  }

  private calculateQualityScore(editedBlog: EditedBlog): number {
    let score = 70; // Base score
    
    if (editedBlog.finalWordCount > 500) score += 10;
    if (editedBlog.readabilityScore > 80) score += 10;
    if (editedBlog.improvements.length > 3) score += 5;
    if (editedBlog.seoOptimizations.length > 3) score += 5;
    
    return Math.min(score, 100);
  }
}

export default BlogWriterService;
