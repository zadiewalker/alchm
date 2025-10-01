# ALCHM Digital Sanctuary Design System

*"Where technology disappears and only the intention to heal remains"*

## Philosophy

This design system embodies Jony Ive's philosophy of intentional restraint and quiet confidence, specifically adapted for trauma-informed digital experiences. Every element serves the user's healing journey while maintaining premium aesthetic quality.

### Core Principles

1. **Intentional Restraint**: Every pixel serves a purpose. Remove anything that doesn't directly support the user's wellbeing.

2. **Quiet Confidence**: Strong visual hierarchy without aggression. Clear communication without harshness.

3. **Trauma-Informed Design**: All interactions designed to create safety and reduce anxiety, especially for vulnerable users.

4. **Breathing Room**: Generous spacing allows thoughts and emotions to settle naturally.

---

## Color System: Calibrated Serenity

### Primary Sage (#a4b792)
The heart of our sanctuary. Use sparingly for:
- Primary action buttons
- Active states
- Progress indicators
- Success messages

```css
/* CSS Custom Properties */
--sage-primary: #a4b792;
--sage-primary-soft: rgba(164, 183, 146, 0.8);
--sage-primary-whisper: rgba(164, 183, 146, 0.2);
--sage-primary-breath: rgba(164, 183, 146, 0.05);
```

```tsx
// Tailwind Classes
bg-sage-400        // Primary sage
bg-sage-400/80     // Soft opacity
bg-sage-400/20     // Whisper opacity
bg-sage-400/5      // Breath opacity
```

### Sanctuary Neutrals
Warm, inviting neutrals that never feel cold or clinical:

- **Sanctuary White**: `#fefefe` - Main background
- **Off White**: `#f8f9f8` - Card backgrounds
- **Whisper Gray**: `#f3f4f3` - Subtle sections
- **Text Primary**: `#2d3328` - Main content
- **Text Secondary**: `#5a6456` - Supporting text
- **Text Tertiary**: `#8a9186` - Metadata, hints

### Emotional Support Colors
Use sparingly for specific emotional contexts:

- **Heart Sparkle Rose**: `rgba(197, 165, 165, 0.8)` - Positive reinforcement
- **Warm Amber**: `rgba(212, 165, 116, 0.8)` - Achievement celebration
- **Calm Blue**: `rgba(107, 141, 181, 0.8)` - Peaceful moments
- **Grounding Earth**: `rgba(139, 115, 85, 0.8)` - Stability

---

## Typography: Whispered Confidence

### Hierarchy & Usage

| Variant | Size | Weight | Spacing | Use Case |
|---------|------|--------|---------|----------|
| **Monument** | 48px | 700 | 0.2em | Landing heroes, major statements |
| **Display** | 32px | 700 | 0.15em | Section headers, key elements |
| **Heading** | 24px | 700 | 0.15em | Page titles, article headers |
| **Subhead** | 18px | 600 | 0.15em | Subsection headers |
| **Emphasis** | 16px | 500 | 0.1em | Highlighted body content |
| **Body** | 14px | 400 | 0.1em | Primary reading text |
| **Whisper** | 12px | 400 | 0.1em | Supporting info, metadata |

### Implementation

```tsx
import { SanctuaryText } from '@/components/ui/SanctuaryComponents';

// Usage examples
<SanctuaryText variant="monument">Hero Statement</SanctuaryText>
<SanctuaryText variant="body">Comfortable reading text with generous spacing</SanctuaryText>
<SanctuaryText variant="whisper">Supporting metadata</SanctuaryText>
```

### Typography Guidelines

- **Line Height**: 1.6-1.8 for body text, 1.2 for display text
- **Letter Spacing**: Generous (0.1-0.2em) for premium feel
- **Font Stack**: System fonts for performance and familiarity
- **Never**: Use more than 3 font sizes per view

---

## Spacing: Intentional Breathing Room

### Base Unit System (8px grid)

