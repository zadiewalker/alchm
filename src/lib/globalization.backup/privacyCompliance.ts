/**
 * International Privacy Law Compliance Framework
 * 
 * Comprehensive system for handling global data protection regulations
 * including GDPR, LGPD, PIPEDA, CCPA, and other regional privacy laws
 * with special considerations for marginalized communities
 */

import { LegalFramework, LocaleConfig, getLocaleConfig } from './index';

export interface DataProcessingPurpose {
  id: string;
  name: string;
  description: string;
  legalBasis: 'consent' | 'legitimate_interest' | 'vital_interest' | 'legal_obligation' | 'public_task' | 'contract';
  essential: boolean;
  retention_period: string;
  third_parties: string[];
  cross_border_transfer: boolean;
  sensitive_data: boolean;
}

export interface PrivacyConsent {
  userId: string;
  locale: string;
  timestamp: Date;
  purposes: {
    [purposeId: string]: {
      consented: boolean;
      timestamp: Date;
      method: 'explicit' | 'implied' | 'opt_out';
      evidence: string;
    };
  };
  sensitiveDataConsent?: {
    health_data: boolean;
    racial_ethnic_origin: boolean;
    religious_beliefs: boolean;
    sexual_orientation: boolean;
    gender_identity: boolean;
    political_opinions: boolean;
    biometric_data: boolean;
  };
  withdrawalRequests: Array<{
    timestamp: Date;
    purposes: string[];
    status: 'pending' | 'processed' | 'denied';
    reason?: string;
  }>;
  minorConsent?: {
    hasParentalConsent: boolean;
    parentalConsentEvidence: string;
    guardianInfo: string;
  };
}

export interface DataRetentionPolicy {
  locale: string;
  legalFramework: LegalFramework;
  retentionRules: {
    [dataType: string]: {
      retentionPeriod: string;
      automaticDeletion: boolean;
      exceptions: string[];
      minorDataRules: string;
    };
  };
  deletionProcedures: {
    userRequested: string;
    automatic: string;
    legalHold: string;
  };
}

export interface PrivacyRights {
  locale: string;
  availableRights: {
    access: boolean;
    rectification: boolean;
    erasure: boolean;
    restrict_processing: boolean;
    data_portability: boolean;
    object_to_processing: boolean;
    withdraw_consent: boolean;
    lodge_complaint: boolean;
  };
  exerciseInstructions: {
    [right: string]: {
      method: string[];
      timeline: string;
      verification_required: boolean;
      fee: string;
    };
  };
  supervisoryAuthority?: {
    name: string;
    contact: string;
    website: string;
    complaintsProcess: string;
  };
}

/**
 * Global data processing purposes for ALCHM
 */
export const DATA_PROCESSING_PURPOSES: Record<string, DataProcessingPurpose> = {
  therapeutic_support: {
    id: 'therapeutic_support',
    name: 'Therapeutic AI Support',
    description: 'Provide personalized AI-powered therapeutic responses and journal analysis',
    legalBasis: 'consent',
    essential: true,
    retention_period: '7_years',
    third_parties: ['OpenAI', 'Google Cloud AI'],
    cross_border_transfer: true,
    sensitive_data: true
  },
  
  crisis_intervention: {
    id: 'crisis_intervention',
    name: 'Crisis Intervention',
    description: 'Monitor for crisis indicators and provide emergency resources',
    legalBasis: 'vital_interest',
    essential: true,
    retention_period: '10_years',
    third_parties: ['Crisis Hotline Partners'],
    cross_border_transfer: false,
    sensitive_data: true
  },
  
  community_features: {
    id: 'community_features',
    name: 'Community Healing Features',
    description: 'Enable anonymous sharing and peer support connections',
    legalBasis: 'consent',
    essential: false,
    retention_period: '5_years',
    third_parties: [],
    cross_border_transfer: false,
    sensitive_data: true
  },
  
  cultural_adaptation: {
    id: 'cultural_adaptation',
    name: 'Cultural Content Adaptation',
    description: 'Adapt content and responses based on cultural background',
    legalBasis: 'consent',
    essential: false,
    retention_period: '3_years',
    third_parties: [],
    cross_border_transfer: false,
    sensitive_data: true
  },
  
  platform_analytics: {
    id: 'platform_analytics',
    name: 'Platform Analytics',
    description: 'Aggregate usage analytics to improve platform effectiveness',
    legalBasis: 'legitimate_interest',
    essential: false,
    retention_period: '2_years',
    third_parties: ['Google Analytics'],
    cross_border_transfer: true,
    sensitive_data: false
  },
  
  research_participation: {
    id: 'research_participation',
    name: 'Mental Health Research',
    description: 'Contribute to anonymized mental health research (opt-in)',
    legalBasis: 'consent',
    essential: false,
    retention_period: '10_years',
    third_parties: ['Research Partners'],
    cross_border_transfer: true,
    sensitive_data: true
  }
};

