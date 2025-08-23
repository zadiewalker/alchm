'use client';

import { useState, useEffect } from 'react';

interface RatingPromptState {
  shouldShow: boolean;
  currentRating: number | null;
  lastPromptDate: string | null;
}

export function useRatingPrompt() {
  const [promptState, setPromptState] = useState<RatingPromptState>({
    shouldShow: false,
    currentRating: null,
    lastPromptDate: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkRatingStatus();
  }, []);

  const checkRatingStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check localStorage for last prompt date
      const lastPromptDate = localStorage.getItem('alchm_last_rating_prompt');
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Don't prompt if we've prompted in the last 24 hours
      if (lastPromptDate && new Date(lastPromptDate) > oneDayAgo) {
        setPromptState(prev => ({
          ...prev,
          shouldShow: false,
          lastPromptDate
        }));
        setIsLoading(false);
        return;
      }

      // Check if user has already rated recently
      const userRating = localStorage.getItem('alchm_user_rating');
      const userRatingDate = localStorage.getItem('alchm_user_rating_date');
      
      if (userRating && userRatingDate) {
        const ratingDate = new Date(userRatingDate);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // If user rated in the last 7 days, don't prompt
        if (ratingDate > sevenDaysAgo && parseInt(userRating) >= 4) {
          setPromptState(prev => ({
            ...prev,
            shouldShow: false,
            currentRating: parseInt(userRating)
          }));
          setIsLoading(false);
          return;
        }
      }

      // Simulate rating check (in production, this would call the rating monitor)
      const shouldPrompt = await simulateRatingCheck();
      
      setPromptState(prev => ({
        ...prev,
        shouldShow: shouldPrompt,
        lastPromptDate
      }));
      
    } catch (error) {
      console.error('Error checking rating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateRatingCheck = async (): Promise<boolean> => {
    // In production, this would call the rating monitor API
    // For now, simulate based on user session count or random chance
    const sessionCount = parseInt(localStorage.getItem('alchm_session_count') || '0');
    
    // Prompt after user has had at least 3 sessions
    if (sessionCount >= 3) {
      // Random chance to simulate low rating triggering prompt
      const shouldPrompt = Math.random() < 0.3; // 30% chance for demo
      return shouldPrompt;
    }
    
    return false;
  };

  const handleUserRating = async (rating: number) => {
    try {
      const now = new Date().toISOString();
      
      // Store user's rating
      localStorage.setItem('alchm_user_rating', rating.toString());
      localStorage.setItem('alchm_user_rating_date', now);
      localStorage.setItem('alchm_last_rating_prompt', now);
      
      // Log the rating for analytics
      console.log(`User rated ALCHM: ${rating} stars`);
      
      // In production, this would send to analytics/firestore
      await logRatingToFirestore(rating);
      
      // Hide the prompt
      setPromptState(prev => ({
        ...prev,
        shouldShow: false,
        currentRating: rating,
        lastPromptDate: now
      }));
      
      // Show thank you message if 5 stars
      if (rating === 5) {
        showThankYouMessage();
      }
      
    } catch (error) {
      console.error('Error handling user rating:', error);
    }
  };

  const logRatingToFirestore = async (rating: number) => {
    // In production, this would save to Firestore
    // For now, just log to console
    const ratingData = {
      rating,
      timestamp: new Date().toISOString(),
      source: 'in-app-prompt',
      platform: 'web'
    };
    
    console.log('Rating logged:', ratingData);
    
    // Append to local log file via API call
    try {
      const response = await fetch('/api/log-rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratingData)
      });
      
      if (!response.ok) {
        console.error('Failed to log rating to server');
      }
    } catch (error) {
      console.error('Error logging rating:', error);
    }
  };

  const showThankYouMessage = () => {
    // Show a brief thank you toast
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Thank you!', {
          body: 'Your 5-star rating helps ALCHM reach more people who need trauma-informed journaling.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const dismissPrompt = () => {
    const now = new Date().toISOString();
    localStorage.setItem('alchm_last_rating_prompt', now);
    
    setPromptState(prev => ({
      ...prev,
      shouldShow: false,
      lastPromptDate: now
    }));
  };

  const incrementSessionCount = () => {
    const currentCount = parseInt(localStorage.getItem('alchm_session_count') || '0');
    localStorage.setItem('alchm_session_count', (currentCount + 1).toString());
  };

  return {
    shouldShowPrompt: promptState.shouldShow,
    currentRating: promptState.currentRating,
    isLoading,
    handleUserRating,
    dismissPrompt,
    checkRatingStatus,
    incrementSessionCount
  };
}