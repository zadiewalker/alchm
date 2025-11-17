'use client';

import { motion } from 'framer-motion';

interface AlchmScarabProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Sacred ALCHM Scarab - Symbol of Transformation
 * Based on the terracotta/charcoal design philosophy from ALCHM Technical Overview
 * Represents the ancient Egyptian symbol of rebirth and healing
 */
export default function AlchmScarab({ 
  size = 80, 
  className = '',
  animate = true 
}: AlchmScarabProps) {
  const scarabVariants = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      rotateY: -15 
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing curve
        delay: 0.1
      }
    },
    breathe: {
      scale: [0.98, 1.02, 0.98],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <motion.div
      className={`sacred-scarab ${className}`}
      style={{
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 16px rgba(164, 183, 146, 0.15))'
      }}
      initial="initial"
      animate={animate ? ["visible", "breathe"] : "visible"}
      variants={scarabVariants}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient Definitions */}
        <defs>
          <radialGradient id="scarabBody" cx="40" cy="30" r="25">
            <stop offset="0%" stopColor="#cb997e" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#a4b792" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2e2e2e" stopOpacity="0.7" />
          </radialGradient>
          
          <radialGradient id="scarabShell" cx="40" cy="40" r="20">
            <stop offset="0%" stopColor="#f7f7f2" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#a4b792" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2e2e2e" stopOpacity="0.8" />
          </radialGradient>

          <linearGradient id="scarabLegs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e2e2e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a4b792" stopOpacity="0.6" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Sacred Aura - Subtle energy field */}
        <circle
          cx="40"
          cy="40"
          r="38"
          fill="none"
          stroke="#a4b792"
          strokeWidth="0.5"
          strokeDasharray="2,4"
          opacity="0.3"
          className="animate-pulse"
        />

        {/* Scarab Body - Main thorax */}
        <ellipse
          cx="40"
          cy="35"
          rx="16"
          ry="20"
          fill="url(#scarabBody)"
          filter="url(#glow)"
        />

        {/* Scarab Head - Protective crown */}
        <ellipse
          cx="40"
          cy="22"
          rx="8"
          ry="6"
          fill="url(#scarabShell)"
        />

        {/* Wing Cases - Sacred protection */}
        <ellipse
          cx="32"
          cy="35"
          rx="6"
          ry="14"
          fill="url(#scarabShell)"
          opacity="0.8"
        />
        <ellipse
          cx="48"
          cy="35"
          rx="6"
          ry="14"
          fill="url(#scarabShell)"
          opacity="0.8"
        />

        {/* Abdomen - Lower body */}
        <ellipse
          cx="40"
          cy="48"
          rx="10"
          ry="8"
          fill="url(#scarabBody)"
          opacity="0.9"
        />

        {/* Legs - Six sacred limbs */}
        {/* Front legs */}
        <line x1="32" y1="28" x2="24" y2="24" stroke="url(#scarabLegs)" strokeWidth="2" strokeLinecap="round" />
        <line x1="48" y1="28" x2="56" y2="24" stroke="url(#scarabLegs)" strokeWidth="2" strokeLinecap="round" />
        
        {/* Middle legs */}
        <line x1="28" y1="35" x2="18" y2="35" stroke="url(#scarabLegs)" strokeWidth="2" strokeLinecap="round" />
        <line x1="52" y1="35" x2="62" y2="35" stroke="url(#scarabLegs)" strokeWidth="2" strokeLinecap="round" />
        
        {/* Hind legs */}
        <line x1="32" y1="42" x2="24" y2="48" stroke="url(#scarabLegs)" strokeWidth="2" strokeLinecap="round" />
        <line x1="48" y1="42" x2="56" y2="48" stroke="url(#scarabLegs)" strokeWidth="2" strokeLinecap="round" />

        {/* Antennae - Sensing the sacred */}
        <path
          d="M 38 18 Q 36 14 34 12"
          stroke="#2e2e2e"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 42 18 Q 44 14 46 12"
          stroke="#2e2e2e"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Sacred markings - Divine patterns */}
        <circle cx="40" cy="30" r="2" fill="#f7f7f2" opacity="0.6" />
        <ellipse cx="40" cy="38" rx="4" ry="2" fill="#f7f7f2" opacity="0.4" />
        <ellipse cx="40" cy="44" rx="3" ry="1.5" fill="#f7f7f2" opacity="0.3" />

        {/* Transformation symbols - Ancient wisdom */}
        <circle cx="36" cy="32" r="1" fill="#cb997e" opacity="0.7" />
        <circle cx="44" cy="32" r="1" fill="#cb997e" opacity="0.7" />
        <circle cx="40" cy="35" r="0.5" fill="#eeddd3" opacity="0.8" />
      </svg>
    </motion.div>
  );
}

// Breathing animation keyframes for CSS fallback
export const scarabStyles = `
  .sacred-scarab {
    transform-origin: center center;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .sacred-scarab {
      animation: none !important;
    }
    .sacred-scarab * {
      animation: none !important;
    }
  }
  
  @keyframes gentle-float {
    0%, 100% { 
      transform: translateY(0px) scale(0.98); 
    }
    50% { 
      transform: translateY(-3px) scale(1.02); 
    }
  }
  
  .animate-gentle-float {
    animation: gentle-float 4s ease-in-out infinite;
  }
`;