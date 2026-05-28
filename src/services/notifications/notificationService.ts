/**
 * Core Notification Service for ALCHM
 * 
 * Handles scheduling, delivery, and management of all notifications
 * Integrates with Capacitor Local Notifications for iOS delivery
 */

import type {
  NotificationType,
  NotificationContext,
  NotificationConfig,
  ScheduledNotification,
  NotificationPermissionState,
  NotificationStats,
  LocalNotificationActionPerformed
} from '@/types/notifications';

import {
  calculateDeliveryTime,
  canScheduleNotification,
  getRecommendedNotificationTypes
} from './schedulingRules';

import {
  generateNotificationCopy,
  validateNotificationCopy
} from './notificationCopy';
import { buildReturnHref } from '@/services/returns/buildReturnHref';
import { selectReturn } from '@/services/returns/selectReturn';
import { assertNoRawTextLeak } from '@/services/privacy/assertNoRawTextLeak';
import { recordOperationalEvent, recordOperationalException } from '@/services/monitoring/telemetry';

const RETURN_NOTIFICATION_SCHEDULING_ENABLED = false;

// Capacitor imports (will be available after plugin installation)
declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform: () => boolean;
    };
  }
}

/**
 * Core notification service class
 */
class NotificationService {
  private isInitialized = false;
  private localNotifications: LocalNotificationsPlugin | null = null;
  private permissionState: NotificationPermissionState | null = null;
  private scheduledNotifications: ScheduledNotification[] = [];
  private stats: NotificationStats | null = null;
  private recentCopy = { titles: [] as string[], bodies: [] as string[] };
  
  /**
   * Initialize the notification service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Load Local Notifications plugin with graceful fallback
      const { loadLocalNotificationsPlugin } = await import('./notificationLoader');
      this.localNotifications = await loadLocalNotificationsPlugin() as LocalNotificationsPlugin;
      
      // Set up event listeners if using real plugin (not mock)
      if (this.localNotifications?.addListener && typeof this.localNotifications.addListener === 'function') {
        try {
          await this.setupEventListeners();
        } catch (listenerError) {
          recordOperationalException('submission_transition', listenerError, { state: 'notification_listener_setup_failed' });
        }
      }
      
      // Load permission state
      await this.loadPermissionState();
      
      this.isInitialized = true;
    } catch (error) {
      recordOperationalException('submission_transition', error, { state: 'notification_service_init_failed' });
      throw error;
    }
  }
  
  /**
   * Set up notification event listeners
   */
  private async setupEventListeners(): Promise<void> {
    if (!this.localNotifications) return;
    
    // Handle notification taps
    this.localNotifications.addListener?.(
      'localNotificationActionPerformed',
      (notification: unknown) => {
        this.handleNotificationTap(notification as LocalNotificationActionPerformed);
      }
    );
    
    // Handle notification delivery receipts
    this.localNotifications.addListener?.(
      'localNotificationReceived',
      (notification: unknown) => {
        this.handleNotificationDelivered(notification);
      }
    );
  }
  
  /**
   * Request notification permissions from user
   */
  async requestPermissions(): Promise<NotificationPermissionState> {
    if (!this.localNotifications) {
      return {
        granted: false,
        shouldShowRationale: true,
        permissionRequestedAfterFirstEntry: false
      };
    }
    
    try {
      const result = await this.localNotifications.requestPermissions();
      const authorizationStatus = mapAuthorizationStatus(result.display);
      const settingValue = mapSetting(result.alert);
      const badgeValue = mapSetting(result.badge);
      const soundValue = mapSetting(result.sound);
      
      const permissionState: NotificationPermissionState = {
        granted: result.display === 'granted',
        requestedAt: new Date(),
        authorizationStatus,
        alertSetting: settingValue,
        badgeSetting: badgeValue,
        soundSetting: soundValue,
        permissionRequestedAfterFirstEntry: true
      };
      
      await this.savePermissionState(permissionState);
      this.permissionState = permissionState;
      recordOperationalEvent('submission_transition', { state: 'notification_permissions_requested' });
      return permissionState;
    } catch (error) {
      recordOperationalException('submission_transition', error, { state: 'notification_permissions_failed' });
      
      const deniedState: NotificationPermissionState = {
        granted: false,
        deniedAt: new Date(),
        permissionRequestedAfterFirstEntry: true
      };
      
      await this.savePermissionState(deniedState);
      return deniedState;
    }
  }
  
  /**
   * Check current notification permissions
   */
  async checkPermissions(): Promise<NotificationPermissionState> {
    if (this.permissionState) {
      return this.permissionState;
    }
    
    if (!this.localNotifications) {
      return {
        granted: false,
        permissionRequestedAfterFirstEntry: false
      };
    }
    
    try {
      const result = await this.localNotifications.checkPermissions();
      const authorizationStatus = mapAuthorizationStatus(result.display);
      const settingValue = mapSetting(result.alert);
      const badgeValue = mapSetting(result.badge);
      const soundValue = mapSetting(result.sound);
      
      const permissionState: NotificationPermissionState = {
        granted: result.display === 'granted',
        authorizationStatus,
        alertSetting: settingValue,
        badgeSetting: badgeValue,
        soundSetting: soundValue,
        permissionRequestedAfterFirstEntry: false
      };
      
      this.permissionState = permissionState;
      return permissionState;
    } catch (error) {
      recordOperationalException('submission_transition', error, { state: 'notification_permission_check_failed' });
      return {
        granted: false,
        permissionRequestedAfterFirstEntry: false
      };
    }
  }
  
  /**
   * Schedule a notification
   */
  async scheduleNotification(
    type: NotificationType,
    context: NotificationContext,
    customDeliveryTime?: Date
  ): Promise<{ success: boolean; notificationId?: string; error?: string }> {
    if (!RETURN_NOTIFICATION_SCHEDULING_ENABLED) {
      return {
        success: false,
        error: 'Return notifications are unavailable until explicit user-choice handling is verified.',
      };
    }

    try {
      // Check permissions
      const permissions = await this.checkPermissions();
      if (!permissions.granted) {
        return { 
          success: false, 
          error: 'Notification permissions not granted' 
        };
      }
      
      // Load recent notifications to check scheduling rules
      const recentNotifications = await this.getScheduledNotifications();
      
      // Check if notification can be scheduled
      const schedulingCheck = canScheduleNotification(type, context, recentNotifications);
      if (!schedulingCheck.allowed) {
        return { 
          success: false, 
          error: schedulingCheck.reason 
        };
      }
      
      // Calculate delivery time
      const deliveryTime = customDeliveryTime || calculateDeliveryTime(type, context);
      if (!deliveryTime) {
        return { 
          success: false, 
          error: 'Could not calculate valid delivery time' 
        };
      }

      const returnSelection = await selectReturn(context, recentNotifications);
      if (returnSelection.suppressed) {
        return {
          success: false,
          error: returnSelection.reason ?? 'return_suppressed',
        };
      }

      const resolvedContext: NotificationContext = {
        ...context,
        entryId: returnSelection.entryId ?? context.entryId,
        entryDate: returnSelection.candidate
          ? new Date(returnSelection.candidate.createdAt).toISOString()
          : context.entryDate,
        returnType: returnSelection.returnType,
        resurfacingTone: returnSelection.resurfacingTone,
      };
      
      // Generate copy
      const recentCopy = await this.getRecentCopy();
      const { title, body } = generateNotificationCopy(type, resolvedContext, recentCopy);
      assertNoRawTextLeak({ context: resolvedContext, title, body }, 'notification_schedule');
      
      // Validate copy
      const copyValidation = validateNotificationCopy(title, body);
      if (!copyValidation.valid) {
        recordOperationalException('khepera_validation_failure', new Error('notification_copy_validation_failed'), { issue: copyValidation.issues.join(',') });
      }
      
      // Create notification config
      const notificationId = `alchm_${type}_${resolvedContext.entryId ?? 'general'}_${deliveryTime.getTime()}`;
      const config: NotificationConfig = {
        id: notificationId,
        type,
        title,
        body,
        scheduleAt: deliveryTime,
        sound: 'default',
        badge: 1,
        threadId: `alchm_${type}`,
        categoryId: type,
        data: {
          route: this.getRouteForNotificationType(type, resolvedContext),
          entryId: resolvedContext.entryId,
          containerId: resolvedContext.containerId,
          action: 'open',
          returnType: resolvedContext.returnType,
          resurfacingTone: resolvedContext.resurfacingTone,
        },
        context: resolvedContext
      };
      
      // Schedule with Capacitor
      if (this.localNotifications) {
        await this.localNotifications.schedule({
          notifications: [{
            id: parseInt(notificationId.split('_').pop() || '1'),
            title: config.title,
            body: config.body,
            schedule: { at: deliveryTime },
            sound: config.sound,
            extra: config.data
          }]
        });
      }
      
      // Store notification record
      const scheduledNotification: ScheduledNotification = {
        id: notificationId,
        config,
        scheduledAt: deliveryTime,
        createdAt: new Date()
      };
      
      await this.saveScheduledNotification(scheduledNotification);
      await this.updateRecentCopy(title, body);
      await this.updateStats(type, 'scheduled');
      recordOperationalEvent('submission_transition', { state: `notification_${type}_scheduled` });
      return { success: true, notificationId };
      
    } catch (error) {
      recordOperationalException('submission_transition', error, { state: 'notification_schedule_failed' });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Cancel in Capacitor
      if (this.localNotifications) {
        const numericId = parseInt(notificationId.split('_').pop() || '0');
        await this.localNotifications.cancel({
          notifications: [{ id: numericId }]
        });
      }
      
      // Update stored record
      await this.markNotificationCancelled(notificationId);
      recordOperationalEvent('submission_transition', { state: 'notification_cancelled' });
      return { success: true };
      
    } catch (error) {
      recordOperationalException('submission_transition', error, { state: 'notification_cancel_failed' });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Cancel all pending notifications
   */
  async cancelAllNotifications(): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.localNotifications) {
        await this.localNotifications.cancel({
          notifications: []
        });
      }
      
      // Mark all as cancelled in storage
      const notifications = await this.getScheduledNotifications();
      for (const notification of notifications) {
        if (!notification.delivered && !notification.cancelled) {
          await this.markNotificationCancelled(notification.id);
        }
      }
      recordOperationalEvent('submission_transition', { state: 'notifications_cancelled_all' });
      return { success: true };
      
    } catch (error) {
      recordOperationalException('submission_transition', error, { state: 'notifications_cancel_all_failed' });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Schedule multiple recommended notifications based on context
   */
  async scheduleRecommendedNotifications(
    context: NotificationContext
  ): Promise<{ scheduled: string[]; skipped: string[]; errors: string[] }> {
    const recentNotifications = await this.getScheduledNotifications();
    const recommendedTypes = getRecommendedNotificationTypes(context, recentNotifications);
    
    const scheduled: string[] = [];
    const skipped: string[] = [];
    const errors: string[] = [];
    
    for (const type of recommendedTypes) {
      const result = await this.scheduleNotification(type, context);
      
      if (result.success && result.notificationId) {
        scheduled.push(result.notificationId);
      } else if (result.error) {
        if (result.error.includes('limit') || result.error.includes('cooldown')) {
          skipped.push(`${type}: ${result.error}`);
        } else {
          errors.push(`${type}: ${result.error}`);
        }
      }
    }
    
    return { scheduled, skipped, errors };
  }
  
  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStats> {
    if (this.stats) {
      return this.stats;
    }
    
    // Initialize default stats
    const defaultStats: NotificationStats = {
      totalScheduled: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalFailed: 0,
      byType: {
        seedReturn: { scheduled: 0, delivered: 0, opened: 0, failed: 0 },
      },
      last7Days: { scheduled: 0, delivered: 0, opened: 0 },
      averageOpenRate: 0,
      bestPerformingType: 'seedReturn'
    };
    
    this.stats = defaultStats;
    return this.stats;
  }
  
  // Private helper methods
  
  private getRouteForNotificationType(_type: NotificationType, context?: NotificationContext): string {
    return context?.entryId ? buildReturnHref({
      entryId: context.entryId,
      returnType: context.returnType || 'seed',
      resurfacingTone: context.resurfacingTone,
    }) : '/journal/new/';
  }
  
  private async handleNotificationTap(notification: LocalNotificationActionPerformed): Promise<void> {
    recordOperationalEvent('submission_transition', { state: 'notification_tapped' });
    
    // Mark as opened
    if (notification.notification.id) {
      await this.markNotificationOpened(notification.notification.id);
    }
    
    // Trigger navigation via custom event for the NotificationRouter
    if (typeof window !== 'undefined' && notification.notification.data) {
      const notificationData = {
        type: notification.notification.type,
        route: notification.notification.data.route,
        entryId: notification.notification.data.entryId,
        containerId: notification.notification.data.containerId,
        action: notification.notification.data.action || 'open',
        returnType: notification.notification.data.returnType,
        resurfacingTone: notification.notification.data.resurfacingTone,
      };
      
      window.dispatchEvent(new CustomEvent('alchm-notification-tap', {
        detail: notificationData
      }));
    }
  }
  
  private async handleNotificationDelivered(notification: unknown): Promise<void> {
    recordOperationalEvent('submission_transition', { state: 'notification_delivered' });

    if (
      typeof notification === 'object'
      && notification !== null
      && 'data' in notification
      && typeof (notification as { data?: { notificationId?: string } }).data?.notificationId === 'string'
    ) {
      await this.markNotificationDelivered(
        (notification as { data: { notificationId: string } }).data.notificationId
      );
    }
  }
  
  private async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    return [...this.scheduledNotifications];
  }
  
