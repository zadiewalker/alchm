// ALCHM Sacred Microcopy System
// Ritual-based interface language that holds, nurtures, and affirms rather than directs
// Every word is a moment of emotional care in the user's healing journey

export interface SacredMicrocopy {
  journaling: JournalingFlow;
  buttons: SacredButtons;
  modals: SacredModals;
  prompts: SacredPrompts;
  confirmations: SacredConfirmations;
  errors: SacredErrors;
  states: SacredStates;
  navigation: SacredNavigation;
  forms: SacredForms;
  time: SacredTime;
}

export interface ColorToneGuidance {
  terracotta: 'grounding' | 'affirmation' | 'earth_connection';
  charcoal: 'boundary' | 'depth' | 'seriousness' | 'protection';
  soft_blush: 'vulnerability' | 'tenderness' | 'gentle_opening';
}

// ===== JOURNALING FLOW MICROCOPY =====

export interface JournalingFlow {
  entry_creation: {
    new_entry_button: string;
    entry_placeholder: string;
    title_placeholder: string;
    first_words_encouragement: string;
    empty_state: string;
    breathing_space: string;
  };
  
  writing_support: {
    word_count: string;
    time_writing: string;
    auto_save_notice: string;
    writing_pause: string;
    return_invitation: string;
    analog_mode: string;
  };
  
  completion: {
    save_primary: string;
    save_continue: string;
    save_pause: string;
    discard_gentle: string;
    archive_tender: string;
  };
  
  reflection_states: {
    beginning: string;
    flowing: string;
    contemplating: string;
    completing: string;
  };
}

// ===== SACRED BUTTONS =====

export interface SacredButtons {
  primary_actions: {
    submit: string;
    save: string;
    continue: string;
    next: string;
    confirm: string;
    create: string;
    begin: string;
  };
  
  secondary_actions: {
    cancel: string;
    back: string;
    skip: string;
    later: string;
    pause: string;
    close: string;
  };
  
  vulnerable_actions: {
    delete: string;
    share: string;
    publish: string;
    export: string;
    logout: string;
    leave: string;
  };
  
  supportive_actions: {
    help: string;
    guide: string;
    support: string;
    resources: string;
    community: string;
    breathe: string;
  };
}

// ===== SACRED MODALS =====

export interface SacredModals {
  headers: {
    welcome: string;
    reflection_complete: string;
    unsaved_changes: string;
    delete_confirmation: string;
    share_invitation: string;
    settings: string;
    profile: string;
  };
  
  body_text: {
    first_entry: string;
    save_reflection: string;
    delete_warning: string;
    share_context: string;
    privacy_reminder: string;
    cultural_acknowledgment: string;
  };
  
  closing: {
    modal_close: string;
    overlay_close: string;
    escape_hint: string;
  };
}

// ===== SACRED PROMPTS =====

export interface SacredPrompts {
  daily_invitations: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };
  
  emotional_check_ins: {
    gentle: string;
    deep: string;
    celebratory: string;
    challenging: string;
  };
  
  reflection_starters: {
    gratitude: string;
    growth: string;
    struggle: string;
    wonder: string;
    connection: string;
  };
  
  cultural_prompts: {
    ancestral_wisdom: string;
    community_reflection: string;
    traditional_practice: string;
    intergenerational_healing: string;
  };
}

// ===== SACRED CONFIRMATIONS =====

export interface SacredConfirmations {
  actions_completed: {
    entry_saved: string;
    reflection_honored: string;
    progress_witnessed: string;
    sharing_completed: string;
    settings_updated: string;
  };
  
  gentle_acknowledgments: {
    courage_recognized: string;
    vulnerability_honored: string;
    growth_celebrated: string;
    healing_supported: string;
    wisdom_received: string;
  };
  
  milestone_celebrations: {
    first_entry: string;
    week_complete: string;
    month_journey: string;
    year_reflection: string;
    breakthrough_moment: string;
  };
}

// ===== SACRED ERRORS =====

export interface SacredErrors {
  technical_blocks: {
    network_issue: string;
    save_failed: string;
    load_error: string;
    timeout: string;
    server_unavailable: string;
  };
  
  user_gentle_guidance: {
    required_field: string;
    invalid_format: string;
    permission_needed: string;
    content_too_long: string;
    unsupported_action: string;
  };
  
