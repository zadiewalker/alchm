// Sanctuary Investment Success - Celebration of Healing Investment
// Heart-sparkle success experience with gentle transition to dashboard

'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SanctuarySuccessPage() {
  const [showCelebration, setShowCelebration] = useState(true);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Create sparkle animation
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setSparkles(newSparkles);

    // Auto-transition to dashboard after celebration
    const timer = setTimeout(() => {
      window.location.href = '/dashboard?sanctuary=premium&welcome=true';
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-100 to-sanctuary-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Sparkle Animation Background */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute w-2 h-2 bg-warm-amber rounded-full animate-ping"
          style={{
            top: `${sparkle.y}%`,
            left: `${sparkle.x}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: '3s'
          }}
        />
      ))}
      
      {/* Success Card */}
      <Card variant="sanctuary" className="max-w-2xl w-full text-center relative z-10">
        <CardContent className="p-12">
          {/* Heart with Gentle Pulse */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-sage-400 to-sage-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            
            {/* Gentle glow effect */}
            <div className="absolute inset-0 w-32 h-32 bg-sage-400/20 rounded-full mx-auto animate-ping" style={{ animationDuration: '4s' }} />
          </div>
          
          <CardTitle level="h1" className="text-4xl md:text-5xl font-light text-sage-700 mb-6">
            Welcome to Premium Sanctuary
          </CardTitle>
          
          <CardDescription className="text-xl text-sanctuary-gray-600 leading-relaxed mb-8 max-w-xl mx-auto">
            Your investment in healing expands your sanctuary today. 
            Enhanced wisdom, deeper insights, and expanded capabilities await your exploration.
          </CardDescription>
          
          {/* Investment Confirmation */}
          <div className="bg-sage-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium text-sanctuary-gray-800 mb-3">
              Your Sanctuary Now Includes
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-sanctuary-gray-700">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-sage-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Enhanced emotional wisdom mapping</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-sage-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Unlimited Khepera wisdom conversations</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-sage-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Advanced healing achievement garden</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-sage-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Priority sanctuary support</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => window.location.href = '/dashboard'}
            >
              Explore Your Expanded Sanctuary
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => window.location.href = '/journal'}
            >
              Begin Premium Journaling
            </Button>
          </div>
          
          <p className="text-sm text-sanctuary-gray-500 mt-6">
            Your sanctuary data remains private and secure • Cancel anytime
          </p>
        </CardContent>
      </Card>
    </div>
  );
}