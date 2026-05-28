'use client';

import { SUPPORT_GUIDANCE } from '@/config/support';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import type { SupportRequestType } from '@/types/support';

export function SupportGuidance({
  type,
  onEscalate,
}: {
  type: SupportRequestType;
  onEscalate: () => void;
}): React.JSX.Element {
  const { navigate } = useInternalNavigation();
  const guidance = SUPPORT_GUIDANCE[type];

  return (
    <AppCard className="support-card">
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <AppText variant="h2" as="h2">{guidance.title}</AppText>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {guidance.body.map((item) => (
            <AppText key={item} variant="secondary" as="p">{item}</AppText>
          ))}
        </div>
        {type === 'emotional_boundary' ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/emergency', { source: 'support_emotional_boundary', surface: 'settings' })}
          >
            {guidance.escalationLabel}
          </button>
        ) : (
          <button type="button" className="btn-ghost" onClick={onEscalate}>
            {guidance.escalationLabel}
          </button>
        )}
      </div>
    </AppCard>
  );
}
