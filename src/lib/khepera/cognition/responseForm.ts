import type {
  InterventionFamily,
  PatternIntelligenceResult,
  PsychologicalStateAssessment,
  ResponseForm,
} from './types';

export function selectResponseForm(
  assessment: PsychologicalStateAssessment,
  patterns: PatternIntelligenceResult,
  intervention: InterventionFamily,
): ResponseForm {
  if (assessment.riskLevel !== 'low') return 'groundingResponse';
  if (
    intervention === 'witnessing'
    && patterns.progressionState === 'firstEncounter'
    && (assessment.dominantNeed.witnessing.score >= 0.5 || assessment.dominantNeed.griefSupport.score >= 0.5)
  ) {
    return 'extendedWitnessing';
  }
  if (patterns.progressionState === 'chronicLoop' && intervention === 'gentleChallenge') {
    return 'compassionateConfrontation';
  }
  if (patterns.progressionState === 'recurringPattern') return 'patternSummary';
  if (intervention === 'integration' || intervention === 'growthReinforcement') return 'insightSynthesis';
  if (intervention === 'agencyActivation') return 'futureOrientedReflection';
  if (intervention === 'exploration') return 'exploratoryDialogue';
  if (intervention === 'meaningMaking' || intervention === 'identityDevelopment') return 'narrativeInterpretation';
  return 'conciseReflection';
}
