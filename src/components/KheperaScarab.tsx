import type React from 'react';
import type { CSSProperties } from 'react';
import { AppMark } from '@/components/ui/AppMark';
import type { KheperaScarabProps } from '@/types/components';

export function KheperaPresence({
  size = 16,
  style,
  className = '',
  decorative = true,
}: Omit<KheperaScarabProps, 'showSunDisk' | 'ariaLabel'>): React.JSX.Element {
  return (
    <KheperaScarab
      size={size}
      showSunDisk={false}
      style={style}
      className={className}
      decorative={decorative}
    />
  );
}

export function KheperaScarab({
  size = 120,
  style,
  className = '',
  decorative = false,
  ariaLabel,
}: KheperaScarabProps): React.JSX.Element {
  const finalAriaLabel = ariaLabel || 'ALCHM icon';

  return (
    <AppMark
      size={size}
      className={className}
      decorative={decorative}
      style={style}
      ariaLabel={finalAriaLabel}
    />
  );
}
