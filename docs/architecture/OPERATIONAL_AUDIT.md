# ALCHM Operational Audit

## Maintainability Assessment

The recent architecture foundations are ambitious but maintainable if integration stays incremental. The largest operational risk is not code size. It is hidden coupling between memory systems.

## Complexity Risks

### Three Memory Models

Khepera, Mirror, and Containers each introduced derived memory structures.

Risk: future engineers may store the same concept three times or route raw content into the wrong layer.

Mitigation: use one cognition adapter and one unified memory contract.

### Theme Vocabulary Drift

Mirror themes and journal theme tags differ.

Risk: retrieval and response planning become inconsistent.

Mitigation: centralize mapping in `src/lib/cognition/ecosystem.ts`.

### Invisible Decision Logic

Khepera intervention decisions, Mirror movement detection, and Container lensing can be hard to debug if no decision metadata is emitted.

Mitigation: log metadata-only decision summaries in future work. Do not log raw entries.

## Observability Requirements

Future operational traces should include:

- candidate theme tags
- selected intervention family
- rejected intervention families
- memory retrieval decision
- container id
- Mirror movement ids
- safety override status
- schema version

They must not include:

- raw entry text
- quoted excerpts
- generated private reflection text unless user-owned export requires it
- provider secrets

## Scalability

Short term:

- compute cognition context synchronously from existing derived inputs
- avoid background workers for initial integration

Medium term:

- use background jobs for Mirror pattern updates
- cache stable Mirror movements by user and container
- recompute syntheses when new derived observations arrive

Long term:

- version derived memory schemas
- support backfills without reading raw journal text into cognition memory

## Debuggability

Every derived memory record should answer:

- which system owns it
- which source ids contributed to it
- what confidence level it carries
- when it expires or should be reviewed
- whether it is safe for Khepera retrieval

## Small-Team Operating Recommendation

Do not wire Containers, Mirror, and Khepera all at once. Use the adapter as a checkpoint. Each phase should have tests proving:

- no raw-text memory transfer
- safety override behavior
- no pressure mechanics
- explainable retrieval decisions

## Implemented Operational Improvement

The audit adds a tested adapter seam so future integration has one place to inspect cross-system handoff.
