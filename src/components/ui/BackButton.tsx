'use client';

import type { CSSProperties } from 'react';
import type { BackNavigationConfig } from '@/types/navigation';
import { useSafeBackNavigation } from '@/hooks/useSafeBackNavigation';

type BackButtonProps = {
  navigation: BackNavigationConfig;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export function BackButton({
  navigation,
  label = 'Back',
  className,
  style,
}: BackButtonProps): React.JSX.Element {
  const { goBack } = useSafeBackNavigation(navigation);

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      className={['btn-icon', className].filter(Boolean).join(' ')}
      style={style}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M15 6L9 12L15 18"
          stroke="var(--text-primary)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
