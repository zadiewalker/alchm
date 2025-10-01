/**
 * Trauma-Informed Progression Validator for Khepera Tiered Guidance System
 * 
 * This system ensures that all tier progressions respect individual healing timelines,
 * maintain therapeutic boundaries, and never pressure users beyond their emotional capacity.
 */

export interface HealingTimeline {
  userId: string;
  tierJourney: TierProgression[];
  emotionalCapacityHistory: EmotionalCapacitySnapshot[];
  traumaMarkers: TraumaMarker[];
  healingMilestones: HealingMilestone[];
  currentStabilityLevel: 'crisis' | 'vulnerable' | 'stable' | 'thriving';
  recommendedPacing: 'slower' | 'natural' | 'accelerated';
}

export interface TierProgression {
  tier: 'sanctuary' | 'deep_cut' | 'oracle';
  startDate: Date;
  endDate?: Date;
  transitionReason: string;
  emotionalReadiness: boolean;
  externalPressure: boolean; // Flag for concerning transitions
  stabilityAtTransition: 'crisis' | 'vulnerable' | 'stable' | 'thriving';
}

export interface EmotionalCapacitySnapshot {
  timestamp: Date;
  overallCapacity: number; // 0-100
  stressLevel: number; // 0-100
  regulationSkills: number; // 0-100
  supportNetworkStrength: number; // 0-100
  traumaActivation: number; // 0-100 (lower is better)
  selfCompassionLevel: number; // 0-100
  boundaryStrength: number; // 0-100
}

export interface TraumaMarker {
  type: 'acute' | 'chronic' | 'complex' | 'recent' | 'anniversary';
  severity: 'mild' | 'moderate' | 'severe';
  detectedDate: Date;
  resolutionDate?: Date;
  impactOnProgression: 'minimal' | 'moderate' | 'significant';
  requiredPacing: 'pause' | 'slower' | 'maintain' | 'gentle';
}

export interface HealingMilestone {
  type: 'emotional_regulation' | 'self_awareness' | 'boundary_setting' | 'meaning_making' | 'community_connection' | 'spiritual_growth';
  achievedDate: Date;
  sustainabilityPeriod: number; // Days milestone has been sustained
  tier: 'sanctuary' | 'deep_cut' | 'oracle';
  naturalProgression: boolean; // True if achieved without pressure
}

/**
 * Trauma-Informed Progression Assessment
 */
export function assessProgressionReadiness(
  healingTimeline: HealingTimeline,
  targetTier: 'deep_cut' | 'oracle'
): {
  isReady: boolean;
  reason: string;
  recommendedWaitPeriod: number; // Days
  requiredMilestones: string[];
  safetyConsiderations: string[];
} {
  const currentCapacity = getCurrentEmotionalCapacity(healingTimeline);
  const recentTrauma = getRecentTraumaMarkers(healingTimeline);
  const sustainedMilestones = getSustainedMilestones(healingTimeline);

  // Critical safety checks
  if (healingTimeline.currentStabilityLevel === 'crisis' || healingTimeline.currentStabilityLevel === 'vulnerable') {
    return {
      isReady: false,
      reason: 'Current emotional state requires stability before tier progression',
      recommendedWaitPeriod: 30,
      requiredMilestones: ['emotional_regulation', 'boundary_setting'],
      safetyConsiderations: ['Prioritize emotional safety and regulation', 'Focus on current tier healing tools']
    };
  }

  // Trauma activation check
  if (currentCapacity.traumaActivation > 60) {
    return {
      isReady: false,
      reason: 'Recent trauma activation detected - healing pace should honor current process',
      recommendedWaitPeriod: 14,
      requiredMilestones: ['emotional_regulation'],
      safetyConsiderations: ['Allow trauma processing time', 'Maintain consistent support']
    };
  }

  // Emotional capacity threshold
  if (currentCapacity.overallCapacity < 70) {
    return {
      isReady: false,
      reason: 'Emotional capacity building recommended before additional complexity',
      recommendedWaitPeriod: 21,
      requiredMilestones: ['emotional_regulation', 'self_awareness'],
      safetyConsiderations: ['Build emotional capacity gradually', 'Strengthen regulation skills']
    };
  }

  // Tier-specific requirements
  if (targetTier === 'deep_cut') {
    return assessDeepCutReadiness(healingTimeline, currentCapacity, sustainedMilestones);
  } else if (targetTier === 'oracle') {
    return assessOracleReadiness(healingTimeline, currentCapacity, sustainedMilestones);
  }

  return {
    isReady: false,
    reason: 'Unknown target tier',
    recommendedWaitPeriod: 7,
    requiredMilestones: [],
    safetyConsiderations: []
  };
}

