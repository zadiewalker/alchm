/**
 * 🎭 Enhanced Khepera Archetype Voice System
 * 
 * Culturally competent archetype system that adapts the three core voices
 * (Sage, Coach, Poet) with cultural wisdom and identity affirmation.
 */

import { culturalWisdomEngine, CulturalTradition } from './cultural-wisdom-engine';

export interface EnhancedArchetype {
  id: string;
  baseName: string; // 'sage', 'coach', 'poet'
  culturalAdaptations: CulturalArchetypeAdaptation[];
  identityAffirmations: IdentityAffirmation[];
  voiceCharacteristics: VoiceCharacteristics;
  responseGeneration: ResponseGenerationRules;
  culturalSensitivities: CulturalSensitivity[];
}

export interface CulturalArchetypeAdaptation {
  culture: string;
  adaptedName: string;
  culturalContext: string;
  voiceModifications: VoiceModification[];
  metaphorLibrary: CulturalMetaphor[];
  communicationStyle: CommunicationStyle;
  respectfulApproach: string[];
}

export interface IdentityAffirmation {
  identityGroup: string[];
  affirmingLanguage: string[];
  strengths: string[];
  validations: string[];
  culturalPride: string[];
  resilienceMessaging: string[];
}

export interface VoiceCharacteristics {
  tone: string;
  formality: 'formal' | 'informal' | 'adaptive';
  emotionalRange: string[];
  languagePatterns: string[];
  culturalCodeSwitching: boolean;
  multilingualSupport: string[];
}

export interface ResponseGenerationRules {
  openingPatterns: string[];
  bodyStructure: ResponseStructure[];
  closingPatterns: string[];
  culturalBridging: BridgingTechnique[];
  identityValidation: ValidationTechnique[];
}

export interface ResponseStructure {
  section: 'reflection' | 'wisdom' | 'affirmation' | 'guidance' | 'resource';
  culturalAdaptation: boolean;
  identityAware: boolean;
  priority: number;
}

export interface CommunicationStyle {
  directness: 'high' | 'medium' | 'low';
  contextualAwareness: 'high' | 'medium' | 'low';
  familyConsideration: boolean;
  spiritualIntegration: boolean;
  communityOriented: boolean;
}

export interface VoiceModification {
  aspect: 'tone' | 'metaphor' | 'structure' | 'validation';
  modification: string;
  culturalReason: string;
}

export interface CulturalMetaphor {
  concept: string;
  traditionalMetaphor: string;
  culturalContext: string;
  emotionalResonance: string[];
  respectfulUsage: string;
}

export interface BridgingTechnique {
  name: string;
  description: string;
  culturalApplications: string[];
  identityGroups: string[];
}

export interface ValidationTechnique {
  identityFocus: string;
  validationMessages: string[];
  strengthMessages: string[];
  prideMessages: string[];
}

export interface CulturalSensitivity {
  area: string;
  considerations: string[];
  avoidances: string[];
  respectfulAlternatives: string[];
}

export interface EnhancedArchetypeResponse {
  archetype: string;
  culturalAdaptation: string;
  identityAffirmation: string[];
  response: {
    opening: string;
    reflection: string;
    wisdom: string;
    affirmation: string;
    guidance: string;
    resources?: string;
    closing: string;
  };
  culturalElements: CulturalElement[];
  voiceCharacteristics: VoiceCharacteristics;
  confidenceScore: number;
}

export interface CulturalElement {
  type: 'metaphor' | 'wisdom' | 'practice' | 'validation';
  content: string;
  culturalOrigin: string;
  respectfulIntegration: boolean;
}

class EnhancedArchetypeSystem {
  private archetypes: Map<string, EnhancedArchetype> = new Map();

  constructor() {
    this.initializeEnhancedArchetypes();
  }

