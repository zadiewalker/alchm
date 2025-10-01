/**
 * FIREBASE INTEGRATION FOR EMOTIONAL LEARNING SYSTEM
 * "Duolingo for Emotions" - Backend Integration
 * 
 * Seamlessly integrates the emotional learning gamification system with
 * ALCHM's existing Firebase infrastructure, maintaining trauma-informed
 * privacy and security while enabling real-time progress tracking.
 */

import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase';

import type {
  EmotionalLearningProgress,
  EmotionalSkillTree,
  EmotionalLesson,
  EmotionalCompetency
} from './emotional-skill-tree';
import type {
  HealingBadge,
  BadgeUnlockTrigger,
  BadgeCategory
} from './badge-ecosystem';
import type {
  LearningPersonalization,
  LearningRecommendation,
  AdaptedLessonContent,
  HealingLearningAnalytics
} from './adaptive-learning-engine';
import type {
  ExerciseResponse,
  ExerciseAnalytics
} from './interactive-exercises';
import type {
  AnonymousIdentity,
  WisdomCircle,
  SupportCircle,
  HealingChallenge
} from './community-learning';

// Firebase Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  EMOTIONAL_LEARNING: 'emotionalLearning',
  EMOTIONAL_PROGRESS: 'emotionalProgress',
  LESSON_COMPLETIONS: 'lessonCompletions',
  EXERCISE_RESPONSES: 'exerciseResponses',
  HEALING_BADGES: 'healingBadges',
  LEARNING_ANALYTICS: 'learningAnalytics',
  PERSONALIZATION: 'learningPersonalization',
  COMMUNITY_CIRCLES: 'communityCircles',
  WISDOM_SHARES: 'wisdomShares',
  HEALING_CHALLENGES: 'healingChallenges',
  ANONYMOUS_IDENTITIES: 'anonymousIdentities'
} as const;

// Firebase Cloud Functions
const cloudFunctions = {
  processLessonCompletion: httpsCallable(functions, 'processLessonCompletion'),
  updateLearningProgress: httpsCallable(functions, 'updateLearningProgress'),
  checkBadgeUnlocks: httpsCallable(functions, 'checkEmotionalBadgeUnlocks'),
  generateRecommendations: httpsCallable(functions, 'generateLearningRecommendations'),
  updatePersonalization: httpsCallable(functions, 'updateLearningPersonalization'),
  createAnonymousIdentity: httpsCallable(functions, 'createAnonymousIdentity'),
  joinHealingChallenge: httpsCallable(functions, 'joinHealingChallenge'),
  shareWisdom: httpsCallable(functions, 'shareWisdomAnonymously'),
  reportContent: httpsCallable(functions, 'reportCommunityContent'),
  analyzeEmotionalPatterns: httpsCallable(functions, 'analyzeEmotionalPatterns')
};

/**
 * EMOTIONAL LEARNING PROGRESS SERVICE
 */
