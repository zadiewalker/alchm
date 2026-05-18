'use client';

import type React from 'react';
import { useRouter } from 'next/navigation';
import { DESIGN } from '@/lib/design';

interface UpgradePromptProps {
  feature: string;
  message: string;
  recommendedTier: 'reflections' | 'sanctuary';
  onClose?: () => void;
}

export function UpgradePrompt({ feature, message, recommendedTier, onClose }: UpgradePromptProps) {
  const router = useRouter();

  return (
    <div
      style={{
        borderRadius: DESIGN.radius.lg,
        border: `1px solid ${DESIGN.colors.border}`,
        background: DESIGN.colors.cardBg,
        padding: DESIGN.spacing.md,
        display: 'grid',
        gap: DESIGN.spacing.sm,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: DESIGN.typography.sansSerif,
          fontSize: DESIGN.typography.sizes.base,
          color: DESIGN.colors.textPrimary,
        }}
      >
        {message}
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: DESIGN.typography.sansSerif,
          fontSize: DESIGN.typography.sizes.sm,
          color: DESIGN.colors.textSecondary,
        }}
      >
        {feature} is available on the {recommendedTier === 'reflections' ? 'Reflections' : 'Sanctuary'} plan. Khepera has more to offer when you&apos;re ready.
      </p>
      <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
        <button
          type="button"
          onClick={() => router.push('/pricing/')}
          style={{
            minHeight: '44px',
            borderRadius: DESIGN.radius.md,
            border: `1px solid ${DESIGN.colors.border}`,
            padding: '10px 14px',
            background: DESIGN.colors.bgElevated,
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
          }}
        >
          Explore plans
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            minHeight: '44px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid ${DESIGN.colors.border}`,
            padding: '10px 14px',
            background: DESIGN.colors.cardBg,
            color: DESIGN.colors.textSecondary,
            fontFamily: DESIGN.typography.sansSerif,
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
