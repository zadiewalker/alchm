'use client';

import { useCallback, useEffect, useRef } from 'react';
import { saveDraft } from '@/lib/journal';

export function useDraftAutosave(args: {
  enabled: boolean;
  content: string;
  mood: number | undefined;
  tags: string;
  pathwayId: string | null;
  pathwayStep: number;
}) {
  const timer = useRef<number | null>(null);

  const schedule = useCallback(() => {
    if (!args.enabled) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const nextTags = args.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 12);

      saveDraft({
        content: args.content,
        mood: args.mood,
        tags: nextTags,
        pathwayId: args.pathwayId || undefined,
        pathwayStep: args.pathwayStep,
      });
    }, 2000);
  }, [args]);

  useEffect(() => {
    schedule();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [schedule]);
}

