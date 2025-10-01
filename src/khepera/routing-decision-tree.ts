// KHEPERA Routing Decision Tree
// Affective AI | Therapeutic Alignment | Claude Integration

import { KHEPERA_MOOD_ROUTING, MoodState, ArchetypeRouting } from './mood-routing-engine';
import { KHEPERA_ARCHETYPES } from './archetype-config';

export interface RouteDecision {
  mood: MoodState;
  archetype: string;
  journaling_prompt: string;
  confidence_score: number;
  fallback_reason?: string;
  cultural_context?: string;
  safety_flags?: string[];
}

export interface RoutingContext {
  user_cultural_background?: string;
  session_history?: MoodState[];
  therapeutic_goals?: string[];
  safety_considerations?: string[];
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night';
  session_type?: 'check_in' | 'deep_work' | 'maintenance' | 'crisis';
}

export class KheperaMoodRouter {
  private routing_engine = KHEPERA_MOOD_ROUTING;
  private archetype_library = KHEPERA_ARCHETYPES;

  // Primary routing decision function
  route_mood_to_archetype(
    mood: MoodState, 
    context: RoutingContext = {}
  ): RouteDecision {
    // Get base routing from decision tree
    const base_routing = this.routing_engine.primary_routing[mood];
    
    // Calculate confidence score based on context
    const confidence_score = this.calculate_confidence(mood, context);
    
    // Check if confidence is below mirror threshold
    if (confidence_score < this.routing_engine.routing_confidence_thresholds.mirror_threshold) {
      return this.create_mirror_response(mood, context);
    }

    // Apply cultural adaptation if specified
    const culturally_adapted_prompt = this.adapt_for_culture(
      base_routing, 
      context.user_cultural_background
    );

    // Check for safety considerations
    const safety_flags = this.assess_safety_flags(mood, context);

    return {
      mood,
      archetype: base_routing.archetype,
      journaling_prompt: culturally_adapted_prompt,
      confidence_score,
      cultural_context: context.user_cultural_background,
      safety_flags: safety_flags.length > 0 ? safety_flags : undefined
    };
  }

  // Multi-mood routing for complex emotional states
  route_complex_mood(
    primary_mood: MoodState,
    secondary_moods: MoodState[],
    context: RoutingContext = {}
  ): RouteDecision {
    const primary_route = this.route_mood_to_archetype(primary_mood, context);
    
    // Blend archetypes for complex emotional states
    const harmonic_archetypes = this.find_harmonic_archetypes(
      primary_route.archetype, 
      secondary_moods
    );

    // Create blended prompt
    const blended_prompt = this.create_blended_prompt(
      primary_route,
      harmonic_archetypes,
      context
    );

    return {
      ...primary_route,
      journaling_prompt: blended_prompt,
      confidence_score: primary_route.confidence_score * 0.8 // Reduce confidence for complexity
    };
  }

  // Session-aware routing that considers history
  route_with_session_awareness(
    mood: MoodState,
    context: RoutingContext
  ): RouteDecision {
    const base_route = this.route_mood_to_archetype(mood, context);
    
    // Adjust based on session history
    if (context.session_history && context.session_history.length > 0) {
      const adjusted_route = this.adjust_for_session_pattern(base_route, context.session_history);
      return adjusted_route;
    }

    return base_route;
  }

  // Time-sensitive routing adjustments
  private adjust_for_time_context(route: RouteDecision, time_of_day?: string): RouteDecision {
    if (!time_of_day) return route;

    const time_adaptations: Record<string, Record<string, string>> = {
      'morning': {
        'cosmic_dancer': 'Good morning, beautiful soul! Your joy is sunrise energy, painting the world with possibility. What grateful movements want to flow onto these pages as you begin your day? 🌅💃',
        'mystic_healer': 'Gentle morning soul, I see you carrying that tender worry into this new day. Let\'s breathe together and listen to what your heart needs for peaceful navigation ahead. 🌿☀️'
      },
      'evening': {
        'sage_oracle': 'As day settles into twilight, what wisdom has this day offered your soul? Let the ancient stillness help you gather these teachings. 🌙🔮',
        'dream_weaver': 'As the veil between worlds grows thin in evening\'s embrace, what dreams are stirring in the depths of your being? 🌙✨'
      },
      'night': {
        'mystic_healer': 'In night\'s gentle embrace, your tender heart deserves the softest healing. What needs tending in these quiet hours? 🌙💚',
        'dream_weaver': 'Night\'s wisdom keeper, in these sacred hours between day and dream, what wants to emerge from the mysterious depths? 🌌🌙'
      }
    };

    if (time_adaptations[time_of_day]?.[route.archetype]) {
      return {
        ...route,
        journaling_prompt: time_adaptations[time_of_day][route.archetype]
      };
    }

    return route;
  }

