"use client";

import { useEffect, useState } from 'react';

interface CrisisResource {
  number: string;
  text: string;
  description: string;
  type: 'call' | 'text' | 'chat';
}

const CRISIS_RESOURCES: { [key: string]: CrisisResource[] } = {
  immediate: [
    { number: '988', text: 'Call 988', description: 'Suicide & Crisis Lifeline - Free, 24/7', type: 'call' },
    { number: '741741', text: 'Text HOME to 741741', description: 'Crisis Text Line', type: 'text' },
    { number: '911', text: 'Call 911', description: 'Emergency Services', type: 'call' }
  ],
  specialized: [
    { number: '1-866-488-7386', text: 'Trevor Project', description: 'LGBTQ+ youth crisis support', type: 'call' },
    { number: '877-565-8860', text: 'Trans Lifeline', description: 'Trans community support', type: 'call' },
    { number: '1-800-799-7233', text: 'Domestic Violence Hotline', description: 'Safety from abuse', type: 'call' },
    { number: '1-800-366-8288', text: 'Boys Town National Hotline', description: 'Youth in crisis', type: 'call' }
  ],
  international: [
    { number: '116-123', text: 'Samaritans (UK)', description: 'Free emotional support', type: 'call' },
    { number: '13-11-14', text: 'Lifeline (Australia)', description: '24/7 crisis support', type: 'call' },
    { number: '1-833-456-4566', text: 'Talk Suicide Canada', description: 'Crisis support in Canada', type: 'call' }
  ]
};

const SAFETY_MESSAGES = [
  "You are not alone. Your life has value.",
  "This feeling is temporary. You matter.",
  "Reaching out for help is a sign of strength.",
  "You deserve support and care.",
  "Crisis situations pass. Support is constant."
];

export default function CrisisSupportInterface() {
  const [selectedCategory, setSelectedCategory] = useState('immediate');
  const [currentMessage, setCurrentMessage] = useState(0);
  const [loadTime] = useState(Date.now());
  const [isConnected, setIsConnected] = useState(true);
  
  // Timer management for message rotation and connection status
  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    
    // Check if window is available (client-side only)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }
    
    // Rotate safety messages
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % SAFETY_MESSAGES.length);
    }, 5000);

    // Set initial connection status
    if (typeof window !== 'undefined') {
      setIsConnected(navigator.onLine);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const handleResourceClick = (resource: CrisisResource) => {
    if (typeof window === 'undefined') return;
    
    if (resource.type === 'call') {
      window.location.href = `tel:${resource.number}`;
    } else if (resource.type === 'text') {
      window.location.href = `sms:${resource.number}`;
    }
    
    // Log usage for analytics (privacy-preserving)
    console.log('Crisis resource accessed:', {
      type: resource.type,
      category: selectedCategory,
      timestamp: new Date().toISOString()
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'immediate':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'specialized':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        );
      case 'international':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const responseTime = Date.now() - loadTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Offline'} - Resources loaded in {responseTime}ms
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Crisis Support Available 24/7
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-gray-800 mb-2">
            Crisis Support
          </h1>
          <div className="text-lg text-gray-600 transition-all duration-500 ease-in-out min-h-[28px]">
            {SAFETY_MESSAGES[currentMessage]}
          </div>
        </div>

        {/* Category selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.keys(CRISIS_RESOURCES).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(category)}
              <span className="capitalize">{category}</span>
            </button>
          ))}
        </div>

        {/* Crisis resources */}
        <div className="grid gap-4 mb-8">
          {CRISIS_RESOURCES[selectedCategory]?.map((resource, index) => (
            <button
              key={index}
              onClick={() => handleResourceClick(resource)}
              className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 rounded-2xl flex items-center gap-4 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                {resource.type === 'call' ? (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg text-gray-800">{resource.text}</div>
                <div className="text-gray-600 text-sm">{resource.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {resource.type === 'call' ? 'Tap to call' : 'Tap to text'}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Grounding techniques */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Immediate Grounding</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Breathing:</strong> Breathe in for 4, hold for 4, out for 6
            </div>
            <div>
              <strong>5-4-3-2-1:</strong> 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste
            </div>
            <div>
              <strong>Physical:</strong> Feel your feet on the ground, wiggle your toes
            </div>
            <div>
              <strong>Affirmation:</strong> "I am safe right now. This will pass."
            </div>
          </div>
        </div>

        {/* Safe navigation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Return to ALCHM Home
          </button>
          <button
            onClick={() => window.location.href = '/journal'}
            className="flex-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Safe Journal Space
          </button>
          <button
            onClick={() => window.location.href = '/emergency'}
            className="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Emergency Help
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>All resources work offline. Response time: {responseTime < 3000 ? 'Optimal' : 'Good'} ({responseTime}ms)</p>
          <p className="mt-1">This page is designed to work even when other parts of the app fail.</p>
        </div>
      </div>
    </div>
  );
}