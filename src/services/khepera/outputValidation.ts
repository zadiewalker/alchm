import type { KheperaResponse } from '@/types/khepera';
import { TEMPLATE_PHRASE_BANLIST } from './reflectionModes';

const DIAGNOSTIC_PATTERNS = [
  /\bthis (sounds|looks) like\b/i,
  /\byou (have|are experiencing|may be experiencing)\b/i,
  /\byour (anxiety|depression|ptsd|ocd|bpd|adhd|trauma|condition|disorder)\b/i,
  /\bthat('?s| is) (anxiety|depression|trauma|grief disorder|panic)\b/i,
];

const DIRECTIVE_PATTERNS = [
  /\byou should\b/i,
  /\byou need to\b/i,
  /\byou must\b/i,
  /\btry to\b/i,
  /\bconsider\b/i,
  /\bstart by\b/i,
  /\bmake sure you\b/i,
  /\bremember to\b/i,
  /\bit('?s| is) important to\b/i,
  /\btake a moment to\b/i,
  /\breach out to\b/i,
  /\bpractice\b/i,
];

const COACHING_PATTERNS = [
  /\bhere('?s| is) how\b/i,
  /\bthe next step\b/i,
  /\byour goal\b/i,
  /\byou can do this by\b/i,
  /\bwork on\b/i,
  /\bfocus on\b/i,
];

const BANNED_VERB_PATTERNS = [
  /\bshould\b/i,
  /\btry\b/i,
  /\bconsider\b/i,
  /\bneed to\b/i,
];

const PERSPECTIVE_CAUSAL_PATTERNS = [
  /\bthis is because\b/i,
  /\bthe reason is\b/i,
  /\bthat('?s| is) why\b/i,
  /\bwhich is why\b/i,
  /\bbecause you\b/i,
  /\bthis shows that\b/i,
  /\bthis reveals that\b/i,
];

const WITNESS_ABSTRACTION_PATTERNS = [
  /\bat the core\b/i,
  /\bbeneath\b/i,
  /\bunderneath\b/i,
  /\bdeeper\b/i,
  /\bwhat this reveals\b/i,
  /\bthis speaks to\b/i,
  /\bpart of you\b/i,
  /\bdynamic\b/i,
  /\breally going on\b/i,
];

const APPROVED_WITNESS_STEMS = [
  /^there('?s| is)\b/i,
  /^you describe\b/i,
  /^you write\b/i,
  /^you name\b/i,
  /^in what you('?ve| have) written\b/i,
];

const SOFT_THERAPY_CLICHE_PATTERNS = [
  /\bi notice\b/i,
  /\bi'm noticing\b/i,
  /\bi sense\b/i,
  /\bi hear\b/i,
  /\bholding space\b/i,
  /\bwith gentleness\b/i,
  /\bwith compassion\b/i,
];

const SURVEILLANCE_PHRASE_PATTERNS = [
  /\byou always\b/i,
  /\byou keep\b/i,
  /\bearlier you said\b/i,
  /\blast time\b/i,
  /\bprevious entry\b/i,
  /\bpreviously you said\b/i,
  /\bas before\b/i,
  /\bthis proves\b/i,
  /\byour pattern is\b/i,
];

export interface KheperaLintIssue {
  code:
    | 'diagnostic_framing'
    | 'directive_language'
    | 'coaching_language'
    | 'banned_verbs'
    | 'seed_question_count'
    | 'perspective_causal_claim'
    | 'witness_abstraction'
    | 'template_phrase'
    | 'repeated_opening';
  message: string;
}

function hasPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function countQuestions(text: string): number {
  return (text.match(/\?/g) || []).length;
}

function getOpeningStem(text: string): string | null {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/^[^a-z0-9']+/, '');

  if (!normalized) {
    return null;
  }

  const words = normalized.split(/\s+/).filter(Boolean).slice(0, 2);
  if (words.length === 0) {
    return null;
  }

  return words.join(' ');
}

function getMeaningfulWords(text: string): Set<string> {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this', 'that', 'it', 'there', 'here',
    'what', 'when', 'where', 'why', 'how', 'into', 'from', 'your', 'you', 'they', 'them', 'their',
    'have', 'has', 'had', 'feel', 'feels', 'felt', 'like', 'just', 'very', 'more', 'less',
  ]);

  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopWords.has(word))
  );
}

function witnessIntroducesAbstraction(witness: string, sourceText?: string): boolean {
  if (hasPattern(witness, WITNESS_ABSTRACTION_PATTERNS)) {
    return true;
  }

  if (APPROVED_WITNESS_STEMS.some((pattern) => pattern.test(witness))) {
    return false;
  }

  if (!sourceText) {
    return false;
  }

  const witnessWords = getMeaningfulWords(witness);
  const sourceWords = getMeaningfulWords(sourceText);
  const overlap = Array.from(witnessWords).some((word) => sourceWords.has(word));

  return !overlap;
}

export function lintKheperaResponse(
  response: KheperaResponse,
  sourceText?: string
): KheperaLintIssue[] {
  const issues: KheperaLintIssue[] = [];
  const { witness, perspective, seed } = response;
  const combinedText = `${witness}\n${perspective}\n${seed}`;
  const reflectiveText = `${perspective}\n${seed}`;

  if (hasPattern(combinedText, DIAGNOSTIC_PATTERNS)) {
    issues.push({
      code: 'diagnostic_framing',
      message: 'Response contains diagnostic framing.',
    });
  }

  if (hasPattern(reflectiveText, DIRECTIVE_PATTERNS)) {
    issues.push({
      code: 'directive_language',
      message: 'Response contains directive language.',
    });
  }

  if (hasPattern(reflectiveText, COACHING_PATTERNS)) {
    issues.push({
      code: 'coaching_language',
      message: 'Response contains coaching language.',
    });
  }

  if (hasPattern(reflectiveText, BANNED_VERB_PATTERNS)) {
    issues.push({
      code: 'banned_verbs',
      message: 'Response contains banned verbs.',
    });
  }

  if (countQuestions(seed) !== 1 || !seed.trim().endsWith('?')) {
    issues.push({
      code: 'seed_question_count',
      message: 'Seed must contain exactly one question.',
    });
  }

  if (hasPattern(perspective, PERSPECTIVE_CAUSAL_PATTERNS)) {
    issues.push({
      code: 'perspective_causal_claim',
      message: 'Perspective contains a causal claim.',
    });
  }

  if (witnessIntroducesAbstraction(witness, sourceText)) {
    issues.push({
      code: 'witness_abstraction',
      message: 'Witness introduces abstraction not grounded in the entry.',
    });
  }

  if (hasPattern(combinedText, [...TEMPLATE_PHRASE_BANLIST])) {
    issues.push({
      code: 'template_phrase',
      message: 'Response includes a banned template phrase.',
    });
  }

  if (hasPattern(combinedText, SOFT_THERAPY_CLICHE_PATTERNS)) {
    issues.push({
      code: 'template_phrase',
      message: 'Response includes soft-therapy cliché phrasing.',
    });
  }

  if (hasPattern(combinedText, SURVEILLANCE_PHRASE_PATTERNS)) {
    issues.push({
      code: 'template_phrase',
      message: 'Response includes surveillance-feeling continuity language.',
    });
  }

  const openings = [witness, perspective, seed]
    .map((section) => getOpeningStem(section))
    .filter((value): value is string => Boolean(value));
  const uniqueOpenings = new Set(openings);
  if (openings.length !== uniqueOpenings.size) {
    issues.push({
      code: 'repeated_opening',
      message: 'Response repeats sentence openings across sections.',
    });
  }

  return issues;
}

export function assertSafeKheperaOutput(
  witness: string,
  perspective: string,
  seedText: string,
  sourceText?: string
): void {
  const issues = lintKheperaResponse(
    {
      witness,
      perspective,
      seed: seedText,
    },
    sourceText
  );

  if (issues.length > 0) {
    throw new Error(`Unsafe Khepera output: ${issues[0].code}`);
  }
}
