'use client';

import React, { useState, useCallback } from 'react';
import { EmotionalAlchemyOutputType } from '@/ai/flows/emotional-alchemy';

interface EmotionalAlchemyProps {
  entryId?: string;
  onInsightGenerated?: (insight: EmotionalAlchemyOutputType) => void;
}

interface MoodSelectorProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ value, onChange, label }) => {
  const moods = [
    { value: 1, emoji: '😰', label: 'Terrible' },
    { value: 2, emoji: '😢', label: 'Bad' },
    { value: 3, emoji: '😕', label: 'Poor' },
    { value: 4, emoji: '😐', label: 'Okay' },
    { value: 5, emoji: '🙂', label: 'Fine' },
    { value: 6, emoji: '😊', label: 'Good' },
    { value: 7, emoji: '😃', label: 'Great' },
    { value: 8, emoji: '😄', label: 'Excellent' },
    { value: 9, emoji: '🤩', label: 'Amazing' },
    { value: 10, emoji: '🥳', label: 'Incredible' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="grid grid-cols-5 gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={`p-3 rounded-lg border-2 transition-all ${
              value === mood.value
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl">{mood.emoji}</div>
            <div className="text-xs text-gray-600 mt-1">{mood.value}</div>
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-sm text-gray-600 text-center">
          {moods.find(m => m.value === value)?.label}
        </p>
      )}
    </div>
  );
};

const CelebrationAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-pink-100 opacity-30 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-6xl animate-bounce">🎉</div>
      </div>
      <div className="absolute top-1/4 left-1/4 transform animate-ping">
        <div className="text-3xl">✨</div>
      </div>
      <div className="absolute top-3/4 right-1/4 transform animate-ping delay-100">
        <div className="text-3xl">🌟</div>
      </div>
    </div>
  );
};

const EmotionalAlchemy: React.FC<EmotionalAlchemyProps> = ({ 
  entryId, 
  onInsightGenerated 
}) => {
  const [journalText, setJournalText] = useState('');
  const [beforeMood, setBeforeMood] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [insight, setInsight] = useState<EmotionalAlchemyOutputType | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processEmotionalAlchemy = useCallback(async () => {
    if (!journalText.trim() || journalText.trim().length < 10) {
      setError('Please write at least 10 characters to get insights');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/emotional-alchemy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: journalText,
          beforeMood,
          entryId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process emotional alchemy');
      }

      const result: EmotionalAlchemyOutputType = await response.json();
      setInsight(result);
      onInsightGenerated?.(result);

      // Trigger celebration animation if breakthrough detected
      if (result.celebrationTriggered) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

    } catch (error) {
      console.error('Error processing emotional alchemy:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [journalText, beforeMood, entryId, onInsightGenerated]);

  const resetForm = () => {
    setJournalText('');
    setBeforeMood(5);
    setInsight(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {showCelebration && <CelebrationAnimation />}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-medium text-gray-900 mb-6">
          Emotional Alchemy ✨
        </h2>
        
        {/* Mood Before Writing */}
        <div className="mb-6">
          <MoodSelector
            value={beforeMood}
            onChange={setBeforeMood}
            label="How are you feeling right now?"
          />
        </div>

        {/* Journal Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's on your mind? Share whatever feels important today.
          </label>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Write freely about your thoughts, feelings, experiences, or anything that's meaningful to you today. There's no right or wrong way to do this..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={8}
            disabled={isProcessing}
          />
          <div className="text-sm text-gray-500 mt-1">
            {journalText.length}/10 characters minimum
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={processEmotionalAlchemy}
            disabled={isProcessing || journalText.trim().length < 10}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing your thoughts...
              </div>
            ) : (
              'Transform into Insight'
            )}
          </button>
          
          {insight && (
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              New Entry
            </button>
          )}
        </div>
      </div>

      {/* Insight Display */}
      {insight && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Your Insight
            </h3>
            {insight.celebrationTriggered && (
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                🎉 Breakthrough Detected!
              </div>
            )}
          </div>

          {/* AI Reflection */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <h4 className="font-medium text-gray-900 mb-2">Reflection</h4>
            <p className="text-gray-700 leading-relaxed">{insight.reflection}</p>
          </div>

          {/* Mood Prediction */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Emotional Shift</h4>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl mb-1">😐</div>
                <div className="text-sm text-gray-600">Before</div>
                <div className="font-medium">{beforeMood}/10</div>
              </div>
              <div className="flex-1 bg-gradient-to-r from-gray-200 to-green-200 h-2 rounded-full relative">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(insight.moodPrediction / 10) * 100}%` }}
                />
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {insight.moodPrediction >= 7 ? '😊' : insight.moodPrediction >= 5 ? '🙂' : '😐'}
                </div>
                <div className="text-sm text-gray-600">Predicted</div>
                <div className="font-medium">{insight.moodPrediction}/10</div>
              </div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              Confidence: {Math.round(insight.confidenceScore * 100)}%
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Suggested Actions</h4>
            <div className="grid gap-2">
              {insight.suggestedActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Tags */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Emotional Themes</h4>
            <div className="flex flex-wrap gap-2">
              {insight.emotionalTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Deeper Insights</h4>
            
            {insight.insights.patterns.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Patterns</h5>
                <ul className="space-y-1">
                  {insight.insights.patterns.map((pattern, index) => (
                    <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insight.insights.growth && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="text-sm font-medium text-green-800 mb-1">Growth Insight</h5>
                <p className="text-green-700 text-sm">{insight.insights.growth}</p>
              </div>
            )}

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="text-sm font-medium text-yellow-800 mb-1">Affirmation</h5>
              <p className="text-yellow-700 text-sm italic">{insight.insights.affirmation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionalAlchemy;