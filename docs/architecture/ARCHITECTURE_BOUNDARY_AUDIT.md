# ALCHM Architecture Boundary Audit

## Audit Finding

Khepera, Mirror, and Containers are philosophically aligned, but before this audit they were still operating as separate architecture foundations. The main gap was not intent. It was ownership: each system described memory, themes, movement, and retrieval in its own vocabulary.

This audit establishes the operating boundary:

- Journal captures experience.
- Containers shape attention and inquiry.
- Khepera creates relational interpretation in the current moment.
- Mirror reveals movement across time.
- Memory creates continuity through derived signals only.

## Layer Ownership

### Journal

Responsibility: preserve the user's original experience under user authority.

May own:

- raw journal text
- local submission state
- crisis preflight status
- user-owned timestamps

Must not own:

- diagnoses
- longitudinal conclusions
- container progression
- Mirror movement claims

Risk found: low. The recent cognition architecture did not move raw journal capture out of the journal layer.

### Containers

Responsibility: provide an intentional attention lens.

May own:

- active container id
- attention foregrounds
- inquiry domains
- presence profile
- relationship state
- derived container memory

Must not own:

- raw journal text
- completion pressure
- behind/ahead state
- curriculum progress

Risk found: medium. Container memory overlaps with Mirror memory unless container memory is explicitly scoped to lens-specific derived observations and questions.

### Khepera

Responsibility: interpret the current entry and provide relational support through the existing three-part reflection contract.

May own:

- current state assessment
- intervention plan metadata
- response form recommendation
- recent response variety metadata
- derived theme and tone inputs

Must not own:

- raw journal text as memory
- diagnosis
- advice plans
- coaching sequences
- generalized user profiles

Risk found: medium. Khepera cognition can become over-complex if every signal is passed directly into generation. The adapter layer should filter signals into a small, explainable prompt plan.

### Mirror

Responsibility: reveal movement across time from derived observations.

May own:

- derived observations
- tentative patterns
- movements
- narrative syntheses
- recognition-oriented reflections

Must not own:

- raw journal text
- quoted excerpts
- certainty claims
- metrics dashboards

Risk found: medium. Mirror's pattern model is healthy, but it should not become a parallel analytics system or a second Khepera.

### Memory

Responsibility: provide continuity through minimal derived metadata.

May own:

- episodic ids
- theme tags
- emotional tone
- movement markers
- container associations
- response variety metadata

Must not own:

- reconstructive summaries
- raw text embeddings
- quoted user language
- provider secrets

Risk found: high if ungoverned. Khepera, Mirror, and Containers each introduced memory language. The memory contract now needs one shared interface.

## Overlaps Found

- Khepera `LongitudinalPattern`, Mirror `MirrorPattern`, and Container memory records all model recurrence.
- Mirror themes and Journal `ThemeTag` use different names for similar concepts.
- Container movement focus and Mirror movement detection can duplicate each other unless Containers only bias what Mirror watches.
- Khepera memory retrieval and Mirror retrieval can compete unless Mirror provides derived candidates and Khepera decides whether the current moment can safely use them.

## Conflicts Found

- Mirror theme vocabulary had no explicit translation into the journal-safe `ThemeTag` vocabulary.
- Container active themes use Mirror language, while Khepera expects journal theme tags.
- Architecture docs described desired workflows, but no shared code seam existed for cross-system handoff.

## Missing Responsibilities

- A single place to translate Container and Mirror signals into Khepera-safe inputs.
- A single storage policy stating that raw text is provider-only outside the journal record.
- A boundary registry engineers can test against.

## Implemented Fix

Added `src/lib/cognition` as an additive integration seam. It does not change live app behavior. It defines:

- system boundary ownership
- safe cross-system inputs
- Mirror-to-ThemeTag translation
- derived pattern conversion for Khepera
- container influence shaping
- raw-text storage policy

## Deferred Fixes

- Wire the unified context into live Khepera generation behind a release-safe integration flag.
- Add persisted schema versioning for derived memory records.
- Add observability for retrieval and intervention decisions without logging raw entries.
