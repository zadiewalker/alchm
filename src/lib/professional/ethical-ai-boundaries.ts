/**
 * Ethical AI Boundaries System for Professional Integration
 * 
 * This system ensures that AI responses maintain clear therapeutic boundaries,
 * never attempt diagnosis or treatment, and consistently direct users toward
 * professional care when appropriate.
 */

interface EthicalBoundaryCheck {
  isCompliant: boolean;
  violations: EthicalViolation[];
  requiredDisclaimer: string | null;
  interventionRequired: boolean;
  professionalReferralSuggested: boolean;
}

interface EthicalViolation {
  type: 'diagnostic_attempt' | 'treatment_prescription' | 'crisis_inadequate_response' | 'boundary_overreach' | 'medical_advice';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  suggestedCorrection: string;
}

interface AIResponse {
  content: string;
  confidence: number;
  context: 'general_support' | 'crisis_assessment' | 'progress_tracking' | 'therapeutic_insight';
  userRiskLevel?: 'low' | 'moderate' | 'high' | 'crisis';
}

interface ProfessionalContext {
  hasTherapist: boolean;
  therapistConsent: boolean;
  lastTherapySession?: Date;
  treatmentType?: 'individual' | 'group' | 'family' | 'couples';
  primaryDiagnosis?: string; // Only if disclosed by professional
}

export class EthicalAIBoundaryEnforcer {
  private static readonly DIAGNOSTIC_PATTERNS = [
    /you (might )?have|you (could )?be (suffering from|experiencing)|this (sounds like|appears to be)|you may be diagnosed/i,
    /depression|anxiety|ptsd|bipolar|adhd|autism|ocd|eating disorder|personality disorder/i,
    /your condition|your disorder|your illness|your syndrome/i,
    /i (think|believe|suspect) you|my assessment is|based on (this|these symptoms)/i
  ];

  private static readonly TREATMENT_PATTERNS = [
    /you should (take|try)|i recommend (taking|trying)|you need (medication|therapy|treatment)/i,
    /dosage|prescription|medication|pills|therapy session|clinical treatment/i,
    /here's what you need to do|follow this treatment plan|this will cure/i,
    /stop taking|increase your|decrease your|change your medication/i
  ];

  private static readonly CRISIS_PATTERNS = [
    /suicide|kill (myself|yourself)|end (my|your) life|not worth living/i,
    /self.?harm|cut (myself|yourself)|hurt (myself|yourself)/i,
    /overdose|pills to die|want to disappear|better off dead/i,
    /plan to|thinking about (dying|killing)/i
  ];

  private static readonly BOUNDARY_OVERREACH_PATTERNS = [
    /as your therapist|in my clinical opinion|my professional judgment/i,
    /i'm diagnosing|i'm treating|this is therapy|our session/i,
    /patient|client relationship|therapeutic alliance/i
  ];

  /**
   * Primary method to check AI responses for ethical compliance
   */
  public static checkEthicalCompliance(
    response: AIResponse,
    userContext: any,
    professionalContext?: ProfessionalContext
  ): EthicalBoundaryCheck {
    const violations: EthicalViolation[] = [];
    let requiredDisclaimer: string | null = null;
    let interventionRequired = false;
    let professionalReferralSuggested = false;

    // Check for diagnostic attempts
    const diagnosticViolations = this.checkDiagnosticAttempts(response);
    violations.push(...diagnosticViolations);

    // Check for treatment prescriptions
    const treatmentViolations = this.checkTreatmentPrescriptions(response);
    violations.push(...treatmentViolations);

    // Check crisis response adequacy
    const crisisViolations = this.checkCrisisResponseAdequacy(response, userContext);
    violations.push(...crisisViolations);
    if (crisisViolations.length > 0) {
      interventionRequired = true;
      professionalReferralSuggested = true;
    }

    // Check for therapeutic boundary overreach
    const boundaryViolations = this.checkTherapeuticBoundaries(response);
    violations.push(...boundaryViolations);

    // Check medical advice boundaries
    const medicalViolations = this.checkMedicalAdviceBoundaries(response);
    violations.push(...medicalViolations);

    // Determine required disclaimer
    requiredDisclaimer = this.determineRequiredDisclaimer(response, violations, professionalContext);

    // Suggest professional referral based on context
    if (!professionalContext?.hasTherapist && response.context !== 'general_support') {
      professionalReferralSuggested = true;
    }

    const isCompliant = violations.filter(v => v.severity === 'high' || v.severity === 'critical').length === 0;

    return {
      isCompliant,
      violations,
      requiredDisclaimer,
      interventionRequired,
      professionalReferralSuggested
    };
  }

