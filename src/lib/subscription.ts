'use client';

// TODO: Before App Store submission, replace localStorage tier management
// with StoreKit / RevenueCat in-app purchase verification.
// Current implementation is for TestFlight testing only.

export type SubscriptionTier = 'free' | 'reflections' | 'sanctuary';

export interface TierLimits {
  entriesPerMonth: number | null;
  kheperaReflections: number | null;
  kheperaFollowUps: number | null;
  pathwayAccess: boolean;
  themeExtraction: boolean;
  weeklyReflections: boolean;
  dataExport: boolean;
  eveningCheckIn: boolean;
}

export interface TierConfig {
  name: string;
  price: string;
  description: string;
  features: string[];
  limits: TierLimits;
}

export const TIERS: Record<SubscriptionTier, TierConfig> = {
  free: {
    name: 'Free',
    price: 'Free forever',
    description: 'Journal and reflect, always.',
    features: [
      'Unlimited journal entries',
      'Mood tracking',
      '3 Khepera reflections per month',
      'Crisis resources (always)',
      'Data export',
    ],
    limits: {
      entriesPerMonth: null,
      kheperaReflections: 3,
      kheperaFollowUps: 0,
      pathwayAccess: false,
      themeExtraction: false,
      weeklyReflections: false,
      dataExport: true,
      eveningCheckIn: false,
    },
  },
  reflections: {
    name: 'Reflections',
    price: '$4.99/mo',
    description: 'Khepera, unlimited.',
    features: [
      'Everything in Free',
      'Unlimited Khepera reflections',
      'Follow-up exchanges with Khepera',
      'Daily prompts from all 5 frameworks',
      'Evening check-in',
    ],
    limits: {
      entriesPerMonth: null,
      kheperaReflections: null,
      kheperaFollowUps: null,
      pathwayAccess: false,
      themeExtraction: false,
      weeklyReflections: false,
      dataExport: true,
      eveningCheckIn: true,
    },
  },
  sanctuary: {
    name: 'Sanctuary',
    price: '$9.99/mo',
    description: 'The full ALCHM experience.',
    features: [
      'Everything in Reflections',
      'Guided pathways',
      'Theme extraction',
      'Weekly sanctuary summaries',
      'Priority Khepera response quality',
    ],
    limits: {
      entriesPerMonth: null,
      kheperaReflections: null,
      kheperaFollowUps: null,
      pathwayAccess: true,
      themeExtraction: true,
      weeklyReflections: true,
      dataExport: true,
      eveningCheckIn: true,
    },
  },
};

interface SubscriptionState {
  tier: SubscriptionTier;
  expiresAt: string | null;
  reflectionsUsedThisMonth: number;
  monthResetDate: string;
  followUpsUsedThisMonth: number;
}

const STORAGE_KEY = 'alchm-subscription';

function getNextMonthResetISO(from = new Date()): string {
  const next = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1, 0, 0, 0));
  return next.toISOString();
}

function defaultSubscription(): SubscriptionState {
  return {
    tier: 'free',
    expiresAt: null,
    reflectionsUsedThisMonth: 0,
    monthResetDate: getNextMonthResetISO(),
    followUpsUsedThisMonth: 0,
  };
}

function saveSubscription(state: SubscriptionState): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // no-op
  }
}

function hydrateAndReset(state: SubscriptionState): SubscriptionState {
  const now = new Date();
  const resetAt = new Date(state.monthResetDate);
  if (Number.isNaN(resetAt.getTime()) || now > resetAt) {
    const reset = {
      ...state,
      reflectionsUsedThisMonth: 0,
      followUpsUsedThisMonth: 0,
      monthResetDate: getNextMonthResetISO(now),
    };
    saveSubscription(reset);
    return reset;
  }
  return state;
}

export function getSubscription(): SubscriptionState {
  try {
    if (typeof window === 'undefined') return defaultSubscription();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSubscription();
    const parsed = JSON.parse(raw) as SubscriptionState;
    const normalized: SubscriptionState = {
      tier: parsed.tier || 'free',
      expiresAt: parsed.expiresAt || null,
      reflectionsUsedThisMonth: Number(parsed.reflectionsUsedThisMonth || 0),
      monthResetDate: parsed.monthResetDate || getNextMonthResetISO(),
      followUpsUsedThisMonth: Number(parsed.followUpsUsedThisMonth || 0),
    };
    return hydrateAndReset(normalized);
  } catch {
    return defaultSubscription();
  }
}

export function setSubscriptionTier(tier: SubscriptionTier): SubscriptionState {
  const next = { ...getSubscription(), tier };
  saveSubscription(next);
  return next;
}

export function canUseKhepera(): { allowed: boolean; remaining: number | null; message?: string } {
  const sub = getSubscription();
  const limit = TIERS[sub.tier].limits.kheperaReflections;

  if (limit === null) return { allowed: true, remaining: null };

  const remaining = Math.max(0, limit - sub.reflectionsUsedThisMonth);
  if (remaining > 0) return { allowed: true, remaining };

  return {
    allowed: false,
    remaining: 0,
    message: 'You have used all your Khepera reflections this month. Upgrade to Reflections for unlimited access.',
  };
}

export function recordKheperaUsage(): void {
  try {
    const sub = getSubscription();
    saveSubscription({
      ...sub,
      reflectionsUsedThisMonth: sub.reflectionsUsedThisMonth + 1,
    });
  } catch {
    // no-op
  }
}

export function canUseFollowUp(): { allowed: boolean; remaining: number | null; message?: string } {
  const sub = getSubscription();
  const limit = TIERS[sub.tier].limits.kheperaFollowUps;

  if (limit === null) return { allowed: true, remaining: null };
  const remaining = Math.max(0, limit - sub.followUpsUsedThisMonth);
  if (remaining > 0) return { allowed: true, remaining };

  return {
    allowed: false,
    remaining: 0,
    message: 'Follow-up exchanges are available on Reflections and Sanctuary plans.',
  };
}

export function recordFollowUpUsage(): void {
  try {
    const sub = getSubscription();
    saveSubscription({ ...sub, followUpsUsedThisMonth: sub.followUpsUsedThisMonth + 1 });
  } catch {
    // no-op
  }
}

export function canAccessFeature(feature: keyof TierLimits): boolean {
  const sub = getSubscription();
  const value = TIERS[sub.tier].limits[feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  return value === null;
}

export function getReflectionUsageSummary(): { tier: SubscriptionTier; used: number; remaining: number | null } {
  const sub = getSubscription();
  const limit = TIERS[sub.tier].limits.kheperaReflections;
  const remaining = limit === null ? null : Math.max(0, limit - sub.reflectionsUsedThisMonth);
  return { tier: sub.tier, used: sub.reflectionsUsedThisMonth, remaining };
}
