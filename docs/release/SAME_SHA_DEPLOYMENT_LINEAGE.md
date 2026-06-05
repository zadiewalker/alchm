# Same-SHA Deployment Lineage

## Status

`LOCAL AND GITHUB CANDIDATE RECORDED - DEPLOYMENT LINEAGE NOT REBOUND`

This record states the evidence required to connect reflective provenance in
source to an actually deployed runtime. It does not authorize deployment and
does not accept source files as deployment evidence.

## Required Lineage Chain

| Authority | Required evidence for one fixed SHA | Current evidence |
| --- | --- | --- |
| Candidate source | Clean reviewed commit SHA and normalized release scope | New authoritative candidate is `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`; release scope check passes locally |
| CI validation | Green required checks for that identical SHA | Local validation suite passed for `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`; GitHub Navigation E2E run `26996367445` completed successfully for the exact same SHA |
| Functions | Deployed Khepera and continuity callable identities attributable to SHA | Not rebound. Candidate `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa` changes `functions/src/kheperaGatewayCore.ts`, so prior Firebase Functions deployment evidence cannot be carried forward as same-SHA evidence. |
| Firestore rules | Deployed rules version attributable to SHA and emulator-tested candidate rules | Not rebound in this attestation pass. |
| Provider secret | Presence of server-side provider secret in selected Functions environment, without exposing value | Not rebound to a verifier receipt for this exact candidate. |
| Hosting runtime | Vercel-hosted exported Next artifact; Firebase Hosting redirect edge only | Not promoted or verified for this exact candidate in this attestation pass. |
| Native archive | Reconciled app identity, sync and archive evidence attributable to SHA | `npx cap sync ios` passed for `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`; no same-SHA archive, RevenueCat dashboard proof, distribution signing proof, or TestFlight entitlement proof was recorded. |
| Rollback | Named prior deploy/archive authority and verified rollback procedure | Not rebound to a production deployment for this exact candidate. |

## Reflective Integrity Expectation

Source provenance fields such as `generatedBy`, `transitionedBy`,
`continuityVersion`, and `validatedAt` do not certify production behavior by
themselves. They count as runtime integrity evidence only when the function
and rules implementing them are deployed from, and traceable to, the same
clean candidate SHA.

## Certification Consequence

The previous attested candidate `cf92af3579e9736665f2876a3a44c31032805a42` is
superseded by the queue/crisis reliability candidate
`7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`. This candidate was pushed,
validated locally, and verified by GitHub Navigation E2E run `26996367445`.
It is not same-SHA deployment certified because it changes Functions source and
no Firebase Functions deployment, Vercel production promotion, runtime
attestation receipt, native archive, RevenueCat dashboard proof, or
TestFlight entitlement proof was regenerated for this exact SHA.

The executable runtime gate remains fail closed as described in
`docs/release/RUNTIME_ATTESTATION_MODEL.md`. The evidence collection contract
is expanded in `docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md` and enforced
as a fail-closed preflight by
`docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md`.
