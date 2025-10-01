/**
 * ALCHM Business Metric Override System
 * 
 * MISSION CRITICAL: This system immediately suspends all business metrics, 
 * analytics, and performance tracking during crisis events to prioritize
 * user safety above all business objectives.
 * 
 * When activated, this system:
 * - Suspends all analytics collection
 * - Disables goal tracking and streaks
 * - Removes competitive elements
 * - Hides potentially shame-inducing metrics
 * - Prioritizes crisis support over business KPIs
 * 
 * Every function here prioritizes human life over business success.
 */

import { analytics } from '@/lib/analytics';
import { logger } from '@/lib/logging';
import { adminFirestore } from '@/lib/firebaseAdmin';

// Business metric categories that get suspended during crisis
export enum BusinessMetricCategory {
  ANALYTICS = 'analytics',
  GOALS = 'goals', 
  STREAKS = 'streaks',
  ACHIEVEMENTS = 'achievements',
  COMPARISONS = 'comparisons',
  PERFORMANCE_TRACKING = 'performance_tracking',
  ENGAGEMENT_METRICS = 'engagement_metrics',
  RETENTION_METRICS = 'retention_metrics',
  REVENUE_TRACKING = 'revenue_tracking'
}

// Crisis severity levels for metric suspension
export enum CrisisSeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Business metric suspension configuration
interface MetricSuspensionConfig {
  severity: CrisisSeverityLevel;
  suspendedCategories: BusinessMetricCategory[];
  gracePeriodMs: number;
  autoResumeEnabled: boolean;
  professionalReviewRequired: boolean;
}

// Suspension state tracking
interface SuspensionState {
  userId: string;
  severity: CrisisSeverityLevel;
  suspendedCategories: BusinessMetricCategory[];
  suspendedAt: number;
  gracePeriodEnds: number;
  canAutoResume: boolean;
  professionalReviewRequired: boolean;
  reason: string;
}

/**
 * Business Metric Override Controller
 * 
 * Centralized system for suspending business metrics during crisis events
 */
export class BusinessMetricOverrideController {
  private static instance: BusinessMetricOverrideController;
  private activeSuspensions: Map<string, SuspensionState> = new Map();
  private suspensionHistory: Map<string, SuspensionState[]> = new Map();
  
  // Suspension configurations by severity level
  private readonly suspensionConfigs: Record<CrisisSeverityLevel, MetricSuspensionConfig> = {
    [CrisisSeverityLevel.LOW]: {
      severity: CrisisSeverityLevel.LOW,
      suspendedCategories: [
        BusinessMetricCategory.COMPARISONS,
        BusinessMetricCategory.ENGAGEMENT_METRICS
      ],
      gracePeriodMs: 2 * 60 * 60 * 1000, // 2 hours
      autoResumeEnabled: true,
      professionalReviewRequired: false
    },
    [CrisisSeverityLevel.MEDIUM]: {
      severity: CrisisSeverityLevel.MEDIUM,
      suspendedCategories: [
        BusinessMetricCategory.ANALYTICS,
        BusinessMetricCategory.GOALS,
        BusinessMetricCategory.COMPARISONS,
        BusinessMetricCategory.PERFORMANCE_TRACKING,
        BusinessMetricCategory.ENGAGEMENT_METRICS
      ],
      gracePeriodMs: 6 * 60 * 60 * 1000, // 6 hours
      autoResumeEnabled: true,
      professionalReviewRequired: false
    },
    [CrisisSeverityLevel.HIGH]: {
      severity: CrisisSeverityLevel.HIGH,
      suspendedCategories: [
        BusinessMetricCategory.ANALYTICS,
        BusinessMetricCategory.GOALS,
        BusinessMetricCategory.STREAKS,
        BusinessMetricCategory.ACHIEVEMENTS,
        BusinessMetricCategory.COMPARISONS,
        BusinessMetricCategory.PERFORMANCE_TRACKING,
        BusinessMetricCategory.ENGAGEMENT_METRICS,
        BusinessMetricCategory.RETENTION_METRICS
      ],
      gracePeriodMs: 24 * 60 * 60 * 1000, // 24 hours
      autoResumeEnabled: false,
      professionalReviewRequired: true
    },
    [CrisisSeverityLevel.CRITICAL]: {
      severity: CrisisSeverityLevel.CRITICAL,
      suspendedCategories: Object.values(BusinessMetricCategory),
      gracePeriodMs: 72 * 60 * 60 * 1000, // 72 hours
      autoResumeEnabled: false,
      professionalReviewRequired: true
    }
  };

  private constructor() {
    this.initializeOverrideSystem();
  }

