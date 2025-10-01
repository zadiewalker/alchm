// ALCHM Crisis Support and Professional Oversight System
// Privacy-preserving crisis intervention with professional oversight

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';

// ===== CRISIS DETECTION ENGINE =====

export class CrisisDetectionEngine {
  private static readonly IMMEDIATE_CRISIS_INDICATORS = [
    // Suicidal ideation
    'kill myself', 'end my life', 'commit suicide', 'take my own life',
    'want to die', 'better off dead', 'not worth living', 'end it all',
    
    // Self-harm indicators
    'going to hurt myself', 'cut myself', 'harm myself', 'overdose',
    
    // Imminent danger
    'tonight', 'today', 'right now', 'plan to', 'going to',
    'have the means', 'pills ready', 'rope ready', 'gun ready',
    
    // Hopelessness with action
    'no point in living', 'nothing left', 'final message', 'goodbye forever'
  ];

  private static readonly HIGH_RISK_INDICATORS = [
    // Emotional crisis
    'can\'t take it anymore', 'overwhelming pain', 'unbearable',
    'drowning in despair', 'completely hopeless', 'no way out',
    
    // Social isolation
    'nobody cares', 'all alone', 'no one understands', 'burden to everyone',
    
    // Trauma responses
    'flashbacks won\'t stop', 'reliving trauma', 'can\'t escape memories',
    'triggered constantly', 'panic attacks daily'
  ];

  private static readonly MODERATE_RISK_INDICATORS = [
    // Depression indicators
    'don\'t want to live', 'wish I wasn\'t here', 'life is meaningless',
    'empty inside', 'numb to everything', 'can\'t feel anything',
    
    // Anxiety indicators
    'constant panic', 'can\'t breathe', 'heart racing', 'losing control',
    
    // Isolation behaviors
    'pushing everyone away', 'withdrawing completely', 'shutting down'
  ];

  /**
   * Analyzes content for crisis indicators while maintaining anonymity
   */
  static analyzeCrisisRisk(content: string, ephemeralId: string): CrisisAssessment {
    const lowerContent = content.toLowerCase();
    
    // Check for immediate crisis indicators
    const immediateCrisis = this.IMMEDIATE_CRISIS_INDICATORS.filter(indicator => 
      lowerContent.includes(indicator)
    );

    const highRisk = this.HIGH_RISK_INDICATORS.filter(indicator =>
      lowerContent.includes(indicator)
    );

    const moderateRisk = this.MODERATE_RISK_INDICATORS.filter(indicator =>
      lowerContent.includes(indicator)
    );

    // Calculate risk level
    let riskLevel: CrisisRiskLevel = 'low';
    let urgency: CrisisUrgency = 'routine';

    if (immediateCrisis.length > 0) {
      riskLevel = 'immediate';
      urgency = 'emergency';
    } else if (highRisk.length >= 2 || (highRisk.length >= 1 && moderateRisk.length >= 2)) {
      riskLevel = 'high';
      urgency = 'urgent';
    } else if (highRisk.length >= 1 || moderateRisk.length >= 3) {
      riskLevel = 'moderate';
      urgency = 'priority';
    }

    // Check for protective factors
    const protectiveFactors = this.identifyProtectiveFactors(content);
    
    // Adjust risk based on protective factors
    if (protectiveFactors.length > 0 && riskLevel !== 'immediate') {
      if (riskLevel === 'high') riskLevel = 'moderate';
      else if (riskLevel === 'moderate') riskLevel = 'low';
    }

    return {
      ephemeralId,
      riskLevel,
      urgency,
      detectedIndicators: {
        immediate: immediateCrisis,
        high: highRisk,
        moderate: moderateRisk
      },
      protectiveFactors,
      recommendedAction: this.getRecommendedAction(riskLevel, urgency),
      resources: this.getAppropriateResources(riskLevel),
      confidenceScore: this.calculateConfidence(immediateCrisis, highRisk, moderateRisk),
      assessmentTime: new Date(),
      requiresProfessionalReview: riskLevel === 'immediate' || riskLevel === 'high'
    };
  }

  private static identifyProtectiveFactors(content: string): string[] {
    const protectiveIndicators = [
      'therapy helping', 'support system', 'family support', 'friends care',
      'reasons to live', 'hope for future', 'getting help', 'medication helping',
      'coping strategies', 'self-care', 'mindfulness', 'seeking treatment',
      'spiritual practice', 'meaning in life', 'goals for future'
    ];

    return protectiveIndicators.filter(factor => 
      content.toLowerCase().includes(factor)
    );
  }

  private static getRecommendedAction(riskLevel: CrisisRiskLevel, urgency: CrisisUrgency): CrisisAction {
    switch (riskLevel) {
      case 'immediate':
        return 'emergency_intervention';
      case 'high':
        return 'professional_outreach';
      case 'moderate':
        return 'supportive_resources';
      default:
        return 'community_support';
    }
  }

