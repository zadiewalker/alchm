'use client';

import type { StreakData } from '@/lib/streaks';

export function getMilestoneMessage(entryCount: number, streak: StreakData): string | null {
  if (entryCount === 1) return "You're still here. That's the win.";
  if (streak.currentStreak === 7) return "Seven days. You're still here. That matters.";
  if (entryCount === 30) return "30 entries. You've been showing up for yourself.";
  if (streak.returnBonusActive) return "Welcome back. You're still here.";
  return null;
}

