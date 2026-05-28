'use client';

import React from 'react';
import { AppText } from '@/components/ui/AppText';
import { DESIGN } from '@/utils/design';
import type { SeedDisplayProps } from '@/types/components';

export function SeedDisplay({ seed, style = {} }: SeedDisplayProps): React.JSX.Element {
  return (
    <div
      style={{
        marginTop: DESIGN.spacing.xl,
        paddingTop: DESIGN.spacing.lg,
        paddingLeft: DESIGN.spacing.md,
        paddingRight: DESIGN.spacing.md,
        paddingBottom: DESIGN.spacing.md,
        borderTop: '1px solid var(--accent-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: DESIGN.spacing.md,
        ...style,
      }}
    >
      {/* Subtle visual separator */}
      <div
        style={{
          width: '40%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)',
          opacity: 0.4,
          marginBottom: DESIGN.spacing.sm,
        }}
      />

      {/* The seed text */}
      <div
        style={{
          maxWidth: '320px',
          paddingLeft: DESIGN.spacing.sm,
          paddingRight: DESIGN.spacing.sm,
        }}
      >
        <AppText
          variant="body"
          style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            opacity: 0.85,
            fontStyle: 'normal',
          }}
        >
          {seed}
        </AppText>
      </div>

      {/* Close invitation */}
      <div style={{ marginTop: DESIGN.spacing.sm }}>
        <AppText
          variant="caption"
          style={{
            fontFamily: DESIGN.typography.ui,
            fontSize: '12px',
            color: 'var(--text-secondary)',
            opacity: 0.5,
            letterSpacing: 0,
          }}
        >
          Close whenever you're ready.
        </AppText>
      </div>
    </div>
  );
}
