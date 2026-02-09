'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { safeLocalStorage } from '@/utils/browser';

interface JournalEntry {
  content: string;
  moods: string[];
  date: string;
  crisisAssessment?: any;
}

export default function InsightsPage() {
  const [currentMonth] = useState(new Date());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  
  // Load journal entries from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const entries: JournalEntry[] = [];
      
      // Get all localStorage keys that start with 'journal_'
      if (typeof Storage !== 'undefined' && localStorage) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
        if (key?.startsWith('journal_')) {
          try {
            const entry = JSON.parse(safeLocalStorage.getItem(key) || '{}');
            entries.push(entry);
          } catch (error) {
            console.error('Error parsing journal entry:', error);
          }
        }
      }
      }
      
      // Sort entries by date (newest first)
      entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setJournalEntries(entries);
    }
  }, []);
  
  // Generate calendar days for current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Get days with actual entries for current month
  const daysWithEntries = journalEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    })
    .map(entry => new Date(entry.date).getDate());
  
  // Calculate insights from real data
  const getMostCommonMood = () => {
    const moodCounts: { [key: string]: number } = {};
    journalEntries.forEach(entry => {
      entry.moods?.forEach(mood => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });
    });
    
    const topMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, '');
    
    return topMood || null;
  };
  
  // Analyze writing times
  const getWritingPattern = () => {
    const hourCounts: { [hour: number]: number } = {};
    journalEntries.forEach(entry => {
      const hour = new Date(entry.date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const topHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[Number(a)] > hourCounts[Number(b)] ? a : b, '');
    
    if (!topHour) return null;
    
    const hour = Number(topHour);
    if (hour >= 5 && hour < 12) return 'in the morning';
    if (hour >= 12 && hour < 17) return 'in the afternoon';
    if (hour >= 17 && hour < 21) return 'in the evening';
    return 'late at night';
  };
  
  // Generate personalized Khepera observation
  const getKheperaObservation = () => {
    if (journalEntries.length === 0) {
      return "I'm here when you're ready to begin writing. Your thoughts are always welcome.";
    }
    
    const entryCount = journalEntries.length;
    const mostCommonMood = getMostCommonMood();
    const writingTime = getWritingPattern();
    
    let observation = `You've shared ${entryCount} ${entryCount === 1 ? 'reflection' : 'reflections'} with me. `;
    
    if (writingTime) {
      observation += `I notice you often write ${writingTime}. `;
    }
    
    if (mostCommonMood) {
      observation += `The feeling of being ${mostCommonMood.toLowerCase()} appears frequently in your words.`;
    } else {
      observation += `Each of your entries brings its own unique emotional landscape.`;
    }
    
    return observation;
  };
  
  const days = [];
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-6">
        <Link href="/dashboard/" className="text-white/60 text-base mb-4 inline-block hover:text-white/80 transition-all duration-200 ease-out active:scale-[0.98]">
          ← Back
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#E8C56D]/60" />
          <h1 className="text-white text-3xl font-light">Insights</h1>
        </div>
        <p className="text-white/50 text-base mt-1">Patterns Khepera has noticed</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        
        {/* Khepera's Observation */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-white/15 to-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg shadow-black/5">
            <div className="flex items-start gap-3">
              {/* Small Khepera icon */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/25 to-gold/15 border border-gold/15 flex items-center justify-center flex-shrink-0 mt-1">
                <svg viewBox="0 0 100 100" className="w-5 h-5">
                  <circle cx="50" cy="15" r="8" fill="#E8C56D" />
                  <ellipse cx="50" cy="55" rx="18" ry="26" fill="white" fillOpacity="0.7" />
                  <path d="M32 50 Q15 42 20 62 Q22 72 32 67 Z" fill="white" fillOpacity="0.7" />
                  <path d="M68 50 Q85 42 80 62 Q78 72 68 67 Z" fill="white" fillOpacity="0.7" />
                </svg>
              </div>
              <div>
                <p className="text-white/85 text-base leading-relaxed">
                  "{getKheperaObservation()}"
                </p>
                <p className="text-white/40 text-sm mt-2">— Khepera</p>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar - Gentle Timeline */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-1 rounded-full bg-[#E5C97D]/40" />
            <h2 className="text-white/50 text-sm tracking-wide">{monthName}</h2>
          </div>
          
          <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/8">
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-white/40 text-xs py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => (
                <div 
                  key={i} 
                  className="aspect-square flex items-center justify-center"
                >
                  {day && (
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${daysWithEntries.includes(day) 
                        ? 'bg-gold text-white' 
                        : 'text-white/40'
                      }
                    `}>
                      {day}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-white/30 text-xs text-center mt-3">
            {daysWithEntries.length > 0 
              ? 'Days you reflected are highlighted' 
              : 'Start journaling to see your reflection patterns'
            }
          </p>
        </section>

        {/* Gentle Patterns - Real Data Only */}
        {journalEntries.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-1 rounded-full bg-[#E5C97D]/40" />
            <h2 className="text-white/50 text-sm tracking-wide">What's emerging</h2>
          </div>
          
          <div className="space-y-3">
              {getMostCommonMood() && (
                <div className="bg-white/10 backdrop-blur-[12px] rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all 200ms ease">
                  <p className="text-white/50 text-sm mb-1">Most present feeling</p>
                  <p className="text-white/90 text-lg font-light">{getMostCommonMood()}</p>
                </div>
              )}
              
              {getWritingPattern() && (
                <div className="bg-white/10 backdrop-blur-[12px] rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all 200ms ease">
                  <p className="text-white/50 text-sm mb-1">You often write</p>
                  <p className="text-white/90 text-lg font-light">{getWritingPattern()}</p>
                </div>
              )}
              
              <div className="bg-white/10 backdrop-blur-[12px] rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all 200ms ease">
                <p className="text-white/50 text-sm mb-1">Total reflections</p>
                <p className="text-white/90 text-lg font-light">{journalEntries.length}</p>
              </div>
          </div>
        </section>
        )}

        {/* Gentle Note */}
        <section>
          {journalEntries.length > 0 ? (
            <p className="text-white/30 text-xs text-center mt-6 leading-relaxed">
              These patterns are observations, not judgments.<br />
              All feelings are welcome here.
            </p>
          ) : (
            <div className="text-center">
              <Link 
                href="/journal/new/"
                className="inline-block px-5 py-3 rounded-full bg-[#E8C56D]/10 hover:bg-[#E8C56D]/15
                           border border-[#E8C56D]/20 hover:border-[#E8C56D]/30
                           transition-all duration-200 ease-out active:scale-[0.98]
                           min-h-[44px] flex items-center justify-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#E8C56D]/60" />
                <span className="text-white/80 text-sm font-light">Start journaling</span>
              </Link>
              <p className="text-white/30 text-xs mt-4 leading-relaxed">
                Your insights will appear here as you write
              </p>
            </div>
          )}
        </section>

        {/* Crisis Support Footer */}
        <div className="mt-8 pb-8 pt-6">
          <p className="text-white/30 text-xs text-center tracking-wide">
            Crisis support available · 988
          </p>
        </div>

      </div>
    </div>
  );
}