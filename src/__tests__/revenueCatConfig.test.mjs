import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REVENUECAT_DEFAULT_OFFERING_ID,
  REVENUECAT_APPLE_PUBLIC_API_KEY,
  REVENUECAT_ENTITLEMENT_ID,
  REVENUECAT_MONTHLY_PACKAGE_ID,
  REVENUECAT_TRANSFORMATION_PRODUCT_ID,
  getRevenueCatApiKeyFingerprint,
  readRevenueCatConfig,
  validateRevenueCatConfig,
} from '../config/revenueCat.ts';

test('static RevenueCat config passes', () => {
  const config = readRevenueCatConfig();

  const status = validateRevenueCatConfig(config);

  assert.equal(status.isValid, true);
  assert.equal(status.error, null);
  assert.equal(status.diagnostics.keyPresent, true);
  assert.equal(status.diagnostics.keyPrefix, 'appl_');
  assert.equal(status.diagnostics.keyFingerprint, getRevenueCatApiKeyFingerprint(REVENUECAT_APPLE_PUBLIC_API_KEY));
  assert.equal(status.diagnostics.keySource, 'static');
  assert.equal(config.apiKey, REVENUECAT_APPLE_PUBLIC_API_KEY);
  assert.equal(config.entitlement, REVENUECAT_ENTITLEMENT_ID);
  assert.equal(config.offeringId, REVENUECAT_DEFAULT_OFFERING_ID);
});

test('RevenueCat config does not depend on NEXT_PUBLIC env injection', () => {
  const config = readRevenueCatConfig();
  const status = validateRevenueCatConfig(config);

  assert.equal(config.apiKey, REVENUECAT_APPLE_PUBLIC_API_KEY);
  assert.equal(config.apiKeySource, 'static');
  assert.equal(status.isValid, true);
  assert.equal(status.diagnostics.keyPresent, true);
  assert.equal(status.diagnostics.keyPrefix, 'appl_');
  assert.equal(status.diagnostics.keySource, 'static');
});

test('malformed API key fails clearly', () => {
  const status = validateRevenueCatConfig(
    {
      apiKey: 'ios_public_key',
      apiKeySource: 'static',
      entitlement: REVENUECAT_ENTITLEMENT_ID,
      offeringId: REVENUECAT_DEFAULT_OFFERING_ID,
    },
  );

  assert.equal(status.isValid, false);
  assert.match(status.error ?? '', /must begin with "appl_"/);
  assert.equal(status.diagnostics.keySource, 'static');
});

test('entitlement and offering identifiers are pinned to dashboard constants', () => {
  const config = readRevenueCatConfig();

  assert.equal(config.entitlement, REVENUECAT_ENTITLEMENT_ID);
  assert.equal(config.offeringId, REVENUECAT_DEFAULT_OFFERING_ID);
  assert.equal(REVENUECAT_MONTHLY_PACKAGE_ID, '$rc_monthly');
  assert.equal(REVENUECAT_TRANSFORMATION_PRODUCT_ID, 'alchm_transformation_monthly');
});
