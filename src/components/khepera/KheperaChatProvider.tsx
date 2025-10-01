'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import KheperaChat from './KheperaChat';

// ===== TYPES & INTERFACES =====

interface KheperaChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (content: string) => void;
  hasUnreadMessages: boolean;
  setHasUnreadMessages: (hasUnread: boolean) => void;
  isAvailable: boolean;
  setIsAvailable: (available: boolean) => void;
}

interface KheperaChatProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  crisisHandler?: () => void;
  userId?: string;
}

// ===== CONTEXT CREATION =====

const KheperaChatContext = createContext<KheperaChatContextType | null>(null);

export function useKheperaChat() {
  const context = useContext(KheperaChatContext);
  if (!context) {
    throw new Error('useKheperaChat must be used within a KheperaChatProvider');
  }
  return context;
}

// ===== PROVIDER COMPONENT =====

export default function KheperaChatProvider({
  children,
  enabled = true,
  crisisHandler,
  userId
}: KheperaChatProviderProps) {
  
  // ===== STATE MANAGEMENT =====
  
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  
  // ===== REDUCED MOTION PREFERENCE =====
  
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // ===== CHAT HANDLERS =====
  
  const openChat = useCallback(() => {
    if (!enabled || !isAvailable) return;
    setIsOpen(true);
    setHasUnreadMessages(false);
  }, [enabled, isAvailable]);
  
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, openChat, closeChat]);
  
  const sendMessage = useCallback((content: string) => {
    if (!enabled || !isAvailable) {
      setPendingMessage(content);
      return;
    }
    
    if (!isOpen) {
      openChat();
    }
    
    // The actual message sending will be handled by the KheperaChat component
    // This is just for external triggers
    setPendingMessage(content);
  }, [enabled, isAvailable, isOpen, openChat]);
  
  // ===== CRISIS DETECTION HANDLER =====
  
  const handleCrisisDetected = useCallback(() => {
    // Close chat temporarily to prioritize crisis resources
    setIsOpen(false);
    
    // Trigger external crisis handler
    crisisHandler?.();
    
    // Show gentle notification that crisis support is available
    if (navigator.vibrate && !isReducedMotion) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [crisisHandler, isReducedMotion]);
  
  // ===== SMART AVAILABILITY LOGIC =====
  
  useEffect(() => {
    // Don't show Khepera on auth pages to avoid overwhelming new users
    const checkPageAvailability = () => {
      const path = window.location.pathname;
      const isAuthPage = path.includes('/auth') || path.includes('/login') || path.includes('/signup');
      const isOnboardingPage = path.includes('/onboarding');
      
      // Available everywhere except auth and initial onboarding
      setIsAvailable(!isAuthPage && !isOnboardingPage);
    };
    
    checkPageAvailability();
    window.addEventListener('popstate', checkPageAvailability);
    
    return () => {
      window.removeEventListener('popstate', checkPageAvailability);
    };
  }, []);
  
  // ===== KEYBOARD SHORTCUTS =====
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && enabled && isAvailable) {
        e.preventDefault();
        toggleChat();
      }
      
      // Escape to close chat
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isAvailable, isOpen, toggleChat, closeChat]);
  
  // ===== CONTEXT VALUE =====
  
  const contextValue: KheperaChatContextType = {
    isOpen,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    hasUnreadMessages,
    setHasUnreadMessages,
    isAvailable,
    setIsAvailable
  };
  
  // ===== RENDER =====
  
  return (
    <KheperaChatContext.Provider value={contextValue}>
      {children}
      
      {/* Render Khepera Chat if enabled and available */}
      {enabled && isAvailable && (
        <KheperaChat
          className="khepera-chat-global"
          isReducedMotion={isReducedMotion}
          onCrisisDetected={handleCrisisDetected}
          userId={userId}
        />
      )}
    </KheperaChatContext.Provider>
  );
}

// ===== CHAT TRIGGER COMPONENT =====

export function KheperaChatTrigger({ 
  children, 
  message 
}: { 
  children: React.ReactNode; 
  message?: string; 
}) {
  const { openChat, sendMessage, isAvailable } = useKheperaChat();
  
  const handleClick = useCallback(() => {
    if (message) {
      sendMessage(message);
    } else {
      openChat();
    }
  }, [message, sendMessage, openChat]);
  
  if (!isAvailable) return null;
  
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 transition-colors"
    >
      {children}
    </button>
  );
}

// ===== SMART CHAT POSITIONING =====

export function ChatPositionManager() {
  const { isOpen } = useKheperaChat();
  
  useEffect(() => {
    // Adjust crisis button position when chat is open
    const crisisButton = document.querySelector('[aria-label*="crisis support"]') as HTMLElement;
    
    if (crisisButton) {
      if (isOpen) {
        crisisButton.style.transform = 'translateY(-80px)';
      } else {
        crisisButton.style.transform = 'translateY(0)';
      }
    }
  }, [isOpen]);
  
  return null;
}

// ===== USAGE ANALYTICS HOOK =====

export function useKheperaChatAnalytics() {
  const { isOpen } = useKheperaChat();
  const [sessionData, setSessionData] = useState({
    openTime: null as Date | null,
    messageCount: 0,
    sessionDuration: 0
  });
  
  useEffect(() => {
    if (isOpen && !sessionData.openTime) {
      setSessionData(prev => ({
        ...prev,
        openTime: new Date()
      }));
    } else if (!isOpen && sessionData.openTime) {
      const duration = Date.now() - sessionData.openTime.getTime();
      
      // Log session data (replace with actual analytics)
      console.log('Khepera Chat Session:', {
        duration: duration / 1000,
        messageCount: sessionData.messageCount
      });
      
      setSessionData({
        openTime: null,
        messageCount: 0,
        sessionDuration: 0
      });
    }
  }, [isOpen, sessionData]);
  
  return sessionData;
}