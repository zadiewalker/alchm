/**
 * ALCHM Cultural Responsiveness Engine
 * Adapts AI responses to diverse healing traditions and cultural contexts
 */

export interface CulturalHealingTradition {
  id: string;
  name: string;
  culture: string[];
  principles: string[];
  practices: string[];
  languagePatterns: string[];
  emotionalFrameworks: string[];
  crisisApproaches: string[];
  communityRole: 'individual' | 'family' | 'community' | 'universal';
}

export interface CulturalAdaptation {
  tradition: CulturalHealingTradition;
  confidence: number;
  adaptedResponse: string;
  culturalWisdom: string;
  respectfulLanguage: string[];
  communityResources: string[];
}

export interface CulturalResponseRequest {
  originalResponse: string;
  userCulture?: string[];
  detectedLanguage?: string;
  emotionalState?: string;
  isCrisis?: boolean;
  communityContext?: string;
}

const CULTURAL_HEALING_TRADITIONS: CulturalHealingTradition[] = [
  {
    id: 'ubuntu',
    name: 'Ubuntu Philosophy',
    culture: ['african', 'south-african', 'bantu'],
    principles: [
      'I am because we are',
      'Collective healing',
      'Community interconnectedness',
      'Shared humanity'
    ],
    practices: [
      'Community circles',
      'Storytelling healing',
      'Ancestral guidance',
      'Collective wisdom'
    ],
    languagePatterns: [
      'Ubuntu',
      'community healing',
      'shared strength',
      'together we heal',
      'ancestral wisdom'
    ],
    emotionalFrameworks: [
      'Emotions as community experience',
      'Healing through connection',
      'Collective resilience'
    ],
    crisisApproaches: [
      'Immediate community mobilization',
      'Ancestral strength calling',
      'Collective holding'
    ],
    communityRole: 'community'
  },
  
  {
    id: 'curanderismo',
    name: 'Curanderismo',
    culture: ['latino', 'hispanic', 'mexican', 'chicano'],
    principles: [
      'Holistic healing',
      'Spiritual and physical integration',
      'Family and community involvement',
      'Natural remedies'
    ],
    practices: [
      'Sobadoras (healing touch)',
      'Herbal remedies',
      'Prayer circles',
      'Limpias (spiritual cleansing)'
    ],
    languagePatterns: [
      'curandera',
      'sobadora',
      'limpia',
      'healing touch',
      'spiritual cleansing',
      'familia healing'
    ],
    emotionalFrameworks: [
      'Emotions as spiritual imbalance',
      'Family healing extends to individual',
      'Faith-based emotional support'
    ],
    crisisApproaches: [
      'Family mobilization',
      'Spiritual intervention',
      'Community prayer support'
    ],
    communityRole: 'family'
  },

  {
    id: 'indigenous-medicine-wheel',
    name: 'Indigenous Medicine Wheel',
    culture: ['indigenous', 'native-american', 'first-nations', 'aboriginal'],
    principles: [
      'Four directions wisdom',
      'Balance in all aspects',
      'Connection to Mother Earth',
      'Ancestral guidance'
    ],
    practices: [
      'Smudging ceremonies',
      'Talking circles',
      'Nature connection',
      'Elder wisdom'
    ],
    languagePatterns: [
      'medicine wheel',
      'four directions',
      'Mother Earth',
      'ancestor spirits',
      'sacred balance',
      'ceremony'
    ],
    emotionalFrameworks: [
      'Emotions as spiritual messages',
      'Healing through nature connection',
      'Balance of mind, body, spirit, emotions'
    ],
    crisisApproaches: [
      'Ceremony and ritual',
      'Elder consultation',
      'Nature-based healing'
    ],
    communityRole: 'community'
  },

  {
    id: 'ayurveda',
    name: 'Ayurvedic Healing',
    culture: ['indian', 'hindu', 'south-asian'],
    principles: [
      'Mind-body-spirit unity',
      'Constitutional balance',
      'Natural healing',
      'Dharmic living'
    ],
    practices: [
      'Meditation and yoga',
      'Herbal medicine',
      'Pranayama (breathwork)',
      'Lifestyle adjustments'
    ],
    languagePatterns: [
      'dosha',
      'prana',
      'dharma',
      'karma',
      'meditation',
      'yoga',
      'ayurveda'
    ],
    emotionalFrameworks: [
      'Emotions as energy imbalances',
      'Healing through self-awareness',
      'Spiritual growth through challenges'
    ],
    crisisApproaches: [
      'Breathing practices',
      'Meditation guidance',
      'Spiritual counseling'
    ],
    communityRole: 'individual'
  },

  {
    id: 'traditional-chinese-medicine',
    name: 'Traditional Chinese Medicine',
    culture: ['chinese', 'east-asian', 'taiwanese'],
    principles: [
      'Qi energy balance',
      'Yin-yang harmony',
      'Five element theory',
      'Holistic wellness'
    ],
    practices: [
      'Acupuncture',
      'Herbal medicine',
      'Qigong',
      'Tai chi'
    ],
    languagePatterns: [
      'qi',
      'yin yang',
      'balance',
      'harmony',
      'five elements',
      'energy flow'
    ],
    emotionalFrameworks: [
      'Emotions as qi disruptions',
      'Healing through energy balance',
      'Harmony as emotional wellness'
    ],
    crisisApproaches: [
      'Immediate energy balancing',
      'Breathing and movement',
      'Herbal support'
    ],
    communityRole: 'individual'
  },

  {
    id: 'islamic-healing',
    name: 'Islamic Healing Traditions',
    culture: ['muslim', 'islamic', 'middle-eastern', 'arabic'],
    principles: [
      'Trust in Allah (Tawakkul)',
      'Prayer as healing',
      'Community support (Ummah)',
      'Patience (Sabr) in trials'
    ],
    practices: [
      'Dhikr (remembrance)',
      'Dua (supplication)',
      'Quran recitation',
      'Community prayer'
    ],
    languagePatterns: [
      'insha\'Allah',
      'alhamdulillah',
      'sabr',
      'tawakkul',
      'dua',
      'dhikr',
      'ummah'
    ],
    emotionalFrameworks: [
      'Trials as spiritual tests',
      'Healing through faith',
      'Community as support system'
    ],
    crisisApproaches: [
      'Immediate prayer support',
      'Community mobilization',
      'Spiritual counseling'
    ],
    communityRole: 'community'
  }
];

