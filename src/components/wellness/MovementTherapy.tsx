'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

// Movement therapy types
interface MovementSession {
  id: string;
  type: 'gentle_flow' | 'emotional_release' | 'grounding' | 'energizing' | 'free_form';
  duration: number;
  movements: MovementData[];
  bodyAwareness: BodyAwarenessData;
  mood?: MoodType;
  insights: string[];
  energyShift: {
    before: number;
    after: number;
  };
  timestamp: Date;
}

interface MovementData {
  timestamp: number;
  intensity: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'circular' | 'still';
  bodyPart: 'full_body' | 'upper_body' | 'arms' | 'torso' | 'legs' | 'head';
  rhythm: number; // beats per minute detected
  flow: 'staccato' | 'flowing' | 'chaotic' | 'suspended' | 'lyrical';
}

interface BodyAwarenessData {
  tensionAreas: string[];
  relaxationAreas: string[];
  energyFlow: string[];
  breathingPattern: 'shallow' | 'deep' | 'irregular' | 'rhythmic';
  emotionalSensations: string[];
}

interface MovementPrompt {
  id: string;
  title: string;
  description: string;
  instruction: string;
  duration: number; // seconds
  therapeuticPurpose: string;
  bodyFocus: string[];
  mood: MoodType[];
}

interface SomaticExercise {
  id: string;
  name: string;
  description: string;
  steps: string[];
  duration: number;
  benefits: string[];
  category: 'grounding' | 'releasing' | 'centering' | 'energizing';
}

interface MovementTherapyProps {
  onSessionComplete?: (session: MovementSession) => void;
  className?: string;
}

// Movement prompts organized by therapeutic intention
const MOVEMENT_PROMPTS: MovementPrompt[] = [
  {
    id: 'shake_release',
    title: 'Shake & Release',
    description: 'Natural trauma release through gentle shaking',
    instruction: 'Start with small tremors in your hands, let the movement spread naturally through your body',
    duration: 120,
    therapeuticPurpose: 'Nervous system regulation and trauma release',
    bodyFocus: ['nervous_system', 'whole_body'],
    mood: ['raw', 'tender']
  },
  {
    id: 'wave_flow',
    title: 'Ocean Wave Flow',
    description: 'Fluid movements that mirror water\'s natural rhythm',
    instruction: 'Move like water flowing through your body, continuous and gentle',
    duration: 180,
    therapeuticPurpose: 'Emotional flow and flexibility',
    bodyFocus: ['spine', 'arms', 'torso'],
    mood: ['contemplative', 'tender']
  },
  {
    id: 'root_grounding',
    title: 'Root & Ground',
    description: 'Connecting with earth energy through the feet and legs',
    instruction: 'Feel your feet, bend your knees, move like you\'re growing roots',
    duration: 150,
    therapeuticPurpose: 'Grounding and stability',
    bodyFocus: ['feet', 'legs', 'pelvis'],
    mood: ['raw', 'contemplative']
  },
  {
    id: 'heart_opening',
    title: 'Heart Opening Dance',
    description: 'Gentle movements to open and expand the heart space',
    instruction: 'Move your arms and chest with love and compassion for yourself',
    duration: 200,
    therapeuticPurpose: 'Heart connection and self-compassion',
    bodyFocus: ['chest', 'arms', 'heart'],
    mood: ['grateful', 'tender']
  },
  {
    id: 'power_stance',
    title: 'Power & Presence',
    description: 'Strong, grounded movements to embody personal power',
    instruction: 'Take up space, move with intention and strength',
    duration: 160,
    therapeuticPurpose: 'Confidence and empowerment',
    bodyFocus: ['whole_body', 'posture'],
    mood: ['empowered', 'grateful']
  },
  {
    id: 'spiral_integration',
    title: 'Spiral Integration',
    description: 'Spiraling movements for processing and integration',
    instruction: 'Create spirals with your body - arms, spine, whole self',
    duration: 240,
    therapeuticPurpose: 'Integration and wholeness',
    bodyFocus: ['spine', 'whole_body'],
    mood: ['contemplative', 'empowered']
  }
];

