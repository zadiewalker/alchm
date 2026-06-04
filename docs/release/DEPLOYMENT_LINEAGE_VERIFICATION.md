# Deployment Lineage Verification

## Status

`SAME-SHA DEPLOYMENT EVIDENCE RECORDED`

This record identifies the same-SHA evidence that must connect source
provenance to deployed reflective behavior. It does not choose the deployment
topology or authorize deployment.

The executable evidence-register preflight and immutable candidate
expectations are specified in
`docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md`.
Signed receipt and digest binding semantics are specified in
`docs/release/EXECUTABLE_SAME_SHA_VERIFICATION.md`.

## Deployment Authorities

| Authority | Current observation | Required lineage evidence |
| --- | --- | --- |
| Firebase Functions | Targeted deployment to project `alchm-463017` by `zadiewalker@gmail.com` on 2026-06-04 | Deployed local-source functions without deleting legacy `crisisDetection`; `generateKheperaReflection` hash `ea67e160fcd9a01e3d8ea587d67a63bb207c2c3f`; container callables hash `b6ae89d0c7f968ce75e274cbcbc754b7ec7c9ca2`; v2 utility hash `76124a2dccc52dd8955508ccb60ba280ddf41a70`; `crisisDetection` remains ACTIVE with hash `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Firestore rules | Rules deployment to project `alchm-463017` by `zadiewalker@gmail.com` on 2026-06-04 | Local emulator result remains rules-equivalent for candidate `d255aded50d97a5325b56c7db431969249546f85`; production CLI reported rules compiled successfully and released to `cloud.firestore`; rules digest `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`; the candidate delta does not touch `firestore.rules` |
| Hosting | Firebase Hosting is retained as redirect edge to Vercel | Deployed redirect configuration identity and rollback target |
| Vercel/static export | Vercel production deployment `dpl_585R7gTNomY8BozMZ5z1WFThWHxD` is `Ready` | Deployment URL `https://alchm-c4mq20g29-zadie-walkers-projects.vercel.app`; aliases include `https://alchm.vercel.app`; Vercel status is attached to evidence-tail `8e08b691b1e6efe9f15a271b312960b0297e385d`, whose diff from product candidate is limited to `docs/release/` |
| Provider secret | Khepera reads `ANTHROPIC_API_KEY` server-side | Verified: deployed `generateKheperaReflection` metadata reports `ANTHROPIC_API_KEY`; runtime receipt binds checker-derived provider-secret lineage evidence digest |
| Local repository validation | Candidate `d255aded50d97a5325b56c7db431969249546f85` validated locally | Passed `npm run design:validate`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm --prefix functions run build`, `npm --prefix functions run lint`, `npx cap sync ios`, `npm run check:invariants`, `npm run check:firestore-rules`, `npm run check:integrity`, `npm run check:khepera-gateway`, `npm run check:container-transitions`, `npm run check:sensitive-write-authority`, `npm run e2e:navigation`, and `git diff --check`; completed `2026-06-04T18:31:17Z` with clean worktree |
| GitHub checks | Required Navigation E2E workflow ran for candidate `d255aded50d97a5325b56c7db431969249546f85` | Run `26965018822` completed successfully for exact SHA `d255aded50d97a5325b56c7db431969249546f85`; run URL `https://github.com/zadiewalker/alchm/actions/runs/26965018822` |
| Native runtime | Capacitor and generated iOS identifiers are reconciled to `com.alchm.sanctuary` | Historical local archive succeeded for pushed evidence-tail `fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a`; external RevenueCat dashboard and sandbox/TestFlight entitlement evidence tied to current candidate `d255aded50d97a5325b56c7db431969249546f85` remains required |
| RevenueCat | Native plugin and subscription source exist | Approved entitlement/runtime verification tied to native candidate |

## Candidate-Bound Verification Chain

The certification evidence chain must identify:

1. One clean reviewed commit SHA.
2. Required CI results for that identical SHA.
3. Functions and Firestore rules deployment records for that identical SHA.
4. Firestore emulator authorization output produced from that candidate's
   rules and tests.
5. Hosting and native artifacts, if in release scope, linked to that SHA.
6. Provider-secret presence and rollback authority attached to the selected
   deployment authority.

Record provenance fields such as `generatedBy`, `transitionedBy`, and
`continuityVersion` are not same-SHA runtime evidence.

## Runtime Enablement Consequence

Continuity transition exposure must remain denied while any lineage element is
absent, conflicting, or only asserted through environment configuration.
`docs/release/RUNTIME_ATTESTATION_MODEL.md` defines that fail-closed runtime
contract. Runtime attestation has been reissued for
`d255aded50d97a5325b56c7db431969249546f85`. Final certification remains
blocked by native RevenueCat/TestFlight entitlement evidence while
`iosArchiveSameSha` is false.
