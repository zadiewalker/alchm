
// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/router';
import { PageHeader } from '@/components/PageHeader';
import { ErrorState, LoadingState } from '@/components/States';
import { DESIGN } from '@/lib/design';
import type { PageState } from '@/lib/types';
import { generateInsightReport } from '@/lib/insights';
import { useGrowth } from '@/hooks/useGrowth';
import { WeeklyReflectionCard } from '@/components/WeeklyReflectionCard';
import { getLatestPatternAnalysis, runPatternAnalysisIfNeeded, runPatternAnalysisIfNeededAsync } from '@/services/patternEngine';
import { getBodyHeatmap, getSomaticTimeline } from '@/services/somaticLog';
import { BODY_MAP_REGIONS } from '@/components/BodyMap';
import { getEntries } from '@/lib/journal';
import { getPathwayById, getPathwayHistory } from '@/lib/pathways';
import type { JournalEntry } from '@/lib/types';
import { detectPlateau, getAbsentThemes, getIntegrationLanguageShift } from '@/lib/therapeuticArc';
import type { EmotionalPoint } from '@/lib/postEntryTransform';
import type { ExerciseResult } from '@/lib/postEntryExercises';

function compactQuote(text: string | null | undefined, max = 90): string {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const sentence = clean.split(/[.!?]/).find((part) => part.trim().length > 10)?.trim() || clean;
  if (sentence.length <= max) return sentence;
  return `${sentence.slice(0, max).trim()}…`;
}

function entryMoodLabel(entry: JournalEntry): string {
  if (entry.emotionSelection?.label) return entry.emotionSelection.label;
  if (entry.extractedMood) return entry.extractedMood;
  if (entry.mood && entry.mood <= 3) return 'Heavy';
  if (entry.mood && entry.mood <= 5) return 'Anxious';
  if (entry.mood && entry.mood <= 7) return 'Neutral';
  if (entry.mood && entry.mood <= 8) return 'Hopeful';
  if (entry.mood && entry.mood > 8) return 'Peaceful';
  return '';
}

