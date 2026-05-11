export interface RevenueCatConfig {
  apiKey: string;
  entitlement: string;
  offeringId: string;
  apiKeySource: 'static';
}

export const REVENUECAT_ENTITLEMENT_ID = 'ALCHM - Transformation';
export const REVENUECAT_MONTHLY_PACKAGE_ID = '$rc_monthly';
export const REVENUECAT_DEFAULT_OFFERING_ID = 'default';
export const REVENUECAT_TRANSFORMATION_PRODUCT_ID = 'alchm_transformation_monthly';
export const REVENUECAT_APPLE_PUBLIC_API_KEY = 'appl_kRsSNiRwxlaYxqXEheZZvSjfXwI';

export interface RevenueCatConfigDiagnostics {
  keyPresent: boolean;
  keyPrefix: string | null;
  keyFingerprint: string | null;
  keySource: 'static';
  entitlement: string | null;
  offeringId: string | null;
}

export interface RevenueCatConfigStatus {
  isValid: boolean;
  error: string | null;
  diagnostics: RevenueCatConfigDiagnostics;
}

function normalizeEnvValue(value: string | undefined): string {
  return value?.trim() ?? '';
}

export function getRevenueCatApiKeyFingerprint(apiKey: string): string | null {
  const normalized = normalizeEnvValue(apiKey);
  if (!normalized) {
    return null;
  }

  return `${normalized.slice(0, 5)}…${normalized.slice(-4)}`;
}

export function readRevenueCatConfig(): RevenueCatConfig {
  return {
    apiKey: REVENUECAT_APPLE_PUBLIC_API_KEY,
    entitlement: REVENUECAT_ENTITLEMENT_ID,
    offeringId: REVENUECAT_DEFAULT_OFFERING_ID,
    apiKeySource: 'static',
  };
}

export function validateRevenueCatConfig(
  config: RevenueCatConfig,
): RevenueCatConfigStatus {
  if (!config.apiKey) {
    return {
      isValid: false,
      error: '[RC CONFIG ERROR]\nMissing RevenueCat Apple public SDK key',
      diagnostics: {
        keyPresent: false,
        keyPrefix: null,
        keyFingerprint: null,
        keySource: config.apiKeySource,
        entitlement: config.entitlement || null,
        offeringId: config.offeringId || null,
      },
    };
  }

  if (!config.apiKey.startsWith('appl_')) {
    return {
      isValid: false,
      error: '[RC CONFIG ERROR]\nRevenueCat Apple public SDK key must begin with "appl_"',
      diagnostics: {
        keyPresent: true,
        keyPrefix: config.apiKey.slice(0, 5),
        keyFingerprint: getRevenueCatApiKeyFingerprint(config.apiKey),
        keySource: config.apiKeySource,
        entitlement: config.entitlement || null,
        offeringId: config.offeringId || null,
      },
    };
  }

  return {
    isValid: true,
    error: null,
    diagnostics: {
      keyPresent: true,
      keyPrefix: config.apiKey.slice(0, 5),
      keyFingerprint: getRevenueCatApiKeyFingerprint(config.apiKey),
      keySource: config.apiKeySource,
      entitlement: config.entitlement,
      offeringId: config.offeringId,
    },
  };
}

export const revenueCatConfig = readRevenueCatConfig();
export const revenueCatConfigStatus = validateRevenueCatConfig(revenueCatConfig);

export function assertRevenueCatConfigReady(): RevenueCatConfigStatus {
  if (!revenueCatConfigStatus.isValid && process.env.NODE_ENV !== 'production') {
    throw new Error(revenueCatConfigStatus.error ?? '[RC CONFIG ERROR]\nRevenueCat config is invalid.');
  }

  return revenueCatConfigStatus;
}
