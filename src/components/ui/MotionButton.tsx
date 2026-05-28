'use client';

import type React from 'react';
import { AppText } from '@/components/ui/AppText';

type MotionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'primary' | 'ghost';
  textVariant?: 'body' | 'label' | 'whisper';
};

export function MotionButton({
  label,
  variant = 'primary',
  textVariant = 'label',
  className,
  ...props
}: MotionButtonProps): React.JSX.Element {
  const buttonClassName = [variant === 'primary' ? 'btn-primary' : 'btn-ghost', 'motion-button', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button {...props} className={buttonClassName}>
      <AppText
        variant={textVariant}
        as="span"
        style={{
          color: variant === 'primary' ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontWeight: variant === 'primary' ? 'var(--font-weight-semibold)' : undefined,
        }}
      >
        {label}
      </AppText>
    </button>
  );
}
