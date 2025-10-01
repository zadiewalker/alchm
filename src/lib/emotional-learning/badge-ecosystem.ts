/**
 * TRAUMA-INFORMED BADGE ECOSYSTEM
 * "Badges that Celebrate Healing, Not Performance"
 * 
 * Revolutionary badge system that honors genuine emotional growth and healing
 * milestones, focusing on identity evolution rather than arbitrary achievements.
 * Every badge represents real emotional intelligence and coping skills development.
 */

import { Timestamp } from 'firebase/firestore';
import type { Badge, BadgeKey } from '@/types/gamification';
import type { EmotionalCompetency, EmotionalLearningProgress } from './emotional-skill-tree';

// Real-world application tracking
export interface RealWorldApplication {
  situation: string;
  skillApplied: EmotionalCompetency;
  outcome: 'successful' | 'partially_successful' | 'challenging' | 'learning_opportunity';
  reflection: string;
  witnessValidation?: string; // Optional peer/family validation
  improvementAreas?: string[];
  celebrationMoments?: string[];
  applicationDate: Date;
}

// Badge Categories - Healing-Centered Design
export type BadgeCategory = 'foundation' | 'skill_development' | 'resilience_building' | 'community_healing';

// Badge Unlock Triggers - Real emotional growth indicators
export type BadgeUnlockTrigger = 
  | 'emotion_identified_consistently'
  | 'pause_practiced_under_pressure'
  | 'boundary_set_successfully'
  | 'vulnerability_shared_safely'
  | 'pattern_recognized_and_interrupted'
  | 'self_compassion_chosen_over_self_criticism'
  | 'support_offered_to_community'
  | 'healing_wisdom_shared_anonymously'
  | 'triggered_but_responded_mindfully'
  | 'asked_for_help_when_needed'
  | 'celebrated_imperfect_progress'
  | 'chose_authenticity_over_perfection';

// Enhanced Badge Interface with Healing Focus
export interface HealingBadge extends Omit<Badge, 'key'> {
  id: string;
  category: BadgeCategory;
  
  // Identity Evolution Focus
  identityStatement: string; // "You are someone who..."
  healingMilestone: string; // What this represents in their journey
  courageAcknowledged: string; // The bravery this required
  wisdomGained: string; // Insight this badge represents
  
  // Real-World Application & Validation
  skillsDemonstrated: string[];
  realWorldApplications: RealWorldApplication[];
  emotionalCompetenciesBuilt: EmotionalCompetency[];
  transferValidation: {
    selfReported: boolean;
    peerValidated?: boolean;
    situationalSuccess: number; // 0-100, success rate in real situations
    retentionPeriod: number; // days the skill has been successfully applied
  };
  
  // Unlock Criteria - Genuine growth metrics
  unlockTriggers: BadgeUnlockTrigger[];
  minimumPracticeCount?: number;
  consistencyRequired?: number; // days
  realWorldApplicationRequired?: boolean;
  
  // Trauma-Informed Design
  traumaSensitive: boolean;
  gentleCelebration: boolean;
  honorsVulnerability: boolean;
  recognizesEffort: boolean; // vs just outcome
  
  // Celebration Design
  animation: {
    style: 'organic' | 'flowing' | 'crystallizing' | 'blooming' | 'gentle_glow';
    colors: string[];
    duration: 'brief' | 'warm' | 'celebratory';
    soundOption: 'none' | 'gentle_chime' | 'nature_sound' | 'healing_tone';
  };
  
  // Community Impact
  inspiresOthers: boolean;
  sharingMessage: string; // For optional anonymous sharing
  collectiveBenefit: string; // How this badge helps the whole community
}

