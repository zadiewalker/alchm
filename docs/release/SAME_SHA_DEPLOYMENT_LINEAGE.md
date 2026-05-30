# Same-SHA Deployment Lineage

## Status

`TOPOLOGY DECIDED - DEPLOYMENT EVIDENCE REQUIRED`

This record states the evidence required to connect reflective provenance in
source to an actually deployed runtime. It does not authorize deployment and
does not accept source files as deployment evidence.

## Required Lineage Chain

| Authority | Required evidence for one fixed SHA | Current evidence |
| --- | --- | --- |
| Candidate source | Clean reviewed commit SHA and normalized release scope | `31ba4820fc5c53bdf84e33e941675011c51aa824` |
| CI validation | Green required checks for that identical SHA | Unavailable |
| Functions | Deployed Khepera and continuity callable identities attributable to SHA | functionsHash=`b6a7829da9eb0b4bbcb08d15a92ce635b5031a07`; crisisDetection=`ACTIVE`; healthCheck=`ACTIVE`; candidate=`31ba4820fc5c53bdf84e33e941675011c51aa824` |
| Firestore rules | Deployed rules version attributable to SHA and emulator-tested candidate rules | rulesDigest=`e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`; emulator candidate-bound pass |
| Provider secret | Presence of server-side provider secret in selected Functions environment, without exposing value | providerSecretLineageDigest=`ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a`; candidate=`31ba4820fc5c53bdf84e33e941675011c51aa824` |
| Hosting runtime | Vercel-hosted exported Next artifact; Firebase Hosting redirect edge only | Vercel production deployment `dpl_5wnejochTEuHLBMcSUcqL2dUcK2C`; source linkage evidence still required |
| Native archive | Reconciled app identity, sync and archive evidence attributable to SHA | In scope; archive evidence unavailable |
| Rollback | Named prior deploy/archive authority and verified rollback procedure | `docs/release/ROLLBACK_AUTHORITY_EVIDENCE.md`; owner=`zadiewalker-release-authority`; target=`31ba4820fc5c53bdf84e33e941675011c51aa824` |

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
