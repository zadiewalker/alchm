'use client';

import type { Emotion } from '@/lib/emotions';
import type { BodySensation } from '@/lib/somatic';

export type DepthLayer = 'name' | 'feel' | 'write' | 'reflect' | 'explore' | 'closing';

export interface DepthFlowState {
  layer: DepthLayer;
  entryId: string;
  emotion: Emotion | null;
  sensation: BodySensation | null;
  content: string;
  tags: string[];
  reflection: string | null;
  followUp: { question: string | null; response: string | null };
  startedAt: string;
}

function generateId(): string {
  return `entry_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createFlowState(): DepthFlowState {
  return {
    layer: 'name',
    entryId: generateId(),
    emotion: null,
    sensation: null,
    content: '',
    tags: [],
    reflection: null,
    followUp: { question: null, response: null },
    startedAt: new Date().toISOString(),
  };
}

export function nextLayer(state: DepthFlowState, opts?: { skip?: boolean }): DepthLayer {
  switch (state.layer) {
    case 'name':
      return opts?.skip ? 'write' : 'feel';
    case 'feel':
      return 'write';
    case 'write':
      return 'reflect';
    case 'reflect':
      return 'explore';
    case 'explore':
      return 'closing';
    case 'closing':
      return 'closing';
    default:
      return 'name';
  }
}

export function isSkippable(layer: DepthLayer): boolean {
  return layer === 'feel' || layer === 'explore';
}

