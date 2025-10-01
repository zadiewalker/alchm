/*
 * ALCHM Cultural Typography System
 * Multilingual, culturally-aware typography that respects diverse reading patterns
 * Handles RTL/LTR languages, different script systems, and cultural aesthetic preferences
 */

import React from 'react';

interface CulturalTextProps {
  children: React.ReactNode;
  lang?: string;
  variant?: 'heading' | 'body' | 'caption' | 'emphasis' | 'sacred';
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold';
  culturalContext?: 'individualist' | 'collectivist' | 'mixed';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Language-specific font stacks and optimizations
const languageFontStacks = {
  // Latin scripts
  en: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  es: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  pt: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  fr: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  de: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  it: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  
  // Arabic scripts
  ar: '"SF Arabic", "Tahoma", "Arial Unicode MS", system-ui, sans-serif',
  fa: '"SF Arabic", "Tahoma", "Arial Unicode MS", system-ui, sans-serif',
  ur: '"SF Arabic", "Tahoma", "Arial Unicode MS", system-ui, sans-serif',
  
  // Chinese scripts
  zh: '"SF Pro SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif',
  'zh-cn': '"SF Pro SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif',
  'zh-tw': '"SF Pro TC", "PingFang TC", "Hiragino Sans CNS", system-ui, sans-serif',
  
  // Japanese scripts
  ja: '"SF Pro JP", "Hiragino Sans", "Yu Gothic", "Meiryo", system-ui, sans-serif',
  
  // Korean scripts
  ko: '"SF Pro KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
  
  // Indic scripts
  hi: '"SF Pro Indic", "Noto Sans Devanagari", "Mangal", system-ui, sans-serif',
  bn: '"SF Pro Indic", "Noto Sans Bengali", "Kalpurush", system-ui, sans-serif',
  te: '"SF Pro Indic", "Noto Sans Telugu", "Gautami", system-ui, sans-serif',
  ta: '"SF Pro Indic", "Noto Sans Tamil", "Latha", system-ui, sans-serif',
  gu: '"SF Pro Indic", "Noto Sans Gujarati", "Shruti", system-ui, sans-serif',
  mr: '"SF Pro Indic", "Noto Sans Devanagari", "Mangal", system-ui, sans-serif',
  
  // Thai scripts
  th: '"SF Pro Thai", "Sukhumvit Set", "Helvetica Neue", system-ui, sans-serif',
  
  // Vietnamese scripts
  vi: '"SF Pro Display", "Helvetica Neue", system-ui, sans-serif',
  
  // Hebrew scripts
  he: '"SF Hebrew", "Arial Hebrew", "Tahoma", system-ui, sans-serif',
  
  // Russian/Cyrillic scripts
  ru: '"SF Pro Display", "Helvetica Neue", system-ui, sans-serif',
  bg: '"SF Pro Display", "Helvetica Neue", system-ui, sans-serif',
  sr: '"SF Pro Display", "Helvetica Neue", system-ui, sans-serif',
};

// RTL language detection
const rtlLanguages = ['ar', 'fa', 'ur', 'he'];

// Script-specific line height optimizations
const scriptLineHeights = {
  latin: 1.6,
  arabic: 1.8,
  chinese: 1.7,
  japanese: 1.7,
  korean: 1.6,
  indic: 1.8,
  thai: 1.7,
  cyrillic: 1.6,
};

// Cultural reading pattern preferences
const culturalSpacing = {
  individualist: {
    letterSpacing: '0.01em',
    wordSpacing: '0.1em',
    paragraphSpacing: '1.5em',
  },
  collectivist: {
    letterSpacing: '0.02em',
    wordSpacing: '0.15em',
    paragraphSpacing: '1.2em',
  },
  mixed: {
    letterSpacing: '0.015em',
    wordSpacing: '0.125em',
    paragraphSpacing: '1.35em',
  },
};

// Size mappings with cultural considerations
const sizeMappings = {
  sm: {
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    lineHeight: '1.6',
  },
  base: {
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    lineHeight: '1.7',
  },
  lg: {
    fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
    lineHeight: '1.6',
  },
  xl: {
    fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)',
    lineHeight: '1.5',
  },
  '2xl': {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    lineHeight: '1.4',
  },
  '3xl': {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    lineHeight: '1.3',
  },
};

// Weight mappings
const weightMappings = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
};

