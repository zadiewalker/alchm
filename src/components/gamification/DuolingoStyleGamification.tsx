'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';
import { useMobileOptimization } from '../MobileOptimizationProvider';

// Import our gamification systems
import { 
  DuolingoStyleHealingEngine, 
  EmotionalStreak, 
  EmotionalSkill, 
  LearningPath, 
  CelebrationEvent,
  DailyCheckIn
} from '@/lib/gamification/duolingo-style-healing-engine';
import { AdaptiveLearningEngine, LearningAnalytics } from '@/lib/gamification/adaptive-learning-engine';
import { EngagementSystem, EngagementPreferences } from '@/lib/gamification/engagement-system';

// Import our components
import EmotionalSkillTree from './EmotionalSkillTree';
import CelebrationSystem from './CelebrationSystem';
import DailyEmotionalCheckIn from './DailyEmotionalCheckIn';

interface DuolingoStyleGamificationProps {
  userId: string;
  initialData?: {
    streak?: EmotionalStreak;
    skills?: EmotionalSkill[];
    path?: LearningPath;
    celebrations?: CelebrationEvent[];
  };
  userPreferences?: {
    celebrationStyle: 'gentle' | 'enthusiastic' | 'wise';
    communicationStyle: 'supportive_friend' | 'wise_mentor' | 'cheerful_coach';
    traumaInformed: boolean;
    culturalBackground?: string[];
  };
  onDataUpdate?: (data: any) => void;
}

interface GamificationState {
  streak: EmotionalStreak;
  skills: EmotionalSkill[];
  learningPath: LearningPath;
  pendingCelebrations: CelebrationEvent[];
  learningAnalytics: LearningAnalytics | null;
  engagementPreferences: EngagementPreferences | null;
  currentView: 'dashboard' | 'skills' | 'check_in' | 'progress';
  isInitialized: boolean;
  lastCheckIn: DailyCheckIn | null;
}