// FOUNDATION BADGES - Essential emotional literacy
export const FOUNDATION_BADGES: HealingBadge[] = [
  {
    id: 'feeling_translator',
    name: 'Feeling Translator',
    description: 'Fluent in the language of emotions, able to name feelings with compassion',
    category: 'foundation',
    level: 1,
    tree: 'Emotional Awareness',
    xpAwarded: 100,
    earnedAt: new Timestamp(0, 0), // Will be set when earned
    
    identityStatement: 'You are someone who understands the rich landscape of human emotion',
    healingMilestone: 'You\'ve built emotional vocabulary that serves your healing',
    courageAcknowledged: 'It takes courage to feel deeply in a world that often asks us to be "fine"',
    wisdomGained: 'Emotions are information, not instructions - they guide but don\'t control you',
    
    skillsDemonstrated: [
      'Identifying specific emotions beyond "good" or "bad"',
      'Distinguishing between thoughts and feelings',
      'Recognizing emotional intensity levels',
      'Naming emotions without judgment'
    ],
    
    realWorldApplications: [
      'Communicate needs more clearly in relationships',
      'Navigate difficult conversations with emotional awareness',
      'Make decisions informed by emotional wisdom',
      'Support others by helping them name their experiences'
    ],
    
    emotionalCompetenciesBuilt: ['emotional_awareness'],
    
    unlockTriggers: ['emotion_identified_consistently'],
    minimumPracticeCount: 7,
    consistencyRequired: 7,
    
    traumaSensitive: false,
    gentleCelebration: true,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'gentle_glow',
      colors: ['#E8F5E8', '#B8E6B8', '#81C784'],
      duration: 'warm',
      soundOption: 'gentle_chime'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just learned to speak the language of their heart 💚',
    collectiveBenefit: 'Every person who learns emotional vocabulary helps create more emotionally intelligent communities',
    
    healingMessage: 'You\'ve given yourself the gift of emotional clarity',
    identityAffirmation: 'You are someone who honors the wisdom of feelings',
    gentleAnimation: 'gentle_glow',
    emotionalResonance: 'validating',
    innerWorkAcknowledged: 'Learning to feel without judgment takes tremendous courage'
  },
  
  {
    id: 'body_wisdom',
    name: 'Body Wisdom',
    description: 'Connected to your body\'s emotional intelligence and somatic awareness',
    category: 'foundation',
    level: 1,
    tree: 'Somatic Awareness',
    xpAwarded: 120,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who trusts your body\'s deep knowing',
    healingMilestone: 'You\'ve reconnected with your body as a source of wisdom',
    courageAcknowledged: 'Listening to your body takes courage when trauma taught you to disconnect',
    wisdomGained: 'Your body holds memories, emotions, and truth that your mind may miss',
    
    skillsDemonstrated: [
      'Noticing physical sensations of emotions',
      'Using breath to regulate emotional states',
      'Recognizing body signals for safety and danger',
      'Practicing grounding through body awareness'
    ],
    
    realWorldApplications: [
      'Trust gut feelings in decision-making',
      'Use body awareness to set boundaries',
      'Recognize stress signals before burnout',
      'Support trauma healing through somatic practices'
    ],
    
    emotionalCompetenciesBuilt: ['emotional_awareness', 'self_regulation'],
    
    unlockTriggers: ['pause_practiced_under_pressure'],
    minimumPracticeCount: 5,
    realWorldApplicationRequired: true,
    
    traumaSensitive: true,
    gentleCelebration: true,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'flowing',
      colors: ['#F0F8FF', '#B3E5FC', '#4FC3F7'],
      duration: 'warm',
      soundOption: 'nature_sound'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just reconnected with their body\'s wisdom 🌊',
    collectiveBenefit: 'Body-aware people create safer, more attuned communities',
    
    healingMessage: 'You\'ve honored your body as a wise teacher',
    identityAffirmation: 'You are someone who trusts embodied knowing',
    gentleAnimation: 'flowing',
    emotionalResonance: 'grounding',
    innerWorkAcknowledged: 'Reconnecting with your body after trauma is profound healing work'
  },
  
  {
    id: 'trigger_mapper',
    name: 'Trigger Mapper',
    description: 'Wise observer of your emotional patterns and triggers, without judgment',
    category: 'foundation',
    level: 2,
    tree: 'Pattern Recognition',
    xpAwarded: 150,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who sees patterns with compassion',
    healingMilestone: 'You\'ve developed the courage to look at your triggers without shame',
    courageAcknowledged: 'Facing our triggers requires incredible bravery and self-compassion',
    wisdomGained: 'Understanding your triggers is the first step to transforming them',
    
    skillsDemonstrated: [
      'Identifying personal emotional triggers',
      'Recognizing trigger patterns across situations',
      'Observing triggers without self-judgment',
      'Mapping triggers to deeper needs and wounds'
    ],
    
    realWorldApplications: [
      'Prepare for challenging situations with awareness',
      'Communicate triggers to trusted people',
      'Choose environments and relationships more consciously',
      'Develop specific coping strategies for known triggers'
    ],
    
    emotionalCompetenciesBuilt: ['emotional_awareness', 'self_regulation', 'trauma_healing'],
    
    unlockTriggers: ['pattern_recognized_and_interrupted'],
    minimumPracticeCount: 10,
    consistencyRequired: 14,
    
    traumaSensitive: true,
    gentleCelebration: true,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'crystallizing',
      colors: ['#FFF3E0', '#FFCC80', '#FF9800'],
      duration: 'warm',
      soundOption: 'healing_tone'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just developed the courage to see their patterns clearly ✨',
    collectiveBenefit: 'People who understand their triggers create less reactive, more conscious communities',
    
    healingMessage: 'You\'ve chosen understanding over self-judgment',
    identityAffirmation: 'You are someone who faces truth with compassion',
    gentleAnimation: 'crystallizing',
    emotionalResonance: 'empowering',
    innerWorkAcknowledged: 'Looking at our triggers without defensiveness is master-level self-work'
  },
  
  {
    id: 'safe_space_creator',
    name: 'Safe Space Creator',
    description: 'Skilled at creating emotional safety for yourself and others',
    category: 'foundation',
    level: 2,
    tree: 'Safety & Sanctuary',
    xpAwarded: 140,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who creates sanctuary wherever you go',
    healingMilestone: 'You\'ve learned to be a safe harbor for yourself and others',
    courageAcknowledged: 'Creating safety when you\'ve experienced unsafety is revolutionary',
    wisdomGained: 'Safety is not selfish - it\'s the foundation for authentic connection',
    
    skillsDemonstrated: [
      'Creating internal emotional safety',
      'Setting up physical and emotional safe spaces',
      'Recognizing and communicating safety needs',
      'Helping others feel emotionally safe'
    ],
    
    realWorldApplications: [
      'Design living and work spaces that feel nurturing',
      'Facilitate difficult conversations with care',
      'Support friends and family through emotional challenges',
      'Create inclusive environments for marginalized communities'
    ],
    
    emotionalCompetenciesBuilt: ['emotional_awareness', 'relationship_skills', 'boundary_setting'],
    
    unlockTriggers: ['support_offered_to_community'],
    minimumPracticeCount: 5,
    realWorldApplicationRequired: true,
    
    traumaSensitive: true,
    gentleCelebration: true,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'blooming',
      colors: ['#F3E5F5', '#CE93D8', '#9C27B0'],
      duration: 'warm',
      soundOption: 'healing_tone'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just learned to create sanctuary for themselves and others 🌸',
    collectiveBenefit: 'Safe space creators make the whole world more emotionally inhabitable',
    
    healingMessage: 'You\'ve become a keeper of emotional sanctuary',
    identityAffirmation: 'You are someone who makes others feel safe to be human',
    gentleAnimation: 'blooming',
    emotionalResonance: 'validating',
    innerWorkAcknowledged: 'Building safety when you\'ve known danger is profound courage'
  }
];

