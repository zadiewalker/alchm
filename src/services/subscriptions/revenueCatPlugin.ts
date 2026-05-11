import { registerPlugin } from '@capacitor/core';

export interface RevenueCatPlugin {
  configure(options: { apiKey: string; appUserID?: string }): Promise<void>;
  getOfferings(): Promise<{ offerings: RevenueCatOfferings }>;
  getCustomerInfo(): Promise<{ customerInfo: RevenueCatCustomerInfo }>;
  purchasePackage(options: { aPackage: RevenueCatPackage }): Promise<RevenueCatPurchaseResult>;
  restorePurchases(): Promise<{ customerInfo: RevenueCatCustomerInfo }>;
  logIn(options: { appUserID: string }): Promise<{ customerInfo: RevenueCatCustomerInfo; created: boolean }>;
  logOut(): Promise<{ customerInfo: RevenueCatCustomerInfo }>;
}

export interface RevenueCatOfferings {
  all?: Record<string, RevenueCatOffering>;
  current?: RevenueCatOffering | null;
}

export interface RevenueCatOffering {
  identifier: string;
  serverDescription?: string;
  availablePackages: RevenueCatPackage[];
  monthly?: RevenueCatPackage | null;
}

export interface RevenueCatPackage {
  identifier: string;
  packageType: string;
  offeringIdentifier: string;
  product: RevenueCatStoreProduct;
}

export interface RevenueCatStoreProduct {
  identifier: string;
  title?: string;
  description?: string;
  priceString?: string;
  subscriptionPeriod?: string | null;
  period?: string | null;
  defaultOption?: {
    pricingPhases?: Array<{
      billingPeriod?: { iso8601?: string | null } | null;
    }>;
  } | null;
}

export interface RevenueCatCustomerInfo {
  entitlements?: {
    active?: Record<string, RevenueCatEntitlementInfo>;
  };
  managementURL?: string | null;
  originalAppUserId?: string | null;
  originalAppUserID?: string | null;
}

export interface RevenueCatEntitlementInfo {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
  productIdentifier: string;
  expirationDate?: string | null;
  periodType?: string | null;
  isSandbox: boolean;
}

export interface RevenueCatPurchaseResult {
  customerInfo: RevenueCatCustomerInfo;
  productIdentifier: string;
}

export interface RevenueCatError {
  message?: string;
  userCancelled?: boolean | null;
}

export const Purchases = registerPlugin<RevenueCatPlugin>('Purchases');
