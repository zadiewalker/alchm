'use client';

import type React from 'react';

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
  const resolvedSize =
    typeof size === 'number'
      ? size
      : SIZE_MAP[size] === 'sm'
      ? 28
      : SIZE_MAP[size] === 'md'
      ? 44
      : 64;

  const accessibilityProps = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': ariaLabel || 'ALCHM mark' };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        width: resolvedSize,
        height: resolvedSize,
        borderRadius: '999px',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-gold-soft)',
        ...style,
      }}
      {...accessibilityProps}
    >
      ☾
    </span>
  );
}
