# ALCHM Jony Ive Design System Guide
*"Simplicity is the ultimate sophistication applied to healing"*

## Foundation Philosophy

This design system transforms ALCHM into a minimalist sanctuary that serves vulnerable users with exceptional care. Every design decision follows Jonathan Ive's principles while prioritizing trauma-informed user experience.

### Core Principles

1. **Radical Simplification** - ONE primary action per screen
2. **Sanctuary First** - Every interface element creates safety
3. **Invisible Technology** - Design disappears, healing remains visible
4. **Mathematical Harmony** - 8px grid system, sacred proportions
5. **Trauma-Informed** - 48px+ touch targets, gentle animations, escape routes

## Design Token System

### Sacred Color Palette

```css
/* Primary Sage - The healing heart of ALCHM */
--sage-primary: #a4b792;
--sage-hover: #93a682;
--sage-active: #7a8c6a;

/* Sanctuary Foundation */
--sanctuary: #fefcfb;
--sanctuary-glass: rgba(254, 252, 251, 0.95);

/* Crisis Support */
--crisis-red: #dc2626;
--emergency-red: #b91c1c;
```

### Sacred Spacing (8px Grid)

```css
--space-1: 8px;   /* 1 unit */
--space-2: 16px;  /* 2 units */
--space-3: 24px;  /* 3 units */
--space-4: 32px;  /* 4 units */
--space-6: 48px;  /* 6 units */
--space-8: 64px;  /* 8 units */
```

### Touch Targets (Trauma-Informed)

```css
--touch-default: 44px;    /* WCAG AA minimum */
--touch-large: 48px;      /* Recommended */
--touch-crisis: 52px;     /* Enhanced for stress */
--touch-emergency: 64px;  /* Crisis scenarios */
```

## Component System

### Sacred Button

```tsx
// Primary healing action
<Button variant="primary" size="touch">
  Begin Healing
</Button>

// Crisis support
<Button variant="crisis" size="crisis">
  🆘 Call 988
</Button>

// Gentle secondary action
<Button variant="secondary" size="default">
  Learn More
</Button>
```

### Sanctuary Cards

```tsx
// Glass morphism container
<Card variant="sanctuary" interactive>
  <CardHeader>
    <CardTitle level="h3">Sacred Journal</CardTitle>
    <CardDescription>
      Express your thoughts in this protected sanctuary
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>

// Featured premium card
<Card variant="featured" interactive>
  {/* Premium content */}
</Card>
```

### Sacred Inputs

```tsx
// Journal writing space
<Textarea 
  variant="journal" 
  placeholder="What wisdom wants to emerge from your heart today?"
  className="min-h-[400px]"
/>

// Sanctuary form field
<Input 
  variant="sanctuary" 
  placeholder="Enter your email sanctuary"
/>
```

## Layout System

### Sacred Grid

```tsx
<div className="sanctuary-grid">
  {/* Auto-fitting cards with 300px minimum */}
</div>
```

### Sacred Flex

```tsx
<div className="sanctuary-flex sanctuary-flex--center">
  <span>Always free</span>
  <span className="opacity-40">•</span>
  <span>Private & secure</span>
</div>
```

### Sacred Container

```tsx
<div className="sanctuary-container">
  {/* Centered content with responsive padding */}
</div>
```

## Animation System

### Gentle Breathing

```css
.animate-breathing {
  animation: gentle-breathing 8s ease-in-out infinite;
}
```

### Sanctuary Float

```css
.animate-sanctuary-float {
  animation: sanctuary-float 6s ease-in-out infinite;
}
```

### Crisis Attention

```css
.animate-crisis-pulse {
  animation: crisis-pulse 2s ease-in-out infinite;
}
```

## Typography Scale

### Sacred Hierarchy

```css
.text-micro     /* 12px - Labels, metadata */
.text-small     /* 14px - Supporting text */
.text-base      /* 16px - Body text (minimum) */
.text-medium    /* 18px - Subheadings */
.text-large     /* 24px - Section titles */
.text-xlarge    /* 32px - Page headings */
.text-2xlarge   /* 40px - Hero text */
.text-3xlarge   /* 56px - Display text */
```

### Sacred Weights

```css
.font-ultralight  /* 100 - Display text only */
.font-thin        /* 200 - Large headings */
.font-light       /* 300 - Headings */
.font-normal      /* 400 - Body text */
.font-medium      /* 500 - Emphasis */
.font-semibold    /* 600 - Maximum weight */
```

## Trauma-Informed Patterns

### Crisis Mode Adaptations

