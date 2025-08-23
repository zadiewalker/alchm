// KHEPERA Example Prompt Chains
// Demonstrating 3-Stage Contextual Chaining with Different Scenarios

import { ContextualPromptChainer, ChainContext } from './contextual-prompt-chaining';

const chainer = new ContextualPromptChainer();

// EXAMPLE 1: Shame + Inner Child (Mystic Healer Archetype)
export const SHAME_INNER_CHILD_EXAMPLE = (() => {
  const context: ChainContext = {
    mood: "ashamed",
    archetype: "mystic_healer",
    user_preference_history: {
      tone_intensity_preference: 'moderate',
      ceremonial_style_preference: 'mystical',
      recurring_themes: ['self_worth', 'inner_critic', 'childhood_wounds'],
      shadow_work_readiness: 'intermediate',
      previous_breakthroughs: ['recognized inner critic patterns', 'connected shame to childhood experiences']
    },
    session_depth_level: 'medium',
    time_available: 'medium'
  };

  return chainer.generate_three_stage_chain(context);
})();

// EXAMPLE 2: Anxiety + Cosmic Dancer (Movement + Joy)
export const ANXIETY_COSMIC_DANCER_EXAMPLE = (() => {
  const context: ChainContext = {
    mood: "anxious",
    archetype: "cosmic_dancer", 
    user_preference_history: {
      tone_intensity_preference: 'gentle',
      ceremonial_style_preference: 'poetic',
      recurring_themes: ['body_wisdom', 'creative_expression', 'perfectionism'],
      shadow_work_readiness: 'beginning',
      language_style: 'poetic'
    },
    session_depth_level: 'surface',
    time_available: 'quick'
  };

  return chainer.generate_three_stage_chain(context);
})();

// EXAMPLE 3: Stuck + Trickster Fool (Pattern Breaking)
export const STUCK_TRICKSTER_EXAMPLE = (() => {
  const context: ChainContext = {
    mood: "stuck",
    archetype: "trickster_fool",
    user_preference_history: {
      tone_intensity_preference: 'fierce',
      ceremonial_style_preference: 'rebellious', 
      recurring_themes: ['creative_blocks', 'people_pleasing', 'perfectionism'],
      shadow_work_readiness: 'advanced',
      language_style: 'raw'
    },
    session_depth_level: 'deep',
    time_available: 'extended'
  };

  return chainer.generate_three_stage_chain(context);
})();

// EXAMPLE 4: Grief + Sage Oracle (Wisdom Integration)
export const GRIEF_SAGE_ORACLE_EXAMPLE = (() => {
  const context: ChainContext = {
    mood: "grieving",
    archetype: "sage_oracle",
    user_preference_history: {
      tone_intensity_preference: 'moderate',
      ceremonial_style_preference: 'traditional',
      recurring_themes: ['loss', 'meaning_making', 'spiritual_seeking'],
      shadow_work_readiness: 'intermediate',
      language_style: 'formal'
    },
    session_depth_level: 'deep',
    cultural_context: 'indigenous_wisdom'
  };

  return chainer.generate_three_stage_chain(context);
})();

// FORMATTED OUTPUT EXAMPLES FOR DOCUMENTATION