```css
--space-hair: 2px;      /* 0.25 units - Fine details */
--space-micro: 4px;     /* 0.5 units - Tight spacing */
--space-mini: 8px;      /* 1 unit - Base unit */
--space-xs: 12px;       /* 1.5 units - Small gaps */
--space-sm: 16px;       /* 2 units - Element spacing */
--space-md: 24px;       /* 3 units - Minimum between elements */
--space-lg: 32px;       /* 4 units - Mobile margins */
--space-xl: 48px;       /* 6 units - Desktop margins */
--space-xxl: 64px;      /* 8 units - Section spacing */
--space-sanctuary: 96px; /* 12 units - Page sections */
```

### Responsive Spacing Guidelines

- **Mobile**: 32px minimum margins, 24px between elements
- **Desktop**: 48px+ margins, maintain 24px minimum spacing
- **Never**: Use spacing smaller than 24px between major elements
- **Always**: Test on mobile devices with one-hand use

---

## Shadows: Sanctuary Elevation

### Shadow Scale
```css
--shadow-whisper: 0 1px 2px rgba(0, 0, 0, 0.04);    /* Subtle hint */
--shadow-gentle: 0 1px 3px rgba(0, 0, 0, 0.08);     /* Card resting */
--shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.12);       /* Hover states */
--shadow-nurturing: 0 4px 16px rgba(0, 0, 0, 0.15); /* Important cards */
--shadow-sacred: 0 8px 32px rgba(164, 183, 146, 0.15); /* Sage accent */
--shadow-sanctuary: 0 16px 64px rgba(164, 183, 146, 0.1); /* Modals */
```

### Usage Guidelines
- Use shadows sparingly - they should feel like natural light
- Prefer sage-tinted shadows for important elements
- Never use harsh black shadows
- Test shadows in both light and dark modes

---

## Animation: Gentle Interactions

### Timing Philosophy
- **Instant**: 150ms - Immediate feedback
- **Quick**: 250ms - Button interactions
- **Gentle**: 400ms - Default transitions
- **Thoughtful**: 600ms - Page transitions
- **Ceremonial**: 800ms - Special moments

### Easing Curves
```css
--ease-gentle: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-soft: cubic-bezier(0.23, 1, 0.32, 1);
--ease-sanctuary: cubic-bezier(0.16, 1, 0.3, 1);
```

### Heart-Sparkle Motif
Use sparingly for positive reinforcement:

```tsx
import { HeartSparkle } from '@/components/ui/SanctuaryComponents';

<HeartSparkle color="rose" size="sm" />    // Gentle acknowledgment
<HeartSparkle color="amber" size="md" />   // Achievement celebration
<HeartSparkle color="sage" size="lg" />    // Major milestones
```

---

## Component Library

### Core Components

#### Buttons
```tsx
// Primary actions - use sage gradient
<SanctuaryButton variant="sage-primary" sparkle>
  Continue Journey
</SanctuaryButton>

// Secondary actions - glass morphism
<SanctuaryButton variant="sanctuary-secondary">
  Learn More
</SanctuaryButton>

// Subtle interactions
<SanctuaryButton variant="gentle-ghost">
  Skip for now
</SanctuaryButton>
```

#### Form Elements
```tsx
// Sacred input vessels
<SanctuaryInput
  label="Your intention"
  placeholder="What brings you here today?"
  hint="This helps us personalize your experience"
/>

// Reflection spaces
<SanctuaryTextarea
  label="Journal Entry"
  placeholder="Share whatever feels right..."
  hint="This is your private space"
/>
```

#### Progress & Recognition
```tsx
// Gentle progress tracking
<SanctuaryProgress 
  value={75} 
  label="Healing Journey" 
  showSparkle 
/>

// Earned recognition
<SanctuaryBadge variant="sage" sparkle>
  7 Day Streak
</SanctuaryBadge>
```

---

## Trauma-Informed Guidelines

### Critical Requirements

1. **Never Startle**: All animations must be gentle, predictable
2. **Escape Routes**: Always provide clear ways to pause or exit
3. **Reduced Motion**: Respect `prefers-reduced-motion` settings
4. **High Contrast**: Support high contrast mode preferences
5. **Touch Targets**: Minimum 44px for accessibility
6. **Crisis Support**: Always provide visible crisis resources

### Color Restrictions
- **Never use**: Aggressive reds, harsh oranges, stark blacks
- **Crisis Colors**: Only use red for actual crisis support elements
- **Preferred**: Earth tones, soft pastels, natural greens

