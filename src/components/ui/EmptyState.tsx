'use client';

import { DESIGN } from '@/lib/design';

interface EmptyStateProps {
  screen?: string;
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = '☾', title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: `${DESIGN.spacing.xl} 0` }}>
      <div style={{ fontSize: 26, marginBottom: DESIGN.spacing.sm }}>{icon}</div>
      <h3 style={{ margin: 0, color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif, fontWeight: DESIGN.typography.weights.light }}>{title}</h3>
      <p style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, marginTop: DESIGN.spacing.sm }}>{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            marginTop: DESIGN.spacing.md,
            minHeight: '44px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid ${DESIGN.colors.goldDim}`,
            background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
            color: '#fff',
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
