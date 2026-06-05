import type { QueuedEntry } from '@/types/journal';
import { recordOperationalException } from '@/services/monitoring/telemetry';
import { buildQueueClaim, isQueueLeaseActive } from './queueLease';

const DATABASE_NAME = 'alchm_submission_queue';
const DATABASE_VERSION = 1;
const STORE_NAME = 'entries';
const LEGACY_DATABASE_NAME = 'keyval-store';
const LEGACY_STORE_NAME = 'keyval';
const QUEUE_PREFIX = 'alchm_queue_';
const MAX_QUEUE_SIZE = 50;
export const MAX_SYNC_ATTEMPTS = 5;
const RETRY_BACKOFF_MS = 5_000;
let legacyQueueMigrationPromise: Promise<void> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isEmotionalTone(value: unknown): value is QueuedEntry['dominantTone'] {
  return value === 'processing'
    || value === 'grief'
    || value === 'anger'
    || value === 'anxiety'
    || value === 'clarity'
    || value === 'numbness'
    || value === 'tenderness'
    || value === 'ambivalence';
}

function isQueueStatus(value: unknown): value is QueuedEntry['status'] {
  return value === 'pending_khepera'
    || value === 'delayed_return'
    || value === 'pending_sync'
    || value === 'syncing'
    || value === 'failed'
    || value === 'complete';
}

function isQueuedEntry(value: unknown): value is QueuedEntry {
  if (!isRecord(value)) return false;
  return typeof value.localId === 'string'
    && typeof value.entryText === 'string'
    && typeof value.sessionCount === 'number'
    && Array.isArray(value.recurringThemes)
    && value.recurringThemes.every((theme) => typeof theme === 'string')
    && isEmotionalTone(value.dominantTone)
    && (typeof value.userId === 'string' || value.userId === null)
    && typeof value.writtenAt === 'string'
    && isQueueStatus(value.status)
    && typeof value.syncAttempts === 'number';
}

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('indexeddb_unavailable'));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onerror = () => reject(request.error ?? new Error('indexeddb_open_failed'));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

function openLegacyDatabase(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('indexeddb_unavailable'));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LEGACY_DATABASE_NAME);
    let createdDuringOpen = false;
    request.onerror = () => reject(request.error ?? new Error('legacy_indexeddb_open_failed'));
    request.onupgradeneeded = () => {
      createdDuringOpen = true;
    };
    request.onsuccess = () => {
      const db = request.result;
      if (createdDuringOpen || !db.objectStoreNames.contains(LEGACY_STORE_NAME)) {
        db.close();
        resolve(null);
        return;
      }
      resolve(db);
    };
  });
}

async function readValue(key: string): Promise<unknown> {
  const db = await openDatabase();
  return new Promise<unknown>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key);
    request.onerror = () => reject(request.error ?? new Error('indexeddb_read_failed'));
    request.onsuccess = () => resolve(request.result);
  }).finally(() => db.close());
}

function readLegacyKeys(db: IDBDatabase): Promise<IDBValidKey[]> {
  return new Promise<IDBValidKey[]>((resolve, reject) => {
    const request = db.transaction(LEGACY_STORE_NAME, 'readonly').objectStore(LEGACY_STORE_NAME).getAllKeys();
    request.onerror = () => reject(request.error ?? new Error('legacy_indexeddb_keys_failed'));
    request.onsuccess = () => resolve(request.result);
  });
}

function readLegacyValue(db: IDBDatabase, key: string): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    const request = db.transaction(LEGACY_STORE_NAME, 'readonly').objectStore(LEGACY_STORE_NAME).get(key);
    request.onerror = () => reject(request.error ?? new Error('legacy_indexeddb_read_failed'));
    request.onsuccess = () => resolve(request.result);
  });
}

async function readQueueEntry(key: string): Promise<QueuedEntry | undefined> {
  const value = await readValue(key);
  return isQueuedEntry(value) ? value : undefined;
}

