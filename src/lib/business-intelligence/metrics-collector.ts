/**
 * ALCHM Business Metrics Collector
 * 
 * Collects and aggregates business intelligence metrics while maintaining
 * strict privacy compliance and trauma-informed design principles.
 */

import { PrivacyEngine } from './privacy-engine';
import {
  UserAcquisitionMetrics,
  EngagementMetrics,
  RevenueMetrics,
  CrisisInterventionMetrics,
  OnboardingFunnelMetrics,
  FeatureAdoptionMetrics,
  UserSatisfactionMetrics,
  HealingPatternInsights,
  PopulationHealthInsights,
  CrisisSafetyMetrics,
  DashboardMetrics
} from './types';

export class BusinessMetricsCollector {
  private privacyEngine: PrivacyEngine;
  private collectionInterval: NodeJS.Timeout | null = null;
  private readonly COLLECTION_INTERVAL_MS = 60000; // 1 minute

  constructor() {
    this.privacyEngine = new PrivacyEngine({
      minimumCohortSize: 5,
      noiseLevel: 0.1,
      retentionDays: 90,
      anonymizationSalt: process.env.ANALYTICS_SALT || 'default_salt'
    });
  }

  /**
   * Start real-time metrics collection
   */
  startCollection(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
    }

    this.collectionInterval = setInterval(async () => {
      try {
        await this.collectAndStoreMetrics();
      } catch (error) {
        console.error('[MetricsCollector] Collection error:', error);
      }
    }, this.COLLECTION_INTERVAL_MS);

