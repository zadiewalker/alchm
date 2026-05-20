import { Suspense } from 'react';
import { CONTAINER_DEFINITIONS } from '@/config/containerDefinitions';
import { CompletionCeremonyClient } from './CompletionCeremonyClient';

export function generateStaticParams(): Array<{ id: string }> {
  return CONTAINER_DEFINITIONS.map(container => ({ id: container.id }));
}

export default function CeremonyPage() {
  return (
    <Suspense fallback={null}>
      <CompletionCeremonyClient />
    </Suspense>
  );
}
