import {
  REVENUECAT_DEFAULT_OFFERING_ID,
  REVENUECAT_MONTHLY_PACKAGE_ID,
  REVENUECAT_TRANSFORMATION_PRODUCT_ID,
} from '@/config/revenueCat';
import {
  Purchases,
  type RevenueCatOfferings,
} from '@/services/subscriptions/revenueCatPlugin';

function isDevelopmentLoggingEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export async function debugOfferings(): Promise<RevenueCatOfferings | null> {
  try {
    const { offerings } = await Purchases.getOfferings();

    if (isDevelopmentLoggingEnabled()) {
      console.log('🟢 RevenueCat offerings:', offerings);
      console.log('🟢 Current offering:', offerings.current);
      console.log('🟢 Current offering identifier:', offerings.current?.identifier ?? null);
      console.log(
        '🟢 Available packages:',
        offerings.current?.availablePackages?.map((pkg) => ({
          identifier: pkg.identifier,
          productId: pkg.product.identifier,
          price: pkg.product.priceString,
        })) ?? [],
      );

      if (!offerings.current) {
        console.warn('⚠️ No current offering available');
      }

      if (offerings.current && offerings.current.identifier !== REVENUECAT_DEFAULT_OFFERING_ID) {
        console.warn(
          `⚠️ Expected current offering ${REVENUECAT_DEFAULT_OFFERING_ID} but received ${offerings.current.identifier}`,
        );
      }

      if (!offerings.current?.availablePackages?.length) {
        console.warn('⚠️ No available packages in offering');
      }

      if (!offerings.current?.monthly) {
        console.warn('⚠️ Monthly package is not exposed on the current offering');
      }

      if (
        !offerings.current?.availablePackages?.some(
          (pkg) =>
            pkg.identifier === REVENUECAT_MONTHLY_PACKAGE_ID &&
            pkg.product.identifier === REVENUECAT_TRANSFORMATION_PRODUCT_ID,
        )
      ) {
        console.warn(`⚠️ Expected monthly package ${REVENUECAT_MONTHLY_PACKAGE_ID} for ${REVENUECAT_TRANSFORMATION_PRODUCT_ID} was not found`);
      }
    }

    return offerings;
  } catch (error) {
    if (isDevelopmentLoggingEnabled()) {
      console.error('🔴 RevenueCat offerings error:', error);
    }

    return null;
  }
}
