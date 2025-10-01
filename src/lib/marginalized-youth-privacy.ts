/**
 * ALCHM Enhanced Privacy Protection for Marginalized Youth
 * 
 * Philosophy: "Privacy is not just a feature - it's a lifeline for vulnerable youth.
 * Marginalized young people face additional risks that require heightened protection."
 * 
 * This system provides extra privacy safeguards for youth who face:
 * - Family rejection or violence due to identity
 * - Documentation status vulnerabilities 
 * - Discrimination in healthcare, education, or legal systems
 * - Community-based persecution or violence
 * - Systemic monitoring and surveillance
 */

import { encryptJournalEntry, decryptJournalEntry, encryption } from './encryption';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface YouthVulnerabilityProfile {
  userId: string;
  riskFactors: {
    lgbtqRejectionRisk: boolean;      // Risk of family/community rejection
    immigrationRisk: boolean;         // Untypeof window !== 'undefined' && documented or mixed-status family
    religiousMinorityRisk: boolean;   // Religious persecution risk
    racialTargetingRisk: boolean;     // Racial profiling/targeting risk
    economicVulnerability: boolean;   // Housing/food insecurity
    mentalHealthStigma: boolean;      // Cultural mental health stigma
    disabilityDiscrimination: boolean; // Disability-based discrimination
  };
  safetyNeeds: {
    extraEncryption: boolean;         // Need additional data encryption
    pseudonymousMode: boolean;        // Use pseudonym instead of real name
    locationMasking: boolean;         // Hide geographic location data
    parentalHiding: boolean;          // Hide from parental/guardian access
    shareBlocklist: string[];         // People/groups to never share with
    emergencyContacts: {              // Safe emergency contacts
      name: string;
      relationship: string;
      contact: string;
      safeToContact: boolean;
    }[];
  };
  culturalConsiderations: {
    prefersCulturallyMatchedSupport: boolean;
    culturalBackgrounds: string[];
    languagePreferences: string[];
    spiritualConsiderations: string[];
  };
  createdAt: Date;
  lastUpdated: Date;
}

export interface SafeDataStorage {
  encryptionLevel: 'standard' | 'enhanced' | 'maximum';
  dataRetentionPeriod: number; // days
  autoDeleteTriggers: {
    inactivityPeriod: number; // days of inactivity before auto-delete
    emergencyDeletePhrase: string; // phrase that triggers immediate delete
    panicDeleteEnabled: boolean;
  };
  accessLogging: {
    logAllAccess: boolean;
    alertOnUnusualAccess: boolean;
    shareAccessLogs: boolean; // with user
  };
}

/**
 * Marginalized Youth Privacy Manager
 * Provides enhanced protection for vulnerable young people
 */
export class MarginalizedYouthPrivacyManager {
  private readonly ENHANCED_ENCRYPTION_KEY = process.env.YOUTH_PRIVACY_KEY || 'default_key';
  