  // Crisis intervention routing
  private route_crisis_intervention(mood: MoodState, context: RoutingContext): RouteDecision {
    const crisis_routing: Record<MoodState, Partial<RouteDecision>> = {
      'angry': {
        archetype: 'earth_guardian',
        journaling_prompt: 'I see this fierce energy needs immediate grounding. You\'re safe to feel this anger here. Let\'s channel it toward what needs protecting, starting with your own wellbeing. What boundary needs your fierce attention right now? 🛡️🌍',
        safety_flags: ['anger_management', 'grounding_needed']
      },
      'ashamed': {
        archetype: 'mystic_healer',
        journaling_prompt: 'Right now, you are enough. Exactly as you are, in this moment, you are worthy of love and belonging. That voice of shame is not the truth of who you are. What one small act of self-compassion can you offer yourself? 💚🕊️',
        safety_flags: ['shame_spiraling', 'self_compassion_needed']
      },
      'grieving': {
        archetype: 'sage_oracle',
        journaling_prompt: 'Sacred mourner, you are held in this moment of deep sorrow. Grief is love seeking expression. You do not walk this path alone. What support do you need right now? 🕯️🙏',
        safety_flags: ['grief_support', 'check_for_suicidal_ideation']
      },
      'anxious': {
        archetype: 'mystic_healer',
        journaling_prompt: 'Breathe with me. You are safe in this moment. Your nervous system is doing its best to protect you. Let\'s find your ground together. Feel your feet, your breath, your heartbeat. What do you need to feel safer right now? 🌿💙',
        safety_flags: ['anxiety_regulation', 'grounding_techniques']
      },
      'stuck': {
        archetype: 'sage_oracle',
        journaling_prompt: 'In this moment of feeling trapped, you are still breathing, still here, still worthy of support. Sometimes the next step is simply to acknowledge where you are. What one tiny movement feels possible? 🔮✨',
        safety_flags: ['depression_check', 'motivation_support']
      },
      'joyful': {
        archetype: 'cosmic_dancer',
        journaling_prompt: 'Your joy is welcome here, even if it feels intense or overwhelming. All feelings deserve space. How can we honor this energy in a way that feels safe and grounded? 🌟💃',
        safety_flags: ['mania_check', 'grounding_joy']
      },
      'hopeful': {
        archetype: 'star_typeof window !== 'undefined' && navigator',
        journaling_prompt: 'Hope can feel vulnerable when we\'ve been hurt. Your vision matters and deserves gentle tending. What small, safe step toward this hope feels possible right now? ⭐🗺️',
        safety_flags: ['hope_protection', 'realistic_planning']
      },
      'neutral': {
        archetype: 'dream_weaver',
        journaling_prompt: 'Sometimes neutral is the safest place to be, and that\'s perfectly okay. You don\'t need to feel anything other than what\'s true right now. What does your body need in this moment? 🌙💙',
        safety_flags: ['emotional_numbness_check', 'body_awareness']
      }
    };

    const crisis_route = crisis_routing[mood];
    return {
      mood,
      archetype: crisis_route.archetype || 'mystic_healer',
      journaling_prompt: crisis_route.journaling_prompt || this.routing_engine.mirror_fallback.journaling_prompt,
      confidence_score: 0.9, // High confidence for crisis intervention
      safety_flags: crisis_route.safety_flags
    };
  }

