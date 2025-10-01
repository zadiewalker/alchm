'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { KheperaScarabIcon, KheperaMinimalIcon, KheperaLoadingSpinner } from './KheperaScarabIcons';

// ===== TYPES & INTERFACES =====

interface MobileChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'khepera';
  timestamp: Date;
  type?: 'text' | 'reflection' | 'affirmation' | 'grounding' | 'crisis_check';
  isTyping?: boolean;
  emotion?: 'calm' | 'supportive' | 'celebratory' | 'grounding';
}

interface KheperaMobileChatProps {
  isVisible?: boolean;
  onClose?: () => void;
  onCrisisDetected?: () => void;
  initialMessage?: string;
  mode?: 'fullscreen' | 'overlay' | 'inline';
  className?: string;
}

// ===== GROUNDING TECHNIQUES =====

const GROUNDING_TECHNIQUES = [
  {
    id: 'five-four-three-two-one',
    title: '5-4-3-2-1 Technique',
    instruction: "Let's try the 5-4-3-2-1 grounding technique together. Name 5 things you can see around you.",
    steps: [
      "5 things you can see",
      "4 things you can touch", 
      "3 things you can hear",
      "2 things you can smell",
      "1 thing you can taste"
    ]
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    instruction: "Let's practice box breathing together. Follow my guide:",
    steps: [
      "Breathe in for 4 counts",
      "Hold for 4 counts",
      "Breathe out for 4 counts", 
      "Hold for 4 counts"
    ]
  },
  {
    id: 'body-scan',
    title: 'Gentle Body Scan',
    instruction: "Let's do a gentle body scan. Start by noticing your feet touching the ground.",
    steps: [
      "Notice your feet",
      "Feel your legs",
      "Sense your torso",
      "Relax your shoulders",
      "Soften your face"
    ]
  }
];

// ===== AFFIRMING RESPONSES =====

const AFFIRMING_RESPONSES = [
  "Your feelings are completely valid and important.",
  "Thank you for trusting me with what you're going through.",
  "I see your strength in reaching out.",
  "You're doing the best you can with what you have right now.",
  "Your healing journey matters, and so do you.",
  "It takes courage to pause and reflect like this.",
  "I'm grateful you felt safe enough to share this with me."
];

// ===== MAIN MOBILE CHAT COMPONENT =====