  private async saveScheduledNotification(notification: ScheduledNotification): Promise<void> {
    this.scheduledNotifications = [...this.scheduledNotifications, notification];
  }
  
  private async markNotificationDelivered(notificationId: string): Promise<void> {
    const notifications = await this.getScheduledNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.delivered = true;
      notification.deliveredAt = new Date();
      this.scheduledNotifications = notifications;
      await this.updateStats(notification.config.type, 'delivered');
    }
  }
  
  private async markNotificationOpened(notificationId: string): Promise<void> {
    const notifications = await this.getScheduledNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.opened = true;
      notification.openedAt = new Date();
      this.scheduledNotifications = notifications;
      await this.updateStats(notification.config.type, 'opened');
    }
  }
  
  private async markNotificationCancelled(notificationId: string): Promise<void> {
    const notifications = await this.getScheduledNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.cancelled = true;
      notification.cancelledAt = new Date();
      notification.cancelReason = 'user_cancelled';
      this.scheduledNotifications = notifications;
    }
  }
  
  private async savePermissionState(state: NotificationPermissionState): Promise<void> {
    this.permissionState = state;
  }
  
  private async loadPermissionState(): Promise<void> {
    this.permissionState = this.permissionState ?? null;
  }
  
  private async getRecentCopy(): Promise<{ titles: string[]; bodies: string[] }> {
    return {
      titles: [...this.recentCopy.titles],
      bodies: [...this.recentCopy.bodies],
    };
  }
  
  private async updateRecentCopy(title: string, body: string): Promise<void> {
    const recent = await this.getRecentCopy();
    recent.titles.push(title);
    recent.bodies.push(body);
    
    // Keep only last 10 entries
    if (recent.titles.length > 10) {
      recent.titles = recent.titles.slice(-10);
      recent.bodies = recent.bodies.slice(-10);
    }

    this.recentCopy = recent;
  }
  
  private async updateStats(type: NotificationType, action: 'scheduled' | 'delivered' | 'opened' | 'failed'): Promise<void> {
    const stats = await this.getStats();
    
    stats[`total${action.charAt(0).toUpperCase() + action.slice(1)}` as keyof NotificationStats]++;
    stats.byType[type][action]++;
    
    // Update last 7 days (simplified)
    if (action !== 'failed') {
      stats.last7Days[action as keyof typeof stats.last7Days]++;
    }
    
    // Recalculate average open rate
    if (stats.totalDelivered > 0) {
      stats.averageOpenRate = stats.totalOpened / stats.totalDelivered;
    }
    
    stats.lastActivityAt = new Date();
    
    await this.saveStats(stats);
  }
  
  private async saveStats(stats: NotificationStats): Promise<void> {
    this.stats = stats;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export convenience functions
export async function initializeNotifications(): Promise<void> {
  return notificationService.initialize();
}

export async function requestNotificationPermissions(): Promise<NotificationPermissionState> {
  return notificationService.requestPermissions();
}

export async function checkNotificationPermissions(): Promise<NotificationPermissionState> {
  return notificationService.checkPermissions();
}

export async function scheduleNotification(
  type: NotificationType,
  context: NotificationContext,
  customDeliveryTime?: Date
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  return notificationService.scheduleNotification(type, context, customDeliveryTime);
}

export async function cancelNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  return notificationService.cancelNotification(notificationId);
}