/**
 * Deep Cut Tier Readiness Assessment
 */
function assessDeepCutReadiness(
  healingTimeline: HealingTimeline,
  currentCapacity: EmotionalCapacitySnapshot,
  sustainedMilestones: HealingMilestone[]
): ReturnType<typeof assessProgressionReadiness> {
  const requiredMilestones: string[] = [];
  const safetyConsiderations: string[] = [];

  // Check for sustained emotional regulation
  const regulationMilestone = sustainedMilestones.find(m => 
    m.type === 'emotional_regulation' && m.sustainabilityPeriod >= 14
  );
  
  if (!regulationMilestone) {
    requiredMilestones.push('emotional_regulation (sustained 14+ days)');
    safetyConsiderations.push('Establish consistent emotional regulation practices');
  }

  // Check self-awareness development
  if (currentCapacity.selfCompassionLevel < 60) {
    requiredMilestones.push('self_awareness');
    safetyConsiderations.push('Develop self-compassion foundation before advanced pattern work');
  }

  // Check boundary strength
  if (currentCapacity.boundaryStrength < 65) {
    requiredMilestones.push('boundary_setting');
    safetyConsiderations.push('Strengthen personal boundaries for advanced coaching interactions');
  }

  // Minimum time in Sanctuary tier
  const sanctuaryDuration = getSanctuaryTierDuration(healingTimeline);
  if (sanctuaryDuration < 21) { // 3 weeks minimum
    return {
      isReady: false,
      reason: 'Minimum 3 weeks in Sanctuary tier recommended for stable foundation',
      recommendedWaitPeriod: 21 - sanctuaryDuration,
      requiredMilestones,
      safetyConsiderations: [...safetyConsiderations, 'Allow natural progression timeline']
    };
  }

  if (requiredMilestones.length > 0) {
    return {
      isReady: false,
      reason: 'Additional milestone development recommended for Deep Cut readiness',
      recommendedWaitPeriod: 14,
      requiredMilestones,
      safetyConsiderations
    };
  }

  return {
    isReady: true,
    reason: 'Emotional capacity and milestone progression support Deep Cut advancement',
    recommendedWaitPeriod: 0,
    requiredMilestones: [],
    safetyConsiderations: ['Continue honoring your natural healing pace']
  };
}

/**
 * Oracle Tier Readiness Assessment
 */
function assessOracleReadiness(
  healingTimeline: HealingTimeline,
  currentCapacity: EmotionalCapacitySnapshot,
  sustainedMilestones: HealingMilestone[]
): ReturnType<typeof assessProgressionReadiness> {
  const requiredMilestones: string[] = [];
  const safetyConsiderations: string[] = [];

  // Oracle tier requires advanced emotional stability
  if (currentCapacity.overallCapacity < 85) {
    return {
      isReady: false,
      reason: 'Oracle tier requires advanced emotional capacity (85+) for professional-grade tools',
      recommendedWaitPeriod: 30,
      requiredMilestones: ['emotional_regulation', 'self_awareness', 'meaning_making'],
      safetyConsiderations: ['Continue Deep Cut tier development', 'Build advanced emotional skills']
    };
  }

  // Check for comprehensive milestone achievement
  const requiredMilestoneTypes = ['emotional_regulation', 'self_awareness', 'boundary_setting', 'meaning_making'];
  const achievedTypes = sustainedMilestones
    .filter(m => m.sustainabilityPeriod >= 21) // 3 weeks sustained
    .map(m => m.type);

  const missingMilestones = requiredMilestoneTypes.filter(type => !achievedTypes.includes(type));
  
  if (missingMilestones.length > 0) {
    requiredMilestones.push(...missingMilestones.map(type => `${type} (sustained 21+ days)`));
    safetyConsiderations.push('Complete foundational milestone development before advanced spiritual work');
  }

  // Advanced stability requirements
  if (currentCapacity.regulationSkills < 80) {
    safetyConsiderations.push('Strengthen emotional regulation for complex spiritual/meaning-making work');
  }

  if (currentCapacity.boundaryStrength < 75) {
    safetyConsiderations.push('Develop strong boundaries for community and professional integration features');
  }

  // Minimum time in Deep Cut tier
  const deepCutDuration = getDeepCutTierDuration(healingTimeline);
  if (deepCutDuration < 60) { // 2 months minimum
    return {
      isReady: false,
      reason: 'Minimum 2 months in Deep Cut tier recommended for Oracle readiness',
      recommendedWaitPeriod: 60 - deepCutDuration,
      requiredMilestones,
      safetyConsiderations: [...safetyConsiderations, 'Allow Deep Cut tier integration time']
    };
  }

  if (requiredMilestones.length > 0 || safetyConsiderations.length > 2) {
    return {
      isReady: false,
      reason: 'Additional development recommended for Oracle tier comprehensive tools',
      recommendedWaitPeriod: 21,
      requiredMilestones,
      safetyConsiderations
    };
  }

  return {
    isReady: true,
    reason: 'Advanced emotional development supports Oracle tier transformation tools',
    recommendedWaitPeriod: 0,
    requiredMilestones: [],
    safetyConsiderations: ['Continue honoring your unique healing journey']
  };
}

