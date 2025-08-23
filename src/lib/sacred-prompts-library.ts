// ALCHM Sacred Prompts Library
// Culturally responsive reflection prompts that invite exploration, not direction
// Each prompt honors agency and wisdom rather than pushing toward predetermined outcomes

export interface SacredPrompt {
  id: string;
  text: string;
  category: 'self_awareness' | 'growth_edge' | 'gratitude' | 'challenge_processing' | 'future_self' | 'wisdom_seeking' | 'cultural_connection' | 'creative_expression' | 'relationship_healing' | 'spiritual_seeking';
  culturalContext: 'universal' | 'indigenous' | 'african_diaspora' | 'east_asian' | 'latin_american' | 'middle_eastern' | 'european' | 'bridge';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  emotionalContainer: 'gentle' | 'exploratory' | 'challenging' | 'celebratory' | 'integrative';
  backgroundWisdom?: string;
  invitationStyle: 'open_question' | 'gentle_invitation' | 'wisdom_seeking' | 'creative_expression' | 'embodied_awareness';
  supportiveElements?: {
    breathingCue?: string;
    bodyAwareness?: string;
    environmentalConnection?: string;
  };
  followUpPrompts?: string[];
}

export interface PromptCollection {
  [key: string]: SacredPrompt[];
}

// ===== UNIVERSAL SACRED PROMPTS =====

export const UNIVERSAL_PROMPTS: SacredPrompt[] = [
  // ===== FUTURE SELF WISDOM =====
  {
    id: 'future-self-gratitude',
    text: 'What would your future self thank you for doing today?',
    category: 'future_self',
    culturalContext: 'universal',
    timeOfDay: 'morning',
    emotionalContainer: 'exploratory',
    invitationStyle: 'wisdom_seeking',
    backgroundWisdom: 'This invitation connects you to your deepest values and long-term wisdom, helping you act from your highest vision of yourself.',
    supportiveElements: {
      breathingCue: 'Take three breaths and imagine yourself one year from now, looking back with gratitude',
      bodyAwareness: 'Notice what feels aligned in your body as you consider this question'
    },
    followUpPrompts: [
      'What small step toward that future self feels most alive right now?',
      'How would it feel to move through today as that future version of yourself?'
    ]
  },
  
  {
    id: 'future-self-healing',
    text: 'What healing is your future self inviting you toward?',
    category: 'future_self',
    culturalContext: 'universal',
    timeOfDay: 'evening',
    emotionalContainer: 'integrative',
    invitationStyle: 'gentle_invitation',
    backgroundWisdom: 'Your future self holds wisdom about the healing journey you\'re on, even when the path isn\'t clear.'
  },

  // ===== TENSION AND GROWTH =====
  {
    id: 'tension-growth-emergence',
    text: 'Where are you feeling tension in your life, and what growth might be trying to emerge?',
    category: 'growth_edge',
    culturalContext: 'universal',
    timeOfDay: 'any',
    emotionalContainer: 'challenging',
    invitationStyle: 'open_question',
    backgroundWisdom: 'Tension often signals that we\'re at a growing edge. Like a plant pushing through soil, our discomfort can indicate expansion trying to happen.',
    supportiveElements: {
      bodyAwareness: 'Notice where you feel tension in your body as you consider this question',
      breathingCue: 'Breathe into the places of tension, offering them space and curiosity'
    }
  },
  
  {
    id: 'resistance-teacher',
    text: 'What are you resisting right now, and what might that resistance be trying to teach you?',
    category: 'growth_edge',
    culturalContext: 'universal',
    timeOfDay: 'any',
    emotionalContainer: 'exploratory',
    invitationStyle: 'wisdom_seeking',
    backgroundWisdom: 'Resistance often carries important information about our boundaries, values, or readiness for change.'
  },

  // ===== PRESENT MOMENT GRATITUDE =====
  {
    id: 'present-moment-appreciation',
    text: 'What in this very moment are you grateful for?',
    category: 'gratitude',
    culturalContext: 'universal',
    timeOfDay: 'any',
    emotionalContainer: 'gentle',
    invitationStyle: 'gentle_invitation',
    supportiveElements: {
      breathingCue: 'Take a slow breath and let your awareness settle into this exact moment',
      environmentalConnection: 'Notice what your senses are receiving right now that you can appreciate'
    }
  },
  
  {
    id: 'body-gratitude',
    text: 'What is your body asking you to appreciate about it today?',
    category: 'gratitude',
    culturalContext: 'universal',
    timeOfDay: 'morning',
    emotionalContainer: 'gentle',
    invitationStyle: 'embodied_awareness',
    backgroundWisdom: 'Your body carries profound wisdom and deserves recognition for all the ways it supports your life.'
  },

  // ===== WISDOM SEEKING =====
  {
    id: 'heart-question',
    text: 'What question is your heart asking that you haven\'t put into words yet?',
    category: 'wisdom_seeking',
    culturalContext: 'universal',
    timeOfDay: 'evening',
    emotionalContainer: 'exploratory',
    invitationStyle: 'wisdom_seeking',
    backgroundWisdom: 'Sometimes our deepest questions live below conscious awareness, waiting to be discovered and honored.'
  },
  
  {
    id: 'inner-wisdom-voice',
    text: 'If your wisest self could speak to you right now, what would they say?',
    category: 'wisdom_seeking',
    culturalContext: 'universal',
    timeOfDay: 'any',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking'
  },

  // ===== CREATIVE EXPRESSION =====
  {
    id: 'unexpressed-creativity',
    text: 'What wants to be created or expressed through you that hasn\'t found its way into the world yet?',
    category: 'creative_expression',
    culturalContext: 'universal',
    timeOfDay: 'afternoon',
    emotionalContainer: 'exploratory',
    invitationStyle: 'creative_expression',
    backgroundWisdom: 'Creativity is life force seeking expression. What wants to be born through your unique gifts?'
  },

  // ===== CHALLENGE PROCESSING =====
  {
    id: 'challenge-compassion',
    text: 'What challenge is asking for your compassion right now?',
    category: 'challenge_processing',
    culturalContext: 'universal',
    timeOfDay: 'any',
    emotionalContainer: 'challenging',
    invitationStyle: 'gentle_invitation',
    backgroundWisdom: 'When we meet our challenges with compassion instead of judgment, we create space for wisdom and healing to emerge.'
  },
  
  {
    id: 'difficulty-teaching',
    text: 'What is this difficult experience trying to teach you about your own resilience?',
    category: 'challenge_processing',
    culturalContext: 'universal',
    timeOfDay: 'evening',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking'
  }
];

