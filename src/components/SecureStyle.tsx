'use client';

import React from 'react';
import { validateCSS } from '@/lib/secureCSSLoader';

interface SecureStyleProps {
  css: string;
  id?: string;
}

/**
 * React component for secure CSS injection
 * Uses textContent instead of dangerouslySetInnerHTML for security
 */
export function SecureStyle({ css, id }: SecureStyleProps) {
  const sanitizedCSS = validateCSS(css);
  
  if (!sanitizedCSS.trim()) {
    return null;
  }

  return (
    <style 
      type="text/css" 
      id={id}
      ref={(el) => {
        if (el) {
          el.textContent = sanitizedCSS;
        }
      }}
    />
  );
}

export default SecureStyle;