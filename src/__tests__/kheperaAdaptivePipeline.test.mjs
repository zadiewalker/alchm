import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { analyzeEntry } from '../services/khepera/analyzeEntry.ts';
import { generateReflection, mapStanceToStyleProfile } from '../services/khepera/generateReflection.ts';
import { buildKheperaMemorySignal, inferThemeTags, selectContinuityMode } from '../services/khepera/memoryProfile.ts';
import { buildStanceFallback, getStyleDefinition } from '../services/khepera/styleEngine.ts';
import { detectInsufficientEntryGrounding, validateKheperaOutput, validateSeed } from '../services/khepera/qualityGuards.ts';
import { selectStance } from '../services/khepera/selectStance.ts';
import { selectReflectionMode } from '../services/khepera/selectReflectionMode.ts';
import { validateGeneratedKheperaResponse } from '../services/khepera/validateKheperaResponse.ts';
import { buildKheperaPrompt } from '../services/khepera/buildKheperaPrompt.ts';
import { resolveAiProviderName } from '../services/ai/modelProvider.ts';
import { extractOpenAIResponseText } from '../services/ai/openAIProvider.ts';
import { createModelText, generateKheperaReviewReport, parseStructuredKheperaResponse } from '../services/khepera/generateResponse.ts';
import { lintKheperaResponse } from '../services/khepera/outputValidation.ts';
import { extractEntryAnchors } from '../services/khepera/extractEntryAnchors.ts';
import { KHEPERA_LANGUAGE_PROFILES } from '../services/khepera/languageProfiles.ts';
import { buildKheperaPacingState, decideReflectionTiming } from '../services/khepera/timing.ts';
import { processQueuedEntry } from '../services/journal/processQueuedEntry.ts';

const fixtures = [
  {
    id: 'fragmented-overwhelm',
    entry: 'Too much. My chest is tight and everything feels loud. I cannot keep all of this straight.',
    expectedStance: 'containing',
    expectedMode: 'pure_witness',
  },
  {
    id: 'numb-distance',
    entry: 'I feel blank. I keep moving through the day but I am not really in it.',
    expectedStance: 'clarifying',
    expectedMode: 'spacious_clarification',
  },
  {
    id: 'self-criticism',
    entry: 'I am a failure. I ruin every conversation and I should be better by now.',
    expectedStance: 'containing',
    expectedMode: 'self_protection_reframe',
  },
  {
    id: 'quiet-relief',
    entry: 'Tonight felt steadier. I finally exhaled in the car and my body softened.',
    expectedStance: 'integrating',
    expectedMode: 'tenderness_invitation',
  },
  {
    id: 'ambivalence-closeness',
    entry: 'Part of me wants to call her, and part of me wants distance at the same time.',
    expectedStance: 'holding_ambiguity',
    expectedMode: 'ambivalence_holding',
  },
  {
    id: 'body-unease',
    entry: 'My stomach drops every time the phone buzzes at work.',
    expectedStance: 'clarifying',
    expectedMode: 'gentle_naming',
  },
  {
    id: 'coherent-grief',
    entry: 'I miss my father in ordinary moments. The grief is quieter, but it is still here.',
    expectedStance: 'witnessing',
    expectedMode: 'tenderness_invitation',
  },
  {
    id: 'protective-anger',
    entry: 'I snapped again. Anger keeps showing up like armor when I feel exposed.',
    expectedStance: 'holding_ambiguity',
    expectedMode: 'self_protection_reframe',
  },
  {
    id: 'searching-confusion',
    entry: 'I keep replaying it and I do not know what to do with any of this.',
    expectedStance: 'holding_ambiguity',
    expectedMode: 'ambivalence_holding',
  },
  {
    id: 'looping-rumination',
    entry: 'I keep going over the same conversation over and over and I cannot stop circling the same thread.',
    expectedStance: 'clarifying',
    expectedMode: 'spacious_clarification',
  },
  {
    id: 'emergent-clarity',
    entry: 'I can see the pattern now: I shut down before I ask for help. Naming it feels new.',
    expectedStance: 'integrating',
    expectedMode: 'movement_marking',
  },
];

test('adaptive stance and mode selection match fixture expectations', () => {
  for (const fixture of fixtures) {
    const analysis = analyzeEntry(fixture.entry, 'processing');
    const stance = selectStance(analysis);
    const mode = selectReflectionMode(analysis);
    assert.equal(stance, fixture.expectedStance, `fixture ${fixture.id} selected stance ${stance}`);
    assert.equal(mode, fixture.expectedMode, `fixture ${fixture.id} selected ${mode}`);
  }
});

