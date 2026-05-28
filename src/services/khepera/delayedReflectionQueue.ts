import { collection, doc, getDoc, getDocs, limit, query, Timestamp, where } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import type { EmotionalTone, ThemeTag } from '@/types/journal';
import type { KheperaResponse, KheperaUserContext } from '@/types/khepera';
import type { MirrorReturnState } from '@/types/mirror';

export type DelayedReflectionStatus = 'pending' | 'ready' | 'completed';

export type PendingDelayedReflectionJob = {
  entryId: string;
  emotionalTone: EmotionalTone;
  themeTags: ThemeTag[];
  scheduledAt: Date;
};

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (value && typeof value === 'object' && typeof (value as { toDate?: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}

function delayedReflectionRef(userId: string, entryId: string) {
  return doc(getFirestoreDb(), 'users', userId, 'kheperaDelayedReflections', entryId);
}

export async function scheduleDelayedReflection(
  _userId: string,
  _job: PendingDelayedReflectionJob,
): Promise<void> {
  throw new Error('Delayed reflections are unavailable until server-authoritative persistence is implemented.');
}

export async function loadMirrorReturnState(userId: string): Promise<MirrorReturnState> {
  const jobsRef = collection(getFirestoreDb(), 'users', userId, 'kheperaDelayedReflections');
  const completedSnapshot = await getDocs(query(jobsRef, where('status', '==', 'completed'), limit(1)));
  const completed = completedSnapshot.docs[0];
  if (completed) {
    const data = completed.data();
    const entryId = typeof data.entryId === 'string' ? data.entryId : completed.id;
    const sessionSnap = await getDoc(doc(getFirestoreDb(), 'users', userId, 'sessions', entryId));
    const session = sessionSnap.exists() ? sessionSnap.data() : {};
    const response = typeof session.kheperaResponse === 'string' && typeof session.seed === 'string'
      ? splitStoredResponse(session.kheperaResponse, session.seed)
      : null;
    return { state: 'returned', entryId, response };
  }

  const pendingSnapshot = await getDocs(query(jobsRef, where('status', 'in', ['pending', 'ready']), limit(1)));
  const pending = pendingSnapshot.docs[0];
  if (pending) {
    return {
      state: 'waiting',
      scheduledAt: toDate(pending.data().scheduledAt),
    };
  }

  return { state: 'empty' };
}

export async function processReadyDelayedReflections(
  _userId: string,
  _context: KheperaUserContext,
  _now = new Date(),
): Promise<number> {
  throw new Error('Delayed reflections are unavailable until server-authoritative persistence is implemented.');
}

function splitStoredResponse(kheperaResponse: string, seed: string): KheperaResponse {
  const [witness = '', perspective = ''] = kheperaResponse.split(/\n\n+/);
  return {
    witness: witness.trim(),
    perspective: perspective.trim(),
    seed: seed.trim(),
  };
}