/**
 * Progression Pacing Recommendations
 */
export function getPersonalizedPacing(healingTimeline: HealingTimeline): {
  recommendedPacing: 'slower' | 'natural' | 'accelerated';
  reason: string;
  adjustments: string[];
  checkInFrequency: 'daily' | 'weekly' | 'biweekly';
} {
  const currentCapacity = getCurrentEmotionalCapacity(healingTimeline);
  const recentTrauma = getRecentTraumaMarkers(healingTimeline);
  const progressionHistory = healingTimeline.tierJourney;

  // Slower pacing indicators
  if (recentTrauma.length > 0 || currentCapacity.traumaActivation > 50) {
    return {
      recommendedPacing: 'slower',
      reason: 'Recent trauma activation or markers detected - honoring processing time',
      adjustments: [
        'Reduce session intensity',
        'Focus on stabilization over advancement',
        'Increase grounding and regulation practices',
        'Honor natural healing rhythm'
      ],
      checkInFrequency: 'daily'
    };
  }

  // Fast progression concerns
  const rapidProgression = progressionHistory.length > 1 && 
    progressionHistory.some(p => {
      const duration = p.endDate ? 
        (p.endDate.getTime() - p.startDate.getTime()) / (1000 * 60 * 60 * 24) : 
        (Date.now() - p.startDate.getTime()) / (1000 * 60 * 60 * 24);
      return duration < 21; // Less than 3 weeks per tier
    });

  if (rapidProgression) {
    return {
      recommendedPacing: 'slower',
      reason: 'Rapid tier progression detected - allowing integration time',
      adjustments: [
        'Slow progression to honor integration needs',
        'Focus on milestone sustainability',
        'Deepen current tier practices',
        'Build stronger emotional foundation'
      ],
      checkInFrequency: 'weekly'
    };
  }

  // Natural pacing (optimal)
  if (currentCapacity.overallCapacity >= 70 && currentCapacity.regulationSkills >= 65) {
    return {
      recommendedPacing: 'natural',
      reason: 'Emotional capacity supports natural progression timing',
      adjustments: [
        'Trust your innate healing wisdom',
        'Follow curiosity and growth edges',
        'Maintain consistent practices',
        'Honor both expansion and integration'
      ],
      checkInFrequency: 'weekly'
    };
  }

  // Default to slower for safety
  return {
    recommendedPacing: 'slower',
    reason: 'Building emotional capacity foundation for sustainable growth',
    adjustments: [
      'Focus on capacity building over advancement',
      'Strengthen regulation skills',
      'Build self-compassion practices',
      'Create stable healing environment'
    ],
    checkInFrequency: 'weekly'
  };
}

/**
 * Helper Functions
 */
function getCurrentEmotionalCapacity(healingTimeline: HealingTimeline): EmotionalCapacitySnapshot {
  const recent = healingTimeline.emotionalCapacityHistory
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  
  return recent || {
    timestamp: new Date(),
    overallCapacity: 50,
    stressLevel: 50,
    regulationSkills: 50,
    supportNetworkStrength: 50,
    traumaActivation: 50,
    selfCompassionLevel: 50,
    boundaryStrength: 50
  };
}

function getRecentTraumaMarkers(healingTimeline: HealingTimeline): TraumaMarker[] {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return healingTimeline.traumaMarkers.filter(marker => 
    marker.detectedDate > thirtyDaysAgo && !marker.resolutionDate
  );
}

function getSustainedMilestones(healingTimeline: HealingTimeline): HealingMilestone[] {
  return healingTimeline.healingMilestones.filter(milestone => 
    milestone.sustainabilityPeriod >= 7 && milestone.naturalProgression
  );
}