export class CulturalResponsivenessEngine {
  private healingTraditions = CULTURAL_HEALING_TRADITIONS;
  private culturalPatterns: Map<string, string[]> = new Map();

  constructor() {
    this.initializeCulturalPatterns();
    console.log('🌍 Cultural Responsiveness Engine initialized with', this.healingTraditions.length, 'healing traditions');
  }

  private initializeCulturalPatterns(): void {
    this.healingTraditions.forEach(tradition => {
      tradition.culture.forEach(culture => {
        if (!this.culturalPatterns.has(culture)) {
          this.culturalPatterns.set(culture, []);
        }
        this.culturalPatterns.get(culture)!.push(tradition.id);
      });
    });
  }

  /**
   * Adapt response to cultural context
   */
  public adaptToCulture(request: CulturalResponseRequest): CulturalAdaptation | null {
    const detectedTraditions = this.detectCulturalTraditions(
      request.originalResponse,
      request.userCulture,
      request.detectedLanguage
    );

    if (detectedTraditions.length === 0) {
      return null; // No cultural adaptation needed
    }

    // Select the most relevant tradition
    const selectedTradition = detectedTraditions[0];
    const confidence = this.calculateAdaptationConfidence(selectedTradition, request);

    if (confidence < 0.3) {
      return null; // Confidence too low for cultural adaptation
    }

    const adaptedResponse = this.generateCulturallyAdaptedResponse(
      selectedTradition.tradition,
      request
    );

    return {
      tradition: selectedTradition.tradition,
      confidence,
      adaptedResponse: adaptedResponse.response,
      culturalWisdom: adaptedResponse.wisdom,
      respectfulLanguage: adaptedResponse.respectfulLanguage,
      communityResources: adaptedResponse.communityResources
    };
  }

