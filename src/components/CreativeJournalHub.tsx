'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

// Import all creative modalities
import VoiceJournal from './VoiceJournal';
import ArtCanvas from './ArtCanvas';
import PoetryLab from './PoetryLab';
import MusicTherapy from './MusicTherapy';
import MovementTherapy from './MovementTherapy';
import CreativeCommunity from './CreativeCommunity';

// Creative session types
interface CreativeSession {
  id: string;
  type: 'text' | 'voice' | 'art' | 'poetry' | 'music' | 'movement' | 'multimodal';
  content: CreativeContent;
  mood?: MoodType;
  timestamp: Date;
  duration?: number;
  insights?: string[];
  therapeuticTags?: string[];
}

interface CreativeContent {
  text?: string;
  voiceTranscript?: string;
  artworkData?: string;
  poemText?: string;
  musicSessionData?: any;
  movementData?: any;
  multimodalElements?: CreativeElement[];
}

interface CreativeElement {
  type: 'text' | 'voice' | 'art' | 'poetry' | 'music' | 'movement';
  content: any;
  timestamp: number;
  coordinates?: { x: number; y: number };
}

interface CreativeJournalHubProps {
  onSessionSave?: (session: CreativeSession) => void;
  initialMode?: 'text' | 'creative';
  className?: string;
}

type CreativeMode = 'text' | 'voice' | 'art' | 'poetry' | 'music' | 'movement' | 'multimodal' | 'community';

