'use client';

import { useState, useEffect } from 'react';
import { abTesting, ABTest, ABTestResults } from '@/lib/ab-testing';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ABTestDashboardProps {
  isAdmin?: boolean;
}

export default function ABTestDashboard({ isAdmin = false }: ABTestDashboardProps) {
  const [activeTests, setActiveTests] = useState<ABTest[]>([]);
  const [testResults, setTestResults] = useState<Map<string, ABTestResults>>(new Map());
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      const tests = abTesting.getActiveTests();
      setActiveTests(tests);

      // Load results for each test
      const resultsMap = new Map<string, ABTestResults>();
      for (const test of tests) {
        const results = abTesting.getTestResults(test.id);
        if (results) {
          resultsMap.set(test.id, results);
        }
      }
      setTestResults(resultsMap);
    } catch (error) {
      console.error('Failed to load A/B test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTestStatus = (testId: string, currentStatus: boolean) => {
    abTesting.setTestStatus(testId, !currentStatus);
    loadTestData(); // Refresh data
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      }`}>
        {isActive ? 'Running' : 'Paused'}
      </span>
    );
  };

  const getConfidenceBadge = (confidence: number) => {
    const getColor = () => {
      if (confidence >= 95) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      if (confidence >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
        {confidence.toFixed(1)}% confident
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-[#1E1E1E] min-h-screen text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium text-[#E5E7EB]">A/B Testing Dashboard</h1>
        {isAdmin && (
          <Button 
            onClick={() => loadTestData()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Refresh Data
          </Button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#2D2D30] border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Active Tests</p>
              <p className="text-2xl font-medium text-white">{activeTests.filter(t => t.isActive).length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#2D2D30] border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
              <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Significant Results</p>
              <p className="text-2xl font-medium text-white">
                {Array.from(testResults.values()).filter(r => r.significance >= 95).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#2D2D30] border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Total Participants</p>
              <p className="text-2xl font-medium text-white">
                {Array.from(testResults.values()).reduce((sum, r) => 
                  sum + r.variants.reduce((vSum, v) => vSum + v.participants, 0), 0
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Test List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTests.map(test => {
          const results = testResults.get(test.id);
          const winningVariant = results?.variants.find(v => v.isWinner);
          
          return (
            <Card key={test.id} className="p-6 bg-[#2D2D30] border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">{test.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{test.description}</p>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(test.isActive)}
                    <span className="text-xs text-gray-500">
                      {test.variants.length} variants
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => toggleTestStatus(test.id, test.isActive)}
                      size="sm"
                      variant={test.isActive ? "secondary" : "primary"}
                      className="text-xs"
                    >
                      {test.isActive ? 'Pause' : 'Resume'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Test Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Test Progress</span>
                  <span className="text-sm text-gray-400">
                    {test.endDate ? Math.round(
                      ((Date.now() - test.startDate.getTime()) / 
                       (test.endDate.getTime() - test.startDate.getTime())) * 100
                    ) : '∞'}% Complete
                  </span>
                </div>
                {test.endDate && (
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.round(
                          ((Date.now() - test.startDate.getTime()) / 
                           (test.endDate.getTime() - test.startDate.getTime())) * 100
                        ))}%`
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Variant Performance */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300">Variant Performance</h4>
                {results?.variants.map(variant => (
                  <div key={variant.variantId} className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        variant.isWinner ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-white">{variant.variantName}</p>
                        <p className="text-xs text-gray-400">
                          {variant.participants} participants
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {variant.conversionRate.toFixed(1)}%
                      </p>
                      {variant.confidence > 0 && getConfidenceBadge(variant.confidence)}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No data available yet</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-400">Target Metric</p>
                    <p className="text-sm font-medium text-white">{test.targetMetric}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Conversion Goals</p>
                    <p className="text-sm font-medium text-white">{test.conversionGoals.length}</p>
                  </div>
                </div>
              </div>

              {winningVariant && results && results.significance >= 95 && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-400">
                      {winningVariant.variantName} is winning with {results.significance.toFixed(1)}% significance
                    </span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {activeTests.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No A/B Tests</h3>
          <p className="mt-1 text-sm text-gray-500">No active A/B tests are currently running.</p>
        </div>
      )}
    </div>
  );
}