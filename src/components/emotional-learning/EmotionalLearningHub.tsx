/**
 * EMOTIONAL LEARNING HUB
 * "Duolingo for Emotions" - Main Interface Component
 * 
 * Revolutionary emotional learning interface that integrates seamlessly with
 * ALCHM's existing design system while providing engaging, trauma-informed
 * emotional intelligence education.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';
import { useHealingGamification } from '@/hooks/useHealingGamification';
import ProgressVisualization from './ProgressVisualization';
import type { 
  EmotionalSkillTree,
  EmotionalLesson,
  EmotionalCompetency,
  EmotionalLearningProgress
} from '@/lib/emotional-learning/emotional-skill-tree';
import type { HealingBadge } from '@/lib/emotional-learning/badge-ecosystem';
import type { LearningRecommendation } from '@/lib/emotional-learning/adaptive-learning-engine';

// Main Hub Interface
export interface EmotionalLearningHubProps {
  className?: string;
}

export const EmotionalLearningHub: React.FC<EmotionalLearningHubProps> = ({
  className = ''
}) => {
  const { user } = useAuth();
  const { state: gamificationState } = useHealingGamification();
  
  // Local state
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'progress' | 'community'>('learn');
  const [currentLesson, setCurrentLesson] = useState<EmotionalLesson | null>(null);
  const [learningProgress, setLearningProgress] = useState<EmotionalLearningProgress | null>(null);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [badges, setBadges] = useState<HealingBadge[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<any>(null);

  // Load user's emotional learning data
  useEffect(() => {
    if (user?.uid) {
      loadEmotionalLearningData();
    }
  }, [user?.uid]);

  const loadEmotionalLearningData = async () => {
    // This would load from Firebase
    // For now, using mock data structure
    const mockProgress: EmotionalLearningProgress = {
      userId: user?.uid || '',
      lastUpdated: new Date() as any,
      totalLessonsCompleted: 12,
      totalSkillsLearned: 8,
      currentStreak: 5,
      longestStreak: 12,
      averageSessionTime: 4.5,
      treeProgress: {
        emotional_awareness: {
          currentLevel: 3,
          lessonsCompleted: 5,
          totalLessons: 10,
          masteryScore: 75,
          lastPracticed: new Date() as any,
          strugglingAreas: [],
          strengthAreas: ['emotion_identification', 'body_awareness']
        },
        self_regulation: {
          currentLevel: 2,
          lessonsCompleted: 3,
          totalLessons: 12,
          masteryScore: 45,
          lastPracticed: new Date() as any,
          strugglingAreas: ['impulse_control'],
          strengthAreas: ['breathing_techniques']
        },
        social_awareness: {
          currentLevel: 1,
          lessonsCompleted: 2,
          totalLessons: 8,
          masteryScore: 30,
          lastPracticed: new Date() as any,
          strugglingAreas: ['reading_others'],
          strengthAreas: []
        },
        relationship_skills: {
          currentLevel: 2,
          lessonsCompleted: 2,
          totalLessons: 15,
          masteryScore: 25,
          lastPracticed: new Date() as any,
          strugglingAreas: ['boundary_setting'],
          strengthAreas: ['empathetic_listening']
        },
        responsible_decision_making: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 10,
          masteryScore: 10,
          lastPracticed: new Date() as any,
          strugglingAreas: ['values_alignment'],
          strengthAreas: []
        },
        trauma_healing: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 20,
          masteryScore: 15,
          lastPracticed: new Date() as any,
          strugglingAreas: ['trauma_processing'],
          strengthAreas: []
        },
        boundary_setting: {
          currentLevel: 1,
          lessonsCompleted: 0,
          totalLessons: 12,
          masteryScore: 20,
          lastPracticed: new Date() as any,
          strugglingAreas: ['saying_no'],
          strengthAreas: []
        },
        self_compassion: {
          currentLevel: 2,
          lessonsCompleted: 0,
          totalLessons: 14,
          masteryScore: 35,
          lastPracticed: new Date() as any,
          strugglingAreas: ['self_forgiveness'],
          strengthAreas: ['self_awareness']
        }
      },
      learningStyle: {
        prefersVisual: true,
        prefersAudio: false,
        prefersKinesthetic: true,
        prefersReflection: true,
        needsMorePractice: false,
        respondsToCelebration: true
      },
      graceTokensUsed: 2,
      healingPausesRequested: 1,
      selfCompassionMoments: 15,
      boundaryPractices: 8,
      emotionalBreakthroughs: 3,
      traumaHealingProgress: 25,
      emotionalTriggers: ['overwhelm', 'criticism'],
      copingPreferences: ['breathing', 'journaling', 'movement'],
      supportNeeds: ['encouragement', 'gentle_guidance'],
      celebrationStyle: 'warm',
      skillsAppliedInLife: {}
    };
    
    setLearningProgress(mockProgress);
  };

  // Main tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'learn':
        return <LearningTab progress={learningProgress} onLessonSelect={setCurrentLesson} />;
      case 'practice':
        return <PracticeTab progress={learningProgress} />;
      case 'progress':
        return learningProgress ? (
          <ProgressVisualization 
            progress={learningProgress}
            badges={badges}
            interactive={true}
            showDetails={true}
          />
        ) : <div>Loading progress...</div>;
      case 'community':
        return <CommunityTab userId={user?.uid || ''} />;
      default:
        return <LearningTab progress={learningProgress} onLessonSelect={setCurrentLesson} />;
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto space-y-6 ${className}`}>
      {/* Header Section */}
      <Card 
        variant="sanctuary" 
        padding="large"
        className="border border-sage-200/40"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-[31px] leading-[1.25] tracking-[-0.02em] font-light text-charcoal-800 mb-3">
              Emotional Learning Hub
            </h1>
            <p className="text-[16px] leading-[1.6] tracking-[0] font-normal text-charcoal-600 max-w-prose">
              Your personalized journey to emotional intelligence and healing
            </p>
          </div>
          
          {/* Quick Stats */}
          {learningProgress && (
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-[25px] leading-[1.3] tracking-[-0.015em] font-normal text-sage-500 mb-1">
                  {learningProgress.currentStreak}
                </div>
                <div className="text-[12px] leading-[1.3] tracking-[0.05em] font-medium uppercase text-charcoal-600">
                  Day Streak
                </div>
              </div>
              <div className="text-center">
                <div className="text-[25px] leading-[1.3] tracking-[-0.015em] font-normal text-sage-500 mb-1">
                  {learningProgress.totalSkillsLearned}
                </div>
                <div className="text-[12px] leading-[1.3] tracking-[0.05em] font-medium uppercase text-charcoal-600">
                  Skills Learned
                </div>
              </div>
              <div className="text-center">
                <div className="text-[25px] leading-[1.3] tracking-[-0.015em] font-normal text-sage-500 mb-1">
                  {badges.length}
                </div>
                <div className="text-[12px] leading-[1.3] tracking-[0.05em] font-medium uppercase text-charcoal-600">
                  Badges Earned
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Grace Token Display */}
      {gamificationState.graceTokens && (
        <GraceTokenDisplay 
          graceTokens={gamificationState.graceTokens}
          className="mb-4"
        />
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-sage-50 rounded-2xl p-1 shadow-whisper">
        {(['learn', 'practice', 'progress', 'community'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn([
              'flex-1 py-3 px-6 rounded-xl',
              'text-[14px] leading-[1.3] tracking-[0.015em] font-medium',
              'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/40',
              activeTab === tab
                ? 'bg-sanctuary text-charcoal-800 shadow-gentle transform scale-[1.02]'
                : 'text-charcoal-600 hover:text-charcoal-800 hover:bg-sanctuary/50'
            ])}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      {/* Lesson Interface Modal */}
      <AnimatePresence>
        {currentLesson && (
          <LessonInterface
            lesson={currentLesson}
            onComplete={() => setCurrentLesson(null)}
            onClose={() => setCurrentLesson(null)}
          />
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && celebrationData && (
          <CelebrationModal
            data={celebrationData}
            onClose={() => {
              setShowCelebration(false);
              setCelebrationData(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Grace Token Display Component
const GraceTokenDisplay: React.FC<{
  graceTokens: any;
  className?: string;
}> = ({ graceTokens, className = '' }) => {
  const [showGraceExplanation, setShowGraceExplanation] = useState(false);

  return (
    <Card className={`p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-8 h-8 rounded-full border-2 ${
                  i < graceTokens.available
                    ? 'bg-purple-400 border-purple-500'
                    : 'bg-gray-200 border-gray-300'
                }`}
                animate={{
                  scale: i < graceTokens.available ? [1, 1.1, 1] : 1,
                  rotate: i < graceTokens.available ? [0, 5, -5, 0] : 0
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
              </motion.div>
            ))}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Grace Tokens</h3>
            <p className="text-xs text-gray-600">
              {graceTokens.available} available • Renews Mondays
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowGraceExplanation(true)}
          className="text-xs py-1 px-3 bg-purple-100 text-purple-700 hover:bg-purple-200"
        >
          What are these?
        </Button>
      </div>
      
      {/* Grace Explanation Modal */}
      <AnimatePresence>
        {showGraceExplanation && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGraceExplanation(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Grace Tokens 💜
              </h3>
              <p className="text-gray-600 mb-4">
                Grace tokens prevent streak-breaking shame. Use them when life gets overwhelming 
                and you miss a learning session. They're a reminder that healing isn't about 
                perfect consistency - it's about self-compassion.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                • You get 2 tokens every Monday<br />
                • Use them to maintain your streak<br />
                • They're acts of self-kindness, not failures
              </div>
              <Button
                onClick={() => setShowGraceExplanation(false)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                Beautiful, I understand
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// Learning Tab Component
const LearningTab: React.FC<{
  progress: EmotionalLearningProgress | null;
  onLessonSelect: (lesson: EmotionalLesson) => void;
}> = ({ progress, onLessonSelect }) => {
  if (!progress) {
    return <div className="flex items-center justify-center h-64">Loading your learning journey...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Recommended Next Lesson */}
      <Card 
        variant="gentle" 
        padding="large"
        className="bg-gradient-to-br from-sage-50/60 to-sanctuary-50"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-[16px] leading-[1.3] tracking-[0.01em] font-medium text-sage-600 mb-3">
              Recommended for You
            </h3>
            <h4 className="text-[25px] leading-[1.3] tracking-[-0.015em] font-normal text-charcoal-800 mb-4">
              The Sacred Pause - Your Superpower
            </h4>
            <p className="text-[16px] leading-[1.6] tracking-[0] font-normal text-charcoal-600 mb-6 max-w-prose">
              Master the space between trigger and response where all your power lives. 
              Perfect for when you're feeling reactive or overwhelmed.
            </p>
            <div className="flex items-center space-x-6 text-[14px] leading-[1.3] tracking-[0.015em] font-medium text-charcoal-600 mb-6">
              <span className="flex items-center gap-2">⏱️ 5 minutes</span>
              <span className="flex items-center gap-2">🎯 Self-Regulation</span>
              <span className="flex items-center gap-2">🌱 Foundation Level</span>
            </div>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={() => {
              // Mock lesson data - would come from actual lesson system
              const mockLesson: EmotionalLesson = {
                id: 'sacred_pause_intro',
                skillTreeId: 'self_regulation',
                level: 1,
                order: 1,
                name: 'The Sacred Pause - Your Superpower',
                description: 'Master the space between trigger and response where all your power lives',
                estimatedTime: 5,
                objectives: ['Learn the STOP technique', 'Practice the 3-breath reset', 'Create your personal pause ritual'],
                introduction: {
                  title: 'The Power Lives in the Pause',
                  explanation: 'Between every trigger and response is a sacred space. In this space lives your power to choose.',
                  realWorldContext: 'When someone says something that usually makes you angry, you can pause, breathe, and respond with wisdom.',
                  whyItMatters: 'The pause is where healing happens. It\'s where you break cycles, build trust, and become who you want to be.'
                },
                exercises: [],
                reflection: {
                  prompt: 'When in your life could the sacred pause be most helpful?',
                  guidingQuestions: ['What situations usually trigger quick reactions?', 'How did it feel to practice slowing down?'],
                  optional: false
                },
                skillsLearned: ['Impulse control', 'Mindful responding', 'Self-regulation'],
                realWorldApplications: ['Use STOP before responding to difficult emails', 'Pause during conflicts'],
                nextSteps: ['Practice STOP once daily', 'Notice personal trigger patterns'],
                contentWarnings: [],
                gentleReentry: true,
                pauseReminders: true,
                selfCompassionCheck: true,
                completionCriteria: {
                  exercisesRequired: 1,
                  reflectionRequired: true,
                  practiceRequired: true
                }
              };
              onLessonSelect(mockLesson);
            }}
          >
            Start Learning
          </Button>
        </div>
      </Card>

      {/* Skill Trees Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(progress.treeProgress).map(([competency, treeData]) => (
          <SkillTreeCard
            key={competency}
            competency={competency as EmotionalCompetency}
            progress={treeData}
            onExplore={() => console.log('Explore tree:', competency)}
          />
        ))}
      </div>
    </div>
  );
};

// Skill Tree Card Component
const SkillTreeCard: React.FC<{
  competency: EmotionalCompetency;
  progress: any;
  onExplore: () => void;
}> = ({ competency, progress, onExplore }) => {
  const skillNames = {
    emotional_awareness: 'Feeling Translator',
    self_regulation: 'Pause Master',
    social_awareness: 'Body Wisdom',
    relationship_skills: 'Boundary Guardian',
    responsible_decision_making: 'Wisdom Keeper',
    trauma_healing: 'Phoenix Rising',
    boundary_setting: 'Gentle Warrior',
    self_compassion: 'Storm Surfer'
  };

  const skillColors = {
    emotional_awareness: 'from-green-100 to-green-200',
    self_regulation: 'from-blue-100 to-blue-200',
    social_awareness: 'from-pink-100 to-pink-200',
    relationship_skills: 'from-purple-100 to-purple-200',
    responsible_decision_making: 'from-yellow-100 to-yellow-200',
    trauma_healing: 'from-orange-100 to-orange-200',
    boundary_setting: 'from-teal-100 to-teal-200',
    self_compassion: 'from-indigo-100 to-indigo-200'
  };

  const progressPercentage = (progress.lessonsCompleted / progress.totalLessons) * 100;

  return (
    <Card 
      variant="gentle" 
      padding="medium"
      interactive
      className={cn([
        `bg-gradient-to-br ${skillColors[competency]}`,
        'border-sage-200/30',
        'cursor-pointer'
      ])}
    >
      <div onClick={onExplore} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] leading-[1.4] tracking-[-0.005em] font-medium text-charcoal-800">
            {skillNames[competency]}
          </h3>
          <div className="text-2xl">
            {getSkillIcon(competency)}
          </div>
        </div>
        
        <p className="text-[14px] leading-[1.55] tracking-[0.005em] font-normal text-charcoal-600">
          Level {progress.currentLevel} • {progress.lessonsCompleted}/{progress.totalLessons} lessons
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-sanctuary-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-sage-400 to-sage-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
        
        <div className="text-[12px] leading-[1.3] tracking-[0.05em] font-medium uppercase text-charcoal-600">
          Mastery: {progress.masteryScore}%
        </div>
      </div>
    </Card>
  );
};

// Practice Tab Component  
const PracticeTab: React.FC<{
  progress: EmotionalLearningProgress | null;
}> = ({ progress }) => {
  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="large">
        <h3 className="text-[20px] leading-[1.35] tracking-[-0.01em] font-normal text-charcoal-800 mb-6">
          Quick Practice Sessions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PracticeCard
            title="2-Minute Emotion Check-In"
            description="Practice identifying and naming your current emotional state"
            duration={2}
            icon="🔍"
            difficulty="Foundation"
          />
          <PracticeCard
            title="Box Breathing Reset"
            description="Use breathing to regulate your nervous system"
            duration={3}
            icon="🌬️"
            difficulty="Foundation"
          />
          <PracticeCard
            title="Boundary Scenario Practice"
            description="Practice setting boundaries in different situations"
            duration={5}
            icon="🛡️"
            difficulty="Practicing"
          />
          <PracticeCard
            title="Self-Compassion Moment"
            description="Transform self-criticism into self-kindness"
            duration={4}
            icon="💚"
            difficulty="Developing"
          />
        </div>
      </Card>
    </div>
  );
};

const PracticeCard: React.FC<{
  title: string;
  description: string;
  duration: number;
  icon: string;
  difficulty: string;
}> = ({ title, description, duration, icon, difficulty }) => {
  return (
    <Card 
      variant="gentle" 
      padding="medium"
      interactive
      className="cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <h4 className="text-[18px] leading-[1.4] tracking-[-0.005em] font-medium text-charcoal-800 mb-2">
            {title}
          </h4>
          <p className="text-[14px] leading-[1.55] tracking-[0.005em] font-normal text-charcoal-600 mb-4">
            {description}
          </p>
          <div className="flex items-center justify-between text-[12px] leading-[1.3] tracking-[0.05em] font-medium uppercase text-charcoal-600">
            <span>⏱️ {duration} min</span>
            <span className="px-2 py-1 bg-sage-100 text-sage-600 rounded-md">
              {difficulty}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Community Tab Component
const CommunityTab: React.FC<{
  userId: string;
}> = ({ userId }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Healing Together 🌸
        </h3>
        <p className="text-gray-600 mb-4">
          Connect with others on similar journeys through anonymous, supportive communities
          that celebrate growth without comparison.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CommunityCard
            title="Boundaries SZN"
            description="A supportive space for practicing boundary-setting together"
            participants={156}
            type="Healing Challenge"
            status="Active"
          />
          <CommunityCard
            title="Self-Compassion Circle"
            description="Share wisdom about treating yourself with kindness"
            participants={89}
            type="Wisdom Circle"
            status="Open"
          />
        </div>
      </Card>
    </div>
  );
};

const CommunityCard: React.FC<{
  title: string;
  description: string;
  participants: number;
  type: string;
  status: string;
}> = ({ title, description, participants, type, status }) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800">{title}</h4>
          <span className={`text-xs px-2 py-1 rounded ${
            status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {status}
          </span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{participants} participants</span>
          <span>{type}</span>
        </div>
      </div>
    </Card>
  );
};

// Helper functions
const getSkillIcon = (competency: EmotionalCompetency): string => {
  const icons = {
    emotional_awareness: '🔍',
    self_regulation: '⏸️',
    social_awareness: '👁️',
    relationship_skills: '🤝',
    responsible_decision_making: '⚖️',
    trauma_healing: '🔥',
    boundary_setting: '🛡️',
    self_compassion: '💚'
  };
  return icons[competency] || '⭐';
};

// Placeholder components for lesson interface and celebration
const LessonInterface: React.FC<{
  lesson: EmotionalLesson;
  onComplete: () => void;
  onClose: () => void;
}> = ({ lesson, onComplete, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">{lesson.name}</h2>
          <Button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">{lesson.introduction.title}</h3>
            <p className="text-gray-600">{lesson.introduction.explanation}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Why This Matters</h4>
            <p className="text-gray-600">{lesson.introduction.whyItMatters}</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Real-World Application</h4>
            <p className="text-gray-600">{lesson.introduction.realWorldContext}</p>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              Maybe Later
            </Button>
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white">
              Start Lesson
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CelebrationModal: React.FC<{
  data: any;
  onClose: () => void;
}> = ({ data, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Beautiful Work!
        </h3>
        <p className="text-gray-600 mb-6">
          You've taken another step in your emotional learning journey. 
          Every lesson builds your capacity for wisdom and healing.
        </p>
        <Button onClick={onClose} className="w-full bg-green-500 hover:bg-green-600 text-white">
          Continue Growing
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EmotionalLearningHub;