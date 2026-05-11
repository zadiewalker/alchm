import type { EntryAnchor, EntryAnchorKind } from '@/types/khepera';

const EMOTION_WORDS = [
  'happy', 'relieved', 'sad', 'angry', 'anxious', 'afraid', 'ashamed', 'lonely',
  'tender', 'numb', 'heavy', 'lighter', 'stuck', 'grateful', 'hopeful', 'worried',
];

const BODY_PATTERNS: Array<{ pattern: RegExp; kind: EntryAnchorKind }> = [
  { pattern: /\b(chest|stomach|throat|jaw|shoulders?|hands?|body)\s+(?:is|feels?|felt|was)?\s*(tight|heavy|soft|numb|dropped|dropping|buzzing|shaking|tense|settled)\b/i, kind: 'body_signal' },
  { pattern: /\bbody\s+(softened|went quiet|let go)\b/i, kind: 'body_signal' },
];

const RELATIONSHIP_PATTERNS: Array<{ pattern: RegExp; kind: EntryAnchorKind }> = [
  { pattern: /\b(the conversation|conversation|call|text|message|email|reply)\b/i, kind: 'relationship_signal' },
  { pattern: /\bwith (him|her|them)\b/i, kind: 'relationship_signal' },
];

const REPETITION_PATTERNS: Array<{ pattern: RegExp; kind: EntryAnchorKind }> = [
  { pattern: /\bkeep(?:ing)?\s+[a-z']+\b/i, kind: 'repetition' },
  { pattern: /\bover and over\b/i, kind: 'repetition' },
  { pattern: /\bagain and again\b/i, kind: 'repetition' },
  { pattern: /\breplaying\b/i, kind: 'repetition' },
  { pattern: /\bcircling\b/i, kind: 'repetition' },
];

const CONTRAST_PATTERNS: Array<{ pattern: RegExp; kind: EntryAnchorKind }> = [
  { pattern: /\bfinally\s+[a-z']+\b/i, kind: 'contrast' },
  { pattern: /\bat the same time\b/i, kind: 'contrast' },
  { pattern: /\bbut\b[^.!?\n]{0,48}/i, kind: 'contrast' },
  { pattern: /\bstill\b[^.!?\n]{0,36}/i, kind: 'contrast' },
];

const TENSION_PATTERNS: Array<{ pattern: RegExp; kind: EntryAnchorKind }> = [
  { pattern: /\bpart of me\b[^.!?\n]{0,60}\bpart of me\b/i, kind: 'tension' },
  { pattern: /\bwant(?:s|ing)?\b[^.!?\n]{0,42}\b(?:and|but)\b[^.!?\n]{0,42}\bwant(?:s|ing)?\b/i, kind: 'tension' },
  { pattern: /\bwondering if\b[^.!?\n]{0,36}/i, kind: 'tension' },
];

const SELF_LANGUAGE_PATTERNS: Array<{ pattern: RegExp; kind: EntryAnchorKind }> = [
  { pattern: /\bsounded\s+[a-z']+\b/i, kind: 'self_language' },
  { pattern: /\bfar away from myself\b/i, kind: 'self_language' },
  { pattern: /\bi am\b[^.!?\n]{0,32}/i, kind: 'self_language' },
  { pattern: /\bi feel\b[^.!?\n]{0,32}/i, kind: 'self_language' },
];

const TIME_PATTERNS: Array<{ pattern: RegExp; kind: EntryAnchorKind }> = [
  { pattern: /\b(today|tonight|lately|still|finally|again|now)\b/i, kind: 'time_signal' },
];

function cleanPhrase(phrase: string): string {
  return phrase
    .trim()
    .replace(/^[^A-Za-z0-9']+/, '')
    .replace(/[^A-Za-z0-9' ]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isIdentifyingPhrase(phrase: string): boolean {
  return /\b(?:\d{3,}|@|https?:\/\/|www\.|\.com\b)\b/i.test(phrase)
    || /\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(phrase);
}

function maybePushAnchor(
  anchors: EntryAnchor[],
  seen: Set<string>,
  phrase: string,
  kind: EntryAnchorKind,
): void {
  const cleaned = cleanPhrase(phrase);
  if (!cleaned || cleaned.length < 3 || cleaned.length > 48 || isIdentifyingPhrase(cleaned)) {
    return;
  }

  const normalized = cleaned.toLowerCase();
  if (seen.has(normalized)) {
    return;
  }

  seen.add(normalized);
  anchors.push({ phrase: cleaned, kind });
}

function collectPatternAnchors(
  entryText: string,
  anchors: EntryAnchor[],
  seen: Set<string>,
  patterns: Array<{ pattern: RegExp; kind: EntryAnchorKind }>,
): void {
  for (const { pattern, kind } of patterns) {
    const match = entryText.match(pattern);
    if (match?.[0]) {
      maybePushAnchor(anchors, seen, match[0], kind);
    }
  }
}

function collectEmotionAnchors(entryText: string, anchors: EntryAnchor[], seen: Set<string>): void {
  for (const word of EMOTION_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, 'i');
    const match = entryText.match(pattern);
    if (match?.[0]) {
      maybePushAnchor(anchors, seen, match[0], 'emotion_word');
    }
  }
}

function collectImageAnchors(entryText: string, anchors: EntryAnchor[], seen: Set<string>): void {
  const imageryMatches = entryText.match(/\b(room|phone|app|window|car|screen|door|table|bed|floor|light|silence)\b/ig) ?? [];
  for (const phrase of imageryMatches) {
    maybePushAnchor(anchors, seen, phrase, 'image');
  }
}

const KIND_PRIORITY: EntryAnchorKind[] = [
  'repetition',
  'contrast',
  'tension',
  'self_language',
  'body_signal',
  'relationship_signal',
  'emotion_word',
  'time_signal',
  'image',
];

export function extractEntryAnchors(entryText: string): EntryAnchor[] {
  const anchors: EntryAnchor[] = [];
  const seen = new Set<string>();

  collectPatternAnchors(entryText, anchors, seen, REPETITION_PATTERNS);
  collectPatternAnchors(entryText, anchors, seen, CONTRAST_PATTERNS);
  collectPatternAnchors(entryText, anchors, seen, TENSION_PATTERNS);
  collectPatternAnchors(entryText, anchors, seen, SELF_LANGUAGE_PATTERNS);
  collectPatternAnchors(entryText, anchors, seen, BODY_PATTERNS);
  collectPatternAnchors(entryText, anchors, seen, RELATIONSHIP_PATTERNS);
  collectEmotionAnchors(entryText, anchors, seen);
  collectPatternAnchors(entryText, anchors, seen, TIME_PATTERNS);
  collectImageAnchors(entryText, anchors, seen);

  return anchors
    .sort((left, right) => KIND_PRIORITY.indexOf(left.kind) - KIND_PRIORITY.indexOf(right.kind))
    .slice(0, Math.min(Math.max(anchors.length, 2), 5));
}
