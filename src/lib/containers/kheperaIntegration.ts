import type { ResponseForm } from '@/lib/khepera/cognition/types';
import type { ContainerContext, ContainerInquiry, KheperaContainerIntegration } from './types';

function responseFormsFor(context: ContainerContext): ResponseForm[] {
  if (context.id === 'burnout-recovery') return ['groundingResponse', 'extendedWitnessing'];
  if (context.id === 'identity-transition') return ['exploratoryDialogue', 'narrativeInterpretation'];
  if (context.id === 'belonging') return ['extendedWitnessing', 'patternSummary'];
  return ['extendedWitnessing', 'insightSynthesis'];
}

export function buildKheperaContainerIntegration(
  context: ContainerContext,
  activeInquiries: ContainerInquiry[] = [],
): KheperaContainerIntegration {
  return {
    containerId: context.id,
    foregroundThemes: context.activeThemes,
    interventionBias: context.preferredInterventions,
    memoryPriorities: context.memoryRetrievalBias,
    inquiryBias: activeInquiries.length
      ? activeInquiries.map((inquiry) => inquiry.domain)
      : context.inquiryDomains,
    responsePosture: context.presenceProfile.posture,
    responseFormBias: responseFormsFor(context),
    constraints: [
      'Use the container as a lens, not as an assignment.',
      'Do not imply the user is behind, even after a long absence.',
      'Do not diagnose, prescribe, coach, or optimize.',
      ...context.safetyAdjustments,
    ],
  };
}
