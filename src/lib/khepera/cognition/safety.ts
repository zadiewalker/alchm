import type { InterventionFamily, PsychologicalStateAssessment, ResponseForm } from './types';

export function getSafetyConstraints(assessment: PsychologicalStateAssessment): string[] {
  const constraints = [
    'Khepera is a non-directive reflection system, not a therapist, clinician, coach, or authority.',
    'Preserve the exact three-part Khepera output contract: Witness, Perspective Offer, Seed.',
    'No diagnosis, directives, prescriptions, moral judgment, certainty claims, or medical advice.',
    'Seed remains exactly one open-ended question and does not ask for a next action.',
  ];

  if (assessment.riskLevel !== 'low') {
    constraints.push(
      'Safety overrides variety, memory use, pattern interpretation, challenge, and depth.',
      'Prioritize stabilization, crisis/support resources when applicable, and low-complexity language.',
      'Do not retrieve or interpret longitudinal memory in elevated-risk states.',
    );
  }

  if (assessment.nervousSystemState.dissociation.score >= 0.5 || assessment.nervousSystemState.shutdown.score >= 0.5) {
    constraints.push('Use present-moment, concrete, low-demand language; avoid identity interpretation.');
  }

  return constraints;
}

export function applySafetyOverride(
  assessment: PsychologicalStateAssessment,
  proposed: { intervention: InterventionFamily; responseForm: ResponseForm },
): { intervention: InterventionFamily; responseForm: ResponseForm; riskConsiderations: string[] } {
  if (assessment.riskLevel === 'crisis' || assessment.riskLevel === 'elevated') {
    return {
      intervention: 'regulation',
      responseForm: 'groundingResponse',
      riskConsiderations: [
        `riskLevel=${assessment.riskLevel}`,
        'safety response supersedes variation and longitudinal interpretation',
      ],
    };
  }

  return {
    intervention: proposed.intervention,
    responseForm: proposed.responseForm,
    riskConsiderations: ['riskLevel=low'],
  };
}
