import type { ContainerReentryExperience } from './types';

const FORBIDDEN_CONTAINER_LANGUAGE = [
  /\bbehind\b/i,
  /\bcatch up\b/i,
  /\bmissed\b/i,
  /\bstreak\b/i,
  /\bchallenge\b/i,
  /\bcomplete this program\b/i,
  /\bprogress\b/i,
  /\bscore\b/i,
  /\bdiagnos/i,
  /\bshould\b/i,
  /\bmust\b/i,
];

export type ContainerSafetyResult = {
  ok: boolean;
  issues: string[];
};

export function validateContainerLanguage(text: string): ContainerSafetyResult {
  const issues = FORBIDDEN_CONTAINER_LANGUAGE
    .filter((pattern) => pattern.test(text))
    .map((pattern) => `forbidden container pressure or certainty language: ${pattern.source}`);

  return {
    ok: issues.length === 0,
    issues,
  };
}

export function validateReentryExperience(experience: ContainerReentryExperience): ContainerSafetyResult {
  return validateContainerLanguage(`${experience.headline}\n${experience.invitation}\n${experience.inquiry ?? ''}`);
}

export function containerSafetyFramework(): string[] {
  return [
    'Containers organize attention, not compliance.',
    'No relationship state implies failure, delay, or being behind.',
    'Container memory stores reflective abstractions, not raw journal text.',
    'Khepera integration uses a lens and presence profile, not roleplay.',
    'Mirror integration synthesizes movement, not participation metrics.',
  ];
}
