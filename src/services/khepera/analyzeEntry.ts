import type { EmotionalTone } from '@/types/journal';
import type { ReflectionAnalysis } from '@/types/khepera';
import { computeTextStructureFeatures, deriveRenderingConstraints } from './selectReflectionStyle';

const TONE_SIGNALS: Array<{ tone: EmotionalTone; patterns: RegExp[] }> = [
  { tone: 'grief', patterns: [/\bgrief|loss|miss|mourning|funeral|gone\b/i] },
  { tone: 'anger', patterns: [/\bangry|rage|furious|resent|irritat|mad\b/i] },
  { tone: 'anxiety', patterns: [/\banxious|panic|spiral|restless|worry|afraid\b/i] },
  { tone: 'clarity', patterns: [/\bclear|clarity|realize|understand|see now\b/i] },
  { tone: 'numbness', patterns: [/\bnumb|blank|empty|detached|nothing\b/i] },
  { tone: 'tenderness', patterns: [/\btender|soft|gentle|held|vulnerable\b/i] },
  { tone: 'ambivalence', patterns: [/\bpart of me|at the same time|both|torn|conflicted\b/i] },
];

const SELF_ATTACK_PATTERNS = [
  /\bi(?:'m| am) (a )?(failure|mess|problem|broken)\b/i,
  /\bi hate myself\b/i,
  /\bwhat is wrong with me\b/i,
  /\bi ruin everything\b/i,
  /\bi should be better\b/i,
];

const TENDER_PATTERNS = [
  /\bi need gentleness\b/i,
  /\bi feel soft\b/i,
  /\bi want to be kind to myself\b/i,
  /\bi'm trying to be gentle\b/i,
];

const SEARCHING_PATTERNS = [
  /\bi don't know\b/i,
  /\bi do not know\b/i,
  /\bnot sure\b/i,
  /\btrying to figure out\b/i,
  /\bsearching\b/i,
];

const SHIFT_PATTERNS = [
  /\bi noticed\b/i,
  /\bi realized\b/i,
  /\bit shifted\b/i,
  /\bit changed\b/i,
  /\bnow\b/i,
];

const STUCK_PATTERNS = [
  /\bstuck\b/i,
  /\bsame loop\b/i,
  /\bagain and again\b/i,
  /\bcan't move\b/i,
];

const RUMINATION_PATTERNS = [
  /\bover and over\b/i,
  /\bkept thinking\b/i,
  /\bspiral\b/i,
  /\bloop\b/i,
];

const CONCRETE_PATTERNS = [
  /\bbody\b/i,
  /\bchest\b/i,
  /\bstomach\b/i,
  /\broom\b/i,
  /\bcar\b/i,
  /\bphone\b/i,
  /\bdesk\b/i,
];

const ABSTRACT_PATTERNS = [
  /\bmeaning\b/i,
  /\bpurpose\b/i,
  /\bidentity\b/i,
  /\bstory\b/i,
  /\bpattern\b/i,
];

const AVOIDANT_PATTERNS = [
  /\bi(?:'m| am) fine\b/i,
  /\bit(?:'s| is) whatever\b/i,
  /\bnot going there\b/i,
  /\bdon't want to think about it\b/i,
  /\bdoesn't matter\b/i,
  /\bskip it\b/i,
];

const EXPLORATORY_PATTERNS = [
  /\bi wonder\b/i,
  /\bmaybe\b/i,
  /\bperhaps\b/i,
  /\bcurious\b/i,
  /\bi keep circling\b/i,
];

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function resolveTone(entryText: string, preferredTone?: string): EmotionalTone {
  const normalized = (preferredTone ?? '').toLowerCase().trim();
  const supported: EmotionalTone[] = [
    'processing',
    'grief',
    'anger',
    'anxiety',
    'clarity',
    'numbness',
    'tenderness',
    'ambivalence',
  ];

  if (supported.includes(normalized as EmotionalTone) && normalized !== 'processing') {
    return normalized as EmotionalTone;
  }

  for (const signal of TONE_SIGNALS) {
    if (hasAny(entryText, signal.patterns)) {
      return signal.tone;
    }
  }

  return 'processing';
}

export function analyzeEntry(entryText: string, preferredTone?: string): ReflectionAnalysis {
  const text = entryText.trim();
  const lowerText = text.toLowerCase();
  const features = computeTextStructureFeatures(text);
  const rendering = deriveRenderingConstraints(features);
  const notableSignals: string[] = [];

  const emotionalTone = resolveTone(lowerText, preferredTone);
  if (emotionalTone !== 'processing') notableSignals.push(`tone:${emotionalTone}`);

  const intensity: ReflectionAnalysis['intensity'] =
    /!{2,}/.test(text) || hasAny(lowerText, [/\boverwhelmed\b/i, /\bcan't\b/i, /\btoo much\b/i])
      ? 'high'
    : text.length < 90 || emotionalTone === 'numbness'
      ? 'low'
      : 'medium';
  if (intensity !== 'medium') notableSignals.push(`intensity:${intensity}`);

  const emotionalIntensity: ReflectionAnalysis['emotionalIntensity'] =
    intensity === 'medium' ? 'moderate' : intensity;
  if (emotionalIntensity !== 'moderate') notableSignals.push(`emotionalIntensity:${emotionalIntensity}`);

  const coherence: ReflectionAnalysis['coherence'] =
    (features.sentenceCount >= 3 && features.fragmentRatio >= 0.45) || features.lineBreakCount >= 4
      ? 'fragmented'
    : features.sentenceCount >= 3 && features.averageSentenceLength >= 9
      ? 'coherent'
      : 'mixed';
  if (coherence !== 'mixed') notableSignals.push(`coherence:${coherence}`);

  const loopingSignal =
    hasAny(lowerText, [...RUMINATION_PATTERNS, ...STUCK_PATTERNS])
    || ((lowerText.match(/\bagain\b/g) ?? []).length >= 2);
  const exploratorySignal =
    hasAny(lowerText, [...SEARCHING_PATTERNS, ...EXPLORATORY_PATTERNS])
    || ((text.match(/\?/g) ?? []).length >= 1 && emotionalIntensity !== 'high');
  const avoidantSignal =
    hasAny(lowerText, AVOIDANT_PATTERNS)
    || (emotionalTone === 'numbness' && features.wordCount <= 60);

  const narrativeMode: ReflectionAnalysis['narrativeMode'] =
    coherence === 'fragmented'
      ? 'fragmented'
      : loopingSignal
      ? 'looping'
      : avoidantSignal
      ? 'avoidant'
      : exploratorySignal
      ? 'exploratory'
      : 'reflective';
  if (narrativeMode !== 'reflective') notableSignals.push(`narrative:${narrativeMode}`);

  const firstPersonCount = (lowerText.match(/\b(i|me|my)\b/g) ?? []).length;
  const distanceFromSelf: ReflectionAnalysis['distanceFromSelf'] =
    emotionalTone === 'numbness' || hasAny(lowerText, [/\bdetached\b/i, /\bnumb\b/i])
      ? 'distanced'
      : firstPersonCount >= 3
      ? 'present'
      : 'mixed';
  if (distanceFromSelf !== 'mixed') notableSignals.push(`distance:${distanceFromSelf}`);

  const hasPast = /\byesterday|last|before|used to|earlier\b/i.test(lowerText);
  const hasFuture = /\btomorrow|later|next\b/i.test(lowerText);
  const hasPresent = /\bnow|today|right now|currently\b/i.test(lowerText);
  const temporalOrientation: ReflectionAnalysis['temporalOrientation'] =
    [hasPast, hasFuture, hasPresent].filter(Boolean).length > 1
      ? 'mixed'
      : hasFuture
      ? 'future'
      : hasPast
      ? 'past'
      : 'present';
  if (temporalOrientation !== 'present') notableSignals.push(`time:${temporalOrientation}`);

  const temporalFrame: ReflectionAnalysis['temporalFrame'] =
    hasFuture || (temporalOrientation === 'future' && emotionalTone === 'anxiety')
      ? 'future_uncertainty'
      : (emotionalIntensity === 'high' && hasPresent) || /right now|today|in this moment/i.test(lowerText)
      ? 'present_overwhelm'
      : 'past_processing';
  if (temporalFrame !== 'past_processing') notableSignals.push(`temporalFrame:${temporalFrame}`);

  const cognitiveStyle: ReflectionAnalysis['cognitiveStyle'] =
    hasAny(lowerText, RUMINATION_PATTERNS)
      ? 'ruminative'
    : hasAny(lowerText, ABSTRACT_PATTERNS) && hasAny(lowerText, CONCRETE_PATTERNS)
      ? 'mixed'
      : hasAny(lowerText, [/\bi realize|i learned|i can see|i see now|naming it\b/i])
      ? 'meaning-making'
      : hasAny(lowerText, CONCRETE_PATTERNS)
      ? 'concrete'
      : hasAny(lowerText, ABSTRACT_PATTERNS)
      ? 'abstract'
      : 'mixed';
  if (cognitiveStyle !== 'mixed') notableSignals.push(`style:${cognitiveStyle}`);

  const relationalPosture: ReflectionAnalysis['relationalPosture'] =
    hasAny(lowerText, SELF_ATTACK_PATTERNS)
      ? 'self-attacking'
      : hasAny(lowerText, TENDER_PATTERNS) || emotionalTone === 'tenderness'
      ? 'tender'
      : /trying to protect|keeping myself safe|guarded|armor|armour/i.test(lowerText)
      ? 'self-protective'
      : firstPersonCount > 0
      ? 'self-observing'
      : 'mixed';
  if (relationalPosture !== 'self-observing' && relationalPosture !== 'mixed') {
    notableSignals.push(`posture:${relationalPosture}`);
  }

  const movementSignal: ReflectionAnalysis['movementSignal'] =
    hasAny(lowerText, STUCK_PATTERNS)
      ? 'stuck'
      : hasAny(lowerText, [...SHIFT_PATTERNS, /\bsteadier\b/i, /\bexhaled\b/i, /\bsoftened\b/i])
      ? 'shifting'
      : hasAny(lowerText, SEARCHING_PATTERNS)
      ? 'searching'
      : /steady|calm|settled|grounded/i.test(lowerText)
      ? 'settled'
      : 'mixed';
  if (movementSignal !== 'mixed') notableSignals.push(`movement:${movementSignal}`);

  const signalStability: ReflectionAnalysis['signalStability'] =
    (coherence === 'fragmented' && emotionalIntensity === 'high')
    || (features.fragmentRatio >= 0.5 && features.punctuationDensity >= 0.08)
      ? 'disorganized'
      : loopingSignal || movementSignal === 'stuck' || emotionalTone === 'anxiety'
      ? 'escalating'
      : 'stable';
  if (signalStability !== 'stable') notableSignals.push(`stability:${signalStability}`);

  const primaryNeed: ReflectionAnalysis['primaryNeed'] =
    relationalPosture === 'self-attacking'
      ? 'permission'
      : emotionalTone === 'ambivalence' || /part of me|at the same time|both/i.test(lowerText)
      ? 'naming-ambivalence'
      : emotionalTone === 'numbness' || distanceFromSelf === 'distanced'
      ? 'grounding-through-clarity'
      : coherence === 'fragmented' || intensity === 'high'
      ? 'witnessing'
      : movementSignal === 'searching' || cognitiveStyle === 'ruminative'
      ? 'grounding-through-clarity'
      : 'gentle-reframing';

  const psychologicalNeedState: ReflectionAnalysis['psychologicalNeedState'] =
    signalStability === 'disorganized' || emotionalIntensity === 'high'
      ? 'witnessing'
      : avoidantSignal || distanceFromSelf === 'distanced'
      ? 'distancing'
      : narrativeMode === 'looping' || emotionalTone === 'ambivalence' || exploratorySignal
      ? 'ambiguity'
      : movementSignal === 'shifting' || movementSignal === 'settled' || cognitiveStyle === 'meaning-making'
      ? 'integration'
      : 'coherence';
  if (psychologicalNeedState !== 'coherence') notableSignals.push(`needState:${psychologicalNeedState}`);

  return {
    emotionalTone,
    intensity,
    emotionalIntensity,
    coherence,
    distanceFromSelf,
    temporalOrientation,
    temporalFrame,
    cognitiveStyle,
    relationalPosture,
    movementSignal,
    primaryNeed,
    narrativeMode,
    psychologicalNeedState,
    signalStability,
    textStructure: features,
    rendering,
    notableSignals,
  };
}
