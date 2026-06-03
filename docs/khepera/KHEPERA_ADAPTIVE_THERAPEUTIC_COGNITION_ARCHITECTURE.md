# Khepera Adaptive Therapeutic Cognition Architecture

## Status

`FOUNDATION IMPLEMENTED - NOT YET WIRED TO LIVE GENERATION`

This architecture defines a deterministic reasoning layer for Khepera. It is
designed to make responses feel intentionally chosen across time without
turning Khepera into a therapist, coach, diagnostic system, or action planner.

The current implementation is additive and pure TypeScript:

- `src/lib/khepera/cognition/types.ts`
- `src/lib/khepera/cognition/stateAssessment.ts`
- `src/lib/khepera/cognition/patternIntelligence.ts`
- `src/lib/khepera/cognition/interventionDecision.ts`
- `src/lib/khepera/cognition/responseForm.ts`
- `src/lib/khepera/cognition/varietyEngine.ts`
- `src/lib/khepera/cognition/memoryRetrieval.ts`
- `src/lib/khepera/cognition/promptComposer.ts`
- `src/lib/khepera/cognition/safety.ts`

## Non-Negotiable Boundaries

Khepera remains a reflection system. It must not diagnose, advise, prescribe,
coach, claim therapeutic authority, or push user action. The final response
contract remains exactly:

1. Witness.
2. Perspective Offer.
3. Seed.

The seed remains exactly one open-ended question.

Crisis detection remains outside this architecture in
`src/services/khepera/crisisDetection.ts` and still runs before Khepera model
invocation. If risk is elevated, safety overrides variety, memory, pattern
interpretation, challenge, and depth.

## State Assessment

`assessPsychologicalState()` scores multiple dimensions instead of forcing a
single label:

- emotional state
- nervous system state
- cognitive dynamics
- reflective capacity
- readiness
- dominant need
- risk level
- confidence

Scores include evidence labels so downstream decisions can explain why an
intervention was selected. These scores are heuristic signals, not clinical
claims.

## Longitudinal Pattern Intelligence

`modelLongitudinalPatterns()` accepts metadata-only pattern records. It can
classify the current relationship to a theme as:

- `firstEncounter`
- `emergingPattern`
- `recurringPattern`
- `chronicLoop`
- `transformation`
- `integration`

Progression state changes the intervention posture:

| Progression | Default posture |
| --- | --- |
| `firstEncounter` | witnessing before pattern naming |
| `emergingPattern` | gentle reflection |
| `recurringPattern` | soft pattern awareness |
| `chronicLoop` | compassionate new angle if risk is low |
| `transformation` | growth reinforcement without performance pressure |
| `integration` | identity consolidation without certainty claims |

## Intervention Decision

`decideIntervention()` selects one intervention family and records rejected
families with reasons. Supported families:

- witnessing
- reflection
- compassion
- regulation
- exploration
- meaning making
- gentle challenge
- integration
- agency activation
- identity development
- growth reinforcement

Selection is deterministic. Variation comes from state, readiness, pattern
stage, memory relevance, and recent response metadata, not randomness.

## Response Form

`selectResponseForm()` chooses the response structure before language
generation. Supported forms:

- concise reflection
- extended witnessing
- exploratory dialogue
- narrative interpretation
- grounding response
- insight synthesis
- pattern summary
- compassionate confrontation
- future-oriented reflection

The form changes pacing, length, posture, and depth while preserving the
three-part Khepera output contract.

## Variety Engine

`buildVarietyMetadata()` and `avoidRecentRepetition()` track:

- intervention family
- response form
- emotional posture
- question count
- length band
- direct advice usage
- memory use
- challenge level
- reflection level

The engine avoids repeating the same family/form pattern when another clinically
compatible option exists. It does not use randomness.

## Memory Retrieval

`planMemoryRetrieval()` ranks metadata-only memory candidates. Ranking factors:

- semantic theme relevance
- emotional similarity
- recurrence
- breakthrough significance
- unresolved loop significance
- user-stated importance
- recency marker presence

Retrieval is blocked when:

- risk is elevated or crisis-level
- assessment confidence is low
- memory would be intrusive or interpretive

No raw journal text, quotes, excerpts, reconstructive summaries, embeddings, or
identity-bearing narratives are required by this model.

## Prompt Composition

`composeKheperaPromptPlan()` produces a prompt plan containing:

- current entry policy
- state assessment
- pattern intelligence
- memory retrieval plan
- selected and rejected interventions
- response form
- safety constraints
- variety constraints
- prompt summary

The current entry may be passed to the provider for immediate generation, but
the plan marks it as `raw-entry-for-provider-only`. Persistent memory remains
metadata-only.

## Safety Safeguards

Safety constraints explicitly require:

- no diagnosis
- no clinical authority claims
- no action prescriptions
- no medical or psychiatric advice
- no certainty claims
- no manipulative emotional language
- no escalation of crisis states
- no memory retrieval during elevated risk

If risk is elevated, the engine selects:

- intervention: `regulation`
- response form: `groundingResponse`

This prioritizes stabilization and support resources over insight, challenge,
pattern recognition, or variety.

## Evaluation Framework

Recommended metadata-only evaluation fields:

- selected intervention family
- response form
- emotional posture
- length band
- challenge level
- reflection level
- memory used: yes/no
- risk level
- confidence band
- progression state
- repetition distance from recent responses
- post-generation quality flags

Do not store raw journal text, quoted excerpts, reconstructive summaries, or
provider prompts for evaluation unless separately approved under the data-rights
and privacy model.

Qualitative review should assess:

- perceived adaptiveness
- felt attunement
- response repetition
- longitudinal usefulness
- pattern recognition accuracy
- intervention diversity
- safety preservation

## Example Scenario Coverage

The unit tests cover:

- first-time grief entry
- recurring shame/self-worth loop
- highly activated panic-like entry
- emerging growth or transformation
- coherent variation based on recent response metadata

Additional manual fixtures should be added before live wiring for:

- chronic self-criticism without acute risk
- user explicitly needing only witnessing
- user asking for action planning while Khepera remains non-directive

## Known Limitations

This foundation is not yet wired into the live Khepera prompt builder or server
gateway. It does not claim clinical accuracy. It is a structured reasoning
contract for safer future prompt composition and evaluation.
