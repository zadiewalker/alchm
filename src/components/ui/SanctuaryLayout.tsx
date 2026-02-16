'use client';

import type React from 'react';
import { DESIGN, pageContainerStyle } from '@/lib/design';
import { CrisisFooter } from '@/components/CrisisFooter';

interface SanctuaryLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  showCrisisFooter?: boolean;
  noPadding?: boolean;
}

export function SanctuaryLayout({ children, header, showCrisisFooter = false, noPadding = false }: SanctuaryLayoutProps) {
  return (
    <div
      style={{
        ...pageContainerStyle,
        paddingLeft: noPadding ? 0 : DESIGN.spacing.pagePadding,
        paddingRight: noPadding ? 0 : DESIGN.spacing.pagePadding,
        paddingTop: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {header}
      <main style={{ flex: 1, paddingBottom: DESIGN.spacing.lg }}>{children}</main>
      {showCrisisFooter ? <CrisisFooter /> : null}
    </div>
  );
}
