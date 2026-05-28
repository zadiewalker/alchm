# ALCHM Release Certification

This record is an evidence register, not a release approval. A release decision
must be tied to one committed SHA and the same SHA in each required authority.

## Current Certification State

| Field | Current value |
| --- | --- |
| Status | `NOT CERTIFIED` |
| Authority branch inspected | `release/clinical-architecture-integration` |
| Inspected HEAD on 2026-05-27 | `d3106eefc9a63ff72198bba8cb9bb5c6890fb9a4` |
| Release candidate SHA | Not fixed: the worktree contains material integration changes beyond inspected HEAD |
| Worktree | Dirty and not suitable for release certification |
| Blocker register | `docs/release/RELEASE_BLOCKERS.md` |
| Machine-readable state | `docs/release/release-certification-checklist.json` |
| Release scope contract | `docs/release/RELEASE_SCOPE.md` |
| Deployment decision record | `docs/release/DEPLOYMENT_AUTHORITY_DECISION.md` - unresolved |
| Native decision record | `docs/release/NATIVE_AUTHORITY_DECISION.md` - unresolved |
| Functions lint classification | `docs/release/FUNCTIONS_LINT_CLASSIFICATION.md` |
| Continuity transition contract | `docs/release/REFLECTIVE_CONTINUITY_TRANSITIONS.md` - partial server implementation, not certified |
| Longitudinal/replay contracts | `docs/release/LONGITUDINAL_CONTINUITY_INVARIANTS.md` and `docs/release/CONTINUITY_VERSIONING_AND_REPLAY.md` - source-only |
| Same-SHA runtime lineage | `docs/release/SAME_SHA_DEPLOYMENT_LINEAGE.md` - unresolved |
| Runtime attestation | `docs/release/RUNTIME_ATTESTATION_MODEL.md` - fail closed, unavailable |
| Runtime attestation evidence register | `docs/release/runtime-attestation-evidence.json` - `NOT ATTESTED` |
| Trusted runtime verifier registry | `docs/release/trusted-runtime-verifiers.json` - no approved verifier |
| Candidate-bound lineage verification | `docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md` - executable gate, failing until evidence exists |
| Executable runtime verifier model | `docs/release/EXECUTABLE_RUNTIME_VERIFIER_MODEL.md` - contract present, no approved receipt issuer |
| Executable same-SHA verification | `docs/release/EXECUTABLE_SAME_SHA_VERIFICATION.md` - structural validation only |
| Trusted verifier authority | `docs/release/TRUSTED_VERIFIER_AUTHORITY_MODEL.md` - governance contract present, no verifier approved |
| Deployment-bound attestation | `docs/release/DEPLOYMENT_BOUND_ATTESTATION_MODEL.md` - receipt binding contract present, no deployment lineage |
| Deployment lineage verification | `docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md` - unresolved |
| Longitudinal semantic authority | `docs/release/LONGITUDINAL_SEMANTIC_AUTHORITY.md` - unresolved transitions unavailable |
| Semantic execution model | `docs/release/SEMANTIC_AUTHORITY_EXECUTION_MODEL.md` - unsupported semantics fail closed |

The current worktree includes trust-infrastructure implementation that is not
part of the inspected HEAD. Local checks may validate the working tree, but
they do not certify `d3106eefc9a63ff72198bba8cb9bb5c6890fb9a4` or any
future candidate until that candidate is committed and fixed.

## Required Evidence Matrix

| Gate | Required evidence for one candidate SHA | Present now |
| --- | --- | --- |
| Candidate identity | Full committed SHA fixed before validation | No |
| Worktree isolation | Clean authoritative checkout for that SHA | No |
| Release scope | No duplicate/copied authority trees in candidate checkout | No |
| Deployment authority | One approved Firebase/Vercel/Capacitor runtime path | No |
| Native configuration | Reconciled Capacitor source/generated app identity | No |
| Trust-critical Functions lint | Focused Tier 1 backend lint gate passes for the SHA | No |
| Repository validation | Passing declared validation output attached to that SHA | Not yet captured for a fixed candidate |
| Clinical/architecture guards | Integrity, rules, and Khepera gateway checks for same SHA | Not yet captured for a fixed candidate |
| Firestore authorization | Emulator-backed allow/deny tests passing on candidate rules | No |
| Sensitive write authority | Reflection-bearing session and invariant-sensitive container writes are server-authoritative or explicitly approved with tested limits | Source boundary only; not runtime-attested |
| Runtime continuity attestation | Attestation-gated continuity exposure tied to same-SHA evidence, trusted verifier governance, deployment-bound evidence, and verifier-issued signed receipt | No; evidence register is `NOT ATTESTED`, verifier registry is empty, no deployment-bound receipt exists, and runtime transition gate denies exposure |
| Continuity privacy coverage | Continuity/provenance export and deletion verified | No; secure export unavailable |
| GitHub authority | Required checks green on the same pushed SHA | No evidence collected |
| Firebase functions | Deployed callable identity and provider secret configuration tied to same SHA | No evidence collected |
| Firebase rules | Deployed Firestore/storage rules tied to same SHA | No evidence collected |
| Hosting/runtime authority | Confirmed Firebase/Vercel authority and deployed build SHA | No evidence collected |
| Capacitor/iOS | Source/generated config reconciled and archive evidence tied to SHA | No |
| Privacy/support/transparency | Deployed surfaces match fail-closed source behavior | Source reviewed only |
| Rollback | Identified rollback build/deployment authority | No evidence collected |

