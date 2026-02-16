'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeJournalEntry } from '@/lib/api/aiAnalysisApi';
import { useData } from '@/hooks/useData';
import { completeOnboarding, isFirstTimeUser } from '@/lib/onboarding';
import { DESIGN } from '@/lib/design';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';

const moods = ['anxious', 'heavy', 'numb', 'restless', 'tender', 'hopeful', 'alive', 'shattered', 'calm', 'burning'];
const FIRST_PROMPT = 'What brought you here today?';

export default function OnboardingPage() {
  const router = useRouter();
  const { saveJournalEntry } = useData();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [entry, setEntry] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [animatedReflection, setAnimatedReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canShare = useMemo(() => entry.trim().length > 0, [entry]);

  useEffect(() => {
    if (!isFirstTimeUser()) {
      router.replace('/dashboard/');
    }
  }, [router]);

  useEffect(() => {
    if (step !== 4 || !reflection) return;
    let index = 0;
    setAnimatedReflection('');
    const timer = window.setInterval(() => {
      index += 1;
      setAnimatedReflection(reflection.slice(0, index));
      if (index >= reflection.length) {
        window.clearInterval(timer);
      }
    }, 20);

    return () => window.clearInterval(timer);
  }, [step, reflection]);

  const submitFirstEntry = async () => {
    if (!canShare || saving) return;
    setSaving(true);
    setError('');

    try {
      const entryId = await saveJournalEntry({
        content: entry.trim(),
        title: 'First Reflection',
        mood: 5,
        emotions: selectedMoods,
        tags: [],
        isPrivate: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const ai = await analyzeJournalEntry(entry.trim(), 'anonymous', entryId);
      setReflection(`${ai.analysis.emotionalRecognition}\n\n${ai.analysis.gentleInsight}`);
      setStep(4);
    } catch {
      setError('Could not complete your first reflection. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const finishOnboarding = () => {
    completeOnboarding();
    router.push('/dashboard/');
  };

  return (
    <SanctuaryLayout noPadding>
      <main style={pageStyle}>
        {step === 1 ? (
          <section style={panelStyle}>
            <Scarab />
            <h1 style={titleStyle}>Welcome to ALCHM</h1>
            <p style={bodyStyle}>A quiet space for reflection. No streaks. No scores. Just you and your words.</p>
            <button type="button" style={primaryButtonStyle} onClick={() => setStep(2)}>Continue</button>
          </section>
        ) : null}

        {step === 2 ? (
          <section style={panelStyle}>
            <Scarab />
            <h2 style={titleStyle}>This is Khepera</h2>
            <p style={bodyStyle}>
              Khepera is your companion in reflection. Not a therapist. Not a chatbot. A mirror to help you see yourself more clearly.
            </p>
            <p style={bodyStyle}>
              Khepera listens through five lenses: how you think, your inner parts, what your body holds, your story, and what it all means.
            </p>
            <button type="button" style={primaryButtonStyle} onClick={() => setStep(3)}>Continue</button>
          </section>
        ) : null}

        {step === 3 ? (
          <section style={panelStyle}>
          <h2 style={titleStyle}>Let's begin</h2>
          <p style={bodyStyle}>Khepera asks: {FIRST_PROMPT}</p>

          <div style={moodWrapStyle}>
            {moods.map((mood) => {
              const selected = selectedMoods.includes(mood);
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() =>
                    setSelectedMoods((prev) =>
                      prev.includes(mood) ? prev.filter((item) => item !== mood) : [...prev, mood],
                    )
                  }
                  style={{
                    ...moodChipStyle,
                    border: `1px solid ${selected ? DESIGN.colors.goldDim : DESIGN.colors.border}`,
                    color: selected ? DESIGN.colors.textKhepera : DESIGN.colors.textSecondary,
                    background: selected ? 'rgba(232,197,109,0.2)' : DESIGN.colors.cardBg,
                  }}
                >
                  {mood}
                </button>
              );
            })}
          </div>

          <textarea
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            placeholder="Write what is true right now..."
            style={textareaStyle}
          />

          {error ? <p style={errorStyle}>{error}</p> : null}

          <button
            type="button"
            style={primaryButtonStyle}
            disabled={!canShare || saving}
            onClick={submitFirstEntry}
          >
            {saving ? 'Sharing...' : 'Share with Khepera'}
          </button>
          </section>
        ) : null}

        {step === 4 ? (
          <section style={panelStyle}>
          <h2 style={titleStyle}>Khepera</h2>
          <div style={reflectionCardStyle}>
            <p style={{ ...bodyStyle, whiteSpace: 'pre-wrap' }}>{animatedReflection || 'Listening...'}</p>
          </div>
          <p style={bodyStyle}>This is your sanctuary. Khepera will be here whenever you return.</p>
          <button type="button" style={primaryButtonStyle} onClick={finishOnboarding}>Enter ALCHM</button>
          </section>
        ) : null}
      </main>
    </SanctuaryLayout>
  );
}

function Scarab() {
  return (
    <svg viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg" style={{ width: 44, height: 56, marginBottom: 8 }} aria-hidden="true">
      <circle cx="32" cy="6" r="5.5" fill="#E5C97D" />
      <path d="M26,22 Q26,13 32,12 Q38,13 38,22 Z" fill="#EAE5D9" />
      <ellipse cx="12" cy="36" rx="10" ry="9" fill="#EAE5D9" opacity="0.92" />
      <ellipse cx="52" cy="36" rx="10" ry="9" fill="#EAE5D9" opacity="0.92" />
      <ellipse cx="32" cy="44" rx="14" ry="24" fill="#EAE5D9" />
    </svg>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${DESIGN.colors.bgDeep}, ${DESIGN.colors.bgSurface})`,
  color: DESIGN.colors.textPrimary,
  padding: DESIGN.spacing.lg,
  fontFamily: DESIGN.typography.sansSerif,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const panelStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 640,
  borderRadius: DESIGN.radius.xl,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.bgElevated,
  padding: DESIGN.spacing.lg,
  display: 'grid',
  gap: DESIGN.spacing.md,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.xl,
  fontWeight: DESIGN.typography.weights.semibold,
  color: DESIGN.colors.textPrimary,
};

const bodyStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.base,
  lineHeight: String(DESIGN.typography.lineHeights.relaxed),
  color: DESIGN.colors.textSecondary,
};

const primaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  padding: '10px 16px',
  background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
  color: '#fff',
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

const moodWrapStyle: React.CSSProperties = {
  display: 'flex',
  gap: DESIGN.spacing.xs,
  flexWrap: 'wrap',
};

const moodChipStyle: React.CSSProperties = {
  minHeight: '36px',
  borderRadius: DESIGN.radius.full,
  padding: '6px 10px',
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 170,
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.base,
  lineHeight: String(DESIGN.typography.lineHeights.relaxed),
  padding: DESIGN.spacing.md,
  outline: 'none',
  resize: 'vertical',
};

const reflectionCardStyle: React.CSSProperties = {
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.bgWarm,
  padding: DESIGN.spacing.md,
};

const errorStyle: React.CSSProperties = {
  margin: 0,
  color: DESIGN.colors.error,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};