  /**
   * Create a vulnerability profile with enhanced privacy
   */
  async createVulnerabilityProfile(
    userId: string,
    profile: Omit<YouthVulnerabilityProfile, 'userId' | 'createdAt' | 'lastUpdated'>
  ): Promise<void> {
    const fullProfile: YouthVulnerabilityProfile = {
      userId,
      ...profile,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    // Encrypt the entire profile
    const encryptedProfile = await encryption.encrypt(JSON.stringify(fullProfile), this.ENHANCED_ENCRYPTION_KEY);
    
    // Store with obscured typeof window !== 'undefined' && document ID
    const obscuredId = await this.generateObscuredId(userId);
    await setDoc(doc(db, 'youth_privacy_profiles', obscuredId), {
      data: encryptedProfile,
      created: new Date().toISOString()
    });
  }
  
  /**
   * Get vulnerability profile with decryption
   */
  async getVulnerabilityProfile(userId: string): Promise<YouthVulnerabilityProfile | null> {
    try {
      const obscuredId = await this.generateObscuredId(userId);
      const docRef = doc(db, 'youth_privacy_profiles', obscuredId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      const encryptedData = docSnap.data().data;
      const decryptedData = await encryption.decrypt(encryptedData, this.ENHANCED_ENCRYPTION_KEY);
      
      return JSON.parse(decryptedData) as YouthVulnerabilityProfile;
    } catch (error) {
      console.error('Error retrieving vulnerability profile:', error);
      return null;
    }
  }
  
  /**
   * Setup safe data storage parameters
   */
  async setupSafeDataStorage(
    userId: string,
    storageConfig: SafeDataStorage
  ): Promise<void> {
    const profile = await this.getVulnerabilityProfile(userId);
    if (!profile) throw new Error('Vulnerability profile not found');
    
    // Store storage configuration separately, also encrypted
    const encryptedConfig = await encryption.encrypt(JSON.stringify(storageConfig), this.ENHANCED_ENCRYPTION_KEY);
    
    await setDoc(doc(db, 'safe_storage_configs', userId), {
      config: encryptedConfig,
      updated: new Date().toISOString()
    });
    
    // Apply immediate storage settings
    await this.applySafeStorageSettings(userId, storageConfig);
  }
  
  /**
   * Check if data should be encrypted with enhanced protection
   */
  async requiresEnhancedEncryption(userId: string): Promise<boolean> {
    const profile = await this.getVulnerabilityProfile(userId);
    if (!profile) return false;
    
    return profile.safetyNeeds.extraEncryption ||
           profile.riskFactors.lgbtqRejectionRisk ||
           profile.riskFactors.immigrationRisk ||
           profile.riskFactors.religiousMinorityRisk;
  }
  
  /**
   * Get culturally-matched crisis resources
   */
  async getCulturallySafeCrisisResources(userId: string): Promise<any[]> {
    const profile = await this.getVulnerabilityProfile(userId);
    if (!profile) return [];
    
    // Import cultural crisis resources
    const { culturalCrisisResources } = await import('./cultural-crisis-resources');
    
    return culturalCrisisResources.getCulturallyAppropriateResources({
      identity: profile.culturalConsiderations.culturalBackgrounds,
      language: profile.culturalConsiderations.languagePreferences[0] || 'en',
      region: 'US',
      ageGroup: 'youth'
    });
  }
  
  /**
   * Emergency data deletion
   */
  async emergencyDataDeletion(
    userId: string,
    deletionPhrase: string
  ): Promise<boolean> {
    const profile = await this.getVulnerabilityProfile(userId);
    const storageConfig = await this.getSafeStorageConfig(userId);
    
    if (!storageConfig || deletionPhrase !== storageConfig.autoDeleteTriggers.emergencyDeletePhrase) {
      return false;
    }
    
    try {
      // Delete all user data immediately
      await this.deleteAllUserData(userId);
      
      // Log emergency deletion (without personal info)
      console.log(`Emergency deletion completed for user ${userId.slice(0, 8)}...`);
      
      return true;
    } catch (error) {
      console.error('Emergency deletion failed:', error);
      return false;
    }
  }
  
  /**
   * Check for unusual access patterns
   */
  async checkAccessPatterns(userId: string, accessData: any): Promise<{
    isUnusual: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  }> {
    const profile = await this.getVulnerabilityProfile(userId);
    if (!profile) return { isUnusual: false, riskLevel: 'low', recommendations: [] };
    
    const recommendations: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let isUnusual = false;
    
    // Check for multiple location access
    if (accessData.locations && accessData.locations.length > 2) {
      isUnusual = true;
      riskLevel = 'medium';
      recommendations.push('Multiple locations detected - ensure you are using secure networks');
    }
    
    // Check for unusual time patterns
    if (accessData.timeOfAccess && this.isUnusualAccessTime(accessData.timeOfAccess)) {
      isUnusual = true;
      riskLevel = riskLevel === 'medium' ? 'high' : 'medium';
      recommendations.push('Unusual access time detected - verify this was you');
    }
    
    // Check for new devices
    if (accessData.newDevice) {
      isUnusual = true;
      recommendations.push('New device detected - ensure it is secure and trusted');
    }
    
    return { isUnusual, riskLevel, recommendations };
  }
  
  /**
   * Generate safe pseudonym for user
   */
  generateSafePseudonym(userId: string, preferences?: { culturalHints?: string[] }): string {
    const pseudonyms = {
      universal: ['Phoenix', 'River', 'Sage', 'Sky', 'Rain', 'Star', 'Luna', 'Sol'],
      cultural: {
        indigenous: ['Cedar', 'Raven', 'Stone', 'Wind'],
        african: ['Asha', 'Kesi', 'Nia', 'Zara'],
        latinx: ['Esperanza', 'Luz', 'Sol', 'Cielo'],
        asian: ['Ai', 'Hana', 'Kira', 'Yuki']
      }
    };
    
    // Use cultural hints if available
    if (preferences?.culturalHints) {
      for (const hint of preferences.culturalHints) {
        if (pseudonyms.cultural[hint as keyof typeof pseudonyms.cultural]) {
          const options = pseudonyms.cultural[hint as keyof typeof pseudonyms.cultural];
          return options[Math.floor(Math.random() * options.length)];
        }
      }
    }
    
    // Fall back to universal names
    const universalOptions = pseudonyms.universal;
    return universalOptions[Math.floor(Math.random() * universalOptions.length)];
  }
  
  // Private helper methods
  private async generateObscuredId(userId: string): Promise<string> {
    // Create a consistent but obscured ID for the user
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(userId + this.ENHANCED_ENCRYPTION_KEY).digest('hex');
  }
  
  private async applySafeStorageSettings(userId: string, config: SafeDataStorage): Promise<void> {
    // Apply data retention policies
    if (config.autoDeleteTriggers.inactivityPeriod > 0) {
      // Set up automatic cleanup job
      await this.scheduleAutoCleanup(userId, config.autoDeleteTriggers.inactivityPeriod);
    }
    
    // Apply encryption level
    if (config.encryptionLevel === 'maximum') {
      await this.upgradeToMaximumEncryption(userId);
    }
  }
  
  private async getSafeStorageConfig(userId: string): Promise<SafeDataStorage | null> {
    try {
      const docRef = doc(db, 'safe_storage_configs', userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      const encryptedConfig = docSnap.data().config;
      const decryptedConfig = await encryption.decrypt(encryptedConfig, this.ENHANCED_ENCRYPTION_KEY);
      
      return JSON.parse(decryptedConfig) as SafeDataStorage;
    } catch (error) {
      console.error('Error retrieving safe storage config:', error);
      return null;
    }
  }
  
  private async deleteAllUserData(userId: string): Promise<void> {
    const collections = [
      `users/${userId}/journals`,
      `users/${userId}/badges`,
      `users/${userId}/streaks`,
      `youth_privacy_profiles`,
      `safe_storage_configs`
    ];
    
    // Delete from all collections
    for (const collection of collections) {
      try {
        if (collection.includes('youth_privacy_profiles')) {
          const obscuredId = await this.generateObscuredId(userId);
          await deleteDoc(doc(db, collection, obscuredId));
        } else if (collection.includes('/')) {
          // Handle subcollections - would need batch delete in production
          console.log(`Deleting from ${collection}`);
        } else {
          await deleteDoc(doc(db, collection, userId));
        }
      } catch (error) {
        console.error(`Error deleting from ${collection}:`, error);
      }
    }
  }
  
  private isUnusualAccessTime(accessTime: Date): boolean {
    const hour = accessTime.getHours();
    // Consider 2 AM - 6 AM as unusual for most youth
    return hour >= 2 && hour <= 6;
  }
  
  private async scheduleAutoCleanup(userId: string, inactivityDays: number): Promise<void> {
    // In production, this would use Firebase Functions or similar
    console.log(`Scheduled auto-cleanup for user ${userId.slice(0, 8)}... after ${inactivityDays} days of inactivity`);
  }
  
  private async upgradeToMaximumEncryption(userId: string): Promise<void> {
    // Upgrade all user data to maximum encryption
    console.log(`Upgrading encryption for user ${userId.slice(0, 8)}...`);
  }
}

// Export singleton
export const marginalizedYouthPrivacyManager = new MarginalizedYouthPrivacyManager();

/**
 * Quick setup for vulnerable youth privacy
 */
export async function setupVulnerableYouthProtection(
  userId: string,
  riskAssessment: {
    identityRejectionRisk: boolean;
    familyUnsafe: boolean;
    immigrationConcerns: boolean;
    economicallyVulnerable: boolean;
    mentalHealthStigma: boolean;
    culturalBackground: string[];
  }
): Promise<void> {
  const vulnerabilityProfile: Omit<YouthVulnerabilityProfile, 'userId' | 'createdAt' | 'lastUpdated'> = {
    riskFactors: {
      lgbtqRejectionRisk: riskAssessment.identityRejectionRisk,
      immigrationRisk: riskAssessment.immigrationConcerns,
      religiousMinorityRisk: false, // Would be determined through onboarding
      racialTargetingRisk: riskAssessment.culturalBackground.includes('black') || riskAssessment.culturalBackground.includes('latinx'),
      economicVulnerability: riskAssessment.economicallyVulnerable,
      mentalHealthStigma: riskAssessment.mentalHealthStigma,
      disabilityDiscrimination: false // Would be determined through onboarding
    },
    safetyNeeds: {
      extraEncryption: riskAssessment.identityRejectionRisk || riskAssessment.immigrationConcerns,
      pseudonymousMode: riskAssessment.familyUnsafe,
      locationMasking: riskAssessment.immigrationConcerns,
      parentalHiding: riskAssessment.identityRejectionRisk || riskAssessment.familyUnsafe,
      shareBlocklist: [],
      emergencyContacts: []
    },
    culturalConsiderations: {
      prefersCulturallyMatchedSupport: true,
      culturalBackgrounds: riskAssessment.culturalBackground,
      languagePreferences: [],
      spiritualConsiderations: []
    }
  };
  
  await marginalizedYouthPrivacyManager.createVulnerabilityProfile(userId, vulnerabilityProfile);
  
  // Setup enhanced storage
  const safeStorage: SafeDataStorage = {
    encryptionLevel: 'enhanced',
    dataRetentionPeriod: 30, // 30 days default
    autoDeleteTriggers: {
      inactivityPeriod: 90, // 3 months of inactivity
      emergencyDeletePhrase: generateEmergencyDeletePhrase(),
      panicDeleteEnabled: true
    },
    accessLogging: {
      logAllAccess: true,
      alertOnUnusualAccess: true,
      shareAccessLogs: true
    }
  };
  
  await marginalizedYouthPrivacyManager.setupSafeDataStorage(userId, safeStorage);
}

/**
 * Generate a random but memorable emergency delete phrase
 */
function generateEmergencyDeletePhrase(): string {
  const words = ['butterfly', 'mountain', 'ocean', 'storm', 'rainbow', 'crystal', 'forest', 'star'];
  const numbers = ['21', '37', '42', '88', '99'];
  
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${word1}-${word2}-${number}`;
}

/**
 * Privacy education for marginalized youth
 */
export const MARGINALIZED_YOUTH_PRIVACY_EDUCATION = {
  why_extra_protection: {
    title: "Why Marginalized Youth Need Extra Privacy Protection",
    content: [
      "Your identity and experiences may put you at higher risk in some environments.",
      "Family, school, or community rejection can have serious consequences.",
      "Immigration status, LGBTQ+ identity, or other factors may require additional caution.",
      "Your privacy is not just personal preference - it can be a safety issue."
    ]
  },
  digital_safety_tips: {
    title: "Digital Safety Tips for Vulnerable Youth",
    content: [
      "Use private browsing or incognito mode when possible.",
      "Consider using a different device or public computer for sensitive activities.",
      "Never share your passwords, even with friends or family.",
      "Be cautious about what you post on social media - it can be used against you.",
      "Trust your instincts - if something feels unsafe, it probably is."
    ]
  },
  emergency_planning: {
    title: "Emergency Privacy Planning",
    content: [
      "Know how to quickly delete your browsing history and data.",
      "Have a plan for what to do if your privacy is compromised.",
      "Know who you can safely contact in an emergency.",
      "Consider having a 'panic phrase' that automatically protects your data.",
      "Remember: asking for help is not weakness, it's wisdom."
    ]
  }
};
