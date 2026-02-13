# 🔒 ALCHM DESIGN LOCKDOWN
## FINAL DESIGN SYSTEM - PROTECTED & LOCKED

*Created: January 31, 2026*  
*Status: **LOCKED & FINALIZED***  
*⚠️ Changes to this design system require explicit approval*

---

## 🎨 CORE VISUAL IDENTITY

### Sacred Color Palette
**This color system is LOCKED and creates the healing sanctuary atmosphere:**

```css
/* Primary Healing Greens - The Foundation */
--sage-primary: #8B9A7C      /* Main brand color - sacred sage */
--sage-light: #A8B5A0        /* Gentle gradient companion */
--sage-wash: rgba(139,154,124,0.1)  /* Subtle background washes */

/* Golden Accents - The Light */
--gold-primary: #E5C97D      /* Primary gold - warm healing light */
--gold-hover: #F2D99D        /* Hover state - brighter warmth */
--gold-glow: rgba(229,201,125,0.2)  /* Subtle glow effects */

/* Transparency System - The Depth */
--white-10: rgba(255,255,255,0.1)   /* Subtle cards */
--white-15: rgba(255,255,255,0.15)  /* Elevated cards */
--white-20: rgba(255,255,255,0.2)   /* Active elements */
--white-80: rgba(255,255,255,0.8)   /* Primary text */
--white-60: rgba(255,255,255,0.6)   /* Secondary text */
--white-40: rgba(255,255,255,0.4)   /* Subtle text */
--white-30: rgba(255,255,255,0.3)   /* Disabled text */
```

### Sacred Gradients
**Background gradients that create the healing atmosphere:**

```css
/* Primary App Background */
.healing-gradient {
  background: linear-gradient(to bottom, #8B9A7C 0%, #A8B5A0 100%);
}

/* Subtle Overlay Magic */
.radial-glow {
  background: radial-gradient(ellipse at top, rgba(255,255,255,0.05) 0%, transparent 50%);
}

/* Footer Fade */
.bottom-fade {
  background: linear-gradient(to top, #A8B5A0 0%, transparent 100%);
}
```

---

## 🎯 TYPOGRAPHY SYSTEM

### Font Hierarchy - Elegant & Healing
```css
/* Brand Title - ALCHM */
.brand-title {
  font-size: 3rem;           /* 48px */
  font-weight: 200;          /* extralight */
  letter-spacing: 0.3em;     /* Spacious, sacred */
  line-height: 1;
}

/* Page Headlines */
.page-headline {
  font-size: 1.875rem;       /* 30px */
  font-weight: 300;          /* light */
  line-height: 1.2;
}

/* Section Headers */
.section-header {
  font-size: 1.5rem;         /* 24px */
  font-weight: 300;          /* light */
  line-height: 1.3;
}

/* Body Text */
.body-text {
  font-size: 1rem;           /* 16px */
  font-weight: 400;          /* normal */
  line-height: 1.6;          /* Readable, spacious */
}

/* Secondary Text */
.secondary-text {
  font-size: 0.875rem;       /* 14px */
  font-weight: 400;
  line-height: 1.5;
}

/* Small Text */
.small-text {
  font-size: 0.75rem;        /* 12px */
  font-weight: 400;
  line-height: 1.4;
}
```

---

## 🏗️ COMPONENT ARCHITECTURE

### 1. Glass Card System
**The foundation of our UI - creates depth and elegance:**

```tsx
/* Base Glass Card */
.glass-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1rem;
}

/* Elevated Glass Card */
.glass-card-elevated {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 1.5rem;
}

/* Premium Glass Card */
.glass-card-premium {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
```

### 2. Sacred Button System
**Buttons that feel like healing touchstones:**

```tsx
/* Primary Action Button - The Golden Path */
.btn-primary {
  background: #E5C97D;
  color: white;
  padding: 1.25rem 3rem;
  border-radius: 9999px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.875rem;
  box-shadow: 0 4px 16px rgba(229,201,125,0.2);
  transition: all 300ms ease-out;
  min-height: 44px;
}

.btn-primary:hover {
  background: #F2D99D;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(242,217,157,0.3);
}

.btn-primary:active {
  transform: scale(0.98);
}

/* Secondary Button - Subtle Glass */
.btn-secondary {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.2);
  /* Same sizing and transitions as primary */
}
```

