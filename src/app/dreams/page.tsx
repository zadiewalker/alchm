'use client';

import type React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DreamAnalysis from '@/components/DreamAnalysis';
import { safeLocalStorage } from '@/utils/browser';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { LoadingState } from '@/components/ui/LoadingState';
import { DESIGN } from '@/lib/design';

export default function DreamsPage() {
  const [userTier, setUserTier] = useState<'sanctuary' | 'growth' | 'transformation'>('sanctuary');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTier = safeLocalStorage.getItem('userTier') as 'sanctuary' | 'growth' | 'transformation';
    if (storedTier) setUserTier(storedTier);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Dreams" showBack />}>
        <LoadingState message="Preparing dream space..." />
      </SanctuaryLayout>
    );
  }

  const canAccess = userTier === 'transformation';

  if (!canAccess) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Dreams" showBack />}>
        <SanctuaryCard elevated style={{ textAlign: 'center' }}>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>Dream Analysis Locked</SanctuaryText>
          <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.md }}>
            Access to advanced dream interpretation requires a Transformation subscription.
          </SanctuaryText>
          <Link href="/pricing/" style={ctaStyle}>Upgrade to Transformation</Link>
        </SanctuaryCard>
      </SanctuaryLayout>
    );
  }

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Dreams & Intuition" showBack />}>
      <SanctuaryCard>
        <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
          Unlock the wisdom of your subconscious through dream analysis and shadow integration.
        </SanctuaryText>
        <DreamAnalysis />
      </SanctuaryCard>
    </SanctuaryLayout>
  );
}

const ctaStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
  color: '#fff',
  textDecoration: 'none',
  fontFamily: DESIGN.typography.sansSerif,
  padding: '10px 16px',
};
