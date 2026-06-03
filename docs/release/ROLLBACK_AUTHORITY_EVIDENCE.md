# Rollback Authority Evidence

## Status

`STALE FOR NEW CANDIDATE fcf06d42757136c1693afb3c1447d80df7d32ce6`

This record preserves rollback authority for the previous candidate evidence
set. It is not valid rollback evidence for new candidate
`fcf06d42757136c1693afb3c1447d80df7d32ce6` until deployment targets are rebuilt
or explicitly verified for that candidate.

## Candidate Binding

| Field | Evidence |
| --- | --- |
| Historical candidate SHA | `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| New authoritative candidate SHA | `fcf06d42757136c1693afb3c1447d80df7d32ce6` |
| Firebase project | `alchm-463017` |
| Vercel deployment target | `dpl_B8FUdpb8N3CbwsTzZ79ZBQ6Ev4vh` |
| Firebase Functions local-source hash | `844a2fd3b1f71300511f93fc8ad121b4022ed1cb` |
| Firebase healthCheck hash | `245c06b5cc9c46a4d8447cfd61b332f45af470a4` |
| Preserved crisisDetection hash | `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Firestore rules target digest | `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6` |
| Provider secret lineage digest | `ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a` |

## Rollback Coverage

| Surface | Rollback authority |
| --- | --- |
| Vercel production | Promote or restore production to `dpl_B8FUdpb8N3CbwsTzZ79ZBQ6Ev4vh`. |
| Firestore rules | Re-deploy rules whose SHA-256 digest is `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`. |
| Firebase Functions | Stale for new candidate; deploy `fcf06d42757136c1693afb3c1447d80df7d32ce6` explicit local function targets to project `alchm-463017`; preserve legacy `crisisDetection` unless release authority separately approves deletion. |
| Provider secret | Any provider-secret rotation invalidates receipts not bound to lineage digest `ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a`. |
| Runtime receipt | Any rollback, new deployment, provider-secret rotation, or verifier change requires a new receipt ID and invalidates prior unconsumed receipts. |
| Verifier | Revoke verifier `alchm-release-owner-2026-05` by setting `revokedAt` in `docs/release/trusted-runtime-verifiers.json` and issuing a replacement verifier record. |

## Rollback Owner

`zadiewalker-release-authority`

## Rollback Commands

```bash
vercel rollback dpl_B8FUdpb8N3CbwsTzZ79ZBQ6Ev4vh
firebase deploy --only firestore:rules --project alchm-463017
firebase deploy --only functions:activateContainer,functions:advanceSanctuaryContainer,functions:cancelAccountDeletion,functions:checkConsentExpiry,functions:cleanupOldUsageData,functions:detectAuditAnomalies,functions:enforceDataRetentionPolicies,functions:enforceUserDataRetention,functions:exportUserData,functions:generateComplianceAuditReport,functions:generateKheperaReflection,functions:getDataRetentionStats,functions:getUserAuditTrail,functions:getUserConsentHistory,functions:healthCheck,functions:processAccountDeletions,functions:processBudgetAlert,functions:regrantConsent,functions:requestAccountDeletion,functions:trackDailyCosts,functions:updateDataRetentionPreferences,functions:verifyAccountDeletion,functions:withdrawConsent --project alchm-463017
npm run check:runtime-attestation
npm run check:release-trust
```

## Invalidation Rule

Rollback authority is candidate-bound. A changed candidate SHA, Vercel
deployment, Firestore rules digest, Functions hash, provider-secret lineage
digest, verifier key, or receipt payload invalidates this rollback record and
requires a new runtime attestation receipt.
