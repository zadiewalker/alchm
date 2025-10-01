/**
 * 🌍 Khepera Cultural Wisdom Integration Engine
 * 
 * Integrates healing wisdom from diverse cultural traditions while maintaining
 * respect, authenticity, and trauma-informed approaches. This system bridges
 * ancient wisdom with modern emotional intelligence.
 */

export interface CulturalTradition {
  id: string;
  name: string;
  regions: string[];
  languages: string[];
  healingPractices: HealingPractice[];
  metaphors: CulturalMetaphor[];
  emotionalExpressions: EmotionalExpression[];
  communityResources: CommunityResource[];
  identityAffirmations: IdentityAffirmation[];
  sensitivityGuidelines: string[];
}

export interface HealingPractice {
  name: string;
  description: string;
  culturalContext: string;
  applications: string[];
  respectfulIntegration: string;
  contraindications?: string[];
}

export interface CulturalMetaphor {
  concept: string;
  metaphor: string;
  culturalContext: string;
  emotionalResonance: string[];
  respectfulUsage: string;
}

export interface EmotionalExpression {
  emotion: string;
  culturalExpression: string;
  contextualMeaning: string;
  appropriateResponses: string[];
}

export interface CommunityResource {
  type: string;
  description: string;
  culturalRelevance: string;
  accessInformation?: string;
}

export interface IdentityAffirmation {
  identityGroup: string;
  affirmingLanguage: string[];
  culturalStrengths: string[];
  healingContext: string;
}

export interface WisdomIntegrationResult {
  selectedTraditions: CulturalTradition[];
  applicableWisdom: string[];
  healingPractices: HealingPractice[];
  culturalMetaphors: CulturalMetaphor[];
  identityAffirmations: string[];
  communityConnections: CommunityResource[];
  respectfulLanguage: string[];
  confidenceScore: number;
}

class CulturalWisdomEngine {
  private traditions: Map<string, CulturalTradition> = new Map();

  constructor() {
    this.initializeCulturalTraditions();
  }

