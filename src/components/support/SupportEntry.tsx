'use client';

import { SUPPORT_OPTIONS } from '@/config/support';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import type { SupportRequestType } from '@/types/support';

export function SupportEntry({
  selected,
  onSelect,
}: {
  selected: SupportRequestType | null;
  onSelect: (type: SupportRequestType) => void;
}): React.JSX.Element {
  return (
    <AppCard className="support-card">
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <AppText variant="h2" as="h2">Support</AppText>
          <AppText variant="secondary" as="p">
            Support can help with product, account, billing, and technical issues. It does not respond to journal content.
          </AppText>
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {SUPPORT_OPTIONS.map((option) => (
            <button
              key={option.type}
              type="button"
              className={selected === option.type ? 'btn-primary' : 'btn-ghost'}
              onClick={() => onSelect(option.type)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </AppCard>
  );
}
