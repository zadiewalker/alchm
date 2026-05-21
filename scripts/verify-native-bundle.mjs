#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { hashDirectory, listFiles, repoRoot } from './release-utils.mjs';

const OUT_DIR = resolve(repoRoot, 'out');
const IOS_PUBLIC_DIR = resolve(repoRoot, 'ios/App/App/public');
const CAPACITOR_ONLY_FILES = new Set([
  'cordova.js',
  'cordova_plugins.js',
]);
const REQUIRED_OUT_FILES = [
  'index.html',
  'manifest.json',
  '_next',
];

function fail(message, details = []) {
  console.error(`Native bundle verification failed: ${message}`);
  for (const detail of details.slice(0, 80)) {
    console.error(`  - ${detail}`);
  }
  if (details.length > 80) {
    console.error(`  - ... ${details.length - 80} additional differences`);
  }
  process.exit(1);
}

if (!existsSync(OUT_DIR)) {
  fail('out/ does not exist. Run npm run build first.');
}

if (!existsSync(IOS_PUBLIC_DIR)) {
  fail('ios/App/App/public does not exist. Run npx cap sync ios first.');
}

for (const required of REQUIRED_OUT_FILES) {
  if (!existsSync(resolve(OUT_DIR, required))) {
    fail(`required generated export entry is missing: out/${required}`);
  }
}

const outFiles = new Map(listFiles(OUT_DIR).map((file) => [file.path, file]));
const iosFiles = new Map(
  listFiles(IOS_PUBLIC_DIR, { ignoreRelativePaths: CAPACITOR_ONLY_FILES }).map((file) => [file.path, file]),
);

const differences = [];
for (const [path, outFile] of outFiles) {
  const iosFile = iosFiles.get(path);
  if (!iosFile) {
    differences.push(`missing from ios/App/App/public: ${path}`);
    continue;
  }
  if (outFile.size !== iosFile.size) {
    differences.push(`size differs: ${path} (out=${outFile.size}, ios=${iosFile.size})`);
  }
}

for (const path of iosFiles.keys()) {
  if (!outFiles.has(path)) {
    differences.push(`unexpected file in ios/App/App/public: ${path}`);
  }
}

if (differences.length === 0) {
  const outHash = hashDirectory(OUT_DIR).aggregateHash;
  const iosHash = hashDirectory(IOS_PUBLIC_DIR, { ignoreRelativePaths: CAPACITOR_ONLY_FILES }).aggregateHash;
  if (outHash !== iosHash) {
    differences.push(`aggregate hash differs: out=${outHash}, ios=${iosHash}`);
  }
}

if (differences.length > 0) {
  fail('out/ and iOS public bundle are not synchronized', differences);
}

console.log('Native bundle verification passed.');
console.log('Allowed Capacitor-only files: cordova.js, cordova_plugins.js');
