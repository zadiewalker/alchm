/**
 * Khepera Archetypes System
 * Sacred archetypal wisdom for personalized healing journeys
 */

export interface KheperaArchetype {
  id: string;
  name: string;
  description: string;
  traits: string[];
  healingApproach: string;
  shadowWork: string[];
  gifts: string[];
}

export interface ArchetypeAnalysis {
  primaryArchetype: KheperaArchetype;
  secondaryArchetypes: KheperaArchetype[];
  healingRecommendations: string[];
  growthEdges: string[];
}

export const KHEPERA_ARCHETYPES: KheperaArchetype[] = [
  {
    id: 'compassionate_healer',
    name: 'The Compassionate Healer',
    description: 'You embody deep empathy and natural healing wisdom.',
    traits: ['Empathetic', 'Intuitive', 'Nurturing', 'Sensitive'],
    healingApproach: 'Through gentle self-compassion and caring for others',
    shadowWork: ['Boundary setting', 'Self-care over others-care'],
    gifts: ['Deep emotional intelligence', 'Natural healing presence']
  },
  {
    id: 'wise_seeker',
    name: 'The Wise Seeker',
    description: 'You are on a constant journey of learning and growth.',
    traits: ['Curious', 'Reflective', 'Growth-oriented', 'Philosophical'],
    healingApproach: 'Through continuous learning and self-discovery',
    shadowWork: ['Accepting not knowing', 'Being over doing'],
    gifts: ['Pattern recognition', 'Synthesis of complex ideas']
  },
  {
    id: 'creative_transformer',
    name: 'The Creative Transformer',
    description: 'You transmute pain into beauty and meaning.',
    traits: ['Creative', 'Resilient', 'Transformative', 'Artistic'],
    healingApproach: 'Through creative expression and artistic transformation',
    shadowWork: ['Structure and discipline', 'Completing projects'],
    gifts: ['Alchemical healing', 'Beauty creation']
  }
];

export class KheperaArchetypeSystem {
  static analyzeUserArchetype(journalData: any[], preferences: any): ArchetypeAnalysis {
    // Simple implementation - in reality would use more sophisticated analysis
    const primaryArchetype = KHEPERA_ARCHETYPES[0];
    const secondaryArchetypes = KHEPERA_ARCHETYPES.slice(1, 3);

    return {
      primaryArchetype,
      secondaryArchetypes,
      healingRecommendations: [
        'Practice daily self-compassion rituals',
        'Engage in creative healing activities',
        'Connect with supportive community'
      ],
      growthEdges: [
        'Setting healthy boundaries',
        'Prioritizing your own needs',
        'Celebrating small wins'
      ]
    };
  }

  static getArchetypeById(id: string): KheperaArchetype | undefined {
    return KHEPERA_ARCHETYPES.find(archetype => archetype.id === id);
  }

  static getPersonalizedPrompts(archetype: KheperaArchetype): string[] {
    return [
      `As a ${archetype.name}, what healing wisdom emerged for you today?`,
      `How did you honor your ${archetype.traits[0].toLowerCase()} nature today?`,
      `What would your wisest self say about today's experience?`
    ];
  }
}

export default KheperaArchetypeSystem;