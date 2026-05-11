export type SubscriptionTier = 'sanctuary' | 'transformation';

export type GatedFeature =
  | 'reflection_export'
  | 'conversation_summary'
  | 'long_range_returns'
  | 'continuity_depth';

export interface EntitlementStatus {
  tier: SubscriptionTier;
  hasTransformation: boolean;
  isActive: boolean;
  willRenew: boolean;
  expiresAt: Date | null;
  isInTrialPeriod: boolean;
  isSandbox: boolean;
  managementUrl: string | null;
  entitlementId: string | null;
  productIdentifier: string | null;
  source: 'revenuecat' | 'cache' | 'fallback';
}

export interface OfferingPackageSummary {
  identifier: string;
  packageType: string;
  productIdentifier: string;
  title: string;
  description: string;
  priceString: string;
  billingPeriodLabel: string | null;
  offeringIdentifier: string;
}

export interface OfferingSummary {
  offeringId: string | null;
  description: string;
  availablePackages: OfferingPackageSummary[];
  transformationPackage: OfferingPackageSummary | null;
  fetchedAt: Date | null;
}

export interface PurchaseResult {
  status: 'purchased' | 'cancelled' | 'error';
  entitlement: EntitlementStatus;
  message: string | null;
  reason?: 'config_invalid' | 'platform_unavailable' | 'offering_unavailable' | 'purchase_failed';
}

export interface RestoreResult {
  status: 'restored' | 'not_found' | 'error';
  entitlement: EntitlementStatus;
  message: string;
  reason?: 'config_invalid' | 'platform_unavailable' | 'restore_failed' | 'not_found';
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  entitlement: EntitlementStatus;
  offering: OfferingSummary | null;
  isConfigured: boolean;
  isLoading: boolean;
  isReady: boolean;
  isPurchasing: boolean;
  isRestoring: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
  statusMessage: string | null;
}

export interface SubscriptionSnapshot {
  entitlement: EntitlementStatus;
  offering: OfferingSummary | null;
  isConfigured: boolean;
  lastSyncedAt: Date | null;
  error?: string | null;
}
