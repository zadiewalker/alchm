
import { useRouter } from '@/router';
import { TIERS } from '@/lib/subscription';

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="pricing-page">
      <button type="button" onClick={() => router.back()} className="back-button back-button--icon" aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18L9 12L15 6" />
        </svg>
      </button>

      <h1 className="page-header-title" style={{ marginTop: '12px' }}>Go deeper</h1>
      <p className="page-header-subtitle" style={{ marginBottom: 0 }}>Choose what feels right.</p>

      <div className="pricing-tiers">
        {(['free', 'reflections'] as Array<keyof typeof TIERS>).map((id) => {
          const tier = TIERS[id];
          const isRecommended = id === 'reflections';
          const isCurrent = id === 'free';
          return (
            <div
              key={id}
              className={`pricing-card${isRecommended ? ' pricing-card--recommended' : ''}${isCurrent ? ' pricing-card--current' : ''}`}
            >
              {isRecommended ? <span className="pricing-recommended-badge">Recommended</span> : null}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
