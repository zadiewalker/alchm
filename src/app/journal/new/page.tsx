'use client';

import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { JournalFlow } from '@/components/journal/JournalFlow';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { getPathwayById } from '@/lib/pathways';

export default function NewEntryPage() {
  return (
    <Suspense
      fallback={
        <SanctuaryLayout header={<SanctuaryHeader title="New Entry" showBack />}>
          <LoadingState message="Preparing your writing space..." variant="page" />
        </SanctuaryLayout>
      }
    >
      <NewEntryContent />
    </Suspense>
  );
}

function NewEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathwayId = searchParams.get('pathway') || '';
  const pathwayStepIndex = Number.parseInt(searchParams.get('step') || '0', 10) || 0;

  const pathway = useMemo(() => (pathwayId ? getPathwayById(pathwayId) : null), [pathwayId]);
  const pathwayStep = pathway?.steps?.[pathwayStepIndex];

  const quickStartContext = pathwayStep
    ? {
      templateId: `${pathway?.id ?? pathwayId}:${pathwayStepIndex}`,
      title: pathwayStep.title,
      prompt: pathwayStep.prompt,
    }
    : undefined;

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="New Entry" showBack />} noPadding>
      <JournalFlow
        quickStartContext={quickStartContext}
        thresholdQuestion={pathwayStep?.prompt}
        completionContext={{
          destination: 'journal',
          title: 'The entry is here.',
          detail: 'It has been saved without asking anything more of you.',
          ctaLabel: 'Return to your journal',
        }}
        onComplete={() => router.push('/journal/')}
      />
    </SanctuaryLayout>
  );
}
