// ALCHM AI Mirror Response System
// Sacred AI that mirrors back themes and emotions - never advises or diagnoses
// Designed for reflection and witnessing, not problem-solving

export interface MirrorAnalysis {
  themes: string[];
  emotions: string[];
  energyLevel: 'low' | 'medium' | 'high';
  emotionalTone: 'challenging' | 'neutral' | 'hopeful' | 'mixed';
  depth: 'surface' | 'exploring' | 'profound';
  culturalElements: string[];
  resilientElements: string[];
}

export interface MirrorResponse {
  emotionalReflection: string;
  themesSummary: string[];
  culturalWisdom?: string;
  growthAcknowledgment?: string;
  confidence: 'gentle' | 'medium' | 'strong';
  responseType: 'acknowledgment' | 'thematic_mirror' | 'emotional_witness' | 'growth_celebration';
}

export interface SacredPromptSuggestion {
  text: string;
  category: 'deepening' | 'integration' | 'celebration' | 'exploration';
  culturalContext: string;
  reasoning: string;
}

// ===== CORE MIRROR PRINCIPLES =====

const MIRROR_PRINCIPLES = {
  // Never diagnose, label, or pathologize
  nonDiagnostic: [
    'avoid words like: disorder, condition, symptom, pathology, illness',
    'mirror feelings without clinical labels',
    'reflect patterns without interpretation'
  ],
  
  // Mirror back, don't interpret
  reflectiveNotInterpretive: [
    'use "I notice" or "I sense" rather than "this means"',
    'reflect themes without explaining their significance',
    'honor the user\'s meaning-making process'
  ],
  
  // Witness, don't fix
  witnessNotFix: [
    'avoid should, must, need to, try, fix, solve',
    'acknowledge without suggesting solutions',
    'hold space for the user\'s own wisdom'
  ],
  
  // Sacred timing and pacing
  sacredTiming: [
    'responses arrive after contemplative delay',
    'match the emotional pace of the user',
    'honor silence and processing time'
  ]
};

// ===== EMOTIONAL MIRROR PATTERNS =====

const EMOTIONAL_MIRROR_PATTERNS = {
  // Surface-level acknowledgment patterns
  gentle: {
    generic: [
      "I hear something stirring in your words",
      "There's a quality present in your reflection that feels important",
      "Your sharing carries weight that deserves witnessing",
      "Something alive is moving through your expression"
    ],
    emotional: {
      sadness: [
        "I sense a heaviness that wants to be held",
        "There's a tender quality in your words that asks for gentleness",
        "Your sharing carries grief that deserves sacred space"
      ],
      joy: [
        "Light dances through your reflection",
        "There's celebration alive in your words",
        "Something bright wants to be witnessed in your sharing"
      ],
      anger: [
        "I feel fire and energy moving through your expression",
        "There's something in you that's saying 'this matters'",
        "Your words carry a passionate intensity"
      ],
      fear: [
        "I notice something protective and careful in your sharing",
        "There's a vulnerability present that's asking for safety",
        "Your words carry both courage and caution"
      ],
      confusion: [
        "I sense you're in a place of sacred not-knowing",
        "There's a seeking quality in your reflection",
        "Something is asking for clarity while you sit with uncertainty"
      ]
    }
  },
  
  // Medium-depth thematic reflection
  medium: {
    themes: {
      growth: [
        "I notice themes of expansion and becoming in your words",
        "There's evolution happening in your reflection",
        "Your sharing carries the energy of transformation"
      ],
      relationships: [
        "Connection and belonging weave through your reflection",
        "I sense the complexity of human relationship in your words",
        "There's both reaching toward others and honoring yourself"
      ],
      challenge: [
        "I witness both struggle and resilience in your sharing",
        "Your words hold the weight of difficulty alongside your strength",
        "There's something being asked of you that requires courage"
      ],
      spirituality: [
        "Sacred seeking moves through your reflection",
        "I sense questions about meaning and purpose in your words",
        "There's a reaching toward something larger than yourself"
      ],
      identity: [
        "Questions of 'who am I?' live in your reflection",
        "There's exploration of self happening in your sharing",
        "Your words carry the complexity of becoming yourself"
      ]
    }
  },
  
  // Deep witnessing patterns
  profound: {
    existential: [
      "Your reflection touches the deepest questions of human experience",
      "There's profound truth-telling happening in your words",
      "You're engaging with the mysteries that live at the heart of being human"
    ],
    transformation: [
      "I witness profound transformation happening in your sharing",
      "Something fundamental is shifting in your understanding",
      "Your words carry the weight of deep inner reorganization"
    ],
    wisdom: [
      "Ancient wisdom is emerging through your reflection",
      "Your sharing connects to truths that transcend individual experience",
      "There's knowing coming through you that serves something larger"
    ]
  }
};

