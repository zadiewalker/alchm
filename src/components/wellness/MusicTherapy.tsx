'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

// Music therapy types
interface SoundscapeConfig {
  id: string;
  name: string;
  description: string;
  baseFrequency: number;
  harmonics: number[];
  waveform: OscillatorType;
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  therapeuticPurpose: string;
  chakraAlignment?: string;
}

interface BreathingPattern {
  id: string;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
  description: string;
  benefits: string[];
}

interface MusicSession {
  id: string;
  type: 'soundscape' | 'breathing' | 'toning' | 'rhythm';
  duration: number;
  mood?: MoodType;
  settings: any;
  insights: string[];
  timestamp: Date;
}

interface ToneSettings {
  frequency: number;
  volume: number;
  modulation: number;
  harmonics: boolean;
}

interface RhythmPattern {
  id: string;
  name: string;
  pattern: number[]; // beat pattern in milliseconds
  bpm: number;
  therapeutic: string;
}

interface MusicTherapyProps {
  onSessionComplete?: (session: MusicSession) => void;
  className?: string;
}

// Therapeutic soundscapes based on mood
const MOOD_SOUNDSCAPES: Record<MoodType, SoundscapeConfig[]> = {
  raw: [
    {
      id: 'ocean_depth',
      name: 'Ocean Depths',
      description: 'Deep, processing waves for emotional release',
      baseFrequency: 40,
      harmonics: [2, 3, 5],
      waveform: 'sine',
      envelope: { attack: 2, decay: 1, sustain: 0.7, release: 3 },
      therapeuticPurpose: 'Emotional release and processing',
      chakraAlignment: 'Sacral'
    },
    {
      id: 'storm_clearing',
      name: 'Storm Clearing',
      description: 'Turbulent energy moving toward calm',
      baseFrequency: 55,
      harmonics: [2, 4, 7],
      waveform: 'triangle',
      envelope: { attack: 0.5, decay: 2, sustain: 0.5, release: 4 },
      therapeuticPurpose: 'Transformation through intensity',
      chakraAlignment: 'Solar Plexus'
    }
  ],
  tender: [
    {
      id: 'gentle_embrace',
      name: 'Gentle Embrace',
      description: 'Soft, nurturing frequencies for self-compassion',
      baseFrequency: 136.1, // Om frequency
      harmonics: [2, 3],
      waveform: 'sine',
      envelope: { attack: 3, decay: 2, sustain: 0.8, release: 4 },
      therapeuticPurpose: 'Self-compassion and healing',
      chakraAlignment: 'Heart'
    },
    {
      id: 'mother_earth',
      name: 'Mother Earth',
      description: 'Grounding frequencies for safety and comfort',
      baseFrequency: 256, // C note
      harmonics: [2, 4],
      waveform: 'sine',
      envelope: { attack: 4, decay: 1, sustain: 0.9, release: 5 },
      therapeuticPurpose: 'Safety and nurturing connection',
      chakraAlignment: 'Root'
    }
  ],
  empowered: [
    {
      id: 'inner_fire',
      name: 'Inner Fire',
      description: 'Energizing frequencies to fuel confidence',
      baseFrequency: 741, // Healing frequency
      harmonics: [2, 3, 5],
      waveform: 'sawtooth',
      envelope: { attack: 1, decay: 0.5, sustain: 0.8, release: 2 },
      therapeuticPurpose: 'Confidence and personal power',
      chakraAlignment: 'Solar Plexus'
    },
    {
      id: 'victory_march',
      name: 'Victory March',
      description: 'Rhythmic power for action and achievement',
      baseFrequency: 528, // Love frequency
      harmonics: [2, 4, 6],
      waveform: 'square',
      envelope: { attack: 0.5, decay: 0.5, sustain: 0.7, release: 1 },
      therapeuticPurpose: 'Motivation and achievement',
      chakraAlignment: 'Solar Plexus'
    }
  ],
  contemplative: [
    {
      id: 'deep_space',
      name: 'Deep Space',
      description: 'Expansive frequencies for meditation and insight',
      baseFrequency: 432, // Universal frequency
      harmonics: [2, 3, 7],
      waveform: 'sine',
      envelope: { attack: 5, decay: 3, sustain: 0.9, release: 6 },
      therapeuticPurpose: 'Deep meditation and insight',
      chakraAlignment: 'Third Eye'
    },
    {
      id: 'ancient_wisdom',
      name: 'Ancient Wisdom',
      description: 'Sacred frequencies for spiritual connection',
      baseFrequency: 963, // Crown chakra
      harmonics: [2, 5],
      waveform: 'sine',
      envelope: { attack: 6, decay: 2, sustain: 0.95, release: 8 },
      therapeuticPurpose: 'Spiritual connection and wisdom',
      chakraAlignment: 'Crown'
    }
  ],
  grateful: [
    {
      id: 'heart_opening',
      name: 'Heart Opening',
      description: 'Love frequencies for gratitude and connection',
      baseFrequency: 528, // Love frequency
      harmonics: [2, 3, 4],
      waveform: 'sine',
      envelope: { attack: 2, decay: 1, sustain: 0.85, release: 3 },
      therapeuticPurpose: 'Gratitude and heart connection',
      chakraAlignment: 'Heart'
    },
    {
      id: 'golden_light',
      name: 'Golden Light',
      description: 'Uplifting frequencies for joy and appreciation',
      baseFrequency: 639, // Harmony frequency
      harmonics: [2, 4],
      waveform: 'triangle',
      envelope: { attack: 1, decay: 0.5, sustain: 0.8, release: 2 },
      therapeuticPurpose: 'Joy and harmonious connection',
      chakraAlignment: 'Heart'
    }
  ]
};

