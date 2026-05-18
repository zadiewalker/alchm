'use client';

import type React from 'react';
import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function SignupPage() {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Join ALCHM" showBack />}>
      <div style={{ minHeight: '65vh', display: 'grid', placeItems: 'center' }}>
        <SanctuaryCard elevated style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>Begin Writing</SanctuaryText>
          <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.md }}>Create your private reflection space</SanctuaryText>
          <Link href="/dashboard/" style={primaryActionStyle}>Demo Signup</Link>
          <SanctuaryText variant="muted" style={{ marginTop: DESIGN.spacing.md }}>
            Already have an account? <Link href="/auth/login/" style={inlineLinkStyle}>Sign in</Link>
          </SanctuaryText>
        </SanctuaryCard>
      </div>
    </SanctuaryLayout>
  );
}

const primaryActionStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  padding: '10px 18px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
  color: '#fff',
  textDecoration: 'none',
  fontFamily: DESIGN.typography.sansSerif,
};

const inlineLinkStyle: React.CSSProperties = {
  color: DESIGN.colors.textKhepera,
  textDecoration: 'underline',
  fontFamily: DESIGN.typography.sansSerif,
};
