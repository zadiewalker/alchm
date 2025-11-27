/**
 * ALCHM Analytics Privacy Controls
 * 
 * Provides granular privacy controls for analytics features,
 * ensuring users have complete control over their data.
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import AnalyticsService from '@/lib/analytics-service';
import { PrivacySettings, DEFAULT_PRIVACY_SETTINGS } from '@/lib/analytics-engine';

export interface AnalyticsPrivacyControlsProps {
  userId: string;
  onSettingsChange?: (settings: PrivacySettings) => void;
  className?: string;
}

export default function AnalyticsPrivacyControls({
  userId,
  onSettingsChange,
  className = ''
}: AnalyticsPrivacyControlsProps) {
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, [userId]);

  const loadPrivacySettings = async () => {
    try {
      setIsLoading(true);
      const userSettings = await AnalyticsService.getUserPrivacySettings(userId);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
    onSettingsChange?.(newSettings);
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      await AnalyticsService.updatePrivacySettings(userId, settings);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      // TODO: Show error message to user
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = { ...DEFAULT_PRIVACY_SETTINGS };
    setSettings(defaultSettings);
    setHasChanges(true);
    onSettingsChange?.(defaultSettings);
  };

  if (isLoading) {
    return <LoadingPrivacyControls className={className} />;
  }

  return (
    <Card className={`bg-white border-sage-100 rounded-2xl shadow-soft ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-ink text-lg font-medium flex items-center gap-2">
          <span className="text-xl">🔒</span>
          Analytics Privacy Controls
        </CardTitle>
        <p className="text-sm text-muted mt-1">
          You have complete control over your analytics data and insights.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Master Analytics Toggle */}
        <div className="p-4 bg-sage-50 rounded-xl border border-sage-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-ink text-sm">Enable Analytics</h4>
              <p className="text-xs text-muted">Generate insights from your journal entries</p>
            </div>
            <Switch
              checked={settings.enableAnalytics}
              onCheckedChange={(checked) => updateSetting('enableAnalytics', checked)}
              className="data-[state=checked]:bg-sage-400"
            />
          </div>
          {!settings.enableAnalytics && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                🔒 When disabled, no analytics will be generated from your journal data.
              </p>
            </div>
          )}
        </div>

        {/* Emotional Analysis */}
        <div className="space-y-3">
          <h4 className="font-medium text-ink text-sm flex items-center gap-2">
            <span>💭</span>
            Emotional Analysis
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-ink">Emotional Pattern Detection</span>
                <p className="text-xs text-muted">Identify emotions and mood patterns in your writing</p>
              </div>
              <Switch
                checked={settings.allowEmotionalAnalysis && settings.enableAnalytics}
                onCheckedChange={(checked) => updateSetting('allowEmotionalAnalysis', checked)}
                disabled={!settings.enableAnalytics}
                className="data-[state=checked]:bg-sage-400"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-ink">Growth Pattern Recognition</span>
                <p className="text-xs text-muted">Track healing progress and breakthrough moments</p>
              </div>
              <Switch
                checked={settings.allowPatternDetection && settings.enableAnalytics}
                onCheckedChange={(checked) => updateSetting('allowPatternDetection', checked)}
                disabled={!settings.enableAnalytics}
                className="data-[state=checked]:bg-sage-400"
              />
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="space-y-3">
          <h4 className="font-medium text-ink text-sm flex items-center gap-2">
            <span>🤝</span>
            Research Contribution
          </h4>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-ink">Share Anonymized Insights</span>
                <p className="text-xs text-muted">Help improve mental health research (completely anonymous)</p>
              </div>
              <Switch
                checked={settings.shareAnonymizedInsights && settings.enableAnalytics}
                onCheckedChange={(checked) => updateSetting('shareAnonymizedInsights', checked)}
                disabled={!settings.enableAnalytics}
                className="data-[state=checked]:bg-sage-400"
              />
            </div>
            {settings.shareAnonymizedInsights && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-700">
                  ✨ Your anonymous insights help improve mental health tools for everyone.
                  No personal information is ever shared.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Data Retention */}
        <div className="space-y-3">
          <h4 className="font-medium text-ink text-sm flex items-center gap-2">
            <span>⏰</span>
            Data Retention
          </h4>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-ink mb-2">
              Analytics Data Retention Period
            </label>
            <select
              value={settings.dataRetentionDays}
              onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
              disabled={!settings.enableAnalytics}
              className="w-full p-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={90}>3 months</option>
              <option value={180}>6 months</option>
              <option value={365}>1 year</option>
              <option value={730}>2 years</option>
            </select>
            <p className="text-xs text-muted mt-1">
              Analytics data older than this will be automatically deleted.
            </p>
          </div>
        </div>

        {/* Privacy Information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-medium text-blue-800 text-sm mb-2 flex items-center gap-2">
            <span>🛡️</span>
            Your Privacy is Protected
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• All analysis happens on your device when possible</li>
            <li>• Raw journal content is never stored in analytics</li>
            <li>• You can export or delete your data anytime</li>
            <li>• Anonymized insights use differential privacy</li>
            <li>• You control what data is analyzed</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-sage-100">
          <Button
            onClick={saveSettings}
            disabled={!hasChanges || isSaving}
            className="flex-1 bg-sage-400 hover:bg-sage-500 text-white disabled:opacity-50"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              'Save Settings'
            )}
          </Button>
          
          <Button
            onClick={resetToDefaults}
            variant="ghost"
            disabled={isSaving}
            className="text-sage-600 hover:text-sage-700 hover:bg-sage-50"
          >
            Reset to Defaults
          </Button>
        </div>

        {/* Consent Information */}
        <div className="text-xs text-muted text-center pt-2 border-t border-sage-100">
          <p>
            Settings saved on {settings.consentTimestamp.toLocaleDateString()} • 
            Version {settings.consentVersion}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ==============================================================================
// LOADING STATE
// ==============================================================================

function LoadingPrivacyControls({ className }: { className: string }) {
  return (
    <Card className={`bg-white border-sage-100 rounded-2xl shadow-soft ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-ink text-lg font-medium flex items-center gap-2">
          <span className="text-xl">🔒</span>
          Analytics Privacy Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-6 w-11 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ==============================================================================
// QUICK PRIVACY TOGGLE (FOR DASHBOARD)
// ==============================================================================

export function QuickPrivacyToggle({
  userId,
  className = ''
}: {
  userId: string;
  className?: string;
}) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsStatus();
  }, [userId]);

  const loadAnalyticsStatus = async () => {
    try {
      const settings = await AnalyticsService.getUserPrivacySettings(userId);
      setAnalyticsEnabled(settings.enableAnalytics);
    } catch (error) {
      console.error('Error loading analytics status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAnalytics = async () => {
    try {
      const newStatus = !analyticsEnabled;
      await AnalyticsService.updatePrivacySettings(userId, {
        enableAnalytics: newStatus
      });
      setAnalyticsEnabled(newStatus);
    } catch (error) {
      console.error('Error toggling analytics:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`p-3 bg-sage-50 rounded-lg border border-sage-100 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 bg-sage-50 rounded-lg border border-sage-100 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">Analytics</span>
        <Switch
          checked={analyticsEnabled}
          onCheckedChange={toggleAnalytics}
          className="data-[state=checked]:bg-sage-400"
        />
      </div>
    </div>
  );
}