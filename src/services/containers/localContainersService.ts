'use client';

import { STORAGE_KEYS } from '@/config/storageKeys';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/utils/storage';

export interface Container {
  id: string;
  title: string;
  description: string;
  duration: number;
  framework: string;
  tier: 'sanctuary' | 'transformation';
  steps: ContainerStep[];
}

export interface ContainerStep {
  day: number;
  title: string;
  prompt: string;
  kheperaGuidance: string;
  reflectionFocus: string;
}

export interface ContainerState {
  containerId: string;
  startedAt: string;
  currentStep: number;
  completedSteps: number[];
  entryIds: string[];
  completedAt?: string;
  status: 'active' | 'completed' | 'abandoned';
}

const ACTIVE_KEY = STORAGE_KEYS.LOCAL_ACTIVE_CONTAINER;
const HISTORY_KEY = STORAGE_KEYS.LOCAL_CONTAINER_HISTORY;
const CONTAINER_PHASES: Array<{ name: 'Grounding' | 'Pattern' | 'Challenge' | 'Integration'; start: number; end: number }> = [
  { name: 'Grounding', start: 1, end: 5 },
  { name: 'Pattern', start: 6, end: 10 },
  { name: 'Challenge', start: 11, end: 16 },
  { name: 'Integration', start: 17, end: 21 },
];

function phaseForDay(day: number): (typeof CONTAINER_PHASES)[number]['name'] {
  const phase = CONTAINER_PHASES.find((item) => day >= item.start && day <= item.end);
  return phase?.name ?? 'Integration';
}

function expandTo21Days(baseSteps: ContainerStep[], flavor: 'anxiety' | 'critic' | 'noticing'): ContainerStep[] {
  const phaseGuidance: Record<typeof flavor, Record<ReturnType<typeof phaseForDay>, string>> = {
    anxiety: {
      Grounding: 'Stay close to sensation. Breathe slowly before writing.',
      Pattern: 'Name recurring triggers and the protection underneath.',
      Challenge: 'Gently test the belief that anxiety must control every move.',
      Integration: 'Practice steady presence with less fixing and more trust.',
    },
    critic: {
      Grounding: 'Externalize the critic and reduce fusion with its voice.',
      Pattern: 'Track repeated judgments and their original source.',
      Challenge: 'Respond with evidence and compassionate boundaries.',
      Integration: 'Consolidate a kinder inner stance you can return to.',
    },
    noticing: {
      Grounding: 'Anchor in simple sensory detail and present-moment awareness.',
      Pattern: 'Notice what repeats in body, room, and routine.',
      Challenge: 'Interrupt autopilot and make one conscious choice each day.',
      Integration: 'Carry noticing into daily life as a stable practice.',
    },
  };

  return Array.from({ length: 21 }, (_, index) => {
    const day = index + 1;
    const phase = phaseForDay(day);
    const base = baseSteps[index % baseSteps.length];
    return {
      day,
      title: `${phase} · ${base.title}`,
      prompt: `Day ${day}: ${base.prompt} ${phaseGuidance[flavor][phase]}`,
      kheperaGuidance: `${base.kheperaGuidance} ${phaseGuidance[flavor][phase]}`,
      reflectionFocus: `${phase.toLowerCase()} · ${base.reflectionFocus}`,
    };
  });
}

