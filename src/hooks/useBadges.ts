'use client';

// hooks/useBadges.ts - React hooks for badge management

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { badgeService, AVAILABLE_BADGES } from '@/lib/badges/service';
import { Badge } from '@/lib/badges/export';

export function useBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBadges();
    } else {
      setBadges([]);
      setLoading(false);
    }
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userBadges = await badgeService.getUserBadges(user.uid);
      setBadges(userBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndAwardBadges = async (activityData: {
    totalEntries?: number;
    currentStreak?: number;
    longestStreak?: number;
    communityEngagement?: boolean;
  }) => {
    if (!user) return [];

    try {
      const newBadges = await badgeService.autoAwardBadges(user.uid, activityData);
      if (newBadges.length > 0) {
        // Refresh badge list
        await loadBadges();
      }
      return newBadges;
    } catch (error) {
      console.error('Error checking badge eligibility:', error);
      return [];
    }
  };

  const addBadgeNotes = async (badgeId: string, notes: string) => {
    if (!user) return false;

    try {
      const success = await badgeService.addBadgeNotes(user.uid, badgeId, notes);
      if (success) {
        await loadBadges();
      }
      return success;
    } catch (error) {
      console.error('Error adding badge notes:', error);
      return false;
    }
  };

  const getBadgeStats = () => {
    const total = badges.length;
    const byCategory = badges.reduce((acc, badge) => {
      acc[badge.category] = (acc[badge.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentBadges = badges
      .sort((a, b) => new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime())
      .slice(0, 3);

    return {
      total,
      byCategory,
      recentBadges
    };
  };

  return {
    badges,
    loading,
    checkAndAwardBadges,
    addBadgeNotes,
    getBadgeStats,
    refetch: loadBadges
  };
}

// Hook for badge progress tracking
export function useBadgeProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, number>>({});

  const updateProgress = (badgeId: string, currentValue: number, targetValue: number) => {
    setProgress(prev => ({
      ...prev,
      [badgeId]: Math.min((currentValue / targetValue) * 100, 100)
    }));
  };

  const getBadgeProgress = (badgeId: string) => {
    return progress[badgeId] || 0;
  };

  return {
    updateProgress,
    getBadgeProgress,
    progress
  };
}

// Hook for badge notifications
export function useBadgeNotifications() {
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const addNewBadge = (badgeId: string) => {
    setNewBadges(prev => [...prev, badgeId]);
    setShowNotification(true);
  };

  const dismissNotification = () => {
    setShowNotification(false);
    setNewBadges([]);
  };

  return {
    newBadges,
    showNotification,
    addNewBadge,
    dismissNotification
  };
}