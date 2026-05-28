import type { RuntimeAttestationVerificationResult } from "./runtimeAttestationVerifierCore";

export type ContinuityRuntimeGateEvidence = {
  enableRequested?: string;
  candidateSha?: string;
  functionsDeploymentSha?: string;
  firestoreRulesDeploymentSha?: string;
  emulatorEvidenceSha?: string;
  releaseScopeAttested?: string;
  deploymentAuthorityAttested?: string;
  attestationVerification?: RuntimeAttestationVerificationResult;
};

export type ContinuityRuntimeGateDecision = {
  enabled: boolean;
  requested: boolean;
  reason: string;
  missingEvidence: string[];
};

export const CONTINUITY_RUNTIME_ATTESTATION_IMPLEMENTED = false;

function isFullSha(value: string | undefined): value is string {
  return typeof value === "string" && /^[0-9a-f]{40}$/.test(value);
}

export function evaluateContinuityRuntimeGate(
  evidence: ContinuityRuntimeGateEvidence,
): ContinuityRuntimeGateDecision {
  const requested = evidence.enableRequested === "true";
  const missingEvidence: string[] = [];
  const candidateSha = evidence.candidateSha;

  if (!isFullSha(candidateSha)) {
    missingEvidence.push("fixed candidate SHA");
  }
  if (!isFullSha(evidence.functionsDeploymentSha) || evidence.functionsDeploymentSha !== candidateSha) {
    missingEvidence.push("same-SHA Functions deployment evidence");
  }
  if (!isFullSha(evidence.firestoreRulesDeploymentSha) || evidence.firestoreRulesDeploymentSha !== candidateSha) {
    missingEvidence.push("same-SHA Firestore rules deployment evidence");
  }
  if (!isFullSha(evidence.emulatorEvidenceSha) || evidence.emulatorEvidenceSha !== candidateSha) {
    missingEvidence.push("same-SHA Firestore emulator evidence");
  }
  if (evidence.releaseScopeAttested !== "true") {
    missingEvidence.push("clean release-scope attestation");
  }
  if (evidence.deploymentAuthorityAttested !== "true") {
    missingEvidence.push("deployment authority attestation");
  }
  if (
    evidence.attestationVerification?.verified !== true
    || evidence.attestationVerification.attestation?.candidateSha !== candidateSha
  ) {
    missingEvidence.push("verified runtime attestation receipt");
  }

  if (!requested) {
    return {
      enabled: false,
      requested,
      reason: "continuity transitions have not been requested for runtime exposure",
      missingEvidence,
    };
  }

  return {
    enabled: false,
    requested,
    reason: CONTINUITY_RUNTIME_ATTESTATION_IMPLEMENTED
      ? "continuity transition evidence has not been accepted"
      : "runtime attestation verification is not implemented",
    missingEvidence,
  };
}
