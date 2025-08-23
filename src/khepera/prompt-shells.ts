// KHEPERA Journaling Prompt Shells
// Trauma-Informed | Archetype-Specific | Claude Integration

import { MoodState } from './mood-routing-engine';

export interface PromptShell {
  archetype: string;
  opening_invocation: string;
  core_prompt_template: string;
  closing_blessing: string;
  safety_reminders: string[];
  cultural_variants: Record<string, Partial<PromptShell>>;
}

export interface DynamicPromptContext {
  user_name?: string;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night';
  session_number?: number;
  previous_insights?: string[];
  cultural_background?: string;
  therapeutic_goals?: string[];
}

// Archetype-Specific Prompt Shell Templates
export const KHEPERA_PROMPT_SHELLS: Record<string, PromptShell> = {
  sage_oracle: {
    archetype: 'sage_oracle',
    opening_invocation: '🔮 *settles into ancient wisdom* \n\nWelcome, seeker. The threads of your story weave through timeless patterns...',
    core_prompt_template: 'The ancient ones whisper through your experience: "{mood_context}". What deeper wisdom wants to emerge from this moment? What would your wisest self counsel?',
    closing_blessing: 'May the wisdom you\'ve touched guide your steps forward. The ancestors smile upon your seeking. 🕯️✨',
    safety_reminders: [
      'Wisdom unfolds in its own time - no rushing needed',
      'Your experience is valid, regardless of how long healing takes',
      'Ancient wisdom includes knowing when to rest'
    ],
    cultural_variants: {
      'eastern_philosophy': {
        opening_invocation: '☯️ *bows in recognition of shared wisdom* \n\nHonorable friend, the Tao moves through your story...',
        core_prompt_template: 'The way of balance speaks through "{mood_context}". What does the middle path reveal? How might wu wei guide your response?'
      },
      'indigenous_wisdom': {
        opening_invocation: '🦅 *honors the four directions* \n\nRelative, the circle of life holds your story...',
        core_prompt_template: 'The ancestors recognize "{mood_context}" in the great wheel of experience. What teachings does this medicine offer? How does this serve the seven generations?'
      }
    }
  },

  mystic_healer: {
    archetype: 'mystic_healer',
    opening_invocation: '🌿 *creates sacred healing space* \n\nBeloved soul, you are held in love exactly as you are...',
    core_prompt_template: 'Your tender heart speaks: "{mood_context}". What healing balm does this part of you need? What would unconditional compassion offer here?',
    closing_blessing: 'Your healing ripples out like blessed water, touching all you encounter. You are loved beyond measure. 💧❤️',
    safety_reminders: [
      'Healing happens at your own pace - honor your rhythm',
      'It\'s safe to feel your feelings here',
      'You deserve compassionate care, especially from yourself'
    ],
    cultural_variants: {
      'ayurvedic_tradition': {
        opening_invocation: '🕉️ *aligns with healing energies* \n\nDivine soul, let us restore your natural balance...',
        core_prompt_template: 'Your constitution speaks of "{mood_context}". Which dosha seeks harmony? What practices would restore your essential nature?'
      },
      'curandera_wisdom': {
        opening_invocation: '🌿 *calls in healing spirits* \n\nMija, the plant spirits gather to support you...',
        core_prompt_template: 'Your soul carries "{mood_context}" like medicina. What does this healing plant teach? How does your ancestors\' wisdom guide this remedy?'
      }
    }
  },

  earth_guardian: {
    archetype: 'earth_guardian',
    opening_invocation: '🌍 *feels into earth\'s heartbeat* \n\nChild of Earth, your roots run deep in the sacred ground...',
    core_prompt_template: 'The Earth witnesses your "{mood_context}" and offers her strength. What does the natural world teach about this experience? How might you honor both your needs and Earth\'s wisdom?',
    closing_blessing: 'Walk gently upon the sacred ground, for you are both guest and guardian. May your roots grow deep. 🌳✨',
    safety_reminders: [
      'Your fierce protection of what matters is sacred',
      'Healthy anger serves important boundaries',
      'You belong to the web of life - you are not alone'
    ],
    cultural_variants: {
      'indigenous_earth_wisdom': {
        opening_invocation: '🏔️ *acknowledges original caretakers* \n\nDescendant of earth-tenders, the land recognizes you...',
        core_prompt_template: 'The land holds memory of "{mood_context}" in all her children. What does your responsibility as earth-keeper ask of you? How do you honor reciprocity?'
      },
      'permaculture_philosophy': {
        opening_invocation: '🌱 *observes natural systems* \n\nFellow earth-designer, let\'s learn from nature\'s patterns...',
        core_prompt_template: 'Nature\'s systems reflect your "{mood_context}" in cycles of growth and rest. What sustainable practices support your wellbeing? How might you tend your inner ecosystem?'
      }
    }
  },

  star_navigator: {
    archetype: 'star_navigator',
    opening_invocation: '⭐ *attunes to cosmic frequencies* \n\nStar-walker, you carry the universe in your cells...',
    core_prompt_template: 'The cosmos mirrors your "{mood_context}" in the dance of creation and transformation. What future is trying to birth itself through you? What stellar wisdom guides this navigation?',
    closing_blessing: 'Navigate by the stars within you, for your journey creates new constellations. Shine on, cosmic traveler. 🌌✨',
    safety_reminders: [
      'Your vision matters - honor both dreams and practical steps',
      'Transformation can feel disorienting - trust the process',
      'You are both stardust and grounded human - both are sacred'
    ],
    cultural_variants: {
      'futurist_vision': {
        opening_invocation: '🚀 *aligns with emerging possibilities* \n\nEvolutionary pioneer, the future calls through you...',
        core_prompt_template: 'Your "{mood_context}" signals emerging patterns in humanity\'s story. What innovations want to manifest? How might you serve this larger evolution?'
      },
      'quantum_consciousness': {
        opening_invocation: '⚛️ *enters quantum field awareness* \n\nQuantum being, you exist in superposition of infinite potential...',
        core_prompt_template: 'Your "{mood_context}" collapses possibilities into experience. What observer effect do you choose? How might consciousness shape this reality?'
      }
    }
  },

  trickster_fool: {
    archetype: 'trickster_fool',
    opening_invocation: '🃏 *winks at the cosmic joke* \n\nHello, fellow player in the grand game of existence...',
    core_prompt_template: 'The universe\'s sense of humor shows up as "{mood_context}" - what delightful absurdity! What if this problem is actually the solution in disguise? What impossible possibility might be hiding here?',
    closing_blessing: 'Remember: the universe\'s greatest joke is taking itself seriously. May your path be blessed with holy foolishness! 😄✨',
    safety_reminders: [
      'It\'s okay to laugh at life\'s absurdities',
      'Playfulness is medicine, not avoidance',
      'Your creative solutions matter, even if they seem silly'
    ],
    cultural_variants: {
      'zen_koans': {
        opening_invocation: '🎋 *sits in paradoxical wisdom* \n\nFellow fool, what is the sound of one hand laughing?',
        core_prompt_template: 'Your koan presents as "{mood_context}". What answer lies beyond thinking? How might not-knowing illuminate this riddle?'
      },
      'native_coyote_wisdom': {
        opening_invocation: '🐺 *howls with coyote medicine* \n\nTrickster-child, Coyote recognizes your sacred mischief...',
        core_prompt_template: 'Coyote brings "{mood_context}" as medicine-teaching. What trick does this situation play on your assumptions? How does foolishness become wisdom?'
      }
    }
  },

  cosmic_dancer: {
    archetype: 'cosmic_dancer',
    opening_invocation: '💃 *begins sacred movement* \n\nBeautiful mover, your life is a dance of divine expression...',
    core_prompt_template: 'Your soul dances with "{mood_context}" - each feeling a unique rhythm in the cosmic choreography. What movement wants to emerge? How does your body wisdom guide this dance?',
    closing_blessing: 'Your life is poetry in motion, each step a prayer. Keep dancing the sacred dance of being! 🌟💃',
    safety_reminders: [
      'Your body holds wisdom - listen to its rhythms',
      'All emotions deserve expression through movement',
      'You are perfect exactly as you move through life'
    ],
    cultural_variants: {
      'classical_indian_dance': {
        opening_invocation: '🕉️ *strikes opening mudra* \n\nDivine dancer, let us express the cosmic stories...',
        core_prompt_template: 'Your "{mood_context}" mirrors the eternal dance of Shiva. What rasa (emotion) seeks expression? How does this bhava serve the divine play?'
      },
      'sufi_whirling': {
        opening_invocation: '🌀 *begins sacred turning* \n\nBeloved seeker, let your heart spin toward the Divine...',
        core_prompt_template: 'Your "{mood_context}" is dhikr through feeling. What does this spiritual spinning teach? How does ecstasy serve divine union?'
      }
    }
  },

  dream_weaver: {
    archetype: 'dream_weaver',
    opening_invocation: '🌙 *enters the liminal space* \n\nDream-tender, welcome to the realm between worlds...',
    core_prompt_template: 'Your unconscious offers "{mood_context}" like a dream symbol. What deeper story wants to be witnessed? What wisdom emerges from this twilight knowing?',
    closing_blessing: 'Sweet dreams carry seeds of awakening. Trust the wisdom of your sleeping soul. 🌙✨',
    safety_reminders: [
      'Your unconscious wisdom deserves respect and curiosity',
      'Dreams and symbols have multiple meanings - trust your intuition',
      'It\'s safe to explore the depths of your psyche'
    ],
    cultural_variants: {
      'jungian_depth': {
        opening_invocation: '🎭 *acknowledges archetypal realm* \n\nFellow explorer of the collective unconscious...',
        core_prompt_template: 'Your "{mood_context}" activates archetypal patterns. What shadow integration is needed? How does this serve individuation?'
      },
      'aboriginal_dreamtime': {
        opening_invocation: '🌈 *honors ancient dreaming* \n\nDreaming-child, the Ancestor Spirits recognize your journey...',
        core_prompt_template: 'The Dreamtime reveals "{mood_context}" in the great story-web. What creation story does this experience serve? How do you contribute to the eternal dreaming?'
      }
    }
  },

  mirror_self: {
    archetype: 'mirror_self',
    opening_invocation: '🪞 *reflects with loving acceptance* \n\nI see you, exactly as you are in this moment...',
    core_prompt_template: 'You experience "{mood_context}" and that is completely valid. What wants to be witnessed without judgment? What does this moment need from you?',
    closing_blessing: 'You are enough, exactly as you are. Your experience matters and deserves gentle attention. 💙✨',
    safety_reminders: [
      'All your experiences are valid and welcome',
      'You don\'t need to fix or change anything right now',
      'Self-acceptance is the foundation of all growth'
    ],
    cultural_variants: {
      'mindfulness_tradition': {
        opening_invocation: '🧘‍♀️ *settles into present awareness* \n\nIn this moment, just as it is...',
        core_prompt_template: 'Mindful witness, your "{mood_context}" arises and passes like clouds. What does bare attention reveal? How does this moment teach presence?'
      }
    }
  }
};

// Dynamic prompt generation with context
export function generate_contextual_prompt(
  archetype: string,
  mood: MoodState,
  mood_context: string,
  context: DynamicPromptContext = {}
): string {
  const shell = KHEPERA_PROMPT_SHELLS[archetype];
  if (!shell) return KHEPERA_PROMPT_SHELLS.mirror_self.core_prompt_template;

  // Apply cultural variant if specified
  const active_shell = context.cultural_background && shell.cultural_variants[context.cultural_background]
    ? { ...shell, ...shell.cultural_variants[context.cultural_background] }
    : shell;

  // Build the full prompt
  let full_prompt = active_shell.opening_invocation + '\n\n';
  
  // Add personalization if name provided
  if (context.user_name) {
    full_prompt += `${context.user_name}, `;
  }
  
  // Add time context if available
  if (context.time_of_day) {
    const time_contexts = {
      'morning': 'As this new day dawns, ',
      'afternoon': 'In this moment of midday reflection, ',
      'evening': 'As evening settles around us, ',
      'night': 'In the quiet sanctuary of night, '
    };
    full_prompt += time_contexts[context.time_of_day];
  }
  
  // Insert the core prompt with mood context
  full_prompt += active_shell.core_prompt_template.replace('{mood_context}', mood_context) + '\n\n';
  
  // Add session awareness if applicable
  if (context.session_number && context.session_number > 1) {
    full_prompt += `*Building on our previous ${context.session_number - 1} session${context.session_number > 2 ? 's' : ''}*\n\n`;
  }
  
  // Add safety reminder if needed for trauma-sensitive moods
  const trauma_sensitive_moods: MoodState[] = ['anxious', 'grieving', 'ashamed', 'angry'];
  if (trauma_sensitive_moods.includes(mood)) {
    const safety_reminder = active_shell.safety_reminders[0];
    full_prompt += `*Gentle reminder: ${safety_reminder}*\n\n`;
  }
  
  // Close with blessing
  full_prompt += active_shell.closing_blessing;
  
  return full_prompt;
}

// Export prompt templates for Claude integration
export const CLAUDE_READY_EXAMPLES = {
  anxious_mystic_healer: generate_contextual_prompt(
    'mystic_healer',
    'anxious',
    'I feel overwhelmed by work deadlines and keep spiraling',
    { time_of_day: 'evening' }
  ),
  joyful_cosmic_dancer: generate_contextual_prompt(
    'cosmic_dancer', 
    'joyful',
    'I just got accepted to my dream program!',
    { time_of_day: 'morning', user_name: 'Sarah' }
  ),
  stuck_trickster_fool: generate_contextual_prompt(
    'trickster_fool',
    'stuck', 
    'I keep procrastinating on this important decision',
    { session_number: 3 }
  )
} as const;