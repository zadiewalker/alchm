'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  canAccessGatedFeature,
  hasTransformation,
} from '@/services/subscriptions/entitlements';
import {
  getCachedSubscriptionSnapshot,
  getFallbackEntitlementStatus,
  getSubscriptionSnapshot,
  purchaseTransformationPackage,
  restoreRevenueCatPurchases,
} from '@/services/subscriptions/revenueCatService';
import type {
  GatedFeature,
  PurchaseResult,
  RestoreResult,
  SubscriptionState,
} from '@/types/subscriptions';

export type SubscriptionController = SubscriptionState & {
  hasTransformation: boolean;
  canAccessFeature: (feature: GatedFeature) => boolean;
  refresh: () => Promise<void>;
  purchaseTransformation: () => Promise<PurchaseResult>;
  restorePurchases: () => Promise<RestoreResult>;
  clearStatusMessage: () => void;
};

const cachedSnapshot = getCachedSubscriptionSnapshot();
const initialState: SubscriptionState = {
  tier: cachedSnapshot?.entitlement.tier ?? 'sanctuary',
  entitlement: cachedSnapshot?.entitlement ?? getFallbackEntitlementStatus('fallback'),
  offering: null,
  isConfigured: cachedSnapshot?.isConfigured ?? false,
  isLoading: true,
  isReady: false,
  isPurchasing: false,
  isRestoring: false,
  lastSyncedAt: cachedSnapshot?.lastSyncedAt ?? null,
  error: null,
  statusMessage: null,
};

export function useSubscriptionController(): SubscriptionController {
  const auth = useAuth();
  const [state, setState] = useState<SubscriptionState>(initialState);

  const loadSnapshot = useCallback(async () => {
    if (auth.isLoading) {
      setState((current) => ({ ...current, isLoading: true }));
      return;
    }

    setState((current) => ({ ...current, isLoading: true, error: null }));
    try {
      const snapshot = await getSubscriptionSnapshot(auth.user?.uid ?? null);
      setState((current) => ({
        ...current,
        tier: snapshot.entitlement.tier,
        entitlement: snapshot.entitlement,
        offering: snapshot.offering,
        isConfigured: snapshot.isConfigured,
        isLoading: false,
        isReady: true,
        lastSyncedAt: snapshot.lastSyncedAt,
        error: snapshot.error ?? null,
      }));
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Subscription access could not be checked right now.';
      setState((current) => ({ ...current, isLoading: false, isReady: true, error: message }));
    }
  }, [auth.isLoading, auth.user?.uid]);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const purchaseTransformation = useCallback(async (): Promise<PurchaseResult> => {
    setState((current) => ({ ...current, isPurchasing: true, error: null, statusMessage: null }));
    try {
      const result = await purchaseTransformationPackage(
        auth.user?.uid ?? null,
        state.offering?.transformationPackage?.identifier,
      );
      setState((current) => ({
        ...current,
        tier: result.entitlement.tier,
        entitlement: result.entitlement,
        isPurchasing: false,
        isReady: true,
        lastSyncedAt: new Date(),
        error: result.status === 'error' ? result.message : null,
        statusMessage: result.status === 'purchased'
          ? 'Transformation is active.'
          : result.status === 'cancelled'
          ? 'Purchase was not completed.'
          : result.message,
      }));
      if (result.status === 'purchased') await loadSnapshot();
      return result;
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Transformation purchase could not start right now.';
      const fallback: PurchaseResult = {
        status: 'error',
        entitlement: state.entitlement,
        message,
        reason: 'config_invalid',
      };
      setState((current) => ({ ...current, isPurchasing: false, isReady: true, error: message }));
      return fallback;
    }
  }, [auth.user?.uid, loadSnapshot, state.entitlement, state.offering?.transformationPackage?.identifier]);

  const restorePurchases = useCallback(async (): Promise<RestoreResult> => {
    setState((current) => ({ ...current, isRestoring: true, error: null, statusMessage: null }));
    try {
      const result = await restoreRevenueCatPurchases(auth.user?.uid ?? null);
      setState((current) => ({
        ...current,
        tier: result.entitlement.tier,
        entitlement: result.entitlement,
        isRestoring: false,
        isReady: true,
        lastSyncedAt: new Date(),
        error: result.status === 'error' ? result.message : null,
        statusMessage: result.message,
      }));
      if (result.status === 'restored') await loadSnapshot();
      return result;
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'We couldn’t restore purchases right now.\nPlease try again.';
      const fallback: RestoreResult = {
        status: 'error',
        entitlement: state.entitlement,
        message,
        reason: 'config_invalid',
      };
      setState((current) => ({
        ...current,
        isRestoring: false,
        isReady: true,
        error: message,
        statusMessage: message,
      }));
      return fallback;
    }
  }, [auth.user?.uid, loadSnapshot, state.entitlement]);

  return useMemo(() => ({
    ...state,
    hasTransformation: hasTransformation(state),
    canAccessFeature: (feature: GatedFeature) => canAccessGatedFeature(feature, state),
    refresh: loadSnapshot,
    purchaseTransformation,
    restorePurchases,
    clearStatusMessage: () => setState((current) => ({ ...current, statusMessage: null, error: null })),
  }), [loadSnapshot, purchaseTransformation, restorePurchases, state]);
}
