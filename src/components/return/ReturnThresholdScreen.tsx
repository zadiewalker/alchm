'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReturnThresholdData } from '@/hooks/useReturnThresholdData';
import { useReturnNavigation } from '@/hooks/useReturnNavigation';
import type { ReturnType } from '@/types/return';

interface ReturnThresholdScreenProps {
  entryId: string | null;
  returnType: ReturnType;
  surfacedAt?: number;
  daysElapsed?: number;
}

const tokens = {
  background: 'var(--color-bg-app)',
  surface: 'var(--color-bg-card-strong)',
  surfaceSoft: 'var(--surface-color)',
  border: 'var(--border-subtle)',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  buttonSurface: 'var(--color-bg-action)',
  buttonSurfacePressed: 'var(--color-bg-action-hover)',
  buttonText: 'var(--color-text-primary)',
  shadow: 'var(--shadow-card)',
} as const;

function useReducedMotionPreference(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  return prefersReducedMotion;
}

export function ReturnThresholdScreen({
  entryId,
  returnType,
  surfacedAt,
  daysElapsed,
}: ReturnThresholdScreenProps): React.JSX.Element {
  const router = useRouter();
  const { buildJournalHref } = useReturnNavigation();
  const prefersReducedMotion = useReducedMotionPreference();
  const { data, isLoading, error } = useReturnThresholdData(entryId);
  const [isKeptForConversation, setIsKeptForConversation] = useState(false);
  const [revealed, setRevealed] = useState({
    statement: prefersReducedMotion,
    excerpt: prefersReducedMotion,
    meta: prefersReducedMotion,
    button: prefersReducedMotion,
  });

  useEffect(() => {
    if (prefersReducedMotion || isLoading) {
      setRevealed({
        statement: true,
        excerpt: true,
        meta: true,
        button: true,
      });
      return;
    }

    setRevealed({
      statement: false,
      excerpt: false,
      meta: false,
      button: false,
    });

    const timers = [
      window.setTimeout(() => setRevealed((value) => ({ ...value, statement: true })), 360),
      window.setTimeout(() => setRevealed((value) => ({ ...value, excerpt: true })), 520),
      window.setTimeout(() => setRevealed((value) => ({ ...value, meta: true })), 680),
      window.setTimeout(() => setRevealed((value) => ({ ...value, button: true })), 840),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [isLoading, prefersReducedMotion]);

  const daysLabel = 'Written earlier';

  const revealStyle = (visible: boolean, offset = 4): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
    transition: prefersReducedMotion ? 'none' : 'opacity 280ms var(--ease-out-gentle), transform 280ms var(--ease-out-gentle)',
  });

  const handleContinue = (): void => {
    if (!entryId) {
      router.push('/journal/new');
      return;
    }

    router.push(buildJournalHref({
      entryId,
      returnType,
      surfacedAt: surfacedAt ?? Date.now(),
      daysElapsed: typeof daysElapsed === 'number' ? daysElapsed : data?.daysAgo,
    }));
  };

  const handleKeepForConversation = (): void => {
    setIsKeptForConversation(true);
  };

  const handleLeaveForNow = (): void => {
    router.push('/journal/new');
  };

  if (isLoading) {
    return (
      <main
        aria-busy="true"
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: tokens.background,
          color: tokens.textPrimary,
          paddingTop: 'max(var(--space-6), var(--safe-top))',
          paddingRight: 'var(--space-6)',
          paddingBottom: 'max(var(--space-6), var(--safe-bottom))',
          paddingLeft: 'var(--space-6)',
        }}
      >
        <div style={{ margin: '0 auto', display: 'flex', minHeight: 'calc(100vh - 48px)', maxWidth: '32rem', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--space-6)', height: '40px', width: '208px', borderRadius: 'var(--radius-xl)', backgroundColor: tokens.surface }} />
            <div style={{ marginBottom: 'var(--space-4)', minHeight: '6.5rem', width: '100%', borderRadius: 'var(--radius-2xl)', backgroundColor: tokens.surface }} />
            <div style={{ height: '16px', width: '112px', borderRadius: 'var(--radius-pill)', backgroundColor: tokens.surface }} />
          </div>
          <div style={{ height: '48px', width: '100%', borderRadius: 'var(--radius-pill)', backgroundColor: tokens.surface }} />
        </div>
      </main>
    );
  }

  if (!entryId || error || !data) {
    return (
      <main
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: tokens.background,
          color: tokens.textPrimary,
          paddingTop: 'max(var(--space-6), var(--safe-top))',
          paddingRight: 'var(--space-6)',
          paddingBottom: 'max(var(--space-6), var(--safe-bottom))',
          paddingLeft: 'var(--space-6)',
        }}
      >
        <div style={{ margin: '0 auto', display: 'flex', minHeight: 'calc(100vh - 48px)', maxWidth: '32rem', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h1
              style={{
                margin: '0 0 var(--space-4)',
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                lineHeight: 1,
                fontWeight: 500,
              }}
            >
              From earlier in your writing
            </h1>

            <p
              style={{
                maxWidth: '28ch',
                margin: 0,
                color: tokens.textSecondary,
                fontFamily: 'var(--font-ui)',
                fontSize: '1rem',
                lineHeight: 1.75,
              }}
            >
              This return is not available right now.
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            style={{
              height: '48px',
              width: '100%',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: tokens.buttonSurface,
              color: tokens.buttonText,
              fontFamily: 'var(--font-ui)',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: tokens.shadow,
            }}
          >
            Begin a new entry
          </button>
        </div>
      </main>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-8) var(--space-6)',
        background: tokens.background,
        color: tokens.textPrimary,
      }}
    >
      <div aria-hidden="true" style={{ height: '48px' }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '32rem',
          width: '100%',
          gap: 'var(--space-5)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-5)',
            width: '100%',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-2xl)',
            backgroundColor: tokens.surfaceSoft,
            border: `1px solid ${tokens.border}`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-label-sm)',
              fontWeight: 500,
              color: tokens.textSecondary,
              letterSpacing: 'var(--tracking-none)',
              ...revealStyle(revealed.statement),
            }}
          >
            From earlier in your writing
          </p>

          <div
            style={{
              width: '100%',
              minHeight: '9rem',
              borderRadius: '28px',
              padding: 'var(--space-5)',
              backgroundColor: tokens.surface,
              border: `1px solid ${tokens.border}`,
              boxShadow: tokens.shadow,
              ...revealStyle(revealed.excerpt, 2),
            }}
          >
            <p
              style={{
                margin: '0 0 var(--space-3)',
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-label-sm)',
                fontWeight: 500,
                color: tokens.textSecondary,
                letterSpacing: 'var(--tracking-none)',
              }}
            >
              A line from before
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-ui)',
                fontSize: '1.1rem',
                lineHeight: 1.85,
                color: tokens.textPrimary,
              }}
            >
              “{data.excerpt}”
            </p>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-heading-xl)',
              lineHeight: 'var(--leading-heading)',
              fontWeight: 400,
              margin: 0,
              ...revealStyle(revealed.statement),
            }}
          >
            This came back.
          </h1>

          <p
            style={{
              minHeight: '1.5rem',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-label-md)',
              lineHeight: 'var(--leading-label)',
              color: tokens.textSecondary,
              margin: 0,
              ...revealStyle(revealed.meta, 0),
            }}
          >
            {daysLabel}
          </p>

          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-ui)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: tokens.textSecondary,
              maxWidth: '28ch',
              ...revealStyle(revealed.meta, 0),
            }}
          >
            Something from earlier is here again. Keep it near, begin from it, or leave it here for now.
          </p>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '20rem', display: 'grid', gap: 'var(--space-3)' }}>
        <button
          type="button"
          className="btn-primary"
          style={{
            width: '100%',
            opacity: revealed.button ? 1 : 0,
            transform: revealed.button ? 'translateY(0)' : 'translateY(2px)',
            transition: prefersReducedMotion ? 'none' : 'opacity 220ms var(--ease-out-gentle), transform 220ms var(--ease-out-gentle), background-color 150ms ease',
            backgroundColor: isKeptForConversation ? tokens.surface : tokens.buttonSurface,
            color: tokens.buttonText,
            fontFamily: 'var(--font-ui)',
            fontSize: '1rem',
            fontWeight: 500,
            boxShadow: tokens.shadow,
            border: isKeptForConversation ? `1px solid ${tokens.border}` : 'none',
          }}
          onClick={handleKeepForConversation}
          onMouseDown={(event) => {
            event.currentTarget.style.backgroundColor = isKeptForConversation
              ? tokens.surface
              : tokens.buttonSurfacePressed;
          }}
          onMouseUp={(event) => {
            event.currentTarget.style.backgroundColor = isKeptForConversation
              ? tokens.surface
              : tokens.buttonSurface;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = isKeptForConversation
              ? tokens.surface
              : tokens.buttonSurface;
          }}
        >
          {isKeptForConversation ? 'Kept for conversation' : 'Keep this for conversation'}
        </button>

        <button
          type="button"
          className="btn-primary"
          style={{
            width: '100%',
            opacity: revealed.button ? 1 : 0,
            transform: revealed.button ? 'translateY(0)' : 'translateY(2px)',
            transition: prefersReducedMotion ? 'none' : 'opacity 220ms var(--ease-out-gentle), transform 220ms var(--ease-out-gentle), background-color 150ms ease',
            backgroundColor: tokens.buttonSurface,
            color: tokens.buttonText,
            fontFamily: 'var(--font-ui)',
            fontSize: '1rem',
            fontWeight: 500,
            boxShadow: tokens.shadow,
            border: 'none',
          }}
          onClick={handleContinue}
          onMouseDown={(event) => {
            event.currentTarget.style.backgroundColor = tokens.buttonSurfacePressed;
          }}
          onMouseUp={(event) => {
            event.currentTarget.style.backgroundColor = tokens.buttonSurface;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = tokens.buttonSurface;
          }}
        >
          Begin a new entry
        </button>

        <button
          type="button"
          style={{
            width: '100%',
            minHeight: '44px',
            opacity: revealed.button ? 1 : 0,
            transform: revealed.button ? 'translateY(0)' : 'translateY(2px)',
            transition: prefersReducedMotion ? 'none' : 'opacity 220ms var(--ease-out-gentle), transform 220ms var(--ease-out-gentle)',
            backgroundColor: 'transparent',
            color: tokens.textSecondary,
            fontFamily: 'var(--font-ui)',
            fontSize: '0.95rem',
            fontWeight: 400,
            border: `1px solid ${tokens.border}`,
            borderRadius: 'var(--radius-pill)',
          }}
          onClick={handleLeaveForNow}
        >
          Leave for now
        </button>
      </div>
    </div>
  );
}
