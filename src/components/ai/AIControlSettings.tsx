'use client';

import React, { useState, useEffect } from 'react';
import { SacredCard, SacredText, SacredButton, SacredGrid } from '@/components/SacredUIFoundation';
import { AIOptOutManager, AIInteractionLevel, AI_INTERACTION_LEVELS, UserAIPreferences, GranularAIControl } from '@/lib/ai-opt-out-manager';

// ===== AI CONTROL SETTINGS TYPES =====

export interface AIControlSettingsProps {
  userId: string;
  currentPreferences?: UserAIPreferences;
  onPreferencesUpdate: (preferences: UserAIPreferences) => void;
  onOptOut: () => void;
  className?: string;
}

export interface FeatureToggleState {
  [key: string]: boolean;
}

export interface ControlPanelState {
  activeTab: 'overview' | 'granular' | 'data' | 'alternatives';
  unsavedChanges: boolean;
  showOptOutFlow: boolean;
  showTransparencyReport: boolean;
}

// ===== AI CONTROL SETTINGS COMPONENT =====

export function AIControlSettings({
  userId,
  currentPreferences,
  onPreferencesUpdate,
  onOptOut,
  className = ''
}: AIControlSettingsProps) {
  const [controlState, setControlState] = useState<ControlPanelState>({
    activeTab: 'overview',
    unsavedChanges: false,
    showOptOutFlow: false,
    showTransparencyReport: false
  });

  const [selectedLevel, setSelectedLevel] = useState<keyof typeof AI_INTERACTION_LEVELS>(
    currentPreferences?.interactionLevel || 'standard'
  );

  const [granularControls, setGranularControls] = useState<FeatureToggleState>({});
  const [aiOptOutManager] = useState(() => AIOptOutManager.getInstance());

  useEffect(() => {
    if (currentPreferences) {
      setGranularControls({
        emotionalAnalysis: !currentPreferences.specificOptOuts.emotionalAnalysis,
        patternRecognition: !currentPreferences.specificOptOuts.patternRecognition,
        personalizedPrompts: !currentPreferences.specificOptOuts.personalizedPrompts,
        culturalAdaptation: !currentPreferences.specificOptOuts.culturalAdaptation,
        dataCollection: !currentPreferences.specificOptOuts.dataCollection
      });
    }
  }, [currentPreferences]);

  const handleLevelChange = (level: keyof typeof AI_INTERACTION_LEVELS) => {
    setSelectedLevel(level);
    setControlState(prev => ({ ...prev, unsavedChanges: true }));
    
    // Auto-configure granular controls based on level
    const levelConfig = AI_INTERACTION_LEVELS[level];
    setGranularControls({
      emotionalAnalysis: levelConfig.features.emotionalInsights,
      patternRecognition: levelConfig.features.patternRecognition,
      personalizedPrompts: levelConfig.features.aiPrompts,
      culturalAdaptation: levelConfig.features.culturalAdaptation,
      dataCollection: levelConfig.dataProcessing !== 'none'
    });
  };

  const handleGranularToggle = (feature: string, enabled: boolean) => {
    setGranularControls(prev => ({
      ...prev,
      [feature]: enabled
    }));
    setControlState(prev => ({ ...prev, unsavedChanges: true }));
  };

  const handleSaveChanges = async () => {
    const updatedPreferences: UserAIPreferences = {
      ...currentPreferences!,
      interactionLevel: selectedLevel,
      lastReviewDate: new Date().toISOString(),
      specificOptOuts: {
        emotionalAnalysis: !granularControls.emotionalAnalysis,
        patternRecognition: !granularControls.patternRecognition,
        personalizedPrompts: !granularControls.personalizedPrompts,
        culturalAdaptation: !granularControls.culturalAdaptation,
        dataCollection: !granularControls.dataCollection
      }
    };

    onPreferencesUpdate(updatedPreferences);
    setControlState(prev => ({ ...prev, unsavedChanges: false }));
  };

  const handleInitiateOptOut = async () => {
    setControlState(prev => ({ ...prev, showOptOutFlow: true }));
  };

  return (
    <SacredCard variant="gentle" className={`ai-control-settings ${className}`}>
      <div className="space-y-ritual">
        <AIControlHeader />
        
        <AIControlTabs
          activeTab={controlState.activeTab}
          onTabChange={(tab) => setControlState(prev => ({ ...prev, activeTab: tab }))}
        />

        <div className="tab-content">
          {controlState.activeTab === 'overview' && (
            <AILevelOverview
              selectedLevel={selectedLevel}
              onLevelChange={handleLevelChange}
              unsavedChanges={controlState.unsavedChanges}
              onSave={handleSaveChanges}
            />
          )}
          
          {controlState.activeTab === 'granular' && (
            <GranularControls
              controls={granularControls}
              onToggle={handleGranularToggle}
              selectedLevel={selectedLevel}
            />
          )}
          
          {controlState.activeTab === 'data' && (
            <DataAndPrivacy
              currentPreferences={currentPreferences}
              onShowTransparency={() => setControlState(prev => ({ ...prev, showTransparencyReport: true }))}
            />
          )}
          
          {controlState.activeTab === 'alternatives' && (
            <AlternativeOptions
              onInitiateOptOut={handleInitiateOptOut}
            />
          )}
        </div>

        {controlState.unsavedChanges && (
          <UnsavedChangesNotice onSave={handleSaveChanges} />
        )}

        {controlState.showOptOutFlow && (
          <OptOutFlowModal
            userId={userId}
            onClose={() => setControlState(prev => ({ ...prev, showOptOutFlow: false }))}
            onOptOut={onOptOut}
          />
        )}

        {controlState.showTransparencyReport && (
          <TransparencyReportModal
            onClose={() => setControlState(prev => ({ ...prev, showTransparencyReport: false }))}
          />
        )}
      </div>
    </SacredCard>
  );
}