```css
.crisis-mode {
  font-size: 1.25rem !important;
  line-height: 1.8 !important;
  letter-spacing: 0.02em !important;
}

.crisis-mode .alchm-button {
  min-height: var(--touch-emergency);
  font-size: 1.125rem;
  font-weight: 600;
}
```

### Emergency Mode

```css
.emergency-mode * {
  font-size: 1.5rem !important;
  line-height: 2 !important;
  font-weight: 600 !important;
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Page Patterns

### Landing Page - Radical Simplification

```tsx
<section className="sanctuary-section">
  <div className="sanctuary-container text-center">
    {/* ONE primary message */}
    <h1 className="text-2xlarge font-thin mb-4">
      Your sanctuary for healing
    </h1>
    
    {/* ONE primary action */}
    <Button variant="primary" size="touch">
      Begin Healing
    </Button>
    
    {/* Essential trust signals only */}
    <div className="sanctuary-flex sanctuary-flex--center">
      <span>Always free</span>
      <span>•</span>
      <span>Private & secure</span>
    </div>
  </div>
</section>
```

### Dashboard - Sanctuary Cards

```tsx
<div className="sanctuary-grid">
  <Card variant="sanctuary" interactive>
    <div className="text-center p-6">
      <div className="text-6xl mb-4">✍️</div>
      <h3 className="text-large font-light mb-2">Sacred Journal</h3>
      <p className="text-base opacity-80">
        Express your thoughts safely
      </p>
    </div>
  </Card>
  
  {/* Additional sanctuary cards */}
</div>
```

### Journal - Invisible Interface

```tsx
<div className="min-h-screen bg-gradient-to-br from-sage-400 to-sage-500">
  {/* Floating sacred elements for atmosphere */}
  <div className="absolute inset-0 bg-gradient-to-br from-sanctuary/10 via-transparent to-sanctuary/5 pointer-events-none animate-breathing"></div>
  
  {/* Minimal writing interface */}
  <div className="sanctuary-container py-8">
    <Textarea 
      variant="journal"
      placeholder="Let your sacred thoughts flow..."
      className="w-full min-h-[70vh]"
    />
  </div>
</div>
```

## Mobile Optimizations

### Touch Targets

```css
/* Minimum 44px for all interactive elements */
.touch-default { min-height: 44px; min-width: 44px; }

/* Mobile crisis scenarios - larger targets */
@media (max-width: 768px) {
  .alchm-button {
    min-height: 48px;
    min-width: 48px;
  }
}
```

### Typography

```css
@media (max-width: 768px) {
  html {
    font-size: 16px; /* Prevent iOS zoom */
  }
  
  .text-base {
    line-height: 1.8; /* Enhanced for stress reading */
  }
}
```

### Safe Area Support

```css
.safe-area-top {
  padding-top: max(2rem, env(safe-area-inset-top, 2rem));
}
```

## Accessibility Features

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  .sanctuary-glass {
    background: var(--sanctuary);
    border: 2px solid var(--sage-active);
  }
}
```

### Focus States

```css
*:focus-visible {
  outline: 2px solid var(--sanctuary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Screen Reader Support

```tsx
<div className="sr-only" aria-live="polite">
  Crisis support is always available
</div>
```

## Implementation Guidelines

### File Structure

```
src/
├── styles/
│   └── alchm-jony-ive-foundation.css
├── components/ui/
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
└── app/
    ├── globals.css
    └── page.tsx
```

### CSS Import Order

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import foundation last to override Tailwind */
@import '../styles/alchm-jony-ive-foundation.css';
```

### Component Usage

```tsx
// Use CSS classes for core styling
<button className="alchm-button alchm-button--primary">

// Use Tailwind for layout and spacing
<div className="p-4 mb-6 text-center">

// Combine both for optimal developer experience
<Card variant="sanctuary" className="mb-8">
```

## Quality Metrics

### Performance Budget
- Critical CSS: < 25KB
- Component JavaScript: < 50KB per page
- Images: WebP/AVIF with lazy loading

### Accessibility Goals
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Animation Guidelines
- Duration: 200-400ms maximum
- Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Respect prefers-reduced-motion
- Battery-conscious on mobile

## Maintenance

### Regular Audits
1. Color contrast ratios (4.5:1 minimum)
2. Touch target sizes (44px minimum)
3. Animation performance
4. Bundle size optimization

### Component Evolution
- Add new variants sparingly
- Maintain backward compatibility
- Document breaking changes
- Test with real users in crisis scenarios

---

*This design system serves those seeking healing. Every pixel matters, every interaction can provide comfort. Design with compassion.*