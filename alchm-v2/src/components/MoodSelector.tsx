'use client';

import React from 'react';
import { DESIGN } from '@/lib/design';

const MOODS: Array<{ value: number; label: string }> = [
  { value: 1, label: 'Heavy' },
  { value: 3, label: 'Anxious' },
  { value: 5, label: 'Neutral' },
  { value: 7, label: 'Hopeful' },
  { value: 9, label: 'Peaceful' },
];

export function MoodSelector({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (next: number) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontFamily: DESIGN.typography.sansSerif }}>
      {MOODS.map((m) => {
        const active = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            aria-label={`Select mood: ${m.label}`}
            style={{
              minHeight: '44px',
              padding: '10px 14px',
              borderRadius: DESIGN.radius.full,
              border: `1px solid ${active ? 'rgba(232, 197, 109, 0.55)' : DESIGN.colors.border}`,
              backgroundColor: active ? 'rgba(232, 197, 109, 0.12)' : 'rgba(255,255,255,0.04)',
              color: active ? DESIGN.colors.textPrimary : DESIGN.colors.textSecondary,
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'inherit',
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