function getSanctuaryTierDuration(healingTimeline: HealingTimeline): number {
  const sanctuaryPeriod = healingTimeline.tierJourney.find(tier => tier.tier === 'sanctuary');
  if (!sanctuaryPeriod) return 0;
  
  const endTime = sanctuaryPeriod.endDate?.getTime() || Date.now();
  return (endTime - sanctuaryPeriod.startDate.getTime()) / (1000 * 60 * 60 * 24);
}

function getDeepCutTierDuration(healingTimeline: HealingTimeline): number {
  const deepCutPeriod = healingTimeline.tierJourney.find(tier => tier.tier === 'deep_cut');
  if (!deepCutPeriod) return 0;
  
  const endTime = deepCutPeriod.endDate?.getTime() || Date.now();
  return (endTime - deepCutPeriod.startDate.getTime()) / (1000 * 60 * 60 * 24);
}

/**
 * Trauma-Informed Milestone Tracker
 */
export class TraumaInformedMilestoneTracker {
  static trackMilestone(
    healingTimeline: HealingTimeline,
    milestoneType: HealingMilestone['type'],
    currentTier: 'sanctuary' | 'deep_cut' | 'oracle',
    wasNaturalProgression: boolean = true
  ): HealingMilestone {
    const milestone: HealingMilestone = {
      type: milestoneType,
      achievedDate: new Date(),
      sustainabilityPeriod: 0,
      tier: currentTier,
      naturalProgression: wasNaturalProgression
    };

    healingTimeline.healingMilestones.push(milestone);
    return milestone;
  }

  static updateSustainability(
    healingTimeline: HealingTimeline,
    milestoneType: HealingMilestone['type']
  ): void {
    const milestone = healingTimeline.healingMilestones
      .filter(m => m.type === milestoneType)
      .sort((a, b) => b.achievedDate.getTime() - a.achievedDate.getTime())[0];

    if (milestone) {
      const daysSinceAchieved = (Date.now() - milestone.achievedDate.getTime()) / (1000 * 60 * 60 * 24);
      milestone.sustainabilityPeriod = Math.floor(daysSinceAchieved);
    }
  }
}

/**
 * Real-time Progression Validator Hook
 */
export function useProgressionValidator(
  userId: string,
  currentTier: 'sanctuary' | 'deep_cut' | 'oracle'
): {
  canProgress: boolean;
  nextTierReadiness: ReturnType<typeof assessProgressionReadiness>;
  personalizedPacing: ReturnType<typeof getPersonalizedPacing>;
  currentStability: 'crisis' | 'vulnerable' | 'stable' | 'thriving';
} {
  // In a real implementation, this would fetch from database
  const healingTimeline = getUserHealingTimeline(userId);
  
  const nextTier = currentTier === 'sanctuary' ? 'deep_cut' : 
                  currentTier === 'deep_cut' ? 'oracle' : null;

  const nextTierReadiness = nextTier ? 
    assessProgressionReadiness(healingTimeline, nextTier) : 
    {
      isReady: false,
      reason: 'Already at highest tier',
      recommendedWaitPeriod: 0,
      requiredMilestones: [],
      safetyConsiderations: []
    };

  const personalizedPacing = getPersonalizedPacing(healingTimeline);

  return {
    canProgress: nextTierReadiness.isReady,
    nextTierReadiness,
    personalizedPacing,
    currentStability: healingTimeline.currentStabilityLevel
  };
}

// Mock function - in real implementation would fetch from database
function getUserHealingTimeline(userId: string): HealingTimeline {
  return {
    userId,
    tierJourney: [
      {
        tier: 'sanctuary',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        transitionReason: 'Initial registration',
        emotionalReadiness: true,
        externalPressure: false,
        stabilityAtTransition: 'stable'
      }
    ],
    emotionalCapacityHistory: [
      {
        timestamp: new Date(),
        overallCapacity: 75,
        stressLevel: 40,
        regulationSkills: 70,
        supportNetworkStrength: 65,
        traumaActivation: 30,
        selfCompassionLevel: 68,
        boundaryStrength: 72
      }
    ],
    traumaMarkers: [],
    healingMilestones: [
      {
        type: 'emotional_regulation',
        achievedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        sustainabilityPeriod: 21,
        tier: 'sanctuary',
        naturalProgression: true
      }
    ],
    currentStabilityLevel: 'stable',
    recommendedPacing: 'natural'
  };
}

export default {
  assessProgressionReadiness,
  getPersonalizedPacing,
  TraumaInformedMilestoneTracker,
  useProgressionValidator
};