# Deployment Lineage Verification

## Status

`SAME-SHA DEPLOYMENT EVIDENCE RECORDED - ATTESTATION ISSUED`

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
| Firebase Functions | Targeted deployment to project `alchm-463017` on 2026-06-05 | `generateKheperaReflection` was redeployed for candidate `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f`; candidate `f9c925d707263479953d271eadef69339a5a41bb` does not change Functions source or Firebase deployment configuration. Existing deployed hash remains `4f7568b4d268d26b06f6d6725982ed3c02fdbd33` with `secretEnvironmentVariables` key `ANTHROPIC_API_KEY`. |
| Firestore rules | Rules deployment to project `alchm-463017` on 2026-06-05 | Production CLI reported `firestore.rules` compiled successfully and released to `cloud.firestore`; rules digest `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`; direct product-candidate emulator evidence passed for candidate `f9c925d707263479953d271eadef69339a5a41bb` with tests=6 pass=6 |
| Hosting | Firebase Hosting is retained as redirect edge to Vercel | Deployed redirect configuration identity and rollback target |
| Vercel/static export | Vercel production deployment `dpl_GbFxz3jiBzFJWZvaKxvwBzKfJnbW` is `Ready` | Deployment URL `https://alchm-ll4ydqqlv-zadie-walkers-projects.vercel.app`; aliases include `https://alchm.vercel.app`; production build logs show branch `release/clinical-architecture-integration`, commit `f9c925d`; promoted from ready preview deployment `dpl_5ztQTAGwsag25FMesMM7grG7dPqM` |
| Provider secret | Khepera reads `ANTHROPIC_API_KEY` server-side | Verified: Firebase secret access succeeds without printing the value, deployed `generateKheperaReflection` metadata shows `secretEnvironmentVariables` key `ANTHROPIC_API_KEY`, and source binds the secret with `functions.runWith({ secrets: ["ANTHROPIC_API_KEY"] })` |
| Local repository validation | Candidate `f9c925d707263479953d271eadef69339a5a41bb` validated locally | Passed `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm --prefix functions run build`, `npm --prefix functions run lint`, `npx cap sync ios`, `npm run check:khepera-gateway`, `npm run check:container-transitions`, `npm run check:sensitive-write-authority`, `npm run check:firestore-emulator-evidence`, and `git diff --check` with clean pre-evidence worktree |
| GitHub checks | Required Navigation E2E workflow ran for candidate `f9c925d707263479953d271eadef69339a5a41bb` | Run `27169434088` completed successfully for exact SHA `f9c925d707263479953d271eadef69339a5a41bb`; run URL `https://github.com/zadiewalker/alchm/actions/runs/27169434088` |
| Native runtime | Capacitor and generated iOS identifiers are reconciled to `com.alchm.sanctuary` | Same-SHA archive `/tmp/alchm-return-flow-candidate.xcarchive` succeeded for candidate `f9c925d707263479953d271eadef69339a5a41bb`; distribution signing proof, TestFlight upload proof, and RevenueCat entitlement purchase/restore proof remain absent |
| RevenueCat | Official native plugin and subscription source exist | Archive contains `RevenuecatPurchasesCapacitor.framework`, `PurchasesHybridCommon.framework`, and `RevenueCat.framework`; runtime entitlement verification remains blocked on external RevenueCat/TestFlight proof |

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
`PENDING_NEW_RECEIPT_FOR_RETURN_FLOW_CANDIDATE` is recorded for
`f9c925d707263479953d271eadef69339a5a41bb`. Final certification remains
blocked by native RevenueCat/TestFlight entitlement evidence while
`iosArchiveSameSha` is false.
