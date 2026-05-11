'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import type React from 'react';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { getContainerDefinition, getContainerDay } from '@/config/containerDefinitions';
import { getContainerMoonPhase } from '@/utils/khepera/containerContext';
import type { ContainerDefinition, ContainerDay } from '@/types/container';
import { DESIGN } from '@/utils/design';

export function DailyThresholdClient(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [container, setContainer] = useState<ContainerDefinition | null>(null);
  const [dayData, setDayData] = useState<ContainerDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState<number>(1);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const dayParam = searchParams.get('day');
    const day = dayParam ? parseInt(dayParam, 10) : 1;

    if (id) {
      const containerDef = getContainerDefinition(id);
      const dayDef = getContainerDay(id, day);
      setContainer(containerDef);
      setDayData(dayDef);
      setCurrentDay(day);
    }
    setLoading(false);
  }, [params.id, searchParams]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <AppText variant="secondary" style={loadingStyle}>Loading...</AppText>
      </div>
    );
  }

  if (!container || !dayData) {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <BackButton navigation={{ fallback: '/containers' }} label="Back" style={backButtonStyle} />
        </div>
        <AppText variant="secondary" style={errorStyle}>
          Container or day not found.
        </AppText>
      </div>
    );
  }

  const moonPhase = getContainerMoonPhase(currentDay, container.totalDays);

  const handleBeginWriting = (): void => {
    router.push(`/journal/new?container=${container.id}&day=${currentDay}`);
  };

  const getPhaseDescription = (phase: string): string => {
    if (phase === 'grounding') {
      return 'Finding your footing';
    }
    if (phase === 'pattern') {
      return 'Staying with what is present';
    }
    if (phase === 'contact') {
      return 'Meeting what arises';
    }
    if (phase === 'integration') {
      return 'Weaving it together';
    }
    return 'Staying with this rhythm';
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <BackButton navigation={{ fallback: `/containers/${container.id}` }} label="Back" style={backButtonStyle} />
        <AppText as="div" variant="body" style={headerTitleStyle}>
          {dayData.phase}
        </AppText>
      </div>

      <div style={contentStyle}>
        <AppText variant="h1" style={containerNameStyle}>
          {container.name}
        </AppText>

        <div style={phaseInfoStyle}>
          <AppCard variant="standard" style={moonPhaseContainerStyle}>
            <div style={moonSymbolStyle}>
              {moonPhase.phase === 'new' && '🌑'}
              {moonPhase.phase === 'waxing' && '🌓'}
              {moonPhase.phase === 'full' && '🌕'}
              {moonPhase.phase === 'waning' && '🌗'}
            </div>
            <AppText as="span" variant="caption" style={moonTextStyle}>
              {moonPhase.metaphorText}
            </AppText>
          </AppCard>

          <AppText as="div" variant="secondary" style={phaseDescriptionStyle}>
            {getPhaseDescription(dayData.phase)}
          </AppText>
        </div>

        {dayData.somaticAnchor && (
          <AppCard variant="standard" style={somaticAnchorContainerStyle}>
            <AppText as="div" variant="caption" style={somaticLabelStyle}>
              Before you begin
            </AppText>
            <AppText as="div" variant="secondary" style={somaticTextStyle}>
              {dayData.somaticAnchor}
            </AppText>
          </AppCard>
        )}

        <AppCard variant="standard" style={promptContainerStyle}>
          <AppText as="div" variant="body" style={promptTextStyle}>
            {dayData.prompt}
          </AppText>
        </AppCard>

        <button onClick={handleBeginWriting} style={beginButtonStyle}>
          <AppText as="span" variant="body">Begin writing</AppText>
        </button>

        <AppText as="div" variant="muted" style={dayContextStyle}>
          {moonPhase.metaphorText}
        </AppText>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'var(--bg-base)',
  color: 'var(--text-primary)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: `${DESIGN.spacing.md} ${DESIGN.spacing.pagePadding}`,
  paddingTop: '60px',
  marginBottom: DESIGN.spacing.lg,
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  fontSize: '24px',
  cursor: 'pointer',
  marginRight: DESIGN.spacing.md,
  padding: DESIGN.spacing.sm,
  borderRadius: DESIGN.radius.sm,
  lineHeight: 1,
};

const headerTitleStyle: React.CSSProperties = {
  color: DESIGN.colors.textSecondary,
};

const contentStyle: React.CSSProperties = {
  padding: `0 ${DESIGN.spacing.pagePadding} ${DESIGN.spacing.xl}`,
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: `${DESIGN.spacing.xxl} ${DESIGN.spacing.pagePadding}`,
};

const errorStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: `${DESIGN.spacing.xl} ${DESIGN.spacing.pagePadding}`,
};

const containerNameStyle: React.CSSProperties = {
  marginBottom: DESIGN.spacing.lg,
  lineHeight: 1.2,
  maxWidth: '280px',
};

const phaseInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: DESIGN.spacing.sm,
  marginBottom: DESIGN.spacing.xl,
};

const moonPhaseContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: DESIGN.spacing.sm,
  padding: `${DESIGN.spacing.sm} ${DESIGN.spacing.md}`,
  background: 'var(--color-bg-card-soft)',
  border: 'var(--border-visible)',
  boxShadow: 'var(--shadow-soft)',
};

const moonSymbolStyle: React.CSSProperties = {
  fontSize: '20px',
};

const moonTextStyle: React.CSSProperties = {
  color: DESIGN.colors.textSecondary,
};

const phaseDescriptionStyle: React.CSSProperties = {
  fontStyle: 'italic',
  color: DESIGN.colors.textSecondary,
};

const somaticAnchorContainerStyle: React.CSSProperties = {
  marginBottom: DESIGN.spacing.xl,
  padding: `${DESIGN.spacing.md} ${DESIGN.spacing.lg}`,
  background: 'var(--color-bg-card-soft)',
  border: 'var(--border-visible)',
  boxShadow: 'var(--shadow-soft)',
  maxWidth: '100%',
  width: '100%',
};

const somaticLabelStyle: React.CSSProperties = {
  marginBottom: DESIGN.spacing.xs,
};

const somaticTextStyle: React.CSSProperties = {
  lineHeight: 1.4,
  fontStyle: 'italic',
  textAlign: 'left',
};

const promptContainerStyle: React.CSSProperties = {
  marginBottom: DESIGN.spacing.xl,
  padding: `${DESIGN.spacing.lg} ${DESIGN.spacing.md}`,
  background: 'var(--color-bg-card)',
  border: 'var(--border-visible)',
  boxShadow: 'var(--shadow-soft)',
  maxWidth: '100%',
  width: '100%',
};

const promptTextStyle: React.CSSProperties = {
  lineHeight: 1.5,
  textAlign: 'left',
};

const beginButtonStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '280px',
  padding: `${DESIGN.spacing.md} ${DESIGN.spacing.lg}`,
  borderRadius: DESIGN.radius.full,
  border: 'var(--border-visible)',
  backgroundColor: 'var(--color-bg-card-soft)',
  color: 'var(--text-primary)',
  marginBottom: DESIGN.spacing.md,
  transition: 'all 0.2s ease',
};

const dayContextStyle: React.CSSProperties = {
  color: DESIGN.colors.textMuted,
};
