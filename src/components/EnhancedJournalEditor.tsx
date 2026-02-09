'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useData } from '@/hooks/useData';
import { crisisDetection } from '@/lib/crisisDetection';

interface CrisisAlert {
  level: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  indicators: string[];
  recommendations: string[];
  showSafetyPrompt: boolean;
}

export default function EnhancedJournalEditor({
  onSave,
  initialContent = '',
  className = ''
}: {
  onSave: (entry: any) => void;
  initialContent?: string;
  className?: string;
}) {
  const { user } = useAuth();
  const { saveDreamEntry, getJournalEntries } = useData();
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<number>(5);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState<CrisisAlert | null>(null);
  const [showCrisisIntervention, setShowCrisisIntervention] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time crisis monitoring
  useEffect(() => {
    if (content.length > 50) { // Only analyze substantial content
      // Debounce analysis to avoid excessive processing
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        analyzeCrisisRisk();
      }, 2000);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, mood]);

  const analyzeCrisisRisk = async () => {
    try {
      // Get recent journal entries for context
      const recentEntries = await getJournalEntries(10);
      
      // Analyze current content
      const indicators = crisisDetection.analyzeJournalEntry(content, mood, emotions);
      
      // Analyze pattern with recent history
      const pattern = crisisDetection.analyzeCrisisPattern([
        { content, mood, createdAt: new Date(), emotions },
        ...recentEntries
      ]);

      // Check if intervention should be triggered
      const shouldIntervene = crisisDetection.shouldTriggerIntervention(indicators);

      if (indicators.overallRisk !== 'low' || shouldIntervene) {
        const alert: CrisisAlert = {
          level: indicators.overallRisk,
          confidence: indicators.confidence,
          indicators: extractIndicatorMessages(indicators),
          recommendations: pattern.recommendations,
          showSafetyPrompt: shouldIntervene
        };

        setCrisisAlert(alert);

        // Log crisis detection for monitoring (anonymized)
        logCrisisDetection(indicators, pattern);

        // Auto-trigger intervention for critical cases
        if (shouldIntervene) {
          setShowCrisisIntervention(true);
        }
      } else {
        setCrisisAlert(null);
      }
    } catch (error) {
      console.error('Error analyzing crisis risk:', error);
    }
  };

  const extractIndicatorMessages = (indicators: any): string[] => {
    const messages: string[] = [];
    
    if (indicators.suicidalIdeation > 0.3) {
      messages.push('Signs of suicidal thoughts detected');
    }
    if (indicators.hopelessness > 0.4) {
      messages.push('Expressions of hopelessness identified');
    }
    if (indicators.socialIsolation > 0.5) {
      messages.push('Indicators of social isolation');
    }
    if (indicators.substanceUse > 0.3) {
      messages.push('Substance use concerns mentioned');
    }
    if (indicators.sleepDisruption > 0.4) {
      messages.push('Sleep pattern disruption noted');
    }
    if (indicators.emotionalVolatility > 0.4) {
      messages.push('Emotional instability indicators');
    }

    return messages;
  };

  const logCrisisDetection = (indicators: any, pattern: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: user?.uid ? 'user_' + btoa(user.uid).slice(0, 8) : 'anonymous',
      riskLevel: indicators.overallRisk,
      confidence: indicators.confidence,
      patternType: pattern.type,
      interventionTriggered: crisisDetection.shouldTriggerIntervention(indicators)
    };

    // Store in local storage for monitoring
    const existingLogs = JSON.parse(localStorage.getItem('crisis_detection_logs') || '[]');
    existingLogs.push(logEntry);
    // Keep only last 100 entries
    const recentLogs = existingLogs.slice(-100);
    localStorage.setItem('crisis_detection_logs', JSON.stringify(recentLogs));
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      const entry = {
        content: content.trim(),
        mood,
        emotions,
        tags,
        isPrivate,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Perform final crisis analysis before saving
      await analyzeCrisisRisk();

      onSave(entry);
      
      // Reset form
      setContent('');
      setMood(5);
      setEmotions([]);
      setTags([]);
      setCrisisAlert(null);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const dismissCrisisAlert = () => {
    setCrisisAlert(null);
    setShowCrisisIntervention(false);
  };

  const seekImmediateHelp = () => {
    // Redirect to crisis support
    window.open('tel:988', '_self');
  };

  const openSafetyResources = () => {
    window.open('/crisis-support', '_blank');
  };

  const emotionOptions = [
    'happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'frustrated',
    'hopeful', 'lonely', 'grateful', 'worried', 'peaceful', 'overwhelmed',
    'content', 'confused', 'motivated', 'tired', 'stressed', 'relaxed'
  ];

  const addEmotion = (emotion: string) => {
    if (!emotions.includes(emotion)) {
      setEmotions(prev => [...prev, emotion]);
    }
  };

  const removeEmotion = (emotion: string) => {
    setEmotions(prev => prev.filter(e => e !== emotion));
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-[#E5C97D] bg-[#E5C97D]/10';
      case 'moderate': return 'border-[#E5C97D] bg-[#E5C97D]/10';
      case 'low': return 'border-[#8B9A7C] bg-[#8B9A7C]/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className={`enhanced-journal-editor ${className}`}>
      {/* Crisis Alert */}
      {crisisAlert && (
        <div className={`border-2 rounded-2xl p-6 mb-6 ${getRiskColor(crisisAlert.level)}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-white font-medium text-lg">
                🚨 Mental Health Alert - {crisisAlert.level.charAt(0).toUpperCase() + crisisAlert.level.slice(1)} Risk
              </h3>
              <p className="text-white/70 text-sm">
                Confidence: {Math.round((crisisAlert.confidence || 0) * 100)}%
              </p>
            </div>
            <button
              onClick={dismissCrisisAlert}
              className="text-white/60 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          {crisisAlert.indicators.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white/80 font-medium mb-2">Indicators Detected:</h4>
              <ul className="space-y-1">
                {crisisAlert.indicators.map((indicator, index) => (
                  <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="text-[#E5C97D] mt-1">⚠</span>
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {crisisAlert.showSafetyPrompt && (
              <>
                <button
                  onClick={seekImmediateHelp}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🚨 Get Immediate Help
                </button>
                <button
                  onClick={openSafetyResources}
                  className="bg-[#E5C97D] hover:bg-[#F2D99D] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🛡️ Open Safety Resources
                </button>
              </>
            )}
            <button
              onClick={() => window.open('/crisis-support', '_blank')}
              className="bg-[#8B9A7C] hover:bg-[#A8B5A0] text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              💙 View Support Options
            </button>
          </div>

          {crisisAlert.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <h4 className="text-white/80 font-medium mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {crisisAlert.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="text-white/60 text-sm flex items-start gap-2">
                    <span className="text-[#8B9A7C] mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Journal Entry Form */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-white text-lg font-light mb-4">
          📝 Journal Entry
          {crisisAlert && (
            <span className="ml-2 text-sm text-[#E5C97D]">
              (Mental health monitoring active)
            </span>
          )}
        </h3>

        <div className="space-y-6">
          {/* Mood Slider */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              How are you feeling today? ({mood}/10)
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMood(isNaN(value) ? 5 : value);
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>Very Low</span>
                <span>Neutral</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write about your thoughts, feelings, experiences... This is your safe space."
              className="w-full h-48 bg-black/30 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#8B9A7C]/50 leading-relaxed"
              rows={8}
            />
            <div className="text-right text-xs text-white/50 mt-1">
              {content.length} characters
              {crisisAlert && (
                <span className="ml-2 text-[#E5C97D]">• Risk analysis active</span>
              )}
            </div>
          </div>

          {/* Emotions */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              What emotions are you experiencing?
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
              {emotionOptions.map(emotion => (
                <button
                  key={emotion}
                  onClick={() => addEmotion(emotion)}
                  className={`px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                    emotions.includes(emotion)
                      ? 'bg-[#8B9A7C]/40 text-[#A8B5A0] border border-[#8B9A7C]/40'
                      : 'bg-gray-700/40 text-gray-300 hover:bg-gray-600/40 border border-gray-500/20'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>

            {/* Selected Emotions */}
            {emotions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {emotions.map(emotion => (
                  <div
                    key={emotion}
                    className="bg-[#8B9A7C]/30 text-[#A8B5A0] px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-[#8B9A7C]/30"
                  >
                    {emotion}
                    <button
                      onClick={() => removeEmotion(emotion)}
                      className="text-[#A8B5A0] hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isPrivate" className="text-white/80 text-sm">
              Keep this entry private (won't be included in insights)
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!content.trim() || isSaving}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
              content.trim() && !isSaving
                ? 'bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 text-white border border-[#8B9A7C]/30'
                : 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-500/20'
            }`}
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#A8B5A0] border-t-transparent rounded-full animate-spin"></div>
                Saving entry...
              </div>
            ) : (
              'Save Entry'
            )}
          </button>
        </div>
      </div>

      {/* Crisis Intervention Modal */}
      {showCrisisIntervention && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-red-900/20 border-2 border-red-500/50 backdrop-blur-md rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-white text-xl font-medium mb-4">
                Crisis Support Detected
              </h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Our AI has detected signs that you may be experiencing a mental health crisis. 
                Your safety and well-being are our top priority. Please consider reaching out for support.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={seekImmediateHelp}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  📞 Call Crisis Support Now (988)
                </button>
                
                <button
                  onClick={openSafetyResources}
                  className="w-full bg-[#E5C97D] hover:bg-[#F2D99D] text-white py-3 rounded-lg font-medium transition-colors"
                >
                  🛡️ View Safety Resources
                </button>
                
                <button
                  onClick={() => setShowCrisisIntervention(false)}
                  className="w-full bg-gray-600/30 border border-gray-500/30 text-white py-2 rounded-lg transition-colors"
                >
                  Continue Writing
                </button>
              </div>

              <p className="text-white/50 text-xs mt-4">
                This detection is confidential and designed to help keep you safe
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}