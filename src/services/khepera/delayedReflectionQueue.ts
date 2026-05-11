import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import { generateSafeKheperaResponse, extractThemesForKheperaEntry } from '@/services/khepera/service';
import { analyzeEntry } from '@/services/khepera/analyzeEntry';
import { generateReflection } from '@/services/khepera/generateReflection';
import { updateKheperaMemory } from '@/services/khepera/memory';
import { combineKheperaResponse } from '@/utils/khepera';
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
  userId: string,
  job: PendingDelayedReflectionJob,
): Promise<void> {
  await setDoc(delayedReflectionRef(userId, job.entryId), {
    entryId: job.entryId,
    emotionalTone: job.emotionalTone,
    themeTags: job.themeTags,
    scheduledAt: Timestamp.fromDate(job.scheduledAt),
    status: 'pending',
    createdAt: serverTimestamp(),
  });
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
  userId: string,
  context: KheperaUserContext,
  now = new Date(),
): Promise<number> {
  const jobsRef = collection(getFirestoreDb(), 'users', userId, 'kheperaDelayedReflections');
  const readySnapshot = await getDocs(query(
    jobsRef,
    where('status', '==', 'pending'),
    where('scheduledAt', '<=', Timestamp.fromDate(now)),
    limit(3),
  ));
  let completed = 0;

  for (const jobDoc of readySnapshot.docs) {
    const job = jobDoc.data();
    const entryId = typeof job.entryId === 'string' ? job.entryId : jobDoc.id;
    const sessionRef = doc(getFirestoreDb(), 'users', userId, 'sessions', entryId);
    const sessionSnap = await getDoc(sessionRef);
    if (!sessionSnap.exists()) {
      continue;
    }

    const session = sessionSnap.data();
    const entryText = typeof session.entryText === 'string' ? session.entryText : '';
    if (!entryText.trim()) {
      continue;
    }

    const response = await generateSafeKheperaResponse({
      entryText,
      userContext: context,
      userId,
      reflectionTiming: 'delayed_return',
    });
    const kheperaResponse = combineKheperaResponse(response);
    await setDoc(sessionRef, {
      kheperaResponse,
      seed: response.seed,
      delayedReflectionReturnedAt: serverTimestamp(),
    }, { merge: true });

    extractThemesForKheperaEntry(entryText, kheperaResponse)
      .then(({ themes, tone }) => {
        const analysis = analyzeEntry(entryText, tone);
        const reflection = generateReflection({ entryText, analysis, context, currentThemes: themes });
        return Promise.all([
          setDoc(sessionRef, { emotionalTone: tone, themes }, { merge: true }),
          updateKheperaMemory(userId, themes, tone, {
            stance: reflection.stance,
            styleProfile: reflection.styleProfile,
            lastReturnType: 'delayed',
          }),
        ]);
      })
      .catch(() => {});

    await updateDoc(jobDoc.ref, {
      status: 'completed',
      completedAt: serverTimestamp(),
    });
    completed += 1;
  }

  return completed;
}

function splitStoredResponse(kheperaResponse: string, seed: string): KheperaResponse {
  const [witness = '', perspective = ''] = kheperaResponse.split(/\n\n+/);
  return {
    witness: witness.trim(),
    perspective: perspective.trim(),
    seed: seed.trim(),
  };
}
