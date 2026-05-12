'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContainer } from '@/hooks/useContainer';
import { useAuth } from '@/hooks/useAuth';
import { MoonPhaseIndicator } from '@/components/MoonPhaseIndicator';
import { ArcReflectionCard } from '@/components/ArcReflectionCard';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { getContainerPhase } from '@/config/containerArc';
import type { LunarPhase } from '@/config/containerArc';
import { generateArcReflection } from '@/services/containers/arcGeneration';
import { DESIGN } from '@/utils/design';

export default function DailyThresholdClient() {
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const { activeContainer } = useContainer();
  const containerId = typeof params.id === 'string' ? params.id : '';

  const [arcReflection, setArcReflection] = useState<string | null>(null);
  const [arcDismissed, setArcDismissed] = useState(false);
  const [loadingArc, setLoadingArc] = useState(false);

  // Redirect if no active container or wrong container
  useEffect(() => {
    if (!activeContainer) {
      router.replace(`/containers/${containerId}`);
      return;
    }
    if (activeContainer.definition.id !== containerId) {
      router.replace(`/containers/${containerId}`);
      return;
    }
    // Already written today → return to the container instead of a missing route
    if (activeContainer.hasWrittenToday) {
      router.replace(`/containers/${containerId}`);
      return;
    }
  }, [activeContainer, containerId, router]);

  // Load arc reflection on days 7 and 14
  useEffect(() => {
    if (!activeContainer || !userId) return;
    const day = activeContainer.currentDay;
    if (day !== 7 && day !== 14) return;

    setLoadingArc(true);
    generateArcReflection(
      userId,
      activeContainer.userContainerId,
      activeContainer.definition.name,
      day
    )
      .then(text => setArcReflection(text))
      .catch(() => setArcReflection(null))
      .finally(() => setLoadingArc(false));
  }, [activeContainer, userId]);

  if (!activeContainer) return null;

  const {
    currentDay,
    phaseMetaphor,
    todayPrompt,
    somaticAnchor,
  } = activeContainer;

  const phaseData = getContainerPhase(currentDay);
  const lunarPhase: LunarPhase = phaseData?.lunarPhase ?? 'new_moon';

  return (
    <div
      data-container-atmosphere={activeContainer.definition.atmosphere}
      style={{
        minHeight: '100vh',
        paddingTop: '60px',
        paddingLeft: DESIGN.spacing.pagePadding,
        paddingRight: DESIGN.spacing.pagePadding,
        paddingBottom: '100px',
      }}
    >

      {/* Top row — moon phase */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: DESIGN.spacing.xl,
        }}
      >
        <BackButton
          navigation={{ fallback: `/containers/${containerId}` }}
          label="Back"
        />

        <MoonPhaseIndicator
          phase={lunarPhase}
          metaphorText={phaseMetaphor}
          size={20}
        />
      </div>

      {/* Arc reflection card — days 7 and 14 only */}
      {arcReflection && !arcDismissed && (
        <div style={{ marginBottom: DESIGN.spacing.lg }}>
          <ArcReflectionCard
            text={arcReflection}
            loading={loadingArc}
            onDismiss={() => setArcDismissed(true)}
          />
        </div>
      )}

      {/* Somatic anchor */}
      {somaticAnchor && (
        <AppText
          variant="secondary"
          style={{
            fontStyle: 'italic',
            marginBottom: DESIGN.spacing.md,
          }}
        >
          {somaticAnchor}
        </AppText>
      )}

      {/* Today's writing prompt */}
      <AppText
        variant="h1"
        style={{
          fontSize: 'clamp(26px, 7vw, 34px)',
          marginBottom: DESIGN.spacing.lg,
        }}
      >
        {todayPrompt}
      </AppText>

      {/* CTA */}
      <button
        className="btn-primary"
        onClick={() => router.push(`/journal/new?container=${containerId}&day=${currentDay}`)}
        aria-label="Begin writing your entry for today"
      >
        <AppText as="span" variant="body">Begin writing</AppText>
      </button>

      <div
        style={{
          marginTop: DESIGN.spacing.sm,
          display: 'grid',
          gap: DESIGN.spacing.sm,
        }}
      >
        <AppCard
          variant="standard"
          style={{
            padding: DESIGN.spacing.md,
            background: 'var(--color-bg-card-soft)',
            border: 'var(--border-visible)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <AppText
            variant="caption"
            style={{
              marginBottom: DESIGN.spacing.xs,
            }}
          >
            Held here
          </AppText>
          <AppText variant="secondary">
            This place will still be here when you return. What is here today can remain here without being resolved.
          </AppText>
        </AppCard>

        <button
          className="btn-ghost"
          style={{ width: '100%', textAlign: 'center' }}
          onClick={() => router.push('/dashboard')}
          aria-label="Come back to this later"
        >
          <AppText as="span" variant="body">Come back to this later</AppText>
        </button>
      </div>

    </div>
  );
}
