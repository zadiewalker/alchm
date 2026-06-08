'use client';

import { useEffect } from 'react';
import { hideSplashSafely, scheduleSplashHideFallback } from '@/services/platform/splashScreenService';

export function useSplashScreenDismissal(isReady: boolean): void {
  useEffect(() => {
    scheduleSplashHideFallback(2800);
  }, []);

  useEffect(() => {
    if (isReady) {
      void hideSplashSafely('document_ready');
    }
  }, [isReady]);
}
