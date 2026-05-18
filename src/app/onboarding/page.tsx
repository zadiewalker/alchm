'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JournalFlow } from '@/components/journal/JournalFlow';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { completeOnboarding, isFirstTimeUser } from '@/lib/onboarding';
import { DESIGN } from '@/lib/design';

const FIRST_PROMPT = 'What brought you here today?';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 3>(1);

  useEffect(() => {
    if (!isFirstTimeUser()) {
      router.replace('/dashboard/');
    }
  }, [router]);

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
            <p style={captionStyle}>ALCHM</p>
            <h1 style={titleStyle}>Write what is here.</h1>
            <p style={bodyStyle}>One entry begins this. Khepera answers in three parts.</p>
            <div style={actionStackStyle}>
              <button type="button" style={primaryButtonStyle} onClick={() => setStep(3)}>Start writing</button>
              <button type="button" style={secondaryButtonStyle} onClick={finishOnboarding}>Not now</button>
              <button type="button" style={quietButtonStyle} onClick={() => router.push('/emergency/')}>
                In crisis? Resources
              </button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <JournalFlow
            quickStartContext={{
              templateId: 'onboarding:first-reflection',
              title: 'First reflection',
              prompt: FIRST_PROMPT,
            }}
            thresholdQuestion={FIRST_PROMPT}
            completionContext={{
              destination: 'journal',
              title: 'The first entry is here.',
              detail: 'This space is here when you need it. Nothing else is required.',
              ctaLabel: 'Enter ALCHM',
            }}
            onComplete={finishOnboarding}
          />
        ) : null}
      </main>
    </SanctuaryLayout>
  );
}

function Scarab() {
  return (
    <svg viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg" style={{ width: 44, height: 56, marginBottom: 8 }} aria-hidden="true">
      <circle cx="32" cy="6" r="5.5" fill="var(--color-sage-500)" />
      <path d="M26,22 Q26,13 32,12 Q38,13 38,22 Z" fill="var(--surface-elevated)" />
      <ellipse cx="12" cy="36" rx="10" ry="9" fill="var(--surface-elevated)" opacity="0.92" />
      <ellipse cx="52" cy="36" rx="10" ry="9" fill="var(--surface-elevated)" opacity="0.92" />
      <ellipse cx="32" cy="45" rx="18" ry="25" fill="var(--surface-elevated)" />
      <path d="M32 19 L32 69" stroke="var(--color-sage-500)" strokeWidth="2" opacity="0.75" />
      <path d="M20 36 Q32 42 44 36" stroke="var(--color-sage-500)" strokeWidth="2" fill="none" opacity="0.65" />
      <path d="M18 49 Q32 57 46 49" stroke="var(--color-sage-500)" strokeWidth="2" fill="none" opacity="0.65" />
    </svg>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: DESIGN.spacing.lg,
};

const panelStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 520,
  display: 'grid',
  gap: DESIGN.spacing.md,
  justifyItems: 'center',
  textAlign: 'center',
  padding: DESIGN.spacing.lg,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.serif,
  fontSize: DESIGN.typography.sizes.xxl,
  fontWeight: 500,
};

const bodyStyle: React.CSSProperties = {
  margin: 0,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.base,
  lineHeight: String(DESIGN.typography.lineHeights.relaxed),
};

const captionStyle: React.CSSProperties = {
  margin: 0,
  color: DESIGN.colors.textMuted,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

const actionStackStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: DESIGN.spacing.sm,
  marginTop: DESIGN.spacing.sm,
};

const primaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  padding: '11px 18px',
  background: DESIGN.colors.bgElevated,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

const secondaryButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textSecondary,
};

const quietButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  border: 'none',
  background: 'transparent',
  color: DESIGN.colors.textMuted,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};
