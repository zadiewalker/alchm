import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
const { createMirrorMemoryObservation, buildMirrorFirestoreModel } = jiti('../memory.ts');
const { formMirrorPatterns } = jiti('../patternFormation.ts');
const { detectMirrorMovements } = jiti('../movementDetection.ts');
const { interpretMirrorNarrative } = jiti('../narrativeIntelligence.ts');
const { composeMirrorSyntheses } = jiti('../synthesis.ts');
const { planMirrorRetrieval } = jiti('../retrieval.ts');
const { validateMirrorLanguage } = jiti('../safety.ts');

function observation(id, monthOffset, fields) {
  const observedAt = new Date(Date.UTC(2026, monthOffset, 1)).toISOString();
  return createMirrorMemoryObservation({
    id,
    observedAt,
    source: {
      sessionId: id,
      derivedFrom: 'kheperaReflection',
    },
    ...fields,
  });
}

const scenarios = {
  recurringGrief: [
    observation('grief-1', 0, { themes: { grief: 0.8 }, emotionalLandscapes: { loneliness: 0.6 }, emotionalCharge: 0.75, reflectiveClarity: 0.25 }),
    observation('grief-2', 2, { themes: { grief: 0.75 }, emotionalLandscapes: { resilience: 0.4 }, emotionalCharge: 0.55, reflectiveClarity: 0.45 }),
    observation('grief-3', 4, { themes: { grief: 0.7 }, emotionalLandscapes: { resilience: 0.55 }, emotionalCharge: 0.42, reflectiveClarity: 0.62 }),
  ],
  emergingConfidence: [
    observation('confidence-1', 0, { emotionalLandscapes: { confidence: 0.35 }, identityNarratives: { seeker: 0.4 }, reflectiveClarity: 0.35 }),
    observation('confidence-2', 1, { emotionalLandscapes: { confidence: 0.65 }, identityNarratives: { creator: 0.6 }, reflectiveClarity: 0.72 }),
  ],
  longTermUncertainty: [
    observation('uncertainty-1', 0, { themes: { uncertainty: 0.7 }, recurringQuestions: { whatMattersNow: 0.6 }, lifeTensions: { certaintyVsPossibility: 0.7 } }),
    observation('uncertainty-2', 3, { themes: { uncertainty: 0.72 }, recurringQuestions: { whatMattersNow: 0.68 }, lifeTensions: { certaintyVsPossibility: 0.74 } }),
  ],
  relationshipTension: [
    observation('relationship-1', 0, { themes: { trust: 0.6, connection: 0.5 }, lifeTensions: { autonomyVsConnection: 0.7 } }),
    observation('relationship-2', 2, { themes: { trust: 0.66, connection: 0.56 }, lifeTensions: { autonomyVsConnection: 0.76 } }),
  ],
  identityTransition: [
    observation('identity-1', 0, { themes: { identity: 0.52 }, identityNarratives: { achiever: 0.7 }, reflectiveClarity: 0.35 }),
    observation('identity-2', 4, { themes: { identity: 0.72 }, identityNarratives: { creator: 0.7 }, reflectiveClarity: 0.78 }),
  ],
  burnoutRecovery: [
    observation('burnout-1', 0, { themes: { burnout: 0.8 }, emotionalLandscapes: { overwhelm: 0.85 }, emotionalCharge: 0.88, reflectiveClarity: 0.22 }),
    observation('burnout-2', 3, { themes: { burnout: 0.68 }, emotionalLandscapes: { resilience: 0.55 }, emotionalCharge: 0.45, reflectiveClarity: 0.61 }),
  ],
  belongingTheme: [
    observation('belonging-1', 0, { themes: { belonging: 0.65 }, identityNarratives: { outsider: 0.65 } }),
    observation('belonging-2', 4, { themes: { belonging: 0.68 }, identityNarratives: { seeker: 0.52 } }),
  ],
  selfCriticismTransformation: [
    observation('self-worth-1', 0, { themes: { selfWorth: 0.86 }, recurringQuestions: { amIEnough: 0.8 }, emotionalCharge: 0.9, reflectiveClarity: 0.22 }),
    observation('self-worth-2', 2, { themes: { selfWorth: 0.76 }, recurringQuestions: { amIEnough: 0.7 }, emotionalCharge: 0.54, reflectiveClarity: 0.58 }),
    observation('self-worth-3', 5, { themes: { selfWorth: 0.66 }, recurringQuestions: { canITrustMyself: 0.64 }, emotionalCharge: 0.38, reflectiveClarity: 0.82 }),
  ],
};

