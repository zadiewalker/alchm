import { readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';
import type { BodyEcho, EmotionalPoint } from '@/lib/postEntryTransform';

export type ExerciseType =
  | 'reframe'
  | 'unsaid'
  | 'letter'
  | 'compass'
  | 'somatic'
  | 'witness'
  | 'time_bridge'
  | 'essence';

export interface ExerciseHistoryItem {
  type: ExerciseType;
  date: string;
  wasCompleted: boolean;
}

export interface ExerciseResult {
  type: ExerciseType;
  date: string;
  completed: boolean;
  originalLine?: string;
  reframedLine?: string;
  unsaidText?: string;
  personName?: string;
  letterText?: string;
  directionA?: string;
  directionB?: string;
  somaticRegion?: BodyEcho['region'];
  selfCriticalLine?: string;
  compassionateResponse?: string;
  pastLine?: string;
  presentLine?: string;
  messageToYoungerSelf?: string;
  words?: string[];
}

export interface ExerciseCandidate {
  type: ExerciseType;
  triggerScore: number;
  sourceData: Record<string, unknown>;
}

export interface ExerciseSelection {
  primary: ExerciseCandidate | null;
  secondary: ExerciseCandidate | null;
  skipOption: true;
}

export interface RouteExerciseInput {
  text: string;
  extractedLine: string;
  moodLabel?: string | null;
  isCheckin?: boolean;
  totalEntries: number;
  bodyEchoes: BodyEcho[];
  arc: EmotionalPoint[];
}

const HEAVY_EXERCISES: ExerciseType[] = ['somatic', 'time_bridge', 'witness'];
const SKIP_SUPPRESS_DAYS = 7;
const MAX_EXERCISES_PER_WEEK = 5;

function nowIso(): string {
  return new Date().toISOString();
}

function daysAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function isRecent(iso: string, days: number): boolean {
  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return false;
  return time >= daysAgo(days);
}

function wordCount(text: string): number {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function splitSentences(text: string): string[] {
  return String(text || '')
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
}

function countMoodShifts(points: EmotionalPoint[]): number {
  if (!points.length) return 0;
  let shifts = 0;
  let prevSign = Math.sign(points[0]?.valence || 0);
  for (let i = 1; i < points.length; i += 1) {
    const sign = Math.sign(points[i]?.valence || 0);
    if (sign !== 0 && prevSign !== 0 && sign !== prevSign) shifts += 1;
    if (sign !== 0) prevSign = sign;
  }
  return shifts;
}

function detectNamedPeople(text: string): string[] {
  const names = new Set<string>();
  const relationNames = text.match(/\b(Mom|Mother|Dad|Father|Partner|Husband|Wife|Brother|Sister|Friend)\b/g) || [];
  relationNames.forEach((n) => names.add(n));

  const tokens = text.match(/\b[A-Z][a-z]{2,}\b/g) || [];
  for (const token of tokens) {
    if (['I', 'The', 'And', 'But', 'Today', 'Yesterday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(token)) continue;
    names.add(token);
    if (names.size >= 3) break;
  }

  return Array.from(names);
}

function recentHistory(): ExerciseHistoryItem[] {
  return readJsonExact<ExerciseHistoryItem[]>(STORAGE_KEYS.postEntryExerciseHistory, []).filter(Boolean);
}

export function getExerciseHistory(): ExerciseHistoryItem[] {
  return recentHistory();
}

export function writeExerciseHistory(next: ExerciseHistoryItem[]): void {
  writeJson(STORAGE_KEYS.postEntryExerciseHistory, next.slice(-120));
}

export function appendExerciseHistory(item: ExerciseHistoryItem): void {
  const history = recentHistory();
  history.push(item);
  writeExerciseHistory(history);
}

function pausedByGlobalSkips(history: ExerciseHistoryItem[]): boolean {
  const recent = history.slice(-3);
  if (recent.length < 3) return false;
  if (recent.some((h) => h.wasCompleted)) return false;
  const latest = recent[recent.length - 1];
  return isRecent(latest?.date || '', SKIP_SUPPRESS_DAYS);
}

function suppressedType(history: ExerciseHistoryItem[], type: ExerciseType): boolean {
  const byType = history.filter((h) => h.type === type).slice(-2);
  if (byType.length < 2) return false;
  const bothSkipped = byType.every((h) => !h.wasCompleted);
  if (!bothSkipped) return false;
  const latest = byType[byType.length - 1];
  return isRecent(latest?.date || '', SKIP_SUPPRESS_DAYS);
}

function sameAsLast(history: ExerciseHistoryItem[], type: ExerciseType): boolean {
  const last = history[history.length - 1];
  if (!last) return false;
  return last.type === type;
}

function weeklyCapReached(history: ExerciseHistoryItem[]): boolean {
  const lastWeek = history.filter((h) => isRecent(h.date, 7));
  return lastWeek.length >= MAX_EXERCISES_PER_WEEK;
}

function buildCandidates(input: RouteExerciseInput): ExerciseCandidate[] {
  const text = String(input.text || '');
  const candidates: ExerciseCandidate[] = [];

  const rigidPatterns = [
    /I always/i, /I never/i, /I can'?t/i, /I'?m not .{1,20} enough/i,
    /I'?m too/i, /no one ever/i, /everyone always/i, /nothing ever/i, /I'?ll never/i,
  ];
  const rigidMatches = rigidPatterns.filter((p) => p.test(text));
  if (rigidMatches.length > 0) {
    candidates.push({ type: 'reframe', triggerScore: Math.min(rigidMatches.length * 3, 10), sourceData: { line: input.extractedLine } });
  }

  const hedges = text.match(/\b(kind of|sort of|I guess|maybe|I think|probably|not sure|I don'?t know)\b/gi) || [];
  const abruptEnd = text.length > 100 && !text.trim().match(/[.!?]$/);
  if (hedges.length >= 3 || abruptEnd) {
    candidates.push({ type: 'unsaid', triggerScore: Math.min(hedges.length * 2 + (abruptEnd ? 3 : 0), 10), sourceData: { hedgeCount: hedges.length, abruptEnd } });
  }

  const namedPeople = detectNamedPeople(text);
  if (namedPeople.length > 0 && /\b(angry|hurt|miss|love|hate|wish|forgive|resent|need|want)\b/i.test(text)) {
    candidates.push({ type: 'letter', triggerScore: 8, sourceData: { person: namedPeople[0] } });
  }

  if (/\b(should I|can'?t decide|torn|part of me|on the other hand|but then|or should|don'?t know (if|whether))\b/i.test(text)) {
    candidates.push({ type: 'compass', triggerScore: 7, sourceData: {} });
  }

  const tension = input.bodyEchoes.find((e) => ['chest', 'throat', 'stomach'].includes(e.region));
  const mood = String(input.moodLabel || '').toLowerCase();
  if (tension && (mood.includes('heavy') || mood.includes('anxious'))) {
    candidates.push({ type: 'somatic', triggerScore: 6, sourceData: { region: tension.region } });
  }

  const selfCritPatterns = [
    /I should(n'?t)? have/i, /I'?m so stupid/i, /I always mess/i,
    /what'?s wrong with me/i, /I hate myself/i, /I'?m such a/i,
    /can'?t believe I/i, /I'?m a (terrible|bad|horrible|awful)/i,
    /I don'?t deserve/i, /my fault/i,
  ];
  const selfCritMatches = selfCritPatterns.filter((p) => p.test(text));
  if (selfCritMatches.length > 0) {
    candidates.push({ type: 'witness', triggerScore: Math.min(selfCritMatches.length * 3, 10), sourceData: { line: input.extractedLine } });
  }

  if (/\b(reminds? me of|just like when|the same (way|thing)|I remember|when I was|used to|back then|as a (kid|child|teen))\b/i.test(text)) {
    candidates.push({ type: 'time_bridge', triggerScore: 7, sourceData: {} });
  }

  if (wordCount(text) > 200) {
    const sentences = splitSentences(text);
    const shifts = countMoodShifts(input.arc);
    if (sentences.length > 8 || shifts > 3) {
      candidates.push({ type: 'essence', triggerScore: 5, sourceData: { wordCount: wordCount(text), sentences: sentences.length } });
    }
  }

  return candidates;
}

export function routeExercises(input: RouteExerciseInput): ExerciseSelection {
  if (input.isCheckin) return { primary: null, secondary: null, skipOption: true };
  if (input.totalEntries < 5) return { primary: null, secondary: null, skipOption: true };

  const history = recentHistory();
  if (pausedByGlobalSkips(history)) return { primary: null, secondary: null, skipOption: true };
  if (weeklyCapReached(history)) return { primary: null, secondary: null, skipOption: true };

  const candidates = buildCandidates(input)
    .filter((candidate) => !suppressedType(history, candidate.type))
    .filter((candidate) => !sameAsLast(history, candidate.type))
    .sort((a, b) => b.triggerScore - a.triggerScore);

  if (!candidates.length) return { primary: null, secondary: null, skipOption: true };

  const primary = candidates[0] || null;
  let secondary: ExerciseCandidate | null = null;

  if (
    primary &&
    candidates.length > 1 &&
    candidates[1] &&
    candidates[1].triggerScore >= 6 &&
    !HEAVY_EXERCISES.includes(primary.type)
  ) {
    secondary = candidates[1];
  }

  return { primary, secondary, skipOption: true };
}

export function createSkippedResult(type: ExerciseType): ExerciseResult {
  return { type, date: nowIso(), completed: false };
}

export function buildExerciseContext(results: ExerciseResult[]): string {
  if (!results.length) return '';
  const completed = results.filter((r) => r.completed);
  if (!completed.length) return '';
  const chunks: string[] = [];

  for (const result of completed) {
    switch (result.type) {
      case 'reframe':
        if (result.originalLine && result.reframedLine) {
          chunks.push(`After writing, the user rewrote "${result.originalLine}" as "${result.reframedLine}".`);
        }
        break;
      case 'unsaid':
        if (result.unsaidText) chunks.push(`After writing, the user shared what they almost did not say: "${result.unsaidText}".`);
        break;
      case 'letter':
        if (result.personName && result.letterText) chunks.push(`The user wrote one sentence to ${result.personName}: "${result.letterText}".`);
        break;
      case 'compass':
        if (result.directionA && result.directionB) chunks.push(`The user named two directions: "${result.directionA}" and "${result.directionB}".`);
        break;
      case 'somatic':
        if (result.somaticRegion) chunks.push(`The user paused and breathed into their ${result.somaticRegion}.`);
        break;
      case 'witness':
        if (result.selfCriticalLine && result.compassionateResponse) {
          chunks.push(`For "${result.selfCriticalLine}", the user wrote compassionate words: "${result.compassionateResponse}".`);
        }
        break;
      case 'time_bridge':
        if (result.messageToYoungerSelf) chunks.push(`The user wrote to their younger self: "${result.messageToYoungerSelf}".`);
        break;
      case 'essence':
        if (result.words?.length) chunks.push(`The user distilled the entry into: ${result.words.join(', ')}.`);
        break;
    }
  }

  return chunks.join(' ');
}

export function extractPastPresentLines(text: string): { pastLine: string; presentLine: string } {
  const lines = splitSentences(text);
  const pastLine = lines.find((line) => /\b(when I was|used to|back then|as a (kid|child|teen)|I remember)\b/i.test(line)) || '';
  const presentLine = lines.find((line) => /\b(now|today|lately|right now|this week|currently)\b/i.test(line)) || lines.find((line) => /\b(reminds? me|same way|just like)\b/i.test(line)) || '';
  return { pastLine, presentLine };
}

export function pickSelfCriticalLine(text: string, fallback: string): string {
  const lines = splitSentences(text);
  const line = lines.find((entry) => /I should(n'?t)? have|I'?m so stupid|I always mess|what'?s wrong with me|I hate myself|I'?m such a|can't believe I|my fault/i.test(entry));
  return line || fallback || '';
}

export function selectLetterName(text: string): string {
  return detectNamedPeople(text)[0] || 'them';
}

export function getSomaticRegion(bodyEchoes: BodyEcho[]): BodyEcho['region'] {
  const preferred = bodyEchoes.find((echo) => ['chest', 'throat', 'stomach'].includes(echo.region));
  return preferred?.region || bodyEchoes[0]?.region || 'whole';
}
