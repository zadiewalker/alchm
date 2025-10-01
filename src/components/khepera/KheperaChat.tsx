'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { KheperaScarabIcon, KheperaMinimalIcon, KheperaLoadingSpinner } from './KheperaScarabIcons';

// ===== TYPES & INTERFACES =====

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'khepera';
  timestamp: Date;
  type?: 'text' | 'reflection' | 'affirmation' | 'crisis_check';
  isTyping?: boolean;
}

interface QuickReply {
  id: string;
  text: string;
  type: 'emotional' | 'practical' | 'reflection';
  icon?: string;
}

interface KheperaChatProps {
  className?: string;
  isReducedMotion?: boolean;
  onCrisisDetected?: () => void;
  userId?: string;
}

// ===== TRAUMA-INFORMED QUICK REPLIES =====

const QUICK_REPLIES: QuickReply[] = [
  { id: 'feeling-overwhelmed', text: 'I\'m feeling overwhelmed', type: 'emotional', icon: '💫' },
  { id: 'need-grounding', text: 'Help me ground myself', type: 'practical', icon: '🌱' },
  { id: 'want-reflection', text: 'I want to reflect', type: 'reflection', icon: '✨' },
  { id: 'celebrating', text: 'I\'m celebrating something', type: 'emotional', icon: '🎉' },
  { id: 'need-pause', text: 'I need a pause', type: 'practical', icon: '⏸️' },
  { id: 'ready-to-write', text: 'Ready to journal', type: 'reflection', icon: '✍️' }
];

// ===== MAIN CHAT COMPONENT =====

