# ALCHM Release Blockers

This register records trust-sensitive blockers until objective evidence closes
them. An item marked fail-closed may reduce active exposure; it does not make
the feature production-certified.

| ID | Blocker | Severity / area | Status | Why it matters | Evidence required to close | Review type | Fails closed now |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RB-001 | Dirty integration worktree and unfixed candidate SHA | Critical / release identity | Open | No local result can be attributed to a releasable commit while material source changes remain outside HEAD. | Intentional candidate commit, clean authoritative checkout, fixed full SHA. | Engineering / founder | No |
| RB-002 | Generated, duplicate backend, copied native, and asset trees are unreviewed | High / release scope | Open | `functions/lib/functions/`, `functions/functions/src/`, `ios/App 2/`, and other untracked trees can create false authority or accidental inclusion. | Explicit inclusion/exclusion decision and clean candidate scope. | Engineering / infrastructure | No |
| RB-003 | Khepera callable deployment and server provider secret not verified | Critical / AI authority | Open | Source contains a safe gateway, but production reflection cannot be restored without deployed server authority and configured secret. | Same-SHA Functions deployment record and server secret-presence verification without secret disclosure. | Infrastructure / security | Yes, client paths fail closed unless gateway is available |
| RB-004 | Firestore rules deployment and candidate-bound emulator authorization evidence absent | High / emotional data access | Open | An emulator suite now exists, but this machine lacks the Java runtime required to execute Firebase emulators; a dirty-tree run would not establish candidate or deployment authority in any case. | Java-enabled test environment, passing emulator-backed authorization suite from a clean fixed candidate, and same-SHA rules deployment. | Security / infrastructure | Partially: source default-deny exists |
| RB-005 | Secure data export delivery and continuity coverage unavailable | Critical / privacy rights | Open | Canonical session and legacy journal mapping exists, but continuity/provenance records are not yet collected for export and raw writing must not be exported through placeholder or insecure delivery. | Add canonical continuity/provenance export coverage, implement secure delivery, verify with emulator/deployed evidence, and obtain policy/legal review. | Privacy / legal / infrastructure | Yes |
| RB-006 | Verified account deletion workflow unavailable | Critical / privacy rights | Open | Settings and policy must not imply erasure without verified processing and device-local limitation handling. | Verified request delivery, canonical deletion tests, deployment evidence, and approved claim text. | Privacy / legal / infrastructure | Yes |
| RB-007 | Retention automation and deletion policy unapproved | High / privacy and clinical trust | Open | Silent deletion or inactivity behavior would be trust-breaking without approved policy and user control. | Approved retention policy, user control evidence, tests, and deployed configuration. | Product / legal / clinical | Yes |
| RB-008 | Live support uses email preparation; dormant Firestore ticket path remains in source | Medium / support authority | Open | The live page is bounded, but dormant persistence must not be mistaken for deployed secure support delivery. | Remove/quarantine unused write path or implement a reviewed secured backend path with rules/tests. | Product / security | Live path is bounded |
| RB-009 | Transparency reporting has no verified reporting authority | Medium / public claims | Open | Publishing sample or unaudited metrics would mislead users. | Reviewed data source, reporting method, and deployed evidence. | Founder / legal | Yes, page states unavailable |
| RB-010 | Firebase/Vercel hosting and routing authority is unresolved | High / deployment identity | Open | `firebase.json` redirects to Vercel while deployment documentation describes server mode and Capacitor can use bundled or server modes. | Resolve `DEPLOYMENT_AUTHORITY_DECISION.md`, align retained configs, and capture same-SHA deployment evidence. | Infrastructure / founder | No |
| RB-011 | Capacitor/native source drift and no iOS archive evidence | High / native release | Open | `capacitor.config.ts` and `ios/App/App/capacitor.config.json` disagree, and duplicate native trees exist. | Resolve `NATIVE_AUTHORITY_DECISION.md`, synchronize approved native source, and capture archive evidence for SHA. | Infrastructure / product | No |
| RB-012 | Same-SHA GitHub checks unavailable | High / change control | Open | Local results cannot substitute for reviewed CI on the candidate commit. | Green required GitHub checks for the fixed pushed SHA. | Engineering | No |
| RB-013 | Functions lint results require remediation after command repair | Medium / validation | Open | The command/configuration boundary has been corrected; on 2026-05-26 the focused Tier 1 command reported 284 violations and full Functions lint reported 1,637 violations in the dirty integration tree. | Passing `npm run check:functions-trust-lint` and either passing full Functions lint or an approved deployed-source scope decision on the fixed candidate. | Engineering / security | No |
| RB-014 | Account deletion client callable name is not exported by Functions entrypoint | High / account lifecycle | Open | `src/services/auth/authService.ts` calls `deleteAccountNow`, but `functions/src/index.ts` does not export it; a presented delete action could fail or imply unavailable erasure. | Remove/disable live action or wire a verified fail-closed deletion workflow with tests. | Product / privacy / engineering | Needs flow confirmation |
| RB-015 | Legacy operational documentation asserts unverified/dependency-framed guarantees | Medium / institutional trust | Open | `ENFORCEMENT_DEPLOYED.md` uses claims such as healing and guaranteed deployment that conflict with evidence-gated release practice. | Quarantine or revise after founder review; do not use it as release evidence. | Founder / product | No |
| RB-016 | Emulator tooling dependency audit reports vulnerabilities | Medium / test infrastructure | Open | Adding pinned Firebase emulator tooling makes authorization testing reproducible, but `npm install` reports high and critical transitive vulnerabilities that require review before candidate acceptance. | Review `npm audit` results and upgrade or accept documented dev-tool exposure without weakening the emulator gate. | Security / infrastructure | Not applicable |
| RB-017 | Sensitive reflective persistence and continuity authority lack runtime evidence and completion | High / clinical data authority | Partial server implementation / open | Immediate generated sessions are server-written with provenance. Authenticated sanctuary activation and versioned sanctuary day advancement are server-owned implementations with transactional one-active, stale-replay, and pointer-version divergence enforcement, but a fail-closed runtime attestation gate and the disabled UI prevent use. Source now validates signed, SHA-bound, evidence-bound, deployment-bound, expiring, replay-rejected receipt semantics and rejects duplicate, expired, revoked, or self-attested verifier trust; no verifier is approved and the callable has no verifier adapter. Client sensitive writes are denied; linkage, completion, delayed continuity, and transformation transitions remain unavailable. No emulator/deployment evidence proves this boundary for a fixed SHA. | Approve the unavailable release behavior or implement an approved runtime attestation adapter only after `npm run check:runtime-attestation`, receipt-verifier tests, unit/emulator evidence, and same-SHA deployment evidence pass for a clean candidate; verify deployed gateway/transition functions/rules for that SHA; `npm run check:sensitive-write-authority` and `npm run check:container-transitions` must pass. | Clinical / security / architecture / product | Yes: runtime gate denies continuity transitions and unsupported mutations fail closed in inspected source |