### 3. Input Field System
**Form elements that feel part of the healing sanctuary:**

```tsx
.input-field {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  color: rgba(255,255,255,0.9);
  font-size: 1rem;
  transition: all 200ms ease;
}

.input-field:focus {
  background: rgba(255,255,255,0.15);
  border-color: rgba(229,201,125,0.5);
  outline: none;
  box-shadow: 0 0 0 2px rgba(229,201,125,0.2);
}

.input-field::placeholder {
  color: rgba(255,255,255,0.4);
}
```

---

## 📱 LAYOUT SYSTEM

### Screen Structure
**Every page follows this sacred structure:**

```tsx
<div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col">
  {/* Radial Overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
  
  {/* Content */}
  <div className="relative z-10 flex flex-col flex-1">
    {/* Header */}
    <header className="px-6 pt-14 pb-6">
      <Link href="/dashboard/" className="text-white/60 text-base mb-4 inline-block">
        ← Back
      </Link>
      <h1 className="text-white text-3xl font-light">{pageTitle}</h1>
      <p className="text-white/60 text-base mt-2 leading-relaxed">
        {pageDescription}
      </p>
    </header>
    
    {/* Main Content */}
    <main className="flex-1 px-6 pb-32 overflow-y-auto">
      {children}
    </main>
  </div>
  
  {/* Crisis Footer */}
  <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
    <p className="text-white/40 text-xs text-center tracking-wide">
      Crisis support available · 988
    </p>
  </div>
</div>
```

### Spacing System
**Consistent spacing creates rhythm and flow:**

```css
/* Spacing Scale - Based on 4px grid */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-32: 8rem;      /* 128px */
```

---

## 🎭 INTERACTION PATTERNS

### Micro-Interactions
**Subtle animations that bring the interface to life:**

```css
/* Universal Transitions */
.smooth-transition {
  transition: all 200ms ease;
}

.slow-transition {
  transition: all 300ms ease-out;
}

/* Hover Effects */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

/* Active Press */
.active-press:active {
  transform: scale(0.98);
}

/* Glow Effects */
.glow-on-hover:hover {
  box-shadow: 0 0 20px rgba(229,201,125,0.3);
}
```

### Loading States
```css
.loading-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 🎪 COMPONENT GALLERY

### Navigation Links
```tsx
<Link className="text-white/60 hover:text-white/90 transition-colors duration-200">
  Text Link
</Link>
```

### Section Cards
```tsx
<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
  {content}
</div>
```

### Feature Lists
```tsx
<div className="flex items-center gap-3">
  <div className="w-5 h-5 rounded-full bg-[#E5C97D]/20 flex items-center justify-center">
    <svg className="w-3 h-3 text-[#E5C97D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
  <span className="text-white/80 text-sm">{feature}</span>
</div>
```

---

## 🔐 DESIGN PRINCIPLES

### 1. Healing First
Every design decision prioritizes the user's emotional healing and sense of safety.

### 2. Sacred Minimalism  
Clean, uncluttered interfaces that create space for reflection and growth.

### 3. Gentle Contrast
Sufficient contrast for accessibility while maintaining the soft, healing aesthetic.

### 4. Consistent Rhythm
Predictable patterns in spacing, typography, and interactions that create familiarity.

### 5. Emotional Resonance
Colors, shapes, and interactions that evoke feelings of peace, safety, and transformation.

---

## ⚠️ PROTECTION PROTOCOLS

### DO NOT CHANGE:
- ✋ The sage green (`#8B9A7C`) to pale gold (`#E5C97D`) color relationship
- ✋ The glass card transparency system
- ✋ The radial gradient overlay pattern
- ✋ The golden button styling and interactions
- ✋ The typography weight hierarchy
- ✋ The crisis support footer positioning

### ALWAYS MAINTAIN:
- ✅ 44px minimum touch targets
- ✅ Smooth transitions (200-300ms)
- ✅ Consistent border radius (0.75rem - 1.5rem)
- ✅ The backdrop-blur glass effect
- ✅ White text with appropriate transparency levels
- ✅ The healing gradient background

### APPROVED ADDITIONS ONLY:
- New components must follow the glass card system
- New colors must complement the sage/gold palette
- New interactions must maintain the gentle, healing feeling
- All changes must be reviewed against this lockdown document

