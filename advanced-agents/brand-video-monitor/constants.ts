export const BRAND_INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Entertainment',
  'Automotive',
  'Food & Beverage',
  'Fashion',
  'Travel',
  'Education',
  'Real Estate',
  'Sports',
  'Beauty & Cosmetics',
  'Energy',
  'Telecommunications'
] as const;

export const BRAND_VALUES = [
  'Innovation',
  'Quality',
  'Sustainability',
  'Customer Service',
  'Affordability',
  'Luxury',
  'Reliability',
  'Transparency',
  'Social Responsibility',
  'Performance',
  'Convenience',
  'Security',
  'Creativity',
  'Tradition',
  'Efficiency'
] as const;

export const ANALYSIS_FOCUS_AREAS = [
  'Brand Visibility',
  'Sentiment Analysis',
  'Competitor Comparison',
  'Message Consistency',
  'Audience Engagement',
  'Crisis Detection',
  'Trend Analysis',
  'Product Placement',
  'Logo Recognition',
  'Voice & Tone',
  'Market Positioning',
  'Reputation Management'
] as const;

export const MONITORING_PLATFORMS = [
  'YouTube',
  'TikTok',
  'Instagram',
  'Facebook',
  'Twitter',
  'LinkedIn',
  'Twitch',
  'Vimeo',
  'Snapchat',
  'Pinterest'
] as const;

export const SENTIMENT_THRESHOLDS = {
  POSITIVE: 0.6,
  NEUTRAL: 0.3,
  NEGATIVE: -0.3
} as const;

export const RISK_LEVELS = {
  LOW: { threshold: 0.2, color: 'green' },
  MEDIUM: { threshold: 0.5, color: 'yellow' },
  HIGH: { threshold: 0.8, color: 'red' }
} as const;

export const CRISIS_KEYWORDS = [
  'scandal',
  'controversy',
  'boycott',
  'lawsuit',
  'recall',
  'fraud',
  'discrimination',
  'harassment',
  'data breach',
  'safety issue',
  'environmental damage',
  'unethical',
  'misleading',
  'false advertising'
] as const;

export const MONITORING_INTERVALS = [
  { label: 'Real-time', value: 'realtime' },
  { label: 'Every 15 minutes', value: '15min' },
  { label: 'Hourly', value: 'hourly' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' }
] as const;

export const ALERT_CHANNELS = [
  { label: 'Email', value: 'email', icon: 'Mail' },
  { label: 'SMS', value: 'sms', icon: 'MessageSquare' },
  { label: 'Webhook', value: 'webhook', icon: 'Webhook' },
  { label: 'Dashboard', value: 'dashboard', icon: 'Monitor' }
] as const;

export const SAMPLE_COMPETITORS = {
  'Technology': ['Apple', 'Google', 'Microsoft', 'Amazon', 'Meta'],
  'Healthcare': ['Johnson & Johnson', 'Pfizer', 'Merck', 'Abbott', 'Medtronic'],
  'Finance': ['JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Goldman Sachs', 'Morgan Stanley'],
  'Retail': ['Walmart', 'Amazon', 'Target', 'Costco', 'Home Depot'],
  'Automotive': ['Toyota', 'Ford', 'General Motors', 'Tesla', 'Honda']
} as const;