export const CORE_CONTAINERS: Container[] = [
  {
    id: 'sitting-with-anxiety',
    title: 'Sitting With Anxiety',
    description: 'A 21-day container for listening to what anxiety is trying to protect.',
    duration: 21,
    framework: 'somatic',
    tier: 'transformation',
    steps: expandTo21Days([
      { day: 1, title: 'Naming It', prompt: 'Where do you feel anxiety in your body right now? Not the thought, the sensation.', kheperaGuidance: 'Focus on somatic awareness without judgment.', reflectionFocus: 'body awareness' },
      { day: 2, title: 'The Protector', prompt: "What is your anxiety trying to protect you from? What would happen without that protection?", kheperaGuidance: 'Use protective-parts language gently.', reflectionFocus: 'protection' },
      { day: 3, title: 'The Pattern', prompt: 'When did this anxiety first show up in your life? What was happening then?', kheperaGuidance: 'Trace the story with care, no diagnosis.', reflectionFocus: 'origin story' },
      { day: 4, title: 'The Conversation', prompt: 'If you could speak directly to your anxiety, what would you say? What might it say back?', kheperaGuidance: 'Support inner dialogue without conflict.', reflectionFocus: 'dialogue' },
      { day: 5, title: 'Sitting With It', prompt: 'Can you sit with anxiety for two minutes without fixing it? What shifts when you stop fighting?', kheperaGuidance: 'Hold tension and acceptance together.', reflectionFocus: 'acceptance' },
    ], 'anxiety'),
  },
  {
    id: 'the-inner-critic',
    title: 'The Inner Critic',
    description: 'A 21-day practice for hearing and answering the voice that judges you.',
    duration: 21,
    framework: 'cbt',
    tier: 'transformation',
    steps: expandTo21Days([
      { day: 1, title: 'The Voice', prompt: 'Write exactly what your inner critic said today, in its own words.', kheperaGuidance: 'Externalize the critic as a voice, not truth.', reflectionFocus: 'externalization' },
      { day: 2, title: 'The Origin', prompt: 'Whose voice does your inner critic resemble? Where did you learn this tone?', kheperaGuidance: 'Explore origins with compassion.', reflectionFocus: 'origin' },
      { day: 3, title: 'The Evidence', prompt: 'Choose one critical thought. What evidence supports it, and what challenges it?', kheperaGuidance: 'Use balanced evidence reflection.', reflectionFocus: 'cognitive balance' },
      { day: 4, title: 'The Response', prompt: 'Write a response letter to your inner critic. Not to silence it, to answer it.', kheperaGuidance: 'Encourage relational response and boundaries.', reflectionFocus: 'response' },
      { day: 5, title: 'The Rewrite', prompt: 'What would you tell someone you love who spoke about themselves this way?', kheperaGuidance: 'Shift toward self-compassion.', reflectionFocus: 'self-compassion' },
    ], 'critic'),
  },
  {
    id: 'seven-days-of-noticing',
    title: 'Seven Days of Noticing',
    description: 'A 21-day container of paying attention to what usually goes unseen.',
    duration: 21,
    framework: 'somatic',
    tier: 'sanctuary',
    steps: expandTo21Days([
      { day: 1, title: 'The Body', prompt: 'Without changing anything, what does your body feel like right now?', kheperaGuidance: 'Stay with sensory awareness.', reflectionFocus: 'body scan' },
      { day: 2, title: 'The Room', prompt: 'Describe where you are as if to someone who has never seen it.', kheperaGuidance: 'Ground through sensory detail.', reflectionFocus: 'presence' },
      { day: 3, title: 'The Sound', prompt: 'Close your eyes for 30 seconds. What do you hear?', kheperaGuidance: 'Invite auditory noticing and regulation.', reflectionFocus: 'listening' },
      { day: 4, title: 'The Face', prompt: "Think of someone you saw today. What did their face reveal beyond words?", kheperaGuidance: 'Reflect on social cues and empathy.', reflectionFocus: 'observation' },
      { day: 5, title: 'The Pattern', prompt: 'What did you do today on autopilot? How did it actually feel?', kheperaGuidance: 'Notice routine without judgment.', reflectionFocus: 'habit awareness' },
      { day: 6, title: 'The Absence', prompt: 'What was missing from today? Not wrong, simply absent.', kheperaGuidance: 'Hold absence with curiosity.', reflectionFocus: 'absence' },
      { day: 7, title: 'The Shift', prompt: 'After a week of noticing, what feels clearer from here?', kheperaGuidance: 'Integrate the full week.', reflectionFocus: 'integration' },
    ], 'noticing'),
  },
];

function readStateList(): ContainerState[] {
  try {
    const raw = getStorageItemWithFallback(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStateList(list: ContainerState[]): void {
  try {
    setStorageItemNormalized(HISTORY_KEY, JSON.stringify(list));
  } catch {
    // no-op
  }
}

export function getContainerById(containerId: string): Container | null {
  return CORE_CONTAINERS.find((container) => container.id === containerId) || null;
}

export function getActiveContainer(): ContainerState | null {
  try {
    const raw = getStorageItemWithFallback(ACTIVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ContainerState;
  } catch {
    return null;
  }
}

export function getContainerCompletionHistory(): ContainerState[] {
  return readStateList()
    .filter((item) => item.status === 'completed')
    .sort((a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime());
}

export function startContainer(containerId: string): ContainerState {
  const container = getContainerById(containerId);
  if (!container) throw new Error('Container not found');

  const active: ContainerState = {
    containerId,
    startedAt: new Date().toISOString(),
    currentStep: 0,
    completedSteps: [],
    entryIds: [],
    status: 'active',
  };

  try {
    setStorageItemNormalized(ACTIVE_KEY, JSON.stringify(active));
    const history = readStateList().filter((item) => !(item.containerId === containerId && item.status === 'active'));
    history.push(active);
    writeStateList(history);
  } catch {
    // no-op
  }

  return active;
}

export function completeContainerStep(containerId: string, stepIndex: number, entryId: string): ContainerState {
  const container = getContainerById(containerId);
  if (!container) throw new Error('Container not found');

  const current = getActiveContainer();
  if (!current || current.containerId !== containerId) {
    throw new Error('No active container found');
  }

  const completedSteps = Array.from(new Set([...current.completedSteps, stepIndex])).sort((a, b) => a - b);
  const next: ContainerState = {
    ...current,
    completedSteps,
    entryIds: Array.from(new Set([...current.entryIds, entryId])),
    currentStep: Math.min(container.steps.length - 1, stepIndex + 1),
    status: completedSteps.length >= container.steps.length ? 'completed' : 'active',
    completedAt: completedSteps.length >= container.steps.length ? new Date().toISOString() : current.completedAt,
  };

  try {
    if (next.status === 'completed') {
      setStorageItemNormalized(ACTIVE_KEY, '');
    } else {
      setStorageItemNormalized(ACTIVE_KEY, JSON.stringify(next));
    }

    const history = readStateList()
      .filter((item) => !(item.containerId === containerId && item.status === 'active'))
      .concat(next);
    writeStateList(history);
  } catch {
    // no-op
  }

  return next;
}

export function abandonContainer(containerId: string): void {
  const current = getActiveContainer();
  if (!current || current.containerId !== containerId) return;

  const abandoned: ContainerState = {
    ...current,
    status: 'abandoned',
  };

  try {
    setStorageItemNormalized(ACTIVE_KEY, '');
    const history = readStateList()
      .filter((item) => !(item.containerId === containerId && item.status === 'active'))
      .concat(abandoned);
    writeStateList(history);
  } catch {
    // no-op
  }
}
