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

## Phase 4: Drive TypeScript Errors to Zero
- Updated `tsconfig.json` to only typecheck app code under `src/**` (and exclude `_quarantine/`, `out/`, etc.).
- Quarantined dead/unreferenced modules that were still being typechecked:
  - `src/lib/advancedAI.ts` + `src/components/AIInsightsDashboard.tsx`
  - `src/lib/transformationEngine.ts` + `src/components/DailyTransformation.tsx` + `src/components/ChallengeLibrary.tsx`
  - `src/lib/secureStorage.ts` (and removed secure-storage dynamic import from `src/utils/browser.ts`)
  - `src/lib/aiService.ts` + `src/lib/kheperaMemory.ts`
  - `src/lib/globalization.backup/` + `src/components/ui/LocaleProvider.tsx`
- Removed dead navigation telemetry (Sentry/Prisma instrumentation chain) that only created build warnings.
- TypeScript errors: ✅ `0`
- Build: ✅ (`26` pages)

## Phase 5: Quarantine More Dead Weight (Admin/Monitoring/Payments)
- Quarantined admin-only components (not reachable after removing `/admin` route): `src/components/admin/*`
- Quarantined unused monitoring/telemetry wrappers: `src/components/AppInitializer.tsx`, `src/components/CapacitorErrorHandler.tsx`, `src/components/UsageMonitor.tsx`
- Quarantined unused consent/pathway glue: `src/components/ConsentManager.tsx`, `src/lib/pathwayProgress.ts`
- Quarantined server-only libs that should never ship in a static-export iOS WebView build:
  - `src/lib/stripe.ts`, `src/lib/firebaseAdmin.ts`, `src/lib/openaiWithRateLimit.ts`, `src/lib/rateLimiting.ts`
  - `src/lib/analytics.ts`, `src/lib/performance.ts`, `src/lib/hipaaAuditLogger.ts`, `src/lib/usageService.ts`, `src/lib/crisisMonitoring.ts`
- TypeScript errors: ✅ `0`
- Build: ✅ (`26` pages, stable from real path `/Users/zadiewalker/Desktop/alchm`)

## Phase 6: Stabilize Next Build Tracing (Intermittent ENOENT)
- Symptom: `next build` intermittently failed during "Collecting build traces" with missing `.next/server/**.nft.json`.
- Fix: set `outputFileTracing: false` in `next.config.js` (static export in Capacitor does not need server tracing).
- Verified: two consecutive clean builds succeed (`26` pages each).

## Phase 7: Remove Production `console.log` + Quarantine More Unused UI
- Quarantined unused debugging/bootstrap components: `src/components/CapacitorAppLoader.tsx`, `src/components/IOSWebViewFix.tsx`, `src/components/DebugWrapper.tsx`
- Quarantined `src/scripts/` (not imported by the app; removed from `src/` to reduce noise/grep checks)
- Removed all `console.log` calls from app code (`src/`) to avoid Safari Web Inspector noise in production builds.
- TypeScript errors: ✅ `0`
- Build: ✅ (`26` pages)