// ===== AI CONTROL HEADER =====

function AIControlHeader() {
  return (
    <div className="text-center space-y-breath">
      <div className="text-3xl">⚙️</div>
      <SacredText variant="title" as="h3">
        AI Interaction Settings
      </SacredText>
      <SacredText variant="body">
        Control how AI assists your journaling journey. You have complete control over 
        your privacy and can change these settings at any time.
      </SacredText>
    </div>
  );
}

// ===== AI CONTROL TABS =====

interface AIControlTabsProps {
  activeTab: 'overview' | 'granular' | 'data' | 'alternatives';
  onTabChange: (tab: 'overview' | 'granular' | 'data' | 'alternatives') => void;
}

function AIControlTabs({ activeTab, onTabChange }: AIControlTabsProps) {
  const tabs = [
    { id: 'overview', label: 'AI Levels', icon: '📊' },
    { id: 'granular', label: 'Fine-Tune Features', icon: '🎛️' },
    { id: 'data', label: 'Data & Privacy', icon: '🔒' },
    { id: 'alternatives', label: 'AI-Free Options', icon: '📝' }
  ];

  return (
    <div className="flex border-b border-tender-embrace">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as any)}
          className={`flex-1 px-breath py-gentle text-center border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-grounding-earth text-grounding-earth'
              : 'border-transparent text-subtle hover:text-deep-presence'
          }`}
        >
          <div className="space-y-whisper">
            <div className="text-lg">{tab.icon}</div>
            <SacredText variant="caption" className="font-medium">
              {tab.label}
            </SacredText>
          </div>
        </button>
      ))}
    </div>
  );
}

// ===== AI LEVEL OVERVIEW =====

interface AILevelOverviewProps {
  selectedLevel: keyof typeof AI_INTERACTION_LEVELS;
  onLevelChange: (level: keyof typeof AI_INTERACTION_LEVELS) => void;
  unsavedChanges: boolean;
  onSave: () => void;
}

