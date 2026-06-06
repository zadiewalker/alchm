# Deployment Lineage Verification

## Status

`SAME-SHA DEPLOYMENT EVIDENCE RECORDED - ATTESTATION BLOCKED`

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
| Firebase Functions | Targeted deployment to project `alchm-463017` on 2026-06-05 | `generateKheperaReflection` was redeployed for candidate `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f`; `firebase functions:list --project alchm-463017 --json` reports it ACTIVE with hash `4f7568b4d268d26b06f6d6725982ed3c02fdbd33` and `secretEnvironmentVariables` key `ANTHROPIC_API_KEY`; container callables remain ACTIVE with hash `b6ae89d0c7f968ce75e274cbcbc754b7ec7c9ca2`; v2 utility hash `76124a2dccc52dd8955508ccb60ba280ddf41a70`; `crisisDetection` remains ACTIVE with hash `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Firestore rules | Rules deployment to project `alchm-463017` on 2026-06-05 | Production CLI reported `firestore.rules` compiled successfully and released to `cloud.firestore`; rules digest `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`; direct product-candidate emulator evidence passed for candidate `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f` with tests=6 pass=6 |
| Hosting | Firebase Hosting is retained as redirect edge to Vercel | Deployed redirect configuration identity and rollback target |
| Vercel/static export | Vercel production deployment `dpl_6smNjSnhdYGHNEWAqevVSfVEegYD` is `Ready` | Deployment URL `https://alchm-a5ah86lfn-zadie-walkers-projects.vercel.app`; aliases include `https://alchm.vercel.app`; production build logs show branch `release/clinical-architecture-integration`, commit `62d5a38`; promoted from ready preview deployment `dpl_CyiCwBSoKqQrQRnfG7e3vUfiCpKq` |
| Provider secret | Khepera reads `ANTHROPIC_API_KEY` server-side | Verified: Firebase secret access succeeds without printing the value, deployed `generateKheperaReflection` metadata shows `secretEnvironmentVariables` key `ANTHROPIC_API_KEY`, and source binds the secret with `functions.runWith({ secrets: ["ANTHROPIC_API_KEY"] })` |
| Local repository validation | Candidate `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f` validated locally | Passed `npm --prefix functions run build`, `npm --prefix functions run lint`, `npm run check:khepera-gateway`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run check:firestore-emulator-evidence`, `npm run check:release-scope`, and `git diff --check` with clean pre-evidence worktree |
| GitHub checks | Required Navigation E2E workflow ran for candidate `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f` | Run `26997610335` completed successfully for exact SHA `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f`; run URL `https://github.com/zadiewalker/alchm/actions/runs/26997610335` |
| Native runtime | Capacitor and generated iOS identifiers are reconciled to `com.alchm.sanctuary` | Prior `npx cap sync ios` evidence exists for candidate `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`; no same-SHA archive, distribution signing proof, RevenueCat dashboard proof, or TestFlight entitlement proof is recorded for candidate `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f` |
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
contract. Runtime attestation receipt
`prod-62d5a383e540-2026-06-06T16-13-52-665Z` is recorded for
`62d5a383e5404633dc5ab3d04e813b3cdeeedb4f`. Final certification remains
blocked by native RevenueCat/TestFlight entitlement evidence while
`iosArchiveSameSha` is false.
