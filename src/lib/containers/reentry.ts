import type { ContainerContext, ContainerReentryExperience } from './types';

export function buildContainerReentryExperience(
  context: ContainerContext,
  inquiry?: string,
): ContainerReentryExperience {
  return {
    state: 'returning',
    headline: 'This space is still here.',
    invitation: `The ${context.name} container can be entered again without needing to explain the time away.`,
    inquiry: inquiry ?? 'A question that has been waiting may be ready to be touched again.',
    prohibitedLanguage: [
      'continue where you left off',
      'missed days',
      'catch up',
      'progress lost',
      'restart',
      'back on track',
    ],
  };
}
