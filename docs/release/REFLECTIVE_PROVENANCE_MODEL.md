# Reflective Provenance Model

This record identifies the authority required for persisted reflective
artifacts. It describes inspected source behavior only.

## Artifact Authority

| Artifact | Create/persist authority | Mutation authority | Current source status | Data-rights treatment |
| --- | --- | --- | --- | --- |
| Canonical generated session | Authenticated Khepera gateway | Server only | Implemented for immediate non-crisis sessions | Export/delete as user session data |
| Delayed generated reflection | Server only | Server only | Unavailable | Delete legacy records if present |
| Khepera memory metadata | Server derivation only | Server only | Unavailable for new writes | Include/delete as minimized derived data |
| Container activation and active state | Authenticated `activateContainer` service | Server only | Sanctuary activation implementation exists behind fail-closed runtime-attestation and UI gates pending evidence | Include/delete as user continuity data |
| Sanctuary day advancement | Authenticated `advanceSanctuaryContainer` service | Server only | Monotonic versioned implementation exists behind fail-closed runtime-attestation and UI gates pending evidence | Include/delete as user continuity data |
| Container linkage and completion | Authenticated transition service | Server only | Unavailable | Include/delete legacy records if present |
| Device-local pending queue | Local device while pending | Local queue process | Allowed pending behavior; redact on confirmed completion | Offline device limitation remains disclosed |

## Required Provenance

Canonical generated sessions currently include:

- `generatedBy: "server"`
- `source: "kheperaGateway"`
- `gatewayVersion`
- `schemaVersion`
- `createdAt`
- `validatedAt`
- server-established `userId`

New canonical sessions do not persist client-supplied container continuity
linkage while no server transition authority exists.

Future derived memory records must include `derivedBy: "server"`,
`sourceSessionId`, `schemaVersion`, and server timestamps.

Sanctuary activation records include `transitionedBy: "server"`,
`transitionSource`, `schemaVersion`, `transitionVersion`, `continuityVersion`,
and `validatedAt`. They initialize day 1 without reflective session linkage.

Sanctuary advancement records retain the activation provenance fields and add
`progressedBy: "server"`, `previousContinuityVersion`, and
`previousTransitionVersion`. The transaction rejects a stale expected
continuity version or active-pointer transition-version divergence before
advancing exactly one authored day.

Future linkage and completion records must retain those fields and add
`sourceSessionId` when a transition is linked to a validated, server-written
session.

## Validation and Lifecycle

- Khepera output validation runs before a generated session is persisted.
- Crisis-detected text does not reach provider generation or generated-session
  persistence through the gateway.
- Memory is limited to theme tags and emotional tone; raw writing never enters
  memory.
- Export/deletion delivery and automatic retention remain unavailable until
  independently verified.
- Sanctuary activation and advancement accept no writing or generated
  reflective content; a runtime attestation gate prevents their exposure
  without verified evidence and a signed candidate-bound verifier receipt; no
  verifier is approved and no runtime adapter currently supplies a verified
  result. Linkage, completion, transformation, and delayed
  continuity transitions remain unavailable.

## Evidence Required For Certification

- Clean fixed candidate SHA.
- Emulator-backed authorization evidence for all sensitive collections.
- Deployed Functions and Firestore rules evidence for that same SHA.
- Deployment, native, privacy/lifecycle, and rollback authority resolution.
