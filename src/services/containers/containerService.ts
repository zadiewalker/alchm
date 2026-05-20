import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import { getContainerDefinition } from '@/config/containerDefinitions';
import { getContainerPhase, CONTAINER_PHASES } from '@/config/containerArc';
import type { UserContainer, ActiveContainerState, ContainerContext } from '@/types/container';

export async function startContainer(
  userId: string,
  containerId: string,
  options: { hasTransformation?: boolean } = {}
): Promise<{ userContainerId: string }> {
  const db = getFirestoreDb();
  const definition = getContainerDefinition(containerId);
  if (!definition) throw new Error(`Container not found: ${containerId}`);
  if (definition.tier === 'transformation' && !options.hasTransformation) {
    throw new Error('Transformation required');
  }

  const activeContainersQuery = query(
    collection(db, 'users', userId, 'containers'),
    where('status', '==', 'active'),
    limit(1)
  );
  const activeContainersSnapshot = await getDocs(activeContainersQuery);
  if (!activeContainersSnapshot.empty) {
    throw new Error('An active container already exists');
  }

  const containerRef = doc(db, 'users', userId, 'containers', crypto.randomUUID());
  const userContainer: Omit<UserContainer, 'id'> = {
    userId,
    containerId,
    containerName: definition.name,
    tier: definition.tier,
    status: 'active',
    startedAt: serverTimestamp() as Timestamp,
    currentDay: 1,
    missedDays: [],
    sessionIds: [],
    completionCeremonyViewed: false,
  };

  await setDoc(containerRef, userContainer);
  return { userContainerId: containerRef.id };
}

export async function getActiveContainerState(
  userId: string,
  userContainerId: string
): Promise<ActiveContainerState | null> {
  const db = getFirestoreDb();
  const containerRef = doc(db, 'users', userId, 'containers', userContainerId);
  const snap = await getDoc(containerRef);
  if (!snap.exists()) return null;

  const uc = { id: snap.id, ...snap.data() } as UserContainer;
  if (uc.status !== 'active') return null;

  const definition = getContainerDefinition(uc.containerId);
  if (!definition) return null;

  // Advance day if needed (new calendar day since last entry)
  const advancedDay = computeCurrentDay(uc, definition.totalDays);
  if (advancedDay !== uc.currentDay) {
    await advanceDay(userId, userContainerId, uc.currentDay, advancedDay);
    uc.currentDay = advancedDay;
  }

  const dayConfig = definition.days.find(d => d.day === uc.currentDay);
  if (!dayConfig) return null;

  const phase = getContainerPhase(uc.currentDay);
  const phaseConfig = phase ? CONTAINER_PHASES[phase.lunarPhase as keyof typeof CONTAINER_PHASES] : CONTAINER_PHASES.grounding;

  const hasWrittenToday = uc.lastEntryAt
    ? isToday(toDate(uc.lastEntryAt))
    : false;

  return {
    definition,
    currentDay: uc.currentDay,
    phase: dayConfig.phase,
    phaseMetaphor: phaseConfig?.metaphor ?? 'Something present',
    todayPrompt: dayConfig.prompt,
    kheperaIntent: dayConfig.kheperaIntent,
    somaticAnchor: dayConfig.somaticAnchor,
    hasWrittenToday,
    status: uc.status,
    userContainerId: uc.id,
  };
}

export async function getActiveContainerStateForUser(userId: string): Promise<ActiveContainerState | null> {
  const db = getFirestoreDb();
  const activeContainersQuery = query(
    collection(db, 'users', userId, 'containers'),
    where('status', '==', 'active'),
    limit(1)
  );
  const activeContainersSnapshot = await getDocs(activeContainersQuery);
  if (activeContainersSnapshot.empty) return null;

  const activeContainerId = activeContainersSnapshot.docs[0]?.id;
  if (!activeContainerId) return null;

  return getActiveContainerState(userId, activeContainerId);
}

export async function getUserContainersForUser(userId: string): Promise<UserContainer[]> {
  const db = getFirestoreDb();
  const containersQuery = query(
    collection(db, 'users', userId, 'containers'),
    orderBy('startedAt', 'desc')
  );
  const containersSnapshot = await getDocs(containersQuery);

  return containersSnapshot.docs.map(containerDoc => ({
    id: containerDoc.id,
    ...containerDoc.data(),
  }) as UserContainer);
}

export function buildContainerContext(state: ActiveContainerState): ContainerContext {
  const phase = getContainerPhase(state.currentDay);
  return {
    containerId: state.definition.id,
    userContainerId: state.userContainerId,
    containerName: state.definition.name,
    clinicalIntent: state.definition.clinicalIntent,
    currentDay: state.currentDay,
    phase: state.phase,
    phaseArcNote: phase?.kheperaArcNote ?? '',
    todayPrompt: state.todayPrompt,
    kheperaIntent: state.kheperaIntent,
  };
}

export async function recordContainerEntry(
  userId: string,
  userContainerId: string,
  entryId: string
): Promise<void> {
  const db = getFirestoreDb();
  const containerRef = doc(db, 'users', userId, 'containers', userContainerId);
  const currentData = await getDoc(containerRef);
  const sessionIds = currentData.data()?.sessionIds || [];
  
  await updateDoc(containerRef, {
    lastEntryAt: serverTimestamp(),
    sessionIds: [...sessionIds, entryId],
  });
}

export async function completeContainer(
  userId: string,
  userContainerId: string,
  carryForward: string,
  leavingBehind: string
): Promise<void> {
  const db = getFirestoreDb();
  const containerRef = doc(db, 'users', userId, 'containers', userContainerId);
  await updateDoc(containerRef, {
    status: 'completed',
    completedAt: serverTimestamp(),
    carryForward,
    leavingBehind,
  });
}

// Private helpers
function computeCurrentDay(uc: UserContainer, totalDays: number): number {
  if (!uc.lastEntryAt) return uc.currentDay;
  if (isToday(toDate(uc.lastEntryAt))) return uc.currentDay;

  // New calendar day — advance by 1 (never more)
  const next = Math.min(uc.currentDay + 1, totalDays);
  return next;
}

async function advanceDay(userId: string, containerDocId: string, from: number, to: number): Promise<void> {
  const db = getFirestoreDb();
  const missed = Array.from({ length: to - from - 1 }, (_, i) => from + i + 1);
  const containerRef = doc(db, 'users', userId, 'containers', containerDocId);
  await updateDoc(containerRef, {
    currentDay: to,
    missedDays: missed.length ? missed : [],
  });
}

function isToday(date: Date): boolean {
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
}

function toDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }

  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}
