"use client";

import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { CrisisMonitoringDashboard } from "@/components/admin/CrisisMonitoringDashboard";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-purple-900 mb-2">
                  Crisis Monitoring Dashboard
                </h1>
                <p className="text-purple-600">
                  Real-time monitoring of user safety with privacy protection
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-purple-600">Logged in as:</p>
                  <p className="font-medium text-purple-900">{user?.email}</p>
                </div>
                <button
                  onClick={() => auth.signOut()}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
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
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.178 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Privacy Protection Active</h3>
                <p className="text-sm text-blue-600 mt-1">
                  All user data is anonymized. This dashboard displays only non-identifying information
                  necessary for crisis intervention and system monitoring. All access is logged and audited.
                </p>
              </div>
            </div>
          </div>

          {/* Main Dashboard */}
          <CrisisMonitoringDashboard />
        </div>
      </div>
    </AdminAuthGuard>
  );
}
