import { httpsCallable } from 'firebase/functions';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { getFirebaseFunctions, getFirestoreDb } from '@/services/firebase/firebaseService';
import { getContainerDefinition } from '@/config/containerDefinitions';
import { getContainerPhase, CONTAINER_PHASES } from '@/config/containerArc';
import { CONTAINER_TRANSITIONS_UNAVAILABLE } from '@/config/containerAuthority';
import type { UserContainer, ActiveContainerState, ContainerContext, ContainerStatus, ContainerTier, PersistedTimestamp } from '@/types/container';

function parseActivationResponse(value: unknown): { userContainerId: string } {
  if (
    !isRecord(value)
    || typeof value.userContainerId !== 'string'
    || value.userContainerId.length === 0
  ) {
    throw new Error('Container activation returned an invalid response.');
  }

  return { userContainerId: value.userContainerId };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPersistedTimestamp(value: unknown): value is PersistedTimestamp {
  return isRecord(value) && typeof value.toDate === 'function';
}

function isContainerStatus(value: unknown): value is ContainerStatus {
  return value === 'active' || value === 'paused' || value === 'completed' || value === 'abandoned';
}

function isContainerTier(value: unknown): value is ContainerTier {
  return value === 'sanctuary' || value === 'transformation';
}

function parseUserContainer(id: string, value: unknown): UserContainer | null {
  if (!isRecord(value)
    || typeof value.userId !== 'string'
    || typeof value.containerId !== 'string'
    || typeof value.containerName !== 'string'
    || !isContainerTier(value.tier)
    || !isContainerStatus(value.status)
    || !isPersistedTimestamp(value.startedAt)
    || typeof value.currentDay !== 'number'
    || !Array.isArray(value.sessionIds)
    || !value.sessionIds.every((sessionId) => typeof sessionId === 'string')
    || typeof value.completionCeremonyViewed !== 'boolean'
    || (value.completedAt !== undefined && !isPersistedTimestamp(value.completedAt))
    || (value.lastEntryAt !== undefined && !isPersistedTimestamp(value.lastEntryAt))
    || (value.carryForward !== undefined && typeof value.carryForward !== 'string')
    || (value.leavingBehind !== undefined && typeof value.leavingBehind !== 'string')) {
    return null;
  }

  return {
    id,
    userId: value.userId,
    containerId: value.containerId,
    containerName: value.containerName,
    tier: value.tier,
    status: value.status,
    startedAt: value.startedAt,
    completedAt: value.completedAt,
    currentDay: value.currentDay,
    lastEntryAt: value.lastEntryAt,
    sessionIds: value.sessionIds,
    completionCeremonyViewed: value.completionCeremonyViewed,
    carryForward: value.carryForward,
    leavingBehind: value.leavingBehind,
  };
}

export async function startContainer(
  _userId: string,
  containerId: string,
  _options: { hasTransformation?: boolean } = {}
): Promise<{ userContainerId: string }> {
  const invokeActivation = httpsCallable<{ containerId: string }, unknown>(
    getFirebaseFunctions(),
    'activateContainer',
  );
  const result = await invokeActivation({ containerId });
  return parseActivationResponse(result.data);
}

export async function getActiveContainerState(
  userId: string,
  userContainerId: string
): Promise<ActiveContainerState | null> {
  const db = getFirestoreDb();
  const containerRef = doc(db, 'users', userId, 'containers', userContainerId);
  const snap = await getDoc(containerRef);
  if (!snap.exists()) return null;

  const uc = parseUserContainer(snap.id, snap.data());
  if (!uc) return null;
  if (uc.status !== 'active') return null;

  const definition = getContainerDefinition(uc.containerId);
  if (!definition) return null;

  const dayConfig = definition.days.find(d => d.day === uc.currentDay);
  if (!dayConfig) return null;

  const phase = getContainerPhase(uc.currentDay);
  const phaseConfig = phase ? CONTAINER_PHASES[phase.lunarPhase as keyof typeof CONTAINER_PHASES] : CONTAINER_PHASES.grounding;

  const hasWrittenToday = uc.lastEntryAt
    ? isToday(uc.lastEntryAt.toDate())
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
  const activeState = await getDoc(doc(db, 'users', userId, 'containerState', 'active'));
  if (activeState.exists() && activeState.data().status === 'active') {
    const activeContainerId = activeState.data().userContainerId;
    if (typeof activeContainerId === 'string') {
      return getActiveContainerState(userId, activeContainerId);
    }
  }

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
  _userId: string,
  _userContainerId: string,
  _entryId: string
): Promise<void> {
  throw new Error(CONTAINER_TRANSITIONS_UNAVAILABLE);
}

export async function completeContainer(
  _userId: string,
  _userContainerId: string,
  _carryForward: string,
  _leavingBehind: string
): Promise<void> {
  throw new Error(CONTAINER_TRANSITIONS_UNAVAILABLE);
}

function isToday(date: Date): boolean {
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
}
