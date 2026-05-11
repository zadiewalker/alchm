export interface QuickTemplate {
  id: string;
  title: string;
  prompt: string;
  icon: string;
}

export interface QuickStartTemplatesProps {
  onTemplateSelect: (template: QuickTemplate) => void;
  selectedMood?: string;
}

export interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  selectedMood?: string;
  onClear?: () => void;
}

export interface DashboardThresholdCardProps {
  activeContainer?: unknown;
  sessionCount: number;
  showCheckIn: boolean;
  reflectionSummary: unknown;
}
