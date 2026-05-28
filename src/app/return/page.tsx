'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingState } from '@/components/ui/LoadingState';
import { ReturnThresholdScreen } from '@/components/return/ReturnThresholdScreen';
import { useReturnNavigation, type ReturnPageSearchParams } from '@/hooks/useReturnNavigation';

// ALCHM_IDENTITY_ROLE: primary-screen

function ReturnPageContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const { parse } = useReturnNavigation();
  const parsed = parse({
    entryId: searchParams?.get('entryId') || undefined,
    returnType: searchParams?.get('returnType') || undefined,
    surfacedAt: searchParams?.get('surfacedAt') || undefined,
    daysElapsed: searchParams?.get('daysElapsed') || undefined,
  } satisfies ReturnPageSearchParams);

  return (
    <ReturnThresholdScreen
      entryId={parsed.entryId}
      returnType={parsed.returnType}
      surfacedAt={parsed.surfacedAt}
      daysElapsed={parsed.daysElapsed}
    />
  );
}

export default function ReturnPage(): React.JSX.Element {
  return (
    <Suspense fallback={<LoadingState message="Preparing your return..." variant="page" />}>
      <ReturnPageContent />
    </Suspense>
  );
}