  private initializeCulturalTraditions(): void {
    // Indigenous Wisdom Traditions
    this.traditions.set('indigenous_north_american', {
      id: 'indigenous_north_american',
      name: 'Indigenous North American Wisdom',
      regions: ['North America'],
      languages: ['Indigenous languages', 'English'],
      healingPractices: [
        {
          name: 'Circle of Sharing',
          description: 'Speaking truth in sacred circle with community witness',
          culturalContext: 'Traditional council and healing circles',
          applications: ['community healing', 'truth telling', 'collective wisdom'],
          respectfulIntegration: 'Honor the sacred nature of circle sharing without appropriating ceremony'
        },
        {
          name: 'Connection to Land',
          description: 'Finding healing through relationship with natural world',
          culturalContext: 'Deep spiritual connection between people and land',
          applications: ['grounding', 'spiritual healing', 'identity connection'],
          respectfulIntegration: 'Acknowledge indigenous land stewardship and sovereignty'
        },
        {
          name: 'Ancestral Wisdom',
          description: 'Drawing strength from those who came before',
          culturalContext: 'Honoring ancestors and seven generations thinking',
          applications: ['resilience building', 'identity strength', 'decision making'],
          respectfulIntegration: 'Honor the specific traditions without generic spirituality'
        }
      ],
      metaphors: [
        {
          concept: 'healing',
          metaphor: 'Like the river that knows its way to the sea, your healing knows its own path',
          culturalContext: 'Water as sacred, healing force in many indigenous traditions',
          emotionalResonance: ['hope', 'trust', 'natural wisdom'],
          respectfulUsage: 'Use with understanding of water\'s sacred significance'
        },
        {
          concept: 'resilience',
          metaphor: 'You carry the strength of your ancestors in your bones',
          culturalContext: 'Intergenerational strength and survival',
          emotionalResonance: ['empowerment', 'connection', 'inheritance'],
          respectfulUsage: 'Honor the reality of ancestral trauma and resilience'
        }
      ],
      emotionalExpressions: [
        {
          emotion: 'grief',
          culturalExpression: 'Honoring loss as sacred, allowing tears to water new growth',
          contextualMeaning: 'Grief as natural cycle, connected to life and renewal',
          appropriateResponses: ['witnessing', 'community support', 'ritual acknowledgment']
        }
      ],
      communityResources: [
        {
          type: 'cultural_center',
          description: 'Indigenous cultural centers and community organizations',
          culturalRelevance: 'Connection to cultural identity and community support'
        },
        {
          type: 'traditional_healers',
          description: 'Traditional indigenous healers and medicine people',
          culturalRelevance: 'Culturally appropriate healing practices'
        }
      ],
      identityAffirmations: [
        {
          identityGroup: 'indigenous',
          affirmingLanguage: [
            'Your indigenous wisdom is a gift to the world',
            'You carry the strength of your people within you',
            'Your connection to the land is sacred and valid'
          ],
          culturalStrengths: ['resilience', 'community connection', 'environmental wisdom'],
          healingContext: 'Affirming indigenous identity in face of historical trauma'
        }
      ],
      sensitivityGuidelines: [
        'Never appropriate sacred ceremonies or practices',
        'Acknowledge historical trauma and ongoing colonization',
        'Respect tribal sovereignty and specific cultural differences',
        'Avoid pan-indigenous generalizations'
      ]
    });

    // African Diaspora Wisdom
    this.traditions.set('african_diaspora', {
      id: 'african_diaspora',
      name: 'African Diaspora Healing Wisdom',
      regions: ['Africa', 'Americas', 'Caribbean'],
      languages: ['Various African languages', 'English', 'Spanish', 'Portuguese', 'French'],
      healingPractices: [
        {
          name: 'Community Healing Circles',
          description: 'Collective healing through shared story and song',
          culturalContext: 'Ubuntu philosophy - I am because we are',
          applications: ['community support', 'trauma healing', 'identity affirmation'],
          respectfulIntegration: 'Honor the communal aspect without appropriating specific traditions'
        },
        {
          name: 'Ancestral Connection',
          description: 'Drawing strength from ancestral wisdom and resilience',
          culturalContext: 'Honoring ancestors who survived and thrived despite oppression',
          applications: ['resilience building', 'identity strength', 'spiritual healing'],
          respectfulIntegration: 'Acknowledge the specific context of survival and resistance'
        },
        {
          name: 'Movement and Rhythm',
          description: 'Healing through dance, music, and embodied expression',
          culturalContext: 'Rich traditions of healing through movement and rhythm',
          applications: ['emotional release', 'joy cultivation', 'community connection'],
          respectfulIntegration: 'Respect the sacred and social functions of traditional forms'
        }
      ],
      metaphors: [
        {
          concept: 'resilience',
          metaphor: 'Like the baobab tree, your roots run deep and your strength reaches high',
          culturalContext: 'Baobab as symbol of strength and endurance in African traditions',
          emotionalResonance: ['strength', 'endurance', 'deep roots'],
          respectfulUsage: 'Honor the specific cultural significance of the baobab'
        },
        {
          concept: 'community',
          metaphor: 'We are like fingers on a hand - different but stronger together',
          culturalContext: 'Ubuntu philosophy and communal values',
          emotionalResonance: ['belonging', 'interdependence', 'collective strength'],
          respectfulUsage: 'Understand the deep philosophical context of Ubuntu'
        }
      ],
      emotionalExpressions: [
        {
          emotion: 'joy',
          culturalExpression: 'Joy that springs from deep wells of survival and celebration',
          contextualMeaning: 'Joy as resistance and celebration of life despite oppression',
          appropriateResponses: ['celebration', 'community sharing', 'movement']
        }
      ],
      communityResources: [
        {
          type: 'cultural_organizations',
          description: 'African diaspora cultural organizations and community centers',
          culturalRelevance: 'Connection to cultural identity and community support'
        },
        {
          type: 'spiritual_communities',
          description: 'Churches and spiritual communities central to African diaspora healing',
          culturalRelevance: 'Spiritual support rooted in cultural tradition'
        }
      ],
      identityAffirmations: [
        {
          identityGroup: 'black_african_diaspora',
          affirmingLanguage: [
            'Your ancestors\' strength flows through your veins',
            'Your blackness is beautiful and powerful',
            'You carry the wisdom of survival and thriving'
          ],
          culturalStrengths: ['resilience', 'community bonds', 'creative expression'],
          healingContext: 'Affirming identity in face of systemic racism and historical trauma'
        }
      ],
      sensitivityGuidelines: [
        'Acknowledge the impact of slavery, colonization, and ongoing racism',
        'Respect the diversity within African diaspora communities',
        'Honor the specific cultural practices without appropriation',
        'Understand the context of resistance and survival'
      ]
    });

    // Asian Wisdom Traditions
    this.traditions.set('east_asian_wisdom', {
      id: 'east_asian_wisdom',
      name: 'East Asian Healing Wisdom',
      regions: ['East Asia'],
      languages: ['Chinese', 'Japanese', 'Korean', 'Vietnamese'],
      healingPractices: [
        {
          name: 'Balance and Harmony',
          description: 'Finding equilibrium between opposing forces and energies',
          culturalContext: 'Yin-yang philosophy and traditional medicine principles',
          applications: ['emotional balance', 'stress management', 'holistic wellness'],
          respectfulIntegration: 'Honor the philosophical depth without superficial application'
        },
        {
          name: 'Mindful Awareness',
          description: 'Cultivating present-moment awareness and acceptance',
          culturalContext: 'Buddhist and Taoist mindfulness traditions',
          applications: ['anxiety reduction', 'emotional regulation', 'spiritual growth'],
          respectfulIntegration: 'Respect the spiritual and philosophical foundations'
        },
        {
          name: 'Community Interdependence',
          description: 'Healing through family and community connection',
          culturalContext: 'Confucian values of social harmony and family bonds',
          applications: ['relationship healing', 'identity support', 'collective wellness'],
          respectfulIntegration: 'Understand the cultural context of interdependence'
        }
      ],
      metaphors: [
        {
          concept: 'growth',
          metaphor: 'Like bamboo, you bend without breaking and grow through every season',
          culturalContext: 'Bamboo as symbol of flexibility and resilience in Asian cultures',
          emotionalResonance: ['flexibility', 'resilience', 'steady growth'],
          respectfulUsage: 'Honor the specific cultural meanings of bamboo symbolism'
        },
        {
          concept: 'healing',
          metaphor: 'Your healing flows like a gentle stream, persistent and patient',
          culturalContext: 'Water symbolism in Taoist philosophy',
          emotionalResonance: ['patience', 'persistence', 'gentle power'],
          respectfulUsage: 'Understand the deeper philosophical context of water wisdom'
        }
      ],
      emotionalExpressions: [
        {
          emotion: 'shame',
          culturalExpression: 'Collective face and family honor considerations in emotional expression',
          contextualMeaning: 'Understanding face-saving and family impact in emotional processing',
          appropriateResponses: ['gentle inquiry', 'family-aware support', 'honor preservation']
        }
      ],
      communityResources: [
        {
          type: 'cultural_associations',
          description: 'Asian cultural associations and community organizations',
          culturalRelevance: 'Cultural identity support and community connection'
        },
        {
          type: 'traditional_medicine',
          description: 'Traditional medicine practitioners and holistic healers',
          culturalRelevance: 'Culturally familiar healing approaches'
        }
      ],
      identityAffirmations: [
        {
          identityGroup: 'asian',
          affirmingLanguage: [
            'Your cultural wisdom brings balance to the world',
            'Your family\'s sacrifices created your strength',
            'Your identity bridges ancient wisdom and modern life'
          ],
          culturalStrengths: ['perseverance', 'family bonds', 'educational achievement'],
          healingContext: 'Affirming identity while addressing model minority pressures'
        }
      ],
      sensitivityGuidelines: [
        'Avoid stereotypes about academic achievement and emotional expression',
        'Understand the diversity within Asian communities',
        'Respect family dynamics and collectivist values',
        'Acknowledge experiences of racism and discrimination'
      ]
    });

    // Latino/Hispanic Wisdom
    this.traditions.set('latino_hispanic_wisdom', {
      id: 'latino_hispanic_wisdom',
      name: 'Latino/Hispanic Healing Wisdom',
      regions: ['Latin America', 'Caribbean', 'Southwest US'],
      languages: ['Spanish', 'Portuguese', 'Indigenous languages'],
      healingPractices: [
        {
          name: 'Familia and Community',
          description: 'Healing through strong family and community bonds',
          culturalContext: 'Familismo and community-centered healing traditions',
          applications: ['family therapy', 'community support', 'identity affirmation'],
          respectfulIntegration: 'Honor the central role of family while respecting boundaries'
        },
        {
          name: 'Curanderismo Wisdom',
          description: 'Traditional healing practices using herbs, ritual, and spiritual cleansing',
          culturalContext: 'Indigenous and mestizo healing traditions',
          applications: ['holistic healing', 'spiritual cleansing', 'energy work'],
          respectfulIntegration: 'Respect the sacred nature without appropriating specific practices',
          contraindications: ['Do not practice without proper training and cultural context']
        },
        {
          name: 'Celebration and Joy',
          description: 'Healing through music, dance, and celebratory community',
          culturalContext: 'Rich traditions of healing through celebration and artistic expression',
          applications: ['mood enhancement', 'community bonding', 'cultural pride'],
          respectfulIntegration: 'Honor the deeper cultural significance of celebration'
        }
      ],
      metaphors: [
        {
          concept: 'strength',
          metaphor: 'You have the strength of the cactus - beautiful flowers blooming in harsh conditions',
          culturalContext: 'Desert plants as symbols of resilience in Mexican/Southwest culture',
          emotionalResonance: ['resilience', 'beauty', 'survival'],
          respectfulUsage: 'Understand the specific regional and cultural context'
        },
        {
          concept: 'family',
          metaphor: 'Your family roots run deep like ancient ceiba trees, supporting generations',
          culturalContext: 'Ceiba tree as sacred symbol in Mesoamerican cultures',
          emotionalResonance: ['deep roots', 'intergenerational strength', 'sacred connection'],
          respectfulUsage: 'Honor the sacred significance of the ceiba in indigenous traditions'
        }
      ],
      emotionalExpressions: [
        {
          emotion: 'sadness',
          culturalExpression: 'Tristeza as deep emotional expression shared with family and community',
          contextualMeaning: 'Sadness as communal experience requiring family support',
          appropriateResponses: ['family inclusion', 'community support', 'emotional expression']
        }
      ],
      communityResources: [
        {
          type: 'cultural_centers',
          description: 'Latino cultural centers and community organizations',
          culturalRelevance: 'Cultural identity support and community connection'
        },
        {
          type: 'religious_communities',
          description: 'Catholic churches and spiritual communities',
          culturalRelevance: 'Spiritual support rooted in cultural tradition'
        }
      ],
      identityAffirmations: [
        {
          identityGroup: 'latino_hispanic',
          affirmingLanguage: [
            'Your cultura is your strength and your gift',
            'You bridge worlds with grace and wisdom',
            'Your family\'s journey created your resilience'
          ],
          culturalStrengths: ['family bonds', 'cultural pride', 'bilingual abilities'],
          healingContext: 'Affirming identity while addressing immigration trauma and discrimination'
        }
      ],
      sensitivityGuidelines: [
        'Understand the diversity within Latino/Hispanic communities',
        'Acknowledge immigration trauma and discrimination',
        'Respect religious and spiritual beliefs',
        'Honor the importance of family and community'
      ]
    });

    // LGBTQ+ Affirming Wisdom
    this.traditions.set('lgbtq_affirming', {
      id: 'lgbtq_affirming',
      name: 'LGBTQ+ Affirming Wisdom',
      regions: ['Global'],
      languages: ['All languages'],
      healingPractices: [
        {
          name: 'Chosen Family',
          description: 'Finding family and belonging in community of choice',
          culturalContext: 'LGBTQ+ tradition of creating family bonds beyond biology',
          applications: ['belonging', 'identity support', 'community healing'],
          respectfulIntegration: 'Honor the importance of chosen family in LGBTQ+ experience'
        },
        {
          name: 'Authentic Self-Expression',
          description: 'Healing through living and expressing authentic identity',
          culturalContext: 'Coming out process and identity affirmation',
          applications: ['identity development', 'self-acceptance', 'authentic living'],
          respectfulIntegration: 'Support authentic expression while respecting individual journey'
        },
        {
          name: 'Pride and Celebration',
          description: 'Healing through pride, visibility, and community celebration',
          culturalContext: 'Pride movement and affirming community spaces',
          applications: ['self-worth', 'community connection', 'resilience building'],
          respectfulIntegration: 'Understand the political and personal significance of pride'
        }
      ],
      metaphors: [
        {
          concept: 'authenticity',
          metaphor: 'Your true colors shine like a rainbow after the storm',
          culturalContext: 'Rainbow as symbol of LGBTQ+ pride and diversity',
          emotionalResonance: ['authenticity', 'pride', 'beauty in diversity'],
          respectfulUsage: 'Honor the specific meaning of rainbow symbolism in LGBTQ+ context'
        },
        {
          concept: 'resilience',
          metaphor: 'You bloom where others said nothing could grow',
          culturalContext: 'Resilience in face of rejection and discrimination',
          emotionalResonance: ['strength', 'defiance', 'unexpected beauty'],
          respectfulUsage: 'Acknowledge the reality of discrimination while celebrating resilience'
        }
      ],
      emotionalExpressions: [
        {
          emotion: 'shame',
          culturalExpression: 'Internalized shame about identity and authentic self',
          contextualMeaning: 'Shame imposed by society that contradicts authentic self',
          appropriateResponses: ['affirmation', 'identity validation', 'community connection']
        }
      ],
      communityResources: [
        {
          type: 'lgbtq_centers',
          description: 'LGBTQ+ community centers and support organizations',
          culturalRelevance: 'Identity-affirming community support and resources'
        },
        {
          type: 'affirming_providers',
          description: 'LGBTQ+-affirming healthcare and mental health providers',
          culturalRelevance: 'Identity-affirming professional support'
        }
      ],
      identityAffirmations: [
        {
          identityGroup: 'lgbtq',
          affirmingLanguage: [
            'Your identity is valid and beautiful',
            'You deserve love and acceptance exactly as you are',
            'Your courage to be authentic inspires others'
          ],
          culturalStrengths: ['authenticity', 'resilience', 'community building'],
          healingContext: 'Affirming identity in face of societal rejection and discrimination'
        }
      ],
      sensitivityGuidelines: [
        'Use chosen names and pronouns consistently',
        'Understand the coming out process as ongoing',
        'Acknowledge intersectional identities and experiences',
        'Avoid assumptions about relationships and identity'
      ]
    });

    // Add more traditions...
  }

