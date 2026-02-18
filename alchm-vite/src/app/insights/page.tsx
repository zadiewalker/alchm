
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/router';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { DESIGN } from '@/lib/design';
import type { PageState } from '@/lib/types';
import { generateInsightReport } from '@/lib/insights';

export default function InsightsPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // State is derived from on-device report; no network calls.
      const report = generateInsightReport();
      setState(report.entriesNeeded > 0 ? 'empty' : 'ready');
    } catch {
      setError("ALCHM couldn't gather insights right now.");
      setState('error');
    }
  }, []);

  const report = useMemo(() => {
    try {
      return generateInsightReport();
    } catch {
      return { moodPatterns: [], themePatterns: [], temporalInsights: [], totalEntries: 0, entriesNeeded: 5 };
    }
  }, []);

  const dots = useMemo(() => {
    const total = 5;
    const filled = Math.max(0, Math.min(total, report.totalEntries));
    return Array.from({ length: total }, (_, i) => i < filled);
  }, [report.totalEntries]);

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
        The Mirror
      </h1>
      <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary }}>
        What Khepera notices in your words.
      </div>

      {state === 'loading' ? <LoadingState label="Gathering…" /> : null}
      {state === 'error' ? <ErrorState message={error} onRetry={() => router.refresh()} /> : null}
      {state === 'empty' ? (
        <EmptyState
          title="Patterns take time."
          message={`After five entries, I'll start to see what you see. ${report.entriesNeeded ? `${report.entriesNeeded} more to unlock.` : ''}`}
          action={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div aria-label="Entries needed to unlock" style={{ display: 'flex', gap: '8px' }}>
                {dots.map((on, idx) => (
                  <span
                    key={String(idx)}
                    aria-hidden="true"
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '9999px',
                      backgroundColor: on ? DESIGN.colors.sage400 : 'transparent',
                      border: `1px solid ${DESIGN.colors.borderLight}`,
                      boxShadow: on ? '0 0 10px rgba(139, 154, 124, 0.18)' : 'none',
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => router.push('/journal/new/')}
                aria-label="Write a journal entry"
                className="btn-primary"
                style={{
                  padding: '0 18px',
                  borderRadius: DESIGN.radius.full,
                  fontFamily: DESIGN.typography.sansSerif,
                  cursor: 'pointer',
                }}
              >
                Write
              </button>
            </div>
          }
        />
      ) : null}

      {state === 'ready' ? (
        <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" style={{ padding: '16px' }} aria-label="Mood landscape">
            <div style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: DESIGN.colors.sage400, fontWeight: 600 }}>
              Mood landscape
            </div>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.moodPatterns.map((m) => (
                <div key={m.mood} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 54px', gap: '10px', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: DESIGN.colors.textPrimary, textTransform: 'capitalize' }}>{m.mood}</div>
                  <div style={{ height: '8px', borderRadius: '9999px', backgroundColor: 'rgba(164, 180, 148, 0.18)', overflow: 'hidden' }}>
                    <div style={{ width: `${m.percentage}%`, height: '100%', backgroundColor: DESIGN.colors.sage500 }} />
                  </div>
                  <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted, textAlign: 'right' }}>
                    {m.percentage}% {m.trend === 'rising' ? '↑' : m.trend === 'falling' ? '↓' : '→'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '16px' }} aria-label="Themes and threads">
            <div style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: DESIGN.colors.sage400, fontWeight: 600 }}>
              Threads
            </div>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {report.themePatterns.length ? (
                report.themePatterns.map((t) => (
                  <div key={t.theme}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>{t.theme}</div>
                      <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted }}>
                        ×{t.count} {t.trend === 'rising' ? '↑' : t.trend === 'falling' ? '↓' : '→'}
                      </div>
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '12px', color: DESIGN.colors.textMuted, lineHeight: 1.5 }}>
                      since {t.firstSeen} · {t.associatedMoods.length ? `usually ${t.associatedMoods[0]}` : 'varied'}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '13px', color: DESIGN.colors.textMuted }}>No themes yet.</div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '16px' }} aria-label="Khepera notices">
            <div style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: DESIGN.colors.sage400, fontWeight: 600 }}>
              Khepera notices
            </div>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.temporalInsights.length ? (
                report.temporalInsights.map((i, idx) => (
                  <div key={String(idx)} style={{ fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                    “{i.description}”
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '13px', color: DESIGN.colors.textMuted }}>
                  Keep writing. The patterns will surface gently.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
