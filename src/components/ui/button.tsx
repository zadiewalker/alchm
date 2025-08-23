// Button UI Components - Reusable button components for ALCHM

'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Button({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default',
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    default: 'bg-purple-600 text-white hover:bg-purple-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-slate-600 bg-transparent text-gray-300 hover:bg-slate-800 hover:text-white',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600',
    ghost: 'text-gray-300 hover:bg-slate-800 hover:text-white',
    link: 'text-purple-400 underline-offset-4 hover:underline'
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}