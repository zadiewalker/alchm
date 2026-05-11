'use client';

import { useCallback } from 'react';
import type { BackNavigationConfig } from '@/types/navigation';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';

function hasNativeBackEntry(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const state = window.history.state as { idx?: unknown } | null;
  if (typeof state?.idx === 'number') {
    return state.idx > 0;
  }

  return window.history.length > 1;
}

export function useSafeBackNavigation(config: BackNavigationConfig): { goBack: () => void } {
  const { navigate } = useSafeNavigation();

  const goBack = useCallback(() => {
    if (hasNativeBackEntry()) {
      window.history.back();
      return;
    }

    navigate(config.fallback, {
      replace: true,
      source: 'safe_back_fallback',
    });
  }, [config.fallback, navigate]);

  return { goBack };
}
