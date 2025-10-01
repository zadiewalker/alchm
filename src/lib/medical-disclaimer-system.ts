/**
 * Medical Disclaimer System
 * 
 * Implements App Store compliant medical disclaimer injection system
 * for mental health applications. Ensures 100% disclaimer compliance
 * for health-related AI responses and crisis interventions.
 */

export interface HealthContentContext {
  containsMentalHealthContent: boolean;
  containsTherapyTerms: boolean;
  containsCrisisLanguage: boolean;
  containsMedicalAdvice: boolean;
  containsAssessmentLanguage: boolean;
  severityLevel: 'low' | 'medium' | 'high' | 'crisis';
  triggeredKeywords: string[];
  needsDisclaimer: boolean;
  disclaimerType: 'standard' | 'elevated' | 'crisis' | 'therapy_boundary';
}

// Health content detection patterns
const HEALTH_CONTENT_PATTERNS = {
  mentalHealth: [
    // Diagnosis-related terms
    'depression', 'anxiety', 'ptsd', 'bipolar', 'schizophrenia', 'adhd', 'ocd',
    'borderline', 'autism', 'eating disorder', 'anorexia', 'bulimia',
    
    // Therapy-related terms
    'therapy', 'therapist', 'counseling', 'counselor', 'treatment', 'diagnosis',
    'medication', 'antidepressant', 'psychiatric', 'psychologist', 'psychiatrist',
    
    // Symptom language
    'symptoms', 'mental health', 'psychological', 'behavioral', 'cognitive',
    'emotional disorder', 'mental illness', 'psychological condition'
  ],
  
  therapyTerms: [
    'therapeutic', 'clinical', 'treatment plan', 'intervention', 'coping strategies',
    'behavioral therapy', 'cognitive therapy', 'psychotherapy', 'group therapy',
    'family therapy', 'trauma therapy', 'exposure therapy', 'dialectical behavior'
  ],
  
  crisisLanguage: [
    // Direct crisis indicators
    'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
    'self harm', 'self-harm', 'cutting', 'hurting myself', 'no point in living',
    
    // Indirect crisis indicators - Enhanced for App Store compliance
    'can\'t go on', 'better off dead', 'everyone would be better', 'tired of living',
    'escape the pain', 'permanent solution', 'hopeless', 'worthless',
    'better off without me', 'world without me', 'disappear forever',
    'burden to everyone', 'nobody would miss me', 'pain would stop',
    'tired of being alive', 'done with everything', 'can\'t take it',
    'give up on life', 'no reason to live', 'want it all to end',
    
    // Immediate danger
    'right now', 'tonight', 'today', 'have a plan', 'going to do it',
    'ready to end it', 'final decision', 'last time'
  ],
  
  medicalAdvice: [
    'you should take', 'recommended dosage', 'side effects', 'prescription',
    'medical condition', 'health condition', 'see a doctor', 'medical attention',
    'medical emergency', 'call 911', 'emergency room', 'hospital',
    'diagnosis', 'prognosis', 'medical treatment'
  ],
  
  assessmentLanguage: [
    'assessment', 'screening', 'evaluation', 'test results', 'score',
    'diagnostic criteria', 'psychological evaluation', 'mental status',
    'clinical assessment', 'psychological test', 'personality test'
  ]
};

// Crisis severity escalation patterns
const CRISIS_SEVERITY_PATTERNS = {
  high: [
    'plan to', 'going to', 'tonight', 'today', 'right now', 'have decided',
    'method', 'pills', 'rope', 'bridge', 'gun', 'knife'
  ],
  
  medium: [
    'thinking about', 'want to die', 'kill myself', 'end it all',
    'can\'t take it', 'too much pain', 'no hope', 'give up'
  ],
  
  low: [
    'sometimes think', 'wonder if', 'cross my mind', 'fleeting thoughts',
    'passive thoughts', 'wish I wasn\'t here'
  ]
};

// Professional care trigger terms
const PROFESSIONAL_CARE_TRIGGERS = [
  'need help', 'struggling', 'overwhelmed', 'can\'t cope', 'getting worse',
  'not getting better', 'therapy', 'counseling', 'medication', 'professional help',
  'mental health professional', 'therapist', 'counselor', 'psychiatrist'
];

/**
 * Analyzes content for health-related terms and determines disclaimer requirements
 */