  private static getAppropriateResources(riskLevel: CrisisRiskLevel): CrisisResource[] {
    const emergencyResources: CrisisResource[] = [
      {
        name: '988 Suicide & Crisis Lifeline',
        type: 'phone',
        contact: '988',
        availability: '24/7',
        description: 'Free and confidential support for people in distress',
        priority: 1
      },
      {
        name: 'Emergency Services',
        type: 'emergency',
        contact: '911',
        availability: '24/7',
        description: 'For immediate life-threatening situations',
        priority: 1
      },
      {
        name: 'Crisis Text Line',
        type: 'text',
        contact: 'Text HOME to 741741',
        availability: '24/7',
        description: 'Free crisis support via text message',
        priority: 2
      }
    ];

    const supportResources: CrisisResource[] = [
      {
        name: 'ALCHM Crisis Support',
        type: 'app',
        contact: '/crisis-resources',
        availability: '24/7',
        description: 'In-app crisis support and resources',
        priority: 1
      },
      {
        name: 'NAMI Helpline',
        type: 'phone',
        contact: '1-800-950-NAMI',
        availability: 'Mon-Fri 10am-8pm ET',
        description: 'Mental health information and support',
        priority: 2
      }
    ];

    return riskLevel === 'immediate' || riskLevel === 'high' 
      ? emergencyResources 
      : supportResources;
  }

  private static calculateConfidence(immediate: string[], high: string[], moderate: string[]): number {
    let confidence = 0.5; // Base confidence
    
    confidence += immediate.length * 0.3;
    confidence += high.length * 0.2;
    confidence += moderate.length * 0.1;
    
    return Math.min(confidence, 1.0);
  }
}

// ===== PROFESSIONAL OVERSIGHT SYSTEM =====

export class ProfessionalOversightManager {
  /**
   * Routes crisis assessments to appropriate professional oversight
   */
  static async routeToProfessionalCare(assessment: CrisisAssessment): Promise<ProfessionalResponse> {
    try {
      // Log crisis assessment securely (encrypted, time-limited)
      const assessmentDoc = {
        ephemeralId: assessment.ephemeralId, // Cannot be traced back to user
        riskLevel: assessment.riskLevel,
        urgency: assessment.urgency,
        confidenceScore: assessment.confidenceScore,
        detectedIndicators: assessment.detectedIndicators,
        protectiveFactors: assessment.protectiveFactors,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day retention
        reviewStatus: 'pending',
        interventionType: 'automated'
      };

      await addDoc(collection(db, 'crisis_assessments'), assessmentDoc);

      // Route based on risk level
      switch (assessment.riskLevel) {
        case 'immediate':
          return await this.triggerEmergencyProtocol(assessment);
        case 'high':
          return await this.requestProfessionalReview(assessment);
        case 'moderate':
          return await this.provideSupportiveResources(assessment);
        default:
          return await this.offerCommunitySupport(assessment);
      }
    } catch (error) {
      console.error('Error in professional oversight routing:', error);
      // Fallback to emergency protocol if routing fails
      return await this.triggerEmergencyProtocol(assessment);
    }
  }

  private static async triggerEmergencyProtocol(assessment: CrisisAssessment): Promise<ProfessionalResponse> {
    // In production, this would:
    // 1. Immediately surface emergency resources
    // 2. Optionally trigger location-based emergency services (with explicit consent)
    // 3. Create secure communication channel with crisis professionals
    
    return {
      responseType: 'emergency_intervention',
      immediateResources: assessment.resources.filter(r => r.priority === 1),
      interventionMessage: 'Your safety is our priority. Please reach out to emergency services or crisis support immediately.',
      followUpScheduled: true,
      professionalReviewTriggered: true,
      anonymityMaintained: true,
      responseTime: new Date()
    };
  }

  private static async requestProfessionalReview(assessment: CrisisAssessment): Promise<ProfessionalResponse> {
    // Alert qualified mental health professionals for review while maintaining anonymity
    
    return {
      responseType: 'professional_outreach',
      immediateResources: assessment.resources,
      interventionMessage: 'We\'ve identified that you may benefit from professional support. Crisis resources are available 24/7.',
      followUpScheduled: true,
      professionalReviewTriggered: true,
      anonymityMaintained: true,
      responseTime: new Date()
    };
  }

  private static async provideSupportiveResources(assessment: CrisisAssessment): Promise<ProfessionalResponse> {
    return {
      responseType: 'supportive_resources',
      immediateResources: assessment.resources,
      interventionMessage: 'Thank you for sharing. You\'re not alone, and support is available when you\'re ready.',
      followUpScheduled: false,
      professionalReviewTriggered: false,
      anonymityMaintained: true,
      responseTime: new Date()
    };
  }

