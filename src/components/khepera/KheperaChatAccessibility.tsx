'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// ===== ACCESSIBILITY TYPES =====

interface AccessibilitySettings {
  screenReader: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  keyboardNavigation: boolean;
  voiceAnnouncements: boolean;
}

interface KheperaChatAccessibilityProps {
  children: React.ReactNode;
  isActive?: boolean;
  onAccessibilityChange?: (settings: AccessibilitySettings) => void;
}

// ===== ACCESSIBILITY CONTEXT =====

const AccessibilityContext = React.createContext<{
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void;
} | null>(null);

export function useKheperaChatAccessibility() {
  const context = React.useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useKheperaChatAccessibility must be used within KheperaChatAccessibility provider');
  }
  return context;
}

// ===== MAIN ACCESSIBILITY PROVIDER =====

export default function KheperaChatAccessibility({
  children,
  isActive = true,
  onAccessibilityChange
}: KheperaChatAccessibilityProps) {
  
  // ===== STATE MANAGEMENT =====
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    screenReader: false,
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    keyboardNavigation: false,
    voiceAnnouncements: true
  });
  
  const [announcementQueue, setAnnouncementQueue] = useState<string[]>([]);
  const politeAnnouncerRef = useRef<HTMLDivElement>(null);
  const assertiveAnnouncerRef = useRef<HTMLDivElement>(null);
  
  // ===== ACCESSIBILITY DETECTION =====
  
  useEffect(() => {
    if (!isActive) return;
    
    const detectAccessibilityPreferences = () => {
      const mediaQueries = {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
        highContrast: window.matchMedia('(prefers-contrast: high)')
      };
      
      // Screen reader detection
      const hasScreenReader = navigator.userAgent.includes('NVDA') || 
                            navigator.userAgent.includes('JAWS') ||
                            window.speechSynthesis?.getVoices().length > 0;
      
      // Keyboard navigation detection
      const hasKeyboardNav = !window.matchMedia('(pointer: coarse)').matches;
      
      const newSettings: AccessibilitySettings = {
        screenReader: hasScreenReader,
        reducedMotion: mediaQueries.reducedMotion.matches,
        highContrast: mediaQueries.highContrast.matches,
        fontSize: 'medium',
        keyboardNavigation: hasKeyboardNav,
        voiceAnnouncements: hasScreenReader
      };
      
      setSettings(newSettings);
      onAccessibilityChange?.(newSettings);
      
      // Listen for preference changes
      const handleMediaChange = () => {
        setSettings(prev => ({
          ...prev,
          reducedMotion: mediaQueries.reducedMotion.matches,
          highContrast: mediaQueries.highContrast.matches
        }));
      };
      
      mediaQueries.reducedMotion.addEventListener('change', handleMediaChange);
      mediaQueries.highContrast.addEventListener('change', handleMediaChange);
      
      return () => {
        mediaQueries.reducedMotion.removeEventListener('change', handleMediaChange);
        mediaQueries.highContrast.removeEventListener('change', handleMediaChange);
      };
    };
    
    const cleanup = detectAccessibilityPreferences();
    return cleanup;
  }, [isActive, onAccessibilityChange]);
  
  // ===== ANNOUNCEMENT SYSTEM =====
  
  const announceMessage = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.voiceAnnouncements) return;
    
    const announcer = priority === 'assertive' ? assertiveAnnouncerRef.current : politeAnnouncerRef.current;
    
    if (announcer) {
      // Clear previous announcement
      announcer.textContent = '';
      
      // Add new announcement after a brief delay to ensure screen reader picks it up
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
      
      // Clear announcement after it's been read
      setTimeout(() => {
        announcer.textContent = '';
      }, 5000);
    }
    
    // Visual announcement for users with hearing impairments
    if (settings.highContrast) {
      setAnnouncementQueue(prev => [...prev, message]);
      
      setTimeout(() => {
        setAnnouncementQueue(prev => prev.filter(msg => msg !== message));
      }, 3000);
    }
  }, [settings.voiceAnnouncements, settings.highContrast]);
  
  const updateSettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      onAccessibilityChange?.(newSettings);
      return newSettings;
    });
  }, [onAccessibilityChange]);
  
  // ===== KEYBOARD NAVIGATION SETUP =====
  
  useEffect(() => {
    if (!isActive || !settings.keyboardNavigation) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enhanced keyboard navigation for chat
      if (e.target instanceof HTMLElement) {
        const chatContainer = e.target.closest('.khepera-chat, .khepera-mobile-chat');
        if (!chatContainer) return;
        
        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowDown':
            // Navigate through messages
            e.preventDefault();
            navigateMessages(e.key === 'ArrowUp' ? 'up' : 'down');
            break;
            
          case 'Escape':
            // Close chat or clear current input
            const inputElement = chatContainer.querySelector('textarea') as HTMLTextAreaElement;
            if (inputElement?.value) {
              inputElement.value = '';
              inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
              const closeButton = chatContainer.querySelector('[aria-label*="Close"]') as HTMLButtonElement;
              closeButton?.click();
            }
            break;
            
          case 'Enter':
            // Send message (handled by chat component)
            break;
            
          case 'Tab':
            // Enhanced tab navigation with visual indicators
            enhanceTabNavigation(e);
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, settings.keyboardNavigation]);
  
  // ===== NAVIGATION HELPERS =====
  
  const navigateMessages = (direction: 'up' | 'down') => {
    const messages = document.querySelectorAll('.khepera-chat [role="log"] > div, .khepera-mobile-chat [role="log"] > div');
    if (messages.length === 0) return;
    
    const currentFocused = document.activeElement;
    let currentIndex = -1;
    
    messages.forEach((msg, index) => {
      if (msg.contains(currentFocused)) {
        currentIndex = index;
      }
    });
    
    let newIndex;
    if (direction === 'up') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : messages.length - 1;
    } else {
      newIndex = currentIndex < messages.length - 1 ? currentIndex + 1 : 0;
    }
    
    const targetMessage = messages[newIndex] as HTMLElement;
    targetMessage.focus();
    targetMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  const enhanceTabNavigation = (e: KeyboardEvent) => {
    // Add visual focus indicators for better accessibility
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.outline = settings.highContrast 
          ? '3px solid #000' 
          : '2px solid #a4b792';
        element.style.outlineOffset = '2px';
      }
    });
  };
  
  // ===== FONT SIZE MANAGEMENT =====
  
  useEffect(() => {
    if (!isActive) return;
    
    const chatElements = document.querySelectorAll('.khepera-chat, .khepera-mobile-chat');
    
    const fontSizeMap = {
      small: '0.875rem',
      medium: '1rem', 
      large: '1.125rem',
      'extra-large': '1.25rem'
    };
    
    chatElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.fontSize = fontSizeMap[settings.fontSize];
        
        // Adjust spacing proportionally
        const scaleFactor = settings.fontSize === 'extra-large' ? 1.2 : 
                          settings.fontSize === 'large' ? 1.1 : 1;
        
        element.style.setProperty('--chat-spacing-scale', scaleFactor.toString());
      }
    });
  }, [isActive, settings.fontSize]);
  
  // ===== HIGH CONTRAST MODE =====
  
  useEffect(() => {
    if (!isActive) return;
    
    const chatElements = document.querySelectorAll('.khepera-chat, .khepera-mobile-chat');
    
    chatElements.forEach(element => {
      if (element instanceof HTMLElement) {
        if (settings.highContrast) {
          element.classList.add('high-contrast-mode');
        } else {
          element.classList.remove('high-contrast-mode');
        }
      }
    });
  }, [isActive, settings.highContrast]);
  
  // ===== CONTEXT VALUE =====
  
  const contextValue = {
    settings,
    updateSettings,
    announceMessage
  };
  
  // ===== RENDER =====
  
  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* Screen Reader Announcements */}
      <div
        ref={politeAnnouncerRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
      
      <div
        ref={assertiveAnnouncerRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
      />
      
      {/* Visual Announcements for High Contrast Mode */}
      {settings.highContrast && announcementQueue.length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          {announcementQueue.map((announcement, index) => (
            <div
              key={index}
              className="bg-black text-white px-4 py-2 rounded-lg mb-2 text-sm font-medium"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                border: '2px solid white'
              }}
            >
              {announcement}
            </div>
          ))}
        </div>
      )}
      
      {children}
    </AccessibilityContext.Provider>
  );
}

