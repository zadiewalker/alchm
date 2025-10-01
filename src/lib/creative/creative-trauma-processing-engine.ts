/**
 * ALCHM Creative Trauma Processing Engine
 * Revolutionary art therapy and creative healing system for trauma-informed identity development
 * Philosophy: "Creativity transforms trauma into wisdom, pain into beauty, wounds into gifts"
 */

import { QuantumEmotionalState } from '@/lib/advanced-emotional-intelligence';
import { CreativeModality, CreativeExpressionResult } from '@/lib/pathways/creative-expression-pathways';
import { CulturalContext } from '@/types/pathways-schema';

// Trauma-Informed Creative Processing Types
export interface TraumaProcessingMarkers {
  // Core trauma responses
  hypervigilanceMarkers: {
    sensoryOverwhelm: number;          // 0-1 sensitivity to sensory input
    controlNeeds: number;              // Need for control in creative process
    safetyChecking: number;            // Frequent safety assessment behaviors
    hyperfocus: number;                // Intense focus as protection mechanism
  };
  
  dissociationMarkers: {
    bodyDisconnection: number;         // Disconnection from somatic experience
    timeDistortion: number;            // Altered time perception during creativity
    emotionalNumbing: number;          // Reduced emotional access/expression
    observerSelf: number;              // Watching self from outside perspective
  };
  
  reexperiencingMarkers: {
    intrusiveImagery: number;          // Unwanted traumatic imagery in creative work
    flashbackTriggers: number;         // Creative process triggering trauma memories
    emotionalFlooding: number;         // Overwhelming emotional activation
    somaticReactivation: number;       // Body memories activated through creation
  };
  
  avoidanceMarkers: {
    creativeTopic: number;             // Avoiding certain creative themes/subjects
    emotionalDepth: number;            // Avoiding deep emotional exploration
    vulnerabilityResistance: number;   // Resistance to authentic expression
    intimacyFear: number;             // Fear of being truly seen through art
  };
  
  // Healing indicators
  postTraumaticGrowth: {
    meaningMaking: number;             // Creating meaning from difficult experiences
    relationshipDeepening: number;     // Enhanced capacity for connection
    spiritualDevelopment: number;      // Expanded spiritual/existential awareness
    personalStrength: number;          // Recognition of resilience and power
    appreciationOfLife: number;        // Enhanced gratitude and presence
  };
}

// Creative Trauma Processing Session
export interface CreativeTraumaSession {
  id: string;
  userId: string;
  sessionType: 
    | 'stabilization'        // Building safety and resources
    | 'processing'           // Working through traumatic material
    | 'integration'          // Integrating insights and healing
    | 'post_traumatic_growth'; // Meaning-making and wisdom extraction
  
  traumaProcessingGoals: {
    establishSafety: boolean;
    processEmotions: boolean;
    integrateFragments: boolean;
    buildResilience: boolean;
    createMeaning: boolean;
  };
  
  creativeModalities: {
    modality: CreativeModality;
    traumaInformedAdaptations: string[];
    safetyProtocols: string[];
    titrationMethods: string[];        // Ways to work with trauma in small doses
    resourceAnchors: string[];         // Positive resources to return to
  }[];
  
  traumaResponsesObserved: TraumaProcessingMarkers;
  healingIndicators: {
    nervousSystemRegulation: number;   // Improved self-regulation
    emotionalRange: number;            // Expanded emotional expression
    somaticIntegration: number;        // Body-mind connection healing
    narrativeCoherence: number;        // Coherent story of experience
    empowermentSense: number;         // Sense of agency and power
  };
  
  safetyInterventions: Array<{
    trigger: string;
    intervention: string;
    effectiveness: number;
    timestamp: Date;
  }>;
  
  therapeuticBreakthroughs: Array<{
    type: 'insight' | 'emotional_release' | 'somatic_shift' | 'meaning_making';
    description: string;
    significance: number;
    integrationNeeded: string[];
  }>;
  
  timestamp: Date;
  duration: number;
  traumaInformedPractitionerNotes?: string;
}

// Art Therapy Trauma Processing Techniques
export interface ArtTherapyTechnique {
  name: string;
  traumaType: 'complex' | 'single_incident' | 'developmental' | 'intergenerational';
  developmentalStage: 'child' | 'adolescent' | 'adult' | 'elder';
  culturalAdaptations: Record<string, string>;
  
  technique: {
    setup: string[];                   // How to prepare for the technique
    process: string[];                 // Step-by-step process
    integration: string[];             // How to integrate the experience
    safetyConsiderations: string[];    // Important safety considerations
  };
  
  expectedOutcomes: {
    immediateRelief: number;           // Immediate symptom reduction
    longTermHealing: number;           // Long-term therapeutic benefit
    empowerment: number;              // Sense of agency and control
    meaningMaking: number;            // Narrative transformation potential
  };
  
