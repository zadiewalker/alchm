'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Distraction-free writing environment with gentle encouragement and safety features

interface WritingSession {
  id: string;
  startTime: Date;
  prompt?: string;
  content: string;
  wordCount: number;
  timeSpent: number; // in seconds
  mood?: string;
  intentions?: string[];
}

interface EncouragementMessage {
  id: string;
  message: string;
  trigger: 'start' | 'pause' | 'wordCount' | 'timeSpent' | 'struggle';
  timing?: number; // seconds or word count threshold
  type: 'gentle' | 'celebration' | 'grounding';
}

const ENCOURAGEMENT_MESSAGES: EncouragementMessage[] = [
  // Starting encouragement
  {
    id: 'gentle-start',
    message: "Take a breath. This is your sacred space. Write whatever comes to mind.",
    trigger: 'start',
    type: 'gentle'
  },
  {
    id: 'permission-start',
    message: "There are no wrong words here. Your thoughts matter exactly as they are.",
    trigger: 'start',
    type: 'gentle'
  },

  // Word count celebrations
  {
    id: 'first-words',
    message: "Beautiful start! You're creating something meaningful.",
    trigger: 'wordCount',
    timing: 25,
    type: 'celebration'
  },
  {
    id: 'flowing',
    message: "You're in the flow. Let your thoughts move freely.",
    trigger: 'wordCount', 
    timing: 100,
    type: 'celebration'
  },
  {
    id: 'milestone',
    message: "Look at you go! Your voice is strong and clear.",
    trigger: 'wordCount',
    timing: 250,
    type: 'celebration'
  },

  // Time-based encouragement
  {
    id: 'five-minutes',
    message: "Five minutes of presence with yourself. That's beautiful.",
    trigger: 'timeSpent',
    timing: 300, // 5 minutes
    type: 'celebration'
  },

  // Struggle support
  {
    id: 'stuck-gentle',
    message: "It's okay if words feel hard right now. Even sitting here is brave.",
    trigger: 'struggle',
    type: 'grounding'
  },
  {
    id: 'permission-pause',
    message: "You can pause anytime. This space will hold whatever you need.",
    trigger: 'struggle',
    type: 'grounding'
  }
];