  /**
   * Analyzes user context and selects relevant cultural wisdom traditions
   */
  public integrateWisdom(
    journalText: string,
    userCulture?: string,
    userIdentity?: string[],
    detectedLanguage: string = 'en',
    emotionalState?: string
  ): WisdomIntegrationResult {
    const selectedTraditions: CulturalTradition[] = [];
    const applicableWisdom: string[] = [];
    const healingPractices: HealingPractice[] = [];
    const culturalMetaphors: CulturalMetaphor[] = [];
    const identityAffirmations: string[] = [];
    const communityConnections: CommunityResource[] = [];
    const respectfulLanguage: string[] = [];

    // Detect relevant cultural contexts from journal text and user data
    const relevantTraditions = this.detectRelevantTraditions(
      journalText,
      userCulture,
      userIdentity,
      detectedLanguage
    );

    for (const traditionId of relevantTraditions) {
      const tradition = this.traditions.get(traditionId);
      if (tradition) {
        selectedTraditions.push(tradition);

        // Extract applicable healing practices
        const relevantPractices = this.selectRelevantPractices(
          tradition.healingPractices,
          journalText,
          emotionalState
        );
        healingPractices.push(...relevantPractices);

        // Extract cultural metaphors
        const relevantMetaphors = this.selectRelevantMetaphors(
          tradition.metaphors,
          journalText,
          emotionalState
        );
        culturalMetaphors.push(...relevantMetaphors);

        // Extract identity affirmations
        if (userIdentity) {
          for (const affirmation of tradition.identityAffirmations) {
            if (userIdentity.some(id => 
              affirmation.identityGroup === id || 
              this.isRelatedIdentity(id, affirmation.identityGroup)
            )) {
              identityAffirmations.push(...affirmation.affirmingLanguage);
            }
          }
        }

        // Extract community resources
        communityConnections.push(...tradition.communityResources);

        // Add respectful language guidelines
        respectfulLanguage.push(...tradition.sensitivityGuidelines);
      }
    }

    // Generate wisdom integration
    applicableWisdom.push(...this.generateApplicableWisdom(
      selectedTraditions,
      journalText,
      emotionalState
    ));

    return {
      selectedTraditions,
      applicableWisdom,
      healingPractices,
      culturalMetaphors,
      identityAffirmations,
      communityConnections,
      respectfulLanguage,
      confidenceScore: this.calculateConfidenceScore(selectedTraditions, journalText)
    };
  }

  private detectRelevantTraditions(
    journalText: string,
    userCulture?: string,
    userIdentity?: string[],
    detectedLanguage: string = 'en'
  ): string[] {
    const relevant: string[] = [];
    const textLower = journalText.toLowerCase();

    // Direct cultural matching
    if (userCulture) {
      const matchingTradition = this.findTraditionByCulture(userCulture);
      if (matchingTradition) {
        relevant.push(matchingTradition);
      }
    }

    // Identity-based matching
    if (userIdentity) {
      for (const identity of userIdentity) {
        const matchingTraditions = this.findTraditionsByIdentity(identity);
        relevant.push(...matchingTraditions);
      }
    }

    // Language-based matching
    const languageTraditions = this.findTraditionsByLanguage(detectedLanguage);
    relevant.push(...languageTraditions);

    // Content-based detection
    if (textLower.includes('family') || textLower.includes('familia')) {
      relevant.push('latino_hispanic_wisdom');
    }
    if (textLower.includes('ancestors') || textLower.includes('grandmother')) {
      relevant.push('indigenous_north_american', 'african_diaspora');
    }
    if (textLower.includes('balance') || textLower.includes('harmony')) {
      relevant.push('east_asian_wisdom');
    }
    if (textLower.includes('community') || textLower.includes('chosen family')) {
      relevant.push('lgbtq_affirming');
    }

    // Remove duplicates
    return [...new Set(relevant)];
  }

