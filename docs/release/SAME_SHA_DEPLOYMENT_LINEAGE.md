# Same-SHA Deployment Lineage

## Status

`RECORDED FOR CANDIDATE 16e3a5d19ceee278957a413fb01b69178dca97cf - NATIVE EVIDENCE STILL REQUIRED`

This record states the evidence required to connect reflective provenance in
source to an actually deployed runtime. It does not authorize deployment and
does not accept source files as deployment evidence.

## Required Lineage Chain

| Authority | Required evidence for one fixed SHA | Current evidence |
| --- | --- | --- |
| Candidate source | Clean reviewed commit SHA and normalized release scope | `16e3a5d19ceee278957a413fb01b69178dca97cf`; `git status --short --branch` clean before evidence regeneration |
| CI validation | Green required checks for that identical SHA | Repository validation remains recorded in `docs/release/release-certification-checklist.json`; final `npm run validate` required after evidence-tail commit |
| Functions | Deployed Khepera and continuity callable identities attributable to SHA | Firebase project `alchm-463017`; actor `zadiewalker@gmail.com`; deploy completed 2026-06-02; local callable/scheduled functions `ACTIVE` with hash `844a2fd3b1f71300511f93fc8ad121b4022ed1cb`; `healthCheck` `ACTIVE` Gen 2 hash `245c06b5cc9c46a4d8447cfd61b332f45af470a4` generation `1780375038812683`; preserved legacy `crisisDetection` `ACTIVE` Gen 2 hash `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` generation `1780027273287952`; candidate source snapshot `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| Firestore rules | Deployed rules version attributable to SHA and emulator-tested candidate rules | Firebase project `alchm-463017`; actor `zadiewalker@gmail.com`; deployed 2026-06-02; rulesDigest=`e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6`; emulator evidence `CANDIDATE_BOUND_PASS` for `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| Provider secret | Presence of server-side provider secret in selected Functions environment, without exposing value | providerSecretLineageDigest=`ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a`; candidate=`16e3a5d19ceee278957a413fb01b69178dca97cf` |
| Hosting runtime | Vercel-hosted exported Next artifact; Firebase Hosting redirect edge only | Vercel production deployment `dpl_B8FUdpb8N3CbwsTzZ79ZBQ6Ev4vh`; URL `https://alchm-oz7m9ozjg-zadie-walkers-projects.vercel.app`; actor `zadiewalker`; created Tue Jun 02 2026 03:07:27 CDT; status `Ready`; deployed from clean `git archive` snapshot of `16e3a5d19ceee278957a413fb01b69178dca97cf` using Vercel CLI `54.7.1` |
| Native archive | Reconciled app identity, sync and archive evidence attributable to SHA | In scope; archive evidence unavailable |
| Rollback | Named prior deploy/archive authority and verified rollback procedure | `docs/release/ROLLBACK_AUTHORITY_EVIDENCE.md`; owner=`zadiewalker-release-authority`; target=`16e3a5d19ceee278957a413fb01b69178dca97cf` |

## Reflective Integrity Expectation

Source provenance fields such as `generatedBy`, `transitionedBy`,
`continuityVersion`, and `validatedAt` do not certify production behavior by
themselves. They count as runtime integrity evidence only when the function
and rules implementing them are deployed from, and traceable to, the same
clean candidate SHA.

## Certification Consequence

The web and Firebase deployment lineage chain is recorded for
`16e3a5d19ceee278957a413fb01b69178dca97cf`. ALCHM remains
`ATTESTED RELEASE CANDIDATE, NOT CERTIFIED` until native archive and
RevenueCat evidence close `iosArchiveSameSha`.

The executable runtime gate remains fail closed as described in
`docs/release/RUNTIME_ATTESTATION_MODEL.md`. The evidence collection contract
is expanded in `docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md` and enforced
as a fail-closed preflight by
`docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md`.
