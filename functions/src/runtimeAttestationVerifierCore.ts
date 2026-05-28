import { createHash, verify as verifySignature } from "crypto";

export type RuntimeAttestationReceiptPayload = {
  schemaVersion: 1;
  receiptId: string;
  verifierId: string;
  candidateSha: string;
  evidenceDigest: string;
  deploymentEnvironment: "production" | "staging";
  functionsDeploymentSha: string;
  firestoreRulesDeploymentSha: string;
  deploymentEvidenceDigest: string;
  providerSecretLineageDigest: string;
  authorizationScope: "continuity-transitions";
  issuedAt: string;
  expiresAt: string;
};

export type SignedRuntimeAttestationReceipt = {
  payload: RuntimeAttestationReceiptPayload;
  algorithm: "RSA-SHA256";
  signatureBase64: string;
};

export type TrustedRuntimeVerifier = {
  verifierId: string;
  keyId: string;
  publicKeyFingerprintSha256: string;
  authorityScope: "runtime-continuity-attestation";
  status: "approved" | "revoked";
  publicKeyPem: string;
  approvedBy: string;
  approvedAt: string;
  expiresAt: string;
  revokedAt?: string;
  trustRootReference: string;
  lineageReference: string;
  operator: {
    name: string;
    contact: string;
  };
};

export type VerifiedRuntimeAttestation = {
  verified: true;
  receiptId: string;
  verifierId: string;
  candidateSha: string;
  evidenceDigest: string;
  deploymentEnvironment: "production" | "staging";
  functionsDeploymentSha: string;
  firestoreRulesDeploymentSha: string;
  deploymentEvidenceDigest: string;
  providerSecretLineageDigest: string;
  expiresAt: string;
};

export type RuntimeAttestationVerificationResult = {
  verified: boolean;
  reason: string;
  attestation?: VerifiedRuntimeAttestation;
};

export type RuntimeAttestationVerificationInput = {
  receipt?: SignedRuntimeAttestationReceipt;
  trustedVerifier?: TrustedRuntimeVerifier;
  trustedVerifiers?: readonly TrustedRuntimeVerifier[];
  expectedCandidateSha?: string;
  expectedEvidenceDigest?: string;
  expectedDeploymentEnvironment?: "production" | "staging";
  expectedFunctionsDeploymentSha?: string;
  expectedFirestoreRulesDeploymentSha?: string;
  expectedDeploymentEvidenceDigest?: string;
  expectedProviderSecretLineageDigest?: string;
  nowIso: string;
  consumedReceiptIds?: readonly string[];
};

const FULL_SHA_PATTERN = /^[0-9a-f]{40}$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const RECEIPT_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;
const VERIFIER_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;

export function calculateVerifierPublicKeyFingerprint(publicKeyPem: string): string {
  return createHash("sha256").update(publicKeyPem.trim()).digest("hex");
}

export function canonicalizeReceiptPayload(payload: RuntimeAttestationReceiptPayload): string {
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

function resolveTrustedVerifier(
  input: RuntimeAttestationVerificationInput,
  verifierId: string,
  now: number,
): { verifier?: TrustedRuntimeVerifier; reason?: string } {
  const trustedVerifiers = input.trustedVerifiers ?? (input.trustedVerifier ? [input.trustedVerifier] : []);
  if (trustedVerifiers.length === 0) {
    return { reason: "signed runtime attestation receipt is unavailable" };
  }

  const duplicateVerifierIds = new Set<string>();
  const duplicateFingerprints = new Set<string>();
  const seenVerifierIds = new Set<string>();
  const seenFingerprints = new Set<string>();
  for (const verifier of trustedVerifiers) {
    if (seenVerifierIds.has(verifier.verifierId)) {
      duplicateVerifierIds.add(verifier.verifierId);
    }
    seenVerifierIds.add(verifier.verifierId);
    if (seenFingerprints.has(verifier.publicKeyFingerprintSha256)) {
      duplicateFingerprints.add(verifier.publicKeyFingerprintSha256);
    }
    seenFingerprints.add(verifier.publicKeyFingerprintSha256);
  }
  if (duplicateVerifierIds.size > 0) {
    return { reason: "runtime attestation verifier registry contains duplicate verifier IDs" };
  }
  if (duplicateFingerprints.size > 0) {
    return { reason: "runtime attestation verifier registry contains duplicate verifier fingerprints" };
  }

  const verifier = trustedVerifiers.find((candidate) => candidate.verifierId === verifierId);
  if (!verifier) {
    return { reason: "runtime attestation verifier identity is not trusted" };
  }
  if (verifier.status !== "approved") {
    return { reason: "runtime attestation verifier is not approved" };
  }
  if (verifier.authorityScope !== "runtime-continuity-attestation") {
    return { reason: "runtime attestation verifier authority scope is invalid" };
  }
  if (
    verifier.approvedBy === verifier.verifierId
    || verifier.approvedBy === verifier.keyId
    || verifier.trustRootReference === verifier.verifierId
    || verifier.lineageReference === verifier.verifierId
  ) {
    return { reason: "runtime attestation verifier cannot self-attest trust" };
  }
  if (
    typeof verifier.publicKeyPem !== "string"
    || verifier.publicKeyPem.trim().length === 0
    || typeof verifier.keyId !== "string"
    || verifier.keyId.trim().length === 0
    || typeof verifier.approvedBy !== "string"
    || verifier.approvedBy.trim().length === 0
    || typeof verifier.expiresAt !== "string"
    || verifier.expiresAt.trim().length === 0
    || typeof verifier.trustRootReference !== "string"
    || verifier.trustRootReference.trim().length === 0
    || typeof verifier.lineageReference !== "string"
    || verifier.lineageReference.trim().length === 0
    || typeof verifier.operator?.name !== "string"
    || verifier.operator.name.trim().length === 0
    || typeof verifier.operator?.contact !== "string"
    || verifier.operator.contact.trim().length === 0
  ) {
    return { reason: "runtime attestation verifier trust record is incomplete" };
  }
  if (
    !SHA256_PATTERN.test(verifier.publicKeyFingerprintSha256)
    || verifier.publicKeyFingerprintSha256 !== calculateVerifierPublicKeyFingerprint(verifier.publicKeyPem)
  ) {
    return { reason: "runtime attestation verifier public key fingerprint does not match" };
  }

  const approvedAt = Date.parse(verifier.approvedAt);
  if (!Number.isFinite(approvedAt) || approvedAt > now) {
    return { reason: "runtime attestation verifier approval timestamp is invalid" };
  }
  const expiresAt = Date.parse(verifier.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    return { reason: "runtime attestation verifier trust has expired" };
  }
  if (verifier.revokedAt) {
    const revokedAt = Date.parse(verifier.revokedAt);
    if (!Number.isFinite(revokedAt) || revokedAt <= now) {
      return { reason: "runtime attestation verifier trust has been revoked" };
    }
  }

  return { verifier };
}

export function verifyRuntimeAttestationReceipt(
  input: RuntimeAttestationVerificationInput,
): RuntimeAttestationVerificationResult {
  const { receipt } = input;
  if (!receipt) {
    return { verified: false, reason: "signed runtime attestation receipt is unavailable" };
  }

  const payload = receipt.payload;
  const now = Date.parse(input.nowIso);
  if (!Number.isFinite(now)) {
    return { verified: false, reason: "runtime attestation timestamp is invalid" };
  }
  if (
    payload.schemaVersion !== 1
    || receipt.algorithm !== "RSA-SHA256"
    || !RECEIPT_ID_PATTERN.test(payload.receiptId)
    || !VERIFIER_ID_PATTERN.test(payload.verifierId)
    || !FULL_SHA_PATTERN.test(payload.candidateSha)
    || !SHA256_PATTERN.test(payload.evidenceDigest)
    || !FULL_SHA_PATTERN.test(payload.functionsDeploymentSha)
    || !FULL_SHA_PATTERN.test(payload.firestoreRulesDeploymentSha)
    || !SHA256_PATTERN.test(payload.deploymentEvidenceDigest)
    || !SHA256_PATTERN.test(payload.providerSecretLineageDigest)
    || !["production", "staging"].includes(payload.deploymentEnvironment)
    || payload.authorizationScope !== "continuity-transitions"
  ) {
    return { verified: false, reason: "runtime attestation receipt schema is invalid" };
  }
  const trustedVerifier = resolveTrustedVerifier(input, payload.verifierId, now);
  if (!trustedVerifier.verifier) {
    return { verified: false, reason: trustedVerifier.reason ?? "runtime attestation verifier identity is not trusted" };
  }
  if (payload.candidateSha !== input.expectedCandidateSha) {
    return { verified: false, reason: "runtime attestation candidate SHA does not match" };
  }
  if (payload.evidenceDigest !== input.expectedEvidenceDigest) {
    return { verified: false, reason: "runtime attestation evidence digest does not match" };
  }
  if (payload.deploymentEnvironment !== input.expectedDeploymentEnvironment) {
    return { verified: false, reason: "runtime attestation deployment environment does not match" };
  }
  if (payload.functionsDeploymentSha !== input.expectedFunctionsDeploymentSha) {
    return { verified: false, reason: "runtime attestation Functions deployment SHA does not match" };
  }
  if (payload.firestoreRulesDeploymentSha !== input.expectedFirestoreRulesDeploymentSha) {
    return { verified: false, reason: "runtime attestation Firestore rules deployment SHA does not match" };
  }
  if (payload.deploymentEvidenceDigest !== input.expectedDeploymentEvidenceDigest) {
    return { verified: false, reason: "runtime attestation deployment evidence digest does not match" };
  }
  if (payload.providerSecretLineageDigest !== input.expectedProviderSecretLineageDigest) {
    return { verified: false, reason: "runtime attestation provider-secret lineage digest does not match" };
  }
  if (input.consumedReceiptIds?.includes(payload.receiptId)) {
    return { verified: false, reason: "runtime attestation receipt has already been consumed" };
  }

  const issuedAt = Date.parse(payload.issuedAt);
  const expiresAt = Date.parse(payload.expiresAt);
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt) || !Number.isFinite(now)) {
    return { verified: false, reason: "runtime attestation timestamp is invalid" };
  }
  if (issuedAt > now) {
    return { verified: false, reason: "runtime attestation receipt is not yet valid" };
  }
  if (expiresAt <= now || expiresAt <= issuedAt) {
    return { verified: false, reason: "runtime attestation receipt is expired" };
  }

  try {
    const signatureValid = verifySignature(
      "RSA-SHA256",
      Buffer.from(canonicalizeReceiptPayload(payload), "utf8"),
      trustedVerifier.verifier.publicKeyPem,
      Buffer.from(receipt.signatureBase64, "base64"),
    );
    if (!signatureValid) {
      return { verified: false, reason: "runtime attestation signature is invalid" };
    }
  } catch (_error) {
    return { verified: false, reason: "runtime attestation signature cannot be verified" };
  }

  return {
    verified: true,
    reason: "runtime attestation receipt signature and bindings are verified",
    attestation: {
      verified: true,
      receiptId: payload.receiptId,
      verifierId: payload.verifierId,
      candidateSha: payload.candidateSha,
      evidenceDigest: payload.evidenceDigest,
      deploymentEnvironment: payload.deploymentEnvironment,
      functionsDeploymentSha: payload.functionsDeploymentSha,
      firestoreRulesDeploymentSha: payload.firestoreRulesDeploymentSha,
      deploymentEvidenceDigest: payload.deploymentEvidenceDigest,
      providerSecretLineageDigest: payload.providerSecretLineageDigest,
      expiresAt: payload.expiresAt,
    },
  };
}