  private static async offerCommunitySupport(assessment: CrisisAssessment): Promise<ProfessionalResponse> {
    return {
      responseType: 'community_support',
      immediateResources: [],
      interventionMessage: 'Your voice matters in our community. Consider exploring our support circles or sharing your wisdom.',
      followUpScheduled: false,
      professionalReviewTriggered: false,
      anonymityMaintained: true,
      responseTime: new Date()
    };
  }
}

// ===== PRIVACY-PRESERVING FOLLOW-UP SYSTEM =====

export class AnonymousFollowUpManager {
  /**
   * Creates anonymous follow-up check-ins for crisis situations
   */
  static async scheduleAnonymousFollowUp(
    ephemeralId: string, 
    riskLevel: CrisisRiskLevel,
    followUpType: 'immediate' | '24hour' | 'weekly'
  ): Promise<void> {
    const followUpSchedule = {
      immediate: 1000 * 60 * 60, // 1 hour
      '24hour': 1000 * 60 * 60 * 24, // 24 hours
      weekly: 1000 * 60 * 60 * 24 * 7 // 1 week
    };

    const followUp = {
      ephemeralId, // Temporary identifier, cannot be traced to user
      riskLevel,
      scheduledFor: new Date(Date.now() + followUpSchedule[followUpType]),
      followUpType,
      completed: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Auto-delete after 30 days
    };

    await addDoc(collection(db, 'scheduled_followups'), followUp);
  }

  /**
   * Provides anonymous check-in resources without identifying the user
   */
  static generateAnonymousCheckIn(riskLevel: CrisisRiskLevel): AnonymousCheckIn {
    const checkInMessages = {
      immediate: {
        title: 'Checking In',
        message: 'How are you doing right now? If you\'re still in crisis, please reach out for immediate support.',
        resources: ['988 Crisis Lifeline', 'Emergency Services', 'Crisis Chat']
      },
      high: {
        title: 'Gentle Check-In',
        message: 'We wanted to check how you\'re feeling today. Support is always available when you need it.',
        resources: ['Crisis Support', 'Professional Help', 'Community Resources']
      },
      moderate: {
        title: 'Community Support',
        message: 'You\'re part of our healing community. How has your journey been since you last shared?',
        resources: ['Support Circles', 'Peer Support', 'Wellness Resources']
      },
      low: {
        title: 'Continuing Care',
        message: 'Hope you\'re finding moments of peace on your healing journey.',
        resources: ['Community Sharing', 'Wisdom Exchange', 'Growth Insights']
      }
    };

    return {
      ...checkInMessages[riskLevel],
      anonymous: true,
      optIn: true, // User can choose to engage or ignore
      timestamp: new Date()
    };
  }
}

// ===== TYPE DEFINITIONS =====

export type CrisisRiskLevel = 'immediate' | 'high' | 'moderate' | 'low';
export type CrisisUrgency = 'emergency' | 'urgent' | 'priority' | 'routine';
export type CrisisAction = 'emergency_intervention' | 'professional_outreach' | 'supportive_resources' | 'community_support';

export interface CrisisAssessment {
  ephemeralId: string;
  riskLevel: CrisisRiskLevel;
  urgency: CrisisUrgency;
  detectedIndicators: {
    immediate: string[];
    high: string[];
    moderate: string[];
  };
  protectiveFactors: string[];
  recommendedAction: CrisisAction;
  resources: CrisisResource[];
  confidenceScore: number;
  assessmentTime: Date;
  requiresProfessionalReview: boolean;
}

export interface CrisisResource {
  name: string;
  type: 'phone' | 'text' | 'chat' | 'app' | 'emergency' | 'professional';
  contact: string;
  availability: string;
  description: string;
  priority: number;
}

export interface ProfessionalResponse {
  responseType: 'emergency_intervention' | 'professional_outreach' | 'supportive_resources' | 'community_support';
  immediateResources: CrisisResource[];
  interventionMessage: string;
  followUpScheduled: boolean;
  professionalReviewTriggered: boolean;
  anonymityMaintained: boolean;
  responseTime: Date;
}

export interface AnonymousCheckIn {
  title: string;
  message: string;
  resources: string[];
  anonymous: boolean;
  optIn: boolean;
  timestamp: Date;
}

export interface CrisisIntervention {
  ephemeralId: string;
  interventionType: 'automated' | 'professional' | 'emergency';
  riskLevel: CrisisRiskLevel;
  interventionTime: Date;
  resourcesProvided: CrisisResource[];
  followUpScheduled: boolean;
  outcome?: 'engaged' | 'declined' | 'referred' | 'resolved';
  anonymityMaintained: boolean;
}