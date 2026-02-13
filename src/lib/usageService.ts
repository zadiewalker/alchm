'use client';

import { rateLimiter } from './rateLimiting';

export async function getUserUsageStats(
  userId?: string,
  subscriptionTier: 'growth' | 'transformation' = 'growth'
) {
  if (!userId) {
    throw new Error('User authentication required');
  }

  return rateLimiter.getUserUsage(userId, subscriptionTier);
}
