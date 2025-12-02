/**
 * ALCHM Transformative Pathways System
 * 
 * Type definitions for structured healing journeys that follow
 * archetypal patterns: AWAKENING → DEEPENING → DESCENT → THRESHOLD → INTEGRATION → EMERGENCE → EMBODIMENT
 */

import type { ResponsePillar } from '@/lib/ai/prompts';

// The stages of transformation
export type JourneyStage = 
  | 'awakening'    // Recognition, gentle entry
  | 'deepening'    // Going beneath surface
  | 'descent'      // Meeting shadow, difficulty
  | 'threshold'    // The crucible, hardest moment
  | 'integration'  // Making meaning
  | 'emergence'    // Rising transformed  
  | 'embodiment';  // Living the change

// Types of learning experiences
export type LessonType = 
  | 'teaching'     // Core concept delivery
  | 'reflection'   // Guided self-inquiry
  | 'practice'     // Experiential exercise
  | 'ritual'       // Sacred/ceremonial practice
  | 'integration'  // Synthesizing previous lessons
  | 'threshold'    // The challenging crucible
  | 'celebration'; // Honoring progress

// Types of practices within lessons
export type PracticeType =
  | 'journaling'      // Writing prompts
  | 'meditation'      // Guided or silent
  | 'breathwork'      // Specific techniques
  | 'bodywork'        // Somatic practices
  | 'visualization'   // Guided imagery
  | 'dialogue'        // Parts work, inner dialogue
  | 'movement'        // Expressive movement
  | 'ritual'          // Ceremonial practices
  | 'art'             // Creative expression
  | 'nature'          // Outdoor practices
  | 'relational'      // Practices with others
  | 'observation';    // Mindful noticing

export interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  
  // Prerequisites
  prerequisitePathways?: string[];  // Must complete these first
  minimumEntries?: number;          // Must have journaled X times
  
  // Content
  lessons: Lesson[];
  totalXP: number;
  estimatedDuration: string;        // e.g., "2-3 weeks"
  
  // Theming
  archetypeGuide: string;           // The voice guiding this pathway
  coreWound?: string;               // What wound this pathway addresses
  coreGift?: string;                // What gift emerges from healing
  
  // Metadata
  difficulty: 'gentle' | 'moderate' | 'intensive';
  triggerWarnings?: string[];
  supportResources?: Resource[];
}

export interface Lesson {
  id: string;
  pathwayId: string;
  order: number;
  
  // Journey mapping
  stage: JourneyStage;
  type: LessonType;
  
  // Content
  title: string;
  subtitle?: string;
  epigraph?: {                      // Opening quote
    text: string;
    attribution: string;
  };
  
  // Sections
  sections: LessonSection[];
  
  // Practices
  practices: Practice[];
  
  // Reflection
  journalPrompts: JournalPrompt[];
  
  // Completion
  xpReward: number;
  completionAffirmation: string;    // Message shown on completion
  
  // Pacing
  minimumTimeMinutes: number;       // Can't complete faster than this
  recommendedBreakAfter?: boolean;  // Suggest pause before next lesson
  
  // Safety
  groundingPractice?: Practice;     // Offered if content is intense
  triggerWarning?: string;
}

export interface LessonSection {
  type: 'text' | 'quote' | 'story' | 'teaching' | 'question' | 'spacer';
  content: string;
  
  // For questions
  pauseForReflection?: boolean;     // User must sit with this
  
  // For stories
  storyType?: 'myth' | 'case' | 'parable' | 'personal';
}

export interface Practice {
  id: string;
  type: PracticeType;
  title: string;
  intention: string;                // Why we're doing this
  duration: string;                 // e.g., "5-10 minutes"
  
  // Instructions
  setup?: string;                   // Preparation
  instructions: string[];           // Step by step
  closingReflection?: string;       // How to end
  
  // Audio/visual
  hasGuidedAudio?: boolean;
  audioUrl?: string;
  backgroundMusic?: 'silence' | 'ambient' | 'nature' | 'binaural';
  
  // Adaptations
  accessibilityNotes?: string;      // For different abilities
  shortVersion?: string[];          // 2-minute version
}

export interface JournalPrompt {
  prompt: string;
  depth: 'surface' | 'medium' | 'deep';
  pillarConnection?: ResponsePillar; // Links to multi-modal response system
  
  // Guidance
  guidanceText?: string;            // Optional framing
  exampleResponse?: string;         // What a response might look like (anonymized)
  timeEstimate?: string;
}

export interface Resource {
  type: 'crisis' | 'book' | 'article' | 'practice' | 'professional';
  title: string;
  description?: string;
  url?: string;
  phone?: string;
}

// User progress tracking
export interface PathwayProgress {
  pathwayId: string;
  userId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  currentLessonOrder: number;
  completedLessons: number;
  xpEarned: number;
  startedAt?: Date;
  lastActivityAt?: Date;
  completedAt?: Date;
  lessonCompletions: Record<string, LessonCompletion>;
}

export interface LessonCompletion {
  lessonId: string;
  completedAt: Date;
  timeSpentMinutes: number;
  practicesCompleted: string[];     // Practice IDs completed
  journalEntryId?: string;          // If they journaled
  notes?: string;                   // Optional reflection
}

// Pathway UI state
export interface PathwayUIState {
  currentSection: number;
  sectionsRead: boolean[];
  practicesStarted: Record<string, boolean>;
  practicesCompleted: Record<string, boolean>;
  startTime: Date;
  pausedDuration: number;           // Time spent paused
  showGroundingPractice: boolean;
}

// Design system
export interface PathwayTheme {
  stageColors: Record<JourneyStage, string>;
  typography: {
    epigraph: string;
    teaching: string;
    question: string;
    story: string;
  };
  pacing: {
    readingSpeed: number;           // words per minute
    pauseDuration: number;          // ms after questions
    transitionDuration: number;     // ms between sections
  };
}

export const PATHWAY_DESIGN: PathwayTheme = {
  stageColors: {
    awakening: '#E8E4DF',      // Warm neutral — gentle beginning
    deepening: '#C8D4BC',       // Sage light — going in
    descent: '#7D8B6E',         // Sage dark — the depths
    threshold: '#4A4A4A',       // Dark — the cave
    integration: '#A4B792',     // Sage — coming together
    emergence: '#E8A87C',       // Terracotta — rising
    embodiment: '#F7F7F2',      // Light — new life
  },
  
  pacing: {
    readingSpeed: 180,          // words per minute (slower for reflection)
    pauseDuration: 3000,        // ms after questions
    transitionDuration: 500,    // ms between sections
  },
  
  typography: {
    epigraph: 'italic text-lg text-gray-600 border-l-2 border-sage pl-4',
    teaching: 'text-gray-800 leading-relaxed',
    question: 'text-xl font-medium text-sage-dark text-center py-8',
    story: 'text-gray-700 italic leading-loose',
  }
};