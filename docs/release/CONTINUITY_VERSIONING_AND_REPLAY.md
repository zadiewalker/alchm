# Continuity Versioning And Replay

This record defines the source contract for rejecting stale or repeated
container continuity transitions. It is not deployment evidence.

## Threats

- A stale client retries a transition after another transition has succeeded.
- Duplicate requests attempt to advance the same authored day more than once.
- A conflicting active-pointer record does not represent the container being
  advanced.
- A pointer carries a stale `transitionVersion` even when its continuity
  version appears current.
- Offline or copied client state attempts to author continuity directly.
- A future rollback silently rewrites the meaning of earlier continuity.

## Versioning Contract

| Field | Meaning | Rule |
| --- | --- | --- |
| `continuityVersion` | Monotonic version of the active continuity state | Initialized to `1` at activation and incremented exactly once per approved advancement |
| `previousContinuityVersion` | Version consumed by an advancement | Persisted on advancement for provenance |
| `transitionVersion` | Monotonic count of server transitions on the record | Initialized to `1`; incremented exactly once per advancement |
| `previousTransitionVersion` | Transition count consumed by an advancement | Persisted on advancement for provenance |
| `validatedAt` | Server validation timestamp | Stamped on every approved transition |

## Runtime Enforcement In Source

When its server release gate is intentionally enabled after evidence,
`advanceSanctuaryContainer` requires an authenticated caller and an
`expectedContinuityVersion`. In one Firestore transaction it reads the
canonical container and active pointer, requires both to describe the same
active state at the expected continuity and transition versions, validates that the server
catalog admits the sanctuary container, and advances exactly one day.

The transition rejects:

- missing authentication;
- malformed identifiers or versions;
- stale or repeated requests using an already-consumed expected version;
- mismatched active pointers;
- pointer/container transition-version divergence;
- terminal authored days;
- transformation or unknown containers;
- non-active records.

## Unavailable Semantics

- Session-linked advancement is not implemented.
- Completion and rollback are not implemented.
- Transformation continuity is not implemented.
- The callable runtime attestation gate and the UI remain disabled until
  evidence and exposure decisions exist. Environment assertions cannot enable
  this source build. The receipt verifier rejects consumed receipts, but no
  approved verifier or verified receipt adapter is wired into the callable.

## Evidence Required

Unit checks establish source intent only. Certification requires emulator
authorization tests and deployed Functions/rules evidence for a clean,
fixed candidate SHA, with the same version contract.
