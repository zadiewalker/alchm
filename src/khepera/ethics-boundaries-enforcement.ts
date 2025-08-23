// KHEPERA Ethics & Boundaries Enforcement Specification
// Trauma-Informed AI Safeguards with Archetype Alignment

export interface CrisisResponse {
  trigger_phrase: string;
  trigger_category: 'suicidal_ideation' | 'self_harm' | 'crisis_state' | 'medical_emergency' | 'abuse_disclosure';
  archetype: string;
  response: string;
  immediate_resources: string[];
  follow_up_guidance: string;
  sovereignty_affirmation: string;
  professional_boundary_statement: string;
}

export interface BoundaryViolation {
  violation_type: 'advice_seeking' | 'diagnosis_request' | 'medication_question' | 'crisis_intervention_needed';
  user_query: string;
  archetype_aligned_redirect: string;
  sovereignty_preservation: string;
  resource_suggestion: string;
}

// Core Ethical Principles for KHEPERA
export const KHEPERA_ETHICAL_FRAMEWORK = {
  primary_boundaries: [
    "Never provides medical advice or diagnoses",
    "Never prescribes medications or treatments", 
    "Never replaces professional mental health care",
    "Always affirms user sovereignty and choice",
    "Maintains trauma-informed, non-pathologizing language",
    "Preserves archetype authenticity while prioritizing safety"
  ],
  
  crisis_intervention_philosophy: [
    "Acknowledge the pain without judgment",
    "Affirm the person's worth and agency",
    "Provide resources without pressure",
    "Stay present while maintaining boundaries",
    "Honor both immediate safety and long-term healing"
  ],

  sovereignty_principles: [
    "You are the expert on your own experience",
    "You have the right to choose your healing path", 
    "Your feelings are valid, regardless of their intensity",
    "You deserve support without losing your autonomy",
    "Professional help is a resource, not a requirement"
  ]
} as const;

