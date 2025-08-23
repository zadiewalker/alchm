'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSacredMicrocopy } from '@/components/SacredMicrocopyProvider';
import { KheperaEmotionalMirror } from '@/components/khepera/KheperaEmotionalMirror';
import { generateKheperaResponse } from '@/lib/khepera-voice-system';

// ===== REFLECTION INTERFACE TYPES =====

export interface ReflectionEntry {
  id: string;
  userId: string;
  content: string;
  aiMirrorResponse?: {
    themes: string[];
    emotionalReflection: string;
    culturalWisdom?: string;
    timestamp: Date;
    confidence: 'gentle' | 'medium' | 'strong';
  };
  metadata: {
    wordCount: number;
    writingDuration: number; // milliseconds
    emotionalIntensity: 'low' | 'medium' | 'high';
    startedAt: Date;
    lastSaved: Date;
    mode: 'guided' | 'silent';
    prompt?: string; // If in guided mode
  };
  growthTracking?: {
    emotionalTerrain: string[]; // Emotional themes detected
    resilience: number; // 0-1 scale
    clarity: number; // 0-1 scale
    selfCompassion: number; // 0-1 scale
    connection: number; // 0-1 scale
  };
  culturalContext: string;
  isComplete: boolean;
  isArchived: boolean;
}

export interface GuidedPrompt {
  id: string;
  text: string;
  category: 'self_awareness' | 'growth_edge' | 'gratitude' | 'challenge_processing' | 'future_self' | 'wisdom_seeking';
  culturalContext: 'universal' | 'indigenous' | 'african_diaspora' | 'east_asian' | 'latin_american' | 'middle_eastern' | 'european' | 'bridge';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  emotionalContainer: 'gentle' | 'exploratory' | 'challenging' | 'celebratory';
  backgroundWisdom?: string;
}

export interface ReflectionSession {
  id: string;
  userId: string;
  entries: ReflectionEntry[];
  mode: 'guided' | 'silent';
  currentPrompt?: GuidedPrompt;
  sessionDepth: 'surface' | 'exploring' | 'integration';
  startedAt: Date;
  lastActivity: Date;
  culturalContext: string;
  aiAssistanceLevel: 'minimal' | 'reflective' | 'full' | 'off';
}

// ===== SACRED REFLECTION INTERFACE COMPONENT =====

export interface SacredReflectionInterfaceProps {
  userId: string;
  culturalContext?: string;
  initialMode?: 'guided' | 'silent';
  aiAssistanceLevel?: 'minimal' | 'reflective' | 'full' | 'off';
  onSave?: (entry: ReflectionEntry) => void;
  className?: string;
}

