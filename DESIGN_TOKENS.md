# 🎨 ALCHM DESIGN TOKENS
## Locked Design System Values

*Created: January 31, 2026*  
*Status: **LOCKED & PROTECTED***

---

## 🎯 CSS CUSTOM PROPERTIES

```css
:root {
  /* === CORE COLORS === */
  --alchm-sage-primary: #8B9A7C;
  --alchm-sage-light: #A8B5A0;
  --alchm-sage-wash: rgba(139, 154, 124, 0.1);
  
  --alchm-gold-primary: #E5C97D;
  --alchm-gold-hover: #F2D99D;
  --alchm-gold-glow: rgba(229, 201, 125, 0.2);
  
  /* === TRANSPARENCY SYSTEM === */
  --white-10: rgba(255, 255, 255, 0.1);
  --white-15: rgba(255, 255, 255, 0.15);
  --white-20: rgba(255, 255, 255, 0.2);
  --white-30: rgba(255, 255, 255, 0.3);
  --white-40: rgba(255, 255, 255, 0.4);
  --white-60: rgba(255, 255, 255, 0.6);
  --white-80: rgba(255, 255, 255, 0.8);
  --white-90: rgba(255, 255, 255, 0.9);
  
  /* === TYPOGRAPHY === */
  --font-family-primary: system-ui, -apple-system, sans-serif;
  
  --font-size-brand: 3rem;          /* 48px */
  --font-size-headline: 1.875rem;   /* 30px */
  --font-size-header: 1.5rem;       /* 24px */
  --font-size-body: 1rem;           /* 16px */
  --font-size-secondary: 0.875rem;  /* 14px */
  --font-size-small: 0.75rem;       /* 12px */
  
  --font-weight-brand: 200;         /* extralight */
  --font-weight-headers: 300;       /* light */
  --font-weight-body: 400;          /* normal */
  --font-weight-buttons: 500;       /* medium */
  
  --letter-spacing-brand: 0.3em;
  --letter-spacing-buttons: 0.2em;
  
  --line-height-tight: 1;
  --line-height-headers: 1.2;
  --line-height-body: 1.6;
  
  /* === SPACING === */
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
  
  /* === BORDER RADIUS === */
  --radius-small: 0.5rem;     /* 8px */
  --radius-medium: 0.75rem;   /* 12px */
  --radius-large: 1rem;       /* 16px */
  --radius-xl: 1.5rem;        /* 24px */
  --radius-full: 9999px;      /* Full circle */
  
  /* === SHADOWS === */
  --shadow-soft: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-gold: 0 4px 16px rgba(229, 201, 125, 0.2);
  --shadow-gold-hover: 0 8px 24px rgba(242, 217, 157, 0.3);
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  /* === TRANSITIONS === */
  --transition-fast: 200ms ease;
  --transition-smooth: 300ms ease-out;
  --transition-all: all var(--transition-fast);
  --transition-all-smooth: all var(--transition-smooth);
  
  /* === Z-INDEX === */
  --z-overlay: 10;
  --z-modal: 50;
  --z-tooltip: 100;
}
```

---

## 🎨 TAILWIND EXTENSIONS

```javascript
// Add to tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'sage': {
          primary: '#8B9A7C',
          light: '#A8B5A0',
          wash: 'rgba(139, 154, 124, 0.1)'
        },
        'gold': {
          primary: '#E5C97D', 
          hover: '#F2D99D',
          glow: 'rgba(229, 201, 125, 0.2)'
        }
      },
      backdropBlur: {
        'glass': '12px'
      },
      letterSpacing: {
        'sacred': '0.3em',
        'button': '0.2em'
      },
      fontSize: {
        'brand': ['3rem', { lineHeight: '1', letterSpacing: '0.3em' }]
      }
    }
  }
}
```

---

## 🏗️ COMPONENT CLASSES

