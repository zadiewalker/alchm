import type {
  ChallengeLevel,
  EmotionalPosture,
  InterventionDecision,
  InterventionFamily,
  LengthBand,
  ReflectionLevel,
  ResponseForm,
  ResponseVarietyMetadata,
} from './types';

function postureFor(intervention: InterventionFamily): EmotionalPosture {
  switch (intervention) {
    case 'regulation':
      return 'steadyContainer';
    case 'gentleChallenge':
      return 'firmGentle';
    case 'integration':
    case 'growthReinforcement':
      return 'warmIntegrator';
    case 'exploration':
    case 'meaningMaking':
    case 'identityDevelopment':
      return 'curiousMirror';
    default:
      return 'closeWitness';
  }
}

function lengthFor(form: ResponseForm): LengthBand {
  switch (form) {
    case 'groundingResponse':
    case 'conciseReflection':
      return 'brief';
    case 'extendedWitnessing':
    case 'narrativeInterpretation':
    case 'insightSynthesis':
      return 'spacious';
    default:
      return 'medium';
  }
}

function challengeFor(intervention: InterventionFamily): ChallengeLevel {
  return intervention === 'gentleChallenge' ? 'moderate' : intervention === 'agencyActivation' ? 'low' : 'none';
}

function reflectionFor(form: ResponseForm): ReflectionLevel {
  if (form === 'insightSynthesis' || form === 'narrativeInterpretation') return 'integrative';
  if (form === 'patternSummary' || form === 'compassionateConfrontation') return 'patternAware';
  return 'close';
}

export function buildVarietyMetadata(
  intervention: InterventionFamily,
  responseForm: ResponseForm,
  usesMemory: boolean,
): ResponseVarietyMetadata {
  return {
    interventionFamily: intervention,
    responseForm,
    emotionalPosture: postureFor(intervention),
    questionCount: 1,
    lengthBand: lengthFor(responseForm),
    usesDirectAdvice: false,
    usesMemory,
    challengeLevel: challengeFor(intervention),
    reflectionLevel: reflectionFor(responseForm),
  };
}

export function avoidRecentRepetition(
  selected: InterventionFamily,
  candidates: InterventionFamily[],
  recentResponses: ResponseVarietyMetadata[] = [],
): InterventionFamily {
  const recentFamilies = recentResponses.slice(-2).map((response) => response.interventionFamily);
  if (recentFamilies.length < 2) return selected;
  if (!recentFamilies.every((family) => family === selected)) return selected;
  return candidates.find((candidate) => candidate !== selected && !recentFamilies.includes(candidate)) ?? selected;
}

export function buildVarietyConstraints(decision: InterventionDecision, recentResponses: ResponseVarietyMetadata[] = []): string[] {
  const recent = recentResponses.slice(-3);
  const constraints = [
    `Use responseForm=${decision.responseFormRecommendation}.`,
    `Use interventionFamily=${decision.selectedIntervention}.`,
    'Variation must come from assessment, readiness, pattern stage, and recent response metadata; do not use randomness.',
    'Preserve the three-part Khepera contract even when form and pacing vary.',
  ];

  if (recent.length > 0) {
    constraints.push(
      `Avoid repeating recent intervention families: ${recent.map((item) => item.interventionFamily).join(', ')}.`,
      `Avoid repeating recent response forms: ${recent.map((item) => item.responseForm).join(', ')}.`,
    );
  }

  return constraints;
}
