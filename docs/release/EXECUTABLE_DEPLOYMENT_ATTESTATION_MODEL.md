# Executable Deployment Attestation Model

## Status

`ISSUANCE CONTRACT DEFINED - NO DEPLOYMENT ATTESTATION ISSUED`

This record defines the deployment-attestation issuance contract for runtime
continuity. It does not issue a receipt or certify deployment lineage.

## Issuance Preconditions

A deployment-bound receipt may be issued only after all of the following are
true for one immutable candidate SHA:

- candidate checkout is clean;
- release scope contains no duplicate authority paths;
- Firestore emulator authorization evidence exists for the candidate rules;
- Firebase Functions deployment evidence is tied to the same SHA;
- Firestore rules deployment evidence is tied to the same SHA;
- provider-secret presence evidence exists without exposing secret values;
- deployment topology is approved;
- rollback authority is documented;
- trusted verifier admission is approved.

## Issued Receipt Bindings

The verifier-issued receipt must bind:

- `candidateSha`;
- `deploymentEnvironment`;
- `functionsDeploymentSha`;
- `firestoreRulesDeploymentSha`;
- release `evidenceDigest`;
- `deploymentEvidenceDigest`;
- `providerSecretLineageDigest`;
- verifier identity;
- `continuity-transitions` scope;
- expiry and replay-prevention identity.

Changing any deployment evidence, provider-secret evidence, rollback authority,
candidate SHA, or rules/functions lineage invalidates the receipt and requires
new issuance.

## Rejection Semantics

The release preflight rejects:

- missing receipt;
- unsigned or malformed receipt;
- unapproved verifier;
- stale, expired, revoked, or self-attested verifier trust;
- mismatched candidate SHA;
- mismatched Functions or Firestore rules SHA;
- mismatched deployment evidence digest;
- mismatched provider-secret lineage digest;
- consumed receipt IDs;
- dirty release scope or duplicate authority paths.

## Current Candidate State

No deployment attestation is issued. The evidence register records
`NOT ATTESTED`, the verifier registry has no approved verifier, the worktree is
dirty, emulator evidence is unavailable, and deployment authority is unresolved.
Runtime continuity must therefore remain unavailable.
