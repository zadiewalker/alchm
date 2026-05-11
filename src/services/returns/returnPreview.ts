import type { JournalEntry } from '@/services/data/dataService';

export interface ReturnEntryPreview {
  excerpt: string;
  daysAgo: number;
}

const FALLBACK_EXCERPT = 'Something in this writing stayed with you.';
const MAX_EXCERPT_LENGTH = 140;
const MIN_ACCEPTABLE_SCORE = 72;

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function truncateExcerpt(text: string, maxLength: number = MAX_EXCERPT_LENGTH): string {
  const normalized = normalizeWhitespace(text);

  if (!normalized) {
    return FALLBACK_EXCERPT;
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const slice = normalized.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const trimmed = (lastSpace > 48 ? slice.slice(0, lastSpace) : slice).trimEnd();

  return `${trimmed}...`;
}

function splitIntoCandidates(text: string): string[] {
  const paragraphs = text
    .split(/\n\s*\n/g)
    .map((paragraph) => normalizeWhitespace(paragraph))
    .filter(Boolean);

  const candidates = new Set<string>();

  for (const paragraph of paragraphs) {
    candidates.add(paragraph);

    for (const sentence of paragraph.split(/(?<=[.!?])\s+/)) {
      const normalizedSentence = normalizeWhitespace(sentence);

      if (normalizedSentence) {
        candidates.add(normalizedSentence);
      }
    }
  }

  return [...candidates];
}

function scoreCandidate(text: string): number {
  const length = text.length;
  const wordCount = text.split(/\s+/).length;
  const hasFirstPerson = /\b(i|i'm|i’ve|i'd|me|my|mine|myself)\b/i.test(text);
  const hasEmotionOrMovement =
    /\b(feel|felt|feeling|want|wanted|need|needed|realize|realized|notice|noticed|afraid|scared|angry|sad|tired|grief|hope|hoping|miss|missing|love|ashamed|stuck|ready|wish)\b/i.test(
      text,
    );
  const hasSentenceEnding = /[.!?]["']?$/.test(text);
  const looksLikeHeading = wordCount <= 6 && !/[.!?]/.test(text);
  const startsWithContinuation = /^(and|but|because|so)\b/i.test(text);
  const hasQuotedDialogue = /["'](?:[^"']{0,80})["']/.test(text);
  const hasSensitiveDetails =
    /\b(?:https?:\/\/|www\.|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/i.test(text) ||
    /\b\d{2,}\b/.test(text);
  const ambiguousPronouns = text.match(/\b(it|this|that|they|them|their|he|him|his|she|her|hers)\b/gi)?.length || 0;
  const hasHighAmbiguity = ambiguousPronouns >= 3 && !hasFirstPerson;
  const willNeedTruncation = length > MAX_EXCERPT_LENGTH;

  let score = 0;

  score += Math.max(0, 90 - Math.abs(92 - Math.min(length, 184)));
  score += hasFirstPerson ? 24 : 0;
  score += hasEmotionOrMovement ? 18 : 0;
  score += hasSentenceEnding ? 12 : 0;
  score -= looksLikeHeading ? 30 : 0;
  score -= startsWithContinuation ? 24 : 0;
  score -= hasQuotedDialogue ? 18 : 0;
  score -= hasSensitiveDetails ? 34 : 0;
  score -= hasHighAmbiguity ? 22 : 0;
  score -= willNeedTruncation && !hasSentenceEnding ? 16 : 0;
  score -= length < 24 ? 26 : 0;
  score -= length > 220 ? 18 : 0;

  return score;
}

export function selectReturnExcerpt(text: string): string {
  const normalized = text.trim();

  if (!normalized) {
    return FALLBACK_EXCERPT;
  }

  const candidates = splitIntoCandidates(normalized);
  const scoredCandidates = candidates
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(candidate),
    }))
    .sort((left, right) => right.score - left.score);

  const bestCandidate = scoredCandidates[0];

  if (!bestCandidate || bestCandidate.score < MIN_ACCEPTABLE_SCORE) {
    return FALLBACK_EXCERPT;
  }

  return truncateExcerpt(bestCandidate.candidate);
}

export function calculateReturnDaysAgo(createdAt: number | string | Date): number {
  const timestamp =
    typeof createdAt === 'number'
      ? createdAt
      : createdAt instanceof Date
      ? createdAt.getTime()
      : new Date(createdAt).getTime();

  if (!Number.isFinite(timestamp)) {
    throw new Error('Invalid createdAt value for return preview');
  }

  const diffMs = Math.max(0, Date.now() - timestamp);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getReturnPreview(entry: JournalEntry | null): ReturnEntryPreview | null {
  if (!entry) {
    return null;
  }

  return {
    excerpt: selectReturnExcerpt(String(entry.content || '')),
    daysAgo: calculateReturnDaysAgo(entry.createdAt),
  };
}
