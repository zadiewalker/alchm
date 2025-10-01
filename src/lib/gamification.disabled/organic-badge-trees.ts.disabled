/**
 * ORGANIC BADGE TREES - REVOLUTIONARY GROWTH VISUALIZATION
 * "Growth is not linear. Neither are our celebrations."
 * 
 * Three Sacred Trees of Becoming:
 * 🌱 PRESENCE TREE: "Still Here" - The art of showing up
 * 🧠 INSIGHT TREE: "Chaos→Clarity" - Finding patterns in the storm  
 * 💪 RESILIENCE TREE: "Soft but Strong" - Gentle power development
 */

import { Timestamp } from 'firebase/firestore';
import type { Badge, BadgeKey } from '@/types/gamification';

export interface OrganicBadgeTree {
  id: string;
  name: string;
  description: string;
  healingArchetype: 'presence' | 'insight' | 'resilience';
  visualMetaphor: 'growing_seed' | 'flowing_river' | 'crystallizing_gem';
  
  // Revolutionary Growth Elements
  branches: OrganicBranch[];
  rootSystem: {
    coreBeliefs: string[]; // What this tree represents
    healingCapacity: string; // What it develops
    wisdomEvolution: string; // How it transforms the person
  };
  
  // Organic Progress (not linear levels)
  growth: {
    seedingMoments: number; // first attempts
    bloomingPhases: number; // breakthrough periods
    deepRooting: number; // integration of learning
    fruitBearing: number; // wisdom sharing with others
  };
  
  // Jony Ive Design Elements
  aesthetics: {
    primaryColor: string; // Sage green variations
    animation: 'breathing' | 'growing' | 'flowing' | 'crystallizing';
    texture: 'soft' | 'organic' | 'crystalline';
    lightingEffect: 'gentle_glow' | 'warm_radiance' | 'inner_light';
  };
}

export interface OrganicBranch {
  id: string;
  name: string;
  description: string;
  
  // Revolutionary Badge Philosophy
  identityEvolution: string; // "You are becoming someone who..."
  courageRequired: string; // What bravery this represents
  wisdomGained: string; // Insight this unlocks
  healingGift: string; // How this serves others
  
  // Growth Stages (not levels)
  stages: OrganicStage[];
  
  // Connection to other branches
  synergiesWith: string[]; // Other branches that amplify this
  prerequisiteWisdom?: string; // Not requirements, but helpful foundations
}

export interface OrganicStage {
  id: string;
  name: string;
  description: string;
  
  // Revolutionary Design
  celebrationMessage: string;
  identityAffirmation: string; // "You are someone who..."
  wisdomInsight: string;
  healingImpact: string;
  
  // Organic Unlocking (not simple metrics)
  unlockConditions: {
    primary: UnlockCondition;
    amplifiers: UnlockCondition[]; // Optional ways to accelerate
    alternativePaths: UnlockCondition[]; // Different ways to achieve this
  };
  
  // Visual Design
  visualization: {
    metaphor: 'seed' | 'sprout' | 'branch' | 'bloom' | 'fruit';
    animation: string;
    color: string;
    glowIntensity: number;
  };
}

export interface UnlockCondition {
  type: 'presence_moments' | 'wisdom_insights' | 'vulnerability_acts' | 'compassion_practices' | 'courage_moments' | 'pattern_recognitions' | 'boundary_honors' | 'authenticity_expressions';
  threshold: number;
  description: string;
  healingSignificance: string;
}

/**
 * The Three Revolutionary Badge Trees
 */
