'use client';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getStorageItemWithFallback(key: string): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(key);
}

export function setStorageItemNormalized(key: string, value: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, value);
}

export function removeStorageItemNormalized(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}

export function listStorageKeys(): string[] {
  if (!isBrowser()) return [];
  return Array.from({ length: window.localStorage.length }, (_, index) => window.localStorage.key(index))
    .filter((key): key is string => typeof key === 'string');
}
