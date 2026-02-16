'use client';

import { DESIGN } from '@/lib/design';

interface ErrorStateProps {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  variant?: 'page' | 'inline' | 'api';
}

export function ErrorState({ title = 'Something went wrong', message, retryLabel = 'Try again', onRetry, variant = 'page' }: ErrorStateProps) {
  const resolvedMessage = variant === 'api' ? 'Khepera is resting. Your entry is saved — the reflection will appear next time.' : message;
  return (
    <div
      style={{
        padding: variant === 'inline' ? DESIGN.spacing.md : DESIGN.spacing.xl,
        borderRadius: DESIGN.radius.lg,
        border: `1px solid ${DESIGN.colors.error}`,
        background: 'rgba(196,122,106,0.14)',
        color: DESIGN.colors.textPrimary,
        fontFamily: DESIGN.typography.sansSerif,
      }}
    >
      <p style={{ margin: 0, fontWeight: DESIGN.typography.weights.medium }}>{title}</p>
      <p style={{ margin: `${DESIGN.spacing.xs} 0 0`, color: DESIGN.colors.textSecondary }}>{resolvedMessage}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: DESIGN.spacing.md,
            minHeight: '44px',
            borderRadius: DESIGN.radius.md,
            border: `1px solid ${DESIGN.colors.border}`,
            background: DESIGN.colors.cardBg,
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
            padding: '8px 12px',
          }}
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
