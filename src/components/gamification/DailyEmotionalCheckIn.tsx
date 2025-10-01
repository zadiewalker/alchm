'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyCheckIn, DuolingoStyleHealingEngine } from '@/lib/gamification/duolingo-style-healing-engine';
import { useMobileOptimization } from '../MobileOptimizationProvider';
import { useAuth } from '@/lib/useAuth';

interface DailyEmotionalCheckInProps {
  onCheckInComplete: (checkIn: DailyCheckIn) => void;
  userPreferences?: {
    communicationStyle: 'supportive_friend' | 'wise_mentor' | 'cheerful_coach';
    traumaInformed: boolean;
    culturalBackground?: string[];
  };
  currentStreak?: number;
  lastCheckIn?: DailyCheckIn;
}

interface CheckInStep {
  id: string;
  title: string;
  description: string;
  component: 'emotional_weather' | 'energy_level' | 'needs_gratitude' | 'challenges_growth' | 'khepera_conversation';
  isOptional: boolean;
}

interface KheperaInsight {
  type: 'pattern_recognition' | 'gentle_encouragement' | 'skill_suggestion' | 'self_compassion_reminder';
  message: string;
  reasoning: string;
  nextSteps: string[];
}

const EMOTIONAL_WEATHER_OPTIONS = [
  { id: 'sunny', emoji: '☀️', label: 'Sunny', description: 'Feeling bright and optimistic' },
  { id: 'partly_cloudy', emoji: '⛅', label: 'Partly Cloudy', description: 'Mixed feelings, some ups and downs' },
  { id: 'rainy', emoji: '🌧️', label: 'Rainy', description: 'Feeling sad, heavy, or melancholy' },
  { id: 'stormy', emoji: '⛈️', label: 'Stormy', description: 'Intense emotions, feeling overwhelmed' },
  { id: 'rainbow_after_storm', emoji: '🌈', label: 'Rainbow After Storm', description: 'Coming through difficulty, finding hope' }
];

const ENERGY_LEVELS = [
  { level: 1, emoji: '🔋', label: 'Very Low', description: 'Exhausted, need rest' },
  { level: 2, emoji: '🔋', label: 'Low', description: 'Tired, minimal energy' },
  { level: 3, emoji: '🔋', label: 'Moderate', description: 'Steady, manageable' },
  { level: 4, emoji: '🔋', label: 'Good', description: 'Energized, ready for activities' },
  { level: 5, emoji: '🔋', label: 'High', description: 'Vibrant, lots of energy' }
];

const COMMON_NEEDS = [
  { id: 'rest', emoji: '😴', label: 'Rest & Sleep' },
  { id: 'connection', emoji: '🤝', label: 'Connection' },
  { id: 'creativity', emoji: '🎨', label: 'Creative Expression' },
  { id: 'movement', emoji: '🚶', label: 'Movement' },
  { id: 'nature', emoji: '🌿', label: 'Time in Nature' },
  { id: 'quiet', emoji: '🤫', label: 'Quiet Time' },
  { id: 'support', emoji: '💙', label: 'Emotional Support' },
  { id: 'accomplishment', emoji: '✅', label: 'Sense of Achievement' },
  { id: 'fun', emoji: '😄', label: 'Fun & Play' },
  { id: 'learning', emoji: '📚', label: 'Learning & Growth' }
];

const KHEPERA_PERSONALITIES = {
  supportive_friend: {
    greeting: "Hey there! I'm so glad you're here. How's your heart feeling today?",
    encouragement: "You're doing such important work by checking in with yourself.",
    insights: "I notice you're developing some really beautiful patterns of self-awareness.",
    nextSteps: "What feels most nourishing for you right now?"
  },
  wise_mentor: {
    greeting: "Welcome to this sacred moment of self-reflection. What wisdom is your inner self sharing today?",
    encouragement: "Your willingness to look within is a profound act of courage and love.",
    insights: "I see the threads of growth weaving through your experiences.",
    nextSteps: "What would serve your highest healing in this moment?"
  },
  cheerful_coach: {
    greeting: "Hello, amazing human! Ready to dive into how you're doing today?",
    encouragement: "Look at you showing up for yourself! That's what I love to see!",
    insights: "I'm seeing some fantastic patterns in your emotional wellness journey!",
    nextSteps: "What's going to make today feel like a win for you?"
  }
};

export default function DailyEmotionalCheckIn({
  onCheckInComplete,
  userPreferences = {
    communicationStyle: 'supportive_friend',
    traumaInformed: true
  },
  currentStreak = 0,
  lastCheckIn
}: DailyEmotionalCheckInProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkInData, setCheckInData] = useState<Partial<DailyCheckIn>>({
    date: new Date().toISOString().split('T')[0],
    needsToday: [],
    gratitude: [],
    challenges: [],
    growth: [],
    kheperaConversation: {
      greeting: '',
      insights: [],
      encouragement: '',
      nextSteps: []
    }
  });
  const [isComplete, setIsComplete] = useState(false);
  const [kheperaInsights, setKheperaInsights] = useState<KheperaInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastTapTime, setLastTapTime] = useState<number>(0);

  const { user } = useAuth();
  const {
    isCrisisMode,
    isLowBattery,
    deviceTier,
    isOffline
  } = useMobileOptimization();

  const checkInSteps: CheckInStep[] = [
    {
      id: 'emotional_weather',
      title: 'Emotional Weather',
      description: 'How would you describe your emotional atmosphere today?',
      component: 'emotional_weather',
      isOptional: false
    },
    {
      id: 'energy_level',
      title: 'Energy Check',
      description: 'What\'s your energy level like right now?',
      component: 'energy_level',
      isOptional: false
    },
    {
      id: 'needs_gratitude',
      title: 'Needs & Gratitude',
      description: 'What do you need today? What are you grateful for?',
      component: 'needs_gratitude',
      isOptional: false
    },
    {
      id: 'challenges_growth',
      title: 'Challenges & Growth',
      description: 'Any challenges or growth moments to acknowledge?',
      component: 'challenges_growth',
      isOptional: true
    },
    {
      id: 'khepera_conversation',
      title: 'Wisdom & Next Steps',
      description: 'Let me share some insights and suggestions',
      component: 'khepera_conversation',
      isOptional: false
    }
  ];

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

  // Generate Khepera insights when user reaches the conversation step
  useEffect(() => {
    if (currentStep === checkInSteps.length - 1 && !isAnalyzing && kheperaInsights.length === 0) {
      generateKheperaInsights();
    }
  }, [currentStep, isAnalyzing, kheperaInsights.length]);

  const generateKheperaInsights = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const insights: KheperaInsight[] = [];
    
    // Pattern recognition based on emotional weather and energy
    if (checkInData.emotionalWeather === 'stormy' && checkInData.energyLevel && checkInData.energyLevel <= 2) {
      insights.push({
        type: 'pattern_recognition',
        message: "I notice you're experiencing intense emotions alongside low energy. This is your nervous system asking for extra care.",
        reasoning: "High emotional intensity + low energy often indicates overwhelm",
        nextSteps: ["Consider gentle grounding exercises", "Prioritize rest and basic needs", "Be extra compassionate with yourself"]
      });
    } else if (checkInData.emotionalWeather === 'rainbow_after_storm') {
      insights.push({
        type: 'gentle_encouragement',
        message: "What a beautiful place to find yourself - moving through difficulty into hope. This is resilience in action.",
        reasoning: "User is in a recovery/growth phase after challenge",
        nextSteps: ["Acknowledge your strength", "Notice what helped you through", "Celebrate this moment of hope"]
      });
    }
    
    // Needs analysis
    if (checkInData.needsToday && checkInData.needsToday.includes('support')) {
      insights.push({
        type: 'self_compassion_reminder',
        message: "Recognizing your need for support shows beautiful self-awareness. You deserve to receive care.",
        reasoning: "User is aware of need for emotional support",
        nextSteps: ["Reach out to a trusted person", "Practice self-support techniques", "Remember: needing support is human"]
      });
    }
    
    // Growth acknowledgment
    if (checkInData.growth && checkInData.growth.length > 0) {
      insights.push({
        type: 'gentle_encouragement',
        message: "I see you recognizing your own growth. This ability to witness your progress is a skill in itself.",
        reasoning: "User is demonstrating self-awareness and growth mindset",
        nextSteps: ["Continue this practice of noticing growth", "Trust in your ongoing development", "Let growth happen at its own pace"]
      });
    }
    
    // Streak acknowledgment
    if (currentStreak > 0) {
      insights.push({
        type: 'gentle_encouragement',
        message: `${currentStreak} days of showing up for yourself. This consistency is creating new neural pathways of self-care.`,
        reasoning: "Acknowledging consistent practice",
        nextSteps: ["Appreciate your commitment", "Notice how consistency feels", "Keep honoring your healing rhythm"]
      });
    }
    
    // Skill suggestions based on patterns
    if (checkInData.challenges && checkInData.challenges.length > 1) {
      insights.push({
        type: 'skill_suggestion',
        message: "With multiple challenges present, this might be a perfect time to practice your emotional regulation skills.",
        reasoning: "Multiple challenges indicate need for emotional support tools",
        nextSteps: ["Try a few minutes of breathwork", "Practice the RAIN technique", "Remember: you don't have to carry it all at once"]
      });
    }
    
    setKheperaInsights(insights);
    
    // Update check-in data with Khepera conversation
    const personality = KHEPERA_PERSONALITIES[userPreferences.communicationStyle];
    setCheckInData(prev => ({
      ...prev,
      kheperaConversation: {
        greeting: personality.greeting,
        insights: insights.map(i => i.message),
        encouragement: personality.encouragement,
        nextSteps: insights.flatMap(i => i.nextSteps).slice(0, 3)
      }
    }));
    
    setIsAnalyzing(false);
  };

  const handleStepComplete = (stepData: any) => {
    setCheckInData(prev => ({ ...prev, ...stepData }));
    
    if (currentStep < checkInSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeCheckIn();
    }
  };

  const completeCheckIn = () => {
    const completedCheckIn: DailyCheckIn = {
      ...checkInData,
      completedAt: new Date().toISOString(),
      mood_after: 'better' // Default, could be set by user
    } as DailyCheckIn;
    
    setIsComplete(true);
    onCheckInComplete(completedCheckIn);
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Crisis mode styles
  const crisisStyles = isCrisisMode ? {
    filter: 'contrast(1.2) brightness(1.1)',
    fontSize: '18px',
  } : {};

  const touchTargetClass = isCrisisMode 
    ? 'min-h-[60px] min-w-[60px] text-lg font-semibold border-3' 
    : 'min-h-[48px] min-w-[48px]';

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          backgroundColor: 'white',
          borderRadius: isCrisisMode ? '8px' : '12px',
          padding: isCrisisMode ? '2.5rem' : '2rem',
          border: isCrisisMode ? '3px solid #a4b792' : '1px solid #e5e5e5',
          textAlign: 'center',
          ...crisisStyles
        }}
      >
        <div style={{ fontSize: isCrisisMode ? '4rem' : '3rem', marginBottom: '1rem' }}>✨</div>
        <h3 style={{
          margin: '0 0 1rem 0',
          color: '#2e2e2e',
          fontSize: isCrisisMode ? '1.5rem' : '1.3rem',
          fontWeight: isCrisisMode ? '700' : '600'
        }}>
          Check-in Complete!
        </h3>
        <p style={{
          color: '#666',
          fontSize: isCrisisMode ? '1.1rem' : '1rem',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Thank you for taking time to connect with yourself today. Your emotional awareness is growing stronger.
        </p>
      </motion.div>
    );
  }

  const currentStepData = checkInSteps[currentStep];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: isCrisisMode ? '8px' : '12px',
      padding: isCrisisMode ? '2rem' : '1.5rem',
      border: isCrisisMode ? '3px solid #a4b792' : '1px solid #e5e5e5',
      ...crisisStyles
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        <span style={{ fontSize: isCrisisMode ? '2rem' : '1.5rem' }}>💚</span>
        <div>
          <h3 style={{
            margin: 0,
            color: '#2e2e2e',
            fontSize: isCrisisMode ? '1.4rem' : '1.2rem',
            fontWeight: isCrisisMode ? '700' : '600'
          }}>
            Daily Emotional Check-in
          </h3>
          <p style={{
            margin: '0.25rem 0 0 0',
            color: '#666',
            fontSize: isCrisisMode ? '1rem' : '0.9rem'
          }}>
            Step {currentStep + 1} of {checkInSteps.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        backgroundColor: '#e5e5e5',
        borderRadius: '10px',
        height: isCrisisMode ? '12px' : '8px',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / checkInSteps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: '#a4b792',
            height: '100%'
          }}
        />
      </div>

      {/* Current Step */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          margin: '0 0 0.5rem 0',
          color: '#2e2e2e',
          fontSize: isCrisisMode ? '1.2rem' : '1rem',
          fontWeight: isCrisisMode ? '700' : '600'
        }}>
          {currentStepData.title}
        </h4>
        <p style={{
          margin: '0 0 1.5rem 0',
          color: '#666',
          fontSize: isCrisisMode ? '1rem' : '0.9rem',
          lineHeight: '1.4'
        }}>
          {currentStepData.description}
        </p>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStepData.component === 'emotional_weather' && (
              <EmotionalWeatherStep
                onSelect={(weather) => handleStepComplete({ emotionalWeather: weather })}
                currentValue={checkInData.emotionalWeather}
                isCrisisMode={isCrisisMode}
                touchTargetClass={touchTargetClass}
                handleTouchSafeAction={handleTouchSafeAction}
              />
            )}

            {currentStepData.component === 'energy_level' && (
              <EnergyLevelStep
                onSelect={(level) => handleStepComplete({ energyLevel: level })}
                currentValue={checkInData.energyLevel}
                isCrisisMode={isCrisisMode}
                touchTargetClass={touchTargetClass}
                handleTouchSafeAction={handleTouchSafeAction}
              />
            )}

            {currentStepData.component === 'needs_gratitude' && (
              <NeedsGratitudeStep
                onComplete={(data) => handleStepComplete(data)}
                currentData={{
                  needsToday: checkInData.needsToday || [],
                  gratitude: checkInData.gratitude || []
                }}
                isCrisisMode={isCrisisMode}
                touchTargetClass={touchTargetClass}
                handleTouchSafeAction={handleTouchSafeAction}
              />
            )}

            {currentStepData.component === 'challenges_growth' && (
              <ChallengesGrowthStep
                onComplete={(data) => handleStepComplete(data)}
                currentData={{
                  challenges: checkInData.challenges || [],
                  growth: checkInData.growth || []
                }}
                isCrisisMode={isCrisisMode}
                touchTargetClass={touchTargetClass}
                handleTouchSafeAction={handleTouchSafeAction}
              />
            )}

            {currentStepData.component === 'khepera_conversation' && (
              <KheperaConversationStep
                insights={kheperaInsights}
                isAnalyzing={isAnalyzing}
                onComplete={() => completeCheckIn()}
                checkInData={checkInData}
                userPreferences={userPreferences}
                isCrisisMode={isCrisisMode}
                touchTargetClass={touchTargetClass}
                handleTouchSafeAction={handleTouchSafeAction}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => handleTouchSafeAction(goToPreviousStep)}
          disabled={currentStep === 0}
          className={touchTargetClass}
          style={{
            backgroundColor: 'transparent',
            color: currentStep === 0 ? '#ccc' : '#666',
            border: '2px solid',
            borderColor: currentStep === 0 ? '#e5e5e5' : '#e5e5e5',
            borderRadius: isCrisisMode ? '6px' : '8px',
            padding: isCrisisMode ? '1rem 1.5rem' : '0.75rem 1.25rem',
            fontSize: isCrisisMode ? '1rem' : '0.9rem',
            fontWeight: isCrisisMode ? '700' : '600',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 0 ? 0.5 : 1
          }}
        >
          Back
        </button>

        {currentStepData.isOptional && (
          <button
            onClick={() => handleTouchSafeAction(() => handleStepComplete({}))}
            className={touchTargetClass}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '2px solid #e5e5e5',
              borderRadius: isCrisisMode ? '6px' : '8px',
              padding: isCrisisMode ? '1rem 1.5rem' : '0.75rem 1.25rem',
              fontSize: isCrisisMode ? '1rem' : '0.9rem',
              fontWeight: isCrisisMode ? '700' : '600',
              cursor: 'pointer'
            }}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

// Step Components
function EmotionalWeatherStep({ 
  onSelect, 
  currentValue, 
  isCrisisMode, 
  touchTargetClass, 
  handleTouchSafeAction 
}: {
  onSelect: (weather: string) => void;
  currentValue?: string;
  isCrisisMode: boolean;
  touchTargetClass: string;
  handleTouchSafeAction: (action: () => void) => void;
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isCrisisMode ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: isCrisisMode ? '1rem' : '0.75rem'
    }}>
      {EMOTIONAL_WEATHER_OPTIONS.map(option => (
        <button
          key={option.id}
          onClick={() => handleTouchSafeAction(() => onSelect(option.id))}
          className={touchTargetClass}
          style={{
            backgroundColor: currentValue === option.id ? '#a4b792' : 'transparent',
            color: currentValue === option.id ? 'white' : '#666',
            border: `2px solid ${currentValue === option.id ? '#a4b792' : '#e5e5e5'}`,
            borderRadius: isCrisisMode ? '8px' : '10px',
            padding: isCrisisMode ? '1.5rem' : '1rem',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: isCrisisMode ? '2rem' : '1.5rem' }}>{option.emoji}</span>
          <div>
            <div style={{ 
              fontWeight: '600', 
              fontSize: isCrisisMode ? '1rem' : '0.9rem',
              marginBottom: '0.25rem' 
            }}>
              {option.label}
            </div>
            <div style={{ 
              fontSize: isCrisisMode ? '0.9rem' : '0.75rem',
              opacity: 0.8,
              lineHeight: '1.3'
            }}>
              {option.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function EnergyLevelStep({ 
  onSelect, 
  currentValue, 
  isCrisisMode, 
  touchTargetClass, 
  handleTouchSafeAction 
}: {
  onSelect: (level: number) => void;
  currentValue?: number;
  isCrisisMode: boolean;
  touchTargetClass: string;
  handleTouchSafeAction: (action: () => void) => void;
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isCrisisMode ? '1fr' : 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: isCrisisMode ? '0.75rem' : '0.5rem'
    }}>
      {ENERGY_LEVELS.map(option => (
        <button
          key={option.level}
          onClick={() => handleTouchSafeAction(() => onSelect(option.level))}
          className={touchTargetClass}
          style={{
            backgroundColor: currentValue === option.level ? '#a4b792' : 'transparent',
            color: currentValue === option.level ? 'white' : '#666',
            border: `2px solid ${currentValue === option.level ? '#a4b792' : '#e5e5e5'}`,
            borderRadius: isCrisisMode ? '8px' : '10px',
            padding: isCrisisMode ? '1.25rem' : '1rem',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <div style={{
            display: 'flex',
            gap: '2px'
          }}>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '12px',
                  backgroundColor: i < option.level ? (currentValue === option.level ? 'white' : '#a4b792') : '#e5e5e5',
                  borderRadius: '2px'
                }}
              />
            ))}
          </div>
          <div>
            <div style={{ 
              fontWeight: '600', 
              fontSize: isCrisisMode ? '1rem' : '0.9rem',
              marginBottom: '0.25rem' 
            }}>
              {option.label}
            </div>
            <div style={{ 
              fontSize: isCrisisMode ? '0.8rem' : '0.7rem',
              opacity: 0.8
            }}>
              {option.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function NeedsGratitudeStep({ 
  onComplete, 
  currentData, 
  isCrisisMode, 
  touchTargetClass, 
  handleTouchSafeAction 
}: {
  onComplete: (data: any) => void;
  currentData: { needsToday: string[]; gratitude: string[] };
  isCrisisMode: boolean;
  touchTargetClass: string;
  handleTouchSafeAction: (action: () => void) => void;
}) {
  const [needsToday, setNeedsToday] = useState<string[]>(currentData.needsToday);
  const [gratitude, setGratitude] = useState<string[]>(currentData.gratitude);

  const toggleNeed = (needId: string) => {
    setNeedsToday(prev => 
      prev.includes(needId) 
        ? prev.filter(id => id !== needId)
        : [...prev, needId]
    );
  };

  const addGratitudeItem = (text: string) => {
    if (text.trim() && !gratitude.includes(text.trim())) {
      setGratitude(prev => [...prev, text.trim()]);
    }
  };

  const removeGratitudeItem = (item: string) => {
    setGratitude(prev => prev.filter(g => g !== item));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Needs Section */}
      <div>
        <h5 style={{
          margin: '0 0 1rem 0',
          color: '#2e2e2e',
          fontSize: isCrisisMode ? '1.1rem' : '1rem',
          fontWeight: isCrisisMode ? '700' : '600'
        }}>
          What do you need today? (Select all that apply)
        </h5>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isCrisisMode ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: isCrisisMode ? '0.75rem' : '0.5rem'
        }}>
          {COMMON_NEEDS.map(need => (
            <button
              key={need.id}
              onClick={() => handleTouchSafeAction(() => toggleNeed(need.id))}
              className={touchTargetClass}
              style={{
                backgroundColor: needsToday.includes(need.id) ? '#a4b792' : 'transparent',
                color: needsToday.includes(need.id) ? 'white' : '#666',
                border: `2px solid ${needsToday.includes(need.id) ? '#a4b792' : '#e5e5e5'}`,
                borderRadius: isCrisisMode ? '8px' : '10px',
                padding: isCrisisMode ? '1rem' : '0.75rem',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <span style={{ fontSize: isCrisisMode ? '1.2rem' : '1rem' }}>{need.emoji}</span>
              <span style={{ fontSize: isCrisisMode ? '0.9rem' : '0.8rem', fontWeight: '600' }}>
                {need.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Gratitude Section */}
      <div>
        <h5 style={{
          margin: '0 0 1rem 0',
          color: '#2e2e2e',
          fontSize: isCrisisMode ? '1.1rem' : '1rem',
          fontWeight: isCrisisMode ? '700' : '600'
        }}>
          What are you grateful for today? (Optional)
        </h5>
        
        {/* Quick gratitude buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {['Being alive', 'Having shelter', 'Small moments of peace', 'Learning and growing', 'Acts of kindness'].map(item => (
            <button
              key={item}
              onClick={() => handleTouchSafeAction(() => addGratitudeItem(item))}
              style={{
                backgroundColor: gratitude.includes(item) ? '#a4b792' : 'transparent',
                color: gratitude.includes(item) ? 'white' : '#666',
                border: '1px solid #e5e5e5',
                borderRadius: '16px',
                padding: '0.5rem 0.75rem',
                fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                cursor: 'pointer'
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Selected gratitude items */}
        {gratitude.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {gratitude.map(item => (
              <div
                key={item}
                style={{
                  backgroundColor: 'rgba(168, 183, 150, 0.1)',
                  border: '1px solid #a4b792',
                  borderRadius: '16px',
                  padding: '0.5rem 0.75rem',
                  fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{item}</span>
                <button
                  onClick={() => handleTouchSafeAction(() => removeGratitudeItem(item))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={() => handleTouchSafeAction(() => onComplete({ needsToday, gratitude }))}
        className={touchTargetClass}
        style={{
          backgroundColor: '#a4b792',
          color: 'white',
          border: 'none',
          borderRadius: isCrisisMode ? '6px' : '8px',
          padding: isCrisisMode ? '1rem 2rem' : '0.75rem 1.5rem',
          fontSize: isCrisisMode ? '1rem' : '0.9rem',
          fontWeight: isCrisisMode ? '700' : '600',
          cursor: 'pointer',
          alignSelf: 'flex-start'
        }}
      >
        Continue
      </button>
    </div>
  );
}

function ChallengesGrowthStep({ 
  onComplete, 
  currentData, 
  isCrisisMode, 
  touchTargetClass, 
  handleTouchSafeAction 
}: {
  onComplete: (data: any) => void;
  currentData: { challenges: string[]; growth: string[] };
  isCrisisMode: boolean;
  touchTargetClass: string;
  handleTouchSafeAction: (action: () => void) => void;
}) {
  const [challenges, setChallenges] = useState<string[]>(currentData.challenges);
  const [growth, setGrowth] = useState<string[]>(currentData.growth);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h5 style={{
          margin: '0 0 1rem 0',
          color: '#2e2e2e',
          fontSize: isCrisisMode ? '1.1rem' : '1rem',
          fontWeight: isCrisisMode ? '700' : '600'
        }}>
          Any challenges you're facing? (Optional)
        </h5>
        <p style={{
          color: '#666',
          fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
          margin: '0 0 1rem 0'
        }}>
          Naming challenges reduces their power over you.
        </p>
        {/* Challenge quick options would go here */}
      </div>

      <div>
        <h5 style={{
          margin: '0 0 1rem 0',
          color: '#2e2e2e',
          fontSize: isCrisisMode ? '1.1rem' : '1rem',
          fontWeight: isCrisisMode ? '700' : '600'
        }}>
          Any growth or insights today? (Optional)
        </h5>
        <p style={{
          color: '#666',
          fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
          margin: '0 0 1rem 0'
        }}>
          Even tiny steps count as growth.
        </p>
        {/* Growth quick options would go here */}
      </div>

      <button
        onClick={() => handleTouchSafeAction(() => onComplete({ challenges, growth }))}
        className={touchTargetClass}
        style={{
          backgroundColor: '#a4b792',
          color: 'white',
          border: 'none',
          borderRadius: isCrisisMode ? '6px' : '8px',
          padding: isCrisisMode ? '1rem 2rem' : '0.75rem 1.5rem',
          fontSize: isCrisisMode ? '1rem' : '0.9rem',
          fontWeight: isCrisisMode ? '700' : '600',
          cursor: 'pointer',
          alignSelf: 'flex-start'
        }}
      >
        Continue
      </button>
    </div>
  );
}

function KheperaConversationStep({ 
  insights, 
  isAnalyzing, 
  onComplete, 
  checkInData, 
  userPreferences, 
  isCrisisMode, 
  touchTargetClass, 
  handleTouchSafeAction 
}: {
  insights: KheperaInsight[];
  isAnalyzing: boolean;
  onComplete: () => void;
  checkInData: Partial<DailyCheckIn>;
  userPreferences: any;
  isCrisisMode: boolean;
  touchTargetClass: string;
  handleTouchSafeAction: (action: () => void) => void;
}) {
  const personality = KHEPERA_PERSONALITIES[userPreferences.communicationStyle];

  if (isAnalyzing) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem'
      }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: isCrisisMode ? '3rem' : '2rem', marginBottom: '1rem' }}
        >
          🧠
        </motion.div>
        <p style={{
          color: '#666',
          fontSize: isCrisisMode ? '1rem' : '0.9rem'
        }}>
          Khepera is reflecting on your check-in...
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Khepera Greeting */}
      <div style={{
        backgroundColor: 'rgba(168, 183, 150, 0.1)',
        border: '2px solid #a4b792',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: isCrisisMode ? '1.5rem' : '1.2rem' }}>🦋</span>
          <h5 style={{
            margin: 0,
            color: '#2e2e2e',
            fontSize: isCrisisMode ? '1.1rem' : '1rem',
            fontWeight: isCrisisMode ? '700' : '600'
          }}>
            Khepera's Insights
          </h5>
        </div>
        
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3 }}
            style={{
              marginBottom: index < insights.length - 1 ? '1rem' : 0
            }}
          >
            <p style={{
              color: '#2e2e2e',
              fontSize: isCrisisMode ? '1rem' : '0.9rem',
              margin: '0 0 0.5rem 0',
              lineHeight: '1.5'
            }}>
              {insight.message}
            </p>
            {insight.nextSteps.length > 0 && (
              <div style={{
                fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                color: '#667a5c'
              }}>
                <strong>Gentle suggestions:</strong>
                <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                  {insight.nextSteps.map((step, stepIndex) => (
                    <li key={stepIndex} style={{ marginBottom: '0.25rem' }}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Encouragement */}
      <div style={{
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#f0f7ff',
        borderRadius: '8px',
        border: '1px solid #e0f2f1'
      }}>
        <p style={{
          color: '#2e2e2e',
          fontSize: isCrisisMode ? '1rem' : '0.9rem',
          margin: 0,
          fontStyle: 'italic'
        }}>
          {personality.encouragement}
        </p>
      </div>

      {/* Complete Button */}
      <button
        onClick={() => handleTouchSafeAction(onComplete)}
        className={touchTargetClass}
        style={{
          backgroundColor: '#a4b792',
          color: 'white',
          border: 'none',
          borderRadius: isCrisisMode ? '6px' : '8px',
          padding: isCrisisMode ? '1rem 2rem' : '0.75rem 1.5rem',
          fontSize: isCrisisMode ? '1rem' : '0.9rem',
          fontWeight: isCrisisMode ? '700' : '600',
          cursor: 'pointer',
          alignSelf: 'center'
        }}
      >
        Complete Check-in
      </button>
    </div>
  );
}