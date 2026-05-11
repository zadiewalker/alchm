'use client';

import React, { useMemo, useRef, useState } from 'react';
import { MoodSelector } from '@/components/MoodSelector';
import { DESIGN } from '@/lib/design';
import { getAdaptivePrompt, getPathwayById } from '@/lib/pathways';
import { isVoiceSupported, startListening, type VoiceSession } from '@/lib/voice';
import { getTimeContext } from '@/lib/timeAware';

export function NewEntryEditor(props: {
  content: string;
  setContent: (v: string) => void;
  mood: number | undefined;
  setMood: (v: number) => void;
  tags: string;
  setTags: (v: string) => void;
  pathwayId: string | null;
  pathwayStep: number;
  onSave: () => void;
  canSave: boolean;
}) {
  const pathway = props.pathwayId ? getPathwayById(props.pathwayId) : null;
  const pathwayStep = pathway ? (pathway.steps.find((s) => s.day === props.pathwayStep) || pathway.steps[0]) : null;
  const adaptivePrompt = pathway && props.pathwayId ? getAdaptivePrompt(props.pathwayId, props.pathwayStep) : null;

  const time = useMemo(() => getTimeContext(), []);
  const voiceOK = useMemo(() => {
    try {
      return isVoiceSupported();
    } catch {
      return false;
    }
  }, []);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const sessionRef = useRef<VoiceSession | null>(null);

  return (
    <>
      {pathway && pathwayStep ? (
        <div
          className="card"
          style={{
            marginTop: '14px',
            padding: '16px',
            borderLeft: `2px solid ${DESIGN.colors.gold}`,
            background: DESIGN.gradients.cardWarm,
          }}
          aria-label="Pathway context"
        >
          <div style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: DESIGN.colors.sage400, fontWeight: 600 }}>
            {pathway.framework.toUpperCase()} · Day {props.pathwayStep} of {pathway.duration}
          </div>
          <div style={{ marginTop: '8px', fontSize: '16px', color: DESIGN.colors.textPrimary, fontWeight: DESIGN.typography.weights.semibold }}>
            {pathway.title}
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
            {adaptivePrompt || pathwayStep.prompt}
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: '16px' }}>
        <div style={{ position: 'relative' }} aria-label="Writing space">
          <textarea
            value={props.content}
            onChange={(e) => props.setContent(e.target.value)}
            aria-label="Journal entry text"
            placeholder="Write what is true. One sentence is enough."
            className="input journal-textarea"
            style={{
              width: '100%',
              minHeight: '50vh',
              borderRadius: DESIGN.radius.lg,
              fontFamily: DESIGN.typography.sansSerif,
              fontSize: '16px',
              outline: 'none',
              lineHeight: 1.7,
              paddingRight: voiceOK ? '56px' : undefined,
            }}
          />

          {voiceOK ? (
            <button
              type="button"
              onClick={async () => {
                setVoiceError('');
                if (listening && sessionRef.current) {
                  sessionRef.current.stop();
                  return;
                }

                setListening(true);
                const session = startListening();
                sessionRef.current = session;

                const res = await session.done;
                sessionRef.current = null;
                setListening(false);
                if (res.error) setVoiceError(res.error);
                if (res.transcript) {
                  const next = props.content.trim()
                    ? `${props.content.trim()}\n\n${res.transcript.trim()}`
                    : res.transcript.trim();
                  props.setContent(next);
                }
              }}
              aria-label={listening ? 'Stop voice input' : 'Start voice input'}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: time.ui.showVoiceProminent ? '44px' : '40px',
                height: time.ui.showVoiceProminent ? '44px' : '40px',
                borderRadius: '9999px',
                border: `1px solid ${DESIGN.colors.borderLight}`,
                background: listening ? 'rgba(232, 200, 122, 0.18)' : 'rgba(164, 180, 148, 0.10)',
                color: listening ? DESIGN.colors.gold : DESIGN.colors.sage400,
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              🎤
            </button>
          ) : null}
        </div>

        <div className="privacy-indicator" aria-label="Privacy promise" style={{ marginTop: '8px' }}>
          <span className="lock-icon" aria-hidden="true">
            🔒
          </span>
          <span>Your words stay on this device. Always.</span>
        </div>

        {listening ? (
          <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textMuted }} aria-label="Voice input status">
            Listening… tap the mic to stop.
          </div>
        ) : null}
        {voiceError ? (
          <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textMuted }} aria-label="Voice input error">
            {voiceError}
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: pathway ? '16px' : '14px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, marginBottom: '10px' }}>How does this feel?</div>
        <MoodSelector value={props.mood} onChange={props.setMood} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, marginBottom: '8px' }}>Tags (optional)</div>
        <input
          value={props.tags}
          onChange={(e) => props.setTags(e.target.value)}
          aria-label="Tags (comma separated)"
          placeholder="work, sleep, family…"
          className="input"
          style={{
            width: '100%',
            borderRadius: DESIGN.radius.lg,
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: '16px',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="button"
        onClick={props.onSave}
        aria-label="Save journal entry"
        disabled={!props.canSave}
        className="btn-primary"
        style={{
          marginTop: '18px',
          width: '100%',
          borderRadius: DESIGN.radius.full,
          fontFamily: DESIGN.typography.sansSerif,
          cursor: props.canSave ? 'pointer' : 'default',
          opacity: props.canSave ? 1 : 0.5,
        }}
      >
        Save
      </button>
    </>
  );
}