## Current Source-Level Controls

The following controls are inspectable in the dirty integration tree but are
not production evidence:

- Khepera provider invocation is routed through the Firebase callable gateway,
  with authentication, server-side crisis re-check, response validation, and
  rate limiting in source.
- Export delivery, account deletion delivery/processing, and automatic
  retention enforcement fail closed in Functions source.
- User-facing transparency presents no unverified metrics.
- The live support page prepares a bounded email request rather than claiming
  persisted support delivery.
- Return notification scheduling is disabled in source.
- Firestore rules enumerate canonical sensitive collections and deny unmatched
  paths; emulator authorization evidence is not yet available.
- The server gateway now writes immediate generated sessions with source-level
  provenance and source rules deny client session, memory, and delayed
  reflection writes. Delayed output and memory updates are intentionally
  unavailable until server-owned paths exist. An authenticated server callable
  contains fixed-catalog sanctuary activation and versioned sanctuary
  day-advancement implementations with transactional one-active/stale-replay
  and pointer-version divergence enforcement and transition provenance, but a
  fail-closed runtime attestation gate and UI exposure remain disabled pending
  evidence. Environment assertions cannot enable that gate and no
  verifier-issued runtime receipt is provided. Linkage,
  completion, and transformation transitions remain unavailable; generated
  sessions do not persist unvalidated container
  linkage. There is no emulator or deployed same-SHA evidence. The
  sensitive-write authority evidence gate therefore remains open. See
  `docs/release/SENSITIVE_WRITE_AUTHORITY.md` and
  `docs/release/CONTAINER_STATE_AUTHORITY.md` and
  `docs/release/REFLECTIVE_CONTINUITY_TRANSITIONS.md` and
  `docs/release/LONGITUDINAL_CONTINUITY_INVARIANTS.md` and
  `docs/release/RUNTIME_ATTESTATION_MODEL.md`.
- Focused trust-critical Functions lint executes and reports 284 violations
  in existing authority files in this dirty integration tree; full Functions
  lint reports 2,583 violations after expanded unreviewed Functions source is
  included. Neither broader command is candidate-bound passing evidence.

## Validation Commands

Run these only after fixing a candidate SHA and from its clean authoritative
checkout:

```bash
git status --short --branch
git rev-parse HEAD
git diff --check
npm run check:release-trust
npm run check:release-scope
npm run check:release-authority
npm run check:runtime-attestation
npm run check:sensitive-write-authority
npm run check:functions-trust-lint
npm run typecheck
npm run check:integrity
npm run check:firestore-rules
npm run check:khepera-gateway
npm run check:container-transitions
npm test
npm run validate
npm --prefix functions run build
npm run check:firestore-emulator-evidence
node scripts/check-release-trust-evidence.mjs --require-certified
```

`check:release-scope` is expected to fail in the integration worktree while
non-canonical authority trees remain present. `check:release-authority`
additionally reports dirty-tree state, generated paths as non-authoritative,
native app identity drift, and the unresolved Firebase/Vercel/static-export
runtime split. `check:runtime-attestation` is expected to fail until the
candidate-bound evidence register contains accepted external references for
one clean candidate SHA; it does not treat environment assertions as proof.
`check:firestore-emulator-evidence` now checks for its Java
runtime prerequisite before launching the emulator-backed authorization suite.
On this machine Java is unavailable; after that local prerequisite is met,
results must still be captured for a clean fixed candidate SHA before they
count as certification evidence.

## Deployment and Native Evidence To Capture

- Firebase project identifier and deployment record for Functions and rules.
- The configured server-side `ANTHROPIC_API_KEY` secret status, without
  recording the secret value.
- GitHub checks and reviewed commit lineage for the identical candidate SHA.
- The selected hosting/runtime authority, because the current documentation
  and Firebase redirects describe mixed Firebase/Vercel behavior.
- Capacitor sync and iOS archive evidence after resolving native config drift.
- Rollback target and deployment procedure.

No deployment, native sync, archive, or external certification was performed
by creation of this record.
