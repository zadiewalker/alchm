'use client';

import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

/**
 * Accessibility Controls Component
 * 
 * Provides user controls for accessibility settings with trauma-informed design.
 * Accessible itself with proper ARIA labels, keyboard navigation, and screen reader support.
 */

interface AccessibilityControlsProps {
  className?: string;
  showAdvanced?: boolean;
  crisisMode?: boolean;
}

export function AccessibilityControls({ 
  className = '',
  showAdvanced = false,
  crisisMode = false
}: AccessibilityControlsProps) {
  const { settings, updateSettings, enableCrisisMode, disableCrisisMode, announceToScreenReader } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('text');

  const handleSettingChange = (setting: string, value: any) => {
    updateSettings({ [setting]: value });
    announceToScreenReader(`${setting} changed to ${value}`, 'polite');
  };

  const sections = [
    { id: 'text', label: 'Text & Display', icon: '📝' },
    { id: 'interaction', label: 'Interaction', icon: '👆' },
    { id: 'motion', label: 'Motion & Animation', icon: '🎭' },
    { id: 'cognitive', label: 'Cognitive Support', icon: '🧠' },
    { id: 'crisis', label: 'Crisis Support', icon: '🆘' },
  ];

  return (
    <div className={`accessibility-controls ${className}`}>
      {/* Main toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          accessibility-toggle-button touch-target-comfortable focus-ring
          ${crisisMode ? 'touch-target-crisis bg-accessible-error text-accessible-error' : 'bg-accessible-light text-accessible-dark'}
          border-2 border-current rounded-lg font-semibold
          hover:bg-accessible-sage hover:text-accessible-light
          transition-colors duration-200
        `}
        aria-expanded={isOpen}
        aria-label="Accessibility settings"
        aria-describedby="accessibility-description"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">♿</span>
          <span>Accessibility</span>
          <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
        </span>
      </button>

      <div id="accessibility-description" className="sr-only">
        Open accessibility settings to adjust text size, contrast, motion, and crisis support options
      </div>

      {/* Settings panel */}
      {isOpen && (
        <div 
          className={`
            accessibility-panel absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)]
            bg-accessible-light border-2 border-accessible-dark rounded-lg shadow-lg
            z-50 max-h-[80vh] overflow-hidden
            ${crisisMode ? 'border-accessible-error' : ''}
          `}
          role="dialog"
          aria-label="Accessibility settings"
          aria-modal="true"
        >
          {/* Crisis mode banner */}
          {settings.crisisMode && (
            <div className="bg-accessible-error text-accessible-error p-4 border-b-2 border-accessible-error">
              <div className="flex items-center gap-2">
                <span aria-hidden="true">🆘</span>
                <span className="font-bold">Crisis Support Mode Active</span>
              </div>
              <p className="text-sm mt-1">
                Interface optimized for crisis situations with larger buttons and simplified layout.
              </p>
              <button
                type="button"
                onClick={disableCrisisMode}
                className="mt-2 px-4 py-2 bg-accessible-light text-accessible-dark rounded focus-ring touch-target"
              >
                Disable Crisis Mode
              </button>
            </div>
          )}

          {/* Section navigation */}
          <div className="border-b-2 border-accessible-dark">
            <nav role="tablist" aria-label="Accessibility categories">
              <div className="flex overflow-x-auto">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    role="tab"
                    aria-selected={activeSection === section.id}
                    aria-controls={`panel-${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      px-4 py-3 text-sm font-medium whitespace-nowrap focus-ring
                      ${activeSection === section.id 
                        ? 'bg-accessible-sage text-accessible-light border-b-2 border-accessible-sage' 
                        : 'text-accessible-dark hover:bg-accessible-light'
                      }
                      touch-target min-h-12
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true">{section.icon}</span>
                      <span>{section.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Settings content */}
          <div className="max-h-80 overflow-y-auto">
            {/* Text & Display Settings */}
            {activeSection === 'text' && (
              <div role="tabpanel" id="panel-text" className="p-4 space-y-4">
                <h3 className="text-lg font-bold text-accessible-dark">Text & Display</h3>
                
                {/* Font Size */}
                <fieldset className="space-y-2">
                  <legend className="font-semibold text-accessible-dark">Font Size</legend>
                  <div className="space-y-2">
                    {[
                      { value: 'default', label: 'Default (16px)' },
                      { value: 'comfortable', label: 'Comfortable (18px)' },
                      { value: 'large', label: 'Large (20px)' },
                      { value: 'crisis', label: 'Crisis Mode (22px)' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 touch-target cursor-pointer">
                        <input
                          type="radio"
                          name="fontSize"
                          value={option.value}
                          checked={settings.fontSize === option.value}
                          onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                          className="focus-ring"
                        />
                        <span className="text-accessible-dark">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Contrast */}
                <fieldset className="space-y-2">
                  <legend className="font-semibold text-accessible-dark">Contrast</legend>
                  <div className="space-y-2">
                    {[
                      { value: 'default', label: 'Standard Contrast' },
                      { value: 'high', label: 'High Contrast' },
                      { value: 'crisis', label: 'Maximum Contrast' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 touch-target cursor-pointer">
                        <input
                          type="radio"
                          name="contrast"
                          value={option.value}
                          checked={settings.contrast === option.value}
                          onChange={(e) => handleSettingChange('contrast', e.target.value)}
                          className="focus-ring"
                        />
                        <span className="text-accessible-dark">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Line Height */}
                <fieldset className="space-y-2">
                  <legend className="font-semibold text-accessible-dark">Line Spacing</legend>
                  <div className="space-y-2">
                    {[
                      { value: 'default', label: 'Default' },
                      { value: 'comfortable', label: 'Comfortable' },
                      { value: 'loose', label: 'Loose (better for stress)' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 touch-target cursor-pointer">
                        <input
                          type="radio"
                          name="lineHeight"
                          value={option.value}
                          checked={settings.lineHeight === option.value}
                          onChange={(e) => handleSettingChange('lineHeight', e.target.value)}
                          className="focus-ring"
                        />
                        <span className="text-accessible-dark">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {/* Interaction Settings */}
            {activeSection === 'interaction' && (
              <div role="tabpanel" id="panel-interaction" className="p-4 space-y-4">
                <h3 className="text-lg font-bold text-accessible-dark">Interaction</h3>
                
                {/* Touch Target Size */}
                <fieldset className="space-y-2">
                  <legend className="font-semibold text-accessible-dark">Button & Touch Size</legend>
                  <div className="space-y-2">
                    {[
                      { value: 'default', label: 'Default (44px minimum)' },
                      { value: 'comfortable', label: 'Comfortable (48px)' },
                      { value: 'crisis', label: 'Crisis Mode (56px)' },
                      { value: 'emergency', label: 'Emergency (64px)' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 touch-target cursor-pointer">
                        <input
                          type="radio"
                          name="touchTargetSize"
                          value={option.value}
                          checked={settings.touchTargetSize === option.value}
                          onChange={(e) => handleSettingChange('touchTargetSize', e.target.value)}
                          className="focus-ring"
                        />
                        <span className="text-accessible-dark">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Focus Indicators */}
                <fieldset className="space-y-2">
                  <legend className="font-semibold text-accessible-dark">Focus Indicators</legend>
                  <div className="space-y-2">
                    {[
                      { value: 'default', label: 'Standard Focus Ring' },
                      { value: 'enhanced', label: 'Enhanced Visibility' },
                      { value: 'crisis', label: 'High Visibility' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 touch-target cursor-pointer">
                        <input
                          type="radio"
                          name="focusIndicators"
                          value={option.value}
                          checked={settings.focusIndicators === option.value}
                          onChange={(e) => handleSettingChange('focusIndicators', e.target.value)}
                          className="focus-ring"
                        />
                        <span className="text-accessible-dark">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Keyboard Navigation */}
                <label className="flex items-center gap-2 touch-target cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.keyboardNavigationMode}
                    onChange={(e) => handleSettingChange('keyboardNavigationMode', e.target.checked)}
                    className="focus-ring"
                  />
                  <span className="text-accessible-dark">
                    Enhanced keyboard navigation
                  </span>
                </label>
              </div>
            )}

            {/* Motion & Animation Settings */}
            {activeSection === 'motion' && (
              <div role="tabpanel" id="panel-motion" className="p-4 space-y-4">
                <h3 className="text-lg font-bold text-accessible-dark">Motion & Animation</h3>
                
                <label className="flex items-center gap-2 touch-target cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.respectReducedMotion}
                    onChange={(e) => handleSettingChange('respectReducedMotion', e.target.checked)}
                    className="focus-ring"
                  />
                  <span className="text-accessible-dark">
                    Respect system reduced motion setting
                  </span>
                </label>

                <label className="flex items-center gap-2 touch-target cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.disableAnimations}
                    onChange={(e) => handleSettingChange('disableAnimations', e.target.checked)}
                    className="focus-ring"
                  />
                  <span className="text-accessible-dark">
                    Disable all animations
                  </span>
                </label>

                <div className="text-sm text-accessible-dark bg-accessible-light p-3 rounded border">
                  <p className="font-semibold">Note:</p>
                  <p>Reducing motion can help with vestibular disorders, seizures, and anxiety.</p>
                </div>
              </div>
            )}

            {/* Cognitive Support Settings */}
            {activeSection === 'cognitive' && (
              <div role="tabpanel" id="panel-cognitive" className="p-4 space-y-4">
                <h3 className="text-lg font-bold text-accessible-dark">Cognitive Support</h3>
                
                <label className="flex items-center gap-2 touch-target cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dyslexiaFriendly}
                    onChange={(e) => handleSettingChange('dyslexiaFriendly', e.target.checked)}
                    className="focus-ring"
                  />
                  <span className="text-accessible-dark">
                    Dyslexia-friendly text formatting
                  </span>
                </label>

                <label className="flex items-center gap-2 touch-target cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.adhdhSupport}
                    onChange={(e) => handleSettingChange('adhdhSupport', e.target.checked)}
                    className="focus-ring"
                  />
                  <span className="text-accessible-dark">
                    ADHD support (reduced distractions)
                  </span>
                </label>

                <label className="flex items-center gap-2 touch-target cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.memorySupport}
                    onChange={(e) => handleSettingChange('memorySupport', e.target.checked)}
                    className="focus-ring"
                  />
                  <span className="text-accessible-dark">
                    Memory support (persistent navigation)
                  </span>
                </label>

                <label className="flex items-center gap-2 touch-target cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.simplifiedInterface}
                    onChange={(e) => handleSettingChange('simplifiedInterface', e.target.checked)}
                    className="focus-ring"
                  />
                  <span className="text-accessible-dark">
                    Simplified interface
                  </span>
                </label>
              </div>
            )}

            {/* Crisis Support Settings */}
            {activeSection === 'crisis' && (
              <div role="tabpanel" id="panel-crisis" className="p-4 space-y-4">
                <h3 className="text-lg font-bold text-accessible-dark">Crisis Support</h3>
                
                <div className="space-y-4">
                  {!settings.crisisMode ? (
                    <button
                      type="button"
                      onClick={enableCrisisMode}
                      className="w-full touch-target-crisis bg-accessible-error text-accessible-light font-bold rounded-lg focus-ring hover:opacity-90"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span aria-hidden="true">🆘</span>
                        <span>Enable Crisis Support Mode</span>
                      </span>
                    </button>
                  ) : (
                    <div className="bg-accessible-error text-accessible-light p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span aria-hidden="true">🆘</span>
                        <span className="font-bold">Crisis Mode Active</span>
                      </div>
                      <p className="text-sm mb-3">
                        Maximum accessibility settings enabled for crisis support.
                      </p>
                      <button
                        type="button"
                        onClick={disableCrisisMode}
                        className="w-full touch-target bg-accessible-light text-accessible-dark font-semibold rounded focus-ring hover:opacity-90"
                      >
                        Disable Crisis Mode
                      </button>
                    </div>
                  )}

                  <label className="flex items-center gap-2 touch-target cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.screenReaderOptimized}
                      onChange={(e) => handleSettingChange('screenReaderOptimized', e.target.checked)}
                      className="focus-ring"
                    />
                    <span className="text-accessible-dark">
                      Screen reader optimizations
                    </span>
                  </label>

                  <div className="text-sm text-accessible-dark bg-accessible-warning p-3 rounded border">
                    <p className="font-semibold">Crisis Resources:</p>
                    <p>Crisis mode provides immediate access to emergency contacts and simplifies the interface for users in distress.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Close button */}
          <div className="border-t-2 border-accessible-dark p-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full touch-target bg-accessible-sage text-accessible-light font-semibold rounded-lg focus-ring hover:opacity-90"
            >
              Close Accessibility Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessibilityControls;