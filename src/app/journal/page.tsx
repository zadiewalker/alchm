'use client';
import { useEffect, useState } from 'react';
import { onAuthChanged } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { User } from 'firebase/auth';
import { analyzeJournalEntry, checkApiHealth } from '../../lib/api/aiAnalysisApi';

interface JournalEntry {
  id: string;
  content: string;
  createdAt: any;
  userId: string;
  aiAnalysis?: {
    id: string;
    analyzedAt: any;
    hasAnalysis: boolean;
  };
}

interface AIAnalysis {
  analysis: {
    emotionalRecognition: string;
    strengthIdentification: string;
    gentleInsight: string;
    nurturingSuggestion: string;
  };
  emotionalThemes: {
    primaryEmotions: string[];
    emotionalJourney: string;
    copingStrategies: string[] | null;
    growthIndicators: string[] | null;
    supportiveNote: string;
  };
  wisdomReflection: string;
  crisisAssessment: {
    isCrisis: boolean;
    confidenceLevel: 'low' | 'medium' | 'high';
    reasoning: string;
    suggestedResources: string[] | null;
  };
  isDemo?: boolean;
}

export default function JournalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'journal-entries'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const entriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JournalEntry[];
        setEntries(entriesData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Check API availability on component mount
  useEffect(() => {
    checkApiHealth().then(setApiAvailable);
  }, []);

  const handleSave = async () => {
    if (!user || !content.trim()) return;
    
    setSaving(true);
    let newEntryId = '';
    
    try {
      // Save journal entry
      const docRef = await addDoc(collection(db, 'journal-entries'), {
        content: content.trim(),
        userId: user.uid,
        createdAt: new Date(),
        userEmail: user.email
      });
      newEntryId = docRef.id;
      
      const journalContent = content.trim();
      setContent('');
      setSaving(false);
      
      console.log('Journal entry saved successfully for user:', user.uid);
      
      // Start AI analysis
      setAnalyzing(true);
      
      try {
        const analysis = await analyzeJournalEntry(journalContent, user.uid, newEntryId);
        
        // Convert the analysis to match the component's expected format
        const formattedAnalysis: AIAnalysis = {
          analysis: analysis.analysis,
          emotionalThemes: analysis.emotionalThemes,
          wisdomReflection: analysis.wisdomReflection,
          crisisAssessment: analysis.crisisAssessment,
          isDemo: false
        };
        
        setCurrentAnalysis(formattedAnalysis);
        setShowAnalysis(true);
        
        // Handle crisis detection
        if (analysis.crisisAssessment.isCrisis) {
          console.warn('Crisis detected in journal entry');
          // You could add additional crisis handling here
        }
        
      } catch (error) {
        console.error('AI Analysis failed:', error);
        
        // Show a graceful error message to the user
        setCurrentAnalysis({
          analysis: {
            emotionalRecognition: "Thank you for sharing your thoughts and feelings with such courage.",
            strengthIdentification: "Writing in your journal demonstrates incredible commitment to your healing journey.",
            gentleInsight: "Your reflection shows remarkable self-awareness and strength.",
            nurturingSuggestion: "Please be gentle with yourself as you continue this important practice."
          },
          emotionalThemes: {
            primaryEmotions: ['reflective', 'brave'],
            emotionalJourney: 'Engaging in meaningful self-reflection',
            copingStrategies: ['journaling'],
            growthIndicators: ['self-awareness'],
            supportiveNote: 'You are creating space for your feelings and experiences'
          },
          wisdomReflection: "Your commitment to journaling shows deep wisdom about the healing power of expression.",
          crisisAssessment: {
            isCrisis: false,
            confidenceLevel: 'low',
            reasoning: 'AI analysis temporarily unavailable',
            suggestedResources: null
          },
          isDemo: false
        });
        setShowAnalysis(true);
      } finally {
        setAnalyzing(false);
      }
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save journal entry. Please try again.');
      setSaving(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #C8D4BC 0%, #A4B792 50%, #8A9A78 100%)',
        color: 'white',
        fontFamily: 'system-ui'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #C8D4BC 0%, #A4B792 50%, #8A9A78 100%)',
      color: 'white',
      fontFamily: 'system-ui',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 300 }}>
            Journal
          </h1>
          <a 
            href="/dashboard" 
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px'
            }}
          >
            ← Dashboard
          </a>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 300 }}>
            How are you feeling today?
          </h3>
          
          {entries.length === 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              💡 <strong>New to ALCHM?</strong> After you save your first entry, Khepera (your AI companion) will offer gentle insights to support your reflection and growth.
              {apiAvailable === false && (
                <div style={{ marginTop: '0.5rem', color: '#ffd700' }}>
                  ⚠️ AI analysis is temporarily unavailable. Your entries will still be saved, and you'll receive supportive fallback insights.
                </div>
              )}
            </div>
          )}
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts and feelings here. This is your safe space..."
            style={{
              width: '100%',
              height: '200px',
              padding: '16px',
              border: 'none',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#333',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'system-ui'
            }}
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '1rem'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {content.length} characters
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !content.trim()}
              style={{
                padding: '12px 24px',
                background: saving || !content.trim() ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                color: saving || !content.trim() ? 'rgba(255, 255, 255, 0.7)' : '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: saving || !content.trim() ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
          
          {analyzing && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>✨ Khepera is reflecting on your words...</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>This may take a few moments</div>
            </div>
          )}
        </div>

        {/* AI Analysis Display */}
        {showAnalysis && currentAnalysis && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 300 }}>
                ✨ Insights from Khepera
              </h3>
              <button
                onClick={() => setShowAnalysis(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  opacity: 0.7
                }}
              >
                ×
              </button>
            </div>

            {(apiAvailable === false || currentAnalysis.crisisAssessment.reasoning.includes('temporarily unavailable')) && (
              <div style={{
                background: 'rgba(255, 193, 7, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 193, 7, 0.3)'
              }}>
                <strong>Service Notice:</strong> AI analysis is temporarily unavailable. 
                These insights are supportive fallback responses while we restore full functionality.
              </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
              {/* Emotional Recognition */}
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '1rem', 
                borderRadius: '8px' 
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  💚 EMOTIONAL RECOGNITION
                </div>
                <div style={{ lineHeight: 1.5 }}>{currentAnalysis.analysis.emotionalRecognition}</div>
              </div>

              {/* Strength Identification */}
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '1rem', 
                borderRadius: '8px' 
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  💪 YOUR STRENGTHS
                </div>
                <div style={{ lineHeight: 1.5 }}>{currentAnalysis.analysis.strengthIdentification}</div>
              </div>

              {/* Gentle Insight */}
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '1rem', 
                borderRadius: '8px' 
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  🌱 GENTLE INSIGHT
                </div>
                <div style={{ lineHeight: 1.5 }}>{currentAnalysis.analysis.gentleInsight}</div>
              </div>

              {/* Nurturing Suggestion */}
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '1rem', 
                borderRadius: '8px' 
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  🤗 NURTURING SUGGESTION
                </div>
                <div style={{ lineHeight: 1.5 }}>{currentAnalysis.analysis.nurturingSuggestion}</div>
              </div>

              {/* Emotional Themes */}
              {currentAnalysis.emotionalThemes.primaryEmotions.length > 0 && (
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  padding: '1rem', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                    🎭 EMOTIONAL THEMES
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Primary emotions:</strong> {currentAnalysis.emotionalThemes.primaryEmotions.join(', ')}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {currentAnalysis.emotionalThemes.supportiveNote}
                  </div>
                </div>
              )}

              {/* Wisdom Reflection */}
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '1.5rem', 
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  🔮 WISDOM REFLECTION
                </div>
                <div style={{ 
                  lineHeight: 1.6, 
                  fontStyle: 'italic',
                  fontSize: '1rem'
                }}>
                  {currentAnalysis.wisdomReflection}
                </div>
              </div>
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '1.5rem',
              fontSize: '0.8rem',
              opacity: 0.7 
            }}>
              These insights are AI-generated and meant to support your reflection. 
              Trust your own wisdom about your experience.
            </div>
          </div>
        )}

        {entries.length > 0 && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 300 }}>
              Your Recent Entries ({entries.length})
            </h3>
            
            {entries.map((entry) => (
              <div 
                key={entry.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ 
                  fontSize: '0.9rem', 
                  opacity: 0.7, 
                  marginBottom: '0.5rem' 
                }}>
                  {formatDate(entry.createdAt)}
                </div>
                <div style={{ lineHeight: 1.6 }}>
                  {entry.content}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ 
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem'
        }}>
          <a 
            href="/emergency"
            style={{
              color: 'white',
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}
          >
            Need immediate support? Crisis Support: 988
          </a>
        </div>
      </div>
    </div>
  );
}