  private detectCulturalTraditions(
    text: string,
    userCulture?: string[],
    detectedLanguage?: string
  ): { tradition: CulturalHealingTradition; relevance: number }[] {
    const detectedTraditions: { tradition: CulturalHealingTradition; relevance: number }[] = [];

    this.healingTraditions.forEach(tradition => {
      let relevance = 0;

      // Check user-declared culture
      if (userCulture) {
        const culturalMatch = userCulture.some(culture => 
          tradition.culture.some(tradCulture => 
            culture.toLowerCase().includes(tradCulture) || 
            tradCulture.includes(culture.toLowerCase())
          )
        );
        if (culturalMatch) relevance += 0.4;
      }

      // Check language patterns in text
      const lowerText = text.toLowerCase();
      tradition.languagePatterns.forEach(pattern => {
        if (lowerText.includes(pattern.toLowerCase())) {
          relevance += 0.2;
        }
      });

      // Check cultural practices mentioned
      tradition.practices.forEach(practice => {
        if (lowerText.includes(practice.toLowerCase())) {
          relevance += 0.15;
        }
      });

      // Language-based inference
      if (detectedLanguage) {
        const languageCultureMap: Record<string, string[]> = {
          'es': ['latino', 'hispanic'],
          'zh': ['chinese', 'east-asian'],
          'ar': ['arabic', 'middle-eastern'],
          'hi': ['indian', 'south-asian']
        };
        
        const inferredCultures = languageCultureMap[detectedLanguage] || [];
        const languageMatch = inferredCultures.some(culture =>
          tradition.culture.includes(culture)
        );
        if (languageMatch) relevance += 0.2;
      }

      if (relevance > 0) {
        detectedTraditions.push({ tradition, relevance });
      }
    });

    return detectedTraditions.sort((a, b) => b.relevance - a.relevance);
  }

  private calculateAdaptationConfidence(
    selectedTradition: { tradition: CulturalHealingTradition; relevance: number },
    request: CulturalResponseRequest
  ): number {
    let confidence = selectedTradition.relevance;

    // Boost confidence for crisis situations if tradition has crisis approaches
    if (request.isCrisis && selectedTradition.tradition.crisisApproaches.length > 0) {
      confidence += 0.2;
    }

    // Reduce confidence if community context doesn't match tradition's community role
    if (request.communityContext) {
      const contextMatch = selectedTradition.tradition.communityRole === request.communityContext;
      if (!contextMatch) confidence -= 0.1;
    }

    return Math.min(Math.max(confidence, 0), 1);
  }

  private generateCulturallyAdaptedResponse(
    tradition: CulturalHealingTradition,
    request: CulturalResponseRequest
  ): {
    response: string;
    wisdom: string;
    respectfulLanguage: string[];
    communityResources: string[];
  } {
    const originalResponse = request.originalResponse;
    let adaptedResponse = originalResponse;
    
    // Add cultural opening
    const culturalOpenings = this.getCulturalOpenings(tradition);
    const selectedOpening = culturalOpenings[Math.floor(Math.random() * culturalOpenings.length)];
    
    // Integrate cultural wisdom
    const culturalWisdom = this.generateCulturalWisdom(tradition, request.emotionalState);
    
    // Add cultural practices
    const relevantPractices = this.selectRelevantPractices(tradition, request);
    
    // Build adapted response
    adaptedResponse = `${selectedOpening}\n\n${originalResponse}\n\n${culturalWisdom}`;
    
    if (relevantPractices.length > 0) {
      adaptedResponse += `\n\nFrom the wisdom of ${tradition.name}, you might find comfort in: ${relevantPractices.join(', ')}.`;
    }

    // Generate respectful language suggestions
    const respectfulLanguage = this.generateRespectfulLanguage(tradition);
    
    // Generate community resources
    const communityResources = this.generateCommunityResources(tradition, request.isCrisis);

    return {
      response: adaptedResponse,
      wisdom: culturalWisdom,
      respectfulLanguage,
      communityResources
    };
  }

