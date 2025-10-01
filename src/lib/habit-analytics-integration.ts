/**
 * ALCHM Habit Formation Analytics Integration
 * Connects neuroplasticity-based habit formation with analytics and badge systems
 */

import { analytics } from './analytics';
import { 
  HabitProgress, 
  NeuroplasticityMilestone, 
  NervousSystemState,
  MicroHabit 
} from './neuroplasticity-habits';

export interface HabitAnalyticsData {
  habitId: string;
  sessionId: string;
  userId: string;
  timestamp: Date;
  
  // Habit-specific metrics
  completionData: {
    version_practiced: string;
    duration_minutes: number;
    engagement_quality: number; // 1-10
    insights: string[];
    challenges: string[];
  };
  
  // Neuroplasticity metrics
  neuroplasticityMetrics: {
    neural_pathway_strength_change: number;
    automaticity_progress: number;
    wellbeing_correlation: number;
    stress_response_improvement: number;
  };
  
  // Nervous system metrics
  nervousSystemData: {
    pre_practice_state: NervousSystemState;
    post_practice_state?: NervousSystemState;
    typeof window !== 'undefined' && window_of_tolerance_change: number;
    regulation_capacity_utilized: 'minimal' | 'limited' | 'moderate' | 'strong';
  };
  
  // Badge eligibility data
  badgeMetrics: {
    consistency_streak: number;
    practice_quality_score: number;
    neural_development_score: number;
    trauma_informed_adaptation_score: number;
  };
}

export interface HabitBadgeEligibility {
  badgeKey: string;
  badgeLevel: number;
  earnedAt: Date;
  celebrationMessage: string;
  neuralAchievement: string;
  criteriaMetrics: Record<string, number>;
}

export class HabitAnalyticsIntegration {
  
  /**
   * Track comprehensive habit completion with neuroplasticity metrics
   */
  static async trackHabitCompletion(data: HabitAnalyticsData): Promise<void> {
    // Track core habit completion
    analytics.track('journal', 'neuroplasticity_habit_completed', data.habitId, data.completionData.duration_minutes, {
      engagement_quality: data.completionData.engagement_quality,
      version_practiced: data.completionData.version_practiced,
      neural_pathway_change: data.neuroplasticityMetrics.neural_pathway_strength_change,
      automaticity_progress: data.neuroplasticityMetrics.automaticity_progress,
      nervous_system_state: data.nervousSystemData.pre_practice_state.current,
      regulation_capacity: data.nervousSystemData.regulation_capacity_utilized,
      typeof window !== 'undefined' && window_tolerance_change: data.nervousSystemData.typeof window !== 'undefined' && window_of_tolerance_change
    });

    // Track neuroplasticity-specific metrics
    this.trackNeuroplasticityProgress(data);
    
    // Track nervous system regulation progress
    this.trackNervousSystemRegulation(data);
    
    // Check badge eligibility
    const badgeEligibility = this.assessBadgeEligibility(data);
    if (badgeEligibility.length > 0) {
      await this.awardHabitBadges(data.userId, badgeEligibility);
    }
    
    // Track insights for AI learning
    if (data.completionData.insights.length > 0) {
      this.trackUserInsights(data);
    }
  }

  /**
   * Track neuroplasticity-specific progress metrics
   */
  private static trackNeuroplasticityProgress(data: HabitAnalyticsData): void {
    analytics.track('journal', 'neuroplasticity_progress', data.habitId, undefined, {
      neural_pathway_strength_change: data.neuroplasticityMetrics.neural_pathway_strength_change,
      automaticity_progress: data.neuroplasticityMetrics.automaticity_progress,
      wellbeing_correlation: data.neuroplasticityMetrics.wellbeing_correlation,
      stress_response_improvement: data.neuroplasticityMetrics.stress_response_improvement,
      practice_consistency: data.badgeMetrics.consistency_streak,
      quality_score: data.badgeMetrics.practice_quality_score
    });

    // Track significant neural pathway milestones
    if (data.neuroplasticityMetrics.neural_pathway_strength_change >= 10) {
      analytics.track('journal', 'significant_neural_change', data.habitId, data.neuroplasticityMetrics.neural_pathway_strength_change, {
        milestone_type: 'pathway_strengthening',
        engagement_quality: data.completionData.engagement_quality
      });
    }

    // Track automaticity breakthroughs
    if (data.neuroplasticityMetrics.automaticity_progress >= 15) {
      analytics.track('journal', 'automaticity_breakthrough', data.habitId, data.neuroplasticityMetrics.automaticity_progress, {
        milestone_type: 'habit_automation',
        practice_duration: data.completionData.duration_minutes
      });
    }
  }

