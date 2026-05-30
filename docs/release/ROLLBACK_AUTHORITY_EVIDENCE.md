# Rollback Authority Evidence

## Status

`RECORDED FOR CANDIDATE 31ba4820fc5c53bdf84e33e941675011c51aa824`

This record identifies the rollback authority for the current production
candidate evidence set. It does not expose secrets and does not authorize any
runtime continuity behavior outside the signed attestation gate.

## Candidate Binding

| Field | Evidence |
| --- | --- |
| Candidate SHA | `31ba4820fc5c53bdf84e33e941675011c51aa824` |
| Firebase project | `alchm-463017` |
| Vercel deployment target | `dpl_5wnejochTEuHLBMcSUcqL2dUcK2C` |
| Firebase Functions target hash | `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Firestore rules target digest | `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6` |
| Provider secret lineage digest | `ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a` |

## Rollback Coverage

| Surface | Rollback authority |
| --- | --- |
| Vercel production | Promote or restore production to `dpl_5wnejochTEuHLBMcSUcqL2dUcK2C`. |
| Firestore rules | Re-deploy rules whose SHA-256 digest is `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`. |
| Firebase Functions | Re-deploy Functions source matching hash `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` to project `alchm-463017`. |
| Provider secret | Any provider-secret rotation invalidates receipts not bound to lineage digest `ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a`. |
| Runtime receipt | Any rollback, new deployment, provider-secret rotation, or verifier change requires a new receipt ID and invalidates prior unconsumed receipts. |
| Verifier | Revoke verifier `alchm-release-owner-2026-05` by setting `revokedAt` in `docs/release/trusted-runtime-verifiers.json` and issuing a replacement verifier record. |

## Rollback Owner

`zadiewalker-release-authority`

## Rollback Commands

```bash
vercel rollback dpl_5wnejochTEuHLBMcSUcqL2dUcK2C
firebase deploy --only firestore:rules --project alchm-463017
firebase deploy --only functions --project alchm-463017
npm run check:runtime-attestation
npm run check:release-trust
```

## Invalidation Rule

Rollback authority is candidate-bound. A changed candidate SHA, Vercel
deployment, Firestore rules digest, Functions hash, provider-secret lineage
digest, verifier key, or receipt payload invalidates this rollback record and
requires a new runtime attestation receipt.
