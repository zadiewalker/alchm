import {
  SUBSCRIPTION_COPY,
} from '@/config/subscriptions';
import {
  assertRevenueCatConfigReady,
  REVENUECAT_DEFAULT_OFFERING_ID,
  REVENUECAT_ENTITLEMENT_ID,
  REVENUECAT_MONTHLY_PACKAGE_ID,
  REVENUECAT_TRANSFORMATION_PRODUCT_ID,
  revenueCatConfig,
  revenueCatConfigStatus,
} from '@/config/revenueCat';
import { debugOfferings } from '@/services/revenuecat/debugOfferings';
import {
  resolveRevenueCatOfferingsState,
  type RevenueCatOfferingsLoadState,
} from '@/services/revenuecat/loadOfferings';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { getPlatform, isNativePlatform } from '@/services/platform/platformService';
import { getNativeSubscriptionDiagnostics } from '@/services/subscriptions/nativeSubscriptionUiService';
import {
  recordOperationalBreadcrumb,
  recordOperationalEvent,
  recordOperationalException,
} from '@/services/monitoring/telemetry';
import {
  Purchases,
  type RevenueCatCustomerInfo,
  type RevenueCatError,
  type RevenueCatOfferings,
  type RevenueCatPackage,
  type RevenueCatPurchaseResult,
  type RevenueCatStoreProduct,
} from '@/services/subscriptions/revenueCatPlugin';
import type {
  EntitlementStatus,
  OfferingPackageSummary,
  OfferingSummary,
  PurchaseResult,
  RestoreResult,
  SubscriptionSnapshot,
} from '@/types/subscriptions';
import {
  getStorageItemWithFallback,
  removeStorageItemNormalized,
  setStorageItemNormalized,
} from '@/utils/storage';
import { IOS_BUILD_NUMBER } from '@/config/releaseInfo';

interface RevenueCatEntitlementInfo {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
  productIdentifier: string;
  expirationDate?: string | null;
  periodType?: string | null;
  isSandbox: boolean;
}

type RevenueCatIdentityAction = 'configure' | 'login' | 'logout' | 'none';
const OFFERING_PACKAGE_CACHE = new Map<string, RevenueCatPackage>();
const REVENUECAT_ACCESS_TIMEOUT_MS = 3500;

let isConfigured = false;
let currentAppUserId: string | null = null;
let hasLoggedConfiguration = false;
let hasLoggedOfferingsLoaded = false;
let lastPurchaseErrorCategory: string | null = null;
let lastRestoreErrorCategory: string | null = null;
let lastOfferingsResultCategory: string | null = null;
let lastOfferingIdsReturned: string[] = [];
let lastCurrentOfferingIsNull: boolean | null = null;
let configureAttempted = false;
const CALM_UNAVAILABLE_MESSAGE = 'Subscription options aren’t available right now.';

function isDevelopmentLoggingEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}

function logRevenueCatEvent(
  event: string,
  details: Record<string, unknown> = {},
): void {
  if (isDevelopmentLoggingEnabled()) {
    console.log(`[RC] ${event}`, details);
  }
}

type RevenueCatTimedResult<T> =
  | {
      status: 'success';
      value: T;
      durationMs: number;
    }
  | {
      status: 'timeout' | 'error';
      value: null;
      durationMs: number;
    };

function getDurationMs(startedAt: number): number {
  return Math.max(0, Date.now() - startedAt);
}

function fingerprintIdentifier(value: string | null | undefined): string | null {
  const normalized = value?.trim() ?? '';
  if (!normalized) {
    return null;
  }

  if (normalized.length <= 10) {
    return `${normalized.slice(0, 2)}…${normalized.slice(-2)}`;
  }

  return `${normalized.slice(0, 5)}…${normalized.slice(-4)}`;
}

function getCustomerInfoAppUserId(customerInfo: RevenueCatCustomerInfo | null | undefined): string | null {
  return customerInfo?.originalAppUserId ?? customerInfo?.originalAppUserID ?? null;
}

