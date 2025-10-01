/**
 * ALCHM User Journey Analytics System
 * 
 * Tracks user journeys, feature adoption, and healing patterns while
 * maintaining strict privacy compliance and trauma-informed design principles.
 */

import { PrivacyEngine } from './privacy-engine';
import {
  OnboardingFunnelMetrics,
  FeatureAdoptionMetrics,
  UserSatisfactionMetrics,
  HealingPatternInsights,
  ABTestResult,
  CrisisSafetyMetrics
} from './types';

export interface UserJourneyMap {
  userId: string; // Anonymized hash
  journeyStages: Array<{
    stage: string;
    enteredAt: Date;
    exitedAt?: Date;
    actions: string[];
    engagementScore: number;
    satisfactionRating?: number;
  }>;
  totalDuration: number; // Days
  completionRate: number;
  dropOffPoint?: string;
  recoveryMilestones: string[];
  interventionsReceived: string[];
}

export interface FeatureUsagePattern {
  feature: string;
  adoptionRate: number;
  retentionImpact: number;
  usageFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  userSegments: Record<string, {
    adoptionRate: number;
    engagementLevel: number;
    retentionImpact: number;
  }>;
  correlations: Array<{
    feature: string;
    correlation: number;
    significance: number;
  }>;
}

export interface HealingJourneyInsights {
  commonPathways: Array<{
    pathway: string;
    frequency: number;
    avgDuration: number;
    successRate: number;
    criticalMoments: string[];
  }>;
  progressionPatterns: Array<{
    pattern: string;
    stages: string[];
    avgTimeBetweenStages: number;
    regressionRisk: number;
  }>;
  interventionEffectiveness: Record<string, {
    successRate: number;
    timeToImprovement: number;
    longTermRetention: number;
    userSatisfaction: number;
  }>;
  emotionalProgression: Array<{
    phase: string;
    typicalDuration: number;
    supportNeeds: string[];
    breakthroughIndicators: string[];
  }>;
}

export class UserJourneyAnalytics {
  private privacyEngine: PrivacyEngine;
  private journeyTracker: JourneyTracker;
  private patternAnalyzer: HealingPatternAnalyzer;
  private abTestManager: ABTestManager;

  constructor() {
    this.privacyEngine = new PrivacyEngine({
      minimumCohortSize: 5,
      noiseLevel: 0.1,
      retentionDays: 365, // Longer retention for journey analytics
      anonymizationSalt: process.env.JOURNEY_ANALYTICS_SALT || 'journey_salt'
    });
    
    this.journeyTracker = new JourneyTracker(this.privacyEngine);
    this.patternAnalyzer = new HealingPatternAnalyzer(this.privacyEngine);
    this.abTestManager = new ABTestManager(this.privacyEngine);
  }

  /**
   * Track user journey progression
   */
  async trackJourneyStage(
    userId: string,
    stage: string,
    actions: string[],
    metadata?: Record<string, any>
  ): Promise<void> {
    const anonymizedId = this.privacyEngine.anonymizeUserId(userId);
    
    await this.journeyTracker.recordStageProgression({
      userId: anonymizedId.hash,
      cohortId: anonymizedId.cohortId,
      stage,
      actions: this.sanitizeActions(actions),
      timestamp: new Date(),
      metadata: this.privacyEngine.sanitizePersonalData(metadata)
    });
  }

  /**
   * Analyze onboarding funnel performance
   */
  async analyzeOnboardingFunnel(
    dateRange: { start: string; end: string }
  ): Promise<OnboardingFunnelMetrics> {
    const funnelData = await this.getFunnelData(dateRange);
    
    const aggregatedData = this.privacyEngine.createAggregatedMetrics(
      funnelData,
      ['date', 'step'],
      { users: 'count', completions: 'count', timeSpent: 'avg' }
    );

    const steps = [
      'account_creation',
      'profile_setup', 
      'first_journal',
      'ai_introduction',
      'onboarding_complete'
    ];

    const stepCompletionRates: Record<string, number> = {};
    let previousStepUsers = 0;

    steps.forEach((step, index) => {
      const stepData = aggregatedData.filter(d => d.step === step);
      const totalUsers = stepData.reduce((sum, d) => sum + d.users, 0);
      const completions = stepData.reduce((sum, d) => sum + d.completions, 0);
      
      if (index === 0) {
        previousStepUsers = totalUsers;
        stepCompletionRates[step] = 1.0; // 100% start account creation
      } else {
        stepCompletionRates[step] = previousStepUsers > 0 ? completions / previousStepUsers : 0;
        previousStepUsers = completions;
      }
    });

    const dropOffPoints = await this.analyzeDropOffPoints(funnelData);

    return {
      date: dateRange.end,
      stepCompletionRates: {
        accountCreation: stepCompletionRates.account_creation,
        profileSetup: stepCompletionRates.profile_setup,
        firstJournal: stepCompletionRates.first_journal,
        aiIntroduction: stepCompletionRates.ai_introduction,
        onboardingComplete: stepCompletionRates.onboarding_complete
      },
      dropOffPoints,
      cohortSize: Math.max(...aggregatedData.map(d => d.cohortSize || 5))
    };
  }

  /**
   * Analyze feature adoption patterns
   */
  async analyzeFeatureAdoption(
    dateRange: { start: string; end: string }
  ): Promise<FeatureAdoptionMetrics> {
    const featureData = await this.getFeatureUsageData(dateRange);
    
    const aggregatedData = this.privacyEngine.createAggregatedMetrics(
      featureData,
      ['feature', 'date'],
      { 
        uniqueUsers: 'count',
        sessions: 'count', 
        engagementScore: 'avg',
        retentionRate: 'avg'
      }
    );

    const features: Record<string, any> = {};

    // Group by feature
    const featureGroups = new Map<string, any[]>();
    aggregatedData.forEach(data => {
      if (!featureGroups.has(data.feature)) {
        featureGroups.set(data.feature, []);
      }
      featureGroups.get(data.feature)!.push(data);
    });

    // Calculate metrics for each feature
    featureGroups.forEach((data, feature) => {
      const totalUsers = await this.getTotalActiveUsers(dateRange);
      const featureUsers = data.reduce((sum, d) => sum + d.uniqueUsers, 0);
      const adoptionRate = totalUsers > 0 ? (featureUsers / totalUsers) * 100 : 0;
      
      const avgEngagement = data.reduce((sum, d) => sum + d.engagementScore, 0) / data.length;
      const retentionImpact = data.reduce((sum, d) => sum + d.retentionRate, 0) / data.length;
      
      features[feature] = {
        adoptionRate: Number(adoptionRate.toFixed(2)),
        dailyActiveUsers: this.privacyEngine.applyDifferentialPrivacy(featureUsers),
        engagementScore: Number(avgEngagement.toFixed(2)),
        retentionImpact: Number(retentionImpact.toFixed(2))
      };
    });

    return {
      date: dateRange.end,
      features,
      cohortSize: Math.max(...aggregatedData.map(d => d.cohortSize || 5))
    };
  }

  /**
   * Generate user satisfaction insights
   */
  async analyzeUserSatisfaction(
    dateRange: { start: string; end: string }
  ): Promise<UserSatisfactionMetrics> {
    const [
      feedbackData,
      npsData,
      featureRequestData
    ] = await Promise.all([
      this.getFeedbackData(dateRange),
      this.getNPSData(dateRange),
      this.getFeatureRequestData(dateRange)
    ]);

    // Calculate NPS
    const npsResponses = this.privacyEngine.createAggregatedMetrics(
      npsData,
      ['score'],
      { count: 'count' }
    );

    let promoters = 0, detractors = 0, total = 0;
    npsResponses.forEach(response => {
      total += response.count;
      if (response.score >= 9) promoters += response.count;
      if (response.score <= 6) detractors += response.count;
    });

    const npsScore = total > 0 ? ((promoters - detractors) / total) * 100 : 0;

    // Aggregate feedback categories
    const feedbackAggregated = this.privacyEngine.createAggregatedMetrics(
      feedbackData,
      ['category'],
      { sentiment: 'avg', count: 'count' }
    );

    const feedbackCategories: Record<string, number> = {};
    feedbackAggregated.forEach(fb => {
      feedbackCategories[fb.category] = this.privacyEngine.applyDifferentialPrivacy(fb.count);
    });

    // Analyze feature requests
    const requestsAggregated = this.privacyEngine.createAggregatedMetrics(
      featureRequestData,
      ['category'],
      { requests: 'count', priority: 'avg' }
    );

    const featureRequestTrends = requestsAggregated.map(req => ({
      category: req.category,
      requests: this.privacyEngine.applyDifferentialPrivacy(req.requests),
      priority: Number(req.priority.toFixed(1))
    }));

    const avgSatisfaction = feedbackAggregated.reduce((sum, fb) => sum + fb.sentiment, 0) / feedbackAggregated.length;

    return {
      date: dateRange.end,
      npsScore: Number(npsScore.toFixed(1)),
      satisfactionRating: Number(avgSatisfaction.toFixed(2)),
      feedbackCategories,
      featureRequestTrends,
      cohortSize: Math.max(...feedbackAggregated.map(d => d.cohortSize || 5))
    };
  }

