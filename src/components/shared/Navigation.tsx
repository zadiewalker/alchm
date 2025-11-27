'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  variant?: 'default' | 'minimal' | 'floating';
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
}

export function Navigation({ 
  variant = 'default', 
  showBack = false, 
  backTo = '/dashboard',
  backLabel = '← Back to Sanctuary'
}: NavigationProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navigationItems = [
    { href: '/dashboard', label: 'Sanctuary', icon: '🌿' },
    { href: '/journals', label: 'Sacred Writing', icon: '✍️' },
    { href: '/pathways', label: 'Identity Pathways', icon: '🌱' },
    { href: '/pricing', label: 'Journey Options', icon: '✨' },
  ];

  if (variant === 'minimal') {
    return (
      <nav className="mb-12">
        <Link 
          href={backTo} 
          className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300 ease-out text-sm bg-sanctuary-glass backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/20 hover:scale-105 min-h-[44px]"
        >
          <span>←</span>
          {backLabel}
        </Link>
      </nav>
    );
  }

  if (variant === 'floating') {
    return (
      <nav className="fixed top-8 right-8 z-50 bg-sanctuary-glass backdrop-blur-xl border border-white/20 rounded-3xl p-3 shadow-xl">
        <div className="flex items-center gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ease-out min-h-[44px] flex items-center justify-center
                ${pathname === item.href 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                }
              `}
            >
              <span className="mr-2">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
          {user && (
            <button
              onClick={signOut}
              className="px-4 py-3 rounded-2xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 ease-out ml-2 border-l border-white/20 pl-4 min-h-[44px]"
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>
    );
  }

  // Default luxury navigation
  return (
    <nav className="mb-16">
      <div className="flex items-center justify-between">
        {showBack && (
          <Link 
            href={backTo} 
            className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300 ease-out text-sm bg-sanctuary-glass backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/20 hover:scale-105 min-h-[44px]"
          >
            <span>←</span>
            {backLabel}
          </Link>
        )}
        
        <div className="flex items-center gap-4">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ease-out min-h-[44px] backdrop-blur-xl
                ${pathname === item.href 
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                }
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-white/70 text-sm bg-sanctuary-glass backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20">
              {user.displayName || 'Sacred Being'}
            </span>
            <button
              onClick={signOut}
              className="text-white/80 hover:text-white text-sm transition-all duration-300 ease-out bg-sanctuary-glass backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/20 hover:scale-105 min-h-[44px]"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}