/**
 * ALCHM Competitive Intelligence Database Schema
 * Firestore collection structures and validation
 */

import { 
  CompetitorProfile, 
  AppStoreMetrics, 
  ReviewSentiment, 
  FeatureAnalysis,
  MarketOpportunity,
  CompetitiveAlert,
  CompetitiveReport,
  MonitoringConfig
} from './types';

/**
 * Firestore Collection Names
 */
export const COLLECTIONS = {
  COMPETITORS: 'competitive_intelligence_competitors',
  APP_STORE_METRICS: 'competitive_intelligence_app_metrics',
  REVIEW_SENTIMENT: 'competitive_intelligence_reviews',
  FEATURE_ANALYSIS: 'competitive_intelligence_features',
  MARKET_OPPORTUNITIES: 'competitive_intelligence_opportunities',
  ALERTS: 'competitive_intelligence_alerts',
  REPORTS: 'competitive_intelligence_reports',
  MONITORING_CONFIG: 'competitive_intelligence_config',
  DATA_SOURCES: 'competitive_intelligence_data_sources',
  AUDIT_LOG: 'competitive_intelligence_audit'
} as const;

/**
 * Index Configurations for Optimal Query Performance
 */
export const INDEXES = {
  // Competitors
  competitors_by_category: {
    collection: COLLECTIONS.COMPETITORS,
    fields: [
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'isActive', order: 'ASCENDING' },
      { fieldPath: 'lastUpdated', order: 'DESCENDING' }
    ]
  },
  
  // App Store Metrics
  metrics_by_competitor_date: {
    collection: COLLECTIONS.APP_STORE_METRICS,
    fields: [
      { fieldPath: 'competitorId', order: 'ASCENDING' },
      { fieldPath: 'platform', order: 'ASCENDING' },
      { fieldPath: 'date', order: 'DESCENDING' }
    ]
  },
  
  metrics_by_ranking: {
    collection: COLLECTIONS.APP_STORE_METRICS,
    fields: [
      { fieldPath: 'categoryRank', order: 'ASCENDING' },
      { fieldPath: 'date', order: 'DESCENDING' }
    ]
  },
  
  // Reviews
  reviews_by_sentiment: {
    collection: COLLECTIONS.REVIEW_SENTIMENT,
    fields: [
      { fieldPath: 'competitorId', order: 'ASCENDING' },
      { fieldPath: 'sentimentScore', order: 'DESCENDING' },
      { fieldPath: 'date', order: 'DESCENDING' }
    ]
  },
  
  reviews_by_date: {
    collection: COLLECTIONS.REVIEW_SENTIMENT,
    fields: [
      { fieldPath: 'date', order: 'DESCENDING' },
      { fieldPath: 'platform', order: 'ASCENDING' }
    ]
  },
  
  // Alerts
  alerts_by_severity: {
    collection: COLLECTIONS.ALERTS,
    fields: [
      { fieldPath: 'severity', order: 'DESCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'detectedAt', order: 'DESCENDING' }
    ]
  },
  
  // Opportunities
  opportunities_by_priority: {
    collection: COLLECTIONS.MARKET_OPPORTUNITIES,
    fields: [
      { fieldPath: 'priority', order: 'DESCENDING' },
      { fieldPath: 'confidence', order: 'DESCENDING' },
      { fieldPath: 'identifiedDate', order: 'DESCENDING' }
    ]
  }
};

/**
 * Data Validation Rules
 */
export const VALIDATION_RULES = {
  competitor: {
    required: ['id', 'name', 'bundleId', 'category', 'primaryFocus'],
    stringFields: ['id', 'name', 'bundleId', 'packageName', 'description', 'websiteUrl'],
    arrayFields: ['category', 'tags'],
    dateFields: ['lastUpdated', 'trackingStartDate'],
    booleanFields: ['isActive'],
    enumFields: {
      primaryFocus: ['mental-health', 'meditation', 'therapy', 'crisis-support', 'journaling', 'wellness']
    }
  },
  
  appStoreMetrics: {
    required: ['competitorId', 'platform', 'date', 'categoryRank', 'averageRating', 'totalReviews'],
    stringFields: ['competitorId', 'version', 'categoryId'],
    numberFields: ['overallRank', 'categoryRank', 'estimatedDownloads', 'estimatedRevenue', 'averageRating', 'totalReviews', 'recentReviews', 'visibilityScore', 'basePrice'],
    dateFields: ['date', 'lastVersionUpdate'],
    enumFields: {
      platform: ['ios', 'android'],
      pricingModel: ['free', 'freemium', 'subscription', 'one-time']
    }
  }
};

/**
 * Security Rules Templates
 */
export const SECURITY_RULES = {
  // Only authenticated admin users can access competitive intelligence
  competitors: `
    match /competitive_intelligence_competitors/{typeof window !== 'undefined' && document} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  `,
  
  metrics: `
    match /competitive_intelligence_app_metrics/{typeof window !== 'undefined' && document} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  `,
  
  // Read-only access for reports (for team members)
  reports: `
    match /competitive_intelligence_reports/{typeof window !== 'undefined' && document} {
      allow read: if request.auth != null && 
        (request.auth.token.admin == true || request.auth.token.team_member == true);
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  `
};

/**
 * Document Converters for Type Safety
 */
export class CompetitiveIntelligenceConverter {
  static competitorToFirestore(competitor: CompetitorProfile) {
    return {
      ...competitor,
      lastUpdated: competitor.lastUpdated,
      trackingStartDate: competitor.trackingStartDate,
    };
  }
  
  static competitorFromFirestore(data: any, id: string): CompetitorProfile {
    return {
      ...data,
      id,
      lastUpdated: data.lastUpdated?.toDate() || new Date(),
      trackingStartDate: data.trackingStartDate?.toDate() || new Date(),
      foundedYear: data.foundedYear || undefined,
    } as CompetitorProfile;
  }
  
  static metricsToFirestore(metrics: AppStoreMetrics) {
    return {
      ...metrics,
      date: metrics.date,
      lastVersionUpdate: metrics.lastVersionUpdate,
    };
  }
  
  static metricsFromFirestore(data: any, id: string): AppStoreMetrics {
    return {
      ...data,
      id,
      date: data.date?.toDate() || new Date(),
      lastVersionUpdate: data.lastVersionUpdate?.toDate() || new Date(),
    } as AppStoreMetrics;
  }
  
  static reviewToFirestore(review: ReviewSentiment) {
    return {
      ...review,
      date: review.date,
    };
  }
  
  static reviewFromFirestore(data: any, id: string): ReviewSentiment {
    return {
      ...data,
      id,
      date: data.date?.toDate() || new Date(),
    } as ReviewSentiment;
  }
}

/**
 * Query Builders for Common Operations
 */
export class CompetitiveQueryBuilder {
  /**
   * Get active competitors by category
   */
  static getActiveCompetitorsByCategory(category: string) {
    return {
      collection: COLLECTIONS.COMPETITORS,
      where: [
        ['isActive', '==', true],
        ['category', 'array-contains', category]
      ],
      orderBy: [['lastUpdated', 'desc']]
    };
  }
  
  /**
   * Get recent app store metrics for a competitor
   */
  static getRecentMetrics(competitorId: string, platform: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return {
      collection: COLLECTIONS.APP_STORE_METRICS,
      where: [
        ['competitorId', '==', competitorId],
        ['platform', '==', platform],
        ['date', '>=', startDate]
      ],
      orderBy: [['date', 'desc']]
    };
  }
  
  /**
   * Get trending negative reviews
   */
  static getTrendingNegativeReviews(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return {
      collection: COLLECTIONS.REVIEW_SENTIMENT,
      where: [
        ['date', '>=', startDate],
        ['sentimentScore', '<', -0.3],
        ['rating', '<=', 2]
      ],
      orderBy: [['date', 'desc']],
      limit: 100
    };
  }
  
  /**
   * Get high-priority unresolved alerts
   */
  static getHighPriorityAlerts() {
    return {
      collection: COLLECTIONS.ALERTS,
      where: [
        ['status', 'in', ['new', 'investigating']],
        ['severity', 'in', ['high', 'critical']]
      ],
      orderBy: [['detectedAt', 'desc']]
    };
  }
  
  /**
   * Get market opportunities by priority
   */
  static getMarketOpportunitiesByPriority(priority: string = 'high') {
    return {
      collection: COLLECTIONS.MARKET_OPPORTUNITIES,
      where: [
        ['priority', '==', priority],
        ['status', 'in', ['new', 'investigating', 'validated']]
      ],
      orderBy: [['confidence', 'desc'], ['identifiedDate', 'desc']]
    };
  }
}

/**
 * Data Aggregation Helpers
 */
export class CompetitiveAggregations {
  /**
   * Calculate average metrics across competitors
   */
  static calculateMarketAverages(metrics: AppStoreMetrics[]) {
    if (metrics.length === 0) return null;
    
    const totals = metrics.reduce((acc, metric) => ({
      averageRating: acc.averageRating + metric.averageRating,
      totalReviews: acc.totalReviews + metric.totalReviews,
      visibilityScore: acc.visibilityScore + metric.visibilityScore,
      categoryRank: acc.categoryRank + metric.categoryRank
    }), { averageRating: 0, totalReviews: 0, visibilityScore: 0, categoryRank: 0 });
    
    const count = metrics.length;
    return {
      averageRating: totals.averageRating / count,
      averageTotalReviews: totals.totalReviews / count,
      averageVisibilityScore: totals.visibilityScore / count,
      averageCategoryRank: totals.categoryRank / count,
      sampleSize: count
    };
  }
  
  /**
   * Calculate sentiment trends
   */
  static calculateSentimentTrends(reviews: ReviewSentiment[]) {
    const sentimentByDate = new Map<string, { positive: number; neutral: number; negative: number; total: number }>();
    
    reviews.forEach(review => {
      const dateKey = review.date.toISOString().split('T')[0];
      const current = sentimentByDate.get(dateKey) || { positive: 0, neutral: 0, negative: 0, total: 0 };
      
      if (review.sentimentScore > 0.1) current.positive++;
      else if (review.sentimentScore < -0.1) current.negative++;
      else current.neutral++;
      current.total++;
      
      sentimentByDate.set(dateKey, current);
    });
    
    return Array.from(sentimentByDate.entries()).map(([date, sentiment]) => ({
      date,
      positivePercentage: (sentiment.positive / sentiment.total) * 100,
      neutralPercentage: (sentiment.neutral / sentiment.total) * 100,
      negativePercentage: (sentiment.negative / sentiment.total) * 100,
      totalReviews: sentiment.total
    }));
  }
}

export default {
  COLLECTIONS,
  INDEXES,
  VALIDATION_RULES,
  SECURITY_RULES,
  CompetitiveIntelligenceConverter,
  CompetitiveQueryBuilder,
  CompetitiveAggregations
};