'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './useAuth';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { GraceTokenSystem, PresenceMetricSystem, AntiShameSystem } from './gamification/grace-token-revolution';
import type { GraceTokenState, PresenceMetrics, AntiShameSystem as AntiShameSystemType } from './gamification/grace-token-revolution';

export interface StreakData {
  current: number;
  longest: number;
  lastJournalISO: string;
  graceTokens: number;
  recoveryMultiplier: number;
  streakFrozen: boolean;
  recoveryMultiplierUntil?: string;
  pauseStartDate?: string;
  // Revolutionary Grace System Extensions
  graceTokenRenewalDate?: string;
  returningBonusActive?: boolean;
  gentleReminders?: boolean;
  lastCelebration?: any;
  wisdomStreak?: number;
  presenceOverPerformance?: boolean;
  timezoneGracePeriod?: number;
  healingPauseReason?: string;
}

export interface XPEvent {
  amount: number;
  source: 'journal' | 'quest' | 'badge' | 'streak' | 'challenge' | 'referral';
  multiplier: number;
  timestamp: any;
  description: string;
}

export function useStreaks() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [recentXP, setRecentXP] = useState<XPEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graceTokenState, setGraceTokenState] = useState<GraceTokenState | null>(null);
  const [presenceMetrics, setPresenceMetrics] = useState<PresenceMetrics | null>(null);
  const [antiShameSystem, setAntiShameSystem] = useState<AntiShameSystemType | null>(null);
  const { user } = useAuth();

  // Cloud Functions
  const requestKindnessBreak = httpsCallable(functions, 'requestKindnessBreak');
  const returnFromKindnessBreak = httpsCallable(functions, 'returnFromKindnessBreak');

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    // Listen to streak data with revolutionary grace system
    const streakRef = doc(db, `users/${user.uid}/streaks/current`);
    const unsubscribeStreak = onSnapshot(streakRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as StreakData;
        setStreakData(data);
        
        // Check if grace tokens need renewal (every Monday)
        const renewalDate = data.graceTokenRenewalDate || GraceTokenSystem.getNextRenewalDate();
        if (GraceTokenSystem.shouldRenewTokens(renewalDate)) {
          // Grace tokens should be renewed
          console.log('Grace tokens ready for renewal - will be handled by next journal entry');
        }
      } else {
        // Initialize revolutionary streak data
        const initialData: StreakData = {
          current: 0,
          longest: 0,
          lastJournalISO: '',
          graceTokens: 2,
          recoveryMultiplier: 1.0,
          streakFrozen: false,
          graceTokenRenewalDate: GraceTokenSystem.getNextRenewalDate(),
          returningBonusActive: false,
          gentleReminders: true,
          wisdomStreak: 0,
          presenceOverPerformance: true,
          timezoneGracePeriod: 4 // 4 hours of timezone grace
        };
        setStreakData(initialData);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to streak data:', error);
      setError('Failed to load streak data');
      setLoading(false);
    });

    // Listen to recent XP events
    const xpRef = collection(db, `users/${user.uid}/xp_events`);
    const unsubscribeXP = onSnapshot(xpRef, (snapshot) => {
      const events = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount || 0,
            source: data.source || 'journal',
            multiplier: data.multiplier || 1,
            timestamp: data.timestamp,
            description: data.description || '',
            ...data
          };
        })
        .sort((a: any, b: any) => b.timestamp.toMillis() - a.timestamp.toMillis())
        .slice(0, 10) as XPEvent[];
      
      setRecentXP(events);
    }, (error) => {
      console.error('Error listening to XP events:', error);
    });

    return () => {
      unsubscribeStreak();
      unsubscribeXP();
    };
  }, [user?.uid]);

  const pauseStreak = async (reason?: string, plannedReturnDays?: number) => {
    if (!user?.uid) return null;

    try {
      const result = await requestKindnessBreak({
        userId: user.uid,
        reason: reason || 'processing',
        plannedReturnDays: plannedReturnDays || 7
      });

      return result.data;
    } catch (error: any) {
      console.error('Error pausing streak:', error);
      throw new Error(error.message || 'Failed to pause streak');
    }
  };

  const resumeStreak = async () => {
    if (!user?.uid) return null;

    try {
      const result = await returnFromKindnessBreak({
        userId: user.uid
      });

      return result.data;
    } catch (error: any) {
      console.error('Error resuming streak:', error);
      throw new Error(error.message || 'Failed to resume streak');
    }
  };

  const getStreakMessage = (streak: StreakData): string => {
    if (streak.streakFrozen) {
      return "Taking a pause is sacred. Your healing continues in stillness.";
    }

    if (streak.current === 0) {
      return "Your first reflection is an act of hope. One small note creates possibility.";
    }

    if (streak.current === 1) {
      return "You showed up for yourself. That's the most important victory.";
    }

    if (streak.current <= 3) {
      return `${streak.current} days of choosing yourself. A pattern of self-love is emerging.`;
    }

    if (streak.current === 7) {
      return "Seven days of sacred presence. You're building the foundation of resilience.";
    }

    if (streak.current <= 14) {
      return `${streak.current} days of inner work. The patterns are revealing themselves to you.`;
    }

    if (streak.current === 30) {
      return "Thirty days of showing up for your healing. You embody gentle, consistent power.";
    }

    if (streak.returningBonusActive) {
      return `Day ${streak.current} with welcome-back energy. Your return is celebrated.`;
    }

    return `${streak.current} days of sacred reflection. This is the architecture of transformation.`;
  };

  const getGraceTokenMessage = (tokens: number): string => {
    if (tokens === 2) {
      return "Full grace available. Self-compassion is always an option.";
    }
    if (tokens === 1) {
      return "Grace remains for when you need gentleness with yourself.";
    }
    return "Grace tokens renew Monday. You are worthy of compassion even now.";
  };

  // Revolutionary grace token usage with celebration
  const useGraceToken = async (reason: string, daysMissed: number = 1) => {
    if (!user?.uid || !streakData || streakData.graceTokens <= 0) {
      throw new Error('No grace tokens available');
    }

    try {
      const currentState: GraceTokenState = {
        tokens: streakData.graceTokens,
        renewalDate: streakData.graceTokenRenewalDate || GraceTokenSystem.getNextRenewalDate(),
        weeklyUsage: { week: '', tokensUsed: 0, tokensEarned: 0, healingMoments: [] },
        lifetimeGraceUsed: 0,
        wisestGraceUse: ''
      };

      const result = GraceTokenSystem.useGraceToken(currentState, reason, daysMissed);
      
      // Update Firestore would happen here via cloud function
      console.log('Grace token used with wisdom:', result.wisdomMoment);
      console.log('Celebration message:', result.celebrationMessage);
      
      return result;
    } catch (error) {
      console.error('Error using grace token:', error);
      throw error;
    }
  };

  // Revolutionary shame interruption system
  const interceptShame = (indicators: {
    missedDays: number;
    selfCriticalLanguage: boolean;
    perfectionismSpike: boolean;
    comparisonThoughts: boolean;
  }) => {
    return AntiShameSystem.interceptShameSpiral(indicators);
  };

  const isRecoveryMultiplierActive = (streak: StreakData): boolean => {
    if (!streak.recoveryMultiplierUntil) return false;
    return new Date().toISOString() <= streak.recoveryMultiplierUntil;
  };

  const getRecoveryTimeLeft = (streak: StreakData): number => {
    if (!streak.recoveryMultiplierUntil) return 0;
    const recoveryEnd = new Date(streak.recoveryMultiplierUntil);
    const now = new Date();
    return Math.max(0, Math.ceil((recoveryEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  };

  return {
    streakData,
    recentXP,
    loading,
    error,
    pauseStreak,
    resumeStreak,
    getStreakMessage,
    getGraceTokenMessage,
    isRecoveryMultiplierActive,
    getRecoveryTimeLeft,
    // Revolutionary Grace System Functions
    useGraceToken,
    interceptShame,
    graceTokenState,
    presenceMetrics,
    antiShameSystem,
    // Enhanced streak messages
    getWisdomStreakMessage: (wisdomStreak: number) => {
      if (wisdomStreak === 0) return "Your first insight begins the wisdom journey.";
      if (wisdomStreak <= 3) return `${wisdomStreak} insights gathered. Wisdom is accumulating.`;
      if (wisdomStreak <= 7) return `${wisdomStreak} insights deep. You're becoming a pattern-finder.`;
      return `${wisdomStreak} insights threaded together. You embody wisdom-in-action.`;
    },
    // Revolutionary celebration generator
    generateHealingCelebration: (metrics: any, preferences: any) => {
      return AntiShameSystem.generateCelebration('showed up authentically', preferences);
    }
  };
}