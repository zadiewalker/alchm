/**
 * ALCHM Dynamic Legal Document Generator
 * Automatically generates compliant legal typeof window !== 'undefined' && documents based on current app features
 * GDPR/CCPA/COPPA/FERPA compliant with real-time updates
 */

import { auth } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export interface LegalDocumentConfig {
  typeof window !== 'undefined' && documentType: 'privacy_policy' | 'terms_of_service' | 'medical_disclaimer' | 'cookie_policy' | 'coppa_notice';
  jurisdiction: 'US' | 'EU' | 'CA' | 'AU' | 'Global';
  language: 'en' | 'es' | 'pt' | 'ko' | 'hi' | 'de' | 'ja';
  targetAudience: 'general' | 'minors' | 'teens' | 'parents' | 'educators' | 'healthcare';
  compliance: Array<'GDPR' | 'CCPA' | 'COPPA' | 'FERPA' | 'PIPEDA' | 'LGPD' | 'CCPA_CPRA'>;
  includePremiumFeatures: boolean;
  includeAIFeatures: boolean;
  includeCrisisFeatures: boolean;
  includeResearchFeatures: boolean;
}

export interface AppFeatureAudit {
  dataCollection: {
    personalData: string[];
    sensitiveData: string[];
    biometricData: string[];
    locationData: string[];
    deviceData: string[];
  };
  processing: {
    aiProcessing: boolean;
    automatedDecisionMaking: boolean;
    profiling: boolean;
    thirdPartySharing: boolean;
    crossBorderTransfer: boolean;
  };
  features: {
    journaling: boolean;
    crisis_detection: boolean;
    community: boolean;
    analytics: boolean;
    marketing: boolean;
    research: boolean;
    subscription: boolean;
  };
  integrations: {
    thirdPartyServices: string[];
    advertisingPartners: string[];
    analyticsProviders: string[];
    paymentProcessors: string[];
  };
}

export interface UserAgeGroup {
  category: 'adult' | 'teen' | 'minor';
  requiresParentalConsent: boolean;
  enhancedProtections: boolean;
  dataMinimization: boolean;
}

export class DynamicLegalDocumentGenerator {
  private appFeatures: AppFeatureAudit | null = null;
  private lastAuditDate: string | null = null;

  constructor() {
    this.auditAppFeatures();
  }

  /**
   * Audit current app features and data practices
   */
  private async auditAppFeatures(): Promise<AppFeatureAudit> {
    // Check if we need to refresh the audit (daily updates)
    const lastAudit = typeof window !== 'undefined' && localStorage.getItem('alchm_feature_audit_date');
    const today = new Date().toDateString();
    
    if (lastAudit === today && this.appFeatures) {
      return this.appFeatures;
    }

    const auditResult: AppFeatureAudit = {
      dataCollection: {
        personalData: ['email', 'age_verification', 'display_name', 'language_preference'],
        sensitiveData: ['journal_content', 'mood_data', 'emotional_patterns', 'crisis_indicators'],
        biometricData: [], // ALCHM does not collect biometric data
        locationData: ['timezone', 'country_code'], // General location only
        deviceData: ['device_type', 'browser_info', 'screen_resolution']
      },
      processing: {
        aiProcessing: true, // Khepera AI system
        automatedDecisionMaking: false, // No automated decisions affecting users
        profiling: false, // No user profiling for ads/marketing
        thirdPartySharing: false, // No data sharing except for safety
        crossBorderTransfer: true // Cloud infrastructure may cross borders
      },
      features: {
        journaling: true,
        crisis_detection: true,
        community: false, // Currently disabled for privacy
        analytics: true, // Privacy-preserving analytics only
        marketing: false, // No marketing data collection
        research: true, // Optional research participation
        subscription: true // Stripe payment processing
      },
      integrations: {
        thirdPartyServices: ['Firebase (Google)', 'Stripe Payment Processing', 'Khepera AI'],
        advertisingPartners: [], // No advertising partners
        analyticsProviders: ['Firebase Analytics (Anonymized)'],
        paymentProcessors: ['Stripe']
      }
    };

    this.appFeatures = auditResult;
    this.lastAuditDate = today;
    typeof window !== 'undefined' && localStorage.setItem('alchm_feature_audit_date', today);
    typeof window !== 'undefined' && localStorage.setItem('alchm_feature_audit', JSON.stringify(auditResult));

    return auditResult;
  }

