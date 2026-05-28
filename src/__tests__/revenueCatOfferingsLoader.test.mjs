import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REVENUECAT_DEFAULT_OFFERING_ID,
  REVENUECAT_MONTHLY_PACKAGE_ID,
  REVENUECAT_TRANSFORMATION_PRODUCT_ID,
} from '../config/revenueCat.ts';
import { resolveRevenueCatOfferingsState } from '../services/revenuecat/loadOfferings.ts';

function buildMonthlyPackage(
  identifier = REVENUECAT_MONTHLY_PACKAGE_ID,
  productIdentifier = REVENUECAT_TRANSFORMATION_PRODUCT_ID,
) {
  return {
    identifier,
    packageType: 'MONTHLY',
    offeringIdentifier: REVENUECAT_DEFAULT_OFFERING_ID,
    product: {
      identifier: productIdentifier,
      priceString: '$4.99',
      subscriptionPeriod: 'P1M',
    },
  };
}

test('offerings loader resolves ready only for explicit monthly package id', () => {
  const state = resolveRevenueCatOfferingsState({
    current: {
      identifier: REVENUECAT_DEFAULT_OFFERING_ID,
      availablePackages: [buildMonthlyPackage()],
      monthly: null,
    },
  });

  assert.equal(state.status, 'ready');
  if (state.status === 'ready') {
    assert.equal(state.aPackage.identifier, REVENUECAT_MONTHLY_PACKAGE_ID);
  }
});

test('offerings loader fails unavailable when current offering has no explicit monthly package id', () => {
  const state = resolveRevenueCatOfferingsState({
    current: {
      identifier: REVENUECAT_DEFAULT_OFFERING_ID,
      availablePackages: [buildMonthlyPackage('$rc_annual')],
      monthly: {
        ...buildMonthlyPackage('$rc_annual'),
      },
    },
  });

  assert.equal(state.status, 'unavailable');
});

test('offerings loader fails unavailable when monthly package points at wrong product id', () => {
  const state = resolveRevenueCatOfferingsState({
    current: {
      identifier: REVENUECAT_DEFAULT_OFFERING_ID,
      serverDescription: 'Transformation',
      availablePackages: [
        buildMonthlyPackage(REVENUECAT_MONTHLY_PACKAGE_ID, 'wrong_product_id'),
      ],
      monthly: null,
    },
  });

  assert.equal(state.status, 'unavailable');
});
