'use client';

// CRISIS-CRITICAL: Ultra-lightweight journal for emergency situations
// Target: <8KB bundle size for immediate crisis access
// No external dependencies beyond React, local storage for offline

import { useState, useEffect, useRef } from 'react';

interface EmergencyJournalProps {
  onCrisisDetected?: (text: string, severity: 'low' | 'medium' | 'high') => void;
  crisisMode?: boolean;
  initialText?: string;
}

// Simple crisis detection patterns - lightweight version
const CRISIS_PATTERNS = [
  { pattern: /\b(kill myself|suicide|end it all|not worth living)\b/i, severity: 'high' as const },
  { pattern: /\b(hurt myself|self harm|cut myself|want to die)\b/i, severity: 'high' as const },
  { pattern: /\b(hopeless|worthless|can't go on|give up)\b/i, severity: 'medium' as const },
  { pattern: /\b(depressed|anxious|scared|overwhelmed)\b/i, severity: 'low' as const }
];

export default function EmergencyJournal({ 
  onCrisisDetected, 
  crisisMode = false,
  initialText = ''
}: EmergencyJournalProps) {
  const [text, setText] = useState(initialText);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-save to localStorage
  const saveToLocal = (content: string) => {
    try {
      const saveData = {
        content,
        timestamp: new Date().toISOString(),
        wordCount: content.trim().split(/\s+/).filter(w => w.length > 0).length
      };
      localStorage.setItem('emergency_journal', JSON.stringify(saveData));
      setLastSaved(new Date());
    } catch (error) {
      console.warn('Failed to save to local storage:', error);
    }
  };

  // Crisis detection
  const checkForCrisis = (content: string) => {
    if (content.length < 10) return;
    
    for (const { pattern, severity } of CRISIS_PATTERNS) {
      if (pattern.test(content)) {
        onCrisisDetected?.(content, severity);
        if (severity === 'high') {
          setShowCrisisSupport(true);
        }
        break;
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Update word count
    const words = newText.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
    
    // Debounced save and crisis detection
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveToLocal(newText);
      checkForCrisis(newText);
    }, 1000);
  };

  // Load saved content on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('emergency_journal');
      if (saved && !initialText) {
        const data = JSON.parse(saved);
        setText(data.content || '');
        setWordCount(data.wordCount || 0);
        setLastSaved(new Date(data.timestamp));
      }
    } catch (error) {
      console.warn('Failed to load saved journal:', error);
    }
  }, [initialText]);

  // Auto-focus in crisis mode
  useEffect(() => {
    if (crisisMode && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [crisisMode]);

  const clearJournal = () => {
    if (confirm('Clear all text? This cannot be undone.')) {
      setText('');
      setWordCount(0);
      localStorage.removeItem('emergency_journal');
      setLastSaved(null);
    }
  };

  const exportText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      {/* Emergency Crisis Support Modal */}
      {showCrisisSupport && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🆘</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Support is Available
              </h3>
              <p className="text-gray-700 mb-6">
                You don't have to face this alone. Help is available right now.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.open('tel:988', '_self')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-medium"
                >
                  📞 Call 988 Crisis Line
                </button>
                
                <button
                  onClick={() => window.open('sms:741741', '_self')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium"
                >
                  💬 Text Crisis Line (741741)
                </button>
                
                <button
                  onClick={() => setShowCrisisSupport(false)}
                  className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg"
                >
                  Continue Writing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">
              {crisisMode ? '🆘 Crisis Support Journal' : '📝 Emergency Journal'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isOffline ? '📡 Offline - Auto-saving locally' : '💾 Auto-saving'}
              {lastSaved && ` • Last saved ${lastSaved.toLocaleTimeString()}`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {wordCount > 0 && (
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                {wordCount} words
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Journal Text Area */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder={crisisMode 
              ? "You're safe here. Write whatever you're feeling right now. Every word matters, and you matter."
              : "What's on your mind today? This is your safe space to express anything..."
            }
            className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '16px',
              lineHeight: '1.6'
            }}
          />
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              {text.length > 0 && (
                <>
                  <button
                    onClick={exportText}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    📄 Export
                  </button>
                  
                  <button
                    onClick={clearJournal}
                    className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    🗑️ Clear
                  </button>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => window.open('tel:988', '_self')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
              >
                🆘 Crisis Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-6 text-center">
        <p className="text-xs text-gray-500">
          Your words are private and secure. Crisis support is available 24/7.
        </p>
      </div>
    </div>
  );
}