const CreativeJournalHub: React.FC<CreativeJournalHubProps> = ({
  onSessionSave,
  initialMode = 'text',
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState<CreativeMode>(initialMode === 'creative' ? 'multimodal' : 'text');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [session, setSession] = useState<CreativeSession>({
    id: Date.now().toString(),
    type: 'text',
    content: {},
    timestamp: new Date()
  });
  const [multimodalElements, setMultimodalElements] = useState<CreativeElement[]>([]);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const multimodalCanvasRef = useRef<HTMLDivElement>(null);
  const sessionStartTime = useRef<Date>(new Date());

  const { currentMood, getMoodData } = useMoodContext();

  // Creative mode configurations
  const creativeModes = useMemo(() => ({
    text: {
      name: 'Text Journal',
      icon: '✍️',
      description: 'Traditional written journaling',
      color: 'from-gray-100 to-slate-100'
    },
    voice: {
      name: 'Voice Journal',
      icon: '🎤',
      description: 'Express through voice and tone',
      color: 'from-blue-100 to-sky-100'
    },
    art: {
      name: 'Art Canvas',
      icon: '🎨',
      description: 'Visual expression and color therapy',
      color: 'from-purple-100 to-violet-100'
    },
    poetry: {
      name: 'Poetry Lab',
      icon: '📝',
      description: 'Transform feelings into verses',
      color: 'from-pink-100 to-rose-100'
    },
    music: {
      name: 'Music Therapy',
      icon: '🎵',
      description: 'Healing through sound and rhythm',
      color: 'from-green-100 to-emerald-100'
    },
    movement: {
      name: 'Movement Flow',
      icon: '💃',
      description: 'Somatic healing through the body',
      color: 'from-orange-100 to-amber-100'
    },
    multimodal: {
      name: 'Creative Canvas',
      icon: '✨',
      description: 'Blend all modalities together',
      color: 'from-sage-100 to-green-100'
    },
    community: {
      name: 'Community',
      icon: '🤝',
      description: 'Share and connect with others',
      color: 'from-yellow-100 to-lime-100'
    }
  }), []);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      const savedSessions = JSON.parse(localStorage.getItem('alchm_creative_sessions') || '[]');
      const updatedSession = {
        ...session,
        content: {
          ...session.content,
          multimodalElements: activeMode === 'multimodal' ? multimodalElements : undefined
        },
        mood: currentMood,
        duration: Math.floor((Date.now() - sessionStartTime.current.getTime()) / 1000)
      };
      
      // Update existing session or add new one
      const existingIndex = savedSessions.findIndex((s: CreativeSession) => s.id === session.id);
      if (existingIndex >= 0) {
        savedSessions[existingIndex] = updatedSession;
      } else {
        savedSessions.push(updatedSession);
      }
      
      localStorage.setItem('alchm_creative_sessions', JSON.stringify(savedSessions));
      setSession(updatedSession);
      setLastSaved(new Date());
      
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [session, multimodalElements, currentMood, activeMode]);

  // Handle text content changes
  const handleTextChange = useCallback((text: string) => {
    setSession(prev => ({
      ...prev,
      content: { ...prev.content, text },
      type: 'text'
    }));
  }, []);

  // Handle creative content completion
  const handleVoiceComplete = useCallback((voiceEntry: any) => {
    setSession(prev => ({
      ...prev,
      content: { ...prev.content, voiceTranscript: voiceEntry.transcript },
      type: 'voice',
      insights: [...(prev.insights || []), ...voiceEntry.emotionalTone ? ['Voice analysis revealed emotional patterns'] : []]
    }));
    
    if (activeMode === 'multimodal') {
      setMultimodalElements(prev => [...prev, {
        type: 'voice',
        content: voiceEntry,
        timestamp: Date.now(),
        coordinates: { x: Math.random() * 300, y: Math.random() * 200 }
      }]);
    }
  }, [activeMode]);

  const handleArtComplete = useCallback((artwork: any) => {
    setSession(prev => ({
      ...prev,
      content: { ...prev.content, artworkData: artwork.imageData },
      type: 'art',
      therapeuticTags: [...(prev.therapeuticTags || []), ...(artwork.therapeuticInsights || [])]
    }));
    
    if (activeMode === 'multimodal') {
      setMultimodalElements(prev => [...prev, {
        type: 'art',
        content: artwork,
        timestamp: Date.now(),
        coordinates: { x: Math.random() * 300, y: Math.random() * 200 }
      }]);
    }
  }, [activeMode]);

  const handlePoetryComplete = useCallback((poem: any) => {
    setSession(prev => ({
      ...prev,
      content: { ...prev.content, poemText: poem.text },
      type: 'poetry',
      insights: [...(prev.insights || []), ...poem.analysis?.therapeuticInsights || []]
    }));
    
    if (activeMode === 'multimodal') {
      setMultimodalElements(prev => [...prev, {
        type: 'poetry',
        content: poem,
        timestamp: Date.now(),
        coordinates: { x: Math.random() * 300, y: Math.random() * 200 }
      }]);
    }
  }, [activeMode]);

  const handleMusicComplete = useCallback((musicSession: any) => {
    setSession(prev => ({
      ...prev,
      content: { ...prev.content, musicSessionData: musicSession },
      type: 'music',
      insights: [...(prev.insights || []), ...musicSession.insights || []]
    }));
    
    if (activeMode === 'multimodal') {
      setMultimodalElements(prev => [...prev, {
        type: 'music',
        content: musicSession,
        timestamp: Date.now(),
        coordinates: { x: Math.random() * 300, y: Math.random() * 200 }
      }]);
    }
  }, [activeMode]);

  const handleMovementComplete = useCallback((movementSession: any) => {
    setSession(prev => ({
      ...prev,
      content: { ...prev.content, movementData: movementSession },
      type: 'movement',
      insights: [...(prev.insights || []), ...movementSession.insights || []]
    }));
    
    if (activeMode === 'multimodal') {
      setMultimodalElements(prev => [...prev, {
        type: 'movement',
        content: movementSession,
        timestamp: Date.now(),
        coordinates: { x: Math.random() * 300, y: Math.random() * 200 }
      }]);
    }
  }, [activeMode]);

  // Save complete session
  const saveSession = useCallback(async () => {
    await autoSave();
    onSessionSave?.(session);
    
    // Reset for new session
    const newSession: CreativeSession = {
      id: Date.now().toString(),
      type: 'text',
      content: {},
      timestamp: new Date()
    };
    setSession(newSession);
    setMultimodalElements([]);
    sessionStartTime.current = new Date();
    
    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [autoSave, session, onSessionSave]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, [isFullscreen]);

  // Auto-save timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (session.content.text || multimodalElements.length > 0) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [session.content.text, multimodalElements.length, autoSave]);

  // Get session summary for display
  const sessionSummary = useMemo(() => {
    const elements = [];
    if (session.content.text) elements.push('text');
    if (session.content.voiceTranscript) elements.push('voice');
    if (session.content.artworkData) elements.push('art');
    if (session.content.poemText) elements.push('poetry');
    if (session.content.musicSessionData) elements.push('music');
    if (session.content.movementData) elements.push('movement');
    if (multimodalElements.length > 0) elements.push('multimodal');
    
    return elements;
  }, [session.content, multimodalElements]);

  return (
    <div className={`creative-journal-hub ${isFullscreen ? 'fullscreen' : ''} ${className}`}>
      
      {/* Header - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="journal-header mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Creative Journal</h2>
              <p className="text-sm text-gray-600">
                Express yourself through multiple creative modalities
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Session Status */}
              <div className="session-status flex items-center gap-2 px-3 py-1 bg-sage-100 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-400 animate-pulse' : lastSaved ? 'bg-green-400' : 'bg-gray-300'}`} />
                <span className="text-xs text-gray-600">
                  {isSaving ? 'Saving...' : lastSaved ? 'Saved' : 'Draft'}
                </span>
              </div>
              
              {/* Mode Selector Toggle */}
              <button
                onClick={() => setShowModeSelector(!showModeSelector)}
                className="px-4 py-2 bg-white border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors text-sm"
              >
                <span className="mr-2">{creativeModes[activeMode].icon}</span>
                {creativeModes[activeMode].name}
              </button>
            </div>
          </div>

          {/* Mode Selector Dropdown */}
          {showModeSelector && (
            <div className="mode-selector-dropdown absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-20 w-80">
              <h3 className="font-semibold text-gray-800 mb-4">Choose Your Expression Mode</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(creativeModes).map(([key, mode]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveMode(key as CreativeMode);
                      setShowModeSelector(false);
                    }}
                    className={`mode-option p-3 rounded-xl text-left transition-all duration-200 ${
                      activeMode === key
                        ? 'bg-sage-100 border-2 border-sage-400'
                        : 'bg-gradient-to-br ' + mode.color + ' border-2 border-transparent hover:border-sage-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mode.icon}</div>
                    <div className="font-semibold text-gray-800 text-sm">{mode.name}</div>
                    <div className="text-xs text-gray-600 leading-tight">{mode.description}</div>
                  </button>
                ))}
              </div>
              
              {/* Quick Tips */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-800">
                  <strong>Tip:</strong> Try "Creative Canvas" to blend multiple modalities in one session!
                </div>
              </div>
            </div>
          )}

          {/* Session Summary */}
          {sessionSummary.length > 0 && (
            <div className="session-summary flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">This session includes:</span>
              {sessionSummary.map(element => (
                <span 
                  key={element}
                  className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs"
                >
                  {creativeModes[element as CreativeMode]?.icon} {element}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Creative Interface */}
      <div className={`creative-interface ${isFullscreen ? 'fullscreen-interface' : 'contained-interface'}`}>
        
        {/* Text Mode */}
        {activeMode === 'text' && (
          <div className="text-mode">
            <div className="text-editor bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <textarea
                ref={textareaRef}
                value={session.content.text || ''}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={currentMood 
                  ? `How does it feel to be ${currentMood} right now? Let your thoughts flow...`
                  : "What's on your heart today? Write as much or as little as you need..."
                }
                className="w-full min-h-[400px] p-4 border-2 border-sage-200 rounded-2xl resize-none focus:ring-2 focus:ring-sage-300 focus:border-transparent text-lg leading-relaxed"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  background: 'transparent'
                }}
              />
            </div>
          </div>
        )}

        {/* Voice Mode */}
        {activeMode === 'voice' && (
          <VoiceJournal onEntryComplete={handleVoiceComplete} />
        )}

        {/* Art Mode */}
        {activeMode === 'art' && (
          <ArtCanvas onArtworkComplete={handleArtComplete} />
        )}

        {/* Poetry Mode */}
        {activeMode === 'poetry' && (
          <PoetryLab onPoemComplete={handlePoetryComplete} />
        )}

        {/* Music Mode */}
        {activeMode === 'music' && (
          <MusicTherapy onSessionComplete={handleMusicComplete} />
        )}

        {/* Movement Mode */}
        {activeMode === 'movement' && (
          <MovementTherapy onSessionComplete={handleMovementComplete} />
        )}

        {/* Multimodal Creative Canvas */}
        {activeMode === 'multimodal' && (
          <div className="multimodal-canvas">
            <div className="canvas-header mb-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Creative Canvas
              </h3>
              <p className="text-sm text-gray-600">
                Blend text, voice, art, poetry, music, and movement in one flowing expression
              </p>
            </div>

            {/* Multimodal Toolbar */}
            <div className="multimodal-toolbar mb-6 flex items-center justify-center gap-3 p-3 bg-sage-50 rounded-2xl">
              {Object.entries(creativeModes).filter(([key]) => key !== 'multimodal' && key !== 'community').map(([key, mode]) => (
                <button
                  key={key}
                  className="toolbar-btn px-4 py-2 bg-white rounded-lg hover:bg-sage-100 transition-colors text-sm"
                  title={`Add ${mode.name}`}
                >
                  <span className="mr-2">{mode.icon}</span>
                  {mode.name}
                </button>
              ))}
            </div>

            {/* Multimodal Elements Display */}
            <div 
              ref={multimodalCanvasRef}
              className="multimodal-workspace bg-white rounded-3xl p-6 min-h-[500px] shadow-sm border border-gray-100 relative overflow-hidden"
            >
              {multimodalElements.length === 0 ? (
                <div className="empty-canvas flex flex-col items-center justify-center h-96 text-center">
                  <div className="text-6xl mb-4 opacity-30">✨</div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    Your Creative Canvas Awaits
                  </h4>
                  <p className="text-gray-500 max-w-md">
                    Add different creative elements to build a rich, multi-dimensional expression of your inner world
                  </p>
                </div>
              ) : (
                <div className="multimodal-elements">
                  {multimodalElements.map((element, index) => (
                    <div
                      key={index}
                      className="multimodal-element absolute bg-white rounded-lg p-3 shadow-md border border-gray-200"
                      style={{
                        left: `${element.coordinates?.x || 0}px`,
                        top: `${element.coordinates?.y || 0}px`,
                        zIndex: index + 1
                      }}
                    >
                      <div className="element-header flex items-center gap-2 mb-2">
                        <span>{creativeModes[element.type].icon}</span>
                        <span className="text-xs font-medium text-gray-600">
                          {creativeModes[element.type].name}
                        </span>
                      </div>
                      
                      {/* Element Content Preview */}
                      <div className="element-content text-sm text-gray-800">
                        {element.type === 'voice' && (
                          <div>🎤 Voice recording completed</div>
                        )}
                        {element.type === 'art' && (
                          <div>🎨 Artwork created</div>
                        )}
                        {element.type === 'poetry' && element.content.text && (
                          <div className="max-w-48 truncate">{element.content.text}</div>
                        )}
                        {element.type === 'music' && (
                          <div>🎵 Music session: {element.content.type}</div>
                        )}
                        {element.type === 'movement' && (
                          <div>💃 Movement: {element.content.type}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Community Mode */}
        {activeMode === 'community' && (
          <CreativeCommunity />
        )}
      </div>

      {/* Action Buttons - Always visible */}
      <div className="action-panel mt-6 flex items-center justify-between">
        <div className="session-actions flex items-center gap-3">
          {!isFullscreen && (
            <>
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                🔄 Focus Mode
              </button>
              
              <button
                onClick={() => {
                  // Clear current session
                  setSession({
                    id: Date.now().toString(),
                    type: 'text',
                    content: {},
                    timestamp: new Date()
                  });
                  setMultimodalElements([]);
                  sessionStartTime.current = new Date();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                🗑️ New Session
              </button>
            </>
          )}
          
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              ← Exit Focus
            </button>
          )}
        </div>
        
        <div className="save-actions flex items-center gap-3">
          <button
            onClick={autoSave}
            disabled={isSaving}
            className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors text-sm disabled:opacity-50"
          >
            {isSaving ? '💾 Saving...' : '💾 Save Draft'}
          </button>
          
          <button
            onClick={saveSession}
            className="px-6 py-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors text-sm font-medium"
          >
            ✨ Complete Session
          </button>
        </div>
      </div>

      {/* Session Insights - Only show when session has content */}
      {(sessionSummary.length > 0 || session.insights?.length) && !isFullscreen && (
        <div className="session-insights mt-6 p-4 bg-gradient-to-br from-sage-50 to-green-50 rounded-2xl">
          <h4 className="font-semibold text-gray-800 mb-2">Session Insights</h4>
          <div className="insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Modalities Used */}
            {sessionSummary.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Expression Modalities ({sessionSummary.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {sessionSummary.map(element => (
                    <span 
                      key={element}
                      className="px-2 py-1 bg-white text-gray-700 rounded-full text-xs border"
                    >
                      {creativeModes[element as CreativeMode]?.icon} {element}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights */}
            {session.insights && session.insights.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Therapeutic Insights
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  {session.insights.slice(0, 3).map((insight, i) => (
                    <li key={i}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeJournalHub;