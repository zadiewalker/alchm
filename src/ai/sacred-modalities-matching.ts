/**
 * ALCHM Sacred Healing Modalities Matching System
 * 
 * AI system that matches users with healing modalities based on spiritual openness,
 * cultural background, and personal resonance. Ensures ethical and culturally
 * sensitive recommendations across diverse healing traditions.
 */

import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// Core modality matching types
export interface HealingModality {
  id: string;
  name: string;
  category: 'meditation' | 'prayer' | 'movement' | 'creative' | 'ritual' | 'contemplative' | 'service' | 'study';
  tradition: string[];
  culturalOrigins: string[];
  spiritualRequirements: SpiritualRequirement[];
  practiceLevel: 'beginner' | 'intermediate' | 'advanced' | 'master';
  timeCommitment: string;
  setting: 'individual' | 'group' | 'guided' | 'community' | 'flexible';
  materials: string[];
  preparations: string[];
  contraindications: string[];
  adaptations: ModalityAdaptation[];
  benefits: string[];
  evidenceBase: string[];
  ethicalConsiderations: string[];
  culturalProtocols: CulturalProtocol[];
  secularAlternatives?: SecularAlternative[];
  isActive: boolean;
}

export interface SpiritualRequirement {
  type: 'belief' | 'practice' | 'community' | 'knowledge' | 'commitment';
  requirement: string;
  flexibility: 'required' | 'preferred' | 'optional';
  alternatives: string[];
}

export interface ModalityAdaptation {
  condition: string;
  adaptation: string;
  effectiveness: number;
  safetyNotes: string[];
}

export interface CulturalProtocol {
  aspect: string;
  protocol: string;
  respect: string;
  authorization?: string;
  attribution: string;
}

export interface SecularAlternative {
  name: string;
  description: string;
  maintains: string[]; // What aspects are maintained
  modifies: string[]; // What aspects are modified
  effectiveness: number;
}

export interface ModalityMatch {
  modalityId: string;
  modality: HealingModality;
  matchScore: number;
  reasoning: MatchReasoning;
  adaptations: RecommendedAdaptation[];
  culturalConsiderations: string[];
  safetyAssessment: SafetyAssessment;
  progressiveIntroduction: ProgressiveStep[];
  communitySupport: CommunitySupport;
  professionalGuidance?: ProfessionalGuidance;
}

export interface MatchReasoning {
  spiritualAlignment: number;
  culturalCompatibility: number;
  personalResonance: number;
  practicalFeasibility: number;
  safetyScore: number;
  factors: string[];
  concerns: string[];
}

export interface RecommendedAdaptation {
  aspect: string;
  modification: string;
  reason: string;
  implementation: string[];
}

export interface SafetyAssessment {
  overallSafety: 'high' | 'medium' | 'low' | 'requires-supervision';
  traumaConsiderations: string[];
  contraindications: string[];
  redFlags: string[];
  safeguards: string[];
  emergencyProtocols: string[];
}

export interface ProgressiveStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  prerequisites: string[];
  markers: string[];
}

export interface CommunitySupport {
  available: boolean;
  types: string[];
  culturallyAuthentic: boolean;
  safetyVerified: boolean;
  accessMethods: string[];
}

export interface ProfessionalGuidance {
  required: boolean;
  type: string[];
  qualifications: string[];
  culturalCompetency: string[];
  availability: string;
}

export interface UserSpiritualProfile {
  userId: string;
  spiritualOpenness: 'religious' | 'spiritual-not-religious' | 'secular' | 'exploring' | 'questioning' | 'atheist';
  religiousTraditions: string[];
  culturalBackground: string[];
  spiritualPractices: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  timeAvailability: 'minimal' | 'moderate' | 'extensive';
  settingPreference: 'private' | 'small-group' | 'community' | 'flexible';
  traumaHistory: TraumaHistory;
  personalityFactors: PersonalityFactors;
  currentChallenges: string[];
  healingGoals: string[];
  avoidances: string[];
  preferences: ModalityPreferences;
}

export interface TraumaHistory {
  religiousTrauma: boolean;
  traumaType?: string[];
  healingStage: string;
  triggers: string[];
  safeLanguages: string[];
  supportNeeds: string[];
}

export interface PersonalityFactors {
  introversion: number; // 1-10 scale
  openness: number;
  conscientiousness: number;
  needForCommunity: number;
  needForStructure: number;
  analyticalOrientation: number;
  experientialOrientation: number;
}

export interface ModalityPreferences {
  movementOriented: boolean;
  intellectuallyEngaging: boolean;
  emotionallyExpressive: boolean;
  creativelySatisfying: boolean;
  communityConnected: boolean;
  traditionBased: boolean;
  innovationFriendly: boolean;
  evidenceBased: boolean;
}

export interface ModalityJourney {
  userId: string;
  currentModalities: CurrentModality[];
  completedModalities: CompletedModality[];
  plannedModalities: PlannedModality[];
  progressMetrics: ModalityProgress[];
  culturalLearningJourney: CulturalLearning[];
  mentorConnections: MentorConnection[];
  lastUpdated: Date;
}

export interface CurrentModality {
  modalityId: string;
  startDate: Date;
  adaptations: string[];
  progressStage: string;
  effectiveness: number;
  challenges: string[];
  supports: string[];
  nextMilestone: string;
}

export interface CompletedModality {
  modalityId: string;
  completionDate: Date;
  durationPracticed: number; // days
  finalEffectiveness: number;
  lessons: string[];
  culturalAppreciation: string[];
  wouldRecommend: boolean;
}

