// Firebase Studio Advanced Configuration for ALCHM
// Mental Health Platform Optimization

const { defineConfig } = require('firebase-functions');

// Advanced performance configuration
const PERFORMANCE_CONFIG = {
  // Mental health crisis functions - highest priority
  crisis: {
    memory: '2GB',
    timeout: 30,
    minInstances: 2,
    maxInstances: 100,
    concurrency: 1000,
    labels: {
      priority: 'critical',
      health_category: 'crisis_intervention'
    }
  },
  
  // AI processing - adaptive scaling
  ai: {
    memory: '1GB', 
    timeout: 60,
    minInstances: 1,
    maxInstances: 50,
    concurrency: 80,
    labels: {
      priority: 'high',
      health_category: 'ai_processing'
    }
  },
  
  // Standard operations
  standard: {
    memory: '512MB',
    timeout: 30,
    minInstances: 0,
    maxInstances: 20,
    concurrency: 40,
    labels: {
      priority: 'medium',
      health_category: 'standard_operations'
    }
  }
};

// Regional deployment strategy for mental health compliance
const REGIONAL_CONFIG = {
  // Primary regions for mental health data sovereignty
  primary: ['us-central1', 'europe-west1'],
  
  // Crisis response regions - global coverage
  crisis: [
    'us-central1', 'us-east1', 'us-west1',
    'europe-west1', 'europe-west3',
    'asia-northeast1', 'australia-southeast1'
  ],
  
  // Compliance regions
  compliance: {
    'us-central1': ['HIPAA', 'FERPA', 'COPPA'],
    'europe-west1': ['GDPR', 'DSGVO'],
    'asia-northeast1': ['PDPA']
  }
};

// Mental health specific monitoring
const HEALTH_MONITORING = {
  // Crisis detection thresholds
  crisis: {
    responseTime: 2000, // 2 seconds max for crisis responses
    availabilityTarget: 99.9,
    errorThreshold: 0.001 // 0.1% error rate max
  },
  
  // AI processing quality metrics
  ai: {
    processingTime: 15000, // 15 seconds max
    accuracyThreshold: 0.85,
    traumaInformedScore: 0.9
  },
  
  // User experience metrics
  ux: {
    loadTime: 3000, // 3 seconds max
    interactivity: 100, // Lighthouse score
    accessibility: 100 // WCAG AAA compliance
  }
};

// Privacy-first Firebase Studio configuration
const PRIVACY_CONFIG = {
  // Data encryption settings
  encryption: {
    atRest: true,
    inTransit: true,
    clientSide: true,
    keyRotation: 'quarterly'
  },
  
  // Data retention for mental health compliance
  retention: {
    journalEntries: '7-years', // Mental health record retention
    crisisLogs: '10-years',
    analytics: '2-years',
    debugLogs: '30-days'
  },
  
  // Anonymization settings
  anonymization: {
    automatic: true,
    scheduledCleanup: true,
    userDeletionCompliance: 'complete'
  }
};

// Advanced Firebase Extensions for Mental Health
const MENTAL_HEALTH_EXTENSIONS = {
  // Crisis detection and intervention
  'crisis-ai-monitor': {
    version: 'latest',
    config: {
      alertThreshold: 'high',
      professionalNotification: true,
      emergencyEscalation: true
    }
  },
  
  // Multilingual support for diverse communities
  'advanced-translation': {
    version: 'latest',
    config: {
      languages: ['en', 'es', 'pt', 'ko', 'hi', 'de'],
      culturalContext: true,
      mentalHealthTerminology: true
    }
  },
  
  // Privacy compliance automation
  'privacy-compliance': {
    version: 'latest',
    config: {
      gdprCompliance: true,
      coppaCompliance: true,
      dataSubjectRights: true
    }
  },
  
  // Advanced analytics for mental health insights
  'health-analytics': {
    version: 'latest',
    config: {
      populationInsights: true,
      trendAnalysis: true,
      privacyPreserving: true
    }
  }
};

// Real-time features configuration
const REALTIME_CONFIG = {
  // Crisis support real-time features
  crisis: {
    liveChatSupport: true,
    professionalEscalation: true,
    emergencyContacts: true,
    locationBasedResources: true
  },
  
  // Community features with privacy protection
  community: {
    anonymousSharing: true,
    peerSupport: true,
    groupTherapy: true,
    moderatedSpaces: true
  },
  
  // Professional dashboard
  professional: {
    crisisAlerts: true,
    clientDashboard: true,
    outcomeTracking: true,
    complianceReporting: true
  }
};

// Firebase Studio App Hosting configuration
const APP_HOSTING_CONFIG = {
  // Static site optimization
  static: {
    compressionLevel: 9,
    imageOptimization: true,
    codeSpitting: true,
    lazyLoading: true
  },
  
  // Progressive Web App features
  pwa: {
    offlineSupport: true,
    backgroundSync: true,
    pushNotifications: true,
    installPrompt: true
  },
  
  // Global CDN optimization
  cdn: {
    edgeLocations: 'all',
    cacheStrategy: 'aggressive',
    compressionFormats: ['brotli', 'gzip']
  }
};

// Advanced security configuration for mental health data
const SECURITY_CONFIG = {
  // Multi-layer authentication
  auth: {
    mfa: true,
    biometric: true,
    sessionTimeout: 30, // minutes
    deviceTrust: true
  },
  
  // App Check configuration
  appCheck: {
    providers: ['recaptcha', 'deviceCheck', 'playIntegrity'],
    enforcement: 'strict',
    debugging: false
  },
  
  // Network security
  network: {
    httpsOnly: true,
    hsts: true,
    certificatePinning: true,
    ipWhitelisting: false // Global mental health access
  }
};

module.exports = {
  PERFORMANCE_CONFIG,
  REGIONAL_CONFIG,
  HEALTH_MONITORING,
  PRIVACY_CONFIG,
  MENTAL_HEALTH_EXTENSIONS,
  REALTIME_CONFIG,
  APP_HOSTING_CONFIG,
  SECURITY_CONFIG
};