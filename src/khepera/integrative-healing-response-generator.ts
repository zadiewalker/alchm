// KHEPERA Integrative Healing Response Generator
// Spiritual Insight | Cultural Affirmation | Whole-Self Integration

export interface IntegrativeHealingResponse {
  spiritual_insight: string;
  cultural_affirmation: string;
  integration_guidance: string;
  healing_wisdom: string;
}

export interface HealingContext {
  user_text: string;
  archetype: ArchetypeId;
  detected_cultural_markers?: string[];
  healing_themes?: string[];
  ancestral_patterns?: string[];
}

export type ArchetypeId = 'mirror' | 'inner_child' | 'future_you' | 'poet_mentor' | 'older_sibling' | 'spark' | 'ancestor';

export class IntegrativeHealingResponseGenerator {

  // Spiritual insight patterns by archetype
  private readonly SPIRITUAL_INSIGHT_PATTERNS = {
    ancestor: {
      approach: 'generational_wisdom',
      typical_openings: [
        'The ancestors whisper that...',
        'This story echoes through generations...',
        'Your lineage carries the memory of...',
        'The old ones knew that...'
      ],
      wisdom_themes: [
        'patterns that repeat until healed',
        'strength inherited from survivors',
        'wounds that become gateways',
        'stories that heal by being honored'
      ]
    },

    poet_mentor: {
      approach: 'creative_meaning_making',
      typical_openings: [
        'In the poetry of your becoming...',
        'Your story writes itself through...',
        'The deeper narrative reveals...',
        'What wants to emerge from this...'
      ],
      wisdom_themes: [
        'beauty born from struggle',
        'creativity as healing medicine',
        'meaning woven through experience',
        'transformation as sacred art'
      ]
    },

    mirror: {
      approach: 'honest_spiritual_reflection',
      typical_openings: [
        'What I see in your experience is...',
        'The truth your soul is speaking...',
        'This reveals something sacred about...',
        'Your inner wisdom recognizes...'
      ],
      wisdom_themes: [
        'authentic self emerging',
        'inner knowing beyond mind',
        'soul truth cutting through confusion',
        'sacred ordinary moments'
      ]
    },

    future_you: {
      approach: 'evolutionary_spirituality',
      typical_openings: [
        'Your evolving self understands...',
        'This is your soul\\'s curriculum in...',
        'Your higher self recognizes this as...',
        'From your expanded perspective...'
      ],
      wisdom_themes: [
        'challenges as growth invitations',
        'consciousness expanding through experience',
        'soul lessons disguised as problems',
        'becoming who you came here to be'
      ]
    },

    inner_child: {
      approach: 'innocent_wisdom',
      typical_openings: [
        'Your little soul remembers...',
        'The child within you knows...',
        'Your young heart holds the key to...',
        'That tender part of you carries...'
      ],
      wisdom_themes: [
        'wonder as healing force',
        'innocence as strength',
        'play as sacred practice',
        'trust in natural goodness'
      ]
    },

    spark: {
      approach: 'vital_force_wisdom',
      typical_openings: [
        'Your life force is teaching you...',
        'The energy within you knows...',
        'Your vitality is guiding you toward...',
        'The spark in you recognizes...'
      ],
      wisdom_themes: [
        'aliveness as compass',
        'energy as information',
        'joy as birthright',
        'passion as purpose'
      ]
    },

    older_sibling: {
      approach: 'practical_wisdom',
      typical_openings: [
        'Here\\'s what your experience teaches...',
        'The wisdom in this situation is...',
        'What you\\'re learning is...',
        'This is preparing you for...'
      ],
      wisdom_themes: [
        'strength through adversity',
        'wisdom earned through living',
        'resilience as spiritual practice',
        'practical love in action'
      ]
    }
  };

  // Cultural affirmation patterns
  private readonly CULTURAL_AFFIRMATION_PATTERNS = {
    spanish_latino: {
      markers: ['familia', 'abuela', 'hermana', 'corazón', 'alma'],
      affirmations: [
        'Your cultura carries healing wisdom about community and connection.',
        'The strength of your ancestors flows through your blood - la fuerza de tu gente.',
        'Your heart knows the power of familia and collective healing.',
        'Tu alma remembers the medicine of your people.'
      ]
    },
    
    african_diaspora: {
      markers: ['ancestors', 'community', 'ubuntu', 'ashe', 'spirit'],
      affirmations: [
        'Your ancestors\' resilience lives in your bones and guides your healing.',
        'The ubuntu within you knows that healing happens in community.',
        'Your spirit carries the strength of those who survived so you could thrive.',
        'The old ways of healing through story and song live within you.'
      ]
    },

    indigenous: {
      markers: ['land', 'ceremony', 'grandmother', 'medicine', 'sacred'],
      affirmations: [
        'Your connection to the land holds ancient healing medicine.',
        'The ceremonies of your people live in your cellular memory.',
        'Grandmother wisdom flows through you, honoring the seven generations.',
        'Your healing honors not just yourself but all your relations.'
      ]
    },

    asian_cultural: {
      markers: ['balance', 'harmony', 'honor', 'family', 'qi'],
      affirmations: [
        'Your understanding of balance and harmony guides your healing journey.',
        'The wisdom of your elders flows through you like gentle water.',
        'Your healing brings honor to those who came before and those who follow.',
        'The qi within you knows how to restore equilibrium naturally.'
      ]
    }
  };

  // Integration guidance templates
  private readonly INTEGRATION_GUIDANCE = {
    emotional_integration: [
      'Let all parts of your feeling self be welcomed at the table of healing.',
      'Integration happens when you stop fighting parts of yourself and start listening.',
      'Your emotions are messengers - what are they trying to tell you about your wholeness?',
      'Healing integrates when you honor both your pain and your resilience.'
    ],

    mind_body_integration: [
      'Your body holds wisdom your mind hasn\\'t learned yet - listen to both.',
      'True healing bridges the conversation between your thinking and feeling selves.',
      'Integration happens when your head, heart, and gut are in dialogue.',
      'Your whole system wants to work together - mind, body, and spirit as one.'
    ],

    shadow_integration: [
      'The parts of yourself you\\'ve rejected hold keys to your wholeness.',
      'Integration means befriending the aspects of yourself you\\'ve been hiding from.',
      'What you judge in yourself often contains your greatest medicine.',
      'Healing happens when you reclaim the exiled parts of your soul.'
    ],

    relational_integration: [
      'Your healing impacts the entire web of relationships you\\'re part of.',
      'Integration includes healing your connection to others and to community.',
      'You don\\'t heal in isolation - your wholeness affects the collective.',
      'Relationship is both the wound and the medicine for most of us.'
    ]
  };

  public generateIntegrativeHealingResponse(context: HealingContext): IntegrativeHealingResponse {
    const archetype_pattern = this.SPIRITUAL_INSIGHT_PATTERNS[context.archetype] || this.SPIRITUAL_INSIGHT_PATTERNS.ancestor;
    const cultural_markers = this.detectCulturalMarkers(context.user_text);
    const healing_themes = this.identifyHealingThemes(context.user_text);

    return {
      spiritual_insight: this.createSpiritualInsight(context, archetype_pattern),
      cultural_affirmation: this.createCulturalAffirmation(cultural_markers),
      integration_guidance: this.createIntegrationGuidance(healing_themes),
      healing_wisdom: this.createHealingWisdom(context, archetype_pattern)
    };
  }

