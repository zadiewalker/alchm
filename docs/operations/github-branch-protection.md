# GitHub Branch Protection

Production certification requires branch protection on `main`.

Required settings:

- Require pull request before merge.
- Require status checks before merge.
- Require branches to be up to date before merge if queueing is not enabled.
- Block force pushes.
- Block branch deletion.
- Include administrators if project policy allows.
- Require linear history if the release process uses squash or rebase merges.

Required checks:

- `validate` (workflow display name: `Validate`)
- `navigation-e2e` (workflow display name: `Navigation E2E`)
- `CodeQL`
- `release-integrity` (workflow display name: `Operational Certification`)
- `ALCHM | Default | Archive - iOS`, or the exact Xcode Cloud/native archive context configured for this repository
- `Vercel`, or the exact authoritative Vercel production deployment context configured for this repository

GitHub branch protection must use emitted check-run context names. Workflow display names are not enforceable status contexts unless GitHub emits them as check runs.

Read-only verification:

```bash
npm run verify:branch-protection
```

This script is read-only. It uses the GitHub CLI and fails when `main` is not protected or when required gates are missing.

The script currently verifies:

- protection exists for `main`
- pull request review or equivalent protected linear-history policy exists
- strict required status checks are enabled
- required status contexts are present
- force pushes are disabled
- branch deletion is disabled

By default the script requires:

```text
validate,navigation-e2e,CodeQL,release-integrity,ALCHM | Default | Archive - iOS,Vercel
```

If GitHub uses different exact status names, pass them explicitly:

```bash
REQUIRED_BRANCH_CHECKS="validate,navigation-e2e,CodeQL,release-integrity,<xcode context>,<vercel context>" npm run verify:branch-protection
```

External checks must still be green for the certified commit before production certification.
