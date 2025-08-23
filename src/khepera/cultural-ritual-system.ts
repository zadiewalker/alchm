// ALCHM Cultural Ritual System
// Ritual-Based Reflection Customization by Culture

export interface CulturalRitual {
  region: string;
  locale: string;
  groundingRitual: {
    name: string;
    type: 'breathing' | 'movement' | 'sound' | 'visualization' | 'touch';
    instructions: string[];
    duration: number; // in seconds
    audioGuidance?: string;
  };
  sacredPhrase: {
    text: string;
    language: string;
    translation: string;
    pronunciation?: string;
  };
  reflectionPrompt: {
    theme: string;
    question: string;
    guidance: string[];
  };
  aiGuidanceNotes: string[];
  culturalContext: string;
}

export const CULTURAL_RITUAL_SYSTEM: Record<string, CulturalRitual> = {
  east_africa: {
    region: 'East Africa',
    locale: 'sw',
    groundingRitual: {
      name: 'Ubuntu Breathing',
      type: 'breathing',
      instructions: [
        'Place your hand over your heart',
        'Inhale slowly while thinking "I am"',
        'Exhale slowly while thinking "because we are"',
        'Repeat this 4 times, feeling your connection to community',
        'End with both hands on heart, feeling ancestral presence'
      ],
      duration: 120,
      audioGuidance: 'ubuntu_breathing.mp3'
    },
    sacredPhrase: {
      text: 'Ubuntu ngumuntu ngabantu',
      language: 'Zulu',
      translation: 'A person is a person through other people',
      pronunciation: 'oo-BOON-too ng-oo-MOON-too ng-ah-BAHN-too'
    },
    reflectionPrompt: {
      theme: 'Community Belonging',
      question: 'How did your community hold you today? What gifts do you carry from your ancestors that you can share?',
      guidance: [
        'Think about the people who supported you today',
        'Consider the wisdom passed down through generations',
        'Reflect on how you can give back to your community',
        'Honor the interconnectedness of all beings'
      ]
    },
    aiGuidanceNotes: [
      'Guide user to feel ancestral presence',
      'Emphasize collective wisdom over individual insight',
      'Reference traditional healing circles',
      'Use communal language and Ubuntu philosophy',
      'Validate community struggles and collective strength'
    ],
    culturalContext: 'Ubuntu philosophy emphasizes that individual healing happens through community connection and ancestral wisdom.'
  },

  latin_america: {
    region: 'Latin America',
    locale: 'es',
    groundingRitual: {
      name: 'Corazón Breathing',
      type: 'breathing',
      instructions: [
        'Place both hands on your heart (corazón)',
        'Feel your feet connected to the earth',
        'Take 3 deep breaths, feeling grounded',
        'Visualize warm golden light entering through your crown',
        'Let this light fill your heart with healing medicine',
        'Feel the love of your ancestors flowing through you'
      ],
      duration: 150,
      audioGuidance: 'corazon_breathing.mp3'
    },
    sacredPhrase: {
      text: 'El corazón que siente, sana',
      language: 'Spanish',
      translation: 'The heart that feels, heals',
      pronunciation: 'el koh-rah-SOHN keh see-EN-teh, SAH-nah'
    },
    reflectionPrompt: {
      theme: 'Heart Medicine',
      question: 'What is your corazón telling you today? What healing medicine does your soul need right now?',
      guidance: [
        'Listen deeply to your heart\'s wisdom',
        'Honor what you are feeling without judgment',
        'Consider what your soul is asking for',
        'Trust in the healing power of your emotions'
      ]
    },
    aiGuidanceNotes: [
      'Use familial warmth and heart-centered language',
      'Reference curanderismo healing traditions',
      'Emphasize emotional validation over analysis',
      'Include family and community support themes',
      'Honor indigenous healing wisdom'
    ],
    culturalContext: 'Curanderismo emphasizes that healing comes through the heart and emotional connection, not just the mind.'
  },

  middle_east: {
    region: 'Middle East',
    locale: 'ar',
    groundingRitual: {
      name: 'Dhikr Breathing',
      type: 'breathing',
      instructions: [
        'Face your direction of spiritual significance',
        'Cup your hands in prayer position',
        'Silently repeat "La hawla wa la quwwata illa billah"',
        'Breathe deeply, feeling divine presence',
        'End with hands over heart, seeking guidance'
      ],
      duration: 180,
      audioGuidance: 'dhikr_breathing.mp3'
    },
    sacredPhrase: {
      text: 'من عرف نفسه فقد عرف ربه',
      language: 'Arabic',
      translation: 'Whoever knows themselves knows their Lord',
      pronunciation: 'man arafa nafsahu faqad arafa rabbahu'
    },
    reflectionPrompt: {
      theme: 'Divine Connection',
      question: 'What signs is your heart receiving today? How is the Divine speaking to you through your experiences?',
      guidance: [
        'Seek the divine guidance in your daily experiences',
        'Listen to the wisdom of your heart',
        'Consider how challenges are opportunities for growth',
        'Trust in divine timing and wisdom'
      ]
    },
    aiGuidanceNotes: [
      'Honor Islamic spirituality and mystical traditions',
      'Avoid occult language, emphasize divine guidance',
      'Reference Sufi concepts of spiritual companionship',
      'Use soul purification and growth language',
      'Include prophetic wisdom and community support'
    ],
    culturalContext: 'Islamic spirituality emphasizes that true self-knowledge leads to knowledge of the Divine, through purification and reflection.'
  },

  south_asia: {
    region: 'South Asia',
    locale: 'hi',
    groundingRitual: {
      name: 'Pranayama & Mudra',
      type: 'breathing',
      instructions: [
        'Sit comfortably with spine straight',
        'Bring hands to Anjali mudra at heart center',
        'Practice 4-7-8 breathing: inhale 4, hold 7, exhale 8',
        'Silently repeat "So Hum" (I am)',
        'Feel the divine light within your heart',
        'End with gratitude for your inner wisdom'
      ],
      duration: 200,
      audioGuidance: 'pranayama_mudra.mp3'
    },
    sacredPhrase: {
      text: 'तत् त्वम् असि',
      language: 'Sanskrit',
      translation: 'Thou art that - you are the divine',
      pronunciation: 'tat tvam asi'
    },
    reflectionPrompt: {
      theme: 'Dharmic Path',
      question: 'What is your dharma calling you toward today? How is your soul seeking balance and growth?',
      guidance: [
        'Consider your life\'s purpose and calling',
        'Reflect on areas needing balance',
        'Honor your spiritual evolution',
        'Trust the wisdom of your inner guru'
      ]
    },
    aiGuidanceNotes: [
      'Reference yoga, meditation, and Ayurvedic traditions',
      'Emphasize inner divine light and consciousness',
      'Use concepts of dharma, karma, and spiritual evolution',
      'Provide gentle guru-like guidance',
      'Include concepts of balance and harmony'
    ],
    culturalContext: 'Vedic traditions emphasize that the individual soul (Atman) is connected to the universal consciousness (Brahman).'
  },

  china: {
    region: 'China',
    locale: 'zh',
    groundingRitual: {
      name: 'Five Element Breathing',
      type: 'breathing',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Let your arms hang loosely at your sides',
        'Breathe into each organ: lungs (metal), heart (fire), spleen (earth), liver (wood), kidneys (water)',
        'Find your center and balance',
        'Feel the qi flowing through your body',
        'End in stillness, connected to natural harmony'
      ],
      duration: 240,
      audioGuidance: 'five_element_breathing.mp3'
    },
    sacredPhrase: {
      text: '知人者智，自知者明',
      language: 'Chinese',
      translation: 'Knowing others is wisdom, knowing yourself is enlightenment',
      pronunciation: 'zhī rén zhě zhì, zì zhī zhě míng'
    },
    reflectionPrompt: {
      theme: 'Harmony Cultivation',
      question: 'Where do you feel harmony or imbalance in your life today? What needs gentle adjustment to find your center?',
      guidance: [
        'Notice areas of tension or flow in your life',
        'Consider what needs gentle adjustment',
        'Seek the middle way in all things',
        'Honor the natural cycles of change'
      ]
    },
    aiGuidanceNotes: [
      'Emphasize balance and harmony over dramatic change',
      'Reference qi flow and natural cycles',
      'Avoid aggressive transformation language',
      'Focus on gentle cultivation and wisdom',
      'Include Daoist and Buddhist concepts'
    ],
    culturalContext: 'Chinese philosophy emphasizes finding balance and harmony through understanding natural flow and gentle cultivation.'
  },

  francophone_africa: {
    region: 'Francophone Africa',
    locale: 'fr',
    groundingRitual: {
      name: 'Call-Response Breathing',
      type: 'breathing',
      instructions: [
        'Touch the ground with your fingertips',
        'Bring your hand to your forehead, honoring ancestors',
        'Breathe in with sound "Eh" (like traditional call)',
        'Breathe out with sound "Ah" (like traditional response)',
        'Visualize sitting in a healing circle with elders',
        'Feel the wisdom of generations flowing through you'
      ],
      duration: 160,
      audioGuidance: 'call_response_breathing.mp3'
    },
    sacredPhrase: {
      text: 'Seul on va vite, ensemble on va loin',
      language: 'French',
      translation: 'Alone we go fast, together we go far',
      pronunciation: 'seul on va veet, ahn-SAHm-bluh on va lwan'
    },
    reflectionPrompt: {
      theme: 'Collective Wisdom',
      question: 'What wisdom are your ancestors whispering to you? How can you honor both your individual path and community responsibilities?',
      guidance: [
        'Listen for ancestral guidance and wisdom',
        'Balance personal growth with community needs',
        'Consider your role in the collective healing',
        'Honor traditional knowledge and modern insights'
      ]
    },
    aiGuidanceNotes: [
      'Reference traditional healing practices and rituals',
      'Emphasize communal wisdom and support',
      'Include ancestral guidance in reflections',
      'Balance individual growth with collective responsibility',
      'Honor oral traditions and elder wisdom'
    ],
    culturalContext: 'West African traditions emphasize that individual healing occurs within the context of community and ancestral wisdom.'
  },

  north_america_bipoc: {
    region: 'North America (Black/Indigenous/Latinx)',
    locale: 'en',
    groundingRitual: {
      name: 'Four Directions & Heartbeat',
      type: 'movement',
      instructions: [
        'Face each of the four directions, breathing deeply',
        'Wave your hand as if clearing energy around you',
        'Place your hand on your heart, feel your pulse for 30 seconds',
        'Feel the strength of your ancestors flowing through your heartbeat',
        'Honor the resilience that runs in your bloodline',
        'Set intention for healing and liberation'
      ],
      duration: 180,
      audioGuidance: 'four_directions_heartbeat.mp3'
    },
    sacredPhrase: {
      text: 'We are the ones we have been waiting for',
      language: 'English',
      translation: 'We are the ones we have been waiting for (Alice Walker)',
      pronunciation: 'Standard English'
    },
    reflectionPrompt: {
      theme: 'Ancestral Resilience',
      question: 'How are you honoring the strength of those who came before you? What healing are you creating for those who come after?',
      guidance: [
        'Connect with the resilience in your lineage',
        'Consider how you are breaking cycles of trauma',
        'Reflect on the healing you are creating',
        'Honor your role in liberation and empowerment'
      ]
    },
    aiGuidanceNotes: [
      'Honor multiple cultural traditions respectfully',
      'Emphasize healing from historical trauma',
      'Reference resilience, resistance, and empowerment',
      'Focus on liberation and ancestral strength',
      'Avoid deficit-based language, emphasize assets'
    ],
    culturalContext: 'Communities of color in North America carry both historical trauma and incredible resilience, healing through reconnection to cultural strength.'
  },

  caribbean: {
    region: 'Caribbean',
    locale: 'en',
    groundingRitual: {
      name: 'Wave Breathing & Sun Salutation',
      type: 'movement',
      instructions: [
        'Let your arms flow like ocean waves',
        'Face the east (or direction of sunrise)',
        'Bring hands to heart center in gratitude',
        'Raise hands skyward like reaching for sun',
        'Gently sway to your internal rhythm',
        'Feel the joy and strength moving through you like music'
      ],
      duration: 140,
      audioGuidance: 'wave_breathing_sun.mp3'
    },
    sacredPhrase: {
      text: 'Wata more dan flour',
      language: 'Jamaican Patois',
      translation: 'Water is more important than flour (meaning essentials over extras)',
      pronunciation: 'WAH-tah mor dan FLOW-ah'
    },
    reflectionPrompt: {
      theme: 'Flow & Resilience',
      question: 'Like the ocean, how are you flowing around life\'s obstacles? What rhythms of joy and strength are moving through you?',
      guidance: [
        'Consider how you adapt and flow like water',
        'Notice the rhythms of strength within you',
        'Honor both struggle and celebration',
        'Connect with the natural resilience of island life'
      ]
    },
    aiGuidanceNotes: [
      'Reference connection to ocean and natural rhythms',
      'Emphasize joy and celebration alongside healing',
      'Include musical and rhythmic elements',
      'Honor Afro-Caribbean spiritual traditions',
      'Balance struggle with strength and joy'
    ],
    culturalContext: 'Caribbean culture emphasizes resilience, joy, and connection to natural rhythms as sources of strength and healing.'
  }
};