export default function KheperaMobileChat({
  isVisible = false,
  onClose,
  onCrisisDetected,
  initialMessage,
  mode = 'overlay',
  className = ''
}: KheperaMobileChatProps) {
  
  // ===== STATE MANAGEMENT =====
  
  const [messages, setMessages] = useState<MobileChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isKheperaTyping, setIsKheperaTyping] = useState(false);
  const [currentGrounding, setCurrentGrounding] = useState<string | null>(null);
  const [groundingStep, setGroundingStep] = useState(0);
  const [showEmergencyOptions, setShowEmergencyOptions] = useState(false);
  const [chatHeight, setChatHeight] = useState<number>(window.innerHeight * 0.7);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [safeAreaInsets, setSafeAreaInsets] = useState({ bottom: 0, top: 0 });
  
  // ===== REFS =====
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // ===== SAFE AREA & KEYBOARD DETECTION =====
  
  useEffect(() => {
    // Detect safe area insets for iPhone X+ devices
    const detectSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      const safeAreaTop = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0;
      const safeAreaBottom = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0;
      
      setSafeAreaInsets({
        top: safeAreaTop,
        bottom: safeAreaBottom
      });
    };
    
    detectSafeArea();
    
    // Keyboard height detection for iOS
    const handleViewportChange = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const screenHeight = window.screen.height;
      const keyboardHeight = Math.max(0, screenHeight - viewportHeight - safeAreaInsets.bottom);
      
      setKeyboardHeight(keyboardHeight);
      setChatHeight(viewportHeight - 60 - safeAreaInsets.top - safeAreaInsets.bottom);
    };
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => window.visualViewport?.removeEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
      return () => window.removeEventListener('resize', handleViewportChange);
    }
  }, [safeAreaInsets]);
  
  // ===== AUTO-SCROLL =====
  
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // ===== WELCOME MESSAGE =====
  
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage = initialMessage || 
          "Hi there, beautiful soul ✨ I'm Khepera, here to support you on your healing journey. What's alive in your heart right now?";
        
        addKheperaMessage(welcomeMessage, 'affirmation');
      }, 800);
    }
  }, [isVisible, messages.length, initialMessage]);
  
  // ===== CRISIS DETECTION =====
  
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'don\'t want to live',
    'hurt myself', 'self harm', 'cutting', 'overdose',
    'nobody cares', 'hopeless', 'can\'t go on', 'worthless',
    'better off dead', 'want to die'
  ];
  
  const detectCrisis = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  }, []);
  
  const detectGroundingNeed = useCallback((text: string) => {
    const groundingKeywords = [
      'overwhelmed', 'panic', 'anxiety', 'stressed', 'spiraling',
      'can\'t breathe', 'racing thoughts', 'dizzy', 'shaking'
    ];
    
    const lowerText = text.toLowerCase();
    return groundingKeywords.some(keyword => lowerText.includes(keyword));
  }, []);
  
  // ===== MESSAGE HANDLERS =====
  
  const addKheperaMessage = useCallback((
    content: string, 
    type: MobileChatMessage['type'] = 'text',
    emotion: MobileChatMessage['emotion'] = 'supportive'
  ) => {
    const newMessage: MobileChatMessage = {
      id: `khepera-${Date.now()}`,
      content,
      sender: 'khepera',
      timestamp: new Date(),
      type,
      emotion
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Gentle vibration for supportive responses
    if (navigator.vibrate && type === 'affirmation') {
      navigator.vibrate([30, 50, 30]);
    }
  }, []);
  
  const handleSendMessage = useCallback(async (content: string, type: MobileChatMessage['type'] = 'text') => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: MobileChatMessage = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Crisis detection with immediate response
    if (detectCrisis(content)) {
      setShowEmergencyOptions(true);
      onCrisisDetected?.();
      
      setTimeout(() => {
        addKheperaMessage(
          "I hear that you're in a lot of pain right now, and I want you to know that your life has value. You don't have to face this alone. Would you like me to connect you with someone who can provide immediate support?",
          'crisis_check',
          'supportive'
        );
      }, 1000);
      return;
    }
    
    // Grounding technique suggestion
    if (detectGroundingNeed(content)) {
      setTimeout(() => {
        addKheperaMessage(
          "It sounds like you're feeling overwhelmed right now. That's completely understandable. Would you like to try a gentle grounding technique together?",
          'grounding',
          'calm'
        );
        
        setTimeout(() => {
          setCurrentGrounding('five-four-three-two-one');
          setGroundingStep(0);
        }, 2000);
      }, 1000);
      return;
    }
    
    // Simulate Khepera typing
    setIsKheperaTyping(true);
    
    try {
      // Simulate thoughtful response time
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // Generate contextual response
      const affirmingResponse = AFFIRMING_RESPONSES[Math.floor(Math.random() * AFFIRMING_RESPONSES.length)];
      addKheperaMessage(affirmingResponse, 'reflection', 'supportive');
      
      // Follow up with a gentle question
      setTimeout(() => {
        const followUpQuestions = [
          "What does your body need right now?",
          "How are you caring for yourself in this moment?",
          "What would feel most supportive for you today?",
          "Is there anything you'd like to explore together?",
          "What are you noticing about this experience?"
        ];
        
        const followUp = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
        addKheperaMessage(followUp, 'reflection', 'calm');
      }, 2000);
      
    } catch (error) {
      addKheperaMessage(
        "I'm having trouble connecting right now, but I'm still here with you. Sometimes technology needs a moment to breathe, just like we do.",
        'text',
        'supportive'
      );
    } finally {
      setIsKheperaTyping(false);
    }
  }, [detectCrisis, detectGroundingNeed, onCrisisDetected, addKheperaMessage]);
  
  // ===== GROUNDING TECHNIQUE HANDLER =====
  
  const handleGroundingResponse = useCallback((response: string) => {
    if (!currentGrounding) return;
    
    const technique = GROUNDING_TECHNIQUES.find(t => t.id === currentGrounding);
    if (!technique) return;
    
    // Add user's grounding response
    const userMessage: MobileChatMessage = {
      id: `user-grounding-${Date.now()}`,
      content: response,
      sender: 'user',
      timestamp: new Date(),
      type: 'grounding'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Move to next step or complete
    if (groundingStep < technique.steps.length - 1) {
      setTimeout(() => {
        const nextStep = groundingStep + 1;
        setGroundingStep(nextStep);
        
        addKheperaMessage(
          `Beautiful. Now, ${technique.steps[nextStep].toLowerCase()}.`,
          'grounding',
          'calm'
        );
      }, 1000);
    } else {
      // Complete grounding exercise
      setTimeout(() => {
        addKheperaMessage(
          "Wonderful. Take a moment to notice how you're feeling now. You've just practiced a powerful tool for staying present and grounded. How was that experience for you?",
          'affirmation',
          'celebratory'
        );
        
        setCurrentGrounding(null);
        setGroundingStep(0);
      }, 1000);
    }
  }, [currentGrounding, groundingStep, addKheperaMessage]);
  
  // ===== INPUT HANDLERS =====
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentGrounding) {
        handleGroundingResponse(inputValue);
      } else {
        handleSendMessage(inputValue);
      }
    }
  }, [inputValue, currentGrounding, handleGroundingResponse, handleSendMessage]);
  
  // ===== RENDER HELPERS =====
  
  const renderMessage = (message: MobileChatMessage, index: number) => {
    const isUser = message.sender === 'user';
    const isLastMessage = index === messages.length - 1;
    
    return (
      <div
        key={message.id}
        className={`
          flex items-start gap-3 mb-6 px-4
          ${isUser ? 'flex-row-reverse' : 'flex-row'}
          ${isLastMessage ? 'animate-fade-in-up' : ''}
        `}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="flex-shrink-0">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(145deg, ${getEmotionColor(message.emotion)} 0%, ${getEmotionColor(message.emotion, true)} 100%)`,
                boxShadow: '0 4px 12px rgba(164, 183, 146, 0.3)'
              }}
            >
              <KheperaMinimalIcon size={18} mode="present" />
            </div>
          </div>
        )}
        
        {/* Message Bubble */}
        <div
          className={`
            max-w-[85%] rounded-3xl px-5 py-4 break-words
            ${isUser 
              ? 'bg-sage-400 text-white' 
              : 'bg-white border border-sage-100 text-sanctuary-gray-800'
            }
          `}
          style={{
            boxShadow: isUser 
              ? '0 4px 16px rgba(164, 183, 146, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.08)',
            borderRadius: isUser 
              ? '24px 24px 6px 24px'
              : '24px 24px 24px 6px',
            lineHeight: '1.5'
          }}
        >
          <p className="text-base leading-relaxed">{message.content}</p>
          
          {/* Message metadata */}
          <div className={`
            text-xs mt-3 opacity-60
            ${isUser ? 'text-white/80' : 'text-sanctuary-gray-500'}
          `}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const getEmotionColor = (emotion?: MobileChatMessage['emotion'], darker = false) => {
    const colors = {
      calm: darker ? '#93a682' : '#a4b792',
      supportive: darker ? '#93a682' : '#a4b792', 
      celebratory: darker ? '#d4a574' : '#e6b887',
      grounding: darker ? '#8b7355' : '#a08869'
    };
    
    return colors[emotion || 'supportive'];
  };
  
  const renderTypingIndicator = () => {
    if (!isKheperaTyping) return null;
    
    return (
      <div className="flex items-start gap-3 mb-6 px-4">
        <div className="flex-shrink-0">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #a4b792 0%, #93a682 100%)',
              boxShadow: '0 4px 12px rgba(164, 183, 146, 0.3)'
            }}
          >
            <KheperaLoadingSpinner size={18} mode="present" />
          </div>
        </div>
        
        <div 
          className="bg-white border border-sage-100 rounded-3xl px-5 py-4"
          style={{
            borderRadius: '24px 24px 24px 6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  };
  
  const renderGroundingPrompt = () => {
    if (!currentGrounding) return null;
    
    const technique = GROUNDING_TECHNIQUES.find(t => t.id === currentGrounding);
    if (!technique) return null;
    
    return (
      <div className="px-4 py-3 bg-calm-blue/10 border-t border-calm-blue/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-calm-blue rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🧘</span>
          </div>
          <div>
            <h4 className="font-semibold text-calm-blue text-sm">{technique.title}</h4>
            <p className="text-xs text-calm-blue/80">Step {groundingStep + 1} of {technique.steps.length}</p>
          </div>
        </div>
        
        <p className="text-sm text-sanctuary-gray-700 leading-relaxed">
          {groundingStep === 0 ? technique.instruction : `Now, ${technique.steps[groundingStep].toLowerCase()}.`}
        </p>
      </div>
    );
  };
  
  const renderEmergencyOptions = () => {
    if (!showEmergencyOptions) return null;
    
    return (
      <div className="px-4 py-4 bg-red-50 border-t border-red-200">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-red-800">Immediate Support Available:</p>
          
          <button
            onClick={() => window.location.href = 'tel:988'}
            className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 text-white rounded-2xl font-semibold text-lg"
            style={{ minHeight: '56px' }}
          >
            <span>📞</span>
            <span>Call 988 Crisis Lifeline</span>
          </button>
          
          <button
            onClick={() => window.location.href = 'sms:741741&body=CRISIS'}
            className="w-full flex items-center justify-center gap-3 py-4 bg-sage-400 text-white rounded-2xl font-semibold text-lg"
            style={{ minHeight: '56px' }}
          >
            <span>💬</span>
            <span>Text Crisis Support</span>
          </button>
          
          <button
            onClick={() => setShowEmergencyOptions(false)}
            className="w-full py-3 text-center text-sm text-sanctuary-gray-600"
          >
            I'm safe for now
          </button>
        </div>
      </div>
    );
  };
  
  // ===== MAIN RENDER =====
  
  if (!isVisible) return null;
  
  const containerStyle = mode === 'fullscreen' ? {
    position: 'fixed' as const,
    top: safeAreaInsets.top,
    left: 0,
    right: 0,
    bottom: safeAreaInsets.bottom + keyboardHeight,
    zIndex: 50,
    backgroundColor: 'white'
  } : {
    height: chatHeight,
    borderRadius: '24px 24px 0 0',
    boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.15)'
  };
  
  return (
    <div
      ref={chatContainerRef}
      className={`khepera-mobile-chat flex flex-col bg-white ${className}`}
      style={containerStyle}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b border-sage-100"
        style={{
          background: 'linear-gradient(145deg, #a4b792 0%, #93a682 100%)',
          paddingTop: mode === 'fullscreen' ? 16 + safeAreaInsets.top : 16
        }}
      >
        <div className="flex items-center gap-3">
          <KheperaScarabIcon 
            size={36} 
            mode="present"
            showAura={true}
            breathingPhase="exhale"
          />
          <div>
            <h3 className="text-white font-semibold text-lg">Khepera</h3>
            <p className="text-white/80 text-sm">Here for your healing journey</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl"
            aria-label="Close chat"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto py-4"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {messages.map((message, index) => renderMessage(message, index))}
        {renderTypingIndicator()}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Grounding Prompt */}
      {renderGroundingPrompt()}
      
      {/* Emergency Options */}
      {renderEmergencyOptions()}
      
      {/* Input Area */}
      <div 
        className="p-4 border-t border-sage-100 bg-sanctuary-gray-50"
        style={{ 
          paddingBottom: Math.max(16, safeAreaInsets.bottom),
          transform: `translateY(-${keyboardHeight}px)`
        }}
      >
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentGrounding ? "Share what you notice..." : "What's alive in your heart?"}
              className="
                w-full resize-none rounded-2xl border border-sage-200 px-4 py-4
                focus:border-sage-400 focus:ring-2 focus:ring-sage-200
                text-base leading-relaxed max-h-32
              "
              rows={1}
              style={{
                minHeight: '56px',
                fontSize: '16px' // Prevents zoom on iOS
              }}
            />
          </div>
          
          <button
            onClick={() => {
              if (currentGrounding) {
                handleGroundingResponse(inputValue);
              } else {
                handleSendMessage(inputValue);
              }
            }}
            disabled={!inputValue.trim() || isKheperaTyping}
            className="
              flex-shrink-0 w-14 h-14 rounded-2xl
              bg-sage-400 hover:bg-sage-500 disabled:bg-sage-200
              text-white flex items-center justify-center
              transition-all duration-200
              disabled:cursor-not-allowed
            "
            style={{ minHeight: '56px', minWidth: '56px' }}
            aria-label="Send message"
          >
            {isKheperaTyping ? (
              <KheperaLoadingSpinner size={22} mode="present" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== MOBILE CHAT ANIMATIONS =====

const mobileStyles = `
  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.4s ease-out;
  }
  
  .khepera-mobile-chat ::-webkit-scrollbar {
    width: 4px;
  }
  
  .khepera-mobile-chat ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .khepera-mobile-chat ::-webkit-scrollbar-thumb {
    background: rgba(164, 183, 146, 0.3);
    border-radius: 2px;
  }
`;

// Inject mobile styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = mobileStyles;
  document.head.appendChild(styleElement);
}