export function SupportiveWritingEnvironment({
  initialContent = '',
  prompt,
  onSave,
  onExit,
  className = ''
}: {
  initialContent?: string;
  prompt?: string;
  onSave: (session: WritingSession) => void;
  onExit: () => void;
  className?: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [session, setSession] = useState<WritingSession>({
    id: crypto.randomUUID(),
    startTime: new Date(),
    content: initialContent,
    wordCount: 0,
    timeSpent: 0,
    prompt
  });
  
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [currentEncouragement, setCurrentEncouragement] = useState<EncouragementMessage | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWordCount, setShowWordCount] = useState(true);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const [hasBeenEncouraged, setHasBeenEncouraged] = useState<Set<string>>(new Set());
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastWordCountRef = useRef(0);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Session timer
  useEffect(() => {
    const startTime = session.startTime.getTime();
    
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const timeSpent = Math.floor((now - startTime) / 1000);
      
      setSession(prev => ({ ...prev, timeSpent }));
      
      // Check for time-based encouragement
      checkEncouragement('timeSpent', timeSpent);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.startTime]);

  // Content tracking
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = content.trim() === '' ? 0 : words.length;
    
    setSession(prev => ({ 
      ...prev, 
      content, 
      wordCount 
    }));

    // Check for word count encouragement
    if (wordCount > lastWordCountRef.current) {
      checkEncouragement('wordCount', wordCount);
      lastWordCountRef.current = wordCount;
    }

    // Update activity tracking
    setLastActiveTime(Date.now());
  }, [content]);

  // Initial encouragement
  useEffect(() => {
    setTimeout(() => {
      const startMessages = ENCOURAGEMENT_MESSAGES.filter(m => m.trigger === 'start');
      const randomMessage = startMessages[Math.floor(Math.random() * startMessages.length)];
      showEncouragementMessage(randomMessage);
    }, 2000);
  }, []);

  // Inactivity detection
  useEffect(() => {
    const inactivityCheck = setInterval(() => {
      const timeSinceActive = Date.now() - lastActiveTime;
      
      if (timeSinceActive > 60000 && content.length > 0) { // 1 minute of inactivity
        const struggleMessages = ENCOURAGEMENT_MESSAGES.filter(m => m.trigger === 'struggle');
        const randomMessage = struggleMessages[Math.floor(Math.random() * struggleMessages.length)];
        
        if (!hasBeenEncouraged.has(randomMessage.id)) {
          showEncouragementMessage(randomMessage);
        }
      }
    }, 30000);

    return () => clearInterval(inactivityCheck);
  }, [lastActiveTime, content.length, hasBeenEncouraged]);

  const checkEncouragement = (trigger: 'wordCount' | 'timeSpent', value: number) => {
    const eligibleMessages = ENCOURAGEMENT_MESSAGES.filter(m => 
      m.trigger === trigger && 
      m.timing === value && 
      !hasBeenEncouraged.has(m.id)
    );

    if (eligibleMessages.length > 0) {
      const message = eligibleMessages[Math.floor(Math.random() * eligibleMessages.length)];
      showEncouragementMessage(message);
    }
  };

  const showEncouragementMessage = (message: EncouragementMessage) => {
    setCurrentEncouragement(message);
    setShowEncouragement(true);
    setHasBeenEncouraged(prev => new Set(prev).add(message.id));
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setShowEncouragement(false);
    }, 4000);
  };

  const handleSave = () => {
    onSave(session);
  };

  const handleExit = () => {
    if (content.trim().length > 0) {
      // Auto-save before exit
      handleSave();
    }
    onExit();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const containerClass = isFullscreen 
    ? 'fixed inset-0 z-50 bg-sanctuary-white' 
    : 'min-h-[60vh]';

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-sanctuary-gray-100 ${
        isFullscreen ? 'bg-sanctuary-white' : ''
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExit}
            className="w-10 h-10 rounded-full hover:bg-sage-50 transition-colors flex items-center justify-center"
            title="Save and exit"
          >
            ←
          </button>
          
          {prompt && (
            <div className="max-w-md">
              <p className="text-sm text-sanctuary-gray-600 italic">
                "{prompt}"
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Writing Stats */}
          {showWordCount && (
            <div className="flex items-center gap-4 text-sm text-sanctuary-gray-500">
              <span>{session.wordCount} words</span>
              <span>{formatTime(session.timeSpent)}</span>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWordCount(!showWordCount)}
              className="p-2 rounded-lg hover:bg-sage-50 transition-colors"
              title={showWordCount ? 'Hide stats' : 'Show stats'}
            >
              📊
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-sage-50 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? '🔳' : '⛶'}
            </button>
          </div>
        </div>
      </div>

      {/* Writing Area */}
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={prompt 
            ? "Let your thoughts flow..." 
            : "What's on your mind today?"
          }
          className={`w-full p-6 border-none resize-none focus:outline-none sanctuary-input
                     placeholder-sanctuary-gray-400 leading-relaxed ${
            isFullscreen 
              ? 'min-h-[calc(100vh-120px)] text-lg' 
              : 'min-h-[50vh] text-base'
          }`}
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.7'
          }}
          autoFocus
        />
        
        {/* Gentle Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 60 60\"><circle cx=\"30\" cy=\"30\" r=\"2\" fill=\"%23a4b792\"/></svg>')] bg-repeat" />
      </div>

      {/* Encouragement Toast */}
      <AnimatePresence>
        {showEncouragement && currentEncouragement && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed bottom-6 right-6 max-w-sm bg-sage-50 border border-sage-200 rounded-xl p-4 shadow-nurturing z-40"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0">
                {currentEncouragement.type === 'celebration' && '🎉'}
                {currentEncouragement.type === 'gentle' && '🌸'}
                {currentEncouragement.type === 'grounding' && '🌿'}
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-sage-700 leading-relaxed">
                  {currentEncouragement.message}
                </p>
              </div>
              
              <button
                onClick={() => setShowEncouragement(false)}
                className="text-sage-400 hover:text-sage-600 transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crisis Support Access */}
      <button
        onClick={() => window.open('/crisis-resources', '_blank')}
        className="fixed bottom-6 left-6 w-12 h-12 bg-warm-amber text-white rounded-full shadow-nurturing hover:scale-105 transition-transform z-40 flex items-center justify-center"
        title="Need immediate support? Click here."
      >
        🆘
      </button>

      {/* Auto-save indicator */}
      <div className="fixed bottom-20 right-6 text-xs text-sanctuary-gray-400 z-40">
        Auto-saving...
      </div>

      {/* Gentle reminder for breaks */}
      <BreakReminder 
        timeSpent={session.timeSpent}
        onBreakTaken={() => setLastActiveTime(Date.now())}
      />
    </div>
  );
}