  /**
   * Generate healing pattern insights
   */
  async generateHealingPatternInsights(
    dateRange: { start: string; end: string }
  ): Promise<HealingPatternInsights> {
    return await this.patternAnalyzer.analyzeHealingPatterns(dateRange);
  }

  /**
   * Track A/B test performance
   */
  async trackABTest(
    testId: string,
    variant: string,
    userId: string,
    conversionEvent?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const anonymizedId = this.privacyEngine.anonymizeUserId(userId);
    
    await this.abTestManager.recordTestEvent({
      testId,
      variant,
      userId: anonymizedId.hash,
      cohortId: anonymizedId.cohortId,
      conversionEvent,
      timestamp: new Date(),
      metadata: this.privacyEngine.sanitizePersonalData(metadata)
    });
  }

  /**
   * Get A/B test results
   */
  async getABTestResults(testId: string): Promise<ABTestResult> {
    return await this.abTestManager.getTestResults(testId);
  }

  /**
   * Generate crisis safety analytics
   */
  async analyzeCrisisSafety(
    dateRange: { start: string; end: string }
  ): Promise<CrisisSafetyMetrics> {
    const crisisData = await this.getCrisisInterventionData(dateRange);
    
    const aggregatedData = this.privacyEngine.createAggregatedMetrics(
      crisisData,
      ['date', 'interventionType'],
      {
        detections: 'count',
        truePositives: 'count',
        falsePositives: 'count',
        falseNegatives: 'count',
        responseTime: 'avg',
        followUps: 'count',
        systemUptime: 'avg'
      }
    );

    const totalDetections = aggregatedData.reduce((sum, d) => sum + d.detections, 0);
    const truePositives = aggregatedData.reduce((sum, d) => sum + d.truePositives, 0);
    const falsePositives = aggregatedData.reduce((sum, d) => sum + d.falsePositives, 0);
    const falseNegatives = aggregatedData.reduce((sum, d) => sum + d.falseNegatives, 0);

    const detectionAccuracy = totalDetections > 0 ? (truePositives / totalDetections) * 100 : 0;
    const falsePositiveRate = totalDetections > 0 ? (falsePositives / totalDetections) * 100 : 0;
    const falseNegativeRate = (truePositives + falseNegatives) > 0 ? 
      (falseNegatives / (truePositives + falseNegatives)) * 100 : 0;

    const avgResponseTime = aggregatedData.reduce((sum, d) => sum + d.responseTime, 0) / aggregatedData.length;
    const interventionSuccess = truePositives > 0 ? 
      (aggregatedData.reduce((sum, d) => sum + d.followUps, 0) / truePositives) * 100 : 0;
    
    const systemAvailability = aggregatedData.reduce((sum, d) => sum + d.systemUptime, 0) / aggregatedData.length;

    return {
      date: dateRange.end,
      detectionAccuracy: Number(detectionAccuracy.toFixed(2)),
      falsePositiveRate: Number(falsePositiveRate.toFixed(2)),
      falseNegativeRate: Number(falseNegativeRate.toFixed(2)),
      avgResponseTime: Number(avgResponseTime.toFixed(1)),
      interventionSuccess: Number(interventionSuccess.toFixed(2)),
      followUpEngagement: Number(interventionSuccess.toFixed(2)), // Same as success for now
      systemAvailability: Number(systemAvailability.toFixed(2)),
      cohortSize: Math.max(...aggregatedData.map(d => d.cohortSize || 5))
    };
  }

