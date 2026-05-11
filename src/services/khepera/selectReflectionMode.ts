import type { ReflectionAnalysis, ReflectionMode } from '@/types/khepera';
import { selectStance } from './selectStance';

export function selectReflectionMode(
  analysis: ReflectionAnalysis,
  stance = selectStance(analysis),
): ReflectionMode {
  if (
    analysis.relationalPosture === 'self-attacking'
    || analysis.relationalPosture === 'self-protective'
    || analysis.primaryNeed === 'permission'
  ) {
    return 'self_protection_reframe';
  }

  if (analysis.emotionalTone === 'ambivalence' || analysis.primaryNeed === 'naming-ambivalence') {
    return 'ambivalence_holding';
  }

  if (analysis.relationalPosture === 'tender' || analysis.emotionalTone === 'grief') {
    return 'tenderness_invitation';
  }

  switch (stance) {
    case 'containing':
    case 'witnessing':
      return 'pure_witness';
    case 'holding_ambiguity':
      return 'ambivalence_holding';
    case 'integrating':
      return analysis.movementSignal === 'shifting' ? 'movement_marking' : 'meaning_emergence';
    case 'expanding':
      return 'meaning_emergence';
    case 'clarifying':
    default:
      return analysis.narrativeMode === 'reflective' ? 'gentle_naming' : 'spacious_clarification';
  }
}
