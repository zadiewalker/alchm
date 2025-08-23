// ALCHM Analog Reflection Prompts
// Non-AI journaling prompts for users who prefer human-centered reflection

export interface AnalogPrompt {
  id: string;
  category: AnalogPromptCategory;
  prompt: string;
  culturalContext?: string[];
  traumaInformed: boolean;
  timeEstimate: string;
  difficulty: 'gentle' | 'moderate' | 'deep';
  supportingElements?: {
    breathingExercise?: string;
    movementSuggestion?: string;
    grounding?: string;
  };
}

export type AnalogPromptCategory = 
  | 'daily_check_in'
  | 'emotional_awareness'
  | 'strength_recognition'
  | 'creative_expression'
  | 'cultural_connection'
  | 'healing_journey'
  | 'gratitude_practice'
  | 'future_visioning'
  | 'relationship_reflection'
  | 'spiritual_practice';

// Comprehensive analog reflection prompt library
export const ANALOG_REFLECTION_PROMPTS: Record<AnalogPromptCategory, AnalogPrompt[]> = {
  daily_check_in: [
    {
      id: 'daily_01',
      category: 'daily_check_in',
      prompt: 'How did your body speak to you today? What sensations, tensions, or ease did you notice?',
      traumaInformed: true,
      timeEstimate: '5-10 minutes',
      difficulty: 'gentle',
      supportingElements: {
        breathingExercise: 'Take three deep breaths, noticing where you feel the breath in your body',
        grounding: 'Feel your feet on the ground or your body in the chair'
      }
    },
    {
      id: 'daily_02',
      category: 'daily_check_in',
      prompt: 'What small moments brought you peace today, even if they lasted only seconds?',
      traumaInformed: true,
      timeEstimate: '5-10 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'daily_03',
      category: 'daily_check_in',
      prompt: 'If you could tell your younger self about today, what wisdom would you share?',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'daily_04',
      category: 'daily_check_in',
      prompt: 'What did you survive today? Honor both the big and small acts of resilience.',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'daily_05',
      category: 'daily_check_in',
      prompt: 'What colors, sounds, or textures caught your attention today? How did they affect your mood?',
      traumaInformed: true,
      timeEstimate: '5-10 minutes',
      difficulty: 'gentle'
    }
  ],

  emotional_awareness: [
    {
      id: 'emotion_01',
      category: 'emotional_awareness',
      prompt: 'Draw or describe the shape, color, and texture of your current emotion. Give it a name if you wish.',
      traumaInformed: true,
      timeEstimate: '10-20 minutes',
      difficulty: 'gentle',
      supportingElements: {
        grounding: 'Remember: emotions are visitors, not permanent residents'
      }
    },
    {
      id: 'emotion_02',
      category: 'emotional_awareness',
      prompt: 'Write a gentle letter to your current emotion. What does it need from you?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'emotion_03',
      category: 'emotional_awareness',
      prompt: 'If your emotions were weather, what would the forecast be right now? What season are you moving toward?',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'emotion_04',
      category: 'emotional_awareness',
      prompt: 'What emotions feel safe to feel right now? What emotions feel too big or scary?',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate',
      supportingElements: {
        grounding: 'All emotions are valid. You get to choose which ones to explore today.'
      }
    },
    {
      id: 'emotion_05',
      category: 'emotional_awareness',
      prompt: 'Describe an emotion using only metaphors from nature - no clinical or diagnostic words.',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'moderate'
    }
  ],

  strength_recognition: [
    {
      id: 'strength_01',
      category: 'strength_recognition',
      prompt: 'List three ways you showed courage today, including the tiny, quiet acts of bravery.',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'strength_02',
      category: 'strength_recognition',
      prompt: 'What survival skills have served you well in your life? How are they gifts, even if they once caused pain?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'deep'
    },
    {
      id: 'strength_03',
      category: 'strength_recognition',
      prompt: 'Write about a time you helped someone else through difficulty. What strengths did you use?',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'strength_04',
      category: 'strength_recognition',
      prompt: 'How did you care for yourself today, even in small ways? What does this say about your wisdom?',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'strength_05',
      category: 'strength_recognition',
      prompt: 'What would someone who loves you say about your strengths? Can you see yourself through their eyes?',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate'
    }
  ],

  creative_expression: [
    {
      id: 'creative_01',
      category: 'creative_expression',
      prompt: 'Create a poem using only words that describe how resilience feels in your body.',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'creative_02',
      category: 'creative_expression',
      prompt: 'Design a coat of arms for your healing journey. What symbols represent your path?',
      traumaInformed: true,
      timeEstimate: '20-30 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'creative_03',
      category: 'creative_expression',
      prompt: 'Write a story about a character who has your exact strengths facing a challenge.',
      traumaInformed: true,
      timeEstimate: '20-30 minutes',
      difficulty: 'deep'
    },
    {
      id: 'creative_04',
      category: 'creative_expression',
      prompt: 'Create a recipe for emotional healing. What ingredients (activities, people, practices) would you include?',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'creative_05',
      category: 'creative_expression',
      prompt: 'If your inner voice could paint, what colors and brushstrokes would it use today?',
      traumaInformed: true,
      timeEstimate: '10-20 minutes',
      difficulty: 'gentle'
    }
  ],

  cultural_connection: [
    {
      id: 'cultural_01',
      category: 'cultural_connection',
      prompt: 'What wisdom from your cultural background guides you during difficult times?',
      culturalContext: ['all'],
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'cultural_02',
      category: 'cultural_connection',
      prompt: 'Describe a tradition, food, or practice from your heritage that brings you comfort.',
      culturalContext: ['all'],
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'cultural_03',
      category: 'cultural_connection',
      prompt: 'What stories or sayings did your elders share that still guide you today?',
      culturalContext: ['all'],
      traumaInformed: true,
      timeEstimate: '20-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'cultural_04',
      category: 'cultural_connection',
      prompt: 'How do you honor your ancestors in your daily life, even in small ways?',
      culturalContext: ['all'],
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'cultural_05',
      category: 'cultural_connection',
      prompt: 'What aspects of your cultural identity feel like sources of strength and pride?',
      culturalContext: ['all'],
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    }
  ],

  healing_journey: [
    {
      id: 'healing_01',
      category: 'healing_journey',
      prompt: 'Imagine your healing as a river. Where are you in that river right now? What do you see ahead?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'healing_02',
      category: 'healing_journey',
      prompt: 'Write a letter of appreciation to your younger self for surviving everything they went through.',
      traumaInformed: true,
      timeEstimate: '20-30 minutes',
      difficulty: 'deep'
    },
    {
      id: 'healing_03',
      category: 'healing_journey',
      prompt: 'What growth have you noticed in yourself over the past year, even if it feels small?',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'healing_04',
      category: 'healing_journey',
      prompt: 'Describe a moment when you felt truly held and supported. How can you offer that feeling to yourself?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'healing_05',
      category: 'healing_journey',
      prompt: 'What does "safety" feel like in your body? How can you cultivate more of that feeling?',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate',
      supportingElements: {
        grounding: 'Notice where you feel most at peace in your body right now'
      }
    }
  ],

  gratitude_practice: [
    {
      id: 'gratitude_01',
      category: 'gratitude_practice',
      prompt: 'Name three things your body did well today, from breathing to moving to healing.',
      traumaInformed: true,
      timeEstimate: '5-10 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'gratitude_02',
      category: 'gratitude_practice',
      prompt: 'What unexpected kindness did you encounter today, even from strangers?',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'gratitude_03',
      category: 'gratitude_practice',
      prompt: 'Appreciate a difficult experience for what it taught you about your own strength.',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'gratitude_04',
      category: 'gratitude_practice',
      prompt: 'What support systems, however small, are available to you right now?',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'gratitude_05',
      category: 'gratitude_practice',
      prompt: 'Write about something in nature that brought you wonder or peace recently.',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'gentle'
    }
  ],

  future_visioning: [
    {
      id: 'future_01',
      category: 'future_visioning',
      prompt: 'Imagine yourself one year from now, feeling more healed. What does that version of you do differently?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'future_02',
      category: 'future_visioning',
      prompt: 'What dreams feel worth nurturing right now, even if they seem impossible?',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'future_03',
      category: 'future_visioning',
      prompt: 'Describe the kind of environment where you feel most creative and alive.',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'future_04',
      category: 'future_visioning',
      prompt: 'What small step toward a goal could you take this week that honors your current capacity?',
      traumaInformed: true,
      timeEstimate: '10-15 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'future_05',
      category: 'future_visioning',
      prompt: 'How do you want to contribute to your community\'s healing and wellbeing?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    }
  ],

  relationship_reflection: [
    {
      id: 'relation_01',
      category: 'relationship_reflection',
      prompt: 'Describe the qualities of relationships where you feel most authentically yourself.',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'relation_02',
      category: 'relationship_reflection',
      prompt: 'What boundaries do you need to feel safe and respected in relationships?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'relation_03',
      category: 'relationship_reflection',
      prompt: 'Write about someone who believes in you. How does their faith in you change how you see yourself?',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'relation_04',
      category: 'relationship_reflection',
      prompt: 'How can you be a source of healing and support for others while honoring your own needs?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'relation_05',
      category: 'relationship_reflection',
      prompt: 'What patterns in relationships are you ready to change? What would you like to keep?',
      traumaInformed: true,
      timeEstimate: '20-25 minutes',
      difficulty: 'deep'
    }
  ],

  spiritual_practice: [
    {
      id: 'spiritual_01',
      category: 'spiritual_practice',
      prompt: 'What gives your life meaning and purpose, even during difficult times?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'spiritual_02',
      category: 'spiritual_practice',
      prompt: 'Describe a moment when you felt connected to something larger than yourself.',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'spiritual_03',
      category: 'spiritual_practice',
      prompt: 'What practices help you feel grounded and centered? How can you honor them more?',
      traumaInformed: true,
      timeEstimate: '15-20 minutes',
      difficulty: 'gentle'
    },
    {
      id: 'spiritual_04',
      category: 'spiritual_practice',
      prompt: 'If you could offer a prayer or intention for your healing journey, what would it be?',
      traumaInformed: true,
      timeEstimate: '10-20 minutes',
      difficulty: 'moderate'
    },
    {
      id: 'spiritual_05',
      category: 'spiritual_practice',
      prompt: 'What wisdom traditions or spiritual teachings resonate with your soul right now?',
      traumaInformed: true,
      timeEstimate: '15-25 minutes',
      difficulty: 'moderate'
    }
  ]
};

// Prompt selection utilities
export class AnalogPromptSelector {
  // Get random prompt from category
  static getRandomPrompt(category: AnalogPromptCategory): AnalogPrompt {
    const prompts = ANALOG_REFLECTION_PROMPTS[category];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  }

  // Get prompt by difficulty level
  static getPromptsByDifficulty(difficulty: 'gentle' | 'moderate' | 'deep'): AnalogPrompt[] {
    const allPrompts = Object.values(ANALOG_REFLECTION_PROMPTS).flat();
    return allPrompts.filter(prompt => prompt.difficulty === difficulty);
  }

  // Get prompts suitable for specific time availability
  static getPromptsByTime(maxMinutes: number): AnalogPrompt[] {
    const allPrompts = Object.values(ANALOG_REFLECTION_PROMPTS).flat();
    return allPrompts.filter(prompt => {
      const timeRange = prompt.timeEstimate.match(/(\d+)-?(\d+)?/);
      if (timeRange) {
        const maxTime = parseInt(timeRange[2] || timeRange[1]);
        return maxTime <= maxMinutes;
      }
      return true;
    });
  }

  // Get curated daily prompts (one from each category type)
  static getDailyPromptSet(): {
    check_in: AnalogPrompt;
    emotional: AnalogPrompt;
    strength: AnalogPrompt;
    creative: AnalogPrompt;
  } {
    return {
      check_in: this.getRandomPrompt('daily_check_in'),
      emotional: this.getRandomPrompt('emotional_awareness'),
      strength: this.getRandomPrompt('strength_recognition'),
      creative: this.getRandomPrompt('creative_expression')
    };
  }

  // Get trauma-informed prompts only
  static getTraumaInformedPrompts(): AnalogPrompt[] {
    const allPrompts = Object.values(ANALOG_REFLECTION_PROMPTS).flat();
    return allPrompts.filter(prompt => prompt.traumaInformed);
  }

  // Get gentle prompts for new users or difficult days
  static getGentlePrompts(): AnalogPrompt[] {
    return this.getPromptsByDifficulty('gentle');
  }

  // Get prompts with cultural connection themes
  static getCulturalPrompts(): AnalogPrompt[] {
    return ANALOG_REFLECTION_PROMPTS.cultural_connection;
  }

  // Get starter prompts for first-time analog users
  static getStarterPrompts(): AnalogPrompt[] {
    return [
      ANALOG_REFLECTION_PROMPTS.daily_check_in[0], // Body awareness
      ANALOG_REFLECTION_PROMPTS.emotional_awareness[0], // Emotion shapes
      ANALOG_REFLECTION_PROMPTS.strength_recognition[0], // Daily courage
      ANALOG_REFLECTION_PROMPTS.gratitude_practice[0] // Body appreciation
    ];
  }
}

// Supporting content for analog journaling
export const ANALOG_JOURNALING_GUIDANCE = {
  introduction: {
    title: "Welcome to Analog Journaling",
    description: "Your words, your wisdom, your pace. No AI analysis—just you and your authentic reflection.",
    benefits: [
      "Complete privacy and control over your thoughts",
      "Freedom from digital distractions",
      "Direct connection to your inner wisdom",
      "Culturally-grounded reflection practices",
      "Trauma-informed prompts designed for safety"
    ]
  },
  
  getting_started: {
    title: "Getting Started",
    steps: [
      "Choose a prompt that feels inviting, not intimidating",
      "Set aside uninterrupted time—even 5 minutes is valuable",
      "Write by hand if possible, or type mindfully",
      "Let your thoughts flow without editing or judging",
      "Honor whatever comes up—there are no wrong answers"
    ]
  },

  trauma_informed_principles: {
    title: "Trauma-Informed Reflection",
    principles: [
      "You are the expert on your own experience",
      "Go at your own pace—you control the depth",
      "Safety comes first—stop if something feels overwhelming",
      "Your survival strategies are forms of wisdom",
      "Healing is not linear—honor wherever you are today"
    ]
  },

  when_to_pause: {
    title: "When to Take a Break",
    signs: [
      "Feeling overwhelmed or panicked",
      "Dissociating or feeling disconnected",
      "Physical tension or pain increasing",
      "Strong urge to harm yourself or others",
      "Feeling flooded with difficult memories"
    ],
    actions: [
      "Put down your pen or step away from the screen",
      "Take five deep breaths",
      "Feel your feet on the ground",
      "Remind yourself: 'I am safe right now'",
      "Reach out for support if needed"
    ]
  },

  grounding_techniques: {
    "5-4-3-2-1": {
      description: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste",
      when_to_use: "When feeling anxious or disconnected"
    },
    "box_breathing": {
      description: "Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 4 times.",
      when_to_use: "When feeling activated or overwhelmed"
    },
    "body_scan": {
      description: "Start at your toes and slowly notice each part of your body up to your head",
      when_to_use: "When feeling disconnected from your body"
    }
  }
};

export default ANALOG_REFLECTION_PROMPTS;