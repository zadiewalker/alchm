'use client';

import type { PageHeaderProps } from '@/types/shell';

export const PageHeader = ({ title, onBack, rightElement }: PageHeaderProps): React.JSX.Element => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'var(--nav-bar-height)',
      padding: '0 var(--screen-horizontal-padding)',
      flexShrink: 0,
      background: 'transparent',
    }}
  >
    {onBack && (
      <button
        className="btn-icon"
        onClick={onBack}
        style={{
          position: 'absolute', left: 'var(--screen-horizontal-padding)',
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-pill)',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
          <path
            d="M7 1L1 7L7 13"
            stroke="var(--text-primary)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )}

    <h1
      style={{
        fontFamily: 'var(--font-family-heading)',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-medium)',
        letterSpacing: 0,
        color: 'var(--text-primary)',
        margin: 0,
        padding: '0 60px',
        textAlign: 'center',
        width: '100%',
      }}
    >
      {title}
    </h1>

    {rightElement && (
      <div style={{ position: 'absolute', right: 'var(--screen-horizontal-padding)' }}>
        {rightElement}
      </div>
    )}
  </div>
);
