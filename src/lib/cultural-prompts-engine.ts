/**
 * ALCHM Cultural Prompts Engine
 * 
 * Philosophy: "Every culture carries medicine. Every tradition holds keys to healing."
 * 
 * This system generates journaling prompts that honor diverse healing traditions,
 * spiritual practices, and cultural wisdom while maintaining deep respect and avoiding appropriation.
 * All prompts are offered as invitations, not requirements, centering user choice and cultural humility.
 */

import { JournalEntry } from '@/lib/journal-service';

export interface CulturalPromptContext {
  userId: string;
  culturalBackground?: string[];
  healingPreferences?: string[];
  languagePreference?: string;
  recentMoodPattern?: number;
  communityOrientation?: 'individual' | 'collective' | 'balanced';
  spiritualOrientation?: 'spiritual' | 'secular' | 'eclectic';
  traumaInformed?: boolean;
}

export interface CulturalPrompt {
  id: string;
  prompt: string;
  culturalOrigin: string;
  category: string;
  emoji: string;
  healingTradition: string;
  approach: 'individual' | 'community' | 'ancestral' | 'land-based' | 'somatic' | 'narrative';
  sensitivityLevel: 'universal' | 'cultural-specific' | 'sacred-cautious';
  culturalContext: string;
  respectfulGuidance: string;
  adaptedForTrauma: boolean;
}

class CulturalPromptsEngine {
  
  /**
   * Generate culturally-responsive prompts based on user context
   */
  generateCulturalPrompts(
    entries: JournalEntry[],
    context: CulturalPromptContext
  ): CulturalPrompt[] {
    const prompts: CulturalPrompt[] = [];
    
    // Always include universal, trauma-informed prompts
    prompts.push(...this.getUniversalPrompts(context));
    
    // Add culturally-specific prompts based on user's background
    if (context.culturalBackground) {
      for (const culture of context.culturalBackground) {
        prompts.push(...this.getCultureSpecificPrompts(culture, context));
      }
    }
    
    // Add healing approach prompts
    if (context.healingPreferences) {
      for (const approach of context.healingPreferences) {
        prompts.push(...this.getHealingApproachPrompts(approach, context));
      }
    }
    
    // Filter for appropriateness and avoid over-representation
    return this.curateDiverseSelection(prompts, context);
  }

  /**
   * Universal prompts that honor human experiences across cultures
   */
  private getUniversalPrompts(context: CulturalPromptContext): CulturalPrompt[] {
    return [
      {
        id: 'ancestors_wisdom',
        prompt: "What wisdom do your ancestors (biological, chosen, or spiritual) want you to remember today?",
        culturalOrigin: "Universal - Cross-cultural",
        category: "Ancestral Connection",
        emoji: "🌟",
        healingTradition: "Ancestral reverence",
        approach: "ancestral",
        sensitivityLevel: "universal",
        culturalContext: "Most cultures honor elders and ancestral wisdom in some form",
        respectfulGuidance: "Honor whatever form of 'ancestors' feels right to you - biological family, chosen family, spiritual teachers, or cultural wisdom keepers",
        adaptedForTrauma: true
      },
      {
        id: 'belonging_spaces',
        prompt: "Where do you feel most like yourself? What makes a space feel like home to your soul?",
        culturalOrigin: "Universal - Human need for belonging",
        category: "Belonging & Safety",
        emoji: "🏠",
        healingTradition: "Place-based healing",
        approach: "individual",
        sensitivityLevel: "universal",
        culturalContext: "All humans need spaces of safety and belonging",
        respectfulGuidance: "This can be physical places, communities, or even internal states of being",
        adaptedForTrauma: true
      },
      {
        id: 'collective_healing',
        prompt: "How does your healing serve not just you, but your community or future generations?",
        culturalOrigin: "Universal - Interdependence",
        category: "Collective Healing",
        emoji: "🔗",
        healingTradition: "Community-centered wellness",
        approach: "community",
        sensitivityLevel: "universal",
        culturalContext: "Many cultures emphasize healing as community work",
        respectfulGuidance: "Community can mean family, chosen family, cultural community, or humanity as a whole",
        adaptedForTrauma: true
      }
    ];
  }

