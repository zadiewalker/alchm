'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSacredMicrocopy } from '@/components/SacredMicrocopyProvider';

// ===== KHEPERA EMOTIONAL MIRROR TYPES =====

export interface KheperaState {
  mode: 'reflective' | 'present' | 'affirming';
  intensity: 'gentle' | 'medium' | 'deep'; // How present Khepera feels
  culturalResonance: 'universal' | 'indigenous' | 'african_diaspora' | 'east_asian' | 'latin_american' | 'middle_eastern' | 'european' | 'bridge';
  breathingPhase: 'inhale' | 'pause_in' | 'exhale' | 'pause_out'; // 6 breaths per minute = 10s cycle
  isListening: boolean; // Whether actively receiving input
  lastInteraction: Date;
  sessionDepth: 'surface' | 'exploring' | 'witnessing' | 'integration'; // Journey depth
}

export interface KheperaReflection {
  id: string;
  userInput: string;
  kheperaResponse: string;
  emotionalMirror: {
    detected: string[]; // Emotions/themes detected
    reflected: string; // How Khepera mirrors back
    depth: 'acknowledgment' | 'gentle_exploration' | 'deep_witnessing';
  };
  culturalAdaptation?: {
    tradition: string;
    wisdom: string;
    symbol: string;
  };
  timestamp: Date;
  sessionContext: string;
}

export interface KheperaPersona {
  iconography: {
    scarab: {
      base: string; // SVG path for scarab beetle
      raisingSun: string; // SVG path for sun behind scarab
      breathingAura: string; // SVG path for breathing halo
    };
    culturalSymbols: {
      [key: string]: string; // Cultural adaptations of the scarab/sun motif
    };
  };
  voiceTone: {
    reflective: {
      greeting: string;
      prompts: string[];
      acknowledgments: string[];
      transitions: string[];
    };
    present: {
      greeting: string;
      prompts: string[];
      acknowledgments: string[];
      transitions: string[];
    };
    affirming: {
      greeting: string;
      prompts: string[];
      acknowledgments: string[];
      transitions: string[];
    };
  };
  breathingRhythm: {
    cycleLength: number; // 10 seconds for 6 breaths per minute
    inhaleLength: number; // 4 seconds
    pauseInLength: number; // 1 second
    exhaleLength: number; // 4 seconds
    pauseOutLength: number; // 1 second
  };
}

// ===== KHEPERA EMOTIONAL MIRROR COMPONENT =====

export interface KheperaEmotionalMirrorProps {
  userId: string;
  culturalContext?: string;
  initialMode?: KheperaState['mode'];
  sessionType?: 'journaling' | 'reflection' | 'crisis_support' | 'integration';
  className?: string;
}