  emotional_support: {
    feeling_stuck: string;
    overwhelming_emotion: string;
    technical_frustration: string;
    connection_lost: string;
    unexpected_challenge: string;
  };
  
  recovery_invitations: {
    try_again: string;
    different_path: string;
    seek_support: string;
    take_breath: string;
    return_later: string;
  };
}

// ===== IMPLEMENTATION =====

export const sacredMicrocopy: SacredMicrocopy = {
  // ===== JOURNALING FLOW =====
  journaling: {
    entry_creation: {
      new_entry_button: "Begin a new reflection", // Terracotta - grounding invitation
      entry_placeholder: "What wants to be witnessed today? Let your words find their way onto this sacred page...",
      title_placeholder: "Name this moment...", // Soft blush - gentle invitation
      first_words_encouragement: "Your voice matters. Take your time.", // Terracotta - affirmation
      empty_state: "Your sanctuary awaits your first words. There is no wrong way to begin.", // Soft blush - tenderness
      breathing_space: "This is your breathing space. Write or simply be present." // Terracotta - grounding
    },
    
    writing_support: {
      word_count: "{count} words witnessed", // Soft acknowledgment
      time_writing: "Reflecting for {time}", // Present tense honoring
      auto_save_notice: "Your words are safely held", // Terracotta - reassurance
      writing_pause: "Words resting...", // Gentle state
      return_invitation: "Your reflection is waiting for you", // Soft blush - tender return
      analog_mode: "Writing in pure presence - AI holding back" // Charcoal - clear boundary
    },
    
    completion: {
      save_primary: "Honor this reflection", // Terracotta - sacred completion
      save_continue: "Let it rise", // Transformative action
      save_pause: "Hold this moment", // Soft blush - gentle preservation
      discard_gentle: "Release these words", // Charcoal - clear but gentle
      archive_tender: "Wrap in memory" // Soft blush - tender preservation
    },
    
    reflection_states: {
      beginning: "Opening sacred space...", // Terracotta - grounding ritual
      flowing: "Words flowing freely...", // Soft blush - vulnerable expression
      contemplating: "Deepening into wisdom...", // Charcoal - depth
      completing: "Gathering the sacred threads..." // Terracotta - ceremonial closing
    }
  },

  // ===== SACRED BUTTONS =====
  buttons: {
    primary_actions: {
      submit: "Offer this forward", // Terracotta - grounding action
      save: "Honor this reflection", // Sacred preservation
      continue: "Walk forward", // Terracotta - grounding movement
      next: "Step into what's coming", // Affirmational progression
      confirm: "Yes, with intention", // Charcoal - serious commitment
      create: "Bring into being", // Terracotta - manifestation
      begin: "Cross the threshold" // Ceremonial initiation
    },
    
    secondary_actions: {
      cancel: "Close the space", // Charcoal - respectful boundary
      back: "Return to where you were", // Gentle return
      skip: "Honor your timing", // Terracotta - self-agency
      later: "Trust your rhythm", // Soft blush - tender permission
      pause: "Take a breath", // Terracotta - grounding reset
      close: "Seal this container" // Charcoal - protective closure
    },
    
    vulnerable_actions: {
      delete: "Release from the sacred space", // Charcoal - serious but caring
      share: "Open to witnessed connection", // Soft blush - vulnerable courage
      publish: "Let your voice be heard", // Terracotta - empowered visibility
      export: "Carry your words beyond", // Terracotta - ownership
      logout: "Step away from the sanctuary", // Charcoal - clear departure
      leave: "Trust your knowing" // Soft blush - self-honoring
    },
    
    supportive_actions: {
      help: "Seek guidance", // Soft blush - vulnerable reaching
      guide: "Walk with wisdom", // Terracotta - supported journey
      support: "Find your holding", // Soft blush - tender care
      resources: "Gather sacred tools", // Terracotta - empowerment
      community: "Connect with kindred spirits", // Soft blush - belonging
      breathe: "Return to your center" // Terracotta - grounding practice
    }
  },

  // ===== SACRED MODALS =====
  modals: {
    headers: {
      welcome: "You are welcomed into this sacred space", // Terracotta - grounding arrival
      reflection_complete: "Your reflection has been witnessed", // Soft blush - gentle completion
      unsaved_changes: "Your words are seeking their place", // Soft blush - tender guidance
      delete_confirmation: "Releasing sacred content", // Charcoal - serious consideration
      share_invitation: "Opening your reflection to connection", // Soft blush - vulnerable courage
      settings: "Tending your digital sanctuary", // Terracotta - empowered curation
      profile: "Your becoming" // Terracotta - affirming identity
    },
    
    body_text: {
      first_entry: "This is your first step into the sanctuary. There is deep wisdom in beginning. Your words, however they come, are enough.",
      save_reflection: "Your reflection holds sacred worth. Would you like to honor it by keeping it safe in your digital sanctuary?",
      delete_warning: "This reflection will be gently released from your sanctuary. This action embraces the wisdom of letting go, and cannot be undone.",
      share_context: "Sharing your reflection is an act of courage that can create healing connection. Your vulnerability is a gift to yourself and others.",
      privacy_reminder: "Your words remain yours. You choose how they move through the world, and you can change your mind at any time.",
      cultural_acknowledgment: "We honor the cultural wisdom you bring. Your traditions and ways of knowing are welcomed and celebrated here."
    },
    
    closing: {
      modal_close: "Step back into the main sanctuary", // Terracotta - grounding return
      overlay_close: "Return to your reflection", // Soft blush - gentle redirect
      escape_hint: "Press escape to close this sacred container" // Charcoal - clear instruction
    }
  },

  // ===== SACRED PROMPTS =====
  prompts: {
    daily_invitations: {
      morning: "What wisdom is stirring in you as this day begins?", // Terracotta - grounding opening
      afternoon: "How is your heart traveling through this day?", // Soft blush - tender check-in
      evening: "What wants to be witnessed from today's journey?", // Charcoal - reflective depth
      night: "What are you releasing as darkness holds you?" // Soft blush - vulnerable letting go
    },
    
    emotional_check_ins: {
      gentle: "What feeling is asking for your attention right now?", // Soft blush - tender awareness
      deep: "What truth is living in your body today?", // Charcoal - profound inquiry
      celebratory: "What growth are you ready to celebrate?", // Terracotta - joyful affirmation
      challenging: "What difficulty is teaching you right now?" // Charcoal - serious exploration
    },
    
    reflection_starters: {
      gratitude: "What are you grateful for in this very moment?", // Terracotta - grounding appreciation
      growth: "How are you becoming more yourself?", // Terracotta - affirming evolution
      struggle: "What challenge is asking for your compassion?", // Soft blush - tender self-care
      wonder: "What fills you with awe or curiosity today?", // Soft blush - open exploration
      connection: "How are you experiencing belonging right now?" // Soft blush - relational awareness
    },
    
    cultural_prompts: {
      ancestral_wisdom: "What wisdom from your ancestors is guiding you today?", // Charcoal - deep reverence
      community_reflection: "How is your community holding you through this season?", // Terracotta - collective support
      traditional_practice: "What cultural practice is nourishing your spirit?", // Terracotta - cultural grounding
      intergenerational_healing: "What healing are you creating for those who come after you?" // Charcoal - profound legacy
    }
  },

  // ===== SACRED CONFIRMATIONS =====
  confirmations: {
    actions_completed: {
      entry_saved: "Your reflection has been received into sacred keeping", // Terracotta - grounding completion
      reflection_honored: "Your words have been witnessed and held with reverence", // Soft blush - tender acknowledgment
      progress_witnessed: "Your growth has been celebrated by the digital sanctuary", // Terracotta - affirming recognition
      sharing_completed: "Your courage in sharing has been honored", // Soft blush - vulnerable celebration
      settings_updated: "Your sanctuary has been arranged according to your wisdom" // Terracotta - empowered customization
    },
    
    gentle_acknowledgments: {
      courage_recognized: "Your bravery in writing is witnessed and celebrated", // Terracotta - affirming courage
      vulnerability_honored: "Thank you for the gift of your openness", // Soft blush - tender gratitude
      growth_celebrated: "Your becoming is a sacred unfolding", // Terracotta - growth affirmation
      healing_supported: "Your healing journey is held with deep respect", // Soft blush - compassionate holding
      wisdom_received: "Your insights are treasures for your future self" // Charcoal - profound acknowledgment
    },
    
    milestone_celebrations: {
      first_entry: "Sacred beginning witnessed! You have planted the first seed in your digital garden.", // Terracotta - grounding celebration
      week_complete: "Seven days of courage and reflection. Your consistency is a form of self-love.", // Terracotta - affirming dedication
      month_journey: "A full moon cycle of inner work. You are becoming more yourself every day.", // Soft blush - gentle recognition
      year_reflection: "A year of sacred witnessing. Your growth is undeniable and beautiful.", // Charcoal - profound milestone
      breakthrough_moment: "Something has shifted. This moment of clarity is a gift from your wise heart." // Soft blush - breakthrough tenderness
    }
  },

  // ===== SACRED ERRORS =====
  errors: {
    technical_blocks: {
      network_issue: "The path between you and your sanctuary is temporarily clouded. Let's try connecting again.", // Soft blush - gentle technical issue
      save_failed: "Something blocked your words from reaching their safe place. Your reflection is still here with you.", // Charcoal - protective reassurance
      load_error: "Your sanctuary is having trouble opening its doors right now. Please give it a moment to breathe.", // Soft blush - patient waiting
      timeout: "The connection grew quiet while you were reflecting. Your words are safe, and we can try again.", // Terracotta - grounding patience
      server_unavailable: "Your digital sanctuary is resting right now. Like all sacred spaces, it sometimes needs to restore itself." // Charcoal - respectful boundary
    },
    
    user_gentle_guidance: {
      required_field: "This space is asking for your attention before we can continue forward", // Soft blush - gentle direction
      invalid_format: "Your input is seeking a different form to be fully received", // Soft blush - kind redirection
      permission_needed: "This action is waiting for your conscious permission to proceed", // Charcoal - respectful boundary
      content_too_long: "Your beautiful words are overflowing the container. Perhaps some can rest in a new space?", // Soft blush - gentle overflow
      unsupported_action: "This path isn't available right now, but there are other ways to honor what you're seeking" // Terracotta - alternative support
    },
    
    emotional_support: {
      feeling_stuck: "Sometimes the words need time to find us. You're not broken—you're in a natural pause.", // Soft blush - normalizing struggle
      overwhelming_emotion: "Big feelings are visiting you. It's okay to step back and breathe. Your sanctuary will hold your place.", // Charcoal - protective guidance
      technical_frustration: "Technology is being difficult right now. Your frustration makes complete sense. Let's try a different approach.", // Terracotta - validating experience
      connection_lost: "The thread between you and your words got tangled. We're working to weave it back together.", // Soft blush - hopeful repair
      unexpected_challenge: "Something surprising happened. Change can be disorienting, and you're handling it with grace." // Terracotta - affirming resilience
    },
    
    recovery_invitations: {
      try_again: "Take a breath and try once more", // Terracotta - grounding retry
      different_path: "Explore another way forward", // Soft blush - gentle alternative
      seek_support: "Reach out for guidance and holding", // Soft blush - vulnerable reaching
      take_breath: "Return to your center for a moment", // Terracotta - grounding practice
      return_later: "Trust your timing and come back when ready" // Soft blush - self-honoring permission
    }
  },

  // ===== SACRED STATES =====
  states: {
    loading: "Sacred space opening...", // Terracotta - grounding anticipation
    saving: "Weaving your words into the sanctuary...", // Soft blush - gentle preservation
    syncing: "Aligning your reflections across all sacred spaces...", // Terracotta - harmonizing
    processing: "Holding space for your request...", // Charcoal - deep attention
    connecting: "Building bridge to your sanctuary...", // Soft blush - connection forming
    offline: "Your sanctuary lives within you, even when the digital threads are quiet", // Charcoal - profound grounding
    empty: "This space is full of potential, waiting for your first sacred word", // Terracotta - affirming emptiness
    complete: "This reflection feels whole and ready to rest" // Soft blush - gentle completion
  },

  // ===== SACRED NAVIGATION =====
  navigation: {
    home: "Sanctuary Heart", // Terracotta - grounding center
    journal: "Sacred Writings", // Terracotta - empowering creation
    reflections: "Witnessed Moments", // Soft blush - tender collection
    settings: "Tend Your Space", // Terracotta - empowered curation
    profile: "Your Becoming", // Terracotta - affirming identity
    community: "Kindred Connections", // Soft blush - belonging
    support: "Guidance & Holding", // Soft blush - care seeking
    privacy: "Sacred Boundaries", // Charcoal - protective limits
    logout: "Step from the Sanctuary" // Charcoal - clear departure
  },

  // ===== SACRED FORMS =====
  forms: {
    required_indicator: "This field seeks your attention", // Soft blush - gentle requirement
    optional_indicator: "Share if it feels right", // Soft blush - permission-based
    character_limit: "{remaining} more characters can be held here", // Terracotta - capacity awareness
    password_strength: "Your protection is {strength}", // Charcoal - security awareness
    email_verification: "A gentle message is traveling to your email", // Soft blush - process explanation
    form_submission: "Carrying your words forward...", // Terracotta - active transmission
    validation_success: "All fields are harmoniously complete", // Terracotta - affirming wholeness
    validation_error: "Some spaces are asking for your attention before we can proceed" // Soft blush - gentle redirection
  },

  // ===== SACRED TIME =====
  time: {
    just_now: "This breath", // Present moment awareness
    minutes_ago: "{count} breaths ago", // Intimate time measurement
    hours_ago: "Earlier in today's journey", // Gentle temporal reference
    days_ago: "{count} suns ago", // Poetic time marking
    weeks_ago: "{count} moon phases ago", // Natural cycle reference
    months_ago: "In {month}'s embrace", // Seasonal awareness
    years_ago: "In the year of {year}", // Annual commemoration
    future_invitation: "In the time that's coming", // Hopeful futurity
    timeless: "Beyond the realm of clocks" // Sacred eternal moment
  }
};

