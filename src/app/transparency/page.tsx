'use client';

import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function TransparencyPage() {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Transparency" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>
            ALCHM transparency
          </SanctuaryText>
          <SanctuaryText variant="body">
            This page will publish operational transparency reports when audited production data is available. ALCHM does not
            show emotional analytics, rankings, streaks, or progress scoring.
          </SanctuaryText>
        </SanctuaryCard>

        <SanctuaryCard>
          <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.xs }}>
            Current commitments
          </SanctuaryText>
          <div style={{ display: 'grid', gap: DESIGN.spacing.xs }}>
            <SanctuaryText variant="caption">Khepera reflections remain reflection-only.</SanctuaryText>
            <SanctuaryText variant="caption">Crisis resources remain available without hiding behind AI.</SanctuaryText>
            <SanctuaryText variant="caption">Privacy controls and export remain available in Settings.</SanctuaryText>
          </div>
        </SanctuaryCard>

        <Link href="/privacy/" style={{ textDecoration: 'none' }}>
          <SanctuaryCard>
            <SanctuaryText variant="body" style={{ margin: 0 }}>
              Manage privacy settings
            </SanctuaryText>
          </SanctuaryCard>
        </Link>
      </div>
    </SanctuaryLayout>
  );
}
