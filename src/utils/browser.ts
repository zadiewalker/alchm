/**
 * Safe browser API utilities for Capacitor + SSG compatibility
 */

export const isBrowser = typeof window !== 'undefined';

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

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    return window.sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    window.sessionStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    window.sessionStorage.removeItem(key);
  },
};