  /**
   * Culture-specific prompts offered with deep respect and proper context
   */
  private getCultureSpecificPrompts(culture: string, context: CulturalPromptContext): CulturalPrompt[] {
    const culturePrompts: Record<string, CulturalPrompt[]> = {
      'indigenous_connected': [
        {
          id: 'land_teachings',
          prompt: "If you feel connected to this practice: What is the land trying to teach you right now? What do you notice in the natural world that mirrors your inner experience?",
          culturalOrigin: "Indigenous wisdom traditions",
          category: "Land Connection",
          emoji: "🌍",
          healingTradition: "Land-based healing",
          approach: "land-based",
          sensitivityLevel: "cultural-specific",
          culturalContext: "Many Indigenous traditions emphasize learning from and relationship with the natural world",
          respectfulGuidance: "Only engage with this if you have genuine connection to Indigenous teachings. This is offered as invitation, not appropriation.",
          adaptedForTrauma: true
        },
        {
          id: 'seven_generations',
          prompt: "Thinking seven generations ahead: How might the healing work you're doing today impact the children not yet born?",
          culturalOrigin: "Indigenous North American traditions",
          category: "Future Impact",
          emoji: "🌳",
          healingTradition: "Seven generations thinking",
          approach: "ancestral",
          sensitivityLevel: "cultural-specific",
          culturalContext: "Many Indigenous cultures consider the impact of decisions on seven generations forward",
          respectfulGuidance: "This principle of long-term thinking can guide anyone, regardless of cultural background",
          adaptedForTrauma: true
        }
      ],
      
      'african_diaspora': [
        {
          id: 'ubuntu_healing',
          prompt: "Ubuntu teaches 'I am because we are.' How has community shaped your healing? How does your healing contribute to collective wellness?",
          culturalOrigin: "Southern African Ubuntu philosophy",
          category: "Community Healing",
          emoji: "🤝",
          healingTradition: "Ubuntu/Hunhu philosophy",
          approach: "community",
          sensitivityLevel: "cultural-specific",
          culturalContext: "Ubuntu emphasizes our fundamental interconnectedness and collective humanity",
          respectfulGuidance: "This African philosophy offers wisdom about interdependence that can guide anyone's healing journey",
          adaptedForTrauma: true
        },
        {
          id: 'ancestral_strength',
          prompt: "What strength runs through your bloodline? What resilience did your ancestors carry that lives in you today?",
          culturalOrigin: "African and African diaspora traditions",
          category: "Ancestral Strength",
          emoji: "👑",
          healingTradition: "Ancestral veneration",
          approach: "ancestral",
          sensitivityLevel: "cultural-specific",
          culturalContext: "African cultures often emphasize the ongoing presence and wisdom of ancestors",
          respectfulGuidance: "Honor your own ancestral connections, whether biological, spiritual, or cultural",
          adaptedForTrauma: true
        }
      ],
      
      'asian_traditions': [
        {
          id: 'balance_harmony',
          prompt: "What feels out of balance in your life right now? How might you gently restore harmony without forcing or rushing?",
          culturalOrigin: "East Asian balance philosophies",
          category: "Balance & Harmony",
          emoji: "☯️",
          healingTradition: "Balance/harmony principles",
          approach: "individual",
          sensitivityLevel: "cultural-specific",
          culturalContext: "Many Asian philosophies emphasize balance, harmony, and gentle movement toward wellness",
          respectfulGuidance: "These principles of balance can guide anyone's approach to healing and growth",
          adaptedForTrauma: true
        },
        {
          id: 'compassion_cultivation',
          prompt: "How has your suffering taught you compassion - for yourself and others? What wisdom emerged from your most difficult experiences?",
          culturalOrigin: "Buddhist and Hindu compassion traditions",
          category: "Compassion & Wisdom",
          emoji: "🪷",
          healingTradition: "Compassion cultivation",
          approach: "individual",
          sensitivityLevel: "cultural-specific",
          culturalContext: "Buddhist and other traditions teach that suffering can be transformed into compassion and wisdom",
          respectfulGuidance: "The principle of transforming suffering into compassion is universally applicable",
          adaptedForTrauma: true
        }
      ],
      
      'latin_american': [
        {
          id: 'familismo_healing',
          prompt: "How does your family (biological or chosen) support your healing? What healing wisdom has been passed down through your lineage?",
          culturalOrigin: "Latin American familismo traditions",
          category: "Family & Community",
          emoji: "👨‍👩‍👧‍👦",
          healingTradition: "Familismo/family-centered healing",
          approach: "community",
          sensitivityLevel: "cultural-specific",
          culturalContext: "Latin American cultures often emphasize strong family bonds and collective support",
          respectfulGuidance: "Family can include biological family, chosen family, or spiritual family",
          adaptedForTrauma: true
        },
        {
          id: 'saudade_transformation',
          prompt: "What do you deeply long for? How might this longing be pointing you toward what's most important in your life?",
          culturalOrigin: "Portuguese/Brazilian saudade concept",
          category: "Longing & Hope",
          emoji: "🌊",
          healingTradition: "Saudade - transforming longing into beauty",
          approach: "individual",
          sensitivityLevel: "cultural-specific",
          culturalContext: "Saudade represents a bittersweet longing that can be transformed into appreciation and hope",
          respectfulGuidance: "The concept of honoring longing as wisdom is universally human",
          adaptedForTrauma: true
        }
      ],
      
      'multicultural_blend': [
        {
          id: 'cultural_integration',
          prompt: "You hold multiple cultural identities. How do different parts of your cultural self offer different kinds of healing wisdom?",
          culturalOrigin: "Multicultural lived experience",
          category: "Identity Integration",
          emoji: "🌈",
          healingTradition: "Multicultural identity navigation",
          approach: "individual",
          sensitivityLevel: "cultural-specific",
          culturalContext: "Many people navigate multiple cultural identities and can draw from various healing traditions",
          respectfulGuidance: "Honor all the cultural wisdom you carry while being respectful of each tradition",
          adaptedForTrauma: true
        },
        {
          id: 'code_switching_wisdom',
          prompt: "How do you navigate between different cultural spaces? What skills have you developed that could be teaching you about resilience and adaptability?",
          culturalOrigin: "Multicultural experience",
          category: "Cultural Navigation",
          emoji: "🗺️",
          healingTradition: "Cultural adaptation skills",
          approach: "individual",
          sensitivityLevel: "cultural-specific",
          culturalContext: "Code-switching and cultural navigation require significant emotional intelligence and resilience",
          respectfulGuidance: "These are valuable life skills that demonstrate your flexibility and strength",
          adaptedForTrauma: true
        }
      ]
    };

    return culturePrompts[culture] || [];
  }