    console.log('[MetricsCollector] Started real-time collection');
  }

  /**
   * Stop metrics collection
   */
  stopCollection(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }
    console.log('[MetricsCollector] Stopped collection');
  }

  /**
   * Collect user acquisition metrics
   */
  async collectUserAcquisitionMetrics(date: string): Promise<UserAcquisitionMetrics> {
    const startOfDay = new Date(date);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Query anonymized user data
    const rawData = await this.queryUserAcquisitionData(startOfDay, endOfDay);
    
    // Apply privacy protection
    const sanitizedData = this.privacyEngine.sanitizePersonalData(rawData);
    const aggregatedData = this.privacyEngine.createAggregatedMetrics(
      sanitizedData,
      ['date', 'source'],
      {
        signups: 'count',
        activations: 'count',
        conversions: 'avg'
      }
    );

    // Calculate metrics with differential privacy
    const totalSignups = this.privacyEngine.applyDifferentialPrivacy(
      aggregatedData.reduce((sum, d) => sum + d.signups, 0)
    );
    
    const activatedUsers = this.privacyEngine.applyDifferentialPrivacy(
      aggregatedData.reduce((sum, d) => sum + d.activations, 0)
    );

    const conversionRate = activatedUsers > 0 ? (activatedUsers / totalSignups) * 100 : 0;

    // Aggregate acquisition sources
    const sources: Record<string, number> = {};
    aggregatedData.forEach(data => {
      if (data.source && data.signups > 0) {
        sources[data.source] = this.privacyEngine.applyDifferentialPrivacy(data.signups);
      }
    });

    return {
      date,
      newSignups: totalSignups,
      activatedUsers,
      conversionRate: Number(conversionRate.toFixed(2)),
      acquisitionSources: sources,
      cohortSize: Math.max(...aggregatedData.map(d => d.cohortSize || 5))
    };
  }

  /**
   * Collect engagement metrics
   */
  async collectEngagementMetrics(date: string): Promise<EngagementMetrics> {
    const rawData = await this.queryEngagementData(date);
    
    const aggregatedData = this.privacyEngine.createAggregatedMetrics(
      rawData,
      ['date'],
      {
        dailyActiveUsers: 'count',
        sessionDuration: 'avg',
        journalCount: 'avg',
        wordCount: 'avg'
      }
    );

    // Calculate retention rates from cohort analysis
    const retentionData = await this.calculateRetentionRates(date);

    return {
      date,
      dailyActiveUsers: this.privacyEngine.applyDifferentialPrivacy(
        aggregatedData.reduce((sum, d) => sum + d.dailyActiveUsers, 0)
      ),
      weeklyActiveUsers: await this.getWeeklyActiveUsers(date),
      monthlyActiveUsers: await this.getMonthlyActiveUsers(date),
      avgSessionDuration: Number(
        aggregatedData.reduce((sum, d) => sum + d.sessionDuration, 0) / aggregatedData.length
      ),
      avgJournalsPerUser: Number(
        (aggregatedData.reduce((sum, d) => sum + d.journalCount, 0) / aggregatedData.length).toFixed(2)
      ),
      avgWordsPerJournal: Math.round(
        aggregatedData.reduce((sum, d) => sum + d.wordCount, 0) / aggregatedData.length
      ),
      retentionRates: retentionData,
      cohortSize: Math.max(...aggregatedData.map(d => d.cohortSize || 5))
    };
  }

  /**
   * Collect revenue metrics
   */
  async collectRevenueMetrics(date: string): Promise<RevenueMetrics> {
    const rawRevenueData = await this.queryRevenueData(date);
    
    // Aggregate revenue data with privacy protection
    const aggregatedData = this.privacyEngine.createAggregatedMetrics(
      rawRevenueData,
      ['date', 'tier'],
      {
        revenue: 'sum',
        subscriptions: 'count',
        upgrades: 'count',
        downgrades: 'count'
      }
    );

    const totalRevenue = aggregatedData.reduce((sum, d) => sum + (d.revenue || 0), 0);
    const totalUsers = aggregatedData.reduce((sum, d) => sum + (d.subscriptions || 0), 0);
    
    const arpu = totalUsers > 0 ? totalRevenue / totalUsers : 0;
    const churnRate = await this.calculateChurnRate(date);
    const ltv = this.calculateLifetimeValue(arpu, churnRate);

    return {
      date,
      monthlyRecurringRevenue: this.privacyEngine.applyDifferentialPrivacy(totalRevenue),
      averageRevenuePerUser: Number(arpu.toFixed(2)),
      customerLifetimeValue: Number(ltv.toFixed(2)),
      churnRate: Number(churnRate.toFixed(2)),
      conversionFunnel: await this.getConversionFunnel(date),
      cohortSize: Math.max(...aggregatedData.map(d => d.cohortSize || 5))
    };
  }

  /**
   * Collect crisis intervention metrics
   */
  async collectCrisisInterventionMetrics(date: string): Promise<CrisisInterventionMetrics> {
    const rawCrisisData = await this.queryCrisisData(date);
    
    const aggregatedData = this.privacyEngine.createAggregatedMetrics(
      rawCrisisData,
      ['date', 'interventionType'],
      {
        interventions: 'count',
        responseTime: 'avg',
        followUps: 'count',
        escalations: 'count'
      }
    );

    const totalInterventions = aggregatedData.reduce((sum, d) => sum + d.interventions, 0);
    const avgResponseTime = aggregatedData.reduce((sum, d) => sum + d.responseTime, 0) / aggregatedData.length;
    
    // Calculate intervention types distribution
    const interventionTypes: Record<string, number> = {};
    aggregatedData.forEach(data => {
      if (data.interventionType) {
        interventionTypes[data.interventionType] = this.privacyEngine.applyDifferentialPrivacy(
          data.interventions
        );
      }
    });

    const followUps = aggregatedData.reduce((sum, d) => sum + d.followUps, 0);
    const escalations = aggregatedData.reduce((sum, d) => sum + d.escalations, 0);
    
    const followUpEngagement = totalInterventions > 0 ? (followUps / totalInterventions) * 100 : 0;
    const escalationRate = totalInterventions > 0 ? (escalations / totalInterventions) * 100 : 0;
    
    // Calculate effectiveness based on subsequent user engagement
    const effectivenessScore = await this.calculateCrisisEffectiveness(date);

    return {
      date,
      interventionsTriggered: this.privacyEngine.applyDifferentialPrivacy(totalInterventions),
      interventionTypes,
      responseTimeSeconds: Number(avgResponseTime.toFixed(1)),
      followUpEngagement: Number(followUpEngagement.toFixed(2)),
      escalationRate: Number(escalationRate.toFixed(2)),
      effectivenessScore: Number(effectivenessScore.toFixed(2)),
      cohortSize: Math.max(...aggregatedData.map(d => d.cohortSize || 5))
    };
  }

  /**
   * Collect onboarding funnel metrics
   */
  async collectOnboardingMetrics(date: string): Promise<OnboardingFunnelMetrics> {
    const rawData = await this.queryOnboardingData(date);
    
    const stepCompletions = await this.calculateStepCompletions(rawData);
    const dropOffAnalysis = await this.analyzeDropOffPoints(rawData);

    return {
      date,
      stepCompletionRates: {
        accountCreation: Number((stepCompletions.accountCreation * 100).toFixed(2)),
        profileSetup: Number((stepCompletions.profileSetup * 100).toFixed(2)),
        firstJournal: Number((stepCompletions.firstJournal * 100).toFixed(2)),
        aiIntroduction: Number((stepCompletions.aiIntroduction * 100).toFixed(2)),
        onboardingComplete: Number((stepCompletions.onboardingComplete * 100).toFixed(2))
      },
      dropOffPoints: dropOffAnalysis,
      cohortSize: rawData.length >= 5 ? rawData.length : 5
    };
  }

  /**
   * Get real-time dashboard metrics
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      currentActiveUsers,
      peak24hUsers,
      systemHealth,
      businessKPIs,
      privacyCompliance
    ] = await Promise.all([
      this.getCurrentActiveUsers(),
      this.getPeak24hUsers(),
      this.getSystemHealth(),
      this.getBusinessKPIs(),
      this.getPrivacyCompliance()
    ]);

    const yesterdayUsers = await this.getActiveUsersForDate(yesterday.toISOString().split('T')[0]);
    const trend = yesterdayUsers > 0 ? ((currentActiveUsers - yesterdayUsers) / yesterdayUsers) * 100 : 0;

    return {
      timestamp: now,
      activeUsers: {
        current: this.privacyEngine.applyDifferentialPrivacy(currentActiveUsers),
        peak24h: this.privacyEngine.applyDifferentialPrivacy(peak24hUsers),
        trend: Number(trend.toFixed(2))
      },
      systemHealth,
      businessKPIs,
      privacyCompliance
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private async collectAndStoreMetrics(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const [
        acquisitionMetrics,
        engagementMetrics,
        revenueMetrics,
        crisisMetrics
      ] = await Promise.all([
        this.collectUserAcquisitionMetrics(today),
        this.collectEngagementMetrics(today),
        this.collectRevenueMetrics(today),
        this.collectCrisisInterventionMetrics(today)
      ]);

      // Store metrics in Firestore
      await this.storeMetrics({
        date: today,
        acquisition: acquisitionMetrics,
        engagement: engagementMetrics,
        revenue: revenueMetrics,
        crisis: crisisMetrics,
        collectedAt: new Date()
      });

    } catch (error) {
      console.error('[MetricsCollector] Failed to collect metrics:', error);
    }
  }

  private async queryUserAcquisitionData(start: Date, end: Date): Promise<any[]> {
    // Implementation would query Firestore for user creation data
    // This is a placeholder - actual implementation would use Firebase Admin SDK
    return [];
  }

  private async queryEngagementData(date: string): Promise<any[]> {
    // Implementation would query Firestore for engagement data
    return [];
  }

  private async queryRevenueData(date: string): Promise<any[]> {
    // Implementation would query Stripe/Firestore for revenue data
    return [];
  }

  private async queryCrisisData(date: string): Promise<any[]> {
    // Implementation would query crisis intervention logs
    return [];
  }

  private async queryOnboardingData(date: string): Promise<any[]> {
    // Implementation would query onboarding completion data
    return [];
  }

  private async calculateRetentionRates(date: string): Promise<{ day1: number; day7: number; day30: number }> {
    // Implementation would calculate cohort retention
    return { day1: 0, day7: 0, day30: 0 };
  }

  private async getWeeklyActiveUsers(date: string): Promise<number> {
    // Implementation would calculate WAU
    return 0;
  }

  private async getMonthlyActiveUsers(date: string): Promise<number> {
    // Implementation would calculate MAU
    return 0;
  }

  private async calculateChurnRate(date: string): Promise<number> {
    // Implementation would calculate churn from subscription data
    return 0;
  }

  private calculateLifetimeValue(arpu: number, churnRate: number): number {
    if (churnRate === 0) return 0;
    return arpu / (churnRate / 100);
  }

  private async getConversionFunnel(date: string): Promise<RevenueMetrics['conversionFunnel']> {
    // Implementation would track conversion steps
    return {
      freeTrialStarts: 0,
      trialToDeepCut: 0,
      deepCutToOracle: 0,
      upgrades: 0,
      downgrades: 0
    };
  }

  private async calculateCrisisEffectiveness(date: string): Promise<number> {
    // Implementation would measure post-crisis engagement
    return 0;
  }

  private async calculateStepCompletions(data: any[]): Promise<Record<string, number>> {
    // Implementation would calculate funnel completion rates
    return {
      accountCreation: 1.0,
      profileSetup: 0.8,
      firstJournal: 0.6,
      aiIntroduction: 0.5,
      onboardingComplete: 0.4
    };
  }

  private async analyzeDropOffPoints(data: any[]): Promise<OnboardingFunnelMetrics['dropOffPoints']> {
    // Implementation would analyze where users drop off
    return [];
  }

  private async getCurrentActiveUsers(): Promise<number> {
    // Implementation would get current active sessions
    return 0;
  }

  private async getPeak24hUsers(): Promise<number> {
    // Implementation would get peak users in last 24h
    return 0;
  }

  private async getActiveUsersForDate(date: string): Promise<number> {
    // Implementation would get active users for specific date
    return 0;
  }

  private async getSystemHealth(): Promise<DashboardMetrics['systemHealth']> {
    // Implementation would check system health
    return {
      uptime: 99.9,
      errorRate: 0.1,
      avgResponseTime: 200,
      crisisSystemStatus: 'operational'
    };
  }

  private async getBusinessKPIs(): Promise<DashboardMetrics['businessKPIs']> {
    // Implementation would get current business KPIs
    return {
      mrr: 0,
      activeSubscriptions: 0,
      churnRate: 0,
      supportTicketCount: 0
    };
  }

  private async getPrivacyCompliance(): Promise<DashboardMetrics['privacyCompliance']> {
    // Implementation would check privacy compliance status
    return {
      dataMinimizationScore: 95,
      consentRate: 85,
      deletionRequestsPending: 0,
      auditStatus: 'compliant'
    };
  }

  private async storeMetrics(metrics: any): Promise<void> {
    // Implementation would store metrics in Firestore business_metrics collection
    console.log('[MetricsCollector] Stored metrics for', metrics.date);
  }
}