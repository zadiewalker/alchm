import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import type { BackNavigationConfig } from '@/types/navigation';

export type AppLayoutProps = {
  children: ReactNode;
  header?: ReactNode;
  showCrisisFooter?: boolean;
  noPadding?: boolean;
  variant?: 'sanctuary' | 'surface' | 'elevated' | 'warm';
  className?: string;
};

export type TextVariant =
  | 'display'
  | 'title'
  | 'label'
  | 'whisper'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'secondary'
  | 'caption'
  | 'muted'
  | 'subtle'
  | 'khepera'
  | 'kheperaWitness'
  | 'kheperaPerspective'
  | 'kheperaSeed';

export type AppTextProps = {
  variant?: TextVariant;
  children: ReactNode;
  style?: CSSProperties;
  as?: ElementType;
  className?: string;
};

export type LoadingStateProps = {
  message?: string;
  variant?: 'page' | 'inline' | 'khepera';
};

export type ErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  variant?: 'page' | 'inline' | 'api';
};

export type UpgradePromptProps = {
  feature: string;
  message: string;
  recommendedTier: 'sanctuary' | 'transformation';
  onClose?: () => void;
};

export type EmptyStateProps = {
  screen?: 'journal' | 'mirror' | 'insights' | 'containers' | 'generic';
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

type AppHeaderBaseProps = {
  title?: string;
  children?: ReactNode;
  rightAction?: ReactNode;
  variant?: 'default' | 'transparent';
};

export type AppHeaderProps =
  | (AppHeaderBaseProps & {
      showBack: true;
      backNavigation: BackNavigationConfig;
    })
  | (AppHeaderBaseProps & {
      showBack?: false;
      backNavigation?: never;
    });

export type AppCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: 'standard' | 'elevated' | 'warm' | 'sacred' | 'khepera' | 'ritual' | 'system' | 'empty';
  elevated?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
};
