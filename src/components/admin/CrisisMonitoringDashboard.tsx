"use client";

import React, { useState, useEffect } from "react";
import { CrisisEventsList } from "./CrisisEventsList";
import { CrisisAnalytics } from "./CrisisAnalytics";
import { SystemHealthMonitor } from "./SystemHealthMonitor";
import { AlertsPanel } from "./AlertsPanel";
import { ExportPanel } from "./ExportPanel";

type TabType = "events" | "analytics" | "health" | "alerts" | "export";

interface SystemStatus {
  aiUptime: number;
  averageProcessingTime: number;
  lastUpdated: string;
}

export function CrisisMonitoringDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("events");
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    aiUptime: 99.9,
    averageProcessingTime: 2.5,
    lastUpdated: new Date().toISOString()
  });

  // Fetch system health status
  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/system-health`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSystemStatus({
            aiUptime: data.systemHealth.aiUptime,
            averageProcessingTime: data.systemHealth.averageProcessingTime,
            lastUpdated: data.timestamp
          });
        }
      } catch (error) {
        console.error("Error fetching system health:", error);
      }
    };

    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: "events", label: "Crisis Events", icon: "🚨" },
    { key: "analytics", label: "Analytics", icon: "📊" },
    { key: "health", label: "System Health", icon: "💚" },
    { key: "alerts", label: "Alert Rules", icon: "⚠️" },
    { key: "export", label: "Data Export", icon: "📥" }
  ];

  return (
    <div className="space-y-6">
      {/* System Status Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  systemStatus.aiUptime > 99 ? 'bg-green-500' : 
                  systemStatus.aiUptime > 95 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                AI System: {systemStatus.aiUptime.toFixed(1)}% uptime
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Avg Processing: {systemStatus.averageProcessingTime.toFixed(1)}s
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date(systemStatus.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-purple-100">
        <div className="border-b border-purple-100">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "events" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Crisis Events Monitoring
                </h2>
                <p className="text-gray-600">
                  Real-time monitoring of crisis events with anonymized user data
                </p>
              </div>
              <CrisisEventsList />
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Crisis Analytics & Trends
                </h2>
                <p className="text-gray-600">
                  Statistical analysis and trend identification for crisis intervention
                </p>
              </div>
              <CrisisAnalytics />
            </div>
          )}

          {activeTab === "health" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  System Health Monitor
                </h2>
                <p className="text-gray-600">
                  AI performance metrics and system reliability monitoring
                </p>
              </div>
              <SystemHealthMonitor />
            </div>
          )}

          {activeTab === "alerts" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Alert Management
                </h2>
                <p className="text-gray-600">
                  Configure and manage automated crisis alert rules
                </p>
              </div>
              <AlertsPanel />
            </div>
          )}

          {activeTab === "export" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Data Export & Reporting
                </h2>
                <p className="text-gray-600">
                  Export anonymized crisis data for analysis and reporting
                </p>
              </div>
              <ExportPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Import auth from the correct path
import { auth } from "@/lib/firebase";