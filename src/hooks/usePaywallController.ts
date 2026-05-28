'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  loadCurrentPaywallOfferingState,
  restoreRevenueCatPurchases,
} from '@/services/subscription/subscriptionService';
import { recordOperationalEvent } from '@/services/monitoring/telemetry';

export type PaywallStatus = { error: string | null; status: string | null };
export type PaywallOfferState =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; packageId: string; priceLine: string | null }
  | { status: 'unavailable' | 'error'; message: string };

export function usePaywallController() {
  const auth = useAuth();
  const [offerState, setOfferState] = useState<PaywallOfferState>({ status: 'idle' });
  const [isRestoring, setIsRestoring] = useState(false);
  const [feedback, setFeedback] = useState<PaywallStatus>({ error: null, status: null });

  useEffect(() => {
    let active = true;
    const loadOffering = async () => {
      setOfferState({ status: 'loading' });
      try {
        const nextState = await loadCurrentPaywallOfferingState(auth.userId ?? null);
        if (!active) return;
        if (nextState.status === 'ready') {
          setOfferState({
            status: 'ready',
            packageId: nextState.aPackage.identifier,
            priceLine: nextState.aPackage.product.priceString
              ? `${nextState.aPackage.product.priceString}/month`
              : null,
          });
          return;
        }
        setOfferState(nextState);
      } catch {
        if (active) setOfferState({ status: 'error', message: 'Subscription options aren’t available right now.' });
      }
    };
    void loadOffering();
    return () => {
      active = false;
    };
  }, [auth.userId]);

  const recordTransformationCtaTap = useCallback(() => {
    recordOperationalEvent('transformation_cta_tap', {
      surface: 'upgrade',
      route: '/paywall',
      hasOffering: offerState.status === 'ready',
    });
  }, [offerState.status]);

  const restore = useCallback(async () => {
    if (isRestoring) return null;
    setIsRestoring(true);
    setFeedback({ error: null, status: null });
    try {
      const result = await restoreRevenueCatPurchases(auth.userId ?? null);
      if (result.message) {
        setFeedback({
          error: result.status === 'error' ? result.message : null,
          status: result.status === 'error' ? null : result.message,
        });
      }
      return result;
    } finally {
      setIsRestoring(false);
    }
  }, [auth.userId, isRestoring]);

  const helperLine = useMemo(() => {
    if (offerState.status === 'loading' || offerState.status === 'idle') return ' ';
    return offerState.status === 'ready' ? offerState.priceLine : null;
  }, [offerState]);

  return {
    offerState,
    isRestoring,
    feedback,
    helperLine,
    recordTransformationCtaTap,
    restore,
  };
}
