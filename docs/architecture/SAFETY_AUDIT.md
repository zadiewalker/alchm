# ALCHM Safety Audit

## Scope

This audit covers the recent Khepera, Mirror, and Container architecture foundations and the new cognition integration seam.

## Safety Invariants Preserved

- Crisis detection remains outside the new architecture.
- Crisis detection remains the first gate before Khepera provider calls.
- Khepera output shape remains unchanged.
- No new diagnosis, treatment, coaching, or advice behavior is introduced.
- No raw journal text is added to memory.
- No gamification, streaks, pressure, or missed-day mechanics are introduced.
- Release-trust and runtime attestation logic are untouched.

## Khepera Safety

Strengths:

- Risk level can override intervention selection.
- Elevated activation suppresses memory retrieval.
- Prompt composition includes safety constraints.

Risks:

- The term "therapeutic" in architecture docs must not become therapeutic authority in product copy.
- Challenge-oriented interventions must remain compassionate and never directive.
- Seeds must remain one open-ended question.

Required guard:

Khepera may use reasoning internally, but user-facing language must remain observational and non-authoritative.

## Mirror Safety

Strengths:

- Pattern formation includes ambiguity and confidence.
- Synthesis language is intended to be tentative.
- Mirror avoids raw entries and metrics.

Risks:

- Recurrence can feel like labeling if phrased too strongly.
- Movement detection can overstate progress or resolution.
- Narrative intelligence can become fictionalization if it fills gaps.

Required guard:

Mirror should say "appears," "may," "seems," and "one possible thread" rather than "is," "proves," or "means."

## Container Safety

Strengths:

- Relationship states avoid failure.
- No completion model is required.
- Re-entry is designed as welcome, not correction.

Risks:

- Container selection could imply what the user "needs."
- Inquiry progression could become a subtle assignment system.
- Container presence must not become roleplay or dependency.

Required guard:

Containers shape attention. They do not prescribe growth.

## Memory Safety

Primary risk: memory duplication across systems can accidentally expand what is stored.

Resolution:

- Journal owns raw text.
- Khepera receives raw text only for immediate generation.
- Mirror and Containers receive derived signals only.
- Shared memory should store metadata, not reconstructive summaries.

## Edge Cases

### Elevated Risk With Strong Longitudinal Pattern

Memory should remain suppressed until the user is stable enough for reflection.

### User Returns After Long Absence

Container re-entry must not mention missed time as failure.

### Pattern Confidence Is Low

Mirror should either withhold the synthesis or disclose uncertainty.

### User Asks For Diagnosis

Khepera and Mirror should decline diagnosis and offer reflective, non-clinical support.

## Implemented Safety Improvement

The new cognition tests assert that elevated activation disables memory retrieval and selects stabilization-oriented regulation.
