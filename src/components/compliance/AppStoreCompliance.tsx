'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface TouchTargetProps {
  children: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  minSize?: number;
}

// App Store compliant touch target (minimum 44pt)
export function TouchTarget({ 
  children, 
  onPress, 
  accessibilityLabel, 
  minSize = 44 
}: TouchTargetProps) {
  return (
    <button
      onClick={onPress}
      className={`inline-flex items-center justify-center`}
      style={{ minWidth: `${minSize}px`, minHeight: `${minSize}px` }}
      aria-label={accessibilityLabel}
      role="button"
    >
      {children}
    </button>
  );
}

// Performance monitoring for App Store standards
export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    launchTime: 0,
    memoryUsage: 0,
    crashCount: 0,
    networkErrors: 0
  });

  useEffect(() => {
    // Monitor launch time
    const startTime = performance.timeOrigin;
    const loadTime = performance.now();
    
    // App Store requirement: <2000ms launch time
    if (loadTime > 2000) {
      console.warn('App Store Compliance Warning: Launch time exceeds 2 seconds', loadTime);
    }

    // Monitor memory usage (simulate - actual implementation would use Performance API)
    const estimateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }
      return 0;
    };

    // Monitor performance metrics
    const monitoringInterval = setInterval(() => {
      const memUsage = estimateMemoryUsage();
      
      // App Store requirement: <50MB background memory
      if (memUsage > 50) {
        console.warn('App Store Compliance Warning: Memory usage exceeds 50MB', memUsage);
      }

      setMetrics(prev => ({
        ...prev,
        launchTime: loadTime,
        memoryUsage: memUsage
      }));
    }, 5000);

    return () => clearInterval(monitoringInterval);
  }, []);

  return null; // This is a monitoring component, no UI
}

// Age rating compliance component
export function AgeRatingCompliance() {
  const [userAge, setUserAge] = useState<number | null>(null);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  useEffect(() => {
    const savedAge = localStorage.getItem('alchm-user-age-verified');
    if (savedAge === 'true') {
      setIsAgeVerified(true);
    }
  }, []);

  const handleAgeVerification = (age: number) => {
    setUserAge(age);
    if (age >= 13) {
      setIsAgeVerified(true);
      localStorage.setItem('alchm-user-age-verified', 'true');
    }
  };

  if (isAgeVerified) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-xl font-medium text-center">Age Verification Required</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            ALCHM is designed for users 13 years and older. Please verify your age to continue.
          </p>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What is your age?
            </label>
            <select
              onChange={(e) => handleAgeVerification(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              defaultValue=""
              aria-label="Select your age"
            >
              <option value="" disabled>Select your age</option>
              {Array.from({ length: 85 }, (_, i) => i + 13).map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>

          {userAge !== null && userAge < 13 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                ALCHM is not intended for users under 13. Please ask a parent or guardian for guidance 
                on age-appropriate mental wellness resources.
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>
              By verifying your age, you confirm that the information provided is accurate. 
              ALCHM is rated 12+ on the App Store for mature themes related to mental health.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Accessibility compliance helpers
export function AccessibilityEnhanced({ 
  children, 
  label, 
  role, 
  describedBy 
}: {
  children: React.ReactNode;
  label: string;
  role?: string;
  describedBy?: string;
}) {
  return (
    <div
      aria-label={label}
      role={role}
      aria-describedby={describedBy}
      className="focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-opacity-50"
    >
      {children}
    </div>
  );
}

// Dark mode compliance component
export function DarkModeSupport({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {children}
    </div>
  );
}

// Network error handling for App Store compliance
export function NetworkErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasNetworkError(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor for network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok && response.status >= 500) {
          setHasNetworkError(true);
        }
        return response;
      } catch (error) {
        setHasNetworkError(true);
        throw error;
      }
    };

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.fetch = originalFetch;
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-6">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-xl font-medium mb-2">You're Offline</h2>
            <p className="text-gray-600 mb-4">
              ALCHM works offline for journaling. Your entries are saved locally and will sync when you're back online.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-sage-600 hover:bg-sage-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasNetworkError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-medium mb-2">Connection Issue</h2>
            <p className="text-gray-600 mb-4">
              We're having trouble connecting to our servers. Your data is safe, and you can continue journaling offline.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  setHasNetworkError(false);
                  window.location.reload();
                }}
                className="w-full bg-sage-600 hover:bg-sage-700"
              >
                Try Again
              </Button>
              <Button
                onClick={() => setHasNetworkError(false)}
                variant="outline"
                className="w-full"
              >
                Continue Offline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// Content moderation compliance
export function ContentModerationNotice() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="font-medium text-blue-800 mb-2">Community Guidelines</h3>
      <p className="text-sm text-blue-700 mb-2">
        ALCHM is a safe space for personal reflection. While your journal entries are private, 
        please be mindful that this platform is designed for healing and growth.
      </p>
      <div className="text-xs text-blue-600">
        <p>
          If you encounter any content that violates our community guidelines, 
          please report it through the support channels. We're committed to maintaining 
          a supportive environment for all users.
        </p>
      </div>
    </div>
  );
}

// Main App Store compliance wrapper
export function AppStoreComplianceWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeSupport>
      <NetworkErrorBoundary>
        <PerformanceMonitor />
        <AgeRatingCompliance />
        {children}
      </NetworkErrorBoundary>
    </DarkModeSupport>
  );
}