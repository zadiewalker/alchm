import test from 'node:test';
import assert from 'node:assert/strict';
import { importTypeScriptModule } from './nodeTsResolveLoader.mjs';

const {
  buildCompletedQueueUpdate,
  buildQueueClaim,
  isQueueLeaseActive,
} = await importTypeScriptModule('../services/offline/queueLease.ts', import.meta.url);

function pendingEntry() {
  return {
    localId: 'submission-1',
    entryText: 'private words held only for required submission',
    sessionCount: 0,
    recurringThemes: [],
    dominantTone: 'processing',
    userId: 'user-1',
    writtenAt: '2026-05-24T10:00:00.000Z',
    status: 'pending_khepera',
    syncAttempts: 0,
  };
}

test('two queue processors cannot both claim an active lease', () => {
  const now = Date.parse('2026-05-24T10:00:00.000Z');
  const first = buildQueueClaim(pendingEntry(), 'processor-a', now);
  assert.ok(first);
  assert.equal(isQueueLeaseActive(first, now + 1), true);
  assert.equal(buildQueueClaim(first, 'processor-b', now + 1), null);
});

test('expired queue lease becomes retryable', () => {
  const now = Date.parse('2026-05-24T10:00:00.000Z');
  const first = buildQueueClaim(pendingEntry(), 'processor-a', now);
  assert.ok(first);
  const retry = buildQueueClaim(first, 'processor-b', now + 60_000);
  assert.ok(retry);
  assert.equal(retry.processingOwner, 'processor-b');
});

test('completed queue updates redact raw text and use submission ID for remote identity', () => {
  const update = buildCompletedQueueUpdate(pendingEntry(), 'user-1', '2026-05-24T10:02:00.000Z');
  assert.equal(update.status, 'complete');
  assert.equal(update.entryText, '');
  assert.equal(update.firestoreId, 'submission-1');
});