test('fixture set demonstrates meaningful stance variation', () => {
  const stances = new Set(
    fixtures.map((fixture) => selectStance(analyzeEntry(fixture.entry, 'processing')))
  );
  assert.ok(stances.size >= 4, `expected at least 4 distinct stances, got ${stances.size}`);
});

test('similar entries can map to different stances based on what the user is doing in the moment', () => {
  const overwhelmed = analyzeEntry(
    'I keep going over it and my chest is tight and everything feels too loud right now.',
    'processing'
  );
  const reflective = analyzeEntry(
    'I keep going over it, but tonight I can finally see how fear and hope are both here at once.',
    'processing'
  );

  assert.equal(selectStance(overwhelmed), 'containing');
  assert.notEqual(selectStance(reflective), 'containing');
});

test('looping entries select clarifying while ambiguity entries stay open', () => {
  const looping = analyzeEntry(
    'I keep replaying it over and over and the same conversation keeps circling without changing.',
    'processing'
  );
  const ambiguous = analyzeEntry(
    'Part of me wants to say it clearly, and part of me wants to leave it unfinished for now.',
    'ambivalence'
  );

  assert.equal(selectStance(looping), 'clarifying');
  assert.equal(selectStance(ambiguous), 'holding_ambiguity');
});

test('prompt builder encodes stance-specific linguistic behavior', () => {
  const analysis = analyzeEntry(fixtures[0].entry, 'processing');
  const reflection = generateReflection({
    entryText: fixtures[0].entry,
    analysis,
  });
  const mode = selectReflectionMode(analysis, reflection.stance);
  const prompt = buildKheperaPrompt({
    entryText: fixtures[0].entry,
    analysis,
    mode,
    stance: reflection.stance,
    currentThemes: reflection.currentThemes,
    memorySignal: reflection.memorySignal,
    continuityMode: reflection.continuityMode,
    styleProfile: reflection.styleProfile,
  });

  assert.match(prompt.system, /CURRENT RESPONSE STANCE:/);
  assert.match(prompt.system, /STANCE LANGUAGE BEHAVIORS:/);
  assert.match(prompt.system, /Use memory only as a soft contextual signal/i);
  assert.match(prompt.system, /avoid predictable cadence across sections/i);
});

test('language profile exists for every response stance', () => {
  const expected = [
    'witnessing',
    'containing',
    'clarifying',
    'expanding',
    'integrating',
    'holding_ambiguity',
  ];

  assert.deepEqual(Object.keys(KHEPERA_LANGUAGE_PROFILES).sort(), expected.sort());
  for (const stance of expected) {
    const profile = KHEPERA_LANGUAGE_PROFILES[stance];
    assert.equal(profile.stance, stance);
    assert.ok(profile.preferredSentenceLength.length > 0);
    assert.ok(profile.openingPatternGuidance.length > 0);
    assert.ok(profile.forbiddenOverusedPhrases.length > 0);
    assert.ok(profile.seedQuestionStyle.length > 0);
  }
});

test('prompt builder includes language profile and forbids default cadence', () => {
  const entry = 'I’m so happy that my app is working!';
  const analysis = analyzeEntry(entry, 'processing');
  const reflection = generateReflection({ entryText: entry, analysis });
  const prompt = buildKheperaPrompt({
    entryText: entry,
    analysis,
    mode: selectReflectionMode(analysis, reflection.stance),
    stance: reflection.stance,
    currentThemes: reflection.currentThemes,
    memorySignal: reflection.memorySignal,
    continuityMode: reflection.continuityMode,
    styleProfile: reflection.styleProfile,
    entryAnchors: extractEntryAnchors(entry),
  });

  assert.match(prompt.system, /LANGUAGE PROFILE:/);
  assert.match(prompt.system, /Do not reuse the default Khepera cadence/i);
  assert.match(prompt.system, /Let the current entry decide the shape of the response/i);
  assert.match(prompt.system, /Do not begin Witness, Perspective, and Seed with the same grammatical pattern/i);
  assert.match(prompt.system, /Anchor transformation instructions:/i);
});

test('prompt builder adds delayed return timing instruction without changing output contract', () => {
  const entry = 'Part of me feels ready, and part of me wants this to stay unresolved.';
  const analysis = analyzeEntry(entry, 'ambivalence');
  const reflection = generateReflection({ entryText: entry, analysis });
  const prompt = buildKheperaPrompt({
    entryText: entry,
    analysis,
    mode: selectReflectionMode(analysis, reflection.stance),
    stance: reflection.stance,
    currentThemes: reflection.currentThemes,
    memorySignal: reflection.memorySignal,
    continuityMode: reflection.continuityMode,
    styleProfile: reflection.styleProfile,
    reflectionTiming: 'delayed_return',
  });

  assert.match(prompt.system, /Do not reference time explicitly/i);
  assert.match(prompt.system, /arrived when it was ready/i);
  assert.match(prompt.system, /WITNESS: <text>\nPERSPECTIVE: <text>\nSEED: <one question>/);
});

test('timing decision returns immediate for high intensity and delayed for ambiguity', () => {
  const intense = analyzeEntry('Too much. My chest is tight and everything is loud right now.', 'anxiety');
  assert.equal(decideReflectionTiming({
    analysis: intense,
    stance: 'containing',
    pacingState: buildKheperaPacingState({ sessionCount: 1, dominantTone: 'anxiety' }),
  }), 'immediate');

  const ambiguous = analyzeEntry('Part of me wants to answer, and part of me wants to leave this unfinished.', 'ambivalence');
  assert.equal(decideReflectionTiming({
    analysis: ambiguous,
    stance: 'holding_ambiguity',
    pacingState: buildKheperaPacingState({ sessionCount: 4, dominantTone: 'ambivalence', lastReturnType: 'immediate' }),
  }), 'delayed_return');
});

test('pacing avoids repeating the same delayed timing pattern', () => {
  const ambiguous = analyzeEntry('Part of me wants to answer, and part of me wants to leave this unfinished.', 'ambivalence');
  assert.equal(decideReflectionTiming({
    analysis: ambiguous,
    stance: 'holding_ambiguity',
    pacingState: buildKheperaPacingState({ sessionCount: 6, dominantTone: 'ambivalence', lastReturnType: 'delayed' }),
  }), 'short_delay');
});

