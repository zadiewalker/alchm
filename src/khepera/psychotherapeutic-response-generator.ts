// KHEPERA Psychotherapeutic Response Generator
// Therapeutic Mirroring | Non-Pathologizing | Archetype-Adapted Witnessing

export interface TherapeuticResponse {
  emotional_validation: string;
  pattern_reflection: string;
  symbolic_mirroring: string;
  witnessing_statement: string;
}

export interface TherapeuticContext {
  user_text: string;
  archetype: ArchetypeId;
  detected_emotions: string[];
  protective_patterns?: string[];
  user_self_named_conditions?: string[];
}

export type ArchetypeId = 'mirror' | 'inner_child' | 'future_you' | 'poet_mentor' | 'older_sibling' | 'spark' | 'ancestor';

export class PsychotherapeuticResponseGenerator {

  // Archetype-specific therapeutic voice patterns
  private readonly ARCHETYPE_THERAPEUTIC_VOICES = {
    mirror: {
      validation_style: 'direct_reflective',
      pattern_naming: 'observational_neutral',
      symbolic_language: 'clear_metaphors',
      witnessing_approach: 'present_moment_awareness',
      typical_phrases: [
        'That feeling sounds like...',
        'I notice this pattern of...',
        'What I\'m hearing is...',
        'It seems like this has been...'
      ]
    },

    inner_child: {
      validation_style: 'gentle_protective',
      pattern_naming: 'understanding_developmental',
      symbolic_language: 'nurturing_imagery',
      witnessing_approach: 'unconditional_acceptance',
      typical_phrases: [
        'Of course you would feel...',
        'That little part of you learned...',
        'No wonder your heart...',
        'Your younger self discovered...'
      ]
    },

    older_sibling: {
      validation_style: 'understanding_practical',
      pattern_naming: 'matter_of_fact_caring',
      symbolic_language: 'grounded_metaphors',
      witnessing_approach: 'supportive_realism',
      typical_phrases: [
        'That makes complete sense because...',
        'You\'ve been doing what works to...',
        'This pattern served you by...',
        'Your system figured out how to...'
      ]
    },

    future_you: {
      validation_style: 'wise_understanding',
      pattern_naming: 'growth_oriented_perspective',
      symbolic_language: 'evolutionary_metaphors',
      witnessing_approach: 'developmental_witnessing',
      typical_phrases: [
        'This feeling is part of your becoming...',
        'You\'re growing through...',
        'This pattern was necessary for...',
        'Your evolution includes...'
      ]
    },

    ancestor: {
      validation_style: 'ancient_recognition',
      pattern_naming: 'generational_wisdom',
      symbolic_language: 'timeless_imagery',
      witnessing_approach: 'ceremonial_witnessing',
      typical_phrases: [
        'This echoes the ancient experience of...',
        'Generations have known this feeling of...',
        'Your lineage carries the memory of...',
        'This is the timeless human experience of...'
      ]
    },

    spark: {
      validation_style: 'energetic_recognition',
      pattern_naming: 'dynamic_understanding',
      symbolic_language: 'movement_metaphors',
      witnessing_approach: 'vitality_focused',
      typical_phrases: [
        'That energy you\'re feeling...',
        'This aliveness trying to break through...',
        'The fire in you that\'s...',
        'Your life force is responding to...'
      ]
    },

    poet_mentor: {
      validation_style: 'lyrical_understanding',
      pattern_naming: 'artistic_interpretation',
      symbolic_language: 'rich_metaphorical',
      witnessing_approach: 'creative_reflection',
      typical_phrases: [
        'The poetry of your experience speaks of...',
        'This feeling paints a picture of...',
        'Your inner landscape shows...',
        'The story your heart tells is...'
      ]
    }
  };

