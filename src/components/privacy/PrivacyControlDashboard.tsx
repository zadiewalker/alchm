/**
 * Privacy Control Dashboard Component for ALCHM
 * 
 * Gives users complete control over their data and analytics participation
 * Transparent about data usage with clear, actionable controls
 * Empowers users to make informed decisions about their privacy
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  Download, 
  Trash2, 
  Settings, 
  Info, 
  Lock, 
  Users, 
  BarChart, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface PrivacySettings {
  // Core analytics controls
  analyticsEnabled: boolean;
  sessionTracking: boolean;
  progressAnalytics: boolean;
  populationInsights: boolean;
  
  // Data sharing controls
  researchParticipation: boolean;
  anonymousInsights: boolean;
  communitySharing: boolean;
  
  // Data retention controls
  dataRetentionDays: number;
  autoDelete: boolean;
  exportReminders: boolean;
  
  // Boundary controls
  usageMonitoring: boolean;
  crisisDetection: boolean;
  interventionLevel: 'minimal' | 'standard' | 'comprehensive';
  
  // Notification controls
  privacyUpdates: boolean;
  dataUsageReports: boolean;
  consentReminders: boolean;
}

interface DataUsageSummary {
  lastUpdated: Timestamp;
  dataPoints: {
    sessions: number;
    insights: number;
    patterns: number;
  };
  analyticsGenerated: number;
  researchContributions: number;
  privacyScore: number; // 0-100, higher = more private
}

interface PrivacyControlProps {
  userId: string;
  currentSettings: PrivacySettings;
  dataSummary: DataUsageSummary;
  onSettingsChange: (settings: PrivacySettings) => void;
  onDataExport: () => void;
  onDataDelete: (scope: 'analytics' | 'all') => void;
}

export const PrivacyControlDashboard: React.FC<PrivacyControlProps> = ({
  userId,
  currentSettings,
  dataSummary,
  onSettingsChange,
  onDataExport,
  onDataDelete
}) => {
  const [settings, setSettings] = useState<PrivacySettings>(currentSettings);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'sharing' | 'retention' | 'export'>('overview');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(currentSettings);
    setPendingChanges(hasChanges);
  }, [settings, currentSettings]);

  const updateSetting = <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const saveSettings = () => {
    onSettingsChange(settings);
    setPendingChanges(false);
  };

  const resetSettings = () => {
    setSettings(currentSettings);
    setPendingChanges(false);
  };

  const calculatePrivacyImpact = (setting: keyof PrivacySettings, value: boolean | string | number) => {
    // Calculate how a setting change affects privacy score
    const impacts: Record<string, number> = {
      analyticsEnabled: value ? -10 : 10,
      researchParticipation: value ? -15 : 15,
      communitySharing: value ? -20 : 20,
      usageMonitoring: value ? -5 : 5
    };
    
    return impacts[setting] || 0;
  };

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Privacy Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${getPrivacyScoreColor(dataSummary.privacyScore)}`} />
            <h3 className="text-lg font-semibold">Privacy Score</h3>
          </div>
          <div className={`text-2xl font-bold ${getPrivacyScoreColor(dataSummary.privacyScore)}`}>
            {dataSummary.privacyScore}/100
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Your privacy level is</span>
            <span className="font-medium">
              {dataSummary.privacyScore >= 80 ? 'High' : 
               dataSummary.privacyScore >= 60 ? 'Medium' : 'Low'}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                dataSummary.privacyScore >= 80 ? 'bg-green-500' : 
                dataSummary.privacyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${dataSummary.privacyScore}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600">
            Based on your current privacy settings and data sharing preferences.
          </p>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-center h-20 flex-col"
            onClick={onDataExport}
          >
            <Download className="w-5 h-5" />
            <span className="text-sm">Export My Data</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-center h-20 flex-col"
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart className="w-5 h-5" />
            <span className="text-sm">Analytics Settings</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-center h-20 flex-col text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => onDataDelete('analytics')}
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-sm">Delete Analytics</span>
          </Button>
        </div>
      </Card>

      {/* Data Usage Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Data at a Glance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{dataSummary.dataPoints.sessions}</div>
            <div className="text-sm text-gray-600">Sessions Recorded</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{dataSummary.dataPoints.insights}</div>
            <div className="text-sm text-gray-600">Insights Generated</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{dataSummary.researchContributions}</div>
            <div className="text-sm text-gray-600">Research Contributions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{settings.dataRetentionDays}</div>
            <div className="text-sm text-gray-600">Days Retention</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-sm text-gray-500">
          Last updated: {dataSummary.lastUpdated.toDate().toLocaleDateString()}
        </div>
      </Card>
    </div>
  );

  const renderAnalyticsSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analytics & Insights</h3>
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                <label className="font-medium">Personal Analytics</label>
                {!settings.analyticsEnabled && (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Generate insights about your personal healing journey and patterns.
              </p>
            </div>
            <Switch
              checked={settings.analyticsEnabled}
              onCheckedChange={(checked) => updateSetting('analyticsEnabled', checked)}
            />
          </div>

          {settings.analyticsEnabled && (
            <>
              <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="font-medium">Session Tracking</label>
                    <p className="text-sm text-gray-600">
                      Track session length, word count, and engagement depth.
                    </p>
                  </div>
                  <Switch
                    checked={settings.sessionTracking}
                    onCheckedChange={(checked) => updateSetting('sessionTracking', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="font-medium">Progress Analytics</label>
                    <p className="text-sm text-gray-600">
                      Analyze your healing progress and growth over time.
                    </p>
                  </div>
                  <Switch
                    checked={settings.progressAnalytics}
                    onCheckedChange={(checked) => updateSetting('progressAnalytics', checked)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <label className="font-medium">Population Insights</label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Contribute to anonymous research about digital healing patterns.
              </p>
            </div>
            <Switch
              checked={settings.populationInsights}
              onCheckedChange={(checked) => updateSetting('populationInsights', checked)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Wellness Monitoring</h3>
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <label className="font-medium">Usage Monitoring</label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Monitor for healthy usage patterns and gentle boundary suggestions.
              </p>
            </div>
            <Switch
              checked={settings.usageMonitoring}
              onCheckedChange={(checked) => updateSetting('usageMonitoring', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <label className="font-medium">Crisis Detection</label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Detect patterns that may indicate need for additional support.
              </p>
            </div>
            <Switch
              checked={settings.crisisDetection}
              onCheckedChange={(checked) => updateSetting('crisisDetection', checked)}
            />
          </div>

          {(settings.usageMonitoring || settings.crisisDetection) && (
            <div className="ml-6 pl-4 border-l-2 border-gray-200">
              <label className="block font-medium mb-2">Intervention Level</label>
              <div className="space-y-2">
                {(['minimal', 'standard', 'comprehensive'] as const).map((level) => (
                  <label key={level} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="interventionLevel"
                      value={level}
                      checked={settings.interventionLevel === level}
                      onChange={() => updateSetting('interventionLevel', level)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{level}</span>
                    <span className="text-sm text-gray-600">
                      {level === 'minimal' && '- Gentle reminders only'}
                      {level === 'standard' && '- Balanced support and autonomy'}
                      {level === 'comprehensive' && '- Proactive wellness support'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderSharingSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Sharing & Research</h3>
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <label className="font-medium">Research Participation</label>
                <Badge variant="outline" className="text-xs">Anonymous</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Contribute your anonymized data to trauma-informed care research.
              </p>
            </div>
            <Switch
              checked={settings.researchParticipation}
              onCheckedChange={(checked) => updateSetting('researchParticipation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                <label className="font-medium">Anonymous Insights</label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Share anonymous healing patterns to help improve the platform.
              </p>
            </div>
            <Switch
              checked={settings.anonymousInsights}
              onCheckedChange={(checked) => updateSetting('anonymousInsights', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <label className="font-medium">Community Sharing</label>
                <Badge variant="outline" className="text-xs">Optional</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Share selected insights with the ALCHM community for mutual support.
              </p>
            </div>
            <Switch
              checked={settings.communitySharing}
              onCheckedChange={(checked) => updateSetting('communitySharing', checked)}
            />
          </div>
        </div>

        {(settings.researchParticipation || settings.anonymousInsights) && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">Research Impact</p>
                <p className="text-blue-700">
                  Your anonymous contributions help advance trauma-informed digital interventions 
                  and improve healing outcomes for others. You can withdraw from research at any time.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderRetentionSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Retention</h3>
        <div className="space-y-6">
          
          <div>
            <label className="block font-medium mb-2">Data Retention Period</label>
            <div className="space-y-4">
              <Slider
                value={[settings.dataRetentionDays]}
                onValueChange={([value]) => updateSetting('dataRetentionDays', value)}
                min={30}
                max={1095} // 3 years
                step={30}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>30 days</span>
                <span className="font-medium">
                  {settings.dataRetentionDays} days ({Math.round(settings.dataRetentionDays / 30)} months)
                </span>
                <span>3 years</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your data will be automatically deleted after this period. You can export it before deletion.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <label className="font-medium">Auto-Delete</label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Automatically delete analytics data when retention period expires.
              </p>
            </div>
            <Switch
              checked={settings.autoDelete}
              onCheckedChange={(checked) => updateSetting('autoDelete', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <label className="font-medium">Export Reminders</label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Remind me to export my data before automatic deletion.
              </p>
            </div>
            <Switch
              checked={settings.exportReminders}
              onCheckedChange={(checked) => updateSetting('exportReminders', checked)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-red-200">
        <h3 className="text-lg font-semibold mb-4 text-red-800">Danger Zone</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Delete Analytics Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete all analytics and insights data while keeping your journal entries.
            </p>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => onDataDelete('analytics')}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Analytics Data
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Delete All Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete your entire ALCHM account and all associated data.
            </p>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => onDataDelete('all')}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderExportSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Export</h3>
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={onDataExport}
            >
              <Download className="w-5 h-5" />
              <span>Export All Data</span>
              <span className="text-xs text-gray-500">JSON format</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => {/* Export analytics only */}}
            >
              <BarChart className="w-5 h-5" />
              <span>Export Analytics</span>
              <span className="text-xs text-gray-500">Insights & patterns</span>
            </Button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-600 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">What's included in your export:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Personal analytics and insights</li>
                  <li>Session summaries (without raw content)</li>
                  <li>Privacy settings and preferences</li>
                  <li>Usage patterns and progress metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy & Data Control</h1>
        <p className="text-gray-600">
          Complete control over your data, analytics, and privacy settings. 
          Your healing journey belongs to you.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {[
          { key: 'overview', label: 'Overview', icon: Shield },
          { key: 'analytics', label: 'Analytics', icon: BarChart },
          { key: 'sharing', label: 'Sharing', icon: Users },
          { key: 'retention', label: 'Retention', icon: Clock },
          { key: 'export', label: 'Export', icon: Download }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${
              activeTab === key
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'analytics' && renderAnalyticsSettings()}
        {activeTab === 'sharing' && renderSharingSettings()}
        {activeTab === 'retention' && renderRetentionSettings()}
        {activeTab === 'export' && renderExportSettings()}
      </div>

      {/* Pending Changes Bar */}
      {pendingChanges && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">You have unsaved changes</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={resetSettings}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveSettings}>
              <CheckCircle className="w-4 h-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyControlDashboard;