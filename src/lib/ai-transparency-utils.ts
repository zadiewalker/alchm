/**
 * AI Transparency Utilities for Server-Side Use
 * Ensures universal AI identification across all Khepera interactions
 * Maintains healing-centered experience while meeting regulatory requirements
 */

export interface AITransparencyConfig {
  showFullDisclosure?: boolean;
  includeCapabilityLimits?: boolean;
  emphasizeHumanConnection?: boolean;
  crisisMode?: boolean;
  contextualMode?: 'onboarding' | 'interaction' | 'settings' | 'crisis';
}

/**
 * Universal AI identification validator
 * Ensures every Khepera response includes proper identification
 */
export const validateAIIdentification = (response: string): boolean => {
  const requiredIdentifiers = [
    '✨ I am Khepera',
    'I am Khepera',
    'khepera',
    'AI'
  ];
  
  const lowerResponse = response.toLowerCase();
  return requiredIdentifiers.some(identifier => 
    lowerResponse.includes(identifier.toLowerCase())
  );
};

/**
 * Ensures AI identification is present in response
 * If missing, prepends the standard identification
 */
export const ensureAIIdentification = (response: string, config?: AITransparencyConfig): string => {
  if (validateAIIdentification(response)) {
    return response;
  }
  
  // Crisis mode - gentle but clear identification
  if (config?.crisisMode) {
    return `✨ I am Khepera, an AI companion here to support you. ${response}`;
  }
  
  // Standard identification
  if (response.startsWith('✨ I am Khepera')) {
    return response;
  }
  
  return `✨ I am Khepera. ${response}`;
};

/**
 * Crisis-specific AI identification for high-risk situations
 */
export const ensureCrisisAIIdentification = (response: string, severity: 'low' | 'medium' | 'high' = 'medium'): string => {
  const crisisIdentifiers = {
    low: "✨ I am Khepera, an AI companion. For immediate professional support, please reach out to a counselor or therapist.",
    medium: "✨ I am Khepera, an AI designed to support you. If you're experiencing a crisis, please contact a mental health professional immediately.",
    high: "✨ I am Khepera, an AI. This situation requires immediate human professional help. Please contact crisis services now."
  };
  
  if (validateAIIdentification(response)) {
    return response;
  }
  
  return `${crisisIdentifiers[severity]} ${response}`;
};

/**
 * Medical disclaimer compliance for AI responses
 */
export const ensureMedicalDisclaimerCompliance = (response: string, containsMedicalContent: boolean = false): string => {
  const medicalDisclaimer = "\n\n---\n\nℹ️ **Disclaimer**: ALCHM provides journaling and reflection tools for educational purposes. This is not therapy or medical treatment. For mental health concerns, consult licensed professionals.";
  
  // Always ensure AI identification first
  const identifiedResponse = ensureAIIdentification(response);
  
  // Add medical disclaimer if needed
  if (containsMedicalContent || response.toLowerCase().includes('medical') || response.toLowerCase().includes('therapy') || response.toLowerCase().includes('diagnosis')) {
    return identifiedResponse + medicalDisclaimer;
  }
  
  return identifiedResponse;
};

/**
 * Complete compliance wrapper for all AI responses
 */
export const ensureFullAICompliance = (
  response: string, 
  options: {
    crisisMode?: boolean;
    severity?: 'low' | 'medium' | 'high';
    containsMedicalContent?: boolean;
    contextualMode?: 'onboarding' | 'interaction' | 'settings' | 'crisis';
  } = {}
): string => {
  let compliantResponse = response;
  
  // Step 1: Ensure AI identification
  if (options.crisisMode && options.severity) {
    compliantResponse = ensureCrisisAIIdentification(compliantResponse, options.severity);
  } else {
    compliantResponse = ensureAIIdentification(compliantResponse, {
      crisisMode: options.crisisMode,
      contextualMode: options.contextualMode
    });
  }
  
  // Step 2: Add medical disclaimer if needed
  if (options.containsMedicalContent || options.crisisMode) {
    compliantResponse = ensureMedicalDisclaimerCompliance(compliantResponse, true);
  }
  
  return compliantResponse;
};