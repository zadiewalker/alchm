'use client';

import { readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';

export function isOnboarded(): boolean {
  return readJsonExact<boolean>(STORAGE_KEYS.onboardingComplete, false);
}

export function setOnboarded(): boolean {
  return writeJson(STORAGE_KEYS.onboardingComplete, true);
}

