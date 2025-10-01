'use client';

/**
 * CRISIS-CRITICAL: EMERGENCY JOURNAL PAGE
 * Ultra-lightweight emergency journaling for crisis situations
 * Bundle target: <200KB total - EVERY BYTE MATTERS
 * WORKS OFFLINE - NO FIREBASE REQUIRED INITIALLY
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// EMERGENCY: Minimal inline styles for ultra-fast loading
const emergencyStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: 'white',
    padding: '16px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    paddingBottom: '16px',
  },
  crisisButton: {
    position: 'fixed' as const,
    top: '16px',
    right: '16px',
    width: '60px',
    height: '60px',
    background: '#dc2626',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  textarea: {
    width: '100%',
    minHeight: '400px',
    padding: '20px',
    fontSize: '18px',
    lineHeight: '1.6',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    resize: 'vertical' as const,
    outline: 'none',
    backdropFilter: 'blur(10px)',
  },
  saveButton: {
    padding: '16px 32px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '8px',
    background: '#16a34a',
    color: 'white',
    cursor: 'pointer',
    marginTop: '16px',
    minHeight: '56px',
  },
  infoBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
};

export default function EmergencyJournalPage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // EMERGENCY: Auto-save to localStorage every 3 seconds
  useEffect(() => {
    const saveTimer = setInterval(() => {
      if (text.trim()) {
        const timestamp = new Date().toISOString();
        const entry = {
          text,
          timestamp,
          type: 'emergency',
          wordCount,
        };
        
        try {
          // Save to localStorage for offline access
          const existingEntries = JSON.parse(localStorage.getItem('alchm_emergency_entries') || '[]');
          existingEntries.unshift(entry);
          localStorage.setItem('alchm_emergency_entries', JSON.stringify(existingEntries.slice(0, 10))); // Keep only last 10
          setLastSaved(new Date());
        } catch (error) {
          console.warn('Emergency save failed:', error);
        }
      }
    }, 3000);

    return () => clearInterval(saveTimer);
  }, [text, wordCount]);

  // EMERGENCY: Count words
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [text]);

  // EMERGENCY: Auto-focus on load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSaveNow = async () => {
    setSaving(true);
    
    try {
      // EMERGENCY: Try to save to Firebase if available, but don't block
      const saveToFirebase = async () => {
        const { getFirebaseDb } = await import('@/lib/firebase');
        const { collection, addDoc } = await import('firebase/firestore');
        
        const db = await getFirebaseDb();
        await addDoc(collection(db, 'emergency_journals'), {
          text,
          timestamp: new Date(),
          type: 'emergency',
          wordCount,
          userAgent: navigator.userAgent,
        });
      };

      // Try Firebase save (non-blocking)
      saveToFirebase().catch(error => {
        console.warn('Firebase save failed, using offline storage:', error);
      });

      // Always save to localStorage
      const timestamp = new Date().toISOString();
      const entry = {
        text,
        timestamp,
        type: 'emergency',
        wordCount,
      };
      
      const existingEntries = JSON.parse(localStorage.getItem('alchm_emergency_entries') || '[]');
      existingEntries.unshift(entry);
      localStorage.setItem('alchm_emergency_entries', JSON.stringify(existingEntries.slice(0, 10)));
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Emergency save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCrisisCall = () => {
    window.location.href = 'tel:988';
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div style={emergencyStyles.container}>
      {/* Crisis Support Button */}
      <button
        onClick={handleCrisisCall}
        style={emergencyStyles.crisisButton}
        title="Call 988 Crisis Hotline"
      >
        🆘
      </button>

      {/* Header */}
      <div style={emergencyStyles.header}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌿</div>
        <h1 style={{ fontSize: '24px', fontWeight: '300', margin: 0, marginBottom: '8px' }}>
          Emergency Safe Space
        </h1>
        <p style={{ fontSize: '16px', margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
          This is your private, secure space. Nothing leaves this device until you choose to save.
        </p>
      </div>

      {/* Info Bar */}
      <div style={emergencyStyles.infoBar}>
        <span>{wordCount} words</span>
        <span>
          {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Auto-saving...'}
        </span>
      </div>

      {/* Journal Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Pour your heart out here. This space is yours. 

You're not alone. You're brave for being here.

Write whatever comes to mind - your feelings, your thoughts, your fears, your hopes. This is a judgment-free zone.

If you're in immediate danger, please call 988 (tap the red button above) or go to your nearest emergency room."
        style={emergencyStyles.textarea}
      />

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' as const }}>
        <button
          onClick={handleSaveNow}
          disabled={saving || !text.trim()}
          style={{
            ...emergencyStyles.saveButton,
            opacity: (saving || !text.trim()) ? 0.5 : 1,
            flex: 1,
          }}
        >
          {saving ? '💾 Saving...' : '💾 Save Now'}
        </button>
        
        <button
          onClick={handleLogin}
          style={{
            ...emergencyStyles.saveButton,
            background: '#6366f1',
            flex: 1,
          }}
        >
          🔐 Login to Full ALCHM
        </button>
      </div>

      {/* Emergency Resources */}
      <div style={{ 
        marginTop: '32px', 
        padding: '20px', 
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', margin: 0 }}>
          🆘 Emergency Resources
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a 
            href="tel:988"
            style={{
              display: 'block',
              padding: '12px 16px',
              background: '#dc2626',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '16px',
            }}
          >
            📞 Call 988 - Crisis Lifeline
          </a>
          <a 
            href="sms:741741"
            style={{
              display: 'block',
              padding: '12px 16px',
              background: '#0ea5e9',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '16px',
            }}
          >
            💬 Text HOME to 741741
          </a>
        </div>
      </div>

      {/* Privacy Notice */}
      <div style={{ 
        marginTop: '24px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        🔒 Your words are stored locally on your device. Nothing is uploaded without your explicit choice.
        This emergency page works completely offline for your privacy and safety.
      </div>
    </div>
  );
}