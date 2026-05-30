import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checklistPath = path.join(repo, 'docs/release/release-certification-checklist.json');
const blockersPath = path.join(repo, 'docs/release/RELEASE_BLOCKERS.md');
const runtimeAttestationPath = path.join(repo, 'docs/release/runtime-attestation-evidence.json');
const runtimeVerifierRegistryPath = path.join(repo, 'docs/release/trusted-runtime-verifiers.json');
const trustedVerifierAuthorityPath = path.join(repo, 'docs/release/TRUSTED_VERIFIER_AUTHORITY_MODEL.md');
const deploymentBoundAttestationPath = path.join(repo, 'docs/release/DEPLOYMENT_BOUND_ATTESTATION_MODEL.md');
const requireCertified = process.argv.includes('--require-certified');
const requiredEvidenceKeys = [
  'candidateShaFixed',
  'cleanWorktree',
  'releaseScopeNormalized',
  'deploymentAuthorityResolved',
  'nativeConfigReconciled',
  'trustCriticalFunctionsLint',
  'repositoryValidationSameSha',
  'githubChecksSameSha',
  'functionsDeploymentSameSha',
  'firestoreRulesDeploymentSameSha',
  'providerSecretsConfigured',
  'firestoreEmulatorAuthorization',
  'serverAuthoritativeSensitiveWrites',
  'runtimeContinuityAttestation',
  'deploymentLineageSameSha',
  'continuityExportDeletionVerified',
  'privacyClaimsMatchDeployment',
  'supportSurfaceApproved',
  'transparencySurfaceApproved',
  'iosArchiveSameSha',
  'rollbackAuthorityDocumented',
];
const allowedCertificationStatuses = [
  'NOT CERTIFIED',
  'LOCALLY VALIDATED',
  'ATTESTED RELEASE CANDIDATE, NOT CERTIFIED',
  'RELEASE-CANDIDATE CERTIFIED',
  'PRODUCTION CERTIFIED',
];
const completeEvidenceRequiredStatuses = new Set([
  'RELEASE-CANDIDATE CERTIFIED',
  'PRODUCTION CERTIFIED',
]);

function fail(message) {
  console.error(`Release trust evidence check failed: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(checklistPath) || !fs.existsSync(blockersPath) || !fs.existsSync(runtimeAttestationPath)
  || !fs.existsSync(runtimeVerifierRegistryPath) || !fs.existsSync(trustedVerifierAuthorityPath)
  || !fs.existsSync(deploymentBoundAttestationPath)) {
  fail('release certification checklist or blocker register is missing.');
} else {
  const checklist = JSON.parse(fs.readFileSync(checklistPath, 'utf8'));
  const runtimeAttestation = JSON.parse(fs.readFileSync(runtimeAttestationPath, 'utf8'));
  const runtimeVerifierRegistry = JSON.parse(fs.readFileSync(runtimeVerifierRegistryPath, 'utf8'));
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim();
  const worktreeDirty = execFileSync('git', ['status', '--porcelain'], { cwd: repo, encoding: 'utf8' }).trim() !== '';
  const missingEvidence = requiredEvidenceKeys.filter((key) => checklist.requiredEvidence?.[key] !== true);

  if (!allowedCertificationStatuses.includes(checklist.certificationStatus)) {
    fail('certificationStatus is not an approved status value.');
  }

  if (checklist.certificationStatus === 'NOT CERTIFIED' && checklist.candidateSha !== null) {
    fail('a blocked integration state must not name an unfixed candidate SHA.');
  }

  if (completeEvidenceRequiredStatuses.has(checklist.certificationStatus) && missingEvidence.length > 0) {
    fail('a certified status is claimed while required evidence is incomplete.');
  }
  if (
    checklist.requiredEvidence?.runtimeContinuityAttestation === true
    && (
      runtimeAttestation.attestationStatus !== 'ATTESTED'
      || runtimeAttestation.runtimeEnablementAuthorized !== true
      || runtimeAttestation.candidateSha !== checklist.candidateSha
      || runtimeAttestation.deploymentEnvironment === null
      || runtimeAttestation.receipt === null
      || !Array.isArray(runtimeVerifierRegistry.approvedVerifiers)
      || runtimeVerifierRegistry.approvedVerifiers.length === 0
    )
  ) {
    fail('runtime continuity attestation is claimed without a matching accepted evidence record.');
  }

  console.log(`Release certification status: ${checklist.certificationStatus}`);
  console.log(`Current HEAD: ${head}`);
  console.log(`Worktree: ${worktreeDirty ? 'dirty' : 'clean'}`);
  console.log(`Evidence incomplete: ${missingEvidence.join(', ') || 'none'}`);
  console.log(`Runtime attestation record: ${runtimeAttestation.attestationStatus ?? 'INVALID'}`);

  if (requireCertified) {
    if (worktreeDirty) {
      fail('the authoritative worktree is dirty.');
    }
    if (typeof checklist.candidateSha !== 'string' || checklist.candidateSha !== head) {
      fail('candidateSha is not fixed to current HEAD.');
    }
    if (missingEvidence.length > 0) {
      fail(`required evidence remains incomplete: ${missingEvidence.join(', ')}.`);
    }
    if (checklist.certificationStatus !== 'PRODUCTION CERTIFIED') {
      fail('production certification has not been recorded.');
    }
  }
}
