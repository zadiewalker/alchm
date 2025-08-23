// KHEPERA Accountability Response Generator
// Fierce Love | Gentle Challenge | Compassionate Accountability

export interface AccountabilityResponse {
  fierce_love_opening: string;
  pattern_reflection: string;
  gentle_challenge: string;
  empowerment_question: string;
}

export interface AccountabilityContext {
  user_text: string;
  archetype: ArchetypeId;
  detected_patterns?: string[];
  avoidance_themes?: string[];
  power_themes?: string[];
}

export type ArchetypeId = 'mirror' | 'inner_child' | 'future_you' | 'poet_mentor' | 'older_sibling' | 'spark' | 'ancestor';

export class AccountabilityResponseGenerator {

  // Fierce love opening patterns by archetype
  private readonly FIERCE_LOVE_PATTERNS = {
    older_sibling: {
      tone: 'caring_but_direct',
      openings: [
        'Listen, I care about you too much to let you stay stuck in this.',
        'I see you, and I see your strength, even when you don\\'t.',
        'You know I\\'m going to tell you the truth because I love you.',
        'I\\'m not going to coddle you because you\\'re stronger than that.',
        'Here\\'s what I see, and I\\'m saying this with love:',
        'You\\'re better than the story you\\'re telling yourself right now.'
      ]
    },

    future_you: {
      tone: 'wise_encouragement',
      openings: [
        'Your future self is calling you to step up right now.',
        'The person you\\'re becoming is asking you to make a different choice.',
        'I can see who you\\'re meant to be, and it\\'s time you saw it too.',
        'Your evolved self knows you have everything you need to change this.',
        'The version of you that has overcome this is speaking through me:',
        'Your higher self refuses to let you settle for less than your truth.'
      ]
    },

    mirror: {
      tone: 'honest_reflection',
      openings: [
        'What I\\'m reflecting back to you might be hard to hear, but it\\'s necessary:',
        'The truth I see in your situation is this:',
        'I\\'m going to mirror what you already know but haven\\'t said out loud:',
        'Here\\'s what your own words are telling me about your power:',
        'The reality of your situation requires some honest acknowledgment:',
        'You already know this, but you need to hear it reflected back:'
      ]
    }
  };

  // Pattern reflection without shaming
  private readonly PATTERN_REFLECTION_LANGUAGE = {
    avoidance: {
      observation: 'I notice you keep finding reasons to postpone what matters most to you.',
      reframe: 'Your avoidance is actually your system trying to protect you from disappointment or failure.',
      invitation: 'What if the thing you\\'re avoiding is exactly what wants to set you free?'
    },

    people_pleasing: {
      observation: 'You\\'re spending so much energy managing other people\\'s comfort that you\\'ve forgotten your own needs.',
      reframe: 'Your people-pleasing shows how much you value connection, but real connection requires your authentic self.',
      invitation: 'What would change if you trusted people to handle their own feelings?'
    },

    victim_mindset: {
      observation: 'I see you focusing on everything that\\'s happening to you instead of what you can do about it.',
      reframe: 'Your focus on what you can\\'t control makes sense when you\\'ve felt powerless before.',
      invitation: 'Where is your power in this situation, even if it\\'s small?'
    },

    perfectionism: {
      observation: 'You\\'re waiting for the perfect moment, perfect plan, perfect feeling before you act.',
      reframe: 'Your perfectionism is trying to keep you safe from criticism and failure.',
      invitation: 'What becomes possible when you choose progress over perfection?'
    },

    excuse_making: {
      observation: 'I hear a lot of reasons why you can\\'t, and very few explorations of how you might.',
      reframe: 'Your excuses are protecting you from the vulnerability of trying and potentially failing.',
      invitation: 'What would you attempt if you knew your excuses were just fear in disguise?'
    },

    self_abandonment: {
      observation: 'You keep abandoning your own needs and promises to yourself for everyone else\\'s comfort.',
      reframe: 'This pattern learned that your needs don\\'t matter as much as keeping others happy.',
      invitation: 'What would keeping one promise to yourself teach you about your own worth?'
    },

    blame_focus: {
      observation: 'You\\'re putting all your energy into who\\'s at fault instead of what you want to create.',
      reframe: 'Focusing on blame makes sense when you\\'ve been genuinely wronged and need validation.',
      invitation: 'What becomes available when you shift from blame to choice?'
    }
  };

