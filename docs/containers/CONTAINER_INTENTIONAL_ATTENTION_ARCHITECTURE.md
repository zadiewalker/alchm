# Container Intentional Attention Architecture

Containers are ALCHM's intentional attention system.

They are not courses, challenges, habits, curricula, content libraries, or
completion paths. A Container is something the user enters. It changes what
becomes visible.

Journal captures lived experience. Khepera responds to lived experience. Mirror
reveals longitudinal movement. Containers create the contextual lens through
which experience is understood.

## Conceptual Model

A Container does not ask, "What should the user do next?"

It asks, "What should become more visible?"

The Container affects:

- what Khepera notices
- which derived memories become relevant
- what Mirror tracks
- which questions remain alive
- which themes move into the foreground
- which developmental movements matter

## Context Model

Each Container has a context:

- active themes
- developmental priorities
- preferred interventions
- memory retrieval bias
- Mirror movement focus
- inquiry domains
- safety adjustments
- presence profile

Example lenses:

| Container | Foregrounds | Backgrounds |
| --- | --- | --- |
| Self-Compassion | shame, self-worth, gentleness, self-trust | optimization, achievement |
| Burnout Recovery | depletion, restoration, boundaries, sustainability | productivity, performance |
| Identity Transition | uncertainty, becoming, liminality, emerging self | premature certainty |
| Belonging | connection, isolation, acceptance, relational patterns | prescriptive social advice |

## Presence

Container presence is not a character, coach, or personality.

It is a felt atmosphere that influences pacing, depth, posture, and language.

Examples:

- Burnout Recovery: spacious, gentle, restorative
- Self-Compassion: warm, forgiving, accepting
- Identity Transition: curious, patient, exploratory
- Belonging: steady, warm, accepting

Presence affects Khepera and Mirror without roleplay.

## Inquiry Architecture

Containers evolve inquiry rather than prompts.

Inquiry can be:

- recurring
- deepening
- changing
- unresolved
- integrating

Examples:

- What do I need right now?
- What am I carrying that no longer belongs to me?
- What am I becoming?
- Where does belonging feel possible, even faintly?

The same inquiry can remain alive for a long time. That is not failure.

## Relationship States

Container relationship states are pressure-free:

- entering
- dwelling
- deepening
- resting
- returning
- integrating
- revisiting

No state means behind. No state means abandoned. Returning after three weeks
should feel emotionally identical to returning after one day.

## Khepera Integration

Containers bias Khepera reasoning without changing Khepera's contract.

For the same entry, "I'm exhausted and don't know why":

- Burnout Recovery foregrounds depletion, boundaries, and restoration.
- Identity Transition foregrounds uncertainty and liminality.
- Belonging foregrounds isolation, support, and connection.

Integration payload:

- foreground themes
- intervention bias
- memory priorities
- inquiry bias
- response posture
- response form bias
- safety constraints

Khepera must still never diagnose, advise, prescribe, coach, or claim certainty.

## Container Memory

Container memory stores reflective abstractions, not raw journal text.

It may store:

- insights
- recurring themes
- emotional movements
- unresolved questions
- emerging questions
- developmental shifts
- moments of integration

It must not store:

- raw entries
- quoted excerpts
- reconstructive summaries
- operational diagnostics
- behavioral scores

## Firestore Schema

Recommended server-owned derived paths:

| Path | Purpose | Raw journal text |
| --- | --- | --- |
| `users/{uid}/containerRelationships/{id}` | Relationship state and active inquiry pointers | No |
| `users/{uid}/containerRelationships/{id}/memory/{memoryId}` | Derived container memory | No |
| `users/{uid}/containerRelationships/{id}/inquiries/{inquiryId}` | Living inquiry state | No |
| `users/{uid}/containerRelationships/{id}/syntheses/{synthesisId}` | Derived reflection across the container | No |

These records are user-owned derived data and must be included in export and
deletion coverage before user-facing claims expand.

## Mirror Integration

Mirror should synthesize Container movement:

- What changed while dwelling in this Container?
- What softened?
- What emerged?
- What became clearer?
- What remains alive?
- What surprised you?

Mirror must not count visits, days, completion, or compliance.

## Re-entry

Re-entry must communicate:

- "This space is still here."
- "A question that has been waiting."
- "Something you may wish to revisit."

Avoid:

- "You stopped."
- "You missed progress."
- "Continue where you left off."
- "Catch up."
- "Restart."

## Completion Philosophy

Containers do not complete. They integrate, rest, continue, revisit, or become
part of identity.

Possible relationship movements:

- integration
- continuation
- revisiting
- resting
- carrying forward

Completion metrics are not a Container success signal.

## Ecosystem Transitions

Transitions can include:

- entering a Container
- resting a Container
- returning to a Container
- revisiting a Container
- dwelling in multiple Containers
- moving from one Container lens to another

Recommendations should be sparse, gentle, and contextual.

## Experience Design

Container UX should feel calm, spacious, contemplative, intimate, and
restorative.

Use:

- quiet entry spaces
- a small number of living inquiries
- soft re-entry copy
- reflective cards or unframed text areas
- derived movement language

Avoid:

- dashboards
- progress bars
- percentages
- streaks
- achievements
- activity charts
- urgency copy

## Safety Framework

Containers must never:

- diagnose
- pathologize
- prescribe
- create dependency
- pressure participation
- imply failure through absence

All language should preserve autonomy, uncertainty, psychological safety, and
agency.

## Evaluation

Measure:

- perceived support
- recognition moments
- emotional safety
- reflective depth
- meaningful return behavior
- longitudinal value

Do not optimize for:

- streaks
- completion rates
- content consumption
- time spent
- return frequency

## Example Journeys

### Burnout Recovery

The user enters while exhausted. The Container foregrounds restoration and
boundaries. Khepera responds more slowly and close to depletion. Mirror later
notices softening and the return of capacity without calling it progress.

Re-entry: "This space is still here. A question about rest remains available."

### Identity Transition

The user writes from uncertainty. The Container foregrounds liminality and
becoming. Khepera avoids premature clarity. Mirror notices emergence and
integration.

Re-entry: "The question of becoming can be touched again without needing to be
settled."

### Belonging

The user writes about distance. The Container foregrounds connection and trust.
Khepera avoids prescribing social action. Mirror notices recurring questions
about closeness and acceptance.

Re-entry: "A thread about connection remains alive."

### Self-Compassion

The user writes from self-criticism. The Container foregrounds gentleness and
self-worth. Khepera avoids arguing with the critic or praising performance.
Mirror notices softening around self-judgment.

Re-entry: "The part asking not to be measured can be met again."

## Implementation Roadmap

1. Keep the new pure architecture layer isolated from legacy day-based
   container UI.
2. Add server-owned derived container memory writes after Khepera persistence is
   fully attested.
3. Add export/deletion coverage for `containerRelationships`.
4. Introduce Container context payloads into Khepera prompt planning without
   changing Khepera's three-part output contract.
5. Let Mirror consume derived Container movements.
6. Replace day/progress-oriented UI with relationship-state and inquiry-state
   presentation only after copy and privacy review.

The Container succeeds when it changes what becomes visible.
