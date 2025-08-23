// Badge UI Components - Reusable badge components for ALCHM

'use client';

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variantClasses = {
    default: 'border-transparent bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'border-transparent bg-slate-700 text-white hover:bg-slate-600',
    destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
    outline: 'border-slate-600 text-gray-300 hover:bg-slate-800'
  };
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}