// ALCHM Ritual & Movement Therapy Integration
// Cultural ritual practices and somatic movement for emotional transformation

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  RitualSession,
  MovementSession,
  RitualType,
  MovementType,
  AlchemyProcess,
  CulturalHealingElement,
  AncestralWisdomElement,
  SomaticPractice
} from '@/types/emotional-wellness-schema';

interface RitualMovementProps {
  userId: string;
  currentEmotionalState: {
    primaryEmotion: string;
    intensity: number; // 1-10
    stressLevel: number; // 1-10
    energyLevel: number; // 1-10
    connectionToSelf: number; // 1-10
    connectionToNature: number; // 1-10
  };
  culturalContext: {
    primaryCulture: string;
    ritualTraditions: string[];
    movementTraditions: string[];
    sacredPractices: string[];
    ancestralWisdom: string[];
    healingMethods: string[];
    seasonalObservances: string[];
    elementalConnections: string[];
  };
  intentionSetting: {
    emotionToTransform: string;
    desiredOutcome: string;
    healingFocus: string[];
    timeAvailable: number; // minutes
    privacyLevel: 'private' | 'small_circle' | 'community';
  };
  accessibilityNeeds?: {
    mobilityLimitations: string[];
    sensoryConsiderations: string[];
    physicalAdaptations: string[];
    energyLevel: 'low' | 'moderate' | 'high';
  };
  environmentalFactors?: {
    location: 'indoor' | 'outdoor' | 'sacred_space' | 'home';
    season: 'spring' | 'summer' | 'fall' | 'winter';
    timeOfDay: 'dawn' | 'morning' | 'midday' | 'evening' | 'dusk' | 'night';
    lunarPhase: 'new' | 'waxing' | 'full' | 'waning';
    weather: string;
  };
  onRitualComplete?: (session: RitualSession) => void;
  onMovementComplete?: (session: MovementSession) => void;
}

interface RitualDesign {
  elements: RitualElement[];
  movements: MovementSequence[];
  culturalAdaptations: CulturalAdaptation[];
  accessibilityModifications: AccessibilityModification[];
  estimatedDuration: number;
  materials: RitualMaterial[];
  safetyConsiderations: SafetyConsideration[];
}

interface MovementSequence {
  sequenceId: string;
  name: string;
  description: string;
  duration: number; // minutes
  intensity: 'gentle' | 'moderate' | 'dynamic' | 'restorative';
  movements: MovementInstruction[];
  emotionalFocus: string[];
  physicalBenefits: string[];
  contraindications: string[];
  culturalOrigin?: string;
}