/**
 * Regional data retention policies
 */
export const DATA_RETENTION_POLICIES: Record<string, DataRetentionPolicy> = {
  'gdpr': {
    locale: 'eu',
    legalFramework: {
      dataProtection: 'gdpr',
      dataResidencyRequired: true,
      crossBorderTransfer: 'restricted',
      mandatoryReporting: {
        required: false,
        conditions: [],
        exemptions: ['therapeutic_privilege']
      },
      mentalHealthLaws: {
        involuntaryHold: true,
        dutyToWarn: false,
        parentalConsent: false
      },
      lgbtqRights: {
        protectionLevel: 'full',
        conversionTherapyBan: true,
        genderAffirmingCare: true
      }
    },
    retentionRules: {
      journal_entries: {
        retentionPeriod: '7_years_or_user_deletion',
        automaticDeletion: false,
        exceptions: ['legal_hold', 'ongoing_therapy'],
        minorDataRules: 'Delete_at_18_unless_explicit_consent'
      },
      crisis_data: {
        retentionPeriod: '10_years',
        automaticDeletion: false,
        exceptions: ['vital_interest_ongoing'],
        minorDataRules: 'Special_protection_required'
      },
      analytics_data: {
        retentionPeriod: '2_years',
        automaticDeletion: true,
        exceptions: [],
        minorDataRules: 'Anonymize_immediately'
      },
      cultural_preferences: {
        retentionPeriod: '3_years_or_user_deletion',
        automaticDeletion: false,
        exceptions: [],
        minorDataRules: 'Parental_consent_required'
      }
    },
    deletionProcedures: {
      userRequested: 'Must_complete_within_30_days',
      automatic: 'Automated_deletion_after_retention_period',
      legalHold: 'Suspend_deletion_notify_user'
    }
  },
  
  'lgpd': {
    locale: 'br',
    legalFramework: {
      dataProtection: 'lgpd',
      dataResidencyRequired: true,
      crossBorderTransfer: 'restricted',
      mandatoryReporting: {
        required: true,
        conditions: ['child_abuse', 'elder_abuse'],
        exemptions: ['therapeutic_relationship']
      },
      mentalHealthLaws: {
        involuntaryHold: true,
        dutyToWarn: false,
        parentalConsent: true
      },
      lgbtqRights: {
        protectionLevel: 'full',
        conversionTherapyBan: true,
        genderAffirmingCare: true
      }
    },
    retentionRules: {
      journal_entries: {
        retentionPeriod: '5_years_or_user_deletion',
        automaticDeletion: false,
        exceptions: ['legal_obligation'],
        minorDataRules: 'Parental_consent_required'
      },
      crisis_data: {
        retentionPeriod: '8_years',
        automaticDeletion: false,
        exceptions: ['mandatory_reporting_cases'],
        minorDataRules: 'Enhanced_protection'
      },
      analytics_data: {
        retentionPeriod: '2_years',
        automaticDeletion: true,
        exceptions: [],
        minorDataRules: 'Anonymize_immediately'
      }
    },
    deletionProcedures: {
      userRequested: 'Must_complete_within_15_days',
      automatic: 'Automated_deletion_with_audit_log',
      legalHold: 'Notify_ANPD_and_user'
    }
  },
  
  'pipeda': {
    locale: 'ca',
    legalFramework: {
      dataProtection: 'pipeda',
      dataResidencyRequired: false,
      crossBorderTransfer: 'allowed',
      mandatoryReporting: {
        required: true,
        conditions: ['child_abuse', 'imminent_harm'],
        exemptions: ['therapeutic_privilege']
      },
      mentalHealthLaws: {
        involuntaryHold: true,
        dutyToWarn: true,
        parentalConsent: true
      },
      lgbtqRights: {
        protectionLevel: 'full',
        conversionTherapyBan: true,
        genderAffirmingCare: true
      }
    },
    retentionRules: {
      journal_entries: {
        retentionPeriod: '7_years_provincial_standards',
        automaticDeletion: false,
        exceptions: ['legal_proceedings'],
        minorDataRules: 'Provincial_healthcare_standards'
      },
      crisis_data: {
        retentionPeriod: '10_years',
        automaticDeletion: false,
        exceptions: ['duty_to_warn_cases'],
        minorDataRules: 'Enhanced_parental_notification'
      }
    },
    deletionProcedures: {
      userRequested: 'Must_complete_within_30_days',
      automatic: 'Follow_provincial_healthcare_standards',
      legalHold: 'Notify_privacy_commissioner'
    }
  },
  
  'ccpa': {
    locale: 'us-ca',
    legalFramework: {
      dataProtection: 'ccpa',
      dataResidencyRequired: false,
      crossBorderTransfer: 'allowed',
      mandatoryReporting: {
        required: true,
        conditions: ['imminent_harm_self', 'imminent_harm_others', 'child_abuse'],
        exemptions: ['past_trauma', 'therapeutic_relationship']
      },
      mentalHealthLaws: {
        involuntaryHold: true,
        dutyToWarn: true,
        parentalConsent: true
      },
      lgbtqRights: {
        protectionLevel: 'full',
        conversionTherapyBan: true,
        genderAffirmingCare: true
      }
    },
    retentionRules: {
      journal_entries: {
        retentionPeriod: '7_years_hipaa_standards',
        automaticDeletion: false,
        exceptions: ['legal_hold', 'ongoing_treatment'],
        minorDataRules: 'HIPAA_minor_protections'
      },
      crisis_data: {
        retentionPeriod: '10_years',
        automaticDeletion: false,
        exceptions: ['mandatory_reporting_ongoing'],
        minorDataRules: 'Enhanced_minor_protections'
      }
    },
    deletionProcedures: {
      userRequested: 'Must_complete_within_45_days',
      automatic: 'Follow_HIPAA_standards',
      legalHold: 'Standard_litigation_hold_procedures'
    }
  }
};

