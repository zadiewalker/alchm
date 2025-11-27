/**
 * Sacred Journal Page - Jony Ive Design System
 * "Simplicity is not the absence of clutter, that's a consequence of simplicity.
 * Simplicity is somehow essentially describing the purpose and place of an object and product."
 * - Jonathan Ive
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SacredLayout, SacredNav } from '@/components/layout/SacredLayout';
import { MoodSelector } from '@/components/MoodSelector';

// Sacred Writing Interface - Focus on ONE thing: writing
function SacredWritingSpace() {
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [journalText]);

  // Sacred save function with gentle feedback
  const handleSacredSave = async () => {
    if (!journalText.trim()) return;
    
    setIsSaving(true);
    
    try {
      // Sacred breathing pause
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // TODO: Implement actual save logic
      console.log('Saving journal entry:', { journalText, selectedMood });
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="sacred-content sacred-content-narrow">
      {/* Sacred Mood Selection */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-large font-light text-sanctuary mb-4 text-center">
          How are you feeling?
        </h2>
        <MoodSelector
          selectedMood={selectedMood}
          onMoodSelect={setSelectedMood}
          size="large"
        />
      </motion.div>

      {/* Sacred Writing Canvas */}
      <motion.div
        className="alchm-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Share what's on your heart..."
            className="alchm-input alchm-textarea w-full border-none bg-transparent resize-none focus:outline-none"
            style={{
              minHeight: '300px',
              fontSize: '18px',
              lineHeight: '1.7',
              fontWeight: '300'
            }}
            autoFocus
            aria-label="Journal writing space"
          />
          
          {/* Sacred Word Count */}
          <div className="absolute bottom-4 right-4 text-sage-active/60 text-small">
            {journalText.split(/\s+/).filter(word => word.length > 0).length} words
          </div>
        </div>
      </motion.div>

      {/* Sacred Actions */}
      <motion.div
        className="mt-6 sanctuary-flex sanctuary-flex--center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.button
          onClick={handleSacredSave}
          disabled={!journalText.trim() || isSaving}
          className="alchm-button alchm-button--primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Save journal entry"
        >
          {isSaving ? (
            <div className="sanctuary-flex sanctuary-flex--center">
              <motion.div
                className="w-4 h-4 border-2 border-sanctuary/30 border-t-sanctuary rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Saving...
            </div>
          ) : (
            'Save Entry'
          )}
        </motion.button>
      </motion.div>

      {/* Sacred Save Confirmation */}
      <AnimatePresence>
        {lastSaved && (
          <motion.div
            className="mt-4 text-center text-sanctuary/70 text-small"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            Saved at {lastSaved.toLocaleTimeString()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sacred Insights Panel - Contextual wisdom, not distraction
function SacredInsights({ mood, text }: { mood: string; text: string }) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Generate insights only when user pauses writing
  useEffect(() => {
    if (!text.trim() || text.length < 50) return;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        // TODO: Implement actual insights generation
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInsights({
          reflection: "Your words show strength in vulnerability.",
          wisdom: "Every feeling deserves to be witnessed.",
          growth: "You're building emotional awareness through expression."
        });
      } catch (error) {
        console.error('Insights error:', error);
      } finally {
        setLoading(false);
      }
    }, 3000); // Wait 3 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [text, mood]);

  if (!insights && !loading) return null;

  return (
    <motion.div
      className="mt-8 alchm-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-medium font-light text-sage-active mb-4 text-center">
        Sacred Reflection
      </h3>
      
      {loading ? (
        <div className="text-center py-6">
          <motion.div
            className="w-6 h-6 border-2 border-sage-primary/30 border-t-sage-primary rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sage-active/70 text-small mt-2">
            Reflecting on your words...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sage-active/80 text-base font-light leading-relaxed">
            {insights.reflection}
          </div>
          <div className="text-sage-active/70 text-small italic">
            {insights.wisdom}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Main Sacred Journal Page
export default function SacredJournalPage() {
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');

  return (
    <SacredLayout variant="focus" showBackground={true}>
      {/* Sacred Navigation */}
      <SacredNav variant="full" showCrisisButton={true} />

      {/* Sacred Page Header */}
      <motion.div
        className="sacred-content text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-xlarge font-light text-sanctuary mb-2">
          Sacred Journal
        </h1>
        <p className="text-base text-sanctuary/80">
          A private space for your thoughts and feelings
        </p>
      </motion.div>

      {/* Sacred Writing Interface */}
      <SacredWritingSpace />

      {/* Sacred Insights - Appear contextually */}
      {(journalText.length > 50 || selectedMood) && (
        <div className="sacred-content sacred-content-narrow">
          <SacredInsights mood={selectedMood} text={journalText} />
        </div>
      )}
    </SacredLayout>
  );
}