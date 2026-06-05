# Same-SHA Deployment Lineage

## Status

`DEPLOYMENT LINEAGE RECORDED - NATIVE EVIDENCE STILL BLOCKS CERTIFICATION`

This record states the evidence required to connect reflective provenance in
source to an actually deployed runtime. It does not authorize deployment and
does not accept source files as deployment evidence.

## Required Lineage Chain

| Authority | Required evidence for one fixed SHA | Current evidence |
| --- | --- | --- |
| Candidate source | Clean reviewed commit SHA and normalized release scope | New authoritative candidate is `cf92af3579e9736665f2876a3a44c31032805a42`; release scope check passes locally |
| CI validation | Green required checks for that identical SHA | Local validation suite passed for `cf92af3579e9736665f2876a3a44c31032805a42`; GitHub Navigation E2E run `26985490302` completed successfully for the exact same SHA |
| Functions | Deployed Khepera and continuity callable identities attributable to SHA | Targeted Firebase deploy completed 2026-06-04 to project `alchm-463017`; deployed `generateKheperaReflection` hash `ea67e160fcd9a01e3d8ea587d67a63bb207c2c3f` with `ANTHROPIC_API_KEY` env key present; `activateContainer` and `advanceSanctuaryContainer` hash `b6ae89d0c7f968ce75e274cbcbc754b7ec7c9ca2`; `healthCheck` hash `76124a2dccc52dd8955508ccb60ba280ddf41a70`; legacy `crisisDetection` preserved as ACTIVE with hash `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Firestore rules | Deployed rules version attributable to SHA and emulator-tested candidate rules | Firestore rules deployed 2026-06-04 to project `alchm-463017`; local authoritative rules digest `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`; CLI reported rules compiled successfully and released to `cloud.firestore` |
| Provider secret | Presence of server-side provider secret in selected Functions environment, without exposing value | Verified: `firebase functions:secrets:access ANTHROPIC_API_KEY --project alchm-463017` succeeded without printing the secret; deployed `generateKheperaReflection` metadata includes `ANTHROPIC_API_KEY`; source reads `process.env.ANTHROPIC_API_KEY` |
| Hosting runtime | Vercel-hosted exported Next artifact; Firebase Hosting redirect edge only | Vercel production deployment `dpl_CedM7rCY51RCDnrMNwcR8GDVdY7e` is Ready at `https://alchm-6l5scjnv1-zadie-walkers-projects.vercel.app`; aliases include `https://alchm.vercel.app`; prior production rollback target is `dpl_B8FUdpb8N3CbwsTzZ79ZBQ6Ev4vh` |
| Native archive | Reconciled app identity, sync and archive evidence attributable to SHA | Current local archive for candidate `cf92af3579e9736665f2876a3a44c31032805a42` succeeded at `/tmp/alchm-cf92af3579e9736665f2876a3a44c31032805a42.xcarchive`; bundle ID `com.alchm.sanctuary`; external RevenueCat dashboard and sandbox/TestFlight entitlement proof remain required before native certification |
| Rollback | Named prior deploy/archive authority and verified rollback procedure | Current Vercel production is `dpl_CedM7rCY51RCDnrMNwcR8GDVdY7e`; rollback target remains `dpl_B8FUdpb8N3CbwsTzZ79ZBQ6Ev4vh`; Firebase rules/functions rollback procedure remains documented |

## Reflective Integrity Expectation

Source provenance fields such as `generatedBy`, `transitionedBy`,
`continuityVersion`, and `validatedAt` do not certify production behavior by
themselves. They count as runtime integrity evidence only when the function
and rules implementing them are deployed from, and traceable to, the same
clean candidate SHA.

## Certification Consequence

The previous attested candidate `d255aded50d97a5325b56c7db431969249546f85` is
superseded by the reviewer-facing product candidate
`cf92af3579e9736665f2876a3a44c31032805a42`. ALCHM has same-SHA deployment
evidence for this candidate lineage because the current candidate was pushed,
validated locally, verified by GitHub Navigation E2E run `26985490302`, and
promoted to Vercel production deployment `dpl_CedM7rCY51RCDnrMNwcR8GDVdY7e`.
Firebase Functions and Firestore rules remain runtime-equivalent because the
candidate delta does not touch `functions/` or `firestore.rules`. Final release certification remains blocked by missing native RevenueCat/TestFlight proof.

The executable runtime gate remains fail closed as described in
`docs/release/RUNTIME_ATTESTATION_MODEL.md`. The evidence collection contract
is expanded in `docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md` and enforced
as a fail-closed preflight by
`docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md`.