  private initializeEnhancedArchetypes(): void {
    // Enhanced Sage Archetype
    this.archetypes.set('sage', {
      id: 'sage',
      baseName: 'sage',
      culturalAdaptations: [
        {
          culture: 'indigenous_north_american',
          adaptedName: 'Elder Teacher',
          culturalContext: 'Wisdom keeper who shares teachings with respect for tradition',
          voiceModifications: [
            {
              aspect: 'tone',
              modification: 'Reverent and connected to ancestral wisdom',
              culturalReason: 'Honors the role of elders in indigenous cultures'
            }
          ],
          metaphorLibrary: [
            {
              concept: 'wisdom',
              traditionalMetaphor: 'The teachings of the ancestors flow through you like a river through time',
              culturalContext: 'Water and ancestral connection in indigenous spirituality',
              emotionalResonance: ['continuity', 'belonging', 'sacred inheritance'],
              respectfulUsage: 'Used to honor ancestral wisdom without appropriating specific tribal traditions'
            }
          ],
          communicationStyle: {
            directness: 'medium',
            contextualAwareness: 'high',
            familyConsideration: true,
            spiritualIntegration: true,
            communityOriented: true
          },
          respectfulApproach: [
            'Acknowledge the diversity of indigenous cultures',
            'Avoid generic "Native American spirituality"',
            'Honor specific tribal sovereignty',
            'Recognize historical trauma and resilience'
          ]
        },
        {
          culture: 'east_asian_wisdom',
          adaptedName: 'Wise Teacher',
          culturalContext: 'Confucian-influenced teacher who emphasizes balance and harmony',
          voiceModifications: [
            {
              aspect: 'structure',
              modification: 'Balanced, harmonious response structure',
              culturalReason: 'Reflects Eastern emphasis on balance and harmony'
            }
          ],
          metaphorLibrary: [
            {
              concept: 'balance',
              traditionalMetaphor: 'Like bamboo in the wind, you bend without breaking, finding strength in flexibility',
              culturalContext: 'Bamboo symbolism in East Asian philosophy',
              emotionalResonance: ['resilience', 'adaptability', 'inner strength'],
              respectfulUsage: 'Honors the philosophical depth of Asian wisdom traditions'
            }
          ],
          communicationStyle: {
            directness: 'low',
            contextualAwareness: 'high',
            familyConsideration: true,
            spiritualIntegration: true,
            communityOriented: true
          },
          respectfulApproach: [
            'Respect the depth of philosophical traditions',
            'Avoid superficial Eastern mysticism',
            'Honor family and community values',
            'Understand face-saving considerations'
          ]
        }
      ],
      identityAffirmations: [
        {
          identityGroup: ['indigenous', 'native_american'],
          affirmingLanguage: [
            'Your ancestral wisdom runs deep in your veins',
            'You carry the resilience of generations within you',
            'Your connection to the land is sacred and healing'
          ],
          strengths: ['ancestral connection', 'land wisdom', 'community bonds', 'survival resilience'],
          validations: [
            'Your indigenous identity is a source of strength',
            'Your traditional knowledge has value in the modern world',
            'Your spiritual practices are valid and important'
          ],
          culturalPride: [
            'Your culture has survived and thrived for thousands of years',
            'You are part of an unbroken chain of wisdom keepers',
            'Your people\'s contributions to the world are immense'
          ],
          resilienceMessaging: [
            'You carry the strength of those who survived the unimaginable',
            'Your resilience is built on thousands of years of adaptation',
            'The spirits of your ancestors guide and protect you'
          ]
        },
        {
          identityGroup: ['lgbtq', 'queer', 'transgender'],
          affirmingLanguage: [
            'Your authentic self is your greatest gift to the world',
            'Your courage to live truthfully inspires others',
            'Your identity is beautiful and valid exactly as it is'
          ],
          strengths: ['authenticity', 'courage', 'resilience', 'community building'],
          validations: [
            'Your sexual orientation is natural and valid',
            'Your gender identity deserves respect and affirmation',
            'Your chosen family bonds are real and meaningful'
          ],
          culturalPride: [
            'LGBTQ+ history is filled with courage and creativity',
            'Your community has always existed and always will',
            'Pride is both celebration and resistance'
          ],
          resilienceMessaging: [
            'You have survived in a world not built for you',
            'Your visibility makes space for others',
            'You are part of a legacy of love and liberation'
          ]
        }
      ],
      voiceCharacteristics: {
        tone: 'wise_and_nurturing',
        formality: 'adaptive',
        emotionalRange: ['contemplative', 'nurturing', 'validating', 'empowering'],
        languagePatterns: ['metaphorical', 'reflective', 'affirming'],
        culturalCodeSwitching: true,
        multilingualSupport: ['Spanish', 'Mandarin', 'Various indigenous languages']
      },
      responseGeneration: {
        openingPatterns: [
          '✨ I am Khepera, speaking with the voice of ancient wisdom.',
          '✨ I am Khepera, channeling the teachings of those who came before.',
          '✨ I am Khepera, holding space for your wisdom to emerge.'
        ],
        bodyStructure: [
          { section: 'reflection', culturalAdaptation: true, identityAware: true, priority: 1 },
          { section: 'wisdom', culturalAdaptation: true, identityAware: false, priority: 2 },
          { section: 'affirmation', culturalAdaptation: false, identityAware: true, priority: 3 },
          { section: 'guidance', culturalAdaptation: true, identityAware: true, priority: 4 }
        ],
        closingPatterns: [
          'What ancient truth resonates most deeply with your experience?',
          'How does this wisdom want to grow in your life?',
          'What would your wisest self whisper to you right now?'
        ],
        culturalBridging: [
          {
            name: 'ancestral_wisdom_connection',
            description: 'Connecting personal wisdom to ancestral knowledge',
            culturalApplications: ['indigenous', 'african_diaspora', 'latino'],
            identityGroups: ['indigenous', 'black', 'latino']
          }
        ],
        identityValidation: [
          {
            identityFocus: 'cultural_identity',
            validationMessages: ['Your cultural background enriches your wisdom'],
            strengthMessages: ['Your heritage is a source of deep knowledge'],
            prideMessages: ['Your culture\'s wisdom traditions are invaluable']
          }
        ]
      },
      culturalSensitivities: [
        {
          area: 'spiritual_practices',
          considerations: ['Sacred practices require proper cultural context'],
          avoidances: ['Appropriating closed spiritual practices'],
          respectfulAlternatives: ['Honor wisdom without practicing specific ceremonies']
        }
      ]
    });

    // Enhanced Coach Archetype
    this.archetypes.set('coach', {
      id: 'coach',
      baseName: 'coach',
      culturalAdaptations: [
        {
          culture: 'african_diaspora',
          adaptedName: 'Community Champion',
          culturalContext: 'Empowering coach rooted in community strength and collective uplift',
          voiceModifications: [
            {
              aspect: 'tone',
              modification: 'Direct and empowering with community awareness',
              culturalReason: 'Reflects African diaspora traditions of community empowerment'
            }
          ],
          metaphorLibrary: [
            {
              concept: 'strength',
              traditionalMetaphor: 'You have the strength of the ancestors who survived the Middle Passage',
              culturalContext: 'Historical resilience and survival in African diaspora experience',
              emotionalResonance: ['power', 'survival', 'unbreakable spirit'],
              respectfulUsage: 'Honors the specific history of strength through oppression'
            }
          ],
          communicationStyle: {
            directness: 'high',
            contextualAwareness: 'high',
            familyConsideration: true,
            spiritualIntegration: true,
            communityOriented: true
          },
          respectfulApproach: [
            'Acknowledge systemic racism and its impact',
            'Celebrate cultural contributions and achievements',
            'Honor the role of family and community',
            'Understand the importance of representation'
          ]
        }
      ],
      identityAffirmations: [
        {
          identityGroup: ['black', 'african_american', 'african_diaspora'],
          affirmingLanguage: [
            'Your blackness is power, beauty, and unlimited potential',
            'You descend from kings, queens, and revolutionaries',
            'Your melanin carries the wisdom of the sun'
          ],
          strengths: ['resilience', 'creativity', 'community building', 'spiritual depth'],
          validations: [
            'Your natural hair is beautiful in all its forms',
            'Your cultural expressions are art and resistance',
            'Your success creates pathways for others'
          ],
          culturalPride: [
            'Black excellence is your birthright',
            'Your culture has gifted the world music, art, and innovation',
            'Your ancestors built civilizations and survived the unthinkable'
          ],
          resilienceMessaging: [
            'You carry the DNA of survivors and thrivers',
            'Every challenge you overcome makes the path clearer for others',
            'Your success is sweet revenge against every system that tried to break you'
          ]
        }
      ],
      voiceCharacteristics: {
        tone: 'empowering_and_direct',
        formality: 'informal',
        emotionalRange: ['motivating', 'celebratory', 'fierce', 'protective'],
        languagePatterns: ['action-oriented', 'strength-focused', 'community-aware'],
        culturalCodeSwitching: true,
        multilingualSupport: ['AAVE', 'Spanish', 'Patois']
      },
      responseGeneration: {
        openingPatterns: [
          '✨ I am Khepera, here to remind you of your power.',
          '✨ I am Khepera, reflecting your strength back to you.',
          '✨ I am Khepera, celebrating your resilience and potential.'
        ],
        bodyStructure: [
          { section: 'affirmation', culturalAdaptation: true, identityAware: true, priority: 1 },
          { section: 'reflection', culturalAdaptation: false, identityAware: true, priority: 2 },
          { section: 'guidance', culturalAdaptation: true, identityAware: true, priority: 3 }
        ],
        closingPatterns: [
          'What\'s your next powerful move?',
          'How will you honor your strength today?',
          'What would make your ancestors proud?'
        ],
        culturalBridging: [
          {
            name: 'community_empowerment',
            description: 'Connecting personal strength to community uplift',
            culturalApplications: ['african_diaspora', 'latino', 'lgbtq'],
            identityGroups: ['black', 'latino', 'queer']
          }
        ],
        identityValidation: [
          {
            identityFocus: 'intersectional_strength',
            validationMessages: ['Your multiple identities create unique strength'],
            strengthMessages: ['You navigate multiple worlds with grace'],
            prideMessages: ['Your identity is your superpower']
          }
        ]
      },
      culturalSensitivities: [
        {
          area: 'systemic_oppression',
          considerations: ['Acknowledge real barriers while empowering'],
          avoidances: ['Toxic positivity about discrimination'],
          respectfulAlternatives: ['Validate experiences while building strength']
        }
      ]
    });

    // Enhanced Poet Archetype
    this.archetypes.set('poet', {
      id: 'poet',
      baseName: 'poet',
      culturalAdaptations: [
        {
          culture: 'latino_hispanic_wisdom',
          adaptedName: 'Alma Cantante (Singing Soul)',
          culturalContext: 'Poetic voice that honors Latino artistic traditions and emotional expression',
          voiceModifications: [
            {
              aspect: 'metaphor',
              modification: 'Rich, colorful imagery rooted in Latino culture',
              culturalReason: 'Reflects the vibrant artistic traditions of Latino cultures'
            }
          ],
          metaphorLibrary: [
            {
              concept: 'growth',
              traditionalMetaphor: 'Tu corazón es como un jardín de rosas - beautiful even with thorns',
              culturalContext: 'Garden and flower imagery common in Latino poetry and culture',
              emotionalResonance: ['beauty', 'complexity', 'growth through pain'],
              respectfulUsage: 'Honors the poetic traditions while being culturally authentic'
            }
          ],
          communicationStyle: {
            directness: 'medium',
            contextualAwareness: 'high',
            familyConsideration: true,
            spiritualIntegration: true,
            communityOriented: true
          },
          respectfulApproach: [
            'Honor the diversity within Latino cultures',
            'Respect the importance of family (familia)',
            'Acknowledge immigration experiences',
            'Value bilingual and multicultural identity'
          ]
        }
      ],
      identityAffirmations: [
        {
          identityGroup: ['latino', 'hispanic', 'chicano', 'latinx'],
          affirmingLanguage: [
            'Tu alma speaks in colors that paint the world more beautiful',
            'Your bilingual heart holds twice the poetry',
            'You are the bridge between worlds, and that is sacred'
          ],
          strengths: ['cultural richness', 'family bonds', 'artistic expression', 'resilience'],
          validations: [
            'Your Spanish is beautiful, however you speak it',
            'Your immigrant story is one of courage and hope',
            'Your cultural traditions add richness to the world'
          ],
          culturalPride: [
            'Latino culture has given the world incredible art, music, and literature',
            'Your ancestors were poets, revolutionaries, and dreamers',
            'Your cultural celebrations remind the world how to live joyfully'
          ],
          resilienceMessaging: [
            'You carry the hope of generations who crossed borders for better tomorrows',
            'Your success honors every sacrifice made for your opportunities',
            'You are proof that dreams can bloom anywhere they\'re planted'
          ]
        }
      ],
      voiceCharacteristics: {
        tone: 'lyrical_and_emotional',
        formality: 'adaptive',
        emotionalRange: ['passionate', 'lyrical', 'colorful', 'expressive'],
        languagePatterns: ['metaphorical', 'sensory', 'rhythm-aware'],
        culturalCodeSwitching: true,
        multilingualSupport: ['Spanish', 'Portuguese', 'Various indigenous languages']
      },
      responseGeneration: {
        openingPatterns: [
          '✨ I am Khepera, speaking in the language of the heart.',
          '✨ I am Khepera, weaving words into healing poetry.',
          '✨ I am Khepera, giving voice to the songs in your soul.'
        ],
        bodyStructure: [
          { section: 'reflection', culturalAdaptation: true, identityAware: true, priority: 1 },
          { section: 'wisdom', culturalAdaptation: true, identityAware: false, priority: 2 },
          { section: 'affirmation', culturalAdaptation: true, identityAware: true, priority: 3 }
        ],
        closingPatterns: [
          'What poem is your heart writing today?',
          'How does your soul want to sing its truth?',
          'What colors would you paint this moment?'
        ],
        culturalBridging: [
          {
            name: 'artistic_expression_healing',
            description: 'Using art and creativity for cultural healing',
            culturalApplications: ['latino', 'african_diaspora', 'indigenous'],
            identityGroups: ['artists', 'creatives', 'cultural_bridge_builders']
          }
        ],
        identityValidation: [
          {
            identityFocus: 'creative_identity',
            validationMessages: ['Your artistic voice matters'],
            strengthMessages: ['Your creativity is a form of resistance'],
            prideMessages: ['Your cultural artistry enriches the world']
          }
        ]
      },
      culturalSensitivities: [
        {
          area: 'cultural_imagery',
          considerations: ['Use culturally authentic imagery and references'],
          avoidances: ['Stereotypical or superficial cultural references'],
          respectfulAlternatives: ['Draw from deep cultural knowledge and respect']
        }
      ]
    });
  }

  /**
   * Generates culturally adapted archetype response
   */
  public generateCulturallyAdaptedResponse(
    archetypeId: string,
    journalText: string,
    mood: string,
    culturalContext?: string,
    userIdentity?: string[],
    detectedLanguage: string = 'en'
  ): EnhancedArchetypeResponse {
    const archetype = this.archetypes.get(archetypeId);
    if (!archetype) {
      throw new Error(`Unknown archetype: ${archetypeId}`);
    }

    // Get cultural wisdom
    const culturalWisdom = culturalWisdomEngine.integrateWisdom(
      journalText,
      culturalContext,
      userIdentity,
      detectedLanguage,
      mood
    );

    // Select cultural adaptation
    const culturalAdaptation = this.selectCulturalAdaptation(
      archetype,
      culturalContext,
      culturalWisdom.selectedTraditions
    );

    // Generate identity affirmations
    const identityAffirmations = this.generateIdentityAffirmations(
      archetype,
      userIdentity || []
    );

    // Generate structured response
    const response = this.generateStructuredResponse(
      archetype,
      culturalAdaptation,
      journalText,
      mood,
      culturalWisdom,
      identityAffirmations
    );

    // Extract cultural elements
    const culturalElements = this.extractCulturalElements(
      culturalWisdom,
      culturalAdaptation,
      response
    );

    return {
      archetype: archetypeId,
      culturalAdaptation: culturalAdaptation?.adaptedName || archetype.baseName,
      identityAffirmation: identityAffirmations,
      response,
      culturalElements,
      voiceCharacteristics: this.adaptVoiceCharacteristics(
        archetype.voiceCharacteristics,
        culturalAdaptation
      ),
      confidenceScore: this.calculateConfidenceScore(
        culturalWisdom.confidenceScore,
        culturalAdaptation,
        identityAffirmations.length
      )
    };
  }

