'use client';

import Link from 'next/link';
import type React from 'react';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function PricingPage(): React.JSX.Element {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Subscription" showBack />}>
      <SanctuaryCard elevated>
        <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>
          Transformation
        </SanctuaryText>
        <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.md }}>
          Journal writing, crisis resources, and your saved words remain available without an upgrade.
        </SanctuaryText>
        <Link href="/paywall/" style={linkStyle}>View subscription options</Link>
      </SanctuaryCard>
    </SanctuaryLayout>
  );
}

const linkStyle: React.CSSProperties = {
  color: DESIGN.colors.textSecondary,
  textDecoration: 'underline',
  fontFamily: DESIGN.typography.sansSerif,
};