## Firestore Emulator Evidence Gap

`firebase.json` declares Firestore and Auth emulators. The repository now
contains a rules-unit-testing harness and a pinned Firebase CLI dependency so
the authorization suite can be run consistently. Execution currently stops
before tests run because no Java runtime is available on this machine. Until
that prerequisite is met, the suite passes from a clean fixed candidate, and
the same rules are verified deployed, the Firestore rules are not
authorization-certified.

Required suite coverage:

- Owner allow and cross-user deny for canonical sessions, memory, delayed
  reflections, containers, active container state, and profiles.
- Rejection of raw writing in Khepera memory and ownership mutation.
- Denial of unsupported `support_tickets` writes.
- Administrative permissions do not read root user profile/settings records.
- Candidate treatment for client-written reflection-bearing session fields and
  container invariant enforcement.

## Generated and Duplicate Material Observed

Observed local paths requiring inclusion/exclusion review include
`functions/lib/functions/`, `functions/lib/src/`, `functions/functions/src/`,
`ios/App 2/`, `alchm-clean/`, `artifacts/`, backup trees, screenshots, and
duplicate suffixed output files. None are accepted as candidate artifacts by
this register.

The executable source-of-authority boundary is `npm run check:release-scope`,
defined by `docs/release/RELEASE_SCOPE.md`. It fails on known duplicate or
copied authority trees and does not delete them.

`npm run check:release-authority` provides non-mutating diagnostics for dirty
tree state, generated-but-non-authoritative output, native app identity drift,
and unresolved runtime authority. It must report no blockers before a clean
candidate is eligible for certification evidence collection.

## Authority Decisions Awaiting Review

- `docs/release/DEPLOYMENT_AUTHORITY_DECISION.md`: production runtime owner is
  unresolved and must be chosen before routing/config cleanup or deployment.
- `docs/release/NATIVE_AUTHORITY_DECISION.md`: application identifier and native
  source authority are unresolved; no sync/archive may count as evidence yet.
- `docs/release/FUNCTIONS_LINT_CLASSIFICATION.md`: Tier 1 backend lint is a
  distinct release-relevant gate; broad style cleanup is deliberately deferred.
- `docs/release/REFLECTIVE_CONTINUITY_TRANSITIONS.md`: sanctuary activation is
  implemented with versioned sanctuary day advancement only as source-level
  server transitions; release exposure and later continuity transitions remain
  evidence-gated.
- `docs/release/LONGITUDINAL_CONTINUITY_INVARIANTS.md` and
  `docs/release/CONTINUITY_VERSIONING_AND_REPLAY.md`: continuity invariants
  and replay semantics remain source contracts pending runtime evidence.
- `docs/release/SAME_SHA_DEPLOYMENT_LINEAGE.md`: runtime lineage is unresolved
  and must be proven before source provenance counts as production evidence.
- `docs/release/RUNTIME_ATTESTATION_MODEL.md` and
  `docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md`: environment assertions
  are not runtime evidence; the transition gate remains disabled.
- `docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md` and
  `docs/release/runtime-attestation-evidence.json`: an executable attestation
  preflight exists and intentionally records `NOT ATTESTED`; no receipt is
  available to the runtime gate.
- `docs/release/TRUSTED_VERIFIER_AUTHORITY_MODEL.md` and
  `docs/release/DEPLOYMENT_BOUND_ATTESTATION_MODEL.md`: verifier admission and
  deployment-bound receipt semantics are defined, but no verifier is approved
  and no deployment-bound receipt exists.
- `docs/release/LONGITUDINAL_SEMANTIC_AUTHORITY.md`: completion, rollback,
  transformation, linkage, and delayed semantic transitions remain unavailable.
- `docs/release/SEMANTIC_AUTHORITY_EXECUTION_MODEL.md`: bounded transition
  mechanics do not establish authority for unavailable meaning-bearing states.
