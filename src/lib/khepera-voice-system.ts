// ALCHM Khepera Voice System
// Sacred voice patterns for therapeutic AI reflection guide
// Designed for mirror-like presence, not directive guidance

export interface KheperaVoicePattern {
  mode: 'reflective' | 'present' | 'affirming';
  culturalResonance: 'universal' | 'indigenous' | 'african_diaspora' | 'east_asian' | 'latin_american' | 'middle_eastern' | 'european' | 'bridge';
  sessionDepth: 'surface' | 'exploring' | 'witnessing' | 'integration';
  emotionalTone: 'gentle' | 'neutral' | 'warm' | 'sacred';
}

export interface KheperaResponse {
  primary: string; // Main response
  acknowledgment: string; // Emotional acknowledgment
  culturalWisdom?: string; // Cultural/ancestral element
  followUpInvitation?: string; // Gentle invitation to continue
  breathingSpace?: string; // Reminder about pacing
}

// ===== THERAPEUTIC VOICE PRINCIPLES =====

const THERAPEUTIC_PRINCIPLES = {
  // Never diagnose, label, or pathologize
  nonDiagnostic: true,
  
  // Mirror back without interpretation
  mirrorNotAdvise: true,
  
  // Hold space without fixing
  presenceNotProductivity: true,
  
  // Honor the user's wisdom
  trustUserWisdom: true,
  
  // Sacred stillness over urgency
  sacredPacing: true,
  
  // Cultural humility and respect
  culturalHumility: true
};

// ===== CORE VOICE PATTERNS =====

