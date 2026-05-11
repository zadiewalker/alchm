import type { EmotionalTone, ThemeTag } from './journal';

export interface KheperaUserContext {
  sessionCount: number;
  recurringThemes?: ThemeTag[];
  recentThemes?: ThemeTag[];
  dominantTone?: EmotionalTone;
  previousTone?: EmotionalTone;
  recentStances?: ResponseStance[];
  recentStyles?: KheperaStyleProfile[];
  lastReturnType?: 'immediate' | 'delayed';
  containerContext?: import('./container').ContainerContext;
  arrivalReason?: string;
}

export interface KheperaResponse {
  witness: string;
  perspective: string;
  seed: string;
}

export type EntryAnchorKind =
  | 'image'
  | 'tension'
  | 'repetition'
  | 'contrast'
  | 'emotion_word'
  | 'relationship_signal'
  | 'time_signal'
  | 'body_signal'
  | 'self_language';

export type EntryAnchor = {
  phrase: string;
  kind: EntryAnchorKind;
};

export interface KheperaMemory {
  userId: string;
  sessionCount: number;
  recurringThemes: ThemeTag[];
  recentThemes: ThemeTag[];
  dominantTone: EmotionalTone;
  previousTone?: EmotionalTone;
  recentStances: ResponseStance[];
  recentStyles: KheperaStyleProfile[];
  lastReturnType?: 'immediate' | 'delayed';
  lastSessionDate: Date | null;
}

export interface TextStructureFeatures {
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  fragmentRatio: number;
  punctuationDensity: number;
  lineBreakCount: number;
  hasListStructure: boolean;
  hasImageryLanguage: boolean;
}

export interface RenderingConstraints {
  style: 'quiet' | 'structured' | 'fragmented';
  maxWitnessSentences: 1 | 2;
  maxPerspectiveSentences: 1 | 2;
  preferEntryPhrasing: boolean;
  allowMetaphorMirroring: boolean;
  phrasingProximity: 'close' | 'standard';
  seedFocus: 'present' | 'relational' | 'temporal';
}

export type ReflectionIntensity = 'low' | 'medium' | 'high';
export type ReflectionCoherence = 'fragmented' | 'mixed' | 'coherent';
export type ReflectionDistanceFromSelf = 'distanced' | 'mixed' | 'present';
export type ReflectionTemporalOrientation = 'past' | 'present' | 'future' | 'mixed';
export type ReflectionCognitiveStyle = 'concrete' | 'abstract' | 'ruminative' | 'meaning-making' | 'mixed';
export type ReflectionRelationalPosture = 'self-attacking' | 'self-protective' | 'self-observing' | 'tender' | 'mixed';
export type ReflectionMovementSignal = 'stuck' | 'searching' | 'shifting' | 'settled' | 'mixed';
export type ReflectionPrimaryNeed =
  | 'witnessing'
  | 'grounding-through-clarity'
  | 'gentle-reframing'
  | 'permission'
  | 'naming-ambivalence';

export type EmotionalIntensity = 'low' | 'moderate' | 'high';
export type NarrativeMode =
  | 'reflective'
  | 'fragmented'
  | 'looping'
  | 'exploratory'
  | 'avoidant';
export type PsychologicalNeedState =
  | 'witnessing'
  | 'coherence'
  | 'distancing'
  | 'integration'
  | 'ambiguity';
export type EntryTemporalOrientation =
  | 'past_processing'
  | 'present_overwhelm'
  | 'future_uncertainty';
export type SignalStability = 'stable' | 'escalating' | 'disorganized';
export type ResponseStance =
  | 'witnessing'
  | 'containing'
  | 'clarifying'
  | 'expanding'
  | 'integrating'
  | 'holding_ambiguity';

export type KheperaStyleDistance = 'close' | 'mid' | 'wide';
export type KheperaStylePace = 'slow' | 'steady' | 'fluid' | 'very_slow';
export type KheperaStyleDensity = 'sparse' | 'moderate' | 'rich' | 'minimal';
export type KheperaLanguageTexture = 'concrete' | 'metaphor-light' | 'abstract-light' | 'structured';
export type KheperaStyleProfile =
  | 'grounded_witness'
  | 'gentle_organizer'
  | 'perspective_opener'
  | 'soft_container'
  | 'open_field';
export type KheperaQualityFlag =
  | 'directive_language'
  | 'diagnostic_language'
  | 'coaching_language'
  | 'generic_response'
  | 'template_repetition'
  | 'forbidden_phrase'
  | 'seed_not_question'
  | 'seed_multiple_questions'
  | 'seed_action_oriented'
  | 'faux_therapy_voice'
  | 'productivity_framing'
  | 'insufficient_entry_grounding'
  | 'repeated_opening_pattern'
  | 'overused_khepera_phrase'
  | 'insufficient_language_differentiation'
  | 'temporal_surveillance_language';
export interface KheperaQualityResult {
  ok: boolean;
  flags: KheperaQualityFlag[];
}
export type KheperaContinuityMode =
  | 'none'
  | 'subtle_echo'
  | 'tone_shift'
  | 'stance_shift'
  | 'quiet_return';

export type KheperaMemorySignal = {
  recentThemes: ThemeTag[];
  dominantTone?: EmotionalTone;
  previousTone?: EmotionalTone;
  recentStances: ResponseStance[];
  repeatedThemeCount: number;
  toneShift: 'softening' | 'intensifying' | 'stable' | 'unclear';
};

export type ReflectionTiming =
  | 'immediate'
  | 'short_delay'
  | 'delayed_return';

export type KheperaPacingState = {
  recentStances: ResponseStance[];
  recentTones: EmotionalTone[];
  lastReturnType: 'immediate' | 'delayed';
};

export interface ReflectionAnalysis {
  emotionalTone: import('@/types/journal').EmotionalTone;
  intensity: ReflectionIntensity;
  emotionalIntensity: EmotionalIntensity;
  coherence: ReflectionCoherence;
  distanceFromSelf: ReflectionDistanceFromSelf;
  temporalOrientation: ReflectionTemporalOrientation;
  temporalFrame: EntryTemporalOrientation;
  cognitiveStyle: ReflectionCognitiveStyle;
  relationalPosture: ReflectionRelationalPosture;
  movementSignal: ReflectionMovementSignal;
  primaryNeed: ReflectionPrimaryNeed;
  narrativeMode: NarrativeMode;
  psychologicalNeedState: PsychologicalNeedState;
  signalStability: SignalStability;
  textStructure: TextStructureFeatures;
  rendering: RenderingConstraints;
  notableSignals: string[];
}

export type ReflectionMode =
  | 'pure_witness'
  | 'gentle_naming'
  | 'spacious_clarification'
  | 'ambivalence_holding'
  | 'self_protection_reframe'
  | 'tenderness_invitation'
  | 'meaning_emergence'
  | 'movement_marking';
