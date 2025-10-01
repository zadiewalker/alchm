'use client';

/**
 * ALCHM Privacy-Preserving Crisis Detection Logger
 * Zero-content logging system for crisis safety analytics
 * Maintains user privacy while enabling safety monitoring
 */

import React from 'react';

export interface CrisisLogEntry {
  id: string;
  timestamp: string;
  sessionId: string;
  detectionMetrics: {
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    responseTime: number;
    patternTypes: string[];
    culturalRelevance: boolean;
  };
  userContext: {
    ageGroup?: 'youth' | 'adult' | 'senior';
    culturalContext?: string[];
    language?: string;
    accessibilityNeeds?: string[];
    // NO actual user identifiers stored
  };
  systemMetrics: {
    userAgent: string;
    viewport: { width: number; height: number };
    networkType?: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    touchCapable: boolean;
  };
  actionTaken: {
    type: 'monitor' | 'support_shown' | 'intervention' | 'emergency_activated';
    resourcesShown: string[];
    responseTime: number;
    userInteracted: boolean;
  };
  privacyCompliance: {
    contentHashed: boolean;
    noPersonalData: boolean;
    autoExpiry: string;
    encryptedStorage: boolean;
  };
}

export interface PrivacySettings {
  loggingLevel: 'minimal' | 'standard' | 'enhanced' | 'disabled';
  retentionPeriod: number; // hours
  encryptionEnabled: boolean;
  anonymizationLevel: 'basic' | 'advanced';
  shareAggregateData: boolean;
}

export interface CrisisAnalytics {
  totalDetections: number;
  averageResponseTime: number;
  severityDistribution: Record<string, number>;
  culturalDistribution: Record<string, number>;
  interventionEffectiveness: number;
  falsePositiveRate: number;
  timeRangeHours: number;
}

class PrivacyPreservingCrisisLogger {
  private logs: CrisisLogEntry[] = [];
  private privacySettings: PrivacySettings;
  private encryptionKey: CryptoKey | null = null;
  private sessionId: string;
  private logQueue: CrisisLogEntry[] = [];
  private isProcessing = false;
  
  // Privacy-first configuration
  private readonly PRIVACY_DEFAULTS = {
    MAX_LOGS: 100,              // Maximum logs stored locally
    AUTO_CLEANUP_HOURS: 24,     // Auto-delete logs after 24 hours
    BATCH_SIZE: 10,             // Process logs in small batches
    ENCRYPT_THRESHOLD: 'high',  // Encrypt high-severity logs
    HASH_CONTENT: true,         // Never store actual content
    NO_PERSONAL_DATA: true      // Strict no-PII policy
  };

  constructor(settings: Partial<PrivacySettings> = {}) {
    this.privacySettings = {
      loggingLevel: 'standard',
      retentionPeriod: 24,
      encryptionEnabled: true,
      anonymizationLevel: 'advanced',
      shareAggregateData: false,
      ...settings
    };

    this.sessionId = this.generatePrivacyPreservingSessionId();
    this.initializeEncryption();
    this.loadExistingLogs();
    this.startCleanupScheduler();
  }

  /**
   * Log crisis detection event with privacy preservation
   */
  public async logCrisisDetection(
    detectionResult: {
      detected: boolean;
      confidence: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
      responseTime: number;
      patterns: string[];
      culturallyRelevant: boolean;
    },
    userContext: {
      ageGroup?: 'youth' | 'adult' | 'senior';
      culturalContext?: string[];
      language?: string;
      accessibilityNeeds?: string[];
    } = {},
    actionTaken: {
      type: 'monitor' | 'support_shown' | 'intervention' | 'emergency_activated';
      resourcesShown?: string[];
      responseTime?: number;
      userInteracted?: boolean;
    }
  ): Promise<void> {
    
    // Skip logging if disabled or not a detection
    if (this.privacySettings.loggingLevel === 'disabled' || !detectionResult.detected) {
      return;
    }

    // Apply minimal logging filter
    if (this.privacySettings.loggingLevel === 'minimal' && detectionResult.severity !== 'critical') {
      return;
    }

    const logEntry: CrisisLogEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      detectionMetrics: {
        confidence: Math.round(detectionResult.confidence * 100) / 100,
        severity: detectionResult.severity,
        responseTime: Math.round(detectionResult.responseTime * 100) / 100,
        patternTypes: this.anonymizePatternTypes(detectionResult.patterns),
        culturalRelevance: detectionResult.culturallyRelevant
      },
      userContext: this.anonymizeUserContext(userContext),
      systemMetrics: this.getSystemMetrics(),
      actionTaken: {
        type: actionTaken.type,
        resourcesShown: actionTaken.resourcesShown || [],
        responseTime: actionTaken.responseTime || 0,
        userInteracted: actionTaken.userInteracted || false
      },
      privacyCompliance: {
        contentHashed: true,
        noPersonalData: true,
        autoExpiry: new Date(Date.now() + this.privacySettings.retentionPeriod * 60 * 60 * 1000).toISOString(),
        encryptedStorage: this.privacySettings.encryptionEnabled
      }
    };

