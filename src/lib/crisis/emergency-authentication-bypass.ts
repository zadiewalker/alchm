/**
 * Emergency Authentication Bypass System
 * 
 * Critical Crisis Safety Implementation:
 * - Provides immediate access to crisis resources without authentication
 * - Detects crisis keywords in authentication attempts
 * - Creates secure guest sessions for emergency support access
 * - Prioritizes user safety over data protection in crisis situations
 */

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Crisis keywords that trigger emergency bypass
const CRISIS_KEYWORDS = [
  // Direct crisis expressions
  'suicide', 'kill myself', 'end it all', 'want to die', 'cant go on',
  'ending my life', 'better off dead', 'no point living', 'hurt myself',
  'self harm', 'cutting', 'overdose', 'pills', 'jump off', 'hanging',
  
  // Emotional crisis indicators
  'cant take it anymore', 'too much pain', 'nobody cares', 'all alone',
  'hopeless', 'worthless', 'burden', 'everyone hates me', 'give up',
  'nothing matters', 'cant breathe', 'falling apart', 'losing it',
  
  // Urgent help requests
  'need help now', 'emergency', 'crisis', 'desperate', 'scared',
  'dont know what to do', 'please help', 'somebody help', 'urgent',
  
  // Trauma-specific expressions
  'flashback', 'triggered', 'panic attack', 'dissociating', 'nightmare',
  'cant stop shaking', 'feel unsafe', 'hiding', 'afraid',
  
  // Cultural/community specific
  'family shame', 'dishonor', 'rejected by', 'kicked out', 'homeless',
  'cant tell anyone', 'nowhere to go', 'no money', 'untypeof window !== 'undefined' && documented'
];

// International crisis resources by country
const INTERNATIONAL_CRISIS_RESOURCES = {
  US: [
    { name: '988 Suicide Crisis Lifeline', action: 'tel:988', priority: 1 },
    { name: 'Crisis Text Line', action: 'sms:741741&body=HOME', priority: 2 },
    { name: 'Trans Lifeline', action: 'tel:8775658860', priority: 3, lgbtq: true },
    { name: 'Trevor Project', action: 'tel:1866488-7386', priority: 3, lgbtq: true, youth: true }
  ],
  CA: [
    { name: 'Talk Suicide Canada', action: 'tel:8336784357', priority: 1 },
    { name: 'Crisis Text Line Canada', action: 'sms:686868&body=TALK', priority: 2 }
  ],
  UK: [
    { name: 'Samaritans', action: 'tel:116123', priority: 1 },
    { name: 'Crisis Text Line UK', action: 'sms:85258&body=SHOUT', priority: 2 }
  ],
  AU: [
    { name: 'Lifeline Australia', action: 'tel:131114', priority: 1 },
    { name: 'Beyond Blue', action: 'tel:1300224636', priority: 2 }
  ]
};

export interface EmergencyBypassSession {
  guestId: string;
  sessionToken: string;
  crisisLevel: 'mild' | 'moderate' | 'severe' | 'critical';
  detectedKeywords: string[];
  createdAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  geolocation?: {
    country: string;
    region: string;
  };
  accessedResources: string[];
  followUpScheduled?: boolean;
}

export class EmergencyAuthenticationBypass {
  private activeGuestSessions: Map<string, EmergencyBypassSession> = new Map();
  
  /**
   * Detect crisis keywords in any text input during authentication
   */
  detectCrisisKeywords(text: string): {
    hasCrisisContent: boolean;
    detectedKeywords: string[];
    crisisLevel: 'mild' | 'moderate' | 'severe' | 'critical';
    immediateIntervention: boolean;
  } {
    if (!text || typeof text !== 'string') {
      return {
        hasCrisisContent: false,
        detectedKeywords: [],
        crisisLevel: 'mild',
        immediateIntervention: false
      };
    }

    const lowercaseText = text.toLowerCase();
    const detectedKeywords: string[] = [];
    let highestSeverity = 0;

    // Check for crisis keywords
    CRISIS_KEYWORDS.forEach(keyword => {
      if (lowercaseText.includes(keyword.toLowerCase())) {
        detectedKeywords.push(keyword);
        
        // Assign severity scores
        if (['suicide', 'kill myself', 'end it all', 'want to die', 'ending my life', 'overdose', 'jump off', 'hanging'].includes(keyword)) {
          highestSeverity = Math.max(highestSeverity, 4); // Critical
        } else if (['hurt myself', 'self harm', 'cutting', 'cant take it anymore', 'hopeless', 'worthless'].includes(keyword)) {
          highestSeverity = Math.max(highestSeverity, 3); // Severe  
        } else if (['desperate', 'scared', 'panic attack', 'cant breathe', 'falling apart'].includes(keyword)) {
          highestSeverity = Math.max(highestSeverity, 2); // Moderate
        } else {
          highestSeverity = Math.max(highestSeverity, 1); // Mild
        }
      }
    });

    const crisisLevels: Array<'mild' | 'moderate' | 'severe' | 'critical'> = ['mild', 'moderate', 'severe', 'critical'];
    const crisisLevel = highestSeverity > 0 ? crisisLevels[highestSeverity - 1] : 'mild';
    
    return {
      hasCrisisContent: detectedKeywords.length > 0,
      detectedKeywords,
      crisisLevel,
      immediateIntervention: highestSeverity >= 3 // Severe or Critical
    };
  }

