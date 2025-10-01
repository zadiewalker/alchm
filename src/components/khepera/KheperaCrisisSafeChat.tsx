/**
 * Khepera Crisis-Safe Chat Component
 * 
 * Provides real-time crisis detection and intervention within Khepera conversations
 * while maintaining the warm, engaging chat experience. Integrates seamlessly with
 * ALCHM's existing crisis support infrastructure.
 * 
 * Key Features:
 * - Real-time crisis detection during chat
 * - In-chat de-escalation techniques
 * - Seamless handoff to crisis support
 * - Personality preservation during crisis
 * - Privacy-preserving safety monitoring
 * - <3 second response time for all safety features
 */

"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CrisisSupport } from '@/components/CrisisSupport';
import { 
  KheperaCrisisSafetySystem, 
  type CrisisChatMessage, 
  type CrisisSafeKheperaResponse,
  type DeescalationTechnique 
} from '@/lib/khepera-crisis-safety-system';
import { ArchetypeVoice, EmotionalVocabularyLevel } from '@/lib/khepera-core-personality';
import { EmotionalContext } from '@/lib/emotional-intelligence';

// ===============================
// COMPONENT INTERFACES
// ===============================

interface KheperaCrisisSafeChatProps {
  userId?: string;
  sessionId: string;
  userTier: 'sanctuary' | 'seeker' | 'healer' | 'oracle';
  emotionalContext?: EmotionalContext;
  archetype?: ArchetypeVoice;
  vocabularyLevel?: EmotionalVocabularyLevel;
  onCrisisDetected?: (severity: string) => void;
  onCrisisResolved?: () => void;
  className?: string;
}

interface BreathingExerciseState {
  active: boolean;
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  count: number;
  cycle: number;
  maxCycles: number;
}

interface GroundingExerciseState {
  active: boolean;
  step: number;
  responses: string[];
  prompts: string[];
}

// ===============================
// MAIN COMPONENT
// ===============================

