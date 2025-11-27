// ALCHM Emotional Reflection & Journaling System
// AI-guided emotional processing through reflective writing and structured journaling

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  EmotionalEntry,
  EmotionalState,
  ThoughtPattern,
  EmotionalBreakthrough,
  AIEmotionalInsight,
  ReflectionPrompt
} from '@/types/emotional-wellness-schema';

interface EmotionalReflectionProps {
  userId: string;
  currentEmotionalState: EmotionalState;
  recentEntries: EmotionalEntry[];
  culturalContext: {
    emotionalExpressionNorms: string[];
    reflectionTraditions: string[];
    languagePreference: string;
    culturalWisdomSources: string[];
  };
  traumaInformedSettings: {
    gentlePrompting: boolean;
    choiceEmphasis: boolean;
    strengthsFocus: boolean;
    resourceReminders: boolean;
  };
  aiInsights?: AIEmotionalInsight[];
  onEntryComplete?: (entry: EmotionalEntry) => void;
  onBreakthroughDetected?: (breakthrough: EmotionalBreakthrough) => void;
}

interface JournalEntry {
  entryText: string;
  emotionalDepth: number; // 1-10
  insightLevel: number; // 1-10
  processingQuality: number; // 1-10
  themes: string[];
  thoughtPatterns: ThoughtPattern[];
  emotionalShifts: string[];
  breakthroughMoments: string[];
  culturalReferences: string[];
  strengthsRecognized: string[];
  supportNeeded: string[];
  gratitudeMoments: string[];
  futureFocused: string[];
}

