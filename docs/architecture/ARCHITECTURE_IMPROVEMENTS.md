# ALCHM Architecture Improvements

## Summary

The audit found that Khepera, Mirror, and Containers share the right product philosophy but needed an explicit operating contract. The implemented fix is intentionally small: a typed cognition adapter that translates derived signals between systems while preserving ownership and privacy boundaries.

## Issues Found

| Issue | Severity | Recommended Fix | Implemented |
| --- | --- | --- | --- |
| Khepera, Mirror, and Containers had separate memory concepts | High | Define one memory ownership model | Yes, documented in `UNIFIED_MEMORY_ARCHITECTURE.md` |
| Mirror and Container themes did not map cleanly to `ThemeTag` | Medium | Centralize theme translation | Yes, `mirrorThemeToThemeTag()` |
| No shared cross-system handoff type existed | High | Add a typed adapter | Yes, `UnifiedCognitiveContext` |
| Safety ownership was spread across docs | Medium | Document safety boundaries and add tests | Yes |
| Container memory could become a parallel Mirror | Medium | Scope Container memory to lens-specific derived records | Documented |
| Khepera could overuse memory in activated states | High | Assert memory suppression under elevated risk | Yes, test coverage added |
| Operational debugging requirements were implicit | Medium | Define metadata-only observability plan | Documented |

## Implemented Fixes

- Added `src/lib/cognition/types.ts`.
- Added `src/lib/cognition/ecosystem.ts`.
- Added cognition integration tests.
- Added architecture audit deliverables under `docs/architecture`.
- Added the cognition test to the repository test script.

## Deferred Fixes

- Live Khepera integration with the adapter.
- Derived memory persistence schema.
- Metadata-only observability events.
- Mirror synthesis backfill workflow.
- Container re-entry UI.

## Safety Assessment

The implemented changes are additive. They do not alter:

- crisis detection
- journal submission ordering
- Khepera provider calls
- Khepera output shape
- release-trust logic
- runtime attestation logic
- Firestore authority
- privacy export/deletion behavior

## Current Operating Model

Journal captures experience.

Containers shape attention.

Khepera creates relationship.

Mirror creates recognition.

Memory creates continuity through derived signals only.