// Get script type from language
function getScriptType(lang: string): keyof typeof scriptLineHeights {
  if (['ar', 'fa', 'ur'].includes(lang)) return 'arabic';
  if (['zh', 'zh-cn', 'zh-tw'].includes(lang)) return 'chinese';
  if (lang === 'ja') return 'japanese';
  if (lang === 'ko') return 'korean';
  if (['hi', 'bn', 'te', 'ta', 'gu', 'mr'].includes(lang)) return 'indic';
  if (lang === 'th') return 'thai';
  if (['ru', 'bg', 'sr'].includes(lang)) return 'cyrillic';
  return 'latin';
}

// Get direction from language
function getDirection(lang: string): 'ltr' | 'rtl' {
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
}

// Main Cultural Text Component
export const CulturalText: React.FC<CulturalTextProps> = ({
  children,
  lang = 'en',
  variant = 'body',
  size = 'base',
  weight = 'normal',
  culturalContext = 'mixed',
  className = '',
  as = 'div',
}) => {
  const Component = as;
  const scriptType = getScriptType(lang);
  const direction = getDirection(lang);
  const fontFamily = languageFontStacks[lang as keyof typeof languageFontStacks] || languageFontStacks.en;
  const lineHeight = scriptLineHeights[scriptType];
  const spacing = culturalSpacing[culturalContext];
  const sizeConfig = sizeMappings[size];
  const fontWeight = weightMappings[weight];

  const styles: React.CSSProperties = {
    fontFamily,
    fontSize: sizeConfig.fontSize,
    lineHeight,
    fontWeight,
    direction,
    letterSpacing: spacing.letterSpacing,
    wordSpacing: spacing.wordSpacing,
    textAlign: direction === 'rtl' ? 'right' : 'left',
  };

  // Add variant-specific styles
  if (variant === 'heading') {
    styles.fontWeight = 300;
    styles.letterSpacing = '-0.02em';
  } else if (variant === 'emphasis') {
    styles.fontWeight = 500;
    styles.letterSpacing = '0.02em';
  } else if (variant === 'sacred') {
    styles.fontWeight = 300;
    styles.letterSpacing = '0.05em';
    styles.textAlign = 'center';
  } else if (variant === 'caption') {
    styles.fontSize = 'clamp(0.75rem, 1.5vw, 0.875rem)';
    styles.opacity = 0.8;
  }

  const baseClasses = [
    'cultural-text',
    `script-${scriptType}`,
    `direction-${direction}`,
    `context-${culturalContext}`,
    `variant-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      lang={lang}
      className={baseClasses}
      style={styles}
      dir={direction}
    >
      {children}
    </Component>
  );
};

// Specialized Typography Components

interface CulturalHeadingProps extends Omit<CulturalTextProps, 'variant' | 'as'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CulturalHeading: React.FC<CulturalHeadingProps> = ({
  level = 2,
  size,
  ...props
}) => {
  const headingSize = size || (['3xl', '2xl', 'xl', 'lg', 'base', 'sm'][level - 1] as any);
  
  return (
    <CulturalText
      {...props}
      variant="heading"
      size={headingSize}
      as={`h${level}` as keyof JSX.IntrinsicElements}
    />
  );
};

interface CulturalParagraphProps extends Omit<CulturalTextProps, 'variant' | 'as'> {
  spacing?: 'tight' | 'normal' | 'loose';
}

export const CulturalParagraph: React.FC<CulturalParagraphProps> = ({
  spacing = 'normal',
  className = '',
  culturalContext = 'mixed',
  ...props
}) => {
  const spacingValue = culturalSpacing[culturalContext].paragraphSpacing;
  const spacingClass = spacing === 'tight' ? 'mb-2' : spacing === 'loose' ? 'mb-8' : 'mb-4';
  
  return (
    <CulturalText
      {...props}
      variant="body"
      as="p"
      culturalContext={culturalContext}
      className={`${spacingClass} ${className}`}
      style={{ marginBottom: spacingValue }}
    />
  );
};

// Sacred Text Component for spiritual/ceremonial content
interface SacredTextProps extends Omit<CulturalTextProps, 'variant'> {
  intention?: string;
}

export const SacredText: React.FC<SacredTextProps> = ({
  intention,
  className = '',
  ...props
}) => {
  return (
    <div className="sacred-text-container">
      {intention && (
        <div className="sacred-intention text-xs text-center mb-2 opacity-60">
          {intention}
        </div>
      )}
      <CulturalText
        {...props}
        variant="sacred"
        className={`sacred-text ${className}`}
      />
    </div>
  );
};

// Multilingual Quote Component
interface CulturalQuoteProps {
  children: React.ReactNode;
  author?: string;
  source?: string;
  lang?: string;
  culturalContext?: 'individualist' | 'collectivist' | 'mixed';
  className?: string;
}

export const CulturalQuote: React.FC<CulturalQuoteProps> = ({
  children,
  author,
  source,
  lang = 'en',
  culturalContext = 'mixed',
  className = '',
}) => {
  const direction = getDirection(lang);
  const quotationMarks = direction === 'rtl' ? ['«', '»'] : ['"', '"'];
  
  return (
    <blockquote 
      className={`cultural-quote ${className}`}
      lang={lang}
      dir={direction}
    >
      <CulturalText
        lang={lang}
        variant="emphasis"
        size="lg"
        culturalContext={culturalContext}
        className="quote-text"
      >
        {quotationMarks[0]}{children}{quotationMarks[1]}
      </CulturalText>
      {(author || source) && (
        <footer className="quote-attribution mt-4">
          <CulturalText
            lang={lang}
            variant="caption"
            culturalContext={culturalContext}
            className="quote-source"
          >
            {author && <span className="quote-author">— {author}</span>}
            {source && <span className="quote-source-title">, {source}</span>}
          </CulturalText>
        </footer>
      )}
    </blockquote>
  );
};

// Emotion Expression Component (handles cultural emotional vocabulary)
interface EmotionExpressionProps {
  emotion: string;
  culturalContext?: string;
  lang?: string;
  className?: string;
}

export const EmotionExpression: React.FC<EmotionExpressionProps> = ({
  emotion,
  culturalContext,
  lang = 'en',
  className = '',
}) => {
  // Culture-specific emotional concepts
  const culturalEmotions: Record<string, Record<string, string>> = {
    en: {
      saudade: 'deep nostalgic longing',
      ubuntu: 'interconnected humanity',
      hygge: 'cozy contentment',
      ikigai: 'life purpose',
    },
    pt: {
      saudade: 'saudade',
    },
    ja: {
      ikigai: '生き甲斐',
      mono_no_aware: '物の哀れ',
    },
    ko: {
      han: '한',
      jeong: '정',
    },
    ar: {
      tarab: 'طرب',
    },
  };

  const displayEmotion = culturalEmotions[lang]?.[emotion] || emotion;

  return (
    <span 
      className={`emotion-expression ${className}`}
      lang={lang}
      title={emotion !== displayEmotion ? emotion : undefined}
    >
      <CulturalText
        lang={lang}
        variant="emphasis"
        size="sm"
        className="emotion-text"
      >
        {displayEmotion}
      </CulturalText>
    </span>
  );
};

// Cultural Reading Preferences Hook
export function useCulturalReadingPreferences(lang: string, userPreferences?: any) {
  const scriptType = getScriptType(lang);
  const direction = getDirection(lang);
  
  // Default preferences based on cultural research
  const defaultPreferences = {
    fontSize: scriptType === 'indic' || scriptType === 'arabic' ? 'larger' : 'normal',
    lineHeight: scriptType === 'chinese' || scriptType === 'japanese' ? 'relaxed' : 'normal',
    letterSpacing: scriptType === 'arabic' ? 'wide' : 'normal',
    contrast: 'normal',
    motion: 'gentle',
  };

  return {
    ...defaultPreferences,
    ...userPreferences,
    direction,
    scriptType,
  };
}

// Accessibility-enhanced reading component
interface AccessibleReadingProps {
  children: React.ReactNode;
  lang?: string;
  readingLevel?: 'simple' | 'standard' | 'complex';
  stressReading?: boolean;
  className?: string;
}

export const AccessibleReading: React.FC<AccessibleReadingProps> = ({
  children,
  lang = 'en',
  readingLevel = 'standard',
  stressReading = false,
  className = '',
}) => {
  const preferences = useCulturalReadingPreferences(lang);
  
  const readingStyles: React.CSSProperties = {
    fontSize: readingLevel === 'simple' ? '1.125rem' : '1rem',
    lineHeight: stressReading ? 1.8 : preferences.lineHeight === 'relaxed' ? 1.7 : 1.6,
    letterSpacing: stressReading ? '0.02em' : '0.01em',
    wordSpacing: stressReading ? '0.15em' : '0.1em',
  };

  return (
    <div 
      className={`accessible-reading ${className}`}
      style={readingStyles}
      lang={lang}
      dir={preferences.direction}
    >
      <CulturalText
        lang={lang}
        variant="body"
        className="accessible-content"
      >
        {children}
      </CulturalText>
    </div>
  );
};

export default {
  CulturalText,
  CulturalHeading,
  CulturalParagraph,
  SacredText,
  CulturalQuote,
  EmotionExpression,
  AccessibleReading,
  useCulturalReadingPreferences,
};