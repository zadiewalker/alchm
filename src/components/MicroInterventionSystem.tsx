'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/lib/analytics';

interface DailyHabitSession {
  id: string;
  date: Date;
  habits: AdaptedHabit[];
  nervousSystemState: any;
  completion_rate: number;
  wellbeing_rating: number;
  insights_discovered: string[];
  neural_pathway_strength_changes: Record<string, number>;
}

interface AdaptedHabit {
  habit_id: string;
  adapted_version: string;
  modification_applied: boolean;
  modification_explanation: string;
  estimated_duration: number;
  nervous_system_prep: string;
}

interface MicroInterventionSystemProps {
  session: DailyHabitSession;
  onHabitComplete: (habitId: string, completionData: {
    version_practiced: string;
    duration_minutes: number;
    engagement_quality: number;
    insights: string[];
    challenges: string[];
  }) => void;
  onSessionComplete: (sessionData: {
    total_duration: number;
    completion_rate: number;
    wellbeing_change: number;
    insights: string[];
  }) => void;
  onBackToDashboard: () => void;
}

interface HabitPracticeSession {
  habitId: string;
  startTime: Date;
  currentPhase: 'preparation' | 'practice' | 'integration' | 'reflection' | 'complete';
  engagementQuality: number;
  insights: string[];
  challenges: string[];
  actualDuration: number;
}

