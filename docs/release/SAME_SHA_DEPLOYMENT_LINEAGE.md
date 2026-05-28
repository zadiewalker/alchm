# Same-SHA Deployment Lineage

## Status

`TOPOLOGY DECIDED - DEPLOYMENT EVIDENCE REQUIRED`

This record states the evidence required to connect reflective provenance in
source to an actually deployed runtime. It does not authorize deployment and
does not accept source files as deployment evidence.

## Required Lineage Chain

| Authority | Required evidence for one fixed SHA | Current evidence |
| --- | --- | --- |
| Candidate source | Clean reviewed commit SHA and normalized release scope | Unavailable |
| CI validation | Green required checks for that identical SHA | Unavailable |
| Functions | Deployed Khepera and continuity callable identities attributable to SHA | Unavailable |
| Firestore rules | Deployed rules version attributable to SHA and emulator-tested candidate rules | Unavailable |
| Provider secret | Presence of server-side provider secret in selected Functions environment, without exposing value | Unavailable |
| Hosting runtime | Vercel-hosted exported Next artifact; Firebase Hosting redirect edge only | Deployment evidence unavailable |
| Native archive | Reconciled app identity, sync and archive evidence attributable to SHA | In scope; archive evidence unavailable |
| Rollback | Named prior deploy/archive authority and verified rollback procedure | Unavailable |

## Reflective Integrity Expectation

Source provenance fields such as `generatedBy`, `transitionedBy`,
`continuityVersion`, and `validatedAt` do not certify production behavior by
themselves. They count as runtime integrity evidence only when the function
and rules implementing them are deployed from, and traceable to, the same
clean candidate SHA.

## Certification Consequence

Until the lineage chain is complete, ALCHM remains `NOT CERTIFIED` and
`NOT PRODUCTION CERTIFIED`, even when local source checks pass.

The executable runtime gate remains fail closed as described in
`docs/release/RUNTIME_ATTESTATION_MODEL.md`. The evidence collection contract
is expanded in `docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md` and enforced
as a fail-closed preflight by
`docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md`.