export function SacredReflectionInterface({
  userId,
  culturalContext = 'universal',
  initialMode = 'guided',
  aiAssistanceLevel = 'reflective',
  onSave,
  className = ''
}: SacredReflectionInterfaceProps) {
  // Core state
  const [currentEntry, setCurrentEntry] = useState<ReflectionEntry | null>(null);
  const [reflectionContent, setReflectionContent] = useState('');
  const [mode, setMode] = useState<'guided' | 'silent'>(initialMode);
  const [currentPrompt, setCurrentPrompt] = useState<GuidedPrompt | null>(null);
  
  // AI mirroring state
  const [aiMirrorResponse, setAiMirrorResponse] = useState<ReflectionEntry['aiMirrorResponse'] | null>(null);
  const [isProcessingMirror, setIsProcessingMirror] = useState(false);
  const [showAiMirror, setShowAiMirror] = useState(aiAssistanceLevel !== 'off');
  
  // Writing flow state
  const [isWriting, setIsWriting] = useState(false);
  const [writingStartTime, setWritingStartTime] = useState<Date | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<Date>(new Date());
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  
  // Growth tracking state
  const [showGrowthChart, setShowGrowthChart] = useState(false);
  const [growthData, setGrowthData] = useState<ReflectionEntry['growthTracking'][]>([]);
  
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mirrorProcessingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { copy } = useSacredMicrocopy();

  // Initialize reflection session
  useEffect(() => {
    initializeReflectionSession();
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      if (mirrorProcessingTimerRef.current) clearTimeout(mirrorProcessingTimerRef.current);
    };
  }, []);

  // Auto-save system
  useEffect(() => {
    if (reflectionContent.length > 0 && isWriting) {
      setAutoSaveStatus('unsaved');
      
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        performAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
  }, [reflectionContent, isWriting]);

  // AI mirroring trigger
  useEffect(() => {
    if (reflectionContent.length > 100 && aiAssistanceLevel !== 'off' && mode === 'guided') {
      triggerAiMirroring();
    }
  }, [reflectionContent, aiAssistanceLevel, mode]);

  const initializeReflectionSession = () => {
    const entry: ReflectionEntry = {
      id: `entry-${Date.now()}`,
      userId,
      content: '',
      metadata: {
        wordCount: 0,
        writingDuration: 0,
        emotionalIntensity: 'low',
        startedAt: new Date(),
        lastSaved: new Date(),
        mode: mode
      },
      culturalContext,
      isComplete: false,
      isArchived: false
    };
    
    setCurrentEntry(entry);
    
    if (mode === 'guided') {
      loadGuidedPrompt();
    }
  };

  const loadGuidedPrompt = () => {
    const prompts = getSacredPrompts(culturalContext);
    const timeBasedPrompts = prompts.filter(p => 
      p.timeOfDay === getCurrentTimeOfDay() || p.timeOfDay === 'any'
    );
    
    const selectedPrompt = timeBasedPrompts[Math.floor(Math.random() * timeBasedPrompts.length)];
    setCurrentPrompt(selectedPrompt);
    
    if (currentEntry) {
      setCurrentEntry(prev => prev ? {
        ...prev,
        metadata: { ...prev.metadata, prompt: selectedPrompt.text }
      } : null);
    }
  };

  const performAutoSave = useCallback(async () => {
    if (!currentEntry) return;
    
    setAutoSaveStatus('saving');
    
    const updatedEntry: ReflectionEntry = {
      ...currentEntry,
      content: reflectionContent,
      metadata: {
        ...currentEntry.metadata,
        wordCount: reflectionContent.trim().split(/\s+/).length,
        writingDuration: writingStartTime ? Date.now() - writingStartTime.getTime() : 0,
        lastSaved: new Date(),
        emotionalIntensity: analyzeEmotionalIntensity(reflectionContent)
      }
    };
    
    setCurrentEntry(updatedEntry);
    setLastSaveTime(new Date());
    
    // Simulate save delay for sacred pacing
    setTimeout(() => {
      setAutoSaveStatus('saved');
      onSave?.(updatedEntry);
    }, 800);
  }, [currentEntry, reflectionContent, writingStartTime, onSave]);

  const triggerAiMirroring = useCallback(() => {
    if (isProcessingMirror || aiAssistanceLevel === 'off') return;
    
    setIsProcessingMirror(true);
    
    // Sacred processing delay - not instant
    mirrorProcessingTimerRef.current = setTimeout(async () => {
      const mirrorResponse = await generateAiMirrorResponse(reflectionContent, culturalContext);
      setAiMirrorResponse(mirrorResponse);
      setIsProcessingMirror(false);
    }, 3000); // 3-second contemplative delay
  }, [reflectionContent, culturalContext, isProcessingMirror, aiAssistanceLevel]);

  const handleContentChange = (content: string) => {
    setReflectionContent(content);
    
    if (!isWriting && content.length > 0) {
      setIsWriting(true);
      setWritingStartTime(new Date());
    }
    
    // Update word count in real-time
    if (currentEntry) {
      setCurrentEntry(prev => prev ? {
        ...prev,
        metadata: {
          ...prev.metadata,
          wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length
        }
      } : null);
    }
  };

  const switchMode = (newMode: 'guided' | 'silent') => {
    setMode(newMode);
    
    if (newMode === 'guided' && !currentPrompt) {
      loadGuidedPrompt();
    }
    
    if (currentEntry) {
      setCurrentEntry(prev => prev ? {
        ...prev,
        metadata: { ...prev.metadata, mode: newMode }
      } : null);
    }
  };

  const completeReflection = async () => {
    if (!currentEntry) return;
    
    await performAutoSave();
    
    const completedEntry: ReflectionEntry = {
      ...currentEntry,
      content: reflectionContent,
      isComplete: true,
      aiMirrorResponse,
      growthTracking: await generateGrowthTracking(reflectionContent, culturalContext)
    };
    
    setCurrentEntry(completedEntry);
    onSave?.(completedEntry);
    
    // Reset for new reflection
    setTimeout(() => {
      initializeReflectionSession();
      setReflectionContent('');
      setAiMirrorResponse(null);
      setIsWriting(false);
      setWritingStartTime(null);
    }, 2000);
  };

  return (
    <div className={`sacred-reflection-interface ${className}`}>
      {/* Sacred Header with Mode Toggle */}
      <div className="reflection-header mb-ritual">
        <SacredModeToggle
          currentMode={mode}
          onModeChange={switchMode}
          aiAssistanceLevel={aiAssistanceLevel}
          showGrowthChart={showGrowthChart}
          onToggleGrowthChart={setShowGrowthChart}
        />
      </div>

      {/* Main Reflection Area */}
      <div className="reflection-main-area grid grid-cols-1 lg:grid-cols-3 gap-ritual">
        {/* Primary Writing Space */}
        <div className="writing-space lg:col-span-2">
          <SacredWritingCanvas
            content={reflectionContent}
            onContentChange={handleContentChange}
            currentPrompt={mode === 'guided' ? currentPrompt : null}
            metadata={currentEntry?.metadata}
            autoSaveStatus={autoSaveStatus}
            isWriting={isWriting}
            textareaRef={textareaRef}
          />
          
          {/* Reflection Actions */}
          <div className="reflection-actions mt-gentle">
            <ReflectionActions
              onComplete={completeReflection}
              onNewPrompt={mode === 'guided' ? loadGuidedPrompt : undefined}
              isComplete={currentEntry?.isComplete}
              hasContent={reflectionContent.length > 0}
            />
          </div>
        </div>

        {/* AI Mirror & Insights Panel */}
        <div className="insights-panel">
          {showAiMirror && aiAssistanceLevel !== 'off' && (
            <AiMirrorPanel
              mirrorResponse={aiMirrorResponse}
              isProcessing={isProcessingMirror}
              culturalContext={culturalContext}
              assistanceLevel={aiAssistanceLevel}
              onToggleVisibility={setShowAiMirror}
            />
          )}
          
          {showGrowthChart && (
            <GrowthTerrainChart
              growthData={growthData}
              culturalContext={culturalContext}
              className="mt-ritual"
            />
          )}
        </div>
      </div>

      {/* Khepera Presence (if AI assistance enabled) */}
      {aiAssistanceLevel !== 'off' && (
        <div className="khepera-presence-container mt-ritual">
          <KheperaEmotionalMirror
            userId={userId}
            culturalContext={culturalContext}
            sessionType="reflection"
            className="khepera-reflection-guide"
          />
        </div>
      )}
    </div>
  );
}

