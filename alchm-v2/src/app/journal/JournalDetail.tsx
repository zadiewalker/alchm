'use client';

import React from 'react';
import { DESIGN } from '@/lib/design';
import type { JournalEntry } from '@/lib/types';
import { getStoredReflection } from '@/lib/khepera';

export function JournalDetail({ entry, onClose }: { entry: JournalEntry; onClose: () => void }) {
  const reflection = getStoredReflection(entry);

  return (
    <div style={{ marginTop: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '16px', fontWeight: DESIGN.typography.weights.semibold }}>Entry</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close entry detail"
          style={{
            border: 'none',
            background: 'transparent',
            color: DESIGN.colors.gold,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: 'pointer',
            minHeight: '44px',
            padding: '0 8px',
          }}
        >
          Close
        </button>
      </div>

      <div
        style={{
          marginTop: '12px',
          backgroundColor: DESIGN.colors.cardBg,
          border: `1px solid ${DESIGN.colors.border}`,
          borderRadius: DESIGN.radius.lg,
          padding: '14px',
          color: DESIGN.colors.textPrimary,
          fontFamily: DESIGN.typography.sansSerif,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7,
        }}
      >
        {entry.content}
      </div>

      {reflection ? (
        <div
          style={{
            marginTop: '12px',
            backgroundColor: 'rgba(232, 197, 109, 0.06)',
            border: `1px solid rgba(232, 197, 109, 0.18)`,
            borderRadius: DESIGN.radius.lg,
            padding: '14px',
            color: DESIGN.colors.textSecondary,
            fontFamily: DESIGN.typography.sansSerif,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
          }}
          aria-label="Khepera reflection"
        >
          {reflection}
        </div>
      ) : null}
    </div>
  );
}

