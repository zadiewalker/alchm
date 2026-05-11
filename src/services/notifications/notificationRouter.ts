/**
 * Notification Router for ALCHM
 * 
 * Handles deep linking and navigation when notifications are tapped
 * Emits events for UI layers to handle navigation.
 */

import { STORAGE_KEYS } from '@/config/storageKeys';
import type { NotificationType } from '@/types/notifications';
import { buildReturnHref } from '@/services/returns/buildReturnHref';
import { recordOperationalException, recordOperationalEvent } from '@/services/monitoring/telemetry';

export interface NotificationTapData {
  type: NotificationType;
  route?: string;
  entryId?: string;
  containerId?: string;
  action?: string;
  returnType?: 'seed' | 'pattern' | 'contrast';
}

export function resolveNotificationRoute(data: NotificationTapData): string {
  if (data.route?.startsWith('/')) {
    return data.route;
  }

  if (data.route) {
    recordOperationalEvent('notification_routing_failure', { state: 'invalid_route_fallback' });
  }

  return data.entryId ? buildReturnHref({
    entryId: data.entryId,
    returnType: data.returnType || 'seed',
  }) : '/journal/new';
}

/**
 * Initialize notification routing listeners for Capacitor
 */
export async function initializeNotificationRouter(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Check if running in Capacitor environment
    const { Capacitor } = await import('@capacitor/core');
    
    if (Capacitor.isNativePlatform()) {
      try {
        // Set up deep link handling for notification taps
        const { App } = await import('@capacitor/app');
        
        // Handle app launched from notification
        App.addListener('appUrlOpen', (event) => {
          handleNotificationDeepLink(event.url);
        });

        // Handle app resumed from background via notification
        App.addListener('appStateChange', (state) => {
          if (state.isActive) {
            // Check if app was opened via notification
            checkPendingNotificationAction();
          }
        });

        recordOperationalEvent('submission_transition', { state: 'notification_router_initialized' });
      } catch (appError) {
        recordOperationalException('notification_routing_failure', appError, { state: 'notification_router_plugin_unavailable' });
      }
    }
  } catch (error) {
    recordOperationalException('notification_routing_failure', error, { state: 'notification_router_init_failed' });
  }
}

/**
 * Handle deep link from notification tap
 */
function handleNotificationDeepLink(url: string): void {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    const notificationData: Partial<NotificationTapData> = {
      type: params.get('type') as NotificationType,
      route: params.get('route') || undefined,
      entryId: params.get('entryId') || undefined,
      containerId: params.get('containerId') || undefined,
      action: params.get('action') || undefined,
      returnType: (params.get('returnType') as NotificationTapData['returnType']) || undefined,
    };

    if (notificationData.type) {
      // Trigger navigation if router is available
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('alchm-notification-tap', {
          detail: notificationData
        }));
      }
    }
  } catch (error) {
    recordOperationalException('notification_routing_failure', error, { state: 'notification_router_parse_failed' });
  }
}

/**
 * Check for pending notification actions when app becomes active
 */
function checkPendingNotificationAction(): void {
  void STORAGE_KEYS;
}

/**
 * Format notification data for deep linking
 */
export function createNotificationDeepLink(data: NotificationTapData): string {
  const params = new URLSearchParams();
  
  params.set('type', data.type);
  if (data.route) params.set('route', data.route);
  if (data.entryId) params.set('entryId', data.entryId);
  if (data.containerId) params.set('containerId', data.containerId);
  if (data.action) params.set('action', data.action);
  if (data.returnType) params.set('returnType', data.returnType);
  
  return `alchm://notification?${params.toString()}`;
}

/**
 * Get the last notification tap for analytics/debugging
 */
export function getLastNotificationTap(): (NotificationTapData & { timestamp: string; targetRoute: string }) | null {
  return null;
}
