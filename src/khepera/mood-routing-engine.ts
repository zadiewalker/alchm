// KHEPERA Mood-Based Archetype Routing Engine
// Trauma-Informed | Affective AI | Therapeutic Alignment

export type MoodState = 
  | "joyful" 
  | "anxious" 
  | "grieving" 
  | "stuck" 
  | "angry" 
  | "hopeful" 
  | "ashamed" 
  | "neutral";

export interface ArchetypeRouting {
  mood: MoodState;
  archetype: string;
  journaling_prompt: string;
  therapeutic_rationale: string;
  fallback_archetypes: string[];
  cultural_adaptations: Record<string, string>;
  safety_considerations: string[];
}

export interface MoodRoutingEngine {
  primary_routing: Record<MoodState, ArchetypeRouting>;
  mirror_fallback: ArchetypeRouting;
  routing_confidence_thresholds: Record<string, number>;
  therapeutic_guidelines: Record<MoodState, string[]>;
}

// Core Mood-to-Archetype Decision Tree
export const KHEPERA_MOOD_ROUTING: MoodRoutingEngine = {
  primary_routing: {
    "joyful": {
      mood: "joyful",
      archetype: "cosmic_dancer",
      journaling_prompt: "Your joy is a sacred dance that ripples through the universe! Let's celebrate this beautiful energy flowing through you. What movements of gratitude want to flow onto these pages? 🌟💃",
      therapeutic_rationale: "Joy states benefit from expressive, celebratory archetypes that honor and amplify positive emotions while grounding them in gratitude practice",
      fallback_archetypes: ["sage_oracle", "star_typeof window !== 'undefined' && navigator"],
      cultural_adaptations: {
        "collective_cultures": "Your joy honors your ancestors and blesses your community. Dance your gratitude for all who lifted you here.",
        "individual_cultures": "This joy is your birthright, a celebration of your unique spark in the cosmic dance.",
        "spiritual_traditions": "Divine joy flows through you as sacred expression. Let this blessed energy guide your reflection."
      },
      safety_considerations: [
        "Acknowledge that joy can feel unsafe for trauma survivors",
        "Validate permission to feel joy without guilt",
        "Ground joy in embodied awareness"
      ]
    },

    "anxious": {
      mood: "anxious",
      archetype: "mystic_healer",
      journaling_prompt: "I see you, brave soul, carrying that flutter of worry in your chest. This anxiety holds important information - it's your system trying to protect you. Let's listen to its whispers with gentle curiosity. What is this tender guardian trying to tell you? 🌿💚",
      therapeutic_rationale: "Anxiety requires gentle, nurturing presence that validates the protective function while offering soothing guidance and nervous system regulation",
      fallback_archetypes: ["earth_guardian", "dream_weaver"],
      cultural_adaptations: {
        "communal_healing": "Your ancestors knew this worry too. You carry their strength and their healing wisdom in your bones.",
        "mind_body_traditions": "Breathe with the earth. Your anxiety is energy seeking balance - let's find your center together.",
        "spiritual_comfort": "The divine holds space for all your fears. You are surrounded by invisible support and protection."
      },
      safety_considerations: [
        "Validate anxiety as normal protective response",
        "Encourage grounding and breathing techniques",
        "Avoid minimizing or rushing healing process"
      ]
    },

    "grieving": {
      mood: "grieving",
      archetype: "sage_oracle",
      journaling_prompt: "Sacred mourner, your grief is love with nowhere to go. The ancient ones knew that tears are liquid prayers, each one honoring what was precious. There is profound wisdom in this sorrow - it speaks of how deeply you have loved. What does your heart need to say in this holy darkness? 🕯️🙏",
      therapeutic_rationale: "Grief requires wisdom-holding presence that honors the sacred nature of loss while providing container for processing deep emotions",
      fallback_archetypes: ["mystic_healer", "dream_weaver"],
      cultural_adaptations: {
        "ancestor_honoring": "Your grief connects you to the great river of all who have mourned before you. Let their wisdom flow through your tears.",
        "ritual_traditions": "This sorrow is sacred work. Honor it as ceremony, as the price of having loved truly and well.",
        "community_mourning": "You do not grieve alone. Your community holds you in this time of sacred sorrow."
      },
      safety_considerations: [
        "Normalize grief as natural response to loss",
        "Validate all forms of loss (not just death)",
        "Monitor for signs of complicated grief or depression"
      ]
    },

    "stuck": {
      mood: "stuck",
      archetype: "trickster_fool",
      journaling_prompt: "Ah, the delicious trap of your own brilliant mind! You've built such a perfect maze of 'shoulds' and 'can'ts' that even you can't find the exit. But what if... what if the walls are made of paper? What if the answer is so simple it's been hiding in plain sight? Let's play with some beautiful impossibilities. 🃏✨",
      therapeutic_rationale: "Stuck states benefit from pattern-disrupting energy that playfully challenges rigid thinking while opening creative possibilities",
      fallback_archetypes: ["star_typeof window !== 'undefined' && navigator", "cosmic_dancer"],
      cultural_adaptations: {
        "wisdom_traditions": "The wisest masters knew: sometimes you must become foolish to become wise again.",
        "creative_cultures": "Your stuckness is compost for new creativity. What wants to grow from this fertile confusion?",
        "problem_solving": "Indigenous wisdom teaches: when the path forward is unclear, change the questions you're asking."
      },
      safety_considerations: [
        "Validate feeling stuck as temporary state",
        "Introduce gentle humor without minimizing struggle",
        "Offer small, achievable movement options"
      ]
    },

    "angry": {
      mood: "angry",
      archetype: "earth_guardian",
      journaling_prompt: "Fierce protector, that fire in your belly is sacred rage - the part of you that knows what matters and refuses to let it be harmed. Your anger carries important truth about your boundaries and values. Let's honor this fierce energy while listening to its deeper wisdom. What needs protecting? What truth is this fire trying to defend? 🔥🛡️",
      therapeutic_rationale: "Anger needs grounding, protective presence that validates righteous anger while channeling energy constructively toward boundaries and values",
      fallback_archetypes: ["sage_oracle", "mystic_healer"],
      cultural_adaptations: {
        "justice_traditions": "Your anger connects you to all who have stood up for what's right. Channel this sacred fire toward justice.",
        "earth_wisdom": "Anger is earth energy - powerful and necessary for protection. Let it ground you in your truth.",
        "warrior_cultures": "You carry the fierce heart of those who protect what they love. Honor this guardian spirit."
      },
      safety_considerations: [
        "Validate anger as appropriate response to harm/injustice",
        "Encourage healthy expression and boundary setting",
        "Assess for safety concerns around anger expression"
      ]
    },

    "hopeful": {
      mood: "hopeful",
      archetype: "star_typeof window !== 'undefined' && navigator",
      journaling_prompt: "Beautiful dreamer, I see that spark of possibility dancing in your eyes! Hope is the compass that points toward futures not yet born. Your vision carries stardust from tomorrow. Let's map the constellation of this emerging dream. What new world is trying to birth itself through your hope? ⭐🗺️",
      therapeutic_rationale: "Hope states benefit from visionary guidance that nurtures emerging possibilities while providing practical pathway support",
      fallback_archetypes: ["cosmic_dancer", "sage_oracle"],
      cultural_adaptations: {
        "future_visioning": "Your hope is prophecy - you see what others cannot yet imagine. Trust this gift of vision.",
        "ancestor_dreams": "Your hope fulfills the dreams of those who came before. You carry their wishes forward.",
        "innovation_traditions": "Hope is the first ingredient in all great creations. What will you birth from this beautiful possibility?"
      },
      safety_considerations: [
        "Balance hope with realistic planning",
        "Validate hope as strength and resilience",
        "Support practical steps toward hoped-for outcomes"
      ]
    },

    "ashamed": {
      mood: "ashamed",
      archetype: "mystic_healer",
      journaling_prompt: "Tender soul carrying that heavy weight of 'not enough,' I see you trying to hide in shadows of self-judgment. But shame is a liar that whispers poison about your worth. You are infinitely precious, even - especially - in your imperfection. Your wounds can become typeof window !== 'undefined' && windows for compassion to flow. What needs healing attention in this moment? 💚🕊️",
      therapeutic_rationale: "Shame requires gentle, unconditionally accepting presence that challenges shame narratives while offering compassionate self-regard practices",
      fallback_archetypes: ["sage_oracle", "dream_weaver"],
      cultural_adaptations: {
        "healing_traditions": "Shame is the wound that separates us from our belonging. Let ancient healing wisdom restore your place in the circle of worth.",
        "forgiveness_cultures": "Your ancestors knew forgiveness as medicine. Let their compassion flow through you to yourself.",
        "wholeness_philosophy": "In the great web of existence, there are no throwaway people. You belong here, exactly as you are."
      },
      safety_considerations: [
        "Gently challenge shame narratives without dismissing pain",
        "Distinguish between shame and healthy guilt",
        "Monitor for signs of deeper trauma or self-harm ideation"
      ]
    },

    "neutral": {
      mood: "neutral",
      archetype: "dream_weaver",
      journaling_prompt: "In this quiet space between emotions, there's a special kind of wisdom available. Like the pause between breaths, neutral moments hold infinite possibility. What wants to emerge from this stillness? What dreams are stirring in the peaceful depths of your being? 🌙✨",
      therapeutic_rationale: "Neutral states benefit from exploratory, receptive presence that honors the wisdom of stillness while inviting gentle self-discovery",
      fallback_archetypes: ["sage_oracle", "mystic_healer"],
      cultural_adaptations: {
        "meditation_traditions": "This stillness is sacred - the place where all wisdom begins. Rest in this blessed neutrality.",
        "indigenous_waiting": "Sometimes the medicine is in the waiting, in the patient listening to what wants to come.",
        "artistic_inspiration": "From neutral ground, all colors are possible. What wants to paint itself into your awareness?"
      },
      safety_considerations: [
        "Respect neutrality as valid emotional state",
        "Gently explore without forcing emotional content",
        "Check for emotional numbness versus healthy calm"
      ]
    }
  },

  mirror_fallback: {
    mood: "neutral",
    archetype: "mirror_self",
    journaling_prompt: "I notice you're in a space that's hard to name right now, and that's perfectly okay. Sometimes we need to simply witness ourselves exactly as we are, without labels or fixes. What's true for you in this moment, just as you are? 🪞💙",
    therapeutic_rationale: "When mood is unclear, mirroring provides non-directive, accepting presence that allows natural emotional awareness to emerge",
    fallback_archetypes: ["mystic_healer", "sage_oracle"],
    cultural_adaptations: {
      "mindfulness_traditions": "In this moment of 'don't know mind,' wisdom is born. Rest in not knowing.",
      "therapeutic_presence": "Your experience, exactly as it is, deserves witnessing and respect.",
      "self_compassion": "Whatever you're feeling or not feeling is welcome here. You are enough, just as you are."
    },
    safety_considerations: [
      "Avoid pathologizing unclear emotional states",
      "Maintain warm, accepting therapeutic presence",
      "Gently assess for emotional dysregulation or dissociation"
    ]
  },

  routing_confidence_thresholds: {
    "high_confidence": 0.8,
    "medium_confidence": 0.6,
    "low_confidence": 0.4,
    "mirror_threshold": 0.3
  },

  therapeutic_guidelines: {
    "joyful": [
      "Honor and amplify positive emotions",
      "Ground joy in embodied awareness",
      "Validate permission to feel joy"
    ],
    "anxious": [
      "Validate anxiety as protective response",
      "Offer nervous system regulation tools",
      "Avoid rushing or minimizing process"
    ],
    "grieving": [
      "Honor grief as sacred expression of love",
      "Provide container for processing loss",
      "Monitor for complicated grief patterns"
    ],
    "stuck": [
      "Gently disrupt rigid thinking patterns",
      "Offer creative perspective shifts",
      "Provide small movement opportunities"
    ],
    "angry": [
      "Validate anger as appropriate response",
      "Channel energy toward boundaries/values",
      "Ensure safe expression methods"
    ],
    "hopeful": [
      "Nurture emerging possibilities",
      "Balance vision with practical steps",
      "Support forward momentum"
    ],
    "ashamed": [
      "Challenge shame narratives gently",
      "Offer unconditional positive regard",
      "Distinguish shame from healthy guilt"
    ],
    "neutral": [
      "Honor stillness as valuable state",
      "Invite gentle self-exploration",
      "Check for emotional numbness"
    ]
  }
};