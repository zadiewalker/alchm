// ALCHM Data Retention Scheduler
// Background service for automated data lifecycle management

import { dataRetentionManager } from '@/lib/data-retention-policy';
import { createApiError, ApiErrorCode } from '@/lib/apiUtils';

interface SchedulerConfig {
  enableScheduler: boolean;
  schedulerInterval: number; // in minutes
  batchSize: number;
  maxRetries: number;
  debugMode: boolean;
}

interface SchedulerStats {
  lastRun: Date;
  successfulDeletions: number;
  failedDeletions: number;
  totalProcessed: number;
  averageProcessingTime: number;
  errors: Array<{
    timestamp: Date;
    error: string;
    context?: any;
  }>;
}

export class DataRetentionScheduler {
  private config: SchedulerConfig;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private stats: SchedulerStats;

  constructor(config: Partial<SchedulerConfig> = {}) {
    this.config = {
      enableScheduler: process.env.NODE_ENV === 'production',
      schedulerInterval: 60, // Run every hour
      batchSize: 50,
      maxRetries: 3,
      debugMode: process.env.NODE_ENV === 'development',
      ...config
    };

    this.stats = {
      lastRun: new Date(),
      successfulDeletions: 0,
      failedDeletions: 0,
      totalProcessed: 0,
      averageProcessingTime: 0,
      errors: []
    };
  }

  // Start the scheduler
  start(): void {
    if (this.isRunning) {
      console.log('[DataRetentionScheduler] Scheduler is already running');
      return;
    }

    if (!this.config.enableScheduler) {
      console.log('[DataRetentionScheduler] Scheduler is disabled');
      return;
    }

    console.log(`[DataRetentionScheduler] Starting scheduler with ${this.config.schedulerInterval}min interval`);
    
    this.isRunning = true;
    
    // Run immediately on start
    this.processScheduledDeletions();
    
    // Set up recurring schedule
    this.intervalId = setInterval(() => {
      this.processScheduledDeletions();
    }, this.config.schedulerInterval * 60 * 1000);
  }

