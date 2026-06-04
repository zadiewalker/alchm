import type { LongitudinalPattern, MemoryCandidate, ProgressionState } from '@/lib/khepera/cognition/types';
import type { MirrorMovement, MirrorPattern, MirrorTheme } from '@/lib/mirror/types';
import type { ThemeTag } from '@/types/journal';
import type { CognitiveBoundary, UnifiedCognitiveContext, UnifiedCognitiveInput } from './types';

const MIRROR_THEME_TO_THEME_TAG: Record<MirrorTheme, ThemeTag> = {
  belonging: 'relationship_tension',
  purpose: 'work_purpose',
  grief: 'grief_loss',
  burnout: 'rest_recovery',
  trust: 'relationship_tension',
  selfWorth: 'self_worth',
  uncertainty: 'fear_uncertainty',
  connection: 'relationship_tension',
  identity: 'identity',
  creativity: 'creativity_expression',
};

export const COGNITIVE_BOUNDARIES: CognitiveBoundary[] = [
  {
    owner: 'journal',
    responsibility: 'capture the user experience and preserve the original entry under user authority',
    mayStore: ['raw journal text in the journal record', 'submission metadata', 'user-owned timestamps'],
    mustNotStore: ['interpretive diagnoses', 'derived longitudinal conclusions'],
  },
  {
    owner: 'container',
    responsibility: 'shape attention, inquiry, memory bias, and presence without becoming a program',
    mayStore: ['active lens id', 'inquiry domains', 'derived container memory', 'relationship state'],
    mustNotStore: ['raw journal text', 'completion pressure', 'behind/ahead state'],
  },
  {
    owner: 'khepera',
    responsibility: 'interpret the current entry and offer relational reflection within the three-part contract',
    mayStore: ['theme tags', 'emotional tone', 'response metadata'],
    mustNotStore: ['raw journal text as memory', 'diagnoses', 'advice plans'],
  },
  {
    owner: 'mirror',
    responsibility: 'reveal movement across time from derived observations',
    mayStore: ['derived observations', 'patterns', 'movements', 'tentative syntheses'],
    mustNotStore: ['raw journal text', 'quoted excerpts', 'certainty claims'],
  },
  {
    owner: 'memory',
    responsibility: 'provide continuity through minimal derived metadata and explicit ownership',
    mayStore: ['episodic ids', 'themes', 'tone labels', 'movement markers', 'container associations'],
    mustNotStore: ['reconstructive narrative summaries', 'embeddings of raw entries', 'provider secrets'],
  },
];

function uniqueThemeTags(values: ThemeTag[]): ThemeTag[] {
  return Array.from(new Set(values));
}

export function mirrorThemeToThemeTag(theme: MirrorTheme): ThemeTag {
  return MIRROR_THEME_TO_THEME_TAG[theme];
}

function mirrorPatternToProgression(pattern: MirrorPattern, movement?: MirrorMovement): ProgressionState {
  if (movement?.kind === 'transformation') return 'transformation';
  if (movement?.kind === 'integration' || movement?.kind === 'resolution') return 'integration';
  if (pattern.observationIds.length >= 6) return 'chronicLoop';
  if (pattern.observationIds.length >= 3) return 'recurringPattern';
  return 'emergingPattern';
}

function longitudinalPatternFromMirror(pattern: MirrorPattern, movement?: MirrorMovement): LongitudinalPattern | null {
  if (pattern.kind !== 'theme') return null;
  const theme = mirrorThemeToThemeTag(pattern.key as MirrorTheme);

  return {
    id: `mirror:${pattern.id}`,
    themes: [theme],
    recurrenceCount: pattern.observationIds.length,
    lastSeenAt: pattern.lastSeenAt,
    breakthroughSignificance: movement?.kind === 'transformation' || movement?.kind === 'integration'
      ? pattern.confidenceScore
      : undefined,
    unresolvedLoopSignificance: movement?.kind === 'recurrence' || movement?.kind === 'intensification'
      ? pattern.confidenceScore
      : undefined,
    progressionState: mirrorPatternToProgression(pattern, movement),
  };
}

function memoryCandidateFromMirror(pattern: MirrorPattern, movement?: MirrorMovement): MemoryCandidate | null {
  const longitudinalPattern = longitudinalPatternFromMirror(pattern, movement);
  if (!longitudinalPattern) return null;

  return {
    id: longitudinalPattern.id,
    themes: longitudinalPattern.themes,
    progressionState: longitudinalPattern.progressionState,
    recurrenceCount: longitudinalPattern.recurrenceCount,
    lastSeenAt: longitudinalPattern.lastSeenAt,
    breakthroughSignificance: longitudinalPattern.breakthroughSignificance,
    unresolvedLoopSignificance: longitudinalPattern.unresolvedLoopSignificance,
  };
}

function movementForPattern(pattern: MirrorPattern, movements: MirrorMovement[]): MirrorMovement | undefined {
  return movements.find((movement) => movement.patternId === pattern.id);
}

export function buildUnifiedCognitiveContext(input: UnifiedCognitiveInput): UnifiedCognitiveContext {
  const containerThemes = input.activeContainer?.activeThemes.map(mirrorThemeToThemeTag) ?? [];
  const mirrorThemes = (input.mirrorPatterns ?? [])
    .filter((pattern) => pattern.kind === 'theme')
    .map((pattern) => mirrorThemeToThemeTag(pattern.key as MirrorTheme));
  const currentThemes = uniqueThemeTags([
    ...(input.currentThemes ?? []),
    ...containerThemes,
    ...mirrorThemes,
  ]);
  const longitudinalPatterns = (input.mirrorPatterns ?? [])
    .map((pattern) => longitudinalPatternFromMirror(pattern, movementForPattern(pattern, input.mirrorMovements ?? [])))
    .filter((pattern): pattern is LongitudinalPattern => pattern !== null);
  const memoryCandidates = (input.mirrorPatterns ?? [])
    .map((pattern) => memoryCandidateFromMirror(pattern, movementForPattern(pattern, input.mirrorMovements ?? [])))
    .filter((candidate): candidate is MemoryCandidate => candidate !== null);

  return {
    boundaries: COGNITIVE_BOUNDARIES,
    kheperaInput: {
      entryText: input.entryText,
      crisisDetected: input.crisisDetected ?? false,
      currentTone: input.currentTone,
      currentThemes,
      longitudinalPatterns,
      memoryCandidates,
      recentResponses: input.recentResponses ?? [],
    },
    mirrorFocus: {
      themes: input.activeContainer?.activeThemes ?? [],
      movementKinds: input.activeContainer?.mirrorMovementFocus ?? [],
      patternIds: (input.mirrorPatterns ?? []).map((pattern) => pattern.id),
    },
    containerInfluence: input.activeContainer
      ? {
          containerId: input.activeContainer.id,
          foregroundThemes: containerThemes,
          movementFocus: input.activeContainer.mirrorMovementFocus,
          inquiryDomains: input.activeContainer.inquiryDomains,
        }
      : undefined,
    storagePolicy: {
      rawEntryText: 'provider-only',
      derivedMemoryOnly: true,
      notes: [
        'Journal owns raw text.',
        'Khepera receives raw text only for immediate provider generation.',
        'Mirror and Containers receive derived signals only.',
      ],
    },
  };
}
