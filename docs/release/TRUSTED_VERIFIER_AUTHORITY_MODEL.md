# Trusted Verifier Authority Model

## Status

`GOVERNANCE CONTRACT IMPLEMENTED - APPROVED VERIFIER REGISTERED`

This record defines how ALCHM trusts a runtime attestation verifier. The
approved public verifier metadata is recorded in
`docs/release/trusted-runtime-verifiers.json`; private key custody remains
external to the repository.

## Verifier Governance

A verifier is trusted only when all of the following are true:

- the verifier appears exactly once in
  `docs/release/trusted-runtime-verifiers.json`;
- the verifier status is `approved`;
- the verifier public key, key ID, approval timestamp, and trust-root reference
  are present;
- `approvedBy` identifies a separate release authority and is not the verifier
  ID or key ID;
- the verifier approval is not expired or revoked;
- the verifier public key was reviewed as part of the same release candidate
  scope.

The current approved-verifier registry contains
`alchm-release-owner-2026-05`. Environment variables, deployment
configuration, or a verifier-controlled private key cannot approve verifier
trust. Self-attested verifier records are invalid.

## Receipt Semantics

A receipt is acceptable only when a trusted verifier signs a canonical payload
that binds:

- immutable receipt ID;
- verifier ID;
- candidate SHA;
- release evidence digest;
- deployment environment;
- same-SHA Functions deployment SHA;
- same-SHA Firestore rules deployment SHA;
- deployment evidence digest;
- `continuity-transitions` authorization scope;
- issuance and expiry timestamps.

Receipt IDs are single-use authorization material. A consumed receipt is invalid
for subsequent runtime continuity exposure.

## Runtime Trust Semantics

Signatures alone are insufficient. A valid signature from an unapproved,
expired, revoked, duplicated, or self-attested verifier is rejected.

Runtime continuity remains unavailable unless a future reviewed runtime adapter
verifies all candidate, verifier, deployment, emulator, and release-scope
evidence and then supplies a structured verification result to the continuity
gate. That adapter does not exist in the current candidate.

## Certification Requirements

RB-017 cannot close until:

- verifier admission is approved by a human release authority;
- the trusted-verifier registry is part of a clean reviewed candidate;
- a signed deployment-bound receipt exists for that exact SHA;
- the receipt verifies against deployed Functions, deployed rules, emulator
  evidence, provider-secret evidence, rollback evidence, and release scope;
- replay consumption and rollback invalidation are verified;
- runtime continuity remains denied when any trust-chain link is missing.