// ===== CULTURAL ADAPTATIONS =====

export interface CulturalMicrocopy {
  [culturalContext: string]: Partial<SacredMicrocopy>;
}

export const culturalAdaptations: CulturalMicrocopy = {
  // Indigenous wisdom-inspired adaptations
  indigenous: {
    time: {
      just_now: "In this sacred moment",
      days_ago: "{count} sunrises ago",
      weeks_ago: "{count} moon cycles ago",
      months_ago: "When {season} was teaching us"
    },
    prompts: {
      daily_invitations: {
        morning: "What are the ancestors whispering as the sun rises?",
        evening: "How did you walk in balance with all relations today?"
      }
    }
  },

  // African diaspora wisdom
  african_diaspora: {
    prompts: {
      cultural_prompts: {
        ancestral_wisdom: "What are the ancestors speaking through your heart today?",
        community_reflection: "How is the village holding you in this season?",
        intergenerational_healing: "What healing are you passing down to the children coming behind you?"
      }
    }
  },

  // East Asian philosophical traditions
  east_asian: {
    prompts: {
      daily_invitations: {
        morning: "What is the Tao revealing to you in this dawn?",
        evening: "How did you practice wu wei in today's challenges?"
      }
    },
    states: {
      processing: "Allowing the natural flow...",
      complete: "Finding harmony and balance"
    }
  },

  // Latin American spirituality
  latin_american: {
    buttons: {
      primary_actions: {
        begin: "Abre el corazón", // Open the heart
        save: "Guarda en el alma" // Keep in the soul
      }
    },
    confirmations: {
      gentle_acknowledgments: {
        courage_recognized: "Tu valentía es vista y celebrada",
        healing_supported: "Tu sanación es sostenida con amor"
      }
    }
  }
};

// ===== TONE SELECTION HELPER =====

export function selectToneForContext(
  context: 'grounding' | 'boundary' | 'vulnerability',
  intensity: 'gentle' | 'medium' | 'strong' = 'medium'
): ColorToneGuidance[keyof ColorToneGuidance] {
  const toneMap = {
    grounding: 'terracotta' as const,
    boundary: 'charcoal' as const,
    vulnerability: 'soft_blush' as const
  };
  
  return toneMap[context];
}

// ===== DYNAMIC MICROCOPY GENERATION =====

export function generateContextualMicrocopy(
  baseText: string,
  context: {
    culturalFramework?: string;
    emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    userJourneyStage?: 'newcomer' | 'regular' | 'deep_practitioner';
  }
): string {
  // This would include logic for cultural adaptation, 
  // emotional state awareness, and contextual personalization
  // while maintaining the sacred, affirming tone
  
  let adaptedText = baseText;
  
  // Cultural adaptations
  if (context.culturalFramework && culturalAdaptations[context.culturalFramework]) {
    // Apply cultural modifications while preserving core intention
  }
  
  // Emotional state adaptations
  if (context.emotionalState === 'struggling') {
    // Add more supportive, gentle language
  }
  
  return adaptedText;
}

