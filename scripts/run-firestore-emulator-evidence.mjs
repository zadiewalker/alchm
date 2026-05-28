import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const firebaseBinary = path.join(repo, 'node_modules', '.bin', 'firebase');
const evidencePath = path.join(repo, 'docs/release/firestore-emulator-evidence.latest.json');
const testCommand = 'node --test src/__tests__/firestoreRulesEmulator.test.mjs';
const javaCandidates = [
  process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin', 'java') : null,
  'java',
  '/usr/local/opt/openjdk@21/bin/java',
  '/opt/homebrew/opt/openjdk@21/bin/java',
  '/usr/local/opt/openjdk/bin/java',
  '/opt/homebrew/opt/openjdk/bin/java',
].filter(Boolean);

const javaBinary = javaCandidates.find(candidate => {
  const result = spawnSync(candidate, ['-version'], { encoding: 'utf8' });
  return result.status === 0;
});

const javaEnv = javaBinary && javaBinary !== 'java'
  ? {
    ...process.env,
    PATH: `${path.dirname(javaBinary)}${path.delimiter}${process.env.PATH ?? ''}`,
  }
  : process.env;

function git(args) {
  return spawnSync('git', args, { cwd: repo, encoding: 'utf8' }).stdout.trim();
}

function sha256File(relativePath) {
  return createHash('sha256')
    .update(fs.readFileSync(path.join(repo, relativePath)))
    .digest('hex');
}

function writeEvidenceArtifact(result, output, startedAt, completedAt) {
  const passMatch = output.match(/# pass (\d+)/);
  const failMatch = output.match(/# fail (\d+)/);
  const testsMatch = output.match(/# tests (\d+)/);
  const head = git(['rev-parse', 'HEAD']);
  const dirty = git(['status', '--porcelain']).length > 0;
  const artifact = {
    schemaVersion: 1,
    status: result.status === 0 && !dirty ? 'CANDIDATE_BOUND_PASS' : 'DIAGNOSTIC_ONLY',
    candidateSha: head,
    worktreeClean: !dirty,
    firestoreRulesDigestSha256: sha256File('firestore.rules'),
    command: `firebase emulators:exec --only firestore --project alchm-firestore-rules-test "${testCommand}"`,
    startedAt,
    completedAt,
    environment: {
      node: process.version,
      javaBinary,
      firebaseBinary,
      platform: process.platform,
      arch: process.arch,
    },
    summary: {
      exitCode: result.status ?? 1,
      tests: testsMatch ? Number(testsMatch[1]) : null,
      pass: passMatch ? Number(passMatch[1]) : null,
      fail: failMatch ? Number(failMatch[1]) : null,
    },
    cases: [
      'unauthenticated access to sensitive user data is denied',
      'session records are owner-readable but client writes are denied',
      'Khepera memory is readable by its owner but writable only through server authority',
      'delayed reflections and container continuity mutations are server-write only',
      'profile access remains owner-only even for crisis-authorized administrators',
      'unsupported support persistence and unmatched collections are denied',
    ],
    certificationNote: dirty
      ? 'Diagnostic emulator pass only. Certification requires this suite to pass from a clean fixed candidate SHA.'
      : 'Candidate-bound emulator pass. Deployment and release-trust checks still require same-SHA production evidence.',
  };
  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(evidencePath, `${JSON.stringify(artifact, null, 2)}\n`);
  return artifact;
}

if (!fs.existsSync(firebaseBinary)) {
  console.error('Firestore emulator authorization evidence is unavailable: local firebase-tools binary not found.');
  console.error('Install repository dependencies, then rerun npm run check:firestore-emulator-evidence.');
  process.exit(1);
} else if (!javaBinary) {
  console.error(`Firebase CLI prerequisite is available: ${firebaseBinary}`);
  console.error('Firestore emulator authorization evidence is unavailable: Java runtime not found.');
  console.error('Install a supported Java runtime, then rerun npm run check:firestore-emulator-evidence.');
  console.error('Until the emulator suite passes for a clean fixed SHA, authorization remains NOT CERTIFIED.');
  process.exit(1);
} else {
  console.log(`Firebase CLI prerequisite is available: ${firebaseBinary}`);
  console.log(`Java runtime prerequisite is available: ${javaBinary}`);
  console.log('Java runtime prerequisite is available; launching Firestore emulator authorization suite.');
  const startedAt = new Date().toISOString();
  const result = spawnSync(
    firebaseBinary,
    ['emulators:exec', '--only', 'firestore', '--project', 'alchm-firestore-rules-test', testCommand],
    { cwd: repo, env: javaEnv, encoding: 'utf8' },
  );
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  const artifact = writeEvidenceArtifact(result, output, startedAt, new Date().toISOString());
  console.log(`Firestore emulator evidence artifact written: ${path.relative(repo, evidencePath)}`);
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  } else if (!artifact.worktreeClean) {
    console.error('Firestore emulator authorization evidence is diagnostic only: checkout is dirty.');
    console.error('Until this suite passes from a clean fixed SHA, authorization remains NOT CERTIFIED.');
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}