// Breathing patterns for different moods
const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box_breathing',
    name: 'Box Breathing',
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 8,
    description: 'Equal counts for balance and calm',
    benefits: ['Reduces anxiety', 'Improves focus', 'Balances nervous system']
  },
  {
    id: 'coherent_breathing',
    name: 'Coherent Breathing',
    inhale: 5,
    hold: 0,
    exhale: 5,
    cycles: 10,
    description: 'Heart rate variability optimization',
    benefits: ['Heart coherence', 'Emotional balance', 'Stress reduction']
  },
  {
    id: 'release_breath',
    name: 'Release Breath',
    inhale: 4,
    hold: 2,
    exhale: 8,
    cycles: 6,
    description: 'Longer exhale for releasing tension',
    benefits: ['Activates parasympathetic', 'Releases trauma', 'Promotes letting go']
  },
  {
    id: 'energizing_breath',
    name: 'Energizing Breath',
    inhale: 6,
    hold: 2,
    exhale: 4,
    cycles: 8,
    description: 'Longer inhale for energy and vitality',
    benefits: ['Increases energy', 'Improves alertness', 'Builds confidence']
  }
];

// Rhythm patterns for emotional regulation
const RHYTHM_PATTERNS: RhythmPattern[] = [
  {
    id: 'heartbeat',
    name: 'Heartbeat',
    pattern: [800, 200, 800, 1200], // lub-dub pattern
    bpm: 60,
    therapeutic: 'Synchronizes with natural heart rhythm for grounding'
  },
  {
    id: 'ocean_waves',
    name: 'Ocean Waves',
    pattern: [2000, 1000, 3000, 2000],
    bpm: 40,
    therapeutic: 'Mimics ocean rhythm for deep relaxation and processing'
  },
  {
    id: 'walking_meditation',
    name: 'Walking Meditation',
    pattern: [600, 600, 600, 600],
    bpm: 90,
    therapeutic: 'Steady rhythm for mindful movement and grounding'
  }
];

