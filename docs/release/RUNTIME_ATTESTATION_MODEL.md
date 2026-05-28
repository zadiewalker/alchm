# Runtime Attestation Model

## Status

`FAIL CLOSED - NO RUNTIME ENABLEMENT AUTHORIZED`

This record defines the evidence boundary for continuity transitions. It does
not authorize a deployment or make the source-level transition functions
available.

## Runtime Gate Contract

`functions/src/runtimeAttestationVerifierCore.ts` defines verification for a
signed, candidate-bound, deployment-bound, expiring, replay-rejected receipt.
It rejects mismatched evidence digests, deployed Functions SHA mismatch,
deployed Firestore rules SHA mismatch, deployment environment mismatch,
deployment evidence digest mismatch, provider-secret lineage digest mismatch,
duplicate verifier IDs, self-attested verifier trust, expired or revoked
verifier trust, invalid signatures, and consumed receipt IDs.
`functions/src/continuityRuntimeGateCore.ts` consumes only a structured
verification result for container transitions; the current callable does not
obtain such a result from environment variables. The current
implementation always denies runtime enablement because there is no approved
runtime adapter for an accepted attestation or selected deployment authority.
This is intentional.

Environment configuration is an assertion, not attestation evidence. Setting
an enablement variable or claiming matching SHA values cannot make continuity
transitions available in this build.

`scripts/check-runtime-attestation-evidence.mjs` is an executable,
candidate-bound preflight for the release evidence register at
`docs/release/runtime-attestation-evidence.json`. That register is currently
`NOT ATTESTED`, so the preflight fails. It validates recorded evidence; it
does not convert local files or mutable environment values into deployed
runtime authority.

## Evidence Required Before Enablement

| Evidence | Requirement | Current state |
| --- | --- | --- |
| Candidate source | Clean reviewed full SHA with normalized release scope | Unavailable |
| Authorization | Firestore emulator evidence for that SHA | Unavailable; Java runtime missing locally |
| Functions runtime | Deployed transition function identity attributable to that SHA | Unavailable |
| Rules runtime | Deployed Firestore rules identity attributable to that SHA | Unavailable |
| Deployment authority | Approved Firebase/Vercel/static/native topology | Human decision required |
| Rollback | Verified rollback authority and lineage | Unavailable |
| Runtime receipt | Verifier-issued receipt consumable by an approved server adapter | Unavailable |
| Trusted verifier | Approved public key registry entry with externally controlled issuer | Unavailable; registry intentionally empty |

Provider-secret verification is independently required for deployed Khepera
generation. Container transitions do not use the provider secret, but a
release exposing reflective continuity cannot certify while the Khepera
runtime authority remains unverified.

## Denial Semantics

- A request without explicit runtime exposure remains denied.
- A request with asserted evidence remains denied until an approved verifier
  exists.
- A signed receipt is structurally verifiable in source, but remains
  insufficient while no approved verifier, deployment-bound evidence, or
  runtime adapter exists.
- Denial logs include only the gate reason and missing evidence categories,
  not writing, reflections, or user-derived state.
- The user interface remains unavailable and no partial transition persists.

RB-017 remains open until the approved release contract is proved at runtime
for one clean candidate SHA.

See `docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md` for the executable
evidence-register contract and
`docs/release/EXECUTABLE_RUNTIME_VERIFIER_MODEL.md` for receipt semantics,
`docs/release/TRUSTED_VERIFIER_AUTHORITY_MODEL.md` for verifier governance,
and `docs/release/DEPLOYMENT_BOUND_ATTESTATION_MODEL.md` for deployment-bound
receipt requirements.