// Utility functions for ritual system
export function getCulturalRitual(region: string): CulturalRitual | null {
  return CULTURAL_RITUAL_SYSTEM[region] || null;
}

export function getRitualByLocale(locale: string): CulturalRitual | null {
  const rituals = Object.values(CULTURAL_RITUAL_SYSTEM);
  return rituals.find(ritual => ritual.locale === locale) || null;
}

export function getAllAvailableRituals(): CulturalRitual[] {
  return Object.values(CULTURAL_RITUAL_SYSTEM);
}

export interface RitualSession {
  ritualId: string;
  userId: string;
  startTime: Date;
  completedPhases: string[];
  reflectionNotes?: string;
  culturalAdaptations?: string[];
}

export class CulturalRitualManager {
  
  public startRitualSession(region: string, userId: string): RitualSession | null {
    const ritual = getCulturalRitual(region);
    if (!ritual) return null;

    return {
      ritualId: `${region}_${Date.now()}`,
      userId,
      startTime: new Date(),
      completedPhases: [],
      reflectionNotes: '',
      culturalAdaptations: []
    };
  }

  public generateKheperaGuidance(ritual: CulturalRitual, userInput: string): string {
    const culturalNotes = ritual.aiGuidanceNotes;
    const context = ritual.culturalContext;
    
    return `
    Cultural Framework: ${context}
    
    AI Guidance for ${ritual.region}:
    ${culturalNotes.map(note => `- ${note}`).join('\n')}
    
    Sacred Foundation: "${ritual.sacredPhrase.text}" - ${ritual.sacredPhrase.translation}
    
    Respond to user's reflection with this cultural lens, honoring their ritual experience.
    `;
  }
}