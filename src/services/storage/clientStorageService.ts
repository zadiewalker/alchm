import {
  getStorageItemWithFallback,
  removeStorageItemNormalized,
  setStorageItemNormalized,
} from '@/utils/storage';

export const clientStorageService = {
  get: (key: string): string | null => getStorageItemWithFallback(key),
  set: (key: string, value: string): void => setStorageItemNormalized(key, value),
  remove: (key: string): void => removeStorageItemNormalized(key),
};
