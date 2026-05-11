'use client';

import { useCallback } from 'react';
import { useSubscriptionContext } from '@/components/subscriptions/SubscriptionProvider';
import {
  canPresentNativeSubscriptionScreen,
  presentNativeSubscriptionScreen,
} from '@/services/subscriptions/nativeSubscriptionUiService';
import type { AppTier } from '@/types/user';
import type { GatedFeature } from '@/types/subscriptions';

export interface UseSubscriptionReturn {
  tier: AppTier;
  status: import('@/types/subscriptions').EntitlementStatus;
  offerings: import('@/types/subscriptions').OfferingPackageSummary[];
  isLoading: boolean;
  isReady: boolean;
  isConfigured: boolean;
  hasTransformation: boolean;
  isALCHM: boolean;
  isInTrial: boolean;
  isPurchasing: boolean;
  isRestoring: boolean;
  error: string | null;
  statusMessage: string | null;
  canPresentNativeSubscriptionScreen: boolean;
  openNativeSubscriptionScreen: () => Promise<boolean>;
  refresh: () => Promise<void>;
  getProducts: () => Promise<import('@/types/subscriptions').OfferingPackageSummary[]>;
  purchaseTransformation: () => Promise<import('@/types/subscriptions').PurchaseResult>;
  restorePurchases: () => Promise<import('@/types/subscriptions').RestoreResult>;
  canAccessFeature: (feature: GatedFeature) => boolean;
  clearStatusMessage: () => void;
}

export interface UseFeatureAccessReturn {
  tier: AppTier;
  canAccess: (feature: GatedFeature) => boolean;
  requiresUpgrade: (feature: GatedFeature) => boolean;
  hasTransformation: boolean;
  hasALCHM: boolean;
  hasSanctuary: boolean;
}

export function useSubscription(): UseSubscriptionReturn {
  const subscription = useSubscriptionContext();
  const canPresentNative = canPresentNativeSubscriptionScreen();

  const getProducts = useCallback(async () => {
    return subscription.offering?.availablePackages ?? [];
  }, [subscription.offering?.availablePackages]);

  const openNativeSubscriptionScreen = useCallback(async () => {
    const presented = await presentNativeSubscriptionScreen();

    if (presented) {
      await subscription.refresh();
    }

    return presented;
  }, [subscription.refresh]);

  return {
    tier: subscription.tier,
    status: subscription.entitlement,
    offerings: subscription.offering?.availablePackages ?? [],
    isLoading: subscription.isLoading,
    isReady: subscription.isReady,
    isConfigured: subscription.isConfigured,
    hasTransformation: subscription.hasTransformation,
    isALCHM: subscription.hasTransformation,
    isInTrial: subscription.entitlement.isInTrialPeriod,
    isPurchasing: subscription.isPurchasing,
    isRestoring: subscription.isRestoring,
    error: subscription.error,
    statusMessage: subscription.statusMessage,
    canPresentNativeSubscriptionScreen: canPresentNative,
    openNativeSubscriptionScreen,
    refresh: subscription.refresh,
    getProducts,
    purchaseTransformation: subscription.purchaseTransformation,
    restorePurchases: subscription.restorePurchases,
    canAccessFeature: subscription.canAccessFeature,
    clearStatusMessage: subscription.clearStatusMessage,
  };
}

export function useFeatureAccess(): UseFeatureAccessReturn {
  const { tier, canAccessFeature, hasTransformation } = useSubscription();
  
  const canAccess = useCallback((feature: GatedFeature) => {
    return canAccessFeature(feature);
  }, [canAccessFeature]);

  const requiresUpgrade = useCallback((feature: GatedFeature) => {
    return !canAccessFeature(feature);
  }, [canAccessFeature]);

  return {
    tier,
    canAccess,
    requiresUpgrade,
    hasTransformation,
    hasALCHM: hasTransformation,
    hasSanctuary: true,
  };
}