  private selectRelevantPractices(
    practices: HealingPractice[],
    journalText: string,
    emotionalState?: string
  ): HealingPractice[] {
    const textLower = journalText.toLowerCase();
    return practices.filter(practice => {
      // Match based on emotional state
      if (emotionalState && practice.applications.some(app => 
        app.includes(emotionalState) || emotionalState.includes(app)
      )) {
        return true;
      }

      // Match based on journal content
      return practice.applications.some(app => 
        textLower.includes(app) || app.split(' ').some(word => textLower.includes(word))
      );
    });
  }

  private selectRelevantMetaphors(
    metaphors: CulturalMetaphor[],
    journalText: string,
    emotionalState?: string
  ): CulturalMetaphor[] {
    const textLower = journalText.toLowerCase();
    return metaphors.filter(metaphor => {
      // Match based on emotional resonance
      if (emotionalState && metaphor.emotionalResonance.includes(emotionalState)) {
        return true;
      }

      // Match based on concept relevance
      return textLower.includes(metaphor.concept);
    });
  }

  private generateApplicableWisdom(
    traditions: CulturalTradition[],
    journalText: string,
    emotionalState?: string
  ): string[] {
    const wisdom: string[] = [];

    for (const tradition of traditions) {
      // Extract wisdom based on healing practices
      for (const practice of tradition.healingPractices) {
        wisdom.push(`From ${tradition.name}: ${practice.respectfulIntegration}`);
      }

      // Extract wisdom from metaphors
      for (const metaphor of tradition.metaphors) {
        if (this.isMetaphorRelevant(metaphor, journalText, emotionalState)) {
          wisdom.push(`Cultural wisdom: ${metaphor.metaphor}`);
        }
      }
    }

    return wisdom;
  }

  private isMetaphorRelevant(
    metaphor: CulturalMetaphor,
    journalText: string,
    emotionalState?: string
  ): boolean {
    const textLower = journalText.toLowerCase();
    
    // Check emotional resonance
    if (emotionalState && metaphor.emotionalResonance.includes(emotionalState)) {
      return true;
    }

    // Check concept relevance
    return textLower.includes(metaphor.concept);
  }

  private findTraditionByCulture(culture: string): string | null {
    const cultureLower = culture.toLowerCase();
    
    for (const [id, tradition] of this.traditions) {
      if (tradition.regions.some(region => 
        cultureLower.includes(region.toLowerCase())
      )) {
        return id;
      }
    }
    
    return null;
  }

  private findTraditionsByIdentity(identity: string): string[] {
    const identityLower = identity.toLowerCase();
    const matching: string[] = [];

    for (const [id, tradition] of this.traditions) {
      if (tradition.identityAffirmations.some(affirmation => 
        affirmation.identityGroup.toLowerCase().includes(identityLower) ||
        identityLower.includes(affirmation.identityGroup.toLowerCase())
      )) {
        matching.push(id);
      }
    }

    return matching;
  }

  private findTraditionsByLanguage(language: string): string[] {
    const langLower = language.toLowerCase();
    const matching: string[] = [];

    for (const [id, tradition] of this.traditions) {
      if (tradition.languages.some(lang => 
        lang.toLowerCase().includes(langLower) ||
        langLower.includes(lang.toLowerCase())
      )) {
        matching.push(id);
      }
    }

    return matching;
  }

