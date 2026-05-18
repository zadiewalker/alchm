'use client';

import { DESIGN } from '@/lib/design';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Global error caught:', error);
  
  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            background: DESIGN.colors.bgSurface,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: DESIGN.spacing.md,
          }}
        >
          <div style={{ textAlign: 'center', color: DESIGN.colors.textPrimary }}>
            <h2 style={{ fontFamily: DESIGN.typography.serif, fontWeight: DESIGN.typography.weights.light, marginBottom: DESIGN.spacing.sm }}>
              ALCHM
            </h2>
            <p style={{ color: DESIGN.colors.textSecondary, marginBottom: DESIGN.spacing.md }}>Something went wrong</p>
            <button 
              onClick={() => reset()}
              style={{
                minHeight: '44px',
                padding: '10px 18px',
                borderRadius: DESIGN.radius.md,
                border: `1px solid ${DESIGN.colors.border}`,
                background: DESIGN.colors.bgElevated,
                color: DESIGN.colors.textPrimary,
                fontFamily: DESIGN.typography.sansSerif,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
