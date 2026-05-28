'use client';

import { AppText } from '@/components/ui/AppText';

type SubscriptionActionsProps = {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  loading?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  helper?: string | null;
  statusMessage?: string | null;
  error?: string | null;
};

export function SubscriptionActions({
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  loading = false,
  secondaryLabel,
  onSecondary,
  helper = null,
  statusMessage = null,
  error = null,
}: SubscriptionActionsProps): React.JSX.Element {
  return (
    <div className="subscription-stack">
      <button
        type="button"
        className="btn-primary"
        onClick={onPrimary}
        disabled={primaryDisabled || loading}
        style={{ width: '100%', textAlign: 'center', opacity: primaryDisabled || loading ? 0.6 : 1 }}
      >
        <AppText as="span" variant="body" style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-weight-semibold)' }}>
          {loading ? 'Please wait…' : primaryLabel}
        </AppText>
      </button>

      {secondaryLabel && onSecondary ? (
        <button
          type="button"
          className="btn-ghost"
          onClick={onSecondary}
          style={{ width: '100%', textAlign: 'center' }}
        >
          <AppText as="span" variant="body" style={{ fontWeight: 500 }}>
            {secondaryLabel}
          </AppText>
        </button>
      ) : null}

      {helper ? (
        <AppText variant="whisper" as="p">
          {helper}
        </AppText>
      ) : null}

      {statusMessage ? (
        <AppText variant="secondary" as="p">
          {statusMessage}
        </AppText>
      ) : null}

      {error ? (
        <AppText variant="secondary" as="p" style={{ color: 'var(--text-primary)' }}>
          {error}
        </AppText>
      ) : null}
    </div>
  );
}