async function runRevenueCatOperation<T>(
  operation: string,
  work: () => Promise<T>,
  timeoutMs: number = REVENUECAT_ACCESS_TIMEOUT_MS,
): Promise<RevenueCatTimedResult<T>> {
  const startedAt = Date.now();

  try {
    const outcome = await Promise.race([
      work().then((value) => ({ kind: 'success' as const, value })),
      new Promise<{ kind: 'timeout' }>((resolve) => {
        globalThis.setTimeout(() => resolve({ kind: 'timeout' }), timeoutMs);
      }),
    ]);

    const durationMs = getDurationMs(startedAt);

    if (outcome.kind === 'timeout') {
      logRevenueCatEvent(`${operation} timeout`, { durationMs, timeoutMs });
      recordOperationalEvent('subscription_access', {
        state: 'timeout',
        issue: operation,
        source: 'revenuecat',
        durationMs,
        timeoutMs,
      });
      recordOperationalBreadcrumb('revenuecat.timeout', {
        issue: operation,
        source: 'revenuecat',
        durationMs,
        timeoutMs,
      });

      return {
        status: 'timeout',
        value: null,
        durationMs,
      };
    }

    recordOperationalBreadcrumb('revenuecat.success', {
      issue: operation,
      source: 'revenuecat',
      durationMs,
    });

    return {
      status: 'success',
      value: outcome.value,
      durationMs,
    };
  } catch (error) {
    const durationMs = getDurationMs(startedAt);
    logRevenueCatEvent(`${operation} failed`, { durationMs });
    recordOperationalException('subscription_access', error, {
      state: 'error',
      issue: operation,
      source: 'revenuecat',
      durationMs,
    });
    recordOperationalBreadcrumb('revenuecat.error', {
      issue: operation,
      source: 'revenuecat',
      durationMs,
    });

    return {
      status: 'error',
      value: null,
      durationMs,
    };
  }
}

function getSubscriptionCacheKey(): string {
  return STORAGE_KEYS.SUBSCRIPTION_CACHE;
}

export function getFallbackEntitlementStatus(
  source: EntitlementStatus['source'] = 'fallback',
): EntitlementStatus {
  return {
    tier: 'sanctuary',
    hasTransformation: false,
    isActive: false,
    willRenew: false,
    expiresAt: null,
    isInTrialPeriod: false,
    isSandbox: false,
    managementUrl: null,
    entitlementId: null,
    productIdentifier: null,
    source,
  };
}

function parseOptionalDate(value?: string | null): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toBillingPeriodLabel(product: RevenueCatStoreProduct): string | null {
  const iso8601 =
    product.subscriptionPeriod ??
    product.period ??
    product.defaultOption?.pricingPhases?.[0]?.billingPeriod?.iso8601 ??
    null;

  if (!iso8601) {
    return null;
  }

  if (iso8601.includes('P1M')) return 'Monthly';
  if (iso8601.includes('P1Y')) return 'Yearly';
  if (iso8601.includes('P1W')) return 'Weekly';
  return null;
}

export function mapOfferingsToSummary(
  offerings: RevenueCatOfferings | null | undefined,
  offeringId: string = revenueCatConfig.offeringId,
): OfferingSummary | null {
  const current =
    offerings?.current ??
    (offerings?.all ? offerings.all[offeringId] ?? null : null);

  if (!current) {
    return null;
  }

  OFFERING_PACKAGE_CACHE.clear();

  const availablePackages: OfferingPackageSummary[] = current.availablePackages.map((aPackage) => {
    OFFERING_PACKAGE_CACHE.set(aPackage.identifier, aPackage);
    return {
      identifier: aPackage.identifier,
      packageType: aPackage.packageType,
      productIdentifier: aPackage.product.identifier,
      title: aPackage.product.title ?? 'Transformation',
      description: aPackage.product.description ?? '',
      priceString: aPackage.product.priceString ?? SUBSCRIPTION_COPY.tiers.transformation.price,
      billingPeriodLabel: toBillingPeriodLabel(aPackage.product),
      offeringIdentifier: aPackage.offeringIdentifier,
    };
  });

  const transformationPackage =
    availablePackages.find((item) =>
      item.identifier === REVENUECAT_MONTHLY_PACKAGE_ID &&
      item.productIdentifier === REVENUECAT_TRANSFORMATION_PRODUCT_ID
    ) ??
    null;

  return {
    offeringId: current.identifier,
    description: current.serverDescription ?? '',
    availablePackages,
    transformationPackage,
    fetchedAt: new Date(),
  };
}

