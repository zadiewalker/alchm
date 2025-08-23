// PWA utilities for ALCHM
'use client';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAManager {
  private installPrompt: BeforeInstallPromptEvent | null = null;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private async init() {
    // Register service worker
    await this.registerServiceWorker();
    
    // Handle install prompt
    this.handleInstallPrompt();
    
    // Handle app installed
    this.handleAppInstalled();
    
    // Handle service worker messages
    this.handleServiceWorkerMessages();
  }

  // Register service worker
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        
        console.log('[PWA] Service Worker registered:', this.registration.scope);
        
        // Handle updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration?.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                this.notifyUpdate();
              }
            });
          }
        });
        
        return this.registration;
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }

  // Handle install prompt
  private handleInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e as BeforeInstallPromptEvent;
      
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('pwa:installable'));
    });
  }

  // Handle app installed
  private handleAppInstalled() {
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      this.installPrompt = null;
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('pwa:installed'));
    });
  }

  // Handle service worker messages
  private handleServiceWorkerMessages() {
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data.type === 'SW_ACTIVATED') {
        console.log('[PWA] Service Worker activated:', event.data.version);
      } else if (event.data.type === 'NAVIGATE') {
        // Handle navigation from notifications
        window.location.href = event.data.url;
      }
    });
  }

  // Show install prompt
  async showInstallPrompt(): Promise<boolean> {
    if (!this.installPrompt) {
      console.warn('[PWA] Install prompt not available');
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const { outcome } = await this.installPrompt.userChoice;
      
      console.log('[PWA] Install prompt outcome:', outcome);
      this.installPrompt = null;
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      return false;
    }
  }

  // Check if app is installable
  isInstallable(): boolean {
    return this.installPrompt !== null;
  }

  // Check if app is already installed
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.matchMedia('(display-mode: fullscreen)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Notify about app update
  private notifyUpdate() {
    // Dispatch custom event for components to handle
    window.dispatchEvent(new CustomEvent('pwa:updateAvailable'));
  }

  // Apply app update
  async applyUpdate(): Promise<void> {
    if (this.registration?.waiting) {
      // Tell the waiting service worker to become active
      this.registration.waiting.postMessage('ALCHM_SW_UPDATE');
      
      // Wait for the new service worker to take control
      await new Promise<void>((resolve) => {
        navigator.serviceWorker?.addEventListener('controllerchange', () => {
          resolve();
        }, { once: true });
      });
      
      // Reload the page to get the latest version
      window.location.reload();
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('[PWA] Notification permission:', permission);
      return permission;
    }
    return 'denied';
  }

  // Subscribe to push notifications
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error('[PWA] Service worker not registered');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
      
      console.log('[PWA] Push subscription created');
      return subscription;
    } catch (error) {
      console.error('[PWA] Push subscription failed:', error);
      return null;
    }
  }

  // Store offline journal entry
  async storeOfflineEntry(entry: any): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    try {
      const cache = await caches.open('alchm-offline');
      const request = new Request(`/api/journals/offline/${entry.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      
      const response = new Response(JSON.stringify(entry), {
        headers: { 'Content-Type': 'application/json' },
      });
      
      await cache.put(request, response);
      
      // Request background sync (if supported)
      if (this.registration && 'sync' in this.registration) {
        await (this.registration as any).sync.register('sync-journal-entries');
      }
      
      console.log('[PWA] Entry stored offline:', entry.id);
    } catch (error) {
      console.error('[PWA] Failed to store offline entry:', error);
    }
  }

  // Check if online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Get network status
  getNetworkStatus(): 'online' | 'offline' {
    return navigator.onLine ? 'online' : 'offline';
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();

// Hook for React components
export function usePWA() {
  const [isInstallable, setIsInstallable] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    setIsInstalled(pwaManager.isInstalled());
    setIsOnline(pwaManager.isOnline());

    const handleInstallable = () => setIsInstallable(true);
    const handleInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };
    const handleUpdateAvailable = () => setUpdateAvailable(true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('pwa:installable', handleInstallable);
    window.addEventListener('pwa:installed', handleInstalled);
    window.addEventListener('pwa:updateAvailable', handleUpdateAvailable);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('pwa:installable', handleInstallable);
      window.removeEventListener('pwa:installed', handleInstalled);
      window.removeEventListener('pwa:updateAvailable', handleUpdateAvailable);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isInstallable,
    isInstalled,
    updateAvailable,
    isOnline,
    install: () => pwaManager.showInstallPrompt(),
    update: () => pwaManager.applyUpdate(),
    requestNotifications: () => pwaManager.requestNotificationPermission(),
    subscribeToPush: () => pwaManager.subscribeToPush(),
    storeOfflineEntry: (entry: any) => pwaManager.storeOfflineEntry(entry),
  };
}

// React import fix
import React from 'react';