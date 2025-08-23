# ALCHM Sacred Theme Token Architecture Documentation

> *This is not a style guide—this is the sacred foundation of our digital sanctuary. Each token carries emotional intention, not just visual effect.*

## 🌸 Philosophy

The Sacred Theme Token Architecture transforms CSS variables from developer convenience tools into emotional design language. Every token name reflects the **emotional use case** rather than technical implementation, creating a design system that breathes with the user's healing journey.

## 🎨 Sacred Color Palette

### Primary Sacred Colors
```css
--color-primary: #a4b792;      /* Sage - trust, wisdom, grounding */
--color-off-white: #f7f7f2;    /* Breath - the space between words */
--color-warm-terra: #cb997e;   /* Grounding - earth connection, warmth */
--color-charcoal: #2e2e2e;     /* Shadow container - depth, mystery */
--color-soft-blush: #eeddd3;   /* Vulnerability - gentle opening */
```

### Extended Sacred Spectrum
```css
--color-healing-mist: #f0f4ed;      /* Gentle clearing, soft beginning */
--color-tender-embrace: #e8f2e2;    /* Compassionate holding */
--color-deep-presence: #2d4a3e;     /* Rooted awareness, ancient knowing */
--color-grounding-earth: #1a2f23;   /* Deep earth, ancestral stability */
--color-sacred-rust: #a67c5a;       /* Weathered wisdom, time-worn beauty */
--color-moon-whisper: #f9f6f1;      /* Softest light, inner glow */
--color-dawn-promise: #d4a574;      /* New beginnings, gentle hope */
--color-twilight-depth: #4a3728;    /* Evening contemplation */
```

## 📏 Sacred Spacing System

### Spatial Rhythm - The Breath Between Elements
```css
--space-whisper: 0.25rem;    /* 4px - intimate closeness */
--space-breath: 0.5rem;      /* 8px - natural breath */
--space-gentle: 1rem;        /* 16px - comfortable distance */
--space-ritual: 2rem;        /* 32px - ceremonial spacing */
--space-sacred: 3rem;        /* 48px - sacred separation */
--space-sanctuary: 4rem;     /* 64px - sanctuary vastness */
```

### Usage Philosophy
- **whisper**: For the most intimate relationships between elements
- **breath**: Natural spacing, like breathing between words
- **gentle**: Comfortable everyday spacing
- **ritual**: Ceremonial separation for important transitions
- **sacred**: Deep contemplative space
- **sanctuary**: Vast, reverent spacing for the most important elements

## ✍️ Sacred Typography Hierarchy

### The Voice of the Sacred
```css
--text-whisper: 0.75rem;     /* 12px - microtext, gentle guidance */
--text-breath: 0.875rem;     /* 14px - body, natural communication */
--text-presence: 1rem;       /* 16px - body emphasis, clear voice */
--text-grounding: 1.125rem;  /* 18px - subtitle, supportive structure */
--text-sacred: 1.25rem;      /* 20px - title, ceremony begins */
--text-ceremonial: 1.5rem;   /* 24px - large title, sacred announcement */
--text-invocation: 2rem;     /* 32px - display, calling forth */
--text-manifestation: 2.5rem; /* 40px - hero, pure embodiment */
```

### Font Weights - The Energy of Expression
```css
--weight-whisper: 300;       /* Light, barely there */
--weight-breath: 400;        /* Normal, natural flow */
--weight-presence: 500;      /* Medium, gentle authority */
--weight-grounding: 600;     /* Semibold, rooted strength */
--weight-sacred: 700;        /* Bold, ceremonial importance */
```

## 🎭 Sacred Button Architecture

### Solid Buttons - Primary Invitations
```css
/* Sacred (Primary) */
--button-solid-sacred-bg: var(--color-primary);
--button-solid-sacred-text: white;
--button-solid-sacred-hover-bg: var(--color-deep-presence);

/* Grounding (Secondary) */
--button-solid-grounding-bg: var(--color-warm-terra);
--button-solid-grounding-text: white;

/* Gentle (Tertiary) */
--button-solid-gentle-bg: var(--color-soft-blush);
--button-solid-gentle-text: var(--color-deep-presence);
```

