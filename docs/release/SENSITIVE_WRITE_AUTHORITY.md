# Sensitive Write Authority Map

This is an operational release record for RB-017. It does not authorize a
new data path or claim that server persistence is implemented.

## Current Decision

Status: `SOURCE BOUNDARY ENFORCED - CERTIFICATION BLOCKING`

Immediate non-crisis generated sessions now use server-authoritative
persistence in source. Server-owned sanctuary activation and versioned
sanctuary day advancement transitions also exist in source; they accept no
writing or reflection-bearing linkage and remain blocked by both a server-side
runtime attestation gate and the disabled UI. Environment assertions cannot
enable that gate without a signed, candidate-bound, evidence-bound,
replay-checked receipt from an approved verifier, and no verifier or runtime
adapter currently supplies such a receipt. Delayed reflection output,
client memory updates, linkage, completion, and transformation transitions fail closed. RB-017 remains open
because this partial continuity contract and Firestore rules have no
candidate-bound emulator or deployment evidence.

## Authority Classification

| Surface | Persisted fields observed | Current writer | Required authority | Status |
| --- | --- | --- | --- | --- |
| Canonical immediate session record | Raw text required by current session model; validated `kheperaResponse`, `seed`, timing and server provenance | `functions/src/kheperaGateway.ts` using authenticated UID | Server | Implemented in source; unvalidated container linkage is no longer stored |
| Crisis-bearing remote session record | Crisis result and raw text | None: remote persistence now refuses unconfirmed/crisis client writes | Server policy decision if remote crisis records are required | Intentionally unavailable |
| Delayed reflection job/result | Scheduling and generated delayed output | None: client delayed functions throw unavailable and rules deny writes | Server or explicitly approved narrow scheduling contract | Intentionally unavailable |
| Khepera memory | `themeTags`, `emotionalTone` | None for new writes: client writer removed and rules deny writes | Server-derived minimized metadata | Intentionally unavailable pending server implementation |
| Container activation/state | day-1 sanctuary activation and active pointer | `functions/src/containerTransitions.ts` using authenticated UID | Server | Implemented in source behind a disabled server/UI gate pending evidence |
| Sanctuary day advancement | monotonic `currentDay` transition and continuity version | `functions/src/containerTransitions.ts` using authenticated UID and expected version | Server | Implemented in source behind a disabled server/UI gate pending evidence |
| Container linkage/completion | linked session IDs and completion fields | None for new mutations: client functions throw unavailable and rules deny writes | Server transition authority | Intentionally unavailable |
| Device-local pending queue | raw entry and pending workflow state | IndexedDB queue | Client-local while pending; raw-text redaction on completion remains required | Allowed only as existing offline behavior |

## Trust Boundary Gaps

- `functions/src/kheperaGateway.ts` authenticates, rechecks crisis status,
  invokes the provider, validates output, and writes immediate generated
  sessions with provenance in source. This is not deployed evidence.
- `firestore.rules` denies client writes to sessions, Khepera memory, and
  delayed reflections in source. Emulator and deployed-rules evidence remain
  unavailable.
- Client container mutations remain denied in source. Sanctuary activation is
  implemented behind authenticated server authority with transactional
  one-active enforcement and provenance, but a runtime attestation gate
  prevents execution pending evidence. Versioned sanctuary advancement is
  also server-owned in source and rejects stale requests and pointer/version
  divergence behind the same disabled gate. Newly
  generated sessions do not accept client-provided container linkage. See
  `docs/release/CONTAINER_STATE_AUTHORITY.md` and
  `docs/release/REFLECTIVE_CONTINUITY_TRANSITIONS.md`.
- Source enforcement alone does not close RB-017 without emulator and deployed
  same-SHA evidence for the active release contract.

## Required Server Persistence Design Before Closure

- Candidate-bound emulator and deployed evidence for the new immediate-session
  server write contract and client write denials.
- A reviewed policy/implementation decision for crisis-bearing remote records.
- Delayed reflection execution and output persistence owned by server
  authority, or the feature disabled.
- Minimized memory derivation owned by server authority or an explicitly
  approved narrow alternative.
- Runtime evidence and an approved exposure decision for the source-level
  sanctuary activation transition.
- Passing `npm run check:runtime-attestation` against accepted candidate-bound
  evidence and a separately approved runtime receipt adapter.
- Server implementations for progression, linkage, completion, and any
  transformation activation, or approved release evidence that those
  transitions remain unavailable.
- Firestore emulator tests proving clients cannot forge each server-owned
  field family.

## Executable Gate

Run:

```bash
npm run check:sensitive-write-authority
```

The command passes only for the source-level authority boundary. Certification
must remain failing while emulator/deployment evidence is absent, container
capability is unavailable without approved release disposition, or any
reintroduced client write, permissive sensitive rule, or missing
immediate-session persistence/provenance exists.
