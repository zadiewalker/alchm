'use client';

import type React from 'react';
import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function PrivacyPage() {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Privacy" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>Your privacy matters</SanctuaryText>
          <SanctuaryText variant="body">Control your data and privacy settings in your private reflection space.</SanctuaryText>
        </SanctuaryCard>

        <SanctuaryCard>
          <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
            <Link href="/settings/" style={linkStyle}>Privacy Settings</Link>
            <Link href="/privacy-policy/" style={linkStyle}>Privacy Policy</Link>
          </div>
        </SanctuaryCard>
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