// ===== ACCESSIBILITY ENHANCED COMPONENTS =====

export function AccessibleChatMessage({
  content,
  sender,
  timestamp,
  type,
  isLatest = false
}: {
  content: string;
  sender: 'user' | 'khepera';
  timestamp: Date;
  type?: string;
  isLatest?: boolean;
}) {
  const { announceMessage, settings } = useKheperaChatAccessibility();
  
  useEffect(() => {
    if (isLatest && sender === 'khepera') {
      announceMessage(`Khepera says: ${content}`, 'polite');
    }
  }, [isLatest, sender, content, announceMessage]);
  
  return (
    <div
      role="listitem"
      aria-label={`Message from ${sender === 'khepera' ? 'Khepera' : 'you'} at ${timestamp.toLocaleTimeString()}`}
      tabIndex={settings.keyboardNavigation ? 0 : -1}
      className="chat-message"
    >
      <div aria-hidden="true">{content}</div>
      
      {/* Hidden content for screen readers */}
      <span className="sr-only">
        {`${sender === 'khepera' ? 'Khepera' : 'You'} said: ${content}. 
         Sent at ${timestamp.toLocaleTimeString()}. 
         ${type ? `Message type: ${type}.` : ''}`}
      </span>
    </div>
  );
}

export function AccessibleChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type your message...",
  disabled = false,
  isGrounding = false
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  isGrounding?: boolean;
}) {
  const { settings, announceMessage } = useKheperaChatAccessibility();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };
  
  const handleSubmit = () => {
    if (value.trim()) {
      announceMessage('Message sent', 'polite');
      onSubmit();
    }
  };
  
  return (
    <div className="relative">
      <label htmlFor="khepera-chat-input" className="sr-only">
        {isGrounding ? 'Share your grounding observation' : 'Type your message to Khepera'}
      </label>
      
      <textarea
        ref={inputRef}
        id="khepera-chat-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby="chat-input-help"
        aria-invalid={false}
        className={`
          w-full resize-none rounded-2xl border border-sage-200 px-4 py-3
          focus:border-sage-400 focus:ring-2 focus:ring-sage-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${settings.highContrast ? 'border-black border-2' : ''}
        `}
        style={{
          fontSize: settings.fontSize === 'small' ? '14px' : 
                   settings.fontSize === 'large' ? '18px' :
                   settings.fontSize === 'extra-large' ? '20px' : '16px'
        }}
      />
      
      <div id="chat-input-help" className="sr-only">
        Press Enter to send your message, or Shift+Enter for a new line.
        {isGrounding && ' You are currently in a grounding exercise.'}
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        aria-label={`Send message${value.trim() ? `: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}` : ''}`}
        className={`
          absolute right-2 top-2 w-10 h-10 rounded-xl
          bg-sage-400 hover:bg-sage-500 disabled:bg-sage-200
          text-white flex items-center justify-center
          transition-all duration-200
          disabled:cursor-not-allowed
          ${settings.highContrast ? 'border-2 border-black' : ''}
        `}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  );
}