export interface PlannedModality {
  modalityId: string;
  plannedStartDate: Date;
  prerequisites: string[];
  preparationNeeded: string[];
  supportArrangements: string[];
}

export interface ModalityProgress {
  dimension: string;
  baseline: number;
  current: number;
  target: number;
  modalityContribution: Record<string, number>;
}

export interface CulturalLearning {
  culture: string;
  aspectsLearned: string[];
  respectDemonstrated: string[];
  appreciation: string;
  ongoingCommitments: string[];
}

export interface MentorConnection {
  modalityId: string;
  mentorType: 'cultural-authority' | 'experienced-practitioner' | 'spiritual-guide' | 'peer-mentor';
  culturalAuthenticity: boolean;
  connectionMethod: string;
  ongoingSupport: boolean;
}

export class SacredModalitiesMatching {
  private static instance: SacredModalitiesMatching;
  
  private constructor() {}
  
  static getInstance(): SacredModalitiesMatching {
    if (!SacredModalitiesMatching.instance) {
      SacredModalitiesMatching.instance = new SacredModalitiesMatching();
    }
    return SacredModalitiesMatching.instance;
  }

  /**
   * Find healing modality matches for user
   */
  async findModalityMatches(userId: string): Promise<ModalityMatch[]> {
    try {
      // Get user's spiritual profile
      const userProfile = await this.getUserSpiritualProfile(userId);
      if (!userProfile) {
        throw new Error('User spiritual profile not found');
      }

      // Get available modalities
      const modalities = await this.getAvailableModalities();

      // Score each modality
      const matches: ModalityMatch[] = [];
      for (const modality of modalities) {
        const match = await this.evaluateModalityMatch(modality, userProfile);
        if (match.matchScore > 60) { // Minimum threshold
          matches.push(match);
        }
      }

      // Sort by match score
      matches.sort((a, b) => b.matchScore - a.matchScore);

      // Limit to top 8 recommendations
      return matches.slice(0, 8);

    } catch (error) {
      console.error('Error finding modality matches:', error);
      return [];
    }
  }

  /**
   * Get detailed modality information with adaptations
   */
  async getAdaptedModality(
    modalityId: string, 
    userId: string
  ): Promise<{
    modality: HealingModality;
    adaptations: RecommendedAdaptation[];
    culturalGuidance: string[];
    safetyProtocols: string[];
    progressivePlan: ProgressiveStep[];
    communityResources: string[];
  }> {
    try {
      const userProfile = await this.getUserSpiritualProfile(userId);
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      const modality = await this.getModality(modalityId);
      if (!modality) {
        throw new Error('Modality not found');
      }

      // Generate personalized adaptations
      const adaptations = await this.generateAdaptations(modality, userProfile);

      // Generate cultural guidance
      const culturalGuidance = await this.generateCulturalGuidance(modality, userProfile);

      // Generate safety protocols
      const safetyProtocols = await this.generateSafetyProtocols(modality, userProfile);

      // Create progressive introduction plan
      const progressivePlan = await this.createProgressivePlan(modality, userProfile);

      // Find community resources
      const communityResources = await this.findCommunityResources(modality, userProfile);

      return {
        modality,
        adaptations,
        culturalGuidance,
        safetyProtocols,
        progressivePlan,
        communityResources
      };

    } catch (error) {
      console.error('Error getting adapted modality:', error);
      throw error;
    }
  }

  /**
   * Track user's modality journey
   */
  async trackModalityJourney(userId: string): Promise<ModalityJourney> {
    try {
      const existingJourney = await this.getModalityJourney(userId);
      
      // Update progress metrics
      const updatedMetrics = await this.updateProgressMetrics(userId, existingJourney);
      
      // Update cultural learning
      const updatedCulturalLearning = await this.updateCulturalLearning(userId, existingJourney);

      const journey: ModalityJourney = {
        ...existingJourney,
        userId,
        progressMetrics: updatedMetrics,
        culturalLearningJourney: updatedCulturalLearning,
        lastUpdated: new Date()
      };

      // Store updated journey
      await this.storeModalityJourney(journey);

      return journey;

    } catch (error) {
      console.error('Error tracking modality journey:', error);
      throw error;
    }
  }

