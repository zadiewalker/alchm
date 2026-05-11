'use client';

import type React from 'react';
import { AppCard } from '@/components/ui/AppCard';

type KheperaCardProps = React.ComponentProps<typeof AppCard>;

export const ALCHM_SURFACE_ROLE = 'khepera-gravity';

export function KheperaCard({ className, ...props }: KheperaCardProps): React.JSX.Element {
  return (
    <AppCard
      {...props}
      variant="khepera"
      className={['khepera-quote-card', 'reflective-surface', 'khepera-surface', 'khepera-presence', className].filter(Boolean).join(' ')}
    />
  );
}
