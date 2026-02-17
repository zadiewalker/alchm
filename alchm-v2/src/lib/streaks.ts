'use client';

import { readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  graceTokens: number; // max 2, reset Sunday
  lastActiveDate: string | null; // ISO date (YYYY-MM-DD)
  isOnBreak: boolean;
  returnBonusActive: boolean;
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  graceTokens: 2,
  lastActiveDate: null,
  isOnBreak: false,
  returnBonusActive: false,
};

export function getStreak(): StreakData {
  const parsed = readJsonExact<StreakData | null>(STORAGE_KEYS.streak, null);
  if (!parsed) return { ...DEFAULT_STREAK };
  return {
    currentStreak: Number(parsed.currentStreak || 0),
    longestStreak: Number(parsed.longestStreak || 0),
    graceTokens: Math.max(0, Math.min(2, Number(parsed.graceTokens ?? 2))),
    lastActiveDate: parsed.lastActiveDate || null,
    isOnBreak: Boolean(parsed.isOnBreak),
    returnBonusActive: Boolean(parsed.returnBonusActive),
  };
}

function saveStreak(data: StreakData): boolean {
  return writeJson(STORAGE_KEYS.streak, data);
}

export interface StreakResult {
  status: 'active' | 'grace_used' | 'streak_reset' | 'on_break' | 'returning';
  message: string;
  graceTokensRemaining: number;
  returnBonusActive: boolean;
  currentStreak: number;
}

function todayISODate(): string {
  return new Date().toISOString().split('T')[0] || '';
}

function daysMissedBetween(lastActive: string, today: string): number {
  const lastDate = new Date(`${lastActive}T00:00:00Z`);
  const todayDate = new Date(`${today}T00:00:00Z`);
  if (Number.isNaN(lastDate.getTime()) || Number.isNaN(todayDate.getTime())) return 0;
  const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86_400_000);
  // Subtract 1 because yesterday => diffDays=1 => 0 missed days.
  return Math.max(0, diffDays - 1);
}

function resetGraceTokensIfSunday(): void {
  const now = new Date();
  const today = todayISODate();
  // Sunday = 0
  if (now.getDay() !== 0) return;
  const lastReset = readJsonExact<string>(STORAGE_KEYS.graceResetDate, '');
  if (lastReset === today) return;
  writeJson(STORAGE_KEYS.graceResetDate, today);
  const s = getStreak();
  if (s.graceTokens !== 2) {
    s.graceTokens = 2;
    saveStreak(s);
  }
}

export function checkAndUpdateStreak(): StreakResult {
  resetGraceTokensIfSunday();

  const data = getStreak();
  const today = todayISODate();

  // First ever visit.
  if (!data.lastActiveDate) {
    data.currentStreak = 1;
    data.longestStreak = Math.max(data.longestStreak, 1);
    data.lastActiveDate = today;
    data.returnBonusActive = false;
    saveStreak(data);
    return {
      status: 'active',
      message: "You're here. That's the win.",
      graceTokensRemaining: data.graceTokens,
      returnBonusActive: false,
      currentStreak: data.currentStreak,
    };
  }

  // Already active today.
  if (data.lastActiveDate === today) {
    return {
      status: 'active',
      message: "You're here. That's the win.",
      graceTokensRemaining: data.graceTokens,
      returnBonusActive: data.returnBonusActive,
      currentStreak: data.currentStreak,
    };
  }

  // On intentional break.
  if (data.isOnBreak) {
    data.isOnBreak = false;
    data.returnBonusActive = true;
    data.currentStreak = 1;
    data.lastActiveDate = today;
    saveStreak(data);
    return {
      status: 'returning',
      message: "Welcome back. Here's a 1.5x boost for honoring your needs.",
      graceTokensRemaining: data.graceTokens,
      returnBonusActive: true,
      currentStreak: data.currentStreak,
    };
  }

  const missed = daysMissedBetween(data.lastActiveDate, today);

  // Consecutive day (no missed days).
  if (missed === 0) {
    data.currentStreak += 1;
    data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
    data.lastActiveDate = today;
    data.returnBonusActive = false;
    saveStreak(data);
    return {
      status: 'active',
      message: "You're here. That's the win.",
      graceTokensRemaining: data.graceTokens,
      returnBonusActive: false,
      currentStreak: data.currentStreak,
    };
  }

  // Missed days: try grace tokens.
  if (missed <= data.graceTokens) {
    data.graceTokens -= missed;
    data.currentStreak += 1; // today counts
    data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
    data.lastActiveDate = today;
    data.returnBonusActive = false;
    saveStreak(data);
    return {
      status: 'grace_used',
      message: 'Life happens. Your streak is safe.',
      graceTokensRemaining: data.graceTokens,
      returnBonusActive: false,
      currentStreak: data.currentStreak,
    };
  }

  // Missed too many days: gentle reset with return bonus.
  data.graceTokens = 0;
  data.currentStreak = 1;
  data.lastActiveDate = today;
  data.returnBonusActive = true;
  saveStreak(data);
  return {
    status: missed > 3 ? 'returning' : 'streak_reset',
    message: missed > 3 ? "Welcome back. Here's a 1.5x boost for honoring your needs." : "You're still here. That's the win. Start fresh.",
    graceTokensRemaining: data.graceTokens,
    returnBonusActive: true,
    currentStreak: 1,
  };
}

export function requestKindnessBreak(): void {
  const data = getStreak();
  data.isOnBreak = true;
  saveStreak(data);
}

