import { useEffect, useState } from 'react';
import {
  generateArcReflection,
  generateClosingSeed,
  generateCompletionAcknowledgment,
} from '@/services/containers/arcGeneration';

export function useContainerArcReflection(input: {
  userId: string | null | undefined;
  userContainerId?: string;
  containerName?: string;
  day?: number;
}): { reflection: string | null; isLoading: boolean } {
  const [reflection, setReflection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!input.userId || !input.userContainerId || !input.containerName || (input.day !== 7 && input.day !== 14)) {
      setReflection(null);
      return;
    }

    let active = true;
    setIsLoading(true);
    generateArcReflection(input.userId, input.userContainerId, input.containerName, input.day)
      .then((text) => {
        if (active) setReflection(text);
      })
      .catch(() => {
        if (active) setReflection(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [input.containerName, input.day, input.userContainerId, input.userId]);

  return { reflection, isLoading };
}

export function useContainerClosingCopy(containerName?: string): {
  acknowledgment: string;
  closingSeed: string;
  isLoading: boolean;
} {
  const [acknowledgment, setAcknowledgment] = useState('');
  const [closingSeed, setClosingSeed] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerName) return;

    let active = true;
    Promise.all([
      generateCompletionAcknowledgment(containerName),
      generateClosingSeed(containerName),
    ])
      .then(([ack, seed]) => {
        if (!active) return;
        setAcknowledgment(ack);
        setClosingSeed(seed);
      })
      .catch(() => {
        if (!active) return;
        setAcknowledgment(`"${containerName}" can rest here. The words you placed here remain yours.`);
        setClosingSeed(`What, if anything, would you like to carry from "${containerName}"?`);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [containerName]);

  return { acknowledgment, closingSeed, isLoading };
}