  /**
   * Healing approach specific prompts
   */
  private getHealingApproachPrompts(approach: string, context: CulturalPromptContext): CulturalPrompt[] {
    const approachPrompts: Record<string, CulturalPrompt[]> = {
      'community_centered': [
        {
          id: 'healing_circles',
          prompt: "Who are the people who witness your growth with love? How do you create or find healing circles in your life?",
          culturalOrigin: "Cross-cultural community healing",
          category: "Healing Community",
          emoji: "○",
          healingTradition: "Circle practices",
          approach: "community",
          sensitivityLevel: "universal",
          culturalContext: "Many cultures use circle practices for healing and community connection",
          respectfulGuidance: "Circles can be formal or informal - any group that offers mutual support and witnessing",
          adaptedForTrauma: true
        }
      ],
      
      'somatic_body_based': [
        {
          id: 'body_wisdom',
          prompt: "What is your body trying to tell you today? How can you listen to its wisdom with compassion rather than judgment?",
          culturalOrigin: "Embodied healing traditions",
          category: "Somatic Wisdom",
          emoji: "🧘‍♀️",
          healingTradition: "Embodied healing",
          approach: "somatic",
          sensitivityLevel: "universal",
          culturalContext: "Many healing traditions recognize the body's inherent wisdom and intelligence",
          respectfulGuidance: "Listen to your body's messages without forcing or analyzing - simply witness with kindness",
          adaptedForTrauma: true
        }
      ],
      
      'ritual_ceremonial': [
        {
          id: 'transition_ritual',
          prompt: "What transition or change in your life needs honoring? How might you create a small ritual to mark this passage?",
          culturalOrigin: "Cross-cultural ritual traditions",
          category: "Sacred Transitions",
          emoji: "🕯️",
          healingTradition: "Ritual and ceremony",
          approach: "individual",
          sensitivityLevel: "universal",
          culturalContext: "Most cultures have rituals for marking important life transitions",
          respectfulGuidance: "Rituals can be simple and personal - lighting a candle, taking a walk, or creating art",
          adaptedForTrauma: true
        }
      ],
      
      'storytelling_narrative': [
        {
          id: 'story_medicine',
          prompt: "If your life were a story, what chapter are you in now? What would you want future readers to understand about this time?",
          culturalOrigin: "Narrative healing traditions",
          category: "Story Medicine",
          emoji: "📖",
          healingTradition: "Narrative therapy",
          approach: "narrative",
          sensitivityLevel: "universal",
          culturalContext: "Storytelling is a universal human healing practice across all cultures",
          respectfulGuidance: "You are the author of your own story - there is no right or wrong way to tell it",
          adaptedForTrauma: true
        }
      ]
    };

    return approachPrompts[approach] || [];
  }

