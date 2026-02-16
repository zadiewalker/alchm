'use client';

import { DESIGN } from '@/lib/design';

export function CrisisFooter() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        paddingTop: DESIGN.spacing.lg,
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        textAlign: 'center',
      }}
    >
      <span style={{ color: DESIGN.colors.textMuted, fontSize: DESIGN.typography.sizes.sm, fontFamily: DESIGN.typography.sansSerif }}>
        If you're in crisis, call or text{' '}
      </span>
      <a href="tel:988" style={{ color: DESIGN.colors.gold, fontSize: DESIGN.typography.sizes.sm, fontFamily: DESIGN.typography.sansSerif }}>
        988
      </a>
    </footer>
  );
}
