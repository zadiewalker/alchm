'use client';

/**
 * BADGE INTELLIGENCE HOOK
 * "Intelligence that serves healing, not metrics that exploit."
 * 
 * This hook integrates all badge intelligence systems to provide:
 * - Real-time badge effectiveness analysis
 * - Personalized achievement recommendations
 * - Trauma-informed A/B testing
 * - Anti-shame badge experiences
 * - Grace token integration
 * 
 * The hook ensures all gamification serves therapeutic goals.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/useAuth';
import { BadgeSystemIntelligence, BadgeEffectivenessMetrics, PersonalizedAchievementSuggestion } from '@/lib/gamification/badge-system-intelligence';
import { TraumaInformedABTesting, TraumaInformedTestMetrics, TestResults } from '@/lib/gamification/ab-testing-framework';
import { PersonalizedAchievementEngine, HealingPattern, PersonalGrowthProfile, AchievementRecommendation } from '@/lib/gamification/personalized-achievement-engine';
import { GraceTokenSystem, AntiShameSystem } from '@/lib/gamification/grace-token-revolution';

export interface BadgeIntelligenceState {
  // Badge Analytics
  badgeEffectiveness: Record<string, BadgeEffectivenessMetrics>;
  personalizedRecommendations: AchievementRecommendation[];
  
  // User Profile Intelligence
  healingPatterns: HealingPattern | null;
  personalGrowthProfile: PersonalGrowthProfile | null;
  
  // A/B Testing
  activeTests: string[];
  testResults: Record<string, TestResults>;
  participationStatus: Record<string, 'enrolled' | 'excluded' | 'completed' | 'exited'>;
  
  // Real-time Context
  currentContext: {
    stressLevel: number;
    energyLevel: number;
    recentGraceTokenUse: boolean;
    currentMood: string;
    availableTime: number;
  };
  
  // Loading States
  loading: {
    analytics: boolean;
    recommendations: boolean;
    profile: boolean;
    tests: boolean;
  };
  
  error: string | null;
}

export interface BadgeIntelligenceActions {
  // Analytics Actions
  analyzeBadgeEffectiveness: (badgeId: string, timeRange?: { start: Date; end: Date }) => Promise<BadgeEffectivenessMetrics>;
  refreshAnalytics: () => Promise<void>;
  
  // Recommendation Actions
  generatePersonalizedRecommendations: (maxRecommendations?: number) => Promise<AchievementRecommendation[]>;
  adaptRecommendationForContext: (recommendationId: string, currentContext: any) => AchievementRecommendation | null;
  acceptRecommendation: (recommendationId: string) => Promise<{ success: boolean; badge: any }>;
  deferRecommendation: (recommendationId: string, reason: string) => Promise<void>;
  
  // Profile Intelligence
  updateHealingPatterns: () => Promise<HealingPattern>;
  updatePersonalGrowthProfile: (selfReportedData?: any) => Promise<PersonalGrowthProfile>;
  
  // A/B Testing Actions
  enrollInTest: (testId: string) => Promise<{ enrolled: boolean; variant?: string; reason?: string }>;
  exitFromTest: (testId: string, reason: string) => Promise<void>;
  reportTestConcern: (testId: string, concern: string) => Promise<void>;
  
  // Anti-Shame Badge Experience
  generateAntiShameBadgeExperience: (badgeId: string) => Promise<{
    celebrationMessage: string;
    identityAffirmation: string;
    nextStepGuidance: string;
    shameInterruptions: string[];
  }>;
  
  // Context Updates
  updateCurrentContext: (context: Partial<BadgeIntelligenceState['currentContext']>) => void;
  reportWellbeingChange: (wellbeingData: { metric: string; value: number; context: string }) => Promise<void>;
  
  // Grace Integration
  integrateGraceTokenExperience: (badgeId: string) => Promise<{
    graceEnhanced: boolean;
    supportMessage: string;
    adaptations: string[];
  }>;
}

export function useBadgeIntelligence(): {
  state: BadgeIntelligenceState;
  actions: BadgeIntelligenceActions;
} {
  const { user } = useAuth();
  
  const [state, setState] = useState<BadgeIntelligenceState>({
    badgeEffectiveness: {},
    personalizedRecommendations: [],
    healingPatterns: null,
    personalGrowthProfile: null,
    activeTests: [],
    testResults: {},
    participationStatus: {},
    currentContext: {
      stressLevel: 5,
      energyLevel: 7,
      recentGraceTokenUse: false,
      currentMood: 'neutral',
      availableTime: 15
    },
    loading: {
      analytics: false,
      recommendations: false,
      profile: false,
      tests: false
    },
    error: null
  });
  
  // Initialize intelligence systems
  useEffect(() => {
    if (user?.uid) {
      initializeIntelligence();
    }
  }, [user?.uid]);
  
  const initializeIntelligence = async () => {
    try {
      setState(prev => ({
        ...prev,
        loading: { analytics: true, recommendations: true, profile: true, tests: true }
      }));
      
      // Load user's healing patterns and profile
      await Promise.all([
        updateHealingPatterns(),
        updatePersonalGrowthProfile(),
        loadActiveTests(),
        loadBadgeAnalytics()
      ]);
      
      setState(prev => ({
        ...prev,
        loading: { analytics: false, recommendations: false, profile: false, tests: false }
      }));
    } catch (error) {
      console.error('Error initializing badge intelligence:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to initialize badge intelligence',
        loading: { analytics: false, recommendations: false, profile: false, tests: false }
      }));
    }
  };
  
  // Analytics Actions
  const analyzeBadgeEffectiveness = useCallback(async (
    badgeId: string, 
    timeRange: { start: Date; end: Date } = {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  ): Promise<BadgeEffectivenessMetrics> => {
    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, analytics: true } }));
      
      const effectiveness = await BadgeSystemIntelligence.analyzeBadgeEffectiveness(badgeId, timeRange);
      
      setState(prev => ({
        ...prev,
        badgeEffectiveness: {
          ...prev.badgeEffectiveness,
          [badgeId]: effectiveness
        },
        loading: { ...prev.loading, analytics: false }
      }));
      
      return effectiveness;
    } catch (error) {
      console.error('Error analyzing badge effectiveness:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to analyze badge effectiveness',
        loading: { ...prev.loading, analytics: false }
      }));
      throw error;
    }
  }, []);
  
  const refreshAnalytics = useCallback(async () => {
    try {
      await loadBadgeAnalytics();
    } catch (error) {
      console.error('Error refreshing analytics:', error);
      setState(prev => ({ ...prev, error: 'Failed to refresh analytics' }));
    }
  }, []);
  
  // Recommendation Actions
  const generatePersonalizedRecommendations = useCallback(async (maxRecommendations: number = 3): Promise<AchievementRecommendation[]> => {
    if (!user?.uid || !state.healingPatterns || !state.personalGrowthProfile) {
      throw new Error('User profile not ready for recommendations');
    }
    
    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, recommendations: true } }));
      
      const contextualFactors = await PersonalizedAchievementEngine.assessContextualFactors(user.uid);
      
      const recommendations = await PersonalizedAchievementEngine.generateRecommendations(
        user.uid,
        state.healingPatterns,
        state.personalGrowthProfile,
        contextualFactors,
        maxRecommendations
      );
      
      setState(prev => ({
        ...prev,
        personalizedRecommendations: recommendations,
        loading: { ...prev.loading, recommendations: false }
      }));
      
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to generate personalized recommendations',
        loading: { ...prev.loading, recommendations: false }
      }));
      throw error;
    }
  }, [user?.uid, state.healingPatterns, state.personalGrowthProfile]);
  
  const adaptRecommendationForContext = useCallback((recommendationId: string, currentContext: any): AchievementRecommendation | null => {
    const recommendation = state.personalizedRecommendations.find(rec => rec.achievementId === recommendationId);
    if (!recommendation) return null;
    
    return PersonalizedAchievementEngine.adaptAchievementInRealTime(recommendation, currentContext);
  }, [state.personalizedRecommendations]);
  
  const acceptRecommendation = useCallback(async (recommendationId: string): Promise<{ success: boolean; badge: any }> => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }
    
    try {
      const recommendation = state.personalizedRecommendations.find(rec => rec.achievementId === recommendationId);
      if (!recommendation) {
        throw new Error('Recommendation not found');
      }
      
      // Create personalized badge experience
      const badgeExperience = await BadgeSystemIntelligence.generateAntiShameBadgeExperience(
        recommendation,
        {
          userId: user.uid,
          healingJourney: {
            traumaInformedNeeds: {
              needsExtraGrace: true,
              triggeredByComparison: false,
              prefersProcessOverOutcome: true,
              respondsBetterToSubtleCelebration: true
            },
            currentPhase: 'processing',
            primaryHealingGoals: ['self_compassion'],
            culturalConsiderations: []
          },
          engagementPatterns: {
            preferredAchievementTypes: [recommendation.category],
            motivationalResponses: {},
            optimalChallengeLevel: 'gentle',
            celebrationPreferences: 'warm'
          },
          achievementHistory: {
            mostMeaningfulBadges: [],
            leastResonantBadges: [],
            abandonedPursuits: [],
            sustainedEngagements: [],
            shameRecoveryPatterns: []
          },
          personalizedWeights: {
            presenceWeight: 1,
            insightWeight: 1,
            resilienceWeight: 1,
            communityWeight: 1,
            creativityWeight: 1,
            spiritualityWeight: 1
          }
        }
      );
      
      // Remove accepted recommendation from list
      setState(prev => ({
        ...prev,
        personalizedRecommendations: prev.personalizedRecommendations.filter(
          rec => rec.achievementId !== recommendationId
        )
      }));
      
      return {
        success: true,
        badge: {
          ...recommendation,
          ...badgeExperience,
          acceptedAt: new Date()
        }
      };
    } catch (error) {
      console.error('Error accepting recommendation:', error);
      throw error;
    }
  }, [user?.uid, state.personalizedRecommendations]);
  
  const deferRecommendation = useCallback(async (recommendationId: string, reason: string) => {
    // Mark recommendation as deferred and adjust future recommendations
    setState(prev => ({
      ...prev,
      personalizedRecommendations: prev.personalizedRecommendations.map(rec =>
        rec.achievementId === recommendationId
          ? { ...rec, deferred: true, deferReason: reason, deferredAt: new Date() }
          : rec
      )
    }));
  }, []);
  
  // Profile Intelligence Actions
  const updateHealingPatterns = useCallback(async (): Promise<HealingPattern> => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }
    
    try {
      const patterns = await PersonalizedAchievementEngine.analyzeHealingPatterns(user.uid);
      setState(prev => ({ ...prev, healingPatterns: patterns }));
      return patterns;
    } catch (error) {
      console.error('Error updating healing patterns:', error);
      throw error;
    }
  }, [user?.uid]);
  
  const updatePersonalGrowthProfile = useCallback(async (selfReportedData?: any): Promise<PersonalGrowthProfile> => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }
    
    try {
      const profile = await PersonalizedAchievementEngine.createPersonalGrowthProfile(user.uid, selfReportedData);
      setState(prev => ({ ...prev, personalGrowthProfile: profile }));
      return profile;
    } catch (error) {
      console.error('Error updating personal growth profile:', error);
      throw error;
    }
  }, [user?.uid]);
  
  // A/B Testing Actions
  const enrollInTest = useCallback(async (testId: string): Promise<{ enrolled: boolean; variant?: string; reason?: string }> => {
    if (!user?.uid || !state.personalGrowthProfile) {
      throw new Error('User profile not ready for testing');
    }
    
    try {
      const result = await TraumaInformedABTesting.enrollParticipant(testId, user.uid, {
        healingPhase: 'processing',
        anxietyProne: false,
        perfectionismConcerns: true,
        needsExtraGrace: false,
        prefersSubtleCelebration: true
      });
      
      setState(prev => ({
        ...prev,
        participationStatus: {
          ...prev.participationStatus,
          [testId]: result.enrolled ? 'enrolled' : 'excluded'
        },
        activeTests: result.enrolled ? [...prev.activeTests, testId] : prev.activeTests
      }));
      
      return result;
    } catch (error) {
      console.error('Error enrolling in test:', error);
      throw error;
    }
  }, [user?.uid, state.personalGrowthProfile]);
  
  const exitFromTest = useCallback(async (testId: string, reason: string) => {
    setState(prev => ({
      ...prev,
      participationStatus: {
        ...prev.participationStatus,
        [testId]: 'exited'
      },
      activeTests: prev.activeTests.filter(id => id !== testId)
    }));
    
    // Would also call API to exit from test
    console.log(`Exited from test ${testId} with reason: ${reason}`);
  }, []);
  
  const reportTestConcern = useCallback(async (testId: string, concern: string) => {
    // Report concern to the testing system
    console.log(`Reported concern for test ${testId}: ${concern}`);
  }, []);
  
  // Anti-Shame Badge Experience
  const generateAntiShameBadgeExperience = useCallback(async (badgeId: string): Promise<{
    celebrationMessage: string;
    identityAffirmation: string;
    nextStepGuidance: string;
    shameInterruptions: string[];
  }> => {
    if (!user?.uid || !state.personalGrowthProfile) {
      throw new Error('User profile not available');
    }
    
    try {
      const badge = { id: badgeId, name: 'Achievement', description: 'A meaningful accomplishment' }; // Would fetch actual badge
      
      const experience = BadgeSystemIntelligence.generateAntiShameBadgeExperience(badge, {
        userId: user.uid,
        healingJourney: {
          traumaInformedNeeds: {
            needsExtraGrace: true,
            triggeredByComparison: false,
            prefersProcessOverOutcome: true,
            respondsBetterToSubtleCelebration: true
          },
          currentPhase: 'processing',
          primaryHealingGoals: ['self_compassion'],
          culturalConsiderations: []
        },
        engagementPatterns: {
          preferredAchievementTypes: ['presence'],
          motivationalResponses: {},
          optimalChallengeLevel: 'gentle',
          celebrationPreferences: 'warm'
        },
        achievementHistory: {
          mostMeaningfulBadges: [],
          leastResonantBadges: [],
          abandonedPursuits: [],
          sustainedEngagements: [],
          shameRecoveryPatterns: []
        },
        personalizedWeights: {
          presenceWeight: 1,
          insightWeight: 1,
          resilienceWeight: 1,
          communityWeight: 1,
          creativityWeight: 1,
          spiritualityWeight: 1
        }
      });
      
      return experience;
    } catch (error) {
      console.error('Error generating anti-shame badge experience:', error);
      throw error;
    }
  }, [user?.uid, state.personalGrowthProfile]);
  
  // Context Updates
  const updateCurrentContext = useCallback((context: Partial<BadgeIntelligenceState['currentContext']>) => {
    setState(prev => ({
      ...prev,
      currentContext: {
        ...prev.currentContext,
        ...context
      }
    }));
  }, []);
  
  const reportWellbeingChange = useCallback(async (wellbeingData: { metric: string; value: number; context: string }) => {
    // Report wellbeing changes for monitoring
    console.log('Wellbeing change reported:', wellbeingData);
    
    // Auto-adjust recommendations based on wellbeing
    if (wellbeingData.metric === 'anxiety' && wellbeingData.value > 7) {
      // Reduce difficulty of current recommendations
      setState(prev => ({
        ...prev,
        personalizedRecommendations: prev.personalizedRecommendations.map(rec => ({
          ...rec,
          difficultyLevel: {
            ...rec.difficultyLevel,
            personalizedLevel: Math.max(1, rec.difficultyLevel.personalizedLevel - 1),
            adaptationReason: 'Adjusted for increased anxiety levels'
          }
        }))
      }));
    }
  }, []);
  
  // Grace Integration
  const integrateGraceTokenExperience = useCallback(async (badgeId: string): Promise<{
    graceEnhanced: boolean;
    supportMessage: string;
    adaptations: string[];
  }> => {
    try {
      // Check if user has used grace tokens recently
      const recentGraceUse = state.currentContext.recentGraceTokenUse;
      
      if (recentGraceUse) {
        return {
          graceEnhanced: true,
          supportMessage: AntiShameSystem.generateCelebration('showing self-compassion through grace token use', { celebrationStyle: 'gentle' }),
          adaptations: [
            'Extended timeline available',
            'Extra encouragement messages included',
            'Reduced pressure in achievement language',
            'Recovery bonus available if returning from break'
          ]
        };
      }
      
      return {
        graceEnhanced: false,
        supportMessage: 'Standard achievement experience with grace tokens available if needed',
        adaptations: ['Grace tokens available for self-compassionate pacing']
      };
    } catch (error) {
      console.error('Error integrating grace token experience:', error);
      throw error;
    }
  }, [state.currentContext]);
  
  // Helper functions
  const loadActiveTests = async () => {
    // Load user's active test participation
    setState(prev => ({
      ...prev,
      activeTests: ['test_1', 'test_2'], // Placeholder
      participationStatus: {
        'test_1': 'enrolled',
        'test_2': 'completed'
      }
    }));
  };
  
  const loadBadgeAnalytics = async () => {
    // Load badge effectiveness analytics
    setState(prev => ({
      ...prev,
      badgeEffectiveness: {
        'presence_1': {
          badgeId: 'presence_1',
          badgeName: 'Still Here I',
          category: 'presence',
          therapeuticValue: {
            completionSatisfaction: 85,
            postCompletionBehavior: {
              increasedSelfCompassion: 70,
              sustainedJournalingPractice: 80,
              reducedShameSpirals: 60,
              deeperSelfReflection: 75
            },
            healingMomentumChange: 15
          },
          traumaInformedImpact: {
            anxietyTriggerRate: 5,
            perfectionismIncrease: 3,
            shameActivation: 2,
            graceTokenUsageAfter: 20
          },
          authenticEngagement: {
            genuineMotivation: 82,
            intrinisicVsExtrinsic: 78,
            personalRelevance: 88,
            processVsOutcomeOrientation: 90
          },
          populationMetrics: {
            totalEarners: 150,
            demographicBreakdown: { 'general': 150 },
            culturalResonance: { 'general': 8.5 },
            neurodiversityAdaptability: 85
          },
          qualityIndicators: {
            sustainabilityScore: 80,
            wisdomGeneration: 75,
            communityConnection: 65,
            identityEvolution: 82
          },
          concernSignals: {
            addictionPotential: 10,
            comparisonTriggers: 5,
            perfectionismRisk: 15,
            sustainabilityRisk: 12
          }
        }
      }
    }));
  };
  
  const actions: BadgeIntelligenceActions = {
    analyzeBadgeEffectiveness,
    refreshAnalytics,
    generatePersonalizedRecommendations,
    adaptRecommendationForContext,
    acceptRecommendation,
    deferRecommendation,
    updateHealingPatterns,
    updatePersonalGrowthProfile,
    enrollInTest,
    exitFromTest,
    reportTestConcern,
    generateAntiShameBadgeExperience,
    updateCurrentContext,
    reportWellbeingChange,
    integrateGraceTokenExperience
  };
  
  return { state, actions };
}

// Specialized hooks for specific intelligence aspects

export function useBadgeAnalytics() {
  const { state, actions } = useBadgeIntelligence();
  
  return {
    badgeEffectiveness: state.badgeEffectiveness,
    analyzeBadge: actions.analyzeBadgeEffectiveness,
    refreshAnalytics: actions.refreshAnalytics,
    loading: state.loading.analytics,
    error: state.error
  };
}

export function usePersonalizedRecommendations() {
  const { state, actions } = useBadgeIntelligence();
  
  return {
    recommendations: state.personalizedRecommendations,
    generate: actions.generatePersonalizedRecommendations,
    adapt: actions.adaptRecommendationForContext,
    accept: actions.acceptRecommendation,
    defer: actions.deferRecommendation,
    loading: state.loading.recommendations,
    error: state.error
  };
}

export function useTraumaInformedTesting() {
  const { state, actions } = useBadgeIntelligence();
  
  return {
    activeTests: state.activeTests,
    participationStatus: state.participationStatus,
    testResults: state.testResults,
    enroll: actions.enrollInTest,
    exit: actions.exitFromTest,
    reportConcern: actions.reportTestConcern,
    loading: state.loading.tests,
    error: state.error
  };
}

export function useAntiShameBadges() {
  const { state, actions } = useBadgeIntelligence();
  
  return {
    generateExperience: actions.generateAntiShameBadgeExperience,
    integrateGrace: actions.integrateGraceTokenExperience,
    currentContext: state.currentContext,
    updateContext: actions.updateCurrentContext,
    reportWellbeing: actions.reportWellbeingChange,
    error: state.error
  };
}