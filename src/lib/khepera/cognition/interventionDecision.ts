import { selectResponseForm } from './responseForm';
import { applySafetyOverride } from './safety';
import { avoidRecentRepetition, buildVarietyMetadata } from './varietyEngine';
import type {
  InterventionDecision,
  InterventionFamily,
  PatternIntelligenceResult,
  PsychologicalStateAssessment,
  ResponseVarietyMetadata,
} from './types';

function rankedInterventions(
  assessment: PsychologicalStateAssessment,
  patterns: PatternIntelligenceResult,
): InterventionFamily[] {
  if (assessment.riskLevel !== 'low') return ['regulation', 'witnessing', 'compassion'];
  if (assessment.dominantNeed.griefSupport.score >= 0.58) return ['witnessing', 'compassion', 'reflection'];
  if (assessment.dominantNeed.compassion.score >= 0.58) return ['compassion', 'witnessing', 'reflection'];
  if (assessment.dominantNeed.regulation.score >= 0.58) return ['regulation', 'witnessing', 'compassion'];
  if (patterns.progressionState === 'chronicLoop') return ['gentleChallenge', 'compassion', 'reflection'];
  if (patterns.progressionState === 'recurringPattern') return ['reflection', 'exploration', 'compassion'];
  if (patterns.progressionState === 'transformation') return ['growthReinforcement', 'integration', 'meaningMaking'];
  if (patterns.progressionState === 'integration') return ['integration', 'identityDevelopment', 'meaningMaking'];
  if (assessment.dominantNeed.identityExploration.score >= 0.52) return ['identityDevelopment', 'exploration', 'witnessing'];
  if (assessment.dominantNeed.agency.score >= 0.42) return ['agencyActivation', 'exploration', 'reflection'];
  if (assessment.dominantNeed.clarity.score >= 0.52) return ['reflection', 'exploration', 'witnessing'];
  if (assessment.dominantNeed.perspective.score >= 0.5) return ['meaningMaking', 'reflection', 'exploration'];
  return ['witnessing', 'reflection', 'compassion'];
}

function rationaleFor(intervention: InterventionFamily, patterns: PatternIntelligenceResult): string[] {
  const rationale = [`selectedIntervention=${intervention}`, `progressionState=${patterns.progressionState}`];
  if (patterns.progressionState === 'firstEncounter') rationale.push('first encounters privilege witnessing over pattern naming');
  if (patterns.progressionState === 'chronicLoop') rationale.push('chronic loops may need a new angle without blame');
  if (patterns.progressionState === 'transformation') rationale.push('visible growth should be reinforced without pressure');
  return rationale;
}

export function decideIntervention(
  assessment: PsychologicalStateAssessment,
  patterns: PatternIntelligenceResult,
  recentResponses: ResponseVarietyMetadata[] = [],
  usesMemory = false,
): InterventionDecision {
  const candidates = rankedInterventions(assessment, patterns);
  const selectedBeforeSafety = avoidRecentRepetition(candidates[0], candidates, recentResponses);
  const preliminaryForm = selectResponseForm(assessment, patterns, selectedBeforeSafety);
  const safety = applySafetyOverride(assessment, {
    intervention: selectedBeforeSafety,
    responseForm: preliminaryForm,
  });
  const responseForm = selectResponseForm(assessment, patterns, safety.intervention);

  return {
    selectedIntervention: safety.intervention,
    rejectedInterventions: candidates
      .filter((candidate) => candidate !== safety.intervention)
      .map((intervention) => ({
        intervention,
        reason: assessment.riskLevel !== 'low'
          ? 'deferred because safety and stabilization are prioritized'
          : 'less aligned with current need, readiness, pattern stage, or recent-response variety',
      })),
    rationale: rationaleFor(safety.intervention, patterns),
    riskConsiderations: safety.riskConsiderations,
    confidence: assessment.confidence === 'low' ? 'moderate' : assessment.confidence,
    responseFormRecommendation: responseForm,
    varietyMetadata: buildVarietyMetadata(safety.intervention, responseForm, usesMemory),
  };
}
