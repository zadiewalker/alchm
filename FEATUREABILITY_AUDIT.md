# ALCHM Featureability Audit

Audit date: 2026-06-04

Screenshot sets:

- Before refinement: `/tmp/alchm-luxury-reduction-before`
- After refinement: `/tmp/alchm-luxury-reduction-after`

## Summary

ALCHM already presents a distinctive first impression: quiet sage atmosphere, editorial prompt typography, muted gold action language, and a low-pressure sanctuary posture. The strongest featureability signal is that the writing screen does not feel like a note-taking tool or chatbot surface. It feels like a chamber for thought.

The refinement opportunity was not to add more. It was to remove visual tension from utility states so reviewers experience one continuous sanctuary rather than a beautiful opening followed by ordinary app controls.

## First Impression Audit

| Screen | Memorable | Generic Risk | Premium Signal | Unfinished Risk | Reviewer Screenshot |
| --- | --- | --- | --- | --- | --- |
| Home / Dashboard | Sage full-screen ground, centered ALCHM presence, editorial hero card | Empty state could feel like a missing-data panel if crowded by nav | Muted gold CTA, generous quiet, poetic hierarchy | Lower mobile content can crowd the fixed footer | Dashboard hero and chamber navigation |
| First Journal Prompt | Large serif prompt and chamber surface | None significant | The writing surface is the clearest product differentiator | CTA can sit close to footer on short screens | Writing prompt + chamber |
| Writing Screen | “Write what is here.” feels authored and calm | Could become a document editor if surface gets too bright | Spacious paper/chamber treatment | Overly visible chrome would reduce intimacy | Full writing screen |
| Emotional Check-In | Short emotional vocabulary, quiet horizontal rhythm | Chips could read as filter pills | Soft tokens now make choices feel reflective | Horizontal overflow is acceptable but should remain graceful | Check-in card with chips |
| Transformation / Upgrade | Copy preserves “Sanctuary remains complete” | Monetization card stack can feel transactional | Low-pressure language, subdued CTAs | Diagnostic panel is useful but visually utilitarian | Transformation intro, not diagnostics |
| Empty Entries | Moon symbol and soft copy are on-brand | Can read as missing data if spacing is too tight | More negative space makes absence intentional | Footer overlap must be avoided | Empty archive/dashboard state |
| Footer Navigation | Persistent orientation without heavy chrome | Can resemble a default tab bar if too pale or active state too strong | Token-backed sage nav feels native to ALCHM | Needs bottom clearance on short screens | Dashboard with nav |
| Settings | Clear and restrained | Export controls are utility-heavy by nature | Existing typography and cards preserve tone | Dense controls can feel less sanctuary-like | Not a primary reviewer screenshot |

## Memorable Moments

- The journal chamber is the most important first-three-minutes moment.
- The dashboard’s “What wants to be held here?” card clearly distinguishes ALCHM from utility journaling.
- Mirror and Containers are conceptually differentiated, but their strongest featureability depends on calm empty/loading states because first-time users may not have data.
- Khepera should remain present through reflection surfaces, not as a chatbot widget.

## Refinements Implemented

- Shared empty states received more intentional spacing, measure, and action rhythm.
- Archive search/filter controls were softened to match the emotional vocabulary chip treatment.
- Existing visual reduction work preserved softer borders, lower surface shadows, muted gold CTAs, and sage footer navigation.

## Decisions Not To Change

- No new features were added.
- No new visual motifs were introduced.
- No product flow or copy architecture was changed.
- No Khepera, subscription, auth, Firestore, runtime, analytics, crisis, or release logic was touched.

## Remaining Visual Risks

- Transformation diagnostics remain visually utilitarian by necessity; avoid using that lower section in marketing screenshots.
- Some first-time empty states depend on viewport height and fixed navigation. The shared layout now provides more bottom clearance, but screenshots should favor the hero, writing, check-in, and Mirror/Container concept surfaces.
- Settings is intentionally functional and should not carry the brand’s first impression.

## Recommended Reviewer Screenshot Path

1. Dashboard hero with navigation chamber.
2. Journal writing screen.
3. Emotional check-in.
4. Mirror empty state or Transformation intro, depending on available evidence/data.
5. Containers overview if populated.

## Acceptance Read

The app should now feel nearly unchanged but quieter in utility moments: more sanctuary, less component library; more reflective product, less AI journaling app.
