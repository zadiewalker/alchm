# Longitudinal Continuity Invariants

This record defines the integrity requirements for persisted container
continuity. It describes inspected source behavior only and does not approve
deployment or user-facing enablement.

## Current Status

Status: `PARTIAL SERVER AUTHORITY - CERTIFICATION BLOCKING`

Sanctuary activation and one-day sanctuary advancement exist behind
authenticated server callables in source. Both callables are protected by a
fail-closed runtime attestation gate, and the UI remains disabled, while
candidate-bound authorization and deployment evidence are absent. Linkage,
completion, transformation, and delayed continuity remain unavailable.
The current callable does not receive a cryptographically verified attestation
result; no approved runtime verifier exists.

## Artifacts And Authority

| Artifact or transition | Request authority | Persistence authority | Current state |
| --- | --- | --- | --- |
| Active sanctuary container | Authenticated user request | Server callable only | Source implemented; server/UI gates disabled |
| Active pointer | None directly | Server callable only | Source implemented with activation; server gate disabled |
| Sanctuary day advancement | Authenticated user supplying current continuity version | Server callable only | Source implemented; server/UI gates disabled |
| Reflective session linkage | None approved | Requires server validation of owned generated session | Unavailable |
| Completion state | None approved | Requires reviewed server transition | Unavailable |
| Transformation state | None approved | Requires entitlement and continuity authority | Unavailable |
| Delayed continuity | None approved | Requires server generation/persistence authority | Unavailable |

## Required Invariants

- **Ownership:** only authenticated server authority may persist continuity for
  that authenticated user; client-provided ownership is never trusted.
- **One active container:** activation must reject when either the active
  pointer or a canonical active container already exists.
- **Bounded sanctuary admission:** the source transition catalog admits only
  reviewed sanctuary identifiers and rejects transformation identifiers.
- **Monotonic advancement:** sanctuary advancement may increase `currentDay`
  by exactly one and may not pass the authored day limit.
- **No retroactive mutation:** no source transition may decrement day state or
  revise prior reflective meaning.
- **Provenance:** each transition records server authority, source, schema and
  transition versions, continuity version, and validation time.
- **Replay rejection:** advancing requires the current
  `expectedContinuityVersion`; stale or repeated requests fail.
- **Pointer/version agreement:** advancement rejects a pointer whose
  transition version diverges from the canonical container.
- **No reflective fabrication:** advancement accepts neither journal writing
  nor generated reflection/session linkage.
- **Fail closed:** unimplemented transitions remain inaccessible and client
  Firestore mutation remains denied.

## Rollback And Lifecycle

No automatic rollback transition is approved. A future rollback contract must
not erase history or silently revise continuity; it requires an explicit
server-authoritative model and privacy review.

Continuity records are user-owned data. Deletion source enumerates canonical
container collections. Export source collects continuity/provenance records,
but secure export delivery remains unavailable under RB-005.

## Certification Evidence

- Passing source/unit checks for activation, advancement, and stale/replay
  rejection.
- Emulator allow/deny evidence from a clean fixed candidate SHA.
- Same-SHA deployed Functions and Firestore rules evidence.
- An approved product/clinical decision before exposing sanctuary transitions
  while other transitions remain unavailable.
- RB-017 remains open until these requirements are proven.