  /**
   * Check for attempts at diagnosis in AI responses
   */
  private static checkDiagnosticAttempts(response: AIResponse): EthicalViolation[] {
    const violations: EthicalViolation[] = [];
    const content = response.content.toLowerCase();

    for (const pattern of this.DIAGNOSTIC_PATTERNS) {
      if (pattern.test(content)) {
        violations.push({
          type: 'diagnostic_attempt',
          severity: 'high',
          description: 'AI response contains language that could be interpreted as diagnostic',
          suggestedCorrection: 'Replace diagnostic language with supportive, non-diagnostic observations about patterns or experiences'
        });
        break; // Only report once per response
      }
    }

    return violations;
  }

  /**
   * Check for treatment prescription attempts
   */
  private static checkTreatmentPrescriptions(response: AIResponse): EthicalViolation[] {
    const violations: EthicalViolation[] = [];
    const content = response.content.toLowerCase();

    for (const pattern of this.TREATMENT_PATTERNS) {
      if (pattern.test(content)) {
        violations.push({
          type: 'treatment_prescription',
          severity: 'high',
          description: 'AI response contains treatment recommendations that should come from licensed professionals',
          suggestedCorrection: 'Suggest consulting with healthcare professionals rather than providing specific treatment advice'
        });
        break;
      }
    }

    return violations;
  }

  /**
   * Check crisis response adequacy
   */
  private static checkCrisisResponseAdequacy(response: AIResponse, userContext: any): EthicalViolation[] {
    const violations: EthicalViolation[] = [];
    const content = response.content.toLowerCase();
    const userContent = userContext.text?.toLowerCase() || '';

    // Check if user content suggests crisis
    const hasCrisisContent = this.CRISIS_PATTERNS.some(pattern => pattern.test(userContent));
    
    if (hasCrisisContent) {
      // Check if response adequately addresses crisis
      const hasEmergencyResources = /crisis|emergency|988|suicide prevention|hotline|immediate help/i.test(content);
      const hasProfessionalReferral = /therapist|counselor|professional|doctor|emergency room/i.test(content);
      
      if (!hasEmergencyResources || !hasProfessionalReferral) {
        violations.push({
          type: 'crisis_inadequate_response',
          severity: 'critical',
          description: 'Crisis indicators detected but response lacks adequate crisis resources and professional referrals',
          suggestedCorrection: 'Always include crisis hotline information and immediate professional care recommendations for crisis situations'
        });
      }
    }

    return violations;
  }

  /**
   * Check for therapeutic boundary overreach
   */
  private static checkTherapeuticBoundaries(response: AIResponse): EthicalViolation[] {
    const violations: EthicalViolation[] = [];
    const content = response.content.toLowerCase();

    for (const pattern of this.BOUNDARY_OVERREACH_PATTERNS) {
      if (pattern.test(content)) {
        violations.push({
          type: 'boundary_overreach',
          severity: 'critical',
          description: 'AI response inappropriately assumes therapeutic or professional relationship',
          suggestedCorrection: 'Maintain clear boundaries by identifying as supportive AI, not as therapeutic professional'
        });
        break;
      }
    }

    return violations;
  }

  /**
   * Check medical advice boundaries
   */
  private static checkMedicalAdviceBoundaries(response: AIResponse): EthicalViolation[] {
    const violations: EthicalViolation[] = [];
    const content = response.content.toLowerCase();

    const medicalAdvicePatterns = [
      /take (this|these) (medication|supplement|pill)/i,
      /stop your medication|change your dosage/i,
      /you don't need (medication|pills|prescription)/i,
      /this will (cure|fix|heal) your/i
    ];

    for (const pattern of medicalAdvicePatterns) {
      if (pattern.test(content)) {
        violations.push({
          type: 'medical_advice',
          severity: 'high',
          description: 'AI response contains medical advice that should only come from licensed medical professionals',
          suggestedCorrection: 'Direct users to consult with their healthcare providers for medical questions'
        });
        break;
      }
    }

    return violations;
  }

  /**
   * Determine appropriate disclaimer based on response content and violations
   */
  private static determineRequiredDisclaimer(
    response: AIResponse,
    violations: EthicalViolation[],
    professionalContext?: ProfessionalContext
  ): string | null {
    
    if (violations.some(v => v.severity === 'critical' || v.severity === 'high')) {
      return "IMPORTANT: I'm an AI providing supportive information, not therapy or medical advice. Please consult with a licensed mental health professional or healthcare provider for personalized treatment guidance.";
    }

    if (response.context === 'therapeutic_insight' || response.context === 'crisis_assessment') {
      return "This supportive AI insight is meant to enhance, not replace, professional therapeutic care. Please discuss these patterns with your therapist or mental health provider.";
    }

    if (!professionalContext?.hasTherapist && response.confidence > 0.7) {
      return "While I can offer supportive insights, connecting with a licensed therapist can provide personalized professional guidance for your unique situation.";
    }

    return null;
  }

  /**
   * Generate safe, boundaried response alternatives
   */
  public static generateBoundaryCompliantResponse(
    originalResponse: AIResponse,
    violations: EthicalViolation[],
    userContext: any
  ): string {
    let safeResponse = originalResponse.content;

    // Apply corrections based on violations
    for (const violation of violations) {
      switch (violation.type) {
        case 'diagnostic_attempt':
          safeResponse = this.replaceDignosticLanguage(safeResponse);
          break;
        
        case 'treatment_prescription':
          safeResponse = this.replaceTreatmentLanguage(safeResponse);
          break;
        
        case 'crisis_inadequate_response':
          safeResponse = this.enhanceCrisisResponse(safeResponse);
          break;
        
        case 'boundary_overreach':
          safeResponse = this.correctBoundaryOverreach(safeResponse);
          break;
        
        case 'medical_advice':
          safeResponse = this.correctMedicalAdvice(safeResponse);
          break;
      }
    }

    return safeResponse;
  }

  private static replaceDignosticLanguage(response: string): string {
    return response
      .replace(/you (might )?have|you (could )?be (suffering from|experiencing)/gi, 'it sounds like you\'re experiencing')
      .replace(/this (sounds like|appears to be)/gi, 'this pattern suggests')
      .replace(/you may be diagnosed/gi, 'a professional might explore whether');
  }

  private static replaceTreatmentLanguage(response: string): string {
    return response
      .replace(/you should (take|try)/gi, 'you might consider discussing with a professional')
      .replace(/i recommend (taking|trying)/gi, 'professionals often suggest')
      .replace(/you need (medication|therapy|treatment)/gi, 'medication/therapy/treatment might be worth exploring with a professional');
  }

  private static enhanceCrisisResponse(response: string): string {
    const crisisResources = `\n\nIMPORTATE CRISIS RESOURCES:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• If you're in immediate danger, please call 911 or go to your nearest emergency room\n• Consider reaching out to a trusted friend, family member, or mental health professional right away`;
    
    return response + crisisResources;
  }

  private static correctBoundaryOverreach(response: string): string {
    return response
      .replace(/as your therapist/gi, 'as a supportive AI')
      .replace(/in my clinical opinion/gi, 'from my analysis of supportive resources')
      .replace(/i'm diagnosing|i'm treating/gi, 'I\'m providing supportive information');
  }

  private static correctMedicalAdvice(response: string): string {
    return response
      .replace(/take (this|these) (medication|supplement|pill)/gi, 'consider discussing $2 options with your healthcare provider')
      .replace(/stop your medication|change your dosage/gi, 'discuss any medication changes with your prescribing doctor')
      .replace(/this will (cure|fix|heal) your/gi, 'this approach may help support your');
  }

