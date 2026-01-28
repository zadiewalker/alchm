"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

interface CrisisEvent {
  id: string;
  anonymizedId: string;
  confidenceLevel: "low" | "medium" | "high";
  reasoning: string;
  timestamp: string;
  escalated: boolean;
  resolved: boolean;
  resolvedAt?: string;
  demographics?: {
    ageRange?: string;
    language?: string;
  };
  location?: {
    country: string;
    region?: string;
  };
}

export function CrisisEventsList() {
  const [events, setEvents] = useState<CrisisEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    confidenceLevel: "",
    resolved: "",
    timeRange: "24h"
  });
  const [selectedEvent, setSelectedEvent] = useState<CrisisEvent | null>(null);

  // Fetch crisis events
  const fetchEvents = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const params = new URLSearchParams();
      
      if (filters.confidenceLevel) params.append("confidenceLevel", filters.confidenceLevel);
      if (filters.resolved) params.append("resolved", filters.resolved);
      
      // Calculate date range
      const now = new Date();
      let startDate: Date;
      switch (filters.timeRange) {
        case "1h":
          startDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case "24h":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
      
      params.append("startDate", startDate.toISOString());
      params.append("endDate", now.toISOString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis-events?${params}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch crisis events");
      }
    } catch (err) {
      console.error("Error fetching crisis events:", err);
      setError("Unable to load crisis events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [filters]);

  const handleEscalate = async (eventId: string) => {
    const reason = prompt("Please provide a reason for escalating this crisis:");
    if (!reason) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis/${eventId}/escalate`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ reason })
        }
      );

      if (response.ok) {
        fetchEvents(); // Refresh the list
        alert("Crisis escalated successfully");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Error escalating crisis:", err);
      alert("Failed to escalate crisis");
    }
  };

  const handleResolve = async (eventId: string) => {
    const notes = prompt("Please provide resolution notes (optional):");
    
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis/${eventId}/resolve`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ notes })
        }
      );

      if (response.ok) {
        fetchEvents(); // Refresh the list
        alert("Crisis resolved successfully");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Error resolving crisis:", err);
      alert("Failed to resolve crisis");
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case "high": return "🚨";
      case "medium": return "⚠️";
      case "low": return "ℹ️";
      default: return "❓";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading crisis events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confidence Level
            </label>
            <select
              value={filters.confidenceLevel}
              onChange={(e) => setFilters({ ...filters, confidenceLevel: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.resolved}
              onChange={(e) => setFilters({ ...filters, resolved: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Events</option>
              <option value="false">Active</option>
              <option value="true">Resolved</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchEvents}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Crisis Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg 
              className="mx-auto h-12 w-12 text-gray-300 mb-4" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No crisis events found for the selected criteria.</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`bg-white border rounded-lg p-4 ${
                event.confidenceLevel === "high" && !event.resolved 
                  ? "border-red-200 bg-red-50" 
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg">
                      {getConfidenceIcon(event.confidenceLevel)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(event.confidenceLevel)}`}>
                      {event.confidenceLevel.toUpperCase()} CONFIDENCE
                    </span>
                    {event.escalated && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        ESCALATED
                      </span>
                    )}
                    {event.resolved && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        RESOLVED
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Anonymous ID:</strong> {event.anonymizedId}
                  </p>

                  <p className="text-sm text-gray-800 mb-3">
                    <strong>AI Assessment:</strong> {event.reasoning}
                  </p>

                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                    {event.demographics?.language && (
                      <span>Language: {event.demographics.language}</span>
                    )}
                    {event.location?.country && (
                      <span>Location: {event.location.country}</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  {!event.resolved && !event.escalated && (
                    <button
                      onClick={() => handleEscalate(event.id)}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-md hover:bg-orange-200 transition-colors text-xs font-medium"
                    >
                      Escalate
                    </button>
                  )}
                  {!event.resolved && (
                    <button
                      onClick={() => handleResolve(event.id)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-xs font-medium"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crisis Event Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <strong>Anonymous ID:</strong> {selectedEvent.anonymizedId}
              </div>
              <div>
                <strong>Confidence Level:</strong> {selectedEvent.confidenceLevel}
              </div>
              <div>
                <strong>Detection Time:</strong> {new Date(selectedEvent.timestamp).toLocaleString()}
              </div>
              <div>
                <strong>AI Assessment:</strong>
                <p className="text-sm text-gray-600 mt-1">{selectedEvent.reasoning}</p>
              </div>
              {selectedEvent.demographics && (
                <div>
                  <strong>Demographics:</strong>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedEvent.demographics.ageRange && <p>Age Range: {selectedEvent.demographics.ageRange}</p>}
                    {selectedEvent.demographics.language && <p>Language: {selectedEvent.demographics.language}</p>}
                  </div>
                </div>
              )}
              {selectedEvent.location && (
                <div>
                  <strong>Location:</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedEvent.location.country}
                    {selectedEvent.location.region && `, ${selectedEvent.location.region}`}
                  </p>
                </div>
              )}
              {selectedEvent.resolvedAt && (
                <div>
                  <strong>Resolved:</strong> {new Date(selectedEvent.resolvedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}