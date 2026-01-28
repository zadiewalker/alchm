"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

interface CrisisAnalytics {
  period: string;
  totalCrises: number;
  highConfidenceCrises: number;
  averageResponseTime: number;
  trends: {
    daily: { date: string; count: number }[];
    byConfidence: { level: string; count: number }[];
    byDemographics: { category: string; value: string; count: number }[];
  };
  systemHealth: {
    aiUptime: number;
    averageProcessingTime: number;
  };
}

export function CrisisAnalytics() {
  const [analytics, setAnalytics] = useState<CrisisAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d">("24h");

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis-analytics?period=${selectedPeriod}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch analytics");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Unable to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "24h": return "Last 24 Hours";
      case "7d": return "Last 7 Days";
      case "30d": return "Last 30 Days";
      default: return period;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Analytics for {getPeriodLabel(selectedPeriod)}
        </h3>
        <div className="flex space-x-2">
          {[
            { key: "24h", label: "24H" },
            { key: "7d", label: "7D" },
            { key: "30d", label: "30D" }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as "24h" | "7d" | "30d")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period.key
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">🚨</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Crisis Events</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalCrises}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">⚠️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">High Confidence</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.highConfidenceCrises}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">⏱️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.averageResponseTime.toFixed(1)}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">💚</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.systemHealth.aiUptime.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Trends Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Daily Crisis Trends</h4>
        <div className="space-y-3">
          {analytics.trends.daily.map((day) => {
            const maxCount = Math.max(...analytics.trends.daily.map(d => d.count));
            const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            
            return (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-600 flex-shrink-0">
                  {new Date(day.date).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex-1 relative">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        day.count > 0 ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gray-300'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-8 text-sm font-medium text-gray-900 text-right">
                  {day.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confidence Level Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Crisis Confidence Distribution</h4>
        <div className="grid grid-cols-3 gap-4">
          {analytics.trends.byConfidence.map((item) => {
            const colors = {
              high: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
              medium: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
              low: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" }
            };
            
            const color = colors[item.level as keyof typeof colors] || colors.low;
            
            return (
              <div 
                key={item.level} 
                className={`border rounded-lg p-4 ${color.border} ${color.bg}`}
              >
                <div className="text-center">
                  <p className={`text-2xl font-bold ${color.text}`}>
                    {item.count}
                  </p>
                  <p className={`text-sm font-medium ${color.text} capitalize`}>
                    {item.level} Confidence
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {analytics.totalCrises > 0 
                      ? `${((item.count / analytics.totalCrises) * 100).toFixed(1)}%` 
                      : '0%'
                    } of total
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Performance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">System Performance</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">AI Processing Time</span>
              <span className="text-sm font-bold text-gray-900">
                {analytics.systemHealth.averageProcessingTime.toFixed(2)}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  analytics.systemHealth.averageProcessingTime <= 3 
                    ? 'bg-green-500' 
                    : analytics.systemHealth.averageProcessingTime <= 5
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min((analytics.systemHealth.averageProcessingTime / 10) * 100, 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Target: ≤ 3 seconds
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">System Uptime</span>
              <span className="text-sm font-bold text-gray-900">
                {analytics.systemHealth.aiUptime.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  analytics.systemHealth.aiUptime >= 99.5 
                    ? 'bg-green-500' 
                    : analytics.systemHealth.aiUptime >= 95
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${analytics.systemHealth.aiUptime}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Target: ≥ 99.5%
            </p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchAnalytics}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Refresh Analytics
        </button>
      </div>
    </div>
  );
}