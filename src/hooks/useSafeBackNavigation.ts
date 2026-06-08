'use client';

import { useCallback } from 'react';
import type { BackNavigationConfig } from '@/types/navigation';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';

const BACK_SHELL_RECOVERY_MS = 700;
const BACK_SHELL_SETTLED_RECOVERY_MS = 1700;

function hasNativeBackEntry(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const state = window.history.state as { idx?: unknown } | null;
  if (typeof state?.idx === 'number') {
    return state.idx > 0;
  }

  return false;
}

function hasMainShellNavigation(): boolean {
  if (typeof document === 'undefined') {
    return true;
  }

  return Boolean(document.querySelector('nav[aria-label="Primary navigation"]'));
}

export function useSafeBackNavigation(config: BackNavigationConfig): { goBack: () => void } {
  const { navigate } = useSafeNavigation();

  const goBack = useCallback(() => {
    const recoverShell = (): void => {
      if (!hasMainShellNavigation()) {
        navigate(config.fallback, {
          replace: true,
          source: 'safe_back_shell_recovery',
        });
      }
    };

    if (hasNativeBackEntry()) {
      window.history.back();
      window.setTimeout(recoverShell, BACK_SHELL_RECOVERY_MS);
      window.setTimeout(recoverShell, BACK_SHELL_SETTLED_RECOVERY_MS);
      return;
    }

    navigate(config.fallback, {
      replace: true,
      source: 'safe_back_fallback',
    });
  }, [config.fallback, navigate]);

  return { goBack };
}