function AILevelOverview({ selectedLevel, onLevelChange, unsavedChanges, onSave }: AILevelOverviewProps) {
  return (
    <div className="space-y-ritual">
      <div className="text-center space-y-breath">
        <SacredText variant="title" as="h4">
          Choose Your AI Interaction Level
        </SacredText>
        <SacredText variant="body">
          Each level gives you different amounts of AI assistance while maintaining your privacy and control.
        </SacredText>
      </div>

      <SacredGrid columns={1} gap="breath">
        {Object.entries(AI_INTERACTION_LEVELS).map(([key, level]) => (
          <AILevelCard
            key={key}
            level={level}
            isSelected={selectedLevel === key}
            onSelect={() => onLevelChange(key as keyof typeof AI_INTERACTION_LEVELS)}
          />
        ))}
      </SacredGrid>

      {unsavedChanges && (
        <div className="text-center">
          <SacredButton
            intention="primary"
            size="comfortable"
            onClick={onSave}
          >
            Save Changes
          </SacredButton>
        </div>
      )}
    </div>
  );
}

// ===== AI LEVEL CARD =====

interface AILevelCardProps {
  level: AIInteractionLevel;
  isSelected: boolean;
  onSelect: () => void;
}

function AILevelCard({ level, isSelected, onSelect }: AILevelCardProps) {
  const getCardVariant = () => {
    if (isSelected) return 'warm';
    if (level.level === 'none') return 'gentle';
    return 'default';
  };

  const getLevelIcon = () => {
    switch (level.level) {
      case 'none': return '🤫';
      case 'minimal': return '🛡️';
      case 'standard': return '⚖️';
      case 'enhanced': return '🤝';
      default: return '⚙️';
    }
  };

  return (
    <SacredCard
      variant={getCardVariant()}
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-grounding-earth' : ''
      }`}
      onClick={onSelect}
    >
      <div className="space-y-breath">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-gentle">
            <span className="text-2xl">{getLevelIcon()}</span>
            <div>
              <SacredText variant="caption" className="font-medium">
                {level.name}
              </SacredText>
              <SacredText variant="caption" className="text-xs text-subtle">
                Data Processing: {level.dataProcessing}
              </SacredText>
            </div>
          </div>
          {isSelected && (
            <div className="text-grounding-earth">
              <span className="text-xl">✓</span>
            </div>
          )}
        </div>

        <SacredText variant="caption" className="text-sm">
          {level.description}
        </SacredText>

        <div className="space-y-whisper">
          <SacredText variant="caption" className="text-xs font-medium">
            Features Included:
          </SacredText>
          <div className="grid grid-cols-2 gap-whisper text-xs">
            {Object.entries(level.features).map(([feature, enabled]) => (
              <div key={feature} className={`flex items-center gap-whisper ${enabled ? 'text-grounding-earth' : 'text-subtle'}`}>
                <span>{enabled ? '✓' : '✗'}</span>
                <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-subtle border-t border-tender-embrace pt-whisper">
          <span className="flex items-center gap-whisper">
            <span>🚨</span>
            <span>Crisis safety: Always enabled</span>
          </span>
        </div>
      </div>
    </SacredCard>
  );
}

// ===== GRANULAR CONTROLS =====

interface GranularControlsProps {
  controls: FeatureToggleState;
  onToggle: (feature: string, enabled: boolean) => void;
  selectedLevel: keyof typeof AI_INTERACTION_LEVELS;
}

function GranularControls({ controls, onToggle, selectedLevel }: GranularControlsProps) {
  const [aiOptOutManager] = useState(() => AIOptOutManager.getInstance());
  const granularOptions = aiOptOutManager.getGranularControls();

  return (
    <div className="space-y-ritual">
      <div className="text-center space-y-breath">
        <SacredText variant="title" as="h4">
          Fine-Tune AI Features
        </SacredText>
        <SacredText variant="body">
          Customize individual AI features to match your comfort level and preferences.
        </SacredText>
      </div>

      <div className="space-y-breath">
        {granularOptions.map((option) => (
          <GranularControlCard
            key={option.feature}
            option={option}
            isEnabled={controls[option.feature.toLowerCase().replace(/\s+/g, '')] || false}
            onToggle={(enabled) => onToggle(option.feature.toLowerCase().replace(/\s+/g, ''), enabled)}
            parentLevel={selectedLevel}
          />
        ))}
      </div>

      <div className="text-center p-breath bg-healing-mist rounded-lg">
        <SacredText variant="caption" className="text-xs text-subtle">
          💡 These settings override your AI level selection for specific features
        </SacredText>
      </div>
    </div>
  );
}

// ===== GRANULAR CONTROL CARD =====

interface GranularControlCardProps {
  option: GranularAIControl;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  parentLevel: string;
}

function GranularControlCard({ option, isEnabled, onToggle, parentLevel }: GranularControlCardProps) {
  const canToggle = option.canOptOut;

  return (
    <SacredCard variant={isEnabled ? 'warm' : 'gentle'}>
      <div className="space-y-breath">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <div className="flex items-center gap-gentle mb-whisper">
              <SacredText variant="caption" className="font-medium">
                {option.feature}
              </SacredText>
              {!canToggle && (
                <span className="text-xs bg-deep-presence text-white px-whisper py-1 rounded">
                  Always On
                </span>
              )}
            </div>
            <SacredText variant="caption" className="text-sm text-subtle">
              {option.description}
            </SacredText>
          </div>
          
          {canToggle && (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => onToggle(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                isEnabled ? 'bg-grounding-earth' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                } mt-1`} />
              </div>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-breath">
          <div>
            <SacredText variant="caption" className="text-xs font-medium text-grounding-earth mb-whisper">
              Benefits
            </SacredText>
            <ul className="space-y-whisper">
              {option.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-whisper text-xs">
                  <span className="text-grounding-earth">+</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <SacredText variant="caption" className="text-xs font-medium text-subtle mb-whisper">
              Considerations
            </SacredText>
            <ul className="space-y-whisper">
              {option.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-whisper text-xs text-subtle">
                  <span>•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SacredCard>
  );
}

