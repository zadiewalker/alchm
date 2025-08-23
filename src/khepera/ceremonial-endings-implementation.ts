// KHEPERA Ceremonial Endings Generator
// Sacred Closure Language for Dynamic Journaling Sessions

import ceremonial_endings from './ceremonial-endings.json';

export interface CeremonialEnding {
  text: string;
  archetype_suitability: string[];
  tone: 'stillness' | 'empowerment';
  ceremonial_weight: 'light' | 'medium' | 'profound';
}

export interface EndingSelectionCriteria {
  archetype?: string;
  session_intensity?: 'low' | 'medium' | 'high';
  user_energy_level?: 'depleted' | 'neutral' | 'energized';
  session_type?: 'check_in' | 'deep_work' | 'integration' | 'celebration';
  emotional_state?: 'tender' | 'empowered' | 'contemplative' | 'grateful';
}

export class CeremonialEndingsGenerator {
  private endings: CeremonialEnding[] = ceremonial_endings;

  // Get appropriate ending based on session context
  get_contextual_ending(criteria: EndingSelectionCriteria): CeremonialEnding {
    let suitable_endings = this.filter_by_archetype(criteria.archetype);
    
    // Filter by tone based on user energy and session type
    suitable_endings = this.filter_by_tone(suitable_endings, criteria);
    
    // Filter by ceremonial weight based on session intensity
    suitable_endings = this.filter_by_weight(suitable_endings, criteria.session_intensity);
    
    // Return random selection from suitable endings
    return suitable_endings[Math.floor(Math.random() * suitable_endings.length)] || this.get_universal_fallback();
  }

  // Get ending suitable for specific archetype
  private filter_by_archetype(archetype?: string): CeremonialEnding[] {
    if (!archetype) return this.endings;
    
    return this.endings.filter(ending => 
      ending.archetype_suitability.includes('all') || 
      ending.archetype_suitability.includes(archetype)
    );
  }

  // Filter by appropriate tone
  private filter_by_tone(endings: CeremonialEnding[], criteria: EndingSelectionCriteria): CeremonialEnding[] {
    // If user is depleted or in tender state, prefer stillness
    if (criteria.user_energy_level === 'depleted' || criteria.emotional_state === 'tender') {
      const stillness_endings = endings.filter(e => e.tone === 'stillness');
      return stillness_endings.length > 0 ? stillness_endings : endings;
    }
    
    // If user is energized or celebrating, prefer empowerment
    if (criteria.user_energy_level === 'energized' || criteria.session_type === 'celebration') {
      const empowerment_endings = endings.filter(e => e.tone === 'empowerment');
      return empowerment_endings.length > 0 ? empowerment_endings : endings;
    }
    
    return endings; // No tone preference
  }

  // Filter by ceremonial weight
  private filter_by_weight(endings: CeremonialEnding[], intensity?: string): CeremonialEnding[] {
    if (!intensity) return endings;
    
    switch (intensity) {
      case 'low':
        return endings.filter(e => e.ceremonial_weight === 'light' || e.ceremonial_weight === 'medium');
      case 'high':
        return endings.filter(e => e.ceremonial_weight === 'profound' || e.ceremonial_weight === 'medium');
      default:
        return endings;
    }
  }

  // Universal fallback ending
  private get_universal_fallback(): CeremonialEnding {
    return {
      text: "You showed up. That matters.",
      archetype_suitability: ['all'],
      tone: 'stillness',
      ceremonial_weight: 'light'
    };
  }

  // Get all endings suitable for an archetype
  get_archetype_endings(archetype: string): CeremonialEnding[] {
    return this.endings.filter(ending =>
      ending.archetype_suitability.includes('all') ||
      ending.archetype_suitability.includes(archetype)
    );
  }

  // Get endings by tone
  get_endings_by_tone(tone: 'stillness' | 'empowerment'): CeremonialEnding[] {
    return this.endings.filter(ending => ending.tone === tone);
  }

  // Get weighted random ending (profound endings more likely for deep sessions)
  get_weighted_ending(archetype?: string, prefer_profound?: boolean): CeremonialEnding {
    let suitable = this.filter_by_archetype(archetype);
    
    if (prefer_profound) {
      const profound_endings = suitable.filter(e => e.ceremonial_weight === 'profound');
      if (profound_endings.length > 0) {
        // 70% chance of profound ending, 30% chance of any suitable ending
        return Math.random() < 0.7 
          ? profound_endings[Math.floor(Math.random() * profound_endings.length)]
          : suitable[Math.floor(Math.random() * suitable.length)];
      }
    }
    
    return suitable[Math.floor(Math.random() * suitable.length)] || this.get_universal_fallback();
  }
}

// Example usage patterns
export const ENDING_USAGE_EXAMPLES = {
  post_deep_shadow_work: {
    criteria: {
      archetype: 'mystic_healer',
      session_intensity: 'high',
      user_energy_level: 'depleted',
      session_type: 'deep_work',
      emotional_state: 'tender'
    },
    likely_endings: [
      "You touched something real today. Let it touch you back.",
      "What needed to move through you, moved. What needed to stay, stayed.",
      "You honored both your light and your darkness. This is wholeness."
    ]
  },

  celebration_session: {
    criteria: {
      archetype: 'cosmic_dancer',
      session_intensity: 'medium',
      user_energy_level: 'energized',
      session_type: 'celebration',
      emotional_state: 'grateful'
    },
    likely_endings: [
      "You danced with your shadows and called it holy work.",
      "Your authentic voice rang clear. The world is richer for hearing it.",
      "Every word you wrote was an act of courage. Honor that bravery."
    ]
  },

  gentle_check_in: {
    criteria: {
      session_intensity: 'low',
      user_energy_level: 'neutral',
      session_type: 'check_in',
      emotional_state: 'contemplative'
    },
    likely_endings: [
      "You came exactly as you are. That was enough.",
      "Your story deserves to be told. You told it.",
      "You're not behind—you're unfolding."
    ]
  },

  wisdom_seeking: {
    criteria: {
      archetype: 'sage_oracle',
      session_intensity: 'medium',
      user_energy_level: 'neutral',
      session_type: 'integration',
      emotional_state: 'contemplative'
    },
    likely_endings: [
      "In the space between questions and answers, wisdom lives. You found it.",
      "Your inner knowing spoke. The universe listened.",
      "The seeds you planted with your words will grow in their own season."
    ]
  }
};

// Helper function for easy integration
export function get_dynamic_ending(
  archetype?: string,
  session_context?: Partial<EndingSelectionCriteria>
): string {
  const generator = new CeremonialEndingsGenerator();
  const criteria = { archetype, ...session_context };
  const ending = generator.get_contextual_ending(criteria);
  return ending.text;
}

// Export the endings data for direct access
export { ceremonial_endings };
export const CEREMONIAL_ENDINGS_LIST = ceremonial_endings;