export default function DuolingoStyleGamification({
  userId,
  initialData,
  userPreferences = {
    celebrationStyle: 'gentle',
    communicationStyle: 'supportive_friend',
    traumaInformed: true
  },
  onDataUpdate
}: DuolingoStyleGamificationProps) {
  const [gamificationState, setGamificationState] = useState<GamificationState>({
    streak: initialData?.streak || {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      gracePeriodsUsed: 0,
      streakType: 'showing_up',
      multiplier: 1.0,
      celebrationsPending: [],
      milestones: { achieved: [], next: 1, specialMilestones: {} }
    },
    skills: initialData?.skills || [],
    learningPath: initialData?.path || {
      userId,
      currentPhase: 'foundation',
      personalizedGoals: [],
      culturalAdaptations: [],
      pacing: 'adaptive',
      skillPriorities: [],
      nextRecommendations: [],
      progressAnalytics: {
        weeklyGrowth: 0,
        consistencyScore: 0,
        depthScore: 0,
        integrationScore: 0,
        joyScore: 100
      },
      healingRhythm: {
        optimalTimes: [],
        energyPatterns: [],
        supportNeeds: []
      }
    },
    pendingCelebrations: initialData?.celebrations || [],
    learningAnalytics: null,
    engagementPreferences: null,
    currentView: 'dashboard',
    isInitialized: false,
    lastCheckIn: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [lastTapTime, setLastTapTime] = useState<number>(0);

  const { user } = useAuth();
  const { 
    isCrisisMode, 
    isLowBattery, 
    isOffline 
  } = useMobileOptimization();

  // Handle double-tap protection
  const handleTouchSafeAction = useCallback((action: () => void) => {
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) return;
    setLastTapTime(currentTime);
    
    if (typeof navigator !== 'undefined' && navigator.vibrate && !isLowBattery) {
      navigator.vibrate(15);
    }
    
    action();
  }, [lastTapTime, isLowBattery]);

  // Initialize gamification systems
  useEffect(() => {
    initializeGamificationSystems();
  }, [userId]);

  const initializeGamificationSystems = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize the main healing engine
      const healingJourney = await DuolingoStyleHealingEngine.initializeJourney(userId, {
        pacing: 'adaptive',
        culturalBackground: userPreferences.culturalBackground,
        traumaInformed: userPreferences.traumaInformed,
        celebrationStyle: userPreferences.celebrationStyle,
        communicationPreference: userPreferences.communicationStyle
      });

      // Initialize engagement preferences
      const engagementPrefs = await EngagementSystem.initializeEngagementPreferences(userId, {
        traumaInformed: userPreferences.traumaInformed,
        communicationStyle: userPreferences.communicationStyle,
        culturalBackground: userPreferences.culturalBackground
      });

      // Update state with initialized data
      setGamificationState(prev => ({
        ...prev,
        streak: healingJourney.streak,
        skills: healingJourney.skills,
        learningPath: healingJourney.path,
        engagementPreferences: engagementPrefs,
        lastCheckIn: healingJourney.firstCheckin,
        isInitialized: true
      }));

      // Check if user needs to do daily check-in
      const today = new Date().toISOString().split('T')[0];
      const hasCheckedInToday = healingJourney.firstCheckin.date === today;
      
      if (!hasCheckedInToday) {
        setShowCheckIn(true);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to initialize gamification systems:', err);
      setError('Failed to load your growth journey. Please try again.');
      setLoading(false);
    }
  };

  // Handle daily check-in completion
  const handleCheckInComplete = async (checkIn: DailyCheckIn) => {
    try {
      // Process the daily activity
      const activityResult = await DuolingoStyleHealingEngine.processDailyActivity(
        userId,
        'check_in',
        {
          emotionalWeather: checkIn.emotionalWeather,
          energyLevel: checkIn.energyLevel,
          depth: 'moderate',
          authenticity: 'genuine',
          selfCompassion: 'practiced'
        },
        {
          streak: gamificationState.streak,
          skills: gamificationState.skills,
          path: gamificationState.learningPath
        }
      );

      // Update state with results
      setGamificationState(prev => ({
        ...prev,
        streak: activityResult.updatedStreak,
        skills: activityResult.updatedSkills,
        learningPath: activityResult.updatedPath,
        pendingCelebrations: [...prev.pendingCelebrations, ...activityResult.celebrations],
        lastCheckIn: checkIn
      }));

      setShowCheckIn(false);

      // Notify parent component of data update
      if (onDataUpdate) {
        onDataUpdate({
          streak: activityResult.updatedStreak,
          skills: activityResult.updatedSkills,
          path: activityResult.updatedPath,
          celebrations: activityResult.celebrations,
          xpGained: activityResult.xpGained
        });
      }
    } catch (err) {
      console.error('Failed to process check-in:', err);
      setError('Failed to save your check-in. Please try again.');
    }
  };

  // Handle skill selection
  const handleSkillSelect = async (skill: EmotionalSkill) => {
    // Could open detailed skill view or start practice
    console.log('Selected skill:', skill.name);
  };

  // Handle exercise start
  const handleExerciseStart = async (exercise: any) => {
    try {
      // Process exercise activity
      const activityResult = await DuolingoStyleHealingEngine.processDailyActivity(
        userId,
        'skill_practice',
        {
          skillId: exercise.skillId,
          exerciseId: exercise.id,
          depth: 'moderate',
          authenticity: 'genuine'
        },
        {
          streak: gamificationState.streak,
          skills: gamificationState.skills,
          path: gamificationState.learningPath
        }
      );

      // Update state
      setGamificationState(prev => ({
        ...prev,
        streak: activityResult.updatedStreak,
        skills: activityResult.updatedSkills,
        learningPath: activityResult.updatedPath,
        pendingCelebrations: [...prev.pendingCelebrations, ...activityResult.celebrations]
      }));

      // Notify parent
      if (onDataUpdate) {
        onDataUpdate(activityResult);
      }
    } catch (err) {
      console.error('Failed to process exercise:', err);
      setError('Failed to save your practice. Please try again.');
    }
  };

  // Handle celebration completion
  const handleCelebrationComplete = (celebrationId: string) => {
    setGamificationState(prev => ({
      ...prev,
      pendingCelebrations: prev.pendingCelebrations.filter(c => c.id !== celebrationId)
    }));
  };

  // Handle celebration sharing
  const handleCelebrationShare = (celebration: CelebrationEvent) => {
    // Could implement anonymous sharing to community
    console.log('Sharing celebration:', celebration.title);
  };

  // Crisis mode styles
  const crisisStyles = isCrisisMode ? {
    filter: 'contrast(1.2) brightness(1.1)',
    fontSize: '18px',
  } : {};

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: isCrisisMode ? '8px' : '12px',
        padding: isCrisisMode ? '3rem' : '2rem',
        border: isCrisisMode ? '3px solid #a4b792' : '1px solid #e5e5e5',
        textAlign: 'center',
        ...crisisStyles
      }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: isCrisisMode ? '4rem' : '3rem', marginBottom: '1rem' }}
        >
          🌱
        </motion.div>
        <h3 style={{
          margin: '0 0 1rem 0',
          color: '#2e2e2e',
          fontSize: isCrisisMode ? '1.5rem' : '1.3rem',
          fontWeight: isCrisisMode ? '700' : '600'
        }}>
          {isCrisisMode ? 'Setting Up Your Journey' : 'Initializing Your Growth Journey'}
        </h3>
        <p style={{
          color: '#666',
          fontSize: isCrisisMode ? '1.1rem' : '1rem',
          margin: 0
        }}>
          {isCrisisMode ? 'Creating your personalized healing path...' : 'Creating your personalized emotional wellness experience...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: isCrisisMode ? '8px' : '12px',
        padding: isCrisisMode ? '2.5rem' : '2rem',
        border: isCrisisMode ? '3px solid #ef4444' : '2px solid #ef4444',
        textAlign: 'center',
        ...crisisStyles
      }}>
        <div style={{ fontSize: isCrisisMode ? '3rem' : '2rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{
          margin: '0 0 1rem 0',
          color: '#ef4444',
          fontSize: isCrisisMode ? '1.4rem' : '1.2rem',
          fontWeight: isCrisisMode ? '700' : '600'
        }}>
          Something went wrong
        </h3>
        <p style={{
          color: '#666',
          fontSize: isCrisisMode ? '1rem' : '0.9rem',
          margin: '0 0 1.5rem 0'
        }}>
          {error}
        </p>
        <button
          onClick={() => handleTouchSafeAction(initializeGamificationSystems)}
          style={{
            backgroundColor: '#a4b792',
            color: 'white',
            border: 'none',
            borderRadius: isCrisisMode ? '6px' : '8px',
            padding: isCrisisMode ? '1rem 2rem' : '0.75rem 1.5rem',
            fontSize: isCrisisMode ? '1rem' : '0.9rem',
            fontWeight: isCrisisMode ? '700' : '600',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: isCrisisMode ? '8px' : '12px',
        padding: isCrisisMode ? '1.5rem' : '1rem',
        border: isCrisisMode ? '3px solid #a4b792' : '1px solid #e5e5e5',
        ...crisisStyles
      }}>
        <div style={{
          display: 'flex',
          gap: isCrisisMode ? '1rem' : '0.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'dashboard', label: 'Overview', icon: '🏠' },
            { id: 'skills', label: 'Skills', icon: '🌳' },
            { id: 'check_in', label: 'Check-In', icon: '💚' },
            { id: 'progress', label: 'Progress', icon: '📈' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => handleTouchSafeAction(() => {
                if (view.id === 'check_in') {
                  setShowCheckIn(true);
                } else {
                  setGamificationState(prev => ({ ...prev, currentView: view.id as any }));
                }
              })}
              style={{
                backgroundColor: gamificationState.currentView === view.id ? '#a4b792' : 'transparent',
                color: gamificationState.currentView === view.id ? 'white' : '#666',
                border: `2px solid ${gamificationState.currentView === view.id ? '#a4b792' : '#e5e5e5'}`,
                borderRadius: isCrisisMode ? '8px' : '10px',
                padding: isCrisisMode ? '1rem 1.5rem' : '0.75rem 1rem',
                fontSize: isCrisisMode ? '1rem' : '0.9rem',
                fontWeight: isCrisisMode ? '700' : '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: isCrisisMode ? '50px' : '40px'
              }}
            >
              <span style={{ fontSize: isCrisisMode ? '1.2rem' : '1rem' }}>{view.icon}</span>
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={gamificationState.currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {gamificationState.currentView === 'dashboard' && (
            <DashboardView
              streak={gamificationState.streak}
              skills={gamificationState.skills}
              path={gamificationState.learningPath}
              lastCheckIn={gamificationState.lastCheckIn}
              onCheckInStart={() => setShowCheckIn(true)}
              isCrisisMode={isCrisisMode}
              userPreferences={userPreferences}
            />
          )}

          {gamificationState.currentView === 'skills' && (
            <EmotionalSkillTree
              skills={gamificationState.skills}
              onSkillSelect={handleSkillSelect}
              onExerciseStart={handleExerciseStart}
              userPreferences={userPreferences}
            />
          )}

          {gamificationState.currentView === 'progress' && (
            <ProgressView
              streak={gamificationState.streak}
              skills={gamificationState.skills}
              path={gamificationState.learningPath}
              isCrisisMode={isCrisisMode}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Daily Check-In Modal */}
      <AnimatePresence>
        {showCheckIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              zIndex: 1000
            }}
            onClick={() => setShowCheckIn(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ maxWidth: '600px', width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <DailyEmotionalCheckIn
                onCheckInComplete={handleCheckInComplete}
                userPreferences={userPreferences}
                currentStreak={gamificationState.streak.currentStreak}
                lastCheckIn={gamificationState.lastCheckIn || undefined}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration System */}
      <CelebrationSystem
        celebrations={gamificationState.pendingCelebrations}
        userPreferences={{
          celebrationStyle: userPreferences.celebrationStyle,
          animationsEnabled: !isLowBattery,
          soundEnabled: false
        }}
        onCelebrationComplete={handleCelebrationComplete}
        onCelebrationShare={handleCelebrationShare}
      />

      {/* Offline indicator */}
      {isOffline && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(245, 158, 11, 0.9)',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: isCrisisMode ? '1rem' : '0.9rem',
          fontWeight: isCrisisMode ? '600' : '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 999
        }}>
          📡 <span>Your progress is saved offline and will sync when reconnected</span>
        </div>
      )}
    </div>
  );
}

