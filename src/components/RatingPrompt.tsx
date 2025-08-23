'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';

interface RatingPromptProps {
  onDismiss: () => void;
  onRate: (rating: number) => void;
}

export default function RatingPrompt({ onDismiss, onRate }: RatingPromptProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    onRate(rating);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-gradient-to-r from-purple-900/95 to-pink-900/95 border-purple-500/50 shadow-2xl backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                Help ALCHM get featured! 🌟
              </h3>
              <p className="text-xs text-purple-200 leading-tight">
                Please rate ALCHM 5 stars in beta testing to boost featuring chances.
              </p>
            </div>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              aria-label="Dismiss rating prompt"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || selectedRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-xs text-purple-200/80">
              Your feedback helps us reach more people who need trauma-informed journaling.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}