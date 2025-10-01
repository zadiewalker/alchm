/**
 * ALCHM Competitive Intelligence System
 * Core type definitions for market monitoring and analysis
 */

export interface CompetitorProfile {
  id: string;
  name: string;
  bundleId: string; // iOS bundle ID
  packageName: string; // Android package name
  category: string[];
  primaryFocus: 'mental-health' | 'meditation' | 'therapy' | 'crisis-support' | 'journaling' | 'wellness';
  description: string;
  websiteUrl?: string;
  foundedYear?: number;
  lastUpdated: Date;
  isActive: boolean;
  trackingStartDate: Date;
  tags: string[];
}

export interface AppStoreMetrics {
  competitorId: string;
  platform: 'ios' | 'android';
  date: Date;
  
  // Rankings
  overallRank?: number;
  categoryRank: number;
  categoryId: string;
  
  // Downloads & Revenue (estimated)
  estimatedDownloads?: number;
  estimatedRevenue?: number;
  
  // Ratings & Reviews
  averageRating: number;
  totalReviews: number;
  recentReviews: number; // Reviews in last 30 days
  
  // Version & Updates
  version: string;
  lastVersionUpdate: Date;
  
  // Keywords & ASO
  keywordRankings: KeywordRanking[];
  visibilityScore: number;
  
  // Pricing
  pricingModel: 'free' | 'freemium' | 'subscription' | 'one-time';
  basePrice?: number;
  subscriptionPrices?: SubscriptionTier[];
}

export interface KeywordRanking {
  keyword: string;
  rank: number;
  searchVolume?: number;
  difficulty?: number;
  relevanceScore: number;
}

export interface SubscriptionTier {
  name: string;
  price: number;
  interval: 'monthly' | 'yearly' | 'weekly';
  features: string[];
}

export interface ReviewSentiment {
  competitorId: string;
  platform: 'ios' | 'android';
  reviewId: string;
  date: Date;
  rating: number;
  title: string;
  content: string;
  
  // Sentiment Analysis
  sentimentScore: number; // -1 to 1
  sentimentLabel: 'positive' | 'neutral' | 'negative';
  emotions: EmotionScore[];
  
  // Content Analysis
  topics: TopicMention[];
  featuresDiscussed: string[];
  issuesReported: string[];
  
  // AI Analysis
  aiAnalysisConfidence: number;
  keyInsights: string[];
}

export interface EmotionScore {
  emotion: 'joy' | 'anger' | 'fear' | 'sadness' | 'surprise' | 'trust' | 'frustration' | 'satisfaction';
  score: number; // 0 to 1
}

export interface TopicMention {
  topic: string;
  relevanceScore: number;
  mentions: number;
}

export interface FeatureAnalysis {
  competitorId: string;
  date: Date;
  
  // Feature Detection
  detectedFeatures: Feature[];
  newFeatures: Feature[];
  removedFeatures: Feature[];
  
  // Content Analysis
  appDescription: string;
  marketingCopy: string[];
  screenshots: ScreenshotAnalysis[];
  
  // Positioning
  valuePropositions: string[];
  targetAudience: string[];
  uniqueSellingPoints: string[];
}

export interface Feature {
  name: string;
  category: string;
  description: string;
  confidence: number;
  firstDetected: Date;
  lastConfirmed?: Date;
  status: 'active' | 'deprecated' | 'beta';
}

export interface ScreenshotAnalysis {
  url: string;
  caption?: string;
  detectedElements: UIElement[];
  designPatterns: string[];
  accessibility: AccessibilityScore;
}

export interface UIElement {
  type: 'button' | 'input' | 'navigation' | 'content' | 'modal' | 'chart';
  description: string;
  position: { x: number; y: number; width: number; height: number };
  confidence: number;
}

export interface AccessibilityScore {
  colorContrast: number;
  textSize: number;
  navigationClarity: number;
  overallScore: number;
}

export interface MarketOpportunity {
  id: string;
  type: 'gap' | 'weakness' | 'trend' | 'collaboration';
  title: string;
  description: string;
  
  // Analysis
  evidencePoints: string[];
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  
  // Market Context
  marketSize?: number;
  competitorGaps: string[];
  userNeedEvidence: string[];
  
  // Strategic Recommendations
  recommendedActions: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  estimatedImpact: 'low' | 'medium' | 'high';
  
  // Tracking
  identifiedDate: Date;
  status: 'new' | 'investigating' | 'validated' | 'implemented' | 'dismissed';
}

export interface CompetitiveAlert {
  id: string;
  type: 'ranking-change' | 'new-feature' | 'pricing-change' | 'sentiment-shift' | 'vulnerability';
  competitorId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  
  // Alert Data
  triggerData: any;
  threshold: any;
  previousValue?: any;
  currentValue: any;
  
  // Timestamps
  detectedAt: Date;
  notifiedAt?: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  
  // Action Items
  recommendedActions: string[];
  assignedTo?: string;
  status: 'new' | 'investigating' | 'acknowledged' | 'resolved';
}

export interface CompetitiveReport {
  id: string;
  type: 'weekly-brief' | 'feature-gap' | 'market-position' | 'opportunity-analysis';
  title: string;
  
  // Report Content
  executiveSummary: string;
  keyFindings: string[];
  recommendations: string[];
  
  // Data Period
  startDate: Date;
  endDate: Date;
  
  // Sections
  sections: ReportSection[];
  
  // Metadata
  generatedAt: Date;
  generatedBy: 'automated' | 'manual';
  confidenceLevel: number;
  dataQualityScore: number;
}

export interface ReportSection {
  title: string;
  content: string;
  charts?: ChartConfig[];
  insights: string[];
  confidence: number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  title: string;
  data: any[];
  options: any;
}

export interface MonitoringConfig {
  competitorIds: string[];
  
  // Monitoring Frequency
  appStoreCheckFrequency: 'hourly' | 'daily' | 'weekly';
  reviewAnalysisFrequency: 'daily' | 'weekly';
  featureDetectionFrequency: 'weekly' | 'monthly';
  
  // Alert Thresholds
  rankingChangeThreshold: number;
  sentimentChangeThreshold: number;
  reviewVolumeThreshold: number;
  
  // Notification Settings
  emailAlerts: boolean;
  slackIntegration?: {
    webhookUrl: string;
    channel: string;
  };
  
  // Data Retention
  dataRetentionDays: number;
  archiveAfterDays: number;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'app-store' | 'google-play' | 'web-scraping' | 'api' | 'manual';
  url?: string;
  apiKey?: string;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  reliability: number; // 0 to 1
  lastSuccessfulUpdate: Date;
  isActive: boolean;
}

// Export all types for easier imports
export type {
  CompetitorProfile,
  AppStoreMetrics,
  KeywordRanking,
  SubscriptionTier,
  ReviewSentiment,
  EmotionScore,
  TopicMention,
  FeatureAnalysis,
  Feature,
  ScreenshotAnalysis,
  UIElement,
  AccessibilityScore,
  MarketOpportunity,
  CompetitiveAlert,
  CompetitiveReport,
  ReportSection,
  ChartConfig,
  MonitoringConfig,
  DataSource,
};