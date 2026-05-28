import { useCallback, useMemo, useState } from 'react';
import {
  listSharedReflections,
  resonateWithReflection,
  type SharedReflection,
} from '@/services/community/communityService';

export interface CommunityReflectionsController {
  reflections: SharedReflection[];
  status: string;
  resonate: (reflectionId: string) => void;
}

export function useCommunityReflections(): CommunityReflectionsController {
  const [refreshKey, setRefreshKey] = useState(0);
  const [status, setStatus] = useState('');
  const reflections = useMemo(() => listSharedReflections(), [refreshKey]);

  const resonate = useCallback((reflectionId: string): void => {
    const accepted = resonateWithReflection(reflectionId);
    setStatus(accepted ? 'Resonance sent.' : 'You already resonated with this reflection.');
    setRefreshKey((value) => value + 1);
  }, []);

  return { reflections, status, resonate };
}
