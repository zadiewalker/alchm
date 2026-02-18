'use client';

import type { SubscriptionState, SubscriptionTier, TierLimits } from '@/lib/types';
import { readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';

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
    features: ['Unlimited journal entries', 'Mood tracking', '3 Khepera reflections per month', 'Crisis resources (always)', 'Data export'],
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
    features: ['Everything in Free', 'Unlimited Khepera reflections', 'Follow-up exchanges with Khepera', 'Evening check-in'],
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
    features: ['Everything in Reflections', 'Guided pathways', 'Theme extraction', 'Weekly sanctuary summaries'],
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

// App Store readiness: do not ship a paywall that cannot complete.
const SUBSCRIPTIONS_ENABLED = false;

function getNextMonthResetISO(from = new Date()): string {
  return new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1, 0, 0, 0)).toISOString();
}

function defaultSubscription(): SubscriptionState {
  return {
    tier: SUBSCRIPTIONS_ENABLED ? 'free' : 'sanctuary',
    expiresAt: null,
    reflectionsUsedThisMonth: 0,
    monthResetDate: getNextMonthResetISO(),
    followUpsUsedThisMonth: 0,
  };
}

function hydrateAndReset(state: SubscriptionState): SubscriptionState {
  const now = new Date();
  const resetAt = new Date(state.monthResetDate);
  if (Number.isNaN(resetAt.getTime()) || now > resetAt) {
    const reset: SubscriptionState = {
      ...state,
      reflectionsUsedThisMonth: 0,
      followUpsUsedThisMonth: 0,
      monthResetDate: getNextMonthResetISO(now),
    };
    writeJson(STORAGE_KEYS.subscription, reset);
    return reset;
  }
  return state;
}

export function getSubscription(): SubscriptionState {
  if (!SUBSCRIPTIONS_ENABLED) return defaultSubscription();

  const raw = readJsonExact<SubscriptionState | null>(STORAGE_KEYS.subscription, null);
  if (!raw) return defaultSubscription();

  const normalized: SubscriptionState = {
    tier: raw.tier || 'free',
    expiresAt: raw.expiresAt || null,
    reflectionsUsedThisMonth: Number(raw.reflectionsUsedThisMonth || 0),
    monthResetDate: raw.monthResetDate || getNextMonthResetISO(),
    followUpsUsedThisMonth: Number(raw.followUpsUsedThisMonth || 0),
  };
  return hydrateAndReset(normalized);
}

export function canAccessFeature(feature: keyof TierLimits): boolean {
  if (!SUBSCRIPTIONS_ENABLED) return true;
  const sub = getSubscription();
  const value = TIERS[sub.tier].limits[feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  return value === null;
}

