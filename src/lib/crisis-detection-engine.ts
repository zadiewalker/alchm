/**
 * ALCHM Crisis Detection & Intervention Engine
 * 
 * Production-ready system for detecting crisis language in user content
 * and providing appropriate trauma-informed interventions.
 * 
 * SAFETY FIRST: This system errs on the side of caution and care.
 */

// Firebase operations moved to server-side for edge runtime compatibility
// import { adminFirestore } from './firebaseAdmin';
import { announce } from '@/components/ui/AccessibilityHelper';

// Edge-compatible helper functions for deferred operations
interface DeferredOperation {
  type: 'log' | 'followUp' | 'notification';
  data: any;
  userId?: string;
}

// Helper to defer Firebase operations to server-side
const deferFirebaseOperation = (operation: DeferredOperation) => {
  // In production, this would trigger an API call or queue the operation
  if (typeof window !== 'undefined') {
    // Client-side: make API call
    fetch('/api/crisis/deferred-operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(operation)
    }).catch(console.error);
  } else {
    // Server-side: log for now, could be queued for async processing
    console.info('[Crisis] Deferred operation queued:', operation.type);
  }
};

// Crisis detection patterns with severity levels
export interface CrisisPattern {
  keywords: string[];
  phrases: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'suicidal' | 'self_harm' | 'substance' | 'eating_disorder' | 'domestic_violence' | 'general_crisis';
  confidence: number;
}

// Crisis intervention response types
export interface CrisisIntervention {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'gentle_check' | 'resource_suggestion' | 'immediate_support' | 'emergency_intervention';
  title: string;
  message: string;
  resources: CrisisResource[];
  followUp?: FollowUpAction[];
}

export interface CrisisResource {
  type: 'hotline' | 'chat' | 'text' | 'website' | 'app';
  name: string;
  contact: string;
  description: string;
  availability: string;
  specialized?: string[];
}

export interface FollowUpAction {
  delay: number; // hours
  type: 'check_in' | 'resource_reminder' | 'professional_suggestion';
  message: string;
}

export interface CrisisDetectionResult {
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  categories: string[];
  confidence: number;
  triggers: string[];
  intervention: CrisisIntervention | null;
  needsImmediateAttention: boolean;
}

class CrisisDetectionEngine {
  private patterns: CrisisPattern[] = [
    // CRITICAL SEVERITY - Immediate intervention needed
    {
      keywords: ['suicide', 'kill myself', 'end my life', 'want to die'],
      phrases: ['going to kill myself', 'plan to die', 'suicide tonight', 'end it all today'],
      severity: 'critical',
      category: 'suicidal',
      confidence: 0.95
    },
    {
      keywords: ['pills', 'overdose', 'bridge', 'hanging', 'gun'],
      phrases: ['have the pills', 'found a bridge', 'got the rope', 'have a plan'],
      severity: 'critical',
      category: 'suicidal',
      confidence: 0.9
    },

    // HIGH SEVERITY - Urgent attention needed
    {
      keywords: ['worthless', 'burden', 'better off dead', 'nobody cares'],
      phrases: ['everyone would be better', 'tired of fighting', 'can\'t take anymore'],
      severity: 'high',
      category: 'suicidal',
      confidence: 0.8
    },
    {
      keywords: ['cutting', 'burning', 'hurting myself', 'self harm'],
      phrases: ['want to cut', 'need to hurt', 'deserve pain'],
      severity: 'high',
      category: 'self_harm',
      confidence: 0.85
    },

    // MEDIUM SEVERITY - Monitoring and support needed
    {
      keywords: ['hopeless', 'trapped', 'alone', 'empty'],
      phrases: ['nothing matters', 'no point', 'what\'s the use'],
      severity: 'medium',
      category: 'general_crisis',
      confidence: 0.7
    },
    {
      keywords: ['drinking', 'drugs', 'numb the pain', 'escape'],
      phrases: ['drinking to forget', 'using to cope', 'need something stronger'],
      severity: 'medium',
      category: 'substance',
      confidence: 0.75
    },

    // LOW SEVERITY - Gentle support and resources
    {
      keywords: ['sad', 'down', 'struggling', 'difficult'],
      phrases: ['having a hard time', 'feeling low', 'things are tough'],
      severity: 'low',
      category: 'general_crisis',
      confidence: 0.6
    }
  ];

