// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from '@/router';
import { ErrorState, LoadingState } from '@/components/States';
import { CheckInSheet } from '@/components/CheckInSheet';
import { DESIGN } from '@/lib/design';
import { STORAGE_KEYS, writeJson, writeString } from '@/lib/storage';
import { useDashboardEngagement, formatDate } from '@/app/dashboard/useDashboardEngagement';
import type { EmotionFamily } from '@/lib/emotions';
import { haptics } from '@/services/haptics';
import { getActivePathway, getPathwayById } from '@/lib/pathways';

function getMoodDotColor(score?: number): string {
  if (typeof score !== 'number') return 'var(--sage-500)';
  if (score <= 2) return 'var(--sage-dark)';
  if (score <= 4) return 'var(--gold-dark)';
  if (score <= 6) return 'var(--sage-deep)';
  if (score <= 8) return 'var(--sage-base)';
  return 'var(--sage-mid)';
}

export default function DashboardPage() {
  const router = useRouter();
  const [showCheckInFlow, setShowCheckInFlow] = useState(false);
  const [isLingerMode, setIsLingerMode] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const quickPressTimer = useRef<number | null>(null);
  const dashboard = useDashboardEngagement();
  const activePathway = useMemo(() => {
    const progress = getActivePathway();
    if (!progress) return null;
    const pathway = getPathwayById(progress.pathwayId);
    if (!pathway) return null;
    return { title: pathway.title, day: progress.currentStep || 1 };
  }, [dashboard.state, dashboard.recentEntry?.id]);
  const recentEntries = useMemo(
    () => dashboard.entries
      .filter((entry) => (entry.type !== 'check-in' && entry.type !== 'checkin') && !!entry.content)
      .slice(0, 2),
    [dashboard.entries],
  );

  useEffect(() => {
    if (hasInteracted || showCheckInFlow) return;
    const timer = window.setTimeout(() => setIsLingerMode(true), 10000);
    return () => window.clearTimeout(timer);
  }, [hasInteracted, showCheckInFlow]);

  const startWrite = () => {
    setHasInteracted(true);
    setIsLingerMode(false);
    void haptics.medium();
    dashboard.prefillFromTodayCheckIn();
    router.push('/journal/new/');
  };
  const startQuickWrite = () => {
    setHasInteracted(true);
    setIsLingerMode(false);
    writeJson(STORAGE_KEYS.pendingQuickEntry, true);
    void haptics.light();
    router.push('/journal/new/');
  };
  const onPressStart = () => {
    if (quickPressTimer.current) window.clearTimeout(quickPressTimer.current);
    quickPressTimer.current = window.setTimeout(() => {
      quickPressTimer.current = null;
      startQuickWrite();
    }, 500);
  };
  const onPressEnd = () => {
    if (!quickPressTimer.current) return;
    window.clearTimeout(quickPressTimer.current);
    quickPressTimer.current = null;
  };

  return (
    <div
      className="dashboard-breath"
      style={{
        minHeight: '100%',
        padding: 'max(14px, env(safe-area-inset-top)) 24px calc(88px + env(safe-area-inset-bottom))',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          aria-label="Settings"
          className="btn-ghost"
          onClick={() => router.push('/settings/')}
          style={{ minHeight: '34px', paddingInline: '10px', color: 'var(--text-secondary)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm9 3.4-1.9-.6a7.9 7.9 0 0 0-.5-1.3l1-1.7a1 1 0 0 0-.1-1.2l-1.4-1.4a1 1 0 0 0-1.2-.1l-1.7 1a7.9 7.9 0 0 0-1.3-.5L13 3a1 1 0 0 0-1-.8h-2a1 1 0 0 0-1 .8l-.6 1.9a7.9 7.9 0 0 0-1.3.5l-1.7-1a1 1 0 0 0-1.2.1L2.8 5.9a1 1 0 0 0-.1 1.2l1 1.7c-.2.4-.4.9-.5 1.3L1.3 12a1 1 0 0 0-.8 1v2a1 1 0 0 0 .8 1l1.9.6c.1.5.3.9.5 1.3l-1 1.7a1 1 0 0 0 .1 1.2l1.4 1.4a1 1 0 0 0 1.2.1l1.7-1c.4.2.9.4 1.3.5l.6 1.9a1 1 0 0 0 1 .8h2a1 1 0 0 0 1-.8l.6-1.9c.5-.1.9-.3 1.3-.5l1.7 1a1 1 0 0 0 1.2-.1l1.4-1.4a1 1 0 0 0 .1-1.2l-1-1.7c.2-.4.4-.9.5-1.3l1.9-.6a1 1 0 0 0 .8-1v-2a1 1 0 0 0-.8-1Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <section style={{ marginTop: '42px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '29px', lineHeight: 1.2, color: 'var(--text-primary)', fontWeight: 300, letterSpacing: '-0.02em' }}>{dashboard.greetingTitle}</h1>
        <p style={{ marginTop: '10px', marginBottom: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {isLingerMode ? "You don't have to write today. You can just be here for a minute." : dashboard.greetingSubtitle}
        </p>
      </section>

      <section style={{ marginTop: '40px' }}>
        <button
          type="button"
          onClick={startWrite}
          onMouseDown={onPressStart}
          onMouseUp={onPressEnd}
          onMouseLeave={onPressEnd}
          onTouchStart={onPressStart}
          onTouchEnd={onPressEnd}
          aria-label="Write a new journal entry"
          className="btn-primary"
          style={{ width: '100%', fontFamily: DESIGN.typography.sansSerif }}
        >
          {dashboard.beginLabel}
        </button>
        <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>{dashboard.ctaSubtext}</div>

        <button
          type="button"
          onClick={() => {
            setHasInteracted(true);
            setIsLingerMode(false);
            setShowCheckInFlow((v) => !v);
          }}
          style={{
            marginTop: '14px',
            border: 'none',
            background: 'transparent',
            color: isLingerMode ? 'var(--gold-primary)' : 'var(--text-secondary)',
            fontSize: '14px',
            minHeight: '34px',
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            width: '100%',
            fontWeight: isLingerMode ? 600 : 400,
          }}
        >
          {isLingerMode ? 'Just a check-in — no words needed →' : dashboard.secondaryLabel}
        </button>
      </section>
      <CheckInSheet
        open={showCheckInFlow}
        onClose={() => setShowCheckInFlow(false)}
        onDone={(mood) => {
          const map: Record<string, { familyId: EmotionFamily; specificId: string | null; label: string }> = {
            Heavy: { familyId: 'sadness', specificId: 'heavy', label: 'Heavy' },
            Anxious: { familyId: 'fear', specificId: 'anxious', label: 'Anxious' },
            Neutral: { familyId: 'surprise', specificId: null, label: 'Neutral' },
            Hopeful: { familyId: 'joy', specificId: 'hopeful', label: 'Hopeful' },
            Peaceful: { familyId: 'joy', specificId: 'peaceful', label: 'Peaceful' },
          };
          const selection = map[mood];
          dashboard.saveQuickCheckIn(selection);
          setShowCheckInFlow(false);
        }}
      />

      {dashboard.state === 'loading' ? <LoadingState label="Loading your sanctuary…" /> : null}

      {dashboard.state === 'empty' ? (
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)' }}>
          Your first entry is waiting.
        </div>
      ) : null}

      {dashboard.state === 'ready' && recentEntries.length > 0 ? (
        <section style={{ marginTop: '30px' }}>
          {recentEntries.map((entry, idx) => (
            <div key={entry.id}>
              {idx === 0 ? <div className="section-divider" /> : null}
              <button
                type="button"
                onClick={() => {
                  writeString(STORAGE_KEYS.selectedEntryId, entry.id);
                  router.push('/entry/');
                }}
                aria-label="Open recent entry"
                className="dashboard-recent-entry"
                style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
              >
                <div>
                  <div className="dashboard-recent-entry-meta">
                    <span
                      className="dashboard-mood-dot"
                      style={{ background: getMoodDotColor(entry.mood) }}
                      aria-hidden="true"
                    />
                    {formatDate(entry.createdAt || entry.updatedAt)}
                    {entry.depth?.emotion?.label || entry.emotionSelection?.label ? ` · ${entry.depth?.emotion?.label || entry.emotionSelection?.label}` : ''}
                  </div>
                  <div className="dashboard-recent-entry-preview">{entry.content || 'Check-in'}</div>
                </div>
                <span className="dashboard-recent-entry-arrow">→</span>
              </button>
              <div className="section-divider" />
            </div>
          ))}
        </section>
      ) : null}

      {activePathway ? (
        <section style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Day {activePathway.day} of {activePathway.title} is waiting for you.
          </div>
          <button
            type="button"
            className="btn-ghost"
            style={{ marginTop: '2px', minHeight: '30px' }}
            onClick={() => router.push('/pathways/')}
          >
            Continue →
          </button>
        </section>
      ) : null}

      {dashboard.state === 'error' ? <ErrorState message="ALCHM couldn't load your entries. Your data is still on your device." onRetry={() => router.refresh()} /> : null}
    </div>
  );
}
