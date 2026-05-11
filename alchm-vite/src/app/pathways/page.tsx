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
import { canAccessContainer, trackConversionEvent } from '@/lib/subscription';

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
  if (day === 6) {
    return "You're entering the Pattern phase. This is where you start to notice. No fixing. No judging. Just seeing.";
  }
  if (day === 11) {
    return "You're entering the Challenge phase. The questions get harder here, but you can move at your own pace.";
  }
  if (day === 17) {
    return "You're entering the Integration phase. This is where the threads come together and start to make sense.";
  }
  return null;
}

function phasePalette(phase: string): { background: string; border: string; weight: 500 | 600 } {
  if (phase === 'challenge') {
    return {
      background: 'rgba(200, 164, 78, 0.08)',
      border: '1.5px solid rgba(200, 164, 78, 0.36)',
      weight: 600,
    };
  }
  if (phase === 'pattern') {
    return {
      background: 'rgba(255, 255, 255, 0.07)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      weight: 500,
    };
  }
  if (phase === 'integration') {
    return {
      background: 'rgba(255, 255, 255, 0.07)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      weight: 500,
    };
  }
  return {
    background: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.14)',
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

function phaseMarkers(pathway: Pathway | null): number[] {
  if (!pathway || pathway.duration <= 1) return [];
  const markers = new Set<number>();
  const defs = pathway.phases;
  const ranges = [defs.grounding.days, defs.pattern.days, defs.challenge.days, defs.integration.days];
  for (let i = 0; i < ranges.length - 1; i += 1) {
    const [, end] = ranges[i];
    if (end > 0 && end < pathway.duration) markers.add(end);
  }
  return Array.from(markers).sort((a, b) => a - b);
}

function phaseArcLabel(pathway: Pathway | null): string {
  if (!pathway) return '';
  if (pathway.duration >= 21) return 'Grounding · Pattern · Challenge · Integration';
  return 'Grounding · Pattern · Integration';
}

function shouldOpenThreshold(pathway: Pathway, day: number): boolean {
  if (pathway.duration >= 21) {
    return day === 6 || day === 11 || day === 17;
  }
  return day === 1 || day === 6;
}

function phaseLockSummary(pathway: Pathway, phase: DayAvailability['phase']): string {
  const [start, end] = pathway.phases[phase].days;
  const dayLabel = start === end ? `Day ${start}` : `Day ${start}-${end}`;
  if (phase === 'challenge') return `${dayLabel}: [locked until Pattern complete]`;
  if (phase === 'integration') return `${dayLabel}: [locked until Challenge complete]`;
  return `${dayLabel}: [locked]`;
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
  const [lockedContainer, setLockedContainer] = useState<{ title: string; description: string; duration: number } | null>(null);
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
  const progressMarkers = useMemo(() => phaseMarkers(active), [active]);

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

  const openDay = useCallback(
    (pathwayId: string, day: number) => {
      const ok = selectPathwayDay(pathwayId, day);
      if (!ok.ok) return;
      saveDraft({ content: '', pathwayId, pathwayStep: day, tags: [] });
      growth.logContainerSession(false);
      router.push('/journal/new/');
    },
    [growth, router],
  );

  const startAtDay = useCallback(
    (pathwayId: string, day: number) => {
      const pathway = getPathwayById(pathwayId);
      if (!pathway) return;
      const step = pathway.steps.find((item) => item.day === day);
      if (!step) return;

      if (!shouldOpenThreshold(pathway, day)) {
        openDay(pathwayId, day);
        return;
      }

      setThreshold({
        pathwayId,
        day,
        title: pathway.title,
        phase: phaseLabel(step.phase),
        question: step.prompt.question,
      });
    },
    [openDay],
  );

  const thresholdOverlay = threshold ? (
    <div className="threshold-screen">
      <div className="threshold-content">
        <div className="threshold-title">{threshold.title}</div>
        <div className="threshold-meta">
          Day {threshold.day} · {threshold.phase}
        </div>
        {phaseIntro(threshold.day, threshold.phase.toLowerCase()) ? (
          <div className="threshold-intro">
            {phaseIntro(threshold.day, threshold.phase.toLowerCase())}
          </div>
        ) : null}
        <div className="threshold-prompt">
          “{threshold.question}”
        </div>
        <button
          type="button"
          className="btn-primary threshold-cta"
          onClick={() => {
            openDay(threshold.pathwayId, threshold.day);
            setThreshold(null);
          }}
        >
          Continue to Day {threshold.day} →
        </button>
        <button type="button" className="btn-ghost threshold-skip" onClick={() => setThreshold(null)}>
          Not now →
        </button>
      </div>
    </div>
  ) : null;

  const lockedOverlay = lockedContainer ? (
    <div className="threshold-screen">
      <div className="threshold-content">
        <div className="threshold-title">{lockedContainer.title}</div>
        <div className="threshold-meta">{lockedContainer.duration}-day container</div>
        <div className="threshold-intro" style={{ marginTop: '10px' }}>
          {lockedContainer.description}
        </div>
        <div className="threshold-intro">
          This container is part of Transformation.
        </div>
        <button
          type="button"
          className="btn-primary threshold-cta"
          onClick={() => {
            trackConversionEvent('container_locked_upgrade_tap', { container: lockedContainer.title });
            router.push('/pricing/');
          }}
        >
          Start this container — $6.99/mo
        </button>
        <button type="button" className="btn-ghost threshold-skip" onClick={() => setLockedContainer(null)}>
          ← Back to containers
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div style={{ paddingBottom: 'calc(156px + env(safe-area-inset-bottom))' }}>
      <PageHeader hideBack settingsRoute="/settings" title="Containers" subtitle="Guided spaces you can enter, leave, and revisit." />
      {thresholdOverlay && typeof document !== 'undefined' ? createPortal(thresholdOverlay, document.body) : null}
      {lockedOverlay && typeof document !== 'undefined' ? createPortal(lockedOverlay, document.body) : null}

      {state === 'loading' ? <LoadingState label="Loading pathways…" /> : null}
      {state === 'error' ? <ErrorState onRetry={() => router.refresh()} /> : null}
      {state === 'empty' ? <EmptyState title="No pathways yet" message="Pathways will appear here soon." /> : null}

      {state === 'ready' ? (
        <>
          {active ? (
            <div
            className="card card-elevated"
            style={{
              marginTop: '6px',
              borderRadius: '18px',
              padding: '14px',
                border: activePhaseStyle.border,
                background: activePhaseStyle.background,
              }}
            >
              <div style={{ fontSize: '12px', letterSpacing: '0.02em', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Active container
              </div>
              <div style={{ marginTop: '4px', fontSize: '17px', fontWeight: 400, color: DESIGN.colors.textPrimary }}>{active.title}</div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.50)' }}>
                {phaseLabel(activePhase || 'grounding')} · Day {activeProgress?.currentStep || 1}
              </div>
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '13px',
                  color: DESIGN.colors.textSecondary,
                  lineHeight: 1.55,
                  fontWeight: activePhaseStyle.weight,
                }}
              >
                {active.description}
              </div>

              <div style={{ marginTop: '12px', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.16)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '100%', width: `${Math.round(activePercent * 100)}%`, background: 'linear-gradient(90deg, #D4B76A 0%, #C8A44E 100%)' }} />
                {progressMarkers.map((marker) => (
                  <div key={marker} style={{ position: 'absolute', left: `${(marker / active.duration) * 100}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.45)' }} />
                ))}
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.48)', display: 'flex', justifyContent: 'space-between' }}>
                {active.duration >= 21 ? (
                  <>
                    <span>Grounding</span>
                    <span>Pattern</span>
                    <span>Challenge</span>
                    <span>Integration</span>
                  </>
                ) : (
                  <>
                    <span>Grounding</span>
                    <span>Pattern</span>
                    <span>Integration</span>
                  </>
                )}
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

              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const stepNum = activeProgress?.currentStep || 1;
                    startAtDay(active.id, stepNum);
                  }}
                  aria-label="Continue active pathway"
                  className="btn-secondary"
                  style={{ borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer', minHeight: '42px', padding: '10px 18px' }}
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
                    const allLocked = rows.every((item) => item.status === 'locked');
                    return (
                      <div key={phase} style={{ marginTop: '12px' }}>
                        <div style={{ fontSize: '11px', color: DESIGN.colors.textMuted }}>
                          {phaseLabel(phase)}{progress ? ` · ${progress.completed}/${progress.total}` : ''}
                        </div>
                        <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {allLocked ? (
                            <div style={{ color: DESIGN.colors.textMuted, opacity: 0.75 }}>
                              Locked · {phaseLockSummary(active, phase)}
                            </div>
                          ) : (
                            rows.map((row) => (
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
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}

          <div style={{ marginTop: '10px', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {availablePathways.map((p) => (
              <div key={p.id} className="card" style={{ fontFamily: DESIGN.typography.sansSerif, borderRadius: '16px', padding: '18px 16px' }}>
                <div style={{ fontSize: '17px', color: DESIGN.colors.textPrimary, fontWeight: 400 }}>{p.title}</div>
                <div style={{ marginTop: '6px', fontSize: '14px', color: 'rgba(255,255,255,0.66)', lineHeight: 1.45 }}>{p.description}</div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.46)' }}>
                  {phaseArcLabel(p)}
                </div>
                {(() => {
                  const lens = p.framework.toLowerCase() === 'somatic'
                    ? 'body-centered'
                    : p.framework.toLowerCase() === 'cbt'
                      ? 'thought + narrative'
                      : p.framework;
                  return (
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.46)' }}>
                      {p.duration} days · {lensDot(p.framework)}{lens}
                </div>
                  );
                })()}
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!canAccessContainer(p.id)) {
                        trackConversionEvent('container_locked_viewed', { container: p.title });
                        setLockedContainer({ title: p.title, description: p.description, duration: p.duration });
                        return;
                      }
                      const result = startPathway(p.id);
                      if (!result.ok) return;
                      startAtDay(p.id, 1);
                    }}
                    aria-label={`Start pathway: ${p.title}`}
                    className="btn-secondary"
                    style={{ borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer', minHeight: '40px', padding: '9px 16px' }}
                  >
                    {canAccessContainer(p.id) ? 'Begin →' : 'Start this container — $6.99/mo'}
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
