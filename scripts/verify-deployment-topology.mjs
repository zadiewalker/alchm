#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { listFiles, repoRoot } from './release-utils.mjs';

const topologyDoc = resolve(repoRoot, 'docs/operations/deployment-topology.md');
const firebaseJsonPath = resolve(repoRoot, 'firebase.json');
const appHostingPath = resolve(repoRoot, 'apphosting.yaml');
const vercelJsonPath = resolve(repoRoot, 'vercel.json');

function fail(message) {
  console.error(`Deployment topology verification failed: ${message}`);
  process.exit(1);
}

if (!existsSync(topologyDoc)) {
  fail('docs/operations/deployment-topology.md is missing');
}

const doc = readFileSync(topologyDoc, 'utf8');
const firebaseJson = JSON.parse(readFileSync(firebaseJsonPath, 'utf8'));
const workflowDir = resolve(repoRoot, '.github/workflows');

if (!doc.includes('Authoritative production web target: Vercel')) {
  fail('topology doc must declare Vercel as the authoritative production web target');
}

if (!doc.includes('Firebase App Hosting `studio` is non-authoritative')) {
  fail('topology doc must explicitly de-scope Firebase App Hosting studio');
}

const hosting = Array.isArray(firebaseJson.hosting) ? firebaseJson.hosting[0] : firebaseJson.hosting;
if (hosting?.public !== 'out') {
  fail('Firebase Hosting must deploy static export from out/');
}

if (existsSync(appHostingPath) && !doc.includes('apphosting.yaml')) {
  fail('apphosting.yaml exists but topology doc does not explain App Hosting authority');
}

if (existsSync(vercelJsonPath) && !doc.includes('Vercel')) {
  fail('vercel.json exists but topology doc does not describe Vercel');
}

const workflowFiles = existsSync(workflowDir)
  ? listFiles(workflowDir).filter((file) => file.path.endsWith('.yml') || file.path.endsWith('.yaml'))
  : [];
const appHostingReferences = workflowFiles
  .map((file) => ({ file: file.path, content: readFileSync(file.absolutePath, 'utf8') }))
  .filter(({ content }) => /apphosting|App Hosting|studio/.test(content));

if (appHostingReferences.length > 0 && !doc.includes('GitHub workflows must not require Firebase App Hosting `studio`')) {
  fail('workflow references Firebase App Hosting/studio but topology doc does not explain whether it is required');
}

const hostingSite = hosting?.site;
if (hostingSite !== 'alchmapp') {
  fail('Firebase Hosting site must remain alchmapp for the documented static compatibility target');
}

if (!Array.isArray(firebaseJson.hosting)) {
  fail('Firebase Hosting must remain an explicit array so additional targets cannot be introduced ambiguously');
}

console.log('Deployment topology verification passed.');
