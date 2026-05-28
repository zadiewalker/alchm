import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  canAccessGatedFeature,
  canUseContinuityDepth,
  canUseLongRangeReturns,
  canUseReflectionExport,
  hasTransformation,
} from '../services/subscriptions/entitlements.ts';
import {
  REVENUECAT_DEFAULT_OFFERING_ID,
  REVENUECAT_ENTITLEMENT_ID,
  REVENUECAT_MONTHLY_PACKAGE_ID,
  REVENUECAT_TRANSFORMATION_PRODUCT_ID,
} from '../config/revenueCat.ts';
import {
  getFallbackEntitlementStatus,
  getRevenueCatDebugSnapshot,
  mapCustomerInfoToEntitlementStatus,
  mapOfferingsToSummary,
  resolveRevenueCatIdentityAction,
} from '../services/subscriptions/revenueCatService.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(__dirname, '..');

function readSource(relativePath) {
  return fs.readFileSync(path.join(srcRoot, relativePath), 'utf8');
}

test('active transformation entitlement maps correctly', () => {
  const entitlement = mapCustomerInfoToEntitlementStatus({
    entitlements: {
      active: {
        [REVENUECAT_ENTITLEMENT_ID]: {
          identifier: REVENUECAT_ENTITLEMENT_ID,
          isActive: true,
          willRenew: true,
          productIdentifier: REVENUECAT_TRANSFORMATION_PRODUCT_ID,
          expirationDate: '2026-04-30T00:00:00.000Z',
          periodType: 'TRIAL',
          isSandbox: true,
        },
      },
    },
    managementURL: 'https://apps.apple.com/account/subscriptions',
  }, REVENUECAT_ENTITLEMENT_ID);

  assert.equal(entitlement.tier, 'transformation');
  assert.equal(entitlement.hasTransformation, true);
  assert.equal(entitlement.isActive, true);
  assert.equal(entitlement.willRenew, true);
  assert.equal(entitlement.isInTrialPeriod, true);
  assert.equal(entitlement.isSandbox, true);
  assert.equal(entitlement.productIdentifier, REVENUECAT_TRANSFORMATION_PRODUCT_ID);
});

test('missing entitlement fails closed to sanctuary', () => {
  const entitlement = mapCustomerInfoToEntitlementStatus({
    entitlements: { active: {} },
    managementURL: null,
  }, REVENUECAT_ENTITLEMENT_ID);

  assert.equal(entitlement.tier, 'sanctuary');
  assert.equal(entitlement.hasTransformation, false);
  assert.equal(entitlement.isActive, false);
});

test('offerings are mapped to app-facing summary only', () => {
  const summary = mapOfferingsToSummary({
    current: {
      identifier: REVENUECAT_DEFAULT_OFFERING_ID,
      serverDescription: 'Transformation',
      availablePackages: [
        {
          identifier: REVENUECAT_MONTHLY_PACKAGE_ID,
          packageType: 'MONTHLY',
          offeringIdentifier: REVENUECAT_DEFAULT_OFFERING_ID,
          product: {
            identifier: REVENUECAT_TRANSFORMATION_PRODUCT_ID,
            title: 'Transformation',
            description: 'Monthly access',
            priceString: '$4.99',
            subscriptionPeriod: 'P1M',
          },
        },
      ],
      monthly: null,
    },
  }, REVENUECAT_DEFAULT_OFFERING_ID);

  assert.ok(summary);
  assert.equal(summary.transformationPackage?.productIdentifier, REVENUECAT_TRANSFORMATION_PRODUCT_ID);
  assert.equal(summary.transformationPackage?.priceString, '$4.99');
  assert.equal(summary.transformationPackage?.billingPeriodLabel, 'Monthly');
});

test('missing offering maps to a calm null summary', () => {
  const summary = mapOfferingsToSummary({ all: {} }, REVENUECAT_DEFAULT_OFFERING_ID);
  assert.equal(summary, null);
});

test('offerings summary does not fall back to a non-monthly package id', () => {
  const summary = mapOfferingsToSummary({
    current: {
      identifier: REVENUECAT_DEFAULT_OFFERING_ID,
      serverDescription: 'Transformation',
      availablePackages: [
        {
          identifier: '$rc_annual',
          packageType: 'MONTHLY',
          offeringIdentifier: REVENUECAT_DEFAULT_OFFERING_ID,
          product: {
            identifier: REVENUECAT_TRANSFORMATION_PRODUCT_ID,
            title: 'Transformation',
            description: 'Monthly access',
            priceString: '$4.99',
            subscriptionPeriod: 'P1M',
          },
        },
      ],
      monthly: null,
    },
  }, REVENUECAT_DEFAULT_OFFERING_ID);

  assert.ok(summary);
  assert.equal(summary.transformationPackage, null);
});

test('offerings summary fails unavailable for wrong product id even with monthly package id', () => {
  const summary = mapOfferingsToSummary({
    current: {
      identifier: REVENUECAT_DEFAULT_OFFERING_ID,
      serverDescription: 'Transformation',
      availablePackages: [
        {
          identifier: REVENUECAT_MONTHLY_PACKAGE_ID,
          packageType: 'MONTHLY',
          offeringIdentifier: REVENUECAT_DEFAULT_OFFERING_ID,
          product: {
            identifier: 'wrong_product_id',
            title: 'Transformation',
            description: 'Monthly access',
            priceString: '$4.99',
            subscriptionPeriod: 'P1M',
          },
        },
      ],
      monthly: null,
    },
  }, REVENUECAT_DEFAULT_OFFERING_ID);

  assert.ok(summary);
  assert.equal(summary.transformationPackage, null);
});

test('identity transitions avoid false unlock races', () => {
  assert.equal(resolveRevenueCatIdentityAction(null, null, false, true), 'configure');
  assert.equal(resolveRevenueCatIdentityAction(null, 'user-1', false, true), 'configure');
  assert.equal(resolveRevenueCatIdentityAction('user-1', 'user-1', true, true), 'none');
  assert.equal(resolveRevenueCatIdentityAction('user-1', 'user-2', true, true), 'login');
  assert.equal(resolveRevenueCatIdentityAction('user-1', null, true, true), 'logout');
});

test('RevenueCat health check exposes safe diagnostic fields only', () => {
  const source = readSource('services/subscriptions/revenueCatService.ts');

  assert.match(source, /export interface RevenueCatHealthCheck/);
  assert.match(source, /platform: string/);
  assert.match(source, /isNativeIos: boolean/);
  assert.match(source, /apiKeyPresent: boolean/);
  assert.match(source, /apiKeySource: 'static'/);
  assert.match(source, /configureAttempted: boolean/);
  assert.match(source, /nativePluginCallSucceeded: boolean/);
  assert.match(source, /nativePluginErrorCategory: string \| null/);
  assert.match(source, /nativePluginErrorMessage: string \| null/);
  assert.match(source, /nativeConfigFound: boolean/);
  assert.match(source, /plistKeyName: string \| null/);
  assert.match(source, /plistKeyFound: boolean/);
  assert.match(source, /nativeAppBundleId: string \| null/);
  assert.match(source, /nativeBundleVersion: string \| null/);
  assert.match(source, /nativeBundleShortVersion: string \| null/);
  assert.match(source, /nativeBridgeControllerActive: boolean/);
  assert.match(source, /nativePluginRegistered: boolean/);
  assert.match(source, /buildNumber: string/);
  assert.match(source, /sdkAppUserIdPresent: boolean/);
  assert.match(source, /offeringRequested: string/);
  assert.match(source, /offeringsResultCategory: string \| null/);
  assert.match(source, /allOfferingIdsReturned: string\[\]/);
  assert.match(source, /currentOfferingIsNull: boolean \| null/);
  assert.match(source, /currentOfferingFound: boolean/);
  assert.match(source, /currentOfferingId: string \| null/);
  assert.match(source, /availablePackagesCount: number/);
  assert.match(source, /packageIdentifiers: string\[\]/);
  assert.match(source, /productIdentifiers: string\[\]/);
  assert.match(source, /expectedPackageFound: boolean/);
  assert.match(source, /expectedProductFound: boolean/);
  assert.match(source, /entitlementIdentifierExpected: string/);
  assert.match(source, /entitlementActive: boolean/);
  assert.match(source, /nativePaywallAvailable: boolean/);
  assert.match(source, /lastPurchaseErrorCategory: string \| null/);
  assert.match(source, /lastRestoreErrorCategory: string \| null/);
  assert.doesNotMatch(
    source,
    /apiKeyFingerprint|nativeApiKeyPrefix|nativeApiKeyFingerprint|sdkAppUserIdFingerprint|emailAddress|journalText|rawEntry/,
  );
});

test('approved premium gates require transformation', () => {
  const sanctuary = getFallbackEntitlementStatus();
  const transformation = {
    ...sanctuary,
    tier: 'transformation',
    hasTransformation: true,
    isActive: true,
  };

  assert.equal(hasTransformation(sanctuary), false);
  assert.equal(hasTransformation(transformation), true);

  assert.equal(canUseReflectionExport(sanctuary), false);
  assert.equal(canUseLongRangeReturns(sanctuary), false);
  assert.equal(canUseContinuityDepth(sanctuary), false);

  assert.equal(canUseReflectionExport(transformation), true);
  assert.equal(canUseLongRangeReturns(transformation), true);
  assert.equal(canUseContinuityDepth(transformation), true);
});

test('gated feature helper never grants false positive sanctuary access', () => {
  const sanctuary = getFallbackEntitlementStatus();
  assert.equal(canAccessGatedFeature('reflection_export', sanctuary), false);
  assert.equal(canAccessGatedFeature('conversation_summary', sanctuary), false);
  assert.equal(canAccessGatedFeature('long_range_returns', sanctuary), false);
  assert.equal(canAccessGatedFeature('continuity_depth', sanctuary), false);
});

test('debug snapshot stays sanctuary-safe when no entitlement is active', () => {
  const snapshot = getRevenueCatDebugSnapshot({
    entitlement: getFallbackEntitlementStatus(),
    offering: null,
    isConfigured: false,
    lastSyncedAt: null,
    error: 'Subscription options aren’t available right now.',
  });

  assert.equal(snapshot.tier, 'sanctuary');
  assert.equal(snapshot.isConfigured, false);
  assert.equal(snapshot.offeringLoaded, false);
});

