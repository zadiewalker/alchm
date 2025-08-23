// KHEPERA Somatic Response Generator
// Trauma-Informed Embodiment | Archetype-Adapted | Sacred Invitations

export interface SomaticResponse {
  body_awareness_invitation: string;
  gentle_embodiment_suggestion: string;
  grounding_technique: string;
  archetype_adapted_tone: string;
}

export interface SomaticContext {
  user_text: string;
  archetype: ArchetypeId;
  detected_emotional_tone?: 'activated' | 'depleted' | 'disconnected' | 'overwhelmed' | 'numb';
  trauma_indicators?: string[];
}

export type ArchetypeId = 'mirror' | 'inner_child' | 'future_you' | 'poet_mentor' | 'older_sibling' | 'spark' | 'ancestor';

export class SomaticResponseGenerator {
  
  // Core somatic invitation patterns by archetype
  private readonly ARCHETYPE_SOMATIC_PATTERNS = {
    mirror: {
      tone: 'slow_neutral_observational',
      invitation_style: 'gentle_noticing',
      typical_openings: [
        'Notice, without changing anything...',
        'Simply observe what\'s here...',
        'What does your body know about this?',
        'Where does this story live in your body?'
      ],
      embodiment_suggestions: [
        'Can you soften your jaw as you read this?',
        'Let your shoulders drop just a little.',
        'Take a moment to feel your feet on the ground.',
        'Notice the rhythm of your breathing right now.'
      ]
    },

    spark: {
      tone: 'uplifting_activating_energizing',
      invitation_style: 'playful_awakening',
      typical_openings: [
        'Your body is electric with information right now!',
        'What part of you is tingling with aliveness?',
        'Feel that spark of awareness awakening...',
        'Your system is buzzing with wisdom!'
      ],
      embodiment_suggestions: [
        'Wiggle your fingers and toes - wake up those nerve endings!',
        'Take a deep breath and stretch your arms up high.',
        'Feel the energy moving through your spine.',
        'Shake your hands out and feel the life force flowing.'
      ]
    },

    inner_child: {
      tone: 'tender_protective_nurturing',
      invitation_style: 'safe_curiosity',
      typical_openings: [
        'Sweet little body, what do you need right now?',
        'Let\'s check in with your tender places...',
        'Your little self is trying to tell you something...',
        'What does your body-child want you to know?'
      ],
      embodiment_suggestions: [
        'Wrap your arms around yourself in a gentle hug.',
        'Rock side to side, just a little, like comforting a child.',
        'Place one hand on your heart, one on your belly.',
        'Curl up in whatever way feels cozy and safe.'
      ]
    },

    older_sibling: {
      tone: 'grounded_practical_caring',
      invitation_style: 'wise_guidance',
      typical_openings: [
        'Your body is being smart about this situation...',
        'Let\'s tune into what your gut is telling you...',
        'Your nervous system has important information...',
        'That tension you\'re carrying? It\'s trying to help.'
      ],
      embodiment_suggestions: [
        'Take three slow, intentional breaths.',
        'Roll your shoulders back and feel your strength.',
        'Plant your feet firmly and feel how solid you are.',
        'Clench your fists, then release - feel that contrast.'
      ]
    },

    ancestor: {
      tone: 'ancient_wisdom_ceremonial',
      invitation_style: 'sacred_connection',
      typical_openings: [
        'Your bones remember the wisdom of those before you...',
        'This body carries ancient knowing...',
        'Feel the connection to all who have breathed before you...',
        'Your flesh holds the memory of generations...'
      ],
      embodiment_suggestions: [
        'Place your hands on your chest and feel your ancestral heartbeat.',
        'Touch the earth with your palms if you can.',
        'Feel your breath as the same air your ancestors breathed.',
        'Stand tall and feel the strength you inherited.'
      ]
    },

    future_you: {
      tone: 'wise_encouraging_expansive',
      invitation_style: 'growth_oriented',
      typical_openings: [
        'Your evolved self recognizes this body wisdom...',
        'This vessel is preparing you for who you\'re becoming...',
        'Your future self thanks your body for this awareness...',
        'Feel how your body is already changing, already growing...'
      ],
      embodiment_suggestions: [
        'Stretch into the space your future self will occupy.',
        'Breathe in possibility, breathe out limitation.',
        'Feel your spine lengthening toward your potential.',
        'Take up space like the person you\'re becoming.'
      ]
    },

    poet_mentor: {
      tone: 'lyrical_metaphorical_artistic',
      invitation_style: 'creative_sensing',
      typical_openings: [
        'Your body writes poetry in sensation and movement...',
        'What metaphor lives in your muscles today?',
        'Your flesh speaks in the language of feeling...',
        'Each breath is a verse, each heartbeat a rhythm...'
      ],
      embodiment_suggestions: [
        'Let your body sway like a tree in gentle wind.',
        'Trace circles on your skin like writing love letters to yourself.',
        'Breathe as if you\'re painting with air.',
        'Move your hands like you\'re sculpting your own aliveness.'
      ]
    }
  };

