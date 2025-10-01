/**
 * EMERGENCY AUTHENTICATION BYPASS
 * 
 * CRITICAL SAFETY FEATURE: Allows crisis resource access without authentication
 * Ensures users in crisis can access life-saving resources even when
 * authentication systems fail or are unavailable.
 */

import { z } from 'zod';

// Emergency session configuration
export const EmergencySessionConfig = z.object({
  sessionDuration: z.number().default(30 * 60 * 1000), // 30 minutes
  maxEmergencySessions: z.number().default(10),
  enableLogging: z.boolean().default(true),
  requireReasonCode: z.boolean().default(false),
  allowMultipleDevices: z.boolean().default(true),
  emergencyResourcesOnly: z.boolean().default(true)
});

// Emergency session data
export const EmergencySession = z.object({
  sessionId: z.string(),
  deviceFingerprint: z.string(),
  createdAt: z.date(),
  expiresAt: z.date(),
  reasonCode: z.enum(['auth_failure', 'crisis_urgent', 'system_down', 'user_request']).optional(),
  accessLevel: z.enum(['crisis_resources_only', 'basic_features', 'full_emergency']),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  geoLocation: z.object({
    country: z.string().optional(),
    region: z.string().optional(),
    coordinates: z.tuple([z.number(), z.number()]).optional()
  }).optional(),
  resourcesAccessed: z.array(z.string()).default([]),
  isActive: z.boolean().default(true)
});

export type EmergencySessionConfigType = z.infer<typeof EmergencySessionConfig>;
export type EmergencySessionType = z.infer<typeof EmergencySession>;

/**
 * Emergency Authentication Bypass Manager
 * 
 * Provides secure, temporary access to crisis resources when normal
 * authentication is unavailable or when users need immediate help
 */
export class EmergencyAuthBypass {
  private config: EmergencySessionConfigType;
  private activeSessions: Map<string, EmergencySessionType> = new Map();
  private deviceSessions: Map<string, string[]> = new Map(); // device -> sessionIds
  private cleanupInterval: NodeJS.Timer | null = null;
  
  constructor(config: Partial<EmergencySessionConfigType> = {}) {
    this.config = EmergencySessionConfig.parse(config);
    this.startCleanupInterval();
  }

  /**
   * CRITICAL FUNCTION: Create emergency session for crisis access
   * 
   * @param reason - Reason for emergency access
   * @param deviceInfo - Device fingerprinting information
   * @returns Emergency session details
   */
  public createEmergencySession(
    reason: 'auth_failure' | 'crisis_urgent' | 'system_down' | 'user_request',
    deviceInfo: {
      userAgent: string;
      ipAddress?: string;
      coordinates?: [number, number];
    }
  ): {
    success: boolean;
    sessionId?: string;
    accessToken?: string;
    expiresAt?: Date;
    availableResources: string[];
    errorCode?: string;
  } {
    try {
      // Generate device fingerprint
      const deviceFingerprint = this.generateDeviceFingerprint(deviceInfo);
      
      // Check device session limits
      const existingSessions = this.deviceSessions.get(deviceFingerprint) || [];
      if (existingSessions.length >= this.config.maxEmergencySessions) {
        // Clean expired sessions first
        this.cleanupExpiredSessions();
        
        const activeSessionsForDevice = existingSessions.filter(sessionId =>
          this.activeSessions.has(sessionId) && this.activeSessions.get(sessionId)!.isActive
        );
        
        if (activeSessionsForDevice.length >= this.config.maxEmergencySessions) {
          return {
            success: false,
            availableResources: [],
            errorCode: 'max_sessions_exceeded'
          };
        }
      }

      // Generate session
      const sessionId = this.generateSessionId();
      const expiresAt = new Date(Date.now() + this.config.sessionDuration);
      const accessLevel = this.determineAccessLevel(reason);

      const emergencySession: EmergencySessionType = {
        sessionId,
        deviceFingerprint,
        createdAt: new Date(),
        expiresAt,
        reasonCode: reason,
        accessLevel,
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        geoLocation: {
          coordinates: deviceInfo.coordinates
        },
        resourcesAccessed: [],
        isActive: true
      };

      // Store session
      this.activeSessions.set(sessionId, emergencySession);
      
      // Update device sessions
      const deviceSessionsList = this.deviceSessions.get(deviceFingerprint) || [];
      deviceSessionsList.push(sessionId);
      this.deviceSessions.set(deviceFingerprint, deviceSessionsList);

      // Log emergency session creation (privacy-preserving)
      if (this.config.enableLogging) {
        this.logEmergencyAccess('session_created', {
          sessionId: sessionId.substring(0, 8),
          reason,
          accessLevel,
          deviceHash: this.hashDeviceFingerprint(deviceFingerprint)
        });
      }

      // Generate access token
      const accessToken = this.generateAccessToken(sessionId);
      const availableResources = this.getAvailableResources(accessLevel);

      return {
        success: true,
        sessionId,
        accessToken,
        expiresAt,
        availableResources
      };

    } catch (error) {
      console.error('[Emergency Auth Bypass] Failed to create emergency session:', error);
      
      return {
        success: false,
        availableResources: this.getCriticalEmergencyResources(),
        errorCode: 'session_creation_failed'
      };
    }
  }