// ===== THEME DETECTION SYSTEM =====

const THEME_PATTERNS = {
  // Emotional themes
  growth: {
    keywords: ['grow', 'growing', 'change', 'changing', 'evolve', 'learning', 'development', 'becoming', 'transformation', 'progress'],
    phrases: ['moving forward', 'getting better', 'working on', 'trying to improve', 'step by step']
  },
  
  relationships: {
    keywords: ['friend', 'family', 'partner', 'love', 'connection', 'relationship', 'together', 'alone', 'lonely', 'belonging'],
    phrases: ['my relationship', 'people in my life', 'feeling connected', 'feeling isolated']
  },
  
  challenge: {
    keywords: ['difficult', 'hard', 'struggle', 'tough', 'challenge', 'overwhelming', 'stress', 'anxiety', 'worry', 'fear'],
    phrases: ['going through', 'dealing with', 'hard time', 'difficult situation']
  },
  
  gratitude: {
    keywords: ['grateful', 'thankful', 'appreciate', 'blessed', 'grateful for', 'amazing', 'wonderful', 'beautiful'],
    phrases: ['so grateful', 'really appreciate', 'feeling blessed']
  },
  
  identity: {
    keywords: ['who am I', 'myself', 'identity', 'authentic', 'true self', 'purpose', 'values', 'beliefs'],
    phrases: ['finding myself', 'being true to', 'figuring out who', 'my authentic self']
  },
  
  healing: {
    keywords: ['heal', 'healing', 'recovery', 'better', 'wellness', 'health', 'therapy', 'support'],
    phrases: ['getting better', 'healing process', 'working through', 'processing']
  },
  
  creativity: {
    keywords: ['creative', 'art', 'music', 'writing', 'express', 'imagination', 'inspiration', 'beauty'],
    phrases: ['creative process', 'artistic expression', 'making art']
  },
  
  spirituality: {
    keywords: ['spiritual', 'soul', 'sacred', 'divine', 'prayer', 'meditation', 'faith', 'meaning', 'purpose'],
    phrases: ['spiritual journey', 'finding meaning', 'deeper purpose', 'sacred space']
  }
};

// ===== CULTURAL WISDOM INTEGRATION =====

const CULTURAL_WISDOM_PATTERNS = {
  universal: {
    transformation: "The scarab teaches us that all transformation requires traveling through darkness toward light",
    resilience: "Your reflection honors the universal human capacity for renewal",
    connection: "Individual healing creates ripples that touch the collective wellbeing"
  },
  
  indigenous: {
    transformation: "The elders remind us that healing happens in sacred relationship with all beings",
    resilience: "Your words carry the strength of seven generations before and after you",
    connection: "The circle holds your reflection as part of the eternal web of relations"
  },
  
  african_diaspora: {
    transformation: "Your healing serves the liberation of your ancestors and descendants",
    resilience: "Ubuntu flows through your words - your wellness strengthens the community",
    connection: "The village of your spirit celebrates your courage in truth-telling"
  },
  
  east_asian: {
    transformation: "The Tao moves through your willingness to flow with change rather than resist it",
    resilience: "Wu wei guides your reflection - not forcing allows natural wisdom to emerge",
    connection: "Your seeking honors the middle way between extremes"
  },
  
  latin_american: {
    transformation: "Su corazón knows the path of healing that serves both self and community",
    resilience: "The strength of your ancestors flows through your words",
    connection: "Your reflection honors the interconnection of individual and collective healing"
  }
};

// ===== AI MIRROR RESPONSE GENERATOR =====

export class SacredAiMirror {
  private culturalContext: string;
  private assistanceLevel: 'minimal' | 'reflective' | 'full';
  
  constructor(culturalContext: string = 'universal', assistanceLevel: 'minimal' | 'reflective' | 'full' = 'reflective') {
    this.culturalContext = culturalContext;
    this.assistanceLevel = assistanceLevel;
  }

