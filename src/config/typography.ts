export const Typography = {
  fonts: {
    display: 'Iowan Old Style',      // Headers, seed text, container titles
    ui: 'Jost',                       // Labels, buttons, navigation, metadata
    mono: 'JetBrains Mono',           // (future use — journal timestamps, data)
  },
  
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
  },
  
  scale: {
    // Display (grounded serif)
    hero: { family: 'display', size: 42, weight: 'light', lineHeight: 1.2, letterSpacing: '0' },
    title: { family: 'display', size: 32, weight: 'light', lineHeight: 1.3, letterSpacing: '0' },
    heading: { family: 'display', size: 24, weight: 'regular', lineHeight: 1.4, letterSpacing: '0' },
    subheading: { family: 'display', size: 20, weight: 'regular', lineHeight: 1.5, letterSpacing: '0' },
    
    // Body/UI
    bodyLarge: { family: 'ui', size: 18, weight: 'regular', lineHeight: 1.7, letterSpacing: '0' },
    body: { family: 'ui', size: 16, weight: 'regular', lineHeight: 1.7, letterSpacing: '0' },
    
    // UI (Jost for functional elements)
    label: { family: 'ui', size: 14, weight: 'medium', lineHeight: 1.4, letterSpacing: '0' },
    caption: { family: 'ui', size: 12, weight: 'light', lineHeight: 1.4, letterSpacing: '0' },
    button: { family: 'ui', size: 14, weight: 'medium', lineHeight: 1, letterSpacing: '0' },
    nav: { family: 'ui', size: 11, weight: 'light', lineHeight: 1, letterSpacing: '0' },
  }
};
