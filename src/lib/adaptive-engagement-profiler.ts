/**
 * Adaptive User Engagement Profiler for ALCHM
 * 
 * Creates personalized profiles that adapt to user healing patterns
 * Provides supportive recommendations without creating pressure or dependency
 */

import { Timestamp } from 'firebase/firestore';
import { SessionMetrics, EngagementProfile, PrivacyPreservingUserProfile } from './privacy-preserving-analytics';
import { SessionDepthMetrics, MeaningfulEngagementIndicators } from './session-depth-analyzer';

export interface AdaptiveProfile {
  // Core identification
  profileId: string;
  profileType: EngagementProfile;
  lastUpdated: Timestamp;
  
  // Adaptive learning metrics
  learningConfidence: number; // 0-1, how well we understand this user's patterns
  profileStability: number; // 0-1, how consistent the profile has been
  adaptationNeeded: boolean; // Whether profile needs updating
  
  // Personalized insights
  healingStyle: {
    preferredSessionLength: { min: number; max: number; optimal: number };
    bestTimeOfDay: string[]; // ['morning', 'afternoon', 'evening', 'night']
    emotionalProcessingStyle: 'gradual' | 'intensive' | 'cyclical' | 'breakthrough';
    supportPreferences: 'guided' | 'self_directed' | 'community' | 'mixed';
  };
  
  // Personalized recommendations
  recommendations: {
    sessionTiming: string;
    promptTypes: string[];
    supportResources: string[];
    pacing: 'gentle' | 'moderate' | 'intensive';
    interventions: PersonalizedIntervention[];
  };
  
  // Growth trajectory
  trajectory: {
    phase: 'beginning' | 'building' | 'processing' | 'integrating' | 'thriving';
    direction: 'improving' | 'stable' | 'struggling' | 'crisis';
    nextMilestones: string[];
    strengthsToLeverage: string[];
    challengesToAddress: string[];
  };
  
  // Privacy and autonomy
  autonomyLevel: 'high_support' | 'moderate_guidance' | 'self_directed';
  boundaryPreferences: {
    maxSessionReminders: number;
    crisisInterventionStyle: 'immediate' | 'gentle' | 'delayed';
    dataRetentionPreference: number; // days
    sharingComfort: 'private' | 'anonymous_insights' | 'community_sharing';
  };
}

export interface PersonalizedIntervention {
  type: 'prompt' | 'resource' | 'technique' | 'reminder' | 'celebration';
  content: string;
  timing: 'immediate' | 'next_session' | 'weekly' | 'milestone';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reasoning: string; // Why this intervention is suggested
  userChoice: boolean; // Always allow user to decline
}

export interface ProfileEvolution {
  timestamp: Timestamp;
  previousProfile: EngagementProfile;
  newProfile: EngagementProfile;
  triggeringFactors: string[];
  confidenceScore: number;
  userNotified: boolean;
}

export class AdaptiveEngagementProfiler {
  private static readonly PROFILE_EVOLUTION_THRESHOLD = 0.7;
  private static readonly MINIMUM_SESSIONS_FOR_ADAPTATION = 5;

  /**
   * Generate adaptive profile based on user patterns and preferences
   */
  static generateAdaptiveProfile(
    baseProfile: PrivacyPreservingUserProfile,
    recentSessions: SessionMetrics[],
    depthAnalyses: MeaningfulEngagementIndicators[],
    userPreferences?: Partial<AdaptiveProfile['boundaryPreferences']>
  ): AdaptiveProfile {
    
    const healingStyle = this.analyzeHealingStyle(recentSessions, depthAnalyses);
    const recommendations = this.generatePersonalizedRecommendations(
      baseProfile, 
      healingStyle, 
      recentSessions
    );
    const trajectory = this.assessGrowthTrajectory(baseProfile, recentSessions, depthAnalyses);
    const autonomyLevel = this.determineAutonomyLevel(baseProfile, recentSessions);
    
    return {
      profileId: baseProfile.userHashId,
      profileType: baseProfile.profileType,
      lastUpdated: Timestamp.now(),
      
      learningConfidence: this.calculateLearningConfidence(recentSessions.length, baseProfile.totalSessions),
      profileStability: this.calculateProfileStability(recentSessions),
      adaptationNeeded: this.assessAdaptationNeeded(baseProfile, recentSessions),
      
      healingStyle,
      recommendations,
      trajectory,
      autonomyLevel,
      
      boundaryPreferences: {
        maxSessionReminders: userPreferences?.maxSessionReminders ?? this.getDefaultReminderFrequency(baseProfile.profileType),
        crisisInterventionStyle: userPreferences?.crisisInterventionStyle ?? 'gentle',
        dataRetentionPreference: userPreferences?.dataRetentionPreference ?? 365,
        sharingComfort: userPreferences?.sharingComfort ?? 'anonymous_insights'
      }
    };
  }