  static getInstance(): BusinessMetricOverrideController {
    if (!BusinessMetricOverrideController.instance) {
      BusinessMetricOverrideController.instance = new BusinessMetricOverrideController();
    }
    return BusinessMetricOverrideController.instance;
  }

  /**
   * IMMEDIATE: Suspend business metrics during crisis
   */
  async suspendBusinessMetrics(
    userId: string,
    severity: CrisisSeverityLevel,
    reason: string = 'crisis_safety_override'
  ): Promise<void> {
    const suspensionStartTime = Date.now();
    
    try {
      const config = this.suspensionConfigs[severity];
      const suspensionState: SuspensionState = {
        userId,
        severity,
        suspendedCategories: config.suspendedCategories,
        suspendedAt: suspensionStartTime,
        gracePeriodEnds: suspensionStartTime + config.gracePeriodMs,
        canAutoResume: config.autoResumeEnabled,
        professionalReviewRequired: config.professionalReviewRequired,
        reason
      };

      // Store active suspension
      this.activeSuspensions.set(userId, suspensionState);

      // Execute immediate suspensions
      await this.executeSuspensions(userId, config.suspendedCategories);

      // Log suspension for audit trail
      await this.logSuspension(suspensionState);

      // Add to user's suspension history
      const userHistory = this.suspensionHistory.get(userId) || [];
      userHistory.push(suspensionState);
      this.suspensionHistory.set(userId, userHistory);

      logger.info('Business metrics suspended for crisis safety', {
        userId,
        severity,
        suspendedCategories: config.suspendedCategories,
        gracePeriodHours: config.gracePeriodMs / (1000 * 60 * 60),
        professionalReviewRequired: config.professionalReviewRequired
      });

    } catch (error) {
      logger.error('Failed to suspend business metrics', error);
      
      // Emergency fallback - suspend everything
      await this.emergencyFullSuspension(userId, reason);
    }
  }

  /**
   * Execute specific metric category suspensions
   */
  private async executeSuspensions(
    userId: string, 
    categories: BusinessMetricCategory[]
  ): Promise<void> {
    const suspensionPromises = categories.map(category => 
      this.suspendMetricCategory(userId, category)
    );

    await Promise.allSettled(suspensionPromises);
  }

  /**
   * Suspend specific metric category
   */
  private async suspendMetricCategory(
    userId: string,
    category: BusinessMetricCategory
  ): Promise<void> {
    try {
      switch (category) {
        case BusinessMetricCategory.ANALYTICS:
          await this.suspendAnalytics(userId);
          break;
          
        case BusinessMetricCategory.GOALS:
          await this.suspendGoalTracking(userId);
          break;
          
        case BusinessMetricCategory.STREAKS:
          await this.suspendStreakTracking(userId);
          break;
          
        case BusinessMetricCategory.ACHIEVEMENTS:
          await this.suspendAchievements(userId);
          break;
          
        case BusinessMetricCategory.COMPARISONS:
          await this.suspendComparisons(userId);
          break;
          
        case BusinessMetricCategory.PERFORMANCE_TRACKING:
          await this.suspendPerformanceTracking(userId);
          break;
          
        case BusinessMetricCategory.ENGAGEMENT_METRICS:
          await this.suspendEngagementMetrics(userId);
          break;
          
        case BusinessMetricCategory.RETENTION_METRICS:
          await this.suspendRetentionMetrics(userId);
          break;
          
        case BusinessMetricCategory.REVENUE_TRACKING:
          await this.suspendRevenueTracking(userId);
          break;
      }
    } catch (error) {
      logger.error(`Failed to suspend ${category} for user ${userId}`, error);
    }
  }

  /**
   * Individual suspension implementations
   */
  private async suspendAnalytics(userId: string): Promise<void> {
    // Stop all analytics collection for user
    await analytics.suspendUserAnalytics(userId, {
      reason: 'crisis_safety_override',
      timestamp: Date.now()
    });
  }

  private async suspendGoalTracking(userId: string): Promise<void> {
    // Disable goal progress tracking and notifications
    await adminFirestore.collection('users').doc(userId).update({
      'preferences.goalTrackingEnabled': false,
      'preferences.goalNotificationsEnabled': false,
      'crisisOverride.goalsDisabled': true,
      'crisisOverride.goalsDisabledAt': Date.now()
    });
  }

  private async suspendStreakTracking(userId: string): Promise<void> {
    // Preserve streaks but hide from UI during crisis
    await adminFirestore.collection('users').doc(userId).update({
      'preferences.streakDisplayEnabled': false,
      'crisisOverride.streaksHidden': true,
      'crisisOverride.streaksHiddenAt': Date.now()
    });
  }

