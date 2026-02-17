'use client';

import React from 'react';
import { DESIGN } from '@/lib/design';

export function CrisisFooter({ onOpen }: { onOpen: () => void }) {
  return (
    <footer
      style={{
        marginTop: 'auto',
        paddingTop: DESIGN.spacing.lg,
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        textAlign: 'center',
        fontFamily: DESIGN.typography.sansSerif,
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open crisis support resources"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: DESIGN.typography.sizes.sm, fontFamily: DESIGN.typography.sansSerif }}>
          Crisis support available ·{' '}
        </span>
      </button>
      <a
        href="tel:988"
        aria-label="Call 988 Suicide and Crisis Lifeline"
        style={{ color: DESIGN.colors.gold, fontSize: DESIGN.typography.sizes.sm, fontFamily: DESIGN.typography.sansSerif }}
      >
        988
      </a>
    </footer>
  );
}
