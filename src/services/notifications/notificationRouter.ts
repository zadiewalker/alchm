/**
 * Notification Router for ALCHM
 * 
 * Handles deep linking and navigation when notifications are tapped
 * Emits events for UI layers to handle navigation.
 */

import { STORAGE_KEYS } from '@/config/storageKeys';
import type { NotificationType } from '@/types/notifications';
import type { ResurfacingToneMode } from '@/types/resurfacingTone';
import { buildReturnHref } from '@/services/returns/buildReturnHref';
import { recordOperationalException, recordOperationalEvent } from '@/services/monitoring/telemetry';

export interface NotificationTapData {
  type: NotificationType;
  route?: string;
  entryId?: string;
  containerId?: string;
  action?: string;
  returnType?: 'seed' | 'pattern' | 'contrast';
  resurfacingTone?: ResurfacingToneMode;
}

type RouterListenerHandle = { remove: () => Promise<void> };

function parseNotificationType(value: string | null): NotificationType | undefined {
  return value === 'seedReturn' ? value : undefined;
}

function parseReturnType(value: string | null): NotificationTapData['returnType'] {
  return value === 'seed' || value === 'pattern' || value === 'contrast' ? value : undefined;
}

function parseResurfacingTone(value: string | null): ResurfacingToneMode | undefined {
  switch (value) {
    case 'quiet_continuity':
    case 'seasonal_return':
    case 'emotional_echo':
    case 'unresolved_warmth':
    case 'parallel_texture':
    case 'soft_recurrence':
      return value;
    default:
      return undefined;
  }
}

export function isNotificationTapData(value: unknown): value is NotificationTapData {
  if (typeof value !== 'object' || value === null || !('type' in value) || value.type !== 'seedReturn') {
    return false;
  }

  return (
    (!('route' in value) || value.route === undefined || typeof value.route === 'string')
    && (!('entryId' in value) || value.entryId === undefined || typeof value.entryId === 'string')
    && (!('containerId' in value) || value.containerId === undefined || typeof value.containerId === 'string')
    && (!('action' in value) || value.action === undefined || typeof value.action === 'string')
    && (!('returnType' in value) || value.returnType === undefined || parseReturnType(typeof value.returnType === 'string' ? value.returnType : null) !== undefined)
    && (!('resurfacingTone' in value) || value.resurfacingTone === undefined || parseResurfacingTone(typeof value.resurfacingTone === 'string' ? value.resurfacingTone : null) !== undefined)
  );
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
    resurfacingTone: data.resurfacingTone,
  }) : '/journal/new';
}

/**
 * Initialize notification routing listeners for Capacitor
 */
export async function initializeNotificationRouter(): Promise<() => Promise<void>> {
  if (typeof window === 'undefined') {
    return async () => {};
  }

  const handles: RouterListenerHandle[] = [];

  try {
    // Check if running in Capacitor environment
    const { Capacitor } = await import('@capacitor/core');
    
    if (Capacitor.isNativePlatform()) {
      try {
        // Set up deep link handling for notification taps
        const { App } = await import('@capacitor/app');
        
        // Handle app launched from notification
        handles.push(await App.addListener('appUrlOpen', (event) => {
          handleNotificationDeepLink(event.url);
        }));

        // Handle app resumed from background via notification
        handles.push(await App.addListener('appStateChange', (state) => {
          if (state.isActive) {
            // Check if app was opened via notification
            checkPendingNotificationAction();
          }
        }));

        recordOperationalEvent('submission_transition', { state: 'notification_router_initialized' });
      } catch (appError) {
        recordOperationalException('notification_routing_failure', appError, { state: 'notification_router_plugin_unavailable' });
      }
    }
  } catch (error) {
    recordOperationalException('notification_routing_failure', error, { state: 'notification_router_init_failed' });
  }

  return async () => {
    await Promise.all(handles.map((handle) => handle.remove()));
  };
}

/**
 * Handle deep link from notification tap
 */
function handleNotificationDeepLink(url: string): void {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    const type = parseNotificationType(params.get('type'));
    if (!type) {
      return;
    }
    const notificationData: NotificationTapData = {
      type,
      route: params.get('route') || undefined,
      entryId: params.get('entryId') || undefined,
      containerId: params.get('containerId') || undefined,
      action: params.get('action') || undefined,
      returnType: parseReturnType(params.get('returnType')),
      resurfacingTone: parseResurfacingTone(params.get('resurfacingTone')),
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('alchm-notification-tap', {
        detail: notificationData
      }));
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
  if (data.resurfacingTone) params.set('resurfacingTone', data.resurfacingTone);
  
  return `alchm://notification?${params.toString()}`;
}

/**
 * Get the last notification tap for analytics/debugging
 */
export function getLastNotificationTap(): (NotificationTapData & { timestamp: string; targetRoute: string }) | null {
  return null;
}