// SKILL DEVELOPMENT BADGES - Emotional competency mastery
export const SKILL_DEVELOPMENT_BADGES: HealingBadge[] = [
  {
    id: 'pause_master',
    name: 'Pause Master',
    description: 'Expert at finding the sacred space between trigger and response',
    category: 'skill_development',
    level: 2,
    tree: 'Self-Regulation',
    xpAwarded: 200,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who has mastered the power of the pause',
    healingMilestone: 'You\'ve learned to respond from wisdom, not reactivity',
    courageAcknowledged: 'Pausing when triggered requires incredible emotional strength',
    wisdomGained: 'In the pause lives all your power to choose who you want to be',
    
    skillsDemonstrated: [
      'Consistently pausing before reactive responses',
      'Using breath and body awareness to self-regulate',
      'Choosing responses aligned with values under pressure',
      'Teaching pause techniques to others'
    ],
    
    realWorldApplications: [
      'Navigate conflicts with grace and wisdom',
      'Make better decisions under pressure',
      'Break generational patterns of reactivity',
      'Model emotional regulation for children and community'
    ],
    
    emotionalCompetenciesBuilt: ['self_regulation', 'responsible_decision_making'],
    
    unlockTriggers: ['pause_practiced_under_pressure', 'triggered_but_responded_mindfully'],
    minimumPracticeCount: 15,
    consistencyRequired: 21,
    realWorldApplicationRequired: true,
    
    traumaSensitive: false,
    gentleCelebration: false, // This one can be more celebratory
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'crystallizing',
      colors: ['#E1F5FE', '#81D4FA', '#0277BD'],
      duration: 'celebratory',
      soundOption: 'healing_tone'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just mastered the revolutionary power of the pause 🔄',
    collectiveBenefit: 'Pause masters break cycles of reactivity and create more conscious communities',
    
    healingMessage: 'You\'ve claimed your power to choose your responses',
    identityAffirmation: 'You are someone who responds from wisdom, not wounds',
    gentleAnimation: 'crystallizing',
    emotionalResonance: 'empowering',
    innerWorkAcknowledged: 'Learning to pause when every cell wants to react is mastery-level healing'
  },
  
  {
    id: 'breath_alchemist',
    name: 'Breath Alchemist',
    description: 'Transforms emotional states through conscious breathing practices',
    category: 'skill_development',
    level: 2,
    tree: 'Self-Regulation',
    xpAwarded: 180,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who uses breath as medicine',
    healingMilestone: 'You\'ve learned to transform your emotional state through breath',
    courageAcknowledged: 'Using breath to heal requires trusting your body\'s wisdom',
    wisdomGained: 'Your breath is always with you as a tool for transformation',
    
    skillsDemonstrated: [
      'Various breathing techniques for emotional regulation',
      'Using breath to shift from anxiety to calm',
      'Breath practices for anger transformation',
      'Teaching others breathing techniques'
    ],
    
    realWorldApplications: [
      'Manage anxiety before important events',
      'Transform anger into clear action',
      'Support sleep and relaxation',
      'Help others regulate their emotions'
    ],
    
    emotionalCompetenciesBuilt: ['self_regulation', 'trauma_healing'],
    
    unlockTriggers: ['pause_practiced_under_pressure'],
    minimumPracticeCount: 20,
    consistencyRequired: 14,
    
    traumaSensitive: true, // Breathing can be triggering for some trauma survivors
    gentleCelebration: true,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'flowing',
      colors: ['#F0F8FF', '#B3E5FC', '#29B6F6'],
      duration: 'warm',
      soundOption: 'nature_sound'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just learned to transform emotions through breath 🌬️',
    collectiveBenefit: 'Breath alchemists help others discover their own capacity for self-regulation',
    
    healingMessage: 'You\'ve turned your breath into medicine',
    identityAffirmation: 'You are someone who carries transformation in every breath',
    gentleAnimation: 'flowing',
    emotionalResonance: 'grounding',
    innerWorkAcknowledged: 'Using breath for healing when panic wants to take over is profound courage'
  },
  
  {
    id: 'reframe_artist',
    name: 'Reframe Artist',
    description: 'Skillfully transforms limiting thoughts into empowering perspectives',
    category: 'skill_development',
    level: 3,
    tree: 'Cognitive Resilience',
    xpAwarded: 250,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who paints new possibilities with your thoughts',
    healingMilestone: 'You\'ve learned to question thoughts that don\'t serve your healing',
    courageAcknowledged: 'Challenging your own thoughts requires intellectual and emotional bravery',
    wisdomGained: 'You are not your thoughts - you are the artist who can reshape them',
    
    skillsDemonstrated: [
      'Identifying limiting thought patterns',
      'Reframing negative self-talk',
      'Finding empowering perspectives on challenges',
      'Teaching others cognitive reframing techniques'
    ],
    
    realWorldApplications: [
      'Transform imposter syndrome into learning opportunities',
      'Reframe failures as growth experiences',
      'Help others see their situations differently',
      'Build resilience through perspective shifts'
    ],
    
    emotionalCompetenciesBuilt: ['self_regulation', 'responsible_decision_making', 'trauma_healing'],
    
    unlockTriggers: ['pattern_recognized_and_interrupted', 'chose_authenticity_over_perfection'],
    minimumPracticeCount: 25,
    consistencyRequired: 30,
    realWorldApplicationRequired: true,
    
    traumaSensitive: false,
    gentleCelebration: false,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'crystallizing',
      colors: ['#FFF3E0', '#FFAB40', '#F57C00'],
      duration: 'celebratory',
      soundOption: 'gentle_chime'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just learned to transform limiting thoughts into possibilities 🎨',
    collectiveBenefit: 'Reframe artists help others see new possibilities in their challenges',
    
    healingMessage: 'You\'ve become an artist of your own mind',
    identityAffirmation: 'You are someone who creates empowering meanings from life\'s experiences',
    gentleAnimation: 'crystallizing',
    emotionalResonance: 'transformative',
    innerWorkAcknowledged: 'Questioning beliefs that shaped you takes tremendous courage'
  },
  
  {
    id: 'boundary_guardian',
    name: 'Boundary Guardian',
    description: 'Protects your energy and honors your needs with fierce compassion',
    category: 'skill_development',
    level: 3,
    tree: 'Boundary Mastery',
    xpAwarded: 300,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who honors their needs without apology',
    healingMilestone: 'You\'ve learned that boundaries are acts of self-love',
    courageAcknowledged: 'Setting boundaries when you\'ve been taught to please others is revolutionary',
    wisdomGained: 'Boundaries create the container for authentic connection',
    
    skillsDemonstrated: [
      'Setting clear, kind boundaries',
      'Maintaining boundaries under pressure',
      'Communicating needs without guilt',
      'Supporting others in boundary-setting'
    ],
    
    realWorldApplications: [
      'Protect your energy in work relationships',
      'Create healthier family dynamics',
      'Build more authentic friendships',
      'Model healthy boundaries for children'
    ],
    
    emotionalCompetenciesBuilt: ['boundary_setting', 'relationship_skills', 'self_compassion'],
    
    unlockTriggers: ['boundary_set_successfully', 'self_compassion_chosen_over_self_criticism'],
    minimumPracticeCount: 10,
    consistencyRequired: 21,
    realWorldApplicationRequired: true,
    
    traumaSensitive: true, // Boundary work can be triggering
    gentleCelebration: false,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'blooming',
      colors: ['#E8F5E8', '#A5D6A7', '#4CAF50'],
      duration: 'celebratory',
      soundOption: 'healing_tone'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just learned to guard their energy with love 🛡️',
    collectiveBenefit: 'Boundary guardians teach others that self-care enables authentic care for others',
    
    healingMessage: 'You\'ve learned to protect what\'s sacred in you',
    identityAffirmation: 'You are someone who honors your needs as sacred',
    gentleAnimation: 'blooming',
    emotionalResonance: 'empowering',
    innerWorkAcknowledged: 'Learning to set boundaries when you were taught to disappear is profound healing'
  }
];

