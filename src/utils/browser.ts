/**
 * Safe browser API utilities for Capacitor + SSG compatibility
 */
import { getStorageItemWithFallback, removeStorageItemNormalized, setStorageItemNormalized } from '@/lib/storageKeys';

export const isBrowser = typeof window !== 'undefined';

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      return getStorageItemWithFallback(key);
    } catch {
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      setStorageItemNormalized(key, value);
    } catch {
      // Storage full or blocked
    }
  },
  
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      removeStorageItemNormalized(key);
    } catch {
      // Ignore
    }
  },
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Storage full or blocked
    }
  },
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};

export const safeWindow = {
  location: isBrowser ? window.location : { pathname: '/', search: '', href: '' },
  open: (url: string, target = '_self') => {
    if (!isBrowser) return null;
    return window.open(url, target);
  },
};

export const safeNavigator = {
  userAgent: isBrowser ? navigator.userAgent : '',
  platform: isBrowser ? navigator.platform : '',
  language: isBrowser ? navigator.language : 'en',
  cookieEnabled: isBrowser ? navigator.cookieEnabled : false,
  onLine: isBrowser ? navigator.onLine : true,
};
