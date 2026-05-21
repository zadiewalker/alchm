# ALCHM Security Risk Register

## Current Audit Disposition

Status: no accepted production dependency vulnerabilities.

The release gate runs:

```bash
npm audit --omit=dev --audit-level=moderate
```

As of this remediation, the audit passes after targeted dependency overrides:

- `@tootallnate/once` is forced to `^3.0.1` to remove the Firebase Admin transitive advisory path.
- `postcss` is pinned to `8.5.14` and used as the npm override target so Next's nested PostCSS copy resolves to the patched version.

These overrides must remain covered by:

- `npm ci`
- `npm ls firebase-admin next postcss @tootallnate/once`
- `npm audit --omit=dev --audit-level=moderate`
- `npm run certify:release`

## Risk Acceptance Policy

Production certification may accept an unresolved audit finding only with an explicit operator-approved entry containing:

- package
- dependency path
- severity
- exploit surface
- reason accepted
- owner
- expiration or review date
- planned remediation
- approval reference

No risk acceptance is currently active.
