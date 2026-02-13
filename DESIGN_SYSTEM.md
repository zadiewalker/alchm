# ALCHM Design System — Single Source of Truth

**This document is the canonical design reference for the entire ALCHM app. The splash screen described here has been APPROVED and must not be changed. All other screens must follow the same aesthetic, color system, and design philosophy.**

**Save this file to the project root as `DESIGN_SYSTEM.md` and reference it before making any visual changes to any page.**

---

## DESIGN PHILOSOPHY

ALCHM is a digital sanctuary. Every screen should feel like entering a quiet, warm room designed for one person. The design follows Jony Ive's principle of considered simplicity — nothing competes for attention, nothing shouts, everything breathes.

**Core rules:**
- No harsh contrasts. Everything is soft, muted, warm.
- No visual clutter. Generous whitespace. Let elements breathe.
- No gamification aesthetics. No badges, streaks, progress bars, confetti, or achievement unlocks.
- No aggressive CTAs. Buttons invite. They never demand.
- Warm, not cold. Cream, not pure white. Sage, not neon green. Muted gold, not bright yellow.

---

## APPROVED SPLASH SCREEN (DO NOT MODIFY)

The current splash screen at commit HEAD is **approved and frozen**. Before making changes to any file that affects this screen, run:

```bash
# Verify splash screen hasn't drifted
# The splash page component should match this spec exactly
```

### Splash Screen Elements (top to bottom):
1. **Sage green background** — full bleed, subtle gradient
2. **Khepera scarab icon** — centered, ~56-64px, cream/gold
3. **"A L C H M"** — white, light weight, wide letter-spacing
4. **Tagline** — white at 65% opacity, light weight
5. **"BEGIN YOUR JOURNEY" button** — muted gold pill, centered text
6. **"Crisis support available · 988"** — bottom-pinned, subtle

**RULE: If you are working on another page and need to touch a shared component (layout, navigation, color variables, global styles), verify the splash screen still looks correct after your changes.**

---

## COLOR PALETTE

### Primary Background
| Token | Hex | Usage |
|-------|-----|-------|
| `sage-light` | `#A8B09E` | Background gradient top, lighter areas |
| `sage` | `#9BA88E` | Primary background, default fill |
| `sage-deep` | `#8B9A7C` | Background gradient bottom, depth |

### Cream / Content Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#EAE5D9` | Scarab icon body, card backgrounds, warm surfaces |
| `cream-dark` | `#D5D0C4` | Subtle dividers, segment lines, secondary elements |
| `cream-light` | `#F2EDE3` | Highlighted surfaces, hover states |

### Gold Accent
| Token | Hex | Usage |
|-------|-----|-------|
| `gold-sun` | `#D8CA7B` | Scarab sun disk, small accent highlights |
| `gold-button` | `#E8C56D` | Primary CTA buttons, interactive gold elements |
| `gold-hover` | `#DDC060` | Button hover states |
| `gold-muted` | `#C9B96E` | Disabled or secondary gold elements |

### Text Colors
| Token | Hex / Value | Usage |
|-------|------------|-------|
| `text-primary` | `#FFFFFF` at 92% opacity | Headings, titles, primary text on sage |
| `text-secondary` | `#FFFFFF` at 65% opacity | Taglines, descriptions, secondary text on sage |
| `text-subtle` | `#FFFFFF` at 48% opacity | Footnotes, metadata, 988 footer |
| `text-on-gold` | `#FFFFFF` at 100% | Text on gold buttons |
| `text-on-cream` | `#5A6350` | Text on cream/light backgrounds |
| `text-on-cream-secondary` | `#7A8470` | Secondary text on cream backgrounds |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `crisis-red` | `#C47474` | Crisis/emergency indicators (muted, not alarming) |
| `success` | `#8B9A7C` | Positive states (use sage itself) |
| `surface-glass` | `rgba(255,255,255,0.08)` | Glassmorphism card overlays |
| `surface-glass-hover` | `rgba(255,255,255,0.12)` | Glassmorphism hover state |

### CRITICAL COLOR RULES:
1. **Never use pure white (`#FFFFFF` at 100%)** for surfaces or backgrounds. Use `cream` (`#EAE5D9`) or glass surfaces.
2. **Never use pure black (`#000000`)** anywhere. Darkest text should be `#3A4330` or similar.
3. **Never use bright/saturated colors.** Everything is muted and warm.
4. **`gold-sun` and `gold-button` are DIFFERENT colors.** Sun disk is darker/more muted. Buttons are lighter/warmer.
5. **The sage background should appear across ALL screens** — it's the app's signature. No page should have a white or dark background.

