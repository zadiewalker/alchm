# Same-SHA Deployment Lineage

## Status

`DEPLOYMENT LINEAGE RECORDED - PROVIDER SECRET AND RUNTIME RECEIPT BLOCKED`

This record states the evidence required to connect reflective provenance in
source to an actually deployed runtime. It does not authorize deployment and
does not accept source files as deployment evidence.

## Required Lineage Chain

| Authority | Required evidence for one fixed SHA | Current evidence |
| --- | --- | --- |
| Candidate source | Clean reviewed commit SHA and normalized release scope | New authoritative candidate is `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`; release scope check passes locally |
| CI validation | Green required checks for that identical SHA | Local validation suite passed for `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`; GitHub Navigation E2E run `26996367445` completed successfully for the exact same SHA |
| Functions | Deployed Khepera and continuity callable identities attributable to SHA | `firebase deploy --only functions:generateKheperaReflection --project alchm-463017` completed on 2026-06-05; `firebase functions:list --project alchm-463017 --json` reports `generateKheperaReflection(us-central1)` ACTIVE with hash `1dc3db804da29d30c9bae70ee4ae58d8e61cca68`. |
| Firestore rules | Deployed rules version attributable to SHA and emulator-tested candidate rules | `firebase deploy --only firestore:rules --project alchm-463017` completed on 2026-06-05; `firestore.rules` digest is `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`. The emulator evidence artifact passed at evidence-tail `17b2c4316ca382b0ff0f21828cd1d459247cd748`, not directly at product candidate SHA. |
| Provider secret | Presence of server-side provider secret in selected Functions environment, without exposing value | Blocked. Deployed `generateKheperaReflection` metadata does not show `ANTHROPIC_API_KEY`; Firebase secret access failed; gcloud secret metadata access failed due invalid auth token. |
| Hosting runtime | Vercel-hosted exported Next artifact; Firebase Hosting redirect edge only | Candidate preview `dpl_79TqCW4Hu7Wg5y2zYBCnDVutcTbV` cloned commit `7aecc5a`; it was promoted to production deployment `dpl_7Ha2hAsHqqhBtPHa2q6XhGMqySEd`, ready at `https://alchm-ntuqgyn5i-zadie-walkers-projects.vercel.app` with alias `https://alchm.vercel.app`. |
| Native archive | Reconciled app identity, sync and archive evidence attributable to SHA | `npx cap sync ios` passed for `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`; no same-SHA archive, RevenueCat dashboard proof, distribution signing proof, or TestFlight entitlement proof was recorded. |
| Rollback | Named prior deploy/archive authority and verified rollback procedure | Current Vercel production deployment is `dpl_7Ha2hAsHqqhBtPHa2q6XhGMqySEd`; previous production rollback target is `dpl_CedM7rCY51RCDnrMNwcR8GDVdY7e`; Firebase rollback remains targeted redeploy to project `alchm-463017`. |

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
validated locally, verified by GitHub Navigation E2E run `26996367445`,
deployed to Firebase Functions and Firestore rules, and promoted to Vercel
production deployment `dpl_7Ha2hAsHqqhBtPHa2q6XhGMqySEd`.
Final certification remains blocked because provider-secret binding is not
proven, no verifier-issued runtime attestation receipt is available, and native
archive, RevenueCat dashboard proof, and TestFlight entitlement proof remain
absent.

The executable runtime gate remains fail closed as described in
`docs/release/RUNTIME_ATTESTATION_MODEL.md`. The evidence collection contract
is expanded in `docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md` and enforced
as a fail-closed preflight by
`docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md`.
