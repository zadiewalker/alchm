'use client';

import type React from 'react';
import { useMemo } from 'react';
import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';
import { TIERS, type SubscriptionTier } from '@/lib/subscription';

const order: SubscriptionTier[] = ['free', 'reflections', 'sanctuary'];

export default function PricingPage() {
  const plans = useMemo(() => order.map((key) => ({ key, config: TIERS[key] })), []);

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Pricing" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>
            Subscriptions coming soon
          </SanctuaryText>
          <SanctuaryText variant="body">
            ALCHM subscriptions will be available through the App Store once StoreKit purchase flow is implemented. For now,
            the app experience is fully available without purchase.
          </SanctuaryText>
        </SanctuaryCard>

        {plans.map(({ key, config }) => {
          const isRecommended = key === 'reflections';

          return (
            <SanctuaryCard key={key} elevated={isRecommended}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: DESIGN.spacing.sm, alignItems: 'center' }}>
                <div>
                  <SanctuaryText variant="title">{config.name}</SanctuaryText>
                  <SanctuaryText variant="caption">Planned tier</SanctuaryText>
                </div>
                <div style={{ display: 'grid', gap: DESIGN.spacing.xs }}>
                  {isRecommended ? <span style={badgeStyle}>Most popular</span> : null}
                </div>
              </div>

              <SanctuaryText variant="muted" style={{ marginTop: DESIGN.spacing.xs }}>
                {config.description}
              </SanctuaryText>

              <ul style={listStyle}>
                {config.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </SanctuaryCard>
          );
        })}

        <SanctuaryText variant="muted" style={{ textAlign: 'center' }}>
          Journal writing, crisis support, and data export are always available on every tier.
        </SanctuaryText>
        <Link href="/privacy-policy/" style={{ ...subtleLinkStyle, textAlign: 'center' }}>Privacy Policy</Link>
        <Link href="/terms/" style={{ ...subtleLinkStyle, textAlign: 'center' }}>Terms of Service</Link>
      </div>
    </SanctuaryLayout>
  );
}

const listStyle: React.CSSProperties = {
  margin: `${DESIGN.spacing.sm} 0 0`,
  paddingLeft: 18,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  lineHeight: DESIGN.typography.lineHeights.relaxed,
};

const subtleLinkStyle: React.CSSProperties = {
  color: DESIGN.colors.textSecondary,
  textDecoration: 'underline',
  fontFamily: DESIGN.typography.sansSerif,
};

const badgeStyle: React.CSSProperties = {
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  color: DESIGN.colors.textKhepera,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.xs,
  padding: '4px 8px',
};
