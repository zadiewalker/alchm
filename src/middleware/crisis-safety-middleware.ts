/**
 * MISSION CRITICAL: Real-Time Crisis Safety Middleware
 * 
 * This middleware intercepts ALL user interactions before any business logic
 * and immediately suspends business metrics during crisis events to prioritize
 * user safety above all else.
 * 
 * LIFE-CRITICAL REQUIREMENT: Must complete analysis in <3 seconds
 * 
 * Every function in this file could save a life.
 */

import { NextRequest, NextResponse } from 'next/server';
import { crisisSafetyCoordinator } from '@/lib/crisis-safety-coordinator';
import { 
  crisisDetectionEngine, 
  type CrisisDetectionResult 
} from '@/lib/crisis-detection-engine';
import { analytics } from '@/lib/analytics';
import { logger } from '@/lib/logging';

// Crisis safety configuration
interface CrisisSafetyConfig {
  maxResponseTime: number; // milliseconds
  emergencyEscalationThreshold: number;
  businessMetricSuspensionLevel: 'medium' | 'high' | 'critical';
  realTimeMonitoringEnabled: boolean;
  professionalNotificationEnabled: boolean;
}

const CRISIS_SAFETY_CONFIG: CrisisSafetyConfig = {
  maxResponseTime: 3000, // 3 seconds maximum
  emergencyEscalationThreshold: 0.8,
  businessMetricSuspensionLevel: 'medium',
  realTimeMonitoringEnabled: true,
  professionalNotificationEnabled: true
};

// Crisis override states
type CrisisOverrideState = 
  | 'normal_operation'
  | 'business_metrics_suspended'
  | 'emergency_mode'
  | 'professional_escalation'
  | 'system_lockdown';

interface CrisisInterceptionResult {
  shouldContinue: boolean;
  overrideState: CrisisOverrideState;
  emergencyResponse?: NextResponse;
  businessMetricsSuspended: boolean;
  professionalNotificationTriggered: boolean;
  safetyOverrides: {
    suspendAnalytics: boolean;
    suspendGoals: boolean;
    suspendStreaks: boolean;
    suspendComparisons: boolean;
    enableEmergencyUI: boolean;
  };
}

/**
 * CORE CRISIS SAFETY MIDDLEWARE
 * 
 * Intercepts ALL user content before any business processing
 * Immediately suspends business metrics during crisis detection
 */
export class CrisisSafetyMiddleware {
  private static instance: CrisisSafetyMiddleware;
  private activeOverrides: Map<string, CrisisOverrideState> = new Map();
  private emergencyCache: Map<string, any> = new Map();
  private responseTimeMonitor: Map<string, number> = new Map();

  private constructor() {
    this.initializeEmergencyCache();
  }

  static getInstance(): CrisisSafetyMiddleware {
    if (!CrisisSafetyMiddleware.instance) {
      CrisisSafetyMiddleware.instance = new CrisisSafetyMiddleware();
    }
    return CrisisSafetyMiddleware.instance;
  }

  /**
   * LIFE-CRITICAL: Intercept all user interactions for crisis safety
   * 
   * This runs BEFORE any business logic and can override everything
   */
  async interceptUserInteraction(
    request: NextRequest,
    userContent?: string,
    userId?: string,
    sessionContext?: any
  ): Promise<CrisisInterceptionResult> {
    const interceptStartTime = Date.now();
    
    try {
      // Extract user content from various sources
      const contentToAnalyze = await this.extractUserContent(request, userContent);
      const extractedUserId = userId || await this.extractUserId(request);
      
      if (!contentToAnalyze || !extractedUserId) {
        return this.createNormalOperationResult();
      }

      // IMMEDIATE: Quick crisis check (< 100ms)
      const quickCheck = this.performQuickCrisisCheck(contentToAnalyze);
      
      if (!quickCheck.hasCrisisIndicators) {
        return this.createNormalOperationResult();
      }

      // URGENT: Enhanced crisis detection (< 2 seconds)
      const crisisResult = await this.performEnhancedCrisisDetection(
        contentToAnalyze,
        extractedUserId,
        sessionContext,
        interceptStartTime
      );

      // CRITICAL: Determine override level and response
      const overrideResult = await this.determineOverrideLevel(
        crisisResult,
        extractedUserId,
        interceptStartTime
      );

      // Validate response time
      const totalResponseTime = Date.now() - interceptStartTime;
      if (totalResponseTime > CRISIS_SAFETY_CONFIG.maxResponseTime) {
        logger.warn('Crisis safety response time exceeded', {
          responseTime: totalResponseTime,
          maxAllowed: CRISIS_SAFETY_CONFIG.maxResponseTime,
          userId: extractedUserId
        });
      }

      return overrideResult;

    } catch (error) {
      logger.error('Crisis safety middleware error - activating emergency fallback', error);
      
      // FAILSAFE: Always err on the side of safety
      return this.createEmergencyFallbackResult(userId);
    }
  }

  /**
   * IMMEDIATE: Quick crisis check using lightweight patterns
   */
  private performQuickCrisisCheck(content: string): { hasCrisisIndicators: boolean; urgentAction: boolean } {
    const normalizedContent = content.toLowerCase();
    
    // Emergency keywords that trigger immediate action
    const emergencyKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die',
      'going to hurt myself', 'have a plan', 'tonight',
      'overdose', 'pills', 'bridge', 'rope', 'gun'
    ];

    // Warning keywords that require enhanced detection
    const warningKeywords = [
      'hopeless', 'worthless', 'burden', 'trapped',
      'can\'t go on', 'better off dead', 'no point',
      'cutting', 'burning', 'hurting myself'
    ];

    const hasEmergencyKeywords = emergencyKeywords.some(keyword => 
      normalizedContent.includes(keyword)
    );

    const hasWarningKeywords = warningKeywords.some(keyword => 
      normalizedContent.includes(keyword)
    );

    return {
      hasCrisisIndicators: hasEmergencyKeywords || hasWarningKeywords,
      urgentAction: hasEmergencyKeywords
    };
  }

  /**
   * URGENT: Enhanced crisis detection with full analysis
   */
  private async performEnhancedCrisisDetection(
    content: string,
    userId: string,
    sessionContext: any,
    startTime: number
  ): Promise<CrisisDetectionResult> {
    try {
      // Use existing crisis detection engine
      const result = await crisisDetectionEngine.analyzeContent(
        content,
        userId,
        'middleware_intercept'
      );

      // Add response time tracking
      const responseTime = Date.now() - startTime;
      this.responseTimeMonitor.set(userId, responseTime);

      return result;

    } catch (error) {
      logger.error('Enhanced crisis detection failed', error);
      
      // Return safe fallback result
      return {
        detected: true,
        severity: 'high',
        categories: ['system_error'],
        confidence: 0.9,
        triggers: ['detection_failure'],
        intervention: null,
        needsImmediateAttention: true
      };
    }
  }

  /**
   * CRITICAL: Determine override level and business metric suspension
   */
  private async determineOverrideLevel(
    crisisResult: CrisisDetectionResult,
    userId: string,
    startTime: number
  ): Promise<CrisisInterceptionResult> {
    const { severity, confidence, needsImmediateAttention } = crisisResult;
    
    // Determine override state based on crisis severity
    let overrideState: CrisisOverrideState = 'normal_operation';
    let businessMetricsSuspended = false;
    let professionalNotificationTriggered = false;
    
    // Business metric suspension logic
    if (severity === 'critical') {
      overrideState = 'system_lockdown';
      businessMetricsSuspended = true;
      professionalNotificationTriggered = true;
    } else if (severity === 'high' || needsImmediateAttention) {
      overrideState = 'emergency_mode';
      businessMetricsSuspended = true;
      professionalNotificationTriggered = confidence > CRISIS_SAFETY_CONFIG.emergencyEscalationThreshold;
    } else if (severity === 'medium' && confidence > 0.7) {
      overrideState = 'business_metrics_suspended';
      businessMetricsSuspended = true;
    }

    // Store override state
    this.activeOverrides.set(userId, overrideState);

    // Suspend business metrics if needed
    if (businessMetricsSuspended) {
      await this.suspendBusinessMetrics(userId, severity);
    }

    // Trigger professional notification if needed
    if (professionalNotificationTriggered) {
      await this.triggerProfessionalNotification(userId, crisisResult);
    }

    // Create emergency response if system lockdown
    let emergencyResponse: NextResponse | undefined;
    if (overrideState === 'system_lockdown') {
      emergencyResponse = await this.createEmergencyResponse(userId, crisisResult);
    }

    return {
      shouldContinue: overrideState !== 'system_lockdown',
      overrideState,
      emergencyResponse,
      businessMetricsSuspended,
      professionalNotificationTriggered,
      safetyOverrides: this.createSafetyOverrides(severity, businessMetricsSuspended)
    };
  }

  /**
   * BUSINESS METRIC SUSPENSION: Override all business logic during crisis
   */
  private async suspendBusinessMetrics(userId: string, severity: string): Promise<void> {
    try {
      // Suspend analytics collection
      await analytics.suspendAnalytics(userId, {
        reason: 'crisis_safety_override',
        severity,
        timestamp: Date.now()
      });

      // Store suspension state in cache
      this.emergencyCache.set(`business_metrics_suspended_${userId}`, {
        severity,
        timestamp: Date.now(),
        suspended: true
      });

      logger.info('Business metrics suspended for crisis safety', {
        userId,
        severity,
        timestamp: Date.now()
      });

    } catch (error) {
      logger.error('Failed to suspend business metrics', error);
    }
  }

  /**
   * PROFESSIONAL ESCALATION: Automated notification system
   */
  private async triggerProfessionalNotification(
    userId: string,
    crisisResult: CrisisDetectionResult
  ): Promise<void> {
    if (!CRISIS_SAFETY_CONFIG.professionalNotificationEnabled) {
      return;
    }

    try {
      // This would integrate with your professional notification system
      // For now, we'll create a high-priority alert
      const escalationData = {
        userId,
        severity: crisisResult.severity,
        confidence: crisisResult.confidence,
        triggers: crisisResult.triggers,
        timestamp: Date.now(),
        requiresImmedateAttention: crisisResult.needsImmediateAttention
      };

      // Store for professional review system
      this.emergencyCache.set(`professional_notification_${userId}`, escalationData);

      logger.error('CRISIS ESCALATION TRIGGERED', {
        userId,
        severity: crisisResult.severity,
        confidence: crisisResult.confidence,
        timestamp: Date.now()
      });

    } catch (error) {
      logger.error('Failed to trigger professional notification', error);
    }
  }

  /**
   * EMERGENCY RESPONSE: Create crisis-safe interface
   */
  private async createEmergencyResponse(
    userId: string,
    crisisResult: CrisisDetectionResult
  ): NextResponse {
    try {
      // Create emergency interface redirect
      const emergencyUrl = `/emergency-safe?severity=${crisisResult.severity}&userId=${userId}`;
      const response = NextResponse.redirect(emergencyUrl);

      // Add crisis safety headers
      response.headers.set('X-Crisis-Safety-Override', 'true');
      response.headers.set('X-Crisis-Severity', crisisResult.severity);
      response.headers.set('X-Emergency-Response-Time', Date.now().toString());
      response.headers.set('X-Business-Metrics-Suspended', 'true');

      return response;

    } catch (error) {
      logger.error('Failed to create emergency response', error);
      
      // Fallback to basic emergency page
      return NextResponse.redirect('/emergency-safe');
    }
  }

  /**
   * Create safety overrides for different crisis levels
   */
  private createSafetyOverrides(severity: string, businessMetricsSuspended: boolean) {
    const baseOverrides = {
      suspendAnalytics: businessMetricsSuspended,
      suspendGoals: businessMetricsSuspended,
      suspendStreaks: severity === 'critical' || severity === 'high',
      suspendComparisons: businessMetricsSuspended,
      enableEmergencyUI: severity === 'critical'
    };

    return baseOverrides;
  }

  /**
   * Helper methods
   */
  private async extractUserContent(request: NextRequest, providedContent?: string): Promise<string | null> {
    if (providedContent) {
      return providedContent;
    }

    // Extract from request body if it's a POST/PUT request
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const body = await request.clone().json();
        return body.content || body.text || body.message || null;
      } catch {
        return null;
      }
    }

    // Extract from query parameters
    const url = new URL(request.url);
    return url.searchParams.get('content') || url.searchParams.get('text') || null;
  }

  private async extractUserId(request: NextRequest): Promise<string | null> {
    // Extract from session cookie
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    if (sessionCookie) {
      try {
        // Decode session to get user ID
        // This would depend on your session implementation
        return 'extracted_user_id'; // Placeholder
      } catch {
        return null;
      }
    }

    // Extract from headers or other sources
    return request.headers.get('x-user-id') || null;
  }

  private createNormalOperationResult(): CrisisInterceptionResult {
    return {
      shouldContinue: true,
      overrideState: 'normal_operation',
      businessMetricsSuspended: false,
      professionalNotificationTriggered: false,
      safetyOverrides: {
        suspendAnalytics: false,
        suspendGoals: false,
        suspendStreaks: false,
        suspendComparisons: false,
        enableEmergencyUI: false
      }
    };
  }

  private createEmergencyFallbackResult(userId?: string): CrisisInterceptionResult {
    return {
      shouldContinue: false,
      overrideState: 'system_lockdown',
      businessMetricsSuspended: true,
      professionalNotificationTriggered: true,
      safetyOverrides: {
        suspendAnalytics: true,
        suspendGoals: true,
        suspendStreaks: true,
        suspendComparisons: true,
        enableEmergencyUI: true
      }
    };
  }

  private initializeEmergencyCache(): void {
    // Preload emergency resources
    this.emergencyCache.set('emergency_resources', {
      crisis_hotline: '988',
      crisis_text: '741741',
      emergency_services: '911',
      loaded_at: Date.now()
    });
  }

  /**
   * Public API methods
   */
  
  // Check if user has active crisis override
  hasActiveCrisisOverride(userId: string): boolean {
    const overrideState = this.activeOverrides.get(userId);
    return overrideState !== undefined && overrideState !== 'normal_operation';
  }

  // Get current override state
  getCrisisOverrideState(userId: string): CrisisOverrideState {
    return this.activeOverrides.get(userId) || 'normal_operation';
  }

  // Clear crisis override (when user is safe)
  clearCrisisOverride(userId: string): void {
    this.activeOverrides.delete(userId);
    this.emergencyCache.delete(`business_metrics_suspended_${userId}`);
    this.responseTimeMonitor.delete(userId);
  }

  // Check if business metrics are suspended
  areBusinessMetricsSuspended(userId: string): boolean {
    return this.emergencyCache.has(`business_metrics_suspended_${userId}`);
  }

  // Get emergency cache data
  getEmergencyData(key: string): any {
    return this.emergencyCache.get(key);
  }

  // Health check for monitoring
  healthCheck(): {
    status: 'healthy' | 'degraded' | 'critical';
    activeOverrides: number;
    averageResponseTime: number;
    emergencyCacheSize: number;
  } {
    const responseTimes = Array.from(this.responseTimeMonitor.values());
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    const status = averageResponseTime > CRISIS_SAFETY_CONFIG.maxResponseTime 
      ? 'degraded' 
      : 'healthy';

    return {
      status,
      activeOverrides: this.activeOverrides.size,
      averageResponseTime,
      emergencyCacheSize: this.emergencyCache.size
    };
  }
}

// Export singleton instance
export const crisisSafetyMiddleware = CrisisSafetyMiddleware.getInstance();

// Export types
export type { 
  CrisisInterceptionResult, 
  CrisisOverrideState, 
  CrisisSafetyConfig 
};