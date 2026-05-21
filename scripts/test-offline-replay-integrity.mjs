#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { repoRoot } from './release-utils.mjs';

function fail(message) {
  console.error(`Offline replay integrity check failed: ${message}`);
  process.exit(1);
}

const localQueue = readFileSync(resolve(repoRoot, 'src/services/offline/localQueue.ts'), 'utf8');
const queueReplay = readFileSync(resolve(repoRoot, 'src/services/journal/queueReplay.ts'), 'utf8');
const bootstrap = readFileSync(resolve(repoRoot, 'src/components/QueueReplayBootstrap.tsx'), 'utf8');

const requiredLocalQueuePatterns = [
  ['bounded queue size', 'MAX_QUEUE_SIZE'],
  ['max sync attempts', 'MAX_SYNC_ATTEMPTS'],
  ['processing lease', 'PROCESSING_LEASE_MS'],
  ['retry backoff', 'getBackoffMs'],
  ['deterministic ordering', ".sort((a, b) => new Date(a.writtenAt).getTime() - new Date(b.writtenAt).getTime())"],
  ['durability warning', 'queue_durability_warning'],
  ['durable persistence unavailable telemetry', 'durable_persistence_unavailable'],
];

for (const [label, pattern] of requiredLocalQueuePatterns) {
  if (!localQueue.includes(pattern)) {
    fail(`missing ${label} evidence in localQueue.ts`);
  }
}

const requiredReplayPatterns = [
  ['in-flight guard', 'replayInFlight'],
  ['offline guard', 'isBrowserOffline()'],
  ['bounded replay batch', 'MAX_REPLAY_BATCH_SIZE'],
  ['claim before replay', 'claimQueueEntry'],
  ['retry exhaustion telemetry', 'queue_replay_exhausted'],
  ['backlog telemetry', 'queue_replay_backlog'],
  ['auth-blocked classification', 'auth_required'],
];

for (const [label, pattern] of requiredReplayPatterns) {
  if (!queueReplay.includes(pattern)) {
    fail(`missing ${label} evidence in queueReplay.ts`);
  }
}

if (!bootstrap.includes('queue_replay_bootstrap_import_failed')) {
  fail('QueueReplayBootstrap must surface dynamic import failures to telemetry');
}

console.log('Offline replay integrity check passed.');
