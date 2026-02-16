'use client';

import { DESIGN } from '@/lib/design';

interface LoadingStateProps {
  message?: string;
  variant?: 'page' | 'inline' | 'khepera';
}

export function LoadingState({ message = 'Loading...', variant = 'page' }: LoadingStateProps) {
  if (variant === 'inline') {
    return <span style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, fontSize: DESIGN.typography.sizes.sm }}>{message}</span>;
  }

  if (variant === 'khepera') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: DESIGN.colors.gold,
                animation: `pulse 900ms ${dot * 150}ms infinite`,
              }}
            />
          ))}
        </div>
        <span style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, fontSize: DESIGN.typography.sizes.sm }}>{message}</span>
        <style jsx>{`@keyframes pulse {0%,100%{opacity:.3}50%{opacity:1}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 78, borderRadius: DESIGN.radius.lg, background: DESIGN.colors.cardBg, border: `1px solid ${DESIGN.colors.borderLight}` }} />
      ))}
      <span style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, fontSize: DESIGN.typography.sizes.sm, textAlign: 'center' }}>{message}</span>
    </div>
  );
}
