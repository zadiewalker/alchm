# Rollback Authority Evidence

## Status

`RECORDED FOR QUEUE CRISIS RELIABILITY CANDIDATE`

This record preserves rollback authority for the current candidate deployment
lineage.

## Candidate Binding

| Field | Evidence |
| --- | --- |
| Historical candidate SHA | `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| Authoritative candidate SHA | `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa` |
| Evidence-tail SHA | Runtime-attestation evidence commit containing this record |
| Firebase project | `alchm-463017` |
| Current Vercel production deployment | `dpl_7Ha2hAsHqqhBtPHa2q6XhGMqySEd` |
| Vercel rollback target | `dpl_CedM7rCY51RCDnrMNwcR8GDVdY7e` |
| Firebase generateKheperaReflection hash | `1dc3db804da29d30c9bae70ee4ae58d8e61cca68` |
| Firebase container callable hash | `b6ae89d0c7f968ce75e274cbcbc754b7ec7c9ca2` |
| Firebase healthCheck/v2 utility hash | `76124a2dccc52dd8955508ccb60ba280ddf41a70` |
| Preserved crisisDetection hash | `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Firestore rules target digest | `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6` |
| Provider secret lineage digest | Not recorded for current candidate |
| Provider secret deployment binding | `BLOCKED - deployed generateKheperaReflection metadata does not show ANTHROPIC_API_KEY` |

## Rollback Coverage

| Surface | Rollback authority |
| --- | --- |
| Vercel production | Current production is `dpl_7Ha2hAsHqqhBtPHa2q6XhGMqySEd`; rollback target is `dpl_CedM7rCY51RCDnrMNwcR8GDVdY7e`. |
| Firestore rules | Re-deploy rules whose SHA-256 digest is `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`. |
| Firebase Functions | Re-deploy explicit local function targets to project `alchm-463017`; preserve legacy `crisisDetection` unless release authority separately approves deletion. |
| Provider secret | Provider-secret binding is not verified for this candidate. Any future provider-secret configuration or rotation requires a new lineage digest and verifier receipt. |
| Runtime receipt | Any rollback, new deployment, provider-secret rotation, or verifier change requires a new receipt ID and invalidates prior unconsumed receipts. |
| Verifier | Revoke verifier `alchm-release-owner-2026-05` by setting `revokedAt` in `docs/release/trusted-runtime-verifiers.json` and issuing a replacement verifier record. |

## Rollback Owner

`zadiewalker-release-authority`

## Rollback Commands

```bash
vercel rollback dpl_CedM7rCY51RCDnrMNwcR8GDVdY7e
firebase deploy --only firestore:rules --project alchm-463017
firebase deploy --only functions:healthCheck,functions:exportUserData,functions:requestAccountDeletion,functions:verifyAccountDeletion,functions:cancelAccountDeletion,functions:processAccountDeletions,functions:enforceUserDataRetention,functions:updateDataRetentionPreferences,functions:getDataRetentionStats,functions:enforceDataRetentionPolicies,functions:withdrawConsent,functions:regrantConsent,functions:getUserConsentHistory,functions:checkConsentExpiry,functions:getUserAuditTrail,functions:generateComplianceAuditReport,functions:detectAuditAnomalies,functions:processBudgetAlert,functions:trackDailyCosts,functions:cleanupOldUsageData,functions:generateKheperaReflection,functions:activateContainer,functions:advanceSanctuaryContainer --project alchm-463017
npm run check:runtime-attestation
npm run check:release-trust
```

## Invalidation Rule

Rollback authority is candidate-bound. A changed candidate SHA, Vercel
deployment, Firestore rules digest, Functions hash, provider-secret lineage
digest, verifier key, or receipt payload invalidates this rollback record and
requires a new runtime attestation receipt.
