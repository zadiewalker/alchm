// ALCHM Custom Icons - No stock emojis allowed
// Each icon follows Jony Ive principles: essential form, purposeful design

import React from 'react';

export const colors = {
  sage: '#a4b792',
  sageDark: '#8fa07d',
  sageLight: '#c8d4bc',
  terracotta: '#cb997e',
  charcoal: '#2e2e2e',
  offWhite: '#f7f7f2',
  warmGray: '#e8e6e1',
};

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Scarab Icon - Primary brand icon
export const ScarabIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.sage 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <circle cx="12" cy="9" r="4" fill={color} opacity="0.9"/>
    <ellipse cx="12" cy="15" rx="6" ry="8" fill={color}/>
    <path d="M6 11 Q4 12 5 16 Q6 14 6 16" fill={color} opacity="0.8"/>
    <path d="M18 11 Q20 12 19 16 Q18 14 18 16" fill={color} opacity="0.8"/>
  </svg>
);

// Journal Icon - for entry counts
export const JournalIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.sage 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <path d="M8 7h8"/>
    <path d="M8 11h8"/>
    <path d="M8 15h5"/>
  </svg>
);

// Flame Icon - for streaks
export const FlameIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.terracotta 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
    className={className}
  >
    <path d="M12 2c3.866 0 7 3.134 7 7 0 5.523-4.477 10-10 10S6 14.523 6 9c0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.105-.895 2-2 2s-2-.895-2-2"/>
    <path d="M12 15c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" fill={colors.sage}/>
  </svg>
);

// Calendar Icon - for monthly stats
export const CalendarIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.sage 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <rect x="7" y="14" width="2" height="2" fill={color}/>
    <rect x="11" y="14" width="2" height="2" fill={color}/>
    <rect x="15" y="14" width="2" height="2" fill={color}/>
  </svg>
);

// Pathway Icon - for pathways count
export const PathwayIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.sage 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    className={className}
  >
    <circle cx="6" cy="6" r="3"/>
    <circle cx="18" cy="18" r="3"/>
    <path d="M8.5 8.5 L15.5 15.5"/>
    <circle cx="18" cy="6" r="2" fill={color} opacity="0.3"/>
    <circle cx="6" cy="18" r="2" fill={color} opacity="0.3"/>
  </svg>
);

// Seedling Icon - for growth/resilience pathways
export const SeedlingIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.sage 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
    className={className}
  >
    <path d="M12 22V12" stroke={color} strokeWidth="2"/>
    <path d="M12 8C8 8 8 4 8 4s0 4-4 4c4 0 4 4 4 4s0-4 4-4z" fill={colors.terracotta} opacity="0.7"/>
    <path d="M12 16c4 0 4-4 4-4s0 4 4 4c-4 0-4-4-4-4s0 4-4 4z" fill={color}/>
  </svg>
);

// Compass Icon - for navigation pathways
export const CompassIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.sage 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    className={className}
  >
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" fill={color}/>
    <circle cx="12" cy="12" r="2" fill={colors.terracotta}/>
  </svg>
);

// Heart Icon - for relationship pathways
export const HeartIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.terracotta 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
    className={className}
  >
    <path d="M12 21C7 16 2 12 2 8c0-3 2-5 5-5 2 0 3 1 5 3 2-2 3-3 5-3 3 0 5 2 5 5 0 4-5 8-10 13z"/>
  </svg>
);

// CheckCircle Icon - for completed items
export const CheckCircleIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.sage 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill={color} opacity="0.1"/>
    <path d="m9 12 2 2 4-4" stroke={color} fill="none"/>
  </svg>
);

// Milestone Icon - for achievements
export const MilestoneIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.terracotta 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    className={className}
  >
    <path d="M12 3v18"/>
    <path d="M8 5h8l2 2-2 2H8z" fill={color}/>
    <circle cx="12" cy="19" r="2" fill={color}/>
  </svg>
);

// Level Icon - for progress/XP
export const LevelIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.sage 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M8 14l2-2 2 2 4-4" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="8" r="2" fill={colors.terracotta}/>
  </svg>
);

// Arrow Right - for navigation
export const ArrowRightIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.charcoal 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    className={className}
  >
    <path d="M5 12h14"/>
    <path d="M12 5l7 7-7 7"/>
  </svg>
);

// Lock Icon - for locked content
export const LockIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.warmGray 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// Time Icon - for time patterns
export const TimeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  color = colors.sage 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    className={className}
  >
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);