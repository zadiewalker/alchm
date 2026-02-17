'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const activePercent = useMemo(() => {
    if (!active || !activeProgress) return 0;
    const completed = Math.max(0, (activeProgress.currentStep || 1) - 1);
    return Math.min(1, completed / Math.max(1, active.duration));
  }, [active, activeProgress]);

  const lensDot = useCallback((framework: string) => {
    const f = (framework || '').toLowerCase();
    const color = f === 'somatic' ? DESIGN.colors.gold : f === 'cbt' ? DESIGN.colors.sage400 : DESIGN.colors.sage300;
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '9999px',
          backgroundColor: color,
          boxShadow: `0 0 0 3px rgba(0,0,0,0.0)`,
          marginRight: '8px',
        }}
      />
    );
  }, []);

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
              className="card card-elevated"
              style={{
                marginTop: '18px',
                borderRadius: DESIGN.radius.lg,
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Active pathway
              </div>
              <div style={{ marginTop: '6px', fontSize: '16px', color: DESIGN.colors.textPrimary }}>
                {active.title}
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                {active.description}
              </div>
              <div style={{ marginTop: '12px', height: '6px', backgroundColor: 'rgba(164, 180, 148, 0.18)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round(activePercent * 100)}%`, backgroundColor: DESIGN.colors.sage500 }} />
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
                className="btn-secondary"
                style={{ marginTop: '14px', borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}
              >
                Continue →
              </button>
            </div>
          ) : null}

          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CORE_PATHWAYS.map((p) => (
              <div
                key={p.id}
                className={activeProgress?.pathwayId === p.id ? 'card card-elevated' : 'card'}
                style={{
                  borderRadius: DESIGN.radius.lg,
                  padding: '16px',
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
                  {p.duration} days · {lensDot(p.framework)}
                  {p.framework.toUpperCase()}
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
                    className="btn-secondary"
                    style={{ borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}
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