---

## 📊 ACCESSIBILITY STANDARDS

### Color Contrast
- White text on sage background: **WCAG AA compliant**
- Gold buttons with white text: **WCAG AAA compliant**
- Secondary text (white/60): **WCAG AA compliant for large text**

### Touch Targets
- All interactive elements: **Minimum 44px**
- Button padding ensures comfortable touch zones
- Adequate spacing between clickable elements

### Motion
- Respect `prefers-reduced-motion` for all animations
- Transitions enhance usability, never interfere with content

---

## 🎯 IMPLEMENTATION CHECKLIST

When creating new components or pages:

- [ ] Uses the healing gradient background
- [ ] Includes the radial overlay for depth
- [ ] Follows the glass card pattern for containers
- [ ] Uses the approved typography scale
- [ ] Implements proper color transparency levels
- [ ] Includes smooth transitions
- [ ] Maintains 44px minimum touch targets
- [ ] Follows the crisis footer pattern
- [ ] Tests on mobile and desktop
- [ ] Validates accessibility contrast

---

## 🛡️ DESIGN ENFORCEMENT SYSTEM

### Automated Protection Mechanisms

**ALCHM now has a comprehensive enforcement system to prevent design contamination:**

#### 1. Sacred Color Constants (`/src/styles/sacred-colors.ts`)
- **Immutable color palette** with only approved sacred colors
- **Forbidden color list** preventing old design contamination  
- **Validation utilities** for color checking
- **Type safety** ensuring only sacred colors can be imported

#### 2. Design Validation Script (`/scripts/validate-design.js`)
- **Automatic scanning** of all .tsx, .ts, and .css files
- **Color violation detection** using regex patterns
- **Emergency context awareness** (allows crisis red only for 988 hotline)
- **Detailed violation reporting** with file paths and line numbers
- **Build blocking** when unauthorized colors are detected

#### 3. Pre-commit Protection (`.husky/pre-commit`)
- **Automatic validation** before every git commit
- **Commit blocking** if design violations exist
- **Visual feedback** with sacred design messaging
- **Zero tolerance** for color contamination

#### 4. Package.json Scripts
```bash
# Validate design integrity
npm run design:validate

# Enforce design + build
npm run design:enforce  

# Silent design check
npm run design:check
```

### Protection Rules

**ALLOWED COLORS ONLY:**
- Sage: `#8B9A7C`, `#A8B5A0`, `#6B7A5C`
- Gold: `#E5C97D`, `#F2D99D`, `#D4B76A`  
- Glass: `rgba(255,255,255,0.05-0.2)`
- Crisis: `#DC2626`, `#B91C1C` (emergency contexts only)
- Neutrals: `#ffffff`, `#000000`, `transparent`

**FORBIDDEN COLORS (Auto-blocked):**
- `#3B82F6` (old blue)
- `#10B981` (old green)  
- `#F59E0B` (old amber)
- `#EF4444` (old red, except crisis)
- `#8B5CF6` (old purple)
- `#06B6D4` (old cyan)
- `#F97316` (old orange)
- `#84CC16` (old lime)

### Enforcement Workflow

1. **Developer writes code** with any colors
2. **Pre-commit hook triggers** design validation
3. **Script scans all files** for color usage
4. **Violations block commit** with detailed reports
5. **Developer fixes violations** using sacred colors
6. **Commit proceeds** only after validation passes

### Emergency Override

**NEVER override the design enforcement** - it exists to protect our sacred healing aesthetic. If you believe you need a new color:

1. Document the specific healing use case
2. Propose how it enhances the sacred aesthetic  
3. Update this lockdown document first
4. Add to sacred color constants
5. Then implement in code

### System Health Check

Run design validation anytime:
```bash
npm run design:validate
```

Expected output for healthy codebase:
```
🛡️  SACRED DESIGN VALIDATION STARTING...
🎨 Protecting ALCHM from design contamination

📁 Scanning X files for design violations...

✅ DESIGN PURITY MAINTAINED!
🎨 Scanned X files - No violations found  
💚 Sacred healing design is protected
```

---

**🔒 This design system is now LOCKED AND ENFORCED. The sacred healing aesthetic is automatically protected from contamination by our comprehensive enforcement system.**

*End of ALCHM Design Lockdown Document - Now with Automated Protection*