  /**
   * Initialize sample healing modalities
   */
  async initializeHealingModalities(): Promise<void> {
    const modalities: Omit<HealingModality, 'id'>[] = [
      {
        name: 'Loving-Kindness Meditation (Metta)',
        category: 'meditation',
        tradition: ['Buddhism', 'Secular mindfulness'],
        culturalOrigins: ['Theravada Buddhism', 'Universal application'],
        spiritualRequirements: [
          {
            type: 'belief',
            requirement: 'Openness to compassion cultivation',
            flexibility: 'preferred',
            alternatives: ['Self-compassion practice', 'Empathy development']
          }
        ],
        practiceLevel: 'beginner',
        timeCommitment: '10-30 minutes daily',
        setting: 'flexible',
        materials: ['Quiet space', 'Optional cushion or chair'],
        preparations: ['Basic meditation posture', 'Understanding of practice structure'],
        contraindications: [
          'Active psychosis',
          'Severe self-hatred without professional support',
          'Recent trauma without stabilization'
        ],
        adaptations: [
          {
            condition: 'Religious trauma',
            adaptation: 'Use secular language: "May I find happiness" instead of religious phrasing',
            effectiveness: 0.9,
            safetyNotes: ['Avoid triggering religious language', 'Focus on universal wellbeing']
          },
          {
            condition: 'Difficulty with self-love',
            adaptation: 'Start with loving-kindness for a pet or beloved figure',
            effectiveness: 0.8,
            safetyNotes: ['Gradual progression to self', 'Allow natural development']
          }
        ],
        benefits: [
          'Increased self-compassion',
          'Reduced anxiety and depression',
          'Enhanced empathy and social connection',
          'Improved emotional regulation'
        ],
        evidenceBase: [
          'Randomized controlled trials on compassion meditation',
          'Neuroscience research on kindness cultivation',
          'Meta-analyses of loving-kindness intervention outcomes'
        ],
        ethicalConsiderations: [
          'Acknowledge Buddhist origins with gratitude',
          'Support Buddhist communities when possible',
          'Avoid claiming as purely secular innovation'
        ],
        culturalProtocols: [
          {
            aspect: 'Traditional origins',
            protocol: 'Always acknowledge 2,500+ years of Buddhist wisdom',
            respect: 'Honor the sacred nature for practicing Buddhists',
            attribution: 'Credit Buddhist teachers and lineages'
          },
          {
            aspect: 'Cultural sensitivity',
            protocol: 'Learn about Buddhist context if practicing regularly',
            respect: 'Understand this as more than just a technique',
            attribution: 'Consider supporting Buddhist temples or meditation centers'
          }
        ],
        secularAlternatives: [
          {
            name: 'Compassion Cultivation Practice',
            description: 'Scientifically-based compassion training without religious framework',
            maintains: ['Core practice structure', 'Emotional cultivation', 'Progressive stages'],
            modifies: ['Language to secular terms', 'Removes religious context', 'Adds psychological framework'],
            effectiveness: 0.85
          }
        ],
        isActive: true
      },
      {
        name: 'Lectio Divina (Sacred Reading)',
        category: 'contemplative',
        tradition: ['Christian contemplative', 'Adapted for interfaith use'],
        culturalOrigins: ['Christian monasticism', 'Adapted for various traditions'],
        spiritualRequirements: [
          {
            type: 'practice',
            requirement: 'Engagement with sacred or meaningful texts',
            flexibility: 'preferred',
            alternatives: ['Poetry meditation', 'Philosophical text reflection', 'Nature writing contemplation']
          }
        ],
        practiceLevel: 'beginner',
        timeCommitment: '20-45 minutes per session',
        setting: 'individual',
        materials: ['Sacred text, poetry, or meaningful reading', 'Journal for reflection'],
        preparations: ['Choose meaningful text', 'Create quiet reflective space'],
        contraindications: [
          'Severe religious trauma without adaptation',
          'Illiteracy without audio alternatives',
          'Severe ADHD without modifications'
        ],
        adaptations: [
          {
            condition: 'Non-Christian background',
            adaptation: 'Use texts from user\'s tradition or secular meaningful literature',
            effectiveness: 0.9,
            safetyNotes: ['Respect user\'s sacred texts', 'Include universal wisdom literature']
          },
          {
            condition: 'Religious trauma',
            adaptation: 'Use poetry, nature writing, or philosophical texts instead of religious texts',
            effectiveness: 0.8,
            safetyNotes: ['Avoid triggering religious content', 'Focus on universal themes']
          },
          {
            condition: 'Attention difficulties',
            adaptation: 'Use shorter passages, incorporate movement breaks',
            effectiveness: 0.7,
            safetyNotes: ['Maintain focus without strain', 'Allow natural attention rhythms']
          }
        ],
        benefits: [
          'Deepened reflection and contemplation',
          'Enhanced connection with meaningful texts',
          'Spiritual growth and insight development',
          'Improved focus and attention'
        ],
        evidenceBase: [
          'Studies on contemplative reading practices',
          'Research on reflective text engagement',
          'Qualitative studies on spiritual reading benefits'
        ],
        ethicalConsiderations: [
          'Honor Christian contemplative tradition',
          'Respect when adapting for other traditions',
          'Acknowledge monastic wisdom heritage'
        ],
        culturalProtocols: [
          {
            aspect: 'Christian origins',
            protocol: 'Acknowledge roots in Christian monasticism',
            respect: 'Honor as sacred practice for Christians',
            attribution: 'Credit contemplative Christian tradition'
          },
          {
            aspect: 'Interfaith adaptation',
            protocol: 'Respectfully adapt while maintaining essence',
            respect: 'Honor other traditions\' sacred texts',
            attribution: 'Acknowledge all wisdom traditions involved'
          }
        ],
        secularAlternatives: [
          {
            name: 'Contemplative Text Engagement',
            description: 'Reflective reading practice with philosophical or literary texts',
            maintains: ['Four-stage reading process', 'Deep reflection', 'Personal insight'],
            modifies: ['Uses secular texts', 'Removes religious framing', 'Adds literary analysis'],
            effectiveness: 0.8
          }
        ],
        isActive: true
      },
      {
        name: 'Walking Meditation',
        category: 'movement',
        tradition: ['Buddhism', 'Zen', 'Secular mindfulness'],
        culturalOrigins: ['Buddhist monasteries', 'Universal practice'],
        spiritualRequirements: [
          {
            type: 'practice',
            requirement: 'Ability to walk slowly and mindfully',
            flexibility: 'required',
            alternatives: ['Wheelchair mindful movement', 'Standing meditation', 'Breathing meditation']
          }
        ],
        practiceLevel: 'beginner',
        timeCommitment: '10-60 minutes',
        setting: 'flexible',
        materials: ['Walking path or space', 'Comfortable shoes'],
        preparations: ['Choose quiet walking area', 'Set intention for practice'],
        contraindications: [
          'Severe mobility impairments without adaptation',
          'Acute balance disorders',
          'Severe agoraphobia without gradual exposure'
        ],
        adaptations: [
          {
            condition: 'Mobility limitations',
            adaptation: 'Adapt to wheelchair movement, arm movements, or eye movement meditation',
            effectiveness: 0.9,
            safetyNotes: ['Ensure safe movement range', 'Adapt to individual abilities']
          },
          {
            condition: 'Urban environment',
            adaptation: 'Practice indoors, use labyrinths, or short path repetition',
            effectiveness: 0.8,
            safetyNotes: ['Ensure safe walking environment', 'Minimize distractions']
          },
          {
            condition: 'Anxiety about meditation',
            adaptation: 'Start with normal walking, gradually slow down',
            effectiveness: 0.9,
            safetyNotes: ['Begin with familiar activity', 'Gradual mindfulness introduction']
          }
        ],
        benefits: [
          'Integration of mindfulness with movement',
          'Improved body awareness',
          'Reduced anxiety and restlessness',
          'Enhanced present-moment awareness'
        ],
        evidenceBase: [
          'Research on mindful movement practices',
          'Studies on walking meditation benefits',
          'Evidence for movement-based mindfulness'
        ],
        ethicalConsiderations: [
          'Acknowledge Buddhist origins',
          'Respect contemplative walking traditions',
          'Honor indigenous walking ceremonies where relevant'
        ],
        culturalProtocols: [
          {
            aspect: 'Buddhist practice',
            protocol: 'Acknowledge Buddhist monastic origins',
            respect: 'Honor as contemplative practice',
            attribution: 'Credit Buddhist meditation traditions'
          }
        ],
        secularAlternatives: [
          {
            name: 'Mindful Walking Practice',
            description: 'Present-moment awareness during walking without religious framework',
            maintains: ['Slow walking', 'Body awareness', 'Present-moment focus'],
            modifies: ['Secular language', 'Scientific framing', 'Health benefits focus'],
            effectiveness: 0.9
          }
        ],
        isActive: true
      },
      {
        name: 'Gratitude Journaling with Sacred Reflection',
        category: 'contemplative',
        tradition: ['Universal', 'Multiple spiritual traditions'],
        culturalOrigins: ['Cross-cultural gratitude practices'],
        spiritualRequirements: [
          {
            type: 'practice',
            requirement: 'Willingness to reflect on positive experiences',
            flexibility: 'required',
            alternatives: ['Appreciation practice', 'Positive psychology exercises']
          }
        ],
        practiceLevel: 'beginner',
        timeCommitment: '10-20 minutes daily',
        setting: 'individual',
        materials: ['Journal or digital device', 'Writing materials'],
        preparations: ['Choose consistent time', 'Create reflective space'],
        contraindications: [
          'Severe depression with guilt about positive emotions',
          'Active suicidal ideation without professional support'
        ],
        adaptations: [
          {
            condition: 'Depression',
            adaptation: 'Start with very small gratitudes, include self-compassion',
            effectiveness: 0.8,
            safetyNotes: ['Gentle approach', 'Professional support available']
          },
          {
            condition: 'Cultural differences',
            adaptation: 'Adapt to cultural expressions of gratitude and appreciation',
            effectiveness: 0.9,
            safetyNotes: ['Honor cultural gratitude practices', 'Include family/community gratitude']
          },
          {
            condition: 'Trauma history',
            adaptation: 'Focus on present-moment safety and small positives',
            effectiveness: 0.7,
            safetyNotes: ['Trauma-informed approach', 'Avoid pressure for gratitude']
          }
        ],
        benefits: [
          'Improved mood and emotional well-being',
          'Enhanced spiritual connection',
          'Better sleep and reduced anxiety',
          'Increased life satisfaction'
        ],
        evidenceBase: [
          'Extensive research on gratitude interventions',
          'Positive psychology studies',
          'Neuroscience of gratitude and well-being'
        ],
        ethicalConsiderations: [
          'Respect cultural expressions of gratitude',
          'Avoid toxic positivity',
          'Honor diverse spiritual frameworks for gratitude'
        ],
        culturalProtocols: [
          {
            aspect: 'Cultural gratitude practices',
            protocol: 'Learn about and respect diverse cultural expressions of gratitude',
            respect: 'Honor family and cultural gratitude traditions',
            attribution: 'Acknowledge cross-cultural wisdom on appreciation'
          }
        ],
        secularAlternatives: [
          {
            name: 'Positive Psychology Journaling',
            description: 'Evidence-based gratitude practice without spiritual framework',
            maintains: ['Daily gratitude recording', 'Reflection practice', 'Positive focus'],
            modifies: ['Scientific language', 'Psychological benefits focus', 'Removes spiritual context'],
            effectiveness: 0.9
          }
        ],
        isActive: true
      },
      {
        name: 'Breath Prayer (Centering with Sacred Phrases)',
        category: 'prayer',
        tradition: ['Christian contemplative', 'Interfaith adaptation'],
        culturalOrigins: ['Christian mysticism', 'Desert Fathers and Mothers'],
        spiritualRequirements: [
          {
            type: 'practice',
            requirement: 'Comfort with repetitive sacred phrases',
            flexibility: 'preferred',
            alternatives: ['Mantra meditation', 'Affirmation practice', 'Breathing meditation']
          }
        ],
        practiceLevel: 'intermediate',
        timeCommitment: '15-30 minutes',
        setting: 'individual',
        materials: ['Quiet space', 'Optional prayer beads or counter'],
        preparations: ['Choose meaningful phrase', 'Learn basic rhythm'],
        contraindications: [
          'Severe religious trauma without adaptation',
          'Respiratory disorders affecting breath control',
          'Severe anxiety about prayer or spiritual practice'
        ],
        adaptations: [
          {
            condition: 'Non-Christian background',
            adaptation: 'Use phrases from user\'s tradition or universal affirmations',
            effectiveness: 0.9,
            safetyNotes: ['Respect user\'s spiritual language', 'Include universal phrases']
          },
          {
            condition: 'Religious trauma',
            adaptation: 'Use secular affirmations or nature-based phrases',
            effectiveness: 0.8,
            safetyNotes: ['Avoid triggering religious language', 'Focus on personal meaningful phrases']
          },
          {
            condition: 'Respiratory limitations',
            adaptation: 'Practice without breath control, focus on phrase repetition',
            effectiveness: 0.7,
            safetyNotes: ['Natural breathing rhythm', 'No breath manipulation']
          }
        ],
        benefits: [
          'Deepened spiritual connection',
          'Reduced anxiety and racing thoughts',
          'Enhanced focus and concentration',
          'Spiritual grounding and centering'
        ],
        evidenceBase: [
          'Studies on repetitive prayer practices',
          'Research on contemplative prayer benefits',
          'Evidence for mantra-based meditation'
        ],
        ethicalConsiderations: [
          'Honor Christian contemplative tradition',
          'Respect when adapting for other traditions',
          'Acknowledge mystical prayer heritage'
        ],
        culturalProtocols: [
          {
            aspect: 'Christian contemplative origins',
            protocol: 'Acknowledge roots in Christian mysticism',
            respect: 'Honor as sacred prayer practice',
            attribution: 'Credit contemplative Christian teachers'
          },
          {
            aspect: 'Interfaith adaptation',
            protocol: 'Respectfully adapt while honoring original tradition',
            respect: 'Include appropriate phrases from user\'s tradition',
            attribution: 'Acknowledge all wisdom traditions involved'
          }
        ],
        secularAlternatives: [
          {
            name: 'Affirmation-Based Breathing Practice',
            description: 'Rhythmic affirmation practice coordinated with breathing',
            maintains: ['Phrase repetition', 'Breath awareness', 'Centering effect'],
            modifies: ['Secular affirmations', 'Psychological framing', 'Removes prayer context'],
            effectiveness: 0.8
          }
        ],
        isActive: true
      }
    ];

    // Store each modality
    for (const modality of modalities) {
      const docRef = doc(collection(db, 'healing_modalities'));
      await setDoc(docRef, {
        ...modality,
        id: docRef.id
      });
    }
  }

  // Private helper methods

  private async getUserSpiritualProfile(userId: string): Promise<UserSpiritualProfile | null> {
    try {
      const docRef = doc(db, 'user_spiritual_profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserSpiritualProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user spiritual profile:', error);
      return null;
    }
  }

  private async getAvailableModalities(): Promise<HealingModality[]> {
    try {
      const q = query(
        collection(db, 'healing_modalities'),
        where('isActive', '==', true)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HealingModality[];
    } catch (error) {
      console.error('Error getting available modalities:', error);
      return [];
    }
  }

  private async evaluateModalityMatch(
    modality: HealingModality,
    userProfile: UserSpiritualProfile
  ): Promise<ModalityMatch> {
    // Calculate match components
    const spiritualAlignment = this.calculateSpiritualAlignment(modality, userProfile);
    const culturalCompatibility = this.calculateCulturalCompatibility(modality, userProfile);
    const personalResonance = this.calculatePersonalResonance(modality, userProfile);
    const practicalFeasibility = this.calculatePracticalFeasibility(modality, userProfile);
    const safetyScore = this.calculateSafetyScore(modality, userProfile);

    // Calculate overall match score
    const matchScore = Math.round(
      (spiritualAlignment * 0.25) +
      (culturalCompatibility * 0.25) +
      (personalResonance * 0.25) +
      (practicalFeasibility * 0.15) +
      (safetyScore * 0.10)
    );

    // Generate reasoning
    const reasoning: MatchReasoning = {
      spiritualAlignment,
      culturalCompatibility,
      personalResonance,
      practicalFeasibility,
      safetyScore,
      factors: this.generateMatchFactors(modality, userProfile, {
        spiritualAlignment,
        culturalCompatibility,
        personalResonance,
        practicalFeasibility,
        safetyScore
      }),
      concerns: this.generateMatchConcerns(modality, userProfile)
    };

    // Generate adaptations
    const adaptations = await this.generateRecommendedAdaptations(modality, userProfile);

    // Generate cultural considerations
    const culturalConsiderations = this.generateCulturalConsiderations(modality, userProfile);

    // Assess safety
    const safetyAssessment = this.assessSafety(modality, userProfile);

    // Create progressive introduction
    const progressiveIntroduction = this.createProgressiveIntroduction(modality, userProfile);

    // Find community support
    const communitySupport = await this.findCommunitySupport(modality, userProfile);

    // Determine professional guidance needs
    const professionalGuidance = this.determineProfessionalGuidance(modality, userProfile);

    return {
      modalityId: modality.id,
      modality,
      matchScore,
      reasoning,
      adaptations,
      culturalConsiderations,
      safetyAssessment,
      progressiveIntroduction,
      communitySupport,
      professionalGuidance
    };
  }

  private calculateSpiritualAlignment(modality: HealingModality, userProfile: UserSpiritualProfile): number {
    let score = 50; // Base score

    // Check spiritual openness compatibility
    const spiritualRequirements = modality.spiritualRequirements;
    
    switch (userProfile.spiritualOpenness) {
      case 'religious':
        if (modality.tradition.some(t => userProfile.religiousTraditions.includes(t))) {
          score += 40;
        } else if (spiritualRequirements.every(req => req.flexibility !== 'required')) {
          score += 20;
        }
        break;
      
      case 'spiritual-not-religious':
        if (modality.secularAlternatives && modality.secularAlternatives.length > 0) {
          score += 35;
        }
        if (spiritualRequirements.every(req => req.flexibility === 'optional')) {
          score += 25;
        }
        break;
      
      case 'secular':
        if (modality.secularAlternatives && modality.secularAlternatives.length > 0) {
          score += 45;
        } else {
          score -= 30;
        }
        break;
      
      case 'exploring':
        score += 30; // Open to trying different approaches
        break;
      
      case 'questioning':
        if (modality.secularAlternatives) {
          score += 25;
        }
        break;
      
      case 'atheist':
        if (modality.secularAlternatives && modality.secularAlternatives.length > 0) {
          score += 40;
        } else {
          score -= 40;
        }
        break;
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateCulturalCompatibility(modality: HealingModality, userProfile: UserSpiritualProfile): number {
    let score = 60; // Base score

    // Check cultural origins match
    const culturalMatch = modality.culturalOrigins.some(origin => 
      userProfile.culturalBackground.includes(origin) || origin === 'Universal application'
    );

    if (culturalMatch) {
      score += 30;
    }

    // Check for cultural protocols and respect
    if (modality.culturalProtocols.length > 0) {
      score += 10; // Has considered cultural sensitivity
    }

    // Check for cultural appropriation risks
    const hasHighRiskOrigins = modality.culturalOrigins.some(origin => 
      ['Indigenous', 'Closed practice'].includes(origin)
    );

    if (hasHighRiskOrigins && !culturalMatch) {
      score -= 40; // Reduce score for potential appropriation
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculatePersonalResonance(modality: HealingModality, userProfile: UserSpiritualProfile): number {
    let score = 50; // Base score

    // Check category preference
    const categoryPreferences = {
      'meditation': userProfile.preferences.intellectuallyEngaging ? 20 : 10,
      'prayer': userProfile.spiritualOpenness === 'religious' ? 30 : 0,
      'movement': userProfile.preferences.movementOriented ? 25 : 5,
      'creative': userProfile.preferences.creativelySatisfying ? 25 : 10,
      'ritual': userProfile.preferences.traditionBased ? 20 : 5,
      'contemplative': userProfile.preferences.intellectuallyEngaging ? 20 : 10,
      'service': userProfile.preferences.communityConnected ? 25 : 15,
      'study': userProfile.preferences.intellectuallyEngaging ? 25 : 10
    };

    score += categoryPreferences[modality.category] || 0;

    // Check setting preference
    const settingMatch = {
      'individual': userProfile.settingPreference === 'private' ? 20 : 10,
      'group': userProfile.settingPreference === 'small-group' ? 20 : 10,
      'guided': userProfile.experienceLevel === 'beginner' ? 15 : 5,
      'community': userProfile.settingPreference === 'community' ? 25 : 5,
      'flexible': 15 // Always somewhat appealing
    };

    score += settingMatch[modality.setting] || 0;

    // Check experience level appropriateness
    const experienceLevelMatch = {
      'beginner': userProfile.experienceLevel === 'beginner' ? 15 : 5,
      'intermediate': userProfile.experienceLevel === 'intermediate' ? 15 : 
                      userProfile.experienceLevel === 'beginner' ? 5 : 10,
      'advanced': userProfile.experienceLevel === 'advanced' ? 15 : 0
    };

    score += experienceLevelMatch[modality.practiceLevel] || 0;

    return Math.max(0, Math.min(100, score));
  }

  private calculatePracticalFeasibility(modality: HealingModality, userProfile: UserSpiritualProfile): number {
    let score = 70; // Base score

    // Check time availability
    const timeRequirement = this.parseTimeCommitment(modality.timeCommitment);
    const timeCompatibility = {
      'minimal': timeRequirement <= 15 ? 20 : 0,
      'moderate': timeRequirement <= 45 ? 20 : 5,
      'extensive': 15 // Can accommodate longer practices
    };

    score += timeCompatibility[userProfile.timeAvailability] || 0;

    // Check materials accessibility
    const complexMaterials = modality.materials.filter(m => 
      !['Quiet space', 'Comfortable clothes', 'Journal'].includes(m)
    ).length;

    if (complexMaterials === 0) {
      score += 15;
    } else if (complexMaterials <= 2) {
      score += 5;
    } else {
      score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateSafetyScore(modality: HealingModality, userProfile: UserSpiritualProfile): number {
    let score = 80; // Base safety score

    // Check contraindications
    for (const contraindication of modality.contraindications) {
      if (this.checkContraindication(contraindication, userProfile)) {
        score -= 30;
      }
    }

    // Check trauma considerations
    if (userProfile.traumaHistory.religiousTrauma) {
      if (modality.category === 'prayer' && !modality.secularAlternatives) {
        score -= 25;
      }
      
      // Check if modality has trauma adaptations
      const hasTraumaAdaptations = modality.adaptations.some(a => 
        a.condition.toLowerCase().includes('trauma')
      );
      
      if (hasTraumaAdaptations) {
        score += 15;
      }
    }

    // Check for safety protocols
    if (modality.culturalProtocols.length > 0) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  private parseTimeCommitment(timeCommitment: string): number {
    // Extract minutes from time commitment string
    const match = timeCommitment.match(/(\d+)(?:-(\d+))?\s*minutes?/i);
    if (match) {
      return match[2] ? parseInt(match[2]) : parseInt(match[1]);
    }
    return 30; // Default
  }

  private checkContraindication(contraindication: string, userProfile: UserSpiritualProfile): boolean {
    // Check if user has conditions matching contraindications
    const condition = contraindication.toLowerCase();
    
    if (condition.includes('trauma') && userProfile.traumaHistory.religiousTrauma) {
      return true;
    }
    
    if (condition.includes('psychosis') && userProfile.currentChallenges.includes('psychosis')) {
      return true;
    }
    
    // Add more checks as needed
    return false;
  }

  private generateMatchFactors(
    modality: HealingModality, 
    userProfile: UserSpiritualProfile, 
    scores: any
  ): string[] {
    const factors: string[] = [];

    if (scores.spiritualAlignment > 70) {
      factors.push('Strong spiritual alignment with your openness level');
    }

    if (scores.culturalCompatibility > 70) {
      factors.push('Good cultural compatibility with your background');
    }

    if (scores.personalResonance > 70) {
      factors.push('Matches your personal preferences and style');
    }

    if (modality.adaptations.length > 0) {
      factors.push('Has built-in adaptations for various needs');
    }

    if (modality.evidenceBase.length > 0) {
      factors.push('Strong evidence base for effectiveness');
    }

    return factors;
  }

  private generateMatchConcerns(modality: HealingModality, userProfile: UserSpiritualProfile): string[] {
    const concerns: string[] = [];

    if (userProfile.traumaHistory.religiousTrauma && modality.category === 'prayer') {
      concerns.push('May trigger religious trauma - adaptations recommended');
    }

    if (modality.practiceLevel === 'advanced' && userProfile.experienceLevel === 'beginner') {
      concerns.push('Advanced practice may be challenging for beginners');
    }

    const timeRequirement = this.parseTimeCommitment(modality.timeCommitment);
    if (timeRequirement > 30 && userProfile.timeAvailability === 'minimal') {
      concerns.push('Time commitment may be challenging with limited availability');
    }

    return concerns;
  }

  private async generateRecommendedAdaptations(
    modality: HealingModality, 
    userProfile: UserSpiritualProfile
  ): Promise<RecommendedAdaptation[]> {
    const adaptations: RecommendedAdaptation[] = [];

    // Find relevant adaptations from modality
    for (const adaptation of modality.adaptations) {
      if (this.isAdaptationRelevant(adaptation, userProfile)) {
        adaptations.push({
          aspect: adaptation.condition,
          modification: adaptation.adaptation,
          reason: `Addresses your ${adaptation.condition}`,
          implementation: adaptation.safetyNotes
        });
      }
    }

    // Add custom adaptations based on user profile
    if (userProfile.traumaHistory.religiousTrauma && modality.category === 'prayer') {
      adaptations.push({
        aspect: 'Religious trauma sensitivity',
        modification: 'Use secular language alternatives and avoid triggering religious terms',
        reason: 'Protects against religious trauma triggers',
        implementation: ['Replace religious terms with neutral language', 'Focus on personal meaning']
      });
    }

    return adaptations;
  }

  private isAdaptationRelevant(adaptation: ModalityAdaptation, userProfile: UserSpiritualProfile): boolean {
    const condition = adaptation.condition.toLowerCase();
    
    if (condition.includes('trauma') && userProfile.traumaHistory.religiousTrauma) {
      return true;
    }
    
    if (condition.includes('mobility') && userProfile.currentChallenges.includes('mobility')) {
      return true;
    }
    
    // Add more relevance checks
    return false;
  }

  private generateCulturalConsiderations(
    modality: HealingModality, 
    userProfile: UserSpiritualProfile
  ): string[] {
    const considerations: string[] = [];

    for (const protocol of modality.culturalProtocols) {
      considerations.push(protocol.respect);
    }

    // Add user-specific cultural considerations
    if (!modality.culturalOrigins.some(origin => userProfile.culturalBackground.includes(origin))) {
      considerations.push('Learning about the cultural origins of this practice is recommended');
    }

    return considerations;
  }

  private assessSafety(modality: HealingModality, userProfile: UserSpiritualProfile): SafetyAssessment {
    const traumaConsiderations: string[] = [];
    const contraindications: string[] = [];
    const safeguards: string[] = [];

    // Check trauma considerations
    if (userProfile.traumaHistory.religiousTrauma) {
      traumaConsiderations.push('Religious trauma history requires gentle approach');
      safeguards.push('Use secular alternatives when available');
      safeguards.push('Professional support available if needed');
    }

    // Check contraindications
    for (const contraindication of modality.contraindications) {
      if (this.checkContraindication(contraindication, userProfile)) {
        contraindications.push(contraindication);
      }
    }

    // Determine overall safety
    let overallSafety: SafetyAssessment['overallSafety'] = 'high';
    if (contraindications.length > 0) {
      overallSafety = 'requires-supervision';
    } else if (traumaConsiderations.length > 0) {
      overallSafety = 'medium';
    }

    return {
      overallSafety,
      traumaConsiderations,
      contraindications,
      redFlags: [],
      safeguards,
      emergencyProtocols: ['Stop practice if distressed', 'Seek professional support if needed']
    };
  }

  private createProgressiveIntroduction(
    modality: HealingModality, 
    userProfile: UserSpiritualProfile
  ): ProgressiveStep[] {
    const steps: ProgressiveStep[] = [
      {
        step: 1,
        title: 'Introduction and Learning',
        description: 'Learn about the practice, its origins, and basic techniques',
        duration: '1 week',
        prerequisites: ['Open mind', 'Basic understanding of practice'],
        markers: ['Comfortable with concept', 'Understanding of cultural background']
      },
      {
        step: 2,
        title: 'Guided Practice',
        description: 'Begin with short, guided sessions',
        duration: '2-3 weeks',
        prerequisites: ['Completed introduction phase'],
        markers: ['Able to follow guided instruction', 'Comfortable with basic technique']
      },
      {
        step: 3,
        title: 'Independent Practice',
        description: 'Practice independently with occasional guidance',
        duration: '4-6 weeks',
        prerequisites: ['Comfortable with guided practice'],
        markers: ['Can practice independently', 'Developing personal rhythm']
      },
      {
        step: 4,
        title: 'Integration and Adaptation',
        description: 'Integrate practice into daily life and adapt as needed',
        duration: 'Ongoing',
        prerequisites: ['Established independent practice'],
        markers: ['Regular practice habit', 'Personal adaptations working well']
      }
    ];

    // Modify steps based on user experience level
    if (userProfile.experienceLevel === 'advanced') {
      steps[0].duration = '3 days';
      steps[1].duration = '1 week';
    }

    return steps;
  }

  private async findCommunitySupport(
    modality: HealingModality, 
    userProfile: UserSpiritualProfile
  ): Promise<CommunitySupport> {
    // This would integrate with community databases
    return {
      available: true,
      types: ['Online communities', 'Local practice groups'],
      culturallyAuthentic: true,
      safetyVerified: true,
      accessMethods: ['ALCHM community platform', 'External referrals']
    };
  }

  private determineProfessionalGuidance(
    modality: HealingModality, 
    userProfile: UserSpiritualProfile
  ): ProfessionalGuidance | undefined {
    let required = false;
    const types: string[] = [];
    const qualifications: string[] = [];

    // Check if trauma history requires professional support
    if (userProfile.traumaHistory.religiousTrauma && modality.category === 'prayer') {
      required = true;
      types.push('trauma_specialist');
      qualifications.push('Religious trauma certification');
    }

    // Check if advanced practice requires guidance
    if (modality.practiceLevel === 'advanced' && userProfile.experienceLevel === 'beginner') {
      types.push('spiritual_guide');
      qualifications.push('Experienced in this modality');
    }

    if (types.length === 0) {
      return undefined;
    }

    return {
      required,
      type: types,
      qualifications,
      culturalCompetency: ['Cultural sensitivity training'],
      availability: 'Available on referral'
    };
  }

  private async getModality(modalityId: string): Promise<HealingModality | null> {
    try {
      const docRef = doc(db, 'healing_modalities', modalityId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as HealingModality;
      }
      return null;
    } catch (error) {
      console.error('Error getting modality:', error);
      return null;
    }
  }

  private async generateAdaptations(
    modality: HealingModality,
    userProfile: UserSpiritualProfile
  ): Promise<RecommendedAdaptation[]> {
    return this.generateRecommendedAdaptations(modality, userProfile);
  }

  private async generateCulturalGuidance(
    modality: HealingModality,
    userProfile: UserSpiritualProfile
  ): Promise<string[]> {
    return this.generateCulturalConsiderations(modality, userProfile);
  }

  private async generateSafetyProtocols(
    modality: HealingModality,
    userProfile: UserSpiritualProfile
  ): Promise<string[]> {
    const safety = this.assessSafety(modality, userProfile);
    return [...safety.safeguards, ...safety.emergencyProtocols];
  }

  private async createProgressivePlan(
    modality: HealingModality,
    userProfile: UserSpiritualProfile
  ): Promise<ProgressiveStep[]> {
    return this.createProgressiveIntroduction(modality, userProfile);
  }

  private async findCommunityResources(
    modality: HealingModality,
    userProfile: UserSpiritualProfile
  ): Promise<string[]> {
    const support = await this.findCommunitySupport(modality, userProfile);
    return support.accessMethods;
  }

  private async getModalityJourney(userId: string): Promise<ModalityJourney> {
    try {
      const docRef = doc(db, 'modality_journeys', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as ModalityJourney;
      }
      
      // Return default journey if none exists
      return {
        userId,
        currentModalities: [],
        completedModalities: [],
        plannedModalities: [],
        progressMetrics: [],
        culturalLearningJourney: [],
        mentorConnections: [],
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error getting modality journey:', error);
      throw error;
    }
  }

  private async updateProgressMetrics(
    userId: string,
    existingJourney?: ModalityJourney
  ): Promise<ModalityProgress[]> {
    // Update progress metrics based on current practice
    return existingJourney?.progressMetrics || [];
  }

  private async updateCulturalLearning(
    userId: string,
    existingJourney?: ModalityJourney
  ): Promise<CulturalLearning[]> {
    // Update cultural learning based on modalities practiced
    return existingJourney?.culturalLearningJourney || [];
  }

  private async storeModalityJourney(journey: ModalityJourney): Promise<void> {
    try {
      const docRef = doc(db, 'modality_journeys', journey.userId);
      await setDoc(docRef, journey);
    } catch (error) {
      console.error('Error storing modality journey:', error);
    }
  }
}

export default SacredModalitiesMatching;