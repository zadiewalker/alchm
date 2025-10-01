/**
 * Healthy Usage Monitor for ALCHM
 * 
 * Promotes healthy boundaries and prevents harmful usage patterns
 * Focuses on user wellbeing over platform engagement metrics
 * Implements gentle interventions that respect user autonomy
 */

import { Timestamp } from 'firebase/firestore';
import { SessionMetrics, PrivacyPreservingUserProfile } from './privacy-preserving-analytics';
import { MeaningfulEngagementIndicators } from './session-depth-analyzer';
import { AdaptiveProfile } from './adaptive-engagement-profiler';

export interface HealthyUsageBoundaries {
  // Time-based boundaries
  maxDailyMinutes: number;
  maxWeeklyHours: number;
  recommendedBreakIntervals: number; // Minutes between sessions
  
  // Emotional regulation boundaries
  emotionalIntensityThreshold: number; // 0-1, when to suggest breaks
  overwhelmPreventionLevel: 'low' | 'medium' | 'high';
  
  // Dependency prevention
  maxConsecutiveDays: number; // Before suggesting a rest day
  healthySkipDayFrequency: number; // Days per week where skipping is healthy
  
  // Crisis prevention
  crisisDetectionSensitivity: 'low' | 'medium' | 'high';
  professionalSupportThreshold: number; // Number of concerning sessions
}

export interface UsagePattern {
  period: 'daily' | 'weekly' | 'monthly';
  timestamp: Timestamp;
  
  // Engagement metrics
  totalMinutes: number;
  sessionCount: number;
  averageSessionLength: number;
  consecutiveDays: number;
  skipDays: number;
  
  // Health indicators
  emotionalOverloadRisk: 'low' | 'medium' | 'high' | 'critical';
  dependencyRisk: 'low' | 'medium' | 'high';
  burnoutRisk: 'low' | 'medium' | 'high';
  
  // Positive patterns
  healthyPacing: boolean;
  selfRegulation: boolean; // User naturally takes breaks
  balancedEngagement: boolean; // Not too much, not too little
}

export interface HealthyBoundaryIntervention {
  type: 'gentle_reminder' | 'break_suggestion' | 'pacing_guidance' | 'professional_support' | 'celebration';
  severity: 'info' | 'suggestion' | 'recommendation' | 'urgent';
  title: string;
  message: string;
  actions: {
    primary: string;
    secondary?: string;
    dismissible: boolean;
  };
  
  // User empowerment
  reasoning: string; // Why this intervention is helpful
  userControl: {
    canSnooze: boolean;
    snoozeOptions: number[]; // Hours to snooze
    canDisable: boolean;
    disableScope: 'session' | 'day' | 'week' | 'permanent';
  };
  
  // Timing
  showAfterDelay: number; // Seconds to wait before showing
  showOnlyOnce: boolean;
  expireAfter?: number; // Seconds until intervention expires
}

export interface WellbeingInsight {
  insight: string;
  evidence: string[];
  supportive: boolean; // Builds user up vs. concerns them
  actionable: boolean; // User can act on this insight
  empowering: boolean; // Increases user's sense of agency
}

export class HealthyUsageMonitor {
  private static readonly DEFAULT_BOUNDARIES: HealthyUsageBoundaries = {
    maxDailyMinutes: 90, // 1.5 hours max per day
    maxWeeklyHours: 8, // About 1 hour per day average
    recommendedBreakIntervals: 120, // 2 hours between sessions
    emotionalIntensityThreshold: 0.8,
    overwhelmPreventionLevel: 'medium',
    maxConsecutiveDays: 7, // Suggest rest day after week
    healthySkipDayFrequency: 2, // 2 days per week where not journaling is healthy
    crisisDetectionSensitivity: 'medium',
    professionalSupportThreshold: 3 // 3 concerning sessions trigger support suggestion
  };