  /**
   * Analyze user's unique healing style and preferences
   */
  private static analyzeHealingStyle(
    sessions: SessionMetrics[],
    analyses: MeaningfulEngagementIndicators[]
  ): AdaptiveProfile['healingStyle'] {
    
    if (sessions.length < 3) {
      // Default recommendations for new users
      return {
        preferredSessionLength: { min: 10, max: 30, optimal: 20 },
        bestTimeOfDay: ['evening'],
        emotionalProcessingStyle: 'gradual',
        supportPreferences: 'mixed'
      };
    }

    // Analyze session length preferences
    const sessionLengths = sessions.map(s => s.duration);
    const avgLength = sessionLengths.reduce((sum, len) => sum + len, 0) / sessionLengths.length;
    const preferredLength = {
      min: Math.max(5, Math.min(...sessionLengths)),
      max: Math.min(120, Math.max(...sessionLengths)),
      optimal: Math.round(avgLength)
    };

    // Analyze timing patterns (would need timestamp analysis)
    const bestTimeOfDay = this.analyzeBestTimes(sessions);

    // Analyze emotional processing style
    const emotionalProcessingStyle = this.analyzeProcessingStyle(analyses);

    // Analyze support preferences
    const supportPreferences = this.analyzeSupportPreferences(sessions, analyses);

    return {
      preferredSessionLength: preferredLength,
      bestTimeOfDay,
      emotionalProcessingStyle,
      supportPreferences
    };
  }

  /**
   * Generate personalized recommendations based on profile analysis
   */
  private static generatePersonalizedRecommendations(
    profile: PrivacyPreservingUserProfile,
    healingStyle: AdaptiveProfile['healingStyle'],
    sessions: SessionMetrics[]
  ): AdaptiveProfile['recommendations'] {
    
    const interventions: PersonalizedIntervention[] = [];
    
    // Session timing recommendations
    const sessionTiming = this.generateTimingRecommendation(healingStyle, profile);
    
    // Personalized prompt types
    const promptTypes = this.recommendPromptTypes(profile.profileType, sessions);
    
    // Support resources
    const supportResources = this.recommendSupportResources(profile, sessions);
    
    // Pacing recommendations
    const pacing = this.recommendPacing(profile.profileType, healingStyle);
    
    // Generate specific interventions
    interventions.push(...this.generateInterventions(profile, sessions, healingStyle));
    
    return {
      sessionTiming,
      promptTypes,
      supportResources,
      pacing,
      interventions
    };
  }

  /**
   * Assess user's growth trajectory and next steps
   */
  private static assessGrowthTrajectory(
    profile: PrivacyPreservingUserProfile,
    sessions: SessionMetrics[],
    analyses: MeaningfulEngagementIndicators[]
  ): AdaptiveProfile['trajectory'] {
    
    // Determine current healing phase
    const phase = this.determineHealingPhase(profile, analyses);
    
    // Assess direction of growth
    const direction = this.assessGrowthDirection(sessions, analyses);
    
    // Identify next milestones
    const nextMilestones = this.identifyNextMilestones(phase, profile.profileType);
    
    // Identify strengths to leverage
    const strengthsToLeverage = this.identifyStrengths(analyses);
    
    // Identify challenges to address
    const challengesToAddress = this.identifyChallenges(analyses, sessions);
    
    return {
      phase,
      direction,
      nextMilestones,
      strengthsToLeverage,
      challengesToAddress
    };
  }