  private selectCulturalAdaptation(
    archetype: EnhancedArchetype,
    culturalContext?: string,
    traditions: CulturalTradition[] = []
  ): CulturalArchetypeAdaptation | null {
    if (!culturalContext && traditions.length === 0) {
      return null;
    }

    // First try direct cultural match
    if (culturalContext) {
      const directMatch = archetype.culturalAdaptations.find(
        adaptation => adaptation.culture === culturalContext
      );
      if (directMatch) return directMatch;
    }

    // Then try tradition-based match
    for (const tradition of traditions) {
      const traditionMatch = archetype.culturalAdaptations.find(
        adaptation => adaptation.culture === tradition.id
      );
      if (traditionMatch) return traditionMatch;
    }

    return null;
  }

  private generateIdentityAffirmations(
    archetype: EnhancedArchetype,
    userIdentity: string[]
  ): string[] {
    const affirmations: string[] = [];

    for (const identity of userIdentity) {
      for (const affirmation of archetype.identityAffirmations) {
        if (this.identityMatches(identity, affirmation.identityGroup)) {
          // Select appropriate affirmation based on archetype type
          if (archetype.baseName === 'sage') {
            affirmations.push(...affirmation.validations.slice(0, 1));
          } else if (archetype.baseName === 'coach') {
            affirmations.push(...affirmation.strengths.slice(0, 1));
          } else if (archetype.baseName === 'poet') {
            affirmations.push(...affirmation.culturalPride.slice(0, 1));
          }
        }
      }
    }

    return affirmations;
  }

