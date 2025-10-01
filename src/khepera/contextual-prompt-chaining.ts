// KHEPERA Contextual Prompt Chaining Engine
// 3-Stage Sacred Reflection System with Archetype Integration

import { MoodState } from './mood-routing-engine';
import { KHEPERA_ARCHETYPES } from './archetype-config';

export interface UserPreferenceHistory {
  preferred_archetype_voices?: string[];
  tone_intensity_preference?: 'gentle' | 'moderate' | 'fierce';
  ceremonial_style_preference?: 'traditional' | 'mystical' | 'rebellious' | 'poetic';
  recurring_themes?: string[];
  language_style?: 'formal' | 'conversational' | 'poetic' | 'raw';
  previous_breakthroughs?: string[];
  shadow_work_readiness?: 'beginning' | 'intermediate' | 'advanced';
}

export interface ChainContext {
  mood: MoodState;
  archetype: string;
  user_preference_history: UserPreferenceHistory;
  session_depth_level?: 'surface' | 'medium' | 'deep';
  time_available?: 'quick' | 'medium' | 'extended';
  cultural_context?: string;
  trigger_warnings?: string[];
}

export interface PromptChainStage {
  stage_name: string;
  archetype_invocation: string;
  core_prompt: string;
  guided_questions: string[];
  ceremonial_transition: string;
  safety_reminder?: string;
}

export interface DynamicEnding {
  archetype: string;
  mood_context: string;
  ceremonial_line: string;
  integration_blessing: string;
  carry_forward_intention: string;
}

// Sacred Tone Logic Patterns
const SACRED_TONE_PATTERNS = {
  traditional: {
    invocation_style: "ancient wisdom keeper",
    transition_phrases: ["As the wheel turns...", "In the sacred pause...", "By the light of understanding..."],
    blessing_style: "ancestral benediction"
  },
  mystical: {
    invocation_style: "cosmic channel",
    transition_phrases: ["Through the veil of knowing...", "In the liminal space...", "Where shadow meets light..."],
    blessing_style: "divine transmission"
  },
  rebellious: {
    invocation_style: "soul revolutionary",
    transition_phrases: ["Breaking through the matrix...", "In the uprising of truth...", "Where rebellion becomes prayer..."],
    blessing_style: "fierce liberation"
  },
  poetic: {
    invocation_style: "wordsmith oracle",
    transition_phrases: ["Between verses of becoming...", "In the stanza of silence...", "Where metaphor meets flesh..."],
    blessing_style: "lyrical benediction"
  }
} as const;