// ===== CULTURAL CONTEXT PROMPTS =====

export const INDIGENOUS_PROMPTS: SacredPrompt[] = [
  {
    id: 'seven-generations-decision',
    text: 'How does this decision honor both your ancestors and the children coming seven generations ahead?',
    category: 'wisdom_seeking',
    culturalContext: 'indigenous',
    timeOfDay: 'any',
    emotionalContainer: 'exploratory',
    invitationStyle: 'wisdom_seeking',
    backgroundWisdom: 'The Seven Generations principle invites us to consider the long-term impact of our choices on the web of relationships that extends through time.',
    supportiveElements: {
      environmentalConnection: 'Feel your connection to the earth beneath you and the sky above as you reflect'
    }
  },
  
  {
    id: 'all-relations-healing',
    text: 'How is your personal healing connected to the healing of all your relations?',
    category: 'relationship_healing',
    culturalContext: 'indigenous',
    timeOfDay: 'any',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking',
    backgroundWisdom: 'In Indigenous wisdom, individual healing is understood as inseparable from the healing of our relationships with all beings.'
  },
  
  {
    id: 'seasonal-teaching',
    text: 'What is this season of your life teaching you about cycles, change, and renewal?',
    category: 'wisdom_seeking',
    culturalContext: 'indigenous',
    timeOfDay: 'any',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking'
  },
  
  {
    id: 'ancestral-guidance',
    text: 'What wisdom from your ancestors is available to guide you through this situation?',
    category: 'cultural_connection',
    culturalContext: 'indigenous',
    timeOfDay: 'evening',
    emotionalContainer: 'exploratory',
    invitationStyle: 'wisdom_seeking'
  }
];

export const AFRICAN_DIASPORA_PROMPTS: SacredPrompt[] = [
  {
    id: 'ubuntu-healing',
    text: 'How does your individual healing serve the liberation and wellbeing of your community?',
    category: 'relationship_healing',
    culturalContext: 'african_diaspora',
    timeOfDay: 'any',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking',
    backgroundWisdom: 'Ubuntu teaches us "I am because we are" - your healing creates ripples of liberation in your community and lineage.'
  },
  
  {
    id: 'ancestral-strength',
    text: 'What strength from your ancestors is flowing through you right now, even in difficulty?',
    category: 'cultural_connection',
    culturalContext: 'african_diaspora',
    timeOfDay: 'any',
    emotionalContainer: 'celebratory',
    invitationStyle: 'wisdom_seeking',
    backgroundWisdom: 'You carry the unbroken line of survivors. Their resilience lives in your DNA and spirit.'
  },
  
  {
    id: 'collective-joy',
    text: 'What joy wants to be shared with your community as a form of resistance and celebration?',
    category: 'creative_expression',
    culturalContext: 'african_diaspora',
    timeOfDay: 'afternoon',
    emotionalContainer: 'celebratory',
    invitationStyle: 'creative_expression'
  },
  
  {
    id: 'freedom-song',
    text: 'What verse of your personal freedom song are you writing with your life right now?',
    category: 'creative_expression',
    culturalContext: 'african_diaspora',
    timeOfDay: 'any',
    emotionalContainer: 'exploratory',
    invitationStyle: 'creative_expression'
  }
];

