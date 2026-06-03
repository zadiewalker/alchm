# Mirror Longitudinal Reflection Architecture

Mirror is ALCHM's longitudinal reflection layer. Journal captures experience.
Khepera responds to experience. Mirror reveals patterns across experience without
turning the person into analytics, scores, reports, or a dashboard.

Mirror is designed for recognition:

- a theme that has stayed nearby for months
- a question that keeps returning
- a tension that has changed shape
- a softer relationship to something once charged
- a possible chapter or turning point

Mirror does not diagnose, coach, optimize, rank, score, or measure the user.

## Memory Model

Mirror memory stores derived understanding, not journal text.

Canonical source material:

- Khepera-derived theme and tone metadata
- Khepera reflection metadata
- continuity metadata where source authority is server-owned

Mirror must not store:

- raw journal entries
- quoted excerpts
- reconstructive summaries of entries
- behavioral scores
- streaks
- engagement metrics
- inferred diagnoses

Firestore model:

| Path | Purpose | Raw text allowed |
| --- | --- | --- |
| `users/{uid}/mirror/observations/{id}` | Derived observation from Khepera or continuity metadata | No |
| `users/{uid}/mirror/patterns/{id}` | Confidence-aware recurring signal | No |
| `users/{uid}/mirror/movements/{id}` | Movement across time for a pattern | No |
| `users/{uid}/mirror/syntheses/{id}` | User-facing reflective synthesis | No |

Observation fields:

- themes
- emotionalLandscapes
- identityNarratives
- recurringQuestions
- lifeTensions
- emotionalCharge
- reflectiveClarity
- ambiguity
- confidence
- source session/reflection identifiers

These are abstractions. They are not facts about the user.

## Pattern Formation

The pattern engine transforms individual derived observations into recurring
signals.

Patterns include:

- recurring themes
- emotional landscapes
- identity narratives
- recurring questions
- life tensions

Each pattern stores:

- evidence strength
- recency
- persistence
- ambiguity score
- confidence score
- observation identifiers
- tentative user-facing language

Pattern language must remain observational:

- "Trust seems to be a theme that has appeared repeatedly."
- "Questions about closeness and loss appear to surface often."
- "A tension between safety and growth may be part of the larger shape."

Mirror must not say:

- "You struggle with trust."
- "You are afraid of abandonment."
- "This proves..."

## Movement Detection

Movement matters more than frequency.

The movement engine detects:

- emergence
- intensification
- softening
- integration
- transformation
- recurrence
- resolution

Movement is derived from changes in emotional charge, reflective clarity,
recency, and persistence. Frequency alone is insufficient for user-facing
synthesis.

Examples:

- Softening: a theme still appears, but with less emotional charge.
- Integration: a once-fragmented theme appears with more clarity.
- Transformation: a theme appears alongside a different self-understanding.
- Recurrence: an older theme returns enough to be noticed again.

## Narrative Intelligence

Narrative intelligence helps users perceive continuity without fictionalizing
their life.

It may identify:

- seasons
- transitions
- chapters
- turning points
- periods of uncertainty
- periods of growth
- recurring cycles

All narrative language remains tentative:

- "Across recent months, belonging may be forming part of the larger shape."
- "One possible reading is that certainty has become less central than curiosity."
- "A recurring tension between safety and growth continues to surface."

## Synthesis Types

Mirror can generate:

- Themes In Motion
- Questions That Keep Returning
- Shifts In Perspective
- Emotional Weather
- Emerging Stories
- Things Becoming Clearer
- Things Still Unfolding
- Moments Of Transformation
- Recurring Tensions
- Evidence Of Growth

Synthesis is contemplative. It is not explanation, coaching, or advice.

## Experience Design

Mirror should feel like standing on a quiet hill overlooking one's own life.

Primary areas:

1. Themes In Motion
2. Questions Returning
3. Seasons Of Life
4. Things Becoming Clearer
5. Things Still Unfolding
6. Reflections Across Time

Avoid:

- charts
- graphs
- progress bars
- trend arrows
- rankings
- percentages
- dashboards
- productivity language

Interface hierarchy should favor spacious text, small grouped reflections, and
quiet navigation between reflective areas.

## Retrieval Strategy

Retrieve derived memory when:

- a theme appears repeatedly
- the user references past context
- a current derived signal resembles a prior pattern
- evidence of growth is relevant
- prior recurring questions or tensions are relevant

Avoid retrieval when:

- elevated risk or crisis signals require present-moment support
- historical interpretation would feel intrusive
- confidence is low
- raw text would be needed to make the synthesis feel grounded

Ranking factors:

- signal relevance
- recency
- recurrence
- breakthrough significance
- unresolved loop significance
- ambiguity
- user-stated importance when explicitly provided

## Safety And Epistemic Humility

Mirror safeguards enforce:

- tentative language
- confidence thresholds
- ambiguity preservation
- uncertainty disclosure
- no diagnosis
- no psychological certainty
- no scores or metrics
- no raw journal display

When risk is elevated, Mirror should withhold longitudinal interpretation and
favor present-moment safety surfaces already established elsewhere in ALCHM.

## Claude Orchestration

If Mirror synthesis uses Claude in the future, the prompt should receive only:

- derived observations
- pattern summaries
- movement summaries
- narrative interpretation
- safety constraints
- prohibited language rules

Claude must not receive raw journal text for Mirror synthesis unless a separately
approved privacy and consent path exists.

## Caching And Background Processing

Mirror can be updated by background processing after server-authoritative
Khepera reflection persistence.

Recommended cache behavior:

- store derived observations immediately after Khepera metadata is available
- recompute patterns and movements in bounded batches
- cache syntheses for a short interval
- invalidate syntheses when new derived observations change movement state

## Retention And Export

Mirror data is user-owned derived data.

Required rights coverage:

- export derived observations
- export patterns, movements, and syntheses
- delete all Mirror collections on account deletion
- disclose that Mirror does not retain raw journal text as Mirror memory

## Evaluation

Evaluate Mirror for:

- recognition moments
- perceived self-understanding
- emotional resonance
- usefulness of reflection
- longitudinal value
- narrative continuity
- user trust

Do not optimize for:

- time in app
- activity volume
- streaks
- engagement maximization
- conversion pressure

Mirror succeeds when users feel understood by their own history.
