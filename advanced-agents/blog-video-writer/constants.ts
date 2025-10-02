export const BLOG_WRITING_AGENTS = [
  'Video Analyzer',
  'Content Planner', 
  'Researcher',
  'Writer',
  'Editor'
];

export const TARGET_AUDIENCES = [
  { id: 'general', label: 'General Public', description: 'Accessible to everyone' },
  { id: 'technical', label: 'Technical Professionals', description: 'Industry experts and practitioners' },
  { id: 'academic', label: 'Academic Community', description: 'Researchers and students' },
  { id: 'business', label: 'Business Leaders', description: 'Executives and decision makers' }
];

export const BLOG_STYLES = [
  { id: 'informative', label: 'Informative', description: 'Educational and fact-based' },
  { id: 'narrative', label: 'Narrative', description: 'Story-driven and engaging' },
  { id: 'analytical', label: 'Analytical', description: 'Data-driven and detailed' },
  { id: 'tutorial', label: 'Tutorial', description: 'Step-by-step instructional' }
];

export const CONTENT_DEPTHS = [
  { id: 'basic', label: 'Basic', description: 'Surface-level overview' },
  { id: 'intermediate', label: 'Intermediate', description: 'Moderate detail and context' },
  { id: 'advanced', label: 'Advanced', description: 'Comprehensive and technical' }
];

export const WORD_COUNTS = [
  { id: 'short', label: 'Short (500-800 words)', description: 'Quick read, 3-4 minutes' },
  { id: 'medium', label: 'Medium (800-1500 words)', description: 'Standard blog post, 5-8 minutes' },
  { id: 'long', label: 'Long (1500+ words)', description: 'In-depth article, 10+ minutes' }
];

export const AGENT_DESCRIPTIONS = {
  'Video Analyzer': 'Analyzes video content, extracts key information, and identifies main topics',
  'Content Planner': 'Creates structured outline and content strategy based on video analysis',
  'Researcher': 'Gathers additional context, background information, and supporting data',
  'Writer': 'Crafts engaging blog post content following the outline and research',
  'Editor': 'Reviews, refines, and optimizes the final blog post for quality and SEO'
};

export const PROCESSING_STAGES = [
  'Analyzing video content...',
  'Planning content structure...',
  'Researching background information...',
  'Writing blog post draft...',
  'Editing and finalizing content...'
];

export const VIDEO_ANALYSIS_PROMPTS = {
  summary: `Analyze this video and provide a comprehensive summary that captures the main message, key points, and overall purpose. Focus on what viewers would learn or gain from watching this video.`,
  
  keyTopics: `Identify the main topics, themes, and subjects covered in this video. List them in order of importance and relevance to the content.`,
  
  technicalDetails: `Extract any technical information, specifications, processes, or methodologies mentioned in the video. Include tools, technologies, or specific techniques discussed.`,
  
  visualElements: `Describe the visual elements, graphics, demonstrations, or visual aids used in the video. Note any charts, diagrams, or visual storytelling techniques.`
};

export const CONTENT_PLANNING_PROMPTS = {
  outline: `Based on the video analysis, create a detailed blog post outline that includes:
  - Compelling title
  - Introduction that hooks the reader
  - Main sections with clear headings
  - Key points for each section
  - Conclusion that summarizes value
  - Call-to-action if appropriate`,
  
  structure: `Design the content structure to match the target audience and blog style. Ensure logical flow and appropriate depth for the specified content level.`
};

export const RESEARCH_PROMPTS = {
  background: `Research background information related to the video topics. Provide context that would help readers better understand the subject matter.`,
  
  industry: `Gather relevant industry insights, trends, and current developments related to the video content. Include statistics or data points if applicable.`,
  
  related: `Identify related topics, concepts, or technologies that complement the video content and would add value to the blog post.`
};

export const WRITING_PROMPTS = {
  draft: `Write an engaging blog post based on the content outline and research data. Ensure the writing style matches the specified target audience and blog style.`,
  
  sections: `Develop each section with appropriate detail, examples, and explanations. Maintain consistent tone and voice throughout.`,
  
  engagement: `Include engaging elements like questions, examples, or scenarios that help readers connect with the content.`
};

export const EDITING_PROMPTS = {
  review: `Review the blog post for clarity, coherence, and engagement. Improve sentence structure, flow, and readability.`,
  
  seo: `Optimize the content for SEO by improving headings, adding relevant keywords naturally, and ensuring good content structure.`,
  
  quality: `Assess and improve the overall quality, ensuring the content delivers value to the target audience and achieves the intended purpose.`
};