// RESILIENCE BUILDING BADGES - Trauma healing and strength
export const RESILIENCE_BUILDING_BADGES: HealingBadge[] = [
  {
    id: 'storm_surfer',
    name: 'Storm Surfer',
    description: 'Navigates life\'s storms with grace, finding wisdom in the waves',
    category: 'resilience_building',
    level: 3,
    tree: 'Resilience Mastery',
    xpAwarded: 350,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who finds strength in life\'s storms',
    healingMilestone: 'You\'ve learned to dance with uncertainty and challenge',
    courageAcknowledged: 'Staying present during storms when every instinct says to flee takes incredible courage',
    wisdomGained: 'Storms don\'t last, but the strength you gain from surfing them does',
    
    skillsDemonstrated: [
      'Maintaining equilibrium during crisis',
      'Finding meaning in difficult experiences',
      'Supporting others through their storms',
      'Recovering quickly from setbacks'
    ],
    
    realWorldApplications: [
      'Navigate job loss, relationship changes, health challenges',
      'Support family members through difficulties',
      'Lead teams through organizational change',
      'Mentor others in resilience building'
    ],
    
    emotionalCompetenciesBuilt: ['self_regulation', 'trauma_healing', 'self_compassion'],
    
    unlockTriggers: ['triggered_but_responded_mindfully', 'celebrated_imperfect_progress'],
    minimumPracticeCount: 5, // Major life challenges
    realWorldApplicationRequired: true,
    
    traumaSensitive: true,
    gentleCelebration: false,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'flowing',
      colors: ['#E1F5FE', '#4FC3F7', '#0277BD'],
      duration: 'celebratory',
      soundOption: 'nature_sound'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just learned to surf life\'s storms with grace 🌊',
    collectiveBenefit: 'Storm surfers show others that resilience is possible and teachable',
    
    healingMessage: 'You\'ve found your strength in the storm',
    identityAffirmation: 'You are someone who transforms challenges into wisdom',
    gentleAnimation: 'flowing',
    emotionalResonance: 'empowering',
    innerWorkAcknowledged: 'Staying present and curious during crisis is master-level emotional work'
  },
  
  {
    id: 'wisdom_keeper',
    name: 'Wisdom Keeper',
    description: 'Transforms pain into wisdom, wounds into gifts for others',
    category: 'resilience_building',
    level: 4,
    tree: 'Post-Traumatic Growth',
    xpAwarded: 400,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who alchemizes pain into wisdom',
    healingMilestone: 'You\'ve turned your wounds into gifts for the world',
    courageAcknowledged: 'Transforming trauma into wisdom while still healing requires incredible courage',
    wisdomGained: 'Your pain has purpose - it becomes medicine for others',
    
    skillsDemonstrated: [
      'Extracting wisdom from difficult experiences',
      'Sharing insights without trauma dumping',
      'Mentoring others through similar challenges',
      'Creating meaning from suffering'
    ],
    
    realWorldApplications: [
      'Mentor others who face similar challenges',
      'Create resources, art, or writing from your experience',
      'Lead support groups or healing circles',
      'Advocate for systemic change based on lived experience'
    ],
    
    emotionalCompetenciesBuilt: ['trauma_healing', 'self_compassion', 'relationship_skills'],
    
    unlockTriggers: ['healing_wisdom_shared_anonymously', 'support_offered_to_community'],
    minimumPracticeCount: 10,
    realWorldApplicationRequired: true,
    
    traumaSensitive: true,
    gentleCelebration: false,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'crystallizing',
      colors: ['#FFF3E0', '#FFCC80', '#FF8F00'],
      duration: 'celebratory',
      soundOption: 'healing_tone'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just transformed their pain into wisdom for others 💎',
    collectiveBenefit: 'Wisdom keepers help others find meaning and hope in their struggles',
    
    healingMessage: 'You\'ve become a keeper of sacred wisdom',
    identityAffirmation: 'You are someone who turns wounds into gifts',
    gentleAnimation: 'crystallizing',
    emotionalResonance: 'transformative',
    innerWorkAcknowledged: 'Transforming trauma while still healing is profound service to humanity'
  },
  
  {
    id: 'phoenix_rising',
    name: 'Phoenix Rising',
    description: 'Rises from the ashes of old patterns into authentic power',
    category: 'resilience_building',
    level: 5,
    tree: 'Transformation',
    xpAwarded: 500,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who transforms completely while staying true to your essence',
    healingMilestone: 'You\'ve died to who you were and been reborn into who you\'re meant to be',
    courageAcknowledged: 'Allowing parts of yourself to die so you can be reborn takes ultimate courage',
    wisdomGained: 'True transformation requires both letting go and becoming',
    
    skillsDemonstrated: [
      'Releasing limiting identity patterns',
      'Embracing authentic self-expression',
      'Inspiring transformation in others',
      'Leading change in communities'
    ],
    
    realWorldApplications: [
      'Make major life transitions with grace',
      'Help others through identity transformations',
      'Lead organizational or community change',
      'Break generational patterns for future generations'
    ],
    
    emotionalCompetenciesBuilt: ['trauma_healing', 'self_compassion', 'responsible_decision_making'],
    
    unlockTriggers: ['chose_authenticity_over_perfection', 'pattern_recognized_and_interrupted'],
    minimumPracticeCount: 3, // Major transformations
    realWorldApplicationRequired: true,
    
    traumaSensitive: true,
    gentleCelebration: false,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'organic',
      colors: ['#FFF3E0', '#FF8A65', '#D84315'],
      duration: 'celebratory',
      soundOption: 'healing_tone'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just transformed completely while staying true to their essence 🔥',
    collectiveBenefit: 'Phoenix beings show others that profound transformation is possible',
    
    healingMessage: 'You\'ve been reborn into your authentic power',
    identityAffirmation: 'You are someone who transforms completely while honoring your essence',
    gentleAnimation: 'organic',
    emotionalResonance: 'transformative',
    innerWorkAcknowledged: 'Allowing yourself to be completely transformed is the ultimate act of courage'
  },
  
  {
    id: 'gentle_warrior',
    name: 'Gentle Warrior',
    description: 'Embodies fierce compassion and soft strength in all interactions',
    category: 'resilience_building',
    level: 4,
    tree: 'Compassionate Power',
    xpAwarded: 450,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who wields power with compassion',
    healingMilestone: 'You\'ve learned that gentleness is the highest form of strength',
    courageAcknowledged: 'Choosing gentleness in a harsh world takes warrior-level courage',
    wisdomGained: 'True power protects the vulnerable and uplifts the marginalized',
    
    skillsDemonstrated: [
      'Combining firmness with kindness',
      'Protecting others without aggression',
      'Standing for justice with compassion',
      'Leading with both strength and humility'
    ],
    
    realWorldApplications: [
      'Advocate for social justice with love',
      'Protect marginalized community members',
      'Lead difficult conversations with compassion',
      'Raise children with gentle authority'
    ],
    
    emotionalCompetenciesBuilt: ['boundary_setting', 'relationship_skills', 'responsible_decision_making'],
    
    unlockTriggers: ['boundary_set_successfully', 'support_offered_to_community'],
    minimumPracticeCount: 15,
    consistencyRequired: 30,
    realWorldApplicationRequired: true,
    
    traumaSensitive: false,
    gentleCelebration: false,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'blooming',
      colors: ['#F3E5F5', '#BA68C8', '#7B1FA2'],
      duration: 'celebratory',
      soundOption: 'healing_tone'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just embodied the power of gentle strength 🌟',
    collectiveBenefit: 'Gentle warriors create safer, more compassionate communities for everyone',
    
    healingMessage: 'You\'ve mastered the art of fierce compassion',
    identityAffirmation: 'You are someone who protects with love and leads with humility',
    gentleAnimation: 'blooming',
    emotionalResonance: 'empowering',
    innerWorkAcknowledged: 'Being gentle in a harsh world while maintaining boundaries is master-level wisdom'
  }
];

