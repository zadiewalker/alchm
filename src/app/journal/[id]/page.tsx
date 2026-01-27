'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function JournalEntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [entry, setEntry] = useState<any>(null);

  useEffect(() => {
    // TODO: Fetch entry from Firebase by ID
    const fetchEntry = async () => {
      try {
        console.log('Fetching entry with ID:', id);
        
        // Mock data for now
        setEntry({
          id,
          content: 'This is a sample journal entry. Today I reflected on my growth and healing journey...',
          createdAt: new Date(),
          moods: ['Reflective', 'Hopeful', 'Peaceful'],
          aiAnalysis: {
            hasAnalysis: true,
            response: 'Your reflection shows beautiful awareness of your growth. The themes of hope and peace that emerge suggest you are cultivating inner wisdom. Consider continuing to notice these moments of clarity - they are guideposts on your healing journey.'
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching entry:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchEntry();
    }
  }, [id]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex items-center justify-center">
        <div className="text-white text-lg">Loading your reflection...</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex items-center justify-center">
        <div className="text-white text-lg">Entry not found</div>
      </div>
    );
  }

  return (
    <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0]">
      {/* Fixed Header */}
      <header className="px-6 pt-4 pb-2 flex items-center justify-between">
        <button onClick={() => router.back()} className="group relative">
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
          <span className="relative text-white/70 text-lg">← Back</span>
        </button>
        <h1 className="text-white text-xl font-light">Your Reflection</h1>
        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Entry Date */}
          <div className="text-center">
            <p className="text-white/70 text-sm">
              {formatDate(entry.createdAt)}
            </p>
          </div>

          {/* Moods */}
          {entry.moods && entry.moods.length > 0 && (
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <h3 className="text-white/70 text-sm mb-3">Your feelings</h3>
              <div className="flex flex-wrap gap-2">
                {entry.moods.map((mood: string) => (
                  <span
                    key={mood}
                    className="bg-white/20 text-white text-sm px-3 py-1 rounded-full"
                  >
                    {mood}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Journal Entry */}
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
            <h3 className="text-white/70 text-sm mb-4">Your words</h3>
            <p className="text-white leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>
          </div>

          {/* Khepera Response */}
          {entry.aiAnalysis?.hasAnalysis && (
            <div className="bg-white/15 p-6 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">K</span>
                </div>
                <h3 className="text-white font-light">Khepera's Reflection</h3>
              </div>
              <p className="text-white/90 leading-relaxed italic">
                {entry.aiAnalysis.response}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/journal/new')}
              className="group relative px-6 py-3"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 group-active:bg-white/25 rounded-lg transition-all duration-300" />
              <span className="relative text-white">
                ✍️ Write Another Entry
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <p className="text-white/50 text-sm text-center">Your reflection is a gift to yourself</p>
      </div>
    </div>
  );
}