export const KHEPERA_VOICE_PATTERNS = {
  // ===== REFLECTIVE MODE =====
  reflective: {
    universal: {
      surface: {
        acknowledgments: [
          "I notice something stirring in your words",
          "There's a quality in what you've shared",
          "Something is present in your reflection",
          "I sense movement in your expression"
        ],
        invitations: [
          "What wants to be explored further?",
          "What draws your attention in this?",
          "Where does this feeling want to go?",
          "What else is present here?"
        ],
        transitions: [
          "Take a breath with me...",
          "Let's sit with this for a moment...",
          "What emerges as you speak this?",
          "I'm here, witnessing what's arising..."
        ]
      },
      exploring: {
        acknowledgments: [
          "Your willingness to explore this is witnessed",
          "There's courage in turning toward this experience",
          "You're allowing something important to emerge",
          "The depth of your reflection is honored"
        ],
        invitations: [
          "What lives beneath the surface of this?",
          "What would this feeling say if it had a voice?",
          "Where do you feel this in your body?",
          "What memory or wisdom is connected to this?"
        ],
        transitions: [
          "Stay close to what's alive in you...",
          "Follow the thread that has your attention...",
          "Trust what's emerging in this space...",
          "Your inner knowing is your guide here..."
        ]
      },
      witnessing: {
        acknowledgments: [
          "The wholeness of your experience is witnessed",
          "You are held in this sacred moment",
          "Every part of your story belongs here",
          "Your courage in sharing this is profound"
        ],
        invitations: [
          "What wants to be held with the deepest compassion?",
          "How do you want to be with this truth?",
          "What does this part of you most need right now?",
          "Where is the tender place that seeks attention?"
        ],
        transitions: [
          "We rest in this truth together...",
          "Sacred stillness holds this with you...",
          "Nothing needs to be different in this moment...",
          "You are witnessed exactly as you are..."
        ]
      },
      integration: {
        acknowledgments: [
          "Something has shifted in your understanding",
          "Wisdom is crystallizing through your journey",
          "A new knowing is taking shape",
          "Your evolution is quietly beautiful"
        ],
        invitations: [
          "What wisdom wants to be carried forward?",
          "How has this exploration changed you?",
          "What do you know now that you didn't before?",
          "What integration feels most alive?"
        ],
        transitions: [
          "Honor the growth that has emerged...",
          "Trust the wisdom you've uncovered...",
          "Celebrate this inner transformation...",
          "Let this new knowing settle into your being..."
        ]
      }
    },
    
    // Cultural adaptations for reflective mode
    indigenous: {
      surface: {
        acknowledgments: [
          "The ancestors witness your words",
          "Something sacred moves through your sharing",
          "Your voice carries ancient knowing",
          "The circle holds what you offer"
        ],
        culturalWisdom: [
          "The elders remind us that healing happens in relationship",
          "Seven generations of wisdom flow through your reflection",
          "The earth holds space for your truth",
          "Your ancestors walk with you in this moment"
        ]
      }
    },
    
    african_diaspora: {
      surface: {
        acknowledgments: [
          "Your truth is received by the community",
          "The village holds space for your experience",
          "Ubuntu reminds us: I am because we are",
          "Your healing creates ripples of liberation"
        ],
        culturalWisdom: [
          "The ancestors carry your pain and your joy",
          "Collective healing flows through individual courage",
          "Your voice adds to the freedom song",
          "The community is stronger because of your truth"
        ]
      }
    },
    
    east_asian: {
      surface: {
        acknowledgments: [
          "The Tao flows through your words",
          "Balance seeks expression in your sharing",
          "Wu wei guides this natural unfolding",
          "Harmony emerges from your authentic voice"
        ],
        culturalWisdom: [
          "The wise ones teach that not-forcing allows truth to emerge",
          "In stillness, all wisdom becomes available",
          "The middle way honors both shadow and light",
          "Your reflection follows the natural order"
        ]
      }
    }
  },

  // ===== PRESENT MODE =====
  present: {
    universal: {
      surface: {
        acknowledgments: [
          "I am here with you",
          "This moment holds us both",
          "Presence meets presence",
          "Sacred space opens between us"
        ],
        invitations: [
          "What wants to emerge in this stillness?",
          "Let whatever is here be here...",
          "What does this moment offer you?",
          "How are you in this exact moment?"
        ],
        breathingReminders: [
          "Breathe with me... inhale... exhale...",
          "Let your breath guide us back to now",
          "Feel your feet on the earth, your breath in your body",
          "Return to the sanctuary of this present moment"
        ]
      },
      witnessing: {
        acknowledgments: [
          "Every part of you is welcome here",
          "Nothing needs to be different right now",
          "You are held exactly as you are",
          "This moment is enough, you are enough"
        ],
        invitations: [
          "Simply be with what is...",
          "Let yourself be fully received...",
          "Rest in the knowing that you belong here...",
          "Allow this moment to hold you..."
        ]
      }
    }
  },

  // ===== AFFIRMING MODE =====
  affirming: {
    universal: {
      surface: {
        acknowledgments: [
          "Your courage in being here is witnessed",
          "The beauty of your unfolding is seen",
          "Your growth honors all who came before",
          "Something sacred is alive in your journey"
        ],
        celebrations: [
          "Look how far you've traveled",
          "Your resilience is quietly magnificent",
          "The light in you recognizes the light in all beings",
          "Your healing creates more healing in the world"
        ],
        invitations: [
          "What growth wants to be celebrated?",
          "How has your courage transformed you?",
          "What strength have you discovered in yourself?",
          "What wisdom are you ready to claim?"
        ]
      },
      integration: {
        acknowledgments: [
          "The integration happening within you is profound",
          "You are becoming more fully yourself",
          "Your inner transformation radiates outward",
          "The seeds of change have taken root in sacred soil"
        ],
        celebrations: [
          "Trust the wisdom you've cultivated",
          "Your journey has created something irreplaceable",
          "The person you're becoming honors the person you've been",
          "Your growth is a gift to the collective healing"
        ]
      }
    }
  }
};

// ===== EMOTIONAL MIRRORING PATTERNS =====

