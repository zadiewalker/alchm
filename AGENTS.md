# ALCHM Agent Instructions

ALCHM release-certification work is safety and reliability work. Treat missing evidence as uncertified.

## Protected Areas

- Do not change clinical or safety logic without an explicit request.
- Do not change Khepera generation, crisis detection ordering, Containers behavior, subscription logic, or UI design surfaces during release-certification work.
- Do not make cosmetic refactors as part of certification.

## Release Certification Discipline

- Always inspect the repository state before editing.
- Always run `npm run certify:release` after release, deployment, native, observability, or certification changes.
- Preserve native/web sync verification between `out/` and `ios/App/App/public`.
- Preserve release manifest generation and verification.
- Preserve deployment topology authority: Vercel is authoritative production web, Firebase Hosting `alchmapp` is static compatibility/redirect, and Firebase App Hosting `studio` is non-authoritative unless explicitly re-certified.
- Never claim production certification without external gates: branch protection, Xcode Cloud/native archive, authoritative deploy, App Hosting disposition, and Sentry release/source-map proof.
- Repository-certified does not mean production-certified.
- Documented non-authoritative does not mean externally disabled.
- Configured Sentry does not mean source maps are proven uploaded.
- Local Xcode build passed does not mean Xcode Cloud archive passed.
