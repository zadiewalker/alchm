'use client';

import type { BootErrorScreenProps } from '@/types/components';

export function ErrorScreen({ message, detail, onRetry }: BootErrorScreenProps): React.JSX.Element {
  return (
    <div style={{
      background: 'var(--bg-base)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <p style={{
        fontFamily: "var(--font-family-heading)",
        fontSize: '30px',
        fontWeight: 400,
        color: 'var(--text-primary)',
        textAlign: 'center',
        lineHeight: 1.2,
        marginBottom: '12px',
        maxWidth: '280px',
      }}>
        ALCHM had trouble opening.
      </p>
      <p style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '16px',
        fontWeight: 300,
        color: 'var(--text-secondary)',
        textAlign: 'center',
        lineHeight: 1.7,
        marginBottom: '32px',
        maxWidth: '280px',
      }}>
        {message}
      </p>
      {detail ? (
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '13px',
          fontWeight: 300,
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 1.6,
          marginTop: '-20px',
          marginBottom: '32px',
          maxWidth: '300px',
        }}>
          {detail}
        </p>
      ) : null}
      <button
        className="btn-primary"
        style={{
          width: '200px',
        }}
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  );
}