### Interaction Guidelines
- **Hover**: Gentle lift (2-4px), subtle shadows
- **Active**: Brief compression, immediate feedback
- **Focus**: Clear sage outline, never harsh blue
- **Error**: Soft red with helpful guidance
- **Success**: Sage green with optional sparkle

---

## Implementation Examples

### Page Layout
```tsx
function HealingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-gray-50 to-white">
      <SanctuarySection spacing="sanctuary">
        <SanctuaryContainer size="reading">
          <SanctuaryStack spacing="generous">
            <SanctuaryText variant="heading">
              Your Healing Space
            </SanctuaryText>
            <SanctuaryCard className="p-8">
              {/* Content */}
            </SanctuaryCard>
          </SanctuaryStack>
        </SanctuaryContainer>
      </SanctuarySection>
    </div>
  );
}
```

### Mobile-First Responsive
```css
/* Always start mobile-first */
.sanctuary-element {
  padding: var(--space-lg);
  font-size: var(--font-size-body);
}

/* Scale up for larger screens */
@media (min-width: 768px) {
  .sanctuary-element {
    padding: var(--space-xl);
    font-size: var(--font-size-emphasis);
  }
}
```

---

## Accessibility Checklist

- [ ] All colors meet WCAG 2.1 AA contrast ratios
- [ ] Touch targets are minimum 44x44px
- [ ] Focus indicators are clear and consistent
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Text scales appropriately with browser settings
- [ ] Components work with keyboard navigation
- [ ] Screen reader text is provided where needed
- [ ] Error messages are descriptive and helpful

---

## Design Tokens Reference

### CSS Custom Properties
```css
/* Import the complete system */
@import './alchm-digital-sanctuary-system.css';

/* Available custom properties */
var(--sage-primary)
var(--sanctuary-white)
var(--space-sanctuary)
var(--shadow-gentle)
var(--transition-gentle)
var(--ease-sanctuary)
```

### Tailwind Classes
```css
/* Spacing */
.p-sanctuary      /* 96px padding */
.m-lg            /* 32px margin */
.space-y-md      /* 24px vertical spacing */

/* Colors */
.bg-sage-400     /* Primary sage */
.text-sanctuary-gray-800  /* Primary text */

/* Shadows */
.shadow-gentle   /* Subtle elevation */
.shadow-sacred   /* Sage-tinted shadow */

/* Animation */
.animate-heart-sparkle    /* Positive reinforcement */
.animate-gentle-breathe   /* Calm pulsing */
```

---

## Quality Guidelines

### Visual Weight Balance
- No more than 3 font sizes per view
- Consistent 16px base font size minimum
- 1.5-1.6 line height for body text
- Balance text, whitespace, and interactive elements

### Performance Standards
- All animations 60fps
- Smooth transitions on low-end devices
- Optimized for one-handed mobile use
- Fast loading with progressive enhancement

### Testing Requirements
- Test with real users in vulnerable states
- Verify calm emotional response to interactions
- Ensure functionality during panic attacks
- Validate with screen readers and accessibility tools

---

## Getting Started

1. **Import the system**:
   ```tsx
   import '@/styles/alchm-digital-sanctuary-system.css';
   import { SanctuaryButton, SanctuaryText } from '@/components/ui/SanctuaryComponents';
   ```

2. **Start with layout containers**:
   ```tsx
   <SanctuaryContainer size="reading">
     <SanctuarySection spacing="comfortable">
       {/* Your content */}
     </SanctuarySection>
   </SanctuaryContainer>
   ```

3. **Apply typography hierarchy**:
   ```tsx
   <SanctuaryText variant="heading">Section Title</SanctuaryText>
   <SanctuaryText variant="body">Body content with breathing room</SanctuaryText>
   ```

4. **Add gentle interactions**:
   ```tsx
   <SanctuaryButton variant="sage-primary" sparkle>
     Primary Action
   </SanctuaryButton>
   ```

Remember: Every design decision should serve the user's healing journey. When in doubt, choose calm over exciting, gentle over bold, and spacious over cramped.

---

*"The best interface is no interface. The second best is one so intuitive it feels like natural thought."* - ALCHM Design Philosophy