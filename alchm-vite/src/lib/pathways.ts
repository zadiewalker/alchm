'use client';

import type { JournalEntry, SubscriptionTier } from '@/lib/types';
import { readJsonExact, removeKey, writeJson } from '@/lib/storage';
import { canAccessFeature } from '@/lib/subscription';
import { getEntries } from '@/lib/journal';

export interface PathwayStep {
  day: number;
  title: string;
  prompt: string | { question: string };
  kheperaGuidance: string;
  reflectionFocus: string;
  phase?: 'grounding' | 'pattern' | 'challenge' | 'integration';
}

export interface Pathway {
  id: string;
  title: string;
  description: string;
  duration: number;
  framework: string;
  tier: SubscriptionTier;
  steps: PathwayStep[];
}

export interface PathwayProgress {
  pathwayId: string;
  startedAt: string;
  currentStep: number;
  completedSteps: number[];
  entryIds: string[];
  completedAt?: string;
  status: 'active' | 'completed' | 'abandoned';
  showMigrationPrompt?: boolean;
  graduationReflection?: string;
  graduationKheperaReflection?: string;
}

export type DayAvailability = {
  day: number;
  status: 'completed' | 'next' | 'available' | 'locked';
};

const ACTIVE_KEY = 'alchm-active-pathway';
const HISTORY_KEY = 'alchm-pathway-progress';

export const CORE_PATHWAYS: Pathway[] = [
  {
    id: 'sitting-with-anxiety',
    title: 'Sitting With Anxiety',
    description: 'A 5-day journey into what anxiety is trying to protect.',
    duration: 5,
    framework: 'somatic',
    tier: 'sanctuary',
    steps: [
      { day: 1, title: 'Naming It', prompt: 'Where do you feel anxiety in your body right now? Not the thought, the sensation.', kheperaGuidance: 'Focus on somatic awareness without judgment.', reflectionFocus: 'body awareness' },
      { day: 2, title: 'The Protector', prompt: 'What is your anxiety trying to protect you from? What would happen without that protection?', kheperaGuidance: 'Use protective-parts language gently.', reflectionFocus: 'protection' },
      { day: 3, title: 'The Pattern', prompt: 'When did this anxiety first show up in your life? What was happening then?', kheperaGuidance: 'Trace the story with care, no diagnosis.', reflectionFocus: 'origin story' },
      { day: 4, title: 'The Conversation', prompt: 'If you could speak directly to your anxiety, what would you say? What might it say back?', kheperaGuidance: 'Support inner dialogue without conflict.', reflectionFocus: 'dialogue' },
      { day: 5, title: 'Sitting With It', prompt: 'Can you sit with anxiety for two minutes without fixing it? What shifts when you stop fighting?', kheperaGuidance: 'Hold tension and acceptance together.', reflectionFocus: 'acceptance' },
    ],
  },
  {
    id: 'the-inner-critic',
    title: 'The Inner Critic',
    description: 'A 5-day practice for hearing and answering the voice that judges you.',
    duration: 5,
    framework: 'cbt',
    tier: 'sanctuary',
    steps: [
      { day: 1, title: 'The Voice', prompt: 'Write exactly what your inner critic said today, in its own words.', kheperaGuidance: 'Externalize the critic as a voice, not truth.', reflectionFocus: 'externalization' },
      { day: 2, title: 'The Origin', prompt: 'Whose voice does your inner critic resemble? Where did you learn this tone?', kheperaGuidance: 'Explore origins with compassion.', reflectionFocus: 'origin' },
      { day: 3, title: 'The Evidence', prompt: 'Choose one critical thought. What evidence supports it, and what challenges it?', kheperaGuidance: 'Use balanced evidence reflection.', reflectionFocus: 'cognitive balance' },
      { day: 4, title: 'The Response', prompt: 'Write a response letter to your inner critic. Not to silence it, to answer it.', kheperaGuidance: 'Encourage relational response and boundaries.', reflectionFocus: 'response' },
      { day: 5, title: 'The Rewrite', prompt: 'What would you tell someone you love who spoke about themselves this way?', kheperaGuidance: 'Shift toward self-compassion.', reflectionFocus: 'self-compassion' },
    ],
  },
  {
    id: 'seven-days-of-noticing',
    title: 'Seven Days of Noticing',
    description: 'A week of paying attention to what usually goes unseen.',
    duration: 7,
    framework: 'somatic',
    tier: 'free',
    steps: [
      { day: 1, title: 'The Body', prompt: 'Without changing anything, what does your body feel like right now?', kheperaGuidance: 'Stay with sensory awareness.', reflectionFocus: 'body scan' },
      { day: 2, title: 'The Room', prompt: 'Describe where you are as if to someone who has never seen it.', kheperaGuidance: 'Ground through sensory detail.', reflectionFocus: 'presence' },
      { day: 3, title: 'The Sound', prompt: 'Close your eyes for 30 seconds. What do you hear?', kheperaGuidance: 'Invite auditory noticing and regulation.', reflectionFocus: 'listening' },
      { day: 4, title: 'The Face', prompt: 'Think of someone you saw today. What did their face reveal beyond words?', kheperaGuidance: 'Reflect on social cues and empathy.', reflectionFocus: 'observation' },
      { day: 5, title: 'The Pattern', prompt: 'What did you do today on autopilot? How did it actually feel?', kheperaGuidance: 'Notice routine without judgment.', reflectionFocus: 'habit awareness' },
      { day: 6, title: 'The Absence', prompt: 'What was missing from today? Not wrong, simply absent.', kheperaGuidance: 'Hold absence with curiosity.', reflectionFocus: 'absence' },
      { day: 7, title: 'The Shift', prompt: 'After a week of noticing, what do you see now that you missed before?', kheperaGuidance: 'Integrate the full week.', reflectionFocus: 'integration' },
    ],
  },
];

