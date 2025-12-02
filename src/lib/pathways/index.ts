/**
 * ALCHM Transformative Pathways System
 * 
 * Collection of all pathways available in the healing journey
 */

import type { Pathway } from '@/types/pathways';
import { EMOTIONAL_AWARENESS_PATHWAY } from './emotional-awareness';

// Additional pathway outlines to be fully implemented
const SHADOW_INTEGRATION_PATHWAY: Pathway = {
  id: 'shadow-integration',
  title: 'Shadow Integration',
  subtitle: 'Meeting the Parts We\'ve Hidden',
  description: 'Explore the parts of yourself you\'ve disowned, rejected, or hidden. In the shadow lies not only pain but gold — gifts that have been waiting for your courage to claim them.',
  icon: 'moon',
  color: '#4A4A4A',
  
  prerequisitePathways: ['emotional-awareness'],
  minimumEntries: 5,
  
  difficulty: 'intensive',
  estimatedDuration: '3-4 weeks',
  totalXP: 700,
  
  archetypeGuide: 'The Shadow',
  coreWound: 'Self-rejection and fragmentation',
  coreGift: 'Wholeness and authentic power',
  
  triggerWarnings: [
    'This pathway involves exploring rejected parts of self',
    'Early memories and wounds may surface',
    'Take breaks as needed and use grounding practices'
  ],
  
  lessons: [], // To be implemented
  supportResources: [
    {
      type: 'crisis',
      title: '988 Suicide & Crisis Lifeline',
      phone: '988'
    }
  ]
};

const INNER_CHILD_HEALING_PATHWAY: Pathway = {
  id: 'inner-child-healing',
  title: 'Inner Child Healing',
  subtitle: 'Reparenting the Wounded Self',
  description: 'Meet the young parts of yourself that still carry pain, and learn to give them what they never received. This is the work of becoming your own loving parent.',
  icon: 'sprout',
  color: '#E8A87C',
  
  prerequisitePathways: ['emotional-awareness'],
  
  difficulty: 'intensive',
  estimatedDuration: '3-4 weeks',
  totalXP: 700,
  
  archetypeGuide: 'The Nurturer',
  coreWound: 'Unmet childhood needs, attachment wounds',
  coreGift: 'Self-compassion, inner security, capacity to receive love',
  
  lessons: [], // To be implemented
  supportResources: []
};

const SOMATIC_WISDOM_PATHWAY: Pathway = {
  id: 'somatic-wisdom',
  title: 'Somatic Wisdom',
  subtitle: 'Healing Through the Body',
  description: 'Your body has been keeping the score. Learn to read its language, release stored trauma, and return to embodied wholeness.',
  icon: 'body',
  color: '#D76B6B',
  
  difficulty: 'moderate',
  estimatedDuration: '2-3 weeks',
  totalXP: 500,
  
  archetypeGuide: 'The Body',
  coreWound: 'Disembodiment, trauma stored in tissue',
  coreGift: 'Embodied presence, nervous system regulation, physical intuition',
  
  lessons: [], // To be implemented
  supportResources: []
};

const RELATIONSHIP_PATTERNS_PATHWAY: Pathway = {
  id: 'relationship-patterns',
  title: 'Relationship Patterns',
  subtitle: 'Understanding How You Connect',
  description: 'Explore your attachment style, relationship patterns, and the unconscious dynamics that play out in your connections. Learn to love differently.',
  icon: 'link',
  color: '#9B6BD7',
  
  prerequisitePathways: ['emotional-awareness'],
  
  difficulty: 'moderate',
  estimatedDuration: '3-4 weeks',
  totalXP: 600,
  
  archetypeGuide: 'The Mirror',
  coreWound: 'Insecure attachment, relational trauma',
  coreGift: 'Secure attachment, conscious relating, healthy boundaries',
  
  lessons: [], // To be implemented
  supportResources: []
};

const SELF_COMPASSION_PATHWAY: Pathway = {
  id: 'self-compassion',
  title: 'Self-Compassion',
  subtitle: 'Becoming Your Own Ally',
  description: 'Most of us are our own harshest critics. This pathway teaches the revolutionary practice of treating yourself with kindness.',
  icon: 'heart-hands',
  color: '#41B3A3',
  
  difficulty: 'gentle',
  estimatedDuration: '2 weeks',
  totalXP: 400,
  
  archetypeGuide: 'The Nurturer',
  coreWound: 'Inner critic, shame, perfectionism',
  coreGift: 'Inner kindness, resilience, self-acceptance',
  
  lessons: [], // To be implemented
  supportResources: []
};

