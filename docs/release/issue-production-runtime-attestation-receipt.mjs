#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash, createPrivateKey, createPublicKey, sign } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const expectedCandidateSha = '62d5a383e5404633dc5ab3d04e813b3cdeeedb4f';
const expectedEvidenceTailSha = 'b67dc13759412d5c65c29f94c8a6fefbfd127e6e';
const expectedVerifierId = process.env.ALCHM_RUNTIME_ATTESTATION_VERIFIER_ID
  ?? 'alchm-release-owner-2026-05';
const privateKeyPath = process.env.ALCHM_RUNTIME_ATTESTATION_PRIVATE_KEY_PATH;
const receiptId = process.env.ALCHM_RUNTIME_ATTESTATION_RECEIPT_ID;
const receiptTtlHours = Number(process.env.ALCHM_RUNTIME_ATTESTATION_RECEIPT_TTL_HOURS ?? '24');

const releaseDir = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(releaseDir, '../..');
const evidencePath = path.join(releaseDir, 'runtime-attestation-evidence.json');
const verifierRegistryPath = path.join(releaseDir, 'trusted-runtime-verifiers.json');
const requiredEvidence = [
  'cleanCandidate',
  'releaseScope',
  'firestoreEmulatorAuthorization',
  'functionsDeployment',
  'firestoreRulesDeployment',
  'providerSecretPresence',
  'deploymentAuthority',
  'rollbackAuthority',
];
const deploymentEvidence = [
  'functionsDeployment',
  'firestoreRulesDeployment',
  'providerSecretPresence',
  'deploymentAuthority',
  'rollbackAuthority',
];
const evidenceTailAllowedPaths = [
  'docs/release/',
  'src/__tests__/releaseTrustRemediation.test.mjs',
  'scripts/check-release-trust-evidence.mjs',
  'scripts/check-runtime-attestation-evidence.mjs',
];
const requiredBindings = [
  ['functionsDeployment', '4f7568b4d268d26b06f6d6725982ed3c02fdbd33'],
  ['firestoreRulesDeployment', 'e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6'],
  ['providerSecretPresence', 'ANTHROPIC_API_KEY'],
  ['providerSecretPresence', 'version 1'],
  ['deploymentAuthority', 'dpl_6smNjSnhdYGHNEWAqevVSfVEegYD'],
  ['rollbackAuthority', 'dpl_7Ha2hAsHqqhBtPHa2q6XhGMqySEd'],
];

function fail(message) {
  console.error(`Production runtime attestation signing failed: ${message}`);
  process.exit(1);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function git(args) {
  return execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
}

function isAncestor(ancestorSha, descendantSha) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', ancestorSha, descendantSha], { cwd: repo });
    return true;
  } catch (_error) {
    return false;
  }
}

function isEvidenceTailPath(relativePath) {
  return evidenceTailAllowedPaths.some((allowedPath) => (
    allowedPath.endsWith('/')
      ? relativePath.startsWith(allowedPath)
      : relativePath === allowedPath
  ));
}

function canonicalizeReceiptPayload(payload) {
  return JSON.stringify({
    schemaVersion: payload.schemaVersion,
    receiptId: payload.receiptId,
    verifierId: payload.verifierId,
    candidateSha: payload.candidateSha,
    evidenceDigest: payload.evidenceDigest,
    deploymentEnvironment: payload.deploymentEnvironment,
    functionsDeploymentSha: payload.functionsDeploymentSha,
    firestoreRulesDeploymentSha: payload.firestoreRulesDeploymentSha,
    deploymentEvidenceDigest: payload.deploymentEvidenceDigest,
    providerSecretLineageDigest: payload.providerSecretLineageDigest,
    authorizationScope: payload.authorizationScope,
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt,
  });
}

function calculateEvidenceDigest(attestation) {
  return sha256(JSON.stringify(
    requiredEvidence.map((key) => ({
      key,
      verified: attestation.evidence?.[key]?.verified === true,
      sha: attestation.evidence?.[key]?.sha ?? null,
      reference: attestation.evidence?.[key]?.reference ?? null,
    })),
  ));
}

function calculateDeploymentEvidenceDigest(attestation) {
  return sha256(JSON.stringify(
    deploymentEvidence.map((key) => ({
      key,
      verified: attestation.evidence?.[key]?.verified === true,
      sha: attestation.evidence?.[key]?.sha ?? null,
      reference: attestation.evidence?.[key]?.reference ?? null,
    })),
  ));
}

function calculateProviderSecretLineageDigest(attestation) {
  const providerSecret = attestation.evidence?.providerSecretPresence ?? {};
  return sha256(JSON.stringify({
    key: 'providerSecretPresence',
    verified: providerSecret.verified === true,
    sha: providerSecret.sha ?? null,
    reference: providerSecret.reference ?? null,
  }));
}

if (!privateKeyPath) {
  fail('set ALCHM_RUNTIME_ATTESTATION_PRIVATE_KEY_PATH to an external RSA private key path.');
}
if (!Number.isFinite(receiptTtlHours) || receiptTtlHours <= 0 || receiptTtlHours > 168) {
  fail('ALCHM_RUNTIME_ATTESTATION_RECEIPT_TTL_HOURS must be greater than 0 and no more than 168.');
}

const repoRealPath = fs.realpathSync(repo);
let privateKeyRealPath;
try {
  privateKeyRealPath = fs.realpathSync(privateKeyPath);
} catch (_error) {
  fail('private key path is not readable.');
}
if (privateKeyRealPath === repoRealPath || privateKeyRealPath.startsWith(`${repoRealPath}${path.sep}`)) {
  fail('private key path is inside the repository; production verifier keys must remain external.');
}

const head = git(['rev-parse', 'HEAD']);
if (!isAncestor(expectedCandidateSha, head)) {
  fail('expected product candidate is not an ancestor of the evidence-tail checkout.');
}
if (!isAncestor(expectedEvidenceTailSha, head)) {
  fail(`expected evidence-tail ${expectedEvidenceTailSha} is not an ancestor of current HEAD ${head}.`);
}
const worktreeStatus = git(['status', '--porcelain']);
if (worktreeStatus !== '') {
  fail('worktree must be clean before issuing a production receipt.');
}
const disallowedPostEvidenceTailPaths = git(['diff', '--name-only', `${expectedEvidenceTailSha}..${head}`])
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((relativePath) => !isEvidenceTailPath(relativePath));
if (disallowedPostEvidenceTailPaths.length > 0) {
  fail(`post-evidence-tail commits contain non-evidence paths: ${disallowedPostEvidenceTailPaths.join(', ')}.`);
}
const disallowedTailPaths = git(['diff', '--name-only', `${expectedCandidateSha}..${head}`])
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((relativePath) => !isEvidenceTailPath(relativePath));
if (disallowedTailPaths.length > 0) {
  fail(`evidence-tail contains non-evidence paths: ${disallowedTailPaths.join(', ')}.`);
}

const attestation = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const verifierRegistry = JSON.parse(fs.readFileSync(verifierRegistryPath, 'utf8'));
if (attestation.candidateSha !== expectedCandidateSha) {
  fail(`runtime evidence candidate mismatch: ${attestation.candidateSha ?? 'missing'}.`);
}
if (attestation.deploymentEnvironment !== 'production') {
  fail('runtime evidence must target production.');
}
if (attestation.receipt !== null) {
  fail('runtime evidence already contains a receipt; rotate through an explicit new evidence pass.');
}
const incompleteEvidence = requiredEvidence.filter((key) => {
  const item = attestation.evidence?.[key];
  return item?.verified !== true
    || item.sha !== expectedCandidateSha
    || typeof item.reference !== 'string'
    || item.reference.trim().length === 0;
});
if (incompleteEvidence.length > 0) {
  fail(`candidate-bound evidence remains incomplete: ${incompleteEvidence.join(', ')}.`);
}
for (const [evidenceKey, requiredText] of requiredBindings) {
  const reference = attestation.evidence?.[evidenceKey]?.reference ?? '';
  if (!reference.includes(requiredText)) {
    fail(`${evidenceKey} evidence does not include required binding ${requiredText}.`);
  }
}

const verifier = verifierRegistry.approvedVerifiers?.find((candidate) => (
  candidate.verifierId === expectedVerifierId && candidate.status === 'approved'
));
if (!verifier) {
  fail(`approved verifier not found: ${expectedVerifierId}.`);
}
const privateKey = createPrivateKey(fs.readFileSync(privateKeyRealPath));
const publicKeyPem = createPublicKey(privateKey).export({ type: 'spki', format: 'pem' });
const publicKeyFingerprint = sha256(publicKeyPem.trim());
if (publicKeyFingerprint !== verifier.publicKeyFingerprintSha256) {
  fail('external private key does not match the approved verifier public key fingerprint.');
}
if (verifier.receiptAlgorithm !== 'RSA-SHA256') {
  fail('approved verifier metadata does not authorize RSA-SHA256 receipts.');
}

const issuedAt = new Date();
const expiresAt = new Date(issuedAt.getTime() + receiptTtlHours * 60 * 60 * 1000);
const normalizedReceiptId = receiptId
  ?? `prod-${expectedCandidateSha.slice(0, 12)}-${issuedAt.toISOString().replace(/[:.]/g, '-')}`;
const payload = {
  schemaVersion: 1,
  receiptId: normalizedReceiptId,
  verifierId: verifier.verifierId,
  candidateSha: expectedCandidateSha,
  evidenceDigest: calculateEvidenceDigest(attestation),
  deploymentEnvironment: attestation.deploymentEnvironment,
  functionsDeploymentSha: attestation.evidence.functionsDeployment.sha,
  firestoreRulesDeploymentSha: attestation.evidence.firestoreRulesDeployment.sha,
  deploymentEvidenceDigest: calculateDeploymentEvidenceDigest(attestation),
  providerSecretLineageDigest: calculateProviderSecretLineageDigest(attestation),
  authorizationScope: 'continuity-transitions',
  issuedAt: issuedAt.toISOString(),
  expiresAt: expiresAt.toISOString(),
};
const signatureBase64 = sign(
  'RSA-SHA256',
  Buffer.from(canonicalizeReceiptPayload(payload), 'utf8'),
  privateKey,
).toString('base64');

const signedAttestation = {
  ...attestation,
  attestationStatus: 'ATTESTED',
  runtimeEnablementAuthorized: true,
  verifiedAt: payload.issuedAt,
  verificationAuthority: {
    status: 'verified',
    verifierId: verifier.verifierId,
    reference: [
      `External RSA verifier ${verifier.verifierId} signed receipt ${payload.receiptId}.`,
      `Evidence-tail ${expectedEvidenceTailSha}.`,
      'Private key path remained outside the repository and was not recorded.',
    ].join(' '),
  },
  receipt: {
    algorithm: 'RSA-SHA256',
    payload,
    signatureBase64,
  },
};

fs.writeFileSync(evidencePath, `${JSON.stringify(signedAttestation, null, 2)}\n`);
console.log(`Issued production runtime attestation receipt ${payload.receiptId}.`);
console.log(`Verifier: ${verifier.verifierId}`);
console.log(`Candidate: ${expectedCandidateSha}`);
console.log(`Evidence tail: ${expectedEvidenceTailSha}`);
console.log('Private key material was not printed or written to the repository.');