export const EAST_ASIAN_PROMPTS: SacredPrompt[] = [
  {
    id: 'wu-wei-challenge',
    text: 'How might you practice wu wei (effortless action) in approaching this challenge?',
    category: 'challenge_processing',
    culturalContext: 'east_asian',
    timeOfDay: 'any',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking',
    backgroundWisdom: 'Wu wei suggests that sometimes the most powerful action comes from not forcing, but flowing with natural wisdom.'
  },
  
  {
    id: 'middle-way-balance',
    text: 'Where in your life are you being called to find the middle way between extremes?',
    category: 'wisdom_seeking',
    culturalContext: 'east_asian',
    timeOfDay: 'evening',
    emotionalContainer: 'exploratory',
    invitationStyle: 'wisdom_seeking'
  },
  
  {
    id: 'tao-flow',
    text: 'How is the Tao (the natural way) expressing itself through your current life circumstances?',
    category: 'spiritual_seeking',
    culturalContext: 'east_asian',
    timeOfDay: 'any',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking'
  },
  
  {
    id: 'harmony-seeking',
    text: 'What harmony is trying to emerge from the apparent discord in your life?',
    category: 'wisdom_seeking',
    culturalContext: 'east_asian',
    timeOfDay: 'evening',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking'
  }
];

export const LATIN_AMERICAN_PROMPTS: SacredPrompt[] = [
  {
    id: 'corazon-wisdom',
    text: 'What is your corazón (heart) knowing that your mind hasn\'t fully acknowledged yet?',
    category: 'wisdom_seeking',
    culturalContext: 'latin_american',
    timeOfDay: 'any',
    emotionalContainer: 'exploratory',
    invitationStyle: 'embodied_awareness',
    backgroundWisdom: 'In Latino culture, the heart (corazón) is understood as a source of profound wisdom and knowing.',
    supportiveElements: {
      bodyAwareness: 'Place your hand on your heart and feel its rhythm as you reflect'
    }
  },
  
  {
    id: 'familia-healing',
    text: 'How is your healing connected to the healing that your familia (biological and chosen) needs?',
    category: 'relationship_healing',
    culturalContext: 'latin_american',
    timeOfDay: 'any',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking'
  },
  
  {
    id: 'querencia-safety',
    text: 'Where is your querencia (place of safety and strength) and how can you carry it with you?',
    category: 'self_awareness',
    culturalContext: 'latin_american',
    timeOfDay: 'evening',
    emotionalContainer: 'gentle',
    invitationStyle: 'embodied_awareness',
    backgroundWisdom: 'Querencia refers to a place where one feels safe and from which one draws strength.'
  },
  
  {
    id: 'esperanza-vision',
    text: 'What esperanza (hope) is growing in you, even in times of difficulty?',
    category: 'future_self',
    culturalContext: 'latin_american',
    timeOfDay: 'morning',
    emotionalContainer: 'celebratory',
    invitationStyle: 'wisdom_seeking'
  }
];

export const MIDDLE_EASTERN_PROMPTS: SacredPrompt[] = [
  {
    id: 'hospitality-self',
    text: 'How can you offer the same hospitality to your own heart that you would offer to a beloved guest?',
    category: 'self_awareness',
    culturalContext: 'middle_eastern',
    timeOfDay: 'any',
    emotionalContainer: 'gentle',
    invitationStyle: 'gentle_invitation',
    backgroundWisdom: 'Middle Eastern traditions honor radical hospitality as a sacred practice.'
  },
  
  {
    id: 'desert-oasis',
    text: 'What oasis of peace can you create within the desert of your current challenges?',
    category: 'challenge_processing',
    culturalContext: 'middle_eastern',
    timeOfDay: 'evening',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking'
  },
  
  {
    id: 'sacred-hospitality',
    text: 'What part of yourself is asking for sacred hospitality and welcome right now?',
    category: 'self_awareness',
    culturalContext: 'middle_eastern',
    timeOfDay: 'any',
    emotionalContainer: 'gentle',
    invitationStyle: 'gentle_invitation'
  }
];

