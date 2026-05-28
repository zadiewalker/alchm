'use client';

export type SubscriptionTier = 'sanctuary' | 'transformation';

export interface TierLimits {
  entriesPerMonth: number | null;
  kheperaReflections: number | null;
  kheperaFollowUps: number | null;
  reflectionExport: boolean;
  longRangeReturns: boolean;
  continuityDepth: boolean;
}

export interface TierConfig {
  name: string;
  price: string;
  description: string;
  features: string[];
  limits: TierLimits;
}

export const TIERS: Record<SubscriptionTier, TierConfig> = {
  sanctuary: {
    name: 'Sanctuary',
    price: 'Free',
    description: 'A quiet place to write — and sometimes, to receive something back.',
    features: [
      'Unlimited journaling',
      'Full reflections',
      'Core return experience',
      'Privacy and safety, always',
    ],
    limits: {
      entriesPerMonth: null,
      kheperaReflections: null,
      kheperaFollowUps: null,
      reflectionExport: false,
      longRangeReturns: false,
      continuityDepth: false,
    },
  },
  transformation: {
    name: 'Transformation',
    price: '$4.99/month',
    description: 'Let your writing stay with you over time.',
    features: [
      'Long-range returns',
      'Reflection Export',
      'Deeper continuity over time',
    ],
    limits: {
      entriesPerMonth: null,
      kheperaReflections: null,
      kheperaFollowUps: null,
      reflectionExport: true,
      longRangeReturns: true,
      continuityDepth: true,
    },
  },
};

export function getSubscription() {
  return {
    tier: 'sanctuary' as const,
    expiresAt: null,
    reflectionsUsedThisMonth: 0,
    monthResetDate: null,
    followUpsUsedThisMonth: 0,
  };
}

export function setSubscriptionTier(): ReturnType<typeof getSubscription> {
  return getSubscription();
}

export function canUseKhepera(): { allowed: boolean; remaining: number | null } {
  return { allowed: true, remaining: null };
}

export function recordKheperaUsage(): void {}

export function canUseFollowUp(): { allowed: boolean; remaining: number | null } {
  return { allowed: true, remaining: null };
}

export function recordFollowUpUsage(): void {}

export function canAccessFeature(_feature: keyof TierLimits): boolean {
  return false;
}

export function getReflectionUsageSummary(): { tier: SubscriptionTier; used: number; remaining: number | null } {
  return { tier: 'sanctuary', used: 0, remaining: null };
}
