import {
  REVENUECAT_MONTHLY_PACKAGE_ID,
  REVENUECAT_TRANSFORMATION_PRODUCT_ID,
} from '@/config/revenueCat';
import { debugOfferings } from '@/services/revenuecat/debugOfferings';
import type {
  RevenueCatOfferings,
  RevenueCatOffering,
  RevenueCatPackage,
} from '@/services/subscriptions/revenueCatPlugin';

const CALM_UNAVAILABLE_MESSAGE = 'Subscription options aren’t available right now.';

export type RevenueCatOfferingsLoadState =
  | {
      status: 'ready';
      offering: RevenueCatOffering;
      aPackage: RevenueCatPackage;
    }
  | {
      status: 'unavailable';
      message: string;
    }
  | {
      status: 'error';
      message: string;
    };

export function resolveRevenueCatOfferingsState(
  offerings: RevenueCatOfferings | null | undefined,
): RevenueCatOfferingsLoadState {
  const current = offerings?.current ?? null;

  if (!current || !current.availablePackages.length) {
    return {
      status: 'unavailable',
      message: CALM_UNAVAILABLE_MESSAGE,
    };
  }

  const aPackage =
    current.availablePackages.find((pkg) =>
      pkg.identifier === REVENUECAT_MONTHLY_PACKAGE_ID &&
      pkg.product.identifier === REVENUECAT_TRANSFORMATION_PRODUCT_ID
    ) ??
    null;

  if (!aPackage) {
    return {
      status: 'unavailable',
      message: CALM_UNAVAILABLE_MESSAGE,
    };
  }

  return {
    status: 'ready',
    offering: current,
    aPackage,
  };
}

export async function loadRevenueCatOfferings(): Promise<RevenueCatOfferingsLoadState> {
  try {
    return resolveRevenueCatOfferingsState(await debugOfferings());
  } catch {
    return {
      status: 'error',
      message: CALM_UNAVAILABLE_MESSAGE,
    };
  }
}