  private async suspendAchievements(userId: string): Promise<void> {
    // Hide achievements and disable new achievement notifications
    await adminFirestore.collection('users').doc(userId).update({
      'preferences.achievementsEnabled': false,
      'preferences.achievementNotificationsEnabled': false,
      'crisisOverride.achievementsDisabled': true,
      'crisisOverride.achievementsDisabledAt': Date.now()
    });
  }

  private async suspendComparisons(userId: string): Promise<void> {
    // Disable all comparative metrics and community comparisons
    await adminFirestore.collection('users').doc(userId).update({
      'preferences.communityComparisons': false,
      'preferences.benchmarkDisplayEnabled': false,
      'crisisOverride.comparisonsDisabled': true,
      'crisisOverride.comparisonsDisabledAt': Date.now()
    });
  }

  private async suspendPerformanceTracking(userId: string): Promise<void> {
    // Disable performance metrics that could cause stress
    await adminFirestore.collection('users').doc(userId).update({
      'preferences.performanceMetricsEnabled': false,
      'crisisOverride.performanceTrackingDisabled': true,
      'crisisOverride.performanceTrackingDisabledAt': Date.now()
    });
  }

  private async suspendEngagementMetrics(userId: string): Promise<void> {
    // Disable engagement tracking and time-based metrics
    await adminFirestore.collection('users').doc(userId).update({
      'preferences.engagementTrackingEnabled': false,
      'preferences.usageTimeTracking': false,
      'crisisOverride.engagementMetricsDisabled': true,
      'crisisOverride.engagementMetricsDisabledAt': Date.now()
    });
  }

  private async suspendRetentionMetrics(userId: string): Promise<void> {
    // Disable retention tracking and login streak pressure
    await adminFirestore.collection('users').doc(userId).update({
      'preferences.loginStreakTracking': false,
      'preferences.retentionMetricsEnabled': false,
      'crisisOverride.retentionMetricsDisabled': true,
      'crisisOverride.retentionMetricsDisabledAt': Date.now()
    });
  }

  private async suspendRevenueTracking(userId: string): Promise<void> {
    // Disable revenue-related tracking and upsell pressures
    await adminFirestore.collection('users').doc(userId).update({
      'preferences.upsellPrompts': false,
      'preferences.subscriptionReminders': false,
      'crisisOverride.revenueTrackingDisabled': true,
      'crisisOverride.revenueTrackingDisabledAt': Date.now()
    });
  }

  /**
   * Check if business metrics are suspended for user
   */
  isBusinessMetricsSuspended(userId: string, category?: BusinessMetricCategory): boolean {
    const suspension = this.activeSuspensions.get(userId);
    
    if (!suspension) {
      return false;
    }

    // Check if suspension is still active
    if (Date.now() > suspension.gracePeriodEnds && suspension.canAutoResume) {
      this.autoResumeSuspension(userId);
      return false;
    }

    if (category) {
      return suspension.suspendedCategories.includes(category);
    }

    return true;
  }

  /**
   * Get suspension state for user
   */
  getSuspensionState(userId: string): SuspensionState | null {
    return this.activeSuspensions.get(userId) || null;
  }

  /**
   * Auto-resume suspension after grace period
   */
  private async autoResumeSuspension(userId: string): Promise<void> {
    const suspension = this.activeSuspensions.get(userId);
    
    if (!suspension || !suspension.canAutoResume) {
      return;
    }

    try {
      await this.resumeBusinessMetrics(userId, 'auto_resume_after_grace_period');
    } catch (error) {
      logger.error('Failed to auto-resume business metrics', error);
    }
  }

  /**
   * Resume business metrics (manual or automatic)
   */
  async resumeBusinessMetrics(
    userId: string,
    reason: string = 'manual_resume',
    professionalAuthorization?: string
  ): Promise<void> {
    const suspension = this.activeSuspensions.get(userId);
    
    if (!suspension) {
      return;
    }

    // Check if professional review is required
    if (suspension.professionalReviewRequired && !professionalAuthorization) {
      logger.warn('Attempted to resume metrics without professional authorization', {
        userId,
        severity: suspension.severity
      });
      return;
    }

    try {
      // Resume all suspended categories
      await this.executeResumptions(userId, suspension.suspendedCategories);

      // Clear crisis overrides
      await adminFirestore.collection('users').doc(userId).update({
        'crisisOverride': null
      });

      // Remove active suspension
      this.activeSuspensions.delete(userId);

      // Log resumption
      await this.logResumption(userId, suspension, reason, professionalAuthorization);

      logger.info('Business metrics resumed', {
        userId,
        severity: suspension.severity,
        reason,
        professionalAuthorization: !!professionalAuthorization
      });

    } catch (error) {
      logger.error('Failed to resume business metrics', error);
    }
  }

