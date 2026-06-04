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
    <div style={{ textAlign: 'center', padding: `${DESIGN.spacing.xxl} 0`, maxWidth: 460, margin: '0 auto' }}>
      <div style={{ fontSize: 28, marginBottom: DESIGN.spacing.md, color: DESIGN.colors.textPrimary }}>{icon}</div>
      <h3 style={{ margin: 0, color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif, fontWeight: DESIGN.typography.weights.light, lineHeight: DESIGN.typography.lineHeights.normal }}>{resolvedTitle}</h3>
      <p style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, margin: `${DESIGN.spacing.sm} auto 0`, lineHeight: DESIGN.typography.lineHeights.relaxed, maxWidth: 360 }}>{resolvedMessage}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            marginTop: DESIGN.spacing.lg,
            minHeight: '44px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid ${DESIGN.colors.goldDim}`,
            background: DESIGN.colors.primary,
            color: '#1f2937',
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
