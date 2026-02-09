'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { openaiWithRateLimit } from '@/lib/openaiWithRateLimit';

interface UsageStats {
  usage: {
    tokenCount: number;
    requestCount: number;
    costUSD: number;
    subscriptionTier: 'growth' | 'transformation';
  };
  limits: {
    dailyTokenLimit: number;
    dailyRequestLimit: number;
    dailyCostLimitUSD: number;
  };
  percentUsed: {
    tokens: number;
    requests: number;
    cost: number;
  };
}

export default function UsageMonitor({ 
  subscriptionTier = 'growth',
  compact = false 
}: { 
  subscriptionTier?: 'growth' | 'transformation';
  compact?: boolean;
}) {
  const { user } = useAuth();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    loadUsageStats();
  }, [user, subscriptionTier]);

  const loadUsageStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await openaiWithRateLimit.getUserUsageStats(user?.uid, subscriptionTier);
      setUsageStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load usage stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-white/5 rounded-xl animate-pulse`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-white/20 rounded-full"></div>
          <div className="w-20 h-4 bg-white/20 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-white/10 rounded"></div>
          <div className="w-3/4 h-2 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !usageStats) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-red-500/10 border border-red-500/20 rounded-xl`}>
        <p className="text-red-200 text-sm">
          {error || 'Unable to load usage stats'}
        </p>
        <button
          onClick={loadUsageStats}
          className="text-red-300 text-xs underline mt-1"
        >
          Try again
        </button>
      </div>
    );
  }

  const { usage, limits, percentUsed } = usageStats;

  const getUsageColor = (percent: number) => {
    if (percent < 50) return 'text-green-300';
    if (percent < 80) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getBarColor = (percent: number) => {
    if (percent < 50) return 'bg-green-500';
    if (percent < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (compact) {
    const highestUsage = Math.max(percentUsed.tokens, percentUsed.requests, percentUsed.cost);
    const isHighUsage = highestUsage > 80;

    return (
      <div className={`p-3 rounded-xl border transition-all duration-200 ${
        isHighUsage 
          ? 'bg-red-500/10 border-red-500/30' 
          : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isHighUsage ? 'bg-red-400' : 'bg-green-400'
            }`}></div>
            <span className="text-white/70 text-sm">
              {subscriptionTier === 'growth' ? 'Growth' : 'Transformation'} Plan
            </span>
          </div>
          <span className={`text-sm font-medium ${getUsageColor(highestUsage)}`}>
            {Math.round(highestUsage)}%
          </span>
        </div>
        
        {isHighUsage && (
          <p className="text-red-200 text-xs mt-2">
            Approaching daily limits
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">
          Daily Usage ({subscriptionTier === 'growth' ? 'Growth' : 'Transformation'})
        </h3>
        <button
          onClick={loadUsageStats}
          className="text-white/60 hover:text-white/80 transition-colors"
          title="Refresh usage stats"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* API Requests */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-white/80 text-sm">API Requests</span>
            <span className={`text-sm font-medium ${getUsageColor(percentUsed.requests)}`}>
              {usage.requestCount}/{limits.dailyRequestLimit}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(percentUsed.requests)}`}
              style={{ width: `${Math.min(percentUsed.requests, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Token Usage */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-white/80 text-sm">Tokens Used</span>
            <span className={`text-sm font-medium ${getUsageColor(percentUsed.tokens)}`}>
              {usage.tokenCount.toLocaleString()}/{limits.dailyTokenLimit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(percentUsed.tokens)}`}
              style={{ width: `${Math.min(percentUsed.tokens, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Cost Usage */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-white/80 text-sm">Daily Cost</span>
            <span className={`text-sm font-medium ${getUsageColor(percentUsed.cost)}`}>
              ${usage.costUSD.toFixed(4)}/${limits.dailyCostLimitUSD.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(percentUsed.cost)}`}
              style={{ width: `${Math.min(percentUsed.cost, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {(percentUsed.requests > 80 || percentUsed.tokens > 80 || percentUsed.cost > 80) && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-300">⚠️</span>
            <span className="text-yellow-200 text-sm font-medium">Approaching Daily Limits</span>
          </div>
          <p className="text-yellow-200/80 text-xs mt-1">
            {subscriptionTier === 'growth' 
              ? 'Consider upgrading to Transformation for higher limits'
              : 'Limits reset at midnight UTC'
            }
          </p>
        </div>
      )}

      {subscriptionTier === 'growth' && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => window.location.href = '/pricing/'}
            className="text-[#E5C97D] text-sm hover:text-[#F2D99D] transition-colors"
          >
            Upgrade for higher limits →
          </button>
        </div>
      )}
    </div>
  );
}