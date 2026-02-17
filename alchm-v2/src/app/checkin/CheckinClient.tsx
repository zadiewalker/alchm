'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { DESIGN } from '@/lib/design';
import type { JournalEntry, PageState } from '@/lib/types';
import { addEntry } from '@/lib/journal';
import { getSettings } from '@/lib/settings';
import { getAnthropicApiKey } from '@/lib/secrets';
import { buildSystemPrompt } from '@/lib/khepera';
import { getReflection } from '@/lib/api';
import { canAccessFeature } from '@/lib/subscription';
import { CheckinSteps } from './CheckinSteps';

type Step = 1 | 2 | 3;

function makeId(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function localGoodnight(mood: number | undefined): string {
  if (typeof mood !== 'number') return 'Goodnight. Even one honest breath counts.';
  if (mood <= 3) return 'Goodnight. You made it through today, and that matters.';
  if (mood <= 6) return 'Goodnight. Let the day settle gently, one layer at a time.';
  return 'Goodnight. Hold onto the softness you found today.';
}

export default function CheckinClient() {
  const router = useRouter();
  const settings = useMemo(() => getSettings(), []);
  const [state, setState] = useState<PageState>('loading');
  const [step, setStep] = useState<Step>(1);
  const [mood, setMood] = useState<number | undefined>(undefined);
  const [sentence, setSentence] = useState('');
  const [savedEntry, setSavedEntry] = useState<JournalEntry | null>(null);
  const [kheperaText, setKheperaText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const enabled = settings.eveningCheckInEnabled && canAccessFeature('eveningCheckIn');
      setState(enabled ? 'ready' : 'empty');
    } catch {
      setState('error');
    }
  }, [settings.eveningCheckInEnabled]);

  const save = useCallback(() => {
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: makeId(),
      content: sentence.trim(),
      mood,
      emotions: [],
      tags: [],
      type: 'checkin',
      isPrivate: true,
      createdAt: now,
      updatedAt: now,
    };
    addEntry(entry);
    setSavedEntry(entry);
    setStep(3);
  }, [mood, sentence]);

  const reflect = useCallback(async () => {
    setIsThinking(true);
    setError('');
    const apiKey = getAnthropicApiKey();
    if (!apiKey) {
      setKheperaText(localGoodnight(mood));
      setIsThinking(false);
      return;
    }
    try {
      const systemPrompt = buildSystemPrompt({
        entryCount: 0,
        currentStreak: 0,
        preferredFramework: null,
        isCheckin: true,
        continuityContext: 'Evening check-in',
      });
      const result = await getReflection({
        systemPrompt: `${systemPrompt}\n\nThe user is doing a brief evening check-in, not a full journal entry. Respond with ONE sentence only. A warm goodnight observation.`,
        userMessage: sentence.trim() || 'Evening check-in.',
        apiKey,
      });
      if (result.error) setError(result.error);
      else if (result.text) setKheperaText(result.text);
    } catch {
      setError('Khepera could not reflect right now.');
    } finally {
      setIsThinking(false);
    }
  }, [mood, sentence]);

  useEffect(() => {
    if (step === 3) reflect();
  }, [reflect, step]);

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

      {state === 'loading' ? <LoadingState label="Opening check-in…" /> : null}
      {state === 'error' ? <ErrorState onRetry={() => router.refresh()} /> : null}
      {state === 'empty' ? (
        <ErrorState
          title="Check-in is disabled"
          message="Enable evening check-in in Settings to use this feature."
          onRetry={() => router.push('/settings/')}
        />
      ) : null}

      {state === 'ready' ? (
        <CheckinSteps
          step={step}
          mood={mood}
          onMood={(v) => {
            setMood(v);
            setStep(2);
          }}
          sentence={sentence}
          onSentence={setSentence}
          onDone={save}
          onSkip={() => {
            setSentence('');
            save();
          }}
          isThinking={isThinking}
          error={error}
          kheperaText={kheperaText}
          onGoodnight={() => router.push('/dashboard/')}
          saved={!!savedEntry}
        />
      ) : null}
    </div>
  );
}