  /**
   * Validate emergency session and access token
   */
  public validateEmergencySession(sessionId: string, accessToken: string): {
    isValid: boolean;
    session?: EmergencySessionType;
    timeRemaining?: number;
    accessLevel?: string;
    errorCode?: string;
  } {
    try {
      // Check if session exists
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return {
          isValid: false,
          errorCode: 'session_not_found'
        };
      }

      // Check if session is active
      if (!session.isActive) {
        return {
          isValid: false,
          errorCode: 'session_inactive'
        };
      }

      // Check expiration
      if (new Date() > session.expiresAt) {
        session.isActive = false;
        return {
          isValid: false,
          errorCode: 'session_expired'
        };
      }

      // Validate access token
      const expectedToken = this.generateAccessToken(sessionId);
      if (accessToken !== expectedToken) {
        return {
          isValid: false,
          errorCode: 'invalid_token'
        };
      }

      const timeRemaining = session.expiresAt.getTime() - Date.now();

      return {
        isValid: true,
        session,
        timeRemaining,
        accessLevel: session.accessLevel
      };

    } catch (error) {
      console.error('[Emergency Auth Bypass] Session validation error:', error);
      
      return {
        isValid: false,
        errorCode: 'validation_error'
      };
    }
  }

  /**
   * Track resource access for emergency session
   */
  public trackResourceAccess(sessionId: string, resourceId: string): boolean {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session || !session.isActive) {
        return false;
      }

      // Add to accessed resources
      if (!session.resourcesAccessed.includes(resourceId)) {
        session.resourcesAccessed.push(resourceId);
      }

      // Log resource access
      if (this.config.enableLogging) {
        this.logEmergencyAccess('resource_accessed', {
          sessionId: sessionId.substring(0, 8),
          resourceId,
          accessLevel: session.accessLevel
        });
      }

      return true;

    } catch (error) {
      console.error('[Emergency Auth Bypass] Failed to track resource access:', error);
      return false;
    }
  }

  /**
   * Extend emergency session (for ongoing crisis situations)
   */
  public extendEmergencySession(sessionId: string, additionalTime: number = 30 * 60 * 1000): {
    success: boolean;
    newExpiresAt?: Date;
    errorCode?: string;
  } {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          errorCode: 'session_not_found'
        };
      }

      if (!session.isActive) {
        return {
          success: false,
          errorCode: 'session_inactive'
        };
      }

      // Extend session
      const newExpiresAt = new Date(session.expiresAt.getTime() + additionalTime);
      session.expiresAt = newExpiresAt;

      // Log extension
      if (this.config.enableLogging) {
        this.logEmergencyAccess('session_extended', {
          sessionId: sessionId.substring(0, 8),
          newExpiresAt
        });
      }

      return {
        success: true,
        newExpiresAt
      };

    } catch (error) {
      console.error('[Emergency Auth Bypass] Failed to extend session:', error);
      return {
        success: false,
        errorCode: 'extension_failed'
      };
    }
  }

  /**
   * Terminate emergency session
   */
  public terminateEmergencySession(sessionId: string): boolean {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return false;
      }

      // Mark as inactive
      session.isActive = false;

      // Log termination
      if (this.config.enableLogging) {
        this.logEmergencyAccess('session_terminated', {
          sessionId: sessionId.substring(0, 8),
          duration: Date.now() - session.createdAt.getTime(),
          resourcesAccessed: session.resourcesAccessed.length
        });
      }

      // Remove from active sessions after a delay (for audit purposes)
      setTimeout(() => {
        this.activeSessions.delete(sessionId);
        this.removeFromDeviceSessions(session.deviceFingerprint, sessionId);
      }, 60 * 1000); // 1 minute delay

      return true;

    } catch (error) {
      console.error('[Emergency Auth Bypass] Failed to terminate session:', error);
      return false;
    }
  }

  /**
   * Get critical emergency resources (always accessible)
   */
  public getCriticalEmergencyResources(): string[] {
    return [
      'crisis_hotline_988',
      'crisis_text_741741',
      'emergency_911',
      'trevor_project',
      'trans_lifeline',
      'crisis_resources_directory',
      'emergency_contacts_template',
      'safety_plan_guide'
    ];
  }

  /**
   * Check if emergency access is available for device
   */
  public isEmergencyAccessAvailable(deviceFingerprint: string): {
    available: boolean;
    sessionsUsed: number;
    maxSessions: number;
    cooldownRemaining?: number;
  } {
    const existingSessions = this.deviceSessions.get(deviceFingerprint) || [];
    const activeSessions = existingSessions.filter(sessionId => {
      const session = this.activeSessions.get(sessionId);
      return session && session.isActive && new Date() < session.expiresAt;
    });

    return {
      available: activeSessions.length < this.config.maxEmergencySessions,
      sessionsUsed: activeSessions.length,
      maxSessions: this.config.maxEmergencySessions
    };
  }

  /**
   * Get emergency session statistics (for monitoring)
   */
  public getEmergencyStats(): {
    activeSessions: number;
    totalSessionsCreated: number;
    averageSessionDuration: number;
    mostAccessedResources: string[];
    emergencyAccessReasons: Record<string, number>;
  } {
    const activeSessionsCount = Array.from(this.activeSessions.values())
      .filter(session => session.isActive).length;

    // This would typically come from a database or persistent storage
    // For now, return current session data
    const sessions = Array.from(this.activeSessions.values());
    const reasonCounts: Record<string, number> = {};
    const resourceCounts: Record<string, number> = {};
    let totalDuration = 0;

    sessions.forEach(session => {
      if (session.reasonCode) {
        reasonCounts[session.reasonCode] = (reasonCounts[session.reasonCode] || 0) + 1;
      }

      session.resourcesAccessed.forEach(resource => {
        resourceCounts[resource] = (resourceCounts[resource] || 0) + 1;
      });

      const duration = session.isActive 
        ? Date.now() - session.createdAt.getTime()
        : session.expiresAt.getTime() - session.createdAt.getTime();
      totalDuration += duration;
    });

    const averageSessionDuration = sessions.length > 0 ? totalDuration / sessions.length : 0;
    const mostAccessedResources = Object.entries(resourceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([resource]) => resource);

    return {
      activeSessions: activeSessionsCount,
      totalSessionsCreated: sessions.length,
      averageSessionDuration,
      mostAccessedResources,
      emergencyAccessReasons: reasonCounts
    };
  }

  /**
   * Private helper methods
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `emg_${timestamp}_${random}`;
  }

  private generateAccessToken(sessionId: string): string {
    // In a real implementation, this would use proper cryptographic signing
    const secret = process.env.EMERGENCY_SESSION_SECRET || 'emergency-secret-key';
    const payload = `${sessionId}-${secret}`;
    
    // Simple hash for demo - use proper JWT/signing in production
    const hash = Buffer.from(payload).toString('base64');
    return hash;
  }

  private generateDeviceFingerprint(deviceInfo: { userAgent: string; ipAddress?: string }): string {
    const components = [
      deviceInfo.userAgent,
      deviceInfo.ipAddress || 'unknown'
    ].join('|');
    
    return Buffer.from(components).toString('base64').substring(0, 32);
  }

  private hashDeviceFingerprint(fingerprint: string): string {
    // Simple hash for privacy
    return Buffer.from(fingerprint).toString('base64').substring(0, 16);
  }

  private determineAccessLevel(reason: string): EmergencySessionType['accessLevel'] {
    switch (reason) {
      case 'crisis_urgent':
        return 'full_emergency';
      case 'auth_failure':
      case 'system_down':
        return 'crisis_resources_only';
      case 'user_request':
        return 'basic_features';
      default:
        return 'crisis_resources_only';
    }
  }

  private getAvailableResources(accessLevel: string): string[] {
    const crisisResources = this.getCriticalEmergencyResources();
    
    switch (accessLevel) {
      case 'full_emergency':
        return [
          ...crisisResources,
          'journal_emergency_entry',
          'crisis_chat_support',
          'emergency_contact_notification'
        ];
      case 'basic_features':
        return [
          ...crisisResources,
          'basic_journal_entry',
          'resource_directory'
        ];
      case 'crisis_resources_only':
      default:
        return crisisResources;
    }
  }

  private startCleanupInterval(): void {
    // Clean up expired sessions every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    const expiredSessions: string[] = [];

    this.activeSessions.forEach((session, sessionId) => {
      if (now > session.expiresAt) {
        session.isActive = false;
        expiredSessions.push(sessionId);
      }
    });

    expiredSessions.forEach(sessionId => {
      const session = this.activeSessions.get(sessionId);
      if (session) {
        this.removeFromDeviceSessions(session.deviceFingerprint, sessionId);
      }
      this.activeSessions.delete(sessionId);
    });

    if (expiredSessions.length > 0) {
      console.log(`[Emergency Auth Bypass] Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }

  private removeFromDeviceSessions(deviceFingerprint: string, sessionId: string): void {
    const sessions = this.deviceSessions.get(deviceFingerprint);
    if (sessions) {
      const index = sessions.indexOf(sessionId);
      if (index > -1) {
        sessions.splice(index, 1);
        if (sessions.length === 0) {
          this.deviceSessions.delete(deviceFingerprint);
        }
      }
    }
  }

  private logEmergencyAccess(event: string, details: any): void {
    // Privacy-preserving logging
    const logEntry = {
      event,
      timestamp: new Date().toISOString(),
      details: {
        ...details,
        // Remove any sensitive information
        userAgent: undefined,
        ipAddress: undefined
      }
    };

    console.log('[Emergency Auth Bypass]', JSON.stringify(logEntry));
  }

  /**
   * Health check and monitoring
   */
  public healthCheck(): {
    status: 'healthy' | 'degraded' | 'critical';
    activeSessions: number;
    sessionCreationRate: number;
    systemLoad: number;
  } {
    const activeSessions = Array.from(this.activeSessions.values())
      .filter(session => session.isActive && new Date() < session.expiresAt).length;

    // Simple health assessment
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (activeSessions > this.config.maxEmergencySessions * 0.8) {
      status = 'degraded';
    }
    if (activeSessions >= this.config.maxEmergencySessions) {
      status = 'critical';
    }

    return {
      status,
      activeSessions,
      sessionCreationRate: 0, // Would be calculated from historical data
      systemLoad: activeSessions / this.config.maxEmergencySessions
    };
  }

  /**
   * Cleanup and shutdown
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Terminate all active sessions
    this.activeSessions.forEach((_, sessionId) => {
      this.terminateEmergencySession(sessionId);
    });

    console.log('[Emergency Auth Bypass] Destroyed');
  }
}

// Export singleton instance
export const emergencyAuthBypass = new EmergencyAuthBypass({
  sessionDuration: 30 * 60 * 1000, // 30 minutes
  maxEmergencySessions: 10,
  enableLogging: true,
  requireReasonCode: false,
  allowMultipleDevices: true,
  emergencyResourcesOnly: false
});

// Export emergency session creation function for immediate use
export function createEmergencySession(reason: 'crisis_urgent' | 'auth_failure' = 'crisis_urgent') {
  const deviceInfo = {
    userAgent: typeof typeof window !== 'undefined' && navigator !== 'undefined' ? typeof window !== 'undefined' && navigator.userAgent : 'unknown',
    ipAddress: undefined // Would be detected server-side
  };

  return emergencyAuthBypass.createEmergencySession(reason, deviceInfo);
}