export const MicroInterventionSystem: React.FC<MicroInterventionSystemProps> = ({
  session,
  onHabitComplete,
  onSessionComplete,
  onBackToDashboard
}) => {
  const [currentHabitIndex, setCurrentHabitIndex] = useState(0);
  const [practiceSession, setPracticeSession] = useState<HabitPracticeSession | null>(null);
  const [sessionStartTime] = useState(new Date());
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);
  const [sessionInsights, setSessionInsights] = useState<string[]>([]);
  const [wellbeingBefore, setWellbeingBefore] = useState<number | null>(null);
  const [wellbeingAfter, setWellbeingAfter] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { track } = useAnalytics();

  const currentHabit = session.habits[currentHabitIndex];
  const isLastHabit = currentHabitIndex === session.habits.length - 1;
  const allHabitsComplete = completedHabits.length === session.habits.length;

  useEffect(() => {
    // Track session start
    track('journal', 'habit_session_started', session.id);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startHabitPractice = (habitId: string) => {
    const newSession: HabitPracticeSession = {
      habitId,
      startTime: new Date(),
      currentPhase: 'preparation',
      engagementQuality: 0,
      insights: [],
      challenges: [],
      actualDuration: 0
    };
    
    setPracticeSession(newSession);
    track('journal', 'habit_practice_started', habitId);
  };

  const updatePracticeSession = (updates: Partial<HabitPracticeSession>) => {
    if (!practiceSession) return;
    
    const updatedSession = { ...practiceSession, ...updates };
    setPracticeSession(updatedSession);
    
    // Calculate duration
    const duration = Math.round((Date.now() - practiceSession.startTime.getTime()) / 60000);
    updatedSession.actualDuration = duration;
  };

  const completeCurrentHabit = () => {
    if (!practiceSession || !currentHabit) return;

    const completionData = {
      version_practiced: currentHabit.adapted_version,
      duration_minutes: practiceSession.actualDuration,
      engagement_quality: practiceSession.engagementQuality,
      insights: practiceSession.insights,
      challenges: practiceSession.challenges
    };

    onHabitComplete(practiceSession.habitId, completionData);
    setCompletedHabits(prev => [...prev, practiceSession.habitId]);
    setSessionInsights(prev => [...prev, ...practiceSession.insights]);
    setPracticeSession(null);

    // Move to next habit or complete session
    if (isLastHabit) {
      completeSession();
    } else {
      setCurrentHabitIndex(prev => prev + 1);
    }
  };

  const skipCurrentHabit = () => {
    track('journal', 'habit_skipped', currentHabit?.habit_id);
    
    if (isLastHabit) {
      completeSession();
    } else {
      setCurrentHabitIndex(prev => prev + 1);
    }
    
    setPracticeSession(null);
    setShowSkipConfirmation(false);
  };

  const completeSession = () => {
    const totalDuration = Math.round((Date.now() - sessionStartTime.getTime()) / 60000);
    const completionRate = completedHabits.length / session.habits.length;
    const wellbeingChange = wellbeingAfter && wellbeingBefore 
      ? wellbeingAfter - wellbeingBefore 
      : 0;

    onSessionComplete({
      total_duration: totalDuration,
      completion_rate: completionRate,
      wellbeing_change: wellbeingChange,
      insights: sessionInsights
    });
  };

  // Session Introduction
  if (wellbeingBefore === null) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-3xl font-light text-sage-800 mb-4">
            Ready to Begin
          </h1>
          <p className="text-sage-600 mb-6">
            Before we start, let's check in with how you're feeling
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sage-800 font-medium mb-3">
                How are you feeling right now? (1-10)
              </label>
              <div className="flex justify-center space-x-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setWellbeingBefore(rating)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      wellbeingBefore === rating
                        ? 'border-sage-600 bg-sage-600 text-white'
                        : 'border-sage-300 bg-white text-sage-600 hover:border-sage-500'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
              <h3 className="font-medium text-sage-800 mb-2">Today's Session</h3>
              <div className="text-sm text-sage-600 space-y-1">
                <div>• {session.habits.length} practices adapted to your capacity</div>
                <div>• Estimated time: {session.habits.reduce((acc, h) => acc + h.estimated_duration, 0)} minutes</div>
                <div>• You can modify, pause, or skip any practice</div>
              </div>
            </div>

            <Button
              onClick={() => startHabitPractice(currentHabit.habit_id)}
              disabled={wellbeingBefore === null}
              className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-full"
            >
              Begin Practice
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Session Complete
  if (allHabitsComplete || wellbeingAfter !== null) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-6"
          >
            ✨
          </motion.div>
          
          <h1 className="text-3xl font-light text-sage-800 mb-4">
            Practice Complete
          </h1>
          
          <p className="text-sage-600 mb-6">
            Beautiful work honoring your nervous system and building new neural pathways
          </p>

          <div className="space-y-6">
            {wellbeingAfter === null && (
              <>
                <div>
                  <label className="block text-sage-800 font-medium mb-3">
                    How are you feeling now? (1-10)
                  </label>
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setWellbeingAfter(rating)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          wellbeingAfter === rating
                            ? 'border-sage-600 bg-sage-600 text-white'
                            : 'border-sage-300 bg-white text-sage-600 hover:border-sage-500'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={completeSession}
                  disabled={wellbeingAfter === null}
                  className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-full"
                >
                  Complete Session
                </Button>
              </>
            )}

            {wellbeingAfter !== null && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-sage-50 p-4 rounded-lg">
                    <div className="text-2xl font-light text-sage-800">
                      {completedHabits.length}/{session.habits.length}
                    </div>
                    <div className="text-sm text-sage-600">Practices completed</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-light text-blue-800">
                      {wellbeingAfter - wellbeingBefore > 0 ? '+' : ''}{wellbeingAfter - wellbeingBefore}
                    </div>
                    <div className="text-sm text-blue-600">Wellbeing change</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-light text-purple-800">
                      {sessionInsights.length}
                    </div>
                    <div className="text-sm text-purple-600">Insights discovered</div>
                  </div>
                </div>

                {sessionInsights.length > 0 && (
                  <div className="bg-sage-50 p-4 rounded-lg text-left">
                    <h3 className="font-medium text-sage-800 mb-2">Session Insights</h3>
                    <div className="space-y-1">
                      {sessionInsights.map((insight, index) => (
                        <div key={index} className="text-sm text-sage-700">
                          • {insight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={onBackToDashboard}
                  className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-full"
                >
                  Return to Dashboard
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // No practice session active - show habit overview
  if (!practiceSession) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-sage-800">
              Practice {currentHabitIndex + 1} of {session.habits.length}
            </h2>
            <div className="text-sm text-sage-600">
              {completedHabits.length} completed
            </div>
          </div>
          
          <div className="w-full bg-sage-200 rounded-full h-2">
            <div 
              className="bg-sage-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentHabitIndex + completedHabits.length) / session.habits.length) * 100}%` }}
            />
          </div>
        </Card>

        {/* Current Habit */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-2xl font-light text-sage-800 mb-2">
              Neural Practice {currentHabitIndex + 1}
            </h3>
            <p className="text-sage-600">
              ~{currentHabit.estimated_duration} minutes • Adapted to your current capacity
            </p>
          </div>

          <div className="space-y-6">
            {/* Nervous System Preparation */}
            <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
              <h4 className="font-medium text-sage-800 mb-2">🌿 First, let's prepare</h4>
              <p className="text-sage-700 text-sm">{currentHabit.nervous_system_prep}</p>
            </div>

            {/* Practice Description */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">🎯 Your practice</h4>
              <p className="text-blue-700">{currentHabit.adapted_version}</p>
            </div>

            {/* Modification Notice */}
            {currentHabit.modification_applied && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-800 mb-2">💡 Personalized for you</h4>
                <p className="text-amber-700 text-sm">{currentHabit.modification_explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={() => startHabitPractice(currentHabit.habit_id)}
                className="flex-1 bg-sage-600 hover:bg-sage-700 text-white py-3 rounded-full"
              >
                Begin Practice
              </Button>
              
              <Button
                onClick={() => setShowSkipConfirmation(true)}
                className="text-sage-600 bg-transparent hover:bg-sage-100 border border-sage-300 px-6 py-3 rounded-full"
              >
                Skip
              </Button>
            </div>
          </div>
        </Card>

        {/* Skip Confirmation */}
        <AnimatePresence>
          {showSkipConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white p-6 rounded-lg max-w-md"
              >
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Skip this practice?
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  It's completely okay to skip. Your nervous system knows what it needs. 
                  You can always come back to this practice later.
                </p>
                <div className="flex space-x-4">
                  <Button
                    onClick={skipCurrentHabit}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-full"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={() => setShowSkipConfirmation(false)}
                    className="flex-1 text-gray-600 bg-transparent hover:bg-gray-100 border border-gray-300 py-2 rounded-full"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Active practice session
  return (
    <ActivePracticeSession 
      practiceSession={practiceSession}
      currentHabit={currentHabit}
      onUpdateSession={updatePracticeSession}
      onCompleteHabit={completeCurrentHabit}
      onCancel={() => setPracticeSession(null)}
    />
  );
};

// Active Practice Session Component
const ActivePracticeSession: React.FC<{
  practiceSession: HabitPracticeSession;
  currentHabit: AdaptedHabit;
  onUpdateSession: (updates: Partial<HabitPracticeSession>) => void;
  onCompleteHabit: () => void;
  onCancel: () => void;
}> = ({ practiceSession, currentHabit, onUpdateSession, onCompleteHabit, onCancel }) => {
  const [timer, setTimer] = useState(0);
  const [engagementRating, setEngagementRating] = useState(0);
  const [insights, setInsights] = useState('');
  const [challenges, setChallenges] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(Math.floor((Date.now() - practiceSession.startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [practiceSession.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    onUpdateSession({
      engagementQuality: engagementRating,
      insights: insights.split('\n').filter(i => i.trim()),
      challenges: challenges.split('\n').filter(c => c.trim())
    });
    onCompleteHabit();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🧘</div>
          <h2 className="text-2xl font-light text-sage-800 mb-2">
            Practice in Progress
          </h2>
          <div className="text-2xl font-mono text-sage-600">
            {formatTime(timer)}
          </div>
          <p className="text-sage-500 text-sm mt-2">
            Take your time • Listen to your body
          </p>
        </div>

        <div className="space-y-6">
          {/* Practice Reminder */}
          <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
            <p className="text-sage-700 text-center">
              {currentHabit.adapted_version}
            </p>
          </div>

          {/* Engagement Rating */}
          <div>
            <label className="block text-sage-800 font-medium mb-3">
              How engaged do you feel with this practice? (1-10)
            </label>
            <div className="flex justify-center space-x-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
                <button
                  key={rating}
                  onClick={() => setEngagementRating(rating)}
                  className={`w-8 h-8 rounded-full border-2 transition-all text-sm ${
                    engagementRating === rating
                      ? 'border-sage-600 bg-sage-600 text-white'
                      : 'border-sage-300 bg-white text-sage-600 hover:border-sage-500'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <label className="block text-sage-800 font-medium mb-2">
              Any insights or observations? (optional)
            </label>
            <textarea
              value={insights}
              onChange={(e) => setInsights(e.target.value)}
              className="w-full p-3 border border-sage-200 rounded-lg focus:border-sage-400 focus:outline-none resize-none"
              rows={3}
              placeholder="What are you noticing in your body, mind, or emotions?"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleComplete}
              disabled={engagementRating === 0}
              className="flex-1 bg-sage-600 hover:bg-sage-700 text-white py-3 rounded-full"
            >
              Complete Practice
            </Button>
            
            <Button
              onClick={onCancel}
              className="text-sage-600 bg-transparent hover:bg-sage-100 border border-sage-300 px-6 py-3 rounded-full"
            >
              Pause
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

};

export default MicroInterventionSystem;