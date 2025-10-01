import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variantClasses = {
      primary: 'bg-[var(--sage-deep)] text-white hover:bg-[var(--sage)] focus:ring-[var(--sage)]',
      secondary: 'bg-[var(--sage-mist)] text-[var(--ink)] hover:bg-[var(--sage-whisper)] focus:ring-[var(--sage)]',
      outline: 'border-2 border-[var(--sage-deep)] text-[var(--sage-deep)] hover:bg-[var(--sage-deep)] hover:text-white focus:ring-[var(--sage)]',
      ghost: 'text-[var(--sage-deep)] hover:bg-[var(--sage-mist)] focus:ring-[var(--sage)]'
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg'
    };

    const combinedClassName = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };