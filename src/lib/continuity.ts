'use client';

import { getStorageItemWithFallback } from '@/lib/storageKeys';

export type ContinuityCardType = 'theme_echo';

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
  themes: ContinuityTheme[];
}

export interface ContinuityCard {
  type: ContinuityCardType;
  title: string;
  message: string;
  accent: 'sage' | 'gold';
}

interface EntryShape {
  createdAt?: string | Date;
  emotions?: string[];
  mood?: string[];
  content?: string;
}

const SESSION_DISMISS_KEY = 'alchm-continuity-dismissed-card';
const HEAVY_MOODS = new Set(['shattered', 'heavy', 'anxious', 'restless', 'burning', 'numb']);
const LIGHT_MOODS = new Set(['calm', 'hopeful', 'alive', 'tender']);

function readEntries(): EntryShape[] {
  try {
    const raw = getStorageItemWithFallback('alchm-journal-entries') || getStorageItemWithFallback('journal_entries');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
    const raw = getStorageItemWithFallback('alchm-khepera-themes');
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
  try {
    const entries = readEntries()
      .map((entry) => ({ ...entry, _date: entryDate(entry.createdAt) }))
      .filter((entry): entry is EntryShape & { _date: Date } => Boolean(entry._date))
      .sort((a, b) => b._date.getTime() - a._date.getTime());

    const latest = entries[0];
    const now = new Date();
    const daysSinceLastEntry = latest ? dayDiff(latest._date, now) : null;
    const recentMoods = entries.flatMap(coerceMoods).filter(Boolean).slice(0, 8);
    const entryCountThisWeek = entries.filter((entry) => dayDiff(entry._date, now) <= 7).length;
    const themes = readThemes();

    return {
      daysSinceLastEntry,
      lastMood: latest ? coerceMoods(latest) : null,
      lastEntrySnippet: latest?.content ? String(latest.content).slice(0, 100) : null,
      moodTrend: inferMoodTrend(recentMoods),
      recentMoods,
      entryCountThisWeek,
      themes,
    };
  } catch {
    return {
      daysSinceLastEntry: null,
      lastMood: null,
      lastEntrySnippet: null,
      moodTrend: 'insufficient',
      recentMoods: [],
      entryCountThisWeek: 0,
      themes: [],
    };
  }
}

export function generateDashboardGreeting(context: ContinuityContext): string {
  const hour = new Date().getHours();
  const timeLabel = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : hour < 22 ? 'evening' : 'late night';

  if (context.daysSinceLastEntry === null) return 'Welcome to ALCHM.';
  if (context.daysSinceLastEntry === 0) return timeLabel === 'late night' ? 'Back again tonight. Khepera is here.' : 'Back again. Khepera is here.';
  return `Good ${timeLabel}.`;
}

export function generateContinuityCard(context: ContinuityContext): ContinuityCard | null {
  if (context.themes.length >= 2) {
    const topThemes = context.themes.slice(0, 2).map((item) => item.theme).join(' and ');
    return {
      type: 'theme_echo',
      title: 'Khepera has noticed',
      message: `Across your entries, familiar threads keep appearing: ${topThemes}.`,
      accent: 'sage',
    };
  }

  return null;
}

export function dismissContinuityCardForSession(type: ContinuityCardType): void {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(SESSION_DISMISS_KEY, type);
  } catch {
    // no-op
  }
}

export function isContinuityCardDismissedForSession(type: ContinuityCardType): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(SESSION_DISMISS_KEY) === type;
  } catch {
    return false;
  }
}

export function appendContinuityToPrompt(basePrompt: string, context: ContinuityContext): string {
  const additions: string[] = [];

  if (context.themes.length) {
    additions.push(`Recurring themes: ${context.themes.map((item) => item.theme).join(', ')}.`);
  }

  if (!additions.length) return basePrompt;
  return `${basePrompt}\n\nCONTINUITY CONTEXT:\n${additions.join('\n')}`;
}
