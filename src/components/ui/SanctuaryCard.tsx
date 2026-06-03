'use client';

import type React from 'react';
import { cardStyle, DESIGN } from '@/lib/design';

interface SanctuaryCardProps {
  children: React.ReactNode;
  elevated?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function SanctuaryCard({ children, elevated = false, onClick, style }: SanctuaryCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={{
        ...cardStyle(elevated),
        cursor: onClick ? 'pointer' : 'default',
        minHeight: '44px',
        position: 'relative',
        overflow: 'hidden',
        ...(onClick ? { WebkitTapHighlightColor: 'transparent' } : {}),
        ...style,
      }}
      onMouseEnter={(event) => {
        if (onClick) event.currentTarget.style.backgroundColor = DESIGN.colors.cardBgHover;
      }}
      onMouseLeave={(event) => {
        if (onClick) event.currentTarget.style.backgroundColor = elevated ? DESIGN.colors.bgElevated : DESIGN.colors.cardBg;
      }}
    >
      {children}
    </div>
  );
}