export function mapCustomerInfoToEntitlementStatus(
  customerInfo: RevenueCatCustomerInfo | null | undefined,
  entitlementId: string = REVENUECAT_ENTITLEMENT_ID,
): EntitlementStatus {
  const entitlement =
    customerInfo?.entitlements?.active?.[entitlementId] ?? null;

  if (!entitlement?.isActive) {
    logRevenueCatEvent('entitlement not active', {
      entitlement: entitlementId,
      managementUrlPresent: Boolean(customerInfo?.managementURL),
    });
    return {
      ...getFallbackEntitlementStatus('revenuecat'),
      managementUrl: customerInfo?.managementURL ?? null,
    };
  }

  logRevenueCatEvent('entitlement active', {
    entitlement: entitlement.identifier,
    productIdentifier: entitlement.productIdentifier,
    willRenew: entitlement.willRenew,
    isSandbox: entitlement.isSandbox,
  });

  return {
    tier: 'transformation',
    hasTransformation: true,
    isActive: true,
    willRenew: entitlement.willRenew,
    expiresAt: parseOptionalDate(entitlement.expirationDate),
    isInTrialPeriod: entitlement.periodType === 'TRIAL',
    isSandbox: entitlement.isSandbox,
    managementUrl: customerInfo?.managementURL ?? null,
    entitlementId: entitlement.identifier,
    productIdentifier: entitlement.productIdentifier,
    source: 'revenuecat',
  };
}

function getRevenueCatConfigurationState(): {
  isAvailable: boolean;
  reason: 'config_invalid' | 'platform_unavailable' | null;
  error: string | null;
} {
  const configStatus = assertRevenueCatConfigReady();

  if (!hasLoggedConfiguration) {
    if (isDevelopmentLoggingEnabled()) {
      console.log('[RC CONFIG]', configStatus.diagnostics);
      if (!configStatus.isValid && configStatus.error) {
        console.error(configStatus.error);
      }
    }
    hasLoggedConfiguration = true;
  }

  if (!configStatus.isValid) {
    return {
      isAvailable: false,
      reason: 'config_invalid',
      error: CALM_UNAVAILABLE_MESSAGE,
    };
  }

  if (!isNativePlatform()) {
    return {
      isAvailable: false,
      reason: 'platform_unavailable',
      error: 'Transformation purchase is not available on this device right now.',
    };
  }

  return {
    isAvailable: true,
    reason: null,
    error: null,
  };
}

function getPurchasesAvailable(): boolean {
  return revenueCatConfigStatus.isValid && isNativePlatform();
}

function readCachedSnapshot(): SubscriptionSnapshot | null {
  try {
    const raw = getStorageItemWithFallback(getSubscriptionCacheKey());
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as {
      entitlement?: Omit<EntitlementStatus, 'expiresAt'> & { expiresAt: string | null };
      lastSyncedAt?: string | null;
    };

    if (!parsed.entitlement) {
      return null;
    }

    return {
      entitlement: {
        ...parsed.entitlement,
        expiresAt: parseOptionalDate(parsed.entitlement.expiresAt),
      },
      offering: null,
      isConfigured: getPurchasesAvailable(),
      lastSyncedAt: parseOptionalDate(parsed.lastSyncedAt),
      error: null,
    };
  } catch {
    return null;
  }
}

function writeCachedSnapshot(snapshot: SubscriptionSnapshot): void {
  try {
    setStorageItemNormalized(
      getSubscriptionCacheKey(),
      JSON.stringify({
        entitlement: {
          ...snapshot.entitlement,
          expiresAt: snapshot.entitlement.expiresAt?.toISOString() ?? null,
        },
        lastSyncedAt: snapshot.lastSyncedAt?.toISOString() ?? null,
      }),
    );
  } catch {
    // no-op
  }
}

export function clearCachedSubscriptionSnapshot(): void {
  removeStorageItemNormalized(getSubscriptionCacheKey());
}

export function getCachedSubscriptionSnapshot(): SubscriptionSnapshot | null {
  return readCachedSnapshot();
}

export function resolveRevenueCatIdentityAction(
  previousUserId: string | null,
  nextUserId: string | null,
  alreadyConfigured: boolean,
  purchasesAvailable: boolean = getPurchasesAvailable(),
): RevenueCatIdentityAction {
  if (!purchasesAvailable) {
    return 'none';
  }

  if (!alreadyConfigured) {
    return 'configure';
  }

  if (!nextUserId) {
    return previousUserId ? 'logout' : 'none';
  }

  if (previousUserId === nextUserId) {
    return 'none';
  }

  return 'login';
}

