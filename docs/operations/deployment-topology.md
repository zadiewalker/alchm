# ALCHM Deployment Topology

Authoritative production web target: Vercel project `alchm`.

## Active Targets

- Vercel project `alchm`: authoritative production web deployment for the Next.js application. Production URL: `https://alchm.vercel.app`.
- Firebase Hosting site `alchmapp`: static export compatibility surface that serves `out/` and redirects app traffic to Vercel.
- iOS Capacitor bundle: authoritative mobile runtime artifact built from `out/` and copied into `ios/App/App/public`.

## Non-Authoritative Legacy Target

Firebase App Hosting `studio` is non-authoritative until explicitly re-certified.

The backend exists externally:

- Project: `alchm-digital-sanctuary`
- Region: `us-central1`
- Backend: `studio`
- URL: `https://studio--alchm-digital-sanctuary.us-central1.hosted.app`

It must not block release authority after one of these operator actions is complete:

1. Disable/remove the `studio` backend and its GitHub check, or
2. Add an explicit `apphosting.yaml`, make App Hosting green, and update this topology document to make App Hosting authoritative or preview-only.

GitHub workflows must not require Firebase App Hosting `studio` unless this document is updated and the backend is green.

## Vercel Authority Verification

Production certification requires Vercel evidence from project `alchm`, not any locally linked scratch or duplicate project.

Before release, verify:

```bash
npm run verify:vercel-authority
vercel project ls
vercel ls alchm --yes
vercel inspect <production-deployment-url>
```

The deployment must be `Ready`, target `production`, aliased to `https://alchm.vercel.app`, and traceable to the release commit.

If local `.vercel/project.json` points to any project other than `alchm`, local Vercel inspection is not production-authoritative until the project link is corrected or commands explicitly target `alchm`.

`npm run verify:vercel-authority` fails on the known non-authoritative `alchm-authoritative` project link and is included in release certification through `npm run verify:deployment-topology`.

## Firebase Hosting Contract

`firebase.json` deploys:

- public directory: `out`
- site: `alchmapp`

This target is static-export only. Do not point Firebase Hosting at `.next`, `.next-launch`, or a server runtime.

## Rollback

Vercel rollback:

1. Identify the last known good deployment for the target commit.
2. Promote/rollback in Vercel to that deployment.
3. Confirm the GitHub Vercel status and runtime smoke checks.

Firebase Hosting rollback:

1. Use Firebase Hosting release history for site `alchmapp`.
2. Roll back to the prior version for the same static topology.
3. Confirm redirect behavior and core route availability.

iOS rollback:

1. Rebuild from the prior release commit.
2. Run `npm run build:ios-release`.
3. Generate a release manifest.
4. Archive with `ios/App/App.xcworkspace`, scheme `App`.

## Required Checks

Release authority requires:

- Validate
- Navigation E2E
- CodeQL
- Operational Certification
- Xcode Cloud Archive - iOS, or an approved equivalent native archive
- Vercel deployment success
- Firebase App Hosting `studio` disabled, de-scoped, or green with documented authority
