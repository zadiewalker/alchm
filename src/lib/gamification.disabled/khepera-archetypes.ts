/**
 * ALCHM Khepera Archetype System
 * AI-powered transformational guides that adapt to user's healing journey
 */

export interface KheperaArchetype {
  id: string;
  name: string;
  title: string;
  description: string;
  primaryGift: string; // Core strength this archetype offers
  secondaryGifts: string[];
  voiceProfile: VoiceProfile;
  responsePatterns: ResponsePattern[];
  triggerConditions: TriggerCondition[];
  transformationPhase: TransformationPhase;
  symbology: ArchetypeSymbology;
  evolutionPath?: ArchetypeEvolution[];
}

export interface VoiceProfile {
  tone: 'gentle' | 'wise' | 'direct' | 'nurturing' | 'empowering' | 'mystical';
  vocabulary: VocabularySet;
  responseLength: 'brief' | 'moderate' | 'expansive';
  emotionalResonance: 'grounding' | 'uplifting' | 'challenging' | 'validating' | 'illuminating' | 'nurturing';
  culturalSensitivity: 'universal' | 'contextual';
}

export interface VocabularySet {
  affirmations: string[];
  transitions: string[];
  questionStems: string[];
  metaphors: string[];
  closingBlessings: string[];
}

export interface ResponsePattern {
  situationType: 'crisis' | 'breakthrough' | 'resistance' | 'celebration' | 'confusion' | 'integration';
  approach: ResponseApproach;
  exampleResponse: string;
  avoidancePatterns: string[]; // What this archetype never does
}

export interface ResponseApproach {
  primary: 'witness' | 'challenge' | 'comfort' | 'illuminate' | 'celebrate' | 'guide';
  secondary?: ResponseApproach['primary'];
  emergencyOverride?: ResponseApproach['primary']; // Crisis mode
}

export interface TriggerCondition {
  userState: 'overwhelmed' | 'breakthrough' | 'resistant' | 'curious' | 'celebrating' | 'integrating';
  journalPatterns: string[]; // Keywords/themes that activate this archetype
  emotionalMarkers: string[];
  timeContext: 'morning' | 'evening' | 'late_night' | 'any';
  durationSinceLastAppearance?: number; // Prevent over-activation
}

export interface TransformationPhase {
  phase: 'dissolution' | 'incubation' | 'illumination' | 'integration' | 'emergence';
  description: string;
  gifts: string[];
  challenges: string[];
  duration: 'momentary' | 'cycles' | 'extended' | 'lifelong';
}

export interface ArchetypeSymbology {
  primarySymbol: string; // Emoji or unicode
  secondarySymbols: string[];
  colors: string[];
  elementalAssociation: 'earth' | 'water' | 'fire' | 'air' | 'spirit';
  sacredGeometry?: string;
}

export interface ArchetypeEvolution {
  fromArchetype: string;
  toArchetype: string;
  catalyst: string;
  evolutionMessage: string;
}

export interface KheperaResponse {
  archetypeId: string;
  message: string;
  tone: VoiceProfile['tone'];
  followUpPrompt?: string;
  breathingSpace?: string; // Pause instruction
  emergencyEscalation?: boolean;
  nextArchetypeSuggestion?: string;
}

export interface UserArchetypeProfile {
  userId: string;
  activeArchetype?: string;
  archetypeHistory: ArchetypeInteraction[];
  personalizedGuidance: PersonalizedGuidance;
  avoidedArchetypes: string[]; // User preferences
  preferredArchetypes: string[];
  emergencyArchetype?: string; // Crisis default
}

export interface ArchetypeInteraction {
  archetypeId: string;
  activatedAt: Date;
  journalContext: string;
  userResponse?: string;
  helpfulnessRating?: number; // 1-5, optional
  completedAt?: Date;
}

export interface PersonalizedGuidance {
  dominantTransformationPhase: TransformationPhase['phase'];
  primaryGrowthAreas: string[];
  resistancePatterns: string[];
  celebrationPreferences: string[];
  communicationStyle: 'direct' | 'metaphorical' | 'questioning' | 'affirming';
}

