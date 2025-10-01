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
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
        >
          {backLabel}
        </Link>
      </nav>
    );
  }

  if (variant === 'floating') {
    return (
      <nav className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
        <div className="flex items-center gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${pathname === item.href 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span className="mr-1">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
          {user && (
            <button
              onClick={signOut}
              className="px-3 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 ml-2 border-l border-white/20 pl-4"
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>
    );
  }

  // Default navigation
  return (
    <nav className="mb-12">
      <div className="flex items-center justify-between">
        {showBack && (
          <Link 
            href={backTo} 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            {backLabel}
          </Link>
        )}
        
        <div className="flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${pathname === item.href 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
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
            <span className="text-white/70 text-sm">
              {user.displayName || 'Sacred Being'}
            </span>
            <button
              onClick={signOut}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}