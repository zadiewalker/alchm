import type { MirrorSynthesis } from './types';

const FORBIDDEN_CERTAINTY = [
  /\byou are\b/i,
  /\byou have\b/i,
  /\bthis proves\b/i,
  /\bthe reason you\b/i,
  /\bdiagnos/i,
  /\bdisorder\b/i,
  /\bpatholog/i,
  /\bscore\b/i,
  /\bpercentage\b/i,
  /\bstreak\b/i,
  /\boptimi[sz]/i,
];

const TENTATIVE_LANGUAGE = [
  /\bseems\b/i,
  /\bmay\b/i,
  /\bappears\b/i,
  /\bone possible\b/i,
  /\bworth noticing\b/i,
];

export type MirrorSafetyResult = {
  ok: boolean;
  issues: string[];
};

export function validateMirrorLanguage(text: string): MirrorSafetyResult {
  const issues = FORBIDDEN_CERTAINTY
    .filter((pattern) => pattern.test(text))
    .map((pattern) => `forbidden certainty or metric language: ${pattern.source}`);
  const hasTentativeLanguage = TENTATIVE_LANGUAGE.some((pattern) => pattern.test(text));

  if (!hasTentativeLanguage) {
    issues.push('mirror language must preserve uncertainty with tentative framing');
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}

export function validateMirrorSynthesis(synthesis: MirrorSynthesis): MirrorSafetyResult {
  return validateMirrorLanguage(`${synthesis.title}\n${synthesis.body}`);
}

export function mirrorSafetyNotes(): string[] {
  return [
    'Observations are invitations, not facts about the user.',
    'Mirror must not diagnose, score, rank, or optimize the user.',
    'Raw journal text is not used as Mirror display memory.',
    'Elevated risk states should favor present-moment support over longitudinal interpretation.',
  ];
}
