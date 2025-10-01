import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sacred Sage Palette - Unified with CSS tokens
        sage: {
          50: '#f6f8f4',    // --sage-whisper
          100: '#e8eae3',   // --sage-breath
          200: '#d1d6c7',   // --sage-calm
          300: '#b4bca2',
          400: '#a4b792',   // --sage-heart (primary)
          500: '#93a682',   // --sage-root
          600: '#7a8c6a',   // --sage-earth
          700: '#626d54',   // --sage-wisdom
          800: '#4f5843',
          900: '#3d4435',
        },
        
        // Premium Digital Sanctuary - Off-White Breathing Space
        offwhite: {
          DEFAULT: '#f7f7f2',    // Primary off-white
          warm: '#faf9f5',       // Slightly warmer variant
        },

        // Terracotta Palette - Warmth & Humanity
        terracotta: {
          50: '#fdf7f0',
          100: '#f7e6d3',
          200: '#e4bda8',        // --color-terracotta-light
          300: '#d4a574',
          400: '#cb997e',        // --color-terracotta (primary)
          500: '#b5835f',        // --color-terracotta-dark
          600: '#a0815a',
          700: '#8b6d4a',
          800: '#6d5438',
          900: '#4a3826',
          mist: 'rgba(203, 153, 126, 0.1)',
        },

        // Charcoal Palette - Grounded Authority
        charcoal: {
          50: '#f8f8f8',
          100: '#e5e5e5',
          200: '#d1d1d1',
          300: '#b8b8b8',
          400: '#9e9e9e',
          500: '#6b6b6b',         // --color-charcoal-light
          600: '#4a4a4a',         // --color-charcoal-medium
          700: '#424242',
          800: '#2e2e2e',         // --color-charcoal (primary)
          900: '#1a1a1a',
        },
        
        // Soft Blush Palette - Emotional Softness
        blush: {
          50: '#faf8f7',
          100: '#f7f0eb',        // --color-blush-light
          200: '#eeddd3',        // --color-blush (primary)
          300: '#e0d0c8',
          400: '#ddc4b5',        // --color-blush-dark
          500: '#c5a5a5',
          600: '#b89494',
          700: '#a08080',
          800: '#806060',
          900: '#604545',
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
        
        // Sacred Geometry Spacing - Fibonacci & Golden Ratio Based
        'breath': '8px',      // --space-1 - breath
        'gentle': '16px',     // --space-2 - gentle space
        'contemplative': '24px', // --space-3 - contemplative space
        'mindful': '32px',    // --space-4 - mindful distance
        'fibonacci': '40px',  // --space-5 - Fibonacci
        'harmonic': '48px',   // --space-6 - harmonic space
        'phi': '52px',        // --space-phi - Golden ratio space
        'meditation': '64px', // --space-8 - Fibonacci
        'expansive': '96px',  // --space-12 - wide meditation
        'sanctuary': '128px', // --space-16 - expansive breath
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
        // Sacred Shadow System - Gentle Elevation & Divine Light
        'whisper': '0 1px 2px rgba(164, 183, 146, 0.04)',        // Barely there
        'breath': '0 2px 4px rgba(164, 183, 146, 0.06)',         // Gentle presence
        'blessing': '0 4px 8px rgba(164, 183, 146, 0.08)',       // Sacred blessing
        'sanctuary': '0 8px 24px rgba(164, 183, 146, 0.12)',     // Sanctuary depth
        'temple': '0 16px 48px rgba(164, 183, 146, 0.15)',       // Temple majesty
        'divine': '0 24px 72px rgba(164, 183, 146, 0.18)',       // Divine presence
        
        // Legacy shadow support
        'gentle': '0 2px 4px rgba(164, 183, 146, 0.06)',
        'soft': '0 4px 8px rgba(164, 183, 146, 0.08)',
        'sacred': '0 8px 24px rgba(164, 183, 146, 0.12)',
      },
      
      borderRadius: {
        // Sacred Radii - Organic, Nature-Inspired Curves
        'whisper': '4px',    // Subtle rounding - gentle touch
        'breath': '8px',     // Breathing curve - natural flow
        'embrace': '12px',   // Embracing curve - welcoming form
        'sanctuary': '16px', // Sanctuary curve - protective space
        'temple': '24px',    // Temple curve - sacred architecture
        'sacred': '32px',    // Sacred curve - divine geometry
        'infinite': '50%',   // Infinite curve - circle of wholeness
        
        // Legacy support
        'sm': '8px',      // var(--radius-sm)
        'md': '12px',     // var(--radius-md) 
        'lg': '16px',     // var(--radius-lg)
        'xl': '24px',     // var(--radius-xl)
      },
      
      transitionDuration: {
        // Sacred Animation Timing - Ritual-Like, Meaningful Movements
        'whisper': '150ms',   // Quick blessing
        'breath': '300ms',    // One gentle breath
        'pulse': '600ms',     // Heartbeat rhythm
        'meditation': '1200ms', // Deep contemplation
        'ritual': '2000ms',   // Sacred ceremony
        
        // Legacy timing support
        'fast': '150ms',
        'base': '300ms',
        'slow': '600ms',
      },
      
      transitionTimingFunction: {
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
        // Sacred Typography Scale - Unified with CSS Foundation
        // Trauma-informed: 16px minimum base, enhanced line heights for stress reading
        
        'micro': ['12px', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.6', letterSpacing: '0.015em', fontWeight: '400' }],
        'base': ['16px', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'medium': ['18px', { lineHeight: '1.6', letterSpacing: '-0.01em', fontWeight: '400' }],
        'large': ['24px', { lineHeight: '1.5', letterSpacing: '-0.015em', fontWeight: '300' }],
        'xlarge': ['32px', { lineHeight: '1.4', letterSpacing: '-0.02em', fontWeight: '300' }],
        '2xlarge': ['40px', { lineHeight: '1.3', letterSpacing: '-0.025em', fontWeight: '200' }],
        '3xlarge': ['56px', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '200' }],
        
        // Crisis Typography - Enhanced readability
        'crisis': ['20px', { lineHeight: '1.8', letterSpacing: '0.01em', fontWeight: '500' }],
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
