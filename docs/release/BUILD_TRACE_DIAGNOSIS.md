# Build Trace Diagnosis

## Status

`LOCAL BUILD REMEDIATED - CLEAN CANDIDATE REQUIRED`

## Root Cause

`next build` for the static export can remove `.next/server/pages/_document.js`
after the server compiler has produced the server manifests and before page
data collection needs the Pages runtime fallback. A previous snapshot restore
guard only restored when server manifests were missing; it did not restore when
the manifests remained but `_document.js` had been removed.

## Local Fix

`next.config.js` now treats these files as required server build state:

- `.next/server/pages-manifest.json`
- `.next/server/app-paths-manifest.json`
- `.next/server/pages/_document.js`

If any are absent after the client compiler, the server snapshot is restored
before page-data collection and build trace finalization.

Because this release uses static export, `outputFileTracing` is disabled for
the candidate build. The exported artifact must be certified through hosting,
Functions, rules, and deployment-lineage evidence rather than Next server trace
output.

## Certification Effect

This closes the local build completion blocker only after the same command
passes from a clean fixed candidate SHA. It is not deployment evidence.