const EmotionalReflectionJournal: React.FC<EmotionalReflectionProps> = ({
  userId,
  currentEmotionalState,
  recentEntries,
  culturalContext,
  traumaInformedSettings,
  aiInsights,
  onEntryComplete,
  onBreakthroughDetected
}) => {
  // State management
  const [activeSection, setActiveSection] = useState<'guided' | 'freeform' | 'patterns' | 'insights'>('guided');
  const [currentPrompt, setCurrentPrompt] = useState<ReflectionPrompt | null>(null);
  const [journalEntry, setJournalEntry] = useState<JournalEntry>({
    entryText: '',
    emotionalDepth: 5,
    insightLevel: 5,
    processingQuality: 5,
    themes: [],
    thoughtPatterns: [],
    emotionalShifts: [],
    breakthroughMoments: [],
    culturalReferences: [],
    strengthsRecognized: [],
    supportNeeded: [],
    gratitudeMoments: [],
    futureFocused: []
  });
  const [reflectionProgress, setReflectionProgress] = useState({
    currentStep: 0,
    totalSteps: 5,
    timeSpent: 0,
    deepProcessingAchieved: false
  });
  const [emotionalBeforeAfter, setEmotionalBeforeAfter] = useState({
    moodBefore: currentEmotionalState.emotionIntensity || 5,
    moodAfter: currentEmotionalState.emotionIntensity || 5,
    stressBefore: 5,
    stressAfter: 5,
    clarityBefore: currentEmotionalState.emotionClarity || 5,
    clarityAfter: currentEmotionalState.emotionClarity || 5
  });
  const [writingMood, setWritingMood] = useState<'contemplative' | 'expressive' | 'exploratory' | 'healing'>('contemplative');

  // Refs for timing and auto-save
  const startTimeRef = useRef<Date>(new Date());
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Guided reflection prompts based on emotional state and cultural context
  const generateGuidedPrompts = useCallback((): ReflectionPrompt[] => {
    const prompts: ReflectionPrompt[] = [];
    
    // Opening/Check-in prompts
    prompts.push({
      promptId: 'emotional_checkin',
      category: 'emotional_awareness',
      title: 'Emotional Check-In',
      prompt: `Take a moment to pause and breathe. What emotions are you noticing in your body right now? There's no need to change anything - just observe with kindness.`,
      culturalAdaptation: culturalContext.emotionalExpressionNorms.includes('indirect_expression') 
        ? 'You might notice emotions through physical sensations, thoughts, or subtle feelings. All ways of experiencing emotions are valid.'
        : '',
      traumaInformed: traumaInformedSettings.gentlePrompting 
        ? 'Remember, you can share as much or as little as feels safe right now.'
        : '',
      estimatedTime: 3,
      depth: 'surface',
      benefits: ['emotional_awareness', 'present_moment_grounding']
    });

    // Processing prompts based on primary emotion
    if (currentEmotionalState.primaryEmotion === 'sadness' || 
        currentEmotionalState.primaryEmotion === 'grief') {
      prompts.push({
        promptId: 'sadness_processing',
        category: 'emotional_processing',
        title: 'Honoring Sadness',
        prompt: `Sadness often carries important messages about what we value and love. What might your sadness be telling you about what matters to you? What would it be like to offer yourself the same compassion you'd give a dear friend?`,
        culturalAdaptation: culturalContext.reflectionTraditions.includes('ancestor_wisdom')
          ? 'Consider what wisdom your ancestors might offer in this moment of sadness.'
          : '',
        traumaInformed: traumaInformedSettings.strengthsFocus
          ? 'Notice the strength it takes to feel deeply and care about things that matter.'
          : '',
        estimatedTime: 8,
        depth: 'deep',
        benefits: ['emotional_validation', 'meaning_making', 'self_compassion']
      });
    }

    if (currentEmotionalState.primaryEmotion === 'anger' || 
        currentEmotionalState.primaryEmotion === 'frustration') {
      prompts.push({
        promptId: 'anger_exploration',
        category: 'emotional_processing',
        title: 'Understanding Anger',
        prompt: `Anger often points to our boundaries and values. What boundary might have been crossed? What do you need right now? How might you honor both your anger and your wisdom?`,
        culturalAdaptation: culturalContext.emotionalExpressionNorms.includes('anger_taboo')
          ? 'Anger can be a sign of strength and self-protection. It\'s okay to feel this way.'
          : '',
        traumaInformed: traumaInformedSettings.choiceEmphasis
          ? 'You get to choose how to express and work with your anger in ways that feel safe.'
          : '',
        estimatedTime: 10,
        depth: 'deep',
        benefits: ['boundary_awareness', 'need_identification', 'empowerment']
      });
    }

    if (currentEmotionalState.primaryEmotion === 'anxiety' || 
        currentEmotionalState.primaryEmotion === 'fear') {
      prompts.push({
        promptId: 'anxiety_support',
        category: 'emotional_support',
        title: 'Finding Ground in Uncertainty',
        prompt: `Anxiety often tries to protect us by preparing for what might happen. What does your anxiety want you to be aware of? What support or resources do you have available right now?`,
        culturalAdaptation: culturalContext.culturalWisdomSources.includes('community_support')
          ? 'Consider the strength and wisdom available in your community and cultural background.'
          : '',
        traumaInformed: traumaInformedSettings.resourceReminders
          ? 'Remember that you have survived difficult times before and have inner resources.'
          : '',
        estimatedTime: 7,
        depth: 'moderate',
        benefits: ['anxiety_management', 'resource_recognition', 'grounding']
      });
    }

    // Strength and growth prompts
    if (traumaInformedSettings.strengthsFocus) {
      prompts.push({
        promptId: 'strength_recognition',
        category: 'strength_building',
        title: 'Recognizing Your Resilience',
        prompt: `Think about a challenge you've navigated recently. What strengths did you draw upon? How did your cultural background, relationships, or inner wisdom support you?`,
        culturalAdaptation: culturalContext.culturalWisdomSources.join(', ') 
          ? `Consider strengths from your ${culturalContext.culturalWisdomSources.join(', ')} background.`
          : '',
        traumaInformed: 'Every person has survived 100% of their difficult days so far. What does that tell you about your resilience?',
        estimatedTime: 6,
        depth: 'moderate',
        benefits: ['resilience_recognition', 'strength_awareness', 'empowerment']
      });
    }

    // Integration and future focus
    prompts.push({
      promptId: 'integration_forward',
      category: 'integration',
      title: 'Moving Forward',
      prompt: `As you reflect on your emotional journey today, what insight or awareness feels most important? How might you carry this wisdom with you in the days ahead?`,
      culturalAdaptation: culturalContext.reflectionTraditions.includes('future_generations')
        ? 'Consider how this wisdom might also benefit your community or future generations.'
        : '',
      traumaInformed: traumaInformedSettings.choiceEmphasis
        ? 'You get to choose which insights feel helpful and which ones to set aside for now.'
        : '',
      estimatedTime: 5,
      depth: 'moderate',
      benefits: ['insight_integration', 'future_planning', 'wisdom_cultivation']
    });

    return prompts;
  }, [currentEmotionalState, culturalContext, traumaInformedSettings]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      if (journalEntry.entryText.length > 50) {
        saveProgress();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [journalEntry]);

  // AI-powered text analysis
  const analyzeJournalText = useCallback(async (text: string): Promise<Partial<JournalEntry>> => {
    if (text.length < 100) return {};

    // In real implementation, this would call an AI service
    // For now, provide pattern recognition based on keywords
    
    const analysis: Partial<JournalEntry> = {
      themes: [],
      thoughtPatterns: [],
      emotionalShifts: [],
      breakthroughMoments: [],
      strengthsRecognized: [],
      gratitudeMoments: []
    };

    const lowerText = text.toLowerCase();

    // Detect themes
    if (lowerText.includes('work') || lowerText.includes('job')) analysis.themes?.push('work_life');
    if (lowerText.includes('family') || lowerText.includes('parent')) analysis.themes?.push('family_relationships');
    if (lowerText.includes('friend') || lowerText.includes('relationship')) analysis.themes?.push('social_connections');
    if (lowerText.includes('future') || lowerText.includes('goal')) analysis.themes?.push('future_planning');
    if (lowerText.includes('past') || lowerText.includes('memory')) analysis.themes?.push('past_processing');

    // Detect thought patterns
    const catastrophicWords = ['disaster', 'terrible', 'worst', 'never', 'always', 'impossible'];
    if (catastrophicWords.some(word => lowerText.includes(word))) {
      analysis.thoughtPatterns?.push({
        patternId: `pattern_${Date.now()}`,
        patternType: 'catastrophizing',
        content: 'Detected catastrophic thinking patterns',
        frequency: 7,
        believability: 6,
        helpfulness: 3,
        culturalInfluences: [],
        challengingThoughts: ['What evidence supports this?', 'Is there another way to look at this?'],
        alternativeThoughts: ['This is difficult, but I can handle it', 'This too shall pass']
      });
    }

    const strengthWords = ['overcome', 'survived', 'learned', 'grew', 'accomplished', 'proud'];
    if (strengthWords.some(word => lowerText.includes(word))) {
      analysis.strengthsRecognized?.push('resilience', 'growth_mindset', 'perseverance');
    }

    const gratitudeWords = ['grateful', 'thankful', 'appreciate', 'blessed', 'lucky'];
    if (gratitudeWords.some(word => lowerText.includes(word))) {
      analysis.gratitudeMoments?.push('gratitude_expression');
    }

    // Detect emotional shifts
    const beforeAfterPhrases = ['used to feel', 'now I feel', 'starting to feel', 'feeling better', 'feeling worse'];
    if (beforeAfterPhrases.some(phrase => lowerText.includes(phrase))) {
      analysis.emotionalShifts?.push('emotional_transition_noted');
    }

    // Detect breakthroughs
    const breakthroughPhrases = ['suddenly realized', 'it clicked', 'I understand now', 'breakthrough', 'aha moment'];
    if (breakthroughPhrases.some(phrase => lowerText.includes(phrase))) {
      analysis.breakthroughMoments?.push('insight_breakthrough');
    }

    return analysis;
  }, []);

  // Handle text changes with real-time analysis
  const handleTextChange = useCallback(async (text: string) => {
    setJournalEntry(prev => ({ ...prev, entryText: text }));
    
    // Update time spent
    const timeSpent = (Date.now() - startTimeRef.current.getTime()) / 1000 / 60;
    setReflectionProgress(prev => ({ ...prev, timeSpent }));

    // Analyze text for patterns if substantial content
    if (text.length > 200 && text.length % 100 === 0) {
      const analysis = await analyzeJournalText(text);
      setJournalEntry(prev => ({ ...prev, ...analysis }));
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [analyzeJournalText]);

  // Save progress
  const saveProgress = useCallback(() => {
    const progress = {
      userId,
      entryData: journalEntry,
      timestamp: new Date(),
      progress: reflectionProgress
    };
    
    // In real implementation, save to database
    localStorage.setItem(`journal_progress_${userId}`, JSON.stringify(progress));
  }, [userId, journalEntry, reflectionProgress]);

  // Complete journal entry
  const completeJournalEntry = useCallback(() => {
    const endTime = new Date();
    const totalTime = (endTime.getTime() - startTimeRef.current.getTime()) / 1000 / 60;

    const emotionalEntry: EmotionalEntry = {
      entryId: `journal_${userId}_${Date.now()}`,
      userId,
      timestamp: endTime,
      moodBefore: emotionalBeforeAfter.moodBefore,
      moodAfter: emotionalBeforeAfter.moodAfter,
      activity: 'writing',
      reflectionText: journalEntry.entryText,
      aiInsight: generateAIInsight(),
      emotionalState: {
        ...currentEmotionalState,
        emotionClarity: emotionalBeforeAfter.clarityAfter,
        emotionAcceptance: Math.min(emotionalBeforeAfter.clarityAfter + 1, 10)
      },
      triggers: [],
      physicalSensations: [],
      thoughtPatterns: journalEntry.thoughtPatterns,
      breathworkSession: null,
      movementSession: null,
      ritualSession: null,
      creativePractice: null,
      somaticPractice: null,
      alchemyProcess: {
        processId: `alchemy_${Date.now()}`,
        alchemicalStage: determineAlchemicalStage(),
        nigredo: null,
        albedo: null,
        citrinitas: null,
        rubedo: null,
        emotionalMatter: {
          rawEmotion: currentEmotionalState.primaryEmotion,
          intensity: currentEmotionalState.emotionIntensity,
          complexity: currentEmotionalState.secondaryEmotions.length,
          culturalContext: culturalContext.emotionalExpressionNorms,
          readiness: journalEntry.processingQuality / 10
        },
        transformativeElements: [],
        catalysts: [],
        vessels: [],
        dissolutionPhase: null,
        coagulationPhase: null,
        sublimationPhase: null,
        projectionPhase: null,
        embodimentPractices: [],
        integrationRituals: [],
        wisdomDistillation: [],
        culturalTransformation: [],
        ancestralAlchemy: [],
        communityAlchemy: [],
        transformationDepth: journalEntry.emotionalDepth / 10,
        integrationLevel: journalEntry.insightLevel / 10,
        wisdomGained: journalEntry.themes.length / 10,
        healingAchieved: Math.max(0, (emotionalBeforeAfter.moodAfter - emotionalBeforeAfter.moodBefore)) / 10,
        startDate: startTimeRef.current,
        currentPhase: 'active_processing',
        cyclic: false
      },
      breakthrough: journalEntry.breakthroughMoments.length > 0 ? {
        breakthroughId: `breakthrough_${Date.now()}`,
        breakthroughType: 'insight',
        description: journalEntry.breakthroughMoments.join('; '),
        significanceLevel: journalEntry.insightLevel,
        transformationDepth: journalEntry.emotionalDepth / 10,
        integrationNeeded: [],
        sharingDesire: 'private',
        communityValue: 0.5,
        culturalSignificance: null,
        ongoingImpact: []
      } : null,
      integration: null,
      culturalHealing: [],
      identityWork: [],
      ancestralWisdom: [],
      stressLevel: emotionalBeforeAfter.stressAfter,
      energyLevel: currentEmotionalState.energeticState?.overall || 5,
      clarityLevel: emotionalBeforeAfter.clarityAfter,
      connectionLevel: currentEmotionalState.connectionToSelf,
      resilienceGrowth: journalEntry.strengthsRecognized.length / 10,
      sharingLevel: 'private',
      supportReceived: [],
      wisdomShared: [],
      followUpNeeded: journalEntry.supportNeeded.length > 0,
      continuationPlan: null,
      nextPracticeRecommendation: [],
      location: { type: 'private_space', description: 'Personal reflection space' },
      environment: { setting: 'quiet', lighting: 'comfortable', distractions: 'minimal' },
      lifeContext: { currentStressors: [], supportSystems: [], lifeTransitions: [] },
      seasonalInfluence: { season: 'current', impact: 'neutral', adaptations: [] },
      createdAt: startTimeRef.current,
      updatedAt: endTime
    };

    // Check for breakthroughs
    if (journalEntry.breakthroughMoments.length > 0 && onBreakthroughDetected) {
      onBreakthroughDetected(emotionalEntry.breakthrough!);
    }

    onEntryComplete?.(emotionalEntry);
    
    // Clear form
    setJournalEntry({
      entryText: '',
      emotionalDepth: 5,
      insightLevel: 5,
      processingQuality: 5,
      themes: [],
      thoughtPatterns: [],
      emotionalShifts: [],
      breakthroughMoments: [],
      culturalReferences: [],
      strengthsRecognized: [],
      supportNeeded: [],
      gratitudeMoments: [],
      futureFocused: []
    });
  }, [
    userId, 
    journalEntry, 
    emotionalBeforeAfter, 
    currentEmotionalState, 
    culturalContext, 
    onEntryComplete, 
    onBreakthroughDetected
  ]);

  // Helper functions
  const generateAIInsight = (): string => {
    const insights = [
      "Your writing shows deep emotional awareness and willingness to process difficult feelings.",
      "I notice themes of growth and resilience in your reflection.",
      "Your cultural wisdom seems to be a source of strength in your emotional journey.",
      "The patterns in your writing suggest you're in a period of meaningful emotional processing."
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const determineAlchemicalStage = (): 'nigredo' | 'albedo' | 'citrinitas' | 'rubedo' | 'integration' => {
    if (journalEntry.emotionalDepth > 8) return 'nigredo'; // Deep processing
    if (journalEntry.insightLevel > 7) return 'citrinitas'; // Gaining wisdom
    if (journalEntry.strengthsRecognized.length > 2) return 'rubedo'; // Integration
    if (journalEntry.breakthroughMoments.length > 0) return 'albedo'; // Clarity
    return 'integration';
  };

  // Get guided prompts
  const guidedPrompts = generateGuidedPrompts();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-800 mb-2">
          Emotional Reflection & Journaling
        </h2>
        <p className="text-gray-600">
          Process your emotions through guided reflection and expressive writing
        </p>
      </div>

      {/* Trauma-Informed Welcome */}
      {traumaInformedSettings.resourceReminders && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">Your Emotional Journey</h3>
          <p className="text-green-700 text-sm">
            Remember: You are the expert on your own experience. Share only what feels safe and helpful. 
            You can pause, skip, or stop at any time.
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex mb-6 border-b border-gray-200 overflow-x-auto">
        {['guided', 'freeform', 'patterns', 'insights'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section as any)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeSection === section
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {section === 'guided' && 'Guided Reflection'}
            {section === 'freeform' && 'Free Writing'}
            {section === 'patterns' && 'Pattern Recognition'}
            {section === 'insights' && 'AI Insights'}
          </button>
        ))}
      </div>

      {/* Guided Reflection */}
      {activeSection === 'guided' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Guided Reflection Prompts
            </h3>
            <p className="text-gray-600 text-sm">
              Choose a prompt that resonates with you, or work through them in order
            </p>
          </div>

          <div className="grid gap-4">
            {guidedPrompts.map((prompt, index) => (
              <div 
                key={prompt.promptId}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  currentPrompt?.promptId === prompt.promptId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCurrentPrompt(prompt)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{prompt.title}</h4>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {prompt.estimatedTime} min
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      prompt.depth === 'surface' ? 'bg-green-100 text-green-800' :
                      prompt.depth === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {prompt.depth}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3">{prompt.prompt}</p>
                
                {prompt.culturalAdaptation && (
                  <p className="text-blue-700 text-sm mb-2 italic">
                    Cultural Note: {prompt.culturalAdaptation}
                  </p>
                )}
                
                {prompt.traumaInformed && (
                  <p className="text-green-700 text-sm mb-2 italic">
                    Gentle Reminder: {prompt.traumaInformed}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {prompt.benefits.map((benefit) => (
                    <span 
                      key={benefit}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {benefit.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free Writing / Main Editor */}
      {(activeSection === 'freeform' || currentPrompt) && (
        <div className="space-y-6">
          {/* Current Prompt Display */}
          {currentPrompt && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">{currentPrompt.title}</h3>
              <p className="text-blue-700">{currentPrompt.prompt}</p>
              {currentPrompt.culturalAdaptation && (
                <p className="text-blue-600 text-sm mt-2 italic">{currentPrompt.culturalAdaptation}</p>
              )}
            </div>
          )}

          {/* Writing Interface */}
          <div className="space-y-4">
            {/* Mood Rating Before */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood Before Writing (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={emotionalBeforeAfter.moodBefore}
                  onChange={(e) => setEmotionalBeforeAfter(prev => ({
                    ...prev,
                    moodBefore: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 mt-1">
                  {emotionalBeforeAfter.moodBefore}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Level (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={emotionalBeforeAfter.stressBefore}
                  onChange={(e) => setEmotionalBeforeAfter(prev => ({
                    ...prev,
                    stressBefore: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 mt-1">
                  {emotionalBeforeAfter.stressBefore}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clarity Level (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={emotionalBeforeAfter.clarityBefore}
                  onChange={(e) => setEmotionalBeforeAfter(prev => ({
                    ...prev,
                    clarityBefore: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 mt-1">
                  {emotionalBeforeAfter.clarityBefore}
                </div>
              </div>
            </div>

            {/* Writing Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reflection
              </label>
              <textarea
                ref={textareaRef}
                value={journalEntry.entryText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={currentPrompt 
                  ? "Take your time to reflect on this prompt. Write whatever comes to mind..."
                  : "What's on your heart and mind today? Write freely about your thoughts and feelings..."}
                className="w-full min-h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ overflow: 'hidden' }}
              />
              
              {/* Writing Stats */}
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <div>
                  {journalEntry.entryText.length} characters • 
                  {Math.ceil(journalEntry.entryText.split(' ').length)} words • 
                  {Math.ceil(reflectionProgress.timeSpent)} minutes
                </div>
                <div>
                  Auto-saved • Last save: now
                </div>
              </div>
            </div>

            {/* After Writing Ratings */}
            {journalEntry.entryText.length > 100 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mood After Writing (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={emotionalBeforeAfter.moodAfter}
                    onChange={(e) => setEmotionalBeforeAfter(prev => ({
                      ...prev,
                      moodAfter: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {emotionalBeforeAfter.moodAfter}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stress After (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={emotionalBeforeAfter.stressAfter}
                    onChange={(e) => setEmotionalBeforeAfter(prev => ({
                      ...prev,
                      stressAfter: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {emotionalBeforeAfter.stressAfter}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clarity After (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={emotionalBeforeAfter.clarityAfter}
                    onChange={(e) => setEmotionalBeforeAfter(prev => ({
                      ...prev,
                      clarityAfter: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {emotionalBeforeAfter.clarityAfter}
                  </div>
                </div>
              </div>
            )}

            {/* Completion Actions */}
            {journalEntry.entryText.length > 50 && (
              <div className="flex space-x-4">
                <button
                  onClick={saveProgress}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Save Progress
                </button>
                <button
                  onClick={completeJournalEntry}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Complete Entry
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pattern Recognition */}
      {activeSection === 'patterns' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">
            Emotional Patterns & Insights
          </h3>

          {/* Detected Patterns */}
          {journalEntry.themes.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Themes Detected</h4>
              <div className="flex flex-wrap gap-2">
                {journalEntry.themes.map((theme) => (
                  <span 
                    key={theme}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  >
                    {theme.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths Recognized */}
          {journalEntry.strengthsRecognized.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Strengths Recognized</h4>
              <div className="flex flex-wrap gap-2">
                {journalEntry.strengthsRecognized.map((strength) => (
                  <span 
                    key={strength}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {strength.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Breakthrough Moments */}
          {journalEntry.breakthroughMoments.length > 0 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Breakthrough Moments</h4>
              <div className="space-y-2">
                {journalEntry.breakthroughMoments.map((moment, index) => (
                  <div key={index} className="text-purple-700 text-sm">
                    • {moment}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Insights */}
      {activeSection === 'insights' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">
            AI-Generated Insights
          </h3>

          {aiInsights && aiInsights.length > 0 ? (
            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.insightId} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">
                      {insight.insightType.replace('_', ' ')}
                    </h4>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{insight.insight}</p>
                  
                  {insight.immediateRecommendations.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Recommendations:</h5>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        {insight.immediateRecommendations.map((rec, index) => (
                          <li key={index}>{rec.recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>AI insights will appear here as you write and reflect.</p>
              <p className="text-sm mt-2">Complete a reflection to generate personalized insights.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmotionalReflectionJournal;