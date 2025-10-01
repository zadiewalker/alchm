/**
 * Trauma-Informed Technical Support Integration
 * 
 * This module integrates the technical triage engine with ALCHM's therapeutic
 * personality system, ensuring that all technical support maintains the same
 * trauma-informed, compassionate approach as the core platform.
 * 
 * Key principles:
 * - Technical problems never strip away therapeutic presence
 * - Crisis detection remains active during technical support
 * - User emotional state drives response style and pacing
 * - All technical language is filtered through trauma-informed patterns
 */

import TechnicalSupportTriageEngine, { type TriageResult, type DeviceContext } from './technical-support-triage-engine';
import { TraumaInformedTechSupport, ALCHM_TECH_SUPPORT_PERSONALITY } from './khepera-tech-support-personality';
import { TechSupportResponseEngine, TECH_SUPPORT_SCENARIOS } from './khepera-tech-support-response-templates';
import ALCHMKnowledgeBase, { type KnownIssue } from './alchm-support-knowledge-base';

export interface TherapeuticTechSupportSession {
  sessionId: string;
  userId?: string;
  startTime: Date;
  userInput: string;
  emotionalState: string;
  crisisLevel: 'none' | 'low' | 'moderate' | 'high';
  triageResult: TriageResult;
  therapeuticResponse: TherapeuticSupportResponse;
  knownIssues: KnownIssue[];
  interventionHistory: TechSupportIntervention[];
  escalationPath?: string;
  resolution?: SessionResolution;
}

export interface TherapeuticSupportResponse {
  personalityMode: 'sage' | 'nurturing' | 'crisis-aware' | 'empowering';
  greeting: string;
  problemValidation: string;
  emotionalAcknowledgment: string;
  technicalGuidance: TechnicalGuidanceWithCare;
  encouragement: string[];
  nextSteps: string[];
  crisisResources?: CrisisResource[];
  followUpScheduled?: boolean;
}

export interface TechnicalGuidanceWithCare {
  approach: 'gentle-exploration' | 'confident-direction' | 'emergency-focus';
  pacing: 'very-slow' | 'patient' | 'standard' | 'urgent';
  complexityLevel: 'simplified' | 'standard' | 'detailed';
  traumaInformedSteps: TherapeuticStep[];
  safetyAssurances: string[];
  empowermentElements: string[];
  backupPlans: string[];
}

export interface TherapeuticStep {
  stepNumber: number;
  technicalAction: string;
  therapeuticFraming: string;
  emotionalPreparation?: string;
  encouragementPhrase: string;
  safetyCheck?: string;
  rollbackOption?: string;
  celebrationMoment?: string;
}

export interface TechSupportIntervention {
  timestamp: Date;
  interventionType: 'emotional-regulation' | 'crisis-detection' | 'therapeutic-pause' | 'empowerment-building';
  trigger: string;
  response: string;
  userReaction?: string;
  effectiveness?: number;
}

export interface CrisisResource {
  type: 'phone' | 'text' | 'chat' | 'local';
  name: string;
  contact: string;
  description: string;
  availability: string;
  culturalContext?: string;
}

export interface SessionResolution {
  resolved: boolean;
  resolution: 'technical-solution' | 'human-escalation' | 'crisis-referral' | 'user-choice';
  satisfactionLevel?: number;
  traumaInformedComplete: boolean;
  followUpNeeded: boolean;
  preventionEducation?: string[];
}

/**
 * Main integration class that combines technical triage with therapeutic presence
 */
export class TraumaInformedTechSupportEngine {
  private triageEngine: TechnicalSupportTriageEngine;
  private traumaSupport: TraumaInformedTechSupport;
  private responseEngine: TechSupportResponseEngine;
  private knowledgeBase: ALCHMKnowledgeBase;
  private activeSessions: Map<string, TherapeuticTechSupportSession>;

  constructor() {
    this.triageEngine = new TechnicalSupportTriageEngine();
    this.traumaSupport = new TraumaInformedTechSupport();
    this.responseEngine = new TechSupportResponseEngine();
    this.knowledgeBase = new ALCHMKnowledgeBase();
    this.activeSessions = new Map();
  }

