"use client";
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/useAuth';
import journalService, { JournalEntry, UserStats } from '@/lib/journal-service';

// Hook for managing journal entries
export function useJournalEntries(options?: { 
  limit?: number; 
  pathway?: string;
  realtime?: boolean;
}) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    // Real-time subscription
    if (options?.realtime) {
      const unsubscribe = journalService.subscribeToEntries(
        user.uid,
        (updatedEntries) => {
          setEntries(updatedEntries);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }

    // One-time fetch
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const data = await journalService.getEntries(user.uid, options);
        setEntries(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
    
    // Return empty cleanup function for non-realtime case
    return () => {};
  }, [user, options?.limit, options?.pathway, options?.realtime]);

  return { entries, loading, error, refetch: () => {} };
}

// Hook for user statistics
export function useJournalStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const userStats = await journalService.getUserStats(user.uid);
        setStats(userStats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const formatLastEntry = useCallback(() => {
    if (!stats?.lastEntryDate) return 'Never';
    
    const lastDate = stats.lastEntryDate instanceof Date 
      ? stats.lastEntryDate 
      : stats.lastEntryDate.toDate();
    
    const now = new Date();
    const diff = now.getTime() - lastDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }, [stats]);

  return { 
    streak: stats?.streak || 0, 
    lastEntry: formatLastEntry(),
    totalEntries: stats?.totalEntries || 0,
    totalWords: stats?.totalWords || 0,
    averageMood: stats?.averageMood,
    loading 
  };
}

// Hook for creating journal entries
export function useCreateJournal() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEntry = useCallback(async (
    content: string,
    options?: {
      mood?: number;
      tags?: string[];
      pathway?: string;
      encrypt?: boolean;
      emotionalContext?: any;
    }
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setSaving(true);
      setError(null);
      const entryId = await journalService.createEntry(user.uid, content, options);
      return entryId;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [user]);

  return { createEntry, saving, error };
}

// Hook for updating journal entries
export function useUpdateJournal() {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateEntry = useCallback(async (
    entryId: string,
    updates: Partial<JournalEntry>
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setUpdating(true);
      setError(null);
      await journalService.updateEntry(user.uid, entryId, updates);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [user]);

  return { updateEntry, updating, error };
}

// Hook for deleting journal entries
export function useDeleteJournal() {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteEntry = useCallback(async (entryId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setDeleting(true);
      setError(null);
      await journalService.deleteEntry(user.uid, entryId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, [user]);

  return { deleteEntry, deleting, error };
}

// Hook for exporting journal entries
export function useExportJournals() {
  const { user } = useAuth();
  const { entries } = useJournalEntries();
  
  const exportAsMarkdown = useCallback(() => {
    if (!entries.length) return '';

    const markdown = entries.map(entry => {
      const date = entry.createdAt instanceof Date 
        ? entry.createdAt 
        : entry.createdAt.toDate();
      
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const mood = entry.mood ? `Mood: ${entry.mood}/10` : '';
      const tags = entry.tags?.length ? `Tags: ${entry.tags.join(', ')}` : '';
      const metadata = [mood, tags].filter(Boolean).join(' | ');

      return `## ${dateStr}\n${metadata ? `*${metadata}*\n\n` : ''}${entry.content}\n\n---`;
    }).join('\n\n');

    return markdown;
  }, [entries]);

  const exportAsJSON = useCallback(() => {
    return JSON.stringify(entries, null, 2);
  }, [entries]);

  const downloadFile = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = typeof window !== 'undefined' && document.createElement('a');
    link.href = url;
    link.download = filename;
    typeof window !== 'undefined' && document.body.appendChild(link);
    link.click();
    typeof window !== 'undefined' && document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportMarkdown = useCallback(() => {
    const content = exportAsMarkdown();
    const date = new Date().toISOString().split('T')[0];
    downloadFile(content, `alchm-journal-${date}.md`);
  }, [exportAsMarkdown, downloadFile]);

  const exportJSON = useCallback(() => {
    const content = exportAsJSON();
    const date = new Date().toISOString().split('T')[0];
    downloadFile(content, `alchm-journal-${date}.json`);
  }, [exportAsJSON, downloadFile]);

  return { exportMarkdown, exportJSON };
}