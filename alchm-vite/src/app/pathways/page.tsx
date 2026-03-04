// @ts-nocheck
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from '@/router';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { DESIGN } from '@/lib/design';
import type { PageState } from '@/lib/types';
import { saveDraft } from '@/lib/journal';
import {
  CORE_PATHWAYS,
  acknowledgeMigrationPrompt,
  getActivePathway,
  getDayAvailability,
  getPathwayById,
  getPathwayPhase,
  getPhaseProgress,
  restartActivePathway,
  selectPathwayDay,
  startPathway,
  type DayAvailability,
  type Pathway,
  type PathwayProgress,
} from '@/lib/pathways';
import { useGrowth } from '@/hooks/useGrowth';
import { haptics } from '@/services/haptics';

function phaseLabel(phase: string): string {
  if (phase === 'grounding') return 'Grounding';
  if (phase === 'pattern') return 'Pattern';
  if (phase === 'challenge') return 'Challenge';
  return 'Integration';
}

function phaseIntro(day: number, phase: string): string | null {
  if (day === 13 || day === 14) {
    return "Today's question is one of the harder ones. There's no requirement to go all the way in. Write as far as feels right, then stop. A pause is always allowed.";
  }
  if (day === 6 || phase === 'pattern') {
    return "You're entering the Pattern phase. This is where you start to notice. No fixing. No judging. Just seeing.";
  }
  if (day === 11 || phase === 'challenge') {
    return "You're entering the Challenge phase. The questions get harder here, but you can move at your own pace.";
  }
  if (day === 17 || phase === 'integration') {
    return "You're entering the Integration phase. This is where the threads come together and start to make sense.";
  }
  return null;
}

function phasePalette(phase: string): { background: string; border: string; weight: 500 | 600 } {
  if (phase === 'challenge') {
    return {
      background: 'linear-gradient(180deg, rgba(126, 139, 116, 0.30) 0%, rgba(105, 118, 96, 0.34) 100%)',
      border: '3px solid rgba(232, 201, 107, 0.7)',
      weight: 600,
    };
  }
  if (phase === 'pattern') {
    return {
      background: 'rgba(155, 171, 143, 0.26)',
      border: '2px solid rgba(232, 201, 107, 0.55)',
      weight: 500,
    };
  }
  if (phase === 'integration') {
    return {
      background: 'linear-gradient(180deg, rgba(176, 193, 163, 0.32) 0%, rgba(194, 205, 180, 0.35) 100%)',
      border: '1px solid rgba(164, 180, 148, 0.28)',
      weight: 500,
    };
  }
  return {
    background: 'rgba(175, 190, 163, 0.26)',
    border: '1px solid rgba(164, 180, 148, 0.22)',
    weight: 500,
  };
}

function statusGlyph(status: DayAvailability['status']): string {
  if (status === 'completed') return 'Done';
  if (status === 'next') return 'Next';
  if (status === 'available') return 'Open';
  return 'Locked';
}

function statusLabel(status: DayAvailability['status']): string {
  if (status === 'completed') return 'completed';
  if (status === 'next') return 'next';
  if (status === 'available') return 'available';
  return 'locked';
}

function progressPercent(active: PathwayProgress | null, pathway: Pathway | null): number {
  if (!active || !pathway) return 0;
  return Math.min(1, active.completedSteps.length / pathway.duration);
}