export function analyzeHealthContent(text: string): HealthContentContext {
  const lowerText = text.toLowerCase();
  const triggeredKeywords: string[] = [];
  
  // Check for mental health content
  const containsMentalHealthContent = HEALTH_CONTENT_PATTERNS.mentalHealth.some(term => {
    if (lowerText.includes(term)) {
      triggeredKeywords.push(term);
      return true;
    }
    return false;
  });
  
  // Check for therapy terms
  const containsTherapyTerms = HEALTH_CONTENT_PATTERNS.therapyTerms.some(term => {
    if (lowerText.includes(term)) {
      triggeredKeywords.push(term);
      return true;
    }
    return false;
  });
  
  // Check for crisis language
  const containsCrisisLanguage = HEALTH_CONTENT_PATTERNS.crisisLanguage.some(term => {
    if (lowerText.includes(term)) {
      triggeredKeywords.push(term);
      return true;
    }
    return false;
  });
  
  // Check for medical advice patterns
  const containsMedicalAdvice = HEALTH_CONTENT_PATTERNS.medicalAdvice.some(term => {
    if (lowerText.includes(term)) {
      triggeredKeywords.push(term);
      return true;
    }
    return false;
  });
  
  // Check for assessment language
  const containsAssessmentLanguage = HEALTH_CONTENT_PATTERNS.assessmentLanguage.some(term => {
    if (lowerText.includes(term)) {
      triggeredKeywords.push(term);
      return true;
    }
    return false;
  });
  
  // Determine severity level
  let severityLevel: 'low' | 'medium' | 'high' | 'crisis' = 'low';
  let disclaimerType: 'standard' | 'elevated' | 'crisis' | 'therapy_boundary' = 'standard';
  
  if (containsCrisisLanguage) {
    // Check crisis severity
    const hasHighSeverity = CRISIS_SEVERITY_PATTERNS.high.some(term => lowerText.includes(term));
    const hasMediumSeverity = CRISIS_SEVERITY_PATTERNS.medium.some(term => lowerText.includes(term));
    
    if (hasHighSeverity) {
      severityLevel = 'crisis';
      disclaimerType = 'crisis';
    } else if (hasMediumSeverity) {
      severityLevel = 'high';
      disclaimerType = 'crisis';
    } else {
      severityLevel = 'medium';
      disclaimerType = 'elevated';
    }
  } else if (containsTherapyTerms || containsMedicalAdvice) {
    severityLevel = 'medium';
    disclaimerType = 'therapy_boundary';
  } else if (containsMentalHealthContent || containsAssessmentLanguage) {
    severityLevel = 'medium';
    disclaimerType = 'elevated';
  }
  
  // Check for professional care triggers
  const needsProfessionalCare = PROFESSIONAL_CARE_TRIGGERS.some(term => lowerText.includes(term));
  if (needsProfessionalCare && disclaimerType === 'standard') {
    disclaimerType = 'elevated';
  }
  
  const needsDisclaimer = containsMentalHealthContent || containsTherapyTerms || 
                         containsCrisisLanguage || containsMedicalAdvice || 
                         containsAssessmentLanguage || needsProfessionalCare;
  
  return {
    containsMentalHealthContent,
    containsTherapyTerms,
    containsCrisisLanguage,
    containsMedicalAdvice,
    containsAssessmentLanguage,
    severityLevel,
    triggeredKeywords,
    needsDisclaimer,
    disclaimerType
  };
}

/**
 * Generates appropriate disclaimer text based on context
 */
export function generateDisclaimerText(context: HealthContentContext): string {
  switch (context.disclaimerType) {
    case 'crisis':
      return "⚠️ **IMPORTANT SAFETY NOTICE**: ALCHM cannot provide emergency mental health care. If you're having thoughts of self-harm or suicide, please contact 988 (Suicide & Crisis Lifeline) or 911 immediately. Professional crisis counselors are available 24/7.";
      
    case 'therapy_boundary':
      return "💙 **Professional Care Reminder**: This AI guidance is educational and never replaces therapy or medical treatment. For ongoing mental health support, diagnosis, or treatment, please consult with licensed healthcare professionals or therapists.";
      
    case 'elevated':
      return "🤝 **Professional Support Available**: While ALCHM provides reflection tools, we encourage connecting with licensed mental health professionals for personalized care and support. Your wellbeing matters.";
      
    default:
      return "ℹ️ **Disclaimer**: ALCHM provides journaling and reflection tools for educational purposes. This is not therapy or medical treatment. For mental health concerns, consult licensed professionals.";
  }
}

/**
 * Enhanced AI response wrapper that ensures disclaimer compliance
 */
