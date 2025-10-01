"use client";

import React from 'react';

// MINIMAL EMERGENCY INTERFACE FOR BUILD COMPATIBILITY
export default function EmergencySafeInterface() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Emergency Support</h1>
          <p className="text-gray-600 mb-6">Crisis resources are being loaded...</p>
          <a 
            href="tel:988" 
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Call 988 - Crisis Lifeline
          </a>
        </div>
      </div>
    </div>
  );
}