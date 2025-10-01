'use client';

import React from 'react';
import { copy } from '@/lib/copy';

export function CrisisNotice() {
  return (
    <div 
      role="alert" 
      className="mt-6 rounded-xl border border-alchm-accent/40 bg-alchm-surface p-4 text-alchm-text"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <svg 
            className="w-5 h-5 text-alchm-accent" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.892-.833-2.664 0L4.151 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        <div className="flex-1">
          <p className="text-sm leading-relaxed">
            {copy.contract.crisis}
          </p>
          
          <div className="mt-3 space-y-1">
            <div>
              <a 
                className="text-alchm-primary underline hover:text-alchm-primary-hover transition-colors focus-ring rounded" 
                href="tel:988"
              >
                {copy.contract.crisisUs}
              </a>
            </div>
            
            <div>
              <a 
                className="text-alchm-primary underline hover:text-alchm-primary-hover transition-colors focus-ring rounded" 
                href="tel:111"
              >
                {copy.contract.crisisUk}
              </a>
            </div>
            
            <div>
              <a 
                className="text-alchm-primary underline hover:text-alchm-primary-hover transition-colors focus-ring rounded" 
                href="sms:741741?body=HOME"
              >
                {copy.contract.crisisIntl}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}