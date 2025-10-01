/**
 * Mobile Crisis Authentication System
 * 
 * Specialized authentication system for mobile users in crisis situations:
 * - Multiple fallback authentication methods
 * - Trauma-informed error handling
 * - Crisis-responsive UI adaptations
 * - Offline crisis resource access
 * - Emergency contact integration
 */

import { emergencyAuthBypass } from '@/lib/crisis/emergency-authentication-bypass';

export interface MobileCrisisAuthConfig {
  enableGuestAccess: boolean;
  crisisKeywordDetection: boolean;
  offlineResourceAccess: boolean;
  emergencyContactIntegration: boolean;
  adaptiveUIForDistress: boolean;
  hapticFeedback: boolean;
}

export interface MobileCrisisSession {
  sessionType: 'authenticated' | 'guest' | 'emergency';
  userId?: string;
  guestId?: string;
  crisisLevel?: 'mild' | 'moderate' | 'severe' | 'critical';
  supportAccess: string[];
  sessionStartTime: string;
  lastActivity: string;
  mobileCapabilities: {
    hapticSupport: boolean;
    offlineSupport: boolean;
    geolocationAccess: boolean;
    cameraAccess: boolean;
    microphoneAccess: boolean;
  };
}

export class MobileCrisisAuthenticationSystem {
  private config: MobileCrisisAuthConfig;
  private activeMobileSessions: Map<string, MobileCrisisSession> = new Map();

  constructor(config: Partial<MobileCrisisAuthConfig> = {}) {
    this.config = {
      enableGuestAccess: true,
      crisisKeywordDetection: true,
      offlineResourceAccess: true,
      emergencyContactIntegration: true,
      adaptiveUIForDistress: true,
      hapticFeedback: true,
      ...config
    };
  }

  /**
   * Detect mobile capabilities for crisis-optimized experience
   */
  async detectMobileCrisisCapabilities(): Promise<{
    isMobile: boolean;
    touchSupport: boolean;
    hapticSupport: boolean;
    offlineSupport: boolean;
    geolocationAccess: boolean;
    emergencyDialingSupport: boolean;
    batteryLevel?: number;
    connectionType: 'cellular' | 'wifi' | 'offline' | 'unknown';
    deviceStress: 'low' | 'moderate' | 'high'; // Based on performance indicators
  }> {
    const capabilities = {
      isMobile: this.isMobileDevice(),
      touchSupport: 'ontouchstart' in typeof window !== 'undefined' && window,
      hapticSupport: 'vibrate' in typeof window !== 'undefined' && navigator,
      offlineSupport: 'serviceWorker' in typeof window !== 'undefined' && navigator,
      geolocationAccess: 'geolocation' in typeof window !== 'undefined' && navigator,
      emergencyDialingSupport: this.canMakeEmergencyCalls(),
      connectionType: this.getConnectionType(),
      deviceStress: await this.assessDeviceStress()
    };

    // Try to get battery level for power-aware crisis features
    try {
      // @ts-ignore - Battery API may not be available
      const battery = await typeof window !== 'undefined' && navigator.getBattery?.();
      if (battery) {
        capabilities.batteryLevel = Math.round(battery.level * 100);
      }
    } catch (error) {
      // Battery API not supported
    }

    return capabilities;
  }

