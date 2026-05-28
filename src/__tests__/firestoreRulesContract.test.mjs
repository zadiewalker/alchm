import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (relativePath) => fs.readFileSync(path.join(repo, relativePath), 'utf8');

test('canonical Firestore paths are nested beneath owner-scoped user documents', () => {
  const canonicalSources = [
    'src/services/journal/submissionPipeline.ts',
    'src/services/journal/processQueuedEntry.ts',
    'src/services/khepera/memory.ts',
    'src/services/khepera/delayedReflectionQueue.ts',
    'src/services/containers/containerService.ts',
    'src/services/settings/settingsService.ts',
  ].map(read).join('\n');

  assert.match(canonicalSources, /'users', userId, 'sessions'/);
  assert.match(canonicalSources, /'users', userId, 'khepera', 'memory'/);
  assert.match(canonicalSources, /'users', userId, 'containers'/);
  assert.match(canonicalSources, /'users', userId, 'containerState', 'active'/);
  assert.doesNotMatch(canonicalSources, /collection\([^)]*'sessions'\s*\)/);
});

test('rules enumerate canonical collections instead of allowing recursive owner writes', () => {
  const rules = read('firestore.rules');

  assert.match(rules, /function isOwner\(userId\)/);
  assert.match(rules, /match \/users\/\{userId\}\/sessions\/\{sessionId\}/);
  assert.match(rules, /match \/users\/\{userId\}\/khepera\/\{documentId\}/);
  assert.match(rules, /match \/users\/\{userId\}\/kheperaDelayedReflections\/\{reflectionId\}/);
  assert.match(rules, /match \/users\/\{userId\}\/containers\/\{containerId\}/);
  assert.match(rules, /match \/users\/\{userId\}\/containerState\/\{stateId\}/);
  assert.doesNotMatch(rules, /match \/users\/\{userId\}\/\{document=\*\*\}/);
});

test('rules constrain sensitive document shapes and preserve owner identity', () => {
  const rules = read('firestore.rules');

  const sessionRule = rules.match(/match \/users\/\{userId\}\/sessions\/\{sessionId\} \{[\s\S]*?\n {4}\}/)?.[0] ?? '';
  const memoryRule = rules.match(/match \/users\/\{userId\}\/khepera\/\{documentId\} \{[\s\S]*?\n {4}\}/)?.[0] ?? '';
  const delayedRule = rules.match(/match \/users\/\{userId\}\/kheperaDelayedReflections\/\{reflectionId\} \{[\s\S]*?\n {4}\}/)?.[0] ?? '';
  const containerRule = rules.match(/match \/users\/\{userId\}\/containers\/\{containerId\} \{[\s\S]*?\n {4}\}/)?.[0] ?? '';
  const containerStateRule = rules.match(/match \/users\/\{userId\}\/containerState\/\{stateId\} \{[\s\S]*?\n {4}\}/)?.[0] ?? '';

  assert.match(sessionRule, /allow create, update: if false/);
  assert.match(memoryRule, /allow create, update: if false/);
  assert.match(delayedRule, /allow create, update: if false/);
  assert.match(containerRule, /allow create, update, delete: if false/);
  assert.match(containerStateRule, /allow create, update, delete: if false/);
  assert.doesNotMatch(
    memoryRule,
    /entryText|rawText|journalText/,
  );
});

test('root user documents cannot be read through administrative crisis permissions', () => {
  const rules = read('firestore.rules');
  const userDocumentRule = rules.match(/match \/users\/\{userId\} \{[\s\S]*?\n {4}\}/)?.[0] ?? '';

  assert.match(userDocumentRule, /allow read, write: if isOwner\(userId\)/);
  assert.doesNotMatch(userDocumentRule, /hasAdminPermission|isAdmin/);
});

test('rules retain a deny-all default outside specifically protected paths', () => {
  const rules = read('firestore.rules');
  assert.match(rules, /match \/\{document=\*\*\} \{\s*allow read, write: if false;/s);
});
