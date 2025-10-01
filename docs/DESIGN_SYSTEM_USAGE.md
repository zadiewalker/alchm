# ALCHM Design System Usage Guide

## ✅ Successfully Imported!

The ALCHM Design System has been successfully integrated into your Next.js application:

```tsx
// In layout.tsx
import '../styles/alchm-design-system.css';
```

## 🌿 How to Use the Design System

### 1. **Sacred Color Palette**
```css
/* Use CSS custom properties */
background: var(--sage-400);      /* Primary sage */
color: var(--text-primary);       /* Warm charcoal */
border: 1px solid var(--sage-200); /* Subtle sage */
```

### 2. **Breathing-Based Spacing**
```css
/* Use the breathing rhythm */
padding: var(--space-rest);       /* 24px - thoughtful distance */
margin: var(--space-sanctuary);   /* 48px - sacred separation */
gap: var(--space-breath);         /* 8px - natural pause */
```

### 3. **Typography Scale**
```css
font-size: var(--text-xl);        /* Small headings */
line-height: var(--leading-relaxed); /* Long-form reading */
letter-spacing: var(--tracking-wide); /* Gentle expansion */
```

### 4. **Component Classes**

#### Cards
```tsx
<div className="card-sanctuary">
  <div className="card-content">
    <div className="card-header">
      <h3>Sanctuary Card</h3>
    </div>
    <div className="card-body">
      <p>Card content goes here...</p>
    </div>
  </div>
</div>

// Variants:
<div className="card-reflection">...</div>  // For contemplative content
<div className="card-pathway">...</div>     // For guided journeys
<div className="card-crisis">...</div>      // For support resources
```

#### Buttons
```tsx
<button className="btn-base btn-primary">Primary Action</button>
<button className="btn-base btn-secondary">Secondary Action</button>
<button className="btn-base btn-ghost">Ghost Action</button>
<button className="btn-base btn-crisis">Crisis Support</button>
```

#### Form Elements
```tsx
<input 
  type="text" 
  className="input-sanctuary"
  placeholder="Sacred input field..."
/>

<textarea 
  className="textarea-journal"
  placeholder="Begin your reflection here..."
  rows={6}
/>
```

### 5. **Animations**
```tsx
// Gentle reveal animation
<div className="fade-in-up">
  Content that fades in from below
</div>

// Staggered animations for lists
<div className="stagger-children animate">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Breathing animation for loading states
<div className="loading-breathe">
  Loading indicator
</div>
```

## 🎯 Real-World Example

Here's how to transform your existing Dashboard using the design system:

```tsx
// Before
<div className="bg-white rounded-lg p-6 shadow-md">
  <h2 className="text-xl font-bold mb-4">Welcome back</h2>
  <p className="text-gray-600">Your wellness journey continues...</p>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Start Writing
  </button>
</div>

// After (with ALCHM Design System)
<div className="card-sanctuary">
  <div className="card-content">
    <div className="card-header">
      <h2 style={{ 
        fontSize: 'var(--text-xl)', 
        fontWeight: 'var(--font-medium)',
        color: 'var(--text-primary)'
      }}>
        Welcome back
      </h2>
    </div>
    <div className="card-body">
      <p>Your wellness journey continues...</p>
    </div>
    <div className="card-footer">
      <button className="btn-base btn-primary">
        Start Writing
      </button>
    </div>
  </div>
</div>
```

## 🛠️ Development Features

### Design System Demo (Development Only)
When running in development mode, you'll see a "Show Design System" button in the bottom-left corner. Click it to explore:

- **Color palette** with all sage variations
- **Typography scale** with size examples
- **Spacing system** visualization
- **Button components** with hover states
- **Card variants** with interactive examples
- **Form elements** with focus states
- **Animation demonstrations**

### Live Preview
The design system is now active across your entire application. You can:

1. **Update existing components** by adding the CSS classes
2. **Use CSS custom properties** for consistent styling
3. **Apply animations** for gentle user interactions
4. **Maintain accessibility** with built-in focus states

## 📱 Mobile Optimization

The design system automatically handles mobile optimization:

```css
@media (max-width: 640px) {
  /* Touch-friendly button sizes */
  .btn-base {
    min-height: 48px;
    padding: 14px 20px;
  }
  
  /* Responsive spacing */
  :root {
    --space-sanctuary: 32px;
    --space-comfort: 24px;
  }
}
```

## ♿ Accessibility Features

Built-in accessibility support:

- **High contrast mode** detection
- **Reduced motion** respect
- **Focus indicators** that feel supportive
- **Screen reader** optimization
- **Large text** accommodation

## 🎨 Emotional Design Principles

Every component follows these principles:

1. **Sanctuary in every pixel** - Visual comfort for vulnerable moments
2. **Breathing-based rhythm** - Spacing that feels natural
3. **Gentle interactions** - No jarring animations or harsh contrasts
4. **Trauma-informed** - Touch targets safe for users in distress
5. **Culturally inclusive** - Design that honors diverse healing traditions

## 🚀 Next Steps

1. **Apply to existing components** - Update your current UI with design system classes
2. **Test accessibility** - Verify screen reader and keyboard navigation
3. **Customize as needed** - Extend the system while maintaining consistency
4. **Monitor performance** - Ensure smooth animations at 60fps

Your ALCHM design system is now live and ready to create digital sanctuary through every interaction! ✨