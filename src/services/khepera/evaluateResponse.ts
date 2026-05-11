import type { EmotionalTone } from '@/types/journal';
import type { KheperaResponse } from '@/types/khepera';
import { lintKheperaResponse } from './outputValidation';

const SCORE_THRESHOLD = 8;
const NEUTRALITY_MIN_FLOOR = 4;

const BLOCKING_CODES = new Set([
  'diagnostic_framing',
  'directive_language',
  'coaching_language',
  'banned_verbs',
  'perspective_causal_claim',
]);

const GENERIC_PATTERNS = [
  /\byou put something real on the page\b/i,
  /\byour words make the moment more visible\b/i,
  /\bwhat feels closest to the surface\b/i,
  /\bthis entry has been received\b/i,
  /\byou wrote,? and the words are here\b/i,
  /\bthere is something (?:here|in this)\b/i,
  /\bsomething (?:is|keeps|feels)\b/i,
  /\bwhat feels most true\b/i,
  /\bi notice\b/i,
  /\bi sense\b/i,
  /\bholding space\b/i,
];

const TEMPLATE_PATTERNS = [
  /\bthere may be\b/gi,
  /\byou describe\b/gi,
  /\byou write\b/gi,
  /\bwhat feels\b/gi,
];

const GENERIC_SENTENCE_START_PATTERNS = [
  /^there (?:is|may be)\b/i,
  /^something\b/i,
  /^this\b/i,
  /^what feels\b/i,
  /^i notice\b/i,
  /^i sense\b/i,
];

const VAGUE_LANGUAGE_PATTERNS = [
  /\bsomething\b/gi,
  /\bthis\b/gi,
  /\bit\b/gi,
  /\bthat\b/gi,
  /\bthing\b/gi,
  /\bpart of (?:this|you)\b/gi,
  /\btruth\b/gi,
  /\bweight\b/gi,
  /\bspace\b/gi,
];

const ABSTRACTION_PATTERNS = [
  /\bmeaning\b/gi,
  /\bpattern\b/gi,
  /\bdynamic\b/gi,
  /\benergy\b/gi,
  /\btension\b/gi,
  /\bstory\b/gi,
  /\bshift\b/gi,
  /\bmovement\b/gi,
];

const HEAVY_TONE_AMPLIFICATION_PATTERNS = [
  /\bshattered\b/i,
  /\bcrushing\b/i,
  /\bdevastating\b/i,
  /\bunbearable\b/i,
  /\boverwhelming\b/i,
  /\bconsuming\b/i,
  /\braw\b/i,
  /\baching\b/i,
  /\bwrecked\b/i,
  /\bspiraling\b/i,
  /\bspiralling\b/i,
];

const HEAVY_TONES: readonly EmotionalTone[] = [
  'grief',
  'anger',
  'anxiety',
  'numbness',
];

export interface KheperaEvaluationResult {
  resonance: number;
  specificity: number;
  neutrality: number;
  score: number;
  shouldRetry: boolean;
  blocked: boolean;
  safeCandidate: boolean;
  reasons: string[];
  genericPhrases: string[];
  templateLike: boolean;
  derivativeMirroring: boolean;
  heavyToneDosageIssue: boolean;
}

function getMeaningfulWords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this', 'that', 'it', 'there', 'here',
    'what', 'when', 'where', 'why', 'how', 'into', 'from', 'your', 'you', 'they', 'them', 'their',
    'have', 'has', 'had', 'feel', 'feels', 'felt', 'like', 'just', 'very', 'more', 'less',
    'then', 'than', 'will', 'would', 'could', 'should', 'about', 'around', 'still',
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));
}

function countPatternMatches(text: string, pattern: RegExp): number {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function collectGenericPhrases(text: string): string[] {
  return GENERIC_PATTERNS
    .filter((pattern) => pattern.test(text))
    .map((pattern) => pattern.source);
}

function buildNgrams(words: string[], size: number): Set<string> {
  const ngrams = new Set<string>();
  for (let index = 0; index <= words.length - size; index += 1) {
    ngrams.add(words.slice(index, index + size).join(' '));
  }
  return ngrams;
}

function scoreResonance(entryText: string, response: KheperaResponse): {
  score: number;
  reason?: string;
  derivativeMirroring: boolean;
} {
  const sourceWords = getMeaningfulWords(entryText);
  const responseWords = getMeaningfulWords(`${response.witness} ${response.perspective} ${response.seed}`);
  const sourceSet = new Set(sourceWords);
  const responseSet = new Set(responseWords);
  const overlap = Array.from(responseSet).filter((word) => sourceSet.has(word)).length;
  const overlapRatio = responseSet.size > 0 ? overlap / responseSet.size : 0;
  const responseTrigrams = buildNgrams(responseWords, 3);
  const sourceTrigrams = buildNgrams(sourceWords, 3);
  const sharedTrigrams = Array.from(responseTrigrams).filter((ngram) => sourceTrigrams.has(ngram)).length;
  const derivativeMirroring =
    overlapRatio >= 0.78
    || (overlapRatio >= 0.62 && responseSet.size <= 8)
    || sharedTrigrams >= 2;

  if (derivativeMirroring) {
    return {
      score: 1,
      reason: 'response mirrors the entry too closely instead of showing attunement.',
      derivativeMirroring: true,
    };
  }

  if (overlap >= 5 && overlapRatio <= 0.7) return { score: 4, derivativeMirroring: false };
  if (overlap >= 3 && overlapRatio <= 0.72) return { score: 3, derivativeMirroring: false };
  if (overlap >= 2) return { score: 2, derivativeMirroring: false };
  if (overlap >= 1) {
    return {
      score: 1,
      reason: 'resonance is thin and loosely grounded in the entry.',
      derivativeMirroring: false,
    };
  }

  return {
    score: 0,
    reason: 'response is too generic to feel specific to this entry.',
    derivativeMirroring: false,
  };
}

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function countMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce((count, pattern) => count + countPatternMatches(text, pattern), 0);
}