async function syncRevenueCatIdentity(userId: string | null): Promise<boolean> {
  const action = resolveRevenueCatIdentityAction(currentAppUserId, userId, isConfigured);

  const availability = getRevenueCatConfigurationState();

  if (!availability.isAvailable) {
    return false;
  }

  if (action === 'none') {
    return isConfigured;
  }

  if (action === 'configure') {
    configureAttempted = true;
    const result = await runRevenueCatOperation('configure', () =>
      Purchases.configure({
        apiKey: revenueCatConfig.apiKey,
        appUserID: userId ?? undefined,
      }),
    );
    if (result.status !== 'success') {
      return false;
    }
    logRevenueCatEvent('configured', {
      appUserIdPresent: Boolean(userId),
      offeringId: revenueCatConfig.offeringId,
      entitlement: REVENUECAT_ENTITLEMENT_ID,
    });
    isConfigured = true;
    currentAppUserId = userId;
    return true;
  }

  if (action === 'login' && userId) {
    const result = await runRevenueCatOperation('log_in', () =>
      Purchases.logIn({ appUserID: userId }),
    );
    if (result.status !== 'success') {
      return false;
    }
    logRevenueCatEvent('login synced', { appUserIdPresent: true });
    currentAppUserId = userId;
    return true;
  }

  if (action === 'logout') {
    const result = await runRevenueCatOperation('log_out', () =>
      Purchases.logOut(),
    );
    if (result.status !== 'success') {
      return false;
    }
    logRevenueCatEvent('logout synced');
    currentAppUserId = null;
    return true;
  }

  return isConfigured;
}

async function getCustomerInfoSafe(): Promise<RevenueCatCustomerInfo | null> {
  const result = await runRevenueCatOperation('customer_info', async () => {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo;
  });

  if (result.status !== 'success') {
    logRevenueCatEvent('customer info unavailable', {
      reason: result.status,
      durationMs: result.durationMs,
    });
    return null;
  }

  recordOperationalEvent('subscription_access', {
    state: 'customer_info_resolved',
    issue: 'customer_info',
    source: 'revenuecat',
    durationMs: result.durationMs,
    result: 'success',
  });

  return result.value;
}

async function getOfferingsSafe(): Promise<RevenueCatOfferings | null> {
  const result = await runRevenueCatOperation('offerings', () => debugOfferings());

  if (result.status !== 'success') {
    lastOfferingsResultCategory = result.status;
    lastOfferingIdsReturned = [];
    lastCurrentOfferingIsNull = null;
    logRevenueCatEvent('offerings unavailable', {
      reason: result.status,
      durationMs: result.durationMs,
      offeringId: revenueCatConfig.offeringId,
    });
    recordOperationalEvent('subscription_access', {
      state: 'offerings_unavailable',
      issue: revenueCatConfig.offeringId,
      source: result.status,
      durationMs: result.durationMs,
      result: result.status,
    });
    recordOperationalEvent('purchase_failure', {
      state: 'offering_unavailable',
      issue: revenueCatConfig.offeringId,
      source: result.status,
    });
    return null;
  }

  const offerings = result.value;
  if (!offerings) {
    lastOfferingsResultCategory = 'empty_object';
    lastOfferingIdsReturned = [];
    lastCurrentOfferingIsNull = null;
    return null;
  }

  const offeringIds = Object.keys(offerings.all ?? {});
  lastOfferingsResultCategory =
    offeringIds.length === 0 && !offerings.current ? 'empty_object' : 'success';
  lastOfferingIdsReturned = offeringIds;
  lastCurrentOfferingIsNull = offerings.current == null;

  recordOperationalEvent('subscription_access', {
    state: 'offerings_resolved',
    issue: revenueCatConfig.offeringId,
    source: 'revenuecat',
    durationMs: result.durationMs,
    result: 'success',
  });

  return offerings;
}

