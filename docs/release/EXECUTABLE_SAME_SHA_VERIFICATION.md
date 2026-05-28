# Executable Same-SHA Verification

## Status

`STRUCTURAL VERIFICATION IMPLEMENTED - LINEAGE NOT ESTABLISHED`

This record defines the same-SHA evidence contract used by the runtime
attestation preflight. It does not establish deployment lineage for the
current dirty worktree.

## Candidate Integrity

An attested candidate must have:

- one immutable full commit SHA;
- a clean authoritative checkout;
- no duplicate backend, workflow, native, backup, or artifact authority
  paths;
- evidence references attributable to that exact SHA.

## Lineage Evidence Set

The receipt evidence digest binds these required evidence records:

| Evidence | Binding requirement |
| --- | --- |
| Candidate cleanliness | Clean checkout reference for the candidate SHA |
| Release scope | Reviewed normalized authority-scope reference |
| Firestore authorization | Emulator execution reference for candidate rules/tests |
| Functions deployment | Deployed revision reference tied to candidate SHA |
| Firestore rules deployment | Deployed rules reference tied to candidate SHA |
| Provider secret presence | Non-disclosing verification reference for selected backend |
| Deployment authority | Approved topology record |
| Rollback authority | Named rollback reference and procedure |

## Receipt And Replay Semantics

- The candidate evidence set is reduced to a deterministic SHA-256 digest.
- A trusted verifier signs a receipt binding that digest to one candidate SHA
  and the `continuity-transitions` scope.
- The receipt must also bind deployment environment, deployed Functions SHA,
  deployed Firestore rules SHA, a separate deployment evidence digest, and a
  provider-secret lineage digest.
- Duplicate, expired, revoked, or self-attested verifier records are invalid.
- Receipt expiry and consumed receipt IDs prevent stale or repeated
  authorization from becoming implicit runtime authority.
- A new candidate SHA or changed evidence requires a new receipt.

## Current State

`docs/release/runtime-attestation-evidence.json` records `NOT ATTESTED`.
`docs/release/trusted-runtime-verifiers.json` contains no approved verifier.
The worktree is dirty and includes duplicate authority paths. Therefore
`npm run check:runtime-attestation` must fail and continuity remains
unavailable.