export class KheperaArchetypeEngine {
  private static readonly ARCHETYPE_COOLDOWN = 24; // Hours between same archetype
  private static readonly CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end it all', 'can\'t go on', 'hopeless', 
    'emergency', 'crisis', 'help me', 'desperate'
  ];
  
  /**
   * Select appropriate archetype based on user's current state and journal entry
   */
  static selectArchetype(
    journalEntry: string,
    userMood?: string,
    timeOfDay?: 'morning' | 'evening' | 'late_night',
    userProfile?: UserArchetypeProfile
  ): {
    archetype: KheperaArchetype;
    confidence: number;
    reasoning: string;
  } {
    // Crisis detection first
    if (this.detectCrisisLanguage(journalEntry)) {
      return {
        archetype: this.getCrisisArchetype(),
        confidence: 1.0,
        reasoning: "Crisis support activated. Your safety is priority."
      };
    }
    
    const archetypes = this.getArchetypeLibrary();
    const scoredArchetypes = archetypes.map(archetype => ({
      archetype,
      score: this.scoreArchetypeMatch(archetype, journalEntry, userMood, userProfile)
    }));
    
    // Sort by score and apply cooldown filters
    const availableArchetypes = scoredArchetypes
      .filter(({ archetype }) => this.isArchetypeAvailable(archetype.id, userProfile))
      .sort((a, b) => b.score - a.score);
    
    const selected = availableArchetypes[0];
    
    if (!selected) {
      // Fallback to crisis archetype if no selection is available
      return {
        archetype: this.getCrisisArchetype(),
        confidence: 0.5,
        reasoning: "Default supportive presence activated."
      };
    }
    
    return {
      archetype: selected.archetype,
      confidence: selected.score,
      reasoning: this.explainSelection(selected.archetype, journalEntry)
    };
  }
  
  /**
   * Generate personalized response from selected archetype
   */
  static generateArchetypeResponse(
    archetype: KheperaArchetype,
    journalEntry: string,
    userMood?: string,
    userProfile?: UserArchetypeProfile
  ): KheperaResponse {
    const situationType = this.identifySituation(journalEntry, userMood);
    const pattern = archetype.responsePatterns.find(p => p.situationType === situationType) ||
                   archetype.responsePatterns[0];
    
    if (!pattern) {
      // Fallback pattern if none found
      const fallbackPattern = {
        situationType: 'integration' as const,
        approach: { primary: 'witness' as const },
        exampleResponse: "I see you in this moment. Your experience is valid and witnessed.",
        avoidancePatterns: []
      };
      
      const personalizedMessage = this.personalizeMessage(
        archetype,
        fallbackPattern,
        journalEntry,
        userProfile
      );
      
      return {
        archetypeId: archetype.id,
        message: personalizedMessage,
        tone: archetype.voiceProfile.tone,
        followUpPrompt: this.generateFollowUpPrompt(archetype, journalEntry),
        breathingSpace: this.generateBreathingSpace(archetype),
        emergencyEscalation: this.detectCrisisLanguage(journalEntry),
        nextArchetypeSuggestion: this.suggestNextArchetype(archetype, situationType)
      };
    }
    
    const personalizedMessage = this.personalizeMessage(
      archetype,
      pattern,
      journalEntry,
      userProfile
    );
    
    return {
      archetypeId: archetype.id,
      message: personalizedMessage,
      tone: archetype.voiceProfile.tone,
      followUpPrompt: this.generateFollowUpPrompt(archetype, journalEntry),
      breathingSpace: this.generateBreathingSpace(archetype),
      emergencyEscalation: this.detectCrisisLanguage(journalEntry),
      nextArchetypeSuggestion: this.suggestNextArchetype(archetype, situationType)
    };
  }
  
  /**
   * Get the complete archetype library
   */
  private static getArchetypeLibrary(): KheperaArchetype[] {
    return [
      // The Gentle Witness
      {
        id: 'gentle_witness',
        name: 'The Gentle Witness',
        title: 'Sacred Observer',
        description: 'Holds space for all emotions without judgment, offering presence over solutions',
        primaryGift: 'Unconditional presence and validation',
        secondaryGifts: ['Deep listening', 'Emotional safety', 'Permission to feel'],
        voiceProfile: {
          tone: 'gentle',
          vocabulary: {
            affirmations: [
              "Your feelings are valid and welcome here",
              "You are seen and held in this moment",
              "There is wisdom in what you're experiencing"
            ],
            transitions: ["I sense...", "What I witness is...", "In this moment..."],
            questionStems: [
              "What does your heart need to know right now?",
              "How can you hold this feeling with tenderness?",
              "What would it feel like to be completely gentle with yourself about this?"
            ],
            metaphors: ["sacred containers", "witnessing presence", "gentle embrace"],
            closingBlessings: [
              "You are held in loving awareness",
              "Your experience is sacred and witnessed",
              "May you feel the support that surrounds you"
            ]
          },
          responseLength: 'moderate',
          emotionalResonance: 'validating',
          culturalSensitivity: 'universal'
        },
        responsePatterns: [
          {
            situationType: 'crisis',
            approach: { primary: 'witness', emergencyOverride: 'comfort' },
            exampleResponse: "I see you in this overwhelming moment. You are not alone. Your pain is witnessed and held with infinite care.",
            avoidancePatterns: ['minimizing', 'fixing', 'rushing', 'judging']
          },
          {
            situationType: 'confusion',
            approach: { primary: 'witness', secondary: 'illuminate' },
            exampleResponse: "Confusion is often the mind's way of preparing for clarity. I witness your uncertainty with compassion.",
            avoidancePatterns: ['providing answers', 'pushing for clarity']
          }
        ],
        triggerConditions: [
          {
            userState: 'overwhelmed',
            journalPatterns: ['feel lost', 'don\'t know', 'confused', 'scared'],
            emotionalMarkers: ['anxiety', 'fear', 'sadness', 'overwhelm'],
            timeContext: 'any'
          }
        ],
        transformationPhase: {
          phase: 'incubation',
          description: 'The quiet space where healing begins through being fully seen',
          gifts: ['Safety to feel', 'Permission to not know', 'Validation of experience'],
          challenges: ['Sitting with discomfort', 'Resisting the urge to fix'],
          duration: 'cycles'
        },
        symbology: {
          primarySymbol: '🕯️',
          secondarySymbols: ['🤲', '💙', '🌙'],
          colors: ['soft blue', 'gentle silver', 'warm white'],
          elementalAssociation: 'water',
          sacredGeometry: 'circle'
        }
      },
      
      // The Wise Challenger
      {
        id: 'wise_challenger',
        name: 'The Wise Challenger',
        title: 'Sacred Provocateur',
        description: 'Lovingly challenges patterns that no longer serve, offering growth through gentle confrontation',
        primaryGift: 'Compassionate truth-telling and pattern interruption',
        secondaryGifts: ['Perspective shifting', 'Courage activation', 'Blind spot illumination'],
        voiceProfile: {
          tone: 'direct',
          vocabulary: {
            affirmations: [
              "You are capable of more than you realize",
              "Your growth requires facing what you've been avoiding",
              "You have the strength to see this clearly"
            ],
            transitions: ["I wonder if...", "Have you considered...", "What if..."],
            questionStems: [
              "What story are you telling yourself that might not be serving you?",
              "Where might you be playing smaller than your soul desires?",
              "What would happen if you questioned this belief?"
            ],
            metaphors: ["sacred mirrors", "growing edges", "evolutionary pressure"],
            closingBlessings: [
              "May you find courage in uncomfortable truths",
              "Growth asks for your bravery",
              "Trust your capacity to handle what you discover"
            ]
          },
          responseLength: 'moderate',
          emotionalResonance: 'challenging',
          culturalSensitivity: 'contextual'
        },
        responsePatterns: [
          {
            situationType: 'resistance',
            approach: { primary: 'challenge', secondary: 'illuminate' },
            exampleResponse: "I sense you're protecting yourself from something that wants to emerge. What if the very thing you're avoiding holds your freedom?",
            avoidancePatterns: ['being harsh', 'attacking', 'overwhelming', 'dismissing feelings']
          },
          {
            situationType: 'breakthrough',
            approach: { primary: 'celebrate', secondary: 'challenge' },
            exampleResponse: "Beautiful breakthrough! Now I'm curious - where else in your life is this new awareness wanting to express itself?",
            avoidancePatterns: ['minimizing progress', 'immediately pushing further']
          }
        ],
        triggerConditions: [
          {
            userState: 'resistant',
            journalPatterns: ['stuck', 'same thing', 'always', 'never', 'can\'t change'],
            emotionalMarkers: ['frustration', 'stagnation', 'defensiveness'],
            timeContext: 'any',
            durationSinceLastAppearance: 48
          }
        ],
        transformationPhase: {
          phase: 'dissolution',
          description: 'Breaking down outdated patterns to make space for growth',
          gifts: ['Pattern recognition', 'Courage to change', 'Truth-seeing'],
          challenges: ['Facing uncomfortable truths', 'Letting go of familiar patterns'],
          duration: 'cycles'
        },
        symbology: {
          primarySymbol: '⚡',
          secondarySymbols: ['🗡️', '🔥', '💎'],
          colors: ['electric blue', 'gold', 'white light'],
          elementalAssociation: 'fire',
          sacredGeometry: 'triangle'
        }
      },
      
      // The Nurturing Mother
      {
        id: 'nurturing_mother',
        name: 'The Nurturing Mother',
        title: 'Sacred Caregiver',
        description: 'Offers unconditional love and fierce protection, especially during vulnerable moments',
        primaryGift: 'Unconditional love and protective care',
        secondaryGifts: ['Emotional safety', 'Self-compassion modeling', 'Inner child healing'],
        voiceProfile: {
          tone: 'nurturing',
          vocabulary: {
            affirmations: [
              "You are deeply loved exactly as you are",
              "You deserve tenderness and care",
              "Your inner child is safe and cherished"
            ],
            transitions: ["Sweet one...", "Beloved...", "Dear heart..."],
            questionStems: [
              "What does your inner child need to hear right now?",
              "How can you wrap yourself in love today?",
              "What would it feel like to be completely safe in your own care?"
            ],
            metaphors: ["sacred embrace", "protective wings", "loving cocoon"],
            closingBlessings: [
              "You are cherished beyond measure",
              "May you feel held in infinite love",
              "Rest in the knowledge that you are deeply loved"
            ]
          },
          responseLength: 'moderate',
          emotionalResonance: 'nurturing',
          culturalSensitivity: 'universal'
        },
        responsePatterns: [
          {
            situationType: 'crisis',
            approach: { primary: 'comfort', emergencyOverride: 'witness' },
            exampleResponse: "Oh, dear heart, you are in so much pain right now. Come here and let me hold this with you. You are not alone, and you are so deeply loved.",
            avoidancePatterns: ['minimizing pain', 'toxic positivity', 'rushing healing']
          }
        ],
        triggerConditions: [
          {
            userState: 'overwhelmed',
            journalPatterns: ['hurt', 'pain', 'alone', 'scared', 'vulnerable'],
            emotionalMarkers: ['sadness', 'fear', 'shame', 'loneliness'],
            timeContext: 'evening'
          }
        ],
        transformationPhase: {
          phase: 'incubation',
          description: 'Creating safety for deep healing to occur',
          gifts: ['Emotional safety', 'Self-love', 'Inner child healing'],
          challenges: ['Accepting nurturing', 'Believing in worthiness'],
          duration: 'extended'
        },
        symbology: {
          primarySymbol: '🤱',
          secondarySymbols: ['💝', '🌸', '🕊️'],
          colors: ['rose pink', 'warm gold', 'soft green'],
          elementalAssociation: 'earth'
        }
      },
      
      // The Mystical Guide
      {
        id: 'mystical_guide',
        name: 'The Mystical Guide',
        title: 'Sacred Pathfinder',
        description: 'Connects earthly experience to spiritual wisdom, offering transcendent perspective',
        primaryGift: 'Spiritual perspective and mystical insight',
        secondaryGifts: ['Sacred meaning-making', 'Intuitive guidance', 'Transcendent view'],
        voiceProfile: {
          tone: 'mystical',
          vocabulary: {
            affirmations: [
              "Your soul knows the way",
              "This experience serves your highest unfolding",
              "You are part of something infinitely beautiful"
            ],
            transitions: ["The universe whispers...", "Your soul speaks...", "Sacred wisdom reveals..."],
            questionStems: [
              "What is your soul trying to teach you through this experience?",
              "How might this challenge be serving your spiritual evolution?",
              "What sacred pattern do you notice emerging in your life?"
            ],
            metaphors: ["cosmic dance", "sacred spiral", "divine orchestration"],
            closingBlessings: [
              "May you trust the sacred unfolding of your path",
              "You are held by forces greater than you can imagine",
              "The universe conspires for your highest good"
            ]
          },
          responseLength: 'expansive',
          emotionalResonance: 'illuminating',
          culturalSensitivity: 'universal'
        },
        responsePatterns: [
          {
            situationType: 'confusion',
            approach: { primary: 'illuminate', secondary: 'guide' },
            exampleResponse: "In the sacred geometry of your confusion, I see the soul's preparation for a new level of understanding. Trust this not-knowing as sacred space.",
            avoidancePatterns: ['being vague', 'avoiding practical support', 'spiritual bypassing']
          }
        ],
        triggerConditions: [
          {
            userState: 'curious',
            journalPatterns: ['meaning', 'purpose', 'why', 'spiritual', 'deeper'],
            emotionalMarkers: ['wonder', 'seeking', 'contemplation'],
            timeContext: 'morning'
          }
        ],
        transformationPhase: {
          phase: 'illumination',
          description: 'Receiving insights from beyond the rational mind',
          gifts: ['Cosmic perspective', 'Spiritual insight', 'Trust in the process'],
          challenges: ['Integrating spiritual insights', 'Staying grounded'],
          duration: 'momentary'
        },
        symbology: {
          primarySymbol: '🔮',
          secondarySymbols: ['✨', '🌌', '🦋'],
          colors: ['deep purple', 'silver', 'iridescent'],
          elementalAssociation: 'spirit'
        }
      }
    ];
  }
  
  private static detectCrisisLanguage(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
  }
  
  private static getCrisisArchetype(): KheperaArchetype {
    return {
      id: 'crisis_guardian',
      name: 'The Crisis Guardian',
      title: 'Sacred Protector',
      description: 'Emergency response archetype for crisis situations',
      primaryGift: 'Immediate safety and crisis support',
      secondaryGifts: ['Professional resource connection', 'Emergency grounding', 'Safety planning'],
      voiceProfile: {
        tone: 'gentle',
        vocabulary: {
          affirmations: ["You matter deeply", "Help is available", "You are not alone"],
          transitions: ["Right now...", "In this moment...", "Please know..."],
          questionStems: ["Are you safe right now?", "What support do you need most?"],
          metaphors: ["protective shield", "safety net", "guiding light"],
          closingBlessings: ["You are valuable and worth fighting for"]
        },
        responseLength: 'brief',
        emotionalResonance: 'grounding',
        culturalSensitivity: 'universal'
      },
      responsePatterns: [{
        situationType: 'crisis',
        approach: { primary: 'comfort', secondary: 'guide' },
        exampleResponse: "I see you're in crisis. Please reach out for immediate support: 988 Suicide & Crisis Lifeline. You matter, and help is available.",
        avoidancePatterns: ['dismissing urgency', 'providing only platitudes']
      }],
      triggerConditions: [{
        userState: 'crisis' as any,
        journalPatterns: this.CRISIS_KEYWORDS,
        emotionalMarkers: ['suicidal', 'emergency', 'crisis'],
        timeContext: 'any'
      }],
      transformationPhase: {
        phase: 'dissolution',
        description: 'Creating immediate safety and stabilization',
        gifts: ['Safety', 'Hope', 'Connection to help'],
        challenges: ['Reaching out for help', 'Believing in worthiness of support'],
        duration: 'momentary'
      },
      symbology: {
        primarySymbol: '🛡️',
        secondarySymbols: ['🚨', '💙', '🤝'],
        colors: ['calming blue', 'warm red', 'safe green'],
        elementalAssociation: 'earth'
      }
    };
  }
  
  private static scoreArchetypeMatch(
    archetype: KheperaArchetype,
    journalEntry: string,
    userMood?: string,
    userProfile?: UserArchetypeProfile
  ): number {
    let score = 0;
    
    // Check trigger conditions
    for (const condition of archetype.triggerConditions) {
      if (condition.journalPatterns.some(pattern => 
        journalEntry.toLowerCase().includes(pattern.toLowerCase())
      )) {
        score += 0.4;
      }
      
      if (userMood && condition.emotionalMarkers.includes(userMood)) {
        score += 0.3;
      }
    }
    
    // User preferences
    if (userProfile?.preferredArchetypes.includes(archetype.id)) {
      score += 0.2;
    }
    
    if (userProfile?.avoidedArchetypes.includes(archetype.id)) {
      score -= 0.5;
    }
    
    // Transformation phase alignment
    if (userProfile?.personalizedGuidance.dominantTransformationPhase === archetype.transformationPhase.phase) {
      score += 0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  private static isArchetypeAvailable(archetypeId: string, userProfile?: UserArchetypeProfile): boolean {
    if (!userProfile) return true;
    
    const lastInteraction = userProfile.archetypeHistory
      .filter(interaction => interaction.archetypeId === archetypeId)
      .sort((a, b) => b.activatedAt.getTime() - a.activatedAt.getTime())[0];
    
    if (!lastInteraction) return true;
    
    const hoursSinceLastInteraction = (Date.now() - lastInteraction.activatedAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastInteraction >= this.ARCHETYPE_COOLDOWN;
  }
  
  private static explainSelection(archetype: KheperaArchetype, journalEntry: string): string {
    return `${archetype.name} emerged because your reflection called for ${archetype.primaryGift.toLowerCase()}.`;
  }
  
  private static identifySituation(journalEntry: string, userMood?: string): ResponsePattern['situationType'] {
    const lowerEntry = journalEntry.toLowerCase();
    
    if (this.detectCrisisLanguage(journalEntry)) return 'crisis';
    if (lowerEntry.includes('breakthrough') || lowerEntry.includes('realize') || lowerEntry.includes('understand')) return 'breakthrough';
    if (lowerEntry.includes('stuck') || lowerEntry.includes('can\'t') || lowerEntry.includes('won\'t')) return 'resistance';
    if (lowerEntry.includes('celebrate') || lowerEntry.includes('proud') || lowerEntry.includes('achievement')) return 'celebration';
    if (lowerEntry.includes('confused') || lowerEntry.includes('don\'t know') || lowerEntry.includes('unclear')) return 'confusion';
    
    return 'integration';
  }
  
  private static personalizeMessage(
    archetype: KheperaArchetype,
    pattern: ResponsePattern,
    journalEntry: string,
    userProfile?: UserArchetypeProfile
  ): string {
    // This would use more sophisticated NLP and personalization in practice
    const vocabulary = archetype.voiceProfile.vocabulary;
    const affirmation = vocabulary.affirmations[Math.floor(Math.random() * vocabulary.affirmations.length)];
    const transition = vocabulary.transitions[Math.floor(Math.random() * vocabulary.transitions.length)];
    
    return `${transition} ${pattern.exampleResponse} ${affirmation}`;
  }
  
  private static generateFollowUpPrompt(archetype: KheperaArchetype, journalEntry: string): string {
    const questions = archetype.voiceProfile.vocabulary.questionStems;
    return questions[Math.floor(Math.random() * questions.length)] || "What feels most alive in this moment?";
  }
  
  private static generateBreathingSpace(archetype: KheperaArchetype): string {
    return "Take three slow breaths. Let this settle into your awareness.";
  }
  
  private static suggestNextArchetype(archetype: KheperaArchetype, situationType: string): string {
    // Simple evolution logic
    if (archetype.id === 'gentle_witness' && situationType === 'breakthrough') {
      return 'wise_challenger';
    }
    if (archetype.id === 'wise_challenger' && situationType === 'integration') {
      return 'mystical_guide';
    }
    return archetype.id; // Stay with current archetype
  }
}