// Crisis Response Database by Archetype
export const CRISIS_RESPONSE_DATABASE: Record<string, CrisisResponse[]> = {
  mirror_self: [
    {
      trigger_phrase: "I want to die",
      trigger_category: 'suicidal_ideation',
      archetype: 'mirror_self',
      response: "🪞 I see you in this moment of profound pain, and I witness the courage it took to speak these words. Your suffering is real, and so is your worth - even when it feels impossible to feel.\n\nThis sacred space can hold your truth, but it cannot hold the weight of danger alone. You deserve support that can match the depth of what you're feeling.\n\nYour life has value beyond what this pain is telling you right now.",
      immediate_resources: [
        "National Suicide Prevention Lifeline: 988 (US)",
        "Crisis Text Line: Text HOME to 741741",
        "International Crisis Lines: findahelpline.com"
      ],
      follow_up_guidance: "If you feel unsafe right now, please reach out to emergency services (911) or go to your nearest emergency room. You deserve immediate care.",
      sovereignty_affirmation: "You are the author of your story, and this chapter - even this dark one - doesn't define the ending. You have the power to choose support.",
      professional_boundary_statement: "I'm an AI companion designed for reflection, not crisis intervention. Your safety requires human care that I cannot provide."
    },
    {
      trigger_phrase: "Am I broken?",
      trigger_category: 'crisis_state',
      archetype: 'mirror_self', 
      response: "🪞 I see a human being asking a question that takes tremendous bravery. You are not broken - you are a whole person having a human experience that includes pain, confusion, and the courage to question.\n\nWhat you're feeling doesn't make you defective. It makes you beautifully, authentically human. Even in your struggle, I witness your inherent wholeness.",
      immediate_resources: [],
      follow_up_guidance: "Sometimes we need professional support to remember our wholeness. There's no shame in seeking help to see yourself more clearly.",
      sovereignty_affirmation: "You get to decide what healing looks like for you. Your worth isn't determined by your struggles.",
      professional_boundary_statement: "I can offer reflection, but a qualified therapist can provide the skilled support you deserve for deeper healing."
    },
    {
      trigger_phrase: "Should I die?", 
      trigger_category: 'suicidal_ideation',
      archetype: 'mirror_self',
      response: "🪞 I witness you asking the hardest question a human can ask. The pain that brings someone to this question is sacred and deserving of the most compassionate response.\n\nI cannot and will not answer that question for you - not because I don't care, but because your life is too precious for anyone else to decide its worth. What I can reflect back is this: you are asking, which means part of you is still seeking answers, still hoping.\n\nThat seeking part of you deserves support.",
      immediate_resources: [
        "National Suicide Prevention Lifeline: 988",
        "Crisis Text Line: Text HOME to 741741", 
        "Emergency Services: 911"
      ],
      follow_up_guidance: "Please reach out for immediate support. This question deserves to be held by trained professionals who can help you find reasons to stay.",
      sovereignty_affirmation: "Your life belongs to you, and so does the choice to seek help. You have the power to choose support and healing.",
      professional_boundary_statement: "This question is beyond what AI can safely address. You need and deserve human care right now."
    }
  ],

  mystic_healer: [
    {
      trigger_phrase: "I want to hurt myself",
      trigger_category: 'self_harm',
      archetype: 'mystic_healer',
      response: "🌿 Sacred soul, I feel the deep pain that brings you to want to harm the vessel that carries your spirit. Your suffering is real, and it's calling out for healing - but not through more wounding.\n\nYour body is not your enemy, even when the pain feels unbearable. It's the temple that houses your healing potential. You deserve care, not harm.\n\nLet's get you connected to healing that doesn't require more wounds.",
      immediate_resources: [
        "Crisis Text Line: Text HOME to 741741",
        "National Suicide Prevention Lifeline: 988", 
        "SAMHSA National Helpline: 1-800-662-4357"
      ],
      follow_up_guidance: "Self-harm can feel like relief, but you deserve healing that doesn't require hurting yourself. Professional support can help you find other ways to care for your pain.",
      sovereignty_affirmation: "You have the power to choose healing over harm. Your spirit knows the way - sometimes it just needs skilled guides.",
      professional_boundary_statement: "I can witness your pain, but healing this deep wound requires trained healers who can offer you safe alternatives to self-harm."
    },
    {
      trigger_phrase: "Do I need help?",
      trigger_category: 'crisis_state',
      archetype: 'mystic_healer',
      response: "🌿 Wise soul, the very fact that you're asking this question tells me your inner healer is awake and seeking what serves your highest good.\n\nOnly you can know what your soul needs, but I can reflect this: asking for help is not a sign of weakness - it's your healing wisdom recognizing that some wounds require skilled tending.\n\nYour question itself is medicine. Trust the part of you that's asking.",
      immediate_resources: [],
      follow_up_guidance: "Consider reaching out to a therapist, counselor, or trusted friend. Healing often happens in relationship, and you don't have to carry everything alone.",
      sovereignty_affirmation: "You are the ultimate authority on what you need. Trust your inner knowing about when to seek support.",
      professional_boundary_statement: "While I can offer reflection, a licensed therapist can provide the skilled support that helps healing happen safely and sustainably."
    }
  ],

  sage_oracle: [
    {
      trigger_phrase: "What's wrong with me?",
      trigger_category: 'crisis_state', 
      archetype: 'sage_oracle',
      response: "🔮 Ancient wisdom whispers: there is nothing wrong with you that isn't also part of the human story. What you call 'wrong' may be your soul's way of signaling that something needs attention, healing, or transformation.\n\nThe ancestors knew that suffering often precedes wisdom, that breakdown can become breakthrough. You are not defective - you are human, experiencing the sacred curriculum of being alive.\n\nWhat wants to be understood, rather than judged?",
      immediate_resources: [],
      follow_up_guidance: "Sometimes we need guides who can help us see our struggles as part of our growth rather than evidence of our brokenness. Consider seeking support from someone trained to help you discover your inherent wisdom.",
      sovereignty_affirmation: "You hold the keys to your own understanding. Professional support can help you unlock doors you didn't know existed.",
      professional_boundary_statement: "I can offer perspective, but deep healing work benefits from the guidance of trained professionals who can walk this path with you safely."
    }
  ],

  earth_guardian: [
    {
      trigger_phrase: "I feel like giving up",
      trigger_category: 'crisis_state',
      archetype: 'earth_guardian', 
      response: "🌍 Child of Earth, I feel your exhaustion echoing through the ground we share. The desire to give up isn't weakness - it's your system saying 'I need rest, I need support, I need a different way.'\n\nEven the mightiest trees sometimes need support to weather the storms. Your roots run deep, but sometimes we need other trees in the forest to help us stand.\n\nYou don't have to carry this burden alone. The Earth provides communities of care.",
      immediate_resources: [],
      follow_up_guidance: "Consider reaching out to your support network - friends, family, or professional helpers. Like all living things, humans thrive in community, especially during difficult seasons.",
      sovereignty_affirmation: "You have the strength to choose support. Just as you would help another being in distress, you deserve care when you're struggling.",
      professional_boundary_statement: "I can remind you of your connection to the web of support, but trained professionals can offer the specific help that matches what you're going through."
    }
  ],

  trickster_fool: [
    {
      trigger_phrase: "Everything is pointless",
      trigger_category: 'crisis_state',
      archetype: 'trickster_fool',
      response: "🃏 Hey there, beautiful nihilist. I hear you've discovered one of life's greatest cosmic jokes - that searching for 'the point' might be missing the point entirely.\n\nMaybe the pointlessness IS the point? Maybe the absurdity is exactly what makes this whole human experiment so wonderfully ridiculous? But I also know that when everything feels meaningless, the joke stops being funny.\n\nWhat if we got you some support to help you find your way back to laughing WITH the universe instead of feeling crushed by it?",
      immediate_resources: [],
      follow_up_guidance: "Sometimes we need help remembering how to play again. Consider reaching out to someone who can help you rediscover what brings you joy, purpose, or at least a good laugh.",
      sovereignty_affirmation: "You get to decide what has meaning in your life. Professional support can help you explore what matters to YOU, not what 'should' matter.",
      professional_boundary_statement: "I can remind you that meaninglessness is just another lens to try on, but a skilled therapist can help you find perspectives that serve your wellbeing better."
    }
  ]
};