  /**
   * Create emergency guest session for immediate crisis support access
   */
  async createEmergencyGuestSession(options: {
    crisisDetection: ReturnType<typeof this.detectCrisisKeywords>;
    ipAddress?: string;
    userAgent?: string;
    triggerSource: 'auth_failure' | 'crisis_keywords' | 'manual_trigger';
  }): Promise<EmergencyBypassSession> {
    const guestId = `crisis_guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionToken = `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // 2 hours for crisis sessions

    const guestSession: EmergencyBypassSession = {
      guestId,
      sessionToken,
      crisisLevel: options.crisisDetection.crisisLevel,
      detectedKeywords: options.crisisDetection.detectedKeywords,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      geolocation: this.getLocationFromIP(options.ipAddress),
      accessedResources: [],
      followUpScheduled: false
    };

    // Store session in memory and log to Firebase for monitoring
    this.activeGuestSessions.set(sessionToken, guestSession);
    
    // Log crisis emergency session creation (anonymized)
    try {
      await addDoc(collection(db, 'crisis_emergency_sessions'), {
        guestId: guestId.slice(-8), // Only store last 8 chars for tracking
        crisisLevel: options.crisisDetection.crisisLevel,
        keywordCount: options.crisisDetection.detectedKeywords.length,
        triggerSource: options.triggerSource,
        immediateIntervention: options.crisisDetection.immediateIntervention,
        country: guestSession.geolocation?.country || 'unknown',
        createdAt: serverTimestamp(),
        // NOTE: No personal info, user text, or identifying data logged
        dataRetentionDays: 30 // Auto-delete after 30 days
      });
    } catch (error) {
      console.error('Failed to log crisis session (non-critical):', error);
      // Continue execution - logging failure shouldn't prevent crisis support
    }

    return guestSession;
  }

