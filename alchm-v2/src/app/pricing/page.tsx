'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DESIGN } from '@/lib/design';
import { TIERS } from '@/lib/subscription';

export default function PricingPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '28px 20px' }}>
      <button type="button" onClick={() => router.push('/dashboard/')} aria-label="Return to dashboard" className="btn-ghost">
        ← Dashboard
      </button>

      <h1 style={{ margin: '12px 0 0', fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
        Pricing
      </h1>
      <div className="card" style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
          Subscriptions are coming with App Store launch. Everything is unlocked in this build.
        </div>
      </div>

      <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(Object.keys(TIERS) as Array<keyof typeof TIERS>).map((id) => {
          const tier = TIERS[id];
          const isRecommended = id === 'reflections';
          return (
            <div
              key={id}
              className={isRecommended ? 'card card-elevated' : 'card'}
              style={{ fontFamily: DESIGN.typography.sansSerif }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                <div>
                  {isRecommended ? (
                    <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: DESIGN.colors.sage400, marginBottom: '6px' }}>
                      Recommended
                    </div>
                  ) : null}
                  <div style={{ fontSize: '16px', fontWeight: DESIGN.typography.weights.semibold }}>{tier.name}</div>
                </div>
                <div style={{ fontSize: '13px', color: isRecommended ? DESIGN.colors.gold : DESIGN.colors.textSecondary }}>{tier.price}</div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                {tier.description}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tier.features.slice(0, 6).map((f) => (
                  <div key={f} style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, display: 'flex', gap: '8px' }}>
                    <span aria-hidden="true" style={{ color: DESIGN.colors.sage400 }}>
                      ✓
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
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
