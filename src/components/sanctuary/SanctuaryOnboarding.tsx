/**
 * Sanctuary Onboarding - Essential introduction for free tier users
 * 
 * Provides basic onboarding that introduces safety and core features without overwhelm:
 * - Privacy-first explanation
 * - Crisis resource introduction
 * - Grace policy explanation (anti-shame design)
 * - Simple navigation guidance
 * - Essential feature introductions
 * - Personalization options
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Heart, 
  Pause, 
  Clock,
  Eye,
  Compass,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Gift,
  Users,
  Feather
} from 'lucide-react';

interface SanctuaryOnboardingProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  canSkip: boolean;
  isEssential: boolean;
}

export function SanctuaryOnboarding({
  userId,
  onComplete,
  onSkip
}: SanctuaryOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState({
    reminderStyle: 'gentle' as 'none' | 'gentle' | 'regular',
    progressVisibility: 'encouraging' as 'minimal' | 'encouraging' | 'detailed',
    communityParticipation: false,
    celebrationStyle: 'warm' as 'subtle' | 'warm' | 'joyful'
  });

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Your Sanctuary',
      description: 'A safe space for your inner work',
      icon: Heart,
      canSkip: false,
      isEssential: true,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Heart className="h-12 w-12 text-sage-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              Welcome to ALCHM Sanctuary
            </h2>
            <p className="text-gray-300 mb-4">
              You've found a safe space designed for healing, growth, and authentic self-expression.
            </p>
          </div>
          
          <Card className="bg-sage-900/20 border-sage-500/30">
            <CardContent className="pt-6">
              <h3 className="font-medium text-sage-200 mb-3">What makes this different:</h3>
              <ul className="space-y-2 text-sm text-sage-100/80">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-sage-400" />
                  Grace-based progress (not perfection-based)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-sage-400" />
                  Trauma-informed design that honors your pace
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-sage-400" />
                  Complete privacy and anonymity options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-sage-400" />
                  No shame, no pressure, just support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )
    },
    
    {
      id: 'privacy',
      title: 'Your Privacy Comes First',
      description: 'Understanding how your data is protected',
      icon: Shield,
      canSkip: false,
      isEssential: true,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Your Privacy is Sacred
            </h2>
          </div>
          
          <div className="space-y-3">
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardContent className="pt-4">
                <h3 className="font-medium text-blue-200 mb-2">What we protect:</h3>
                <ul className="space-y-1 text-sm text-blue-100/80">
                  <li>• Your journal entries are encrypted and private</li>
                  <li>• No one can read your personal reflections</li>
                  <li>• Community features are completely anonymous</li>
                  <li>• You control what gets shared (if anything)</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-green-900/20 border-green-500/30">
              <CardContent className="pt-4">
                <h3 className="font-medium text-green-200 mb-2">Your controls:</h3>
                <ul className="space-y-1 text-sm text-green-100/80">
                  <li>• Export your data anytime</li>
                  <li>• Delete your account completely</li>
                  <li>• Opt out of any feature</li>
                  <li>• Anonymous community participation only</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    
    {
      id: 'crisis_support',
      title: 'Crisis Support Always Available',
      description: 'Resources when you need them most',
      icon: Heart,
      canSkip: false,
      isEssential: true,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              You're Never Alone
            </h2>
            <p className="text-gray-300">
              Crisis support is always just one tap away, no matter what tier you're on.
            </p>
          </div>
          
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="pt-4">
              <h3 className="font-medium text-red-200 mb-3">Always available:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-black/20 rounded p-2">
                  <p className="text-sm font-medium text-red-200">Crisis Text Line</p>
                  <p className="text-xs text-red-100/80">Text HOME to 741741</p>
                </div>
                <div className="bg-black/20 rounded p-2">
                  <p className="text-sm font-medium text-red-200">National Suicide Prevention</p>
                  <p className="text-xs text-red-100/80">988 or 1-800-273-8255</p>
                </div>
                <div className="bg-black/20 rounded p-2">
                  <p className="text-sm font-medium text-red-200">Crisis Support Button</p>
                  <p className="text-xs text-red-100/80">Always visible in app</p>
                </div>
                <div className="bg-black/20 rounded p-2">
                  <p className="text-sm font-medium text-red-200">Safe Pause Feature</p>
                  <p className="text-xs text-red-100/80">Stop anytime, anywhere</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    
    {
      id: 'grace_policy',
      title: 'Grace Tokens & Anti-Shame Design',
      description: 'How we support your healing journey',
      icon: Gift,
      canSkip: false,
      isEssential: true,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Gift className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Grace, Not Pressure
            </h2>
            <p className="text-gray-300">
              We believe healing happens in spirals, not straight lines.
            </p>
          </div>
          
          <Card className="bg-purple-900/20 border-purple-500/30">
            <CardContent className="pt-4">
              <h3 className="font-medium text-purple-200 mb-3">Grace Tokens:</h3>
              <ul className="space-y-2 text-sm text-purple-100/80">
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-purple-400" />
                  You get 2 grace tokens every week (renewed Mondays)
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  Use them when life gets overwhelming
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-purple-400" />
                  They protect your progress during difficult times
                </li>
                <li className="flex items-center gap-2">
                  <Pause className="h-4 w-4 text-purple-400" />
                  Taking breaks is part of healing, not failure
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-900/20 border-amber-500/30">
            <CardContent className="pt-4">
              <h3 className="font-medium text-amber-200 mb-2">What we never do:</h3>
              <ul className="space-y-1 text-sm text-amber-100/80">
                <li>• Show "streak broken" messages</li>
                <li>• Make you feel guilty for missing days</li>
                <li>• Pressure you to maintain artificial consistency</li>
                <li>• Judge your pace or process</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )
    },
    
    {
      id: 'navigation',
      title: 'Simple Navigation',
      description: 'Getting around your sanctuary',
      icon: Compass,
      canSkip: true,
      isEssential: false,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Compass className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Finding Your Way
            </h2>
            <p className="text-gray-300">
              Your sanctuary has just a few key areas to explore.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="bg-green-900/20 border-green-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Feather className="h-5 w-5 text-green-400" />
                  <h3 className="font-medium text-green-200">Journal</h3>
                </div>
                <p className="text-sm text-green-100/80">
                  Your private writing space with gentle prompts when you need them.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-blue-400" />
                  <h3 className="font-medium text-blue-200">Progress</h3>
                </div>
                <p className="text-sm text-blue-100/80">
                  See your journey, earn gentle badges, track your presence.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-900/20 border-purple-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <h3 className="font-medium text-purple-200">Community</h3>
                </div>
                <p className="text-sm text-purple-100/80">
                  Anonymous, optional connection with others on similar journeys.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/20 border-gray-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <h3 className="font-medium text-gray-200">Settings</h3>
                </div>
                <p className="text-sm text-gray-100/80">
                  Customize your experience, privacy controls, export data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    
    {
      id: 'personalization',
      title: 'Personalize Your Experience',
      description: 'Make your sanctuary feel right for you',
      icon: Settings,
      canSkip: true,
      isEssential: false,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Make It Yours
            </h2>
            <p className="text-gray-300">
              Customize your sanctuary to feel safe and supportive.
            </p>
          </div>
          
          <div className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-600">
              <CardContent className="pt-4">
                <h3 className="font-medium text-white mb-3">Reminder Style</h3>
                <div className="space-y-2">
                  {(['none', 'gentle', 'regular'] as const).map((style) => (
                    <Button
                      key={style}
                      variant={userPreferences.reminderStyle === style ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setUserPreferences(prev => ({ ...prev, reminderStyle: style }))}
                    >
                      <span className="capitalize">{style}</span>
                      {style === 'none' && <span className="ml-2 text-xs text-gray-400">- No reminders</span>}
                      {style === 'gentle' && <span className="ml-2 text-xs text-gray-400">- Soft check-ins</span>}
                      {style === 'regular' && <span className="ml-2 text-xs text-gray-400">- Standard reminders</span>}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-600">
              <CardContent className="pt-4">
                <h3 className="font-medium text-white mb-3">Progress Display</h3>
                <div className="space-y-2">
                  {(['minimal', 'encouraging', 'detailed'] as const).map((style) => (
                    <Button
                      key={style}
                      variant={userPreferences.progressVisibility === style ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setUserPreferences(prev => ({ ...prev, progressVisibility: style }))}
                    >
                      <span className="capitalize">{style}</span>
                      {style === 'minimal' && <span className="ml-2 text-xs text-gray-400">- Just the basics</span>}
                      {style === 'encouraging' && <span className="ml-2 text-xs text-gray-400">- Gentle celebration</span>}
                      {style === 'detailed' && <span className="ml-2 text-xs text-gray-400">- Full insights</span>}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = onboardingSteps[currentStep];
  const progressPercentage = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    const stepId = currentStepData.id;
    setCompletedSteps(prev => [...prev, stepId]);
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user preferences and complete onboarding
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipStep = () => {
    if (currentStepData.canSkip) {
      handleNext();
    }
  };

  const handleComplete = () => {
    // Save user preferences to backend
    console.log('Saving user preferences:', userPreferences);
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {onboardingSteps.length}
          </span>
          <Badge variant="outline" className="text-xs">
            {currentStepData.isEssential ? 'Essential' : 'Optional'}
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Current Step Content */}
      <Card className="bg-gray-900/50 border-gray-700 mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <currentStepData.icon className="h-6 w-6 text-blue-400" />
            <div>
              <CardTitle className="text-white">{currentStepData.title}</CardTitle>
              <p className="text-sm text-gray-400">{currentStepData.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStepData.content}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          variant="outline"
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentStepData.canSkip && (
            <Button
              onClick={handleSkipStep}
              variant="ghost"
              className="text-gray-400"
            >
              Skip
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Skip All Option */}
      <div className="text-center mt-6 pt-6 border-t border-gray-700">
        <Button
          onClick={onSkip}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-300"
        >
          Skip onboarding and start writing
        </Button>
      </div>
    </div>
  );
}