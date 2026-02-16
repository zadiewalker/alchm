'use client';

import { getStorageItemWithFallback, setStorageItemNormalized } from '@/lib/storageKeys';

// TODO: Community sharing requires server-side content moderation before
// enabling public visibility. Current implementation stores locally only.
// Do NOT enable public feed without moderation pipeline.

export interface SharedReflection {
  id: string;
  content: string;
  mood: string[];
  sharedAt: string;
  resonanceCount: number;
  isAnonymous: true;
}

export interface ShareableContent {
  type: 'entry_excerpt' | 'khepera_reflection' | 'milestone';
  content: string;
  mood?: string[];
}

const STORAGE_KEY = 'alchm-shared-reflections';
const RESONANCE_KEY = 'alchm-community-resonance-votes';

function readReflections(): SharedReflection[] {
  try {
    const raw = getStorageItemWithFallback(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReflections(reflections: SharedReflection[]): void {
  try {
    setStorageItemNormalized(STORAGE_KEY, JSON.stringify(reflections));
  } catch {
    // no-op
  }
}

export function isContentSafeToShare(content: string): { safe: boolean; reason?: string } {
  const trimmed = content.trim();
  if (trimmed.length < 20) return { safe: false, reason: 'Please share at least 20 characters.' };
  if (trimmed.length > 280) return { safe: false, reason: 'Please keep shared moments under 280 characters.' };

  const piiPatterns = [
    /\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/,
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,
    /\b\d{1,5}\s+[A-Za-z0-9.\s]+\s(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr)\b/i,
  ];
  if (piiPatterns.some((pattern) => pattern.test(trimmed))) {
    return { safe: false, reason: 'Please remove personal identifying details before sharing.' };
  }

  const crisisPatterns = /(kill myself|suicide|end my life|want to die|self[-\s]?harm|hurt myself)/i;
  if (crisisPatterns.test(trimmed)) {
    return { safe: false, reason: 'This moment is better held privately. Crisis support is always available at 988.' };
  }

  return { safe: true };
}

export function shareReflection(content: ShareableContent): { ok: boolean; item?: SharedReflection; error?: string } {
  const safety = isContentSafeToShare(content.content);
  if (!safety.safe) {
    return { ok: false, error: safety.reason || 'Content is not safe to share.' };
  }

  const item: SharedReflection = {
    id: `local-${Date.now()}`,
    content: content.content.trim(),
    mood: content.mood || [],
    sharedAt: new Date().toISOString(),
    resonanceCount: 0,
    isAnonymous: true,
  };

  const current = readReflections();
  writeReflections([item, ...current].slice(0, 200));

  return { ok: true, item };
}

export function listSharedReflections(): SharedReflection[] {
  return readReflections().sort((a, b) => new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime());
}

function readVoteIds(): string[] {
  try {
    const raw = getStorageItemWithFallback(RESONANCE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeVoteIds(ids: string[]): void {
  try {
    setStorageItemNormalized(RESONANCE_KEY, JSON.stringify(ids));
  } catch {
    // no-op
  }
}

export function resonateWithReflection(id: string): boolean {
  const voted = new Set(readVoteIds());
  if (voted.has(id)) return false;

  const list = readReflections();
  const next = list.map((item) => (item.id === id ? { ...item, resonanceCount: item.resonanceCount + 1 } : item));
  writeReflections(next);
  voted.add(id);
  writeVoteIds(Array.from(voted));
  return true;
}
