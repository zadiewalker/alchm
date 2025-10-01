/**
 * ALCHM Gamification Analytics
 * Tracks user engagement and gamification metrics with privacy-first design
 */

import { db } from '@/lib/firebase';
import { collection, doc, setDoc, updateDoc, increment, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// Analytics Event Types
export type GamificationEventType = 
  | 'streak_started'
  | 'streak_continued' 
  | 'streak_recovered'
  | 'streak_broken'
  | 'badge_earned'
  | 'quest_started'
  | 'quest_completed'
  | 'quest_abandoned'
  | 'challenge_joined'
  | 'challenge_completed'
  | 'referral_sent'
  | 'referral_accepted'
  | 'level_up'
  | 'milestone_reached'
  | 'engagement_peak'
  | 'engagement_drop';

// Event Metadata Interfaces
interface StreakEventMetadata {
  currentStreak: number;
  longestStreak: number;
  graceTokensUsed?: number;
  recoveryMultiplier?: number;
}

interface BadgeEventMetadata {
  badgeId: string;
  badgeCategory: string;
  badgeRarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlockedAfterDays: number;
}

interface QuestEventMetadata {
  questId: string;
  questType: 'reflection' | 'habit' | 'exploration' | 'challenge';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completionRate?: number;
  timeToComplete?: number;
}

interface EngagementMetadata {
  sessionLength: number;
  featuresUsed: string[];
  moodImprovement?: number;
  crisisPreventionTriggered?: boolean;
}

// Core Analytics Class
export class GamificationAnalytics {
  private userId: string;
  
  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Track gamification event with metadata
   */
  async trackEvent(
    eventType: GamificationEventType,
    metadata: Record<string, any> = {},
    userTier: string = 'free'
  ): Promise<void> {
    try {
      // Create event typeof window !== 'undefined' && document
      const eventData = {
        userId: this.userId,
        eventType,
        timestamp: serverTimestamp(),
        metadata: {
          ...metadata,
          userTier,
          source: 'gamification_system',
          version: '1.0'
        }
      };

      // Store in user's events collection
      const eventRef = doc(collection(db, `users/${this.userId}/gamification_events`));
      await setDoc(eventRef, eventData);

      // Update aggregate metrics
      await this.updateAggregateMetrics(eventType, metadata, userTier);

      // Check for engagement milestones
      await this.checkEngagementMilestones(eventType, metadata);

    } catch (error) {
      console.error('Error tracking gamification event:', error);
      // Don't throw to avoid breaking user experience
    }
  }

  /**
   * Update real-time engagement metrics
   */
  private async updateAggregateMetrics(
    eventType: GamificationEventType,
    metadata: Record<string, any>,
    userTier: string
  ): Promise<void> {
    const userStatsRef = doc(db, `users/${this.userId}/stats/gamification`);
    
    const updates: Record<string, any> = {
      lastActivityAt: serverTimestamp(),
      totalEvents: increment(1),
      [`events.${eventType}`]: increment(1),
      userTier
    };

    // Event-specific metric updates
    switch (eventType) {
      case 'streak_continued':
        updates.currentStreak = metadata.currentStreak || 0;
        updates.totalStreakDays = increment(1);
        if (metadata.currentStreak > (metadata.longestStreak || 0)) {
          updates.longestStreak = metadata.currentStreak;
        }
        break;
        
      case 'badge_earned':
        updates.totalBadges = increment(1);
        updates[`badgesByCategory.${metadata.badgeCategory}`] = increment(1);
        updates[`badgesByRarity.${metadata.badgeRarity}`] = increment(1);
        break;
        
      case 'quest_completed':
        updates.totalQuestsCompleted = increment(1);
        updates[`questsByType.${metadata.questType}`] = increment(1);
        updates[`questsByDifficulty.${metadata.difficulty}`] = increment(1);
        if (metadata.timeToComplete) {
          updates.averageQuestCompletionTime = metadata.timeToComplete;
        }
        break;
        
      case 'level_up':
        updates.currentLevel = metadata.newLevel || 0;
        updates.totalXP = metadata.totalXP || 0;
        break;
    }

    await updateDoc(userStatsRef, updates);
  }

  /**
   * Check for and trigger engagement milestone events
   */
  private async checkEngagementMilestones(
    eventType: GamificationEventType,
    metadata: Record<string, any>
  ): Promise<void> {
    // Get current user stats
    const userStatsRef = doc(db, `users/${this.userId}/stats/gamification`);
    const statsDoc = await getDocs(query(collection(db, `users/${this.userId}/stats`), limit(1)));
    
    if (statsDoc.empty) return;
    
    const stats = statsDoc.docs[0]?.data();
    
    if (!stats) return;
    
    // Check for milestone achievements
    const milestones = [
      { type: 'first_week_streak', threshold: 7, field: 'currentStreak' },
      { type: 'first_month_streak', threshold: 30, field: 'currentStreak' },
      { type: 'badge_collector', threshold: 10, field: 'totalBadges' },
      { type: 'quest_master', threshold: 25, field: 'totalQuestsCompleted' },
      { type: 'engagement_champion', threshold: 100, field: 'totalEvents' }
    ];

    for (const milestone of milestones) {
      const currentValue = stats[milestone.field] || 0;
      if (currentValue === milestone.threshold) {
        await this.trackEvent('milestone_reached', {
          milestoneType: milestone.type,
          milestoneValue: milestone.threshold,
          achievedAfterDays: Math.ceil((Date.now() - stats.createdAt?.toDate?.()?.getTime() || 0) / (1000 * 60 * 60 * 24))
        });
      }
    }
  }

  /**
   * Get user engagement insights
   */
  async getEngagementInsights(days: number = 30): Promise<{
    totalEvents: number;
    streakMetrics: {
      current: number;
      longest: number;
      consistency: number;
    };
    progressMetrics: {
      badgesEarned: number;
      questsCompleted: number;
      currentLevel: number;
      totalXP: number;
    };
    engagementLevel: 'low' | 'moderate' | 'high' | 'exceptional';
    trendAnalysis: {
      direction: 'increasing' | 'stable' | 'decreasing';
      confidence: number;
    };
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Get recent events
      const eventsQuery = query(
        collection(db, `users/${this.userId}/gamification_events`),
        where('timestamp', '>=', cutoffDate),
        orderBy('timestamp', 'desc'),
        limit(1000)
      );
      const eventsSnap = await getDocs(eventsQuery);
      const events = eventsSnap.docs.map(doc => doc.data());

      // Get current stats
      const statsQuery = query(
        collection(db, `users/${this.userId}/stats`),
        limit(1)
      );
      const statsSnap = await getDocs(statsQuery);
      const stats = statsSnap.empty ? {} : statsSnap.docs[0]?.data() || {};

      // Calculate metrics
      const totalEvents = events.length;
      const streakEvents = events.filter(e => e.eventType.includes('streak'));
      const badgeEvents = events.filter(e => e.eventType === 'badge_earned');
      const questEvents = events.filter(e => e.eventType === 'quest_completed');

      const streakMetrics = {
        current: stats.currentStreak || 0,
        longest: stats.longestStreak || 0,
        consistency: Math.min((stats.totalStreakDays || 0) / days, 1) * 100
      };

      const progressMetrics = {
        badgesEarned: stats.totalBadges || 0,
        questsCompleted: stats.totalQuestsCompleted || 0,
        currentLevel: stats.currentLevel || 1,
        totalXP: stats.totalXP || 0
      };

      // Calculate engagement level
      const engagementScore = this.calculateEngagementScore({
        eventsPerDay: totalEvents / days,
        streakConsistency: streakMetrics.consistency,
        progressRate: (badgeEvents.length + questEvents.length) / days,
        currentStreak: streakMetrics.current
      });

      const engagementLevel = 
        engagementScore >= 80 ? 'exceptional' :
        engagementScore >= 60 ? 'high' :
        engagementScore >= 40 ? 'moderate' : 'low';

      // Analyze trend
      const recentEvents = events.slice(0, Math.floor(events.length / 2));
      const olderEvents = events.slice(Math.floor(events.length / 2));
      const recentScore = this.calculateEngagementScore({
        eventsPerDay: recentEvents.length / (days / 2),
        streakConsistency: streakMetrics.consistency,
        progressRate: recentEvents.filter(e => ['badge_earned', 'quest_completed'].includes(e.eventType)).length / (days / 2),
        currentStreak: streakMetrics.current
      });
      const olderScore = this.calculateEngagementScore({
        eventsPerDay: olderEvents.length / (days / 2),
        streakConsistency: streakMetrics.consistency,
        progressRate: olderEvents.filter(e => ['badge_earned', 'quest_completed'].includes(e.eventType)).length / (days / 2),
        currentStreak: streakMetrics.current
      });

      const trendDelta = recentScore - olderScore;
      const trendAnalysis = {
        direction: trendDelta > 5 ? 'increasing' as const : 
                  trendDelta < -5 ? 'decreasing' as const : 'stable' as const,
        confidence: Math.min(Math.abs(trendDelta) / 20, 1)
      };

      return {
        totalEvents,
        streakMetrics,
        progressMetrics,
        engagementLevel,
        trendAnalysis
      };

    } catch (error) {
      console.error('Error getting engagement insights:', error);
      
      // Return default insights
      return {
        totalEvents: 0,
        streakMetrics: { current: 0, longest: 0, consistency: 0 },
        progressMetrics: { badgesEarned: 0, questsCompleted: 0, currentLevel: 1, totalXP: 0 },
        engagementLevel: 'low',
        trendAnalysis: { direction: 'stable', confidence: 0 }
      };
    }
  }

  /**
   * Calculate composite engagement score
   */
  private calculateEngagementScore(metrics: {
    eventsPerDay: number;
    streakConsistency: number;
    progressRate: number;
    currentStreak: number;
  }): number {
    const weights = {
      activity: 0.3,      // Events per day
      consistency: 0.4,   // Streak consistency
      progress: 0.2,      // Badges/quests rate
      momentum: 0.1       // Current streak
    };

    const scores = {
      activity: Math.min(metrics.eventsPerDay * 20, 100),
      consistency: metrics.streakConsistency,
      progress: Math.min(metrics.progressRate * 50, 100),
      momentum: Math.min(metrics.currentStreak * 3, 100)
    };

    return Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (scores[key as keyof typeof scores] * weight);
    }, 0);
  }

  /**
   * Export analytics data for user (GDPR compliance)
   */
  async exportUserData(): Promise<{
    gamificationEvents: any[];
    aggregateStats: any;
    engagementInsights: any;
  }> {
    try {
      // Get all gamification events
      const eventsQuery = query(
        collection(db, `users/${this.userId}/gamification_events`),
        orderBy('timestamp', 'desc')
      );
      const eventsSnap = await getDocs(eventsQuery);
      const events = eventsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get aggregate stats
      const statsQuery = query(
        collection(db, `users/${this.userId}/stats`),
        limit(1)
      );
      const statsSnap = await getDocs(statsQuery);
      const stats = statsSnap.empty ? {} : statsSnap.docs[0]?.data() || {};

      // Get engagement insights
      const insights = await this.getEngagementInsights();

      return {
        gamificationEvents: events,
        aggregateStats: stats,
        engagementInsights: insights
      };

    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }
}

// Convenience functions for common tracking scenarios

export const trackStreakEvent = async (
  userId: string,
  eventType: 'streak_started' | 'streak_continued' | 'streak_recovered' | 'streak_broken',
  metadata: StreakEventMetadata,
  userTier?: string
) => {
  const analytics = new GamificationAnalytics(userId);
  await analytics.trackEvent(eventType, metadata, userTier);
};

export const trackBadgeEarned = async (
  userId: string,
  metadata: BadgeEventMetadata,
  userTier?: string
) => {
  const analytics = new GamificationAnalytics(userId);
  await analytics.trackEvent('badge_earned', metadata, userTier);
};

export const trackQuestEvent = async (
  userId: string,
  eventType: 'quest_started' | 'quest_completed' | 'quest_abandoned',
  metadata: QuestEventMetadata,
  userTier?: string
) => {
  const analytics = new GamificationAnalytics(userId);
  await analytics.trackEvent(eventType, metadata, userTier);
};

export const trackEngagementEvent = async (
  userId: string,
  eventType: 'engagement_peak' | 'engagement_drop',
  metadata: EngagementMetadata,
  userTier?: string
) => {
  const analytics = new GamificationAnalytics(userId);
  await analytics.trackEvent(eventType, metadata, userTier);
};