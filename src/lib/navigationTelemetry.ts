'use client';

import * as Sentry from '@sentry/nextjs';

const PENDING_KEY = 'alchm_pending_navigation';
const EVENTS_KEY = 'alchm_navigation_events';
const MAX_EVENTS = 50;

export type NavigationPhase = 'attempt' | 'complete' | 'fallback' | 'blocked';

export interface NavigationEvent {
  phase: NavigationPhase;
  source?: string;
  fromPath?: string;
  toPath: string;
  durationMs?: number;
  timestamp: string;
}

interface PendingNavigation {
  id: string;
  source?: string;
  fromPath: string;
  toPath: string;
  startedAt: number;
}

function nowIso() {
  return new Date().toISOString();
}

function addBreadcrumb(event: NavigationEvent) {
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `${event.phase}: ${event.fromPath || 'unknown'} -> ${event.toPath}`,
    level: event.phase === 'fallback' ? 'warning' : 'info',
    data: event,
  });
}

function emitNavigationEvent(event: NavigationEvent) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('alchm:navigation-event', { detail: event }));
}

function readStoredEvents(): NavigationEvent[] {
  try {
    const raw = sessionStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as NavigationEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storeEvent(event: NavigationEvent) {
  try {
    const existing = readStoredEvents();
    const next = [...existing, event].slice(-MAX_EVENTS);
    sessionStorage.setItem(EVENTS_KEY, JSON.stringify(next));
  } catch {
    // Non-fatal
  }
}

export function reportNavigationEvent(event: NavigationEvent) {
  addBreadcrumb(event);
  storeEvent(event);
  emitNavigationEvent(event);
  if (event.phase === 'fallback') {
    Sentry.captureMessage('Navigation fallback triggered', {
      level: 'warning',
      tags: {
        component: 'safe-navigation',
      },
      extra: event as unknown as Record<string, unknown>,
    });
  }
}

export function setPendingNavigation(pending: PendingNavigation) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    // Non-fatal: session storage may be unavailable in private contexts.
  }
}

export function getPendingNavigation(): PendingNavigation | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingNavigation;
  } catch {
    return null;
  }
}

export function clearPendingNavigation() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // Non-fatal
  }
}

export function getRecentNavigationEvents(): NavigationEvent[] {
  if (typeof window === 'undefined') return [];
  return readStoredEvents();
}

export function clearRecentNavigationEvents() {
  try {
    sessionStorage.removeItem(EVENTS_KEY);
  } catch {
    // Non-fatal
  }
}

export function buildAttemptEvent(params: {
  source?: string;
  fromPath: string;
  toPath: string;
}): NavigationEvent {
  return {
    phase: 'attempt',
    source: params.source,
    fromPath: params.fromPath,
    toPath: params.toPath,
    timestamp: nowIso(),
  };
}

export function buildBlockedEvent(params: {
  source?: string;
  fromPath: string;
  toPath: string;
}): NavigationEvent {
  return {
    phase: 'blocked',
    source: params.source,
    fromPath: params.fromPath,
    toPath: params.toPath,
    timestamp: nowIso(),
  };
}

export function buildFallbackEvent(params: {
  source?: string;
  fromPath: string;
  toPath: string;
  durationMs: number;
}): NavigationEvent {
  return {
    phase: 'fallback',
    source: params.source,
    fromPath: params.fromPath,
    toPath: params.toPath,
    durationMs: params.durationMs,
    timestamp: nowIso(),
  };
}

export function buildCompleteEvent(params: {
  source?: string;
  fromPath: string;
  toPath: string;
  durationMs: number;
}): NavigationEvent {
  return {
    phase: 'complete',
    source: params.source,
    fromPath: params.fromPath,
    toPath: params.toPath,
    durationMs: params.durationMs,
    timestamp: nowIso(),
  };
}
