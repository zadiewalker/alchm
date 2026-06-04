'use client';

import { DESIGN } from '@/lib/design';

interface EmptyStateProps {
  screen?: string;
  icon?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = '☾', title, message, actionLabel, onAction }: EmptyStateProps) {
  const resolvedTitle = title || 'Nothing here yet';
  const resolvedMessage = message || 'This space is ready when it is needed.';

  return (
    <div style={{ textAlign: 'center', padding: `${DESIGN.spacing.xl} 0` }}>
      <div style={{ fontSize: 26, marginBottom: DESIGN.spacing.sm }}>{icon}</div>
      <h3 style={{ margin: 0, color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif, fontWeight: DESIGN.typography.weights.light }}>{resolvedTitle}</h3>
      <p style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, marginTop: DESIGN.spacing.sm }}>{resolvedMessage}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            marginTop: DESIGN.spacing.md,
            minHeight: '44px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid ${DESIGN.colors.goldDim}`,
            background: 'rgba(255,255,255,0.2)',
            color: DESIGN.colors.textPrimary,
            padding: '10px 18px',
            fontFamily: DESIGN.typography.sansSerif,
          }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
