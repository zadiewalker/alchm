// Privacy Controls - User interface for privacy settings and data rights
// GDPR/CCPA compliant privacy management interface

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Database,
  Globe
} from 'lucide-react';
import { PrivacySettings } from '@/lib/analytics/privacy-manager';

interface PrivacyControlsProps {
  userId: string;
  currentSettings?: PrivacySettings;
  onSettingsChange?: (settings: PrivacySettings) => void;
}

export default function PrivacyControls({ 
  userId, 
  currentSettings, 
  onSettingsChange 
}: PrivacyControlsProps) {
  const [settings, setSettings] = useState<PrivacySettings>(
    currentSettings || getDefaultSettings()
  );
  const [saving, setSaving] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    status: 'none' | 'pending' | 'processing' | 'ready';
    requestId?: string;
    downloadUrl?: string;
  }>({ status: 'none' });
  const [deletionStatus, setDeletionStatus] = useState<{
    status: 'none' | 'pending' | 'processing' | 'completed';
    requestId?: string;
  }>({ status: 'none' });

  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const handleSettingChange = (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/privacy/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, settings })
      });

      if (response.ok) {
        console.log('Privacy settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      alert('Failed to save privacy settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const requestDataExport = async () => {
    try {
      const response = await fetch('/api/privacy/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          dataTypes: ['profile', 'journal_entries', 'ai_insights', 'analytics']
        })
      });

      if (response.ok) {
        const data = await response.json();
        setExportStatus({ 
          status: 'pending', 
          requestId: data.requestId 
        });
      } else {
        throw new Error('Export request failed');
      }
    } catch (error) {
      console.error('Failed to request data export:', error);
      alert('Failed to request data export. Please try again.');
    }
  };

  const requestDataDeletion = async (deletionType: 'partial' | 'complete') => {
    const confirmation = deletionType === 'complete' 
      ? 'This will permanently delete ALL your data. This action cannot be undone. Type "DELETE ALL" to confirm:'
      : 'This will delete your personal data while keeping anonymized analytics. Type "DELETE" to confirm:';
    
    const confirmText = deletionType === 'complete' ? 'DELETE ALL' : 'DELETE';
    const userInput = prompt(confirmation);
    
    if (userInput !== confirmText) {
      return;
    }

    try {
      const response = await fetch('/api/privacy/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          deletionType,
          reason: 'User requested deletion'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDeletionStatus({ 
          status: 'pending', 
          requestId: data.requestId 
        });
      } else {
        throw new Error('Deletion request failed');
      }
    } catch (error) {
      console.error('Failed to request data deletion:', error);
      alert('Failed to request data deletion. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-purple-400" />
            Privacy & Data Controls
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Control how your data is used and exercise your privacy rights. 
            Your privacy is protected by GDPR, CCPA, and HIPAA compliance.
          </p>
        </CardHeader>
      </Card>

      {/* Analytics Preferences */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-400" />
            Analytics & Tracking Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PrivacyToggle
            label="Analytics Consent"
            description="Allow us to collect anonymized usage data to improve the app"
            value={settings.analyticsConsent}
            onChange={(value) => handleSettingChange('analyticsConsent', value)}
            icon={<Globe className="h-4 w-4" />}
          />

          <PrivacyToggle
            label="Performance Tracking"
            description="Essential for app functionality and performance monitoring"
            value={settings.performanceTracking}
            onChange={(value) => handleSettingChange('performanceTracking', value)}
            required={true}
            icon={<CheckCircle className="h-4 w-4" />}
          />

          <PrivacyToggle
            label="Marketing Analytics"
            description="Help us understand user engagement for product improvements"
            value={settings.marketingAnalytics}
            onChange={(value) => handleSettingChange('marketingAnalytics', value)}
            icon={<Eye className="h-4 w-4" />}
          />

          <PrivacyToggle
            label="Research Participation"
            description="Allow anonymized data to be used for mental health research"
            value={settings.allowResearchParticipation}
            onChange={(value) => handleSettingChange('allowResearchParticipation', value)}
            icon={<FileText className="h-4 w-4" />}
          />
        </CardContent>
      </Card>

      {/* Advanced Privacy Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-yellow-400" />
              Advanced Privacy Settings
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="border-gray-600"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </CardHeader>
        
        {showAdvanced && (
          <CardContent className="space-y-4">
            <PrivacyToggle
              label="Cross-Device Tracking"
              description="Link your usage across different devices for a unified experience"
              value={settings.crossDeviceTracking}
              onChange={(value) => handleSettingChange('crossDeviceTracking', value)}
              icon={<Globe className="h-4 w-4" />}
            />

            <PrivacyToggle
              label="Anonymized Usage Data"
              description="Share anonymized data to help improve mental health tools"
              value={settings.anonymizedUsageData}
              onChange={(value) => handleSettingChange('anonymizedUsageData', value)}
              icon={<EyeOff className="h-4 w-4" />}
            />

            <PrivacyToggle
              label="Share Aggregated Insights"
              description="Allow anonymized insights to be shared with researchers"
              value={settings.shareAggregatedInsights}
              onChange={(value) => handleSettingChange('shareAggregatedInsights', value)}
              icon={<Database className="h-4 w-4" />}
            />

            <div className="border-t border-gray-700 pt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data Retention Period
              </label>
              <select
                value={settings.dataRetentionPeriod}
                onChange={(e) => handleSettingChange('dataRetentionPeriod', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-md text-white"
              >
                <option value={90}>90 days</option>
                <option value={180}>6 months</option>
                <option value={365}>1 year</option>
                <option value={730}>2 years</option>
                <option value={1095}>3 years</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                How long to keep your data after account deletion
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Data Rights */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-400" />
            Your Data Rights
          </CardTitle>
          <p className="text-sm text-gray-400">
            Exercise your rights under GDPR, CCPA, and other privacy laws
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data Export */}
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-blue-400" />
              <div>
                <h4 className="font-medium text-white">Download Your Data</h4>
                <p className="text-sm text-gray-400">
                  Get a copy of all your personal data in a portable format
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {exportStatus.status !== 'none' && (
                <Badge 
                  variant="outline" 
                  className={`border-${
                    exportStatus.status === 'ready' ? 'green' : 'yellow'
                  }-400 text-${
                    exportStatus.status === 'ready' ? 'green' : 'yellow'
                  }-300`}
                >
                  {exportStatus.status}
                </Badge>
              )}
              <Button
                onClick={requestDataExport}
                disabled={exportStatus.status === 'pending' || exportStatus.status === 'processing'}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {exportStatus.status === 'ready' ? 'Download Ready' : 'Request Export'}
              </Button>
            </div>
          </div>

          {/* Data Deletion */}
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-red-400" />
              <div>
                <h4 className="font-medium text-white">Delete Your Data</h4>
                <p className="text-sm text-gray-400">
                  Permanently remove your personal data from our systems
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {deletionStatus.status !== 'none' && (
                <Badge 
                  variant="outline" 
                  className="border-red-400 text-red-300"
                >
                  {deletionStatus.status}
                </Badge>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => requestDataDeletion('partial')}
                  disabled={deletionStatus.status !== 'none'}
                  variant="outline"
                  size="sm"
                  className="border-yellow-600 text-yellow-300 hover:bg-yellow-900/20"
                >
                  Delete Personal Data
                </Button>
                <Button
                  onClick={() => requestDataDeletion('complete')}
                  disabled={deletionStatus.status !== 'none'}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-300 hover:bg-red-900/20"
                >
                  Delete Everything
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          Changes are saved automatically
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {saving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
      </div>

      {/* Privacy Information */}
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-300 mb-2">Your Privacy is Protected</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• All journal content is encrypted and never shared</li>
                <li>• Analytics data is anonymized and cannot identify you</li>
                <li>• You can export or delete your data at any time</li>
                <li>• We comply with GDPR, CCPA, and HIPAA requirements</li>
                <li>• Crisis prevention features operate with minimal data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Privacy Toggle Component
interface PrivacyToggleProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
  icon?: React.ReactNode;
}

function PrivacyToggle({ 
  label, 
  description, 
  value, 
  onChange, 
  required = false,
  icon 
}: PrivacyToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
      <div className="flex items-start gap-3">
        {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{label}</span>
            {required && (
              <Badge variant="outline" className="border-orange-400 text-orange-300 text-xs">
                Required
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <button
        onClick={() => !required && onChange(!value)}
        disabled={required}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-purple-600' : 'bg-gray-600'
        } ${required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function getDefaultSettings(): PrivacySettings {
  return {
    analyticsConsent: false,
    performanceTracking: true,
    marketingAnalytics: false,
    anonymizedUsageData: true,
    crossDeviceTracking: false,
    dataRetentionPeriod: 365,
    allowResearchParticipation: false,
    shareAggregatedInsights: true
  };
}