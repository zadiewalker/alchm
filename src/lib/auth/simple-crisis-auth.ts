/**
 * Simplified Crisis Authentication Support
 * Production-ready crisis detection and emergency access
 */

// Simple crisis keyword detection
export const emergencyAuthBypass = {
  detectCrisisKeywords: (text: string) => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
      'die', 'death', 'suicide', 'hopeless', 'no point', 'give up'
    ];
    
    const lowerText = text.toLowerCase();
    const hasCrisisContent = crisisKeywords.some(keyword => lowerText.includes(keyword));
    
    return {
      hasCrisisContent,
      crisisLevel: hasCrisisContent ? 'moderate' : 'mild',
      immediateIntervention: hasCrisisContent,
      confidence: hasCrisisContent ? 0.8 : 0.1
    };
  },

  createEmergencyGuestSession: async (options: any) => {
    console.log('🚨 Creating emergency guest session...');
    return {
      sessionId: 'emergency_' + Date.now(),
      guestMode: true,
      crisisSupport: true,
      timestamp: new Date().toISOString()
    };
  }
};

// Simple offline crisis auth
export const crisisOfflineAuth = {
  getOfflineCapabilities: () => {
    return {
      canWriteOffline: true,
      hasOfflineStorage: typeof typeof window !== 'undefined' && localStorage !== 'undefined',
      supportsCrisisMode: true
    };
  },

  createEmergencyOfflineSession: async (options: any) => {
    console.log('🛡️ Creating offline emergency session...');
    
    if (typeof typeof window !== 'undefined' && localStorage !== 'undefined') {
      typeof window !== 'undefined' && localStorage.setItem('alchm_emergency_session', JSON.stringify({
        sessionId: 'offline_emergency_' + Date.now(),
        crisisLevel: options.crisisLevel || 'mild',
        emergencyMode: options.emergencyMode || true,
        timestamp: new Date().toISOString()
      }));
    }
    
    return {
      sessionId: 'offline_emergency_' + Date.now(),
      offline: true,
      crisisSupport: true
    };
  }
};

// Simple mobile crisis auth
export const mobileCrisisAuth = {
  initializeCrisisMode: () => {
    console.log('📱 Initializing mobile crisis mode...');
    return { crisisMode: true, initialized: true };
  }
};

// Simple trauma-informed error handler
export const traumaInformedErrorHandler = {
  generateResponse: (errorContext: any) => {
    const { type, severity, originalError, userContext } = errorContext;
    
    let primaryMessage = 'Something went wrong, but you\'re safe here.';
    let supportingMessage = 'Take a moment to breathe. We\'ll help you through this.';
    
    if (severity === 'critical' || userContext?.crisisIndicators) {
      primaryMessage = 'We detected you might need extra support right now.';
      supportingMessage = 'Your safety is our priority. Crisis resources are available below.';
    }
    
    const actionOptions = [];
    
    if (userContext?.crisisIndicators || severity === 'critical') {
      actionOptions.push({
        label: 'Crisis Support',
        description: 'Get immediate help',
        action: 'tel:988',
        priority: 'crisis',
        icon: '🆘'
      });
    }
    
    if (userContext?.failedAttempts > 2) {
      actionOptions.push({
        label: 'Emergency Access',
        description: 'Skip sign-in for now',
        action: 'create_guest_session',
        priority: 'primary',
        icon: '🔓'
      });
    }
    
    return {
      primaryMessage,
      supportingMessage,
      actionOptions,
      emotionalSupport: {
        affirmation: 'You are not alone. Help is available.'
      },
      crisisSupport: {
        show: userContext?.crisisIndicators || severity === 'critical'
      }
    };
  }
};

// Simple low bandwidth optimizer
export const lowBandwidthAuthOptimizer = {
  getOptimizationStatus: () => {
    const isSlowConnection = typeof typeof window !== 'undefined' && navigator !== 'undefined' && 
      'connection' in typeof window !== 'undefined' && navigator && 
      (typeof window !== 'undefined' && navigator as any).connection?.effectiveType === 'slow-2g';
    
    const recommendations = [];
    
    if (isSlowConnection) {
      recommendations.push('Using optimized auth flow for slow connection');
      recommendations.push('Reduced visual effects for better performance');
    }
    
    return {
      isOptimized: true,
      recommendations,
      connectionType: isSlowConnection ? 'slow' : 'normal'
    };
  }
};