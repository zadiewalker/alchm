'use client';

import { motion } from 'framer-motion';

interface SacredCrisisScarabProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Sacred Crisis Scarab - Crisis Mode Variant
 * 
 * Modified version of the ALCHM Scarab for crisis situations:
 * - Sage Green solar disc (calming, not terracotta)
 * - Softer, slightly closed wings (protective posture)
 * - Slower, deeper breathing animation (5-second cycle)
 * - Gentle glow for comfort in dark moments
 */
export default function SacredCrisisScarab({ 
  size = 96, 
  className = '',
  animate = true 
}: SacredCrisisScarabProps) {
  const crisisScarabVariants = {
    initial: { 
      scale: 0.9, 
      opacity: 0,
      rotateY: -10 
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2
      }
    },
    breathe: {
      scale: [0.97, 1.0, 0.97],
      transition: {
        duration: 5, // Slower, deeper breathing for crisis
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <motion.div
      className={`sacred-crisis-scarab ${className}`}
      style={{
        width: size,
        height: size,
        filter: 'drop-shadow(0 12px 24px rgba(164, 183, 146, 0.25))' // Soft sage glow
      }}
      initial="initial"
      animate={animate ? ["visible", "breathe"] : "visible"}
      variants={crisisScarabVariants}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient Definitions - Crisis Mode */}
        <defs>
          <radialGradient id="crisisScarabBody" cx="48" cy="36" r="30">
            <stop offset="0%" stopColor="#a4b792" stopOpacity="0.9" /> {/* Sage green, not terracotta */}
            <stop offset="50%" stopColor="#93a682" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2e2e2e" stopOpacity="0.7" />
          </radialGradient>
          
          <radialGradient id="crisisScarabShell" cx="48" cy="48" r="24">
            <stop offset="0%" stopColor="#f7f7f2" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#a4b792" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2e2e2e" stopOpacity="0.8" />
          </radialGradient>

          <linearGradient id="crisisScarabLegs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e2e2e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a4b792" stopOpacity="0.6" />
          </linearGradient>

          <filter id="crisisGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Sacred Aura - Protective energy field */}
        <circle
          cx="48"
          cy="48"
          r="45"
          fill="none"
          stroke="#a4b792"
          strokeWidth="0.8"
          strokeDasharray="3,6"
          opacity="0.4"
          className="animate-pulse"
        />

        {/* Scarab Body - Main thorax (protective) */}
        <ellipse
          cx="48"
          cy="42"
          rx="19"
          ry="24"
          fill="url(#crisisScarabBody)"
          filter="url(#crisisGlow)"
        />

        {/* Scarab Head - Gentle crown */}
        <ellipse
          cx="48"
          cy="26"
          rx="9"
          ry="7"
          fill="url(#crisisScarabShell)"
        />

        {/* Wing Cases - Protective, slightly closed position */}
        <ellipse
          cx="38"
          cy="42"
          rx="7"
          ry="16"
          fill="url(#crisisScarabShell)"
          opacity="0.9"
          transform="rotate(-5 38 42)"
        />
        <ellipse
          cx="58"
          cy="42"
          rx="7"
          ry="16"
          fill="url(#crisisScarabShell)"
          opacity="0.9"
          transform="rotate(5 58 42)"
        />

        {/* Abdomen - Lower body */}
        <ellipse
          cx="48"
          cy="58"
          rx="12"
          ry="9"
          fill="url(#crisisScarabBody)"
          opacity="0.95"
        />

        {/* Legs - Six grounding limbs */}
        {/* Front legs */}
        <line x1="38" y1="34" x2="29" y2="29" stroke="url(#crisisScarabLegs)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="34" x2="67" y2="29" stroke="url(#crisisScarabLegs)" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Middle legs */}
        <line x1="33" y1="42" x2="21" y2="42" stroke="url(#crisisScarabLegs)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="63" y1="42" x2="75" y2="42" stroke="url(#crisisScarabLegs)" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Hind legs */}
        <line x1="38" y1="50" x2="29" y2="57" stroke="url(#crisisScarabLegs)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="50" x2="67" y2="57" stroke="url(#crisisScarabLegs)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Antennae - Gentle sensing */}
        <path
          d="M 46 22 Q 43 17 41 14"
          stroke="#2e2e2e"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 50 22 Q 53 17 55 14"
          stroke="#2e2e2e"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Sacred markings - Calming patterns */}
        <circle cx="48" cy="36" r="2.4" fill="#f7f7f2" opacity="0.7" />
        <ellipse cx="48" cy="46" rx="4.8" ry="2.4" fill="#f7f7f2" opacity="0.5" />
        <ellipse cx="48" cy="53" rx="3.6" ry="1.8" fill="#f7f7f2" opacity="0.4" />

        {/* Transformation symbols - Healing wisdom */}
        <circle cx="43" cy="38" r="1.2" fill="#a4b792" opacity="0.8" />
        <circle cx="53" cy="38" r="1.2" fill="#a4b792" opacity="0.8" />
        <circle cx="48" cy="42" r="0.6" fill="#eeddd3" opacity="0.9" />
      </svg>
    </motion.div>
  );
}

// Crisis breathing animation styles
export const crisisScarabStyles = `
  .sacred-crisis-scarab {
    transform-origin: center center;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .sacred-crisis-scarab {
      animation: none !important;
    }
    .sacred-crisis-scarab * {
      animation: none !important;
    }
  }
  
  @keyframes gentle-crisis-float {
    0%, 100% { 
      transform: translateY(0px) scale(0.97); 
    }
    50% { 
      transform: translateY(-4px) scale(1.0); 
    }
  }
  
  .animate-gentle-crisis-float {
    animation: gentle-crisis-float 5s ease-in-out infinite;
  }
`;