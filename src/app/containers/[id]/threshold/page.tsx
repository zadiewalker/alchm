import { Suspense } from 'react';
import { CONTAINER_DEFINITIONS } from '@/config/containerDefinitions';
import { DailyThresholdClient } from './DailyThresholdClient';

export function generateStaticParams(): Array<{ id: string }> {
  return CONTAINER_DEFINITIONS.map(container => ({ id: container.id }));
}

export default function ThresholdPage() {
  return (
    <Suspense fallback={null}>
      <DailyThresholdClient />
    </Suspense>
  );
}
