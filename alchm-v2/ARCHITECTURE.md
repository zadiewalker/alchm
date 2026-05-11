# ALCHM v2 Architecture

ALCHM v2 is a static-export Next.js app designed to run inside a Capacitor iOS WKWebView. There is no runtime server and no SSR.

## File Structure
`src/`
- `app/`
  - `layout.tsx`: Root layout, global styles, and top-level `ErrorBoundary` + `PageShell`
  - `page.tsx`: Splash
  - `onboarding/`: First-time flow
  - `dashboard/`: Home
  - `journal/`: Entry list and entry detail modal
  - `journal/new/`: Entry creation + reflection flow
  - `checkin/`: Evening check-in
  - `insights/`: Lightweight insights from entries
  - `pathways/`: Guided pathways (draft-based handoff to `/journal/new/`)
  - `settings/`: Preferences, API key entry (optional), export, clear data, legal links
  - `pricing/`: Tiers (no fake purchases)
  - `privacy/`, `terms/`: In-app legal pages
- `components/`
  - `PageShell.tsx`: Consistent page container + scroll area; mounts `CrisisFooter` + `CrisisModal`
  - `CrisisFooter.tsx`, `CrisisModal.tsx`: Always-available crisis resources (988, 741741)
  - `HealthDisclaimer.tsx`: Onboarding/settings disclaimers + AI disclosure
  - `LoadingState.tsx`, `EmptyState.tsx`, `ErrorState.tsx`: Standard states
  - `TypewriterText.tsx`: Reflection typewriter rendering
  - `MoodSelector.tsx`: Mood picker
  - `EntryCard.tsx`: Journal list card
  - `ErrorBoundary.tsx`: Crash recovery UI; logs via `console.error` only
- `lib/`
  - `types.ts`: Shared types
  - `design.ts`: Design tokens (copied from the existing app)
  - `storage.ts`: The only module that reads/writes on-device storage
  - `journal.ts`, `settings.ts`, `subscription.ts`, `onboarding.ts`: Domain helpers on top of storage
  - `crisis.ts`: Keyword-based crisis detection (pure function)
  - `khepera.ts`: Prompt assembly + safety rails
  - `api.ts`: Anthropic API client (optional; only used when a user-provided key exists)
  - `localReflection.ts`: Offline fallback reflection generator
  - `export.ts`: Data export (Capacitor Share with web fallback)
  - `pathways.ts`: Pathway definitions + lightweight progress tracking

## Data Flow
1. User writes an entry in `/journal/new/`.
2. Draft auto-saves to `alchm-draft-entry` (debounced).
3. On save, the entry is inserted into `alchm-journal-entries` and draft is cleared.
4. If the user requests a reflection:
   - If an Anthropic key is present: `lib/api.ts` calls the Anthropic Messages API.
   - Otherwise: `lib/localReflection.ts` generates a local reflection.
5. The reflection is displayed with `TypewriterText` and persisted back onto the entry.
6. Crisis keywords are checked locally before/while saving; crisis UI is surfaced without blocking save.

## Storage Schema (Keys)
All keys are prefixed `alchm-` and accessed only via `src/lib/storage.ts`.
- `alchm-settings`: `AppSettings`
- `alchm-journal-entries`: `JournalEntry[]`
- `alchm-draft-entry`: `Partial<JournalEntry>` (draft)
- `alchm-subscription`: `SubscriptionState`
- `alchm-onboarding-complete`: `boolean`
- `alchm-last-entry-date`: `string` (ISO date)
- `alchm-current-streak`: `number`
- `alchm-longest-streak`: `number`
- `alchm-anthropic-api-key`: `string` (user-provided; optional)

## Navigation Map
- `/` → `/onboarding/` (first run) or `/dashboard/` (returning)
- `/dashboard/` → `/journal/`, `/journal/new/`, `/checkin/`, `/insights/`, `/pathways/`, `/settings/`
- `/pathways/` → writes a draft + routes to `/journal/new/`
- `/settings/` → `/privacy/`, `/terms/`

## Safety
- 988 is within one tap on every screen via `CrisisFooter` rendered by `PageShell`.
- Khepera safety rails are enforced in prompt assembly (`lib/khepera.ts`), including:
  - AI disclosure (Khepera is AI, not a professional)
  - No diagnosis/prescription
  - Crisis escalation language (988 / 741741)
- Crisis detection is local keyword matching (`lib/crisis.ts`) to trigger immediate UI.

