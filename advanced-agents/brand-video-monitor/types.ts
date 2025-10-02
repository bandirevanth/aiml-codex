export interface BrandProfile {
  brandName: string;
  industry: string;
  targetAudience: string;
  brandValues: string[];
  competitorBrands: string[];
  monitoringKeywords: string[];
  alertThresholds: {
    sentiment: number;
    mentions: number;
    engagement: number;
  };
}

export interface VideoAnalysisConfig {
  analysisDepth: 'basic' | 'comprehensive' | 'detailed';
  focusAreas: string[];
  sentimentAnalysis: boolean;
  competitorComparison: boolean;
  trendAnalysis: boolean;
  realTimeAlerts: boolean;
}

export interface BrandMention {
  timestamp: string;
  platform: string;
  context: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  visibility: number;
  engagement: number;
}

export interface CompetitorAnalysis {
  competitorName: string;
  mentions: number;
  sentiment: number;
  visibility: number;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
}

export interface BrandMonitoringReport {
  brandProfile: BrandProfile;
  analysisConfig: VideoAnalysisConfig;
  videoAnalysis: {
    brandPresence: {
      logoDetections: number;
      productMentions: number;
      brandVisibility: number;
      contextualRelevance: number;
    };
    sentimentAnalysis: {
      overallSentiment: 'positive' | 'negative' | 'neutral';
      sentimentScore: number;
      emotionalTone: string[];
      audienceReaction: string;
    };
    competitorAnalysis: CompetitorAnalysis[];
    brandPositioning: {
      messageAlignment: number;
      valuePropositionClarity: number;
      brandConsistency: number;
      targetAudienceRelevance: number;
    };
    riskAssessment: {
      reputationRisk: 'low' | 'medium' | 'high';
      crisisIndicators: string[];
      recommendedActions: string[];
    };
  };
  insights: {
    keyFindings: string[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  };
  alerts: {
    criticalAlerts: string[];
    warningAlerts: string[];
    informationalAlerts: string[];
  };
  trends: {
    sentimentTrend: Array<{ date: string; score: number }>;
    mentionsTrend: Array<{ date: string; count: number }>;
    engagementTrend: Array<{ date: string; rate: number }>;
  };
  timestamp: string;
}

export interface MonitoringProgress {
  currentStep: string;
  progress: number;
  estimatedTimeRemaining: string;
  status: 'analyzing' | 'processing' | 'generating' | 'complete' | 'error';
  details: string;
}

export interface AlertConfiguration {
  enabled: boolean;
  channels: ('email' | 'sms' | 'webhook')[];
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  conditions: {
    sentimentDrop: number;
    mentionSpike: number;
    competitorActivity: boolean;
    crisisKeywords: string[];
  };
}
