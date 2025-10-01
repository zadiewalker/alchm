'use client';

/**
 * TRAUMA-INFORMED ASSESSMENT COMPONENT
 * "Gentle Gateway to Healing Sanctuary"
 * 
 * 8-question flow that adapts based on responses, builds immediate trust,
 * and provides therapeutic value while optimizing for conversion.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createFirstSessionMagic } from '@/lib/conversion/first-session-magic-engine';
import { useAuth } from '@/contexts/AuthContext';
import { analytics } from '@/lib/analytics';

interface AssessmentQuestion {
  id: string;
  question: string;
  description: string;
  options: Array<{
    value: string;
    label: string;
    supportiveResponse: string;
    branchingLogic?: string[];
  }>;
  category: 'healing_phase' | 'communication_style' | 'trauma_history' | 'goals' | 'support_needs';
  adaptivePrompt?: (previousAnswers: Record<string, string>) => string;
}

interface AssessmentResponse {
  questionId: string;
  answer: string;
  timestamp: number;
  emotionalResonance: number; // 1-10 how much this resonated
}

interface PersonalizationProfile {
  healingPhase: 'stabilization' | 'processing' | 'integration' | 'growth';
  communicationStyle: 'gentle' | 'direct' | 'reflective' | 'structured';
  traumaInformed: {
    needsExtraValidation: boolean;
    prefersSlowPacing: boolean;
    triggersToAvoid: string[];
    safetyNeeds: string[];
  };
  goals: string[];
  supportStyle: 'independent' | 'guided' | 'community' | 'professional';
  culturalContext: string;
  aiPreferences: {
    tone: 'nurturing' | 'wise' | 'curious' | 'supportive';
    responseLength: 'brief' | 'moderate' | 'detailed';
    insights: 'gentle' | 'direct' | 'exploratory';
  };
}

// Core Assessment Questions with Adaptive Branching
const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'healing_journey_start',
    category: 'healing_phase',
    question: 'Where are you in your healing journey right now?',
    description: 'This helps us understand how to best support you',
    options: [
      {
        value: 'stabilization',
        label: 'I\'m working on feeling safe and grounded',
        supportiveResponse: 'Your courage to prioritize safety and stability is beautiful. Healing begins with creating sanctuary.',
        branchingLogic: ['trauma_informed_gentle']
      },
      {
        value: 'processing',
        label: 'I\'m ready to explore and understand my experiences',
        supportiveResponse: 'This willingness to explore takes incredible bravery. You\'re exactly where you need to be.',
        branchingLogic: ['processing_support']
      },
      {
        value: 'integration',
        label: 'I\'m learning to integrate insights into daily life',
        supportiveResponse: 'Integration is where wisdom becomes transformation. You\'re doing meaningful work.',
        branchingLogic: ['practical_application']
      },
      {
        value: 'growth',
        label: 'I\'m focused on growth and helping others heal',
        supportiveResponse: 'Your journey toward growth and service is inspiring. Healed healers heal the world.',
        branchingLogic: ['advanced_features']
      }
    ]
  },
  {
    id: 'writing_relationship',
    category: 'communication_style',
    question: 'How do you feel about writing and expressing emotions?',
    description: 'Understanding your relationship with expression helps us create the right space',
    options: [
      {
        value: 'loves_writing',
        label: 'I love writing and find it naturally healing',
        supportiveResponse: 'What a gift to have found this natural pathway to healing through words.',
        branchingLogic: ['advanced_prompts']
      },
      {
        value: 'hesitant_but_willing',
        label: 'I\'m hesitant but willing to try',
        supportiveResponse: 'Your openness despite hesitation shows real courage. We\'ll go gently.',
        branchingLogic: ['gentle_encouragement']
      },
      {
        value: 'struggles_with_words',
        label: 'I struggle to put feelings into words',
        supportiveResponse: 'Many of us do. Sometimes the heart speaks in whispers. We\'ll help you listen.',
        branchingLogic: ['alternative_expression']
      },
      {
        value: 'prefers_structured',
        label: 'I prefer guided prompts and structure',
        supportiveResponse: 'Structure can be incredibly supportive. Clear pathways often lead to profound discoveries.',
        branchingLogic: ['structured_guidance']
      }
    ]
  },
  {
    id: 'support_needs',
    category: 'support_needs',
    question: 'What kind of support feels most helpful to you?',
    description: 'Everyone needs different types of support on their healing journey',
    options: [
      {
        value: 'gentle_encouragement',
        label: 'Gentle encouragement and validation',
        supportiveResponse: 'Gentleness is a form of strength. You deserve all the encouragement in the world.',
        branchingLogic: ['nurturing_ai']
      },
      {
        value: 'practical_insights',
        label: 'Practical insights and actionable steps',
        supportiveResponse: 'Wisdom paired with action creates transformation. You\'re ready to move forward.',
        branchingLogic: ['solution_focused']
      },
      {
        value: 'deep_reflection',
        label: 'Deep questions that help me reflect',
        supportiveResponse: 'The examined life reveals its treasures to those brave enough to look deeply.',
        branchingLogic: ['contemplative_prompts']
      },
      {
        value: 'crisis_support',
        label: 'Resources for difficult moments',
        supportiveResponse: 'Your awareness of your needs shows wisdom. Support should always be available.',
        branchingLogic: ['crisis_resources']
      }
    ]
  },
  {
    id: 'ai_companion_style',
    category: 'communication_style',
    question: 'How would you like your AI wisdom companion (Khepera) to communicate?',
    description: 'Khepera adapts to your preferred communication style',
    adaptivePrompt: (answers) => {
      if (answers.support_needs === 'gentle_encouragement') {
        return 'Since you appreciate gentle encouragement, how can Khepera best offer that?';
      }
      return 'How would you like your AI wisdom companion (Khepera) to communicate?';
    },
    options: [
      {
        value: 'nurturing_wise',
        label: 'Like a nurturing, wise friend',
        supportiveResponse: 'Khepera will offer the warmth of understanding friendship combined with ancient wisdom.',
        branchingLogic: ['premium_ai_features']
      },
      {
        value: 'curious_explorer',
        label: 'Like a curious explorer asking thoughtful questions',
        supportiveResponse: 'Khepera will join you in curious exploration, asking questions that open new doorways.',
        branchingLogic: ['exploratory_features']
      },
      {
        value: 'supportive_coach',
        label: 'Like a supportive coach helping me grow',
        supportiveResponse: 'Khepera will be your dedicated practice partner, celebrating every step forward.',
        branchingLogic: ['growth_features']
      },
      {
        value: 'respectful_listener',
        label: 'Mostly listening, responding only when I ask',
        supportiveResponse: 'Khepera honors your need for space and will be present without being intrusive.',
        branchingLogic: ['minimal_ai']
      }
    ]
  },
  {
    id: 'healing_goals',
    category: 'goals',
    question: 'What draws you most to this healing journey right now?',
    description: 'Understanding your intentions helps us support your unique path',
    options: [
      {
        value: 'emotional_regulation',
        label: 'Learning to understand and regulate my emotions',
        supportiveResponse: 'Emotional wisdom is one of life\'s greatest skills. You\'re investing in lifelong growth.',
        branchingLogic: ['emotion_features']
      },
      {
        value: 'trauma_healing',
        label: 'Healing from past trauma or difficult experiences',
        supportiveResponse: 'Your commitment to healing takes immense courage. You deserve all the support available.',
        branchingLogic: ['trauma_support_features']
      },
      {
        value: 'self_discovery',
        label: 'Understanding myself more deeply',
        supportiveResponse: 'Self-knowledge is the beginning of wisdom. You\'re embarking on the most important journey.',
        branchingLogic: ['insight_features']
      },
      {
        value: 'daily_wellness',
        label: 'Creating healthier daily emotional habits',
        supportiveResponse: 'Small, consistent steps create profound transformation. Your daily practice matters immensely.',
        branchingLogic: ['habit_features']
      },
      {
        value: 'relationship_healing',
        label: 'Improving my relationships with others',
        supportiveResponse: 'Healing relationships often begins with healing our relationship with ourselves.',
        branchingLogic: ['relationship_features']
      }
    ]
  },
  {
    id: 'pace_preference',
    category: 'trauma_history',
    question: 'What pace feels right for your healing process?',
    description: 'We honor wherever you are and whatever pace serves your healing',
    adaptivePrompt: (answers) => {
      if (answers.healing_journey_start === 'stabilization') {
        return 'Since you\'re focused on stability, what pace feels safest for you?';
      }
      return 'What pace feels right for your healing process?';
    },
    options: [
      {
        value: 'very_gentle',
        label: 'Very gentle - I need lots of time and safety',
        supportiveResponse: 'Your body and soul know what they need. Gentleness is wisdom, not weakness.',
        branchingLogic: ['trauma_informed_features']
      },
      {
        value: 'steady_consistent',
        label: 'Steady and consistent - regular small steps',
        supportiveResponse: 'Consistency creates transformation. Your commitment to showing up is powerful.',
        branchingLogic: ['habit_building_features']
      },
      {
        value: 'intensive_deep',
        label: 'Ready for intensive, deep work',
        supportiveResponse: 'Your readiness for depth shows incredible strength and self-awareness.',
        branchingLogic: ['advanced_healing_features']
      },
      {
        value: 'flexible_adaptive',
        label: 'Flexible - some days gentle, some days deeper',
        supportiveResponse: 'Honoring your daily needs shows beautiful self-attunement. We\'ll adapt with you.',
        branchingLogic: ['adaptive_features']
      }
    ]
  },
  {
    id: 'community_comfort',
    category: 'support_needs',
    question: 'How do you feel about connecting with others on similar journeys?',
    description: 'Community can be healing, but we respect all comfort levels',
    options: [
      {
        value: 'loves_community',
        label: 'I love sharing and learning from others',
        supportiveResponse: 'Community healing amplifies individual growth. Your openness creates healing for others too.',
        branchingLogic: ['community_features']
      },
      {
        value: 'selective_sharing',
        label: 'I like to share selectively in safe spaces',
        supportiveResponse: 'Choosing your sharing spaces wisely shows good boundaries and self-care.',
        branchingLogic: ['curated_community']
      },
      {
        value: 'prefers_private',
        label: 'I prefer to keep my healing journey private',
        supportiveResponse: 'Privacy is sacred and honored here. Your healing is entirely your own.',
        branchingLogic: ['private_features']
      },
      {
        value: 'maybe_later',
        label: 'Maybe later, but not ready now',
        supportiveResponse: 'Perfect timing is personal timing. Community will be here when you\'re ready.',
        branchingLogic: ['individual_focus']
      }
    ]
  },
  {
    id: 'value_priorities',
    category: 'goals',
    question: 'What matters most to you in a healing support tool?',
    description: 'Your values guide how we can best serve your journey',
    adaptivePrompt: (answers) => {
      const hasPremiumSignals = answers.ai_companion_style === 'nurturing_wise' || 
                               answers.healing_goals === 'trauma_healing' ||
                               answers.pace_preference === 'intensive_deep';
      if (hasPremiumSignals) {
        return 'Given your healing intentions, what would be most valuable in a premium healing sanctuary?';
      }
      return 'What matters most to you in a healing support tool?';
    },
    options: [
      {
        value: 'deep_personalization',
        label: 'Deep personalization that understands my unique journey',
        supportiveResponse: 'Your uniqueness deserves tools that adapt and grow with you. True healing is always personal.',
        branchingLogic: ['premium_personalization']
      },
      {
        value: 'unlimited_support',
        label: 'Unlimited access to wisdom and support when I need it',
        supportiveResponse: 'Healing doesn\'t follow schedules. You deserve support whenever you need it.',
        branchingLogic: ['unlimited_features']
      },
      {
        value: 'privacy_security',
        label: 'Complete privacy and security for my thoughts',
        supportiveResponse: 'Your inner world is sacred. Privacy and security are non-negotiable foundations.',
        branchingLogic: ['security_features']
      },
      {
        value: 'professional_quality',
        label: 'Professional-quality insights and guidance',
        supportiveResponse: 'You deserve the highest quality support for your precious healing journey.',
        branchingLogic: ['professional_features']
      },
      {
        value: 'community_wisdom',
        label: 'Connection to community wisdom and shared experiences',
        supportiveResponse: 'Collective healing wisdom amplifies individual insights. Community is medicine.',
        branchingLogic: ['community_wisdom_features']
      }
    ]
  }
];

// Dynamic branching questions based on responses
const getBranchingQuestions = (responses: Record<string, string>): AssessmentQuestion[] => {
  const additionalQuestions: AssessmentQuestion[] = [];
  
  // Add premium feature interest question if signals are strong
  const premiumSignals = [
    responses.value_priorities === 'deep_personalization',
    responses.value_priorities === 'unlimited_support',
    responses.ai_companion_style === 'nurturing_wise',
    responses.healing_goals === 'trauma_healing',
    responses.pace_preference === 'intensive_deep'
  ].filter(Boolean).length;
  
  if (premiumSignals >= 2) {
    additionalQuestions.push({
      id: 'premium_interest',
      category: 'goals',
      question: 'Would you be interested in a premium sanctuary with enhanced healing features?',
      description: 'Based on your responses, you might benefit from our premium healing sanctuary',
      options: [
        {
          value: 'very_interested',
          label: 'Yes, I\'m ready to invest in my healing journey',
          supportiveResponse: 'Your commitment to investing in yourself is a powerful act of self-love.',
          branchingLogic: ['show_premium_features']
        },
        {
          value: 'maybe_interested',
          label: 'Maybe, I\'d like to learn more first',
          supportiveResponse: 'Wise to explore thoroughly. Let\'s start with your free sanctuary and grow from there.',
          branchingLogic: ['show_trial_offer']
        },
        {
          value: 'free_for_now',
          label: 'I\'d prefer to start with the free features',
          supportiveResponse: 'Perfect! Our free sanctuary provides everything you need to begin meaningful healing.',
          branchingLogic: ['emphasize_free_value']
        }
      ]
    });
  }
  
  return additionalQuestions;
};

interface TraumaInformedAssessmentProps {
  onComplete: (profile: PersonalizationProfile) => void;
  onProgress?: (progress: number) => void;
  userId: string;
}

export default function TraumaInformedAssessment({
  onComplete,
  onProgress,
  userId
}: TraumaInformedAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [assessmentResponses, setAssessmentResponses] = useState<AssessmentResponse[]>([]);
  const [questions, setQuestions] = useState(assessmentQuestions);
  const [sessionMagic] = useState(() => createFirstSessionMagic(userId));
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSupportiveResponse, setCurrentSupportiveResponse] = useState<string>('');
  const [showSupportiveResponse, setShowSupportiveResponse] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  useEffect(() => {
    onProgress?.(progress);
  }, [progress, onProgress]);
  
  useEffect(() => {
    // Initialize session tracking
    sessionMagic.initializeSession();
    
    // Track assessment start
    analytics.trackUser.traumaInformedAdaptation('assessment_started', 9);
  }, []);
  
  const handleAnswer = async (answerValue: string) => {
    setIsProcessing(true);
    
    try {
      const selectedOption = currentQuestion.options.find(opt => opt.value === answerValue);
      if (!selectedOption) return;
      
      // Show supportive response
      setCurrentSupportiveResponse(selectedOption.supportiveResponse);
      setShowSupportiveResponse(true);
      
      // Track response
      const response: AssessmentResponse = {
        questionId: currentQuestion.id,
        answer: answerValue,
        timestamp: Date.now(),
        emotionalResonance: 8 // Would be measured in real implementation
      };
      
      const newResponses = { ...responses, [currentQuestion.id]: answerValue };
      const newAssessmentResponses = [...assessmentResponses, response];
      
      setResponses(newResponses);
      setAssessmentResponses(newAssessmentResponses);
      
      // Track conversion moment
      await sessionMagic.trackConversionMoment(
        'assessment_question_answered',
        {
          questionId: currentQuestion.id,
          answer: answerValue,
          category: currentQuestion.category,
          emotionalResonance: response.emotionalResonance
        },
        `Answered ${currentQuestion.category} question with high engagement`,
        8
      );
      
      // Check if we need to add branching questions
      if (currentQuestionIndex === assessmentQuestions.length - 1) {
        const branchingQuestions = getBranchingQuestions(newResponses);
        if (branchingQuestions.length > 0) {
          setQuestions([...questions, ...branchingQuestions]);
        }
      }
      
      // Brief pause to show supportive response
      setTimeout(async () => {
        setShowSupportiveResponse(false);
        
        if (currentQuestionIndex + 1 >= questions.length) {
          // Assessment complete
          await completeAssessment(newResponses, newAssessmentResponses);
        } else {
          // Move to next question
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error handling assessment answer:', error);
      setIsProcessing(false);
    }
  };
  
  const completeAssessment = async (
    finalResponses: Record<string, string>,
    finalAssessmentResponses: AssessmentResponse[]
  ) => {
    try {
      // Generate personalization profile
      const profile = generatePersonalizationProfile(finalResponses, finalAssessmentResponses);
      
      // Track assessment completion
      await sessionMagic.trackConversionMoment(
        'assessment_completed',
        {
          totalQuestions: questions.length,
          averageEmotionalResonance: finalAssessmentResponses.reduce((sum, r) => sum + r.emotionalResonance, 0) / finalAssessmentResponses.length,
          premiumSignals: calculatePremiumSignals(finalResponses),
          healingPhase: profile.healingPhase
        },
        'Completed trauma-informed assessment with high therapeutic value',
        9
      );
      
      // Track analytics
      analytics.trackUser.traumaInformedAdaptation('assessment_completed', 9);
      analytics.track('conversion', 'assessment_value_delivered', 'personalization_profile', 1, {
        healingPhase: profile.healingPhase,
        communicationStyle: profile.communicationStyle,
        premiumInterest: finalResponses.premium_interest || 'not_assessed'
      });
      
      // Complete the assessment
      onComplete(profile);
      
    } catch (error) {
      console.error('Error completing assessment:', error);
    }
  };
  
  const generatePersonalizationProfile = (
    responses: Record<string, string>,
    assessmentResponses: AssessmentResponse[]
  ): PersonalizationProfile => {
    return {
      healingPhase: (responses.healing_journey_start as any) || 'processing',
      communicationStyle: inferCommunicationStyle(responses),
      traumaInformed: {
        needsExtraValidation: responses.support_needs === 'gentle_encouragement' || responses.pace_preference === 'very_gentle',
        prefersSlowPacing: responses.pace_preference === 'very_gentle' || responses.pace_preference === 'steady_consistent',
        triggersToAvoid: inferTriggersToAvoid(responses),
        safetyNeeds: inferSafetyNeeds(responses)
      },
      goals: inferGoals(responses),
      supportStyle: inferSupportStyle(responses),
      culturalContext: 'general', // Would be enhanced with cultural questions
      aiPreferences: {
        tone: inferAITone(responses),
        responseLength: responses.support_needs === 'practical_insights' ? 'brief' : 'moderate',
        insights: responses.support_needs === 'deep_reflection' ? 'exploratory' : 'gentle'
      }
    };
  };
  
  const inferCommunicationStyle = (responses: Record<string, string>): PersonalizationProfile['communicationStyle'] => {
    if (responses.ai_companion_style === 'supportive_coach') return 'direct';
    if (responses.ai_companion_style === 'curious_explorer') return 'reflective';
    if (responses.support_needs === 'practical_insights') return 'structured';
    return 'gentle';
  };
  
  const inferTriggersToAvoid = (responses: Record<string, string>): string[] => {
    const triggers: string[] = [];
    if (responses.pace_preference === 'very_gentle') triggers.push('pressure', 'urgency');
    if (responses.writing_relationship === 'struggles_with_words') triggers.push('complex_prompts');
    if (responses.community_comfort === 'prefers_private') triggers.push('sharing_pressure');
    return triggers;
  };
  
  const inferSafetyNeeds = (responses: Record<string, string>): string[] => {
    const needs: string[] = ['privacy', 'control'];
    if (responses.support_needs === 'crisis_support') needs.push('crisis_resources');
    if (responses.pace_preference === 'very_gentle') needs.push('pacing_control');
    return needs;
  };
  
  const inferGoals = (responses: Record<string, string>): string[] => {
    const goals: string[] = [];
    if (responses.healing_goals) goals.push(responses.healing_goals);
    if (responses.value_priorities) goals.push(responses.value_priorities);
    return goals;
  };
  
  const inferSupportStyle = (responses: Record<string, string>): PersonalizationProfile['supportStyle'] => {
    if (responses.community_comfort === 'loves_community') return 'community';
    if (responses.ai_companion_style === 'supportive_coach') return 'guided';
    if (responses.value_priorities === 'professional_quality') return 'professional';
    return 'independent';
  };
  
  const inferAITone = (responses: Record<string, string>): PersonalizationProfile['aiPreferences']['tone'] => {
    if (responses.ai_companion_style === 'nurturing_wise') return 'nurturing';
    if (responses.ai_companion_style === 'curious_explorer') return 'curious';
    if (responses.support_needs === 'gentle_encouragement') return 'supportive';
    return 'wise';
  };
  
  const calculatePremiumSignals = (responses: Record<string, string>): number => {
    let signals = 0;
    if (responses.value_priorities === 'deep_personalization') signals += 1;
    if (responses.value_priorities === 'unlimited_support') signals += 1;
    if (responses.ai_companion_style === 'nurturing_wise') signals += 1;
    if (responses.healing_goals === 'trauma_healing') signals += 1;
    if (responses.pace_preference === 'intensive_deep') signals += 1;
    if (responses.premium_interest === 'very_interested') signals += 2;
    return signals;
  };
  
  if (showSupportiveResponse) {
    return (
      <div className="min-h-screen bg-sanctuary-white flex items-center justify-center p-4">
        <Card variant="sanctuary" className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-lg text-sanctuary-gray-700 leading-relaxed italic">
              {currentSupportiveResponse}
            </p>
            <div className="mt-6">
              <div className="w-8 h-1 bg-sage-200 rounded mx-auto animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-sanctuary-white flex items-center justify-center p-4">
        <Card variant="sanctuary" className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-sage-100 rounded-full mx-auto mb-4" />
              <div className="h-4 bg-sage-100 rounded w-3/4 mx-auto mb-2" />
              <div className="h-4 bg-sage-100 rounded w-1/2 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-sanctuary-white">
      {/* Progress Header */}
      <div className="bg-white border-b border-sage-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-light text-sanctuary-gray-900">
              Creating Your Healing Sanctuary
            </h1>
            <span className="text-sm text-sanctuary-gray-600">
              {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-sage-100 rounded-full h-2">
            <div 
              className="bg-sage-400 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Assessment Question */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card variant="sanctuary" className="shadow-nurturing">
          <CardHeader className="text-center pb-8">
            <CardTitle level="h2" className="text-3xl font-light text-sanctuary-gray-900 mb-4">
              {currentQuestion.adaptivePrompt ? 
                currentQuestion.adaptivePrompt(responses) : 
                currentQuestion.question
              }
            </CardTitle>
            <CardDescription className="text-lg text-sanctuary-gray-600 leading-relaxed">
              {currentQuestion.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="lg"
                  className="w-full h-auto p-6 text-left justify-start transition-all duration-300 hover:bg-sage-50 hover:border-sage-200 hover:shadow-soft group"
                  onClick={() => handleAnswer(option.value)}
                  disabled={isProcessing}
                >
                  <div className="flex items-start space-x-4 w-full">
                    <div className="w-6 h-6 rounded-full border-2 border-sage-300 group-hover:border-sage-400 flex-shrink-0 mt-1 transition-colors duration-300" />
                    <div className="flex-1">
                      <p className="text-sanctuary-gray-800 font-medium leading-relaxed">
                        {option.label}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Supportive Context */}
        <div className="mt-8 text-center">
          <p className="text-sm text-sanctuary-gray-500">
            Your responses help us create a personalized healing experience that honors your unique journey
          </p>
        </div>
      </div>
    </div>
  );
}

export type { PersonalizationProfile, AssessmentResponse };