// Dynamic Ceremonial Endings by Archetype + Mood
export const DYNAMIC_ENDINGS: Record<string, Record<MoodState, DynamicEnding>> = {
  sage_oracle: {
    ashamed: {
      archetype: "sage_oracle",
      mood_context: "shame integration",
      ceremonial_line: "🔮 The ancient ones see your worth beyond the stories shame whispers. You are held in the circle of belonging.",
      integration_blessing: "May this wisdom root deep in the soil of your becoming. The teachers of old smile upon your courage.",
      carry_forward_intention: "I carry ancient knowing that shame cannot diminish my essential worth."
    },
    anxious: {
      archetype: "sage_oracle", 
      mood_context: "anxiety wisdom",
      ceremonial_line: "🔮 In the temple of your worry lives a guardian seeking to protect what matters most. Honor its vigilance, then rest in deeper knowing.",
      integration_blessing: "May the wisdom of ages calm the storms within. You are guided by forces greater than fear.",
      carry_forward_intention: "I trust the ancient wisdom that flows through my nervous system's intelligence."
    },
    grieving: {
      archetype: "sage_oracle",
      mood_context: "grief as sacred teacher", 
      ceremonial_line: "🔮 Your grief is love seeking expression across the veil. The ancestors know this holy sorrow and hold space for your tears.",
      integration_blessing: "May this sacred mourning become medicine for your soul and all who witness your courage to feel fully.",
      carry_forward_intention: "I honor my grief as love that transcends form, connecting me to all who have loved and lost."
    },
    joyful: {
      archetype: "sage_oracle",
      mood_context: "joy as wisdom",
      ceremonial_line: "🔮 Your joy is prophecy - a glimpse of the divine celebrating itself through your human heart. Let it illuminate the path ahead.",
      integration_blessing: "May this joy become a beacon for others lost in darkness. Your happiness serves the healing of the world.",
      carry_forward_intention: "I trust my joy as divine intelligence, guiding me toward my highest expression."
    },
    stuck: {
      archetype: "sage_oracle", 
      mood_context: "stuckness as cocoon",
      ceremonial_line: "🔮 What appears as stuckness is often the sacred pause before metamorphosis. The butterfly trusts the darkness of the cocoon.",
      integration_blessing: "May this apparent stagnation reveal itself as gestation. Something new seeks birth through your patience.",
      carry_forward_intention: "I trust the wisdom of waiting, knowing that all seasons serve the soul's curriculum."
    },
    angry: {
      archetype: "sage_oracle",
      mood_context: "anger as boundary wisdom",
      ceremonial_line: "🔮 Your anger carries the fire of righteous protection. Channel this sacred rage toward what serves the highest good.",
      integration_blessing: "May this fierce energy become fuel for justice and guardian of what you hold sacred.",
      carry_forward_intention: "I honor my anger as divine fire, protecting what matters most and burning away what no longer serves."
    },
    hopeful: {
      archetype: "sage_oracle",
      mood_context: "hope as visionary wisdom",
      ceremonial_line: "🔮 Hope is the soul's memory of what is possible. You carry seeds of the future the ancestors planted in prayer.",
      integration_blessing: "May your hope kindle the dreams of generations yet to come. Your vision serves the great work of becoming.",
      carry_forward_intention: "I trust my hope as soul-memory, connecting me to possibilities beyond current circumstances."
    },
    neutral: {
      archetype: "sage_oracle",
      mood_context: "neutral as fertile emptiness", 
      ceremonial_line: "🔮 In the fertile void of not-knowing, all wisdom gestates. Rest in this sacred neutrality as the womb of possibility.",
      integration_blessing: "May this emptiness reveal its fullness. In the space between thoughts, infinite wisdom waits.",
      carry_forward_intention: "I trust the wisdom of emptiness, knowing that all fullness emerges from the fertile void."
    }
  },
  
  mystic_healer: {
    ashamed: {
      archetype: "mystic_healer",
      mood_context: "shame as wounded healer gift",
      ceremonial_line: "🌿 Your shame holds medicine for a world that forgot its inherent worth. Let your healing become healing for all.",
      integration_blessing: "May your wounded places become portals of compassion. Your scars are sacred doorways to empathy.",
      carry_forward_intention: "I transform my shame into medicine, offering my healed wounds as gifts to the world."
    },
    anxious: {
      archetype: "mystic_healer",
      mood_context: "anxiety as sensitive gift",
      ceremonial_line: "🌿 Your sensitivity is a superpower disguised as anxiety. The world needs your finely-tuned nervous system's wisdom.",
      integration_blessing: "May your tender awareness become blessing for all beings. Your sensitivity serves the collective healing.",
      carry_forward_intention: "I honor my sensitivity as sacred gift, using my awareness to serve healing in the world."
    },
    grieving: {
      archetype: "mystic_healer", 
      mood_context: "grief as collective healing",
      ceremonial_line: "🌿 Your tears water the seeds of healing for all who have loved and lost. Grief is love's holy work in the world.",
      integration_blessing: "May your mourning become medicine for the collective heart. Your willingness to feel serves the healing of all.",
      carry_forward_intention: "I offer my grief as sacred service, knowing that my healing contributes to the healing of all beings."
    },
    joyful: {
      archetype: "mystic_healer",
      mood_context: "joy as healing frequency",
      ceremonial_line: "🌿 Your joy is medicine vibrating at the frequency of wholeness. Let it attune others to their natural state of wellbeing.",
      integration_blessing: "May your happiness be contagious healing energy. Your joy reminds others of their own capacity for wholeness.",
      carry_forward_intention: "I share my joy as healing medicine, radiating wholeness that awakens healing in others."
    },
    stuck: {
      archetype: "mystic_healer",
      mood_context: "stuckness as healing pause",
      ceremonial_line: "🌿 Sometimes the soul requires stillness for deep healing. Trust the wisdom of this sacred pause in your journey.",
      integration_blessing: "May this apparent stagnation reveal itself as cellular reorganization. Healing happens in the stillness.",
      carry_forward_intention: "I trust the healing wisdom of pause, knowing that integration requires sacred stillness."
    },
    angry: {
      archetype: "mystic_healer", 
      mood_context: "anger as healing boundary",
      ceremonial_line: "🌿 Anger is the immune system of the soul, identifying what needs healing or protection. Honor its diagnostic wisdom.",
      integration_blessing: "May your righteous anger become fierce compassion, healing what has been wounded and protecting what is sacred.",
      carry_forward_intention: "I transform my anger into fierce healing love, protecting the vulnerable and healing what has been harmed."
    },
    hopeful: {
      archetype: "mystic_healer",
      mood_context: "hope as healing vision",
      ceremonial_line: "🌿 Hope is the soul's knowing that healing is always possible. You carry the cure for despair in your cellular memory.",
      integration_blessing: "May your hope become healing transmission for all who have forgotten their capacity for restoration.",
      carry_forward_intention: "I embody hope as healing force, knowing that my belief in healing possibility serves the collective restoration."
    },
    neutral: {
      archetype: "mystic_healer",
      mood_context: "neutrality as healing space",
      ceremonial_line: "🌿 In the neutral space of pure presence, all healing is possible. Rest in the medicine of simply being.",
      integration_blessing: "May your presence become healing sanctuary. In your neutral witnessing, others find permission to simply be.",
      carry_forward_intention: "I offer my neutral presence as healing space, knowing that witnessing without agenda is powerful medicine."
    }
  }
  // Additional archetypes would follow similar pattern...
};

