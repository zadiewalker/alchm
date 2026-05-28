import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { getFirestoreDbOrNull } from '@/services/firebase/firebaseService';
import { getCachedSubscriptionSnapshot } from '@/services/subscriptions/revenueCatService';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/utils/storage';

export const SANCTUARY_KHEPERA_RESPONSE_LIMIT = 3;
const MAX_OFFLINE_ENTITLEMENT_AGE_MS = 24 * 60 * 60 * 1000;

export type KheperaReflectionAccessState = {
  allowed: boolean;
  hasTransformation: boolean;
  used: number;
  limit: number | null;
};

function readLocalReflectionCount(): number {
  const raw = getStorageItemWithFallback(STORAGE_KEYS.KHEPERA_REFLECTION_COUNT);
  const parsed = Number.parseInt(raw || '0', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function hasTransformationAccess(): boolean {
  const cached = getCachedSubscriptionSnapshot();
  if (!cached?.entitlement.hasTransformation || !cached.lastSyncedAt) return false;
  if (cached.entitlement.expiresAt && cached.entitlement.expiresAt.getTime() <= Date.now()) return false;
  return Date.now() - cached.lastSyncedAt.getTime() <= MAX_OFFLINE_ENTITLEMENT_AGE_MS;
}

async function getRemoteEntryCount(userId: string): Promise<number> {
  const db = getFirestoreDbOrNull();
  if (!db) {
    return 0;
  }

  try {
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const recentEntries = await getDocs(
      query(
        sessionsRef,
        orderBy('createdAt', 'desc'),
        limit(SANCTUARY_KHEPERA_RESPONSE_LIMIT + 1),
      ),
    );

    return recentEntries.size;
  } catch {
    return 0;
  }
}

export async function getKheperaReflectionAccessState(
  userId: string | null,
): Promise<KheperaReflectionAccessState> {
  const hasTransformation = hasTransformationAccess();
  if (hasTransformation) {
    return {
      allowed: true,
      hasTransformation: true,
      used: 0,
      limit: null,
    };
  }

  const localCount = readLocalReflectionCount();
  const remoteCount = userId ? await getRemoteEntryCount(userId) : 0;
  const used = Math.max(localCount, remoteCount);

  return {
    allowed: used < SANCTUARY_KHEPERA_RESPONSE_LIMIT,
    hasTransformation: false,
    used,
    limit: SANCTUARY_KHEPERA_RESPONSE_LIMIT,
  };
}

export function recordDeliveredKheperaReflection(): void {
  const next = readLocalReflectionCount() + 1;
  setStorageItemNormalized(STORAGE_KEYS.KHEPERA_REFLECTION_COUNT, String(next));
}