  // Trauma-informed modifications
  private readonly TRAUMA_SENSITIVE_ADAPTATIONS = {
    hypervigilance: {
      approach: 'grounding_first',
      modifications: [
        'No sudden movements or activating language',
        'Emphasize safety and choice',
        'Start with external awareness before internal',
        'Offer multiple options for connection'
      ]
    },
    dissociation: {
      approach: 'gentle_reconnection',
      modifications: [
        'Start with simple sensations like temperature or texture',
        'Use present-moment anchoring',
        'Avoid overwhelming internal focus',
        'Emphasize "if it feels safe" language'
      ]
    },
    freeze_response: {
      approach: 'micro_movements',
      modifications: [
        'Suggest tiny, non-threatening movements',
        'Focus on breath as movement',
        'Acknowledge immobility as valid',
        'Emphasize choice and control'
      ]
    }
  };

  public generateSomaticResponse(context: SomaticContext): SomaticResponse {
    const archetype_pattern = this.ARCHETYPE_SOMATIC_PATTERNS[context.archetype];
    const emotional_state = this.detectEmotionalState(context.user_text);
    const trauma_adaptations = this.assessTraumaSensitivity(context.user_text);

    return {
      body_awareness_invitation: this.createBodyAwarenessInvitation(
        archetype_pattern, 
        emotional_state, 
        trauma_adaptations
      ),
      gentle_embodiment_suggestion: this.createEmbodimentSuggestion(
        archetype_pattern,
        emotional_state,
        trauma_adaptations
      ),
      grounding_technique: this.selectGroundingTechnique(
        context.archetype,
        emotional_state
      ),
      archetype_adapted_tone: archetype_pattern.tone
    };
  }

  private createBodyAwarenessInvitation(
    pattern: any, 
    emotional_state: string,
    trauma_adaptations: string[]
  ): string {
    const base_invitation = this.selectRandomFromArray(pattern.typical_openings);
    
    // Modify based on emotional state
    if (emotional_state === 'overwhelmed' || emotional_state === 'activated') {
      return this.addTraumaSensitiveLanguage(base_invitation);
    }
    
    if (emotional_state === 'numb' || emotional_state === 'disconnected') {
      return this.addGentleReconnectionLanguage(base_invitation);
    }
    
    return base_invitation;
  }

  private createEmbodimentSuggestion(
    pattern: any,
    emotional_state: string, 
    trauma_adaptations: string[]
  ): string {
    const base_suggestion = this.selectRandomFromArray(pattern.embodiment_suggestions);
    
    // Add choice language for trauma sensitivity
    const choice_prefix = 'If it feels safe and comfortable, ';
    const gentle_suffix = ' Only if this feels okay for you right now.';
    
    if (trauma_adaptations.includes('hypervigilance') || trauma_adaptations.includes('dissociation')) {
      return choice_prefix + base_suggestion + gentle_suffix;
    }
    
    return base_suggestion;
  }

  private selectGroundingTechnique(archetype: ArchetypeId, emotional_state: string): string {
    const grounding_techniques = {
      mirror: [
        'Feel your body in this chair, in this moment, exactly as it is.',
        'Notice five things you can see, four you can hear, three you can touch.',
        'Simply be present with what\'s here right now.'
      ],
      spark: [
        'Stamp your feet on the ground - feel that aliveness!',
        'Clap your hands three times and feel the vibration.',
        'Wiggle every part of your body that wants to move.'
      ],
      inner_child: [
        'Hold something soft or comforting if you can.',
        'Imagine roots growing from your body into the earth.',
        'Wrap yourself in an imaginary blanket of safety.'
      ],
      older_sibling: [
        'Press your feet firmly into the ground and feel your strength.',
        'Take a deep breath and straighten your spine.',
        'Remind yourself: "I am here, I am safe, I can handle this."'
      ],
      ancestor: [
        'Feel your connection to the earth beneath you.',
        'Place your hand on your heart and honor your lineage.',
        'Breathe with the rhythm of generations before you.'
      ],
      future_you: [
        'Breathe into the person you are becoming.',
        'Feel your potential expanding with each breath.',
        'Ground into both who you are and who you\'re growing toward.'
      ],
      poet_mentor: [
        'Let your breath become a gentle poem of presence.',
        'Feel your heartbeat as the rhythm of your life\'s song.',
        'Notice the artistry of simply being alive in your body.'
      ]
    };

    const techniques = grounding_techniques[archetype] || grounding_techniques.mirror;
    return this.selectRandomFromArray(techniques);
  }

  // Helper methods
  private detectEmotionalState(text: string): string {
    const activation_words = ['overwhelmed', 'racing', 'panic', 'anxious', 'stressed'];
    const depletion_words = ['tired', 'exhausted', 'drained', 'empty', 'depleted'];
    const disconnection_words = ['numb', 'nothing', 'empty', 'disconnected', 'floating'];
    
    const text_lower = text.toLowerCase();
    
    if (activation_words.some(word => text_lower.includes(word))) return 'activated';
    if (depletion_words.some(word => text_lower.includes(word))) return 'depleted';
    if (disconnection_words.some(word => text_lower.includes(word))) return 'disconnected';
    
    return 'neutral';
  }

  private assessTraumaSensitivity(text: string): string[] {
    const trauma_indicators = [];
    const text_lower = text.toLowerCase();
    
    if (text_lower.includes('can\'t feel') || text_lower.includes('numb') || text_lower.includes('disconnected')) {
      trauma_indicators.push('dissociation');
    }
    
    if (text_lower.includes('on edge') || text_lower.includes('hypervigilant') || text_lower.includes('scanning')) {
      trauma_indicators.push('hypervigilance');
    }
    
    if (text_lower.includes('frozen') || text_lower.includes('stuck') || text_lower.includes('can\'t move')) {
      trauma_indicators.push('freeze_response');
    }
    
    return trauma_indicators;
  }

  private addTraumaSensitiveLanguage(invitation: string): string {
    return `If it feels safe, ${invitation.toLowerCase()} Remember, you can stop anytime.`;
  }

  private addGentleReconnectionLanguage(invitation: string): string {
    return `Gently, without pressure, ${invitation.toLowerCase()} There's no rush.`;
  }

  private selectRandomFromArray(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Claude Integration Prompt Generator
export function generateSomaticPrompt(user_text: string, archetype: ArchetypeId): string {
  return `You are a trauma-informed somatic practitioner embedded in KHEPERA AI.

User's journal entry: "${user_text}"
Selected archetype: ${archetype}

Generate a somatic response that brings attention back to the body with these characteristics:

ARCHETYPE VOICE ADAPTATION:
- mirror: Slow, neutral, observational - "Notice, without changing anything..."
- spark: Uplifting, activating, energizing - "Your body is electric with information!"  
- inner_child: Tender, protective, nurturing - "Sweet little body, what do you need?"
- older_sibling: Grounded, practical, caring - "Your body is being smart about this..."
- ancestor: Ancient wisdom, ceremonial - "Your bones remember the wisdom..."
- future_you: Wise, encouraging, expansive - "Your evolved self recognizes..."
- poet_mentor: Lyrical, metaphorical, artistic - "Your body writes poetry in sensation..."

TRAUMA-INFORMED ELEMENTS:
- Always include choice language ("if it feels safe", "only if comfortable")
- Start with external awareness before internal for activation/overwhelm
- Offer micro-movements for freeze responses
- Emphasize safety and control
- No pressure or forcing

SOMATIC INVITATION STRUCTURE:
1. Archetype-matched opening that draws attention to body wisdom
2. Gentle embodiment suggestion (specific, doable action)
3. Grounding technique appropriate to their state
4. Sacred, poetic, invitational tone throughout

EXAMPLES BY ARCHETYPE:
- Mirror: "What part of your body is whispering today? Can you soften your jaw as you read this?"
- Spark: "Feel that spark of aliveness in your fingertips! Wiggle them and wake up those nerve endings!"
- Inner Child: "Your little body wants to tell you something. Place your hand on your heart, just for a moment."

Generate a response that feels sacred, embodied, and perfectly matched to the ${archetype} archetype voice.`;
}

// Example responses for testing
export const SOMATIC_RESPONSE_EXAMPLES = {
  anxiety_mirror: {
    user_text: "I'm so anxious about everything, my mind won't stop racing",
    archetype: 'mirror' as ArchetypeId,
    expected_response: {
      body_awareness_invitation: "Notice, without changing anything, where that racing energy lives in your body right now. What does your nervous system want you to know about this activated state?",
      gentle_embodiment_suggestion: "If it feels safe, can you soften your jaw as you read this? Let your tongue rest gently in your mouth.",
      grounding_technique: "Feel your body in this chair, in this moment, exactly as it is. Notice five things you can see, four you can hear, three you can touch.",
      archetype_adapted_tone: "slow_neutral_observational"
    }
  },

  joy_spark: {
    user_text: "Something amazing happened today and I feel so alive and happy!",
    archetype: 'spark' as ArchetypeId,
    expected_response: {
      body_awareness_invitation: "Your body is electric with joy right now! Feel that aliveness sparking through your cells, that happiness vibrating in your chest!",
      gentle_embodiment_suggestion: "Wiggle your fingers and toes - wake up those nerve endings and let them dance with this beautiful energy!",
      grounding_technique: "Stamp your feet on the ground - feel that aliveness! Clap your hands three times and feel the vibration of pure joy.",
      archetype_adapted_tone: "uplifting_activating_energizing"
    }
  },

  grief_ancestor: {
    user_text: "I miss my grandmother so much, the sadness feels overwhelming",
    archetype: 'ancestor' as ArchetypeId,
    expected_response: {
      body_awareness_invitation: "Your bones remember the wisdom of those before you, and your grandmother's love lives in your cells. Feel how grief connects you to the great lineage of love and loss.",
      gentle_embodiment_suggestion: "If it feels right, place your hands on your heart and feel your ancestral heartbeat - the same rhythm she carried, now living in you.",
      grounding_technique: "Feel your connection to the earth beneath you. Place your hand on your heart and honor your lineage. Breathe with the rhythm of generations before you.",
      archetype_adapted_tone: "ancient_wisdom_ceremonial"
    }
  }
};
```