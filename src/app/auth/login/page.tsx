'use client';

import type React from 'react';
import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function LoginPage() {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Sign In" showBack />}>
      <div style={{ minHeight: '65vh', display: 'grid', placeItems: 'center' }}>
        <SanctuaryCard elevated style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>Welcome Back</SanctuaryText>
          <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.md }}>Sign in to your private reflection space</SanctuaryText>
          <Link href="/dashboard/" style={primaryActionStyle}>Demo Login</Link>
          <SanctuaryText variant="muted" style={{ marginTop: DESIGN.spacing.md }}>
            Need an account? <Link href="/auth/signup/" style={inlineLinkStyle}>Create one</Link>
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
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.bgElevated,
  color: DESIGN.colors.textPrimary,
  textDecoration: 'none',
  fontFamily: DESIGN.typography.sansSerif,
};

const inlineLinkStyle: React.CSSProperties = {
  color: DESIGN.colors.textKhepera,
  textDecoration: 'underline',
  fontFamily: DESIGN.typography.sansSerif,
};