  async generateMirrorResponse(
    content: string,
    sessionHistory: any[] = [],
    userPreferences: any = {}
  ): Promise<MirrorResponse> {
    
    // Analyze the reflection content
    const analysis = this.analyzeReflection(content);
    
    // Generate sacred response based on analysis
    const response = this.generateSacredResponse(analysis, sessionHistory);
    
    // Add cultural wisdom if appropriate
    if (this.shouldIncludeCulturalWisdom(analysis, sessionHistory)) {
      response.culturalWisdom = this.generateCulturalWisdom(analysis);
    }
    
    // Validate therapeutic appropriateness
    this.validateTherapeuticBoundaries(response);
    
    return response;
  }

  private analyzeReflection(content: string): MirrorAnalysis {
    const words = content.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    
    // Detect themes
    const themes = this.detectThemes(content);
    
    // Detect emotional content
    const emotions = this.detectEmotions(content);
    
    // Analyze energy level
    const energyLevel = this.analyzeEnergyLevel(content);
    
    // Determine emotional tone
    const emotionalTone = this.analyzeEmotionalTone(content, emotions);
    
    // Assess depth
    const depth = this.assessReflectionDepth(content, wordCount);
    
    // Identify cultural elements
    const culturalElements = this.identifyCulturalElements(content);
    
    // Find resilient elements
    const resilientElements = this.identifyResilientElements(content);
    
    return {
      themes,
      emotions,
      energyLevel,
      emotionalTone,
      depth,
      culturalElements,
      resilientElements
    };
  }

  private detectThemes(content: string): string[] {
    const lowerContent = content.toLowerCase();
    const detectedThemes: string[] = [];
    
    for (const [theme, patterns] of Object.entries(THEME_PATTERNS)) {
      const keywordMatches = patterns.keywords.some(keyword => lowerContent.includes(keyword));
      const phraseMatches = patterns.phrases.some(phrase => lowerContent.includes(phrase));
      
      if (keywordMatches || phraseMatches) {
        detectedThemes.push(theme);
      }
    }
    
    return detectedThemes;
  }

