'use client';

import { useEffect } from 'react';
import { hideSplashSafely } from '@/services/platform/splashScreenService';

export function useSplashScreenDismissal(isReady: boolean): void {
  useEffect(() => {
    if (isReady) {
      void hideSplashSafely('document_ready');
    }
  }, [isReady]);
}
