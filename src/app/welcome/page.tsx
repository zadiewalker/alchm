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
            Your digital sanctuary for healing and transformation. Khepera is here to reflect what is true for you.
          </SanctuaryText>
        </SanctuaryCard>

        <SanctuaryCard>
          <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
            <SanctuaryText variant="body">Safe & private reflection space</SanctuaryText>
            <SanctuaryText variant="body">AI-guided insights without judgment</SanctuaryText>
            <SanctuaryText variant="body">Your pace, your way</SanctuaryText>
          </div>
        </SanctuaryCard>

        <Link href="/dashboard/" style={primaryActionStyle}>Enter Your Sanctuary</Link>
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
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
  color: '#fff',
  textDecoration: 'none',
  fontFamily: DESIGN.typography.sansSerif,
};
