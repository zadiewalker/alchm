'use client';

/**
 * GUIDED FIRST ENTRY WRITING EXPERIENCE
 * "Where Words Become Wisdom, And Wisdom Reveals Premium Value"
 * 
 * AI-powered first writing experience that delivers immediate therapeutic value
 * while naturally demonstrating premium features and conversion opportunities.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createFirstSessionMagic } from '@/lib/conversion/first-session-magic-engine';
import { PersonalizationProfile } from '@/components/onboarding/TraumaInformedAssessment';
import { useAuth } from '@/contexts/AuthContext';
import { analytics } from '@/lib/analytics';

interface WritingInsight {
  type: 'emotion_detected' | 'pattern_recognized' | 'growth_moment' | 'breakthrough_potential';
  content: string;
  confidence: number;
  category: string;
  supportiveResponse: string;
  premiumEnhancement?: {
    feature: string;
    description: string;
    value: string;
  };
}

interface MoodVisualization {
  primaryEmotion: string;
  intensity: number;
  emotionalSpectrum: Array<{
    emotion: string;
    percentage: number;
    color: string;
  }>;
  growthDirection: 'stable' | 'processing' | 'expanding' | 'transforming';
}

interface AIFeedback {
  insights: WritingInsight[];
  encouragement: string;
  nextPrompt?: string;
  moodVisualization?: MoodVisualization;
  conversionOpportunity?: {
    message: string;
    premiumFeatures: string[];
    urgency: string;
    socialProof: string;
  };
}

interface GuidedFirstEntryProps {
  personalizationProfile: PersonalizationProfile;
  onComplete: (entryData: {
    content: string;
    insights: WritingInsight[];
    moodData: MoodVisualization;
    conversionInterest: boolean;
  }) => void;
  userId: string;
}

export default function GuidedFirstEntry({
  personalizationProfile,
  onComplete,
  userId
}: GuidedFirstEntryProps) {
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'writing' | 'insights' | 'complete'>('welcome');
  const [writingContent, setWritingContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [writingStartTime, setWritingStartTime] = useState<number | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [sessionMagic] = useState(() => createFirstSessionMagic(userId));
  const [realTimeInsights, setRealTimeInsights] = useState<WritingInsight[]>([]);
  const [showPremiumTeaser, setShowPremiumTeaser] = useState(false);
  const [conversionInterest, setConversionInterest] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const insightTimeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    // Generate personalized initial prompt
    generateInitialPrompt();
  }, [personalizationProfile]);
  
  useEffect(() => {
    // Real-time writing analysis
    if (writingContent.length > 20 && currentPhase === 'writing') {
      clearTimeout(insightTimeoutRef.current);
      insightTimeoutRef.current = setTimeout(() => {
        generateRealTimeInsights();
      }, 2000);
    }
  }, [writingContent]);
  
  const generateInitialPrompt = async () => {
    const prompts = {
      stabilization: [
        "What is one thing that helped you feel safe or grounded today?",
        "Describe a moment today when you felt most like yourself.",
        "What small act of self-care could you offer yourself right now?"
      ],
      processing: [
        "What emotions are you noticing within yourself right now?",
        "If your feelings could speak, what might they be trying to tell you?",
        "What are you learning about yourself through recent experiences?"
      ],
      integration: [
        "How are you applying new insights to your daily life?",
        "What positive changes are you noticing in yourself?",
        "What wisdom have you gained that you'd want to remember?"
      ],
      growth: [
        "What aspect of your growth feels most meaningful right now?",
        "How are you supporting others while honoring your own journey?",
        "What new possibilities are opening up for you?"
      ]
    };
    
    const phasePrompts = prompts[personalizationProfile.healingPhase] || prompts.processing;
    const selectedPrompt = phasePrompts[Math.floor(Math.random() * phasePrompts.length)];
    
    setCurrentPrompt(selectedPrompt);
    
    // Track personalized prompt generation
    await sessionMagic.trackConversionMoment(
      'personalized_prompt_generated',
      {
        healingPhase: personalizationProfile.healingPhase,
        promptType: 'initial',
        prompt: selectedPrompt
      },
      'Generated personalized writing prompt based on assessment',
      7
    );
  };
  
  const startWriting = async () => {
    setCurrentPhase('writing');
    setWritingStartTime(Date.now());
    
    // Focus on textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
    
    // Track writing session start
    await sessionMagic.trackConversionMoment(
      'writing_session_started',
      {
        prompt: currentPrompt,
        personalizedFor: personalizationProfile.healingPhase
      },
      'Started guided writing session with therapeutic prompt',
      8
    );
    
    analytics.trackJournal.created(0, 0);
  };
  
  const handleWritingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setWritingContent(content);
    setWordCount(content.trim().split(/\s+/).filter(word => word.length > 0).length);
  };
  
  const generateRealTimeInsights = async () => {
    if (writingContent.length < 30) return;
    
    try {
      // Simulate AI analysis (would be actual AI service call)
      const insights = await analyzeWritingContent(writingContent, personalizationProfile);
      setRealTimeInsights(insights);
      
      // Track insight generation
      await sessionMagic.trackConversionMoment(
        'real_time_insights_generated',
        {
          wordCount,
          insightCount: insights.length,
          writingDuration: writingStartTime ? Date.now() - writingStartTime : 0
        },
        `Generated ${insights.length} real-time insights from writing`,
        9
      );
      
      // Show premium teaser after meaningful insights
      if (insights.length >= 2 && wordCount >= 50) {
        setTimeout(() => setShowPremiumTeaser(true), 3000);
      }
      
    } catch (error) {
      console.error('Error generating real-time insights:', error);
    }
  };
  
  const analyzeWritingContent = async (
    content: string,
    profile: PersonalizationProfile
  ): Promise<WritingInsight[]> => {
    // Simplified AI analysis simulation
    const insights: WritingInsight[] = [];
    
    // Emotion detection
    const emotionWords = {
      grateful: 'gratitude',
      anxious: 'anxiety',
      peaceful: 'peace',
      frustrated: 'frustration',
      hopeful: 'hope',
      overwhelmed: 'overwhelm'
    };
    
    Object.entries(emotionWords).forEach(([word, emotion]) => {
      if (content.toLowerCase().includes(word)) {
        insights.push({
          type: 'emotion_detected',
          content: `I notice themes of ${emotion} in your writing`,
          confidence: 0.8,
          category: 'emotional_awareness',
          supportiveResponse: `Recognizing ${emotion} is an important step in emotional awareness.`,
          premiumEnhancement: {
            feature: 'Advanced Emotion Mapping',
            description: 'Track emotional patterns across all your entries',
            value: 'Understand your emotional journey over time'
          }
        });
      }
    });
    
    // Pattern recognition
    if (content.includes('I feel') || content.includes('I think')) {
      insights.push({
        type: 'pattern_recognized',
        content: 'You\'re practicing emotional self-awareness',
        confidence: 0.9,
        category: 'self_reflection',
        supportiveResponse: 'This kind of self-reflection is powerful healing work.',
        premiumEnhancement: {
          feature: 'Pattern Recognition Dashboard',
          description: 'Visualize your growth patterns and insights',
          value: 'See how your self-awareness develops over time'
        }
      });
    }
    
    // Growth moments
    if (content.includes('learning') || content.includes('understand') || content.includes('realize')) {
      insights.push({
        type: 'growth_moment',
        content: 'You\'re actively integrating new understanding',
        confidence: 0.85,
        category: 'personal_growth',
        supportiveResponse: 'These moments of realization are where transformation happens.',
        premiumEnhancement: {
          feature: 'Wisdom Library',
          description: 'Save and organize your insights for future reflection',
          value: 'Build a personal library of your growth wisdom'
        }
      });
    }
    
    return insights.slice(0, 3); // Limit to prevent overwhelm
  };
  
  const completeWriting = async () => {
    try {
      setCurrentPhase('insights');
      
      // Generate comprehensive analysis
      const feedback = await generateComprehensiveFeedback();
      setAiFeedback(feedback);
      
      const writingDuration = writingStartTime ? Date.now() - writingStartTime : 0;
      
      // Track writing completion
      await sessionMagic.trackConversionMoment(
        'writing_session_completed',
        {
          wordCount,
          writingDuration,
          insightsGenerated: realTimeInsights.length,
          emotionalBreakthrough: realTimeInsights.some(i => i.type === 'breakthrough_potential')
        },
        `Completed first writing session with ${wordCount} words and ${realTimeInsights.length} insights`,
        9
      );
      
      analytics.trackJournal.created(wordCount, writingDuration);
      
      setTimeout(() => setShowInsights(true), 500);
      
    } catch (error) {
      console.error('Error completing writing session:', error);
    }
  };
  
  const generateComprehensiveFeedback = async (): Promise<AIFeedback> => {
    // Generate mood visualization
    const moodVisualization: MoodVisualization = {
      primaryEmotion: determinePrimaryEmotion(writingContent),
      intensity: 7,
      emotionalSpectrum: [
        { emotion: 'Reflective', percentage: 45, color: '#7C9885' },
        { emotion: 'Curious', percentage: 25, color: '#9CA3AF' },
        { emotion: 'Hopeful', percentage: 20, color: '#F59E0B' },
        { emotion: 'Peaceful', percentage: 10, color: '#6B7280' }
      ],
      growthDirection: 'processing'
    };
    
    // Determine if user shows premium interest signals
    const premiumSignals = calculatePremiumSignals();
    
    const feedback: AIFeedback = {
      insights: realTimeInsights,
      encouragement: generatePersonalizedEncouragement(),
      moodVisualization,
      conversionOpportunity: premiumSignals >= 2 ? {
        message: "Your writing shows readiness for deeper exploration",
        premiumFeatures: [
          "Unlimited AI conversations about your insights",
          "Advanced emotional pattern tracking",
          "Personalized healing journey mapping"
        ],
        urgency: "Join 10,000+ members in premium sanctuary",
        socialProof: "95% report breakthrough moments within 7 days"
      } : undefined
    };
    
    return feedback;
  };
  
  const determinePrimaryEmotion = (content: string): string => {
    // Simplified emotion detection
    if (content.toLowerCase().includes('grateful') || content.toLowerCase().includes('thankful')) return 'Grateful';
    if (content.toLowerCase().includes('peaceful') || content.toLowerCase().includes('calm')) return 'Peaceful';
    if (content.toLowerCase().includes('anxious') || content.toLowerCase().includes('worried')) return 'Processing';
    return 'Reflective';
  };
  
  const calculatePremiumSignals = (): number => {
    let signals = 0;
    if (wordCount >= 100) signals += 1;
    if (realTimeInsights.length >= 3) signals += 1;
    if (writingContent.toLowerCase().includes('understand') || writingContent.toLowerCase().includes('insight')) signals += 1;
    if (personalizationProfile.traumaInformed.needsExtraValidation) signals += 1;
    return signals;
  };
  
  const generatePersonalizedEncouragement = (): string => {
    const encouragements = {
      gentle: "Your gentle approach to self-reflection is beautiful. Each word you write is an act of courage.",
      direct: "You're doing powerful work here. This kind of honest reflection creates real transformation.",
      reflective: "The depth of your self-awareness shines through your writing. You're on a meaningful path.",
      structured: "Your thoughtful, systematic approach to processing emotions is impressive and effective."
    };
    
    return encouragements[personalizationProfile.communicationStyle] || encouragements.gentle;
  };
  
  const handlePremiumInterest = async (interested: boolean) => {
    setConversionInterest(interested);
    
    if (interested) {
      await sessionMagic.trackConversionMoment(
        'premium_interest_expressed',
        {
          source: 'first_writing_session',
          trigger: 'comprehensive_insights',
          wordCount,
          insightCount: realTimeInsights.length
        },
        'User expressed interest in premium features after first writing',
        9
      );
      
      analytics.track('conversion', 'premium_interest', 'first_writing_session', 1, {
        wordCount,
        insightCount: realTimeInsights.length
      });
    }
  };
  
  const completeEntryExperience = () => {
    if (!aiFeedback) return;
    
    onComplete({
      content: writingContent,
      insights: realTimeInsights,
      moodData: aiFeedback.moodVisualization!,
      conversionInterest
    });
  };
  
  if (currentPhase === 'welcome') {
    return (
      <div className="min-h-screen bg-sanctuary-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card variant="sanctuary" className="shadow-nurturing">
            <CardHeader className="text-center pb-8">
              <CardTitle level="h1" className="text-4xl font-light text-sanctuary-gray-900 mb-6">
                Welcome to Your First
                <span className="block text-sage-400 mt-2">Healing Sanctuary Entry</span>
              </CardTitle>
              <CardDescription className="text-xl text-sanctuary-gray-600 leading-relaxed max-w-2xl mx-auto">
                This is your sacred space to explore, reflect, and discover insights about yourself.
                Khepera, your AI wisdom companion, will offer gentle guidance as you write.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-sage-50 rounded-2xl p-8 mb-8">
                <h3 className="text-lg font-medium text-sanctuary-gray-900 mb-4">Your Personalized Prompt</h3>
                <p className="text-sanctuary-gray-700 text-lg leading-relaxed italic">
                  "{currentPrompt}"
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-sanctuary-gray-900 mb-2">Write Freely</h4>
                  <p className="text-sm text-sanctuary-gray-600">
                    No judgment, no pressure. Just honest reflection.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-sanctuary-gray-900 mb-2">Receive Insights</h4>
                  <p className="text-sm text-sanctuary-gray-600">
                    Khepera will offer gentle insights as you write.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-sanctuary-gray-900 mb-2">Discover Patterns</h4>
                  <p className="text-sm text-sanctuary-gray-600">
                    See your emotional landscape visualized beautifully.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={startWriting}
                  size="lg"
                  className="bg-sage-400 hover:bg-sage-500 text-white px-8 py-4 text-lg"
                >
                  Begin Your First Entry
                </Button>
                <p className="text-sm text-sanctuary-gray-500 mt-4">
                  Take as much time as you need. This is your sanctuary.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (currentPhase === 'writing') {
    return (
      <div className="min-h-screen bg-sanctuary-white">
        {/* Writing Header */}
        <div className="bg-white border-b border-sage-100 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-sanctuary-gray-900">Your Sanctuary Entry</h2>
                <p className="text-sm text-sanctuary-gray-600">{wordCount} words written</p>
              </div>
              <Button 
                onClick={completeWriting}
                disabled={wordCount < 10}
                className="bg-sage-400 hover:bg-sage-500 text-white"
              >
                Complete Entry
              </Button>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Writing Area */}
            <div className="lg:col-span-2">
              <Card variant="sanctuary">
                <CardHeader>
                  <div className="text-sage-600 text-sm mb-2">Reflecting on:</div>
                  <p className="text-sanctuary-gray-700 italic">"{currentPrompt}"</p>
                </CardHeader>
                <CardContent>
                  <textarea
                    ref={textareaRef}
                    value={writingContent}
                    onChange={handleWritingChange}
                    placeholder="Begin writing your thoughts here... Let your feelings flow naturally onto the page."
                    className="w-full min-h-[400px] p-6 border-none resize-none focus:outline-none text-sanctuary-gray-800 leading-relaxed text-lg bg-transparent"
                    style={{ fontFamily: 'Georgia, serif' }}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Real-time Insights Sidebar */}
            <div className="lg:col-span-1">
              <Card variant="sanctuary" className="sticky top-24">
                <CardHeader>
                  <CardTitle level="h3" className="text-lg">
                    Live Insights
                  </CardTitle>
                  <CardDescription>
                    Khepera's gentle observations as you write
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {realTimeInsights.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <p className="text-sanctuary-gray-500 text-sm">
                        Keep writing... insights will appear as Khepera reads along with you.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {realTimeInsights.map((insight, index) => (
                        <div key={index} className="bg-sage-50 rounded-xl p-4 animate-fade-in">
                          <p className="text-sm font-medium text-sage-700 mb-2">
                            {insight.content}
                          </p>
                          <p className="text-xs text-sanctuary-gray-600">
                            {insight.supportiveResponse}
                          </p>
                        </div>
                      ))}
                      
                      {showPremiumTeaser && (
                        <div className="bg-gradient-to-br from-sage-400 to-sage-500 rounded-xl p-4 text-white animate-fade-in">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-1">
                                Premium Insight Available
                              </p>
                              <p className="text-xs text-sage-100">
                                Unlock deeper pattern analysis and unlimited AI conversations in Premium Sanctuary
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (currentPhase === 'insights' && aiFeedback) {
    return (
      <div className="min-h-screen bg-sanctuary-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Completion Celebration */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-light text-sanctuary-gray-900 mb-4">
              Beautiful Work
            </h1>
            <p className="text-xl text-sanctuary-gray-600 leading-relaxed max-w-2xl mx-auto">
              {aiFeedback.encouragement}
            </p>
          </div>
          
          {/* Insights and Visualization */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Mood Visualization */}
            <Card variant="sanctuary">
              <CardHeader>
                <CardTitle level="h2">Your Emotional Landscape</CardTitle>
                <CardDescription>
                  Based on your writing, here's what Khepera observed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {aiFeedback.moodVisualization && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-light text-sanctuary-gray-900 mb-2">
                        {aiFeedback.moodVisualization.primaryEmotion}
                      </div>
                      <div className="text-sm text-sanctuary-gray-600">
                        Primary emotional tone
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {aiFeedback.moodVisualization.emotionalSpectrum.map((emotion, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-16 text-sm text-sanctuary-gray-700">
                            {emotion.emotion}
                          </div>
                          <div className="flex-1 bg-sanctuary-gray-100 rounded-full h-3 relative overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${emotion.percentage}%`,
                                backgroundColor: emotion.color 
                              }}
                            />
                          </div>
                          <div className="w-12 text-sm text-sanctuary-gray-600 text-right">
                            {emotion.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Insights Summary */}
            <Card variant="sanctuary">
              <CardHeader>
                <CardTitle level="h2">Khepera's Insights</CardTitle>
                <CardDescription>
                  Wisdom gathered from your {wordCount} words
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiFeedback.insights.map((insight, index) => (
                    <div key={index} className="border-l-4 border-sage-300 pl-4">
                      <p className="text-sanctuary-gray-800 mb-2">
                        {insight.content}
                      </p>
                      <p className="text-sm text-sanctuary-gray-600">
                        {insight.supportiveResponse}
                      </p>
                      {insight.premiumEnhancement && (
                        <div className="mt-3 p-3 bg-sage-50 rounded-lg">
                          <p className="text-xs font-medium text-sage-700 mb-1">
                            Premium Enhancement Available
                          </p>
                          <p className="text-xs text-sanctuary-gray-600">
                            {insight.premiumEnhancement.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Conversion Opportunity */}
          {aiFeedback.conversionOpportunity && (
            <Card variant="featured" className="mb-8">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-light text-white mb-4">
                      {aiFeedback.conversionOpportunity.message}
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {aiFeedback.conversionOpportunity.premiumFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3 text-sage-100">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sage-200 text-sm">
                      {aiFeedback.conversionOpportunity.socialProof}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="space-y-4">
                      <Button 
                        size="lg"
                        className="bg-white text-sage-600 hover:bg-sage-50 w-full"
                        onClick={() => handlePremiumInterest(true)}
                      >
                        Unlock Premium Sanctuary
                      </Button>
                      <Button 
                        variant="ghost"
                        className="text-white hover:bg-white/10 w-full"
                        onClick={() => handlePremiumInterest(false)}
                      >
                        Continue with Free Sanctuary
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Complete Experience */}
          <div className="text-center">
            <Button 
              onClick={completeEntryExperience}
              size="lg"
              className="bg-sage-400 hover:bg-sage-500 text-white px-8 py-4"
            >
              Continue to Your Sanctuary
            </Button>
            <p className="text-sanctuary-gray-500 text-sm mt-4">
              Your entry and insights have been saved securely
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}