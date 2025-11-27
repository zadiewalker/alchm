'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SacredCard, SacredText, SacredButton, SacredGrid } from '@/components/SacredUIFoundation';
import { AIControlSettings } from '@/components/AIControlSettings';
import { AIFeatureToggle } from '@/components/AIFeatureToggle';
import { GranularAIController, GranularAIConfig } from '@/lib/granular-ai-controller';
import { AIOptOutManager, UserAIPreferences } from '@/lib/ai-opt-out-manager';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';

// ===== AI CONTROLS PAGE TYPES =====

export interface AIControlsPageState {
  loading: boolean;
  saving: boolean;
  preferences: UserAIPreferences | null;
  controller: GranularAIController | null;
  activeSection: 'overview' | 'features' | 'sessions' | 'privacy';
  unsavedChanges: boolean;
  showOptOutFlow: boolean;
}

export interface ControlSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ComponentType<any>;
}

// ===== AI CONTROLS PAGE COMPONENT =====

export default function AIControlsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showNotification } = useNotification();

  const [state, setState] = useState<AIControlsPageState>({
    loading: true,
    saving: false,
    preferences: null,
    controller: null,
    activeSection: 'overview',
    unsavedChanges: false,
    showOptOutFlow: false
  });

  // Initialize page data
  useEffect(() => {
    if (user && !authLoading) {
      initializeAIControls();
    }
  }, [user, authLoading]);

  const initializeAIControls = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      // Load user AI preferences
      const preferences = await loadUserAIPreferences(user.uid);
      
      // Initialize granular AI controller
      const controller = new GranularAIController(user.uid, preferences);
      
      setState(prev => ({
        ...prev,
        preferences,
        controller,
        loading: false
      }));

    } catch (error) {
      console.error('Failed to initialize AI controls:', error);
      showNotification('Failed to load AI settings', 'error');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePreferencesUpdate = async (updatedPreferences: UserAIPreferences) => {
    try {
      setState(prev => ({ ...prev, saving: true }));

      // Update preferences in backend
      await saveUserAIPreferences(user.uid, updatedPreferences);
      
      // Reinitialize controller with new preferences
      const newController = new GranularAIController(user.uid, updatedPreferences);
      
      setState(prev => ({
        ...prev,
        preferences: updatedPreferences,
        controller: newController,
        unsavedChanges: false,
        saving: false
      }));

      showNotification('AI settings updated successfully', 'success');

    } catch (error) {
      console.error('Failed to update AI preferences:', error);
      showNotification('Failed to save AI settings', 'error');
      setState(prev => ({ ...prev, saving: false }));
    }
  };

  const handleOptOut = async () => {
    try {
      setState(prev => ({ ...prev, saving: true }));

      const optOutPreferences: UserAIPreferences = {
        ...state.preferences!,
        interactionLevel: 'none',
        explicitOptOut: true,
        lastReviewDate: new Date().toISOString(),
        specificOptOuts: {
          emotionalAnalysis: true,
          patternRecognition: true,
          personalizedPrompts: true,
          culturalAdaptation: true,
          dataCollection: true
        }
      };

      await handlePreferencesUpdate(optOutPreferences);
      
      setState(prev => ({ ...prev, showOptOutFlow: false }));
      showNotification('Successfully opted out of AI features', 'success');

    } catch (error) {
      console.error('Failed to opt out of AI:', error);
      showNotification('Failed to opt out of AI features', 'error');
      setState(prev => ({ ...prev, saving: false }));
    }
  };

  const controlSections: ControlSection[] = [
    {
      id: 'overview',
      title: 'AI Interaction Levels',
      description: 'Choose your overall level of AI assistance',
      icon: '📊',
      component: AIOverviewSection
    },
    {
      id: 'features',
      title: 'Individual Features',
      description: 'Fine-tune specific AI capabilities',
      icon: '🎛️',
      component: AIFeaturesSection
    },
    {
      id: 'sessions',
      title: 'Session Controls',
      description: 'Manage AI usage limits and timeouts',
      icon: '⏱️',
      component: AISessionSection
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      description: 'Control data processing and retention',
      icon: '🔒',
      component: AIPrivacySection
    }
  ];

  if (authLoading || state.loading) {
    return <AIControlsLoading />;
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (!state.preferences || !state.controller) {
    return <AIControlsError onRetry={initializeAIControls} />;
  }

  return (
    <div className="min-h-screen bg-sacred-canvas p-breath">
      <div className="max-w-6xl mx-auto space-y-ritual">
        {/* Page Header */}
        <AIControlsHeader 
          preferences={state.preferences}
          onEmergencyOptOut={() => setState(prev => ({ ...prev, showOptOutFlow: true }))}
        />

        {/* Navigation */}
        <AIControlsNavigation
          sections={controlSections}
          activeSection={state.activeSection}
          onSectionChange={(section) => setState(prev => ({ ...prev, activeSection: section as any }))}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-ritual">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AIControlsSidebar
              preferences={state.preferences}
              controller={state.controller}
              onShowOptOut={() => setState(prev => ({ ...prev, showOptOutFlow: true }))}
            />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {state.activeSection === 'overview' && (
              <AIOverviewSection
                preferences={state.preferences}
                controller={state.controller}
                onUpdate={handlePreferencesUpdate}
              />
            )}
            
            {state.activeSection === 'features' && (
              <AIFeaturesSection
                preferences={state.preferences}
                controller={state.controller}
                onUpdate={handlePreferencesUpdate}
              />
            )}
            
            {state.activeSection === 'sessions' && (
              <AISessionSection
                preferences={state.preferences}
                controller={state.controller}
                onUpdate={handlePreferencesUpdate}
              />
            )}
            
            {state.activeSection === 'privacy' && (
              <AIPrivacySection
                preferences={state.preferences}
                controller={state.controller}
                onUpdate={handlePreferencesUpdate}
              />
            )}
          </div>
        </div>

        {/* Unsaved Changes Notice */}
        {state.unsavedChanges && (
          <UnsavedChangesNotice
            onSave={() => {/* Save all changes */}}
            onDiscard={() => setState(prev => ({ ...prev, unsavedChanges: false }))}
          />
        )}

        {/* Opt-Out Flow Modal */}
        {state.showOptOutFlow && (
          <OptOutFlowModal
            onClose={() => setState(prev => ({ ...prev, showOptOutFlow: false }))}
            onOptOut={handleOptOut}
            loading={state.saving}
          />
        )}
      </div>
    </div>
  );
}

// ===== AI CONTROLS HEADER =====

interface AIControlsHeaderProps {
  preferences: UserAIPreferences;
  onEmergencyOptOut: () => void;
}

function AIControlsHeader({ preferences, onEmergencyOptOut }: AIControlsHeaderProps) {
  const getStatusColor = () => {
    switch (preferences.interactionLevel) {
      case 'none': return 'text-gray-600';
      case 'minimal': return 'text-yellow-600';
      case 'standard': return 'text-blue-600';
      case 'enhanced': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (preferences.interactionLevel) {
      case 'none': return '🚫';
      case 'minimal': return '🛡️';
      case 'standard': return '⚖️';
      case 'enhanced': return '🤝';
      default: return '⚙️';
    }
  };

  return (
    <SacredCard variant="warm" className="text-center">
      <div className="space-y-breath">
        <div className="text-4xl">⚙️</div>
        <SacredText variant="title" as="h1">
          AI Interaction Controls
        </SacredText>
        
        <div className="flex items-center justify-center gap-gentle">
          <span className="text-2xl">{getStatusIcon()}</span>
          <div>
            <SacredText variant="caption" className="font-medium">
              Current Level: {preferences.interactionLevel.charAt(0).toUpperCase() + preferences.interactionLevel.slice(1)}
            </SacredText>
            <SacredText variant="caption" className={`text-sm ${getStatusColor()}`}>
              Last updated: {new Date(preferences.lastReviewDate).toLocaleDateString()}
            </SacredText>
          </div>
        </div>

        <SacredText variant="body">
          Take full control of how AI assists your journaling journey. 
          All changes take effect immediately and can be modified at any time.
        </SacredText>

        {/* Emergency Opt-Out */}
        <div className="border-t border-tender-embrace pt-breath">
          <SacredButton
            intention="release"
            size="intimate"
            onClick={onEmergencyOptOut}
          >
            🚨 Emergency Opt-Out
          </SacredButton>
          <SacredText variant="caption" className="text-xs text-subtle mt-whisper">
            Immediately disable all AI features
          </SacredText>
        </div>
      </div>
    </SacredCard>
  );
}

// ===== AI CONTROLS NAVIGATION =====

interface AIControlsNavigationProps {
  sections: ControlSection[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

function AIControlsNavigation({ sections, activeSection, onSectionChange }: AIControlsNavigationProps) {
  return (
    <div className="flex border-b border-tender-embrace bg-white rounded-lg p-whisper">
      {sections.map(section => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`flex-1 px-breath py-gentle text-center border-b-2 transition-colors ${
            activeSection === section.id
              ? 'border-grounding-earth text-grounding-earth'
              : 'border-transparent text-subtle hover:text-deep-presence'
          }`}
        >
          <div className="space-y-whisper">
            <div className="text-lg">{section.icon}</div>
            <div>
              <SacredText variant="caption" className="font-medium text-xs">
                {section.title}
              </SacredText>
              <SacredText variant="caption" className="text-xs text-subtle">
                {section.description}
              </SacredText>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ===== AI CONTROLS SIDEBAR =====

interface AIControlsSidebarProps {
  preferences: UserAIPreferences;
  controller: GranularAIController;
  onShowOptOut: () => void;
}

function AIControlsSidebar({ preferences, controller, onShowOptOut }: AIControlsSidebarProps) {
  const [controlReport, setControlReport] = useState<any>(null);

  useEffect(() => {
    const report = controller.generateUserControlReport();
    setControlReport(report);
  }, [controller, preferences]);

  if (!controlReport) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-breath">
      {/* Quick Status */}
      <SacredCard variant="gentle">
        <div className="space-y-breath">
          <SacredText variant="caption" className="font-medium">
            Quick Status
          </SacredText>
          
          <div className="space-y-whisper text-sm">
            <div className="flex justify-between">
              <span>Active Features:</span>
              <span className="font-medium">{controlReport.activeFeatures.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Data Processing:</span>
              <span className="font-medium">{controlReport.dataProcessingLevel}</span>
            </div>
            <div className="flex justify-between">
              <span>Parental Controls:</span>
              <span className="font-medium">
                {controlReport.globalSettings.parentalControls ? 'On' : 'Off'}
              </span>
            </div>
          </div>
        </div>
      </SacredCard>

      {/* Quick Actions */}
      <SacredCard variant="gentle">
        <div className="space-y-breath">
          <SacredText variant="caption" className="font-medium">
            Quick Actions
          </SacredText>
          
          <div className="space-y-whisper">
            <SacredButton
              intention="gentle"
              size="comfortable"
              className="w-full justify-start"
              onClick={() => {/* Export settings */}}
            >
              📦 Export Settings
            </SacredButton>
            
            <SacredButton
              intention="gentle"
              size="comfortable"
              className="w-full justify-start"
              onClick={() => {/* View audit log */}}
            >
              📋 View Activity Log
            </SacredButton>
            
            <SacredButton
              intention="gentle"
              size="comfortable"
              className="w-full justify-start"
              onClick={() => {/* Reset to defaults */}}
            >
              🔄 Reset to Defaults
            </SacredButton>
            
            <SacredButton
              intention="release"
              size="comfortable"
              className="w-full justify-start"
              onClick={onShowOptOut}
            >
              🚪 Opt Out of AI
            </SacredButton>
          </div>
        </div>
      </SacredCard>

      {/* Help & Support */}
      <SacredCard variant="gentle">
        <div className="space-y-breath">
          <SacredText variant="caption" className="font-medium">
            Help & Support
          </SacredText>
          
          <div className="space-y-whisper">
            <button className="text-left text-sm text-grounding-earth hover:underline">
              📖 Understanding AI Levels
            </button>
            <button className="text-left text-sm text-grounding-earth hover:underline">
              🔒 Privacy Protection Guide
            </button>
            <button className="text-left text-sm text-grounding-earth hover:underline">
              👥 Family & Parental Controls
            </button>
            <button className="text-left text-sm text-grounding-earth hover:underline">
              💬 Contact Support
            </button>
          </div>
        </div>
      </SacredCard>
    </div>
  );
}

// ===== SECTION COMPONENTS =====

interface SectionProps {
  preferences: UserAIPreferences;
  controller: GranularAIController;
  onUpdate: (preferences: UserAIPreferences) => void;
}

function AIOverviewSection({ preferences, controller, onUpdate }: SectionProps) {
  return (
    <div className="space-y-ritual">
      <AIControlSettings
        userId={preferences.consentTimestamp} // Using timestamp as user ID for demo
        currentPreferences={preferences}
        onPreferencesUpdate={onUpdate}
        onOptOut={() => {/* Handle opt out */}}
      />
    </div>
  );
}

function AIFeaturesSection({ preferences, controller, onUpdate }: SectionProps) {
  const [config, setConfig] = useState<GranularAIConfig | null>(null);

  useEffect(() => {
    // Get current config from controller
    const currentConfig = (controller as any).config; // Access private config for demo
    setConfig(currentConfig);
  }, [controller]);

  if (!config) {
    return <div>Loading features...</div>;
  }

  const handleFeatureUpdate = (featureName: string, newControl: any) => {
    // Update specific feature control
    const updatedPreferences = {
      ...preferences,
      specificOptOuts: {
        ...preferences.specificOptOuts,
        [featureName]: !newControl.enabled
      }
    };
    onUpdate(updatedPreferences);
  };

  return (
    <div className="space-y-ritual">
      <SacredText variant="title" as="h2">
        Individual AI Features
      </SacredText>
      
      <SacredGrid columns={1} gap="breath">
        {Object.entries(config.featureControls).map(([featureName, featureControl]) => (
          <AIFeatureToggle
            key={featureName}
            featureName={featureName}
            featureControl={featureControl}
            controller={controller}
            onToggle={(enabled) => {/* Handle toggle */}}
            onConfigChange={(newConfig) => handleFeatureUpdate(featureName, newConfig)}
          />
        ))}
      </SacredGrid>
    </div>
  );
}

function AISessionSection({ preferences, controller, onUpdate }: SectionProps) {
  return (
    <div className="space-y-ritual">
      <SacredText variant="title" as="h2">
        Session Controls
      </SacredText>
      
      <SacredCard variant="gentle">
        <div className="space-y-breath">
          <SacredText variant="body">
            Session controls help prevent AI over-reliance and provide healthy usage boundaries.
          </SacredText>
          
          {/* Session controls would be implemented here */}
          <div className="text-center text-subtle">
            Session controls implementation coming soon...
          </div>
        </div>
      </SacredCard>
    </div>
  );
}

function AIPrivacySection({ preferences, controller, onUpdate }: SectionProps) {
  return (
    <div className="space-y-ritual">
      <SacredText variant="title" as="h2">
        Privacy & Data Controls
      </SacredText>
      
      <SacredCard variant="gentle">
        <div className="space-y-breath">
          <SacredText variant="body">
            Comprehensive privacy controls and data management options.
          </SacredText>
          
          {/* Privacy controls would be implemented here */}
          <div className="text-center text-subtle">
            Privacy controls implementation coming soon...
          </div>
        </div>
      </SacredCard>
    </div>
  );
}

// ===== LOADING AND ERROR STATES =====

function AIControlsLoading() {
  return (
    <div className="min-h-screen bg-sacred-canvas p-breath flex items-center justify-center">
      <SacredCard variant="gentle" className="text-center">
        <div className="space-y-breath">
          <div className="text-4xl animate-spin">⚙️</div>
          <SacredText variant="title">
            Loading AI Controls
          </SacredText>
          <SacredText variant="body">
            Preparing your personalized AI settings...
          </SacredText>
        </div>
      </SacredCard>
    </div>
  );
}

function AIControlsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-sacred-canvas p-breath flex items-center justify-center">
      <SacredCard variant="gentle" className="text-center">
        <div className="space-y-breath">
          <div className="text-4xl">❌</div>
          <SacredText variant="title">
            Failed to Load AI Controls
          </SacredText>
          <SacredText variant="body">
            There was an error loading your AI settings. Please try again.
          </SacredText>
          <SacredButton intention="primary" onClick={onRetry}>
            Retry
          </SacredButton>
        </div>
      </SacredCard>
    </div>
  );
}

// ===== UNSAVED CHANGES NOTICE =====

function UnsavedChangesNotice({ onSave, onDiscard }: { onSave: () => void; onDiscard: () => void }) {
  return (
    <div className="fixed bottom-breath right-breath bg-grounding-earth text-white p-breath rounded-lg shadow-lg">
      <div className="flex items-center gap-breath">
        <span className="text-sm">You have unsaved changes</span>
        <div className="flex gap-whisper">
          <SacredButton
            intention="gentle"
            size="intimate"
            onClick={onDiscard}
          >
            Discard
          </SacredButton>
          <SacredButton
            intention="primary"
            size="intimate"
            onClick={onSave}
          >
            Save All
          </SacredButton>
        </div>
      </div>
    </div>
  );
}

// ===== OPT-OUT FLOW MODAL =====

function OptOutFlowModal({ 
  onClose, 
  onOptOut, 
  loading 
}: { 
  onClose: () => void; 
  onOptOut: () => void; 
  loading: boolean; 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <SacredCard variant="gentle" className="max-w-lg">
        <div className="space-y-ritual">
          <div className="text-center">
            <span className="text-4xl">🚨</span>
            <SacredText variant="title" as="h3">
              Emergency AI Opt-Out
            </SacredText>
            <SacredText variant="body">
              This will immediately disable all AI features. You can re-enable them at any time.
            </SacredText>
          </div>

          <div className="flex gap-breath justify-end">
            <SacredButton
              intention="gentle"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </SacredButton>
            <SacredButton
              intention="release"
              onClick={onOptOut}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Opt Out Now'}
            </SacredButton>
          </div>
        </div>
      </SacredCard>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====

async function loadUserAIPreferences(userId: string): Promise<UserAIPreferences> {
  // Implementation would load from database
  // For demo, return default preferences
  return {
    interactionLevel: 'standard',
    consentTimestamp: new Date().toISOString(),
    lastReviewDate: new Date().toISOString(),
    explicitOptOut: false,
    specificOptOuts: {
      emotionalAnalysis: false,
      patternRecognition: false,
      personalizedPrompts: false,
      culturalAdaptation: false,
      dataCollection: false
    },
    analogPreferences: {
      preferredPromptTypes: ['daily_check_in'],
      difficultyLevel: 'gentle',
      culturalFramework: 'universal',
      sessionLength: 'medium'
    },
    reviewFrequency: 'quarterly'
  };
}

async function saveUserAIPreferences(userId: string, preferences: UserAIPreferences): Promise<void> {
  // Implementation would save to database
  console.log('Saving AI preferences for user:', userId, preferences);
}