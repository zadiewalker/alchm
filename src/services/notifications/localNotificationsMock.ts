/**
 * Mock Local Notifications for Build Time
 * 
 * Provides stub implementations to prevent build errors
 * when @capacitor/local-notifications is not available
 */

export const LocalNotificationsMock = {
  schedule: async () => {
    console.warn('[LocalNotifications] Mock implementation - no notifications scheduled');
    return { notifications: [] };
  },
  
  cancel: async () => {
    console.warn('[LocalNotifications] Mock implementation - no notifications cancelled');
    return { notifications: [] };
  },
  
  getPending: async () => {
    console.warn('[LocalNotifications] Mock implementation - returning empty pending list');
    return { notifications: [] };
  },
  
  registerActionTypes: async () => {
    console.warn('[LocalNotifications] Mock implementation - no action types registered');
  },
  
  requestPermissions: async () => {
    console.warn('[LocalNotifications] Mock implementation - returning denied permissions');
    return {
      display: 'denied' as const,
      alert: 'disabled' as const,
      badge: 'disabled' as const,
      sound: 'disabled' as const
    };
  },
  
  checkPermissions: async () => {
    console.warn('[LocalNotifications] Mock implementation - returning denied permissions');
    return {
      display: 'denied' as const,
      alert: 'disabled' as const,
      badge: 'disabled' as const,
      sound: 'disabled' as const
    };
  },
  
  addListener: () => {
    console.warn('[LocalNotifications] Mock implementation - no listeners added');
    return { remove: () => {} };
  },
  
  removeAllListeners: () => {
    console.warn('[LocalNotifications] Mock implementation - no listeners removed');
  }
};

export type MockLocalNotificationsPlugin = typeof LocalNotificationsMock;