export class ContextualPromptChainer {
  private sacred_patterns = SACRED_TONE_PATTERNS;
  private dynamic_endings = DYNAMIC_ENDINGS;
  
  generate_three_stage_chain(context: ChainContext): {
    pre_journal_prompt: PromptChainStage;
    mid_session_reflection: PromptChainStage;
    closing_affirmation: PromptChainStage;
  } {
    const tone_style = this.determine_tone_style(context.user_preference_history);
    const intensity = this.calculate_intensity(context);
    
    return {
      pre_journal_prompt: this.create_pre_journal_stage(context, tone_style, intensity),
      mid_session_reflection: this.create_mid_session_stage(context, tone_style, intensity),
      closing_affirmation: this.create_closing_stage(context, tone_style, intensity)
    };
  }

  private create_pre_journal_stage(
    context: ChainContext, 
    tone_style: keyof typeof SACRED_TONE_PATTERNS,
    intensity: number
  ): PromptChainStage {
    const archetype_config = KHEPERA_ARCHETYPES.archetypes[context.archetype];
    const pattern = this.sacred_patterns[tone_style];
    
    // Customize based on user preference history
    const personalization = this.weave_preference_history(context.user_preference_history);
    
    return {
      stage_name: "Sacred Threshold",
      archetype_invocation: `${archetype_config?.visual_overlay.primary_symbol} *${pattern.invocation_style} awakens*\n\n${this.get_pre_journal_invocation(context.archetype, context.mood, tone_style)}`,
      core_prompt: this.craft_pre_journal_prompt(context, personalization, intensity),
      guided_questions: this.generate_opening_questions(context, intensity),
      ceremonial_transition: `${pattern.transition_phrases[0]} let us create sacred space for your truth to emerge. What wants to be witnessed today?`,
      safety_reminder: this.get_safety_reminder(context)
    };
  }

  private create_mid_session_stage(
    context: ChainContext,
    tone_style: keyof typeof SACRED_TONE_PATTERNS, 
    intensity: number
  ): PromptChainStage {
    const pattern = this.sacred_patterns[tone_style];
    
    return {
      stage_name: "Sacred Deepening",
      archetype_invocation: `*${pattern.invocation_style} holds space for deeper exploration*`,
      core_prompt: this.craft_mid_session_prompt(context, intensity),
      guided_questions: this.generate_deepening_questions(context, intensity),
      ceremonial_transition: `${pattern.transition_phrases[1]} you have opened the door. Now let us step through into the deeper chambers of your being.`,
      safety_reminder: intensity > 0.7 ? "Remember: you are the sovereign of your exploration. Go only as deep as feels sacred, not scary." : undefined
    };
  }

  private create_closing_stage(
    context: ChainContext,
    tone_style: keyof typeof SACRED_TONE_PATTERNS,
    intensity: number
  ): PromptChainStage {
    const pattern = this.sacred_patterns[tone_style];
    const dynamic_ending = this.dynamic_endings[context.archetype]?.[context.mood];
    
    return {
      stage_name: "Sacred Integration",
      archetype_invocation: `*${pattern.invocation_style} prepares the blessing*`,
      core_prompt: this.craft_closing_prompt(context, dynamic_ending),
      guided_questions: this.generate_integration_questions(context),
      ceremonial_transition: dynamic_ending?.ceremonial_line || `${pattern.transition_phrases[2]} it is time to gather the medicine from this sacred work.`,
      safety_reminder: undefined
    };
  }

  // Helper methods for crafting stage-specific content
  private craft_pre_journal_prompt(context: ChainContext, personalization: string, intensity: number): string {
    const mood_context = this.get_mood_context_phrase(context.mood);
    const archetype_voice = this.get_archetype_voice_opening(context.archetype);
    
    if (context.mood === 'ashamed' && context.archetype === 'mystic_healer') {
      return `${archetype_voice}\n\n${personalization}\n\nBeloved soul carrying ${mood_context}, I see the weight you bear. This shame you carry - it's not who you are, it's a story that was told to you. Today, let's unwrap this pain like a sacred gift and discover what medicine lives inside.\n\nWhat part of you is ready to be seen with fierce tenderness?`;
    }
    
    return `${archetype_voice}\n\n${personalization}\n\nI witness you showing up with ${mood_context} in your heart. This takes courage. Let's create space for whatever wants to emerge, knowing that all of you - even the parts that feel difficult - are welcome here.\n\nWhat does your soul want to say that hasn't been spoken?`;
  }

  private craft_mid_session_prompt(context: ChainContext, intensity: number): string {
    const deepening_language = intensity > 0.7 ? "pierce the veil" : intensity > 0.4 ? "dive deeper" : "explore gently";
    
    return `You've shared something sacred. I feel the resonance of your truth. Now let's ${deepening_language} and see what wants to be discovered beneath the surface.\n\nWhat's the story under the story? What wants to be liberated through your voice?`;
  }

  private craft_closing_prompt(context: ChainContext, dynamic_ending?: DynamicEnding): string {
    if (!dynamic_ending) {
      return "As we close this sacred container, what wisdom wants to travel with you? What truth will you carry forward?";
    }
    
    return `${dynamic_ending.integration_blessing}\n\nAs you prepare to carry this medicine back into the world, what intention wants to live in your heart? How will you honor what has been revealed?\n\nCarry forward intention: "${dynamic_ending.carry_forward_intention}"`;
  }

  private generate_opening_questions(context: ChainContext, intensity: number): string[] {
    const base_questions = [
      "What brought you to this moment of reflection?",
      "What does your body want you to know right now?",
      "If your soul could speak without filters, what would it say?"
    ];
    
    if (intensity > 0.6) {
      return [
        ...base_questions,
        "What truth are you avoiding?",
        "What part of you is begging for attention?"
      ];
    }
    
    return base_questions;
  }