  // Gentle challenge frameworks
  private readonly GENTLE_CHALLENGE_PATTERNS = {
    older_sibling: [
      'You know what you need to do. The question is: are you going to do it this time?',
      'Stop waiting for someone else to give you permission to live your life.',
      'Your comfort zone is keeping you comfortable, but is it keeping you alive?',
      'You\\'re not a victim of your circumstances—you\\'re the author of your response.',
      'The story you\\'re telling yourself about why you can\\'t is just that—a story.',
      'You\\'ve survived worse than this. What makes you think you can\\'t handle change?'
    ],

    future_you: [
      'The person you\\'re becoming won\\'t accept the excuses that satisfy who you are today.',
      'Your future self is depending on the choice you make right now.',
      'What you tolerate today shapes who you become tomorrow.',
      'Every time you choose comfort over growth, you delay your own evolution.',
      'Your potential is calling, but it requires you to answer with action, not intention.',
      'The gap between who you are and who you could be closes with every brave choice.'
    ],

    mirror: [
      'Your own words reveal the solution you\\'re not willing to see yet.',
      'What you\\'re complaining about is pointing directly to where your power lies.',
      'The energy you\\'re spending on this problem could transform it instead.',
      'You\\'re asking for different results while repeating the same patterns.',
      'The thing you say you want requires the thing you\\'re not willing to do.',
      'Your situation is information, not a sentence—what is it teaching you?'
    ]
  };

  // Empowerment questions that end with action invitation
  private readonly EMPOWERMENT_QUESTIONS = {
    choice_focused: [
      'What would change if you kept your own promise this time?',
      'What\\'s one choice you could make today that your future self would thank you for?',
      'If you were your own best friend, what would you advise yourself to do?',
      'What would you attempt if you trusted yourself to figure it out along the way?',
      'What\\'s the smallest step that would prove to yourself that change is possible?'
    ],

    power_focused: [
      'Where is your power in this situation, and how will you use it?',
      'What would become available if you stopped giving your power away?',
      'Your power doesn\\'t lie in perfection. It lies in honesty and follow-through. How will you practice both?',
      'What boundary do you need to set to reclaim your energy?',
      'What would you do if you believed you deserved better?'
    ],

    action_focused: [
      'What\\'s one thing you could do today to move toward what you actually want?',
      'What would happen if you did the thing you\\'ve been avoiding for just 10 minutes?',
      'What action would align with your values instead of your fears?',
      'If you had to take one step forward today, what would it be?',
      'What would change if you started before you felt ready?'
    ],

    truth_focused: [
      'What truth are you avoiding that would set you free?',
      'What do you already know that you\\'re pretending you don\\'t?',
      'What would you say if you stopped protecting everyone else\\'s feelings?',
      'What conversation have you been avoiding that needs to happen?',
      'What would you choose if you stopped choosing out of fear?'
    ]
  };

  public generateAccountabilityResponse(context: AccountabilityContext): AccountabilityResponse {
    const archetype = context.archetype === 'inner_child' ? 'older_sibling' : context.archetype; // default inner_child to older_sibling for accountability
    const patterns = this.identifyPatterns(context.user_text);
    const empowerment_category = this.selectEmpowermentCategory(context.user_text);

    return {
      fierce_love_opening: this.createFierceLoveOpening(archetype, context),
      pattern_reflection: this.createPatternReflection(patterns, archetype),
      gentle_challenge: this.createGentleChallenge(archetype, context),
      empowerment_question: this.createEmpowermentQuestion(empowerment_category)
    };
  }

  private createFierceLoveOpening(archetype: ArchetypeId, context: AccountabilityContext): string {
    const archetype_key = ['older_sibling', 'future_you', 'mirror'].includes(archetype) ? archetype : 'older_sibling';
    const pattern = this.FIERCE_LOVE_PATTERNS[archetype_key];
    return this.selectRandomFromArray(pattern.openings);
  }