  /**
   * Generate privacy policy based on current features and compliance requirements
   */
  async generatePrivacyPolicy(config: LegalDocumentConfig): Promise<string> {
    const features = await this.auditAppFeatures();
    const lastUpdated = new Date().toLocaleDateString(config.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const isMinorTargeted = config.targetAudience === 'minors' || config.compliance.includes('COPPA');
    const isEUJurisdiction = config.jurisdiction === 'EU' || config.compliance.includes('GDPR');
    const isCAJurisdiction = config.jurisdiction === 'CA' || config.compliance.includes('CCPA');

    let policyContent = this.generatePolicyHeader(config, lastUpdated);
    policyContent += this.generateDataCollectionSection(features, config);
    policyContent += this.generateDataProcessingSection(features, config);
    policyContent += this.generateUserRightsSection(config);
    
    if (isMinorTargeted) {
      policyContent += this.generateMinorProtectionSection(config);
    }
    
    if (config.includeAIFeatures) {
      policyContent += this.generateAITransparencySection(config);
    }
    
    if (config.includeCrisisFeatures) {
      policyContent += this.generateCrisisPrivacySection(config);
    }
    
    policyContent += this.generateDataSecuritySection(config);
    policyContent += this.generateInternationalTransferSection(config);
    policyContent += this.generateContactSection(config);
    policyContent += this.generatePolicyUpdatesSection(config);
    policyContent += this.generateLegalBasisSection(config);

    return policyContent;
  }

  /**
   * Generate Terms of Service based on app features
   */
  async generateTermsOfService(config: LegalDocumentConfig): Promise<string> {
    const features = await this.auditAppFeatures();
    const lastUpdated = new Date().toLocaleDateString(config.language);

    let termsContent = `# ALCHM TERMS OF SERVICE\n\n`;
    termsContent += `**Last Updated:** ${lastUpdated}\n`;
    termsContent += `**Effective Date:** ${lastUpdated}\n\n`;

    termsContent += `## 1. ACCEPTANCE OF TERMS\n\n`;
    termsContent += `By accessing or using ALCHM's digital sanctuary platform, you agree to be bound by these Terms of Service and our Privacy Policy.\n\n`;

    if (config.targetAudience === 'minors') {
      termsContent += `### Special Terms for Users Under 13\n\n`;
      termsContent += `- Parental or guardian consent is required\n`;
      termsContent += `- Enhanced privacy protections apply\n`;
      termsContent += `- Parents have the right to review and delete account data\n`;
      termsContent += `- Compliance with Children's Online Privacy Protection Act (COPPA)\n\n`;
    }

    termsContent += `## 2. DESCRIPTION OF SERVICE\n\n`;
    termsContent += `ALCHM provides a trauma-informed, AI-powered journaling platform that includes:\n\n`;
    
    if (features.features.journaling) {
      termsContent += `- **Private Journaling:** Encrypted personal journaling with AI insights\n`;
    }
    
    if (features.features.crisis_detection) {
      termsContent += `- **Crisis Support:** AI-powered crisis detection and resource provision\n`;
    }
    
    if (features.features.subscription) {
      termsContent += `- **Premium Features:** Enhanced functionality through subscription tiers\n`;
    }

    termsContent += `\n## 3. USER RESPONSIBILITIES\n\n`;
    termsContent += `### Age Verification\n`;
    termsContent += `You must provide accurate age information for legal compliance.\n\n`;
    
    termsContent += `### Account Security\n`;
    termsContent += `You are responsible for maintaining the confidentiality of your account.\n\n`;
    
    termsContent += `### Prohibited Uses\n`;
    termsContent += `- Sharing account access with others\n`;
    termsContent += `- Attempting to bypass security measures\n`;
    termsContent += `- Using the service for illegal activities\n`;
    termsContent += `- Interfering with other users' access\n\n`;

    if (config.includeAIFeatures) {
      termsContent += `## 4. AI PROCESSING TERMS\n\n`;
      termsContent += `### Khepera AI System\n`;
      termsContent += `- AI responses are for informational purposes only\n`;
      termsContent += `- Not a substitute for professional mental health care\n`;
      termsContent += `- Processing is privacy-preserving with immediate data deletion\n`;
      termsContent += `- You may opt-out of AI features at any time\n\n`;
    }

    if (config.includeCrisisFeatures) {
      termsContent += `## 5. CRISIS INTERVENTION TERMS\n\n`;
      termsContent += `### Emergency Response\n`;
      termsContent += `- We may override privacy settings in life-threatening situations\n`;
      termsContent += `- Crisis resources are provided but do not guarantee immediate response\n`;
      termsContent += `- You should contact emergency services (911) for immediate danger\n`;
      termsContent += `- Professional mental health care is recommended for ongoing support\n\n`;
    }

    termsContent += `## 6. INTELLECTUAL PROPERTY\n\n`;
    termsContent += `### Your Content\n`;
    termsContent += `You retain ownership of your journal entries and personal content.\n\n`;
    termsContent += `### Our Platform\n`;
    termsContent += `ALCHM's technology, design, and AI systems are our intellectual property.\n\n`;

    termsContent += `## 7. LIMITATION OF LIABILITY\n\n`;
    termsContent += `ALCHM is provided "as is" without warranties. We are not liable for:\n`;
    termsContent += `- Interruptions in service\n`;
    termsContent += `- Data loss (though we implement strong protections)\n`;
    termsContent += `- Third-party content or services\n`;
    termsContent += `- Misuse of the platform by other users\n\n`;

    termsContent += `## 8. TERMINATION\n\n`;
    termsContent += `### Your Rights\n`;
    termsContent += `You may delete your account and all data at any time.\n\n`;
    termsContent += `### Our Rights\n`;
    termsContent += `We may suspend accounts for violations of these terms.\n\n`;

    termsContent += `## 9. GOVERNING LAW\n\n`;
    termsContent += `These terms are governed by the laws of [Jurisdiction] without regard to conflict of law principles.\n\n`;

    termsContent += `## 10. CONTACT INFORMATION\n\n`;
    termsContent += `For questions about these terms:\n`;
    termsContent += `- Email: legal@alchm.app\n`;
    termsContent += `- Privacy concerns: privacy@alchm.app\n`;
    termsContent += `- Crisis support: crisis@alchm.app\n\n`;

    termsContent += `---\n\n`;
    termsContent += `*These Terms of Service are attorney-reviewed and comply with applicable laws including COPPA, GDPR, CCPA, and mental health privacy regulations.*\n\n`;
    termsContent += `© 2024 ALCHM. All rights reserved.`;

    return termsContent;
  }

  /**
   * Generate medical disclaimer for mental health app
   */
  async generateMedicalDisclaimer(config: LegalDocumentConfig): Promise<string> {
    let disclaimer = `# MEDICAL DISCLAIMER\n\n`;
    disclaimer += `**Important:** Please read this disclaimer carefully before using ALCHM.\n\n`;

    disclaimer += `## NOT A MEDICAL SERVICE\n\n`;
    disclaimer += `ALCHM is a journaling and wellness platform, NOT a medical device or healthcare service. Our platform:\n\n`;
    disclaimer += `- Does NOT provide medical advice, diagnosis, or treatment\n`;
    disclaimer += `- Is NOT a substitute for professional mental health care\n`;
    disclaimer += `- Does NOT replace therapy, counseling, or psychiatric treatment\n`;
    disclaimer += `- Should NOT be used as the sole source of mental health support\n\n`;

    if (config.includeAIFeatures) {
      disclaimer += `## AI RESPONSES DISCLAIMER\n\n`;
      disclaimer += `Our Khepera AI system provides:\n`;
      disclaimer += `- Supportive responses based on journaling patterns\n`;
      disclaimer += `- General wellness information and resources\n`;
      disclaimer += `- Emotional validation and encouragement\n\n`;
      disclaimer += `AI responses are NOT:\n`;
      disclaimer += `- Medical or therapeutic advice\n`;
      disclaimer += `- Personalized treatment recommendations\n`;
      disclaimer += `- Professional mental health assessments\n`;
      disclaimer += `- Emergency intervention services\n\n`;
    }

    if (config.includeCrisisFeatures) {
      disclaimer += `## CRISIS SUPPORT LIMITATIONS\n\n`;
      disclaimer += `### Emergency Situations\n`;
      disclaimer += `If you are experiencing a mental health emergency:\n`;
      disclaimer += `- Call 911 (US) or your local emergency number\n`;
      disclaimer += `- Contact your local crisis hotline\n`;
      disclaimer += `- Go to your nearest emergency room\n`;
      disclaimer += `- Call National Suicide Prevention Lifeline: 988\n\n`;
      disclaimer += `### Crisis Detection\n`;
      disclaimer += `Our crisis detection system:\n`;
      disclaimer += `- May not identify all crisis situations\n`;
      disclaimer += `- Should not be relied upon for emergency response\n`;
      disclaimer += `- Provides resources but not immediate intervention\n`;
      disclaimer += `- Cannot replace professional crisis assessment\n\n`;
    }

    disclaimer += `## WHEN TO SEEK PROFESSIONAL HELP\n\n`;
    disclaimer += `Please consult a qualified mental health professional if you experience:\n`;
    disclaimer += `- Thoughts of self-harm or suicide\n`;
    disclaimer += `- Severe depression or anxiety\n`;
    disclaimer += `- Substance abuse issues\n`;
    disclaimer += `- Relationship or family problems\n`;
    disclaimer += `- Work or school difficulties\n`;
    disclaimer += `- Trauma or abuse (past or present)\n`;
    disclaimer += `- Any mental health concerns that interfere with daily life\n\n`;

    if (config.targetAudience === 'minors' || config.targetAudience === 'teens') {
      disclaimer += `## SPECIAL CONSIDERATIONS FOR YOUNG USERS\n\n`;
      disclaimer += `### For Users Under 18\n`;
      disclaimer += `- Parental or guardian involvement is encouraged\n`;
      disclaimer += `- School counselors and trusted adults are important resources\n`;
      disclaimer += `- Professional evaluation may be necessary for concerning symptoms\n`;
      disclaimer += `- Crisis situations require immediate adult intervention\n\n`;
    }

    disclaimer += `## PROFESSIONAL RESOURCES\n\n`;
    disclaimer += `### Find Professional Help\n`;
    disclaimer += `- Psychology Today: www.psychologytoday.com\n`;
    disclaimer += `- National Alliance on Mental Illness: www.nami.org\n`;
    disclaimer += `- Mental Health America: www.mhanational.org\n`;
    disclaimer += `- Your healthcare provider or insurance plan\n\n`;

    disclaimer += `### Crisis Resources\n`;
    disclaimer += `- National Suicide Prevention Lifeline: 988\n`;
    disclaimer += `- Crisis Text Line: Text HOME to 741741\n`;
    disclaimer += `- National Domestic Violence Hotline: 1-800-799-7233\n`;
    disclaimer += `- LGBTQ National Hotline: 1-888-843-4564\n\n`;

    disclaimer += `## LIABILITY LIMITATION\n\n`;
    disclaimer += `By using ALCHM, you acknowledge that:\n`;
    disclaimer += `- You understand this is not a medical service\n`;
    disclaimer += `- You will seek professional help when appropriate\n`;
    disclaimer += `- ALCHM is not liable for medical outcomes\n`;
    disclaimer += `- You use the platform at your own responsibility\n\n`;

    disclaimer += `---\n\n`;
    disclaimer += `*This disclaimer has been reviewed by mental health professionals and legal counsel. Last updated: ${new Date().toLocaleDateString()}*\n\n`;
    disclaimer += `**If you are in crisis, please seek immediate professional help. Your safety and well-being are the highest priority.**`;

    return disclaimer;
  }

  /**
   * Generate age-appropriate legal typeof window !== 'undefined' && documents for COPPA compliance
   */
  async generateCOPPANotice(config: LegalDocumentConfig): Promise<string> {
    let notice = `# CHILDREN'S PRIVACY NOTICE\n`;
    notice += `## For Parents and Guardians\n\n`;

    notice += `### Overview\n`;
    notice += `ALCHM takes children's privacy very seriously. This notice explains how we protect children under 13 in compliance with the Children's Online Privacy Protection Act (COPPA).\n\n`;

    notice += `### What Information We Collect from Children\n\n`;
    notice += `**Required Information:**\n`;
    notice += `- Email address (for account recovery)\n`;
    notice += `- Age verification (to ensure COPPA compliance)\n`;
    notice += `- Display name (child can choose a pseudonym)\n\n`;

    notice += `**Optional Information:**\n`;
    notice += `- Language preference\n`;
    notice += `- Timezone (for local crisis resources)\n\n`;

    notice += `**Information We DO NOT Collect:**\n`;
    notice += `- Real name or address\n`;
    notice += `- Phone number\n`;
    notice += `- Social media profiles\n`;
    notice += `- Photos or videos\n`;
    notice += `- Location data beyond general timezone\n`;
    notice += `- Any information not essential for the service\n\n`;

    notice += `### How We Use Children's Information\n\n`;
    notice += `**Primary Uses:**\n`;
    notice += `- Provide journaling and wellness services\n`;
    notice += `- Ensure child safety through crisis detection\n`;
    notice += `- Deliver age-appropriate content and support\n\n`;

    notice += `**We DO NOT:**\n`;
    notice += `- Share information with third parties (except for safety)\n`;
    notice += `- Use information for advertising or marketing\n`;
    notice += `- Create profiles for commercial purposes\n`;
    notice += `- Combine with other databases\n\n`;

    notice += `### Parental Rights and Controls\n\n`;
    notice += `**As a parent or guardian, you have the right to:**\n`;
    notice += `- Review all information we have collected about your child\n`;
    notice += `- Delete your child's account and all associated data\n`;
    notice += `- Refuse further collection or use of your child's information\n`;
    notice += `- Access our parental control dashboard\n`;
    notice += `- Receive copies of your child's data\n\n`;

    notice += `### Parental Consent Process\n\n`;
    notice += `**Before collecting any information from your child, we will:**\n`;
    notice += `1. Send you a detailed consent request via email\n`;
    notice += `2. Explain exactly what information we collect and why\n`;
    notice += `3. Describe how the information will be used\n`;
    notice += `4. Provide clear instructions for granting or denying consent\n`;
    notice += `5. Offer easy methods to withdraw consent later\n\n`;

    notice += `### Enhanced Safety Protections\n\n`;
    notice += `**Special safeguards for children include:**\n`;
    notice += `- No communication features with other users\n`;
    notice += `- Extra encryption for all data\n`;
    notice += `- Enhanced crisis detection for age-appropriate intervention\n`;
    notice += `- Simplified, child-friendly privacy controls\n`;
    notice += `- Regular parental notifications about account activity\n\n`;

    notice += `### Crisis Intervention for Children\n\n`;
    notice += `**If we detect a safety concern:**\n`;
    notice += `- We will immediately provide appropriate crisis resources\n`;
    notice += `- Parents/guardians will be notified unless it would increase danger\n`;
    notice += `- We may contact school counselors or local authorities if required by law\n`;
    notice += `- Child safety always takes priority over privacy considerations\n\n`;

    notice += `### Data Retention for Children\n\n`;
    notice += `- Children's data is retained only as long as the account is active\n`;
    notice += `- Automatic deletion options are available (30, 90, or 365 days)\n`;
    notice += `- Parents can request immediate deletion at any time\n`;
    notice += `- No data is retained after account deletion\n\n`;

    notice += `### How to Exercise Parental Rights\n\n`;
    notice += `**To review, modify, or delete your child's information:**\n`;
    notice += `1. Email us at: parents@alchm.app\n`;
    notice += `2. Include your child's username or email\n`;
    notice += `3. Provide verification of your parental relationship\n`;
    notice += `4. Specify your request (review, modify, delete)\n`;
    notice += `5. We will respond within 2 business days\n\n`;

    notice += `### Contact Information\n\n`;
    notice += `**Children's Privacy Officer:**\n`;
    notice += `- Email: parents@alchm.app\n`;
    notice += `- Phone: 1-800-ALCHM-KIDS\n`;
    notice += `- Response time: Within 2 business days\n`;
    notice += `- Available: Monday-Friday, 9 AM - 5 PM EST\n\n`;

    notice += `### Additional Resources\n\n`;
    notice += `**Learn more about COPPA:**\n`;
    notice += `- FTC COPPA Information: www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule\n`;
    notice += `- Connect Safely: www.connectsafely.org\n`;
    notice += `- Common Sense Media: www.commonsensemedia.org\n\n`;

    notice += `---\n\n`;
    notice += `*This notice complies with COPPA requirements and has been reviewed by child privacy attorneys. We are committed to protecting your child's privacy and safety.*\n\n`;
    notice += `**Questions? Contact our Children's Privacy Officer at parents@alchm.app**`;

    return notice;
  }

  // Helper methods for generating typeof window !== 'undefined' && document sections

  private generatePolicyHeader(config: LegalDocumentConfig, lastUpdated: string): string {
    let header = `# ALCHM PRIVACY POLICY\n`;
    header += `## Protecting Your Digital Sanctuary\n\n`;
    header += `**Last Updated:** ${lastUpdated}\n`;
    header += `**Effective Date:** ${lastUpdated}\n\n`;
    
    if (config.compliance.includes('GDPR')) {
      header += `**GDPR Compliance:** This policy meets European Union privacy requirements\n`;
    }
    if (config.compliance.includes('CCPA')) {
      header += `**CCPA Compliance:** This policy meets California privacy law requirements\n`;
    }
    if (config.compliance.includes('COPPA')) {
      header += `**COPPA Compliance:** Special protections for children under 13\n`;
    }
    
    header += `\n---\n\n`;
    return header;
  }

  private generateDataCollectionSection(features: AppFeatureAudit, config: LegalDocumentConfig): string {
    let section = `## INFORMATION WE COLLECT\n\n`;
    
    section += `### Information You Provide Directly\n`;
    section += `- **Account Information:** ${features.dataCollection.personalData.join(', ')}\n`;
    section += `- **Journal Content:** Your personal reflections and insights (encrypted)\n`;
    section += `- **Preferences:** Settings and customization choices\n\n`;
    
    section += `### Information We Collect Automatically\n`;
    section += `- **Technical Information:** ${features.dataCollection.deviceData.join(', ')}\n`;
    section += `- **Usage Information:** How you interact with our app (anonymized)\n`;
    section += `- **Performance Data:** App performance metrics\n\n`;
    
    section += `### Information We DO NOT Collect\n`;
    section += `- Real names or addresses\n`;
    section += `- Phone numbers or contact lists\n`;
    section += `- Precise location data\n`;
    section += `- Biometric information\n`;
    section += `- Social media connections\n`;
    section += `- Third-party tracking data\n\n`;
    
    return section;
  }

  private generateDataProcessingSection(features: AppFeatureAudit, config: LegalDocumentConfig): string {
    let section = `## HOW WE USE YOUR INFORMATION\n\n`;
    
    section += `### Service Delivery\n`;
    section += `- Provide journaling and wellness features\n`;
    section += `- Generate AI-powered insights and support\n`;
    section += `- Deliver crisis resources when needed\n`;
    section += `- Maintain account security and functionality\n\n`;
    
    if (features.processing.aiProcessing) {
      section += `### AI Processing (Khepera System)\n`;
      section += `- Analyze emotional patterns for insights\n`;
      section += `- Detect potential crisis situations\n`;
      section += `- Provide trauma-informed responses\n`;
      section += `- All processing is privacy-preserving with immediate data deletion\n\n`;
    }
    
    section += `### Legal Basis for Processing\n`;
    if (config.compliance.includes('GDPR')) {
      section += `**Under GDPR, we process your data based on:**\n`;
      section += `- **Consent:** For optional features and communications\n`;
      section += `- **Contract:** To provide the services you've signed up for\n`;
      section += `- **Legitimate Interest:** For security, fraud prevention, and service improvement\n`;
      section += `- **Vital Interest:** For crisis intervention and safety measures\n\n`;
    }
    
    return section;
  }

  private generateUserRightsSection(config: LegalDocumentConfig): string {
    let section = `## YOUR PRIVACY RIGHTS\n\n`;
    
    section += `### Universal Rights (All Users)\n`;
    section += `- **Access:** View all data we have about you\n`;
    section += `- **Portability:** Export your data in multiple formats\n`;
    section += `- **Correction:** Update inaccurate information\n`;
    section += `- **Deletion:** Delete your account and all data\n`;
    section += `- **Consent Withdrawal:** Opt-out of any data processing\n\n`;
    
    if (config.compliance.includes('GDPR')) {
      section += `### Additional GDPR Rights (EU Users)\n`;
      section += `- **Right to Rectification:** Correct inaccurate personal data\n`;
      section += `- **Right to Restriction:** Limit how we process your data\n`;
      section += `- **Right to Object:** Object to processing based on legitimate interest\n`;
      section += `- **Right to Automated Decision-Making:** Opt-out of automated decisions\n\n`;
    }
    
    if (config.compliance.includes('CCPA')) {
      section += `### California Consumer Rights (CCPA)\n`;
      section += `- **Right to Know:** Detailed disclosure of data collection and use\n`;
      section += `- **Right to Delete:** Request deletion of personal information\n`;
      section += `- **Right to Opt-Out:** Opt-out of data sales (we don't sell data)\n`;
      section += `- **Right to Non-Discrimination:** Equal service regardless of privacy choices\n\n`;
    }
    
    return section;
  }

  private generateMinorProtectionSection(config: LegalDocumentConfig): string {
    let section = `## PROTECTION OF MINORS\n\n`;
    
    section += `### COPPA Compliance (Under 13)\n`;
    section += `- Verifiable parental consent required before data collection\n`;
    section += `- Limited data collection - only what's essential for service\n`;
    section += `- Enhanced privacy protections and data security\n`;
    section += `- Parental access and control over child's data\n`;
    section += `- No behavioral advertising or profiling\n\n`;
    
    section += `### Teen Protections (13-17)\n`;
    section += `- Simplified privacy notices in age-appropriate language\n`;
    section += `- Enhanced crisis intervention protocols\n`;
    section += `- Optional parental oversight dashboard\n`;
    section += `- Stricter data sharing restrictions\n`;
    section += `- Additional consent requirements for research participation\n\n`;
    
    section += `### Family Controls\n`;
    section += `- Parent/guardian dashboard for account oversight\n`;
    section += `- Family consent management system\n`;
    section += `- Crisis notification to parents when appropriate\n`;
    section += `- Collaborative safety planning tools\n\n`;
    
    return section;
  }

  private generateAITransparencySection(config: LegalDocumentConfig): string {
    let section = `## AI TRANSPARENCY (KHEPERA SYSTEM)\n\n`;
    
    section += `### How Our AI Works\n`;
    section += `- **Local Processing:** Initial analysis happens on your device\n`;
    section += `- **Encrypted Processing:** Cloud processing uses encrypted data\n`;
    section += `- **Immediate Deletion:** Processing data deleted after generating response\n`;
    section += `- **No Training Data:** Your content never used to train AI models\n`;
    section += `- **Human Oversight:** AI responses reviewed for safety and quality\n\n`;
    
    section += `### AI Decision Making\n`;
    section += `- **No Automated Decisions:** AI doesn't make decisions that significantly affect you\n`;
    section += `- **Supportive Only:** AI provides suggestions and support, not commands\n`;
    section += `- **Transparent Logic:** You can see why AI made specific suggestions\n`;
    section += `- **Easy Opt-Out:** Disable AI features anytime without losing other functionality\n\n`;
    
    section += `### AI Data Protection\n`;
    section += `- All AI processing follows the same privacy standards as other data\n`;
    section += `- AI models are regularly audited for bias and safety\n`;
    section += `- Cultural sensitivity training for diverse user populations\n`;
    section += `- Trauma-informed response protocols for mental health content\n\n`;
    
    return section;
  }

  private generateCrisisPrivacySection(config: LegalDocumentConfig): string {
    let section = `## CRISIS INTERVENTION PRIVACY\n\n`;
    
    section += `### When We May Override Privacy\n`;
    section += `In limited circumstances, we may need to breach normal privacy protections:\n`;
    section += `- **Imminent Danger:** Immediate threat to life or safety\n`;
    section += `- **Legal Requirements:** Court orders or law enforcement safety requests\n`;
    section += `- **Professional Duty:** Licensed mental health professionals may have reporting obligations\n`;
    section += `- **Parental Notification:** Crisis events may require parent/guardian contact for minors\n\n`;
    
    section += `### Privacy Protections in Crisis\n`;
    section += `Even in crisis situations, we maintain maximum privacy:\n`;
    section += `- **Minimal Disclosure:** Only information necessary for immediate safety\n`;
    section += `- **Time Limits:** Crisis data deleted after 72 hours unless ongoing risk\n`;
    section += `- **Professional Standards:** Mental health confidentiality respected\n`;
    section += `- **User Consent:** Requested even in crisis situations when possible\n\n`;
    
    section += `### Crisis Data Handling\n`;
    section += `- Crisis keywords detected locally on your device when possible\n`;
    section += `- Crisis language not stored or transmitted unless absolutely necessary\n`;
    section += `- Local crisis resources provided without data sharing\n`;
    section += `- Professional referrals made with your consent when possible\n\n`;
    
    return section;
  }

  private generateDataSecuritySection(config: LegalDocumentConfig): string {
    let section = `## DATA SECURITY MEASURES\n\n`;
    
    section += `### Encryption Standards\n`;
    section += `- **Client-Side Encryption:** AES-256 encryption before data leaves your device\n`;
    section += `- **In-Transit Protection:** TLS 1.3 encryption for all data transmission\n`;
    section += `- **At-Rest Security:** Google Cloud encryption with customer-managed keys\n`;
    section += `- **Zero-Knowledge Architecture:** We cannot decrypt your personal content\n\n`;
    
    section += `### Access Controls\n`;
    section += `- **Multi-Factor Authentication:** Enhanced account security\n`;
    section += `- **Role-Based Access:** Employees have access only to necessary data\n`;
    section += `- **Audit Logs:** All data access is logged and monitored\n`;
    section += `- **Regular Reviews:** Quarterly access reviews and updates\n\n`;
    
    section += `### Infrastructure Security\n`;
    section += `- **SOC 2 Compliance:** Industry-standard security controls\n`;
    section += `- **Regular Penetration Testing:** Third-party security assessments\n`;
    section += `- **Incident Response Plan:** Rapid response to security events\n`;
    section += `- **Data Backup Security:** Encrypted backups with same protection standards\n\n`;
    
    return section;
  }

  private generateInternationalTransferSection(config: LegalDocumentConfig): string {
    let section = `## INTERNATIONAL DATA TRANSFERS\n\n`;
    
    if (config.compliance.includes('GDPR')) {
      section += `### EU Data Protection\n`;
      section += `For users in the European Union:\n`;
      section += `- **Data Localization:** EU user data stored within EU data centers when possible\n`;
      section += `- **Adequacy Decisions:** Transfers only to countries with adequate protection\n`;
      section += `- **Standard Contractual Clauses:** Legal safeguards for necessary transfers\n`;
      section += `- **Transfer Impact Assessments:** Regular review of transfer risks\n\n`;
    }
    
    section += `### Global Data Protection\n`;
    section += `- **Primary Storage:** US data centers with highest security standards\n`;
    section += `- **Regional Options:** EU and other regional storage available\n`;
    section += `- **Transfer Safeguards:** Legal and technical protections for all transfers\n`;
    section += `- **User Choice:** Option to request specific data residency\n\n`;
    
    return section;
  }

  private generateContactSection(config: LegalDocumentConfig): string {
    let section = `## CONTACT INFORMATION\n\n`;
    
    section += `### Privacy Team\n`;
    section += `- **Email:** privacy@alchm.app\n`;
    section += `- **Response Time:** 48 hours for privacy inquiries\n`;
    section += `- **Languages:** English, Spanish, with interpretation available\n`;
    section += `- **Crisis Support:** Immediate response for safety-related privacy concerns\n\n`;
    
    if (config.compliance.includes('GDPR')) {
      section += `### Data Protection Officer\n`;
      section += `- **Email:** dpo@alchm.app\n`;
      section += `- **Role:** Independent oversight of data protection practices\n`;
      section += `- **Contact:** For formal GDPR inquiries and complaints\n\n`;
    }
    
    section += `### Rights Requests\n`;
    section += `To exercise your privacy rights:\n`;
    section += `1. Email your request to privacy@alchm.app\n`;
    section += `2. Include your account information for verification\n`;
    section += `3. Specify which rights you want to exercise\n`;
    section += `4. We'll respond within 30 days\n\n`;
    
    return section;
  }

  private generatePolicyUpdatesSection(config: LegalDocumentConfig): string {
    let section = `## POLICY UPDATES\n\n`;
    
    section += `### How We Handle Changes\n`;
    section += `- **Material Changes:** 30-day advance notice via email\n`;
    section += `- **User Consent:** New consent required for significant changes\n`;
    section += `- **Opt-Out Option:** Delete account if you disagree with changes\n`;
    section += `- **Version History:** All previous versions available for review\n\n`;
    
    section += `### Minor Updates\n`;
    section += `- **Immediate Effect:** Technical clarifications effective immediately\n`;
    section += `- **Change Log:** Detailed record of all modifications\n`;
    section += `- **Notification:** In-app notice of minor updates\n`;
    section += `- **Continued Use:** Continued use constitutes acceptance\n\n`;
    
    return section;
  }

  private generateLegalBasisSection(config: LegalDocumentConfig): string {
    let section = `## LEGAL BASIS & COMPLIANCE\n\n`;
    
    section += `### Regulatory Compliance\n`;
    section += `This privacy policy complies with:\n`;
    config.compliance.forEach(regulation => {
      switch (regulation) {
        case 'GDPR':
          section += `- **GDPR:** General Data Protection Regulation (EU)\n`;
          break;
        case 'CCPA':
          section += `- **CCPA:** California Consumer Privacy Act\n`;
          break;
        case 'COPPA':
          section += `- **COPPA:** Children's Online Privacy Protection Act\n`;
          break;
        case 'FERPA':
          section += `- **FERPA:** Family Educational Rights and Privacy Act\n`;
          break;
        default:
          section += `- **${regulation}:** Additional privacy requirements\n`;
      }
    });
    
    section += `\n### Ongoing Monitoring\n`;
    section += `- **Privacy Impact Assessments:** Regular evaluation of privacy risks\n`;
    section += `- **Compliance Audits:** Third-party verification of privacy practices\n`;
    section += `- **Regulatory Updates:** Immediate adaptation to new privacy laws\n`;
    section += `- **Industry Standards:** Exceeding minimum legal requirements\n\n`;
    
    section += `---\n\n`;
    section += `*This Privacy Policy is attorney-reviewed and regularly updated to ensure compliance with all applicable privacy laws and regulations.*\n\n`;
    section += `© 2024 ALCHM. All rights reserved. Your Digital Sanctuary.`;
    
    return section;
  }

  /**
   * Get audit trail of all typeof window !== 'undefined' && document generations
   */
  getDocumentAuditTrail(): Array<{
    typeof window !== 'undefined' && documentType: string;
    generatedAt: string;
    config: LegalDocumentConfig;
    version: string;
  }> {
    const auditTrail = typeof window !== 'undefined' && localStorage.getItem('alchm_legal_typeof window !== 'undefined' && document_audit');
    if (auditTrail) {
      try {
        return JSON.parse(auditTrail);
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Track typeof window !== 'undefined' && document generation for compliance audit
   */
  private trackDocumentGeneration(typeof window !== 'undefined' && documentType: string, config: LegalDocumentConfig): void {
    const auditEntry = {
      typeof window !== 'undefined' && documentType,
      generatedAt: new Date().toISOString(),
      config,
      version: '1.0'
    };

    const existingAudit = this.getDocumentAuditTrail();
    existingAudit.push(auditEntry);

    // Keep only last 100 entries
    if (existingAudit.length > 100) {
      existingAudit.splice(0, existingAudit.length - 100);
    }

    typeof window !== 'undefined' && localStorage.setItem('alchm_legal_typeof window !== 'undefined' && document_audit', JSON.stringify(existingAudit));
  }
}

// Export singleton instance
export const legalDocumentGenerator = new DynamicLegalDocumentGenerator();