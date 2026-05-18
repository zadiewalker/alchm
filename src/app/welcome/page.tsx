'use client';

import type React from 'react';
import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function WelcomePage() {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Welcome" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>Welcome to ALCHM</SanctuaryText>
          <SanctuaryText variant="body">
            A private space for quiet reflection. Khepera reflects what is present without advice or judgment.
          </SanctuaryText>
        </SanctuaryCard>

        <SanctuaryCard>
          <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
            <SanctuaryText variant="body">Safe & private reflection space</SanctuaryText>
            <SanctuaryText variant="body">Reflection without judgment</SanctuaryText>
            <SanctuaryText variant="body">Your pace, your way</SanctuaryText>
          </div>
        </SanctuaryCard>

        <Link href="/dashboard/" style={primaryActionStyle}>Open ALCHM</Link>
      </div>
    </SanctuaryLayout>
  );
}

const primaryActionStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  padding: '12px 18px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.bgElevated,
  color: DESIGN.colors.textPrimary,
  textDecoration: 'none',
  fontFamily: DESIGN.typography.sansSerif,
};
