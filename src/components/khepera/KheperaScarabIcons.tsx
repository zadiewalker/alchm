// ALCHM Khepera Scarab Icon Library
// Sacred iconography for the AI reflection guide
// Minimalist, vector-ready designs with cultural adaptations

import React from 'react';

// ===== KHEPERA ICON TYPES =====

export interface KheperaScarabProps {
  size?: number;
  mode?: 'reflective' | 'present' | 'affirming';
  culturalContext?: 'universal' | 'indigenous' | 'african_diaspora' | 'east_asian' | 'latin_american' | 'middle_eastern' | 'european';
  breathingPhase?: 'inhale' | 'pause_in' | 'exhale' | 'pause_out';
  showAura?: boolean;
  className?: string;
}

// ===== MAIN KHEPERA SCARAB ICON =====

export function KheperaScarabIcon({
  size = 80,
  mode = 'present',
  culturalContext = 'universal',
  breathingPhase = 'exhale',
  showAura = true,
  className = ''
}: KheperaScarabProps) {
  
  const getModeColor = () => {
    switch (mode) {
      case 'reflective': return '#a4b792'; // Sage
      case 'present': return '#cb997e';    // Warm terra
      case 'affirming': return '#eeddd3';  // Soft blush
      default: return '#a4b792';
    }
  };

  const getAuraOpacity = () => {
    switch (breathingPhase) {
      case 'inhale': return 0.8;
      case 'pause_in': return 0.9;
      case 'exhale': return 0.4;
      case 'pause_out': return 0.3;
      default: return 0.5;
    }
  };

  const modeColor = getModeColor();
  const auraOpacity = getAuraOpacity();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={`khepera-scarab-icon ${className}`}
      style={{ filter: `drop-shadow(0 0 8px ${modeColor}40)` }}
    >
      <defs>
        {/* Rising Sun Gradient */}
        <radialGradient id={`raisingSun-${mode}`} cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#f9f6f1" stopOpacity="0.8"/>
          <stop offset="50%" stopColor={modeColor} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={modeColor} stopOpacity="0.1"/>
        </radialGradient>

        {/* Breathing Aura Gradient */}
        <radialGradient id={`breathingAura-${mode}`} cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor={modeColor} stopOpacity={auraOpacity * 0.3}/>
          <stop offset="70%" stopColor={modeColor} stopOpacity={auraOpacity * 0.1}/>
          <stop offset="100%" stopColor={modeColor} stopOpacity="0"/>
        </radialGradient>

        {/* Scarab Body Gradient */}
        <linearGradient id={`scarabBody-${mode}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={modeColor} stopOpacity="0.9"/>
          <stop offset="50%" stopColor={modeColor} stopOpacity="0.7"/>
          <stop offset="100%" stopColor={modeColor} stopOpacity="0.8"/>
        </linearGradient>
      </defs>

      {/* Breathing Aura (if enabled) */}
      {showAura && (
        <circle 
          cx="40" 
          cy="40" 
          r="35" 
          fill={`url(#breathingAura-${mode})`}
          className="khepera-breathing-aura"
        />
      )}

      {/* Sun Rays Background */}
      <g className="sun-rays" stroke={modeColor} strokeWidth="0.8" fill="none" opacity="0.5">
        <line x1="40" y1="8" x2="40" y2="16" strokeLinecap="round" />
        <line x1="56" y1="12" x2="52" y2="18" strokeLinecap="round" />
        <line x1="68" y1="24" x2="62" y2="28" strokeLinecap="round" />
        <line x1="72" y1="40" x2="64" y2="40" strokeLinecap="round" />
        <line x1="68" y1="56" x2="62" y2="52" strokeLinecap="round" />
        <line x1="56" y1="68" x2="52" y2="62" strokeLinecap="round" />
        <line x1="40" y1="72" x2="40" y2="64" strokeLinecap="round" />
        <line x1="24" y1="68" x2="28" y2="62" strokeLinecap="round" />
        <line x1="12" y1="56" x2="18" y2="52" strokeLinecap="round" />
        <line x1="8" y1="40" x2="16" y2="40" strokeLinecap="round" />
        <line x1="12" y1="24" x2="18" y2="28" strokeLinecap="round" />
        <line x1="24" y1="12" x2="28" y2="18" strokeLinecap="round" />
      </g>

      {/* Rising Sun Circle */}
      <circle 
        cx="40" 
        cy="40" 
        r="28" 
        fill={`url(#raisingSun-${mode})`}
        className="rising-sun"
      />

      {/* Scarab Beetle Body */}
      <g className="scarab-beetle">
        {/* Scarab Head */}
        <ellipse 
          cx="40" 
          cy="28" 
          rx="9" 
          ry="7" 
          fill={`url(#scarabBody-${mode})`}
        />
        
        {/* Scarab Thorax */}
        <ellipse 
          cx="40" 
          cy="40" 
          rx="13" 
          ry="9" 
          fill={`url(#scarabBody-${mode})`}
        />
        
        {/* Scarab Abdomen Segments */}
        <ellipse 
          cx="40" 
          cy="50" 
          rx="11" 
          ry="7" 
          fill={`url(#scarabBody-${mode})`}
          opacity="0.9"
        />
        <ellipse 
          cx="40" 
          cy="57" 
          rx="8" 
          ry="5" 
          fill={`url(#scarabBody-${mode})`}
          opacity="0.8"
        />

        {/* Scarab Elytra (Wing Covers) */}
        <path 
          d="M 26 32 Q 18 22 22 40 Q 25 48 32 45 Q 36 40 32 35 Z" 
          fill={modeColor} 
          opacity="0.6"
        />
        <path 
          d="M 54 32 Q 62 22 58 40 Q 55 48 48 45 Q 44 40 48 35 Z" 
          fill={modeColor} 
          opacity="0.6"
        />

        {/* Scarab Legs */}
        <g stroke={modeColor} strokeWidth="2.5" strokeLinecap="round" fill="none">
          {/* Front legs */}
          <line x1="30" y1="32" x2="20" y2="28" />
          <line x1="50" y1="32" x2="60" y2="28" />
          
          {/* Middle legs */}
          <line x1="28" y1="40" x2="18" y2="40" />
          <line x1="52" y1="40" x2="62" y2="40" />
          
          {/* Back legs */}
          <line x1="30" y1="48" x2="20" y2="52" />
          <line x1="50" y1="48" x2="60" y2="52" />
        </g>

        {/* Scarab Antennae */}
        <g stroke={modeColor} strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M 36 24 Q 34 20 32 18" />
          <path d="M 44 24 Q 46 20 48 18" />
        </g>
      </g>

      {/* Sacred Geometry Overlay */}
      <circle 
        cx="40" 
        cy="40" 
        r="32" 
        fill="none" 
        stroke={modeColor} 
        strokeWidth="0.5" 
        opacity="0.3"
        strokeDasharray="1,2"
        className="sacred-circle"
      />

      {/* Cultural Symbol Overlay */}
      {culturalContext !== 'universal' && (
        <CulturalSymbolOverlay 
          context={culturalContext} 
          color={modeColor} 
          size={size}
        />
      )}
    </svg>
  );
}

