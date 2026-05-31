import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash, verify as verifySignature } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidencePath = path.join(repo, 'docs/release/runtime-attestation-evidence.json');
const verifierRegistryPath = path.join(repo, 'docs/release/trusted-runtime-verifiers.json');
const fullShaPattern = /^[0-9a-f]{40}$/;
const digestPattern = /^[0-9a-f]{64}$/;
const conflictingPaths = [
  'functions/functions',
  'ios/App 2',
  'alchm-clean',
  'emergency-backups',
  'artifacts',
  '.github/workflows 2',
  '.github/workflows 3',
];
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
  'scripts/check-release-trust-evidence.mjs',
  'scripts/check-runtime-attestation-evidence.mjs',
];

function fail(message) {
  console.error(`Runtime attestation evidence check failed: ${message}`);
  process.exitCode = 1;
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

function calculateVerifierPublicKeyFingerprint(publicKeyPem) {
  return createHash('sha256').update(publicKeyPem.trim()).digest('hex');
}

function calculateEvidenceDigest(attestation) {
  return createHash('sha256').update(JSON.stringify(
    requiredEvidence.map((key) => ({
      key,
      verified: attestation.evidence?.[key]?.verified === true,
      sha: attestation.evidence?.[key]?.sha ?? null,
      reference: attestation.evidence?.[key]?.reference ?? null,
    })),
  )).digest('hex');
}

function calculateDeploymentEvidenceDigest(attestation) {
  return createHash('sha256').update(JSON.stringify(
    deploymentEvidence.map((key) => ({
      key,
      verified: attestation.evidence?.[key]?.verified === true,
      sha: attestation.evidence?.[key]?.sha ?? null,
      reference: attestation.evidence?.[key]?.reference ?? null,
    })),
  )).digest('hex');
}

function calculateProviderSecretLineageDigest(attestation) {
  const providerSecret = attestation.evidence?.providerSecretPresence ?? {};
  return createHash('sha256').update(JSON.stringify({
    key: 'providerSecretPresence',
    verified: providerSecret.verified === true,
    sha: providerSecret.sha ?? null,
    reference: providerSecret.reference ?? null,
  })).digest('hex');
}

function validateVerifierRegistry(verifierRegistry, nowMs) {
  if (!Array.isArray(verifierRegistry.approvedVerifiers) || verifierRegistry.approvedVerifiers.length === 0) {
    fail('no approved runtime verifier is registered.');
    return [];
  }

  const seen = new Set();
  const seenFingerprints = new Set();
  const approved = [];
  for (const verifier of verifierRegistry.approvedVerifiers) {
    if (seen.has(verifier.verifierId)) {
      fail(`duplicate runtime verifier ID is registered: ${verifier.verifierId}.`);
      continue;
    }
    seen.add(verifier.verifierId);
    if (seenFingerprints.has(verifier.publicKeyFingerprintSha256)) {
      fail(`duplicate runtime verifier fingerprint is registered: ${verifier.publicKeyFingerprintSha256}.`);
      continue;
    }
    seenFingerprints.add(verifier.publicKeyFingerprintSha256);
    if (verifier.status !== 'approved') {
      continue;
    }
    if (verifier.authorityScope !== 'runtime-continuity-attestation') {
      fail(`runtime verifier authority scope is invalid: ${verifier.verifierId}.`);
      continue;
    }
    if (
      verifier.approvedBy === verifier.verifierId
      || verifier.approvedBy === verifier.keyId
      || verifier.trustRootReference === verifier.verifierId
      || verifier.lineageReference === verifier.verifierId
    ) {
      fail(`runtime verifier cannot self-attest trust: ${verifier.verifierId}.`);
      continue;
    }
    if (
      typeof verifier.publicKeyPem !== 'string'
      || verifier.publicKeyPem.trim().length === 0
      || typeof verifier.keyId !== 'string'
      || verifier.keyId.trim().length === 0
      || typeof verifier.approvedBy !== 'string'
      || verifier.approvedBy.trim().length === 0
      || typeof verifier.expiresAt !== 'string'
      || verifier.expiresAt.trim().length === 0
      || typeof verifier.trustRootReference !== 'string'
      || verifier.trustRootReference.trim().length === 0
      || typeof verifier.lineageReference !== 'string'
      || verifier.lineageReference.trim().length === 0
      || typeof verifier.operator?.name !== 'string'
      || verifier.operator.name.trim().length === 0
      || typeof verifier.operator?.contact !== 'string'
      || verifier.operator.contact.trim().length === 0
    ) {
      fail(`runtime verifier trust record is incomplete: ${verifier.verifierId}.`);
      continue;
    }
    if (
      !digestPattern.test(verifier.publicKeyFingerprintSha256 ?? '')
      || verifier.publicKeyFingerprintSha256 !== calculateVerifierPublicKeyFingerprint(verifier.publicKeyPem)
    ) {
      fail(`runtime verifier public key fingerprint does not match: ${verifier.verifierId}.`);
      continue;
    }
    const approvedAt = Date.parse(verifier.approvedAt);
    if (!Number.isFinite(approvedAt) || approvedAt > nowMs) {
      fail(`runtime verifier approval timestamp is invalid: ${verifier.verifierId}.`);
      continue;
    }
    const expiresAt = Date.parse(verifier.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= nowMs) {
      fail(`runtime verifier trust has expired: ${verifier.verifierId}.`);
      continue;
    }
    if (verifier.revokedAt) {
      const revokedAt = Date.parse(verifier.revokedAt);
      if (!Number.isFinite(revokedAt) || revokedAt <= nowMs) {
        fail(`runtime verifier trust has been revoked: ${verifier.verifierId}.`);
        continue;
      }
    }
    approved.push(verifier);
  }
  return approved;
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

function validateEvidenceTail(candidateSha, head) {
  if (!fullShaPattern.test(candidateSha ?? '')) {
    return {
      accepted: false,
      reason: 'candidate SHA is absent or malformed.',
    };
  }
  if (candidateSha === head) {
    return {
      accepted: true,
      mode: 'direct-head',
      changedPaths: [],
    };
  }
  if (!isAncestor(candidateSha, head)) {
    return {
      accepted: false,
      reason: 'candidate SHA is not current HEAD and is not an ancestor of HEAD.',
    };
  }
  const changedPaths = git(['diff', '--name-only', `${candidateSha}..${head}`])
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const disallowedPaths = changedPaths.filter((relativePath) => !isEvidenceTailPath(relativePath));
  if (disallowedPaths.length > 0) {
    return {
      accepted: false,
      reason: `post-candidate commits include non-evidence paths: ${disallowedPaths.join(', ')}.`,
      changedPaths,
    };
  }
  return {
    accepted: true,
    mode: 'evidence-tail',
    changedPaths,
  };
}

function verifyReceipt(attestation, verifierRegistry, candidateSha) {
  const receipt = attestation.receipt;
  if (!receipt || typeof receipt !== 'object' || !receipt.payload) {
    fail('a signed runtime attestation receipt is absent.');
    return;
  }
  const payload = receipt.payload;
  const approvedVerifier = verifierRegistry.approvedVerifiers?.find(
    (verifier) => verifier.verifierId === payload.verifierId && verifier.status === 'approved',
  );
  if (!approvedVerifier || typeof approvedVerifier.publicKeyPem !== 'string') {
    fail('the receipt issuer is not an approved runtime verifier.');
    return;
  }
  const expectedEvidenceDigest = calculateEvidenceDigest(attestation);
  if (
    receipt.algorithm !== 'RSA-SHA256'
    || payload.schemaVersion !== 1
    || payload.authorizationScope !== 'continuity-transitions'
    || payload.candidateSha !== candidateSha
    || !digestPattern.test(payload.evidenceDigest ?? '')
    || payload.evidenceDigest !== expectedEvidenceDigest
    || payload.deploymentEnvironment !== attestation.deploymentEnvironment
    || payload.functionsDeploymentSha !== attestation.evidence?.functionsDeployment?.sha
    || payload.firestoreRulesDeploymentSha !== attestation.evidence?.firestoreRulesDeployment?.sha
    || payload.deploymentEvidenceDigest !== calculateDeploymentEvidenceDigest(attestation)
    || payload.providerSecretLineageDigest !== calculateProviderSecretLineageDigest(attestation)
  ) {
    fail('the signed receipt is not bound to this candidate evidence set.');
    return;
  }
  const issuedAt = Date.parse(payload.issuedAt);
  const expiresAt = Date.parse(payload.expiresAt);
  const verifiedAt = Date.parse(attestation.verifiedAt);
  if (
    !Number.isFinite(issuedAt)
    || !Number.isFinite(expiresAt)
    || !Number.isFinite(verifiedAt)
    || issuedAt > verifiedAt
    || expiresAt <= verifiedAt
  ) {
    fail('the signed receipt validity window is not acceptable.');
    return;
  }
  if (attestation.consumedReceiptIds?.includes(payload.receiptId)) {
    fail('the signed receipt has already been consumed.');
    return;
  }
  try {
    if (!verifySignature(
      'RSA-SHA256',
      Buffer.from(canonicalizeReceiptPayload(payload), 'utf8'),
      approvedVerifier.publicKeyPem,
      Buffer.from(receipt.signatureBase64, 'base64'),
    )) {
      fail('the signed runtime attestation receipt signature is invalid.');
    }
  } catch (_error) {
    fail('the signed runtime attestation receipt cannot be verified.');
  }
}

if (!fs.existsSync(evidencePath) || !fs.existsSync(verifierRegistryPath)) {
  fail('runtime attestation evidence register or trusted verifier registry is missing.');
} else {
  const attestation = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  const verifierRegistry = JSON.parse(fs.readFileSync(verifierRegistryPath, 'utf8'));
  const head = git(['rev-parse', 'HEAD']);
  const worktreeDirty = git(['status', '--porcelain']) !== '';
  const presentConflicts = conflictingPaths.filter((relativePath) => fs.existsSync(path.join(repo, relativePath)));
  const candidateSha = attestation.candidateSha;
  const evidenceTail = validateEvidenceTail(candidateSha, head);
  const missingEvidence = requiredEvidence.filter((key) => {
    const item = attestation.evidence?.[key];
    return item?.verified !== true
      || item.sha !== candidateSha
      || typeof item.reference !== 'string'
      || item.reference.trim().length === 0;
  });

  console.log(`Runtime attestation status: ${attestation.attestationStatus ?? 'INVALID'}`);
  console.log(`Current HEAD: ${head}`);
  console.log(`Attested candidate: ${candidateSha ?? 'ABSENT'}`);
  console.log(`Candidate binding mode: ${evidenceTail.accepted ? evidenceTail.mode : 'INVALID'}`);
  console.log(`Worktree: ${worktreeDirty ? 'dirty' : 'clean'}`);
  console.log(`Evidence incomplete: ${missingEvidence.join(', ') || 'none'}`);
  const approvedVerifiers = validateVerifierRegistry(verifierRegistry, Date.now());

  if (attestation.attestationStatus !== 'ATTESTED') {
    fail('runtime continuity has no accepted attestation record.');
  }
  if (attestation.runtimeEnablementAuthorized !== true) {
    fail('runtime continuity enablement is not authorized.');
  }
  if (!evidenceTail.accepted) {
    fail(evidenceTail.reason ?? 'candidate SHA is absent or does not match the inspected HEAD.');
  }
  if (worktreeDirty) {
    fail('candidate checkout is dirty.');
  }
  if (presentConflicts.length > 0) {
    fail(`authority-conflicting paths are present: ${presentConflicts.join(', ')}.`);
  }
  if (attestation.verificationAuthority?.status !== 'verified'
    || typeof attestation.verificationAuthority?.reference !== 'string'
    || attestation.verificationAuthority.reference.trim().length === 0) {
    fail('verification authority is absent or unverifiable.');
  }
  if (missingEvidence.length > 0) {
    fail(`candidate-bound evidence remains incomplete: ${missingEvidence.join(', ')}.`);
  }
  if (approvedVerifiers.length > 0) {
    verifyReceipt({ ...attestation }, { approvedVerifiers }, candidateSha);
  } else {
    verifyReceipt(attestation, { approvedVerifiers: [] }, candidateSha);
  }
}