// Somatic exercises for body awareness
const SOMATIC_EXERCISES: SomaticExercise[] = [
  {
    id: 'body_scan_movement',
    name: 'Moving Body Scan',
    description: 'Gentle awareness of each body part through movement',
    steps: [
      'Close your eyes and take three deep breaths',
      'Start with your toes - wiggle them gently',
      'Move attention up to your feet, ankles, calves',
      'Continue scanning up through legs, pelvis, torso',
      'Notice arms, shoulders, neck, head',
      'Move any areas that call for attention'
    ],
    duration: 300,
    benefits: ['Body awareness', 'Nervous system calming', 'Self-connection'],
    category: 'centering'
  },
  {
    id: 'emotional_geography',
    name: 'Emotional Geography',
    description: 'Explore where emotions live in your body',
    steps: [
      'Think of a recent emotion you felt',
      'Notice where you feel it in your body',
      'Breathe into that area',
      'Let your body move from that place',
      'Allow the emotion to move and shift',
      'Notice what wants to happen naturally'
    ],
    duration: 240,
    benefits: ['Emotional processing', 'Body-mind connection', 'Release'],
    category: 'releasing'
  },
  {
    id: 'boundary_practice',
    name: 'Energetic Boundaries',
    description: 'Practice creating and maintaining healthy boundaries',
    steps: [
      'Stand in your personal space',
      'Extend your arms to feel your boundary',
      'Practice saying "yes" with your whole body',
      'Practice saying "no" with your whole body',
      'Notice how each feels different',
      'Move to strengthen your "no" muscle'
    ],
    duration: 180,
    benefits: ['Boundary setting', 'Personal power', 'Self-advocacy'],
    category: 'energizing'
  },
  {
    id: 'inner_child_play',
    name: 'Inner Child Movement',
    description: 'Playful, spontaneous movement to reconnect with joy',
    steps: [
      'Think of yourself as a child playing',
      'What did you love to do?',
      'Skip, hop, spin, dance freely',
      'Make silly faces and sounds',
      'Let yourself be wonderfully ridiculous',
      'End with a big stretch and smile'
    ],
    duration: 200,
    benefits: ['Joy reconnection', 'Playfulness', 'Stress relief'],
    category: 'energizing'
  }
];

const MovementTherapy: React.FC<MovementTherapyProps> = ({
  onSessionComplete,
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState<'guided' | 'free_form' | 'somatic' | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<MovementPrompt | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<SomaticExercise | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [energyBefore, setEnergyBefore] = useState(5);
  const [energyAfter, setEnergyAfter] = useState(5);
  const [bodyAwareness, setBodyAwareness] = useState<Partial<BodyAwarenessData>>({});
  const [movementData, setMovementData] = useState<MovementData[]>([]);
  const [showBodyMap, setShowBodyMap] = useState(false);

  // Device motion tracking
  const [motionPermission, setMotionPermission] = useState<'granted' | 'denied' | 'default'>('default');
  const [motionData, setMotionData] = useState({ x: 0, y: 0, z: 0 });
  const [movementIntensity, setMovementIntensity] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const motionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMotionRef = useRef({ x: 0, y: 0, z: 0 });

  const { currentMood, getMoodData } = useMoodContext();

  // Filter prompts by current mood
  const moodPrompts = useMemo(() => {
    if (!currentMood) return MOVEMENT_PROMPTS.slice(0, 3);
    return MOVEMENT_PROMPTS.filter(prompt => prompt.mood.includes(currentMood));
  }, [currentMood]);

  // Request device motion permission
  const requestMotionPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && (DeviceMotionEvent as any).requestPermission) {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        setMotionPermission(permission);
        return permission === 'granted';
      } catch (error) {
        console.error('Motion permission error:', error);
        setMotionPermission('denied');
        return false;
      }
    } else {
      // For non-iOS devices, assume permission is granted
      setMotionPermission('granted');
      return true;
    }
  }, []);

  // Handle device motion
  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    const { acceleration } = event;
    if (!acceleration) return;

    const { x = 0, y = 0, z = 0 } = acceleration;
    const last = lastMotionRef.current;
    
    // Calculate movement intensity
    const deltaX = Math.abs(x - last.x);
    const deltaY = Math.abs(y - last.y);
    const deltaZ = Math.abs(z - last.z);
    const intensity = (deltaX + deltaY + deltaZ) * 10;
    
    setMotionData({ x, y, z });
    setMovementIntensity(prev => prev * 0.8 + intensity * 0.2); // Smooth the intensity
    
    lastMotionRef.current = { x, y, z };

    // Record movement data
    if (isMoving) {
      const movementEntry: MovementData = {
        timestamp: Date.now(),
        intensity: Math.min(100, intensity),
        direction: Math.abs(y) > Math.abs(x) ? (y > 0 ? 'up' : 'down') : (x > 0 ? 'right' : 'left'),
        bodyPart: 'full_body',
        rhythm: 60, // Default BPM
        flow: intensity > 10 ? 'chaotic' : intensity > 5 ? 'flowing' : 'suspended'
      };
      
      setMovementData(prev => [...prev.slice(-100), movementEntry]); // Keep last 100 points
    }
  }, [isMoving]);

  // Start motion tracking
  const startMotionTracking = useCallback(async () => {
    const hasPermission = await requestMotionPermission();
    if (!hasPermission) return false;

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleDeviceMotion);
      return true;
    }
    return false;
  }, [requestMotionPermission, handleDeviceMotion]);

  // Stop motion tracking
  const stopMotionTracking = useCallback(() => {
    if (window.DeviceMotionEvent) {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    }
  }, [handleDeviceMotion]);

  // Start movement session
  const startMovementSession = useCallback(async (type: 'guided' | 'free_form' | 'somatic') => {
    setIsMoving(true);
    setSessionDuration(0);
    setMovementData([]);
    setCurrentStep(0);

    // Start motion tracking if available
    await startMotionTracking();

    // Start timer
    timerRef.current = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [startMotionTracking]);

  // Stop movement session
  const stopMovementSession = useCallback(() => {
    setIsMoving(false);
    stopMotionTracking();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (motionIntervalRef.current) {
      clearInterval(motionIntervalRef.current);
      motionIntervalRef.current = null;
    }
  }, [stopMotionTracking]);

  // Complete session
  const completeSession = useCallback(() => {
    if (sessionDuration < 30) return; // Minimum session length

    const session: MovementSession = {
      id: Date.now().toString(),
      type: selectedPrompt ? 'guided' : selectedExercise ? 'somatic' : 'free_form',
      duration: sessionDuration,
      movements: movementData,
      bodyAwareness: {
        tensionAreas: bodyAwareness.tensionAreas || [],
        relaxationAreas: bodyAwareness.relaxationAreas || [],
        energyFlow: bodyAwareness.energyFlow || [],
        breathingPattern: bodyAwareness.breathingPattern || 'rhythmic',
        emotionalSensations: bodyAwareness.emotionalSensations || []
      },
      mood: currentMood || undefined,
      insights: generateSessionInsights(),
      energyShift: {
        before: energyBefore,
        after: energyAfter
      },
      timestamp: new Date()
    };

    // Save to localStorage
    const savedSessions = JSON.parse(localStorage.getItem('alchm_movement_sessions') || '[]');
    savedSessions.push(session);
    localStorage.setItem('alchm_movement_sessions', JSON.stringify(savedSessions));

    onSessionComplete?.(session);

    // Reset session
    setActiveMode(null);
    setSelectedPrompt(null);
    setSelectedExercise(null);
    setSessionDuration(0);
    setCurrentStep(0);
    setBodyAwareness({});
    setMovementData([]);

    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [sessionDuration, movementData, bodyAwareness, currentMood, energyBefore, energyAfter, selectedPrompt, selectedExercise, onSessionComplete]);

  // Generate session insights
  const generateSessionInsights = useCallback(() => {
    const insights = [];
    
    // Duration insight
    if (sessionDuration >= 300) {
      insights.push('Deep dive session - you gave yourself substantial time for exploration');
    } else if (sessionDuration >= 120) {
      insights.push('Meaningful movement practice - perfect for daily self-care');
    } else {
      insights.push('Brief but intentional movement - every moment of self-care matters');
    }

    // Energy shift insight
    const energyDifference = energyAfter - energyBefore;
    if (energyDifference > 2) {
      insights.push('Significant energy increase - movement activated your vitality');
    } else if (energyDifference < -2) {
      insights.push('Calming effect - movement helped you find peace and groundedness');
    } else {
      insights.push('Balanced energy flow - movement helped you find your natural rhythm');
    }

    // Movement pattern insight
    const avgIntensity = movementData.length > 0 
      ? movementData.reduce((sum, m) => sum + m.intensity, 0) / movementData.length 
      : 0;
    
    if (avgIntensity > 20) {
      insights.push('Dynamic expression - you allowed powerful energy to move through you');
    } else if (avgIntensity > 10) {
      insights.push('Gentle flow - you found a sustainable rhythm for healing');
    } else {
      insights.push('Subtle awareness - you honored gentle movement and inner listening');
    }

    // Mood-specific insight
    if (currentMood) {
      insights.push(`Movement honored your ${currentMood} energy and supported natural processing`);
    }

    return insights;
  }, [sessionDuration, energyAfter, energyBefore, movementData, currentMood]);

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Body awareness areas for mapping
  const bodyAreas = [
    'head', 'neck', 'shoulders', 'chest', 'arms', 'hands', 
    'upper_back', 'lower_back', 'abdomen', 'pelvis', 'hips',
    'thighs', 'knees', 'calves', 'ankles', 'feet'
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMovementSession();
    };
  }, [stopMovementSession]);

  return (
    <div className={`movement-therapy ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Movement & Somatic Therapy
        </h3>
        <p className="text-sm text-gray-600">
          Healing through the wisdom of the body
        </p>
      </div>

      {/* Energy Level Check-in */}
      {!activeMode && (
        <div className="energy-checkin mb-6 p-4 bg-sage-50 rounded-2xl">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Energy Level Check-in</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Low Energy</span>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map(level => (
                <button
                  key={level}
                  onClick={() => setEnergyBefore(level)}
                  className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-all ${
                    energyBefore === level
                      ? 'border-sage-400 bg-sage-400 text-white'
                      : 'border-sage-200 hover:border-sage-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600">High Energy</span>
          </div>
        </div>
      )}

      {/* Mode Selection */}
      {!activeMode && (
        <div className="mode-selection grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          {/* Guided Movement */}
          <button
            onClick={() => setActiveMode('guided')}
            className="mode-card p-6 bg-gradient-to-br from-green-100 to-sage-100 rounded-2xl text-center hover:shadow-md transition-all duration-200"
          >
            <div className="text-3xl mb-2">🌊</div>
            <h4 className="font-semibold text-gray-800 mb-1">Guided Movement</h4>
            <p className="text-xs text-gray-600 mb-2">Therapeutic movement prompts</p>
            {currentMood && (
              <p className="text-xs text-sage-600">{moodPrompts.length} prompts for {currentMood}</p>
            )}
          </button>

          {/* Free Form */}
          <button
            onClick={() => setActiveMode('free_form')}
            className="mode-card p-6 bg-gradient-to-br from-blue-100 to-sky-100 rounded-2xl text-center hover:shadow-md transition-all duration-200"
          >
            <div className="text-3xl mb-2">💃</div>
            <h4 className="font-semibold text-gray-800 mb-1">Free Form</h4>
            <p className="text-xs text-gray-600">Intuitive movement exploration</p>
          </button>

          {/* Somatic Exercises */}
          <button
            onClick={() => setActiveMode('somatic')}
            className="mode-card p-6 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl text-center hover:shadow-md transition-all duration-200"
          >
            <div className="text-3xl mb-2">🧘</div>
            <h4 className="font-semibold text-gray-800 mb-1">Somatic Exercises</h4>
            <p className="text-xs text-gray-600">Body awareness practices</p>
          </button>
        </div>
      )}

      {/* Guided Movement Mode */}
      {activeMode === 'guided' && !selectedPrompt && (
        <div className="prompt-selection bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-800">Choose a Movement Prompt</h4>
            <button
              onClick={() => setActiveMode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
          </div>

          <div className="prompts-grid space-y-4">
            {moodPrompts.map(prompt => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt)}
                className="w-full p-4 bg-sage-50 rounded-xl text-left hover:bg-sage-100 transition-colors"
              >
                <div className="font-semibold text-gray-800">{prompt.title}</div>
                <div className="text-sm text-gray-600 mb-2">{prompt.description}</div>
                <div className="text-xs text-sage-600 mb-2">
                  {Math.floor(prompt.duration / 60)} minutes • {prompt.therapeuticPurpose}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Focus:</span>
                  {prompt.bodyFocus.map((focus, i) => (
                    <span key={i} className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                      {focus.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Guided Session */}
      {activeMode === 'guided' && selectedPrompt && (
        <div className="guided-session bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">{selectedPrompt.title}</h4>
            <p className="text-gray-600 mb-4">{selectedPrompt.description}</p>
            
            {/* Movement Visualization */}
            <div className="movement-visual mb-6">
              <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                isMoving 
                  ? `border-sage-400 bg-sage-100 animate-pulse scale-${Math.min(150, 100 + movementIntensity * 2)}` 
                  : 'border-gray-300 bg-gray-50'
              }`}>
                <div className="text-2xl">
                  {isMoving ? '🌟' : '🧘'}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="instructions p-4 bg-sage-50 rounded-lg mb-6">
              <p className="text-gray-800 italic">"{selectedPrompt.instruction}"</p>
            </div>

            {/* Session Info */}
            {isMoving && (
              <div className="session-info mb-6">
                <div className="text-2xl font-light text-gray-700 mb-2">
                  {formatTime(sessionDuration)}
                </div>
                <div className="text-sm text-gray-500">
                  Recommended: {formatTime(selectedPrompt.duration)}
                </div>
                {motionPermission === 'granted' && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-1">Movement Intensity</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-sage-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, movementIntensity * 5)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setSelectedPrompt(null)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Choose Different
              </button>
              
              <button
                onClick={isMoving ? stopMovementSession : () => startMovementSession('guided')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isMoving
                    ? 'bg-red-400 text-white hover:bg-red-500'
                    : 'bg-sage-400 text-white hover:bg-sage-500'
                }`}
              >
                {isMoving ? 'Pause Movement' : 'Begin Movement'}
              </button>
              
              {sessionDuration >= 60 && (
                <button
                  onClick={() => {
                    stopMovementSession();
                    setShowBodyMap(true);
                  }}
                  className="px-6 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors"
                >
                  Complete Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Free Form Mode */}
      {activeMode === 'free_form' && (
        <div className="free-form-session bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-800">Free Form Movement</h4>
              <button
                onClick={() => setActiveMode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ← Back
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Let your body guide you. Move however feels right in this moment.
            </p>

            {/* Movement Visualization */}
            <div className="movement-visual mb-6">
              <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                isMoving 
                  ? 'border-blue-400 bg-blue-100 animate-bounce' 
                  : 'border-gray-300 bg-gray-50'
              }`}>
                <div className="text-3xl">
                  {isMoving ? '✨' : '💃'}
                </div>
              </div>
            </div>

            {isMoving && (
              <div className="session-info mb-6">
                <div className="text-3xl font-light text-gray-700 mb-2">
                  {formatTime(sessionDuration)}
                </div>
                <div className="text-sm text-gray-500">Follow your body's wisdom</div>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={isMoving ? stopMovementSession : () => startMovementSession('free_form')}
                className={`px-8 py-4 rounded-lg font-medium transition-colors ${
                  isMoving
                    ? 'bg-red-400 text-white hover:bg-red-500'
                    : 'bg-blue-400 text-white hover:bg-blue-500'
                }`}
              >
                {isMoving ? 'Pause Movement' : 'Begin Free Movement'}
              </button>
              
              {sessionDuration >= 60 && (
                <button
                  onClick={() => {
                    stopMovementSession();
                    setShowBodyMap(true);
                  }}
                  className="px-6 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors"
                >
                  Complete Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Somatic Exercises Mode */}
      {activeMode === 'somatic' && !selectedExercise && (
        <div className="exercise-selection bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-800">Somatic Exercises</h4>
            <button
              onClick={() => setActiveMode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
          </div>

          <div className="exercises-grid space-y-4">
            {SOMATIC_EXERCISES.map(exercise => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                className="w-full p-4 bg-purple-50 rounded-xl text-left hover:bg-purple-100 transition-colors"
              >
                <div className="font-semibold text-gray-800">{exercise.name}</div>
                <div className="text-sm text-gray-600 mb-2">{exercise.description}</div>
                <div className="text-xs text-purple-600 mb-2">
                  {Math.floor(exercise.duration / 60)} minutes • {exercise.category}
                </div>
                <div className="flex flex-wrap gap-1">
                  {exercise.benefits.map((benefit, i) => (
                    <span key={i} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                      {benefit}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Somatic Exercise */}
      {activeMode === 'somatic' && selectedExercise && (
        <div className="somatic-session bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">{selectedExercise.name}</h4>
            <p className="text-gray-600 mb-4">{selectedExercise.description}</p>

            {/* Step Progress */}
            <div className="step-progress mb-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-sm text-gray-600">
                  Step {currentStep + 1} of {selectedExercise.steps.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / selectedExercise.steps.length) * 100}%` }}
                />
              </div>
              
              <div className="instruction p-4 bg-purple-50 rounded-lg">
                <p className="text-gray-800">{selectedExercise.steps[currentStep]}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Choose Different
              </button>
              
              {currentStep < selectedExercise.steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={() => setShowBodyMap(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Complete Exercise
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Body Awareness Mapping */}
      {showBodyMap && (
        <div className="body-mapping bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 text-center mb-6">
            Body Awareness Check-in
          </h4>
          
          <div className="space-y-6">
            {/* Energy Level After */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-3">How is your energy now?</h5>
              <div className="flex items-center justify-center gap-2">
                {[1,2,3,4,5,6,7,8,9,10].map(level => (
                  <button
                    key={level}
                    onClick={() => setEnergyAfter(level)}
                    className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-all ${
                      energyAfter === level
                        ? 'border-sage-400 bg-sage-400 text-white'
                        : 'border-sage-200 hover:border-sage-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Areas */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-3">
                What areas feel different? (tap to select)
              </h5>
              <div className="grid grid-cols-4 gap-2">
                {bodyAreas.map(area => (
                  <button
                    key={area}
                    onClick={() => {
                      const isSelected = bodyAwareness.tensionAreas?.includes(area);
                      setBodyAwareness(prev => ({
                        ...prev,
                        tensionAreas: isSelected 
                          ? prev.tensionAreas?.filter(a => a !== area)
                          : [...(prev.tensionAreas || []), area]
                      }));
                    }}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      bodyAwareness.tensionAreas?.includes(area)
                        ? 'bg-sage-400 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-sage-100'
                    }`}
                  >
                    {area.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Complete Session */}
            <div className="text-center">
              <button
                onClick={completeSession}
                className="px-8 py-3 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors font-medium"
              >
                Complete Movement Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementTherapy;