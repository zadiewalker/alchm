import { useEffect, useMemo, useRef, useState } from 'react';
import { ErrorState } from '@/components/States';
import { TypewriterText } from '@/components/TypewriterText';
import { KheperaReport } from '@/components/KheperaReport';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { DESIGN } from '@/lib/design';
import { getEntries, updateEntry } from '@/lib/journal';
import {
  appendExerciseHistory,
  createSkippedResult,
  extractPastPresentLines,
  getSomaticRegion,
  pickSelfCriticalLine,
  routeExercises,
  selectLetterName,
  type ExerciseCandidate,
  type ExerciseResult,
} from '@/lib/postEntryExercises';
import {
  createPostEntryData,
  getPostEntrySequence,
  truncate,
  type PostEntryData,
  type PostEntryStage,
} from '@/lib/postEntryTransform';
import type { CrisisCheck } from '@/lib/crisis';

type ReflectionKind = 'normal' | 'silent';

const DISSOLUTION_MS = 3000;

function pseudoRandom(index: number): number {
  const x = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function PostEntryTransform(props: {
  visible: boolean;
  entryId: string | null;
  entryText: string;
  moodLabel?: string | null;
  pathwayStep?: number;
  isCheckin?: boolean;
  isReflecting: boolean;
  reflection: string;
  reflectionKind?: ReflectionKind;
  reflectionError: string;
  crisis: CrisisCheck | null;
  onReflect: () => void;
  onDone?: () => void;
  onReflectionComplete?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState<PostEntryStage>('reflection');
  const [showDone, setShowDone] = useState(false);
  const [showReturnHome, setShowReturnHome] = useState(false);
  const [reflectionTouched, setReflectionTouched] = useState(false);
  const [reflectionTick, setReflectionTick] = useState(0);
  const [reflectionStageStartedAt, setReflectionStageStartedAt] = useState<number>(Date.now());
  const [reflectionReadyAt, setReflectionReadyAt] = useState<number | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);

  const [reframeValue, setReframeValue] = useState('');
  const [unsaidValue, setUnsaidValue] = useState('');
  const [letterValue, setLetterValue] = useState('');
  const [directionA, setDirectionA] = useState('');
  const [directionB, setDirectionB] = useState('');
  const [witnessValue, setWitnessValue] = useState('');
  const [timeBridgeValue, setTimeBridgeValue] = useState('');
  const [essenceWords, setEssenceWords] = useState(['', '', '']);

  const typedCompleteRef = useRef(false);
  const persistedForEntryRef = useRef<string | null>(null);
  const settledTimeoutRef = useRef<number | null>(null);
  const returnTimeoutRef = useRef<number | null>(null);

  const postData: PostEntryData = useMemo(() => createPostEntryData(props.entryId || 'pending', props.entryText), [props.entryId, props.entryText]);

  const totalEntries = useMemo(
    () => getEntries().filter((entry) => entry.type !== 'check-in' && entry.type !== 'checkin' && entry.type !== 'onboarding').length,
    [props.entryId],
  );

  const selection = useMemo(
    () =>
      routeExercises({
        text: props.entryText,
        extractedLine: postData.extractedLine || truncate(props.entryText, 120),
        moodLabel: props.moodLabel || null,
        isCheckin: props.isCheckin,
        totalEntries,
        bodyEchoes: postData.bodyEchoes,
        arc: postData.emotionalArc,
      }),
    [postData.bodyEchoes, postData.emotionalArc, postData.extractedLine, props.entryText, props.isCheckin, props.moodLabel, totalEntries],
  );

  const exercises = useMemo(
    () => [selection.primary, selection.secondary].filter(Boolean) as ExerciseCandidate[],
    [selection.primary, selection.secondary],
  );

  const activeExercise = exercises[exerciseIndex] || null;

  const sequence = useMemo(
    () =>
      getPostEntrySequence(
        {
          moodLabel: props.moodLabel || null,
          wordCount: String(props.entryText || '').trim().split(/\s+/).filter(Boolean).length,
          pathwayStep: props.pathwayStep || null,
          isCheckin: props.isCheckin,
        },
        postData.bodyEchoes,
        postData.emotionalArc,
        postData.extractedLine,
        exercises.length > 0,
      ),
    [exercises.length, postData.bodyEchoes, postData.emotionalArc, postData.extractedLine, props.entryText, props.isCheckin, props.moodLabel, props.pathwayStep],
  );

  const hasReturn = sequence.includes('return');
  const waitMs = Date.now() - reflectionStageStartedAt + reflectionTick * 0;
  const isPending = props.reflectionError.toLowerCase().includes('back online');

  useEffect(() => {
    if (!props.visible) return;
    typedCompleteRef.current = false;
    setShowDone(false);
    setShowReturnHome(false);
    setReflectionTouched(false);
    setReflectionReadyAt(null);
    setExerciseIndex(0);
    setExerciseResults([]);
    setReframeValue('');
    setUnsaidValue('');
    setLetterValue('');
    setDirectionA('');
    setDirectionB('');
    setWitnessValue('');
    setTimeBridgeValue('');
    setEssenceWords(['', '', '']);

    const first: PostEntryStage = sequence.includes('dissolution') ? 'dissolution' : sequence.includes('exercise') ? 'exercise' : 'reflection';
    setStage(first);
    if (first === 'reflection') setReflectionStageStartedAt(Date.now());
  }, [props.visible, sequence]);

  useEffect(() => {
    if (!props.visible || !props.entryId) return;
    if (persistedForEntryRef.current === props.entryId) return;
    updateEntry(props.entryId, { postEntryData: { ...postData, entryId: props.entryId } });
    persistedForEntryRef.current = props.entryId;
  }, [postData, props.entryId, props.visible]);

  useEffect(() => {
    if (!props.visible) return;
    if (stage === 'reflection' && !props.reflection && !props.isReflecting && !props.reflectionError) {
      props.onReflect();
    }
  }, [props, stage]);

  useEffect(() => {
    if (!props.visible) return;
    if (stage === 'reflection' && props.reflection && !reflectionReadyAt) {
      setReflectionReadyAt(Date.now());
    }
  }, [props.reflection, props.visible, reflectionReadyAt, stage]);

  useEffect(() => {
    if (!props.visible || stage !== 'dissolution') return;
    const id = window.setTimeout(() => {
      if (sequence.includes('exercise')) {
        setStage('exercise');
        return;
      }
      setStage('reflection');
      setReflectionStageStartedAt(Date.now());
    }, DISSOLUTION_MS);
    return () => window.clearTimeout(id);
  }, [props.visible, sequence, stage]);

  useEffect(() => {
    if (!props.visible || stage !== 'reflection') return;
    if (settledTimeoutRef.current) {
      window.clearTimeout(settledTimeoutRef.current);
      settledTimeoutRef.current = null;
    }
    if (props.reflection && reflectionReadyAt && !showDone && !reflectionTouched) {
      settledTimeoutRef.current = window.setTimeout(() => setShowDone(true), 10000);
    }
    return () => {
      if (settledTimeoutRef.current) {
        window.clearTimeout(settledTimeoutRef.current);
        settledTimeoutRef.current = null;
      }
    };
  }, [props.reflection, props.visible, reflectionReadyAt, reflectionTouched, showDone, stage]);

  useEffect(() => {
    if (!props.visible || stage !== 'reflection' || !!props.reflection) return;
    const id = window.setInterval(() => setReflectionTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [props.reflection, props.visible, stage]);

  useEffect(() => {
    if (!props.visible || stage !== 'return') return;
    if (returnTimeoutRef.current) {
      window.clearTimeout(returnTimeoutRef.current);
      returnTimeoutRef.current = null;
    }
    returnTimeoutRef.current = window.setTimeout(() => setShowReturnHome(true), 8000);
    return () => {
      if (returnTimeoutRef.current) {
        window.clearTimeout(returnTimeoutRef.current);
        returnTimeoutRef.current = null;
      }
    };
  }, [props.visible, stage]);

  if (!props.visible) return null;

  function finalizeExercises(nextResults: ExerciseResult[]) {
    if (props.entryId) {
      updateEntry(props.entryId, {
        postEntryData: {
          ...postData,
          entryId: props.entryId,
          exerciseResults: nextResults,
        },
      });
    }
    setStage('reflection');
    setReflectionStageStartedAt(Date.now());
  }

  function skipToReflection() {
    finalizeExercises(exerciseResults);
  }

  function advanceFromDissolution() {
    if (sequence.includes('exercise')) {
      setStage('exercise');
      return;
    }
    setStage('reflection');
    setReflectionStageStartedAt(Date.now());
  }

  function submitExercise(result: ExerciseResult | null) {
    const exercise = activeExercise;
    if (!exercise) {
      finalizeExercises(exerciseResults);
      return;
    }

    const completed = !!result?.completed;
    appendExerciseHistory({ type: exercise.type, date: new Date().toISOString(), wasCompleted: completed });

    const nextResults = completed && result ? [...exerciseResults, result] : exerciseResults;
    setExerciseResults(nextResults);

    if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex((idx) => idx + 1);
      return;
    }

    finalizeExercises(nextResults);
  }

  function onExerciseContinue() {
    const exercise = activeExercise;
    if (!exercise) return submitExercise(null);

    switch (exercise.type) {
      case 'reframe': {
        const value = reframeValue.trim();
        if (!value) return submitExercise(createSkippedResult('reframe'));
        return submitExercise({
          type: 'reframe',
          date: new Date().toISOString(),
          completed: true,
          originalLine: postData.extractedLine || truncate(props.entryText, 120),
          reframedLine: value,
        });
      }
      case 'unsaid': {
        const value = unsaidValue.trim();
        if (!value) return submitExercise(createSkippedResult('unsaid'));
        return submitExercise({ type: 'unsaid', date: new Date().toISOString(), completed: true, unsaidText: value });
      }
      case 'letter': {
        const value = letterValue.trim();
        if (!value) return submitExercise(createSkippedResult('letter'));
        return submitExercise({
          type: 'letter',
          date: new Date().toISOString(),
          completed: true,
          personName: selectLetterName(props.entryText),
          letterText: value,
        });
      }
      case 'compass': {
        const a = directionA.trim();
        const b = directionB.trim();
        if (!a || !b) return submitExercise(createSkippedResult('compass'));
        return submitExercise({ type: 'compass', date: new Date().toISOString(), completed: true, directionA: a, directionB: b });
      }
      case 'somatic': {
        return submitExercise({ type: 'somatic', date: new Date().toISOString(), completed: true, somaticRegion: getSomaticRegion(postData.bodyEchoes) });
      }
      case 'witness': {
        const value = witnessValue.trim();
        if (!value) return submitExercise(createSkippedResult('witness'));
        return submitExercise({
          type: 'witness',
          date: new Date().toISOString(),
          completed: true,
          selfCriticalLine: pickSelfCriticalLine(props.entryText, postData.extractedLine),
          compassionateResponse: value,
        });
      }
      case 'time_bridge': {
        const value = timeBridgeValue.trim();
        if (!value) return submitExercise(createSkippedResult('time_bridge'));
        const lines = extractPastPresentLines(props.entryText);
        return submitExercise({
          type: 'time_bridge',
          date: new Date().toISOString(),
          completed: true,
          pastLine: lines.pastLine,
          presentLine: lines.presentLine,
          messageToYoungerSelf: value,
        });
      }
      case 'essence': {
        const words = essenceWords.map((w) => w.trim()).filter(Boolean).slice(0, 3);
        if (words.length < 1) return submitExercise(createSkippedResult('essence'));
        return submitExercise({ type: 'essence', date: new Date().toISOString(), completed: true, words });
      }
      default:
        return submitExercise(null);
    }
  }

  function onExerciseSkip() {
    if (!activeExercise) return skipToReflection();
    submitExercise(createSkippedResult(activeExercise.type));
  }

  return (
    <div style={{ marginTop: '12px', minHeight: '52vh' }}>
      {props.crisis?.detected && stage === 'reflection' ? (
        <div className="card-reflection" style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary, marginBottom: '8px' }}>You&apos;re not alone in this.</div>
          <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
            If you&apos;re in crisis or having thoughts of self-harm: Call 988 or Text 741741.
          </div>
        </div>
      ) : null}

      {stage === 'dissolution' ? (
        <div role="presentation" onClick={advanceFromDissolution}>
          <DissolutionStage text={props.entryText} reducedMotion={reducedMotion} />
          <div style={{ marginTop: '18px', textAlign: 'center' }}>
            <button type="button" className="btn-ghost" onClick={(event) => { event.stopPropagation(); skipToReflection(); }}>
              Skip to reflection →
            </button>
          </div>
        </div>
      ) : null}

      {stage === 'exercise' && activeExercise ? (
        <div>
          <ExerciseStage
            exercise={activeExercise}
            extractedLine={postData.extractedLine || truncate(props.entryText, 120)}
            entryText={props.entryText}
            bodyRegion={getSomaticRegion(postData.bodyEchoes)}
            reframeValue={reframeValue}
            setReframeValue={setReframeValue}
            unsaidValue={unsaidValue}
            setUnsaidValue={setUnsaidValue}
            letterValue={letterValue}
            setLetterValue={setLetterValue}
            directionA={directionA}
            setDirectionA={setDirectionA}
            directionB={directionB}
            setDirectionB={setDirectionB}
            witnessValue={witnessValue}
            setWitnessValue={setWitnessValue}
            timeBridgeValue={timeBridgeValue}
            setTimeBridgeValue={setTimeBridgeValue}
            essenceWords={essenceWords}
            setEssenceWords={setEssenceWords}
            onContinue={onExerciseContinue}
            onSkip={onExerciseSkip}
            showSkip={selection.skipOption}
          />
          <div style={{ marginTop: '18px', textAlign: 'center' }}>
            <button type="button" className="btn-ghost" onClick={skipToReflection}>
              Skip to reflection →
            </button>
          </div>
        </div>
      ) : null}

      {stage === 'reflection' ? (
        <div onClick={() => {
          if (props.reflection && !showDone) {
            setReflectionTouched(true);
            setShowDone(true);
          }
        }} role="presentation">
          {!props.reflection && !props.reflectionError ? (
            <div style={{ marginTop: '12px', background: 'linear-gradient(180deg, rgba(232, 197, 109, 0.10) 0%, rgba(179, 193, 167, 0.85) 100%)', border: '1px solid rgba(232, 197, 109, 0.22)', borderRadius: '18px', padding: '16px' }}>
              <div style={{ display: 'grid', placeItems: 'center', marginBottom: '8px' }}>
                <span className="breathing-dot" style={{ display: 'inline-block' }} />
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>Your words are held.</p>
              {waitMs > 8000 ? <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>Taking a moment...</p> : null}
              {waitMs > 15000 ? (
                <>
                  <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>Khepera will reflect later. Your entry is saved.</p>
                  <div style={{ marginTop: '12px' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%' }}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (hasReturn) {
                          setStage('return');
                          setShowReturnHome(false);
                        } else {
                          props.onDone?.();
                        }
                      }}
                    >
                      Done
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {props.reflectionError && !isPending ? (
            <div style={{ marginTop: '12px' }} onClick={(event) => event.stopPropagation()}>
              <ErrorState title="Khepera couldn't reflect" message={props.reflectionError} onRetry={props.onReflect} />
            </div>
          ) : null}
          {props.reflectionError && isPending ? (
            <div style={{ marginTop: '12px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
              Khepera will reflect when you&apos;re back online. Your words are saved.
            </div>
          ) : null}

          {props.reflection ? (
            <div
              className={`${reducedMotion ? '' : 'reflection-ink-in'} card-reflection`}
              style={{
                marginTop: '12px',
                background: props.reflectionKind === 'silent' ? 'var(--glass-bg)' : undefined,
                border: props.reflectionKind === 'silent' ? '1px solid var(--glass-border)' : undefined,
                borderLeft: props.reflectionKind === 'silent' ? undefined : '3px solid var(--gold-base)',
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="reflection-text">
                <TypewriterText
                  text={props.reflection}
                  onComplete={() => {
                    if (typedCompleteRef.current) return;
                    typedCompleteRef.current = true;
                    props.onReflectionComplete?.();
                  }}
                />
              </div>
              <div className="reflection-footer" aria-label="Khepera disclosure" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <span>{props.reflectionKind === 'silent' ? 'Khepera · present' : 'Khepera · AI companion · not a therapist'}</span>
                {props.reflectionKind === 'silent' ? null : <KheperaReport reflectionId={props.entryId || 'new-entry-reflection'} reflectionText={props.reflection} />}
              </div>
            </div>
          ) : null}

          {props.reflection && showDone ? (
            <div style={{ marginTop: '12px' }} onClick={(event) => event.stopPropagation()}>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>Sit with this as long as you need.</p>
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  if (hasReturn) {
                    setStage('return');
                    setShowReturnHome(false);
                    return;
                  }
                  props.onDone?.();
                }}
              >
                Done
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {stage === 'return' ? (
        <div className="post-return-stage" onClick={() => props.onDone?.()} role="presentation">
          <p className="post-return-title">Before you go.</p>
          <p className="post-return-copy">
            Feel your feet on the floor.
            <br />
            Feel the weight of your hands.
            <br />
            Take one breath that&apos;s just for you.
          </p>
          <div className="breathing-dot" style={{ margin: '22px auto' }} />
          {showReturnHome ? (
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={(event) => {
                event.stopPropagation();
                props.onDone?.();
              }}
            >
              Return home
            </button>
          ) : (
            <p style={{ margin: 0, textAlign: 'center', fontSize: '12px', color: 'var(--text-tertiary)' }}>Tap to return anytime</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function DissolutionStage(props: { text: string; reducedMotion: boolean }) {
  const words = useMemo(() => String(props.text || '').trim().split(/\s+/).filter(Boolean).slice(0, 220), [props.text]);
  return (
    <div className={`post-stage post-stage-dissolution ${props.reducedMotion ? 'reduced' : ''}`}>
      <div className="dissolution-cloud">
        {words.map((word, index) => {
          const driftX = Math.round((pseudoRandom(index) - 0.5) * 64);
          const driftY = -100 - Math.round(pseudoRandom(index + 9) * 200);
          const delay = Math.round(pseudoRandom(index + 18) * 800);
          const speed = 0.5 + pseudoRandom(index + 28);
          return (
            <span
              key={`${word}-${String(index)}`}
              className="dissolving-word"
              style={{
                animationDelay: `${delay}ms`,
                animationDuration: `${Math.round(2000 / speed)}ms`,
                ['--drift-x' as string]: `${driftX}px`,
                ['--drift-y' as string]: `${driftY}px`,
              } as Record<string, string>}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseStage(props: {
  exercise: ExerciseCandidate;
  extractedLine: string;
  entryText: string;
  bodyRegion: string;
  reframeValue: string;
  setReframeValue: (v: string) => void;
  unsaidValue: string;
  setUnsaidValue: (v: string) => void;
  letterValue: string;
  setLetterValue: (v: string) => void;
  directionA: string;
  setDirectionA: (v: string) => void;
  directionB: string;
  setDirectionB: (v: string) => void;
  witnessValue: string;
  setWitnessValue: (v: string) => void;
  timeBridgeValue: string;
  setTimeBridgeValue: (v: string) => void;
  essenceWords: string[];
  setEssenceWords: (v: string[]) => void;
  onContinue: () => void;
  onSkip: () => void;
  showSkip: boolean;
}) {
  const person = selectLetterName(props.entryText);
  const criticalLine = pickSelfCriticalLine(props.entryText, props.extractedLine);
  const lines = extractPastPresentLines(props.entryText);

  const textareaStyle = {
    width: '100%',
    minHeight: '88px',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass-bg)',
    color: 'var(--text-primary)',
    padding: '12px',
    fontSize: '15px',
    lineHeight: 1.5,
  };

  return (
    <div className="post-stage">
      {props.exercise.type === 'reframe' ? (
        <>
          <p className="post-extraction-line" style={{ fontSize: '28px', maxWidth: '100%', opacity: 1, animation: 'none' }}>“{props.extractedLine}”</p>
          <p className="post-stage-caption" style={{ marginTop: 8 }}>Rewrite this sentence. Not to fix it. Just to make it more true.</p>
          <input value={props.reframeValue} onChange={(event) => props.setReframeValue(event.target.value)} className="input-field" placeholder="Write one truer line" />
        </>
      ) : null}

      {props.exercise.type === 'unsaid' ? (
        <>
          <p className="post-return-title" style={{ fontSize: '22px' }}>What didn&apos;t you write?</p>
          <p className="post-stage-caption" style={{ marginTop: 8 }}>The thing you almost said but pulled back from.</p>
          <textarea value={props.unsaidValue} onChange={(event) => props.setUnsaidValue(event.target.value)} style={textareaStyle} placeholder="Write the unsaid thing" />
        </>
      ) : null}

      {props.exercise.type === 'letter' ? (
        <>
          <p className="post-return-title" style={{ fontSize: '22px' }}>You wrote about {person}.</p>
          <p className="post-stage-caption" style={{ marginTop: 8 }}>If you could say one sentence and be fully heard, what would it be?</p>
          <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>Dear {person},</div>
          <input value={props.letterValue} onChange={(event) => props.setLetterValue(event.target.value)} className="input-field" placeholder="One sentence" />
        </>
      ) : null}

      {props.exercise.type === 'compass' ? (
        <>
          <p className="post-return-title" style={{ fontSize: '22px' }}>You&apos;re at a crossroads.</p>
          <p className="post-stage-caption" style={{ marginTop: 8 }}>Name the two directions.</p>
          <input value={props.directionA} onChange={(event) => props.setDirectionA(event.target.value)} className="input-field" placeholder="Direction A" />
          <input value={props.directionB} onChange={(event) => props.setDirectionB(event.target.value)} className="input-field" placeholder="Direction B" style={{ marginTop: '8px' }} />
        </>
      ) : null}

      {props.exercise.type === 'somatic' ? (
        <>
          <p className="post-return-title" style={{ fontSize: '22px' }}>Your writing found tension in your {props.bodyRegion}.</p>
          <p className="post-stage-caption" style={{ marginTop: 8 }}>Place your hand there now. Breathe into your hand.</p>
          <div className="breathing-dot" style={{ margin: '18px auto' }} />
          <p style={{ margin: '0', textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)' }}>Imagine the words leaving through your palm.</p>
        </>
      ) : null}

      {props.exercise.type === 'witness' ? (
        <>
          <p className="post-extraction-line" style={{ fontSize: '28px', maxWidth: '100%', opacity: 1, animation: 'none' }}>“{criticalLine}”</p>
          <p className="post-stage-caption" style={{ marginTop: 8 }}>If someone you love said this about themselves, what would you say?</p>
          <textarea value={props.witnessValue} onChange={(event) => props.setWitnessValue(event.target.value)} style={textareaStyle} placeholder="Write what you would tell them" />
        </>
      ) : null}

      {props.exercise.type === 'time_bridge' ? (
        <>
          <p className="post-return-title" style={{ fontSize: '22px' }}>You connected then and now.</p>
          <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {lines.pastLine ? `Past: “${truncate(lines.pastLine, 80)}”` : null}
            {lines.presentLine ? <div style={{ marginTop: '6px' }}>Present: “{truncate(lines.presentLine, 80)}”</div> : null}
          </div>
          <p className="post-stage-caption" style={{ marginTop: 10 }}>If your younger self could see you now, what do they need to hear?</p>
          <textarea value={props.timeBridgeValue} onChange={(event) => props.setTimeBridgeValue(event.target.value)} style={textareaStyle} placeholder="Write to your younger self" />
        </>
      ) : null}

      {props.exercise.type === 'essence' ? (
        <>
          <p className="post-return-title" style={{ fontSize: '22px' }}>Distill it to three words.</p>
          <p className="post-stage-caption" style={{ marginTop: 8 }}>If this whole entry had to become three words, what are they?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {props.essenceWords.map((word, index) => (
              <input
                key={`essence-${index}`}
                className="input-field"
                value={word}
                onChange={(event) => {
                  const next = [...props.essenceWords];
                  next[index] = event.target.value;
                  props.setEssenceWords(next);
                }}
                placeholder={`Word ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}

      <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
        <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={props.onContinue}>
          {props.exercise.type === 'somatic' ? 'I did it →' : 'Continue →'}
        </button>
        {props.showSkip ? (
          <button type="button" className="btn-ghost" onClick={props.onSkip}>
            Skip →
          </button>
        ) : null}
      </div>
    </div>
  );
}
