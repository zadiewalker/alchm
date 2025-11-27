'use client';

// CRISIS-CRITICAL: Ultra-lightweight emergency access page
// Target: <15KB total bundle size for 2G/3G networks
// Immediate crisis support without authentication barriers

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Ultra-lightweight emergency components
const CrisisEmergencyPage = dynamic(() => import('@/components/crisis/CrisisEmergencyPage'), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4 animate-pulse">🆘</div>
        <h1 className="text-2xl font-medium text-gray-800 mb-4">Emergency Support Loading</h1>
        <p className="text-gray-700 mb-6">Help is on the way...</p>
        
        {/* Immediate crisis resources while loading */}
        <div className="space-y-3">
          <a
            href="tel:988"
            className="block w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg font-medium text-lg"
          >
            📞 Call 988 Crisis Line
          </a>
          <a
            href="sms:741741"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-medium text-lg"
          >
            💬 Text Crisis Line
          </a>
          <a
            href="tel:911"
            className="block w-full bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-lg font-medium text-lg"
          >
            🚨 Emergency Services
          </a>
        </div>
      </div>
    </div>
  )
});

const EmergencyJournal = dynamic(() => import('@/components/journal/EmergencyJournal'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-4xl mb-4">📝</div>
        <p className="text-lg text-gray-700">Loading emergency journal...</p>
      </div>
    </div>
  )
});

type EmergencyMode = 'crisis' | 'journal' | 'selection';

export default function EmergencyPage() {
  const [mode, setMode] = useState<EmergencyMode>('selection');
  const [crisisSeverity, setCrisisSeverity] = useState<'immediate' | 'urgent' | 'support'>('support');

  // Auto-detect crisis level from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const crisis = params.get('crisis');
      const level = params.get('level') as 'immediate' | 'urgent' | 'support';
      
      if (crisis === 'true') {
        setMode('crisis');
        setCrisisSeverity(level || 'support');
      }
    }
  }, []);

  if (mode === 'crisis') {
    return (
      <CrisisEmergencyPage
        severity={crisisSeverity}
        onContinueToJournal={() => setMode('journal')}
      />
    );
  }

  if (mode === 'journal') {
    return (
      <EmergencyJournal
        crisisMode={true}
        onCrisisDetected={(text, severity) => {
          if (severity === 'high') {
            setCrisisSeverity('immediate');
            setMode('crisis');
          }
        }}
      />
    );
  }

  // Selection mode - ultra-lightweight
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🆘</div>
        <h1 className="text-3xl font-medium text-gray-800 mb-4">
          Emergency Access
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Fast, safe access when you need it most.
        </p>

        <div className="space-y-4">
          {/* Immediate Crisis Support */}
          <button
            onClick={() => {
              setCrisisSeverity('immediate');
              setMode('crisis');
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-6 rounded-lg font-medium text-lg transition-colors shadow-lg"
          >
            🚨 I Need Help Right Now
          </button>

          {/* Crisis Resources */}
          <button
            onClick={() => {
              setCrisisSeverity('urgent');
              setMode('crisis');
            }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-lg font-medium text-lg transition-colors shadow-lg"
          >
            💙 I Need Crisis Support
          </button>

          {/* Emergency Journal */}
          <button
            onClick={() => setMode('journal')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg font-medium text-lg transition-colors shadow-lg"
          >
            📝 Emergency Journal Access
          </button>

          {/* Quick Crisis Resources */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-600 mb-4">Immediate Resources:</p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:988"
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium text-center transition-colors"
              >
                📞 Call 988
              </a>
              <a
                href="sms:741741"
                className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium text-center transition-colors"
              >
                💬 Text 741741
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <p className="text-xs text-gray-500">
            Free, confidential, available 24/7
          </p>
          <p className="text-xs text-gray-500 mt-1">
            You matter. Help is available.
          </p>
        </div>
      </div>
    </div>
  );
}