  /**
   * Curate a diverse, respectful selection of prompts
   */
  private curateDiverseSelection(prompts: CulturalPrompt[], context: CulturalPromptContext): CulturalPrompt[] {
    // Ensure trauma-informed prompts if needed
    let filteredPrompts = context.traumaInformed 
      ? prompts.filter(p => p.adaptedForTrauma)
      : prompts;

    // Ensure diverse approaches
    const approaches = ['individual', 'community', 'ancestral', 'land-based', 'somatic', 'narrative'];
    const diversePrompts: CulturalPrompt[] = [];

    // Include at least one from each available approach
    approaches.forEach(approach => {
      const approachPrompts = filteredPrompts.filter(p => p.approach === approach);
      if (approachPrompts.length > 0) {
        const randomPrompt = approachPrompts[Math.floor(Math.random() * approachPrompts.length)];
        diversePrompts.push(randomPrompt);
      }
    });

    // Fill remaining slots with random selection, avoiding duplicates
    const remainingPrompts = filteredPrompts.filter(p => 
      !diversePrompts.some(dp => dp.id === p.id)
    );
    
    while (diversePrompts.length < 6 && remainingPrompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingPrompts.length);
      diversePrompts.push(remainingPrompts.splice(randomIndex, 1)[0]);
    }

    return diversePrompts.slice(0, 6);
  }

  /**
   * Get prompts for specific cultural moments or seasons
   */
  getCulturalSeasonalPrompts(season: 'spring' | 'summer' | 'fall' | 'winter', context: CulturalPromptContext): CulturalPrompt[] {
    // This would include culturally-aware seasonal prompts
    // For now, return a sample
    return [
      {
        id: 'seasonal_wisdom',
        prompt: `What is this season teaching you about cycles, change, and renewal in your own life?`,
        culturalOrigin: "Cross-cultural seasonal wisdom",
        category: "Seasonal Reflection",
        emoji: "🌸",
        healingTradition: "Seasonal attunement",
        approach: "land-based",
        sensitivityLevel: "universal",
        culturalContext: "Many cultures honor the wisdom and teachings of natural seasons",
        respectfulGuidance: "Notice what this season offers as wisdom for your inner journey",
        adaptedForTrauma: true
      }
    ];
  }
}

// Export singleton instance
export const culturalPromptsEngine = new CulturalPromptsEngine();

export default CulturalPromptsEngine;