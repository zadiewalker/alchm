'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface DataRetentionSummary {
  totalDataItems: number;
  dataByType: Record<string, number>;
  nextExpirations: Array<{
    dataType: string;
    expirationDate: string;
    count: number;
  }>;
  deletionRequests: Array<{
    requestId: string;
    status: string;
    scheduledFor?: string;
    dataTypes: string[];
    urgency: string;
  }>;
}

interface RetentionPreferences {
  journalRetention: 'minimal' | 'standard' | 'extended';
  analyticsOptOut: boolean;
  dataMinimization: boolean;
}

export default function DataRetentionManager({ userId }: { userId: string }) {
  const [summary, setSummary] = useState<DataRetentionSummary | null>(null);
  const [preferences, setPreferences] = useState<RetentionPreferences>({
    journalRetention: 'standard',
    analyticsOptOut: false,
    dataMinimization: false
  });
  const [loading, setLoading] = useState(true);
  const [showDeletionDialog, setShowDeletionDialog] = useState(false);
  const [deletionType, setDeletionType] = useState<'partial' | 'complete' | 'specific_data'>('partial');
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [deletionUrgency, setDeletionUrgency] = useState<'standard' | 'expedited' | 'immediate'>('standard');

  useEffect(() => {
    fetchDataRetentionSummary();
  }, [userId]);

  const fetchDataRetentionSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data-retention');
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch data retention summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRetentionPreferences = async (newPreferences: Partial<RetentionPreferences>) => {
    try {
      const response = await fetch('/api/data-retention', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences)
      });

      const data = await response.json();
      if (data.success) {
        setPreferences(prev => ({ ...prev, ...newPreferences }));
      }
    } catch (error) {
      console.error('Failed to update retention preferences:', error);
    }
  };

  const requestDataDeletion = async () => {
    try {
      const response = await fetch('/api/data-retention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deletionType,
          dataTypes: deletionType === 'specific_data' ? selectedDataTypes : undefined,
          urgency: deletionUrgency,
          reason: 'user_request'
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowDeletionDialog(false);
        await fetchDataRetentionSummary(); // Refresh data
        alert(`Deletion request submitted successfully. Request ID: ${data.data.deletionRequest.requestId}`);
      }
    } catch (error) {
      console.error('Failed to request data deletion:', error);
      alert('Failed to submit deletion request. Please try again.');
    }
  };

  const getDataTypeDisplayName = (dataType: string): string => {
    const displayNames: Record<string, string> = {
      journalEntries: 'Journal Entries',
      aiProcessingData: 'AI Processing Data',
      accountData: 'Account Information',
      analyticsData: 'Analytics Data',
      auditLogs: 'Security Logs'
    };
    return displayNames[dataType] || dataType;
  };

  const getRetentionDescription = (dataType: string): string => {
    const descriptions: Record<string, string> = {
      journalEntries: 'Your personal journal entries and reflections',
      aiProcessingData: 'Data used for AI insights and recommendations',
      accountData: 'Your profile information and preferences',
      analyticsData: 'Anonymized usage data for platform improvement',
      auditLogs: 'Security and access logs (required for compliance)'
    };
    return descriptions[dataType] || 'Platform data';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data retention information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Data Retention & Privacy</h1>
          <p className="text-gray-600">
            Manage how long your data is stored and request deletion in compliance with FERPA, COPPA, and GDPR.
          </p>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Your Data Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-medium text-blue-600">{summary?.totalDataItems || 0}</div>
              <div className="text-sm text-blue-800">Total Data Items</div>
            </div>
            
            {summary?.dataByType && Object.entries(summary.dataByType).map(([type, count]) => (
              <div key={type} className="bg-gray-50 rounded-lg p-4">
                <div className="text-xl font-medium text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{getDataTypeDisplayName(type)}</div>
              </div>
            ))}
          </div>

          {/* Data Types Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Data Categories</h3>
            {summary?.dataByType && Object.entries(summary.dataByType).map(([type, count]) => (
              <div key={type} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{getDataTypeDisplayName(type)}</h4>
                    <p className="text-sm text-gray-600 mt-1">{getRetentionDescription(type)}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {count} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Expirations */}
        {summary?.nextExpirations && summary.nextExpirations.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Upcoming Data Expirations</h2>
            <div className="space-y-3">
              {summary.nextExpirations.map((expiration, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{getDataTypeDisplayName(expiration.dataType)}</div>
                    <div className="text-sm text-gray-600">{expiration.count} items will expire</div>
                  </div>
                  <div className="text-sm font-medium text-yellow-800">
                    {format(new Date(expiration.expirationDate), 'MMM dd, yyyy')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Retention Preferences */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Retention Preferences</h2>
          
          <div className="space-y-6">
            {/* Journal Retention */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Journal Entry Retention
              </label>
              <select
                value={preferences.journalRetention}
                onChange={(e) => updateRetentionPreferences({ 
                  journalRetention: e.target.value as 'minimal' | 'standard' | 'extended' 
                })}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="minimal">Minimal (1 year)</option>
                <option value="standard">Standard (3 years)</option>
                <option value="extended">Extended (indefinite while active)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Choose how long your journal entries are kept
              </p>
            </div>

            {/* Analytics Opt-out */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="analyticsOptOut"
                checked={preferences.analyticsOptOut}
                onChange={(e) => updateRetentionPreferences({ analyticsOptOut: e.target.checked })}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="analyticsOptOut" className="ml-3 text-sm">
                <span className="font-medium text-gray-700">Opt out of analytics</span>
                <p className="text-gray-500">
                  Disable collection of usage analytics (anonymized data used to improve the platform)
                </p>
              </label>
            </div>

            {/* Data Minimization */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="dataMinimization"
                checked={preferences.dataMinimization}
                onChange={(e) => updateRetentionPreferences({ dataMinimization: e.target.checked })}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="dataMinimization" className="ml-3 text-sm">
                <span className="font-medium text-gray-700">Enable data minimization</span>
                <p className="text-gray-500">
                  Collect and store only essential data necessary for core functionality
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Active Deletion Requests */}
        {summary?.deletionRequests && summary.deletionRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Active Deletion Requests</h2>
            <div className="space-y-3">
              {summary.deletionRequests.map((request, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">Request #{request.requestId.slice(-8)}</div>
                      <div className="text-sm text-gray-600">
                        Data types: {request.dataTypes.map(getDataTypeDisplayName).join(', ')}
                      </div>
                      {request.scheduledFor && (
                        <div className="text-sm text-gray-500">
                          Scheduled for: {format(new Date(request.scheduledFor), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      request.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Deletion Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Request Data Deletion</h2>
          <p className="text-gray-600 mb-4">
            You have the right to request deletion of your personal data under GDPR Article 17 (Right to be Forgotten).
          </p>
          
          <button
            onClick={() => setShowDeletionDialog(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Request Data Deletion
          </button>
        </div>

        {/* Deletion Dialog */}
        {showDeletionDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Request Data Deletion</h3>
              
              <div className="space-y-4">
                {/* Deletion Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deletion Type
                  </label>
                  <select
                    value={deletionType}
                    onChange={(e) => setDeletionType(e.target.value as any)}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="partial">Partial (journal entries only)</option>
                    <option value="complete">Complete (all data)</option>
                    <option value="specific_data">Specific data types</option>
                  </select>
                </div>

                {/* Specific Data Types */}
                {deletionType === 'specific_data' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Data Types
                    </label>
                    <div className="space-y-2">
                      {summary?.dataByType && Object.keys(summary.dataByType).map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedDataTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDataTypes([...selectedDataTypes, type]);
                              } else {
                                setSelectedDataTypes(selectedDataTypes.filter(t => t !== type));
                              }
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {getDataTypeDisplayName(type)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency
                  </label>
                  <select
                    value={deletionUrgency}
                    onChange={(e) => setDeletionUrgency(e.target.value as any)}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="standard">Standard (30 days)</option>
                    <option value="expedited">Expedited (24 hours)</option>
                    <option value="immediate">Immediate</option>
                  </select>
                </div>

                {/* Warning */}
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    ⚠️ <strong>Warning:</strong> Deleted data cannot be recovered. This action is permanent.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDeletionDialog(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={requestDataDeletion}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Request Deletion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}