function buildMirrorResult(memoryState) {
  const patterns = formMirrorPatterns(memoryState, '2026-06-01T00:00:00.000Z');
  const movements = detectMirrorMovements(patterns, memoryState, '2026-06-01T00:00:00.000Z');
  const narrative = interpretMirrorNarrative(patterns, movements, 'recent months');
  const syntheses = composeMirrorSyntheses(patterns, movements, narrative);

  return { patterns, movements, narrative, syntheses };
}

test('Mirror memory schema stores derived understanding instead of journal excerpts', () => {
  const model = buildMirrorFirestoreModel('user-1');
  const result = buildMirrorResult(scenarios.recurringGrief);
  const serializedObservations = JSON.stringify(scenarios.recurringGrief);

  assert.equal(model.observations, 'users/user-1/mirror/observations');
  assert.doesNotMatch(serializedObservations, /entryText|raw|excerpt|quote/i);
  assert.match(JSON.stringify(result), /grief/);
});

test('movement detection prioritizes softening and integration over frequency', () => {
  const result = buildMirrorResult(scenarios.selfCriticismTransformation);
  const movementKinds = result.movements.map((movement) => movement.kind);

  assert.ok(movementKinds.includes('integration') || movementKinds.includes('softening') || movementKinds.includes('transformation'));
  assert.ok(result.syntheses.some((synthesis) => (
    synthesis.kind === 'thingsBecomingClearer'
    || synthesis.kind === 'emotionalWeather'
    || synthesis.kind === 'momentsOfTransformation'
  )));
});

test('recurring questions and tensions become reflective syntheses, not metrics', () => {
  const result = buildMirrorResult(scenarios.longTermUncertainty);
  const text = result.syntheses.map((synthesis) => `${synthesis.title}\n${synthesis.body}`).join('\n');

  assert.match(text, /Questions That Keep Returning|Recurring Tensions/);
  assert.doesNotMatch(text, /score|percentage|streak|dashboard|trend/i);
});

test('narrative intelligence stays tentative across all example scenarios', () => {
  for (const [name, memoryState] of Object.entries(scenarios)) {
    const result = buildMirrorResult(memoryState);
    const safety = validateMirrorLanguage(result.narrative.language);

    assert.equal(safety.ok, true, `${name} narrative should remain safe`);
    assert.match(result.narrative.language, /may|possible|appears|seems/i);
  }
});

test('retrieval avoids longitudinal interpretation during elevated risk', () => {
  const result = buildMirrorResult(scenarios.recurringGrief);
  const plan = planMirrorRetrieval({
    elevatedRisk: true,
    patterns: result.patterns,
    observations: scenarios.recurringGrief,
  });

  assert.equal(plan.shouldRetrieve, false);
  assert.match(plan.rationale.join('\n'), /safety/i);
});

test('retrieval uses derived pattern relevance when memory is appropriate', () => {
  const result = buildMirrorResult(scenarios.belongingTheme);
  const plan = planMirrorRetrieval({
    currentThemes: ['belonging'],
    patterns: result.patterns,
    observations: scenarios.belongingTheme,
  });

  assert.equal(plan.shouldRetrieve, true);
  assert.ok(plan.observationIds.length > 0);
  assert.doesNotMatch(JSON.stringify(plan), /journal|entryText|excerpt/i);
});
