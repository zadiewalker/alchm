'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface JournalEntry {
  content: string;
  mood: string;
  date: string;
}

export default function InsightsPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [activePerspective, setActivePerspective] = useState<string>('somatic');

  useEffect(() => {
    // Load entries from localStorage
    const keys = Object.keys(localStorage).filter(key => key.startsWith('journal_'));
    const loadedEntries = keys.map(key => JSON.parse(localStorage.getItem(key) || '{}')).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setEntries(loadedEntries);
    if (loadedEntries.length > 0) setSelectedEntry(loadedEntries[0]);
  }, []);

  const perspectives = {
    somatic: {
      icon: '🌊',
      name: 'Somatic',
      color: 'from-blue-400/20 to-teal-500/20',
      questions: [
        'What sensations am I noticing in my body?',
        'Where do I feel tension, ease, or energy?',
        'How is my breathing right now?',
        'What is my body trying to tell me about this experience?'
      ]
    },
    psychotherapeutic: {
      icon: '🧠',
      name: 'Psychotherapeutic',
      color: 'from-purple-400/20 to-indigo-500/20',
      questions: [
        'What patterns am I noticing in my thoughts?',
        'How might my past experiences be influencing this?',
        'What emotions are beneath the surface?',
        'What would my therapist help me see here?'
      ]
    },
    integrative: {
      icon: '🌀',
      name: 'Integrative Healing',
      color: 'from-emerald-400/20 to-green-500/20',
      questions: [
        'How can I honor both my pain and my healing?',
        'What needs integration in my life right now?',
        'How do mind, body, and spirit connect in this moment?',
        'What would wholeness look like here?'
      ]
    },
    accountability: {
      icon: '⚖️',
      name: 'Accountability',
      color: 'from-orange-400/20 to-red-500/20',
      questions: [
        'What is my responsibility in this situation?',
        'How can I own my part without self-blame?',
        'What actions can I take to create change?',
        'Where can I practice healthy boundaries?'
      ]
    },
    nurturing: {
      icon: '🤱',
      name: 'Nurturing',
      color: 'from-pink-400/20 to-rose-500/20',
      questions: [
        'What do I need to feel safe and supported right now?',
        'How can I offer myself tenderness?',
        'What would unconditional love say to me?',
        'How can I mother/father myself through this?'
      ]
    }
  };

  const currentPerspective = perspectives[activePerspective as keyof typeof perspectives];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-white/70 text-lg mr-4">← Back</Link>
          <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">Insights</h1>
        </div>
        <div className="text-white/60 text-sm">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>

      {entries.length === 0 ? (
        /* No Entries State */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-[320px]">
            <div className="text-white/60 text-5xl mb-6">🪲</div>
            <h2 className="text-white text-xl font-light mb-4">Begin Your Journey</h2>
            <p className="text-white/60 text-sm mb-8">Write your first journal entry to unlock insights and perspectives on your healing path</p>
            <Link 
              href="/journal/new"
              className="inline-block px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-all duration-300"
            >
              Create First Entry
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Perspective Selector */}
          <div className="mb-6">
            <p className="text-white/80 text-sm font-light mb-3">View through different lenses:</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(perspectives).map(([key, perspective]) => (
                <button
                  key={key}
                  onClick={() => setActivePerspective(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    activePerspective === key 
                      ? 'bg-white/30 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span>{perspective.icon}</span>
                  <span>{perspective.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Entry Selector */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-white text-lg font-light mb-4">Recent Entries</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {entries.slice(0, 10).map((entry, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEntry(entry)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      selectedEntry === entry 
                        ? 'bg-white/20 border border-white/30' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{entry.mood || '💭'}</span>
                      <span className="text-white/60 text-xs">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {entry.content.substring(0, 100)}...
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Perspective Analysis */}
            <div className={`bg-gradient-to-br ${currentPerspective.color} backdrop-blur-md border border-white/20 rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{currentPerspective.icon}</span>
                <h3 className="text-white text-lg font-light">{currentPerspective.name} Perspective</h3>
              </div>
              
              {selectedEntry && (
                <div>
                  <div className="mb-6">
                    <h4 className="text-white/80 text-sm font-light mb-3">Reflect on your entry:</h4>
                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                      <p className="text-white/70 text-sm italic">
                        "{selectedEntry.content.substring(0, 200)}{selectedEntry.content.length > 200 ? '...' : ''}"
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white/80 text-sm font-light mb-3">Consider these questions:</h4>
                    <div className="space-y-3">
                      {currentPerspective.questions.map((question, index) => (
                        <div
                          key={index}
                          className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all duration-300"
                        >
                          <p className="text-white text-sm">{question}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/20">
                    <Link 
                      href="/journal/new"
                      className="inline-block px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm transition-all duration-300"
                    >
                      Journal About This
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Crisis Support */}
      <div className="pb-10 pt-6">
        <p className="text-white/40 text-xs text-center tracking-wide">Crisis support available · 988</p>
      </div>
    </div>
  );
}