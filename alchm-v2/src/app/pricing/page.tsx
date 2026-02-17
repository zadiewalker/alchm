'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DESIGN } from '@/lib/design';
import { TIERS } from '@/lib/subscription';

export default function PricingPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '28px 20px' }}>
      <button
        type="button"
        onClick={() => router.push('/dashboard/')}
        aria-label="Return to dashboard"
        style={{
          border: 'none',
          background: 'transparent',
          color: DESIGN.colors.gold,
          fontFamily: DESIGN.typography.sansSerif,
          fontSize: '15px',
          cursor: 'pointer',
          minHeight: '44px',
          padding: 0,
        }}
      >
        ← Dashboard
      </button>

      <h1 style={{ margin: '12px 0 0', fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
        Pricing
      </h1>
      <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
        Subscriptions will be available through the App Store at launch. This build does not process payments.
      </div>

      <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(Object.keys(TIERS) as Array<keyof typeof TIERS>).map((id) => {
          const tier = TIERS[id];
          return (
            <div
              key={id}
              style={{
                backgroundColor: DESIGN.colors.cardBg,
                border: `1px solid ${DESIGN.colors.border}`,
                borderRadius: DESIGN.radius.lg,
                padding: '14px',
                fontFamily: DESIGN.typography.sansSerif,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                <div style={{ fontSize: '16px', fontWeight: DESIGN.typography.weights.semibold }}>{tier.name}</div>
                <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary }}>{tier.price}</div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                {tier.description}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tier.features.slice(0, 6).map((f) => (
                  <div key={f} style={{ fontSize: '13px', color: DESIGN.colors.textSecondary }}>
                    • {f}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '12px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                Coming soon on the App Store.
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '22px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '16px' }}>
        <span
          style={{ color: DESIGN.colors.gold, cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => router.push('/privacy/')}
          aria-label="Open privacy policy"
          role="button"
        >
          Privacy Policy
        </span>
        {' · '}
        <span
          style={{ color: DESIGN.colors.gold, cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => router.push('/terms/')}
          aria-label="Open terms of service"
          role="button"
        >
          Terms of Service
        </span>
      </div>
    </div>
  );
}