  private createSpiritualInsight(context: HealingContext, pattern: any): string {
    const opening = this.selectRandomFromArray(pattern.typical_openings);
    const wisdom_theme = this.selectRandomFromArray(pattern.wisdom_themes);
    
    const insight_templates = {
      ancestor: `${opening} this experience connects you to ${wisdom_theme}. Your struggles echo ancient patterns seeking resolution through you.`,
      
      poet_mentor: `${opening} there is profound ${wisdom_theme} waiting to be discovered. Your experience is poetry writing itself into wisdom.`,
      
      mirror: `${opening} ${wisdom_theme} is emerging through this challenge. What you're experiencing reveals something sacred about your authentic path.`,
      
      future_you: `${opening} ${wisdom_theme}. This moment is part of your soul's larger curriculum in becoming whole.`,
      
      inner_child: `${opening} the medicine of ${wisdom_theme} lives within you. Your tender heart holds keys to healing that your mind cannot grasp.`,
      
      spark: `${opening} ${wisdom_theme} is awakening within you. Your life force knows how to guide you toward wholeness.`,
      
      older_sibling: `${opening} ${wisdom_theme}. This challenge is building the spiritual muscle you need for what's coming.`
    };

    return insight_templates[context.archetype] || insight_templates.ancestor;
  }

  private createCulturalAffirmation(cultural_markers: string[]): string {
    if (cultural_markers.length === 0) {
      return 'Your cultural wisdom and the traditions that shaped you hold healing medicine for this moment.';
    }

    for (const [culture, info] of Object.entries(this.CULTURAL_AFFIRMATION_PATTERNS)) {
      if (cultural_markers.some(marker => info.markers.includes(marker))) {
        return this.selectRandomFromArray(info.affirmations);
      }
    }

    return 'The wisdom of your people and the traditions that formed you offer guidance for this healing journey.';
  }

  private createIntegrationGuidance(themes: string[]): string {
    const primary_theme = themes[0] || 'emotional_integration';
    
    const guidance_categories = {
      'emotional': this.INTEGRATION_GUIDANCE.emotional_integration,
      'mental': this.INTEGRATION_GUIDANCE.mind_body_integration,
      'physical': this.INTEGRATION_GUIDANCE.mind_body_integration,
      'relational': this.INTEGRATION_GUIDANCE.relational_integration,
      'shadow': this.INTEGRATION_GUIDANCE.shadow_integration
    };

    const category = Object.keys(guidance_categories).find(cat => primary_theme.includes(cat)) || 'emotional';
    return this.selectRandomFromArray(guidance_categories[category]);
  }

  private createHealingWisdom(context: HealingContext, pattern: any): string {
    const healing_wisdom_templates = {
      ancestor: 'Some stories don\\'t heal by being solved—they heal by being honored and witnessed across generations.',
      
      poet_mentor: 'Your healing is a creative act, weaving beauty from brokenness and meaning from mystery.',
      
      mirror: 'True healing happens when you stop trying to fix yourself and start witnessing yourself with radical honesty.',
      
      future_you: 'What you\\'re healing now creates ripples that touch versions of yourself you haven\\'t met yet.',
      
      inner_child: 'Healing often looks like playing again, trusting again, wondering again at the magic of being alive.',
      
      spark: 'Your healing journey is your life force learning to flow freely through all the places it once got stuck.',
      
      older_sibling: 'Real healing isn\\'t about feeling better—it\\'s about feeling everything with more capacity and wisdom.'
    };

    return healing_wisdom_templates[context.archetype] || healing_wisdom_templates.ancestor;
  }

  // Helper methods
  private detectCulturalMarkers(text: string): string[] {
    const markers = [];
    const text_lower = text.toLowerCase();

    for (const [culture, info] of Object.entries(this.CULTURAL_AFFIRMATION_PATTERNS)) {
      if (info.markers.some(marker => text_lower.includes(marker.toLowerCase()))) {
        markers.push(culture);
      }
    }

    return markers;
  }