async function writeValue(key: string, value: QueuedEntry): Promise<void> {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(value, key);
    request.onerror = () => reject(request.error ?? new Error('indexeddb_write_failed'));
    request.onsuccess = () => resolve();
  }).finally(() => db.close());
}

async function deleteValue(key: string): Promise<void> {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(key);
    request.onerror = () => reject(request.error ?? new Error('indexeddb_delete_failed'));
    request.onsuccess = () => resolve();
  }).finally(() => db.close());
}

async function readKeys(): Promise<IDBValidKey[]> {
  const db = await openDatabase();
  return new Promise<IDBValidKey[]>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAllKeys();
    request.onerror = () => reject(request.error ?? new Error('indexeddb_keys_failed'));
    request.onsuccess = () => resolve(request.result);
  }).finally(() => db.close());
}

async function migrateLegacyQueueEntries(): Promise<void> {
  try {
    const legacyDb = await openLegacyDatabase();
    if (!legacyDb) return;

    try {
      const keys = (await readLegacyKeys(legacyDb)).filter((key) => String(key).startsWith(QUEUE_PREFIX));
      for (const key of keys) {
        const queueKey = String(key);
        const legacyEntry = await readLegacyValue(legacyDb, queueKey);
        if (!isQueuedEntry(legacyEntry)) continue;
        const existing = await readQueueEntry(queueKey);
        if (!existing) await writeValue(queueKey, legacyEntry);
      }
    } finally {
      legacyDb.close();
    }
  } catch (error) {
    recordOperationalException('sync_issue', error, { state: 'legacy_queue_migration_failed' });
  }
}

async function ensureLegacyQueueMigrated(): Promise<void> {
  if (!legacyQueueMigrationPromise) {
    legacyQueueMigrationPromise = migrateLegacyQueueEntries();
  }
  await legacyQueueMigrationPromise;
}

function getBackoffMs(syncAttempts: number): number {
  const exponent = Math.max(0, Math.min(syncAttempts, 4));
  return RETRY_BACKOFF_MS * (2 ** exponent);
}

function isRetryReady(entry: QueuedEntry): boolean {
  if (entry.syncAttempts >= MAX_SYNC_ATTEMPTS) return false;
  if (!entry.lastSyncAttempt) return true;
  const lastAttempt = Date.parse(entry.lastSyncAttempt);
  return Number.isNaN(lastAttempt) || Date.now() - lastAttempt >= getBackoffMs(entry.syncAttempts);
}

export async function saveToQueue(entry: QueuedEntry): Promise<void> {
  await ensureLegacyQueueMigrated();
  const existing = await readQueueEntry(`${QUEUE_PREFIX}${entry.localId}`);
  if (!existing && await isQueueOverLimit()) {
    throw new Error('queue_capacity_reached');
  }
  await writeValue(`${QUEUE_PREFIX}${entry.localId}`, entry);
}

export async function claimQueueEntry(localId: string, owner: string): Promise<QueuedEntry | null> {
  try {
    await ensureLegacyQueueMigrated();
    const key = `${QUEUE_PREFIX}${localId}`;
    const db = await openDatabase();
    return await new Promise<QueuedEntry | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      let claimed: QueuedEntry | null = null;
      const request = store.get(key);

      request.onerror = () => reject(request.error ?? new Error('indexeddb_claim_read_failed'));
      request.onsuccess = () => {
        const existing = isQueuedEntry(request.result) ? request.result : undefined;
        if (!existing || existing.status === 'complete' || existing.status === 'failed') {
          claimed = existing ?? null;
          return;
        }
        claimed = buildQueueClaim(existing, owner);
        if (claimed) {
          store.put(claimed, key);
        }
      };
      transaction.oncomplete = () => resolve(claimed);
      transaction.onerror = () => reject(transaction.error ?? new Error('indexeddb_claim_failed'));
      transaction.onabort = () => reject(transaction.error ?? new Error('indexeddb_claim_aborted'));
    }).finally(() => db.close());
  } catch (error) {
    recordOperationalException('sync_issue', error, { localId, state: 'queue_claim_failed' });
    return null;
  }
}

