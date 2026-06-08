import OpeningRitualClient from './OpeningRitualClient';
import { CONTAINER_DEFINITIONS } from '@/config/containerDefinitions';

export function generateStaticParams(): Array<{ id: string }> {
  return CONTAINER_DEFINITIONS.map((container) => ({ id: container.id }));
}

export default function ContainerOpeningPage(): React.JSX.Element {
  return <OpeningRitualClient />;
}
