'use client';

import { useState, useCallback } from 'react';
import {
  completeOnboardingState,
  loadOnboardingState,
  saveOnboardingState,
} from '@/services/onboarding/onboardingStateService';
import type {
  OnboardingState,
  OnboardingScreen,
} from '@/types/onboarding';

type UseOnboardingReturn = {
  state: OnboardingState;
  update: (updates: Partial<OnboardingState>) => void;
  advance: (screen: OnboardingScreen) => void;
  complete: () => void;
};

export function useOnboarding(): UseOnboardingReturn {
  const [state, setState] = useState<OnboardingState>(loadOnboardingState);

  const update = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      saveOnboardingState(next);
      return next;
    });
  }, []);

  const advance = useCallback((screen: OnboardingScreen) => {
    update({ currentScreen: screen });
  }, [update]);

  const complete = useCallback(() => {
    const completedAt = completeOnboardingState(state);
    const completed = { completedAt };

    setState((prev) => {
      const next = { ...prev, ...completed };
      saveOnboardingState(next);
      return next;
    });
  }, [state]);

  return { state, update, advance, complete };
}
