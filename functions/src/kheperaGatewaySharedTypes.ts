export interface KheperaResponse {
  witness: string;
  perspective: string;
  seed: string;
}

export type EntryAnchor = {
  phrase: string;
  kind:
    | "image"
    | "tension"
    | "repetition"
    | "contrast"
    | "emotion_word"
    | "relationship_signal"
    | "time_signal"
    | "body_signal"
    | "self_language";
};

export type KheperaQualityFlag =
  | "directive_language"
  | "diagnostic_language"
  | "coaching_language"
  | "generic_response"
  | "template_repetition"
  | "forbidden_phrase"
  | "seed_not_question"
  | "seed_multiple_questions"
  | "seed_action_oriented"
  | "faux_therapy_voice"
  | "productivity_framing"
  | "insufficient_entry_grounding"
  | "repeated_opening_pattern"
  | "overused_khepera_phrase"
  | "insufficient_language_differentiation"
  | "temporal_surveillance_language";

export interface KheperaQualityResult {
  ok: boolean;
  flags: KheperaQualityFlag[];
}