function BreakReminder({ 
  timeSpent, 
  onBreakTaken 
}: { 
  timeSpent: number;
  onBreakTaken: () => void;
}) {
  const [showReminder, setShowReminder] = useState(false);
  const [hasRemindedAt15, setHasRemindedAt15] = useState(false);
  const [hasRemindedAt30, setHasRemindedAt30] = useState(false);

  useEffect(() => {
    // Remind at 15 minutes
    if (timeSpent >= 900 && !hasRemindedAt15) { // 15 minutes
      setShowReminder(true);
      setHasRemindedAt15(true);
    }
    
    // Remind at 30 minutes  
    if (timeSpent >= 1800 && !hasRemindedAt30) { // 30 minutes
      setShowReminder(true);
      setHasRemindedAt30(true);
    }
  }, [timeSpent, hasRemindedAt15, hasRemindedAt30]);

  if (!showReminder) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sage-50 border border-sage-200 rounded-xl p-6 shadow-nurturing max-w-sm text-center z-50"
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sage-200 flex items-center justify-center">
        <span className="text-xl">💆‍♀️</span>
      </div>
      
      <h3 className="font-medium text-sanctuary-gray-800 mb-2">
        Gentle Reminder
      </h3>
      
      <p className="text-sm text-sanctuary-gray-600 mb-4">
        You've been writing for a while. Consider taking a short break to stretch, 
        breathe, or hydrate. Your wellbeing matters.
      </p>
      
      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowReminder(false);
            onBreakTaken();
          }}
          className="flex-1 safe-button text-sm"
        >
          Taking a break
        </button>
        <button
          onClick={() => setShowReminder(false)}
          className="flex-1 sage-primary safe-button text-sm"
        >
          Keep writing
        </button>
      </div>
    </motion.div>
  );
}

export function WritingModeSelector({
  onModeSelect,
  className = ''
}: {
  onModeSelect: (mode: 'guided' | 'freeform' | 'voice' | 'creative') => void;
  className?: string;
}) {
  const modes = [
    {
      id: 'guided',
      title: 'Guided',
      description: 'Follow gentle prompts and questions',
      icon: '🗺️',
      color: 'sage'
    },
    {
      id: 'freeform',
      title: 'Freeform',
      description: 'Write whatever comes to mind',
      icon: '✍️',
      color: 'calm'
    },
    {
      id: 'voice',
      title: 'Voice',
      description: 'Speak your thoughts and feelings',
      icon: '🎤',
      color: 'warm'
    },
    {
      id: 'creative',
      title: 'Creative',
      description: 'Express through poetry, art, or movement',
      icon: '🎨',
      color: 'gentle'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeSelect(mode.id as any)}
          className="sanctuary-card text-left hover:shadow-soft transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center
                          ${mode.color === 'sage' ? 'bg-sage-100' :
                            mode.color === 'calm' ? 'bg-calm-blue/10' :
                            mode.color === 'warm' ? 'bg-warm-amber/10' :
                            'bg-gentle-rose/10'}`}>
              <span className="text-xl">{mode.icon}</span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-sanctuary-gray-800 mb-1">
                {mode.title}
              </h3>
              <p className="text-sm text-sanctuary-gray-600">
                {mode.description}
              </p>
            </div>
            
            <div className="text-sanctuary-gray-300 group-hover:text-sage-400 transition-colors">
              →
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}