// Dashboard View Component
function DashboardView({ 
  streak, 
  skills, 
  path, 
  lastCheckIn, 
  onCheckInStart, 
  isCrisisMode, 
  userPreferences 
}: {
  streak: EmotionalStreak;
  skills: EmotionalSkill[];
  path: LearningPath;
  lastCheckIn: DailyCheckIn | null;
  onCheckInStart: () => void;
  isCrisisMode: boolean;
  userPreferences: any;
}) {
  const averageSkillLevel = skills.length > 0 ? 
    skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length : 0;

  const hasCheckedInToday = lastCheckIn && 
    lastCheckIn.date === new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Streak Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: isCrisisMode ? '8px' : '12px',
        padding: isCrisisMode ? '2rem' : '1.5rem',
        border: isCrisisMode ? '3px solid #a4b792' : '1px solid #e5e5e5'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: isCrisisMode ? '2.5rem' : '2rem' }}>🔥</span>
          <div>
            <h3 style={{
              margin: 0,
              color: '#2e2e2e',
              fontSize: isCrisisMode ? '1.5rem' : '1.3rem',
              fontWeight: isCrisisMode ? '700' : '600'
            }}>
              {streak.currentStreak} Day Streak
            </h3>
            <p style={{
              margin: '0.25rem 0 0 0',
              color: '#666',
              fontSize: isCrisisMode ? '1rem' : '0.9rem'
            }}>
              Longest: {streak.longestStreak} days
            </p>
          </div>
        </div>
        
        {!hasCheckedInToday && (
          <button
            onClick={onCheckInStart}
            style={{
              backgroundColor: '#a4b792',
              color: 'white',
              border: 'none',
              borderRadius: isCrisisMode ? '6px' : '8px',
              padding: isCrisisMode ? '1rem 1.5rem' : '0.75rem 1.25rem',
              fontSize: isCrisisMode ? '1rem' : '0.9rem',
              fontWeight: isCrisisMode ? '700' : '600',
              cursor: 'pointer'
            }}
          >
            Complete Today's Check-In
          </button>
        )}
        
        {hasCheckedInToday && (
          <div style={{
            backgroundColor: 'rgba(168, 183, 150, 0.1)',
            border: '1px solid #a4b792',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#667a5c',
            fontSize: isCrisisMode ? '1rem' : '0.9rem'
          }}>
            ✅ You've checked in today! Great work showing up for yourself.
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isCrisisMode ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: isCrisisMode ? '8px' : '12px',
          padding: isCrisisMode ? '1.5rem' : '1.25rem',
          border: isCrisisMode ? '2px solid #e5e5e5' : '1px solid #e5e5e5',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: isCrisisMode ? '2rem' : '1.5rem', marginBottom: '0.5rem' }}>
            🧠
          </div>
          <div style={{
            fontSize: isCrisisMode ? '1.5rem' : '1.3rem',
            fontWeight: 'bold',
            color: '#2e2e2e',
            marginBottom: '0.25rem'
          }}>
            {averageSkillLevel.toFixed(1)}
          </div>
          <div style={{
            fontSize: isCrisisMode ? '1rem' : '0.9rem',
            color: '#666'
          }}>
            Avg Skill Level
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: isCrisisMode ? '8px' : '12px',
          padding: isCrisisMode ? '1.5rem' : '1.25rem',
          border: isCrisisMode ? '2px solid #e5e5e5' : '1px solid #e5e5e5',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: isCrisisMode ? '2rem' : '1.5rem', marginBottom: '0.5rem' }}>
            🎯
          </div>
          <div style={{
            fontSize: isCrisisMode ? '1.5rem' : '1.3rem',
            fontWeight: 'bold',
            color: '#2e2e2e',
            marginBottom: '0.25rem'
          }}>
            {path.currentPhase}
          </div>
          <div style={{
            fontSize: isCrisisMode ? '1rem' : '0.9rem',
            color: '#666'
          }}>
            Current Phase
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: isCrisisMode ? '8px' : '12px',
          padding: isCrisisMode ? '1.5rem' : '1.25rem',
          border: isCrisisMode ? '2px solid #e5e5e5' : '1px solid #e5e5e5',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: isCrisisMode ? '2rem' : '1.5rem', marginBottom: '0.5rem' }}>
            💚
          </div>
          <div style={{
            fontSize: isCrisisMode ? '1.5rem' : '1.3rem',
            fontWeight: 'bold',
            color: '#2e2e2e',
            marginBottom: '0.25rem'
          }}>
            {path.progressAnalytics.joyScore}%
          </div>
          <div style={{
            fontSize: isCrisisMode ? '1rem' : '0.9rem',
            color: '#666'
          }}>
            Joy Score
          </div>
        </div>
      </div>
    </div>
  );
}