// ===== CULTURAL SYMBOL OVERLAYS =====

interface CulturalSymbolOverlayProps {
  context: string;
  color: string;
  size: number;
}

function CulturalSymbolOverlay({ context, color, size }: CulturalSymbolOverlayProps) {
  const symbolSize = size * 0.15; // 15% of main icon size
  
  switch (context) {
    case 'indigenous':
      return (
        <g className="cultural-overlay indigenous" opacity="0.4">
          {/* Medicine wheel points */}
          <circle cx="40" cy="20" r="2" fill={color} />
          <circle cx="60" cy="40" r="2" fill={color} />
          <circle cx="40" cy="60" r="2" fill={color} />
          <circle cx="20" cy="40" r="2" fill={color} />
        </g>
      );
      
    case 'african_diaspora':
      return (
        <g className="cultural-overlay african-diaspora" opacity="0.4">
          {/* Adinkra-inspired symbols */}
          <path 
            d="M 40 15 L 42 20 L 40 25 L 38 20 Z" 
            fill={color}
          />
          <path 
            d="M 65 40 L 60 42 L 55 40 L 60 38 Z" 
            fill={color}
          />
        </g>
      );
      
    case 'east_asian':
      return (
        <g className="cultural-overlay east-asian" opacity="0.4">
          {/* Yin-yang inspired curves */}
          <path 
            d="M 40 15 Q 45 20 40 25 Q 35 20 40 15" 
            fill="none" 
            stroke={color} 
            strokeWidth="1"
          />
        </g>
      );
      
    case 'latin_american':
      return (
        <g className="cultural-overlay latin-american" opacity="0.4">
          {/* Feathered serpent inspired elements */}
          <path 
            d="M 38 15 Q 40 18 42 15 Q 40 12 38 15" 
            fill={color}
          />
        </g>
      );
      
    default:
      return null;
  }
}

// ===== SIMPLIFIED KHEPERA ICONS =====