export async function verifyQueueClaim(localId: string, owner: string): Promise<boolean> {
  try {
    await ensureLegacyQueueMigrated();
    const entry = await readQueueEntry(`${QUEUE_PREFIX}${localId}`);
    return Boolean(entry && entry.processingOwner === owner && isQueueLeaseActive(entry));
  } catch (error) {
    recordOperationalException('sync_issue', error, { localId, state: 'queue_claim_verification_failed' });
    return false;
  }
}

export async function releaseQueueEntry(localId: string, owner: string, updates: Partial<QueuedEntry> = {}): Promise<void> {
  try {
    await ensureLegacyQueueMigrated();
    const key = `${QUEUE_PREFIX}${localId}`;
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onerror = () => reject(request.error ?? new Error('indexeddb_release_read_failed'));
      request.onsuccess = () => {
        const existing = isQueuedEntry(request.result) ? request.result : undefined;
        if (!existing || (existing.processingOwner && existing.processingOwner !== owner)) return;
        store.put({
          ...existing,
          ...updates,
          processingOwner: undefined,
          processingLeaseExpiresAt: undefined,
        }, key);
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('indexeddb_release_failed'));
      transaction.onabort = () => reject(transaction.error ?? new Error('indexeddb_release_aborted'));
    }).finally(() => db.close());
  } catch (error) {
    recordOperationalException('sync_issue', error, { localId, state: 'queue_release_failed' });
    throw error;
  }
}

export async function updateQueueEntry(localId: string, updates: Partial<QueuedEntry>): Promise<void> {
  try {
    await ensureLegacyQueueMigrated();
    const key = `${QUEUE_PREFIX}${localId}`;
    const existing = await readQueueEntry(key);
    if (existing) await writeValue(key, { ...existing, ...updates });
  } catch (error) {
    recordOperationalException('sync_issue', error, { localId, state: 'queue_update_failed' });
    throw error;
  }
}

export async function removeFromQueue(localId: string): Promise<void> {
  try {
    await ensureLegacyQueueMigrated();
    await deleteValue(`${QUEUE_PREFIX}${localId}`);
  } catch (error) {
    recordOperationalException('sync_issue', error, { localId, state: 'queue_remove_failed' });
  }
}

export async function getQueuedEntry(localId: string): Promise<QueuedEntry | null> {
  try {
    await ensureLegacyQueueMigrated();
    return await readQueueEntry(`${QUEUE_PREFIX}${localId}`) ?? null;
  } catch {
    return null;
  }
}

export async function getAllQueuedEntries(): Promise<QueuedEntry[]> {
  try {
    await ensureLegacyQueueMigrated();
    const keys = (await readKeys()).filter((key) => String(key).startsWith(QUEUE_PREFIX));
    const entries = await Promise.all(keys.map((key) => readQueueEntry(String(key))));
    return entries
      .filter((entry): entry is QueuedEntry => entry != null)
      .sort((left, right) => new Date(left.writtenAt).getTime() - new Date(right.writtenAt).getTime());
  } catch {
    return [];
  }
}

export async function getPendingEntries(): Promise<QueuedEntry[]> {
  const all = await getAllQueuedEntries();
  return all.filter((entry) =>
    (entry.status === 'pending_khepera' || entry.status === 'pending_sync' || (entry.status === 'syncing' && !isQueueLeaseActive(entry)))
    && isRetryReady(entry)
  );
}

export async function getQueueCount(): Promise<number> {
  return (await getPendingEntries()).length;
}

export async function isQueueOverLimit(): Promise<boolean> {
  const all = await getAllQueuedEntries();
  return all.filter((entry) => entry.status !== 'complete').length >= MAX_QUEUE_SIZE;
}
