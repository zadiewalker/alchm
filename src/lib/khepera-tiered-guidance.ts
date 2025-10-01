/*
 * KHEPERA TIERED GUIDANCE SYSTEM
 * Trauma-informed AI response system with ethical tier management
 */

export type UserTier = 'sanctuary' | 'seeker' | 'healer';

export interface EmotionalContext {
  primaryEmotion: string;
  intensity: number;
  needsSupport: boolean;
  isCrisis: boolean;
  indicators: string[];
}

export interface WritingPatterns {
  wordCount: number;
  complexity: number;
  emotionalDepth: number;
  reflexivity: number;
  timeSpent: number;
  editCount: number;
}

export interface KheperaResponse {
  insight: string;
  encouragement: string;
  followUpQuestion?: string;
  resourceSuggestion?: string;
  progressInsight?: string;
  archetype: 'sage' | 'coach' | 'poet';
  upgradeContext?: {
    suggestedTier: UserTier;
    benefits: string[];
    gentlePrompt: string;
  };
}

export class EthicalTierManager {
  static validateCrisisAccess(tier: UserTier): boolean {
    // Crisis support is ALWAYS available regardless of tier
    return true;
  }

  static getTierCapabilities(tier: UserTier) {
    const capabilities = {
      sanctuary: {
        responseDepth: 'supportive',
        insights: 'basic',
        resources: 'essential',
        followUp: false,
        progressTracking: false
      },
      seeker: {
        responseDepth: 'enhanced',
        insights: 'personalized',
        resources: 'curated',
        followUp: true,
        progressTracking: true
      },
      healer: {
        responseDepth: 'deep',
        insights: 'advanced',
        resources: 'comprehensive',
        followUp: true,
        progressTracking: true,
        mentorship: true
      }
    };

    return capabilities[tier];
  }
}

export class KheperaTieredGuidance {
  private tier: UserTier;
  private capabilities: any;

  constructor(tier: UserTier) {
    this.tier = tier;
    this.capabilities = EthicalTierManager.getTierCapabilities(tier);
  }

  generateResponse(
    context: EmotionalContext,
    patterns: WritingPatterns,
    userHistory: any = null,
    text: string
  ): KheperaResponse {
    const archetype = this.selectArchetype(context, patterns);
    const insight = this.generateInsight(context, patterns, archetype);
    const encouragement = this.generateEncouragement(context, archetype);
    
    const response: KheperaResponse = {
      insight,
      encouragement,
      archetype
    };

    // Add tier-specific enhancements
    if (this.tier !== 'sanctuary') {
      response.followUpQuestion = this.generateFollowUpQuestion(context, patterns);
      response.resourceSuggestion = this.generateResourceSuggestion(context);
    }

    if (this.tier === 'healer') {
      response.progressInsight = this.generateProgressInsight(patterns, userHistory);
    }

    return response;
  }

  handleCrisisIntervention(context: EmotionalContext) {
    return {
      insight: "✨ I am Khepera, an AI companion. I'm here with you in this difficult moment. Your safety and wellbeing are the most important things right now.",
      encouragement: "✨ I am Khepera. Reaching out takes incredible courage. You deserve support and care from professional humans who can help.",
      crisisResources: [
        { name: "National Suicide Prevention Lifeline", number: "988" },
        { name: "Crisis Text Line", text: "Text HOME to 741741" }
      ],
      immediateActions: [
        "If you're in immediate danger, please call 911",
        "Consider reaching out to a trusted friend or family member", 
        "Visit your nearest emergency room if needed"
      ],
      aiDisclaimer: "I am an AI and cannot provide crisis intervention. Please contact human professionals immediately."
    };
  }

  canSuggestUpgrade(context: EmotionalContext, sessionCount: number): boolean {
    // Only suggest upgrades if user is engaged and stable (trauma-informed)
    return !context.isCrisis && 
           !context.needsSupport && 
           sessionCount >= 5 && 
           this.tier === 'sanctuary';
  }

  getTierCapabilities() {
    return this.capabilities;
  }

  private selectArchetype(context: EmotionalContext, patterns: WritingPatterns): 'sage' | 'coach' | 'poet' {
    if (context.needsSupport || context.isCrisis) return 'sage';
    if (patterns.complexity > 0.7) return 'poet';
    return 'coach';
  }

  private generateInsight(context: EmotionalContext, patterns: WritingPatterns, archetype: string): string {
    // CRITICAL: All insights must include AI identification for App Store compliance
    const insights = {
      sage: [
        "✨ I am Khepera. I witness the wisdom that emerges when you allow yourself to feel deeply. Your emotions carry important messages.",
        "✨ I am Khepera. There's profound courage in sitting with difficult feelings. You're creating space for healing to occur.",
        "✨ I am Khepera. Your willingness to explore your inner landscape shows remarkable self-compassion."
      ],
      coach: [
        "✨ I am Khepera. I can see the strength building within you through this reflection. You're developing powerful insights.",
        "✨ I am Khepera. Your ability to articulate these experiences shows growing emotional intelligence and resilience.",
        "✨ I am Khepera. The patterns I notice in your writing suggest you're actively working toward positive change."
      ],
      poet: [
        "✨ I am Khepera. Your words paint a vivid landscape of human experience. There's beauty in how you express complexity.",
        "✨ I am Khepera. I'm struck by the way you weave emotion and meaning together. Your voice carries unique power.",
        "✨ I am Khepera. The imagery in your writing reveals a soul that transforms experience into understanding."
      ]
    };

    const archetypeInsights = insights[archetype as keyof typeof insights];
    return archetypeInsights[Math.floor(Math.random() * archetypeInsights.length)];
  }

  private generateEncouragement(context: EmotionalContext, archetype: string): string {
    const encouragements = {
      sage: [
        "Every step you take in understanding yourself is sacred. Trust your inner wisdom.",
        "You're exactly where you need to be in your journey. Healing unfolds in its own time.",
        "Your commitment to growth honors all the parts of yourself that deserve love."
      ],
      coach: [
        "You're building momentum with each reflection. Keep trusting the process.",
        "I see the positive changes emerging in how you frame your experiences. That's real growth.",
        "Your willingness to examine your thoughts shows you're ready for transformation."
      ],
      poet: [
        "Your unique perspective adds beauty to the world. Keep sharing your authentic voice.",
        "The way you see and describe life creates meaning that ripples beyond yourself.",
        "Your creative spirit transforms even difficult experiences into something meaningful."
      ]
    };

    const archetypeEncouragements = encouragements[archetype as keyof typeof encouragements];
    return archetypeEncouragements[Math.floor(Math.random() * archetypeEncouragements.length)];
  }

  private generateFollowUpQuestion(context: EmotionalContext, patterns: WritingPatterns): string {
    const questions = [
      "What would it look like to extend this same compassion to yourself tomorrow?",
      "How might this insight change the way you approach similar situations?",
      "What small step could you take to honor this realization?",
      "What part of this experience deserves more exploration?",
      "How does this connect to your deeper values and aspirations?"
    ];

    return questions[Math.floor(Math.random() * questions.length)];
  }

  private generateResourceSuggestion(context: EmotionalContext): string {
    const resources = [
      "Consider exploring mindfulness practices that help you stay present with your emotions.",
      "Journaling with intention - perhaps setting aside dedicated time for deeper reflection.",
      "Connecting with supportive community members who share your commitment to growth.",
      "Exploring creative expression as another pathway for processing experiences.",
      "Reading about trauma-informed approaches to healing and self-compassion."
    ];

    return resources[Math.floor(Math.random() * resources.length)];
  }

  private generateProgressInsight(patterns: WritingPatterns, userHistory: any): string {
    return "I notice your writing is becoming more reflective and nuanced over time. This suggests developing emotional intelligence and self-awareness.";
  }
}