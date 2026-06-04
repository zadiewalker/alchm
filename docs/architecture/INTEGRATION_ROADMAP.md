# ALCHM Cognitive Integration Roadmap

## Phase 1: Foundational Integration

Goal: make the systems coherent without changing live behavior.

Status: started.

Work:

- define ownership boundaries
- add a unified cognition handoff type
- map Mirror and Container themes to `ThemeTag`
- test safety-preserving handoff
- document the end-to-end workflow

Exit criteria:

- typecheck passes
- cognition adapter tests pass
- raw-entry memory transfer remains impossible by contract

## Phase 2: Memory Unification

Goal: make derived memory storage explicit and non-duplicative.

Work:

- create schema versions for derived memory records
- define source ids and ownership fields
- make Mirror the durable pattern owner
- make Containers own lens-specific views
- make Khepera consume ephemeral candidates only

Exit criteria:

- no duplicate durable recurrence stores
- migration plan exists
- privacy export/deletion coverage remains accurate

## Phase 3: Khepera Live Reasoning

Goal: use the unified context in real Khepera planning.

Work:

- feed adapter output into prompt planning behind a feature flag
- preserve the three-part reflection contract
- add tests for crisis-first ordering
- emit metadata-only reasoning traces

Exit criteria:

- no change to crisis detection location or ordering
- no raw journal text stored as memory
- response variety improves without randomness

## Phase 4: Mirror Synthesis

Goal: turn derived observations into recognition-oriented synthesis.

Work:

- consume Khepera-derived theme and tone records
- detect movement over time
- produce tentative synthesis records
- avoid dashboards, metrics, and scores in user-facing surfaces

Exit criteria:

- synthesis examples remain non-diagnostic
- confidence remains internal or carefully disclosed
- no raw excerpts are surfaced as Mirror content

## Phase 5: Container Activation

Goal: let Containers shape attention across Khepera and Mirror.

Work:

- pass active container into the cognition adapter
- bias memory retrieval and Mirror movement focus
- add re-entry experiences
- keep relationship states non-punitive

Exit criteria:

- no completion/progress pressure
- no missed-day behavior
- container lens changes what becomes visible without prescribing action

## Phase 6: Advanced Longitudinal Intelligence

Goal: support deeper recognition over long time horizons.

Work:

- detect seasons, transitions, recurrence, and integration
- refine movement confidence over months
- add metadata-only evaluation measures
- support user export/deletion for all derived continuity records

Exit criteria:

- users can understand why something resurfaced
- engineers can debug retrieval decisions
- safety and privacy invariants remain intact

## Risk Rule

Do not advance phases if a previous phase has unresolved raw-text retention, crisis-ordering, release-trust, or privacy export/deletion regressions.