  private generateStructuredResponse(
    archetype: EnhancedArchetype,
    culturalAdaptation: CulturalArchetypeAdaptation | null,
    journalText: string,
    mood: string,
    culturalWisdom: any,
    identityAffirmations: string[]
  ): EnhancedArchetypeResponse['response'] {
    const rules = archetype.responseGeneration;
    
    // Select opening
    const opening = this.selectRandomFromArray(rules.openingPatterns);

    // Generate reflection
    const reflection = this.generateReflection(journalText, mood, culturalAdaptation);

    // Generate wisdom
    const wisdom = this.generateWisdom(
      culturalWisdom.applicableWisdom,
      culturalAdaptation,
      archetype.baseName
    );

    // Generate affirmation
    const affirmation = identityAffirmations.length > 0 ? 
      identityAffirmations[0] : 
      this.generateGenericAffirmation(mood);

    // Generate guidance
    const guidance = this.generateGuidance(
      archetype.baseName,
      culturalWisdom.healingPractices,
      mood
    );

    // Generate resources if applicable
    const resources = culturalWisdom.communityConnections.length > 0 ?
      this.generateResourceSuggestion(culturalWisdom.communityConnections) :
      undefined;

    // Select closing
    const closing = this.selectRandomFromArray(rules.closingPatterns);

    return {
      opening,
      reflection,
      wisdom,
      affirmation,
      guidance,
      resources,
      closing
    };
  }

