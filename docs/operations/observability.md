# Observability And Release Attribution

ALCHM runtime telemetry must be attributable to a release artifact.

## Runtime Tags

Operational telemetry adds these fields to Sentry events and breadcrumbs:

- `releaseId`
- `gitCommit`
- `buildTimestamp`
- `appVersion`
- `iosBuildNumber`
- `platform`
- `deploymentTarget`
- `online`

Production deploy environments should set:

```bash
NEXT_PUBLIC_RELEASE_ID
NEXT_PUBLIC_GIT_COMMIT
NEXT_PUBLIC_BUILD_TIMESTAMP
NEXT_PUBLIC_DEPLOYMENT_TARGET
NEXT_PUBLIC_APP_VERSION
NEXT_PUBLIC_ENV
NEXT_PUBLIC_SENTRY_DSN
```

## Source Maps

`next.config.js` enables Sentry source-map upload only when all upload credentials exist:

```bash
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
```

If those variables are missing, local and CI static export builds continue without upload. Production certification requires the deploy environment to prove source maps were uploaded for the release id in `release-artifacts/release-manifest.json`.

## Chunk Load Failures

Chunk-load errors are not suppressed. They are tagged as:

```text
alchm_issue=chunk_load_failure
```

This lets operations distinguish stale-cache/chunk failures from application exceptions.

## Startup Signals

Startup telemetry is emitted for:

- splash route loaded
- JS hydration shell visible
- document readiness
- startup hard timeout fallback
- native splash dismissal
- auth bootstrap started
- auth bootstrap ready/fallback/error

## Replay Signals

Queue replay telemetry is emitted for:

- queue bootstrap import failure
- IndexedDB unavailable / non-durable fallback
- replay backlog count
- retry exhaustion
- replay failure classification