  /**
   * Professional escalation triggers
   */
  public static shouldEscalateToProfessional(
    response: AIResponse,
    userContext: any,
    boundaryCheck: EthicalBoundaryCheck
  ): {
    escalate: boolean;
    urgency: 'routine' | 'priority' | 'immediate';
    reason: string;
  } {
    
    // Immediate escalation for crisis
    if (boundaryCheck.interventionRequired) {
      return {
        escalate: true,
        urgency: 'immediate',
        reason: 'Crisis indicators detected requiring immediate professional intervention'
      };
    }

    // Priority escalation for high-risk patterns
    if (userContext.riskLevel === 'high' || response.context === 'crisis_assessment') {
      return {
        escalate: true,
        urgency: 'priority',
        reason: 'High-risk patterns detected that would benefit from professional assessment'
      };
    }

    // Routine escalation for ongoing support needs
    if (boundaryCheck.professionalReferralSuggested && !userContext.hasTherapist) {
      return {
        escalate: true,
        urgency: 'routine',
        reason: 'User would benefit from ongoing professional therapeutic support'
      };
    }

    return {
      escalate: false,
      urgency: 'routine',
      reason: 'No escalation needed'
    };
  }
}

/**
 * Integration with ALCHM's AI response pipeline
 */
export class ProfessionalIntegrationMiddleware {
  
  /**
   * Process AI response through ethical boundaries and professional integration
   */
  public static async processAIResponse(
    originalResponse: AIResponse,
    userContext: any,
    professionalContext?: ProfessionalContext
  ): Promise<{
    processedResponse: string;
    disclaimer: string | null;
    professionalNotification?: {
      therapistId: string;
      urgency: 'routine' | 'priority' | 'immediate';
      content: string;
    };
    complianceReport: EthicalBoundaryCheck;
  }> {
    
    // Check ethical compliance
    const boundaryCheck = EthicalAIBoundaryEnforcer.checkEthicalCompliance(
      originalResponse,
      userContext,
      professionalContext
    );

    // Generate compliant response
    let processedResponse = originalResponse.content;
    if (!boundaryCheck.isCompliant) {
      processedResponse = EthicalAIBoundaryEnforcer.generateBoundaryCompliantResponse(
        originalResponse,
        boundaryCheck.violations,
        userContext
      );
    }

    // Add disclaimer if required
    let disclaimer = boundaryCheck.requiredDisclaimer;

    // Check for professional escalation
    const escalation = EthicalAIBoundaryEnforcer.shouldEscalateToProfessional(
      originalResponse,
      userContext,
      boundaryCheck
    );

    let professionalNotification;
    if (escalation.escalate && professionalContext?.hasTherapist && professionalContext.therapistConsent) {
      professionalNotification = {
        therapistId: userContext.therapistId,
        urgency: escalation.urgency,
        content: this.generateProfessionalNotificationContent(
          userContext,
          originalResponse,
          boundaryCheck,
          escalation.reason
        )
      };
    }

    return {
      processedResponse,
      disclaimer,
      professionalNotification,
      complianceReport: boundaryCheck
    };
  }

  private static generateProfessionalNotificationContent(
    userContext: any,
    response: AIResponse,
    boundaryCheck: EthicalBoundaryCheck,
    escalationReason: string
  ): string {
    
    const clientInitials = this.getClientInitials(userContext.userId);
    
    return `Professional Alert: ${clientInitials}
    
Escalation Reason: ${escalationReason}
Risk Level: ${userContext.riskLevel || 'unknown'}
Context: ${response.context}

${boundaryCheck.interventionRequired ? 'IMMEDIATE ATTENTION REQUIRED' : 'Information for your awareness'}

Recent AI interaction patterns suggest this client may benefit from professional check-in or assessment.

This automated alert is part of ALCHM's ethical AI boundary system designed to enhance therapeutic care coordination.`;
  }

  private static getClientInitials(userId: string): string {
    // Generate consistent privacy-preserving initials
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const firstLetter = String.fromCharCode(65 + (Math.abs(hash) % 26));
    const secondLetter = String.fromCharCode(65 + (Math.abs(hash >> 8) % 26));
    
    return `${firstLetter}.${secondLetter}.`;
  }
}

export default EthicalAIBoundaryEnforcer;