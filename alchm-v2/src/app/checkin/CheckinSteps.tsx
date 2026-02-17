'use client';

import React from 'react';
import { MoodSelector } from '@/components/MoodSelector';
import { TypewriterText } from '@/components/TypewriterText';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { DESIGN } from '@/lib/design';

type Step = 1 | 2 | 3;

export function CheckinSteps(props: {
  step: Step;
  mood: number | undefined;
  onMood: (v: number) => void;
  sentence: string;
  onSentence: (v: string) => void;
  onDone: () => void;
  onSkip: () => void;
  isThinking: boolean;
  error: string;
  kheperaText: string;
  onGoodnight: () => void;
  saved: boolean;
}) {
  if (props.step === 1) {
    return (
      <div style={{ marginTop: '18px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
          How are you landing tonight?
        </h1>
        <div style={{ marginTop: '14px' }}>
          <MoodSelector value={props.mood} onChange={props.onMood} />
        </div>
      </div>
    );
  }

  if (props.step === 2) {
    return (
      <div style={{ marginTop: '18px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
          Anything else?
        </h1>
        <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary }}>Just one sentence.</div>
        <textarea
          value={props.sentence}
          onChange={(e) => props.onSentence(e.target.value)}
          aria-label="Optional check-in sentence"
          placeholder="One sentence…"
          className="input"
          style={{ marginTop: '14px', width: '100%', minHeight: '120px', fontFamily: DESIGN.typography.sansSerif, resize: 'none' }}
        />
        <div style={{ marginTop: '14px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={props.onDone}
            aria-label="Finish check-in"
            className="btn-primary"
            style={{ flex: 1, fontFamily: DESIGN.typography.sansSerif }}
          >
            Done
          </button>
          <button
            type="button"
            onClick={props.onSkip}
            aria-label="Skip sentence"
            className="btn-secondary"
            style={{ minHeight: '52px', fontFamily: DESIGN.typography.sansSerif }}
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '18px' }}>
      <h1 style={{ margin: 0, fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
        Khepera&apos;s goodnight
      </h1>
      <div className="card card-elevated" style={{ marginTop: '12px' }}>
        {props.isThinking ? <LoadingState label="Khepera is listening…" /> : null}
        {props.error ? <ErrorState title="Khepera couldn't reflect" message={props.error} /> : null}
        {props.kheperaText ? <TypewriterText text={props.kheperaText} speedCps={70} /> : null}
      </div>
      <button
        type="button"
        onClick={props.onGoodnight}
        aria-label="Return to dashboard"
        className="btn-primary"
        style={{ marginTop: '18px', width: '100%', fontFamily: DESIGN.typography.sansSerif }}
      >
        Goodnight ✦
      </button>
      {props.saved ? <div style={{ marginTop: '10px', fontSize: '12px', color: DESIGN.colors.textMuted }}>Saved as a check-in.</div> : null}
    </div>
  );
}
