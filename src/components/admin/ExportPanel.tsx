"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";

export function ExportPanel() {
  const [exportConfig, setExportConfig] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    format: "csv" as "csv" | "json",
    includeResolved: true,
    includeUnresolved: true,
    confidenceLevels: {
      high: true,
      medium: true,
      low: false
    }
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    {
      id: "1",
      filename: "crisis-data-2024-01-19-to-2024-01-26.csv",
      createdAt: "2024-01-26T14:30:00Z",
      size: "2.3 MB",
      records: 847,
      downloadUrl: "#"
    },
    {
      id: "2", 
      filename: "crisis-analytics-2024-01-12-to-2024-01-19.json",
      createdAt: "2024-01-19T16:45:00Z",
      size: "1.8 MB",
      records: 623,
      downloadUrl: "#"
    }
  ]);

  const exportData = async () => {
    if (!exportConfig.startDate || !exportConfig.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    const startDate = new Date(exportConfig.startDate);
    const endDate = new Date(exportConfig.endDate);
    
    if (startDate >= endDate) {
      alert("End date must be after start date");
      return;
    }

    // Check for date range limit (e.g., max 90 days)
    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 90) {
      alert("Maximum export range is 90 days. Please select a shorter time period.");
      return;
    }

    setIsExporting(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const params = new URLSearchParams({
        startDate: exportConfig.startDate,
        endDate: exportConfig.endDate,
        format: exportConfig.format
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis-export?${params}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        // Create download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const filename = `crisis-data-${exportConfig.startDate}-to-${exportConfig.endDate}.${exportConfig.format}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Add to export history (in a real app, this would come from the server)
        const newExport = {
          id: Date.now().toString(),
          filename,
          createdAt: new Date().toISOString(),
          size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
          records: Math.floor(Math.random() * 1000) + 100, // Mock data
          downloadUrl: "#"
        };
        
        setExportHistory([newExport, ...exportHistory]);
        
        alert("Export completed successfully!");
      } else {
        const errorData = await response.json();
        alert(`Export failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getEstimatedSize = () => {
    const days = Math.ceil(
      (new Date(exportConfig.endDate).getTime() - new Date(exportConfig.startDate).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    
    // Rough estimation: assume ~10-50 crisis events per day
    const estimatedRecords = days * 25;
    const estimatedSizeMB = exportConfig.format === "json" 
      ? (estimatedRecords * 0.5) / 1000 // JSON is more verbose
      : (estimatedRecords * 0.2) / 1000; // CSV is more compact
    
    return {
      records: estimatedRecords,
      sizeMB: Math.max(estimatedSizeMB, 0.1)
    };
  };

  const estimate = getEstimatedSize();

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg 
              className="h-5 w-5 text-blue-500 mt-0.5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M12 15v2m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Privacy Protection</h3>
            <p className="text-sm text-blue-600 mt-1">
              All exported data is completely anonymized. No personally identifiable information
              is included in exports. User IDs are replaced with anonymous hashes for privacy protection.
            </p>
          </div>
        </div>
      </div>

      {/* Export Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Range */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={exportConfig.startDate}
                onChange={(e) => setExportConfig({ ...exportConfig, startDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                max={exportConfig.endDate}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={exportConfig.endDate}
                onChange={(e) => setExportConfig({ ...exportConfig, endDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                min={exportConfig.startDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Export Format
              </label>
              <select
                value={exportConfig.format}
                onChange={(e) => setExportConfig({ ...exportConfig, format: e.target.value as "csv" | "json" })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="csv">CSV (Comma Separated Values)</option>
                <option value="json">JSON (JavaScript Object Notation)</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Include Crisis Events
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeResolved}
                    onChange={(e) => setExportConfig({ ...exportConfig, includeResolved: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Resolved events</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeUnresolved}
                    onChange={(e) => setExportConfig({ ...exportConfig, includeUnresolved: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Unresolved events</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Confidence Levels
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.confidenceLevels.high}
                    onChange={(e) => setExportConfig({
                      ...exportConfig,
                      confidenceLevels: { ...exportConfig.confidenceLevels, high: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">High confidence</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.confidenceLevels.medium}
                    onChange={(e) => setExportConfig({
                      ...exportConfig,
                      confidenceLevels: { ...exportConfig.confidenceLevels, medium: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Medium confidence</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.confidenceLevels.low}
                    onChange={(e) => setExportConfig({
                      ...exportConfig,
                      confidenceLevels: { ...exportConfig.confidenceLevels, low: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Low confidence</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Export Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Export Preview</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Date Range:</strong> {exportConfig.startDate} to {exportConfig.endDate}</p>
            <p><strong>Format:</strong> {exportConfig.format.toUpperCase()}</p>
            <p><strong>Estimated Records:</strong> ~{estimate.records}</p>
            <p><strong>Estimated Size:</strong> ~{estimate.sizeMB.toFixed(1)} MB</p>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={exportData}
            disabled={isExporting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isExporting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {isExporting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </span>
            ) : (
              "Export Data"
            )}
          </button>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export History</h3>
        
        {exportHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg 
              className="mx-auto h-12 w-12 text-gray-300 mb-4" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p>No exports created yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exportHistory.map((exportItem) => (
              <div
                key={exportItem.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <svg 
                      className="h-8 w-8 text-purple-500" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{exportItem.filename}</p>
                    <p className="text-sm text-gray-600">
                      {exportItem.records.toLocaleString()} records • {exportItem.size}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created {new Date(exportItem.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // In a real app, this would trigger a download
                      alert("Download functionality would be implemented here");
                    }}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this export?")) {
                        setExportHistory(exportHistory.filter(item => item.id !== exportItem.id));
                      }
                    }}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg 
              className="h-5 w-5 text-yellow-500 mt-0.5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.178 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Export Guidelines</h3>
            <div className="text-sm text-yellow-700 mt-1">
              <ul className="list-disc list-inside space-y-1">
                <li>Maximum export range: 90 days</li>
                <li>All data is automatically anonymized for privacy</li>
                <li>Exports are logged and audited for security</li>
                <li>Delete old exports when no longer needed</li>
                <li>Contact support for bulk historical data requests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}