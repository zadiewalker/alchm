/**
 * Khepera Transformation - Sacred Journey of Renewal
 * A digital sanctuary for exploring personal metamorphosis through the wisdom of the scarab beetle
 * Embodies intentional restraint, quiet confidence, and the profound beauty of transformation
 */

"use client";

import { useState, useEffect, useRef } from 'react';
import { CrisisSupport } from '@/components/ui/CrisisSupport';

interface TransformationStage {
  id: string;
  name: string;
  phase: 'earth' | 'cocoon' | 'emergence' | 'flight';
  description: string;
  kheperaWisdom: string;
  reflection: string;
  breathingPattern: number[];
  color: string;
  symbol: string;
}

interface CommunityWisdom {
  id: string;
  phase: string;
  wisdom: string;
  culturalOrigin?: string;
  isAnonymous: boolean;
}

const transformationStages: TransformationStage[] = [
  {
    id: 'earth',
    name: 'Sacred Ground',
    phase: 'earth',
    description: 'Every transformation begins in the fertile darkness of the earth, where seeds of change are planted.',
    kheperaWisdom: '✨ I am Khepera. In the soil of your experience, new life stirs. What truth seeks to emerge from the depths of who you are?',
    reflection: 'What foundational shifts are stirring within you?',
    breathingPattern: [4, 4, 4, 4], // Box breathing for grounding
    color: '#8B4513',
    symbol: '🌱'
  },
  {
    id: 'cocoon',
    name: 'Sacred Dissolution',
    phase: 'cocoon',
    description: 'In the protective embrace of the cocoon, old patterns dissolve to make space for who you are becoming.',
    kheperaWisdom: '✨ I am Khepera. The caterpillar must dissolve to become the butterfly. What old stories are you ready to release with love?',
    reflection: 'What are you ready to release to make space for growth?',
    breathingPattern: [4, 7, 8], // Calming breath for release
    color: '#DDA0DD',
    symbol: '🛡️'
  },
  {
    id: 'emergence',
    name: 'Sacred Breaking Through',
    phase: 'emergence',
    description: 'The moment of breaking through requires immense courage as you shed old limitations.',
    kheperaWisdom: '✨ I am Khepera. Breaking through takes the courage of a thousand sunrises. What strength have you discovered within yourself?',
    reflection: 'What new aspects of yourself are ready to be seen?',
    breathingPattern: [3, 1, 5, 1], // Energizing breath for breakthrough
    color: '#FFD700',
    symbol: '⚡'
  },
  {
    id: 'flight',
    name: 'Sacred Soaring',
    phase: 'flight',
    description: 'In full flight, you embody the transformed self, carrying ancient wisdom into new horizons.',
    kheperaWisdom: '✨ I am Khepera. You soar now with wings you always possessed. How will you use this transformation to touch the world?',
    reflection: 'How will you share your transformed wisdom with others?',
    breathingPattern: [5, 5, 5, 5], // Expansive breathing for integration
    color: '#87CEEB',
    symbol: '🦋'
  }
];

const communityWisdom: CommunityWisdom[] = [
  {
    id: '1',
    phase: 'earth',
    wisdom: 'The ancestors taught us that before the seed can sprout, it must first trust the darkness.',
    culturalOrigin: 'Indigenous wisdom tradition',
    isAnonymous: true
  },
  {
    id: '2',
    phase: 'cocoon',
    wisdom: 'In Japanese culture, we say "Nana korobi ya oki" - fall seven times, rise eight. The cocoon is our rising.',
    culturalOrigin: 'Japanese tradition',
    isAnonymous: true
  },
  {
    id: '3',
    phase: 'emergence',
    wisdom: 'My grandmother said butterflies remember being caterpillars. I\'m learning to remember who I was while embracing who I\'m becoming.',
    isAnonymous: true
  },
  {
    id: '4',
    phase: 'flight',
    wisdom: 'The eagle that soars highest builds its nest in the most hidden place. Transformation requires both courage and sanctuary.',
    culturalOrigin: 'Native American wisdom',
    isAnonymous: true
  }
];

export function KheperaTransformation() {
  const [currentStage, setCurrentStage] = useState<TransformationStage>(transformationStages[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [showCommunityWisdom, setShowCommunityWisdom] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const [progressAnimation, setProgressAnimation] = useState(0);
  
  const breathingRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sacred geometry animation for transformation visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      // Clear canvas with sanctuary background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gentle scarab transformation mandala
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Outer ring - representing the eternal cycle
      ctx.beginPath();
      ctx.strokeStyle = currentStage.color + '40';
      ctx.lineWidth = 2;
      ctx.arc(0, 0, 80 + Math.sin(time) * 5, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner transformation spiral
      ctx.beginPath();
      ctx.strokeStyle = currentStage.color + '80';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time;
        const radius = 30 + Math.sin(time + i) * 10;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Central scarab symbol with gentle pulsing
      const scale = 1 + Math.sin(time * 2) * 0.1;
      ctx.scale(scale, scale);
      ctx.fillStyle = currentStage.color;
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('𓆣', 0, 8); // Ancient Egyptian scarab hieroglyph
      
      ctx.restore();
      
      animationFrame = requestAnimationFrame(animate);
    };

    canvas.width = 200;
    canvas.height = 200;
    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentStage]);

  // Breathing exercise integration
  const startBreathingExercise = () => {
    if (isBreathing) {
      setIsBreathing(false);
      if (breathingRef.current) {
        clearInterval(breathingRef.current);
      }
      return;
    }

    setIsBreathing(true);
    setBreathingPhase(0);
    
    const pattern = currentStage.breathingPattern;
    let phaseIndex = 0;
    let count = 0;

    breathingRef.current = typeof window !== 'undefined' && window.setInterval(() => {
      count++;
      
      if (count >= pattern[phaseIndex]) {
        phaseIndex = (phaseIndex + 1) % pattern.length;
        count = 0;
        setBreathingPhase(phaseIndex);
      }
    }, 1000);
  };

  const handleStageTransition = (stageId: string) => {
    const stage = transformationStages.find(s => s.id === stageId);
    if (stage) {
      setCurrentStage(stage);
      setProgressAnimation(Date.now());
      // Gentle haptic feedback simulation
      if (typeof window !== 'undefined' && navigator.vibrate) {
        typeof window !== 'undefined' && navigator.vibrate(50);
      }
    }
  };

  const handleTouch = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setTouchPosition({ x: touch.clientX, y: touch.clientY });
      setTimeout(() => setTouchPosition(null), 800);
    }
  };

  const getBreathingInstruction = () => {
    const instructions = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
    return instructions[breathingPhase] || 'Breathe Naturally';
  };

  const filteredCommunityWisdom = communityWisdom.filter(w => w.phase === currentStage.phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--sage-primary)] via-[var(--sage-hover)] to-[var(--sage-active)] p-4">
      {/* Crisis Support Integration */}
      <CrisisSupport 
        isVisible={showCrisisSupport}
        onContinueWriting={() => setShowCrisisSupport(false)}
      />

      {/* Sacred Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <span className="text-2xl">𓆣</span>
            </div>
            <h1 className="text-3xl font-light text-white">Khepera's Sacred Transformation</h1>
          </div>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Journey through the ancient wisdom of metamorphosis, where the scarab beetle teaches us 
            that every ending contains the seed of a new beginning.
          </p>
        </div>

        {/* Transformation Journey Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {transformationStages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => handleStageTransition(stage.id)}
              onTouchStart={handleTouch}
              className={`
                relative p-4 rounded-2xl border-2 transition-all duration-500 ease-out
                ${currentStage.id === stage.id 
                  ? 'bg-white/20 border-white/40 transform scale-105' 
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
                }
                backdrop-blur-sm touch-manipulation
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl mb-2">{stage.symbol}</div>
                <h3 className="text-white font-medium text-sm">{stage.name}</h3>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white/60 rounded-full transition-all duration-1000"
                    style={{ 
                      width: currentStage.id === stage.id ? '100%' : '0%',
                      backgroundColor: stage.color 
                    }}
                  />
                </div>
              </div>
              
              {/* Gentle sparkle on active stage */}
              {currentStage.id === stage.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center animate-gentle-sparkle">
                  <span className="text-xs">✨</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Current Stage Experience */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Sacred Geometry & Wisdom */}
          <div className="space-y-6">
            {/* Transformation Visualization */}
            <div className="relative">
              <div className="sanctuary-glass rounded-3xl p-8 text-center">
                <canvas 
                  ref={canvasRef}
                  className="mx-auto mb-6 opacity-80"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.1))' }}
                />
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-light text-white mb-2">{currentStage.name}</h2>
                  <p className="text-white/90 leading-relaxed">{currentStage.description}</p>
                  
                  {/* Khepera's Wisdom */}
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                    <p className="text-white/95 italic text-sm leading-relaxed">
                      "{currentStage.kheperaWisdom}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Breathing Exercise Integration */}
            <div className="sanctuary-glass rounded-2xl p-6">
              <div className="text-center space-y-4">
                <h3 className="text-white font-medium mb-4">Sacred Breath for {currentStage.name}</h3>
                
                <div className="relative">
                  <div 
                    className={`
                      w-24 h-24 mx-auto rounded-full border-4 border-white/30
                      flex items-center justify-content-center transition-all duration-1000
                      ${isBreathing ? 'animate-breathing' : ''}
                    `}
                    style={{ 
                      borderColor: isBreathing ? currentStage.color : 'rgba(255,255,255,0.3)',
                      transform: isBreathing ? `scale(${1 + breathingPhase * 0.1})` : 'scale(1)'
                    }}
                  >
                    <span className="text-white text-sm font-medium">
                      {isBreathing ? getBreathingInstruction() : 'Breathe'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={startBreathingExercise}
                  className={`
                    px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                    ${isBreathing 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white text-[var(--sage-active)] hover:bg-white/90'
                    }
                  `}
                >
                  {isBreathing ? 'Stop Breathing Exercise' : 'Begin Sacred Breath'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Reflection & Community */}
          <div className="space-y-6">
            {/* Personal Reflection */}
            <div className="sanctuary-glass rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4">Sacred Reflection</h3>
              <p className="text-white/80 text-sm mb-4">{currentStage.reflection}</p>
              
              <textarea
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder="Share your sacred thoughts here..."
                className="
                  w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4
                  text-white placeholder-white/60 resize-none
                  focus:bg-white/15 focus:border-white/40 focus:outline-none
                  transition-all duration-300
                "
                style={{ lineHeight: '1.6' }}
              />
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-white/60">
                  {userReflection.length} characters
                </span>
                <button className="px-4 py-2 bg-white/20 border border-white/30 rounded-full text-sm text-white hover:bg-white/30 transition-all">
                  Save Reflection
                </button>
              </div>
            </div>

            {/* Community Transformation Stories */}
            <div className="sanctuary-glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Community Wisdom</h3>
                <button
                  onClick={() => setShowCommunityWisdom(!showCommunityWisdom)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {showCommunityWisdom ? 'Hide' : 'Show'} Stories
                </button>
              </div>

              {showCommunityWisdom && (
                <div className="space-y-4 animate-slide-in-up">
                  {filteredCommunityWisdom.map((wisdom) => (
                    <div key={wisdom.id} className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-white/90 text-sm leading-relaxed italic mb-2">
                        "{wisdom.wisdom}"
                      </p>
                      {wisdom.culturalOrigin && (
                        <p className="text-xs text-white/60">— {wisdom.culturalOrigin}</p>
                      )}
                    </div>
                  ))}
                  
                  <div className="text-center pt-4">
                    <button className="text-sm text-white/70 hover:text-white underline decoration-white/50">
                      Share your transformation wisdom
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Celebration */}
            <div className="sanctuary-glass rounded-2xl p-6 text-center">
              <div className="mb-4">
                <span className="text-2xl mb-2 block animate-gentle-sparkle">🌟</span>
                <h3 className="text-white font-medium">Transformation Progress</h3>
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-[var(--sage-light)] to-white h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((transformationStages.findIndex(s => s.id === currentStage.id) + 1) / transformationStages.length) * 100}%` 
                  }}
                />
              </div>
              
              <p className="text-white/80 text-sm">
                Every step forward honors the courage it takes to transform. 
                You are exactly where you need to be.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Touch Feedback */}
        {touchPosition && (
          <div 
            className="fixed pointer-events-none z-50"
            style={{ 
              left: touchPosition.x - 20, 
              top: touchPosition.y - 20,
              animation: 'gentle-sparkle 0.8s ease-out forwards'
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center">
              <span className="text-sm">✨</span>
            </div>
          </div>
        )}

        {/* Always-Present Crisis Support Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowCrisisSupport(true)}
            className="
              w-14 h-14 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full
              flex items-center justify-center text-white hover:bg-white/30
              transition-all duration-300 shadow-lg
            "
            aria-label="Crisis support resources"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default KheperaTransformation;