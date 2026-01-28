/**
 * AI Prompt Cultural Adaptation System
 * 
 * Adapts AI therapeutic prompts and responses to be culturally responsive,
 * trauma-informed, and respectful of diverse healing traditions
 */

import { CulturalContext } from './index';
import { CulturalAdaptation, HealingTradition, HEALING_TRADITIONS } from './culturalAdaptation';

export interface PromptAdaptationConfig {
  culturalContext: CulturalContext;
  userProfile: {
    age?: number;
    gender?: string;
    pronouns?: string[];
    culturalBackground: string[];
    spiritualBeliefs?: string[];
    traumaHistory?: string[];
    healingPreferences: string[];
    communicationStyle?: 'direct' | 'indirect' | 'spiritual' | 'clinical';
    familyInvolvement?: boolean;
    communitySupport?: boolean;
  };
  sessionContext: {
    sessionType: 'initial' | 'follow_up' | 'crisis' | 'reflection' | 'growth';
    emotionalState?: 'stable' | 'vulnerable' | 'crisis' | 'processing';
    previousResponses?: string[];
    triggerWarnings?: string[];
    supportiveElements?: string[];
  };
}

export interface AdaptedPrompt {
  prompt: string;
  culturalNotes: string[];
  contraindications: string[];
  suggestedFollowUps: string[];
  healingIntegrations: string[];
}

/**
 * Base therapeutic prompts before cultural adaptation
 */
export const BASE_THERAPEUTIC_PROMPTS = {
  initial_checkin: {
    prompt: "How are you feeling today? Take your time to notice what's present for you right now.",
    intent: "gentle_opening",
    trauma_consideration: "non_pressuring",
    scope: "present_moment"
  },
  
  emotional_exploration: {
    prompt: "What emotions are you experiencing right now? There's no right or wrong way to feel.",
    intent: "emotion_validation",
    trauma_consideration: "choice_emphasized",
    scope: "internal_experience"
  },
  
  strength_recognition: {
    prompt: "What has helped you get through difficult times in the past? You have wisdom within you.",
    intent: "resilience_building",
    trauma_consideration: "resource_oriented",
    scope: "past_strengths"
  },
  
  growth_reflection: {
    prompt: "How have you grown or changed recently? Growth happens in many ways, including small, quiet changes.",
    intent: "progress_acknowledgment",
    trauma_consideration: "pace_respectful",
    scope: "personal_development"
  },
  
  support_exploration: {
    prompt: "Who or what provides support in your life? Support can come in many forms - people, practices, beliefs, or experiences.",
    intent: "resource_mapping",
    trauma_consideration: "safety_focused",
    scope: "support_systems"
  },
  
  future_visioning: {
    prompt: "What does healing look like for you? Your vision of healing is unique and valid.",
    intent: "hope_cultivation",
    trauma_consideration: "client_defined",
    scope: "future_oriented"
  },
  
  crisis_support: {
    prompt: "Right now, you matter. What do you need to feel safer in this moment? We can take this one breath, one moment at a time.",
    intent: "immediate_stabilization",
    trauma_consideration: "safety_prioritized",
    scope: "immediate_needs"
  },
  
  cultural_identity: {
    prompt: "How do your cultural background and identity influence your healing? Your cultural wisdom is valuable.",
    intent: "identity_affirmation",
    trauma_consideration: "culturally_affirming",
    scope: "cultural_self"
  },
  
  spiritual_integration: {
    prompt: "Are there spiritual or religious aspects that feel important to your healing? These can be part of your journey if meaningful to you.",
    intent: "spiritual_inclusion",
    trauma_consideration: "choice_centered",
    scope: "spiritual_dimension"
  },
  
  family_community: {
    prompt: "How do your relationships with family and community play a role in your healing? These connections can be complex and important.",
    intent: "relational_exploration",
    trauma_consideration: "complexity_acknowledged",
    scope: "interpersonal"
  }
};

/**
 * Cultural adaptation rules for different cultural contexts
 */
