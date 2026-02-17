'use client';

import React from 'react';
import { MoodSelector } from '@/components/MoodSelector';
import { DESIGN } from '@/lib/design';
import type { CrisisCheck } from '@/lib/crisis';
import { getPathwayById } from '@/lib/pathways';

export function NewEntryEditor(props: {
  content: string;
  setContent: (v: string) => void;
  mood: number | undefined;
  setMood: (v: number) => void;
  tags: string;
  setTags: (v: string) => void;
  pathwayId: string | null;
  pathwayStep: number;
  crisis: CrisisCheck;
  onSave: () => void;
  canSave: boolean;
}) {
  const pathway = props.pathwayId ? getPathwayById(props.pathwayId) : null;
  const pathwayStep = pathway ? (pathway.steps.find((s) => s.day === props.pathwayStep) || pathway.steps[0]) : null;

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
            {pathwayStep.prompt}
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: pathway ? '16px' : '14px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, marginBottom: '10px' }}>
          Mood (optional)
        </div>
        <MoodSelector value={props.mood} onChange={props.setMood} />
      </div>

      <div style={{ marginTop: '16px' }}>
        <textarea
          value={props.content}
          onChange={(e) => props.setContent(e.target.value)}
          aria-label="Journal entry text"
          placeholder="Write what is true. One sentence is enough."
          className="input journal-textarea"
          style={{
            width: '100%',
            borderRadius: DESIGN.radius.lg,
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: '16px',
            outline: 'none',
            lineHeight: 1.7,
          }}
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <input
          value={props.tags}
          onChange={(e) => props.setTags(e.target.value)}
          aria-label="Tags (comma separated)"
          placeholder="Tags (comma separated)…"
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

      {props.crisis.detected ? (
        <div
          style={{
            marginTop: '14px',
            backgroundColor: 'rgba(196, 122, 106, 0.10)',
            border: '1px solid rgba(196, 122, 106, 0.22)',
            borderRadius: DESIGN.radius.lg,
            padding: '14px',
            fontFamily: DESIGN.typography.sansSerif,
          }}
          aria-label="Crisis support notice"
        >
          <div style={{ fontSize: '13px', color: DESIGN.colors.textPrimary, fontWeight: DESIGN.typography.weights.semibold }}>
            You are not alone.
          </div>
          <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
            If you are in crisis, call or text{' '}
            <a href="tel:988" style={{ color: DESIGN.colors.gold, textDecoration: 'underline' }}>
              988
            </a>
            .
          </div>
        </div>
      ) : null}

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
