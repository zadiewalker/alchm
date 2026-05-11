
import { DESIGN } from '@/lib/design';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      aria-label={label}
      style={{
        padding: '32px 20px',
        color: DESIGN.colors.textSecondary,
        fontFamily: DESIGN.typography.sansSerif,
        fontSize: '13px',
      }}
    >
      {label}
    </div>
  );
}

