import type { CrisisFooterProps } from '@/types/shell';

export function CrisisFooter({ onPress }: CrisisFooterProps): React.JSX.Element {
  return (
    <div
      className="crisis-footer"
      style={{
        position: 'fixed',
        bottom: 'calc(54px + env(safe-area-inset-bottom, 0px))',
        left: 0,
        right: 0,
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'color-mix(in srgb, var(--surface-elevated) 82%, transparent)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        borderTop: '1px solid var(--border-subtle)',
        gap: 'var(--space-2)',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-regular)',
          letterSpacing: 'var(--letter-spacing-base)',
          textTransform: "none",
          color: 'var(--text-secondary)',
        }}
      >
        In crisis?
      </span>
      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
        ·
      </span>
      <button
        className="btn-ghost"
        onClick={onPress}
        style={{
          minHeight: '40px',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-medium)',
          letterSpacing: 'var(--letter-spacing-base)',
          color: 'var(--text-primary)',
          textTransform: "none",
          padding: '0 var(--space-1)',
          WebkitTapHighlightColor: 'transparent',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          fontFamily: 'inherit',
          width: 'auto',
          pointerEvents: 'auto',
        }}
      >
        Resources
      </button>
    </div>
  );
}