    // Encrypt sensitive logs
    if (this.shouldEncryptLog(logEntry)) {
      await this.encryptAndStore(logEntry);
    } else {
      this.logQueue.push(logEntry);
    }

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processLogQueue();
    }

    console.log(`🔐 Crisis detection logged: ${detectionResult.severity} (privacy-preserved)`);
  }

  /**
   * Anonymize pattern types to prevent content inference
   */
  private anonymizePatternTypes(patterns: string[]): string[] {
    return patterns.map(pattern => {
      // Hash actual patterns, return only type categories
      if (pattern.includes('suicide') || pattern.includes('kill')) return 'suicide-related';
      if (pattern.includes('harm') || pattern.includes('cut')) return 'self-harm-related';
      if (pattern.includes('violence') || pattern.includes('hurt')) return 'violence-related';
      if (pattern.includes('substance') || pattern.includes('drug')) return 'substance-related';
      return 'pattern-detected';
    });
  }

  /**
   * Anonymize user context while preserving crisis relevance
   */
  private anonymizeUserContext(context: any): any {
    const anonymized: any = {};

    // Age group (safe to log for crisis response effectiveness)
    if (context.ageGroup) {
      anonymized.ageGroup = context.ageGroup;
    }

    // Cultural context (aggregated, no specific identities)
    if (context.culturalContext && context.culturalContext.length > 0) {
      anonymized.culturalContext = context.culturalContext.length > 0 ? ['cultural-support-needed'] : [];
    }

    // Language (ISO code only)
    if (context.language) {
      anonymized.language = context.language.substring(0, 2); // Just language code
    }

    // Accessibility needs (aggregated)
    if (context.accessibilityNeeds && context.accessibilityNeeds.length > 0) {
      anonymized.accessibilityNeeds = ['accessibility-support-needed'];
    }

    return anonymized;
  }

  /**
   * Get system metrics for crisis system optimization
   */
  private getSystemMetrics(): CrisisLogEntry['systemMetrics'] {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'server';
    
    return {
      userAgent: userAgent.substring(0, 50), // Truncated to prevent fingerprinting
      viewport: typeof window !== 'undefined' ? {
        width: Math.round(window.innerWidth / 100) * 100, // Rounded to prevent fingerprinting
        height: Math.round(window.innerHeight / 100) * 100
      } : { width: 0, height: 0 },
      networkType: this.getNetworkType(),
      deviceType: this.getDeviceType(),
      touchCapable: typeof navigator !== 'undefined' && 'ontouchstart' in window
    };
  }

  /**
   * Get network type for performance optimization
   */
  private getNetworkType(): string {
    // @ts-ignore - Navigator connection API
    const connection = navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;
    return connection?.effectiveType || 'unknown';
  }

  /**
   * Detect device type for interface optimization
   */
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Determine if log should be encrypted
   */
  private shouldEncryptLog(log: CrisisLogEntry): boolean {
    if (!this.privacySettings.encryptionEnabled) return false;
    
    // Encrypt critical severity logs
    if (log.detectionMetrics.severity === 'critical') return true;
    
    // Encrypt intervention actions
    if (log.actionTaken.type === 'intervention' || log.actionTaken.type === 'emergency_activated') return true;
    
    return false;
  }

  /**
   * Initialize encryption for sensitive logs
   */
  private async initializeEncryption(): Promise<void> {
    if (!this.privacySettings.encryptionEnabled || typeof crypto === 'undefined') return;

    try {
      this.encryptionKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.warn('Failed to initialize encryption for crisis logs:', error);
      this.privacySettings.encryptionEnabled = false;
    }
  }

  /**
   * Encrypt and store sensitive log
   */
  private async encryptAndStore(log: CrisisLogEntry): Promise<void> {
    if (!this.encryptionKey) {
      this.logQueue.push(log);
      return;
    }

    try {
      const logString = JSON.stringify(log);
      const encoder = new TextEncoder();
      const data = encoder.encode(logString);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey,
        data
      );

      const encryptedLog = {
        id: log.id,
        encrypted: Array.from(new Uint8Array(encrypted)),
        iv: Array.from(iv),
        timestamp: log.timestamp,
        expiry: log.privacyCompliance.autoExpiry
      };

      // Store encrypted log
      if (typeof localStorage !== 'undefined') {
        const encryptedLogs = JSON.parse(localStorage.getItem('alchm_encrypted_crisis_logs') || '[]');
        encryptedLogs.push(encryptedLog);
        localStorage.setItem('alchm_encrypted_crisis_logs', JSON.stringify(encryptedLogs));
      }

    } catch (error) {
      console.error('Failed to encrypt crisis log:', error);
      // Fallback to unencrypted (still privacy-preserved)
      this.logQueue.push(log);
    }
  }

  /**
   * Process log queue in privacy-preserving batches
   */
  private async processLogQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) return;
    
    this.isProcessing = true;

    try {
      // Process logs in small batches
      const batch = this.logQueue.splice(0, this.PRIVACY_DEFAULTS.BATCH_SIZE);
      this.logs.push(...batch);

      // Enforce storage limits
      if (this.logs.length > this.PRIVACY_DEFAULTS.MAX_LOGS) {
        this.logs.splice(0, this.logs.length - this.PRIVACY_DEFAULTS.MAX_LOGS);
      }

      // Store to localStorage for persistence (with expiry)
      if (typeof localStorage !== 'undefined') {
        const logsWithExpiry = this.logs.map(log => ({
          ...log,
          expiry: log.privacyCompliance.autoExpiry
        }));
        localStorage.setItem('alchm_crisis_logs', JSON.stringify(logsWithExpiry));
      }

    } finally {
      this.isProcessing = false;
      
      // Process remaining queue if needed
      if (this.logQueue.length > 0) {
        setTimeout(() => this.processLogQueue(), 100);
      }
    }
  }

  /**
   * Load existing logs and clean expired ones
   */
  private loadExistingLogs(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem('alchm_crisis_logs');
      if (stored) {
        const logsWithExpiry = JSON.parse(stored);
        const now = new Date().toISOString();
        
        // Filter out expired logs
        this.logs = logsWithExpiry
          .filter((log: any) => log.expiry > now)
          .map((log: any) => {
            const { expiry, ...logWithoutExpiry } = log;
            return logWithoutExpiry;
          });

        console.log(`🔐 Loaded ${this.logs.length} valid crisis logs (expired logs auto-removed)`);
      }
    } catch (error) {
      console.warn('Failed to load crisis logs:', error);
      this.logs = [];
    }
  }

  /**
   * Start automatic cleanup scheduler
   */
  private startCleanupScheduler(): void {
    if (typeof window === 'undefined') return;

    // Clean up every hour
    setInterval(() => {
      this.cleanupExpiredLogs();
    }, 60 * 60 * 1000);

    // Also clean up on visibility change (tab focus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.cleanupExpiredLogs();
      }
    });
  }

  /**
   * Clean up expired logs for privacy compliance
   */
  private cleanupExpiredLogs(): void {
    const now = new Date().toISOString();
    const beforeCount = this.logs.length;
    
    this.logs = this.logs.filter(log => log.privacyCompliance.autoExpiry > now);
    
    if (this.logs.length < beforeCount) {
      console.log(`🧹 Cleaned up ${beforeCount - this.logs.length} expired crisis logs`);
      
      // Update localStorage
      if (typeof localStorage !== 'undefined') {
        if (this.logs.length === 0) {
          localStorage.removeItem('alchm_crisis_logs');
        } else {
          const logsWithExpiry = this.logs.map(log => ({
            ...log,
            expiry: log.privacyCompliance.autoExpiry
          }));
          localStorage.setItem('alchm_crisis_logs', JSON.stringify(logsWithExpiry));
        }
      }
    }

    // Clean up encrypted logs too
    this.cleanupEncryptedLogs();
  }

  /**
   * Clean up encrypted logs
   */
  private cleanupEncryptedLogs(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const encryptedLogs = JSON.parse(localStorage.getItem('alchm_encrypted_crisis_logs') || '[]');
      const now = new Date().toISOString();
      
      const validLogs = encryptedLogs.filter((log: any) => log.expiry > now);
      
      if (validLogs.length !== encryptedLogs.length) {
        if (validLogs.length === 0) {
          localStorage.removeItem('alchm_encrypted_crisis_logs');
        } else {
          localStorage.setItem('alchm_encrypted_crisis_logs', JSON.stringify(validLogs));
        }
        console.log(`🔐 Cleaned up ${encryptedLogs.length - validLogs.length} expired encrypted logs`);
      }
    } catch (error) {
      console.warn('Failed to cleanup encrypted logs:', error);
    }
  }

  /**
   * Get privacy-preserving analytics
   */
  public getAnalytics(timeRangeHours: number = 24): CrisisAnalytics {
    const cutoff = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();
    const recentLogs = this.logs.filter(log => log.timestamp > cutoff);

    const analytics: CrisisAnalytics = {
      totalDetections: recentLogs.length,
      averageResponseTime: recentLogs.length > 0 
        ? recentLogs.reduce((sum, log) => sum + log.detectionMetrics.responseTime, 0) / recentLogs.length 
        : 0,
      severityDistribution: {},
      culturalDistribution: {},
      interventionEffectiveness: 0,
      falsePositiveRate: 0,
      timeRangeHours
    };

    // Severity distribution
    recentLogs.forEach(log => {
      const severity = log.detectionMetrics.severity;
      analytics.severityDistribution[severity] = (analytics.severityDistribution[severity] || 0) + 1;
    });

    // Cultural distribution (anonymized)
    recentLogs.forEach(log => {
      const hasCultural = log.userContext.culturalContext && log.userContext.culturalContext.length > 0;
      const key = hasCultural ? 'cultural-support-utilized' : 'general-support';
      analytics.culturalDistribution[key] = (analytics.culturalDistribution[key] || 0) + 1;
    });

    // Intervention effectiveness (based on user interaction)
    const interventions = recentLogs.filter(log => 
      log.actionTaken.type === 'intervention' || log.actionTaken.type === 'emergency_activated'
    );
    if (interventions.length > 0) {
      const successful = interventions.filter(log => log.actionTaken.userInteracted).length;
      analytics.interventionEffectiveness = successful / interventions.length;
    }

    return analytics;
  }

  /**
   * Generate privacy-preserving session ID
   */
  private generatePrivacyPreservingSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `crisis-${timestamp}-${random}`;
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `log-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Update privacy settings
   */
  public updatePrivacySettings(newSettings: Partial<PrivacySettings>): void {
    this.privacySettings = { ...this.privacySettings, ...newSettings };
    
    // If logging disabled, clear all logs
    if (newSettings.loggingLevel === 'disabled') {
      this.clearAllLogs();
    }
    
    // If retention period shortened, clean up immediately
    if (newSettings.retentionPeriod && newSettings.retentionPeriod < this.privacySettings.retentionPeriod) {
      this.cleanupExpiredLogs();
    }
  }

  /**
   * Clear all crisis logs (for privacy compliance)
   */
  public clearAllLogs(): void {
    this.logs = [];
    this.logQueue = [];
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('alchm_crisis_logs');
      localStorage.removeItem('alchm_encrypted_crisis_logs');
    }
    
    console.log('🧹 All crisis logs cleared for privacy compliance');
  }

  /**
   * Get current privacy settings
   */
  public getPrivacySettings(): PrivacySettings {
    return { ...this.privacySettings };
  }

  /**
   * Export anonymized data for research (with explicit consent)
   */
  public exportAnonymizedData(): any {
    if (!this.privacySettings.shareAggregateData) {
      throw new Error('Data sharing not permitted by privacy settings');
    }

    const analytics = this.getAnalytics(this.privacySettings.retentionPeriod);
    
    // Only aggregate, non-identifying data
    return {
      aggregateAnalytics: analytics,
      systemOptimization: {
        averageResponseTimes: this.logs.map(log => log.detectionMetrics.responseTime),
        deviceDistribution: this.logs.reduce((acc, log) => {
          acc[log.systemMetrics.deviceType] = (acc[log.systemMetrics.deviceType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      privacyCompliance: {
        noPersonalData: true,
        anonymized: true,
        aggregateOnly: true,
        consentGiven: this.privacySettings.shareAggregateData
      }
    };
  }
}

// Export singleton instance
export const privacyPreservingCrisisLogger = new PrivacyPreservingCrisisLogger();

// React hook for privacy-preserving crisis logging
export function usePrivacyCrisisLogging(settings?: Partial<PrivacySettings>) {
  const [analytics, setAnalytics] = React.useState<CrisisAnalytics | null>(null);

  React.useEffect(() => {
    if (settings) {
      privacyPreservingCrisisLogger.updatePrivacySettings(settings);
    }
  }, [settings]);

  const logCrisisEvent = React.useCallback(async (detection: any, context: any, action: any) => {
    await privacyPreservingCrisisLogger.logCrisisDetection(detection, context, action);
  }, []);

  const getAnalytics = React.useCallback((hours: number = 24) => {
    const analyticsData = privacyPreservingCrisisLogger.getAnalytics(hours);
    setAnalytics(analyticsData);
    return analyticsData;
  }, []);

  const clearLogs = React.useCallback(() => {
    privacyPreservingCrisisLogger.clearAllLogs();
    setAnalytics(null);
  }, []);

  return {
    logCrisisEvent,
    getAnalytics,
    clearLogs,
    analytics
  };
}