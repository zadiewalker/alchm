# ALCHM Website Copy - Jony Ive Design Language Integration
*Sanctuary in Every Pixel*

## Design Implementation Notes
Apply all text with the Sacred Typography Scale and Sage Color Palette. Every element should breathe with emotional intelligence.

---

## Hero Section
*Apply: `.fade-in-up` animation with `--ease-sanctuary` timing*

### Primary Headline
**Turn Your Pain Into Your Power**
*Typography: `--text-4xl` | Color: `--text-primary` | Weight: `--font-light` | Tracking: `--tracking-tight`*

### Secondary Headline  
*The world's first Identity Operating System*
*Typography: `--text-xl` | Color: `--sage-600` | Weight: `--font-medium` | Tracking: `--tracking-wide`*

### Hero Container
*Apply: `.card-sanctuary` with gentle `breathe-pulse` animation*

ALCHM isn't here to fix you. You were never broken. We're here to help you become an expert on yourself—with trauma-informed AI that witnesses your growth instead of judging it.

*Typography: `--text-lg` | Line Height: `--leading-relaxed` | Color: `--text-secondary`*
*Container: `max-width: 600px` | Padding: `--space-sanctuary`*

### Primary CTA
**[Start Free Trial]**
*Component: `.btn-primary` with gentle hover lift*
*Size: `min-height: 52px` | Padding: `16px 32px`*
*Animation: `translateY(-1px) scale(1.02)` on hover*

*Subtitle below CTA:*
7 days, no commitment
*Typography: `--text-sm` | Color: `--text-muted` | Style: italic*

---

## Problem Section
*Apply: `.card-reflection` with subtle backdrop blur*

### Container Styling
```css
.problem-section {
  background: linear-gradient(145deg, 
    var(--sage-50) 0%, 
    rgba(247, 249, 246, 0.8) 100%);
  backdrop-filter: blur(20px);
  padding: var(--space-sanctuary) var(--space-rest);
  border-radius: 20px;
  border: 1px solid rgba(168, 181, 160, 0.15);
}
```

**Every wellness app treats you like a problem to solve.** They shame you for missing days, reduce you to mood numbers, and profit from your pain. But what if you don't need fixing—you need **witnessing**?

*Typography: `--text-xl` | Line Height: `--leading-relaxed` | Color: `--text-primary`*
*Emphasis words in: Color: `--sage-600` | Weight: `--font-medium`*

---

## Solution Section
*Apply staggered animations: `.stagger-children.animate`*

### Section Header
**We built the first AI that amplifies your wisdom instead of replacing it.**
*Typography: `--text-2xl` | Weight: `--font-light` | Color: `--text-primary` | Margin: `--space-comfort`*

### Feature Grid
*Apply: CSS Grid with `gap: var(--space-rest)`*

Each feature card uses:
```css
.feature-card {
  background: var(--sanctuary-white);
  border: 1px solid var(--sage-200);
  border-radius: 16px;
  padding: var(--space-rest);
  transition: all 0.3s var(--ease-sanctuary);
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(168, 181, 160, 0.12);
  border-color: var(--sage-300);
}
```

#### Feature: Grace-Based Progress
**Grace-based progress** — Get rewarded for self-compassion, not productivity
*Icon: 16px sage circle with gentle pulse animation*
*Typography: Feature title in `--sage-600` | Description in `--text-secondary`*

#### Feature: Crisis-Safe AI  
**Crisis-safe AI** — 3-second response time when you need help most
*Icon: Soft support circle with `--support-gentle` background*

#### Feature: Cultural Intelligence
**Cultural intelligence** — Honor your healing traditions
*Icon: Interconnected circles representing community*

#### Feature: Identity Evolution
**Identity evolution** — Track who you're becoming, not just how you feel
*Icon: Growing plant metaphor in sage tones*

#### Feature: Professional Integration
**Professional integration** — Bridge to therapy when you're ready
*Icon: Bridge symbol with connecting lines*

---

## How It Works Section
*Apply: Three-column layout with `.card-pathway` styling*

### Section Container
```css
.how-it-works {
  background: linear-gradient(135deg, 
    var(--sanctuary-white) 0%, 
    var(--sage-50) 100%);
  padding: var(--space-vastness) 0;
}
```

### Step Cards
Each step uses elevated card styling:

```css
.step-card {
  background: var(--sanctuary-white);
  border-radius: 20px;
  padding: var(--space-comfort);
  box-shadow: 0 4px 20px rgba(168, 181, 160, 0.08);
  border: 1px solid rgba(168, 181, 160, 0.1);
  transition: all 0.4s var(--ease-sanctuary);
}

.step-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 40px rgba(168, 181, 160, 0.15);
}
```

#### Step 1: Express Authentically
Write, speak, draw, move. Whatever's true right now.
*Number badge: Circular, `--sage-400` background, white text*
*Typography: Step title in `--text-xl` | Description in `--text-base`*

#### Step 2: Receive Wisdom
Khepera (your AI companion) mirrors your insights back with gentle guidance.
*Connecting line between steps with subtle animation*

#### Step 3: Evolve Consciously  
Watch your Purpose Résumé™ grow as you become who you really are.
*Final step with completion glow effect*

---

## Social Proof Section
*Apply: `.card-sanctuary` with testimonial-specific styling*

### Testimonial Cards
```css
.testimonial-card {
  background: linear-gradient(145deg,
    var(--sanctuary-white) 0%,
    rgba(254, 252, 251, 0.95) 100%);
  border: 1px solid var(--sage-200);
  border-radius: 20px;
  padding: var(--space-rest);
  position: relative;
  overflow: hidden;
}

.testimonial-card::before {
  content: '"';
  position: absolute;
  top: var(--space-breath);
  left: var(--space-breath);
  font-size: var(--text-4xl);
  color: var(--sage-300);
  opacity: 0.5;
}
```

#### Testimonial 1
*"ALCHM is the first app that actually gets me. It celebrates my complexity instead of trying to simplify it."*
**— Sarah M., Designer**

*Quote styling: `--text-lg` | `--leading-relaxed` | Color: `--text-sage`*
*Attribution: `--text-sm` | Color: `--text-muted` | Style: italic*

#### Testimonial 2
*"The grace tokens changed everything. I'm finally kind to myself when I struggle."*
**— Marcus J., Teacher**

#### Testimonial 3
*"As a therapist, ALCHM perfectly prepares my clients without overstepping boundaries."*
**— Dr. Lisa Chen, LCSW**

---

## Pricing Section
*Apply: Elevated card design with subtle sage gradients*

### Section Background
```css
.pricing-section {
  background: radial-gradient(ellipse at center,
    var(--sage-50) 0%,
    var(--sanctuary-white) 70%);
  padding: var(--space-vastness) 0;
}
```

### Pricing Card
```css
.pricing-card {
  background: var(--sanctuary-white);
  border: 2px solid var(--sage-300);
  border-radius: 24px;
  padding: var(--space-comfort);
  box-shadow: 0 8px 40px rgba(168, 181, 160, 0.12);
  max-width: 480px;
  margin: 0 auto;
  transition: all 0.4s var(--ease-sanctuary);
}

.pricing-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(168, 181, 160, 0.18);
  border-color: var(--sage-400);
}
```

### Plan Header
**Pioneer Plan — $12/month**
*Typography: `--text-2xl` | Weight: `--font-medium` | Color: `--sage-600`*

### Feature List Styling
```css
.feature-list {
  list-style: none;
  padding: 0;
  margin: var(--space-rest) 0;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-breath);
  padding: var(--space-whisper) 0;
  color: var(--text-secondary);
}

.feature-list li::before {
  content: '●';
  color: var(--sage-400);
  font-size: var(--text-sm);
  margin-top: 2px;
}
```

### Features List
- Full Identity Operating System
- Khepera AI companion (3 voices)
- Purpose Résumé™ with breakthrough prediction
- Multi-modal healing (voice, art, poetry, movement)
- Crisis detection and global support resources
- Cultural sanctuary themes
- Grace token system

### Pricing CTA
**[Start 7-Day Free Trial]**
*Component: `.btn-primary` with enhanced hover state*
*Additional styling: `width: 100%` | `margin: var(--space-rest) 0`*

*Fine print:*
Cancel anytime. Your data stays yours, always.
*Typography: `--text-xs` | Color: `--text-muted` | Center aligned*

---

## Trust Signals Section
*Apply: Four-column grid with icon cards*

