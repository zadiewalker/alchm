import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
const { getContainerContext } = jiti('../contextEngine.ts');
const { createInitialInquiries, evolveInquiry } = jiti('../inquiryEngine.ts');
const { inferContainerRelationshipState, relationshipStateIsPressureFree } = jiti('../relationshipState.ts');
const { createContainerMemoryRecord, buildContainerFirestoreModel, summarizeContainerMemoryForRetrieval } = jiti('../memory.ts');
const { buildKheperaContainerIntegration } = jiti('../kheperaIntegration.ts');
const { buildMirrorContainerIntegration } = jiti('../mirrorIntegration.ts');
const { buildContainerReentryExperience } = jiti('../reentry.ts');
const { validateContainerLanguage, validateReentryExperience, containerSafetyFramework } = jiti('../safety.ts');

test('container contexts act as lenses rather than content programs', () => {
  const burnout = getContainerContext('burnout-recovery');
  const identity = getContainerContext('identity-transition');
  const belonging = getContainerContext('belonging');

  assert.ok(burnout.activeThemes.includes('burnout'));
  assert.ok(burnout.developmentalPriorities.includes('restoration'));
  assert.ok(identity.activeThemes.includes('identity'));
  assert.ok(identity.developmentalPriorities.includes('liminality'));
  assert.ok(belonging.activeThemes.includes('connection'));
  assert.ok(belonging.developmentalPriorities.includes('belongingRepair'));
  assert.doesNotMatch(JSON.stringify(burnout), /lesson|module|streak|complete/i);
});

test('same entry receives different Khepera integration under different containers', () => {
  const burnout = buildKheperaContainerIntegration(getContainerContext('burnout-recovery'));
  const identity = buildKheperaContainerIntegration(getContainerContext('identity-transition'));
  const belonging = buildKheperaContainerIntegration(getContainerContext('belonging'));

  assert.ok(burnout.foregroundThemes.includes('burnout'));
  assert.ok(burnout.interventionBias.includes('regulation'));
  assert.ok(identity.foregroundThemes.includes('uncertainty'));
  assert.ok(identity.interventionBias.includes('exploration'));
  assert.ok(belonging.foregroundThemes.includes('connection'));
  assert.ok(belonging.interventionBias.includes('reflection'));
  assert.notDeepEqual(burnout.responseFormBias, identity.responseFormBias);
});

test('inquiry evolves without prompt progression or completion pressure', () => {
  const context = getContainerContext('self-compassion');
  const inquiries = createInitialInquiries(context, '2026-06-01T00:00:00Z');
  const returning = evolveInquiry(inquiries[0], 'returning', undefined, '2026-07-01T00:00:00Z');
  const integrating = evolveInquiry(inquiries[1], 'deepening', 'integration', '2026-07-02T00:00:00Z');

  assert.equal(inquiries.length, 3);
  assert.equal(returning.state, 'unresolved');
  assert.equal(integrating.state, 'integrating');
  assert.doesNotMatch(inquiries.map((inquiry) => inquiry.text).join('\n'), /assignment|lesson|complete/i);
});

test('relationship states make absence emotionally neutral', () => {
  const state = inferContainerRelationshipState({
    enteredAt: '2026-05-01T00:00:00Z',
    lastVisitedAt: '2026-05-02T00:00:00Z',
    memoryRecordCount: 2,
    integrationCount: 0,
    nowIso: '2026-06-01T00:00:00Z',
  });

  assert.equal(state, 'returning');
  assert.equal(relationshipStateIsPressureFree(state), true);
  assert.equal(relationshipStateIsPressureFree('resting'), true);
});

test('container memory stores derived abstractions only', () => {
  const context = getContainerContext('identity-transition');
  const relationship = {
    userContainerId: 'container-1',
    containerId: 'identity-transition',
    state: 'dwelling',
    enteredAt: '2026-06-01T00:00:00Z',
    activeInquiryIds: [],
    memoryRecordIds: [],
  };
  const record = createContainerMemoryRecord({
    id: 'memory-1',
    context,
    relationship,
    observedAt: '2026-06-02T00:00:00Z',
    sourceSessionId: 'session-1',
    unresolvedQuestions: ['What am I becoming?'],
    emergingQuestions: ['What am I carrying forward?'],
    momentsOfIntegration: ['uncertainty appears easier to hold'],
  });
  const summary = summarizeContainerMemoryForRetrieval([record]);
  const model = buildContainerFirestoreModel('user-1', 'container-1');
  const serialized = JSON.stringify({ record, summary, model });

  assert.equal(model.memory, 'users/user-1/containerRelationships/container-1/memory');
  assert.ok(record.recurringThemes.includes('identity'));
  assert.deepEqual(summary.unresolvedQuestions, ['What am I becoming?']);
  assert.doesNotMatch(serialized, /entryText|raw|excerpt|quote/i);
});

test('Mirror integration focuses on movement instead of participation metrics', () => {
  const mirror = buildMirrorContainerIntegration(getContainerContext('burnout-recovery'));
  const serialized = JSON.stringify(mirror);

  assert.ok(mirror.movementFocus.includes('softening'));
  assert.ok(mirror.synthesisFocus.includes('thingsBecomingClearer'));
  assert.match(mirror.recognitionQuestions.join('\n'), /What softened/);
  assert.doesNotMatch(mirror.recognitionQuestions.join('\n'), /streak|completion|percentage|progress|dashboard/i);
  assert.match(serialized, /Do not count visits/);
});

test('re-entry experience welcomes without correction', () => {
  const context = getContainerContext('belonging');
  const reentry = buildContainerReentryExperience(context, 'A thread about connection remains available.');
  const safety = validateReentryExperience(reentry);

  assert.equal(safety.ok, true);
  assert.match(reentry.headline, /still here/i);
  assert.doesNotMatch(`${reentry.headline}\n${reentry.invitation}\n${reentry.inquiry}`, /missed|behind|catch up|continue where you left off/i);
});

test('safety framework rejects pressure and diagnosis language', () => {
  assert.equal(validateContainerLanguage('You missed progress in this challenge.').ok, false);
  assert.equal(validateContainerLanguage('This space is still available when you want to enter it.').ok, true);
  assert.match(containerSafetyFramework().join('\n'), /organize attention/);
});