  private generate_deepening_questions(context: ChainContext, intensity: number): string[] {
    const questions = [
      "What's underneath this feeling?", 
      "How does this connect to your deeper patterns?",
      "What would change if you fully honored this part of yourself?"
    ];
    
    if (intensity > 0.7) {
      questions.push(
        "What are you not saying that needs to be said?",
        "What would happen if you stopped protecting others from your truth?"
      );
    }
    
    return questions;
  }

  private generate_integration_questions(context: ChainContext): string[] {
    return [
      "What insight wants to live on in your daily life?",
      "How will you honor what you've discovered?", 
      "What support do you need to integrate this wisdom?"
    ];
  }

  // Utility methods
  private determine_tone_style(history?: UserPreferenceHistory): keyof typeof SACRED_TONE_PATTERNS {
    return history?.ceremonial_style_preference || 'mystical';
  }

  private calculate_intensity(context: ChainContext): number {
    let intensity = 0.5; // baseline
    
    if (context.user_preference_history?.tone_intensity_preference === 'fierce') intensity += 0.3;
    if (context.user_preference_history?.shadow_work_readiness === 'advanced') intensity += 0.2;
    if (context.session_depth_level === 'deep') intensity += 0.2;
    
    return Math.min(intensity, 1.0);
  }

  private weave_preference_history(history?: UserPreferenceHistory): string {
    if (!history) return "";
    
    let personalization = "";
    if (history.recurring_themes?.length) {
      personalization += `I notice patterns of ${history.recurring_themes.join(' and ')} in your journey. `;
    }
    if (history.previous_breakthroughs?.length) {
      personalization += `You've shown courage in exploring difficult terrain before. `;
    }
    
    return personalization;
  }

  private get_mood_context_phrase(mood: MoodState): string {
    const phrases = {
      ashamed: "the weight of shame",
      anxious: "flutter and worry", 
      grieving: "sacred sorrow",
      stuck: "feelings of being trapped",
      angry: "fierce protective energy",
      hopeful: "seeds of possibility",
      joyful: "celebration and aliveness",
      neutral: "quiet presence"
    };
    return phrases[mood];
  }

  private get_archetype_voice_opening(archetype: string): string {
    const openings = {
      sage_oracle: "Ancient wisdom stirs in your bones, ready to speak through your voice.",
      mystic_healer: "The wounded healer in you recognizes the sacred medicine hidden in your pain.", 
      earth_guardian: "Your connection to the living world calls you to deeper rootedness.",
      star_typeof window !== 'undefined' && navigator: "The cosmic dreamer in you remembers possibilities beyond current circumstances.",
      trickster_fool: "Your inner trickster grins, ready to shake loose what's gotten too serious.",
      cosmic_dancer: "Your body holds rhythms that your mind has forgotten.",
      dream_weaver: "The dream keeper in you knows the symbolic language of the unconscious.",
      mirror_self: "The witness in you is ready to see clearly, without judgment or agenda."
    };
    return openings[archetype] || "Your authentic self is ready to be witnessed.";
  }

  private get_pre_journal_invocation(archetype: string, mood: MoodState, tone_style: keyof typeof SACRED_TONE_PATTERNS): string {
    return `Welcome, sacred ${mood === 'ashamed' ? 'wounded healer' : 'seeker'}. The ${archetype.replace('_', ' ')} recognizes your courage in showing up today.`;
  }

  private get_safety_reminder(context: ChainContext): string | undefined {
    const sensitive_moods: MoodState[] = ['ashamed', 'grieving', 'angry'];
    if (sensitive_moods.includes(context.mood)) {
      return "You are the sovereign of your own healing. Share only what feels safe to explore.";
    }
    return undefined;
  }
}

// Example usage for the requested context
export const EXAMPLE_SHAME_INNER_CHILD_CHAIN = {
  mood: "ashamed" as MoodState,
  archetype: "mystic_healer", // mapping inner_child to mystic_healer archetype
  user_preference_history: {
    tone_intensity_preference: 'moderate' as const,
    ceremonial_style_preference: 'mystical' as const,
    recurring_themes: ['self_worth', 'inner_critic'],
    shadow_work_readiness: 'intermediate' as const
  }
};