export async function getSubscriptionSnapshot(
  userId: string | null,
): Promise<SubscriptionSnapshot> {
  const startedAt = Date.now();
  const cached = readCachedSnapshot();
  const availability = getRevenueCatConfigurationState();

  recordOperationalBreadcrumb('subscription.access.start', {
    source: 'subscription_provider',
    configured: availability.isAvailable,
    result: cached?.entitlement.source ?? 'none',
  });

  if (!availability.isAvailable) {
    return {
      entitlement: cached?.entitlement ?? getFallbackEntitlementStatus('fallback'),
      offering: null,
      isConfigured: false,
      lastSyncedAt: cached?.lastSyncedAt ?? null,
      error: availability.error,
    };
  }

  const configured = await syncRevenueCatIdentity(userId);

  const [customerInfo, offerings] = await Promise.all([
    getCustomerInfoSafe(),
    getOfferingsSafe(),
  ]);

  const entitlement =
    customerInfo
      ? mapCustomerInfoToEntitlementStatus(customerInfo, REVENUECAT_ENTITLEMENT_ID)
      : cached?.entitlement ?? getFallbackEntitlementStatus('fallback');
  const offering = mapOfferingsToSummary(offerings, revenueCatConfig.offeringId);
  const usedFallback = !customerInfo;

  const snapshot: SubscriptionSnapshot = {
    entitlement,
    offering,
    isConfigured: configured || Boolean(customerInfo || offerings),
    lastSyncedAt: customerInfo || offerings ? new Date() : cached?.lastSyncedAt ?? null,
    error: usedFallback
      ? 'Access could not be confirmed right now.\nSanctuary remains available.'
      : offerings
      ? null
      : 'Transformation purchase is unavailable right now.\nSanctuary remains available.',
  };

  if (!hasLoggedOfferingsLoaded && snapshot.offering) {
    if (isDevelopmentLoggingEnabled()) {
      console.log('[RC] offerings loaded');
    }
    hasLoggedOfferingsLoaded = true;
  }
  if (!snapshot.offering) {
    logRevenueCatEvent('offering missing', {
      offeringId: revenueCatConfig.offeringId,
    });
    recordOperationalEvent('purchase_failure', {
      state: 'offering_missing',
      issue: revenueCatConfig.offeringId,
    });
  }

  recordOperationalEvent('subscription_access', {
    state: usedFallback ? 'fallback' : 'resolved',
    issue: usedFallback ? 'customer_info' : 'subscription_snapshot',
    source: snapshot.entitlement.source,
    hasAccess: snapshot.entitlement.hasTransformation,
    durationMs: getDurationMs(startedAt),
    result: usedFallback ? 'fallback' : 'success',
    configured: snapshot.isConfigured,
  });
  recordOperationalBreadcrumb('subscription.access.resolved', {
    source: snapshot.entitlement.source,
    durationMs: getDurationMs(startedAt),
    result: usedFallback ? 'fallback' : 'success',
    configured: snapshot.isConfigured,
  });

  writeCachedSnapshot(snapshot);
  return snapshot;
}

export interface RevenueCatHealthCheck {
  platform: string;
  isNativeIos: boolean;
  isConfigured: boolean;
  apiKeyPresent: boolean;
  apiKeySource: 'static';
  apiKeyFingerprint: string | null;
  configValid: boolean;
  configureAttempted: boolean;
  nativePluginCallSucceeded: boolean;
  nativePluginErrorCategory: string | null;
  nativePluginErrorMessage: string | null;
  nativeConfigFound: boolean;
  plistKeyName: string | null;
  plistKeyFound: boolean;
  nativeApiKeyPrefix: string | null;
  nativeApiKeyFingerprint: string | null;
  nativeAppBundleId: string | null;
  nativeBundleVersion: string | null;
  nativeBundleShortVersion: string | null;
  nativeBridgeControllerActive: boolean;
  nativePluginRegistered: boolean;
  buildNumber: string;
  sdkAppUserIdPresent: boolean;
  sdkAppUserIdFingerprint: string | null;
  offeringRequested: string;
  offeringsResultCategory: string | null;
  allOfferingIdsReturned: string[];
  currentOfferingIsNull: boolean | null;
  currentOfferingId: string | null;
  currentOfferingFound: boolean;
  availablePackagesCount: number;
  packageIdentifiers: string[];
  productIdentifiers: string[];
  expectedPackageFound: boolean;
  expectedProductFound: boolean;
  entitlementIdentifierExpected: string;
  entitlementActive: boolean;
  nativePaywallAvailable: boolean;
  lastErrorCategory: string | null;
  lastPurchaseErrorCategory: string | null;
  lastRestoreErrorCategory: string | null;
}