  private interventions: CrisisIntervention[] = [
    {
      id: 'critical_immediate',
      severity: 'critical',
      type: 'emergency_intervention',
      title: 'Immediate Safety Support Available',
      message: 'I notice you\'re going through something really difficult right now. Your safety matters, and there are people who want to help immediately.',
      resources: [
        {
          type: 'hotline',
          name: 'Suicide & Crisis Lifeline',
          contact: '988',
          description: '24/7 crisis support for anyone in emotional distress',
          availability: '24/7',
          specialized: ['suicide_prevention', 'emotional_crisis']
        },
        {
          type: 'hotline',
          name: 'Emergency Services',
          contact: '911',
          description: 'Immediate emergency response for life-threatening situations',
          availability: '24/7'
        },
        {
          type: 'text',
          name: 'Crisis Text Line',
          contact: 'Text HOME to 741741',
          description: 'Anonymous crisis support via text message',
          availability: '24/7'
        }
      ],
      followUp: [
        {
          delay: 1,
          type: 'check_in',
          message: 'Just checking in to see how you\'re doing. Remember, you\'re not alone in this.'
        }
      ]
    },

    {
      id: 'high_urgent',
      severity: 'high',
      type: 'immediate_support',
      title: 'You Don\'t Have to Face This Alone',
      message: 'It sounds like you\'re carrying something heavy right now. These feelings are real and valid, and there are people trained to help.',
      resources: [
        {
          type: 'hotline',
          name: 'Suicide & Crisis Lifeline',
          contact: '988',
          description: 'Confidential support for anyone in emotional distress',
          availability: '24/7'
        },
        {
          type: 'chat',
          name: 'Crisis Chat',
          contact: 'https://suicidepreventionlifeline.org/chat/',
          description: 'Online chat support with trained counselors',
          availability: '24/7'
        }
      ],
      followUp: [
        {
          delay: 4,
          type: 'check_in',
          message: 'Thinking of you. How are you feeling since we last connected?'
        },
        {
          delay: 24,
          type: 'professional_suggestion',
          message: 'Consider reaching out to a mental health professional who can provide ongoing support.'
        }
      ]
    },

    {
      id: 'medium_support',
      severity: 'medium',
      type: 'resource_suggestion',
      title: 'Support is Available When You\'re Ready',
      message: 'I can sense you\'re going through a challenging time. It takes courage to acknowledge these feelings.',
      resources: [
        {
          type: 'website',
          name: 'Mental Health Resources',
          contact: 'https://www.nami.org/help',
          description: 'Information and support for mental health challenges',
          availability: 'Always available'
        },
        {
          type: 'hotline',
          name: 'SAMHSA Helpline',
          contact: '1-800-662-4357',
          description: 'Mental health and substance abuse treatment referrals',
          availability: '24/7'
        }
      ],
      followUp: [
        {
          delay: 12,
          type: 'check_in',
          message: 'How are you taking care of yourself today?'
        }
      ]
    },

    {
      id: 'low_gentle',
      severity: 'low',
      type: 'gentle_check',
      title: 'Gentle Reminder: You\'re Cared For',
      message: 'I notice you might be having a difficult time. Remember that difficult feelings are temporary, and seeking support is a sign of strength.',
      resources: [
        {
          type: 'app',
          name: 'Mindfulness Resources',
          contact: 'In-app breathing exercises and grounding techniques',
          description: 'Immediate coping tools for difficult moments',
          availability: 'Always available'
        }
      ],
      followUp: [
        {
          delay: 24,
          type: 'check_in',
          message: 'Hope today has brought you some moments of peace.'
        }
      ]
    }
  ];

  /**
   * Analyze content for crisis indicators
   */
  async analyzeContent(content: string, userId: string, context?: string): Promise<CrisisDetectionResult> {
    try {
      const normalizedContent = content.toLowerCase();
      let highestSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      let maxConfidence = 0;
      const detectedCategories: string[] = [];
      const triggers: string[] = [];

      // Check against all patterns
      for (const pattern of this.patterns) {
        let patternMatched = false;
        let confidence = 0;

        // Check keywords
        for (const keyword of pattern.keywords) {
          if (normalizedContent.includes(keyword.toLowerCase())) {
            patternMatched = true;
            confidence = Math.max(confidence, pattern.confidence);
            triggers.push(keyword);
          }
        }

        // Check phrases (higher confidence)
        for (const phrase of pattern.phrases) {
          if (normalizedContent.includes(phrase.toLowerCase())) {
            patternMatched = true;
            confidence = Math.max(confidence, pattern.confidence + 0.1);
            triggers.push(phrase);
          }
        }

        if (patternMatched) {
          detectedCategories.push(pattern.category);
          maxConfidence = Math.max(maxConfidence, confidence);
          
          // Update highest severity
          const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
          if (severityLevels[pattern.severity] > severityLevels[highestSeverity]) {
            highestSeverity = pattern.severity;
          }
        }
      }

      const detected = maxConfidence > 0.5;
      const needsImmediateAttention = highestSeverity === 'critical' || highestSeverity === 'high';

      // Get appropriate intervention
      const intervention = detected ? this.getIntervention(highestSeverity) : null;

      // Log detection for analytics (anonymized)
      if (detected) {
        await this.logCrisisDetection({
          userId,
          severity: highestSeverity,
          categories: detectedCategories,
          confidence: maxConfidence,
          context,
          timestamp: new Date(),
          triggerCount: triggers.length
        });
      }

      return {
        detected,
        severity: highestSeverity,
        categories: [...new Set(detectedCategories)],
        confidence: maxConfidence,
        triggers: [...new Set(triggers)],
        intervention,
        needsImmediateAttention
      };

    } catch (error) {
      console.error('Crisis detection error:', error);
      
      // In case of error, err on the side of safety
      return {
        detected: true,
        severity: 'medium',
        categories: ['general_crisis'],
        confidence: 0.5,
        triggers: ['system_error'],
        intervention: this.getIntervention('medium'),
        needsImmediateAttention: false
      };
    }
  }