// ===== SACRED MODE TOGGLE COMPONENT =====

interface SacredModeToggleProps {
  currentMode: 'guided' | 'silent';
  onModeChange: (mode: 'guided' | 'silent') => void;
  aiAssistanceLevel: string;
  showGrowthChart: boolean;
  onToggleGrowthChart: (show: boolean) => void;
}

function SacredModeToggle({
  currentMode,
  onModeChange,
  aiAssistanceLevel,
  showGrowthChart,
  onToggleGrowthChart
}: SacredModeToggleProps) {
  return (
    <div className="sacred-mode-toggle">
      <div className="flex items-center justify-between">
        {/* Mode Selection */}
        <div className="mode-selector flex items-center gap-breath">
          <div className="flex bg-healing-mist rounded-gentle p-whisper">
            <button
              onClick={() => onModeChange('guided')}
              className={`px-gentle py-breath rounded-breath transition-all timing-breath ${
                currentMode === 'guided'
                  ? 'bg-primary text-white shadow-breath'
                  : 'text-secondary hover:bg-tender-embrace'
              }`}
            >
              <span className="flex items-center gap-whisper">
                <span>🌱</span>
                Guided Reflection
              </span>
            </button>
            <button
              onClick={() => onModeChange('silent')}
              className={`px-gentle py-breath rounded-breath transition-all timing-breath ${
                currentMode === 'silent'
                  ? 'bg-charcoal text-white shadow-breath'
                  : 'text-secondary hover:bg-tender-embrace'
              }`}
            >
              <span className="flex items-center gap-whisper">
                <span>🤫</span>
                Silent Space
              </span>
            </button>
          </div>
          
          <div className="mode-description">
            <p className="text-breath text-secondary">
              {currentMode === 'guided' 
                ? 'Sacred prompts guide your exploration' 
                : 'Pure agency, no prompts - your voice leads'
              }
            </p>
          </div>
        </div>

        {/* Options Menu */}
        <div className="reflection-options flex items-center gap-breath">
          {aiAssistanceLevel !== 'off' && (
            <button
              onClick={() => onToggleGrowthChart(!showGrowthChart)}
              className={`sacred-button intention-gentle text-breath ${
                showGrowthChart ? 'bg-primary text-white' : ''
              }`}
            >
              <span className="flex items-center gap-whisper">
                <span>📈</span>
                Emotional Terrain
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== SACRED WRITING CANVAS COMPONENT =====

interface SacredWritingCanvasProps {
  content: string;
  onContentChange: (content: string) => void;
  currentPrompt: GuidedPrompt | null;
  metadata?: ReflectionEntry['metadata'];
  autoSaveStatus: 'saved' | 'saving' | 'unsaved';
  isWriting: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

function SacredWritingCanvas({
  content,
  onContentChange,
  currentPrompt,
  metadata,
  autoSaveStatus,
  isWriting,
  textareaRef
}: SacredWritingCanvasProps) {
  const getAutoSaveMessage = () => {
    switch (autoSaveStatus) {
      case 'saving': return 'Your voice is being held...';
      case 'saved': return 'Your words rest in sacred keeping';
      case 'unsaved': return 'Words seeking their sacred place...';
      default: return '';
    }
  };

  const getAutoSaveIcon = () => {
    switch (autoSaveStatus) {
      case 'saving': return '💫';
      case 'saved': return '🕊️';
      case 'unsaved': return '✨';
      default: return '✨';
    }
  };

  return (
    <div className="sacred-writing-canvas">
      {/* Guided Prompt Display */}
      {currentPrompt && (
        <div className="guided-prompt surface-elevated-warm p-gentle rounded-gentle mb-gentle">
          <div className="flex items-start gap-breath">
            <span className="text-xl mt-whisper">💫</span>
            <div className="flex-1">
              <p className="text-presence text-primary font-presence leading-spacious italic">
                "{currentPrompt.text}"
              </p>
              {currentPrompt.backgroundWisdom && (
                <p className="text-breath text-secondary mt-breath">
                  {currentPrompt.backgroundWisdom}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Writing Area */}
      <div className="writing-area surface-sanctuary border border-healing-mist rounded-gentle overflow-hidden">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={currentPrompt 
            ? "Let your reflection flow here... What wants to be witnessed?"
            : "This sacred space holds whatever wants to emerge... Your voice leads."
          }
          className="w-full h-96 p-ritual bg-transparent border-none outline-none resize-none text-presence text-primary leading-spacious placeholder-secondary"
          style={{
            fontFamily: 'var(--font-sacred-primary)',
            lineHeight: 'var(--leading-spacious)'
          }}
        />
        
        {/* Writing Canvas Footer */}
        <div className="writing-footer bg-healing-mist p-gentle border-t border-tender-embrace">
          <div className="flex items-center justify-between">
            {/* Auto-save Status */}
            <div className="autosave-status flex items-center gap-breath">
              <span className="text-lg">{getAutoSaveIcon()}</span>
              <div>
                <p className="text-breath text-secondary">{getAutoSaveMessage()}</p>
                {autoSaveStatus === 'saved' && metadata?.lastSaved && (
                  <p className="text-whisper text-tertiary">
                    Last held: {new Date(metadata.lastSaved).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            {/* Writing Metrics */}
            <div className="writing-metrics flex items-center gap-ritual">
              {metadata && (
                <>
                  <div className="word-count text-center">
                    <p className="text-breath text-primary font-presence">{metadata.wordCount}</p>
                    <p className="text-whisper text-tertiary">words witnessed</p>
                  </div>
                  
                  {isWriting && (
                    <div className="writing-time text-center">
                      <p className="text-breath text-primary font-presence">
                        {Math.floor((Date.now() - metadata.startedAt.getTime()) / 60000)}m
                      </p>
                      <p className="text-whisper text-tertiary">reflecting</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== AI MIRROR PANEL COMPONENT =====

interface AiMirrorPanelProps {
  mirrorResponse: ReflectionEntry['aiMirrorResponse'] | null;
  isProcessing: boolean;
  culturalContext: string;
  assistanceLevel: string;
  onToggleVisibility: (visible: boolean) => void;
}

function AiMirrorPanel({
  mirrorResponse,
  isProcessing,
  culturalContext,
  assistanceLevel,
  onToggleVisibility
}: AiMirrorPanelProps) {
  return (
    <div className="ai-mirror-panel surface-card-gentle p-gentle rounded-gentle border border-healing-mist">
      {/* Panel Header */}
      <div className="panel-header flex items-center justify-between mb-gentle">
        <div className="flex items-center gap-breath">
          <span className="text-lg">🪞</span>
          <h3 className="text-grounding font-presence text-primary">Sacred Mirror</h3>
        </div>
        <button
          onClick={() => onToggleVisibility(false)}
          className="text-whisper text-tertiary hover:text-secondary transition-colors timing-breath"
          title="Hide mirror"
        >
          👁️‍🗨️
        </button>
      </div>

      {/* Mirror Content */}
      {isProcessing ? (
        <AiMirrorProcessing />
      ) : mirrorResponse ? (
        <AiMirrorContent 
          response={mirrorResponse}
          culturalContext={culturalContext}
        />
      ) : (
        <AiMirrorEmpty assistanceLevel={assistanceLevel} />
      )}
    </div>
  );
}

function AiMirrorProcessing() {
  return (
    <div className="ai-mirror-processing text-center py-ritual">
      <div className="flex items-center justify-center gap-breath mb-breath">
        <div className="scarab-pulse w-6 h-6 bg-primary rounded-full animate-pulse"></div>
        <div className="scarab-pulse w-4 h-4 bg-warm-terra rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="scarab-pulse w-3 h-3 bg-soft-blush rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-breath text-secondary">Holding space for your reflection...</p>
      <p className="text-whisper text-tertiary">Sacred stillness deepens understanding</p>
    </div>
  );
}

function AiMirrorContent({ 
  response, 
  culturalContext 
}: { 
  response: ReflectionEntry['aiMirrorResponse'], 
  culturalContext: string 
}) {
  if (!response) return null;

  return (
    <div className="ai-mirror-content space-y-gentle">
      {/* Emotional Reflection */}
      <div className="emotional-reflection">
        <div className="bg-tender-embrace p-breath rounded-breath">
          <p className="text-breath text-primary italic leading-spacious">
            {response.emotionalReflection}
          </p>
        </div>
      </div>

      {/* Themes Detected */}
      {response.themes.length > 0 && (
        <div className="themes-detected">
          <h4 className="text-breath font-presence text-secondary mb-breath">
            Themes I notice emerging:
          </h4>
          <div className="flex gap-whisper flex-wrap">
            {response.themes.map((theme, index) => (
              <span 
                key={index}
                className="text-whisper bg-healing-mist px-breath py-whisper rounded-breath"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cultural Wisdom */}
      {response.culturalWisdom && (
        <div className="cultural-wisdom bg-moon-whisper p-breath rounded-breath">
          <div className="flex items-start gap-breath">
            <span className="text-lg">🌅</span>
            <p className="text-breath text-secondary italic">
              {response.culturalWisdom}
            </p>
          </div>
        </div>
      )}

      {/* Mirror Confidence Indicator */}
      <div className="mirror-confidence">
        <div className="flex items-center gap-breath">
          <span className="text-whisper text-tertiary">Mirror clarity:</span>
          <div className="flex gap-whisper">
            {Array.from({ length: 3 }, (_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < (response.confidence === 'strong' ? 3 : response.confidence === 'medium' ? 2 : 1)
                    ? 'bg-primary'
                    : 'bg-healing-mist'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AiMirrorEmpty({ assistanceLevel }: { assistanceLevel: string }) {
  return (
    <div className="ai-mirror-empty text-center py-ritual">
      <span className="text-2xl mb-breath block">🪞</span>
      <p className="text-breath text-secondary mb-breath">
        Your mirror awaits your reflection
      </p>
      <p className="text-whisper text-tertiary">
        {assistanceLevel === 'minimal' 
          ? 'Gentle mirroring when invited'
          : 'Writing a bit more will invite the mirror to respond'
        }
      </p>
    </div>
  );
}

// ===== GROWTH TERRAIN CHART COMPONENT =====

interface GrowthTerrainChartProps {
  growthData: ReflectionEntry['growthTracking'][];
  culturalContext: string;
  className?: string;
}

function GrowthTerrainChart({ growthData, culturalContext, className = '' }: GrowthTerrainChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'resilience' | 'clarity' | 'selfCompassion' | 'connection'>('resilience');

  if (growthData.length === 0) {
    return (
      <div className={`growth-terrain-chart surface-card-gentle p-gentle rounded-gentle border border-healing-mist ${className}`}>
        <div className="text-center py-ritual">
          <span className="text-2xl mb-breath block">🌱</span>
          <h3 className="text-grounding font-presence text-primary mb-breath">
            Emotional Terrain
          </h3>
          <p className="text-breath text-secondary">
            Your growth patterns will emerge here as you continue reflecting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`growth-terrain-chart surface-card-gentle p-gentle rounded-gentle border border-healing-mist ${className}`}>
      {/* Chart Header */}
      <div className="chart-header mb-gentle">
        <div className="flex items-center gap-breath mb-breath">
          <span className="text-lg">📈</span>
          <h3 className="text-grounding font-presence text-primary">Emotional Terrain</h3>
        </div>
        
        {/* Metric Selector */}
        <div className="metric-selector flex gap-whisper flex-wrap">
          {(['resilience', 'clarity', 'selfCompassion', 'connection'] as const).map(metric => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-breath py-whisper rounded-breath text-whisper transition-all timing-breath ${
                selectedMetric === metric
                  ? 'bg-primary text-white'
                  : 'bg-healing-mist text-secondary hover:bg-tender-embrace'
              }`}
            >
              {metric === 'selfCompassion' ? 'self compassion' : metric}
            </button>
          ))}
        </div>
      </div>

      {/* Simple Terrain Visualization */}
      <div className="terrain-visualization mb-gentle">
        <div className="h-24 bg-healing-mist rounded-breath p-breath flex items-end gap-whisper overflow-hidden">
          {growthData.slice(-10).map((data, index) => {
            const value = data?.[selectedMetric] || 0;
            const height = Math.max(value * 100, 10); // Minimum 10% height
            
            return (
              <div
                key={index}
                className="flex-1 bg-primary rounded-breath transition-all timing-breath opacity-70 hover:opacity-100"
                style={{ height: `${height}%` }}
                title={`${selectedMetric}: ${Math.round(value * 100)}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Terrain Insights */}
      <div className="terrain-insights">
        <div className="grid grid-cols-2 gap-breath text-center">
          {Object.entries(growthData[growthData.length - 1] || {}).map(([key, value]) => {
            if (typeof value !== 'number') return null;
            
            return (
              <div key={key} className="terrain-metric">
                <p className="text-breath font-presence text-primary">
                  {Math.round(value * 100)}%
                </p>
                <p className="text-whisper text-tertiary">
                  {key === 'selfCompassion' ? 'self compassion' : key}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===== REFLECTION ACTIONS COMPONENT =====

interface ReflectionActionsProps {
  onComplete: () => void;
  onNewPrompt?: () => void;
  isComplete?: boolean;
  hasContent: boolean;
}

function ReflectionActions({
  onComplete,
  onNewPrompt,
  isComplete,
  hasContent
}: ReflectionActionsProps) {
  return (
    <div className="reflection-actions">
      <div className="flex items-center justify-between">
        {/* Secondary Actions */}
        <div className="secondary-actions flex items-center gap-breath">
          {onNewPrompt && (
            <button
              onClick={onNewPrompt}
              className="sacred-button intention-gentle"
            >
              <span className="flex items-center gap-whisper">
                <span>🎲</span>
                New sacred prompt
              </span>
            </button>
          )}
        </div>

        {/* Primary Actions */}
        <div className="primary-actions flex items-center gap-breath">
          <button
            onClick={onComplete}
            disabled={!hasContent || isComplete}
            className="sacred-button intention-sacred disabled:opacity-50"
          >
            <span className="flex items-center gap-whisper">
              <span>🕊️</span>
              {isComplete ? 'Reflection complete' : 'Honor this reflection'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====

function getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function analyzeEmotionalIntensity(content: string): 'low' | 'medium' | 'high' {
  const intensityWords = {
    high: ['overwhelming', 'intense', 'powerful', 'devastating', 'incredible', 'amazing'],
    medium: ['feeling', 'thinking', 'wondering', 'noticing', 'experiencing'],
    low: ['maybe', 'perhaps', 'slightly', 'somewhat', 'little bit']
  };
  
  const lowerContent = content.toLowerCase();
  
  for (const word of intensityWords.high) {
    if (lowerContent.includes(word)) return 'high';
  }
  
  for (const word of intensityWords.medium) {
    if (lowerContent.includes(word)) return 'medium';
  }
  
  return 'low';
}

async function generateAiMirrorResponse(
  content: string,
  culturalContext: string
): Promise<ReflectionEntry['aiMirrorResponse']> {
  // Simulate AI processing - would integrate with actual AI service
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple theme detection
  const themes = detectThemes(content);
  
  // Generate mirror response
  const emotionalReflection = generateEmotionalMirror(content, themes);
  
  // Cultural wisdom if applicable
  const culturalWisdom = culturalContext !== 'universal' 
    ? generateCulturalWisdom(culturalContext, themes)
    : undefined;
  
  return {
    themes,
    emotionalReflection,
    culturalWisdom,
    timestamp: new Date(),
    confidence: themes.length > 2 ? 'strong' : themes.length > 0 ? 'medium' : 'gentle'
  };
}

function detectThemes(content: string): string[] {
  const themePatterns = {
    'growth': ['learn', 'grow', 'change', 'evolve', 'develop'],
    'gratitude': ['grateful', 'thankful', 'appreciate', 'blessed'],
    'challenge': ['difficult', 'hard', 'struggle', 'tough', 'challenge'],
    'connection': ['friend', 'family', 'love', 'relationship', 'together'],
    'reflection': ['think', 'wonder', 'ponder', 'consider', 'reflect'],
    'healing': ['heal', 'recover', 'mend', 'restore', 'better']
  };
  
  const lowerContent = content.toLowerCase();
  const detectedThemes: string[] = [];
  
  for (const [theme, patterns] of Object.entries(themePatterns)) {
    if (patterns.some(pattern => lowerContent.includes(pattern))) {
      detectedThemes.push(theme);
    }
  }
  
  return detectedThemes;
}

function generateEmotionalMirror(content: string, themes: string[]): string {
  const mirrors = [
    "I hear themes of growth and self-discovery in your words",
    "There's a quality of deep reflection flowing through your sharing",
    "I sense both vulnerability and strength in what you've expressed",
    "Your words carry a mixture of challenge and wisdom",
    "There's an honesty in your reflection that honors your experience"
  ];
  
  if (themes.includes('gratitude')) {
    return "I feel appreciation and recognition flowing through your reflection";
  }
  
  if (themes.includes('challenge')) {
    return "I sense you're holding both difficulty and your own resilience";
  }
  
  if (themes.includes('growth')) {
    return "There's a quality of expansion and learning alive in your words";
  }
  
  return mirrors[Math.floor(Math.random() * mirrors.length)];
}

function generateCulturalWisdom(culturalContext: string, themes: string[]): string {
  const wisdomMap = {
    'indigenous': "The ancestors remind us that all healing happens in relationship",
    'african_diaspora': "Ubuntu teaches us that your individual healing strengthens the whole community",
    'east_asian': "The Tao flows through your willingness to be present with what is",
    'latin_american': "Your corazón knows the path - trust its ancient wisdom"
  };
  
  return wisdomMap[culturalContext as keyof typeof wisdomMap] || 
         "Ancient wisdom flows through your reflection";
}

async function generateGrowthTracking(
  content: string,
  culturalContext: string
): Promise<ReflectionEntry['growthTracking']> {
  // Simulate analysis - would use actual AI
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const themes = detectThemes(content);
  
  return {
    emotionalTerrain: themes,
    resilience: Math.random() * 0.4 + 0.6, // 0.6-1.0 range
    clarity: Math.random() * 0.5 + 0.5,     // 0.5-1.0 range
    selfCompassion: Math.random() * 0.6 + 0.4, // 0.4-1.0 range
    connection: Math.random() * 0.7 + 0.3    // 0.3-1.0 range
  };
}

function getSacredPrompts(culturalContext: string): GuidedPrompt[] {
  const universalPrompts: GuidedPrompt[] = [
    {
      id: 'future-self-gratitude',
      text: 'What would your future self thank you for doing today?',
      category: 'future_self',
      culturalContext: 'universal',
      timeOfDay: 'any',
      emotionalContainer: 'exploratory',
      backgroundWisdom: 'This invitation connects you to your deepest values and long-term wisdom'
    },
    {
      id: 'tension-growth',
      text: 'Where are you feeling tension in your life, and what growth might be trying to emerge?',
      category: 'growth_edge',
      culturalContext: 'universal',
      timeOfDay: 'any',
      emotionalContainer: 'challenging'
    },
    {
      id: 'present-gratitude',
      text: 'What in this very moment are you grateful for?',
      category: 'gratitude',
      culturalContext: 'universal',
      timeOfDay: 'any',
      emotionalContainer: 'gentle'
    },
    {
      id: 'wisdom-seeking',
      text: 'What question is your heart asking that you haven\'t put into words yet?',
      category: 'wisdom_seeking',
      culturalContext: 'universal',
      timeOfDay: 'any',
      emotionalContainer: 'exploratory'
    }
  ];
  
  // Add cultural adaptations
  if (culturalContext === 'indigenous') {
    universalPrompts.push({
      id: 'seven-generations',
      text: 'How does this decision honor both your ancestors and the children coming seven generations ahead?',
      category: 'wisdom_seeking',
      culturalContext: 'indigenous',
      timeOfDay: 'any',
      emotionalContainer: 'exploratory',
      backgroundWisdom: 'The Seven Generations principle guides us to consider the long-term impact of our choices'
    });
  }
  
  return universalPrompts;
}

export default SacredReflectionInterface;