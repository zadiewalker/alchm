'use client';

import type React from 'react';
import { SUPPORT_COPY } from '@/config/supportCopy';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import type { SupportSubmissionResult } from '@/types/support';

interface SupportConfirmationStateProps {
  result: SupportSubmissionResult;
  onReset: () => void;
}

export function SupportConfirmationState({
  result,
  onReset,
}: SupportConfirmationStateProps): React.JSX.Element {
  const { navigate } = useInternalNavigation();
  const isCrisis = result.boundary === 'crisis_boundary';
  const isEmotional = result.boundary === 'emotional_boundary';

  return (
    <AppCard className="support-card">
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <AppText variant="h2" as="h2">{SUPPORT_COPY.confirmationTitle}</AppText>
          <AppText variant="body" as="p">{SUPPORT_COPY.confirmationBody}</AppText>
          {isEmotional || isCrisis ? (
            <AppText variant="secondary" as="p">{SUPPORT_COPY.boundaryNotice}</AppText>
          ) : null}
          {isCrisis ? (
            <AppText variant="secondary" as="p">{SUPPORT_COPY.crisisNotice}</AppText>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {result.mailtoHref ? (
            <a href={result.mailtoHref} className="btn-primary">
              {SUPPORT_COPY.confirmationAction}
            </a>
          ) : null}
          <button type="button" className="btn-secondary" onClick={onReset}>
            Send another message
          </button>
          {isCrisis ? (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate('/emergency', { source: 'support_confirmation_crisis', surface: 'settings' })}
            >
              {SUPPORT_COPY.safetyCardAction}
            </button>
          ) : null}
        </div>
      </div>
    </AppCard>
  );
}
