import type { ContainerDefinition } from '@/types/container';
import type { EmotionalCheckIn } from '@/types/journal';
import type { KheperaResponse } from '@/types/khepera';
import { CONTAINER_DEFINITIONS } from '@/config/containerDefinitions';

const findContainer = (id: string): ContainerDefinition => {
  const container = CONTAINER_DEFINITIONS.find((item) => item.id === id);

  if (!container) {
    throw new Error(`[qa fixtures] Missing container definition for "${id}".`);
  }

  return container;
};

export const QA_KHEPERA_RESPONSE: KheperaResponse = {
  witness:
    'You wrote from the place where steadiness and strain were both present, without pretending either one was the whole picture.',
  perspective:
    'There is a sense of trying to stay close to what matters while also noticing how much effort that closeness has been taking.',
  seed: 'What feels quietly true underneath the effort to hold everything together?',
};

export const QA_KHEPERA_TONE: EmotionalCheckIn = 'tender';

export const QA_MIRROR_THREADS = [
  'A wish to stay close without disappearing inside what someone else needs.',
  'A recurring pull between staying steady and staying available.',
];

export const QA_CONTAINERS_ACTIVE = findContainer('sitting-with-anxiety');

export const QA_CONTAINERS_LIST: ContainerDefinition[] = [
  findContainer('sitting-with-anxiety'),
  findContainer('the-inner-critic'),
  findContainer('seven-days-of-noticing'),
];
