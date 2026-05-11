/**
 * Notification Types for ALCHM
 * 
 * Defines all notification delivery mechanisms using Capacitor Local Notifications
 * Privacy-preserving local notifications that don't require server infrastructure
 */

export type NotificationType = 'seedReturn';

export interface NotificationContext {
  entryId?: string;
  entryDate?: string;
  containerId?: string;
  returnType?: 'seed' | 'pattern' | 'contrast';
  userId: string;
  hasALCHM: boolean;
  timeZone: string;
  preferredTime?: string; // 'morning' | 'afternoon' | 'evening'
  recentNotificationTypes?: NotificationType[];
  lastNotificationDate?: string;
}

export interface NotificationConfig {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  
  // Scheduling
  scheduleAt: Date;
  
  // iOS-specific options
  sound?: string;
  badge?: number;
  threadId?: string;
  categoryId?: string;
  
  // Deep linking data
  data?: {
    route?: string;
    entryId?: string;
    containerId?: string;
    action?: string;
    returnType?: 'seed' | 'pattern' | 'contrast';
  };
  
  // Notification metadata
  context?: NotificationContext;
}

export interface SchedulingRule {
  type: NotificationType;
  
  // Timing rules
  delayHours: {
    min: number;
    max: number;
  };
  
  // Time of day constraints
  allowedHours: {
    start: number; // 24-hour format
    end: number;
  };
  
  // Frequency limits
  maxPerDay?: number;
  maxPerWeek?: number;
  cooldownHours?: number;
  
  requiresALCHM?: boolean;
  skipOnWeekends?: boolean;
  skipOnHolidays?: boolean;
  requiresJournalEntry?: boolean;
  requiresActiveContainer?: boolean;
}

export interface NotificationCopyTemplate {
  type: NotificationType;
  
  // Multiple variations to prevent repetition
  titles: string[];
  bodies: string[];
  
  // Context-based customization
  contextualBodies?: {
    hasEntry?: string[];
    hasContainer?: string[];
    firstTime?: string[];
    returning?: string[];
  };
  
  // Personalization tokens that can be replaced
  supportedTokens?: string[];
}

export interface NotificationPermissionState {
  granted: boolean;
  requestedAt?: Date;
  deniedAt?: Date;
  shouldShowRationale?: boolean;
  
  // Track permission request timing
  firstEntryCompletedAt?: Date;
  permissionRequestedAfterFirstEntry: boolean;
  
  // iOS-specific permission details
  authorizationStatus?: 'notDetermined' | 'denied' | 'authorized' | 'provisional';
  alertSetting?: 'notSupported' | 'disabled' | 'enabled';
  badgeSetting?: 'notSupported' | 'disabled' | 'enabled';
  soundSetting?: 'notSupported' | 'disabled' | 'enabled';
}

export interface ScheduledNotification {
  id: string;
  config: NotificationConfig;
  scheduledAt: Date;
  createdAt: Date;
  
  // Delivery tracking
  delivered?: boolean;
  deliveredAt?: Date;
  opened?: boolean;
  openedAt?: Date;
  
  // Error tracking
  failed?: boolean;
  error?: string;
  retryCount?: number;
  
  // Cancellation tracking
  cancelled?: boolean;
  cancelledAt?: Date;
  cancelReason?: string;
}

export interface NotificationStats {
  totalScheduled: number;
  totalDelivered: number;
  totalOpened: number;
  totalFailed: number;

  byType: Record<NotificationType, {
    scheduled: number;
    delivered: number;
    opened: number;
    failed: number;
  }>;

  last7Days: {
    scheduled: number;
    delivered: number;
    opened: number;
  };

  averageOpenRate: number;
  bestPerformingType: NotificationType;
  lastActivityAt?: Date;
}

// Capacitor Local Notifications plugin types
export interface LocalNotificationSchema {
  notifications: NotificationConfig[];
}

export interface LocalNotificationActionPerformed {
  actionId: string;
  inputValue?: string;
  notification: NotificationConfig;
}

export interface PendingLocalNotificationSchema {
  notifications: ScheduledNotification[];
}
