'use client';

/**
 * VALUE DELIVERY SYSTEM
 * "Immediate Therapeutic Impact + Premium Feature Demonstration"
 * 
 * Creates beautiful, immediate value through insights and visualizations
 * while naturally showcasing premium features and conversion opportunities.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createFirstSessionMagic } from '@/lib/conversion/first-session-magic-engine';
import { PersonalizationProfile } from '@/components/onboarding/TraumaInformedAssessment';
import { analytics } from '@/lib/analytics';

interface ValueMoment {
  id: string;
  type: 'insight' | 'visualization' | 'prediction' | 'resource' | 'milestone';
  title: string;
  description: string;
  content: React.ReactNode;
  therapeutic_value: number; // 1-10 scale
  premium_enhancement?: {
    feature: string;
    description: string;
    upgrade_path: string;
    value_proposition: string;
  };
  emotional_impact: 'gentle' | 'moderate' | 'profound';
  timing: 'immediate' | 'progressive' | 'milestone';
}

interface HealingJourneyVisualization {
  current_phase: string;
  progress_percentage: number;
  milestones_achieved: string[];
  next_milestone: {
    name: string;
    description: string;
    estimated_timeline: string;
  };
  growth_trajectory: Array<{
    date: string;
    progress: number;
    mood: number;
    insight_quality: number;
  }>;
  therapeutic_predictions: {
    thirty_days: string;
    sixty_days: string;
    ninety_days: string;
  };
}

interface WellnessInsights {
  patterns_detected: Array<{
    pattern: string;
    frequency: string;
    impact: 'positive' | 'neutral' | 'challenging';
    recommendation: string;
  }>;
  emotional_intelligence_score: number;
  resilience_indicators: string[];
  growth_opportunities: string[];
  personalized_affirmations: string[];
}

interface ValueDeliverySystemProps {
  userProfile: PersonalizationProfile;
  entryData: {
    content: string;
    insights: any[];
    moodData: any;
    conversionInterest: boolean;
  };
  onConversionAction: (action: 'premium_trial' | 'upgrade_now' | 'continue_free') => void;
  userId: string;
}

export default function ValueDeliverySystem({
  userProfile,
  entryData,
  onConversionAction,
  userId
}: ValueDeliverySystemProps) {
  const [currentValueMoment, setCurrentValueMoment] = useState(0);
  const [showValueMoments, setShowValueMoments] = useState(false);
  const [healingJourney, setHealingJourney] = useState<HealingJourneyVisualization | null>(null);
  const [wellnessInsights, setWellnessInsights] = useState<WellnessInsights | null>(null);
  const [sessionMagic] = useState(() => createFirstSessionMagic(userId));
  const [deliveredValue, setDeliveredValue] = useState(0);
  const [showPremiumComparison, setShowPremiumComparison] = useState(false);
  
  const valueMoments: ValueMoment[] = [
    {
      id: 'immediate_insights',
      type: 'insight',
      title: 'Your Emotional Intelligence in Action',
      description: 'Based on your writing, here\'s what we discovered about your emotional awareness',
      content: <EmotionalIntelligenceDisplay insights={entryData.insights} />,
      therapeutic_value: 9,
      emotional_impact: 'moderate',
      timing: 'immediate',
      premium_enhancement: {
        feature: 'Advanced Pattern Recognition',
        description: 'Track emotional patterns across all entries with AI-powered analysis',
        upgrade_path: 'premium_trial',
        value_proposition: 'Understand your emotional evolution over time'
      }
    },
    {
      id: 'healing_journey_map',
      type: 'visualization',
      title: 'Your Healing Journey Visualization',
      description: 'See where you are now and where you\'re heading on your healing path',
      content: <HealingJourneyMap journey={healingJourney} />,
      therapeutic_value: 10,
      emotional_impact: 'profound',
      timing: 'progressive',
      premium_enhancement: {
        feature: 'Complete Journey Dashboard',
        description: 'Full healing journey tracking with milestone celebrations and progress analytics',
        upgrade_path: 'premium_trial',
        value_proposition: 'Never lose sight of how far you\'ve come'
      }
    },
    {
      id: 'therapeutic_predictions',
      type: 'prediction',
      title: 'Your Transformation Potential',
      description: 'Based on your writing style and insights, here\'s what we predict for your growth',
      content: <TherapeuticPredictions predictions={healingJourney?.therapeutic_predictions} />,
      therapeutic_value: 8,
      emotional_impact: 'profound',
      timing: 'milestone',
      premium_enhancement: {
        feature: 'Personalized Growth Planning',
        description: 'AI-powered 30/60/90 day transformation roadmaps with daily guidance',
        upgrade_path: 'upgrade_now',
        value_proposition: 'Accelerate your healing with expert-level planning'
      }
    },
    {
      id: 'wellness_insights',
      type: 'insight',
      title: 'Your Wellness Intelligence Report',
      description: 'Deep insights into your emotional patterns and growth opportunities',
      content: <WellnessIntelligenceReport insights={wellnessInsights} />,
      therapeutic_value: 9,
      emotional_impact: 'moderate',
      timing: 'progressive'
    },
    {
      id: 'personalized_resources',
      type: 'resource',
      title: 'Your Curated Healing Resources',
      description: 'Personalized resources selected specifically for your healing phase and goals',
      content: <PersonalizedResources profile={userProfile} />,
      therapeutic_value: 7,
      emotional_impact: 'gentle',
      timing: 'immediate'
    }
  ];
  
  useEffect(() => {
    // Generate healing journey visualization
    generateHealingJourneyVisualization();
    
    // Generate wellness insights
    generateWellnessInsights();
    
    // Start value delivery sequence
    setTimeout(() => {
      startValueDeliverySequence();
    }, 1000);
  }, []);
  
  const generateHealingJourneyVisualization = async () => {
    try {
      // Simulate journey generation based on user data
      const journey: HealingJourneyVisualization = {
        current_phase: userProfile.healingPhase,
        progress_percentage: calculateProgressPercentage(),
        milestones_achieved: getMilestonesAchieved(),
        next_milestone: {
          name: getNextMilestone(),
          description: getMilestoneDescription(),
          estimated_timeline: getEstimatedTimeline()
        },
        growth_trajectory: generateGrowthTrajectory(),
        therapeutic_predictions: {
          thirty_days: "Increased emotional awareness and improved daily reflection practice",
          sixty_days: "Deeper pattern recognition and enhanced emotional regulation skills",
          ninety_days: "Significant breakthrough moments and integration of healing insights"
        }
      };
      
      setHealingJourney(journey);
      
      // Track value generation
      await sessionMagic.trackConversionMoment(
        'healing_journey_visualized',
        {
          phase: journey.current_phase,
          progress: journey.progress_percentage,
          milestones: journey.milestones_achieved.length
        },
        'Generated personalized healing journey visualization',
        9
      );
      
    } catch (error) {
      console.error('Error generating healing journey:', error);
    }
  };
  
  const generateWellnessInsights = async () => {
    try {
      const insights: WellnessInsights = {
        patterns_detected: [
          {
            pattern: "Reflective self-awareness",
            frequency: "High",
            impact: "positive",
            recommendation: "Continue this beautiful practice of honest self-reflection"
          },
          {
            pattern: "Emotional curiosity",
            frequency: "Moderate",
            impact: "positive",
            recommendation: "Explore emotions with even more curiosity and compassion"
          }
        ],
        emotional_intelligence_score: calculateEmotionalIntelligenceScore(),
        resilience_indicators: [
          "Self-awareness in challenging moments",
          "Willingness to explore difficult emotions",
          "Seeking understanding rather than avoidance"
        ],
        growth_opportunities: [
          "Developing emotional regulation techniques",
          "Building self-compassion practices",
          "Exploring interpersonal healing"
        ],
        personalized_affirmations: generatePersonalizedAffirmations()
      };
      
      setWellnessInsights(insights);
      
    } catch (error) {
      console.error('Error generating wellness insights:', error);
    }
  };
  
  const startValueDeliverySequence = async () => {
    setShowValueMoments(true);
    
    // Track value delivery start
    await sessionMagic.trackConversionMoment(
      'value_delivery_sequence_started',
      {
        totalValueMoments: valueMoments.length,
        therapeuticValue: valueMoments.reduce((sum, vm) => sum + vm.therapeutic_value, 0),
        conversionInterest: entryData.conversionInterest
      },
      'Started comprehensive value delivery sequence',
      8
    );
  };
  
  const showNextValueMoment = async () => {
    if (currentValueMoment < valueMoments.length - 1) {
      const nextIndex = currentValueMoment + 1;
      setCurrentValueMoment(nextIndex);
      
      const nextMoment = valueMoments[nextIndex];
      setDeliveredValue(prev => prev + nextMoment.therapeutic_value);
      
      // Track value moment delivery
      await sessionMagic.trackConversionMoment(
        'value_moment_delivered',
        {
          momentId: nextMoment.id,
          therapeuticValue: nextMoment.therapeutic_value,
          emotionalImpact: nextMoment.emotional_impact,
          hasUpgrade: !!nextMoment.premium_enhancement
        },
        `Delivered ${nextMoment.title} with therapeutic value ${nextMoment.therapeutic_value}`,
        nextMoment.therapeutic_value
      );
      
      // Show premium comparison after high-value moments
      if (nextMoment.therapeutic_value >= 9 && nextMoment.premium_enhancement) {
        setTimeout(() => setShowPremiumComparison(true), 3000);
      }
    }
  };
  
  const handleConversionAction = async (action: 'premium_trial' | 'upgrade_now' | 'continue_free') => {
    // Track conversion action
    await sessionMagic.trackConversionMoment(
      'conversion_action_taken',
      {
        action,
        deliveredValue,
        valueMomentsShown: currentValueMoment + 1,
        source: 'value_delivery_system'
      },
      `User chose ${action} after value delivery`,
      action === 'continue_free' ? 6 : 10
    );
    
    analytics.track('conversion', action, 'value_delivery_system', 1, {
      deliveredValue,
      valueMomentsShown: currentValueMoment + 1
    });
    
    onConversionAction(action);
  };
  
  // Helper functions for generating dynamic content
  const calculateProgressPercentage = (): number => {
    const baseProgress = {
      stabilization: 15,
      processing: 35,
      integration: 65,
      growth: 85
    };
    return baseProgress[userProfile.healingPhase] || 35;
  };
  
  const getMilestonesAchieved = (): string[] => {
    const milestones = {
      stabilization: ["Committed to healing", "Created safe space"],
      processing: ["Committed to healing", "Created safe space", "Began emotional exploration"],
      integration: ["Committed to healing", "Created safe space", "Began emotional exploration", "Developing insight integration"],
      growth: ["Committed to healing", "Created safe space", "Began emotional exploration", "Developing insight integration", "Supporting others"]
    };
    return milestones[userProfile.healingPhase] || milestones.processing;
  };
  
  const getNextMilestone = (): string => {
    const nextMilestones = {
      stabilization: "Emotional Foundation Building",
      processing: "Pattern Recognition Mastery",
      integration: "Wisdom Application",
      growth: "Healing Leadership"
    };
    return nextMilestones[userProfile.healingPhase] || "Emotional Foundation Building";
  };
  
  const getMilestoneDescription = (): string => {
    const descriptions = {
      stabilization: "Building consistent emotional regulation and safety practices",
      processing: "Recognizing emotional patterns and their origins with clarity",
      integration: "Applying insights consistently in daily life situations",
      growth: "Supporting others while maintaining your own healing journey"
    };
    return descriptions[userProfile.healingPhase] || descriptions.processing;
  };
  
  const getEstimatedTimeline = (): string => {
    return userProfile.traumaInformed.prefersSlowPacing ? "4-6 weeks with gentle pacing" : "2-4 weeks with consistent practice";
  };
  
  const generateGrowthTrajectory = () => {
    // Generate sample data points
    return Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: Math.min(100, 20 + i * 6 + Math.random() * 10),
      mood: 5 + Math.random() * 3,
      insight_quality: 6 + Math.random() * 3
    }));
  };
  
  const calculateEmotionalIntelligenceScore = (): number => {
    let score = 65; // Base score
    
    // Adjust based on insights quality
    score += entryData.insights.length * 5;
    
    // Adjust based on healing phase
    const phaseBonus = {
      stabilization: 0,
      processing: 10,
      integration: 20,
      growth: 30
    };
    score += phaseBonus[userProfile.healingPhase] || 0;
    
    return Math.min(100, score);
  };
  
  const generatePersonalizedAffirmations = (): string[] => {
    const baseAffirmations = [
      "I honor my courage to explore my inner world",
      "My healing journey is unique and valuable",
      "I trust my ability to grow and transform"
    ];
    
    const phaseSpecific = {
      stabilization: ["I am creating safety for myself", "I deserve peace and stability"],
      processing: ["I can explore my emotions with curiosity", "Understanding brings healing"],
      integration: ["I apply my insights with wisdom", "I integrate my learning naturally"],
      growth: ["I inspire healing in others", "My growth creates ripples of hope"]
    };
    
    return [...baseAffirmations, ...(phaseSpecific[userProfile.healingPhase] || [])];
  };
  
  if (!showValueMoments) {
    return (
      <div className="min-h-screen bg-sanctuary-white flex items-center justify-center">
        <Card variant="sanctuary" className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-8 h-8 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-sanctuary-gray-900 mb-4">
              Generating Your Personalized Insights
            </h2>
            <p className="text-sanctuary-gray-600">
              Khepera is analyzing your writing to create beautiful, meaningful insights just for you...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const currentMoment = valueMoments[currentValueMoment];
  const isLastMoment = currentValueMoment === valueMoments.length - 1;
  
  return (
    <div className="min-h-screen bg-sanctuary-white">
      {/* Progress Header */}
      <div className="bg-white border-b border-sage-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-light text-sanctuary-gray-900">
              Your Personalized Healing Insights
            </h1>
            <div className="text-sm text-sanctuary-gray-600">
              Insight {currentValueMoment + 1} of {valueMoments.length}
            </div>
          </div>
          <div className="w-full bg-sage-100 rounded-full h-2">
            <div 
              className="bg-sage-400 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentValueMoment + 1) / valueMoments.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-sanctuary-gray-600">
            Therapeutic Value Delivered: {deliveredValue}/50 points
          </div>
        </div>
      </div>
      
      {/* Current Value Moment */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card variant="sanctuary" className="shadow-sacred mb-8">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {currentMoment.type === 'insight' && (
                <svg className="w-8 h-8 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
              {currentMoment.type === 'visualization' && (
                <svg className="w-8 h-8 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
              {currentMoment.type === 'prediction' && (
                <svg className="w-8 h-8 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </div>
            <CardTitle level="h1" className="text-3xl font-light text-sanctuary-gray-900 mb-4">
              {currentMoment.title}
            </CardTitle>
            <CardDescription className="text-lg text-sanctuary-gray-600 leading-relaxed max-w-2xl mx-auto">
              {currentMoment.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-8">
              {currentMoment.content}
            </div>
            
            {/* Premium Enhancement Teaser */}
            {currentMoment.premium_enhancement && showPremiumComparison && (
              <div className="bg-gradient-to-br from-sage-400 to-sage-500 rounded-2xl p-6 text-white mb-8">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-xl font-medium mb-3">
                      Unlock {currentMoment.premium_enhancement.feature}
                    </h3>
                    <p className="text-sage-100 mb-4 leading-relaxed">
                      {currentMoment.premium_enhancement.description}
                    </p>
                    <p className="text-sm text-sage-200">
                      {currentMoment.premium_enhancement.value_proposition}
                    </p>
                  </div>
                  <div className="text-center">
                    <Button 
                      size="lg"
                      className="bg-white text-sage-600 hover:bg-sage-50 mb-3 w-full"
                      onClick={() => handleConversionAction('premium_trial')}
                    >
                      Start 7-Day Trial
                    </Button>
                    <p className="text-xs text-sage-200">
                      Full access • Cancel anytime • No commitment
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-sanctuary-gray-600">
                Therapeutic Value: {currentMoment.therapeutic_value}/10
              </div>
              
              <div className="space-x-4">
                {!isLastMoment ? (
                  <Button 
                    onClick={showNextValueMoment}
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                  >
                    Next Insight
                  </Button>
                ) : (
                  <div className="space-x-4">
                    <Button 
                      variant="ghost"
                      onClick={() => handleConversionAction('continue_free')}
                    >
                      Continue Free
                    </Button>
                    <Button 
                      onClick={() => handleConversionAction('premium_trial')}
                      className="bg-sage-400 hover:bg-sage-500 text-white"
                    >
                      Unlock Premium Features
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Value Summary */}
        <div className="text-center">
          <p className="text-sanctuary-gray-600 mb-4">
            You've experienced {deliveredValue} points of therapeutic value in just your first session.
          </p>
          <p className="text-sm text-sanctuary-gray-500">
            Imagine the insights and growth possible with daily practice and premium features.
          </p>
        </div>
      </div>
    </div>
  );
}

// Component implementations for different value moment types
function EmotionalIntelligenceDisplay({ insights }: { insights: any[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        {insights.slice(0, 2).map((insight, index) => (
          <div key={index} className="bg-sage-50 rounded-xl p-4">
            <h4 className="font-medium text-sanctuary-gray-900 mb-2">
              {insight.content}
            </h4>
            <p className="text-sm text-sanctuary-gray-600">
              {insight.supportiveResponse}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl p-6 text-center">
        <div className="text-4xl font-light text-sage-700 mb-2">85%</div>
        <div className="text-sm text-sage-600">Emotional Awareness Score</div>
        <p className="text-xs text-sanctuary-gray-600 mt-3">
          Based on your writing depth and self-reflection quality
        </p>
      </div>
    </div>
  );
}

function HealingJourneyMap({ journey }: { journey: HealingJourneyVisualization | null }) {
  if (!journey) return <div>Loading journey visualization...</div>;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-3xl font-light text-sanctuary-gray-900 mb-2">
          {journey.progress_percentage}%
        </div>
        <div className="text-sanctuary-gray-600 mb-4">
          Progress through {journey.current_phase} phase
        </div>
        <div className="w-full bg-sanctuary-gray-100 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-sage-400 to-sage-500 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${journey.progress_percentage}%` }}
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-sanctuary-gray-900 mb-3">Milestones Achieved</h4>
          <div className="space-y-2">
            {journey.milestones_achieved.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-sage-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sanctuary-gray-700">{milestone}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sanctuary-gray-900 mb-3">Next Milestone</h4>
          <div className="bg-sage-50 rounded-xl p-4">
            <h5 className="font-medium text-sage-700 mb-2">
              {journey.next_milestone.name}
            </h5>
            <p className="text-sm text-sanctuary-gray-600 mb-3">
              {journey.next_milestone.description}
            </p>
            <p className="text-xs text-sage-600">
              Estimated timeline: {journey.next_milestone.estimated_timeline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TherapeuticPredictions({ predictions }: { predictions?: any }) {
  if (!predictions) return <div>Loading predictions...</div>;
  
  return (
    <div className="space-y-6">
      {[
        { period: '30 Days', prediction: predictions.thirty_days, color: 'from-sage-100 to-sage-200' },
        { period: '60 Days', prediction: predictions.sixty_days, color: 'from-sage-200 to-sage-300' },
        { period: '90 Days', prediction: predictions.ninety_days, color: 'from-sage-300 to-sage-400' }
      ].map((item, index) => (
        <div key={index} className={`bg-gradient-to-r ${item.color} rounded-xl p-6`}>
          <h4 className="font-medium text-sanctuary-gray-900 mb-3">
            {item.period} Transformation Potential
          </h4>
          <p className="text-sanctuary-gray-700 leading-relaxed">
            {item.prediction}
          </p>
        </div>
      ))}
    </div>
  );
}

function WellnessIntelligenceReport({ insights }: { insights: WellnessInsights | null }) {
  if (!insights) return <div>Loading wellness insights...</div>;
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl font-light text-sanctuary-gray-900 mb-2">
          {insights.emotional_intelligence_score}
        </div>
        <div className="text-sanctuary-gray-600">Emotional Intelligence Score</div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-sanctuary-gray-900 mb-3">Patterns Detected</h4>
          <div className="space-y-3">
            {insights.patterns_detected.map((pattern, index) => (
              <div key={index} className="bg-sage-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sanctuary-gray-800">{pattern.pattern}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pattern.impact === 'positive' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {pattern.frequency}
                  </span>
                </div>
                <p className="text-sm text-sanctuary-gray-600">{pattern.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sanctuary-gray-900 mb-3">Resilience Indicators</h4>
          <div className="space-y-2">
            {insights.resilience_indicators.map((indicator, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sanctuary-gray-700 text-sm">{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalizedResources({ profile }: { profile: PersonalizationProfile }) {
  const resources = {
    stabilization: [
      { title: "Grounding Techniques", description: "5-minute practices for emotional safety" },
      { title: "Breathing Sanctuary", description: "Guided breathing for nervous system regulation" },
      { title: "Crisis Support Resources", description: "24/7 support when you need it most" }
    ],
    processing: [
      { title: "Emotion Mapping Guide", description: "Learn to identify and understand your emotions" },
      { title: "Trauma-Informed Journaling", description: "Safe approaches to processing difficult experiences" },
      { title: "Inner Child Healing", description: "Gentle practices for healing past wounds" }
    ],
    integration: [
      { title: "Daily Wisdom Practice", description: "Integrate insights into daily life" },
      { title: "Relationship Healing", description: "Apply your growth to connections with others" },
      { title: "Meaning-Making Tools", description: "Find purpose and direction in your journey" }
    ],
    growth: [
      { title: "Mentor Training", description: "Learn to support others on their healing journey" },
      { title: "Advanced Emotional Intelligence", description: "Deepen your emotional mastery" },
      { title: "Leadership in Healing", description: "Create positive change in your community" }
    ]
  };
  
  const currentResources = resources[profile.healingPhase] || resources.processing;
  
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {currentResources.map((resource, index) => (
        <div key={index} className="bg-sage-50 rounded-xl p-4 text-center">
          <h5 className="font-medium text-sanctuary-gray-900 mb-2">
            {resource.title}
          </h5>
          <p className="text-sm text-sanctuary-gray-600 mb-3">
            {resource.description}
          </p>
          <Button variant="ghost" size="sm" className="text-sage-600 hover:bg-sage-100">
            Explore
          </Button>
        </div>
      ))}
    </div>
  );
}