  /**
   * Create crisis-optimized authentication attempt
   */
  async attemptCrisisAuth(credentials: {
    email?: string;
    password?: string;
    phoneNumber?: string;
    emergencyCode?: string;
    biometricData?: string;
    magicLink?: string;
  }, context: {
    ipAddress?: string;
    userAgent: string;
    crisisIndicators?: string[];
    urgencyLevel?: 'low' | 'moderate' | 'high' | 'critical';
  }): Promise<{
    success: boolean;
    session?: MobileCrisisSession;
    fallbackOptions: Array<{
      method: string;
      available: boolean;
      description: string;
      action: string;
    }>;
    crisisSupport: Array<{
      resource: string;
      action: string;
      priority: number;
    }>;
    errorMessage?: string;
    nextSteps: string[];
  }> {
    const capabilities = await this.detectMobileCrisisCapabilities();
    const authResult = {
      success: false,
      fallbackOptions: this.getFallbackAuthMethods(capabilities),
      crisisSupport: this.getMobileCrisisSupport(context.urgencyLevel),
      nextSteps: [] as string[]
    };

    // Detect crisis keywords in any text input
    let crisisDetection = { hasCrisisContent: false, crisisLevel: 'mild' as const, immediateIntervention: false };
    const allText = `${credentials.email || ''} ${credentials.password || ''} ${context.crisisIndicators?.join(' ') || ''}`;
    
    if (this.config.crisisKeywordDetection) {
      crisisDetection = emergencyAuthBypass.detectCrisisKeywords(allText);
    }

    // For critical crisis situations, bypass standard auth
    if (crisisDetection.immediateIntervention || context.urgencyLevel === 'critical') {
      try {
        const emergencySession = await emergencyAuthBypass.createEmergencyGuestSession({
          crisisDetection,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          triggerSource: 'crisis_auth_bypass'
        });

        const mobileSession: MobileCrisisSession = {
          sessionType: 'emergency',
          guestId: emergencySession.guestId,
          crisisLevel: emergencySession.crisisLevel,
          supportAccess: [],
          sessionStartTime: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          mobileCapabilities: {
            hapticSupport: capabilities.hapticSupport,
            offlineSupport: capabilities.offlineSupport,
            geolocationAccess: capabilities.geolocationAccess,
            cameraAccess: false,
            microphoneAccess: false
          }
        };

        this.activeMobileSessions.set(emergencySession.sessionToken, mobileSession);

        return {
          ...authResult,
          success: true,
          session: mobileSession,
          nextSteps: [
            'Emergency access granted',
            'Crisis resources are now available',
            'You can access support without signing in',
            'Take your time - help is available 24/7'
          ]
        };
      } catch (error) {
        console.error('Emergency session creation failed:', error);
        authResult.nextSteps.push('Direct emergency contact recommended');
      }
    }

    // Try authentication methods in order of reliability for mobile
    const authMethods = [
      { name: 'email', attempt: () => this.tryEmailAuth(credentials.email, credentials.password) },
      { name: 'phone', attempt: () => this.tryPhoneAuth(credentials.phoneNumber) },
      { name: 'biometric', attempt: () => this.tryBiometricAuth(credentials.biometricData) },
      { name: 'magic_link', attempt: () => this.tryMagicLinkAuth(credentials.magicLink) }
    ];

    for (const method of authMethods) {
      try {
        const result = await method.attempt();
        if (result.success) {
          const session: MobileCrisisSession = {
            sessionType: 'authenticated',
            userId: result.userId,
            supportAccess: [],
            sessionStartTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            mobileCapabilities: {
              hapticSupport: capabilities.hapticSupport,
              offlineSupport: capabilities.offlineSupport,
              geolocationAccess: capabilities.geolocationAccess,
              cameraAccess: true,
              microphoneAccess: true
            }
          };

          this.activeMobileSessions.set(result.sessionToken, session);

          return {
            ...authResult,
            success: true,
            session,
            nextSteps: [
              'Authentication successful',
              'Welcome to your safe space',
              crisisDetection.hasCrisisContent ? 'Crisis support is available if needed' : 'All features are now accessible'
            ]
          };
        }
      } catch (error) {
        console.error(`Mobile auth method ${method.name} failed:`, error);
      }
    }

    // All authentication methods failed - provide crisis-safe error handling
    const errorResponse = this.generateMobileCrisisSafeError(credentials, crisisDetection, capabilities);
    
    return {
      ...authResult,
      errorMessage: errorResponse.message,
      nextSteps: errorResponse.nextSteps
    };
  }

  /**
   * Get fallback authentication methods optimized for mobile crisis scenarios
   */
  private getFallbackAuthMethods(capabilities: any): Array<{
    method: string;
    available: boolean;
    description: string;
    action: string;
  }> {
    return [
      {
        method: 'guest_access',
        available: this.config.enableGuestAccess,
        description: 'Access journal and crisis resources without signing in',
        action: 'create_guest_session'
      },
      {
        method: 'sms_code',
        available: capabilities.emergencyDialingSupport,
        description: 'Receive a secure code via text message',
        action: 'request_sms_code'
      },
      {
        method: 'email_link',
        available: true,
        description: 'Get a secure sign-in link sent to your email',
        action: 'request_magic_link'
      },
      {
        method: 'phone_call',
        available: capabilities.emergencyDialingSupport,
        description: 'Verify identity through automated phone call',
        action: 'request_phone_verification'
      },
      {
        method: 'emergency_contact',
        available: this.config.emergencyContactIntegration,
        description: 'Contact trusted person to help with account access',
        action: 'contact_emergency_contact'
      },
      {
        method: 'offline_mode',
        available: capabilities.offlineSupport && this.config.offlineResourceAccess,
        description: 'Access crisis resources and tools offline',
        action: 'enable_offline_mode'
      }
    ];
  }

  /**
   * Get mobile-optimized crisis support resources
   */
  private getMobileCrisisSupport(urgencyLevel?: string): Array<{
    resource: string;
    action: string;
    priority: number;
  }> {
    const resources = [
      { resource: '988 Crisis Lifeline', action: 'tel:988', priority: 1 },
      { resource: 'Crisis Text Line', action: 'sms:741741&body=HOME', priority: 2 },
      { resource: 'Emergency Services', action: 'tel:911', priority: 3 }
    ];

    // Prioritize by urgency level
    if (urgencyLevel === 'critical') {
      resources.unshift({ resource: 'Emergency 911', action: 'tel:911', priority: 0 });
    }

    return resources;
  }