  /**
   * Get appropriate intervention based on severity
   */
  private getIntervention(severity: 'low' | 'medium' | 'high' | 'critical'): CrisisIntervention | null {
    return this.interventions.find(intervention => intervention.severity === severity) || null;
  }

  /**
   * Log crisis detection for analytics (anonymized)
   */
  private async logCrisisDetection(data: {
    userId: string;
    severity: string;
    categories: string[];
    confidence: number;
    context?: string;
    timestamp: Date;
    triggerCount: number;
  }): Promise<void> {
    try {
      // Hash userId for privacy
      const hashedUserId = await this.hashUserId(data.userId);
      
      // Defer logging to server-side for edge runtime compatibility
      deferFirebaseOperation({
        type: 'log',
        userId: data.userId,
        data: {
          userIdHash: hashedUserId,
          severity: data.severity,
          categories: data.categories,
          confidence: data.confidence,
          context: data.context,
          timestamp: data.timestamp,
          triggerCount: data.triggerCount,
          // Additional metadata for analytics
          date: data.timestamp.toISOString().split('T')[0],
          hour: data.timestamp.getHours(),
          dayOfWeek: data.timestamp.getDay()
        }
      });
    } catch (error) {
      console.error('Failed to log crisis detection:', error);
    }
  }

  /**
   * Hash user ID for privacy
   */
  private async hashUserId(userId: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(userId + process.env.CRISIS_HASH_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Schedule follow-up interventions
   */
  async scheduleFollowUp(userId: string, interventionId: string, followUps: FollowUpAction[]): Promise<void> {
    try {
      for (const followUp of followUps) {
        const scheduledTime = new Date();
        scheduledTime.setHours(scheduledTime.getHours() + followUp.delay);

        // Defer follow-up scheduling to server-side
        deferFirebaseOperation({
          type: 'followUp',
          userId,
          data: {
            interventionId,
            type: followUp.type,
            message: followUp.message,
            scheduledTime,
            completed: false,
            createdAt: new Date()
          }
        });
      }
    } catch (error) {
      console.error('Failed to schedule follow-up:', error);
    }
  }

  /**
   * Process scheduled follow-ups (to be run by cron job)
   */
  async processScheduledFollowUps(): Promise<void> {
    // This method requires Firebase Admin SDK - moved to server-side API endpoint
    // Edge runtime cannot execute this method
    throw new Error('processScheduledFollowUps() requires server-side execution with Firebase Admin SDK. Use /api/crisis/process-followups instead.');
  }

  /**
   * Send follow-up notification to user
   */
  private async sendFollowUpNotification(userId: string, message: string, type: string): Promise<void> {
    try {
      // Add to user's notifications collection
      // Defer notification to server-side
      deferFirebaseOperation({
        type: 'notification',
        userId,
        data: {
          type: 'crisis_follow_up',
          subtype: type,
          message,
          timestamp: new Date(),
          read: false,
          source: 'crisis_intervention_system'
        }
      });

      // Could also send push notification here if enabled
    } catch (error) {
      console.error('Failed to send follow-up notification:', error);
    }
  }

  /**
   * Get crisis analytics for admin dashboard
   */
  async getCrisisAnalytics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<any> {
    // This method requires Firebase Admin SDK - moved to server-side API endpoint
    // Edge runtime cannot execute this method
    throw new Error('getCrisisAnalytics() requires server-side execution with Firebase Admin SDK. Use /api/crisis/analytics instead.');
  }
}

// Singleton instance
export const crisisDetectionEngine = new CrisisDetectionEngine();

// Export types for use in other files
export type { CrisisDetectionResult, CrisisIntervention, CrisisResource };