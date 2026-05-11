'use client';

import type React from 'react';
import type { AppCardProps } from '@/types/ui';

export function AppCard({
  children,
  variant = 'standard',
  elevated,
  onClick,
  style,
  className,
  role,
  ...rest
}: AppCardProps): React.JSX.Element {
  const effectiveVariant = elevated ? 'elevated' : variant;
  const cardClass = ['card', `card-${effectiveVariant}`, `surface-${effectiveVariant}`, onClick ? 'card-interactive' : '', className]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div
      {...rest}
      onClick={onClick}
      role={role ?? (onClick ? 'button' : undefined)}
      className={cardClass}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
