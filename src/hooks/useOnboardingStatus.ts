'use client';

import { useCallback } from 'react';
import { isFirstTimeUser } from '@/services/onboarding/onboardingStateService';

export function useOnboardingStatus(): { isFirstTimeUser: () => boolean } {
  return {
    isFirstTimeUser: useCallback(() => isFirstTimeUser(), []),
  };
}
