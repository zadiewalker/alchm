'use client';

import type React from 'react';
import { SUPPORT_COPY } from '@/config/supportCopy';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';

interface DiagnosticsOptInRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function DiagnosticsOptInRow({
  checked,
  onChange,
}: DiagnosticsOptInRowProps): React.JSX.Element {
  return (
    <label style={{ display: 'block' }}>
      <AppCard className="support-card" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            style={{ marginTop: '2px' }}
          />
          <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
            <AppText variant="body" as="span">{SUPPORT_COPY.diagnosticsLabel}</AppText>
            <AppText variant="caption" as="span">{SUPPORT_COPY.diagnosticsHelper}</AppText>
          </div>
        </div>
      </AppCard>
    </label>
  );
}