export function getPathwayById(pathwayId: string): Pathway | null {
  return CORE_PATHWAYS.find((p) => p.id === pathwayId) || null;
}

export function getActivePathway(): PathwayProgress | null {
  return readJsonExact<PathwayProgress | null>(ACTIVE_KEY, null);
}

export function getPathwayHistory(): PathwayProgress[] {
  const parsed = readJsonExact<unknown>(HISTORY_KEY, []);
  return Array.isArray(parsed) ? (parsed as PathwayProgress[]) : [];
}

export function startPathway(pathwayId: string): { ok: boolean; message?: string } {
  const pathway = getPathwayById(pathwayId);
  if (!pathway) return { ok: false, message: 'Pathway not found.' };
  if (pathway.tier === 'sanctuary' && !canAccessFeature('pathwayAccess')) {
    return { ok: false, message: 'Pathways are available on Sanctuary.' };
  }

  const progress: PathwayProgress = {
    pathwayId,
    startedAt: new Date().toISOString(),
    currentStep: 1,
    completedSteps: [],
    entryIds: [],
    status: 'active',
  };
  writeJson(ACTIVE_KEY, progress);
  return { ok: true };
}

export function recordPathwayEntry(entry: JournalEntry): void {
  const active = getActivePathway();
  if (!active) return;
  if (entry.pathwayId !== active.pathwayId) return;
  const pathway = getPathwayById(active.pathwayId);
  const maxSteps = pathway?.duration ?? 5;

  const next: PathwayProgress = {
    ...active,
    entryIds: [entry.id, ...active.entryIds],
    completedSteps: active.completedSteps.includes(active.currentStep)
      ? active.completedSteps
      : [...active.completedSteps, active.currentStep],
    currentStep: Math.min(active.currentStep + 1, 99),
  };

  if (next.completedSteps.length >= maxSteps) {
    next.status = 'completed';
    next.completedAt = new Date().toISOString();
    removeKey(ACTIVE_KEY);
    const history = getPathwayHistory();
    writeJson(HISTORY_KEY, [next, ...history]);
    return;
  }

  writeJson(ACTIVE_KEY, next);
}

