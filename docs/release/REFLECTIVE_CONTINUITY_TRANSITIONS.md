# Reflective Continuity Transitions

This is the authority contract for state that changes the meaning or
continuity of a container. It describes inspected source, not deployed
capability or release approval.

## Current Status

Status: `PARTIAL SERVER AUTHORITY - CERTIFICATION BLOCKING`

Two bounded server-owned transition implementations exist in source:
authenticated activation of approved sanctuary containers and monotonic
sanctuary day advancement. A fail-closed runtime attestation gate and the UI
both prevent their execution while runtime evidence and release authority are
incomplete; environment assertions alone cannot enable the gate and no
approved verifier exists and no structured receipt verification result is
wired into the callable. Entry
linkage, completion, delayed continuity, and
transformation container activation remain unavailable.

## Transition Matrix

| Transition | Requester | Validator and persister | Provenance | Current state |
| --- | --- | --- | --- | --- |
| Activate approved sanctuary container | Authenticated user | `activateContainer` callable; server catalog and transaction | `transitionedBy`, `transitionSource`, `schemaVersion`, `transitionVersion`, `continuityVersion`, `validatedAt` | Implemented in source; server runtime gate disabled pending evidence |
| Activate transformation container | None approved | Requires server entitlement authority | Same as activation plus entitlement evidence | Unavailable |
| Advance sanctuary day | Authenticated user holding current version | `advanceSanctuaryContainer` callable; active-pointer and version transaction | `transitionedBy`, `progressedBy`, previous/current transition and continuity versions, `validatedAt` | Implemented in source; server runtime gate disabled pending evidence |
| Advance transformation day or infer reflective progression | None approved | Requires entitlement and clinical/product authority | Transition and continuity versions | Unavailable |
| Attach reflective session to container | None approved | Requires owned server-written session validation | `sourceSessionId` and transition provenance | Unavailable |
| Complete container | None approved | Requires server transition rules and review of ceremony data persistence | Transition provenance | Unavailable |
| Produce delayed continuity/reflection | None approved | Requires server generation and persistence authority | Derived artifact provenance | Unavailable |

## Activation Invariants

The source implementation for sanctuary activation must:

- Remain denied by the runtime attestation gate until approved evidence
  permits exposure.
- Require Firebase authenticated context and use only that UID for ownership.
- Admit only the fixed server-side sanctuary catalog; it must reject unknown
  identifiers and transformation containers.
- Read both the active pointer and any active container records inside one
  transaction and reject activation if either establishes an active container.
- Write `users/{uid}/containers/{serverId}` and
  `users/{uid}/containerState/active` through Admin SDK authority only.
- Initialize only day 1 with no session linkage.
- Stamp server provenance and server timestamps.
- Avoid logging journal writing or accepting reflective content.

## Invalid Transitions

- A client Firestore create, update, or delete against container continuity
  records is invalid.
- A second active container activation is invalid.
- A transformation activation without verified server entitlement is invalid.
- A stale, repeated, or terminal sanctuary day-advance request is invalid.
- Any request to complete or attach a session is unsupported
  until a reviewed server transition exists.

## Advancement Invariants

The source implementation for sanctuary day advancement must:

- Remain denied by the runtime attestation gate until approved evidence
  permits exposure.
- Require authenticated user context and the server-written active container.
- Admit only an active sanctuary record from the fixed server catalog.
- Require `expectedContinuityVersion` to match both the container and active
  pointer within one transaction.
- Require pointer and container `transitionVersion` values to agree.
- Increment `currentDay`, `continuityVersion`, and `transitionVersion` once.
- Reject stale requests, repeated requests, terminal-day requests, and
  transformation state.
- Stamp server provenance without accepting writing, session linkage, or a
  claim of emotional development.

## Rollback And Data Rights

Activation creates user-owned continuity records that must be covered by
export/deletion mapping. Deletion source enumerates the canonical continuity
subcollections; secure export collection and delivery do not yet cover this
continuity/provenance state and remain unavailable. No new rollback operation
is approved; before activation is exposed, rollback authority and
data-lifecycle execution must be reviewed.

## Certification Requirements

- Unit evidence for admission, monotonic advancement, and stale/replay denial behavior.
- Firestore emulator evidence proving client write denial and server-written
  record readability for a clean candidate SHA.
- Same-SHA deployed Functions and Firestore rules evidence.
- Passing candidate-bound attestation preflight and an approved runtime
  receipt adapter.
- Approved product decision to expose sanctuary activation or advancement while later
  transitions remain unavailable, or implementation of the remaining
  transition model.
- RB-017 remains open until this evidence exists.
