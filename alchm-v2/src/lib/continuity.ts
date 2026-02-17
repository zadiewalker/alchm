'use client';

import { getEntries } from '@/lib/journal';
import { DESIGN } from '@/lib/design';
import { getCurrentStage } from '@/lib/khepera';
import { readString, STORAGE_KEYS, writeString } from '@/lib/storage';

export interface ContinuityContext {
  greeting: string;
  whisper: string;
  entryCount: number;
  daysSinceLastEntry: number;
  stageName: string;
  stageId: string;
  showGraceToken: boolean;
  gracePrompt: string | null;
  showStageTransition: boolean;
  stageTransitionMessage: string | null;
}

function daysBetweenUtc(a: Date, b: Date): number {
  const dayMs = 86_400_000;
  const aUtc = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const bUtc = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.floor((aUtc - bUtc) / dayMs);
}

function pickGracePrompt(seed: number): string {
  const prompts = [
    'Write about what brought you back today.',
    "What's one thing that's different since you were last here?",
    'Start anywhere. Even one word.',
    'What does today feel like?',
  ];
  return prompts[Math.abs(seed) % prompts.length];
}

export function markStageTransitionSeen(stageId: string): void {
  try {
    writeString(STORAGE_KEYS.lastShownStageId, stageId);
  } catch {
    // no-op
  }
}

export function markGraceTokenSeenForEntryDate(entryDateIso: string): void {
  try {
    writeString(STORAGE_KEYS.lastGraceShownForEntryDate, entryDateIso);
  } catch {
    // no-op
  }
}

export function getContinuity(): ContinuityContext {
  const entries = getEntries();
  const entryCount = entries.length;
  const now = new Date();

  let daysSinceLastEntry = Number.POSITIVE_INFINITY;
  let lastEntryDateIso = '';
  if (entryCount > 0) {
    lastEntryDateIso = entries[0].createdAt || entries[0].updatedAt || '';
    const lastDate = new Date(lastEntryDateIso);
    if (!Number.isNaN(lastDate.getTime())) {
      daysSinceLastEntry = daysBetweenUtc(now, lastDate);
    }
  }

  // Greeting (fluid time, never scored).
  const hour = now.getHours();
  let greeting: string;
  if (entryCount === 0) greeting = 'Welcome to your sanctuary.';
  else if (daysSinceLastEntry >= 3) greeting = 'Welcome back. Your sanctuary has been waiting.';
  else if (hour < 12) greeting = 'Good morning.';
  else if (hour < 17) greeting = 'Good afternoon.';
  else greeting = 'The day is settling.';

  const stage = getCurrentStage(entryCount);

  // Grace token (anti-streak): show once per "last entry date".
  const lastGraceShownFor = readString(STORAGE_KEYS.lastGraceShownForEntryDate, '');
  const showGraceToken = entryCount > 0 && daysSinceLastEntry >= 3 && lastGraceShownFor !== lastEntryDateIso;
  const gracePrompt = showGraceToken ? pickGracePrompt(Date.parse(lastEntryDateIso) || now.getTime()) : null;

  // Stage transition moment (shown once per stage).
  const lastShownStageId = readString(STORAGE_KEYS.lastShownStageId, '');
  const showStageTransition = entryCount > 0 && stage.id !== lastShownStageId && stage.threshold > 0;
  const stageTransitionMessage = showStageTransition
    ? `Khepera has deepened. After ${stage.threshold} entries, I listen differently. More gently. You'll notice.`
    : null;

  // Whisper (local, instant).
  let whisper = "I'm Khepera. When you write, I listen.";
  if (entryCount === 0) {
    whisper = "I'm Khepera. When you write, I listen.";
  } else if (showGraceToken) {
    whisper = "You were away. No streak broken. No points lost. You're here now, and that's enough.";
  } else if (showStageTransition) {
    whisper = stageTransitionMessage || whisper;
  } else if (entryCount === 1) {
    const mood = typeof entries[0].mood === 'number' ? entries[0].mood : null;
    whisper = mood ? `You started with "${mood}." That was your first word here.` : 'You wrote your first entry. That took something.';
  } else if (daysSinceLastEntry >= 7) {
    whisper = "It's been a while. No judgment, only welcome.";
  } else {
    const recentMoods = entries
      .slice(0, 5)
      .map((e) => e.mood)
      .filter((m): m is number => typeof m === 'number' && Number.isFinite(m));
    const uniq = Array.from(new Set(recentMoods));
    if (uniq.length === 1 && uniq[0] !== undefined) {
      whisper = `You've been feeling something consistent lately. I see that.`;
    } else if (entryCount >= 5) {
      whisper = `Patterns are forming. When you're ready, The Mirror can hold them with you.`;
    } else {
      whisper = "I'm here. Write when you want to.";
    }
  }

  // Ensure we never accidentally brighten into clinical white.
  whisper = whisper.trim() || DESIGN.colors.textPrimary;

  return {
    greeting,
    whisper,
    entryCount,
    daysSinceLastEntry: Number.isFinite(daysSinceLastEntry) ? daysSinceLastEntry : Number.POSITIVE_INFINITY,
    stageName: stage.name,
    stageId: stage.id,
    showGraceToken,
    gracePrompt,
    showStageTransition,
    stageTransitionMessage,
  };
}

