/**
 * Dynamic Notification Plugin Loader
 * 
 * Handles loading of Capacitor Local Notifications with graceful fallbacks
 * Avoids build-time import issues by using conditional loading
 */

import { LocalNotificationsMock } from './localNotificationsMock';

/**
 * Safely load the Local Notifications plugin with fallback
 */
export async function loadLocalNotificationsPlugin(): Promise<typeof LocalNotificationsMock | unknown> {
  // Check if we're in a native environment
  if (typeof window === 'undefined') {
    return LocalNotificationsMock;
  }

  try {
    // Check if Capacitor is available
    const capacitorWindow = window as Window & {
      Capacitor?: {
        isNativePlatform?: () => boolean;
        Plugins?: {
          LocalNotifications?: unknown;
        };
      };
    };
    const capacitor = capacitorWindow.Capacitor;
    if (!capacitor?.isNativePlatform?.()) {
      console.log('[NotificationLoader] Web environment detected, using mock');
      return LocalNotificationsMock;
    }

    // Try to access the plugin from Capacitor's plugin registry
    const plugins = capacitor.Plugins;
    if (plugins?.LocalNotifications) {
      console.log('[NotificationLoader] Using native LocalNotifications plugin');
      return plugins.LocalNotifications;
    }

    // Plugin not found in registry, try dynamic import as last resort
    console.log('[NotificationLoader] Plugin not in registry, attempting dynamic import');
    
    // Use setTimeout to delay import and avoid webpack bundling issues
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          // This won't be bundled if it's in a setTimeout
          const module = await eval('import("@capacitor/local-notifications")');
          resolve(module.LocalNotifications);
        } catch {
          console.warn('[NotificationLoader] Dynamic import failed, using mock');
          resolve(LocalNotificationsMock);
        }
      }, 0);
    });

  } catch (error) {
    console.warn('[NotificationLoader] Failed to load plugin, using mock:', error);
    return LocalNotificationsMock;
  }
}