  private detectEmotions(content: string): string[] {
    const emotionPatterns = {
      sadness: ['sad', 'grief', 'loss', 'crying', 'tears', 'heavy', 'empty', 'hollow'],
      joy: ['happy', 'joy', 'excited', 'celebration', 'love', 'grateful', 'amazing', 'wonderful'],
      anger: ['angry', 'mad', 'frustrated', 'irritated', 'furious', 'rage', 'annoyed'],
      fear: ['scared', 'afraid', 'anxious', 'worry', 'nervous', 'panic', 'terrified'],
      confusion: ['confused', 'lost', 'unclear', 'don\'t know', 'uncertain', 'mixed up']
    };
    
    const lowerContent = content.toLowerCase();
    const detectedEmotions: string[] = [];
    
    for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        detectedEmotions.push(emotion);
      }
    }
    
    return detectedEmotions;
  }

  private analyzeEnergyLevel(content: string): 'low' | 'medium' | 'high' {
    const highEnergyWords = ['excited', 'amazing', 'incredible', 'overwhelming', 'intense', 'powerful'];
    const lowEnergyWords = ['tired', 'exhausted', 'drained', 'empty', 'numb', 'quiet'];
    
    const lowerContent = content.toLowerCase();
    
    const highCount = highEnergyWords.filter(word => lowerContent.includes(word)).length;
    const lowCount = lowEnergyWords.filter(word => lowerContent.includes(word)).length;
    
    if (highCount > lowCount) return 'high';
    if (lowCount > highCount) return 'low';
    return 'medium';
  }

  private analyzeEmotionalTone(content: string, emotions: string[]): 'challenging' | 'neutral' | 'hopeful' | 'mixed' {
    const challengingEmotions = ['sadness', 'anger', 'fear'];
    const hopefulEmotions = ['joy', 'gratitude'];
    
    const challengingCount = emotions.filter(e => challengingEmotions.includes(e)).length;
    const hopefulCount = emotions.filter(e => hopefulEmotions.includes(e)).length;
    
    if (challengingCount > 0 && hopefulCount > 0) return 'mixed';
    if (challengingCount > hopefulCount) return 'challenging';
    if (hopefulCount > challengingCount) return 'hopeful';
    return 'neutral';
  }

  private assessReflectionDepth(content: string, wordCount: number): 'surface' | 'exploring' | 'profound' {
    const deepThemes = ['meaning', 'purpose', 'existence', 'death', 'spirituality', 'soul', 'consciousness'];
    const exploratoryPhrases = ['I wonder', 'I\'m exploring', 'I\'m trying to understand', 'I\'m questioning'];
    
    const lowerContent = content.toLowerCase();
    
    const hasDeepThemes = deepThemes.some(theme => lowerContent.includes(theme));
    const hasExploratoryLanguage = exploratoryPhrases.some(phrase => lowerContent.includes(phrase));
    
    if (hasDeepThemes && wordCount > 200) return 'profound';
    if (hasExploratoryLanguage || wordCount > 100) return 'exploring';
    return 'surface';
  }

  private identifyCulturalElements(content: string): string[] {
    const culturalMarkers = {
      spiritual: ['prayer', 'meditation', 'sacred', 'divine', 'soul', 'spirit'],
      family: ['family', 'ancestors', 'tradition', 'heritage', 'roots'],
      community: ['community', 'belonging', 'connection', 'support', 'village'],
      nature: ['nature', 'earth', 'sky', 'water', 'trees', 'animals']
    };
    
    const lowerContent = content.toLowerCase();
    const foundElements: string[] = [];
    
    for (const [element, markers] of Object.entries(culturalMarkers)) {
      if (markers.some(marker => lowerContent.includes(marker))) {
        foundElements.push(element);
      }
    }
    
    return foundElements;
  }

  private identifyResilientElements(content: string): string[] {
    const resilienceMarkers = [
      'getting through', 'surviving', 'growing stronger', 'learning from',
      'finding meaning', 'keeping going', 'not giving up', 'hope',
      'strength', 'courage', 'perseverance', 'healing'
    ];
    
    const lowerContent = content.toLowerCase();
    return resilienceMarkers.filter(marker => lowerContent.includes(marker));
  }

  private generateSacredResponse(analysis: MirrorAnalysis, sessionHistory: any[]): MirrorResponse {
    const { depth, emotions, themes, emotionalTone } = analysis;
    
    // Select appropriate response pattern
    let emotionalReflection: string;
    let responseType: MirrorResponse['responseType'];
    
    if (analysis.resilientElements.length > 0) {
      emotionalReflection = this.generateGrowthAcknowledgment(analysis);
      responseType = 'growth_celebration';
    } else if (emotions.length > 0) {
      emotionalReflection = this.generateEmotionalWitness(analysis);
      responseType = 'emotional_witness';
    } else if (themes.length > 0) {
      emotionalReflection = this.generateThematicMirror(analysis);
      responseType = 'thematic_mirror';
    } else {
      emotionalReflection = this.generateGenericAcknowledgment(analysis);
      responseType = 'acknowledgment';
    }
    
    // Determine confidence level
    const confidence = this.calculateConfidence(analysis);
    
    return {
      emotionalReflection,
      themesSummary: themes,
      confidence,
      responseType
    };
  }

  private generateEmotionalWitness(analysis: MirrorAnalysis): string {
    const { emotions, depth } = analysis;
    const primaryEmotion = emotions[0];
    
    const patterns = EMOTIONAL_MIRROR_PATTERNS[depth] || EMOTIONAL_MIRROR_PATTERNS.gentle;
    
    if (depth === 'gentle' && patterns.emotional[primaryEmotion]) {
      return this.selectRandomPattern(patterns.emotional[primaryEmotion]);
    }
    
    return this.selectRandomPattern(patterns.generic || EMOTIONAL_MIRROR_PATTERNS.gentle.generic);
  }

  private generateThematicMirror(analysis: MirrorAnalysis): string {
    const { themes, depth } = analysis;
    const primaryTheme = themes[0];
    
    if (depth === 'medium' && EMOTIONAL_MIRROR_PATTERNS.medium.themes[primaryTheme]) {
      return this.selectRandomPattern(EMOTIONAL_MIRROR_PATTERNS.medium.themes[primaryTheme]);
    }
    
    return `I notice themes of ${themes.slice(0, 2).join(' and ')} weaving through your reflection`;
  }

  private generateGrowthAcknowledgment(analysis: MirrorAnalysis): string {
    const acknowledgments = [
      "I witness the courage and resilience moving through your words",
      "Your reflection honors both the challenge and your capacity to meet it",
      "There's strength and wisdom emerging in your sharing",
      "I sense your growth happening even in the midst of difficulty"
    ];
    
    return this.selectRandomPattern(acknowledgments);
  }

  private generateGenericAcknowledgment(analysis: MirrorAnalysis): string {
    return this.selectRandomPattern(EMOTIONAL_MIRROR_PATTERNS.gentle.generic);
  }

  private generateCulturalWisdom(analysis: MirrorAnalysis): string {
    const culturalPatterns = CULTURAL_WISDOM_PATTERNS[this.culturalContext] || CULTURAL_WISDOM_PATTERNS.universal;
    
    if (analysis.resilientElements.length > 0) {
      return culturalPatterns.resilience;
    }
    
    if (analysis.themes.includes('relationships') || analysis.culturalElements.includes('community')) {
      return culturalPatterns.connection;
    }
    
    return culturalPatterns.transformation;
  }

  private shouldIncludeCulturalWisdom(analysis: MirrorAnalysis, sessionHistory: any[]): boolean {
    // Include cultural wisdom for deeper reflections or when cultural elements are present
    return (
      analysis.depth !== 'surface' ||
      analysis.culturalElements.length > 0 ||
      this.culturalContext !== 'universal'
    ) && Math.random() > 0.4; // 60% chance to avoid overwhelming
  }

  private calculateConfidence(analysis: MirrorAnalysis): 'gentle' | 'medium' | 'strong' {
    let score = 0;
    
    if (analysis.themes.length > 0) score += 1;
    if (analysis.emotions.length > 0) score += 1;
    if (analysis.depth !== 'surface') score += 1;
    if (analysis.resilientElements.length > 0) score += 1;
    
    if (score >= 3) return 'strong';
    if (score >= 2) return 'medium';
    return 'gentle';
  }

  private validateTherapeuticBoundaries(response: MirrorResponse): void {
    const problematicPatterns = [
      /you should|you must|you need to/i,
      /this means|this shows|this indicates/i,
      /disorder|condition|pathology/i,
      /fix|solve|cure|treat/i
    ];
    
    problematicPatterns.forEach(pattern => {
      if (pattern.test(response.emotionalReflection)) {
        console.warn('Therapeutic boundary violation detected in AI response');
        // Replace with safer alternative
        response.emotionalReflection = "Your reflection is witnessed with sacred attention.";
      }
    });
  }

  private selectRandomPattern(patterns: string[]): string {
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
}

