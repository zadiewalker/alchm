'use client';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';

type TierCardProps = {
  title: string;
  price: string;
  features: string[];
  ctaLabel: string;
  onCta: () => void;
  variant: 'sanctuary' | 'transformation';
  disabled?: boolean;
  active?: boolean;
  helper?: string | null;
};

export function TierCard({
  title,
  price,
  features,
  ctaLabel,
  onCta,
  variant,
  disabled = false,
  active = false,
  helper = null,
}: TierCardProps): React.JSX.Element {
  const isTransformation = variant === 'transformation';

  return (
    <AppCard
      variant={isTransformation ? 'elevated' : 'standard'}
      className={['tier-card', active ? 'tier-card-active' : ''].filter(Boolean).join(' ')}
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        padding: 'var(--space-5)',
        background: isTransformation ? 'var(--surface-elevated)' : 'var(--surface-color)',
        border: '1px solid var(--border-divider)',
      }}
    >
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <AppText variant="h2" as="h2" style={{ margin: 0 }}>
          {title}
        </AppText>
        <AppText variant="h1" as="p" className="tier-card-price">
          {price}
        </AppText>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        {features.map((feature) => (
          <AppText key={feature} variant="caption" as="p" className="tier-card-feature">
            <span aria-hidden="true" className="tier-card-check">✓</span>
            <span>{feature}</span>
          </AppText>
        ))}
      </div>

      {helper ? (
        <AppText variant="whisper" as="p">
          {helper}
        </AppText>
      ) : null}

      <button
        type="button"
        className={isTransformation ? 'btn-primary' : 'btn-ghost'}
        onClick={onCta}
        disabled={disabled}
        style={{
          opacity: disabled ? 0.6 : 1,
          width: '100%',
          textAlign: 'center',
          borderColor: active ? 'var(--accent-primary)' : undefined,
        }}
      >
        <AppText
          as="span"
          variant="label"
          style={{
            color: isTransformation ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 'var(--font-weight-semibold)',
          }}
        >
          {ctaLabel}
        </AppText>
      </button>
    </AppCard>
  );
}
