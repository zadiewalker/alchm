'use client';

import type React from 'react';
import { SUPPORT_COPY } from '@/config/supportCopy';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';

export function SupportScopeCard(): React.JSX.Element {
  return (
    <AppCard className="support-card">
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <AppText variant="h2" as="h2">Support</AppText>
        <AppText variant="body" as="p">{SUPPORT_COPY.introBody}</AppText>
        <AppText variant="secondary" as="p">{SUPPORT_COPY.limitsBody}</AppText>
        <AppText variant="caption" as="p">{SUPPORT_COPY.safetyBody}</AppText>
        <AppText variant="caption" as="p">{SUPPORT_COPY.responseWindow}</AppText>
      </div>
    </AppCard>
  );
}
