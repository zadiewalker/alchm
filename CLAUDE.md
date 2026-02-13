# CLAUDE.md — ALCHM Project Rules

> This file is read by Claude Code at the start of every session. It contains hard-won lessons from building this app. Violating these rules wastes hours of debugging. Read the entire file before making any changes.

## PROJECT ARCHITECTURE

ALCHM is a trauma-informed mental health journaling iOS app built with:
- **Next.js 15** (App Router) with output: 'export' for static HTML generation
- **React 19** with 'use client' components (no server components — this is a static export)
- **Capacitor 6** wrapping the static export in a native iOS WebView
- Deployment: Static files in out/ → synced to ios/App/App/public/ → loaded by Capacitor WKWebView at capacitor://localhost

The app is NOT a traditional Next.js server-rendered app. There is no Node.js server. There is no SSR. Every page must be fully client-side renderable from static HTML + JS bundles.

## ABSOLUTE RULES — NEVER VIOLATE

### 1. DIAGNOSE BEFORE YOU FIX
Never make changes based on assumptions. Run diagnostic commands first, paste the output, explain what you found, THEN propose changes.

### 2. DO NOT TOUCH WHAT YOU WEREN'T ASKED TO TOUCH
If asked to fix navigation, do NOT change the scarab SVG, title styling, button design, color palette, or layout composition. Scope your changes to exactly what was requested. If you believe a broader change is needed, ASK FIRST.

### 3. INLINE STYLES ONLY — NO TAILWIND FOR VISUAL STYLING
Tailwind utility classes DO NOT reliably load in the Capacitor iOS WebView. Every visual style must use React inline style={{}} props.

### 4. NAVIGATION: USE NEXT.JS ROUTER, NEVER window.location
In Capacitor WKWebView, window.location.href triggers a FULL PAGE RELOAD causing redirect loops. Always use router.push() from next/navigation.

### 5. NO SERVER-SIDE DIRECTIVES IN CLIENT COMPONENTS
export const dynamic, export const revalidate, export const runtime do nothing in 'use client' components. Remove them.

### 6. ALWAYS REBUILD + SYNC + CLEAN AFTER CHANGES
rm -rf .next out && npm run build && npx cap sync ios, then in Xcode: Clean Build Folder + Run.

### 7. EACH ROUTE NEEDS ITS OWN STATIC HTML
Verify after every build: find out/ -name "index.html"

### 8. NEVER SET distDir IN NEXT.CONFIG
distDir controls the build cache directory (default .next/). output: 'export' exports to out/. If you set distDir: 'out', they collide and the build generates ZERO App Router pages.

### 9. SET trailingSlash: true IN NEXT.CONFIG
Ensures each route generates a directory with index.html (e.g., out/dashboard/index.html).

## PROTECTED DESIGN ELEMENTS — DO NOT MODIFY UNLESS EXPLICITLY ASKED

### Scarab SVG (Khepera)
Wide dome head, visible D-shaped wing lobes, segmented body. Colors: #D8CA7B (sun disk), #EAE5D9 (body/wings), #D5D0C4 (segment lines). Size: width: 64px, height: 80px.

### Title
Text: A L C H M (with spaces between each letter). letterSpacing: '0.35em'. fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'. Color: rgba(255, 255, 255, 0.92). Font: 36px, weight 300, uppercase, whiteSpace: 'nowrap'.

### Background
Gradient: linear-gradient(to bottom, #8B9A7C, #A8B5A0)

### Button
Gold pill: backgroundColor: '#E8C56D'. 16px vertical padding. White uppercase text, 15px, weight 500, letterSpacing: '0.12em'. Dead center text.

### 988 Footer
Pinned to bottom via marginTop: 'auto'. Text: "Crisis support available · 988". Color: rgba(255,255,255,0.45), 13px.

## COMMON PITFALLS

| Mistake | What happened | Prevention |
|---------|--------------|------------|
| Used window.location.href for navigation | Full page reload caused redirect loop | Always use router.push() |
| Used Tailwind classes for sizing | SVG rendered at 0x0, invisible in iOS | Use inline style={{}} |
| Changed scarab during unrelated fix | Design regressed | Only touch what's requested |
| Skipped npx cap sync ios | iOS served old files | Always run full rebuild chain |
| Skipped rm -rf .next out before build | Stale cache caused phantom bugs | Always clean first |
| Added export const dynamic in client component | Meaningless | Only 'use client' needed |
| Fixed symptoms instead of root cause | Wasted multiple sessions | Diagnose fully first |
| Set distDir: 'out' in next.config | Build cache and export collide — zero pages generated | NEVER set distDir |
| Manually created HTML files in out/ | Placeholder files masked missing build output | Never hand-write files in out/ |
| No fontFamily on h1 elements | iOS WebView defaults to Times New Roman | Always set fontFamily on headings |
| Overly complex webpack config | Custom splitChunks caused build issues | Let Next.js handle chunk splitting |

## DEBUGGING CHECKLIST

1. What do the Xcode console logs say?
2. Does out/ have the expected HTML files? (find out/ -name "index.html")
3. Are the HTML files real Next.js output? (should have script tags, be several KB)
4. Are the HTML files different per route? (diff out/index.html out/dashboard/index.html)
5. Did cap sync copy them to iOS?
6. Are script paths relative?
7. Is there a middleware.ts redirecting?
8. Are there auth guards redirecting to /?