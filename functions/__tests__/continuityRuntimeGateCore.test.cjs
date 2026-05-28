const test = require("node:test");
const assert = require("node:assert/strict");
const {
  CONTINUITY_RUNTIME_ATTESTATION_IMPLEMENTED,
  evaluateContinuityRuntimeGate,
} = require("../lib/functions/src/continuityRuntimeGateCore.js");

const sha = "d3106eefc9a63ff72198bba8cb9bb5c6890fb9a4";

test("continuity runtime exposure is disabled by default", () => {
  const decision = evaluateContinuityRuntimeGate({});

  assert.equal(CONTINUITY_RUNTIME_ATTESTATION_IMPLEMENTED, false);
  assert.equal(decision.enabled, false);
  assert.equal(decision.requested, false);
  assert.match(decision.reason, /not been requested/);
  assert.ok(decision.missingEvidence.includes("fixed candidate SHA"));
});

test("environment assertions cannot enable continuity without verified attestation output", () => {
  const decision = evaluateContinuityRuntimeGate({
    enableRequested: "true",
    candidateSha: sha,
    functionsDeploymentSha: sha,
    firestoreRulesDeploymentSha: sha,
    emulatorEvidenceSha: sha,
    releaseScopeAttested: "true",
    deploymentAuthorityAttested: "true",
  });

  assert.equal(decision.enabled, false);
  assert.equal(decision.requested, true);
  assert.match(decision.reason, /attestation verification is not implemented/);
  assert.deepEqual(decision.missingEvidence, ["verified runtime attestation receipt"]);
});

test("runtime gate reports mismatched same-SHA evidence", () => {
  const decision = evaluateContinuityRuntimeGate({
    enableRequested: "true",
    candidateSha: sha,
    functionsDeploymentSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    firestoreRulesDeploymentSha: sha,
    emulatorEvidenceSha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    releaseScopeAttested: "false",
    deploymentAuthorityAttested: "false",
  });

  assert.equal(decision.enabled, false);
  assert.ok(decision.missingEvidence.includes("same-SHA Functions deployment evidence"));
  assert.ok(decision.missingEvidence.includes("same-SHA Firestore emulator evidence"));
  assert.ok(decision.missingEvidence.includes("clean release-scope attestation"));
  assert.ok(decision.missingEvidence.includes("deployment authority attestation"));
  assert.ok(decision.missingEvidence.includes("verified runtime attestation receipt"));
});

test("verified attestation output still cannot enable continuity before runtime adapter approval", () => {
  const decision = evaluateContinuityRuntimeGate({
    enableRequested: "true",
    candidateSha: sha,
    functionsDeploymentSha: sha,
    firestoreRulesDeploymentSha: sha,
    emulatorEvidenceSha: sha,
    releaseScopeAttested: "true",
    deploymentAuthorityAttested: "true",
    attestationVerification: {
      verified: true,
      reason: "signed receipt verified",
      attestation: {
        verified: true,
        receiptId: "receipt-001",
        verifierId: "release-verifier-1",
        candidateSha: sha,
        evidenceDigest: "a".repeat(64),
        expiresAt: "2026-05-28T00:00:00.000Z",
      },
    },
  });

  assert.equal(decision.enabled, false);
  assert.deepEqual(decision.missingEvidence, []);
  assert.match(decision.reason, /attestation verification is not implemented/);
});
