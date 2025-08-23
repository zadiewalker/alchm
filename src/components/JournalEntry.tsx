// Server-First Journal Entry Component - Tier-Based Features
// Hypergrowth-ready journaling interface with trauma-informed AI integration

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Heart, 
  Save, 
  Sparkles, 
  Shield, 
  TrendingUp,
  Moon,
  Sun,
  Lock,
  Unlock,
  Target,
  Timer,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, JournalEntry as JournalEntryType } from '@/types/firestore-schema';
import { useJournals } from '@/lib/useJournals';
import { MoodSelector } from './MoodSelector';
import { AIInsightPanel } from './AIInsightPanel';
import { TierFeatureGate } from './TierFeatureGate';

interface JournalEntryProps {
  user: UserProfile;
  initialEntry?: JournalEntryType;
  onSave?: (entry: JournalEntryType) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit' | 'view';
}

export default function JournalEntryComponent({ 
  user, 
  initialEntry, 
  onSave, 
  onCancel,
  mode = 'create' 
}: JournalEntryProps) {
  const [text, setText] = useState(initialEntry?.text || '');
  const [moodBefore, setMoodBefore] = useState(initialEntry?.moodBefore || 5);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [currentAIInsight, setCurrentAIInsight] = useState<any>(null);
  const [startTime] = useState(new Date());
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { saveEntry, getAIInsight } = useJournals();

  // Update word count as user types
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [text]);

  // Auto-save functionality for premium users
  useEffect(() => {
    if (autoSaveEnabled && text.length > 50 && (user.tier === 'deep-cut' || user.tier === 'oracle')) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(async () => {
        await handleAutoSave();
      }, 3000); // Auto-save after 3 seconds of inactivity
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [text, moodBefore, autoSaveEnabled, user.tier]);

  // Focus management for better UX
  useEffect(() => {
    if (mode === 'create' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode]);

  const handleAutoSave = async () => {
    if (text.length < 10) return;
    
    try {
      const entry: Partial<JournalEntryType> = {
        id: initialEntry?.id || `temp_${Date.now()}`,
        userId: user.id,
        text,
        wordCount,
        moodBefore,
        aiProcessed: false,
        hasAdvancedAnalytics: user.tier === 'deep-cut' || user.tier === 'oracle',
        includeInPatternAnalysis: user.tier === 'deep-cut' || user.tier === 'oracle',
        archived: false,
        createdAt: initialEntry?.createdAt || new Date() as any,
        updatedAt: new Date() as any
      };

      await saveEntry(entry as JournalEntryType);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleSave = async () => {
    if (text.length < 10) {
      alert('Please write at least 10 characters before saving.');
      return;
    }

    setIsSaving(true);
    
    try {
      const entry: JournalEntryType = {
        id: initialEntry?.id || `entry_${Date.now()}_${user.id}`,
        userId: user.id,
        text,
        wordCount,
        moodBefore,
        aiProcessed: false,
        hasAdvancedAnalytics: user.tier === 'deep-cut' || user.tier === 'oracle',
        includeInPatternAnalysis: user.tier === 'deep-cut' || user.tier === 'oracle',
        archived: false,
        emotionalTags: [],
        keyTopics: [],
        riskIndicators: [],
        createdAt: initialEntry?.createdAt || new Date() as any,
        updatedAt: new Date() as any
      };

      // Set TTL for free tier users
      if (user.tier === 'free') {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        entry.expiresAt = expiryDate as any;
      }

      await saveEntry(entry);
      
      // Trigger AI processing for insights
      if (user.tier !== 'free') {
        setAiProcessing(true);
        try {
          const aiInsight = await getAIInsight(entry.id);
          setCurrentAIInsight(aiInsight);
          setShowAIInsights(true);
        } catch (error) {
          console.error('AI processing failed:', error);
        } finally {
          setAiProcessing(false);
        }
      }

      onSave?.(entry);
      
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getWritingTimeMinutes = () => {
    return Math.round((new Date().getTime() - startTime.getTime()) / 60000);
  };

  const getEntryQualityScore = () => {
    let score = 0;
    
    // Word count scoring
    if (wordCount >= 100) score += 30;
    else if (wordCount >= 50) score += 20;
    else if (wordCount >= 20) score += 10;
    
    // Emotional depth indicators
    const emotionalWords = ['feel', 'feeling', 'emotion', 'grateful', 'worried', 'excited', 'sad', 'happy', 'angry'];
    const emotionalCount = emotionalWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    score += Math.min(emotionalCount * 10, 30);
    
    // Reflection indicators
    const reflectionWords = ['realize', 'understand', 'learn', 'notice', 'discover', 'think', 'believe'];
    const reflectionCount = reflectionWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    score += Math.min(reflectionCount * 15, 25);
    
    // Mood awareness
    if (moodBefore !== 5) score += 15; // Non-neutral mood shows awareness
    
    return Math.min(score, 100);
  };

  const getTierBenefits = () => {
    switch (user.tier) {
      case 'oracle':
        return [
          'AI Mentor conversations',
          'Unlimited storage',
          'Advanced pattern analysis',
          'Inner circle sharing',
          'Executive coaching',
          'Priority AI processing'
        ];
      case 'deep-cut':
        return [
          'Pattern analysis',
          'Unlimited storage',
          'Export capabilities',
          'Advanced insights',
          'Auto-save'
        ];
      default:
        return [
          '30-day entry storage',
          'Basic AI insights',
          'Mood tracking'
        ];
    }
  };

  return (
    <main className="max-w-4xl mx-auto space-y-6" aria-label="Journal Entry Section">
      {/* Header with tier information */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-purple-400" />
              {mode === 'create' ? 'New Journal Entry' : mode === 'edit' ? 'Edit Entry' : 'View Entry'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`${
                  user.tier === 'oracle' ? 'border-gold-400 text-gold-300' :
                  user.tier === 'deep-cut' ? 'border-purple-400 text-purple-300' :
                  'border-gray-400 text-gray-300'
                }`}
              >
                {user.tier.charAt(0).toUpperCase() + user.tier.slice(1).replace('-', ' ')} Tier
              </Badge>
              {autoSaveEnabled && (user.tier === 'deep-cut' || user.tier === 'oracle') && (
                <Badge variant="outline" className="border-green-400 text-green-300">
                  <Save className="h-3 w-3 mr-1" />
                  Auto-save
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main writing area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mood selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                How are you feeling right now?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MoodSelector 
                value={moodBefore} 
                onChange={setMoodBefore}
                disabled={mode === 'view'}
              />
            </CardContent>
          </Card>

          {/* Writing area */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your thoughts...</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{wordCount} words</span>
                  <span>{getWritingTimeMinutes()} min</span>
                  {getEntryQualityScore() > 0 && (
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                      {getEntryQualityScore()}% depth
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Begin writing your thoughts... ${
                  user.tier === 'free' 
                    ? '(This entry will be stored for 30 days)' 
                    : ''
                }`}
                className="min-h-[300px] resize-none border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                disabled={mode === 'view'}
              />
              
              {/* Writing prompts for Oracle tier */}
              <TierFeatureGate userTier={user.tier} requiredTier="oracle">
                <div className="mt-4 p-3 bg-gradient-to-r from-gold-900/20 to-amber-900/20 border border-gold-500/30 rounded-lg">
                  <p className="text-sm text-gold-300 mb-2">✨ Oracle Tier Writing Prompts:</p>
                  <div className="text-xs text-gold-200/80 space-y-1">
                    <p>• What leadership challenge am I facing, and how does it reflect my growth?</p>
                    <p>• How did my decisions today align with my core values?</p>
                    <p>• What patterns am I noticing in my professional relationships?</p>
                  </div>
                </div>
              </TierFeatureGate>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsPrivate(!isPrivate)}
                variant="outline"
                size="sm"
                className="border-gray-600"
              >
                {isPrivate ? <Lock className="h-4 w-4 mr-1" /> : <Unlock className="h-4 w-4 mr-1" />}
                {isPrivate ? 'Private' : 'Shareable'}
              </Button>
              
              <TierFeatureGate userTier={user.tier} requiredTier="deep-cut">
                <Button
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600"
                >
                  <Timer className="h-4 w-4 mr-1" />
                  Auto-save: {autoSaveEnabled ? 'On' : 'Off'}
                </Button>
              </TierFeatureGate>
            </div>

            <div className="flex items-center gap-2">
              {onCancel && (
                <Button 
                  onClick={onCancel} 
                  variant="outline"
                  className="border-gray-600"
                >
                  Cancel
                </Button>
              )}
              <Button 
                onClick={handleSave} 
                disabled={isSaving || text.length < 10}
                className="bg-purple-600 hover:bg-purple-700"
                aria-label="Save Journal Entry"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Tier benefits */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                Your {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getTierBenefits().map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {user.tier === 'free' && (
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg">
                  <p className="text-sm text-purple-300 mb-2">Upgrade for more features:</p>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    Upgrade to Deep Cut
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Processing status */}
          {aiProcessing && (
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-blue-300">AI is analyzing your entry...</p>
                  <p className="text-xs text-blue-200/60 mt-1">Generating trauma-informed insights</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Crisis support */}
          {moodBefore <= 3 && (
            <Card className="bg-red-900/20 border-red-500/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-300 mb-2">We're here for you</p>
                  <p className="text-xs text-red-200/80 mb-3">
                    If you're in crisis, please reach out for support.
                  </p>
                  <Button size="sm" variant="outline" className="border-red-400 text-red-300 hover:bg-red-900/20">
                    Crisis Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily streak */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{user.currentStreak} days</p>
                <p className="text-sm text-gray-400">Current streak</p>
                <p className="text-xs text-gray-500 mt-1">
                  Best: {user.longestStreak} days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Time of day insights */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                {new Date().getHours() < 12 ? (
                  <Sun className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                ) : (
                  <Moon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                )}
                <p className="text-sm text-gray-300">
                  {new Date().getHours() < 12 
                    ? 'Good morning! Morning journaling helps set intentions for the day.'
                    : new Date().getHours() < 17
                    ? 'Afternoon reflection can help process the day so far.'
                    : 'Evening journaling is perfect for processing and gratitude.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights Panel */}
      {showAIInsights && currentAIInsight && (
        <AIInsightPanel 
          insight={currentAIInsight}
          userTier={user.tier}
          onClose={() => setShowAIInsights(false)}
        />
      )}
    </div>
  );
}