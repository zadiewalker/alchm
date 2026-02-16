'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { EmptyState } from '@/components/ui/EmptyState';
import { UpgradePrompt } from '@/components/ui/UpgradePrompt';
import { DESIGN } from '@/lib/design';
import { CORE_PATHWAYS, canStartPathway, getActivePathway, getPathwayById, getPathwayCompletionHistory, startPathway } from '@/lib/pathways';

export default function PathwaysPage() {
  const router = useRouter();
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const [reloadTick, setReloadTick] = useState(0);

  const active = useMemo(() => getActivePathway(), [reloadTick]);
  const completed = useMemo(() => getPathwayCompletionHistory(), [reloadTick]);
  const completedSet = useMemo(() => new Set(completed.map((item) => item.pathwayId)), [completed]);

  if (!CORE_PATHWAYS.length) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Pathways" showBack />}>
        <EmptyState title="No pathways yet" message="Guided journeys will appear here soon." />
      </SanctuaryLayout>
    );
  }

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Pathways" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        {active ? (
          <SanctuaryCard elevated style={{ borderColor: DESIGN.colors.goldDim }}>
            <SanctuaryText variant="caption" style={{ color: DESIGN.colors.textKhepera, marginBottom: DESIGN.spacing.xs }}>
              Active pathway
            </SanctuaryText>
            <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>
              {getPathwayById(active.pathwayId)?.title || 'Current pathway'}
            </SanctuaryText>
            <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.md }}>
              Day {Math.min((active.currentStep || 0) + 1, getPathwayById(active.pathwayId)?.duration || 1)} of{' '}
              {getPathwayById(active.pathwayId)?.duration || 1}
            </SanctuaryText>
            <button
              type="button"
              onClick={() => router.push(`/journal/new/?pathway=${active.pathwayId}&step=${active.currentStep || 0}`)}
              style={primaryButtonStyle}
            >
              Continue pathway
            </button>
          </SanctuaryCard>
        ) : null}

        <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
          {CORE_PATHWAYS.map((pathway) => {
            const available = canStartPathway(pathway);
            const isCompleted = completedSet.has(pathway.id);
            const isActive = active?.pathwayId === pathway.id;

            return (
              <SanctuaryCard key={pathway.id} style={{ opacity: available ? 1 : 0.72 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: DESIGN.spacing.sm, marginBottom: DESIGN.spacing.xs }}>
                  <div>
                    <SanctuaryText variant="body">{pathway.title}</SanctuaryText>
                    <SanctuaryText variant="caption">{pathway.description}</SanctuaryText>
                  </div>
                  <SanctuaryText variant="muted">
                    {pathway.tier === 'free' ? 'Free' : 'Sanctuary'}
                  </SanctuaryText>
                </div>

                <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.md }}>
                  {pathway.duration} days · {pathway.framework}
                </SanctuaryText>

                {isCompleted ? (
                  <SanctuaryText variant="khepera" style={{ marginBottom: DESIGN.spacing.sm }}>
                    Completed ✓
                  </SanctuaryText>
                ) : null}

                {isActive ? (
                  <button
                    type="button"
                    onClick={() => router.push(`/journal/new/?pathway=${pathway.id}&step=${active?.currentStep || 0}`)}
                    style={primaryButtonStyle}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!available) {
                        setUpgradeMessage('Guided pathways are available on the Sanctuary tier.');
                        return;
                      }
                      startPathway(pathway.id);
                      setReloadTick((value) => value + 1);
                      router.push('/journal/new/?pathway=' + pathway.id + '&step=0');
                    }}
                    style={available ? primaryButtonStyle : secondaryButtonStyle}
                  >
                    {available ? 'Start pathway' : 'Unlock in Sanctuary'}
                  </button>
                )}
              </SanctuaryCard>
            );
          })}
        </div>

        {completed.length ? (
          <SanctuaryCard>
            <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
              Completed journeys
            </SanctuaryText>
            <div style={{ display: 'grid', gap: DESIGN.spacing.xs }}>
              {completed.slice(0, 5).map((item) => (
                <SanctuaryText key={`${item.pathwayId}-${item.completedAt}`} variant="body">
                  {getPathwayById(item.pathwayId)?.title || item.pathwayId} · {new Date(item.completedAt || item.startedAt).toLocaleDateString()}
                </SanctuaryText>
              ))}
            </div>
          </SanctuaryCard>
        ) : null}

        <Link href="/journal/" style={{ textDecoration: 'none' }}>
          <SanctuaryCard>
            <SanctuaryText variant="body">Pathway entries appear in your journal with pathway labels.</SanctuaryText>
          </SanctuaryCard>
        </Link>
      </div>

      {upgradeMessage ? (
        <UpgradePrompt
          feature="Guided pathways"
          message={upgradeMessage}
          recommendedTier="sanctuary"
          onClose={() => setUpgradeMessage('')}
        />
      ) : null}
    </SanctuaryLayout>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  padding: '10px 16px',
  background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
  color: '#fff',
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.border}`,
  padding: '10px 16px',
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};
