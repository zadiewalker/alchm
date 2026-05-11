/**
 * Feature Flags for ALCHM
 * 
 * Simple feature flag system for gradual rollout of new features
 */

interface FeatureFlags {
  enhancedKhepera: boolean;
}

// Default feature flags - can be overridden by environment or user settings
const DEFAULT_FLAGS: FeatureFlags = {
  enhancedKhepera: false, // Start with enhanced system disabled
};

// Environment-based overrides
const ENV_OVERRIDES: Partial<FeatureFlags> = {
  // Enable enhanced Khepera in development
  enhancedKhepera: process.env.NODE_ENV === 'development' || process.env.ENABLE_ENHANCED_KHEPERA === 'true',
};

export function getFeatureFlag(flag: keyof FeatureFlags): boolean {
  return ENV_OVERRIDES[flag] ?? DEFAULT_FLAGS[flag];
}

export function isEnhancedKheperaEnabled(): boolean {
  return getFeatureFlag('enhancedKhepera');
}

// User-based rollout (for gradual rollout by user ID)
export function isEnhancedKheperaEnabledForUser(userId: string): boolean {
  // Always respect environment override first
  if (ENV_OVERRIDES.enhancedKhepera !== undefined) {
    return ENV_OVERRIDES.enhancedKhepera;
  }
  
  // Gradual rollout: enable for users based on hash of their ID
  if (userId) {
    const hash = simpleHash(userId);
    const rolloutPercentage = 0; // Start at 0%, increase gradually to 100%
    return (hash % 100) < rolloutPercentage;
  }
  
  return DEFAULT_FLAGS.enhancedKhepera;
}

// Simple hash function for consistent user bucketing
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}