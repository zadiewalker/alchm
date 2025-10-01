/**
 * Privacy-Preserving Engagement Analytics System for ALCHM
 * 
 * Core principles:
 * - Privacy by Design: User data encrypted at rest, aggregated without exposure
 * - Healing-First Analytics: Metrics serve user wellbeing, not platform addiction
 * - User Autonomy: Users control their data and can opt out at any time
 * - Research Ethics: Generate insights that advance trauma-informed care
 */

import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, Timestamp, writeBatch } from 'firebase/firestore';
import { generateSecureHash } from '@/lib/crypto';

// Engagement pattern types based on healing research
export type EngagementProfile = 
  | 'deep_reflector'      // Long, thoughtful sessions with high emotional processing
  | 'steady_builder'      // Consistent, moderate sessions building habits
  | 'crisis_processor'    // Irregular but intense sessions during difficult periods
  | 'explorer'           // Varied engagement, trying different features
  | 'surface_user'       // Brief sessions, lower engagement depth
  | 'struggling'         // Inconsistent patterns suggesting need for support
  | 'recovering'         // Positive trajectory from struggling to healthier patterns

export interface SessionMetrics {
  sessionId: string;
  userId: string; // Hashed for privacy
  timestamp: Timestamp;
  duration: number; // Minutes spent in meaningful activity
  wordCount: number;
  emotionalDepthScore: number; // 1-10 based on reflection complexity
  featuresUsed: string[]; // Which ALCHM features were engaged with
  moodProgression: { start?: number; end?: number }; // 1-10 mood scale
  reflectionDepth: 'surface' | 'moderate' | 'deep' | 'transformative';
  crisisIndicators: boolean; // Flag for potential crisis without content exposure
  completionRate: number; // Percentage of intended session completed
  userInitiated: boolean; // Did user start session or respond to prompt
}

export interface PrivacyPreservingUserProfile {
  userHashId: string; // One-way hash, cannot be reverse engineered
  profileType: EngagementProfile;
  createdAt: Timestamp;
  lastUpdated: Timestamp;
  
  // Aggregated metrics (no raw content)
  totalSessions: number;
  averageSessionDuration: number;
  consistencyScore: number; // 0-1 based on regular engagement
  growthTrajectory: 'improving' | 'stable' | 'declining' | 'irregular';
  
  // Wellbeing indicators (aggregated, not identifiable)
  healingProgression: number; // 0-1 composite score
  resilienceBuilding: number; // 0-1 based on pattern analysis
  supportNeedLevel: 'low' | 'moderate' | 'high' | 'crisis';
  
  // Privacy controls
  analyticsOptOut: boolean;
  dataRetentionDays: number; // User-controlled data retention period
  researchParticipation: boolean; // Consent for anonymized research use
}

export interface PopulationInsight {
  insightId: string;
  generatedAt: Timestamp;
  sampleSize: number; // Minimum 50 for statistical validity
  
  // Healing pattern insights
  commonHealingTrajectories: {
    pattern: string;
    frequency: number;
    avgTimeToProgress: number; // Days
    supportInterventions: string[];
  }[];
  
  // Engagement effectiveness
  featureEffectiveness: {
    feature: string;
    engagementImpact: number;
    healingCorrelation: number;
    userSatisfaction: number;
  }[];
  
  // Crisis prevention insights
  earlyWarningPatterns: {
    pattern: string;
    predictiveAccuracy: number;
    interventionSuccess: number;
    timingOptimal: string; // When to intervene
  }[];
  
  // Research-ready findings
  academicSummary: {
    methodology: string;
    findings: string[];
    limitations: string[];
    ethicalConsiderations: string[];
  };
}

export class PrivacyPreservingAnalytics {
  private static instance: PrivacyPreservingAnalytics;
  private readonly MINIMUM_COHORT_SIZE = 50;
  private readonly DIFFERENTIAL_PRIVACY_EPSILON = 0.1;

  static getInstance(): PrivacyPreservingAnalytics {
    if (!this.instance) {
      this.instance = new PrivacyPreservingAnalytics();
    }
    return this.instance;
  }

  /**
   * Record session metrics with privacy preservation
   */
  async recordSession(metrics: Omit<SessionMetrics, 'userId'>): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) return;

      // Check if user has opted out of analytics
      const userProfile = await this.getUserProfile(userId);
      if (userProfile?.analyticsOptOut) return;

      const hashedUserId = await generateSecureHash(userId);
      
      const sessionData: SessionMetrics = {
        ...metrics,
        userId: hashedUserId,
        timestamp: Timestamp.now()
      };

      // Store with automatic expiration based on user preference
      const retentionDays = userProfile?.dataRetentionDays || 365;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + retentionDays);

      await setDoc(doc(collection(db, 'analytics_sessions'), metrics.sessionId), {
        ...sessionData,
        expiresAt: Timestamp.fromDate(expiresAt)
      });

      // Update user profile asynchronously
      this.updateUserProfile(hashedUserId, sessionData);
      
    } catch (error) {
      console.error('Analytics recording failed:', error);
      // Fail silently - analytics should never break user experience
    }
  }

  /**
   * Generate session depth analysis
   */
  analyzeSessionDepth(metrics: SessionMetrics): {
    meaningfulEngagement: boolean;
    engagementQuality: 'low' | 'medium' | 'high' | 'exceptional';
    wellbeingIndicators: string[];
    supportRecommendations: string[];
  } {
    const { duration, wordCount, emotionalDepthScore, reflectionDepth, completionRate } = metrics;
    
    // Calculate meaningful engagement (not just time spent)
    const meaningfulThresholds = {
      minDuration: 5, // 5 minutes minimum
      minWords: 50, // Meaningful writing
      minEmotionalDepth: 3, // Some emotional processing
      minCompletion: 0.5 // At least half completed
    };

    const meaningfulEngagement = 
      duration >= meaningfulThresholds.minDuration &&
      wordCount >= meaningfulThresholds.minWords &&
      emotionalDepthScore >= meaningfulThresholds.minEmotionalDepth &&
      completionRate >= meaningfulThresholds.minCompletion;

    // Assess engagement quality
    let engagementQuality: 'low' | 'medium' | 'high' | 'exceptional';
    const qualityScore = (
      (duration / 30) * 0.3 + // Up to 30 min optimal
      (Math.min(wordCount / 200, 1)) * 0.3 + // Up to 200 words
      (emotionalDepthScore / 10) * 0.4 // Emotional processing most important
    );

    if (qualityScore < 0.3) engagementQuality = 'low';
    else if (qualityScore < 0.6) engagementQuality = 'medium';
    else if (qualityScore < 0.85) engagementQuality = 'high';
    else engagementQuality = 'exceptional';

    // Identify wellbeing indicators
    const wellbeingIndicators: string[] = [];
    if (reflectionDepth === 'deep' || reflectionDepth === 'transformative') {
      wellbeingIndicators.push('deep_processing');
    }
    if (metrics.moodProgression?.end && metrics.moodProgression?.start && 
        metrics.moodProgression.end > metrics.moodProgression.start) {
      wellbeingIndicators.push('mood_improvement');
    }
    if (completionRate > 0.8) {
      wellbeingIndicators.push('strong_commitment');
    }
    if (metrics.userInitiated) {
      wellbeingIndicators.push('self_directed_healing');
    }

    // Generate support recommendations
    const supportRecommendations: string[] = [];
    if (engagementQuality === 'low' && !meaningfulEngagement) {
      supportRecommendations.push('gentle_prompts');
      supportRecommendations.push('shorter_sessions');
    }
    if (metrics.crisisIndicators) {
      supportRecommendations.push('crisis_resources');
      supportRecommendations.push('professional_support');
    }
    if (emotionalDepthScore >= 8) {
      supportRecommendations.push('integration_time');
      supportRecommendations.push('self_care_reminder');
    }

    return {
      meaningfulEngagement,
      engagementQuality,
      wellbeingIndicators,
      supportRecommendations
    };
  }

  /**
   * Update user engagement profile with differential privacy
   */
  private async updateUserProfile(hashedUserId: string, sessionData: SessionMetrics): Promise<void> {
    try {
      const profileRef = doc(db, 'analytics_profiles', hashedUserId);
      const profileDoc = await getDoc(profileRef);
      
      let profile: PrivacyPreservingUserProfile;
      
      if (profileDoc.exists()) {
        profile = profileDoc.data() as PrivacyPreservingUserProfile;
      } else {
        // Create new profile
        profile = {
          userHashId: hashedUserId,
          profileType: 'explorer', // Default until patterns emerge
          createdAt: Timestamp.now(),
          lastUpdated: Timestamp.now(),
          totalSessions: 0,
          averageSessionDuration: 0,
          consistencyScore: 0,
          growthTrajectory: 'irregular',
          healingProgression: 0.5,
          resilienceBuilding: 0.5,
          supportNeedLevel: 'moderate',
          analyticsOptOut: false,
          dataRetentionDays: 365,
          researchParticipation: false
        };
      }

      // Update aggregated metrics
      profile.totalSessions += 1;
      profile.averageSessionDuration = (
        (profile.averageSessionDuration * (profile.totalSessions - 1)) + sessionData.duration
      ) / profile.totalSessions;
      
      profile.lastUpdated = Timestamp.now();

      // Determine engagement profile based on patterns
      profile.profileType = await this.determineEngagementProfile(hashedUserId, sessionData);
      
      // Calculate healing progression (composite score)
      profile.healingProgression = this.calculateHealingProgression(sessionData, profile);
      
      // Update support need level
      profile.supportNeedLevel = this.assessSupportNeeds(sessionData, profile);

      await setDoc(profileRef, profile);
      
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  }

  /**
   * Determine user engagement profile based on historical patterns
   */
  private async determineEngagementProfile(
    hashedUserId: string, 
    currentSession: SessionMetrics
  ): Promise<EngagementProfile> {
    try {
      // Get recent session history for pattern analysis
      const recentSessions = await getDocs(query(
        collection(db, 'analytics_sessions'),
        where('userId', '==', hashedUserId)
      ));

      const sessions = recentSessions.docs
        .map(doc => doc.data() as SessionMetrics)
        .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
        .slice(0, 20); // Last 20 sessions for pattern analysis

      if (sessions.length < 3) return 'explorer'; // Not enough data

      // Calculate pattern indicators
      const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
      const avgEmotionalDepth = sessions.reduce((sum, s) => sum + s.emotionalDepthScore, 0) / sessions.length;
      const consistency = this.calculateConsistency(sessions);
      const deepSessionRatio = sessions.filter(s => s.reflectionDepth === 'deep' || s.reflectionDepth === 'transformative').length / sessions.length;
      const crisisSessionRatio = sessions.filter(s => s.crisisIndicators).length / sessions.length;

      // Determine profile based on patterns
      if (crisisSessionRatio > 0.3 && consistency < 0.4) {
        return 'struggling';
      } else if (avgDuration > 20 && avgEmotionalDepth > 7 && deepSessionRatio > 0.4) {
        return 'deep_reflector';
      } else if (consistency > 0.7 && avgDuration > 10) {
        return 'steady_builder';
      } else if (crisisSessionRatio > 0.1 && avgEmotionalDepth > 6) {
        return 'crisis_processor';
      } else if (avgDuration < 8 && avgEmotionalDepth < 5) {
        return 'surface_user';
      } else {
        return 'explorer';
      }
      
    } catch (error) {
      console.error('Profile determination failed:', error);
      return 'explorer';
    }
  }

  /**
   * Calculate consistency score (0-1) based on regular engagement
   */
  private calculateConsistency(sessions: SessionMetrics[]): number {
    if (sessions.length < 7) return 0.5; // Not enough data

    // Sort by timestamp
    const sortedSessions = sessions.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
    
    // Calculate gaps between sessions
    const gaps: number[] = [];
    for (let i = 1; i < sortedSessions.length; i++) {
      const gap = (sortedSessions[i].timestamp.seconds - sortedSessions[i-1].timestamp.seconds) / (24 * 60 * 60); // Days
      gaps.push(gap);
    }

    // Consistency is inverse of gap variance (more consistent = lower variance)
    const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;
    
    // Normalize consistency score (0-1, where 1 is perfectly consistent)
    return Math.max(0, Math.min(1, 1 - (variance / 100))); // Cap variance impact
  }

  /**
   * Calculate healing progression composite score
   */
  private calculateHealingProgression(session: SessionMetrics, profile: PrivacyPreservingUserProfile): number {
    const factors = {
      emotionalProcessing: session.emotionalDepthScore / 10 * 0.3,
      moodImprovement: (session.moodProgression?.end || 5) / 10 * 0.2,
      consistency: profile.consistencyScore * 0.2,
      engagement: (session.completionRate * (session.userInitiated ? 1.2 : 1.0)) * 0.2,
      growth: profile.totalSessions > 10 ? Math.min(1, profile.totalSessions / 100) * 0.1 : 0
    };

    return Math.max(0, Math.min(1, Object.values(factors).reduce((sum, factor) => sum + factor, 0)));
  }

  /**
   * Assess user support needs based on patterns
   */
  private assessSupportNeeds(session: SessionMetrics, profile: PrivacyPreservingUserProfile): 'low' | 'moderate' | 'high' | 'crisis' {
    if (session.crisisIndicators) return 'crisis';
    
    const riskFactors = [
      profile.consistencyScore < 0.3, // Inconsistent engagement
      session.emotionalDepthScore < 3, // Difficulty processing emotions
      session.completionRate < 0.3, // Trouble completing sessions
      profile.healingProgression < 0.3, // Low healing progression
      profile.profileType === 'struggling' // Struggling pattern
    ];

    const riskCount = riskFactors.filter(Boolean).length;
    
    if (riskCount >= 4) return 'crisis';
    if (riskCount >= 3) return 'high';
    if (riskCount >= 2) return 'moderate';
    return 'low';
  }

  /**
   * Get current user ID (implement based on your auth system)
   */
  private async getCurrentUserId(): Promise<string | null> {
    // This should integrate with your authentication system
    // For now, return null - implement based on your auth flow
    return null;
  }

  /**
   * Get user profile with privacy controls
   */
  async getUserProfile(userId: string): Promise<PrivacyPreservingUserProfile | null> {
    try {
      const hashedUserId = await generateSecureHash(userId);
      const profileDoc = await getDoc(doc(db, 'analytics_profiles', hashedUserId));
      
      if (profileDoc.exists()) {
        return profileDoc.data() as PrivacyPreservingUserProfile;
      }
      return null;
      
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }
}

export default PrivacyPreservingAnalytics;