'use client';

import type React from 'react';
import { SUPPORT_COPY } from '@/config/supportCopy';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';

export function SafetyResourcesCard(): React.JSX.Element {
  const { navigate } = useInternalNavigation();

  return (
    <AppCard className="support-card">
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <AppText variant="h2" as="h2">{SUPPORT_COPY.safetyCardTitle}</AppText>
        <AppText variant="body" as="p">{SUPPORT_COPY.safetyCardBody}</AppText>
        <div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/emergency', { source: 'support_safety_resources', surface: 'settings' })}
          >
            {SUPPORT_COPY.safetyCardAction}
          </button>
        </div>
      </div>
    </AppCard>
  );
}