export function wrapResponseWithDisclaimer(
  aiResponse: string,
  userInput: string,
  context?: HealthContentContext
): { response: string; disclaimerAdded: boolean; context: HealthContentContext } {
  
  // Analyze both user input and AI response for health content
  const inputContext = context || analyzeHealthContent(userInput);
  const responseContext = analyzeHealthContent(aiResponse);
  
  // Combine contexts to get the highest severity
  const combinedContext: HealthContentContext = {
    containsMentalHealthContent: inputContext.containsMentalHealthContent || responseContext.containsMentalHealthContent,
    containsTherapyTerms: inputContext.containsTherapyTerms || responseContext.containsTherapyTerms,
    containsCrisisLanguage: inputContext.containsCrisisLanguage || responseContext.containsCrisisLanguage,
    containsMedicalAdvice: inputContext.containsMedicalAdvice || responseContext.containsMedicalAdvice,
    containsAssessmentLanguage: inputContext.containsAssessmentLanguage || responseContext.containsAssessmentLanguage,
    severityLevel: getSeverityLevel(inputContext.severityLevel, responseContext.severityLevel),
    triggeredKeywords: [...inputContext.triggeredKeywords, ...responseContext.triggeredKeywords],
    needsDisclaimer: inputContext.needsDisclaimer || responseContext.needsDisclaimer,
    disclaimerType: getDisclaimerType(inputContext.disclaimerType, responseContext.disclaimerType)
  };
  
  let finalResponse = aiResponse;
  let disclaimerAdded = false;
  
  // Add disclaimer if needed
  if (combinedContext.needsDisclaimer) {
    const disclaimerText = generateDisclaimerText(combinedContext);
    
    // For crisis situations, prepend the disclaimer
    if (combinedContext.disclaimerType === 'crisis') {
      finalResponse = `${disclaimerText}\n\n${aiResponse}`;
    } else {
      // For other situations, append the disclaimer
      finalResponse = `${aiResponse}\n\n---\n\n${disclaimerText}`;
    }
    
    disclaimerAdded = true;
  }
  
  return {
    response: finalResponse,
    disclaimerAdded,
    context: combinedContext
  };
}

/**
 * Helper function to determine the highest severity level
 */
function getSeverityLevel(level1: string, level2: string): 'low' | 'medium' | 'high' | 'crisis' {
  const levels = ['low', 'medium', 'high', 'crisis'];
  const index1 = levels.indexOf(level1);
  const index2 = levels.indexOf(level2);
  return levels[Math.max(index1, index2)] as 'low' | 'medium' | 'high' | 'crisis';
}

/**
 * Helper function to determine the appropriate disclaimer type
 */
function getDisclaimerType(type1: string, type2: string): 'standard' | 'elevated' | 'crisis' | 'therapy_boundary' {
  // Crisis always takes priority
  if (type1 === 'crisis' || type2 === 'crisis') return 'crisis';
  
  // Then therapy boundary
  if (type1 === 'therapy_boundary' || type2 === 'therapy_boundary') return 'therapy_boundary';
  
  // Then elevated
  if (type1 === 'elevated' || type2 === 'elevated') return 'elevated';
  
  return 'standard';
}

/**
 * Pre-response safety check - validates that disclaimers will be included
 */
export function validateDisclaimerCompliance(
  userInput: string,
  plannedResponse: string
): { compliant: boolean; reason?: string; requiredAction: string } {
  const context = analyzeHealthContent(userInput);
  const responseContext = analyzeHealthContent(plannedResponse);
  
  // Check if health content requires disclaimer
  if (context.needsDisclaimer || responseContext.needsDisclaimer) {
    // Verify disclaimer will be added
    const { disclaimerAdded } = wrapResponseWithDisclaimer(plannedResponse, userInput, context);
    
    if (!disclaimerAdded) {
      return {
        compliant: false,
        reason: 'Health content detected but disclaimer not applied',
        requiredAction: 'Add appropriate medical disclaimer before sending response'
      };
    }
  }
  
  // Check for crisis content requiring immediate disclaimer
  if (context.disclaimerType === 'crisis') {
    return {
      compliant: true,
      requiredAction: 'Crisis disclaimer must be prominently displayed and response modified for safety'
    };
  }
  
  return {
    compliant: true,
    requiredAction: 'No additional disclaimer required'
  };
}

export default {
  analyzeHealthContent,
  generateDisclaimerText,
  wrapResponseWithDisclaimer,
  validateDisclaimerCompliance
};