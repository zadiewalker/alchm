'use client';

import { useSubscriptionDiagnostics } from '@/hooks/useSubscriptionDiagnostics';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';

function formatValue(value: boolean | number | string | string[] | null): string {
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : 'none';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (value === null) {
    return 'none';
  }

  return String(value);
}

export function SubscriptionDiagnosticsPanel(): React.JSX.Element {
  const diagnostics = useSubscriptionDiagnostics();
  const rows = diagnostics.diagnostics
    ? [
        ['platform', diagnostics.diagnostics.platform],
        ['is native iOS', diagnostics.diagnostics.isNativeIos],
        ['RevenueCat configured', diagnostics.diagnostics.isConfigured],
        ['RevenueCat API key present', diagnostics.diagnostics.apiKeyPresent],
        ['RevenueCat API key source', diagnostics.diagnostics.apiKeySource],
        ['configure attempted', diagnostics.diagnostics.configureAttempted],
        ['native config found', diagnostics.diagnostics.nativeConfigFound],
        ['plist key found', diagnostics.diagnostics.plistKeyFound],
        ['offering requested', diagnostics.diagnostics.offeringRequested],
        ['current offering found', diagnostics.diagnostics.currentOfferingFound],
        ['current offering ID', diagnostics.diagnostics.currentOfferingId],
        ['available package count', diagnostics.diagnostics.availablePackagesCount],
        ['package identifiers', diagnostics.diagnostics.packageIdentifiers],
        ['product identifiers', diagnostics.diagnostics.productIdentifiers],
        ['expected package found', diagnostics.diagnostics.expectedPackageFound],
        ['expected product found', diagnostics.diagnostics.expectedProductFound],
        ['entitlement checked', diagnostics.diagnostics.entitlementIdentifierExpected],
        ['entitlement active', diagnostics.diagnostics.entitlementActive],
        ['native paywall available', diagnostics.diagnostics.nativePaywallAvailable],
        ['last error category', diagnostics.diagnostics.lastErrorCategory],
        ['last purchase error category', diagnostics.diagnostics.lastPurchaseErrorCategory],
        ['last restore error category', diagnostics.diagnostics.lastRestoreErrorCategory],
      ] satisfies Array<[string, boolean | number | string | string[] | null]>
    : [];

  return (
    <AppCard>
      <div className="subscription-diagnostics-panel">
        <div>
          <AppText variant="label" as="p">
            Subscription diagnostics
          </AppText>
          <AppText variant="caption" as="p">
            Safe configuration details for TestFlight review. No journal text, identifiers, emails, tokens, or full API keys are shown.
          </AppText>
        </div>

        <button
          type="button"
          className="btn-ghost subscription-diagnostics-button"
          onClick={() => {
            void diagnostics.runDiagnostics();
          }}
          disabled={diagnostics.isRunning}
        >
          {diagnostics.isRunning ? 'Checking subscription setup' : 'Check subscription setup'}
        </button>

        {diagnostics.error ? (
          <AppText variant="caption" as="p">
            {diagnostics.error}
          </AppText>
        ) : null}

        {rows.length ? (
          <dl className="subscription-diagnostics-list" aria-live="polite">
            {rows.map(([label, value]) => (
              <div key={label} className="subscription-diagnostics-row">
                <dt>{label}</dt>
                <dd>{formatValue(value)}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </AppCard>
  );
}