test('prompt builder adds provider-specific tightening for openai', () => {
  const analysis = analyzeEntry('I feel off today. I do not know why.', 'processing');
  const reflection = generateReflection({
    entryText: 'I feel off today. I do not know why.',
    analysis,
  });
  const mode = selectReflectionMode(analysis, reflection.stance);
  const prompt = buildKheperaPrompt({
    entryText: 'I feel off today. I do not know why.',
    analysis,
    mode,
    stance: reflection.stance,
    currentThemes: reflection.currentThemes,
    memorySignal: reflection.memorySignal,
    continuityMode: reflection.continuityMode,
    styleProfile: reflection.styleProfile,
    provider: 'openai',
  });

  assert.match(prompt.system, /OPENAI-SPECIFIC TIGHTENING:/);
  assert.match(prompt.system, /Do not give advice under any condition/i);
  assert.match(prompt.system, /Do not summarize the user's situation/i);
});

test('entry anchors are extracted from the current entry only', () => {
  const anchors = extractEntryAnchors('I keep replaying the conversation and wondering if I sounded needy.');
  const phrases = anchors.map((anchor) => anchor.phrase.toLowerCase());

  assert.ok(phrases.some((phrase) => phrase.includes('replaying') || phrase.includes('keep replaying')));
  assert.ok(phrases.some((phrase) => phrase.includes('sounded needy')));
  assert.ok(phrases.some((phrase) => phrase.includes('conversation') || phrase.includes('wondering if')));
});

test('anchors are not persisted in storage or khepera memory sources', () => {
  const storageKeysSource = fs.readFileSync(new URL('../config/storageKeys.ts', import.meta.url), 'utf8');
  const memorySource = fs.readFileSync(new URL('../services/khepera/memory.ts', import.meta.url), 'utf8');

  assert.equal(storageKeysSource.includes('ENTRY_ANCHOR'), false);
  assert.equal(memorySource.includes('entryAnchors'), false);
});

test('prompt builder includes anchors and grounding instruction', () => {
  const entry = 'I’m happy that my app is finally working.';
  const analysis = analyzeEntry(entry, 'processing');
  const reflection = generateReflection({
    entryText: entry,
    analysis,
  });
  const prompt = buildKheperaPrompt({
    entryText: entry,
    analysis,
    mode: selectReflectionMode(analysis, reflection.stance),
    stance: reflection.stance,
    currentThemes: reflection.currentThemes,
    memorySignal: reflection.memorySignal,
    continuityMode: reflection.continuityMode,
    styleProfile: reflection.styleProfile,
    entryAnchors: extractEntryAnchors(entry),
  });

  assert.match(prompt.system, /CURRENT ENTRY ANCHORS:/);
  assert.match(prompt.system, /finally working/i);
  assert.match(prompt.system, /Do not respond only to the general mood/i);
});

test('generic output fails insufficient entry grounding while grounded output passes', () => {
  const entry = 'I’m happy that my app is finally working.';
  const anchors = extractEntryAnchors(entry);

  assert.equal(
    detectInsufficientEntryGrounding({
      witness: 'Something in this feels lighter.',
      perspective: 'There is a gentle shift here.',
      seed: 'What feels most present in this moment?',
    }, anchors),
    true,
  );

  const quality = validateKheperaOutput({
    witness: 'There is relief around something finally working.',
    perspective: 'The entry holds a moment where effort seems to meet relief.',
    seed: 'What feels most alive in this moment of working?',
  }, { entryAnchors: anchors });

  assert.equal(quality.ok, true);
});

test('my app is working fixture rejects generic cadence and accepts differentiated language', () => {
  const entry = 'I’m so happy that my app is working!';
  const anchors = extractEntryAnchors(entry);
  const badOutput = {
    witness: 'Something in this feels lighter.',
    perspective: 'There is a shape of relief here.',
    seed: 'What else becomes visible when this is left open?',
  };
  const goodOutput = {
    witness: 'The happiness is tied to the app working now.',
    perspective: 'Relief sits close to the fact that something finally functions.',
    seed: 'What feels most alive in the app working now?',
  };

  const bad = validateKheperaOutput(badOutput, { entryAnchors: anchors });
  assert.equal(bad.ok, false);
  assert.ok(bad.flags.includes('repeated_opening_pattern'));
  assert.ok(bad.flags.includes('overused_khepera_phrase'));
  assert.ok(bad.flags.includes('insufficient_language_differentiation'));

  const good = validateKheperaOutput(goodOutput, { entryAnchors: anchors });
  assert.equal(good.ok, true);
  assert.equal(validateSeed(goodOutput.seed).length, 0);
});

test('overused Khepera phrases are thresholded rather than permanently banned', () => {
  const singleUse = validateKheperaOutput({
    witness: 'Something in this names the app working now.',
    perspective: 'Relief stays tied to the working app rather than floating away from it.',
    seed: 'What feels most alive in the app working now?',
  }, { entryAnchors: extractEntryAnchors('I’m so happy that my app is working!') });

  assert.equal(singleUse.flags.includes('overused_khepera_phrase'), false);

  const repeatedUse = validateKheperaOutput({
    witness: 'Something in this feels lighter.',
    perspective: 'There is a shape of relief here.',
    seed: 'What else becomes visible when this is left open?',
  });

  assert.ok(repeatedUse.flags.includes('overused_khepera_phrase'));
});

test('repeated section openings are flagged', () => {
  const result = validateKheperaOutput({
    witness: 'There is relief around the app working now.',
    perspective: 'There is contact with the fact that it functions.',
    seed: 'Where does that relief feel clearest?',
  }, { entryAnchors: extractEntryAnchors('I’m so happy that my app is working!') });

  assert.equal(result.ok, false);
  assert.ok(result.flags.includes('repeated_opening_pattern'));
});

test('generic vague response fails language differentiation', () => {
  const result = validateKheperaOutput({
    witness: 'Something in this has weight.',
    perspective: 'There is a shape here that holds space for what is visible.',
    seed: 'What else becomes visible when this carries what it carries?',
  });

  assert.equal(result.ok, false);
  assert.ok(result.flags.includes('insufficient_language_differentiation'));
});

test('looping entry language can pass grounding without overquoting', () => {
  const entry = 'I keep replaying what I said and wondering if I sounded needy.';
  const quality = validateKheperaOutput({
    witness: 'The replaying gives this entry a looping shape.',
    perspective: 'The words stay close to the worry about how you landed in that conversation.',
    seed: 'What feels most active inside that loop?',
  }, { entryAnchors: extractEntryAnchors(entry) });

  assert.equal(quality.ok, true);
});

test('distance-from-self entry can pass grounding', () => {
  const entry = 'I feel far away from myself today.';
  const quality = validateKheperaOutput({
    witness: 'The distance from yourself is the center of this entry.',
    perspective: 'Even in that distance, the words stay close to it instead of moving away.',
    seed: 'What feels nearest inside that distance?',
  }, { entryAnchors: extractEntryAnchors(entry) });

  assert.equal(quality.ok, true);
});

test('repair prompt includes grounding flag and anchors after a generic first pass', async () => {
  const entry = 'I’m happy that my app is finally working.';
  const prompts = [];

  await generateKheperaReviewReport(entry, undefined, {
    createText: async (request) => {
      prompts.push(request.system);
      return {
        blockedByCrisis: false,
        text: prompts.length === 1
          ? JSON.stringify({
              witness: 'There is a lot here, and it feels difficult to hold all at once.',
              perspective: 'Something feels heavy without becoming clearer.',
              seed: 'What feels most present in this moment?',
            })
          : JSON.stringify({
              witness: 'There is relief around something finally working.',
              perspective: 'The entry holds a moment where effort seems to meet relief.',
              seed: 'What feels most alive in this moment of working?',
            }),
      };
    },
  });

  assert.equal(prompts.length, 2);
  assert.match(prompts[1], /insufficient_entry_grounding/);
  assert.match(prompts[1], /The previous response was too general/i);
  assert.match(prompts[1], /finally working/i);
});

test('repair prompt includes familiar Khepera cadence warning after language differentiation failure', async () => {
  const entry = 'I’m so happy that my app is working!';
  const prompts = [];

  await generateKheperaReviewReport(entry, undefined, {
    createText: async (request) => {
      prompts.push(request.system);
      return {
        blockedByCrisis: false,
        text: prompts.length === 1
          ? JSON.stringify({
              witness: 'Something in this feels lighter.',
              perspective: 'There is a shape of relief here.',
              seed: 'What else becomes visible when this is left open?',
            })
          : JSON.stringify({
              witness: 'The happiness is tied to the app working now.',
              perspective: 'Relief sits close to the fact that something finally functions.',
              seed: 'What feels most alive in the app working now?',
            }),
      };
    },
  });

  assert.equal(prompts.length, 2);
  assert.match(prompts[1], /familiar Khepera cadence/i);
  assert.match(prompts[1], /different sentence shape/i);
});

test('delayed_return schedules a metadata-only job and does not call the model immediately', async () => {
  let modelCalls = 0;
  let scheduledJob = null;
  let remoteWrite = null;
  const queueUpdates = [];

  const result = await processQueuedEntry(
    {
      updateQueueEntry: async (_localId, updates) => {
        queueUpdates.push(updates);
      },
      releaseQueueEntry: async () => {},
      generateSafeKheperaResponse: async () => {
        modelCalls += 1;
        return {
          witness: 'The ambiguity is here.',
          perspective: 'It stays unresolved without being forced.',
          seed: 'What feels most present inside the unfinished part?',
        };
      },
      extractThemesForKheperaEntry: async () => ({ themes: ['fear_uncertainty'], tone: 'ambivalence' }),
      updateKheperaMemory: async () => {},
      detectCrisisSignals: () => false,
      setDoc: async (_ref, data) => {
        remoteWrite = data;
      },
      makeSessionRef: async () => ({ id: 'entry-delayed' }),
      scheduleDelayedReflection: async (_userId, job) => {
        scheduledJob = job;
      },
      getKheperaReflectionAccessState: async () => ({
        allowed: true,
        hasTransformation: true,
        used: 0,
        limit: null,
      }),
    },
    {
      entry: {
        localId: 'entry-delayed',
        entryText: 'Part of me wants to answer, and part of me wants to leave this unfinished.',
        sessionCount: 4,
        recurringThemes: [],
        dominantTone: 'ambivalence',
        userId: 'user-1',
        writtenAt: '2026-04-29T00:00:00.000Z',
        status: 'pending_khepera',
        syncAttempts: 0,
      },
      processingOwner: 'test',
      userContext: {
        sessionCount: 4,
        recurringThemes: [],
        dominantTone: 'ambivalence',
        lastReturnType: 'immediate',
      },
      stopAfterCrisis: false,
      allowOfflineFallback: false,
      includeSyncedAtOnRemotePersist: false,
      onPersistFailure: 'throw',
      onMissingUserId: 'fail',
    },
  );

  assert.equal(result.outcome, 'delayed_return');
  assert.equal(modelCalls, 0);
  assert.ok(scheduledJob);
  assert.deepEqual(Object.keys(scheduledJob).sort(), ['emotionalTone', 'entryId', 'scheduledAt', 'themeTags']);
  assert.equal(JSON.stringify(scheduledJob).includes('unfinished'), false);
  assert.equal(remoteWrite.reflectionTiming, 'delayed_return');
  assert.equal(queueUpdates.some((update) => update.status === 'delayed_return'), true);
});

test('temporal surveillance language is rejected', () => {
  const result = validateKheperaOutput({
    witness: 'Earlier you said this same ache was present.',
    perspective: 'The previous entry makes this look familiar.',
    seed: 'What feels present in this ache now?',
  });

  assert.equal(result.ok, false);
  assert.ok(result.flags.includes('temporal_surveillance_language'));
});

test('fallback can use anchors safely and keep one open question', () => {
  const fallback = buildStanceFallback(
    'integrating',
    extractEntryAnchors('I’m happy that my app is finally working.'),
  );

  assert.match(fallback.witness, /finally working|clear turn/i);
  assert.equal(validateSeed(fallback.seed).length, 0);
  assert.equal(/\byou should\b|\btry\b|\bconsider\b|\bmust\b/i.test(`${fallback.witness} ${fallback.perspective} ${fallback.seed}`), false);
});

test('fallback varies by stance while staying anchored and preserving one seed question', () => {
  const anchors = extractEntryAnchors('I’m so happy that my app is working!');
  const witnessing = buildStanceFallback('witnessing', anchors);
  const clarifying = buildStanceFallback('clarifying', anchors);
  const ambiguity = buildStanceFallback('holding_ambiguity', anchors);

  assert.notEqual(witnessing.witness, clarifying.witness);
  assert.notEqual(clarifying.witness, ambiguity.witness);
  assert.match(witnessing.witness, /happy|app/i);
  assert.match(clarifying.witness, /happy|app/i);
  assert.match(ambiguity.witness, /happy|app/i);
  assert.equal(validateSeed(witnessing.seed).length, 0);
  assert.equal(validateSeed(clarifying.seed).length, 0);
  assert.equal(validateSeed(ambiguity.seed).length, 0);
});

test('validator enforces contract and safety constraints', () => {
  const entry = fixtures[0].entry;
  const analysis = analyzeEntry(entry, 'processing');
  const mode = selectReflectionMode(analysis);

  const valid = validateGeneratedKheperaResponse({
    response: {
      witness: 'You describe a moment that feels loud and hard to hold all at once.',
      perspective: 'Even in that intensity, you stayed with what your body was naming.',
      seed: 'What feels most immediate in your body right now?',
    },
    sourceText: entry,
    analysis,
    mode,
  });
  assert.equal(valid.ok, true);

  const invalid = validateGeneratedKheperaResponse({
    response: {
      witness: 'This sounds like anxiety.',
      perspective: 'You should try to breathe and focus on calming down.',
      seed: 'How can you fix this? What will you do next?',
    },
    sourceText: entry,
    analysis,
    mode,
  });
  assert.equal(invalid.ok, false);
});

test('lint rejects advice/coaching/diagnostic drift', () => {
  const issues = lintKheperaResponse(
    {
      witness: 'This sounds like depression.',
      perspective: 'You should focus on changing your routine and try to improve it.',
      seed: 'What will you do next? How soon can you start?',
    },
    'I feel heavy and tired all day.'
  );

  const codes = new Set(issues.map((issue) => issue.code));
  assert.ok(codes.has('diagnostic_framing'));
  assert.ok(codes.has('directive_language'));
  assert.ok(codes.has('coaching_language'));
  assert.ok(codes.has('seed_question_count'));
});

test('lint rejects repeated section openings and soft-therapy cliché phrasing', () => {
  const issues = lintKheperaResponse(
    {
      witness: 'I notice your shoulders tightening as the room gets quieter.',
      perspective: 'I notice the silence becoming part of what this moment is carrying.',
      seed: 'I notice what still feels hardest to name here?',
    },
    'My shoulders tightened when the room got quiet and I did not know what to say.'
  );

  const codes = new Set(issues.map((issue) => issue.code));
  assert.ok(codes.has('template_phrase'));
  assert.ok(codes.has('repeated_opening'));
});

test('memory signal stores only theme and tone metadata, never raw entry text', () => {
  const currentThemes = inferThemeTags('I keep replaying the call with my mother and I feel torn about reaching out.');
  const memorySignal = buildKheperaMemorySignal({
    currentThemes,
    currentTone: 'ambivalence',
    context: {
      sessionCount: 4,
      recurringThemes: ['relationship_tension', 'boundary_setting'],
      recentThemes: ['relationship_tension'],
      dominantTone: 'processing',
      previousTone: 'anxiety',
      recentStances: ['witnessing', 'clarifying'],
      recentStyles: ['grounded_witness', 'gentle_organizer'],
    },
  });

  assert.deepEqual(Object.keys(memorySignal).sort(), [
    'dominantTone',
    'previousTone',
    'recentStances',
    'recentThemes',
    'repeatedThemeCount',
    'toneShift',
  ]);
  assert.equal(JSON.stringify(memorySignal).includes('mother'), false);
});

test('continuity mode and stance rotation avoid obvious repetition on repeated themes', () => {
  const entry = 'I keep circling the same call and still feel torn about how much distance I need.';
  const analysis = analyzeEntry(entry, 'ambivalence');
  const currentThemes = inferThemeTags(entry);
  const memorySignal = buildKheperaMemorySignal({
    currentThemes,
    currentTone: analysis.emotionalTone,
    context: {
      sessionCount: 6,
      recurringThemes: ['relationship_tension', 'boundary_setting'],
      recentThemes: ['relationship_tension'],
      dominantTone: 'ambivalence',
      previousTone: 'tenderness',
      recentStances: ['witnessing', 'witnessing'],
      recentStyles: ['grounded_witness', 'grounded_witness'],
    },
  });
  const continuityMode = selectContinuityMode({
    currentThemes,
    memorySignal,
    context: {
      sessionCount: 6,
      recurringThemes: ['relationship_tension', 'boundary_setting'],
      recentThemes: ['relationship_tension'],
      dominantTone: 'ambivalence',
      previousTone: 'tenderness',
      recentStances: ['witnessing', 'witnessing'],
      recentStyles: ['grounded_witness', 'grounded_witness'],
    },
  });
  const stance = selectStance(analysis, { memorySignal, continuityMode });

  assert.equal(continuityMode, 'tone_shift');
  assert.notEqual(stance, 'witnessing');
});

test('high-intensity entries still prioritize containment even when memory suggests rotation', () => {
  const entry = 'Too much right now. My chest is tight and everything feels loud and impossible to sort.';
  const analysis = analyzeEntry(entry, 'anxiety');
  const reflection = generateReflection({
    entryText: entry,
    analysis,
    context: {
      sessionCount: 8,
      recurringThemes: ['fear_uncertainty'],
      recentThemes: ['fear_uncertainty'],
      dominantTone: 'processing',
      previousTone: 'processing',
      recentStances: ['clarifying', 'integrating'],
      recentStyles: ['gentle_organizer', 'perspective_opener'],
    },
  });

  assert.equal(reflection.stance, 'containing');
  assert.equal(mapStanceToStyleProfile(reflection.stance), 'soft_container');
});

test('lint rejects surveillance-style continuity language', () => {
  const issues = lintKheperaResponse(
    {
      witness: 'This seems to touch a theme that has appeared before.',
      perspective: 'Your pattern is becoming obvious here.',
      seed: 'What feels different around it now?',
    },
    'I feel this ache again when the phone rings.'
  );

  const codes = new Set(issues.map((issue) => issue.code));
  assert.ok(codes.has('template_phrase'));
});

test('quality guards reject directives, diagnosis, generic phrasing, and action-oriented seeds', () => {
  const result = validateKheperaOutput({
    witness: 'That sounds really hard.',
    perspective: 'This sounds like anxiety, and you should focus on calming down.',
    seed: 'What will you do next?',
  });

  assert.equal(result.ok, false);
  assert.ok(result.flags.includes('generic_response'));
  assert.ok(result.flags.includes('diagnostic_language'));
  assert.ok(result.flags.includes('directive_language'));
  assert.ok(result.flags.includes('seed_action_oriented'));
});

test('seed validator rejects multiple questions', () => {
  const flags = validateSeed('What feels closest here? What wants naming?');
  assert.ok(flags.includes('seed_multiple_questions'));
});

test('seed guard rejects the exact failure modes we do not allow', () => {
  const actionOriented = validateSeed('How can you take one small step to care for yourself today?');
  assert.ok(actionOriented.includes('seed_action_oriented'));

  const multipleQuestions = validateSeed('What do you feel, and what might you need?');
  assert.ok(multipleQuestions.includes('seed_multiple_questions'));

  const directive = validateKheperaOutput({
    witness: 'There is strain in how this lands.',
    perspective: 'The entry stays close to something still unresolved.',
    seed: 'Could you try writing more about this tomorrow?',
  });
  assert.equal(directive.ok, false);
  assert.ok(directive.flags.includes('directive_language'));
  assert.ok(directive.flags.includes('seed_action_oriented'));

  const allowed = validateSeed('What feels most present in this as you read it back?');
  assert.deepEqual(allowed, []);
});

test('quality guards flag faux-therapy voice and template repetition', () => {
  const result = validateKheperaOutput({
    witness: 'I notice a safe space opening here.',
    perspective: 'I notice your nervous system wanting you to hold space for your healing journey.',
    seed: 'What feels most present here?',
  });

  assert.equal(result.ok, false);
  assert.ok(result.flags.includes('faux_therapy_voice'));
  assert.ok(result.flags.includes('template_repetition'));
});

test('style engine exposes distinct style definitions and fallback passes quality review', () => {
  const style = getStyleDefinition('soft_container');
  assert.equal(style.distance, 'close');
  assert.equal(style.pace, 'slow');

  const fallback = buildStanceFallback('containing');
  const quality = validateKheperaOutput(fallback);
  assert.equal(quality.ok, true);
});

test('quality guards flag productivity framing separately', () => {
  const result = validateKheperaOutput({
    witness: 'You sound determined to make progress with this.',
    perspective: 'The entry leans toward growth and becoming a better version of yourself.',
    seed: 'What feels most present in this as you read it back?',
  });

  assert.equal(result.ok, false);
  assert.ok(result.flags.includes('productivity_framing'));
});

test('quality guards reject OpenAI-style helper phrasing', () => {
  const result = validateKheperaOutput({
    witness: 'There is strain in the way this keeps returning.',
    perspective: 'It might help to slow down and you could explore what this is asking of you.',
    seed: 'What feels most present in this as you read it back?',
  });

  assert.equal(result.ok, false);
  assert.ok(result.flags.includes('directive_language'));
  assert.ok(result.flags.includes('coaching_language'));
});

test('provider selection defaults to anthropic and switches to openai when configured', () => {
  assert.equal(resolveAiProviderName(undefined), 'anthropic');
  assert.equal(resolveAiProviderName('anthropic'), 'anthropic');
  assert.equal(resolveAiProviderName('openai'), 'openai');
  assert.equal(resolveAiProviderName('unknown'), 'anthropic');
});

test('OpenAI response extraction handles output_text and nested output content', () => {
  assert.equal(
    extractOpenAIResponseText({
      output_text: '{"witness":"a","perspective":"b","seed":"c?"}',
    }),
    '{"witness":"a","perspective":"b","seed":"c?"}',
  );

  assert.equal(
    extractOpenAIResponseText({
      output: [
        {
          content: [
            {
              type: 'output_text',
              text: '{"witness":"x","perspective":"y","seed":"z?"}',
            },
          ],
        },
      ],
    }),
    '{"witness":"x","perspective":"y","seed":"z?"}',
  );
});

test('structured parser accepts OpenAI-style JSON and rejects incomplete JSON', () => {
  const parsed = parseStructuredKheperaResponse(
    JSON.stringify({
      witness: 'There is a push-pull here between wanting distance and wanting to be understood.',
      perspective: 'The entry keeps both needs visible without forcing either one to settle first.',
      seed: 'What feels most present in that tension as you read it back?',
    }),
    'ambivalence_holding',
  );

  assert.deepEqual(parsed, {
    witness: 'There is a push-pull here between wanting distance and wanting to be understood.',
    perspective: 'The entry keeps both needs visible without forcing either one to settle first.',
    seed: 'What feels most present in that tension as you read it back?',
  });

  assert.equal(parseStructuredKheperaResponse('{"witness":"only one field"}', 'pure_witness'), null);
  assert.equal(
    parseStructuredKheperaResponse(
      JSON.stringify({
        witness: 'There is strain in the writing that remains visible here.',
        perspective: 'The entry leaves a question open without directing its answer.',
        seed: 'What feels most present as this stays open?',
        advice: 'Take a walk.',
      }),
      'pure_witness',
    ),
    null,
  );
});

test('crisis detection blocks provider calls before OpenAI fetch executes', async () => {
  const originalProvider = process.env.AI_PROVIDER;
  const originalFetch = global.fetch;
  let fetchCalled = false;

  process.env.AI_PROVIDER = 'openai';
  global.fetch = async () => {
    fetchCalled = true;
    throw new Error('fetch should not run for crisis input');
  };

  try {
    const result = await createModelText({
      inputTextForSafety: 'I want to kill myself tonight.',
      system: 'system',
      prompt: 'prompt',
      responseFormat: 'text',
    });

    assert.equal(result.blockedByCrisis, true);
    assert.equal(fetchCalled, false);
  } finally {
    process.env.AI_PROVIDER = originalProvider;
    global.fetch = originalFetch;
  }
});

test('repair path is bounded to one retry and then falls back safely on invalid JSON', async () => {
  let callCount = 0;

  const report = await generateKheperaReviewReport(
    'I feel off today. I do not know why.',
    {
      sessionCount: 1,
      dominantTone: 'processing',
    },
    {
      createText: async () => {
        callCount += 1;
        return {
          blockedByCrisis: false,
          provider: 'openai',
          model: 'test-model',
          text: '{"bad":"shape"}',
        };
      },
    },
  );

  assert.equal(callCount, 2);
  assert.equal(report.retryHappened, true);
  assert.equal(report.fallbackHappened, true);
  assert.equal(report.attempts.length, 2);
  assert.equal(validateKheperaOutput(report.finalResponse).ok, true);
});