// ===== GROWTH TRACKING SYSTEM =====

export class GrowthTerrainAnalyzer {
  static analyzeEmotionalTerrain(content: string, themes: string[]): {
    resilience: number;
    clarity: number;
    selfCompassion: number;
    connection: number;
  } {
    const lowerContent = content.toLowerCase();
    
    // Resilience indicators
    const resilienceWords = ['strong', 'growing', 'learning', 'surviving', 'overcoming', 'healing'];
    const resilience = this.calculateMetric(lowerContent, resilienceWords, 0.6, 1.0);
    
    // Clarity indicators
    const clarityWords = ['understand', 'clear', 'realize', 'see', 'know', 'insight'];
    const clarity = this.calculateMetric(lowerContent, clarityWords, 0.4, 1.0);
    
    // Self-compassion indicators
    const compassionWords = ['gentle', 'kind to myself', 'forgive', 'patient', 'understanding'];
    const selfCompassion = this.calculateMetric(lowerContent, compassionWords, 0.3, 1.0);
    
    // Connection indicators
    const connectionWords = ['connected', 'belong', 'support', 'love', 'together', 'community'];
    const connection = this.calculateMetric(lowerContent, connectionWords, 0.3, 1.0);
    
    return {
      resilience,
      clarity,
      selfCompassion,
      connection
    };
  }

  private static calculateMetric(content: string, keywords: string[], baseValue: number, maxValue: number): number {
    const matches = keywords.filter(keyword => content.includes(keyword)).length;
    const normalized = Math.min(matches / keywords.length, 1);
    return baseValue + (normalized * (maxValue - baseValue));
  }
}

// ===== EXPORT MAIN FUNCTIONS =====

export {
  SacredAiMirror,
  GrowthTerrainAnalyzer,
  EMOTIONAL_MIRROR_PATTERNS,
  CULTURAL_WISDOM_PATTERNS,
  MIRROR_PRINCIPLES
};