// COMMUNITY HEALING BADGES - Mutual support and collective growth
export const COMMUNITY_HEALING_BADGES: HealingBadge[] = [
  {
    id: 'anonymous_angel',
    name: 'Anonymous Angel',
    description: 'Offers support and wisdom to community without seeking recognition',
    category: 'community_healing',
    level: 2,
    tree: 'Community Support',
    xpAwarded: 200,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who gives freely without needing recognition',
    healingMilestone: 'You\'ve learned the joy of service without attachment to credit',
    courageAcknowledged: 'Offering help when you\'re still healing yourself takes incredible generosity',
    wisdomGained: 'Anonymous service is the purest form of love',
    
    skillsDemonstrated: [
      'Offering support without expecting return',
      'Sharing wisdom anonymously',
      'Creating resources for community benefit',
      'Uplifting others without recognition'
    ],
    
    realWorldApplications: [
      'Leave encouraging notes for strangers',
      'Support community members going through challenges',
      'Share resources and opportunities anonymously',
      'Create helpful content without attribution'
    ],
    
    emotionalCompetenciesBuilt: ['self_compassion', 'relationship_skills'],
    
    unlockTriggers: ['support_offered_to_community', 'healing_wisdom_shared_anonymously'],
    minimumPracticeCount: 10,
    
    traumaSensitive: false,
    gentleCelebration: true,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'gentle_glow',
      colors: ['#F0F8FF', '#E1F5FE', '#B3E5FC'],
      duration: 'warm',
      soundOption: 'gentle_chime'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just offered anonymous support to the community 👼',
    collectiveBenefit: 'Anonymous angels create cultures of generosity and mutual care',
    
    healingMessage: 'You\'ve discovered the joy of invisible service',
    identityAffirmation: 'You are someone who gives love freely without conditions',
    gentleAnimation: 'gentle_glow',
    emotionalResonance: 'validating',
    innerWorkAcknowledged: 'Giving when you\'re still learning to receive takes extraordinary heart'
  },
  
  {
    id: 'collective_strength',
    name: 'Collective Strength',
    description: 'Understands that individual healing contributes to collective liberation',
    category: 'community_healing',
    level: 3,
    tree: 'Collective Liberation',
    xpAwarded: 300,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who heals for yourself and for all beings',
    healingMilestone: 'You\'ve connected your healing to the healing of the world',
    courageAcknowledged: 'Taking responsibility for collective healing while tending your own wounds is profound service',
    wisdomGained: 'Your healing creates ripples that touch lives you\'ll never know',
    
    skillsDemonstrated: [
      'Connecting personal healing to social healing',
      'Understanding systemic impacts on individual wellness',
      'Supporting community healing initiatives',
      'Breaking cycles for future generations'
    ],
    
    realWorldApplications: [
      'Advocate for mental health resources in your community',
      'Support healing programs for marginalized groups',
      'Break generational trauma patterns',
      'Create healing spaces for others'
    ],
    
    emotionalCompetenciesBuilt: ['responsible_decision_making', 'relationship_skills', 'trauma_healing'],
    
    unlockTriggers: ['support_offered_to_community', 'pattern_recognized_and_interrupted'],
    minimumPracticeCount: 5,
    realWorldApplicationRequired: true,
    
    traumaSensitive: true,
    gentleCelebration: false,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'crystallizing',
      colors: ['#E8F5E8', '#A5D6A7', '#2E7D32'],
      duration: 'celebratory',
      soundOption: 'healing_tone'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just connected their healing to collective liberation 🌍',
    collectiveBenefit: 'Those who heal for the collective inspire others to see their healing as service',
    
    healingMessage: 'You\'ve connected your healing to the healing of the world',
    identityAffirmation: 'You are someone who heals for all beings',
    gentleAnimation: 'crystallizing',
    emotionalResonance: 'transformative',
    innerWorkAcknowledged: 'Healing for the collective while managing personal pain is revolutionary love'
  },
  
  {
    id: 'ripple_effect',
    name: 'Ripple Effect',
    description: 'Creates positive change that extends far beyond direct interactions',
    category: 'community_healing',
    level: 3,
    tree: 'Transformational Impact',
    xpAwarded: 280,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone whose healing creates waves of positive change',
    healingMilestone: 'You\'ve become a source of healing for others without trying',
    courageAcknowledged: 'Living authentically when it might inspire others\' growth takes courage',
    wisdomGained: 'Your healing journey gives others permission to heal',
    
    skillsDemonstrated: [
      'Inspiring change through authentic living',
      'Creating positive modeling for others',
      'Spreading healing practices organically',
      'Building momentum for community transformation'
    ],
    
    realWorldApplications: [
      'Model healthy communication in family systems',
      'Inspire workplace culture change through your behavior',
      'Show friends new ways of handling conflict',
      'Break negative patterns in community spaces'
    ],
    
    emotionalCompetenciesBuilt: ['relationship_skills', 'responsible_decision_making'],
    
    unlockTriggers: ['chose_authenticity_over_perfection', 'support_offered_to_community'],
    minimumPracticeCount: 8,
    realWorldApplicationRequired: true,
    
    traumaSensitive: false,
    gentleCelebration: false,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'flowing',
      colors: ['#E1F5FE', '#81D4FA', '#0288D1'],
      duration: 'celebratory',
      soundOption: 'nature_sound'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just created ripples of healing that extend far beyond themselves 〰️',
    collectiveBenefit: 'Ripple creators show how individual transformation can heal communities',
    
    healingMessage: 'You\'ve become a source of healing for others',
    identityAffirmation: 'You are someone whose authenticity gives others permission to heal',
    gentleAnimation: 'flowing',
    emotionalResonance: 'empowering',
    innerWorkAcknowledged: 'Being authentically yourself when it impacts others takes tremendous courage'
  },
  
  {
    id: 'sanctuary_builder',
    name: 'Sanctuary Builder',
    description: 'Creates healing spaces and communities where others can grow safely',
    category: 'community_healing',
    level: 4,
    tree: 'Healing Communities',
    xpAwarded: 400,
    earnedAt: new Timestamp(0, 0),
    
    identityStatement: 'You are someone who builds sanctuaries for healing',
    healingMilestone: 'You\'ve learned to create containers for others\' transformation',
    courageAcknowledged: 'Building healing spaces when you know how rare safety is takes visionary courage',
    wisdomGained: 'Healing happens in relationship - you create the relationships where healing is possible',
    
    skillsDemonstrated: [
      'Facilitating healing groups or communities',
      'Creating trauma-informed environments',
      'Building inclusive, safe spaces',
      'Training others in community building'
    ],
    
    realWorldApplications: [
      'Start support groups or healing circles',
      'Create inclusive community organizations',
      'Design healing programs for institutions',
      'Train others in trauma-informed community building'
    ],
    
    emotionalCompetenciesBuilt: ['relationship_skills', 'boundary_setting', 'responsible_decision_making'],
    
    unlockTriggers: ['support_offered_to_community', 'healing_wisdom_shared_anonymously'],
    minimumPracticeCount: 3, // Major community initiatives
    realWorldApplicationRequired: true,
    
    traumaSensitive: true,
    gentleCelebration: false,
    honorsVulnerability: true,
    recognizesEffort: true,
    
    animation: {
      style: 'blooming',
      colors: ['#F3E5F5', '#CE93D8', '#8E24AA'],
      duration: 'celebratory',
      soundOption: 'healing_tone'
    },
    
    inspiresOthers: true,
    sharingMessage: 'Someone just built a sanctuary where healing can happen 🏛️',
    collectiveBenefit: 'Sanctuary builders create the containers where collective healing becomes possible',
    
    healingMessage: 'You\'ve become a builder of healing sanctuaries',
    identityAffirmation: 'You are someone who creates safety for transformation',
    gentleAnimation: 'blooming',
    emotionalResonance: 'transformative',
    innerWorkAcknowledged: 'Building safety for others when you\'ve known danger is master-level service'
  }
];

