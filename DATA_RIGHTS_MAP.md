# ALCHM Data Rights Map

This document identifies the user-owned data paths that export, deletion, and retention work must consider.

## Canonical Firestore Paths

The active journal flow persists user data beneath `users/{uid}`:

| Path | Content | Data-rights treatment |
| --- | --- | --- |
| `users/{uid}/sessions/{entryId}` | Raw journal text, Khepera response, tone, themes, timing metadata | Include in export; delete for account erasure; apply user-authorized retention |
| `users/{uid}/khepera/memory` | `ThemeTag[]` and `EmotionalTone` only | Include or delete as user-owned derived data; never expand to raw text |
| `users/{uid}/kheperaDelayedReflections/{id}` | Delayed-reflection state | Delete for account erasure |
| `users/{uid}/containers/{id}` | Container continuity records; source includes server-only sanctuary activation and monotonic day advancement behind a fail-closed runtime attestation gate while linkage/completion/transformation remain unavailable | Include/delete as user-owned continuity data; export coverage is not yet implemented |
| `users/{uid}/containerState/{id}` | Active container pointer/version; source includes runtime-attestation-gated server-only sanctuary activation and advancement while later transitions remain unavailable | Include/delete as user-owned continuity data; export coverage is not yet implemented |
| `users/{uid}/profile/{id}` | User profile/preferences | Delete for account erasure |
| `users/{uid}/analyses/{id}` | Legacy/administrative analyses where present | Include or delete while present |

## Migration Paths

`journal-entries` remains a legacy top-level collection. Privacy operations must continue to include or delete these documents while legacy data may exist, but new journal storage should use canonical session paths.

## Operational Records

`dataExportRequests`, `accountDeletionRequests`, `userPrivacySettings`, and `privacyAuditLog` support privacy operations. Audit records retained after erasure must be anonymized and must not preserve the original user identifier.

## Device-Local Data

Pending journal submissions may contain raw text in IndexedDB until remote persistence completes, after which the queue completion path redacts the local text. Server-side deletion cannot clear data from an offline device; any user-facing full-erasure workflow must state and handle this limitation explicitly.

## Current Enforcement Status

| Workflow | Source state | Release status |
| --- | --- | --- |
| Data export | Canonical sessions and legacy journal paths are mapped in Functions source; continuity/provenance export coverage is not yet implemented; secure export delivery is disabled. | Unavailable until canonical continuity coverage, secure delivery, emulator evidence, and deployed evidence exist. |
| Account deletion | Canonical subcollection deletion logic exists; request delivery and processing are disabled. | Unavailable until verified request processing and device-local limitations are addressed. |
| Retention | Canonical sessions are included in dormant policy logic; automatic enforcement is disabled. | Not enabled without approved policy and user-control evidence. |
| Khepera memory | Restricted to theme tags and emotional tone; client writes are denied while server-side derivation is not yet implemented. | Unavailable for new derived updates until server derivation and deployed-rules/emulator evidence exist. |
| Sensitive write authority | Immediate generated sessions are written by the server gateway in source; server-only sanctuary activation and monotonic day advancement implementations are denied by a runtime attestation gate until evidence exists and accept no writing/session input; source now defines signed candidate-bound receipt verification with expiry and replay rejection, but no verifier is approved and environment assertions cannot provide authority; unvalidated linkage is not persisted; delayed reflection, memory updates, linkage, completion, and transformation transitions fail closed. | Source boundary partially implemented, not certified until candidate-bound emulator/deployment/attestation evidence and an approved continuity release contract exist; see `docs/release/SENSITIVE_WRITE_AUTHORITY.md`. |
| Support | Live support prepares an email request; dormant Firestore ticket code is not an approved delivery path. | No persisted support delivery claim is approved. |

This status table describes the inspected source worktree only. It is not
evidence that any function, rule, or user-facing surface has been deployed.
