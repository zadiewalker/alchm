import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
const { composeKheperaPromptPlan } = jiti('../promptComposer.ts');

const candidateMemory = {
  id: 'self-worth-loop',
  themes: ['self_worth'],
  emotionalTone: 'anxiety',
  progressionState: 'chronicLoop',
  recurrenceCount: 7,
  unresolvedLoopSignificance: 0.9,
  userStatedImportance: 0.7,
  lastSeenAt: '2026-05-25T12:00:00Z',
};

test('first-time grief favors witnessing without forcing pattern interpretation', () => {
  const plan = composeKheperaPromptPlan({
    entryText: 'I miss my father in ordinary moments. The grief is quieter but still here.',
    currentTone: 'grief',
    currentThemes: ['grief_loss'],
  });

  assert.equal(plan.patternIntelligence.progressionState, 'firstEncounter');
  assert.equal(plan.interventionDecision.selectedIntervention, 'witnessing');
  assert.equal(plan.interventionDecision.responseFormRecommendation, 'extendedWitnessing');
  assert.equal(plan.memoryRetrieval.shouldRetrieve, false);
  assert.match(plan.promptSummary, /intervention=witnessing/);
});

test('recurring shame loop allows a new angle without advice or raw memory retrieval', () => {
  const plan = composeKheperaPromptPlan({
    entryText: 'I am a failure again. I keep replaying the same conversation and I should be better by now.',
    currentTone: 'anxiety',
    currentThemes: ['self_worth'],
    longitudinalPatterns: [candidateMemory],
    memoryCandidates: [candidateMemory],
    recentResponses: [
      {
        interventionFamily: 'compassion',
        responseForm: 'conciseReflection',
        emotionalPosture: 'closeWitness',
        questionCount: 1,
        lengthBand: 'brief',
        usesDirectAdvice: false,
        usesMemory: false,
        challengeLevel: 'none',
        reflectionLevel: 'close',
      },
    ],
  });

  assert.equal(plan.patternIntelligence.progressionState, 'chronicLoop');
  assert.equal(plan.interventionDecision.selectedIntervention, 'compassion');
  assert.equal(plan.interventionDecision.varietyMetadata.usesDirectAdvice, false);
  assert.equal(plan.memoryRetrieval.shouldRetrieve, true);
  assert.ok(plan.memoryRetrieval.rankedMemories[0].retrievalScore > 0.5);
  assert.doesNotMatch(JSON.stringify(plan.memoryRetrieval), /conversation and I should be better/);
});

test('high activation overrides depth, challenge, and memory retrieval', () => {
  const plan = composeKheperaPromptPlan({
    entryText: 'I am panicking and my chest is tight and everything feels loud. I cannot breathe.',
    currentTone: 'anxiety',
    currentThemes: ['fear_uncertainty'],
    memoryCandidates: [candidateMemory],
  });

  assert.equal(plan.assessment.riskLevel, 'elevated');
  assert.equal(plan.interventionDecision.selectedIntervention, 'regulation');
  assert.equal(plan.interventionDecision.responseFormRecommendation, 'groundingResponse');
  assert.equal(plan.memoryRetrieval.shouldRetrieve, false);
  assert.match(plan.safetyConstraints.join('\n'), /Safety overrides variety/);
});

test('transformation evidence selects growth reinforcement without progress pressure', () => {
  const plan = composeKheperaPromptPlan({
    entryText: 'I can see the pattern now. I shut down before I ask for help, and naming it feels new.',
    currentTone: 'clarity',
    currentThemes: ['identity'],
    longitudinalPatterns: [{
      id: 'identity-shift',
      themes: ['identity'],
      emotionalTone: 'clarity',
      progressionState: 'transformation',
      recurrenceCount: 3,
      breakthroughSignificance: 0.85,
    }],
  });

  assert.equal(plan.patternIntelligence.progressionState, 'integration');
  assert.equal(plan.interventionDecision.selectedIntervention, 'integration');
  assert.equal(plan.interventionDecision.responseFormRecommendation, 'insightSynthesis');
  assert.match(plan.safetyConstraints.join('\n'), /No diagnosis/);
});

test('recent response metadata creates coherent non-random variation', () => {
  const recent = {
    interventionFamily: 'witnessing',
    responseForm: 'extendedWitnessing',
    emotionalPosture: 'closeWitness',
    questionCount: 1,
    lengthBand: 'spacious',
    usesDirectAdvice: false,
    usesMemory: false,
    challengeLevel: 'none',
    reflectionLevel: 'close',
  };
  const plan = composeKheperaPromptPlan({
    entryText: 'I feel tired and unsure, but I can stay with the question a little longer tonight.',
    currentTone: 'processing',
    currentThemes: ['rest_recovery'],
    recentResponses: [recent, recent],
  });

  assert.notEqual(plan.interventionDecision.selectedIntervention, 'witnessing');
  assert.match(plan.varietyConstraints.join('\n'), /Avoid repeating recent intervention families/);
  assert.equal(plan.interventionDecision.varietyMetadata.usesDirectAdvice, false);
});