  private isRelatedIdentity(userIdentity: string, traditionIdentity: string): boolean {
    const userLower = userIdentity.toLowerCase();
    const traditionLower = traditionIdentity.toLowerCase();

    // Define related identity mappings
    const relatedIdentities: Record<string, string[]> = {
      'black': ['african_diaspora', 'african'],
      'african_american': ['african_diaspora', 'black'],
      'native_american': ['indigenous'],
      'indigenous': ['native_american'],
      'latino': ['hispanic', 'latinx'],
      'hispanic': ['latino', 'latinx'],
      'gay': ['lgbtq', 'queer'],
      'lesbian': ['lgbtq', 'queer'],
      'transgender': ['lgbtq', 'trans'],
      'queer': ['lgbtq']
    };

    if (relatedIdentities[userLower]) {
      return relatedIdentities[userLower].some(related => 
        traditionLower.includes(related)
      );
    }

    return false;
  }

  private calculateConfidenceScore(
    traditions: CulturalTradition[],
    journalText: string
  ): number {
    if (traditions.length === 0) return 0;

    // Base confidence on number of matching traditions and text relevance
    const baseScore = Math.min(traditions.length * 0.3, 0.9);
    const textRelevance = Math.min(journalText.length / 1000, 0.1);
    
    return Math.min(baseScore + textRelevance, 1.0);
  }

  /**
   * Gets all available cultural traditions
   */
  public getAllTraditions(): CulturalTradition[] {
    return Array.from(this.traditions.values());
  }

  /**
   * Gets a specific cultural tradition by ID
   */
  public getTradition(id: string): CulturalTradition | undefined {
    return this.traditions.get(id);
  }
}

export const culturalWisdomEngine = new CulturalWisdomEngine();