const PURPOSE_MEANING_PATHWAY: Pathway = {
  id: 'purpose-meaning',
  title: 'Purpose & Meaning',
  subtitle: 'Why Am I Here?',
  description: 'Explore the existential questions: What is your life for? What are you here to give? This pathway helps you orient toward meaning.',
  icon: 'compass',
  color: '#C5A47E',
  
  prerequisitePathways: ['emotional-awareness', 'shadow-integration'],
  minimumEntries: 15,
  
  difficulty: 'intensive',
  estimatedDuration: '3-4 weeks',
  totalXP: 650,
  
  archetypeGuide: 'The Sage',
  coreWound: 'Meaninglessness, disconnection from purpose',
  coreGift: 'Clarity of purpose, aligned action, contribution',
  
  lessons: [], // To be implemented
  supportResources: []
};

const GRIEF_LOSS_PATHWAY: Pathway = {
  id: 'grief-loss',
  title: 'Grief & Loss',
  subtitle: 'Honoring What Has Ended',
  description: 'We are all carrying unprocessed grief — for people, places, identities, unlived lives. This pathway creates space to feel fully and complete the incomplete.',
  icon: 'river',
  color: '#5D5D8D',
  
  difficulty: 'intensive',
  estimatedDuration: '3-4 weeks',
  totalXP: 650,
  
  archetypeGuide: 'The Healer',
  coreWound: 'Frozen grief, incomplete mourning',
  coreGift: 'Wholeness, presence, capacity for joy',
  
  triggerWarnings: [
    'This pathway explores loss, death, and endings',
    'Intense emotions may arise',
    'Take breaks and use support resources as needed'
  ],
  
  lessons: [], // To be implemented
  supportResources: []
};

const BOUNDARIES_POWER_PATHWAY: Pathway = {
  id: 'boundaries-power',
  title: 'Boundaries & Power',
  subtitle: 'Reclaiming Your Sovereignty',
  description: 'Learn to say no. Learn to take up space. Learn that your needs matter. This pathway reclaims the power you gave away.',
  icon: 'shield',
  color: '#B84D4D',
  
  prerequisitePathways: ['emotional-awareness'],
  
  difficulty: 'moderate',
  estimatedDuration: '2-3 weeks',
  totalXP: 500,
  
  archetypeGuide: 'The Coach',
  coreWound: 'People-pleasing, codependency, powerlessness',
  coreGift: 'Healthy boundaries, authentic power, self-respect',
  
  lessons: [], // To be implemented
  supportResources: []
};

// Main pathways collection
export const PATHWAYS: Pathway[] = [
  EMOTIONAL_AWARENESS_PATHWAY,
  SELF_COMPASSION_PATHWAY,
  SOMATIC_WISDOM_PATHWAY,
  INNER_CHILD_HEALING_PATHWAY,
  RELATIONSHIP_PATTERNS_PATHWAY,
  BOUNDARIES_POWER_PATHWAY,
  SHADOW_INTEGRATION_PATHWAY,
  GRIEF_LOSS_PATHWAY,
  PURPOSE_MEANING_PATHWAY,
];

// Helper functions
export function getPathway(id: string): Pathway | undefined {
  return PATHWAYS.find(pathway => pathway.id === id);
}

export function getLesson(pathwayId: string, lessonId: string) {
  const pathway = getPathway(pathwayId);
  return pathway?.lessons.find(lesson => lesson.id === lessonId);
}

export function getAvailablePathways(completedPathways: string[], entryCount: number): Pathway[] {
  return PATHWAYS.filter(pathway => {
    // Check prerequisite pathways
    const prerequisitesMet = (pathway.prerequisitePathways || []).every(
      prereqId => completedPathways.includes(prereqId)
    );
    
    // Check minimum entry requirement
    const entriesMet = entryCount >= (pathway.minimumEntries || 0);
    
    return prerequisitesMet && entriesMet;
  });
}

export function getNextLesson(pathwayId: string, currentLessonOrder: number) {
  const pathway = getPathway(pathwayId);
  if (!pathway) return null;
  
  return pathway.lessons.find(lesson => lesson.order === currentLessonOrder + 1) || null;
}

export function calculatePathwayProgress(completedLessons: number, totalLessons: number): number {
  return Math.round((completedLessons / totalLessons) * 100);
}