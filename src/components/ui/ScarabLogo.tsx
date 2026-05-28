'use client';

import type React from 'react';

const VARIANT_CLASS: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'scarab-logo--sm',
  md: 'scarab-logo--md',
  lg: 'scarab-logo--lg',
};

type ScarabLogoProps = {
  variant?: 'sm' | 'md' | 'lg';
  className?: string;
  decorative?: boolean;
  ariaLabel?: string;
};

export function ScarabLogo({
  variant = 'md',
  className = '',
  decorative = false,
  ariaLabel = 'ALCHM scarab',
}: ScarabLogoProps): React.JSX.Element {
  return (
    <span
      className={['scarab-logo', VARIANT_CLASS[variant], className].filter(Boolean).join(' ')}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <img
        src="/scarab-logo.svg"
        alt={decorative ? '' : ariaLabel}
        className="scarab-logo__image"
        draggable="false"
      />
    </span>
  );
}
