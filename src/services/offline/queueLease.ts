import type { QueuedEntry } from '../../types/journal';

export const PROCESSING_LEASE_MS = 45_000;

export function isQueueLeaseActive(
  entry: Pick<QueuedEntry, 'processingOwner' | 'processingLeaseExpiresAt'>,
  now: number = Date.now(),
  competingOwner?: string,
): boolean {
  if (!entry.processingLeaseExpiresAt) {
    return false;
  }

  const expiresAt = Date.parse(entry.processingLeaseExpiresAt);
  if (Number.isNaN(expiresAt) || expiresAt <= now) {
    return false;
  }

  return competingOwner ? entry.processingOwner !== competingOwner : true;
}

export function buildQueueClaim(
  entry: QueuedEntry,
  owner: string,
  now: number = Date.now(),
): QueuedEntry | null {
  if (entry.status === 'complete' || entry.status === 'failed' || isQueueLeaseActive(entry, now, owner)) {
    return null;
  }

  return {
    ...entry,
    processingOwner: owner,
    processingLeaseExpiresAt: new Date(now + PROCESSING_LEASE_MS).toISOString(),
  };
}

export function buildCompletedQueueUpdate(
  entry: Pick<QueuedEntry, 'localId'>,
  userId: string,
  syncedAt: string,
): Pick<QueuedEntry, 'status' | 'entryText' | 'firestoreId' | 'syncedAt' | 'userId'> {
  return {
    status: 'complete',
    entryText: '',
    firestoreId: entry.localId,
    syncedAt,
    userId,
  };
}