export class EmotionalLearningService {
  /**
   * Get user's complete emotional learning progress
   */
  static async getUserProgress(userId: string): Promise<EmotionalLearningProgress | null> {
    try {
      const progressDoc = await getDoc(
        doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.EMOTIONAL_PROGRESS, 'current')
      );
      
      if (!progressDoc.exists()) {
        // Initialize progress for new user
        return await this.initializeUserProgress(userId);
      }
      
      return progressDoc.data() as EmotionalLearningProgress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  /**
   * Initialize emotional learning progress for new user
   */
  static async initializeUserProgress(userId: string): Promise<EmotionalLearningProgress> {
    const initialProgress: EmotionalLearningProgress = {
      userId,
      lastUpdated: Timestamp.now(),
      totalLessonsCompleted: 0,
      totalSkillsLearned: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageSessionTime: 0,
      treeProgress: {
        emotional_awareness: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 10,
          masteryScore: 0,
          lastPracticed: Timestamp.now(),
          strugglingAreas: [],
          strengthAreas: []
        },
        self_regulation: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 12,
          masteryScore: 0,
          lastPracticed: Timestamp.now(),
          strugglingAreas: [],
          strengthAreas: []
        },
        social_awareness: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 8,
          masteryScore: 0,
          lastPracticed: Timestamp.now(),
          strugglingAreas: [],
          strengthAreas: []
        },
        relationship_skills: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 15,
          masteryScore: 0,
          lastPracticed: Timestamp.now(),
          strugglingAreas: [],
          strengthAreas: []
        },
        responsible_decision_making: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 10,
          masteryScore: 0,
          lastPracticed: Timestamp.now(),
          strugglingAreas: [],
          strengthAreas: []
        },
        trauma_healing: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 20,
          masteryScore: 0,
          lastPracticed: Timestamp.now(),
          strugglingAreas: [],
          strengthAreas: []
        },
        boundary_setting: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 12,
          masteryScore: 0,
          lastPracticed: Timestamp.now(),
          strugglingAreas: [],
          strengthAreas: []
        },
        self_compassion: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 14,
          masteryScore: 0,
          lastPracticed: Timestamp.now(),
          strugglingAreas: [],
          strengthAreas: []
        }
      },
      learningStyle: {
        prefersVisual: false,
        prefersAudio: false,
        prefersKinesthetic: false,
        prefersReflection: true,
        needsMorePractice: false,
        respondsToCelebration: true
      },
      graceTokensUsed: 0,
      healingPausesRequested: 0,
      selfCompassionMoments: 0,
      boundaryPractices: 0,
      emotionalBreakthroughs: 0,
      traumaHealingProgress: 0,
      emotionalTriggers: [],
      copingPreferences: [],
      supportNeeds: [],
      celebrationStyle: 'warm',
      skillsAppliedInLife: {}
    };

    await setDoc(
      doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.EMOTIONAL_PROGRESS, 'current'),
      initialProgress
    );

    return initialProgress;
  }

  /**
   * Update user's learning progress after lesson completion
   */
  static async updateProgress(
    userId: string,
    lessonId: string,
    competency: EmotionalCompetency,
    completionData: {
      timeSpent: number;
      exercisesCompleted: number;
      insightsGenerated: string[];
      realWorldApplications: string[];
      emotionalGrowth: any;
    }
  ): Promise<void> {
    try {
      await cloudFunctions.updateLearningProgress({
        userId,
        lessonId,
        competency,
        completionData,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating learning progress:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time progress updates
   */
  static subscribeToProgress(
    userId: string,
    callback: (progress: EmotionalLearningProgress | null) => void
  ): () => void {
    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.EMOTIONAL_PROGRESS, 'current'),
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as EmotionalLearningProgress);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error listening to progress updates:', error);
        callback(null);
      }
    );

    return unsubscribe;
  }
}

/**
 * HEALING BADGE SERVICE
 */
export class HealingBadgeService {
  /**
   * Get user's earned badges
   */
  static async getUserBadges(userId: string): Promise<HealingBadge[]> {
    try {
      const badgesQuery = query(
        collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.HEALING_BADGES),
        orderBy('earnedAt', 'desc')
      );
      
      const snapshot = await getDocs(badgesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealingBadge));
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  }

  /**
   * Check for badge unlocks based on recent actions
   */
  static async checkBadgeUnlocks(
    userId: string,
    triggers: BadgeUnlockTrigger[],
    context: any
  ): Promise<HealingBadge[]> {
    try {
      const result = await cloudFunctions.checkBadgeUnlocks({
        userId,
        triggers,
        context,
        timestamp: serverTimestamp()
      });
      
      return result.data.unlockedBadges || [];
    } catch (error) {
      console.error('Error checking badge unlocks:', error);
      return [];
    }
  }

  /**
   * Award a badge to user with celebration
   */
  static async awardBadge(
    userId: string,
    badge: HealingBadge,
    context: {
      triggerAction: string;
      celebrationStyle: 'subtle' | 'warm' | 'joyful';
      personalizedMessage?: string;
    }
  ): Promise<void> {
    try {
      const badgeWithTimestamp = {
        ...badge,
        earnedAt: serverTimestamp(),
        context
      };

      await setDoc(
        doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.HEALING_BADGES, badge.id),
        badgeWithTimestamp
      );

      // Trigger celebration in UI (this would be handled by real-time listeners)
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }

  /**
   * Subscribe to badge updates
   */
  static subscribeToBadges(
    userId: string,
    callback: (badges: HealingBadge[]) => void
  ): () => void {
    const unsubscribe = onSnapshot(
      query(
        collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.HEALING_BADGES),
        orderBy('earnedAt', 'desc'),
        limit(50)
      ),
      (snapshot) => {
        const badges = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as HealingBadge));
        callback(badges);
      },
      (error) => {
        console.error('Error listening to badge updates:', error);
        callback([]);
      }
    );

    return unsubscribe;
  }
}