  /**
   * Emergency full suspension fallback
   */
  private async emergencyFullSuspension(userId: string, reason: string): Promise<void> {
    try {
      // Suspend everything immediately
      await this.suspendBusinessMetrics(userId, CrisisSeverityLevel.CRITICAL, reason);
      
      logger.error('Emergency full suspension activated', {
        userId,
        reason,
        timestamp: Date.now()
      });
    } catch (error) {
      logger.error('Emergency full suspension failed', error);
    }
  }

  /**
   * Execute resumptions for specific categories
   */
  private async executeResumptions(
    userId: string,
    categories: BusinessMetricCategory[]
  ): Promise<void> {
    const resumptionPromises = categories.map(category =>
      this.resumeMetricCategory(userId, category)
    );

    await Promise.allSettled(resumptionPromises);
  }

  /**
   * Resume specific metric category
   */
  private async resumeMetricCategory(
    userId: string,
    category: BusinessMetricCategory
  ): Promise<void> {
    try {
      switch (category) {
        case BusinessMetricCategory.ANALYTICS:
          await analytics.resumeUserAnalytics(userId);
          break;
          
        case BusinessMetricCategory.GOALS:
          await adminFirestore.collection('users').doc(userId).update({
            'preferences.goalTrackingEnabled': true
          });
          break;
          
        case BusinessMetricCategory.STREAKS:
          await adminFirestore.collection('users').doc(userId).update({
            'preferences.streakDisplayEnabled': true
          });
          break;
          
        // Add other category resumptions as needed
      }
    } catch (error) {
      logger.error(`Failed to resume ${category} for user ${userId}`, error);
    }
  }

  /**
   * Logging and audit functions
   */
  private async logSuspension(suspension: SuspensionState): Promise<void> {
    try {
      await adminFirestore.collection('crisisMetricSuspensions').add({
        userId: suspension.userId,
        severity: suspension.severity,
        suspendedCategories: suspension.suspendedCategories,
        suspendedAt: suspension.suspendedAt,
        gracePeriodEnds: suspension.gracePeriodEnds,
        reason: suspension.reason,
        professionalReviewRequired: suspension.professionalReviewRequired
      });
    } catch (error) {
      logger.error('Failed to log metric suspension', error);
    }
  }

  private async logResumption(
    userId: string,
    suspension: SuspensionState,
    reason: string,
    professionalAuthorization?: string
  ): Promise<void> {
    try {
      await adminFirestore.collection('crisisMetricResumptions').add({
        userId,
        originalSeverity: suspension.severity,
        resumedAt: Date.now(),
        reason,
        professionalAuthorization,
        suspensionDurationMs: Date.now() - suspension.suspendedAt
      });
    } catch (error) {
      logger.error('Failed to log metric resumption', error);
    }
  }

  /**
   * System initialization
   */
  private initializeOverrideSystem(): void {
    // Set up periodic cleanup of expired suspensions
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        this.cleanupExpiredSuspensions();
      }, 60 * 60 * 1000); // Check every hour
    }
  }

  private cleanupExpiredSuspensions(): void {
    const now = Date.now();
    
    for (const [userId, suspension] of this.activeSuspensions.entries()) {
      if (now > suspension.gracePeriodEnds && suspension.canAutoResume) {
        this.autoResumeSuspension(userId);
      }
    }
  }

  /**
   * Public API methods
   */
  
  // Get all active suspensions (for admin dashboard)
  getActiveSuspensions(): Map<string, SuspensionState> {
    return new Map(this.activeSuspensions);
  }

  // Get suspension history for user
  getSuspensionHistory(userId: string): SuspensionState[] {
    return this.suspensionHistory.get(userId) || [];
  }

  // Health check
  healthCheck(): {
    status: 'healthy' | 'degraded' | 'critical';
    activeSuspensions: number;
    totalSuspensionsToday: number;
  } {
    const today = new Date().toDateString();
    let suspensionsToday = 0;
    
    for (const suspensions of this.suspensionHistory.values()) {
      suspensionsToday += suspensions.filter(s => 
        new Date(s.suspendedAt).toDateString() === today
      ).length;
    }

    return {
      status: suspensionsToday > 50 ? 'critical' : (suspensionsToday > 20 ? 'degraded' : 'healthy'),
      activeSuspensions: this.activeSuspensions.size,
      totalSuspensionsToday: suspensionsToday
    };
  }
}

// Export singleton instance
export const businessMetricOverride = BusinessMetricOverrideController.getInstance();

// Export types
export type { SuspensionState, MetricSuspensionConfig };