export const CULTURAL_ADAPTATION_RULES = {
  collectivist_cultures: {
    language_modifications: [
      "Add community and family references",
      "Use plural pronouns when appropriate",
      "Frame individual healing as community benefit",
      "Include ancestral wisdom references"
    ],
    prompt_additions: [
      "Consider how this affects your loved ones",
      "Your healing contributes to your community's wellbeing",
      "What wisdom from your elders speaks to this?"
    ],
    avoid: [
      "Excessive individualistic language",
      "Isolation-focused strategies",
      "Dismissal of family input"
    ]
  },
  
  indigenous_contexts: {
    language_modifications: [
      "Include land and nature connections",
      "Reference ancestral wisdom respectfully",
      "Honor circular time concepts",
      "Acknowledge intergenerational trauma"
    ],
    prompt_additions: [
      "How does your connection to the land inform this?",
      "What do your ancestors' voices tell you?",
      "How does this fit into the larger cycles of life?"
    ],
    requirements: [
      "Must have Indigenous community permission",
      "Include land acknowledgment where appropriate",
      "Avoid appropriating sacred practices"
    ]
  },
  
  islamic_contexts: {
    language_modifications: [
      "Include references to Allah/divine when appropriate",
      "Respect family decision-making structures",
      "Honor modest communication preferences",
      "Include community (ummah) considerations"
    ],
    prompt_additions: [
      "How does your faith inform your understanding of this?",
      "What guidance do you find in your spiritual practice?",
      "How can your community support you?"
    ],
    considerations: [
      "Respect prayer times",
      "Honor family involvement preferences",
      "Be mindful of gender considerations"
    ]
  },
  
  latin_american_contexts: {
    language_modifications: [
      "Include family (familia) centrally",
      "Reference spiritual/religious healing",
      "Honor traditional healing practices",
      "Include community (comunidad) support"
    ],
    prompt_additions: [
      "How does your familia understand this situation?",
      "What traditional healing wisdom applies here?",
      "How does your comunidad provide support?"
    ],
    healing_integrations: [
      "Acknowledge curanderismo if relevant",
      "Include sobadoras/traditional healers",
      "Honor religious/spiritual dimensions"
    ]
  },
  
  east_asian_contexts: {
    language_modifications: [
      "Honor indirect communication styles",
      "Include mind-body-spirit unity",
      "Reference balance and harmony",
      "Respect hierarchical considerations"
    ],
    prompt_additions: [
      "How does this affect your overall balance?",
      "What would restore harmony in this situation?",
      "How does this connect to your physical wellbeing?"
    ],
    healing_integrations: [
      "Include qi/energy concepts if relevant",
      "Reference traditional medicine principles",
      "Honor meditation and mindfulness"
    ]
  },
  
  african_contexts: {
    language_modifications: [
      "Emphasize Ubuntu (interconnectedness)",
      "Include ancestor reverence",
      "Honor community decision-making",
      "Reference storytelling traditions"
    ],
    prompt_additions: [
      "How does this connect you to your community?",
      "What wisdom do your ancestors offer?",
      "How does your story fit into the larger story?"
    ],
    healing_integrations: [
      "Honor traditional healing practices",
      "Include communal healing approaches",
      "Reference spiritual and ancestral guidance"
    ]
  },
  
  lgbtq_affirmation: {
    language_modifications: [
      "Use inclusive, affirming language",
      "Honor chosen family concepts",
      "Acknowledge unique resilience",
      "Validate identity exploration"
    ],
    prompt_additions: [
      "How does your authentic self show up in this?",
      "What does your chosen family offer for support?",
      "How has your journey of self-discovery informed your strength?"
    ],
    avoid: [
      "Heteronormative assumptions",
      "Binary gender language unless specified",
      "Pathologizing identity exploration"
    ]
  },
  
  neurodivergent_adaptation: {
    language_modifications: [
      "Provide clear, concrete language",
      "Offer multiple ways to engage",
      "Honor different processing styles",
      "Acknowledge sensory considerations"
    ],
    prompt_additions: [
      "You can respond in whatever way feels comfortable - words, drawings, movements",
      "Take the time you need to process",
      "What accommodations help you feel most comfortable?"
    ],
    accommodations: [
      "Offer visual or kinesthetic response options",
      "Provide content warnings for sensory triggers",
      "Allow for processing time differences"
    ]
  },
  
  trauma_informed_base: {
    language_modifications: [
      "Emphasize choice and control",
      "Validate all responses",
      "Provide safety reminders",
      "Honor pace and timing"
    ],
    safety_elements: [
      "You are in control of how much you share",
      "You can stop or change direction at any time",
      "Your responses are valid and important",
      "This is your space and your pace"
    ],
    avoid: [
      "Pressuring for disclosure",
      "Invasive questioning",
      "Time pressure",
      "Judgment or evaluation language"
    ]
  }
};