---

## TYPOGRAPHY

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
```

### Type Scale (on sage backgrounds)
| Style | Size | Weight | Tracking | Opacity | Usage |
|-------|------|--------|----------|---------|-------|
| Display | 36-42px | 300 | 0.3em | 92% white | App title "A L C H M" |
| Heading 1 | 28-32px | 300 | 0.02em | 92% white | Page titles |
| Heading 2 | 22-26px | 400 | 0.01em | 90% white | Section headers |
| Body | 16-18px | 300-400 | normal | 65-70% white | Descriptions, taglines |
| Body Small | 14-15px | 400 | normal | 65% white | Cards, list items |
| Caption | 12-13px | 400 | normal | 48% white | Footnotes, metadata |
| Button | 15-16px | 500 | 0.12em | 100% white | CTA text (uppercase) |

### Typography Rules:
1. **Prefer light weights (300-400).** Only buttons and emphasis use 500-600.
2. **Wide letter-spacing is only for the app title.** All other text uses normal or very slight tracking.
3. **Uppercase is reserved for buttons** and the app title. Body text is sentence case.
4. **Line height: 1.5-1.6** for all body text. 1.2 for headings.

---

## COMPONENTS

### Buttons

#### Primary CTA (Gold Pill)
```
Background: #E8C56D (gold-button)
Text: white, uppercase, tracking-wide, text-base, font-medium
Shape: rounded-full (border-radius: 9999px)
Padding: py-5 (20px vertical)
Width: ~80% of screen (mx-8 or equivalent)
Layout: flex items-center justify-center text-center whitespace-nowrap
Hover: #DDC060 (gold-hover)
No border. No shadow.
```

#### Secondary Button (Ghost/Outline)
```
Background: transparent
Border: 1px solid rgba(255,255,255,0.3)
Text: white at 80% opacity, normal case, text-sm
Shape: rounded-full
Padding: py-3 px-6
Hover: background rgba(255,255,255,0.08)
```

#### Text Button / Link
```
Background: none
Text: gold-button (#E8C56D), text-sm, font-medium
No border, no underline
Hover: underline
```

### Cards (Glassmorphism)
```
Background: rgba(255,255,255,0.08) — surface-glass
Backdrop: backdrop-blur-sm
Border: 1px solid rgba(255,255,255,0.1)
Border-radius: 16px (rounded-2xl)
Padding: p-5 to p-6
Hover: rgba(255,255,255,0.12)
No hard shadows. Subtle depth only.
```

### Input Fields
```
Background: rgba(255,255,255,0.08)
Border: 1px solid rgba(255,255,255,0.15)
Border-radius: 12px (rounded-xl)
Text: white at 90%
Placeholder: white at 40%
Focus border: rgba(232,197,109,0.5) — gold tint
Padding: py-3 px-4
```

### Mood Pills (for mood selection)
```
Background: rgba(255,255,255,0.1) — unselected
Background: #E8C56D — selected
Text: white at 70% — unselected
Text: white at 100% — selected
Shape: rounded-full
Padding: py-2 px-4
Font-size: text-sm
```

### Navigation / Tab Bar
```
Background: rgba(139,154,124,0.95) — sage with slight transparency
Border-top: 1px solid rgba(255,255,255,0.1)
Icons: white at 50% — inactive
Icons: #E8C56D — active (gold)
Labels: text-xs, same opacity as icons
Safe area padding at bottom
```

---

## LAYOUT PRINCIPLES

### Spacing Scale (Tailwind)
- `4px` (p-1) — Tight: between icon and label
- `8px` (p-2) — Compact: within card elements
- `16px` (p-4) — Standard: between related elements
- `24px` (p-6) — Comfortable: between sections
- `32px` (p-8) — Breathing: major section gaps
- `48-64px` (p-12 to p-16) — Expansive: hero spacing

### Screen Structure
Every screen in the app follows this pattern:
```
┌──────────────────────┐
│ [Safe area]          │
│ [Header / Nav]       │ — if applicable
│                      │
│ [Content]            │ — centered, padded px-6 to px-8
│                      │
│                      │ — generous bottom spacing
│ [Crisis footer]      │ — "Crisis support available · 988"
│ [Tab bar]            │ — if applicable
│ [Safe area]          │
└──────────────────────┘
```

### Critical Layout Rules:
1. **Every screen has the sage green background.** No exceptions.
2. **Every screen shows "Crisis support available · 988"** — either above the tab bar or at the bottom. Always visible, always subtle.
3. **Horizontal padding: `px-6` to `px-8`** (24-32px) on all screens. Content never touches screen edges.
4. **No horizontal scrolling.** Ever.
5. **Vertical scrolling is fine** but should be smooth and content should not feel cramped.

---

## ICONOGRAPHY

### Khepera Scarab
- Used ONLY on splash screen and where the full brand mark is needed
- Never modify the SVG. Reference the existing component.
- Display size: 56-64px on splash, 32-40px if used elsewhere (e.g., loading states)

### UI Icons
- Style: Thin line icons (stroke-width 1.5-2px)
- Color: white at 60-70% opacity (inactive), white at 90% (active), gold for selected states
- Size: 24px standard, 20px compact
- Source: Lucide icons or similar clean line icon set
- **Never use filled/solid icons.** Always outline/line style to match the minimal aesthetic.

---

## ANIMATION & TRANSITIONS

- **Duration: 200-300ms** for micro-interactions (buttons, toggles)
- **Duration: 400-600ms** for page transitions, modal appearances
- **Easing: ease-out** for entrances, ease-in for exits
- **No bouncy or springy animations.** Everything is calm and deliberate.
- **No loading spinners.** Use subtle pulse or fade animations instead.
- **Opacity transitions preferred** over slide/scale for content changes.

---

## ANTI-PATTERNS (Never do these)

| ❌ Don't | ✅ Do Instead |
|----------|--------------|
| Pure white backgrounds | Sage green or cream backgrounds |
| Pure black text | Dark sage (`#3A4330`) or white with opacity |
| Bright saturated colors | Muted, warm, desaturated tones |
| Sharp box shadows | Subtle glassmorphism or no shadow |
| Thick borders | Hairline borders at low opacity or none |
| Bold/heavy font weights for body | Light (300) to regular (400) |
| Emoji as icons | Custom SVG or line icons |
| Progress bars or streak counters | Gentle, non-competitive tracking |
| "SIGN UP NOW!" aggressive CTAs | "Begin your journey" — soft invitations |
| Confetti, celebrations, badges | Quiet acknowledgment, warm confirmation |
| Red error states | Muted warm tones for errors, supportive language |

---

## PAGE-SPECIFIC GUIDANCE

### Dashboard
- Greeting: "Welcome back" — warm, personal, not "Good morning User!"
- Cards: Glassmorphism on sage background
- Recent entries: cream-tinted cards with dark sage text
- Quick actions: ghost buttons or subtle gold accents

### New Entry / Journal
- Full sage background
- Text input area: glass surface with generous padding
- Mood selection: horizontal scrollable pills
- Submit: gold pill button, same style as splash CTA
- No word counts or timers visible

### Khepera AI Responses
- Response cards: glassmorphism, slightly more opaque than standard cards
- Perspective labels: gold text, small caps
- Gentle fade-in animation for responses (not typing indicators)

### Pathways
- Pathway cards: glassmorphism with cream accents
- Locked pathways: reduced opacity (0.5), subtle lock icon
- Active pathway: gold border accent (1px solid gold-button)

### Settings
- Toggle switches: gold when active, sage-glass when inactive
- Section dividers: hairline at white/10 opacity
- Destructive actions (delete account): muted warm red, never bright red

### Pricing / Premium
- Free tier: standard glass card
- Premium tier: glass card with subtle gold border
- Price text: gold-button color
- Feature list: checkmarks in gold, not green

---

## TAILWIND CONFIG REFERENCE

Add these to your `tailwind.config.js` if not already present:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        sage: {
          light: '#A8B09E',
          DEFAULT: '#9BA88E',
          deep: '#8B9A7C',
          dark: '#5A6350',
        },
        cream: {
          light: '#F2EDE3',
          DEFAULT: '#EAE5D9',
          dark: '#D5D0C4',
        },
        gold: {
          sun: '#D8CA7B',
          DEFAULT: '#E8C56D',
          hover: '#DDC060',
          muted: '#C9B96E',
        },
      },
    },
  },
}
```

---

## FINAL RULE

**When in doubt, make it quieter.** If you're unsure whether something should be more or less prominent, less visible, more subtle — choose subtle. ALCHM whispers. It never raises its voice.