  private createPatternReflection(patterns: string[], archetype: ArchetypeId): string {
    if (patterns.length === 0) {
      return this.createGeneralPatternReflection(archetype);
    }

    const primary_pattern = patterns[0];
    const pattern_info = this.PATTERN_REFLECTION_LANGUAGE[primary_pattern];
    
    if (!pattern_info) {
      return this.createGeneralPatternReflection(archetype);
    }

    // Combine observation with non-shaming reframe
    return `${pattern_info.observation} ${pattern_info.reframe} ${pattern_info.invitation}`;
  }

  private createGentleChallenge(archetype: ArchetypeId, context: AccountabilityContext): string {
    const archetype_key = ['older_sibling', 'future_you', 'mirror'].includes(archetype) ? archetype : 'older_sibling';
    const challenges = this.GENTLE_CHALLENGE_PATTERNS[archetype_key];
    return this.selectRandomFromArray(challenges);
  }

  private createEmpowermentQuestion(category: string): string {
    const questions = this.EMPOWERMENT_QUESTIONS[category] || this.EMPOWERMENT_QUESTIONS.choice_focused;
    return this.selectRandomFromArray(questions);
  }

  // Helper methods
  private identifyPatterns(text: string): string[] {
    const patterns = [];
    const text_lower = text.toLowerCase();

    const pattern_indicators = {
      avoidance: ['keep putting off', 'avoiding', 'don\\'t want to', 'procrastinating', 'later'],
      people_pleasing: ['don\\'t want to upset', 'keep everyone happy', 'can\\'t say no', 'put others first'],
      victim_mindset: ['happening to me', 'can\\'t control', 'nothing i can do', 'always happens'],
      perfectionism: ['not ready', 'not good enough', 'wait until', 'perfect time', 'not right'],
      excuse_making: ['can\\'t because', 'too hard', 'don\\'t have time', 'not possible', 'but'],
      self_abandonment: ['put myself last', 'my needs don\\'t matter', 'for everyone else', 'sacrifice'],
      blame_focus: ['it\\'s their fault', 'because of them', 'they made me', 'blame', 'their problem']
    };

    for (const [pattern, indicators] of Object.entries(pattern_indicators)) {
      if (indicators.some(indicator => text_lower.includes(indicator))) {
        patterns.push(pattern);
      }
    }

    return patterns;
  }

  private selectEmpowermentCategory(text: string): string {
    const text_lower = text.toLowerCase();
    
    if (text_lower.includes('don\\'t know what to do') || text_lower.includes('confused')) {
      return 'choice_focused';
    } else if (text_lower.includes('powerless') || text_lower.includes('control') || text_lower.includes('helpless')) {
      return 'power_focused';
    } else if (text_lower.includes('stuck') || text_lower.includes('not moving') || text_lower.includes('same place')) {
      return 'action_focused';
    } else if (text_lower.includes('lying to myself') || text_lower.includes('pretending') || text_lower.includes('honest')) {
      return 'truth_focused';
    }
    
    return 'choice_focused'; // default
  }

  private createGeneralPatternReflection(archetype: ArchetypeId): string {
    const general_reflections = {
      older_sibling: 'You\\'re giving away your power to circumstances instead of owning your choices. Your patterns serve a purpose, but they\\'re not serving your growth anymore.',
      
      future_you: 'The patterns you\\'re repeating are keeping you in your current story when you\\'re ready for a new chapter. Your growth requires different choices than your comfort does.',
      
      mirror: 'What I see reflected in your words is someone who knows what they need to do but is looking for reasons to avoid doing it. Your resistance is information about what matters most.'
    };

    const key = ['older_sibling', 'future_you', 'mirror'].includes(archetype) ? archetype : 'older_sibling';
    return general_reflections[key];
  }

  private selectRandomFromArray(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Claude Integration Prompt
export function generateAccountabilityPrompt(user_text: string, archetype?: ArchetypeId): string {
  const selected_archetype = archetype || 'older_sibling';
  
  return `You are KHEPERA in accountability mode - fierce love with gentle challenge.

Journal entry: "${user_text}"
Archetype: ${selected_archetype}

Create an accountability response with these elements:

FIERCE LOVE OPENING:
- Use ${selected_archetype} voice:
  * older_sibling: "Listen, I care about you too much to let you stay stuck" - caring but direct
  * future_you: "Your future self is calling you to step up right now" - wise encouragement
  * mirror: "What I'm reflecting back might be hard to hear, but it's necessary" - honest reflection

PATTERN REFLECTION (without shaming):
- Name what you observe in their behavior patterns
- Reframe the pattern as protective/adaptive (not pathological)
- Invite curiosity about the pattern's purpose
- Examples: "Your avoidance is your system trying to protect you from disappointment"

GENTLE CHALLENGE:
- Challenge without attacking
- Point to their power and choice
- Avoid fix-it logic - invite self-responsibility
- Examples: "Your comfort zone is keeping you comfortable, but is it keeping you alive?"

EMPOWERMENT QUESTION (end with specific action invitation):
- Must end with a question that invites action
- Focus on their power, choice, truth, or next step
- Examples: 
  * "What would change if you kept your own promise this time?"
  * "Your power doesn't lie in perfection. It lies in honesty and follow-through. How will you practice both?"
  * "What's one thing you could do today to move toward what you actually want?"

TONE REQUIREMENTS:
- Fierce yet loving - like someone who cares too much to let you settle
- Challenge gently - point to truth without attacking
- Reflect patterns without shaming or pathologizing
- Invite self-responsibility without pressure
- End with empowering question that calls for action

AVOID:
- Fix-it solutions or advice-giving
- Shaming or judgment language
- Telling them what they "should" do
- Making them wrong for their patterns
- Pressure or urgency - invite choice instead

Create a response that feels like tough love from someone who sees their potential and refuses to let them settle for less than their truth.`;
}

// Example responses for testing
export const ACCOUNTABILITY_RESPONSE_EXAMPLES = {
  avoidance_older_sibling: {
    user_text: "I keep putting off applying for jobs because I'm afraid of rejection",
    archetype: 'older_sibling' as ArchetypeId,
    expected_response: {
      fierce_love_opening: "Listen, I care about you too much to let you stay stuck in this fear.",
      pattern_reflection: "I notice you keep finding reasons to postpone what matters most to you. Your avoidance is actually your system trying to protect you from disappointment or failure. What if the thing you're avoiding is exactly what wants to set you free?",
      gentle_challenge: "Your comfort zone is keeping you comfortable, but is it keeping you alive? You're not a victim of rejection—you're the author of your response to it.",
      empowerment_question: "What would change if you kept your own promise this time and applied to just one job today?"
    }
  },

  people_pleasing_future_you: {
    user_text: "I can never say no to people and end up exhausted trying to keep everyone happy",
    archetype: 'future_you' as ArchetypeId,
    expected_response: {
      fierce_love_opening: "Your future self is calling you to step up right now and reclaim your energy.",
      pattern_reflection: "You're spending so much energy managing other people's comfort that you've forgotten your own needs. Your people-pleasing shows how much you value connection, but real connection requires your authentic self. What would change if you trusted people to handle their own feelings?",
      gentle_challenge: "The person you're becoming won't accept the excuses that satisfy who you are today. Every time you choose others' comfort over your own truth, you delay your own evolution.",
      empowerment_question: "What boundary do you need to set to reclaim your energy, and when will you set it?"
    }
  },

  victim_mindset_mirror: {
    user_text: "Everything always goes wrong for me and there's nothing I can do about it",
    archetype: 'mirror' as ArchetypeId,
    expected_response: {
      fierce_love_opening: "What I'm reflecting back to you might be hard to hear, but it's necessary.",
      pattern_reflection: "I see you focusing on everything that's happening to you instead of what you can do about it. Your focus on what you can't control makes sense when you've felt powerless before. Where is your power in this situation, even if it's small?",
      gentle_challenge: "What you're complaining about is pointing directly to where your power lies. You're asking for different results while repeating the same patterns.",
      empowerment_question: "Where is your power in this situation, and how will you use it today?"
    }
  }
};