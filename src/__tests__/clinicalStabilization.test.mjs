import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('live journal route delegates only to the canonical journal flow', () => {
  const source = read('app/journal/new/page.tsx');

  assert.match(source, /JournalFlow/);
  assert.doesNotMatch(source, /lib\/crisisDetection|lib\/api\/aiAnalysisApi|lib\/subscription|localStorage|sessionStorage|firebase|firestore/i);
});

test('crisis processing returns resources before any Khepera generation branch', () => {
  const pipeline = read('services/journal/submissionPipeline.ts');
  const processor = read('services/journal/processQueuedEntry.ts');
  const detector = read('services/khepera/crisisDetection.ts');
  const primaryGate = pipeline.indexOf('if (deps.detectCrisisSignals(text))');
  const generationDelegation = pipeline.indexOf('await processQueuedEntry(');
  const replayGate = processor.indexOf('hasCrisisSignals = deps.detectCrisisSignals(entry.entryText);');
  const replayGeneration = processor.indexOf('await deps.generateSafeKheperaResponse({');

  assert.ok(primaryGate !== -1 && generationDelegation !== -1 && primaryGate < generationDelegation);
  assert.ok(replayGate !== -1 && replayGeneration !== -1 && replayGate < replayGeneration);
  assert.match(detector, /988/);
  assert.match(pipeline.slice(primaryGate, generationDelegation), /submissionState: 'crisis_blocked'/);
});

test('Khepera memory remains minimized and client persistence is disabled', () => {
  const typeSource = read('types/khepera.ts');
  const memorySource = read('services/khepera/memory.ts');
  const schema = typeSource.slice(typeSource.indexOf('export interface KheperaMemory'), typeSource.indexOf('}', typeSource.indexOf('export interface KheperaMemory')) + 1);

  assert.match(schema, /themeTags: ThemeTag\[\]/);
  assert.match(schema, /emotionalTone: EmotionalTone/);
  assert.doesNotMatch(schema, /sessionCount|recentStyles|recentStances|lastReturnType|seed|entryText/);
  assert.doesNotMatch(memorySource, /setDoc/);
  assert.doesNotMatch(memorySource, /serverTimestamp|recentStyles|recentStances|lastReturnType|openSeeds/);
});

test('queue completion requires confirmed server persistence and redacts local raw text', () => {
  const source = read('services/journal/processQueuedEntry.ts');
  const completionSource = read('services/offline/queueLease.ts');
  const persistenceProof = source.indexOf('if (!serverPersistenceConfirmed)');
  const completion = source.lastIndexOf('buildCompletedQueueUpdate(');

  assert.ok(persistenceProof !== -1 && completion !== -1);
  assert.ok(persistenceProof < completion);
  assert.doesNotMatch(source, /deps\.setDoc|deps\.updateKheperaMemory/);
  assert.match(completionSource, /status: 'complete'/);
  assert.match(completionSource, /entryText: ''/);
});

test('sanctuary activation is server-routed while later continuity mutations remain fail closed', () => {
  const source = read('services/containers/containerService.ts');
  const authority = read('config/containerAuthority.ts');
  const opening = read('app/containers/[id]/opening/OpeningRitualClient.tsx');
  const ceremony = read('app/containers/[id]/ceremony/CompletionCeremonyClient.tsx');

  assert.match(authority, /SERVER_SANCTUARY_ACTIVATION_IMPLEMENTED = true/);
  assert.match(authority, /SERVER_SANCTUARY_ADVANCEMENT_IMPLEMENTED = true/);
  assert.match(authority, /CONTAINER_TRANSITIONS_AVAILABLE = false/);
  assert.match(authority, /Container transitions are unavailable until server-authoritative continuity evidence is complete/);
  assert.match(source, /httpsCallable/);
  assert.match(source, /activateContainer/);
  assert.match(source, /CONTAINER_TRANSITIONS_UNAVAILABLE/);
  assert.match(source, /containerState', 'active'/);
  assert.doesNotMatch(source, /runTransaction|updateDoc|serverTimestamp/);
  assert.doesNotMatch(source, /missedDays/);
  assert.match(opening, /secure continuity handling is being verified/);
  assert.match(ceremony, /secure continuity handling is being verified/);
});

test('legacy pathways and generated completion reflection paths are quarantined', () => {
  const layout = read('app/pathways/layout.tsx');
  const arc = read('services/containers/arcGeneration.ts');

  assert.match(layout, /router\.replace\('\/containers\/'\)/);
  assert.doesNotMatch(layout, /children/);
  assert.doesNotMatch(arc, /generateCompanionText|firestore|emotionalTone|recurringThemes/);
  assert.match(arc, /no need to catch up/i);
});
