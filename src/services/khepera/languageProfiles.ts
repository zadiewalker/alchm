import type { ResponseStance } from '@/types/khepera';

export type MetaphorLevel = 'none' | 'minimal' | 'light' | 'spacious';

export interface KheperaLanguageProfile {
  stance: ResponseStance;
  preferredSentenceLength: string;
  allowedMetaphorLevel: MetaphorLevel;
  openingPatternGuidance: string;
  forbiddenOverusedPhrases: string[];
  seedQuestionStyle: string;
  anchorTransformationInstructions: string[];
}

const SHARED_OVERUSED_PHRASES = [
  'Something in this',
  'There is a shape',
  'This carries',
  'This holds',
  'What else becomes visible',
  'What would it mean',
  'Where might this lead',
];

export const KHEPERA_LANGUAGE_PROFILES: Record<ResponseStance, KheperaLanguageProfile> = {
  witnessing: {
    stance: 'witnessing',
    preferredSentenceLength: 'short, concrete sentences; usually 8-14 words',
    allowedMetaphorLevel: 'minimal',
    openingPatternGuidance: 'Open with a concrete anchor, emotion, or event from the entry. Avoid hovering starts.',
    forbiddenOverusedPhrases: [
      ...SHARED_OVERUSED_PHRASES,
      'Something in this feels',
      'There is something here',
    ],
    seedQuestionStyle: 'one close, plain question about what is most alive in the named anchor',
    anchorTransformationInstructions: [
      'Tie the feeling directly to the named event, object, body signal, or phrase.',
      'Prefer "The happiness is tied to the app working" over "Something feels lighter."',
      'Do not turn the entry into a neat meaning or lesson.',
    ],
  },
  containing: {
    stance: 'containing',
    preferredSentenceLength: 'very short, low-density sentences; usually 6-12 words',
    allowedMetaphorLevel: 'none',
    openingPatternGuidance: 'Begin with the simplest visible fact from the entry. Fewer clauses, less reach.',
    forbiddenOverusedPhrases: [
      ...SHARED_OVERUSED_PHRASES,
      'This feels heavy',
      'Something is asking',
    ],
    seedQuestionStyle: 'one steady question about the nearest explicit feeling, body signal, or phrase',
    anchorTransformationInstructions: [
      'Use only what the entry gives; do not widen or explain.',
      'Let body signals, named feelings, and immediate facts carry the response.',
      'Keep Perspective small enough that it does not add burden.',
    ],
  },
  clarifying: {
    stance: 'clarifying',
    preferredSentenceLength: 'measured sentences; usually 10-18 words',
    allowedMetaphorLevel: 'light',
    openingPatternGuidance: 'Open by naming a loop, contrast, repeated turn, or explicit tension.',
    forbiddenOverusedPhrases: [
      ...SHARED_OVERUSED_PHRASES,
      'There is a pattern here',
      'This reveals',
    ],
    seedQuestionStyle: 'one legibility question about the named loop, contrast, or tension without asking for action',
    anchorTransformationInstructions: [
      'Use anchors to name what repeats, contrasts, or keeps circling.',
      'Organize one visible relation without solving it.',
      'Prefer "The loop around the conversation gives this entry its shape" over generic relief language.',
    ],
  },
  expanding: {
    stance: 'expanding',
    preferredSentenceLength: 'spacious but controlled sentences; usually 14-24 words',
    allowedMetaphorLevel: 'spacious',
    openingPatternGuidance: 'Open from a concrete anchor, then allow one wider frame nearby.',
    forbiddenOverusedPhrases: [
      ...SHARED_OVERUSED_PHRASES,
      'A wider field',
      'This opens into',
    ],
    seedQuestionStyle: 'one spacious question that widens contact without steering toward insight or action',
    anchorTransformationInstructions: [
      'Let one current-entry anchor create the wider frame.',
      'Keep the widening visibly tied to the entry, not to Khepera’s voice.',
      'Do not force closure or make the response sound revelatory.',
    ],
  },
  integrating: {
    stance: 'integrating',
    preferredSentenceLength: 'connected sentences; usually 12-22 words',
    allowedMetaphorLevel: 'light',
    openingPatternGuidance: 'Open by connecting two explicit anchors or naming their relation.',
    forbiddenOverusedPhrases: [
      ...SHARED_OVERUSED_PHRASES,
      'More than one truth',
      'This brings together',
    ],
    seedQuestionStyle: 'one question about the relationship between explicit parts, not a lesson from them',
    anchorTransformationInstructions: [
      'Name how two anchors sit near each other in the entry.',
      'Connect relief, tension, body signal, event, or phrase without summarizing them into a takeaway.',
      'Prefer "Relief sits close to the fact that something finally functions" over generic integration language.',
    ],
  },
  holding_ambiguity: {
    stance: 'holding_ambiguity',
    preferredSentenceLength: 'open, unhurried sentences; usually 10-20 words',
    allowedMetaphorLevel: 'minimal',
    openingPatternGuidance: 'Open with uncertainty, bothness, or unresolved contrast already present in the entry.',
    forbiddenOverusedPhrases: [
      ...SHARED_OVERUSED_PHRASES,
      'Maybe this means',
      'This wants to resolve',
    ],
    seedQuestionStyle: 'one question that leaves uncertainty open and does not ask for resolution',
    anchorTransformationInstructions: [
      'Let uncertainty stay uncertain.',
      'Use anchors to preserve bothness without choosing a side.',
      'Avoid "maybe this means"; do not translate ambiguity into interpretation.',
    ],
  },
};

export function getLanguageProfile(stance: ResponseStance): KheperaLanguageProfile {
  return KHEPERA_LANGUAGE_PROFILES[stance];
}

export function formatLanguageProfile(profile: KheperaLanguageProfile): string {
  return [
    `LANGUAGE PROFILE: ${profile.stance}`,
    `- Preferred sentence length: ${profile.preferredSentenceLength}`,
    `- Allowed metaphor level: ${profile.allowedMetaphorLevel}`,
    `- Opening pattern guidance: ${profile.openingPatternGuidance}`,
    `- Seed question style: ${profile.seedQuestionStyle}`,
    '- Forbidden overused phrases:',
    ...profile.forbiddenOverusedPhrases.map((phrase) => `  - ${phrase}`),
    '- Anchor transformation instructions:',
    ...profile.anchorTransformationInstructions.map((rule) => `  - ${rule}`),
  ].join('\n');
}
