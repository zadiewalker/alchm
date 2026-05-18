'use client';

import { useCallback } from 'react';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import { useSubscription } from '@/hooks/useSubscription';
import { recordOperationalEvent } from '@/services/monitoring/telemetry';

export type TransformationSurface =
  | 'dashboard'
  | 'settings'
  | 'mirror'
  | 'containers'
  | 'journal_limit'
  | 'upgrade';

type UseTransformationAccessParams = {
  surface: TransformationSurface;
  source: string;
  route: string;
};

type UseTransformationAccessResult = {
  hasAccess: boolean;
  hasOffering: boolean;
  isOpening: boolean;
  label: string;
  statusMessage: string | null;
  openTransformation: () => Promise<void>;
};

export function useTransformationAccess({
  surface,
  source,
  route,
}: UseTransformationAccessParams): UseTransformationAccessResult {
  const subscription = useSubscription();
  const { navigate } = useInternalNavigation();
  const hasAccess = subscription.hasTransformation;
  const hasOffering = subscription.offerings.length > 0;

  const openTransformation = useCallback(async (): Promise<void> => {
    recordOperationalEvent('transformation_cta_tap', {
      surface,
      route,
      hasAccess,
      hasOffering,
    });

    navigate('/upgrade', { source, surface });
  }, [hasAccess, hasOffering, navigate, route, source, surface]);

  return {
    hasAccess,
    hasOffering,
    isOpening: false,
    label: hasAccess ? 'Open Continuity' : 'Open Continuity',
    openTransformation,
    statusMessage: null,
  };
}
