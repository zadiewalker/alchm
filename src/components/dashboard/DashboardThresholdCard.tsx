'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppText } from '@/components/ui/AppText';
import { RitualCard } from '@/components/ui/RitualCard';
import { MotionButton } from '@/components/ui/MotionButton';
import { getCurrentQuestion } from '@/config/dashboardQuestions';
import { useContainer } from '@/hooks/useContainer';
import type { DashboardThresholdCardProps } from '@/types/dashboard';

export function DashboardThresholdCard({
  sessionCount: _sessionCount,
  showCheckIn: _showCheckIn,
  reflectionSummary: _reflectionSummary,
}: DashboardThresholdCardProps): React.JSX.Element {
  const router = useRouter();
  const { activeContainer } = useContainer();

  const question = useMemo(() => getCurrentQuestion(), []);

  if (activeContainer) {
    return (
      <RitualCard className="motion-rise dashboard-hero-card dashboard-hero-card-inner">
        <AppText variant="display" as="h2" className="dashboard-hero-title">
          {activeContainer.definition.name}
        </AppText>

        <AppText variant="secondary" as="p" className="dashboard-hero-copy">
          — Khepera is here.
        </AppText>

        <MotionButton
          label={
            activeContainer.hasWrittenToday
              ? 'Return to your container'
              : 'Enter today\'s writing'
          }
          onClick={() => router.push(
            activeContainer.hasWrittenToday
              ? `/containers/${activeContainer.definition.id}`
              : `/containers/${activeContainer.definition.id}/today`
          )}
          aria-label={
            activeContainer.hasWrittenToday
              ? `Return to ${activeContainer.definition.name}`
              : `Enter today's writing in ${activeContainer.definition.name}`
          }
        />
      </RitualCard>
    );
  }

  return (
    <RitualCard className="motion-rise dashboard-hero-card dashboard-hero-card-inner">
      <AppText variant="display" as="h2" className="dashboard-hero-title">
        {question.prompt}
      </AppText>

      <AppText variant="secondary" as="p" className="dashboard-hero-copy">
        — {question.kheperaGreeting}
      </AppText>

      <MotionButton
        label="Begin writing"
        onClick={() => router.push('/journal/new')}
        aria-label="Begin writing your journal entry"
      />
    </RitualCard>
  );
}
