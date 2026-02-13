"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

interface AdminAuthGuardProps {
  children: ReactNode;
}

interface AdminUser {
  uid: string;
  email: string;
  role: "crisis_monitor" | "crisis_supervisor" | "system_admin";
  permissions: string[];
  verified: boolean;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { navigate } = useSafeNavigation(900);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Verify admin access with backend
        const token = await currentUser.getIdToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/verify-access`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.ok) {
          const adminData = await response.json();
          setAdminUser(adminData.adminUser);
          setError("");
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Access denied");
          setAdminUser(null);
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        setError("Unable to verify admin access. Please try again.");
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-purple-900 mb-2">
            Verifying Admin Access
          </h2>
          <p className="text-purple-600">
            Please wait while we confirm your authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <svg 
              className="h-8 w-8 text-red-600" 
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
          <h2 className="text-2xl font-bold text-red-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-red-600 mb-6">
            You must be logged in to access the crisis monitoring dashboard.
          </p>
          <button
            onClick={() => navigate("/auth/login", { source: "admin-auth-guard" })}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error || !adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <svg 
              className="h-8 w-8 text-red-600" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-4">
            Access Denied
          </h2>
          <p className="text-red-600 mb-6">
            {error || "You do not have permission to access the crisis monitoring dashboard."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => auth.signOut()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors w-full"
            >
              Sign Out
            </button>
            <p className="text-sm text-red-500">
              If you believe this is an error, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Admin context provider - secure data sharing without XSS risk */}
      <div 
        id="admin-user-data" 
        data-admin-role={adminUser.role}
        data-admin-verified={adminUser.verified}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </>
  );
}