test('canonical Open Transformation CTA routes to upgrade diagnostics before purchase', () => {
  const button = readSource('components/subscriptions/OpenTransformationButton.tsx');
  const access = readSource('hooks/useTransformationAccess.ts');
  const nativeUi = readSource('services/subscriptions/nativeSubscriptionUiService.ts');

  assert.match(button, /type="button"/);
  assert.match(button, /void transformation\.openTransformation\(\)/);
  assert.match(button, /disabled=\{isDisabled\}/);
  assert.match(button, /aria-busy=\{transformation\.isOpening/);
  assert.match(button, /subscription-action-status/);

  assert.doesNotMatch(access, /canPresentNativeSubscriptionScreen/);
  assert.doesNotMatch(access, /openNativeSubscriptionScreen/);
  assert.match(access, /navigate\('\/upgrade'/);
  assert.match(access, /recordOperationalEvent\('transformation_cta_tap'/);

  assert.match(nativeUi, /SUBSCRIPTION_SHEET_DISMISS_TIMEOUT_MS/);
  assert.match(nativeUi, /NATIVE_SUBSCRIPTION_DIAGNOSTICS_TIMEOUT_MS/);
  assert.match(nativeUi, /plugin_call_timeout/);
  assert.match(nativeUi, /Promise\.race\(\[/);
  assert.match(nativeUi, /Promise\.race\(\[dismissed, dismissalTimeout\]\)/);
});

test('native iOS subscription entry opens RevenueCat paywall and releases dismissal', () => {
  const plugin = fs.readFileSync(path.join(srcRoot, '..', 'ios/App/App/ALCHMSubscriptionsPlugin.swift'), 'utf8');
  const nativeView = fs.readFileSync(path.join(srcRoot, '..', 'ios/App/App/RevenueCatSubscriptionView.swift'), 'utf8');

  assert.match(plugin, /RevenueCatSubscriptionHostingController\(\)/);
  assert.match(plugin, /controller\.onDismiss =/);
  assert.match(plugin, /notifyListeners\("subscriptionSheetDidDismiss"/);
  assert.match(nativeView, /struct RevenueCatNativePaywallView: View/);
  assert.match(nativeView, /PaywallView\(displayCloseButton: true\)/);
  assert.match(nativeView, /override func viewDidDisappear/);
  assert.match(nativeView, /notifyDismissalIfNeeded/);
});

test('upgrade exposes safe on-device subscription diagnostics', () => {
  const upgrade = readSource('app/upgrade/UpgradeClient.tsx');
  const panel = readSource('components/subscriptions/SubscriptionDiagnosticsPanel.tsx');
  const hook = readSource('hooks/useSubscriptionDiagnostics.ts');

  assert.match(upgrade, /SubscriptionDiagnosticsPanel/);
  assert.match(panel, /Check subscription setup/);
  assert.match(panel, /RevenueCat API key present/);
  assert.match(panel, /native plugin call succeeded/);
  assert.match(panel, /native plugin error category/);
  assert.match(panel, /native plugin error message/);
  assert.match(panel, /plist key name/);
  assert.match(panel, /native app bundle ID/);
  assert.match(panel, /native CFBundleVersion/);
  assert.match(panel, /native CFBundleShortVersionString/);
  assert.match(panel, /native bridge controller active/);
  assert.match(panel, /native plugin registered/);
  assert.match(panel, /JS static build number/);
  assert.match(panel, /SDK app user ID fingerprint/);
  assert.match(panel, /offerings result category/);
  assert.match(panel, /offering IDs returned/);
  assert.match(panel, /current offering is null/);
  assert.match(panel, /expected package found/);
  assert.match(panel, /expected product found/);
  assert.match(panel, /native paywall available/);
  assert.match(panel, /last purchase error category/);
  assert.match(panel, /last restore error category/);
  assert.match(hook, /getRevenueCatHealthCheck/);
  assert.doesNotMatch(panel, /diagnostics\.diagnostics\.(userId|email|token|apiKey(?!Present|Source|Fingerprint)|nativeApiKey(?!Prefix|Fingerprint))/);
  assert.doesNotMatch(hook, /console\.info\([^)]*userId|console\.info\([^)]*email|console\.info\([^)]*token/);
});

test('upgrade purchase path prevents duplicate calls and handles cancellation gently', () => {
  const upgrade = readSource('app/upgrade/UpgradeClient.tsx');
  const provider = readSource('components/subscriptions/SubscriptionProvider.tsx');

  assert.equal((upgrade.match(/Subscription setup is unavailable right now\. Sanctuary remains available\./g) ?? []).length, 1);
  assert.match(upgrade, /subscription\.canPresentNativeSubscriptionScreen/);
  assert.match(upgrade, /subscription\.openNativeSubscriptionScreen\(\)/);
  assert.match(upgrade, /native_subscription_screen_unavailable/);
  assert.match(upgrade, /subscription\.purchaseTransformation\(\)/);
  assert.match(upgrade, /disabled=\{subscription\.isPurchasing \|\| subscription\.hasTransformation \|\| purchaseUnavailable\}/);
  assert.match(upgrade, /result\.status === 'cancelled'/);
  assert.match(upgrade, /Purchase was not completed\./);
  assert.match(upgrade, /result\.status === 'error'/);
  assert.match(upgrade, /Purchase options could not open right now\. You can keep writing in Sanctuary\./);

  assert.match(provider, /if \(result\.status === 'purchased'\)/);
  assert.match(provider, /await loadSnapshot\(\)/);
});
