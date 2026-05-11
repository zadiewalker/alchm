
import { useRouter } from '@/router';
import { TIERS, beginTransformation, getEntitlementState, isTrialActive, trackConversionEvent } from '@/lib/subscription';
import { useEffect } from 'react';

export default function PricingPage() {
  const router = useRouter();
  const entitlement = getEntitlementState();
  const trialActive = isTrialActive(entitlement);

  useEffect(() => {
    trackConversionEvent('pricing_page_viewed');
  }, []);

  return (
    <div className="pricing-page">
      <button type="button" onClick={() => router.back()} className="back-button back-button--icon" aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18L9 12L15 6" />
        </svg>
      </button>

      <h1 className="page-header-title" style={{ marginTop: '12px' }}>Support your practice</h1>
      <p className="page-header-subtitle" style={{ marginBottom: 0 }}>Taste first. Upgrade only if it serves you.</p>

      <div className="pricing-tiers">
        {(['growth', 'transformation'] as Array<keyof typeof TIERS>).map((id) => {
          const tier = TIERS[id];
          const isCurrent = entitlement.tier === id;
          return (
            <div
              key={id}
              className={`pricing-card${id === 'transformation' ? ' pricing-card--recommended' : ''}${isCurrent ? ' pricing-card--current' : ''}`}
            >
              <div className="pricing-card-name">{tier.name}</div>
              <div className="pricing-card-price">
                {String(tier.price).includes('/mo') ? (
                  <>
                    {String(tier.price).replace('/mo', '')}
                    <span className="pricing-period">/mo</span>
                  </>
                ) : tier.price}
              </div>
              <div className="pricing-card-description">{tier.description}</div>
              {isCurrent ? <div className="pricing-current-label">Current plan</div> : null}
              <div style={{ marginTop: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.70)', lineHeight: 1.55 }}>
                {tier.features.join(' · ')}
              </div>
              {id === 'transformation' ? (
                <div style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%' }}
                    disabled={isCurrent}
                    onClick={() => {
                      beginTransformation('pricing_page');
                    }}
                  >
                    {isCurrent ? 'Current plan' : trialActive ? 'Transformation active' : 'Begin Transformation'}
                  </button>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>7-day free trial · Cancel anytime</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="page-header-subtitle" style={{ marginTop: 18 }}>
        ALCHM will always have a meaningful free tier. Healing shouldn&apos;t be locked behind a paywall.
      </p>
      <p style={{ marginTop: 8, textAlign: 'center', color: 'rgba(255,255,255,0.60)', fontSize: '13px' }}>988 · Crisis support</p>
    </div>
  );
}