export function KheperaCrisisSafeChat({
  userId,
  sessionId,
  userTier,
  emotionalContext,
  archetype = 'sage',
  vocabularyLevel = 'learner',
  onCrisisDetected,
  onCrisisResolved,
  className = ""
}: KheperaCrisisSafeChatProps) {
  // Core chat state
  const [messages, setMessages] = useState<CrisisChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Crisis safety state
  const [crisisSafetySystem] = useState(() => new KheperaCrisisSafetySystem(sessionId, userId));
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [currentCrisisLevel, setCurrentCrisisLevel] = useState<'mild' | 'moderate' | 'severe'>('mild');
  
  // De-escalation state
  const [activeDeescalation, setActiveDeescalation] = useState<DeescalationTechnique | null>(null);
  const [breathingState, setBreathingState] = useState<BreathingExerciseState>({
    active: false,
    phase: 'inhale',
    count: 0,
    cycle: 0,
    maxCycles: 3
  });
  const [groundingState, setGroundingState] = useState<GroundingExerciseState>({
    active: false,
    step: 0,
    responses: [],
    prompts: [
      "Tell me 5 things you can see around you right now",
      "Now 4 things you can physically touch",
      "Can you identify 3 things you can hear?",
      "What are 2 things you can smell?",
      "Finally, 1 thing you can taste"
    ]
  });
  
  // Performance monitoring
  const [responseTime, setResponseTime] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Crisis resource preloading
  const [resourcesPreloaded, setResourcesPreloaded] = useState(false);
  
  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: CrisisChatMessage = {
      id: `welcome-${Date.now()}`,
      text: getWelcomeMessage(archetype),
      timestamp: new Date(),
      sender: 'khepera',
      safetyProcessed: true
    };
    
    setMessages([welcomeMessage]);
    crisisSafetySystem.addMessageToHistory(welcomeMessage);
  }, [archetype, crisisSafetySystem]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Preload crisis resources when crisis detected
  useEffect(() => {
    if (crisisDetected && !resourcesPreloaded) {
      preloadCrisisResources();
      setResourcesPreloaded(true);
    }
  }, [crisisDetected, resourcesPreloaded]);

  // ===============================
  // CORE CHAT FUNCTIONALITY
  // ===============================

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    const startTime = performance.now();
    setIsLoading(true);
    
    // Create user message
    const userMessage: CrisisChatMessage = {
      id: `user-${Date.now()}`,
      text: messageText,
      timestamp: new Date(),
      sender: 'user',
      safetyProcessed: false
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    try {
      // Generate crisis-safe response
      const response = await crisisSafetySystem.generateCrisisSafeResponse(
        messageText,
        emotionalContext || { primary: 'neutral', secondary: [], isCrisis: false, needsSupport: false },
        archetype,
        vocabularyLevel,
        {
          recentMessages: messages.slice(-5),
          sessionDuration: (Date.now() - (messages[0]?.timestamp.getTime() || Date.now())) / 1000,
          previousCrisisEvents: messages.filter(m => m.crisisFlags?.detected).length
        }
      );
      
      // Handle crisis detection
      if (response.crisisAssessment.detected) {
        handleCrisisDetection(response);
      }
      
      // Create Khepera response message
      const kheperaMessage: CrisisChatMessage = {
        id: `khepera-${Date.now()}`,
        text: response.primaryMessage,
        timestamp: new Date(),
        sender: 'khepera',
        crisisFlags: response.crisisAssessment.detected ? {
          detected: true,
          severity: mapCrisisSeverity(response.crisisAssessment.interventionLevel),
          confidence: response.crisisAssessment.confidence,
          responseType: response.crisisAssessment.interventionLevel
        } : undefined,
        safetyProcessed: true
      };
      
      // Add response to chat
      setMessages(prev => [...prev, userMessage, kheperaMessage]);
      
      // Update crisis safety system
      crisisSafetySystem.addMessageToHistory(userMessage);
      crisisSafetySystem.addMessageToHistory(kheperaMessage);
      
      // Handle de-escalation if offered
      if (response.deescalationOffered) {
        setActiveDeescalation(response.deescalationOffered.technique);
        if (response.deescalationOffered.timing === 'immediate') {
          setTimeout(() => startDeescalation(response.deescalationOffered!.technique), 1000);
        }
      }
      
      // Add support message if provided
      if (response.supportMessage) {
        setTimeout(() => {
          const supportMessage: CrisisChatMessage = {
            id: `support-${Date.now()}`,
            text: response.supportMessage!,
            timestamp: new Date(),
            sender: 'khepera',
            safetyProcessed: true
          };
          
          setMessages(prev => [...prev, supportMessage]);
          crisisSafetySystem.addMessageToHistory(supportMessage);
        }, 1500);
      }
      
    } catch (error) {
      console.error('Crisis-safe chat error:', error);
      
      // Fallback safe response
      const fallbackMessage: CrisisChatMessage = {
        id: `fallback-${Date.now()}`,
        text: getFallbackMessage(archetype),
        timestamp: new Date(),
        sender: 'khepera',
        safetyProcessed: true
      };
      
      setMessages(prev => [...prev, userMessage, fallbackMessage]);
    } finally {
      setIsLoading(false);
      const endTime = performance.now();
      setResponseTime(endTime - startTime);
      
      // Alert if response time exceeds safety targets
      if (endTime - startTime > 3000) {
        console.warn(`🚨 Crisis-safe chat response exceeded 3 seconds: ${(endTime - startTime).toFixed(2)}ms`);
      }
    }
  }, [isLoading, messages, emotionalContext, archetype, vocabularyLevel, crisisSafetySystem]);

  // ===============================
  // CRISIS INTERVENTION HANDLERS
  // ===============================

  const handleCrisisDetection = useCallback((response: CrisisSafeKheperaResponse) => {
    setCrisisDetected(true);
    
    // Map intervention level to crisis severity
    const severityMap = {
      'emergency': 'severe' as const,
      'direct': 'severe' as const,
      'gentle': 'moderate' as const,
      'none': 'mild' as const
    };
    
    const severity = severityMap[response.crisisAssessment.interventionLevel];
    setCurrentCrisisLevel(severity);
    
    // Notify parent component
    onCrisisDetected?.(severity);
    
    // Auto-show crisis support for severe cases
    if (severity === 'severe') {
      setTimeout(() => setShowCrisisSupport(true), 2000);
    }
    
    // Preload crisis resources
    if (response.safetyProtocols.preloadResources) {
      preloadCrisisResources();
    }
  }, [onCrisisDetected]);

  const handleCrisisResolved = useCallback(() => {
    setCrisisDetected(false);
    setShowCrisisSupport(false);
    setActiveDeescalation(null);
    onCrisisResolved?.();
  }, [onCrisisResolved]);

  // ===============================
  // DE-ESCALATION TECHNIQUES
  // ===============================

  const startDeescalation = useCallback((technique: DeescalationTechnique) => {
    switch (technique.type) {
      case 'breathing':
        startBreathingExercise();
        break;
      case 'grounding':
        startGroundingExercise();
        break;
      case 'present_moment':
        startPresentMomentAnchoring();
        break;
      default:
        break;
    }
  }, []);

  const startBreathingExercise = useCallback(() => {
    setBreathingState({
      active: true,
      phase: 'inhale',
      count: 0,
      cycle: 0,
      maxCycles: 3
    });
    
    // Add breathing guidance message
    const breathingMessage: CrisisChatMessage = {
      id: `breathing-${Date.now()}`,
      text: "Let's breathe together. I'll guide you through a calming pattern. Follow the circle and breathe with me.",
      timestamp: new Date(),
      sender: 'khepera',
      safetyProcessed: true
    };
    
    setMessages(prev => [...prev, breathingMessage]);
  }, []);

  const startGroundingExercise = useCallback(() => {
    setGroundingState(prev => ({
      ...prev,
      active: true,
      step: 0,
      responses: []
    }));
    
    // Add grounding guidance message
    const groundingMessage: CrisisChatMessage = {
      id: `grounding-${Date.now()}`,
      text: "Let's ground ourselves together. I'm going to ask you to notice things around you. Take your time with each one.",
      timestamp: new Date(),
      sender: 'khepera',
      safetyProcessed: true
    };
    
    setMessages(prev => [...prev, groundingMessage]);
    
    // Start first grounding prompt
    setTimeout(() => {
      const promptMessage: CrisisChatMessage = {
        id: `grounding-prompt-${Date.now()}`,
        text: groundingState.prompts[0],
        timestamp: new Date(),
        sender: 'khepera',
        safetyProcessed: true
      };
      
      setMessages(prev => [...prev, promptMessage]);
    }, 1000);
  }, [groundingState.prompts]);

  const startPresentMomentAnchoring = useCallback(() => {
    const anchoringMessage: CrisisChatMessage = {
      id: `anchoring-${Date.now()}`,
      text: "Let's anchor ourselves in this present moment. Right now, you're safe. You're here with me, and we're going to get through this together. Feel your feet on the ground. Notice your breathing. You are here, you are safe, and this moment will pass.",
      timestamp: new Date(),
      sender: 'khepera',
      safetyProcessed: true
    };
    
    setMessages(prev => [...prev, anchoringMessage]);
  }, []);

  // ===============================
  // BREATHING EXERCISE LOGIC
  // ===============================

  useEffect(() => {
    if (!breathingState.active) return;
    
    const interval = setInterval(() => {
      setBreathingState(prev => {
        const newCount = prev.count + 1;
        
        // Breathing pattern: 4 in, 4 hold, 6 out, 2 pause
        const phaseDurations = { inhale: 4, hold: 4, exhale: 6, pause: 2 };
        const currentPhaseDuration = phaseDurations[prev.phase];
        
        if (newCount >= currentPhaseDuration) {
          // Move to next phase
          const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
          const currentPhaseIndex = phases.indexOf(prev.phase);
          const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          const nextPhase = phases[nextPhaseIndex];
          
          // Check if we completed a full cycle
          const newCycle = nextPhase === 'inhale' ? prev.cycle + 1 : prev.cycle;
          
          if (newCycle >= prev.maxCycles && nextPhase === 'inhale') {
            // Exercise complete
            const completionMessage: CrisisChatMessage = {
              id: `breathing-complete-${Date.now()}`,
              text: "Beautiful. You did that perfectly. Notice how you feel now. Your nervous system is calming, and you're safe in this moment.",
              timestamp: new Date(),
              sender: 'khepera',
              safetyProcessed: true
            };
            
            setMessages(prev => [...prev, completionMessage]);
            
            return {
              active: false,
              phase: 'inhale',
              count: 0,
              cycle: 0,
              maxCycles: 3
            };
          }
          
          return {
            ...prev,
            phase: nextPhase,
            count: 0,
            cycle: newCycle
          };
        }
        
        return { ...prev, count: newCount };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [breathingState.active]);

  // ===============================
  // UTILITY FUNCTIONS
  // ===============================

  const preloadCrisisResources = useCallback(async () => {
    // Preload crisis support resources for faster access
    try {
      // This would typically preload crisis hotline data, local resources, etc.
      // For now, we'll simulate the preloading
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('✅ Crisis resources preloaded');
    } catch (error) {
      console.error('Failed to preload crisis resources:', error);
    }
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }, [inputValue, sendMessage]);

  // ===============================
  // RENDER HELPERS
  // ===============================

  const renderBreathingExercise = () => {
    if (!breathingState.active) return null;
    
    const phaseInstructions = {
      inhale: 'Breathe in slowly...',
      hold: 'Hold gently...',
      exhale: 'Breathe out softly...',
      pause: 'Pause naturally...'
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full mx-4 text-center bg-gradient-to-br from-sage-50 to-blue-50">
          <div className="mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full border-4 transition-all duration-1000 ${
              breathingState.phase === 'inhale' ? 'border-blue-400 scale-125' :
              breathingState.phase === 'hold' ? 'border-purple-400 scale-125' :
              breathingState.phase === 'exhale' ? 'border-green-400 scale-75' :
              'border-gray-300 scale-100'
            }`}>
              <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-sage-100 flex items-center justify-center">
                <div className="text-2xl font-light text-sage-600">
                  {breathingState.count + 1}
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-medium text-ink mb-2">
            {phaseInstructions[breathingState.phase]}
          </h3>
          
          <p className="text-muted mb-4">
            Cycle {breathingState.cycle + 1} of {breathingState.maxCycles}
          </p>
          
          <Button
            onClick={() => setBreathingState(prev => ({ ...prev, active: false }))}
            variant="ghost"
            size="sm"
            className="text-muted"
          >
            Stop exercise
          </Button>
        </Card>
      </div>
    );
  };

  const renderGroundingExercise = () => {
    if (!groundingState.active || groundingState.step >= groundingState.prompts.length) return null;
    
    return (
      <div className="border-l-4 border-sage-300 pl-4 my-4 bg-sage-50/30 p-4 rounded-r-lg">
        <h4 className="font-medium text-sage-700 mb-2">Grounding Exercise</h4>
        <p className="text-sm text-sage-600 mb-3">
          Step {groundingState.step + 1} of {groundingState.prompts.length}
        </p>
        <p className="text-sage-800 mb-4">
          {groundingState.prompts[groundingState.step]}
        </p>
        
        <div className="flex gap-2">
          <Button
            onClick={() => {
              // Move to next step
              setGroundingState(prev => ({
                ...prev,
                step: prev.step + 1,
                responses: [...prev.responses, 'completed']
              }));
              
              if (groundingState.step + 1 < groundingState.prompts.length) {
                // Add next prompt
                setTimeout(() => {
                  const nextPromptMessage: CrisisChatMessage = {
                    id: `grounding-prompt-${Date.now()}`,
                    text: groundingState.prompts[groundingState.step + 1],
                    timestamp: new Date(),
                    sender: 'khepera',
                    safetyProcessed: true
                  };
                  
                  setMessages(prev => [...prev, nextPromptMessage]);
                }, 1000);
              } else {
                // Exercise complete
                const completionMessage: CrisisChatMessage = {
                  id: `grounding-complete-${Date.now()}`,
                  text: "You did that beautifully. Notice how being present with your senses helps anchor you in this moment. You're safe, you're here, and you're doing great.",
                  timestamp: new Date(),
                  sender: 'khepera',
                  safetyProcessed: true
                };
                
                setMessages(prev => [...prev, completionMessage]);
                setGroundingState(prev => ({ ...prev, active: false }));
              }
            }}
            size="sm"
            className="bg-sage-400 hover:bg-sage-500 text-white"
          >
            Done with this step
          </Button>
          
          <Button
            onClick={() => setGroundingState(prev => ({ ...prev, active: false }))}
            variant="ghost"
            size="sm"
            className="text-muted"
          >
            Stop exercise
          </Button>
        </div>
      </div>
    );
  };

  // ===============================
  // MAIN RENDER
  // ===============================

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Crisis Support Modal */}
      {showCrisisSupport && (
        <CrisisSupport
          isVisible={true}
          onContinueWriting={() => setShowCrisisSupport(false)}
          onClose={handleCrisisResolved}
          severity={currentCrisisLevel}
        />
      )}
      
      {/* Breathing Exercise Overlay */}
      {renderBreathingExercise()}
      
      {/* Chat Header */}
      <div className="border-b border-sage-100 p-4 bg-gradient-to-r from-sage-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">K</span>
          </div>
          <div>
            <h3 className="font-medium text-ink">Khepera</h3>
            <p className="text-sm text-muted">Your AI emotional companion</p>
          </div>
          
          {/* Crisis indicator */}
          {crisisDetected && (
            <div className="ml-auto">
              <div className="flex items-center gap-2 px-3 py-1 bg-rose-100 border border-rose-200 rounded-full">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                <span className="text-xs text-rose-700">Safety mode active</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-sage-400 text-white'
                  : 'bg-gray-100 text-ink'
              } ${message.crisisFlags?.detected ? 'ring-2 ring-rose-200' : ''}`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              
              {/* Crisis flag indicator */}
              {message.crisisFlags?.detected && (
                <div className="mt-2 text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded">
                  Safety check: {message.crisisFlags.severity} ({Math.round(message.crisisFlags.confidence * 100)}% confidence)
                </div>
              )}
              
              <div className="mt-1 text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Grounding Exercise */}
        {renderGroundingExercise()}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 bg-gray-100 rounded-2xl">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Crisis Action Buttons */}
      {crisisDetected && (
        <div className="border-t border-rose-100 p-4 bg-rose-50/30">
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              onClick={() => setShowCrisisSupport(true)}
              size="sm"
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Get immediate support
            </Button>
            
            <Button
              onClick={startBreathingExercise}
              variant="outline"
              size="sm"
              className="border-sage-300 text-sage-700"
            >
              Breathing exercise
            </Button>
            
            <Button
              onClick={() => startGroundingExercise()}
              variant="outline"
              size="sm"
              className="border-sage-300 text-sage-700"
            >
              Grounding technique
            </Button>
          </div>
          
          <p className="text-xs text-rose-700">
            I'm monitoring our conversation for your safety. These tools are here if you need them.
          </p>
        </div>
      )}
      
      {/* Chat Input */}
      <div className="border-t border-sage-100 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="w-full p-3 border border-sage-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sage-400/25 focus:border-sage-300"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="bg-sage-400 hover:bg-sage-500 text-white"
          >
            Send
          </Button>
        </div>
        
        {/* Response time indicator (dev mode) */}
        {process.env.NODE_ENV === 'development' && responseTime > 0 && (
          <div className="mt-2 text-xs text-muted">
            Response time: {responseTime.toFixed(0)}ms
            {responseTime > 3000 && <span className="text-rose-600 ml-2">⚠️ Exceeded 3s target</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ===============================
// HELPER FUNCTIONS
// ===============================

function getWelcomeMessage(archetype: ArchetypeVoice): string {
  const welcomes = {
    sage: "✨ I am Khepera. Welcome to this sacred space of reflection. I'm here to listen, understand, and walk alongside you on your journey of emotional discovery.",
    coach: "✨ I am Khepera. I'm excited to connect with you! This is your space to explore, grow, and tap into your incredible inner strength. What's on your mind today?",
    poet: "✨ I am Khepera. Like words waiting to become poetry, your thoughts and feelings are welcome here. I'm honored to witness whatever wants to be expressed today."
  };
  
  return welcomes[archetype];
}

function getFallbackMessage(archetype: ArchetypeVoice): string {
  const fallbacks = {
    sage: "✨ I am Khepera. I'm having a moment of technical difficulty, but I want you to know that I'm here and I care about what you're sharing.",
    coach: "✨ I am Khepera. Technical hiccup on my end, but your thoughts and feelings matter to me. Let's try again.",
    poet: "✨ I am Khepera. Even in digital storms, your words find their way to me. I'm here, listening to whatever you need to express."
  };
  
  return fallbacks[archetype];
}

function mapCrisisSeverity(interventionLevel: string): 'mild' | 'moderate' | 'severe' {
  switch (interventionLevel) {
    case 'emergency':
    case 'direct':
      return 'severe';
    case 'gentle':
      return 'moderate';
    default:
      return 'mild';
  }
}

export default KheperaCrisisSafeChat;