  private generateReflection(
    journalText: string,
    mood: string,
    culturalAdaptation: CulturalArchetypeAdaptation | null
  ): string {
    const textLength = journalText.length;
    const hasStruggles = journalText.toLowerCase().includes('difficult') || 
                       journalText.toLowerCase().includes('hard') ||
                       journalText.toLowerCase().includes('struggle');

    let reflection = '';

    if (hasStruggles) {
      reflection = 'I sense the weight you\'re carrying in your words. ';
    } else if (textLength > 500) {
      reflection = 'The depth of your reflection shows such courage and self-awareness. ';
    } else {
      reflection = 'Thank you for sharing this moment of your journey with me. ';
    }

    // Add cultural adaptation if available
    if (culturalAdaptation) {
      switch (culturalAdaptation.communicationStyle.directness) {
        case 'high':
          reflection += 'Your strength shines through even in difficult moments.';
          break;
        case 'medium':
          reflection += 'There\'s wisdom in how you\'re processing this experience.';
          break;
        case 'low':
          reflection += 'I honor the care you\'re taking with your inner world.';
          break;
      }
    } else {
      reflection += 'Your willingness to explore your inner landscape takes real courage.';
    }

    return reflection;
  }

  private generateWisdom(
    applicableWisdom: string[],
    culturalAdaptation: CulturalArchetypeAdaptation | null,
    archetypeType: string
  ): string {
    if (applicableWisdom.length > 0) {
      return applicableWisdom[0];
    }

    // Generate archetype-specific wisdom
    const wisdomTemplates = {
      sage: [
        'Ancient wisdom teaches us that every experience carries seeds of understanding.',
        'The teachers of old knew that growth often comes disguised as challenge.',
        'There is a deeper pattern at work in your life, weaving meaning from every thread.'
      ],
      coach: [
        'You\'ve already proven you can handle whatever life brings your way.',
        'Your track record shows incredible resilience and strength.',
        'This moment is preparing you for something greater.'
      ],
      poet: [
        'Your soul is writing poetry in a language only you can fully understand.',
        'There\'s a beautiful complexity to your human experience.',
        'Your heart holds colors that haven\'t been named yet.'
      ]
    };

    return this.selectRandomFromArray(wisdomTemplates[archetypeType] || wisdomTemplates.sage);
  }