  /**
   * Monitor current session for healthy boundaries
   */
  static monitorCurrentSession(
    sessionMetrics: SessionMetrics,
    profile: AdaptiveProfile,
    recentUsage: UsagePattern[]
  ): HealthyBoundaryIntervention[] {
    
    const interventions: HealthyBoundaryIntervention[] = [];
    const boundaries = this.getBoundariesForProfile(profile);
    const currentUsage = this.calculateCurrentUsage(recentUsage);
    
    // Check for emotional overwhelm
    if (sessionMetrics.emotionalDepthScore >= boundaries.emotionalIntensityThreshold * 10) {
      interventions.push(this.createEmotionalRegulationIntervention(sessionMetrics));
    }
    
    // Check for time-based boundaries
    if (currentUsage.daily.totalMinutes > boundaries.maxDailyMinutes) {
      interventions.push(this.createTimeBasedIntervention('daily_limit', boundaries));
    }
    
    // Check for consecutive usage concerns
    if (currentUsage.daily.consecutiveDays > boundaries.maxConsecutiveDays) {
      interventions.push(this.createRestDayIntervention(currentUsage.daily.consecutiveDays));
    }
    
    // Check for crisis indicators
    if (sessionMetrics.crisisIndicators) {
      interventions.push(this.createCrisisIntervention(boundaries.crisisDetectionSensitivity));
    }
    
    // Positive reinforcement for healthy patterns
    if (this.detectHealthyPattern(currentUsage, boundaries)) {
      interventions.push(this.createPositiveReinforcementIntervention(currentUsage));
    }
    
    return interventions.filter(i => this.shouldShowIntervention(i, profile));
  }

  /**
   * Analyze usage patterns over time
   */
  static analyzeUsagePatterns(
    sessions: SessionMetrics[],
    profile: PrivacyPreservingUserProfile,
    timeframe: 'week' | 'month' | 'quarter'
  ): {
    patterns: UsagePattern[];
    insights: WellbeingInsight[];
    recommendations: string[];
    healthScore: number; // 0-1, overall usage health
  } {
    
    const patterns = this.calculateUsagePatterns(sessions, timeframe);
    const insights = this.generateWellbeingInsights(patterns, profile);
    const recommendations = this.generateHealthyUsageRecommendations(patterns, profile);
    const healthScore = this.calculateUsageHealthScore(patterns);
    
    return {
      patterns,
      insights,
      recommendations,
      healthScore
    };
  }

  /**
   * Get personalized boundaries based on user profile
   */
  private static getBoundariesForProfile(profile: AdaptiveProfile): HealthyUsageBoundaries {
    const base = { ...this.DEFAULT_BOUNDARIES };
    
    // Adjust based on profile type
    switch (profile.profileType) {
      case 'deep_reflector':
        base.maxDailyMinutes = 120; // Allow longer sessions
        base.emotionalIntensityThreshold = 0.9; // Higher tolerance
        break;
        
      case 'crisis_processor':
        base.emotionalIntensityThreshold = 0.6; // Lower threshold
        base.overwhelmPreventionLevel = 'high';
        base.crisisDetectionSensitivity = 'high';
        break;
        
      case 'struggling':
        base.maxDailyMinutes = 45; // Shorter sessions
        base.maxConsecutiveDays = 5;
        base.crisisDetectionSensitivity = 'high';
        break;
        
      case 'surface_user':
        base.maxDailyMinutes = 60;
        base.healthySkipDayFrequency = 3; // More skip days OK
        break;
    }
    
    // Adjust based on autonomy level
    if (profile.autonomyLevel === 'high_support') {
      base.overwhelmPreventionLevel = 'high';
      base.professionalSupportThreshold = 2;
    } else if (profile.autonomyLevel === 'self_directed') {
      base.maxConsecutiveDays = 14; // More flexibility
      base.overwhelmPreventionLevel = 'low';
    }
    
    return base;
  }

  /**
   * Create emotional regulation intervention
   */
  private static createEmotionalRegulationIntervention(
    sessionMetrics: SessionMetrics
  ): HealthyBoundaryIntervention {
    
    return {
      type: 'break_suggestion',
      severity: 'recommendation',
      title: 'Take a Mindful Moment',
      message: 'You\'re processing a lot emotionally right now. Consider taking a gentle break to integrate these feelings.',
      actions: {
        primary: 'Take 5-minute break',
        secondary: 'Continue mindfully',
        dismissible: true
      },
      reasoning: 'Emotional processing is powerful work. Breaks help integrate insights and prevent overwhelm.',
      userControl: {
        canSnooze: true,
        snoozeOptions: [15, 30, 60], // Minutes
        canDisable: true,
        disableScope: 'session'
      },
      showAfterDelay: 10,
      showOnlyOnce: true,
      expireAfter: 300 // 5 minutes
    };
  }

  /**
   * Create time-based boundary intervention
   */
  private static createTimeBasedIntervention(
    type: 'daily_limit' | 'weekly_limit',
    boundaries: HealthyUsageBoundaries
  ): HealthyBoundaryIntervention {
    
    const isDaily = type === 'daily_limit';
    
    return {
      type: 'pacing_guidance',
      severity: 'suggestion',
      title: isDaily ? 'Daily Reflection Complete' : 'Weekly Reflection Boundary',
      message: isDaily 
        ? `You've spent ${boundaries.maxDailyMinutes} minutes reflecting today. Your healing happens in rest too.`
        : `You've reached your weekly reflection time. Balance is key to sustainable growth.`,
      actions: {
        primary: 'Save and rest',
        secondary: 'Continue briefly',
        dismissible: true
      },
      reasoning: 'Sustainable healing includes rest and integration time. Quality over quantity.',
      userControl: {
        canSnooze: true,
        snoozeOptions: isDaily ? [30, 60] : [120, 240], // Minutes
        canDisable: true,
        disableScope: isDaily ? 'day' : 'week'
      },
      showAfterDelay: 0,
      showOnlyOnce: false
    };
  }

  /**
   * Create rest day intervention
   */
  private static createRestDayIntervention(consecutiveDays: number): HealthyBoundaryIntervention {
    return {
      type: 'gentle_reminder',
      severity: 'suggestion',
      title: 'Rest Day Invitation',
      message: `You've been consistently reflecting for ${consecutiveDays} days. Consider a gentle rest day tomorrow to let your insights settle.`,
      actions: {
        primary: 'Plan rest day',
        secondary: 'Continue as feels right',
        dismissible: true
      },
      reasoning: 'Rest days prevent burnout and allow subconscious processing of your growth work.',
      userControl: {
        canSnooze: true,
        snoozeOptions: [1440, 2880], // 1-2 days in minutes
        canDisable: true,
        disableScope: 'week'
      },
      showAfterDelay: 0,
      showOnlyOnce: true,
      expireAfter: 86400 // 24 hours
    };
  }

  /**
   * Create crisis support intervention
   */
  private static createCrisisIntervention(
    sensitivity: 'low' | 'medium' | 'high'
  ): HealthyBoundaryIntervention {
    
    const urgencyLevel = sensitivity === 'high' ? 'urgent' : 'recommendation';
    
    return {
      type: 'professional_support',
      severity: urgencyLevel,
      title: 'Support Is Available',
      message: 'You\'re going through something difficult. Consider reaching out for additional support.',
      actions: {
        primary: 'View crisis resources',
        secondary: 'Continue safely',
        dismissible: false
      },
      reasoning: 'Professional support can provide additional tools and perspective during difficult times.',
      userControl: {
        canSnooze: false,
        snoozeOptions: [],
        canDisable: false,
        disableScope: 'session'
      },
      showAfterDelay: 0,
      showOnlyOnce: false
    };
  }

  /**
   * Create positive reinforcement intervention
   */
  private static createPositiveReinforcementIntervention(
    usage: any
  ): HealthyBoundaryIntervention {
    
    return {
      type: 'celebration',
      severity: 'info',
      title: 'Healthy Pattern Recognition',
      message: 'You\'re maintaining a balanced approach to reflection. This sustainable pace supports long-term healing.',
      actions: {
        primary: 'Acknowledge growth',
        dismissible: true
      },
      reasoning: 'Recognizing healthy patterns reinforces positive behaviors.',
      userControl: {
        canSnooze: true,
        snoozeOptions: [1440], // 1 day
        canDisable: true,
        disableScope: 'week'
      },
      showAfterDelay: 30,
      showOnlyOnce: true,
      expireAfter: 600 // 10 minutes
    };
  }

  /**
   * Calculate current usage across timeframes
   */
  private static calculateCurrentUsage(recentUsage: UsagePattern[]): {
    daily: UsagePattern;
    weekly: UsagePattern;
  } {
    // Simplified calculation - in real implementation would aggregate actual data
    const defaultPattern: UsagePattern = {
      period: 'daily',
      timestamp: Timestamp.now(),
      totalMinutes: 0,
      sessionCount: 0,
      averageSessionLength: 0,
      consecutiveDays: 0,
      skipDays: 0,
      emotionalOverloadRisk: 'low',
      dependencyRisk: 'low',
      burnoutRisk: 'low',
      healthyPacing: true,
      selfRegulation: true,
      balancedEngagement: true
    };

    const daily = recentUsage.find(p => p.period === 'daily') || { ...defaultPattern };
    const weekly = recentUsage.find(p => p.period === 'weekly') || { ...defaultPattern, period: 'weekly' };

    return { daily, weekly };
  }

  /**
   * Detect healthy usage patterns
   */
  private static detectHealthyPattern(
    usage: { daily: UsagePattern; weekly: UsagePattern },
    boundaries: HealthyUsageBoundaries
  ): boolean {
    
    const healthyIndicators = [
      usage.daily.totalMinutes < boundaries.maxDailyMinutes * 0.8, // Under 80% of limit
      usage.weekly.skipDays >= boundaries.healthySkipDayFrequency,
      usage.daily.emotionalOverloadRisk === 'low',
      usage.daily.selfRegulation,
      usage.daily.balancedEngagement
    ];

    return healthyIndicators.filter(Boolean).length >= 3;
  }

  /**
   * Determine if intervention should be shown
   */
  private static shouldShowIntervention(
    intervention: HealthyBoundaryIntervention,
    profile: AdaptiveProfile
  ): boolean {
    
    // Respect user autonomy level
    if (profile.autonomyLevel === 'self_directed' && intervention.severity !== 'urgent') {
      return false;
    }
    
    // Check boundary preferences
    if (profile.boundaryPreferences.crisisInterventionStyle === 'delayed' && 
        intervention.type === 'professional_support') {
      return false;
    }
    
    return true;
  }

  /**
   * Calculate usage patterns over time
   */
  private static calculateUsagePatterns(
    sessions: SessionMetrics[],
    timeframe: 'week' | 'month' | 'quarter'
  ): UsagePattern[] {
    
    // Group sessions by time periods
    const patterns: UsagePattern[] = [];
    
    // This would implement actual pattern calculation
    // For now, return placeholder
    patterns.push({
      period: 'weekly',
      timestamp: Timestamp.now(),
      totalMinutes: sessions.reduce((sum, s) => sum + s.duration, 0),
      sessionCount: sessions.length,
      averageSessionLength: sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length 
        : 0,
      consecutiveDays: 0,
      skipDays: 0,
      emotionalOverloadRisk: 'low',
      dependencyRisk: 'low',
      burnoutRisk: 'low',
      healthyPacing: true,
      selfRegulation: true,
      balancedEngagement: true
    });
    
    return patterns;
  }

  /**
   * Generate wellbeing insights
   */
  private static generateWellbeingInsights(
    patterns: UsagePattern[],
    profile: PrivacyPreservingUserProfile
  ): WellbeingInsight[] {
    
    const insights: WellbeingInsight[] = [];
    
    if (patterns.length > 0) {
      const pattern = patterns[0];
      
      if (pattern.healthyPacing) {
        insights.push({
          insight: 'You\'re maintaining a healthy, sustainable pace with your reflection practice.',
          evidence: ['Consistent but not excessive session lengths', 'Good balance of engagement and rest'],
          supportive: true,
          actionable: true,
          empowering: true
        });
      }
      
      if (pattern.selfRegulation) {
        insights.push({
          insight: 'You show strong self-awareness in managing your emotional processing.',
          evidence: ['Natural breaks between intense sessions', 'Appropriate session length variation'],
          supportive: true,
          actionable: false,
          empowering: true
        });
      }
    }
    
    return insights;
  }

  /**
   * Generate healthy usage recommendations
   */
  private static generateHealthyUsageRecommendations(
    patterns: UsagePattern[],
    profile: PrivacyPreservingUserProfile
  ): string[] {
    
    const recommendations: string[] = [];
    
    if (patterns.length > 0) {
      const pattern = patterns[0];
      
      if (pattern.burnoutRisk === 'medium' || pattern.burnoutRisk === 'high') {
        recommendations.push('Consider shorter, more frequent sessions rather than long intensive ones');
        recommendations.push('Schedule regular rest days to prevent emotional fatigue');
      }
      
      if (pattern.dependencyRisk === 'medium' || pattern.dependencyRisk === 'high') {
        recommendations.push('Explore offline reflection practices like walking meditation');
        recommendations.push('Practice sitting with difficult emotions without immediately journaling');
      }
      
      if (pattern.healthyPacing) {
        recommendations.push('Continue your balanced approach - you\'re modeling healthy engagement');
      }
    }
    
    return recommendations;
  }

  /**
   * Calculate overall usage health score
   */
  private static calculateUsageHealthScore(patterns: UsagePattern[]): number {
    if (patterns.length === 0) return 0.5;
    
    const pattern = patterns[0];
    
    const healthFactors = [
      pattern.healthyPacing ? 1 : 0,
      pattern.selfRegulation ? 1 : 0,
      pattern.balancedEngagement ? 1 : 0,
      pattern.emotionalOverloadRisk === 'low' ? 1 : 0,
      pattern.dependencyRisk === 'low' ? 1 : 0,
      pattern.burnoutRisk === 'low' ? 1 : 0
    ];
    
    return healthFactors.reduce((sum, factor) => sum + factor, 0) / healthFactors.length;
  }
}

export default HealthyUsageMonitor;