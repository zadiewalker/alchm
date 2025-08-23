'use client';

import React, { useState, useEffect } from 'react';
import { SacredCard, SacredText, SacredButton } from '@/components/SacredUIFoundation';
import { GranularAIController, FeatureControl } from '@/lib/granular-ai-controller';

// ===== AI FEATURE TOGGLE TYPES =====

export interface AIFeatureToggleProps {
  featureName: string;
  featureControl: FeatureControl;
  controller: GranularAIController;
  onToggle: (enabled: boolean) => void;
  onConfigChange: (config: Partial<FeatureControl>) => void;
  disabled?: boolean;
  className?: string;
}

export interface FeatureToggleState {
  enabled: boolean;
  showAdvanced: boolean;
  pendingChanges: Partial<FeatureControl>;
  hasUnsavedChanges: boolean;
}

export interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label: string;
  helpText: string;
}

export interface DataProcessingLevelProps {
  currentLevel: 'none' | 'anonymized' | 'pseudonymized' | 'identifiable';
  onChange: (level: 'none' | 'anonymized' | 'pseudonymized' | 'identifiable') => void;
  disabled?: boolean;
}

// ===== AI FEATURE TOGGLE COMPONENT =====

export function AIFeatureToggle({
  featureName,
  featureControl,
  controller,
  onToggle,
  onConfigChange,
  disabled = false,
  className = ''
}: AIFeatureToggleProps) {
  const [state, setState] = useState<FeatureToggleState>({
    enabled: featureControl.enabled,
    showAdvanced: false,
    pendingChanges: {},
    hasUnsavedChanges: false
  });

  const handleToggle = (enabled: boolean) => {
    setState(prev => ({
      ...prev,
      enabled,
      pendingChanges: { ...prev.pendingChanges, enabled },
      hasUnsavedChanges: true
    }));
  };

  const handleAdvancedChange = (key: keyof FeatureControl, value: any) => {
    setState(prev => ({
      ...prev,
      pendingChanges: { ...prev.pendingChanges, [key]: value },
      hasUnsavedChanges: true
    }));
  };

  const handleSave = async () => {
    const result = await controller.updateFeatureControl(
      featureName as any,
      state.pendingChanges,
      true // User consent
    );

    if (result.success) {
      onConfigChange(state.pendingChanges);
      onToggle(state.enabled);
      setState(prev => ({
        ...prev,
        pendingChanges: {},
        hasUnsavedChanges: false
      }));
    }
  };

  const handleReset = () => {
    setState({
      enabled: featureControl.enabled,
      showAdvanced: false,
      pendingChanges: {},
      hasUnsavedChanges: false
    });
  };

  const getFeatureIcon = () => {
    const icons: Record<string, string> = {
      emotionalAnalysis: '💝',
      patternRecognition: '🔍',
      personalizedPrompts: '💭',
      culturalAdaptation: '🌍',
      resourceSuggestions: '💡',
      crisisDetection: '🚨',
      contentAnalysis: '📊',
      conversationalAI: '💬',
      proactiveSupport: '🤝'
    };
    return icons[featureName] || '⚙️';
  };

  const getFeatureDescription = () => {
    const descriptions: Record<string, string> = {
      emotionalAnalysis: 'AI analyzes your writing to identify emotions and mood patterns',
      patternRecognition: 'AI identifies recurring themes and behavioral patterns in your entries',
      personalizedPrompts: 'AI generates reflection questions based on your previous entries',
      culturalAdaptation: 'AI adapts responses to honor your cultural background and values',
      resourceSuggestions: 'AI recommends coping strategies and support resources',
      crisisDetection: 'AI monitors for signs of crisis and provides immediate safety resources',
      contentAnalysis: 'AI processes your journal content to provide insights and support',
      conversationalAI: 'AI provides conversational responses to your journal entries',
      proactiveSupport: 'AI proactively offers support based on detected needs'
    };
    return descriptions[featureName] || 'AI feature with configurable settings';
  };

  const isCriticalFeature = () => {
    return featureName === 'crisisDetection' || !featureControl.canBeOverridden;
  };

  return (
    <SacredCard 
      variant={state.enabled ? 'warm' : 'gentle'} 
      className={`ai-feature-toggle ${className}`}
    >
      <div className="space-y-breath">
        {/* Main Toggle Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-gentle flex-grow">
            <span className="text-2xl">{getFeatureIcon()}</span>
            <div className="flex-grow">
              <div className="flex items-center gap-gentle mb-whisper">
                <SacredText variant="caption" className="font-semibold">
                  {featureName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </SacredText>
                {isCriticalFeature() && (
                  <span className="text-xs bg-deep-presence text-white px-whisper py-1 rounded">
                    Always On
                  </span>
                )}
                {featureControl.parentalApprovalRequired && (
                  <span className="text-xs bg-grounding-earth text-white px-whisper py-1 rounded">
                    Parental Approval
                  </span>
                )}
              </div>
              <SacredText variant="caption" className="text-sm text-subtle">
                {getFeatureDescription()}
              </SacredText>
            </div>
          </div>
          
          {/* Toggle Switch */}
          {!isCriticalFeature() && (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={state.enabled}
                onChange={(e) => handleToggle(e.target.checked)}
                disabled={disabled}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                state.enabled ? 'bg-grounding-earth' : 'bg-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  state.enabled ? 'translate-x-6' : 'translate-x-1'
                } mt-1`} />
              </div>
            </label>
          )}
        </div>

        {/* Feature Status */}
        <FeatureStatus 
          enabled={state.enabled}
          control={featureControl}
          pendingChanges={state.pendingChanges}
        />

        {/* Advanced Settings Toggle */}
        {state.enabled && (
          <div className="border-t border-tender-embrace pt-breath">
            <button
              onClick={() => setState(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
              className="flex items-center gap-gentle text-sm text-grounding-earth hover:underline"
            >
              <span>{state.showAdvanced ? '−' : '+'}</span>
              <span>Advanced Settings</span>
            </button>
          </div>
        )}

        {/* Advanced Settings Panel */}
        {state.enabled && state.showAdvanced && (
          <AdvancedSettings
            featureControl={featureControl}
            pendingChanges={state.pendingChanges}
            onChange={handleAdvancedChange}
            disabled={disabled}
          />
        )}

        {/* Action Buttons */}
        {state.hasUnsavedChanges && (
          <div className="flex gap-breath justify-end border-t border-tender-embrace pt-breath">
            <SacredButton
              intention="gentle"
              size="intimate"
              onClick={handleReset}
            >
              Reset
            </SacredButton>
            <SacredButton
              intention="primary"
              size="intimate"
              onClick={handleSave}
            >
              Save Changes
            </SacredButton>
          </div>
        )}
      </div>
    </SacredCard>
  );
}

// ===== FEATURE STATUS =====

interface FeatureStatusProps {
  enabled: boolean;
  control: FeatureControl;
  pendingChanges: Partial<FeatureControl>;
}

function FeatureStatus({ enabled, control, pendingChanges }: FeatureStatusProps) {
  const effectiveControl = { ...control, ...pendingChanges };
  
  if (!enabled) {
    return (
      <div className="flex items-center gap-gentle text-sm text-subtle">
        <span>⚪</span>
        <span>Feature disabled - no AI processing</span>
      </div>
    );
  }

  const getStatusColor = () => {
    const threshold = effectiveControl.confidenceThreshold;
    if (threshold >= 0.8) return 'text-green-600';
    if (threshold >= 0.6) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getDataProcessingDescription = () => {
    switch (effectiveControl.dataProcessingLevel) {
      case 'none': return 'No data processing';
      case 'anonymized': return 'Anonymized processing';
      case 'pseudonymized': return 'Pseudonymized processing';
      case 'identifiable': return 'Full data processing';
      default: return 'Unknown processing level';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-breath text-xs">
      <div className="flex items-center gap-whisper">
        <span className={getStatusColor()}>●</span>
        <span>Confidence: {Math.round(effectiveControl.confidenceThreshold * 100)}%</span>
      </div>
      <div className="flex items-center gap-whisper">
        <span>🔒</span>
        <span>{getDataProcessingDescription()}</span>
      </div>
    </div>
  );
}

// ===== ADVANCED SETTINGS =====

interface AdvancedSettingsProps {
  featureControl: FeatureControl;
  pendingChanges: Partial<FeatureControl>;
  onChange: (key: keyof FeatureControl, value: any) => void;
  disabled: boolean;
}

function AdvancedSettings({ featureControl, pendingChanges, onChange, disabled }: AdvancedSettingsProps) {
  const effectiveControl = { ...featureControl, ...pendingChanges };

  return (
    <SacredCard variant="gentle" className="space-y-breath">
      <SacredText variant="caption" className="font-semibold text-sm">
        Advanced Configuration
      </SacredText>
      
      {/* Confidence Threshold */}
      <div className="space-y-whisper">
        <ConfidenceSlider
          label="Confidence Threshold"
          helpText="Minimum AI confidence required before this feature activates"
          value={effectiveControl.confidenceThreshold}
          onChange={(value) => onChange('confidenceThreshold', value)}
          disabled={disabled}
        />
      </div>

      {/* Data Processing Level */}
      <div className="space-y-whisper">
        <SacredText variant="caption" className="text-sm font-medium">
          Data Processing Level
        </SacredText>
        <DataProcessingLevelSelector
          currentLevel={effectiveControl.dataProcessingLevel}
          onChange={(level) => onChange('dataProcessingLevel', level)}
          disabled={disabled}
        />
      </div>

      {/* Audit Level */}
      <div className="space-y-whisper">
        <SacredText variant="caption" className="text-sm font-medium">
          Audit Detail Level
        </SacredText>
        <AuditLevelSelector
          currentLevel={effectiveControl.auditLevel}
          onChange={(level) => onChange('auditLevel', level)}
          disabled={disabled}
        />
      </div>

      {/* Fallback Behavior */}
      <div className="space-y-whisper">
        <SacredText variant="caption" className="text-sm font-medium">
          Fallback Behavior
        </SacredText>
        <FallbackBehaviorSelector
          currentBehavior={effectiveControl.fallbackBehavior}
          onChange={(behavior) => onChange('fallbackBehavior', behavior)}
          disabled={disabled}
        />
      </div>

      {/* Consent Requirements */}
      <div className="space-y-whisper">
        <SacredText variant="caption" className="text-sm font-medium">
          Consent Requirements
        </SacredText>
        <div className="space-y-whisper">
          <label className="flex items-center gap-gentle cursor-pointer">
            <input
              type="checkbox"
              checked={effectiveControl.explicitConsentRequired}
              onChange={(e) => onChange('explicitConsentRequired', e.target.checked)}
              disabled={disabled}
              className="rounded border-2 border-grounding-earth text-grounding-earth focus:ring-grounding-earth"
            />
            <SacredText variant="caption" className="text-sm">
              Require explicit consent for each use
            </SacredText>
          </label>
          
          <label className="flex items-center gap-gentle cursor-pointer">
            <input
              type="checkbox"
              checked={effectiveControl.parentalApprovalRequired}
              onChange={(e) => onChange('parentalApprovalRequired', e.target.checked)}
              disabled={disabled}
              className="rounded border-2 border-grounding-earth text-grounding-earth focus:ring-grounding-earth"
            />
            <SacredText variant="caption" className="text-sm">
              Require parental approval (if under 18)
            </SacredText>
          </label>
        </div>
      </div>
    </SacredCard>
  );
}

// ===== CONFIDENCE SLIDER =====

function ConfidenceSlider({ label, helpText, value, onChange, disabled }: ConfidenceSliderProps) {
  const getSliderColor = () => {
    if (value >= 0.8) return 'bg-green-500';
    if (value >= 0.6) return 'bg-yellow-500';
    if (value >= 0.4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConfidenceLabel = () => {
    if (value >= 0.9) return 'Very High';
    if (value >= 0.7) return 'High';
    if (value >= 0.5) return 'Medium';
    if (value >= 0.3) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="space-y-whisper">
      <div className="flex items-center justify-between">
        <SacredText variant="caption" className="text-sm font-medium">
          {label}
        </SacredText>
        <div className="flex items-center gap-whisper">
          <span className="text-sm font-medium">{Math.round(value * 100)}%</span>
          <span className={`text-xs px-whisper py-1 rounded text-white ${getSliderColor()}`}>
            {getConfidenceLabel()}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${getSliderColor()} 0%, ${getSliderColor()} ${value * 100}%, #e5e5e5 ${value * 100}%, #e5e5e5 100%)`
          }}
        />
      </div>
      
      <SacredText variant="caption" className="text-xs text-subtle">
        {helpText}
      </SacredText>
    </div>
  );
}

