/**
 * ALCHM Business Intelligence System
 * Privacy-First Analytics Types and Interfaces
 * 
 * Implements HIPAA-level anonymization and aggregation
 * No personal journal content exposure
 * Differential privacy with k-anonymity (k>=5)
 */

// ===== CORE PRIVACY TYPES =====

export interface PrivacyConfig {
  minimumCohortSize: number; // k-anonymity threshold (default: 5)
  noiseLevel: number; // Differential privacy noise (default: 0.1)
  retentionDays: number; // Data retention period (default: 90)
  anonymizationSalt: string; // Cryptographic salt for user ID hashing
}

export interface AnonymizedUserId {
  hash: string; // SHA-256 hash of user ID + salt
  cohortId: string; // Anonymous cohort identifier
  created: Date;
}

// ===== BUSINESS METRICS TYPES =====

export interface UserAcquisitionMetrics {
  date: string;
  newSignups: number;
  activatedUsers: number; // Completed onboarding
  conversionRate: number; // Activation rate
  acquisitionSources: Record<string, number>; // UTM sources
  cohortSize: number; // For k-anonymity validation
}

export interface EngagementMetrics {
  date: string;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: number; // In minutes
  avgJournalsPerUser: number;
  avgWordsPerJournal: number;
  retentionRates: {
    day1: number;
    day7: number;
    day30: number;
  };
  cohortSize: number;
}

export interface RevenueMetrics {
  date: string;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  churnRate: number;
  conversionFunnel: {
    freeTrialStarts: number;
    trialToDeepCut: number;
    deepCutToOracle: number;
    upgrades: number;
    downgrades: number;
  };
  cohortSize: number;
}

export interface CrisisInterventionMetrics {
  date: string;
  interventionsTriggered: number;
  interventionTypes: Record<string, number>;
  responseTimeSeconds: number; // Avg response time
  followUpEngagement: number;
  escalationRate: number;
  effectivenessScore: number; // Based on subsequent user engagement
  cohortSize: number;
}

// ===== USER JOURNEY ANALYTICS =====

export interface OnboardingFunnelMetrics {
  date: string;
  stepCompletionRates: {
    accountCreation: number;
    profileSetup: number;
    firstJournal: number;
    aiIntroduction: number;
    onboardingComplete: number;
  };
  dropOffPoints: Array<{
    step: string;
    dropOffRate: number;
    avgTimeSpent: number;
  }>;
  cohortSize: number;
}

export interface FeatureAdoptionMetrics {
  date: string;
  features: Record<string, {
    adoptionRate: number;
    dailyActiveUsers: number;
    engagementScore: number;
    retentionImpact: number;
  }>;
  cohortSize: number;
}

export interface UserSatisfactionMetrics {
  date: string;
  npsScore: number;
  satisfactionRating: number;
  feedbackCategories: Record<string, number>;
  featureRequestTrends: Array<{
    category: string;
    requests: number;
    priority: number;
  }>;
  cohortSize: number;
}

// ===== AGGREGATED PATTERN INSIGHTS =====

export interface HealingPatternInsights {
  date: string;
  commonJourneyPhases: Array<{
    phase: string;
    avgDuration: number;
    successFactors: string[];
    challengePoints: string[];
  }>;
  emotionalProgressionPatterns: Array<{
    pattern: string;
    frequency: number;
    outcomes: string[];
  }>;
  interventionEffectiveness: Record<string, {
    successRate: number;
    avgRecoveryTime: number;
    followUpEngagement: number;
  }>;
  cohortSize: number;
}

export interface PopulationHealthInsights {
  date: string;
  aggregatedTrends: {
    overallWellbeingTrend: number; // -1 to 1 scale
    stressLevelTrends: Record<string, number>;
    recoveryPatterns: Array<{
      type: string;
      effectiveness: number;
      adoption: number;
    }>;
  };
  demographicInsights: Record<string, {
    engagementRate: number;
    retentionRate: number;
    preferredFeatures: string[];
  }>;
  cohortSize: number;
}

// ===== A/B TESTING METRICS =====

export interface ABTestResult {
  testId: string;
  testName: string;
  startDate: string;
  endDate: string;
  variants: Array<{
    name: string;
    userCount: number;
    conversionRate: number;
    engagementMetrics: Record<string, number>;
    confidenceLevel: number;
  }>;
  winningVariant: string;
  statisticalSignificance: number;
  cohortSize: number;
}

// ===== REAL-TIME DASHBOARD TYPES =====

export interface DashboardMetrics {
  timestamp: Date;
  activeUsers: {
    current: number;
    peak24h: number;
    trend: number; // Percentage change
  };
  systemHealth: {
    uptime: number;
    errorRate: number;
    avgResponseTime: number;
    crisisSystemStatus: 'operational' | 'degraded' | 'down';
  };
  businessKPIs: {
    mrr: number;
    activeSubscriptions: number;
    churnRate: number;
    supportTicketCount: number;
  };
  privacyCompliance: {
    dataMinimizationScore: number;
    consentRate: number;
    deletionRequestsPending: number;
    auditStatus: 'compliant' | 'attention_needed';
  };
}

// ===== AUTOMATED REPORTING TYPES =====

export interface ReportSchedule {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  metrics: string[];
  format: 'json' | 'csv' | 'pdf';
  privacyLevel: 'aggregated' | 'anonymized' | 'admin';
  nextRun: Date;
  lastRun?: Date;
}

export interface GeneratedReport {
  id: string;
  scheduleId: string;
  generatedAt: Date;
  period: {
    start: string;
    end: string;
  };
  data: Record<string, any>;
  privacyValidation: {
    kAnonymityMet: boolean;
    noiseApplied: boolean;
    cohortSizeValid: boolean;
    personalDataExcluded: boolean;
  };
  downloadUrl?: string;
  expiresAt: Date;
}

// ===== PREDICTION MODELS =====

export interface ChurnPredictionModel {
  userId: string; // Anonymized hash
  riskScore: number; // 0-1 scale
  riskFactors: string[];
  interventionRecommendations: string[];
  confidenceLevel: number;
  lastUpdated: Date;
}

export interface RevenueForecasting {
  period: string;
  forecastedMRR: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  assumptions: string[];
  modelAccuracy: number;
  lastUpdated: Date;
}

// ===== EXPORT AND API TYPES =====

export interface AnalyticsQuery {
  metric: string;
  dateRange: {
    start: string;
    end: string;
  };
  aggregation: 'daily' | 'weekly' | 'monthly';
  filters?: Record<string, any>;
  privacyLevel: 'public' | 'aggregated' | 'admin';
}

export interface AnalyticsResponse<T = any> {
  data: T[];
  metadata: {
    totalRecords: number;
    privacyCompliant: boolean;
    kAnonymityLevel: number;
    aggregationLevel: string;
    generatedAt: Date;
  };
  warnings?: string[];
}

// ===== PRIVACY COMPLIANCE VALIDATION =====

export interface PrivacyValidationResult {
  isCompliant: boolean;
  violations: Array<{
    type: 'k_anonymity' | 'personal_data' | 'retention' | 'consent';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedRecords: number;
  }>;
  recommendations: string[];
  lastChecked: Date;
}

export interface DataMinimizationReport {
  collectionsAudited: number;
  personalDataFound: Array<{
    collection: string;
    field: string;
    recordCount: number;
    recommendation: string;
  }>;
  retentionViolations: Array<{
    collection: string;
    oldestRecord: Date;
    recordCount: number;
  }>;
  minimizationScore: number; // 0-100
  lastAudit: Date;
}

// ===== CRISIS SAFETY ANALYTICS =====

export interface CrisisSafetyMetrics {
  date: string;
  detectionAccuracy: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  avgResponseTime: number;
  interventionSuccess: number;
  followUpEngagement: number;
  systemAvailability: number;
  cohortSize: number;
}

export interface CrisisPatternAnalysis {
  commonTriggers: Array<{
    pattern: string;
    frequency: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  seasonalTrends: Record<string, number>;
  timeOfDayPatterns: Record<string, number>;
  interventionEffectiveness: Record<string, {
    successRate: number;
    userSatisfaction: number;
    longTermImpact: number;
  }>;
  cohortSize: number;
}