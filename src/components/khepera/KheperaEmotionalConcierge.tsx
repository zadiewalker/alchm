'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

// ===== EMOTIONAL CONCIERGE TYPES =====

interface EmotionalState {
  primary: string;
  intensity: number;
  needs: string[];
  recommendations: AppRecommendation[];
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

interface ConciergeMessage {
  id: string;
  type: 'greeting' | 'emotional_check' | 'feature_guide' | 'progress_celebration';
  content: string;
  recommendations?: AppRecommendation[];
  timestamp: Date;
}

// ===== EMOTIONAL FEATURE MAPPING =====

const EMOTIONAL_FEATURE_MAP: Record<string, AppRecommendation[]> = {
  'overwhelmed': [
    {
      feature: 'Crisis Support',
      path: '/crisis-resources',
      reason: 'Immediate grounding and support resources',
      priority: 'high',
      icon: '🆘',
      description: 'Access breathing exercises and emergency support',
      emotionalBenefit: 'Find immediate calm and stability'
    },
    {
      feature: 'Guided Journaling',
      path: '/journal',
      reason: 'Express and process overwhelming feelings',
      priority: 'high',
      icon: '✍️',
      description: 'Write through your emotions with gentle prompts',
      emotionalBenefit: 'Release mental pressure and gain clarity'
    },
    {
      feature: 'Pathways',
      path: '/pathways',
      reason: 'Structured guidance for emotional regulation',
      priority: 'medium',
      icon: '🌱',
      description: 'Follow step-by-step healing exercises',
      emotionalBenefit: 'Build sustainable coping strategies'
    }
  ],
  'sad': [
    {
      feature: 'Journal Your Heart',
      path: '/journal',
      reason: 'Honor and process your sadness safely',
      priority: 'high',
      icon: '💙',
      description: 'Give voice to your feelings in a sacred space',
      emotionalBenefit: 'Transform pain into wisdom'
    },
    {
      feature: 'Community',
      path: '/community',
      reason: 'Connect with others who understand',
      priority: 'medium',
      icon: '🤝',
      description: 'Find solidarity and shared experiences',
      emotionalBenefit: 'Feel less alone in your journey'
    },
    {
      feature: 'Pathways to Healing',
      path: '/pathways',
      reason: 'Gentle practices for emotional recovery',
      priority: 'medium',
      icon: '🌅',
      description: 'Structured support for working through sadness',
      emotionalBenefit: 'Gradual movement toward hope'
    }
  ],
  'anxious': [
    {
      feature: 'Grounding Exercises',
      path: '/crisis-resources',
      reason: 'Immediate anxiety relief techniques',
      priority: 'high',
      icon: '🌿',
      description: 'Breathing and mindfulness practices',
      emotionalBenefit: 'Return to the present moment'
    },
    {
      feature: 'Worry Journaling',
      path: '/journal',
      reason: 'Get anxious thoughts out of your head',
      priority: 'high',
      icon: '🧠',
      description: 'Transform worry into clarity through writing',
      emotionalBenefit: 'Reduce mental rumination'
    },
    {
      feature: 'Progress Dashboard',
      path: '/dashboard',
      reason: 'See evidence of your growth and stability',
      priority: 'medium',
      icon: '📈',
      description: 'Visual reminders of your resilience',
      emotionalBenefit: 'Build confidence in your ability to cope'
    }
  ],
  'angry': [
    {
      feature: 'Emotional Expression Journal',
      path: '/journal',
      reason: 'Safe space to express and understand anger',
      priority: 'high',
      icon: '🔥',
      description: 'Transform anger into insight and action',
      emotionalBenefit: 'Channel energy constructively'
    },
    {
      feature: 'Boundary Setting Pathways',
      path: '/pathways',
      reason: 'Learn healthy ways to protect your energy',
      priority: 'high',
      icon: '🛡️',
      description: 'Develop assertiveness and self-protection skills',
      emotionalBenefit: 'Feel empowered and respected'
    },
    {
      feature: 'Community Support',
      path: '/community',
      reason: 'Connect with others who validate your experience',
      priority: 'medium',
      icon: '💪',
      description: 'Share experiences and gain perspective',
      emotionalBenefit: 'Feel understood and less isolated'
    }
  ],
  'joyful': [
    {
      feature: 'Gratitude Journaling',
      path: '/journal',
      reason: 'Capture and amplify positive moments',
      priority: 'high',
      icon: '✨',
      description: 'Document your joy and growth',
      emotionalBenefit: 'Deepen appreciation and self-awareness'
    },
    {
      feature: 'Progress Celebration',
      path: '/dashboard',
      reason: 'Reflect on how far you\'ve come',
      priority: 'medium',
      icon: '🎉',
      description: 'Review your journey and achievements',
      emotionalBenefit: 'Build on momentum and success'
    },
    {
      feature: 'Share Your Growth',
      path: '/community',
      reason: 'Inspire others with your progress',
      priority: 'medium',
      icon: '🌟',
      description: 'Connect and contribute to community healing',
      emotionalBenefit: 'Find purpose in helping others'
    }
  ],
  'confused': [
    {
      feature: 'Clarity Journaling',
      path: '/journal',
      reason: 'Explore thoughts and feelings to find direction',
      priority: 'high',
      icon: '🔍',
      description: 'Use writing to untangle complex emotions',
      emotionalBenefit: 'Gain insight and self-understanding'
    },
    {
      feature: 'Guided Pathways',
      path: '/pathways',
      reason: 'Structured exploration of your inner landscape',
      priority: 'high',
      icon: '🧭',
      description: 'Step-by-step guidance for self-discovery',
      emotionalBenefit: 'Find direction and purpose'
    },
    {
      feature: 'Reflection Dashboard',
      path: '/dashboard',
      reason: 'Review patterns and insights from your journey',
      priority: 'medium',
      icon: '📊',
      description: 'See themes and growth over time',
      emotionalBenefit: 'Recognize your wisdom and progress'
    }
  ]
};

// ===== EMOTIONAL CONCIERGE COMPONENT =====

export default function KheperaEmotionalConcierge() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [showConcierge, setShowConcierge] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // ===== EMOTIONAL STATE DETECTION =====

  const detectEmotionalState = useCallback((userInput: string): EmotionalState => {
    const text = userInput.toLowerCase();
    
    const emotionalKeywords = {
      overwhelmed: ['overwhelmed', 'too much', 'can\'t handle', 'stressed', 'pressure'],
      sad: ['sad', 'depressed', 'down', 'empty', 'hopeless', 'cry'],
      anxious: ['anxious', 'worried', 'nervous', 'panic', 'fear'],
      angry: ['angry', 'mad', 'frustrated', 'furious', 'rage'],
      joyful: ['happy', 'joy', 'excited', 'grateful', 'amazing'],
      confused: ['confused', 'lost', 'don\'t know', 'unclear', 'mixed up']
    };

    let detectedEmotion = 'neutral';
    let maxMatches = 0;

    Object.entries(emotionalKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
      }
    });

    const recommendations = EMOTIONAL_FEATURE_MAP[detectedEmotion] || [];
    
    return {
      primary: detectedEmotion,
      intensity: Math.min(10, maxMatches * 3),
      needs: recommendations.map(r => r.emotionalBenefit),
      recommendations
    };
  }, []);

  // ===== CONCIERGE MESSAGING =====

  const addConciergeMessage = useCallback((type: ConciergeMessage['type'], content: string, recommendations?: AppRecommendation[]) => {
    const message: ConciergeMessage = {
      id: `concierge-${Date.now()}`,
      type,
      content,
      recommendations,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
  }, []);

  // ===== PROACTIVE EMOTIONAL CHECK-IN =====

  useEffect(() => {
    if (user && !hasCheckedIn) {
      setTimeout(() => {
        addConciergeMessage(
          'greeting',
          `Welcome back to your sanctuary, ${user.email?.split('@')[0] || 'beautiful soul'}. I'm Khepera, your emotional concierge. How are you feeling as you arrive here today?`
        );
        setShowConcierge(true);
        setHasCheckedIn(true);
      }, 2000);
    }
  }, [user, hasCheckedIn, addConciergeMessage]);

  // ===== EMOTIONAL RESPONSE HANDLER =====

  const handleEmotionalResponse = useCallback((emotionText: string) => {
    const emotionalState = detectEmotionalState(emotionText);
    setCurrentEmotion(emotionalState.primary);
    
    let responseContent = '';
    
    switch (emotionalState.primary) {
      case 'overwhelmed':
        responseContent = `I can sense you're carrying a lot right now. That feeling of being overwhelmed is your nervous system asking for support. Let me guide you to some tools that can help you find your center again.`;
        break;
      case 'sad':
        responseContent = `I honor the sadness you're experiencing. Grief and sorrow are sacred emotions that deserve gentle attention. I'm here to help you move through this with care and wisdom.`;
        break;
      case 'anxious':
        responseContent = `I notice the anxiety that's stirring within you. Your body and mind are trying to protect you, but let's find some grounding tools to help you feel safer in this moment.`;
        break;
      case 'angry':
        responseContent = `I feel the fire of your anger - it often carries important information about your boundaries and values. Let's channel this energy into healing and empowerment.`;
        break;
      case 'joyful':
        responseContent = `What a beautiful energy you're bringing! Joy is medicine for both you and our community. Let's explore ways to honor and expand this positive experience.`;
        break;
      case 'confused':
        responseContent = `I sense you're in a space of uncertainty, which actually holds great potential for growth. Let's explore this together and help you find clarity through reflection.`;
        break;
      default:
        responseContent = `Thank you for sharing your current state with me. I'm here to support whatever you're experiencing. Let's find the right tools for your journey today.`;
    }

    addConciergeMessage('feature_guide', responseContent, emotionalState.recommendations);
  }, [detectEmotionalState, addConciergeMessage]);

  // ===== NAVIGATION HANDLER =====

  const navigateToFeature = useCallback((path: string, feature: string) => {
    addConciergeMessage(
      'progress_celebration',
      `Wonderful! I'm taking you to ${feature}. Remember, I'll be here when you're ready to reflect on your experience or need guidance to another part of your healing journey.`
    );
    
    setTimeout(() => {
      router.push(path);
    }, 1000);
  }, [router, addConciergeMessage]);

  // ===== RENDER METHODS =====

  const renderRecommendationCard = (rec: AppRecommendation) => (
    <div
      key={rec.feature}
      className="bg-white rounded-xl border border-sage-200 p-4 hover:border-sage-400 transition-all duration-200 cursor-pointer"
      onClick={() => navigateToFeature(rec.path, rec.feature)}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{rec.icon}</div>
        <div className="flex-1">
          <h4 className="font-medium text-sanctuary-gray-900 mb-1">{rec.feature}</h4>
          <p className="text-sm text-sanctuary-gray-600 mb-2">{rec.description}</p>
          <div className="bg-sage-50 rounded-lg p-2">
            <p className="text-xs text-sage-700 font-medium">Emotional Benefit:</p>
            <p className="text-xs text-sage-600">{rec.emotionalBenefit}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConciergeInterface = () => {
    if (!showConcierge) return null;

    return (
      <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-sage-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-400 to-sage-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  🦋
                </div>
                <div>
                  <h3 className="font-medium">Khepera</h3>
                  <p className="text-sm text-white/80">Your Emotional Concierge</p>
                </div>
              </div>
              <button
                onClick={() => setShowConcierge(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 max-h-96 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div className="bg-sage-50 rounded-lg p-3">
                  <p className="text-sm text-sanctuary-gray-800">{message.content}</p>
                </div>

                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-sage-700 mb-2">
                      Here's what I recommend for you right now:
                    </p>
                    {message.recommendations
                      .sort((a, b) => a.priority === 'high' ? -1 : 1)
                      .map(renderRecommendationCard)}
                  </div>
                )}
              </div>
            ))}

            {/* Emotional input for first-time users */}
            {!currentEmotion && hasCheckedIn && (
              <div className="space-y-2">
                <p className="text-xs text-sanctuary-gray-600 mb-2">Quick emotional check-in:</p>
                <div className="flex flex-wrap gap-2">
                  {['overwhelmed', 'sad', 'anxious', 'angry', 'joyful', 'confused'].map(emotion => (
                    <button
                      key={emotion}
                      onClick={() => handleEmotionalResponse(`I'm feeling ${emotion}`)}
                      className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-xs hover:bg-sage-200 transition-colors"
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return renderConciergeInterface();
}

// ===== USAGE HOOK =====

export function useKheperaGuidance() {
  const addGuidance = useCallback((emotionalState: string, context?: string) => {
    const guidance = EMOTIONAL_FEATURE_MAP[emotionalState.toLowerCase()] || [];
    return guidance;
  }, []);

  return { addGuidance };
}