import { useState } from 'react';
import { useAuth } from './useAuth';
import { useMirrorData } from './useMirrorData';
import { clearKheperaMemory } from '@/services/mirror/mirrorService';
import type { MirrorData } from '@/types/mirror';

export interface UseMirrorDataReturn extends MirrorData {
  clearMemory: () => Promise<void>;
  refetch: () => void;
}

// COMPATIBILITY ONLY: prefer useMirrorData from this folder for live Mirror routes.
export function useMirrorDataNew(): UseMirrorDataReturn {
  const auth = useAuth();
  const userId = auth.user?.uid;
  const [fetchKey, setFetchKey] = useState(0);
  const data: MirrorData = useMirrorData(userId ?? null, fetchKey);

  const clearMemory = async () => {
    if (!userId) return;
    await clearKheperaMemory(userId);
    setFetchKey(k => k + 1);
  };

  return { ...data, clearMemory, refetch: () => setFetchKey(k => k + 1) };
}
