import { assessPsychologicalState } from './stateAssessment';
import { modelLongitudinalPatterns } from './patternIntelligence';
import { planMemoryRetrieval } from './memoryRetrieval';
import { decideIntervention } from './interventionDecision';
import { getSafetyConstraints } from './safety';
import { buildVarietyConstraints } from './varietyEngine';
import type { KheperaCognitionInput, KheperaPromptPlan } from './types';

function summarizePlan(plan: Pick<KheperaPromptPlan, 'patternIntelligence' | 'memoryRetrieval' | 'interventionDecision'>): string {
  return [
    `progression=${plan.patternIntelligence.progressionState}`,
    `intervention=${plan.interventionDecision.selectedIntervention}`,
    `responseForm=${plan.interventionDecision.responseFormRecommendation}`,
    `memory=${plan.memoryRetrieval.shouldRetrieve ? 'subtle-metadata-context' : 'none'}`,
  ].join('; ');
}

export function composeKheperaPromptPlan(input: KheperaCognitionInput): KheperaPromptPlan {
  const assessment = assessPsychologicalState(input.entryText, input.crisisDetected ?? false);
  const patternIntelligence = modelLongitudinalPatterns(input, assessment);
  const memoryRetrieval = planMemoryRetrieval(input, assessment);
  const interventionDecision = decideIntervention(
    assessment,
    patternIntelligence,
    input.recentResponses,
    memoryRetrieval.shouldRetrieve,
  );
  const partialPlan = { patternIntelligence, memoryRetrieval, interventionDecision };

  return {
    currentEntryPolicy: 'raw-entry-for-provider-only',
    assessment,
    patternIntelligence,
    memoryRetrieval,
    interventionDecision,
    safetyConstraints: getSafetyConstraints(assessment),
    varietyConstraints: buildVarietyConstraints(interventionDecision, input.recentResponses),
    promptSummary: summarizePlan(partialPlan),
  };
}
