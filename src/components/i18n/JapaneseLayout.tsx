/**
 * Japanese Layout Component
 * Handles Japanese text rendering, IME support, and cultural UI adaptations
 */

'use client';

import { useEffect, useState } from 'react';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { JapaneseLocaleConfig } from '@/lib/i18n/japanese-localization';

const inter = Inter({ subsets: ['latin'] });
const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  preload: true
});

interface JapaneseLayoutProps {
  children: React.ReactNode;
  config: JapaneseLocaleConfig;
  enableIME?: boolean;
  textDirection?: 'horizontal' | 'vertical';
  furiganaSupport?: boolean;
}

export default function JapaneseLayout({
  children,
  config,
  enableIME = true,
  textDirection = 'horizontal',
  furiganaSupport = true
}: JapaneseLayoutProps) {
  const [imeActive, setImeActive] = useState(false);
  const [textInputMode, setTextInputMode] = useState<'hiragana' | 'katakana' | 'kanji' | 'romaji'>('hiragana');

  useEffect(() => {
    // Configure Japanese text rendering
    document.documentElement.lang = 'ja';
    document.documentElement.setAttribute('dir', 'ltr');

    // Add Japanese-specific CSS classes
    document.body.classList.add('japanese-layout');
    
    if (textDirection === 'vertical') {
      document.body.classList.add('vertical-text');
    }

    if (furiganaSupport) {
      document.body.classList.add('furigana-support');
    }

    // IME event listeners
    if (enableIME) {
      const handleCompositionStart = () => setImeActive(true);
      const handleCompositionEnd = () => setImeActive(false);

      document.addEventListener('compositionstart', handleCompositionStart);
      document.addEventListener('compositionend', handleCompositionEnd);

      return () => {
        document.removeEventListener('compositionstart', handleCompositionStart);
        document.removeEventListener('compositionend', handleCompositionEnd);
      };
    }
  }, [enableIME, textDirection, furiganaSupport]);

  return (
    <div 
      className={`japanese-layout-container ${notoSansJP.className}`}
      data-formality={config.formalityLevel}
      data-context={config.context}
      data-ime-active={imeActive}
      style={{
        fontFeatureSettings: '"palt" 1, "pkna" 1', // Japanese typography features
        textRendering: 'optimizeLegibility',
        fontKerning: 'normal'
      }}
    >
      {/* Japanese-specific styles */}
      <style jsx global>{`
        .japanese-layout {
          /* Japanese font stack with fallbacks */
          font-family: ${notoSansJP.style.fontFamily}, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
          
          /* Line height optimized for Japanese text */
          line-height: 1.7;
          
          /* Character spacing for readability */
          letter-spacing: 0.05em;
          
          /* Prevent text overflow in narrow containers */
          word-break: break-word;
          overflow-wrap: break-word;
        }

        /* Vertical text support */
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        /* Furigana (reading aid) support */
        .furigana-support ruby {
          ruby-position: over;
          ruby-align: center;
        }

        .furigana-support rt {
          font-size: 0.6em;
          color: #666;
          font-weight: 300;
        }

        /* IME composition styling */
        [data-ime-active="true"] input,
        [data-ime-active="true"] textarea {
          ime-mode: active;
          composition-color: #4a90e2;
        }

        /* Japanese input field styling */
        .japanese-input {
          font-family: ${notoSansJP.style.fontFamily}, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
          font-size: 16px; /* Prevent iOS zoom */
          line-height: 1.6;
          letter-spacing: 0.02em;
        }

        /* Formal/respectful text styling */
        [data-formality="respectful"] .content-text,
        [data-formality="honorific"] .content-text {
          line-height: 1.8;
          letter-spacing: 0.08em;
        }

        /* Academic context styling */
        [data-context="academic"] {
          font-weight: 400;
        }

        /* Crisis context styling - larger, calmer text */
        [data-context="crisis"] {
          font-size: 1.1em;
          line-height: 1.9;
          letter-spacing: 0.1em;
        }

        /* Mobile Japanese text optimizations */
        @media (max-width: 768px) {
          .japanese-layout {
            font-size: 16px; /* Prevent iOS Safari zoom */
            line-height: 1.6;
          }
          
          .japanese-input {
            font-size: 16px !important; /* Force prevent zoom */
            padding: 12px 16px; /* Larger touch targets */
          }
        }

        /* Japanese punctuation and spacing */
        .japanese-text {
          /* Proper spacing around Japanese punctuation */
          text-spacing: ideograph-alpha ideograph-numeric;
        }

        /* Reading aids for complex kanji */
        .kanji-with-reading {
          position: relative;
          display: inline-block;
        }

        .kanji-reading {
          position: absolute;
          top: -1.2em;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.6em;
          color: #888;
          white-space: nowrap;
          pointer-events: none;
        }

        /* Cultural UI adaptations */
        .harmony-focused {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          padding: 1.5em;
        }

        .collective-context {
          border-left: 4px solid #a4b792;
          padding-left: 1em;
          margin-left: 1em;
        }

        /* Respectful spacing (ma - 間) */
        .respectful-spacing {
          margin: 2em 0;
          padding: 1.5em;
        }

        /* Seasonal UI adaptations (mono no aware - 物の哀れ) */
        .seasonal-spring { background-color: #fff5f5; }
        .seasonal-summer { background-color: #f0fff4; }
        .seasonal-autumn { background-color: #ffeaa7; }
        .seasonal-winter { background-color: #f8f9ff; }
      `}</style>

      {/* Text input mode indicator for mobile */}
      {enableIME && (
        <div className="ime-indicator">
          <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-gray-600 border border-gray-200 shadow-sm">
            {imeActive ? '入力中' : '待機中'}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

/**
 * Japanese Text Component with Furigana Support
 */
export function JapaneseText({ 
  children, 
  withFurigana = false, 
  kanji, 
  reading 
}: { 
  children: React.ReactNode;
  withFurigana?: boolean;
  kanji?: string;
  reading?: string;
}) {
  if (withFurigana && kanji && reading) {
    return (
      <ruby className="japanese-text">
        {kanji}
        <rt>{reading}</rt>
      </ruby>
    );
  }

  return <span className="japanese-text">{children}</span>;
}

/**
 * Japanese Input Component with IME Support
 */
export function JapaneseInput({
  placeholder,
  value,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  className = '',
  multiline = false,
  ...props
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
  className?: string;
  multiline?: boolean;
  [key: string]: any;
}) {
  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
    onCompositionStart?.();
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
    onCompositionEnd?.();
  };

  const Component = multiline ? 'textarea' : 'input';

  return (
    <Component
      className={`japanese-input ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      data-composing={isComposing}
      style={{
        imeMode: 'active',
        fontFamily: notoSansJP.style.fontFamily
      }}
      {...props}
    />
  );
}

/**
 * Cultural Context Wrapper
 */
export function CulturalContext({
  children,
  type,
  className = ''
}: {
  children: React.ReactNode;
  type: 'harmony' | 'collective' | 'respectful' | 'seasonal';
  className?: string;
}) {
  const contextClasses = {
    harmony: 'harmony-focused',
    collective: 'collective-context',
    respectful: 'respectful-spacing',
    seasonal: `seasonal-${getCurrentSeason()}`
  };

  return (
    <div className={`${contextClasses[type]} ${className}`}>
      {children}
    </div>
  );
}

function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}