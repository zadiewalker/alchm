'use client';

import type React from 'react';
import { SUPPORT_COPY } from '@/config/supportCopy';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import type { SupportBoundaryClassification } from '@/types/support';

interface SupportBoundaryNoticeProps {
  boundary: SupportBoundaryClassification;
}

export function SupportBoundaryNotice({
  boundary,
}: SupportBoundaryNoticeProps): React.JSX.Element | null {
  if (boundary === 'standard') {
    return null;
  }

  return (
    <AppCard className="support-card" style={{ border: '1px solid var(--border-divider)' }}>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <AppText variant="body" as="p">{SUPPORT_COPY.boundaryNotice}</AppText>
        {boundary === 'crisis_boundary' ? (
          <AppText variant="secondary" as="p">{SUPPORT_COPY.crisisNotice}</AppText>
        ) : null}
      </div>
    </AppCard>
  );
}