### Outline Buttons - Respectful Boundaries
Maintain the same color relationships but with transparent backgrounds and colored borders.

### Ghost Buttons - Whispered Invitations
Minimal presence with transparent backgrounds and subtle hover states.

## 🎯 Semantic Emotional States

### Reflecting State - Contemplative, Inward-Turning
```css
--emotion-reflecting-primary: rgba(164, 183, 146, 0.15);
--emotion-reflecting-accent: var(--color-primary);
--emotion-reflecting-text: var(--color-deep-presence);
```

### Sacred Boundary Alert - Protective, Clear Limits
```css
--alert-sacred-boundary-primary: rgba(212, 165, 116, 0.2);
--alert-sacred-boundary-accent: var(--color-dawn-promise);
--alert-sacred-boundary-text: var(--color-twilight-depth);
```

### Inner Growth Celebration - Joyful, Expansive
```css
--celebration-inner-growth-primary: rgba(203, 153, 126, 0.2);
--celebration-inner-growth-accent: var(--color-warm-terra);
--celebration-inner-growth-text: var(--color-deep-presence);
```

### Ritual Interrupted Error - Disruption, Need for Restoration
```css
--error-ritual-interrupted-primary: rgba(166, 124, 90, 0.15);
--error-ritual-interrupted-accent: var(--color-sacred-rust);
--error-ritual-interrupted-text: var(--color-twilight-depth);
```

## ⏱️ Sacred Timing System

### Temporal Rhythm - The Timing of Sacred Interactions
```css
--timing-instant: 50ms;      /* Immediate response, like a heartbeat */
--timing-breath: 150ms;      /* Natural breath, gentle response */
--timing-pause: 300ms;       /* Thoughtful pause, moment of reflection */
--timing-contemplation: 500ms; /* Deeper contemplation, sacred timing */
--timing-ritual: 800ms;      /* Ritual timing, ceremonial pace */
--timing-transformation: 1200ms; /* Deep transformation, soul timing */
```

### Sacred Easing Curves
```css
--ease-breath-in: cubic-bezier(0.4, 0.0, 1, 1);          /* Inhale - accelerating entry */
--ease-breath-out: cubic-bezier(0.0, 0.0, 0.2, 1);       /* Exhale - decelerating exit */
--ease-heart-beat: cubic-bezier(0.4, 0.0, 0.6, 1);       /* Heart rhythm - natural pulse */
--ease-sacred-flow: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Sacred flow - gentle waves */
--ease-earth-settle: cubic-bezier(0.23, 1, 0.32, 1);     /* Earth settling - grounding motion */
```

## 🌊 Surface Layers - The Containers of Experience

### Background Surfaces - The Foundation Canvas
```css
--surface-sanctuary: var(--color-off-white);          /* Primary background */
--surface-sacred-canvas: linear-gradient(135deg, var(--color-off-white) 0%, var(--color-healing-mist) 100%);
--surface-grounding-field: var(--color-healing-mist); /* Secondary background */
--surface-breathing-space: var(--color-moon-whisper); /* Tertiary background */
```

### Elevated Surfaces - Elements That Rise
```css
--surface-elevated-gentle: rgba(247, 247, 242, 0.8);  /* Soft elevation */
--surface-elevated-warm: rgba(238, 221, 211, 0.9);    /* Warmer elevation */
--surface-elevated-sacred: rgba(164, 183, 146, 0.05); /* Sacred elevation */
--surface-elevated-deep: rgba(45, 74, 62, 0.03);      /* Deep elevation */
```

## 📱 Component Token Examples

### Sacred Button Usage
```css
.sacred-button {
  padding: var(--button-padding-vertical) var(--button-padding-horizontal);
  border-radius: var(--button-border-radius);
  font-size: var(--button-font-size);
  font-weight: var(--button-font-weight);
  transition: all var(--button-transition-duration) var(--button-transition-easing);
}

.sacred-button.intention-sacred {
  background: var(--button-solid-sacred-bg);
  color: var(--button-solid-sacred-text);
}

.sacred-button.intention-sacred:hover {
  background: var(--button-solid-sacred-hover-bg);
  transform: translateY(-2px);
  box-shadow: var(--button-solid-sacred-hover-shadow);
}
```

