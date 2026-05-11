export type BodyEchoRegion = 'head' | 'throat' | 'chest' | 'shoulders' | 'stomach' | 'hands' | 'legs' | 'whole';
export type ArcShape = 'descending' | 'ascending' | 'valley' | 'peak' | 'oscillating' | 'flat';
export type PostEntryStage = 'dissolution' | 'exercise' | 'reflection' | 'return';
import type { ExerciseResult } from '@/lib/postEntryExercises';

export interface BodyEcho {
  region: BodyEchoRegion;
  sensation: string;
  sourcePhrase: string;
}

export interface EmotionalPoint {
  sentenceIndex: number;
  sentence: string;
  valence: number; // -1..1
  x: number; // 0..1
  y: number; // 0..1 (0 is high/light, 1 is low/heavy)
}

export interface PostEntryData {
  entryId: string;
  bodyEchoes: BodyEcho[];
  emotionalArc: EmotionalPoint[];
  extractedLine: string;
  arcShape: ArcShape;
  exerciseResults?: ExerciseResult[];
}

const HEAVY_WORDS = [
  'hate', "can't", 'never', 'always', 'hurt', 'pain', 'alone', 'scared', 'afraid', 'angry', 'lost', 'broken', 'empty',
  'numb', 'heavy', 'tired', 'exhausted', 'sick', 'worst', 'failed', 'failing', 'hopeless', 'pointless', 'trapped',
  'suffocating', 'drowning', 'sinking', 'dark', 'nothing', 'nobody', 'worthless',
];

const LIGHT_WORDS = [
  'hope', 'better', 'okay', 'love', 'warm', 'safe', 'peace', 'calm', 'light', 'free', 'open', 'strong', 'brave',
  'enough', 'grateful', 'beautiful', 'gentle', 'soft', 'trust', 'heal', 'healing', 'growth', 'breathe', 'forward',
];