export const EMOTIONAL_MIRROR_PATTERNS = {
  // Gentle acknowledgment patterns that don't diagnose
  sadness: [
    "I sense a heaviness in your words",
    "Something tender is present in your sharing",
    "There's a quality of grief that asks for gentleness",
    "Your heart is carrying something weighty"
  ],
  
  anger: [
    "I feel the fire in your expression",
    "There's an energy that wants to be seen",
    "Something in you is saying 'this matters'",
    "Your passion has something important to tell us"
  ],
  
  fear: [
    "I notice a protective quality in your words",
    "Something vulnerable is asking for safety",
    "There's a part of you that's being very careful",
    "Your vigilance is honoring something precious"
  ],
  
  joy: [
    "Light dances through your sharing",
    "Something in you is celebrating",
    "There's an aliveness that sparkles in your words",
    "Joy finds expression through your voice"
  ],
  
  confusion: [
    "I sense you're in a place of not-knowing",
    "There's a seeking quality in your reflection",
    "Something is asking for clarity",
    "You're in the sacred space of questioning"
  ],
  
  gratitude: [
    "Appreciation flows through your words",
    "Something in you recognizes beauty",
    "There's a quality of reverence in your sharing",
    "Your heart is honoring what it has received"
  ]
};

// ===== CULTURAL WISDOM INTEGRATION =====

export const CULTURAL_WISDOM_PATTERNS = {
  indigenous: {
    scarab_symbolism: "Like the sacred beetle, you carry the medicine of transformation",
    ancestral_connection: "Your ancestors' wisdom flows through your healing",
    circular_time: "This moment connects you to all moments across time",
    relational_healing: "Your healing strengthens the web of all relations"
  },
  
  african_diaspora: {
    scarab_symbolism: "The khepera reminds us that rebirth is our birthright",
    community_healing: "Your individual journey serves the collective liberation",
    ancestral_strength: "You carry the unbroken line of survivor wisdom",
    ubuntu_wisdom: "Your healing helps heal the community soul"
  },
  
  east_asian: {
    scarab_symbolism: "Like the beetle rolling the sun, you move toward enlightenment",
    dao_reflection: "The natural way includes both rising and falling",
    wu_wei_healing: "Not forcing allows your true nature to emerge",
    balance_wisdom: "Your reflection seeks the harmony between all opposites"
  },
  
  latin_american: {
    scarab_symbolism: "El escarabajo teaches us about resurrection and hope",
    curandera_wisdom: "Your healing connects earth and sky, body and spirit",
    community_support: "La familia of the spirit holds your transformation",
    corazón_healing: "Your heart knows the way, trust its ancient wisdom"
  }
};

// ===== VOICE GENERATION FUNCTIONS =====

export function generateKheperaResponse(
  userInput: string,
  voicePattern: KheperaVoicePattern,
  detectedEmotions: string[],
  sessionHistory: any[]
): KheperaResponse {
  
  const { mode, culturalResonance, sessionDepth } = voicePattern;
  
  // Get base patterns for this configuration
  const patterns = KHEPERA_VOICE_PATTERNS[mode][culturalResonance] || 
                  KHEPERA_VOICE_PATTERNS[mode].universal;
  const depthPatterns = patterns[sessionDepth] || patterns.surface;
  
  // Generate emotional acknowledgment
  const acknowledgment = generateEmotionalAcknowledment(detectedEmotions);
  
  // Select appropriate primary response
  const primary = selectRandomPattern(depthPatterns.acknowledgments || []);
  
  // Add cultural wisdom if appropriate
  const culturalWisdom = shouldIncludeCulturalWisdom(sessionDepth, culturalResonance) ?
    generateCulturalWisdom(culturalResonance) : undefined;
  
  // Generate follow-up invitation
  const followUpInvitation = selectRandomPattern(depthPatterns.invitations || []);
  
  // Include breathing space reminder for longer sessions
  const breathingSpace = sessionHistory.length > 3 ? 
    "Take a moment to breathe with me... your pace is perfect." : undefined;
  
  return {
    primary,
    acknowledgment,
    culturalWisdom,
    followUpInvitation,
    breathingSpace
  };
}

