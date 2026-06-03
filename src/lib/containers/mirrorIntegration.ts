import type { ContainerContext, MirrorContainerIntegration } from './types';

export function buildMirrorContainerIntegration(context: ContainerContext): MirrorContainerIntegration {
  return {
    containerId: context.id,
    movementFocus: context.mirrorMovementFocus,
    synthesisFocus: [
      'themesInMotion',
      'thingsBecomingClearer',
      'thingsStillUnfolding',
      'momentsOfTransformation',
    ],
    recognitionQuestions: [
      'What changed while dwelling in this container?',
      'What softened?',
      'What became clearer?',
      'What remains alive?',
      'What surprised you?',
    ],
    constraints: [
      'Do not summarize container participation as progress.',
      'Do not count visits, days, or completion.',
      'Synthesize derived movements and questions, not raw entries.',
    ],
  };
}
