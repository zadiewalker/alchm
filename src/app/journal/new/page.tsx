'use client';

import { Suspense, useMemo, useState } from 'react';
import type React from 'react';
import { useSearchParams } from 'next/navigation';
import { JournalFlow } from '@/components/journal/JournalFlow';
import { LoadingState } from '@/components/ui/LoadingState';
import { useReturnNavigation } from '@/hooks/useReturnNavigation';
import { useReturnThresholdData } from '@/hooks/useReturnThresholdData';
import type { JournalFlowProps } from '@/types/journal';

type JournalReturnContext = NonNullable<JournalFlowProps['returnContext']>;

function NewEntryContent(): React.JSX.Element | null {
  const searchParams = useSearchParams();
  const { parse } = useReturnNavigation();
  const [fallbackSurfacedAt] = useState(() => Date.now());
  const parsed = parse({
    entryId: searchParams?.get('returnTo') || undefined,
    returnType: searchParams?.get('returnType') || undefined,
    surfacedAt: searchParams?.get('surfacedAt') || undefined,
    daysElapsed: searchParams?.get('daysElapsed') || undefined,
    resurfacingTone: searchParams?.get('resurfacingTone') || undefined,
  });
  const returnEntry = useReturnThresholdData(parsed.entryId);

  const returnContext = useMemo<JournalReturnContext | null>(() => {
    if (!parsed.entryId) {
      return null;
    }

    const daysElapsed = parsed.daysElapsed ?? returnEntry.data?.daysAgo ?? 0;

    return {
      entryId: parsed.entryId,
      detail: 'Not a reminder. A return. This can stand on its own.',
      excerpt: returnEntry.data?.excerpt ?? null,
      isUnavailable: !returnEntry.isLoading && !returnEntry.data,
      resurfacingTone: parsed.resurfacingTone,
      metadata: {
        entryId: parsed.entryId,
        surfacedAt: parsed.surfacedAt ?? fallbackSurfacedAt,
        returnType: parsed.returnType,
        daysElapsed,
      },
    };
  }, [
    fallbackSurfacedAt,
    parsed.daysElapsed,
    parsed.entryId,
    parsed.resurfacingTone,
    parsed.returnType,
    parsed.surfacedAt,
    returnEntry.data,
    returnEntry.isLoading,
  ]);

  return <JournalFlow returnContext={returnContext} />;
}

export default function NewEntryPage(): React.JSX.Element | null {
  return (
    <Suspense fallback={<LoadingState message="Preparing your entry..." variant="page" />}>
      <NewEntryContent />
    </Suspense>
  );
}
