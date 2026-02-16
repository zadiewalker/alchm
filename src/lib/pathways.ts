'use client';

import { canAccessFeature } from '@/lib/subscription';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/lib/storageKeys';

export interface Pathway {
  id: string;
  title: string;
  description: string;
  duration: number;
  framework: string;
  tier: 'free' | 'reflections' | 'sanctuary';
  steps: PathwayStep[];
}

export interface PathwayStep {
  day: number;
  title: string;
  prompt: string;
  kheperaGuidance: string;
  reflectionFocus: string;
}

export interface PathwayProgress {
  pathwayId: string;
  startedAt: string;
  currentStep: number;
  completedSteps: number[];
  entryIds: string[];
  completedAt?: string;
  status: 'active' | 'completed' | 'abandoned';
}

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
      { day: 2, title: 'The Protector', prompt: "What is your anxiety trying to protect you from? What would happen without that protection?", kheperaGuidance: 'Use protective-parts language gently.', reflectionFocus: 'protection' },
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
      { day: 4, title: 'The Face', prompt: "Think of someone you saw today. What did their face reveal beyond words?", kheperaGuidance: 'Reflect on social cues and empathy.', reflectionFocus: 'observation' },
      { day: 5, title: 'The Pattern', prompt: 'What did you do today on autopilot? How did it actually feel?', kheperaGuidance: 'Notice routine without judgment.', reflectionFocus: 'habit awareness' },
      { day: 6, title: 'The Absence', prompt: 'What was missing from today? Not wrong, simply absent.', kheperaGuidance: 'Hold absence with curiosity.', reflectionFocus: 'absence' },
      { day: 7, title: 'The Shift', prompt: 'After a week of noticing, what do you see now that you missed before?', kheperaGuidance: 'Integrate the full week.', reflectionFocus: 'integration' },
    ],
  },
];

function readProgressList(): PathwayProgress[] {
  try {
    const raw = getStorageItemWithFallback(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProgressList(list: PathwayProgress[]): void {
  try {
    setStorageItemNormalized(HISTORY_KEY, JSON.stringify(list));
  } catch {
    // no-op
  }
}

export function getPathwayById(pathwayId: string): Pathway | null {
  return CORE_PATHWAYS.find((pathway) => pathway.id === pathwayId) || null;
}

export function getActivePathway(): PathwayProgress | null {
  try {
    const raw = getStorageItemWithFallback(ACTIVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PathwayProgress;
  } catch {
    return null;
  }
}

export function getPathwayCompletionHistory(): PathwayProgress[] {
  return readProgressList()
    .filter((item) => item.status === 'completed')
    .sort((a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime());
}

export function startPathway(pathwayId: string): PathwayProgress {
  const pathway = getPathwayById(pathwayId);
  if (!pathway) {
    throw new Error('Pathway not found');
  }

  if (pathway.tier !== 'free' && !canAccessFeature('pathwayAccess')) {
    throw new Error('Pathway access requires Sanctuary tier');
  }

  const active: PathwayProgress = {
    pathwayId,
    startedAt: new Date().toISOString(),
    currentStep: 0,
    completedSteps: [],
    entryIds: [],
    status: 'active',
  };

  try {
    setStorageItemNormalized(ACTIVE_KEY, JSON.stringify(active));
    const history = readProgressList().filter((item) => !(item.pathwayId === pathwayId && item.status === 'active'));
    history.push(active);
    writeProgressList(history);
  } catch {
    // no-op
  }

  return active;
}

export function completePathwayStep(pathwayId: string, stepIndex: number, entryId: string): PathwayProgress {
  const pathway = getPathwayById(pathwayId);
  if (!pathway) {
    throw new Error('Pathway not found');
  }

  const current = getActivePathway();
  if (!current || current.pathwayId !== pathwayId) {
    throw new Error('No active pathway found');
  }

  const completedSteps = Array.from(new Set([...current.completedSteps, stepIndex])).sort((a, b) => a - b);
  const next: PathwayProgress = {
    ...current,
    completedSteps,
    entryIds: Array.from(new Set([...current.entryIds, entryId])),
    currentStep: Math.min(pathway.steps.length - 1, stepIndex + 1),
    status: completedSteps.length >= pathway.steps.length ? 'completed' : 'active',
    completedAt: completedSteps.length >= pathway.steps.length ? new Date().toISOString() : current.completedAt,
  };

  try {
    if (next.status === 'completed') {
      setStorageItemNormalized(ACTIVE_KEY, '');
    } else {
      setStorageItemNormalized(ACTIVE_KEY, JSON.stringify(next));
    }

    const history = readProgressList()
      .filter((item) => !(item.pathwayId === pathwayId && item.status === 'active'))
      .concat(next);
    writeProgressList(history);
  } catch {
    // no-op
  }

  return next;
}

export function abandonPathway(pathwayId: string): void {
  const current = getActivePathway();
  if (!current || current.pathwayId !== pathwayId) return;

  const abandoned: PathwayProgress = {
    ...current,
    status: 'abandoned',
  };

  try {
    setStorageItemNormalized(ACTIVE_KEY, '');
    const history = readProgressList()
      .filter((item) => !(item.pathwayId === pathwayId && item.status === 'active'))
      .concat(abandoned);
    writeProgressList(history);
  } catch {
    // no-op
  }
}

export function canStartPathway(pathway: Pathway): boolean {
  if (pathway.tier === 'free') return true;
  if (pathway.tier === 'reflections') return true;
  return canAccessFeature('pathwayAccess');
}