// ===== DATA PROCESSING LEVEL SELECTOR =====

function DataProcessingLevelSelector({ currentLevel, onChange, disabled }: DataProcessingLevelProps) {
  const levels = [
    {
      value: 'none',
      label: 'No Processing',
      description: 'Feature disabled, no data processing',
      icon: '🚫'
    },
    {
      value: 'anonymized',
      label: 'Anonymized',
      description: 'All personal identifiers removed',
      icon: '🎭'
    },
    {
      value: 'pseudonymized',
      label: 'Pseudonymized',
      description: 'Identifiers replaced with pseudonyms',
      icon: '🔀'
    },
    {
      value: 'identifiable',
      label: 'Identifiable',
      description: 'Full data processing with identifiers',
      icon: '👤'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-whisper">
      {levels.map(level => (
        <label
          key={level.value}
          className={`cursor-pointer p-gentle border rounded-lg transition-colors ${
            currentLevel === level.value
              ? 'border-grounding-earth bg-tender-embrace'
              : 'border-gray-300 hover:border-grounding-earth'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name="dataProcessingLevel"
            value={level.value}
            checked={currentLevel === level.value}
            onChange={(e) => onChange(e.target.value as any)}
            disabled={disabled}
            className="sr-only"
          />
          <div className="text-center space-y-whisper">
            <div className="text-lg">{level.icon}</div>
            <div>
              <SacredText variant="caption" className="text-xs font-medium">
                {level.label}
              </SacredText>
              <SacredText variant="caption" className="text-xs text-subtle">
                {level.description}
              </SacredText>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}

// ===== AUDIT LEVEL SELECTOR =====

interface AuditLevelSelectorProps {
  currentLevel: 'none' | 'basic' | 'detailed' | 'comprehensive';
  onChange: (level: 'none' | 'basic' | 'detailed' | 'comprehensive') => void;
  disabled: boolean;
}

function AuditLevelSelector({ currentLevel, onChange, disabled }: AuditLevelSelectorProps) {
  const levels = [
    { value: 'none', label: 'None', icon: '⚪' },
    { value: 'basic', label: 'Basic', icon: '🔵' },
    { value: 'detailed', label: 'Detailed', icon: '🟡' },
    { value: 'comprehensive', label: 'Full', icon: '🟢' }
  ];

  return (
    <div className="flex gap-whisper">
      {levels.map(level => (
        <label
          key={level.value}
          className={`flex-1 cursor-pointer p-gentle border rounded text-center transition-colors ${
            currentLevel === level.value
              ? 'border-grounding-earth bg-tender-embrace'
              : 'border-gray-300 hover:border-grounding-earth'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name="auditLevel"
            value={level.value}
            checked={currentLevel === level.value}
            onChange={(e) => onChange(e.target.value as any)}
            disabled={disabled}
            className="sr-only"
          />
          <div className="space-y-whisper">
            <div className="text-sm">{level.icon}</div>
            <SacredText variant="caption" className="text-xs">
              {level.label}
            </SacredText>
          </div>
        </label>
      ))}
    </div>
  );
}

// ===== FALLBACK BEHAVIOR SELECTOR =====

interface FallbackBehaviorSelectorProps {
  currentBehavior: 'disable' | 'degrade' | 'human_handoff';
  onChange: (behavior: 'disable' | 'degrade' | 'human_handoff') => void;
  disabled: boolean;
}

function FallbackBehaviorSelector({ currentBehavior, onChange, disabled }: FallbackBehaviorSelectorProps) {
  const behaviors = [
    {
      value: 'disable',
      label: 'Disable',
      description: 'Turn off feature completely',
      icon: '⏹️'
    },
    {
      value: 'degrade',
      label: 'Degrade',
      description: 'Use simpler version',
      icon: '📉'
    },
    {
      value: 'human_handoff',
      label: 'Human Support',
      description: 'Escalate to human assistance',
      icon: '🤝'
    }
  ];

  return (
    <div className="space-y-whisper">
      {behaviors.map(behavior => (
        <label
          key={behavior.value}
          className={`cursor-pointer p-gentle border rounded-lg flex items-center gap-gentle transition-colors ${
            currentBehavior === behavior.value
              ? 'border-grounding-earth bg-tender-embrace'
              : 'border-gray-300 hover:border-grounding-earth'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name="fallbackBehavior"
            value={behavior.value}
            checked={currentBehavior === behavior.value}
            onChange={(e) => onChange(e.target.value as any)}
            disabled={disabled}
            className="sr-only"
          />
          <span className="text-lg">{behavior.icon}</span>
          <div className="flex-grow">
            <SacredText variant="caption" className="text-sm font-medium">
              {behavior.label}
            </SacredText>
            <SacredText variant="caption" className="text-xs text-subtle">
              {behavior.description}
            </SacredText>
          </div>
          {currentBehavior === behavior.value && (
            <span className="text-grounding-earth">✓</span>
          )}
        </label>
      ))}
    </div>
  );
}

// ===== EXPORT COMPONENT =====

export {
  AIFeatureToggle as default,
  ConfidenceSlider,
  DataProcessingLevelSelector,
  AdvancedSettings
};