const SOMATIC_PATTERNS: Array<{ pattern: RegExp; region: BodyEchoRegion; sensation: string }> = [
  { pattern: /mind.*(rac|spin|buzz|loud|quiet|fog)/i, region: 'head', sensation: 'racing' },
  { pattern: /head.*(ache|throb|pound|heavy|light|spin)/i, region: 'head', sensation: 'throbbing' },
  { pattern: /can'?t.*(think|focus|concentrate)/i, region: 'head', sensation: 'foggy' },
  { pattern: /thoughts?.*(won'?t stop|keep coming|spiral)/i, region: 'head', sensation: 'spiraling' },

  { pattern: /throat.*(tight|closed|lump|chok)/i, region: 'throat', sensation: 'tight' },
  { pattern: /can'?t.*(speak|say|voice|swallow)/i, region: 'throat', sensation: 'blocked' },
  { pattern: /words?.*(stuck|won'?t come|trapped)/i, region: 'throat', sensation: 'stuck' },
  { pattern: /scream/i, region: 'throat', sensation: 'screaming' },

  { pattern: /chest.*(tight|heavy|press|ache|burn|hollow|open|warm|cold|pain)/i, region: 'chest', sensation: 'tight' },
  { pattern: /heart.*(race|pound|ache|break|heavy|sink|full|open|warm)/i, region: 'chest', sensation: 'pounding' },
  { pattern: /can'?t.*(breathe|breath|get air)/i, region: 'chest', sensation: 'constricted' },
  { pattern: /breath.*(short|shallow|stuck|held)/i, region: 'chest', sensation: 'held' },
  { pattern: /fist.*(in|behind|inside).*(chest|sternum|ribs)/i, region: 'chest', sensation: 'clenched' },

  { pattern: /shoulder.*(tight|tense|heavy|carry|weight|knot|stiff)/i, region: 'shoulders', sensation: 'carrying' },
  { pattern: /carry.*(weight|world|everything|burden)/i, region: 'shoulders', sensation: 'heavy' },
  { pattern: /neck.*(stiff|tight|pain|tense)/i, region: 'shoulders', sensation: 'stiff' },
  { pattern: /tens(e|ion).*(neck|shoulder|upper back)/i, region: 'shoulders', sensation: 'tense' },

  { pattern: /stomach.*(tight|knot|churn|sick|hollow|pit|drop|flutter|nause)/i, region: 'stomach', sensation: 'knotted' },
  { pattern: /gut.*(feeling|punch|wrench|twist)/i, region: 'stomach', sensation: 'wrenching' },
  { pattern: /nause|sick to my/i, region: 'stomach', sensation: 'nauseous' },
  { pattern: /butterfl/i, region: 'stomach', sensation: 'fluttering' },
  { pattern: /hollow/i, region: 'stomach', sensation: 'hollow' },
  { pattern: /hungry|empty|pit/i, region: 'stomach', sensation: 'empty' },

  { pattern: /hand.*(shake|shaking|trembl|clench|fist|cold|sweat|numb|tingle)/i, region: 'hands', sensation: 'shaking' },
  { pattern: /fist.*(clench|squeeze|tight)/i, region: 'hands', sensation: 'clenched' },
  { pattern: /grip/i, region: 'hands', sensation: 'gripping' },

  { pattern: /leg.*(weak|heavy|shak|restless|numb|jelly)/i, region: 'legs', sensation: 'weak' },
  { pattern: /can'?t.*(stand|walk|move|run)/i, region: 'legs', sensation: 'frozen' },
  { pattern: /feet.*(heavy|planted|rooted|cold|numb)/i, region: 'legs', sensation: 'heavy' },
  { pattern: /ground|grounded/i, region: 'legs', sensation: 'grounded' },

  { pattern: /body.*(heavy|light|numb|tingl|vibrat|exhaust|alive|electric)/i, region: 'whole', sensation: 'heavy' },
  { pattern: /everywhere|all over|head to toe/i, region: 'whole', sensation: 'everywhere' },
  { pattern: /can'?t.*(feel|move|stop)/i, region: 'whole', sensation: 'frozen' },
  { pattern: /exhausted|drained|wiped|spent/i, region: 'whole', sensation: 'drained' },
  { pattern: /numb/i, region: 'whole', sensation: 'numb' },
];

export function detectBodyEchoes(entryText: string): BodyEcho[] {
  const text = String(entryText || '');
  if (!text.trim()) return [];
  const echoes: BodyEcho[] = [];
  const seen = new Set<BodyEchoRegion>();
  for (const item of SOMATIC_PATTERNS) {
    if (seen.has(item.region)) continue;
    const match = text.match(item.pattern);
    if (!match) continue;
    echoes.push({ region: item.region, sensation: item.sensation, sourcePhrase: match[0] });
    seen.add(item.region);
  }
  return echoes;
}

export function splitSentences(entryText: string): string[] {
  return String(entryText || '')
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
}

function scoreSentiment(sentence: string): number {
  const words = sentence.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  let score = 0;
  for (const word of words) {
    if (HEAVY_WORDS.some((w) => word.includes(w))) score -= 1;
    if (LIGHT_WORDS.some((w) => word.includes(w))) score += 1;
  }
  if (/\b(not|don'?t|can'?t|won'?t|never|no)\b/i.test(sentence)) score -= 0.5;
  return Math.max(-1, Math.min(1, score / Math.max(words.length * 0.2, 1)));
}

export function generateEmotionalArc(entryText: string): EmotionalPoint[] {
  const sentences = splitSentences(entryText);
  if (sentences.length < 2) return [];
  return sentences.map((sentence, index) => {
    const valence = scoreSentiment(sentence);
    return {
      sentenceIndex: index,
      sentence,
      valence,
      x: sentences.length === 1 ? 0 : index / (sentences.length - 1),
      y: 0.5 - valence * 0.35,
    };
  });
}

export function classifyArcShape(points: EmotionalPoint[]): ArcShape {
  if (points.length < 3) return 'flat';
  const first = points[0]?.valence || 0;
  const last = points[points.length - 1]?.valence || 0;
  const vals = points.map((p) => p.valence);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min;
  if (range < 0.25) return 'flat';
  const slope = last - first;
  if (slope > 0.35) return 'ascending';
  if (slope < -0.35) return 'descending';
  const minIdx = vals.findIndex((v) => v === min);
  const maxIdx = vals.findIndex((v) => v === max);
  if (minIdx > 0 && minIdx < vals.length - 1 && maxIdx !== minIdx) return 'valley';
  if (maxIdx > 0 && maxIdx < vals.length - 1 && minIdx !== maxIdx) return 'peak';
  return 'oscillating';
}

export function truncate(text: string, max = 60): string {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

export function extractKeyLine(entryText: string): string | null {
  const sentences = splitSentences(entryText).filter((s) => s.length > 10 && s.split(/\s+/).length >= 4);
  if (sentences.length < 2) return null;
  const scored = sentences.map((sentence) => {
    let weight = 0;
    if (/^I\b/i.test(sentence)) weight += 2;
    if (/I (feel|felt|am|was|need|want|hate|love|miss|wish|remember|realize|know|don'?t know)/i.test(sentence)) weight += 3;
    if (/chest|heart|stomach|throat|body|breath|hands|shoulders/i.test(sentence)) weight += 2;
    if (/always|never|can'?t|won'?t|every|nothing|everything|still|anymore|finally/i.test(sentence)) weight += 2;
    if (/like|as if|feels like|reminds me of|same as/i.test(sentence)) weight += 3;
    if (/but|yet|even though|although|and yet|still/i.test(sentence)) weight += 2;
    const words = sentence.split(/\s+/).length;
    if (words <= 10) weight += 2;
    if (words > 30) weight -= 2;
    if (sentence === sentences[sentences.length - 1]) weight += 1;
    return { sentence, weight };
  });
  scored.sort((a, b) => b.weight - a.weight);
  return scored[0]?.sentence || null;
}

export function createPostEntryData(entryId: string, entryText: string): PostEntryData {
  const bodyEchoes = detectBodyEchoes(entryText);
  const emotionalArc = generateEmotionalArc(entryText);
  const extractedLine = extractKeyLine(entryText) || truncate(entryText, 120) || '';
  return {
    entryId,
    bodyEchoes,
    emotionalArc,
    extractedLine,
    arcShape: classifyArcShape(emotionalArc),
  };
}

export function isHeavyEntry(entry: { moodLabel?: string | null; wordCount: number; pathwayStep?: number | null }): boolean {
  const mood = String(entry.moodLabel || '').toLowerCase();
  const byMood = ['heavy', 'anxious', 'unnamed'].some((m) => mood.includes(m));
  const byLength = entry.wordCount > 150;
  const step = Number(entry.pathwayStep || 0);
  const byChallenge = step >= 11 && step <= 16;
  return byMood || byLength || byChallenge;
}

export function getPostEntrySequence(
  entry: { moodLabel?: string | null; wordCount: number; pathwayStep?: number | null; isCheckin?: boolean },
  _bodyEchoes: BodyEcho[],
  _arc: EmotionalPoint[],
  _extractedLine: string | null,
  hasExercises = false,
): PostEntryStage[] {
  if (entry.isCheckin) return ['reflection'];
  const stages: PostEntryStage[] = [];
  if (entry.wordCount >= 10) stages.push('dissolution');
  if (hasExercises) stages.push('exercise');
  stages.push('reflection');
  if (isHeavyEntry(entry)) stages.push('return');
  return stages;
}