export const FORMATTED_EXAMPLES = {
  shame_inner_child: {
    context: {
      mood: "shame",
      archetype: "inner_child (mystic_healer)",
      user_history: "moderate intensity, mystical style, themes: self-worth/inner-critic"
    },
    
    pre_journal_prompt: {
      stage: "Sacred Threshold",
      content: `🌿 *cosmic channel awakens*

Welcome, sacred wounded healer. The mystic healer recognizes your courage in showing up today.

I notice patterns of self_worth and inner_critic in your journey. You've shown courage in exploring difficult terrain before.

Beloved soul carrying the weight of shame, I see the weight you bear. This shame you carry - it's not who you are, it's a story that was told to you. Today, let's unwrap this pain like a sacred gift and discover what medicine lives inside.

What part of you is ready to be seen with fierce tenderness?

Guided Questions:
• What brought you to this moment of reflection?
• What does your body want you to know right now?
• If your soul could speak without filters, what would it say?

*Through the veil of knowing... let us create sacred space for your truth to emerge. What wants to be witnessed today?*

Safety Reminder: You are the sovereign of your own healing. Share only what feels safe to explore.`
    },

    mid_session_reflection: {
      stage: "Sacred Deepening", 
      content: `*cosmic channel holds space for deeper exploration*

You've shared something sacred. I feel the resonance of your truth. Now let's dive deeper and see what wants to be discovered beneath the surface.

What's the story under the story? What wants to be liberated through your voice?

Deepening Questions:
• What's underneath this feeling?
• How does this connect to your deeper patterns?
• What would change if you fully honored this part of yourself?

*In the liminal space... you have opened the door. Now let us step through into the deeper chambers of your being.*

Safety Note: Remember: you are the sovereign of your exploration. Go only as deep as feels sacred, not scary.`
    },

    closing_affirmation: {
      stage: "Sacred Integration",
      content: `*cosmic channel prepares the blessing*

🌿 Your shame holds medicine for a world that forgot its inherent worth. Let your healing become healing for all.

May your wounded places become portals of compassion. Your scars are sacred doorways to empathy.

As you prepare to carry this medicine back into the world, what intention wants to live in your heart? How will you honor what has been revealed?

Integration Questions:
• What insight wants to live on in your daily life?
• How will you honor what you've discovered?
• What support do you need to integrate this wisdom?

Carry Forward Intention: "I transform my shame into medicine, offering my healed wounds as gifts to the world."

*Where shadow meets light... it is time to gather the medicine from this sacred work.*`
    }
  },

  stuck_trickster_revolutionary: {
    context: {
      mood: "stuck", 
      archetype: "trickster_fool",
      user_history: "fierce intensity, rebellious style, advanced shadow work"
    },

    pre_journal_prompt: {
      stage: "Sacred Threshold",
      content: `🃏 *soul revolutionary awakens*

Welcome, sacred stuck soul. The trickster fool recognizes your courage in showing up today.

You've navigated creative blocks and people-pleasing patterns before with fierce honesty.

Listen up, beautiful rebel - that "stuck" feeling? It's not a prison, it's a fucking cocoon. Something in you is ready to shed skin, break rules, and birth something wild. Your creative blocks and people-pleasing patterns are just old programming trying to keep you safe and small.

What sacred rule needs to be smashed today?

Revolutionary Questions:
• What brought you to this moment of reflection?
• What does your body want you to know right now?
• If your soul could speak without filters, what would it say?
• What truth are you avoiding?
• What part of you is begging for attention?

*Breaking through the matrix... let us create sacred space for your truth to emerge. What wants to be witnessed today?*`
    },

    mid_session_reflection: {
      stage: "Sacred Deepening",
      content: `*soul revolutionary holds space for deeper exploration*

You've shared something sacred. I feel the resonance of your truth. Now let's pierce the veil and see what wants to be discovered beneath the surface.

What's the story under the story? What wants to be liberated through your voice?

Revolutionary Deepening:
• What's underneath this feeling?
• How does this connect to your deeper patterns?
• What would change if you fully honored this part of yourself?
• What are you not saying that needs to be said?
• What would happen if you stopped protecting others from your truth?

*In the uprising of truth... you have opened the door. Now let us step through into the deeper chambers of your being.*

Safety Note: Remember: you are the sovereign of your exploration. Go only as deep as feels sacred, not scary.`
    },

    closing_affirmation: {
      stage: "Sacred Integration", 
      content: `*soul revolutionary prepares the blessing*

🃏 What appears as stuckness is often the sacred pause before metamorphosis. The butterfly trusts the darkness of the cocoon.

May this apparent stagnation reveal itself as gestation. Something new seeks birth through your patience.

You've done the revolutionary work today. Now carry this rebellion into the world like a sacred flame.

Integration Questions:
• What insight wants to live on in your daily life?
• How will you honor what you've discovered?
• What support do you need to integrate this wisdom?

Carry Forward Intention: "I trust the wisdom of waiting, knowing that all seasons serve the soul's curriculum."

*Where rebellion becomes prayer... it is time to gather the medicine from this sacred work.*`
    }
  }
};

// UTILITY FUNCTIONS FOR INTEGRATION

export function generate_contextual_chain(
  mood: string,
  archetype: string, 
  user_preferences: any
) {
  const context: ChainContext = {
    mood: mood as any,
    archetype,
    user_preference_history: user_preferences,
    session_depth_level: 'medium',
    time_available: 'medium'
  };

  return chainer.generate_three_stage_chain(context);
}

export function format_chain_for_display(chain: any) {
  return {
    pre_journal: {
      title: chain.pre_journal_prompt.stage_name,
      invocation: chain.pre_journal_prompt.archetype_invocation,
      prompt: chain.pre_journal_prompt.core_prompt,
      questions: chain.pre_journal_prompt.guided_questions,
      transition: chain.pre_journal_prompt.ceremonial_transition,
      safety: chain.pre_journal_prompt.safety_reminder
    },
    mid_session: {
      title: chain.mid_session_reflection.stage_name,
      invocation: chain.mid_session_reflection.archetype_invocation, 
      prompt: chain.mid_session_reflection.core_prompt,
      questions: chain.mid_session_reflection.guided_questions,
      transition: chain.mid_session_reflection.ceremonial_transition,
      safety: chain.mid_session_reflection.safety_reminder
    },
    closing: {
      title: chain.closing_affirmation.stage_name,
      invocation: chain.closing_affirmation.archetype_invocation,
      prompt: chain.closing_affirmation.core_prompt, 
      questions: chain.closing_affirmation.guided_questions,
      transition: chain.closing_affirmation.ceremonial_transition
    }
  };
}