import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('return threshold lookup is authenticated and user scoped before entry access', () => {
  const source = read('services/returns/getReturnThresholdData.ts');

  assert.match(source, /userId: string \| null \| undefined/);
  assert.match(source, /if \(!options\.userId\)/);
  assert.match(source, /dataService\.setUserId\(userId\);/);
  assert.match(source, /dataService\.getJournalEntryById\(entryId\)/);
  assert.match(source, /entry\.userId !== userId/);
  assert.doesNotMatch(source, /getJournalEntries\(/);
});

test('return threshold hook fails closed without authenticated user scope', () => {
  const source = read('hooks/useReturnThresholdData.ts');

  assert.match(source, /useAuth\(\)/);
  assert.match(source, /auth\.isLoading/);
  assert.match(source, /if \(!auth\.user\?\.uid\)/);
  assert.match(source, /getReturnThresholdData\(resolvedEntryId, \{ userId \}\)/);
});

test('journal new page preserves valid return params as JournalFlow return context', () => {
  const source = read('app/journal/new/page.tsx');

  assert.match(source, /useSearchParams\(\)/);
  assert.match(source, /entryId: searchParams\?\.get\('returnTo'\)/);
  assert.match(source, /returnType: searchParams\?\.get\('returnType'\)/);
  assert.match(source, /resurfacingTone: searchParams\?\.get\('resurfacingTone'\)/);
  assert.match(source, /useReturnThresholdData\(parsed\.entryId\)/);
  assert.match(source, /excerpt: returnEntry\.data\?\.excerpt \?\? null/);
  assert.match(source, /returnType: parsed\.returnType/);
  assert.match(source, /<JournalFlow returnContext=\{returnContext\} \/>/);
});

test('journal new page falls back to generic entry when return params are absent', () => {
  const source = read('app/journal/new/page.tsx');

  assert.match(source, /if \(!parsed\.entryId\) \{\s*return null;\s*\}/);
});
