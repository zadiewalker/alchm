'use client';

import type React from 'react';
import { AppCard } from '@/components/ui/AppCard';

type SystemCardProps = React.ComponentProps<typeof AppCard>;

export function SystemCard({ className, ...props }: SystemCardProps): React.JSX.Element {
  return <AppCard {...props} variant="system" className={['system-card-shell', className].filter(Boolean).join(' ')} />;
}
