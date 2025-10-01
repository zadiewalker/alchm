'use client';

import React, { useState } from 'react';
import {
  SomaticFoundation,
  SomaticContainer,
  SomaticBreathingGuide,
  SomaticSpacer,
  SomaticText,
  SomaticButton,
  SomaticToggle,
  SomaticFloatingActionButton,
  SomaticInput,
  SomaticTextarea,
  SomaticSelect,
  SomaticCard,
  SomaticCardHeader,
  SomaticCardContent,
  SomaticCardActions,
  SomaticProgressCard,
  SomaticEmptyState,
  SomaticModal,
  SomaticConfirmModal
} from './index';

/**
 * SomaticShowcase - Demonstration of the embodied design system
 * Shows how visual elements support nervous system regulation
 */
export function SomaticShowcase() {
  const [nervousSystemState, setNervousSystemState] = useState<'ventral' | 'sympathetic' | 'dorsal'>('ventral');
  const [breathingEnabled, setBreathingEnabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [progress, setProgress] = useState(65);

  const stateDescriptions = {
    ventral: 'Safe & Social - Regulated nervous system state. You feel calm, connected, and open to engagement.',
    sympathetic: 'Fight/Flight - Activated nervous system state. You may feel energized, alert, or anxious.',
    dorsal: 'Shutdown - Withdrawn nervous system state. You may feel tired, disconnected, or overwhelmed.'
  };

  const stateColors = {
    ventral: 'text-sage-600',
    sympathetic: 'text-yellow-600',
    dorsal: 'text-gray-600'
  };

  return (
    <SomaticFoundation 
      nervousSystemState={nervousSystemState}
      breathingEnabled={breathingEnabled}
      className="min-h-screen p-4"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <SomaticCard variant="sanctuary" elevation="moderate">
          <SomaticCardHeader>
            <SomaticText variant="heading" element="h1">
              🧘‍♀️ Somatic Design System Showcase
            </SomaticText>
            <SomaticText variant="body">
              Experience how visual design can support your nervous system and promote embodied wellness.
            </SomaticText>
          </SomaticCardHeader>

          <SomaticCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nervous System State Control */}
              <div>
                <SomaticText variant="heading" element="h3">
                  Current Nervous System State
                </SomaticText>
                <SomaticSpacer space="personal" />
                
                <div className="space-y-3">
                  {(['ventral', 'sympathetic', 'dorsal'] as const).map((state) => (
                    <label key={state} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="nervous-state"
                        value={state}
                        checked={nervousSystemState === state}
                        onChange={(e) => setNervousSystemState(e.target.value as any)}
                        className="sr-only"
                      />
                      <div className={`
                        w-4 h-4 rounded-full border-2 transition-all duration-200
                        ${nervousSystemState === state 
                          ? 'bg-sage-400 border-sage-400' 
                          : 'border-sage-300 hover:border-sage-400'
                        }
                      `} />
                      <SomaticText variant="body" className={`capitalize ${stateColors[state]}`}>
                        {state === 'ventral' ? 'Safe & Social' : 
                         state === 'sympathetic' ? 'Fight/Flight' : 
                         'Shutdown'}
                      </SomaticText>
                    </label>
                  ))}
                </div>

                <SomaticSpacer space="personal" />
                <SomaticText variant="body" className="text-sm text-sage-600 italic">
                  {stateDescriptions[nervousSystemState]}
                </SomaticText>
              </div>

              {/* Breathing Control */}
              <div>
                <SomaticText variant="heading" element="h3">
                  Breathing Support
                </SomaticText>
                <SomaticSpacer space="personal" />
                
                <SomaticToggle
                  checked={breathingEnabled}
                  onChange={setBreathingEnabled}
                  label="Enable breathing rhythms"
                  size="large"
                />

                <SomaticSpacer space="personal" />
                
                {breathingEnabled && (
                  <div className="text-center">
                    <SomaticBreathingGuide 
                      size="large" 
                      intensity="moderate" 
                    />
                    <SomaticSpacer space="intimate" />
                    <SomaticText variant="body" className="text-xs text-sage-500">
                      Follow the rhythm for regulation
                    </SomaticText>
                  </div>
                )}
              </div>
            </div>
          </SomaticCardContent>
        </SomaticCard>

        {/* Interactive Elements Showcase */}
        <SomaticCard variant="breathing" nervousSystemState={nervousSystemState}>
          <SomaticCardHeader>
            <SomaticText variant="heading" element="h2">
              Embodied Interactions
            </SomaticText>
            <SomaticText variant="body">
              Notice how these elements feel different in your body as you interact with them.
            </SomaticText>
          </SomaticCardHeader>

          <SomaticCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Buttons */}
              <div>
                <SomaticText variant="heading" element="h3">
                  Somatic Buttons
                </SomaticText>
                <SomaticSpacer space="personal" />
                
                <div className="space-y-4">
                  <SomaticButton 
                    variant="primary" 
                    size="standard"
                    nervousSystemAware={true}
                    onClick={() => console.log('Primary action')}
                  >
                    Primary Action
                  </SomaticButton>

                  <SomaticButton 
                    variant="gentle" 
                    size="large"
                    onClick={() => setShowModal(true)}
                  >
                    Open Modal Experience
                  </SomaticButton>

                  <SomaticButton 
                    variant="crisis" 
                    size="crisis"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Crisis Support
                  </SomaticButton>
                </div>
              </div>

              {/* Form Elements */}
              <div>
                <SomaticText variant="heading" element="h3">
                  Body-Aware Forms
                </SomaticText>
                <SomaticSpacer space="personal" />
                
                <div className="space-y-4">
                  <SomaticInput
                    value={inputValue}
                    onChange={setInputValue}
                    label="How are you feeling in your body?"
                    placeholder="Take a moment to notice..."
                    nervousSystemAware={true}
                    breathingSpace={true}
                  />

                  <SomaticSelect
                    value={selectValue}
                    onChange={setSelectValue}
                    label="What do you need right now?"
                    options={[
                      { value: 'grounding', label: 'Grounding & Stability' },
                      { value: 'calming', label: 'Calming & Soothing' },
                      { value: 'energizing', label: 'Gentle Energizing' },
                      { value: 'connection', label: 'Safe Connection' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </SomaticCardContent>
        </SomaticCard>

        {/* Progress & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SomaticProgressCard
            title="Nervous System Regulation"
            progress={progress}
            description="Your progress toward nervous system balance"
            icon="🌿"
            breathingSync={breathingEnabled}
          />

          <SomaticCard variant="grounding">
            <SomaticCardHeader>
              <SomaticText variant="heading" element="h3">
                Somatic Awareness
              </SomaticText>
            </SomaticCardHeader>
            
            <SomaticCardContent>
              <div className="space-y-4">
                <div className="somatic-body-awareness-guide">
                  <SomaticText variant="body" className="text-sm">
                    Notice any tension in your shoulders as you read this.
                  </SomaticText>
                </div>
                
                <div className="somatic-body-awareness-guide">
                  <SomaticText variant="body" className="text-sm">
                    Feel your feet on the ground and your breath moving naturally.
                  </SomaticText>
                </div>
                
                <div className="somatic-body-awareness-guide">
                  <SomaticText variant="body" className="text-sm">
                    Allow your jaw to soften and your eyes to relax.
                  </SomaticText>
                </div>
              </div>
            </SomaticCardContent>

            <SomaticCardActions alignment="center">
              <SomaticButton 
                variant="gentle" 
                size="standard"
                onClick={() => setProgress(Math.min(100, progress + 10))}
              >
                Practice Awareness
              </SomaticButton>
            </SomaticCardActions>
          </SomaticCard>
        </div>

        {/* Large Text Area for Writing */}
        <SomaticCard variant="sanctuary" elevation="subtle">
          <SomaticCardHeader>
            <SomaticText variant="heading" element="h2">
              Embodied Writing Space
            </SomaticText>
            <SomaticText variant="body">
              A writing environment designed to feel safe and supportive in your body.
            </SomaticText>
          </SomaticCardHeader>

          <SomaticCardContent>
            <SomaticTextarea
              value={textareaValue}
              onChange={setTextareaValue}
              label="Sacred Writing Space"
              placeholder="What wants to be expressed through you today? Notice how it feels to write with this much breathing room and gentle guidance..."
              rows={6}
              autoGrow={true}
              breathingGuide={breathingEnabled}
              helpText="This space holds whatever you need to express. Your words are safe here."
            />
          </SomaticCardContent>
        </SomaticCard>

        {/* Empty State Example */}
        {!inputValue && !textareaValue && (
          <SomaticEmptyState
            title="Your Journey Awaits"
            description="When you're ready, begin exploring the form fields above. Notice what it feels like to interact with elements designed for your nervous system."
            icon="🌱"
            action={
              <SomaticButton 
                variant="gentle" 
                onClick={() => document.querySelector('input')?.focus()}
              >
                Begin Exploring
              </SomaticButton>
            }
          />
        )}
      </div>

      {/* Floating Action Button */}
      <SomaticFloatingActionButton
        onClick={() => setShowModal(true)}
        label="Somatic Support"
        variant="sage"
        position="bottom-right"
        breathingEffect={breathingEnabled}
        icon="🫁"
      />

      {/* Modal Examples */}
      <SomaticModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Embodied Modal Experience"
        size="medium"
        breathingBackdrop={breathingEnabled}
        nervousSystemAware={true}
      >
        <div className="space-y-4">
          <SomaticText variant="body">
            Notice how this modal feels in your body. The gentle entry, breathing backdrop, 
            and contained space are all designed to support your nervous system.
          </SomaticText>
          
          <SomaticSpacer space="social" />
          
          <SomaticBreathingGuide size="medium" intensity="subtle" />
          
          <SomaticSpacer space="social" />
          
          <SomaticText variant="body" className="text-center text-sm text-sage-600">
            Take three deep breaths and notice any changes in your body.
          </SomaticText>

          <div className="flex justify-center pt-4">
            <SomaticButton 
              variant="gentle" 
              onClick={() => setShowModal(false)}
            >
              I Feel Complete
            </SomaticButton>
          </div>
        </div>
      </SomaticModal>

      <SomaticConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          alert('Crisis support activated - this would connect to real resources');
        }}
        title="Crisis Support"
        message="This would connect you with immediate crisis support resources. The system takes a moment for you to consider this important step."
        confirmText="Connect Now"
        cancelText="Not Right Now"
        variant="crisis"
        breathingSpace={true}
      />
    </SomaticFoundation>
  );
}