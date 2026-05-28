import { collection, query, orderBy, limit, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import { sanitizeKheperaMemoryDoc } from '@/services/khepera/memory';
import { loadMirrorReturnState } from '@/services/khepera/delayedReflectionQueue';
import type { MirrorData, ArcPoint, ThreadData, ToneShift } from '@/types/mirror';

const THEME_LABELS: Record<string, string> = {
  grief_loss: 'grief & loss',
  relationship_tension: 'relationships',
  self_worth: 'self-worth',
  identity: 'identity',
  work_purpose: 'work & purpose',
  fear_uncertainty: 'fear & uncertainty',
  anger_injustice: 'anger',
  body_health: 'body & health',
  creativity_expression: 'creativity',
  spirituality_meaning: 'meaning',
  rest_recovery: 'rest & recovery',
  joy_gratitude: 'joy',
  transition_change: 'change & transition',
  boundary_setting: 'boundaries',
  childhood_origin: 'roots & origins',
};

export async function loadMirrorData(userId: string): Promise<MirrorData> {
  const db = getFirestoreDb();
  const memRef = doc(db, 'users', userId, 'khepera', 'memory');
  const memSnap = await getDoc(memRef);
  const mem = memSnap.exists() ? sanitizeKheperaMemoryDoc(memSnap.data()) : null;
  const sessionsRef = collection(db, 'users', userId, 'sessions');
  const q = query(sessionsRef, orderBy('createdAt', 'desc'), limit(10));
  const sessionsSnap = await getDocs(q);
  const delayedReturn = await loadMirrorReturnState(userId).catch(() => ({ state: 'empty' as const }));
  const sessionCount = sessionsSnap.size;

  if (sessionCount < 3) {
    return buildEmptyMirrorData(sessionCount, delayedReturn);
  }

  const arc: ArcPoint[] = sessionsSnap.docs
    .map(d => ({
      sessionId: d.id,
      sessionDate: d.data().createdAt?.toDate() ?? new Date(),
      tone: d.data().emotionalTone ?? 'processing',
      themes: d.data().themes ?? [],
    }))
    .reverse();

  const themeCount: Record<string, number> = {};
  const themeLastSeen: Record<string, Date> = {};
  arc.forEach(point => {
    point.themes.forEach(theme => {
      themeCount[theme] = (themeCount[theme] ?? 0) + 1;
      themeLastSeen[theme] = point.sessionDate;
    });
  });

  const recurringThemes: ThreadData[] = Object.entries(themeCount)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([theme, count]) => ({
      theme,
      label: THEME_LABELS[theme] ?? theme,
      count,
      lastSeen: themeLastSeen[theme],
    }));

  const toneShift = detectToneShift(arc);

  const openSeeds: MirrorData['openSeeds'] = [];

  return {
    arc,
    dominantTone: mem?.emotionalTone ?? null,
    toneShift,
    recurringThemes,
    allThemes: Object.keys(themeCount),
    openSeeds,
    kheperaObservation: null,
    observationGeneratedAt: null,
    delayedReturn,
    sessionCount,
    hasEnoughData: true,
    isLoading: false,
    error: null,
  };
}

export async function clearKheperaMemory(userId: string): Promise<void> {
  const db = getFirestoreDb();
  await deleteDoc(doc(db, 'users', userId, 'khepera', 'memory'));
}

export async function generateMirrorObservation(
  _userId: string,
  cachedObservation: string | null,
  cachedAt: Date | null,
  mirrorData: {
    recurringThemes: string[];
    dominantTone: string;
    toneShift: string | null;
    sessionCount: number;
    openSeeds: string[];
  }
): Promise<string> {
  if (cachedObservation && cachedAt) {
    const hoursOld = (Date.now() - cachedAt.getTime()) / (1000 * 60 * 60);
    if (hoursOld < 48) {
      return cachedObservation;
    }
  }

  // Mirror observation remains local until it is covered by the authenticated gateway contract.
  return getFallbackObservation(mirrorData.dominantTone);
}

function buildEmptyMirrorData(
  sessionCount: number,
  delayedReturn: MirrorData['delayedReturn'] = { state: 'empty' },
): MirrorData {
  return {
    arc: [],
    dominantTone: null,
    toneShift: null,
    recurringThemes: [],
    allThemes: [],
    openSeeds: [],
    kheperaObservation: null,
    observationGeneratedAt: null,
    delayedReturn,
    sessionCount,
    hasEnoughData: false,
    isLoading: false,
    error: null,
  };
}

function detectToneShift(arc: ArcPoint[]): ToneShift | null {
  if (arc.length < 6) return null;
  const recent = arc.slice(-3).map(p => p.tone);
  const prior = arc.slice(-6, -3).map(p => p.tone);
  const recentMode = modeOf(recent);
  const priorMode = modeOf(prior);
  if (recentMode === priorMode) return null;
  return { from: priorMode, to: recentMode, message: buildShiftMessage(priorMode, recentMode) };
}

function modeOf(arr: string[]): string {
  const freq: Record<string, number> = {};
  arr.forEach(v => { freq[v] = (freq[v] ?? 0) + 1; });
  return Object.entries(freq).sort(([, a], [, b]) => b - a)[0][0];
}

function buildShiftMessage(from: string, to: string): string {
  const map: Record<string, Record<string, string>> = {
    anxiety:    { clarity: 'Something feels quieter here.', tenderness: 'Something feels softer here.' },
    grief:      { clarity: 'Something feels a little more spacious here.', processing: 'Something remains in motion here.' },
    numbness:   { processing: 'Something has become more visible here.', anger: 'Something protective feels present here.' },
    anger:      { tenderness: 'Something feels softer here.', clarity: 'Something feels clearer here.' },
    processing: { clarity: 'Something feels more settled here.', tenderness: 'Something feels softer here.' },
  };
  return map[from]?.[to] ?? 'Something feels different here.';
}

function getFallbackObservation(tone: string): string {
  const fallbacks: Record<string, string> = {
    anxiety: 'A familiar heaviness seems to remain nearby.',
    grief: 'Something tender remains close to this writing.',
    processing: 'Something here still seems to be unfolding.',
    clarity: 'The writing feels a little more spacious here.',
    numbness: 'The writing remains here, even when feeling is quiet.',
    tenderness: 'Something soft seems to stay near the page.',
    anger: 'Something protective still seems present here.',
    ambivalence: 'More than one feeling seems to be sharing the space.',
  };
  return fallbacks[tone] ?? 'Something in this writing remains nearby.';
}
