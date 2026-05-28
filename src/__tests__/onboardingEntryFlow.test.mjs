import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSubmissionTone } from '../utils/journalTone.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('active onboarding routes first use directly into /journal/new and keeps crisis resources visible', () => {
  const onboardingFlow = read('app/onboarding/flow.tsx');
  const splashPage = read('app/page.tsx');

  assert.ok(onboardingFlow.includes("router.replace('/journal/new')"));
  assert.ok(onboardingFlow.includes('In crisis? Resources'));
  assert.ok(splashPage.includes('Crisis support available'));
  assert.ok(splashPage.includes('988'));
});

test('/journal/new remains safe without an active container', () => {
  const entryPage = read('app/journal/new/page.tsx');
  const journalFlow = read('components/journal/JournalFlow.tsx');

  assert.ok(entryPage.includes("import { JournalFlow }"));
  assert.ok(entryPage.includes('<JournalFlow />'));
  assert.ok(journalFlow.includes('useJournal()'));
  assert.ok(journalFlow.includes('thresholdQuestion'));
});

test('submit path preserves local save, crisis detection, then model call', () => {
  const pipeline = read('services/journal/submissionPipeline.ts');
  const processor = read('services/journal/processQueuedEntry.ts');
  const saveIndex = pipeline.indexOf('await deps.saveToQueue(queuedEntry);');
  const crisisIndex = pipeline.indexOf('if (deps.detectCrisisSignals(text))');
  const processorCrisisIndex = processor.indexOf('hasCrisisSignals = deps.detectCrisisSignals(entry.entryText);');
  const modelIndex = processor.indexOf('await deps.generateSafeKheperaResponse({');

  assert.ok(saveIndex !== -1);
  assert.ok(crisisIndex !== -1);
  assert.ok(processorCrisisIndex !== -1);
  assert.ok(modelIndex !== -1);
  assert.ok(saveIndex < crisisIndex);
  assert.ok(processorCrisisIndex < modelIndex);
});

test('submission tone resolves to a valid EmotionalTone and fallback is not user-facing', () => {
  const journalFlow = read('components/journal/JournalFlow.tsx');

  assert.equal(resolveSubmissionTone(null), 'processing');
  assert.equal(resolveSubmissionTone('anxious'), 'anxiety');
  assert.equal(resolveSubmissionTone('tender'), 'tenderness');
  assert.equal(resolveSubmissionTone('numb'), 'numbness');
  assert.equal(resolveSubmissionTone('okay'), 'processing');

  assert.equal(/>\s*processing\s*</i.test(journalFlow), false);
  assert.equal(/processing/i.test(read('app/onboarding/flow.tsx')), false);
});
