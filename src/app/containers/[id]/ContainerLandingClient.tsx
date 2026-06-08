'use client';

import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/ui/AppLayout';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { OpenTransformationButton } from '@/components/subscriptions/OpenTransformationButton';
import { getContainerDefinition } from '@/config/containerDefinitions';
import { isFreeContainer } from '@/config/containerAccess';
import { useSubscription } from '@/hooks/useSubscription';

export function ContainerLandingClient(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const subscription = useSubscription();
  const containerId = typeof params.id === 'string' ? params.id : '';
  const definition = getContainerDefinition(containerId);

  if (!definition) {
    return (
      <AppLayout header={<AppHeader title="Containers" showBack backNavigation={{ fallback: '/containers' }} />}>
        <AppCard>
          <AppText variant="title" as="h1">
            This container is not available.
          </AppText>
          <button type="button" className="btn-primary" onClick={() => router.replace('/containers')}>
            Return to Containers
          </button>
        </AppCard>
      </AppLayout>
    );
  }

  const canAccess = isFreeContainer(definition.id) || subscription.hasTransformation;

  return (
    <AppLayout header={<AppHeader title={definition.name} showBack backNavigation={{ fallback: '/containers' }} />}>
      <div className="containers-stack">
        <AppCard elevated>
          <AppText variant="caption" as="p">
            {canAccess ? 'Available' : 'Transformation only'}
          </AppText>
          <AppText variant="title" as="h1">
            {definition.name}
          </AppText>
          <AppText variant="secondary" as="p">
            {definition.tagline}
          </AppText>
          <div style={{ marginTop: 'var(--space-5)' }}>
            {canAccess ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => router.push(`/containers/${definition.id}/opening`)}
              >
                Enter container
              </button>
            ) : (
              <OpenTransformationButton
                surface="containers"
                source="container_detail_transformation_gate"
                route={`/containers/${definition.id}`}
                label="Open Transformation"
              />
            )}
          </div>
        </AppCard>
      </div>
    </AppLayout>
  );
}