  contraindications: string[];         // When NOT to use this technique
  supervision: 'self_guided' | 'peer_support' | 'professional_required';
}

// Somatic Creative Processing
export interface SomaticCreativeProcessing {
  bodyAwarenessTracking: {
    preCreativeSession: {
      tensionAreas: string[];
      energyLevel: number;
      breathingPattern: 'shallow' | 'deep' | 'irregular' | 'held';
      emotionalSomaticState: string;
    };
    duringCreativeSession: {
      somaticShifts: Array<{
        timestamp: number;             // Minutes into session
        shiftDescription: string;
        bodyArea: string;
        shiftType: 'tension_release' | 'energy_increase' | 'grounding' | 'activation';
      }>;
      breathingChanges: string[];
      emotionalMovement: string[];
    };
    postCreativeSession: {
      integrationLevel: number;
      residualActivation: number;
      groundingNeeded: number;
      selfCareRequired: string[];
    };
  };
  
  traumaInformedMovementPrinciples: {
    choiceAndControl: string[];        // Ways to maintain agency
    invitationNotCommand: string[];    // Invitational language examples
    slowAndGentle: string[];          // Pacing considerations
    orientationToSafety: string[];    // Safety-building practices
  };
}

/**
 * Creative Trauma Processing Engine
 */
export class CreativeTraumaProcessingEngine {
  private artTherapyTechniques: Map<string, ArtTherapyTechnique> = new Map();
  private userTraumaProfiles: Map<string, TraumaProcessingMarkers> = new Map();
  private sessionHistory: Map<string, CreativeTraumaSession[]> = new Map();

  constructor() {
    this.initializeArtTherapyTechniques();
  }

  /**
   * Analyze healing markers from creative work
   */
  async analyzeHealingMarkers(
    creativeWork: CreativeExpressionResult['creativeWork'],
    emotionalJourney: string[],
    culturalContext: CulturalContext
  ): Promise<CreativeExpressionResult['traumaHealingMarkers']> {
    
    // Analyze creative content for trauma processing indicators
    const contentAnalysis = await this.analyzeCreativeContent(
      creativeWork.description,
      creativeWork.type,
      emotionalJourney
    );
    
    // Assess shame reduction through vulnerability expression
    const shameReduction = this.assessShameReduction(
      creativeWork,
      emotionalJourney,
      culturalContext
    );
    
    // Evaluate body reconnection through creative embodiment
    const bodyReconnection = this.assessBodyReconnection(
      creativeWork,
      emotionalJourney
    );
    
    // Measure emotional expression expansion
    const emotionalExpression = this.assessEmotionalExpression(
      emotionalJourney,
      creativeWork.description
    );
    
    // Evaluate identity integration through creative synthesis
    const identityIntegration = this.assessIdentityIntegration(
      creativeWork,
      emotionalJourney
    );
    
    return {
      shameReduction,
      bodyReconnection,
      emotionalExpression,
      identityIntegration
    };
  }

  /**
   * Design trauma-informed creative session
   */
  async designTraumaInformedSession(
    userId: string,
    traumaMarkers: TraumaProcessingMarkers,
    sessionGoals: CreativeTraumaSession['traumaProcessingGoals'],
    availableModalities: CreativeModality[],
    culturalContext: CulturalContext
  ): Promise<{
    sessionPlan: CreativeTraumaSession;
    safetyProtocols: string[];
    resourceBuilding: string[];
    titrationGuidance: string[];
  }> {
    
    // Determine session type based on trauma markers and goals
    const sessionType = this.determineSessionType(traumaMarkers, sessionGoals);
    
    // Select culturally responsive modalities
    const selectedModalities = await this.selectTraumaInformedModalities(
      availableModalities,
      traumaMarkers,
      culturalContext
    );
    
    // Create session plan
    const sessionPlan: CreativeTraumaSession = {
      id: `trauma_session_${Date.now()}`,
      userId,
      sessionType,
      traumaProcessingGoals: sessionGoals,
      creativeModalities: selectedModalities,
      traumaResponsesObserved: traumaMarkers,
      healingIndicators: {
        nervousSystemRegulation: 0,
        emotionalRange: 0,
        somaticIntegration: 0,
        narrativeCoherence: 0,
        empowermentSense: 0
      },
      safetyInterventions: [],
      therapeuticBreakthroughs: [],
      timestamp: new Date(),
      duration: 0
    };
    
    // Generate safety protocols
    const safetyProtocols = await this.generateSafetyProtocols(
      traumaMarkers,
      selectedModalities,
      culturalContext
    );
    
    // Create resource building practices
    const resourceBuilding = await this.generateResourceBuilding(
      traumaMarkers,
      culturalContext
    );
    
    // Provide titration guidance
    const titrationGuidance = await this.generateTitrationGuidance(
      sessionType,
      traumaMarkers
    );
    
    return {
      sessionPlan,
      safetyProtocols,
      resourceBuilding,
      titrationGuidance
    };
  }

  /**
   * Process trauma-informed creative session results
   */
  async processTraumaSession(
    sessionId: string,
    userId: string,
    creativeOutput: CreativeExpressionResult['creativeWork'][],
    somaticExperience: SomaticCreativeProcessing,
    safetyIncidents: Array<{ trigger: string; response: string }>,
    therapeuticShifts: Array<{ type: string; description: string }>
  ): Promise<{
    healingAssessment: CreativeTraumaSession['healingIndicators'];
    integrationRecommendations: string[];
    safetyAdjustments: string[];
    nextSessionPlanning: string[];
  }> {
    
    // Assess healing indicators from session
    const healingAssessment = await this.assessSessionHealing(
      creativeOutput,
      somaticExperience,
      therapeuticShifts
    );
    
    // Generate integration recommendations
    const integrationRecommendations = await this.generateIntegrationRecommendations(
      healingAssessment,
      therapeuticShifts,
      somaticExperience
    );
    
    // Assess and adjust safety protocols
    const safetyAdjustments = await this.generateSafetyAdjustments(
      safetyIncidents,
      healingAssessment
    );
    
    // Plan next session
    const nextSessionPlanning = await this.generateNextSessionPlan(
      healingAssessment,
      safetyIncidents.length,
      therapeuticShifts
    );
    
    // Store session results
    const userSessions = this.sessionHistory.get(userId) || [];
    const session = userSessions.find(s => s.id === sessionId);
    if (session) {
      session.healingIndicators = healingAssessment;
      session.duration = Date.now() - session.timestamp.getTime();
    }
    
    return {
      healingAssessment,
      integrationRecommendations,
      safetyAdjustments,
      nextSessionPlanning
    };
  }

  /**
   * Generate trauma-informed art therapy techniques
   */
  async generateArtTherapyTechniques(
    traumaType: ArtTherapyTechnique['traumaType'],
    culturalContext: CulturalContext,
    availableModalities: CreativeModality[]
  ): Promise<ArtTherapyTechnique[]> {
    
    const techniques: ArtTherapyTechnique[] = [];
    const culturalCode = culturalContext.primaryLanguage;
    
    // Container Technique - for stabilization
    if (availableModalities.includes('visual')) {
      techniques.push({
        name: 'Sacred Container Creation',
        traumaType,
        developmentalStage: 'adult',
        culturalAdaptations: {
          'en': 'Create a visual container for difficult emotions using colors, shapes, and symbols',
          'es': 'Crear un contenedor sagrado para emociones difíciles usando colores y símbolos',
          'ko': '색깔과 상징을 사용하여 어려운 감정을 위한 성스러운 그릇 만들기'
        },
        technique: {
          setup: [
            'Gather art materials that feel safe and grounding',
            'Create physical and emotional safety in space',
            'Set intention for containing difficult emotions safely'
          ],
          process: [
            'Draw or paint the outline of a container (bowl, box, sacred vessel)',
            'Fill container with colors representing difficult emotions',
            'Add protective symbols or barriers around the container',
            'Create a lid or closing for the container',
            'Add grounding elements (earth symbols, roots, stability)'
          ],
          integration: [
            'Reflect on what it feels like to contain difficult emotions safely',
            'Identify what helps create safety and containment in daily life',
            'Practice returning to the container image when overwhelmed'
          ],
          safetyConsiderations: [
            'Stop if overwhelming emotions arise without ability to contain',
            'Use grounding techniques if dissociation occurs',
            'Ensure emotional support is available after session'
          ]
        },
        expectedOutcomes: {
          immediateRelief: 0.7,
          longTermHealing: 0.6,
          empowerment: 0.8,
          meaningMaking: 0.5
        },
        contraindications: [
          'Active psychosis',
          'Severe dissociative episodes',
          'Acute suicidal ideation'
        ],
        supervision: 'self_guided'
      });
    }
    
    // Bilateral Processing Technique - for trauma processing
    if (availableModalities.includes('kinesthetic') && availableModalities.includes('visual')) {
      techniques.push({
        name: 'Bilateral Creative Processing',
        traumaType,
        developmentalStage: 'adult',
        culturalAdaptations: {
          'en': 'Use alternating movement and visual creation to process traumatic memories',
          'es': 'Usar movimiento alternante y creación visual para procesar memorias traumáticas',
          'ko': '교대로 하는 움직임과 시각적 창작을 통해 트라우마 기억 처리하기'
        },
        technique: {
          setup: [
            'Establish bilateral movement pattern (walking, arm swinging)',
            'Prepare art materials for quick expression',
            'Create safety plan for overwhelm'
          ],
          process: [
            'Begin with bilateral movement to activate both brain hemispheres',
            'Allow traumatic material to surface gently while moving',
            'Move to art creation, continuing bilateral awareness',
            'Create images that represent both trauma and healing',
            'Return to bilateral movement for integration'
          ],
          integration: [
            'Notice how bilateral processing affects emotional intensity',
            'Identify insights about trauma and resilience',
            'Plan ongoing bilateral practices for regulation'
          ],
          safetyConsiderations: [
            'Work in titrated doses - small amounts of traumatic material',
            'Maintain bilateral stimulation throughout',
            'Stop and ground if overwhelm occurs'
          ]
        },
        expectedOutcomes: {
          immediateRelief: 0.6,
          longTermHealing: 0.8,
          empowerment: 0.7,
          meaningMaking: 0.6
        },
        contraindications: [
          'Severe dissociative disorders without stabilization',
          'Recent traumatic event (within 48 hours)',
          'Active substance use affecting cognitive function'
        ],
        supervision: 'peer_support'
      });
    }
    
    // Narrative Reconstruction - for integration
    if (availableModalities.includes('linguistic')) {
      techniques.push({
        name: 'Healing Story Reconstruction',
        traumaType,
        developmentalStage: 'adult',
        culturalAdaptations: {
          'en': 'Rewrite traumatic narrative emphasizing survival, strength, and growth',
          'es': 'Reescribir la narrativa traumática enfatizando supervivencia, fuerza y crecimiento',
          'ko': '생존, 강점, 성장을 강조하여 트라우마 서사 다시 쓰기'
        },
        technique: {
          setup: [
            'Identify traumatic narrative that needs reconstruction',
            'Gather evidence of strength and resilience',
            'Set intention for empowered storytelling'
          ],
          process: [
            'Write original traumatic story briefly and factually',
            'Identify moments of choice, strength, and survival',
            'Rewrite story emphasizing agency and resilience',
            'Add insights about growth and wisdom gained',
            'Create empowered ending or ongoing chapter'
          ],
          integration: [
            'Read both versions and notice emotional differences',
            'Identify which story feels more true and empowering',
            'Practice telling empowered version to trusted others'
          ],
          safetyConsiderations: [
            'Work with therapist if story involves severe trauma',
            'Balance acknowledging pain with recognizing strength',
            'Avoid minimizing legitimate suffering'
          ]
        },
        expectedOutcomes: {
          immediateRelief: 0.5,
          longTermHealing: 0.8,
          empowerment: 0.9,
          meaningMaking: 0.9
        },
        contraindications: [
          'Unresolved severe trauma without professional support',
          'Tendency toward self-blame without corrective framework'
        ],
        supervision: 'professional_required'
      });
    }
    
    return techniques;
  }

