'use client';

import React, { useState, useEffect } from 'react';
// Sacred threshold handled by layout

export default function SacredHomePage() {
  // Age verification now handled by layout with Sacred component

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600 flex flex-col items-center justify-center p-harmonic font-sacred relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-sanctuary-mist via-transparent to-sage-mist opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(247,247,242,0.1)_0%,_transparent_50%)]" />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        {/* Sacred sanctuary icon with premium animation */}
        <div className="w-32 h-32 mb-meditation bg-gradient-to-br from-sanctuary-100/90 to-sanctuary-glass backdrop-blur-xl rounded-cosmos flex items-center justify-center shadow-sanctuary animate-gentle-breathe">
          <div className="text-5xl">🌿</div>
        </div>
        
        {/* Premium typography hierarchy */}
        <h1 className="text-5xlarge font-whisper text-sanctuary mb-contemplative tracking-tight leading-none">
          Your Sanctuary Awaits
        </h1>
        
        <p className="text-xlarge font-presence text-sanctuary-100/90 mb-expansive max-w-lg leading-relaxed tracking-wide">
          Welcome to ALCHM - a trauma-informed digital sanctuary for healing and growth.
        </p>
      
        {/* Premium call-to-action button */}
        <button
          onClick={() => window.location.href = '/auth/login'}
          className="bg-sanctuary-glass backdrop-blur-xl text-sage-700 font-sacred text-xlarge rounded-temple 
                     px-meditation py-harmonic mb-expansive min-h-[72px] min-w-[280px] shadow-sanctuary
                     hover:bg-sanctuary hover:shadow-temple hover:-translate-y-1 hover:scale-[1.02]
                     active:translate-y-0 active:scale-[1.01] transition-all duration-500 
                     ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ring-2 ring-sanctuary-100/30
                     hover:ring-sanctuary-200/50 tracking-wide"
        >
          Continue to Sanctuary
        </button>
      
        {/* Premium crisis support section */}
        <div className="bg-terracotta-glass backdrop-blur-xl rounded-temple p-meditation mt-expansive text-center max-w-md shadow-sanctuary">
          <h3 className="text-sanctuary text-xlarge font-sacred mb-contemplative tracking-wide">
            Crisis Support Always Available
          </h3>
          
          <div className="flex gap-contemplative justify-center">
            <a
              href="tel:988"
              className="bg-sanctuary-100/20 text-sanctuary hover:bg-sanctuary-200/30 
                         px-harmonic py-contemplative rounded-embrace font-sacred text-large
                         min-h-[52px] flex items-center shadow-breath hover:shadow-blessing
                         hover:-translate-y-0.5 transition-all duration-300 tracking-wide"
            >
              📞 Call 988
            </a>
            
            <a
              href="sms:741741"
              className="bg-sanctuary-100/20 text-sanctuary hover:bg-sanctuary-200/30 
                         px-harmonic py-contemplative rounded-embrace font-sacred text-large
                         min-h-[52px] flex items-center shadow-breath hover:shadow-blessing
                         hover:-translate-y-0.5 transition-all duration-300 tracking-wide"
            >
              💬 Text 741741
            </a>
          </div>
        </div>
      </div>
      
      {/* Ambient particles for premium feel */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-sanctuary-100/30 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '4s' }} />
      <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-sanctuary-200/40 rounded-full animate-ping" style={{ animationDelay: '5s', animationDuration: '6s' }} />
      <div className="absolute bottom-1/3 left-1/6 w-1.5 h-1.5 bg-sanctuary-100/20 rounded-full animate-ping" style={{ animationDelay: '8s', animationDuration: '5s' }} />
    </div>
  );
}