export default function KheperaChat({ 
  className = '',
  isReducedMotion = false,
  onCrisisDetected,
  userId
}: KheperaChatProps) {
  
  // ===== STATE MANAGEMENT =====
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isKheperaTyping, setIsKheperaTyping] = useState(false);
  const [chatMode, setChatMode] = useState<'minimized' | 'floating' | 'fullscreen'>('minimized');
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  
  // ===== REFS =====
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // ===== MOBILE DETECTION =====
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // ===== AUTO-SCROLL TO LATEST MESSAGE =====
  
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && !isReducedMotion) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [isReducedMotion]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // ===== WELCOME MESSAGE ON FIRST OPEN =====
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addKheperaMessage(
          "Hello, beautiful soul. I'm Khepera, your emotional concierge. I'm here to support you on your healing journey. How are you feeling right now?",
          'affirmation'
        );
      }, 800);
    }
  }, [isOpen, messages.length]);
  
  // ===== CRISIS KEYWORD DETECTION =====
  
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'don\'t want to live',
    'hurt myself', 'self harm', 'cutting', 'overdose',
    'nobody cares', 'hopeless', 'can\'t go on'
  ];
  
  const detectCrisis = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  }, []);
  
  // ===== MESSAGE HANDLERS =====
  
  const addKheperaMessage = useCallback((content: string, type: Message['type'] = 'text') => {
    const newMessage: Message = {
      id: `khepera-${Date.now()}`,
      content,
      sender: 'khepera',
      timestamp: new Date(),
      type
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (!isOpen) {
      setHasUnreadMessages(true);
      
      // Gentle vibration for new message (trauma-informed)
      if (navigator.vibrate && !isReducedMotion) {
        navigator.vibrate([50, 100, 50]);
      }
    }
    
    setLastActivity(Date.now());
  }, [isOpen, isReducedMotion]);
  
  const handleSendMessage = useCallback(async (content: string, type: Message['type'] = 'text') => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowQuickReplies(false);
    
    // Crisis detection
    if (detectCrisis(content)) {
      onCrisisDetected?.();
      
      setTimeout(() => {
        addKheperaMessage(
          "I notice you're going through something really difficult right now. Your feelings are completely valid, and you don't have to face this alone. Would you like me to connect you with someone who can provide immediate support?",
          'crisis_check'
        );
      }, 1000);
      return;
    }
    
    // Simulate Khepera typing
    setIsKheperaTyping(true);
    
    try {
      // Simulate API call delay (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // Mock response (replace with actual AI response)
      const responses = [
        "Thank you for sharing that with me. Your feelings are completely valid and important.",
        "I hear you, and I want you to know that what you're experiencing matters.",
        "That sounds like it takes a lot of strength. How are you taking care of yourself right now?",
        "I'm grateful you felt safe enough to share this with me. What feels most supportive for you today?",
        "Your awareness and willingness to reflect shows such wisdom. What are you noticing about this experience?"
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      addKheperaMessage(response, 'reflection');
      
    } catch (error) {
      addKheperaMessage(
        "I'm having trouble connecting right now, but I'm still here with you. Sometimes technology needs a moment, just like we do.",
        'text'
      );
    } finally {
      setIsKheperaTyping(false);
    }
  }, [detectCrisis, onCrisisDetected, addKheperaMessage]);
  
  const handleQuickReply = useCallback((reply: QuickReply) => {
    handleSendMessage(reply.text, reply.type as Message['type']);
  }, [handleSendMessage]);
  
  // ===== CHAT TOGGLE HANDLERS =====
  
  const handleToggleChat = useCallback(() => {
    if (isMobile && isOpen) {
      setChatMode(chatMode === 'floating' ? 'fullscreen' : 'floating');
    } else {
      setIsOpen(!isOpen);
      setHasUnreadMessages(false);
      
      // Focus input when opening
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 300);
      }
    }
    
    // Gentle haptic feedback
    if (navigator.vibrate && !isReducedMotion) {
      navigator.vibrate(30);
    }
  }, [isOpen, isMobile, chatMode, isReducedMotion]);
  
  // ===== KEYBOARD HANDLERS =====
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  }, [inputValue, handleSendMessage]);
  
  // ===== RENDER HELPERS =====
  
  const renderChatTrigger = () => (
    <button
      onClick={handleToggleChat}
      className={`
        fixed z-40 transition-all duration-300 ease-out
        ${isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'}
        ${isOpen && isMobile ? 'bottom-4' : ''}
      `}
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #a4b792 0%, #93a682 100%)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: hasUnreadMessages 
          ? '0 8px 32px rgba(164, 183, 146, 0.4), 0 0 0 4px rgba(164, 183, 146, 0.3)'
          : '0 8px 32px rgba(164, 183, 146, 0.4)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transform: isOpen ? 'scale(0.9)' : 'scale(1)',
        touchAction: 'manipulation'
      }}
      onMouseEnter={(e) => {
        if (!isMobile && !isReducedMotion) {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile && !isReducedMotion) {
          e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1)';
        }
      }}
      aria-label={isOpen ? 'Close Khepera chat' : 'Open Khepera chat'}
    >
      <div className="relative">
        <KheperaMinimalIcon 
          size={28} 
          mode="present"
          className={hasUnreadMessages ? 'animate-gentle-breathe' : ''}
        />
        
        {hasUnreadMessages && (
          <div 
            className="absolute -top-1 -right-1 w-3 h-3 bg-warm-amber rounded-full animate-gentle-pulse"
            style={{
              boxShadow: '0 0 0 2px #a4b792'
            }}
          />
        )}
      </div>
    </button>
  );
  
  const renderMessage = (message: Message, index: number) => {
    const isUser = message.sender === 'user';
    const isLastMessage = index === messages.length - 1;
    
    return (
      <div
        key={message.id}
        className={`
          flex items-start gap-3 mb-4
          ${isUser ? 'flex-row-reverse' : 'flex-row'}
          ${isLastMessage ? 'animate-fade-in-up' : ''}
        `}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="flex-shrink-0">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #a4b792 0%, #93a682 100%)',
                boxShadow: '0 2px 8px rgba(164, 183, 146, 0.3)'
              }}
            >
              <KheperaMinimalIcon size={16} mode="present" />
            </div>
          </div>
        )}
        
        {/* Message Bubble */}
        <div
          className={`
            max-w-[80%] rounded-2xl px-4 py-3 break-words
            ${isUser 
              ? 'bg-sage-400 text-white ml-auto' 
              : 'bg-white border border-sage-100 text-sanctuary-gray-800'
            }
          `}
          style={{
            boxShadow: isUser 
              ? '0 2px 8px rgba(164, 183, 146, 0.3)'
              : '0 1px 3px rgba(0, 0, 0, 0.08)',
            borderRadius: isUser 
              ? '20px 20px 4px 20px'
              : '20px 20px 20px 4px'
          }}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          
          {/* Message metadata */}
          <div className={`
            text-xs mt-2 opacity-60
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
  
  const renderQuickReplies = () => {
    if (!showQuickReplies || messages.length > 2) return null;
    
    return (
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {QUICK_REPLIES.map(reply => (
            <button
              key={reply.id}
              onClick={() => handleQuickReply(reply)}
              className="
                flex items-center gap-2 px-3 py-2 rounded-full
                bg-sage-50 border border-sage-200 
                text-sage-700 text-sm
                hover:bg-sage-100 hover:border-sage-300
                transition-all duration-200
                touch-target
              "
              style={{ minHeight: '44px' }}
            >
              <span>{reply.icon}</span>
              <span>{reply.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  const renderTypingIndicator = () => {
    if (!isKheperaTyping) return null;
    
    return (
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #a4b792 0%, #93a682 100%)',
              boxShadow: '0 2px 8px rgba(164, 183, 146, 0.3)'
            }}
          >
            <KheperaLoadingSpinner size={16} mode="present" />
          </div>
        </div>
        
        <div 
          className="bg-white border border-sage-100 rounded-2xl px-4 py-3"
          style={{
            borderRadius: '20px 20px 20px 4px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
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
  
  const renderChatWindow = () => {
    const windowHeight = isMobile && chatMode === 'fullscreen' ? '100vh' : '500px';
    const windowWidth = isMobile ? '100vw' : '380px';
    
    return (
      <div
        ref={chatContainerRef}
        className={`
          fixed z-30 bg-white border border-sage-200 shadow-2xl
          ${isMobile ? 'left-0 right-0' : 'bottom-20 right-6'}
          ${isMobile && chatMode === 'fullscreen' ? 'top-0 bottom-0' : ''}
          ${!isReducedMotion ? 'transition-all duration-300 ease-out' : ''}
        `}
        style={{
          width: windowWidth,
          height: windowHeight,
          borderRadius: isMobile && chatMode === 'fullscreen' ? '0' : '24px',
          backdropFilter: 'blur(40px)',
          boxShadow: '0 24px 80px rgba(164, 183, 146, 0.25)',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden'
        }}
      >
        {/* Chat Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-sage-100"
          style={{
            background: 'linear-gradient(145deg, #a4b792 0%, #93a682 100%)',
            borderRadius: isMobile && chatMode === 'fullscreen' ? '0' : '24px 24px 0 0'
          }}
        >
          <div className="flex items-center gap-3">
            <KheperaScarabIcon 
              size={32} 
              mode="present"
              showAura={true}
              breathingPhase="exhale"
            />
            <div>
              <h3 className="text-white font-semibold text-lg">Khepera</h3>
              <p className="text-white/80 text-sm">Your emotional concierge</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={() => setChatMode(chatMode === 'floating' ? 'fullscreen' : 'floating')}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label={chatMode === 'floating' ? 'Expand to fullscreen' : 'Minimize chat'}
              >
                {chatMode === 'floating' ? '⤢' : '⤡'}
              </button>
            )}
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ 
            height: isMobile && chatMode === 'fullscreen' 
              ? 'calc(100vh - 140px)' 
              : 'calc(500px - 140px)',
            scrollBehavior: isReducedMotion ? 'auto' : 'smooth'
          }}
        >
          {messages.map((message, index) => renderMessage(message, index))}
          {renderTypingIndicator()}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Replies */}
        {renderQuickReplies()}
        
        {/* Input Area */}
        <div className="p-4 border-t border-sage-100 bg-sanctuary-gray-50">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your heart..."
                className="
                  w-full resize-none rounded-2xl border border-sage-200 px-4 py-3
                  focus:border-sage-400 focus:ring-2 focus:ring-sage-200
                  text-sm leading-relaxed max-h-24
                "
                rows={1}
                style={{
                  minHeight: '44px',
                  scrollbarWidth: 'thin'
                }}
              />
            </div>
            
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isKheperaTyping}
              className="
                flex-shrink-0 w-12 h-12 rounded-full
                bg-sage-400 hover:bg-sage-500 disabled:bg-sage-200
                text-white flex items-center justify-center
                transition-all duration-200
                disabled:cursor-not-allowed
              "
              aria-label="Send message"
            >
              {isKheperaTyping ? (
                <KheperaLoadingSpinner size={20} mode="present" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // ===== MAIN RENDER =====
  
  return (
    <div className={`khepera-chat ${className}`}>
      {renderChatTrigger()}
      {renderChatWindow()}
      
      {/* Mobile backdrop */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-20"
          style={{ backdropFilter: 'blur(8px)' }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// ===== CHAT MESSAGE COMPONENT =====

export function ChatMessage({ 
  message, 
  isUser = false 
}: { 
  message: Message; 
  isUser?: boolean; 
}) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <KheperaMinimalIcon size={24} mode="present" />
        </div>
      )}
      
      <div 
        className={`
          max-w-[80%] rounded-2xl px-4 py-3
          ${isUser 
            ? 'bg-sage-400 text-white' 
            : 'bg-white border border-sage-100'
          }
        `}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}

// ===== STYLES FOR ANIMATIONS =====

const chatStyles = `
  @keyframes gentle-breathe {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.02); opacity: 0.9; }
  }
  
  @keyframes gentle-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  .animate-gentle-breathe {
    animation: gentle-breathe 3s ease-in-out infinite;
  }
  
  .animate-gentle-pulse {
    animation: gentle-pulse 2s ease-in-out infinite;
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.4s ease-out;
  }
  
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Custom scrollbar for chat */
  .khepera-chat ::-webkit-scrollbar {
    width: 6px;
  }
  
  .khepera-chat ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .khepera-chat ::-webkit-scrollbar-thumb {
    background: rgba(164, 183, 146, 0.3);
    border-radius: 3px;
  }
  
  .khepera-chat ::-webkit-scrollbar-thumb:hover {
    background: rgba(164, 183, 146, 0.5);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = chatStyles;
  document.head.appendChild(styleElement);
}