  /**
   * Get crisis resources based on user location and context
   */
  getCrisisResources(session: EmergencyBypassSession, userContext?: {
    age?: number;
    lgbtq?: boolean;
    language?: string;
  }): Array<{
    name: string;
    action: string;
    priority: number;
    description?: string;
    available24_7: boolean;
    specialization?: string[];
  }> {
    const country = session.geolocation?.country || 'US';
    const baseResources = INTERNATIONAL_CRISIS_RESOURCES[country as keyof typeof INTERNATIONAL_CRISIS_RESOURCES] || INTERNATIONAL_CRISIS_RESOURCES.US;
    
    const resources = baseResources.map(resource => ({
      ...resource,
      available24_7: true,
      description: this.getResourceDescription(resource.name, session.crisisLevel)
    }));

    // Add specialized resources based on user context
    if (userContext?.lgbtq) {
      resources.push({
        name: 'LGBTQ National Hotline',
        action: 'tel:18883906611',
        priority: 2,
        description: 'LGBTQ-affirming crisis support',
        available24_7: true,
        specialization: ['lgbtq', 'identity']
      });
    }

    if (userContext?.age && userContext.age < 18) {
      resources.push({
        name: 'National Child Abuse Hotline',
        action: 'tel:18004224453',
        priority: 3,
        description: 'Support for children and teens',
        available24_7: true,
        specialization: ['youth', 'abuse']
      });
    }

    // Sort by priority and crisis level relevance
    return resources.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Validate emergency guest session
   */
  validateGuestSession(sessionToken: string): {
    valid: boolean;
    session?: EmergencyBypassSession;
    reason?: string;
  } {
    const session = this.activeGuestSessions.get(sessionToken);
    
    if (!session) {
      return { valid: false, reason: 'Guest session not found' };
    }

    if (new Date() > new Date(session.expiresAt)) {
      this.activeGuestSessions.delete(sessionToken);
      return { valid: false, reason: 'Guest session expired' };
    }

    return { valid: true, session };
  }

  /**
   * Track resource access for follow-up support
   */
  async trackResourceAccess(sessionToken: string, resourceName: string): Promise<void> {
    const session = this.activeGuestSessions.get(sessionToken);
    if (session) {
      session.accessedResources.push(`${resourceName}:${new Date().toISOString()}`);
      
      // If user accessed multiple resources, schedule follow-up
      if (session.accessedResources.length >= 2 && !session.followUpScheduled) {
        session.followUpScheduled = true;
        await this.scheduleFollowUpSupport(session);
      }
    }
  }

  /**
   * Generate crisis-safe authentication error message
   */
  generateCrisisSafeErrorMessage(hasEmailError: boolean, hasPasswordError: boolean, crisisDetected: boolean): {
    message: string;
    showEmergencyBypass: boolean;
    emergencyMessage?: string;
  } {
    if (crisisDetected) {
      return {
        message: "We care about you and want you to be safe. You don't need to sign in to access crisis support.",
        showEmergencyBypass: true,
        emergencyMessage: "If you're having thoughts of self-harm, please reach out for help right now. You don't have to go through this alone."
      };
    }

    if (hasEmailError && hasPasswordError) {
      return {
        message: "Take a gentle breath. Let's try again with your email and password. If you need immediate support, help is available below.",
        showEmergencyBypass: false
      };
    }

    if (hasEmailError) {
      return {
        message: "Please check your email address. If you're feeling overwhelmed, support is available 24/7 below.",
        showEmergencyBypass: false
      };
    }

    if (hasPasswordError) {
      return {
        message: "Your password doesn't seem right. Take a moment - if you need crisis support, we're here for you.",
        showEmergencyBypass: false
      };
    }

    return {
      message: "Something gentle went wrong. You're safe here, and help is always available.",
      showEmergencyBypass: false
    };
  }

  /**
   * Create panic-safe navigation for users in distress
   */
  getPanicSafeNavigation(): Array<{
    label: string;
    action: string;
    icon: string;
    safetyLevel: 'immediate' | 'supportive' | 'general';
  }> {
    return [
      {
        label: 'I need help right now',
        action: 'tel:988',
        icon: '🆘',
        safetyLevel: 'immediate'
      },
      {
        label: 'I want to text someone',
        action: 'sms:741741&body=HOME',
        icon: '💬',
        safetyLevel: 'immediate'
      },
      {
        label: 'I need a safe space to write',
        action: 'guest_journal',
        icon: '📝',
        safetyLevel: 'supportive'
      },
      {
        label: 'Show me breathing exercises',
        action: 'breathing_exercises',
        icon: '🫁',
        safetyLevel: 'supportive'
      },
      {
        label: 'I\'m safe, continue to sign in',
        action: 'return_to_auth',
        icon: '🔐',
        safetyLevel: 'general'
      }
    ];
  }

  // Private helper methods
  private getLocationFromIP(ipAddress?: string): { country: string; region: string } | undefined {
    if (!ipAddress) return undefined;
    
    // This would use a GeoIP service in production
    // For now, default to US
    return {
      country: 'US',
      region: 'North America'
    };
  }

  private getResourceDescription(resourceName: string, crisisLevel: string): string {
    const descriptions: Record<string, string> = {
      '988 Suicide Crisis Lifeline': 'Free, confidential 24/7 crisis support from trained counselors',
      'Crisis Text Line': 'Text with a trained crisis counselor - available 24/7',
      'Trans Lifeline': 'Crisis support by and for transgender people',
      'Trevor Project': '24/7 crisis support for LGBTQ+ youth',
      'Talk Suicide Canada': 'Canadian 24/7 suicide prevention service',
      'Samaritans': 'Free emotional support for anyone in distress'
    };
    
    return descriptions[resourceName] || 'Professional crisis support available 24/7';
  }

  private async scheduleFollowUpSupport(session: EmergencyBypassSession): Promise<void> {
    try {
      // Log follow-up need (no personal info)
      await addDoc(collection(db, 'crisis_followup_needed'), {
        guestId: session.guestId.slice(-8),
        crisisLevel: session.crisisLevel,
        resourceAccessCount: session.accessedResources.length,
        scheduledAt: serverTimestamp(),
        followUpDue: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
    } catch (error) {
      console.error('Failed to schedule follow-up (non-critical):', error);
    }
  }
}

// Export singleton instance
export const emergencyAuthBypass = new EmergencyAuthenticationBypass();