'use client';

import { TRAUMA_INFORMED_ANALYSIS_PROMPT } from '@/lib/aiPromptsLegacy';
import type { JournalEntry } from '@/lib/types';
import { buildKheperaContext, formatContextForPrompt } from '@/lib/context';
import { getTimeContext } from '@/lib/timeAware';
import { buildSomaticContext } from '@/lib/somatic';

// The existing app's base prompt lives in src/lib/aiPrompts.ts.
// We copy it into this project as aiPromptsLegacy.ts verbatim and build on it.
// Safety rails and five-lens framing are non-negotiable.

export type KheperaFramework = 'cbt' | 'ifs' | 'somatic' | 'narrative' | 'existential';

export interface KheperaContext {
  entryCount: number;
  currentStreak: number;
  preferredFramework: KheperaFramework | null;
  continuityContext?: string;
  pathwayGuidance?: string;
  reflectionFocus?: string;
  isCheckin?: boolean;
  depth?: {
    emotionLabel: string | null;
    emotionFamily: string | null;
    emotionSpecificId: string | null;
    sensation: import('@/lib/somatic').BodySensation | null;
  };
}

export const STAGES = [
  {
    id: 'hatchling',
    name: 'Hatchling',
    threshold: 0,
    promptModifier: 'You are gentle, simple, and grounding. Focus on safety and presence over insight.',
  },
  {
    id: 'walker',
    name: 'Walker',
    threshold: 5,
    promptModifier: 'You are steady and curious. Offer one small pattern notice, never too much at once.',
  },
  {
    id: 'weaver',
    name: 'Weaver',
    threshold: 20,
    promptModifier: 'You can connect themes over time. Keep it concise and kind.',
  },
] as const;

export type KheperaStage = (typeof STAGES)[number];

export function getCurrentStage(entryCount: number): KheperaStage {
  let current: KheperaStage = STAGES[0];
  for (const stage of STAGES) {
    if (entryCount >= stage.threshold) current = stage;
  }
  return current;
}

export function buildSystemPrompt(ctx: KheperaContext): string {
  const stage = getCurrentStage(ctx.entryCount);
  const time = getTimeContext();

  const safety = `
SAFETY & SCOPE:
- You are Khepera, an AI companion. You are not a therapist, counselor, or medical professional.
- Never diagnose, prescribe, or provide clinical advice.
- Do not instruct self-harm, suicide methods, or illegal actions.
- If the user expresses thoughts of self-harm or suicide, encourage them to contact 988 (US) immediately or local emergency services.
`;

  const lenses = `
THERAPEUTIC LENSES (blend gently; do not name them unless asked):
- CBT: notice thoughts, evidence, and alternatives without invalidating feelings
- IFS: treat parts as protective, with compassion and consent
- Somatic: attend to sensations, nervous system cues, grounding
- Narrative: reflect meaning-making, identity, and the story being carried
- Existential: values, freedom, responsibility, mortality, meaning
`;

  const format = `
FORMAT:
- Use warm, concise language.
- If this is a check-in: respond with ONE sentence only.
- Otherwise: return 4 short sections (Emotional Recognition, Strength Identification, Gentle Insight, Nurturing Suggestion).
`;

  const contextBits: string[] = [];
  if (ctx.continuityContext) contextBits.push(`Continuity context: ${ctx.continuityContext}`);
  if (ctx.pathwayGuidance) contextBits.push(`Pathway guidance: ${ctx.pathwayGuidance}`);
  if (ctx.reflectionFocus) contextBits.push(`Reflection focus: ${ctx.reflectionFocus}`);
  if (ctx.preferredFramework) contextBits.push(`Preferred framework: ${ctx.preferredFramework}`);
  contextBits.push(`Entry count: ${ctx.entryCount}`);
  contextBits.push(`Current streak: ${ctx.currentStreak}`);
  contextBits.push(`Stage: ${stage.name}. ${stage.promptModifier}`);

  const memory = buildKheperaContext();
  const memoryString = formatContextForPrompt(memory);

  const depthBits: string[] = [];
  if (ctx.depth?.emotionLabel) {
    depthBits.push(`The user identified their emotion as: ${ctx.depth.emotionLabel}${ctx.depth.emotionFamily ? ` (family: ${ctx.depth.emotionFamily})` : ''}.`);
    if (ctx.depth.emotionSpecificId) {
      depthBits.push('They chose a specific word rather than only a broad category.');
    }
  }
  if (ctx.depth?.sensation) {
    const som = buildSomaticContext(ctx.depth.sensation);
    if (som) depthBits.push(som);
  }

  const reflectionShape = `
REFLECTION SHAPE (Depth Layer):
- Reference the specific emotion they named (use their word, not a synonym).
- If they did a body check-in, acknowledge the physical sensation naturally.
- Don't repeat their words back: add one new angle or reframe.
- End with something that invites curiosity, not closure.
- Keep it under 150 words.
`;

  return [
    TRAUMA_INFORMED_ANALYSIS_PROMPT,
    safety,
    lenses,
    format,
    depthBits.length ? `DEPTH CONTEXT:\n${depthBits.join('\n')}` : '',
    reflectionShape,
    `CONTEXT:\n${contextBits.join('\n')}`,
    `--- CONTEXT FROM USER'S JOURNAL ---\n${memoryString}\n--- END CONTEXT ---`,
    time.kheperaModifier ? `TIME-AWARE NOTE:\n${time.kheperaModifier}` : '',
  ].join('\n\n');
}

export function getStoredReflection(entry: JournalEntry): string | null {
  if (typeof entry.kheperaReflection === 'string' && entry.kheperaReflection.trim()) {
    return entry.kheperaReflection.trim();
  }
  if (Array.isArray(entry.insights) && entry.insights.length) {
    return entry.insights.filter((x) => typeof x === 'string' && x.trim()).join('\n\n') || null;
  }
  return null;
}