  /**
   * Build somatic creative processing guidance
   */
  async generateSomaticCreativeGuidance(
    traumaMarkers: TraumaProcessingMarkers,
    selectedModality: CreativeModality,
    culturalContext: CulturalContext
  ): Promise<SomaticCreativeProcessing> {
    
    const guidance: SomaticCreativeProcessing = {
      bodyAwarenessTracking: {
        preCreativeSession: {
          tensionAreas: this.identifyTensionAreas(traumaMarkers),
          energyLevel: this.assessEnergyLevel(traumaMarkers),
          breathingPattern: this.assessBreathingPattern(traumaMarkers),
          emotionalSomaticState: this.assessEmotionalSomaticState(traumaMarkers)
        },
        duringCreativeSession: {
          somaticShifts: [],
          breathingChanges: [],
          emotionalMovement: []
        },
        postCreativeSession: {
          integrationLevel: 0,
          residualActivation: 0,
          groundingNeeded: 0,
          selfCareRequired: []
        }
      },
      traumaInformedMovementPrinciples: {
        choiceAndControl: [
          'You can modify any suggestion to fit your body\'s needs',
          'You can pause, slow down, or stop at any time',
          'Your body\'s wisdom guides the process'
        ],
        invitationNotCommand: [
          'Notice if your body wants to...',
          'You might experiment with...',
          'When it feels right, consider...'
        ],
        slowAndGentle: [
          'Move at 50% of your impulse speed',
          'Allow plenty of time between movements',
          'Honor your nervous system\'s pace'
        ],
        orientationToSafety: [
          'Notice what\'s behind you and around you',
          'Feel your feet on the ground',
          'Identify exits and support resources'
        ]
      }
    };
    
    return guidance;
  }

  // Private helper methods

  private initializeArtTherapyTechniques(): void {
    // Initialize with core trauma-informed art therapy techniques
    // This would be expanded with comprehensive technique library
  }

  private async analyzeCreativeContent(
    description: string,
    type: string,
    emotionalJourney: string[]
  ): Promise<{
    traumaProcessingIndicators: string[];
    healingSymbols: string[];
    integrationMarkers: string[];
  }> {
    
    const traumaProcessingIndicators: string[] = [];
    const healingSymbols: string[] = [];
    const integrationMarkers: string[] = [];
    
    // Analyze for trauma processing language
    const traumaLanguage = [
      'release', 'letting go', 'breaking free', 'healing', 'transformation',
      'strength', 'survival', 'resilience', 'overcome', 'integration'
    ];
    
    const lowerDescription = description.toLowerCase();
    for (const word of traumaLanguage) {
      if (lowerDescription.includes(word)) {
        traumaProcessingIndicators.push(`Evidence of ${word} in creative expression`);
      }
    }
    
    // Analyze for healing symbols
    const healingSymbolWords = [
      'light', 'bridge', 'tree', 'water', 'butterfly', 'phoenix',
      'mountain', 'path', 'door', 'key', 'heart', 'wings'
    ];
    
    for (const symbol of healingSymbolWords) {
      if (lowerDescription.includes(symbol)) {
        healingSymbols.push(`${symbol} - representing transformation/growth`);
      }
    }
    
    // Analyze emotional journey for integration
    if (emotionalJourney.length > 2) {
      const journey = emotionalJourney.join(' ').toLowerCase();
      if (journey.includes('difficult') && (journey.includes('peaceful') || journey.includes('strong'))) {
        integrationMarkers.push('Movement from difficulty to resolution/strength');
      }
    }
    
    return { traumaProcessingIndicators, healingSymbols, integrationMarkers };
  }

  private assessShameReduction(
    creativeWork: CreativeExpressionResult['creativeWork'],
    emotionalJourney: string[],
    culturalContext: CulturalContext
  ): number {
    let shameReduction = 0;
    
    // Vulnerability expression indicates shame interruption
    const vulnerabilityMarkers = [
      'vulnerable', 'authentic', 'real', 'honest', 'true', 'open', 'raw'
    ];
    
    const description = creativeWork.description.toLowerCase();
    const vulnerabilityCount = vulnerabilityMarkers.filter(marker => 
      description.includes(marker)
    ).length;
    
    shameReduction += Math.min(0.4, vulnerabilityCount * 0.1);
    
    // Time spent in creative process indicates reduced shame/avoidance
    if (creativeWork.timeSpent > 20) shameReduction += 0.2;
    if (creativeWork.timeSpent > 40) shameReduction += 0.1;
    
    // Emotional range indicates reduced emotional numbing
    const emotionalWords = this.countEmotionalWords(emotionalJourney.join(' '));
    shameReduction += Math.min(0.3, emotionalWords / 10);
    
    return Math.min(1, shameReduction);
  }

  private assessBodyReconnection(
    creativeWork: CreativeExpressionResult['creativeWork'],
    emotionalJourney: string[]
  ): number {
    let bodyReconnection = 0;
    
    // Somatic language indicates body awareness
    const somaticMarkers = [
      'body', 'feel', 'sensation', 'breath', 'heart', 'chest', 'stomach',
      'tension', 'release', 'energy', 'movement', 'grounded', 'centered'
    ];
    
    const allText = (creativeWork.description + ' ' + emotionalJourney.join(' ')).toLowerCase();
    const somaticCount = somaticMarkers.filter(marker => 
      allText.includes(marker)
    ).length;
    
    bodyReconnection += Math.min(0.6, somaticCount * 0.05);
    
    // Movement-based or somatic creative work indicates body connection
    if (creativeWork.type.includes('movement') || creativeWork.type.includes('dance')) {
      bodyReconnection += 0.3;
    }
    
    // Physical engagement with materials
    if (creativeWork.type.includes('physical') || creativeWork.type.includes('tactile')) {
      bodyReconnection += 0.2;
    }
    
    return Math.min(1, bodyReconnection);
  }

  private assessEmotionalExpression(
    emotionalJourney: string[],
    description: string
  ): number {
    let emotionalExpression = 0;
    
    // Range of emotions expressed
    const emotionalWords = this.countUniqueEmotionalWords(
      emotionalJourney.join(' ') + ' ' + description
    );
    emotionalExpression += Math.min(0.5, emotionalWords / 15);
    
    // Depth of emotional expression
    const depthMarkers = [
      'deeply', 'profound', 'intense', 'powerful', 'overwhelming',
      'gentle', 'subtle', 'complex', 'layered', 'nuanced'
    ];
    
    const allText = (description + ' ' + emotionalJourney.join(' ')).toLowerCase();
    const depthCount = depthMarkers.filter(marker => 
      allText.includes(marker)
    ).length;
    
    emotionalExpression += Math.min(0.3, depthCount * 0.1);
    
    // Length and elaboration of emotional journey
    const totalEmotionalWords = emotionalJourney.join(' ').split(' ').length;
    emotionalExpression += Math.min(0.2, totalEmotionalWords / 100);
    
    return Math.min(1, emotionalExpression);
  }