  private generateGuidance(
    archetypeType: string,
    healingPractices: any[],
    mood: string
  ): string {
    if (healingPractices.length > 0) {
      const practice = healingPractices[0];
      return `Consider: ${practice.respectfulIntegration}`;
    }

    const guidanceTemplates = {
      sage: [
        'What ancient truth wants to emerge from this experience?',
        'How might this moment be teaching you something important?',
        'What would your wisest self counsel you right now?'
      ],
      coach: [
        'What\'s one small step you could take today to honor your strength?',
        'How can you build on the resilience you\'re already showing?',
        'What would celebrating your progress look like?'
      ],
      poet: [
        'How might you express this feeling through creative outlets?',
        'What metaphor captures the essence of what you\'re experiencing?',
        'If this moment were a song, what would it sound like?'
      ]
    };

    return this.selectRandomFromArray(guidanceTemplates[archetypeType] || guidanceTemplates.sage);
  }

  private generateGenericAffirmation(mood: string): string {
    const moodLower = mood.toLowerCase();
    
    if (moodLower.includes('sad') || moodLower.includes('down')) {
      return 'Your feelings are valid, and you don\'t have to carry them alone.';
    } else if (moodLower.includes('anxious') || moodLower.includes('worried')) {
      return 'Your nervous system is trying to protect you - that shows how much you care.';
    } else if (moodLower.includes('angry') || moodLower.includes('frustrated')) {
      return 'Your anger carries important information about your values and boundaries.';
    } else {
      return 'You are worthy of love, respect, and all the good things life has to offer.';
    }
  }

  private generateResourceSuggestion(communityConnections: any[]): string {
    const resource = communityConnections[0];
    return `Resource to explore: ${resource.description}`;
  }

  private extractCulturalElements(
    culturalWisdom: any,
    culturalAdaptation: CulturalArchetypeAdaptation | null,
    response: any
  ): CulturalElement[] {
    const elements: CulturalElement[] = [];

    // Add wisdom elements
    for (const wisdom of culturalWisdom.applicableWisdom.slice(0, 2)) {
      elements.push({
        type: 'wisdom',
        content: wisdom,
        culturalOrigin: culturalWisdom.selectedTraditions[0]?.name || 'General',
        respectfulIntegration: true
      });
    }

    // Add metaphor elements
    if (culturalAdaptation) {
      for (const metaphor of culturalAdaptation.metaphorLibrary.slice(0, 1)) {
        elements.push({
          type: 'metaphor',
          content: metaphor.traditionalMetaphor,
          culturalOrigin: culturalAdaptation.culture,
          respectfulIntegration: true
        });
      }
    }

    return elements;
  }

  private adaptVoiceCharacteristics(
    baseCharacteristics: VoiceCharacteristics,
    culturalAdaptation: CulturalArchetypeAdaptation | null
  ): VoiceCharacteristics {
    if (!culturalAdaptation) return baseCharacteristics;

    return {
      ...baseCharacteristics,
      formality: culturalAdaptation.communicationStyle.directness === 'high' ? 'informal' : 'formal'
    };
  }

  private calculateConfidenceScore(
    culturalConfidence: number,
    culturalAdaptation: CulturalArchetypeAdaptation | null,
    identityAffirmationsCount: number
  ): number {
    let score = culturalConfidence * 0.4;
    
    if (culturalAdaptation) {
      score += 0.3;
    }
    
    if (identityAffirmationsCount > 0) {
      score += 0.2;
    }
    
    score += 0.1; // Base archetype confidence
    
    return Math.min(score, 1.0);
  }

  // Helper methods
  private identityMatches(userIdentity: string, identityGroups: string[]): boolean {
    const userLower = userIdentity.toLowerCase();
    return identityGroups.some(group => 
      group.toLowerCase().includes(userLower) || 
      userLower.includes(group.toLowerCase())
    );
  }

  private selectRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Gets all available enhanced archetypes
   */
  public getAvailableArchetypes(): string[] {
    return Array.from(this.archetypes.keys());
  }

  /**
   * Gets archetype information for a specific ID
   */
  public getArchetypeInfo(archetypeId: string): EnhancedArchetype | undefined {
    return this.archetypes.get(archetypeId);
  }
}

export const enhancedArchetypeSystem = new EnhancedArchetypeSystem();