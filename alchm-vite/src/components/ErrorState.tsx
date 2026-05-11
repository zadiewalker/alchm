
import { DESIGN } from '@/lib/design';

export function ErrorState({
  title = 'Something went wrong',
  message = 'Try again in a moment.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div style={{ padding: '28px 20px', fontFamily: DESIGN.typography.sansSerif }}>
      <div style={{ fontSize: '16px', fontWeight: DESIGN.typography.weights.semibold, color: DESIGN.colors.textPrimary }}>
        {title}
      </div>
      <div style={{ marginTop: '10px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
        {message}
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          aria-label="Retry"
          style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid ${DESIGN.colors.border}`,
            backgroundColor: DESIGN.colors.cardBg,
            color: DESIGN.colors.textPrimary,
            cursor: 'pointer',
            fontFamily: 'inherit',
            minHeight: '44px',
          }}
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

