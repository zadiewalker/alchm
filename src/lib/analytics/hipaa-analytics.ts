// HIPAA-Compliant Analytics - Privacy-First Event Tracking
// Safely tracks business metrics without exposing sensitive user data

import { UserProfile } from '@/types/firestore-schema';

// Safe event taxonomy - no PHI included
export interface SafeAnalyticsEvent {
  // Event identification
  eventType: SafeEventType;
  eventId: string;
  timestamp: number;
  sessionId: string;
  
  // User context (anonymized)
  userCohort: string; // Week-based cohort, no direct user identification
  userTier: 'free' | 'deep-cut' | 'oracle';
  userSegment: 'new' | 'returning' | 'at_risk' | 'power_user';
  daysSinceSignup: number;
  
  // Engagement metrics (aggregated)
  engagementMetrics: {
    sessionDuration?: number;
    pageViews?: number;
    interactionCount?: number;
    featureUsed?: string;
  };
  
  // Business metrics
  businessMetrics: {
    conversionFunnel?: string;
    revenueImpact?: number;
    churnRisk?: 'low' | 'medium' | 'high';
    npsScore?: number;
  };
  
  // Technical metrics
  technicalMetrics: {
    platform?: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    browserFamily?: string;
    connectionType?: string;
    loadTime?: number;
    errorCount?: number;
  };
  
  // Custom properties (sanitized)
  customProperties: Record<string, string | number | boolean>;
}

// Safe event types - categorized for HIPAA compliance
export type SafeEventType = 
  // User lifecycle (no PHI)
  | 'user_signed_up'
  | 'user_onboarded'
  | 'user_tier_upgraded'
  | 'user_churned'
  | 'user_reactivated'
  
  // Engagement events (aggregated)
  | 'journal_entry_created'
  | 'journal_entry_completed'
  | 'ai_insight_viewed'
  | 'ai_insight_acted_on'
  | 'mood_tracked'
  | 'streak_milestone'
  
  // Feature usage (no content)
  | 'feature_discovered'
  | 'feature_adopted'
  | 'premium_feature_accessed'
  | 'ai_mentor_session_started'
  | 'pattern_analysis_viewed'
  | 'export_requested'
  
  // Business metrics
  | 'conversion_funnel_entered'
  | 'conversion_funnel_completed'
  | 'payment_initiated'
  | 'payment_completed'
  | 'subscription_cancelled'
  | 'support_contacted'
  
  // Product experience
  | 'app_opened'
  | 'app_backgrounded'
  | 'offline_mode_used'
  | 'sync_completed'
  | 'error_encountered'
  | 'performance_issue';

// Anonymization configuration
export interface AnonymizationConfig {
  cohortGranularity: 'weekly' | 'monthly'; // How to group users
  geoGranularity: 'country' | 'region' | 'none'; // Geographic grouping
  temporalGranularity: 'hour' | 'day' | 'week'; // Time grouping
  retentionPeriod: number; // Days to retain analytics
  pseudonymizationSalt: string; // For consistent anonymization
}

// Privacy-safe user segmentation
export class UserSegmentAnalyzer {
  static categorizeUser(profile: UserProfile, engagementData: any): string {
    const daysSinceSignup = Math.floor(
      (Date.now() - profile.createdAt.seconds * 1000) / (1000 * 60 * 60 * 24)
    );
    
    // Segment based on behavior patterns, not content
    if (daysSinceSignup <= 7) return 'new';
    if (profile.currentStreak >= 30) return 'power_user';
    if (profile.lastActiveAt.seconds * 1000 < Date.now() - (7 * 24 * 60 * 60 * 1000)) return 'at_risk';
    return 'returning';
  }
  
