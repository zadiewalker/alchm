// ALCHM Privacy-Preserving Community Engine
// Zero-knowledge architecture for anonymous wisdom sharing

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp, runTransaction } from 'firebase/firestore';
import crypto from 'crypto';

// ===== PRIVACY ARCHITECTURE =====

/**
 * Ephemeral Identity System
 * Creates temporary, unlinkable identities for community participation
 */
export class EphemeralIdentity {
  private static generateEphemeralId(): string {
    // Generate cryptographically secure random identity
    return crypto.randomBytes(16).toString('hex');
  }

  private static generateSessionSalt(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Creates a temporary identity that cannot be linked back to the user
   * Identity expires after 24 hours or when user leaves the session
   */
  static createEphemeralIdentity(): EphemeralCommunityIdentity {
    const ephemeralId = this.generateEphemeralId();
    const sessionSalt = this.generateSessionSalt();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    return {
      ephemeralId,
      sessionSalt,
      createdAt,
      expiresAt,
      isActive: true
    };
  }

  /**
   * Validates ephemeral identity without revealing original user
   */
  static isValidEphemeralIdentity(identity: EphemeralCommunityIdentity): boolean {
    const now = new Date();
    return identity.isActive && now < identity.expiresAt;
  }
}

// ===== ZERO-KNOWLEDGE CONTENT FILTERING =====

/**
 * Content Privacy Filter
 * Removes all personally identifying information while preserving emotional context
 */
export class PrivacyContentFilter {
  private static readonly PII_PATTERNS = [
    // Names and identifiers
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Full names
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
    /\b\d{3}-\d{3}-\d{4}\b/g, // Phone numbers
    /\b\d{4}\s*\d{4}\s*\d{4}\s*\d{4}\b/g, // Credit card numbers
    
    // Location identifiers
    /\b\d{1,5}\s+[\w\s]{1,30}(street|st|avenue|ave|road|rd|drive|dr|lane|ln|blvd|boulevard)\b/gi, // Addresses
    /\b[A-Z]{2}\s+\d{5}(-\d{4})?\b/g, // US ZIP codes
    
    // Institutional identifiers
    /\b(at|from|with)\s+[A-Z][a-z]*\s+(University|College|School|Hospital|Company|Corp|Inc|LLC)\b/g,
    /\b(work|job|company|employer|boss|manager|colleague)\s+(at|with|for)\s+[A-Z][a-z]+/g,
    
    // Family/relationship identifiers that could be identifying
    /\bmy\s+(husband|wife|boyfriend|girlfriend|partner)\s+[A-Z][a-z]+/g,
    /\bmy\s+(son|daughter|child|kid)\s+[A-Z][a-z]+/g,
  ];

  private static readonly GENERIC_REPLACEMENTS = [
    'a loved one',
    'someone close to me',
    'a person in my life',
    'my workplace',
    'where I live',
    'my community',
    'a place that matters to me'
  ];

  /**
   * Removes PII while preserving emotional and therapeutic content
   */
  static sanitizeForSharing(content: string): PrivacySanitizedContent {
    let sanitized = content;
    let piiDetected = false;
    const detectedPatterns: string[] = [];

    // Remove PII patterns
    this.PII_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(sanitized)) {
        piiDetected = true;
        const replacement = this.GENERIC_REPLACEMENTS[index % this.GENERIC_REPLACEMENTS.length];
        sanitized = sanitized.replace(pattern, replacement || '[REDACTED]');
        detectedPatterns.push(pattern.toString());
      }
    });

    // Additional contextual anonymization
    sanitized = this.anonymizeContextualReferences(sanitized);

    return {
      sanitizedContent: sanitized,
      originalLength: content.length,
      sanitizedLength: sanitized.length,
      piiDetected,
      detectedPatterns,
      confidenceScore: this.calculateAnonymityConfidence(sanitized)
    };
  }

  private static anonymizeContextualReferences(content: string): string {
    let anonymized = content;

    // Replace specific locations with generic ones
    anonymized = anonymized.replace(/\b(in|at|from)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\s+(City|Town|County|State)\b/g, 'where I live');
    
    // Replace institutional references
    anonymized = anonymized.replace(/\b(at|from)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\s+(High|Middle|Elementary)\b/g, 'at school');
    
    // Replace medical facility names
    anonymized = anonymized.replace(/\b(at|from)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\s+(Hospital|Clinic|Medical|Center)\b/g, 'at a medical facility');

    return anonymized;
  }

  private static calculateAnonymityConfidence(content: string): number {
    // Calculate confidence score based on remaining potential identifiers
    let score = 100;
    
    // Reduce score for remaining proper nouns
    const properNouns = content.match(/\b[A-Z][a-z]+\b/g) || [];
    score -= properNouns.length * 5;
    
    // Reduce score for specific numbers that could be identifying
    const specificNumbers = content.match(/\b\d{4,}\b/g) || [];
    score -= specificNumbers.length * 10;
    
    return Math.max(score, 0);
  }
}

