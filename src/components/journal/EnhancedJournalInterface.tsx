'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Save, Clock, TrendingUp, BookOpen } from 'lucide-react';
import { RealTimeAIInsights } from './RealTimeAIInsights';
import { SmartWritingPrompts } from './SmartWritingPrompts';
import { EmotionalVocabularyTracker } from './EmotionalVocabularyTracker';
import { CrisisDetectionIntegration } from './CrisisDetectionIntegration';
// EMERGENCY: Disabled for performance - import { analyzeWritingProgress } from '../../lib/journal/writing-analytics-engine';
import { useAuth } from '../../contexts/AuthContext';
import { debounce } from 'lodash';

interface JournalEntry {
  id?: string;
  content: string;
  mood?: string;
  timestamp: Date;
  emotionalVocabulary?: string[];
  aiInsights?: any[];
  progressMetrics?: any;
}

interface EnhancedJournalInterfaceProps {
  initialEntry?: JournalEntry;
  onSave?: (entry: JournalEntry) => Promise<void>;
  onAnalyze?: (content: string) => Promise<any>;
}

export const EnhancedJournalInterface: React.FC<EnhancedJournalInterfaceProps> = ({
  initialEntry,
  onSave,
  onAnalyze
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState(initialEntry?.content || '');
  const [mood, setMood] = useState(initialEntry?.mood || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAIInsights] = useState<any[]>([]);
  const [emotionalVocabulary, setEmotionalVocabulary] = useState<string[]>([]);
  const [writingProgress, setWritingProgress] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce(async (entryContent: string) => {
      if (!entryContent.trim() || !onSave) return;
      
      setSaveStatus('saving');
      try {
        const entry: JournalEntry = {
          id: initialEntry?.id,
          content: entryContent,
          mood,
          timestamp: new Date(),
          emotionalVocabulary,
          aiInsights,
          progressMetrics: writingProgress
        };
        
        await onSave(entry);
        setSaveStatus('saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('unsaved');
      }
    }, 2000),
    [onSave, mood, emotionalVocabulary, aiInsights, writingProgress, initialEntry?.id]
  );

  // Content change handler
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(newContent.trim().split(/\s+/).filter(word => word.length > 0).length);
    setSaveStatus('unsaved');
    
    // Trigger auto-save
    debouncedSave(newContent);
    
    // Analyze content for AI insights
    if (newContent.length > 50 && onAnalyze) {
      onAnalyze(newContent).then(insights => {
        setAIInsights(insights || []);
      });
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Analyze writing progress
  useEffect(() => {
    if (content.length > 100) {
      // EMERGENCY: Disabled for performance - const progress = analyzeWritingProgress(content, mood);
      const progress = { score: 0.5, insights: [], metadata: {} }; // Temporary placeholder
      setWritingProgress(progress);
    }
  }, [content, mood]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getSaveStatusMessage = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Thoughts safely preserving...';
      case 'saved':
        return 'Thoughts safely preserved ✨';
      case 'unsaved':
        return 'Thoughts ready to preserve...';
      default:
        return '';
    }
  };

  const containerClasses = isFullscreen 
    ? 'fixed inset-0 z-50 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900'
    : 'w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900';

  return (
    <div className={containerClasses}>
      {/* Crisis Detection - Always Active */}
      <CrisisDetectionIntegration content={content} />
      
      {/* Main Writing Interface */}
      <div className="relative h-full flex flex-col">
        {/* Header with minimal chrome */}
        <motion.header 
          className="flex items-center justify-between p-4 border-b border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400"
              whileHover={{ scale: 1.05 }}
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">Sacred Writing Space</span>
            </motion.div>
            
            {/* Save Status */}
            <motion.div 
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Clock className="w-4 h-4" />
              <span>{getSaveStatusMessage()}</span>
              {saveStatus === 'saving' && (
                <motion.div 
                  className="flex space-x-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="w-1 h-1 bg-indigo-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="w-1 h-1 bg-indigo-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-1 h-1 bg-indigo-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Stats Display */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <BookOpen className="w-4 h-4" />
              <span>{wordCount} words</span>
            </div>
            {emotionalVocabulary.length > 0 && (
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                <TrendingUp className="w-4 h-4" />
                <span>{emotionalVocabulary.length} emotional insights</span>
              </div>
            )}
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Writing Canvas */}
          <div className="flex-1 relative">
            <motion.div
              className="h-full p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="Your thoughts are welcome here... Let your authentic voice emerge onto this sacred digital canvas."
                className="w-full h-full min-h-[600px] p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl shadow-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-light transition-all duration-300"
                style={{ 
                  fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                  lineHeight: '1.8'
                }}
              />
            </motion.div>

            {/* Floating Action Button */}
            <motion.div
              className="fixed bottom-8 right-8 z-40"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <motion.button
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5" />
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">AI Insights</span>
              </motion.button>
            </motion.div>
          </div>

          {/* AI Insights Sidebar */}
          <AnimatePresence>
            {showAIInsights && (
              <motion.div
                className="w-96 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-l border-white/20 dark:border-gray-700/20 p-6 overflow-y-auto"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 384, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <span>Writing Insights</span>
                  </h3>

                  {/* Real-Time AI Insights */}
                  <RealTimeAIInsights 
                    content={content}
                    mood={mood}
                    insights={aiInsights}
                  />

                  {/* Smart Writing Prompts */}
                  <SmartWritingPrompts 
                    mood={mood}
                    recentEntries={[]}
                    onPromptSelect={(prompt) => {
                      setContent(prev => prev + '\n\n' + prompt);
                    }}
                  />

                  {/* Emotional Vocabulary Tracker */}
                  <EmotionalVocabularyTracker 
                    content={content}
                    onVocabularyUpdate={setEmotionalVocabulary}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJournalInterface;