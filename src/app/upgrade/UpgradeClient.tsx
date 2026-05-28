'use client';
import { useRef, useState } from 'react';
import { SUBSCRIPTION_COPY, TRANSFORMATION_FALLBACK_PRICE } from '@/config/subscriptions';
import { useSubscription } from '@/hooks/useSubscription';
import { AppLayout } from '@/components/ui/AppLayout';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { TierCard } from '@/components/subscriptions/TierCard';
import { FeatureComparison } from '@/components/subscriptions/FeatureComparison';
import { RestorePurchasesButton } from '@/components/subscriptions/RestorePurchasesButton';
import { SubscriptionDiagnosticsPanel } from '@/components/subscriptions/SubscriptionDiagnosticsPanel';
import { AppCard } from '@/components/ui/AppCard';
import { useSafeBackNavigation } from '@/hooks/useSafeBackNavigation';
import { useOperationalEvents } from '@/hooks/useOperationalEvents';

export default function UpgradeClient(): React.JSX.Element {
  const subscription = useSubscription();
  const recordEvent = useOperationalEvents();
  const { goBack } = useSafeBackNavigation({ fallback: '/settings' });
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  const transformationPrice =
    subscription.offerings.find((item) => item.packageType?.toUpperCase() === 'MONTHLY')?.priceString ??
    subscription.offerings[0]?.priceString ??
    TRANSFORMATION_FALLBACK_PRICE;
  const subscriptionStateMessages = Array.from(new Set([
    subscription.isLoading && !subscription.isReady ? 'Loading subscription options.' : null,
    localStatus,
    subscription.hasTransformation ? subscription.statusMessage : null,
  ].filter((message): message is string => Boolean(message))));
  const openSubscriptionOptions = (): void => {
    recordEvent('upgrade_options_tap', {
      surface: 'upgrade',
      route: '/upgrade',
      hasAccess: subscription.hasTransformation,
      hasOffering: subscription.offerings.length > 0,
    });
    recordEvent('subscription_options_scroll_requested', {
      surface: 'upgrade',
      route: '/upgrade',
      hasAccess: subscription.hasTransformation,
      hasOffering: subscription.offerings.length > 0,
    });

    if (optionsRef.current) {
      optionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      recordEvent('subscription_options_scroll_success', {
        surface: 'upgrade',
        route: '/upgrade',
        hasAccess: subscription.hasTransformation,
        hasOffering: subscription.offerings.length > 0,
      });
      setLocalStatus(null);
      return;
    }

    setLocalStatus('Subscription options could not move into view. They are available below.');
    recordEvent('subscription_options_scroll_failed', {
      surface: 'upgrade',
      route: '/upgrade',
      hasAccess: subscription.hasTransformation,
      hasOffering: subscription.offerings.length > 0,
      errorCode: 'pricing_ref_unavailable',
    });
  };

  const purchaseTransformation = async (): Promise<void> => {
    recordEvent('purchase_cta_tap', {
      surface: 'upgrade',
      route: '/upgrade',
      hasAccess: subscription.hasTransformation,
      hasOffering: subscription.offerings.length > 0,
    });

    recordEvent('purchase_cta_started', {
      surface: 'upgrade',
      route: '/upgrade',
      hasAccess: subscription.hasTransformation,
      hasOffering: subscription.offerings.length > 0,
    });

    try {
      setLocalStatus('Opening purchase options.');

      if (!subscription.hasTransformation && subscription.canPresentNativeSubscriptionScreen) {
        const presented = await subscription.openNativeSubscriptionScreen();

        if (presented) {
          setLocalStatus(null);
          return;
        }

        recordEvent('purchase_cta_failed', {
          surface: 'upgrade',
          route: '/upgrade',
          hasAccess: subscription.hasTransformation,
          hasOffering: subscription.offerings.length > 0,
          errorCode: 'native_subscription_screen_unavailable',
        });
      }

      const result = await subscription.purchaseTransformation();
      if (result.status === 'cancelled') {
        setLocalStatus('Purchase was not completed.');
      } else if (result.status === 'purchased') {
        setLocalStatus(null);
      }
      if (result.status === 'error') {
        setLocalStatus('Purchase options could not open right now. You can keep writing in Sanctuary.');
        recordEvent('purchase_cta_failed', {
          surface: 'upgrade',
          route: '/upgrade',
          hasAccess: subscription.hasTransformation,
          hasOffering: subscription.offerings.length > 0,
          errorCode: result.reason,
        });
      }
    } catch (error) {
      setLocalStatus('Purchase options could not open right now. You can keep writing in Sanctuary.');
      recordEvent('purchase_cta_failed', {
        surface: 'upgrade',
        route: '/upgrade',
        hasAccess: subscription.hasTransformation,
        hasOffering: subscription.offerings.length > 0,
        errorCode: error instanceof Error ? error.name : 'unknown_error',
      });
    }
  };

  const restorePurchases = async (): Promise<void> => {
    recordEvent('restore_cta_tap', {
      surface: 'upgrade',
      route: '/upgrade',
      hasAccess: subscription.hasTransformation,
      hasOffering: subscription.offerings.length > 0,
    });
    try {
      setLocalStatus('Restoring purchases.');
      const result = await subscription.restorePurchases();
      setLocalStatus(result.message ?? null);
    } catch {
      setLocalStatus('We couldn’t restore purchases right now.');
    }
  };

  return (
    <AppLayout className="page-enter" header={<AppHeader title="Transformation" showBack backNavigation={{ fallback: '/settings' }} />}>
      <div className="upgrade-stack">
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <AppText variant="label" as="p">
            Subscription access
          </AppText>
          <AppText variant="title" as="h1">
            Transformation
          </AppText>
          <AppText variant="secondary" as="p" style={{ whiteSpace: 'pre-line' }}>
            {SUBSCRIPTION_COPY.intro}
          </AppText>
        </div>

        <AppCard>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <AppText variant="secondary" as="p">
              Open subscription options here at any time.
            </AppText>
            <div>
              <button
                type="button"
                className="btn-primary"
                onPointerDown={() => {
                  recordEvent('upgrade_options_tap', {
                    surface: 'upgrade',
                    route: '/upgrade',
                    hasAccess: subscription.hasTransformation,
                    hasOffering: subscription.offerings.length > 0,
                    step: 'pointerdown',
                  });
                }}
                onClick={() => {
                  openSubscriptionOptions();
                }}
              >
                Open subscription options
              </button>
            </div>
          </div>
        </AppCard>

        <div
          ref={optionsRef}
          id="subscription-options"
          className="subscription-options-section"
          style={{ display: 'grid', gap: 'var(--space-4)', scrollMarginTop: 'calc(var(--safe-top) + var(--space-8))' }}
        >
          <TierCard
            title={SUBSCRIPTION_COPY.tiers.sanctuary.title}
            price={SUBSCRIPTION_COPY.tiers.sanctuary.price}
            features={SUBSCRIPTION_COPY.tiers.sanctuary.features}
            ctaLabel={SUBSCRIPTION_COPY.tiers.sanctuary.cta}
            onCta={goBack}
            variant="sanctuary"
            helper="Sanctuary stays complete."
          />

          <TierCard
            title={SUBSCRIPTION_COPY.tiers.transformation.title}
            price={transformationPrice}
            features={SUBSCRIPTION_COPY.tiers.transformation.features}
            ctaLabel={
              subscription.hasTransformation
                ? 'Transformation is active'
                : subscription.isPurchasing
                ? 'Opening purchase…'
                : SUBSCRIPTION_COPY.tiers.transformation.cta
            }
            onCta={() => {
              if (!subscription.hasTransformation) {
                void purchaseTransformation();
              } else {
                setLocalStatus('Transformation is active.');
              }
            }}
            variant="transformation"
            active={subscription.hasTransformation}
            disabled={subscription.isPurchasing || subscription.hasTransformation}
            helper={
              subscription.isLoading && !subscription.isReady
                ? 'Loading subscription options.'
                : 'Transformation keeps longer returns and selected-material export within reach.'
            }
          />
        </div>

        <FeatureComparison
          sanctuaryFeatures={SUBSCRIPTION_COPY.tiers.sanctuary.features}
          transformationFeatures={SUBSCRIPTION_COPY.tiers.transformation.features}
        />

        <AppText variant="secondary" as="p" style={{ whiteSpace: 'pre-line' }}>
          {SUBSCRIPTION_COPY.trustLine}
        </AppText>

        <RestorePurchasesButton
          label={SUBSCRIPTION_COPY.restoreLabel}
          className="restore-purchases-button"
          onRestore={() => {
            void restorePurchases();
          }}
          loading={subscription.isRestoring}
        />

        {subscriptionStateMessages.map((message) => (
          <AppText key={message} variant="secondary" as="p" style={{ whiteSpace: 'pre-line' }}>
            {message}
          </AppText>
        ))}

        {process.env.NODE_ENV === 'development' ? (
          <AppCard>
            <AppText variant="label" as="p">
              Subscription QA
            </AppText>
            <AppText variant="whisper" as="p">
              Tier: {subscription.tier} · configured: {String(subscription.isConfigured)} · offering loaded: {String(subscription.offerings.length > 0)}
            </AppText>
            <AppText variant="whisper" as="p">
              Entitlement active: {String(subscription.hasTransformation)} · status: {subscription.status.source}
            </AppText>
          </AppCard>
        ) : null}

        <SubscriptionDiagnosticsPanel />
      </div>
    </AppLayout>
  );
}