### Trust Card Styling
```css
.trust-card {
  text-align: center;
  padding: var(--space-pause);
  border-radius: 12px;
  background: var(--sage-50);
  border: 1px solid rgba(168, 181, 160, 0.2);
  transition: all 0.3s var(--ease-breath);
}

.trust-card:hover {
  background: var(--sanctuary-white);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(168, 181, 160, 0.1);
}
```

### Trust Signals
**🔒 Privacy-First**
Zero-knowledge encryption. Even we can't read your entries.
*Icon: Lock symbol in `--sage-400`*

**🚨 Crisis-Safe**
24/7 detection with <3 second response time.
*Icon: Shield with heartbeat in `--support-gentle`*

**🌍 Culturally Responsible**
Community-validated. Revenue-sharing partnerships.
*Icon: Interconnected circles representing global community*

**🏥 Professional-Ready**
HIPAA-compliant. Therapist dashboard available.
*Icon: Bridge symbol connecting platforms*

---

## Final CTA Section
*Apply: Hero-level styling with enhanced visual hierarchy*

### Container Styling
```css
.final-cta {
  background: linear-gradient(135deg,
    var(--sage-50) 0%,
    var(--sanctuary-white) 50%,
    var(--sage-50) 100%);
  padding: var(--space-vastness) var(--space-comfort);
  text-align: center;
  border-radius: 32px;
  margin: var(--space-sanctuary) 0;
  border: 1px solid rgba(168, 181, 160, 0.2);
}
```

### Headlines
**Ready to Meet Who You Really Are?**
*Typography: `--text-3xl` | Weight: `--font-light` | Color: `--text-primary`*

**Join 10,000+ people turning their pain into power.**
*Typography: `--text-xl` | Color: `--sage-600` | Margin: `--space-rest`*

### Value Proposition
ALCHM isn't therapy. It's not meditation. It's not goal tracking.

**It's the first technology that helps you become an expert on yourself.**
*Emphasized text: Color: `--sage-600` | Weight: `--font-medium`*

### Final CTA Button
**[Start Your Free Trial]**
*Component: `.btn-primary` with enhanced sizing*
*Custom styling: `padding: 18px 40px` | `font-size: --text-lg`*

### Closing Quote
*"Your identity is not a problem to solve—it's a mystery to explore."*
*Typography: `--text-lg` | Style: italic | Color: `--text-sage` | Margin: `--space-rest`*

---

## Mobile-Specific Adaptations

### Mobile Hero Section
```css
@media (max-width: 640px) {
  .hero-section {
    padding: calc(var(--safe-area-top) + var(--space-rest)) var(--space-pause);
    text-align: center;
  }
  
  .hero-title {
    font-size: var(--text-3xl);
    line-height: var(--leading-tight);
    margin-bottom: var(--space-rest);
  }
  
  .hero-subtitle {
    font-size: var(--text-lg);
    margin-bottom: var(--space-comfort);
  }
}
```

### Mobile Navigation
```css
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(254, 252, 251, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(168, 181, 160, 0.1);
  padding: var(--space-breath) var(--space-pause);
  z-index: 100;
}
```

### Touch-Optimized CTAs
```css
@media (max-width: 640px) {
  .btn-primary {
    min-height: 52px;
    font-size: var(--text-lg);
    padding: 16px 32px;
    width: 100%;
    margin: var(--space-pause) 0;
  }
}
```

---

## Accessibility Implementation

### Focus States
```css
.focus-visible {
  outline: 2px solid var(--sage-400);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  .card-sanctuary {
    border: 2px solid var(--sage-600);
  }
  
  .btn-primary {
    background: var(--sage-700);
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .fade-in-up,
  .breathe-pulse,
  .gentle-breathing {
    animation: none;
  }
  
  .card-sanctuary:hover {
    transform: none;
  }
}
```

---

## Implementation Priority

### Phase 1: Foundation
- Implement all CSS custom properties
- Apply typography system throughout
- Set up base card and button components

### Phase 2: Interactions  
- Add hover states and transitions
- Implement staggered animations
- Create mobile touch optimizations

### Phase 3: Polish
- Perfect accessibility features
- Optimize for all screen sizes
- Test emotional impact of interactions

**Every pixel should feel like digital sanctuary—supportive, gentle, and profoundly healing.**