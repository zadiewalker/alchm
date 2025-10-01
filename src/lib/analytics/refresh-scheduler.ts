/**
 * ALCHM Emotional Report Card Refresh Scheduler
 * Implements Monday/Wednesday/Friday refresh cycle for emotional analytics
 */

export interface RefreshScheduleConfig {
  refreshDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  refreshTime: { hour: number; minute: number }; // Time of day to refresh
  fallbackDays: number; // Force refresh after this many days
}

const DEFAULT_CONFIG: RefreshScheduleConfig = {
  refreshDays: [1, 3, 5], // Monday, Wednesday, Friday
  refreshTime: { hour: 6, minute: 0 }, // 6:00 AM
  fallbackDays: 7
};

export class EmotionalReportRefreshScheduler {
  private config: RefreshScheduleConfig;

  constructor(config: Partial<RefreshScheduleConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Calculate the next refresh date based on schedule
   */
  getNextRefreshDate(): Date {
    const now = new Date();
    const currentDay = now.getDay();
    const { refreshDays, refreshTime } = this.config;
    
    // Find next refresh day
    let nextRefreshDay = refreshDays.find(day => day > currentDay);
    
    // If no refresh day this week, get first refresh day of next week
    if (!nextRefreshDay) {
      nextRefreshDay = refreshDays[0];
    }
    
    const daysUntilRefresh = nextRefreshDay <= currentDay ? 
      (7 - currentDay + nextRefreshDay) : (nextRefreshDay - currentDay);
    
    const nextRefresh = new Date(now);
    nextRefresh.setDate(now.getDate() + daysUntilRefresh);
    nextRefresh.setHours(refreshTime.hour, refreshTime.minute, 0, 0);
    
    return nextRefresh;
  }

  /**
   * Check if data should be refreshed based on schedule
   */
  shouldRefreshData(lastRefreshKey: string): boolean {
    const lastRefresh = localStorage.getItem(lastRefreshKey);
    const now = new Date();
    
    if (!lastRefresh) return true;
    
    const lastRefreshDate = new Date(lastRefresh);
    const currentDay = now.getDay();
    const isRefreshDay = this.config.refreshDays.includes(currentDay);
    
    // Refresh if it's a refresh day and we haven't refreshed today
    if (isRefreshDay && now.toDateString() !== lastRefreshDate.toDateString()) {
      return true;
    }
    
    // Force refresh if fallback period has passed
    const daysSinceRefresh = (now.getTime() - lastRefreshDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceRefresh > this.config.fallbackDays;
  }

  /**
   * Update the refresh timestamp
   */
  updateRefreshTimestamp(refreshKey: string): void {
    localStorage.setItem(refreshKey, new Date().toISOString());
  }

  /**
   * Get human-readable next refresh info
   */
  getRefreshInfo(): { nextRefresh: Date; daysUntil: number; isToday: boolean } {
    const nextRefresh = this.getNextRefreshDate();
    const now = new Date();
    const msUntilRefresh = nextRefresh.getTime() - now.getTime();
    const daysUntil = Math.ceil(msUntilRefresh / (1000 * 60 * 60 * 24));
    const isToday = now.toDateString() === nextRefresh.toDateString();

    return {
      nextRefresh,
      daysUntil: Math.max(0, daysUntil),
      isToday
    };
  }

  /**
   * Format next refresh date for display
   */
  formatNextRefresh(): string {
    const { nextRefresh, isToday, daysUntil } = this.getRefreshInfo();
    
    if (isToday) {
      return 'Today';
    }
    
    if (daysUntil === 1) {
      return 'Tomorrow';
    }
    
    return nextRefresh.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  /**
   * Check if today is a scheduled refresh day
   */
  isRefreshDay(): boolean {
    const currentDay = new Date().getDay();
    return this.config.refreshDays.includes(currentDay);
  }

  /**
   * Get cache management utilities
   */
  getCacheManager(baseKey: string) {
    return {
      get: (suffix = '') => {
        const key = suffix ? `${baseKey}_${suffix}` : baseKey;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      },
      
      set: (data: any, suffix = '') => {
        const key = suffix ? `${baseKey}_${suffix}` : baseKey;
        localStorage.setItem(key, JSON.stringify(data));
        this.updateRefreshTimestamp(`${baseKey}_last_refresh`);
      },
      
      shouldRefresh: () => {
        return this.shouldRefreshData(`${baseKey}_last_refresh`);
      },
      
      clear: (suffix = '') => {
        const key = suffix ? `${baseKey}_${suffix}` : baseKey;
        localStorage.removeItem(key);
        localStorage.removeItem(`${baseKey}_last_refresh`);
      }
    };
  }
}

// Default scheduler instance
export const defaultRefreshScheduler = new EmotionalReportRefreshScheduler();

// Convenience functions for backward compatibility
export const shouldRefreshEmotionalReport = (refreshKey: string) => 
  defaultRefreshScheduler.shouldRefreshData(refreshKey);

export const getNextRefreshDate = () => 
  defaultRefreshScheduler.getNextRefreshDate();

export const updateRefreshTimestamp = (refreshKey: string) => 
  defaultRefreshScheduler.updateRefreshTimestamp(refreshKey);

export const formatNextRefresh = () => 
  defaultRefreshScheduler.formatNextRefresh();