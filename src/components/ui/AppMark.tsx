'use client';

import type React from 'react';
import { ScarabLogo } from '@/components/ui/ScarabLogo';

const SIZE_MAP = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

type AppMarkProps = {
  size?: keyof typeof SIZE_MAP | number;
  className?: string;
  decorative?: boolean;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

export function AppMark({
  size = 'md',
  className,
  decorative = false,
  style,
  ariaLabel,
}: AppMarkProps): React.JSX.Element {
  const variant =
    typeof size === 'number'
      ? size <= 40
        ? 'sm'
        : size <= 64
        ? 'md'
        : 'lg'
      : SIZE_MAP[size];

  return (
    <span className={className} style={style}>
      <ScarabLogo variant={variant} decorative={decorative} ariaLabel={ariaLabel} />
    </span>
  );
}
