import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
const { buildUnifiedCognitiveContext, COGNITIVE_BOUNDARIES, mirrorThemeToThemeTag } = jiti('../ecosystem.ts');
const { getContainerContext } = jiti('../../containers/contextEngine.ts');
const { composeKheperaPromptPlan } = jiti('../../khepera/cognition/promptComposer.ts');

const mirrorPattern = {
  id: 'theme:identity',
  kind: 'theme',
  key: 'identity',
  label: 'identity',
  firstSeenAt: '2026-01-01T00:00:00Z',
  lastSeenAt: '2026-06-01T00:00:00Z',
  observationIds: ['obs-1', 'obs-2', 'obs-3'],
  evidenceStrength: 0.5,
  recency: 0.9,
  persistence: 0.8,
  ambiguityScore: 0.35,
  confidenceScore: 0.7,
  confidence: 'moderate',
  language: 'identity appears to recur as a theme to notice, not a conclusion about the user.',
};

const mirrorMovement = {
  id: 'theme:identity:integration',
  patternId: 'theme:identity',
  kind: 'integration',
  observedAt: '2026-06-02T00:00:00Z',
  confidence: 'moderate',
  evidence: ['relatedObservations=3'],
  language: 'identity appears to be becoming easier to hold with clarity.',
};

test('unified cognition boundaries separate Journal, Container, Khepera, Mirror, and Memory ownership', () => {
  const owners = new Set(COGNITIVE_BOUNDARIES.map((boundary) => boundary.owner));

  assert.deepEqual(owners, new Set(['journal', 'container', 'khepera', 'mirror', 'memory']));
  assert.ok(COGNITIVE_BOUNDARIES.find((boundary) => boundary.owner === 'journal')?.mayStore.includes('raw journal text in the journal record'));
  assert.ok(COGNITIVE_BOUNDARIES.find((boundary) => boundary.owner === 'mirror')?.mustNotStore.includes('raw journal text'));
  assert.ok(COGNITIVE_BOUNDARIES.find((boundary) => boundary.owner === 'container')?.mustNotStore.includes('behind/ahead state'));
});

test('mirror and container themes translate into Khepera-safe theme tags without raw memory transfer', () => {
  const context = buildUnifiedCognitiveContext({
    entryText: "I'm exhausted and don't know who I'm becoming anymore.",
    currentTone: 'ambivalence',
    currentThemes: ['rest_recovery'],
    activeContainer: getContainerContext('identity-transition'),
    mirrorPatterns: [mirrorPattern],
    mirrorMovements: [mirrorMovement],
  });

  assert.equal(mirrorThemeToThemeTag('identity'), 'identity');
  assert.ok(context.kheperaInput.currentThemes.includes('identity'));
  assert.ok(context.kheperaInput.currentThemes.includes('fear_uncertainty'));
  assert.ok(context.kheperaInput.currentThemes.includes('rest_recovery'));
  assert.equal(context.storagePolicy.rawEntryText, 'provider-only');
  assert.equal(context.storagePolicy.derivedMemoryOnly, true);
  assert.equal(context.containerInfluence?.containerId, 'identity-transition');
  assert.deepEqual(context.mirrorFocus.movementKinds, ['emergence', 'transformation', 'integration']);
});

test('unified context can feed Khepera while preserving safety override behavior', () => {
  const context = buildUnifiedCognitiveContext({
    entryText: 'I feel panic and everything feels loud.',
    crisisDetected: false,
    activeContainer: getContainerContext('burnout-recovery'),
    mirrorPatterns: [mirrorPattern],
    mirrorMovements: [mirrorMovement],
  });
  const plan = composeKheperaPromptPlan(context.kheperaInput);

  assert.equal(plan.assessment.riskLevel, 'elevated');
  assert.equal(plan.memoryRetrieval.shouldRetrieve, false);
  assert.equal(plan.interventionDecision.selectedIntervention, 'regulation');
  assert.match(plan.safetyConstraints.join('\n'), /Prioritize stabilization/i);
});
