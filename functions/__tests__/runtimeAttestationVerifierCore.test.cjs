const test = require("node:test");
const assert = require("node:assert/strict");
const { generateKeyPairSync, sign } = require("node:crypto");
const {
  canonicalizeReceiptPayload,
  calculateVerifierPublicKeyFingerprint,
  verifyRuntimeAttestationReceipt,
} = require("../lib/functions/src/runtimeAttestationVerifierCore.js");

const candidateSha = "d3106eefc9a63ff72198bba8cb9bb5c6890fb9a4";
const evidenceDigest = "a".repeat(64);
const deploymentEvidenceDigest = "c".repeat(64);
const providerSecretLineageDigest = "e".repeat(64);
const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
const trustedVerifier = {
  verifierId: "release-verifier-1",
  keyId: "release-verifier-1-key-2026-05",
  publicKeyFingerprintSha256: calculateVerifierPublicKeyFingerprint(publicKeyPem),
  authorityScope: "runtime-continuity-attestation",
  status: "approved",
  publicKeyPem,
  approvedBy: "release-authority-board",
  approvedAt: "2026-05-26T00:00:00.000Z",
  expiresAt: "2026-06-26T00:00:00.000Z",
  trustRootReference: "docs/release/trusted-runtime-verifiers.json",
  lineageReference: "docs/release/EXECUTABLE_TRUSTED_VERIFIER_INTEGRATION.md",
  operator: {
    name: "Release verifier operator",
    contact: "security@example.invalid",
  },
};

function createReceipt(overrides = {}) {
  const payload = {
    schemaVersion: 1,
    receiptId: "receipt-001",
    verifierId: "release-verifier-1",
    candidateSha,
    evidenceDigest,
    deploymentEnvironment: "production",
    functionsDeploymentSha: candidateSha,
    firestoreRulesDeploymentSha: candidateSha,
    deploymentEvidenceDigest,
    providerSecretLineageDigest,
    authorizationScope: "continuity-transitions",
    issuedAt: "2026-05-27T00:00:00.000Z",
    expiresAt: "2026-05-28T00:00:00.000Z",
    ...overrides,
  };
  return {
    payload,
    algorithm: "RSA-SHA256",
    signatureBase64: sign(
      "RSA-SHA256",
      Buffer.from(canonicalizeReceiptPayload(payload), "utf8"),
      privateKey,
    ).toString("base64"),
  };
}

function verify(receipt, consumedReceiptIds = []) {
  return verifyRuntimeAttestationReceipt({
    receipt,
    trustedVerifiers: [trustedVerifier],
    expectedCandidateSha: candidateSha,
    expectedEvidenceDigest: evidenceDigest,
    expectedDeploymentEnvironment: "production",
    expectedFunctionsDeploymentSha: candidateSha,
    expectedFirestoreRulesDeploymentSha: candidateSha,
    expectedDeploymentEvidenceDigest: deploymentEvidenceDigest,
    expectedProviderSecretLineageDigest: providerSecretLineageDigest,
    nowIso: "2026-05-27T12:00:00.000Z",
    consumedReceiptIds,
  });
}

test("a signed candidate-bound attestation receipt is structurally verifiable", () => {
  const result = verify(createReceipt());

  assert.equal(result.verified, true);
  assert.equal(result.attestation?.receiptId, "receipt-001");
  assert.equal(result.attestation?.candidateSha, candidateSha);
  assert.equal(result.attestation?.deploymentEnvironment, "production");
  assert.equal(result.attestation?.deploymentEvidenceDigest, deploymentEvidenceDigest);
  assert.equal(result.attestation?.providerSecretLineageDigest, providerSecretLineageDigest);
});

test("receipt verification rejects invalid signatures and candidate mismatches", () => {
  const invalidSignature = createReceipt();
  invalidSignature.signatureBase64 = Buffer.from("not a valid signature").toString("base64");

  assert.equal(verify(invalidSignature).verified, false);
  assert.match(verify(invalidSignature).reason, /signature/);
  assert.match(verify(createReceipt({ candidateSha: "b".repeat(40) })).reason, /candidate SHA/);
});

test("receipt verification rejects expired and replayed receipts", () => {
  const expired = createReceipt({ expiresAt: "2026-05-27T11:59:59.000Z" });

  assert.match(verify(expired).reason, /expired/);
  assert.match(verify(createReceipt(), ["receipt-001"]).reason, /already been consumed/);
});

test("receipt verification rejects self-attested, duplicate, and expired verifier trust", () => {
  const receipt = createReceipt();
  const baseInput = {
    receipt,
    expectedCandidateSha: candidateSha,
    expectedEvidenceDigest: evidenceDigest,
    expectedDeploymentEnvironment: "production",
    expectedFunctionsDeploymentSha: candidateSha,
    expectedFirestoreRulesDeploymentSha: candidateSha,
    expectedDeploymentEvidenceDigest: deploymentEvidenceDigest,
    expectedProviderSecretLineageDigest: providerSecretLineageDigest,
    nowIso: "2026-05-27T12:00:00.000Z",
  };

  assert.match(verifyRuntimeAttestationReceipt({
    ...baseInput,
    trustedVerifiers: [trustedVerifier, trustedVerifier],
  }).reason, /duplicate verifier IDs/);

  assert.match(verifyRuntimeAttestationReceipt({
    ...baseInput,
    trustedVerifiers: [{ ...trustedVerifier, approvedBy: "release-verifier-1" }],
  }).reason, /self-attest/);

  assert.match(verifyRuntimeAttestationReceipt({
    ...baseInput,
    trustedVerifiers: [{ ...trustedVerifier, expiresAt: "2026-05-27T11:59:59.000Z" }],
  }).reason, /expired/);
});

test("receipt verification rejects duplicate fingerprints and unverifiable verifier metadata", () => {
  const receipt = createReceipt();
  const baseInput = {
    receipt,
    expectedCandidateSha: candidateSha,
    expectedEvidenceDigest: evidenceDigest,
    expectedDeploymentEnvironment: "production",
    expectedFunctionsDeploymentSha: candidateSha,
    expectedFirestoreRulesDeploymentSha: candidateSha,
    expectedDeploymentEvidenceDigest: deploymentEvidenceDigest,
    expectedProviderSecretLineageDigest: providerSecretLineageDigest,
    nowIso: "2026-05-27T12:00:00.000Z",
  };

  assert.match(verifyRuntimeAttestationReceipt({
    ...baseInput,
    trustedVerifiers: [
      trustedVerifier,
      { ...trustedVerifier, verifierId: "release-verifier-2" },
    ],
  }).reason, /duplicate verifier fingerprints/);

  assert.match(verifyRuntimeAttestationReceipt({
    ...baseInput,
    trustedVerifiers: [{ ...trustedVerifier, publicKeyFingerprintSha256: "0".repeat(64) }],
  }).reason, /fingerprint/);

  assert.match(verifyRuntimeAttestationReceipt({
    ...baseInput,
    trustedVerifiers: [{ ...trustedVerifier, authorityScope: "other" }],
  }).reason, /authority scope/);

  const verifierWithoutExpiration = { ...trustedVerifier };
  delete verifierWithoutExpiration.expiresAt;
  assert.match(verifyRuntimeAttestationReceipt({
    ...baseInput,
    trustedVerifiers: [verifierWithoutExpiration],
  }).reason, /incomplete/);
});

test("receipt verification rejects stale deployment lineage bindings", () => {
  assert.match(
    verify(createReceipt({ functionsDeploymentSha: "b".repeat(40) })).reason,
    /Functions deployment SHA/,
  );
  assert.match(
    verify(createReceipt({ firestoreRulesDeploymentSha: "b".repeat(40) })).reason,
    /Firestore rules deployment SHA/,
  );
  assert.match(
    verify(createReceipt({ deploymentEvidenceDigest: "d".repeat(64) })).reason,
    /deployment evidence digest/,
  );
  assert.match(
    verify(createReceipt({ providerSecretLineageDigest: "f".repeat(64) })).reason,
    /provider-secret lineage digest/,
  );
});