export async function getRevenueCatHealthCheck(
  userId: string | null,
): Promise<RevenueCatHealthCheck> {
  const availability = getRevenueCatConfigurationState();
  const platform = getPlatform();
  const isNativeIos = isNativePlatform() && platform === 'ios';
  const nativeDiagnostics = await getNativeSubscriptionDiagnostics();
  const base: RevenueCatHealthCheck = {
    platform,
    isNativeIos,
    isConfigured,
    apiKeyPresent: Boolean(revenueCatConfig.apiKey),
    apiKeySource: revenueCatConfig.apiKeySource,
    apiKeyFingerprint: revenueCatConfigStatus.diagnostics.keyFingerprint,
    configValid: revenueCatConfigStatus.isValid,
    configureAttempted,
    nativePluginCallSucceeded: nativeDiagnostics.nativePluginCallSucceeded,
    nativePluginErrorCategory: nativeDiagnostics.nativePluginErrorCategory,
    nativePluginErrorMessage: nativeDiagnostics.nativePluginErrorMessage,
    nativeConfigFound: nativeDiagnostics.nativeConfigFound,
    plistKeyName: nativeDiagnostics.plistKeyName,
    plistKeyFound: nativeDiagnostics.plistKeyFound,
    nativeApiKeyPrefix: nativeDiagnostics.apiKeyPrefix,
    nativeApiKeyFingerprint: nativeDiagnostics.apiKeyFingerprint,
    nativeAppBundleId: nativeDiagnostics.appBundleId,
    nativeBundleVersion: nativeDiagnostics.bundleVersion,
    nativeBundleShortVersion: nativeDiagnostics.bundleShortVersion,
    nativeBridgeControllerActive: nativeDiagnostics.bridgeControllerActive,
    nativePluginRegistered: nativeDiagnostics.pluginRegistered,
    buildNumber: IOS_BUILD_NUMBER,
    sdkAppUserIdPresent: false,
    sdkAppUserIdFingerprint: null,
    offeringRequested: REVENUECAT_DEFAULT_OFFERING_ID,
    offeringsResultCategory: lastOfferingsResultCategory,
    allOfferingIdsReturned: lastOfferingIdsReturned,
    currentOfferingIsNull: lastCurrentOfferingIsNull,
    currentOfferingId: null,
    currentOfferingFound: false,
    availablePackagesCount: 0,
    packageIdentifiers: [],
    productIdentifiers: [],
    expectedPackageFound: false,
    expectedProductFound: false,
    entitlementIdentifierExpected: REVENUECAT_ENTITLEMENT_ID,
    entitlementActive: false,
    nativePaywallAvailable: isNativeIos,
    lastErrorCategory: availability.reason,
    lastPurchaseErrorCategory,
    lastRestoreErrorCategory,
  };

  if (!availability.isAvailable) {
    return base;
  }

  const configured = await syncRevenueCatIdentity(userId);
  const [customerInfo, offerings] = await Promise.all([
    getCustomerInfoSafe(),
    getOfferingsSafe(),
  ]);
  const currentOffering =
    offerings?.current ??
    (offerings?.all ? offerings.all[revenueCatConfig.offeringId] ?? null : null);
  const packages = currentOffering?.availablePackages ?? [];
  const entitlement = customerInfo
    ? mapCustomerInfoToEntitlementStatus(customerInfo, REVENUECAT_ENTITLEMENT_ID)
    : null;
  const sdkAppUserId = getCustomerInfoAppUserId(customerInfo);
  const lastErrorCategory =
    !configured
      ? 'configure_failed'
      : !customerInfo
      ? 'customer_info_unavailable'
      : !currentOffering
      ? 'offering_missing'
      : packages.length === 0
      ? 'packages_empty'
      : null;

  return {
    ...base,
    isConfigured: configured || isConfigured,
    configureAttempted,
    sdkAppUserIdPresent: Boolean(sdkAppUserId),
    sdkAppUserIdFingerprint: fingerprintIdentifier(sdkAppUserId),
    offeringsResultCategory: lastOfferingsResultCategory,
    allOfferingIdsReturned: lastOfferingIdsReturned,
    currentOfferingIsNull: lastCurrentOfferingIsNull,
    currentOfferingId: currentOffering?.identifier ?? null,
    currentOfferingFound: Boolean(currentOffering),
    availablePackagesCount: packages.length,
    packageIdentifiers: packages.map((aPackage) => aPackage.identifier),
    productIdentifiers: packages.map((aPackage) => aPackage.product.identifier),
    expectedPackageFound: packages.some((aPackage) => aPackage.identifier === REVENUECAT_MONTHLY_PACKAGE_ID),
    expectedProductFound: packages.some((aPackage) => aPackage.product.identifier === REVENUECAT_TRANSFORMATION_PRODUCT_ID),
    entitlementActive: entitlement?.hasTransformation ?? false,
    lastErrorCategory,
    lastPurchaseErrorCategory,
    lastRestoreErrorCategory,
  };
}

function getPurchaseErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const value = (error as { message?: unknown }).message;
    return typeof value === 'string' ? value : 'Something interrupted the purchase.';
  }

  return 'Something interrupted the purchase.';
}

