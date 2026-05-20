import { CONTAINER_DEFINITIONS } from '@/config/containerDefinitions';
import { OpeningRitualClient } from './OpeningRitualClient';

export function generateStaticParams(): Array<{ id: string }> {
  return CONTAINER_DEFINITIONS.map(container => ({ id: container.id }));
}

export default function RitualPage() {
  return <OpeningRitualClient />;
}
