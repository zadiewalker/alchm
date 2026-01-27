'use client';
import { useEffect, useState } from 'react';
import { onAuthChanged } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, where, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { User } from 'firebase/auth';

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

export default function InsightsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
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
        orderBy('createdAt', 'desc'),
        limit(10) // Show last 10 entries
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

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatShortDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const entriesWithAnalysis = entries.filter(entry => entry.aiAnalysis?.hasAnalysis);
  const totalEntries = entries.length;
  const daysJournaling = new Set(entries.map(entry => formatShortDate(entry.createdAt))).size;

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
    <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0]">
      {/* Fixed Header */}
      <header className="px-6 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="group relative">
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
            <span className="relative text-white/70 text-lg">← Back</span>
          </button>
          <h1 className="text-white text-xl font-light ml-4">Your Healing Journey</h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-2xl mx-auto">

          {/* Progress Overview */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 300 }}>
            🌱 Your Growth at a Glance
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
                {totalEntries}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Journal Entries
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
                {entriesWithAnalysis.length}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Insights Received
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
                {daysJournaling}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Days of Reflection
              </div>
            </div>
          </div>
        </div>

        {/* Recent Journey */}
        {totalEntries > 0 ? (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 300 }}>
              🔮 Recent Reflections with Khepera
            </h3>
            
            {entriesWithAnalysis.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {entriesWithAnalysis.slice(0, 5).map((entry) => (
                  <div 
                    key={entry.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <div style={{ 
                      fontSize: '0.9rem', 
                      opacity: 0.7, 
                      marginBottom: '1rem' 
                    }}>
                      {formatDate(entry.createdAt)}
                    </div>
                    
                    <div style={{ 
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                      opacity: 0.9
                    }}>
                      {entry.content.length > 150 
                        ? entry.content.substring(0, 150) + '...'
                        : entry.content
                      }
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '1rem',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>
                      ✨ Khepera provided insights for this reflection
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center',
                padding: '2rem',
                opacity: 0.8
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Your insights will appear here
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Keep journaling to receive gentle guidance from Khepera
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '3rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📖</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 300 }}>
              Start Your Healing Journey
            </h3>
            <p style={{ fontSize: '1rem', marginBottom: '2rem', opacity: 0.9 }}>
              Begin by writing your first journal entry. Khepera will be here to offer gentle insights and support your reflection.
            </p>
            <button
              onClick={() => router.push('/journal')}
              className="group relative px-6 py-3"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 group-active:bg-white/35 rounded-lg transition-all duration-300" />
              <span className="relative text-white font-medium">
                Write Your First Entry
              </span>
            </button>
          </div>
        )}

        {/* Crisis Support */}
        <div style={{ 
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem'
        }}>
          <button
            onClick={() => router.push('/emergency')}
            className="text-white text-sm underline"
          >
            Need immediate support? Crisis Support: 988
          </button>
        </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <p className="text-white/50 text-sm text-center">Your healing insights await</p>
      </div>
    </div>
  );
}