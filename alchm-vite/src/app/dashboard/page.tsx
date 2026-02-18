
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/router';
import { EntryCard } from '@/components/EntryCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { DESIGN } from '@/lib/design';
import { getEntries } from '@/lib/journal';
import { getCurrentStage } from '@/lib/khepera';
import { getSettings } from '@/lib/settings';
import { checkAndUpdateStreak, requestKindnessBreak, type StreakResult } from '@/lib/streaks';
import type { JournalEntry, PageState } from '@/lib/types';
import { readString, STORAGE_KEYS, writeString } from '@/lib/storage';

function moons(n: number): string {
  const c = Math.max(0, Math.min(2, Math.floor(n)));
  return `${c >= 1 ? '☽' : '○'} ${c >= 2 ? '☽' : '○'}`;
}

function daysBetweenUtc(a: Date, b: Date): number {
  const dayMs = 86_400_000;
  const aUtc = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const bUtc = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.floor((aUtc - bUtc) / dayMs);
}

function pickGracePrompt(seed: number): string {
  const prompts = [
    'Write about what brought you back today.',
    "What's one thing that's different since you were last here?",
    'Start anywhere. Even one word.',
    'What does today feel like?',
  ];
  return prompts[Math.abs(seed) % prompts.length];
}

type Continuity = { greeting: string; whisper: string; stageName: string; showGraceToken: boolean; gracePrompt: string | null; showStageTransition: boolean; stageId: string };
function buildContinuity(entries: JournalEntry[]): Continuity {
  const now = new Date();
  const entryCount = entries.length;
  const stage = getCurrentStage(entryCount);
  let daysSinceLast = Number.POSITIVE_INFINITY;
  let lastEntryIso = '';
  if (entryCount) {
    lastEntryIso = entries[0].createdAt || entries[0].updatedAt || '';
    const d = new Date(lastEntryIso);
    if (!Number.isNaN(d.getTime())) daysSinceLast = daysBetweenUtc(now, d);
  }

  let greeting = 'Welcome to your sanctuary.';
  if (entryCount === 0) greeting = 'Welcome to your sanctuary.';
  else if (daysSinceLast >= 3) greeting = 'Welcome back. Your sanctuary has been waiting.';
  else if (now.getHours() < 12) greeting = 'Good morning.';
  else if (now.getHours() < 17) greeting = 'Good afternoon.';
  else greeting = 'The day is settling.';

  const lastGraceShownFor = readString(STORAGE_KEYS.lastGraceShownForEntryDate, '');
  const showGraceToken = entryCount > 0 && daysSinceLast >= 3 && lastGraceShownFor !== lastEntryIso;
  const gracePrompt = showGraceToken ? pickGracePrompt(Date.parse(lastEntryIso) || now.getTime()) : null;

  const lastShownStageId = readString(STORAGE_KEYS.lastShownStageId, '');
  const showStageTransition = entryCount > 0 && stage.id !== lastShownStageId && stage.threshold > 0;

  let whisper = "I'm Khepera. When you write, I listen.";
  if (entryCount === 0) whisper = "I'm Khepera. When you write, I listen.";
  else if (showGraceToken) whisper = "You were away. No streak broken. No points lost. You're here now, and that's enough.";
  else if (showStageTransition) whisper = `Khepera has deepened. After ${stage.threshold} entries, I listen differently. More gently. You'll notice.`;
  else if (entryCount === 1) whisper = 'You wrote your first entry. That took something.';
  else if (daysSinceLast >= 7) whisper = "It's been a while. No judgment, only welcome.";
  else if (entryCount >= 5) whisper = "Patterns are forming. When you're ready, The Mirror can hold them with you.";

  return { greeting, whisper, stageName: stage.name, showGraceToken, gracePrompt, showStageTransition, stageId: stage.id };
}

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [recentEntry, setRecentEntry] = useState<JournalEntry | null>(null);
  const [streak, setStreak] = useState<StreakResult | null>(null);
  const [continuity, setContinuity] = useState<Continuity>(() => buildContinuity([]));
  const settings = useMemo(() => getSettings(), []);

  useEffect(() => {
    try {
      const all = getEntries();
      setRecentEntry(all[0] || null);
      setState(all.length ? 'ready' : 'empty');
      setStreak(checkAndUpdateStreak());
      const c = buildContinuity(all);
      setContinuity(c);
      if (c.showGraceToken && all[0]?.createdAt) writeString(STORAGE_KEYS.lastGraceShownForEntryDate, all[0].createdAt);
      if (c.showStageTransition && c.stageId) writeString(STORAGE_KEYS.lastShownStageId, c.stageId);
    } catch {
      setRecentEntry(null);
      setState('error');
    }
  }, []);

  const showCheckin = useMemo(() => {
    if (!settings.eveningCheckInEnabled) return false;
    return new Date().getHours() >= 18;
  }, [settings.eveningCheckInEnabled]);

  return (
    <div style={{ padding: '28px 20px' }}>
      <div className="card" style={{ background: DESIGN.gradients.dashboardHeader, border: `1px solid ${DESIGN.colors.borderLight}`, padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '0.5px' }}>{continuity.greeting}</div>
            <div style={{ marginTop: '8px', fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.5 }}>Your sanctuary is open.</div>
          </div>
          <button type="button" onClick={() => router.push('/settings/')} aria-label="Open settings" className="btn-ghost" style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer', padding: '8px 10px', alignSelf: 'flex-start' }}>
            Settings
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '14px', padding: '16px' }} aria-label="Khepera presence">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline' }}>
          <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted, letterSpacing: '0.4px' }}>🪲 Khepera · {continuity.stageName}</div>
          {streak ? <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted }}>{streak.currentStreak} {streak.currentStreak === 1 ? 'day' : 'days'}</div> : null}
        </div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>“{continuity.whisper}”</div>
      </div>

      {streak ? (
        <div className="card" style={{ marginTop: '12px', padding: '16px' }} aria-label="Grace tokens and breaks">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline' }}>
            <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary, fontWeight: DESIGN.typography.weights.semibold }}>{streak.currentStreak} {streak.currentStreak === 1 ? 'day' : 'days'}</div>
            <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted }}>{moons(streak.graceTokensRemaining)} grace tokens available</div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>{streak.message}</div>
          <button type="button" onClick={() => { requestKindnessBreak(); setStreak(checkAndUpdateStreak()); }} aria-label="Take a kindness break" className="btn-ghost" style={{ marginTop: '10px', fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>
            Need a pause? Take a break →
          </button>
        </div>
      ) : null}

      <div style={{ marginTop: '18px', display: 'flex', gap: '12px' }}>
        <button type="button" onClick={() => router.push('/journal/new/')} aria-label="Write a new journal entry" className="btn-primary" style={{ flex: 1, borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>Write</button>
        {showCheckin ? <button type="button" onClick={() => router.push('/checkin/')} aria-label="Evening check-in" className="btn-secondary" style={{ padding: '0 16px', borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>Check in</button> : null}
      </div>

      {state === 'loading' ? <LoadingState label="Loading your sanctuary…" /> : null}
      {state === 'empty' ? (
        <EmptyState
          title="Your sanctuary is open."
          message="Your journal is quiet. That's okay. When you're ready, write."
          action={<button type="button" onClick={() => router.push('/journal/new/')} aria-label="Write your first journal entry" className="btn-primary" style={{ padding: '0 18px', borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>Write</button>}
        />
      ) : null}

      {state === 'ready' ? (
        <>
          <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary, fontWeight: DESIGN.typography.weights.semibold }}>Most recent</div>
            <button type="button" onClick={() => router.push('/journal/')} aria-label="Open journal list" style={{ border: 'none', background: 'transparent', color: DESIGN.colors.gold, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer', minHeight: '44px', padding: '0 8px' }}>View all →</button>
          </div>
          {recentEntry ? <div style={{ marginTop: '12px' }}><EntryCard entry={recentEntry} onOpen={() => router.push('/journal/')} /></div> : null}
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => router.push('/pathways/')} aria-label="Open pathways" className="btn-secondary" style={{ flex: 1, borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>Pathways</button>
            <button type="button" onClick={() => router.push('/insights/')} aria-label="Open The Mirror" className="btn-secondary" style={{ flex: 1, borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>The Mirror</button>
          </div>
        </>
      ) : null}

      {state === 'error' ? <ErrorState message="ALCHM couldn't load your entries. Your data is still on your device." onRetry={() => router.refresh()} /> : null}
    </div>
  );
}
