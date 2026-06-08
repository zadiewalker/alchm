# Same-SHA Deployment Lineage

## Status

`DEPLOYMENT LINEAGE RECORDED - RUNTIME RECEIPT ISSUED`

This record states the evidence required to connect reflective provenance in
source to an actually deployed runtime. It does not authorize deployment and
does not accept source files as deployment evidence.

## Required Lineage Chain

| Authority | Required evidence for one fixed SHA | Current evidence |
| --- | --- | --- |
| Candidate source | Clean reviewed commit SHA and normalized release scope | New authoritative candidate is `ba21195ad0b7feff7e3cd8aeb7e04966ad8ccf30`; release scope check passes locally |
| CI validation | Green required checks for that identical SHA | Local validation suite passed for `ba21195ad0b7feff7e3cd8aeb7e04966ad8ccf30`; GitHub Navigation E2E run `27123588249` completed successfully for the exact same SHA |
| Functions | Deployed Khepera and continuity callable identities attributable to SHA | Functions source is unchanged from deployed candidate `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f`; `firebase functions:list --project alchm-463017 --json` previously reported `generateKheperaReflection(us-central1)` ACTIVE with hash `4f7568b4d268d26b06f6d6725982ed3c02fdbd33` and secretEnvironmentVariables key `ANTHROPIC_API_KEY`. |
| Firestore rules | Deployed rules version attributable to SHA and emulator-tested candidate rules | `firestore.rules` is unchanged in candidate `ba21195ad0b7feff7e3cd8aeb7e04966ad8ccf30`, digest is `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`, and direct product-candidate emulator evidence passed with tests=6 pass=6. |
| Provider secret | Presence of server-side provider secret in selected Functions environment, without exposing value | Verified. Secret access succeeds without printing the value, deployed `generateKheperaReflection` metadata shows `ANTHROPIC_API_KEY` under `secretEnvironmentVariables`, and source inspection shows `functions.runWith({ secrets: ["ANTHROPIC_API_KEY"] })`. |
| Hosting runtime | Vercel-hosted exported Next artifact; Firebase Hosting redirect edge only | Candidate preview `dpl_H22B7K11pihP2yX35L6AZrBhQAho` cloned commit `ba21195`; it was promoted to production deployment `dpl_AcCFEEPfBALMwWLsf783dmUf5E9E`, ready at `https://alchm-5v31jsisl-zadie-walkers-projects.vercel.app` with alias `https://alchm.vercel.app`. |
| Native archive | Reconciled app identity, sync and archive evidence attributable to SHA | Same-SHA local archive `/tmp/alchm-footer-submit-back-candidate.xcarchive` succeeded for candidate `ba21195ad0b7feff7e3cd8aeb7e04966ad8ccf30` with RevenueCat native frameworks present. Distribution signing proof, TestFlight upload proof, and RevenueCat entitlement purchase/restore proof remain absent. |
| Rollback | Named prior deploy/archive authority and verified rollback procedure | Current Vercel production deployment is `dpl_AcCFEEPfBALMwWLsf783dmUf5E9E`; previous production rollback target is `dpl_ED8GSN71szSE7TYq6pCLtAiDKA9A`; Firebase rollback remains targeted redeploy to project `alchm-463017`. |

## Reflective Integrity Expectation

Source provenance fields such as `generatedBy`, `transitionedBy`,
`continuityVersion`, and `validatedAt` do not certify production behavior by
themselves. They count as runtime integrity evidence only when the function
and rules implementing them are deployed from, and traceable to, the same
clean candidate SHA.

## Certification Consequence

The previous attested candidate `cf92af3579e9736665f2876a3a44c31032805a42` is
superseded by the queue/crisis reliability candidate
`7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`, which is superseded by the
Anthropic-bound Khepera candidate
`62d5a383e5404633dc5ab3d04e813b3cdeeedb4f`, which is superseded by the
footer submit navigation candidate
`ba21195ad0b7feff7e3cd8aeb7e04966ad8ccf30`. This candidate was pushed,
validated locally, verified by GitHub Navigation E2E run `27123588249`,
archived locally with RevenueCat native frameworks present, and promoted to
Vercel production deployment `dpl_AcCFEEPfBALMwWLsf783dmUf5E9E`.
Runtime attestation receipt
`prod-ba21195ad0b7-2026-06-08T08-23-18-117Z` is recorded for the candidate.
Final certification remains blocked because distribution signing/TestFlight upload proof, RevenueCat dashboard proof, and TestFlight entitlement proof remain absent.

The executable runtime gate remains fail closed as described in
`docs/release/RUNTIME_ATTESTATION_MODEL.md`. The evidence collection contract
is expanded in `docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md` and enforced
as a fail-closed preflight by
`docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md`.
