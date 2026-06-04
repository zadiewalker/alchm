import type { ContainerContext } from '@/lib/containers/types';
import type { ResponseVarietyMetadata } from '@/lib/khepera/cognition/types';
import type { MirrorMovement, MirrorPattern, MirrorTheme } from '@/lib/mirror/types';
import type { EmotionalTone, ThemeTag } from '@/types/journal';

export type CognitiveLayerOwner =
  | 'journal'
  | 'container'
  | 'khepera'
  | 'mirror'
  | 'memory';

export type UnifiedMemoryLayer =
  | 'episodic'
  | 'thematic'
  | 'developmental'
  | 'containerSpecific'
  | 'relationshipSpecific';

export type CognitiveBoundary = {
  owner: CognitiveLayerOwner;
  responsibility: string;
  mayStore: string[];
  mustNotStore: string[];
};

export type UnifiedCognitiveInput = {
  entryText: string;
  currentTone?: EmotionalTone;
  currentThemes?: ThemeTag[];
  activeContainer?: ContainerContext;
  mirrorPatterns?: MirrorPattern[];
  mirrorMovements?: MirrorMovement[];
  recentResponses?: ResponseVarietyMetadata[];
  crisisDetected?: boolean;
};

export type UnifiedCognitiveContext = {
  boundaries: CognitiveBoundary[];
  kheperaInput: {
    entryText: string;
    crisisDetected: boolean;
    currentTone?: EmotionalTone;
    currentThemes: ThemeTag[];
    longitudinalPatterns: import('@/lib/khepera/cognition/types').LongitudinalPattern[];
    memoryCandidates: import('@/lib/khepera/cognition/types').MemoryCandidate[];
    recentResponses: ResponseVarietyMetadata[];
  };
  mirrorFocus: {
    themes: MirrorTheme[];
    movementKinds: MirrorMovement['kind'][];
    patternIds: string[];
  };
  containerInfluence?: {
    containerId: ContainerContext['id'];
    foregroundThemes: ThemeTag[];
    movementFocus: MirrorMovement['kind'][];
    inquiryDomains: ContainerContext['inquiryDomains'];
  };
  storagePolicy: {
    rawEntryText: 'provider-only';
    derivedMemoryOnly: true;
    notes: string[];
  };
};
