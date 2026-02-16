# ALCHM Surgery Log

## Pre-Surgery Baseline
- Date: 2026-02-16
- Branch: `main`
- Pages: 32
- Bundle size: `out/` 3.7M, `out/_next/` 808K
- Total `src/` files: 468
- Total project files (excluding `node_modules/`, `.git/`, `.next/`, `out/`): 20129
- TypeScript errors (`npx tsc --noEmit`): 4737
- Duplicate files matching `* 2.*`: 422

## Phase 2: Quarantine Duplicates
- Moved into `_quarantine/duplicates/`: 442 files
- Remaining `* 2.*` outside quarantine: 0
- Build: ✅ (`32` pages still generated)
- Note: `_quarantine/` is git-ignored to avoid committing dead artifacts.
