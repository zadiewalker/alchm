'use client';

import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/ui/AppLayout';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { ContainerCatalogCard } from '@/components/containers/ContainerCatalogCard';
import { CONTAINER_DEFINITIONS } from '@/config/containerDefinitions';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useSubscription } from '@/hooks/useSubscription';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import type { UserContainer } from '@/types/container';

// ALCHM_IDENTITY_ROLE: supporting-screen

export default function ContainersPage() {
  const router = useRouter();
  const { navigate } = useInternalNavigation();
  const { user } = useAuth();
  const subscription = useSubscription();
  const { getUserContainers } = useData();
  const [userContainers, setUserContainers] = useState<UserContainer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user containers
  useEffect(() => {
    const loadContainers = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const containers = await getUserContainers();
        setUserContainers(containers);
      } catch (error) {
        console.error('Error loading user containers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContainers();
  }, [user, getUserContainers]);

  // Process container states
  type ActiveContainer = {
    containerName: string;
    containerId: string;
    userContainerId: string;
    hasWrittenToday: boolean;
  };

  const { active, completed, completedSet } = useMemo(() => {
    const activeContainer = userContainers.find(uc => uc.status === 'active');
    const completedContainers = userContainers.filter(uc => uc.status === 'completed');
    const completedIds = new Set(completedContainers.map(uc => uc.containerId));

    let activeData: ActiveContainer | null = null;
    if (activeContainer) {
      const containerDef = CONTAINER_DEFINITIONS.find(cd => cd.id === activeContainer.containerId);
      if (containerDef) {
        activeData = {
          containerName: activeContainer.containerName,
          containerId: activeContainer.containerId,
          userContainerId: activeContainer.id,
          hasWrittenToday: activeContainer.lastEntryAt
            ? new Date(activeContainer.lastEntryAt.toDate()).toDateString() === new Date().toDateString()
            : false,
        };
      }
    }

    return {
      active: activeData,
      completed: completedContainers,
      completedSet: completedIds
    };
  }, [userContainers]);

  if (loading) {
    return (
      <AppLayout className="page-enter" header={<AppHeader title="Containers" />}>
        <div className="containers-loading">
          <AppText variant="caption">
            Gathering your containers.
          </AppText>
        </div>
      </AppLayout>
    );
  }

  if (!CONTAINER_DEFINITIONS.length) {
    return (
      <AppLayout className="page-enter" header={<AppHeader title="Containers" />}>
        <EmptyState screen="containers" />
      </AppLayout>
    );
  }

  return (
    <AppLayout className="page-enter" header={<AppHeader title="Containers" />}>
      <div className="containers-stack">
        <SectionIntro
          title="Enter a space of attention."
          body="A container changes what becomes visible. It waits without asking you to keep pace."
        />

        {active ? (() => {
          const activeContainer = active as ActiveContainer;
          return (
            <AppCard elevated className="containers-active-card">
              <AppText variant="caption" className="containers-active-meta">
                current chamber
              </AppText>
              <AppText variant="title" className="containers-active-title">
                {activeContainer.containerName || 'Current container'}
              </AppText>
              <button
                className="btn-primary"
                type="button"
                onClick={() => router.push(
                  activeContainer.hasWrittenToday
                    ? `/containers/${activeContainer.containerId}`
                    : `/containers/${activeContainer.containerId}/today`
                )}
              >
                {activeContainer.hasWrittenToday ? 'Return to the chamber' : 'Enter the writing'}
              </button>
            </AppCard>
          );
        })() : null}

        <div className="containers-grid">
          {CONTAINER_DEFINITIONS.filter((container) => container.id !== (active as ActiveContainer | null)?.containerId).map((container) => {
            const isCompleted = completedSet.has(container.id);
            const isActive = (active as ActiveContainer | null)?.containerId === container.id;
            const canAccess = container.tier !== 'transformation' || subscription.hasTransformation;

            const handleBeginContainer = () => {
              if (!canAccess) {
                return;
              }
              router.push(`/containers/${container.id}/opening`);
            };

            return (
              <ContainerCatalogCard
                key={container.id}
                container={container}
                isActive={isActive}
                isCompleted={isCompleted}
                canAccess={canAccess}
                onView={() => {
                  if (!canAccess) {
                    return;
                  }
                  if (isCompleted) {
                    router.push(`/containers/${container.id}/ceremony`);
                  } else {
                    router.push(`/containers/${container.id}`);
                  }
                }}
                onStart={handleBeginContainer}
                onContinue={() => {
                  router.push(`/containers/${container.id}/today`);
                }}
              />
            );
          })}
        </div>

        {completed.length ? (
          <AppCard>
            <AppText variant="caption" className="containers-completed-label">
              Spaces resting here
            </AppText>
            <div className="containers-completed-list">
              {completed.slice(0, 5).map((item) => {
                const container = CONTAINER_DEFINITIONS.find(c => c.id === item.containerId);
                return (
                  <AppText key={`${item.containerId}-${item.completedAt}`} variant="body">
                    {container?.name || item.containerId} · {new Date((item.completedAt || item.startedAt).toDate()).toLocaleDateString()}
                  </AppText>
                );
              })}
            </div>
          </AppCard>
        ) : null}

        <button
          type="button"
          onClick={() => navigate('/journal', { source: 'containers_journal_link', surface: 'containers' })}
          className="containers-journal-link"
        >
          <AppText variant="caption" as="span">
            Container entries appear in your journal with container labels.
          </AppText>
        </button>
      </div>
    </AppLayout>
  );
}
