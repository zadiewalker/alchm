import { type CSSProperties } from 'react';
import type { TabIconProps } from '@/types/shell';

const activeColor = 'var(--text-primary)';
const inactiveColor = 'var(--text-secondary)';

export function TabIcon({ tab, isActive }: TabIconProps): React.JSX.Element | null {
  const color = isActive ? activeColor : inactiveColor;
  const props = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    style: { transition: 'opacity 200ms ease' } as CSSProperties,
    'aria-hidden': true as const,
  };

  switch (tab) {
    case 'dashboard':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="13.5" rx="4" ry="5" stroke={color} strokeWidth="1.5" />
          <ellipse cx="12" cy="7.5" rx="2.5" ry="2" stroke={color} strokeWidth="1.5" />
          <path d="M8 11 C4 9, 3 5, 5.5 4 C7.5 3, 9 6, 8 11Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M16 11 C20 9, 21 5, 18.5 4 C16.5 3, 15 6, 16 11Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case 'containers':
      return (
        <svg {...props}>
          <rect x="3" y="8" width="18" height="12" rx="3" stroke={color} strokeWidth="1.5" />
          <rect x="6" y="5" width="12" height="3" rx="1.5" stroke={color} strokeWidth="1.5" />
          <line x1="7" y1="13" x2="17" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="7" y1="16" x2="13" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'entries':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="13" height="17" rx="2.5" stroke={color} strokeWidth="1.5" />
          <line x1="7" y1="8" x2="14" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="7" y1="11.5" x2="14" y2="11.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="7" y1="15" x2="11" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M17 16 L20 13 L21 14 L18 17 Z" fill={color} opacity="0.8" />
          <line x1="17" y1="16" x2="16" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'mirror':
      return (
        <svg {...props}>
          <circle cx="12" cy="9" r="6" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="9" r="3.5" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="12" y1="15" x2="12" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="20" x2="14" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
          <path
            d="M12 2C12.6 2 13.1 2.4 13.2 3L13.6 5C14.2 5.2 14.8 5.5 15.3 5.9L17.2 5.1C17.8 4.8 18.5 5 18.8 5.6L19.8 7.4C20.1 8 19.9 8.7 19.4 9.1L17.8 10.2C17.9 10.8 18 11.4 18 12C18 12.6 17.9 13.2 17.8 13.8L19.4 14.9C19.9 15.3 20.1 16 19.8 16.6L18.8 18.4C18.5 19 17.8 19.2 17.2 18.9L15.3 18.1C14.8 18.5 14.2 18.8 13.6 19L13.2 21C13.1 21.6 12.6 22 12 22C11.4 22 10.9 21.6 10.8 21L10.4 19C9.8 18.8 9.2 18.5 8.7 18.1L6.8 18.9C6.2 19.2 5.5 19 5.2 18.4L4.2 16.6C3.9 16 4.1 15.3 4.6 14.9L6.2 13.8C6.1 13.2 6 12.6 6 12C6 11.4 6.1 10.8 6.2 10.2L4.6 9.1C4.1 8.7 3.9 8 4.2 7.4L5.2 5.6C5.5 5 6.2 4.8 6.8 5.1L8.7 5.9C9.2 5.5 9.8 5.2 10.4 5L10.8 3C10.9 2.4 11.4 2 12 2Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