export function KheperaMinimalIcon({ 
  size = 24, 
  mode = 'present',
  className = '' 
}: Omit<KheperaScarabProps, 'breathingPhase' | 'showAura' | 'culturalContext'>) {
  
  const getModeColor = () => {
    switch (mode) {
      case 'reflective': return '#a4b792';
      case 'present': return '#cb997e';
      case 'affirming': return '#eeddd3';
      default: return '#a4b792';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`khepera-minimal-icon ${className}`}
    >
      {/* Simplified scarab silhouette */}
      <path
        d="M12 4c-2 0-4 1-4 3v2c0 1 1 2 2 2h4c1 0 2-1 2-2V7c0-2-2-3-4-3z"
        fill={getModeColor()}
        opacity="0.8"
      />
      <ellipse
        cx="12"
        cy="15"
        rx="3"
        ry="4"
        fill={getModeColor()}
        opacity="0.7"
      />
      
      {/* Rising sun behind */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke={getModeColor()}
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}

// ===== KHEPERA LOADING SPINNER =====

export function KheperaLoadingSpinner({ 
  size = 40,
  mode = 'present',
  className = ''
}: Omit<KheperaScarabProps, 'breathingPhase' | 'showAura' | 'culturalContext'>) {
  
  const getModeColor = () => {
    switch (mode) {
      case 'reflective': return '#a4b792';
      case 'present': return '#cb997e';
      case 'affirming': return '#eeddd3';
      default: return '#a4b792';
    }
  };

  return (
    <div className={`khepera-loading-spinner ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className="animate-spin"
        style={{ animationDuration: '3s' }}
      >
        {/* Scarab body (static) */}
        <ellipse
          cx="20"
          cy="20"
          rx="6"
          ry="8"
          fill={getModeColor()}
          opacity="0.8"
        />
        
        {/* Rotating sun rays */}
        <g className="sun-rays" stroke={getModeColor()} strokeWidth="2" fill="none" opacity="0.6">
          <line x1="20" y1="5" x2="20" y2="10" strokeLinecap="round" />
          <line x1="30" y1="8" x2="27" y2="12" strokeLinecap="round" />
          <line x1="35" y1="20" x2="30" y2="20" strokeLinecap="round" />
          <line x1="30" y1="32" x2="27" y2="28" strokeLinecap="round" />
          <line x1="20" y1="35" x2="20" y2="30" strokeLinecap="round" />
          <line x1="10" y1="32" x2="13" y2="28" strokeLinecap="round" />
          <line x1="5" y1="20" x2="10" y2="20" strokeLinecap="round" />
          <line x1="10" y1="8" x2="13" y2="12" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// ===== KHEPERA PRESENCE INDICATOR =====

export function KheperaPresenceIndicator({
  mode = 'present',
  isActive = true,
  size = 12,
  className = ''
}: {
  mode?: 'reflective' | 'present' | 'affirming';
  isActive?: boolean;
  size?: number;
  className?: string;
}) {
  
  const getModeColor = () => {
    switch (mode) {
      case 'reflective': return '#a4b792';
      case 'present': return '#cb997e';
      case 'affirming': return '#eeddd3';
      default: return '#a4b792';
    }
  };

  return (
    <div className={`khepera-presence-indicator ${className}`}>
      <svg width={size} height={size} viewBox="0 0 12 12">
        <circle
          cx="6"
          cy="6"
          r="4"
          fill={getModeColor()}
          opacity={isActive ? 0.8 : 0.3}
          className={isActive ? 'animate-pulse' : ''}
        />
        <circle
          cx="6"
          cy="6"
          r="2"
          fill={getModeColor()}
          opacity={isActive ? 1 : 0.5}
        />
      </svg>
    </div>
  );
}

// ===== CULTURAL ADAPTATION ICONS =====

export function KheperaCulturalIcon({
  culturalContext,
  size = 32,
  className = ''
}: {
  culturalContext: string;
  size?: number;
  className?: string;
}) {
  
  const iconVariants = {
    indigenous: {
      icon: "🦅",
      colors: ["#8B4513", "#DAA520"]
    },
    african_diaspora: {
      icon: "🌍", 
      colors: ["#228B22", "#FFD700"]
    },
    east_asian: {
      icon: "☯️",
      colors: ["#000000", "#FFFFFF"]
    },
    latin_american: {
      icon: "🌺",
      colors: ["#FF6347", "#FFD700"]
    }
  };
  
  const variant = iconVariants[culturalContext as keyof typeof iconVariants];
  
  if (!variant) {
    return <KheperaScarabIcon size={size} className={className} />;
  }
  
  return (
    <div 
      className={`khepera-cultural-icon ${className}`}
      style={{ fontSize: size }}
    >
      {variant.icon}
    </div>
  );
}

// ===== EXPORT DEFAULT =====

export default KheperaScarabIcon;