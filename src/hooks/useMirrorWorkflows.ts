import { useEffect, useState } from 'react';
import { getKheperaContext } from '@/services/khepera/memory';
import { processReadyDelayedReflections } from '@/services/khepera/delayedReflectionQueue';
import { clearKheperaMemory, generateMirrorObservation } from '@/services/mirror/mirrorService';
import { recordOperationalBreadcrumb } from '@/services/monitoring/telemetry';
import type { MirrorData } from '@/types/mirror';

export function useMirrorTelemetry(input: {
  userId: string | null;
  isConfigured: boolean;
  isLoading: boolean;
  isReady: boolean;
  accessSource: string;
  hasAccess: boolean;
}): void {
  useEffect(() => {
    recordOperationalBreadcrumb('mirror.mount', {
      source: 'mirror',
      configured: input.isConfigured,
      result: input.userId ? 'authenticated' : 'anonymous',
    });
  }, [input.isConfigured, input.userId]);

  useEffect(() => {
    if (input.isLoading && !input.isReady) {
      return;
    }

    recordOperationalBreadcrumb('mirror.access.resolved', {
      source: input.accessSource,
      result: input.hasAccess ? 'granted' : 'gated',
      configured: input.isConfigured,
    });
  }, [input.accessSource, input.hasAccess, input.isConfigured, input.isLoading, input.isReady]);
}

export function useProcessReadyDelayedReflections(input: {
  enabled: boolean;
  userId: string | null;
  delayedState: MirrorData['delayedReturn']['state'];
  onCompleted: () => void;
}): void {
  useEffect(() => {
    if (!input.enabled || !input.userId || input.delayedState !== 'waiting') {
      return;
    }

    let active = true;
    const userId = input.userId;
    getKheperaContext(userId)
      .then((context) => processReadyDelayedReflections(userId, context))
      .then((completed) => {
        if (active && completed > 0) {
          input.onCompleted();
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [input.delayedState, input.enabled, input.onCompleted, input.userId]);
}

export function useMirrorObservation(input: {
  enabled: boolean;
  userId: string | null;
  mirrorData: MirrorData;
}): string | null {
  const [observation, setObservation] = useState<string | null>(null);

  useEffect(() => {
    if (!input.enabled || !input.userId || !input.mirrorData.hasEnoughData) {
      setObservation(null);
      return;
    }

    let active = true;
    generateMirrorObservation(
      input.userId,
      input.mirrorData.kheperaObservation,
      input.mirrorData.observationGeneratedAt,
      {
        recurringThemes: input.mirrorData.recurringThemes.map((theme) => theme.label),
        dominantTone: input.mirrorData.dominantTone ?? 'processing',
        toneShift: input.mirrorData.toneShift?.message ?? null,
        sessionCount: input.mirrorData.sessionCount,
        openSeeds: input.mirrorData.openSeeds,
      },
    )
      .then((value) => {
        if (active) setObservation(value);
      })
      .catch(() => {
        if (active) setObservation(null);
      });

    return () => {
      active = false;
    };
  }, [
    input.enabled,
    input.userId,
    input.mirrorData.dominantTone,
    input.mirrorData.hasEnoughData,
    input.mirrorData.kheperaObservation,
    input.mirrorData.observationGeneratedAt,
    input.mirrorData.openSeeds,
    input.mirrorData.recurringThemes,
    input.mirrorData.sessionCount,
    input.mirrorData.toneShift,
  ]);

  return observation;
}

export function useClearMirrorMemory(userId: string): {
  clear: () => Promise<void>;
} {
  return {
    clear: async () => {
      await clearKheperaMemory(userId);
    },
  };
}
