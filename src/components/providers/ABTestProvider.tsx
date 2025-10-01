'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { abTesting, useABTest, useFeatureFlag } from '@/lib/ab-testing';

interface ABTestContextType {
  // Onboarding tests
  onboardingQuiz: {
    variant: string | null;
    config: any;
    trackConversion: (goal: string, value?: number) => void;
  };
  
  // Journal prompt tests
  journalPrompts: {
    variant: string | null;
    config: any;
    trackConversion: (goal: string, value?: number) => void;
  };
  
  // Dashboard layout tests
  dashboardLayout: {
    variant: string | null;
    config: any;
    trackConversion: (goal: string, value?: number) => void;
  };
  
  // Crisis intervention tests
  crisisIntervention: {
    variant: string | null;
    config: any;
    trackConversion: (goal: string, value?: number) => void;
  };
  
  // Feature flags
  featureFlags: {
    advancedAnalytics: boolean;
    communityFeatures: boolean;
    aiInsights: boolean;
    crisisDetection: boolean;
    therapistDashboard: boolean;
    exportFeatures: boolean;
  };
  
  // Utility functions
  isInVariant: (testId: string, variantId: string) => boolean;
  trackGlobalConversion: (testId: string, goal: string, value?: number) => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

interface ABTestProviderProps {
  children: React.ReactNode;
}

export function ABTestProvider({ children }: ABTestProviderProps) {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get user ID (fallback to anonymous ID if not authenticated)
  const userId = user?.uid || `anon_${typeof window !== 'undefined' ? 
    (localStorage.getItem('anonymous_id') || 
     (() => {
       const anonId = Math.random().toString(36).substr(2, 9);
       localStorage.setItem('anonymous_id', anonId);
       return anonId;
     })()) : 
    'server'
  }`;

  // Initialize A/B tests
  const onboardingQuiz = useABTest('onboarding_pathway_quiz', userId);
  const journalPrompts = useABTest('journal_prompt_style', userId);
  const dashboardLayout = useABTest('dashboard_layout', userId);
  const crisisIntervention = useABTest('crisis_intervention_ui', userId);
  
  // Feature flags
  const advancedAnalytics = useFeatureFlag('advanced_analytics', userId);
  const communityFeatures = useFeatureFlag('community_features', userId);
  const aiInsights = useFeatureFlag('ai_insights', userId);
  const crisisDetection = useFeatureFlag('crisis_detection', userId);
  const therapistDashboard = useFeatureFlag('therapist_dashboard', userId);
  const exportFeatures = useFeatureFlag('export_features', userId);

  useEffect(() => {
    if (userId && !isInitialized) {
      // Track user's entry into the system
      abTesting.trackEvent('user_session_start', {
        user_id: userId,
        is_authenticated: !!user,
        timestamp: Date.now()
      });
      setIsInitialized(true);
    }
  }, [userId, user, isInitialized]);

  // Utility functions
  const isInVariant = (testId: string, variantId: string) => {
    return abTesting.isUserInVariant(userId, testId, variantId);
  };

  const trackGlobalConversion = (testId: string, goal: string, value?: number) => {
    abTesting.trackConversion(userId, testId, goal, value);
  };

  const contextValue: ABTestContextType = {
    onboardingQuiz,
    journalPrompts,
    dashboardLayout,
    crisisIntervention,
    featureFlags: {
      advancedAnalytics,
      communityFeatures,
      aiInsights,
      crisisDetection,
      therapistDashboard,
      exportFeatures
    },
    isInVariant,
    trackGlobalConversion
  };

  return (
    <ABTestContext.Provider value={contextValue}>
      {children}
    </ABTestContext.Provider>
  );
}

// Custom hook to use A/B test context
export function useABTestContext() {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTestContext must be used within an ABTestProvider');
  }
  return context;
}

// HOC for components that need A/B testing
export function withABTestContext<T extends {}>(
  Component: React.ComponentType<T & { abTest: ABTestContextType }>
) {
  return function ABTestWrapper(props: T) {
    const abTest = useABTestContext();
    
    return <Component {...props} abTest={abTest} />;
  };
}

// Hook for specific test usage with automatic tracking
export function useABTestWithTracking(testId: string, autoTrackView = true) {
  const { user } = useAuth();
  const userId = user?.uid || `anon_${Math.random().toString(36).substr(2, 9)}`;
  
  const test = useABTest(testId, userId);
  
  useEffect(() => {
    if (autoTrackView && test.variant) {
      abTesting.trackEvent('ab_test_view', {
        test_id: testId,
        variant_id: test.variant,
        user_id: userId
      });
    }
  }, [testId, test.variant, userId, autoTrackView]);
  
  return test;
}

// Convenience hooks for specific tests
export function useOnboardingTest() {
  const context = useABTestContext();
  return context.onboardingQuiz;
}

export function useJournalPromptsTest() {
  const context = useABTestContext();
  return context.journalPrompts;
}

export function useDashboardLayoutTest() {
  const context = useABTestContext();
  return context.dashboardLayout;
}

export function useCrisisInterventionTest() {
  const context = useABTestContext();
  return context.crisisIntervention;
}

// Feature flag hooks
export function useFeatureFlags() {
  const context = useABTestContext();
  return context.featureFlags;
}

export default ABTestProvider;