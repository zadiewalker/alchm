import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sacred Sage Palette - Premium Digital Sanctuary (Updated for visual superiority)
        sage: {
          50: '#f8faf7',    // Whisper - Ethereal lightness
          100: '#f0f4ed',   // Breath - Gentle presence  
          200: '#e1e8da',   // Calm - Serene foundation
          300: '#c8d4bb',   // Peace - Tranquil expansion
          400: '#a4b792',   // Heart - Primary brand essence
          500: '#8fa37c',   // Soul - Rich depth
          600: '#7a8c6a',   // Earth - Grounded wisdom
          700: '#677358',   // Forest - Deep contemplation
          800: '#4f5843',   // Shadow - Mysterious depth
          900: '#3d4435',   // Void - Infinite possibility
          950: '#2a2f26',   // Essence - Pure intention
        },
        
        // Premium Digital Sanctuary - Off-White Breathing Space (Refined for expensive feel)
        sanctuary: {
          50: '#fdfdfc',         // Pure light
          100: '#fafaf8',        // Whisper white
          200: '#f7f7f2',        // Primary sanctuary (your main off-white)
          300: '#f2f3ed',        // Gentle warmth
          400: '#eeefe8',        // Soft embrace
          500: '#e8e9e0',        // Grounded light
          DEFAULT: '#f7f7f2',    // Primary sanctuary space
          warm: '#faf9f5',       // Gentle warmth variant
          glass: 'rgba(247, 247, 242, 0.85)',  // Transparent sanctuary
          mist: 'rgba(247, 247, 242, 0.15)',   // Subtle presence
        },

        // Terracotta Palette - Warmth & Humanity (Refined for premium warmth)
        terracotta: {
          50: '#fefaf8',         // Gentle warmth whisper
          100: '#fcf2ed',        // Soft embrace
          200: '#f5e1d3',        // Light terracotta - nurturing
          300: '#e8c5a0',        // Warm comfort
          400: '#cb997e',        // Heart - Primary terracotta essence
          500: '#b8845f',        // Soul - Rich earthen depth
          600: '#a0704a',        // Deep warmth
          700: '#8b5d3a',        // Grounded strength
          800: '#6d462a',        // Rich earth
          900: '#4a301b',        // Deep roots
          950: '#2f1e12',        // Infinite earth
          mist: 'rgba(203, 153, 126, 0.08)',    // Gentle presence
          glass: 'rgba(203, 153, 126, 0.12)',   // Warm transparency
        },

        // Charcoal Palette - Grounded Authority (Refined for sophistication)
        charcoal: {
          50: '#fafafa',         // Whisper gray
          100: '#f2f2f2',        // Soft gray
          200: '#e4e4e4',        // Light gray
          300: '#d1d1d1',        // Medium light
          400: '#b8b8b8',        // Balanced gray
          500: '#8c8c8c',        // Neutral authority
          600: '#6b6b6b',        // Medium authority
          700: '#4a4a4a',        // Strong presence
          800: '#2e2e2e',        // Primary charcoal essence
          900: '#1a1a1a',        // Deep authority
          950: '#0d0d0d',        // Infinite depth
        },
        
        // Soft Blush Palette - Emotional Softness (Refined for gentle comfort)
        blush: {
          50: '#fdfbfa',         // Pure softness
          100: '#f9f5f2',        // Gentle whisper
          200: '#eeddd3',        // Primary blush essence
          300: '#e5d1c4',        // Warm comfort
          400: '#ddc4b5',        // Deep embrace
          500: '#d1b5a6',        // Grounded softness
          600: '#c5a597',        // Rich tenderness
          700: '#b39588',        // Deep compassion
          800: '#9a7f73',        // Strong warmth
          900: '#7d675e',        // Infinite tenderness
          950: '#5e4e47',        // Essential softness
          mist: 'rgba(238, 221, 211, 0.08)',   // Gentle presence
          glass: 'rgba(238, 221, 211, 0.12)',  // Soft transparency
        },

        // Functional Colors for Premium Digital Sanctuary
        success: {
          DEFAULT: '#8fa87d',    // Growth green (sage-inspired)
        },
        warning: {
          DEFAULT: '#d4a574',    // Gentle amber (terracotta-inspired)
        },
        error: {
          DEFAULT: '#c49090',    // Soft rose (not alarming)
        },
        info: {
          DEFAULT: '#9db4a8',    // Calm sage-blue
        },
        emergency: {
          DEFAULT: '#b87d7d',    // Muted red (serious but not jarring)
        },
        
        // Sanctuary Foundation - Premium Digital Sanctuary
        sanctuary: {
          DEFAULT: '#fefcfb',    // --sanctuary-white
          white: '#fefcfb',
          glass: 'rgba(254, 252, 251, 0.85)',  // --sanctuary-glass (updated opacity)
          mist: 'rgba(254, 252, 251, 0.05)',   // --sanctuary-mist
          breath: 'rgba(254, 252, 251, 0.95)', // --sanctuary-breath
          gray: {
            50: '#f9f9f9',
            100: '#f1f1f1',
            200: '#e5e5e5',
            300: '#d1d1d1',
            400: '#a8a8a8',
            500: '#8c8c8c',
            600: '#6b6b6b',
            700: '#4a4a4a',
            800: '#2d2d2d',
            900: '#1a1a1a',
          },
        },
        
        // Universal Nature Elements
        water: {
          clear: '#f8fafb',
          flow: '#e3f2fd',
          depth: '#90caf9',
          ocean: '#42a5f5',
        },
        
        sky: {
          dawn: '#f3f4f6',
          day: '#e5e7eb',
          twilight: '#9ca3af',
          night: '#4b5563',
        },
        
        // Culturally-adaptive accents
        gold: {
          sun: '#f7d794',
        },
        silver: {
          moon: '#d6d6d6',
        },
        copper: {
          glow: '#cd853f',
        },
        pearl: {
          wisdom: '#f8f8ff',
        },
        
        // Inclusive spiritual colors
        spirit: {
          light: '#ffffff',
          shadow: '#2d2d2d',
          void: '#000000',
          bridge: '#808080',
        },
        
        // Trauma-informed accessibility
        contrast: {
          gentle: '#4a5568',
          medium: '#2d3748',
          strong: '#1a202c',
        },
        
        // Spiritual Comfort Palette - Emotional & Spiritual Support
        blush: {
          soft: '#f4e6e0',     // Soft blush - emotional & spiritual comfort
          warm: '#ead5cc',     // Warm blush - nurturing embrace  
          gentle: '#e0c4b8',   // Gentle blush - tender healing
        },
        terracotta: {
          light: '#e8c5a0',    // Light terracotta - grounding warmth
          DEFAULT: '#d4a574',  // Main terracotta - earthly humanity
          deep: '#c19660',     // Deep terracotta - stable foundation
        },
        
        // Legacy healing intentions
        calm: {
          blue: '#6b8db5',
        },
        warm: {
          amber: '#d4a574',
        },
        gentle: {
          rose: '#c5a5a5',
        },
        grounding: {
          earth: '#8b7355',
        },
        
        // Safety colors - universally recognized
        safety: {
          green: '#059669',
        },
        caution: {
          amber: '#d97706',
        },
        
        // Crisis & Emergency - Premium Digital Sanctuary
        crisis: {
          red: '#dc2626',      // --crisis-red
          orange: '#ea580c',   // --crisis-orange
          amber: '#f59e0b',    // --crisis-amber
          support: '#059669',  // --crisis-support
        },
        emergency: {
          red: '#b91c1c',      // --emergency-red
        },
      },
      
      spacing: {
        // Premium Digital Sanctuary Spacing System - 8px Grid with Generous Breathing Room
        '2xs': '4px',     // --space-2xs - Micro adjustments
        'xs': '8px',      // --space-xs - Tight spacing
        'sm': '16px',     // --space-sm - Default spacing
        'md': '24px',     // --space-md - Comfortable spacing
        'lg': '32px',     // --space-lg - Section spacing
        'xl': '48px',     // --space-xl - Major sections
        '2xl': '64px',    // --space-2xl - Page divisions
        '3xl': '96px',    // --space-3xl - Hero/landing sections
        '4xl': '128px',   // --space-4xl - Dramatic spacing
        
        // Sacred Geometry Spacing - Refined Mathematical Harmony (Fibonacci & Golden Ratio)
        'whisper': '2px',     // Micro-adjustment
        'breath': '8px',      // Base breathing unit
        'gentle': '13px',     // Fibonacci sequence
        'contemplative': '21px', // Fibonacci progression
        'mindful': '34px',    // Fibonacci progression  
        'harmonic': '55px',   // Fibonacci progression
        'meditation': '89px', // Fibonacci progression
        'expansive': '144px', // Fibonacci progression
        'sanctuary': '233px', // Fibonacci progression
        'infinite': '377px',  // Fibonacci progression
        '13': '104px',        // --space-13 - Fibonacci
        '21': '168px',        // --space-21 - Fibonacci
        
        // Sacred Spacing - 8px Grid System (Unified with CSS)
        '1': '8px',       // var(--space-1) - 1 unit
        '2': '16px',      // var(--space-2) - 2 units  
        '3': '24px',      // var(--space-3) - 3 units
        '4': '32px',      // var(--space-4) - 4 units
        '5': '40px',      // var(--space-5) - 5 units (Fibonacci)
        '6': '48px',      // var(--space-6) - 6 units
        '8': '64px',      // var(--space-8) - 8 units
        '12': '96px',     // var(--space-12) - 12 units
        '16': '128px',    // var(--space-16) - 16 units
        
        // Premium Touch Target Spacing - Crisis-Optimized
        'touch-base': '44px',      // --touch-base - Standard touch target
        'touch-comfortable': '48px', // --touch-comfortable - Comfortable interaction
        'touch-crisis': '52px',    // --touch-crisis - Crisis situations (trembling hands)
        'touch-emergency': '64px', // --touch-emergency - Emergency/SOS access
        'touch-sanctuary': '56px', // --touch-sanctuary - Sacred writing areas
        
        // Legacy touch targets for backwards compatibility
        'touch-default': '44px',   // var(--touch-default)
        'touch-large': '48px',     // var(--touch-large)
        
        // Legacy spacing for backwards compatibility
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
      },
      
      boxShadow: {
        // Sacred Shadow System - Premium Elevation with Sophisticated Depth
        'whisper': '0 0.5px 1px rgba(164, 183, 146, 0.04), 0 1px 2px rgba(164, 183, 146, 0.02)',
        'breath': '0 1px 3px rgba(164, 183, 146, 0.08), 0 2px 8px rgba(164, 183, 146, 0.04)',
        'gentle': '0 2px 6px rgba(164, 183, 146, 0.10), 0 4px 16px rgba(164, 183, 146, 0.06)',
        'blessing': '0 4px 12px rgba(164, 183, 146, 0.12), 0 8px 24px rgba(164, 183, 146, 0.08)',
        'sanctuary': '0 8px 20px rgba(164, 183, 146, 0.16), 0 16px 40px rgba(164, 183, 146, 0.10)',
        'temple': '0 12px 28px rgba(164, 183, 146, 0.20), 0 24px 56px rgba(164, 183, 146, 0.12)',
        'divine': '0 16px 36px rgba(164, 183, 146, 0.24), 0 32px 72px rgba(164, 183, 146, 0.16)',
        'transcendent': '0 24px 48px rgba(164, 183, 146, 0.28), 0 48px 96px rgba(164, 183, 146, 0.20)',
        
        // Legacy shadow support (for backward compatibility)
        'soft': '0 4px 8px rgba(164, 183, 146, 0.08)',
        'sacred': '0 8px 24px rgba(164, 183, 146, 0.12)',
        'elevated': '0 12px 28px rgba(164, 183, 146, 0.15)',
        'floating': '0 16px 36px rgba(164, 183, 146, 0.18)',
      },
      
      borderRadius: {
        // Sacred Radii - Organic, Premium Curves (Refined for luxury feel)
        'whisper': '2px',    // Micro-detail - subtle precision
        'breath': '6px',     // Gentle flow - natural breath
        'caress': '10px',    // Soft touch - intimate connection
        'embrace': '14px',   // Welcoming form - protective embrace
        'sanctuary': '18px', // Sacred space - premium shelter
        'temple': '24px',    // Divine architecture - majestic presence
        'cosmos': '32px',    // Infinite geometry - transcendent form
        'eternal': '40px',   // Boundless curve - eternal beauty
        'infinite': '50%',   // Perfect circle - wholeness embodied
        
        // Legacy support
        'sm': '8px',      // var(--radius-sm)
        'md': '12px',     // var(--radius-md) 
        'lg': '16px',     // var(--radius-lg)
        'xl': '24px',     // var(--radius-xl)
      },
      
      transitionDuration: {
        // Jony Ive Timing - Mathematical Precision for Luxury Interactions
        '150': '150ms',       // Quick micro-interactions
        '280': '280ms',       // Standard Jony Ive button timing
        '420': '420ms',       // Thoughtful state changes
        '680': '680ms',       // Meaningful transformations
        '1000': '1000ms',     // Dramatic reveals
        
        // Sacred Animation Timing - Ritual-Like, Meaningful Movements  
        'whisper': '150ms',   // Quick blessing
        'breath': '280ms',    // Jony Ive standard - one gentle breath
        'pulse': '420ms',     // Thoughtful rhythm
        'meditation': '680ms', // Deep contemplation
        'ritual': '1000ms',   // Sacred ceremony
        
        // Legacy timing support
        'fast': '150ms',
        'base': '280ms',      // Updated to Jony Ive standard
        'slow': '420ms',
      },
      
      transitionTimingFunction: {
        // Jony Ive Easing Functions - Luxury Interaction Physics
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',            // Material Design standard - Jony's preference  
        'elegant': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',   // Gentle acceleration
        'thoughtful': 'cubic-bezier(0.23, 1, 0.32, 1)',      // Considered deceleration
        'premium': 'cubic-bezier(0.165, 0.84, 0.44, 1)',     // Sophisticated ease-out
        'magical': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Apple-style bounce
        
        // Sacred Easing Functions - Natural Movement Patterns
        'blessing': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',  // Gentle blessing
        'prayer': 'cubic-bezier(0.23, 1, 0.32, 1)',          // Rising prayer  
        'meditation': 'cubic-bezier(0.165, 0.84, 0.44, 1)',  // Deep meditation
        'emergence': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Soul emergence
        
        // Legacy support
        'gentle': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      
      animation: {
        // Sacred Animation System - Spiritual Micro-Interactions
        'sacred-breathing': 'sacred-breathing 12s cubic-bezier(0.165, 0.84, 0.44, 1) infinite',
        'divine-float': 'divine-float 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'sacred-pulse': 'sacred-pulse 4s cubic-bezier(0.23, 1, 0.32, 1) infinite',
        'blessing-sparkle': 'blessing-sparkle 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'sacred-emergence': 'sacred-emergence 2000ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'nature-flow': 'nature-flow 10s cubic-bezier(0.165, 0.84, 0.44, 1) infinite',
        'micro-blessing': 'micro-blessing 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'prayer-transition': 'prayer-transition 1200ms cubic-bezier(0.23, 1, 0.32, 1)',
        'celebration-bloom': 'celebration-bloom 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        
        // Sanctuary-specific animations
        'breathe': 'breathe 4s ease-in-out infinite',
        'breathe-slow': 'breathe-slow 6s ease-in-out infinite',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'celebrate': 'celebrate 0.6s ease-in-out',

        // Legacy animations
        'breathing': 'gentle-breathing 8s ease-in-out infinite',
        'sanctuary-float': 'sanctuary-float 6s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
        'crisis-pulse': 'crisis-pulse 2s ease-in-out infinite',
        'gentle-sparkle': 'gentle-sparkle 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
      
      keyframes: {
        // Sacred Keyframes - Spiritual Animation Foundation
        'sacred-breathing': {
          '0%, 100%': { 
            transform: 'scale(1) rotate(0deg)', 
            opacity: '1',
            filter: 'blur(0px)'
          },
          '50%': { 
            transform: 'scale(1.015) rotate(0.5deg)', 
            opacity: '0.85',
            filter: 'blur(0.5px)'
          },
        },
        'divine-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) scale(1)',
            filter: 'drop-shadow(0 4px 8px rgba(164, 183, 146, 0.15))'
          },
          '50%': { 
            transform: 'translateY(-6px) scale(1.01)',
            filter: 'drop-shadow(0 8px 16px rgba(164, 183, 146, 0.25))'
          },
        },
        'sacred-pulse': {
          '0%, 100%': { 
            opacity: '1', 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(164, 183, 146, 0.3)'
          },
          '50%': { 
            opacity: '0.8', 
            transform: 'scale(1.03)',
            boxShadow: '0 0 0 8px rgba(164, 183, 146, 0)'
          },
        },
        'blessing-sparkle': {
          '0%, 100%': { 
            opacity: '0.5', 
            transform: 'scale(0.8) rotate(0deg)',
            filter: 'brightness(1)'
          },
          '25%': { 
            opacity: '0.8', 
            transform: 'scale(1.1) rotate(90deg)',
            filter: 'brightness(1.2)'
          },
          '75%': { 
            opacity: '0.6', 
            transform: 'scale(1.05) rotate(270deg)',
            filter: 'brightness(1.1)'
          },
        },
        'sacred-emergence': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(32px) scale(0.8) rotate(-2deg)',
            filter: 'blur(4px)'
          },
          '60%': {
            opacity: '0.8',
            transform: 'translateY(-4px) scale(1.02) rotate(1deg)',
            filter: 'blur(1px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0px) scale(1) rotate(0deg)',
            filter: 'blur(0px)'
          },
        },
        'nature-flow': {
          '0%, 100%': {
            transform: 'translateX(0px) rotate(0deg)',
            opacity: '0.6'
          },
          '25%': {
            transform: 'translateX(2px) rotate(1deg)',
            opacity: '0.8'
          },
          '75%': {
            transform: 'translateX(-1px) rotate(-0.5deg)',
            opacity: '0.7'
          },
        },
        'micro-blessing': {
          '0%, 90%, 100%': {
            transform: 'scale(1)',
            filter: 'brightness(1)'
          },
          '45%': {
            transform: 'scale(1.05)',
            filter: 'brightness(1.1)'
          },
        },
        'prayer-transition': {
          '0%': {
            transform: 'translateY(0px) scale(1)',
            opacity: '1'
          },
          '25%': {
            transform: 'translateY(-8px) scale(1.02)',
            opacity: '0.9'
          },
          '75%': {
            transform: 'translateY(-4px) scale(1.01)',
            opacity: '0.95'
          },
          '100%': {
            transform: 'translateY(0px) scale(1)',
            opacity: '1'
          },
        },
        'celebration-bloom': {
          '0%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.2) rotate(180deg)',
            opacity: '0.8'
          },
          '100%': {
            transform: 'scale(1) rotate(360deg)',
            opacity: '1'
          },
        },
        
        // Sanctuary-specific keyframes
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'breathe-slow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'celebrate': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.1) rotate(-5deg)' },
          '75%': { transform: 'scale(1.1) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        
        // Legacy keyframes
        'gentle-breathing': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.8' },
        },
        'sanctuary-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'gentle-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        'crisis-pulse': {
          '0%, 100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.7)'
          },
          '50%': { 
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(220, 38, 38, 0)'
          },
        },
        'gentle-sparkle': {
          '0%, 100%': { 
            opacity: '0.4', 
            transform: 'scale(1) rotate(0deg)' 
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1.2) rotate(180deg)' 
          },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      
      fontSize: {
        // Jony Ive Typography Scale - Mathematical Precision for Healing
        // Golden ratio progression: 16px base × 1.618 = perfect harmony
        
        'caption': ['12px', { lineHeight: '1.75', letterSpacing: '0.03em', fontWeight: '400' }],     // 12px - Small details
        'footnote': ['14px', { lineHeight: '1.7', letterSpacing: '0.02em', fontWeight: '400' }],     // 14px - Supporting text  
        'body': ['16px', { lineHeight: '1.75', letterSpacing: '0.01em', fontWeight: '400' }],        // 16px - Body text (base)
        'callout': ['18px', { lineHeight: '1.65', letterSpacing: '0.005em', fontWeight: '400' }],    // 18px - Enhanced body
        'subhead': ['20px', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],         // 20px - Prominent text
        'title3': ['24px', { lineHeight: '1.5', letterSpacing: '-0.01em', fontWeight: '300' }],      // 24px - Small headings
        'title2': ['28px', { lineHeight: '1.45', letterSpacing: '-0.015em', fontWeight: '300' }],    // 28px - Medium headings
        'title1': ['32px', { lineHeight: '1.4', letterSpacing: '-0.02em', fontWeight: '300' }],      // 32px - Large headings
        'largeTitle': ['40px', { lineHeight: '1.35', letterSpacing: '-0.025em', fontWeight: '200' }], // 40px - Section headers
        'display': ['48px', { lineHeight: '1.3', letterSpacing: '-0.03em', fontWeight: '200' }],     // 48px - Hero text
        
        // Crisis Typography - Enhanced for vulnerable states
        'crisis': ['20px', { lineHeight: '1.8', letterSpacing: '0.02em', fontWeight: '500' }],       // Clear, readable
        'crisis-large': ['24px', { lineHeight: '1.75', letterSpacing: '0.015em', fontWeight: '500' }], // Emergency buttons
        'crisis-xl': ['32px', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '600' }],    // Critical alerts
        
        // Legacy support - maintaining backward compatibility
        'whisper': ['12px', { lineHeight: '1.75', letterSpacing: '0.03em', fontWeight: '300' }],
        'micro': ['12px', { lineHeight: '1.7', letterSpacing: '0.03em', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.7', letterSpacing: '0.015em', fontWeight: '400' }],
        'base': ['16px', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }],
        'medium': ['18px', { lineHeight: '1.65', letterSpacing: '-0.008em', fontWeight: '400' }],
        'large': ['20px', { lineHeight: '1.6', letterSpacing: '-0.012em', fontWeight: '400' }],
        'xlarge': ['24px', { lineHeight: '1.5', letterSpacing: '-0.015em', fontWeight: '300' }],
        '2xlarge': ['32px', { lineHeight: '1.4', letterSpacing: '-0.02em', fontWeight: '300' }],
        '3xlarge': ['40px', { lineHeight: '1.35', letterSpacing: '-0.025em', fontWeight: '200' }],
        '4xlarge': ['48px', { lineHeight: '1.3', letterSpacing: '-0.03em', fontWeight: '200' }],
        '5xlarge': ['56px', { lineHeight: '1.25', letterSpacing: '-0.035em', fontWeight: '100' }],
      },
      
      fontFamily: {
        // Sacred Typography - Fonts for Contemplation and Peace
        'sacred': [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          'sans-serif'
        ],
        'contemplation': [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif'
        ],
        'blessing': [
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif'
        ],
        'meditation': [
          '"SF Mono"',
          'Monaco',
          '"Cascadia Code"',
          '"Fira Code"',
          'monospace'
        ],
        
        // Legacy font support
        'system': [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          'sans-serif'
        ],
        'display': [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif'
        ],
        'mono': [
          '"SF Mono"',
          'Monaco',
          '"Cascadia Code"',
          'monospace'
        ]
      },
      
      fontWeight: {
        // Sacred Weight Hierarchy - Spiritual Typography
        'whisper': '100',      // Ultra-light for ethereal presence
        'breath': '200',       // Thin for gentle emphasis
        'presence': '300',     // Light for comfortable reading
        'ground': '400',       // Normal for grounded text
        'intention': '500',    // Medium for intentional emphasis
        'sacred': '600',       // Semi-bold for sacred headers
        
        // Legacy weights
        'ultralight': '100',
        'thin': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        // No bold weights - minimalist philosophy
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

export default config;
