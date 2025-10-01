/**
 * ALCHM First Session Magic Flow - Jony Ive Premium Therapeutic Experience
 * 
 * "Simplicity is the ultimate sophistication" - Applied to healing
 * A sanctuary-like onboarding that builds trust through design excellence
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { firstSessionMagicEngine, PersonalityProfile, FirstSessionExperience, LiveInsight } from '@/lib/conversion-optimization/first-session-magic';
import { useAuth } from '@/contexts/AuthContext';
// EMERGENCY: Disabled for performance - import { analytics } from '@/lib/analytics';

interface FirstSessionMagicFlowProps {
  onConversionReady?: (conversionData: any) => void;
  onSessionComplete?: (sessionData: FirstSessionExperience) => void;
}

export function FirstSessionMagicFlow({ onConversionReady, onSessionComplete }: FirstSessionMagicFlowProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'assessment' | 'writing' | 'insights' | 'conversion'>('assessment');
  const [assessmentProgress, setAssessmentProgress] = useState(0);
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [session, setSession] = useState<FirstSessionExperience | null>(null);
  const [writingContent, setWritingContent] = useState('');
  const [liveInsights, setLiveInsights] = useState<LiveInsight[]>([]);
  const [showConversionOpportunity, setShowConversionOpportunity] = useState(false);
  const [conversionReadiness, setConversionReadiness] = useState(0);

  // Assessment state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [assessmentResponses, setAssessmentResponses] = useState<any[]>([]);

  const assessmentQuestions = [
    {
      id: 'primary_goal',
      text: 'What brings you to ALCHM today?',
      options: [
        'Process difficult emotions',
        'Build self-awareness', 
        'Develop coping strategies',
        'Track personal growth',
        'Support therapy work'
      ]
    },
    {
      id: 'writing_experience',
      text: 'How comfortable are you with reflective writing?',
      type: 'scale',
      options: ['Very new to this', 'Somewhat experienced', 'Very comfortable']
    },
    {
      id: 'support_preference',
      text: 'What kind of guidance feels most helpful?',
      options: [
        'Gentle suggestions and prompts',
        'Detailed insights and analysis',
        'Creative exercises and exploration',
        'Structured frameworks and tools'
      ]
    },
    {
      id: 'trauma_sensitivity',
      text: 'How would you like us to approach sensitive topics?',
      options: [
        'Very gently with lots of support',
        'Thoughtfully but directly',
        'I can handle direct approaches'
      ]
    }
  ];

  const handleAssessmentResponse = async (response: string) => {
    const startTime = Date.now();
    const newResponses = [...assessmentResponses, response];
    setAssessmentResponses(newResponses);

    // Process response with the engine
    if (user) {
      await firstSessionMagicEngine.processAssessmentResponse(
        'current_assessment',
        assessmentQuestions[currentQuestion].id,
        response,
        Date.now() - startTime
      );
    }

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAssessmentProgress((currentQuestion + 1) / assessmentQuestions.length * 100);
    } else {
      // Complete assessment
      await completeAssessment(newResponses);
    }
  };

  const completeAssessment = async (responses: any[]) => {
    if (!user) return;

    try {
      const profile = await firstSessionMagicEngine.completeAssessment('current_assessment', responses as any);
      setPersonalityProfile(profile);
      
      // Start first session
      const newSession = await firstSessionMagicEngine.startFirstSession(user.uid, profile);
      setSession(newSession);
      setCurrentStep('writing');

      // EMERGENCY: Disabled for performance - analytics.track('assessment_completed_conversion_flow', {
        userId: user.uid,
        personalityType: profile.communicationStyle,
        pathwayRecommended: profile.pathwayRecommendation
      });
    } catch (error) {
      console.error('Failed to complete assessment:', error);
    }
  };

  const handleWritingChange = useCallback(async (content: string) => {
    setWritingContent(content);

    if (!session || !user) return;

    const wordCount = content.split(' ').filter(word => word.length > 0).length;
    
    // Process live writing every 25 words
    if (wordCount > 0 && wordCount % 25 === 0) {
      try {
        const result = await firstSessionMagicEngine.processLiveWriting(
          session.sessionId,
          content,
          wordCount,
          Date.now() - session.startTime.getTime()
        );

        setLiveInsights(prev => [...prev, ...result.insights]);
        setConversionReadiness(await getConversionReadiness(session.sessionId));

        // Check for conversion opportunities
        if (result.insights.length > 0 && conversionReadiness >= 75) {
          setShowConversionOpportunity(true);
          onConversionReady?.({
            sessionId: session.sessionId,
            readiness: conversionReadiness,
            insights: result.insights,
            valueMetrics: result.valueMetrics
          });
        }
      } catch (error) {
        console.error('Failed to process live writing:', error);
      }
    }
  }, [session, user, conversionReadiness, onConversionReady]);

  const getConversionReadiness = async (sessionId: string): Promise<number> => {
    // This would call the engine to get current conversion readiness
    return 85; // Placeholder
  };

  const handleUpgradeInterest = () => {
    setCurrentStep('conversion');
    analytics.track('conversion_interest_shown', {
      sessionId: session?.sessionId,
      conversionReadiness,
      writingWordCount: writingContent.split(' ').length
    });
  };

  if (currentStep === 'assessment') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Sacred Progress - Minimal and Meaningful */}
          <div className="flex justify-center">
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#a4b792] to-[#93a682] rounded-full transition-all duration-700 ease-out animate-gentle-sparkle"
                style={{ width: `${assessmentProgress}%` }}
              />
            </div>
          </div>

          {/* Sanctuary Question Card - Floating with Premium Feel */}
          <Card variant="sanctuary" className="backdrop-blur-2xl border-white/30 shadow-2xl bg-white/10">
            <CardHeader className="text-center pb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-6">
                <span className="text-white text-lg font-light">{currentQuestion + 1}</span>
              </div>
              
              <h1 className="text-3xl font-light tracking-tight text-white mb-3 leading-[1.6]">
                {currentQuestion === 0 && "Welcome to your sanctuary"}
                {currentQuestion === 1 && "Understanding your journey"}
                {currentQuestion === 2 && "Crafting your experience"}
                {currentQuestion === 3 && "Creating safety together"}
              </h1>
              
              <p className="text-white/70 text-lg leading-[1.7] max-w-lg mx-auto">
                {assessmentQuestions[currentQuestion].text}
              </p>
            </CardHeader>

            <CardContent className="pt-8 pb-12">
              <div className="space-y-4 max-w-md mx-auto">
                {assessmentQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="touch"
                    className="w-full justify-start text-left h-auto py-6 px-8 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-2xl transition-all duration-300 ease-out group min-h-[48px]"
                    onClick={() => handleAssessmentResponse(option)}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white/70 transition-colors duration-300" />
                      <span className="text-white/90 group-hover:text-white text-base leading-[1.7] flex-1">
                        {option}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gentle Progress Indicator */}
          <div className="text-center">
            <p className="text-white/50 text-sm font-light">
              {assessmentQuestions.length - currentQuestion - 1} more moments to personalize your experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'writing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fefcfb] via-[#f6f8f4]/30 to-[#fefcfb]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Minimal Header - Breathes */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl font-light tracking-tight text-[#262626] mb-4 leading-[1.6]">
              Your sanctuary awaits
            </h1>
            <p className="text-xl text-[#525252] leading-[1.7] max-w-2xl mx-auto">
              {personalityProfile?.communicationStyle === 'gentle' 
                ? "Write at your own pace. Every word matters here." 
                : "Express yourself freely. Insights will emerge naturally."}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Premium Writing Sanctuary - Takes Center Stage */}
            <div className="xl:col-span-3 order-1 xl:order-1">
              <Card variant="elevated" className="h-full">
                <CardHeader className="pb-6">
                  <h2 className="text-2xl font-light text-[#262626] leading-[1.7]">
                    {personalityProfile?.communicationStyle === 'gentle' 
                      ? "What brought you a moment of peace today?" 
                      : "What's moving through your mind right now?"}
                  </h2>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="relative">
                    <textarea
                      value={writingContent}
                      onChange={(e) => handleWritingChange(e.target.value)}
                      placeholder="Begin writing here..."
                      aria-label="Your personal writing space for reflection and insights"
                      className="w-full h-96 p-8 border-0 bg-transparent text-[#262626] placeholder:text-[#a3a3a3] resize-none focus:outline-none focus:ring-0 text-lg leading-[1.7] selection:bg-[#d1dac4]/30"
                      style={{ 
                        fontSize: personalityProfile?.personalizationSettings.fontScale 
                          ? `${personalityProfile.personalizationSettings.fontScale * 1.125}rem` 
                          : '1.125rem',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        lineHeight: '1.7'
                      }}
                    />
                    
                    {/* Gentle Status Bar */}
                    <div className="absolute bottom-4 left-8 right-8 flex justify-between items-center">
                      <div className="flex items-center space-x-6 text-[#737373]">
                        <span className="text-sm font-light">
                          {writingContent.split(' ').filter(w => w.length > 0).length} words
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#a4b792] rounded-full animate-pulse" />
                          <span className="text-sm font-light">AI insights active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights Sidebar - Elegant and Unobtrusive */}
            <div className="space-y-6 order-2 xl:order-2">
              {/* Live Insights - Floating and Magical */}
              <Card variant="sanctuary" className="overflow-hidden">
                <CardHeader className="pb-4">
                  <h3 className="text-lg font-medium text-[#262626]">Live insights</h3>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {liveInsights.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-[#e8ede1] rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                        <div className="w-6 h-6 border-2 border-[#a4b792] border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-[#737373] font-light leading-[1.7] animate-gentle-pulse">
                        Keep writing to unlock personalized insights...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {liveInsights.map((insight, index) => (
                        <div
                          key={insight.id}
                          className="group p-4 bg-[#f6f8f4]/50 rounded-xl border border-[#e8ede1] transition-all duration-300 hover:bg-[#f6f8f4] hover:border-[#d1dac4]"
                        >
                          <p className="text-[#404040] leading-[1.7] mb-3">
                            {insight.message}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#737373] font-light capitalize">
                              {insight.type.replace('_', ' ')}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                className="w-6 h-6 rounded-full bg-[#e8ede1] hover:bg-[#d1dac4] flex items-center justify-center transition-colors duration-200 min-h-[44px] min-w-[44px]"
                                onClick={() => {
                                  analytics.track('insight_positive_reaction', {
                                    insightId: insight.id,
                                    sessionId: session?.sessionId
                                  });
                                }}
                              >
                                <span className="text-xs">✓</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Growth Metrics - Minimal and Meaningful */}
              <Card variant="gentle" className="text-center">
                <CardContent className="py-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#525252]">Patterns discovered</span>
                      <span className="text-lg font-medium text-[#7a8c6a]">
                        {liveInsights.filter(i => i.type === 'emotional_pattern').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#525252]">Strengths recognized</span>
                      <span className="text-lg font-medium text-[#7a8c6a]">
                        {liveInsights.filter(i => i.type === 'strength_recognition').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#525252]">Growth moments</span>
                      <span className="text-lg font-medium text-[#7a8c6a]">
                        {liveInsights.filter(i => i.type === 'growth_opportunity').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Conversion - Elegant Revelation */}
              {showConversionOpportunity && (
                <Card 
                  variant="featured" 
                  className="relative overflow-hidden transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-up"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a4b792] via-[#93a682] to-[#7a8c6a]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5" />
                  <div className="relative">
                    <CardContent className="py-8 text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-sparkle">
                        <span className="text-white text-xl">✨</span>
                      </div>
                      <h3 className="text-xl font-medium text-white mb-3 leading-tight">
                        Beautiful progress
                      </h3>
                      <p className="text-white/90 leading-relaxed mb-6 text-sm">
                        Your insights show tremendous potential for growth. Unlock your complete journey.
                      </p>
                      <Button
                        onClick={handleUpgradeInterest}
                        variant="ghost"
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-soft"
                      >
                        Explore your transformation
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'conversion') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <ConversionOpportunityDisplay
          session={session}
          personalityProfile={personalityProfile}
          writingContent={writingContent}
          insights={liveInsights}
          onComplete={onSessionComplete}
        />
      </div>
    );
  }

  return null;
}

interface ConversionOpportunityDisplayProps {
  session: FirstSessionExperience | null;
  personalityProfile: PersonalityProfile | null;
  writingContent: string;
  insights: LiveInsight[];
  onComplete?: (sessionData: FirstSessionExperience) => void;
}

function ConversionOpportunityDisplay({
  session,
  personalityProfile,
  writingContent,
  insights,
  onComplete
}: ConversionOpportunityDisplayProps) {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a4b792] via-[#93a682] to-[#7a8c6a] relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section - Transformation Preview */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8">
            <span className="text-white text-3xl">✨</span>
          </div>
          
          <h1 className="text-5xl font-light tracking-tight text-white mb-6 leading-tight">
            Your transformation awaits
          </h1>
          
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-12">
            Based on your insights and writing style, you're positioned for remarkable growth. 
            Here's what your journey could look like.
          </p>
        </div>

        {/* Transformation Timeline - Elegant Progressive Disclosure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card variant="sanctuary" className="backdrop-blur-2xl border-white/20 transform hover:scale-105 transition-all duration-300">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-[#e8ede1] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#7a8c6a] text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-medium text-[#262626] mb-4">Weeks 1-2</h3>
              <p className="text-[#525252] leading-[1.7]">
                Emotional pattern recognition, daily insights, and gentle stress processing 
                tailored to your communication style.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="sanctuary" className="backdrop-blur-2xl border-white/20 transform hover:scale-105 transition-all duration-300">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-[#d1dac4] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#647354] text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-medium text-[#262626] mb-4">Weeks 3-4</h3>
              <p className="text-[#525252] leading-[1.7]">
                Breakthrough moments emerge, personal strengths develop, and 
                adaptive coping strategies become second nature.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="sanctuary" className="backdrop-blur-2xl border-white/20 transform hover:scale-105 transition-all duration-300">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-[#b5c6a0] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#505c42] text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-medium text-[#262626] mb-4">Beyond</h3>
              <p className="text-[#525252] leading-[1.7]">
                Sustained personal growth, emotional mastery, and deep resilience 
                that transforms how you navigate life's challenges.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition - Premium Therapeutic Positioning */}
        {!showPricing ? (
          <div className="text-center">
            <Card variant="sanctuary" className="backdrop-blur-2xl border-white/20 max-w-2xl mx-auto">
              <CardContent className="py-12">
                <h2 className="text-3xl font-light text-[#262626] mb-6 leading-[1.6]">
                  Your personalized sanctuary
                </h2>
                <p className="text-lg text-[#525252] leading-[1.7] mb-8">
                  You've already experienced the power of AI-guided reflection. 
                  Now imagine that depth of insight available to you every day, 
                  growing more personalized with each entry.
                </p>
                <Button
                  onClick={() => setShowPricing(true)}
                  size="lg"
                  className="bg-[#a4b792] hover:bg-[#93a682] text-white px-12 py-4 text-lg font-medium rounded-2xl min-h-[48px]"
                >
                  Unlock your complete journey
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Premium Pricing - Therapy Comparison */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-white mb-4 leading-tight">
                Therapeutic excellence, accessible to all
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                Compare the depth of ALCHM to traditional therapy
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traditional Therapy Comparison */}
              <Card variant="sanctuary" className="backdrop-blur-2xl border-white/20 transform hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <h3 className="text-2xl font-light text-[#262626]">Traditional Therapy</h3>
                  <div className="text-4xl font-light text-[#525252] mt-4">$150+</div>
                  <p className="text-[#737373]">per session</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <span className="text-sanctuary-gray-400">•</span>
                      <span className="text-[#525252]">Weekly 50-minute sessions</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-sanctuary-gray-400">•</span>
                      <span className="text-[#525252]">Limited availability</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-sanctuary-gray-400">•</span>
                      <span className="text-[#525252]">Appointment scheduling required</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-sanctuary-gray-400">•</span>
                      <span className="text-[#525252]">Insurance complexity</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* ALCHM Premium */}
              <Card variant="featured" className="relative overflow-hidden border-2 border-white/40 transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                    RECOMMENDED
                  </span>
                </div>
                
                <CardHeader className="text-center pb-6">
                  <h3 className="text-2xl font-light text-white">ALCHM Premium</h3>
                  <div className="flex items-baseline justify-center space-x-2 mt-4">
                    <div className="text-4xl font-light text-white">$29</div>
                    <div className="text-white/60">/month</div>
                  </div>
                  <div className="text-white/60 line-through text-sm">$59/month</div>
                  <p className="text-white/80 text-sm font-medium">Beta founder pricing</p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3">
                      <span className="text-white">✓</span>
                      <span className="text-white/90">24/7 AI therapeutic insights</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-white">✓</span>
                      <span className="text-white/90">Personalized healing pathways</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-white">✓</span>
                      <span className="text-white/90">Crisis intervention support</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-white">✓</span>
                      <span className="text-white/90">Therapist collaboration tools</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-white">✓</span>
                      <span className="text-white/90">Unlimited emotional processing</span>
                    </li>
                  </ul>

                  <Button
                    onClick={() => {
                      analytics.track('conversion_upgrade_clicked', {
                        sessionId: session?.sessionId,
                        insightCount: insights.length,
                        writingWordCount: writingContent.split(' ').length
                      });
                      // Handle upgrade
                    }}
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 py-4 text-lg font-medium rounded-xl"
                  >
                    Begin your transformation
                  </Button>
                  
                  <p className="text-white/60 text-center mt-4 text-sm leading-[1.7]">
                    14-day sanctuary trial • Pause anytime with grace
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Trust Indicators */}
            <div className="text-center mt-12">
              <p className="text-white/60 text-sm leading-[1.7]">
                Your data is encrypted and private • Cancel gracefully anytime • 
                Built with trauma-informed design principles
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}