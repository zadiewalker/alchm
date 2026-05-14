# Emotional Language Governance

ALCHM protects emotional trust by keeping product language calm, observational, and non-performative.

This is operational infrastructure, not brand polish. If a phrase makes ALCHM feel like a tracker, coach, analytics tool, therapy product, or engagement engine, it should not ship.

## Review Posture

- Prefer silence over explanation.
- Prefer continuity over growth framing.
- Prefer emotional dignity over emotional intelligence.
- Prefer observational language over analytical language.
- Prefer deletion over preserving abandoned experiments.

## Retirement Rules

- Delete dead surfaces that depend on prediction, analytics, progress, challenge, or healing-journey framing.
- Quarantine only when a surface may still be needed operationally but cannot safely re-enter active UI.
- Rewrite only active surfaces that are reachable and product-critical.
- Do not add runtime language moderation or AI rewriting.

## Guardrails

- `src/config/emotionalLanguage.ts` is the canonical static policy.
- `npm run qa:emotional-language-guards` blocks unsafe copy in governed surfaces.
- Retired surfaces must not reappear without explicit emotional-language review.
- Quarantined surfaces must not be imported by active routes or components.

## Escalation

Escalate any user-facing copy that implies:

- progress, streaks, achievement, or consistency
- prediction, analytics, trends, or dominant emotion
- healing promises, trauma recovery, or diagnosis
- nostalgia mechanics such as anniversaries or memory-lane framing
- behavioral pressure to return, continue, or catch up
