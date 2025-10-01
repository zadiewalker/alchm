/**
 * ALCHM Design System Showcase
 * "A living demonstration of digital sanctuary principles"
 * 
 * This component showcases the complete ALCHM Digital Sanctuary Design System
 * in action, demonstrating how intentional restraint creates powerful experiences.
 */

'use client';

import React, { useState } from 'react';
import {
  SanctuaryText,
  SanctuaryButton,
  SanctuaryCard,
  SanctuaryInput,
  SanctuaryTextarea,
  SanctuaryProgress,
  SanctuaryBadge,
  CrisisFloatingButton,
  HeartSparkle,
  SanctuaryContainer,
  SanctuarySection,
  SanctuaryStack
} from '@/components/ui/SanctuaryComponents';

export default function DesignSystemShowcase() {
  const [progress, setProgress] = useState(65);
  const [journalEntry, setJournalEntry] = useState('');
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-gray-50 to-white">
      {/* Hero Section - Monument to Intention */}
      <SanctuarySection spacing="sanctuary" className="hero-sanctuary">
        <SanctuaryContainer size="reading">
          <div className="text-center hero-content">
            <SanctuaryText 
              variant="monument" 
              className="hero-title mb-6 bg-gradient-to-r from-sanctuary-gray-800 to-sage-600 bg-clip-text text-transparent"
            >
              Digital Sanctuary
            </SanctuaryText>
            <SanctuaryText variant="subhead" className="hero-subtitle text-sanctuary-gray-600 max-w-2xl mx-auto">
              Where technology disappears and only the intention to heal remains. 
              Experience design that breathes with gentle confidence.
            </SanctuaryText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <SanctuaryButton variant="sage-primary" size="lg" sparkle>
                Begin Your Journey
                <HeartSparkle color="amber" size="sm" />
              </SanctuaryButton>
              <SanctuaryButton variant="sanctuary-secondary" size="lg">
                Explore the System
              </SanctuaryButton>
            </div>
          </div>
        </SanctuaryContainer>
      </SanctuarySection>

      {/* Typography System */}
      <SanctuarySection spacing="comfortable">
        <SanctuaryContainer size="reading">
          <SanctuaryCard className="p-8">
            <SanctuaryText variant="heading" className="mb-6 text-center">
              Whispered Confidence Typography
            </SanctuaryText>
            <SanctuaryStack spacing="generous">
              <div>
                <SanctuaryText variant="monument">Monument Text</SanctuaryText>
                <SanctuaryText variant="whisper" className="mt-1">
                  For landing pages and hero statements - 48px, luxurious letter-spacing
                </SanctuaryText>
              </div>
              <div>
                <SanctuaryText variant="display">Display Text</SanctuaryText>
                <SanctuaryText variant="whisper" className="mt-1">
                  For section headers and key elements - 32px, generous spacing
                </SanctuaryText>
              </div>
              <div>
                <SanctuaryText variant="heading">Heading Text</SanctuaryText>
                <SanctuaryText variant="whisper" className="mt-1">
                  For page titles and major sections - 24px, confident weight
                </SanctuaryText>
              </div>
              <div>
                <SanctuaryText variant="subhead">Subhead Text</SanctuaryText>
                <SanctuaryText variant="whisper" className="mt-1">
                  For subsection headers - 18px, medium weight
                </SanctuaryText>
              </div>
              <div>
                <SanctuaryText variant="emphasis">Emphasis Text</SanctuaryText>
                <SanctuaryText variant="whisper" className="mt-1">
                  For highlighted body content - 16px, medium weight
                </SanctuaryText>
              </div>
              <div>
                <SanctuaryText variant="body">
                  Body text provides comfortable reading with generous letter-spacing and thoughtful line height. 
                  Every word is given space to breathe, creating a premium reading experience that never feels cramped or hurried.
                </SanctuaryText>
                <SanctuaryText variant="whisper" className="mt-1">
                  Primary reading text - 14px, comfortable leading
                </SanctuaryText>
              </div>
              <div>
                <SanctuaryText variant="whisper">
                  Whisper text for supporting information, hints, and metadata
                </SanctuaryText>
              </div>
            </SanctuaryStack>
          </SanctuaryCard>
        </SanctuaryContainer>
      </SanctuarySection>

      {/* Color Palette */}
      <SanctuarySection spacing="comfortable">
        <SanctuaryContainer size="standard">
          <SanctuaryText variant="heading" className="text-center mb-12">
            Calibrated Serenity Palette
          </SanctuaryText>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Primary Sage */}
            <SanctuaryCard className="p-6 text-center">
              <div className="w-16 h-16 bg-sage-400 rounded-xl mx-auto mb-4 shadow-soft"></div>
              <SanctuaryText variant="subhead" className="mb-2">Primary Sage</SanctuaryText>
              <SanctuaryText variant="whisper">#a4b792</SanctuaryText>
              <SanctuaryText variant="body" className="mt-3">
                The heart of our sanctuary - representing growth, healing, and natural wisdom.
              </SanctuaryText>
            </SanctuaryCard>

            {/* Sanctuary White */}
            <SanctuaryCard className="p-6 text-center">
              <div className="w-16 h-16 bg-white border border-sanctuary-gray-200 rounded-xl mx-auto mb-4 shadow-soft"></div>
              <SanctuaryText variant="subhead" className="mb-2">Sanctuary White</SanctuaryText>
              <SanctuaryText variant="whisper">#fefefe</SanctuaryText>
              <SanctuaryText variant="body" className="mt-3">
                Pure, warm whites that feel inviting rather than stark or clinical.
              </SanctuaryText>
            </SanctuaryCard>

            {/* Healing Warm */}
            <SanctuaryCard className="p-6 text-center">
              <div className="w-16 h-16 bg-warm-amber rounded-xl mx-auto mb-4 shadow-soft"></div>
              <SanctuaryText variant="subhead" className="mb-2">Healing Amber</SanctuaryText>
              <SanctuaryText variant="whisper">#d4a574</SanctuaryText>
              <SanctuaryText variant="body" className="mt-3">
                Gentle warmth for positive reinforcement and celebration moments.
              </SanctuaryText>
            </SanctuaryCard>

            {/* Gentle Rose */}
            <SanctuaryCard className="p-6 text-center">
              <div className="w-16 h-16 bg-gentle-rose rounded-xl mx-auto mb-4 shadow-soft"></div>
              <SanctuaryText variant="subhead" className="mb-2">Gentle Rose</SanctuaryText>
              <SanctuaryText variant="whisper">#c5a5a5</SanctuaryText>
              <SanctuaryText variant="body" className="mt-3">
                Soft, nurturing tones for emotional support and heart-centered experiences.
              </SanctuaryText>
            </SanctuaryCard>
          </div>
        </SanctuaryContainer>
      </SanctuarySection>

      {/* Interactive Components */}
      <SanctuarySection spacing="comfortable">
        <SanctuaryContainer size="reading">
          <SanctuaryText variant="heading" className="text-center mb-12">
            Interactive Sanctuary Elements
          </SanctuaryText>
          
          <div className="grid gap-8">
            {/* Buttons */}
            <SanctuaryCard className="p-8">
              <SanctuaryText variant="subhead" className="mb-6">Button Variations</SanctuaryText>
              <div className="flex flex-wrap gap-4">
                <SanctuaryButton variant="sage-primary" sparkle>
                  Primary Action
                </SanctuaryButton>
                <SanctuaryButton variant="sanctuary-secondary">
                  Secondary Action
                </SanctuaryButton>
                <SanctuaryButton variant="gentle-ghost">
                  Gentle Touch
                </SanctuaryButton>
              </div>
            </SanctuaryCard>

            {/* Form Elements */}
            <SanctuaryCard className="p-8">
              <SanctuaryText variant="subhead" className="mb-6">Sacred Form Elements</SanctuaryText>
              <SanctuaryStack spacing="generous">
                <SanctuaryInput
                  label="Your Name"
                  placeholder="How would you like to be addressed?"
                  hint="This helps us personalize your experience"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <SanctuaryTextarea
                  label="Reflection Space"
                  placeholder="What's on your heart today? Share whatever feels right..."
                  hint="This is your private space for thoughts and feelings"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  rows={4}
                />
              </SanctuaryStack>
            </SanctuaryCard>

            {/* Progress & Badges */}
            <SanctuaryCard className="p-8">
              <SanctuaryText variant="subhead" className="mb-6">Gentle Progress Recognition</SanctuaryText>
              <SanctuaryStack spacing="generous">
                <SanctuaryProgress 
                  value={progress} 
                  label="Healing Journey Progress"
                  showSparkle
                />
                <div className="flex flex-wrap gap-3">
                  <SanctuaryBadge variant="sage" sparkle>
                    7 Day Streak
                  </SanctuaryBadge>
                  <SanctuaryBadge variant="warm">
                    Mindful Writer
                  </SanctuaryBadge>
                  <SanctuaryBadge variant="calm">
                    Deep Reflector
                  </SanctuaryBadge>
                  <SanctuaryBadge variant="gentle">
                    Heart Centered
                  </SanctuaryBadge>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <SanctuaryButton 
                    variant="gentle-ghost" 
                    size="sm"
                    onClick={() => setProgress(Math.min(progress + 10, 100))}
                  >
                    Progress +10
                  </SanctuaryButton>
                  <SanctuaryButton 
                    variant="gentle-ghost" 
                    size="sm"
                    onClick={() => setProgress(Math.max(progress - 10, 0))}
                  >
                    Progress -10
                  </SanctuaryButton>
                </div>
              </SanctuaryStack>
            </SanctuaryCard>

            {/* Heart Sparkle Motif */}
            <SanctuaryCard className="p-8 text-center">
              <SanctuaryText variant="subhead" className="mb-6">Heart-Sparkle Positive Reinforcement</SanctuaryText>
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <HeartSparkle color="rose" size="lg" />
                  <SanctuaryText variant="whisper" className="block mt-2">Rose</SanctuaryText>
                </div>
                <div className="text-center">
                  <HeartSparkle color="amber" size="lg" />
                  <SanctuaryText variant="whisper" className="block mt-2">Amber</SanctuaryText>
                </div>
                <div className="text-center">
                  <HeartSparkle color="blue" size="lg" />
                  <SanctuaryText variant="whisper" className="block mt-2">Blue</SanctuaryText>
                </div>
                <div className="text-center">
                  <HeartSparkle color="sage" size="lg" />
                  <SanctuaryText variant="whisper" className="block mt-2">Sage</SanctuaryText>
                </div>
              </div>
              <SanctuaryText variant="body" className="text-sanctuary-gray-600">
                Gentle animations that celebrate progress without overwhelming the user. 
                Each sparkle feels like a warm acknowledgment of growth and effort.
              </SanctuaryText>
            </SanctuaryCard>
          </div>
        </SanctuaryContainer>
      </SanctuarySection>

      {/* Design Philosophy */}
      <SanctuarySection spacing="comfortable" className="bg-gradient-to-br from-sage-50 to-white">
        <SanctuaryContainer size="reading">
          <SanctuaryCard className="p-12 text-center">
            <SanctuaryText variant="display" className="mb-8 text-sage-700">
              "Technology that breathes with intention"
            </SanctuaryText>
            <SanctuaryStack spacing="generous">
              <SanctuaryText variant="body" className="text-sanctuary-gray-700 leading-relaxed">
                Every element in this design system serves a purpose beyond aesthetics. 
                The generous spacing allows thoughts to settle, the gentle transitions 
                never startle vulnerable users, and the sage color palette creates 
                a sense of natural growth and healing.
              </SanctuaryText>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-sage-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-sage-600 text-xl">🌿</span>
                  </div>
                  <SanctuaryText variant="emphasis" className="mb-2">Intentional Restraint</SanctuaryText>
                  <SanctuaryText variant="body" className="text-sanctuary-gray-600">
                    Every pixel serves the user's healing journey
                  </SanctuaryText>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-sage-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-sage-600 text-xl">💫</span>
                  </div>
                  <SanctuaryText variant="emphasis" className="mb-2">Quiet Confidence</SanctuaryText>
                  <SanctuaryText variant="body" className="text-sanctuary-gray-600">
                    Strong without being aggressive, clear without being harsh
                  </SanctuaryText>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-sage-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-sage-600 text-xl">🤲</span>
                  </div>
                  <SanctuaryText variant="emphasis" className="mb-2">Trauma-Informed Care</SanctuaryText>
                  <SanctuaryText variant="body" className="text-sanctuary-gray-600">
                    Every interaction designed to create safety, not stress
                  </SanctuaryText>
                </div>
              </div>
            </SanctuaryStack>
          </SanctuaryCard>
        </SanctuaryContainer>
      </SanctuarySection>

      {/* Crisis Support Button - Always available */}
      <CrisisFloatingButton />
    </div>
  );
}