  /**
   * Generate trauma-informed error messages for mobile users
   */
  private generateMobileCrisisSafeError(
    credentials: any, 
    crisisDetection: any, 
    capabilities: any
  ): {
    message: string;
    nextSteps: string[];
  } {
    const isCrisis = crisisDetection.hasCrisisContent;
    const hasLowBattery = capabilities.batteryLevel && capabilities.batteryLevel < 20;
    const isOffline = capabilities.connectionType === 'offline';

    if (isCrisis && crisisDetection.crisisLevel === 'critical') {
      return {
        message: "We care deeply about your safety. You don't need to sign in to get help right now.",
        nextSteps: [
          'Tap "Call 988" below for immediate crisis support',
          'Text "HOME" to 741741 for confidential help',
          'Access guest mode for safe journaling space',
          'You are not alone - help is available 24/7'
        ]
      };
    }

    if (isCrisis) {
      return {
        message: "Take a gentle breath. You're in a safe space, and support is available.",
        nextSteps: [
          'Try guest access to use journaling tools',
          'Crisis support is available if needed',
          'Your email or password may need adjustment',
          'Take your time - there\'s no pressure'
        ]
      };
    }

    if (hasLowBattery && isOffline) {
      return {
        message: "Your device is low on power and offline. Crisis resources are still available.",
        nextSteps: [
          'Emergency calling still works (988, 911)',
          'Find a charger when possible',
          'Offline crisis tools are available',
          'Connect to WiFi to restore full access'
        ]
      };
    }

    if (isOffline) {
      return {
        message: "You're currently offline. Crisis support and basic tools are still available.",
        nextSteps: [
          'Emergency calling works (988, 911)',
          'Offline journaling tools are available',
          'Connect to WiFi to sign in',
          'Crisis resources work without internet'
        ]
      };
    }

    if (hasLowBattery) {
      return {
        message: "Your battery is low. Let's get you signed in quickly or access help directly.",
        nextSteps: [
          'Try the simplified sign-in process',
          'Emergency calling works even with low battery',
          'Guest access is available',
          'Find a charger when you can'
        ]
      };
    }

    // Standard gentle error for mobile
    return {
      message: "Something gentle went wrong with sign-in. You have several options to continue safely.",
      nextSteps: [
        'Double-check your email and password',
        'Try guest access for immediate tools',
        'Request a secure sign-in link via email',
        'Crisis support is always available below'
      ]
    };
  }

  // Helper methods for authentication attempts
  private async tryEmailAuth(email?: string, password?: string): Promise<{ success: boolean; userId?: string; sessionToken?: string }> {
    if (!email || !password) return { success: false };
    // Implement actual email authentication
    return { success: false };
  }

  private async tryPhoneAuth(phoneNumber?: string): Promise<{ success: boolean; userId?: string; sessionToken?: string }> {
    if (!phoneNumber) return { success: false };
    // Implement phone-based authentication
    return { success: false };
  }

  private async tryBiometricAuth(biometricData?: string): Promise<{ success: boolean; userId?: string; sessionToken?: string }> {
    if (!biometricData) return { success: false };
    // Implement biometric authentication
    return { success: false };
  }

  private async tryMagicLinkAuth(magicLink?: string): Promise<{ success: boolean; userId?: string; sessionToken?: string }> {
    if (!magicLink) return { success: false };
    // Implement magic link authentication
    return { success: false };
  }

  // Device capability detection helpers
  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(typeof window !== 'undefined' && navigator.userAgent);
  }

  private canMakeEmergencyCalls(): boolean {
    return 'tel:' in typeof window !== 'undefined' && document.createElement('a');
  }

  private getConnectionType(): 'cellular' | 'wifi' | 'offline' | 'unknown' {
    if (!typeof window !== 'undefined' && navigator.onLine) return 'offline';
    
    // @ts-ignore - Connection API may not be available
    const connection = typeof window !== 'undefined' && navigator.connection || typeof window !== 'undefined' && navigator.mozConnection || typeof window !== 'undefined' && navigator.webkitConnection;
    
    if (connection) {
      if (connection.type === 'cellular') return 'cellular';
      if (connection.type === 'wifi') return 'wifi';
    }
    
    return 'unknown';
  }

  private async assessDeviceStress(): Promise<'low' | 'moderate' | 'high'> {
    try {
      const start = performance.now();
      await new Promise(resolve => requestAnimationFrame(resolve));
      const frameTime = performance.now() - start;
      
      // Simple heuristic based on frame timing
      if (frameTime < 8) return 'low';
      if (frameTime < 16) return 'moderate';
      return 'high';
    } catch (error) {
      return 'moderate';
    }
  }
}

// Export singleton instance
export const mobileCrisisAuth = new MobileCrisisAuthenticationSystem();