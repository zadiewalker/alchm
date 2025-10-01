/**
 * ALCHM Badge Evolution System
 * Meaningful progression that celebrates journey over achievement
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'healing' | 'growth' | 'connection' | 'purpose' | 'resilience' | 'wisdom';
  stage: BadgeStage;
  icon: string;
  unlockedAt?: Date;
  progress: BadgeProgress;
  evolutionPath: BadgeEvolution[];
  rarity: 'common' | 'meaningful' | 'profound' | 'sacred';
  isHidden: boolean; // Some badges only appear when earned
  celebrationMessage: string;
  nextStageHint?: string;
}

export interface BadgeStage {
  level: number;
  name: string;
  description: string;
  requirements: BadgeRequirement[];
  icon: string;
  color: string;
  celebrationText: string;
}

export interface BadgeProgress {
  currentValue: number;
  targetValue: number;
  unit: string; // "reflections", "days of presence", "moments of courage"
  progressType: 'cumulative' | 'consistent' | 'qualitative' | 'discovery';
  milestones: Milestone[];
}

export interface BadgeRequirement {
  type: 'reflection_count' | 'streak_days' | 'category_focus' | 'depth_marker' | 'emotional_range' | 'self_compassion' | 'growth_moment';
  value: number;
  qualifier?: string; // Additional context
}

export interface BadgeEvolution {
  fromStage: number;
  toStage: number;
  requirements: BadgeRequirement[];
  evolutionStory: string; // Narrative about growth
  celebrationRitual: string; // Special moment when evolution happens
}

export interface Milestone {
  value: number;
  message: string;
  isReached: boolean;
  reachedAt?: Date;
}

export interface BadgeTree {
  rootBadgeId: string;
  name: string;
  description: string;
  category: Badge['category'];
  stages: Badge[];
  philosophy: string; // The deeper meaning of this evolution path
}

export class BadgeEvolutionEngine {
  /**
   * Calculate badge progress without inducing anxiety or comparison
   */
  static calculateProgress(
    badge: Badge,
    userActivity: UserActivity
  ): {
    progress: BadgeProgress;
    readyForEvolution: boolean;
    evolutionMessage?: string;
  } {
    const currentProgress = { ...badge.progress };
    
    // Update progress based on badge type
    switch (badge.stage.requirements[0]?.type) {
      case 'reflection_count':
        currentProgress.currentValue = userActivity.totalReflections;
        break;
      case 'streak_days':
        currentProgress.currentValue = userActivity.currentStreak;
        break;
      case 'category_focus':
        const categoryCount = userActivity.categoryReflections[badge.category] || 0;
        currentProgress.currentValue = categoryCount;
        break;
      case 'depth_marker':
        currentProgress.currentValue = userActivity.deepReflections;
        break;
      case 'emotional_range':
        currentProgress.currentValue = userActivity.uniqueEmotions.length;
        break;
      case 'self_compassion':
        currentProgress.currentValue = userActivity.selfCompassionMoments;
        break;
      case 'growth_moment':
        currentProgress.currentValue = userActivity.growthMoments;
        break;
    }
    
    // Update milestones
    currentProgress.milestones = currentProgress.milestones.map(milestone => ({
      ...milestone,
      isReached: currentProgress.currentValue >= milestone.value,
      reachedAt: milestone.isReached && !milestone.reachedAt ? new Date() : milestone.reachedAt
    }));
    
    // Check for evolution readiness
    const readyForEvolution = this.checkEvolutionReadiness(badge, currentProgress);
    const evolutionMessage = readyForEvolution 
      ? this.generateEvolutionMessage(badge)
      : undefined;
    
    return {
      progress: currentProgress,
      readyForEvolution,
      evolutionMessage
    };
  }
  
  /**
   * Evolve a badge to its next stage
   */
  static evolveBadge(
    currentBadge: Badge,
    userActivity: UserActivity
  ): {
    success: boolean;
    evolvedBadge?: Badge;
    celebrationMoment: CelebrationMoment;
  } {
    const evolution = currentBadge.evolutionPath.find(e => 
      e.fromStage === currentBadge.stage.level
    );
    
    if (!evolution) {
      return {
        success: false,
        celebrationMoment: {
          type: 'completion',
          title: 'Journey Complete',
          message: 'You\'ve reached the fullest expression of this path. Beautiful.',
          icon: '✨',
          ritual: 'Take a moment to honor how far you\'ve come.'
        }
      };
    }
    
    // Create evolved badge
    const nextStage = this.getNextStage(currentBadge, evolution.toStage);
    const evolvedBadge: Badge = {
      ...currentBadge,
      stage: nextStage,
      celebrationMessage: nextStage.celebrationText,
      progress: this.initializeNextStageProgress(currentBadge, nextStage)
    };
    
    return {
      success: true,
      evolvedBadge,
      celebrationMoment: {
        type: 'evolution',
        title: `${evolvedBadge.name} Evolved`,
        message: evolution.evolutionStory,
        icon: nextStage.icon,
        ritual: evolution.celebrationRitual,
        newCapabilities: this.getNewCapabilities(nextStage)
      }
    };
  }
  
  /**
   * Get user's badge collection organized by trees with enhanced identity evolution
   */
  static organizeBadgeCollection(badges: Badge[], userActivity: UserActivity): {
    trees: BadgeTree[];
    identityEvolution: IdentityEvolution;
    nextEvolutionOpportunities: EvolutionOpportunity[];
    psychologicalProfile: PsychologicalProfile;
  } {
    const trees = this.getBadgeTrees();
    
    const organizedTrees = trees.map(tree => ({
      ...tree,
      stages: tree.stages.map(stageBadge => {
        const userBadge = badges.find(b => b.id === stageBadge.id);
        return userBadge || { ...stageBadge, progress: this.createEmptyProgress(stageBadge) };
      })
    }));
    
    const identityEvolution = this.calculateIdentityEvolution(badges, userActivity);
    const nextOpportunities = this.identifyEvolutionOpportunities(badges, userActivity);
    const psychProfile = this.generatePsychologicalProfile(badges, userActivity);
    
    return {
      trees: organizedTrees,
      identityEvolution,
      nextEvolutionOpportunities: nextOpportunities,
      psychologicalProfile: psychProfile
    };
  }
  
  /**
   * Generate badges that feel personal, not competitive
   */
  private static getBadgeTrees(): BadgeTree[] {
    return [
      // PRESENCE TREE - "Still Here" - Celebrating showing up
      {
        rootBadgeId: 'presence_seed',
        name: 'Sacred Presence',
        description: 'The art of showing up fully to your life',
        category: 'wisdom',
        philosophy: 'Presence is the greatest gift you can give yourself and the world. Every moment you choose to be here is sacred.',
        stages: [
          {
            id: 'presence_seed',
            name: 'Present Moment Seed',
            description: 'You showed up to this moment fully',
            category: 'wisdom',
            stage: {
              level: 1,
              name: 'Seed',
              description: 'A single moment of full presence',
              requirements: [{ type: 'reflection_count', value: 1 }],
              icon: '🌱',
              color: 'var(--sage-400)',
              celebrationText: 'You gave yourself the gift of presence. This is where healing begins.'
            },
            icon: '🌱',
            progress: { currentValue: 0, targetValue: 1, unit: 'moments of presence', progressType: 'cumulative', milestones: [] },
            evolutionPath: [{
              fromStage: 1,
              toStage: 2,
              requirements: [{ type: 'reflection_count', value: 7 }],
              evolutionStory: 'Your moments of presence are gathering into something beautiful - a practice that sustains you.',
              celebrationRitual: 'Take three conscious breaths and feel how present you are becoming.'
            }],
            rarity: 'meaningful',
            isHidden: false,
            celebrationMessage: 'This moment of showing up is a revolution against disconnection.',
            nextStageHint: 'Keep showing up. Presence builds upon presence.'
          },
          {
            id: 'presence_sprout',
            name: 'Mindful Sprout',
            description: 'Your presence is growing roots in daily life',
            category: 'wisdom',
            stage: {
              level: 2,
              name: 'Sprout',
              description: 'Presence becoming a practice',
              requirements: [{ type: 'reflection_count', value: 7 }],
              icon: '🌿',
              color: 'var(--sage-500)',
              celebrationText: 'You\'re cultivating the garden of your attention. This is sacred work.'
            },
            icon: '🌿',
            progress: { currentValue: 0, targetValue: 21, unit: 'days of mindful presence', progressType: 'cumulative', milestones: [] },
            evolutionPath: [{
              fromStage: 2,
              toStage: 3,
              requirements: [{ type: 'reflection_count', value: 21 }],
              evolutionStory: 'Your presence is blossoming into wisdom. You\'re becoming someone who truly sees.',
              celebrationRitual: 'Look around you right now and notice three things with complete presence.'
            }],
            rarity: 'meaningful',
            isHidden: true,
            celebrationMessage: 'Your growing presence is changing how you experience life.'
          },
          {
            id: 'presence_blossom',
            name: 'Luminous Presence',
            description: 'You embody the art of being fully here',
            category: 'wisdom',
            stage: {
              level: 3,
              name: 'Blossom',
              description: 'Presence as a way of being',
              requirements: [{ type: 'reflection_count', value: 21 }],
              icon: '✨',
              color: 'var(--sage-600)',
              celebrationText: 'You have become presence itself. Others feel your groundedness.'
            },
            icon: '✨',
            progress: { currentValue: 0, targetValue: 66, unit: 'days of luminous presence', progressType: 'cumulative', milestones: [] },
            evolutionPath: [{
              fromStage: 3,
              toStage: 4,
              requirements: [{ type: 'reflection_count', value: 66 }],
              evolutionStory: 'Your presence has become a lighthouse - guiding not just you, but others back to the present moment.',
              celebrationRitual: 'Send your presence like a blessing to someone who needs it today.'
            }],
            rarity: 'profound',
            isHidden: true,
            celebrationMessage: 'Your presence is a gift to yourself and everyone you encounter.'
          },
          {
            id: 'presence_lighthouse',
            name: 'Presence Lighthouse',
            description: 'Your presence guides others back to themselves',
            category: 'wisdom',
            stage: {
              level: 4,
              name: 'Lighthouse',
              description: 'Presence that lights the way for others',
              requirements: [{ type: 'reflection_count', value: 66 }],
              icon: '🏮',
              color: 'var(--sage-700)',
              celebrationText: 'You are a beacon of presence in a distracted world. Your stillness moves mountains.'
            },
            icon: '🏮',
            progress: { currentValue: 0, targetValue: 200, unit: 'moments of lighthouse presence', progressType: 'cumulative', milestones: [] },
            evolutionPath: [],
            rarity: 'sacred',
            isHidden: true,
            celebrationMessage: 'You have mastered the art of being here. This is enlightenment.'
          }
        ]
      },
      
      // INSIGHT TREE - "Chaos→Clarity" - Tracking understanding evolution  
      {
        rootBadgeId: 'insight_seeker',
        name: 'Inner Wisdom',
        description: 'The journey from confusion to clarity',
        category: 'growth',
        philosophy: 'Within every moment of confusion lies a seed of profound clarity. Wisdom is not knowing everything - it\'s being comfortable with the questions.',
        stages: [
          {
            id: 'insight_seeker',
            name: 'Question Holder',
            description: 'You hold your questions with courage',
            category: 'growth',
            stage: {
              level: 1,
              name: 'Seeker',
              description: 'Beginning to ask meaningful questions',
              requirements: [{ type: 'depth_marker', value: 3 }],
              icon: '🔍',
              color: 'var(--coral-400)',
              celebrationText: 'You have the courage to look within. This is how wisdom begins.'
            },
            icon: '🔍',
            progress: { currentValue: 0, targetValue: 3, unit: 'deep questions explored', progressType: 'qualitative', milestones: [] },
            evolutionPath: [{
              fromStage: 1,
              toStage: 2,
              requirements: [{ type: 'depth_marker', value: 10 }],
              evolutionStory: 'Your questions are deepening into insights. You\'re learning to trust your inner knowing.',
              celebrationRitual: 'Ask yourself: "What do I know that I don\'t know I know?"'
            }],
            rarity: 'meaningful',
            isHidden: false,
            celebrationMessage: 'Every question you hold with courage becomes a doorway to wisdom.'
          },
          {
            id: 'insight_gatherer',
            name: 'Pattern Weaver',
            description: 'You see connections and patterns in your experience',
            category: 'growth',
            stage: {
              level: 2,
              name: 'Gatherer',
              description: 'Connecting insights into patterns',
              requirements: [{ type: 'depth_marker', value: 10 }],
              icon: '🕸️',
              color: 'var(--coral-500)',
              celebrationText: 'You\'re weaving the threads of your experience into wisdom.'
            },
            icon: '🕸️',
            progress: { currentValue: 0, targetValue: 25, unit: 'patterns recognized', progressType: 'discovery', milestones: [] },
            evolutionPath: [{
              fromStage: 2,
              toStage: 3,
              requirements: [{ type: 'depth_marker', value: 25 }],
              evolutionStory: 'Your wisdom is crystallizing. What once felt confusing now makes beautiful sense.',
              celebrationRitual: 'Write down three insights that have transformed how you see yourself.'
            }],
            rarity: 'meaningful',
            isHidden: true,
            celebrationMessage: 'Your mind is becoming a wisdom-weaving loom.'
          },
          {
            id: 'insight_sage',
            name: 'Inner Sage',
            description: 'You trust your inner wisdom deeply',
            category: 'growth',
            stage: {
              level: 3,
              name: 'Sage',
              description: 'Embodying deep inner knowing',
              requirements: [{ type: 'depth_marker', value: 25 }],
              icon: '🦉',
              color: 'var(--coral-600)',
              celebrationText: 'You have become your own wise teacher. Your intuition flows clearly.'
            },
            icon: '🦉',
            progress: { currentValue: 0, targetValue: 100, unit: 'wisdom teachings integrated', progressType: 'qualitative', milestones: [] },
            evolutionPath: [],
            rarity: 'sacred',
            isHidden: true,
            celebrationMessage: 'You carry an ancient wisdom that was always yours to remember.'
          }
        ]
      },
      
      // RESILIENCE TREE - "Soft but Strong" - Honoring vulnerability as strength
      {
        rootBadgeId: 'resilience_seed',
        name: 'Gentle Strength', 
        description: 'The power of vulnerability and soft resilience',
        category: 'resilience',
        philosophy: 'True strength is not hard armor, but the flexibility of a reed that bends without breaking. Your vulnerability is your superpower.',
        stages: [
          {
            id: 'resilience_seed',
            name: 'Tender Courage',
            description: 'You showed up even when it was hard',
            category: 'resilience',
            stage: {
              level: 1,
              name: 'Seed',
              description: 'First act of tender courage',
              requirements: [{ type: 'self_compassion', value: 1 }],
              icon: '🌸',
              color: 'var(--cream-400)',
              celebrationText: 'You chose softness over hardness. This is revolutionary courage.'
            },
            icon: '🌸',
            progress: { currentValue: 0, targetValue: 1, unit: 'acts of tender courage', progressType: 'cumulative', milestones: [] },
            evolutionPath: [{
              fromStage: 1,
              toStage: 2,
              requirements: [{ type: 'self_compassion', value: 5 }],
              evolutionStory: 'Your tender courage is growing into something unshakeable - a strength that includes your softness.',
              celebrationRitual: 'Place your hand on your heart and thank yourself for your courage.'
            }],
            rarity: 'meaningful',
            isHidden: false,
            celebrationMessage: 'In a hard world, your gentleness is a radical act of strength.'
          },
          {
            id: 'resilience_bamboo',
            name: 'Flexible Strength',
            description: 'You bend but never break',
            category: 'resilience',
            stage: {
              level: 2,
              name: 'Bamboo',
              description: 'Flexibility as strength',
              requirements: [{ type: 'self_compassion', value: 5 }],
              icon: '🎋',
              color: 'var(--cream-500)',
              celebrationText: 'Like bamboo, you are both gentle and unbreakable.'
            },
            icon: '🎋',
            progress: { currentValue: 0, targetValue: 15, unit: 'moments of flexible resilience', progressType: 'cumulative', milestones: [] },
            evolutionPath: [{
              fromStage: 2,
              toStage: 3,
              requirements: [{ type: 'self_compassion', value: 15 }],
              evolutionStory: 'Your resilience has bloomed into something beautiful - strength wrapped in kindness.',
              celebrationRitual: 'Think of a challenge you\'ve faced with gentle strength recently.'
            }],
            rarity: 'meaningful',
            isHidden: true,
            celebrationMessage: 'Your flexible strength allows you to weather any storm.'
          },
          {
            id: 'resilience_lotus',
            name: 'Lotus Heart',
            description: 'You bloom beautifully from life\'s muddiest waters',
            category: 'resilience',
            stage: {
              level: 3,
              name: 'Lotus',
              description: 'Beauty arising from difficulty',
              requirements: [{ type: 'self_compassion', value: 15 }],
              icon: '🪷',
              color: 'var(--cream-600)',
              celebrationText: 'Like the lotus, you transform life\'s mud into beauty. This is alchemy.'
            },
            icon: '🪷',
            progress: { currentValue: 0, targetValue: 50, unit: 'transformations through difficulty', progressType: 'qualitative', milestones: [] },
            evolutionPath: [],
            rarity: 'sacred',
            isHidden: true,
            celebrationMessage: 'You have mastered the art of blooming wherever you are planted.'
          }
        ]
      },

      // Self-Compassion Evolution (Enhanced version of existing)
      {
        rootBadgeId: 'self_compassion_seed',
        name: 'Self-Compassion',
        description: 'The journey of befriending yourself',
        category: 'healing',
        philosophy: 'True healing begins with the radical act of treating yourself with kindness.',
        stages: [
          {
            id: 'self_compassion_seed',
            name: 'Seed of Kindness',
            description: 'You\'ve planted the first seed of self-compassion',
            category: 'healing',
            stage: {
              level: 1,
              name: 'Seed',
              description: 'The beginning of self-kindness',
              requirements: [{ type: 'self_compassion', value: 1 }],
              icon: '🌱',
              color: 'var(--sage-400)',
              celebrationText: 'You showed yourself kindness. This is how healing begins.'
            },
            icon: '🌱',
            progress: { currentValue: 0, targetValue: 1, unit: 'moments of self-kindness', progressType: 'cumulative', milestones: [] },
            evolutionPath: [{
              fromStage: 1,
              toStage: 2,
              requirements: [{ type: 'self_compassion', value: 7 }],
              evolutionStory: 'Your seed of kindness is taking root, growing into something stronger.',
              celebrationRitual: 'Take three deep breaths and acknowledge your growth.'
            }],
            rarity: 'meaningful',
            isHidden: false,
            celebrationMessage: 'The first act of self-compassion is revolutionary.'
          },
          {
            id: 'self_compassion_sprout',
            name: 'Growing Sprout',
            description: 'Your self-compassion is taking root',
            category: 'healing',
            stage: {
              level: 2,
              name: 'Sprout',
              description: 'Self-kindness is becoming natural',
              requirements: [{ type: 'self_compassion', value: 7 }],
              icon: '🌿',
              color: 'var(--sage-500)',
              celebrationText: 'You\'re developing a kinder inner voice.'
            },
            icon: '🌿',
            progress: { currentValue: 0, targetValue: 20, unit: 'moments of self-kindness', progressType: 'cumulative', milestones: [] },
            evolutionPath: [{
              fromStage: 2,
              toStage: 3,
              requirements: [{ type: 'self_compassion', value: 20 }],
              evolutionStory: 'Your self-compassion is blooming into wisdom.',
              celebrationRitual: 'Write yourself a letter of appreciation.'
            }],
            rarity: 'meaningful',
            isHidden: true,
            celebrationMessage: 'Your inner critic is softening. Notice how this feels.'
          },
          {
            id: 'self_compassion_bloom',
            name: 'Compassion in Bloom',
            description: 'Your relationship with yourself is transforming',
            category: 'healing',
            stage: {
              level: 3,
              name: 'Bloom',
              description: 'Self-compassion flows naturally',
              requirements: [{ type: 'self_compassion', value: 20 }],
              icon: '🌸',
              color: 'var(--sage-600)',
              celebrationText: 'You\'ve become your own friend.'
            },
            icon: '🌸',
            progress: { currentValue: 0, targetValue: 50, unit: 'moments of self-kindness', progressType: 'cumulative', milestones: [] },
            evolutionPath: [],
            rarity: 'profound',
            isHidden: true,
            celebrationMessage: 'You treat yourself with the kindness you show others. This is sacred.'
          }
        ]
      },
      
      // Emotional Alchemy Evolution
      {
        rootBadgeId: 'emotion_witness',
        name: 'Emotional Alchemy',
        description: 'Transforming difficult emotions into wisdom',
        category: 'growth',
        philosophy: 'Every emotion carries medicine when met with presence.',
        stages: [
          {
            id: 'emotion_witness',
            name: 'Emotion Witness',
            description: 'You\'ve learned to observe your emotions without judgment',
            category: 'growth',
            stage: {
              level: 1,
              name: 'Witness',
              description: 'Seeing emotions without being consumed',
              requirements: [{ type: 'emotional_range', value: 5 }],
              icon: '👁️',
              color: 'var(--sage-400)',
              celebrationText: 'You\'re learning to befriend all parts of your emotional spectrum.'
            },
            icon: '👁️',
            progress: { currentValue: 0, targetValue: 5, unit: 'different emotions explored', progressType: 'discovery', milestones: [] },
            evolutionPath: [{
              fromStage: 1,
              toStage: 2,
              requirements: [{ type: 'emotional_range', value: 10 }],
              evolutionStory: 'You\'re becoming an alchemist, transforming difficult emotions into gold.',
              celebrationRitual: 'Thank each emotion you\'ve felt for its message.'
            }],
            rarity: 'meaningful',
            isHidden: false,
            celebrationMessage: 'Every emotion you acknowledge makes you more whole.'
          },
          {
            id: 'emotion_alchemist',
            name: 'Emotion Alchemist',
            description: 'You transform difficult feelings into wisdom',
            category: 'growth',
            stage: {
              level: 2,
              name: 'Alchemist',
              description: 'Finding the gold in every emotion',
              requirements: [{ type: 'emotional_range', value: 10 }],
              icon: '🔮',
              color: 'var(--sage-500)',
              celebrationText: 'You\'re finding wisdom in what once felt overwhelming.'
            },
            icon: '🔮',
            progress: { currentValue: 0, targetValue: 15, unit: 'emotional insights gained', progressType: 'qualitative', milestones: [] },
            evolutionPath: [{
              fromStage: 2,
              toStage: 3,
              requirements: [{ type: 'emotional_range', value: 15 }],
              evolutionStory: 'You\'ve become a master of emotional wisdom.',
              celebrationRitual: 'Create a personal mantra about emotional courage.'
            }],
            rarity: 'profound',
            isHidden: true,
            celebrationMessage: 'You\'ve learned the ancient art of emotional alchemy.'
          }
        ]
      },
      
      // Presence Evolution
      {
        rootBadgeId: 'presence_moment',
        name: 'Sacred Presence',
        description: 'The art of showing up fully',
        category: 'wisdom',
        philosophy: 'Presence is the greatest gift you can give yourself and the world.',
        stages: [
          {
            id: 'presence_moment',
            name: 'Moment of Presence',
            description: 'You showed up fully to this reflection',
            category: 'wisdom',
            stage: {
              level: 1,
              name: 'Moment',
              description: 'A single moment of full presence',
              requirements: [{ type: 'depth_marker', value: 1 }],
              icon: '🕯️',
              color: 'var(--sage-400)',
              celebrationText: 'You gave yourself the gift of presence.'
            },
            icon: '🕯️',
            progress: { currentValue: 0, targetValue: 1, unit: 'deep reflections', progressType: 'cumulative', milestones: [] },
            evolutionPath: [{
              fromStage: 1,
              toStage: 2,
              requirements: [{ type: 'depth_marker', value: 10 }],
              evolutionStory: 'Your moments of presence are weaving into a practice.',
              celebrationRitual: 'Sit quietly for one minute and feel grateful for your journey.'
            }],
            rarity: 'meaningful',
            isHidden: false,
            celebrationMessage: 'This moment of deep reflection is a gift to your future self.'
          }
        ]
      }
    ];
  }
  
  private static checkEvolutionReadiness(badge: Badge, progress: BadgeProgress): boolean {
    const evolution = badge.evolutionPath.find(e => e.fromStage === badge.stage.level);
    if (!evolution) return false;
    
    return evolution.requirements.every(req => {
      switch (req.type) {
        case 'reflection_count':
        case 'streak_days':
        case 'category_focus':
        case 'depth_marker':
        case 'emotional_range':
        case 'self_compassion':
        case 'growth_moment':
          return progress.currentValue >= req.value;
        default:
          return true;
      }
    });
  }
  
  private static generateEvolutionMessage(badge: Badge): string {
    const messages = [
      `Your ${badge.name || 'journey'} is ready to evolve. Feel the growth within.`,
      `Something beautiful is emerging in your ${badge.category || 'healing'} journey.`,
      `The seeds you've planted are ready to bloom.`,
      `Your dedication has created space for transformation.`,
      `Evolution awaits - you've earned this growth.`
    ];
    
    if (messages.length === 0) {
      return "Your growth is ready to unfold.";
    }
    
    return messages[Math.floor(Math.random() * messages.length)]!;
  }
  
  private static getNextStage(badge: Badge, stageLevel: number): BadgeStage {
    // This would lookup the next stage definition
    // For now, return a placeholder
    return {
      level: stageLevel,
      name: `Stage ${stageLevel}`,
      description: 'Next level of growth',
      requirements: [],
      icon: '✨',
      color: 'var(--sage-600)',
      celebrationText: 'You\'ve evolved beautifully.'
    };
  }
  
  private static initializeNextStageProgress(currentBadge: Badge, nextStage: BadgeStage): BadgeProgress {
    const requirement = nextStage.requirements[0];
    return {
      currentValue: 0,
      targetValue: requirement?.value || 1,
      unit: this.getProgressUnit(requirement?.type),
      progressType: 'cumulative',
      milestones: this.generateMilestones(requirement?.value || 1)
    };
  }
  
  private static getProgressUnit(type?: string): string {
    const units = {
      'reflection_count': 'reflections',
      'streak_days': 'days of presence',
      'category_focus': 'focused reflections',
      'depth_marker': 'deep reflections',
      'emotional_range': 'emotions explored',
      'self_compassion': 'moments of kindness',
      'growth_moment': 'growth moments'
    };
    return units[type || 'reflection_count'] || 'milestones';
  }
  
  private static generateMilestones(target: number): Milestone[] {
    const milestones: Milestone[] = [];
    const steps = [0.25, 0.5, 0.75, 1.0];
    
    steps.forEach(step => {
      const value = Math.floor(target * step);
      if (value > 0 && value < target) {
        milestones.push({
          value,
          message: this.getMilestoneMessage(step),
          isReached: false
        });
      }
    });
    
    return milestones;
  }
  
  private static getMilestoneMessage(progress: number): string {
    const messages: Record<number, string> = {
      0.25: "The journey begins with a single step. Beautiful.",
      0.5: "You're finding your rhythm. Feel the momentum.",
      0.75: "So close to transformation. Trust the process.",
      1.0: "Evolution awaits. You've prepared well."
    };
    return messages[progress] || "Progress is happening.";
  }
  
  private static getNewCapabilities(stage: BadgeStage): string[] {
    // Return new "powers" or perspectives unlocked
    return [
      "Deeper self-awareness",
      "Enhanced emotional wisdom",
      "Stronger resilience",
      "Greater self-compassion"
    ];
  }
  
  private static createEmptyProgress(badge: Badge): BadgeProgress {
    const requirement = badge.stage.requirements[0];
    return {
      currentValue: 0,
      targetValue: requirement?.value || 1,
      unit: this.getProgressUnit(requirement?.type),
      progressType: 'cumulative',
      milestones: []
    };
  }
  
  /**
   * Calculate how the user's identity is evolving through their badge journey
   */
  private static calculateIdentityEvolution(badges: Badge[], userActivity: UserActivity): IdentityEvolution {
    const identityShifts = this.detectIdentityShifts(badges);
    const currentArchetype = this.determineCurrentArchetype(badges, userActivity);
    const archetypeEvolution = this.traceArchetypeEvolution(badges);
    const transformationMilestones = this.identifyTransformationMilestones(badges);
    
    return {
      coreIdentityShifts: identityShifts,
      currentArchetype,
      archetypeEvolution,
      identityStrengths: this.extractIdentityStrengths(badges),
      emergingQualities: this.identifyEmergingQualities(badges, userActivity),
      transformationMilestones,
      soulSignature: this.generateSoulSignature(badges, userActivity)
    };
  }
  
  /**
   * Identify the most compelling evolution opportunities for maximum engagement
   */
  private static identifyEvolutionOpportunities(badges: Badge[], userActivity: UserActivity): EvolutionOpportunity[] {
    const opportunities: EvolutionOpportunity[] = [];
    
    // Badge evolution opportunities
    badges.forEach(badge => {
      const { readyForEvolution, evolutionMessage } = this.calculateProgress(badge, userActivity);
      if (readyForEvolution) {
        opportunities.push({
          type: 'badge_evolution',
          title: `${badge.name} Ready to Evolve`,
          description: evolutionMessage || 'Your growth has created space for transformation.',
          nextSteps: [`Complete your next ${badge.progress.unit}`],
          potentialGift: 'Deeper understanding of your capacity',
          readinessScore: 1.0,
          psychologicalReward: 'You\'ll unlock new aspects of your identity'
        });
      }
    });
    
    // Archetype shift opportunities
    const currentArchetype = this.determineCurrentArchetype(badges, userActivity);
    const nextArchetype = this.predictNextArchetype(currentArchetype, userActivity);
    if (nextArchetype && nextArchetype.name !== currentArchetype.name) {
      opportunities.push({
        type: 'archetype_shift',
        title: `Evolving Toward ${nextArchetype.name}`,
        description: `You're growing into a ${nextArchetype.name} - ${nextArchetype.description}`,
        nextSteps: this.getArchetypeEvolutionSteps(currentArchetype, nextArchetype),
        potentialGift: nextArchetype.giftToWorld,
        readinessScore: this.calculateArchetypeReadiness(currentArchetype, nextArchetype, userActivity),
        psychologicalReward: 'You\'ll step into a more powerful version of yourself'
      });
    }
    
    return opportunities.sort((a, b) => b.readinessScore - a.readinessScore);
  }
  
  /**
   * Generate a psychological profile based on badge patterns
   */
  private static generatePsychologicalProfile(badges: Badge[], userActivity: UserActivity): PsychologicalProfile {
    const dominantCategories = this.analyzeDominantCategories(badges);
    const growthPatterns = this.identifyGrowthPatterns(userActivity);
    
    return {
      dominantStrengths: this.mapCategoryToStrengths(dominantCategories),
      growthPatterns,
      healingStyle: this.determineHealingStyle(badges, userActivity),
      resilenceType: this.determineResilienceType(badges),
      connectionsNeed: this.assessConnectionNeeds(userActivity),
      wisdomExpression: this.identifyWisdomExpression(badges, userActivity)
    };
  }
  
  /**
   * Detect profound identity shifts from badge achievements
   */
  private static detectIdentityShifts(badges: Badge[]): IdentityShift[] {
    const shifts: IdentityShift[] = [];
    
    // Look for specific badge combinations that indicate identity shifts
    const hasPresence = badges.some(b => b.category === 'wisdom' && b.unlockedAt);
    const hasSelfCompassion = badges.some(b => b.category === 'healing' && b.unlockedAt);
    const hasResilience = badges.some(b => b.category === 'resilience' && b.unlockedAt);
    
    if (hasPresence && hasSelfCompassion) {
      shifts.push({
        from: 'Someone who struggles with self-judgment',
        to: 'Someone who meets themselves with presence and kindness',
        catalyst: 'Developing both presence and self-compassion',
        consolidatedAt: new Date(),
        evidence: badges.filter(b => b.category === 'wisdom' || b.category === 'healing').map(b => b.id)
      });
    }
    
    if (hasResilience && badges.filter(b => b.unlockedAt).length >= 5) {
      shifts.push({
        from: 'Someone who sees difficulty as failure',
        to: 'Someone who alchemizes challenges into wisdom',
        catalyst: 'Learning resilience through consistent practice',
        consolidatedAt: new Date(),
        evidence: badges.filter(b => b.category === 'resilience').map(b => b.id)
      });
    }
    
    return shifts;
  }
  
  /**
   * Determine the user's current healing archetype
   */
  private static determineCurrentArchetype(badges: Badge[], userActivity: UserActivity): HealingArchetype {
    const unlockedBadges = badges.filter(b => b.unlockedAt);
    const dominantCategory = this.getDominantCategory(unlockedBadges);
    const totalWisdom = userActivity.selfCompassionMoments + userActivity.deepReflections;
    const consistency = userActivity.currentStreak;
    
    // The Gentle Warrior (resilience + compassion)
    if (dominantCategory === 'resilience' && userActivity.selfCompassionMoments >= 10) {
      return {
        name: 'The Gentle Warrior',
        description: 'You embody strength wrapped in softness',
        coreQualities: ['Resilient', 'Compassionate', 'Grounded', 'Courageous'],
        growthEdge: 'Learning to trust your intuitive wisdom even more deeply',
        giftToWorld: 'You show others how to be both strong and tender',
        shadowWork: 'Accepting that you don\'t always have to be the strong one',
        evolutionPotential: 'Becoming the Wise Teacher - someone who guides others through their own healing'
      };
    }
    
    // The Luminous Seeker (wisdom + growth)
    if (dominantCategory === 'wisdom' || dominantCategory === 'growth') {
      return {
        name: 'The Luminous Seeker',
        description: 'You illuminate truth through authentic questioning',
        coreQualities: ['Insightful', 'Curious', 'Present', 'Authentic'],
        growthEdge: 'Trusting your insights and sharing your wisdom',
        giftToWorld: 'Your questions help others discover their own truth',
        shadowWork: 'Learning that you don\'t need to understand everything',
        evolutionPotential: 'Becoming the Sacred Mirror - reflecting others\' potential back to them'
      };
    }
    
    // The Heart Healer (healing dominant)
    if (dominantCategory === 'healing') {
      return {
        name: 'The Heart Healer',
        description: 'You specialize in healing through self-compassion',
        coreQualities: ['Compassionate', 'Nurturing', 'Intuitive', 'Healing'],
        growthEdge: 'Extending your self-compassion into service to others',
        giftToWorld: 'You create safe spaces for others to heal their hearts',
        shadowWork: 'Learning to receive the compassion you so freely give',
        evolutionPotential: 'Becoming the Sacred Witness - holding space for profound transformation'
      };
    }
    
    // Default: The Brave Beginner
    return {
      name: 'The Brave Beginner',
      description: 'You have the courage to start your healing journey',
      coreQualities: ['Courageous', 'Open', 'Learning', 'Growing'],
      growthEdge: 'Discovering your unique gifts and healing style',
      giftToWorld: 'Your willingness to begin inspires others to start their own journey',
      shadowWork: 'Learning to trust the process even when you can\'t see the outcome',
      evolutionPotential: 'Discovering your true healing archetype through continued practice'
    };
  }
  
  /**
   * Generate a unique soul signature based on their healing pattern
   */
  private static generateSoulSignature(badges: Badge[], userActivity: UserActivity): string {
    const presenceLevel = badges.filter(b => b.category === 'wisdom' && b.unlockedAt).length;
    const healingLevel = badges.filter(b => b.category === 'healing' && b.unlockedAt).length;  
    const growthLevel = badges.filter(b => b.category === 'growth' && b.unlockedAt).length;
    const resilienceLevel = badges.filter(b => b.category === 'resilience' && b.unlockedAt).length;
    
    const elements = [];
    if (presenceLevel >= 2) elements.push('Luminous');
    if (healingLevel >= 2) elements.push('Compassionate'); 
    if (growthLevel >= 2) elements.push('Seeking');
    if (resilienceLevel >= 2) elements.push('Resilient');
    
    const coreEssence = elements.length > 0 ? elements.join('-') : 'Emerging';
    const uniqueNumber = (userActivity.totalReflections + userActivity.currentStreak) % 1000;
    
    return `${coreEssence}-Soul-${uniqueNumber}`;
  }
  
  // Helper methods for the revolutionary system
  private static traceArchetypeEvolution(badges: Badge[]): ArchetypeEvolution[] {
    // TODO: Implement archetype evolution tracing
    return [];
  }
  
  private static identifyTransformationMilestones(badges: Badge[]): TransformationMilestone[] {
    // TODO: Implement transformation milestone identification
    return [];
  }
  
  private static extractIdentityStrengths(badges: Badge[]): string[] {
    const strengths = new Set<string>();
    
    badges.filter(b => b.unlockedAt).forEach(badge => {
      switch (badge.category) {
        case 'wisdom':
          strengths.add('Mindful Presence');
          strengths.add('Deep Awareness');
          break;
        case 'healing':
          strengths.add('Self-Compassion');
          strengths.add('Emotional Intelligence');
          break;
        case 'growth':
          strengths.add('Insight Generation');
          strengths.add('Pattern Recognition');
          break;
        case 'resilience':
          strengths.add('Flexible Strength');
          strengths.add('Trauma Integration');
          break;
      }
    });
    
    return Array.from(strengths);
  }
  
  private static identifyEmergingQualities(badges: Badge[], userActivity: UserActivity): string[] {
    const emerging = [];
    
    // Look for qualities that are beginning to emerge
    if (userActivity.deepReflections >= 5 && userActivity.deepReflections < 15) {
      emerging.push('Developing Wisdom');
    }
    
    if (userActivity.selfCompassionMoments >= 3 && userActivity.selfCompassionMoments < 10) {
      emerging.push('Growing Self-Acceptance');
    }
    
    if (userActivity.currentStreak >= 7 && userActivity.currentStreak < 21) {
      emerging.push('Building Sacred Routine');
    }
    
    return emerging;
  }
  
  private static predictNextArchetype(currentArchetype: HealingArchetype, userActivity: UserActivity): HealingArchetype | null {
    // TODO: Implement next archetype prediction based on growth patterns
    return null;
  }
  
  private static getArchetypeEvolutionSteps(current: HealingArchetype, next: HealingArchetype): string[] {
    // TODO: Implement archetype evolution steps
    return ['Continue your practice', 'Explore new depths', 'Trust your growth'];
  }
  
  private static calculateArchetypeReadiness(current: HealingArchetype, next: HealingArchetype, userActivity: UserActivity): number {
    // TODO: Implement archetype readiness calculation
    return 0.7;
  }
  
  private static analyzeDominantCategories(badges: Badge[]): Badge['category'][] {
    const categoryCounts = badges.reduce((counts, badge) => {
      if (badge.unlockedAt) {
        counts[badge.category] = (counts[badge.category] || 0) + 1;
      }
      return counts;
    }, {} as Record<Badge['category'], number>);
    
    return Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([category]) => category as Badge['category']);
  }
  
  private static identifyGrowthPatterns(userActivity: UserActivity): string[] {
    const patterns = [];
    
    if (userActivity.currentStreak >= 7) {
      patterns.push('Consistent Practice');
    }
    
    if (userActivity.deepReflections / Math.max(1, userActivity.totalReflections) > 0.3) {
      patterns.push('Depth-Oriented Growth');
    }
    
    if (userActivity.selfCompassionMoments >= 10) {
      patterns.push('Heart-Centered Healing');
    }
    
    return patterns;
  }
  
  private static mapCategoryToStrengths(categories: Badge['category'][]): string[] {
    const strengthMap: Record<Badge['category'], string[]> = {
      wisdom: ['Mindful Awareness', 'Present Moment Mastery'],
      healing: ['Emotional Resilience', 'Self-Compassion'],
      growth: ['Insight Generation', 'Learning Agility'],
      resilience: ['Adaptive Strength', 'Trauma Integration'],
      connection: ['Relational Wisdom', 'Community Building'],
      purpose: ['Meaning-Making', 'Values Alignment']
    };
    
    const strengths = new Set<string>();
    categories.slice(0, 2).forEach(category => {
      strengthMap[category]?.forEach(strength => strengths.add(strength));
    });
    
    return Array.from(strengths);
  }
  
  private static determineHealingStyle(badges: Badge[], userActivity: UserActivity): PsychologicalProfile['healingStyle'] {
    const gentleBadges = badges.filter(b => b.category === 'healing' && b.unlockedAt).length;
    const courageousBadges = badges.filter(b => b.category === 'resilience' && b.unlockedAt).length; 
    const wiseBadges = badges.filter(b => b.category === 'wisdom' && b.unlockedAt).length;
    const transformativeBadges = badges.filter(b => b.category === 'growth' && b.unlockedAt).length;
    
    const styles = [
      { style: 'gentle' as const, score: gentleBadges },
      { style: 'courageous' as const, score: courageousBadges },
      { style: 'wise' as const, score: wiseBadges },
      { style: 'transformative' as const, score: transformativeBadges }
    ];
    
    return styles.sort((a, b) => b.score - a.score)[0]?.style || 'gentle';
  }
  
  private static determineResilienceType(badges: Badge[]): PsychologicalProfile['resilenceType'] {
    // TODO: Implement resilience type determination
    return 'flexible';
  }
  
  private static assessConnectionNeeds(userActivity: UserActivity): PsychologicalProfile['connectionsNeed'] {
    // TODO: Implement connection needs assessment
    return 'intimate';
  }
  
  private static identifyWisdomExpression(badges: Badge[], userActivity: UserActivity): PsychologicalProfile['wisdomExpression'] {
    // TODO: Implement wisdom expression identification
    return 'quiet';
  }
  
  private static getDominantCategory(badges: Badge[]): Badge['category'] {
    const categoryCounts = badges.reduce((counts, badge) => {
      counts[badge.category] = (counts[badge.category] || 0) + 1;
      return counts;
    }, {} as Record<Badge['category'], number>);
    
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a);
    
    return (sortedCategories[0]?.[0] as Badge['category']) || 'healing';
  }
}

