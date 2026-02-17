'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { DESIGN } from '@/lib/design';
import type { PageState } from '@/lib/types';
import { saveDraft } from '@/lib/journal';
import { CORE_PATHWAYS, getActivePathway, getPathwayById, startPathway } from '@/lib/pathways';

export default function PathwaysPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [activeProgress, setActiveProgress] = useState<{ pathwayId: string; currentStep: number } | null>(null);

  useEffect(() => {
    try {
      const active = getActivePathway();
      setActiveProgress(active ? { pathwayId: active.pathwayId, currentStep: active.currentStep } : null);
      setState(CORE_PATHWAYS.length ? 'ready' : 'empty');
    } catch {
      setState('error');
    }
  }, []);

  const active = useMemo(() => (activeProgress?.pathwayId ? getPathwayById(activeProgress.pathwayId) : null), [activeProgress?.pathwayId]);

  return (
    <div style={{ padding: '28px 20px' }}>
      <button
        type="button"
        onClick={() => router.push('/dashboard/')}
        aria-label="Return to dashboard"
        style={{
          border: 'none',
          background: 'transparent',
          color: DESIGN.colors.gold,
          fontFamily: DESIGN.typography.sansSerif,
          fontSize: '15px',
          cursor: 'pointer',
          minHeight: '44px',
          padding: 0,
        }}
      >
        ← Dashboard
      </button>

      <h1 style={{ margin: '12px 0 0', fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
        Pathways
      </h1>
      <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary }}>
        Guided sequences for days when you want a gentle container.
      </div>

      {state === 'loading' ? <LoadingState label="Loading pathways…" /> : null}
      {state === 'error' ? <ErrorState onRetry={() => router.refresh()} /> : null}
      {state === 'empty' ? <EmptyState title="No pathways yet" message="Pathways will appear here soon." /> : null}

      {state === 'ready' ? (
        <>
          {active ? (
            <div
              style={{
                marginTop: '18px',
                backgroundColor: 'rgba(232, 197, 109, 0.06)',
                border: `1px solid rgba(232, 197, 109, 0.18)`,
                borderRadius: DESIGN.radius.lg,
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '13px', color: DESIGN.colors.textKhepera, fontWeight: DESIGN.typography.weights.semibold }}>
                Active pathway
              </div>
              <div style={{ marginTop: '6px', fontSize: '16px', color: DESIGN.colors.textPrimary }}>
                {active.title}
              </div>
              <button
                type="button"
                onClick={() => {
                  const stepNum = activeProgress?.currentStep || 1;
                  const step = active.steps.find((s) => s.day === stepNum) || active.steps[0];
                  saveDraft({ content: step?.prompt || '', pathwayId: active.id, pathwayStep: stepNum, tags: [] });
                  router.push('/journal/new/');
                }}
                aria-label="Continue active pathway"
                style={{
                  marginTop: '12px',
                  minHeight: '44px',
                  padding: '10px 14px',
                  borderRadius: DESIGN.radius.full,
                  border: `1px solid rgba(232, 197, 109, 0.30)`,
                  backgroundColor: 'rgba(232, 197, 109, 0.10)',
                  color: DESIGN.colors.textPrimary,
                  fontFamily: DESIGN.typography.sansSerif,
                  cursor: 'pointer',
                }}
              >
                Continue →
              </button>
            </div>
          ) : null}

          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CORE_PATHWAYS.map((p) => (
              <div
                key={p.id}
                style={{
                  backgroundColor: DESIGN.colors.cardBg,
                  border: `1px solid ${DESIGN.colors.border}`,
                  borderRadius: DESIGN.radius.lg,
                  padding: '14px',
                  fontFamily: DESIGN.typography.sansSerif,
                }}
              >
                <div style={{ fontSize: '16px', color: DESIGN.colors.textPrimary, fontWeight: DESIGN.typography.weights.semibold }}>
                  {p.title}
                </div>
                <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                  {p.description}
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                  {p.duration} days · {p.framework.toUpperCase()}
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const result = startPathway(p.id);
                      if (!result.ok) return;
                      const step = p.steps.find((s) => s.day === 1) || p.steps[0];
                      saveDraft({ content: step?.prompt || '', pathwayId: p.id, pathwayStep: 1, tags: [] });
                      router.push('/journal/new/');
                    }}
                    aria-label={`Start pathway: ${p.title}`}
                    style={{
                      minHeight: '44px',
                      padding: '10px 14px',
                      borderRadius: DESIGN.radius.full,
                      border: `1px solid ${DESIGN.colors.border}`,
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: DESIGN.colors.textPrimary,
                      fontFamily: DESIGN.typography.sansSerif,
                      cursor: 'pointer',
                    }}
                  >
                    Start →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
