/*
 * ALCHM Cultural Icon System
 * Universal healing symbols that resonate across cultures
 * Avoiding appropriation while honoring diverse wisdom traditions
 */

import React from 'react';

interface IconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'sage' | 'terracotta' | 'blush' | 'neutral';
  className?: string;
  'aria-label'?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  sage: 'text-sage-600',
  terracotta: 'text-terracotta-500',
  blush: 'text-blush-500',
  neutral: 'text-gray-600'
};

// Universal Growth & Healing Symbols
export const GrowthIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'sage', 
  className = '',
  'aria-label': ariaLabel = 'Growth and healing'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M12 2L13.5 6.5L18 8L13.5 9.5L12 14L10.5 9.5L6 8L10.5 6.5L12 2Z" opacity="0.8"/>
    <path d="M4 14L5 16L7 17L5 18L4 20L3 18L1 17L3 16L4 14Z" opacity="0.6"/>
    <path d="M19 4L19.5 5.5L21 6L19.5 6.5L19 8L18.5 6.5L17 6L18.5 5.5L19 4Z" opacity="0.6"/>
    <circle cx="12" cy="12" r="1" opacity="1"/>
  </svg>
);

// Universal Community Connection
export const CommunityIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'terracotta', 
  className = '',
  'aria-label': ariaLabel = 'Community connection'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <circle cx="9" cy="7" r="4" strokeWidth="2"/>
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeWidth="2"/>
    <circle cx="17" cy="11" r="3" strokeWidth="2"/>
    <path d="M21 21v-1a3 3 0 0 0-3-3l-1 0" strokeWidth="2"/>
  </svg>
);

// Universal Self-Compassion
export const SelfCompassionIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'blush', 
  className = '',
  'aria-label': ariaLabel = 'Self-compassion and care'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity="0.7"/>
    <circle cx="12" cy="12" r="2" opacity="1"/>
  </svg>
);

// Universal Wisdom & Learning
export const WisdomIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'sage', 
  className = '',
  'aria-label': ariaLabel = 'Wisdom and learning'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2"/>
  </svg>
);

// Universal Protection & Safety
export const ProtectionIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'sage', 
  className = '',
  'aria-label': ariaLabel = 'Protection and safety'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/>
    <path d="M9 12l2 2 4-4" strokeWidth="2"/>
  </svg>
);

// Universal Breath & Mindfulness
export const BreathIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'blush', 
  className = '',
  'aria-label': ariaLabel = 'Breath and mindfulness'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M8 12a4 4 0 1 0 8 0v-1a4 4 0 1 0-8 0v1z" strokeWidth="2" opacity="0.6"/>
    <path d="M12 12v7a2 2 0 1 0 4 0 2 2 0 1 0 4 0v-4" strokeWidth="2" opacity="0.8"/>
    <circle cx="12" cy="8" r="3" strokeWidth="2" opacity="1"/>
  </svg>
);

// Universal Nature Connection
export const NatureIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'sage', 
  className = '',
  'aria-label': ariaLabel = 'Nature connection'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M12 22l-1-3H9l.5-2h5l.5 2h-2l-1 3z" opacity="0.8"/>
    <path d="M12 2c-4 0-6 3-6 6 0 1.5.5 3 1.5 4.5.5.75 1 1.5 1.5 2.5h6c.5-1 1-1.75 1.5-2.5C17.5 11 18 9.5 18 8c0-3-2-6-6-6z" opacity="0.9"/>
    <circle cx="10" cy="7" r="1" opacity="1"/>
    <circle cx="14" cy="9" r="1" opacity="1"/>
  </svg>
);

// Universal Movement & Expression
export const MovementIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'terracotta', 
  className = '',
  'aria-label': ariaLabel = 'Movement and expression'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M8 4v8l6-4-6-4z" strokeWidth="2" opacity="0.8"/>
    <path d="M12 12v8l6-4-6-4z" strokeWidth="2" opacity="0.6"/>
    <circle cx="6" cy="8" r="2" strokeWidth="2" opacity="1"/>
    <circle cx="18" cy="16" r="2" strokeWidth="2" opacity="1"/>
  </svg>
);

// Universal Art & Creativity
export const CreativityIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'blush', 
  className = '',
  'aria-label': ariaLabel = 'Art and creativity'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2"/>
  </svg>
);

// Universal Story & Narrative
export const StoryIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'terracotta', 
  className = '',
  'aria-label': ariaLabel = 'Story and narrative'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2"/>
    <polyline points="14,2 14,8 20,8" strokeWidth="2"/>
    <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2"/>
    <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2"/>
    <polyline points="10,9 9,9 8,9" strokeWidth="2"/>
  </svg>
);