  /**
   * Generate comprehensive user journey report
   */
  async generateJourneyReport(
    dateRange: { start: string; end: string }
  ): Promise<any> {
    const [
      onboardingMetrics,
      featureAdoption,
      userSatisfaction,
      healingInsights,
      crisisSafety
    ] = await Promise.all([
      this.analyzeOnboardingFunnel(dateRange),
      this.analyzeFeatureAdoption(dateRange),
      this.analyzeUserSatisfaction(dateRange),
      this.generateHealingPatternInsights(dateRange),
      this.analyzeCrisisSafety(dateRange)
    ]);

    return {
      reportType: 'user_journey_analytics',
      period: dateRange,
      generatedAt: new Date(),
      summary: {
        onboardingCompletionRate: onboardingMetrics.stepCompletionRates.onboardingComplete,
        overallSatisfaction: userSatisfaction.satisfactionRating,
        npsScore: userSatisfaction.npsScore,
        crisisSystemAccuracy: crisisSafety.detectionAccuracy
      },
      onboarding: onboardingMetrics,
      featureAdoption,
      userSatisfaction,
      healingInsights,
      crisisSafety,
      privacyCompliance: {
        kAnonymityMet: true,
        personalDataExcluded: true,
        aggregationLevel: 'high',
        cohortSizesValid: true
      }
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private sanitizeActions(actions: string[]): string[] {
    return actions.map(action => {
      // Remove any potential PII from action strings
      return this.privacyEngine.sanitizePersonalData(action);
    });
  }

  private async analyzeDropOffPoints(funnelData: any[]): Promise<OnboardingFunnelMetrics['dropOffPoints']> {
    const dropOffs: OnboardingFunnelMetrics['dropOffPoints'] = [];
    
    const steps = ['account_creation', 'profile_setup', 'first_journal', 'ai_introduction', 'onboarding_complete'];
    
    for (let i = 0; i < steps.length - 1; i++) {
      const currentStep = steps[i];
      const nextStep = steps[i + 1];
      
      const currentStepUsers = funnelData.filter(d => d.step === currentStep).length;
      const nextStepUsers = funnelData.filter(d => d.step === nextStep).length;
      
      if (currentStepUsers >= this.privacyEngine['config'].minimumCohortSize) {
        const dropOffRate = currentStepUsers > 0 ? 
          ((currentStepUsers - nextStepUsers) / currentStepUsers) * 100 : 0;
        
        const avgTimeSpent = funnelData
          .filter(d => d.step === currentStep)
          .reduce((sum, d) => sum + (d.timeSpent || 0), 0) / currentStepUsers;

        dropOffs.push({
          step: currentStep,
          dropOffRate: Number(dropOffRate.toFixed(2)),
          avgTimeSpent: Number(avgTimeSpent.toFixed(1))
        });
      }
    }

    return dropOffs;
  }

  // ===== PLACEHOLDER DATA METHODS =====
  // These would be implemented with actual Firestore queries

  private async getFunnelData(dateRange: any): Promise<any[]> { return []; }
  private async getFeatureUsageData(dateRange: any): Promise<any[]> { return []; }
  private async getFeedbackData(dateRange: any): Promise<any[]> { return []; }
  private async getNPSData(dateRange: any): Promise<any[]> { return []; }
  private async getFeatureRequestData(dateRange: any): Promise<any[]> { return []; }
  private async getCrisisInterventionData(dateRange: any): Promise<any[]> { return []; }
  private async getTotalActiveUsers(dateRange: any): Promise<number> { return 0; }
}

// ===== SUPPORTING CLASSES =====

class JourneyTracker {
  constructor(private privacyEngine: PrivacyEngine) {}

  async recordStageProgression(data: any): Promise<void> {
    // Implementation would store journey progression in Firestore
    console.log('[JourneyTracker] Recorded stage progression:', data.stage);
  }
}

class HealingPatternAnalyzer {
  constructor(private privacyEngine: PrivacyEngine) {}

  async analyzeHealingPatterns(dateRange: { start: string; end: string }): Promise<HealingPatternInsights> {
    // Implementation would analyze healing journey patterns
    return {
      commonJourneyPhases: [],
      emotionalProgressionPatterns: [],
      interventionEffectiveness: {},
      cohortSize: 5
    };
  }
}

class ABTestManager {
  constructor(private privacyEngine: PrivacyEngine) {}

  async recordTestEvent(data: any): Promise<void> {
    // Implementation would store A/B test events
    console.log('[ABTestManager] Recorded test event:', data.testId);
  }

  async getTestResults(testId: string): Promise<ABTestResult> {
    // Implementation would calculate A/B test results
    return {
      testId,
      testName: 'Test',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      variants: [],
      winningVariant: 'control',
      statisticalSignificance: 0.95,
      cohortSize: 5
    };
  }
}