export async function scheduleRecommendedNotifications(
  context: NotificationContext
): Promise<{ scheduled: string[]; skipped: string[]; errors: string[] }> {
  return notificationService.scheduleRecommendedNotifications(context);
}

export async function getNotificationStats(): Promise<NotificationStats> {
  return notificationService.getStats();
}

export async function cancelAllNotifications(): Promise<{ success: boolean; error?: string }> {
  return notificationService.cancelAllNotifications();
}

function mapAuthorizationStatus(value: string): NotificationPermissionState['authorizationStatus'] {
  if (value === 'granted') return 'authorized';
  if (value === 'denied') return 'denied';
  if (value === 'provisional') return 'provisional';
  return 'notDetermined';
}

function mapSetting(value: string | undefined): NotificationPermissionState['alertSetting'] {
  if (value === 'enabled') return 'enabled';
  if (value === 'disabled') return 'disabled';
  return 'notSupported';
}

interface LocalNotificationsPlugin {
  addListener?: (eventName: string, listener: (notification: unknown) => void) => unknown;
  requestPermissions: () => Promise<{
    display: string;
    alert?: string;
    badge?: string;
    sound?: string;
  }>;
  checkPermissions: () => Promise<{
    display: string;
    alert?: string;
    badge?: string;
    sound?: string;
  }>;
  schedule: (options: unknown) => Promise<unknown>;
  cancel: (options: unknown) => Promise<unknown>;
}
