/**
 * ALCHM Privacy-Preserving Crashlytics Integration
 * 
 * Trauma-informed crash reporting that protects sensitive journal content
 * while providing actionable crash data for improving user safety.
 */

import { Capacitor } from '@capacitor/core';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';

interface CrashContext {
  appSection: 'authentication' | 'dashboard' | 'journal' | 'crisis' | 'settings' | 'pathways';
  userTier: 'free' | 'premium' | 'unlimited';
  crisisMode: boolean;
  offlineMode: boolean;
  authenticationState: 'authenticated' | 'unauthenticated' | 'unknown';
}

interface PrivacySettings {
  collectCrashData: boolean;
  includePerformanceData: boolean;
  anonymizeUserData: boolean;
  excludeJournalContent: boolean;
  crisisContextOnly: boolean;
}

class PrivacyPreservingCrashlytics {
  private isInitialized = false;
  private privacySettings: PrivacySettings = {
    collectCrashData: true,
    includePerformanceData: true,
    anonymizeUserData: true,
    excludeJournalContent: true,
    crisisContextOnly: true
  };

  /**
   * Initialize privacy-preserving Crashlytics
   */
  async initialize(privacySettings?: Partial<PrivacySettings>): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('🔧 Crashlytics not available on web platform');
      return;
    }

    try {
      // Merge privacy settings
      if (privacySettings) {
        this.privacySettings = { ...this.privacySettings, ...privacySettings };
      }

      // Only initialize if user has consented to crash data collection
      if (!this.privacySettings.collectCrashData) {
        console.log('🔒 Crashlytics disabled by user privacy settings');
        return;
      }

      // Set data collection preferences
      await FirebaseCrashlytics.setEnabled({ 
        enabled: this.privacySettings.collectCrashData 
      });

      // Configure privacy-first custom keys
      await this.setInitialCustomKeys();

      this.isInitialized = true;
      console.log('✅ Privacy-preserving Crashlytics initialized');

    } catch (error) {
      console.error('❌ Failed to initialize Crashlytics:', error);
      // Fail silently to avoid impacting user experience
    }
  }

  /**
   * Set trauma-informed context for crash reports
   */
  async setContext(context: Partial<CrashContext>): Promise<void> {
    if (!this.isInitialized) return;

    try {
      const safeContext: Record<string, string> = {};

      // Only set non-sensitive context data
      if (context.appSection) {
        safeContext.app_section = context.appSection;
      }

      if (context.userTier) {
        safeContext.user_tier = context.userTier;
      }

      if (typeof context.crisisMode === 'boolean') {
        safeContext.crisis_mode = context.crisisMode.toString();
      }

      if (typeof context.offlineMode === 'boolean') {
        safeContext.offline_mode = context.offlineMode.toString();
      }

      if (context.authenticationState) {
        safeContext.auth_state = context.authenticationState;
      }

      // Set custom keys without sensitive information
      for (const [key, value] of Object.entries(safeContext)) {
        await FirebaseCrashlytics.setCustomKey({
          key,
          value,
          type: 'string'
        });
      }

    } catch (error) {
      console.error('❌ Failed to set Crashlytics context:', error);
    }
  }

  /**
   * Log trauma-informed breadcrumb (no sensitive content)
   */
  async logBreadcrumb(
    message: string, 
    category: 'navigation' | 'authentication' | 'sync' | 'performance' | 'crisis'
  ): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // Filter out sensitive information from breadcrumbs
      const sanitizedMessage = this.sanitizeMessage(message);
      
      await FirebaseCrashlytics.log({
        message: `[${category.toUpperCase()}] ${sanitizedMessage}`
      });

    } catch (error) {
      console.error('❌ Failed to log breadcrumb:', error);
    }
  }

  /**
   * Record non-fatal error with privacy protection
   */
  async recordError(
    error: Error, 
    context?: { action: string; userImpact: 'low' | 'medium' | 'high' | 'critical' }
  ): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // Enhanced error with context but no sensitive data
      const enhancedError = new Error(
        this.sanitizeErrorMessage(error.message)
      );
      enhancedError.name = error.name;
      enhancedError.stack = this.sanitizeStackTrace(error.stack || '');

      // Set temporary context for this error
      if (context) {
        await FirebaseCrashlytics.setCustomKey({
          key: 'last_action',
          value: context.action,
          type: 'string'
        });

        await FirebaseCrashlytics.setCustomKey({
          key: 'user_impact',
          value: context.userImpact,
          type: 'string'
        });
      }

      // Record the sanitized error
      await FirebaseCrashlytics.recordException({
        message: enhancedError.message,
        code: 0,
        domain: enhancedError.name
      });

    } catch (crashlyticsError) {
      console.error('❌ Failed to record error:', crashlyticsError);
    }
  }

  /**
   * Handle crisis scenario errors with special priority
   */
  async recordCrisisError(error: Error, crisisType: 'panic' | 'emergency' | 'resource_access'): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // Crisis errors get highest priority
      await FirebaseCrashlytics.setCustomKey({
        key: 'crisis_type',
        value: crisisType,
        type: 'string'
      });

      await FirebaseCrashlytics.setCustomKey({
        key: 'crisis_priority',
        value: 'critical',
        type: 'string'
      });

      // Record crisis error with anonymized details
      await this.recordError(error, {
        action: `crisis_${crisisType}`,
        userImpact: 'critical'
      });

      // Log crisis breadcrumb
      await this.logBreadcrumb(
        `Crisis scenario error: ${crisisType}`,
        'crisis'
      );

    } catch (crashlyticsError) {
      console.error('❌ Failed to record crisis error:', crashlyticsError);
    }
  }

  /**
   * Set user identifier (anonymized)
   */
  async setUserId(userId: string): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // Hash user ID to protect privacy
      const anonymizedUserId = await this.anonymizeUserId(userId);
      
      await FirebaseCrashlytics.setUserId({
        userId: anonymizedUserId
      });

    } catch (error) {
      console.error('❌ Failed to set user ID:', error);
    }
  }

  /**
   * Disable crash reporting for sensitive operations
   */
  async temporarilyDisable(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      await FirebaseCrashlytics.setEnabled({ enabled: false });
    } catch (error) {
      console.error('❌ Failed to disable Crashlytics:', error);
    }
  }

  /**
   * Re-enable crash reporting after sensitive operations
   */
  async reenable(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      if (this.privacySettings.collectCrashData) {
        await FirebaseCrashlytics.setEnabled({ enabled: true });
      }
    } catch (error) {
      console.error('❌ Failed to re-enable Crashlytics:', error);
    }
  }

  // Private helper methods

  private async setInitialCustomKeys(): Promise<void> {
    const initialKeys = {
      app_version: '1.0.0',
      privacy_mode: 'trauma_informed',
      data_collection: 'anonymized',
      journal_content: 'excluded'
    };

    for (const [key, value] of Object.entries(initialKeys)) {
      await FirebaseCrashlytics.setCustomKey({
        key,
        value,
        type: 'string'
      });
    }
  }

  private sanitizeMessage(message: string): string {
    // Remove potential journal content, personal information, etc.
    const sensitivePatterns = [
      /journal|diary|personal|feeling|emotion|trauma|abuse|self-harm/gi,
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // emails
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSNs
      /\b\d{10,}\b/g // phone numbers
    ];

    let sanitized = message;
    for (const pattern of sensitivePatterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }

    return sanitized.substring(0, 200); // Limit length
  }

  private sanitizeErrorMessage(message: string): string {
    return this.sanitizeMessage(message);
  }

  private sanitizeStackTrace(stackTrace: string): string {
    // Remove file paths that might contain sensitive information
    return stackTrace
      .replace(/\/Users\/[^\/]+/g, '/Users/[USER]')
      .replace(/\/home\/[^\/]+/g, '/home/[USER]')
      .replace(/C:\\Users\\[^\\]+/g, 'C:\\Users\\[USER]');
  }

  private async anonymizeUserId(userId: string): Promise<string> {
    // Simple hash function for anonymization
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `user_${Math.abs(hash).toString(16)}`;
  }
}

// Export singleton instance
export const privacyPreservingCrashlytics = new PrivacyPreservingCrashlytics();

// Export types for use in other modules
export type { CrashContext, PrivacySettings };