function isPurchaseCancelled(error: unknown): boolean {
  return Boolean(
    typeof error === 'object' &&
      error !== null &&
      'userCancelled' in error &&
      (error as RevenueCatError).userCancelled,
  );
}

function resolveEntitlementFromCustomerInfo(
  customerInfo: RevenueCatCustomerInfo,
): EntitlementStatus {
  const entitlement = mapCustomerInfoToEntitlementStatus(
    customerInfo,
    REVENUECAT_ENTITLEMENT_ID,
  );

  logRevenueCatEvent('entitlement found after customer info resolution', {
    entitlementKey: REVENUECAT_ENTITLEMENT_ID,
    found: entitlement.hasTransformation,
    entitlement: entitlement.entitlementId,
    productIdentifier: entitlement.productIdentifier,
  });

  writeCachedSnapshot({
    entitlement,
    offering: null,
    isConfigured: true,
    lastSyncedAt: new Date(),
    error: null,
  });

  return entitlement;
}

async function getPackageForPurchase(
  preferredPackageId?: string,
): Promise<RevenueCatPackage | null> {
  if (preferredPackageId && OFFERING_PACKAGE_CACHE.has(preferredPackageId)) {
    if (isDevelopmentLoggingEnabled()) {
      console.log('[RC] selected package', preferredPackageId);
    }
    return OFFERING_PACKAGE_CACHE.get(preferredPackageId) ?? null;
  }

  const offerings = await debugOfferings();
  const summary = mapOfferingsToSummary(offerings, revenueCatConfig.offeringId);
  if (!summary?.transformationPackage) {
    return null;
  }

  if (isDevelopmentLoggingEnabled()) {
    console.log('[RC] selected package', summary.transformationPackage.identifier);
  }

  return OFFERING_PACKAGE_CACHE.get(summary.transformationPackage.identifier) ?? null;
}

export async function purchaseTransformationPackage(
  userId: string | null,
  preferredPackageId?: string,
): Promise<PurchaseResult> {
  const availability = getRevenueCatConfigurationState();

  if (!availability.isAvailable) {
    lastPurchaseErrorCategory = availability.reason ?? 'platform_unavailable';
    return {
      status: 'error',
      entitlement: getFallbackEntitlementStatus('fallback'),
      message:
        availability.reason === 'config_invalid'
          ? availability.error ?? 'RevenueCat is not configured correctly right now.'
          : 'Transformation purchase is not available on this device right now.',
      reason: availability.reason ?? 'platform_unavailable',
    };
  }

  await syncRevenueCatIdentity(userId);
  const aPackage = await getPackageForPurchase(preferredPackageId);

  if (!aPackage) {
    lastPurchaseErrorCategory = 'offering_unavailable';
    return {
      status: 'error',
      entitlement: getFallbackEntitlementStatus('fallback'),
      message: 'Transformation is not available to purchase right now.',
      reason: 'offering_unavailable',
    };
  }

  try {
    const result = await Purchases.purchasePackage({ aPackage });
    const entitlement = resolveEntitlementFromCustomerInfo(result.customerInfo);
    lastPurchaseErrorCategory = entitlement.hasTransformation ? null : 'missing_entitlement';
    logRevenueCatEvent('purchase resolved', {
      status: entitlement.hasTransformation ? 'purchased' : 'missing_entitlement',
      entitlement: entitlement.entitlementId,
      productIdentifier: entitlement.productIdentifier,
    });

    return {
      status: entitlement.hasTransformation ? 'purchased' : 'error',
      entitlement,
      message: entitlement.hasTransformation ? 'Transformation is active.' : 'Purchase completed, but access is still being confirmed.',
      reason: entitlement.hasTransformation ? undefined : 'purchase_failed',
    };
  } catch (error) {
    if (isPurchaseCancelled(error)) {
      lastPurchaseErrorCategory = 'cancelled';
      logRevenueCatEvent('purchase cancelled');
      return {
        status: 'cancelled',
        entitlement: readCachedSnapshot()?.entitlement ?? getFallbackEntitlementStatus('fallback'),
        message: null,
      };
    }

    lastPurchaseErrorCategory = 'purchase_failed';
    logRevenueCatEvent('purchase failed', {
      message: getPurchaseErrorMessage(error),
    });
    recordOperationalException('purchase_failure', error, {
      state: 'purchase_failed',
      issue: 'revenuecat_purchase',
    });
    return {
      status: 'error',
      entitlement: readCachedSnapshot()?.entitlement ?? getFallbackEntitlementStatus('fallback'),
      message: getPurchaseErrorMessage(error),
      reason: 'purchase_failed',
    };
  }
}

export async function getCurrentPaywallPackage(
  userId: string | null,
): Promise<OfferingPackageSummary | null> {
  const offeringState = await loadCurrentPaywallOfferingState(userId);

  if (offeringState.status !== 'ready') {
    return null;
  }

  const summary = mapOfferingsToSummary(
    {
      current: offeringState.offering,
      all: {
        [offeringState.offering.identifier]: offeringState.offering,
      },
    },
    revenueCatConfig.offeringId,
  );

  return (
    summary?.availablePackages.find((item) => item.identifier === offeringState.aPackage.identifier) ??
    summary?.transformationPackage ??
    null
  );
}

export async function loadCurrentPaywallOfferingState(
  userId: string | null,
): Promise<RevenueCatOfferingsLoadState> {
  const availability = getRevenueCatConfigurationState();

  if (!availability.isAvailable) {
    return {
      status: 'unavailable',
      message: CALM_UNAVAILABLE_MESSAGE,
    };
  }

  try {
    await syncRevenueCatIdentity(userId);
    const offerings = await getOfferingsSafe();
    const nextState = resolveRevenueCatOfferingsState(offerings);

    recordOperationalBreadcrumb('paywall.offerings.resolved', {
      source: 'paywall',
      result: nextState.status,
      configured: availability.isAvailable,
    });

    return nextState;
  } catch {
    return {
      status: 'error',
      message: CALM_UNAVAILABLE_MESSAGE,
    };
  }
}

export async function restoreRevenueCatPurchases(
  userId: string | null,
): Promise<RestoreResult> {
  const availability = getRevenueCatConfigurationState();

  if (!availability.isAvailable) {
    lastRestoreErrorCategory = availability.reason ?? 'platform_unavailable';
    return {
      status: 'error',
      entitlement: getFallbackEntitlementStatus('fallback'),
      message:
        availability.reason === 'config_invalid'
          ? availability.error ?? 'RevenueCat is not configured correctly right now.'
          : 'We couldn’t restore purchases right now.\nPlease try again.',
      reason: availability.reason ?? 'platform_unavailable',
    };
  }

  try {
    await syncRevenueCatIdentity(userId);
    const result = await Purchases.restorePurchases();
    const entitlement = resolveEntitlementFromCustomerInfo(result.customerInfo);

    if (!entitlement.hasTransformation) {
      lastRestoreErrorCategory = 'not_found';
      logRevenueCatEvent('restore not found');
      recordOperationalEvent('restore_failure', {
        state: 'restore_not_found',
        issue: 'not_found',
      });
      return {
        status: 'not_found',
        entitlement,
        message: 'No previous purchase was found for this Apple ID.',
        reason: 'not_found',
      };
    }

    lastRestoreErrorCategory = null;
    logRevenueCatEvent('restore success', {
      entitlement: entitlement.entitlementId,
      productIdentifier: entitlement.productIdentifier,
    });
    return {
      status: 'restored',
      entitlement,
      message: 'Transformation is active.',
    };
  } catch (error) {
    lastRestoreErrorCategory = 'restore_failed';
    logRevenueCatEvent('restore failed');
    recordOperationalException('restore_failure', error, {
      state: 'restore_failed',
      issue: 'revenuecat_restore',
    });
    return {
      status: 'error',
      entitlement: readCachedSnapshot()?.entitlement ?? getFallbackEntitlementStatus('fallback'),
      message: 'We couldn’t restore purchases right now.\nPlease try again.',
      reason: 'restore_failed',
    };
  }
}

export function getRevenueCatDebugSnapshot(snapshot: SubscriptionSnapshot | null): Record<string, unknown> {
  return {
    tier: snapshot?.entitlement.tier ?? 'sanctuary',
    isConfigured: snapshot?.isConfigured ?? false,
    offeringLoaded: Boolean(snapshot?.offering?.transformationPackage),
    offeringId: snapshot?.offering?.offeringId ?? null,
    entitlementId: snapshot?.entitlement.entitlementId ?? null,
    productIdentifier: snapshot?.entitlement.productIdentifier ?? null,
    source: snapshot?.entitlement.source ?? 'fallback',
  };
}

export async function resetRevenueCatIdentity(): Promise<void> {
  clearCachedSubscriptionSnapshot();
  if (!getPurchasesAvailable() || !isConfigured) {
    currentAppUserId = null;
    return;
  }

  await Purchases.logOut().catch(() => {});
  currentAppUserId = null;
}
