'use client';

import type React from 'react';
import { AppCard } from '@/components/ui/AppCard';

type RitualCardProps = React.ComponentProps<typeof AppCard>;

export function RitualCard({ className, ...props }: RitualCardProps): React.JSX.Element {
  return <AppCard {...props} variant="ritual" className={['held-surface', className].filter(Boolean).join(' ')} />;
}
