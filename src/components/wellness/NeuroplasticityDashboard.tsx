'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';
import { useAnalytics } from '@/lib/analytics';
import { 
  NervousSystemState, 
  HabitProgress, 
  NeuroplasticityHabitEngine,
  MicroHabit,
  AdaptedHabit
} from '@/lib/neuroplasticity-habits';
import NervousSystemTracker from './NervousSystemTracker';
import MicroInterventionSystem from './MicroInterventionSystem';
import NeuralPathwayVisualization from './NeuralPathwayVisualization';

interface NeuroplasticityDashboardProps {
  userId: string;
}

interface DailyHabitSession {
  id: string;
  date: Date;
  habits: AdaptedHabit[];
  nervousSystemState: NervousSystemState;
  completion_rate: number;
  wellbeing_rating: number;
  insights_discovered: string[];
  neural_pathway_strength_changes: Record<string, number>;
}

export const NeuroplasticityDashboard: React.FC<NeuroplasticityDashboardProps> = ({ userId }) => {
  const [currentView, setCurrentView] = useState<'overview' | 'assessment' | 'practice' | 'progress' | 'session'>('overview');
  const [nervousSystemState, setNervousSystemState] = useState<NervousSystemState | null>(null);
  const [habits, setHabits] = useState<MicroHabit[]>([]);
  const [habitProgress, setHabitProgress] = useState<Record<string, HabitProgress>>({});
  const [todaysSession, setTodaysSession] = useState<DailyHabitSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [celebrationQueue, setCelebrationQueue] = useState<any[]>([]);
  const [showNervousSystemCheck, setShowNervousSystemCheck] = useState(false);
  
  const { user } = useAuth();
  const { track, trackUser, getUserMetrics } = useAnalytics();

  // Initialize dashboard data
  useEffect(() => {
    if (!userId || !user) return;

    const initializeDashboard = async () => {
      setIsLoading(true);
      
      try {
        // Load user's habits and progress
        await loadHabitsAndProgress();
        
        // Check if nervous system assessment is needed
        const lastAssessment = localStorage.getItem(`alchm_ns_assessment_${userId}`);
        const daysSinceAssessment = lastAssessment 
          ? Math.floor((Date.now() - parseInt(lastAssessment)) / (1000 * 60 * 60 * 24))
          : 999;
        
        if (daysSinceAssessment > 1) { // Daily check-in
          setShowNervousSystemCheck(true);
        } else {
          // Load cached nervous system state
          const cachedState = localStorage.getItem(`alchm_ns_state_${userId}`);
          if (cachedState) {
            setNervousSystemState(JSON.parse(cachedState));
          }
        }
        
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [userId, user]);

  const loadHabitsAndProgress = async () => {
    try {
      // Create personalized habits based on user profile
      const personalizedHabits = await createPersonalizedHabits();
      setHabits(personalizedHabits);
      
      // Load progress data
      const progressData: Record<string, HabitProgress> = {};
      personalizedHabits.forEach(habit => {
        progressData[habit.id] = createSampleProgress(habit);
      });
      setHabitProgress(progressData);
      
    } catch (error) {
      console.error('Failed to load habits and progress:', error);
    }
  };

  const createPersonalizedHabits = async (): Promise<MicroHabit[]> => {
    const userProfile = {
      trauma_history: ['complex'],
      current_challenges: ['emotional_regulation', 'stress_response'],
      nervous_system_baseline: {} as NervousSystemState,
      existing_strengths: ['self_awareness', 'motivation'],
      preferred_modalities: ['breathing', 'body_awareness', 'mindfulness'] as const
    };

    return [
      NeuroplasticityHabitEngine.createPersonalizedMicroHabit(userProfile, 'amygdala_regulation'),
      NeuroplasticityHabitEngine.createPersonalizedMicroHabit(userProfile, 'prefrontal_cortex'),
      NeuroplasticityHabitEngine.createPersonalizedMicroHabit(userProfile, 'vagal_tone')
    ];
  };

  const createSampleProgress = (habit: MicroHabit): HabitProgress => ({
    user_id: userId,
    habit_id: habit.id,
    days_practiced: Math.floor(Math.random() * 45) + 5,
    neural_pathway_strength: Math.floor(Math.random() * 80) + 20,
    automaticity_level: Math.floor(Math.random() * 60) + 10,
    wellbeing_correlation: Math.random() * 0.8 + 0.1,
    stress_response_improvement: Math.floor(Math.random() * 40) + 10,
    regulation_capacity_change: Math.floor(Math.random() * 30) - 5,
    modifications_used: [],
    pause_periods: [],
    nervous_system_trends: [],
    neuroplasticity_milestones: [],
    personal_victories: [],
    last_updated: new Date(),
    next_adaptation_review: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  const generateTodaysSession = useCallback(() => {
    if (!nervousSystemState || habits.length === 0) return;

    const adaptationResult = NeuroplasticityHabitEngine.adaptHabitsToCurrentState(
      nervousSystemState,
      habits,
      {
        prefer_simplification: nervousSystemState.regulationCapacity === 'minimal',
        auto_adapt: true,
        reminder_style: 'gentle'
      }
    );

    const session: DailyHabitSession = {
      id: `session_${Date.now()}`,
      date: new Date(),
      habits: adaptationResult.recommended_habits,
      nervousSystemState,
      completion_rate: 0,
      wellbeing_rating: 0,
      insights_discovered: [],
      neural_pathway_strength_changes: {}
    };

    setTodaysSession(session);
  }, [nervousSystemState, habits]);

  const handleNervousSystemAssessment = (assessment: NervousSystemState) => {
    setNervousSystemState(assessment);
    setShowNervousSystemCheck(false);
    
    // Cache the assessment
    localStorage.setItem(`alchm_ns_state_${userId}`, JSON.stringify(assessment));
    localStorage.setItem(`alchm_ns_assessment_${userId}`, Date.now().toString());
    
    // Generate session based on assessment
    generateTodaysSession();
    
    // Track assessment completion
    trackUser.preferencesChanged('nervous_system_assessment', assessment.current);
  };

  const handleHabitCompletion = (habitId: string, completionData: {
    version_practiced: string;
    duration_minutes: number;
    engagement_quality: number;
    insights: string[];
    challenges: string[];
  }) => {
    const currentProgress = habitProgress[habitId];
    if (currentProgress) {
      const updatedProgress = {
        ...currentProgress,
        days_practiced: currentProgress.days_practiced + 1,
        last_updated: new Date()
      };

      // Calculate neuroplasticity changes
      const progressResult = NeuroplasticityHabitEngine.trackNeuroplasticProgress(
        updatedProgress,
        {
          consistency_rate: 0.85,
          engagement_quality: completionData.engagement_quality,
          wellbeing_correlation: currentProgress.wellbeing_correlation,
          challenge_navigation: completionData.challenges
        }
      );

      updatedProgress.neural_pathway_strength += progressResult.neural_pathway_strength_change;
      updatedProgress.automaticity_level += progressResult.automaticity_progress;
      updatedProgress.neuroplasticity_milestones.push(...progressResult.milestones_reached);

      setHabitProgress(prev => ({
        ...prev,
        [habitId]: updatedProgress
      }));

      // Queue celebrations for any new milestones
      if (progressResult.celebration_messages.length > 0) {
        setCelebrationQueue(prev => [...prev, ...progressResult.celebration_messages]);
      }

      // Track habit completion
      track('journal', 'habit_completed', habitId, completionData.duration_minutes, {
        engagement_quality: completionData.engagement_quality,
        version_practiced: completionData.version_practiced,
        neural_pathway_change: progressResult.neural_pathway_strength_change
      });
    }
  };

  const renderCelebrations = () => {
    if (celebrationQueue.length === 0) return null;

    return (
      <AnimatePresence>
        {celebrationQueue.map((celebration, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 bg-sage-600 text-white p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">✨</div>
              <div>
                <div className="font-medium">Neuroplasticity Milestone!</div>
                <div className="text-sm mt-1 opacity-90">{celebration}</div>
              </div>
              <button
                onClick={() => setCelebrationQueue(prev => prev.filter((_, i) => i !== index))}
                className="text-white/70 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    );
  };

  // Generate today's session when nervous system state is available
  useEffect(() => {
    if (nervousSystemState && habits.length > 0 && !todaysSession) {
      generateTodaysSession();
    }
  }, [nervousSystemState, habits, todaysSession, generateTodaysSession]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-sage-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <div className="text-sage-600">Preparing your neuroplasticity dashboard...</div>
        </div>
      </div>
    );
  }

  if (showNervousSystemCheck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
        <div className="container mx-auto py-8">
          <NervousSystemTracker
            onAssessmentComplete={handleNervousSystemAssessment}
            showGentleReminder={true}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'assessment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <Button
              onClick={() => setCurrentView('overview')}
              className="mb-4 text-sage-600 hover:text-sage-800 bg-transparent hover:bg-sage-100 border border-sage-300 rounded-full px-6 py-2 transition-all"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-light text-sage-800 mb-2">
              Nervous System Assessment
            </h1>
            <p className="text-sage-600">
              Understanding your current state helps us personalize your neuroplasticity practices
            </p>
          </div>
          
          <NervousSystemTracker 
            onAssessmentComplete={handleNervousSystemAssessment}
            previousState={nervousSystemState || undefined}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'session' && todaysSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
        <div className="container mx-auto py-8">
          <MicroInterventionSystem
            session={todaysSession}
            onHabitComplete={handleHabitCompletion}
            onSessionComplete={(sessionData) => {
              setCurrentView('overview');
              track('journal', 'habit_session_completed', todaysSession.id, sessionData.total_duration);
            }}
            onBackToDashboard={() => setCurrentView('overview')}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'practice' && nervousSystemState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <Button
              onClick={() => setCurrentView('overview')}
              className="mb-4 text-sage-600 hover:text-sage-800 bg-transparent hover:bg-sage-100 border border-sage-300 rounded-full px-6 py-2 transition-all"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-light text-sage-800 mb-2">
              Your Personalized Practice
            </h1>
            <p className="text-sage-600">
              Trauma-informed habits adapted to your nervous system's current capacity
            </p>
          </div>
          
          <MicroInterventionSystem
            session={todaysSession!}
            onHabitComplete={handleHabitCompletion}
            onSessionComplete={(sessionData) => {
              setCurrentView('overview');
              track('journal', 'habit_session_completed', todaysSession!.id, sessionData.total_duration);
            }}
            onBackToDashboard={() => setCurrentView('overview')}
          />
        </div>
      </div>
    );
  }

  // Main Overview Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
      <div className="container mx-auto py-8 px-6">
        {renderCelebrations()}
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-sage-800 mb-4">
            Neuroplasticity Lab
          </h1>
          <p className="text-sage-600 text-lg max-w-2xl mx-auto">
            Your personalized space for trauma-informed habit formation and neural rewiring
          </p>
        </div>

        {/* Current State Card */}
        {nervousSystemState && (
          <div className="mb-8">
            <CurrentStateCard nervousSystemState={nervousSystemState} />
          </div>
        )}

        {/* Today's Session */}
        {todaysSession && (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-sage-800">Today's Practice</h2>
              <div className="text-sm text-sage-600">
                {todaysSession.habits.length} practices • Adapted to your current capacity
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {todaysSession.habits.map((adaptedHabit, index) => {
                const habit = habits.find(h => h.id === adaptedHabit.habit_id);
                if (!habit) return null;

                return (
                  <div
                    key={index}
                    className="bg-sage-50 p-4 rounded-lg border border-sage-200"
                  >
                    <h3 className="font-medium text-sage-800 mb-2">{habit.name}</h3>
                    <p className="text-sm text-sage-600 mb-3">{adaptedHabit.adapted_version}</p>
                    <div className="text-xs text-sage-500">
                      ~{adaptedHabit.estimated_duration} min • {habit.neuroplasticity_target.replace('_', ' ')}
                    </div>
                    {adaptedHabit.modification_applied && (
                      <div className="mt-2 text-xs bg-amber-50 text-amber-700 p-2 rounded">
                        {adaptedHabit.modification_explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => setCurrentView('session')}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white rounded-full py-3"
            >
              Begin Today's Practice
            </Button>
          </Card>
        )}

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Nervous System Assessment */}
          <NavigationCard
            icon="🧠"
            title="Nervous System Check-in"
            description="Assess your current state using polyvagal theory and window of tolerance"
            action="Take Assessment"
            onClick={() => setCurrentView('assessment')}
            gradient="from-blue-100 to-blue-50"
            accentColor="blue-600"
          />

          {/* Practice Session */}
          <NavigationCard
            icon="🌱"
            title="Micro-Interventions"
            description="Neuroplasticity-based practices adapted to your current capacity"
            action={todaysSession ? "Start Practice" : nervousSystemState ? "Generate Session" : "Assess First"}
            onClick={() => {
              if (todaysSession) {
                setCurrentView('session');
              } else if (nervousSystemState) {
                generateTodaysSession();
              } else {
                setCurrentView('assessment');
              }
            }}
            gradient="from-sage-100 to-sage-50"
            accentColor="sage-600"
            disabled={!nervousSystemState}
          />

          {/* Progress Tracking */}
          <NavigationCard
            icon="📈"
            title="Neural Progress"
            description="Track your brain's adaptive changes and celebrate milestones"
            action="View Progress"
            onClick={() => setCurrentView('progress')}
            gradient="from-purple-100 to-purple-50"
            accentColor="purple-600"
          />

        </div>

        {/* Neuroplasticity Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-yellow-800">How This Works</h3>
                <p className="text-yellow-700 text-sm">The science behind your transformation</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-yellow-800">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                  1
                </div>
                <div>
                  <div className="font-medium">Neuroplasticity</div>
                  <div className="text-yellow-700">Your brain can form new neural pathways throughout life. Small, consistent practices create lasting structural changes.</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                  2
                </div>
                <div>
                  <div className="font-medium">Trauma-Informed</div>
                  <div className="text-yellow-700">We respect your nervous system's capacity and adapt practices to your window of tolerance.</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                  3
                </div>
                <div>
                  <div className="font-medium">Regulatory Circuits</div>
                  <div className="text-yellow-700">Specific practices strengthen brain circuits for emotional regulation, stress response, and social connection.</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-green-50 to-sage-50 border-sage-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-sage-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">💚</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-sage-800">Your Safety First</h3>
                <p className="text-sage-700 text-sm">Trauma-informed principles guide everything</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-sage-800">
              <div className="p-3 bg-white rounded-lg border border-sage-200">
                <div className="font-medium">✨ Choice & Agency</div>
                <div className="text-sage-600">You always have control. Modify or pause anytime.</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-sage-200">
                <div className="font-medium">🌊 Titration</div>
                <div className="text-sage-600">Start small. Your nervous system guides the pace.</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-sage-200">
                <div className="font-medium">🤝 Co-regulation</div>
                <div className="text-sage-600">Healing happens in relationship and community.</div>
              </div>
            </div>
          </Card>

        </div>

        {/* Progress Overview */}
        {Object.keys(habitProgress).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Object.entries(habitProgress).map(([habitId, progress]) => {
              const habit = habits.find(h => h.id === habitId);
              if (!habit) return null;

              return (
                <Card key={habitId} className="p-4">
                  <h3 className="font-medium text-sage-800 mb-2">{habit.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-sage-600">Neural Pathway Strength</span>
                      <span className="text-sage-800">{progress.neural_pathway_strength}%</span>
                    </div>
                    <div className="w-full bg-sage-200 rounded-full h-2">
                      <div 
                        className="bg-sage-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.neural_pathway_strength}%` }}
                      />
                    </div>
                    <div className="text-xs text-sage-500">
                      {progress.days_practiced} days practiced • {progress.neuroplasticity_milestones.length} milestones
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Recent Activity Summary */}
        {Object.keys(habitProgress).length > 0 && (
          <Card className="p-8 bg-white border-sage-200 mb-8">
            <h3 className="text-xl font-medium text-sage-800 mb-6">Recent Neural Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-sage-50 rounded-lg">
                <div className="text-2xl font-light text-sage-800">7</div>
                <div className="text-sm text-sage-600">Days practiced this week</div>
                <div className="text-xs text-sage-500 mt-1">Building consistency</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-light text-blue-800">
                  {Math.round(Object.values(habitProgress).reduce((acc, p) => acc + p.neural_pathway_strength, 0) / Object.values(habitProgress).length)}%
                </div>
                <div className="text-sm text-blue-600">Average pathway strength</div>
                <div className="text-xs text-blue-500 mt-1">Strong development!</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-light text-purple-800">
                  {Object.values(habitProgress).reduce((acc, p) => acc + p.neuroplasticity_milestones.length, 0)}
                </div>
                <div className="text-sm text-purple-600">Milestones achieved</div>
                <div className="text-xs text-purple-500 mt-1">Celebrating progress</div>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

// Supporting Components
const CurrentStateCard: React.FC<{ nervousSystemState: NervousSystemState }> = ({ nervousSystemState }) => {
  const getStateColor = (state: string) => {
    const colors = {
      ventral_vagal: 'text-sage-600 bg-sage-100',
      sympathetic: 'text-orange-600 bg-orange-100',
      dorsal_vagal: 'text-blue-600 bg-blue-100'
    };
    return colors[state as keyof typeof colors] || colors.ventral_vagal;
  };

  const getStateIcon = (state: string) => {
    const icons = {
      ventral_vagal: '🌿',
      sympathetic: '🔥',
      dorsal_vagal: '🌙'
    };
    return icons[state as keyof typeof icons] || '🌿';
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-white to-sage-50 border-sage-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getStateColor(nervousSystemState.current)}`}>
            <span className="text-3xl">{getStateIcon(nervousSystemState.current)}</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-sage-800">
              Current Nervous System State
            </h3>
            <div className="text-sage-600 capitalize">
              {nervousSystemState.current.replace('_', ' ')} • Capacity: {nervousSystemState.regulationCapacity}
            </div>
            <div className="text-sm text-sage-500">
              Last assessed: {nervousSystemState.lastAssessment.toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-sage-600 mb-2">Window of Tolerance</div>
          <div className="w-32 bg-sage-200 rounded-full h-3 relative">
            <div 
              className="bg-sage-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${nervousSystemState.windowOfTolerance.current}%` }}
            />
          </div>
          <div className="text-xs text-sage-500 mt-1">
            {nervousSystemState.windowOfTolerance.current}% • {nervousSystemState.windowOfTolerance.trend}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface NavigationCardProps {
  icon: string;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
  gradient: string;
  accentColor: string;
  disabled?: boolean;
}

const NavigationCard: React.FC<NavigationCardProps> = ({
  icon,
  title,
  description,
  action,
  onClick,
  gradient,
  accentColor,
  disabled = false
}) => {
  return (
    <Card 
      className={`p-8 cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-lg border-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <div className={`bg-gradient-to-br ${gradient} rounded-lg p-6 text-center`}>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{description}</p>
        <Button 
          className={`bg-${accentColor} hover:bg-${accentColor} text-white px-6 py-2 rounded-full transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={disabled}
        >
          {action}
        </Button>
      </div>
    </Card>
  );
};

export default NeuroplasticityDashboard;