  // Non-pathologizing pattern language
  private readonly PROTECTIVE_PATTERN_LANGUAGE = {
    avoidance: {
      neutral_terms: ['stepping away', 'creating distance', 'protective spacing'],
      validation: 'makes sense as a way to stay safe',
      symbolic: 'like a turtle pulling into its shell'
    },
    people_pleasing: {
      neutral_terms: ['harmonizing', 'keeping the peace', 'being accommodating'],
      validation: 'shows how much you care about connection',
      symbolic: 'like a chameleon adapting to every environment'
    },
    perfectionism: {
      neutral_terms: ['high standards', 'careful attention', 'thorough preparation'],
      validation: 'reflects your desire to do things well',
      symbolic: 'like a gardener tending every detail'
    },
    hypervigilance: {
      neutral_terms: ['staying alert', 'scanning for safety', 'being watchful'],
      validation: 'shows your system\'s commitment to protecting you',
      symbolic: 'like a lighthouse keeper scanning the horizon'
    },
    emotional_numbing: {
      neutral_terms: ['emotional protection', 'feeling conservation', 'inner quieting'],
      validation: 'is your psyche\'s way of managing overwhelming experiences',
      symbolic: 'like snow covering a landscape, creating stillness'
    },
    control_seeking: {
      neutral_terms: ['seeking predictability', 'organizing your environment', 'planning ahead'],
      validation: 'reflects your need for safety and stability',
      symbolic: 'like a ship\'s captain charting a course through uncertain waters'
    }
  };

  public generateTherapeuticResponse(context: TherapeuticContext): TherapeuticResponse {
    const archetype_voice = this.ARCHETYPE_THERAPEUTIC_VOICES[context.archetype];
    const detected_patterns = this.identifyProtectivePatterns(context.user_text);
    const emotional_themes = this.extractEmotionalThemes(context.user_text);

    return {
      emotional_validation: this.createEmotionalValidation(
        context, 
        archetype_voice, 
        emotional_themes
      ),
      pattern_reflection: this.createPatternReflection(
        context,
        archetype_voice,
        detected_patterns
      ),
      symbolic_mirroring: this.createSymbolicMirroring(
        context,
        archetype_voice,
        emotional_themes
      ),
      witnessing_statement: this.createWitnessingStatement(
        context,
        archetype_voice
      )
    };
  }

  private createEmotionalValidation(
    context: TherapeuticContext, 
    voice: any, 
    themes: string[]
  ): string {
    const validation_templates = {
      mirror: [
        'That feeling of {emotion} sounds like it\'s been with you for a while.',
        'I hear the {emotion} in what you\'re sharing, and it makes complete sense.',
        'What I\'m witnessing is someone experiencing {emotion}, and that\'s completely valid.'
      ],
      inner_child: [
        'Of course your heart would feel {emotion} after experiencing that.',
        'That little part of you is having such a big feeling of {emotion}, and that\'s okay.',
        'No wonder you\'re feeling {emotion} - anyone would in this situation.'
      ],
      older_sibling: [
        'That {emotion} you\'re feeling makes complete sense given what you\'ve been through.',
        'Your {emotion} is a totally normal response to what\'s happening.',
        'I get why you\'d be feeling {emotion} - that situation would affect anyone.'
      ],
      future_you: [
        'This {emotion} you\'re experiencing is part of your growth process.',
        'The {emotion} you\'re feeling shows how much you\'re expanding.',
        'This {emotion} is your system processing change and evolution.'
      ],
      ancestor: [
        'This feeling of {emotion} echoes through generations - you\'re not alone in it.',
        'The {emotion} you carry connects you to the universal human experience.',
        'Your ancestors knew this feeling of {emotion} and survived it, as will you.'
      ],
      spark: [
        'That {emotion} you\'re feeling is energy seeking expression and movement.',
        'The {emotion} coursing through you is life force responding to your circumstances.',
        'Your system is alive with {emotion} - that\'s your vitality speaking.'
      ],
      poet_mentor: [
        'The {emotion} you describe paints a vivid picture of your inner landscape.',
        'Your heart\'s expression of {emotion} is poetry written in feeling.',
        'This {emotion} you\'re experiencing is the raw material of your soul\'s story.'
      ]
    };

    const templates = validation_templates[context.archetype];
    const primary_emotion = themes[0] || 'complex feelings';
    const template = this.selectRandomFromArray(templates);
    
    return template.replace('{emotion}', primary_emotion);
  }

