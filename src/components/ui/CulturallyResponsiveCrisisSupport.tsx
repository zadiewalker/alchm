/**
 * Simple Culturally Responsive Crisis Support
 */

import React from 'react';

interface CulturallyResponsiveCrisisSupportProps {
  position?: string;
}

export default function CulturallyResponsiveCrisisSupport({ position }: CulturallyResponsiveCrisisSupportProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a 
        href="tel:988" 
        className="bg-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
        aria-label="Crisis support - Call 988"
      >
        🆘
      </a>
    </div>
  );
}