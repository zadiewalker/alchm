'use client';

// ALCHM_IDENTITY_ROLE: utility-screen

import { useCallback } from 'react';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { usePaywallController } from '@/hooks/usePaywallController';

export default function PaywallPage(): React.JSX.Element {
  const { navigate: navigateInternal } = useInternalNavigation();
  const { navigate } = useSafeNavigation();
  const {
    offerState,
    isRestoring,
    feedback,
    helperLine,
    recordTransformationCtaTap,
    restore,
  } = usePaywallController();

  const handleOpenTransformation = useCallback(() => {
    recordTransformationCtaTap();
    navigateInternal('/upgrade', { source: 'paywall_transformation', surface: 'upgrade' });
  }, [navigateInternal, recordTransformationCtaTap]);

  const handleRestore = useCallback(async () => {
    const result = await restore();
    if (result?.status === 'restored') {
      navigate('/journal/new', { replace: true, source: 'paywall_restore' });
    }
  }, [navigate, restore]);

  const showPurchaseCta = offerState.status === 'ready';
  const calmFallbackVisible =
    offerState.status === 'unavailable' || offerState.status === 'error';

  return (
    <div className="paywall-screen">
      <BackButton
        navigation={{ fallback: '/dashboard' }}
        label="Back"
        style={{
          position: 'absolute',
          top: 'calc(var(--safe-top) + var(--space-5))',
          left: 'var(--screen-padding-horizontal)',
          zIndex: 2,
        }}
      />

      <div className="paywall-center">
        <div className="paywall-copy">
          <AppText variant="label" as="p" className="paywall-body">
            Subscription access
          </AppText>
          <AppText variant="display" as="h1" className="paywall-title">
            Transformation
          </AppText>
          <AppText variant="secondary" as="p" className="paywall-body">
            {'ALCHM is a space to write and return.\n\nTransformation keeps longer returns and selected writing in reach over time.\n\nNothing is taken away from Sanctuary, and there is no pressure to decide now.'}
          </AppText>
          <div className="paywall-price-block" aria-live="polite">
            {helperLine ? (
              <>
                <AppText variant="body" as="p" className="paywall-price-line">
                  {helperLine}
                </AppText>
                {offerState.status === 'ready' && offerState.priceLine ? (
                  <AppText variant="caption" as="p" className="paywall-renewal-line">
                    Monthly. Renews automatically until cancelled.
                  </AppText>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="paywall-primary-zone">
          {showPurchaseCta ? (
            <button
              type="button"
              className="btn-primary paywall-primary-cta"
              onClick={handleOpenTransformation}
            >
              Open Transformation
            </button>
          ) : null}
          <div className="paywall-status" aria-live="polite">
            {calmFallbackVisible ? (
              <>
                <AppText variant="caption" as="p" className="paywall-status-copy">
                  {offerState.message}
                </AppText>
                <AppText variant="caption" as="p" className="paywall-status-copy">
                  You can keep writing and return to this later.
                </AppText>
              </>
            ) : null}
            {feedback.status ? (
              <AppText variant="caption" as="p" className="paywall-status-copy">
                {feedback.status}
              </AppText>
            ) : null}
            {feedback.error ? (
              <AppText variant="caption" as="p" className="paywall-status-copy">
                {feedback.error}
              </AppText>
            ) : null}
          </div>
        </div>
      </div>

      <div className="paywall-secondary-zone">
        <button
          type="button"
          className="btn-ghost"
          onClick={handleRestore}
          disabled={isRestoring}
        >
          {isRestoring ? 'Restoring…' : 'Restore purchases'}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => navigate('/journal/new', { replace: true, source: 'paywall_not_now' })}
        >
          Continue writing
        </button>
      </div>
    </div>
  );
}
