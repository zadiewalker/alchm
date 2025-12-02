// useSacredMetrics hook for sacred journaling metrics
import { useState, useEffect } from 'react';

export interface SacredMetrics {
  totalEntries: number;
  currentStreak: number;
  level: number;
  weeklyAverage: number;
  lastEntryDate?: Date;
}

export function useSacredMetrics() {
  const [metrics, setMetrics] = useState<SacredMetrics>({
    totalEntries: 0,
    currentStreak: 0,
    level: 1,
    weeklyAverage: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For build purposes, return basic metrics
    // In production, this would load real user metrics
    setMetrics({
      totalEntries: 0,
      currentStreak: 0,
      level: 1,
      weeklyAverage: 0,
    });
    setLoading(false);
  }, []);

  return { metrics, loading };
}