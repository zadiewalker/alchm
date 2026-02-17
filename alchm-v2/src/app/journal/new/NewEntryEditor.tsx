'use client';

import React from 'react';
import { MoodSelector } from '@/components/MoodSelector';
import { DESIGN } from '@/lib/design';
import type { CrisisCheck } from '@/lib/crisis';

export function NewEntryEditor(props: {
  content: string;
  setContent: (v: string) => void;
  mood: number | undefined;
  setMood: (v: number) => void;
  tags: string;
  setTags: (v: string) => void;
  pathwayId: string | null;
  crisis: CrisisCheck;
  onSave: () => void;
  canSave: boolean;
}) {
  return (
    <>
      {props.pathwayId ? (
        <div style={{ marginTop: '10px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
          Pathway entry
        </div>
      ) : null}

      <div style={{ marginTop: '14px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textMuted, marginBottom: '10px' }}>
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
          style={{
            width: '100%',
            minHeight: '220px',
            padding: '14px',
            borderRadius: DESIGN.radius.lg,
            border: `1px solid ${DESIGN.colors.border}`,
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: '16px',
            outline: 'none',
            lineHeight: 1.7,
            resize: 'none',
          }}
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <input
          value={props.tags}
          onChange={(e) => props.setTags(e.target.value)}
          aria-label="Tags (comma separated)"
          placeholder="Tags (comma separated)…"
          style={{
            width: '100%',
            minHeight: '48px',
            padding: '14px',
            borderRadius: DESIGN.radius.lg,
            border: `1px solid ${DESIGN.colors.border}`,
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: DESIGN.colors.textPrimary,
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
        style={{
          marginTop: '18px',
          width: '100%',
          minHeight: '52px',
          borderRadius: DESIGN.radius.full,
          border: 'none',
          backgroundColor: DESIGN.colors.gold,
          color: '#fff',
          fontFamily: DESIGN.typography.sansSerif,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: '15px',
          fontWeight: DESIGN.typography.weights.medium,
          cursor: props.canSave ? 'pointer' : 'default',
          opacity: props.canSave ? 1 : 0.5,
        }}
      >
        Save
      </button>
    </>
  );
}

