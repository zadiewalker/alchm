'use client';

import { readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';

export function getAnthropicApiKey(): string {
  return readJsonExact<string>(STORAGE_KEYS.anthropicApiKey, '');
}

export function setAnthropicApiKey(value: string): boolean {
  return writeJson(STORAGE_KEYS.anthropicApiKey, value);
}

