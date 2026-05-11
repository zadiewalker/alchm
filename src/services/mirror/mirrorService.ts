import { collection, query, orderBy, limit, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import { getApiUrl, hasExternalApiBaseUrl } from '@/utils/api';
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
  const delayedReturn = await loadMirrorReturnState(userId).catch(() => ({ state: 'empty' as const }));
  const sessionCount = mem?.sessionCount ?? 0;

  if (sessionCount < 3) {
    return buildEmptyMirrorData(sessionCount, delayedReturn);
  }

  const sessionsRef = collection(db, 'users', userId, 'sessions');
  const q = query(sessionsRef, orderBy('createdAt', 'desc'), limit(10));
  const sessionsSnap = await getDocs(q);

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
    dominantTone: mem?.dominantTone ?? null,
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
  userId: string,
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

  if (!hasExternalApiBaseUrl()) {
    return getFallbackObservation(mirrorData.dominantTone);
  }

  try {
    const response = await fetch(getApiUrl('/api/khepera/mirror-observation'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        context: {
          sessionCount: mirrorData.sessionCount,
          dominantTone: mirrorData.dominantTone,
          toneTrajectory: mirrorData.toneShift,
          recurringThemes: mirrorData.recurringThemes,
          seedContext: mirrorData.openSeeds[0] ?? '',
          dataWindow: `${mirrorData.sessionCount} sessions`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Mirror observation request failed: ${response.status}`);
    }

    const data = (await response.json()) as { observation?: string };
    return data.observation?.trim() || getFallbackObservation(mirrorData.dominantTone);
  } catch {
    return getFallbackObservation(mirrorData.dominantTone);
  }
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
    anxiety:    { clarity: 'Something has settled.', tenderness: 'Something has softened.' },
    grief:      { clarity: 'Something is lifting.', processing: 'Something is moving again.' },
    numbness:   { processing: 'Something is waking up.', anger: 'Something is finding its voice.' },
    anger:      { tenderness: 'Something is gentling.', clarity: 'Something is clarifying.' },
    processing: { clarity: 'Something has landed.', tenderness: 'Something has softened.' },
  };
  return map[from]?.[to] ?? 'Something has shifted.';
}

function getFallbackObservation(tone: string): string {
  const fallbacks: Record<string, string> = {
    anxiety: 'There\'s a lot being carried here. Something keeps returning, and returning is its own kind of honesty.',
    grief: 'Something tender lives in this writing. It hasn\'t resolved — but it has been witnessed.',
    processing: 'There is movement in this writing. Not toward an answer, but toward something more honest than silence.',
    clarity: 'Something has shifted in how this space is being used. The writing has changed texture.',
    numbness: 'The writing is here even when feeling isn\'t. That means something.',
    tenderness: 'Something soft keeps finding its way onto the page. That isn\'t accidental.',
    anger: 'There is something alive in this writing. Something that knows it deserves more than it\'s gotten.',
    ambivalence: 'Two things keep arriving together. Neither is winning. That\'s worth noticing.',
  };
  return fallbacks[tone] ?? 'Something keeps returning to this space. That matters.';
}
