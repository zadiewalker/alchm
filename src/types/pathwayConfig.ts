// src/types/pathwayConfig.ts

export interface PathwayConfig {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  gradient: string[];
  headerAnimation: string;
  layoutComponent: string;
  systemPrompt: string;
  affirmation: string;
}

export type PathwayConfigMap = Record<string, PathwayConfig>;
