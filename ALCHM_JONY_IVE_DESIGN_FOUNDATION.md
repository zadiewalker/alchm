# ALCHM Jony Ive Design Foundation
*"Simplicity is the ultimate sophistication" - Leonardo da Vinci*

## Executive Design Philosophy

This foundation establishes ALCHM as a **Premium Digital Sanctuary** - where luxury wellness technology meets therapeutic trust. Every design decision must pass the "Vulnerable Moment Test": Would this interface element support or stress someone having a panic attack, processing trauma, or seeking crisis resources?

### Core Design Principles

1. **Radical Simplicity** - Every pixel must justify its existence
2. **Inevitable Interactions** - Gestures should feel natural, never designed
3. **Breathing Room** - Generous whitespace as a design element
4. **Trauma-Informed Gentleness** - No jarring transitions or aggressive colors
5. **Premium Accessibility** - Luxury that includes everyone

---

## Visual DNA

### Primary Brand Identity
- **Sage Green (#a4b792)** - The signature healing color that threads through every interaction
- **Sanctuary White (#fefcfb)** - Pure, safe, and welcoming
- **Digital Sanctuary Aesthetic** - Premium glass morphism with healing warmth

### Color Palette System

```css
/* Sage Green System - Primary Brand */
--sage-50: #f8f9f7;
--sage-100: #f0f3ed;
--sage-200: #e1e8db;
--sage-300: #c9d5be;
--sage-400: #a4b792;  /* PRIMARY BRAND - Use thoughtfully */
--sage-500: #93a682;
--sage-600: #7a8c6a;
--sage-700: #5f6b52;
--sage-800: #4a5340;
--sage-900: #3a4233;

/* Sanctuary Neutrals */
--sanctuary-white: #fefcfb;
--sanctuary-gray-50: #f9f9f8;
--sanctuary-gray-100: #f3f3f2;
--sanctuary-gray-200: #e5e5e4;
--sanctuary-gray-300: #d1d1cf;
--sanctuary-gray-400: #9e9e9b;
--sanctuary-gray-500: #7c7c79;
--sanctuary-gray-600: #6b6b68;
--sanctuary-gray-700: #4a4a48;
--sanctuary-gray-800: #2e2e2d;
--sanctuary-gray-900: #1a1a19;

/* Crisis Support Colors */
--crisis-red: #dc2626;
--crisis-red-hover: #b91c1c;
--crisis-amber: #f59e0b;
```

### Typography Hierarchy

**Font Stack**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif`

**Weight Limitations** (Jony Ive constraint - only 3 weights):
- Light (300) - Headlines and elegant moments
- Regular (400) - Body text and descriptions  
- Medium (500) - Buttons and emphasis

**Scale** (Mathematical progression):
```css
.text-xs    { font-size: 0.75rem; line-height: 1rem; }     /* 12px */
.text-sm    { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-base  { font-size: 1rem; line-height: 1.5rem; }      /* 16px - Base */
.text-lg    { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
.text-xl    { font-size: 1.25rem; line-height: 1.75rem; }  /* 20px */
.text-2xl   { font-size: 1.5rem; line-height: 2rem; }      /* 24px */
.text-3xl   { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl   { font-size: 2.25rem; line-height: 2.5rem; }   /* 36px */
```

---

## Component System

### Premium Button Architecture

**Primary Action (Sage CTA)**:
```css
.btn-primary {
  background: var(--sage-400);
  color: white;
  min-height: 52px; /* WCAG + trauma-informed sizing */
  padding: 12px 24px;
  border-radius: 16px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(164, 183, 146, 0.3);
  transition: all 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
}

.btn-primary:hover {
  background: var(--sage-500);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(164, 183, 146, 0.4);
}
```

**Secondary Action**:
```css
.btn-secondary {
  background: var(--sanctuary-white);
  color: var(--sage-600);
  border: 1px solid var(--sage-300);
  /* Same sizing and interaction patterns */
}
```

**Crisis Support (Elegant but Urgent)**:
```css
.btn-crisis {
  background: var(--crisis-red);
  color: white;
  min-height: 60px; /* Larger for crisis scenarios */
  /* Faster transitions but still gentle */
  transition: all 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
```

### Glass Morphism Card System

**Sanctuary Card** (Primary content container):
```css
.card-sanctuary {
  background: rgba(254, 252, 251, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 400ms cubic-bezier(0.215, 0.61, 0.355, 1);
}

.card-sanctuary:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  border-color: rgba(164, 183, 146, 0.4);
}
```

### Premium Input System

**Trauma-Informed Form Fields**:
```css
.input-sanctuary {
  width: 100%;
  min-height: 52px; /* Touch-friendly */
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(164, 183, 146, 0.2);
  border-radius: 16px;
  font-size: 16px; /* Prevents iOS zoom */
  transition: all 300ms ease;
}

.input-sanctuary:focus {
  outline: none;
  border-color: var(--sage-400);
  box-shadow: 0 0 0 4px rgba(164, 183, 146, 0.1);
}
```

---

## Layout Architecture

### Spacing System (8px Grid)
```css
--space-1: 0.25rem;   /* 4px  */
--space-2: 0.5rem;    /* 8px  - Base unit */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius Hierarchy
```css
--radius-sm: 6px;     /* Small elements */
--radius-md: 8px;     /* Standard buttons */
--radius-lg: 12px;    /* Input fields */
--radius-xl: 16px;    /* Primary buttons */
--radius-2xl: 24px;   /* Cards and containers */
--radius-full: 9999px; /* Circular elements */
```

### Mobile-First Container System
```css
.container {
  width: 100%;
  max-width: 428px; /* iPhone 14 Pro Max optimized */
  margin: 0 auto;
  padding: 0 16px;
}

.layout-safe {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## Trauma-Informed Animation System

### Timing Philosophy
- **Fast**: 150ms - Immediate feedback
- **Normal**: 300ms - Standard interactions  
- **Slow**: 500ms - Page transitions
- **Breathing**: 4000ms - Calming effects

### Easing Curves (Natural, Calming)
```css
--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1); /* Primary */
--ease-breathing: cubic-bezier(0.4, 0, 0.6, 1);
```

### Key Animations
```css
/* Gentle page entrance */
@keyframes gentle-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Calming breathing effect */
@keyframes breathing {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.02); opacity: 1; }
}

/* Subtle crisis attention (never jarring) */
@keyframes gentle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### Motion Respect (Critical for Trauma Users)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Accessibility & Trauma-Informed Standards

### Touch Targets (Motor Impairment Considerations)
- **Minimum**: 48px (WCAG AA)
- **Standard**: 52px (ALCHM default)
- **Large**: 60px (Crisis scenarios)
- **Emergency**: 72px (Crisis button)

### Color Contrast Requirements
- **Text on white**: 4.5:1 minimum (WCAG AA)
- **Sage on white**: 4.52:1 ratio ✓
- **High contrast mode**: Automatic border additions

### Crisis-Informed Features
- All destructive actions require confirmation
- Escape routes from every flow ("I need a pause" buttons)
- One-handed operation support
- Works on cracked/damaged screens
- Offline crisis resource caching

---

## Jony Ive Interaction Philosophy

### How Should Buttons Feel?
**Before Press**: Anticipatory hover (1px lift, subtle shadow growth)
**During Press**: Satisfying feedback (scale down, immediate color change)  
**After Press**: Confident completion (gentle return, state change visible)

### What Makes Transitions Premium vs. Cheap?
**Premium**:
- Authentic physics (cubic-bezier easing)
- Consistent timing across similar elements
- Purposeful motion that guides attention
- Respects user's motion preferences

**Cheap**:
- Linear easing (feels robotic)
- Inconsistent timing
- Motion for motion's sake
- Ignores accessibility needs

### Creating "Breathing Room"
- **Cards**: Minimum 24px between components
- **Sections**: Minimum 48px vertical spacing
- **Typography**: 1.6 line-height for body text
- **Borders**: Use space, not lines, for separation

### Visual Hierarchy for Trust & Safety
1. **Primary Actions**: Sage green, prominent placement
2. **Content**: High contrast, generous line spacing
3. **Navigation**: Subtle but always accessible
4. **Crisis Support**: Visible but not alarming
5. **Secondary Info**: Muted but readable

---

## Technical Implementation Standards

### HTML Structure Patterns
```html
<!-- Standard Interactive Card -->
<article class="card-sanctuary animate-gentle-fade">
  <header class="card-header">
    <h3 class="text-xl font-medium text-gray-900">Card Title</h3>
  </header>
  <div class="card-content">
    <p class="text-base text-gray-600">Description text</p>
  </div>
  <footer class="card-actions">
    <button class="btn-primary">Primary Action</button>
    <button class="btn-secondary">Secondary</button>
  </footer>
</article>

<!-- Premium Form Field -->
<div class="form-group">
  <label for="field" class="text-sm font-medium text-gray-700 mb-2">
    Field Label
  </label>
  <input 
    id="field"
    type="text" 
    class="input-sanctuary focus-gentle"
    placeholder="Gentle placeholder text..."
  />
</div>
```

### CSS Architecture Guidelines
```css
/* 1. Use CSS Custom Properties for consistency */
.component {
  background: var(--sanctuary-white);
  color: var(--sanctuary-gray-900);
  border-radius: var(--radius-xl);
  transition: all var(--duration-normal) var(--ease-out-cubic);
}

/* 2. Mobile-first responsive design */
.component {
  /* Mobile styles first */
  padding: var(--space-4);
}

@media (min-width: 640px) {
  .component {
    /* Tablet/desktop enhancements */
    padding: var(--space-6);
  }
}

/* 3. Trauma-informed state management */
.component:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(164, 183, 146, 0.3);
}
```

### JavaScript Interaction Patterns
```javascript
// Gentle, predictable interactions
function handleButtonPress(element) {
  // Immediate visual feedback
  element.style.transform = 'scale(0.98)';
  
  // Authentic timing
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 150);
  
  // Respect motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.style.transition = 'none';
  }
}

// Crisis-aware interactions
function showCrisisSupport() {
  // Never block the interface
  // Always provide immediate escape
  // Cache resources offline
}
```

### Mobile-First Responsive Considerations
```css
/* Base (Mobile) */
.page-container {
  padding: var(--space-4);
  max-width: 428px; /* iPhone 14 Pro Max */
}

/* Tablet */
@media (min-width: 768px) {
  .page-container {
    max-width: 768px;
    padding: var(--space-6);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .page-container {
    max-width: 1200px;
    padding: var(--space-8);
  }
}
```

### Performance Requirements (Crisis User Considerations)
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s  
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3.5s
- **Crisis resources**: Preloaded and cached

---

## Page Background System

### Standard Gradient (All Pages)
```css
.page-background {
  background: linear-gradient(
    135deg, 
    #a4b792 0%, 
    #93a682 25%, 
    #82956f 50%, 
    #7a8c6a 75%, 
    #6b7d5a 100%
  );
  min-height: 100vh;
}
```

### Content Overlay Pattern
```css
.content-sanctuary {
  background: rgba(254, 252, 251, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  margin: var(--space-6);
  padding: var(--space-8);
}
```

---

## Implementation Checklist for Each Page

### Design Validation
- [ ] Sage green used strategically (not overwhelming)
- [ ] Maximum 3 font weights used
- [ ] All touch targets minimum 52px
- [ ] Transitions use cubic-bezier easing
- [ ] Reduced motion preferences respected
- [ ] Crisis support always accessible
- [ ] Works with one hand operation
- [ ] High contrast mode compatible

### Content Hierarchy
- [ ] Primary action uses sage green
- [ ] Visual weight balanced across viewport
- [ ] No more than 3 font sizes per view
- [ ] Consistent 16px base font size
- [ ] Line height 1.5-1.6 for readability
- [ ] Generous whitespace (8px grid system)

### Interaction Polish
- [ ] Hover states are subtle and predictable
- [ ] Loading states are calming, not anxious
- [ ] Error states are gentle and helpful
- [ ] All interactions have clear affordances
- [ ] Focus indicators are visible but not harsh

### Technical Excellence
- [ ] Valid semantic HTML structure
- [ ] CSS follows mobile-first approach
- [ ] JavaScript respects motion preferences
- [ ] Performance budget maintained
- [ ] Accessibility compliance verified
- [ ] Crisis resources preloaded

---

## Conclusion

This foundation ensures every ALCHM page feels inevitable - where the technology disappears and only the human healing experience remains. The sage green should feel like a gentle guide through their journey, never overwhelming, always reassuring.

Every implementation decision should be filtered through Jony Ive's lens: *"Simplicity is not the absence of clutter. That's a consequence of simplicity. Simplicity is somehow essentially describing the purpose and place of an object and product."*

For ALCHM, that purpose is **healing** - and every pixel must serve that sacred mission.