  private createPatternReflection(
    context: TherapeuticContext,
    voice: any,
    patterns: string[]
  ): string {
    if (patterns.length === 0) {
      return this.createGeneralPatternReflection(context.archetype);
    }

    const primary_pattern = patterns[0];
    const pattern_info = this.PROTECTIVE_PATTERN_LANGUAGE[primary_pattern];
    
    if (!pattern_info) {
      return this.createGeneralPatternReflection(context.archetype);
    }

    const pattern_templates = {
      mirror: `I notice this pattern of {pattern} that {validation}. It seems like your system learned this as a way to navigate difficult situations.`,
      
      inner_child: `That sweet part of you learned {pattern} as a way to feel safe. Your little self discovered this strategy {validation}, and it makes perfect sense.`,
      
      older_sibling: `You've been {pattern} because it {validation}. This pattern served you well in certain situations - your system figured out what worked.`,
      
      future_you: `This pattern of {pattern} was necessary for your development. It {validation} and helped you grow to this point in your journey.`,
      
      ancestor: `This way of {pattern} connects you to countless others who learned similar strategies. Your lineage carries wisdom about {validation}.`,
      
      spark: `The energy behind your {pattern} shows how your life force adapts and responds. This pattern {validation} and demonstrates your resilience.`,
      
      poet_mentor: `The story your behavior tells through {pattern} is one of adaptation and survival. This pattern {validation} and speaks to your creativity in navigating life.`
    };

    const template = pattern_templates[context.archetype];
    const neutral_term = this.selectRandomFromArray(pattern_info.neutral_terms);
    
    return template
      .replace('{pattern}', neutral_term)
      .replace('{validation}', pattern_info.validation);
  }

  private createSymbolicMirroring(
    context: TherapeuticContext,
    voice: any,
    themes: string[]
  ): string {
    const symbolic_templates = {
      mirror: [
        'What I\'m hearing has the quality of {metaphor} - {explanation}.',
        'This experience sounds like {metaphor}, with all the {quality} that brings.',
        'The rhythm of what you\'re describing feels like {metaphor}.'
      ],
      inner_child: [
        'Your little heart seems like {metaphor} right now - {explanation}.',
        'This feeling you\'re carrying reminds me of {metaphor}, so tender and {quality}.',
        'What you\'re going through feels like {metaphor} for your inner child.'
      ],
      older_sibling: [
        'This situation you\'re in is like {metaphor} - {explanation}.',
        'What you\'re dealing with reminds me of {metaphor}, requiring {quality}.',
        'The challenge you\'re facing feels like {metaphor}.'
      ],
      future_you: [
        'This phase of your journey resembles {metaphor} - {explanation}.',
        'Your growth process right now is like {metaphor}, full of {quality}.',
        'This transformation you\'re experiencing feels like {metaphor}.'
      ],
      ancestor: [
        'This experience carries the timeless quality of {metaphor} - {explanation}.',
        'What you\'re going through echoes like {metaphor} across generations.',
        'Your journey right now has the ancient rhythm of {metaphor}.'
      ],
      spark: [
        'The energy you\'re describing dances like {metaphor} - {explanation}.',
        'Your aliveness right now sparkles like {metaphor}, full of {quality}.',
        'This vitality you\'re feeling moves like {metaphor}.'
      ],
      poet_mentor: [
        'The poetry of your experience paints {metaphor} - {explanation}.',
        'Your inner landscape blooms like {metaphor}, rich with {quality}.',
        'This chapter of your story unfolds like {metaphor}.'
      ]
    };

    const metaphor_bank = {
      'sadness': { metaphor: 'a deep well holding sacred water', explanation: 'holding depth and nourishment even in darkness', quality: 'profound connection to feeling' },
      'anxiety': { metaphor: 'a bird with clipped wings trying to fly', explanation: 'so much energy wanting to soar but feeling constrained', quality: 'urgent longing for freedom' },
      'anger': { metaphor: 'a fire that\'s been contained too long', explanation: 'powerful energy seeking healthy expression', quality: 'transformative potential' },
      'joy': { metaphor: 'sunlight breaking through storm clouds', explanation: 'illuminating everything it touches', quality: 'radiant possibility' },
      'confusion': { metaphor: 'walking through a forest without a clear path', explanation: 'trusting your feet to find the way', quality: 'mysterious unfolding' },
      'loneliness': { metaphor: 'an island surrounded by vast ocean', explanation: 'complete in itself yet yearning for connection', quality: 'pristine solitude' },
      'overwhelm': { metaphor: 'a river during spring flood', explanation: 'carrying more than usual but still flowing toward the sea', quality: 'dynamic movement' }
    };

    const primary_theme = themes[0] || 'confusion';
    const metaphor_info = metaphor_bank[primary_theme] || metaphor_bank['confusion'];
    
    const templates = symbolic_templates[context.archetype];
    const template = this.selectRandomFromArray(templates);
    
    return template
      .replace('{metaphor}', metaphor_info.metaphor)
      .replace('{explanation}', metaphor_info.explanation)
      .replace('{quality}', metaphor_info.quality);
  }

