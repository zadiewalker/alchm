# ALCHM Reviewer Journey Audit

Audit date: 2026-06-04

Scope: first five minutes of use, with ALCHM viewed as an App Store reviewer, Product Hunt reviewer, design curator, or wellness writer. This audit is intentionally experience-focused. It does not propose new architecture, new features, or a redesign.

## Reviewer Journey

| Moment | What Happens | Read |
| --- | --- | --- |
| First surprise | The home screen opens as a quiet sanctuary instead of a dashboard or chatbot. | ALCHM feels more like a private chamber than an AI tool. |
| First emotional connection | The prompt asks, "What wants to be held here?" | The app signals witness and containment before utility. |
| First confusion | Mirror, Containers, and Transformation are distinctive concepts, but first-time users may not immediately know whether they are features, places, or states of reflection. | The language should stay poetic while giving enough orientation to move safely. |
| First delight | The writing screen feels spacious and unhurried, with Khepera presented as something that returns after writing rather than a chat interface. | This is the strongest differentiation moment. |
| First differentiation | Archive, Mirror, and Containers frame writing as return, pattern, and context instead of notes, mood scores, or productivity records. | ALCHM's product difference is philosophical and experiential, not feature-count based. |

## Prompt Quality Review

| Surface | Current Strength | Weakness Found | Action |
| --- | --- | --- | --- |
| Dashboard | "What wants to be held here?" is memorable and screenshot-worthy. | None. | Preserved. |
| Journal writing | "Write what is here." is simple, spacious, and non-directive. | None. | Preserved. |
| Check-in | "How are you landing tonight?" feels reflective rather than metric-based. | Mood chips could become generic if styling drifts. | Preserved after prior chip softening. |
| Mirror | The concept is unique. | Some copy described mechanics more than recognition. | Refined Mirror lead/loading/empty copy toward return and recognition. |
| Transformation | "Sanctuary remains complete" is low-pressure. | "Open subscription options" felt transactional in the hero surface. | Reframed as "View Transformation options" with gentler support copy. |

## Transformation Moment Review

ALCHM's clearest value moments are not data visualizations or feature panels. They are moments where the user understands that the app is holding continuity:

- Dashboard: the user is invited into a private reflective space.
- Journal: writing remains primary; Khepera does not dominate authorship.
- Mirror: the app waits for themes and questions to recur before surfacing them.
- Transformation: the paid surface is framed as continuity, not pressure.

The main improvement was to make Mirror's first-time and loading states feel less like "feature unavailable until data exists" and more like "nothing needs to be forced yet."

## Empty State Opportunities

| Empty State | Opportunity | Decision |
| --- | --- | --- |
| Dashboard | Absence should feel restful, not missing. | Existing quiet whisper remains strong. |
| Archive | First entry absence should feel like invitation. | Existing "where your words will live" copy remains strong. |
| Mirror | Absence should teach ALCHM's philosophy of return. | Updated to emphasize old questions and quiet themes surfacing over time. |
| Search/filter | No result should remain plain and clear. | Preserved for clarity. |

## Microcopy Audit

Generic or transactional language found:

- "Open subscription options"
- "Mirror gathers selected returns over time"
- "Checking for returns"
- "when there is enough writing to show them"

Refinements made:

- "View Transformation options"
- "Mirror shows what keeps returning"
- "Letting returns gather"
- "When enough has gathered, old questions and quiet themes can surface here without turning your journal into a feed"

These changes preserve clarity while making ALCHM feel less interchangeable with AI journaling and subscription products.

## Screenshot Test

The five strongest reviewer screenshots are:

1. Dashboard hero: ALCHM, greeting, "What wants to be held here?"
2. Journal writing screen: large prompt and quiet writing chamber.
3. Check-in: "How are you landing tonight?" with soft emotional vocabulary.
4. Mirror empty/loading state: "Mirror shows what keeps returning."
5. Transformation intro: low-pressure continuity framing.

Screens to avoid as primary marketing screenshots:

- Lower subscription diagnostics.
- Dense archive search/filter states.
- Utility settings.

## Differentiation Audit

Compared with common journaling and AI reflection apps, ALCHM feels most distinct when it refuses these patterns:

- no streak framing
- no productivity dashboard
- no mood score
- no chat bubbles
- no assistant prompt box
- no feed of extracted insights
- no urgency to complete or catch up

The refined copy strengthens the idea that ALCHM is a place where things return over time, not a tool that analyzes the user on demand.

## Implemented Refinements

- Mirror lead, loading, and empty-state language now centers recurrence and recognition.
- Transformation hero copy now reads as a gentle invitation rather than a subscription control.
- Restore purchase label was normalized to sentence case.

## Risks Avoided

- No new product behavior.
- No new architecture.
- No Khepera prompt or output changes.
- No data flow, auth, Firestore, release, runtime, or crisis changes.
- No increase in pressure, gamification, or dependency framing.
