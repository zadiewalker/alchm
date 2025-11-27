'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Heart, 
  Sparkles, 
  Star, 
  Sun, 
  Moon, 
  Flower, 
  Leaf,
  Rainbow,
  CloudRain,
  Lightbulb,
  Gift,
  Music,
  Feather,
  Butterfly,
  TreePine,
  Waves,
  Mountain,
  Eye,
  Smile,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Clock
} from 'lucide-react';

interface TherapeuticVisualFeedbackProps {
  feedbackType: FeedbackType;
  message: string;
  traumaInformedMessage: string;
  intensity?: 'gentle' | 'moderate' | 'strong';
  duration?: number; // in milliseconds
  autoShow?: boolean;
  onComplete?: () => void;
  customIcon?: React.ComponentType<any>;
  supportLevel?: 'minimal' | 'moderate' | 'intensive';
}

type FeedbackType = 
  | 'success'
  | 'encouragement'
  | 'celebration'
  | 'support'
  | 'guidance'
  | 'comfort'
  | 'validation'
  | 'progress'
  | 'milestone'
  | 'safety'
  | 'breathing'
  | 'grounding'
  | 'self_compassion'
  | 'resilience'
  | 'hope';

interface AnimationConfig {
  type: AnimationType;
  duration: number;
  easing: string;
  particles?: ParticleConfig;
  glow?: GlowConfig;
  heartbeat?: HeartbeatConfig;
  breathing?: BreathingConfig;
}

type AnimationType = 
  | 'heart_sparkle'
  | 'gentle_glow'
  | 'floating_hearts'
  | 'rainbow_ripple'
  | 'breathing_circle'
  | 'nature_bloom'
  | 'starlight_twinkle'
  | 'wave_comfort'
  | 'butterfly_dance'
  | 'sacred_geometry'
  | 'healing_light'
  | 'grounding_roots';

interface ParticleConfig {
  count: number;
  type: 'heart' | 'star' | 'sparkle' | 'leaf' | 'butterfly' | 'light';
  colors: string[];
  size: { min: number; max: number };
  speed: { min: number; max: number };
  gravity: number;
  lifetime: number;
}

interface GlowConfig {
  color: string;
  intensity: number;
  pulseSpeed: number;
  radius: number;
}

interface HeartbeatConfig {
  bpm: number;
  intensity: number;
  color: string;
}

interface BreathingConfig {
  inhaleTime: number;
  exhaleTime: number;
  holdTime: number;
  color: string;
  guidance: boolean;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  lifetime: number;
  maxLifetime: number;
  type: ParticleConfig['type'];
  rotation: number;
  rotationSpeed: number;
}

export function TherapeuticVisualFeedback({
  feedbackType,
  message,
  traumaInformedMessage,
  intensity = 'moderate',
  duration = 4000,
  autoShow = true,
  onComplete,
  customIcon,
  supportLevel = 'moderate'
}: TherapeuticVisualFeedbackProps) {
  const [isVisible, setIsVisible] = useState(autoShow);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingProgress, setBreathingProgress] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Configuration for different feedback types
  const feedbackConfigs: Record<FeedbackType, {
    icon: React.ComponentType<any>;
    colors: string[];
    animation: AnimationConfig;
    soundFrequency?: number;
  }> = {
    success: {
      icon: CheckCircle,
      colors: ['#10b981', '#34d399', '#6ee7b7'],
      animation: {
        type: 'heart_sparkle',
        duration: 3000,
        easing: 'ease-out',
        particles: {
          count: 20,
          type: 'sparkle',
          colors: ['#10b981', '#34d399', '#6ee7b7', '#ffd700'],
          size: { min: 4, max: 12 },
          speed: { min: 50, max: 150 },
          gravity: -0.5,
          lifetime: 2000
        }
      }
    },
    encouragement: {
      icon: Heart,
      colors: ['#f472b6', '#fb7185', '#fda4af'],
      animation: {
        type: 'floating_hearts',
        duration: 4000,
        easing: 'ease-in-out',
        particles: {
          count: 15,
          type: 'heart',
          colors: ['#f472b6', '#fb7185', '#fda4af'],
          size: { min: 8, max: 16 },
          speed: { min: 30, max: 80 },
          gravity: -0.3,
          lifetime: 3000
        }
      }
    },
    celebration: {
      icon: Star,
      colors: ['#fbbf24', '#f59e0b', '#d97706'],
      animation: {
        type: 'starlight_twinkle',
        duration: 5000,
        easing: 'ease-out',
        particles: {
          count: 30,
          type: 'star',
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffd700'],
          size: { min: 6, max: 20 },
          speed: { min: 40, max: 120 },
          gravity: 0,
          lifetime: 4000
        }
      }
    },
    support: {
      icon: Shield,
      colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
      animation: {
        type: 'gentle_glow',
        duration: 6000,
        easing: 'ease-in-out',
        glow: {
          color: '#8b5cf6',
          intensity: 0.3,
          pulseSpeed: 2000,
          radius: 50
        }
      }
    },
    guidance: {
      icon: Lightbulb,
      colors: ['#06b6d4', '#0891b2', '#0e7490'],
      animation: {
        type: 'healing_light',
        duration: 4000,
        easing: 'ease-out',
        particles: {
          count: 12,
          type: 'light',
          colors: ['#06b6d4', '#22d3ee', '#67e8f9'],
          size: { min: 3, max: 8 },
          speed: { min: 20, max: 60 },
          gravity: 0,
          lifetime: 3000
        }
      }
    },
    comfort: {
      icon: CloudRain,
      colors: ['#64748b', '#94a3b8', '#cbd5e1'],
      animation: {
        type: 'wave_comfort',
        duration: 8000,
        easing: 'ease-in-out'
      }
    },
    validation: {
      icon: Smile,
      colors: ['#f97316', '#fb923c', '#fdba74'],
      animation: {
        type: 'gentle_glow',
        duration: 3000,
        easing: 'ease-out',
        glow: {
          color: '#f97316',
          intensity: 0.2,
          pulseSpeed: 1500,
          radius: 40
        }
      }
    },
    progress: {
      icon: Mountain,
      colors: ['#059669', '#10b981', '#34d399'],
      animation: {
        type: 'grounding_roots',
        duration: 4000,
        easing: 'ease-in-out'
      }
    },
    milestone: {
      icon: Gift,
      colors: ['#dc2626', '#ef4444', '#f87171'],
      animation: {
        type: 'rainbow_ripple',
        duration: 5000,
        easing: 'ease-out',
        particles: {
          count: 25,
          type: 'sparkle',
          colors: ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#059669', '#0891b2', '#0284c7', '#2563eb', '#4f46e5', '#7c3aed', '#a21caf'],
          size: { min: 5, max: 15 },
          speed: { min: 60, max: 180 },
          gravity: 0.2,
          lifetime: 3500
        }
      }
    },
    safety: {
      icon: Shield,
      colors: ['#16a34a', '#22c55e', '#4ade80'],
      animation: {
        type: 'sacred_geometry',
        duration: 6000,
        easing: 'ease-in-out',
        glow: {
          color: '#16a34a',
          intensity: 0.4,
          pulseSpeed: 3000,
          radius: 60
        }
      }
    },
    breathing: {
      icon: Waves,
      colors: ['#0369a1', '#0284c7', '#0ea5e9'],
      animation: {
        type: 'breathing_circle',
        duration: 12000, // 4-4-4 breathing pattern
        easing: 'ease-in-out',
        breathing: {
          inhaleTime: 4000,
          holdTime: 4000,
          exhaleTime: 4000,
          color: '#0ea5e9',
          guidance: true
        }
      }
    },
    grounding: {
      icon: TreePine,
      colors: ['#166534', '#16a34a', '#22c55e'],
      animation: {
        type: 'grounding_roots',
        duration: 8000,
        easing: 'ease-in-out',
        particles: {
          count: 8,
          type: 'leaf',
          colors: ['#166534', '#16a34a', '#22c55e', '#4ade80'],
          size: { min: 6, max: 12 },
          speed: { min: 15, max: 40 },
          gravity: 0.1,
          lifetime: 6000
        }
      }
    },
    self_compassion: {
      icon: Flower,
      colors: ['#be185d', '#db2777', '#ec4899'],
      animation: {
        type: 'nature_bloom',
        duration: 6000,
        easing: 'ease-out',
        particles: {
          count: 10,
          type: 'butterfly',
          colors: ['#be185d', '#db2777', '#ec4899', '#f9a8d4'],
          size: { min: 8, max: 14 },
          speed: { min: 25, max: 70 },
          gravity: -0.1,
          lifetime: 5000
        }
      }
    },
    resilience: {
      icon: Mountain,
      colors: ['#7c2d12', '#dc2626', '#ea580c'],
      animation: {
        type: 'healing_light',
        duration: 7000,
        easing: 'ease-in-out',
        glow: {
          color: '#dc2626',
          intensity: 0.3,
          pulseSpeed: 2500,
          radius: 45
        }
      }
    },
    hope: {
      icon: Sun,
      colors: ['#eab308', '#facc15', '#fde047'],
      animation: {
        type: 'starlight_twinkle',
        duration: 6000,
        easing: 'ease-out',
        particles: {
          count: 18,
          type: 'light',
          colors: ['#eab308', '#facc15', '#fde047', '#fef3c7'],
          size: { min: 4, max: 10 },
          speed: { min: 30, max: 90 },
          gravity: -0.2,
          lifetime: 4000
        }
      }
    }
  };

  const config = feedbackConfigs[feedbackType];
  const Icon = customIcon || config.icon;

  // Initialize particles
  const createParticles = useCallback(() => {
    if (!config.animation.particles || !containerRef.current) return [];

    const container = containerRef.current.getBoundingClientRect();
    const centerX = container.width / 2;
    const centerY = container.height / 2;
    const particleConfig = config.animation.particles;

    return Array.from({ length: particleConfig.count }, (_, i) => {
      const angle = (i / particleConfig.count) * Math.PI * 2;
      const radius = 20 + Math.random() * 30;
      
      return {
        id: `particle-${i}`,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * (particleConfig.speed.max - particleConfig.speed.min) + particleConfig.speed.min,
        vy: (Math.random() - 0.5) * (particleConfig.speed.max - particleConfig.speed.min) + particleConfig.speed.min,
        size: Math.random() * (particleConfig.size.max - particleConfig.size.min) + particleConfig.size.min,
        color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
        opacity: 1,
        lifetime: 0,
        maxLifetime: particleConfig.lifetime,
        type: particleConfig.type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      };
    });
  }, [config.animation.particles]);

  // Animation loop
  const animate = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = containerRef.current.getBoundingClientRect();
    canvas.width = container.width;
    canvas.height = container.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentTime = Date.now();
    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / config.animation.duration, 1);

    // Update breathing animation
    if (config.animation.breathing) {
      const breathingConfig = config.animation.breathing;
      const cycleTime = breathingConfig.inhaleTime + breathingConfig.holdTime + breathingConfig.exhaleTime;
      const cycleProgress = (elapsed % cycleTime) / cycleTime;
      
      if (cycleProgress < breathingConfig.inhaleTime / cycleTime) {
        setBreathingPhase('inhale');
        setBreathingProgress((cycleProgress * cycleTime) / breathingConfig.inhaleTime);
      } else if (cycleProgress < (breathingConfig.inhaleTime + breathingConfig.holdTime) / cycleTime) {
        setBreathingPhase('hold');
        setBreathingProgress(1);
      } else {
        setBreathingPhase('exhale');
        const exhaleStart = (breathingConfig.inhaleTime + breathingConfig.holdTime) / cycleTime;
        setBreathingProgress(1 - ((cycleProgress - exhaleStart) * cycleTime) / breathingConfig.exhaleTime);
      }
    }

    // Update and draw particles
    setParticles(prevParticles => {
      return prevParticles.map(particle => {
        // Update particle physics
        particle.x += particle.vx * 0.016; // 60fps approximation
        particle.y += particle.vy * 0.016;
        
        if (config.animation.particles?.gravity) {
          particle.vy += config.animation.particles.gravity;
        }
        
        particle.lifetime += 16; // milliseconds
        particle.opacity = Math.max(0, 1 - (particle.lifetime / particle.maxLifetime));
        particle.rotation += particle.rotationSpeed;

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;

        switch (particle.type) {
          case 'heart':
            drawHeart(ctx, 0, 0, particle.size);
            break;
          case 'star':
            drawStar(ctx, 0, 0, particle.size);
            break;
          case 'sparkle':
            drawSparkle(ctx, 0, 0, particle.size);
            break;
          case 'leaf':
            drawLeaf(ctx, 0, 0, particle.size);
            break;
          case 'butterfly':
            drawButterfly(ctx, 0, 0, particle.size);
            break;
          case 'light':
            drawLight(ctx, 0, 0, particle.size);
            break;
        }

        ctx.restore();

        return particle;
      }).filter(particle => particle.opacity > 0.01);
    });

    // Draw breathing circle
    if (config.animation.type === 'breathing_circle') {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 50;
      const radius = baseRadius + (breathingProgress * 30);
      
      ctx.save();
      ctx.globalAlpha = 0.3 + (breathingProgress * 0.4);
      ctx.fillStyle = config.animation.breathing?.color || config.colors[0];
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Outer ring
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = config.animation.breathing?.color || config.colors[0];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + 40, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    }

    // Draw glow effect
    if (config.animation.glow) {
      const glowConfig = config.animation.glow;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const pulsePhase = Math.sin((elapsed / glowConfig.pulseSpeed) * Math.PI * 2);
      const glowRadius = glowConfig.radius + (pulsePhase * 10);
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
      gradient.addColorStop(0, `${glowConfig.color}${Math.round(glowConfig.intensity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${glowConfig.color}00`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Continue animation
    if (progress < 1) {
      const frame = requestAnimationFrame(animate);
      setAnimationFrame(frame);
    } else {
      setAnimationFrame(null);
      if (duration && duration > 0) {
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 500);
      }
    }
  }, [config, duration, onComplete, breathingProgress]);

  // Start animation when visible
  useEffect(() => {
    if (isVisible && config.animation.particles) {
      setParticles(createParticles());
    }
    
    if (isVisible) {
      startTimeRef.current = Date.now();
      const frame = requestAnimationFrame(animate);
      setAnimationFrame(frame);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, createParticles, animate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [animationFrame]);

  // Particle drawing functions
  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size * 0.3), x, y + (size * 0.8), x, y + size);
    ctx.bezierCurveTo(x, y + (size * 0.8), x + size / 2, y + (size * 0.3), x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.fill();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const posX = x + Math.cos(angle) * radius;
      const posY = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(posX, posY);
      } else {
        ctx.lineTo(posX, posY);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.3, y - size * 0.3);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size * 0.3, y + size * 0.3);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size * 0.3, y + size * 0.3);
    ctx.lineTo(x - size, y);
    ctx.lineTo(x - size * 0.3, y - size * 0.3);
    ctx.closePath();
    ctx.fill();
  };

  const drawLeaf = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.3, size, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawButterfly = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Simple butterfly shape using ellipses
    ctx.beginPath();
    ctx.ellipse(x - size * 0.3, y - size * 0.2, size * 0.4, size * 0.6, -0.3, 0, Math.PI * 2);
    ctx.ellipse(x + size * 0.3, y - size * 0.2, size * 0.4, size * 0.6, 0.3, 0, Math.PI * 2);
    ctx.ellipse(x - size * 0.2, y + size * 0.2, size * 0.3, size * 0.4, -0.2, 0, Math.PI * 2);
    ctx.ellipse(x + size * 0.2, y + size * 0.2, size * 0.3, size * 0.4, 0.2, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawLight = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, ctx.fillStyle as string);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        ref={containerRef}
        className={`relative max-w-md mx-4 transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          filter: `drop-shadow(0 10px 25px ${config.colors[0]}40)`
        }}
      >
        {/* Canvas for particles and effects */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />
        
        {/* Main content card */}
        <Card 
          className="relative bg-sanctuary-white/95 backdrop-blur-sm border-2 pointer-events-auto"
          style={{
            borderColor: config.colors[0],
            zIndex: 2
          }}
        >
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform ${
                  intensity === 'gentle' ? 'scale-100' :
                  intensity === 'moderate' ? 'scale-110 animate-pulse' :
                  'scale-125 animate-bounce'
                }`}
                style={{
                  backgroundColor: config.colors[0],
                  boxShadow: `0 0 30px ${config.colors[0]}60`
                }}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-medium text-sanctuary-gray-800 mb-2">
                {traumaInformedMessage}
              </h3>
              {supportLevel !== 'minimal' && (
                <p className="text-sm text-sanctuary-gray-600">
                  {message}
                </p>
              )}
            </div>
            
            {/* Breathing guidance */}
            {feedbackType === 'breathing' && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-sanctuary-gray-700 capitalize">
                  {breathingPhase === 'inhale' ? '🌸 Breathe in gently' :
                   breathingPhase === 'hold' ? '🕊️ Hold with care' :
                   '🍃 Release softly'}
                </div>
                <div className="w-full bg-sanctuary-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-100 ease-linear"
                    style={{
                      width: `${breathingProgress * 100}%`,
                      backgroundColor: config.colors[0]
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Auto-close timer */}
            {duration && duration > 0 && feedbackType !== 'breathing' && (
              <div className="flex items-center justify-center gap-2 text-xs text-sanctuary-gray-500">
                <Clock className="w-3 h-3" />
                <span>This message will close automatically</span>
              </div>
            )}
            
            {/* Manual close button for persistent feedback */}
            {(!duration || duration === 0) && (
              <Button
                onClick={() => {
                  setIsVisible(false);
                  onComplete?.();
                }}
                variant="ghost"
                size="sm"
                className="mt-4"
              >
                Continue
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for displaying multiple feedback messages in sequence
export function TherapeuticFeedbackSequence({
  feedbacks,
  onComplete
}: {
  feedbacks: Omit<TherapeuticVisualFeedbackProps, 'autoShow' | 'onComplete'>[];
  onComplete?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCurrent, setShowCurrent] = useState(true);

  const handleCurrentComplete = useCallback(() => {
    if (currentIndex < feedbacks.length - 1) {
      setShowCurrent(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setShowCurrent(true);
      }, 300);
    } else {
      setShowCurrent(false);
      onComplete?.();
    }
  }, [currentIndex, feedbacks.length, onComplete]);

  if (currentIndex >= feedbacks.length) {
    return null;
  }

  const currentFeedback = feedbacks[currentIndex];

  return (
    <TherapeuticVisualFeedback
      {...currentFeedback}
      autoShow={showCurrent}
      onComplete={handleCurrentComplete}
    />
  );
}

// Preset feedback messages for common scenarios
export const THERAPEUTIC_PRESETS = {
  uploadSuccess: {
    feedbackType: 'success' as const,
    message: 'Your screenshot has been uploaded successfully',
    traumaInformedMessage: '💚 Thank you for sharing - your courage in seeking help is beautiful',
    intensity: 'moderate' as const,
    duration: 3000
  },
  
  analysisComplete: {
    feedbackType: 'celebration' as const,
    message: 'Analysis complete - we found some helpful insights',
    traumaInformedMessage: '✨ We understand your experience better now and are here to support you',
    intensity: 'strong' as const,
    duration: 4000
  },
  
  solutionFound: {
    feedbackType: 'hope' as const,
    message: 'We found a solution to help resolve this issue',
    traumaInformedMessage: '🌟 There is a gentle path forward - you are not stuck in this difficulty',
    intensity: 'strong' as const,
    duration: 5000
  },
  
  encouragement: {
    feedbackType: 'encouragement' as const,
    message: 'You are doing great by seeking help',
    traumaInformedMessage: '💝 Every step you take toward getting support shows your strength and wisdom',
    intensity: 'moderate' as const,
    duration: 4000
  },
  
  breathingExercise: {
    feedbackType: 'breathing' as const,
    message: 'Let\'s take a moment to breathe together',
    traumaInformedMessage: '🌊 Breathe with me - you are safe and supported in this moment',
    intensity: 'gentle' as const,
    duration: 0 // Continuous until dismissed
  },
  
  privacyAssurance: {
    feedbackType: 'safety' as const,
    message: 'Your data is secure and will be automatically deleted',
    traumaInformedMessage: '🛡️ Your privacy is sacred to us - you are safe here',
    intensity: 'gentle' as const,
    duration: 4000
  }
};