export const BRIDGE_PROMPTS: SacredPrompt[] = [
  {
    id: 'cultural-wisdom-bridge',
    text: 'What wisdom from your different cultural backgrounds is asking to be woven together in your life?',
    category: 'cultural_connection',
    culturalContext: 'bridge',
    timeOfDay: 'any',
    emotionalContainer: 'integrative',
    invitationStyle: 'wisdom_seeking',
    backgroundWisdom: 'Many people carry wisdom from multiple cultural traditions. How do these different streams of knowing create something unique in you?'
  },
  
  {
    id: 'belonging-multiplicity',
    text: 'How do you create belonging for all the different parts of your cultural identity?',
    category: 'self_awareness',
    culturalContext: 'bridge',
    timeOfDay: 'any',
    emotionalContainer: 'exploratory',
    invitationStyle: 'wisdom_seeking'
  },
  
  {
    id: 'cultural-gifts',
    text: 'What unique gifts emerge from your experience of living between or within multiple cultures?',
    category: 'creative_expression',
    culturalContext: 'bridge',
    timeOfDay: 'afternoon',
    emotionalContainer: 'celebratory',
    invitationStyle: 'creative_expression'
  }
];

// ===== TIME-BASED PROMPT COLLECTIONS =====

export const MORNING_PROMPTS: SacredPrompt[] = [
  {
    id: 'dawn-intention',
    text: 'What intention wants to guide your steps through this day?',
    category: 'future_self',
    culturalContext: 'universal',
    timeOfDay: 'morning',
    emotionalContainer: 'gentle',
    invitationStyle: 'gentle_invitation',
    supportiveElements: {
      environmentalConnection: 'If possible, step outside and feel the morning air as you reflect'
    }
  },
  
  {
    id: 'morning-gratitude',
    text: 'What are you grateful for as this new day begins?',
    category: 'gratitude',
    culturalContext: 'universal',
    timeOfDay: 'morning',
    emotionalContainer: 'celebratory',
    invitationStyle: 'gentle_invitation'
  },
  
  {
    id: 'energy-honoring',
    text: 'How is your energy this morning, and how can you honor it throughout the day?',
    category: 'self_awareness',
    culturalContext: 'universal',
    timeOfDay: 'morning',
    emotionalContainer: 'gentle',
    invitationStyle: 'embodied_awareness'
  }
];

export const EVENING_PROMPTS: SacredPrompt[] = [
  {
    id: 'day-witnessing',
    text: 'What from today\'s journey wants to be witnessed and honored?',
    category: 'wisdom_seeking',
    culturalContext: 'universal',
    timeOfDay: 'evening',
    emotionalContainer: 'integrative',
    invitationStyle: 'gentle_invitation'
  },
  
  {
    id: 'evening-release',
    text: 'What are you ready to release as this day comes to a close?',
    category: 'challenge_processing',
    culturalContext: 'universal',
    timeOfDay: 'evening',
    emotionalContainer: 'integrative',
    invitationStyle: 'gentle_invitation'
  },
  
  {
    id: 'rest-preparation',
    text: 'What would help your mind and body prepare for restorative rest?',
    category: 'self_awareness',
    culturalContext: 'universal',
    timeOfDay: 'night',
    emotionalContainer: 'gentle',
    invitationStyle: 'embodied_awareness'
  }
];

// ===== PROMPT COLLECTIONS BY CATEGORY =====

export const ALL_SACRED_PROMPTS: PromptCollection = {
  universal: UNIVERSAL_PROMPTS,
  indigenous: INDIGENOUS_PROMPTS,
  african_diaspora: AFRICAN_DIASPORA_PROMPTS,
  east_asian: EAST_ASIAN_PROMPTS,
  latin_american: LATIN_AMERICAN_PROMPTS,
  middle_eastern: MIDDLE_EASTERN_PROMPTS,
  bridge: BRIDGE_PROMPTS,
  morning: MORNING_PROMPTS,
  evening: EVENING_PROMPTS
};

// ===== PROMPT SELECTION SYSTEM =====

export class SacredPromptSelector {
  private culturalContext: string;
  private userPreferences: any;
  
  constructor(culturalContext: string = 'universal', userPreferences: any = {}) {
    this.culturalContext = culturalContext;
    this.userPreferences = userPreferences;
  }

  selectContextualPrompt(
    timeOfDay?: string,
    category?: string,
    emotionalContainer?: string,
    recentHistory: SacredPrompt[] = []
  ): SacredPrompt {
    
    // Get appropriate prompt pool
    let availablePrompts = this.getAvailablePrompts();
    
    // Filter by criteria
    if (timeOfDay) {
      availablePrompts = availablePrompts.filter(p => 
        p.timeOfDay === timeOfDay || p.timeOfDay === 'any'
      );
    }
    
    if (category) {
      availablePrompts = availablePrompts.filter(p => p.category === category);
    }
    
    if (emotionalContainer) {
      availablePrompts = availablePrompts.filter(p => p.emotionalContainer === emotionalContainer);
    }
    
    // Remove recently used prompts
    const recentIds = recentHistory.map(p => p.id);
    availablePrompts = availablePrompts.filter(p => !recentIds.includes(p.id));
    
    // Select appropriate prompt
    return this.selectOptimalPrompt(availablePrompts);
  }

  private getAvailablePrompts(): SacredPrompt[] {
    let prompts: SacredPrompt[] = [];
    
    // Always include universal prompts
    prompts = prompts.concat(ALL_SACRED_PROMPTS.universal);
    
    // Add cultural context prompts
    if (this.culturalContext !== 'universal' && ALL_SACRED_PROMPTS[this.culturalContext]) {
      prompts = prompts.concat(ALL_SACRED_PROMPTS[this.culturalContext]);
    }
    
    // Add bridge prompts for multi-cultural users
    if (this.userPreferences.multiCultural) {
      prompts = prompts.concat(ALL_SACRED_PROMPTS.bridge);
    }
    
    return prompts;
  }

  private selectOptimalPrompt(prompts: SacredPrompt[]): SacredPrompt {
    if (prompts.length === 0) {
      // Fallback to universal prompt
      return UNIVERSAL_PROMPTS[0];
    }
    
    // Weight selection based on user preferences and context
    const weighted = this.applySelectionWeighting(prompts);
    
    return this.selectFromWeighted(weighted);
  }

  private applySelectionWeighting(prompts: SacredPrompt[]): { prompt: SacredPrompt; weight: number }[] {
    return prompts.map(prompt => {
      let weight = 1.0;
      
      // Boost cultural context matches
      if (prompt.culturalContext === this.culturalContext) {
        weight += 0.3;
      }
      
      // Boost preferred categories
      if (this.userPreferences.preferredCategories?.includes(prompt.category)) {
        weight += 0.2;
      }
      
      // Boost prompts with supportive elements if user prefers embodied prompts
      if (this.userPreferences.embodiedPrompts && prompt.supportiveElements) {
        weight += 0.1;
      }
      
      return { prompt, weight };
    });
  }

  private selectFromWeighted(weighted: { prompt: SacredPrompt; weight: number }[]): SacredPrompt {
    const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (const item of weighted) {
      currentWeight += item.weight;
      if (random <= currentWeight) {
        return item.prompt;
      }
    }
    
    // Fallback
    return weighted[0].prompt;
  }

  getPromptsForSession(
    sessionLength: number,
    currentTimeOfDay: string,
    userState: 'beginning' | 'flowing' | 'deepening' | 'integrating'
  ): SacredPrompt[] {
    const prompts: SacredPrompt[] = [];
    
    // Opening prompt
    if (userState === 'beginning') {
      const opener = this.selectContextualPrompt(currentTimeOfDay, undefined, 'gentle');
      prompts.push(opener);
    }
    
    // Deepening prompts for longer sessions
    if (sessionLength > 15 && userState === 'deepening') {
      const deepening = this.selectContextualPrompt(undefined, undefined, 'exploratory', prompts);
      prompts.push(deepening);
    }
    
    // Integration prompt for closing
    if (userState === 'integrating') {
      const integration = this.selectContextualPrompt(undefined, 'wisdom_seeking', 'integrative', prompts);
      prompts.push(integration);
    }
    
    return prompts;
  }
}

// ===== PROMPT VALIDATION =====

export function validatePromptTherapeuticBoundaries(prompt: SacredPrompt): boolean {
  const problematicPatterns = [
    /you should|you must|you need to/i,
    /fix|solve|cure/i,
    /disorder|condition|pathology/i,
    /diagnose|treatment|therapy/i
  ];
  
  return !problematicPatterns.some(pattern => 
    pattern.test(prompt.text) || 
    pattern.test(prompt.backgroundWisdom || '')
  );
}

// ===== EXPORT MAIN FUNCTIONS =====

export {
  ALL_SACRED_PROMPTS,
  SacredPromptSelector,
  validatePromptTherapeuticBoundaries
};