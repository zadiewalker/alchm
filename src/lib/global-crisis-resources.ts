/**
 * Global Crisis Resources Management
 * Provides culturally competent crisis resources with offline accessibility
 */

export type UserContext = {
  location: {
    country: string;
    timezone: string;
  };
  preferences: {
    languages: string[];
    ageGroup: 'youth' | 'adult' | 'senior';
    lgbtqContext?: boolean;
    immigrationStatus?: 'typeof window !== 'undefined' && documented' | 'untypeof window !== 'undefined' && documented' | 'mixed' | 'unknown';
  };
  urgencyLevel: 'low' | 'moderate' | 'high' | 'critical';
  accessMethod: 'voice' | 'text' | 'chat' | 'any';
};

export type CrisisResource = {
  type: 'hotline' | 'text_line' | 'chat_service' | 'community_resource' | 'spiritual_support' | 'peer_support';
  name: string;
  contact: string;
  description: string;
  available24h: boolean;
  languages: string[];
  culturalSpecialty?: string;
  costFree: boolean;
  confidential: boolean;
  immigrationSafe?: boolean;
  offlineAccessible: boolean;
};

class GlobalCrisisResourceManager {
  getCrisisResources(context: UserContext, limit: number = 5): CrisisResource[] {
    const resources: CrisisResource[] = [];
    
    // Universal resources
    resources.push({
      type: 'hotline',
      name: '988 Suicide & Crisis Lifeline',
      contact: '988',
      description: '24/7 free and confidential support',
      available24h: true,
      languages: ['English', 'Spanish'],
      costFree: true,
      confidential: true,
      offlineAccessible: true
    });
    
    resources.push({
      type: 'text_line',
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      description: '24/7 crisis support via text',
      available24h: true,
      languages: ['English', 'Spanish'],
      costFree: true,
      confidential: true,
      offlineAccessible: true
    });
    
    // LGBTQ+ specific resources
    if (context.preferences.lgbtqContext) {
      resources.push({
        type: 'hotline',
        name: 'The Trevor Project',
        contact: '1-866-488-7386',
        description: '24/7 crisis support for LGBTQ youth',
        available24h: true,
        languages: ['English', 'Spanish'],
        culturalSpecialty: 'LGBTQ+ youth',
        costFree: true,
        confidential: true,
        offlineAccessible: true
      });
    }
    
    // Immigration-safe resources
    if (context.preferences.immigrationStatus === 'untypeof window !== 'undefined' && documented') {
      resources.push({
        type: 'hotline',
        name: 'SAMHSA National Helpline',
        contact: '1-800-662-4357',
        description: 'Mental health support regardless of immigration status',
        available24h: true,
        languages: ['English', 'Spanish'],
        costFree: true,
        confidential: true,
        immigrationSafe: true,
        offlineAccessible: true
      });
    }
    
    return resources.slice(0, limit);
  }
  
  getOfflineResources(country: string): CrisisResource[] {
    return this.getCrisisResources({
      location: { country, timezone: 'UTC' },
      preferences: { languages: ['English'], ageGroup: 'adult' },
      urgencyLevel: 'critical',
      accessMethod: 'any'
    }).filter(r => r.offlineAccessible);
  }
}

export const globalCrisisResources = new GlobalCrisisResourceManager();

export function getQuickEmergencyResources(country: string): {
  crisis_hotline: string;
  emergency: string;
} {
  const countryResources = {
    'United States': {
      crisis_hotline: '988',
      emergency: '911'
    },
    'United Kingdom': {
      crisis_hotline: '116 123',
      emergency: '999'
    },
    'Canada': {
      crisis_hotline: '1-833-456-4566',
      emergency: '911'
    },
    'Australia': {
      crisis_hotline: '13 11 14',
      emergency: '000'
    }
  };
  
  return countryResources[country as keyof typeof countryResources] || {
    crisis_hotline: '988',
    emergency: '911'
  };
}