  /**
   * Determine appropriate level of autonomy and support
   */
  private static determineAutonomyLevel(
    profile: PrivacyPreservingUserProfile,
    sessions: SessionMetrics[]
  ): AdaptiveProfile['autonomyLevel'] {
    
    const factors = {
      consistency: profile.consistencyScore,
      engagement: sessions.length > 0 ? sessions[0].completionRate : 0.5,
      selfDirection: sessions.filter(s => s.userInitiated).length / Math.max(sessions.length, 1),
      supportNeeds: profile.supportNeedLevel
    };
    
    if (factors.consistency > 0.7 && factors.selfDirection > 0.6) {
      return 'self_directed';
    } else if (factors.supportNeeds === 'high' || factors.supportNeeds === 'crisis') {
      return 'high_support';
    } else {
      return 'moderate_guidance';
    }
  }

  /**
   * Helper methods for profile analysis
   */
  private static analyzeBestTimes(sessions: SessionMetrics[]): string[] {
    // Analyze session timestamps to find optimal times
    // For now, return default - would need actual timestamp analysis
    return ['evening'];
  }

  private static analyzeProcessingStyle(analyses: MeaningfulEngagementIndicators[]): 'gradual' | 'intensive' | 'cyclical' | 'breakthrough' {
    if (analyses.length < 3) return 'gradual';
    
    const breakthroughCount = analyses.filter(a => a.engagementDepth === 'breakthrough').length;
    const processingCount = analyses.filter(a => a.engagementDepth === 'processing').length;
    
    if (breakthroughCount > analyses.length * 0.3) return 'breakthrough';
    if (processingCount > analyses.length * 0.6) return 'intensive';
    return 'gradual';
  }

  private static analyzeSupportPreferences(
    sessions: SessionMetrics[],
    analyses: MeaningfulEngagementIndicators[]
  ): 'guided' | 'self_directed' | 'community' | 'mixed' {
    
    const selfDirectedRatio = sessions.filter(s => s.userInitiated).length / Math.max(sessions.length, 1);
    
    if (selfDirectedRatio > 0.7) return 'self_directed';
    if (selfDirectedRatio < 0.3) return 'guided';
    return 'mixed';
  }

  private static generateTimingRecommendation(
    healingStyle: AdaptiveProfile['healingStyle'],
    profile: PrivacyPreservingUserProfile
  ): string {
    const optimalLength = healingStyle.preferredSessionLength.optimal;
    const bestTime = healingStyle.bestTimeOfDay[0];
    
    return `${optimalLength}-minute sessions work best for you, ideally in the ${bestTime}`;
  }

  private static recommendPromptTypes(profileType: EngagementProfile, sessions: SessionMetrics[]): string[] {
    const basePrompts: Record<EngagementProfile, string[]> = {
      deep_reflector: ['philosophical', 'introspective', 'meaning_making', 'integration'],
      steady_builder: ['habit_focused', 'progress_tracking', 'skill_building', 'consistency'],
      crisis_processor: ['grounding', 'safety_focused', 'emotion_regulation', 'support_connection'],
      explorer: ['varied', 'creative', 'discovery_oriented', 'experimental'],
      surface_user: ['simple', 'accessible', 'low_pressure', 'encouraging'],
      struggling: ['gentle', 'supportive', 'strength_based', 'hope_building'],
      recovering: ['celebration', 'growth_acknowledgment', 'forward_focused', 'empowering']
    };

    return basePrompts[profileType] || basePrompts.explorer;
  }

  private static recommendSupportResources(
    profile: PrivacyPreservingUserProfile,
    sessions: SessionMetrics[]
  ): string[] {
    const resources: string[] = [];
    
    if (profile.supportNeedLevel === 'high' || profile.supportNeedLevel === 'crisis') {
      resources.push('crisis_support', 'professional_therapy', 'peer_support');
    }
    
    if (profile.profileType === 'deep_reflector') {
      resources.push('advanced_techniques', 'integration_practices', 'wisdom_traditions');
    }
    
    if (profile.profileType === 'steady_builder') {
      resources.push('habit_trackers', 'progress_tools', 'accountability_systems');
    }
    
    resources.push('community_connection', 'educational_content');
    
    return resources;
  }

  private static recommendPacing(
    profileType: EngagementProfile,
    healingStyle: AdaptiveProfile['healingStyle']
  ): 'gentle' | 'moderate' | 'intensive' {
    
    if (profileType === 'struggling' || profileType === 'crisis_processor') {
      return 'gentle';
    }
    
    if (profileType === 'deep_reflector' && healingStyle.emotionalProcessingStyle === 'intensive') {
      return 'intensive';
    }
    
    return 'moderate';
  }

  private static generateInterventions(
    profile: PrivacyPreservingUserProfile,
    sessions: SessionMetrics[],
    healingStyle: AdaptiveProfile['healingStyle']
  ): PersonalizedIntervention[] {
    
    const interventions: PersonalizedIntervention[] = [];
    
    // Consistency support
    if (profile.consistencyScore < 0.5) {
      interventions.push({
        type: 'reminder',
        content: `Gentle reminder: Even 10 minutes of reflection can be meaningful. Your healing journey is unique to you.`,
        timing: 'weekly',
        priority: 'low',
        reasoning: 'Low consistency detected - gentle encouragement without pressure',
        userChoice: true
      });
    }
    
    // Growth celebration
    if (profile.healingProgression > 0.7) {
      interventions.push({
        type: 'celebration',
        content: `Take a moment to acknowledge your growth. You're building real resilience through your consistent reflection.`,
        timing: 'milestone',
        priority: 'medium',
        reasoning: 'High healing progression - celebrate achievements',
        userChoice: true
      });
    }
    
    // Crisis support
    if (profile.supportNeedLevel === 'high' || profile.supportNeedLevel === 'crisis') {
      interventions.push({
        type: 'resource',
        content: `Remember: Support is available. Consider connecting with professional help or trusted friends.`,
        timing: 'immediate',
        priority: 'high',
        reasoning: 'High support needs detected',
        userChoice: true
      });
    }
    
    return interventions;
  }

  /**
   * Calculate confidence in profile accuracy
   */
  private static calculateLearningConfidence(recentSessions: number, totalSessions: number): number {
    const dataPoints = Math.min(recentSessions, 20); // Cap at 20 recent sessions
    const experienceWeight = Math.min(totalSessions / 50, 1); // More total sessions = higher confidence
    
    return (dataPoints / 20) * 0.7 + experienceWeight * 0.3;
  }

  /**
   * Calculate stability of profile over time
   */
  private static calculateProfileStability(sessions: SessionMetrics[]): number {
    if (sessions.length < 5) return 0.5;
    
    // Measure consistency in engagement patterns
    const durations = sessions.map(s => s.duration);
    const depths = sessions.map(s => s.emotionalDepthScore);
    
    const durationStability = 1 - (this.calculateVariance(durations) / Math.max(this.calculateMean(durations), 1));
    const depthStability = 1 - (this.calculateVariance(depths) / Math.max(this.calculateMean(depths), 1));
    
    return Math.max(0, Math.min(1, (durationStability + depthStability) / 2));
  }

  /**
   * Determine if profile needs adaptation
   */
  private static assessAdaptationNeeded(
    profile: PrivacyPreservingUserProfile,
    sessions: SessionMetrics[]
  ): boolean {
    if (sessions.length < this.MINIMUM_SESSIONS_FOR_ADAPTATION) return false;
    
    // Check for significant changes in patterns
    const recentSessions = sessions.slice(0, 5);
    const olderSessions = sessions.slice(5, 10);
    
    if (olderSessions.length < 3) return false;
    
    const recentAvgDuration = this.calculateMean(recentSessions.map(s => s.duration));
    const olderAvgDuration = this.calculateMean(olderSessions.map(s => s.duration));
    
    const durationChange = Math.abs(recentAvgDuration - olderAvgDuration) / olderAvgDuration;
    
    return durationChange > 0.5; // 50% change indicates adaptation needed
  }

  // Helper statistical methods
  private static calculateMean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private static calculateVariance(values: number[]): number {
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return this.calculateMean(squaredDiffs);
  }

  private static getDefaultReminderFrequency(profileType: EngagementProfile): number {
    const frequencies: Record<EngagementProfile, number> = {
      deep_reflector: 2, // Less frequent - self-motivated
      steady_builder: 3, // Regular reminders
      crisis_processor: 1, // Minimal pressure
      explorer: 3, // Regular encouragement
      surface_user: 2, // Gentle encouragement
      struggling: 1, // Very minimal pressure
      recovering: 2 // Supportive but not overwhelming
    };
    
    return frequencies[profileType] || 2;
  }

  private static determineHealingPhase(
    profile: PrivacyPreservingUserProfile,
    analyses: MeaningfulEngagementIndicators[]
  ): AdaptiveProfile['trajectory']['phase'] {
    
    if (profile.totalSessions < 10) return 'beginning';
    if (profile.healingProgression < 0.4) return 'building';
    if (profile.healingProgression < 0.7) return 'processing';
    if (profile.healingProgression < 0.9) return 'integrating';
    return 'thriving';
  }

  private static assessGrowthDirection(
    sessions: SessionMetrics[],
    analyses: MeaningfulEngagementIndicators[]
  ): AdaptiveProfile['trajectory']['direction'] {
    
    if (sessions.length < 3) return 'stable';
    
    const recentAnalyses = analyses.slice(0, 3);
    const crisisCount = recentAnalyses.filter(a => a.crisisIndicators).length;
    const breakthroughCount = recentAnalyses.filter(a => a.healingMoments.length > 2).length;
    
    if (crisisCount > 1) return 'crisis';
    if (breakthroughCount > 1) return 'improving';
    return 'stable';
  }

  private static identifyNextMilestones(
    phase: AdaptiveProfile['trajectory']['phase'],
    profileType: EngagementProfile
  ): string[] {
    
    const milestones: Record<AdaptiveProfile['trajectory']['phase'], string[]> = {
      beginning: ['establish_routine', 'build_comfort', 'explore_features'],
      building: ['deepen_reflection', 'identify_patterns', 'build_consistency'],
      processing: ['integrate_insights', 'develop_coping_skills', 'expand_awareness'],
      integrating: ['apply_learning', 'share_wisdom', 'mentor_others'],
      thriving: ['maintain_wellbeing', 'support_community', 'continue_growth']
    };
    
    return milestones[phase] || milestones.building;
  }

  private static identifyStrengths(analyses: MeaningfulEngagementIndicators[]): string[] {
    const strengthCounts: Record<string, number> = {};
    
    analyses.forEach(analysis => {
      analysis.strengths.forEach(strength => {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
      });
    });
    
    return Object.entries(strengthCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([strength]) => strength);
  }

  private static identifyChallenges(
    analyses: MeaningfulEngagementIndicators[],
    sessions: SessionMetrics[]
  ): string[] {
    
    const challenges: string[] = [];
    
    const avgCompletion = sessions.reduce((sum, s) => sum + s.completionRate, 0) / sessions.length;
    if (avgCompletion < 0.6) challenges.push('session_completion');
    
    const supportNeedCount = analyses.reduce((sum, a) => sum + a.supportNeeds.length, 0);
    if (supportNeedCount / analyses.length > 2) challenges.push('support_access');
    
    const overwhelmCount = analyses.filter(a => a.overwhelmRisk === 'high').length;
    if (overwhelmCount / analyses.length > 0.3) challenges.push('emotional_regulation');
    
    return challenges.slice(0, 3); // Top 3 challenges
  }
}

export default AdaptiveEngagementProfiler;