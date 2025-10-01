'use client';

// Mobile capabilities detection
export function detectMobileCapabilities() {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  
  const browserName = getBrowserName();
  const supportsPopups = !isIOS; // iOS Safari blocks popups more aggressively
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    browserName,
    supportsPopups,
    deviceStress: getDeviceStressLevel()
  };
}

// Check if redirect is in progress
export function isRedirectInProgress(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('state') || urlParams.has('code') || document.referrer.includes('google.com');
}

// Pre-warm mobile auth
export async function preWarmMobileAuth(): Promise<void> {
  try {
    // Pre-load Firebase Auth for faster mobile loading
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        import('firebase/auth');
      });
    } else {
      setTimeout(() => {
        import('firebase/auth');
      }, 100);
    }
  } catch (error) {
    console.log('Pre-warm auth failed:', error);
  }
}

// Low bandwidth optimization
export const lowBandwidthAuthOptimizer = {
  getOptimizationStatus() {
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      (connection.downlink && connection.downlink < 1.5)
    );
    
    const recommendations: string[] = [];
    
    if (isSlowConnection) {
      recommendations.push('Optimized for slow connection');
      recommendations.push('Reduced image loading');
    }
    
    if (!navigator.onLine) {
      recommendations.push('Offline mode available');
    }
    
    return {
      isOptimized: true,
      recommendations,
      connectionType: connection?.effectiveType || 'unknown'
    };
  }
};

// Crisis offline auth
export const crisisOfflineAuth = {
  getOfflineCapabilities() {
    const supportsServiceWorker = 'serviceWorker' in navigator;
    const supportsLocalStorage = typeof Storage !== 'undefined';
    const supportsIndexedDB = 'indexedDB' in window;
    
    return {
      canWorkOffline: supportsServiceWorker && supportsLocalStorage,
      supportsServiceWorker,
      supportsLocalStorage,
      supportsIndexedDB,
      offlineJournalingAvailable: true
    };
  }
};

// Domain validation
export function validateAuthDomain(): boolean {
  const allowedDomains = [
    'localhost',
    'alchmapp.web.app',
    'alchm-digital-sanctuary.web.app',
    'www.alchmapp.com',
    'alchm.app'
  ];
  
  const currentDomain = window.location.hostname;
  return allowedDomains.some(domain => currentDomain.includes(domain));
}

// Get current domain type
export function getCurrentDomainType(): string {
  const hostname = window.location.hostname;
  
  if (hostname.includes('localhost')) return 'development';
  if (hostname.includes('alchmapp.web.app')) return 'production';
  if (hostname.includes('alchm-digital-sanctuary.web.app')) return 'firebase-hosting';
  if (hostname.includes('alchmapp.com')) return 'custom-domain';
  if (hostname.includes('alchm.app')) return 'short-domain';
  
  return 'unknown';
}

// Emergency auth bypass
export const emergencyAuthBypass = {
  detectCrisisKeywords(text: string) {
    const crisisKeywords = [
      'kill myself', 'end my life', 'want to die', 'suicide', 'suicidal',
      'hurt myself', 'self harm', 'cut myself', 'overdose',
      'hopeless', 'worthless', 'can\'t go on', 'give up',
      'emergency', 'crisis', 'help me'
    ];
    
    const text_lower = text.toLowerCase();
    const foundKeywords = crisisKeywords.filter(keyword => 
      text_lower.includes(keyword)
    );
    
    const hasCrisisContent = foundKeywords.length > 0;
    
    let crisisLevel: 'mild' | 'moderate' | 'severe' | 'critical' = 'mild';
    let immediateIntervention = false;
    
    if (hasCrisisContent) {
      const severeCrisisKeywords = ['kill myself', 'end my life', 'suicide', 'overdose'];
      const hasSevereKeywords = severeCrisisKeywords.some(keyword => 
        text_lower.includes(keyword)
      );
      
      if (hasSevereKeywords) {
        crisisLevel = 'critical';
        immediateIntervention = true;
      } else if (foundKeywords.length > 1) {
        crisisLevel = 'severe';
        immediateIntervention = true;
      } else {
        crisisLevel = 'moderate';
      }
    }
    
    return {
      hasCrisisContent,
      crisisLevel,
      immediateIntervention,
      detectedKeywords: foundKeywords
    };
  },
  
  async createEmergencyGuestSession(context: any) {
    try {
      // Create a guest session for crisis situations
      const sessionId = 'emergency_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      return {
        sessionId,
        type: 'emergency',
        crisisLevel: context.crisisDetection?.crisisLevel || 'moderate',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
    } catch (error) {
      console.error('Emergency session creation failed:', error);
      throw error;
    }
  }
};

// Trauma-informed error handler
export const traumaInformedErrorHandler = {
  generateResponse(context: any) {
    const { type, severity, originalError, userContext } = context;
    
    let primaryMessage = 'Something went wrong. Please try again in a moment.';
    let supportingMessage = 'Take your time - we\'ll be here when you\'re ready.';
    let actionOptions: any[] = [];
    let emotionalSupport: any = null;
    
    if (severity === 'critical' || userContext.crisisIndicators) {
      primaryMessage = 'We care about you and want you to be safe.';
      supportingMessage = 'If you\'re having thoughts of self-harm, you don\'t need to sign in to get help right now.';
      
      actionOptions = [
        {
          label: 'Call 988 Crisis Line',
          action: 'tel:988',
          priority: 'crisis',
          icon: '🆘'
        },
        {
          label: 'Text HOME to 741741',
          action: 'sms:741741&body=HOME',
          priority: 'crisis',
          icon: '💬'
        },
        {
          label: 'Safe journaling space',
          action: 'create_guest_session',
          priority: 'primary',
          icon: '🏠',
          description: 'Works without signing in'
        }
      ];
      
      emotionalSupport = {
        affirmation: 'Your feelings are valid. You matter. You are not alone.'
      };
    } else if (severity === 'high' || userContext.failedAttempts > 2) {
      if (userContext.timeOfDay === 'late_night') {
        primaryMessage = 'Having trouble signing in? It\'s late - your mind might be tired.';
        supportingMessage = 'Sometimes a short break can help. Your sanctuary will be here when you\'re ready.';
      } else {
        primaryMessage = 'Multiple sign-in attempts detected. Let\'s take a gentle approach.';
        supportingMessage = 'Technology can be frustrating. You\'re doing nothing wrong.';
      }
      
      actionOptions = [
        {
          label: 'Try guest access',
          action: 'create_guest_session',
          priority: 'primary',
          icon: '🔓',
          description: 'Skip sign-in for now'
        }
      ];
    } else {
      if (type === 'authentication') {
        primaryMessage = 'Authentication encountered a gentle hiccup.';
        supportingMessage = 'This happens sometimes. Your information is safe with us.';
      }
    }
    
    return {
      primaryMessage,
      supportingMessage,
      actionOptions,
      emotionalSupport,
      crisisSupport: {
        show: severity === 'critical' || userContext.crisisIndicators
      }
    };
  }
};

// Helper functions
function getBrowserName(): string {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  
  return 'Unknown';
}

function getDeviceStressLevel(): 'low' | 'moderate' | 'high' {
  try {
    const memory = (performance as any).memory;
    const connection = (navigator as any).connection;
    
    if (memory && memory.usedJSHeapSize && memory.jsHeapSizeLimit && 
        memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
      return 'high';
    }
    
    if (connection && connection.effectiveType === 'slow-2g') {
      return 'high';
    }
    
    return 'moderate';
  } catch (error) {
    // Fallback if performance API is not available
    return 'moderate';
  }
}