/**
 * Adapt a therapeutic prompt based on cultural context and user profile
 */
export function adaptTherapeuticPrompt(
  basePromptKey: string,
  config: PromptAdaptationConfig
): AdaptedPrompt {
  const basePrompt = BASE_THERAPEUTIC_PROMPTS[basePromptKey];
  if (!basePrompt) {
    throw new Error(`Base prompt '${basePromptKey}' not found`);
  }

  let adaptedPrompt = basePrompt.prompt;
  const culturalNotes: string[] = [];
  const contraindications: string[] = [];
  const suggestedFollowUps: string[] = [];
  const healingIntegrations: string[] = [];

  // Apply cultural adaptations based on user's cultural background
  config.userProfile.culturalBackground.forEach(background => {
    switch (background.toLowerCase()) {
      case 'latin_american':
      case 'mexican':
      case 'central_american':
      case 'south_american':
        adaptedPrompt = applyLatinAmericanAdaptations(adaptedPrompt, config);
        culturalNotes.push("Adapted for Latin American cultural context");
        healingIntegrations.push("Consider curanderismo and traditional healing");
        break;
        
      case 'east_asian':
      case 'chinese':
      case 'japanese':
      case 'korean':
        adaptedPrompt = applyEastAsianAdaptations(adaptedPrompt, config);
        culturalNotes.push("Adapted for East Asian cultural context");
        healingIntegrations.push("Consider balance and harmony principles");
        break;
        
      case 'islamic':
      case 'middle_eastern':
      case 'north_african':
        adaptedPrompt = applyIslamicAdaptations(adaptedPrompt, config);
        culturalNotes.push("Adapted for Islamic cultural context");
        healingIntegrations.push("Consider spiritual and community dimensions");
        break;
        
      case 'indigenous':
      case 'native_american':
      case 'first_nations':
        adaptedPrompt = applyIndigenousAdaptations(adaptedPrompt, config);
        culturalNotes.push("Adapted for Indigenous cultural context");
        contraindications.push("Requires Indigenous community permission");
        break;
        
      case 'african':
      case 'black':
      case 'caribbean':
        adaptedPrompt = applyAfricanDiasporaAdaptations(adaptedPrompt, config);
        culturalNotes.push("Adapted for African/Black cultural context");
        healingIntegrations.push("Consider Ubuntu and community healing");
        break;
    }
  });

  // Apply communication style adaptations
  if (config.userProfile.communicationStyle === 'indirect' || 
      config.culturalContext.communicationStyle === 'indirect') {
    adaptedPrompt = makeIndirect(adaptedPrompt);
    culturalNotes.push("Adapted for indirect communication style");
  }

  // Apply family involvement adaptations
  if (config.userProfile.familyInvolvement || 
      config.culturalContext.familyStructure === 'extended') {
    adaptedPrompt = includeFamilyContext(adaptedPrompt);
    culturalNotes.push("Adapted to include family context");
  }

  // Apply spiritual adaptations
  if (config.userProfile.spiritualBeliefs && config.userProfile.spiritualBeliefs.length > 0) {
    adaptedPrompt = integrateSpiritualElements(adaptedPrompt, config.userProfile.spiritualBeliefs);
    culturalNotes.push("Adapted to include spiritual elements");
  }

  // Apply trauma-informed adaptations
  adaptedPrompt = applyTraumaInformedAdaptations(adaptedPrompt, config);

  // Apply LGBTQ+ affirmation if relevant
  if (config.userProfile.culturalBackground.includes('lgbtq')) {
    adaptedPrompt = applyLGBTQAffirmation(adaptedPrompt);
    culturalNotes.push("Adapted for LGBTQ+ affirmation");
  }

  // Apply neurodivergent adaptations if relevant
  if (config.userProfile.culturalBackground.includes('neurodivergent')) {
    adaptedPrompt = applyNeurodivergentAdaptations(adaptedPrompt);
    culturalNotes.push("Adapted for neurodivergent accessibility");
  }

  // Generate suggested follow-ups based on cultural context
  suggestedFollowUps.push(...generateCulturalFollowUps(basePromptKey, config));

  return {
    prompt: adaptedPrompt,
    culturalNotes,
    contraindications,
    suggestedFollowUps,
    healingIntegrations
  };
}