/**
 * Regional privacy rights configurations
 */
export const PRIVACY_RIGHTS: Record<string, PrivacyRights> = {
  'gdpr': {
    locale: 'eu',
    availableRights: {
      access: true,
      rectification: true,
      erasure: true,
      restrict_processing: true,
      data_portability: true,
      object_to_processing: true,
      withdraw_consent: true,
      lodge_complaint: true
    },
    exerciseInstructions: {
      access: {
        method: ['email', 'online_form'],
        timeline: '30_days',
        verification_required: true,
        fee: 'free'
      },
      erasure: {
        method: ['email', 'online_form'],
        timeline: '30_days',
        verification_required: true,
        fee: 'free'
      },
      data_portability: {
        method: ['online_form'],
        timeline: '30_days',
        verification_required: true,
        fee: 'free'
      }
    },
    supervisoryAuthority: {
      name: 'Local Data Protection Authority',
      contact: 'varies_by_country',
      website: 'https://edpb.europa.eu/about-edpb/about-edpb/members_en',
      complaintsProcess: 'Contact your local DPA for complaints procedure'
    }
  },
  
  'lgpd': {
    locale: 'br',
    availableRights: {
      access: true,
      rectification: true,
      erasure: true,
      restrict_processing: true,
      data_portability: true,
      object_to_processing: true,
      withdraw_consent: true,
      lodge_complaint: true
    },
    exerciseInstructions: {
      access: {
        method: ['email', 'online_form'],
        timeline: '15_days',
        verification_required: true,
        fee: 'free'
      },
      erasure: {
        method: ['email', 'online_form'],
        timeline: '15_days',
        verification_required: true,
        fee: 'free'
      }
    },
    supervisoryAuthority: {
      name: 'Autoridade Nacional de Proteção de Dados (ANPD)',
      contact: 'anpd@anpd.gov.br',
      website: 'https://www.gov.br/anpd/',
      complaintsProcess: 'File complaint online through ANPD website'
    }
  }
};

