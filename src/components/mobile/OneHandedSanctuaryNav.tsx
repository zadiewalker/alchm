'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  crisisAccess?: boolean; // Always accessible during crisis
}

interface OneHandedSanctuaryNavProps {
  /** Navigation items */
  items?: NavItem[];
  /** Enable crisis mode adaptations */
  crisisMode?: boolean;
  /** Battery conservation mode */
  batterySaver?: boolean;
  /** One-handed optimization (defaults to true) */
  oneHandedMode?: boolean;
  /** Custom className */
  className?: string;
  /** Callback when navigation changes */
  onNavigate?: (path: string) => void;
}

const OneHandedSanctuaryNav: React.FC<OneHandedSanctuaryNavProps> = ({
  items,
  crisisMode = false,
  batterySaver = false,
  oneHandedMode = true,
  className = '',
  onNavigate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  
  // Default navigation items optimized for trauma-informed UX
  const defaultNavItems: NavItem[] = [
    {
      id: 'home',
      label: 'Sanctuary',
      href: '/',
      icon: '🏠',
      description: 'Return to your safe space',
      priority: 'high',
      crisisAccess: true
    },
    {
      id: 'journal',
      label: 'Journal',
      href: '/journal',
      icon: '📖',
      description: 'Sacred writing space',
      priority: 'high',
      crisisAccess: true
    },
    {
      id: 'journals',
      label: 'Entries',
      href: '/journals',
      icon: '📚',
      description: 'Your healing journey',
      priority: 'medium'
    },
    {
      id: 'pathways',
      label: 'Pathways',
      href: '/pathways',
      icon: '🌱',
      description: 'Guided healing paths',
      priority: 'medium'
    },
    {
      id: 'dashboard',
      label: 'Insights',
      href: '/dashboard',
      icon: '📊',
      description: 'Growth visualization',
      priority: 'low'
    },
    {
      id: 'crisis',
      label: 'Crisis Support',
      href: '/crisis-resources',
      icon: '🆘',
      description: 'Immediate help resources',
      priority: 'high',
      crisisAccess: true
    }
  ];

  const navItems = items || defaultNavItems;

  // Set active tab based on current path
  useEffect(() => {
    const currentItem = navItems.find(item => 
      pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
    );
    setActiveTab(currentItem?.id || navItems[0].id);
  }, [pathname, navItems]);

  // Handle navigation
  const handleNavigate = (item: NavItem) => {
    if (item.href !== pathname) {
      router.push(item.href);
      onNavigate?.(item.href);
    }
    setIsExpanded(false);
  };

  // Handle swipe gesture for expansion
  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    if (offset.y < -50 && !isExpanded) {
      setIsExpanded(true);
    } else if (offset.y > 50 && isExpanded) {
      setIsExpanded(false);
    }
  };

  // Filter items based on crisis mode
  const visibleItems = crisisMode 
    ? navItems.filter(item => item.crisisAccess || item.priority === 'high')
    : navItems;

  // Sort items by priority for crisis situations
  const sortedItems = crisisMode 
    ? [...visibleItems].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
    : visibleItems;

  return (
    <>
      {/* Bottom Tab Bar - Always Visible */}
      <nav 
        className={`fixed bottom-0 left-0 right-0 z-40 ${className}`}
        style={{
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}
      >
        {/* Main Tab Bar */}
        <div className="sanctuary-glass border-t border-sage-200 backdrop-blur-lg">
          <div className="px-2 py-2">
            <div className="flex justify-around items-center">
              {sortedItems.slice(0, oneHandedMode ? 4 : 5).map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigate(item)}
                  className={`
                    sanctuary-touch-base flex flex-col items-center justify-center
                    rounded-lg transition-all duration-200 relative overflow-hidden
                    ${activeTab === item.id 
                      ? 'bg-sage-100 text-sage-700' 
                      : 'text-sage-500 hover:text-sage-600 hover:bg-sage-50'
                    }
                    ${crisisMode && item.crisisAccess ? 'ring-2 ring-crisis-red ring-opacity-50' : ''}
                    ${crisisMode ? 'sanctuary-touch-crisis' : ''}
                  `}
                  whileHover={!batterySaver ? { scale: 1.05 } : {}}
                  whileTap={!batterySaver ? { scale: 0.95 } : {}}
                  aria-label={`${item.label}: ${item.description}`}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                >
                  {/* Icon */}
                  <span className="text-xl mb-1" role="img" aria-hidden="true">
                    {item.icon}
                  </span>
                  
                  {/* Label */}
                  <span className="text-xs font-medium truncate max-w-full">
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {activeTab === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-4 h-0.5 bg-sage-500 rounded-full"
                      layoutId="activeTab"
                      initial={false}
                      style={{ x: '-50%' }}
                    />
                  )}
                  
                  {/* Crisis indicator */}
                  {crisisMode && item.crisisAccess && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-crisis-red rounded-full animate-pulse" />
                  )}
                </motion.button>
              ))}
              
              {/* More button for additional items */}
              {sortedItems.length > (oneHandedMode ? 4 : 5) && (
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`
                    sanctuary-touch-base flex flex-col items-center justify-center
                    rounded-lg transition-all duration-200
                    text-sage-500 hover:text-sage-600 hover:bg-sage-50
                    ${isExpanded ? 'bg-sage-100 text-sage-700' : ''}
                  `}
                  whileHover={!batterySaver ? { scale: 1.05 } : {}}
                  whileTap={!batterySaver ? { scale: 0.95 } : {}}
                  aria-label="More navigation options"
                  aria-expanded={isExpanded}
                >
                  <motion.span 
                    className="text-xl mb-1"
                    animate={!batterySaver ? { rotate: isExpanded ? 45 : 0 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    ⋯
                  </motion.span>
                  <span className="text-xs font-medium">More</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Swipe Indicator */}
        {sortedItems.length > (oneHandedMode ? 4 : 5) && !isExpanded && (
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDrag={handleDrag}
            className="flex justify-center py-2 cursor-grab active:cursor-grabbing"
          >
            <div className="w-12 h-1 bg-sage-300 rounded-full" />
          </motion.div>
        )}
      </nav>

      {/* Expanded Navigation Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black bg-opacity-25 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />

            {/* Expanded Menu */}
            <motion.div
              ref={navRef}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: batterySaver ? 0 : undefined
              }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh]"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDrag={handleDrag}
              style={{
                paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                paddingLeft: 'env(safe-area-inset-left)',
                paddingRight: 'env(safe-area-inset-right)'
              }}
            >
              <div className="sanctuary-glass rounded-t-sanctuary border border-sage-200 shadow-floating">
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-16 h-1 bg-sage-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 pb-4 border-b border-sage-200">
                  <h2 className="sanctuary-heading-secondary text-center">
                    Navigate Your Sanctuary
                  </h2>
                  <p className="sanctuary-body-small text-center mt-1 text-sage-600">
                    {crisisMode ? 'Crisis-safe navigation' : 'Choose your healing path'}
                  </p>
                </div>

                {/* Navigation Grid */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                  <div className="grid grid-cols-2 gap-4">
                    {sortedItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleNavigate(item)}
                        className={`
                          sanctuary-touch-sanctuary p-4 rounded-lg text-left
                          sanctuary-glass border border-sage-200
                          hover:border-sage-300 hover:shadow-gentle
                          transition-all duration-200 group
                          ${activeTab === item.id ? 'bg-sage-100 border-sage-400' : ''}
                          ${crisisMode && item.crisisAccess ? 'ring-2 ring-crisis-red ring-opacity-30' : ''}
                        `}
                        initial={!batterySaver ? { opacity: 0, y: 20 } : {}}
                        animate={!batterySaver ? { opacity: 1, y: 0 } : {}}
                        transition={!batterySaver ? { delay: index * 0.05 } : {}}
                        whileHover={!batterySaver ? { y: -2 } : {}}
                        whileTap={!batterySaver ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-start space-x-3">
                          <span 
                            className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform"
                            role="img" 
                            aria-hidden="true"
                          >
                            {item.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="sanctuary-body-text font-medium text-sage-700 group-hover:text-sage-900 truncate">
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="sanctuary-body-small text-sage-500 mt-1 line-clamp-2">
                                {item.description}
                              </div>
                            )}
                          </div>
                          
                          {/* Priority indicator */}
                          {item.priority === 'high' && (
                            <div className="w-2 h-2 bg-sage-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                          
                          {/* Crisis access indicator */}
                          {crisisMode && item.crisisAccess && (
                            <div className="w-2 h-2 bg-crisis-red rounded-full flex-shrink-0 mt-2 animate-pulse" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-sage-200">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="sanctuary-btn-secondary w-full"
                  >
                    Close Navigation
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Crisis Mode Banner */}
      {crisisMode && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-crisis-red text-white px-4 py-2 text-center text-sm font-medium">
          🆘 Crisis Mode Active - Enhanced navigation accessibility
        </div>
      )}

      {/* Battery Saver Notice */}
      {batterySaver && (
        <div className="sanctuary-battery-warning">
          ⚡ Battery Saver Mode - Navigation remains fully accessible
        </div>
      )}
    </>
  );
};

export default OneHandedSanctuaryNav;