function getOpeningStem(text: string): string | null {
  const normalized = text.trim().toLowerCase().replace(/^[^a-z0-9']+/, '');
  if (!normalized) return null;
  const words = normalized.split(/\s+/).filter(Boolean).slice(0, 2);
  return words.length ? words.join(' ') : null;
}

function scoreSpecificity(
  response: KheperaResponse,
  entryTone: EmotionalTone,
): { score: number; reason?: string; genericPhrases: string[]; templateLike: boolean } {
  const combined = `${response.witness} ${response.perspective} ${response.seed}`;
  const genericPhrases = collectGenericPhrases(combined);
  const templateRepeats = TEMPLATE_PATTERNS.reduce((count, pattern) => count + countPatternMatches(combined, pattern), 0);
  const somethingCount = countPatternMatches(combined, /\bsomething\b/gi);
  const wordCount = getMeaningfulWords(combined).length;
  const sentences = [response.witness, response.perspective, response.seed]
    .flatMap((section) => splitSentences(section));
  const genericStarts = sentences.filter((sentence) => GENERIC_SENTENCE_START_PATTERNS.some((pattern) => pattern.test(sentence))).length;
  const vagueCount = countMatches(combined, VAGUE_LANGUAGE_PATTERNS);
  const abstractionCount = countMatches(combined, ABSTRACTION_PATTERNS);
  const anchorWordCount = getMeaningfulWords(response.witness).length;
  const openingStems = [response.witness, response.perspective, response.seed]
    .map((section) => getOpeningStem(section))
    .filter((value): value is string => Boolean(value));
  const repeatedOpeningCount = openingStems.length - new Set(openingStems).size;

  let score = 4;
  const reasons: string[] = [];

  if (genericPhrases.length > 0) {
    score -= 2;
    reasons.push('response contains generic phrasing');
  }

  const templateLike = templateRepeats >= 3 || somethingCount >= (HEAVY_TONES.includes(entryTone) ? 2 : 3);
  if (templateLike) {
    score -= 1;
    reasons.push('response reads like a reusable template');
  }

  if (genericStarts >= 2) {
    score -= 1;
    reasons.push('response repeats generic sentence frames');
  }

  if (repeatedOpeningCount > 0) {
    score -= 1;
    reasons.push('response repeats its openings across sections');
  }

  if (vagueCount >= 4 && abstractionCount >= 2) {
    score -= 1;
    reasons.push('response uses abstraction without enough concrete anchors');
  }

  if (anchorWordCount < 4) {
    score -= 1;
    reasons.push('witness is not concrete enough');
  }

  if (wordCount < 10) {
    score -= 1;
    reasons.push('response does not carry enough specific language');
  }

  return {
    score: Math.max(0, score),
    reason: reasons[0],
    genericPhrases,
    templateLike,
  };
}

function scoreNeutrality(response: KheperaResponse, entryText: string): { score: number; reason?: string; blocked: boolean } {
  const issues = lintKheperaResponse(response, entryText);
  const blockingIssue = issues.find((issue) => BLOCKING_CODES.has(issue.code));

  if (blockingIssue) {
    return {
      score: 0,
      reason: blockingIssue.message,
      blocked: true,
    };
  }

  const templateIssue = issues.find((issue) => issue.code === 'template_phrase');
  if (templateIssue) {
    return {
      score: 3,
      reason: templateIssue.message,
      blocked: false,
    };
  }

  return {
    score: 4,
    blocked: false,
  };
}

function evaluateHeavyToneDosage(
  response: KheperaResponse,
  entryText: string,
  entryTone: EmotionalTone,
): { blocked: boolean; penalty: number; reason?: string } {
  if (!HEAVY_TONES.includes(entryTone)) {
    return { blocked: false, penalty: 0 };
  }

  const combined = `${response.witness}\n${response.perspective}`;
  const responseAmplification = countMatches(combined, HEAVY_TONE_AMPLIFICATION_PATTERNS);
  const entryAmplification = countMatches(entryText, HEAVY_TONE_AMPLIFICATION_PATTERNS);
  const witnessWordCount = response.witness.split(/\s+/).filter(Boolean).length;
  const perspectiveWordCount = response.perspective.split(/\s+/).filter(Boolean).length;
  const perspectiveSentenceCount = splitSentences(response.perspective).length;

  if (responseAmplification > entryAmplification) {
    return {
      blocked: true,
      penalty: 2,
      reason: 'response intensifies emotional weight beyond the entry.',
    };
  }

  if (perspectiveWordCount > 44 || perspectiveSentenceCount > 2 || witnessWordCount > 26) {
    return {
      blocked: false,
      penalty: 1,
      reason: 'response is too expanded for a heavy tone and needs steadier dosage.',
    };
  }

  return { blocked: false, penalty: 0 };
}

export function evaluateKheperaResponse(params: {
  response: KheperaResponse;
  entryText: string;
  entryTone: EmotionalTone;
}): KheperaEvaluationResult {
  const { response, entryText, entryTone } = params;
  const resonance = scoreResonance(entryText, response);
  const specificity = scoreSpecificity(response, entryTone);
  const neutrality = scoreNeutrality(response, entryText);
  const dosage = evaluateHeavyToneDosage(response, entryText, entryTone);

  const reasons = [
    resonance.reason,
    specificity.reason,
    neutrality.reason,
    dosage.reason,
  ].filter((reason): reason is string => Boolean(reason));

  const score = Math.max(0, resonance.score + specificity.score + neutrality.score - dosage.penalty);
  const blocked = neutrality.blocked || dosage.blocked;
  const safeCandidate = !blocked && neutrality.score >= NEUTRALITY_MIN_FLOOR;

  return {
    resonance: resonance.score,
    specificity: specificity.score,
    neutrality: neutrality.score,
    score,
    blocked,
    safeCandidate,
    shouldRetry: blocked || !safeCandidate || score < SCORE_THRESHOLD,
    reasons,
    genericPhrases: specificity.genericPhrases,
    templateLike: specificity.templateLike,
    derivativeMirroring: resonance.derivativeMirroring,
    heavyToneDosageIssue: dosage.penalty > 0 || dosage.blocked,
  };
}

export function buildEvaluationRetryFeedback(result: KheperaEvaluationResult): string {
  const feedback: string[] = [];

  if (result.blocked) {
    feedback.push('Remove any directive, coaching, or diagnostic phrasing entirely.');
  }

  if (result.resonance < 3) {
    feedback.push('Anchor the response in concrete language already present in the entry.');
  }

  if (result.derivativeMirroring) {
    feedback.push('Do not mirror the entry too closely; stay grounded without copying its phrasing.');
  }

  if (result.specificity < 3) {
    feedback.push('Avoid reusable phrasing, vague pronouns, and abstraction without concrete anchors.');
  }

  if (result.templateLike) {
    feedback.push('Do not sound like a reusable template; make the language entry-specific.');
  }

  if (result.genericPhrases.length > 0) {
    feedback.push('Remove stock phrases and rewrite in plainer, more specific language.');
  }

  if (result.heavyToneDosageIssue) {
    feedback.push('Keep the response shorter, steadier, and less emotionally amplified for this tone.');
  }

  return feedback.join('\n');
}
