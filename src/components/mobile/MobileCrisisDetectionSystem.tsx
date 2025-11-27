'use client';

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { CrisisFloatingButton } from '@/components/ui/CrisisFloatingButtonNew';

// Crisis detection state and intervention levels
interface CrisisDetectionState {
  // Detection levels
  riskLevel: 'none' | 'low' | 'moderate' | 'high' | 'severe' | 'imminent';
  confidenceScore: number; // 0-100
  detectedKeywords: string[];
  detectedPatterns: string[];
  
  // User behavioral indicators
  typingPattern: 'normal' | 'erratic' | 'slow' | 'frantic';
  sessionDuration: number;
  interactionFrequency: number;
  emotionalTrajectory: 'stable' | 'declining' | 'volatile' | 'crisis';
  
  // Device and context signals
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'late-night';
  isIsolated: boolean; // Based on usage patterns
  deviceTremors: boolean;
  batteryLevel: number;
  
  // Intervention state
  interventionActive: boolean;
  interventionLevel: 'gentle' | 'moderate' | 'intensive' | 'emergency';
  resourcesOffered: string[];
  emergencyContacted: boolean;
  
  // Historical context
  recentCrisisEvents: number;
  supportEngagement: 'none' | 'low' | 'moderate' | 'high';
  recoveryIndicators: string[];
}

interface CrisisDetectionContextType {
  state: CrisisDetectionState;
  actions: {
    analyzeText: (text: string) => void;
    recordInteraction: (type: 'typing' | 'pause' | 'navigation' | 'submit') => void;
    triggerIntervention: (level: CrisisDetectionState['interventionLevel']) => void;
    offerResources: (resources: string[]) => void;
    escalateToEmergency: () => void;
    reportSafety: () => void;
    updateRiskAssessment: (factors: Partial<CrisisDetectionState>) => void;
  };
  interventions: {
    showGroundingExercise: () => void;
    showBreathingTechnique: () => void;
    showCrisisResources: () => void;
    activateEmergencyProtocol: () => void;
    connectToPeerSupport: () => void;
  };
}

const CrisisDetectionContext = createContext<CrisisDetectionContextType | undefined>(undefined);

interface MobileCrisisDetectionSystemProps {
  children: ReactNode;
  enableProactiveDetection?: boolean;
  enableOfflineMode?: boolean;
}