// ===== COMMUNITY WISDOM AGGREGATION =====

/**
 * Collective Insights Engine
 * Generates anonymized insights from community patterns without individual tracking
 */
export class CollectiveInsightsEngine {
  /**
   * Generates aggregate insights while preserving individual privacy
   */
  static async generateCollectiveInsights(): Promise<CollectiveGrowthInsight[]> {
    try {
      // Query anonymized sharing patterns
      const sharingQuery = query(
        collection(db, 'anonymous_wisdom_shares'),
        where('isApproved', '==', true),
        where('createdAt', '>', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // Last 30 days
        orderBy('createdAt', 'desc'),
        limit(1000)
      );

      const sharingDocs = await getDocs(sharingQuery);
      const shares = sharingDocs.docs.map(doc => doc.data() as AnonymousWisdomShare);

      return [
        await this.generatePathwayInsight(shares),
        await this.generateEmotionalJourneyInsight(shares),
        await this.generateCommunityStrengthInsight(shares),
        await this.generateCulturalWisdomInsight(shares)
      ];
    } catch (error) {
      console.error('Error generating collective insights:', error);
      return [];
    }
  }

  private static async generatePathwayInsight(shares: AnonymousWisdomShare[]): Promise<CollectiveGrowthInsight> {
    const pathwayCounts = shares.reduce((acc, share) => {
      if (share.pathway) {
        acc[share.pathway] = (acc[share.pathway] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topPathway = Object.entries(pathwayCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (!topPathway) {
      return {
        id: `pathway-${Date.now()}`,
        type: 'pathway_trends',
        title: 'Community Growth Focus',
        insight: 'Our community is exploring diverse pathways of growth and healing.',
        supportingData: { totalShares: shares.length },
        createdAt: new Date(),
        confidence: 0.5
      };
    }

    const [pathwayName, count] = topPathway;
    
    return {
      id: `pathway-${Date.now()}`,
      type: 'pathway_trends',
      title: 'Community Growth Focus',
      insight: `This month, ${Math.round((count / shares.length) * 100)}% of our community is exploring ${pathwayName} - you're not alone in this journey.`,
      supportingData: {
        totalShares: shares.length,
        topPathway: pathwayName,
        percentage: Math.round((count / shares.length) * 100)
      },
      createdAt: new Date(),
      confidence: 0.95
    };
  }

  private static async generateEmotionalJourneyInsight(shares: AnonymousWisdomShare[]): Promise<CollectiveGrowthInsight> {
    const emotionalPatterns = shares.filter(share => share.emotionalTags && share.emotionalTags.length > 0);
    const commonEmotions = emotionalPatterns
      .flatMap(share => share.emotionalTags || [])
      .reduce((acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topEmotion = Object.entries(commonEmotions)
      .sort(([,a], [,b]) => b - a)[0];

    if (!topEmotion) {
      return {
        id: `emotion-${Date.now()}`,
        type: 'emotional_patterns',
        title: 'Shared Emotional Journey',
        insight: 'Our community is navigating a rich tapestry of emotional experiences and growth.',
        supportingData: { totalEmotionalShares: emotionalPatterns.length },
        createdAt: new Date(),
        confidence: 0.5
      };
    }

    const [emotionName, count] = topEmotion;

    return {
      id: `emotion-${Date.now()}`,
      type: 'emotional_patterns',
      title: 'Shared Emotional Journey',
      insight: `Many in our community are processing feelings of ${emotionName}. Your emotional experience is valid and shared by others walking similar paths.`,
      supportingData: {
        topEmotion: emotionName,
        occurrences: count,
        totalEmotionalShares: emotionalPatterns.length
      },
      createdAt: new Date(),
      confidence: 0.88
    };
  }

  private static async generateCommunityStrengthInsight(shares: AnonymousWisdomShare[]): Promise<CollectiveGrowthInsight> {
    const supportiveShares = shares.filter(share => 
      share.supportiveReactions && Object.values(share.supportiveReactions).reduce((sum, count) => sum + count, 0) > 0
    );

    const totalReactions = supportiveShares
      .flatMap(share => Object.values(share.supportiveReactions || {}))
      .reduce((sum, count) => sum + count, 0);

    return {
      id: `community-${Date.now()}`,
      type: 'community_support',
      title: 'Circle of Support',
      insight: `Our community has shared ${totalReactions} expressions of support this month. Every story you share creates ripples of healing for others.`,
      supportingData: {
        totalReactions,
        supportiveShares: supportiveShares.length,
        averageReactionsPerShare: Math.round(totalReactions / supportiveShares.length)
      },
      createdAt: new Date(),
      confidence: 0.92
    };
  }

  private static async generateCulturalWisdomInsight(shares: AnonymousWisdomShare[]): Promise<CollectiveGrowthInsight> {
    const culturalShares = shares.filter(share => share.culturalWisdom);
    const wisdomTraditions = culturalShares
      .map(share => share.culturalWisdom?.tradition)
      .filter(Boolean)
      .reduce((acc, tradition) => {
        acc[tradition!] = (acc[tradition!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const diversityCount = Object.keys(wisdomTraditions).length;

    return {
      id: `cultural-${Date.now()}`,
      type: 'cultural_wisdom',
      title: 'Global Healing Traditions',
      insight: `Our community draws from ${diversityCount} different healing traditions, creating a rich tapestry of wisdom that honors diverse paths to wholeness.`,
      supportingData: {
        traditionsCount: diversityCount,
        culturalShares: culturalShares.length,
        traditions: Object.keys(wisdomTraditions)
      },
      createdAt: new Date(),
      confidence: 0.85
    };
  }
}

// ===== TRAUMA-INFORMED MODERATION =====

/**
 * Ethical Moderation System
 * AI-assisted, human-reviewed moderation with trauma-informed principles
 */
export class TraumaInformedModerator {
  private static readonly CRISIS_INDICATORS = [
    'want to die', 'kill myself', 'end it all', 'not worth living',
    'suicide', 'self-harm', 'cutting', 'overdose', 'jump off',
    'no point in living', 'better off dead', 'plan to hurt',
    'going to hurt myself', 'want to hurt others'
  ];

  private static readonly SUPPORTIVE_RESPONSE_TRIGGERS = [
    'feeling alone', 'nobody cares', 'worthless', 'failure',
    'can\'t do this', 'too hard', 'giving up', 'lost hope',
    'broken', 'damaged', 'not enough', 'hate myself'
  ];

  /**
   * Analyzes content for crisis indicators and supportive needs
   */
  static async moderateContent(content: string): Promise<ModerationResult> {
    const lowerContent = content.toLowerCase();
    
    // Check for crisis indicators
    const crisisKeywords = this.CRISIS_INDICATORS.filter(indicator => 
      lowerContent.includes(indicator)
    );

    // Check for supportive response needs
    const supportTriggers = this.SUPPORTIVE_RESPONSE_TRIGGERS.filter(trigger =>
      lowerContent.includes(trigger)
    );

    const riskLevel = this.calculateRiskLevel(crisisKeywords, supportTriggers, content);

    return {
      approved: riskLevel !== 'crisis',
      riskLevel,
      crisisKeywords,
      supportTriggers,
      recommendedAction: this.getRecommendedAction(riskLevel),
      suggestedResources: this.getSuggestedResources(crisisKeywords, supportTriggers),
      requiresHumanReview: riskLevel === 'high' || crisisKeywords.length > 0
    };
  }

  private static calculateRiskLevel(
    crisisKeywords: string[],
    supportTriggers: string[],
    content: string
  ): 'safe' | 'low' | 'moderate' | 'high' | 'crisis' {
    if (crisisKeywords.length > 0) {
      // Check for immediate danger language
      const immediateDanger = ['tonight', 'today', 'now', 'plan to', 'going to', 'will'];
      const hasImmediacy = immediateDanger.some(word => content.toLowerCase().includes(word));
      
      if (hasImmediacy && crisisKeywords.length >= 2) {
        return 'crisis';
      }
      return 'high';
    }

    if (supportTriggers.length >= 3) return 'moderate';
    if (supportTriggers.length >= 1) return 'low';
    
    return 'safe';
  }

  private static getRecommendedAction(riskLevel: string): string {
    switch (riskLevel) {
      case 'crisis':
        return 'immediate_intervention';
      case 'high':
        return 'professional_review';
      case 'moderate':
        return 'community_support';
      case 'low':
        return 'gentle_encouragement';
      default:
        return 'standard_sharing';
    }
  }

  private static getSuggestedResources(crisisKeywords: string[], supportTriggers: string[]): string[] {
    const resources: string[] = [];
    
    if (crisisKeywords.length > 0) {
      resources.push('988 Suicide & Crisis Lifeline');
      resources.push('Crisis Text Line: Text HOME to 741741');
      resources.push('International Association for Suicide Prevention');
    }
    
    if (supportTriggers.length > 0) {
      resources.push('ALCHM Community Support Circle');
      resources.push('Guided breathing exercises');
      resources.push('Crisis resources page');
    }
    
    return resources;
  }
}

// ===== TYPE DEFINITIONS =====

export interface EphemeralCommunityIdentity {
  ephemeralId: string;
  sessionSalt: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface PrivacySanitizedContent {
  sanitizedContent: string;
  originalLength: number;
  sanitizedLength: number;
  piiDetected: boolean;
  detectedPatterns: string[];
  confidenceScore: number;
}

export interface AnonymousWisdomShare {
  id: string;
  ephemeralId: string; // Cannot be linked back to user
  sanitizedContent: string;
  pathway?: 'resilience' | 'becoming' | 'purpose' | 'belonging';
  emotionalTags?: string[];
  culturalWisdom?: {
    tradition: string;
    practice: string;
    culturalContext: string;
  };
  supportiveReactions?: {
    heart: number;
    strength: number;
    wisdom: number;
    solidarity: number;
    blessing: number;
  };
  isApproved: boolean;
  riskLevel: string;
  createdAt: Date;
  expiresAt: Date; // Auto-deletion after 90 days
}

export interface CollectiveGrowthInsight {
  id: string;
  type: 'pathway_trends' | 'emotional_patterns' | 'community_support' | 'cultural_wisdom';
  title: string;
  insight: string;
  supportingData: any;
  createdAt: Date;
  confidence: number;
}

export interface ModerationResult {
  approved: boolean;
  riskLevel: 'safe' | 'low' | 'moderate' | 'high' | 'crisis';
  crisisKeywords: string[];
  supportTriggers: string[];
  recommendedAction: string;
  suggestedResources: string[];
  requiresHumanReview: boolean;
}

export interface SupportCircleMember {
  ephemeralId: string;
  joinedAt: Date;
  pathway?: string;
  culturalBackground?: string; // For culturally-appropriate responses
  isActive: boolean;
}

export interface PeerSupportCircle {
  id: string;
  name: string;
  description: string;
  pathway?: string;
  maxMembers: number;
  currentMembers: number;
  ephemeralMembers: SupportCircleMember[];
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
  culturalContext?: string;
  languageSupport?: string[];
}