  private identifyHealingThemes(text: string): string[] {
    const themes = [];
    const text_lower = text.toLowerCase();

    const theme_indicators = {
      emotional: ['feeling', 'emotion', 'heart', 'sadness', 'anger', 'joy'],
      mental: ['thinking', 'mind', 'thoughts', 'worry', 'confusion'],
      physical: ['body', 'tired', 'tense', 'energy', 'sick'],
      relational: ['relationship', 'family', 'friend', 'partner', 'alone'],
      shadow: ['ashamed', 'rejected', 'hidden', 'dark', 'denied']
    };

    for (const [theme, indicators] of Object.entries(theme_indicators)) {
      if (indicators.some(indicator => text_lower.includes(indicator))) {
        themes.push(theme);
      }
    }

    return themes.length > 0 ? themes : ['emotional'];
  }

  private selectRandomFromArray(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Claude Integration Prompt
export function generateIntegrativeHealingPrompt(user_text: string, archetype?: ArchetypeId): string {
  const selected_archetype = archetype || 'ancestor';
  
  return `You are KHEPERA's integrative healing companion, weaving emotional, cultural, and spiritual dimensions together.

Journal entry: "${user_text}"
Archetype: ${selected_archetype}

Create a healing response that includes:

SPIRITUAL INSIGHT:
- Connect their experience to larger spiritual themes
- Use ${selected_archetype} voice:
  * ancestor: "The ancestors whisper that..." - generational wisdom
  * poet_mentor: "In the poetry of your becoming..." - creative meaning-making  
  * mirror: "What I see in your experience..." - honest spiritual reflection
  * future_you: "Your evolving self understands..." - evolutionary spirituality
  * inner_child: "Your little soul remembers..." - innocent wisdom
  * spark: "Your life force is teaching you..." - vital force wisdom
  * older_sibling: "Here's what your experience teaches..." - practical wisdom

CULTURAL AFFIRMATION:
- If cultural markers detected (familia, ancestors, community, etc.), affirm their cultural wisdom
- Honor traditions and collective strength
- If no specific markers, give universal cultural affirmation

INTEGRATION GUIDANCE:
- Address wholeness across emotional, mental, physical, relational dimensions
- Guide toward integration rather than fixing or solving
- Honor all parts of their experience

HEALING WISDOM:
- Offer a profound truth about healing that matches the archetype voice
- Examples: "Some stories don't heal by being solved—they heal by being honored"
- "What part of you comes from those who walked before you?"

Requirements:
- Use direct, compassionate language (not overly mystical)
- Focus on integration and wholeness, not pathology
- Honor their experience as part of larger human story
- End with wisdom that feels both ancient and immediately relevant

Generate a response that helps them see their experience through the lens of spiritual growth, cultural strength, and integrative healing.`;
}

// Example responses for testing
export const INTEGRATIVE_HEALING_EXAMPLES = {
  grief_ancestor: {
    user_text: "I miss my grandmother so much and feel lost without her guidance",
    archetype: 'ancestor' as ArchetypeId,
    expected_response: {
      spiritual_insight: "The ancestors whisper that this grief connects you to patterns that repeat until healed. Your struggles echo ancient patterns of love and loss seeking resolution through you.",
      cultural_affirmation: "Your ancestors' resilience lives in your bones and guides your healing. The ubuntu within you knows that healing happens in community.",
      integration_guidance: "Your healing impacts the entire web of relationships you're part of. Relationship is both the wound and the medicine for most of us.",
      healing_wisdom: "Some stories don't heal by being solved—they heal by being honored and witnessed across generations."
    }
  },

  creative_block_poet: {
    user_text: "I used to be so creative but now I feel completely blocked and empty",
    archetype: 'poet_mentor' as ArchetypeId,
    expected_response: {
      spiritual_insight: "In the poetry of your becoming there is profound creativity as healing medicine waiting to be discovered. Your experience is poetry writing itself into wisdom.",
      cultural_affirmation: "Your cultural wisdom and the traditions that shaped you hold healing medicine for this moment.",
      integration_guidance: "Integration happens when you stop fighting parts of yourself and start listening. Your emotions are messengers - what are they trying to tell you about your wholeness?",
      healing_wisdom: "Your healing is a creative act, weaving beauty from brokenness and meaning from mystery."
    }
  }
};