'use client';

import type { SubscriptionState, SubscriptionTier, TierLimits } from '@/lib/types';
import { readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';

export type Tier = 'growth' | 'transformation';

export interface EntitlementState {
  tier: Tier;
  reflectionsUsedThisMonth: number;
  reflectionsLimit: number | null;
  monthResetDate: string;
  followUpsUsedThisMonth: number;
  hasHadExerciseTaste: boolean;
  hasHadPatternTaste: boolean;
  weeklyNudgeDismissals: number;
  lastNudgeDate: string | null;
  containerCompletionUpsellShown: boolean;
  trialStartDate: string | null;
  trialEndDate: string | null;
}

export interface TierConfig {
  name: string;
  price: string;
  description: string;
  features: string[];
  limits: TierLimits;
}

export const TIERS: Record<'growth' | 'transformation', TierConfig> = {
  growth: {
    name: 'Growth',
    price: 'Free forever',
    description: 'Write freely with a meaningful free sanctuary.',
    features: [
      'Unlimited journal entries',
      'Mood tracking + Body Map',
      '3 Khepera reflections per month',
      'Seven Days of Noticing',
      'Your Lines in the Mirror',
      'Crisis resources (always)',
      'Data export (always)',
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
  transformation: {
    name: 'Transformation',
    price: '$6.99/mo',
    description: 'Unlimited Khepera, full containers, exercises, and Mirror depth.',
    features: [
      'Everything in Growth',
      'Unlimited Khepera reflections',
      'Khepera remembers your history',
      'All 21-day containers',
      'All post-entry exercises',
      'Full Mirror and insights',
      'Evening check-ins',
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

type ConversionEventName =
  | 'reflection_limit_hit'
  | 'reflection_limit_upgrade_tap'
  | 'reflection_limit_dismiss'
  | 'exercise_taste_completed'
  | 'exercise_taste_skipped'
  | 'exercise_taste_upgrade_tap'
  | 'container_locked_viewed'
  | 'container_locked_upgrade_tap'
  | 'container_completion_upsell'
  | 'mirror_locked_section_viewed'
  | 'weekly_nudge_shown'
  | 'weekly_nudge_dismissed'
  | 'pricing_page_viewed'
  | 'trial_started'
  | 'trial_converted'
  | 'trial_expired'
  | 'subscription_started'
  | 'subscription_cancelled';

interface ConversionEvent {
  event: ConversionEventName;
  timestamp: string;
  context: Record<string, unknown>;
}

export interface TransformationStartResult {
  mode: 'already_active' | 'trial_started' | 'paid_started' | 'trial_converted';
  trialEndDate: string | null;
}

function monthResetISO(from = new Date()): string {
  return new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1, 0, 0, 0)).toISOString();
}

function addDaysISO(days: number, from = new Date()): string {
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function resolveTier(raw: SubscriptionTier | undefined): Tier {
  if (raw === 'transformation' || raw === 'sanctuary') return 'transformation';
  if (raw === 'reflections') return 'growth';
  return raw === 'growth' ? 'growth' : 'growth';
}

function defaultSubscription(): SubscriptionState {
  return {
    tier: 'growth',
    expiresAt: null,
    reflectionsUsedThisMonth: 0,
    monthResetDate: monthResetISO(),
    followUpsUsedThisMonth: 0,
    hasHadExerciseTaste: false,
    hasHadPatternTaste: false,
    weeklyNudgeDismissals: 0,
    lastNudgeDate: null,
    containerCompletionUpsellShown: false,
    trialStartDate: null,
    trialEndDate: null,
  };
}

function normalize(raw: SubscriptionState | null): SubscriptionState {
  const base = defaultSubscription();
  if (!raw) return base;
  return {
    ...base,
    ...raw,
    tier: resolveTier(raw.tier),
    reflectionsUsedThisMonth: Number(raw.reflectionsUsedThisMonth || 0),
    followUpsUsedThisMonth: Number(raw.followUpsUsedThisMonth || 0),
    hasHadExerciseTaste: Boolean(raw.hasHadExerciseTaste),
    hasHadPatternTaste: Boolean(raw.hasHadPatternTaste),
    weeklyNudgeDismissals: Number(raw.weeklyNudgeDismissals || 0),
    lastNudgeDate: raw.lastNudgeDate || null,
    containerCompletionUpsellShown: Boolean(raw.containerCompletionUpsellShown),
    trialStartDate: raw.trialStartDate || null,
    trialEndDate: raw.trialEndDate || null,
  };
}

function withReset(state: SubscriptionState): SubscriptionState {
  const now = new Date();
  // Trial expiration gracefully reverts to Growth while preserving user data and progress.
  if (
    resolveTier(state.tier) === 'transformation' &&
    state.trialEndDate &&
    Number.isFinite(new Date(state.trialEndDate).getTime()) &&
    now >= new Date(state.trialEndDate)
  ) {
    const next: SubscriptionState = {
      ...state,
      tier: 'growth',
      reflectionsUsedThisMonth: 0,
      followUpsUsedThisMonth: 0,
      monthResetDate: monthResetISO(now),
      trialEndDate: null,
    };
    writeJson(STORAGE_KEYS.subscription, next);
    trackConversionEvent('trial_expired');
    return next;
  }

  const resetAt = new Date(state.monthResetDate);
  if (!Number.isFinite(resetAt.getTime()) || now >= resetAt) {
    const next: SubscriptionState = {
      ...state,
      reflectionsUsedThisMonth: 0,
      followUpsUsedThisMonth: 0,
      monthResetDate: monthResetISO(now),
    };
    writeJson(STORAGE_KEYS.subscription, next);
    return next;
  }
  return state;
}

function readSubscription(): SubscriptionState {
  return withReset(normalize(readJsonExact<SubscriptionState | null>(STORAGE_KEYS.subscription, null)));
}

function writeSubscription(next: SubscriptionState): void {
  writeJson(STORAGE_KEYS.subscription, next);
}

export function getEntitlementState(): EntitlementState {
  const sub = readSubscription();
  const tier = resolveTier(sub.tier);
  return {
    tier,
    reflectionsUsedThisMonth: sub.reflectionsUsedThisMonth,
    reflectionsLimit: tier === 'transformation' ? null : 3,
    monthResetDate: sub.monthResetDate,
    followUpsUsedThisMonth: sub.followUpsUsedThisMonth,
    hasHadExerciseTaste: Boolean(sub.hasHadExerciseTaste),
    hasHadPatternTaste: Boolean(sub.hasHadPatternTaste),
    weeklyNudgeDismissals: Number(sub.weeklyNudgeDismissals || 0),
    lastNudgeDate: sub.lastNudgeDate || null,
    containerCompletionUpsellShown: Boolean(sub.containerCompletionUpsellShown),
    trialStartDate: sub.trialStartDate || null,
    trialEndDate: sub.trialEndDate || null,
  };
}

export function getSubscription(): SubscriptionState {
  return readSubscription();
}

export function setTier(tier: Tier): void {
  const current = readSubscription();
  const next: SubscriptionState = { ...current, tier };
  writeSubscription(next);
}

export function beginTransformation(source = 'pricing_page'): TransformationStartResult {
  const current = readSubscription();
  const currentTier = resolveTier(current.tier);
  if (currentTier === 'transformation') {
    return {
      mode: 'already_active',
      trialEndDate: current.trialEndDate || null,
    };
  }

  const now = new Date();
  const hasUsedTrial = Boolean(current.trialStartDate);
  if (!hasUsedTrial) {
    const trialEndDate = addDaysISO(7, now);
    writeSubscription({
      ...current,
      tier: 'transformation',
      trialStartDate: now.toISOString(),
      trialEndDate,
    });
    trackConversionEvent('trial_started', { source });
    return { mode: 'trial_started', trialEndDate };
  }

  writeSubscription({
    ...current,
    tier: 'transformation',
    trialEndDate: null,
  });
  trackConversionEvent('subscription_started', { source });
  return { mode: 'paid_started', trialEndDate: null };
}

export function convertTrialToPaid(source = 'pricing_page'): TransformationStartResult {
  const current = readSubscription();
  if (resolveTier(current.tier) !== 'transformation' || !current.trialEndDate) {
    return beginTransformation(source);
  }
  writeSubscription({
    ...current,
    trialEndDate: null,
  });
  trackConversionEvent('trial_converted', { source });
  trackConversionEvent('subscription_started', { source });
  return { mode: 'trial_converted', trialEndDate: null };
}

export function isTrialActive(state = getEntitlementState()): boolean {
  if (state.tier !== 'transformation') return false;
  if (!state.trialEndDate) return false;
  const end = new Date(state.trialEndDate).getTime();
  return Number.isFinite(end) && Date.now() < end;
}

export function getTrialDaysRemaining(state = getEntitlementState()): number {
  if (!isTrialActive(state)) return 0;
  const ms = new Date(state.trialEndDate as string).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export function canReflect(state = getEntitlementState()): boolean {
  if (state.tier === 'transformation') return true;
  if (state.reflectionsLimit === null) return true;
  return state.reflectionsUsedThisMonth < state.reflectionsLimit;
}

export function recordReflectionUsage(): void {
  const current = readSubscription();
  if (resolveTier(current.tier) === 'transformation') return;
  writeSubscription({ ...current, reflectionsUsedThisMonth: current.reflectionsUsedThisMonth + 1 });
}

export function canUseExercises(state = getEntitlementState()): boolean {
  if (state.tier === 'transformation') return true;
  return !state.hasHadExerciseTaste;
}

export function markExerciseTasteUsed(wasCompleted: boolean): void {
  const current = readSubscription();
  if (resolveTier(current.tier) === 'transformation') return;
  if (current.hasHadExerciseTaste) return;
  writeSubscription({ ...current, hasHadExerciseTaste: true });
  trackConversionEvent(wasCompleted ? 'exercise_taste_completed' : 'exercise_taste_skipped');
}

export function canAccessContainer(containerId: string, state = getEntitlementState()): boolean {
  if (containerId === 'seven-days-of-noticing') return true;
  return state.tier === 'transformation';
}

export function shouldIncludeHistoryContext(entryCount: number, state = getEntitlementState()): boolean {
  if (state.tier === 'transformation') return true;
  if (state.hasHadPatternTaste) return false;
  return entryCount >= 5 || state.reflectionsUsedThisMonth === 0;
}

export function markPatternTasteUsed(): void {
  const current = readSubscription();
  if (resolveTier(current.tier) === 'transformation') return;
  if (current.hasHadPatternTaste) return;
  writeSubscription({ ...current, hasHadPatternTaste: true });
}

export function canAccessMirrorSection(section: string, state = getEntitlementState()): boolean {
  if (state.tier === 'transformation') return true;
  return section === 'your_lines';
}

export function canUseFollowUp(state = getEntitlementState()): boolean {
  return state.tier === 'transformation';
}

export function canUseWeeklyReflection(state = getEntitlementState()): boolean {
  return state.tier === 'transformation';
}

export function canUseThemeExtraction(state = getEntitlementState()): boolean {
  return state.tier === 'transformation';
}

export function canUseEveningCheckIn(state = getEntitlementState()): boolean {
  return state.tier === 'transformation';
}

export function canUseAdaptiveContainerContext(state = getEntitlementState()): boolean {
  return state.tier === 'transformation';
}

export function canAccessFeature(feature: keyof TierLimits): boolean {
  const state = getEntitlementState();
  const limits = TIERS[state.tier].limits;
  const value = limits[feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  return value === null;
}

export function shouldShowWeeklyNudge(entryCountInWeek: number, state = getEntitlementState()): boolean {
  if (state.tier === 'transformation') return false;
  if (state.weeklyNudgeDismissals >= 3) return false;
  if (entryCountInWeek < 3) return false;
  if (canReflect(state)) return false;
  if (!state.lastNudgeDate) return true;
  const then = new Date(state.lastNudgeDate).getTime();
  if (!Number.isFinite(then)) return true;
  return (Date.now() - then) >= 7 * 24 * 60 * 60 * 1000;
}

export function dismissWeeklyNudge(): void {
  const current = readSubscription();
  writeSubscription({
    ...current,
    weeklyNudgeDismissals: Math.min(3, Number(current.weeklyNudgeDismissals || 0) + 1),
    lastNudgeDate: new Date().toISOString(),
  });
  trackConversionEvent('weekly_nudge_dismissed');
}

export function markWeeklyNudgeShown(): void {
  const current = readSubscription();
  writeSubscription({ ...current, lastNudgeDate: new Date().toISOString() });
  trackConversionEvent('weekly_nudge_shown');
}

export function setContainerCompletionUpsellShown(): void {
  const current = readSubscription();
  writeSubscription({ ...current, containerCompletionUpsellShown: true });
  trackConversionEvent('container_completion_upsell');
}

export function formatResetDateLabel(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  } catch {
    return 'next month';
  }
}

export function trackConversionEvent(event: ConversionEventName, context: Record<string, unknown> = {}): void {
  const current = readJsonExact<ConversionEvent[]>(STORAGE_KEYS.conversionEvents, []);
  const next = [...current, { event, timestamp: new Date().toISOString(), context }].slice(-300);
  writeJson(STORAGE_KEYS.conversionEvents, next);
}

export function getConversionEvents(): Array<{ event: string; timestamp: string; context: Record<string, unknown> }> {
  return readJsonExact<ConversionEvent[]>(STORAGE_KEYS.conversionEvents, []);
}