  // Private helper methods
  private calculate_confidence(mood: MoodState, context: RoutingContext): number {
    let base_confidence = 0.8;
    
    // Reduce confidence for complex contexts
    if (context.session_history && context.session_history.length > 3) {
      base_confidence *= 0.9;
    }
    
    // Increase confidence for crisis situations
    if (context.session_type === 'crisis') {
      base_confidence = 0.95;
    }
    
    // Adjust for therapeutic goals alignment
    if (context.therapeutic_goals) {
      base_confidence *= 1.1;
    }
    
    return Math.min(base_confidence, 1.0);
  }

  private create_mirror_response(mood: MoodState, context: RoutingContext): RouteDecision {
    return {
      mood,
      archetype: 'mirror_self',
      journaling_prompt: this.routing_engine.mirror_fallback.journaling_prompt,
      confidence_score: 0.3,
      fallback_reason: 'Low confidence in mood assessment - using mirror approach'
    };
  }

  private adapt_for_culture(routing: ArchetypeRouting, culture?: string): string {
    if (!culture || !routing.cultural_adaptations[culture]) {
      return routing.journaling_prompt;
    }
    
    const cultural_prefix = routing.cultural_adaptations[culture];
    return `${cultural_prefix} ${routing.journaling_prompt}`;
  }

  private assess_safety_flags(mood: MoodState, context: RoutingContext): string[] {
    const flags: string[] = [];
    
    if (context.session_type === 'crisis') {
      flags.push('crisis_intervention_needed');
    }
    
    if (mood === 'ashamed' && context.session_history?.includes('ashamed')) {
      flags.push('shame_spiral_pattern');
    }
    
    if (mood === 'grieving' && context.session_history?.filter(m => m === 'grieving').length > 3) {
      flags.push('prolonged_grief_pattern');
    }
    
    return flags;
  }

  private find_harmonic_archetypes(primary: string, secondary_moods: MoodState[]): string[] {
    const archetype = this.archetype_library.archetypes[primary];
    if (!archetype) return [];
    
    return archetype.cross_archetype_harmonics.filter(harmonic => 
      secondary_moods.some(mood => 
        this.routing_engine.primary_routing[mood]?.archetype === harmonic
      )
    );
  }

  private create_blended_prompt(
    primary_route: RouteDecision, 
    harmonics: string[], 
    context: RoutingContext
  ): string {
    // For now, return primary prompt - could implement blending logic
    return primary_route.journaling_prompt;
  }

  private adjust_for_session_pattern(route: RouteDecision, history: MoodState[]): RouteDecision {
    const recent_pattern = history.slice(-3);
    
    // If stuck in same mood for multiple sessions, introduce gentle archetype variation
    if (recent_pattern.every(mood => mood === route.mood)) {
      const base_routing = this.routing_engine.primary_routing[route.mood];
      if (base_routing.fallback_archetypes.length > 0) {
        return {
          ...route,
          archetype: base_routing.fallback_archetypes[0],
          journaling_prompt: `I notice you've been in this ${route.mood} space for a while. Let's try a different approach... ${route.journaling_prompt}`
        };
      }
    }
    
    return route;
  }
}

// Export the routing function for Claude integration
export function route_mood_to_archetype(
  mood: MoodState,
  context?: RoutingContext
): RouteDecision {
  const router = new KheperaMoodRouter();
  return router.route_mood_to_archetype(mood, context);
}

// Export sample routing responses for testing
export const SAMPLE_ROUTING_RESPONSES = {
  anxious: {
    mood: "anxious",
    archetype: "mystic_healer",
    journaling_prompt: "I see you, brave soul, carrying that flutter of worry in your chest. This anxiety holds important information - it's your system trying to protect you. Let's listen to its whispers with gentle curiosity. What is this tender guardian trying to tell you? 🌿💚"
  },
  joyful: {
    mood: "joyful", 
    archetype: "cosmic_dancer",
    journaling_prompt: "Your joy is a sacred dance that ripples through the universe! Let's celebrate this beautiful energy flowing through you. What movements of gratitude want to flow onto these pages? 🌟💃"
  },
  stuck: {
    mood: "stuck",
    archetype: "trickster_fool", 
    journaling_prompt: "Ah, the delicious trap of your own brilliant mind! You've built such a perfect maze of 'shoulds' and 'can'ts' that even you can't find the exit. But what if... what if the walls are made of paper? What if the answer is so simple it's been hiding in plain sight? Let's play with some beautiful impossibilities. 🃏✨"
  }
} as const;