export const REVOLUTIONARY_BADGE_TREES: Record<string, OrganicBadgeTree> = {
  
  // 🌱 PRESENCE TREE: "Still Here" 
  presence: {
    id: 'presence',
    name: 'Still Here',
    description: 'The revolutionary art of showing up for yourself',
    healingArchetype: 'presence',
    visualMetaphor: 'growing_seed',
    
    branches: [
      {
        id: 'showing_up',
        name: 'Sacred Showing Up',
        description: 'The courage to be present with yourself',
        identityEvolution: 'You are becoming someone who shows up for themselves',
        courageRequired: 'The bravery to face what\'s inside',
        wisdomGained: 'Presence is the foundation of all healing',
        healingGift: 'Your consistency gives others permission to be inconsistent',
        
        stages: [
          {
            id: 'first_presence',
            name: 'Sacred First Step',
            description: 'You showed up. That\'s the win.',
            celebrationMessage: 'You chose yourself today. That takes courage.',
            identityAffirmation: 'You are someone who shows up for their healing.',
            wisdomInsight: 'The first step is always the hardest and the most important.',
            healingImpact: 'Your courage to begin ripples outward.',
            
            unlockConditions: {
              primary: {
                type: 'presence_moments',
                threshold: 1,
                description: 'First journal entry',
                healingSignificance: 'Beginning is an act of hope'
              },
              amplifiers: [],
              alternativePaths: []
            },
            
            visualization: {
              metaphor: 'seed',
              animation: 'gentle_pulse',
              color: '#a4b792',
              glowIntensity: 0.3
            }
          },
          {
            id: 'early_rhythm',
            name: 'Finding Your Rhythm',
            description: 'Three moments of choosing yourself.',
            celebrationMessage: 'You\'re building something real. Your rhythm is emerging.',
            identityAffirmation: 'You are someone who creates space for their inner voice.',
            wisdomInsight: 'Consistency comes from self-love, not self-discipline.',
            healingImpact: 'You\'re modeling what it looks like to prioritize inner work.',
            
            unlockConditions: {
              primary: {
                type: 'presence_moments',
                threshold: 3,
                description: 'Three journal entries',
                healingSignificance: 'Pattern creation begins with repetition'
              },
              amplifiers: [
                {
                  type: 'vulnerability_acts',
                  threshold: 1,
                  description: 'One vulnerable share',
                  healingSignificance: 'Vulnerability accelerates presence'
                }
              ],
              alternativePaths: [
                {
                  type: 'wisdom_insights',
                  threshold: 2,
                  description: 'Two meaningful insights',
                  healingSignificance: 'Quality can unlock what quantity does'
                }
              ]
            },
            
            visualization: {
              metaphor: 'sprout',
              animation: 'gentle_growth',
              color: '#96a584',
              glowIntensity: 0.5
            }
          },
          {
            id: 'steady_presence',
            name: 'Steady Sacred Presence',
            description: 'A week of showing up for yourself.',
            celebrationMessage: 'Seven days of presence. You\'re building resilience.',
            identityAffirmation: 'You are someone who maintains a practice of self-connection.',
            wisdomInsight: 'Consistency is self-love in action.',
            healingImpact: 'Your steadiness creates safety for others to be unsteady.',
            
            unlockConditions: {
              primary: {
                type: 'presence_moments',
                threshold: 7,
                description: 'Seven journal entries in reasonable timeframe',
                healingSignificance: 'A week creates a new neural pathway'
              },
              amplifiers: [
                {
                  type: 'compassion_practices',
                  threshold: 3,
                  description: 'Three self-compassion moments',
                  healingSignificance: 'Self-compassion deepens presence'
                }
              ],
              alternativePaths: [
                {
                  type: 'authenticity_expressions',
                  threshold: 5,
                  description: 'Five authentic expressions',
                  healingSignificance: 'Authenticity is a form of presence'
                }
              ]
            },
            
            visualization: {
              metaphor: 'branch',
              animation: 'swaying_growth',
              color: '#8ea876',
              glowIntensity: 0.7
            }
          }
        ],
        
        synergiesWith: ['self_compassion', 'authentic_voice'],
        prerequisiteWisdom: 'Willingness to be with what is'
      },
      
      {
        id: 'grace_mastery',
        name: 'Grace Mastery',
        description: 'Learning to be gentle with your humanity',
        identityEvolution: 'You are becoming someone who extends grace to themselves',
        courageRequired: 'The bravery to be imperfect',
        wisdomGained: 'Grace is strength, not weakness',
        healingGift: 'Your self-compassion gives others permission to be human',
        
        stages: [
          {
            id: 'first_grace_use',
            name: 'Sacred Self-Compassion',
            description: 'You used grace instead of self-criticism.',
            celebrationMessage: 'You chose kindness over criticism. That\'s revolutionary.',
            identityAffirmation: 'You are someone who treats themselves with compassion.',
            wisdomInsight: 'Self-compassion is the foundation of all healing.',
            healingImpact: 'Your gentleness with yourself models gentleness for others.',
            
            unlockConditions: {
              primary: {
                type: 'compassion_practices',
                threshold: 1,
                description: 'First grace token use',
                healingSignificance: 'Choosing kindness over criticism changes everything'
              },
              amplifiers: [],
              alternativePaths: []
            },
            
            visualization: {
              metaphor: 'bloom',
              animation: 'soft_opening',
              color: '#b8c5a6',
              glowIntensity: 0.6
            }
          }
        ],
        
        synergiesWith: ['showing_up', 'boundary_keeping'],
        prerequisiteWisdom: 'Understanding that you are human'
      }
    ],
    
    rootSystem: {
      coreBeliefs: [
        'My presence is valuable just as it is',
        'Showing up imperfectly is still showing up',
        'Grace and consistency can coexist',
        'My healing journey matters'
      ],
      healingCapacity: 'The ability to be present with yourself and others',
      wisdomEvolution: 'From performing presence to being present'
    },
    
    growth: {
      seedingMoments: 0,
      bloomingPhases: 0, 
      deepRooting: 0,
      fruitBearing: 0
    },
    
    aesthetics: {
      primaryColor: '#a4b792',
      animation: 'growing',
      texture: 'soft',
      lightingEffect: 'gentle_glow'
    }
  },

  // 🧠 INSIGHT TREE: "Chaos→Clarity"
  insight: {
    id: 'insight',
    name: 'Chaos → Clarity', 
    description: 'The alchemy of finding wisdom in the storm',
    healingArchetype: 'insight',
    visualMetaphor: 'flowing_river',
    
    branches: [
      {
        id: 'pattern_finding',
        name: 'Sacred Pattern Recognition',
        description: 'Finding signal in the noise of experience',
        identityEvolution: 'You are becoming someone who finds meaning in chaos',
        courageRequired: 'The bravery to look for patterns in pain',
        wisdomGained: 'Chaos contains information, not just confusion',
        healingGift: 'Your pattern recognition helps others make sense of their stories',
        
        stages: [
          {
            id: 'first_pattern',
            name: 'First Sacred Pattern',
            description: 'You found signal in the noise.',
            celebrationMessage: 'You discovered meaning in the chaos. That\'s wisdom.',
            identityAffirmation: 'You are someone who finds patterns that heal.',
            wisdomInsight: 'Every experience contains information for your growth.',
            healingImpact: 'Your insights illuminate paths for others.',
            
            unlockConditions: {
              primary: {
                type: 'pattern_recognitions',
                threshold: 1,
                description: 'First pattern recognized in journaling',
                healingSignificance: 'Seeing patterns is the beginning of healing'
              },
              amplifiers: [
                {
                  type: 'wisdom_insights',
                  threshold: 2,
                  description: 'Two wisdom insights',
                  healingSignificance: 'Insights compound into patterns'
                }
              ],
              alternativePaths: [
                {
                  type: 'authenticity_expressions',
                  threshold: 3,
                  description: 'Three authentic expressions',
                  healingSignificance: 'Authenticity reveals patterns'
                }
              ]
            },
            
            visualization: {
              metaphor: 'seed',
              animation: 'crystallizing_light',
              color: '#cb997e',
              glowIntensity: 0.4
            }
          },
          {
            id: 'emerging_clarity',
            name: 'Emerging Clarity',
            description: 'Patterns emerging from the storm.',
            celebrationMessage: 'The patterns are becoming clear. You\'re gaining insight.',
            identityAffirmation: 'You are someone who transforms confusion into clarity.',
            wisdomInsight: 'Clarity emerges from patient attention to your inner world.',
            healingImpact: 'Your clarity helps others navigate their own confusion.',
            
            unlockConditions: {
              primary: {
                type: 'pattern_recognitions',
                threshold: 5,
                description: 'Five patterns recognized',
                healingSignificance: 'Multiple patterns create a wisdom web'
              },
              amplifiers: [
                {
                  type: 'vulnerability_acts',
                  threshold: 2,
                  description: 'Two vulnerability moments',
                  healingSignificance: 'Vulnerability accelerates pattern recognition'
                }
              ],
              alternativePaths: [
                {
                  type: 'wisdom_insights',
                  threshold: 8,
                  description: 'Eight wisdom insights',
                  healingSignificance: 'Deep insights can substitute for pattern quantity'
                }
              ]
            },
            
            visualization: {
              metaphor: 'branch',
              animation: 'flowing_connection',
              color: '#b8956b',
              glowIntensity: 0.6
            }
          }
        ],
        
        synergiesWith: ['wisdom_sharing', 'authentic_voice'],
        prerequisiteWisdom: 'Curiosity about your inner landscape'
      }
    ],
    
    rootSystem: {
      coreBeliefs: [
        'Every experience contains wisdom',
        'Chaos is information in disguise',
        'Patterns reveal the architecture of healing',
        'My insights matter and can help others'
      ],
      healingCapacity: 'The ability to transform confusion into clarity',
      wisdomEvolution: 'From being overwhelmed by chaos to finding wisdom within it'
    },
    
    growth: {
      seedingMoments: 0,
      bloomingPhases: 0,
      deepRooting: 0, 
      fruitBearing: 0
    },
    
    aesthetics: {
      primaryColor: '#cb997e',
      animation: 'flowing',
      texture: 'organic',
      lightingEffect: 'warm_radiance'
    }
  },

  // 💪 RESILIENCE TREE: "Soft but Strong"
  resilience: {
    id: 'resilience',
    name: 'Soft but Strong',
    description: 'The revolutionary power of gentle strength', 
    healingArchetype: 'resilience',
    visualMetaphor: 'crystallizing_gem',
    
    branches: [
      {
        id: 'gentle_power',
        name: 'Sacred Gentle Power',
        description: 'Discovering vulnerability as strength',
        identityEvolution: 'You are becoming someone who embodies gentle power',
        courageRequired: 'The bravery to be strong and soft simultaneously',
        wisdomGained: 'True strength includes tenderness',
        healingGift: 'Your gentle power creates safety for others to be vulnerable',
        
        stages: [
          {
            id: 'vulnerability_strength',
            name: 'Vulnerability as Strength',
            description: 'You discovered vulnerability as strength.',
            celebrationMessage: 'You found strength in softness. That\'s wisdom.',
            identityAffirmation: 'You are someone who finds power in vulnerability.',
            wisdomInsight: 'True strength includes the capacity for tenderness.',
            healingImpact: 'Your vulnerable strength creates safety for others.',
            
            unlockConditions: {
              primary: {
                type: 'vulnerability_acts',
                threshold: 1,
                description: 'First vulnerable share',
                healingSignificance: 'Vulnerability is the birthplace of courage'
              },
              amplifiers: [
                {
                  type: 'authenticity_expressions',
                  threshold: 2,
                  description: 'Two authentic expressions',
                  healingSignificance: 'Authenticity amplifies vulnerability'
                }
              ],
              alternativePaths: [
                {
                  type: 'compassion_practices',
                  threshold: 3,
                  description: 'Three self-compassion practices',
                  healingSignificance: 'Self-compassion is a form of vulnerable strength'
                }
              ]
            },
            
            visualization: {
              metaphor: 'seed',
              animation: 'gentle_crystallizing',
              color: '#d4756b',
              glowIntensity: 0.5
            }
          },
          {
            id: 'boundary_compassion',
            name: 'Boundary Compassion',
            description: 'Compassion for self, boundaries with others.',
            celebrationMessage: 'You balance compassion and boundaries. That\'s mastery.',
            identityAffirmation: 'You are someone who loves with wisdom.',
            wisdomInsight: 'Boundaries are how we love ourselves and others well.',
            healingImpact: 'Your boundaried compassion teaches others healthy relating.',
            
            unlockConditions: {
              primary: {
                type: 'boundary_honors',
                threshold: 3,
                description: 'Three boundary moments',
                healingSignificance: 'Boundaries are self-love in action'
              },
              amplifiers: [
                {
                  type: 'compassion_practices',
                  threshold: 3,
                  description: 'Three compassion practices',
                  healingSignificance: 'Self-compassion makes boundaries loving'
                }
              ],
              alternativePaths: [
                {
                  type: 'authenticity_expressions',
                  threshold: 5,
                  description: 'Five authentic expressions',
                  healingSignificance: 'Authenticity naturally creates healthy boundaries'
                }
              ]
            },
            
            visualization: {
              metaphor: 'bloom',
              animation: 'crystalline_strength',
              color: '#c66b5d',
              glowIntensity: 0.7
            }
          }
        ],
        
        synergiesWith: ['authentic_voice', 'self_compassion'],
        prerequisiteWisdom: 'Understanding that strength and softness can coexist'
      }
    ],
    
    rootSystem: {
      coreBeliefs: [
        'I can be both strong and tender',
        'Vulnerability is a superpower, not a weakness',
        'Boundaries are acts of love',
        'My gentle strength helps others feel safe'
      ],
      healingCapacity: 'The ability to be powerfully gentle and gently powerful',
      wisdomEvolution: 'From thinking strength means hardness to knowing it includes softness'
    },
    
    growth: {
      seedingMoments: 0,
      bloomingPhases: 0,
      deepRooting: 0,
      fruitBearing: 0
    },
    
    aesthetics: {
      primaryColor: '#d4756b',
      animation: 'crystallizing',
      texture: 'crystalline',
      lightingEffect: 'inner_light'
    }
  }
};

