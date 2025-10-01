/**
 * Sanctuary Emotional Support - Essential support features for free tier
 * 
 * Provides fundamental emotional support without requiring AI sophistication:
 * - Basic reflection prompts for writing blocks
 * - Gentle encouragement based on mood/context
 * - Essential boundary-setting reminders
 * - Session intensity monitoring
 * - Pause and transition support
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Pause, 
  RefreshCw, 
  Shield, 
  Clock,
  Lightbulb,
  Feather,
  Compass,
  MessageCircle
} from 'lucide-react';
import { SANCTUARY_PROMPTS, SANCTUARY_ENCOURAGEMENT } from '@/lib/sanctuary-tier';

interface SanctuaryEmotionalSupportProps {
  userId: string;
  currentMood?: 'crisis' | 'difficult' | 'neutral' | 'good' | 'joyful';
  sessionStartTime: Date;
  sessionIntensity?: 'light' | 'medium' | 'deep' | 'intense';
  hasWrittenToday: boolean;
  daysSinceLastEntry: number;
  onPromptSelect: (prompt: string) => void;
  onSessionPause: () => void;
  onBoundaryCheck: () => void;
}

type PromptCategory = 'dailyCheckins' | 'processingPrompts' | 'boundaryPrompts' | 'pausePrompts';

interface SessionMonitor {
  startTime: Date;
  warningShown: boolean;
  intensityLevel: number;
  boundaryCheckTime?: Date;
}

export function SanctuaryEmotionalSupport({
  userId,
  currentMood = 'neutral',
  sessionStartTime,
  sessionIntensity = 'light',
  hasWrittenToday,
  daysSinceLastEntry,
  onPromptSelect,
  onSessionPause,
  onBoundaryCheck
}: SanctuaryEmotionalSupportProps) {
  const [activePromptCategory, setActivePromptCategory] = useState<PromptCategory>('dailyCheckins');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [sessionMonitor, setSessionMonitor] = useState<SessionMonitor>({
    startTime: sessionStartTime,
    warningShown: false,
    intensityLevel: 1
  });

  // Monitor session duration and intensity
  useEffect(() => {
    const checkSessionIntensity = () => {
      const sessionDuration = Date.now() - sessionStartTime.getTime();
      const minutesElapsed = sessionDuration / (1000 * 60);
      
      // Gentle boundary check after 20 minutes
      if (minutesElapsed > 20 && !sessionMonitor.warningShown) {
        setSessionMonitor(prev => ({ ...prev, warningShown: true }));
        setShowEncouragement(true);
      }
      
      // Increase intensity level based on time spent
      const newIntensityLevel = Math.min(Math.floor(minutesElapsed / 10) + 1, 5);
      setSessionMonitor(prev => ({ ...prev, intensityLevel: newIntensityLevel }));
    };

    const interval = setInterval(checkSessionIntensity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionStartTime, sessionMonitor.warningShown]);

  // Get contextual encouragement based on user state
  const getContextualEncouragement = () => {
    if (daysSinceLastEntry > 3) {
      return SANCTUARY_ENCOURAGEMENT.returnCelebration[
        Math.floor(Math.random() * SANCTUARY_ENCOURAGEMENT.returnCelebration.length)
      ];
    }
    
    if (currentMood === 'difficult' || currentMood === 'crisis') {
      return SANCTUARY_ENCOURAGEMENT.difficultDaySupport[
        Math.floor(Math.random() * SANCTUARY_ENCOURAGEMENT.difficultDaySupport.length)
      ];
    }
    
    if (!hasWrittenToday) {
      return SANCTUARY_ENCOURAGEMENT.showingUpMessages[
        Math.floor(Math.random() * SANCTUARY_ENCOURAGEMENT.showingUpMessages.length)
      ];
    }
    
    return "You're taking time for yourself. That matters.";
  };

  // Get appropriate prompts based on context
  const getContextualPrompts = (category: PromptCategory) => {
    const promptMap = {
      dailyCheckins: SANCTUARY_PROMPTS.dailyCheckins,
      processingPrompts: SANCTUARY_PROMPTS.processingPrompts,
      boundaryPrompts: SANCTUARY_PROMPTS.boundaryPrompts,
      pausePrompts: SANCTUARY_PROMPTS.pausePrompts
    };

    return promptMap[category] || [];
  };

  // Calculate session time for boundary awareness
  const getSessionDuration = () => {
    const minutes = Math.floor((Date.now() - sessionStartTime.getTime()) / (1000 * 60));
    return minutes;
  };

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    onPromptSelect(prompt);
  };

  const promptCategories = [
    { 
      key: 'dailyCheckins' as PromptCategory,
      name: 'Check-In',
      icon: Heart,
      description: 'Gentle daily reflection starters',
      color: 'text-pink-400'
    },
    { 
      key: 'processingPrompts' as PromptCategory,
      name: 'Process',
      icon: Compass,
      description: 'When you need to work through something',
      color: 'text-blue-400'
    },
    { 
      key: 'boundaryPrompts' as PromptCategory,
      name: 'Boundaries',
      icon: Shield,
      description: 'Exploring your limits and needs',
      color: 'text-green-400'
    },
    { 
      key: 'pausePrompts' as PromptCategory,
      name: 'Pause',
      icon: Pause,
      description: 'When things feel overwhelming',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Contextual Encouragement */}
      <Card className="bg-sage-900/20 border-sage-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="h-5 w-5 text-sage-300" />
            <h3 className="font-medium text-sage-200">A Gentle Reminder</h3>
          </div>
          <p className="text-sage-100/80 italic">
            "{getContextualEncouragement()}"
          </p>
        </CardContent>
      </Card>

      {/* Session Boundary Monitor */}
      {sessionMonitor.intensityLevel > 2 && (
        <Card className="bg-amber-900/20 border-amber-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-300" />
                <div>
                  <h4 className="font-medium text-amber-200">Session Check</h4>
                  <p className="text-sm text-amber-100/80">
                    You've been writing for {getSessionDuration()} minutes
                  </p>
                </div>
              </div>
              <Button
                onClick={onBoundaryCheck}
                variant="outline"
                size="sm"
                className="border-amber-400 text-amber-300 hover:bg-amber-900/20"
              >
                Take a pause?
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prompt Categories */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            Writing Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Category Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {promptCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activePromptCategory === category.key;
              
              return (
                <Button
                  key={category.key}
                  onClick={() => setActivePromptCategory(category.key)}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`flex flex-col gap-1 h-auto py-3 ${
                    isActive 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'border-gray-600 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${category.color}`} />
                  <span className="text-xs">{category.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Active Category Description */}
          <div className="mb-4">
            <p className="text-sm text-gray-400">
              {promptCategories.find(c => c.key === activePromptCategory)?.description}
            </p>
          </div>

          {/* Prompts for Active Category */}
          <div className="space-y-2">
            {getContextualPrompts(activePromptCategory).slice(0, 4).map((prompt, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedPrompt === prompt
                    ? 'bg-blue-900/20 border-blue-500/30'
                    : 'bg-gray-800/30 border-gray-600 hover:bg-gray-800/50'
                }`}
                onClick={() => handlePromptSelect(prompt)}
              >
                <div className="flex items-center gap-3">
                  <Feather className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <p className="text-sm text-gray-300">{prompt}</p>
                </div>
                {selectedPrompt === prompt && (
                  <div className="mt-2 pt-2 border-t border-gray-600">
                    <Badge variant="outline" className="text-xs border-blue-400 text-blue-300">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Refresh Prompts */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-400 hover:text-gray-200"
              onClick={() => {
                // In real implementation, this would shuffle/refresh prompts
                setSelectedPrompt('');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              More prompts like these
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emotional State Support */}
      {(currentMood === 'difficult' || currentMood === 'crisis') && (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-5 w-5 text-red-300" />
              <h4 className="font-medium text-red-200">Extra Support Available</h4>
            </div>
            <p className="text-sm text-red-100/80 mb-4">
              It sounds like you're going through something difficult. Remember that 
              you can pause anytime, and there are resources available if you need them.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={onSessionPause}
                variant="outline"
                size="sm"
                className="border-red-400 text-red-300 hover:bg-red-900/20"
              >
                <Pause className="h-4 w-4 mr-2" />
                Take a pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-400 text-red-300 hover:bg-red-900/20"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Crisis resources
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Writing Block Support */}
      {!hasWrittenToday && daysSinceLastEntry > 1 && (
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Compass className="h-5 w-5 text-blue-300" />
              <h4 className="font-medium text-blue-200">Getting Started</h4>
            </div>
            <p className="text-sm text-blue-100/80 mb-4">
              Sometimes starting is the hardest part. You don't need to write anything 
              profound - just whatever feels true right now.
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-blue-400 text-blue-300 hover:bg-blue-900/20"
                onClick={() => handlePromptSelect("How are you showing up for yourself today?")}
              >
                Start with a simple check-in
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-blue-400 text-blue-300 hover:bg-blue-900/20"
                onClick={() => handlePromptSelect("What's one small thing you can appreciate about yourself right now?")}
              >
                Focus on self-appreciation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gentle Transitions */}
      <Card className="bg-purple-900/20 border-purple-500/30">
        <CardContent className="pt-6">
          <h4 className="font-medium text-purple-200 mb-2 flex items-center gap-2">
            <Pause className="h-4 w-4" />
            Remember
          </h4>
          <p className="text-sm text-purple-100/80">
            You can pause, take breaks, or stop anytime. This is your space, and you 
            set the pace. There's no pressure to write more than feels comfortable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing emotional support state
export function useSanctuaryEmotionalSupport(userId: string) {
  const [sessionState, setSessionState] = useState({
    startTime: new Date(),
    mood: 'neutral' as 'crisis' | 'difficult' | 'neutral' | 'good' | 'joyful',
    intensity: 'light' as 'light' | 'medium' | 'deep' | 'intense',
    hasWrittenToday: false,
    daysSinceLastEntry: 0
  });

  const updateMood = (mood: typeof sessionState.mood) => {
    setSessionState(prev => ({ ...prev, mood }));
  };

  const updateIntensity = (intensity: typeof sessionState.intensity) => {
    setSessionState(prev => ({ ...prev, intensity }));
  };

  const markWrittenToday = () => {
    setSessionState(prev => ({ ...prev, hasWrittenToday: true }));
  };

  const startNewSession = () => {
    setSessionState(prev => ({ ...prev, startTime: new Date() }));
  };

  return {
    sessionState,
    updateMood,
    updateIntensity,
    markWrittenToday,
    startNewSession
  };
}