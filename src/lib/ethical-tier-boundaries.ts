/**
 * Ethical Tier Boundaries and Safeguards for Khepera Tiered Guidance System
 * 
 * This system ensures we never exploit vulnerable users or create harmful payment pressure
 * during mental health crises. All tier restrictions prioritize user wellbeing over revenue.
 */

export interface EthicalBoundary {
  feature: string;
  description: string;
  sanctuaryTier: boolean; // Always available for free users
  deepCutTier: boolean;
  oracleTier: boolean;
  essentialMentalHealth: boolean; // Never paywalled
  vulnerabilityExploitation: 'none' | 'low' | 'medium' | 'high';
}

export interface UserVulnerabilityState {
  isCrisisDetected: boolean;
  isEmotionallyDistressed: boolean;
  hasRecentTrauma: boolean;
  isNewUser: boolean; // First 7 days
  hasFinancialStress: boolean;
  lastUpgradePrompt: Date | null;
}

export interface TierUpgradeEthics {
  canShowUpgrade: boolean;
  reason: string;
  coolingOffPeriod: number; // Hours until next prompt allowed
  upgradeContext: 'celebration' | 'milestone' | 'capability_demonstration' | 'none';
}

// Essential Mental Health Features - NEVER Paywalled
export const UNIVERSAL_SAFETY_FEATURES: EthicalBoundary[] = [
  {
    feature: 'Crisis Detection & Intervention',
    description: 'Immediate crisis support and resource access',
    sanctuaryTier: true,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: true,
    vulnerabilityExploitation: 'none'
  },
  {
    feature: 'Emergency Contact Integration',
    description: '988 Crisis Lifeline, Text HOME to 741741, emergency services',
    sanctuaryTier: true,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: true,
    vulnerabilityExploitation: 'none'
  },
  {
    feature: 'Basic Privacy Controls',
    description: 'Data ownership, deletion rights, consent management',
    sanctuaryTier: true,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: true,
    vulnerabilityExploitation: 'none'
  },
  {
    feature: 'Essential Emotional Safety',
    description: 'Exit options, boundary setting, session intensity controls',
    sanctuaryTier: true,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: true,
    vulnerabilityExploitation: 'none'
  },
  {
    feature: 'Core Trauma-Informed Interactions',
    description: 'Respectful communication, user autonomy, healing pace respect',
    sanctuaryTier: true,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: true,
    vulnerabilityExploitation: 'none'
  },
  {
    feature: 'Basic Reflection Prompts',
    description: 'Essential journaling support and gentle encouragement',
    sanctuaryTier: true,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: true,
    vulnerabilityExploitation: 'none'
  },
  {
    feature: 'Simple Progress Acknowledgment',
    description: 'Basic recognition of user effort and presence',
    sanctuaryTier: true,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: true,
    vulnerabilityExploitation: 'none'
  }
];

// Enhancement Features - Ethical Tier Differentiation
export const ENHANCEMENT_FEATURES: EthicalBoundary[] = [
  {
    feature: 'Advanced Pattern Recognition',
    description: 'Sophisticated emotional trend analysis and insights',
    sanctuaryTier: false,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: false,
    vulnerabilityExploitation: 'low'
  },
  {
    feature: 'Personalized Growth Pathways',
    description: 'Adaptive learning curricula based on individual patterns',
    sanctuaryTier: false,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: false,
    vulnerabilityExploitation: 'low'
  },
  {
    feature: 'Coach Archetype Access',
    description: 'Empowering, action-oriented guidance style',
    sanctuaryTier: false,
    deepCutTier: true,
    oracleTier: true,
    essentialMentalHealth: false,
    vulnerabilityExploitation: 'none'
  },
  {
    feature: 'Professional Documentation',
    description: 'Therapy-ready progress reports and assessments',
    sanctuaryTier: false,
    deepCutTier: false,
    oracleTier: true,
    essentialMentalHealth: false,
    vulnerabilityExploitation: 'none'
  },
  {
    feature: 'Poet Archetype Access',
    description: 'Transformative metaphorical guidance for meaning-making',
    sanctuaryTier: false,
    deepCutTier: false,
    oracleTier: true,
    essentialMentalHealth: false,
    vulnerabilityExploitation: 'none'
  },
  {
    feature: 'Community Connections',
    description: 'Moderated peer support and mentorship matching',
    sanctuaryTier: false,
    deepCutTier: false,
    oracleTier: true,
    essentialMentalHealth: false,
    vulnerabilityExploitation: 'low'
  },
  {
    feature: 'Professional Integration',
    description: 'Healthcare EHR integration and consultation facilitation',
    sanctuaryTier: false,
    deepCutTier: false,
    oracleTier: true,
    essentialMentalHealth: false,
    vulnerabilityExploitation: 'none'
  }
];

/**
 * Ethical Tier Upgrade Assessment
 * 
 * Determines if it's ethical to show tier upgrade suggestions based on user state
 */
export function assessUpgradeEthics(
  userState: UserVulnerabilityState,
  currentTier: 'sanctuary' | 'deep_cut' | 'oracle',
  recentMilestones: string[]
): TierUpgradeEthics {
  // NEVER show upgrades during crisis or distress
  if (userState.isCrisisDetected || userState.isEmotionallyDistressed) {
    return {
      canShowUpgrade: false,
      reason: 'User is in crisis or emotionally distressed - no upgrade prompts during vulnerable states',
      coolingOffPeriod: 168, // 1 week
      upgradeContext: 'none'
    };
  }

  // Respect cooling-off periods
  if (userState.lastUpgradePrompt) {
    const hoursSinceLastPrompt = (Date.now() - userState.lastUpgradePrompt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastPrompt < 72) { // Minimum 3 days between prompts
      return {
        canShowUpgrade: false,
        reason: 'Cooling-off period - respecting user autonomy with minimum 72-hour gaps',
        coolingOffPeriod: 72 - hoursSinceLastPrompt,
        upgradeContext: 'none'
      };
    }
  }

  // New users need time to establish baseline (7 days minimum)
  if (userState.isNewUser) {
    return {
      canShowUpgrade: false,
      reason: 'New user protection - allowing 7 days to establish emotional baseline',
      coolingOffPeriod: 168, // 1 week
      upgradeContext: 'none'
    };
  }

  // Financial stress protection
  if (userState.hasFinancialStress) {
    return {
      canShowUpgrade: false,
      reason: 'Financial stress detected - protecting user from economic pressure',
      coolingOffPeriod: 168, // 1 week
      upgradeContext: 'none'
    };
  }

  // Only show upgrades during positive milestones
  const positiveContext = recentMilestones.some(milestone => 
    milestone.includes('breakthrough') || 
    milestone.includes('growth') || 
    milestone.includes('milestone') ||
    milestone.includes('achievement')
  );

  if (!positiveContext) {
    return {
      canShowUpgrade: false,
      reason: 'No recent positive milestones - upgrades only suggested during celebration moments',
      coolingOffPeriod: 24,
      upgradeContext: 'none'
    };
  }

  // Ethical upgrade opportunity
  return {
    canShowUpgrade: true,
    reason: 'Positive milestone achieved - ethical upgrade suggestion during celebration',
    coolingOffPeriod: 0,
    upgradeContext: 'celebration'
  };
}

/**
 * Feature Access Control with Ethical Boundaries
 */
export function canAccessFeature(
  feature: string,
  userTier: 'sanctuary' | 'deep_cut' | 'oracle',
  userState: UserVulnerabilityState
): { canAccess: boolean; reason: string; alternative?: string } {
  const featureConfig = [...UNIVERSAL_SAFETY_FEATURES, ...ENHANCEMENT_FEATURES]
    .find(f => f.feature === feature);

  if (!featureConfig) {
    return {
      canAccess: false,
      reason: 'Feature not found in ethical boundary configuration'
    };
  }

  // Essential mental health features are always accessible
  if (featureConfig.essentialMentalHealth) {
    return {
      canAccess: true,
      reason: 'Essential mental health feature - always accessible regardless of tier'
    };
  }

  // Check tier access
  const tierAccess = {
    sanctuary: featureConfig.sanctuaryTier,
    deep_cut: featureConfig.deepCutTier,
    oracle: featureConfig.oracleTier
  };

  if (!tierAccess[userTier]) {
    // Provide constructive alternatives instead of restrictions
    const alternative = getAlternativeFeature(feature, userTier);
    return {
      canAccess: false,
      reason: `Feature available in higher tier - current tier provides complete emotional safety`,
      alternative
    };
  }

  return {
    canAccess: true,
    reason: 'Feature accessible in current tier'
  };
}

/**
 * Provide constructive alternatives when tier features aren't available
 */
function getAlternativeFeature(feature: string, userTier: 'sanctuary' | 'deep_cut' | 'oracle'): string {
  const alternatives: Record<string, string> = {
    'Advanced Pattern Recognition': 'Basic reflection prompts help you notice your emotional patterns organically',
    'Personalized Growth Pathways': 'Essential prompts guide your natural growth journey at your own pace',
    'Coach Archetype Access': 'Sage archetype provides wisdom-based guidance that honors your inner knowing',
    'Professional Documentation': 'Simple progress acknowledgment celebrates your growth without formal tracking',
    'Poet Archetype Access': 'Sage archetype offers wisdom that connects your experience to universal truths',
    'Community Connections': 'Focus on your personal healing journey with complete privacy and safety',
    'Professional Integration': 'Crisis resources connect you with professional support when needed'
  };

  return alternatives[feature] || 'Your current tier provides complete emotional safety and basic growth tools';
}

/**
 * Privacy Compliance Manager
 */
export interface PrivacyCompliance {
  tier: 'sanctuary' | 'deep_cut' | 'oracle';
  dataRetention: number; // Days
  encryptionLevel: 'standard' | 'enhanced' | 'professional';
  auditTrail: boolean;
  professionalSharing: boolean;
  thirdPartyIntegration: boolean;
  anonymizationLevel: 'basic' | 'advanced' | 'professional';
}

