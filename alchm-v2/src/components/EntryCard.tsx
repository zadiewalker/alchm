'use client';

import React from 'react';
import { DESIGN } from '@/lib/design';
import type { JournalEntry } from '@/lib/types';

const MOOD_LABELS: Record<number, string> = {
  1: 'Heavy',
  3: 'Anxious',
  5: 'Neutral',
  7: 'Hopeful',
  9: 'Peaceful',
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function EntryCard({
  entry,
  onOpen,
}: {
  entry: JournalEntry;
  onOpen: () => void;
}) {
  const reflection = entry.kheperaReflection || (Array.isArray(entry.insights) ? entry.insights.join(' ') : '');
  const hasReflection = typeof reflection === 'string' && reflection.trim().length > 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open journal entry"
      style={{
        width: '100%',
        textAlign: 'left',
        backgroundColor: DESIGN.colors.cardBg,
        border: `1px solid ${DESIGN.colors.border}`,
        borderRadius: DESIGN.radius.lg,
        padding: '14px',
        cursor: 'pointer',
        fontFamily: DESIGN.typography.sansSerif,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'baseline' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textMuted }}>{formatDate(entry.createdAt)}</div>
        {typeof entry.mood === 'number' ? (
          <div style={{ fontSize: '12px', color: DESIGN.colors.sage300 }}>
            {MOOD_LABELS[entry.mood] || 'Mood'}
          </div>
        ) : null}
      </div>
      <div
        style={{
          marginTop: '10px',
          fontSize: '14px',
          color: DESIGN.colors.textPrimary,
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {entry.content || ''}
      </div>
      <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {hasReflection ? (
          <span
            style={{
              fontSize: '11px',
              color: DESIGN.colors.textKhepera,
              border: `1px solid rgba(232, 197, 109, 0.28)`,
              padding: '4px 8px',
              borderRadius: DESIGN.radius.full,
            }}
          >
            Reflection
          </span>
        ) : null}
        {(entry.tags || []).slice(0, 3).map((t) => (
          <span
            key={t}
            style={{
              fontSize: '11px',
              color: DESIGN.colors.textSecondary,
              border: `1px solid ${DESIGN.colors.borderLight}`,
              padding: '4px 8px',
              borderRadius: DESIGN.radius.full,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </button>
  );
}