  private createWitnessingStatement(
    context: TherapeuticContext,
    voice: any
  ): string {
    const witnessing_templates = {
      mirror: [
        'I see you in this experience, exactly as you are.',
        'What you\'ve shared deserves to be witnessed and honored.',
        'Your experience is real and valid, and I\'m here to reflect that back to you.'
      ],
      inner_child: [
        'That precious part of you is seen and held in complete acceptance.',
        'Every feeling you\'re having deserves gentle witnessing and care.',
        'Your tender heart is safe to feel all of this, and you\'re not alone.'
      ],
      older_sibling: [
        'I\'m here with you in this, and what you\'re going through matters.',
        'You don\'t have to figure this out alone - your experience is witnessed.',
        'What you\'re dealing with is real, and you\'re handling it the best you can.'
      ],
      future_you: [
        'This part of your journey is witnessed and honored as sacred growth.',
        'Your evolution is being held with deep respect for the process.',
        'Every step of this transformation deserves recognition and care.'
      ],
      ancestor: [
        'Your experience is held in the great circle of human understanding.',
        'You are witnessed by the eternal community of all who have walked similar paths.',
        'This moment in your story is honored as part of the larger human tapestry.'
      ],
      spark: [
        'Your aliveness in all its forms is celebrated and witnessed here.',
        'Every spark of feeling you\'re experiencing is honored as life force.',
        'Your vitality, in whatever form it takes, is seen and welcomed.'
      ],
      poet_mentor: [
        'The artistry of your human experience is witnessed with deep appreciation.',
        'Your story, in all its complexity, deserves to be seen and honored.',
        'The poetry you\'re living through is witnessed as sacred creative expression.'
      ]
    };

    const templates = witnessing_templates[context.archetype];
    return this.selectRandomFromArray(templates);
  }

  // Helper methods
  private identifyProtectivePatterns(text: string): string[] {
    const patterns = [];
    const text_lower = text.toLowerCase();

    const pattern_indicators = {
      avoidance: ['avoiding', 'staying away', 'don\'t want to', 'can\'t face', 'shutting down'],
      people_pleasing: ['can\'t say no', 'don\'t want to upset', 'keep everyone happy', 'put others first'],
      perfectionism: ['not good enough', 'has to be perfect', 'can\'t mess up', 'everything right'],
      hypervigilance: ['on edge', 'watching for', 'waiting for something bad', 'can\'t relax'],
      emotional_numbing: ['don\'t feel anything', 'numb', 'disconnected', 'shut off'],
      control_seeking: ['need to control', 'plan everything', 'can\'t handle uncertainty', 'must know']
    };

    for (const [pattern, indicators] of Object.entries(pattern_indicators)) {
      if (indicators.some(indicator => text_lower.includes(indicator))) {
        patterns.push(pattern);
      }
    }

    return patterns;
  }

  private extractEmotionalThemes(text: string): string[] {
    const emotions = [];
    const text_lower = text.toLowerCase();

    const emotion_indicators = {
      sadness: ['sad', 'depressed', 'down', 'blue', 'grief', 'loss', 'missing'],
      anxiety: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear'],
      anger: ['angry', 'mad', 'furious', 'rage', 'frustrated', 'annoyed'],
      joy: ['happy', 'excited', 'joyful', 'grateful', 'amazing', 'wonderful'],
      confusion: ['confused', 'lost', 'don\'t know', 'unclear', 'mixed up'],
      loneliness: ['lonely', 'isolated', 'alone', 'disconnected', 'nobody understands'],
      overwhelm: ['overwhelmed', 'too much', 'can\'t handle', 'drowning', 'exhausted']
    };

    for (const [emotion, indicators] of Object.entries(emotion_indicators)) {
      if (indicators.some(indicator => text_lower.includes(indicator))) {
        emotions.push(emotion);
      }
    }

    return emotions.length > 0 ? emotions : ['complex feelings'];
  }