// Universal Journey & Progress
export const JourneyIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'sage', 
  className = '',
  'aria-label': ariaLabel = 'Journey and progress'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M12 2l-2 7h4l-2-7z" strokeWidth="2" opacity="1"/>
    <path d="M8 9l-2 7h4l-2-7z" strokeWidth="2" opacity="0.8"/>
    <path d="M16 9l-2 7h4l-2-7z" strokeWidth="2" opacity="0.8"/>
    <path d="M4 16l-2 6h4l-2-6z" strokeWidth="2" opacity="0.6"/>
    <path d="M20 16l-2 6h4l-2-6z" strokeWidth="2" opacity="0.6"/>
  </svg>
);

// Cultural Relationship Type Icons
export const ChosenFamilyIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'terracotta', 
  className = '',
  'aria-label': ariaLabel = 'Chosen family'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity="0.9"/>
    <circle cx="8" cy="10" r="1.5" opacity="1"/>
    <circle cx="12" cy="8" r="1.5" opacity="1"/>
    <circle cx="16" cy="10" r="1.5" opacity="1"/>
  </svg>
);

export const SpiritualFamilyIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'blush', 
  className = '',
  'aria-label': ariaLabel = 'Spiritual family'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <circle cx="12" cy="8" r="3" strokeWidth="2"/>
    <path d="M12 11v10" strokeWidth="2"/>
    <path d="M8 15l8-8" strokeWidth="2" opacity="0.6"/>
    <path d="M16 15l-8-8" strokeWidth="2" opacity="0.6"/>
    <circle cx="12" cy="21" r="1" fill="currentColor"/>
  </svg>
);

// Healing Tradition Icons (Universal Symbols)
export const EarthMedicineIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'sage', 
  className = '',
  'aria-label': ariaLabel = 'Earth medicine'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <circle cx="12" cy="12" r="10" opacity="0.3"/>
    <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" opacity="0.7"/>
    <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" strokeWidth="2" opacity="1"/>
    <circle cx="12" cy="12" r="2" opacity="1"/>
  </svg>
);

export const WaterHealingIcon: React.FC<IconProps> = ({ 
  size = 'md', 
  color = 'blush', 
  className = '',
  'aria-label': ariaLabel = 'Water healing'
}) => (
  <svg 
    className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    fill="currentColor" 
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    role="img"
  >
    <path d="M12 2C8 6 6 10 6 13a6 6 0 0 0 12 0c0-3-2-7-6-11z" opacity="0.8"/>
    <path d="M12 6C10 8 9 10 9 12a3 3 0 0 0 6 0c0-2-1-4-3-6z" opacity="1"/>
  </svg>
);

// Cultural Icon Set Export
export const CulturalIcons = {
  Growth: GrowthIcon,
  Community: CommunityIcon,
  SelfCompassion: SelfCompassionIcon,
  Wisdom: WisdomIcon,
  Protection: ProtectionIcon,
  Breath: BreathIcon,
  Nature: NatureIcon,
  Movement: MovementIcon,
  Creativity: CreativityIcon,
  Story: StoryIcon,
  Journey: JourneyIcon,
  ChosenFamily: ChosenFamilyIcon,
  SpiritualFamily: SpiritualFamilyIcon,
  EarthMedicine: EarthMedicineIcon,
  WaterHealing: WaterHealingIcon
};

// Cultural Context Wrapper Component
interface CulturalContextProps {
  children: React.ReactNode;
  culturalContext?: 'collectivist' | 'individualist' | 'mixed';
  className?: string;
}

export const CulturalContext: React.FC<CulturalContextProps> = ({
  children,
  culturalContext = 'mixed',
  className = ''
}) => {
  return (
    <div 
      className={`cultural-context ${className}`}
      data-context={culturalContext}
    >
      {children}
    </div>
  );
};

// Healing Tradition Respect Component
interface HealingTraditionProps {
  tradition: 'nature' | 'community' | 'movement' | 'breath' | 'story' | 'art' | 'song';
  title: string;
  description: string;
  className?: string;
}

export const HealingTradition: React.FC<HealingTraditionProps> = ({
  tradition,
  title,
  description,
  className = ''
}) => {
  return (
    <div 
      className={`healing-tradition ${className}`}
      data-tradition={tradition}
    >
      <div className="healing-tradition-icon" />
      <div>
        <h4 className="cultural-heading text-base font-medium mb-1">{title}</h4>
        <p className="cultural-body text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default CulturalIcons;