/**
 * ADAPTIVE LEARNING SERVICE
 */
export class AdaptiveLearningService {
  /**
   * Get user's learning personalization profile
   */
  static async getPersonalization(userId: string): Promise<LearningPersonalization | null> {
    try {
      const personalizationDoc = await getDoc(
        doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.PERSONALIZATION, 'current')
      );
      
      if (!personalizationDoc.exists()) {
        return await this.initializePersonalization(userId);
      }
      
      return personalizationDoc.data() as LearningPersonalization;
    } catch (error) {
      console.error('Error getting personalization:', error);
      return null;
    }
  }

  /**
   * Initialize personalization profile for new user
   */
  static async initializePersonalization(userId: string): Promise<LearningPersonalization> {
    const initialPersonalization: LearningPersonalization = {
      userId,
      lastUpdated: Timestamp.now(),
      emotionalPatterns: {
        dominantEmotions: [],
        emotionalTriggers: [],
        regulationStrengths: [],
        regulationChallenges: [],
        traumaResponsePatterns: [],
        healingResilience: 50
      },
      learningStyle: {
        cognitivePreferences: {
          visual: 50,
          auditory: 50,
          kinesthetic: 50,
          reading: 50
        },
        emotionalProcessing: {
          needsTime: false,
          prefersGentle: true,
          respondsToStories: false,
          needsFrequentBreaks: false
        },
        practicePreferences: {
          likesReflection: true,
          prefersPractical: false,
          needsRepetition: false,
          respondsToEncouragement: true
        }
      },
      traumaAdaptations: {
        anxietyTriggers: [],
        panicTriggers: [],
        dissociationRisk: false,
        needsExtraChoice: false,
        requiresSlowPace: false,
        benefitsFromSomaticWork: false
      },
      currentContext: {
        overallWellbeing: 70,
        stressLevel: 30,
        crisisRisk: false,
        recentTrauma: false,
        supportSystemStrength: 60,
        motivationLevel: 70
      },
      learningMetrics: {
        retentionRate: 0,
        transferRate: 0,
        engagementQuality: 0,
        skillApplication: 0,
        healingProgress: 0
      }
    };

    await setDoc(
      doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.PERSONALIZATION, 'current'),
      initialPersonalization
    );

    return initialPersonalization;
  }

  /**
   * Update personalization based on learning analytics
   */
  static async updatePersonalization(
    userId: string,
    updates: Partial<LearningPersonalization>
  ): Promise<void> {
    try {
      await cloudFunctions.updatePersonalization({
        userId,
        updates,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating personalization:', error);
      throw error;
    }
  }

  /**
   * Generate personalized learning recommendations
   */
  static async getRecommendations(
    userId: string,
    currentContext?: any
  ): Promise<LearningRecommendation[]> {
    try {
      const result = await cloudFunctions.generateRecommendations({
        userId,
        currentContext,
        timestamp: serverTimestamp()
      });
      
      return result.data.recommendations || [];
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }
}

/**
 * EXERCISE TRACKING SERVICE
 */
export class ExerciseTrackingService {
  /**
   * Record exercise response and get immediate feedback
   */
  static async recordExerciseResponse(
    userId: string,
    exerciseResponse: ExerciseResponse
  ): Promise<{
    feedback: any;
    badgesUnlocked: HealingBadge[];
    progressUpdated: boolean;
  }> {
    try {
      // Store the response
      await setDoc(
        doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.EXERCISE_RESPONSES, exerciseResponse.sessionId),
        {
          ...exerciseResponse,
          timestamp: serverTimestamp()
        }
      );

      // Process the response through Cloud Function for feedback and progress updates
      const result = await cloudFunctions.processLessonCompletion({
        userId,
        exerciseResponse,
        timestamp: serverTimestamp()
      });

      return result.data;
    } catch (error) {
      console.error('Error recording exercise response:', error);
      throw error;
    }
  }

  /**
   * Get user's exercise analytics
   */
  static async getUserExerciseAnalytics(userId: string): Promise<ExerciseAnalytics | null> {
    try {
      const analyticsDoc = await getDoc(
        doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.LEARNING_ANALYTICS, 'exercises')
      );
      
      return analyticsDoc.exists() ? analyticsDoc.data() as ExerciseAnalytics : null;
    } catch (error) {
      console.error('Error getting exercise analytics:', error);
      return null;
    }
  }
}

/**
 * COMMUNITY LEARNING SERVICE
 */
export class CommunityLearningService {
  /**
   * Get or create anonymous identity for user
   */
  static async getAnonymousIdentity(userId: string): Promise<AnonymousIdentity | null> {
    try {
      const result = await cloudFunctions.createAnonymousIdentity({
        userId,
        timestamp: serverTimestamp()
      });
      
      return result.data.identity || null;
    } catch (error) {
      console.error('Error getting anonymous identity:', error);
      return null;
    }
  }

  /**
   * Get available wisdom circles
   */
  static async getWisdomCircles(
    competency?: EmotionalCompetency,
    limit?: number
  ): Promise<WisdomCircle[]> {
    try {
      let circlesQuery = query(
        collection(db, COLLECTIONS.COMMUNITY_CIRCLES),
        where('type', '==', 'wisdom_circle'),
        orderBy('createdAt', 'desc')
      );

      if (competency) {
        circlesQuery = query(circlesQuery, where('focusCompetency', '==', competency));
      }

      if (limit) {
        circlesQuery = query(circlesQuery, limitConstraint(limit));
      }

      const snapshot = await getDocs(circlesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WisdomCircle));
    } catch (error) {
      console.error('Error getting wisdom circles:', error);
      return [];
    }
  }

  /**
   * Share wisdom anonymously in a circle
   */
  static async shareWisdom(
    userId: string,
    circleId: string,
    wisdom: {
      insight: string;
      realWorldContext?: string;
      strugglesAcknowledged?: string;
      growthRecognized?: string;
    }
  ): Promise<void> {
    try {
      await cloudFunctions.shareWisdom({
        userId,
        circleId,
        wisdom,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sharing wisdom:', error);
      throw error;
    }
  }

  /**
   * Join a healing challenge
   */
  static async joinHealingChallenge(
    userId: string,
    challengeId: string,
    participationLevel: 'observer' | 'participant' | 'encourager'
  ): Promise<void> {
    try {
      await cloudFunctions.joinHealingChallenge({
        userId,
        challengeId,
        participationLevel,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error joining healing challenge:', error);
      throw error;
    }
  }

  /**
   * Report inappropriate content
   */
  static async reportContent(
    userId: string,
    contentId: string,
    contentType: 'wisdom_share' | 'support_request' | 'encouragement',
    reason: string
  ): Promise<void> {
    try {
      await cloudFunctions.reportContent({
        reporterId: userId,
        contentId,
        contentType,
        reason,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error reporting content:', error);
      throw error;
    }
  }

  /**
   * Subscribe to community circle updates
   */
  static subscribeToCircle(
    circleId: string,
    callback: (circle: WisdomCircle | SupportCircle | null) => void
  ): () => void {
    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS.COMMUNITY_CIRCLES, circleId),
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() } as WisdomCircle | SupportCircle);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error listening to circle updates:', error);
        callback(null);
      }
    );

    return unsubscribe;
  }
}