/**
 * Get appropriate privacy compliance framework for locale
 */
export function getPrivacyCompliance(locale: string): {
  retentionPolicy: DataRetentionPolicy;
  privacyRights: PrivacyRights;
  consentRequirements: ConsentRequirements;
} {
  const localeConfig = getLocaleConfig(locale);
  const framework = localeConfig.legalFramework.dataProtection;
  
  const retentionPolicy = DATA_RETENTION_POLICIES[framework] || DATA_RETENTION_POLICIES['gdpr'];
  const privacyRights = PRIVACY_RIGHTS[framework] || PRIVACY_RIGHTS['gdpr'];
  const consentRequirements = getConsentRequirements(localeConfig);
  
  return {
    retentionPolicy,
    privacyRights,
    consentRequirements
  };
}

export interface ConsentRequirements {
  explicitConsent: string[];
  impliedConsent: string[];
  minorConsentAge: number;
  parentalConsentRequired: boolean;
  sensitiveDataExtraProtection: boolean;
  withdrawalMechanism: string;
  consentRecordingRequired: boolean;
  granularConsent: boolean;
}

function getConsentRequirements(localeConfig: LocaleConfig): ConsentRequirements {
  const framework = localeConfig.legalFramework.dataProtection;
  
  switch (framework) {
    case 'gdpr':
      return {
        explicitConsent: ['sensitive_data', 'marketing', 'research_participation'],
        impliedConsent: [],
        minorConsentAge: 16,
        parentalConsentRequired: true,
        sensitiveDataExtraProtection: true,
        withdrawalMechanism: 'as_easy_as_giving_consent',
        consentRecordingRequired: true,
        granularConsent: true
      };
      
    case 'lgpd':
      return {
        explicitConsent: ['sensitive_data', 'all_processing'],
        impliedConsent: [],
        minorConsentAge: 18,
        parentalConsentRequired: true,
        sensitiveDataExtraProtection: true,
        withdrawalMechanism: 'simple_accessible',
        consentRecordingRequired: true,
        granularConsent: true
      };
      
    case 'pipeda':
      return {
        explicitConsent: ['sensitive_data'],
        impliedConsent: ['analytics', 'service_improvement'],
        minorConsentAge: 16,
        parentalConsentRequired: true,
        sensitiveDataExtraProtection: true,
        withdrawalMechanism: 'reasonable_manner',
        consentRecordingRequired: true,
        granularConsent: false
      };
      
    case 'ccpa':
      return {
        explicitConsent: ['sale_of_data'],
        impliedConsent: ['service_provision'],
        minorConsentAge: 13,
        parentalConsentRequired: true,
        sensitiveDataExtraProtection: false,
        withdrawalMechanism: 'opt_out_available',
        consentRecordingRequired: false,
        granularConsent: false
      };
      
    default:
      return {
        explicitConsent: ['sensitive_data'],
        impliedConsent: ['service_provision'],
        minorConsentAge: 18,
        parentalConsentRequired: true,
        sensitiveDataExtraProtection: true,
        withdrawalMechanism: 'accessible',
        consentRecordingRequired: true,
        granularConsent: true
      };
  }
}

/**
 * Validate user consent against legal requirements
 */
export function validateConsent(
  consent: PrivacyConsent,
  locale: string
): {
  isValid: boolean;
  missingConsents: string[];
  warnings: string[];
  recommendations: string[];
} {
  const compliance = getPrivacyCompliance(locale);
  const requirements = compliance.consentRequirements;
  
  const missingConsents: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let isValid = true;
  
  // Check explicit consent requirements
  requirements.explicitConsent.forEach(purpose => {
    if (!consent.purposes[purpose] || !consent.purposes[purpose].consented) {
      missingConsents.push(purpose);
      isValid = false;
    }
    
    if (consent.purposes[purpose]?.method !== 'explicit') {
      warnings.push(`${purpose} requires explicit consent but was given as ${consent.purposes[purpose]?.method}`);
    }
  });
  
  // Check sensitive data consent
  if (requirements.sensitiveDataExtraProtection && consent.sensitiveDataConsent) {
    const sensitiveFields = Object.entries(consent.sensitiveDataConsent);
    sensitiveFields.forEach(([field, consented]) => {
      if (consented && !consent.purposes['therapeutic_support']?.consented) {
        warnings.push(`Sensitive data consent for ${field} given without therapeutic support consent`);
      }
    });
  }
  
  // Minor consent validation
  if (consent.minorConsent) {
    if (!consent.minorConsent.hasParentalConsent && requirements.parentalConsentRequired) {
      missingConsents.push('parental_consent');
      isValid = false;
    }
  }
  
  // Consent recording validation
  if (requirements.consentRecordingRequired) {
    Object.entries(consent.purposes).forEach(([purpose, details]) => {
      if (!details.evidence) {
        warnings.push(`Missing consent evidence for ${purpose}`);
      }
    });
  }
  
  // Recommendations
  if (requirements.granularConsent) {
    recommendations.push('Consider offering more granular consent options');
  }
  
  if (!consent.purposes['crisis_intervention']?.consented) {
    recommendations.push('Crisis intervention consent recommended for safety');
  }
  
  return {
    isValid,
    missingConsents,
    warnings,
    recommendations
  };
}

/**
 * Generate privacy notice content for locale
 */
export function generatePrivacyNotice(locale: string): {
  title: string;
  sections: Array<{
    title: string;
    content: string;
    legal_basis?: string;
  }>;
  contactInfo: {
    dpo_contact?: string;
    privacy_officer: string;
    supervisory_authority?: string;
  };
} {
  const compliance = getPrivacyCompliance(locale);
  const localeConfig = getLocaleConfig(locale);
  
  const sections = [
    {
      title: 'What information we collect',
      content: `We collect information you provide directly to us, such as journal entries, crisis reports, and cultural preferences. We also collect information about how you use our platform to provide personalized therapeutic support.`,
      legal_basis: 'consent_and_legitimate_interest'
    },
    {
      title: 'How we use your information',
      content: `We use your information to provide AI-powered therapeutic support, crisis intervention services, and culturally-adapted healing resources. Your data helps us ensure you receive appropriate and safe mental health support.`,
      legal_basis: 'consent_and_vital_interest'
    },
    {
      title: 'Data sharing and transfers',
      content: compliance.retentionPolicy.legalFramework.crossBorderTransfer === 'prohibited' 
        ? 'Your data is stored locally within your country and is not transferred internationally.'
        : 'We may transfer your data internationally only with appropriate safeguards and your consent.',
      legal_basis: 'adequacy_decisions_and_safeguards'
    },
    {
      title: 'Your rights',
      content: generateRightsDescription(compliance.privacyRights),
      legal_basis: 'data_protection_law'
    },
    {
      title: 'Special protections for marginalized communities',
      content: `We provide enhanced privacy protections for LGBTQ+ individuals, people of color, immigrants, and other marginalized communities. This includes additional safeguards against discrimination and enhanced anonymization options.`
    },
    {
      title: 'Data retention',
      content: generateRetentionDescription(compliance.retentionPolicy)
    },
    {
      title: 'Crisis intervention and mandatory reporting',
      content: generateMandatoryReportingDescription(localeConfig.legalFramework)
    }
  ];
  
  return {
    title: 'Privacy Notice - Your Mental Health Data Rights',
    sections,
    contactInfo: {
      dpo_contact: compliance.retentionPolicy.legalFramework.dataProtection === 'gdpr' 
        ? 'dpo@alchm.app' : undefined,
      privacy_officer: 'privacy@alchm.app',
      supervisory_authority: compliance.privacyRights.supervisoryAuthority?.contact
    }
  };
}

function generateRightsDescription(privacyRights: PrivacyRights): string {
  const rights = Object.entries(privacyRights.availableRights)
    .filter(([_, available]) => available)
    .map(([right, _]) => right.replace('_', ' '))
    .join(', ');
  
  return `You have the right to: ${rights}. You can exercise these rights by contacting our privacy team. Some rights may be subject to limitations to protect the therapeutic relationship and ensure your safety.`;
}

function generateRetentionDescription(retentionPolicy: DataRetentionPolicy): string {
  return `We retain your data according to legal and therapeutic standards. Journal entries are typically kept for ${retentionPolicy.retentionRules.journal_entries?.retentionPeriod || '7 years'}, while crisis intervention data may be retained longer for safety purposes. You can request deletion of your data, subject to legal obligations.`;
}

function generateMandatoryReportingDescription(legalFramework: LegalFramework): string {
  if (!legalFramework.mandatoryReporting.required) {
    return 'We generally maintain strict confidentiality and do not report your information to authorities without your consent.';
  }
  
  const conditions = legalFramework.mandatoryReporting.conditions.join(', ');
  return `In limited circumstances, we may be legally required to report information to protect your safety or others. This includes: ${conditions}. We will inform you if such reporting is necessary unless it would increase risk to you or others.`;
}

/**
 * Handle data subject rights requests
 */
export async function processRightsRequest(
  request: {
    type: 'access' | 'erasure' | 'rectification' | 'restrict' | 'portability' | 'object';
    userId: string;
    locale: string;
    details: any;
  }
): Promise<{
  status: 'approved' | 'denied' | 'partial';
  reason?: string;
  timeline: string;
  actions_taken: string[];
  limitations: string[];
}> {
  const compliance = getPrivacyCompliance(request.locale);
  const timeline = compliance.privacyRights.exerciseInstructions[request.type]?.timeline || '30_days';
  
  // This would integrate with actual data processing systems
  // For now, returning a template response
  
  const actions_taken: string[] = [];
  const limitations: string[] = [];
  
  switch (request.type) {
    case 'access':
      actions_taken.push('Compiled personal data from all systems');
      actions_taken.push('Prepared data export in machine-readable format');
      break;
      
    case 'erasure':
      // Check for legitimate interests that override erasure
      if (hasOngoingTherapeuticRelationship(request.userId)) {
        limitations.push('Some therapeutic data retained for ongoing care');
      }
      if (hasLegalHold(request.userId)) {
        limitations.push('Some data subject to legal hold');
      }
      actions_taken.push('Deleted non-essential personal data');
      actions_taken.push('Anonymized retained data where possible');
      break;
      
    case 'rectification':
      actions_taken.push('Updated incorrect personal information');
      actions_taken.push('Notified relevant third parties of corrections');
      break;
  }
  
  return {
    status: limitations.length > 0 ? 'partial' : 'approved',
    reason: limitations.length > 0 ? 'Some data protected by therapeutic privilege' : undefined,
    timeline,
    actions_taken,
    limitations
  };
}

// Helper functions (would be implemented with actual data systems)
function hasOngoingTherapeuticRelationship(userId: string): boolean {
  // Check if user has active therapeutic sessions
  return false; // Placeholder
}

function hasLegalHold(userId: string): boolean {
  // Check if data is subject to legal proceedings
  return false; // Placeholder
}