// ===== ACCESSIBILITY STYLES =====

const accessibilityStyles = `
  /* High Contrast Mode Styles */
  .high-contrast-mode {
    --sage-400: #000000;
    --sage-500: #000000;
    --sage-200: #666666;
    --sage-100: #999999;
    --sanctuary-white: #ffffff;
    --sanctuary-gray-800: #000000;
    --sanctuary-gray-700: #222222;
    --sanctuary-gray-600: #444444;
  }
  
  .high-contrast-mode .chat-message {
    border: 2px solid #000000;
    background: #ffffff;
    color: #000000;
  }
  
  .high-contrast-mode button {
    border: 2px solid #000000 !important;
    background: #000000 !important;
    color: #ffffff !important;
  }
  
  .high-contrast-mode button:disabled {
    background: #666666 !important;
    border-color: #666666 !important;
  }
  
  /* Screen Reader Only Content */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* Focus Indicators */
  .khepera-chat *:focus-visible,
  .khepera-mobile-chat *:focus-visible {
    outline: 2px solid #a4b792;
    outline-offset: 2px;
    border-radius: 4px;
  }
  
  .high-contrast-mode *:focus-visible {
    outline: 3px solid #000000;
    outline-offset: 3px;
  }
  
  /* Reduced Motion Overrides */
  @media (prefers-reduced-motion: reduce) {
    .khepera-chat *,
    .khepera-mobile-chat * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* Font Size Scaling */
  .khepera-chat,
  .khepera-mobile-chat {
    --spacing: calc(1rem * var(--chat-spacing-scale, 1));
  }
  
  .khepera-chat .chat-message,
  .khepera-mobile-chat .chat-message {
    margin-bottom: var(--spacing);
    padding: var(--spacing);
  }
`;

// Inject accessibility styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = accessibilityStyles;
  document.head.appendChild(styleElement);
}