/**
 * ANALYTICS SERVICE
 */
export class LearningAnalyticsService {
  /**
   * Track learning event for analytics
   */
  static async trackLearningEvent(
    userId: string,
    eventType: string,
    eventData: any
  ): Promise<void> {
    try {
      await setDoc(
        doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.LEARNING_ANALYTICS, 'events', `${Date.now()}`),
        {
          userId,
          eventType,
          eventData,
          timestamp: serverTimestamp()
        }
      );
    } catch (error) {
      console.error('Error tracking learning event:', error);
      // Don't throw - analytics shouldn't break user experience
    }
  }

  /**
   * Analyze emotional patterns from journal data and learning interactions
   */
  static async analyzeEmotionalPatterns(userId: string): Promise<any> {
    try {
      const result = await cloudFunctions.analyzeEmotionalPatterns({
        userId,
        timestamp: serverTimestamp()
      });
      
      return result.data.patterns || {};
    } catch (error) {
      console.error('Error analyzing emotional patterns:', error);
      return {};
    }
  }
}

/**
 * INTEGRATION HOOKS FOR EXISTING ALCHM SYSTEMS
 */
export class ALCHMIntegrationService {
  /**
   * Sync emotional learning progress with existing journal insights
   */
  static async syncWithJournalInsights(
    userId: string,
    journalData: any
  ): Promise<void> {
    try {
      // Extract emotional competencies demonstrated in journal
      const competenciesShown = this.extractCompetenciesFromJournal(journalData);
      
      // Update learning progress based on journal insights
      if (competenciesShown.length > 0) {
        await EmotionalLearningService.updateProgress(
          userId,
          'journal_integration',
          competenciesShown[0], // Primary competency
          {
            timeSpent: 0, // Journal time tracked separately
            exercisesCompleted: 0,
            insightsGenerated: journalData.insights || [],
            realWorldApplications: [],
            emotionalGrowth: {
              journalIntegration: true,
              emotionalDepth: journalData.emotionalDepth || 0,
              selfAwareness: journalData.selfAwareness || 0
            }
          }
        );
      }

      // Check for badge unlocks based on journal content
      const triggers = this.identifyBadgeTriggersFromJournal(journalData);
      if (triggers.length > 0) {
        await HealingBadgeService.checkBadgeUnlocks(userId, triggers, { journalData });
      }
    } catch (error) {
      console.error('Error syncing with journal insights:', error);
    }
  }

  /**
   * Update gamification state with emotional learning progress
   */
  static async updateGamificationState(
    userId: string,
    learningProgress: EmotionalLearningProgress
  ): Promise<void> {
    try {
      // This would integrate with existing ALCHM gamification system
      // Update XP, streaks, and other gamification elements
    } catch (error) {
      console.error('Error updating gamification state:', error);
    }
  }

  /**
   * Extract emotional competencies from journal content
   */
  private static extractCompetenciesFromJournal(journalData: any): EmotionalCompetency[] {
    const competencies: EmotionalCompetency[] = [];
    
    // Analyze journal content for emotional competencies
    // This would use NLP or keyword analysis
    
    return competencies;
  }

  /**
   * Identify badge triggers from journal content
   */
  private static identifyBadgeTriggersFromJournal(journalData: any): BadgeUnlockTrigger[] {
    const triggers: BadgeUnlockTrigger[] = [];
    
    // Analyze journal for badge-worthy moments
    if (journalData.showedVulnerability) {
      triggers.push('vulnerability_shared_safely');
    }
    
    if (journalData.practicedselfCompassion) {
      triggers.push('self_compassion_chosen_over_self_criticism');
    }
    
    return triggers;
  }
}

// Helper function for limit constraint (Firebase v9+)
const limitConstraint = limit;

// Export all services
export {
  EmotionalLearningService,
  HealingBadgeService,
  AdaptiveLearningService,
  ExerciseTrackingService,
  CommunityLearningService,
  LearningAnalyticsService,
  ALCHMIntegrationService,
  cloudFunctions
};