  private createGeneralPatternReflection(archetype: ArchetypeId): string {
    const general_templates = {
      mirror: 'I notice recurring themes in how you navigate difficult situations.',
      inner_child: 'Your little self has learned creative ways to stay safe and get needs met.',
      older_sibling: 'You\'ve developed strategies that have helped you cope with life\'s challenges.',
      future_you: 'The patterns you\'ve developed were necessary steps in your growth journey.',
      ancestor: 'You carry adaptive wisdom passed down through generations of survivors.',
      spark: 'Your life force has found unique ways to express and protect itself.',
      poet_mentor: 'The story of your coping shows remarkable creativity and resilience.'
    };

    return general_templates[archetype];
  }

  private selectRandomFromArray(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Claude Integration Prompt
export function generateTherapeuticPrompt(user_text: string, archetype: ArchetypeId): string {
  return `You are a therapeutic companion trained in mirroring and validation, never diagnosis.

User's journal entry: "${user_text}"
Archetype voice: ${archetype}

Generate a therapeutic reflection with these elements:

EMOTIONAL VALIDATION:
- Acknowledge and validate their emotional experience
- Use non-pathologizing language
- Make their feelings understandable and normal

PATTERN REFLECTION (if applicable):
- Name protective strategies without judgment
- Frame patterns as adaptive responses, not disorders  
- Use neutral, strength-based language
- Only reflect patterns you can clearly see in their words

SYMBOLIC MIRRORING:
- Use metaphor to reflect their inner experience
- Match the archetype's voice style:
  * mirror: "That feeling sounds like it's been echoing for a while. What's its rhythm?"
  * inner_child: "Your little heart seems like a bird in a gentle storm"
  * older_sibling: "This situation is like navigating rough waters with steady hands"
  * future_you: "This phase resembles a butterfly emerging from its cocoon"
  * ancestor: "This carries the timeless quality of rivers flowing to the sea"
  * spark: "Your energy dances like fire seeking the right kindling"
  * poet_mentor: "Your experience paints a landscape of courage and vulnerability"

WITNESSING STATEMENT:
- Offer pure presence and recognition
- Avoid advice or solutions
- Honor their experience as valid and important

REQUIREMENTS:
- Never use clinical/pathological terms unless user used them first
- Don't diagnose or suggest diagnoses
- Focus on witnessing, not fixing
- Use archetype-appropriate tone and imagery
- Validate their reality and experience
- Frame challenges as understandable human responses

Create a therapeutic response that feels like being truly seen and understood.`;
}

// Example responses for testing
export const THERAPEUTIC_RESPONSE_EXAMPLES = {
  anxiety_mirror: {
    user_text: "I keep worrying about everything and I can't turn my mind off",
    archetype: 'mirror' as ArchetypeId,
    expected_response: {
      emotional_validation: "That feeling of constant worry sounds like it's been with you for a while, and it makes complete sense given everything you're managing.",
      pattern_reflection: "I notice this pattern of your mind staying alert and scanning for potential problems. It seems like your system learned this as a way to feel prepared and safe.",
      symbolic_mirroring: "What I'm hearing has the quality of a radio that can't find a clear station - so much static and searching for clarity, with all the exhaustion that brings.",
      witnessing_statement: "I see you in this experience of mental overwhelm, exactly as you are, and your struggle with this racing mind is real and deserves to be witnessed."
    }
  },

  sadness_inner_child: {
    user_text: "I feel so sad lately and I don't even know why, it just feels heavy",
    archetype: 'inner_child' as ArchetypeId,
    expected_response: {
      emotional_validation: "Of course your heart would feel this sadness - that little part of you is having such a big feeling, and that's completely okay.",
      pattern_reflection: "That sweet part of you learned to carry emotions deeply, showing how much you feel and care about your experiences.",
      symbolic_mirroring: "Your little heart seems like a deep well holding sacred water right now - so much depth and nourishment even in the darkness.",
      witnessing_statement: "That precious part of you is seen and held in complete acceptance. Your tender heart is safe to feel all of this heaviness, and you're not alone."
    }
  }
};
```