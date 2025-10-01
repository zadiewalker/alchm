/**
 * Crisis Safety Configuration
 * 
 * Centralized configuration for crisis intervention systems
 * Ensures consistent settings across all crisis safety components
 */

export interface CrisisSafetyConfig {
  detection: {
    maxResponseTime: number;
    accuracyThreshold: number;
    falseNegativeLimit: number;
    retryAttempts: number;
  };
  monitoring: {
    healthCheckInterval: number;
    alertThresholds: {
      responseTime: number;
      availability: number;
      accuracy: number;
    };
    testInterval: number;
  };
  resources: {
    emergencyContacts: EmergencyContact[];
    culturalResources: CulturalResource[];
  };
  languages: string[];
  culturalContexts: string[];
}

interface EmergencyContact {
  name: string;
  number: string;
  type: 'emergency' | 'crisis' | 'mental_health';
  country: string;
  available24h: boolean;
}

interface CulturalResource {
  name: string;
  contact: string;
  culturalFocus: string[];
  languages: string[];
  available24h: boolean;
}

export const CRISIS_SAFETY_CONFIG: CrisisSafetyConfig = {
  detection: {
    maxResponseTime: 3000, // 3 seconds
    accuracyThreshold: 95,  // 95% accuracy required
    falseNegativeLimit: 1,  // Max 1% false negative rate
    retryAttempts: 3
  },
  monitoring: {
    healthCheckInterval: 60000, // 1 minute
    alertThresholds: {
      responseTime: 3000,
      availability: 99.9,
      accuracy: 95
    },
    testInterval: 900000 // 15 minutes
  },
  resources: {
    emergencyContacts: [
      {
        name: '988 Suicide & Crisis Lifeline',
        number: '988',
        type: 'crisis',
        country: 'US',
        available24h: true
      },
      {
        name: 'Emergency Services',
        number: '911',
        type: 'emergency',
        country: 'US',
        available24h: true
      },
      {
        name: 'Crisis Text Line',
        number: '741741',
        type: 'crisis',
        country: 'US',
        available24h: true
      }
    ],
    culturalResources: [
      {
        name: 'Trevor Project',
        contact: '1-866-488-7386',
        culturalFocus: ['lgbtq', 'youth'],
        languages: ['en'],
        available24h: true
      },
      {
        name: 'Trans Lifeline',
        contact: '877-565-8860',
        culturalFocus: ['transgender'],
        languages: ['en'],
        available24h: true
      },
      {
        name: 'SAMHSA National Helpline',
        contact: '1-800-662-4357',
        culturalFocus: ['immigrant', 'general'],
        languages: ['en', 'es'],
        available24h: true
      }
    ]
  },
  languages: ['en', 'es', 'pt', 'ko', 'hi', 'de'],
  culturalContexts: ['lgbtq', 'immigrant', 'racial', 'religious', 'economic', 'indigenous', 'disability', 'age']
};

export function getServerConfig() {
  return {
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
    },
    ai: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      openaiProjectId: process.env.OPENAI_PROJECT_ID
    },
    crisis: CRISIS_SAFETY_CONFIG
  };
}

export function getClientConfig() {
  return {
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    },
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    },
    crisis: CRISIS_SAFETY_CONFIG
  };
}