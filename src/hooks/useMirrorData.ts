import { useEffect, useState } from 'react';
import { useSafeAsync } from '@/hooks/useSafeAsync';
import { loadMirrorData } from '@/services/mirror/mirrorService';
import type { MirrorData } from '@/types/mirror';

const MIRROR_LOAD_FALLBACK_MS = 10000;

export function useMirrorData(userId: string | null, refreshKey = 0): MirrorData {
  const { safeDispatch } = useSafeAsync();
  const [data, setData] = useState<MirrorData>({
    arc: [],
    dominantTone: null,
    toneShift: null,
    recurringThemes: [],
    allThemes: [],
    openSeeds: [],
    kheperaObservation: null,
    observationGeneratedAt: null,
    delayedReturn: { state: 'empty' },
    sessionCount: 0,
    hasEnoughData: false,
    isLoading: true,
    error: null,
  });

  const setDataSafe = safeDispatch(setData);

  useEffect(() => {
    if (!userId) {
      setDataSafe(prev => ({ ...prev, isLoading: false }));
      return;
    }

    let active = true;
    let settled = false;
    const fallbackTimer = window.setTimeout(() => {
      if (!active || settled) return;
      settled = true;
      active = false;
      setDataSafe(prev => ({
        ...prev,
        isLoading: false,
        error: new Error('Mirror load timed out'),
      }));
    }, MIRROR_LOAD_FALLBACK_MS);

    const load = async () => {
      try {
        const result = await loadMirrorData(userId);
        if (!active) return;
        settled = true;
        window.clearTimeout(fallbackTimer);
        setDataSafe(result);
      } catch (err) {
        if (!active) return;
        settled = true;
        window.clearTimeout(fallbackTimer);
        setDataSafe(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Mirror load failed'),
        }));
      }
    };

    load();
    return () => {
      active = false;
      window.clearTimeout(fallbackTimer);
    };
  }, [userId, refreshKey, setDataSafe]);

  return data;
}
