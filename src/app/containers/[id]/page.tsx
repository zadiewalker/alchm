import { ContainerLandingClient } from './ContainerLandingClient';
import { CONTAINER_DEFINITIONS } from '@/config/containerDefinitions';

export function generateStaticParams(): Array<{ id: string }> {
  return CONTAINER_DEFINITIONS.map((container) => ({ id: container.id }));
}

export default function ContainerPage(): React.JSX.Element {
  return <ContainerLandingClient />;
}