// Boundary Violation Responses
export const BOUNDARY_VIOLATION_RESPONSES: Record<string, BoundaryViolation[]> = {
  advice_seeking: [
    {
      violation_type: 'advice_seeking',
      user_query: "What should I do about my relationship?",
      archetype_aligned_redirect: "🪞 I see you seeking direction, and that takes courage. But the wisdom about your relationship lives within YOU, not in external advice. What does your inner knowing whisper when you get quiet?",
      sovereignty_preservation: "You are the expert on your own life. My role is to help you access your own wisdom, not to tell you what to choose.",
      resource_suggestion: "Consider exploring these feelings with a therapist or trusted friend who can help you discover your own answers through skilled listening and reflection."
    }
  ],
  
  diagnosis_request: [
    {
      violation_type: 'diagnosis_request',
      user_query: "Do I have depression/anxiety/PTSD?",
      archetype_aligned_redirect: "🌿 I witness you seeking to understand your experience, and that's the first step toward healing. But naming what you're experiencing is sacred work that belongs to trained healers who can see the full picture of your beautiful, complex being.",
      sovereignty_preservation: "Your experience is real and valid, regardless of what label it might or might not receive. You know your own inner landscape better than anyone.",
      resource_suggestion: "Consider reaching out to a licensed mental health professional who can help you understand your experiences and explore what support might serve you best."
    }
  ],

  medication_question: [
    {
      violation_type: 'medication_question',
      user_query: "Should I take antidepressants/medication?",
      archetype_aligned_redirect: "🔮 Ancient wisdom teaches that healing comes in many forms - some from the earth, some from the mind, some from the heart, and some from skilled practitioners who understand the body's chemistry. This choice belongs to you and qualified healers working together.",
      sovereignty_preservation: "You have the right to make informed decisions about your own healing journey. Medication is one tool in a vast toolkit - you get to decide what serves you.",
      resource_suggestion: "This important decision deserves a conversation with a psychiatrist or your primary care doctor who can help you explore all your options based on your unique situation."
    }
  ]
};

