'use client';

import { useMemo } from 'react';
import { recordOperationalBreadcrumb, recordOperationalEvent } from '@/services/monitoring/telemetry';
import { hideSplashSafely, scheduleSplashHideFallback, syncNativeSplashScreen } from '@/services/platform/splashScreenService';
import { hasCachedUserSession, isOnboardingComplete } from '@/services/storage/storageMigrationService';
import type { User } from 'firebase/auth';

type AuthReadyHandler = (user: User | null) => void;

export type RootRuntimeServices = {
  hasCachedSession: () => boolean;
  hideSplashSafely: typeof hideSplashSafely;
  isOnboardingComplete: typeof isOnboardingComplete;
  recordOperationalBreadcrumb: typeof recordOperationalBreadcrumb;
  recordOperationalEvent: typeof recordOperationalEvent;
  scheduleSplashHideFallback: typeof scheduleSplashHideFallback;
  startAuthListener: (
    timeoutMs: number,
    onReady: AuthReadyHandler,
  ) => Promise<() => void>;
  syncNativeSplashScreen: typeof syncNativeSplashScreen;
};

export function useRootRuntimeServices(): RootRuntimeServices {
  return useMemo(
    () => ({
      hasCachedSession: hasCachedUserSession,
      hideSplashSafely,
      isOnboardingComplete,
      recordOperationalBreadcrumb,
      recordOperationalEvent,
      scheduleSplashHideFallback,
      syncNativeSplashScreen,
      startAuthListener: async (timeoutMs, onReady) => {
        const authModule = await import('@/services/auth/authService');
        const unsubscribe = authModule.onAuthChanged(onReady);
        authModule.ensureAuth(timeoutMs).catch(() => {
          // The auth listener or caller-owned timeout handles offline and failed auth startup.
        });
        return unsubscribe;
      },
    }),
    [],
  );
}