export function getAdaptivePrompt(pathwayId: string, dayNumber: number): string | null {
  const pathway = getPathwayById(pathwayId);
  if (!pathway) return null;
  const day = pathway.steps.find((s) => s.day === dayNumber) || pathway.steps[0];
  if (!day) return null;
  const prompt = typeof day.prompt === 'string' ? day.prompt : day.prompt.question;

  if (dayNumber <= 1) return prompt;

  // Day 2+: adapt only if the immediately previous day's entry exists.
  const prev = getEntries().find((e) => e.pathwayId === pathwayId && e.pathwayStep === dayNumber - 1) || null;
  if (!prev || !prev.content) return prompt;

  const snippet = prev.content.slice(0, 200).replace(/\s+/g, ' ').trim();
  const prefix = snippet
    ? `Yesterday you wrote: "${snippet}${prev.content.length > 200 ? '…' : ''}"\n\nBuilding on that — `
    : 'Building on that — ';

  return prefix + prompt;
}

export function acknowledgeMigrationPrompt(): void {
  const active = getActivePathway();
  if (!active) return;
  writeJson(ACTIVE_KEY, { ...active, showMigrationPrompt: false });
}

export function getPathwayPhase(_pathwayId: string, day: number): string {
  if (day <= 5) return 'grounding';
  if (day <= 10) return 'pattern';
  if (day <= 16) return 'challenge';
  return 'integration';
}

export function getPhaseProgress(progress: PathwayProgress | null): number {
  if (!progress) return 0;
  return Math.max(0, Math.min(100, Math.round((progress.completedSteps.length / 21) * 100)));
}

export function getDayAvailability(pathwayId: string, currentStep: number, completedSteps: number[]): DayAvailability[] {
  const pathway = getPathwayById(pathwayId);
  const duration = pathway?.duration || 21;
  return Array.from({ length: duration }, (_, idx) => {
    const day = idx + 1;
    if (completedSteps.includes(day)) return { day, status: 'completed' };
    if (day === currentStep) return { day, status: 'next' };
    if (day < currentStep) return { day, status: 'available' };
    return { day, status: 'locked' };
  });
}

export function selectPathwayDay(pathwayId: string, day: number): { ok: boolean; message?: string } {
  const active = getActivePathway();
  if (!active || active.pathwayId !== pathwayId) return { ok: false, message: 'No active container found.' };
  const next: PathwayProgress = { ...active, currentStep: day };
  writeJson(ACTIVE_KEY, next);
  return { ok: true };
}

export function restartActivePathway(): { ok: boolean; message?: string } {
  const active = getActivePathway();
  if (!active) return { ok: false, message: 'No active container to restart.' };
  const next: PathwayProgress = { ...active, currentStep: 1, completedSteps: [], entryIds: [] };
  writeJson(ACTIVE_KEY, next);
  return { ok: true };
}

export function pauseActivePathway(): { ok: boolean; message?: string } {
  const active = getActivePathway();
  if (!active) return { ok: false, message: 'No active container to pause.' };
  const next: PathwayProgress = { ...active, status: 'abandoned' };
  const history = getPathwayHistory();
  writeJson(HISTORY_KEY, [next, ...history]);
  removeKey(ACTIVE_KEY);
  return { ok: true };
}

export function getPathwayStartGate(pathwayId: string): { canStart: boolean; reason?: string } {
  const active = getActivePathway();
  if (active && active.pathwayId !== pathwayId) {
    return { canStart: false, reason: 'One container at a time.' };
  }
  return { canStart: true };
}

export function getPathwayCooldownRemainingDays(): number {
  return 0;
}

export function getPathwayMidpointDay(pathwayId: string): number {
  const pathway = getPathwayById(pathwayId);
  const duration = pathway?.duration || 21;
  return Math.ceil(duration / 2);
}

export function getPathwayGuidance(pathwayId: string, day?: number): string {
  const pathway = getPathwayById(pathwayId);
  if (!pathway) return '';
  const step = pathway.steps.find((s) => s.day === (day || 1)) || pathway.steps[0];
  return step?.kheperaGuidance || '';
}

export async function savePathwayGraduationPackage(args: { pathwayId: string; reflection: string }): Promise<void> {
  const history = getPathwayHistory();
  const next = history.map((item) => (item.pathwayId === args.pathwayId && item.status === 'completed'
    ? { ...item, graduationReflection: args.reflection }
    : item));
  writeJson(HISTORY_KEY, next);
}
