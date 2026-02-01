'use client';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/hooks/useData';
import { JournalEntry } from '@/lib/dataService';
import Loading from '@/components/ui/Loading';

function JournalContent() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  
  const searchParams = useSearchParams();
  const entryId = searchParams.get('id');
  
  const { 
    isInitialized, 
    getJournalEntries
  } = useData();

  useEffect(() => {
    if (isInitialized) {
      loadEntries();
    }
  }, [isInitialized, getJournalEntries]);

  useEffect(() => {
    if (entryId && entries.length > 0) {
      const entry = entries.find(e => e.id === entryId);
      setSelectedEntry(entry || null);
    } else {
      setSelectedEntry(null);
    }
  }, [entryId, entries]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const journalEntries = await getJournalEntries();
      setEntries(journalEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // If viewing individual entry
  if (selectedEntry) {
    const hasKheperaResponse = selectedEntry.insights && selectedEntry.insights.length > 0 && selectedEntry.insights.some(insight => insight && insight.trim());

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col">
        {/* Header */}
        <header className="px-6 pt-14 pb-4">
          <Link href="/journal/" className="text-white/60 text-base mb-4 inline-block hover:text-white/80 transition-all duration-200 ease-out active:scale-[0.98]">
            ← Back to Journal
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-light">Your Entry</h1>
            <div className="text-lg">
              {selectedEntry.mood && selectedEntry.mood >= 8 ? '😊' : selectedEntry.mood && selectedEntry.mood >= 6 ? '😐' : selectedEntry.mood && selectedEntry.mood >= 4 ? '😔' : '😢'}
            </div>
          </div>
          <p className="text-white/50 text-sm mt-1">{formatDate(selectedEntry.createdAt)}</p>
        </header>

        {/* Content */}
        <div className="flex-1 px-6 pb-24 overflow-y-auto">
          
          {/* Journal Entry */}
          <div className="bg-[#E5C97D]/15 backdrop-blur-sm rounded-2xl p-6 border border-[#E5C97D]/20 mb-6">
            {selectedEntry.title && (
              <h2 className="text-white text-xl font-light mb-4">{selectedEntry.title}</h2>
            )}
            
            <div className="text-white/80 text-base leading-relaxed whitespace-pre-wrap mb-4">
              {selectedEntry.content}
            </div>
            
            {selectedEntry.emotions && selectedEntry.emotions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedEntry.emotions.map((emotion, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-[#E5C97D]/20 text-[#E5C97D] px-3 py-1 rounded-full border border-[#E5C97D]/30"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Khepera's Response */}
          {hasKheperaResponse ? (
            <div className="bg-[#8B9A7C]/15 backdrop-blur-sm rounded-2xl p-6 border border-[#8B9A7C]/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#E5C97D]/20 flex items-center justify-center mr-4 border border-[#E5C97D]/30">
                  <span className="text-[#E5C97D] text-lg">☾</span>
                </div>
                <div>
                  <h3 className="text-white text-lg font-light">Khepera's Response</h3>
                  <p className="text-white/50 text-sm">Your AI healing companion</p>
                </div>
              </div>
              
              <div className="space-y-5">
                {selectedEntry.insights.map((insight, index) => {
                  if (!insight || !insight.trim()) return null;
                  
                  // Parse the insight to extract the type and content
                  const parts = insight.split(': ');
                  const type = parts[0] || '';
                  const content = parts.slice(1).join(': ') || insight;
                  
                  let bgColor = 'bg-white/5';
                  let borderColor = 'border-white/10';
                  let icon = '✨';
                  
                  if (type.includes('Emotional Recognition')) {
                    bgColor = 'bg-[#E5C97D]/10';
                    borderColor = 'border-[#E5C97D]/20';
                    icon = '🌟';
                  } else if (type.includes('Therapeutic')) {
                    bgColor = 'bg-blue-500/10';
                    borderColor = 'border-blue-500/20';
                    icon = '🧠';
                  } else if (type.includes('Nurturing')) {
                    bgColor = 'bg-pink-500/10';
                    borderColor = 'border-pink-500/20';
                    icon = '💗';
                  } else if (type.includes('Wisdom')) {
                    bgColor = 'bg-purple-500/10';
                    borderColor = 'border-purple-500/20';
                    icon = '🔮';
                  }
                  
                  return (
                    <div key={index} className={`${bgColor} rounded-xl p-4 border ${borderColor}`}>
                      {type && (
                        <div className="flex items-center mb-2">
                          <span className="mr-2">{icon}</span>
                          <h4 className="text-white/90 text-sm font-medium">{type}</h4>
                        </div>
                      )}
                      <p className="text-white/80 text-sm leading-relaxed">{content}</p>
                    </div>
                  );
                })}
              </div>

              {/* AI Analysis Summary */}
              {selectedEntry.aiAnalysis && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-white/50 text-xs mb-1">Emotional Tone</div>
                      <div className="text-white font-medium">
                        {selectedEntry.aiAnalysis.emotionalTone >= 8 ? 'Positive' : 
                         selectedEntry.aiAnalysis.emotionalTone >= 6 ? 'Neutral' : 
                         selectedEntry.aiAnalysis.emotionalTone >= 4 ? 'Contemplative' : 'Challenging'}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-white/50 text-xs mb-1">Themes</div>
                      <div className="text-white text-sm">
                        {selectedEntry.aiAnalysis.themes ? selectedEntry.aiAnalysis.themes.slice(0, 2).join(', ') : 'General'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl mb-4">☾</div>
              <h3 className="text-white text-lg font-light mb-2">No AI Response</h3>
              <p className="text-white/60 text-sm">
                This entry was created before Khepera's advanced response system was available.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-white/70 text-lg mr-4 hover:text-white/90 transition-all duration-200 ease-out active:scale-[0.98]">← Back</Link>
            <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">Your Entries</h1>
          </div>
          <Link
            href="/journal/new"
            className="glass-subtle px-6 py-2 rounded-full text-white text-sm hover:bg-white/20 transition-all duration-200 ease-out active:scale-[0.98] min-h-[44px] flex items-center justify-center"
          >
            + New
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="scrollable px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading message="Loading your entries..." />
          </div>
        ) : entries.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-white mb-2">No entries yet</h3>
            <p className="text-white/70 mb-6 max-w-sm mx-auto">
              Start your healing journey by writing your first journal entry.
            </p>
            <Link href="/journal/new">
              <button className="glass-card px-6 py-3 text-white font-medium transition-all duration-200 ease-out hover:bg-white/15 active:scale-[0.98] min-h-[44px]">
                Write Your First Entry
              </button>
            </Link>
          </div>
        ) : (
          /* Entries List */
          <div className="space-y-4 pb-24">
            <div className="text-white/60 text-sm mb-6">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </div>
            
            {entries.map((entry) => (
              <Link key={entry.id} href={`/journal?id=${entry.id}`}>
                <div className="glass-card p-4 transition-all duration-200 ease-out hover:bg-white/15 active:scale-[0.99]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white/70 text-sm">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-lg">
                      {entry.mood >= 8 ? '😊' : entry.mood >= 6 ? '😐' : entry.mood >= 4 ? '😔' : '😢'}
                    </div>
                  </div>
                  
                  {entry.title && (
                    <h3 className="text-white font-medium mb-2 line-clamp-1">
                      {entry.title}
                    </h3>
                  )}
                  
                  <p className="text-white/80 text-sm line-clamp-3 leading-relaxed">
                    {entry.content}
                  </p>
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {entry.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-white/40 text-right mt-3">→</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex items-center justify-center">
        <Loading message="Loading..." />
      </div>
    }>
      <JournalContent />
    </Suspense>
  );
}