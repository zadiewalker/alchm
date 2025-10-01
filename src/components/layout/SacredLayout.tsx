/**
 * Sacred Layout - Jony Ive Design System
 * The invisible framework that holds the healing space
 */
'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SacredLayoutProps {
  children: ReactNode;
  variant?: 'sanctuary' | 'focus' | 'crisis';
  showBackground?: boolean;
  className?: string;
}

export function SacredLayout({ 
  children, 
  variant = 'sanctuary', 
  showBackground = true,
  className = '' 
}: SacredLayoutProps) {
  const layoutVariants = {
    sanctuary: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    focus: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    crisis: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`sacred-layout ${variant} ${className}`}>
      {/* Sacred Background */}
      {showBackground && (
        <div className="sacred-background animate-breathing" />
      )}
      
      {/* Main Content Container */}
      <motion.main
        className="sacred-main sanctuary-container"
        {...layoutVariants[variant]}
      >
        {children}
      </motion.main>
      
      {/* Sacred Ambient Elements */}
      <div className="sacred-ambient">
        <div className="ambient-glow animate-sanctuary-float" />
        <div className="ambient-glow animate-sanctuary-float animation-delay-2000" />
        <div className="ambient-glow animate-sanctuary-float animation-delay-3000" />
      </div>
    </div>
  );
}

// Sacred Navigation Component
interface SacredNavProps {
  variant?: 'minimal' | 'full';
  showCrisisButton?: boolean;
}

export function SacredNav({ variant = 'minimal', showCrisisButton = true }: SacredNavProps) {
  return (
    <motion.nav 
      className="sacred-nav sanctuary-glass"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="sanctuary-container">
        <div className="sanctuary-flex sanctuary-flex--between">
          {/* Sacred Logo */}
          <motion.div 
            className="sacred-logo"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-large font-light tracking-tight text-sanctuary">
              ALCHM
            </span>
          </motion.div>
          
          {/* Sacred Navigation Items */}
          {variant === 'full' && (
            <div className="sacred-nav-items sanctuary-flex">
              <SacredNavItem href="/journal" label="Journal" />
              <SacredNavItem href="/dashboard" label="Insights" />
              <SacredNavItem href="/pathways" label="Pathways" />
            </div>
          )}
          
          {/* Crisis Support Button */}
          {showCrisisButton && (
            <motion.button
              className="alchm-button alchm-button--crisis"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Emergency Support"
            >
              Crisis Support
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

// Sacred Navigation Item
interface SacredNavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
}

function SacredNavItem({ href, label, isActive = false }: SacredNavItemProps) {
  return (
    <motion.a
      href={href}
      className={`sacred-nav-item ${isActive ? 'active' : ''}`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-base font-normal text-sanctuary">
        {label}
      </span>
    </motion.a>
  );
}