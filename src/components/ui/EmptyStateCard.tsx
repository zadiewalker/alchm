'use client';

import type React from 'react';
import { AppCard } from '@/components/ui/AppCard';

type EmptyStateCardProps = React.ComponentProps<typeof AppCard>;

export function EmptyStateCard({ className, ...props }: EmptyStateCardProps): React.JSX.Element {
  return <AppCard {...props} variant="empty" className={['empty-state-shell', className].filter(Boolean).join(' ')} />;
}
