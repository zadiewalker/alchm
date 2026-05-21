#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { repoRoot } from './release-utils.mjs';

const manifestPath = resolve(repoRoot, 'public/manifest.json');
const publicDir = resolve(repoRoot, 'public');

function fail(message, details = []) {
  console.error(`Manifest asset verification failed: ${message}`);
  for (const detail of details) {
    console.error(`  - ${detail}`);
  }
  process.exit(1);
}

if (!existsSync(manifestPath)) {
  fail('public/manifest.json is missing');
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const refs = [];

for (const icon of manifest.icons ?? []) {
  if (icon.src) refs.push(icon.src);
}

for (const screenshot of manifest.screenshots ?? []) {
  if (screenshot.src) refs.push(screenshot.src);
}

const missing = refs
  .map((ref) => ref.split('?')[0].replace(/^\//, ''))
  .filter((ref) => !existsSync(resolve(publicDir, ref)));

if (missing.length > 0) {
  fail('manifest references missing public assets', missing);
}

console.log(`Manifest asset verification passed (${refs.length} references).`);
