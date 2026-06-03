import type { ContainerContext, ContainerLensId } from './types';

export const CONTAINER_CONTEXTS: Record<ContainerLensId, ContainerContext> = {
  'self-compassion': {
    id: 'self-compassion',
    name: 'Self-Compassion',
    activeThemes: ['selfWorth', 'identity'],
    developmentalPriorities: ['shameSoftening', 'gentleness', 'selfTrust'],
    preferredInterventions: ['witnessing', 'compassion', 'integration'],
    memoryRetrievalBias: ['recurring', 'softening', 'integration'],
    mirrorMovementFocus: ['softening', 'integration', 'transformation'],
    inquiryDomains: ['selfWorth', 'need', 'trust'],
    safetyAdjustments: ['Do not collude with self-criticism.', 'Do not turn gentleness into an assignment.'],
    presenceProfile: {
      qualities: ['warm', 'forgiving', 'accepting', 'gentle'],
      pacing: 'unhurried',
      depth: 'gentleDepth',
      posture: 'holding',
      languageNotes: ['foreground tenderness without praise pressure', 'avoid improvement language'],
    },
  },
  'burnout-recovery': {
    id: 'burnout-recovery',
    name: 'Burnout Recovery',
    activeThemes: ['burnout', 'purpose'],
    developmentalPriorities: ['restoration', 'boundaryRecognition', 'gentleness'],
    preferredInterventions: ['regulation', 'witnessing', 'compassion'],
    memoryRetrievalBias: ['softening', 'recent', 'unresolvedQuestion'],
    mirrorMovementFocus: ['softening', 'resolution', 'integration'],
    inquiryDomains: ['rest', 'boundary', 'need'],
    safetyAdjustments: ['Do not imply rest has to be earned.', 'Do not frame recovery as performance.'],
    presenceProfile: {
      qualities: ['spacious', 'gentle', 'restorative', 'quiet'],
      pacing: 'slow',
      depth: 'surfaceFirst',
      posture: 'welcoming',
      languageNotes: ['make absence emotionally neutral', 'prefer spaciousness over analysis'],
    },
  },
  'identity-transition': {
    id: 'identity-transition',
    name: 'Identity Transition',
    activeThemes: ['identity', 'uncertainty', 'purpose'],
    developmentalPriorities: ['liminality', 'identityIntegration', 'selfTrust'],
    preferredInterventions: ['exploration', 'meaningMaking', 'integration'],
    memoryRetrievalBias: ['recurring', 'integration', 'unresolvedQuestion'],
    mirrorMovementFocus: ['emergence', 'transformation', 'integration'],
    inquiryDomains: ['becoming', 'trust', 'carrying'],
    safetyAdjustments: ['Do not force clarity before it is available.', 'Let uncertainty remain dignified.'],
    presenceProfile: {
      qualities: ['curious', 'patient', 'exploratory', 'steady'],
      pacing: 'unhurried',
      depth: 'deepWhenInvited',
      posture: 'witnessing',
      languageNotes: ['foreground liminality', 'avoid identity conclusions'],
    },
  },
  belonging: {
    id: 'belonging',
    name: 'Belonging',
    activeThemes: ['belonging', 'connection', 'trust'],
    developmentalPriorities: ['belongingRepair', 'selfTrust', 'gentleness'],
    preferredInterventions: ['witnessing', 'reflection', 'compassion'],
    memoryRetrievalBias: ['recurring', 'softening', 'unresolvedQuestion'],
    mirrorMovementFocus: ['recurrence', 'softening', 'integration'],
    inquiryDomains: ['belonging', 'trust', 'need'],
    safetyAdjustments: ['Do not interpret isolation as pathology.', 'Do not prescribe connection.'],
    presenceProfile: {
      qualities: ['warm', 'steady', 'accepting', 'patient'],
      pacing: 'steady',
      depth: 'gentleDepth',
      posture: 'holding',
      languageNotes: ['hold relational ambiguity', 'avoid telling the user where they belong'],
    },
  },
};

export function getContainerContext(containerId: ContainerLensId): ContainerContext {
  return CONTAINER_CONTEXTS[containerId];
}
