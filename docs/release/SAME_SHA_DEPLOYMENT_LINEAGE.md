# Same-SHA Deployment Lineage

## Status

`STALE DEPLOYMENT LINEAGE FOR NEW CANDIDATE fcf06d42757136c1693afb3c1447d80df7d32ce6`

This record states the evidence required to connect reflective provenance in
source to an actually deployed runtime. It does not authorize deployment and
does not accept source files as deployment evidence.

## Required Lineage Chain

| Authority | Required evidence for one fixed SHA | Current evidence |
| --- | --- | --- |
| Candidate source | Clean reviewed commit SHA and normalized release scope | New authoritative candidate is `fcf06d42757136c1693afb3c1447d80df7d32ce6`; release scope check passes locally |
| CI validation | Green required checks for that identical SHA | Not yet captured for `fcf06d42757136c1693afb3c1447d80df7d32ce6`; GitHub checks must be rerun after push |
| Functions | Deployed Khepera and continuity callable identities attributable to SHA | Stale: Firebase deployment evidence is bound to previous candidate `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| Firestore rules | Deployed rules version attributable to SHA and emulator-tested candidate rules | Emulator evidence is refreshed for `fcf06d42757136c1693afb3c1447d80df7d32ce6`; production rules deployment evidence is still stale from previous candidate |
| Provider secret | Presence of server-side provider secret in selected Functions environment, without exposing value | Redacted lineage digest remains recorded, but deployment binding must be reattached to the new Functions/deployment evidence for `fcf06d42757136c1693afb3c1447d80df7d32ce6` |
| Hosting runtime | Vercel-hosted exported Next artifact; Firebase Hosting redirect edge only | Stale: Vercel production deployment `dpl_B8FUdpb8N3CbwsTzZ79ZBQ6Ev4vh` was recorded for previous candidate `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| Native archive | Reconciled app identity, sync and archive evidence attributable to SHA | Stale: existing archive evidence is bound to previous candidate `16e3a5d19ceee278957a413fb01b69178dca97cf`; new archive required |
| Rollback | Named prior deploy/archive authority and verified rollback procedure | Stale: rollback target names previous candidate/deployment; new rollback evidence required after redeploy |

## Reflective Integrity Expectation

Source provenance fields such as `generatedBy`, `transitionedBy`,
`continuityVersion`, and `validatedAt` do not certify production behavior by
themselves. They count as runtime integrity evidence only when the function
and rules implementing them are deployed from, and traceable to, the same
clean candidate SHA.

## Certification Consequence

The previous web and Firebase deployment lineage chain is superseded by the
new authoritative candidate `fcf06d42757136c1693afb3c1447d80df7d32ce6`.
ALCHM is not currently same-SHA deployment certified for this candidate.

The executable runtime gate remains fail closed as described in
`docs/release/RUNTIME_ATTESTATION_MODEL.md`. The evidence collection contract
is expanded in `docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md` and enforced
as a fail-closed preflight by
`docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md`.
