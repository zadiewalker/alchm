'use client';

import { SESSION_STORAGE_KEYS, STORAGE_KEYS } from '@/config/storageKeys';
import { safeSessionStorage } from '@/utils/browser';
import { getStorageItemWithFallback } from '@/utils/storage';

export type ContinuityCardType = 'mood_shift' | 'stage_state' | 'theme_echo' | 'return_welcome';

export interface ContinuityTheme {
  theme: string;
  frequency: number;
}

export interface ContinuityContext {
  daysSinceLastEntry: number | null;
  lastMood: string[] | null;
  lastEntrySnippet: string | null;
  moodTrend: 'improving' | 'stable' | 'declining' | 'varied' | 'insufficient';
  recentMoods: string[];
  entryCountThisWeek: number;
  kheperaStage: number;
  stageState: number;
  themes: ContinuityTheme[];
}

export interface ContinuityCard {
  type: ContinuityCardType;
  title: string;
  message: string;
  accent: 'sage' | 'light';
}

interface EntryShape {
  createdAt?: string | Date;
  emotions?: string[];
  mood?: string[];
}

const STAGE_THRESHOLDS = [0, 7, 21, 50, 100];
const HEAVY_MOODS = new Set(['shattered', 'heavy', 'anxious', 'restless', 'burning', 'numb']);
const LIGHT_MOODS = new Set(['calm', 'hopeful', 'alive', 'tender']);

function readEntries(): EntryShape[] {
  return [];
}

function entryDate(value: string | Date | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function coerceMoods(entry: EntryShape): string[] {
  if (Array.isArray(entry.mood)) return entry.mood;
  if (Array.isArray(entry.emotions)) return entry.emotions;
  return [];
}

function dayDiff(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function inferMoodTrend(moods: string[]): ContinuityContext['moodTrend'] {
  if (moods.length < 3) return 'insufficient';
  const recent = moods.slice(0, 3);
  const previous = moods.slice(3, 6);
  if (!previous.length) return 'insufficient';

  const recentHeavy = recent.filter((mood) => HEAVY_MOODS.has(mood)).length;
  const previousHeavy = previous.filter((mood) => HEAVY_MOODS.has(mood)).length;
  const recentLight = recent.filter((mood) => LIGHT_MOODS.has(mood)).length;
  const previousLight = previous.filter((mood) => LIGHT_MOODS.has(mood)).length;

  if (recentHeavy === previousHeavy && recentLight === previousLight) return 'stable';
  if (recentLight > previousLight && recentHeavy <= previousHeavy) return 'improving';
  if (recentHeavy > previousHeavy && recentLight <= previousLight) return 'declining';
  return 'varied';
}

function readThemes(): ContinuityTheme[] {
  try {
    const raw = getStorageItemWithFallback(STORAGE_KEYS.CONTINUITY_THEMES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => typeof item?.theme === 'string')
      .map((item) => ({
        theme: String(item.theme),
        frequency: Number(item.frequency || 1),
      }))
      .slice(0, 5);
  } catch {
    return [];
  }
}

export function getContinuityContext(): ContinuityContext {
  return {
    daysSinceLastEntry: null,
    lastMood: null,
    lastEntrySnippet: null,
    moodTrend: 'insufficient',
    recentMoods: [],
    entryCountThisWeek: 0,
    kheperaStage: 1,
    stageState: 0,
    themes: readThemes(),
  };
}

export function generateDashboardGreeting(context: ContinuityContext): string {
  void context;
  return 'Welcome to ALCHM.';
}

export function generateContinuityCard(context: ContinuityContext): ContinuityCard | null {
  void context;
  return null;
}

export function dismissContinuityCardForSession(type: ContinuityCardType): void {
  try {
    safeSessionStorage.setItem(SESSION_STORAGE_KEYS.CONTINUITY_DISMISSED_CARD, type);
  } catch {
    // no-op
  }
}

export function isContinuityCardDismissedForSession(type: ContinuityCardType): boolean {
  try {
    return safeSessionStorage.getItem(SESSION_STORAGE_KEYS.CONTINUITY_DISMISSED_CARD) === type;
  } catch {
    return false;
  }
}