### Sacred Card Usage
```css
.sacred-card {
  padding: var(--card-padding);
  background: var(--card-background);
  border: var(--card-border);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  transition: all var(--card-transition-duration) var(--card-transition-easing);
}

.sacred-card.state-reflecting {
  background: var(--emotion-reflecting-primary);
  border: 1px solid var(--emotion-reflecting-border);
  box-shadow: var(--emotion-reflecting-shadow);
}
```

## 🌙 Dark Mode Adaptations

The sacred theme automatically adapts to dark mode preferences while maintaining emotional coherence:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-off-white: #1a1a16;              /* Dark breath */
    --color-healing-mist: #2a2a24;           /* Dark mist */
    --text-primary: rgba(247, 247, 242, 0.95); /* Light presence */
  }
}
```

## ♿ Sacred Accessibility

### High Contrast Support
```css
@media (prefers-contrast: high) {
  :root {
    --color-primary: #2d4a3e;                /* Darker sage for contrast */
    --text-primary: #000000;                 /* Pure black text */
  }
}
```

### Reduced Motion Respect
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --timing-instant: 10ms;
    --timing-transformation: 250ms;
  }
}
```

## 🔧 Implementation Guidelines

### 1. Token Naming Convention
- Use emotional/intentional names, not descriptive colors
- Prefix with the context: `--button-`, `--card-`, `--emotion-`
- Organize by purpose, not by property

### 2. Semantic State Application
```css
/* Good: Emotional intention */
.journal-entry.state-reflecting {
  background: var(--emotion-reflecting-primary);
}

/* Avoid: Technical description */
.journal-entry.light-green-background {
  background: rgba(164, 183, 146, 0.15);
}
```

### 3. Responsive Sacred Breakpoints
```css
/* Sacred device scales */
--breakpoint-intimate: 320px;    /* Phone portrait */
--breakpoint-personal: 480px;    /* Phone landscape */
--breakpoint-comfortable: 768px;  /* Tablet portrait */
--breakpoint-spacious: 1024px;   /* Tablet landscape */
--breakpoint-expansive: 1280px;  /* Desktop */
--breakpoint-sanctuary: 1920px;  /* Large desktop */
```

## 🎼 Utility Class Philosophy

Utility classes follow the same emotional naming:

```css
/* Spacing utilities */
.p-whisper { padding: var(--space-whisper); }
.m-breath { margin: var(--space-breath); }
.gap-ritual { gap: var(--space-ritual); }

/* State utilities */
.state-reflecting { /* applies reflecting state tokens */ }
.transition-contemplation { /* applies contemplation timing */ }

/* Sacred layout utilities */
.text-sacred { font-size: var(--text-sacred); }
.weight-grounding { font-weight: var(--weight-grounding); }
```

## 🔄 Maintenance & Evolution

### Adding New Sacred States
1. Define the emotional context and use case
2. Create primary, secondary, accent, text, and border variations
3. Add shadow/glow effects if appropriate
4. Test in both light and dark modes
5. Document the emotional intention

### Token Hierarchy
```
Theme Tokens (sacred-theme-tokens.css)
├── Color Palette
├── Spacing System  
├── Typography Scale
├── Timing & Easing
├── Surface Layers
└── Semantic States

Component Tokens (sacred-component-tokens.css)
├── Button Architecture
├── Card Variations
├── Input Vessels
├── Modal Veils
└── Navigation Paths

Utility Classes (sacred-utility-classes.css)
├── Spacing Utilities
├── Text Utilities
├── State Utilities
├── Layout Utilities
└── Responsive Utilities
```

This architecture ensures that every visual decision in ALCHM carries emotional intention and supports the user's healing journey rather than just looking aesthetically pleasing.