const MusicTherapy: React.FC<MusicTherapyProps> = ({
  onSessionComplete,
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState<'soundscape' | 'breathing' | 'toning' | 'rhythm' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSoundscape, setSelectedSoundscape] = useState<SoundscapeConfig | null>(null);
  const [selectedBreathing, setSelectedBreathing] = useState<BreathingPattern | null>(null);
  const [selectedRhythm, setSelectedRhythm] = useState<RhythmPattern | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [breathingCount, setBreathingCount] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [toneSettings, setToneSettings] = useState<ToneSettings>({
    frequency: 432,
    volume: 0.5,
    modulation: 0,
    harmonics: false
  });

  // Audio context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { currentMood, getMoodData } = useMoodContext();

  // Get mood-appropriate soundscapes
  const availableSoundscapes = useMemo(() => {
    if (!currentMood) return [];
    return MOOD_SOUNDSCAPES[currentMood] || [];
  }, [currentMood]);

  // Initialize audio context
  const initializeAudio = useCallback(async () => {
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  // Create oscillator for soundscape
  const createOscillator = useCallback((config: SoundscapeConfig, harmonicMultiplier = 1) => {
    const ctx = audioContextRef.current;
    const gainNode = gainNodeRef.current;
    if (!ctx || !gainNode) return null;

    const oscillator = ctx.createOscillator();
    const oscGain = ctx.createGain();

    oscillator.type = config.waveform;
    oscillator.frequency.setValueAtTime(config.baseFrequency * harmonicMultiplier, ctx.currentTime);

    // Apply envelope
    const { attack, decay, sustain, release } = config.envelope;
    const now = ctx.currentTime;
    
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.3, now + attack);
    oscGain.gain.linearRampToValueAtTime(sustain * 0.3, now + attack + decay);

    oscillator.connect(oscGain);
    oscGain.connect(gainNode);

    return { oscillator, gain: oscGain };
  }, []);

  // Start soundscape
  const startSoundscape = useCallback(async (config: SoundscapeConfig) => {
    await initializeAudio();
    
    const oscillators: OscillatorNode[] = [];
    
    // Create base frequency
    const baseOsc = createOscillator(config);
    if (baseOsc) {
      baseOsc.oscillator.start();
      oscillators.push(baseOsc.oscillator);
    }

    // Create harmonics
    config.harmonics.forEach(harmonic => {
      const harmOsc = createOscillator(config, harmonic);
      if (harmOsc) {
        harmOsc.gain.gain.value *= 0.3; // Harmonics quieter than base
        harmOsc.oscillator.start();
        oscillators.push(harmOsc.oscillator);
      }
    });

    oscillatorsRef.current = oscillators;
    setIsPlaying(true);
    
    // Start session timer
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [initializeAudio, createOscillator]);

  // Stop all audio
  const stopAudio = useCallback(() => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
    
    setIsPlaying(false);
    setBreathingPhase('rest');
    setCurrentCycle(0);
    setBreathingCount(0);
  }, []);

  // Start breathing exercise
  const startBreathingExercise = useCallback((pattern: BreathingPattern) => {
    setCurrentCycle(0);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    
    const runCycle = (cycleNumber: number) => {
      if (cycleNumber >= pattern.cycles) {
        setBreathingPhase('rest');
        setIsPlaying(false);
        return;
      }
      
      setCurrentCycle(cycleNumber + 1);
      
      // Inhale
      setBreathingPhase('inhale');
      setBreathingCount(pattern.inhale);
      
      const countDown = (phase: typeof breathingPhase, count: number, nextPhase: typeof breathingPhase, nextCount: number, callback?: () => void) => {
        if (count <= 0) {
          if (callback) callback();
          else if (nextPhase !== 'rest') {
            countDown(nextPhase, nextCount, 'rest', 0);
          }
          return;
        }
        
        setBreathingCount(count);
        breathingTimerRef.current = setTimeout(() => {
          countDown(phase, count - 1, nextPhase, nextCount, callback);
        }, 1000);
      };
      
      countDown('inhale', pattern.inhale, 'hold', pattern.hold, () => {
        if (pattern.hold > 0) {
          setBreathingPhase('hold');
          countDown('hold', pattern.hold, 'exhale', pattern.exhale, () => {
            setBreathingPhase('exhale');
            countDown('exhale', pattern.exhale, 'rest', 0, () => {
              setTimeout(() => runCycle(cycleNumber + 1), 1000);
            });
          });
        } else {
          setBreathingPhase('exhale');
          countDown('exhale', pattern.exhale, 'rest', 0, () => {
            setTimeout(() => runCycle(cycleNumber + 1), 1000);
          });
        }
      });
    };
    
    setIsPlaying(true);
    runCycle(0);
    
    // Start session timer
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  }, []);

  // Create toning frequency
  const startToning = useCallback(async () => {
    await initializeAudio();
    
    const ctx = audioContextRef.current;
    const gainNode = gainNodeRef.current;
    if (!ctx || !gainNode) return;

    const oscillator = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(toneSettings.frequency, ctx.currentTime);
    
    // Apply modulation if enabled
    if (toneSettings.modulation > 0) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(toneSettings.modulation, ctx.currentTime);
      lfoGain.gain.setValueAtTime(10, ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfo.start();
    }
    
    oscGain.gain.setValueAtTime(toneSettings.volume * 0.3, ctx.currentTime);
    
    oscillator.connect(oscGain);
    oscGain.connect(gainNode);
    
    oscillator.start();
    oscillatorsRef.current = [oscillator];
    
    setIsPlaying(true);
    
    // Start session timer
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  }, [initializeAudio, toneSettings]);

  // Save session
  const saveSession = useCallback(() => {
    if (sessionDuration < 10) return; // Minimum session length
    
    const session: MusicSession = {
      id: Date.now().toString(),
      type: activeMode!,
      duration: sessionDuration,
      mood: currentMood || undefined,
      settings: {
        soundscape: selectedSoundscape?.id,
        breathing: selectedBreathing?.id,
        rhythm: selectedRhythm?.id,
        toneSettings: activeMode === 'toning' ? toneSettings : undefined
      },
      insights: [
        `${Math.floor(sessionDuration / 60)} minutes of ${activeMode} therapy`,
        currentMood ? `Aligned with ${currentMood} energy` : 'Personalized healing session',
        activeMode === 'breathing' ? `Completed ${currentCycle} breathing cycles` : `Therapeutic sound immersion`
      ],
      timestamp: new Date()
    };
    
    // Save to localStorage
    const savedSessions = JSON.parse(localStorage.getItem('alchm_music_sessions') || '[]');
    savedSessions.push(session);
    localStorage.setItem('alchm_music_sessions', JSON.stringify(savedSessions));
    
    onSessionComplete?.(session);
    
    // Reset session
    setSessionDuration(0);
    setActiveMode(null);
    
    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [sessionDuration, activeMode, currentMood, selectedSoundscape, selectedBreathing, selectedRhythm, toneSettings, currentCycle, onSessionComplete]);

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [stopAudio]);

  return (
    <div className={`music-therapy ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Music Therapy Studio
        </h3>
        <p className="text-sm text-gray-600">
          Healing through sound, rhythm, and breath
        </p>
      </div>

      {/* Mode Selection */}
      {!activeMode && (
        <div className="mode-selection grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          
          {/* Soundscapes */}
          <button
            onClick={() => setActiveMode('soundscape')}
            disabled={availableSoundscapes.length === 0}
            className="mode-card p-6 bg-gradient-to-br from-sage-100 to-green-100 rounded-2xl text-center hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-3xl mb-2">🌊</div>
            <h4 className="font-medium text-gray-800 mb-1">Soundscapes</h4>
            <p className="text-xs text-gray-600">Therapeutic frequencies</p>
            {currentMood && (
              <p className="text-xs text-sage-600 mt-1">{availableSoundscapes.length} for {currentMood}</p>
            )}
          </button>

          {/* Breathing */}
          <button
            onClick={() => setActiveMode('breathing')}
            className="mode-card p-6 bg-gradient-to-br from-blue-100 to-sky-100 rounded-2xl text-center hover:shadow-md transition-all duration-200"
          >
            <div className="text-3xl mb-2">🫁</div>
            <h4 className="font-medium text-gray-800 mb-1">Breathing</h4>
            <p className="text-xs text-gray-600">Guided breath work</p>
          </button>

          {/* Toning */}
          <button
            onClick={() => setActiveMode('toning')}
            className="mode-card p-6 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl text-center hover:shadow-md transition-all duration-200"
          >
            <div className="text-3xl mb-2">🎵</div>
            <h4 className="font-medium text-gray-800 mb-1">Toning</h4>
            <p className="text-xs text-gray-600">Sacred frequencies</p>
          </button>

          {/* Rhythm */}
          <button
            onClick={() => setActiveMode('rhythm')}
            className="mode-card p-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl text-center hover:shadow-md transition-all duration-200"
          >
            <div className="text-3xl mb-2">🥁</div>
            <h4 className="font-medium text-gray-800 mb-1">Rhythm</h4>
            <p className="text-xs text-gray-600">Regulatory patterns</p>
          </button>
        </div>
      )}

      {/* Soundscape Mode */}
      {activeMode === 'soundscape' && (
        <div className="soundscape-mode bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-medium text-gray-800">Therapeutic Soundscapes</h4>
            <button
              onClick={() => {stopAudio(); setActiveMode(null);}}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
          </div>

          {!selectedSoundscape ? (
            <div className="soundscape-selection space-y-4">
              {availableSoundscapes.map(soundscape => (
                <button
                  key={soundscape.id}
                  onClick={() => setSelectedSoundscape(soundscape)}
                  className="w-full p-4 bg-sage-50 rounded-xl text-left hover:bg-sage-100 transition-colors"
                >
                  <div className="font-medium text-gray-800">{soundscape.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{soundscape.description}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sage-600">{soundscape.therapeuticPurpose}</span>
                    {soundscape.chakraAlignment && (
                      <span className="text-purple-600">{soundscape.chakraAlignment} Chakra</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="soundscape-player text-center">
              <div className="mb-6">
                <h5 className="text-xl font-medium text-gray-800 mb-2">{selectedSoundscape.name}</h5>
                <p className="text-gray-600 mb-4">{selectedSoundscape.description}</p>
                
                {/* Frequency Visualization */}
                <div className="frequency-display mb-6 p-4 bg-sage-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Base Frequency: {selectedSoundscape.baseFrequency}Hz</div>
                  <div className="frequency-bars flex justify-center items-end gap-1 h-16">
                    {[selectedSoundscape.baseFrequency, ...selectedSoundscape.harmonics.map(h => selectedSoundscape.baseFrequency * h)].map((freq, i) => (
                      <div
                        key={i}
                        className={`frequency-bar rounded-t-lg ${isPlaying ? 'animate-pulse' : ''}`}
                        style={{
                          width: '12px',
                          height: `${Math.min(60, (Math.log(freq) / Math.log(2000)) * 60)}px`,
                          backgroundColor: i === 0 ? '#a4b792' : '#c8d4b8'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="playback-controls mb-6">
                <button
                  onClick={isPlaying ? stopAudio : () => startSoundscape(selectedSoundscape)}
                  className={`play-button w-20 h-20 rounded-full border-4 text-2xl transition-all duration-300 ${
                    isPlaying 
                      ? 'bg-red-400 border-red-300 text-white animate-pulse'
                      : 'bg-sage-400 border-sage-300 text-white hover:bg-sage-500 hover:scale-105'
                  }`}
                >
                  {isPlaying ? '⏹️' : '▶️'}
                </button>
                
                {isPlaying && (
                  <div className="mt-4">
                    <div className="text-2xl font-light text-gray-700">{formatTime(sessionDuration)}</div>
                    <div className="text-sm text-gray-500">Session in progress</div>
                  </div>
                )}
              </div>

              {/* Session Actions */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setSelectedSoundscape(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Choose Different
                </button>
                
                {sessionDuration > 10 && (
                  <button
                    onClick={saveSession}
                    className="px-6 py-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors"
                  >
                    Complete Session
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Breathing Mode */}
      {activeMode === 'breathing' && (
        <div className="breathing-mode bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-medium text-gray-800">Guided Breathing</h4>
            <button
              onClick={() => {stopAudio(); setActiveMode(null);}}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
          </div>

          {!selectedBreathing ? (
            <div className="breathing-selection space-y-4">
              {BREATHING_PATTERNS.map(pattern => (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedBreathing(pattern)}
                  className="w-full p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium text-gray-800">{pattern.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{pattern.description}</div>
                  <div className="text-xs text-blue-600">
                    {pattern.inhale}s inhale • {pattern.hold > 0 ? `${pattern.hold}s hold • ` : ''}{pattern.exhale}s exhale • {pattern.cycles} cycles
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {pattern.benefits.map((benefit, i) => (
                      <span key={i} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="breathing-exercise text-center">
              <div className="mb-6">
                <h5 className="text-xl font-medium text-gray-800 mb-2">{selectedBreathing.name}</h5>
                <p className="text-gray-600">{selectedBreathing.description}</p>
              </div>

              {/* Breathing Visualization */}
              <div className="breathing-circle mb-8 flex justify-center">
                <div 
                  className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
                    breathingPhase === 'inhale' ? 'border-green-400 bg-green-100 scale-110' :
                    breathingPhase === 'hold' ? 'border-yellow-400 bg-yellow-100 scale-110' :
                    breathingPhase === 'exhale' ? 'border-blue-400 bg-blue-100 scale-90' :
                    'border-gray-300 bg-gray-50 scale-100'
                  }`}
                >
                  {isPlaying ? (
                    <div className="text-center">
                      <div className="text-2xl font-light text-gray-700">{breathingCount}</div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        {breathingPhase === 'rest' ? 'Ready' : breathingPhase}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-lg text-gray-600">Ready</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress */}
              {isPlaying && (
                <div className="progress mb-6">
                  <div className="text-sm text-gray-600 mb-2">
                    Cycle {currentCycle} of {selectedBreathing.cycles}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sage-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentCycle / selectedBreathing.cycles) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setSelectedBreathing(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Choose Different
                </button>
                
                <button
                  onClick={isPlaying ? stopAudio : () => startBreathingExercise(selectedBreathing)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isPlaying
                      ? 'bg-red-400 text-white hover:bg-red-500'
                      : 'bg-blue-400 text-white hover:bg-blue-500'
                  }`}
                >
                  {isPlaying ? 'Stop Exercise' : 'Begin Breathing'}
                </button>
                
                {sessionDuration > 30 && !isPlaying && (
                  <button
                    onClick={saveSession}
                    className="px-6 py-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors"
                  >
                    Save Session
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toning Mode */}
      {activeMode === 'toning' && (
        <div className="toning-mode bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-medium text-gray-800">Sacred Toning</h4>
            <button
              onClick={() => {stopAudio(); setActiveMode(null);}}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
          </div>

          <div className="toning-controls space-y-6">
            
            {/* Frequency Control */}
            <div className="frequency-control">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Frequency: {toneSettings.frequency}Hz
              </label>
              <input
                type="range"
                min="40"
                max="1000"
                step="1"
                value={toneSettings.frequency}
                onChange={(e) => setToneSettings(prev => ({ ...prev, frequency: Number(e.target.value) }))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Deep Grounding</span>
                <span>Heart Opening</span>
                <span>Spiritual Connection</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="volume-control">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Volume: {Math.round(toneSettings.volume * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={toneSettings.volume}
                onChange={(e) => setToneSettings(prev => ({ ...prev, volume: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Modulation Control */}
            <div className="modulation-control">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Modulation: {toneSettings.modulation}Hz
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={toneSettings.modulation}
                onChange={(e) => setToneSettings(prev => ({ ...prev, modulation: Number(e.target.value) }))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                {toneSettings.modulation === 0 ? 'Pure tone' : 'Gentle vibrato for deeper resonance'}
              </p>
            </div>

            {/* Preset Frequencies */}
            <div className="preset-frequencies">
              <div className="text-sm font-medium text-gray-700 mb-3">Sacred Frequencies</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { freq: 136.1, name: 'Om', chakra: 'Universal' },
                  { freq: 256, name: 'Root', chakra: 'Grounding' },
                  { freq: 432, name: 'Universal', chakra: 'Harmony' },
                  { freq: 528, name: 'Love', chakra: 'Heart' },
                  { freq: 639, name: 'Connection', chakra: 'Throat' },
                  { freq: 741, name: 'Healing', chakra: 'Third Eye' },
                  { freq: 852, name: 'Intuition', chakra: 'Third Eye' },
                  { freq: 963, name: 'Crown', chakra: 'Spiritual' }
                ].map(preset => (
                  <button
                    key={preset.freq}
                    onClick={() => setToneSettings(prev => ({ ...prev, frequency: preset.freq }))}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      Math.abs(toneSettings.frequency - preset.freq) < 1
                        ? 'bg-purple-400 text-white'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs opacity-75">{preset.freq}Hz</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Toning Controls */}
            <div className="toning-playback text-center">
              <button
                onClick={isPlaying ? stopAudio : startToning}
                className={`w-20 h-20 rounded-full border-4 text-2xl transition-all duration-300 mb-4 ${
                  isPlaying 
                    ? 'bg-red-400 border-red-300 text-white animate-pulse'
                    : 'bg-purple-400 border-purple-300 text-white hover:bg-purple-500 hover:scale-105'
                }`}
              >
                {isPlaying ? '⏹️' : '🎵'}
              </button>
              
              {isPlaying && (
                <div className="mb-4">
                  <div className="text-2xl font-light text-gray-700">{formatTime(sessionDuration)}</div>
                  <div className="text-sm text-gray-500">Toning session</div>
                </div>
              )}
              
              {sessionDuration > 10 && (
                <button
                  onClick={saveSession}
                  className="px-6 py-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors"
                >
                  Complete Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicTherapy;