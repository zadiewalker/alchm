'use client';

import React from 'react';
import { CompleteKheperaChat, KheperaChatTrigger, useKheperaChat } from '@/components/khepera';
import { KheperaScarabIcon } from '@/components/khepera/KheperaScarabIcons';

function DemoContent() {
  const { openChat, sendMessage } = useKheperaChat();

  const demoScenarios = [
    {
      title: "Emotional Check-in",
      description: "Start a conversation about how you're feeling",
      trigger: "I'm feeling overwhelmed today",
      icon: "💫"
    },
    {
      title: "Grounding Exercise",
      description: "Request help with staying present",
      trigger: "I need help grounding myself",
      icon: "🌱"
    },
    {
      title: "Reflection Support",
      description: "Explore your thoughts and experiences",
      trigger: "I want to reflect on something",
      icon: "✨"
    },
    {
      title: "Celebration Mode",
      description: "Share something positive that happened",
      trigger: "I have something to celebrate!",
      icon: "🎉"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <KheperaScarabIcon 
              size={80} 
              mode="present"
              showAura={true}
              breathingPhase="exhale"
            />
          </div>
          
          <h1 className="text-4xl font-light text-white mb-4 tracking-wide">
            Meet Khepera
          </h1>
          
          <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto">
            Your AI emotional concierge, designed with Jony Ive's philosophy of radical simplicity 
            and trauma-informed care. Experience conversations that feel safe, supportive, and genuinely healing.
          </p>
          
          <button
            onClick={openChat}
            className="alchm-btn alchm-btn-primary text-lg px-8 py-4 rounded-2xl font-medium"
          >
            Start Conversation
          </button>
        </div>

        {/* Demo Scenarios */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {demoScenarios.map((scenario, index) => (
            <div
              key={index}
              className="alchm-card bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{scenario.icon}</div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-lg mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    {scenario.description}
                  </p>
                  <KheperaChatTrigger message={scenario.trigger}>
                    <span className="text-white/90 text-sm font-medium hover:text-white transition-colors">
                      Try this conversation →
                    </span>
                  </KheperaChatTrigger>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Design Principles */}
        <div className="alchm-card bg-white/10 backdrop-blur-xl border border-white/20">
          <h2 className="text-2xl font-light text-white mb-6">Design Principles</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-white font-medium mb-2">Radical Simplicity</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Every interaction is purposeful. No clutter, no confusion—just what you need.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">💚</span>
              </div>
              <h3 className="text-white font-medium mb-2">Trauma-Informed</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Safe spaces with gentle animations, easy escape routes, and crisis support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📱</span>
              </div>
              <h3 className="text-white font-medium mb-2">Mobile-First</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Optimized for one-handed use, large touch targets, and crisis accessibility.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="mt-8 alchm-card bg-white/5 backdrop-blur-xl border border-white/10">
          <h2 className="text-xl font-light text-white mb-4">Technical Excellence</h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Accessibility</h4>
              <ul className="text-white/70 space-y-1">
                <li>• WCAG 2.1 AA compliant</li>
                <li>• Screen reader announcements</li>
                <li>• Keyboard navigation support</li>
                <li>• High contrast mode</li>
                <li>• Reduced motion preferences</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">Performance</h4>
              <ul className="text-white/70 space-y-1">
                <li>• Lazy-loaded after user interaction</li>
                <li>• GPU-accelerated animations</li>
                <li>• Mobile keyboard optimization</li>
                <li>• Safe area handling for iOS</li>
                <li>• Crisis button positioning</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Click the floating Khepera button in the bottom-right corner to start chatting,
            or use <kbd className="bg-white/20 px-2 py-1 rounded text-xs">Cmd+K</kbd> to open quickly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function KheperaDemoPage() {
  return (
    <CompleteKheperaChat enabled={true}>
      <DemoContent />
    </CompleteKheperaChat>
  );
}