  private assessIdentityIntegration(
    creativeWork: CreativeExpressionResult['creativeWork'],
    emotionalJourney: string[]
  ): number {
    let identityIntegration = 0;
    
    // Self-referential integration language
    const integrationMarkers = [
      'part of me', 'integrate', 'accept', 'whole', 'complete',
      'authentic', 'true self', 'who I am', 'becoming', 'growing'
    ];
    
    const allText = (creativeWork.description + ' ' + emotionalJourney.join(' ')).toLowerCase();
    const integrationCount = integrationMarkers.filter(marker => 
      allText.includes(marker)
    ).length;
    
    identityIntegration += Math.min(0.4, integrationCount * 0.08);
    
    // Complexity and synthesis in creative work
    if (creativeWork.description.length > 100) identityIntegration += 0.2;
    
    // Multiple aspects or perspectives expressed
    const perspectiveMarkers = ['different', 'both', 'also', 'and', 'complex'];
    const perspectiveCount = perspectiveMarkers.filter(marker => 
      allText.includes(marker)
    ).length;
    
    identityIntegration += Math.min(0.3, perspectiveCount * 0.1);
    
    // Future-oriented growth language
    const growthMarkers = ['future', 'will', 'becoming', 'learning', 'developing'];
    const growthCount = growthMarkers.filter(marker => 
      allText.includes(marker)
    ).length;
    
    identityIntegration += Math.min(0.1, growthCount * 0.05);
    
    return Math.min(1, identityIntegration);
  }

  private determineSessionType(
    traumaMarkers: TraumaProcessingMarkers,
    goals: CreativeTraumaSession['traumaProcessingGoals']
  ): CreativeTraumaSession['sessionType'] {
    
    // High hypervigilance or dissociation = stabilization needed
    if (traumaMarkers.hypervigilanceMarkers.sensoryOverwhelm > 0.7 ||
        traumaMarkers.dissociationMarkers.bodyDisconnection > 0.7) {
      return 'stabilization';
    }
    
    // Goals-based determination
    if (goals.establishSafety) return 'stabilization';
    if (goals.processEmotions || goals.integrateFragments) return 'processing';
    if (goals.createMeaning) return 'post_traumatic_growth';
    
    return 'integration';
  }

  private async selectTraumaInformedModalities(
    availableModalities: CreativeModality[],
    traumaMarkers: TraumaProcessingMarkers,
    culturalContext: CulturalContext
  ): Promise<CreativeTraumaSession['creativeModalities']> {
    
    const selected: CreativeTraumaSession['creativeModalities'] = [];
    
    // High dissociation = prioritize embodied modalities
    if (traumaMarkers.dissociationMarkers.bodyDisconnection > 0.6) {
      if (availableModalities.includes('kinesthetic')) {
        selected.push({
          modality: 'kinesthetic',
          traumaInformedAdaptations: [
            'Start with micro-movements',
            'Maintain choice and control',
            'Use invitational language'
          ],
          safetyProtocols: [
            'Check in with body frequently',
            'Stop if dissociation increases',
            'Use grounding techniques as needed'
          ],
          titrationMethods: [
            'Work in 5-minute increments',
            'Alternate movement with stillness',
            'Scale down intensity if overwhelmed'
          ],
          resourceAnchors: [
            'Feel feet on ground',
            'Notice breath',
            'Remember safety in present moment'
          ]
        });
      }
    }
    
    // High avoidance = start with less vulnerable modalities
    if (traumaMarkers.avoidanceMarkers.vulnerabilityResistance > 0.6) {
      if (availableModalities.includes('nature_based')) {
        selected.push({
          modality: 'nature_based',
          traumaInformedAdaptations: [
            'Work with natural materials for grounding',
            'No pressure for personal sharing',
            'Focus on present-moment awareness'
          ],
          safetyProtocols: [
            'Work outdoors or with natural elements',
            'No interpretation required',
            'Honor nervous system responses'
          ],
          titrationMethods: [
            'Brief nature connections',
            'Gentle material exploration',
            'Build safety gradually'
          ],
          resourceAnchors: [
            'Earth connection',
            'Natural beauty',
            'Timeless cycles of growth'
          ]
        });
      }
    }
    
    return selected;
  }

  private async generateSafetyProtocols(
    traumaMarkers: TraumaProcessingMarkers,
    modalities: CreativeTraumaSession['creativeModalities'],
    culturalContext: CulturalContext
  ): Promise<string[]> {
    
    const protocols: string[] = [];
    
    // Universal safety protocols
    protocols.push('Establish clear consent and choice throughout process');
    protocols.push('Maintain awareness of exits and escape routes');
    protocols.push('Use grounding techniques when activation occurs');
    
    // Hypervigilance-specific protocols
    if (traumaMarkers.hypervigilanceMarkers.sensoryOverwhelm > 0.5) {
      protocols.push('Control lighting, sound, and environmental stimulation');
      protocols.push('Provide advance notice of any changes in process');
      protocols.push('Allow for frequent safety checks and breaks');
    }
    
    // Dissociation-specific protocols
    if (traumaMarkers.dissociationMarkers.bodyDisconnection > 0.5) {
      protocols.push('Regular body awareness check-ins');
      protocols.push('Use 5-4-3-2-1 grounding technique if dissociation occurs');
      protocols.push('Maintain verbal contact to support present-moment awareness');
    }
    
    // Cultural safety considerations
    const culturalLanguage = culturalContext.primaryLanguage;
    if (culturalLanguage !== 'en') {
      protocols.push(`Honor ${culturalLanguage} expressions and cultural healing concepts`);
    }
    
    return protocols;
  }

  private async generateResourceBuilding(
    traumaMarkers: TraumaProcessingMarkers,
    culturalContext: CulturalContext
  ): Promise<string[]> {
    
    const resources: string[] = [];
    
    // Universal resources
    resources.push('Identify personal strengths and resilience factors');
    resources.push('Create list of current support systems');
    resources.push('Practice self-compassion and kind self-talk');
    
    // Somatic resources for body disconnection
    if (traumaMarkers.dissociationMarkers.bodyDisconnection > 0.5) {
      resources.push('Practice gentle body awareness exercises');
      resources.push('Learn grounding through five senses');
      resources.push('Develop safe physical self-soothing practices');
    }
    
    // Emotional resources for overwhelm
    if (traumaMarkers.reexperiencingMarkers.emotionalFlooding > 0.6) {
      resources.push('Create emotional regulation toolkit');
      resources.push('Practice breathing techniques for emotional intensity');
      resources.push('Identify safe people to contact when overwhelmed');
    }
    
    // Cultural resources
    resources.push(`Connect with ${culturalContext.culturalBackground.join(', ')} healing traditions`);
    resources.push('Honor ancestral wisdom and cultural strengths');
    
    return resources;
  }

  private async generateTitrationGuidance(
    sessionType: CreativeTraumaSession['sessionType'],
    traumaMarkers: TraumaProcessingMarkers
  ): Promise<string[]> {
    
    const guidance: string[] = [];
    
    // Universal titration principles
    guidance.push('Work in small, manageable doses rather than overwhelming amounts');
    guidance.push('Take breaks between intense creative expressions');
    guidance.push('Notice and honor your nervous system\'s capacity');
    
    switch (sessionType) {
      case 'stabilization':
        guidance.push('Focus on building safety and resources before processing trauma');
        guidance.push('Spend more time on grounding than activation');
        break;
        
      case 'processing':
        guidance.push('Touch into difficult material briefly, then return to safety');
        guidance.push('Balance activation with regulation throughout session');
        guidance.push('Stop processing if typeof window !== 'undefined' && window of tolerance is exceeded');
        break;
        
      case 'integration':
        guidance.push('Allow time for insights to settle and integrate');
        guidance.push('Create meaning-making space without rushing');
        break;
    }
    
    return guidance;
  }

  // Additional helper methods for session processing
  private async assessSessionHealing(
    creativeOutput: CreativeExpressionResult['creativeWork'][],
    somaticExperience: SomaticCreativeProcessing,
    therapeuticShifts: Array<{ type: string; description: string }>
  ): Promise<CreativeTraumaSession['healingIndicators']> {
    
    // Assess nervous system regulation
    const nervousSystemRegulation = this.assessNervousSystemRegulation(somaticExperience);
    
    // Assess emotional range expansion
    const emotionalRange = this.assessEmotionalRangeExpansion(creativeOutput);
    
    // Assess somatic integration
    const somaticIntegration = this.assessSomaticIntegrationLevel(somaticExperience);
    
    // Assess narrative coherence
    const narrativeCoherence = this.assessNarrativeCoherence(creativeOutput);
    
    // Assess empowerment sense
    const empowermentSense = this.assessEmpowermentSense(therapeuticShifts);
    
    return {
      nervousSystemRegulation,
      emotionalRange,
      somaticIntegration,
      narrativeCoherence,
      empowermentSense
    };
  }

  private countEmotionalWords(text: string): number {
    const emotionalWords = [
      'angry', 'sad', 'happy', 'excited', 'nervous', 'calm', 'frustrated',
      'grateful', 'hopeful', 'scared', 'proud', 'ashamed', 'loved', 'lonely',
      'peaceful', 'anxious', 'content', 'overwhelmed', 'joyful', 'grief'
    ];
    
    const lowerText = text.toLowerCase();
    return emotionalWords.filter(word => lowerText.includes(word)).length;
  }