// ===== DATA AND PRIVACY =====

interface DataAndPrivacyProps {
  currentPreferences?: UserAIPreferences;
  onShowTransparency: () => void;
}

function DataAndPrivacy({ currentPreferences, onShowTransparency }: DataAndPrivacyProps) {
  return (
    <div className="space-y-ritual">
      <div className="text-center space-y-breath">
        <SacredText variant="title" as="h4">
          Your Data & Privacy
        </SacredText>
        <SacredText variant="body">
          Understand how your data is handled and exercise your privacy rights.
        </SacredText>
      </div>

      <div className="space-y-breath">
        <DataProcessingStatus currentPreferences={currentPreferences} />
        <PrivacyRights />
        <DataControls onShowTransparency={onShowTransparency} />
      </div>
    </div>
  );
}

// ===== DATA PROCESSING STATUS =====

function DataProcessingStatus({ currentPreferences }: { currentPreferences?: UserAIPreferences }) {
  const processingLevel = currentPreferences ? 
    AI_INTERACTION_LEVELS[currentPreferences.interactionLevel].dataProcessing : 'none';

  const getStatusColor = () => {
    switch (processingLevel) {
      case 'none': return 'text-green-600';
      case 'anonymized': return 'text-yellow-600';
      case 'encrypted': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDescription = () => {
    switch (processingLevel) {
      case 'none': return 'No AI processing of your journal entries';
      case 'anonymized': return 'Basic processing with complete anonymization';
      case 'encrypted': return 'Full AI processing with end-to-end encryption';
      default: return 'Processing level not determined';
    }
  };

  return (
    <SacredCard variant="gentle">
      <div className="space-y-breath">
        <div className="flex items-center gap-gentle">
          <span className="text-2xl">🔐</span>
          <div>
            <SacredText variant="caption" className="font-medium">
              Current Data Processing
            </SacredText>
            <SacredText variant="caption" className={`text-sm ${getStatusColor()}`}>
              {processingLevel.charAt(0).toUpperCase() + processingLevel.slice(1)}
            </SacredText>
          </div>
        </div>
        
        <SacredText variant="caption" className="text-sm text-subtle">
          {getStatusDescription()}
        </SacredText>

        {currentPreferences && (
          <div className="text-xs text-subtle">
            <p>Last updated: {new Date(currentPreferences.lastReviewDate).toLocaleDateString()}</p>
            <p>Consent given: {new Date(currentPreferences.consentTimestamp).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </SacredCard>
  );
}

// ===== PRIVACY RIGHTS =====

function PrivacyRights() {
  const rights = [
    'Right to access all your data',
    'Right to export your journal entries',
    'Right to delete your data completely',
    'Right to modify consent preferences',
    'Right to opt out of AI processing',
    'Right to data portability'
  ];

  return (
    <SacredCard variant="default">
      <div className="space-y-breath">
        <div className="flex items-center gap-gentle">
          <span className="text-2xl">⚖️</span>
          <SacredText variant="caption" className="font-medium">
            Your Privacy Rights
          </SacredText>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-whisper">
          {rights.map((right, index) => (
            <div key={index} className="flex items-start gap-whisper text-sm">
              <span className="text-grounding-earth">✓</span>
              <span>{right}</span>
            </div>
          ))}
        </div>
      </div>
    </SacredCard>
  );
}

// ===== DATA CONTROLS =====

function DataControls({ onShowTransparency }: { onShowTransparency: () => void }) {
  return (
    <SacredCard variant="gentle">
      <div className="space-y-breath">
        <SacredText variant="caption" className="font-medium">
          Data Management Actions
        </SacredText>
        
        <SacredGrid columns={2} gap="breath">
          <SacredButton
            intention="gentle"
            size="comfortable"
            onClick={onShowTransparency}
          >
            📊 View Transparency Report
          </SacredButton>
          
          <SacredButton
            intention="gentle"
            size="comfortable"
            onClick={() => {/* Export data */}}
          >
            📦 Export My Data
          </SacredButton>
          
          <SacredButton
            intention="gentle"
            size="comfortable"
            onClick={() => {/* Review data */}}
          >
            👁️ Review Stored Data
          </SacredButton>
          
          <SacredButton
            intention="release"
            size="comfortable"
            onClick={() => {/* Delete data */}}
          >
            🗑️ Delete AI Data
          </SacredButton>
        </SacredGrid>
      </div>
    </SacredCard>
  );
}

// ===== ALTERNATIVE OPTIONS =====

function AlternativeOptions({ onInitiateOptOut }: { onInitiateOptOut: () => void }) {
  const [aiOptOutManager] = useState(() => AIOptOutManager.getInstance());
  const analogAlternative = aiOptOutManager.generateAnalogAlternative ? 
    aiOptOutManager.generateAnalogAlternative() : {
      title: 'Pure Analog Journaling',
      features: ['Human-curated prompts', 'Privacy-first design', 'Cultural wisdom'],
      benefits: ['Complete AI-free experience', 'Traditional approaches', 'Full privacy'],
      promptPreview: ['How are you feeling today?', 'What brought you joy?', 'What challenge did you overcome?']
    };

  return (
    <div className="space-y-ritual">
      <div className="text-center space-y-breath">
        <SacredText variant="title" as="h4">
          AI-Free Journaling Options
        </SacredText>
        <SacredText variant="body">
          Prefer to journal without AI assistance? We offer rich analog experiences that honor traditional wisdom.
        </SacredText>
      </div>

      <AnalogJournalingPreview alternative={analogAlternative} />
      
      <div className="text-center space-y-breath">
        <SacredButton
          intention="primary"
          size="comfortable"
          onClick={onInitiateOptOut}
        >
          Switch to AI-Free Journaling
        </SacredButton>
        
        <SacredText variant="caption" className="text-xs text-subtle">
          You can return to AI-assisted journaling at any time
        </SacredText>
      </div>
    </div>
  );
}

// ===== ANALOG JOURNALING PREVIEW =====

interface AnalogJournalingPreviewProps {
  alternative: {
    title: string;
    features: string[];
    benefits: string[];
    promptPreview: string[];
  };
}

function AnalogJournalingPreview({ alternative }: AnalogJournalingPreviewProps) {
  return (
    <SacredCard variant="warm">
      <div className="space-y-breath">
        <div className="text-center">
          <span className="text-3xl">📝</span>
          <SacredText variant="caption" className="font-medium">
            {alternative.title}
          </SacredText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-breath">
          <div>
            <SacredText variant="caption" className="text-sm font-medium mb-whisper">
              Features
            </SacredText>
            <ul className="space-y-whisper">
              {alternative.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-whisper text-sm">
                  <span className="text-grounding-earth">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <SacredText variant="caption" className="text-sm font-medium mb-whisper">
              Benefits
            </SacredText>
            <ul className="space-y-whisper">
              {alternative.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-whisper text-sm">
                  <span className="text-grounding-earth">+</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <SacredText variant="caption" className="text-sm font-medium mb-whisper">
            Sample Prompts
          </SacredText>
          <div className="space-y-whisper">
            {alternative.promptPreview.map((prompt, index) => (
              <div key={index} className="p-gentle bg-healing-mist rounded text-sm italic">
                "{prompt}"
              </div>
            ))}
          </div>
        </div>
      </div>
    </SacredCard>
  );
}

// ===== UNSAVED CHANGES NOTICE =====

function UnsavedChangesNotice({ onSave }: { onSave: () => void }) {
  return (
    <div className="fixed bottom-breath right-breath bg-grounding-earth text-white p-breath rounded-lg shadow-lg">
      <div className="flex items-center gap-breath">
        <span className="text-sm">You have unsaved changes</span>
        <SacredButton
          intention="primary"
          size="intimate"
          onClick={onSave}
        >
          Save
        </SacredButton>
      </div>
    </div>
  );
}

// ===== OPT OUT FLOW MODAL =====

interface OptOutFlowModalProps {
  userId: string;
  onClose: () => void;
  onOptOut: () => void;
}

function OptOutFlowModal({ userId, onClose, onOptOut }: OptOutFlowModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [optOutChoices, setOptOutChoices] = useState({
    reason: '',
    alternative: '',
    dataHandling: ''
  });

  const handleComplete = () => {
    onOptOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <SacredCard variant="gentle" className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-ritual">
          <div className="text-center">
            <SacredText variant="title" as="h3">
              AI Opt-Out Process
            </SacredText>
            <SacredText variant="body">
              Step {currentStep} of 4
            </SacredText>
          </div>

          <OptOutStep
            step={currentStep}
            choices={optOutChoices}
            onChoiceChange={(choices) => setOptOutChoices(choices)}
            onNext={() => setCurrentStep(prev => Math.min(prev + 1, 4))}
            onPrevious={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            onComplete={handleComplete}
            onCancel={onClose}
          />
        </div>
      </SacredCard>
    </div>
  );
}

// ===== OPT OUT STEP =====

interface OptOutStepProps {
  step: number;
  choices: any;
  onChoiceChange: (choices: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

function OptOutStep({ step, choices, onChoiceChange, onNext, onPrevious, onComplete, onCancel }: OptOutStepProps) {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-breath">
            <SacredText variant="caption" className="font-medium">
              Are you sure you want to disable AI features?
            </SacredText>
            <div className="space-y-breath">
              <button
                onClick={() => { onChoiceChange({ ...choices, reason: 'complete_optout' }); onNext(); }}
                className="w-full p-breath border rounded hover:bg-tender-embrace text-left"
              >
                Yes, disable all AI features
              </button>
              <button
                onClick={() => { onChoiceChange({ ...choices, reason: 'minimal_ai' }); onNext(); }}
                className="w-full p-breath border rounded hover:bg-tender-embrace text-left"
              >
                Switch to minimal AI (crisis safety only)
              </button>
              <button
                onClick={onCancel}
                className="w-full p-breath border rounded hover:bg-tender-embrace text-left"
              >
                Cancel - keep current settings
              </button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-breath text-center">
            <span className="text-3xl">✅</span>
            <SacredText variant="caption" className="font-medium">
              Opt-Out Complete
            </SacredText>
            <SacredText variant="body">
              Your AI preferences have been updated. You can re-enable AI features at any time in your settings.
            </SacredText>
            <SacredButton intention="primary" onClick={onComplete}>
              Continue to AI-Free Journaling
            </SacredButton>
          </div>
        );
      
      default:
        return (
          <div className="space-y-breath">
            <SacredText variant="body">
              Step {step} content would be implemented here...
            </SacredText>
            <div className="flex gap-breath">
              <SacredButton intention="gentle" onClick={onPrevious}>
                Previous
              </SacredButton>
              <SacredButton intention="primary" onClick={onNext}>
                Next
              </SacredButton>
            </div>
          </div>
        );
    }
  };

  return renderStep();
}

// ===== TRANSPARENCY REPORT MODAL =====

function TransparencyReportModal({ onClose }: { onClose: () => void }) {
  const [aiOptOutManager] = useState(() => AIOptOutManager.getInstance());
  const report = aiOptOutManager.generateAITransparencyReport();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <SacredCard variant="gentle" className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-ritual">
          <div className="flex items-center justify-between">
            <SacredText variant="title" as="h3">
              AI Transparency Report
            </SacredText>
            <button
              onClick={onClose}
              className="text-2xl hover:text-grounding-earth"
            >
              ×
            </button>
          </div>

          <div className="space-y-ritual">
            <TransparencySection
              title="What AI Does for You"
              icon="🤖"
              items={report.whatAIDoes}
              type="positive"
            />
            
            <TransparencySection
              title="What AI Does NOT Do"
              icon="🚫"
              items={report.whatAIDoesNOT}
              type="negative"
            />
            
            <DataUsageSection data={report.howYourDataIsUsed} />
            
            <TransparencySection
              title="Your Rights"
              icon="⚖️"
              items={report.yourRights}
              type="neutral"
            />
            
            <TransparencySection
              title="Safety Measures"
              icon="🛡️"
              items={report.safetyMeasures}
              type="positive"
            />
          </div>
        </div>
      </SacredCard>
    </div>
  );
}

// ===== TRANSPARENCY SECTION =====

interface TransparencySectionProps {
  title: string;
  icon: string;
  items: string[];
  type: 'positive' | 'negative' | 'neutral';
}

function TransparencySection({ title, icon, items, type }: TransparencySectionProps) {
  const getIconForType = () => {
    switch (type) {
      case 'positive': return '✓';
      case 'negative': return '✗';
      default: return '•';
    }
  };

  const getColorForType = () => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <SacredCard variant="gentle">
      <div className="space-y-breath">
        <div className="flex items-center gap-gentle">
          <span className="text-2xl">{icon}</span>
          <SacredText variant="caption" className="font-medium">
            {title}
          </SacredText>
        </div>
        
        <ul className="space-y-whisper">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-gentle text-sm">
              <span className={getColorForType()}>{getIconForType()}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </SacredCard>
  );
}

// ===== DATA USAGE SECTION =====

function DataUsageSection({ data }: { data: any }) {
  return (
    <SacredCard variant="gentle">
      <div className="space-y-breath">
        <div className="flex items-center gap-gentle">
          <span className="text-2xl">📊</span>
          <SacredText variant="caption" className="font-medium">
            How Your Data Is Used
          </SacredText>
        </div>
        
        <div className="space-y-breath">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-whisper">
              <SacredText variant="caption" className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </SacredText>
              <SacredText variant="caption" className="text-sm text-subtle">
                {value as string}
              </SacredText>
            </div>
          ))}
        </div>
      </div>
    </SacredCard>
  );
}

// ===== EXPORT COMPONENT =====

export {
  AIControlSettings as default,
  AILevelCard,
  GranularControls,
  TransparencyReportModal
};