export default function PathwaysPage() {
  const router = useRouter();
  const growth = useGrowth();
  const [state, setState] = useState<PageState>('loading');
  const [activeProgress, setActiveProgress] = useState<PathwayProgress | null>(null);
  const [showDays, setShowDays] = useState(false);
  const [threshold, setThreshold] = useState<{
    pathwayId: string;
    day: number;
    title: string;
    phase: string;
    question: string;
  } | null>(null);
  const [thresholdVisible, setThresholdVisible] = useState(false);

  useEffect(() => {
    try {
      const active = getActivePathway();
      setActiveProgress(active);
      setState(CORE_PATHWAYS.length ? 'ready' : 'empty');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    if (threshold && !thresholdVisible) {
      setThresholdVisible(true);
      void haptics.flowNoticeShow();
      return;
    }
    if (!threshold && thresholdVisible) {
      setThresholdVisible(false);
      void haptics.flowNoticeDismiss();
    }
  }, [threshold, thresholdVisible]);

  const active = useMemo(() => (activeProgress?.pathwayId ? getPathwayById(activeProgress.pathwayId) : null), [activeProgress?.pathwayId]);
  const availablePathways = useMemo(
    () => CORE_PATHWAYS.filter((pathway) => pathway.id !== activeProgress?.pathwayId),
    [activeProgress?.pathwayId],
  );
  const activePercent = useMemo(() => progressPercent(activeProgress, active), [activeProgress, active]);
  const activePhase = useMemo(() => {
    if (!active || !activeProgress) return null;
    return getPathwayPhase(active, activeProgress.currentStep || 1);
  }, [active, activeProgress]);
  const activePhaseStyle = useMemo(() => phasePalette(activePhase || 'grounding'), [activePhase]);
  const dayAvailability = useMemo(() => {
    if (!active) return [];
    return getDayAvailability(active, activeProgress);
  }, [active, activeProgress]);
  const phaseProgress = useMemo(() => {
    if (!active) return [];
    return getPhaseProgress(active, activeProgress);
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
          boxShadow: '0 0 0 3px rgba(0,0,0,0.0)',
          marginRight: '8px',
        }}
      />
    );
  }, []);

  const startAtDay = useCallback(
    (pathwayId: string, day: number) => {
      const pathway = getPathwayById(pathwayId);
      if (!pathway) return;
      const step = pathway.steps.find((item) => item.day === day);
      if (!step) return;
      setThreshold({
        pathwayId,
        day,
        title: pathway.title,
        phase: phaseLabel(step.phase),
        question: step.prompt.question,
      });
    },
    [],
  );

  const thresholdOverlay = threshold ? (
    <div
      className="threshold-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'linear-gradient(180deg, #A8B89C 0%, #8E9E82 100%)',
        opacity: 1,
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        isolation: 'isolate',
      }}
    >
      <div className="threshold-content" style={{ maxWidth: '360px', textAlign: 'center' }}>
        <div className="threshold-title" style={{ fontSize: '32px', color: DESIGN.colors.textPrimary }}>{threshold.title}</div>
        <div className="threshold-meta" style={{ marginTop: '8px', fontSize: '15px', color: DESIGN.colors.textSecondary }}>
          Day {threshold.day} · {threshold.phase}
        </div>
        {phaseIntro(threshold.day, threshold.phase.toLowerCase()) ? (
          <div style={{ marginTop: '14px', fontSize: '15px', color: DESIGN.colors.textSecondary, lineHeight: 1.55 }}>
            {phaseIntro(threshold.day, threshold.phase.toLowerCase())}
          </div>
        ) : null}
        <div className="threshold-prompt" style={{ marginTop: '16px', fontSize: '17px', color: DESIGN.colors.textPrimary, lineHeight: 1.7, fontStyle: 'italic' }}>
          “{threshold.question}”
        </div>
        <button
          type="button"
          className="btn-primary"
          style={{ marginTop: '24px', width: '100%' }}
          onClick={() => {
            const ok = selectPathwayDay(threshold.pathwayId, threshold.day);
            if (!ok.ok) {
              setThreshold(null);
              return;
            }
            saveDraft({ content: '', pathwayId: threshold.pathwayId, pathwayStep: threshold.day, tags: [] });
            growth.logContainerSession(false);
            setThreshold(null);
            router.push('/journal/new/');
          }}
        >
          Enter →
        </button>
        <button type="button" className="btn-ghost" style={{ marginTop: '8px' }} onClick={() => setThreshold(null)}>
          Not now
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div style={{ paddingBottom: '32px' }}>
      <PageHeader hideBack settingsRoute="/settings" title="Containers" subtitle="Guided spaces you can enter, leave, and revisit." />
      {thresholdOverlay && typeof document !== 'undefined' ? createPortal(thresholdOverlay, document.body) : null}

      {state === 'loading' ? <LoadingState label="Loading pathways…" /> : null}
      {state === 'error' ? <ErrorState onRetry={() => router.refresh()} /> : null}
      {state === 'empty' ? <EmptyState title="No pathways yet" message="Pathways will appear here soon." /> : null}

      {state === 'ready' ? (
        <>
          {active ? (
            <div
              className="card card-elevated"
              style={{
                marginTop: '8px',
                borderRadius: '18px',
                padding: '16px',
                border: activePhaseStyle.border,
                background: activePhaseStyle.background,
              }}
            >
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Active container
              </div>
              <div style={{ marginTop: '6px', fontSize: '16px', color: DESIGN.colors.textPrimary }}>{active.title}</div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                {phaseLabel(activePhase || 'grounding')} · Day {activeProgress?.currentStep || 1}
              </div>
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '13px',
                  color: DESIGN.colors.textSecondary,
                  lineHeight: 1.6,
                  fontWeight: activePhaseStyle.weight,
                }}
              >
                {active.description}
              </div>

              <div style={{ marginTop: '12px', height: '8px', backgroundColor: 'rgba(43, 51, 40, 0.16)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '100%', width: `${Math.round(activePercent * 100)}%`, background: 'linear-gradient(90deg, #E8C96B 0%, #D4B55A 100%)' }} />
                {[5, 10, 16].map((marker) => (
                  <div key={marker} style={{ position: 'absolute', left: `${(marker / active.duration) * 100}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.45)' }} />
                ))}
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: DESIGN.colors.textMuted, display: 'flex', justifyContent: 'space-between' }}>
                <span>Grounding</span>
                <span>Pattern</span>
                <span>Challenge</span>
                <span>Integration</span>
              </div>

              {activeProgress?.showMigrationPrompt ? (
                <div className="card-reflection" style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>Your container has expanded.</div>
                  <div style={{ marginTop: '6px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                    "{active.title}" is now a 21-day journey. You're on Day {activeProgress.currentStep}. You can continue from here,
                    go back to explore days you haven't seen, or start fresh.
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        acknowledgeMigrationPrompt();
                        startAtDay(active.id, activeProgress.currentStep || 1);
                      }}
                    >
                      Continue from Day {activeProgress.currentStep}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => {
                        restartActivePathway();
                        const next = getActivePathway();
                        setActiveProgress(next);
                        setShowDays(false);
                      }}
                    >
                      Start fresh
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => setShowDays(true)}>
                      View all days
                    </button>
                  </div>
                </div>
              ) : null}

              <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const stepNum = activeProgress?.currentStep || 1;
                    startAtDay(active.id, stepNum);
                  }}
                  aria-label="Continue active pathway"
                  className="btn-secondary"
                  style={{ borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}
                >
                  Continue container →
                </button>
                <button type="button" className="btn-ghost" onClick={() => setShowDays((prev) => !prev)}>
                  {showDays ? 'Hide days' : 'View all days'}
                </button>
              </div>

              {showDays ? (
                <div className="card" style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>{active.title} — Your Days</div>

                  {(['grounding', 'pattern', 'challenge', 'integration'] as const).map((phase) => {
                    const rows = dayAvailability.filter((item) => item.phase === phase);
                    const progress = phaseProgress.find((item) => item.phase === phase);
                    if (!rows.length) return null;
                    return (
                      <div key={phase} style={{ marginTop: '12px' }}>
                        <div style={{ fontSize: '11px', color: DESIGN.colors.textMuted }}>
                          {phaseLabel(phase)}{progress ? ` · ${progress.completed}/${progress.total}` : ''}
                        </div>
                        <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {rows.map((row) => (
                            <button
                              key={row.day}
                              type="button"
                              disabled={row.status === 'locked'}
                              onClick={() => startAtDay(active.id, row.day)}
                              style={{
                                textAlign: 'left',
                                border: 'none',
                                background: 'transparent',
                                color: row.status === 'locked' ? DESIGN.colors.textMuted : DESIGN.colors.textPrimary,
                                opacity: row.status === 'locked' ? 0.5 : 1,
                                padding: 0,
                                cursor: row.status === 'locked' ? 'default' : 'pointer',
                              }}
                            >
                              {statusGlyph(row.status)} · Day {row.day}: {row.title} <span style={{ color: DESIGN.colors.textMuted }}>[{statusLabel(row.status)}]</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}

          <div style={{ marginTop: '14px', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {availablePathways.map((p) => (
              <div key={p.id} className="card" style={{ fontFamily: DESIGN.typography.sansSerif }}>
                <div style={{ fontSize: '16px', color: DESIGN.colors.textPrimary, fontWeight: DESIGN.typography.weights.semibold }}>{p.title}</div>
                <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>{p.description}</div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                  Grounding · Pattern · Challenge · Integration
                </div>
                {(() => {
                  const lens = p.framework.toLowerCase() === 'somatic'
                    ? 'body-centered'
                    : p.framework.toLowerCase() === 'cbt'
                      ? 'thought + narrative'
                      : p.framework;
                  return (
                <div style={{ marginTop: '10px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                      {p.duration} days · {lensDot(p.framework)}{lens}
                </div>
                  );
                })()}
                <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const result = startPathway(p.id);
                      if (!result.ok) return;
                      startAtDay(p.id, 1);
                    }}
                    aria-label={`Start pathway: ${p.title}`}
                    className="btn-secondary"
                    style={{ borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}
                  >
                    Begin →
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
