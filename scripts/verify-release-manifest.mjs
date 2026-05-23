#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hashDirectory, isGitDirty, repoRoot, runGit } from './release-utils.mjs';

const manifestPath = resolve(repoRoot, process.argv[2] || 'release-artifacts/release-manifest.json');
const allowDirty = process.env.ALLOW_DIRTY_RELEASE_MANIFEST === 'true';
const capacitorOnlyFiles = new Set(['cordova.js', 'cordova_plugins.js']);

function fail(message) {
  console.error(`Release manifest verification failed: ${message}`);
  process.exit(1);
}

if (!existsSync(manifestPath)) {
  fail(`manifest missing: ${manifestPath}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const requiredPaths = [
  ['schemaVersion'],
  ['generatedAt'],
  ['git', 'commit'],
  ['git', 'branch'],
  ['runtime', 'node'],
  ['runtime', 'npm'],
  ['runtime', 'packageManager'],
  ['inputs', 'lockfile', 'sha256'],
  ['inputs', 'packageJson', 'sha256'],
  ['inputs', 'nextConfig', 'sha256'],
  ['inputs', 'capacitorConfig', 'sha256'],
  ['inputs', 'firebaseConfig', 'sha256'],
  ['artifacts', 'out', 'aggregateHash'],
  ['artifacts', 'iosPublic', 'aggregateHash'],
  ['native', 'xcodeWorkspace'],
  ['native', 'capacitorIosPublicDir'],
];

for (const path of requiredPaths) {
  let cursor = manifest;
  for (const key of path) {
    cursor = cursor?.[key];
  }
  if (!cursor) {
    fail(`required manifest field missing: ${path.join('.')}`);
  }
}

if (isGitDirty() && !allowDirty) {
  const status = runGit(['status', '--short'], '').trim();
  fail(`working tree is dirty:\n${status}\nSet ALLOW_DIRTY_RELEASE_MANIFEST=true only for non-release diagnostics.`);
}

const outHash = hashDirectory(resolve(repoRoot, 'out')).aggregateHash;
const iosHash = hashDirectory(resolve(repoRoot, 'ios/App/App/public'), {
  ignoreRelativePaths: capacitorOnlyFiles,
}).aggregateHash;

if (manifest.artifacts.out.aggregateHash !== outHash) {
  fail(`out/ hash changed since manifest generation: manifest=${manifest.artifacts.out.aggregateHash}, current=${outHash}`);
}

if (manifest.artifacts.iosPublic.aggregateHash !== iosHash) {
  fail(`iOS public hash changed since manifest generation: manifest=${manifest.artifacts.iosPublic.aggregateHash}, current=${iosHash}`);
}

if (outHash !== iosHash) {
  fail(`out/ and iOS public hashes differ: out=${outHash}, ios=${iosHash}`);
}

console.log('Release manifest verification passed.');
