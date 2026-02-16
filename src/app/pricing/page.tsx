'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';
import { TIERS, getSubscription, setSubscriptionTier, type SubscriptionTier } from '@/lib/subscription';

const order: SubscriptionTier[] = ['free', 'reflections', 'sanctuary'];

export default function PricingPage() {
  const [tier, setTier] = useState<SubscriptionTier>(() => getSubscription().tier);
  const [status, setStatus] = useState('');

  const plans = useMemo(() => order.map((key) => ({ key, config: TIERS[key] })), []);

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Pricing" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        {plans.map(({ key, config }) => {
          const isCurrent = key === tier;
          const isRecommended = key === 'reflections';

          return (
            <SanctuaryCard key={key} elevated={isCurrent || isRecommended}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: DESIGN.spacing.sm, alignItems: 'center' }}>
                <div>
                  <SanctuaryText variant="title">{config.name}</SanctuaryText>
                  <SanctuaryText variant="caption">{config.price}</SanctuaryText>
                </div>
                <div style={{ display: 'grid', gap: DESIGN.spacing.xs }}>
                  {isRecommended ? <span style={badgeStyle}>Most popular</span> : null}
                  {isCurrent ? <span style={currentBadgeStyle}>Current plan</span> : null}
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

              <button
                type="button"
                onClick={() => {
                  setSubscriptionTier(key);
                  setTier(key);
                  setStatus(`Plan updated: ${config.name}`);
                }}
                disabled={isCurrent}
                style={{ ...ctaStyle, opacity: isCurrent ? 0.65 : 1 }}
              >
                {isCurrent ? 'Current plan' : 'Choose plan'}
              </button>
            </SanctuaryCard>
          );
        })}

        {status ? <SanctuaryText variant="khepera">{status}</SanctuaryText> : null}

        <SanctuaryText variant="muted" style={{ textAlign: 'center' }}>
          Journal writing, crisis support, and data export are always available on every tier.
        </SanctuaryText>
        <Link href="/privacy-policy/" style={{ ...subtleLinkStyle, textAlign: 'center' }}>View privacy policy</Link>
      </div>
    </SanctuaryLayout>
  );
}

const ctaStyle: React.CSSProperties = {
  marginTop: DESIGN.spacing.md,
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
  color: '#fff',
  fontFamily: DESIGN.typography.sansSerif,
  padding: '10px 16px',
};

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

const currentBadgeStyle: React.CSSProperties = {
  ...badgeStyle,
  borderColor: DESIGN.colors.sage,
  color: DESIGN.colors.sageBright,
};
