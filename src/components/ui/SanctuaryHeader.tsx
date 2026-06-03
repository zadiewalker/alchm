'use client';

import type React from 'react';
import { useRouter } from 'next/navigation';
import { DESIGN } from '@/lib/design';

interface SanctuaryHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function SanctuaryHeader({ title, showBack = false, rightAction }: SanctuaryHeaderProps) {
  const router = useRouter();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 18px)',
        paddingBottom: DESIGN.spacing.md,
        background: 'linear-gradient(180deg, rgba(31,42,27,0.96), rgba(31,42,27,0.72), rgba(31,42,27,0))',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', gap: DESIGN.spacing.sm }}>
        <button
          onClick={() => router.back()}
          type="button"
          aria-label="Go back"
          style={{
            visibility: showBack ? 'visible' : 'hidden',
            width: '44px',
            height: '44px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid ${DESIGN.colors.border}`,
            background: 'rgba(31,42,27,0.46)',
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: DESIGN.typography.sizes.base,
          }}
        >
          ←
        </button>
        <h1
          style={{
            margin: 0,
            textAlign: 'center',
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.serif,
            fontSize: DESIGN.typography.sizes.xl,
            fontWeight: DESIGN.typography.weights.light,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{rightAction}</div>
      </div>
    </header>
  );
}
