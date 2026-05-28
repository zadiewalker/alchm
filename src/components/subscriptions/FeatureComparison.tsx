'use client';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';

type FeatureComparisonProps = {
  sanctuaryFeatures: string[];
  transformationFeatures: string[];
};

export function FeatureComparison({
  sanctuaryFeatures,
  transformationFeatures,
}: FeatureComparisonProps): React.JSX.Element {
  return (
    <AppCard
      variant="standard"
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        padding: 'var(--space-5)',
        background: 'var(--surface-color)',
      }}
    >
      <div className="subscription-section">
        <AppText variant="label" as="h3" className="subscription-section-label">
          Sanctuary holds
        </AppText>
        <div className="subscription-section-list">
          {sanctuaryFeatures.map((feature) => (
            <AppText key={feature} variant="secondary" as="p" className="subscription-section-item">
              {feature}
            </AppText>
          ))}
        </div>
      </div>

      <div className="subscription-section subscription-section--transformation">
        <AppText variant="label" as="h3" className="subscription-section-label">
          Transformation keeps in reach
        </AppText>
        <div className="subscription-section-list">
          {transformationFeatures.map((feature) => (
            <AppText key={feature} variant="secondary" as="p" className="subscription-section-item">
              {feature}
            </AppText>
          ))}
        </div>
      </div>
    </AppCard>
  );
}
