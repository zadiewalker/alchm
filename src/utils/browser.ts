/**
 * Safe browser API utilities for Capacitor + SSG compatibility
 * ENHANCED: Automatic encryption for mental health data
 */

export const isBrowser = typeof window !== 'undefined';

// Health data keys that require encryption
const HEALTH_DATA_KEYS = [
  'userEmail', 'journalEntries', 'safetyPlan', 'moodData', 
  'therapyNotes', 'medicationReminders', 'crisisEvents', 'user_'
];

function isHealthData(key: string): boolean {
  return HEALTH_DATA_KEYS.some(healthKey => key.includes(healthKey));
}

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      if (isHealthData(key)) {
        // For health data, check encrypted storage first
        const encryptedData = localStorage.getItem(`encrypted_${key}`);
        if (encryptedData) {
          console.warn(`Health data "${key}" is encrypted and requires async decryption. Use secureStorage.getItem() for proper access.`);
          return null; // Return null to force proper async usage
        }
        
        // Check for legacy unencrypted data
        const legacyData = localStorage.getItem(key);
        if (legacyData) {
          console.warn(`Unencrypted health data found for "${key}". This will be encrypted on next write.`);
          return legacyData;
        }
        
        return null;
      } else {
        // Non-health data can be accessed normally
        return localStorage.getItem(key);
      }
    } catch {
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      if (isHealthData(key)) {
        console.warn(`Health data "${key}" should be encrypted. Use secureStorage.setItem() for HIPAA compliance.`);
        
        // Store temporarily and trigger async encryption
        localStorage.setItem(`pending_encrypt_${key}`, value);
        
        // Import and use secure storage asynchronously
        import('@/lib/secureStorage').then(({ compatibleSecureStorage }) => {
          compatibleSecureStorage.setItem(key, value);
          localStorage.removeItem(`pending_encrypt_${key}`);
        }).catch(console.error);
      } else {
        // Non-health data can be stored normally
        localStorage.setItem(key, value);
      }
    } catch {
      // Storage full or blocked
    }
  },
  
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      // Remove from all possible locations
      localStorage.removeItem(key);
      localStorage.removeItem(`encrypted_${key}`);
      localStorage.removeItem(`meta_${key}`);
      localStorage.removeItem(`pending_encrypt_${key}`);
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
  reload: () => {
    if (!isBrowser) return;
    window.location.reload();
  },
};

export const safeNavigator = {
  userAgent: isBrowser ? navigator.userAgent : '',
  platform: isBrowser ? navigator.platform : '',
  language: isBrowser ? navigator.language : 'en',
  cookieEnabled: isBrowser ? navigator.cookieEnabled : false,
  onLine: isBrowser ? navigator.onLine : true,
};