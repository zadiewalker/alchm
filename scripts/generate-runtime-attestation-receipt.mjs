#!/usr/bin/env node
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = new Set(process.argv.slice(2));

if (!args.has("--non-production-test")) {
  console.error("Refusing to issue receipt without --non-production-test.");
  process.exit(1);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

const candidateSha = git(["rev-parse", "HEAD"]);
const firestoreRulesSha = sha256(readFileSync("firestore.rules"));
const releaseEvidenceDigest = sha256(readFileSync("docs/release/runtime-attestation-evidence.json"));
const providerSecretLineageDigest = sha256("NON_PRODUCTION_TEST_PROVIDER_SECRET_LINEAGE");
const deploymentEvidenceDigest = sha256([
  "non-production-test",
  candidateSha,
  candidateSha,
  firestoreRulesSha,
  releaseEvidenceDigest,
  providerSecretLineageDigest,
].join("\n"));

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
const issuedAt = new Date();
const expiresAt = new Date(issuedAt.getTime() + 15 * 60 * 1000);

const payload = {
  schemaVersion: "runtime-attestation-receipt/v1",
  receiptId: `test-${candidateSha.slice(0, 12)}-${issuedAt.toISOString()}`,
  verifierId: "non-production-test-verifier",
  keyId: `test-key-${sha256(publicKeyPem).slice(0, 12)}`,
  candidateSha,
  evidenceDigest: releaseEvidenceDigest,
  deploymentEnvironment: "non-production-test",
  functionsDeploymentSha: candidateSha,
  firestoreRulesDeploymentSha: firestoreRulesSha,
  deploymentEvidenceDigest,
  providerSecretLineageDigest,
  authorizationScope: "runtime-continuity-attestation-test",
  issuedAt: issuedAt.toISOString(),
  expiresAt: expiresAt.toISOString(),
  testOnly: true,
};

const canonicalPayload = stableStringify(payload);
const signature = sign(null, Buffer.from(canonicalPayload), privateKey).toString("base64");

console.log(JSON.stringify({
  warning: "NON-PRODUCTION TEST RECEIPT. This must never authorize production runtime continuity.",
  verifierPublicKeyPem: publicKeyPem,
  verifierPublicKeyFingerprintSha256: sha256(publicKeyPem.trim()),
  receipt: {
    payload,
    signature,
    signatureAlgorithm: "ed25519",
    canonicalization: "stable-json-v1",
  },
}, null, 2));
