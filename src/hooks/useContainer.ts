import { useState, useEffect, useCallback } from 'react';
import { useSafeAsync } from './useSafeAsync';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import {
  getActiveContainerState,
  getActiveContainerStateForUser,
  startContainer,
  recordContainerEntry,
  completeContainer,
  buildContainerContext,
} from '@/services/containers/containerService';
import type { ActiveContainerState, ContainerContext } from '@/types/container';

export interface UseContainerReturn {
  activeContainer: ActiveContainerState | null;
  containerContext: ContainerContext | null;
  isLoading: boolean;
  begin: (containerId: string) => Promise<void>;
  recordEntry: (entryId: string) => Promise<void>;
  complete: (carryForward: string, leavingBehind: string) => Promise<void>;
}

export function useContainer(): UseContainerReturn {
  const auth = useAuth();
  const subscription = useSubscription();
  const userId = auth.user?.uid;
  const { isMounted, safeDispatch } = useSafeAsync();
  const [activeContainer, setActiveContainer] = useState<ActiveContainerState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setContainerSafe = safeDispatch(setActiveContainer);
  const setLoadingSafe = safeDispatch(setIsLoading);

  useEffect(() => {
    if (!userId) { setLoadingSafe(false); return; }
    let active = true;

    getActiveContainerStateForUser(userId)
      .then(state => { if (active) setContainerSafe(state); })
      .catch(() => { if (active) setContainerSafe(null); })
      .finally(() => { if (active) setLoadingSafe(false); });

    return () => { active = false; };
  }, [userId, setContainerSafe, setLoadingSafe]);

  const begin = useCallback(async (containerId: string) => {
    if (!userId) return;
    const { userContainerId } = await startContainer(userId, containerId, {
      hasTransformation: subscription.hasTransformation,
    });
    const state = await getActiveContainerState(userId, userContainerId);
    if (isMounted()) setContainerSafe(state);
  }, [userId, subscription.hasTransformation, isMounted, setContainerSafe]);

  const recordEntry = useCallback(async (entryId: string) => {
    if (!userId || !activeContainer) return;
    await recordContainerEntry(userId, activeContainer.userContainerId, entryId);
  }, [userId, activeContainer]);

  const complete = useCallback(async (carryForward: string, leavingBehind: string) => {
    if (!userId || !activeContainer) return;
    await completeContainer(userId, activeContainer.userContainerId, carryForward, leavingBehind);
    if (isMounted()) setContainerSafe(null);
  }, [userId, activeContainer, isMounted, setContainerSafe]);

  return {
    activeContainer,
    containerContext: activeContainer ? buildContainerContext(activeContainer) : null,
    isLoading,
    begin,
    recordEntry,
    complete,
  };
}
