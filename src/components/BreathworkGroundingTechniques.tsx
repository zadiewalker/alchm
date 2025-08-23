// ALCHM Breathwork & Grounding Techniques Component
// Interactive breathwork guidance and grounding exercises for emotional regulation

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BreathworkSession, 
  BreathworkTechnique, 
  BreathPattern,
  GroundingTechnique,
  SomaticPractice,
  NervousSystemRegulation
} from '@/types/emotional-wellness-schema';

interface BreathworkGroundingProps {
  userId: string;
  currentEmotionalState: {
    stressLevel: number; // 1-10
    energyLevel: number; // 1-10
    anxietyLevel: number; // 1-10
    focusLevel: number; // 1-10
  };
  availableTime: number; // minutes
  culturalPreferences?: {
    breathworkTraditions: string[];
    culturalGroundingPractices: string[];
    languagePreference: string;
  };
  traumaInformedSettings?: {
    gentleApproach: boolean;
    choiceEmphasis: boolean;
    safetyReminders: boolean;
    exitStrategies: boolean;
  };
  accessibilityNeeds?: {
    breathingLimitations: string[];
    physicalLimitations: string[];
    sensoryConsiderations: string[];
    cognitiveSupport: boolean;
  };
  onSessionComplete?: (session: BreathworkSession) => void;
  onGroundingComplete?: (practice: SomaticPractice) => void;
}

interface BreathingState {
  phase: 'inhale' | 'hold_in' | 'exhale' | 'hold_out' | 'pause';
  count: number;
  cycle: number;
  totalCycles: number;
  isActive: boolean;
  currentTechnique: BreathworkTechnique | null;
}

