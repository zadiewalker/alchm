// src/boot/loadFonts.ts
// Called from bootstrap() before React mounts

export function loadFonts(): void {
  if (typeof document === 'undefined') return;

  const fonts = [
    {
      family: 'Cormorant Garamond',
      src: '/fonts/CormorantGaramond-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      family: 'Cormorant Garamond',
      src: '/fonts/CormorantGaramond-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      family: 'Cormorant Garamond',
      src: '/fonts/CormorantGaramond-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      family: 'Jost',
      src: '/fonts/Jost-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      family: 'Jost',
      src: '/fonts/Jost-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      family: 'Jost',
      src: '/fonts/Jost-Light.woff2',
      weight: '300',
      style: 'normal',
    },
  ];

  // Inject @font-face rules directly into a <style> tag
  // This is more reliable in WebView than a CSS file import
  const style = document.createElement('style');
  style.textContent = fonts.map(f => `
    @font-face {
      font-family: '${f.family}';
      src: url('${f.src}') format('woff2');
      font-weight: ${f.weight};
      font-style: ${f.style};
      font-display: swap;
    }
  `).join('\n');
  document.head.insertBefore(style, document.head.firstChild);

  // Verify font files exist — warn if missing
  if (process.env.NODE_ENV === 'development') {
    fonts.forEach(f => {
      fetch(f.src, { method: 'HEAD' }).catch(() => {
        console.warn(`[Fonts] Missing font file: ${f.src}`);
        console.warn('[Fonts] Run: npm run download-fonts');
      });
    });
  }
}
