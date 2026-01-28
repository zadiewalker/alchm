"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";

interface AlertRule {
  id: string;
  name: string;
  condition: "high_confidence_spike" | "system_failure" | "response_time_threshold";
  threshold: number;
  enabled: boolean;
  recipients: string[];
  lastTriggered?: string;
}

export function AlertsPanel() {
  const [alertRules] = useState<AlertRule[]>([
    {
      id: "1",
      name: "High Confidence Crisis Spike",
      condition: "high_confidence_spike",
      threshold: 5,
      enabled: true,
      recipients: ["crisis@alchmapp.com", "supervisor@alchmapp.com"],
      lastTriggered: "2024-01-26T10:30:00Z"
    },
    {
      id: "2", 
      name: "System Response Time Alert",
      condition: "response_time_threshold",
      threshold: 300, // 5 minutes
      enabled: true,
      recipients: ["tech@alchmapp.com"],
      lastTriggered: undefined
    },
    {
      id: "3",
      name: "AI System Failure",
      condition: "system_failure", 
      threshold: 1,
      enabled: true,
      recipients: ["crisis@alchmapp.com", "tech@alchmapp.com", "admin@alchmapp.com"]
    }
  ]);

  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState<{
    name: string;
    condition: "high_confidence_spike" | "system_failure" | "response_time_threshold";
    threshold: number;
    recipients: string;
  }>({
    name: "",
    condition: "high_confidence_spike",
    threshold: 5,
    recipients: ""
  });

  const checkAlerts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/check-alerts`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        alert("Alert check completed successfully");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error checking alerts:", error);
      alert("Failed to check alerts");
    }
  };

  const getConditionDescription = (condition: string, threshold: number) => {
    switch (condition) {
      case "high_confidence_spike":
        return `Triggers when ${threshold} or more high-confidence crisis events occur within 1 hour`;
      case "response_time_threshold":
        return `Triggers when crisis events remain unresolved for more than ${threshold} minutes`;
      case "system_failure":
        return "Triggers when the AI analysis system experiences failures or extended downtime";
      default:
        return "Unknown condition";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "high_confidence_spike":
        return "bg-red-100 text-red-800";
      case "response_time_threshold":
        return "bg-yellow-100 text-yellow-800";
      case "system_failure":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Alert Rules</h3>
          <p className="text-sm text-gray-600">
            Configure automated alerts for crisis events and system issues
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={checkAlerts}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            Test Alerts
          </button>
          <button
            onClick={() => setShowCreateAlert(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Add Alert Rule
          </button>
        </div>
      </div>

      {/* Alert Rules List */}
      <div className="space-y-4">
        {alertRules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white border rounded-lg p-4 ${
              rule.enabled ? "border-gray-200" : "border-gray-300 bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className={`font-medium ${rule.enabled ? "text-gray-900" : "text-gray-500"}`}>
                    {rule.name}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(
                      rule.condition
                    )}`}
                  >
                    {rule.condition.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {rule.enabled ? "ENABLED" : "DISABLED"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {getConditionDescription(rule.condition, rule.threshold)}
                </p>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Recipients:</span>
                    <span className="ml-2 text-gray-600">
                      {rule.recipients.join(", ")}
                    </span>
                  </div>
                  {rule.lastTriggered && (
                    <div>
                      <span className="font-medium text-gray-700">Last Triggered:</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(rule.lastTriggered).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    rule.enabled
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {rule.enabled ? "Disable" : "Enable"}
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors text-xs font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Alert Rule</h3>
              <button
                onClick={() => setShowCreateAlert(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Name
                </label>
                <input
                  type="text"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="e.g., High Priority Crisis Alert"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  value={newAlert.condition}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      condition: e.target.value as "high_confidence_spike" | "system_failure" | "response_time_threshold"
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="high_confidence_spike">High Confidence Crisis Spike</option>
                  <option value="response_time_threshold">Response Time Threshold</option>
                  <option value="system_failure">System Failure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Threshold
                </label>
                <input
                  type="number"
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({ ...newAlert, threshold: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {getConditionDescription(newAlert.condition, newAlert.threshold)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipients (comma-separated emails)
                </label>
                <textarea
                  value={newAlert.recipients}
                  onChange={(e) => setNewAlert({ ...newAlert, recipients: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="crisis@alchmapp.com, supervisor@alchmapp.com"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateAlert(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Create alert logic would go here
                  setShowCreateAlert(false);
                  setNewAlert({
                    name: "",
                    condition: "high_confidence_spike",
                    threshold: 5,
                    recipients: ""
                  });
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Alert Activity</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium text-red-900">High Confidence Crisis Spike</p>
                <p className="text-sm text-red-700">5 high-confidence events detected in 1 hour</p>
              </div>
            </div>
            <div className="text-sm text-red-600">
              2 hours ago
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">System Health Check</p>
                <p className="text-sm text-gray-600">Automated health check completed successfully</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              6 hours ago
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Alert Test</p>
                <p className="text-sm text-gray-600">Manual alert system test - All systems operational</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              1 day ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}