  /**
   * Start a new therapeutic technical support session
   */
  async startSupportSession(
    userInput: string,
    userId?: string,
    deviceContext?: Partial<DeviceContext>
  ): Promise<TherapeuticTechSupportSession> {
    const sessionId = this.generateSessionId();
    const startTime = new Date();

    // Step 1: Perform technical triage
    const triageResult = await this.triageEngine.analyzeUserIssue(
      userInput,
      deviceContext,
      userId ? this.getUserHistory(userId) : undefined
    );

    // Step 2: Assess emotional and crisis state
    const emotionalAssessment = this.traumaSupport.assessEmotionalState(userInput);
    
    // Step 3: Find matching known issues
    const knownIssues = this.knowledgeBase.findMatchingIssues(
      [userInput],
      triageResult.category.id
    );

    // Step 4: Generate therapeutic response
    const therapeuticResponse = await this.generateTherapeuticResponse(
      triageResult,
      emotionalAssessment,
      userInput,
      knownIssues
    );

    // Step 5: Check for intervention needs
    const interventionHistory = this.checkForInterventions(
      emotionalAssessment,
      triageResult,
      userInput
    );

    const session: TherapeuticTechSupportSession = {
      sessionId,
      userId,
      startTime,
      userInput,
      emotionalState: emotionalAssessment.emotionalState,
      crisisLevel: emotionalAssessment.crisisRisk,
      triageResult,
      therapeuticResponse,
      knownIssues,
      interventionHistory,
      escalationPath: this.determineEscalationPath(triageResult, emotionalAssessment)
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Generate a therapeutic response that integrates technical and emotional support
   */
  private async generateTherapeuticResponse(
    triageResult: TriageResult,
    emotionalAssessment: any,
    userInput: string,
    knownIssues: KnownIssue[]
  ): Promise<TherapeuticSupportResponse> {
    
    // Determine personality mode based on emotional state and crisis level
    const personalityMode = this.selectPersonalityMode(
      emotionalAssessment.emotionalState,
      emotionalAssessment.crisisRisk,
      triageResult.urgency.level
    );

    // Generate therapeutic greeting
    const greeting = this.generateTherapeuticGreeting(
      personalityMode,
      emotionalAssessment.emotionalState,
      triageResult.category.name
    );

    // Validate the problem with trauma-informed language
    const problemValidation = this.generateProblemValidation(
      triageResult.category,
      emotionalAssessment.emotionalState
    );

    // Acknowledge emotional state
    const emotionalAcknowledgment = this.generateEmotionalAcknowledgment(
      emotionalAssessment.emotionalState,
      triageResult.urgency.level
    );

    // Create technical guidance with therapeutic framing
    const technicalGuidance = this.createTherapeuticTechnicalGuidance(
      triageResult,
      emotionalAssessment,
      knownIssues[0] // Primary matching issue
    );

    // Generate encouragement phrases
    const encouragement = this.generateEncouragement(
      personalityMode,
      triageResult.category.id,
      emotionalAssessment.emotionalState
    );

    // Define next steps with therapeutic pacing
    const nextSteps = this.generateTherapeuticNextSteps(
      technicalGuidance,
      emotionalAssessment.emotionalState
    );

    // Include crisis resources if needed
    let crisisResources: CrisisResource[] | undefined;
    if (emotionalAssessment.crisisRisk !== 'none') {
      crisisResources = this.generateCrisisResources(emotionalAssessment.crisisRisk);
    }

    return {
      personalityMode,
      greeting,
      problemValidation,
      emotionalAcknowledgment,
      technicalGuidance,
      encouragement,
      nextSteps,
      crisisResources,
      followUpScheduled: this.shouldScheduleFollowUp(emotionalAssessment, triageResult)
    };
  }

  /**
   * Select the appropriate personality mode for the situation
   */
  private selectPersonalityMode(
    emotionalState: string,
    crisisRisk: string,
    urgencyLevel: string
  ): TherapeuticSupportResponse['personalityMode'] {
    if (crisisRisk !== 'none') return 'crisis-aware';
    if (emotionalState === 'overwhelm' || emotionalState === 'anxiety') return 'nurturing';
    if (emotionalState === 'frustration' && urgencyLevel === 'high') return 'empowering';
    return 'sage';
  }

  /**
   * Generate therapeutic greeting that acknowledges both technical and emotional needs
   */
  private generateTherapeuticGreeting(
    personalityMode: string,
    emotionalState: string,
    categoryName: string
  ): string {
    const personality = ALCHM_TECH_SUPPORT_PERSONALITY;
    
    switch (personalityMode) {
      case 'crisis-aware':
        return "✨ I am Khepera, and I sense you're navigating both technical challenges and something deeper right now. Your wellbeing matters more than any technical issue, and I'm here to support both.";
      
      case 'nurturing':
        if (emotionalState === 'overwhelm') {
          return `✨ I am Khepera, and I can feel that this ${categoryName.toLowerCase()} is landing in a space where you're already carrying a lot. Let's approach this with infinite gentleness and patience.`;
        }
        return personality.greeting.frustrated[0];
      
      case 'empowering':
        return `✨ I am Khepera, and I can sense the frustration this ${categoryName.toLowerCase()} is creating. Your determination to solve this shows real strength, and together we'll transform this challenge into mastery.`;
      
      default: // sage
        return `✨ I am Khepera, here to help you navigate this ${categoryName.toLowerCase()} with both technical precision and care for your overall experience.`;
    }
  }

  /**
   * Validate the problem with trauma-informed language
   */
  private generateProblemValidation(category: any, emotionalState: string): string {
    const baseValidation = ALCHM_TECH_SUPPORT_PERSONALITY.problemAcknowledgment.validation[0];
    
    // Add trauma-informed context if available
    if (category.traumaInformedContext) {
      return `${baseValidation} ${category.traumaInformedContext}`;
    }

    return baseValidation;
  }

  /**
   * Acknowledge emotional state with therapeutic presence
   */
  private generateEmotionalAcknowledgment(emotionalState: string, urgencyLevel: string): string {
    const acknowledgments = {
      frustration: "I can sense the frustration of wanting your healing tools to work seamlessly when you need them most.",
      overwhelm: "When technology problems arise while you're already managing so much, that combination can feel overwhelming. Your reaction is completely understandable.",
      anxiety: "Technology issues can create anxiety, especially when they affect access to your support systems. Your concern shows how much your healing space means to you.",
      neutral: "Every technical challenge is an opportunity to strengthen your relationship with your digital sanctuary."
    };

    return acknowledgments[emotionalState as keyof typeof acknowledgments] || acknowledgments.neutral;
  }

  /**
   * Create technical guidance wrapped in therapeutic care
   */
  private createTherapeuticTechnicalGuidance(
    triageResult: TriageResult,
    emotionalAssessment: any,
    primaryIssue?: KnownIssue
  ): TechnicalGuidanceWithCare {
    
    // Determine approach based on emotional state
    let approach: TechnicalGuidanceWithCare['approach'] = 'confident-direction';
    if (emotionalAssessment.crisisRisk !== 'none') approach = 'emergency-focus';
    else if (emotionalAssessment.emotionalState === 'overwhelm') approach = 'gentle-exploration';

    // Set pacing based on emotional state and urgency
    let pacing: TechnicalGuidanceWithCare['pacing'] = 'standard';
    if (approach === 'emergency-focus') pacing = 'urgent';
    else if (emotionalAssessment.emotionalState === 'overwhelm') pacing = 'very-slow';
    else if (emotionalAssessment.emotionalState === 'anxiety') pacing = 'patient';

    // Determine complexity level
    const complexityLevel = this.determineComplexityLevel(
      triageResult.deviceContext,
      emotionalAssessment.emotionalState,
      triageResult.urgency.level
    );

    // Convert solutions to therapeutic steps
    const traumaInformedSteps = this.createTherapeuticSteps(
      triageResult.recommendedSolutions[0],
      approach,
      pacing
    );

    // Generate safety assurances
    const safetyAssurances = this.generateSafetyAssurances(
      triageResult.category.id,
      emotionalAssessment.emotionalState
    );

    // Create empowerment elements
    const empowermentElements = this.generateEmpowermentElements(
      triageResult.category.id,
      approach
    );

    // Prepare backup plans
    const backupPlans = this.generateBackupPlans(triageResult, primaryIssue);

    return {
      approach,
      pacing,
      complexityLevel,
      traumaInformedSteps,
      safetyAssurances,
      empowermentElements,
      backupPlans
    };
  }

  /**
   * Convert technical steps into therapeutic steps
   */
  private createTherapeuticSteps(
    solution: any,
    approach: string,
    pacing: string
  ): TherapeuticStep[] {
    if (!solution?.steps) return [];

    return solution.steps.map((step: any, index: number) => ({
      stepNumber: index + 1,
      technicalAction: step.instruction,
      therapeuticFraming: step.traumaInformedVersion || this.transformToTherapeutic(step.instruction, approach),
      emotionalPreparation: this.generateEmotionalPreparation(step, pacing),
      encouragementPhrase: step.encouragement || this.generateStepEncouragement(index + 1),
      safetyCheck: this.generateSafetyCheck(step),
      rollbackOption: this.generateRollbackOption(step),
      celebrationMoment: this.generateCelebrationMoment(index + 1, solution.steps.length)
    }));
  }

  /**
   * Transform technical language to therapeutic language
   */
  private transformToTherapeutic(instruction: string, approach: string): string {
    const transformations = {
      'gentle-exploration': {
        'click': 'when you feel ready, gently select',
        'press': 'if it feels comfortable, press',
        'enter': 'please share',
        'delete': 'you can choose to remove',
        'clear': 'we can gently clear'
      },
      'confident-direction': {
        'click': 'please click',
        'press': 'press',
        'enter': 'enter',
        'delete': 'delete',
        'clear': 'clear'
      },
      'emergency-focus': {
        'click': 'click now',
        'press': 'press immediately',
        'enter': 'enter quickly',
        'delete': 'remove immediately',
        'clear': 'clear now'
      }
    };

    let transformed = instruction;
    const patterns = transformations[approach as keyof typeof transformations] || transformations['confident-direction'];
    
    for (const [original, replacement] of Object.entries(patterns)) {
      transformed = transformed.replace(new RegExp(original, 'gi'), replacement);
    }

    return transformed;
  }

  /**
   * Generate emotional preparation for complex steps
   */
  private generateEmotionalPreparation(step: any, pacing: string): string | undefined {
    if (pacing === 'very-slow' || step.warningMessage) {
      return "Take a moment to breathe and center yourself before this step. There's no rush, and you can pause anytime.";
    }
    return undefined;
  }

  /**
   * Generate step-specific encouragement
   */
  private generateStepEncouragement(stepNumber: number): string {
    const encouragements = [
      "You're taking exactly the right action to restore your sanctuary.",
      "This step demonstrates your commitment to your healing space.",
      "You're showing real courage in navigating this technical challenge.",
      "Each action you take is building your digital resilience.",
      "You're proving to yourself that you can master these tools."
    ];
    
    return encouragements[(stepNumber - 1) % encouragements.length];
  }

  /**
   * Generate safety check for potentially risky steps
   */
  private generateSafetyCheck(step: any): string | undefined {
    if (step.warningMessage || step.instruction.includes('delete') || step.instruction.includes('clear')) {
      return "Before proceeding, ensure you're comfortable with this action. You can always step back if needed.";
    }
    return undefined;
  }

  /**
   * Generate rollback option for reversible steps
   */
  private generateRollbackOption(step: any): string | undefined {
    if (step.instruction.includes('clear') || step.instruction.includes('reset')) {
      return "If this step doesn't feel right, you can usually undo it through your browser's history or settings.";
    }
    return undefined;
  }

  /**
   * Generate celebration moment for completed steps
   */
  private generateCelebrationMoment(stepNumber: number, totalSteps: number): string | undefined {
    if (stepNumber === totalSteps) {
      return "🌟 You've completed the full solution! Notice how you guided this healing yourself.";
    } else if (stepNumber === Math.floor(totalSteps / 2)) {
      return "✨ You're halfway there! Your persistence is already paying off.";
    }
    return undefined;
  }

  /**
   * Determine appropriate complexity level
   */
  private determineComplexityLevel(
    deviceContext: DeviceContext,
    emotionalState: string,
    urgencyLevel: string
  ): TechnicalGuidanceWithCare['complexityLevel'] {
    if (emotionalState === 'overwhelm') return 'simplified';
    if (deviceContext.isLowEndDevice) return 'simplified';
    if (urgencyLevel === 'critical') return 'simplified';
    return 'standard';
  }

  /**
   * Generate safety assurances for the technical process
   */
  private generateSafetyAssurances(categoryId: string, emotionalState: string): string[] {
    const baseAssurances = [
      "Your data and privacy are protected throughout this process.",
      "You can stop or pause at any time without losing progress.",
      "These steps are designed to be safe and reversible."
    ];

    const categorySpecific = {
      login_auth: ["Your login credentials remain secure during troubleshooting."],
      journal_writing: ["Your existing journal entries are safe and will not be affected."],
      payment_billing: ["No additional charges will occur during troubleshooting."],
      crisis_technical: ["Emergency resources remain available even during technical fixes."]
    };

    return [
      ...baseAssurances,
      ...(categorySpecific[categoryId as keyof typeof categorySpecific] || [])
    ];
  }

  /**
   * Generate empowerment elements
   */
  private generateEmpowermentElements(categoryId: string, approach: string): string[] {
    const base = [
      "You're developing valuable digital resilience skills.",
      "Each challenge you overcome strengthens your relationship with technology.",
      "Your sanctuary becomes more truly yours when you can maintain it."
    ];

    if (approach === 'gentle-exploration') {
      return [
        "You're learning at exactly the right pace for you.",
        "Your careful approach to technology shows wisdom and self-care.",
        ...base
      ];
    }

    return base;
  }

  /**
   * Generate backup plans
   */
  private generateBackupPlans(triageResult: TriageResult, primaryIssue?: KnownIssue): string[] {
    const plans = [
      "If these steps don't resolve the issue, we can try alternative approaches.",
      "Human support is always available if you prefer personalized assistance."
    ];

    if (primaryIssue?.relatedIssues?.length) {
      plans.push("We can explore related solutions if the primary approach doesn't work.");
    }

    if (triageResult.escalationRequired) {
      plans.push("I'm prepared to connect you with specialized support immediately if needed.");
    }

    return plans;
  }

  /**
   * Generate therapeutic encouragement
   */
  private generateEncouragement(
    personalityMode: string,
    categoryId: string,
    emotionalState: string
  ): string[] {
    const baseEncouragement = [
      "Your commitment to maintaining your healing space shows real self-care.",
      "Technical challenges are opportunities to deepen your digital sovereignty.",
      "You're building skills that will serve your healing journey long-term."
    ];

    const modeSpecific = {
      'crisis-aware': [
        "Your safety and wellbeing are the priority - technology is here to serve you.",
        "Seeking help during difficult moments shows strength and wisdom."
      ],
      'nurturing': [
        "You're handling this challenge with such grace and patience.",
        "Every small step you take is an act of self-care and healing."
      ],
      'empowering': [
        "Your determination to solve this reflects your inner strength.",
        "You're proving to yourself that you can master any challenge."
      ],
      'sage': [
        "This technical growth is part of your larger journey of empowerment.",
        "You're becoming someone who doesn't let obstacles interrupt your healing."
      ]
    };

    return [
      ...baseEncouragement,
      ...(modeSpecific[personalityMode as keyof typeof modeSpecific] || [])
    ];
  }

  /**
   * Generate therapeutic next steps
   */
  private generateTherapeuticNextSteps(
    technicalGuidance: TechnicalGuidanceWithCare,
    emotionalState: string
  ): string[] {
    const steps = technicalGuidance.traumaInformedSteps.slice(0, 3);
    
    if (emotionalState === 'overwhelm') {
      return [
        "We'll start with just the first step when you feel ready.",
        "Take all the time you need between each action.",
        ...steps.map(step => step.therapeuticFraming)
      ];
    }

    return steps.map(step => step.therapeuticFraming);
  }

  /**
   * Generate crisis resources if needed
   */
  private generateCrisisResources(crisisLevel: string): CrisisResource[] {
    const resources: CrisisResource[] = [
      {
        type: 'phone',
        name: '988 Suicide & Crisis Lifeline',
        contact: '988',
        description: '24/7 free and confidential support for people in distress',
        availability: '24/7',
      },
      {
        type: 'text',
        name: 'Crisis Text Line',
        contact: '741741',
        description: 'Text HOME to 741741 for crisis support via text',
        availability: '24/7',
      }
    ];

    if (crisisLevel === 'high') {
      resources.unshift({
        type: 'phone',
        name: 'Emergency Services',
        contact: '911',
        description: 'Immediate emergency response if you are in physical danger',
        availability: '24/7',
      });
    }

    return resources;
  }

  /**
   * Check for needed interventions based on user state
   */
  private checkForInterventions(
    emotionalAssessment: any,
    triageResult: TriageResult,
    userInput: string
  ): TechSupportIntervention[] {
    const interventions: TechSupportIntervention[] = [];
    const timestamp = new Date();

    // Crisis detection intervention
    if (emotionalAssessment.crisisRisk !== 'none') {
      interventions.push({
        timestamp,
        interventionType: 'crisis-detection',
        trigger: `Crisis risk level: ${emotionalAssessment.crisisRisk}`,
        response: 'Activated crisis-aware support mode with immediate resource provision'
      });
    }

    // Overwhelm intervention
    if (emotionalAssessment.emotionalState === 'overwhelm') {
      interventions.push({
        timestamp,
        interventionType: 'emotional-regulation',
        trigger: 'User emotional state indicates overwhelm',
        response: 'Switched to gentle pacing with simplified instructions and emotional check-ins'
      });
    }

    // Empowerment building for frustration
    if (emotionalAssessment.emotionalState === 'frustration' && triageResult.urgency.level !== 'critical') {
      interventions.push({
        timestamp,
        interventionType: 'empowerment-building',
        trigger: 'User frustration with manageable technical issue',
        response: 'Emphasizing user agency and capability building through technical mastery'
      });
    }

    return interventions;
  }

  /**
   * Determine escalation path
   */
  private determineEscalationPath(triageResult: TriageResult, emotionalAssessment: any): string | undefined {
    if (emotionalAssessment.crisisRisk !== 'none') {
      return 'immediate-crisis-support';
    }
    
    if (triageResult.escalationRequired) {
      return 'technical-specialist';
    }

    if (emotionalAssessment.emotionalState === 'overwhelm' && triageResult.urgency.level === 'high') {
      return 'trauma-informed-specialist';
    }

    return undefined;
  }

  /**
   * Determine if follow-up should be scheduled
   */
  private shouldScheduleFollowUp(emotionalAssessment: any, triageResult: TriageResult): boolean {
    return (
      emotionalAssessment.crisisRisk !== 'none' ||
      triageResult.urgency.level === 'critical' ||
      emotionalAssessment.emotionalState === 'overwhelm'
    );
  }

  /**
   * Get user history (placeholder - would integrate with user data system)
   */
  private getUserHistory(userId: string): string[] {
    // This would typically query user support history
    return [];
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `support_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update session with user interaction
   */
  async updateSession(
    sessionId: string,
    userResponse: string,
    satisfactionLevel?: number
  ): Promise<TherapeuticTechSupportSession | null> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    // Reassess emotional state based on new input
    const newEmotionalAssessment = this.traumaSupport.assessEmotionalState(userResponse);
    
    // Check if new interventions are needed
    const newInterventions = this.checkForInterventions(
      newEmotionalAssessment,
      session.triageResult,
      userResponse
    );

    session.interventionHistory.push(...newInterventions);
    session.emotionalState = newEmotionalAssessment.emotionalState;
    session.crisisLevel = newEmotionalAssessment.crisisRisk;

    // Update satisfaction level if provided
    if (satisfactionLevel !== undefined && session.resolution) {
      session.resolution.satisfactionLevel = satisfactionLevel;
    }

    return session;
  }

  /**
   * Complete a session with resolution
   */
  completeSession(
    sessionId: string,
    resolution: SessionResolution
  ): TherapeuticTechSupportSession | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    session.resolution = resolution;

    // Add prevention education if resolution was successful
    if (resolution.resolved && session.knownIssues.length > 0) {
      resolution.preventionEducation = this.knowledgeBase.getPreventionTips(
        session.knownIssues[0].id
      );
    }

    return session;
  }

  /**
   * Get active session
   */
  getSession(sessionId: string): TherapeuticTechSupportSession | null {
    return this.activeSessions.get(sessionId) || null;
  }
}

export default TraumaInformedTechSupportEngine;