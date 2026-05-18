'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { EmptyState } from '@/components/ui/EmptyState';
import { DESIGN } from '@/lib/design';
import { listSharedReflections, resonateWithReflection } from '@/lib/community';

export default function CommunityPage() {
  const [tick, setTick] = useState(0);
  const [status, setStatus] = useState('');
  const reflections = useMemo(() => listSharedReflections(), [tick]);

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Shared Reflections" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard>
          <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.xs }}>
            Shared reflections
          </SanctuaryText>
          <SanctuaryText variant="caption">
            Sharing is currently unavailable while moderation infrastructure is finalized.
          </SanctuaryText>
        </SanctuaryCard>

        {status ? <SanctuaryText variant="caption">{status}</SanctuaryText> : null}

        {!reflections.length ? (
          <EmptyState
            title="Shared reflections are unavailable"
            message="This space will remain quiet until it can be moderated safely."
          />
        ) : (
          <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
            {reflections.map((item) => (
              <SanctuaryCard key={item.id}>
                <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.xs }}>
                  {new Date(item.sharedAt).toLocaleDateString()} · anonymous
                </SanctuaryText>
                <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.sm, whiteSpace: 'pre-wrap' }}>
                  {item.content}
                </SanctuaryText>
                {item.mood.length ? (
                  <div style={{ display: 'flex', gap: DESIGN.spacing.xs, flexWrap: 'wrap', marginBottom: DESIGN.spacing.sm }}>
                    {item.mood.map((mood) => (
                      <span key={`${item.id}-${mood}`} style={moodPillStyle}>
                        {mood}
                      </span>
                    ))}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    const ok = resonateWithReflection(item.id);
                    setStatus(ok ? 'Resonance sent.' : 'You already resonated with this reflection.');
                    setTick((value) => value + 1);
                  }}
                  style={resonateButtonStyle}
                >
                  This resonates · {item.resonanceCount}
                </button>
              </SanctuaryCard>
            ))}
          </div>
        )}
      </div>
    </SanctuaryLayout>
  );
}

const resonateButtonStyle: React.CSSProperties = {
  minHeight: '36px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
  padding: '8px 12px',
};

const moodPillStyle: React.CSSProperties = {
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.borderLight}`,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.xs,
  padding: '3px 8px',
};