  /**
   * Track nervous system regulation improvements
   */
  private static trackNervousSystemRegulation(data: HabitAnalyticsData): void {
    analytics.track('journal', 'nervous_system_regulation', data.sessionId, undefined, {
      pre_state: data.nervousSystemData.pre_practice_state.current,
      post_state: data.nervousSystemData.post_practice_state?.current,
      typeof window !== 'undefined' && window_tolerance_change: data.nervousSystemData.typeof window !== 'undefined' && window_of_tolerance_change,
      regulation_capacity_used: data.nervousSystemData.regulation_capacity_utilized,
      practice_adapted: data.completionData.version_practiced !== 'expanded_version'
    });

    // Track typeof window !== 'undefined' && window of tolerance expansions
    if (data.nervousSystemData.typeof window !== 'undefined' && window_of_tolerance_change > 0) {
      analytics.track('journal', 'typeof window !== 'undefined' && window_tolerance_expansion', data.sessionId, data.nervousSystemData.typeof window !== 'undefined' && window_of_tolerance_change, {
        pre_capacity: data.nervousSystemData.pre_practice_state.typeof window !== 'undefined' && windowOfTolerance.current,
        regulation_method: data.completionData.version_practiced
      });
    }

    // Track nervous system state improvements
    if (this.isNervousSystemImprovement(
      data.nervousSystemData.pre_practice_state,
      data.nervousSystemData.post_practice_state
    )) {
      analytics.track('journal', 'nervous_system_upgrade', data.sessionId, undefined, {
        from_state: data.nervousSystemData.pre_practice_state.current,
        to_state: data.nervousSystemData.post_practice_state?.current,
        practice_duration: data.completionData.duration_minutes
      });
    }
  }

  /**
   * Assess badge eligibility based on neuroplasticity and trauma-informed criteria
   */
  private static assessBadgeEligibility(data: HabitAnalyticsData): HabitBadgeEligibility[] {
    const eligibleBadges: HabitBadgeEligibility[] = [];
    
    // Presence badges (showing up consistently)
    if (data.badgeMetrics.consistency_streak >= 3 && data.badgeMetrics.consistency_streak <= 7) {
      eligibleBadges.push({
        badgeKey: 'presence',
        badgeLevel: 1,
        earnedAt: new Date(),
        celebrationMessage: 'You showed up. That\'s the win.',
        neuralAchievement: 'Building neural pathways through consistent presence',
        criteriaMetrics: {
          consistency_streak: data.badgeMetrics.consistency_streak,
          engagement_quality: data.completionData.engagement_quality
        }
      });
    }

    if (data.badgeMetrics.consistency_streak >= 7 && data.badgeMetrics.consistency_streak <= 14) {
      eligibleBadges.push({
        badgeKey: 'presence',
        badgeLevel: 2,
        earnedAt: new Date(),
        celebrationMessage: 'A week of presence. Consistency is your superpower.',
        neuralAchievement: 'Neural pathways strengthening through sustained practice',
        criteriaMetrics: {
          consistency_streak: data.badgeMetrics.consistency_streak,
          neural_pathway_strength: data.neuroplasticityMetrics.neural_pathway_strength_change
        }
      });
    }

    // Insight badges (pattern recognition and meaning-making)
    if (data.completionData.insights.length >= 2 && data.badgeMetrics.practice_quality_score >= 7) {
      eligibleBadges.push({
        badgeKey: 'insight',
        badgeLevel: 1,
        earnedAt: new Date(),
        celebrationMessage: 'Found signal in the noise.',
        neuralAchievement: 'Prefrontal cortex developing pattern recognition abilities',
        criteriaMetrics: {
          insights_generated: data.completionData.insights.length,
          practice_quality: data.badgeMetrics.practice_quality_score,
          neural_development: data.badgeMetrics.neural_development_score
        }
      });
    }

    // Resilience badges (nervous system regulation and adaptation)
    if (data.nervousSystemData.typeof window !== 'undefined' && window_of_tolerance_change > 0 && 
        data.neuroplasticityMetrics.stress_response_improvement >= 15) {
      eligibleBadges.push({
        badgeKey: 'resilience',
        badgeLevel: 1,
        earnedAt: new Date(),
        celebrationMessage: 'Vulnerability as strength discovered.',
        neuralAchievement: 'Amygdala regulation and prefrontal cortex strengthening',
        criteriaMetrics: {
          stress_response_improvement: data.neuroplasticityMetrics.stress_response_improvement,
          typeof window !== 'undefined' && window_tolerance_expansion: data.nervousSystemData.typeof window !== 'undefined' && window_of_tolerance_change,
          trauma_informed_adaptation: data.badgeMetrics.trauma_informed_adaptation_score
        }
      });
    }

    return eligibleBadges;
  }

