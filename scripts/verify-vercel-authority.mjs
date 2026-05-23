#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { repoRoot } from './release-utils.mjs';

const AUTHORITATIVE_PROJECT_NAME = 'alchm';
const AUTHORITATIVE_PRODUCTION_URL = 'https://alchm.vercel.app';
const NON_AUTHORITATIVE_PROJECT_ID = 'prj_cUOhhje06ECGLjnMhn7zw6KBw9hP';
const NON_AUTHORITATIVE_PROJECT_NAME = 'alchm-authoritative';

const topologyDocPath = resolve(repoRoot, 'docs/operations/deployment-topology.md');
const certificationDocPath = resolve(repoRoot, 'docs/operations/production-certification.md');
const vercelProjectPath = resolve(repoRoot, '.vercel/project.json');
const vercelJsonPath = resolve(repoRoot, 'vercel.json');
const firebaseJsonPath = resolve(repoRoot, 'firebase.json');
const capacitorConfigPath = resolve(repoRoot, 'capacitor.config.ts');
const operationalWorkflowPath = resolve(repoRoot, '.github/workflows/operational-certification.yml');
const gitignorePath = resolve(repoRoot, '.gitignore');

function fail(message) {
  console.error(`Vercel authority verification failed: ${message}`);
  process.exit(1);
}

function readRequired(path, label) {
  if (!existsSync(path)) {
    fail(`${label} is missing`);
  }

  return readFileSync(path, 'utf8');
}

function requireIncludes(content, needle, label) {
  if (!content.includes(needle)) {
    fail(`${label} must include ${JSON.stringify(needle)}`);
  }
}

const topologyDoc = readRequired(topologyDocPath, 'deployment topology doc');
const certificationDoc = readRequired(certificationDocPath, 'production certification doc');
const vercelJson = JSON.parse(readRequired(vercelJsonPath, 'vercel.json'));
const firebaseJson = readRequired(firebaseJsonPath, 'firebase.json');
const capacitorConfig = readRequired(capacitorConfigPath, 'capacitor.config.ts');
const operationalWorkflow = readRequired(operationalWorkflowPath, 'operational certification workflow');
const gitignore = readRequired(gitignorePath, '.gitignore');

requireIncludes(topologyDoc, `Vercel project \`${AUTHORITATIVE_PROJECT_NAME}\``, 'deployment topology doc');
requireIncludes(topologyDoc, AUTHORITATIVE_PRODUCTION_URL, 'deployment topology doc');
requireIncludes(certificationDoc, `Vercel project \`${AUTHORITATIVE_PROJECT_NAME}\``, 'production certification doc');
requireIncludes(certificationDoc, NON_AUTHORITATIVE_PROJECT_NAME, 'production certification doc');
requireIncludes(firebaseJson, AUTHORITATIVE_PRODUCTION_URL, 'firebase.json');
requireIncludes(capacitorConfig, 'alchm.vercel.app', 'capacitor.config.ts');
requireIncludes(operationalWorkflow, 'npm run certify:release', 'operational certification workflow');

if (!gitignore.split(/\r?\n/).some((line) => line.trim() === '.vercel')) {
  fail('.vercel must remain ignored so local project links cannot become release evidence');
}

if (vercelJson.framework !== 'nextjs') {
  fail('vercel.json must keep framework set to nextjs');
}

if (existsSync(vercelProjectPath)) {
  const projectConfig = JSON.parse(readFileSync(vercelProjectPath, 'utf8'));
  const expectedProjectId = process.env.ALCHM_VERCEL_PROJECT_ID;

  if (projectConfig.projectId === NON_AUTHORITATIVE_PROJECT_ID) {
    fail(`local .vercel/project.json points to ${NON_AUTHORITATIVE_PROJECT_NAME}; remove .vercel or relink to ${AUTHORITATIVE_PROJECT_NAME}`);
  }

  if (!expectedProjectId) {
    fail('local .vercel/project.json exists but ALCHM_VERCEL_PROJECT_ID is unset; use explicit `vercel ls alchm --yes` for evidence or set the production project id in CI');
  }

  if (projectConfig.projectId !== expectedProjectId) {
    fail('local .vercel/project.json does not match ALCHM_VERCEL_PROJECT_ID');
  }
}

console.log(`Vercel authority verification passed for project ${AUTHORITATIVE_PROJECT_NAME}.`);