// Progress View Component
function ProgressView({ 
  streak, 
  skills, 
  path, 
  isCrisisMode 
}: {
  streak: EmotionalStreak;
  skills: EmotionalSkill[];
  path: LearningPath;
  isCrisisMode: boolean;
}) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: isCrisisMode ? '8px' : '12px',
      padding: isCrisisMode ? '2rem' : '1.5rem',
      border: isCrisisMode ? '3px solid #a4b792' : '1px solid #e5e5e5'
    }}>
      <h3 style={{
        margin: '0 0 1.5rem 0',
        color: '#2e2e2e',
        fontSize: isCrisisMode ? '1.4rem' : '1.2rem',
        fontWeight: isCrisisMode ? '700' : '600'
      }}>
        Your Growth Journey
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#667a5c' }}>Consistency</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              backgroundColor: '#e5e5e5',
              borderRadius: '6px',
              height: '8px',
              flex: 1
            }}>
              <div style={{
                backgroundColor: '#a4b792',
                height: '100%',
                width: `${Math.min(100, (streak.currentStreak / 30) * 100)}%`,
                borderRadius: '6px'
              }} />
            </div>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              {streak.currentStreak}/30 days
            </span>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#667a5c' }}>Skills Developed</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.5rem'
          }}>
            {skills.slice(0, 6).map(skill => (
              <div key={skill.id} style={{
                backgroundColor: skill.level > 0 ? 'rgba(168, 183, 150, 0.1)' : '#f9f9f9',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                padding: '0.5rem',
                fontSize: '0.8rem'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  {skill.name}
                </div>
                <div style={{ color: '#666' }}>
                  Level {skill.level}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Create Duolingo-style streak system with grace-based mechanics", "status": "completed", "activeForm": "Creating Duolingo-style streak system"}, {"content": "Implement emotional skill tree system with progressive unlocking", "status": "completed", "activeForm": "Implementing emotional skill tree system"}, {"content": "Build adaptive learning path system that personalizes based on user progress", "status": "completed", "activeForm": "Building adaptive learning path system"}, {"content": "Create celebration mechanics with gentle animations and milestone recognition", "status": "completed", "activeForm": "Creating celebration mechanics"}, {"content": "Implement daily emotional check-ins integrated with Khepera", "status": "completed", "activeForm": "Implementing daily emotional check-ins"}, {"content": "Build engagement features with gentle nudges and spaced repetition", "status": "completed", "activeForm": "Building engagement features"}]