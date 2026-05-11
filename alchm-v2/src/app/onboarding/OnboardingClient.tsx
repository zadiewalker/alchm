'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DESIGN } from '@/lib/design';
import type { JournalEntry } from '@/lib/types';
import { isOnboarded, setOnboarded } from '@/lib/onboarding';
import { addEntry } from '@/lib/journal';
import { OnboardingSteps } from './OnboardingSteps';

type Step = 1 | 2 | 3;

function makeId(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<number | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOnboarded()) router.replace('/dashboard/');
  }, [router]);

  const prompt = useMemo(() => `What do you want to name right now?\n\nYou can write one sentence. Or a page.`, []);

  const goNext = useCallback(() => setStep((s) => (s < 3 ? ((s + 1) as Step) : s)), []);
  const goBack = useCallback(() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s)), []);

  const finish = useCallback(() => {
    if (isSaving) return;
    setIsSaving(true);

    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: makeId(),
      content: content.trim() || prompt,
      mood,
      emotions: [],
      tags: [],
      type: 'onboarding',
      isPrivate: true,
      createdAt: now,
      updatedAt: now,
    };

    addEntry(entry);
    setOnboarded();
    router.push('/dashboard/');
  }, [content, isSaving, mood, prompt, router]);

  return (
    <div style={{ padding: '28px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={step === 1 ? () => router.push('/') : goBack}
          aria-label="Go back"
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
          ← Back
        </button>
        <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted, fontFamily: DESIGN.typography.sansSerif }}>
          Step {step} of 3
        </div>
      </div>
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }} aria-label="Onboarding progress">
        {[1, 2, 3].map((n) => {
          const active = n === step;
          return (
            <div
              key={n}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: active ? DESIGN.colors.sage400 : 'rgba(164, 180, 148, 0.25)',
              }}
            />
          );
        })}
      </div>

      <OnboardingSteps
        step={step}
        prompt={prompt}
        mood={mood}
        setMood={setMood}
        content={content}
        setContent={setContent}
        isSaving={isSaving}
        onNext={goNext}
        onFinish={finish}
      />
    </div>
  );
}
