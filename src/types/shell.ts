import type { ReactNode } from 'react';

export type TabId = 'dashboard' | 'containers' | 'entries' | 'mirror' | 'settings';

export type TabIconProps = {
  tab: TabId;
  isActive: boolean;
};

export type PageHeaderProps = {
  title: string;
  onBack?: () => void;
  rightElement?: ReactNode;
};

export type CrisisFooterProps = {
  onPress: () => void;
};

export type CrisisModalProps = {
  onClose: () => void;
};

export type AppShellProps = {
  children: ReactNode;
};

export type RootClientShellProps = {
  children: ReactNode;
};