  // Stop the scheduler
  stop(): void {
    if (!this.isRunning) {
      console.log('[DataRetentionScheduler] Scheduler is not running');
      return;
    }

    console.log('[DataRetentionScheduler] Stopping scheduler');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Process scheduled deletions
  private async processScheduledDeletions(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    const startTime = Date.now();
    console.log('[DataRetentionScheduler] Starting scheduled deletion process');

    try {
      await dataRetentionManager.executeScheduledDeletions();
      
      const processingTime = Date.now() - startTime;
      this.updateStats(true, processingTime);
      
      if (this.config.debugMode) {
        console.log(`[DataRetentionScheduler] Deletion process completed in ${processingTime}ms`);
      }

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.updateStats(false, processingTime, error);
      
      console.error('[DataRetentionScheduler] Failed to process scheduled deletions:', error);
      
      // Add to error log
      this.stats.errors.push({
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
        context: { processingTime }
      });

      // Keep only last 100 errors
      if (this.stats.errors.length > 100) {
        this.stats.errors = this.stats.errors.slice(-100);
      }
    }
  }

  // Update scheduler statistics
  private updateStats(success: boolean, processingTime: number, error?: any): void {
    this.stats.lastRun = new Date();
    this.stats.totalProcessed++;
    
    if (success) {
      this.stats.successfulDeletions++;
    } else {
      this.stats.failedDeletions++;
    }

    // Update average processing time
    this.stats.averageProcessingTime = (
      (this.stats.averageProcessingTime * (this.stats.totalProcessed - 1) + processingTime) / 
      this.stats.totalProcessed
    );
  }

  // Get scheduler status and statistics
  getStatus(): {
    isRunning: boolean;
    config: SchedulerConfig;
    stats: SchedulerStats;
    health: 'healthy' | 'warning' | 'error';
  } {
    const failureRate = this.stats.totalProcessed > 0 
      ? this.stats.failedDeletions / this.stats.totalProcessed 
      : 0;

    const timeSinceLastRun = Date.now() - this.stats.lastRun.getTime();
    const expectedInterval = this.config.schedulerInterval * 60 * 1000;

    let health: 'healthy' | 'warning' | 'error' = 'healthy';

    if (failureRate > 0.1) { // More than 10% failure rate
      health = 'error';
    } else if (failureRate > 0.05 || timeSinceLastRun > expectedInterval * 2) {
      health = 'warning';
    }

    return {
      isRunning: this.isRunning,
      config: this.config,
      stats: this.stats,
      health
    };
  }

  // Manual trigger for deletions (for testing/admin use)
  async triggerManualDeletion(): Promise<void> {
    if (!this.isRunning) {
      throw createApiError(
        ApiErrorCode.SERVICE_UNAVAILABLE,
        'Scheduler is not running',
        null,
        'Data retention scheduler is not active'
      );
    }

    console.log('[DataRetentionScheduler] Manual deletion triggered');
    await this.processScheduledDeletions();
  }

  // Reset scheduler statistics
  resetStats(): void {
    this.stats = {
      lastRun: new Date(),
      successfulDeletions: 0,
      failedDeletions: 0,
      totalProcessed: 0,
      averageProcessingTime: 0,
      errors: []
    };
    console.log('[DataRetentionScheduler] Statistics reset');
  }

  // Update scheduler configuration
  updateConfig(newConfig: Partial<SchedulerConfig>): void {
    const wasRunning = this.isRunning;
    
    if (wasRunning) {
      this.stop();
    }

    this.config = { ...this.config, ...newConfig };
    console.log('[DataRetentionScheduler] Configuration updated:', newConfig);

    if (wasRunning && this.config.enableScheduler) {
      this.start();
    }
  }

  // Get health check information
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastRun: string;
    nextRun: string | null;
    failureRate: number;
    errors: number;
    recommendations: string[];
  }> {
    const status = this.getStatus();
    const failureRate = status.stats.totalProcessed > 0 
      ? status.stats.failedDeletions / status.stats.totalProcessed 
      : 0;

    const recommendations: string[] = [];
    
    if (!status.isRunning && this.config.enableScheduler) {
      recommendations.push('Scheduler should be running but is stopped');
    }
    
    if (failureRate > 0.1) {
      recommendations.push('High failure rate detected - check error logs');
    }
    
    if (status.stats.errors.length > 10) {
      recommendations.push('Multiple recent errors - investigate recurring issues');
    }

    const timeSinceLastRun = Date.now() - status.stats.lastRun.getTime();
    const expectedInterval = this.config.schedulerInterval * 60 * 1000;
    
    if (timeSinceLastRun > expectedInterval * 2) {
      recommendations.push('Scheduler appears to be stalled');
    }

    let healthStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (recommendations.length > 2 || failureRate > 0.2) {
      healthStatus = 'unhealthy';
    } else if (recommendations.length > 0 || failureRate > 0.05) {
      healthStatus = 'degraded';
    }

    const nextRun = status.isRunning 
      ? new Date(status.stats.lastRun.getTime() + expectedInterval).toISOString()
      : null;

    return {
      status: healthStatus,
      lastRun: status.stats.lastRun.toISOString(),
      nextRun,
      failureRate,
      errors: status.stats.errors.length,
      recommendations
    };
  }
}

// Export singleton instance
export const dataRetentionScheduler = new DataRetentionScheduler({
  enableScheduler: process.env.ENABLE_DATA_RETENTION_SCHEDULER === 'true',
  schedulerInterval: parseInt(process.env.DATA_RETENTION_INTERVAL_MINUTES || '60'),
  debugMode: process.env.NODE_ENV === 'development'
});

// Auto-start the scheduler in production
if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DATA_RETENTION_SCHEDULER === 'true') {
  dataRetentionScheduler.start();
  console.log('[DataRetentionScheduler] Auto-started in production mode');
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[DataRetentionScheduler] Received SIGTERM, stopping scheduler');
  dataRetentionScheduler.stop();
});

process.on('SIGINT', () => {
  console.log('[DataRetentionScheduler] Received SIGINT, stopping scheduler');
  dataRetentionScheduler.stop();
});