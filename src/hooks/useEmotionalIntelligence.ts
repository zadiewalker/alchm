'use client';

/**
 * Sacred Emotional Intelligence Hook
 * Manages emotional awareness and support throughout the writing journey
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  detectEmotionalContext, 
  analyzeWritingPatterns,
  generateEncouragement,
  getSaveConfirmation,
  prepareKheperaContext,
  crisisCare,
  postWritingCare,
  EmotionalContext,
  WritingPatterns
} from '@/lib/emotional-intelligence';

interface SessionMemory {
  startTime: number;
  lastActivity: number;
  totalPauses: number;
  longestPause: number;
  editCount: number;
  encouragementShown: string[];
  emotionalJourney: EmotionalContext[];
}

interface EmotionalIntelligenceState {
  currentContext: EmotionalContext;
  writingPatterns: WritingPatterns;
  encouragementMessage: string | null;
  showCrisisSupport: boolean;
  sessionMemory: SessionMemory;
  saveMessage: string;
  showPostWritingCare: boolean;
  postWritingState: 'reflection' | 'nextSteps' | 'complete' | null;
}

export function useEmotionalIntelligence(pathway?: string) {
  const [state, setState] = useState<EmotionalIntelligenceState>({
    currentContext: { primary: 'neutral', intensity: 'gentle', needsSupport: false, isCrisis: false },
    writingPatterns: {
      rapidWriting: false,
      longPauses: false,
      heavyEditing: false,
      briefEntry: false,
      wordCount: 0,
      timeSpent: 0,
      pauseDuration: 0,
      editCount: 0
    },
    encouragementMessage: null,
    showCrisisSupport: false,
    sessionMemory: {
      startTime: Date.now(),
      lastActivity: Date.now(),
      totalPauses: 0,
      longestPause: 0,
      editCount: 0,
      encouragementShown: [],
      emotionalJourney: []
    },
    saveMessage: "Your words are held safely",
    showPostWritingCare: false,
    postWritingState: null
  });

  const previousContent = useRef<string>('');
  const pauseStartTime = useRef<number>(0);
  const encouragementTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Analyze content and update emotional context
  const analyzeContent = useCallback((content: string) => {
    const now = Date.now();
    
    // Detect if content changed (user is typing vs pausing)
    const isTyping = content !== previousContent.current;
    
    if (isTyping) {
      // User started typing after a pause
      if (pauseStartTime.current > 0) {
        const pauseDuration = now - pauseStartTime.current;
        setState(prev => ({
          ...prev,
          sessionMemory: {
            ...prev.sessionMemory,
            totalPauses: prev.sessionMemory.totalPauses + 1,
            longestPause: Math.max(prev.sessionMemory.longestPause, pauseDuration),
            lastActivity: now
          }
        }));
        pauseStartTime.current = 0;
      }
      
      // Count edits (approximation based on content changes)
      const editCount = Math.abs(content.length - previousContent.current.length);
      
      // Analyze emotional context and writing patterns
      const emotionalContext = detectEmotionalContext(content, pathway);
      const timeSpent = now - state.sessionMemory.startTime;
      const currentPause = pauseStartTime.current > 0 ? now - pauseStartTime.current : 0;
      
      const writingPatterns = analyzeWritingPatterns(
        content,
        timeSpent,
        state.sessionMemory.editCount + editCount,
        currentPause
      );

      setState(prev => ({
        ...prev,
        currentContext: emotionalContext,
        writingPatterns,
        sessionMemory: {
          ...prev.sessionMemory,
          editCount: prev.sessionMemory.editCount + editCount,
          emotionalJourney: [...prev.sessionMemory.emotionalJourney.slice(-4), emotionalContext] // Keep last 5
        },
        showCrisisSupport: emotionalContext.isCrisis
      }));

      // Generate encouragement if appropriate  
      const encouragement = generateEncouragement(emotionalContext, writingPatterns, pathway);
      if (encouragement && !state.sessionMemory.encouragementShown.includes(encouragement)) {
        // Clear any existing timeout
        if (encouragementTimeoutRef.current) {
          clearTimeout(encouragementTimeoutRef.current);
        }
        
        // Show encouragement after a brief delay
        encouragementTimeoutRef.current = setTimeout(() => {
          setState(current => ({
            ...current,
            encouragementMessage: encouragement,
            sessionMemory: {
              ...current.sessionMemory,
              encouragementShown: [...current.sessionMemory.encouragementShown, encouragement]
            }
          }));
          
          // Auto-hide after 4 seconds
          setTimeout(() => {
            setState(current => ({
              ...current,
              encouragementMessage: null
            }));
          }, 4000);
        }, 1500);
      }
      
    } else {
      // User stopped typing - start pause timer
      if (pauseStartTime.current === 0 && content.length > 0) {
        pauseStartTime.current = now;
      }
    }

    previousContent.current = content;
  }, [pathway, state.sessionMemory.startTime, state.sessionMemory.editCount]);

  // Handle save with emotional intelligence
  const handleSave = useCallback(() => {
    const saveMessage = getSaveConfirmation();
    setState(prev => ({
      ...prev,
      saveMessage,
      showPostWritingCare: true,
      postWritingState: 'reflection'
    }));
    
    // Auto-hide save message after 3 seconds
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        saveMessage: "Your words are held safely"
      }));
    }, 3000);
  }, []);

  // Handle post-writing care responses
  const handleReflectionResponse = useCallback((response: string) => {
    setState(prev => ({
      ...prev,
      postWritingState: 'nextSteps'
    }));
  }, []);

  const handleNextStepResponse = useCallback((response: string) => {
    if (response === "Get a reflection from Khepera") {
      // Trigger Khepera response
      const kheperaContext = prepareKheperaContext(state.currentContext, pathway);
      // This would trigger the AI response system
      console.log('Khepera context:', kheperaContext);
    }
    
    setState(prev => ({
      ...prev,
      postWritingState: 'complete',
      showPostWritingCare: false
    }));
  }, [state.currentContext, pathway]);

  // Get crisis support resources
  const getCrisisResources = useCallback(() => {
    return crisisCare.resources;
  }, []);

  // Get post-writing care options
  const getPostWritingCare = useCallback(() => {
    return postWritingCare;
  }, []);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (encouragementTimeoutRef.current) {
        clearTimeout(encouragementTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    emotionalContext: state.currentContext,
    writingPatterns: state.writingPatterns,
    encouragementMessage: state.encouragementMessage,
    showCrisisSupport: state.showCrisisSupport,
    saveMessage: state.saveMessage,
    showPostWritingCare: state.showPostWritingCare,
    postWritingState: state.postWritingState,
    sessionStats: {
      timeSpent: Date.now() - state.sessionMemory.startTime,
      wordCount: state.writingPatterns.wordCount,
      emotionalJourney: state.sessionMemory.emotionalJourney
    },
    
    // Actions
    analyzeContent,
    handleSave,
    handleReflectionResponse,
    handleNextStepResponse,
    getCrisisResources,
    getPostWritingCare,
    
    // Helpers
    getDynamicStyles: () => ({
      // Adjust UI based on emotional context and writing patterns
      container: {
        background: state.currentContext.isCrisis ? 
          'linear-gradient(135deg, rgba(139, 115, 85, 0.15) 0%, rgba(139, 115, 85, 0.08) 100%)' :
          state.currentContext.needsSupport ?
          'linear-gradient(135deg, rgba(139, 115, 85, 0.12) 0%, rgba(139, 115, 85, 0.05) 100%)' :
          'linear-gradient(135deg, rgba(139, 115, 85, 0.1) 0%, rgba(139, 115, 85, 0.03) 100%)'
      },
      textarea: {
        animation: state.writingPatterns.longPauses ? 'gentle-breathing 4s ease-in-out infinite' : 'none',
        borderColor: state.currentContext.isCrisis ? 'rgba(139, 115, 85, 0.3)' : 
                    state.currentContext.needsSupport ? 'rgba(139, 115, 85, 0.25)' : 
                    'rgba(255, 255, 255, 0.2)'
      },
      saveButton: {
        animation: state.currentContext.needsSupport ? 'warm-pulse 2s ease-in-out infinite' : 'none'
      }
    }),
    
    // Get contextual placeholder text
    getPlaceholderText: () => {
      if (state.currentContext.isCrisis) {
        return "You're safe here. Let the words come as they need to...";
      }
      if (state.currentContext.primary === 'vulnerability') {
        return "Your tender thoughts are welcome here...";
      }
      if (state.currentContext.primary === 'strength') {
        return "Let your strength shine through these words...";
      }
      if (state.writingPatterns.briefEntry && state.sessionMemory.totalPauses > 3) {
        return "Even a few words can hold everything...";
      }
      return "What's present for you right now?";
    }
  };
}