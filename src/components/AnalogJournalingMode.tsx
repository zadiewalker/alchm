'use client';

import React, { useState, useEffect } from 'react';
import { 
  AnalogPrompt, 
  AnalogPromptCategory, 
  AnalogPromptSelector,
  ANALOG_JOURNALING_GUIDANCE 
} from '@/lib/analog-prompts';

interface AnalogJournalingModeProps {
  userId: string;
  onSaveEntry?: (content: string, metadata: any) => void;
}

export default function AnalogJournalingMode({ 
  userId, 
  onSaveEntry 
}: AnalogJournalingModeProps) {
  const [currentPrompt, setCurrentPrompt] = useState<AnalogPrompt | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AnalogPromptCategory>('daily_check_in');
  const [journalContent, setJournalContent] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());
  const [showGuidance, setShowGuidance] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load a gentle starter prompt
    const starterPrompts = AnalogPromptSelector.getStarterPrompts();
    setCurrentPrompt(starterPrompts[0]);
  }, []);

  useEffect(() => {
    // Update word count
    const words = journalContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [journalContent]);

  useEffect(() => {
    // Track session time
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
      setTimeSpent(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const handlePromptSelect = (category: AnalogPromptCategory) => {
    setSelectedCategory(category);
    const newPrompt = AnalogPromptSelector.getRandomPrompt(category);
    setCurrentPrompt(newPrompt);
  };

  const handleRandomPrompt = () => {
    const gentlePrompts = AnalogPromptSelector.getGentlePrompts();
    const randomPrompt = gentlePrompts[Math.floor(Math.random() * gentlePrompts.length)];
    setCurrentPrompt(randomPrompt);
    setSelectedCategory(randomPrompt.category);
  };

  const handleSaveEntry = async () => {
    if (!journalContent.trim()) return;

    setIsSaving(true);
    try {
      const entryMetadata = {
        promptUsed: currentPrompt?.prompt,
        promptCategory: currentPrompt?.category,
        promptId: currentPrompt?.id,
        timeSpent: timeSpent,
        wordCount: wordCount,
        difficulty: currentPrompt?.difficulty,
        analogMode: true,
        sessionStartTime: sessionStartTime.toISOString(),
        completedAt: new Date().toISOString()
      };

      // Save via parent component or API
      if (onSaveEntry) {
        onSaveEntry(journalContent, entryMetadata);
      } else {
        // Default save to API
        const response = await fetch('/api/journal/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: journalContent,
            metadata: entryMetadata,
            mode: 'analog'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save journal entry');
        }
      }

      // Reset for new entry
      setJournalContent('');
      setSessionStartTime(new Date());
      setTimeSpent(0);
      
      // Show success feedback
      alert('Your reflection has been saved privately and securely.');

    } catch (error) {
      console.error('Failed to save journal entry:', error);
      alert('Failed to save your entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const promptCategories: { key: AnalogPromptCategory; label: string; description: string }[] = [
    { key: 'daily_check_in', label: 'Daily Check-in', description: 'Gentle body and emotion awareness' },
    { key: 'emotional_awareness', label: 'Emotional Awareness', description: 'Explore and understand your feelings' },
    { key: 'strength_recognition', label: 'Strength Recognition', description: 'Acknowledge your resilience and courage' },
    { key: 'creative_expression', label: 'Creative Expression', description: 'Artistic and imaginative reflection' },
    { key: 'cultural_connection', label: 'Cultural Connection', description: 'Honor your heritage and traditions' },
    { key: 'healing_journey', label: 'Healing Journey', description: 'Growth-oriented and transformative prompts' },
    { key: 'gratitude_practice', label: 'Gratitude Practice', description: 'Appreciate the goodness in your life' },
    { key: 'future_visioning', label: 'Future Visioning', description: 'Dreams and aspirations for tomorrow' },
    { key: 'relationship_reflection', label: 'Relationship Reflection', description: 'Connections with others and yourself' },
    { key: 'spiritual_practice', label: 'Spiritual Practice', description: 'Meaning, purpose, and transcendence' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-medium text-amber-900">Analog Journaling</h1>
              <p className="text-amber-700 mt-1">Your words, your wisdom, your pace</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-amber-600">Session Time</div>
              <div className="text-lg font-mono text-amber-800">{formatTime(timeSpent)}</div>
            </div>
          </div>

          <div className="flex items-center mt-4 space-x-4">
            <button
              onClick={() => setShowGuidance(!showGuidance)}
              className="text-amber-600 hover:text-amber-800 text-sm flex items-center"
            >
              📖 Guidance
            </button>
            <button
              onClick={() => setShowGrounding(!showGrounding)}
              className="text-amber-600 hover:text-amber-800 text-sm flex items-center"
            >
              🌱 Grounding
            </button>
            <div className="text-amber-600 text-sm">
              {wordCount} words
            </div>
          </div>
        </div>

        {/* Guidance Panel */}
        {showGuidance && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-amber-900 mb-3">{ANALOG_JOURNALING_GUIDANCE.introduction.title}</h3>
            <p className="text-amber-800 mb-4">{ANALOG_JOURNALING_GUIDANCE.introduction.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-amber-900 mb-2">Getting Started</h4>
                <ul className="text-amber-800 text-sm space-y-1">
                  {ANALOG_JOURNALING_GUIDANCE.getting_started.steps.map((step, index) => (
                    <li key={index}>• {step}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-amber-900 mb-2">Trauma-Informed Principles</h4>
                <ul className="text-amber-800 text-sm space-y-1">
                  {ANALOG_JOURNALING_GUIDANCE.trauma_informed_principles.principles.slice(0, 3).map((principle, index) => (
                    <li key={index}>• {principle}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Grounding Techniques */}
        {showGrounding && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-green-900 mb-3">Grounding Techniques</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(ANALOG_JOURNALING_GUIDANCE.grounding_techniques).map(([key, technique]) => (
                <div key={key} className="bg-white rounded p-3">
                  <h4 className="font-medium text-green-800 mb-1">{key.replace('_', ' ').toUpperCase()}</h4>
                  <p className="text-green-700 text-sm mb-2">{technique.description}</p>
                  <p className="text-green-600 text-xs italic">{technique.when_to_use}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Prompt Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4 sticky top-6">
              <h2 className="font-medium text-amber-900 mb-4">Choose Your Reflection</h2>
              
              <div className="space-y-2 mb-4">
                {promptCategories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => handlePromptSelect(category.key)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.key
                        ? 'bg-amber-100 border-amber-300 border'
                        : 'bg-gray-50 hover:bg-amber-50 border border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{category.label}</div>
                    <div className="text-xs text-gray-600">{category.description}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleRandomPrompt}
                className="w-full p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
              >
                🎲 Random Gentle Prompt
              </button>

              {/* Current Prompt Display */}
              {currentPrompt && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-amber-600 font-medium">
                      {currentPrompt.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-amber-500">
                      {currentPrompt.timeEstimate}
                    </span>
                  </div>
                  <p className="text-amber-900 text-sm leading-relaxed">
                    {currentPrompt.prompt}
                  </p>
                  
                  {currentPrompt.supportingElements && (
                    <div className="mt-3 space-y-1">
                      {currentPrompt.supportingElements.breathingExercise && (
                        <p className="text-xs text-amber-700">
                          🫁 {currentPrompt.supportingElements.breathingExercise}
                        </p>
                      )}
                      {currentPrompt.supportingElements.grounding && (
                        <p className="text-xs text-amber-700">
                          🌱 {currentPrompt.supportingElements.grounding}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Journal Writing Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium text-amber-900">Your Reflection Space</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-amber-600">
                    {currentPrompt?.difficulty} difficulty
                  </span>
                  <button
                    onClick={handleSaveEntry}
                    disabled={!journalContent.trim() || isSaving}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      journalContent.trim() && !isSaving
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? 'Saving...' : 'Save Reflection'}
                  </button>
                </div>
              </div>

              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="Begin writing your reflection here... Let your thoughts flow freely without judgment."
                className="w-full h-96 p-4 border border-amber-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                style={{ 
                  fontFamily: 'Georgia, serif',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}
              />

              <div className="mt-4 flex justify-between items-center text-sm text-amber-600">
                <div>
                  No AI analysis • Completely private • Your authentic voice
                </div>
                <div>
                  {wordCount > 0 && `${wordCount} words • `}
                  {formatTime(timeSpent)}
                </div>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-medium text-amber-900 mb-2">💡 Writing Tips</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-amber-800">
                <div>• Let thoughts flow without editing</div>
                <div>• Trust whatever comes up</div>
                <div>• Take breaks if you feel overwhelmed</div>
                <div>• Honor your own pace and depth</div>
              </div>
            </div>

            {/* Safety Reminder */}
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">🛡️ Your Safety Matters</h3>
              <p className="text-green-800 text-sm">
                If you're experiencing thoughts of self-harm or crisis, please reach out for support:
              </p>
              <div className="mt-2 text-sm text-green-700">
                • Crisis Text Line: Text HOME to 741741
                • National Suicide Prevention Lifeline: 988
                • Or contact your local emergency services
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}