  /**
   * Award habit-related badges and track achievements
   */
  private static async awardHabitBadges(userId: string, badges: HabitBadgeEligibility[]): Promise<void> {
    for (const badge of badges) {
      // Track badge earning
      analytics.track('user', 'badge_earned', badge.badgeKey, badge.badgeLevel, {
        badge_type: 'neuroplasticity_habit',
        neural_achievement: badge.neuralAchievement,
        celebration_message: badge.celebrationMessage,
        criteria_metrics: badge.criteriaMetrics
      });

      // In a real implementation, this would save to Firestore
      // await saveBadgeToFirestore(userId, badge);
      
      console.log(`Badge awarded: ${badge.badgeKey} Level ${badge.badgeLevel} - ${badge.celebrationMessage}`);
    }
  }

  /**
   * Track user insights for AI learning and personalization
   */
  private static trackUserInsights(data: HabitAnalyticsData): void {
    data.completionData.insights.forEach((insight, index) => {
      analytics.track('ai', 'user_insight_generated', data.habitId, undefined, {
        insight_content_length: insight.length,
        insight_index: index,
        engagement_quality: data.completionData.engagement_quality,
        neural_pathway_change: data.neuroplasticityMetrics.neural_pathway_strength_change,
        nervous_system_state: data.nervousSystemData.pre_practice_state.current,
        practice_type: data.completionData.version_practiced
      });
    });

    // Track high-quality insight sessions for AI training
    if (data.completionData.insights.length >= 3 && data.completionData.engagement_quality >= 8) {
      analytics.track('ai', 'high_quality_insight_session', data.sessionId, data.completionData.insights.length, {
        total_insight_content: data.completionData.insights.join(' ').length,
        engagement_quality: data.completionData.engagement_quality,
        neural_development: data.badgeMetrics.neural_development_score
      });
    }
  }

  /**
   * Generate habit formation analytics report
   */
  static generateHabitAnalyticsReport(habitProgress: HabitProgress[]): HabitAnalyticsReport {
    const totalDaysPracticed = habitProgress.reduce((sum, h) => sum + h.days_practiced, 0);
    const avgNeuralPathwayStrength = habitProgress.reduce((sum, h) => sum + h.neural_pathway_strength, 0) / habitProgress.length;
    const totalMilestones = habitProgress.reduce((sum, h) => sum + h.neuroplasticity_milestones.length, 0);
    const avgWellbeingCorrelation = habitProgress.reduce((sum, h) => sum + h.wellbeing_correlation, 0) / habitProgress.length;

    return {
      summary: {
        totalHabits: habitProgress.length,
        totalDaysPracticed,
        avgNeuralPathwayStrength: Math.round(avgNeuralPathwayStrength),
        totalNeuroplasticityMilestones: totalMilestones,
        avgWellbeingCorrelation: Math.round(avgWellbeingCorrelation * 100) / 100
      },
      neuralDevelopment: {
        pathwayStrengths: habitProgress.map(h => ({
          habitId: h.habit_id,
          strength: h.neural_pathway_strength,
          automaticity: h.automaticity_level
        })),
        milestonesAchieved: habitProgress.flatMap(h => h.neuroplasticity_milestones),
        regulationImprovements: habitProgress.map(h => ({
          habitId: h.habit_id,
          improvement: h.stress_response_improvement,
          capacityChange: h.regulation_capacity_change
        }))
      },
      traumaInformedMetrics: {
        pausePeriodsUsed: habitProgress.flatMap(h => h.pause_periods).length,
        modificationsApplied: habitProgress.flatMap(h => h.modifications_used).length,
        nervousSystemTrends: habitProgress.flatMap(h => h.nervous_system_trends),
        personalVictories: habitProgress.flatMap(h => h.personal_victories)
      },
      insights: this.generateHabitInsights(habitProgress)
    };
  }

  /**
   * Generate insights about user's habit formation patterns
   */
  private static generateHabitInsights(habitProgress: HabitProgress[]): string[] {
    const insights: string[] = [];
    
    const avgStrength = habitProgress.reduce((sum, h) => sum + h.neural_pathway_strength, 0) / habitProgress.length;
    if (avgStrength >= 75) {
      insights.push('Your neural pathways are showing strong development. This is measurable brain change!');
    }

    const totalMilestones = habitProgress.reduce((sum, h) => sum + h.neuroplasticity_milestones.length, 0);
    if (totalMilestones >= 5) {
      insights.push('You\'ve achieved multiple neuroplasticity milestones. Your brain is literally rewiring for resilience.');
    }

    const avgWellbeing = habitProgress.reduce((sum, h) => sum + h.wellbeing_correlation, 0) / habitProgress.length;
    if (avgWellbeing >= 0.6) {
      insights.push('Strong correlation between your habit practice and wellbeing. Your practices are truly supporting you.');
    }

    const pausePeriods = habitProgress.flatMap(h => h.pause_periods);
    if (pausePeriods.length > 0) {
      insights.push('You\'ve practiced self-compassion by pausing when needed. This trauma-informed approach supports lasting change.');
    }

    return insights;
  }

  /**
   * Helper method to determine if nervous system state improved
   */
  private static isNervousSystemImprovement(
    preState: NervousSystemState,
    postState?: NervousSystemState
  ): boolean {
    if (!postState) return false;

    const stateOrder = { dorsal_vagal: 0, sympathetic: 1, ventral_vagal: 2 };
    const preOrder = stateOrder[preState.current];
    const postOrder = stateOrder[postState.current];

    return postOrder > preOrder || postState.typeof window !== 'undefined' && windowOfTolerance.current > preState.typeof window !== 'undefined' && windowOfTolerance.current;
  }
}

// Supporting interfaces
export interface HabitAnalyticsReport {
  summary: {
    totalHabits: number;
    totalDaysPracticed: number;
    avgNeuralPathwayStrength: number;
    totalNeuroplasticityMilestones: number;
    avgWellbeingCorrelation: number;
  };
  neuralDevelopment: {
    pathwayStrengths: Array<{
      habitId: string;
      strength: number;
      automaticity: number;
    }>;
    milestonesAchieved: NeuroplasticityMilestone[];
    regulationImprovements: Array<{
      habitId: string;
      improvement: number;
      capacityChange: number;
    }>;
  };
  traumaInformedMetrics: {
    pausePeriodsUsed: number;
    modificationsApplied: number;
    nervousSystemTrends: any[];
    personalVictories: any[];
  };
  insights: string[];
}