export function MobileCrisisDetectionSystem({ 
  children, 
  enableProactiveDetection = true,
  enableOfflineMode = true 
}: MobileCrisisDetectionSystemProps) {
  const [state, setState] = useState<CrisisDetectionState>({
    riskLevel: 'none',
    confidenceScore: 0,
    detectedKeywords: [],
    detectedPatterns: [],
    typingPattern: 'normal',
    sessionDuration: 0,
    interactionFrequency: 0,
    emotionalTrajectory: 'stable',
    timeOfDay: 'morning',
    isIsolated: false,
    deviceTremors: false,
    batteryLevel: 100,
    interventionActive: false,
    interventionLevel: 'gentle',
    resourcesOffered: [],
    emergencyContacted: false,
    recentCrisisEvents: 0,
    supportEngagement: 'none',
    recoveryIndicators: []
  });

  const sessionStartTime = useRef(Date.now());
  const typingHistory = useRef<{ timestamp: number; action: string }[]>([]);
  const interactionHistory = useRef<{ timestamp: number; type: string; data?: any }[]>([]);

  // Crisis keyword detection with severity weighting
  const crisisKeywords = {
    severe: {
      keywords: ['suicide', 'kill myself', 'end it all', 'want to die', 'better off dead', 'can\'t go on'],
      weight: 10
    },
    high: {
      keywords: ['hurt myself', 'self harm', 'cutting', 'overdose', 'pills', 'razor', 'bridge', 'gun', 'rope'],
      weight: 8
    },
    moderate: {
      keywords: ['hopeless', 'worthless', 'nobody cares', 'give up', 'can\'t take it', 'everything hurts'],
      weight: 6
    },
    low: {
      keywords: ['sad', 'depressed', 'anxious', 'scared', 'lonely', 'overwhelmed', 'stressed'],
      weight: 3
    }
  };

  // Crisis patterns detection
  const crisisPatterns = {
    finalizing: /(?:saying goodbye|final message|last time|won't see you|this is it)/i,
    planning: /(?:have a plan|know how|researched ways|collected|gathered)/i,
    desperation: /(?:can't take|nothing left|no way out|trap|corner)/i,
    isolation: /(?:nobody understands|all alone|no one cares|pushing everyone away)/i,
    hopelessness: /(?:never get better|pointless|no future|waste of space)/i
  };

  // Real-time text analysis
  const analyzeText = (text: string) => {
    if (!text || text.length < 3) return;

    let totalScore = 0;
    const detectedKeywords: string[] = [];
    const detectedPatterns: string[] = [];

    // Keyword analysis
    Object.entries(crisisKeywords).forEach(([severity, { keywords, weight }]) => {
      keywords.forEach(keyword => {
        if (text.toLowerCase().includes(keyword)) {
          detectedKeywords.push(keyword);
          totalScore += weight;
        }
      });
    });

    // Pattern analysis
    Object.entries(crisisPatterns).forEach(([pattern, regex]) => {
      if (regex.test(text)) {
        detectedPatterns.push(pattern);
        totalScore += pattern === 'finalizing' || pattern === 'planning' ? 15 : 8;
      }
    });

    // Determine risk level based on score
    let riskLevel: CrisisDetectionState['riskLevel'] = 'none';
    if (totalScore >= 20) riskLevel = 'imminent';
    else if (totalScore >= 15) riskLevel = 'severe';
    else if (totalScore >= 10) riskLevel = 'high';
    else if (totalScore >= 6) riskLevel = 'moderate';
    else if (totalScore >= 3) riskLevel = 'low';

    // Update state
    setState(prev => ({
      ...prev,
      riskLevel,
      confidenceScore: Math.min(totalScore * 5, 100),
      detectedKeywords,
      detectedPatterns
    }));

    // Trigger immediate intervention for high-risk content
    if (riskLevel === 'severe' || riskLevel === 'imminent') {
      triggerIntervention(riskLevel === 'imminent' ? 'emergency' : 'intensive');
    } else if (riskLevel === 'high') {
      triggerIntervention('moderate');
    } else if (riskLevel === 'moderate') {
      triggerIntervention('gentle');
    }
  };

  // Monitor user interaction patterns
  const recordInteraction = (type: 'typing' | 'pause' | 'navigation' | 'submit') => {
    const timestamp = Date.now();
    
    interactionHistory.current.push({ timestamp, type });
    
    // Keep only last 50 interactions for performance
    if (interactionHistory.current.length > 50) {
      interactionHistory.current = interactionHistory.current.slice(-50);
    }

    // Analyze typing patterns for distress signals
    if (type === 'typing') {
      typingHistory.current.push({ timestamp, action: 'type' });
      
      // Analyze typing speed and patterns
      const recentTyping = typingHistory.current.filter(t => timestamp - t.timestamp < 30000);
      
      if (recentTyping.length > 10) {
        const intervals = recentTyping.slice(1).map((t, i) => t.timestamp - recentTyping[i].timestamp);
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
        
        let typingPattern: CrisisDetectionState['typingPattern'] = 'normal';
        
        if (variance > 10000) {
          typingPattern = 'erratic'; // High variance indicates distress
        } else if (avgInterval > 2000) {
          typingPattern = 'slow'; // Very slow typing
        } else if (avgInterval < 100) {
          typingPattern = 'frantic'; // Very fast, possibly agitated
        }
        
        setState(prev => ({ ...prev, typingPattern }));
      }
    }

    // Update session metrics
    const sessionDuration = timestamp - sessionStartTime.current;
    const interactionFrequency = interactionHistory.current.length / (sessionDuration / 60000); // per minute

    setState(prev => ({
      ...prev,
      sessionDuration,
      interactionFrequency
    }));
  };

  // Context awareness (time, isolation, etc.)
  useEffect(() => {
    const updateContext = () => {
      const hour = new Date().getHours();
      let timeOfDay: CrisisDetectionState['timeOfDay'] = 'morning';
      
      if (hour >= 6 && hour < 12) timeOfDay = 'morning';
      else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
      else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
      else if (hour >= 22 || hour < 2) timeOfDay = 'night';
      else timeOfDay = 'late-night';

      // Late night usage can be a risk factor
      const isIsolated = timeOfDay === 'late-night' && state.sessionDuration > 30 * 60 * 1000;

      setState(prev => ({ ...prev, timeOfDay, isIsolated }));
    };

    updateContext();
    const interval = setInterval(updateContext, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [state.sessionDuration]);

  // Device tremor detection
  useEffect(() => {
    let motionData: { x: number; y: number; z: number; timestamp: number }[] = [];

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        if (x !== null && y !== null && z !== null) {
          motionData.push({ x, y, z, timestamp: Date.now() });
          
          // Keep only last 20 readings
          if (motionData.length > 20) {
            motionData = motionData.slice(-20);
          }
          
          // Detect tremors/shaking
          if (motionData.length >= 10) {
            const recentMotion = motionData.slice(-10);
            const avgAcceleration = recentMotion.reduce((sum, d) => sum + Math.sqrt(d.x * d.x + d.y * d.y + d.z * d.z), 0) / recentMotion.length;
            
            const deviceTremors = avgAcceleration > 15; // Threshold for detecting tremors
            setState(prev => ({ ...prev, deviceTremors }));
          }
        }
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  // Battery level monitoring
  useEffect(() => {
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setState(prev => ({ ...prev, batteryLevel: battery.level * 100 }));
          
          battery.addEventListener('levelchange', () => {
            setState(prev => ({ ...prev, batteryLevel: battery.level * 100 }));
          });
        } catch (error) {
          console.warn('Battery API not available');
        }
      }
    };

    updateBattery();
  }, []);

  // Trigger intervention based on level
  const triggerIntervention = (level: CrisisDetectionState['interventionLevel']) => {
    setState(prev => ({
      ...prev,
      interventionActive: true,
      interventionLevel: level
    }));

    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      const patterns = {
        gentle: [100, 50, 100],
        moderate: [200, 100, 200, 100, 200],
        intensive: [300, 100, 300, 100, 300, 100, 300],
        emergency: [500, 200, 500, 200, 500, 200, 500]
      };
      navigator.vibrate(patterns[level]);
    }

    // Log intervention for analytics
    if (typeof window !== 'undefined' && 'navigator' in window && 'sendBeacon' in navigator) {
      const data = {
        interventionLevel: level,
        riskLevel: state.riskLevel,
        confidenceScore: state.confidenceScore,
        detectedKeywords: state.detectedKeywords,
        timestamp: new Date().toISOString(),
        sessionDuration: state.sessionDuration,
        deviceContext: {
          timeOfDay: state.timeOfDay,
          isIsolated: state.isIsolated,
          batteryLevel: state.batteryLevel,
          deviceTremors: state.deviceTremors
        }
      };
      
      navigator.sendBeacon('/api/crisis-intervention', JSON.stringify(data));
    }
  };

  // Offer specific resources
  const offerResources = (resources: string[]) => {
    setState(prev => ({
      ...prev,
      resourcesOffered: [...new Set([...prev.resourcesOffered, ...resources])]
    }));
  };

  // Emergency escalation
  const escalateToEmergency = () => {
    setState(prev => ({
      ...prev,
      emergencyContacted: true,
      interventionLevel: 'emergency',
      riskLevel: 'imminent'
    }));

    // Strong haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }

    // Attempt to contact emergency services or hotlines
    if (typeof window !== 'undefined') {
      // Show emergency modal
      const emergencyModal = document.createElement('div');
      emergencyModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div style="background: white; padding: 2rem; border-radius: 20px; text-align: center; max-width: 400px; width: 100%;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🆘</div>
            <h2 style="color: #dc2626; margin-bottom: 1rem;">Emergency Support</h2>
            <p style="margin-bottom: 2rem; color: #374151;">You are not alone. Help is available right now.</p>
            <a href="tel:988" style="display: block; background: #dc2626; color: white; padding: 1rem 2rem; border-radius: 12px; text-decoration: none; font-weight: bold; margin-bottom: 1rem; font-size: 1.25rem;">📞 Call 988 Crisis Lifeline</a>
            <a href="sms:741741?body=HOME" style="display: block; background: #2563eb; color: white; padding: 1rem 2rem; border-radius: 12px; text-decoration: none; font-weight: bold; margin-bottom: 1rem; font-size: 1.25rem;">💬 Text HOME to 741741</a>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #6b7280; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">I'm getting help</button>
          </div>
        </div>
      `;
      document.body.appendChild(emergencyModal);
    }
  };

  // Report user is safe
  const reportSafety = () => {
    setState(prev => ({
      ...prev,
      riskLevel: 'none',
      interventionActive: false,
      confidenceScore: 0,
      detectedKeywords: [],
      detectedPatterns: [],
      recoveryIndicators: [...prev.recoveryIndicators, `safety_reported_${Date.now()}`]
    }));
  };

  // Update risk assessment with external factors
  const updateRiskAssessment = (factors: Partial<CrisisDetectionState>) => {
    setState(prev => ({ ...prev, ...factors }));
  };

  const actions = {
    analyzeText,
    recordInteraction,
    triggerIntervention,
    offerResources,
    escalateToEmergency,
    reportSafety,
    updateRiskAssessment
  };

  const interventions = {
    showGroundingExercise: () => {
      offerResources(['grounding-5-4-3-2-1']);
      // Implementation would show grounding exercise modal
    },
    
    showBreathingTechnique: () => {
      offerResources(['breathing-4-7-8']);
      // Implementation would show breathing exercise
    },
    
    showCrisisResources: () => {
      offerResources(['crisis-hotlines', 'text-support', 'chat-support']);
      // Implementation would show crisis resources
    },
    
    activateEmergencyProtocol: () => {
      escalateToEmergency();
    },
    
    connectToPeerSupport: () => {
      offerResources(['peer-support', 'community-chat']);
      // Implementation would connect to peer support
    }
  };

  // Auto-detection of crisis content in text inputs
  useEffect(() => {
    if (!enableProactiveDetection) return;

    const handleInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement | HTMLInputElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        recordInteraction('typing');
        
        // Analyze content after a brief delay to avoid excessive processing
        setTimeout(() => {
          analyzeText(target.value);
        }, 500);
      }
    };

    const handleKeyDown = () => {
      recordInteraction('typing');
    };

    const handleNavigation = () => {
      recordInteraction('navigation');
    };

    document.addEventListener('input', handleInput);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleNavigation);

    return () => {
      document.removeEventListener('input', handleInput);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleNavigation);
    };
  }, [enableProactiveDetection]);

  return (
    <CrisisDetectionContext.Provider value={{ state, actions, interventions }}>
      {children}
      
      {/* Enhanced Crisis Floating Button with detection integration */}
      <CrisisFloatingButton 
        position="bottom-right" 
        size={state.riskLevel === 'severe' || state.riskLevel === 'imminent' ? 'large' : 'default'}
        autoDetect={true}
        offlineMode={enableOfflineMode}
      />
      
      {/* Risk level indicator for high-risk situations */}
      {(state.riskLevel === 'high' || state.riskLevel === 'severe' || state.riskLevel === 'imminent') && (
        <div className={`fixed top-4 left-4 z-50 px-4 py-2 rounded-full text-white font-medium shadow-lg ${\n          state.riskLevel === 'imminent' ? 'bg-red-600 animate-pulse' :\n          state.riskLevel === 'severe' ? 'bg-red-500' :\n          'bg-orange-500'\n        }`}>\n          {state.riskLevel === 'imminent' ? '🚨 Emergency Support Available' :\n           state.riskLevel === 'severe' ? '🆘 Crisis Support Available' :\n           '⚠️ Support Resources Available'}\n        </div>\n      )}\n      \n      {/* Intervention modals based on detection level */}\n      {state.interventionActive && (\n        <CrisisInterventionModal \n          level={state.interventionLevel}\n          detectedKeywords={state.detectedKeywords}\n          onDismiss={() => setState(prev => ({ ...prev, interventionActive: false }))}\n          onEmergency={escalateToEmergency}\n          onSafe={reportSafety}\n        />\n      )}\n      \n      {/* Device context warnings */}\n      {state.deviceTremors && !state.interventionActive && (\n        <div className=\"fixed bottom-20 left-4 z-40 bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg\">\n          🤝 Tremor support enabled\n        </div>\n      )}\n      \n      {state.isIsolated && state.riskLevel !== 'none' && (\n        <div className=\"fixed bottom-32 left-4 z-40 bg-purple-500 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg\">\n          💜 You're not alone\n        </div>\n      )}\n    </CrisisDetectionContext.Provider>\n  );\n}\n\n// Crisis Intervention Modal Component\ninterface CrisisInterventionModalProps {\n  level: CrisisDetectionState['interventionLevel'];\n  detectedKeywords: string[];\n  onDismiss: () => void;\n  onEmergency: () => void;\n  onSafe: () => void;\n}\n\nfunction CrisisInterventionModal({ \n  level, \n  detectedKeywords, \n  onDismiss, \n  onEmergency, \n  onSafe \n}: CrisisInterventionModalProps) {\n  const getModalContent = () => {\n    switch (level) {\n      case 'emergency':\n        return {\n          title: '🚨 Emergency Support',\n          message: 'We detected you might be in immediate danger. Please reach out for help right now.',\n          bgColor: 'bg-red-50',\n          titleColor: 'text-red-800',\n          textColor: 'text-red-700'\n        };\n      case 'intensive':\n        return {\n          title: '🆘 Crisis Support',\n          message: 'It sounds like you\\'re going through something really difficult. You don\\'t have to face this alone.',\n          bgColor: 'bg-orange-50',\n          titleColor: 'text-orange-800',\n          textColor: 'text-orange-700'\n        };\n      case 'moderate':\n        return {\n          title: '💙 Support Available',\n          message: 'We noticed you might be struggling. There are people who want to help.',\n          bgColor: 'bg-blue-50',\n          titleColor: 'text-blue-800',\n          textColor: 'text-blue-700'\n        };\n      default:\n        return {\n          title: '🌱 Gentle Support',\n          message: 'We\\'re here if you need someone to talk to.',\n          bgColor: 'bg-green-50',\n          titleColor: 'text-green-800',\n          textColor: 'text-green-700'\n        };\n    }\n  };\n\n  const content = getModalContent();\n\n  return (\n    <div className=\"fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4\" role=\"dialog\" aria-labelledby=\"crisis-modal-title\">\n      <div className={`${content.bgColor} rounded-3xl p-8 max-w-md w-full shadow-2xl`}>\n        <h2 id=\"crisis-modal-title\" className={`${content.titleColor} text-2xl font-medium text-center mb-4`}>\n          {content.title}\n        </h2>\n        \n        <p className={`${content.textColor} text-center mb-6 text-lg leading-relaxed`}>\n          {content.message}\n        </p>\n        \n        <div className=\"space-y-3 mb-6\">\n          <button\n            onClick={() => window.location.href = 'tel:988'}\n            className=\"w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-2xl transition-colors\"\n            style={{ minHeight: '60px' }}\n          >\n            📞 Call 988 Crisis Lifeline\n          </button>\n          \n          <button\n            onClick={() => window.location.href = 'sms:741741?body=HOME'}\n            className=\"w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-2xl transition-colors\"\n            style={{ minHeight: '60px' }}\n          >\n            💬 Text HOME to 741741\n          </button>\n          \n          {level === 'emergency' && (\n            <button\n              onClick={onEmergency}\n              className=\"w-full bg-red-800 hover:bg-red-900 text-white font-medium py-4 px-6 rounded-2xl transition-colors\"\n              style={{ minHeight: '60px' }}\n            >\n              🚨 I Need Emergency Help\n            </button>\n          )}\n        </div>\n        \n        <div className=\"flex gap-3\">\n          <button\n            onClick={onSafe}\n            className=\"flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors\"\n          >\n            ✅ I'm Safe Now\n          </button>\n          \n          <button\n            onClick={onDismiss}\n            className=\"flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors\"\n          >\n            Maybe Later\n          </button>\n        </div>\n        \n        {detectedKeywords.length > 0 && (\n          <div className=\"mt-4 text-xs text-gray-600 text-center\">\n            <p>This intervention was triggered to ensure your safety and wellbeing.</p>\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}\n\nexport function useCrisisDetection() {\n  const context = useContext(CrisisDetectionContext);\n  if (context === undefined) {\n    throw new Error('useCrisisDetection must be used within a MobileCrisisDetectionSystem');\n  }\n  return context;\n}\n\n// Hook for crisis-aware component behavior\nexport function useCrisisAwareComponent() {\n  const { state, actions } = useCrisisDetection();\n  \n  return {\n    isAtRisk: state.riskLevel !== 'none',\n    riskLevel: state.riskLevel,\n    shouldSimplifyUI: state.riskLevel === 'high' || state.riskLevel === 'severe' || state.riskLevel === 'imminent',\n    shouldShowSupport: state.riskLevel !== 'none',\n    interventionActive: state.interventionActive,\n    reportInteraction: actions.recordInteraction,\n    analyzeContent: actions.analyzeText,\n    triggerHelp: () => actions.triggerIntervention('moderate')\n  };\n}"