/**
 * Revolutionary Badge Unlocking System
 */
export class OrganicBadgeSystem {
  
  /**
   * Check for badge unlocks based on organic conditions
   */
  static checkForUnlocks(
    userId: string,
    journalEntry: {
      presenceScore: number;
      wisdomInsights: number;
      vulnerabilityLevel: number;
      authenticityLevel: number;
      selfCompassionPracticed: boolean;
      boundaryMoment: boolean;
      patternRecognized: boolean;
    },
    userProgress: {
      totalPresenceMoments: number;
      totalWisdomInsights: number;
      totalVulnerabilityActs: number;
      totalCompassionPractices: number;
      totalBoundaryHonors: number;
      totalPatternRecognitions: number;
      totalAuthenticityExpressions: number;
    }
  ): Promise<Badge[]> {
    const unlockedBadges: Badge[] = [];

    // Check each tree for unlocks
    for (const tree of Object.values(REVOLUTIONARY_BADGE_TREES)) {
      for (const branch of tree.branches) {
        for (const stage of branch.stages) {
          const isUnlocked = await this.checkStageUnlock(stage, journalEntry, userProgress);
          
          if (isUnlocked) {
            const badge = this.createBadge(tree, branch, stage, userId);
            unlockedBadges.push(badge);
          }
        }
      }
    }

    return unlockedBadges;
  }