export function KheperaEmotionalMirror({
  userId,
  culturalContext = 'universal',
  initialMode = 'present',
  sessionType = 'reflection',
  className = ''
}: KheperaEmotionalMirrorProps) {
  const [kheperaState, setKheperaState] = useState<KheperaState>({
    mode: initialMode,
    intensity: 'gentle',
    culturalResonance: culturalContext as KheperaState['culturalResonance'],
    breathingPhase: 'exhale',
    isListening: false,
    lastInteraction: new Date(),
    sessionDepth: 'surface'
  });

  const [userInput, setUserInput] = useState('');
  const [reflectionHistory, setReflectionHistory] = useState<KheperaReflection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKhepera, setShowKhepera] = useState(true);

  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { copy } = useSacredMicrocopy();

  // Initialize breathing cycle
  useEffect(() => {
    startBreathingCycle();
    return () => {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }
    };
  }, []);

  // Update Khepera's mode based on session context
  useEffect(() => {
    updateKheperaMode();
  }, [reflectionHistory.length, sessionType]);

  const startBreathingCycle = () => {
    const cycleBreathing = () => {
      const phases: KheperaState['breathingPhase'][] = ['inhale', 'pause_in', 'exhale', 'pause_out'];
      const durations = [4000, 1000, 4000, 1000]; // 4s inhale, 1s pause, 4s exhale, 1s pause
      
      let currentPhaseIndex = 0;
      
      const nextPhase = () => {
        setKheperaState(prev => ({
          ...prev,
          breathingPhase: phases[currentPhaseIndex]
        }));
        
        breathingTimerRef.current = setTimeout(() => {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          nextPhase();
        }, durations[currentPhaseIndex]);
      };
      
      nextPhase();
    };
    
    cycleBreathing();
  };

  const updateKheperaMode = () => {
    const historyLength = reflectionHistory.length;
    const recentReflections = reflectionHistory.slice(-3);
    
    // Determine appropriate mode based on session context
    let newMode: KheperaState['mode'] = 'present';
    let newDepth: KheperaState['sessionDepth'] = 'surface';
    let newIntensity: KheperaState['intensity'] = 'gentle';

    if (sessionType === 'crisis_support') {
      newMode = 'present';
      newIntensity = 'deep';
      newDepth = 'witnessing';
    } else if (historyLength === 0) {
      newMode = 'present';
      newDepth = 'surface';
    } else if (historyLength <= 2) {
      newMode = 'reflective';
      newDepth = 'exploring';
    } else if (recentReflections.some(r => r.emotionalMirror.depth === 'deep_witnessing')) {
      newMode = 'affirming';
      newDepth = 'integration';
      newIntensity = 'medium';
    } else {
      newMode = 'reflective';
      newDepth = 'witnessing';
    }

    setKheperaState(prev => ({
      ...prev,
      mode: newMode,
      sessionDepth: newDepth,
      intensity: newIntensity
    }));
  };

  const processUserReflection = async () => {
    if (!userInput.trim()) return;
    
    setIsProcessing(true);
    setKheperaState(prev => ({ ...prev, isListening: true }));

    // Simulate processing time for therapeutic pacing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate Khepera's mirror response
    const reflection = generateKheperaReflection(userInput, kheperaState);
    
    setReflectionHistory(prev => [...prev, reflection]);
    setUserInput('');
    setIsProcessing(false);
    setKheperaState(prev => ({ 
      ...prev, 
      isListening: false, 
      lastInteraction: new Date() 
    }));
  };

  const generateKheperaReflection = (input: string, state: KheperaState): KheperaReflection => {
    // This would integrate with actual AI in production
    const emotionalMirror = analyzeEmotionalContent(input);
    const culturalWisdom = getCulturalWisdom(state.culturalResonance);
    
    return {
      id: `reflection-${Date.now()}`,
      userInput: input,
      kheperaResponse: generateMirrorResponse(input, state, emotionalMirror),
      emotionalMirror,
      culturalAdaptation: culturalWisdom,
      timestamp: new Date(),
      sessionContext: `${state.mode}_${state.sessionDepth}`
    };
  };

  const analyzeEmotionalContent = (input: string) => {
    // Simplified emotional detection - would use actual AI analysis
    const emotions = [];
    if (input.toLowerCase().includes('sad') || input.toLowerCase().includes('hurt')) emotions.push('sadness');
    if (input.toLowerCase().includes('angry') || input.toLowerCase().includes('frustrated')) emotions.push('anger');
    if (input.toLowerCase().includes('grateful') || input.toLowerCase().includes('thankful')) emotions.push('gratitude');
    if (input.toLowerCase().includes('scared') || input.toLowerCase().includes('anxious')) emotions.push('fear');
    
    const depth = input.length > 200 ? 'deep_witnessing' : 
                  input.length > 50 ? 'gentle_exploration' : 'acknowledgment';
    
    return {
      detected: emotions.length > 0 ? emotions : ['reflection'],
      reflected: `I sense ${emotions.length > 0 ? emotions.join(' and ') : 'something stirring'} in your words`,
      depth: depth as 'acknowledgment' | 'gentle_exploration' | 'deep_witnessing'
    };
  };

  const getCulturalWisdom = (culturalContext: string) => {
    const wisdomMap = {
      'african_diaspora': {
        tradition: 'Ubuntu',
        wisdom: 'I am because we are - your healing ripples through the community',
        symbol: '🌍'
      },
      'indigenous': {
        tradition: 'Seven Generations',
        wisdom: 'This healing honors your ancestors and blesses the children coming',
        symbol: '🦅'
      },
      'east_asian': {
        tradition: 'Wu Wei',
        wisdom: 'In not forcing, you allow the natural flow of healing to emerge',
        symbol: '☯️'
      },
      'universal': {
        tradition: 'Ancient Wisdom',
        wisdom: 'The scarab teaches us that transformation happens in darkness before the light',
        symbol: '🌅'
      }
    };
    
    return wisdomMap[culturalContext as keyof typeof wisdomMap] || wisdomMap.universal;
  };

  const generateMirrorResponse = (input: string, state: KheperaState, mirror: any): string => {
    const responses = getKheperaVoice(state.mode, state.culturalResonance);
    
    if (state.mode === 'reflective') {
      return `${mirror.reflected}. What wants to be explored further in this feeling?`;
    } else if (state.mode === 'affirming') {
      return `Your courage in sharing this is witnessed. What wisdom is emerging for you?`;
    } else {
      return `I am here, holding space for whatever wants to emerge. Take your time.`;
    }
  };

  const getKheperaVoice = (mode: KheperaState['mode'], cultural: string) => {
    // Would return culturally adapted voice patterns
    return {
      greeting: "I witness your presence here",
      acknowledgment: "Your words are held in sacred space"
    };
  };

  return (
    <div className={`khepera-emotional-mirror ${className}`}>
      {/* Khepera Presence Avatar */}
      <div className="khepera-presence-container flex flex-col items-center mb-ritual">
        <KheperaScarabAvatar 
          state={kheperaState}
          isVisible={showKhepera}
          onPresenceToggle={setShowKhepera}
        />
        
        {/* Khepera's Current State Indicator */}
        <div className="khepera-state-indicator mt-gentle text-center">
          <p className="text-breath text-secondary capitalize">
            {kheperaState.mode} presence • {kheperaState.sessionDepth} witnessing
          </p>
        </div>
      </div>

      {/* Reflection History */}
      <div className="reflection-history mb-ritual">
        {reflectionHistory.map(reflection => (
          <ReflectionMirror 
            key={reflection.id}
            reflection={reflection}
            kheperaState={kheperaState}
          />
        ))}
      </div>

      {/* User Input Interface */}
      <div className="user-reflection-interface">
        <SacredReflectionInput
          value={userInput}
          onChange={setUserInput}
          onSubmit={processUserReflection}
          isProcessing={isProcessing}
          kheperaState={kheperaState}
          placeholder={getContextualPlaceholder(kheperaState)}
        />
      </div>

      {/* Khepera Processing State */}
      {isProcessing && (
        <KheperaProcessingState state={kheperaState} />
      )}
    </div>
  );
}

// ===== KHEPERA SCARAB AVATAR COMPONENT =====

interface KheperaScarabAvatarProps {
  state: KheperaState;
  isVisible: boolean;
  onPresenceToggle: (visible: boolean) => void;
}

function KheperaScarabAvatar({ state, isVisible, onPresenceToggle }: KheperaScarabAvatarProps) {
  const getBreathingScale = () => {
    switch (state.breathingPhase) {
      case 'inhale': return 1.1;
      case 'pause_in': return 1.1;
      case 'exhale': return 1.0;
      case 'pause_out': return 1.0;
      default: return 1.0;
    }
  };

  const getAuraOpacity = () => {
    switch (state.breathingPhase) {
      case 'inhale': return 0.8;
      case 'pause_in': return 0.9;
      case 'exhale': return 0.4;
      case 'pause_out': return 0.3;
      default: return 0.5;
    }
  };

  const getModeColor = () => {
    switch (state.mode) {
      case 'reflective': return '#a4b792'; // Sage
      case 'present': return '#cb997e'; // Warm terra
      case 'affirming': return '#eeddd3'; // Soft blush
      default: return '#a4b792';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => onPresenceToggle(true)}
        className="khepera-summon-button sacred-button intention-gentle"
      >
        <span className="mr-whisper">⚪</span>
        Invite Khepera's presence
      </button>
    );
  }

  return (
    <div className="khepera-scarab-avatar relative">
      {/* Breathing Aura */}
      <div 
        className="khepera-breathing-aura absolute inset-0 rounded-full transition-all duration-2000 ease-linear"
        style={{
          background: `radial-gradient(circle, ${getModeColor()}20 0%, transparent 70%)`,
          transform: `scale(${getBreathingScale()})`,
          opacity: getAuraOpacity(),
          width: '120px',
          height: '120px',
          top: '-10px',
          left: '-10px'
        }}
      />
      
      {/* Khepera Scarab SVG */}
      <div className="khepera-scarab-container relative w-24 h-24 flex items-center justify-center">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="khepera-scarab-svg"
          style={{ filter: `drop-shadow(0 0 8px ${getModeColor()}40)` }}
        >
          {/* Rising Sun Background */}
          <defs>
            <radialGradient id="raisingSun" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#f9f6f1" stopOpacity="0.8"/>
              <stop offset="50%" stopColor={getModeColor()} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={getModeColor()} stopOpacity="0.1"/>
            </radialGradient>
          </defs>
          
          {/* Sun Rays */}
          <g className="sun-rays" stroke={getModeColor()} strokeWidth="1" fill="none" opacity="0.6">
            <line x1="40" y1="10" x2="40" y2="20" />
            <line x1="55" y1="15" x2="50" y2="23" />
            <line x1="65" y1="25" x2="57" y2="30" />
            <line x1="70" y1="40" x2="60" y2="40" />
            <line x1="65" y1="55" x2="57" y2="50" />
            <line x1="25" y1="15" x2="30" y2="23" />
            <line x1="15" y1="25" x2="23" y2="30" />
            <line x1="10" y1="40" x2="20" y2="40" />
            <line x1="15" y1="55" x2="23" y2="50" />
          </g>
          
          {/* Rising Sun Circle */}
          <circle 
            cx="40" 
            cy="40" 
            r="25" 
            fill="url(#raisingSun)"
            className="transition-all duration-2000"
          />
          
          {/* Scarab Beetle Body */}
          <g className="scarab-beetle" fill={getModeColor()} stroke="none">
            {/* Scarab Head */}
            <ellipse cx="40" cy="30" rx="8" ry="6" />
            
            {/* Scarab Body Segments */}
            <ellipse cx="40" cy="40" rx="12" ry="8" />
            <ellipse cx="40" cy="48" rx="10" ry="6" />
            <ellipse cx="40" cy="54" rx="7" ry="4" />
            
            {/* Scarab Wings */}
            <path d="M 28 35 Q 20 25 25 40 Q 28 45 32 42 Z" opacity="0.7" />
            <path d="M 52 35 Q 60 25 55 40 Q 52 45 48 42 Z" opacity="0.7" />
            
            {/* Scarab Legs */}
            <line x1="30" y1="38" x2="22" y2="42" strokeWidth="2" stroke={getModeColor()} />
            <line x1="30" y1="45" x2="22" y2="50" strokeWidth="2" stroke={getModeColor()} />
            <line x1="50" y1="38" x2="58" y2="42" strokeWidth="2" stroke={getModeColor()} />
            <line x1="50" y1="45" x2="58" y2="50" strokeWidth="2" stroke={getModeColor()} />
          </g>
          
          {/* Sacred Geometry Overlay */}
          <circle 
            cx="40" 
            cy="40" 
            r="32" 
            fill="none" 
            stroke={getModeColor()} 
            strokeWidth="0.5" 
            opacity="0.3"
            strokeDasharray="2,3"
            className="sacred-circle"
          />
        </svg>
        
        {/* Mode Indicator Dot */}
        <div 
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
          style={{ backgroundColor: getModeColor() }}
          title={`${state.mode} mode`}
        />
      </div>
      
      {/* Minimize Button */}
      <button
        onClick={() => onPresenceToggle(false)}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-healing-mist hover:bg-tender-embrace transition-colors timing-breath flex items-center justify-center text-whisper text-secondary"
        title="Minimize Khepera's presence"
      >
        ⚪
      </button>
    </div>
  );
}

// ===== REFLECTION MIRROR COMPONENT =====

interface ReflectionMirrorProps {
  reflection: KheperaReflection;
  kheperaState: KheperaState;
}

function ReflectionMirror({ reflection, kheperaState }: ReflectionMirrorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Gentle fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`reflection-mirror mb-ritual transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* User's Reflection */}
      <div className="user-reflection mb-gentle">
        <div className="user-words surface-elevated-gentle p-gentle rounded-gentle border-l-4 border-primary">
          <p className="text-presence text-primary leading-spacious">
            {reflection.userInput}
          </p>
          <div className="reflection-metadata mt-breath">
            <span className="text-whisper text-tertiary">
              {reflection.timestamp.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Khepera's Mirror Response */}
      <div className="khepera-mirror-response">
        <KheperaMirrorBubble
          response={reflection.kheperaResponse}
          emotionalMirror={reflection.emotionalMirror}
          culturalAdaptation={reflection.culturalAdaptation}
          mode={kheperaState.mode}
        />
      </div>
    </div>
  );
}

// ===== KHEPERA MIRROR BUBBLE COMPONENT =====

interface KheperaMirrorBubbleProps {
  response: string;
  emotionalMirror: KheperaReflection['emotionalMirror'];
  culturalAdaptation?: KheperaReflection['culturalAdaptation'];
  mode: KheperaState['mode'];
}

function KheperaMirrorBubble({ 
  response, 
  emotionalMirror, 
  culturalAdaptation, 
  mode 
}: KheperaMirrorBubbleProps) {
  const [showFullResponse, setShowFullResponse] = useState(false);

  useEffect(() => {
    // Gentle typing effect simulation
    const timer = setTimeout(() => setShowFullResponse(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const getModeAccent = () => {
    switch (mode) {
      case 'reflective': return 'border-primary';
      case 'present': return 'border-warm-terra';
      case 'affirming': return 'border-soft-blush';
      default: return 'border-primary';
    }
  };

  return (
    <div className="khepera-mirror-bubble">
      {/* Emotional Mirror Acknowledgment */}
      <div className="emotional-acknowledgment mb-breath">
        <div className={`surface-elevated-warm p-breath rounded-breath border-l-2 ${getModeAccent()}`}>
          <p className="text-breath text-secondary italic">
            {emotionalMirror.reflected}
          </p>
        </div>
      </div>

      {/* Main Response */}
      <div 
        className={`khepera-response-container transition-all duration-1500 ${
          showFullResponse ? 'opacity-100' : 'opacity-60'
        }`}
      >
        <div className="surface-card-gentle p-gentle rounded-gentle">
          <div className="flex items-start gap-breath">
            {/* Small Khepera Presence Indicator */}
            <div className="khepera-mini-presence flex-shrink-0 mt-whisper">
              <div className="w-3 h-3 rounded-full bg-primary opacity-60 animate-pulse"></div>
            </div>
            
            <div className="flex-1">
              <p className="text-presence text-primary leading-spacious font-presence">
                {response}
              </p>
              
              {/* Cultural Wisdom Addition */}
              {culturalAdaptation && (
                <div className="cultural-wisdom mt-gentle pt-breath border-t border-healing-mist">
                  <div className="flex items-center gap-breath">
                    <span className="text-lg">{culturalAdaptation.symbol}</span>
                    <div>
                      <p className="text-breath font-presence text-secondary">
                        {culturalAdaptation.tradition}
                      </p>
                      <p className="text-breath text-tertiary italic">
                        {culturalAdaptation.wisdom}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SACRED REFLECTION INPUT COMPONENT =====

interface SacredReflectionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  kheperaState: KheperaState;
  placeholder: string;
}

function SacredReflectionInput({
  value,
  onChange,
  onSubmit,
  isProcessing,
  kheperaState,
  placeholder
}: SacredReflectionInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="sacred-reflection-input">
      <div className="input-container surface-elevated-gentle rounded-gentle border border-healing-mist focus-within:border-primary transition-colors timing-breath">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isProcessing}
          className="w-full p-ritual bg-transparent border-none outline-none resize-none text-presence text-primary placeholder-secondary leading-spacious"
          rows={3}
          style={{ minHeight: '120px' }}
        />
        
        {/* Breathing Guidance */}
        <div className="input-footer flex items-center justify-between p-breath border-t border-healing-mist">
          <div className="breathing-guidance flex items-center gap-breath">
            <KheperaBreathingIndicator phase={kheperaState.breathingPhase} />
            <span className="text-whisper text-tertiary">
              Breathe with Khepera as you reflect
            </span>
          </div>
          
          <div className="input-actions flex items-center gap-breath">
            {value.trim() && (
              <span className="text-whisper text-tertiary">
                {value.trim().split(/\s+/).length} words
              </span>
            )}
            <button
              onClick={onSubmit}
              disabled={!value.trim() || isProcessing}
              className="sacred-button intention-sacred disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-whisper">
                  <div className="w-3 h-3 rounded-full bg-current animate-pulse"></div>
                  Witnessing...
                </span>
              ) : (
                <span className="flex items-center gap-whisper">
                  <span>🪞</span>
                  Offer to mirror
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== KHEPERA BREATHING INDICATOR =====

interface KheperaBreathingIndicatorProps {
  phase: KheperaState['breathingPhase'];
}

function KheperaBreathingIndicator({ phase }: KheperaBreathingIndicatorProps) {
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'bg-primary';
      case 'pause_in': return 'bg-warm-terra';
      case 'exhale': return 'bg-soft-blush';
      case 'pause_out': return 'bg-healing-mist';
      default: return 'bg-primary';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inhale';
      case 'pause_in': return 'Hold';
      case 'exhale': return 'Exhale';
      case 'pause_out': return 'Rest';
      default: return 'Breathe';
    }
  };

  return (
    <div className="khepera-breathing-indicator flex items-center gap-whisper">
      <div 
        className={`w-2 h-2 rounded-full transition-all duration-500 ${getPhaseColor()}`}
      />
      <span className="text-whisper text-tertiary">
        {getPhaseText()}
      </span>
    </div>
  );
}

// ===== KHEPERA PROCESSING STATE =====

interface KheperaProcessingStateProps {
  state: KheperaState;
}

function KheperaProcessingState({ state }: KheperaProcessingStateProps) {
  return (
    <div className="khepera-processing-state flex items-center justify-center py-ritual">
      <div className="processing-indicator flex items-center gap-gentle">
        {/* Pulsing Scarab Silhouette */}
        <div className="scarab-pulse relative">
          <svg width="24" height="24" viewBox="0 0 24 24" className="animate-pulse">
            <ellipse cx="12" cy="12" rx="8" ry="6" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
        
        <div className="processing-text">
          <p className="text-breath text-secondary">
            Khepera is witnessing your reflection...
          </p>
          <p className="text-whisper text-tertiary">
            Sacred stillness honors your words
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====

function getContextualPlaceholder(state: KheperaState): string {
  const placeholders = {
    reflective: {
      surface: "What wants to be explored today?",
      exploring: "What's stirring beneath the surface?",
      witnessing: "Let your deeper truth emerge...",
      integration: "What wisdom is crystallizing for you?"
    },
    present: {
      surface: "I'm here, holding space for whatever wants to emerge...",
      exploring: "Take your time. What needs witnessing?",
      witnessing: "Your words are received in sacred stillness...",
      integration: "What integration is asking for your attention?"
    },
    affirming: {
      surface: "Your courage in being here is witnessed...",
      exploring: "What growth is wanting to be celebrated?",
      witnessing: "Your journey is sacred and honored...",
      integration: "What beautiful emergence is happening within you?"
    }
  };

  return placeholders[state.mode][state.sessionDepth];
}

export default KheperaEmotionalMirror;