import type { QueuedEntry } from '@/types/journal';
import { recordOperationalException } from '@/services/monitoring/telemetry';

type QueueStorage = {
  get<T = unknown>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  keys(): Promise<unknown[]>;
};

// Dynamic import with fallback to mock implementation
async function getIDBKeyval(): Promise<QueueStorage> {
  try {
    return await import('idb-keyval') as QueueStorage;
  } catch {
    recordOperationalException('sync_issue', new Error('queue_idb_unavailable'), { state: 'queue_fallback_mock' });
    return await import('./idbKeyvalMock') as QueueStorage;
  }
}

const QUEUE_PREFIX = 'alchm_queue_';
const MAX_QUEUE_SIZE = 50;       // Safety limit — 50 unsynced entries
export const MAX_SYNC_ATTEMPTS = 5;     // Stop retrying after 5 failures
const PROCESSING_LEASE_MS = 45_000;
const RETRY_BACKOFF_MS = 5_000;

function getBackoffMs(syncAttempts: number): number {
  const exponent = Math.max(0, Math.min(syncAttempts, 4));
  return RETRY_BACKOFF_MS * (2 ** exponent);
}

function isLeaseActive(entry: QueuedEntry, owner?: string): boolean {
  if (!entry.processingLeaseExpiresAt) {
    return false;
  }

  const leaseExpiresAt = Date.parse(entry.processingLeaseExpiresAt);
  if (Number.isNaN(leaseExpiresAt) || leaseExpiresAt <= Date.now()) {
    return false;
  }

  return owner ? entry.processingOwner !== owner : true;
}

function isRetryReady(entry: QueuedEntry): boolean {
  if (entry.syncAttempts >= MAX_SYNC_ATTEMPTS) {
    return false;
  }

  if (!entry.lastSyncAttempt) {
    return true;
  }

  const lastAttempt = Date.parse(entry.lastSyncAttempt);
  if (Number.isNaN(lastAttempt)) {
    return true;
  }

  return Date.now() - lastAttempt >= getBackoffMs(entry.syncAttempts);
}

// ─── WRITE ───────────────────────────────────────────────────────────────────

export async function saveToQueue(entry: QueuedEntry): Promise<void> {
  const { set } = await getIDBKeyval();
  await set(`${QUEUE_PREFIX}${entry.localId}`, entry);
}

export async function claimQueueEntry(localId: string, owner: string): Promise<QueuedEntry | null> {
  try {
    const { get, set } = await getIDBKeyval();
    const key = `${QUEUE_PREFIX}${localId}`;
    const existing = await get(key) as QueuedEntry | undefined;
    if (!existing || existing.status === 'complete' || existing.status === 'failed') {
      return existing ?? null;
    }

    if (isLeaseActive(existing, owner)) {
      return null;
    }

    const claimed: QueuedEntry = {
      ...existing,
      processingOwner: owner,
      processingLeaseExpiresAt: new Date(Date.now() + PROCESSING_LEASE_MS).toISOString(),
    };
    await set(key, claimed);
    return claimed;
  } catch (err) {
    recordOperationalException('sync_issue', err, { localId, state: 'queue_claim_failed' });
    return null;
  }
}

export async function releaseQueueEntry(
  localId: string,
  owner: string,
  updates: Partial<QueuedEntry> = {}
): Promise<void> {
  try {
    const { get, set } = await getIDBKeyval();
    const key = `${QUEUE_PREFIX}${localId}`;
    const existing = await get(key) as QueuedEntry | undefined;
    if (!existing) {
      return;
    }

    if (existing.processingOwner && existing.processingOwner !== owner) {
      return;
    }

    await set(key, {
      ...existing,
      ...updates,
      processingOwner: undefined,
      processingLeaseExpiresAt: undefined,
    });
  } catch (err) {
    recordOperationalException('sync_issue', err, { localId, state: 'queue_release_failed' });
  }
}

export async function updateQueueEntry(
  localId: string,
  updates: Partial<QueuedEntry>
): Promise<void> {
  try {
    const { get, set } = await getIDBKeyval();
    const existing = await get(`${QUEUE_PREFIX}${localId}`) as QueuedEntry | undefined;
    if (existing) {
      await set(`${QUEUE_PREFIX}${localId}`, { ...existing, ...updates });
    }
  } catch (err) {
    recordOperationalException('sync_issue', err, { localId, state: 'queue_update_failed' });
  }
}

export async function removeFromQueue(localId: string): Promise<void> {
  try {
    const { del } = await getIDBKeyval();
    await del(`${QUEUE_PREFIX}${localId}`);
  } catch (err) {
    recordOperationalException('sync_issue', err, { localId, state: 'queue_remove_failed' });
  }
}

// ─── READ ────────────────────────────────────────────────────────────────────

export async function getQueuedEntry(localId: string): Promise<QueuedEntry | null> {
  try {
    const { get } = await getIDBKeyval();
    return await get(`${QUEUE_PREFIX}${localId}`) as QueuedEntry ?? null;
  } catch {
    return null;
  }
}

export async function getAllQueuedEntries(): Promise<QueuedEntry[]> {
  try {
    const { keys, get } = await getIDBKeyval();
    const allKeys = await keys();
    const queueKeys = allKeys.filter((k: unknown) => String(k).startsWith(QUEUE_PREFIX));
    const entries = await Promise.all(
      queueKeys.map((k: unknown) => get(k as string) as Promise<QueuedEntry>)
    );
    return entries
      .filter((e): e is QueuedEntry => e != null)
      .sort((a, b) => new Date(a.writtenAt).getTime() - new Date(b.writtenAt).getTime());
  } catch {
    return [];
  }
}

export async function getPendingEntries(): Promise<QueuedEntry[]> {
  const all = await getAllQueuedEntries();
  return all.filter(e =>
    (e.status === 'pending_khepera' || e.status === 'pending_sync' || (e.status === 'syncing' && !isLeaseActive(e)))
    && isRetryReady(e)
  );
}

export async function getQueueCount(): Promise<number> {
  const pending = await getPendingEntries();
  return pending.length;
}

// ─── QUEUE HEALTH ────────────────────────────────────────────────────────────

export async function isQueueOverLimit(): Promise<boolean> {
  const all = await getAllQueuedEntries();
  return all.filter(e => e.status !== 'complete').length >= MAX_QUEUE_SIZE;
}
