'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Trauma-informed navigation that provides clear wayfinding and safe exits

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  description: string;
  isProtected?: boolean; // Requires mindful confirmation
  isSafe?: boolean; // Always accessible for crisis
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Sanctuary',
    icon: '🏠',
    href: '/dashboard',
    description: 'Your safe home base and overview',
    isSafe: true
  },
  {
    id: 'journal',
    label: 'Reflect',
    icon: '✍️',
    href: '/journal',
    description: 'Write and explore your thoughts',
    isProtected: true
  },
  {
    id: 'journals',
    label: 'Journey',
    icon: '📖',
    href: '/journals',
    description: 'Review your growth over time'
  },
  {
    id: 'pathways',
    label: 'Pathways',
    icon: '🌱',
    href: '/pathways',
    description: 'Guided healing journeys'
  },
  {
    id: 'community',
    label: 'Circle',
    icon: '🤝',
    href: '/community',
    description: 'Connect with your healing community'
  },
  {
    id: 'crisis',
    label: 'Support',
    icon: '🆘',
    href: '/crisis-resources',
    description: 'Immediate support and resources',
    isSafe: true
  }
];

export function SanctuaryNavigation({ className = '' }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [confirmingNavigation, setConfirmingNavigation] = useState<string | null>(null);

  const handleNavigation = (item: NavigationItem) => {
    // For protected routes, provide mindful confirmation
    if (item.isProtected && pathname !== item.href) {
      setConfirmingNavigation(item.id);
      return;
    }

    // Gentle transition for better UX
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(item.href);
      setIsTransitioning(false);
    }, 150);
  };

  const confirmNavigation = (item: NavigationItem) => {
    setConfirmingNavigation(null);
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(item.href);
      setIsTransitioning(false);
    }, 150);
  };

  const currentItem = NAVIGATION_ITEMS.find(item => pathname.startsWith(item.href));

  return (
    <>
      <nav className={`sanctuary-nav ${className}`}>
        <div className="sanctuary-container">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage-accent-bg flex items-center justify-center">
                <span className="text-lg">🕊️</span>
              </div>
              <div>
                <h1 className="font-medium text-sanctuary-gray-800">ALCHM</h1>
                <p className="text-xs text-sanctuary-gray-500">Your Digital Sanctuary</p>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const isCurrentPage = pathname === item.href;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    disabled={isTransitioning}
                    className={`sanctuary-nav-item relative group ${isActive ? 'active' : ''}`}
                    title={item.description}
                  >
                    <span className="text-lg mr-2">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isCurrentPage && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-sage-100 rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Hover tooltip */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
                                  bg-sanctuary-gray-800 text-white px-3 py-1 rounded-lg text-xs
                                  opacity-0 group-hover:opacity-100 transition-opacity delay-500
                                  pointer-events-none whitespace-nowrap z-50">
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Toggle */}
            <MobileMenuToggle />
          </div>
        </div>
      </nav>

      {/* Navigation Confirmation Modal */}
      <AnimatePresence>
        {confirmingNavigation && (
          <NavigationConfirmationModal
            item={NAVIGATION_ITEMS.find(i => i.id === confirmingNavigation)!}
            onConfirm={confirmNavigation}
            onCancel={() => setConfirmingNavigation(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MobileMenuToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-sage-50 transition-colors"
        aria-label="Toggle navigation menu"
      >
        <svg
          className="w-6 h-6 text-sanctuary-gray-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full right-4 mt-2 bg-sanctuary-white rounded-xl shadow-nurturing border border-sanctuary-gray-100 p-2 z-50"
          >
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-sage-50 transition-colors ${
                    isActive ? 'bg-sage-100 text-sage-700' : 'text-sanctuary-gray-600'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-sanctuary-gray-500">{item.description}</div>
                  </div>
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavigationConfirmationModal({ 
  item, 
  onConfirm, 
  onCancel 
}: { 
  item: NavigationItem;
  onConfirm: (item: NavigationItem) => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="sanctuary-card max-w-sm mx-auto text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-accent-bg flex items-center justify-center">
          <span className="text-2xl">{item.icon}</span>
        </div>
        
        <h3 className="text-lg font-medium text-sanctuary-gray-800 mb-2">
          Ready to {item.label}?
        </h3>
        
        <p className="text-sanctuary-gray-600 mb-6">
          {item.description}. Take a breath and go when you're ready.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(item)}
            className="flex-1 sage-primary safe-button"
          >
            I'm ready
          </button>
          <button
            onClick={onCancel}
            className="flex-1 safe-button"
          >
            Not yet
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SanctuaryBreadcrumbs({ 
  items, 
  className = '' 
}: { 
  items: BreadcrumbItem[];
  className?: string;
}) {
  const router = useRouter();

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-sanctuary-gray-300">→</span>
          )}
          
          {item.href && !item.isCurrent ? (
            <button
              onClick={() => router.push(item.href!)}
              className="text-sanctuary-gray-500 hover:text-sage-600 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className={`${item.isCurrent ? 'text-sage-600 font-medium' : 'text-sanctuary-gray-400'}`}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

export function QuickNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const quickActions = [
    {
      id: 'write',
      label: 'Quick Write',
      icon: '✍️',
      href: '/journal?quick=true',
      color: 'sage'
    },
    {
      id: 'voice',
      label: 'Voice Note',
      icon: '🎤',
      href: '/journal?voice=true',
      color: 'calm'
    },
    {
      id: 'support',
      label: 'Need Support',
      icon: '🆘',
      href: '/crisis-resources',
      color: 'warm'
    }
  ];

  if (pathname === '/journal' || pathname === '/crisis-resources') {
    return null; // Hide on these pages to avoid confusion
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex flex-col gap-3">
        {quickActions.map((action) => (
          <motion.button
            key={action.id}
            onClick={() => router.push(action.href)}
            className={`w-14 h-14 rounded-full shadow-nurturing flex items-center justify-center
                      ${action.color === 'sage' ? 'bg-sage-400 hover:bg-sage-500' :
                        action.color === 'calm' ? 'bg-calm-blue hover:bg-opacity-90' :
                        'bg-warm-amber hover:bg-opacity-90'} 
                      text-white transition-all duration-300 hover:scale-110`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={action.label}
          >
            <span className="text-xl">{action.icon}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function SanctuaryPageHeader({
  title,
  subtitle,
  icon,
  breadcrumbs,
  actions,
  className = ''
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`sanctuary-section pb-8 ${className}`}>
      <div className="sanctuary-container">
        {breadcrumbs && (
          <SanctuaryBreadcrumbs items={breadcrumbs} className="mb-4" />
        )}
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-16 h-16 rounded-full bg-sage-accent-bg flex items-center justify-center breathing-element">
                <span className="text-2xl">{icon}</span>
              </div>
            )}
            
            <div>
              <h1 className="text-3xl font-light text-sanctuary-gray-800 mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg text-sanctuary-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}