  private countUniqueEmotionalWords(text: string): number {
    const emotionalWords = [
      'angry', 'sad', 'happy', 'excited', 'nervous', 'calm', 'frustrated',
      'grateful', 'hopeful', 'scared', 'proud', 'ashamed', 'loved', 'lonely',
      'peaceful', 'anxious', 'content', 'overwhelmed', 'joyful', 'grief',
      'curious', 'surprised', 'disgusted', 'contempt', 'embarrassed',
      'guilty', 'jealous', 'envious', 'relieved', 'disappointed'
    ];
    
    const lowerText = text.toLowerCase();
    const foundEmotions = new Set();
    
    for (const word of emotionalWords) {
      if (lowerText.includes(word)) {
        foundEmotions.add(word);
      }
    }
    
    return foundEmotions.size;
  }

  // Simplified implementations for helper methods
  private identifyTensionAreas(markers: TraumaProcessingMarkers): string[] {
    const areas: string[] = [];
    if (markers.hypervigilanceMarkers.sensoryOverwhelm > 0.6) areas.push('head/neck');
    if (markers.dissociationMarkers.bodyDisconnection > 0.6) areas.push('core/torso');
    if (markers.reexperiencingMarkers.somaticReactivation > 0.6) areas.push('shoulders/arms');
    return areas;
  }

  private assessEnergyLevel(markers: TraumaProcessingMarkers): number {
    // Simplified - would be more sophisticated in production
    return 0.5;
  }

  private assessBreathingPattern(markers: TraumaProcessingMarkers): 'shallow' | 'deep' | 'irregular' | 'held' {
    if (markers.hypervigilanceMarkers.sensoryOverwhelm > 0.6) return 'shallow';
    if (markers.dissociationMarkers.bodyDisconnection > 0.6) return 'held';
    return 'irregular';
  }

  private assessEmotionalSomaticState(markers: TraumaProcessingMarkers): string {
    if (markers.hypervigilanceMarkers.sensoryOverwhelm > 0.6) return 'activated/alert';
    if (markers.dissociationMarkers.bodyDisconnection > 0.6) return 'disconnected/numb';
    return 'mixed/complex';
  }

  // Session processing helper methods
  private assessNervousSystemRegulation(experience: SomaticCreativeProcessing): number {
    // Would analyze pre/post changes in activation, grounding, regulation
    return 0.7;
  }

  private assessEmotionalRangeExpansion(output: CreativeExpressionResult['creativeWork'][]): number {
    // Would analyze emotional vocabulary and range in creative expressions
    return 0.6;
  }

  private assessSomaticIntegrationLevel(experience: SomaticCreativeProcessing): number {
    // Would analyze body awareness changes and integration indicators
    return 0.5;
  }

  private assessNarrativeCoherence(output: CreativeExpressionResult['creativeWork'][]): number {
    // Would analyze coherence and integration in creative narratives
    return 0.8;
  }

  private assessEmpowermentSense(shifts: Array<{ type: string; description: string }>): number {
    // Would analyze therapeutic shifts for empowerment indicators
    const empowermentShifts = shifts.filter(shift => 
      shift.description.toLowerCase().includes('power') ||
      shift.description.toLowerCase().includes('strength') ||
      shift.description.toLowerCase().includes('choice')
    );
    return Math.min(1, empowermentShifts.length * 0.3);
  }

  private async generateIntegrationRecommendations(
    healing: CreativeTraumaSession['healingIndicators'],
    shifts: Array<{ type: string; description: string }>,
    experience: SomaticCreativeProcessing
  ): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (healing.nervousSystemRegulation > 0.7) {
      recommendations.push('Continue building on nervous system regulation gains');
    }
    
    if (healing.somaticIntegration < 0.5) {
      recommendations.push('Focus on gentle somatic awareness practices');
    }
    
    recommendations.push('Journal about insights and therapeutic shifts');
    recommendations.push('Practice self-care and gentle integration');
    
    return recommendations;
  }

  private async generateSafetyAdjustments(
    incidents: Array<{ trigger: string; response: string }>,
    healing: CreativeTraumaSession['healingIndicators']
  ): Promise<string[]> {
    const adjustments: string[] = [];
    
    if (incidents.length > 2) {
      adjustments.push('Increase safety protocols and reduce activation levels');
    }
    
    if (healing.nervousSystemRegulation < 0.4) {
      adjustments.push('Focus more on stabilization before processing work');
    }
    
    return adjustments;
  }

  private async generateNextSessionPlan(
    healing: CreativeTraumaSession['healingIndicators'],
    safetyIncidentsCount: number,
    shifts: Array<{ type: string; description: string }>
  ): Promise<string[]> {
    const plans: string[] = [];
    
    if (healing.nervousSystemRegulation > 0.6 && safetyIncidentsCount < 2) {
      plans.push('Ready for deeper processing work');
    } else {
      plans.push('Continue stabilization and resource building');
    }
    
    if (shifts.length > 2) {
      plans.push('Focus on integration of therapeutic breakthroughs');
    }
    
    return plans;
  }
}

// Export singleton instance
export const creativeTraumaProcessor = new CreativeTraumaProcessingEngine();

export default creativeTraumaProcessor;