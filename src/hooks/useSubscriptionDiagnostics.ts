'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  getRevenueCatHealthCheck,
  type RevenueCatHealthCheck,
} from '@/services/subscriptions/revenueCatService';

type SubscriptionDiagnosticsState = {
  diagnostics: RevenueCatHealthCheck | null;
  isRunning: boolean;
  error: string | null;
  runDiagnostics: () => Promise<void>;
};

export function useSubscriptionDiagnostics(): SubscriptionDiagnosticsState {
  const auth = useAuth();
  const [diagnostics, setDiagnostics] = useState<RevenueCatHealthCheck | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = useCallback(async (): Promise<void> => {
    if (isRunning) {
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      const health = await getRevenueCatHealthCheck(auth.userId ?? null);
      setDiagnostics(health);

      if (process.env.NODE_ENV !== 'production') {
        console.info('[RC diagnostics]', health);
      }
    } catch {
      setError('Subscription diagnostics could not run right now.');
    } finally {
      setIsRunning(false);
    }
  }, [auth.userId, isRunning]);

  return {
    diagnostics,
    isRunning,
    error,
    runDiagnostics,
  };
}
