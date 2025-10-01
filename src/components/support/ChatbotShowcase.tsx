'use client';

/**
 * ALCHM Technical Support Chatbot Showcase
 * 
 * This component demonstrates all features of the technical support chatbot
 * system, showcasing the Jony Ive-inspired design philosophy and trauma-informed
 * user experience principles.
 */

import React, { useState, useEffect } from 'react';
import { TechnicalSupportChatbot } from './TechnicalSupportChatbot';
import { CrisisAwareChatbot } from './CrisisAwareChatbot';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface ShowcaseSection {
  id: string;
  title: string;
  description: string;
  features: string[];
  demoAction?: () => void;
}

export function ChatbotShowcase() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [designMode, setDesignMode] = useState<'sage' | 'sanctuary' | 'high-contrast'>('sage');
  const [crisisDetection, setCrisisDetection] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  const showcaseSections: ShowcaseSection[] = [
    {
      id: 'design-philosophy',
      title: 'Jony Ive Design Philosophy',
      description: 'Radical simplicity meets healing-centered design. Every element serves the user\'s emotional well-being.',
      features: [
        'Sage green (#a4b792) primary color palette',
        'Translucent containers with backdrop blur',
        'Mathematical harmony with 8px grid system',
        'System fonts for performance and familiarity',
        'Generous whitespace as a design element'
      ]
    },
    {
      id: 'trauma-informed',
      title: 'Trauma-Informed Interface',
      description: 'Every interaction considers users may be in vulnerable states, designing for safety and comfort.',
      features: [
        '72px+ touch targets for crisis situations',
        'Gentle animations (300ms, never jarring)',
        'High contrast mode for visual stress',
        'Reduced motion respect for sensory sensitivity',
        'One-handed operation support'
      ]
    },
    {
      id: 'crisis-detection',
      title: 'Crisis Detection & Response',
      description: 'Advanced natural language processing identifies crisis indicators and provides immediate, caring support.',
      features: [
        'Multi-level crisis assessment (mild to immediate)',
        'Contextual analysis to prevent false positives',
        'Direct connection to 988 Crisis Lifeline',
        'Seamless human escalation protocols',
        'Emergency contact integration'
      ],
      demoAction: () => setCrisisDetection(true)
    },
    {
      id: 'accessibility',
      title: 'Universal Accessibility',
      description: 'WCAG 2.1 AA compliance with additional trauma-informed accessibility features.',
      features: [
        'Screen reader optimization with ARIA labels',
        'Keyboard navigation support',
        'Voice input capability',
        'Large text options for distressed users',
        'Color contrast mode for crisis visibility'
      ]
    },
    {
      id: 'mobile-optimization',
      title: 'Mobile-First Design',
      description: 'Optimized for users accessing support on mobile devices, often in challenging circumstances.',
      features: [
        'Full-screen mobile interface',
        'Haptic feedback for important actions',
        'iOS zoom prevention (16px base fonts)',
        'Offline functionality for essential features',
        'One-thumb operation patterns'
      ]
    },
    {
      id: 'technical-features',
      title: 'Advanced Technical Support',
      description: 'Intelligent diagnostic tools and visual problem-solving capabilities.',
      features: [
        'Screenshot and log file analysis',
        'Step-by-step guided troubleshooting',
        'Progress tracking with visual indicators',
        'Quick action buttons for common issues',
        'File upload with drag-and-drop support'
      ]
    }
  ];

  const designTokens = {
    sage: {
      primary: '#a4b792',
      hover: '#93a682',
      active: '#7a8c6a',
      light: '#f6f8f4',
      muted: '#d6e0cd'
    },
    sanctuary: {
      background: '#fefcfb',
      glass: 'rgba(254, 252, 251, 0.95)',
      surface: 'rgba(255, 255, 255, 0.98)'
    }
  };

  return (
    <div className="chatbot-showcase min-h-screen bg-gradient-to-br from-sage-400 to-sage-500">
      {/* Showcase Header */}
      <div className="showcase-header py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-light text-sanctuary mb-6 tracking-tight">
            ALCHM Technical Support Chatbot
          </h1>
          <p className="text-xl text-sanctuary/90 leading-relaxed mb-8 max-w-3xl mx-auto">
            A healing-centered approach to technical support, designed with Jony Ive's 
            philosophy of radical simplicity and obsessive attention to user well-being.
          </p>
          
          {/* Design Mode Toggle */}
          <div className="design-controls flex items-center justify-center gap-4 mb-8">
            <span className="text-sanctuary/80 font-medium">Design Mode:</span>
            <div className="flex rounded-lg bg-sanctuary-white/20 p-1">
              {(['sage', 'sanctuary', 'high-contrast'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setDesignMode(mode)}
                  className={`px-4 py-2 rounded-md transition-all font-medium capitalize ${
                    designMode === mode
                      ? 'bg-sanctuary-white text-sage-600 shadow-soft'
                      : 'text-sanctuary hover:bg-sanctuary-white/10'
                  }`}
                >
                  {mode.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="showcase-content px-6 pb-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {showcaseSections.map(section => (
              <Card
                key={section.id}
                variant="sanctuary"
                className="showcase-card hover:transform hover:scale-105 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle level="h3" className="text-sage-600 mb-3">
                    {section.title}
                  </CardTitle>
                  <p className="text-sanctuary-gray-600 leading-relaxed">
                    {section.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {section.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-sage-400 mt-1 flex-shrink-0">✨</span>
                        <span className="text-sanctuary-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {section.demoAction && (
                    <Button
                      onClick={section.demoAction}
                      variant="secondary"
                      size="sm"
                      className="w-full"
                    >
                      Try Demo
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Design Token Showcase */}
          <Card variant="elevated" className="design-tokens-showcase mb-12">
            <CardHeader>
              <CardTitle level="h2" className="text-sage-600 mb-4">
                Design System & Tokens
              </CardTitle>
              <p className="text-sanctuary-gray-600">
                The visual foundation that creates sanctuary in every pixel.
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Color Palette */}
                <div>
                  <h4 className="font-medium text-sanctuary-gray-800 mb-4">
                    Sage Green Palette
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(designTokens.sage).map(([name, value]) => (
                      <div key={name} className="flex items-center gap-3">
                        <div
                          className="w-12 h-8 rounded-lg border border-sanctuary-gray-200 shadow-inner"
                          style={{ backgroundColor: value }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm capitalize text-sanctuary-gray-800">
                            {name}
                          </div>
                          <div className="font-mono text-xs text-sanctuary-gray-600">
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography & Spacing */}
                <div>
                  <h4 className="font-medium text-sanctuary-gray-800 mb-4">
                    Typography & Spacing
                  </h4>
                  <div className="space-y-4">
                    <div className="typography-sample">
                      <div className="text-2xl font-light text-sanctuary-gray-800 mb-1">
                        System Font Stack
                      </div>
                      <div className="text-sm text-sanctuary-gray-600 font-mono">
                        -apple-system, BlinkMacSystemFont, "SF Pro Display"
                      </div>
                    </div>
                    
                    <div className="spacing-sample">
                      <div className="text-sm font-medium text-sanctuary-gray-800 mb-2">
                        8px Grid System
                      </div>
                      <div className="flex gap-2">
                        {[8, 16, 24, 32, 48].map(size => (
                          <div key={size} className="text-center">
                            <div
                              className="bg-sage-200 rounded"
                              style={{ width: `${size}px`, height: '16px' }}
                            />
                            <div className="text-xs text-sanctuary-gray-600 mt-1">
                              {size}px
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demo Controls */}
          <Card variant="featured" className="demo-controls text-center">
            <CardHeader>
              <CardTitle level="h2" className="text-white mb-4">
                Interactive Experience
              </CardTitle>
              <p className="text-white/90">
                Experience the chatbot system with full functionality enabled.
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Button
                  onClick={() => setActiveDemo('chatbot')}
                  variant="secondary"
                  size="lg"
                  className="min-w-[160px]"
                >
                  <span className="mr-2">💬</span>
                  Open Chatbot
                </Button>
                
                <Button
                  onClick={() => setCrisisDetection(!crisisDetection)}
                  variant="secondary"
                  size="lg"
                  className="min-w-[160px]"
                >
                  <span className="mr-2">🚨</span>
                  {crisisDetection ? 'Disable' : 'Enable'} Crisis Mode
                </Button>
                
                <Button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  variant="secondary"
                  size="lg"
                  className="min-w-[160px]"
                >
                  <span className="mr-2">{voiceEnabled ? '🎤' : '🔇'}</span>
                  {voiceEnabled ? 'Disable' : 'Enable'} Voice
                </Button>
              </div>
              
              {/* Feature Status Indicators */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    crisisDetection ? 'bg-red-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-white/80">Crisis Detection</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    voiceEnabled ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-white/80">Voice Input</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sage-200" />
                  <span className="text-white/80">Mobile Optimized</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Chatbot Instance */}
      {activeDemo === 'chatbot' && (
        <>
          <TechnicalSupportChatbot />
          <CrisisAwareChatbot
            onCrisisDetected={(detection) => {
              console.log('Crisis detected:', detection);
            }}
            onEscalateToHuman={() => {
              console.log('Escalating to human support');
            }}
            emergencyContacts={[
              { name: 'Crisis Counselor', phone: '988', type: 'crisis' },
              { name: 'Local Emergency', phone: '911', type: 'medical' }
            ]}
          />
        </>
      )}

      {/* Background Elements */}
      <div className="showcase-background">
        <div className="floating-elements">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .chatbot-showcase {
          position: relative;
          overflow-x: hidden;
        }

        .showcase-header {
          position: relative;
          z-index: 2;
        }

        .showcase-content {
          position: relative;
          z-index: 2;
        }

        .showcase-card {
          height: 100%;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .design-tokens-showcase {
          background: linear-gradient(135deg, rgba(254, 252, 251, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
        }

        .demo-controls {
          background: linear-gradient(145deg, var(--sage-primary) 0%, var(--sage-hover) 100%);
          position: relative;
          overflow: hidden;
        }

        .demo-controls::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
          pointer-events: none;
        }

        .typography-sample {
          padding: 1rem;
          background: rgba(164, 183, 146, 0.05);
          border-radius: 0.5rem;
          border: 1px solid rgba(164, 183, 146, 0.15);
        }

        .spacing-sample {
          padding: 1rem;
          background: rgba(164, 183, 146, 0.05);
          border-radius: 0.5rem;
          border: 1px solid rgba(164, 183, 146, 0.15);
        }

        .showcase-background {
          position: fixed;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }

        .floating-elements {
          position: absolute;
          inset: 0;
        }

        .floating-element {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(254, 252, 251, 0.3);
          border-radius: 50%;
          animation: float-up linear infinite;
        }

        @keyframes float-up {
          from {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          to {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .showcase-card {
            transition: none;
          }
          
          .floating-element {
            animation: none;
            opacity: 0.1;
          }
        }

        .design-controls button {
          min-width: 120px;
        }

        @media (max-width: 768px) {
          .design-controls {
            flex-direction: column;
            gap: 1rem;
          }
          
          .design-controls > div {
            flex-direction: column;
            width: 100%;
          }
          
          .design-controls button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatbotShowcase;