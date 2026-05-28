# Container State Authority

This is an operational authority record for container continuity state. It is
not evidence that server transition capability has been deployed.

## Current Decision

Status: `PARTIAL SERVER AUTHORITY - CERTIFICATION BLOCKING`

Container records and active-container state carry continuity meaning. The
current source build permits owner reads of existing records and denies all
client-authored transitions. Authenticated callables implement activation of a
fixed sanctuary container catalog and monotonic day advancement for an already
active sanctuary container through server authority, but a fail-closed
runtime attestation gate keeps both unavailable while deployment and
authorization evidence are missing. Claimed environment values cannot enable
this source build. Signed receipt verification semantics now exist in source,
but no verifier is approved and no verified result is wired into the callable.
The current UI is also disabled. Session-link, completion, and
transformation transitions remain unavailable.

## Collections

| Path | Purpose | Current client authority | Required authority |
| --- | --- | --- | --- |
| `users/{uid}/containers/{id}` | Container instance and continuity state | Read only | Server for all mutations; gated sanctuary transitions implemented in source |
| `users/{uid}/containerState/active` | One-active-container pointer/status | Read only | Server for all mutations; gated sanctuary transitions implemented in source |

## Field Classification

| Field | Meaning | Classification | Current behavior |
| --- | --- | --- | --- |
| `userId`, `containerId`, `containerName`, `tier`, `startedAt` | Instance identity and start provenance | Server-authoritative | Sanctuary activation implementation exists in source; server runtime gate remains disabled |
| `status`, `completedAt` | Lifecycle transition | Server-authoritative | Mutation unavailable |
| `currentDay` | Bounded sanctuary day position | Server-authoritative | Sanctuary advancement implemented in source with version/replay and pointer/version checks; runtime attestation gate remains disabled |
| `lastEntryAt`, `sessionIds` | Reflective continuity and session linkage | Server-authoritative | Mutation unavailable; read does not establish linkage |
| `carryForward`, `leavingBehind` | User-authored ceremony content attached to a completion | Server-authoritative persistence once a verified completion path exists | Mutation unavailable |
| `completionCeremonyViewed` | Ceremony-related state | Unknown pending product decision | Mutation unavailable |
| `containerState/active.userContainerId`, `status` | Active container invariant | Server-authoritative | Mutation unavailable |

No remote client-writeable container field is approved in this build. Local
rendering state is outside this Firestore authority contract.

## Required Transition Contract

The implemented sanctuary activation transition:

- Is guarded by a fail-closed runtime attestation gate.
- Requires authenticated user context.
- Admits only the server-owned sanctuary catalog and rejects transformation
  activation without server entitlement authority.
- Enforces one active container per user transactionally.
- Writes `transitionedBy: "server"`, `transitionSource`,
  `schemaVersion`, `transitionVersion`, `continuityVersion`, and
  `validatedAt`.
- Does not accept writing, reflection, session linkage, or progression input.

The implemented sanctuary advancement transition:

- Is guarded by a fail-closed runtime attestation gate.
- Requires authenticated user context and a server-written active sanctuary container.
- Requires the caller to present the current `continuityVersion`.
- Verifies container and active-pointer versions transactionally and rejects
  pointer/transition-version divergence.
- Advances one authored day only, with server provenance and prior/new version values.
- Rejects stale/replayed, terminal-day, transformation, and mismatched active-state requests.
- Does not accept journal writing or session linkage.

Any future linkage, completion, or transformation transition must:

- Require authenticated user context.
- Establish server-side entitlement authority before opening paid containers.
- Enforce one active container per user.
- Validate allowed lifecycle transitions.
- Validate session linkage against a server-written canonical session owned by
  the authenticated user.
- Write provenance including `transitionedBy: "server"`,
  `transitionSource`, `schemaVersion`, `transitionVersion`, and `validatedAt`.
- Avoid interpreting or logging journal writing.

## Certification Requirements

- Firestore emulator evidence must prove owner reads and denial of all client
  container mutations.
- Any enabled server transition must have unit and emulator coverage.
- The deployed function and deployed rules must be attributable to the same
  clean candidate SHA.
- RB-017 remains open until enabled continuity behavior is server-authoritative
  or the unavailable state is approved as the release contract with evidence.

Detailed transition and replay requirements are maintained in
`docs/release/REFLECTIVE_CONTINUITY_TRANSITIONS.md` and
`docs/release/CONTINUITY_VERSIONING_AND_REPLAY.md`.
