'use client';

/**
 * REVOLUTIONARY HEALING GAMIFICATION HOOK
 * "Your worth isn't measured by metrics. Your healing is honored by presence."
 * 
 * This hook integrates all revolutionary gamification systems:
 * - Grace Token Revolutionary System
 * - Presence Over Performance Metrics
 * - Organic Badge Trees
 * - Mutual Support Community
 * - Anti-Shame Celebration System
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';

// Revolutionary Systems
import { GraceTokenSystem, PresenceMetricSystem, AntiShameSystem } from '@/lib/gamification/grace-token-revolution';
import { OrganicBadgeSystem, REVOLUTIONARY_BADGE_TREES } from '@/lib/gamification/organic-badge-trees';
import { MutualSupportCommunitySystem } from '@/lib/gamification/mutual-support-community';
import { PresenceOverPerformanceSystem } from '@/lib/gamification/presence-over-performance';

import type { 
  GraceTokenState, 
  PresenceMetrics, 
  AntiShameSystem as AntiShameSystemType,
  WisdomAccumulation,
  SelfCompassionTracking,
  HealingMomentum,
  AuthenticityMoments,
  GentlePowerLevel,
  PresenceQualityMetrics
} from '@/lib/gamification/presence-over-performance';

import type { Badge, Streak, UserProfile, Challenge, Season } from '@/types/gamification';
import type { OrganicBadgeTree, MutualSupportChallenge, HealingSeason } from '@/lib/gamification/organic-badge-trees';

export interface HealingGamificationState {
  // Core Revolutionary Systems
  graceTokens: GraceTokenState | null;
  presenceMetrics: PresenceMetrics | null;
  antiShameSystem: AntiShameSystemType | null;
  
  // Advanced Presence Tracking
  presenceQuality: PresenceQualityMetrics | null;
  wisdomAccumulation: WisdomAccumulation | null;
  selfCompassionTracking: SelfCompassionTracking | null;
  healingMomentum: HealingMomentum | null;
  authenticityMoments: AuthenticityMoments | null;
  gentlePowerLevel: GentlePowerLevel | null;
  
  // Badge System
  earnedBadges: Badge[];
  availableTrees: Record<string, OrganicBadgeTree>;
  nextBadgeOpportunities: Badge[];
  
  // Community System
  activeChallenges: MutualSupportChallenge[];
  currentSeason: HealingSeason | null;
  communitySupport: {
    encouragementReceived: string[];
    wisdomShared: number;
    mutualSupportGiven: number;
  };
  
  // User Preferences
  preferences: {
    celebrationStyle: 'subtle' | 'warm' | 'joyful';
    visualComplexity: 'minimal' | 'balanced' | 'rich';
    sageGreenIntensity: 'whisper' | 'embrace' | 'radiance';
    traumaInformedSettings: {
      anxietyTriggers: boolean;
      perfectionismTriggers: boolean;
      needsExtraGrace: boolean;
      prefersCollectiveProgress: boolean;
    };
  };
  
  // State Management
  loading: boolean;
  error: string | null;
}

export interface HealingGamificationActions {
  // Grace Token Actions
  useGraceToken: (reason: string, daysMissed?: number) => Promise<{
    success: boolean;
    celebrationMessage: string;
    wisdomMoment: string;
  }>;
  
  renewGraceTokens: () => Promise<{
    success: boolean;
    celebrationMessage: string;
    healingInsight: string;
  }>;
  
  // Presence Actions
  recordPresenceMoment: (journalEntry: any) => Promise<{
    presenceScore: number;
    wisdomGained: string[];
    celebrationData: any;
  }>;
  
  // Badge Actions
  checkBadgeUnlocks: (journalMetrics: any) => Promise<Badge[]>;
  celebrateBadge: (badge: Badge) => Promise<{
    celebrationMessage: string;
    identityAffirmation: string;
    nextGrowthInvitation: string;
  }>;
  
  // Community Actions
  joinChallenge: (challengeId: string, participationLevel?: 'gentle' | 'moderate' | 'engaged') => Promise<{
    success: boolean;
    anonymousId: string;
    welcomeMessage: string;
  }>;
  
  shareWisdom: (wisdom: {
    insight?: string;
    supportPattern?: string;
    healingBreakthrough?: string;
  }) => Promise<{
    success: boolean;
    communityResponse: string;
  }>;
  
  plantEncouragement: (encouragement: {
    message: string;
    forSituation: string;
    tone: 'gentle' | 'hopeful' | 'celebrating' | 'witnessing';
  }) => Promise<{
    success: boolean;
    growthPotential: string;
  }>;
  
  // Anti-Shame Actions
  interceptShame: (indicators: {
    missedDays: number;
    selfCriticalLanguage: boolean;
    perfectionismSpike: boolean;
    comparisonThoughts: boolean;
  }) => {
    reframe: string;
    compassionPractice: string;
    graceReminder: string;
    wisdomInsertion: string;
  };
  
  // Pause & Resume Actions
  requestHealingPause: (reason: string, plannedDays: number) => Promise<{
    success: boolean;
    supportOffered: string[];
    returnInstructions: string;
  }>;
  
  returnFromPause: () => Promise<{
    success: boolean;
    celebrationMessage: string;
    returningBonus: any;
  }>;
  
  // Preference Updates
  updatePreferences: (newPreferences: Partial<HealingGamificationState['preferences']>) => Promise<void>;
}

export function useHealingGamification(): {
  state: HealingGamificationState;
  actions: HealingGamificationActions;
} {
  // State Management
  const [state, setState] = useState<HealingGamificationState>({
    graceTokens: null,
    presenceMetrics: null,
    antiShameSystem: null,
    presenceQuality: null,
    wisdomAccumulation: null,
    selfCompassionTracking: null,
    healingMomentum: null,
    authenticityMoments: null,
    gentlePowerLevel: null,
    earnedBadges: [],
    availableTrees: REVOLUTIONARY_BADGE_TREES,
    nextBadgeOpportunities: [],
    activeChallenges: [],
    currentSeason: null,
    communitySupport: {
      encouragementReceived: [],
      wisdomShared: 0,
      mutualSupportGiven: 0
    },
    preferences: {
      celebrationStyle: 'warm',
      visualComplexity: 'balanced',
      sageGreenIntensity: 'embrace',
      traumaInformedSettings: {
        anxietyTriggers: false,
        perfectionismTriggers: false,
        needsExtraGrace: false,
        prefersCollectiveProgress: true
      }
    },
    loading: true,
    error: null
  });

  const { user } = useAuth();

  // Cloud Functions
  const useGraceTokenFunction = httpsCallable(functions, 'useGraceToken');
  const recordPresenceFunction = httpsCallable(functions, 'recordPresenceMoment');
  const checkBadgeUnlocksFunction = httpsCallable(functions, 'checkBadgeUnlocks');
  const joinChallengeFunction = httpsCallable(functions, 'joinChallenge');
  const shareWisdomFunction = httpsCallable(functions, 'shareWisdom');
  const plantEncouragementFunction = httpsCallable(functions, 'plantEncouragement');

  // Initialize gamification data
  useEffect(() => {
    if (!user?.uid) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    const unsubscribers: (() => void)[] = [];

    // Listen to user profile for preferences
    const profileRef = doc(db, `users/${user.uid}`);
    const unsubscribeProfile = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        const profileData = doc.data();
        setState(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            ...profileData.gamificationPreferences
          }
        }));
      }
    });
    unsubscribers.push(unsubscribeProfile);

    // Listen to grace token state
    const graceRef = doc(db, `users/${user.uid}/gamification/graceTokens`);
    const unsubscribeGrace = onSnapshot(graceRef, (doc) => {
      if (doc.exists()) {
        setState(prev => ({
          ...prev,
          graceTokens: doc.data() as GraceTokenState
        }));
      }
    });
    unsubscribers.push(unsubscribeGrace);

    // Listen to presence metrics
    const presenceRef = doc(db, `users/${user.uid}/gamification/presence`);
    const unsubscribePresence = onSnapshot(presenceRef, (doc) => {
      if (doc.exists()) {
        setState(prev => ({
          ...prev,
          presenceMetrics: doc.data() as PresenceMetrics,
          presenceQuality: doc.data().currentQuality as PresenceQualityMetrics
        }));
      }
    });
    unsubscribers.push(unsubscribePresence);

    // Listen to wisdom accumulation
    const wisdomRef = doc(db, `users/${user.uid}/gamification/wisdom`);
    const unsubscribeWisdom = onSnapshot(wisdomRef, (doc) => {
      if (doc.exists()) {
        setState(prev => ({
          ...prev,
          wisdomAccumulation: doc.data() as WisdomAccumulation
        }));
      }
    });
    unsubscribers.push(unsubscribeWisdom);

    // Listen to earned badges
    const badgesRef = collection(db, `users/${user.uid}/badges`);
    const badgesQuery = query(badgesRef, orderBy('earnedAt', 'desc'), limit(20));
    const unsubscribeBadges = onSnapshot(badgesQuery, (snapshot) => {
      const badges = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Badge[];
      
      setState(prev => ({
        ...prev,
        earnedBadges: badges
      }));
    });
    unsubscribers.push(unsubscribeBadges);

    // Listen to active challenges
    const challengesRef = collection(db, 'challenges');
    const activeChallengesQuery = query(challengesRef, orderBy('startDate', 'desc'), limit(5));
    const unsubscribeChallenges = onSnapshot(activeChallengesQuery, (snapshot) => {
      const challenges = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(challenge => challenge.isActive) as MutualSupportChallenge[];
      
      setState(prev => ({
        ...prev,
        activeChallenges: challenges
      }));
    });
    unsubscribers.push(unsubscribeChallenges);

    setState(prev => ({ ...prev, loading: false }));

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [user?.uid]);

  // Revolutionary Actions Implementation
  const useGraceToken = useCallback(async (reason: string, daysMissed: number = 1) => {
    if (!user?.uid || !state.graceTokens) {
      throw new Error('Grace token system not available');
    }

    try {
      const result = GraceTokenSystem.useGraceToken(state.graceTokens, reason, daysMissed);
      
      // Update via cloud function
      await useGraceTokenFunction({
        userId: user.uid,
        reason,
        daysMissed
      });

      return {
        success: true,
        celebrationMessage: result.celebrationMessage,
        wisdomMoment: result.wisdomMoment
      };
    } catch (error: any) {
      console.error('Error using grace token:', error);
      throw new Error(error.message || 'Failed to use grace token');
    }
  }, [user?.uid, state.graceTokens, useGraceTokenFunction]);

  const renewGraceTokens = useCallback(async () => {
    if (!user?.uid || !state.graceTokens) {
      throw new Error('Grace token system not available');
    }

    try {
      const result = GraceTokenSystem.renewGraceTokens(user.uid, state.graceTokens);
      
      return {
        success: true,
        celebrationMessage: result.celebrationMessage,
        healingInsight: result.healingInsight
      };
    } catch (error: any) {
      console.error('Error renewing grace tokens:', error);
      throw new Error(error.message || 'Failed to renew grace tokens');
    }
  }, [user?.uid, state.graceTokens]);

  const recordPresenceMoment = useCallback(async (journalEntry: any) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      // Calculate presence quality locally first
      const presenceMetrics = PresenceOverPerformanceSystem.calculatePresenceQuality(journalEntry);
      
      // Update via cloud function
      const result = await recordPresenceFunction({
        userId: user.uid,
        journalEntry,
        presenceMetrics
      });

      // Generate healing celebration
      const celebrationData = AntiShameSystem.generateCelebration(
        'engaged in meaningful reflection',
        state.preferences.traumaInformedSettings
      );

      return {
        presenceScore: presenceMetrics.emotionalDepth + presenceMetrics.vulnerabilityLevel + presenceMetrics.insightMoments,
        wisdomGained: [`Emotional depth: ${presenceMetrics.emotionalDepth}/10`, `Insights gained: ${presenceMetrics.insightMoments}`],
        celebrationData
      };
    } catch (error: any) {
      console.error('Error recording presence moment:', error);
      throw new Error(error.message || 'Failed to record presence');
    }
  }, [user?.uid, recordPresenceFunction, state.preferences]);

  const checkBadgeUnlocks = useCallback(async (journalMetrics: any) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await checkBadgeUnlocksFunction({
        userId: user.uid,
        journalMetrics
      });

      return result.data.unlockedBadges || [];
    } catch (error: any) {
      console.error('Error checking badge unlocks:', error);
      throw new Error(error.message || 'Failed to check badge unlocks');
    }
  }, [user?.uid, checkBadgeUnlocksFunction]);

  const celebrateBadge = useCallback(async (badge: Badge) => {
    try {
      const celebration = AntiShameSystem.generateCelebration(
        badge.name,
        state.preferences.traumaInformedSettings
      );

      return {
        celebrationMessage: celebration.message,
        identityAffirmation: badge.identityAffirmation || `You are someone who ${badge.description.toLowerCase()}`,
        nextGrowthInvitation: 'Continue exploring with the same gentle curiosity that brought you here.'
      };
    } catch (error: any) {
      console.error('Error celebrating badge:', error);
      throw new Error('Failed to generate badge celebration');
    }
  }, [state.preferences]);

  const joinChallenge = useCallback(async (challengeId: string, participationLevel: 'gentle' | 'moderate' | 'engaged' = 'moderate') => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await MutualSupportCommunitySystem.joinChallenge(
        user.uid,
        challengeId,
        participationLevel
      );

      return result;
    } catch (error: any) {
      console.error('Error joining challenge:', error);
      throw new Error(error.message || 'Failed to join challenge');
    }
  }, [user?.uid]);

  const shareWisdom = useCallback(async (wisdom: any) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await shareWisdomFunction({
        userId: user.uid,
        wisdom
      });

      return {
        success: true,
        communityResponse: result.data.communityResponse
      };
    } catch (error: any) {
      console.error('Error sharing wisdom:', error);
      throw new Error(error.message || 'Failed to share wisdom');
    }
  }, [user?.uid, shareWisdomFunction]);

  const plantEncouragement = useCallback(async (encouragement: any) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await plantEncouragementFunction({
        userId: user.uid,
        encouragement
      });

      return {
        success: true,
        growthPotential: result.data.growthPotential
      };
    } catch (error: any) {
      console.error('Error planting encouragement:', error);
      throw new Error(error.message || 'Failed to plant encouragement');
    }
  }, [user?.uid, plantEncouragementFunction]);

  const interceptShame = useCallback((indicators: any) => {
    return AntiShameSystem.interceptShameSpiral(indicators);
  }, []);

  const requestHealingPause = useCallback(async (reason: string, plannedDays: number) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await MutualSupportCommunitySystem.requestPause(
        'current_challenge', // Would be dynamic
        'anonymous_id', // Would be user's anonymous ID
        reason,
        new Date(Date.now() + plannedDays * 24 * 60 * 60 * 1000).toISOString()
      );

      return result;
    } catch (error: any) {
      console.error('Error requesting healing pause:', error);
      throw new Error(error.message || 'Failed to request pause');
    }
  }, [user?.uid]);

  const returnFromPause = useCallback(async () => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      // Calculate recovery bonus
      const daysAway = 7; // Would be calculated from actual pause duration
      const recoveryBonus = GraceTokenSystem.calculateRecoveryBonus(daysAway);

      return {
        success: true,
        celebrationMessage: recoveryBonus.celebrationMessage,
        returningBonus: {
          multiplier: recoveryBonus.multiplier,
          duration: recoveryBonus.duration,
          courageRecognition: recoveryBonus.courageRecognition
        }
      };
    } catch (error: any) {
      console.error('Error returning from pause:', error);
      throw new Error(error.message || 'Failed to return from pause');
    }
  }, [user?.uid]);

  const updatePreferences = useCallback(async (newPreferences: Partial<HealingGamificationState['preferences']>) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      setState(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...newPreferences
        }
      }));

      // Update in Firestore
      // This would be implemented via a cloud function or direct Firestore update
      console.log('Preferences updated:', newPreferences);
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      throw new Error(error.message || 'Failed to update preferences');
    }
  }, [user?.uid]);

  // Actions object
  const actions: HealingGamificationActions = {
    useGraceToken,
    renewGraceTokens,
    recordPresenceMoment,
    checkBadgeUnlocks,
    celebrateBadge,
    joinChallenge,
    shareWisdom,
    plantEncouragement,
    interceptShame,
    requestHealingPause,
    returnFromPause,
    updatePreferences
  };

  return { state, actions };
}

// Revolutionary helper hooks for specific aspects

export function useGraceTokens() {
  const { state, actions } = useHealingGamification();
  
  return {
    graceTokens: state.graceTokens,
    useToken: actions.useGraceToken,
    renewTokens: actions.renewGraceTokens,
    loading: state.loading,
    error: state.error
  };
}

export function usePresenceTracking() {
  const { state, actions } = useHealingGamification();
  
  return {
    presenceMetrics: state.presenceMetrics,
    presenceQuality: state.presenceQuality,
    wisdomAccumulation: state.wisdomAccumulation,
    recordMoment: actions.recordPresenceMoment,
    loading: state.loading,
    error: state.error
  };
}

export function useOrganicBadges() {
  const { state, actions } = useHealingGamification();
  
  return {
    earnedBadges: state.earnedBadges,
    availableTrees: state.availableTrees,
    nextOpportunities: state.nextBadgeOpportunities,
    checkUnlocks: actions.checkBadgeUnlocks,
    celebrate: actions.celebrateBadge,
    loading: state.loading,
    error: state.error
  };
}

export function useMutualSupport() {
  const { state, actions } = useHealingGamification();
  
  return {
    activeChallenges: state.activeChallenges,
    currentSeason: state.currentSeason,
    communitySupport: state.communitySupport,
    joinChallenge: actions.joinChallenge,
    shareWisdom: actions.shareWisdom,
    plantEncouragement: actions.plantEncouragement,
    loading: state.loading,
    error: state.error
  };
}

export function useAntiShame() {
  const { state, actions } = useHealingGamification();
  
  return {
    antiShameSystem: state.antiShameSystem,
    interceptShame: actions.interceptShame,
    preferences: state.preferences,
    updatePreferences: actions.updatePreferences
  };
}