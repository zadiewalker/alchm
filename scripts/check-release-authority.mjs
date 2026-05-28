import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checklist = JSON.parse(
  fs.readFileSync(path.join(repo, 'docs/release/release-certification-checklist.json'), 'utf8'),
);
const blockers = [];
const notes = [];
const decisionRecords = [
  {
    path: 'docs/release/DEPLOYMENT_AUTHORITY_DECISION.md',
    label: 'deployment authority decision',
  },
  {
    path: 'docs/release/NATIVE_AUTHORITY_DECISION.md',
    label: 'native authority decision',
  },
  {
    path: 'docs/release/FUNCTIONS_LINT_CLASSIFICATION.md',
    label: 'Functions lint classification',
  },
];

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(repo, relativePath));
}

const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim();
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: repo, encoding: 'utf8' }).trim();
const worktreeDirty = execFileSync('git', ['status', '--porcelain'], { cwd: repo, encoding: 'utf8' }).trim() !== '';
const conflictingPaths = [
  'functions/functions',
  'ios/App 2',
  'alchm-clean',
  'emergency-backups',
  'artifacts',
  '.github/workflows 2',
  '.github/workflows 3',
].filter(exists);
const generatedPaths = [
  '.next',
  'out',
  'functions/lib/functions',
  'functions/lib/src',
  'ios/App/.next',
  'ios/App/out',
].filter(exists);

decisionRecords.forEach((record) => {
  if (!exists(record.path)) {
    blockers.push(`${record.label} record is missing: ${record.path}`);
  } else if (/UNRESOLVED - HUMAN DECISION REQUIRED/.test(read(record.path))) {
    notes.push(`${record.label}: unresolved - human decision required`);
  }
});

if (worktreeDirty) {
  blockers.push('authoritative checkout is dirty');
}
if (conflictingPaths.length > 0) {
  blockers.push(`authority-conflicting paths are present: ${conflictingPaths.join(', ')}`);
}
if (generatedPaths.length > 0) {
  notes.push(`generated paths present but not treated as authority: ${generatedPaths.join(', ')}`);
}

const capacitorSource = read('capacitor.config.ts');
const nativeConfig = JSON.parse(read('ios/App/App/capacitor.config.json'));
const sourceAppId = capacitorSource.match(/appId:\s*'([^']+)'/)?.[1];
if (!sourceAppId || sourceAppId !== nativeConfig.appId) {
  blockers.push(
    `native app identity drift: capacitor.config.ts=${sourceAppId ?? 'unparsed'}, ios/App/App/capacitor.config.json=${nativeConfig.appId ?? 'missing'}`,
  );
}

const firebaseConfig = read('firebase.json');
const serverDeployment = read('SERVER_DEPLOYMENT.md');
const nextConfig = read('next.config.js');
const hasFirebaseToVercelRedirect = /https:\/\/alchm\.vercel\.app/.test(firebaseConfig);
const documentsServerMode = /server\/API mode/i.test(serverDeployment);
const buildsStaticExport = /output:\s*['"]export['"]/.test(nextConfig);
if (hasFirebaseToVercelRedirect && documentsServerMode && buildsStaticExport) {
  blockers.push('runtime authority is unresolved across Firebase redirects, Vercel server-mode guidance, and static Next export');
}

if (checklist.requiredEvidence?.deploymentAuthorityResolved !== true) {
  blockers.push('deployment authority has no approved evidence');
}
if (checklist.requiredEvidence?.nativeConfigReconciled !== true) {
  blockers.push('native configuration reconciliation has no approved evidence');
}

console.log(`Release authority status: ${blockers.length === 0 ? 'READY FOR CANDIDATE VALIDATION' : 'NOT NORMALIZED'}`);
console.log(`Branch: ${branch || '(detached)'}`);
console.log(`HEAD: ${head}`);
notes.forEach((note) => console.log(`Informational: ${note}`));

if (blockers.length > 0) {
  blockers.forEach((blocker) => console.error(`Blocker: ${blocker}`));
  process.exitCode = 1;
}