const BreathworkGroundingTechniques: React.FC<BreathworkGroundingProps> = ({
  userId,
  currentEmotionalState,
  availableTime,
  culturalPreferences,
  traumaInformedSettings,
  accessibilityNeeds,
  onSessionComplete,
  onGroundingComplete
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'breathwork' | 'grounding'>('breathwork');
  const [selectedTechnique, setSelectedTechnique] = useState<BreathworkTechnique | null>(null);
  const [selectedGrounding, setSelectedGrounding] = useState<GroundingTechnique | null>(null);
  const [breathingState, setBreathingState] = useState<BreathingState>({
    phase: 'pause',
    count: 0,
    cycle: 0,
    totalCycles: 0,
    isActive: false,
    currentTechnique: null
  });
  const [sessionData, setSessionData] = useState<Partial<BreathworkSession>>({});
  const [groundingData, setGroundingData] = useState<Partial<SomaticPractice>>({});
  const [userFeedback, setUserFeedback] = useState<{
    physicalSensations: string[];
    emotionalShifts: string[];
    effectiveness: number;
  }>({
    physicalSensations: [],
    emotionalShifts: [],
    effectiveness: 5
  });

  // Refs for breathing timer
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<Date | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Recommended techniques based on emotional state
  const getRecommendedBreathworkTechniques = useCallback((): BreathworkTechnique[] => {
    const techniques: BreathworkTechnique[] = [];

    // For high stress/anxiety - calming techniques
    if (currentEmotionalState.stressLevel > 6 || currentEmotionalState.anxietyLevel > 6) {
      techniques.push({
        techniqueId: 'box_breathing',
        name: '4-4-4-4 Box Breathing',
        category: 'calming',
        description: 'Equal count breathing for nervous system regulation',
        instructions: [
          { step: 1, instruction: 'Inhale for 4 counts', duration: 4 },
          { step: 2, instruction: 'Hold for 4 counts', duration: 4 },
          { step: 3, instruction: 'Exhale for 4 counts', duration: 4 },
          { step: 4, instruction: 'Hold empty for 4 counts', duration: 4 }
        ],
        duration: 180, // 3 minutes
        difficulty: 'beginner',
        contraindications: ['severe_breathing_issues', 'panic_disorder_acute'],
        benefits: ['stress_reduction', 'anxiety_relief', 'nervous_system_regulation'],
        culturalOrigin: null,
        scientificBasis: [
          { study: 'Navy SEAL breathing techniques', evidence: 'Activates parasympathetic nervous system' }
        ]
      });

      techniques.push({
        techniqueId: 'extended_exhale',
        name: '4-7-8 Relaxing Breath',
        category: 'calming',
        description: 'Extended exhale for deep relaxation',
        instructions: [
          { step: 1, instruction: 'Inhale through nose for 4 counts', duration: 4 },
          { step: 2, instruction: 'Hold for 7 counts', duration: 7 },
          { step: 3, instruction: 'Exhale through mouth for 8 counts', duration: 8 },
          { step: 4, instruction: 'Pause naturally', duration: 2 }
        ],
        duration: 240, // 4 minutes
        difficulty: 'beginner',
        contraindications: ['pregnancy', 'low_blood_pressure'],
        benefits: ['deep_relaxation', 'sleep_preparation', 'anxiety_relief'],
        culturalOrigin: 'Ancient Pranayama',
        scientificBasis: [
          { study: 'Dr. Andrew Weil research', evidence: 'Activates relaxation response' }
        ]
      });
    }

    // For low energy - energizing techniques
    if (currentEmotionalState.energyLevel < 4) {
      techniques.push({
        techniqueId: 'breath_of_fire',
        name: 'Gentle Breath of Fire',
        category: 'energizing',
        description: 'Modified energizing breath for gentle activation',
        instructions: [
          { step: 1, instruction: 'Sit comfortably with straight spine', duration: 10 },
          { step: 2, instruction: 'Take 3 deep breaths to prepare', duration: 30 },
          { step: 3, instruction: 'Begin gentle rapid breathing through nose', duration: 60 },
          { step: 4, instruction: 'Take 3 deep recovery breaths', duration: 30 }
        ],
        duration: 300, // 5 minutes
        difficulty: 'intermediate',
        contraindications: ['pregnancy', 'high_blood_pressure', 'heart_conditions'],
        benefits: ['energy_boost', 'mental_clarity', 'circulation_improvement'],
        culturalOrigin: 'Kundalini Yoga',
        scientificBasis: [
          { study: 'Pranayama research', evidence: 'Increases oxygen circulation and alertness' }
        ]
      });
    }

    // For poor focus - balancing techniques
    if (currentEmotionalState.focusLevel < 5) {
      techniques.push({
        techniqueId: 'alternate_nostril',
        name: 'Alternate Nostril Breathing',
        category: 'balancing',
        description: 'Brain hemisphere balancing technique',
        instructions: [
          { step: 1, instruction: 'Use right thumb to close right nostril', duration: 5 },
          { step: 2, instruction: 'Inhale through left nostril for 4 counts', duration: 4 },
          { step: 3, instruction: 'Close both nostrils, hold for 2 counts', duration: 2 },
          { step: 4, instruction: 'Release right nostril, exhale for 4 counts', duration: 4 },
          { step: 5, instruction: 'Inhale right nostril for 4 counts', duration: 4 },
          { step: 6, instruction: 'Close both, hold for 2 counts', duration: 2 },
          { step: 7, instruction: 'Release left nostril, exhale for 4 counts', duration: 4 }
        ],
        duration: 360, // 6 minutes
        difficulty: 'intermediate',
        contraindications: ['nasal_congestion', 'deviated_septum'],
        benefits: ['mental_balance', 'focus_improvement', 'nervous_system_harmony'],
        culturalOrigin: 'Pranayama (Nadi Shodhana)',
        scientificBasis: [
          { study: 'Neuroimaging studies', evidence: 'Balances brain hemisphere activity' }
        ]
      });
    }

    return techniques.filter(t => t.duration <= availableTime * 60);
  }, [currentEmotionalState, availableTime]);

  // Grounding techniques based on emotional state and accessibility
  const getRecommendedGroundingTechniques = useCallback((): GroundingTechnique[] => {
    const techniques: GroundingTechnique[] = [];

    // 5-4-3-2-1 Sensory Grounding
    techniques.push({
      techniqueId: '5_4_3_2_1',
      name: '5-4-3-2-1 Sensory Grounding',
      category: 'sensory',
      description: 'Use your senses to ground in the present moment',
      steps: [
        { step: 1, instruction: 'Name 5 things you can see', timeLimit: 60 },
        { step: 2, instruction: 'Name 4 things you can touch', timeLimit: 60 },
        { step: 3, instruction: 'Name 3 things you can hear', timeLimit: 60 },
        { step: 4, instruction: 'Name 2 things you can smell', timeLimit: 60 },
        { step: 5, instruction: 'Name 1 thing you can taste', timeLimit: 60 }
      ],
      duration: 300, // 5 minutes
      difficulty: 'beginner',
      accessibilityAdaptations: [
        'Can skip any sense that is not accessible',
        'Can use memory if sensory input is limited',
        'Can be done entirely mentally'
      ],
      traumaInformedApproach: [
        'Emphasize choice in what to focus on',
        'Remind that you can stop at any time',
        'Focus on safe, comfortable items'
      ],
      benefits: ['present_moment_awareness', 'anxiety_reduction', 'dissociation_management']
    });

    // Body Awareness Grounding
    techniques.push({
      techniqueId: 'body_awareness',
      name: 'Gentle Body Awareness',
      category: 'somatic',
      description: 'Connect with your body in a gentle, non-judgmental way',
      steps: [
        { step: 1, instruction: 'Notice your feet touching the ground', timeLimit: 60 },
        { step: 2, instruction: 'Feel your body supported by your chair/surface', timeLimit: 60 },
        { step: 3, instruction: 'Notice your hands and how they feel', timeLimit: 60 },
        { step: 4, instruction: 'Gently scan your body without judgment', timeLimit: 120 },
        { step: 5, instruction: 'Send kindness to any tense areas', timeLimit: 60 }
      ],
      duration: 360, // 6 minutes
      difficulty: 'beginner',
      accessibilityAdaptations: [
        'Can be adapted for any physical position',
        'Focus only on accessible body parts',
        'Can be done with clothing or blankets for comfort'
      ],
      traumaInformedApproach: [
        'Only notice, never force or change anything',
        'Skip any areas that feel uncomfortable',
        'Remember your body is your safe space'
      ],
      benefits: ['body_reconnection', 'nervous_system_calming', 'self_compassion']
    });

    // Emotional Regulation Grounding
    if (currentEmotionalState.stressLevel > 7) {
      techniques.push({
        techniqueId: 'emotional_regulation',
        name: 'STOP Technique',
        category: 'emotional',
        description: 'Pause and regulate intense emotions',
        steps: [
          { step: 1, instruction: 'S - Stop what you\'re doing', timeLimit: 10 },
          { step: 2, instruction: 'T - Take a breath (or several)', timeLimit: 60 },
          { step: 3, instruction: 'O - Observe what you\'re feeling without judgment', timeLimit: 90 },
          { step: 4, instruction: 'P - Proceed with intention and self-compassion', timeLimit: 60 }
        ],
        duration: 240, // 4 minutes
        difficulty: 'beginner',
        accessibilityAdaptations: [
          'Can be done anywhere, anytime',
          'No special position required',
          'Can be modified for any cognitive ability'
        ],
        traumaInformedApproach: [
          'No pressure to change what you\'re feeling',
          'Observation is gentle and kind',
          'Proceeding is your choice'
        ],
        benefits: ['emotional_regulation', 'impulsivity_management', 'mindful_responding']
      });
    }

    return techniques.filter(t => t.duration <= availableTime * 60);
  }, [currentEmotionalState, availableTime]);

  // Breathing pattern controller
  const startBreathingPattern = useCallback((technique: BreathworkTechnique) => {
    if (!technique.instructions || technique.instructions.length === 0) return;

    sessionStartRef.current = new Date();
    setSelectedTechnique(technique);
    
    const pattern = technique.instructions;
    const totalCycles = Math.floor(technique.duration / pattern.reduce((sum, instr) => sum + instr.duration, 0));
    
    setBreathingState({
      phase: 'pause',
      count: 0,
      cycle: 0,
      totalCycles,
      isActive: true,
      currentTechnique: technique
    });

    // Start the breathing pattern
    let currentInstructionIndex = 0;
    let currentCycle = 0;
    let currentCount = 0;

    const nextPhase = () => {
      if (currentCycle >= totalCycles) {
        setBreathingState(prev => ({ ...prev, isActive: false }));
        completeBrea thworkSession(technique);
        return;
      }

      const instruction = pattern[currentInstructionIndex];
      const phaseName = getPhaseFromInstruction(instruction.instruction);
      
      setBreathingState(prev => ({
        ...prev,
        phase: phaseName,
        count: currentCount,
        cycle: currentCycle
      }));

      // Play audio cue if available
      playBreathingCue(phaseName);

      currentCount++;
      
      if (currentCount >= instruction.duration) {
        currentCount = 0;
        currentInstructionIndex++;
        
        if (currentInstructionIndex >= pattern.length) {
          currentInstructionIndex = 0;
          currentCycle++;
        }
      }

      breathingTimerRef.current = setTimeout(nextPhase, 1000);
    };

    // Start after a 3-second preparation
    breathingTimerRef.current = setTimeout(nextPhase, 3000);
  }, []);

  const stopBreathingPattern = useCallback(() => {
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
    
    setBreathingState(prev => ({
      ...prev,
      isActive: false,
      phase: 'pause'
    }));
  }, []);

  // Helper functions
  const getPhaseFromInstruction = (instruction: string): BreathingState['phase'] => {
    const lower = instruction.toLowerCase();
    if (lower.includes('inhale')) return 'inhale';
    if (lower.includes('hold') && (lower.includes('in') || lower.includes('breath'))) return 'hold_in';
    if (lower.includes('exhale')) return 'exhale';
    if (lower.includes('hold') && (lower.includes('empty') || lower.includes('out'))) return 'hold_out';
    return 'pause';
  };

  const playBreathingCue = (phase: BreathingState['phase']) => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch (e) {
        return; // Audio not available
      }
    }

    try {
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different tones for different phases
      switch (phase) {
        case 'inhale':
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
          break;
        case 'exhale':
          oscillator.frequency.setValueAtTime(165, audioContext.currentTime); // E3
          break;
        case 'hold_in':
        case 'hold_out':
          oscillator.frequency.setValueAtTime(196, audioContext.currentTime); // G3
          break;
        default:
          return;
      }

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Audio playback failed, continue silently
    }
  };

  const completeBrea thworkSession = (technique: BreathworkTechnique) => {
    const endTime = new Date();
    const duration = sessionStartRef.current ? 
      (endTime.getTime() - sessionStartRef.current.getTime()) / 1000 / 60 : 0;

    const session: BreathworkSession = {
      sessionId: `breathwork_${userId}_${Date.now()}`,
      technique,
      duration,
      guidanceType: 'ai_guided',
      phases: [], // Would be populated with actual phase data
      breathPattern: {
        patternName: technique.name,
        inhaleCount: 4, // Would be extracted from technique
        holdAfterInhaleCount: 4,
        exhaleCount: 4,
        holdAfterExhaleCount: 4,
        cycles: breathingState.totalCycles,
        rhythm: 'steady'
      },
      heartRateVariability: null,
      physicalSensations: userFeedback.physicalSensations.map(sensation => ({
        sensationId: `sensation_${Date.now()}`,
        type: sensation,
        intensity: 5,
        timing: 'during_practice',
        location: 'general',
        quality: 'positive'
      })),
      emotionalShifts: userFeedback.emotionalShifts.map(shift => ({
        shiftId: `shift_${Date.now()}`,
        fromEmotion: 'stress',
        toEmotion: shift,
        intensity: 7,
        timing: 'during_practice',
        quality: 'positive'
      })),
      visualizations: [],
      insights: [],
      relaxationAchieved: userFeedback.effectiveness,
      clarityGained: Math.min(userFeedback.effectiveness + 1, 10),
      emotionalRelease: userFeedback.effectiveness,
      energyShift: {
        beforeLevel: currentEmotionalState.energyLevel,
        afterLevel: Math.min(currentEmotionalState.energyLevel + 2, 10),
        shiftDirection: 'increased',
        shiftQuality: 'gentle'
      },
      culturalBreathPractice: null,
      ancestralConnection: null,
      traumaInformedModifications: traumaInformedSettings?.gentleApproach ? [
        {
          modification: 'gentle_pacing',
          reason: 'trauma_informed_approach',
          description: 'Slower, gentler approach with emphasis on choice'
        }
      ] : [],
      safetyChecks: [
        {
          checkType: 'comfort_level',
          result: 'comfortable',
          timestamp: new Date(),
          notes: 'User completed session successfully'
        }
      ],
      groundingTechniques: [],
      immediateAftereffects: [],
      integrationPractice: [],
      homewardBound: [],
      startTime: sessionStartRef.current || new Date(),
      endTime,
      effectiveness: userFeedback.effectiveness / 10,
      wouldRepeat: userFeedback.effectiveness > 6,
      recommendedFrequency: userFeedback.effectiveness > 7 ? 'daily' : 'as_needed'
    };

    setSessionData(session);
    onSessionComplete?.(session);
  };

  // Recommended techniques
  const recommendedBreathwork = getRecommendedBreathworkTechniques();
  const recommendedGrounding = getRecommendedGroundingTechniques();

  // Cleanup
  useEffect(() => {
    return () => {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Breathwork & Grounding Techniques
        </h2>
        <p className="text-gray-600">
          Choose gentle practices to regulate your nervous system and find grounding
        </p>
      </div>

      {/* Trauma-Informed Safety Notice */}
      {traumaInformedSettings?.safetyReminders && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Your Wellbeing First</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• You have complete choice in what feels right for you</li>
            <li>• You can stop or modify any practice at any time</li>
            <li>• Only engage with what feels safe and comfortable</li>
            <li>• Trust your body's wisdom and signals</li>
          </ul>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('breathwork')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'breathwork'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Breathwork Practices
        </button>
        <button
          onClick={() => setActiveTab('grounding')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'grounding'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Grounding Techniques
        </button>
      </div>

      {/* Breathwork Tab */}
      {activeTab === 'breathwork' && (
        <div className="space-y-6">
          {/* Active Breathing Session */}
          {breathingState.isActive && selectedTechnique && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {selectedTechnique.name}
              </h3>
              
              {/* Breathing Visual */}
              <div className="flex justify-center mb-6">
                <div 
                  className={`w-32 h-32 rounded-full border-4 transition-all duration-1000 flex items-center justify-center ${
                    breathingState.phase === 'inhale' 
                      ? 'border-blue-400 bg-blue-100 scale-110' 
                      : breathingState.phase === 'exhale'
                      ? 'border-green-400 bg-green-100 scale-90'
                      : 'border-gray-300 bg-gray-100'
                  }`}
                >
                  <span className="text-2xl font-bold text-gray-700">
                    {breathingState.phase === 'inhale' && '↑ IN'}
                    {breathingState.phase === 'exhale' && '↓ OUT'}
                    {breathingState.phase === 'hold_in' && '⏸ HOLD'}
                    {breathingState.phase === 'hold_out' && '⏸ HOLD'}
                    {breathingState.phase === 'pause' && '⏱ READY'}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Cycle {breathingState.cycle + 1} of {breathingState.totalCycles}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((breathingState.cycle) / breathingState.totalCycles) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Stop Button */}
              <button
                onClick={stopBreathingPattern}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Stop Practice
              </button>
            </div>
          )}

          {/* Technique Selection */}
          {!breathingState.isActive && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recommended for You
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {recommendedBreathwork.map((technique) => (
                  <div 
                    key={technique.techniqueId}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => startBreathingPattern(technique)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{technique.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        technique.category === 'calming' ? 'bg-blue-100 text-blue-800' :
                        technique.category === 'energizing' ? 'bg-orange-100 text-orange-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {technique.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{technique.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{Math.floor(technique.duration / 60)} min</span>
                      <span className="capitalize">{technique.difficulty}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {technique.benefits.slice(0, 3).map((benefit) => (
                          <span 
                            key={benefit}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {benefit.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grounding Tab */}
      {activeTab === 'grounding' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Grounding Techniques
          </h3>
          <div className="grid gap-4">
            {recommendedGrounding.map((technique) => (
              <div 
                key={technique.techniqueId}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-800">{technique.name}</h4>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded capitalize">
                    {technique.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{technique.description}</p>
                
                {/* Steps */}
                <div className="space-y-2 mb-4">
                  {technique.steps.map((step) => (
                    <div key={step.step} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 text-sm">{step.instruction}</p>
                        <p className="text-gray-500 text-xs">
                          ~{Math.floor(step.timeLimit / 60)} min
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-1">
                  {technique.benefits.map((benefit) => (
                    <span 
                      key={benefit}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {benefit.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {/* Start Button */}
                <button
                  onClick={() => setSelectedGrounding(technique)}
                  className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start This Practice
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {(sessionData.sessionId || selectedGrounding) && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">How was your practice?</h3>
          
          {/* Effectiveness Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How effective was this practice? (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={userFeedback.effectiveness}
              onChange={(e) => setUserFeedback(prev => ({
                ...prev,
                effectiveness: parseInt(e.target.value)
              }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Not helpful</span>
              <span>Very helpful</span>
            </div>
          </div>

          {/* Physical Sensations */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Physical sensations noticed:
            </label>
            <div className="flex flex-wrap gap-2">
              {['relaxed', 'calmer', 'more_grounded', 'energized', 'peaceful'].map((sensation) => (
                <button
                  key={sensation}
                  onClick={() => setUserFeedback(prev => ({
                    ...prev,
                    physicalSensations: prev.physicalSensations.includes(sensation)
                      ? prev.physicalSensations.filter(s => s !== sensation)
                      : [...prev.physicalSensations, sensation]
                  }))}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    userFeedback.physicalSensations.includes(sensation)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {sensation.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Feedback */}
          <button
            onClick={() => {
              // Handle feedback submission
              console.log('Feedback submitted:', userFeedback);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Share Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default BreathworkGroundingTechniques;