  /**
   * Create a badge with revolutionary healing-centered properties
   */
  static createBadge(
    tree: OrganicBadgeTree,
    branch: OrganicBranch,
    stage: OrganicStage,
    userId: string
  ): Badge {
    return {
      key: stage.id as BadgeKey,
      level: 1, // In organic system, levels are less relevant
      earnedAt: Timestamp.now(),
      name: stage.name,
      description: stage.description,
      tree: tree.id,
      xpAwarded: this.calculateOrganicXP(stage),
      
      // Revolutionary properties
      healingMessage: stage.celebrationMessage,
      identityAffirmation: stage.identityAffirmation,
      gentleAnimation: tree.aesthetics.animation as any,
      emotionalResonance: this.getEmotionalResonance(tree.healingArchetype),
      wisdomGained: stage.wisdomInsight,
      innerWorkAcknowledged: branch.courageRequired
    };
  }

  /**
   * Calculate XP based on healing significance, not arbitrary numbers
   */
  static calculateOrganicXP(stage: OrganicStage): number {
    // Base XP on healing significance and courage required
    let xp = 50; // Base for any growth
    
    // Vulnerability and courage multiply value
    if (stage.description.includes('vulnerable') || stage.description.includes('courage')) {
      xp += 25;
    }
    
    // Pattern recognition and wisdom multiply value
    if (stage.description.includes('pattern') || stage.description.includes('insight')) {
      xp += 30;
    }
    
    // Self-compassion and grace multiply value
    if (stage.description.includes('grace') || stage.description.includes('compassion')) {
      xp += 35;
    }
    
    // Boundary work multiplies value (it's hard!)
    if (stage.description.includes('boundary') || stage.description.includes('authentic')) {
      xp += 40;
    }
    
    return xp;
  }

