'use client';

import { useCallback, useState } from 'react';
import { getReflection } from '@/lib/api';
import { getEntries, updateEntry } from '@/lib/journal';
import { buildSystemPrompt, getCurrentStage } from '@/lib/khepera';
import { createLocalReflection } from '@/lib/localReflection';
import { getAnthropicApiKey } from '@/lib/secrets';

export function useKheperaReflection(args: { preferredFramework: string | null }) {
  const [reflection, setReflection] = useState('');
  const [reflectionError, setReflectionError] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);

  const reflect = useCallback(
    async (entryId: string) => {
      setIsReflecting(true);
      setReflectionError('');

      try {
        const entry = getEntries().find((e) => e.id === entryId) || null;
        if (!entry) {
          setReflectionError('Entry not found.');
          setIsReflecting(false);
          return;
        }

        const apiKey = getAnthropicApiKey();
        if (!apiKey) {
          const local = createLocalReflection(entry);
          updateEntry(entryId, { kheperaReflection: local });
          setReflection(local);
          setIsReflecting(false);
          return;
        }

        const entryCount = getEntries().length;
        const stage = getCurrentStage(entryCount);
        const preferred =
          args.preferredFramework === 'cbt' ||
          args.preferredFramework === 'ifs' ||
          args.preferredFramework === 'somatic' ||
          args.preferredFramework === 'narrative' ||
          args.preferredFramework === 'existential'
            ? args.preferredFramework
            : null;

        const systemPrompt = buildSystemPrompt({
          entryCount,
          currentStreak: 0,
          preferredFramework: preferred,
          isCheckin: false,
          continuityContext: `Stage: ${stage.name}`,
        });

        const result = await getReflection({ systemPrompt, userMessage: entry.content, apiKey });
        if (result.error) {
          setReflectionError(result.error);
        } else if (result.text) {
          updateEntry(entryId, { kheperaReflection: result.text });
          setReflection(result.text);
        }
      } catch {
        setReflectionError('Khepera could not reflect right now. Your entry is saved.');
      } finally {
        setIsReflecting(false);
      }
    },
    [args.preferredFramework],
  );

  return { reflection, setReflection, reflectionError, setReflectionError, isReflecting, reflect };
}