function postArcPath(points: EmotionalPoint[]): string {
  if (!points.length) return '';
  const mapped = points.map((point) => ({
    x: 6 + point.x * 108,
    y: 6 + point.y * 36,
  }));
  let d = `M ${mapped[0]?.x} ${mapped[0]?.y}`;
  for (let i = 1; i < mapped.length; i += 1) {
    const prev = mapped[i - 1];
    const curr = mapped[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` Q ${midX} ${prev.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export default function InsightsPage() {
  const router = useRouter();
  const growth = useGrowth();
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState('');
  const [patterns, setPatterns] = useState(getLatestPatternAnalysis());
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    try {
      // State is derived from on-device report; no network calls.
      const report = generateInsightReport();
      setPatterns(runPatternAnalysisIfNeeded({ force: report.totalEntries >= 5 }));
      void runPatternAnalysisIfNeededAsync({ force: report.totalEntries >= 5 }).then((next) => {
        setPatterns(next);
      });
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
      return {
        moodPatterns: [],
        themePatterns: [],
        temporalInsights: [],
        emotionalMap: { dominantFamily: null, dominantPercentage: 0, weekFamily: null, weekCount: 0, topRegion: null, regionPercentage: 0 },
        totalEntries: 0,
        entriesNeeded: 5,
      };
    }
  }, []);

  const heatmap = useMemo(() => getBodyHeatmap(30), []);
  const timeline = useMemo(() => getSomaticTimeline(30), []);
  const plateau = useMemo(() => detectPlateau(getEntries()), []);
  const absentThemes = useMemo(() => getAbsentThemes(getEntries()), []);
  const languageShift = useMemo(() => getIntegrationLanguageShift(getEntries()), []);
  const longArc = useMemo(() => {
    const entries = getEntries().filter((entry) => entry.type !== 'check-in' && entry.type !== 'checkin' && !!entry.content);
    if (entries.length < 60) return null;
    const ordered = [...entries].sort((a, b) => new Date(a.createdAt || a.updatedAt).getTime() - new Date(b.createdAt || b.updatedAt).getTime());
    const first = ordered[0] || null;
    const middle = ordered[Math.floor(ordered.length / 2)] || null;
    const latest = ordered[ordered.length - 1] || null;
    if (!first || !middle || !latest) return null;
    return {
      total: ordered.length,
      first: compactQuote(first.content, 90),
      middle: compactQuote(middle.content, 90),
      latest: compactQuote(latest.content, 90),
    };
  }, []);
  const containerArcs = useMemo(() => {
    const allEntries = getEntries();
    const completed = getPathwayHistory()
      .filter((item) => item.status === 'completed' && !!item.completedAt)
      .slice(0, 2);

    return completed
      .map((progress) => {
        const pathway = getPathwayById(progress.pathwayId);
        if (!pathway) return null;

        const entries = allEntries
          .filter((entry) => entry.pathwayId === progress.pathwayId && typeof entry.pathwayStep === 'number')
          .sort((a, b) => (a.pathwayStep || 0) - (b.pathwayStep || 0));
        if (!entries.length) return null;

        const featuredDays = [1, 5, 11, 13, 21]
          .map((day) => {
            const entry = entries.find((item) => item.pathwayStep === day) || null;
            if (!entry?.content) return null;
            const quote = compactQuote(entry.content, 84);
            if (!quote) return null;
            return { day, quote };
          })
          .filter(Boolean) as Array<{ day: number; quote: string }>;

        const moodJourney = entries
          .map((entry) => entryMoodLabel(entry))
          .filter(Boolean)
          .slice(0, 8);
        const bodyJourney = entries
          .map((entry) => entry.somatic?.region || entry.depth?.sensation?.region || '')
          .filter(Boolean)
          .map((region) => String(region).replace(/_/g, ' '))
          .slice(0, 8);

        return {
          id: `${progress.pathwayId}-${progress.completedAt}`,
          title: pathway.title,
          completedAt: progress.completedAt || progress.startedAt,
          featuredDays,
          moodJourney,
          bodyJourney,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      title: string;
      completedAt: string;
      featuredDays: Array<{ day: number; quote: string }>;
      moodJourney: string[];
      bodyJourney: string[];
    }>;
  }, []);
  const maxHeat = useMemo(() => Math.max(1, ...Object.values(heatmap)), [heatmap]);
  const topBody = useMemo(() => {
    const top = Object.entries(heatmap).sort((a, b) => b[1] - a[1])[0];
    return top ? { location: top[0], count: top[1] } : null;
  }, [heatmap]);
  const postEntries = useMemo(
    () =>
      getEntries()
        .filter((entry) => entry.type !== 'check-in' && entry.type !== 'checkin')
        .filter((entry) => !!entry.postEntryData)
        .sort((a, b) => new Date(a.createdAt || a.updatedAt).getTime() - new Date(b.createdAt || b.updatedAt).getTime()),
    [],
  );
  const extractedLines = useMemo(
    () =>
      postEntries
        .filter((entry) => (entry.postEntryData?.extractedLine || '').trim().length > 0)
        .map((entry) => ({
          id: entry.id,
          date: new Date(entry.createdAt || entry.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          text: entry.postEntryData?.extractedLine || '',
        })),
    [postEntries],
  );
  const arcEntries = useMemo(
    () =>
      postEntries
        .filter((entry) => (entry.postEntryData?.emotionalArc || []).length >= 3)
        .slice(-12),
    [postEntries],
  );
  const bodyEchoHeat = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of postEntries) {
      const echoes = entry.postEntryData?.bodyEchoes || [];
      for (const echo of echoes) {
        counts[echo.region] = (counts[echo.region] || 0) + 1;
      }
    }
    return counts;
  }, [postEntries]);
  const exerciseArchive = useMemo(() => {
    const all: Array<{ entryId: string; date: string; result: ExerciseResult }> = [];
    for (const entry of postEntries) {
      const date = new Date(entry.createdAt || entry.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const results = entry.postEntryData?.exerciseResults || [];
      for (const result of results) {
        if (!result?.completed) continue;
        all.push({ entryId: entry.id, date, result });
      }
    }
    return all;
  }, [postEntries]);
  const reframeArchive = useMemo(
    () =>
      exerciseArchive
        .filter((item) => item.result.type === 'reframe' && item.result.originalLine && item.result.reframedLine)
        .map((item) => ({
          id: `${item.entryId}-reframe`,
          date: item.date,
          original: item.result.originalLine || '',
          reframed: item.result.reframedLine || '',
        })),
    [exerciseArchive],
  );
  const letterArchive = useMemo(
    () =>
      exerciseArchive
        .filter((item) => item.result.type === 'letter' && item.result.letterText)
        .map((item) => ({
          id: `${item.entryId}-letter`,
          date: item.date,
          person: item.result.personName || 'them',
          text: item.result.letterText || '',
        })),
    [exerciseArchive],
  );
  const essenceArchive = useMemo(
    () =>
      exerciseArchive
        .filter((item) => item.result.type === 'essence' && (item.result.words || []).length > 0)
        .map((item) => ({
          id: `${item.entryId}-essence`,
          date: item.date,
          words: item.result.words || [],
        })),
    [exerciseArchive],
  );

  return (
    <div style={{ paddingBottom: '32px' }}>
      <PageHeader hideBack settingsRoute="/settings" title="The Mirror" subtitle="What Khepera notices in your words." />

      {state === 'loading' ? <LoadingState label="Gathering…" /> : null}
      {state === 'error' ? <ErrorState message={error} onRetry={() => router.refresh()} /> : null}
      {state === 'empty' ? (
        <div style={{ padding: '6px 24px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 300, lineHeight: 1.25, marginBottom: '10px' }}>Patterns take time.</div>
          <div style={{ fontSize: '15px', color: DESIGN.colors.textSecondary, lineHeight: 1.5, marginBottom: '18px' }}>
            After five entries, Khepera will start to notice what you might not see yourself.
          </div>
          <div
            className="card"
            style={{
              margin: '0 auto 16px',
              maxWidth: '320px',
              textAlign: 'left',
              opacity: 0.78,
              filter: 'saturate(0.9)',
            }}
          >
            <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.textMuted }}>
              Preview
            </div>
            <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.55, color: DESIGN.colors.textSecondary, fontStyle: 'italic' }}>
              “When Sundays arrive, fear tends to land in your chest first. You usually move toward steadiness after naming it.”
            </div>
          </div>
          <button type="button" onClick={() => router.push('/journal/new/')} aria-label="Begin entry" className="btn-primary" style={{ padding: '0 18px', borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>
            Begin entry
          </button>
        </div>
      ) : null}

      {state === 'ready' ? (
        <div style={{ marginTop: '16px', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" aria-label="Mood landscape">
            <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
              Mood landscape
            </div>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.moodPatterns.map((m) => (
                <div key={m.mood} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 54px', gap: '10px', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: DESIGN.colors.textPrimary, textTransform: 'capitalize' }}>{m.mood}</div>
                  <div style={{ height: '8px', borderRadius: '9999px', backgroundColor: 'rgba(164, 180, 148, 0.16)', overflow: 'hidden' }}>
                    <div style={{ width: `${m.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #8E9E82 0%, #E8C96B 100%)' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted, textAlign: 'right' }}>
                    {m.percentage}% {m.trend === 'rising' ? '↑' : m.trend === 'falling' ? '↓' : '→'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" aria-label="Themes and threads">
            <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
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
                      since {t.firstSeen} · {t.associatedFeelings.length ? `usually ${t.associatedFeelings[0]}` : 'varied'}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '13px', color: DESIGN.colors.textMuted }}>No themes yet.</div>
              )}
            </div>
          </div>

          {patterns.thematicThreads.length ? (
            <div className="card" aria-label="Longitudinal thematic threads">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Longitudinal threads
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {patterns.thematicThreads.slice(0, 5).map((thread) => (
                  <div key={thread.theme}>
                    <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>{thread.theme}</div>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                      {thread.frequency} entries · {thread.evolving ? (thread.evolution || 'evolving') : 'stable'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="card" aria-label="Khepera notices">
            <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
              Khepera notices
            </div>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.temporalInsights.length ? (
                report.temporalInsights.map((i, idx) => (
                  <div key={String(idx)} style={{ fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.6, fontStyle: 'italic' }}>
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
          {Object.keys(bodyEchoHeat).length ? (
            <div className="card" aria-label="Your body over time">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Your body over time
              </div>
              <div style={{ marginTop: '10px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                Body echoes pulled from writing: {Object.entries(bodyEchoHeat)
                  .sort((a, b) => b[1] - a[1])
                  .map(([region, count]) => `${region.replace(/_/g, ' ')} (${count})`)
                  .join(' · ')}
              </div>
            </div>
          ) : null}
          {arcEntries.length ? (
            <div className="card" aria-label="Your arcs">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Your arcs
              </div>
              <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
                {arcEntries.map((entry) => (
                  <div key={entry.id} style={{ border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '8px' }}>
                    <svg viewBox="0 0 120 48" style={{ width: '100%', height: '42px' }} aria-hidden="true">
                      <path d={postArcPath(entry.postEntryData?.emotionalArc || [])} fill="none" stroke="var(--gold-base)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <div style={{ marginTop: '4px', fontSize: '11px', color: DESIGN.colors.textMuted, textAlign: 'center' }}>
                      {new Date(entry.createdAt || entry.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {extractedLines.length >= 3 ? (
            <div className="card" aria-label="Your lines">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Your lines
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {extractedLines.slice(-20).map((line) => (
                  <div key={line.id} style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                    “{line.text}” <span style={{ color: DESIGN.colors.textMuted }}>— {line.date}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {reframeArchive.length >= 3 ? (
            <div className="card" aria-label="Your reframes">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Your Reframes
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {reframeArchive.slice(-12).map((item) => (
                  <div key={item.id} style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                    “{item.original}” → “{item.reframed}” <span style={{ color: DESIGN.colors.textMuted }}>— {item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {letterArchive.length >= 2 ? (
            <div className="card" aria-label="Your letters">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Your Letters
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {letterArchive.slice(-12).map((item) => (
                  <div key={item.id} style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                    Dear {item.person}: “{item.text}” <span style={{ color: DESIGN.colors.textMuted }}>— {item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {essenceArchive.length >= 3 ? (
            <div className="card" aria-label="Your essence words">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Your Essence Words
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {essenceArchive.slice(-20).map((item) => (
                  <div key={item.id} style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                    {item.words.join('. ')}. <span style={{ color: DESIGN.colors.textMuted }}>— {item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {plateau.isPlateau ? (
            <div className="card" aria-label="Plateau observation">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                What may be unsaid
              </div>
              <div style={{ marginTop: '10px', fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
                Recent entries are quieter than your baseline. That can be rest, protection, or avoidance.
              </div>
              {absentThemes.length ? (
                <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textMuted }}>
                  Topics less present lately: {absentThemes.join(', ')}.
                </div>
              ) : null}
            </div>
          ) : null}
          {longArc ? (
            <div className="card" aria-label="Your arc">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Your arc
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textMuted }}>
                {longArc.total} entries across months.
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary }}>Where you started: “{longArc.first}”</div>
              <div style={{ marginTop: '6px', fontSize: '13px', color: DESIGN.colors.textSecondary }}>Middle: “{longArc.middle}”</div>
              <div style={{ marginTop: '6px', fontSize: '13px', color: DESIGN.colors.textSecondary }}>Now: “{longArc.latest}”</div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                Language shift: “should” eased by {Math.max(0, languageShift.shouldCount)} uses; “notice” appears {languageShift.noticeCount} times in recent entries.
              </div>
            </div>
          ) : null}
          {containerArcs.length ? (
            <div className="card" aria-label="Container arc">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Container arc
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {containerArcs.map((arc) => (
                  <div key={arc.id}>
                    <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>
                      {arc.title} — completed {new Date(arc.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    {arc.featuredDays.length ? (
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {arc.featuredDays.map((point) => (
                          <div key={`${arc.id}-${point.day}`} style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.5 }}>
                            Day {point.day}: “{point.quote}”
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {arc.moodJourney.length ? (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                        Mood journey: {arc.moodJourney.join(' → ')}
                      </div>
                    ) : null}
                    {arc.bodyJourney.length ? (
                      <div style={{ marginTop: '4px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                        Body journey: {arc.bodyJourney.join(' → ')}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {patterns.emotionalCycles.length ? (
            <div className="card" aria-label="Emotional cycles">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Cycles
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {patterns.emotionalCycles.map((cycle, idx) => (
                  <div key={`${cycle.pattern}-${String(idx)}`}>
                    <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>{cycle.pattern}</div>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                      confidence {Math.round(cycle.confidence * 100)}% · {cycle.dataPoints.length} data points
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {patterns.linguisticShifts.length ? (
            <div className="card" aria-label="Linguistic shifts">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Language shifts
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {patterns.linguisticShifts.map((shift, idx) => (
                  <div key={`${shift.topic}-${String(idx)}`}>
                    <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>{shift.topic}</div>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: DESIGN.colors.textMuted }}>{shift.shift}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {patterns.avoidancePatterns.length ? (
            <div className="card" aria-label="The unsaid">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                The unsaid
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {patterns.avoidancePatterns.map((item, idx) => (
                  <div key={`${item.topic}-${String(idx)}`}>
                    <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>{item.topic}</div>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: DESIGN.colors.textMuted }}>{item.evidence[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {patterns.growthMarkers.length ? (
            <div className="card" aria-label="Growth signals">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Growth signals
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {patterns.growthMarkers.slice(0, 5).map((signal, idx) => (
                  <div key={`${signal.entryId}-${String(idx)}`} style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.5 }}>
                    {signal.signal}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="card" aria-label="Your body">
            <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
              Your body
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
              {topBody ? `Most logged location in the last 30 days: ${topBody.location.replace(/_/g, ' ')} (${topBody.count} check-ins).` : 'No body map data yet.'}
            </div>
            <div style={{ marginTop: '12px', display: 'grid', placeItems: 'center' }}>
              <svg viewBox="0 0 200 400" style={{ width: '140px', height: '280px' }} aria-label="Body heatmap">
                <ellipse cx="100" cy="45" rx="22" ry="28" fill="rgba(255,255,255,0.14)" />
                <rect x="75" y="80" width="50" height="110" rx="24" fill="rgba(255,255,255,0.12)" />
                <rect x="52" y="95" width="18" height="120" rx="9" fill="rgba(255,255,255,0.10)" />
                <rect x="130" y="95" width="18" height="120" rx="9" fill="rgba(255,255,255,0.10)" />
                <rect x="80" y="190" width="16" height="155" rx="8" fill="rgba(255,255,255,0.10)" />
                <rect x="104" y="190" width="16" height="155" rx="8" fill="rgba(255,255,255,0.10)" />
                {BODY_MAP_REGIONS.map((region) => {
                  const count = heatmap[region.id] || 0;
                  if (!count) return null;
                  const opacity = 0.2 + ((count / maxHeat) * 0.7);
                  return (
                    <circle
                      key={region.id}
                      cx={region.x}
                      cy={region.y}
                      r={Math.min(12, 4 + count)}
                      fill={`rgba(232, 201, 107, ${opacity})`}
                    />
                  );
                })}
              </svg>
            </div>
            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '6px' }}>
              {Object.entries(heatmap).slice(0, 8).map(([loc, count]) => (
                <div key={loc} style={{ fontSize: '11px', color: DESIGN.colors.textMuted, border: '1px solid var(--border-medium)', borderRadius: '9999px', padding: '4px 8px', textTransform: 'capitalize' }}>
                  {loc.replace(/_/g, ' ')} · {count}
                </div>
              ))}
            </div>
            {timeline.length ? (
              <>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ marginTop: '10px' }}
                  onClick={() => setShowTimeline((prev) => !prev)}
                >
                  {showTimeline ? 'Hide timeline' : 'See timeline →'}
                </button>
                {showTimeline ? (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {timeline.slice(0, 6).map((day) => (
                      <div key={day.date} style={{ border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '8px 10px' }}>
                        <div style={{ fontSize: '11px', color: DESIGN.colors.textMuted }}>
                          {new Date(`${day.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {day.points.slice(0, 4).map((point, idx) => (
                            <span key={`${day.date}-${String(idx)}`} style={{ fontSize: '12px', color: DESIGN.colors.textSecondary }}>
                              {point.location.replace(/_/g, ' ')}{point.sensation ? ` · ${point.sensation}` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          {patterns.relationalEntities.length ? (
            <div className="card" aria-label="Your world">
              <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
                Your world
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {patterns.relationalEntities.slice(0, 5).map((entity) => (
                  <div key={entity.name}>
                    <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary, textTransform: 'capitalize' }}>
                      {entity.name} · {entity.frequency.total} entries
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
                      trend: {entity.emotionalValence.trending}
                      {entity.frequency.conspicuousAbsence ? ' · conspicuous absence recently' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="card" aria-label="Emotional map">
            <div style={{ fontSize: '12px', letterSpacing: '0.2px', color: DESIGN.colors.sage400, fontWeight: 600 }}>
              Your emotional map
            </div>
            <div style={{ marginTop: '12px', display: 'grid', gap: '6px', color: DESIGN.colors.textSecondary, fontSize: '13px', lineHeight: 1.6 }}>
              <div>
                Most common: {report.emotionalMap.dominantFamily ? `${report.emotionalMap.dominantFamily} (${report.emotionalMap.dominantPercentage}%)` : 'Not enough data yet'}
              </div>
              <div>
                This week: {report.emotionalMap.weekFamily ? `${report.emotionalMap.weekFamily} (${report.emotionalMap.weekCount} entries)` : 'No dominant family yet'}
              </div>
              <div>
                Body pattern: {report.emotionalMap.topRegion ? `${report.emotionalMap.topRegion} (${report.emotionalMap.regionPercentage}% of entries)` : 'No body pattern yet'}
              </div>
            </div>
          </div>
          {growth.state.weeklyReflections.slice(0, 3).map((item) => (
            <WeeklyReflectionCard key={item.id} item={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
