'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function UserFeedback() {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);
    try {
      // Log feedback locally for now - could connect to Firebase later
      console.log('User Feedback:', { feedback, email, timestamp: new Date().toISOString() });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFeedback('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-2xl mb-2">🙏</div>
          <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
          <p className="text-sm text-[var(--ink-mute)] mb-4">
            Your feedback helps us create a better space for reflection.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-sm underline decoration-[var(--terra)] hover:opacity-80 transition-opacity duration-base"
          >
            Share more feedback
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">💭</div>
        <h3 className="text-lg font-semibold mb-2">How was your experience?</h3>
        <p className="text-sm text-[var(--ink-mute)]">
          Help us improve ALCHM with your thoughts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What did you think of your journaling experience? What could be better?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terra)] transition-all duration-base resize-none"
            required
          />
        </div>

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional - for follow-up questions)"
            className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terra)] transition-all duration-base"
          />
        </div>

        <PrimaryButton
          type="submit"
          disabled={!feedback.trim() || submitting}
          className="w-full"
        >
          {submitting ? 'Sending...' : 'Share Feedback'}
        </PrimaryButton>
      </form>

      <div className="mt-4 pt-4 border-t border-[var(--line)]">
        <p className="text-xs text-[var(--ink-mute)] text-center">
          Your feedback is private and helps us create a better journaling experience
        </p>
      </div>
    </Card>
  );
}