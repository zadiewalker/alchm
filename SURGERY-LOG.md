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

## Phase 3: Quarantine Dead Directories + Debug/Admin/API/Middleware
- Quarantined (moved out of `src/`): `ai/`, `khepera/`, `security/`, `monitoring/`, `middleware/`, `policies/`, `professional/`, `cultural/`, `examples/`, `__tests__/`, `contexts/`, `beta/`, `animations/`, `genkit/`, `messages/`, `locales/`, `styles/`, `types/`, `testing/`, `pages/`, `crisis/`, `mobile/`
- Quarantined routes: `src/app/admin/`, `src/app/test*`, `src/app/debug*`
- Quarantined API route handlers: `src/app/api/`, `src/app/api.disabled/`
- Quarantined middleware (dead in static export): `src/middleware.ts`, `src/middleware-legal.ts`, root `middleware.ts`
- Quarantined legacy root `pages/` (removed `/api/reflection` from build output)
- Build: ✅ Pages now `26` (down from `32` after removing debug/admin/test/api routes)