  /**
   * Get emotional resonance based on archetype
   */
  static getEmotionalResonance(archetype: string): 'validating' | 'empowering' | 'transformative' | 'grounding' {
    switch (archetype) {
      case 'presence': return 'validating';
      case 'insight': return 'transformative'; 
      case 'resilience': return 'empowering';
      default: return 'grounding';
    }
  }

  /**
   * Check if stage unlock conditions are met
   */
  private static async checkStageUnlock(
    stage: OrganicStage,
    journalEntry: any,
    userProgress: any
  ): Promise<boolean> {
    const conditions = stage.unlockConditions;
    
    // Check primary condition
    const primaryMet = this.checkCondition(conditions.primary, journalEntry, userProgress);
    
    if (primaryMet) {
      return true;
    }
    
    // Check amplifiers (can substitute for primary if multiple are met)
    let amplifiersMet = 0;
    for (const amplifier of conditions.amplifiers) {
      if (this.checkCondition(amplifier, journalEntry, userProgress)) {
        amplifiersMet++;
      }
    }
    
    // Multiple amplifiers can unlock even without primary
    if (amplifiersMet >= 2) {
      return true;
    }
    
    // Check alternative paths
    for (const altPath of conditions.alternativePaths) {
      if (this.checkCondition(altPath, journalEntry, userProgress)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Check individual unlock condition
   */
  private static checkCondition(
    condition: UnlockCondition,
    journalEntry: any,
    userProgress: any
  ): boolean {
    switch (condition.type) {
      case 'presence_moments':
        return userProgress.totalPresenceMoments >= condition.threshold;
      case 'wisdom_insights':
        return userProgress.totalWisdomInsights >= condition.threshold;
      case 'vulnerability_acts':
        return userProgress.totalVulnerabilityActs >= condition.threshold;
      case 'compassion_practices':
        return userProgress.totalCompassionPractices >= condition.threshold;
      case 'boundary_honors':
        return userProgress.totalBoundaryHonors >= condition.threshold;
      case 'pattern_recognitions':
        return userProgress.totalPatternRecognitions >= condition.threshold;
      case 'authenticity_expressions':
        return userProgress.totalAuthenticityExpressions >= condition.threshold;
      default:
        return false;
    }
  }
}

/**
 * Revolutionary Growth Visualization System
 */
export class OrganicGrowthVisualization {
  
  /**
   * Generate tree growth visualization data
   */
  static generateTreeVisualization(
    treeId: string,
    userBadges: Badge[],
    userPreferences: {
      visualStyle: 'minimal' | 'rich' | 'organic';
      animationIntensity: 'subtle' | 'medium' | 'full';
      sageGreenVariation: 'light' | 'medium' | 'deep';
    }
  ): {
    treeState: 'seeding' | 'sprouting' | 'branching' | 'blooming' | 'fruit_bearing';
    visualElements: VisualElement[];
    animations: AnimationSequence[];
    celebrationLevel: 'gentle' | 'warm' | 'joyful';
    wisdomMessage: string;
  } {
    const tree = REVOLUTIONARY_BADGE_TREES[treeId];
    if (!tree) throw new Error('Tree not found');

    const earnedBadges = userBadges.filter(b => b.tree === treeId);
    const treeState = this.calculateTreeState(earnedBadges, tree);
    const visualElements = this.generateVisualElements(tree, earnedBadges, userPreferences);
    const animations = this.generateAnimations(tree, treeState, userPreferences);
    const celebrationLevel = this.calculateCelebrationLevel(earnedBadges.length, userPreferences);
    const wisdomMessage = this.generateWisdomMessage(tree, treeState, earnedBadges.length);

    return {
      treeState,
      visualElements,
      animations,
      celebrationLevel,
      wisdomMessage
    };
  }

  // Implementation details would continue here...
  private static calculateTreeState(badges: Badge[], tree: OrganicBadgeTree): 'seeding' | 'sprouting' | 'branching' | 'blooming' | 'fruit_bearing' {
    if (badges.length === 0) return 'seeding';
    if (badges.length <= 2) return 'sprouting';
    if (badges.length <= 5) return 'branching';
    if (badges.length <= 8) return 'blooming';
    return 'fruit_bearing';
  }

  private static generateVisualElements(tree: OrganicBadgeTree, badges: Badge[], prefs: any): VisualElement[] {
    // Generate Jony Ive-inspired visual elements
    return [];
  }

  private static generateAnimations(tree: OrganicBadgeTree, state: string, prefs: any): AnimationSequence[] {
    // Generate organic, healing-centered animations
    return [];
  }

  private static calculateCelebrationLevel(badgeCount: number, prefs: any): 'gentle' | 'warm' | 'joyful' {
    if (prefs.animationIntensity === 'subtle') return 'gentle';
    if (badgeCount >= 5) return 'joyful';
    return 'warm';
  }

  private static generateWisdomMessage(tree: OrganicBadgeTree, state: string, badgeCount: number): string {
    const messages = tree.rootSystem.coreBeliefs;
    return messages[Math.min(badgeCount, messages.length - 1)];
  }
}

// Supporting interfaces
interface VisualElement {
  type: string;
  position: { x: number; y: number };
  color: string;
  animation: string;
  glowIntensity: number;
}

interface AnimationSequence {
  name: string;
  duration: number;
  easing: string;
  keyframes: any[];
}