import type {
  CognitiveDynamic,
  DominantNeed,
  EmotionalState,
  KheperaConfidence,
  KheperaRiskLevel,
  KheperaScore,
  NervousSystemState,
  PsychologicalStateAssessment,
  Readiness,
  ReflectiveCapacity,
} from './types';

type ScoredDimension<T extends string> = Record<T, KheperaScore>;

function emptyScores<T extends string>(labels: readonly T[]): ScoredDimension<T> {
  return labels.reduce((scores, label) => ({
    ...scores,
    [label]: { score: 0, evidence: [] },
  }), {} as ScoredDimension<T>);
}

function addSignal<T extends string>(
  scores: ScoredDimension<T>,
  label: T,
  amount: number,
  evidence: string,
): void {
  const next = scores[label];
  next.score = Math.min(1, next.score + amount);
  next.evidence.push(evidence);
}

function has(text: string, pattern: RegExp): boolean {
  return pattern.test(text);
}

function topScore<T extends string>(scores: ScoredDimension<T>): number {
  return Math.max(...Object.values<KheperaScore>(scores).map((value) => value.score));
}

function confidenceFrom(scores: Array<Record<string, KheperaScore>>): KheperaConfidence {
  const strongest = Math.max(...scores.map(topScore));
  if (strongest >= 0.72) return 'high';
  if (strongest >= 0.38) return 'moderate';
  return 'low';
}

function assessRisk(text: string, crisisDetected: boolean): KheperaRiskLevel {
  if (crisisDetected) return 'crisis';
  if (has(text, /\bpanic|can't breathe|cannot breathe|unsafe|dissociat|not real|hurt myself\b/i)) {
    return 'elevated';
  }
  return 'low';
}

const emotionalLabels = [
  'grief',
  'shame',
  'anger',
  'anxiety',
  'overwhelm',
  'confusion',
  'hope',
  'numbness',
  'loneliness',
  'exhaustion',
  'relief',
] as const satisfies readonly EmotionalState[];

const nervousLabels = [
  'regulated',
  'mildlyActivated',
  'highlyActivated',
  'fight',
  'flight',
  'freeze',
  'shutdown',
  'dissociation',
] as const satisfies readonly NervousSystemState[];

const cognitiveLabels = [
  'rumination',
  'catastrophizing',
  'perfectionism',
  'selfCriticism',
  'avoidance',
  'guiltSpiral',
  'blackAndWhiteThinking',
  'helplessness',
] as const satisfies readonly CognitiveDynamic[];

const capacityLabels = ['minimal', 'emerging', 'available', 'integrative'] as const satisfies readonly ReflectiveCapacity[];
const readinessLabels = ['validationOnly', 'gentleCuriosity', 'reframing', 'challenge', 'actionPlanning'] as const satisfies readonly Readiness[];
const needLabels = [
  'witnessing',
  'regulation',
  'compassion',
  'clarity',
  'perspective',
  'agency',
  'griefSupport',
  'identityExploration',
  'integration',
] as const satisfies readonly DominantNeed[];

export function assessPsychologicalState(entryText: string, crisisDetected = false): PsychologicalStateAssessment {
  const text = entryText.trim();
  const lower = text.toLowerCase();
  const emotionalState = emptyScores(emotionalLabels);
  const nervousSystemState = emptyScores(nervousLabels);
  const cognitiveDynamics = emptyScores(cognitiveLabels);
  const reflectiveCapacity = emptyScores(capacityLabels);
  const readiness = emptyScores(readinessLabels);
  const dominantNeed = emptyScores(needLabels);
  const riskLevel = assessRisk(lower, crisisDetected);

  if (has(lower, /\bgrief|loss|miss|mourning|gone|funeral\b/i)) addSignal(emotionalState, 'grief', 0.76, 'loss language');
  if (has(lower, /\bshame|ashamed|humiliated|disgusted with myself\b/i)) addSignal(emotionalState, 'shame', 0.76, 'shame language');
  if (has(lower, /\bangry|rage|furious|resent|snap|armor|armour\b/i)) addSignal(emotionalState, 'anger', 0.7, 'anger/protection language');
  if (has(lower, /\banxious|worry|afraid|panic|spiral\b/i)) addSignal(emotionalState, 'anxiety', 0.74, 'anxiety language');
  if (has(lower, /\boverwhelm|too much|flooded|everything feels loud\b/i)) addSignal(emotionalState, 'overwhelm', 0.82, 'overwhelm language');
  if (has(lower, /\bconfused|don't know|do not know|unclear|lost\b/i)) addSignal(emotionalState, 'confusion', 0.54, 'uncertainty language');
  if (has(lower, /\bhope|maybe possible|small light|can see\b/i)) addSignal(emotionalState, 'hope', 0.52, 'hope/possibility language');
  if (has(lower, /\bnumb|blank|empty|detached|nothing\b/i)) addSignal(emotionalState, 'numbness', 0.78, 'numbness language');
  if (has(lower, /\balone|lonely|no one|isolated\b/i)) addSignal(emotionalState, 'loneliness', 0.66, 'aloneness language');
  if (has(lower, /\btired|exhausted|depleted|burned out|burnt out\b/i)) addSignal(emotionalState, 'exhaustion', 0.68, 'depletion language');
  if (has(lower, /\brelief|exhaled|softened|steadier|easier\b/i)) addSignal(emotionalState, 'relief', 0.58, 'relief/settling language');

  addSignal(nervousSystemState, 'regulated', has(lower, /\bsteady|settled|calm|exhaled\b/i) ? 0.7 : 0.18, 'baseline regulation estimate');
  if (has(lower, /\btense|restless|on edge|buzzing\b/i)) addSignal(nervousSystemState, 'mildlyActivated', 0.5, 'activation language');
  if (has(lower, /\bpanic|too much|can't breathe|cannot breathe|everything feels loud\b/i)) addSignal(nervousSystemState, 'highlyActivated', 0.86, 'high activation language');
  if (has(lower, /\bfight|snap|rage|armor|armour\b/i)) addSignal(nervousSystemState, 'fight', 0.65, 'fight/protection signal');
  if (has(lower, /\brun away|escape|get out|avoid everyone\b/i)) addSignal(nervousSystemState, 'flight', 0.6, 'flight signal');
  if (has(lower, /\bfrozen|stuck|can't move|cannot move\b/i)) addSignal(nervousSystemState, 'freeze', 0.66, 'freeze language');
  if (has(lower, /\bshutdown|shut down|blank|empty\b/i)) addSignal(nervousSystemState, 'shutdown', 0.7, 'shutdown language');
  if (has(lower, /\bdissociat|not real|outside my body|far away from myself\b/i)) addSignal(nervousSystemState, 'dissociation', 0.82, 'dissociation language');

  if (has(lower, /\bover and over|replay|loop|spiral|circling\b/i)) addSignal(cognitiveDynamics, 'rumination', 0.8, 'looping thought language');
  if (has(lower, /\bworst|ruined forever|never be okay|everything is over\b/i)) addSignal(cognitiveDynamics, 'catastrophizing', 0.78, 'catastrophic forecast language');
  if (has(lower, /\bperfect|should be better|not enough|failed again\b/i)) addSignal(cognitiveDynamics, 'perfectionism', 0.62, 'performance standard language');
  if (has(lower, /\bi am a failure|hate myself|what is wrong with me|i ruin\b/i)) addSignal(cognitiveDynamics, 'selfCriticism', 0.86, 'self-attacking language');
  if (has(lower, /\bavoid|skip it|not going there|whatever|doesn't matter\b/i)) addSignal(cognitiveDynamics, 'avoidance', 0.58, 'avoidance language');
  if (has(lower, /\bguilty|my fault|should have|i caused\b/i)) addSignal(cognitiveDynamics, 'guiltSpiral', 0.66, 'guilt language');
  if (has(lower, /\balways|never|everyone|nothing works\b/i)) addSignal(cognitiveDynamics, 'blackAndWhiteThinking', 0.52, 'absolute language');
  if (has(lower, /\bhelpless|pointless|can't do anything|no way out\b/i)) addSignal(cognitiveDynamics, 'helplessness', 0.72, 'helplessness language');

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  addSignal(reflectiveCapacity, wordCount < 12 || riskLevel !== 'low' ? 'minimal' : 'emerging', 0.46, 'entry length and risk dosage');
  if (has(lower, /\bi notice|i noticed|i wonder|part of me|maybe\b/i)) addSignal(reflectiveCapacity, 'available', 0.62, 'reflective language');
  if (has(lower, /\bpattern|i can see|i realize|this connects|shift\b/i)) addSignal(reflectiveCapacity, 'integrative', 0.72, 'integration language');
  if (riskLevel !== 'low') addSignal(readiness, 'validationOnly', 0.92, 'risk overrides depth');
  else if (topScore(cognitiveDynamics) >= 0.75 || topScore(nervousSystemState) >= 0.75) addSignal(readiness, 'validationOnly', 0.74, 'high load limits depth');
  if (has(lower, /\bi wonder|curious|maybe|part of me\b/i)) addSignal(readiness, 'gentleCuriosity', 0.62, 'curiosity language');
  if (has(lower, /\bmaybe this is|another way|can see\b/i)) addSignal(readiness, 'reframing', 0.5, 'reframe-ready language');
  if (has(lower, /\bsame pattern|again|loop|by now\b/i) && riskLevel === 'low') addSignal(readiness, 'challenge', 0.42, 'repetition without acute risk');
  if (has(lower, /\bneed a plan|what now|next step|how do i\b/i) && riskLevel === 'low') addSignal(readiness, 'actionPlanning', 0.44, 'action request language');

  if (riskLevel !== 'low' || topScore(nervousSystemState) >= 0.78) addSignal(dominantNeed, 'regulation', 0.9, 'safety/stabilization priority');
  if (topScore(emotionalState) < 0.42) addSignal(dominantNeed, 'witnessing', 0.5, 'low-confidence emotional signal');
  if (emotionalState.shame.score > 0.5 || cognitiveDynamics.selfCriticism.score > 0.5) addSignal(dominantNeed, 'compassion', 0.82, 'self-attack needs compassion');
  if (emotionalState.confusion.score > 0.45 || cognitiveDynamics.rumination.score > 0.5) addSignal(dominantNeed, 'clarity', 0.66, 'looping/confusion needs clarity');
  if (reflectiveCapacity.available.score > 0.55) addSignal(dominantNeed, 'perspective', 0.52, 'reflection available');
  if (readiness.actionPlanning.score > 0.4) addSignal(dominantNeed, 'agency', 0.45, 'user asks for planning');
  if (emotionalState.grief.score > 0.5) addSignal(dominantNeed, 'griefSupport', 0.78, 'grief language');
  if (has(lower, /\bidentity|who i am|the old me|becoming\b/i)) addSignal(dominantNeed, 'identityExploration', 0.62, 'identity language');
  if (reflectiveCapacity.integrative.score > 0.6 || emotionalState.relief.score > 0.5) addSignal(dominantNeed, 'integration', 0.7, 'growth/integration signal');

  return {
    emotionalState,
    nervousSystemState,
    cognitiveDynamics,
    reflectiveCapacity,
    readiness,
    dominantNeed,
    riskLevel,
    confidence: confidenceFrom([emotionalState, nervousSystemState, cognitiveDynamics, dominantNeed]),
  };
}