export const PRIVACY_COMPLIANCE_BY_TIER: Record<string, PrivacyCompliance> = {
  sanctuary: {
    tier: 'sanctuary',
    dataRetention: 365, // 1 year
    encryptionLevel: 'standard',
    auditTrail: false,
    professionalSharing: false,
    thirdPartyIntegration: false,
    anonymizationLevel: 'basic'
  },
  deep_cut: {
    tier: 'deep_cut',
    dataRetention: 730, // 2 years
    encryptionLevel: 'enhanced',
    auditTrail: true,
    professionalSharing: false,
    thirdPartyIntegration: false,
    anonymizationLevel: 'advanced'
  },
  oracle: {
    tier: 'oracle',
    dataRetention: 2555, // 7 years (HIPAA compliance)
    encryptionLevel: 'professional',
    auditTrail: true,
    professionalSharing: true, // With explicit consent
    thirdPartyIntegration: true, // With explicit consent
    anonymizationLevel: 'professional'
  }
};

/**
 * Cooling-Off Period Manager
 */
export class CoolingOffManager {
  static readonly MINIMUM_UPGRADE_INTERVAL = 72; // Hours
  static readonly CRISIS_PROTECTION_PERIOD = 168; // 1 week
  static readonly NEW_USER_PROTECTION = 168; // 1 week

  static canShowUpgradePrompt(
    lastPrompt: Date | null,
    userState: UserVulnerabilityState
  ): { canShow: boolean; nextAvailable: Date | null } {
    if (userState.isCrisisDetected || userState.isEmotionallyDistressed) {
      const nextAvailable = new Date(Date.now() + this.CRISIS_PROTECTION_PERIOD * 60 * 60 * 1000);
      return { canShow: false, nextAvailable };
    }

    if (userState.isNewUser) {
      const nextAvailable = new Date(Date.now() + this.NEW_USER_PROTECTION * 60 * 60 * 1000);
      return { canShow: false, nextAvailable };
    }

    if (lastPrompt) {
      const timeSincePrompt = Date.now() - lastPrompt.getTime();
      const hoursSince = timeSincePrompt / (1000 * 60 * 60);
      
      if (hoursSince < this.MINIMUM_UPGRADE_INTERVAL) {
        const nextAvailable = new Date(
          lastPrompt.getTime() + this.MINIMUM_UPGRADE_INTERVAL * 60 * 60 * 1000
        );
        return { canShow: false, nextAvailable };
      }
    }

    return { canShow: true, nextAvailable: null };
  }
}

/**
 * Ethical AI Guidelines for Vulnerable Populations
 */
export const ETHICAL_AI_GUIDELINES = {
  // Responses must prioritize user wellbeing over engagement
  prioritizeWellbeing: true,
  
  // Never exploit vulnerability for commercial gain
  noVulnerabilityExploitation: true,
  
  // Respect healing timelines (no pressure for faster progress)
  respectHealingPace: true,
  
  // Maintain therapeutic boundaries in all interactions
  therapeuticBoundaries: true,
  
  // Provide genuine value, not artificial engagement
  genuineValue: true,
  
  // Support user autonomy and informed decision-making
  userAutonomy: true,
  
  // Cultural responsiveness and intersectional awareness
  culturalCompetency: true,
  
  // Crisis prevention and safety prioritization
  crisisPrevention: true
};

/**
 * Consent Management for Tier Transitions
 */
export interface TierTransitionConsent {
  userId: string;
  fromTier: string;
  toTier: string;
  consentGiven: boolean;
  consentTimestamp: Date;
  coolingOffExpiry: Date;
  informedConsentProvided: boolean;
  vulnerabilityStateAtConsent: UserVulnerabilityState;
  canWithdrawUntil: Date; // 7-day withdrawal period
}

export function validateTierTransitionConsent(
  consent: TierTransitionConsent,
  currentTime: Date = new Date()
): { isValid: boolean; reason: string; canProceed: boolean } {
  // Check if still in withdrawal period
  if (currentTime < consent.canWithdrawUntil) {
    return {
      isValid: true,
      reason: 'Within 7-day withdrawal period - user can still change their mind',
      canProceed: false
    };
  }

  // Check if consent was given during vulnerable state
  if (consent.vulnerabilityStateAtConsent.isCrisisDetected || 
      consent.vulnerabilityStateAtConsent.isEmotionallyDistressed) {
    return {
      isValid: false,
      reason: 'Consent given during vulnerable state - invalid for protection',
      canProceed: false
    };
  }

  // Check informed consent
  if (!consent.informedConsentProvided) {
    return {
      isValid: false,
      reason: 'Informed consent not properly provided',
      canProceed: false
    };
  }

  return {
    isValid: true,
    reason: 'Valid consent with proper safeguards',
    canProceed: true
  };
}

export default {
  UNIVERSAL_SAFETY_FEATURES,
  ENHANCEMENT_FEATURES,
  assessUpgradeEthics,
  canAccessFeature,
  PRIVACY_COMPLIANCE_BY_TIER,
  CoolingOffManager,
  ETHICAL_AI_GUIDELINES,
  validateTierTransitionConsent
};