const RitualMovementTherapy: React.FC<RitualMovementProps> = ({
  userId,
  currentEmotionalState,
  culturalContext,
  intentionSetting,
  accessibilityNeeds,
  environmentalFactors,
  onRitualComplete,
  onMovementComplete
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'design' | 'ritual' | 'movement' | 'integration'>('design');
  const [selectedRitualType, setSelectedRitualType] = useState<RitualType | null>(null);
  const [selectedMovementType, setSelectedMovementType] = useState<MovementType | null>(null);
  const [ritualDesign, setRitualDesign] = useState<RitualDesign | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'opening' | 'main' | 'integration' | 'closing'>('preparation');
  const [sessionProgress, setSessionProgress] = useState({
    currentStep: 0,
    totalSteps: 5,
    timeElapsed: 0,
    energyShifts: [],
    emotionalShifts: [],
    insights: []
  });
  const [experienceTracking, setExperienceTracking] = useState({
    physicalSensations: [],
    emotionalReleases: [],
    spiritualConnections: [],
    culturalResonance: 5,
    transformationDepth: 5,
    integrationNeeded: []
  });

  // Refs for timing and session tracking
  const sessionStartRef = useRef<Date | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Cultural ritual types based on context
  const getCulturalRitualTypes = useCallback((): RitualType[] => {
    const ritualTypes: RitualType[] = [];

    // Universal healing rituals
    ritualTypes.push({
      typeId: 'emotional_alchemy',
      name: 'Emotional Alchemy Ritual',
      tradition: 'therapeutic',
      description: 'Transform emotional energy through sacred process',
      components: [
        { name: 'Sacred Space Creation', duration: 5, description: 'Prepare space for transformation' },
        { name: 'Intention Setting', duration: 5, description: 'Clarify transformation goals' },
        { name: 'Elemental Invocation', duration: 10, description: 'Call upon natural elements' },
        { name: 'Emotional Processing', duration: 15, description: 'Work with emotional energy' },
        { name: 'Integration', duration: 10, description: 'Integrate new energy' },
        { name: 'Gratitude & Closing', duration: 5, description: 'Honor the process' }
      ],
      culturalConsiderations: ['Adaptable to any cultural background'],
      adaptations: [
        { context: 'indoor', modification: 'Use visualization for natural elements' },
        { context: 'limited_mobility', modification: 'Focus on breath and intention' }
      ]
    });

    // Nature-based rituals
    if (environmentalFactors?.location === 'outdoor' || currentEmotionalState.connectionToNature > 6) {
      ritualTypes.push({
        typeId: 'nature_connection',
        name: 'Earth Healing Ceremony',
        tradition: 'nature_based',
        description: 'Connect with earth\'s healing energy',
        components: [
          { name: 'Grounding with Earth', duration: 10, description: 'Physical connection to ground' },
          { name: 'Element Appreciation', duration: 15, description: 'Honor the four elements' },
          { name: 'Energy Exchange', duration: 15, description: 'Give and receive with nature' },
          { name: 'Wisdom Receiving', duration: 10, description: 'Listen for natural guidance' }
        ],
        culturalConsiderations: ['Respectful of indigenous traditions', 'Non-appropriative approach'],
        adaptations: [
          { context: 'indoor', modification: 'Use plants, stones, water, candle for elements' },
          { context: 'urban', modification: 'Connect with available nature (parks, trees)' }
        ]
      });
    }

    // Cultural-specific rituals based on background
    if (culturalContext.ritualTraditions.includes('ancestor_honoring')) {
      ritualTypes.push({
        typeId: 'ancestor_healing',
        name: 'Ancestral Wisdom Ceremony',
        tradition: 'ancestor_honoring',
        description: 'Connect with ancestral healing wisdom',
        components: [
          { name: 'Ancestor Invocation', duration: 8, description: 'Call upon ancestral guidance' },
          { name: 'Story Sharing', duration: 12, description: 'Share or remember ancestral stories' },
          { name: 'Wisdom Request', duration: 10, description: 'Ask for guidance with current challenges' },
          { name: 'Gratitude Offering', duration: 10, description: 'Offer gratitude to ancestors' }
        ],
        culturalConsiderations: ['Honor specific cultural protocols', 'Respectful approach to ancestry'],
        adaptations: [
          { context: 'unfamiliar_traditions', modification: 'Focus on general ancestral appreciation' },
          { context: 'family_trauma', modification: 'Connect with chosen family or spiritual ancestors' }
        ]
      });
    }

    // Seasonal rituals
    if (environmentalFactors?.season) {
      const seasonalRitual = createSeasonalRitual(environmentalFactors.season);
      if (seasonalRitual) ritualTypes.push(seasonalRitual);
    }

    // Emotional-specific rituals
    if (currentEmotionalState.primaryEmotion === 'grief' || currentEmotionalState.primaryEmotion === 'sadness') {
      ritualTypes.push({
        typeId: 'grief_transformation',
        name: 'Grief Transformation Ceremony',
        tradition: 'therapeutic',
        description: 'Honor grief and transform it into wisdom',
        components: [
          { name: 'Grief Acknowledgment', duration: 10, description: 'Honor what has been lost' },
          { name: 'Feeling Expression', duration: 15, description: 'Express grief through movement/sound' },
          { name: 'Love Recognition', duration: 10, description: 'Recognize the love beneath grief' },
          { name: 'Wisdom Integration', duration: 10, description: 'Integrate learning from loss' }
        ],
        culturalConsiderations: ['Respect cultural grief practices'],
        adaptations: [
          { context: 'fresh_grief', modification: 'Gentle, honoring approach' },
          { context: 'complicated_grief', modification: 'Professional support integration' }
        ]
      });
    }

    return ritualTypes;
  }, [currentEmotionalState, culturalContext, environmentalFactors]);

  // Movement therapy types
  const getMovementTherapyTypes = useCallback((): MovementType[] => {
    const movementTypes: MovementType[] = [];

    // Somatic movement for trauma release
    movementTypes.push({
      typeId: 'somatic_release',
      name: 'Gentle Somatic Release',
      category: 'somatic',
      description: 'Release trapped emotions through gentle body movement',
      techniques: [
        { name: 'Tension Release', instruction: 'Tense and release muscle groups slowly' },
        { name: 'Shaking & Tremoring', instruction: 'Allow natural tremoring to release tension' },
        { name: 'Flowing Movement', instruction: 'Move in response to internal impulses' },
        { name: 'Grounding Touch', instruction: 'Self-touch for nervous system regulation' }
      ],
      culturalBackground: null,
      therapeuticApplications: ['trauma_release', 'anxiety_reduction', 'nervous_system_regulation'],
      contraindications: ['acute_injury', 'severe_dissociation']
    });

    // Expressive movement based on emotion
    if (currentEmotionalState.intensity > 6) {
      movementTypes.push({
        typeId: 'expressive_movement',
        name: 'Emotional Expression Dance',
        category: 'expressive',
        description: 'Express and transform emotions through movement',
        techniques: [
          { name: 'Emotion Embodiment', instruction: 'Move as your emotion would move' },
          { name: 'Transformation Dance', instruction: 'Dance from current emotion to desired state' },
          { name: 'Release Movement', instruction: 'Large movements to release emotional energy' },
          { name: 'Integration Flow', instruction: 'Gentle movements to integrate new energy' }
        ],
        culturalBackground: null,
        therapeuticApplications: ['emotional_release', 'self_expression', 'catharsis'],
        contraindications: ['recent_injury', 'cardiovascular_concerns']
      });
    }

    // Cultural movement practices
    if (culturalContext.movementTraditions.length > 0) {
      culturalContext.movementTraditions.forEach(tradition => {
        if (tradition.includes('dance')) {
          movementTypes.push({
            typeId: 'cultural_dance',
            name: 'Cultural Healing Dance',
            category: 'cultural',
            description: 'Connect with healing through cultural movement',
            techniques: [
              { name: 'Traditional Steps', instruction: 'Use familiar cultural movement patterns' },
              { name: 'Ancestral Connection', instruction: 'Move with ancestral guidance' },
              { name: 'Community Spirit', instruction: 'Feel connection to cultural community' },
              { name: 'Modern Adaptation', instruction: 'Adapt traditions for current healing' }
            ],
            culturalBackground: tradition,
            therapeuticApplications: ['cultural_connection', 'identity_affirmation', 'community_healing'],
            contraindications: ['cultural_trauma', 'identity_conflicts']
          });
        }
      });
    }

    // Gentle movement for low energy
    if (accessibilityNeeds?.energyLevel === 'low' || currentEmotionalState.energyLevel < 4) {
      movementTypes.push({
        typeId: 'gentle_flow',
        name: 'Restorative Movement Flow',
        category: 'therapeutic',
        description: 'Gentle movements to restore energy and peace',
        techniques: [
          { name: 'Seated Movements', instruction: 'Upper body movements while seated' },
          { name: 'Breath Coordination', instruction: 'Coordinate gentle movement with breath' },
          { name: 'Joint Mobility', instruction: 'Gentle joint circles and stretches' },
          { name: 'Energy Cultivation', instruction: 'Slow movements to build energy' }
        ],
        culturalBackground: null,
        therapeuticApplications: ['energy_restoration', 'gentle_activation', 'stress_relief'],
        contraindications: ['none_with_modifications']
      });
    }

    // Martial arts-inspired for strength and grounding
    if (currentEmotionalState.intensity > 7 && currentEmotionalState.energyLevel > 5) {
      movementTypes.push({
        typeId: 'martial_flow',
        name: 'Grounding Martial Arts Flow',
        category: 'martial_arts',
        description: 'Build strength and grounding through martial arts principles',
        techniques: [
          { name: 'Centering Stance', instruction: 'Strong, rooted standing positions' },
          { name: 'Flowing Forms', instruction: 'Slow, controlled martial arts movements' },
          { name: 'Energy Direction', instruction: 'Direct emotional energy through movement' },
          { name: 'Balance Integration', instruction: 'Static and dynamic balance poses' }
        ],
        culturalBackground: 'Universal martial principles',
        therapeuticApplications: ['grounding', 'emotional_regulation', 'empowerment'],
        contraindications: ['joint_problems', 'balance_issues']
      });
    }

    return movementTypes.filter(type => 
      !accessibilityNeeds?.mobilityLimitations.some(limitation => 
        type.contraindications.includes(limitation)
      )
    );
  }, [currentEmotionalState, culturalContext, accessibilityNeeds]);

  // Create seasonal ritual
  const createSeasonalRitual = (season: string): RitualType | null => {
    const seasonalRituals = {
      spring: {
        typeId: 'spring_renewal',
        name: 'Spring Renewal Ceremony',
        tradition: 'seasonal',
        description: 'Celebrate new growth and emotional renewal',
        components: [
          { name: 'Old Pattern Release', duration: 10, description: 'Release what no longer serves' },
          { name: 'New Growth Intention', duration: 10, description: 'Plant seeds of new patterns' },
          { name: 'Energy Awakening', duration: 15, description: 'Awaken new life energy' },
          { name: 'Gratitude for Growth', duration: 10, description: 'Appreciate growth potential' }
        ]
      },
      summer: {
        typeId: 'summer_expansion',
        name: 'Summer Expansion Ritual',
        tradition: 'seasonal',
        description: 'Embrace full expression and emotional expansion',
        components: [
          { name: 'Light Invocation', duration: 8, description: 'Call upon light energy' },
          { name: 'Full Expression', duration: 15, description: 'Express emotions fully' },
          { name: 'Community Connection', duration: 12, description: 'Feel connection to others' },
          { name: 'Joy Celebration', duration: 10, description: 'Celebrate life and growth' }
        ]
      },
      fall: {
        typeId: 'autumn_harvest',
        name: 'Autumn Wisdom Harvest',
        tradition: 'seasonal',
        description: 'Harvest wisdom from emotional experiences',
        components: [
          { name: 'Experience Review', duration: 12, description: 'Review emotional journey' },
          { name: 'Wisdom Extraction', duration: 15, description: 'Extract learning and wisdom' },
          { name: 'Gratitude Gathering', duration: 10, description: 'Gather gratitude for growth' },
          { name: 'Preparation Rest', duration: 8, description: 'Prepare for rest and reflection' }
        ]
      },
      winter: {
        typeId: 'winter_reflection',
        name: 'Winter Reflection Ceremony',
        tradition: 'seasonal',
        description: 'Deep reflection and inner exploration',
        components: [
          { name: 'Inner Journey', duration: 15, description: 'Journey inward for reflection' },
          { name: 'Shadow Integration', duration: 15, description: 'Work with difficult emotions' },
          { name: 'Rest Permission', duration: 10, description: 'Give permission for rest' },
          { name: 'Hope Cultivation', duration: 10, description: 'Cultivate hope for renewal' }
        ]
      }
    };

    const ritual = seasonalRituals[season as keyof typeof seasonalRituals];
    if (!ritual) return null;

    return {
      ...ritual,
      culturalConsiderations: ['Adaptable to personal seasonal connection'],
      adaptations: [
        { context: 'opposite_hemisphere', modification: 'Adapt to local seasonal energy' },
        { context: 'indoor', modification: 'Use visualization and symbolic elements' }
      ]
    };
  };

  // Design custom ritual based on selections
  const designCustomRitual = useCallback(() => {
    if (!selectedRitualType || !selectedMovementType) return;

    const design: RitualDesign = {
      elements: [],
      movements: [],
      culturalAdaptations: [],
      accessibilityModifications: [],
      estimatedDuration: intentionSetting.timeAvailable,
      materials: [],
      safetyConsiderations: []
    };

    // Add ritual elements
    selectedRitualType.components.forEach((component, index) => {
      design.elements.push({
        elementId: `element_${index}`,
        name: component.name,
        description: component.description,
        duration: component.duration,
        phase: index === 0 ? 'opening' : 
               index === selectedRitualType.components.length - 1 ? 'closing' : 'main',
        culturalSignificance: selectedRitualType.tradition,
        personalAdaptation: '',
        materials: [],
        instructions: []
      });
    });

    // Add movement sequences
    design.movements.push({
      sequenceId: 'main_movement',
      name: selectedMovementType.name,
      description: selectedMovementType.description,
      duration: Math.floor(intentionSetting.timeAvailable * 0.4), // 40% of time
      intensity: accessibilityNeeds?.energyLevel === 'low' ? 'gentle' : 
                 currentEmotionalState.intensity > 7 ? 'dynamic' : 'moderate',
      movements: selectedMovementType.techniques.map((technique, index) => ({
        instructionId: `movement_${index}`,
        instruction: technique.instruction,
        duration: Math.floor((intentionSetting.timeAvailable * 0.4) / selectedMovementType.techniques.length),
        cues: [technique.name],
        breathingPattern: 'natural',
        modifications: []
      })),
      emotionalFocus: [currentEmotionalState.primaryEmotion],
      physicalBenefits: selectedMovementType.therapeuticApplications,
      contraindications: selectedMovementType.contraindications,
      culturalOrigin: selectedMovementType.culturalBackground
    });

    // Add cultural adaptations
    if (culturalContext.ritualTraditions.length > 0) {
      design.culturalAdaptations = culturalContext.ritualTraditions.map(tradition => ({
        tradition,
        adaptation: `Incorporate ${tradition} elements respectfully`,
        significance: 'Cultural connection and honoring'
      }));
    }

    // Add accessibility modifications
    if (accessibilityNeeds) {
      design.accessibilityModifications = [
        ...accessibilityNeeds.mobilityLimitations.map(limitation => ({
          need: limitation,
          modification: getAccessibilityModification(limitation),
          alternatives: []
        })),
        ...accessibilityNeeds.sensoryConsiderations.map(consideration => ({
          need: consideration,
          modification: getSensoryModification(consideration),
          alternatives: []
        }))
      ];
    }

    // Suggest materials
    design.materials = [
      { item: 'Comfortable seating or mat', required: true, alternatives: ['Chair', 'Cushion', 'Blanket'] },
      { item: 'Water for hydration', required: true, alternatives: ['Any beverage'] },
      { item: 'Journal for reflection', required: false, alternatives: ['Phone notes', 'Mental noting'] },
      { item: 'Candle or soft lighting', required: false, alternatives: ['Lamp', 'Natural light'] },
      { item: 'Meaningful object', required: false, alternatives: ['Photo', 'Stone', 'Jewelry'] }
    ];

    // Safety considerations
    design.safetyConsiderations = [
      { consideration: 'Physical limits', guidance: 'Only move within comfortable range' },
      { consideration: 'Emotional intensity', guidance: 'Take breaks if emotions become overwhelming' },
      { consideration: 'Cultural sensitivity', guidance: 'Honor your cultural background respectfully' },
      { consideration: 'Privacy needs', guidance: 'Ensure you have the privacy level you need' }
    ];

    setRitualDesign(design);
  }, [selectedRitualType, selectedMovementType, intentionSetting, accessibilityNeeds, culturalContext, currentEmotionalState]);

  // Helper functions for accessibility
  const getAccessibilityModification = (limitation: string): string => {
    const modifications = {
      'wheelchair_user': 'All movements adapted for seated position',
      'limited_mobility': 'Gentle, small range movements only',
      'chronic_pain': 'Movement optional, focus on breath and intention',
      'balance_issues': 'Seated or supported movements only',
      'joint_problems': 'No weight-bearing or twisting movements'
    };
    return modifications[limitation as keyof typeof modifications] || 'Modified as needed';
  };

  const getSensoryModification = (consideration: string): string => {
    const modifications = {
      'light_sensitivity': 'Dim lighting or eyes closed options',
      'sound_sensitivity': 'Silent or very soft audio options',
      'touch_sensitivity': 'No physical contact requirements',
      'visual_impairment': 'Audio guidance and tactile alternatives',
      'hearing_impairment': 'Visual cues and written instructions'
    };
    return modifications[consideration as keyof typeof modifications] || 'Adapted as needed';
  };

  // Execute ritual session
  const startRitualSession = useCallback(() => {
    if (!ritualDesign) return;

    sessionStartRef.current = new Date();
    setCurrentPhase('preparation');
    setSessionProgress(prev => ({ ...prev, currentStep: 0, totalSteps: ritualDesign.elements.length }));

    // Guide through phases
    let currentElementIndex = 0;
    
    const nextPhase = () => {
      if (currentElementIndex >= ritualDesign.elements.length) {
        completeRitualSession();
        return;
      }

      const element = ritualDesign.elements[currentElementIndex];
      setCurrentPhase(element.phase as any);
      setSessionProgress(prev => ({ ...prev, currentStep: currentElementIndex + 1 }));

      // Auto-advance after element duration
      phaseTimerRef.current = setTimeout(() => {
        currentElementIndex++;
        nextPhase();
      }, element.duration * 60 * 1000);
    };

    // Start first phase after preparation
    setTimeout(nextPhase, 3000);
  }, [ritualDesign]);

  const completeRitualSession = () => {
    const endTime = new Date();
    const duration = sessionStartRef.current ? 
      (endTime.getTime() - sessionStartRef.current.getTime()) / 1000 / 60 : 0;

    if (!selectedRitualType || !ritualDesign) return;

    const ritualSession: RitualSession = {
      sessionId: `ritual_${userId}_${Date.now()}`,
      ritualType: selectedRitualType,
      duration,
      intention: {
        primaryIntention: intentionSetting.emotionToTransform,
        secondaryIntentions: intentionSetting.healingFocus,
        personalMeaning: intentionSetting.desiredOutcome,
        culturalContext: culturalContext.primaryCulture,
        spiritualAspect: null
      },
      preparation: {
        spaceClearing: true,
        materialGathering: true,
        intentionSetting: true,
        energeticPreparation: true
      },
      opening: {
        invocations: [],
        boundaryCreation: true,
        elementalCalling: environmentalFactors ? true : false,
        ancestralConnection: culturalContext.ritualTraditions.includes('ancestor_honoring')
      },
      mainPractice: {
        coreActivities: ritualDesign.elements.map(element => ({
          activity: element.name,
          duration: element.duration,
          effectiveness: experienceTracking.transformationDepth / 10
        })),
        movementIntegration: ritualDesign.movements.length > 0,
        emotionalProcessing: true,
        energeticWork: true
      },
      integration: {
        experienceProcessing: true,
        wisdomExtraction: experienceTracking.insights.length > 0,
        energeticIntegration: true,
        groundingActivities: true
      },
      closing: {
        gratitudeExpression: true,
        energeticSealing: true,
        elementalReleasing: true,
        spaceClosure: true
      },
      elements: [],
      tools: [],
      offerings: [],
      symbols: [],
      culturalTradition: culturalContext.ritualTraditions.length > 0 ? {
        tradition: culturalContext.ritualTraditions[0],
        adaptations: [],
        respectfulPractice: true,
        elderGuidance: false
      } : null,
      spiritualFramework: null,
      ancestralHonoring: [],
      emotionToTransform: intentionSetting.emotionToTransform,
      transformationProcess: [],
      alchemicalElements: [],
      symbolicActions: [],
      witnesses: [],
      communitySupport: [],
      sharingCircle: null,
      naturalElements: [],
      seasonalAlignment: environmentalFactors?.season ? {
        season: environmentalFactors.season,
        energyAlignment: true,
        seasonalWisdom: [],
        naturalCycles: true
      } : null,
      lunarPhase: environmentalFactors?.lunarPhase || 'unknown',
      locationEnergy: {
        energeticQuality: 'healing',
        sacredAspects: [],
        naturalConnection: environmentalFactors?.location === 'outdoor'
      },
      transformationAchieved: experienceTracking.transformationDepth / 10,
      spiritualConnection: experienceTracking.culturalResonance / 10,
      communityConnection: 0.5,
      healingOccurred: [],
      wisdomReceived: [],
      dailyPractices: [],
      weeklyPractices: [],
      seasonalPractices: [],
      effectiveness: experienceTracking.transformationDepth / 10,
      meaningfulness: experienceTracking.culturalResonance / 10,
      culturalResonance: experienceTracking.culturalResonance / 10,
      accessibilityAdaptations: []
    };

    onRitualComplete?.(ritualSession);
  };

  // Get available ritual and movement types
  const ritualTypes = getCulturalRitualTypes();
  const movementTypes = getMovementTherapyTypes();

  // Auto-design when both types are selected
  useEffect(() => {
    if (selectedRitualType && selectedMovementType) {
      designCustomRitual();
    }
  }, [selectedRitualType, selectedMovementType, designCustomRitual]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-800 mb-2">
          Ritual & Movement Therapy
        </h2>
        <p className="text-gray-600">
          Transform emotions through sacred ritual and healing movement
        </p>
      </div>

      {/* Cultural Acknowledgment */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-medium text-purple-800 mb-2">Cultural Respect & Awareness</h3>
        <p className="text-purple-700 text-sm">
          These practices honor universal principles of healing while respecting cultural traditions. 
          We approach all practices with reverence and avoid appropriation by focusing on your own 
          cultural background and universal healing wisdom.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200 overflow-x-auto">
        {['design', 'ritual', 'movement', 'integration'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'design' && 'Design Practice'}
            {tab === 'ritual' && 'Ritual Elements'}
            {tab === 'movement' && 'Movement Therapy'}
            {tab === 'integration' && 'Integration'}
          </button>
        ))}
      </div>

      {/* Design Tab */}
      {activeTab === 'design' && (
        <div className="space-y-6">
          {/* Intention Setting */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-3">Your Intention</h3>
            <div className="space-y-2 text-blue-700 text-sm">
              <p><strong>Emotion to Transform:</strong> {intentionSetting.emotionToTransform}</p>
              <p><strong>Desired Outcome:</strong> {intentionSetting.desiredOutcome}</p>
              <p><strong>Healing Focus:</strong> {intentionSetting.healingFocus.join(', ')}</p>
              <p><strong>Time Available:</strong> {intentionSetting.timeAvailable} minutes</p>
            </div>
          </div>

          {/* Ritual Type Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Choose Ritual Type</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {ritualTypes.map((ritual) => (
                <div 
                  key={ritual.typeId}
                  onClick={() => setSelectedRitualType(ritual)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRitualType?.typeId === ritual.typeId
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{ritual.name}</h4>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                      {ritual.tradition}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{ritual.description}</p>
                  
                  <div className="space-y-1">
                    {ritual.components.slice(0, 3).map((component, index) => (
                      <div key={index} className="flex justify-between text-xs text-gray-500">
                        <span>{component.name}</span>
                        <span>{component.duration} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Movement Type Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Choose Movement Type</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {movementTypes.map((movement) => (
                <div 
                  key={movement.typeId}
                  onClick={() => setSelectedMovementType(movement)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMovementType?.typeId === movement.typeId
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{movement.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      movement.category === 'somatic' ? 'bg-green-100 text-green-800' :
                      movement.category === 'expressive' ? 'bg-orange-100 text-orange-800' :
                      movement.category === 'cultural' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {movement.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{movement.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {movement.therapeuticApplications.slice(0, 3).map((application) => (
                      <span 
                        key={application}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {application.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Practice Button */}
          {selectedRitualType && selectedMovementType && ritualDesign && (
            <div className="text-center">
              <button
                onClick={startRitualSession}
                className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Begin Sacred Practice ({ritualDesign.estimatedDuration} min)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ritual Tab */}
      {activeTab === 'ritual' && ritualDesign && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Ritual Elements</h3>
          
          {/* Current Phase Indicator */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-purple-800">Current Phase: {currentPhase}</h4>
              <span className="text-purple-600 text-sm">
                Step {sessionProgress.currentStep} of {sessionProgress.totalSteps}
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(sessionProgress.currentStep / sessionProgress.totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Ritual Elements */}
          <div className="space-y-4">
            {ritualDesign.elements.map((element, index) => (
              <div 
                key={element.elementId}
                className={`p-4 border rounded-lg ${
                  sessionProgress.currentStep - 1 === index
                    ? 'border-purple-500 bg-purple-50'
                    : sessionProgress.currentStep > index
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{element.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{element.duration} min</span>
                    {sessionProgress.currentStep > index && (
                      <span className="text-green-600">✓</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{element.description}</p>
              </div>
            ))}
          </div>

          {/* Materials Needed */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-3">Materials & Preparation</h4>
            <div className="space-y-2">
              {ritualDesign.materials.map((material, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className={material.required ? 'text-yellow-800 font-medium' : 'text-yellow-700'}>
                    {material.item} {material.required && '*'}
                  </span>
                  <span className="text-yellow-600 text-xs">
                    {material.alternatives.join(', ')}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-yellow-600 text-xs mt-2">* Required items</p>
          </div>
        </div>
      )}

      {/* Movement Tab */}
      {activeTab === 'movement' && ritualDesign && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Movement Sequences</h3>
          
          {ritualDesign.movements.map((sequence) => (
            <div key={sequence.sequenceId} className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">{sequence.name}</h4>
                <p className="text-green-700 text-sm mb-3">{sequence.description}</p>
                <div className="flex space-x-4 text-sm">
                  <span className="text-green-600">Duration: {sequence.duration} min</span>
                  <span className="text-green-600">Intensity: {sequence.intensity}</span>
                </div>
              </div>

              {/* Movement Instructions */}
              <div className="space-y-3">
                {sequence.movements.map((movement, index) => (
                  <div key={movement.instructionId} className="p-3 border border-gray-200 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-800">{movement.cues[0]}</h5>
                      <span className="text-sm text-gray-500">{movement.duration} min</span>
                    </div>
                    <p className="text-gray-600 text-sm">{movement.instruction}</p>
                  </div>
                ))}
              </div>

              {/* Safety & Modifications */}
              {ritualDesign.accessibilityModifications.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Your Modifications</h5>
                  <div className="space-y-1">
                    {ritualDesign.accessibilityModifications.map((mod, index) => (
                      <div key={index} className="text-blue-700 text-sm">
                        <strong>{mod.need}:</strong> {mod.modification}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Integration Tab */}
      {activeTab === 'integration' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Integration & Reflection</h3>
          
          {/* Experience Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transformation Depth (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={experienceTracking.transformationDepth}
                onChange={(e) => setExperienceTracking(prev => ({
                  ...prev,
                  transformationDepth: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {experienceTracking.transformationDepth}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cultural Resonance (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={experienceTracking.culturalResonance}
                onChange={(e) => setExperienceTracking(prev => ({
                  ...prev,
                  culturalResonance: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {experienceTracking.culturalResonance}
              </div>
            </div>
          </div>

          {/* Experience Categories */}
          <div className="space-y-4">
            {/* Physical Sensations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Physical Sensations Noticed:
              </label>
              <div className="flex flex-wrap gap-2">
                {['relaxation', 'energy_flow', 'tension_release', 'grounding', 'warmth', 'lightness'].map((sensation) => (
                  <button
                    key={sensation}
                    onClick={() => setExperienceTracking(prev => ({
                      ...prev,
                      physicalSensations: prev.physicalSensations.includes(sensation)
                        ? prev.physicalSensations.filter(s => s !== sensation)
                        : [...prev.physicalSensations, sensation]
                    }))}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      experienceTracking.physicalSensations.includes(sensation)
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {sensation.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Emotional Releases */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emotional Releases or Shifts:
              </label>
              <div className="flex flex-wrap gap-2">
                {['catharsis', 'relief', 'joy', 'peace', 'empowerment', 'clarity', 'compassion'].map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => setExperienceTracking(prev => ({
                      ...prev,
                      emotionalReleases: prev.emotionalReleases.includes(emotion)
                        ? prev.emotionalReleases.filter(e => e !== emotion)
                        : [...prev.emotionalReleases, emotion]
                    }))}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      experienceTracking.emotionalReleases.includes(emotion)
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            {/* Spiritual Connections */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spiritual or Cultural Connections:
              </label>
              <div className="flex flex-wrap gap-2">
                {['ancestral_presence', 'cultural_pride', 'universal_connection', 'nature_unity', 'divine_connection', 'community_spirit'].map((connection) => (
                  <button
                    key={connection}
                    onClick={() => setExperienceTracking(prev => ({
                      ...prev,
                      spiritualConnections: prev.spiritualConnections.includes(connection)
                        ? prev.spiritualConnections.filter(c => c !== connection)
                        : [...prev.spiritualConnections, connection]
                    }))}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      experienceTracking.spiritualConnections.includes(connection)
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {connection.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Complete Session */}
          <div className="text-center">
            <button
              onClick={completeRitualSession}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete & Save Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RitualMovementTherapy;