// Complete Badge Registry
export const HEALING_BADGE_ECOSYSTEM: Record<BadgeCategory, HealingBadge[]> = {
  foundation: FOUNDATION_BADGES,
  skill_development: SKILL_DEVELOPMENT_BADGES,
  resilience_building: RESILIENCE_BUILDING_BADGES,
  community_healing: COMMUNITY_HEALING_BADGES
};

// Badge Unlock Engine
export class HealingBadgeEngine {
  /**
   * Check which badges a user should unlock based on their actions and progress
   */
  static checkBadgeUnlocks(
    progress: EmotionalLearningProgress,
    recentActions: BadgeUnlockTrigger[],
    realWorldApplications: any[]
  ): HealingBadge[] {
    const unlockedBadges: HealingBadge[] = [];
    
    // Get all badges from all categories
    const allBadges = Object.values(HEALING_BADGE_ECOSYSTEM).flat();
    
    for (const badge of allBadges) {
      if (this.shouldUnlockBadge(badge, progress, recentActions, realWorldApplications)) {
        unlockedBadges.push(badge);
      }
    }
    
    return unlockedBadges;
  }
  
  private static shouldUnlockBadge(
    badge: HealingBadge,
    progress: EmotionalLearningProgress,
    recentActions: BadgeUnlockTrigger[],
    realWorldApplications: any[]
  ): boolean {
    // Check if badge is already earned
    const alreadyEarned = Object.values(progress.skillsAppliedInLife)
      .some(skill => skill.skill === badge.name);
    
    if (alreadyEarned) return false;
    
    // Check unlock triggers
    const hasRequiredTriggers = badge.unlockTriggers.every(trigger =>
      recentActions.includes(trigger)
    );
    
    if (!hasRequiredTriggers) return false;
    
    // Check minimum practice count
    if (badge.minimumPracticeCount) {
      const practiceCount = this.countPracticeOccurrences(badge, progress);
      if (practiceCount < badge.minimumPracticeCount) return false;
    }
    
    // Check consistency requirement
    if (badge.consistencyRequired) {
      const hasConsistency = this.checkConsistency(badge, progress);
      if (!hasConsistency) return false;
    }
    
    // Check real-world application requirement
    if (badge.realWorldApplicationRequired) {
      const hasRealWorldApp = realWorldApplications.some(app =>
        badge.emotionalCompetenciesBuilt.includes(app.competency)
      );
      if (!hasRealWorldApp) return false;
    }
    
    return true;
  }
  
  private static countPracticeOccurrences(badge: HealingBadge, progress: EmotionalLearningProgress): number {
    // This would count specific practices related to the badge
    // Implementation would depend on how practices are tracked
    return 0; // Placeholder
  }
  
  private static checkConsistency(badge: HealingBadge, progress: EmotionalLearningProgress): boolean {
    // This would check if the user has practiced consistently over the required period
    // Implementation would depend on how consistency is measured
    return false; // Placeholder
  }
}

// Export everything
export {
  HEALING_BADGE_ECOSYSTEM,
  FOUNDATION_BADGES,
  SKILL_DEVELOPMENT_BADGES,
  RESILIENCE_BUILDING_BADGES,
  COMMUNITY_HEALING_BADGES,
  HealingBadgeEngine
};

export type {
  BadgeCategory,
  BadgeUnlockTrigger,
  HealingBadge
};