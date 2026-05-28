import { detectCrisisSignals } from '@/services/khepera/crisisDetection';

export interface SharedReflection {
  id: string;
  content: string;
  mood: string[];
  sharedAt: string;
  isAnonymous: true;
}

export interface ShareableContent {
  type: 'entry_excerpt' | 'khepera_reflection';
  content: string;
  mood?: string[];
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

  if (detectCrisisSignals(trimmed)) {
    return { safe: false, reason: 'This moment is better held privately. Crisis support is always available at 988.' };
  }

  return { safe: true };
}

export function shareReflection(content: ShareableContent): { ok: boolean; item?: SharedReflection; error?: string } {
  const safety = isContentSafeToShare(content.content);
  if (!safety.safe) {
    return { ok: false, error: safety.reason || 'Content is not safe to share.' };
  }

  return { ok: false, error: 'Community sharing is not available yet.' };
}

export function listSharedReflections(): SharedReflection[] {
  return [];
}

export function resonateWithReflection(_id: string): boolean {
  return false;
}
