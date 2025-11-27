'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

// ===== KHEPERA CONTEXT TYPES =====

interface KheperaContextType {
  isActive: boolean;
  currentEmotion: string;
  sessionHistory: EmotionalSession[];
  guideToFeature: (emotion: string, feature?: string) => void;
  addEmotionalCheck: (emotion: string, context?: string) => void;
  getRecommendations: (emotion: string) => AppRecommendation[];
  celebrateProgress: (milestone: string) => void;
}

interface EmotionalSession {
  id: string;
  emotion: string;
  timestamp: Date;
  recommendedFeature: string;
  completed: boolean;
}

interface AppRecommendation {
  feature: string;
  path: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
  description: string;
  emotionalBenefit: string;
}

// ===== EMOTIONAL GUIDANCE SYSTEM =====

const EMOTIONAL_GUIDANCE_MAP: Record<string, AppRecommendation[]> = {
  overwhelmed: [
    {
      feature: 'Crisis Support',
      path: '/crisis-resources',
      reason: 'Immediate grounding and nervous system regulation',
      priority: 'high',
      icon: '🆘',
      description: 'Access breathing exercises, grounding techniques, and emergency support',
      emotionalBenefit: 'Find immediate calm and return to your center'
    },
    {
      feature: 'Guided Journaling',
      path: '/journal',
      reason: 'Express overwhelming feelings safely to release pressure',
      priority: 'high',
      icon: '✍️',
      description: 'Write through your emotions with trauma-informed prompts',
      emotionalBenefit: 'Process and release mental overwhelm through expression'
    },
    {
      feature: 'Healing Pathways',
      path: '/pathways',
      reason: 'Structured practices for emotional regulation and resilience',
      priority: 'medium',
      icon: '🌱',
      description: 'Follow guided exercises for building emotional capacity',
      emotionalBenefit: 'Develop sustainable tools for managing overwhelm'
    }
  ],

  sad: [
    {
      feature: 'Sacred Journaling',
      path: '/journal',
      reason: 'Honor and witness your sadness in a safe container',
      priority: 'high',
      icon: '💙',
      description: 'Give voice to your grief and sadness with gentle prompts',
      emotionalBenefit: 'Transform pain into wisdom and self-compassion'
    },
    {
      feature: 'Community Connection',
      path: '/community',
      reason: 'Connect with others who understand your experience',
      priority: 'medium',
      icon: '🤝',
      description: 'Find solidarity and shared experiences of healing',
      emotionalBenefit: 'Feel less alone and more supported in your journey'
    },
    {
      feature: 'Healing Pathways',
      path: '/pathways',
      reason: 'Gentle practices for moving through grief and sadness',
      priority: 'medium',
      icon: '🌅',
      description: 'Structured support for working through difficult emotions',
      emotionalBenefit: 'Find hope and gradual movement toward healing'
    }
  ],

  anxious: [
    {
      feature: 'Grounding & Safety',
      path: '/crisis-resources',
      reason: 'Immediate anxiety relief and nervous system regulation',
      priority: 'high',
      icon: '🌿',
      description: 'Breathing techniques, mindfulness, and safety practices',
      emotionalBenefit: 'Return to the present moment and feel grounded'
    },
    {
      feature: 'Worry Processing',
      path: '/journal',
      reason: 'Get anxious thoughts out of your mind onto paper',
      priority: 'high',
      icon: '🧠',
      description: 'Transform worry and rumination into clarity through writing',
      emotionalBenefit: 'Reduce mental loops and gain perspective'
    },
    {
      feature: 'Progress Review',
      path: '/dashboard',
      reason: 'See evidence of your resilience and growth over time',
      priority: 'medium',
      icon: '📈',
      description: 'Visual reminders of your strength and progress',
      emotionalBenefit: 'Build confidence in your ability to handle challenges'
    }
  ],

  angry: [
    {
      feature: 'Emotional Expression',
      path: '/journal',
      reason: 'Safe space to express and understand your anger',
      priority: 'high',
      icon: '🔥',
      description: 'Transform anger into insight and empowered action',
      emotionalBenefit: 'Channel emotional energy constructively'
    },
    {
      feature: 'Boundary Work',
      path: '/pathways',
      reason: 'Learn healthy ways to protect your energy and values',
      priority: 'high',
      icon: '🛡️',
      description: 'Develop assertiveness and healthy boundary-setting skills',
      emotionalBenefit: 'Feel empowered and respected in relationships'
    },
    {
      feature: 'Community Support',
      path: '/community',
      reason: 'Connect with others who validate your experience',
      priority: 'medium',
      icon: '💪',
      description: 'Share experiences and gain perspective from others',
      emotionalBenefit: 'Feel understood and less isolated in your anger'
    }
  ],

  joyful: [
    {
      feature: 'Gratitude & Joy',
      path: '/journal',
      reason: 'Capture and amplify positive moments and insights',
      priority: 'high',
      icon: '✨',
      description: 'Document your joy, growth, and grateful moments',
      emotionalBenefit: 'Deepen appreciation and expand positive experiences'
    },
    {
      feature: 'Progress Celebration',
      path: '/dashboard',
      reason: 'Reflect on your growth and celebrate how far you\'ve come',
      priority: 'medium',
      icon: '🎉',
      description: 'Review your healing journey and acknowledge achievements',
      emotionalBenefit: 'Build on momentum and recognize your resilience'
    },
    {
      feature: 'Share Your Light',
      path: '/community',
      reason: 'Inspire others with your progress and positive energy',
      priority: 'medium',
      icon: '🌟',
      description: 'Connect and contribute to collective community healing',
      emotionalBenefit: 'Find purpose in supporting others\' journeys'
    }
  ],

  confused: [
    {
      feature: 'Clarity Journaling',
      path: '/journal',
      reason: 'Explore thoughts and feelings to find inner direction',
      priority: 'high',
      icon: '🔍',
      description: 'Use writing to untangle complex emotions and thoughts',
      emotionalBenefit: 'Gain insight, clarity, and self-understanding'
    },
    {
      feature: 'Guided Exploration',
      path: '/pathways',
      reason: 'Structured exploration of your inner landscape',
      priority: 'high',
      icon: '🧭',
      description: 'Step-by-step guidance for self-discovery and clarity',
      emotionalBenefit: 'Find direction, purpose, and authentic path forward'
    },
    {
      feature: 'Pattern Recognition',
      path: '/dashboard',
      reason: 'Review insights and patterns from your healing journey',
      priority: 'medium',
      icon: '📊',
      description: 'See themes, growth, and wisdom emerging over time',
      emotionalBenefit: 'Recognize your inner wisdom and progress'
    }
  ]
};

