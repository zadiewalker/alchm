# Deployment Lineage Verification

## Status

`WEB/FIREBASE LINEAGE RECORDED - NATIVE LINEAGE REQUIRED`

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
| Firebase Functions | Deployed to project `alchm-463017` by `zadiewalker@gmail.com` on 2026-06-02 | Candidate `16e3a5d19ceee278957a413fb01b69178dca97cf`; local callable/scheduled functions `ACTIVE` with hash `844a2fd3b1f71300511f93fc8ad121b4022ed1cb`; `healthCheck` `ACTIVE` Gen 2 hash `245c06b5cc9c46a4d8447cfd61b332f45af470a4`; preserved legacy `crisisDetection` `ACTIVE` Gen 2 hash `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Firestore rules | Rules deployed to project `alchm-463017` by `zadiewalker@gmail.com` on 2026-06-02 | Candidate `16e3a5d19ceee278957a413fb01b69178dca97cf`; emulator result `CANDIDATE_BOUND_PASS`; rules digest `e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6` |
| Hosting | Firebase Hosting is retained as redirect edge to Vercel | Deployed redirect configuration identity and rollback target |
| Vercel/static export | Vercel production deployment `dpl_B8FUdpb8N3CbwsTzZ79ZBQ6Ev4vh` is `Ready` | URL `https://alchm-oz7m9ozjg-zadie-walkers-projects.vercel.app`; actor `zadiewalker`; created Tue Jun 02 2026 03:07:27 CDT; deployed from clean `git archive` snapshot of candidate `16e3a5d19ceee278957a413fb01b69178dca97cf` using Vercel CLI `54.7.1` |
| Provider secret | Khepera reads `ANTHROPIC_API_KEY` server-side | Redacted lineage digest `ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a` bound to candidate `16e3a5d19ceee278957a413fb01b69178dca97cf`; no secret value stored |
| Native runtime | Capacitor and generated iOS identifiers are reconciled to `com.alchm.sanctuary` | Sync evidence, archive identity, and RevenueCat entitlement evidence tied to SHA |
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
contract. Native release remains blocked until the archive and RevenueCat
evidence are bound to the same candidate.
