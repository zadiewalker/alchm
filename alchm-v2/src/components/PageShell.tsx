'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { DESIGN } from '@/lib/design';
import { CrisisFooter } from '@/components/CrisisFooter';

export function PageShell({
  children,
  background,
}: {
  children: React.ReactNode;
  background?: 'deep' | 'gradient';
}) {
  const pathname = usePathname();

  const resolvedBackground: 'deep' | 'gradient' = background ?? (pathname === '/' ? 'gradient' : 'deep');

  const bg = useMemo(() => {
    if (resolvedBackground === 'gradient') {
      // Protected splash gradient (CLAUDE.md)
      return DESIGN.gradients.splash;
    }
    // Inner sanctuary: deep sage gradient, never black.
    return DESIGN.gradients.sanctuary;
  }, [resolvedBackground]);

  return (
    <div
      className="page-container"
      style={{ background: bg, color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif }}
    >
      <div className="scrollable">{children}</div>
      <CrisisFooter />
    </div>
  );
}
