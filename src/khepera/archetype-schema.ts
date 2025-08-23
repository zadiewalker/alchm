// KHEPERA Archetype Definition Schema
// Pan-cultural | Modular | Tone-Archetype Engine

export interface ArchetypeVisualOverlay {
  color_palette: string[];
  primary_symbol: string;
  background_pattern: string;
  animation_style: string;
  cultural_motifs: string[];
}

export interface ArchetypeAudioCue {
  frequency_hz: number;
  tone_pattern: string;
  duration_ms: number;
  cultural_instrument?: string;
  harmonic_sequence: number[];
}

export interface ArchetypeSamplePrompt {
  context: string;
  prompt_text: string;
  expected_tone: string;
  cultural_adaptation: string[];
}

export interface ArchetypeClosingScript {
  text: string;
  cultural_variants: Record<string, string>;
  ceremonial_weight: 'light' | 'medium' | 'profound';
  archetypal_resonance: string[];
}

export interface ArchetypeDefinition {
  id: string;
  tone_descriptor: string; // max 5 words
  use_cases: string[];
  visual_overlay: ArchetypeVisualOverlay;
  audio_cue: ArchetypeAudioCue;
  sample_prompts: ArchetypeSamplePrompt[];
  closing_script_snippets: ArchetypeClosingScript[];
  cultural_sensitivity_notes: string[];
  cross_archetype_harmonics: string[];
  activation_triggers: string[];
}

export interface KheperaArchetypeEngine {
  version: string;
  cultural_framework: string;
  archetypes: Record<string, ArchetypeDefinition>;
  universal_closing_ceremonies: ArchetypeClosingScript[];
  cross_cultural_adaptations: Record<string, Record<string, any>>;
}