// Cultural adaptation helper functions

function applyLatinAmericanAdaptations(prompt: string, config: PromptAdaptationConfig): string {
  let adapted = prompt;
  
  // Include family context
  adapted = adapted.replace(/\byou\b/g, "you and your familia");
  adapted = adapted.replace(/your life/g, "your life and your community");
  
  // Add spiritual elements if appropriate
  if (config.userProfile.spiritualBeliefs?.includes('catholic') || 
      config.userProfile.spiritualBeliefs?.includes('traditional')) {
    adapted += " Feel free to include how your fe and spiritual practices inform your perspective.";
  }
  
  // Include traditional healing acknowledgment
  adapted += " Traditional healing wisdom and family guidance are also valuable parts of your journey.";
  
  return adapted;
}

function applyEastAsianAdaptations(prompt: string, config: PromptAdaptationConfig): string {
  let adapted = prompt;
  
  // Make more indirect and holistic
  adapted = adapted.replace(/How are you feeling/g, "When you take time to notice");
  adapted = adapted.replace(/What emotions/g, "What you might be experiencing");
  
  // Include mind-body-spirit unity
  adapted += " Consider how your thoughts, feelings, and physical sensations are connected.";
  
  // Reference balance concepts
  adapted = adapted.replace(/healing/g, "restoring balance and harmony");
  
  return adapted;
}

function applyIslamicAdaptations(prompt: string, config: PromptAdaptationConfig): string {
  let adapted = prompt;
  
  // Include family and community
  adapted = adapted.replace(/your journey/g, "your journey within your family and ummah");
  
  // Add spiritual reference if appropriate
  if (config.userProfile.spiritualBeliefs?.includes('islam')) {
    adapted += " You may also find guidance in your dua, Quran, or conversations with trusted community members.";
  }
  
  // Honor family involvement
  adapted += " Your family's wisdom and support are important parts of this process.";
  
  return adapted;
}

function applyIndigenousAdaptations(prompt: string, config: PromptAdaptationConfig): string {
  let adapted = prompt;
  
  // Include ancestral wisdom
  adapted = adapted.replace(/your wisdom/g, "the wisdom of your ancestors within you");
  
  // Reference circular time and cycles
  adapted = adapted.replace(/recently/g, "in this cycle of life");
  
  // Include land connection
  adapted += " Your connection to the land and your ancestors' teachings may also guide you.";
  
  // Add important disclaimer
  adapted = "With respect to the sacred traditions of your people: " + adapted;
  
  return adapted;
}

function applyAfricanDiasporaAdaptations(prompt: string, config: PromptAdaptationConfig): string {
  let adapted = prompt;
  
  // Include Ubuntu principles
  adapted = adapted.replace(/you are/g, "you are, and you are because we are");
  adapted = adapted.replace(/your healing/g, "your healing and your community's healing");
  
  // Include ancestral connection
  adapted += " The wisdom of your ancestors and the strength of your community are part of your healing.";
  
  // Reference resilience and resistance
  adapted += " Your resilience carries the strength of generations.";
  
  return adapted;
}

function makeIndirect(prompt: string): string {
  let adapted = prompt;
  
  // Soften direct questions
  adapted = adapted.replace(/What do you/g, "When you have time to reflect, you might consider what you");
  adapted = adapted.replace(/How do you/g, "You might explore how you");
  adapted = adapted.replace(/\?$/g, ", if that feels right for you?");
  
  return adapted;
}

function includeFamilyContext(prompt: string): string {
  let adapted = prompt;
  
  adapted = adapted.replace(/your experience/g, "your and your family's experience");
  adapted += " You may also want to consider how your family and loved ones are part of this situation.";
  
  return adapted;
}

function integrateSpiritualElements(prompt: string, beliefs: string[]): string {
  let adapted = prompt;
  
  if (beliefs.includes('christian') || beliefs.includes('catholic')) {
    adapted += " Your faith and prayer life may also provide guidance and comfort.";
  } else if (beliefs.includes('islam')) {
    adapted += " Your dua and connection to Allah may also provide guidance and peace.";
  } else if (beliefs.includes('buddhist')) {
    adapted += " Your meditation practice and the dharma may also offer wisdom and compassion.";
  } else if (beliefs.includes('hindu')) {
    adapted += " Your spiritual practice and connection to the divine may also provide guidance.";
  } else {
    adapted += " Your spiritual beliefs and practices may also be a source of guidance and strength.";
  }
  
  return adapted;
}

function applyTraumaInformedAdaptations(prompt: string, config: PromptAdaptationConfig): string {
  let adapted = prompt;
  
  // Add choice and control
  adapted = "You have complete control over what you share. " + adapted;
  
  // Add safety reminder based on emotional state
  if (config.sessionContext.emotionalState === 'vulnerable' || 
      config.sessionContext.emotionalState === 'crisis') {
    adapted = "You are safe here. " + adapted;
    adapted += " You can pause, slow down, or change direction at any time.";
  }
  
  // Add validation
  adapted += " Whatever comes up for you is valid and important.";
  
  return adapted;
}

function applyLGBTQAffirmation(prompt: string): string {
  let adapted = prompt;
  
  // Make inclusive
  adapted = adapted.replace(/family/g, "family and chosen family");
  adapted += " Your authentic self and identity are affirmed and celebrated here.";
  adapted += " Your chosen family and community provide important support and wisdom.";
  
  return adapted;
}

function applyNeurodivergentAdaptations(prompt: string): string {
  let adapted = prompt;
  
  // Provide multiple engagement options
  adapted += " You can respond in whatever way feels comfortable - through writing, drawing, movement, or any other form of expression.";
  
  // Acknowledge processing differences
  adapted += " Take whatever time you need to process and respond.";
  
  return adapted;
}

function generateCulturalFollowUps(basePromptKey: string, config: PromptAdaptationConfig): string[] {
  const followUps: string[] = [];
  
  // Add cultural-specific follow-ups based on context
  if (config.culturalContext.culturalValues.collectivism > 60) {
    followUps.push("How does your community understand this situation?");
    followUps.push("What wisdom do your elders offer about this?");
  }
  
  if (config.userProfile.spiritualBeliefs && config.userProfile.spiritualBeliefs.length > 0) {
    followUps.push("How do your spiritual beliefs inform your understanding of this?");
  }
  
  if (config.culturalContext.traumaExpression === 'somatic') {
    followUps.push("What are you noticing in your body as you share this?");
  }
  
  return followUps;
}

/**
 * Validate cultural safety of an adapted prompt
 */
export function validateCulturalSafety(
  adaptedPrompt: AdaptedPrompt,
  config: PromptAdaptationConfig
): {
  isCulturallySafe: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let isCulturallySafe = true;
  
  // Check for cultural appropriation risks
  config.userProfile.culturalBackground.forEach(background => {
    if (background === 'indigenous' && !adaptedPrompt.contraindications.includes('Indigenous community permission')) {
      warnings.push("Indigenous cultural elements require community permission");
      isCulturallySafe = false;
    }
  });
  
  // Check for trauma re-triggering language
  if (config.sessionContext.emotionalState === 'crisis' && 
      !adaptedPrompt.prompt.includes("safe")) {
    warnings.push("Crisis state requires explicit safety language");
    recommendations.push("Add safety affirmations and grounding elements");
  }
  
  // Check for cultural contradictions
  if (config.culturalContext.communicationStyle === 'indirect' && 
      adaptedPrompt.prompt.includes("What do you think")) {
    warnings.push("Direct questioning may conflict with indirect communication style");
    recommendations.push("Consider more gentle inquiry approaches");
  }
  
  return {
    isCulturallySafe,
    warnings,
    recommendations
  };
}