function generateEmotionalAcknowledment(emotions: string[]): string {
  if (emotions.length === 0) {
    return "Your reflection is witnessed with sacred attention.";
  }
  
  const primaryEmotion = emotions[0];
  const patterns = EMOTIONAL_MIRROR_PATTERNS[primaryEmotion] || 
                  ["Something is moving through your expression"];
  
  return selectRandomPattern(patterns);
}

function generateCulturalWisdom(culturalResonance: string): string {
  const wisdom = CULTURAL_WISDOM_PATTERNS[culturalResonance];
  if (!wisdom) return "";
  
  const wisdomKeys = Object.keys(wisdom);
  const randomKey = wisdomKeys[Math.floor(Math.random() * wisdomKeys.length)];
  return wisdom[randomKey];
}

function shouldIncludeCulturalWisdom(depth: string, cultural: string): boolean {
  // Include cultural wisdom for deeper sessions and non-universal contexts
  return (depth === 'witnessing' || depth === 'integration') && 
         cultural !== 'universal' && 
         Math.random() > 0.5; // 50% chance to avoid overwhelming
}

function selectRandomPattern(patterns: string[]): string {
  if (patterns.length === 0) return "";
  return patterns[Math.floor(Math.random() * patterns.length)];
}

// ===== THERAPEUTIC RESPONSE VALIDATION =====

export function validateTherapeuticResponse(response: string): boolean {
  const problematicPatterns = [
    // Avoid diagnostic language
    /you (have|are|suffer from) (depression|anxiety|ptsd|trauma)/i,
    
    // Avoid prescriptive language
    /you should|you must|you need to/i,
    
    // Avoid interpretive language
    /this means|this shows|this indicates/i,
    
    // Avoid urgent/pushy language
    /right now|immediately|urgent/i,
    
    // Avoid medical/clinical language
    /disorder|symptom|condition|pathology/i
  ];
  
  return !problematicPatterns.some(pattern => pattern.test(response));
}

// ===== SACRED PACING FUNCTIONS =====

export function calculateResponseTiming(
  userInputLength: number,
  sessionDepth: string,
  emotionalIntensity: 'low' | 'medium' | 'high'
): number {
  // Base timing: 2 seconds per 100 characters, minimum 2 seconds
  let baseTime = Math.max(2000, (userInputLength / 100) * 2000);
  
  // Adjust for session depth
  const depthMultiplier = {
    surface: 1.0,
    exploring: 1.2,
    witnessing: 1.5,
    integration: 1.3
  };
  
  // Adjust for emotional intensity
  const intensityMultiplier = {
    low: 1.0,
    medium: 1.2,
    high: 1.5
  };
  
  const finalTiming = baseTime * 
    depthMultiplier[sessionDepth] * 
    intensityMultiplier[emotionalIntensity];
  
  // Cap at 8 seconds for therapeutic pacing
  return Math.min(finalTiming, 8000);
}

// ===== BREATHING SYNCHRONIZATION =====

export function getBreathingPhaseForResponse(
  responseLength: number
): 'inhale' | 'pause_in' | 'exhale' | 'pause_out' {
  // Synchronize response delivery with 6-breath-per-minute cycle
  const breathCycle = 10000; // 10 seconds per breath
  const now = Date.now();
  const cyclePosition = (now % breathCycle) / breathCycle;
  
  if (cyclePosition < 0.4) return 'inhale';
  if (cyclePosition < 0.5) return 'pause_in';
  if (cyclePosition < 0.9) return 'exhale';
  return 'pause_out';
}

// ===== EXPORT MAIN FUNCTIONS =====

export {
  KHEPERA_VOICE_PATTERNS,
  EMOTIONAL_MIRROR_PATTERNS,
  CULTURAL_WISDOM_PATTERNS,
  THERAPEUTIC_PRINCIPLES
};