  static generateCohort(signupDate: Date, granularity: 'weekly' | 'monthly' = 'weekly'): string {
    const year = signupDate.getFullYear();
    
    if (granularity === 'monthly') {
      const month = signupDate.getMonth() + 1;
      return `${year}-${month.toString().padStart(2, '0')}`;
    }
    
    // Weekly cohort
    const week = Math.ceil(signupDate.getDate() / 7);
    const month = signupDate.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}-W${week}`;
  }
}

// HIPAA-compliant analytics tracker
export class HIPAAAnalytics {
  private config: AnonymizationConfig;
  private eventQueue: SafeAnalyticsEvent[] = [];
  private sessionId: string;
  private userCohort: string | null = null;
  
  constructor(config: AnonymizationConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
  }
  
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private setupEventListeners() {
    // Track app lifecycle events
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackEvent('app_backgrounded', {});
      }
    });
    
    // Track performance issues
    window.addEventListener('error', (event) => {
      this.trackEvent('error_encountered', {
        errorType: 'javascript',
        source: this.sanitizeUrl(event.filename || ''),
        lineNumber: event.lineno || 0
      });
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('error_encountered', {
        errorType: 'promise_rejection',
        reason: typeof event.reason === 'string' ? event.reason.substring(0, 100) : 'unknown'
      });
    });
  }
  
  // Initialize user context (called once per session)
  initializeUserContext(profile: UserProfile, engagementData: any) {
    this.userCohort = UserSegmentAnalyzer.generateCohort(
      new Date(profile.createdAt.seconds * 1000),
      this.config.cohortGranularity
    );
    
    // Track session start
    this.trackEvent('app_opened', {
      userTier: profile.tier,
      userSegment: UserSegmentAnalyzer.categorizeUser(profile, engagementData),
      daysSinceSignup: Math.floor(
        (Date.now() - profile.createdAt.seconds * 1000) / (1000 * 60 * 60 * 24)
      ),
      currentStreak: Math.min(profile.currentStreak, 365), // Cap for privacy
      totalEntries: Math.min(profile.totalEntries, 10000) // Cap for privacy
    });
  }
  
  // Track safe analytics events
  trackEvent(
    eventType: SafeEventType, 
    properties: Record<string, any> = {},
    userTier: 'free' | 'deep-cut' | 'oracle' = 'free'
  ) {
    const event: SafeAnalyticsEvent = {
      eventType,
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      
      userCohort: this.userCohort || 'unknown',
      userTier,
      userSegment: properties.userSegment || 'unknown',
      daysSinceSignup: properties.daysSinceSignup || 0,
      
      engagementMetrics: {
        sessionDuration: properties.sessionDuration,
        pageViews: properties.pageViews,
        interactionCount: properties.interactionCount,
        featureUsed: properties.featureUsed
      },
      
      businessMetrics: {
        conversionFunnel: properties.conversionFunnel,
        revenueImpact: properties.revenueImpact,
        churnRisk: properties.churnRisk,
        npsScore: properties.npsScore
      },
      
      technicalMetrics: {
        platform: this.getPlatform(),
        deviceType: this.getDeviceType(),
        browserFamily: this.getBrowserFamily(),
        connectionType: this.getConnectionType(),
        loadTime: properties.loadTime,
        errorCount: properties.errorCount
      },
      
      customProperties: this.sanitizeProperties(properties)
    };
    
    this.eventQueue.push(event);
    
    // Batch send events
    if (this.eventQueue.length >= 10 || eventType === 'app_backgrounded') {
      this.flushEvents();
    }
  }
  
  // Specific tracking methods for common events
  trackJournalEngagement(entryLength: number, moodImprovement: number, userTier: string) {
    this.trackEvent('journal_entry_completed', {
      wordCountBucket: this.bucketWordCount(entryLength),
      moodImprovementBucket: this.bucketMoodImprovement(moodImprovement),
      userTier
    });
  }
  
  trackAIInsightEngagement(insightType: string, userRating: number, userTier: string) {
    this.trackEvent('ai_insight_acted_on', {
      insightType,
      ratingBucket: Math.ceil(userRating / 2) * 2, // Round to nearest 2
      userTier
    });
  }
  
  trackFeatureAdoption(featureName: string, userTier: string, isFirstTime: boolean) {
    this.trackEvent(isFirstTime ? 'feature_discovered' : 'feature_adopted', {
      featureUsed: featureName,
      userTier
    });
  }
  
  trackConversionFunnel(funnelStep: string, userTier: string, completed: boolean) {
    this.trackEvent(
      completed ? 'conversion_funnel_completed' : 'conversion_funnel_entered',
      {
        conversionFunnel: funnelStep,
        userTier
      }
    );
  }
  
  trackPerformanceMetric(metricType: string, value: number) {
    this.trackEvent('performance_issue', {
      performanceMetric: metricType,
      value: Math.round(value),
      threshold: this.getPerformanceThreshold(metricType)
    });
  }
  
  // Privacy-safe data bucketing
  private bucketWordCount(wordCount: number): string {
    if (wordCount < 10) return '0-10';
    if (wordCount < 50) return '10-50';
    if (wordCount < 100) return '50-100';
    if (wordCount < 250) return '100-250';
    if (wordCount < 500) return '250-500';
    return '500+';
  }
  
  private bucketMoodImprovement(improvement: number): string {
    if (improvement <= 0) return 'none';
    if (improvement <= 1) return 'small';
    if (improvement <= 2) return 'medium';
    return 'large';
  }
  
  private sanitizeProperties(props: Record<string, any>): Record<string, string | number | boolean> {
    const sanitized: Record<string, string | number | boolean> = {};
    
    for (const [key, value] of Object.entries(props)) {
      // Skip potential PHI fields
      if (this.isPotentialPHI(key)) continue;
      
      // Sanitize values
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  private isPotentialPHI(fieldName: string): boolean {
    const phiFields = [
      'email', 'name', 'phone', 'address', 'text', 'content', 
      'journal', 'entry', 'message', 'note', 'reflection'
    ];
    
    return phiFields.some(phi => fieldName.toLowerCase().includes(phi));
  }
  
  private sanitizeString(value: string): string {
    // Remove potential personal information
    return value
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]')
      .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[phone]')
      .replace(/\b\d{1,5}\s\w+\s(street|st|avenue|ave|road|rd|drive|dr)\b/gi, '[address]')
      .substring(0, 100); // Limit length
  }
  
  private sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      return `${parsed.origin}${parsed.pathname}`;
    } catch {
      return 'unknown';
    }
  }
  
  // Device and environment detection
  private getPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mobile')) return 'mobile';
    if (userAgent.includes('tablet')) return 'tablet';
    return 'desktop';
  }
  
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (window.innerWidth < 768) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  }
  
  private getBrowserFamily(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('safari')) return 'safari';
    if (userAgent.includes('edge')) return 'edge';
    return 'other';
  }
  
  private getConnectionType(): string {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    return connection?.effectiveType || 'unknown';
  }
  
  private getPerformanceThreshold(metricType: string): number {
    const thresholds: Record<string, number> = {
      'page_load_time': 3000,
      'first_contentful_paint': 1500,
      'largest_contentful_paint': 2500,
      'cumulative_layout_shift': 0.1,
      'first_input_delay': 100
    };
    
    return thresholds[metricType] || 1000;
  }
  
  // Batch event processing
  private async flushEvents() {
    if (this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      await this.sendEvents(events);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      
      // Re-queue events for retry (with limit)
      if (this.eventQueue.length < 50) {
        this.eventQueue.push(...events);
      }
    }
  }
  
  private async sendEvents(events: SafeAnalyticsEvent[]) {
    // Send to multiple endpoints for redundancy
    const endpoints = [
      '/api/analytics/events',
      '/api/analytics/backup'
    ];
    
    const promises = endpoints.map(endpoint =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      }).catch(error => {
        console.warn(`Analytics endpoint ${endpoint} failed:`, error);
        return null;
      })
    );
    
    // At least one endpoint must succeed
    const results = await Promise.all(promises);
    const successful = results.filter(result => result?.ok).length;
    
    if (successful === 0) {
      throw new Error('All analytics endpoints failed');
    }
  }
  
  // Public API
  async flush() {
    await this.flushEvents();
  }
  
  getQueuedEventCount(): number {
    return this.eventQueue.length;
  }
  
  clearQueue() {
    this.eventQueue = [];
  }
}

// Global analytics instance
export const analytics = new HIPAAAnalytics({
  cohortGranularity: 'weekly',
  geoGranularity: 'country',
  temporalGranularity: 'hour',
  retentionPeriod: 365, // 1 year retention
  pseudonymizationSalt: process.env.NEXT_PUBLIC_ANALYTICS_SALT || 'default-salt'
});

// React hook for analytics
export function useAnalytics() {
  const trackEvent = (eventType: SafeEventType, properties?: Record<string, any>) => {
    analytics.trackEvent(eventType, properties);
  };
  
  const trackJournalEngagement = (entryLength: number, moodImprovement: number, userTier: string) => {
    analytics.trackJournalEngagement(entryLength, moodImprovement, userTier);
  };
  
  const trackFeatureUsage = (featureName: string, userTier: string, isFirstTime = false) => {
    analytics.trackFeatureAdoption(featureName, userTier, isFirstTime);
  };
  
  const trackConversion = (funnelStep: string, userTier: string, completed = false) => {
    analytics.trackConversionFunnel(funnelStep, userTier, completed);
  };
  
  return {
    trackEvent,
    trackJournalEngagement,
    trackFeatureUsage,
    trackConversion,
    flush: () => analytics.flush()
  };
}