// ===== CONTEXT CREATION =====

const KheperaContext = createContext<KheperaContextType | undefined>(undefined);

export function KheperaProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isActive, setIsActive] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [sessionHistory, setSessionHistory] = useState<EmotionalSession[]>([]);

  // ===== GUIDANCE FUNCTIONS =====

  const guideToFeature = useCallback((emotion: string, feature?: string) => {
    const recommendations = EMOTIONAL_GUIDANCE_MAP[emotion.toLowerCase()] || [];
    
    if (feature) {
      const targetRec = recommendations.find(rec => 
        rec.feature.toLowerCase().includes(feature.toLowerCase())
      );
      if (targetRec) {
        router.push(targetRec.path);
        return;
      }
    }

    // Navigate to primary recommendation
    if (recommendations.length > 0) {
      const primary = recommendations.find(r => r.priority === 'high') || recommendations[0];
      router.push(primary.path);
    }
  }, [router]);

  const addEmotionalCheck = useCallback((emotion: string, context?: string) => {
    setCurrentEmotion(emotion);
    
    const session: EmotionalSession = {
      id: `session-${Date.now()}`,
      emotion,
      timestamp: new Date(),
      recommendedFeature: EMOTIONAL_GUIDANCE_MAP[emotion]?.[0]?.feature || '',
      completed: false
    };
    
    setSessionHistory(prev => [...prev, session]);
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('khepera_sessions', JSON.stringify([...sessionHistory, session]));
    }
  }, [sessionHistory]);

  const getRecommendations = useCallback((emotion: string): AppRecommendation[] => {
    return EMOTIONAL_GUIDANCE_MAP[emotion.toLowerCase()] || [];
  }, []);

  const celebrateProgress = useCallback((milestone: string) => {
    // Mark recent sessions as completed
    const updatedHistory = sessionHistory.map(session => ({
      ...session,
      completed: true
    }));
    setSessionHistory(updatedHistory);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('khepera_sessions', JSON.stringify(updatedHistory));
    }
  }, [sessionHistory]);

  // ===== INITIALIZATION =====

  useEffect(() => {
    // Load session history from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('khepera_sessions');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSessionHistory(parsed);
        } catch (error) {
          console.warn('Failed to parse Khepera session history:', error);
        }
      }
    }
  }, []);

  const contextValue: KheperaContextType = {
    isActive,
    currentEmotion,
    sessionHistory,
    guideToFeature,
    addEmotionalCheck,
    getRecommendations,
    celebrateProgress
  };

  return (
    <KheperaContext.Provider value={contextValue}>
      {children}
    </KheperaContext.Provider>
  );
}

// ===== CUSTOM HOOK =====

export function useKhepera() {
  const context = useContext(KheperaContext);
  if (context === undefined) {
    throw new Error('useKhepera must be used within a KheperaProvider');
  }
  return context;
}

// ===== UTILITY FUNCTIONS =====

export function detectEmotionFromText(text: string): string {
  const lowerText = text.toLowerCase();
  
  const emotionalKeywords = {
    overwhelmed: ['overwhelmed', 'too much', 'can\'t handle', 'stressed', 'pressure', 'chaotic', 'drowning'],
    sad: ['sad', 'depressed', 'down', 'empty', 'hopeless', 'crying', 'hurt', 'lonely', 'grief'],
    anxious: ['anxious', 'worried', 'nervous', 'panic', 'fear', 'scared', 'restless', 'racing thoughts'],
    angry: ['angry', 'mad', 'frustrated', 'furious', 'rage', 'annoyed', 'pissed', 'irritated'],
    joyful: ['happy', 'joy', 'excited', 'grateful', 'amazing', 'wonderful', 'blessed', 'celebrating'],
    confused: ['confused', 'lost', 'don\'t know', 'unclear', 'mixed up', 'uncertain', 'torn']
  };

  for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return emotion;
    }
  }
  
  return 'neutral';
}