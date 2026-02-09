/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/utils/**/*.{js,ts}',
    './out/index.html',
  ],
  theme: {
    extend: {
      colors: {
        // Sacred ALCHM Color Palette
        sage: {
          deep: '#7A8B6D',
          DEFAULT: '#8B9A7C',
          light: '#A8B09E',
          pale: '#B8C4B0',
        },
        gold: {
          DEFAULT: '#E8C56D',
          soft: '#F2D99D',
          pale: '#F7E8CA',
        },
        stone: {
          warm: '#EAE5D9',
          muted: '#D5D0C4',
        },
        cream: '#FDF9F3',
        
        // Design system tokens for consistency
        primary: '#8B9A7C',    // sage.DEFAULT
        secondary: '#E8C56D',   // gold.DEFAULT
        surface: '#EAE5D9',     // stone.warm
        accent: '#A8B09E',      // sage.light
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}