'use client';

import type React from 'react';
import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function TransparencyPage(): React.JSX.Element {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Transparency" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
            Transparency reporting
          </SanctuaryText>
          <SanctuaryText variant="body" style={{ margin: 0 }}>
            No verified transparency report is published in this build.
          </SanctuaryText>
          <SanctuaryText variant="body" style={{ marginTop: DESIGN.spacing.sm }}>
            Reporting will be shown here only after the underlying data, review process, and audit trail
            are established.
          </SanctuaryText>
        </SanctuaryCard>

        <Link href="/privacy-policy/" style={linkStyle}>
          Review privacy information
        </Link>
      </div>
    </SanctuaryLayout>
  );
}

const linkStyle: React.CSSProperties = {
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textPrimary,
  textDecoration: 'none',
  fontFamily: DESIGN.typography.sansSerif,
  padding: '10px 14px',
};
