# Executable Runtime Verifier Model

## Status

`VERIFIER CONTRACT IMPLEMENTED - NO APPROVED VERIFIER OR RECEIPT`

This record defines the source-level verifier contract for continuity runtime
authorization. It does not approve a verifier, accept an attestation, or
enable a transition.

## Verifier Authority

Only a separately approved release verifier may issue a runtime attestation
receipt. Its public key must be recorded in
`docs/release/trusted-runtime-verifiers.json` through reviewed candidate
scope; the corresponding private key must remain outside the repository and
outside mutable application environment configuration.

The current registry contains no approved verifier. This is intentional.
Verifier records are invalid if duplicated, expired, revoked, incomplete, or
self-attested. `approvedBy` must identify a separate release authority rather
than the verifier ID or key ID.

## Signed Receipt Contract

A receipt is valid only when it includes:

| Field | Requirement |
| --- | --- |
| `receiptId` | Unique immutable receipt identity used for replay rejection |
| `verifierId` | Matches an approved trusted-verifier registry entry |
| `candidateSha` | Exact full SHA for the clean reviewed candidate |
| `evidenceDigest` | SHA-256 digest binding the candidate evidence set |
| `deploymentEnvironment` | Exact deployment environment authorized by the receipt |
| `functionsDeploymentSha` | Same-SHA deployed Functions evidence |
| `firestoreRulesDeploymentSha` | Same-SHA deployed Firestore rules evidence |
| `deploymentEvidenceDigest` | SHA-256 digest binding deployment, secret, and rollback evidence |
| `providerSecretLineageDigest` | SHA-256 digest binding provider-secret presence evidence separately |
| `authorizationScope` | Exactly `continuity-transitions` |
| `issuedAt`, `expiresAt` | Bounded validity window |
| `signatureBase64` | `RSA-SHA256` signature over the canonical receipt payload |

`functions/src/runtimeAttestationVerifierCore.ts` implements signature,
binding, validity-window, and consumed-receipt rejection semantics. The
release evidence preflight independently validates a recorded receipt before
an `ATTESTED` status could be accepted.

## Runtime Verification Semantics

- Environment values cannot issue or verify a receipt.
- A mismatched SHA, evidence digest, verifier identity, signature, validity
  window, deployment environment, deployment digest, deployed Functions SHA,
  deployed rules SHA, provider-secret lineage digest, or consumed receipt fails
  verification.
- Duplicate, expired, revoked, incomplete, or self-attested verifier records
  fail verification.
- `functions/src/continuityRuntimeGateCore.ts` consumes only a structured
  verification result.
- No live adapter currently supplies such a result to the transition callable.
- Runtime transition exposure therefore remains denied.

## Evidence Required Before Adapter Integration

- Clean reviewed candidate SHA and normalized release scope.
- Firestore emulator authorization evidence for that SHA.
- Same-SHA deployed Functions and rules evidence.
- Selected deployment authority, provider-secret evidence, and rollback
  authority.
- Approved verifier public key and externally controlled issuer.
- Deployment-bound receipt for the same candidate, Functions SHA, rules SHA,
  deployment evidence digest, and environment.
- Review of receipt storage, consumption, expiry, and rollback invalidation.

RB-017 remains open until these requirements are proven and an approved
runtime adapter is separately reviewed.