```css
/* === BACKGROUND GRADIENTS === */
.bg-healing-gradient {
  background: linear-gradient(to bottom, var(--alchm-sage-primary) 0%, var(--alchm-sage-light) 100%);
}

.bg-radial-glow {
  background: radial-gradient(ellipse at top, var(--white-10) 0%, transparent 50%);
}

.bg-bottom-fade {
  background: linear-gradient(to top, var(--alchm-sage-light) 0%, transparent 100%);
}

/* === GLASS CARDS === */
.glass-card {
  background: var(--white-10);
  backdrop-filter: blur(12px);
  border: 1px solid var(--white-10);
  border-radius: var(--radius-large);
}

.glass-card-elevated {
  background: var(--white-15);
  border: 1px solid var(--white-15);
  border-radius: var(--radius-xl);
}

.glass-card-premium {
  background: var(--white-20);
  border: 1px solid var(--white-20);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass);
}

/* === BUTTONS === */
.btn-primary {
  background: var(--alchm-gold-primary);
  color: white;
  padding: var(--space-5) var(--space-12);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-buttons);
  letter-spacing: var(--letter-spacing-buttons);
  text-transform: uppercase;
  font-size: var(--font-size-secondary);
  box-shadow: var(--shadow-gold);
  transition: var(--transition-all-smooth);
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background: var(--alchm-gold-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-gold-hover);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  background: var(--white-10);
  color: var(--white-90);
  border: 1px solid var(--white-20);
  padding: var(--space-5) var(--space-12);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-buttons);
  letter-spacing: var(--letter-spacing-buttons);
  text-transform: uppercase;
  font-size: var(--font-size-secondary);
  transition: var(--transition-all);
  min-height: 44px;
}

.btn-secondary:hover {
  background: var(--white-15);
  border-color: var(--white-30);
}

/* === FORM INPUTS === */
.input-field {
  background: var(--white-10);
  border: 1px solid var(--white-20);
  border-radius: var(--radius-medium);
  padding: var(--space-4) var(--space-6);
  color: var(--white-90);
  font-size: var(--font-size-body);
  transition: var(--transition-all);
  width: 100%;
}

.input-field:focus {
  background: var(--white-15);
  border-color: var(--alchm-gold-glow);
  outline: none;
  box-shadow: 0 0 0 2px var(--alchm-gold-glow);
}

.input-field::placeholder {
  color: var(--white-40);
}

/* === TYPOGRAPHY === */
.text-brand {
  font-size: var(--font-size-brand);
  font-weight: var(--font-weight-brand);
  letter-spacing: var(--letter-spacing-brand);
  line-height: var(--line-height-tight);
  color: white;
}

.text-headline {
  font-size: var(--font-size-headline);
  font-weight: var(--font-weight-headers);
  line-height: var(--line-height-headers);
  color: white;
}

.text-header {
  font-size: var(--font-size-header);
  font-weight: var(--font-weight-headers);
  line-height: var(--line-height-headers);
  color: white;
}

.text-body {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-body);
  line-height: var(--line-height-body);
  color: var(--white-80);
}

.text-secondary {
  font-size: var(--font-size-secondary);
  font-weight: var(--font-weight-body);
  color: var(--white-60);
}

.text-small {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-body);
  color: var(--white-40);
}

/* === INTERACTIONS === */
.hover-lift {
  transition: var(--transition-all);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}

.active-press:active {
  transform: scale(0.98);
}

.glow-on-hover {
  transition: var(--transition-all-smooth);
}

.glow-on-hover:hover {
  box-shadow: 0 0 20px var(--alchm-gold-glow);
}

/* === ANIMATIONS === */
.loading-shimmer {
  background: linear-gradient(90deg, transparent, var(--white-10), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* === ACCESSIBILITY === */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* === LAYOUT UTILITIES === */
.sanctuary-layout {
  min-height: 100vh;
  background: var(--alchm-sage-primary);
  background: linear-gradient(to bottom, var(--alchm-sage-primary) 0%, var(--alchm-sage-light) 100%);
  display: flex;
  flex-direction: column;
  position: relative;
}

.sanctuary-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top, var(--white-10) 0%, transparent 50%);
  pointer-events: none;
}

.sanctuary-content {
  position: relative;
  z-index: var(--z-overlay);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.crisis-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-4) 0 var(--space-8) 0;
  background: linear-gradient(to top, var(--alchm-sage-light) 0%, transparent 100%);
}

/* === FEATURE LISTS === */
.feature-list-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.feature-list-icon {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: var(--radius-full);
  background: var(--alchm-gold-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-list-icon svg {
  width: 0.75rem;
  height: 0.75rem;
  color: var(--alchm-gold-primary);
  stroke-width: 2.5;
}

.feature-list-text {
  color: var(--white-80);
  font-size: var(--font-size-secondary);
}
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* Mobile (default) */
.sanctuary-spacing {
  padding: var(--space-6);
}

/* Tablet */
@media (min-width: 768px) {
  .sanctuary-spacing {
    padding: var(--space-8);
  }
  
  .text-brand {
    font-size: 4rem; /* Larger on tablet+ */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .sanctuary-spacing {
    padding: var(--space-12);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## 🎯 UTILITY CLASSES

```css
/* === SPACING UTILITIES === */
.p-sanctuary { padding: var(--space-6); }
.px-sanctuary { padding-left: var(--space-6); padding-right: var(--space-6); }
.py-sanctuary { padding-top: var(--space-6); padding-bottom: var(--space-6); }

.mb-sanctuary { margin-bottom: var(--space-6); }
.mt-sanctuary { margin-top: var(--space-6); }

/* === FLEX UTILITIES === */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* === TEXT UTILITIES === */
.text-center { text-align: center; }
.text-balance { text-wrap: balance; }

.leading-relaxed { line-height: var(--line-height-body); }
.tracking-sacred { letter-spacing: var(--letter-spacing-brand); }
.tracking-button { letter-spacing: var(--letter-spacing-buttons); }

/* === BORDER UTILITIES === */
.rounded-sanctuary { border-radius: var(--radius-large); }
.rounded-sanctuary-xl { border-radius: var(--radius-xl); }

/* === OPACITY UTILITIES === */
.opacity-sanctuary-10 { opacity: 0.1; }
.opacity-sanctuary-60 { opacity: 0.6; }
.opacity-sanctuary-80 { opacity: 0.8; }
```

---

**🔒 These design tokens are LOCKED and protected. They form the foundation of ALCHM's healing aesthetic and should not be modified without explicit approval and documentation updates.**

*Reference: ALCHM_LOCKDOWN.md & ALCHM_PROJECT_BIBLE.md*