  private getCulturalOpenings(tradition: CulturalHealingTradition): string[] {
    const openings: Record<string, string[]> = {
      ubuntu: [
        'In the spirit of Ubuntu - recognizing our shared humanity',
        'Drawing from the wisdom that says "I am because we are"',
        'Honoring the African tradition that healing comes through community'
      ],
      curanderismo: [
        'Drawing from the healing wisdom of curanderismo',
        'In the tradition of holistic healing that honors mind, body, and spirit',
        'Honoring the Latino tradition of family-centered healing'
      ],
      'indigenous-medicine-wheel': [
        'From the wisdom of the Medicine Wheel and the Four Directions',
        'Honoring Indigenous knowledge of balance and connection to Mother Earth',
        'Drawing from ancestral wisdom about healing in harmony with nature'
      ],
      ayurveda: [
        'From the ancient wisdom of Ayurveda',
        'Honoring the Vedic understanding of mind-body-spirit unity',
        'Drawing from Sanskrit wisdom about dharmic healing'
      ],
      'traditional-chinese-medicine': [
        'From the wisdom of Traditional Chinese Medicine',
        'Honoring the ancient understanding of qi and balance',
        'Drawing from the Five Element theory of emotional harmony'
      ],
      'islamic-healing': [
        'In the spirit of Islamic healing traditions',
        'Drawing from the wisdom of patience (sabr) and trust (tawakkul)',
        'Honoring the strength found in faith and community (ummah)'
      ]
    };

    return openings[tradition.id] || ['Drawing from cultural healing wisdom'];
  }

  private generateCulturalWisdom(tradition: CulturalHealingTradition, emotionalState?: string): string {
    const wisdomTemplates: Record<string, string[]> = {
      ubuntu: [
        'The Ubuntu philosophy reminds us that our healing is interconnected - as you heal, you contribute to the healing of the whole community.',
        'In African wisdom, no one heals alone. Your ancestors and community hold you even when you cannot feel their presence.',
        'Ubuntu teaches us that your pain and your healing both belong to the collective human experience.'
      ],
      curanderismo: [
        'Curanderismo teaches us that healing comes through the integration of physical, emotional, and spiritual wellness, often supported by family love.',
        'In Latino healing traditions, we understand that the family\'s emotional health flows through each member - your healing brings healing to those you love.',
        'The wisdom of sobadoras teaches us that healing touch - whether physical, emotional, or spiritual - can restore balance.'
      ],
      'indigenous-medicine-wheel': [
        'The Medicine Wheel teaches us that all emotions have their place in the circle of life, and healing comes through honoring each direction of our experience.',
        'Indigenous wisdom reminds us that Mother Earth provides all the healing we need, and our connection to nature can restore our emotional balance.',
        'The Four Directions teach us that healing involves mental, physical, emotional, and spiritual wellness in harmony.'
      ],
      ayurveda: [
        'Ayurvedic wisdom teaches us that emotional imbalances are opportunities to return to our natural state of harmony and dharmic living.',
        'The ancient Vedic tradition reminds us that healing comes through understanding our unique constitution and living in alignment with our true nature.',
        'Sanskrit wisdom teaches us that challenges are part of our karmic journey toward greater self-awareness and spiritual growth.'
      ],
      'traditional-chinese-medicine': [
        'Traditional Chinese Medicine teaches us that emotional wellness comes from the harmonious flow of qi energy throughout our being.',
        'The ancient wisdom of yin-yang reminds us that all emotions, even difficult ones, have their place in the natural balance of life.',
        'The Five Element theory teaches us that emotions are energetic expressions that can be balanced through mindful practices.'
      ],
      'islamic-healing': [
        'Islamic tradition teaches us that trials are tests that can strengthen our faith and character, and that Allah is always with us in our difficulties.',
        'The concept of sabr (patience) reminds us that healing often comes through trusting Allah\'s timing and finding peace in His wisdom.',
        'The ummah (community) tradition teaches us that we are never alone in our struggles - our brothers and sisters in faith provide support and comfort.'
      ]
    };

    const options = wisdomTemplates[tradition.id] || ['Cultural healing wisdom provides comfort and perspective in difficult times.'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private selectRelevantPractices(
    tradition: CulturalHealingTradition,
    request: CulturalResponseRequest
  ): string[] {
    const allPractices = [...tradition.practices];
    
    if (request.isCrisis) {
      // Prioritize crisis-appropriate practices
      return tradition.crisisApproaches.slice(0, 2);
    }
    
    // Return 2-3 general practices
    return allPractices.slice(0, 3);
  }

  private generateRespectfulLanguage(tradition: CulturalHealingTradition): string[] {
    const respectfulLanguage: Record<string, string[]> = {
      ubuntu: ['Ubuntu', 'collective healing', 'shared humanity', 'community strength'],
      curanderismo: ['curandera guidance', 'familia support', 'holistic healing', 'spiritual balance'],
      'indigenous-medicine-wheel': ['ancestral wisdom', 'Mother Earth connection', 'sacred balance', 'ceremony'],
      ayurveda: ['dharmic living', 'constitutional balance', 'mind-body-spirit unity'],
      'traditional-chinese-medicine': ['qi harmony', 'yin-yang balance', 'natural flow'],
      'islamic-healing': ['insha\'Allah', 'sabr (patience)', 'tawakkul (trust)', 'ummah support']
    };

    return respectfulLanguage[tradition.id] || ['cultural respect', 'traditional wisdom'];
  }

  private generateCommunityResources(
    tradition: CulturalHealingTradition,
    isCrisis?: boolean
  ): string[] {
    const resources: string[] = [];
    
    if (tradition.communityRole === 'community') {
      resources.push('Community healing circles');
      resources.push('Cultural community centers');
    }
    
    if (tradition.communityRole === 'family') {
      resources.push('Family healing support');
      resources.push('Extended family networks');
    }
    
    // Add tradition-specific resources
    if (tradition.id === 'ubuntu') {
      resources.push('African diaspora support groups', 'Community storytelling circles');
    } else if (tradition.id === 'curanderismo') {
      resources.push('Latino mental health centers', 'Curanderas and sobadoras');
    } else if (tradition.id === 'indigenous-medicine-wheel') {
      resources.push('Indigenous healing centers', 'Elder consultation');
    } else if (tradition.id === 'ayurveda') {
      resources.push('Ayurvedic practitioners', 'Yoga and meditation centers');
    } else if (tradition.id === 'traditional-chinese-medicine') {
      resources.push('TCM practitioners', 'Qigong and Tai Chi groups');
    } else if (tradition.id === 'islamic-healing') {
      resources.push('Islamic counseling services', 'Mosque support networks');
    }

    return resources;
  }

  /**
   * Get all available healing traditions
   */
  public getHealingTraditions(): CulturalHealingTradition[] {
    return this.healingTraditions;
  }

  /**
   * Detect user's cultural context from their writing
   */
  public detectCulturalContext(text: string, language?: string): string[] {
    const detectedContexts: string[] = [];
    const lowerText = text.toLowerCase();

    this.healingTraditions.forEach(tradition => {
      tradition.languagePatterns.forEach(pattern => {
        if (lowerText.includes(pattern.toLowerCase())) {
          tradition.culture.forEach(culture => {
            if (!detectedContexts.includes(culture)) {
              detectedContexts.push(culture);
            }
          });
        }
      });
    });

    return detectedContexts;
  }
}

export const culturalResponsivenessEngine = new CulturalResponsivenessEngine();