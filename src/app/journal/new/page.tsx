'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function NewJournalEntryPage() {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (entry.trim()) {
      // In a real app, this would save to a database
      localStorage.setItem(`journal_${Date.now()}`, JSON.stringify({
        content: entry,
        mood,
        date: new Date().toISOString(),
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-white/70 text-lg mr-4">← Back</Link>
          <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">New Entry</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!entry.trim()}
          className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 ${
            entry.trim() 
              ? 'bg-white/20 text-white hover:bg-white/30' 
              : 'bg-white/5 text-white/40 cursor-not-allowed'
          }`}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* Journal Form */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        {/* Mood Selection */}
        <div className="mb-6">
          <label className="block text-white/80 text-sm font-light mb-3">How are you feeling?</label>
          <div className="flex gap-3 flex-wrap">
            {['😊', '😌', '😐', '😔', '😰', '😡', '🤗', '💙'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => setMood(emoji)}
                className={`text-2xl p-3 rounded-full transition-all duration-300 ${
                  mood === emoji 
                    ? 'bg-white/30 scale-110' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Writing Area */}
        <div className="flex-1 mb-6">
          <label className="block text-white/80 text-sm font-light mb-3">Your thoughts</label>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="This is your safe space. Write freely about anything on your mind, your feelings, your day, or your hopes..."
            className="w-full h-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-base leading-relaxed"
            style={{ minHeight: '200px' }}
          />
          <div className="text-right text-white/40 text-xs mt-2">
            {entry.length} characters
          </div>
        </div>

        {/* Gentle Prompts */}
        {!entry && (
          <div className="mb-6">
            <p className="text-white/60 text-sm mb-3">Need inspiration? Try reflecting on:</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                "What am I grateful for today?",
                "How did I take care of myself?",
                "What challenged me and how did I grow?",
                "What brought me joy or peace?"
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setEntry(prompt + '\n\n')}
                  className="text-left p-3 bg-white/5 rounded-xl text-white/70 text-sm hover:bg-white/10 transition-all duration-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Crisis Support */}
      <div className="pb-10">
        <p className="text-white/40 text-xs text-center tracking-wide">Crisis support available · 988</p>
      </div>
    </div>
  );
}