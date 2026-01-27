'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    'Peaceful', 'Anxious', 'Grateful', 'Sad', 'Excited', 'Frustrated',
    'Hopeful', 'Overwhelmed', 'Content', 'Confused', 'Energetic', 'Tired',
    'Joyful', 'Angry', 'Reflective', 'Lonely', 'Optimistic', 'Worried'
  ];

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // TODO: Submit to Firebase
      console.log('Submitting entry:', { content, moods: selectedMoods });
      
      // Navigate back or to success page
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0]">
      {/* Fixed Header */}
      <header className="px-6 pt-4 pb-2 flex items-center justify-between">
        <button onClick={() => router.back()} className="group relative">
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
          <span className="relative text-white/70 text-lg">← Back</span>
        </button>
        <h1 className="text-white text-xl font-light">New Entry</h1>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="group relative px-4 py-2 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 group-active:bg-white/25 rounded-lg transition-all duration-300" />
          <span className="relative text-white font-medium">
            {isSubmitting ? 'Saving...' : 'Save'}
          </span>
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Journal Textarea */}
        <div className="mb-8">
          <label className="block text-white/70 text-sm mb-3">
            What's on your mind today?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Express your thoughts, feelings, experiences..."
            className="w-full h-64 bg-white/10 text-white placeholder-white/50 p-4 rounded-xl border border-white/20 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        {/* Mood Selection */}
        <div className="mb-8">
          <label className="block text-white/70 text-sm mb-3">
            How are you feeling? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => toggleMood(mood)}
                className={`group relative px-4 py-3 text-sm ${
                  selectedMoods.includes(mood) ? 'opacity-100' : 'opacity-70'
                }`}
              >
                <div className={`absolute inset-0 transition-all duration-300 rounded-full ${
                  selectedMoods.includes(mood) 
                    ? 'bg-white/25' 
                    : 'bg-white/10 group-hover:bg-white/20'
                }`} />
                <span className="relative text-white">
                  {mood}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Entry Guidelines */}
        <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
          <h3 className="text-white font-light mb-3">✨ Your Safe Space</h3>
          <ul className="text-white/70 text-sm space-y-2">
            <li>• Express yourself authentically - all feelings are valid</li>
            <li>• Khepera will offer gentle insights to support your reflection</li>
            <li>• Your entries are private and secure</li>
            <li>• There's no right or wrong way to journal</li>
          </ul>
        </div>
      </div>

      {/* Crisis Support */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <div className="text-center">
          <button
            onClick={() => router.push('/emergency')}
            className="text-white/50 text-xs underline"
          >
            Need immediate support? Crisis Support: 988
          </button>
        </div>
      </div>
    </div>
  );
}