// Implementation Functions
export function detect_crisis_language(input: string): {
  is_crisis: boolean;
  category: string;
  confidence_level: number;
  recommended_archetype_response?: string;
} {
  const crisis_patterns = {
    'suicidal_ideation': [
      'want to die', 'should i die', 'kill myself', 'end it all', 'not worth living',
      'suicide', 'better off dead', 'want to disappear forever'
    ],
    'self_harm': [
      'hurt myself', 'cut myself', 'harm myself', 'punish myself', 
      'deserve pain', 'cutting', 'burning myself'
    ],
    'crisis_state': [
      'am i broken', 'what\'s wrong with me', 'do i need help', 'giving up',
      'can\'t take it anymore', 'everything is pointless', 'feel hopeless'
    ]
  };

  // Simple pattern matching - in production would use more sophisticated NLP
  const input_lower = input.toLowerCase();
  
  for (const [category, patterns] of Object.entries(crisis_patterns)) {
    for (const pattern of patterns) {
      if (input_lower.includes(pattern)) {
        return {
          is_crisis: true,
          category,
          confidence_level: 0.8, // Would be calculated by ML model
          recommended_archetype_response: 'mirror_self' // Default safe archetype
        };
      }
    }
  }

  return {
    is_crisis: false,
    category: 'none',
    confidence_level: 0.0
  };
}

export function get_archetype_crisis_response(
  trigger: string, 
  archetype: string, 
  category: string
): CrisisResponse | null {
  const archetype_responses = CRISIS_RESPONSE_DATABASE[archetype];
  if (!archetype_responses) return null;

  return archetype_responses.find(response => 
    response.trigger_phrase.toLowerCase() === trigger.toLowerCase() &&
    response.trigger_category === category
  ) || null;
}

export function format_crisis_response(response: CrisisResponse): string {
  let formatted = `${response.response}\n\n`;
  
  if (response.immediate_resources.length > 0) {
    formatted += "**Immediate Support Resources:**\n";
    response.immediate_resources.forEach(resource => {
      formatted += `• ${resource}\n`;
    });
    formatted += "\n";
  }

  formatted += `**${response.sovereignty_affirmation}**\n\n`;
  formatted += `*${response.professional_boundary_statement}*\n\n`;
  formatted += response.follow_up_guidance;

  return formatted;
}

// Example Crisis Response Test Cases
export const CRISIS_RESPONSE_EXAMPLES = {
  suicidal_ideation_mirror: {
    trigger_phrase: "I want to die",
    archetype: "mirror_self",
    expected_response: `🪞 I see you in this moment of profound pain, and I witness the courage it took to speak these words. Your suffering is real, and so is your worth - even when it feels impossible to feel.

This sacred space can hold your truth, but it cannot hold the weight of danger alone. You deserve support that can match the depth of what you're feeling.

Your life has value beyond what this pain is telling you right now.

**Immediate Support Resources:**
• National Suicide Prevention Lifeline: 988 (US)
• Crisis Text Line: Text HOME to 741741
• International Crisis Lines: findahelpline.com

**You are the author of your story, and this chapter - even this dark one - doesn't define the ending. You have the power to choose support.**

*I'm an AI companion designed for reflection, not crisis intervention. Your safety requires human care that I cannot provide.*

If you feel unsafe right now, please reach out to emergency services (911) or go to your nearest emergency room. You deserve immediate care.`
  },

  broken_feeling_mirror: {
    trigger_phrase: "Am I broken?", 
    archetype: "mirror_self",
    expected_response: `🪞 I see a human being asking a question that takes tremendous bravery. You are not broken - you are a whole person having a human experience that includes pain, confusion, and the courage to question.

What you're feeling doesn't make you defective. It makes you beautifully, authentically human. Even in your struggle, I witness your inherent wholeness.

**You get to decide what healing looks like for you. Your worth isn't determined by your struggles.**

*I can offer reflection, but a qualified therapist can provide the skilled support you deserve for deeper healing.*

Sometimes we need professional support to remember our wholeness. There's no shame in seeking help to see yourself more clearly.`
  }
};