// Supporting interfaces
export interface UserActivity {
  totalReflections: number;
  currentStreak: number;
  categoryReflections: Record<string, number>;
  deepReflections: number;
  uniqueEmotions: string[];
  selfCompassionMoments: number;
  growthMoments: number;
}

export interface CelebrationMoment {
  type: 'evolution' | 'milestone' | 'completion';
  title: string;
  message: string;
  icon: string;
  ritual: string;
  newCapabilities?: string[];
}

/**
 * Revolutionary Identity Evolution System
 * Tracks how the user's sense of self transforms through their healing journey
 */
export interface IdentityEvolution {
  coreIdentityShifts: IdentityShift[];
  currentArchetype: HealingArchetype;
  archetypeEvolution: ArchetypeEvolution[];
  identityStrengths: string[];
  emergingQualities: string[];
  transformationMilestones: TransformationMilestone[];
  soulSignature: string; // A unique identifier of their healing essence
}

export interface IdentityShift {
  from: string; // Old identity belief
  to: string;   // New identity belief
  catalyst: string; // What caused the shift
  consolidatedAt: Date;
  evidence: string[]; // Badge achievements that prove this shift
}

export interface HealingArchetype {
  name: string;
  description: string;
  coreQualities: string[];
  growthEdge: string; // Where they're growing next
  giftToWorld: string; // How they heal others
  shadowWork: string; // What they're still integrating
  evolutionPotential: string;
}

export interface ArchetypeEvolution {
  fromArchetype: string;
  toArchetype: string;
  evolutionStory: string;
  evolvedAt: Date;
  catalystBadges: string[]; // Which badges triggered this evolution
}

export interface TransformationMilestone {
  id: string;
  name: string;
  description: string;
  reachedAt: Date;
  celebrationRitual: string;
  identityGift: string; // New aspect of identity unlocked
  wisdomGained: string;
}

export interface EvolutionOpportunity {
  type: 'badge_evolution' | 'archetype_shift' | 'identity_expansion' | 'wisdom_integration';
  title: string;
  description: string;
  nextSteps: string[];
  potentialGift: string;
  readinessScore: number; // 0-1, how ready they are
  psychologicalReward: string;
}

export interface PsychologicalProfile {
  dominantStrengths: string[];
  growthPatterns: string[];
  healingStyle: 'gentle' | 'courageous' | 'wise' | 'transformative';
  resilenceType: 'flexible' | 'enduring' | 'adaptive' | 'revolutionary';
  connectionsNeed: 'solitude' | 'intimate' | 'community' | 'universal';
  wisdomExpression: 'quiet' | 'creative' | 'teaching' | 'service';
}