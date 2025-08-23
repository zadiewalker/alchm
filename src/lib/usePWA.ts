// PWA Hooks - React hooks for PWA functionality
// Manages service worker registration, offline status, and install prompts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ALCHM_PWA_CONFIG } from './pwa-config';

interface PWAState {
  isInstalled: boolean;
  canInstall: boolean;
  isOffline: boolean;
  hasUpdate: boolean;
  isLoading: boolean;
  swRegistration: ServiceWorkerRegistration | null;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    canInstall: false,
    isOffline: !navigator.onLine,
    hasUpdate: false,
    isLoading: true,
    swRegistration: null
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    setState(prev => ({
      ...prev,
      isInstalled: isStandalone
    }));

    // Register service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState(prev => ({ ...prev, canInstall: true }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setState(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      setDeferredPrompt(null);
    };

    // Listen for online/offline
    const handleOnline = () => setState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setState(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      setState(prev => ({
        ...prev,
        swRegistration: registration,
        isLoading: false
      }));

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, hasUpdate: true }));
            }
          });
        }
      });

      // Listen for messages from SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, version } = event.data;
        if (type === 'SW_ACTIVATED') {
          console.log('Service Worker activated:', version);
        }
      });

      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      
      if (choice.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setState(prev => ({ ...prev, canInstall: false }));
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during PWA install:', error);
      return false;
    }
  }, [deferredPrompt]);

  const updatePWA = useCallback(() => {
    if (state.swRegistration?.waiting) {
      state.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [state.swRegistration]);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const subscribeToPushNotifications = useCallback(async (userTier: string) => {
    if (!state.swRegistration || !ALCHM_PWA_CONFIG.pushNotifications.enabled) {
      return null;
    }

    try {
      const subscription = await state.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(ALCHM_PWA_CONFIG.pushNotifications.publicKey)
      });

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          userTier,
          notificationTypes: ALCHM_PWA_CONFIG.pushNotifications.notificationTypes
        })
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }, [state.swRegistration]);

  const checkStorageQuota = useCallback(async () => {
    if (!navigator.storage || !navigator.storage.estimate) {
      return null;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0)
      };
    } catch (error) {
      console.error('Failed to get storage estimate:', error);
      return null;
    }
  }, []);

  const clearAppData = useCallback(async () => {
    try {
      // Clear caches
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));

      // Clear IndexedDB
      if ('indexedDB' in window) {
        // This would clear our offline data - implement with caution
        console.log('Cache cleared successfully');
      }

      // Unregister service worker
      if (state.swRegistration) {
        await state.swRegistration.unregister();
      }

      return true;
    } catch (error) {
      console.error('Failed to clear app data:', error);
      return false;
    }
  }, [state.swRegistration]);

  return {
    // State
    ...state,
    
    // Actions
    installPWA,
    updatePWA,
    requestNotificationPermission,
    subscribeToPushNotifications,
    checkStorageQuota,
    clearAppData,

    // Utilities
    canInstall: state.canInstall && !!deferredPrompt,
    supportsNotifications: 'Notification' in window,
    supportsPush: 'PushManager' in window,
    supportsBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype
  };
}

// Utility function for push notifications
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Hook for network status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [effectiveType, setEffectiveType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get connection info if available
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;

    if (connection) {
      setConnectionType(connection.type || 'unknown');
      setEffectiveType(connection.effectiveType || 'unknown');

      const handleConnectionChange = () => {
        setConnectionType(connection.type || 'unknown');
        setEffectiveType(connection.effectiveType || 'unknown');
      };

      connection.addEventListener('change', handleConnectionChange);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    connectionType,
    effectiveType,
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g'
  };
}

// Hook for app shortcuts
export function useAppShortcuts() {
  const [shortcuts, setShortcuts] = useState<any[]>([]);

  useEffect(() => {
    // Get shortcuts from manifest
    fetch('/manifest.json')
      .then(response => response.json())
      .then(manifest => {
        if (manifest.shortcuts) {
          setShortcuts(manifest.shortcuts);
        }
      })
      .catch(error => {
        console.error('Failed to load manifest shortcuts:', error);
      });
  }, []);

  const navigateToShortcut = useCallback((shortcutUrl: string) => {
    window.location.href = shortcutUrl;
  }, []);

  return {
    shortcuts,
    navigateToShortcut
  };
}