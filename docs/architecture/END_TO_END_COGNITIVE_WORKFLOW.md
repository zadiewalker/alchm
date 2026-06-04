# End-to-End Cognitive Workflow

## Scenario

User writes:

> "I'm exhausted and don't know who I'm becoming anymore."

This document traces the intended operating flow across Journal, Containers, Khepera, Mirror, and Memory.

## Current Workflow Audit

### 1. Journal Capture

Journal owns the raw entry. It saves the entry through the existing submission pipeline and runs crisis detection synchronously before provider generation.

Risk: none introduced by the new cognition foundations.

### 2. Container Influence

If the user is inside Identity Transition, the container foregrounds uncertainty, becoming, liminality, and emerging self.

If the user is inside Burnout Recovery, the same sentence foregrounds depletion, restoration, boundaries, and sustainability.

Risk found: before this audit, the container lens was architecturally described but not represented as a shared handoff contract.

### 3. Khepera Reasoning

Khepera receives the current raw entry only for immediate reflection generation. It also receives derived signals:

- current emotional tone
- current theme tags
- active container influence
- safe longitudinal pattern candidates
- recent response variety metadata

Khepera should decide:

- whether the user needs witnessing, regulation, exploration, identity development, or integration
- whether memory should be retrieved
- whether safety should override depth and variety
- which response form fits the current readiness

Risk found: Khepera should not consume every available memory. Elevated activation should suppress longitudinal interpretation.

### 4. Memory Retrieval

Memory retrieval is allowed when:

- a theme appears repeatedly
- the user references past context
- current content resembles a known derived pattern
- a prior breakthrough or unresolved loop is relevant
- the user appears stable enough for longitudinal reflection

Memory retrieval is avoided when:

- risk is elevated
- the user needs present-moment stabilization
- confidence is low
- interpretation would feel intrusive

### 5. Response Generation

Khepera remains bound to the existing reflection contract:

1. Witness
2. Perspective Offer
3. Seed

The cognition layer can affect posture, depth, and intervention selection. It must not change Khepera into a chatbot, therapist, coach, or instruction engine.

### 6. Mirror Memory Update

Mirror should receive derived observations, not raw entries. It can update:

- theme recurrence
- emotional movement
- narrative season
- unresolved question
- integration or transformation markers

### 7. Movement Detection

Mirror should prioritize movement over frequency:

- emergence
- intensification
- softening
- integration
- transformation
- recurrence
- resolution

In this scenario, a recurring identity pattern plus lower charge over time might become integration. Repeated exhaustion with increasing centrality might become intensification.

### 8. Future Retrieval

Future Khepera retrieval should receive derived candidates such as:

- identity has appeared across several entries
- uncertainty has recently intensified
- a prior integration marker exists

It must not receive reconstructed entry summaries.

### 9. Re-entry Experience

If the user returns after time away, Containers should not say "continue" or imply missed progress. A safe re-entry could surface:

- a question that remains alive
- a thread that has been waiting
- something that has softened

## Dead Ends Found

- Container influence had no shared adapter into Khepera theme tags.
- Mirror movement could not reliably become a Khepera memory candidate without custom glue.
- Derived memory ownership was not explicit enough to prevent duplicated stores.

## Ideal Workflow

1. Journal stores raw entry and runs crisis detection.
2. Container lens produces attention bias and inquiry context.
3. Unified cognition adapter translates Container and Mirror signals into Khepera-safe inputs.
4. Khepera assesses current state and decides whether memory is appropriate.
5. Khepera generates a three-part reflection.
6. Derived metadata updates minimal memory.
7. Mirror consumes derived observations and detects longitudinal movement.
8. Container memory records lens-specific questions and integration moments.
9. Future Khepera and Mirror retrieval use derived signals only.

## Implemented Fix

`buildUnifiedCognitiveContext()` now creates a safe handoff object that can support this workflow without changing the production generation path.
